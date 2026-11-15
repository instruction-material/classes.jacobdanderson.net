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
		resolve("../test/fixtures/javascript-paddle-sources.json"),
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
		"imports complete local Paddle " +
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
			expect(files).toHaveLength(7);
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
			expect(Object.keys(archive)).toHaveLength(7);
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
		"preserves the JSM7 Project 3: Paddle identity and project roles for " +
			role,
		async () => {
			setActivePinia(createPinia());
			if (role === "instructor")
				useAppStore().setCurrentTutor({
					_id: "paddle-tutor",
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
			expect(item.title).toBe("JSM7 Project 3: Paddle");
			for (const token of [
				"500-by-500",
				"ArrowLeft",
				"400",
				"loses focus",
				"README.md",
				"CASES.md"
			])
				expect(item.content).toContain(token);
			expect(item.projectLink).toBe(fixture.resources[0].urls[0]);
			expect(item.solutionLink).toBe(
				role === "instructor" ? fixture.resources[1].urls[0] : undefined
			);
			expect(javascriptCourseResource(item.projectLink!)?.project).toBe(
				"paddle"
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


function runtime(role: "starter" | "reference") {
	const canvasHandlers: Record<string, (event: { key?: string; preventDefault: () => void }) => void> = {};
	const windowHandlers: Record<string, () => void> = {};
	const documentHandlers: Record<string, () => void> = {};
	const frames: (() => void)[] = [];
	const drawings: number[][] = [];
	const context = { fillStyle: "", clearRect() {}, fillRect: (...rect: number[]) => drawings.push(rect) };
	const canvas = {
		width: 0, height: 0, getContext: () => context,
		addEventListener: (name: string, fn: (event: { key?: string; preventDefault: () => void }) => void) => { canvasHandlers[name] = fn; }
	};
	const document = {
		hidden: false, getElementById: () => canvas,
		addEventListener: (name: string, fn: () => void) => { documentHandlers[name] = fn; }
	};
	const result = runInNewContext(
		fixture.files[role]["script.js"] + "\n;({ paddle, keyState });",
		{
			document, window: { addEventListener: (name: string, fn: () => void) => { windowHandlers[name] = fn; } },
			requestAnimationFrame: (fn: () => void) => frames.push(fn)
		},
		{ timeout: 1000 }
	);
	return {
		...result, canvas, drawings, context, document, windowHandlers, documentHandlers,
		frame: () => { frames.shift()!(); },
		key(name: string, key: string) {
			let prevented = false;
			canvasHandlers[name]?.({ key, preventDefault: () => { prevented = true; } });
			return prevented;
		},
		blur: () => canvasHandlers.blur?.({ preventDefault() {} })
	};
}
it("supplies the original drawing while leaving starter movement and handlers assigned", () => {
	const r = runtime("starter");
	expect([r.canvas.width, r.canvas.height]).toEqual([500, 500]);
	expect(r.drawings[0]).toEqual([0, 0, 100, 20]);
	expect(r.context.fillStyle).toBe("black");
	r.key("keydown", "ArrowRight");
	for (let i = 0; i < 50; i++) r.frame();
	expect(r.paddle.x).toBe(0);
});
it("matches fixed direction and edge cases with visible frames following state", () => {
	for (const [start, left, right, frames, expected] of [
		[200, true, false, 1, 190],
		[200, false, true, 1, 210],
		[395, false, true, 1, 400],
		[5, true, false, 1, 0],
		[0, false, true, 50, 400],
		[400, true, false, 50, 0],
		[200, true, true, 10, 200],
		[200, false, false, 10, 200]
	] as const) {
		const r = runtime("reference");
		r.paddle.x = start;
		if (left) expect(r.key("keydown", "ArrowLeft")).toBe(true);
		if (right) expect(r.key("keydown", "ArrowRight")).toBe(true);
		for (let i = 0; i < frames; i++) r.frame();
		expect(r.paddle.x).toBe(expected);
		expect(r.drawings.at(-1)).toEqual([expected, 0, 100, 20]);
	}
});
it("stops on release and every focus/visibility boundary", () => {
	for (const stop of ["keyup", "canvas-blur", "window-blur", "hidden"]) {
		const r = runtime("reference");
		r.key("keydown", "ArrowRight");
		for (let i = 0; i < 3; i++) r.frame();
		expect(r.paddle.x).toBe(30);
		if (stop === "keyup") expect(r.key("keyup", "ArrowRight")).toBe(true);
		if (stop === "canvas-blur") r.blur();
		if (stop === "window-blur") r.windowHandlers.blur();
		if (stop === "hidden") { r.document.hidden = true; r.documentHandlers.visibilitychange(); }
		for (let i = 0; i < 10; i++) r.frame();
		expect(r.paddle.x).toBe(30);
	}
});
it("leaves unrelated keys alone and preserves held keys on a visible-document event", () => {
	const r = runtime("reference");
	expect(r.key("keydown", "a")).toBe(false);
	expect(r.key("keyup", "a")).toBe(false);
	expect(r.key("keydown", "constructor")).toBe(false);
	r.key("keydown", "ArrowRight");
	r.documentHandlers.visibilitychange();
	r.frame();
	expect(r.paddle.x).toBe(10);
});
