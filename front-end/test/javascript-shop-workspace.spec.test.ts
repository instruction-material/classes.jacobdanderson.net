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
		resolve("../test/fixtures/javascript-shop-sources.json"),
		"utf8"
	)
);
const originals = JSON.parse(
	readFileSync(
		resolve("../test/fixtures/javascript-shop-original.json"),
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
	it(`keeps the Jun-E-Commerce assignment and reference boundaries for ${role}`, async () => {
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

it("retains the original photographs, sample prices and corrected product identities", () => {
	const read = (role: string, name: string) => {
		const r = fixture.resources.find(
			(r: { role: string }) => r.role === role
		);
		return readFileSync(
			resolve(
				root,
				r.files.find((f: { name: string }) => f.name === name).path
			),
			"utf8"
		);
	};
	const page = new DOMParser().parseFromString(
		read("reference", "index.html"),
		"text/html"
	);
	const original = new DOMParser().parseFromString(
		originals.panels.HTML,
		"text/html"
	);
	expect(page.querySelectorAll(".carousel-item")).toHaveLength(
		original.querySelectorAll(".carousel-item").length
	);
	expect(page.querySelectorAll(".product-card")).toHaveLength(6);
	expect(
		[...page.querySelectorAll(".product-card h3")].map(n => n.textContent)
	).toEqual(fixture.correctedProductLabels);
	expect(
		[...original.querySelectorAll(".card-content p")].map(
			n => n.textContent
		)
	).toEqual(fixture.originalProductLabels);
	expect(
		[...original.querySelectorAll(".card-title")].map(
			n => Number(n.textContent!.replace("$", "")) * 100
		)
	).toEqual(fixture.priceCents);
	expect(
		[...page.querySelectorAll<HTMLElement>("[data-product]")].map(n =>
			Number(n.dataset.priceCents)
		)
	).toEqual(fixture.priceCents);
	expect(page.querySelector("[data-product=product-1] h3")!.textContent).toBe(
		"Sony PS one console"
	);
	expect(page.querySelector("[data-product=product-6] h3")!.textContent).toBe(
		"Jio portable Wi-Fi hotspot"
	);
	expect(page.querySelectorAll("button[data-add]:disabled")).toHaveLength(6);
	expect(page.querySelectorAll(".price")).toHaveLength(6);
	const images = JSON.parse(
		readFileSync(
			resolve("../test/fixtures/javascript-shop-images.json"),
			"utf8"
		)
	);
	expect(images).toHaveLength(10);
	expect(
		[...original.querySelectorAll("img")].map(n => n.getAttribute("src"))
	).toEqual(images.map((r: { sourceURL: string }) => r.sourceURL));
	for (const r of fixture.resources) {
		expect(r.files).toHaveLength(19);
		expect(read(r.role, "README.md")).toContain("authored companion");
		expect(read(r.role, "README.md")).toContain("without a server");
		expect(read(r.role, "LICENSE-Images.md")).toContain(
			"https://unsplash.com/license"
		);
		for (const image of images) {
			const svg = read(r.role, "images/" + image.name + ".svg");
			const encoded = svg.match(/data:image\/jpeg;base64,([^"]+)/)![1];
			expect(sha(Buffer.from(encoded, "base64"))).toBe(image.sha256);
			expect(read(r.role, "SOURCES.md")).toContain(image.sha256);
		}
	}
	const empty = new DOMParser().parseFromString(
		read("starter", "index.html"),
		"text/html"
	);
	expect(empty.querySelector("main")!.textContent?.trim()).toBe("");
	expect(empty.querySelectorAll(".carousel,.product-card")).toHaveLength(0);
});
