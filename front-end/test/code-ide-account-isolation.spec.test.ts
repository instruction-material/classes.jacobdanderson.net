import type { VueWrapper } from "@vue/test-utils";
import type { PythonIdeProject } from "@/modules/pythonIde";
import { flushPromises, mount } from "@vue/test-utils";
import { createPinia } from "pinia";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { nextTick } from "vue";
import { createMemoryHistory, createRouter } from "vue-router";
import AccountCodeIdeWorkspace from "@/components/AccountCodeIdeWorkspace.vue";
import CodeIdeWorkspace from "@/components/CodeIdeWorkspace.vue";
import { codeIdeAccountRequest } from "@/modules/codeIdeAccountScope";
import {
	clearLocalPythonProjects,
	clearLocalPythonProjectsAsync,
	createRemotePythonIdeProject,
	deleteRemotePythonIdeProject,
	fetchPythonIdeProject,
	fetchPythonIdeProjects,
	fetchVisiblePythonIdeProjectReview,
	fetchVisiblePythonIdeProjectReviews,
	loadLocalPythonProjects,
	loadLocalPythonProjectsAsync,
	saveLocalPythonProjects,
	saveLocalPythonProjectsAsync,
	updateRemotePythonIdeProject,
	updateRemotePythonIdeProjectShare
} from "@/modules/pythonIde";
import {
	loadPythonIdeRecoveryDrafts,
	savePythonIdeRecoveryDraft
} from "@/modules/pythonIdeRecovery";
import { useAppStore } from "@/stores/app";

const requests = vi.hoisted(() => ({
	get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn()
}));
vi.mock("@/api", () => ({ api: requests }));

function project(owner: string): PythonIdeProject {
	return {
		_id: `local-${owner}`,
		title: `${owner} private project`,
		mode: "python",
		activeFileName: "main.py",
		files: [{ name: "main.py", content: `${owner} private work` }]
	};
}
function deferred<Result>() {
	let resolve!: (value: Result) => void;
	const promise = new Promise<Result>(finish => { resolve = finish; });
	return { promise, resolve };
}
const wrappers: VueWrapper[] = [];
let storageDescriptor: PropertyDescriptor | undefined;

beforeEach(() => {
	vi.clearAllMocks();
	storageDescriptor = Object.getOwnPropertyDescriptor(window, "localStorage");
	const values = new Map<string, string>();
	Object.defineProperty(window, "localStorage", {
		configurable: true,
		value: {
			get length() { return values.size; },
			key: (index: number) => [...values.keys()][index] ?? null,
			getItem: (key: string) => values.get(key) ?? null,
			setItem: (key: string, value: string) => values.set(key, value),
			removeItem: (key: string) => values.delete(key)
		}
	});
	vi.stubGlobal("ResizeObserver", class { observe() {} disconnect() {} });
	vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(null);
	requests.get.mockReturnValue(new Promise(() => {}));
	requests.post.mockRejectedValue(new Error("Synthetic offline fixture"));
});
afterEach(async () => {
	wrappers.splice(0).forEach(wrapper => wrapper.unmount());
	await flushPromises();
	vi.useRealTimers();
	vi.restoreAllMocks();
	vi.unstubAllGlobals();
	if (storageDescriptor) Object.defineProperty(window, "localStorage", storageDescriptor);
});

async function workspace() {
	const pinia = createPinia();
	const app = useAppStore(pinia);
	app.$patch({ currentUser: { _id: "alice" } });
	const router = createRouter({
		history: createMemoryHistory(),
		routes: [{ path: "/ide", component: { template: "<div/>" } }]
	});
	await router.push("/ide?mode=python");
	const wrapper = mount(AccountCodeIdeWorkspace, { global: { plugins: [pinia, router] } });
	wrappers.push(wrapper);
	return { wrapper, app };
}

interface WorkspaceState {
	isRunning: boolean;
	autoSaveEnabled: boolean;
	projects: PythonIdeProject[];
	selectedProjectID: string;
	suppressAutoSave: boolean;
	scheduleSave: () => void;
	saveSelectedProject: (options: { force: boolean }) => Promise<void>;
	persistLocalProjectSnapshot: () => Promise<void>;
	runCurrentProject: () => Promise<void>;
}
function state(wrapper: VueWrapper) {
	return wrapper.findComponent(CodeIdeWorkspace).vm.$.setupState as WorkspaceState;
}

describe("account-bound workspace lifetime", () => {
	it("terminates Java execution when its owning account is revoked", async () => {
		const terminated = vi.fn();
		let worker: { onmessage: ((event: MessageEvent) => void) | null } | undefined;
		vi.stubGlobal("Worker", class {
			onmessage: ((event: MessageEvent) => void) | null = null;
			terminate = terminated;
			postMessage = vi.fn();
			constructor() { worker = this; }
		});
		const { wrapper, app } = await workspace();
		const current = state(wrapper);
		current.projects = [{ ...project("alice"), mode: "java", activeFileName: "Main.java", files: [{ name: "Main.java", content: "class Main {}" }] }];
		current.selectedProjectID = "local-alice";
		current.autoSaveEnabled = false;
		await nextTick();
		const running = current.runCurrentProject();
		await flushPromises();
		expect(worker).toBeDefined();
		const staleResult = worker!.onmessage;
		app.$patch({ currentUser: { _id: "bob" } });
		await nextTick();
		expect(terminated).toHaveBeenCalledOnce();
		staleResult?.({ data: { stdout: ["alice private result"], stderr: [] } } as MessageEvent);
		await running;
		expect(wrapper.text()).not.toContain("alice private result");
	});
	it("forwards the editor switch stop control to the active workspace", async () => {
		const { wrapper } = await workspace();
		state(wrapper).isRunning = true;
		(wrapper.vm.$.exposed as { stop: () => void }).stop();
		expect(state(wrapper).isRunning).toBe(false);
	});
	it("retains manual saving while autosave is disabled", async () => {
		const { wrapper } = await workspace();
		const current = state(wrapper);
		current.projects = [project("alice")];
		current.selectedProjectID = "local-alice";
		current.suppressAutoSave = false;
		current.autoSaveEnabled = false;
		current.scheduleSave();
		await flushPromises();
		expect(requests.post).not.toHaveBeenCalled();
		expect(loadLocalPythonProjects("alice")).toEqual([]);
		requests.post.mockResolvedValue({ data: { project: { ...project("alice"), _id: "remote-alice" } } });
		await current.saveSelectedProject({ force: true });
		expect(requests.post).toHaveBeenCalledOnce();
		expect(requests.post.mock.calls[0][2].headers).toEqual({ "X-Code-IDE-Owner": "alice" });
		expect(current.projects[0]._id).toBe("remote-alice");
	});
	it("does not let revoked callbacks overwrite a later session for the same owner", async () => {
		const { wrapper, app } = await workspace();
		const previous = state(wrapper);
		previous.projects = [project("old")];
		app.$patch({ currentUser: null });
		app.$patch({ currentUser: { _id: "alice" } });
		await nextTick();
		await saveLocalPythonProjectsAsync([project("latest")], "alice");
		await previous.persistLocalProjectSnapshot();
		expect((await loadLocalPythonProjectsAsync("alice"))[0].title).toBe("latest private project");
	});
	it.each(["bob", null])("preserves delayed edits under Alice when switching to %s", async owner => {
		const { wrapper, app } = await workspace();
		const original = wrapper.findComponent(CodeIdeWorkspace).vm;
		const previous = state(wrapper);
		previous.projects = [project("alice")];
		previous.selectedProjectID = "local-alice";
		previous.suppressAutoSave = false;
		vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout"] });
		previous.scheduleSave();
		app.$patch({ currentUser: owner ? { _id: owner } : null });
		await nextTick();
		expect(wrapper.findComponent(CodeIdeWorkspace).vm === original).toBe(false);
		await vi.advanceTimersByTimeAsync(1000);
		await previous.persistLocalProjectSnapshot();
		expect((await loadPythonIdeRecoveryDrafts("alice"))[0]?.project.files[0].content).toBe("alice private work");
		if (owner) expect(JSON.stringify(await loadPythonIdeRecoveryDrafts(owner))).not.toContain("alice private");
		expect(state(wrapper).projects.some(item => item.title.includes("alice"))).toBe(false);
		expect(requests.post).not.toHaveBeenCalled();
	});
	it("revokes a previous lifetime even when the same account returns before render", async () => {
		const { wrapper, app } = await workspace();
		const original = wrapper.findComponent(CodeIdeWorkspace).vm;
		const previousSignal = requests.get.mock.calls[0][1].signal as AbortSignal;
		app.$patch({ currentUser: null });
		app.$patch({ currentUser: { _id: "alice" } });
		expect(previousSignal.aborted).toBe(true);
		await nextTick();
		expect(wrapper.findComponent(CodeIdeWorkspace).vm === original).toBe(false);
		expect(requests.get.mock.calls.at(-1)?.[1].signal.aborted).toBe(false);
	});
	it("does not continue a project save after an account switch", async () => {
		const { wrapper, app } = await workspace();
		const current = state(wrapper);
		current.projects = [project("alice"), project("alice-second")];
		current.selectedProjectID = "local-alice";
		current.suppressAutoSave = false;
		const first = deferred<{ data: { project: PythonIdeProject } }>();
		requests.post.mockReturnValueOnce(first.promise);
		const saving = current.saveSelectedProject({ force: true });
		await flushPromises();
		expect(requests.post).toHaveBeenCalledTimes(1);
		app.$patch({ currentUser: { _id: "bob" } });
		await nextTick();
		first.resolve({ data: { project: project("alice") } });
		await saving;
		expect(requests.post).toHaveBeenCalledTimes(1);
		expect(requests.post.mock.calls[0][2].headers).toEqual({ "X-Code-IDE-Owner": "alice" });
	});
	it("opens unsynced account work as separate copies without overwriting remote projects", async () => {
		await savePythonIdeRecoveryDraft({ ...project("first"), _id: "remote-first", revision: 0 }, "alice");
		await savePythonIdeRecoveryDraft({ ...project("second"), _id: "remote-second", revision: 0 }, "alice");
		requests.get.mockImplementation(async (path: string) => {
			if (path === "/users/loggedin/python-projects") {
				return { data: { projects: [
					{ ...project("first"), _id: "remote-first", revision: 1 },
					{ ...project("second"), _id: "remote-second", revision: 1 }
				], nextOffset: null } };
			}
			if (path === "/users/loggedin/python-project-reviews") {
				return { data: { reviews: [], nextOffset: null } };
			}
			throw new Error(`Unexpected request: ${path}`);
		});
		const { wrapper } = await workspace();
		await flushPromises();
		const current = state(wrapper);
		expect(current.projects).toHaveLength(2);
		expect(current.projects.every(candidate => candidate._id.startsWith("local-recovery-"))).toBe(true);
		expect(requests.put).not.toHaveBeenCalled();
		expect(requests.post).not.toHaveBeenCalled();
	});
});

describe("owner-bound persistence and requests", () => {
	it("preserves legacy IndexedDB snapshots through delayed writes", async () => {
		const gate = deferred<void>();
		const started = deferred<void>();
		const records = new Map<string, { key: string; projects: PythonIdeProject[] }>();
		let firstWrite = true;
		const database = {
			close: () => {},
			onversionchange: undefined as (() => void) | undefined,
			transaction: () => {
				const transaction: { oncomplete?: () => void; objectStore?: () => unknown } = {};
				function request(action: () => unknown | Promise<unknown>) {
					const result: { result?: unknown; onsuccess?: () => void } = {};
					queueMicrotask(async () => {
						result.result = await action();
						result.onsuccess?.();
						setTimeout(() => transaction.oncomplete?.(), 0);
					});
					return result;
				}
				transaction.objectStore = () => ({
					put: (record: { key: string; projects: PythonIdeProject[] }) => request(async () => {
						if (firstWrite) {
							firstWrite = false;
							started.resolve();
							await gate.promise;
						}
						records.set(record.key, structuredClone(record));
					}),
					get: (key: string) => request(() => structuredClone(records.get(key))),
					delete: (key: string) => request(() => records.delete(key))
				});
				return transaction;
			}
		};
		vi.stubGlobal("indexedDB", { open: () => {
			const result: { result: unknown; onsuccess?: () => void } = { result: database };
			queueMicrotask(() => result.onsuccess?.());
			return result;
		} });
		vi.resetModules();
		const storage = await import("@/modules/pythonIde");
		const oldSave = storage.saveLocalPythonProjectsAsync([project("old")], "alice");
		await started.promise;
		storage.saveLocalPythonProjects([project("latest")], "alice");
		const reading = storage.loadLocalPythonProjectsAsync("alice");
		gate.resolve();
		await oldSave;
		expect(storage.loadLocalPythonProjects("alice")[0].title).toBe("latest private project");
		expect((await reading)[0].title).toBe("latest private project");
		expect([...records.values()][0].projects[0].title).toBe("latest private project");
		await storage.clearLocalPythonProjectsAsync("alice");
		expect(records.size).toBe(0);
		expect(storage.loadLocalPythonProjects("alice")).toEqual([]);
		database.onversionchange?.();
	});
	it("does not resurrect a synchronous clear after queued storage completes", async () => {
		saveLocalPythonProjects([project("alice")], "alice");
		clearLocalPythonProjects("alice");
		expect(await loadLocalPythonProjectsAsync("alice")).toEqual([]);
		expect(loadLocalPythonProjects("alice")).toEqual([]);
	});
	it("preserves a newer synchronous unload snapshot over a queued asynchronous write", async () => {
		const oldSave = saveLocalPythonProjectsAsync([project("old")], "alice");
		saveLocalPythonProjects([project("latest")], "alice");
		await oldSave;
		expect(loadLocalPythonProjects("alice")[0].title).toBe("latest private project");
		expect((await loadLocalPythonProjectsAsync("alice"))[0].title).toBe("latest private project");
	});
	it("detaches asynchronous data and serializes same-owner writes before reads", async () => {
		const snapshot = [project("alice")];
		const saving = saveLocalPythonProjectsAsync(snapshot, "alice");
		snapshot[0].files[0].content = "later edit";
		const reading = loadLocalPythonProjectsAsync("alice");
		await saving;
		expect((await reading)[0].files[0].content).toBe("alice private work");
		await saveLocalPythonProjectsAsync(snapshot, "alice");
		expect((await loadLocalPythonProjectsAsync("alice"))[0].files[0].content).toBe("later edit");
		expect(loadLocalPythonProjects("bob")).toEqual([]);
	});
	it("does not let a revoked lifetime clear same-owner recovery", async () => {
		const controller = new AbortController();
		const saving = saveLocalPythonProjectsAsync([project("alice")], "alice");
		const clearing = clearLocalPythonProjectsAsync("alice", controller.signal);
		controller.abort();
		await Promise.all([saving, clearing]);
		expect(loadLocalPythonProjects("alice")).toHaveLength(1);
		await clearLocalPythonProjectsAsync("alice");
		expect(loadLocalPythonProjects("alice")).toEqual([]);
	});
	it("combines detail cancellation with account cancellation without changing the owner", () => {
		const account = new AbortController();
		const detail = new AbortController();
		const config = codeIdeAccountRequest({ ownerKey: "tutor:alice", signal: account.signal }, detail.signal);
		expect(config.headers).toEqual({ "X-Code-IDE-Owner": "tutor:alice" });
		detail.abort();
		expect(config.signal?.aborted).toBe(true);
		expect(account.signal.aborted).toBe(false);
		account.abort();
		expect(() => codeIdeAccountRequest({ ownerKey: "alice", signal: account.signal })).toThrow();
		expect(() => codeIdeAccountRequest({ ownerKey: null, signal: new AbortController().signal })).toThrow("Sign in");
	});
	it("binds every own-workspace request and prevents dispatch after revocation", async () => {
		const controller = new AbortController();
		const scope = { ownerKey: "alice", signal: controller.signal };
		requests.get.mockResolvedValue({ data: { projects: [], reviews: [], nextOffset: null } });
		requests.post.mockResolvedValue({ data: { project: project("alice") } });
		requests.put.mockResolvedValue({ data: { project: project("alice") } });
		const operations = [
			() => fetchPythonIdeProjects(scope),
			() => fetchPythonIdeProject("project", undefined, scope),
			() => fetchVisiblePythonIdeProjectReviews(scope),
			() => fetchVisiblePythonIdeProjectReview("review", undefined, scope),
			() => createRemotePythonIdeProject({ title: "Synthetic" }, scope),
			() => updateRemotePythonIdeProject("project", { title: "Synthetic" }, scope),
			() => updateRemotePythonIdeProjectShare("project", false, scope),
			() => deleteRemotePythonIdeProject("project", scope)
		];
		for (const operation of operations) await operation();
		for (const request of Object.values(requests)) {
			for (const call of request.mock.calls) {
				const config = call.at(-1);
				expect(config.headers).toEqual({ "X-Code-IDE-Owner": "alice" });
				expect(config.signal).toBe(controller.signal);
			}
		}
		vi.clearAllMocks();
		controller.abort();
		for (const operation of operations) await expect(operation()).rejects.toBeDefined();
		for (const request of Object.values(requests)) expect(request).not.toHaveBeenCalled();
	});
});
