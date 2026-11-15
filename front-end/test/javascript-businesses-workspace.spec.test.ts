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
		resolve("../test/fixtures/javascript-businesses-sources.json"),
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
		"imports complete local Businesses " +
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
				"\nObserved all business and product records.\n";
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
		"preserves the published Businesses identity and source role for " +
			role,
		async () => {
			setActivePinia(createPinia());
			if (role === "instructor")
				useAppStore().setCurrentTutor({
					_id: "businesses-tutor",
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
			expect(item.title).toBe("JSM6 Project 2: My Favorite Businesses");
			for (const token of [
				"at least three business objects",
				"at least three other properties",
				"at least three entries",
				"one or two",
				"fictional",
				"Complete when"
			])
				expect(item.content).toContain(token);
			expect(item.projectLink).toBe(fixture.resources[0].urls[0]);
			expect(item.solutionLink).toBe(
				role === "instructor" ? fixture.resources[1].urls[0] : undefined
			);
			expect(javascriptCourseResource(item.projectLink!)?.project).toBe(
				"my-favorite-businesses"
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
function runBusinesses(source: string, reducedMotion: boolean) {
	const paragraphs: string[] = [],
		colors: string[] = [],
		durations: number[] = [];
	const node = {
		select: () => node,
		append: (tag: string) => {
			expect(tag).toBe("p");
			return node;
		},
		attr: () => node,
		style: (key: string, value: string) => {
			if (key === "color") colors.push(value);
			return node;
		},
		text: (text: string) => {
			paragraphs.push(text);
			return node;
		},
		transition: () => node,
		duration: (value: number) => {
			durations.push(value);
			return node;
		}
	};
	const records = runInNewContext(
		source + '\n;typeof businesses==="undefined"?undefined:businesses',
		{
			d3: node,
			window: { matchMedia: () => ({ matches: reducedMotion }) }
		},
		{ timeout: 1000 }
	);
	return { paragraphs, colors, durations, records };
}
for (const row of fixture.scenarios)
	for (const reduced of [false, true]) {
		it(
			"describes every object/property/product for " +
				row.name +
				" with reducedMotion=" +
				reduced,
			() => {
				const source = fixture.files.reference["script.js"].replace(
					"businesses.forEach",
					row.mutation + "\nbusinesses.forEach"
				);
				const actual = runBusinesses(source, reduced);
				expect(actual.records).toEqual(row.data);
				expect(actual.paragraphs).toEqual(row.paragraphs);
				expect(actual.durations).toEqual(
					row.paragraphs.map(() => (reduced ? 0 : 1000))
				);
				expect(
					actual.colors.every(c =>
						["#0b2022", "#1235a8", "#4e175e", "#24551c"].includes(c)
					)
				).toBe(true);
				for (const record of actual.records) {
					expect(Object.keys(record)).toHaveLength(4);
					expect(record.products.length).toBeGreaterThanOrEqual(3);
				}
			}
		);
	}
it("keeps the blank original starter, local libraries and notices without a completed array", () => {
	const blank = runBusinesses(fixture.files.starter["script.js"], false);
	expect(blank.paragraphs).toEqual([]);
	expect(blank.records).toBeUndefined();
	expect(fixture.files.starter["script.js"]).toContain(
		"// Please enter your code below this line."
	);
	expect(fixture.files.starter["script.js"]).toContain(
		"// Please don't alter the code below this line!"
	);
	for (const role of ["starter", "reference"]) {
		expect(fixture.files[role]["index.html"]).not.toMatch(
			/(?:src|href)=["']https?:/
		);
		expect(fixture.files[role]["vendor/d3.min.js"].slice(0, 100)).toContain(
			"v7.9.0"
		);
		expect(fixture.files[role]["LICENSE-original.txt"]).toContain(
			"MIT License"
		);
		expect(fixture.files[role]["SOURCES.md"]).toContain("fictional");
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
it("detects dropping the final business from the observed nested-loop task", () => {
	const broken = fixture.files.reference["script.js"].replace(
		"businesses.forEach",
		"businesses.slice(0, 2).forEach"
	);
	expect(broken).not.toBe(fixture.files.reference["script.js"]);
	expect(runBusinesses(broken, false).paragraphs).toHaveLength(4);
	expect(
		runBusinesses(fixture.files.reference["script.js"], false).paragraphs
	).toHaveLength(6);
});
