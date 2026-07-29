import type { Server } from "node:http";
import type { CustomSession } from "../src/types/session/CustomSession.js";
import cookieSession from "cookie-session";
import express from "express";
import { Types } from "mongoose";
import { beforeEach, describe, expect, it, vi } from "vitest";

const modelMocks = vi.hoisted(() => ({
	adminExists: vi.fn(),
	adminFindById: vi.fn(),
	adminFindOne: vi.fn(),
	tutorExists: vi.fn(),
	tutorFindById: vi.fn(),
	tutorFindOne: vi.fn(),
	userExists: vi.fn(),
	userFindById: vi.fn(),
	userFindOne: vi.fn()
}));

vi.mock("../src/models/schemas/Admin.js", () => ({
	Admin: {
		exists: modelMocks.adminExists,
		findById: modelMocks.adminFindById,
		findOne: modelMocks.adminFindOne
	}
}));

vi.mock("../src/models/schemas/Tutor.js", () => ({
	Tutor: {
		exists: modelMocks.tutorExists,
		findById: modelMocks.tutorFindById,
		findOne: modelMocks.tutorFindOne
	}
}));

vi.mock("../src/models/schemas/User.js", () => ({
	User: {
		exists: modelMocks.userExists,
		findById: modelMocks.userFindById,
		findOne: modelMocks.userFindOne
	}
}));

const { accountRoutes } = await import("../src/routes/accountRoutes.js");

type LoginRole = "admin" | "tutor" | "user";

interface TestLoginEntity {
	_id: Types.ObjectId;
	name: string;
	email: string;
	password: string;
	saveEdit: string;
	role: LoginRole;
	save: ReturnType<typeof vi.fn>;
	sessionVersion: number;
	comparePassword: ReturnType<typeof vi.fn>;
}

function queryWith<T>(result: T) {
	return {
		exec: vi.fn().mockResolvedValue(result)
	};
}

function makeEntity(role: LoginRole, acceptedPassword: string): TestLoginEntity {
	return {
		_id: new Types.ObjectId(),
		name: `${role} account`,
		email: "shared@example.com",
		password: `stored-${role}-password-hash`,
		saveEdit: "Edit",
		role,
		save: vi.fn().mockResolvedValue(undefined),
		sessionVersion: 0,
		comparePassword: vi.fn(async candidatePassword => candidatePassword === acceptedPassword)
	};
}

function mockAccounts({
	admin = null,
	tutor = null,
	user = null
}: {
	admin?: TestLoginEntity | null;
	tutor?: TestLoginEntity | null;
	user?: TestLoginEntity | null;
}) {
	modelMocks.adminFindOne.mockReturnValue(queryWith(admin));
	modelMocks.tutorFindOne.mockReturnValue(queryWith(tutor));
	modelMocks.userFindOne.mockReturnValue(queryWith(user));
}

function mockExistingSessionAccounts({
	admin = null,
	tutor = null,
	user = null
}: {
	admin?: TestLoginEntity | null;
	tutor?: TestLoginEntity | null;
	user?: TestLoginEntity | null;
}) {
	const matches = (
		query: Record<string, any>,
		account: TestLoginEntity | null
	) =>
		!!account
		&& query._id === account._id.toString()
		&& (
			query.sessionVersion === account.sessionVersion
			|| (
				account.sessionVersion === 0
				&& Array.isArray(query.$or)
				&& query.$or.some(
					(filter: Record<string, unknown>) =>
						filter.sessionVersion === 0
						|| (
							typeof filter.sessionVersion === "object"
							&& filter.sessionVersion !== null
							&& (filter.sessionVersion as Record<string, unknown>).$exists === false
						)
				)
			)
		);
	modelMocks.adminExists.mockImplementation(async query =>
		matches(query, admin)
			? { _id: admin._id }
			: null
	);
	modelMocks.tutorExists.mockImplementation(async query =>
		matches(query, tutor)
			? { _id: tutor._id }
			: null
	);
	modelMocks.userExists.mockImplementation(async query =>
		matches(query, user)
			? { _id: user._id }
			: null
	);
}

function sessionSnapshot(session: CustomSession) {
	return {
		adminID: session.adminID ?? null,
		courseCodeLearnerID: session.courseCodeLearnerID ?? null,
		tutorID: session.tutorID ?? null,
		userID: session.userID ?? null
	};
}

async function withAccountRoutes<T>(run: (baseUrl: string) => Promise<T>): Promise<T> {
	const app = express();
	app.use(express.json());
	app.use(cookieSession({
		name: "session",
		keys: ["auth-login-test-secret"]
	}));
	app.post("/test/session/stale-user", (req, res) => {
		const session = req.session as CustomSession;
		session.userID = "stale-user-id";
		res.sendStatus(204);
	});
	app.post("/test/session/stale-course-code", (req, res) => {
		const session = req.session as CustomSession;
		session.courseCodeLearnerID = "stale-course-code-learner-id";
		res.sendStatus(204);
	});
	app.get("/test/session", (req, res) => {
		res.json(sessionSnapshot(req.session as CustomSession));
	});
	app.use("/accounts", accountRoutes);

	const server = await new Promise<Server>(resolve => {
		const instance = app.listen({ host: "127.0.0.1", port: 0 }, () => resolve(instance));
	});
	const address = server.address();
	if (!address || typeof address === "string") {
		throw new TypeError("Test server did not bind to an IPv4 port");
	}

	try {
		return await run(`http://127.0.0.1:${address.port}`);
	} finally {
		await new Promise<void>((resolve, reject) => {
			server.close(error => {
				if (error) {
					reject(error);
					return;
				}
				resolve();
			});
		});
	}
}

function responseCookie(response: Response): string {
	return response.headers
		.getSetCookie()
		.map(cookie => cookie.split(";", 1)[0])
		.join("; ");
}

async function loginRequest(
	baseUrl: string,
	password: string,
	cookie?: string
): Promise<Response> {
	return fetch(`${baseUrl}/accounts/login`, {
		method: "POST",
		headers: {
			"content-type": "application/json",
			...(cookie ? { cookie } : {})
		},
		body: JSON.stringify({
			email: "  SHARED@EXAMPLE.COM ",
			password
		})
	});
}

async function seedStaleUserSession(baseUrl: string): Promise<string> {
	const response = await fetch(`${baseUrl}/test/session/stale-user`, { method: "POST" });
	expect(response.status).toBe(204);
	return responseCookie(response);
}

async function seedStaleCourseCodeSession(baseUrl: string): Promise<string> {
	const response = await fetch(
		`${baseUrl}/test/session/stale-course-code`,
		{ method: "POST" }
	);
	expect(response.status).toBe(204);
	return responseCookie(response);
}

describe("account login role transfer", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockAccounts({});
		mockExistingSessionAccounts({});
		modelMocks.adminFindById.mockResolvedValue(null);
		modelMocks.tutorFindById.mockResolvedValue(null);
		modelMocks.userFindById.mockResolvedValue(null);
	});

	it("does not let a stale user record shadow a tutor login with the same email", async () => {
		const admin = makeEntity("admin", "admin-password");
		const tutor = makeEntity("tutor", "tutor-password");
		const user = makeEntity("user", "old-user-password");
		mockAccounts({ admin, tutor, user });

		await withAccountRoutes(async baseUrl => {
			const response = await loginRequest(baseUrl, "tutor-password");
			const body = await response.json();

			expect(response.status).toBe(200);
			expect(body).toMatchObject({
				currentTutor: { _id: tutor._id.toString(), role: "tutor" }
			});
			expect(body).not.toHaveProperty("currentAdmin");
			expect(body).not.toHaveProperty("currentUser");
			expect(admin.comparePassword).toHaveBeenCalledWith("tutor-password");
			expect(tutor.comparePassword).toHaveBeenCalledWith("tutor-password");
			expect(user.comparePassword).not.toHaveBeenCalled();
			expect(admin.comparePassword.mock.invocationCallOrder[0])
				.toBeLessThan(tutor.comparePassword.mock.invocationCallOrder[0]);
			expect(modelMocks.adminFindOne).toHaveBeenCalledWith({ email: "shared@example.com" });
			expect(modelMocks.tutorFindOne).toHaveBeenCalledWith({ email: "shared@example.com" });
			expect(modelMocks.userFindOne).toHaveBeenCalledWith({ email: "shared@example.com" });
		});
	});

	it("continues to the tutor when a stale admin password hash is unreadable", async () => {
		const admin = makeEntity("admin", "admin-password");
		const tutor = makeEntity("tutor", "tutor-password");
		admin.comparePassword.mockRejectedValue(new Error("Invalid Argon2 hash"));
		mockAccounts({ admin, tutor });

		await withAccountRoutes(async baseUrl => {
			const response = await loginRequest(baseUrl, "tutor-password");

			expect(response.status).toBe(200);
			await expect(response.json()).resolves.toMatchObject({
				currentTutor: { _id: tutor._id.toString(), role: "tutor" }
			});
			expect(admin.comparePassword).toHaveBeenCalledOnce();
			expect(tutor.comparePassword).toHaveBeenCalledOnce();
		});
	});

	it("rejects malformed or oversized login credentials before password verification", async () => {
		const tutor = makeEntity("tutor", "tutor-password");
		mockAccounts({ tutor });

		await withAccountRoutes(async baseUrl => {
			const malformed = await fetch(`${baseUrl}/accounts/login`, {
				body: JSON.stringify({
					email: { value: "shared@example.com" },
					password: ["tutor-password"]
				}),
				headers: { "content-type": "application/json" },
				method: "POST"
			});
			const oversized = await fetch(`${baseUrl}/accounts/login`, {
				body: JSON.stringify({
					email: "shared@example.com",
					password: "x".repeat(257)
				}),
				headers: { "content-type": "application/json" },
				method: "POST"
			});

			expect(malformed.status).toBe(400);
			expect(oversized.status).toBe(400);
			expect(tutor.comparePassword).not.toHaveBeenCalled();
		});
	});

	it("replaces a stale user session with a tutor-only session after tutor login", async () => {
		const tutor = makeEntity("tutor", "tutor-password");
		mockAccounts({ tutor });

		await withAccountRoutes(async baseUrl => {
			const staleCookie = await seedStaleUserSession(baseUrl);
			const loginResponse = await loginRequest(baseUrl, "tutor-password", staleCookie);
			const tutorCookie = responseCookie(loginResponse);
			const sessionResponse = await fetch(`${baseUrl}/test/session`, {
				headers: { cookie: tutorCookie }
			});

			expect(loginResponse.status).toBe(200);
			await expect(sessionResponse.json()).resolves.toEqual({
				adminID: null,
				courseCodeLearnerID: null,
				tutorID: tutor._id.toString(),
				userID: null
			});
		});
	});

	it("clears outstanding provider-binding cookies after password login", async () => {
		const tutor = makeEntity("tutor", "tutor-password");
		mockAccounts({ tutor });

		await withAccountRoutes(async baseUrl => {
			const response = await loginRequest(baseUrl, "tutor-password");

			expect(response.status).toBe(200);
			expect(response.headers.getSetCookie()).toEqual(expect.arrayContaining([
				expect.stringContaining("classes_oauth_apple=;"),
				expect.stringContaining("classes_oauth_google=;")
			]));
		});
	});

	it("replaces a classroom code session with the selected account role", async () => {
		const tutor = makeEntity("tutor", "tutor-password");
		mockAccounts({ tutor });

		await withAccountRoutes(async baseUrl => {
			const classroomCookie = await seedStaleCourseCodeSession(baseUrl);
			const loginResponse = await loginRequest(
				baseUrl,
				"tutor-password",
				classroomCookie
			);
			const tutorCookie = responseCookie(loginResponse);
			const sessionResponse = await fetch(`${baseUrl}/test/session`, {
				headers: { cookie: tutorCookie }
			});

			expect(loginResponse.status).toBe(200);
			await expect(sessionResponse.json()).resolves.toEqual({
				adminID: null,
				courseCodeLearnerID: null,
				tutorID: tutor._id.toString(),
				userID: null
			});
		});
	});

	it("reports only tutorID from /accounts/me after tutor login", async () => {
		const tutor = makeEntity("tutor", "tutor-password");
		mockAccounts({ tutor });
		mockExistingSessionAccounts({ tutor });

		await withAccountRoutes(async baseUrl => {
			const staleCookie = await seedStaleUserSession(baseUrl);
			const loginResponse = await loginRequest(baseUrl, "tutor-password", staleCookie);
			const tutorCookie = responseCookie(loginResponse);
			const meResponse = await fetch(`${baseUrl}/accounts/me`, {
				headers: { cookie: tutorCookie }
			});

			expect(loginResponse.status).toBe(200);
			await expect(meResponse.json()).resolves.toEqual({
				adminID: null,
				tutorID: tutor._id.toString(),
				userID: null
			});
			expect(modelMocks.tutorExists).toHaveBeenCalledWith({
				_id: tutor._id.toString(),
				$or: [
					{ sessionVersion: 0 },
					{ sessionVersion: { $exists: false } }
				]
			});
		});
	});

	it("clears stale deleted user IDs from /accounts/me after a role transfer", async () => {
		await withAccountRoutes(async baseUrl => {
			const staleCookie = await seedStaleUserSession(baseUrl);
			const meResponse = await fetch(`${baseUrl}/accounts/me`, {
				headers: { cookie: staleCookie }
			});
			const cleanedCookie = responseCookie(meResponse);
			const sessionResponse = await fetch(`${baseUrl}/test/session`, {
				headers: { cookie: cleanedCookie }
			});

			expect(meResponse.status).toBe(200);
			await expect(meResponse.json()).resolves.toEqual({
				adminID: null,
				tutorID: null,
				userID: null
			});
			await expect(sessionResponse.json()).resolves.toEqual({
				adminID: null,
				courseCodeLearnerID: null,
				tutorID: null,
				userID: null
			});
		});
	});

	it("never exposes password hashes in admin, tutor, or user login responses", async () => {
		const admin = makeEntity("admin", "admin-password");
		const tutor = makeEntity("tutor", "tutor-password");
		const user = makeEntity("user", "user-password");
		mockAccounts({ admin, tutor, user });
		const scenarios = [
			{ password: "admin-password", responseKey: "currentAdmin", hash: admin.password },
			{ password: "tutor-password", responseKey: "currentTutor", hash: tutor.password },
			{ password: "user-password", responseKey: "currentUser", hash: user.password }
		];

		await withAccountRoutes(async baseUrl => {
			for (const scenario of scenarios) {
				const response = await loginRequest(baseUrl, scenario.password);
				const responseText = await response.text();
				const body = JSON.parse(responseText) as Record<string, Record<string, unknown>>;

				expect(response.status).toBe(200);
				expect(body).toHaveProperty(scenario.responseKey);
				expect(body[scenario.responseKey]).not.toHaveProperty("password");
				expect(responseText).not.toContain(scenario.hash);
			}
		});
	});

	it("revokes older cookies while preserving the session that requested revocation", async () => {
		const user = makeEntity("user", "user-password");
		mockAccounts({ user });
		mockExistingSessionAccounts({ user });
		modelMocks.userFindById.mockResolvedValue(user);

		await withAccountRoutes(async baseUrl => {
			const loginResponse = await loginRequest(baseUrl, "user-password");
			const olderCookie = responseCookie(loginResponse);
			const revokeResponse = await fetch(
				`${baseUrl}/accounts/revoke-sessions`,
				{
					headers: { cookie: olderCookie },
					method: "POST"
				}
			);
			const currentCookie = responseCookie(revokeResponse);

			expect(revokeResponse.status).toBe(200);
			expect(user.sessionVersion).toBe(1);
			expect(user.save).toHaveBeenCalledOnce();

			const [olderSession, currentSession] = await Promise.all([
				fetch(`${baseUrl}/accounts/me`, {
					headers: { cookie: olderCookie }
				}),
				fetch(`${baseUrl}/accounts/me`, {
					headers: { cookie: currentCookie }
				})
			]);
			await expect(olderSession.json()).resolves.toEqual({
				adminID: null,
				tutorID: null,
				userID: null
			});
			await expect(currentSession.json()).resolves.toEqual({
				adminID: null,
				tutorID: null,
				userID: user._id.toString()
			});
		});
	});

	it("normalizes email availability checks and ignores caller-supplied account IDs", async () => {
		await withAccountRoutes(async baseUrl => {
			const response = await fetch(`${baseUrl}/accounts/checkEmail`, {
				body: JSON.stringify({
					email: "  AVAILABLE@EXAMPLE.COM ",
					id: new Types.ObjectId().toString()
				}),
				headers: { "content-type": "application/json" },
				method: "POST"
			});

			expect(response.status).toBe(200);
			for (const exists of [
				modelMocks.adminExists,
				modelMocks.tutorExists,
				modelMocks.userExists
			]) {
				expect(exists).toHaveBeenCalledWith({
					email: "available@example.com"
				});
			}
		});
	});

	it("requires a live account session for email and password changes", async () => {
		await withAccountRoutes(async baseUrl => {
			const accountID = new Types.ObjectId().toString();
			const [emailResponse, passwordResponse] = await Promise.all([
				fetch(`${baseUrl}/accounts/changeEmail/${accountID}`, {
					body: JSON.stringify({ email: "new@example.com" }),
					headers: { "content-type": "application/json" },
					method: "POST"
				}),
				fetch(`${baseUrl}/accounts/changePassword/${accountID}`, {
					body: JSON.stringify({ newPassword: "new-password" }),
					headers: { "content-type": "application/json" },
					method: "POST"
				})
			]);

			expect(emailResponse.status).toBe(403);
			expect(passwordResponse.status).toBe(403);
		});
	});

	it("rejects malformed password-change values before hashing", async () => {
		const user = makeEntity("user", "user-password");
		mockAccounts({ user });
		mockExistingSessionAccounts({ user });
		modelMocks.userFindById.mockResolvedValue(user);

		await withAccountRoutes(async baseUrl => {
			const loginResponse = await loginRequest(baseUrl, "user-password");
			const cookie = responseCookie(loginResponse);
			const response = await fetch(
				`${baseUrl}/accounts/changePassword/${user._id}`,
				{
					body: JSON.stringify({
						currentPassword: ["user-password"],
						newPassword: { value: "replacement-password" }
					}),
					headers: {
						"content-type": "application/json",
						cookie
					},
					method: "POST"
				}
			);

			expect(response.status).toBe(400);
			expect(user.save).not.toHaveBeenCalled();
		});
	});
});
