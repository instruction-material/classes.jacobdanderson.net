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
		resolve("../test/fixtures/javascript-coastal-cruise-sources.json"),
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
		"imports complete local Coastal Cruise " +
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
		"preserves the JSM7 Supplemental Project 1: Coastal Cruise identity and project roles for " +
			role,
		async () => {
			setActivePinia(createPinia());
			if (role === "instructor")
				useAppStore().setCurrentTutor({
					_id: "cruise-tutor",
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
			expect(item.title).toBe("JSM7 Supplemental Project 1: Coastal Cruise");
			for (const token of [
				"populateSeats",
				"registerSeat",
				"getNameAndNum",
				"Cancel",
				"README.md",
				"CASES.md"
			])
				expect(item.content).toContain(token);
			expect(item.projectLink).toBe(fixture.resources[0].urls[0]);
			expect(item.solutionLink).toBe(
				role === "instructor" ? fixture.resources[1].urls[0] : undefined
			);
			expect(javascriptCourseResource(item.projectLink!)?.project).toBe(
				"coastal-cruise"
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


function runCruise(role: "starter" | "reference", inputs: (string | null)[], capacity = 2) {
	const queue = [...inputs], logs: string[] = [], alerts: string[] = [];
	const result = runInNewContext(
		fixture.files[role]["script.js"].replace("const maxSeats = 2;", "const maxSeats = " + capacity + ";") + "\n;({ populateSeats, isOpen, registerSeat, isShipFull });",
		{ prompt: () => { if (!queue.length) throw new Error("Unexpected extra prompt"); return queue.shift(); },
			alert: (message: string) => alerts.push(message), console: { log: (message: string) => logs.push(message) } },
		{ timeout: 1000 }
	);
	return { ...result, logs, alerts, unusedInputs: queue };
}
it("keeps starter registration unfinished", () => {
	expect(runCruise("starter", []).logs).toEqual([]);
});
for (const [name, inputs, expected] of [
	["full ship", ["Ada", "1", "Lin", "2"], ["Seat 1: Ada", "Seat 2: Lin"]],
	["occupied seat", ["Ada", "1", "Eve", "1", "Lin", "2"], ["Seat 1: Ada", "Seat 2: Lin"]],
	["empty name", [" ", "1", "Ada", "1", "Lin", "2"], ["Seat 1: Ada", "Seat 2: Lin"]],
	["invalid numbers", ["Ada", "0", "Ada", "3", "Ada", "1.5", "Ada", "no", "Ada", "1", "Lin", "2"], ["Seat 1: Ada", "Seat 2: Lin"]],
	["cancel name", [null], ["Registration cancelled."]],
	["cancel seat", ["Ada", null], ["Registration cancelled."]],
	["cancel after reservation", ["Ada", "1", "Lin", null], ["Registration cancelled."]],
	["literal and trimmed names", ["  <b>Ada</b>  ", "1", "Lin", "2"], ["Seat 1: <b>Ada</b>", "Seat 2: Lin"]]
] as [string, (string | null)[], string[]][]) {
	it("preserves the expected registration result for " + name, () => {
		const r = runCruise("reference", inputs);
		expect(r.logs).toEqual(expected);
		expect(r.unusedInputs).toEqual([]);
		expect(r.alerts.some((line: string) => line.startsWith("Woo!"))).toBe(!name.startsWith("cancel"));
	});
}
it("supports changed capacity and separate seat objects with safe index validation", () => {
	const r = runCruise("reference", ["Grace","3","Ada","1","Lin","2"], 3);
	expect(r.logs).toEqual(["Seat 1: Ada","Seat 2: Lin","Seat 3: Grace"]);
	const ship = r.populateSeats();
	ship[0].name = "One";
	expect(ship[1].name).toBe("");
	for (const index of [-1, 3, 0.5, Number.NaN]) expect(r.isOpen(ship, index)).toBe(false);
	expect(r.registerSeat(ship, "Ada", 0)).toBe(true);
	expect(r.registerSeat(ship, "Eve", 0)).toBe(false);
	expect(ship[0].name).toBe("Ada");
	expect(r.registerSeat(ship, null, 1)).toBe(false);
});
