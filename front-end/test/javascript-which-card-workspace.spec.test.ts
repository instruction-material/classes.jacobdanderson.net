import { createHash, webcrypto } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { runInNewContext } from "node:vm";
import { strFromU8, unzipSync } from "fflate";
import { createPinia, setActivePinia } from "pinia";
import { afterEach, expect, it, vi } from "vitest";
import {
	javascriptCourseProjectKey,
	javascriptCourseResource
} from "@/modules/javascriptCourseResources";
import { createProjectArchive } from "@/modules/projectArchive";
import {
	clearLocalPythonProjects,
	createPythonIdeProject,
	loadLocalPythonProjects,
	loadPythonIdeStarterFilesFromGitHub,
	pythonIdeModeForCourseResource,
	saveLocalPythonProjects
} from "@/modules/pythonIde";
import { useAppStore } from "@/stores/app";
import { useCoursesStore } from "@/stores/courses";

const fixture = JSON.parse(
	readFileSync(
		resolve("../test/fixtures/javascript-which-card-sources.json"),
		"utf8"
	)
);
const prefix = "/course-assets/javascript-level-2/";
const sha = (value: string) => createHash("sha256").update(value).digest("hex");
afterEach(async () => {
	vi.unstubAllGlobals();
	await clearLocalPythonProjects();
	document.body.replaceChildren();
});

for (const resource of fixture.resources) {
	it(
		"imports complete local Which Card " +
			resource.role +
			" and preserves edited work through reopening and ZIP export",
		async () => {
			vi.stubGlobal("crypto", webcrypto);
			const requests: string[] = [];
			vi.stubGlobal(
				"fetch",
				vi.fn(async (url: string, options: RequestInit) => {
					expect(url.startsWith(prefix)).toBe(true);
					expect(options).toMatchObject({
						credentials: "omit",
						redirect: "error"
					});
					requests.push(url);
					return new Response(
						readFileSync(
							resolve(
								"public/course-assets/javascript-level-2",
								url.slice(prefix.length)
							)
						)
					);
				})
			);
			expect(
				pythonIdeModeForCourseResource(
					fixture.courseId,
					resource.urls[0]
				)
			).toBe("web");
			expect(requests).toHaveLength(0);
			const files = await loadPythonIdeStarterFilesFromGitHub(
				resource.urls[0],
				"web"
			);
			expect(files).toHaveLength(8);
			for (const file of files) {
				const expected = resource.files.find(
					(f: { name: string }) => f.name === file.name
				);
				expect(file.content).toBe(
					fixture.files[resource.role][file.name]
				);
				expect(sha(file.content)).toBe(expected.sha256);
			}
			const key = javascriptCourseProjectKey(
				fixture.courseId,
				fixture.itemId,
				resource.role,
				resource.urls[0]
			);
			for (const alias of resource.urls)
				expect(
					javascriptCourseProjectKey(
						fixture.courseId,
						fixture.itemId,
						resource.role,
						alias
					)
				).toBe(key);
			const earlier = createPythonIdeProject("web", {
				courseID: fixture.courseId,
				courseProjectKey: key + ":earlier",
				files: [
					{
						name: "index.html",
						content: "Earlier card planning",
						encoding: "text"
					}
				]
			});
			const project = createPythonIdeProject("web", {
				courseID: fixture.courseId,
				courseProjectKey: key,
				starterUrl: resource.urls[0],
				files
			});
			project.files.find(file => file.name === "README.md")!.content +=
				"\nRetained card selection work.\n";
			await saveLocalPythonProjects([earlier, project]);
			const saved = await loadLocalPythonProjects();
			expect(saved.find(row => row._id === earlier._id)).toEqual(earlier);
			const reopened = saved.find(row => row._id === project._id)!;
			expect(reopened).toEqual(project);
			const archive = unzipSync(await createProjectArchive(reopened));
			expect(Object.keys(archive)).toHaveLength(8);
			for (const file of reopened.files) {
				const name = Object.keys(archive).find(n =>
					n.endsWith("/" + file.name)
				)!;
				expect(strFromU8(archive[name])).toBe(file.content);
			}
		}
	);
}

for (const role of ["learner", "instructor"] as const) {
	it(
		"preserves the JSM7 Project 2: Which Card identity and project roles for " +
			role,
		async () => {
			setActivePinia(createPinia());
			if (role === "instructor")
				useAppStore().setCurrentTutor({
					_id: "card-tutor",
					name: "Tutor",
					email: "tutor@example.invalid",
					age: 30,
					state: "GA",
					usersOfTutorLength: 0,
					coursePermissions: [fixture.courseId],
					editTutors: false,
					saveEdit: "Save"
				});
			const course = (await useCoursesStore().loadCourseById(
				fixture.courseId
			))!;
			const module = course.modules.find(m => m.id === fixture.moduleId)!;
			expect(module).toBeDefined();
			const item = module.curriculum.find(i => i.id === fixture.itemId)!;
			expect(item.title).toBe("JSM7 Project 2: Which Card");
			for (const token of [
				"1200-by-800",
				"50-unit",
				"left/top",
				"getBoundingClientRect",
				"README.md",
				"CASES.md"
			])
				expect(item.content).toContain(token);
			expect(item.projectLink).toBe(fixture.resources[0].urls[0]);
			expect(item.solutionLink).toBe(
				role === "instructor" ? fixture.resources[1].urls[0] : undefined
			);
			expect(javascriptCourseResource(item.projectLink!)?.project).toBe(
				"which-card"
			);
			expect(
				pythonIdeModeForCourseResource(
					"javascript-level-1-javascript-superstar",
					item.projectLink!
				)
			).toBeNull();
		}
	);
}

it("draws the original five rectangles and leaves the starter handler unfinished", () => {
	for (const role of ["starter", "reference"]) {
		const drawn: unknown[] = [];
		const handlers: Record<string, (event: unknown) => void> = {};
		const ctx = {
			fillStyle: "",
			fillRect(x: number, y: number, width: number, height: number) {
				drawn.push({ x, y, width, height, color: this.fillStyle });
			}
		};
		const canvas = {
			width: 0,
			height: 0,
			getContext: () => ctx,
			addEventListener(name: string, fn: (event: unknown) => void) {
				handlers[name] = fn;
			}
		};
		runInNewContext(
			fixture.files[role]["script.js"],
			{
				document: { getElementById: () => canvas },
				console: { log: () => {} }
			},
			{ timeout: 1000 }
		);
		expect([canvas.width, canvas.height]).toEqual([1200, 800]);
		expect(drawn).toEqual(
			["green", "red", "blue", "yellow", "cyan"].map((color, index) => ({
				x: index * 200,
				y: 150,
				width: 150,
				height: 100,
				color
			}))
		);
		expect(typeof handlers.click).toBe(
			role === "reference" ? "function" : "undefined"
		);
	}
});
it("matches visible rectangles across offsets, scroll positions and independent axis scales", () => {
	const colors = ["green", "red", "blue", "yellow", "cyan"];
	const rects = [
		{ left: 8, top: 8, width: 1200, height: 800 },
		{ left: 24, top: 80, width: 600, height: 400 },
		{ left: 16, top: -20, width: 300, height: 200 },
		{ left: 117, top: 31, width: 1200, height: 400 }
	];
	for (const rect of rects) {
		const output: string[] = [];
		let click: (event: {
			clientX: number;
			clientY: number;
		}) => void = () => {};
		const canvas = {
			width: 0,
			height: 0,
			getBoundingClientRect: () => rect,
			getContext: () => ({ fillStyle: "", fillRect() {} }),
			addEventListener(_name: string, fn: typeof click) {
				click = fn;
			}
		};
		runInNewContext(
			fixture.files.reference["script.js"],
			{
				document: { getElementById: () => canvas },
				console: { log: (color: string) => output.push(color) }
			},
			{ timeout: 1000 }
		);
		for (let index = 0; index < colors.length; index++) {
			const x = index * 200;
			for (const [px, py, color] of [
				[x + 75, 200, colors[index]],
				[x, 150, colors[index]],
				[x + 149.999, 249.999, colors[index]],
				[x + 150, 200, null],
				[x + 175, 200, null],
				[x + 75, 149, null],
				[x + 75, 250, null]
			] as [number, number, string | null][]) {
				output.length = 0;
				click({
					clientX: rect.left + (px * rect.width) / 1200,
					clientY: rect.top + (py * rect.height) / 800
				});
				expect(output).toEqual(color === null ? [] : [color]);
			}
		}
	}
});
