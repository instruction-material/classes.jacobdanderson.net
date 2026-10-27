import { webcrypto } from "node:crypto";
import { readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";
import { flushPromises, mount } from "@vue/test-utils";
import { strFromU8, unzipSync } from "fflate";
import { createPinia, setActivePinia } from "pinia";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { api } from "@/api";
import CourseExplorer from "@/components/CourseExplorer.vue";
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

vi.mock("@/api", () => ({ api: { get: vi.fn(), put: vi.fn() } }));

const firstCourse = "javascript-level-1-javascript-superstar";
const secondCourse = "javascript-level-2-javascript-master";
const sourceUrl = "https://codepen.io/junilearning/pen/JjGrYOG";

beforeEach(() => {
	setActivePinia(createPinia());
	vi.clearAllMocks();
	vi.mocked(api.get).mockResolvedValue({ data: [] });
	const values = new Map<string, string>();
	Object.defineProperty(window, "localStorage", {
		configurable: true,
		value: {
			clear: () => values.clear(),
			getItem: (key: string) => values.get(key) ?? null,
			removeItem: (key: string) => values.delete(key),
			setItem: (key: string, value: string) => values.set(key, value)
		}
	});
	window.history.replaceState({}, "", "/courses");
});

afterEach(async () => {
	vi.unstubAllGlobals();
	await clearLocalPythonProjects();
	window.history.replaceState({}, "", "/courses");
});

it("imports the shared starter and keeps saved work separate by course", async () => {
	vi.stubGlobal("crypto", webcrypto);
	const prefix = "/course-assets/javascript-level-1/";
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
			return new Response(readFileSync(resolve("public", url.slice(1))));
		})
	);
	expect(pythonIdeModeForCourseResource(secondCourse, sourceUrl)).toBe("web");
	expect(javascriptCourseResource(sourceUrl, secondCourse)).toMatchObject({
		courseId: secondCourse,
		project: "introduction",
		role: "starter"
	});
	const files = await loadPythonIdeStarterFilesFromGitHub(sourceUrl, "web");
	expect(requests).toHaveLength(6);
	expect(files.find(file => file.name === "script.js")?.content).toContain(
		"function printToScreen(text)"
	);
	expect(files.some(file => file.name === "vendor/d3.min.js")).toBe(true);
	const projects = [firstCourse, secondCourse].map(courseID =>
		createPythonIdeProject("web", {
			courseID,
			files,
			starterUrl: sourceUrl,
			courseProjectKey: javascriptCourseProjectKey(
				courseID,
				"setup-item",
				"starter",
				sourceUrl
			)
		})
	);
	const second = projects[1];
	const edited = second.files.find(file => file.name === "script.js")!;
	edited.content += '\nprintToScreen("Level 2 saved work");\n';
	await saveLocalPythonProjects(projects);
	const reopened = await loadLocalPythonProjects();
	expect(reopened).toHaveLength(2);
	expect(
		new Set(reopened.map(project => project.courseProjectKey)).size
	).toBe(2);
	const firstSaved = reopened.find(
		project => project.courseID === firstCourse
	)!;
	expect(
		firstSaved.files.find(file => file.name === "script.js")?.content
	).not.toContain("Level 2 saved work");
	const secondSaved = reopened.find(
		project => project.courseID === secondCourse
	)!;
	expect(
		secondSaved.files.find(file => file.name === "script.js")?.content
	).toBe(edited.content);
	const archive = unzipSync(await createProjectArchive(secondSaved));
	const scriptPath = Object.keys(archive).find(name =>
		name.endsWith("/script.js")
	)!;
	expect(strFromU8(archive[scriptPath])).toBe(edited.content);
});

it("limits sharing to the assigned introduction and preserves role boundaries", () => {
	expect(javascriptCourseResource(sourceUrl)?.courseId).toBe(firstCourse);
	expect(
		javascriptCourseProjectKey(
			firstCourse,
			"setup-item",
			"starter",
			sourceUrl
		)
	).toBe(`${firstCourse}:setup-item:starter:introduction:v1`);
	expect(() =>
		javascriptCourseProjectKey(
			secondCourse,
			"setup-item",
			"reference",
			sourceUrl
		)
	).toThrow(/course role/);
	expect(() =>
		javascriptCourseProjectKey(
			"python-level-1",
			"setup-item",
			"starter",
			sourceUrl
		)
	).toThrow(/course role/);
	expect(
		pythonIdeModeForCourseResource(
			secondCourse,
			"https://codepen.io/junilearning/pen/eYpBWWX"
		)
	).toBeNull();
	expect(
		pythonIdeModeForCourseResource(
			secondCourse,
			"https://codepen.io/junilearning/pen/c8c02ee2db01eeb4c5f408d9a1f58815"
		)
	).toBeNull();
});

function collectCapturedUrls(value: unknown, urls: Set<string>) {
	if (Array.isArray(value)) {
		for (const entry of value) collectCapturedUrls(entry, urls);
		return;
	}
	if (!value || typeof value !== "object") return;
	const record = value as Record<string, unknown>;
	const panels = record.panels as Record<string, unknown> | undefined;
	if (
		typeof record.url === "string" &&
		record.url.startsWith("https://codepen.io/") &&
		panels &&
		["HTML", "CSS", "JavaScript"].every(
			panel => typeof panels[panel] === "string"
		)
	) {
		urls.add(record.url);
	}
	for (const entry of Object.values(record)) collectCapturedUrls(entry, urls);
}

it.each(["learner", "instructor"] as const)(
	"routes every retained source shown to a %s through its assigned course role",
	async role => {
		const originalUrls = new Set<string>();
		const fixtures = resolve("../test/fixtures");
		for (const name of readdirSync(fixtures)) {
			if (/^javascript.*original.*\.json$/.test(name)) {
				collectCapturedUrls(
					JSON.parse(readFileSync(resolve(fixtures, name), "utf8")),
					originalUrls
				);
			}
		}
		if (role === "instructor") {
			useAppStore().setCurrentTutor({
				_id: "retained-source-tutor",
				name: "Tutor",
				email: "tutor@example.invalid",
				age: 30,
				state: "GA",
				coursePermissions: [firstCourse, secondCourse],
				usersOfTutorLength: 0,
				editTutors: false,
				saveEdit: "Save"
			});
		}
		const visibleUrls = new Set<string>();
		for (const courseId of [firstCourse, secondCourse]) {
			const course = (await useCoursesStore().loadCourseById(courseId))!;
			for (const module of course.modules) {
				for (const item of [
					...module.curriculum,
					...module.supplementalProjects
				]) {
					for (const [url, sourceRole] of [
						[item.projectLink, "starter"],
						[item.solutionLink, "reference"]
					] as const) {
						if (!url || !originalUrls.has(url)) continue;
						visibleUrls.add(url);
						expect(
							javascriptCourseResource(url, courseId),
							item.title
						).toMatchObject({
							courseId,
							role: sourceRole
						});
						expect(
							pythonIdeModeForCourseResource(courseId, url),
							item.title
						).toBe("web");
						expect(() =>
							javascriptCourseProjectKey(
								courseId,
								item.id,
								sourceRole,
								url
							)
						).not.toThrow();
					}
				}
			}
		}
		expect(visibleUrls.size).toBeGreaterThan(0);
		if (role === "instructor") expect(visibleUrls).toEqual(originalUrls);
	}
);

it.each(["learner", "instructor"] as const)(
	"offers the Level 2 introduction IDE action for a %s",
	async role => {
		const pinia = createPinia();
		setActivePinia(pinia);
		const app = useAppStore();
		app.setCurrentUser({
			_id: "shared-intro-learner",
			name: "Learner",
			email: "learner@example.invalid",
			age: 14,
			state: "GA",
			courseAccess: [secondCourse],
			courseProgress: [],
			editUsers: false,
			saveEdit: "Save"
		});
		if (role === "instructor") {
			app.setCurrentTutor({
				_id: "shared-intro-tutor",
				name: "Tutor",
				email: "tutor@example.invalid",
				age: 30,
				state: "GA",
				coursePermissions: [secondCourse],
				usersOfTutorLength: 0,
				editTutors: false,
				saveEdit: "Save"
			});
			app.setUsers([app.currentUser!]);
			vi.mocked(api.get).mockResolvedValue({ data: [app.currentUser!] });
		}
		const course = (await useCoursesStore().loadCourseById(secondCourse))!;
		const module = course.modules.find(
			row => row.title === "JSM1 Fundamentals Review"
		)!;
		const item = module.curriculum.find(
			row => row.title === "Introductions & Setup"
		)!;
		window.history.replaceState({}, "", `/courses#${module.id}`);
		const wrapper = mount(CourseExplorer, { global: { plugins: [pinia] } });
		try {
			await flushPromises();
			await vi.waitFor(() =>
				expect(wrapper.find(".lesson-view-toggle").exists()).toBe(true)
			);
			const findCard = () =>
				wrapper
					.findAll(".lesson-item")
					.find(row =>
						row.find(`a.is-project[href="${sourceUrl}"]`).exists()
					);
			for (const label of ["Learn", "Projects"]) {
				if (findCard()) break;
				await wrapper
					.findAll(".lesson-view-toggle button")
					.find(button => button.text() === label)!
					.trigger("click");
				await flushPromises();
			}
			const card = findCard();
			expect(card).toBeDefined();
			const link = card!.find("a.is-ide-starter");
			expect(link.exists()).toBe(true);
			const params = new URL(
				link.attributes("href"),
				"https://example.invalid"
			).searchParams;
			expect(params.get("course")).toBe(secondCourse);
			expect(params.get("mode")).toBe("web");
			expect(params.get("starterUrl")).toBe(sourceUrl);
			expect(params.get("projectKey")).toBe(
				`${secondCourse}:${item.id}:starter:introduction:v1`
			);
		} finally {
			wrapper.unmount();
		}
	}
);
