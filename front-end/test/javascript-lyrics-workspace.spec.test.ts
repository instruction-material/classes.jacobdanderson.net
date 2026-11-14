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
		resolve("../test/fixtures/javascript-lyrics-sources.json"),
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
		"imports complete local lyrics " +
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
						content: "Earlier lyrics planning",
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
				"\nObserved all three answer/cancellation cases.\n";
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
for (const role of ["learner", "instructor"] as const) {
	it(
		"offers the correct lyrics source and keeps reference access separate for " +
			role,
		async () => {
			setActivePinia(createPinia());
			if (role === "instructor")
				useAppStore().setCurrentTutor({
					_id: "lyrics-tutor",
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
			expect(item.title).toBe("JSM1 Project 1: Finish the Lyrics");
			const extension = module.supplementalProjects.find(
				i => i.projectLink === fixture.resources[0].urls[0]
			)!;
			expect(extension.content).toContain(
				"Compare exact answer matching"
			);
			expect(extension.content).toContain("cancelled prompt");
			expect(extension.projectLink).toBe(item.projectLink);
			expect(
				javascriptCourseProjectKey(
					fixture.courseId,
					extension.id,
					"starter",
					extension.projectLink!
				)
			).not.toBe(
				javascriptCourseProjectKey(
					fixture.courseId,
					item.id,
					"starter",
					item.projectLink!
				)
			);

			expect(item.content).toContain("guessing game");
			expect(item.content).toContain("null");
			expect(item.projectLink).toBe(fixture.resources[0].urls[0]);
			expect(item.solutionLink).toBe(
				role === "instructor" ? fixture.resources[1].urls[0] : undefined
			);
			expect(javascriptCourseResource(item.projectLink!)?.courseId).toBe(
				fixture.courseId
			);
		}
	);
}

function runGame(source: string, answers: (string | null)[]) {
	const displayed: string[] = [],
		alerts: string[] = [];
	let prompts = 0;
	const node = {
		append: () => node,
		attr: () => node,
		style: () => node,
		text: (text: string) => {
			displayed.push(text);
			return node;
		},
		transition: () => node,
		duration: () => node
	};
	runInNewContext(
		source,
		{
			d3: { select: () => node },
			window: { matchMedia: () => ({ matches: true }) },
			alert: (text: string) => alerts.push(text),
			prompt: () => answers[prompts++]
		},
		{ timeout: 1000 }
	);
	return { displayed, alerts, prompts };
}

it("retains the blank original project area and complete helper without auto-answering", () => {
	const starter = runGame(fixture.files.starter["script.js"], []);
	expect(starter.prompts).toBe(0);
	expect(starter.displayed).toEqual([]);
	expect(fixture.files.starter["script.js"]).toContain(
		"// DO NOT ALTER CODE WRITTEN BELOW THIS LINE"
	);
	expect(fixture.files.starter["script.js"]).not.toContain("let numCorrect");
	expect(fixture.files.reference["script.js"]).toContain("lyric1 !== null");
	for (const role of ["starter", "reference"]) {
		expect(fixture.files[role]["index.html"]).not.toMatch(
			/(?:src|href)=["']https?:/
		);
		expect(fixture.files[role]["vendor/d3.min.js"].slice(0, 100)).toContain(
			"v7.9.0"
		);
	}
});
const correct = ["program", "easier", "clear"];
for (let code = 0; code < 27; code++) {
	const kinds = [
		code % 3,
		Math.floor(code / 3) % 3,
		Math.floor(code / 9) % 3
	];
	const answers = kinds.map((kind, index) =>
		kind === 0 ? correct[index] : kind === 1 ? "wrong" : null
	);
	const score = kinds.filter(kind => kind === 0).length;
	it(
		"reports the score and completes three questions for answer/cancel case " +
			code,
		() => {
			const actual = runGame(
				fixture.files.reference["script.js"],
				answers
			);
			expect(actual.prompts).toBe(3);
			expect(actual.alerts).toHaveLength(4);
			expect(actual.displayed).toEqual([
				"You got " + score + " answers out of 3 correct!"
			]);
		}
	);
}
it("normalizes whitespace/case and resets the score on another independent attempt", () => {
	expect(
		runGame(fixture.files.reference["script.js"], [
			" PROGRAM ",
			" EaSier ",
			" CLEAR "
		]).displayed
	).toEqual(["You got 3 answers out of 3 correct!"]);
	expect(
		runGame(fixture.files.reference["script.js"], ["", "", ""]).displayed
	).toEqual(["You got 0 answers out of 3 correct!"]);
});
it("rejects a controlled restoration of the observed null-answer crash", () => {
	const broken = fixture.files.reference["script.js"].replace(
		"lyric1 !== null && ",
		""
	);
	expect(broken).not.toBe(fixture.files.reference["script.js"]);
	expect(() => runGame(broken, [null, "easier", "clear"])).toThrow(/null/);
});
