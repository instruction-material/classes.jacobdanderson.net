import { createHash, webcrypto } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { createContext, runInContext } from "node:vm";
import { strFromU8, unzipSync } from "fflate";
import { createPinia, setActivePinia } from "pinia";
import { afterEach, expect, it, vi } from "vitest";
import { javascriptCourseProjectKey } from "@/modules/javascriptCourseResources";
import { createProjectArchive } from "@/modules/projectArchive";
import {
	clearLocalPythonProjects,
	createPythonIdeProject,
	loadLocalPythonProjectsAsync,
	loadPythonIdeStarterFilesFromGitHub,
	saveLocalPythonProjects
} from "@/modules/pythonIde";
import { useAppStore } from "@/stores/app";
import { useCoursesStore } from "@/stores/courses";
const fixture = JSON.parse(
	readFileSync(
		resolve("../test/fixtures/javascript-us-capitals-sources.json"),
		"utf8"
	)
);
const provenance = JSON.parse(
	readFileSync(
		resolve(
			"../test/fixtures/javascript-us-capitals-geography-provenance.json"
		),
		"utf8"
	)
);
const sha = (value: string) => createHash("sha256").update(value).digest("hex");
afterEach(async () => {
	vi.unstubAllGlobals();
	await clearLocalPythonProjects();
});
for (const resource of fixture.resources) {
	it(
		"imports,retains and exports every " +
			resource.role +
			" quiz file and source alias",
		async () => {
			vi.stubGlobal("crypto", webcrypto);
			const prefix = "/course-assets/javascript-level-2/",
				requests: string[] = [];
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
			const key = javascriptCourseProjectKey(
				fixture.courseId,
				fixture.itemId,
				resource.role,
				resource.urls[0]
			);
			let files;
			for (const url of resource.urls) {
				files = await loadPythonIdeStarterFilesFromGitHub(url, "web");
				expect(
					javascriptCourseProjectKey(
						fixture.courseId,
						fixture.itemId,
						resource.role,
						url
					)
				).toBe(key);
				expect(files).toHaveLength(9);
				for (const file of files) {
					expect(file.content).toBe(
						fixture.files["us-capitals-quiz"][resource.role][
							file.name
						]
					);
					expect(sha(file.content)).toBe(
						resource.files.find(f => f.name === file.name).sha256
					);
				}
			}
			expect(requests).toHaveLength(18);
			const earlier = createPythonIdeProject("web", {
				files: [
					{
						name: "index.html",
						content: "Earlier quiz work",
						encoding: "text"
					}
				],
				courseID: fixture.courseId,
				courseProjectKey: key + ":earlier"
			});
			const project = createPythonIdeProject("web", {
				files,
				courseID: fixture.courseId,
				courseProjectKey: key,
				starterUrl: resource.urls[0]
			});
			project.files.find(file => file.name === "README.md")!.content +=
				"\nSaved quiz observations.\n";
			saveLocalPythonProjects([earlier, project]);
			const reopened = await loadLocalPythonProjectsAsync();
			expect(reopened.find(p => p._id === earlier._id)).toEqual(earlier);
			const saved = reopened.find(p => p._id === project._id)!;
			expect(saved.files).toEqual(project.files);
			const archive = unzipSync(await createProjectArchive(saved));
			expect(Object.keys(archive)).toHaveLength(9);
			for (const file of saved.files) {
				const path = Object.keys(archive).find(path =>
					path.endsWith("/" + file.name)
				)!;
				expect(strFromU8(archive[path])).toBe(file.content);
			}
		}
	);
}
for (const role of ["learner", "instructor"]) {
	it(
		"keeps the original quiz identity,purpose and full assignment for " +
			role,
		async () => {
			setActivePinia(createPinia());
			if (role === "instructor")
				useAppStore().setCurrentTutor({
					_id: "quiz-tutor",
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
			const item = module.curriculum.find(i => i.id === fixture.itemId)!;
			expect(item.title).toBe("JSM14 Project 1: Quiz Game");
			expect(item.learningPath).toBe("core");
			const guide = fixture.files["us-capitals-quiz"].starter["README.md"]
				.split("\n\n")
				.slice(1)
				.join("\n\n")
				.split("\n\nComplete the three task functions")[0];
			expect(item.content).toContain(guide.trim());
			expect(item.content).not.toMatch(
				/fictional region-and-capital|preserved JSONBin-based CodePen/
			);
			expect(item.projectLink).toBe(fixture.resources[0].urls[0]);
			expect(item.solutionLink).toBe(
				role === "instructor" ? fixture.resources[1].urls[0] : undefined
			);
		}
	);
}
function model() {
	const scope = createContext({ structuredClone });
	const files = fixture.files["us-capitals-quiz"].reference;
	for (const name of ["data.js", "model.js"])
		runInContext(files[name], scope);
	runInContext(
		"var source=JSON.parse(suppliedJSON);var game=createQuiz(source);",
		scope
	);
	return { read: (expression: string) => runInContext(expression, scope) };
}
it("matches all50government-table pairs and independently pinned state geometry", () => {
	const app = model();
	const data = app.read("game.dataset");
	expect(data.viewBox).toEqual(provenance.viewBox);
	expect(data.states).toHaveLength(50);
	expect(new Set(data.states.map(s => s.id)).size).toBe(50);
	for (const state of data.states) {
		const expected = provenance.states.find(s => s.id === state.id)!;
		expect({
			id: state.id,
			name: state.name,
			capital: state.capital,
			acceptedAnswers: state.acceptedAnswers,
			pathSHA256: sha(state.path)
		}).toEqual(expected);
	}
	for (const role of ["starter", "reference"])
		expect(
			sha(fixture.files["us-capitals-quiz"][role]["LICENSE-MAP.txt"])
		).toBe(provenance.sources.licenseSHA256);
});
it("records exactly50answers and completes without a51stquestion", () => {
	const app = model();
	expect(app.read("startQuiz(game,()=>0)")).toBe(true);
	for (let i = 0; i < 50; i++) {
		expect(app.read("submitAnswer(game,game.question.capital)")).toBe(true);
		expect(app.read("submitAnswer(game,'Duplicate')")).toBe(false);
		expect(app.read("game.answers.length")).toBe(i + 1);
		expect(app.read("game.phase")).toBe("feedback");
		expect(app.read("advanceQuiz(game,()=>0)")).toBe(true);
	}
	expect(app.read("game.phase")).toBe("complete");
	expect(app.read("game.question")).toBe(null);
	expect(app.read("quizScore(game)")).toBe(50);
	expect(app.read("chooseQuestion(game,()=>0)")).toBe(null);
	expect(app.read("submitAnswer(game,'Extra')")).toBe(false);
	expect(app.read("advanceQuiz(game,()=>0)")).toBe(false);
});
it("uses the actual subset total and resets all previous results", () => {
	const app = model();
	app.read(
		"source.states=source.states.slice(0,1);game=createQuiz(source);startQuiz(game,()=>0);submitAnswer(game,'Wrong');advanceQuiz(game,()=>0)"
	);
	expect(app.read("game.phase")).toBe("complete");
	expect(app.read("game.answers.length")).toBe(1);
	expect(app.read("quizScore(game)")).toBe(0);
	app.read("resetQuiz(game)");
	expect(app.read("game.phase")).toBe("ready");
	expect(app.read("game.question")).toBe(null);
	expect(app.read("game.answers.length")).toBe(0);
	expect(app.read("startQuiz(game,()=>0)")).toBe(true);
	expect(app.read("startQuiz(game,()=>0.9)")).toBe(false);
});
it("normalizes declared answers,accepts explicitSaintPaulaliases and keeps punctuation meaningful", () => {
	const app = model();
	app.read("startQuiz(game,()=>0);submitAnswer(game,'  MONTGOMERY  ')");
	expect(app.read("quizScore(game)")).toBe(1);
	expect(app.read("normalizedAnswer('AL.BANY')")).not.toBe(
		app.read("normalizedAnswer('Albany')")
	);
	app.read(
		"source.states=source.states.filter(s=>s.name==='Minnesota');game=createQuiz(source);startQuiz(game,()=>0);submitAnswer(game,'Saint   Paul')"
	);
	expect(app.read("quizScore(game)")).toBe(1);
});
it("rejects blank,nontext and overlength answers without consuming a question", () => {
	const app = model();
	app.read("startQuiz(game,()=>0)");
	for (const expression of [
		"submitAnswer(game,'  ')",
		"submitAnswer(game,null)",
		"submitAnswer(game,'x'.repeat(101))"
	])
		expect(() => app.read(expression)).toThrow();
	expect(app.read("game.answers.length")).toBe(0);
	expect(app.read("game.phase")).toBe("asking");
});
it("selects first/last remaining IDs and rejects invalid random values", () => {
	const app = model();
	expect(app.read("chooseQuestion(game,()=>0).name")).toBe("Alabama");
	expect(app.read("chooseQuestion(game,()=>0.99999).name")).toBe("Wyoming");
	for (const value of ["-1", "1", "NaN", "Infinity"])
		expect(() =>
			app.read("chooseQuestion(game,()=>" + value + ")")
		).toThrow();
	app.read(
		"startQuiz(game,()=>0.99999);submitAnswer(game,game.question.capital);advanceQuiz(game,()=>0.99999)"
	);
	expect(app.read("game.question.id")).not.toBe(
		app.read("game.answers[0].id")
	);
});
it("copies validated data before the caller can change its capital", () => {
	const app = model();
	app.read("source.states[0].capital='Changed'");
	expect(app.read("game.dataset.states[0].capital")).toBe("Montgomery");
});
for (const [label, change, message] of [
	["empty", "v.states=[]", "1–50 states"],
	["too many", "v.states=Array(51).fill(v.states[0])", "1–50 states"],
	["version", "v.schemaVersion=99", "version-one"],
	["repeated ID", "v.states[1].id=v.states[0].id", "unique two-digit"],
	["repeated name", "v.states[1].name=v.states[0].name", "distinct names"],
	["invalid ID", "v.states[0].id=1", "two-digit"],
	["missing capital", "delete v.states[0].capital", "Invalid capital"],
	[
		"missing aliases",
		"delete v.states[0].acceptedAnswers",
		"Accepted answers"
	],
	[
		"wrong canonical alias",
		"v.states[0].acceptedAnswers=['Wrong']",
		"include the capital"
	],
	[
		"duplicate alias",
		"v.states[0].acceptedAnswers=['Montgomery','montgomery']",
		"Repeated answer alias"
	],
	[
		"malformed path",
		"v.states[0].path='M0,0L1,1Z<script>'",
		"bounded map path"
	],
	[
		"oversized path",
		"v.states[0].path='x'.repeat(50001)",
		"bounded map path"
	],
	[
		"outside geometry",
		"v.states[0].path='M9000,0L9001,1L9000,0Z'",
		"outside its view box"
	],
	["empty view box", "v.viewBox=[0,0,0,0]", "Invalid map view box"]
]) {
	it("rejects " + label + " dataset data before replacing a quiz", () => {
		const app = model();
		expect(() =>
			app.read(
				"var v=structuredClone(source);" + change + ";createQuiz(v)"
			)
		).toThrow(message);
		expect(app.read("game.dataset.states.length")).toBe(50);
		expect(app.read("game.phase")).toBe("ready");
	});
}

function quizPage(role = "reference", mode = "working") {
	const files = fixture.files["us-capitals-quiz"][role];
	document.body.innerHTML = files["index.html"].replace(
		/<script[\s\S]*?<\/script>/g,
		""
	);
	const colors: string[] = [];
	const ctx = {
		fillStyle: "",
		strokeStyle: "",
		lineWidth: 0,
		setTransform() {},
		clearRect() {},
		stroke() {},
		fill() {
			colors.push(ctx.fillStyle);
		}
	};
	Object.defineProperty(document.querySelector("#map"), "getContext", {
		value: () => {
			if (mode === "denied") throw new Error("Canvas denied");
			return mode === "missing" ? null : ctx;
		}
	});
	const scope = createContext({
		document,
		structuredClone,
		devicePixelRatio: 1,
		Path2D:
			mode === "path-missing"
				? undefined
				: class {
						constructor(path: string) {
							expect(path.startsWith("M")).toBe(true);
						}
					},
		console
	});
	runInContext("Math.random=()=>0", scope);
	for (const name of ["data.js", "model.js", "script.js"])
		runInContext(files[name], scope);
	return {
		colors,
		read: (expression: string) => runInContext(expression, scope)
	};
}
function submitQuiz(value: string) {
	(document.querySelector("#answer") as HTMLInputElement).value = value;
	document
		.querySelector("#answer-form")!
		.dispatchEvent(new Event("submit", { cancelable: true }));
}
it("renders visible feedback,one answer and focus through the actual DOM handlers", () => {
	const page = quizPage();
	(document.querySelector("#start") as HTMLButtonElement).click();
	expect(document.activeElement?.id).toBe("answer");
	submitQuiz("  MONTGOMERY  ");
	expect(page.read("game.answers.length")).toBe(1);
	expect(page.read("game.phase")).toBe("feedback");
	expect(document.querySelector("#question")!.textContent).toContain(
		"Correct. Alabama: Montgomery."
	);
	expect(document.activeElement?.id).toBe("next");
	expect(page.colors.slice(-50).filter(c => c === "#22834c")).toHaveLength(1);
	submitQuiz("Duplicate");
	expect(page.read("game.answers.length")).toBe(1);
	(document.querySelector("#next") as HTMLButtonElement).click();
	submitQuiz("Wrong");
	expect(document.querySelector("#question")!.textContent).toContain(
		"Incorrect. Alaska: Juneau."
	);
	expect(page.colors.slice(-50).filter(c => c === "#bd3030")).toHaveLength(1);
});
it("finishes all50questions through the actual form and next handlers", () => {
	const page = quizPage();
	(document.querySelector("#start") as HTMLButtonElement).click();
	for (let i = 0; i < 50; i++) {
		submitQuiz(page.read("game.question.capital"));
		(document.querySelector("#next") as HTMLButtonElement).click();
	}
	expect(document.querySelector("#progress")!.textContent).toBe(
		"50 correct out of 50."
	);
	expect(document.querySelectorAll("#results li")).toHaveLength(50);
	expect(page.read("game.question")).toBe(null);
	expect(document.activeElement?.id).toBe("reset");
	expect(
		(document.querySelector("#submit") as HTMLButtonElement).disabled
	).toBe(true);
	(document.querySelector("#reset") as HTMLButtonElement).click();
	expect(page.read("game.phase")).toBe("ready");
	expect(document.querySelectorAll("#results li")).toHaveLength(0);
	expect(document.activeElement?.id).toBe("start");
});
it("exposes the first assigned starter TODO without starting an incomplete quiz", () => {
	const page = quizPage("starter");
	(document.querySelector("#start") as HTMLButtonElement).click();
	expect(document.querySelector("#status")!.textContent).toContain(
		"Complete chooseQuestion in model.js."
	);
	expect(page.read("game.phase")).toBe("ready");
	expect(page.read("game.answers.length")).toBe(0);
});
for (const mode of ["missing", "denied", "path-missing"]) {
	it("keeps the text quiz usable when Canvas is " + mode, () => {
		const page = quizPage("reference", mode);
		expect(
			(document.querySelector("#map-region") as HTMLElement).hidden
		).toBe(true);
		(document.querySelector("#start") as HTMLButtonElement).click();
		submitQuiz("Montgomery");
		expect(page.read("game.answers.length")).toBe(1);
		expect(document.querySelector("#question")!.textContent).toContain(
			"Correct."
		);
	});
}
async function selectDataset(text: string, size = text.length) {
	const input = document.querySelector("#dataset") as HTMLInputElement;
	Object.defineProperty(input, "files", {
		value: [{ name: "cases.json", size, text: async () => text }],
		configurable: true
	});
	input.dispatchEvent(new Event("change"));
	await new Promise(resolve => setTimeout(resolve, 0));
}
it("retains the previous valid quiz after malformed,empty and oversized files", async () => {
	const page = quizPage();
	(document.querySelector("#start") as HTMLButtonElement).click();
	submitQuiz("Montgomery");
	const previous = JSON.stringify(page.read("game"));
	for (const [text, size] of [
		["{broken", 7],
		[
			JSON.stringify({
				schemaVersion: 1,
				viewBox: [0, 0, 100, 100],
				states: []
			}),
			100
		],
		["{}", 1048577]
	] as const) {
		await selectDataset(text, size);
		expect(document.querySelector("#status")!.textContent).toContain(
			"Dataset rejected."
		);
		expect(JSON.stringify(page.read("game"))).toBe(previous);
	}
});
it("restoring supplied data wins over an older pending selected-file response", async () => {
	const page = quizPage();
	let finish!: (text: string) => void;
	const input = document.querySelector("#dataset") as HTMLInputElement;
	Object.defineProperty(input, "files", {
		value: [
			{
				name: "late.json",
				size: 100,
				text: () =>
					new Promise<string>(resolve => {
						finish = resolve;
					})
			}
		],
		configurable: true
	});
	input.dispatchEvent(new Event("change"));
	expect(page.read("loading")).toBe(true);
	(document.querySelector("#supplied") as HTMLButtonElement).click();
	finish('{"schemaVersion":99}');
	await new Promise(resolve => setTimeout(resolve, 0));
	expect(page.read("game.dataset.states.length")).toBe(50);
	expect(page.read("game.phase")).toBe("ready");
	expect(document.querySelector("#status")!.textContent).toBe("");
	expect(page.read("loading")).toBe(false);
});
