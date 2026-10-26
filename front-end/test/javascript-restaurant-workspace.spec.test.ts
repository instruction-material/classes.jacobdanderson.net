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
import { webBuildInstructions } from "@/modules/webBuildInstructions";
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
		resolve("../test/fixtures/javascript-restaurant-sources.json"),
		"utf8"
	)
);
const originals = JSON.parse(
	readFileSync(
		resolve("../test/fixtures/javascript-restaurant-original.json"),
		"utf8"
	)
);
const root = resolve("public/course-assets/javascript-level-1");
const prefix = "/course-assets/javascript-level-1/";
const sha = (value: string | Uint8Array) =>
	createHash("sha256").update(value).digest("hex");

afterEach(async () => {
	vi.unstubAllGlobals();
	await clearLocalPythonProjects();
	document.body.replaceChildren();
});

for (const resource of fixture.resources) {
	it(`imports, exports and preserves saved work for the assigned ${resource.project} ${resource.role}`, async () => {
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
		if (resource.role === "reference") {
			expect(resource.independentlyAuthoredStarter).toBe(false);
			for (const [panel, key] of [
				["HTML", "html"],
				["CSS", "css"],
				["JavaScript", "javascript"]
			] as const)
				expect(sha(originals.panels[panel])).toBe(
					resource.originalSourceHashes[key]
				);
		} else {
			expect(resource.independentlyAuthoredStarter).toBe(true);
			expect(url.startsWith(prefix)).toBe(true);
		}
		const key = javascriptCourseProjectKey(
			fixture.courseId,
			resource.itemId,
			resource.role,
			url
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
			files: [
				{
					name: "index.html",
					content: "// Earlier layout work\n",
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
		let reopened = project;
		await saveLocalPythonProjects([earlier, project]);
		const saved = await loadLocalPythonProjects();
		expect(saved.find(row => row._id === earlier._id)).toEqual(earlier);
		reopened = saved.find(row => row._id === project._id)!;
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
	it(`keeps the Restaurant Splash Page assignment and reference boundaries for ${role}`, async () => {
		setActivePinia(createPinia());
		if (role === "instructor") {
			useAppStore().setCurrentTutor({
				_id: "MasterProject-course-tutor",
				name: "Tutor",
				email: "tutor@example.invalid",
				age: 30,
				state: "GA",
				usersOfTutorLength: 0,
				coursePermissions: [fixture.courseId],
				editTutors: false,
				saveEdit: "Save"
			});
		}
		const course = (await useCoursesStore().loadCourseById(
			fixture.courseId
		))!;
		const module = course.modules.find(
			module => module.id === fixture.moduleId
		)!;
		expect(module).toBeDefined();
		for (const resource of fixture.resources) {
			const items =
				resource.section === "core"
					? module.curriculum
					: module.supplementalProjects;
			const item = items.find(item => item.id === resource.itemId)!;
			expect(item, resource.assignmentTitle).toBeDefined();
			expect(item.title).toBe(resource.assignmentTitle);

			if (resource.role === "starter")
				expect(item.projectLink).toBe(resource.urls[0]);
			else if (role === "instructor")
				expect(item.solutionLink).toBe(resource.urls[0]);
			else expect(item.solutionLink).toBeUndefined();
		}
	});
}

it("retains the original restaurant structure, exact menu and licensed image bytes", () => {
	const reference = fixture.resources.find(
		(row: { role: string }) => row.role === "reference"
	);
	const starter = fixture.resources.find(
		(row: { role: string }) => row.role === "starter"
	);
	const read = (resource: typeof reference, name: string) =>
		readFileSync(
			resolve(
				root,
				resource.files.find(
					(file: { name: string }) => file.name === name
				).path
			),
			"utf8"
		);
	const page = new DOMParser().parseFromString(
		read(reference, "index.html"),
		"text/html"
	);
	const captured = new DOMParser().parseFromString(
		originals.panels.HTML,
		"text/html"
	);
	expect(page.querySelectorAll(".parallax-container")).toHaveLength(
		captured.querySelectorAll(".parallax-container").length
	);
	expect(page.querySelectorAll(".card.horizontal")).toHaveLength(5);
	expect(page.querySelectorAll(".menu > .row.container")).toHaveLength(
		captured.querySelectorAll(".row.container .card.horizontal").length
	);
	expect(
		[...page.querySelectorAll(".card h3")].map(node => node.textContent)
	).toEqual(
		[...captured.querySelectorAll(".card h6")].map(node => node.textContent)
	);
	expect(
		[...page.querySelectorAll(".price")].map(node => node.textContent)
	).toEqual(["$12.50", "$9.50", "$10.50", "$11.50", "$7.50"]);
	expect(page.querySelectorAll(".menu .right")).toHaveLength(2);
	expect(page.querySelectorAll("img")).toHaveLength(7);
	expect(
		[...page.querySelectorAll("img")].every(node =>
			node.getAttribute("src")!.startsWith("images/")
		)
	).toBe(true);
	expect(read(reference, "index.html")).not.toMatch(
		/650.333|info@junieatz.com|https:\/\/(?:infatuation|www.washingtonian|www.mexicanplease)/
	);
	const empty = new DOMParser().parseFromString(
		read(starter, "index.html"),
		"text/html"
	);
	expect(empty.querySelector("main")!.textContent?.trim()).toBe("");
	expect(empty.querySelectorAll(".card,.parallax")).toHaveLength(0);
	const photos = JSON.parse(
		readFileSync(
			resolve(
				"../test/fixtures/javascript-restaurant-image-sources.json"
			),
			"utf8"
		)
	);
	for (const photo of photos) {
		const svg = read(reference, "images/" + photo.name + ".svg");
		const encoded = svg.match(/data:image\/jpeg;base64,([^"]+)/)![1];
		expect(sha(Buffer.from(encoded, "base64"))).toBe(photo.sha256);
		expect(read(reference, "SOURCES.md")).toContain(photo.sha256);
		expect(read(reference, "SOURCES.md")).toContain(photo.source);
	}
	for (const resource of fixture.resources) {
		expect(read(resource, "README.md")).toContain("authored companion");
		expect(read(resource, "README.md")).toContain(
			"five alternating horizontal menu cards"
		);
		expect(
			resource.files.some(
				(file: { name: string }) =>
					file.name === "LICENSE-Materialize.txt"
			)
		).toBe(true);
		expect(
			resource.files.some((file: { name: string }) =>
				/d3|jquery/i.test(file.name)
			)
		).toBe(false);
		expect(webBuildInstructions(resource.urls[0]).join("\n")).toContain(
			"without a server"
		);
	}
});
