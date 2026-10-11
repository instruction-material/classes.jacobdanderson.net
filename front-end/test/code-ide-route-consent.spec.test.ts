import type { VueWrapper } from "@vue/test-utils";
import type { PythonIdeProject } from "@/modules/pythonIde";
import { flushPromises, mount } from "@vue/test-utils";
import { createPinia } from "pinia";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { nextTick } from "vue";
import { createMemoryHistory, createRouter } from "vue-router";
import AccountCodeIdeWorkspace from "@/components/AccountCodeIdeWorkspace.vue";
import CodeIdeWorkspace from "@/components/CodeIdeWorkspace.vue";
import { loadLocalPythonProjects } from "@/modules/pythonIde";
import { useAppStore } from "@/stores/app";
import { classroomReferenceItem } from "@/stores/courses/classroomReferenceGuides";
import { courseReferenceExamples } from "@/modules/courseReferenceExamples";

const requests = vi.hoisted(() => ({
	get: vi.fn(),
	post: vi.fn(),
	put: vi.fn(),
	delete: vi.fn()
}));
const preview = vi.hoisted(() => ({
	list: vi.fn(),
	load: vi.fn()
}));
vi.mock("@/api", () => ({ api: requests }));
vi.mock("@/modules/codePreview", async importOriginal => ({
	...(await importOriginal<typeof import("@/modules/codePreview")>()),
	listGitHubProjectFiles: preview.list,
	loadGitHubProjectFile: preview.load
}));

const existingProject: PythonIdeProject = {
	_id: "existing-project",
	activeFileName: "main.py",
	files: [{ name: "main.py", content: "print('existing')" }],
	mode: "python",
	title: "Existing project"
};
const wrappers: VueWrapper[] = [];
let storageDescriptor: PropertyDescriptor | undefined;
let rangeRectsDescriptor: PropertyDescriptor | undefined;

function workspaceState(wrapper: VueWrapper) {
	return wrapper.findComponent(CodeIdeWorkspace).vm.$.setupState as {
		projects: PythonIdeProject[];
		scheduleSave: () => void;
		selectedProjectID: string;
	};
}

async function settle() {
	await flushPromises();
	await nextTick();
	await flushPromises();
}

async function openWorkspace(url: string, signedIn = true) {
	const pinia = createPinia();
	const app = useAppStore(pinia);
	if (signedIn) app.$patch({ currentUser: { _id: "alice" } });
	const router = createRouter({
		history: createMemoryHistory(),
		routes: [{ path: "/ide", component: { template: "<div/>" } }]
	});
	await router.push(url);
	const wrapper = mount(AccountCodeIdeWorkspace, {
		global: { plugins: [pinia, router] }
	});
	wrappers.push(wrapper);
	await settle();
	return { router, wrapper };
}

beforeEach(() => {
	vi.clearAllMocks();
	storageDescriptor = Object.getOwnPropertyDescriptor(window, "localStorage");
	const values = new Map<string, string>();
	Object.defineProperty(window, "localStorage", {
		configurable: true,
		value: {
			getItem: (key: string) => values.get(key) ?? null,
			setItem: (key: string, value: string) => values.set(key, value),
			removeItem: (key: string) => values.delete(key)
		}
	});
	vi.stubGlobal(
		"ResizeObserver",
		class {
			observe() {}
			disconnect() {}
		}
	);
	rangeRectsDescriptor = Object.getOwnPropertyDescriptor(
		Range.prototype,
		"getClientRects"
	);
	Object.defineProperty(Range.prototype, "getClientRects", {
		configurable: true,
		value: () => []
	});
	vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(null);
	requests.get.mockImplementation(async (path: string) => {
		if (path === "/users/loggedin/python-projects") {
			return { data: { nextOffset: null, projects: [existingProject] } };
		}
		if (path === "/users/loggedin/python-project-reviews") {
			return { data: { nextOffset: null, reviews: [] } };
		}
		if (path === "/users/loggedin/python-projects/existing-project") {
			return { data: { project: existingProject } };
		}
		if (path.startsWith("/users/python-projects/shared/")) {
			return { data: { project: existingProject } };
		}
		throw new Error(`Unexpected request: ${path}`);
	});
	let createdProjects = 0;
	requests.post.mockImplementation(
		async (_path: string, payload: PythonIdeProject) => ({
			data: {
				project: {
					...payload,
					_id: `imported-project-${++createdProjects}`
				}
			}
		})
	);
	preview.list.mockResolvedValue([{ path: "main.py" }]);
	preview.load.mockResolvedValue({ content: "print('imported')" });
});

afterEach(async () => {
	wrappers.splice(0).forEach(wrapper => wrapper.unmount());
	await flushPromises();
	vi.restoreAllMocks();
	vi.unstubAllGlobals();
	if (storageDescriptor)
		Object.defineProperty(window, "localStorage", storageDescriptor);
	if (rangeRectsDescriptor)
		Object.defineProperty(
			Range.prototype,
			"getClientRects",
			rangeRectsDescriptor
		);
	else Reflect.deleteProperty(Range.prototype, "getClientRects");
});

describe("Code IDE route import consent", () => {
	it("labels metadata-only saved rows and selects the matching full project", async () => {
		const saved: PythonIdeProject[] = [
			{
				...existingProject,
				_id: "saved-learner",
				title: "Same project name",
				mode: "cpp",
				courseID: "cpp-level-2",
				courseProjectKey: "cpp-level-2:grocery:starter"
			},
			{
				...existingProject,
				_id: "saved-reference",
				title: "Same project name",
				mode: "java",
				courseID: "usaco-silver",
				courseProjectKey: "usaco-silver:gifts:reference:native-java"
			}
		];
		requests.get.mockImplementation(async (path: string) => {
			if (path === "/users/loggedin/python-projects") {
				return {
					data: {
						nextOffset: null,
						projects: saved.map(
							({ files: _files, ...metadata }) => metadata
						)
					}
				};
			}
			if (path === "/users/loggedin/python-project-reviews")
				return { data: { nextOffset: null, reviews: [] } };
			const project = saved.find(item => path.endsWith(`/${item._id}`));
			if (project) return { data: { project } };
			throw new Error(`Unexpected request: ${path}`);
		});
		const { wrapper } = await openWorkspace("/ide");
		await wrapper
			.get("button[aria-label='Expand project sidebar']")
			.trigger("click");
		await settle();
		const rows = wrapper.findAll(".project-button");
		expect(rows.map(row => row.find("span").text())).toEqual([
			"Same project name",
			"Same project name"
		]);
		expect(rows.map(row => row.find("small").text())).toEqual([
			"Learner · C++",
			"Reference · Java"
		]);
		expect(rows[1].attributes("aria-label")).toBe(
			"Same project name (Reference · Java)"
		);
		await rows[1].trigger("click");
		await settle();
		expect(workspaceState(wrapper).selectedProjectID).toBe(
			"saved-reference"
		);
		expect(preview.list).not.toHaveBeenCalled();
		expect(requests.post).not.toHaveBeenCalled();
	});

	it("renders bounded WAV handoffs as safe downloads and clears them with the run", async () => {
		const { wrapper } = await openWorkspace("/ide");
		await wrapper.find("button.run-control").trigger("click");
		await settle();
		const frame = wrapper.find("iframe[title='Isolated Python output']")
			.element as HTMLIFrameElement;
		const channel = /data-channel="([^"]+)"/.exec(frame.srcdoc)![1];
		const send = (message: Record<string, unknown>) =>
			window.dispatchEvent(
				new MessageEvent("message", {
					origin: "null",
					source: frame.contentWindow,
					data: { channel, ...message }
				})
			);
		const data =
			"UklGRiYAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQIAAABhYQ==";
		send({ type: "ready" });
		send({ type: "audio", title: "unsafe-name.html", data });
		send({ type: "done" });
		await settle();
		const download = wrapper.find("a[download='unsafe-name.html.wav']");
		expect(download.text()).toBe("Download WAV");
		expect(download.attributes("href")).toBe(
			`data:audio/wav;base64,${data}`
		);
		expect(frame.getAttribute("sandbox")).toBe("allow-scripts");
		const clear = wrapper
			.findAll("button")
			.find(button => button.text() === "Clear output")!;
		await clear.trigger("click");
		await settle();
		expect(wrapper.find("a[download]").exists()).toBe(false);
		expect(
			wrapper.find("iframe[title='Isolated Python output']").exists()
		).toBe(false);
	});

	for (const kind of ["events", "melody", "records"] as const) {
		it(`imports the ${kind} reference only after confirmation and preserves prior work`, async () => {
			const item = classroomReferenceItem(kind);
			const { wrapper } = await openWorkspace(item.projectLink!);
			expect(requests.post).not.toHaveBeenCalled();
			expect(workspaceState(wrapper).selectedProjectID).toBe(
				existingProject._id
			);
			await wrapper
				.find("[data-testid='ide-route-import-confirm']")
				.trigger("click");
			await settle();
			expect(requests.post).toHaveBeenCalledTimes(1);
			const imported = requests.post.mock.calls[0][1];
			const params = new URL(item.projectLink!, "https://classes.local")
				.searchParams;
			const template = params.get(
				"template"
			) as keyof typeof courseReferenceExamples;
			expect(imported.files).toEqual(courseReferenceExamples[template]);
			expect(imported.courseProjectKey).toBe(params.get("projectKey"));
			expect(preview.list).not.toHaveBeenCalled();
			expect(
				workspaceState(wrapper).projects.find(
					project => project._id === existingProject._id
				)?.files
			).toEqual(existingProject.files);
		});
	}

	it("explains a failed import even when an empty account has no console", async () => {
		requests.get.mockImplementation(async () => ({
			data: { nextOffset: null, projects: [], reviews: [] }
		}));
		preview.list.mockRejectedValue(new Error("GitHub returned 404."));
		const { wrapper } = await openWorkspace(
			"/ide?projectKey=missing:starter&starterUrl=https%3A%2F%2Fgithub.com%2Fexample%2Fcourse%2Ftree%2Fmain%2Fstarter"
		);
		await wrapper
			.find("[data-testid='ide-route-import-confirm']")
			.trigger("click");
		await settle();
		expect(requests.post).not.toHaveBeenCalled();
		expect(wrapper.find(".code-ide-workspace").exists()).toBe(false);
		expect(
			wrapper.find("input[type='file']").attributes("aria-label")
		).toBe("Import a BlueJ project ZIP");
		expect(wrapper.find("[role='alert']").text()).toContain(
			"GitHub returned 404."
		);
		expect(wrapper.text()).toContain("The import did not finish");
	});

	it("does not save a local demo when an anonymous linked import fails", async () => {
		preview.list.mockRejectedValue(new Error("GitHub returned 404."));
		const { wrapper } = await openWorkspace(
			"/ide?projectKey=missing:starter&starterUrl=https%3A%2F%2Fgithub.com%2Fexample%2Fcourse%2Ftree%2Fmain%2Fstarter",
			false
		);
		const projectsBefore = loadLocalPythonProjects(null);
		await wrapper
			.find("[data-testid='ide-route-import-confirm']")
			.trigger("click");
		await settle();
		expect(requests.post).not.toHaveBeenCalled();
		expect(loadLocalPythonProjects(null)).toEqual(projectsBefore);
		expect(
			wrapper.find("[data-testid='ide-route-import-error']").text()
		).toContain("The import did not finish");
	});

	it.each([
		"download failure",
		"readme only",
		"wrong language",
		"second file failure"
	])("does not create a demo after %s", async failure => {
		if (failure === "download failure")
			preview.list.mockRejectedValue(new Error("GitHub returned 404."));
		if (failure === "readme only")
			preview.list.mockResolvedValue([{ path: "starter/README.md" }]);
		if (failure === "wrong language")
			preview.list.mockResolvedValue([{ path: "starter/Main.java" }]);
		if (failure === "second file failure") {
			preview.list.mockResolvedValue([
				{ path: "starter/main.py" },
				{ path: "starter/helper.py" }
			]);
			preview.load
				.mockResolvedValueOnce({ content: "print('first')" })
				.mockRejectedValueOnce(new Error("Second file unavailable"));
		}
		const { wrapper } = await openWorkspace(
			"/ide?mode=python&projectKey=broken:starter&starterUrl=https%3A%2F%2Fgithub.com%2Fexample%2Fcourse%2Ftree%2Fmain%2Fstarter"
		);
		await wrapper
			.find("[data-testid='ide-route-import-confirm']")
			.trigger("click");
		await settle();
		expect(requests.post).not.toHaveBeenCalled();
		expect(workspaceState(wrapper).selectedProjectID).toBe(
			"existing-project"
		);
		expect(workspaceState(wrapper).projects[0].files).toEqual(
			existingProject.files
		);
		expect(
			wrapper.find("[data-testid='ide-route-import-prompt']").exists()
		).toBe(true);
		expect(wrapper.text()).toContain("Could not import project");
	});

	it("retries the requested starter after a transient failure without importing a demo", async () => {
		preview.list.mockRejectedValueOnce(new Error("GitHub returned 503."));
		const { wrapper } = await openWorkspace(
			"/ide?projectKey=retry:starter&starterUrl=https%3A%2F%2Fgithub.com%2Fexample%2Fcourse%2Ftree%2Fmain%2Fstarter"
		);
		await wrapper
			.find("[data-testid='ide-route-import-confirm']")
			.trigger("click");
		await settle();
		expect(requests.post).not.toHaveBeenCalled();
		await wrapper
			.find("[data-testid='ide-route-import-confirm']")
			.trigger("click");
		await settle();
		expect(requests.post).toHaveBeenCalledTimes(1);
		expect(requests.post.mock.calls[0][1].files).toEqual([
			{ name: "main.py", content: "print('imported')", encoding: "text" }
		]);
	});

	it("imports bridge Java source only after confirmation in Java mode", async () => {
		preview.list.mockResolvedValue([
			{ path: "PTJ5-Python-to-Java-Quiz-Game/starter/Main.java" }
		]);
		preview.load.mockResolvedValue({
			content:
				"public class Main { public static void main(String[] args) {} }"
		});
		const { wrapper } = await openWorkspace(
			"/ide?course=python-to-java-and-cpp-bridge&mode=java&projectKey=bridge:starter&starterUrl=https%3A%2F%2Fgithub.com%2Finstruction-material%2FPython-to-Java-and-CPP-Bridge%2Ftree%2Fmain%2FPTJ5-Python-to-Java-Quiz-Game%2Fstarter"
		);
		expect(preview.list).not.toHaveBeenCalled();
		await wrapper
			.find("[data-testid='ide-route-import-confirm']")
			.trigger("click");
		await settle();
		expect(requests.post).toHaveBeenCalledTimes(1);
		expect(requests.post.mock.calls[0][1]).toMatchObject({
			mode: "java",
			activeFileName: "Main.java",
			files: [
				{
					name: "Main.java",
					content:
						"public class Main { public static void main(String[] args) {} }"
				}
			]
		});
	});

	it("does not fetch or save a URL-supplied starter before explicit approval", async () => {
		const starterUrl =
			"https://github.com/attacker/example/tree/main/starter";
		const { wrapper } = await openWorkspace(
			`/ide?projectKey=attacker:starter&starterUrl=${encodeURIComponent(starterUrl)}&starterTitle=Course%20work`
		);

		expect(preview.list).not.toHaveBeenCalled();
		expect(requests.post).not.toHaveBeenCalled();
		expect(
			wrapper.find("[data-testid='ide-route-import-prompt']").exists()
		).toBe(true);
		await wrapper
			.find("[data-testid='ide-route-import-confirm']")
			.trigger("click");
		await settle();

		expect(preview.list).toHaveBeenCalledWith(starterUrl);
		expect(requests.post).toHaveBeenCalledTimes(1);
		expect(requests.post.mock.calls[0][1]).toMatchObject({
			courseProjectKey: "attacker:starter",
			files: [{ content: "print('imported')", name: "main.py" }]
		});
	});

	it("opens an existing route project without prompting or creating another", async () => {
		const existing = {
			...existingProject,
			courseProjectKey: "course:starter"
		};
		requests.get.mockImplementation(async (path: string) => {
			if (path === "/users/loggedin/python-projects")
				return { data: { nextOffset: null, projects: [existing] } };
			if (path === "/users/loggedin/python-project-reviews")
				return { data: { nextOffset: null, reviews: [] } };
			return { data: { project: existing } };
		});
		const { wrapper } = await openWorkspace(
			"/ide?projectKey=course:starter&starterUrl=https%3A%2F%2Fgithub.com%2Fattacker%2Fexample%2Ftree%2Fmain"
		);

		expect(
			wrapper.find("[data-testid='ide-route-import-prompt']").exists()
		).toBe(false);
		expect(preview.list).not.toHaveBeenCalled();
		expect(requests.post).not.toHaveBeenCalled();
	});

	it("does not copy a shared project before approval", async () => {
		const { wrapper } = await openWorkspace(
			"/ide?share=attacker-shared-project-12345"
		);

		expect(
			requests.get.mock.calls.some(([path]) =>
				String(path).startsWith("/users/python-projects/shared/")
			)
		).toBe(false);
		expect(requests.post).not.toHaveBeenCalled();
		await wrapper
			.find("[data-testid='ide-route-import-confirm']")
			.trigger("click");
		await settle();
		expect(requests.post).toHaveBeenCalledTimes(1);
	});

	it("does not fall through from a failed shared link to a second starter", async () => {
		requests.get.mockImplementation(async (path: string) => {
			if (path === "/users/loggedin/python-projects")
				return {
					data: { nextOffset: null, projects: [existingProject] }
				};
			if (path === "/users/loggedin/python-project-reviews")
				return { data: { nextOffset: null, reviews: [] } };
			if (path.startsWith("/users/python-projects/shared/"))
				throw new Error("Synthetic missing share");
			return { data: { project: existingProject } };
		});
		const { wrapper } = await openWorkspace(
			"/ide?share=attacker-shared-project-12345&projectKey=attacker:starter&starterUrl=https%3A%2F%2Fgithub.com%2Fattacker%2Fexample%2Ftree%2Fmain"
		);
		await wrapper
			.find("[data-testid='ide-route-import-confirm']")
			.trigger("click");
		await settle();

		expect(preview.list).not.toHaveBeenCalled();
		expect(requests.post).not.toHaveBeenCalled();
		expect(
			wrapper.find("[data-testid='ide-route-import-prompt']").exists()
		).toBe(true);
	});

	it("keeps anonymous local projects free of unapproved starter code", async () => {
		const { wrapper } = await openWorkspace(
			"/ide?projectKey=attacker:starter&starterUrl=https%3A%2F%2Fgithub.com%2Fattacker%2Fexample%2Ftree%2Fmain",
			false
		);

		expect(preview.list).not.toHaveBeenCalled();
		expect(requests.post).not.toHaveBeenCalled();
		expect(
			loadLocalPythonProjects(null).some(
				project => project.courseProjectKey === "attacker:starter"
			)
		).toBe(false);
		await wrapper
			.find("[data-testid='ide-route-import-confirm']")
			.trigger("click");
		await settle();
		expect(
			loadLocalPythonProjects(null).some(
				project => project.courseProjectKey === "attacker:starter"
			)
		).toBe(true);
	});

	it("creates only the approved linked project for an empty account", async () => {
		requests.get.mockImplementation(async (path: string) => {
			if (path === "/users/loggedin/python-projects")
				return { data: { nextOffset: null, projects: [] } };
			if (path === "/users/loggedin/python-project-reviews")
				return { data: { nextOffset: null, reviews: [] } };
			throw new Error(`Unexpected request: ${path}`);
		});
		const { wrapper } = await openWorkspace(
			"/ide?projectKey=attacker:starter&starterUrl=https%3A%2F%2Fgithub.com%2Fattacker%2Fexample%2Ftree%2Fmain"
		);

		expect(preview.list).not.toHaveBeenCalled();
		expect(requests.post).not.toHaveBeenCalled();
		expect(
			wrapper.find("[data-testid='ide-route-import-prompt']").exists()
		).toBe(true);
		expect(wrapper.find(".code-ide-workspace").exists()).toBe(false);
		await wrapper
			.find("[data-testid='ide-route-import-confirm']")
			.trigger("click");
		await settle();
		expect(requests.post).toHaveBeenCalledTimes(1);
		expect(requests.post.mock.calls[0][1].courseProjectKey).toBe(
			"attacker:starter"
		);
	});

	it("creates a blank project only after an empty account declines the link", async () => {
		requests.get.mockImplementation(async (path: string) => {
			if (path === "/users/loggedin/python-projects")
				return { data: { nextOffset: null, projects: [] } };
			if (path === "/users/loggedin/python-project-reviews")
				return { data: { nextOffset: null, reviews: [] } };
			throw new Error(`Unexpected request: ${path}`);
		});
		const { router, wrapper } = await openWorkspace(
			"/ide?projectKey=declined:starter&starterUrl=https%3A%2F%2Fgithub.com%2Fattacker%2Fexample%2Ftree%2Fmain"
		);

		expect(requests.post).not.toHaveBeenCalled();
		await wrapper
			.find("[data-testid='ide-route-import-prompt'] button:last-child")
			.trigger("click");
		await settle();
		expect(router.currentRoute.value.fullPath).toBe("/ide");
		expect(preview.list).not.toHaveBeenCalled();
		expect(requests.post).toHaveBeenCalledTimes(1);
		expect(requests.post.mock.calls[0][1].courseProjectKey).toBeUndefined();
		expect(requests.post.mock.calls[0][1].starterUrl).toBeUndefined();
	});

	it("saves pending edits before importing a new linked project", async () => {
		let finishSave!: (value: {
			data: { project: PythonIdeProject };
		}) => void;
		requests.put.mockImplementationOnce(
			() =>
				new Promise(resolve => {
					finishSave = value => resolve(value);
				})
		);
		requests.put.mockImplementation(
			async (_path: string, payload: PythonIdeProject) => ({
				data: { project: { ...existingProject, ...payload } }
			})
		);
		const starterUrl =
			"https://github.com/attacker/example/tree/main/starter";
		const { wrapper } = await openWorkspace(
			`/ide?projectKey=another:starter&starterUrl=${encodeURIComponent(starterUrl)}`
		);
		const current = workspaceState(wrapper);
		current.projects[0].files[0].content = "print('unsaved work')";
		current.projects[0].updatedAt = new Date().toISOString();
		current.scheduleSave();

		await wrapper
			.find("[data-testid='ide-route-import-confirm']")
			.trigger("click");
		await settle();
		expect(requests.put).toHaveBeenCalledTimes(1);
		expect(requests.put.mock.calls[0][1].files[0].content).toBe(
			"print('unsaved work')"
		);
		expect(preview.list).not.toHaveBeenCalled();
		expect(requests.post).not.toHaveBeenCalled();

		finishSave({
			data: {
				project: {
					...existingProject,
					files: [
						{ name: "main.py", content: "print('unsaved work')" }
					]
				}
			}
		});
		await settle();
		expect(preview.list).toHaveBeenCalledWith(starterUrl);
		expect(requests.post).toHaveBeenCalledTimes(1);
		expect(requests.put.mock.invocationCallOrder.at(-1)).toBeLessThan(
			requests.post.mock.invocationCallOrder[0]
		);
		expect(current.selectedProjectID).toBe("imported-project-1");
	});

	it("does not switch projects when the existing edit cannot sync", async () => {
		requests.put.mockRejectedValue(new Error("Synthetic save failure"));
		const { wrapper } = await openWorkspace(
			"/ide?projectKey=another:starter&starterUrl=https%3A%2F%2Fgithub.com%2Fattacker%2Fexample%2Ftree%2Fmain"
		);
		const current = workspaceState(wrapper);
		current.projects[0].files[0].content = "print('keep my work')";
		current.projects[0].updatedAt = new Date().toISOString();
		current.scheduleSave();

		await wrapper
			.find("[data-testid='ide-route-import-confirm']")
			.trigger("click");
		await settle();
		expect(requests.put).toHaveBeenCalled();
		expect(preview.list).not.toHaveBeenCalled();
		expect(requests.post).not.toHaveBeenCalled();
		expect(current.selectedProjectID).toBe("existing-project");
		expect(current.projects[0].files[0].content).toBe(
			"print('keep my work')"
		);
		expect(
			wrapper.find("[data-testid='ide-route-import-prompt']").exists()
		).toBe(true);
	});

	it("keeps route-requested built-in templates pending until approval", async () => {
		const { wrapper } = await openWorkspace(
			"/ide?template=demo&mode=python"
		);

		expect(requests.post).not.toHaveBeenCalled();
		expect(
			wrapper.find("[data-testid='ide-route-import-prompt']").exists()
		).toBe(true);
		await wrapper
			.find("[data-testid='ide-route-import-confirm']")
			.trigger("click");
		await settle();
		expect(requests.post).toHaveBeenCalledTimes(1);
		expect(requests.post.mock.calls[0][1].courseProjectKey).toBe(
			"ide-template:python:demo"
		);
	});

	it("lets the user decline an untrusted project without fetching or saving it", async () => {
		const { wrapper } = await openWorkspace(
			"/ide?projectKey=declined:starter&starterUrl=https%3A%2F%2Fgithub.com%2Fattacker%2Fexample%2Ftree%2Fmain"
		);
		await wrapper
			.find("[data-testid='ide-route-import-prompt'] button:last-child")
			.trigger("click");
		await settle();

		expect(
			wrapper.find("[data-testid='ide-route-import-prompt']").exists()
		).toBe(false);
		expect(preview.list).not.toHaveBeenCalled();
		expect(requests.post).not.toHaveBeenCalled();
	});

	it("drops an unapproved starter when the route changes", async () => {
		const { router, wrapper } = await openWorkspace(
			"/ide?projectKey=old:starter&starterUrl=https%3A%2F%2Fgithub.com%2Fold%2Frepo%2Ftree%2Fmain"
		);
		await router.push("/ide?projectKey=new:starter");
		await settle();
		await wrapper
			.find("[data-testid='ide-route-import-confirm']")
			.trigger("click");
		await settle();

		expect(preview.list).not.toHaveBeenCalled();
		expect(requests.post).toHaveBeenCalledTimes(1);
		expect(requests.post.mock.calls[0][1].courseProjectKey).toBe(
			"new:starter"
		);
	});
});
