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
		resolve("../test/fixtures/javascript-juggling-paddle-sources.json"),
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
		"imports complete local Juggling Paddle " +
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
		"preserves the JSM7 Supplemental Project 2: Juggling Paddle identity and project roles for " +
			role,
		async () => {
			setActivePinia(createPinia());
			if (role === "instructor")
				useAppStore().setCurrentTutor({
					_id: "juggling-paddle-tutor",
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
			const item = module.supplementalProjects.find(i => i.id === fixture.itemId)!;
			expect(item.title).toBe("JSM7 Supplemental Project 2: Juggling Paddle");
			for (const token of [
				"500-by-500",
				"radius 10",
				"y=290",
				"isFalling",
				"README.md",
				"CASES.md"
			])
				expect(item.content).toContain(token);
			expect(item.projectLink).toBe(fixture.resources[0].urls[0]);
			expect(item.solutionLink).toBe(
				role === "instructor" ? fixture.resources[1].urls[0] : undefined
			);
			expect(javascriptCourseResource(item.projectLink!)?.project).toBe(
				"juggling-paddle"
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



function game(role: "starter" | "reference") {
	const handlers: Record<string, (event: { key?: string; preventDefault: () => void }) => void> = {};
	const windowHandlers: Record<string, () => void> = {};
	const documentHandlers: Record<string, () => void> = {};
	const frames: (() => void)[] = [], rectangles: number[][] = [], circles: number[][] = [];
	const ctx = { fillStyle: "", clearRect() {}, beginPath() {}, closePath() {}, fill() {}, fillRect: (...args: number[]) => rectangles.push(args), arc: (...args: number[]) => circles.push(args) };
	const canvas = { width: 0, height: 0, getContext: () => ctx, addEventListener: (name: string, fn: typeof handlers[string]) => { handlers[name] = fn; } };
	const doc = { hidden: false, getElementById: () => canvas, addEventListener: (name: string, fn: () => void) => { documentHandlers[name] = fn; } };
	const state = runInNewContext(fixture.files[role]["script.js"] + "\n;({ paddle, ball, keyState, updateBall, paddleContactY });", {
		document: doc, window: { addEventListener: (name: string, fn: () => void) => { windowHandlers[name] = fn; } },
		requestAnimationFrame: (fn: () => void) => frames.push(fn)
	}, { timeout: 1000 });
	return { ...state, canvas, rectangles, circles, doc, windowHandlers, documentHandlers,
		frame: () => { frames.shift()!(); },
		key(name: string, key: string) {
			let prevented = false;
			handlers[name]?.({ key, preventDefault: () => { prevented = true; } });
			return prevented;
		},
		blur: () => handlers.blur({ preventDefault() {} })
	};
}
it("supplies the original drawing and working paddle while leaving ball motion assigned", () => {
	const g = game("starter");
	expect([g.canvas.width,g.canvas.height]).toEqual([500,500]);
	expect(g.rectangles[0]).toEqual([200,300,100,20]);
	expect(g.circles[0].slice(0,3)).toEqual([250,100,10]);
	g.key("keydown","ArrowLeft");
	for(let i=0;i<30;i++)g.frame();
	expect(g.paddle.x).toBe(0);
	expect(g.ball.y).toBe(100);
});
it("matches centered,translated,radius,step,below-face and apex states", () => {
	for(const [setup,expectedY,falling] of [
		[{ball:{y:289}},290,false],
		[{ball:{y:289,speed:5}},290,false],
		[{ball:{y:50.5,isFalling:false}},50,true],
		[{ball:{y:301}},302,true],
		[{ball:{y:189},paddle:{y:200}},190,false],
		[{ball:{y:279,radius:20}},280,false]
	] as [Record<string,Record<string,unknown>>,number,boolean][]) {
		const g=game("reference");
		Object.assign(g.ball,{isFalling:true,...setup.ball});
		Object.assign(g.paddle,setup.paddle);
		g.updateBall();
		expect(g.ball.y).toBe(expectedY);
		expect(g.ball.isFalling).toBe(falling);
	}
});
it("uses circle corner geometry and crossing instead of hardcoded position tests", () => {
	const g=game("reference");
	g.paddle.x=255;g.ball.y=291;g.ball.isFalling=true;
	const contact=300-Math.sqrt(75);
	expect(g.paddleContactY()).toBeCloseTo(contact,10);
	g.updateBall();
	expect(g.ball.y).toBeCloseTo(contact,10);
	expect(g.ball.isFalling).toBe(false);
	expect(Math.hypot(5,300-g.ball.y)).toBeCloseTo(10,10);
	g.paddle.x=261;
	expect(g.paddleContactY()).toBeNull();
});
it("repeats a fixed-speed hit/apex cycle and lets a miss leave the canvas", () => {
	const g=game("reference");
	g.ball.y=100;
	for(let i=0;i<190;i++)g.updateBall();
	expect(g.ball.y).toBe(290);expect(g.ball.isFalling).toBe(false);
	for(let i=0;i<240;i++)g.updateBall();
	expect(g.ball.y).toBe(50);expect(g.ball.isFalling).toBe(true);
	g.paddle.x=0;
	for(let i=0;i<470;i++)g.updateBall();
	expect(g.ball.y-g.ball.radius).toBeGreaterThan(500);
	expect(g.ball.isFalling).toBe(true);
});
it("retains bounded key state,release and every focus/visibility stop", () => {
	for(const stop of ["keyup","canvas","window","hidden"]) {
		const g=game("reference");
		g.key("keydown","ArrowRight");
		for(let i=0;i<30;i++)g.frame();
		expect(g.paddle.x).toBe(400);
		g.key("keyup","ArrowRight");g.key("keydown","ArrowLeft");
		for(let i=0;i<3;i++)g.frame();
		expect(g.paddle.x).toBe(370);
		if(stop==="keyup")g.key("keyup","ArrowLeft");
		if(stop==="canvas")g.blur();
		if(stop==="window")g.windowHandlers.blur();
		if(stop==="hidden"){g.doc.hidden=true;g.documentHandlers.visibilitychange();}
		for(let i=0;i<5;i++)g.frame();
		expect(g.paddle.x).toBe(370);
		expect(g.key("keydown","a")).toBe(false);
	}
});
