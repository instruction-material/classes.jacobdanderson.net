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
		resolve("../test/fixtures/javascript-media-parallax-sources.json"),
		"utf8"
	)
);
const originals = JSON.parse(
	readFileSync(
		resolve("../test/fixtures/javascript-media-parallax-originals.json"),
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
		const original = originals.resources.find(
			(row: { url: string }) => row.url === url
		);

		expect(original).toBeDefined();
		for (const [panel, key] of [
			["HTML", "html"],
			["CSS", "css"],
			["JavaScript", "javascript"]
		] as const) {
			expect(sha(original.panels[panel])).toBe(
				resource.originalSourceHashes[key]
			);
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
	it(`keeps the Media and Parallax assignments and reference boundaries for ${role}`, async () => {
		setActivePinia(createPinia());
		if (role === "instructor") {
			useAppStore().setCurrentTutor({
				_id: "MediaParallax-course-tutor",
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

it("keeps nine real HTTPS selections and explicit replacement provenance", () => {
	const metadata = JSON.parse(
		readFileSync(
			resolve("../test/fixtures/javascript-media-parallax-metadata.json"),
			"utf8"
		)
	);
	const reference = fixture.resources.find(
		(r: { project: string; role: string }) =>
			r.project === "video-collection" && r.role === "reference"
	);
	const source = readFileSync(
		resolve(
			root,
			reference.files.find(
				(f: { name: string }) => f.name === "index.html"
			).path
		),
		"utf8"
	);
	const page = new DOMParser().parseFromString(source, "text/html");
	const players = [...page.querySelectorAll("iframe")];
	expect(players).toHaveLength(9);
	expect(new Set(players.map(p => p.title)).size).toBe(9);
	for (const [index, player] of players.entries()) {
		const url = new URL(player.src);
		expect(url.protocol).toBe("https:");
		expect(url.hostname).toBe("www.youtube.com");
		expect(url.pathname).toBe("/embed/" + metadata.videos[index].id);
		expect(player.getAttribute("referrerpolicy")).toBe(
			"strict-origin-when-cross-origin"
		);
		expect(player.hasAttribute("allowfullscreen")).toBe(true);
		const card = player.closest("article")!;
		expect(card.querySelector("h2")!.textContent).toBe(
			metadata.videos[index].title
		);
		expect(card.querySelector("p")!.textContent).toBe(
			metadata.videos[index].description
		);
		expect(card.querySelector("a")!.getAttribute("href")).toBe(
			metadata.videos[index].watchURL
		);
	}
	expect(metadata.privateOriginal.visibleReason).toBe(
		"This video is private"
	);
	expect(
		metadata.videos.filter((v: { id: string }) =>
			metadata.originalVideoIds.includes(v.id)
		)
	).toHaveLength(8);
	expect(
		metadata.videos.every(
			(v: { actualPlayerPlayingObserved: boolean }) =>
				v.actualPlayerPlayingObserved
		)
	).toBe(true);
});
it("supplies original photo bytes, two Parallax targets and official visitor sources", () => {
	const metadata = JSON.parse(
		readFileSync(
			resolve("../test/fixtures/javascript-media-parallax-metadata.json"),
			"utf8"
		)
	);
	const reference = fixture.resources.find(
		(r: { project: string; role: string }) =>
			r.project === "national-park" && r.role === "reference"
	);
	const source = (name: string) =>
		readFileSync(
			resolve(
				root,
				reference.files.find((f: { name: string }) => f.name === name)
					.path
			),
			"utf8"
		);
	const page = new DOMParser().parseFromString(
		source("index.html"),
		"text/html"
	);
	expect(
		page.querySelectorAll(".parallax-container .parallax img")
	).toHaveLength(2);
	expect([...page.querySelectorAll("h2")].map(n => n.textContent)).toEqual([
		"Location",
		"Notable features",
		"Activities",
		"Visitor tips"
	]);
	expect(
		[...page.querySelectorAll("a")].every(
			n => new URL(n.href).hostname === "www.nps.gov"
		)
	).toBe(true);
	expect(source("index.html")).not.toContain("979-9797");
	expect(source("index.html")).not.toContain("info@yellowstone.com");
	for (const photo of metadata.photos) {
		const data = source("images/" + photo.key + ".svg");
		const encoded = data.match(
			/href="data:image\/jpeg;base64,([A-Za-z0-9+/=]+)"/
		)![1];
		expect(sha(Buffer.from(encoded, "base64"))).toBe(photo.sha256);
	}
	expect(source("script.js")).toContain("M.Parallax.init");
	expect(source("script.js")).toContain("motionPreference.addEventListener");
});
it("gives video projects their required local HTTP workflow while park pages remain offline", () => {
	for (const r of fixture.resources)
		for (const url of r.urls) {
			const instructions = webBuildInstructions(url).join("\n");
			if (r.project === "video-collection") {
				expect(instructions).toContain(
					"python3 -m http.server 8000 --bind 127.0.0.1"
				);
				expect(instructions).toContain("http://127.0.0.1:8000");
				expect(instructions).toContain("internet connection");
				expect(instructions).not.toContain("without a server");
			} else expect(instructions).toContain("without a server");
		}
});
