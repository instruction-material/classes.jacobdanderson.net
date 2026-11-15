import MarkdownIt from "markdown-it";
import { createHash, webcrypto } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { runInNewContext } from "node:vm";
import { JSDOM } from "jsdom";
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
		resolve(
			"../test/fixtures/javascript-master-checkpoint-one-sources.json"
		),
		"utf8"
	)
);
const projectFixture = fixture;
const prefix = "/course-assets/javascript-level-2/";
const sha = (value: string) => createHash("sha256").update(value).digest("hex");
afterEach(async () => {
	vi.unstubAllGlobals();
	await clearLocalPythonProjects();
	document.body.replaceChildren();
});

for (const resource of fixture.resources) {
	it(
		"imports complete original-aligned checkpoint one " +
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
			expect(files).toHaveLength(resource.files.length);
			for (const file of files) {
				const expected = resource.files.find(
					(f: { name: string }) => f.name === file.name
				);
				expect(file.content).toBe(
					fixture.files[resource.project][resource.role][file.name]
				);
				expect(sha(file.content)).toBe(expected.sha256);
			}
			const key = javascriptCourseProjectKey(
				fixture.courseId,
				resource.itemId,
				resource.role,
				resource.urls[0]
			);
			for (const alias of resource.urls)
				expect(
					javascriptCourseProjectKey(
						fixture.courseId,
						resource.itemId,
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
						content: "Earlier square planning",
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
				"\nObserved the original-aligned workflow.\n";
			await saveLocalPythonProjects([earlier, project]);
			const saved = await loadLocalPythonProjects();
			expect(saved.find(row => row._id === earlier._id)).toEqual(earlier);
			const reopened = saved.find(row => row._id === project._id)!;
			expect(reopened).toEqual(project);
			const archive = unzipSync(await createProjectArchive(reopened));
			expect(Object.keys(archive)).toHaveLength(resource.files.length);
			for (const file of reopened.files) {
				const name = Object.keys(archive).find(n =>
					n.endsWith("/" + file.name)
				)!;
				expect(strFromU8(archive[name])).toBe(file.content);
			}
		}
	);
}

for (const project of projectFixture.projects) {
	for (const role of ["learner", "instructor"] as const) {
		it(
			"preserves " +
				project.project +
				" published identity and role boundary for " +
				role,
			async () => {
				setActivePinia(createPinia());
				if (role === "instructor")
					useAppStore().setCurrentTutor({
						_id: "checkpoint-tutor",
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
				const module = course.modules.find(
					m => m.id === project.moduleId
				)!;
				const item = module.curriculum.find(
					i => i.id === project.itemId
				)!;
				expect(item).toBeDefined();
				const starter = fixture.resources.find(
					r => r.project === project.project && r.role === "starter"
				);
				const reference = fixture.resources.find(
					r => r.project === project.project && r.role === "reference"
				);
				expect(item.projectLink).toBe(starter.urls[0]);
				if (role === "instructor")
					expect(reference.urls).toContain(item.solutionLink);
				else expect(item.solutionLink).toBeUndefined();
				expect(
					javascriptCourseResource(item.projectLink!)?.project
				).toBe(project.project);
				expect(item.contentKind).toBe("assignment");
				expect(item.content).toContain(
					project.project === "master-checkpoint-one-board"
						? "board.js"
						: "README.md"
				);
			}
		);
	}
}

function api(project: string, names: string[]) {
	const window: Record<string, unknown> = {};
	const content = names
		.map(name => fixture.files[project].reference[name])
		.join("\n");
	runInNewContext(content, { window });
	return window;
}
it("keeps dice bounds, jackpot threshold, boolean oddness and array data exact", () => {
	const f = api("master-checkpoint-one", ["functions.js", "arrays.js"])
		.CheckInOne as any;
	expect(f.rollDie(() => 0)).toBe(1);
	expect(f.rollDie(() => 0.999999)).toBe(6);
	expect(f.playJackpot(4, 5)).toBe("Better luck next time!");
	expect(f.playJackpot(4, 6)).toBe("Jackpot!");
	expect(f.playJackpot(6, 6)).toBe("Jackpot!");
	expect(f.sum(2, 3)).toBe(5);
	expect([-3, 0, 2, 3].map(n => f.isOdd(n))).toEqual([
		true,
		false,
		false,
		true
	]);
	const values = [1, 2, 3, 4, 5, 6];
	const copy = [...values];
	expect(f.countEvenRolls(values)).toBe(3);
	expect(f.doubleResults(values)).toEqual([2, 4, 6, 8, 10, 12]);
	expect(values).toEqual(copy);
	expect(f.doubleResults(values)).not.toBe(values);
	expect(f.countEvenRolls([])).toBe(0);
	expect(f.doubleResults([])).toEqual([]);
	const dice = f.createDiceResults(20, () => 0.999999);
	expect(dice).toHaveLength(20);
	expect(dice[9]).toBe(6);
	expect(dice.every((n: number) => n === 6)).toBe(true);
});
it("retains all original car fields and card geometry and clears before each draw", () => {
	const f = api("master-checkpoint-one", ["functions.js", "objects.js"])
		.CheckInOne as any;
	expect(f.createCar()).toEqual({
		make: "Toyota",
		model: "Corolla",
		year: 1999,
		color: "red",
		damaged: true
	});
	const low = f.createCards(() => 0);
	const high = f.createCards(() => 0.999999);
	expect(low).toHaveLength(4);
	expect(low.map((c: any) => c.text)).toEqual([1, 1, 1, 1]);
	expect(high.map((c: any) => c.text)).toEqual([100, 100, 100, 100]);
	expect(low.map((c: any) => [c.x, c.y, c.width, c.height])).toEqual([
		[50, 0, 200, 100],
		[50, 150, 200, 100],
		[50, 300, 200, 100],
		[50, 450, 200, 100]
	]);
	const calls: unknown[][] = [];
	const context = {
		clearRect: (...a: unknown[]) => calls.push(["clear", ...a]),
		fillRect: (...a: unknown[]) => calls.push(["rect", ...a]),
		fillText: (...a: unknown[]) => calls.push(["text", ...a])
	};
	f.drawCards(context, low);
	expect(calls[0]).toEqual(["clear", 0, 0, 1200, 1200]);
	expect(calls.filter(a => a[0] === "rect")).toHaveLength(4);
	expect(calls.filter(a => a[0] === "text")).toHaveLength(4);
	low[0].x = 75;
	calls.length = 0;
	f.drawCards(context, low);
	expect(calls[0][0]).toBe("clear");
	expect(calls[1]).toEqual(["rect", 75, 0, 200, 100]);
});
it("requires exactly nine matching valid shapes and preserves the original board geometry", () => {
	const f = api("master-checkpoint-one-board", ["board.js"])
		.ShapeBoard as any;
	const circles = f.createBoard(() => 0);
	const squares = f.createBoard(() => 0.75);
	let n = 0;
	const mixed = f.createBoard(() => (n++ % 2 ? 0.75 : 0));
	expect(circles).toHaveLength(9);
	expect(squares).toHaveLength(9);
	expect(circles[8]).toEqual({
		type: "circle",
		x: 120,
		y: 120,
		radius: 20,
		color: "green"
	});
	expect(squares[8]).toEqual({
		type: "square",
		x: 100,
		y: 100,
		length: 40,
		color: "red"
	});
	expect(f.boardComplete(circles)).toBe(true);
	expect(f.boardComplete(squares)).toBe(true);
	for (const b of [
		[],
		circles.slice(0, 8),
		mixed,
		Array.from({ length: 9 }, () => ({ type: "triangle" }))
	])
		expect(f.boardComplete(b)).toBe(false);
});
it("bounds the actual board controller and cancels after stop, match and page hiding", () => {
	const dom = new JSDOM(
		fixture.files["master-checkpoint-one-board"].reference["index.html"],
		{ runScripts: "outside-only", pretendToBeVisual: true }
	);
	try {
		const w = dom.window as any;
		const frames = new Map<number, () => void>();
		let next = 0;
		w.requestAnimationFrame = (callback: () => void) => {
			const id = ++next;
			frames.set(id, callback);
			return id;
		};
		w.cancelAnimationFrame = (id: number) => frames.delete(id);
		w.HTMLCanvasElement.prototype.getContext = () => null;
		w.eval(
			fixture.files["master-checkpoint-one-board"].reference["board.js"]
		);
		const original = w.ShapeBoard.createBoard;
		w.ShapeBoard.createBoard = () => {
			let n = 0;
			return original(() => (n++ % 2 ? 0.75 : 0));
		};
		w.eval(
			fixture.files["master-checkpoint-one-board"].reference["script.js"]
		);
		const click = (id: string) => w.document.querySelector(id).click();
		click("#start");
		expect(frames.size).toBe(1);
		let callbacks = 0;
		while (frames.size) {
			const [id, callback] = frames.entries().next().value!;
			frames.delete(id);
			callback();
			callbacks++;
			if (callbacks > 2000) throw new Error("Unbounded controller");
		}
		expect(callbacks).toBe(1999);
		expect(w.document.querySelector("#status").textContent).toBe(
			"Stopped at 2000 attempts without a match."
		);
		expect(w.document.querySelectorAll("#board-results li")).toHaveLength(
			9
		);
		click("#start");
		expect(frames.size).toBe(1);
		click("#stop");
		expect(frames.size).toBe(0);
		expect(w.document.querySelector("#status").textContent).toBe(
			"Stopped after 1 attempt(s)."
		);
		click("#start");
		click("#once");
		expect(frames.size).toBe(0);
		w.ShapeBoard.createBoard = () => original(() => 0);
		click("#start");
		expect(frames.size).toBe(0);
		expect(w.document.querySelector("#status").textContent).toBe(
			"Match after 1 attempt(s)."
		);
		w.ShapeBoard.createBoard = () => {
			let n = 0;
			return original(() => (n++ % 2 ? 0.75 : 0));
		};
		click("#start");
		Object.defineProperty(w.document, "hidden", {
			value: true,
			configurable: true
		});
		w.document.dispatchEvent(new w.Event("visibilitychange"));
		expect(frames.size).toBe(0);
		expect(w.board).toBeUndefined();
	} finally {
		dom.window.close();
	}
});
it("reuses one role-specific project across all three core cards without changing existing resource keys", () => {
	const project = fixture.projects[0];
	for (const role of ["starter", "reference"] as const) {
		const resource = fixture.resources.find(
			(r: any) => r.project === project.project && r.role === role
		);
		const key = javascriptCourseProjectKey(
			fixture.courseId,
			project.itemId,
			role,
			resource.urls[0]
		);
		for (const id of [
			...project.continuationIds,
			fixture.moduleId +
				"-curriculum-" +
				fixture.courseId +
				"-check-in-1-overview"
		]) {
			expect(
				javascriptCourseProjectKey(
					fixture.courseId,
					id,
					role,
					resource.urls[1]
				)
			).toBe(key);
		}
		expect(key).toContain(":" + role + ":master-checkpoint-one:v1");
	}
	const older =
		"https://codepen.io/junilearning/pen/546a7d889ffe394b3efeca62a005209c";
	const resource = javascriptCourseResource(older)!;
	expect(
		javascriptCourseProjectKey(
			fixture.courseId,
			"retained-id",
			"starter",
			older
		)
	).toBe(
		fixture.courseId +
			":retained-id:starter:" +
			resource.project +
			":v" +
			resource.version
	);
	expect(() =>
		javascriptCourseProjectKey(fixture.courseId, "x", "reference", older)
	).toThrow();
});
it.each(["learner", "instructor"])(
	"retains all core checkpoint completion identities and continuation links for %s",
	async role => {
		setActivePinia(createPinia());
		if (role === "instructor")
			useAppStore().setCurrentTutor({
				_id: "t",
				name: "Tutor",
				email: "t@example.invalid",
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
		expect(module.curriculum).toHaveLength(5);
		const core = fixture.projects[0];
		for (const id of [core.itemId, ...core.continuationIds]) {
			const item = module.curriculum.find(i => i.id === id)!;
			expect(item, id).toBeDefined();
			expect(item.ideImport).toBe(true);
			expect(javascriptCourseResource(item.projectLink!)!.project).toBe(
				core.project
			);
			expect(item.contentKind).toBe("assignment");
			if (role === "learner") expect(item.solutionLink).toBeUndefined();
		}
		const overview = module.curriculum[0];
		expect(overview.contentKind).toBe("reading");
		expect(overview.content).toContain("Math.ceil(random * 6)");
		expect(overview.content).toContain("tenth array");
	}
);

it("shows all five board formulas as literal code in the complete task and exported guide", () => {
	const board = fixture.projects.find(
		(p: any) => p.project === "master-checkpoint-one-board"
	);
	for (const source of [
		fixture.assignmentTexts[board.itemId],
		fixture.files[board.project].reference["README.md"]
	]) {
		const dom = new JSDOM(new MarkdownIt().render(source));
		try {
			expect(
				[...dom.window.document.querySelectorAll("code")].map(
					e => e.textContent
				)
			).toEqual([
				"x=i*50+20",
				"y=j*50+20",
				"x=i*50",
				"y=j*50",
				"Math.floor(random()*2)"
			]);
		} finally {
			dom.window.close();
		}
	}
});
