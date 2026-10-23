import type { Server } from "node:http";
import express from "express";
import { Types } from "mongoose";
import { beforeEach, describe, expect, it, vi } from "vitest";

const modelMocks = vi.hoisted(() => ({
	adminFindById: vi.fn(),
	tutorFindById: vi.fn(),
	userFindById: vi.fn(),
	scheduledSessionCreate: vi.fn(),
	scheduledSessionFind: vi.fn(),
	scheduledSessionFindOne: vi.fn(),
	sessionNoteCreate: vi.fn(),
	sessionNoteFind: vi.fn(),
	internalEmailFind: vi.fn()
}));

const deletionMocks = vi.hoisted(() => ({
	deleteUserAccount: vi.fn()
}));

vi.mock("../src/services/userAccountDeletion.js", () => ({
	deleteUserAccount: deletionMocks.deleteUserAccount,
	UserAccountDeletionError: class UserAccountDeletionError extends Error {
		readonly statusCode = 503;
	}
}));

vi.mock("../src/models/schemas/Admin.js", () => ({
	Admin: { findById: modelMocks.adminFindById }
}));

vi.mock("../src/models/schemas/Tutor.js", () => ({
	Tutor: { findById: modelMocks.tutorFindById }
}));

vi.mock("../src/models/schemas/User.js", () => ({
	User: { findById: modelMocks.userFindById, updateOne: vi.fn().mockResolvedValue({ modifiedCount: 1 }) }
}));

vi.mock("../src/models/schemas/ScheduledSession.js", () => ({
	ScheduledSession: {
		create: modelMocks.scheduledSessionCreate,
		find: modelMocks.scheduledSessionFind,
		findOne: modelMocks.scheduledSessionFindOne
	}
}));

vi.mock("../src/models/schemas/SessionNote.js", () => ({
	SessionNote: {
		create: modelMocks.sessionNoteCreate,
		find: modelMocks.sessionNoteFind
	}
}));

vi.mock("../src/models/schemas/InternalEmail.js", () => ({
	InternalEmail: { find: modelMocks.internalEmailFind }
}));

const { userRoutes } = await import("../src/routes/userRoutes.js");
const { tutorRoutes } = await import("../src/routes/tutorRoutes.js");

const tutorID = new Types.ObjectId();
const otherTutorID = new Types.ObjectId();
const adminID = new Types.ObjectId();
const studentID = new Types.ObjectId();
const sessionID = new Types.ObjectId();
const deletionAuditSubjectID = new Types.ObjectId();
const now = new Date("2026-05-12T18:00:00.000Z");

function queryWith<T>(result: T) {
	const query = {
		populate: vi.fn().mockResolvedValue(result),
		sort: vi.fn(() => query),
		limit: vi.fn(() => query),
		select: vi.fn(() => query),
		maxTimeMS: vi.fn(() => query),
		lean: vi.fn().mockResolvedValue(result),
		then: (resolve: (value: T) => unknown, reject: (reason: unknown) => unknown) =>
			Promise.resolve(result).then(resolve, reject),
		catch: (reject: (reason: unknown) => unknown) => Promise.resolve(result).catch(reject)
	};
	return query;
}

function makeStudent(tutors: unknown[] = [tutorID]) {
	return {
		_id: studentID,
		name: "Student One",
		email: "student@example.com",
		tutors
	};
}

function makeSession(overrides: Record<string, unknown> = {}) {
	return {
		_id: sessionID,
		user: studentID,
		tutor: tutorID,
		title: "Class session",
		startAt: now,
		endAt: new Date(now.getTime() + 60 * 60_000),
		timezone: "America/New_York",
		status: "scheduled",
		notes: undefined,
		sourceEmail: "student@example.com",
		externalEventId: undefined,
		recurrenceId: undefined,
		createdAt: now,
		updatedAt: now,
		...overrides
	};
}

function makeNote(overrides: Record<string, unknown> = {}) {
	return {
		_id: new Types.ObjectId(),
		user: studentID,
		studentName: "Student One",
		primaryEmail: "student@example.com",
		ccEmails: [],
		subject: "Session Notes (05/12)",
		sessionDate: new Date("2026-05-12T12:00:00.000Z"),
		markdown: "Worked on loops.",
		html: "<p>Worked on loops.</p>",
		createdAt: now,
		updatedAt: now,
		...overrides
	};
}

async function withUserRoutes<T>(run: (baseUrl: string) => Promise<T>): Promise<T> {
	const app = express();
	app.use(express.json());
	app.use((req: any, _res, next) => {
		req.session = {
			accountSessionVersion: 0,
			authenticatedSessionExpiresAt: Date.now() + 60_000,
			adminID: req.get("x-admin-id") || undefined,
			tutorID: req.get("x-tutor-id") || undefined,
			userID: req.get("x-user-id") || undefined
		};
		next();
	});
	app.use("/users", userRoutes);

	const server = await new Promise<Server>(resolve => {
		const instance = app.listen(0, "127.0.0.1", () => resolve(instance));
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

async function withTutorRoutes<T>(run: (baseUrl: string) => Promise<T>): Promise<T> {
	const app = express();
	app.use(express.json());
	app.use((req: any, _res, next) => {
		req.session = {
			accountSessionVersion: 0,
			authenticatedSessionExpiresAt: Date.now() + 60_000,
			adminID: req.get("x-admin-id") || undefined,
			tutorID: req.get("x-tutor-id") || undefined,
			userID: req.get("x-user-id") || undefined
		};
		next();
	});
	app.use("/tutors", tutorRoutes);

	const server = await new Promise<Server>(resolve => {
		const instance = app.listen(0, "127.0.0.1", () => resolve(instance));
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

async function postJson(baseUrl: string, path: string, body: unknown, headers: Record<string, string> = {}) {
	return fetch(`${baseUrl}${path}`, {
		method: "POST",
		headers: {
			"content-type": "application/json",
			...headers
		},
		body: JSON.stringify(body)
	});
}

async function putJson(baseUrl: string, path: string, body: unknown, headers: Record<string, string> = {}) {
	return fetch(`${baseUrl}${path}`, {
		method: "PUT",
		headers: {
			"content-type": "application/json",
			...headers
		},
		body: JSON.stringify(body)
	});
}

describe("user schedule and note-only routes", () => {
	beforeEach(() => {
		vi.clearAllMocks();

		modelMocks.adminFindById.mockImplementation((id: string) =>
			id === adminID.toString()
				? Promise.resolve({
						_id: adminID,
						name: "Admin",
						email: "admin@example.com",
						sessionVersion: 0
					})
				: Promise.resolve(null)
		);
		modelMocks.tutorFindById.mockImplementation((id: string) =>
			id === tutorID.toString()
				? Promise.resolve({
						_id: tutorID,
						name: "Tutor",
						email: "tutor@example.com",
						coursePermissions: [],
						sessionVersion: 0
					})
				: Promise.resolve(null)
		);
		modelMocks.userFindById.mockImplementation(() => queryWith(makeStudent()));
		modelMocks.scheduledSessionCreate.mockImplementation(async payload => makeSession(payload));
		modelMocks.scheduledSessionFind.mockReturnValue(queryWith([makeSession()]));
		modelMocks.scheduledSessionFindOne.mockResolvedValue(makeSession());
		modelMocks.sessionNoteCreate.mockImplementation(async payload => makeNote(payload));
		modelMocks.sessionNoteFind.mockReturnValue(queryWith([makeNote(), makeNote(), makeNote()]));
		modelMocks.internalEmailFind.mockReturnValue(queryWith([]));
		deletionMocks.deleteUserAccount.mockResolvedValue({
			auditSubjectID: deletionAuditSubjectID,
			deleted: true
		});
	});

	it("lets an assigned tutor create a visible scheduled session for their student", async () => {
		await withUserRoutes(async baseUrl => {
			const response = await postJson(
				baseUrl,
				`/users/${studentID}/schedule`,
				{
					title: "C++ lesson",
					startAt: "2026-05-12T18:00:00.000Z",
					endAt: "2026-05-12T19:00:00.000Z",
					timezone: "America/New_York"
				},
				{ "x-tutor-id": tutorID.toString() }
			);

			expect(response.status).toBe(201);
			const body = await response.json();
			expect(body.scheduledSession.title).toBe("C++ lesson");
			expect(body.scheduledSession.tutor).toBe(tutorID.toString());
			expect(modelMocks.scheduledSessionCreate).toHaveBeenCalledWith(
				expect.objectContaining({
					user: studentID,
					tutor: tutorID,
					sourceEmail: "student@example.com"
				})
			);
		});
	});

	it("updates scheduled sessions whose existing tutor record is populated", async () => {
		const save = vi.fn().mockResolvedValue(undefined);
		const session = makeSession({
			tutor: { _id: tutorID, name: "Tutor" },
			save
		});
		modelMocks.scheduledSessionFindOne.mockResolvedValue(session);

		await withUserRoutes(async baseUrl => {
			const response = await putJson(
				baseUrl,
				`/users/${studentID}/schedule/${sessionID}`,
				{
					title: "Updated C++ lesson",
					startAt: "2026-05-12T18:30:00.000Z",
					endAt: "2026-05-12T19:30:00.000Z",
					timezone: "America/New_York"
				},
				{ "x-admin-id": adminID.toString() }
			);
			const body = await response.json();

			expect(response.status).toBe(200);
			expect(modelMocks.scheduledSessionFindOne).toHaveBeenCalledWith({
				_id: sessionID.toString(),
				user: studentID
			});
			expect(save).toHaveBeenCalledOnce();
			expect(session.title).toBe("Updated C++ lesson");
			expect(session.tutor).toEqual(tutorID);
			expect(body.scheduledSession.tutor).toBe(tutorID.toString());
		});
	});

	it("rejects unsupported no_show status before creating a scheduled session", async () => {
		await withUserRoutes(async baseUrl => {
			const response = await postJson(
				baseUrl,
				`/users/${studentID}/schedule`,
				{
					startAt: "2026-05-12T18:00:00.000Z",
					endAt: "2026-05-12T19:00:00.000Z",
					status: "no_show"
				},
				{ "x-admin-id": adminID.toString() }
			);

			expect(response.status).toBe(400);
			await expect(response.json()).resolves.toEqual({
				message: "status must be scheduled, cancelled, completed, or rescheduled"
			});
			expect(modelMocks.scheduledSessionCreate).not.toHaveBeenCalled();
		});
	});

	it("blocks tutors from managing students not assigned to them", async () => {
		modelMocks.userFindById.mockImplementation(() => queryWith(makeStudent([otherTutorID])));

		await withUserRoutes(async baseUrl => {
			const response = await postJson(
				baseUrl,
				`/users/${studentID}/schedule`,
				{
					startAt: "2026-05-12T18:00:00.000Z",
					endAt: "2026-05-12T19:00:00.000Z"
				},
				{ "x-tutor-id": tutorID.toString() }
			);

			expect(response.status).toBe(403);
			expect(modelMocks.scheduledSessionCreate).not.toHaveBeenCalled();
		});
	});

	it.each(["admin", "tutor"])("returns stable identities through the authorized recent-note route for %s", async role => {
		const recentQuery = queryWith([makeNote({ scheduledSessionId: sessionID }), makeNote(), makeNote()]);
		modelMocks.sessionNoteFind.mockReturnValue(recentQuery);
		await withUserRoutes(async baseUrl => {
			const response = await fetch(`${baseUrl}/users/${studentID}/session-notes/recent`, { headers: role === "admin" ? { "x-admin-id": String(adminID) } : { "x-tutor-id": String(tutorID) } });
			expect(response.status).toBe(200);
			const body = await response.json();
			expect(body.sessionNotes).toHaveLength(3);
			expect(body.sessionNotes[0]).toMatchObject({ studentId: String(studentID), scheduledSessionId: String(sessionID) });
			expect(body.sessionNotes[1].scheduledSessionId).toBeNull();
			expect(body.sessionNotes[0]).not.toHaveProperty("sentAt");
			expect(modelMocks.sessionNoteFind).toHaveBeenCalledWith({ user: studentID });
			expect(recentQuery.limit).toHaveBeenCalledWith(3);
			expect(recentQuery.sort).toHaveBeenCalledWith({ sessionDate: -1, createdAt: -1 });
		});
	});

	it("serializes missing persisted identities as null without inventing associations", async () => {
		modelMocks.sessionNoteFind.mockReturnValue(queryWith([makeNote({ user: undefined, scheduledSessionId: undefined })]));
		await withUserRoutes(async baseUrl => {
			const response = await fetch(`${baseUrl}/users/${studentID}/session-notes/recent`, { headers: { "x-admin-id": String(adminID) } });
			expect(response.status).toBe(200);
			expect((await response.json()).sessionNotes[0]).toMatchObject({ studentId: null, scheduledSessionId: null });
		});
	});

	it("returns an empty history without looking up a recipient email", async () => {
		modelMocks.sessionNoteFind.mockReturnValue(queryWith([]));
		await withUserRoutes(async baseUrl => {
			const response = await fetch(`${baseUrl}/users/${studentID}/session-notes/recent`, { headers: { "x-admin-id": String(adminID) } });
			expect(response.status).toBe(200);
			expect(await response.json()).toEqual({ sessionNotes: [] });
			expect(modelMocks.sessionNoteFind).toHaveBeenCalledWith({ user: studentID });
		});
	});

	it.each(["anonymous", "unrelated-tutor"])("forbids %s note reads before accessing saved notes", async role => {
		modelMocks.userFindById.mockImplementation(() => queryWith(makeStudent([otherTutorID])));
		await withUserRoutes(async baseUrl => {
			const response = await fetch(`${baseUrl}/users/${studentID}/session-notes/recent`, { headers: role === "unrelated-tutor" ? { "x-tutor-id": String(tutorID) } : {} });
			expect(response.status).toBe(403);
			expect(modelMocks.sessionNoteFind).not.toHaveBeenCalled();
		});
	});

	it("does not add a GET alias to the save-only route", async () => {
		await withUserRoutes(async baseUrl => {
			const response = await fetch(`${baseUrl}/users/${studentID}/session-notes`, { headers: { "x-admin-id": String(adminID) } });
			expect(response.status).toBe(404);
			expect(modelMocks.sessionNoteFind).not.toHaveBeenCalled();
		});
	});

	it("saves note-only logs without trimming older notes from storage", async () => {
		await withUserRoutes(async baseUrl => {
			const response = await postJson(
				baseUrl,
				`/users/${studentID}/session-notes`,
				{
					sessionDate: "2026-05-12",
					unlinked: true,
					markdown: "Worked on recursion and traced two edge cases.",
					delivery: { source: "site_smtp", status: "smtp_accepted", sentAt: now },
					sentAt: now
				},
				{ "x-admin-id": adminID.toString() }
			);

			expect(response.status).toBe(201);
			const body = await response.json();
			expect(body.sessionNote.subject).toBe("Session Notes (05/12)");
			expect(body.recentSessionNotes).toHaveLength(3);
			expect(modelMocks.sessionNoteCreate).toHaveBeenCalledWith(
				expect.objectContaining({
					user: studentID,
					primaryEmail: "student@example.com",
					markdown: "Worked on recursion and traced two edge cases."
				})
			);
			expect("deleteMany" in modelMocks).toBe(false);
			expect(modelMocks.sessionNoteCreate.mock.lastCall?.[0]).not.toHaveProperty("delivery");
			expect(modelMocks.sessionNoteCreate.mock.lastCall?.[0]).not.toHaveProperty("sentAt");
		});
	});

	it("stores course progress metadata for autosaved staff updates", async () => {
		const save = vi.fn().mockResolvedValue(undefined);
		const longHistoricalId = "algebra-1a-aa16-module-project-battle-of-the-publications-with-konstantin-kaganovsky-supplemental-standards-practice-set-module-project-battle-of-the-publications-with-konstantin-kaganovsky";
		const student = {
			...makeStudent(),
			courseAccess: ["algebra-1a"],
			courseProgress: [],
			save
		};
		modelMocks.userFindById.mockImplementation(() => queryWith(student));

		await withUserRoutes(async baseUrl => {
			const response = await putJson(
				baseUrl,
				`/users/${studentID}/course-progress`,
				{
					courseId: "algebra-1a",
					completedModuleIds: ["module-1"],
					completedItemIds: [longHistoricalId]
				},
				{ "x-admin-id": adminID.toString() }
			);

			expect(response.status).toBe(200);
			expect(save).toHaveBeenCalledOnce();
			expect(student.courseProgress[0]).toEqual(
				expect.objectContaining({
					completedItemIds: [longHistoricalId],
					completedModuleIds: ["module-1"],
					courseId: "algebra-1a",
					updatedBy: adminID,
					updatedByRole: "admin"
				})
			);
			expect(student.courseProgress[0].updatedAt).toBeInstanceOf(Date);
		});
	});

	it("rejects malformed or oversized learner course progress autosave payloads", async () => {
		const save = vi.fn().mockResolvedValue(undefined);
		const student = {
			...makeStudent(),
			courseAccess: ["javascript-level-1"],
			courseProgress: [],
			save
		};
		modelMocks.userFindById.mockImplementation(() => queryWith(student));

		await withUserRoutes(async baseUrl => {
			const tooLongIdResponse = await putJson(
				baseUrl,
				`/users/${studentID}/course-progress`,
				{
					courseId: "javascript-level-1",
					completedModuleIds: ["m".repeat(257)],
					completedItemIds: []
				},
				{ "x-admin-id": adminID.toString() }
			);
			const tooManyIdsResponse = await putJson(
				baseUrl,
				`/users/${studentID}/course-progress`,
				{
					courseId: "javascript-level-1",
					completedModuleIds: Array.from(
						{ length: 1001 },
						(_value, index) => `module-${index}`
					),
					completedItemIds: []
				},
				{ "x-admin-id": adminID.toString() }
			);
			const tooManyDuplicateIdsResponse = await putJson(
				baseUrl,
				`/users/${studentID}/course-progress`,
				{
					courseId: "javascript-level-1",
					completedModuleIds: Array.from(
						{ length: 1001 },
						() => "module-1"
					),
					completedItemIds: []
				},
				{ "x-admin-id": adminID.toString() }
			);
			const tooLongCourseResponse = await putJson(
				baseUrl,
				`/users/${studentID}/course-progress`,
				{
					courseId: "c".repeat(161),
					completedModuleIds: [],
					completedItemIds: []
				},
				{ "x-admin-id": adminID.toString() }
			);
			const reservedCourseResponse = await putJson(
				baseUrl,
				`/users/${studentID}/course-progress`,
				{
					courseId: "__all__",
					completedModuleIds: [],
					completedItemIds: []
				},
				{ "x-admin-id": adminID.toString() }
			);
			const nonStringIdResponse = await putJson(
				baseUrl,
				`/users/${studentID}/course-progress`,
				{
					courseId: "javascript-level-1",
					completedModuleIds: [123],
					completedItemIds: []
				},
				{ "x-admin-id": adminID.toString() }
			);
			const blankIdResponse = await putJson(
				baseUrl,
				`/users/${studentID}/course-progress`,
				{
					courseId: "javascript-level-1",
					completedModuleIds: [" "],
					completedItemIds: []
				},
				{ "x-admin-id": adminID.toString() }
			);

			expect(tooLongIdResponse.status).toBe(400);
			expect(tooManyIdsResponse.status).toBe(400);
			expect(tooManyDuplicateIdsResponse.status).toBe(400);
			expect(tooLongCourseResponse.status).toBe(400);
			expect(reservedCourseResponse.status).toBe(400);
			expect(nonStringIdResponse.status).toBe(400);
			expect(blankIdResponse.status).toBe(400);
			expect(save).not.toHaveBeenCalled();
		});
	});

	it("preserves available course status when staff update learner course access", async () => {
		const save = vi.fn().mockResolvedValue(undefined);
		const student = {
			...makeStudent(),
			courseAccess: ["python-level-1"],
			courseStatus: { "python-level-1": "current" },
			courseProgress: [],
			save
		};
		modelMocks.userFindById.mockImplementation(() => queryWith(student));

		await withUserRoutes(async baseUrl => {
			const response = await putJson(
				baseUrl,
				`/users/${studentID}/courses`,
				{
					courseIDs: ["python-level-1", "ap-computer-science-a"],
					courseStatus: {
						"python-level-1": "past",
						"ap-computer-science-a": "available"
					}
				},
				{ "x-admin-id": adminID.toString() }
			);

			expect(response.status).toBe(200);
			await expect(response.json()).resolves.toEqual({
				courseAccess: ["python-level-1", "ap-computer-science-a"],
				courseStatus: {
					"python-level-1": "past",
					"ap-computer-science-a": "available"
				}
			});
			expect(save).toHaveBeenCalledOnce();
			expect(student.courseStatus).toEqual({
				"python-level-1": "past",
				"ap-computer-science-a": "available"
			});
		});
	});

	it("retains old course progress without allowing updates after access removal", async () => {
		const save = vi.fn().mockResolvedValue(undefined);
		const savedProgress = [
			{
				courseId: "java-without-graphics",
				completedModuleIds: ["java-without-graphics-old-module"],
				completedItemIds: ["java-without-graphics-old-item"]
			}
		];
		const student = {
			...makeStudent(),
			courseAccess: ["java-without-graphics", "python-level-1"],
			courseProgress: savedProgress,
			courseStatus: {},
			save
		};
		modelMocks.userFindById.mockImplementation(() => queryWith(student));

		await withUserRoutes(async baseUrl => {
			const accessResponse = await putJson(
				baseUrl,
				`/users/${studentID}/courses`,
				{ courseIDs: ["python-level-1"] },
				{ "x-admin-id": adminID.toString() }
			);
			expect(accessResponse.status).toBe(200);
			expect(student.courseProgress).toEqual(savedProgress);
			expect(save).toHaveBeenCalledOnce();

			const progressResponse = await putJson(
				baseUrl,
				`/users/${studentID}/course-progress`,
				{
					courseId: "java-without-graphics",
					completedModuleIds: [],
					completedItemIds: []
				},
				{ "x-admin-id": adminID.toString() }
			);
			expect(progressResponse.status).toBe(400);
			expect(student.courseProgress).toEqual(savedProgress);
			expect(save).toHaveBeenCalledOnce();
		});
	});

	it("lets assigned tutors update course access when tutor records are populated", async () => {
		const save = vi.fn().mockResolvedValue(undefined);
		const student = {
			...makeStudent([{ _id: tutorID }]),
			courseAccess: [],
			courseProgress: [],
			courseStatus: {},
			save
		};
		modelMocks.tutorFindById.mockImplementation((id: string) =>
			id === tutorID.toString()
				? Promise.resolve({
						_id: tutorID,
						name: "Tutor",
						email: "tutor@example.com",
						coursePermissions: ["python-level-1"]
					})
				: Promise.resolve(null)
		);
		modelMocks.userFindById.mockImplementation(() => queryWith(student));

		await withUserRoutes(async baseUrl => {
			const response = await putJson(
				baseUrl,
				`/users/${studentID}/courses`,
				{ courseIDs: ["python-level-1"] },
				{ "x-tutor-id": tutorID.toString() }
			);

			expect(response.status).toBe(200);
			await expect(response.json()).resolves.toEqual({
				courseAccess: ["python-level-1"],
				courseStatus: { "python-level-1": "current" }
			});
			expect(save).toHaveBeenCalledOnce();
			expect(student.courseAccess).toEqual(["python-level-1"]);
		});
	});

	it("rejects malformed learner course access IDs before loading the student", async () => {
		await withUserRoutes(async baseUrl => {
			const nonStringResponse = await putJson(
				baseUrl,
				`/users/${studentID}/courses`,
				{ courseIDs: [123] },
				{ "x-admin-id": adminID.toString() }
			);
			const blankResponse = await putJson(
				baseUrl,
				`/users/${studentID}/courses`,
				{ courseIDs: [" "] },
				{ "x-admin-id": adminID.toString() }
			);
			const tooLongResponse = await putJson(
				baseUrl,
				`/users/${studentID}/courses`,
				{ courseIDs: ["c".repeat(161)] },
				{ "x-admin-id": adminID.toString() }
			);
			const reservedContextResponse = await putJson(
				baseUrl,
				`/users/${studentID}/courses`,
				{ courseIDs: ["__all__"] },
				{ "x-admin-id": adminID.toString() }
			);
			const tooManyDuplicateResponse = await putJson(
				baseUrl,
				`/users/${studentID}/courses`,
				{
					courseIDs: Array.from(
						{ length: 1001 },
						() => "python-level-1"
					)
				},
				{ "x-admin-id": adminID.toString() }
			);

			expect(nonStringResponse.status).toBe(400);
			expect(blankResponse.status).toBe(400);
			expect(tooLongResponse.status).toBe(400);
			expect(reservedContextResponse.status).toBe(400);
			expect(tooManyDuplicateResponse.status).toBe(400);
			expect(modelMocks.userFindById).not.toHaveBeenCalled();
		});
	});

	it("rejects malformed tutor course permission IDs before loading the tutor", async () => {
		await withTutorRoutes(async baseUrl => {
			const nonStringResponse = await putJson(
				baseUrl,
				`/tutors/${tutorID}/courses`,
				{ courseIDs: [123] },
				{ "x-admin-id": adminID.toString() }
			);
			const blankResponse = await putJson(
				baseUrl,
				`/tutors/${tutorID}/courses`,
				{ courseIDs: [" "] },
				{ "x-admin-id": adminID.toString() }
			);
			const tooLongResponse = await putJson(
				baseUrl,
				`/tutors/${tutorID}/courses`,
				{ courseIDs: ["c".repeat(161)] },
				{ "x-admin-id": adminID.toString() }
			);
			const reservedContextResponse = await putJson(
				baseUrl,
				`/tutors/${tutorID}/courses`,
				{ courseIDs: ["__all__"] },
				{ "x-admin-id": adminID.toString() }
			);
			const tooManyDuplicateResponse = await putJson(
				baseUrl,
				`/tutors/${tutorID}/courses`,
				{
					courseIDs: Array.from(
						{ length: 1001 },
						() => "python-level-1"
					)
				},
				{ "x-admin-id": adminID.toString() }
			);

			expect(nonStringResponse.status).toBe(400);
			expect(blankResponse.status).toBe(400);
			expect(tooLongResponse.status).toBe(400);
			expect(reservedContextResponse.status).toBe(400);
			expect(tooManyDuplicateResponse.status).toBe(400);
			expect(modelMocks.tutorFindById).not.toHaveBeenCalled();
		});
	});

	it("lets assigned tutors delete their own students when tutor records are populated", async () => {
		const student = {
			...makeStudent([{ _id: tutorID }])
		};
		modelMocks.userFindById.mockImplementation(() => queryWith(student));

		await withUserRoutes(async baseUrl => {
			const response = await fetch(`${baseUrl}/users/tutor/${studentID}`, {
				headers: { "x-tutor-id": tutorID.toString() },
				method: "DELETE"
			});

			expect(response.status).toBe(200);
			expect(deletionMocks.deleteUserAccount).toHaveBeenCalledOnce();
			expect(deletionMocks.deleteUserAccount).toHaveBeenCalledWith(
				studentID,
				{ requiredTutorID: tutorID }
			);
		});
	});

	it("includes upcoming schedule items in the logged-in student's communications feed", async () => {
		await withUserRoutes(async baseUrl => {
			const response = await fetch(`${baseUrl}/users/loggedin/communications`, {
				headers: { "x-user-id": studentID.toString() }
			});

			expect(response.status).toBe(200);
			const body = await response.json();
			expect(body.scheduledSessions).toHaveLength(1);
			expect(body.scheduledSessions[0]).toEqual(
				expect.objectContaining({
					title: "Class session",
					status: "scheduled",
					sourceEmail: "student@example.com"
				})
			);
		});
	});
});
