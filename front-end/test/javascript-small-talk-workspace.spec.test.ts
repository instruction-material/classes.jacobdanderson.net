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
		resolve("../test/fixtures/javascript-small-talk-sources.json"),
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
		"imports complete local Small Talk " +
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
			expect(files).toHaveLength(6);
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
						content: "Earlier object planning",
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
				"\nObserved matching, differing and skipped fields.\n";
			await saveLocalPythonProjects([earlier, project]);
			const saved = await loadLocalPythonProjects();
			expect(saved.find(row => row._id === earlier._id)).toEqual(earlier);
			const reopened = saved.find(row => row._id === project._id)!;
			expect(reopened).toEqual(project);
			const archive = unzipSync(await createProjectArchive(reopened));
			expect(Object.keys(archive)).toHaveLength(6);
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
		"preserves the published Small Talk identity and role access for " +
			role,
		async () => {
			setActivePinia(createPinia());
			if (role === "instructor")
				useAppStore().setCurrentTutor({
					_id: "small-talk-tutor",
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
			expect(item.title).toBe("JSM6 Project 1: Small Talk");
			for (const text of [
				"exactly two declared variables",
				"at least five corresponding properties",
				"ternary",
				"0 through 120",
				"Cancel",
				"textContent",
				"Complete when"
			])
				expect(item.content).toContain(text);
			expect(item.projectLink).toBe(fixture.resources[0].urls[0]);
			expect(item.solutionLink).toBe(
				role === "instructor" ? fixture.resources[1].urls[0] : undefined
			);
			expect(javascriptCourseResource(item.projectLink!)?.project).toBe(
				"small-talk"
			);
		}
	);
}
function runConversation(source: string, answers: (string | null)[]) {
	const prompts: string[] = [],
		alerts: string[] = [],
		display = { textContent: "" };
	const context = {
		prompt: (message: string) => {
			prompts.push(message);
			return answers[prompts.length - 1];
		},
		alert: (message: string) => alerts.push(message),
		document: {
			getElementById: (id: string) => {
				expect(id).toBe("summary");
				return display;
			}
		}
	};
	const values = runInNewContext(
		source + "\n;({aboutMe,aboutYou})",
		context,
		{ timeout: 1000 }
	);
	return { prompts, alerts, summary: display.textContent, values };
}
for (const row of fixture.scenarios) {
	it(
		"completes all six questions with typed object values: " + row.name,
		() => {
			const actual = runConversation(
				fixture.files.reference["script.js"],
				row.answers
			);
			expect(actual.prompts).toHaveLength(6);
			expect(actual.alerts).toHaveLength(row.alerts);
			expect(actual.values.aboutYou).toEqual(row.values);
			expect(Object.keys(actual.values.aboutMe)).toEqual(
				Object.keys(row.values)
			);
			expect(actual.summary).toBe(row.summary);
			expect(actual.prompts.join("\n")).not.toMatch(/\b(?:null|NaN)\b/);
			expect(actual.summary).not.toMatch(/\b(?:null|NaN)\b/);
			if (row.name === "trim-and-case") {
				expect(actual.prompts[2]).toContain("same city");
				expect(actual.prompts[4]).toContain("same school");
				expect(actual.prompts[5]).toContain("share a favorite subject");
				expect(actual.alerts.at(-1)).toContain("agree about pizza");
			}
			if (row.name === "differs")
				expect(actual.alerts.at(-1)).toContain("differ about pizza");
		}
	);
}
it("retains the original unfinished starter and the two-object constraint", () => {
	const starter = fixture.files.starter["script.js"];
	let prompts = 0;
	runInNewContext(starter, { prompt: () => prompts++ }, { timeout: 1000 });
	expect(prompts).toBe(0);
	expect(
		[
			...fixture.files.reference["script.js"].matchAll(
				/^\s*(?:const|let|var)\s+([A-Za-z_$][\w$]*)/gm
			)
		].map(m => m[1])
	).toEqual(["aboutMe", "aboutYou"]);
	expect(fixture.files.reference["script.js"]).not.toContain("innerHTML");
	for (const role of ["starter", "reference"]) {
		expect(fixture.files[role]["index.html"]).not.toMatch(
			/(?:src|href)=["']https?:/
		);
		expect(fixture.files[role]["LICENSE-original.txt"]).toContain(
			"MIT License"
		);
		expect(fixture.files[role]["README.md"]).toContain(
			"five corresponding properties"
		);
	}
	expect(
		javascriptCourseProjectKey(
			fixture.courseId,
			fixture.itemId,
			"starter",
			fixture.resources[0].urls[0]
		)
	).not.toBe(
		javascriptCourseProjectKey(
			fixture.courseId,
			fixture.itemId,
			"reference",
			fixture.resources[1].urls[0]
		)
	);
});
it("rejects restoring the original cancellation crash and lossy pizza matching", () => {
	const source = fixture.files.reference["script.js"];
	const nullCrash = source.replace("aboutYou.name === null || ", "");
	expect(nullCrash).not.toBe(source);
	expect(() => runConversation(nullCrash, Array(6).fill(null))).toThrow(
		/null/
	);
	const caseLoss = source.replace(
		"aboutYou.pineappleOnPizza.trim().toLowerCase()",
		"aboutYou.pineappleOnPizza"
	);
	expect(caseLoss).not.toBe(source);
	expect(
		runConversation(
			caseLoss,
			fixture.scenarios.find(
				(r: { name: string }) => r.name === "trim-and-case"
			).answers
		).values.aboutYou.pineappleOnPizza
	).toBeNull();
});
