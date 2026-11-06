import type { Server } from "node:http";
import { flushPromises, mount } from "@vue/test-utils";
import express from "express";
import { Types } from "mongoose";
import { createPinia, setActivePinia } from "pinia";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { api } from "@/api";
import MdMail from "@/pages/admin/mdmail.vue";

const mocks = vi.hoisted(() => ({
	admin: vi.fn(),
	tutor: vi.fn(),
	user: vi.fn(),
	notes: vi.fn(),
	post: vi.fn(),
	sendMail: vi.fn(),
	append: vi.fn()
}));
vi.mock("@/api", () => ({ api: { get: vi.fn(), post: mocks.post } }));
vi.mock("../../back-end/src/models/schemas/Admin.js", () => ({
	Admin: { findById: mocks.admin }
}));
vi.mock("../../back-end/src/models/schemas/Tutor.js", () => ({
	Tutor: { findById: mocks.tutor }
}));
vi.mock("../../back-end/src/models/schemas/User.js", () => ({
	User: { findById: mocks.user }
}));
vi.mock("../../back-end/src/models/schemas/SessionNote.js", () => ({
	SessionNote: { find: mocks.notes }
}));
vi.mock("nodemailer", () => ({
	default: { createTransport: () => ({ sendMail: mocks.sendMail }) }
}));
vi.mock("imapflow", () => ({
	ImapFlow: class {
		append = mocks.append;
	}
}));

const { userRoutes } = await import("../../back-end/src/routes/userRoutes.js");
const studentId = "a".repeat(24);
const siblingId = "d".repeat(24);
const tutorId = "f".repeat(24);
const adminId = "e".repeat(24);
const sessionId = "b".repeat(24);
const students = [
	{
		_id: new Types.ObjectId(studentId),
		name: "Synthetic Student",
		email: "family@example.invalid",
		tutors: [new Types.ObjectId(tutorId)]
	},
	{
		_id: new Types.ObjectId(siblingId),
		name: "Synthetic Sibling",
		email: "family@example.invalid",
		tutors: [new Types.ObjectId(tutorId)]
	}
];

function makeNote(index: number, user: string | null = studentId) {
	return {
		_id: new Types.ObjectId(
			`${(user === siblingId ? "8" : user ? "c" : "7").repeat(23)}${index.toString(16)}`
		),
		user: user ? new Types.ObjectId(user) : undefined,
		scheduledSessionId:
			index === 6 ? new Types.ObjectId(sessionId) : undefined,
		studentName: "Synthetic Student",
		primaryEmail: "family@example.invalid",
		ccEmails: [],
		subject: `Synthetic note ${index}`,
		sessionDate: new Date(`2026-10-0${index}T12:00:00Z`),
		markdown: `Synthetic saved body ${index}`,
		createdAt: new Date(`2026-10-0${index}T18:00:00Z`),
		updatedAt: new Date(`2026-10-0${index}T18:00:00Z`)
	};
}

let server: Server;
let baseUrl: string;
let wrapper: ReturnType<typeof mount> | undefined;
let notes: ReturnType<typeof makeNote>[];
let forcedRows: typeof notes | undefined;
let releaseDelayed = () => {};

beforeEach(async () => {
	setActivePinia(createPinia());
	vi.clearAllMocks();
	notes = Array.from({ length: 6 }, (_, index) => makeNote(index + 1));
	forcedRows = undefined;
	releaseDelayed = () => {};
	mocks.admin.mockResolvedValue({ _id: adminId, sessionVersion: 0 });
	mocks.tutor.mockImplementation(id =>
		Promise.resolve({ _id: id, sessionVersion: 0 })
	);
	mocks.user.mockImplementation(id => ({
		populate: async () =>
			students.find(student => String(student._id) === String(id)) ?? null
	}));
	mocks.notes.mockImplementation(({ user }) => {
		let rows =
			forcedRows ??
			notes.filter(note => String(note.user) === String(user));
		const query = {
			sort: vi.fn(() => {
				rows = [...rows].sort(
					(left, right) =>
						right.sessionDate.getTime() - left.sessionDate.getTime()
				);
				return query;
			}),
			limit: vi.fn(limit => {
				rows = rows.slice(0, limit);
				return query;
			}),
			lean: async () => rows
		};
		return query;
	});
	const app = express();
	app.use((req, _res, next) => {
		const role = req.get("x-test-role");
		req.session = {
			accountSessionVersion: 0,
			authenticatedSessionExpiresAt: Date.now() + 60_000,
			...(role === "admin"
				? { adminID: adminId }
				: role === "tutor"
					? { tutorID: tutorId }
					: role === "foreign-tutor"
						? { tutorID: "9".repeat(24) }
						: {})
		};
		next();
	});
	app.get("/api/admin-mail/session-notes/identities", (_req, res) =>
		res.json({
			students: students.map(student => ({
				studentId: String(student._id),
				name: student.name,
				recipientName: "Synthetic Family"
			}))
		})
	);
	app.get("/api/admin-mail/recipients", (_req, res) =>
		res.json({
			recipients: [
				{ name: "Synthetic Family", emails: ["family@example.invalid"] }
			]
		})
	);
	app.use("/api/users", userRoutes);
	app.use((_req, res) =>
		res.status(404).json({ message: "Unknown API route" })
	);
	server = await new Promise<Server>(resolve => {
		const instance = app.listen(0, "127.0.0.1", () => resolve(instance));
	});
	const address = server.address();
	if (!address || typeof address === "string")
		throw new Error("No synthetic test port");
	baseUrl = `http://127.0.0.1:${address.port}/api`;
	vi.mocked(api.get).mockImplementation(async (path: string) => {
		const response = await fetch(`${baseUrl}${path}`, {
			headers: { "x-test-role": "admin" }
		});
		const data = await response.json();
		if (!response.ok)
			throw Object.assign(new Error("Synthetic request failed"), {
				response: { status: response.status, data }
			});
		return { data };
	});
});

afterEach(async () => {
	releaseDelayed();
	wrapper?.unmount();
	wrapper = undefined;
	server.closeAllConnections();
	await new Promise<void>(resolve => server.close(() => resolve()));
	expect(mocks.post).not.toHaveBeenCalled();
	expect(mocks.sendMail).not.toHaveBeenCalled();
	expect(mocks.append).not.toHaveBeenCalled();
});

async function selectStudent(student = studentId) {
	wrapper = mount(MdMail);
	await vi.waitFor(() =>
		expect(
			wrapper!
				.find(`#recipient-select option[value="${student}"]`)
				.exists()
		).toBe(true)
	);
	await wrapper.get("#recipient-select").setValue(student);
	return wrapper;
}

describe("composer history through the real saved-note route and controller", () => {
	it("loads the three latest saved notes with persisted student and session IDs", async () => {
		const composer = await selectStudent();
		await vi.waitFor(() =>
			expect(composer.findAll(".history-note")).toHaveLength(3)
		);
		expect(composer.text()).toContain("Synthetic saved body 6");
		expect(composer.text()).not.toContain("Synthetic saved body 3");
		expect(api.get).toHaveBeenCalledWith(
			`/users/${studentId}/session-notes/recent`
		);
		expect(api.get).not.toHaveBeenCalledWith(
			`/users/${studentId}/session-notes`
		);
		const response = await fetch(
			`${baseUrl}/users/${studentId}/session-notes/recent`,
			{ headers: { "x-test-role": "admin" } }
		);
		expect(response.status).toBe(200);
		const body = await response.json();
		expect(body.sessionNotes[0]).toMatchObject({
			_id: String(notes[5]._id),
			studentId,
			scheduledSessionId: sessionId
		});
		expect(body.sessionNotes[1].scheduledSessionId).toBeNull();
		expect(body.sessionNotes[0]).not.toHaveProperty("sentAt");
		expect(mocks.notes).toHaveBeenCalledWith({ user: students[0]._id });
	});
	it("shows an honest empty history without falling back to a shared parent mailbox", async () => {
		notes = [makeNote(6, siblingId)];
		const composer = await selectStudent();
		await vi.waitFor(() =>
			expect(composer.text()).toContain("No saved session notes")
		);
		expect(composer.findAll(".history-note")).toHaveLength(0);
		expect(composer.text()).not.toContain("Synthetic saved body 6");
	});
	it.each(["", "foreign-tutor"])(
		"forbids %s history access before querying note contents",
		async role => {
			const response = await fetch(
				`${baseUrl}/users/${studentId}/session-notes/recent`,
				{ headers: { "x-test-role": role } }
			);
			expect(response.status).toBe(403);
			expect(mocks.notes).not.toHaveBeenCalled();
			expect(JSON.stringify(await response.json())).not.toContain(
				"Synthetic saved body"
			);
		}
	);
	it("keeps the nonexistent GET and unrelated API paths as 404", async () => {
		for (const path of [
			`/users/${studentId}/session-notes`,
			`/users/${studentId}/session-notes/unknown`
		]) {
			expect(
				(
					await fetch(`${baseUrl}${path}`, {
						headers: { "x-test-role": "admin" }
					})
				).status
			).toBe(404);
		}
		expect(mocks.notes).not.toHaveBeenCalled();
	});
	it("filters sibling and unlinked records using the persisted DTO identity", async () => {
		forcedRows = [makeNote(6, siblingId), makeNote(5, null), makeNote(4)];
		const composer = await selectStudent();
		await vi.waitFor(() =>
			expect(composer.findAll(".history-note")).toHaveLength(1)
		);
		expect(composer.text()).toContain("Synthetic saved body 4");
		expect(composer.text()).not.toContain("Synthetic saved body 6");
		expect(composer.text()).not.toContain("Synthetic saved body 5");
	});
	it("ignores a late real-route response after changing the selected sibling", async () => {
		notes.push(makeNote(1, siblingId));
		const originalGet = vi.mocked(api.get).getMockImplementation()!;
		let arrived!: () => void;
		const firstArrived = new Promise<void>(resolve => {
			arrived = resolve;
		});
		const delayed = new Promise<void>(resolve => {
			releaseDelayed = resolve;
		});
		vi.mocked(api.get).mockImplementation(
			async (path: string, ...args: any[]) => {
				const response = await originalGet(path, ...args);
				if (path === `/users/${studentId}/session-notes/recent`) {
					arrived();
					await delayed;
				}
				return response;
			}
		);
		const composer = await selectStudent();
		await firstArrived;
		await composer.get("#recipient-select").setValue(siblingId);
		await vi.waitFor(() =>
			expect(composer.text()).toContain("Synthetic saved body 1")
		);
		releaseDelayed();
		await flushPromises();
		expect(composer.findAll(".history-note")).toHaveLength(1);
		expect(composer.text()).not.toContain("Synthetic saved body 6");
		expect(composer.text()).not.toContain("Saved notes unavailable");
	});
});
