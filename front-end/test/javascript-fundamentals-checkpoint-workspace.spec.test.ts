import { createHash, webcrypto } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
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
			"../test/fixtures/javascript-fundamentals-checkpoint-sources.json"
		),
		"utf8"
	)
);
const root = resolve("public/course-assets/javascript-level-1");
const prefix = "/course-assets/javascript-level-1/";
const sha = (value: string) => createHash("sha256").update(value).digest("hex");

afterEach(async () => {
	vi.unstubAllGlobals();
	await clearLocalPythonProjects();
	document.body.replaceChildren();
});

for (const resource of fixture.resources) {
	it(`imports, saves and exports the authored ${resource.project} ${resource.role}`, async () => {
		vi.stubGlobal("crypto", webcrypto);
		const requested: string[] = [];
		vi.stubGlobal(
			"fetch",
			vi.fn(async (value: string, options: RequestInit) => {
				expect(value.startsWith(prefix)).toBe(true);
				expect(options).toMatchObject({
					credentials: "omit",
					redirect: "error"
				});
				requested.push(value);
				return new Response(
					readFileSync(resolve(root, value.slice(prefix.length)))
				);
			})
		);
		const url = resource.urls[0];
		expect(javascriptCourseResource(url)).toMatchObject({
			project: resource.project,
			role: resource.role
		});
		expect(pythonIdeModeForCourseResource(fixture.courseId, url)).toBe(
			"web"
		);
		expect(requested).toHaveLength(0);
		const files = await loadPythonIdeStarterFilesFromGitHub(url, "web");
		expect(files).toHaveLength(resource.files.length);
		expect(requested).toHaveLength(resource.files.length);
		for (const file of files) {
			const declared = resource.files.find(
				(row: { name: string }) => row.name === file.name
			);
			expect(file.content).toBe(
				readFileSync(resolve(root, declared.path), "utf8")
			);
			expect(sha(file.content)).toBe(declared.sha256);
		}
		const key = javascriptCourseProjectKey(
			fixture.courseId,
			fixture.coreID,
			resource.role,
			url
		);
		for (const alias of resource.urls)
			expect(
				javascriptCourseProjectKey(
					fixture.courseId,
					fixture.coreID,
					resource.role,
					alias
				)
			).toBe(key);
		const earlier = createPythonIdeProject("web", {
			files: [
				{
					name: "index.html",
					content: "// Earlier HTML/CSS work\n",
					encoding: "text"
				}
			],
			courseID: fixture.courseId,
			courseProjectKey: `${key}:earlier`
		});
		const project = createPythonIdeProject("web", {
			files,
			courseID: fixture.courseId,
			courseProjectKey: key,
			starterUrl: url
		});
		project.files.find(file => file.name === "index.html")!.content +=
			"\n<!-- Saved markup change -->\n";
		await saveLocalPythonProjects([earlier, project]);
		const saved = await loadLocalPythonProjects();
		expect(saved.find(row => row._id === earlier._id)).toEqual(earlier);
		const reopened = saved.find(row => row._id === project._id)!;
		expect(reopened).toEqual(project);
		const archive = unzipSync(await createProjectArchive(reopened));
		expect(Object.keys(archive)).toHaveLength(resource.files.length);
		for (const file of reopened.files) {
			const path = Object.keys(archive).find(path =>
				path.endsWith(`/${file.name}`)
			)!;
			expect(strFromU8(archive[path])).toBe(file.content);
		}
	});
}

for (const role of ["learner", "instructor"] as const) {
	it(
		"keeps the shared checkpoint roles and identities for " + role,
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
			const all = course.modules.flatMap(module => [
				...module.curriculum,
				...module.supplementalProjects
			]);
			expect(all).toHaveLength(157);
			for (const title of [
				"Document Object Model (DOM)",
				"Component Libraries",
				"Material Icons"
			]) {
				expect(
					all.find(item => item.title === title)!.contentKind
				).toBe("reading");
			}
			for (const itemID of fixture.itemIds) {
				const item = all.find(item => item.id === itemID)!;
				expect(item).toBeDefined();
				const starter = fixture.resources.find(
					(r: { role: string }) => r.role === "starter"
				);
				const reference = fixture.resources.find(
					(r: { role: string }) => r.role === "reference"
				);
				expect(item.projectLink).toBe(starter.urls[0]);
				expect(
					javascriptCourseProjectKey(
						fixture.courseId,
						item.id,
						"starter",
						item.projectLink!
					)
				).toBe(
					javascriptCourseProjectKey(
						fixture.courseId,
						fixture.coreID,
						"starter",
						starter.urls[0]
					)
				);
				if (role === "instructor")
					expect(item.solutionLink).toBe(reference.urls[0]);
				else expect(item.solutionLink).toBeUndefined();
			}
			expect(
				all.find(item => item.id === fixture.coreID)!.contentKind
			).toBe("reading");
		}
	);
}
it("preserves the original reference alias without fetching CodePen", () => {
	const reference = fixture.resources.find(
		(r: { role: string }) => r.role === "reference"
	);
	expect(javascriptCourseResource(fixture.originalURL)).toMatchObject({
		project: "fundamentals-checkpoint",
		role: "reference",
		workspaceItemId: fixture.coreID
	});
	expect(
		javascriptCourseProjectKey(
			fixture.courseId,
			fixture.coreID,
			"reference",
			fixture.originalURL
		)
	).toBe(
		javascriptCourseProjectKey(
			fixture.courseId,
			fixture.coreID,
			"reference",
			reference.urls[0]
		)
	);
});
it("keeps complete local controls, prompts and explicit unfinished starters", () => {
	for (const resource of fixture.resources) {
		const text = (name: string) =>
			readFileSync(
				resolve(
					root,
					resource.files.find(
						(f: { name: string }) => f.name === name
					).path
				),
				"utf8"
			);
		const document = new DOMParser().parseFromString(
			text("index.html"),
			"text/html"
		);
		expect(
			[...document.querySelectorAll("#exercise option")].map(o =>
				o.getAttribute("value")
			)
		).toEqual([
			"variables",
			"math",
			"loops",
			"conditionals",
			"drawing",
			"nested"
		]);
		expect(
			[...document.querySelectorAll("script")].map(s =>
				s.getAttribute("src")
			)
		).toEqual(["vendor/d3.min.js", "script.js"]);
		for (const heading of [
			"Variables",
			"Mathematical Operators and Randomness",
			"Loops",
			"Conditionals",
			"Drawing in JavaScript",
			"Nested Loops"
		])
			expect(text("README.md")).toContain("Check-In #1: " + heading);
		expect(text("script.js").includes("TODO:")).toBe(
			resource.role === "starter"
		);
		expect(text("vendor/d3.min.js")).toContain("v5.16.0");
	}
});

it.each(["learner", "instructor"])(
	"continues web checkpoint tasks in the existing attempt for %s",
	async role => {
		setActivePinia(createPinia());
		if (role === "instructor")
			useAppStore().setCurrentTutor({
				_id: "web-checkpoint-tutor",
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
			module => module.title === "Check-In #2"
		)!;
		const base = module.curriculum.find(
			item => item.title === "Check-In #2: HTML & CSS"
		)!;
		for (const title of [
			"Check-In #2: Animations and JavaScript Components",
			"Check-In #2: Website Layout"
		]) {
			const item = module.curriculum.find(item => item.title === title)!;
			expect(
				javascriptCourseProjectKey(
					fixture.courseId,
					item.id,
					"starter",
					item.projectLink!
				)
			).toBe(
				javascriptCourseProjectKey(
					fixture.courseId,
					base.id,
					"starter",
					base.projectLink!
				)
			);
			if (role === "instructor")
				expect(
					javascriptCourseProjectKey(
						fixture.courseId,
						item.id,
						"reference",
						item.solutionLink!
					)
				).toBe(
					javascriptCourseProjectKey(
						fixture.courseId,
						base.id,
						"reference",
						base.solutionLink!
					)
				);
			else expect(item.solutionLink).toBeUndefined();
		}
		const oldReference = module.curriculum.find(item =>
			item.title.endsWith("Overview")
		)!;
		if (role === "instructor")
			expect(
				javascriptCourseProjectKey(
					fixture.courseId,
					oldReference.id,
					"reference",
					oldReference.solutionLink!
				)
			).toContain(":" + oldReference.id + ":reference:");
	}
);
