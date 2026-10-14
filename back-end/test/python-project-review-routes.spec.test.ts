import { resolve } from "node:path";
import { readFileSync } from "node:fs";
import type { Server } from "node:http";
import express from "express";
import { Types } from "mongoose";
import { beforeEach, describe, expect, it, vi } from "vitest";

const modelMocks = vi.hoisted(() => ({
	adminFindById: vi.fn(),
	tutorFindById: vi.fn(),
	userFindById: vi.fn(),
	pythonProjectCreate: vi.fn(),
	pythonProjectCountDocuments: vi.fn(),
	pythonProjectFind: vi.fn(),
	pythonProjectFindOne: vi.fn(),
	pythonProjectReviewFind: vi.fn(),
	pythonProjectReviewFindOne: vi.fn(),
	pythonProjectReviewCreate: vi.fn(),
	pythonProjectReviewDeleteMany: vi.fn()
}));

vi.mock("../src/models/schemas/Admin.js", () => ({
	Admin: { findById: modelMocks.adminFindById }
}));

vi.mock("../src/models/schemas/Tutor.js", () => ({
	Tutor: { findById: modelMocks.tutorFindById }
}));

vi.mock("../src/models/schemas/User.js", () => ({
	User: { findById: modelMocks.userFindById }
}));

vi.mock("../src/models/schemas/PythonProject.js", () => ({
	PythonProject: {
		countDocuments: modelMocks.pythonProjectCountDocuments,
		create: modelMocks.pythonProjectCreate,
		find: modelMocks.pythonProjectFind,
		findOne: modelMocks.pythonProjectFindOne
	}
}));

vi.mock("../src/models/schemas/PythonProjectReview.js", () => ({
	PythonProjectReview: {
		create: modelMocks.pythonProjectReviewCreate,
		deleteMany: modelMocks.pythonProjectReviewDeleteMany,
		find: modelMocks.pythonProjectReviewFind,
		findOne: modelMocks.pythonProjectReviewFindOne
	}
}));

const { userRoutes } = await import("../src/routes/userRoutes.js");

const adminID = new Types.ObjectId();
const tutorID = new Types.ObjectId();
const otherTutorID = new Types.ObjectId();
const studentID = new Types.ObjectId();
const projectID = new Types.ObjectId();
const reviewID = new Types.ObjectId();
const now = new Date("2026-06-20T12:00:00.000Z");
const userOwnerClause = {
	$or: [{ ownerRole: "user" }, { ownerRole: { $exists: false } }]
};

function ownedProjectQuery(
	ownerID: Types.ObjectId,
	ownerRole: "admin" | "tutor" | "user"
) {
	if (ownerRole === "user") {
		return {
			user: ownerID,
			...userOwnerClause
		};
	}

	return {
		user: ownerID,
		ownerRole
	};
}

function queryWith<T>(result: T) {
	const query = {
		populate: vi.fn().mockResolvedValue(result),
		select: vi.fn(() => query),
		sort: vi.fn(() => query),
		skip: vi.fn(() => query),
		limit: vi.fn(() => query),
		lean: vi.fn().mockResolvedValue(result),
		then: (
			resolve: (value: T) => unknown,
			reject: (reason: unknown) => unknown
		) => Promise.resolve(result).then(resolve, reject),
		catch: (reject: (reason: unknown) => unknown) =>
			Promise.resolve(result).catch(reject)
	};
	return query;
}

function makeStudent(tutors: Types.ObjectId[] = [tutorID]) {
	return {
		_id: studentID,
		name: "Student One",
		email: "student@example.com",
		tutors
	};
}

function makeProject(overrides: Record<string, unknown> = {}) {
	return {
		_id: projectID,
		user: studentID,
		title: "Loops practice",
		mode: "python",
		files: [
			{
				name: "main.py",
				content: "print('student')\n",
				encoding: "text"
			}
		],
		activeFileName: "main.py",
		courseID: "python-level-2",
		courseProjectKey: "python-level-2:loops:starter",
		courseProjectTitle: "Loops practice",
		shared: false,
		shareID: undefined,
		shareCreatedAt: undefined,
		createdAt: now,
		updatedAt: now,
		deleteOne: vi.fn().mockResolvedValue(undefined),
		save: vi.fn().mockResolvedValue(undefined),
		...overrides
	};
}

function makeReview(overrides: Record<string, unknown> = {}) {
	const review = {
		_id: reviewID,
		user: studentID,
		sourceProject: projectID,
		title: "Loops practice",
		mode: "python",
		files: [
			{
				name: "main.py",
				content: "# Try a for loop here.\nprint('review')\n",
				encoding: "text"
			}
		],
		activeFileName: "main.py",
		courseID: "python-level-2",
		courseProjectKey: "python-level-2:loops:starter",
		courseProjectTitle: "Loops practice",
		reviewer: adminID,
		reviewerRole: "admin",
		reviewerName: "Admin",
		lastEditedBy: adminID,
		lastEditedByRole: "admin",
		lastEditedByName: "Admin",
		visibleToStudent: false,
		note: "",
		sourceUpdatedAt: now,
		createdAt: now,
		updatedAt: now,
		save: vi.fn().mockResolvedValue(undefined),
		...overrides
	};
	return review;
}

async function withUserRoutes<T>(
	run: (baseUrl: string) => Promise<T>
): Promise<T> {
	const app = express();
	app.use(express.json({ limit: "15mb" }));
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

async function postJson(
	baseUrl: string,
	path: string,
	body: unknown,
	headers: Record<string, string> = {}
) {
	return fetch(`${baseUrl}${path}`, {
		method: "POST",
		headers: {
			"content-type": "application/json",
			...headers
		},
		body: JSON.stringify(body)
	});
}

async function putJson(
	baseUrl: string,
	path: string,
	body: unknown,
	headers: Record<string, string> = {}
) {
	return fetch(`${baseUrl}${path}`, {
		method: "PUT",
		headers: {
			"content-type": "application/json",
			...headers
		},
		body: JSON.stringify(body)
	});
}

describe("Python project review routes", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		modelMocks.pythonProjectCountDocuments.mockReturnValue({
			exec: vi.fn().mockResolvedValue(0)
		});

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
		modelMocks.userFindById.mockImplementation(() =>
			queryWith(makeStudent())
		);
		modelMocks.pythonProjectCreate.mockImplementation(async payload =>
			makeProject({
				_id: new Types.ObjectId(),
				createdAt: now,
				updatedAt: now,
				...payload
			})
		);
		modelMocks.pythonProjectFind.mockReturnValue(
			queryWith([makeProject()])
		);
		modelMocks.pythonProjectFindOne.mockResolvedValue(makeProject());
		modelMocks.pythonProjectReviewFind.mockReturnValue(
			queryWith([makeReview()])
		);
		modelMocks.pythonProjectReviewFindOne.mockResolvedValue(makeReview());
		modelMocks.pythonProjectReviewCreate.mockImplementation(async payload =>
			makeReview(payload)
		);
		modelMocks.pythonProjectReviewDeleteMany.mockResolvedValue({
			deletedCount: 1
		});
	});

	it("lets signed-in students list their own Code IDE projects", async () => {
		await withUserRoutes(async baseUrl => {
			const response = await fetch(
				`${baseUrl}/users/loggedin/python-projects`,
				{
					headers: { "x-user-id": studentID.toString() }
				}
			);
			const body = await response.json();

			expect(response.status).toBe(200);
			expect(modelMocks.pythonProjectFind).toHaveBeenCalledWith(
				ownedProjectQuery(studentID, "user")
			);
			expect(body.projects).toHaveLength(1);
			expect(body.projects[0]).not.toHaveProperty("files");
			expect(body.nextOffset).toBeNull();
		});
	});

	it.each([
		["x-user-id", studentID.toString(), studentID.toString()],
		["x-tutor-id", tutorID.toString(), `tutor:${tutorID}`],
		["x-admin-id", adminID.toString(), `admin:${adminID}`]
	])(
		"rejects stale workspace ownership before every own route for %s",
		async (header, accountID, expectedOwner) => {
			await withUserRoutes(async baseUrl => {
				const routes = [
					["GET", "/python-projects"],
					["POST", "/python-projects"],
					["GET", `/python-projects/${projectID}`],
					["PUT", `/python-projects/${projectID}`],
					["DELETE", `/python-projects/${projectID}`],
					["PUT", `/python-projects/${projectID}/share`],
					["GET", "/python-project-reviews"],
					["GET", `/python-project-reviews/${reviewID}`]
				];
				for (const [method, path] of routes) {
					const response = await fetch(
						`${baseUrl}/users/loggedin${path}`,
						{
							method,
							headers: {
								[header]: accountID,
								"X-Code-IDE-Owner": `other-${expectedOwner}`
							}
						}
					);
					expect(response.status, `${method} ${path}`).toBe(409);
					expect(await response.json()).toEqual({
						message:
							"Workspace account changed. Reopen the workspace before syncing."
					});
				}
				expect(modelMocks.pythonProjectCreate).not.toHaveBeenCalled();
				expect(modelMocks.pythonProjectFind).not.toHaveBeenCalled();
				expect(modelMocks.pythonProjectFindOne).not.toHaveBeenCalled();
				expect(
					modelMocks.pythonProjectReviewFind
				).not.toHaveBeenCalled();
				expect(
					modelMocks.pythonProjectReviewFindOne
				).not.toHaveBeenCalled();
				const valid = await postJson(
					baseUrl,
					"/users/loggedin/python-projects",
					{
						title: "Matching owner",
						files: [
							{ name: "main.py", content: "print('synthetic')" }
						]
					},
					{ [header]: accountID, "X-Code-IDE-Owner": expectedOwner }
				);
				expect(valid.status).toBe(201);
			});
		}
	);

	it("paginates project metadata without returning file contents", async () => {
		modelMocks.pythonProjectFind.mockReturnValue(
			queryWith(
				Array.from({ length: 26 }, (_value, index) =>
					makeProject({
						_id: new Types.ObjectId(),
						files: [
							{
								content: `private-${index}`,
								encoding: "text",
								name: "main.py"
							}
						],
						title: `Project ${index}`
					})
				)
			)
		);

		await withUserRoutes(async baseUrl => {
			const response = await fetch(
				`${baseUrl}/users/loggedin/python-projects?offset=0&limit=25`,
				{ headers: { "x-user-id": studentID.toString() } }
			);
			const body = await response.json();

			expect(response.status).toBe(200);
			expect(body.projects).toHaveLength(25);
			expect(body.nextOffset).toBe(25);
			for (const project of body.projects) {
				expect(project).not.toHaveProperty("files");
				expect(JSON.stringify(project)).not.toContain("private-");
			}
		});
	});

	it("rejects unbounded project-list pagination values", async () => {
		await withUserRoutes(async baseUrl => {
			const response = await fetch(
				`${baseUrl}/users/loggedin/python-projects?limit=26`,
				{ headers: { "x-user-id": studentID.toString() } }
			);

			expect(response.status).toBe(400);
			expect(modelMocks.pythonProjectFind).not.toHaveBeenCalled();
		});
	});

	it("sanitizes legacy stored files before listing owned Code IDE projects", async () => {
		modelMocks.pythonProjectFindOne.mockResolvedValue(
			makeProject({
				activeFileName: "../secret.py",
				files: [
					{
						name: "main.py",
						content: "print('safe')\n",
						encoding: "text"
					},
					{
						name: "../secret.py",
						content: "print('secret')\n",
						encoding: "text"
					},
					{
						name: "turtle.py",
						content: "print('reserved')\n",
						encoding: "text"
					},
					{
						name: "_classes_artifacts/__init__.py",
						content: "print('shadow')\n",
						encoding: "text"
					}
				]
			})
		);

		await withUserRoutes(async baseUrl => {
			const response = await fetch(
				`${baseUrl}/users/loggedin/python-projects/${projectID}`,
				{
					headers: { "x-user-id": studentID.toString() }
				}
			);
			const body = await response.json();

			expect(response.status).toBe(200);
			expect(body.project.files).toEqual([
				{
					name: "main.py",
					content: "print('safe')\n",
					encoding: "text"
				}
			]);
			expect(body.project.activeFileName).toBe("main.py");
		});
	});

	it("preserves legacy files on metadata updates while filtering the response", async () => {
		const project = makeProject({
			activeFileName: "../secret.py",
			files: [
				{
					name: "main.py",
					content: "print('safe')\n",
					encoding: "text"
				},
				{
					name: "../secret.py",
					content: "print('secret')\n",
					encoding: "text"
				},
				{
					name: "turtle.py",
					content: "print('reserved')\n",
					encoding: "text"
				},
				{
					name: "_classes_artifacts/__init__.py",
					content: "print('shadow')\n",
					encoding: "text"
				}
			]
		});
		modelMocks.pythonProjectFindOne.mockResolvedValue(project);

		await withUserRoutes(async baseUrl => {
			const response = await putJson(
				baseUrl,
				`/users/loggedin/python-projects/${projectID}`,
				{ title: "Cleaned loops practice" },
				{ "x-user-id": studentID.toString() }
			);
			const body = await response.json();

			expect(response.status).toBe(200);
			expect(project.files.map(file => file.name)).toEqual([
				"main.py",
				"../secret.py",
				"turtle.py",
				"_classes_artifacts/__init__.py"
			]);
			expect(project.activeFileName).toBe("../secret.py");
			expect(project.save).toHaveBeenCalled();
			expect(body.project.title).toBe("Cleaned loops practice");
			expect(
				body.project.files.map((file: { name: string }) => file.name)
			).toEqual(["main.py"]);
			expect(body.project.activeFileName).toBe("main.py");
		});
	});

	it("lets admins list saved projects with their staff review copies", async () => {
		await withUserRoutes(async baseUrl => {
			const response = await fetch(
				`${baseUrl}/users/${studentID}/python-projects`,
				{
					headers: { "x-admin-id": adminID.toString() }
				}
			);
			const body = await response.json();

			expect(response.status).toBe(200);
			expect(modelMocks.pythonProjectFind).toHaveBeenCalledWith(
				ownedProjectQuery(studentID, "user")
			);
			expect(body.projects).toHaveLength(1);
			expect(body.projects[0].project).not.toHaveProperty("files");
			expect(body.projects[0].review).not.toHaveProperty("files");

			const detailResponse = await fetch(
				`${baseUrl}/users/${studentID}/python-projects/${projectID}`,
				{ headers: { "x-admin-id": adminID.toString() } }
			);
			const detailBody = await detailResponse.json();
			expect(detailResponse.status).toBe(200);
			expect(detailBody.project.files[0].content).toBe(
				"print('student')\n"
			);
			expect(detailBody.review.files[0].content).toContain(
				"Try a for loop"
			);
		});
	});

	it("lets assigned tutors create a staff review copy from a student project", async () => {
		modelMocks.pythonProjectReviewFindOne.mockResolvedValue(null);

		await withUserRoutes(async baseUrl => {
			const response = await postJson(
				baseUrl,
				`/users/${studentID}/python-projects/${projectID}/review`,
				{},
				{ "x-tutor-id": tutorID.toString() }
			);
			const body = await response.json();

			expect(response.status).toBe(201);
			expect(modelMocks.pythonProjectReviewCreate).toHaveBeenCalledWith(
				expect.objectContaining({
					user: studentID,
					sourceProject: projectID,
					files: makeProject().files,
					visibleToStudent: false,
					reviewer: tutorID,
					reviewerRole: "tutor",
					lastEditedBy: tutorID,
					lastEditedByRole: "tutor"
				})
			);
			expect(body.review.sourceProject).toBe(projectID.toString());
			expect(body.review.visibleToStudent).toBe(false);
		});
	});

	it("sanitizes legacy stored files before creating a staff review copy", async () => {
		const unsafeProject = makeProject({
			activeFileName: "../secret.py",
			files: [
				{
					name: "main.py",
					content: "print('safe')\n",
					encoding: "text"
				},
				{
					name: "../secret.py",
					content: "print('secret')\n",
					encoding: "text"
				},
				{
					name: "images/../secret.png",
					content: "secret-image",
					encoding: "base64"
				}
			]
		});
		modelMocks.pythonProjectFindOne.mockResolvedValue(unsafeProject);
		modelMocks.pythonProjectReviewFindOne.mockResolvedValue(null);

		await withUserRoutes(async baseUrl => {
			const response = await postJson(
				baseUrl,
				`/users/${studentID}/python-projects/${projectID}/review`,
				{},
				{ "x-admin-id": adminID.toString() }
			);
			const body = await response.json();

			expect(response.status).toBe(201);
			expect(modelMocks.pythonProjectReviewCreate).toHaveBeenCalledWith(
				expect.objectContaining({
					activeFileName: "main.py",
					files: [
						{
							name: "main.py",
							content: "print('safe')\n",
							encoding: "text"
						}
					]
				})
			);
			expect(body.project.files).toEqual([
				{
					name: "main.py",
					content: "print('safe')\n",
					encoding: "text"
				}
			]);
			expect(body.review.files).toEqual([
				{
					name: "main.py",
					content: "print('safe')\n",
					encoding: "text"
				}
			]);
		});
	});

	it.each([
		"c",
		"assembly",
		"compiler",
		"hardening",
		"hardening-trace"
	] as const)(
		"saves, shares, and edits a %s review while preserving the learner's complete pack",
		async mode => {
			const requestedMode = mode === "c" ? "c" : "assembly";
			const fixture = JSON.parse(
				readFileSync(
					resolve(
						process.cwd(),
						mode === "hardening" || mode === "hardening-trace"
							? "../test/fixtures/assembly-hardening-contracts.json"
							: mode === "compiler"
								? "../test/fixtures/assembly-compiler-contracts.json"
								: mode === "assembly"
									? "../test/fixtures/assembly-opening-contracts.json"
									: "../test/fixtures/c17-opening-contracts.json"
					),
					"utf8"
				)
			);
			const pack =
				mode === "c"
					? "CSE-06-unit-1-why-c-for-systems-work"
					: fixture.pack;
			const activeFileName =
				mode === "hardening-trace"
					? "starter/trace.md"
					: mode === "compiler" || mode === "hardening"
						? "starter/analysis.md"
						: mode === "assembly"
							? "starter/routine.S"
							: "starter/main.c";
			const files = Object.entries(
				fixture.files as Record<string, { content: string }>
			)
				.filter(
					([path]) =>
						path.startsWith(`${pack}/starter/`) ||
						path === `${pack}/README.md`
				)
				.map(([path, file]) => ({
					name: path.slice(pack.length + 1),
					content: file.content,
					encoding: "text"
				}));
			const project = makeProject({
				mode: requestedMode,
				files,
				activeFileName,
				courseID:
					requestedMode === "assembly"
						? "assembly"
						: "c-systems-engineering",
				courseProjectKey:
					requestedMode === "assembly"
						? "assembly:compiler:starter:native-assembly"
						: "c-systems-engineering:linking:starter:native-c17",
				shared: true,
				shareID: "share_C17_native_123456789"
			});
			modelMocks.pythonProjectFindOne.mockResolvedValue(project);
			modelMocks.pythonProjectReviewFindOne.mockResolvedValueOnce(null);
			await withUserRoutes(async baseUrl => {
				const update = await putJson(
					baseUrl,
					`/users/loggedin/python-projects/${projectID}`,
					{ files, activeFileName },
					{ "x-user-id": studentID.toString() }
				);
				expect(update.status).toBe(200);
				expect((await update.json()).project.files).toEqual(files);
				const shared = await fetch(
					`${baseUrl}/users/python-projects/shared/${project.shareID}`
				);
				expect(shared.status).toBe(200);
				const sharedBody = await shared.json();
				expect(sharedBody.project.mode).toBe(requestedMode);
				expect(sharedBody.project.files).toEqual(files);
				const created = await postJson(
					baseUrl,
					`/users/${studentID}/python-projects/${projectID}/review`,
					{},
					{ "x-admin-id": adminID.toString() }
				);
				expect(created.status).toBe(201);
				expect((await created.json()).review.files).toEqual(files);
			});
			const review = makeReview({
				mode: requestedMode,
				files: structuredClone(files),
				activeFileName
			});
			modelMocks.pythonProjectReviewFindOne.mockResolvedValue(review);
			const revised = files.map(file =>
				file.name ===
				(mode === "c" ? "starter/labels.c" : activeFileName)
					? {
							...file,
							content: file.content + "\n/* staff feedback */\n"
						}
					: file
			);
			await withUserRoutes(async baseUrl => {
				const response = await putJson(
					baseUrl,
					`/users/${studentID}/python-projects/${projectID}/review/${reviewID}`,
					{ files: revised, visibleToStudent: true },
					{ "x-admin-id": adminID.toString() }
				);
				expect(response.status).toBe(200);
				const body = await response.json();
				expect(body.review.mode).toBe(requestedMode);
				expect(body.review.files).toEqual(revised);
				expect(body.project.files).toEqual(files);
				expect(project.files).toEqual(files);
			});
		}
	);

	it.each(
		JSON.parse(
			readFileSync(
				resolve(
					process.cwd(),
					"../test/fixtures/linux-owned-labs-contracts.json"
				),
				"utf8"
			)
		).flatMap(
			(fixture: {
				pack: string;
				files: Record<string, { content: string }>;
			}) => ["starter", "solution"].map(role => ({ fixture, role }))
		)
	)(
		"preserves exact Linux $fixture.pack/$role source through API workflows",
		async ({ fixture, role }) => {
			const requestedMode = "linux";
			const files = Object.entries(
				fixture.files as Record<string, { content: string }>
			)
				.filter(
					([path]) =>
						path === "README.md" || path.startsWith(`${role}/`)
				)
				.map(([name, file]) => ({
					name,
					content: file.content,
					encoding: "text"
				}));
			const activeFileName = files.find(
				file => file.name.endsWith(".sh") || file.name.endsWith(".py")
			)!.name;
			const project = makeProject({
				mode: requestedMode,
				files,
				activeFileName,
				courseID: "linux-systems",
				courseProjectKey: `linux-systems:${fixture.pack}:${role === "starter" ? "starter" : "reference"}:native-linux`,
				shared: true,
				shareID: "share_C17_native_123456789"
			});
			modelMocks.pythonProjectFindOne.mockResolvedValue(project);
			modelMocks.pythonProjectReviewFindOne.mockResolvedValueOnce(null);
			await withUserRoutes(async baseUrl => {
				const update = await putJson(
					baseUrl,
					`/users/loggedin/python-projects/${projectID}`,
					{ files, activeFileName },
					{ "x-user-id": studentID.toString() }
				);
				expect(update.status).toBe(200);
				expect((await update.json()).project.files).toEqual(files);
				const shared = await fetch(
					`${baseUrl}/users/python-projects/shared/${project.shareID}`
				);
				expect(shared.status).toBe(200);
				const sharedBody = await shared.json();
				expect(sharedBody.project.mode).toBe(requestedMode);
				expect(sharedBody.project.files).toEqual(files);
				const created = await postJson(
					baseUrl,
					`/users/${studentID}/python-projects/${projectID}/review`,
					{},
					{ "x-admin-id": adminID.toString() }
				);
				expect(created.status).toBe(201);
				expect((await created.json()).review.files).toEqual(files);
			});
			const review = makeReview({
				mode: requestedMode,
				files: structuredClone(files),
				activeFileName
			});
			modelMocks.pythonProjectReviewFindOne.mockResolvedValue(review);
			const revised = files.map(file =>
				file.name === activeFileName
					? {
							...file,
							content: file.content + "\n# staff feedback\n"
						}
					: file
			);
			await withUserRoutes(async baseUrl => {
				const response = await putJson(
					baseUrl,
					`/users/${studentID}/python-projects/${projectID}/review/${reviewID}`,
					{ files: revised, visibleToStudent: true },
					{ "x-admin-id": adminID.toString() }
				);
				expect(response.status).toBe(200);
				const body = await response.json();
				expect(body.review.mode).toBe(requestedMode);
				expect(body.review.files).toEqual(revised);
				expect(body.project.files).toEqual(files);
				expect(project.files).toEqual(files);
			});
		}
	);

	it("lets staff create and edit Java IDE review copies without backend execution", async () => {
		const javaFiles = [
			{
				name: "Main.java",
				content:
					"public class Main { public static void main(String[] args) {} }",
				encoding: "text"
			},
			{
				name: "Helper.java",
				content: "public class Helper {}",
				encoding: "text"
			}
		];
		const javaProject = makeProject({
			activeFileName: "Main.java",
			files: javaFiles,
			mode: "java",
			title: "Java classes"
		});
		const javaReview = makeReview({
			activeFileName: "Main.java",
			files: javaFiles,
			mode: "java",
			title: "Java classes"
		});
		modelMocks.pythonProjectFindOne.mockResolvedValueOnce(javaProject);
		modelMocks.pythonProjectReviewFindOne.mockResolvedValueOnce(null);
		modelMocks.pythonProjectReviewCreate.mockImplementationOnce(
			async payload => makeReview(payload)
		);

		await withUserRoutes(async baseUrl => {
			const createResponse = await postJson(
				baseUrl,
				`/users/${studentID}/python-projects/${projectID}/review`,
				{},
				{ "x-admin-id": adminID.toString() }
			);
			const createBody = await createResponse.json();

			expect(createResponse.status).toBe(201);
			expect(modelMocks.pythonProjectReviewCreate).toHaveBeenCalledWith(
				expect.objectContaining({
					activeFileName: "Main.java",
					files: javaFiles,
					mode: "java",
					title: "Java classes"
				})
			);
			expect(createBody.review.mode).toBe("java");
			expect(
				createBody.review.files.map(
					(file: { name: string }) => file.name
				)
			).toEqual(["Main.java", "Helper.java"]);
		});

		modelMocks.pythonProjectFindOne.mockResolvedValue(javaProject);
		modelMocks.pythonProjectReviewFindOne.mockResolvedValue(javaReview);

		await withUserRoutes(async baseUrl => {
			const updateResponse = await putJson(
				baseUrl,
				`/users/${studentID}/python-projects/${projectID}/review/${reviewID}`,
				{
					activeFileName: "Main.java",
					files: [
						{
							name: "Main.java",
							content:
								'public class Main { public static void main(String[] args) { System.out.println("reviewed"); } }'
						}
					],
					visibleToStudent: true
				},
				{ "x-admin-id": adminID.toString() }
			);
			const updateBody = await updateResponse.json();

			expect(updateResponse.status).toBe(200);
			expect(javaReview.save).toHaveBeenCalled();
			expect(updateBody.project.files).toEqual(javaFiles);
			expect(updateBody.review.mode).toBe("java");
			expect(updateBody.review.files).toEqual([
				{
					name: "Main.java",
					content:
						'public class Main { public static void main(String[] args) { System.out.println("reviewed"); } }',
					encoding: "text"
				}
			]);
			expect(updateBody.review.visibleToStudent).toBe(true);
		});
	});

	it("blocks tutors from reviewing code for students not assigned to them", async () => {
		modelMocks.userFindById.mockImplementation(() =>
			queryWith(makeStudent([otherTutorID]))
		);

		await withUserRoutes(async baseUrl => {
			const response = await postJson(
				baseUrl,
				`/users/${studentID}/python-projects/${projectID}/review`,
				{},
				{ "x-tutor-id": tutorID.toString() }
			);

			expect(response.status).toBe(403);
			expect(modelMocks.pythonProjectReviewCreate).not.toHaveBeenCalled();
		});
	});

	it("updates only the staff review copy and visibility flag", async () => {
		const review = makeReview();
		modelMocks.pythonProjectReviewFindOne.mockResolvedValue(review);

		await withUserRoutes(async baseUrl => {
			const response = await putJson(
				baseUrl,
				`/users/${studentID}/python-projects/${projectID}/review/${reviewID}`,
				{
					files: [
						{
							name: "main.py",
							content:
								"# Nice decomposition.\nprint('reviewed')\n"
						}
					],
					activeFileName: "main.py",
					visibleToStudent: true,
					note: "Review this before the next lesson."
				},
				{ "x-tutor-id": tutorID.toString() }
			);
			const body = await response.json();

			expect(response.status).toBe(200);
			expect(review.save).toHaveBeenCalled();
			expect(body.project.files[0].content).toBe("print('student')\n");
			expect(body.review.files[0].content).toContain(
				"Nice decomposition"
			);
			expect(body.review.visibleToStudent).toBe(true);
			expect(body.review.note).toBe(
				"Review this before the next lesson."
			);
			expect(body.review.lastEditedByRole).toBe("tutor");
		});
	});

	it("refreshes a stale staff review copy from the current student project only", async () => {
		const latestSourceUpdatedAt = new Date("2026-06-20T12:45:00.000Z");
		const latestFiles = [
			{
				name: "main.py",
				content: "print('latest student code')\n",
				encoding: "text"
			},
			{
				name: "helper.py",
				content: "def help_student():\n\treturn True\n",
				encoding: "text"
			}
		];
		const project = makeProject({
			activeFileName: "helper.py",
			courseProjectTitle: "Latest loops practice",
			files: latestFiles,
			title: "Latest loops practice",
			updatedAt: latestSourceUpdatedAt
		});
		const review = makeReview({
			files: [
				{
					name: "main.py",
					content: "# stale copy\nprint('review')\n",
					encoding: "text"
				}
			],
			sourceUpdatedAt: now
		});
		modelMocks.pythonProjectFindOne.mockResolvedValue(project);
		modelMocks.pythonProjectReviewFindOne.mockResolvedValue(review);

		await withUserRoutes(async baseUrl => {
			const response = await putJson(
				baseUrl,
				`/users/${studentID}/python-projects/${projectID}/review/${reviewID}`,
				{
					note: "Refreshing before review.",
					refreshFromSource: true,
					visibleToStudent: true
				},
				{ "x-admin-id": adminID.toString() }
			);
			const body = await response.json();

			expect(response.status).toBe(200);
			expect(project.files).toEqual(latestFiles);
			expect(project.save).not.toHaveBeenCalled();
			expect(review.files).toEqual(latestFiles);
			expect(review.activeFileName).toBe("helper.py");
			expect(review.sourceUpdatedAt).toBe(latestSourceUpdatedAt);
			expect(review.title).toBe("Latest loops practice");
			expect(review.courseProjectTitle).toBe("Latest loops practice");
			expect(review.note).toBe("Refreshing before review.");
			expect(review.visibleToStudent).toBe(true);
			expect(review.save).toHaveBeenCalled();
			expect(body.project.files).toEqual(latestFiles);
			expect(body.review.files).toEqual(latestFiles);
			expect(body.review.sourceUpdatedAt).toBe(
				latestSourceUpdatedAt.toISOString()
			);
		});
	});

	it("preserves legacy review files while filtering visibility responses", async () => {
		const review = makeReview({
			activeFileName: "../secret.py",
			files: [
				{
					name: "main.py",
					content: "# Safe review note.\nprint('review')\n",
					encoding: "text"
				},
				{
					name: "../secret.py",
					content: "# Hidden legacy file.\n",
					encoding: "text"
				},
				{
					name: "pygame.py",
					content: "# Runtime-reserved module.\n",
					encoding: "text"
				},
				{
					name: "_classes_artifacts/__init__.py",
					content: "# Runtime-reserved package.\n",
					encoding: "text"
				}
			]
		});
		modelMocks.pythonProjectReviewFindOne.mockResolvedValue(review);

		await withUserRoutes(async baseUrl => {
			const response = await putJson(
				baseUrl,
				`/users/${studentID}/python-projects/${projectID}/review/${reviewID}`,
				{ visibleToStudent: true },
				{ "x-admin-id": adminID.toString() }
			);
			const body = await response.json();

			expect(response.status).toBe(200);
			expect(review.files.map(file => file.name)).toEqual([
				"main.py",
				"../secret.py",
				"pygame.py",
				"_classes_artifacts/__init__.py"
			]);
			expect(review.activeFileName).toBe("../secret.py");
			expect(review.visibleToStudent).toBe(true);
			expect(review.save).toHaveBeenCalled();
			expect(
				body.review.files.map((file: { name: string }) => file.name)
			).toEqual(["main.py"]);
			expect(body.review.activeFileName).toBe("main.py");
		});
	});

	it("lists only visible review copies for the logged-in student", async () => {
		modelMocks.pythonProjectReviewFind.mockReturnValue(
			queryWith([
				makeReview({
					visibleToStudent: true,
					note: "Tutor comments are in the code."
				})
			])
		);

		await withUserRoutes(async baseUrl => {
			const response = await fetch(
				`${baseUrl}/users/loggedin/python-project-reviews`,
				{
					headers: { "x-user-id": studentID.toString() }
				}
			);
			const body = await response.json();

			expect(response.status).toBe(200);
			expect(modelMocks.pythonProjectReviewFind).toHaveBeenCalledWith({
				user: studentID,
				visibleToStudent: true
			});
			expect(body.reviews).toHaveLength(1);
			expect(body.reviews[0].sourceProject).toBe(projectID.toString());
			expect(body.reviews[0].note).toBe(
				"Tutor comments are in the code."
			);
		});
	});

	it("lets signed-in students create and disable a share link for their own project", async () => {
		const project = makeProject();
		modelMocks.pythonProjectFindOne.mockResolvedValue(project);

		await withUserRoutes(async baseUrl => {
			const enableResponse = await putJson(
				baseUrl,
				`/users/loggedin/python-projects/${projectID}/share`,
				{ shared: true },
				{ "x-user-id": studentID.toString() }
			);
			const enableBody = await enableResponse.json();

			expect(enableResponse.status).toBe(200);
			expect(modelMocks.pythonProjectFindOne).toHaveBeenCalledWith({
				_id: new Types.ObjectId(projectID),
				...ownedProjectQuery(studentID, "user")
			});
			expect(project.shared).toBe(true);
			expect(project.shareID).toMatch(/^[\w-]{20,80}$/);
			expect(project.shareCreatedAt).toBeInstanceOf(Date);
			expect(project.save).toHaveBeenCalled();
			expect(enableBody.project.shared).toBe(true);
			expect(enableBody.project.shareID).toBe(project.shareID);

			const firstShareID = project.shareID;
			const disableResponse = await putJson(
				baseUrl,
				`/users/loggedin/python-projects/${projectID}/share`,
				{ shared: false },
				{ "x-user-id": studentID.toString() }
			);
			const disableBody = await disableResponse.json();

			expect(disableResponse.status).toBe(200);
			expect(project.shared).toBe(false);
			expect(project.shareID).toBeUndefined();
			expect(project.shareCreatedAt).toBeUndefined();
			expect(disableBody.project.shared).toBe(false);
			expect(disableBody.project.shareID).toBeUndefined();

			const reenableResponse = await putJson(
				baseUrl,
				`/users/loggedin/python-projects/${projectID}/share`,
				{ shared: true },
				{ "x-user-id": studentID.toString() }
			);
			const reenableBody = await reenableResponse.json();

			expect(reenableResponse.status).toBe(200);
			expect(project.shared).toBe(true);
			expect(project.shareID).toMatch(/^[\w-]{20,80}$/);
			expect(project.shareID).not.toBe(firstShareID);
			expect(project.shareCreatedAt).toBeInstanceOf(Date);
			expect(reenableBody.project.shareID).toBe(project.shareID);
		});
	});

	it("preserves legacy files while filtering an enabled share link", async () => {
		const shareID = "share_EXISTING123456789_xyz";
		const project = makeProject({
			activeFileName: "../secret.py",
			files: [
				{
					name: "main.py",
					content: "print('safe shared code')\n",
					encoding: "text"
				},
				{
					name: "../secret.py",
					content: "print('secret')\n",
					encoding: "text"
				}
			],
			shared: true,
			shareID,
			shareCreatedAt: now
		});
		modelMocks.pythonProjectFindOne.mockResolvedValue(project);

		await withUserRoutes(async baseUrl => {
			const response = await putJson(
				baseUrl,
				`/users/loggedin/python-projects/${projectID}/share`,
				{ shared: true },
				{ "x-user-id": studentID.toString() }
			);
			const body = await response.json();

			expect(response.status).toBe(200);
			expect(project.files.map(file => file.name)).toEqual([
				"main.py",
				"../secret.py"
			]);
			expect(project.activeFileName).toBe("../secret.py");
			expect(project.shareID).toBe(shareID);
			expect(project.save).toHaveBeenCalled();
			expect(
				body.project.files.map((file: { name: string }) => file.name)
			).toEqual(["main.py"]);
			expect(body.project.activeFileName).toBe("main.py");
		});
	});

	it("lets signed-in admins create and share their own Code IDE projects", async () => {
		const adminProject = makeProject({
			_id: projectID,
			user: adminID,
			ownerRole: "admin"
		});
		modelMocks.pythonProjectFindOne.mockResolvedValue(adminProject);

		await withUserRoutes(async baseUrl => {
			const createResponse = await postJson(
				baseUrl,
				"/users/loggedin/python-projects",
				{
					files: [
						{
							content: "print('admin project')\n",
							name: "main.py"
						}
					],
					mode: "python",
					title: "Admin project"
				},
				{ "x-admin-id": adminID.toString() }
			);
			const createBody = await createResponse.json();

			expect(createResponse.status).toBe(201);
			expect(modelMocks.pythonProjectCreate).toHaveBeenCalledWith(
				expect.objectContaining({
					ownerRole: "admin",
					title: "Admin project",
					user: adminID
				})
			);
			expect(createBody.project.title).toBe("Admin project");

			const shareResponse = await putJson(
				baseUrl,
				`/users/loggedin/python-projects/${projectID}/share`,
				{ shared: true },
				{ "x-admin-id": adminID.toString() }
			);
			const shareBody = await shareResponse.json();

			expect(shareResponse.status).toBe(200);
			expect(modelMocks.pythonProjectFindOne).toHaveBeenCalledWith({
				_id: new Types.ObjectId(projectID),
				...ownedProjectQuery(adminID, "admin")
			});
			expect(adminProject.shared).toBe(true);
			expect(adminProject.shareID).toMatch(/^[\w-]{20,80}$/);
			expect(adminProject.save).toHaveBeenCalled();
			expect(shareBody.project.shared).toBe(true);
			expect(shareBody.project.shareID).toBe(adminProject.shareID);
		});
	});

	it("serves only enabled shared Code IDE project links without a login", async () => {
		const shareID = "share_ABC1234567890_xyz";
		modelMocks.pythonProjectFindOne.mockResolvedValue(
			makeProject({
				shared: true,
				shareID,
				shareCreatedAt: now,
				sharedSourceID: "share_IMPORTED123456789_xyz"
			})
		);

		await withUserRoutes(async baseUrl => {
			const response = await fetch(
				`${baseUrl}/users/python-projects/shared/${shareID}`
			);
			const body = await response.json();

			expect(response.status).toBe(200);
			expect(modelMocks.pythonProjectFindOne).toHaveBeenCalledWith({
				shareID,
				shared: true
			});
			expect(body.project.title).toBe("Loops practice");
			expect(body.project.files[0].content).toBe("print('student')\n");
			expect(body.project).not.toHaveProperty("_id");
			expect(body.project).not.toHaveProperty("shared");
			expect(body.project).not.toHaveProperty("shareID");
			expect(body.project).not.toHaveProperty("shareCreatedAt");
			expect(body.project).not.toHaveProperty("sharedSourceID");
			expect(body.project).not.toHaveProperty("createdAt");
			expect(body.project).not.toHaveProperty("updatedAt");
		});
	});

	it("sanitizes stored file records before serving public shared project links", async () => {
		const shareID = "share_SAFE1234567890_xyz";
		modelMocks.pythonProjectFindOne.mockResolvedValue(
			makeProject({
				activeFileName: "../secret.py",
				files: [
					{
						name: "main.py",
						content: "print('safe')\n",
						encoding: "text"
					},
					{
						name: "../secret.py",
						content: "print('secret')\n",
						encoding: "text"
					},
					{
						name: "images/../secret.png",
						content: "secret-image",
						encoding: "base64"
					},
					{
						name: "turtle.py",
						content: "print('reserved')\n",
						encoding: "text"
					},
					{
						name: "_classes_artifacts/__init__.py",
						content: "print('shadow')\n",
						encoding: "text"
					}
				],
				shared: true,
				shareID,
				shareCreatedAt: now
			})
		);

		await withUserRoutes(async baseUrl => {
			const response = await fetch(
				`${baseUrl}/users/python-projects/shared/${shareID}`
			);
			const body = await response.json();

			expect(response.status).toBe(200);
			expect(body.project.files).toEqual([
				{
					name: "main.py",
					content: "print('safe')\n",
					encoding: "text"
				}
			]);
			expect(body.project.activeFileName).toBe("main.py");
		});
	});

	it("keeps revoked share URLs unavailable when sharing is re-enabled", async () => {
		const revokedShareID = "share_REVOKED1234567890_xyz";
		const project = makeProject({
			shared: false,
			shareID: revokedShareID,
			shareCreatedAt: now
		});
		modelMocks.pythonProjectFindOne.mockImplementation(
			async (query: Record<string, unknown>) => {
				if ("shareID" in query) {
					return query.shareID === project.shareID && project.shared
						? project
						: null;
				}

				return project;
			}
		);

		await withUserRoutes(async baseUrl => {
			const revokedBeforeResponse = await fetch(
				`${baseUrl}/users/python-projects/shared/${revokedShareID}`
			);

			expect(revokedBeforeResponse.status).toBe(404);

			const enableResponse = await putJson(
				baseUrl,
				`/users/loggedin/python-projects/${projectID}/share`,
				{ shared: true },
				{ "x-user-id": studentID.toString() }
			);
			const enableBody = await enableResponse.json();

			expect(enableResponse.status).toBe(200);
			expect(project.shared).toBe(true);
			expect(project.shareID).toMatch(/^[\w-]{20,80}$/);
			expect(project.shareID).not.toBe(revokedShareID);
			expect(enableBody.project.shareID).toBe(project.shareID);

			const revokedAfterResponse = await fetch(
				`${baseUrl}/users/python-projects/shared/${revokedShareID}`
			);
			const freshShareResponse = await fetch(
				`${baseUrl}/users/python-projects/shared/${project.shareID}`
			);
			const freshShareBody = await freshShareResponse.json();

			expect(revokedAfterResponse.status).toBe(404);
			expect(freshShareResponse.status).toBe(200);
			expect(freshShareBody.project.title).toBe(project.title);
			expect(freshShareBody.project).not.toHaveProperty("shareID");
		});
	});

	it("deletes staff review copies when the source project is deleted", async () => {
		const project = makeProject();
		modelMocks.pythonProjectFindOne.mockResolvedValue(project);

		await withUserRoutes(async baseUrl => {
			const response = await fetch(
				`${baseUrl}/users/loggedin/python-projects/${projectID}`,
				{
					headers: { "x-user-id": studentID.toString() },
					method: "DELETE"
				}
			);

			expect(response.status).toBe(204);
			expect(modelMocks.pythonProjectFindOne).toHaveBeenCalledWith({
				_id: new Types.ObjectId(projectID),
				...ownedProjectQuery(studentID, "user")
			});
			expect(project.deleteOne).toHaveBeenCalled();
			expect(
				modelMocks.pythonProjectReviewDeleteMany
			).toHaveBeenCalledWith({
				sourceProject: projectID
			});
		});
	});
});
