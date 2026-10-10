import type { Server } from "node:http";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import express from "express";
import { Types } from "mongoose";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createPythonProject } from "../src/controllers/users/pythonProjectController.js";

const modelMocks = vi.hoisted(() => ({
	pythonProjectCountDocuments: vi.fn(),
	pythonProjectCreate: vi.fn()
}));

vi.mock("../src/models/schemas/PythonProject.js", () => ({
	PythonProject: {
		countDocuments: modelMocks.pythonProjectCountDocuments,
		create: modelMocks.pythonProjectCreate
	}
}));

const userID = new Types.ObjectId();
const courseCodeLearnerID = new Types.ObjectId();

async function withPythonProjectRoute<T>(
	run: (baseUrl: string) => Promise<T>,
	owner: "course-code" | "user" = "user"
): Promise<T> {
	const app = express();
	app.use(express.json({ limit: "15mb" }));
	app.use((req: any, _res, next) => {
		if (owner === "course-code") {
			req.currentCourseCodeLearner = {
				_id: courseCodeLearnerID,
				courseID: "python-level-1"
			};
		} else {
			req.currentUser = {
				_id: userID
			};
		}
		next();
	});
	app.post("/users/loggedin/python-projects", createPythonProject);

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

async function postJson(baseUrl: string, body: unknown) {
	return fetch(`${baseUrl}/users/loggedin/python-projects`, {
		body: JSON.stringify(body),
		headers: {
			"content-type": "application/json"
		},
		method: "POST"
	});
}

describe("Python project routes", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		modelMocks.pythonProjectCountDocuments.mockReturnValue({
			exec: vi.fn().mockResolvedValue(0)
		});
		modelMocks.pythonProjectCreate.mockImplementation(async project => ({
			_id: new Types.ObjectId(),
			createdAt: new Date("2026-06-18T12:00:00.000Z"),
			updatedAt: new Date("2026-06-18T12:00:00.000Z"),
			...project
		}));
	});

	it("rejects project creation when the account storage quota is reached", async () => {
		modelMocks.pythonProjectCountDocuments.mockReturnValue({
			exec: vi.fn().mockResolvedValue(200)
		});

		await withPythonProjectRoute(async baseUrl => {
			const response = await postJson(baseUrl, {
				files: [{ name: "main.py", content: "print('hello')" }],
				title: "Over quota"
			});

			expect(response.status).toBe(409);
			expect(modelMocks.pythonProjectCreate).not.toHaveBeenCalled();
		});
	});

	it("saves original Conway input records for user and course-code accounts", async () => {
		const files = [
			{ name: "main.py", content: "print('learner reminder')\n" },
			{ name: "player1.in", content: "4 0 \r\n4 1\r\n5 2" },
			{ name: "player2.in", content: "4 8\n5 6\n" }
		];
		for (const owner of ["user", "course-code"] as const) {
			await withPythonProjectRoute(async baseUrl => {
				const response = await postJson(baseUrl, {
					files,
					title: "Conway",
					mode: "python"
				});
				expect(response.status).toBe(201);
				const body = await response.json();
				expect(body.project.files).toEqual(
					files.map(file => ({ ...file, encoding: "text" }))
				);
				expect(modelMocks.pythonProjectCreate).toHaveBeenLastCalledWith(
					expect.objectContaining({
						files: files.map(file => ({
							...file,
							encoding: "text"
						})),
						user: owner === "user" ? userID : courseCodeLearnerID
					})
				);
				for (const name of [
					"../repeat.in",
					"/repeat.in",
					"folder/repeat.in"
				]) {
					const invalid = await postJson(baseUrl, {
						files: [...files, { name, content: "0 0" }]
					});
					expect(invalid.status).toBe(400);
				}
			}, owner);
		}
	});

	it("saves complete native Java packs with root text answer files", async () => {
		const files = [
			{
				name: "Main.java",
				content:
					"class Main { public static void main(String[] args) {} }\n"
			},
			{ name: "README.md", content: "# Native reference\n" },
			{ name: "sample.in", content: "1\n0\n" },
			{ name: "bphoto.in", content: "1\r\n0\r\n" },
			{ name: "bphoto.out", content: "0\n" }
		];
		for (const owner of ["user", "course-code"] as const) {
			await withPythonProjectRoute(async baseUrl => {
				const response = await postJson(baseUrl, {
					files,
					activeFileName: "bphoto.out",
					mode: "java",
					title: "Native Java reference"
				});
				expect(response.status).toBe(201);
				const body = await response.json();
				expect(body.project.files).toEqual(
					files.map(file => ({ ...file, encoding: "text" }))
				);
				expect(modelMocks.pythonProjectCreate).toHaveBeenLastCalledWith(
					expect.objectContaining({
						files: files.map(file => ({
							...file,
							encoding: "text"
						})),
						user: owner === "user" ? userID : courseCodeLearnerID
					})
				);
				for (const name of [
					"../bphoto.out",
					"/bphoto.out",
					"nested/bphoto.out",
					"bphoto.exe"
				]) {
					const invalid = await postJson(baseUrl, {
						files: [...files, { name, content: "0\n" }],
						mode: "java"
					});
					expect(invalid.status).toBe(400);
				}
			}, owner);
		}
	});

	it("accepts nested Python package files for signed-in IDE projects", async () => {
		await withPythonProjectRoute(async baseUrl => {
			const response = await postJson(baseUrl, {
				activeFileName: "package/util.py",
				files: [
					{
						content: "",
						name: "package/__init__.py"
					},
					{
						content: "def run():\n\treturn 1\n",
						name: "package/util.py"
					}
				],
				mode: "python",
				title: "Package demo"
			});
			const body = await response.json();

			expect(response.status).toBe(201);
			expect(modelMocks.pythonProjectCreate).toHaveBeenCalledWith(
				expect.objectContaining({
					activeFileName: "package/util.py",
					files: [
						{
							content: "",
							encoding: "text",
							name: "package/__init__.py"
						},
						{
							content: "def run():\n\treturn 1\n",
							encoding: "text",
							name: "package/util.py"
						}
					],
					user: userID
				})
			);
			expect(
				body.project.files.map((file: { name: string }) => file.name)
			).toEqual(["package/__init__.py", "package/util.py"]);
		});
	});

	it("stores a course-code learner project under only the granted course", async () => {
		await withPythonProjectRoute(async baseUrl => {
			const response = await postJson(baseUrl, {
				activeFileName: "main.py",
				courseID: "java-level-1",
				files: [{ content: "print('classroom')\n", name: "main.py" }],
				mode: "python",
				title: "Classroom project"
			});

			expect(response.status).toBe(201);
			expect(modelMocks.pythonProjectCreate).toHaveBeenCalledWith(
				expect.objectContaining({
					courseID: "python-level-1",
					ownerRole: "courseCodeLearner",
					user: courseCodeLearnerID
				})
			);
		}, "course-code");
	});

	it("accepts nested Java package files for signed-in IDE projects", async () => {
		await withPythonProjectRoute(async baseUrl => {
			const response = await postJson(baseUrl, {
				activeFileName: "src/main/java/Main.java",
				files: [
					{
						content: "package main.java;\npublic class Helper {}\n",
						name: "src/main/java/Helper.java"
					},
					{
						content:
							"package main.java;\npublic class Main { public static void main(String[] args) {} }\n",
						name: "src/main/java/Main.java"
					}
				],
				mode: "java",
				title: "Java package demo"
			});
			const body = await response.json();

			expect(response.status).toBe(201);
			expect(modelMocks.pythonProjectCreate).toHaveBeenCalledWith(
				expect.objectContaining({
					activeFileName: "src/main/java/Main.java",
					files: [
						{
							content:
								"package main.java;\npublic class Helper {}\n",
							encoding: "text",
							name: "src/main/java/Helper.java"
						},
						{
							content:
								"package main.java;\npublic class Main { public static void main(String[] args) {} }\n",
							encoding: "text",
							name: "src/main/java/Main.java"
						}
					],
					mode: "java",
					user: userID
				})
			);
			expect(
				body.project.files.map((file: { name: string }) => file.name)
			).toEqual(["src/main/java/Helper.java", "src/main/java/Main.java"]);
		});
	});

	it("allows Java packages and case-distinct Python packages outside shim paths", async () => {
		await withPythonProjectRoute(async baseUrl => {
			const javaResponse = await postJson(baseUrl, {
				files: [
					{
						name: "pygame/Main.java",
						content: "public class Main {}"
					}
				],
				mode: "java",
				title: "Java package"
			});
			expect(javaResponse.status).toBe(201);

			const pythonResponse = await postJson(baseUrl, {
				files: [
					{ name: "main.py", content: "print('ok')\n" },
					{ name: "Turtle/__init__.py", content: "value = 1\n" }
				],
				mode: "python",
				title: "Case-distinct package"
			});
			expect(pythonResponse.status).toBe(201);
		});
	});

	it("accepts Turtle PostScript files saved by the browser runtime", async () => {
		await withPythonProjectRoute(async baseUrl => {
			const response = await postJson(baseUrl, {
				activeFileName: "main.py",
				files: [
					{ content: "import turtle\n", name: "main.py" },
					{
						content: "%!PS-Adobe-3.0 EPSF-3.0\nshowpage\n",
						name: "drawing.eps"
					}
				],
				mode: "turtle",
				title: "Saved Turtle drawing"
			});

			expect(response.status).toBe(201);
			expect(modelMocks.pythonProjectCreate).toHaveBeenCalledWith(
				expect.objectContaining({
					files: expect.arrayContaining([
						expect.objectContaining({
							encoding: "text",
							name: "drawing.eps"
						})
					])
				})
			);
		});
	});

	it("accepts the editor's 40-file project limit", async () => {
		await withPythonProjectRoute(async baseUrl => {
			const files = Array.from({ length: 40 }, (_value, index) => ({
				content: `print(${index})\n`,
				name: index === 0 ? "main.py" : `helper_${index}.py`
			}));
			const response = await postJson(baseUrl, {
				files,
				mode: "python",
				title: "Forty file project"
			});

			expect(response.status).toBe(201);
			expect(modelMocks.pythonProjectCreate).toHaveBeenCalledWith(
				expect.objectContaining({
					files: expect.arrayContaining([
						expect.objectContaining({ name: "helper_39.py" })
					])
				})
			);
		});
	});

	it("rejects projects above the editor's 40-file project limit", async () => {
		await withPythonProjectRoute(async baseUrl => {
			const files = Array.from({ length: 41 }, (_value, index) => ({
				content: `print(${index})\n`,
				name: index === 0 ? "main.py" : `helper_${index}.py`
			}));
			const response = await postJson(baseUrl, {
				files,
				mode: "python",
				title: "Too many files"
			});

			expect(response.status).toBe(400);
		});
	});

	it("accepts Java and Karel IDE payloads as browser-only stored projects", async () => {
		await withPythonProjectRoute(async baseUrl => {
			const payloads = [
				{
					activeFileName: "Main.java",
					files: [
						{
							content:
								"public class Main { public static void main(String[] args) {} }",
							name: "Main.java"
						}
					],
					mode: "java",
					title: "Java browser project"
				},
				{
					activeFileName: "Algo.java",
					files: [
						{
							content:
								"public class Algo { public static void main(String[] args) {} }",
							name: "Algo.java"
						},
						{
							content: "Dimension: (10, 10)",
							name: "world.txt"
						}
					],
					mode: "karel",
					title: "Karel browser project"
				}
			];

			for (const payload of payloads) {
				const response = await postJson(baseUrl, payload);
				const body = await response.json();

				expect(response.status).toBe(201);
				expect(body.project.mode).toBe(payload.mode);
				expect(body.project.activeFileName).toBe(
					payload.activeFileName
				);
			}
		});

		expect(modelMocks.pythonProjectCreate).toHaveBeenCalledTimes(2);
		expect(modelMocks.pythonProjectCreate).toHaveBeenNthCalledWith(
			1,
			expect.objectContaining({
				activeFileName: "Main.java",
				files: [
					{
						content:
							"public class Main { public static void main(String[] args) {} }",
						encoding: "text",
						name: "Main.java"
					}
				],
				mode: "java",
				title: "Java browser project",
				user: userID
			})
		);
		expect(modelMocks.pythonProjectCreate).toHaveBeenNthCalledWith(
			2,
			expect.objectContaining({
				activeFileName: "Algo.java",
				files: [
					{
						content:
							"public class Algo { public static void main(String[] args) {} }",
						encoding: "text",
						name: "Algo.java"
					},
					{
						content: "Dimension: (10, 10)",
						encoding: "text",
						name: "world.txt"
					}
				],
				mode: "karel",
				title: "Karel browser project",
				user: userID
			})
		);
	});

	it("uses generalized fallback titles for untitled Code IDE projects", async () => {
		await withPythonProjectRoute(async baseUrl => {
			const defaultResponse = await postJson(baseUrl, {});
			const javaResponse = await postJson(baseUrl, {
				activeFileName: "Main.java",
				files: [
					{
						content:
							"public class Main { public static void main(String[] args) {} }",
						name: "Main.java"
					}
				],
				mode: "java"
			});
			const defaultBody = await defaultResponse.json();
			const javaBody = await javaResponse.json();

			expect(defaultResponse.status).toBe(201);
			expect(javaResponse.status).toBe(201);
			expect(defaultBody.project.title).toBe("Untitled Code Project");
			expect(javaBody.project.title).toBe("Untitled Code Project");
		});

		expect(modelMocks.pythonProjectCreate).toHaveBeenNthCalledWith(
			1,
			expect.objectContaining({
				activeFileName: "main.py",
				files: [
					{
						content: "",
						encoding: "text",
						name: "main.py"
					}
				],
				mode: "python",
				title: "Untitled Code Project",
				user: userID
			})
		);
		expect(modelMocks.pythonProjectCreate).toHaveBeenNthCalledWith(
			2,
			expect.objectContaining({
				activeFileName: "Main.java",
				files: [
					{
						content:
							"public class Main { public static void main(String[] args) {} }",
						encoding: "text",
						name: "Main.java"
					}
				],
				mode: "java",
				title: "Untitled Code Project",
				user: userID
			})
		);
	});

	it("stores multi-file C++ projects for user and course-code owners", async () => {
		const files = [
			{
				name: "main.cpp",
				content: '#include "include/Task.hpp"\nint main() {}\n'
			},
			{ name: "src/Task.cc", content: '#include "include/Task.hpp"\n' },
			{ name: "include/Task.hpp", content: "#pragma once\n" },
			{ name: "README.md", content: "Build both sources.\n" },
			{
				name: "Makefile",
				content: "main:\n\tc++ main.cpp src/Task.cc -o main\n"
			}
		];
		for (const owner of ["user", "course-code"] as const) {
			await withPythonProjectRoute(async baseUrl => {
				const response = await postJson(baseUrl, {
					mode: "cpp",
					files,
					activeFileName: "main.cpp"
				});
				expect(response.status).toBe(201);
				const body = await response.json();
				expect(body.project.mode).toBe("cpp");
				expect(body.project.files).toEqual(
					files.map(file => ({ ...file, encoding: "text" }))
				);
			}, owner);
		}
		expect(modelMocks.pythonProjectCreate.mock.calls[0]?.[0].user).toEqual(
			userID
		);
		expect(modelMocks.pythonProjectCreate.mock.calls[1]?.[0]).toMatchObject(
			{ user: courseCodeLearnerID, ownerRole: "courseCodeLearner" }
		);
	});

	it("stores the complete C++ score pack and preserves tab-separated data for both owners", async () => {
		const files = [
			{
				name: "main.cpp",
				content: "#include <iostream>\nint main() {}\n"
			},
			{
				name: "Makefile",
				content: "main: main.cpp\n\tc++ main.cpp -o main\n"
			},
			{ name: "README.md", content: "# Resource-safe file processor\n" },
			{
				name: "scores.tsv",
				content: "CPPI4_SCORES_V1\r\nAda\t84\r\nLin\t59\r\n"
			}
		];
		for (const owner of ["user", "course-code"] as const) {
			await withPythonProjectRoute(async baseUrl => {
				const response = await postJson(baseUrl, {
					mode: "cpp",
					files,
					activeFileName: "main.cpp"
				});
				expect(response.status).toBe(201);
				const body = await response.json();
				expect(body.project.files).toEqual(
					files.map(file => ({ ...file, encoding: "text" }))
				);
				expect(body.project.activeFileName).toBe("main.cpp");
			}, owner);
		}
		expect(modelMocks.pythonProjectCreate).toHaveBeenCalledTimes(2);
		for (const [payload] of modelMocks.pythonProjectCreate.mock.calls) {
			expect(payload.files).toEqual(
				files.map(file => ({ ...file, encoding: "text" }))
			);
		}
		expect(modelMocks.pythonProjectCreate.mock.calls[0]?.[0].user).toEqual(
			userID
		);
		expect(modelMocks.pythonProjectCreate.mock.calls[1]?.[0]).toMatchObject(
			{ user: courseCodeLearnerID, ownerRole: "courseCodeLearner" }
		);
	});

	it("keeps tab-separated data at safe root paths and rejects a data-only C++ project", async () => {
		await withPythonProjectRoute(async baseUrl => {
			for (const name of [
				"../scores.tsv",
				"src/scores.tsv",
				"images/scores.tsv",
				"scores.tsv.exe",
				"scores\\data.tsv"
			]) {
				const response = await postJson(baseUrl, {
					mode: "cpp",
					files: [
						{ name: "main.cpp", content: "int main() {}" },
						{ name, content: "CPPI4_SCORES_V1\n" }
					]
				});
				expect(response.status).toBe(400);
			}
			const response = await postJson(baseUrl, {
				mode: "cpp",
				files: [{ name: "scores.tsv", content: "CPPI4_SCORES_V1\n" }]
			});
			expect(response.status).toBe(400);
		});
		expect(modelMocks.pythonProjectCreate).not.toHaveBeenCalled();
	});

	it("keeps build files inert and rejects unsupported build-file paths", async () => {
		await withPythonProjectRoute(async baseUrl => {
			for (const name of ["../Makefile", "src/Makefile", "Makefile.sh"]) {
				const response = await postJson(baseUrl, {
					mode: "cpp",
					files: [
						{ name: "main.cpp", content: "int main() {}" },
						{ name, content: "all:\n\techo build\n" }
					]
				});
				expect(response.status).toBe(400);
			}
			const response = await postJson(baseUrl, {
				mode: "cpp",
				files: [{ name: "Makefile", content: "all:\n\techo build\n" }]
			});
			expect(response.status).toBe(400);
		});
		expect(modelMocks.pythonProjectCreate).not.toHaveBeenCalled();
	});

	it("rejects C++ header-only, wrong-language and unsafe path projects", async () => {
		await withPythonProjectRoute(async baseUrl => {
			for (const name of [
				"Only.h",
				"main.py",
				"Main.java",
				"../main.cpp",
				"images/main.cpp",
				"main';touch.cpp"
			]) {
				const response = await postJson(baseUrl, {
					mode: "cpp",
					files: [{ name, content: "" }]
				});
				expect(response.status).toBe(400);
			}
		});
		expect(modelMocks.pythonProjectCreate).not.toHaveBeenCalled();
	});

	it("rejects project payloads that do not include a code file for the selected mode", async () => {
		await withPythonProjectRoute(async baseUrl => {
			for (const payload of [
				{
					files: [
						{ content: "print('wrong mode')\n", name: "main.py" }
					],
					mode: "java",
					title: "Missing Java file"
				},
				{
					files: [
						{ content: "public class Main {}", name: "Main.java" }
					],
					mode: "python",
					title: "Missing Python file"
				}
			]) {
				const response = await postJson(baseUrl, payload);
				const body = await response.json();

				expect(response.status).toBe(400);
				expect(body.issues[0].path).toEqual(["files"]);
			}
		});

		expect(modelMocks.pythonProjectCreate).not.toHaveBeenCalled();
	});

	it("accepts a base64 asset at the editor's 2 MB binary import limit", async () => {
		const twoMegabyteBase64 = "A".repeat(
			Math.ceil((2 * 1024 * 1024) / 3) * 4
		);

		await withPythonProjectRoute(async baseUrl => {
			const response = await postJson(baseUrl, {
				files: [
					{
						content: "print('asset project')\n",
						name: "main.py"
					},
					{
						content: twoMegabyteBase64,
						encoding: "base64",
						name: "images/player.png"
					}
				],
				mode: "pgzero",
				title: "Large asset project"
			});

			expect(response.status).toBe(201);
			const createdProject =
				modelMocks.pythonProjectCreate.mock.calls.at(-1)?.[0];
			const assetFile = createdProject.files.find(
				(file: { name: string }) => file.name === "images/player.png"
			);
			expect(assetFile.encoding).toBe("base64");
			expect(assetFile.content).toHaveLength(twoMegabyteBase64.length);
		});
	});

	it("keeps a larger JSON parser limit scoped to Code IDE project routes", () => {
		const serverSource = readFileSync(
			resolve(__dirname, "../src/server.ts"),
			"utf8"
		);
		const limiterSource = readFileSync(
			resolve(__dirname, "../src/middleware/rateLimiters.ts"),
			"utf8"
		);
		const payloadSource = readFileSync(
			resolve(__dirname, "../src/middleware/projectPayload.ts"),
			"utf8"
		);

		expect(serverSource).toContain("codeIdeProjectApiMountPath");
		expect(limiterSource).toContain("loggedin\\/python-projects");
		expect(limiterSource).toContain("[^/]+\\/python-projects");
		expect(limiterSource).toContain("(?=\\/|$)");
		expect(payloadSource).toContain("CODE_IDE_PROJECT_BODY_LIMIT");
		expect(payloadSource).toContain("PYTHON_IDE_PROJECT_BODY_LIMIT");
		expect(payloadSource).toContain('"80mb"');
		expect(payloadSource).toContain("inflate: false");
		expect(serverSource).toContain("limitProjectBody(projectJson)");
		expect(serverSource).toContain('bodyParser.json({ limit: "1mb" })');
	});

	it("composes pre-parser auth and terminal reservation ownership", () => {
		const serverSource = readFileSync(
			resolve(__dirname, "../src/server.ts"),
			"utf8"
		);
		const routeSource = readFileSync(
			resolve(__dirname, "../src/routes/userRoutes.ts"),
			"utf8"
		);
		const accountLimiter = serverSource.indexOf(
			"createCodeIdeProjectAccountWriteLimiter(),"
		);
		const authentication = serverSource.indexOf(
			"authenticateProjectMutation,",
			accountLimiter
		);
		const heavyLimiter = serverSource.indexOf(
			"limitProjectBody(heavyProjectPayloadLimiter)",
			authentication
		);
		const concurrency = serverSource.indexOf(
			"limitProjectBody(projectPayloadConcurrencyGuard)",
			heavyLimiter
		);
		const parser = serverSource.indexOf(
			"limitProjectBody(projectJson)",
			concurrency
		);
		const claim = serverSource.indexOf(
			"limitProjectBody(claimCodeIdeProjectPayloadReservation)",
			parser
		);
		const routes = serverSource.indexOf(
			'app.use("/users", userRoutes)',
			claim
		);

		expect(accountLimiter).toBeGreaterThan(-1);
		expect(authentication).toBeGreaterThan(accountLimiter);
		expect(heavyLimiter).toBeGreaterThan(authentication);
		expect(concurrency).toBeGreaterThan(heavyLimiter);
		expect(parser).toBeGreaterThan(concurrency);
		expect(claim).toBeGreaterThan(parser);
		expect(routes).toBeGreaterThan(claim);

		const compactRoutes = routeSource.replace(/\s+/g, " ");
		for (const route of [
			'router.post( "/loggedin/python-projects", validProjectAccountSession, requireCodeIdeAccountMatch, withCodeIdeProjectPayloadReservation(createPythonProject) )',
			'router.put( "/loggedin/python-projects/:projectID", validProjectAccountSession, requireCodeIdeAccountMatch, withCodeIdeProjectPayloadReservation(updatePythonProject) )',
			'router.put( "/loggedin/python-projects/:projectID/share", validProjectAccountSession, requireCodeIdeAccountMatch, withCodeIdeProjectPayloadReservation(updatePythonProjectShare) )',
			'router.delete( "/loggedin/python-projects/:projectID", validProjectAccountSession, requireCodeIdeAccountMatch, withCodeIdeProjectPayloadReservation(deletePythonProject) )',
			'router.post( "/:userID/python-projects/:projectID/review", validManagedProjectSession, withCodeIdeProjectPayloadReservation(createPythonProjectReview) )',
			'router.put( "/:userID/python-projects/:projectID/review/:reviewID", validManagedProjectSession, withCodeIdeProjectPayloadReservation(updatePythonProjectReview) )'
		]) {
			expect(compactRoutes).toContain(route);
		}
	});

	it("rejects files that collide with browser runtime shim modules", async () => {
		const runtimeSource = readFileSync(
			resolve(
				__dirname,
				"../../front-end/src/modules/pythonIdeRuntime.ts"
			),
			"utf8"
		);
		const runtimeModuleList = runtimeSource.match(
			/const PYTHON_IDE_RUNTIME_MODULES = (\[[\s\S]*?\]);/
		);
		expect(runtimeModuleList).not.toBeNull();
		const runtimeModules = JSON.parse(
			runtimeModuleList?.[1] ?? "[]"
		) as string[];
		expect(runtimeModules.length).toBeGreaterThan(0);

		await withPythonProjectRoute(async baseUrl => {
			for (const reservedFileName of [
				"turtle.py",
				"pygame.py",
				"pgzrun.py",
				...runtimeModules.map(
					moduleName => `${moduleName}/__init__.py`
				),
				"turtle.py/helpers.py",
				"TURTLE.PY/helper.java",
				"keras.py",
				"keras/layers.py",
				"pgzero/builtins.py",
				"tensorflow/keras/__init__.py"
			]) {
				const response = await postJson(baseUrl, {
					files: [
						{
							content: "print('ok')\n",
							name: "main.py"
						},
						{
							content: "print('reserved')\n",
							name: reservedFileName
						}
					],
					mode: "python",
					title: "Reserved collision"
				});

				expect(response.status).toBe(400);
			}
		});

		expect(modelMocks.pythonProjectCreate).not.toHaveBeenCalled();
	});

	it("keeps health and project APIs free of Java execution primitives", () => {
		const sources = [
			readFileSync(resolve(__dirname, "../src/server.ts"), "utf8"),
			readFileSync(
				resolve(__dirname, "../src/routes/userRoutes.ts"),
				"utf8"
			),
			readFileSync(
				resolve(
					__dirname,
					"../src/controllers/users/pythonProjectController.ts"
				),
				"utf8"
			),
			readFileSync(
				resolve(__dirname, "../src/types/entities/IPythonProject.ts"),
				"utf8"
			),
			readFileSync(
				resolve(__dirname, "../src/models/schemas/PythonProject.ts"),
				"utf8"
			),
			readFileSync(
				resolve(
					__dirname,
					"../src/models/schemas/PythonProjectReview.ts"
				),
				"utf8"
			)
		].join("\n");

		expect(sources).toContain('app.get("/healthz"');
		expect(sources).toContain(
			'const projectModeSchema = z.enum(["cpp", "data", "java", "karel", "pgzero", "python", "turtle"])'
		);
		expect(sources).toContain(
			'export type PythonProjectMode = "cpp" | "data" | "java" | "karel" | "pgzero" | "python" | "turtle";'
		);
		expect(sources).toContain(
			'enum: ["cpp", "data", "java", "karel", "pgzero", "python", "turtle"]'
		);
		expect(sources).toContain("ROOT_TEXT_FILE_RE =");
		expect(sources).toContain("java|json");
		expect(sources).not.toMatch(/node:child_process|child_process/);
		expect(sources).not.toMatch(/\bworker_threads\b|\bnew\s+Worker\b/);
		expect(sources).not.toMatch(/\bjavaIdeRuntime\b|\brunJavaIdeProject\b/);
		expect(sources).not.toMatch(/\bjavac\b|\bdocker\b/i);
		expect(sources).not.toMatch(
			/\bspawn\s*\(|\bfork\s*\(|\bexecFile(?:Sync)?\s*\(/
		);
	});
});
