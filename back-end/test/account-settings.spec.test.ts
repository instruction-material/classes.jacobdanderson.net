import { createHash } from "node:crypto";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
	exists: vi.fn(),
	findOne: vi.fn(),
	findOneAndUpdate: vi.fn(),
	updateOne: vi.fn(),
	send: vi.fn(),
	audit: vi.fn(),
	bindings: vi.fn()
}));
vi.mock("../src/models/schemas/Admin.js", () => ({ Admin: mocks }));
vi.mock("../src/models/schemas/Tutor.js", () => ({ Tutor: mocks }));
vi.mock("../src/models/schemas/User.js", () => ({ User: mocks }));
vi.mock("../src/utils/transactionalEmail.js", () => ({ sendTransactionalEmail: mocks.send }));
vi.mock("../src/utils/securityAudit.js", () => ({ recordSecurityAuditEvent: mocks.audit }));
vi.mock("../src/utils/oauthBrowserBinding.js", () => ({ clearOAuthBrowserBindings: mocks.bindings }));
const { requestEmailChange, confirmEmailChange, signOutAllSessions } = await import("../src/controllers/auth/accountSettingsController.js");

function query(value: unknown) {
	const result: any = { exec: vi.fn().mockResolvedValue(value) };
	result.select = result.lean = vi.fn().mockReturnValue(result);
	return result;
}
function response() {
	const result: any = { statusCode: 200, data: undefined };
	result.status = (code: number) => { result.statusCode = code; return result; };
	result.json = (data: unknown) => { result.data = data; return result; };
	result.sendStatus = (code: number) => { result.statusCode = code; return result; };
	return result;
}
const id = "a".repeat(24);
const token = "b".repeat(64);
const tokenHash = createHash("sha256").update(token).digest("hex");
function request(role: "Admin" | "Tutor" | "User" = "User") {
	return {
		["current" + role]: { _id: id, email: "old@example.invalid", sessionVersion: 0, comparePassword: vi.fn().mockResolvedValue(true) },
		params: { ID: id },
		body: { email: " NEW@example.invalid ", currentPassword: "synthetic-password" },
		session: { accountSessionVersion: 0 }
	} as any;
}

describe("verified account settings, synthetic delivery only", () => {
	beforeEach(() => {
		vi.resetAllMocks();
		mocks.exists.mockResolvedValue(null);
		mocks.send.mockResolvedValue({});
		mocks.updateOne.mockReturnValue(query({ modifiedCount: 1 }));
		mocks.findOneAndUpdate.mockReturnValue(query({ _id: id, sessionVersion: 1 }));
		mocks.findOne.mockReturnValue(query({ emailChange: { email: "new@example.invalid" } }));
	});
	it.each(["Admin", "Tutor", "User"] as const)("keeps the %s email active until password-authenticated verification", async role => {
		const req = request(role);
		const res = response();
		await requestEmailChange(req, res, vi.fn());
		expect(res.statusCode).toBe(202);
		expect(req["current" + role].email).toBe("old@example.invalid");
		const intent = mocks.findOneAndUpdate.mock.calls[0][1].$set;
		expect(intent).not.toHaveProperty("email");
		expect(intent.emailChange.email).toBe("new@example.invalid");
		expect(intent.emailChange.tokenHash).toMatch(/^[a-f\d]{64}$/);
		expect(intent.emailChange.expiresAt.getTime()).toBeGreaterThan(Date.now());
		expect(mocks.findOneAndUpdate.mock.invocationCallOrder[0]).toBeLessThan(mocks.send.mock.invocationCallOrder[0]);
		const url = new URL(mocks.send.mock.calls[0][0].text.split(" ")[4].split("\n")[0]);
		expect(url.pathname).toBe("/verify-email");
		expect(url.search).toBe("");
		expect(url.hash.slice(1)).toMatch(/^[a-f\d]{64}$/);
		expect(JSON.stringify(res.data)).not.toContain(intent.emailChange.tokenHash);
	});
	it("rejects a foreign account even for an administrator", async () => {
		const req = request("Admin");
		req.params.ID = "c".repeat(24);
		const res = response();
		await requestEmailChange(req, res, vi.fn());
		expect(res.statusCode).toBe(403);
		expect(mocks.send).not.toHaveBeenCalled();
	});
	it("rejects wrong passwords, malformed email and conflicting addresses before sending", async () => {
		for (const failure of ["password", "email", "conflict"]) {
			const req = request();
			if (failure === "password") req.currentUser.comparePassword.mockResolvedValue(false);
			if (failure === "email") req.body.email = "invalid";
			mocks.exists.mockResolvedValue(failure === "conflict" ? {} : null);
			const res = response();
			await requestEmailChange(req, res, vi.fn());
			expect([400, 403, 409]).toContain(res.statusCode);
		}
		expect(mocks.send).not.toHaveBeenCalled();
	});
	it("sends nothing when durable pending-change persistence fails", async () => {
		mocks.findOneAndUpdate.mockReturnValue({ exec: vi.fn().mockRejectedValue(new Error("synthetic DB failure")) });
		await expect(requestEmailChange(request(), response(), vi.fn())).rejects.toThrow();
		expect(mocks.send).not.toHaveBeenCalled();
	});
	it("clears only the failed verification intent and never changes the email", async () => {
		mocks.send.mockRejectedValue(new Error("synthetic SMTP failure"));
		const res = response();
		await requestEmailChange(request(), res, vi.fn());
		expect(res.statusCode).toBe(502);
		expect(mocks.updateOne.mock.calls[0][0]["emailChange.tokenHash"]).toMatch(/^[a-f\d]{64}$/);
		expect(mocks.updateOne.mock.calls[0][1]).toEqual({ $unset: { emailChange: 1 } });
	});
	it("atomically verifies one matching, unexpired, version-bound token and invalidates other sessions", async () => {
		const req = request();
		req.body = { token };
		const res = response();
		await confirmEmailChange(req, res, vi.fn());
		expect(res.statusCode).toBe(200);
		const filter = mocks.findOneAndUpdate.mock.calls[0][0];
		expect(filter).toMatchObject({
			_id: id, email: "old@example.invalid",
			"emailChange.tokenHash": tokenHash, "emailChange.sessionVersion": 0,
			"emailChange.originalEmail": "old@example.invalid"
		});
		expect(filter["emailChange.expiresAt"].$gt).toBeInstanceOf(Date);
		expect(mocks.findOneAndUpdate.mock.calls[0][1]).toEqual({
			$set: { email: "new@example.invalid" }, $inc: { sessionVersion: 1 }, $unset: { emailChange: 1 }
		});
		expect(req.session.accountSessionVersion).toBe(1);
		expect(mocks.send).not.toHaveBeenCalled();
	});
	it("cannot replay, reuse expired tokens, or confirm a replaced pending change", async () => {
		mocks.findOne.mockReturnValue(query(null));
		const req = request();
		req.body = { token };
		const res = response();
		await confirmEmailChange(req, res, vi.fn());
		expect(res.statusCode).toBe(400);
		expect(mocks.findOneAndUpdate).not.toHaveBeenCalled();
	});
	it("loses a concurrent confirmation race safely without a second change", async () => {
		mocks.findOneAndUpdate.mockReturnValue(query(null));
		const req = request();
		req.body = { token };
		const res = response();
		await confirmEmailChange(req, res, vi.fn());
		expect(res.statusCode).toBe(409);
		expect(req.session.accountSessionVersion).toBe(0);
	});
	it("rechecks conflicts at confirmation", async () => {
		mocks.exists.mockResolvedValue({});
		const req = request();
		req.body = { token };
		const res = response();
		await confirmEmailChange(req, res, vi.fn());
		expect(res.statusCode).toBe(409);
		expect(mocks.findOneAndUpdate).not.toHaveBeenCalled();
	});
	it.each(["Admin", "Tutor", "User"] as const)("signs out all %s sessions including this browser", async role => {
		const req = request(role);
		const res = response();
		await signOutAllSessions(req, res, vi.fn());
		expect(mocks.updateOne).toHaveBeenCalledWith({ _id: id }, { $inc: { sessionVersion: 1 }, $unset: { emailChange: 1 } });
		expect(req.session).toBeNull();
		expect(res.statusCode).toBe(200);
		expect(mocks.send).not.toHaveBeenCalled();
	});
	it("rejects unscoped reader credentials without any account mutation", async () => {
		for (const handler of [requestEmailChange, confirmEmailChange, signOutAllSessions]) {
			const res = response();
			await handler({ params: {}, body: {}, headers: { authorization: "Bearer synthetic-read-only-token" } } as any, res, vi.fn());
			expect(res.statusCode).toBe(403);
		}
		expect(mocks.updateOne).not.toHaveBeenCalled();
		expect(mocks.send).not.toHaveBeenCalled();
	});
});
