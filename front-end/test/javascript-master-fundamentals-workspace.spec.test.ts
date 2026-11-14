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
		resolve("../test/fixtures/javascript-master-fundamentals-sources.json"),
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
		"imports complete local original-aligned fundamentals " +
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
			expect(files).toHaveLength(9);
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
			expect(Object.keys(archive)).toHaveLength(9);
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
						_id: "fundamentals-tutor",
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
				expect(item.solutionLink).toBe(
					role === "instructor" ? reference.urls[0] : undefined
				);
				expect(
					javascriptCourseResource(item.projectLink!)?.project
				).toBe(project.project);
				expect(item.content).toContain("without a server");
				expect(item.content).toContain("README.md");
			}
		);
	}
}

function play(choices: (string | null)[], values: number[]) {
	const alerts: string[] = [];
	let draws = 0;
	let asks = 0;
	const ctx = {
		alert: (message: string) => alerts.push(message),
		document: { querySelector: () => ({ addEventListener: () => {} }) }
	};
	const source = fixture.files["double-or-nothing"].reference["script.js"];
	const fn = runInNewContext(source + ";playDoubleOrNothing", ctx);
	const balance = fn(
		() => {
			if (asks >= choices.length)
				throw new Error("Unexpected extra prompt");
			return choices[asks++];
		},
		() => {
			if (draws >= values.length)
				throw new Error("Unexpected extra flip");
			return values[draws++];
		}
	);
	return { balance, draws, asks, alerts };
}
it.each([
	{ choices: ["N"], values: [], balance: 1000, draws: 0, alerts: 0 },
	{ choices: [null], values: [], balance: 1000, draws: 0, alerts: 0 },
	{
		choices: ["Y", "Y", "N"],
		values: [0, 0.49999999],
		balance: 4000,
		draws: 2,
		alerts: 0
	},
	{ choices: ["Y"], values: [0.5], balance: 0, draws: 1, alerts: 0 },
	{ choices: ["Y"], values: [0.99999999], balance: 0, draws: 1, alerts: 0 },
	{
		choices: ["invalid", "", null],
		values: [],
		balance: 1000,
		draws: 0,
		alerts: 2
	},
	{ choices: [" y ", "n"], values: [0], balance: 2000, draws: 1, alerts: 0 }
])(
	"plays exact choice/coin trace %#",
	({ choices, values, balance, draws, alerts }) => {
		const actual = play(choices, values);
		expect(actual.balance).toBe(balance);
		expect(actual.draws).toBe(draws);
		expect(actual.asks).toBe(choices.length);
		expect(actual.alerts).toHaveLength(alerts);
	}
);
it.each([1, -0.01, NaN, Infinity])(
	"rejects invalid random endpoint %s",
	value => {
		expect(() => play(["Y"], [value])).toThrow("Random value");
	}
);
it("ends repeated heads before losing integer precision", () => {
	const ctx = {
		alert: () => {},
		document: { querySelector: () => ({ addEventListener: () => {} }) }
	};
	const fn = runInNewContext(
		fixture.files["double-or-nothing"].reference["script.js"] +
			";playDoubleOrNothing",
		ctx
	);
	let calls = 0;
	const balance = fn(
		() => {
			if (++calls > 60) throw new Error("Unbounded");
			return "Y";
		},
		() => 0
	);
	expect(Number.isSafeInteger(balance)).toBe(true);
	expect(balance).toBe(1000 * 2 ** 43);
	expect(calls).toBe(44);
});
it("the table supplies real relative SVGs,scoped columns and descriptive alternatives", () => {
	const source = fixture.files["favorite-restaurants"].reference;
	const doc = new JSDOM(source["index.html"]).window.document;
	expect(doc.querySelectorAll("thead th[scope=col]")).toHaveLength(3);
	expect(
		[...doc.querySelectorAll("tbody tr")].map(
			row => row.children[1].textContent
		)
	).toEqual(["Fries", "Orange Chicken", "Taco Bowl"]);
	for (const img of doc.querySelectorAll("img")) {
		expect(img.alt).toMatch(/^Illustration of /);
		const svg = new JSDOM(source[img.getAttribute("src")!], {
			contentType: "image/svg+xml"
		}).window.document;
		expect(svg.documentElement.getAttribute("viewBox")).toBe("0 0 120 96");
		expect(svg.querySelectorAll("script,image,foreignObject")).toHaveLength(
			0
		);
	}
	expect(doc.querySelectorAll("script")).toHaveLength(0);
	expect(source["styles.css"]).toContain("tbody tr:nth-child(even)");
});
