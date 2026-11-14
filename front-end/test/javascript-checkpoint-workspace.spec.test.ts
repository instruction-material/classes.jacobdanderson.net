import { createHash, webcrypto } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import vm from "node:vm";
import { strFromU8, unzipSync } from "fflate";
import { createPinia, setActivePinia } from "pinia";
import { afterEach, expect, it, vi } from "vitest";
import {
	javascriptCourseProjectKey,
	javascriptCourseResource,
	loadJavaScriptCourseFiles
} from "@/modules/javascriptCourseResources";
import { createProjectArchive } from "@/modules/projectArchive";
import {
	clearLocalPythonProjects,
	createPythonIdeProject,
	loadLocalPythonProjects,
	saveLocalPythonProjects
} from "@/modules/pythonIde";
import { useAppStore } from "@/stores/app";
import { useCoursesStore } from "@/stores/courses";

const fixture = JSON.parse(
	readFileSync(
		resolve("../test/fixtures/javascript-checkpoint-sources.json"),
		"utf8"
	)
);
const root = resolve("public/course-assets/javascript-level-1");
const prefix = "/course-assets/javascript-level-1/";
const sha = (text: string) => createHash("sha256").update(text).digest("hex");

afterEach(async () => {
	vi.unstubAllGlobals();
	await clearLocalPythonProjects();
	document.body.replaceChildren();
});
for (const resource of fixture.resources) {
	it(`retains complete ${resource.project} ${resource.role} files through consent-free lookup, import, saved edits and ZIP export`, async () => {
		vi.stubGlobal("crypto", webcrypto);
		const requested: string[] = [];
		vi.stubGlobal(
			"fetch",
			vi.fn(async (url: string, options: RequestInit) => {
				expect(options).toMatchObject({
					credentials: "omit",
					redirect: "error"
				});
				expect(url.startsWith(prefix)).toBe(true);
				requested.push(url);
				return new Response(
					readFileSync(resolve(root, url.slice(prefix.length)))
				);
			})
		);
		expect(javascriptCourseResource(resource.urls[0])).toMatchObject({
			project: resource.project,
			role: resource.role
		});
		expect(requested).toEqual([]);
		const files = (await loadJavaScriptCourseFiles(resource.urls[0]))!;
		expect(files).toHaveLength(resource.files.length);
		for (const file of files) {
			const declared = resource.files.find(
				(r: { name: string }) => r.name === file.name
			);
			expect(sha(file.content)).toBe(declared.sha256);
			expect(Buffer.byteLength(file.content)).toBe(declared.byteLength);
		}
		const key = javascriptCourseProjectKey(
			fixture.courseId,
			resource.itemId,
			resource.role,
			resource.urls[0]
		);
		for (const url of resource.urls)
			expect(
				javascriptCourseProjectKey(
					fixture.courseId,
					resource.itemId,
					resource.role,
					url
				)
			).toBe(key);
		expect(() =>
			javascriptCourseProjectKey(
				fixture.courseId,
				resource.itemId,
				resource.role === "starter" ? "reference" : "starter",
				resource.urls[0]
			)
		).toThrow();
		const prior = createPythonIdeProject("web", {
			files: [
				{
					name: "index.html",
					content: "Earlier work",
					encoding: "text"
				}
			],
			courseID: fixture.courseId,
			courseProjectKey: "earlier"
		});
		const project = createPythonIdeProject("web", {
			files,
			courseID: fixture.courseId,
			courseProjectKey: key,
			starterUrl: resource.urls[0]
		});
		project.files.find(f => f.name === "index.html")!.content +=
			"\n<!-- Saved checkpoint -->";
		await saveLocalPythonProjects([prior, project]);
		const saved = await loadLocalPythonProjects();
		expect(saved.find(p => p._id === prior._id)).toEqual(prior);
		const reopened = saved.find(p => p._id === project._id)!;
		expect(reopened).toEqual(project);
		const archive = unzipSync(await createProjectArchive(reopened));
		expect(Object.keys(archive)).toHaveLength(resource.files.length);
		for (const file of reopened.files) {
			const path = Object.keys(archive).find(p =>
				p.endsWith(`/${file.name}`)
			)!;
			expect(strFromU8(archive[path])).toBe(file.content);
		}
	});
}
for (const role of ["learner", "instructor"]) {
	it(`binds actual checkpoint tasks to their accurate source roles for ${role}`, async () => {
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
		for (const resource of fixture.resources) {
			const module = course.modules.find(
				m => m.id === resource.moduleId
			)!;
			const item = module.curriculum.find(i => i.id === resource.itemId)!;
			expect(item, resource.itemId).toBeDefined();
			expect(item.title).toBe(resource.assignmentTitle);
			if (resource.role === "starter")
				expect(item.projectLink).toBe(resource.urls[0]);
			else if (role === "instructor")
				expect(item.solutionLink).toBe(resource.urls[0]);
			else expect(item.solutionLink).toBeUndefined();
		}
		const animation = course.modules
			.flatMap(m => m.curriculum)
			.find(
				i =>
					i.title ===
					"Check-In #2: Animations and JavaScript Components"
			)!;
		expect(animation.content).toContain("modal");
		expect(animation.content).toContain("mouseout");
		expect(animation.content).not.toContain("collapsible");
	});
}

function runGolf(guesses: (string | null)[], secrets: number[]) {
	const resource = fixture.resources.find(
		(r: { project: string; role: string }) =>
			r.project === "guessing-golf" && r.role === "reference"
	);
	const source = readFileSync(
		resolve(
			root,
			resource.files.find((r: { name: string }) => r.name === "script.js")
				.path
		),
		"utf8"
	);
	const answers = [...guesses],
		randoms = [...secrets],
		alerts: string[] = [],
		output: string[] = [];
	let prompts = 0;
	const context = vm.createContext({
		prompt: () => {
			prompts++;
			expect(answers.length).toBeGreaterThan(0);
			return answers.shift();
		},
		alert: (text: string) => alerts.push(text),
		Math: {
			floor: Math.floor,
			abs: Math.abs,
			random: () => {
				expect(randoms.length).toBeGreaterThan(0);
				return randoms.shift();
			}
		},
		Number,
		document: {
			querySelector: (selector: string) =>
				selector === "#start"
					? { addEventListener: () => {} }
					: {
							append: (line: { textContent: string }) =>
								output.push(line.textContent)
						},
			createElement: () => ({ textContent: "" })
		}
	});
	vm.runInContext(source + "\nplayGolf();", context, { timeout: 1000 });
	return { output, alerts, prompts, remainingSecrets: randoms.length };
}
it("sums all nine distances with one secret per round including both range endpoints", () => {
	const result = runGolf(
		["0", "1", "2", "10", "8", "14", "19", "0", "10"],
		[0, 0.5, 0.999999]
	);
	expect(result.prompts).toBe(9);
	expect(result.remainingSecrets).toBe(0);
	expect(result.output).toContain("Round 1: 3 points. Total: 3.");
	expect(result.output).toContain("Round 2: 6 points. Total: 9.");
	expect(result.output).toContain("Round 3: 28 points. Total: 37.");
	expect(result.output.at(-1)).toBe(
		"Final total: 37. Lower scores are better."
	);
});
it("retries invalid entries without charging a guess and ends cleanly on Cancel", () => {
	const result = runGolf(["", " ", "bad", "1.5", "-1", "20", "0", null], [0]);
	expect(result.alerts).toHaveLength(6);
	expect(result.prompts).toBe(8);
	expect(result.output).toEqual([
		"Round 1, guess 1: 0 points.",
		"Game ended. Completed-round total: 0."
	]);
});
