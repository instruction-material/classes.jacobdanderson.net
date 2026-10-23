import type { PythonIdeProject } from "@/modules/pythonIde";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const legacy = vi.hoisted(() => ({ copies: [] as PythonIdeProject[][] }));
vi.mock("@/modules/pythonIde", () => ({
	loadLegacyLocalPythonProjectCopiesAsync: vi.fn(async () => legacy.copies)
}));

function project(id: string, content: string): PythonIdeProject {
	return {
		_id: id,
		title: id,
		mode: "python",
		activeFileName: "main.py",
		files: [{ name: "main.py", content }]
	};
}

function fakeIndexedDB() {
	const records = new Map<string, unknown>();
	let storeExists = false;
	const database = {
		onversionchange: null as (() => void) | null,
		close: vi.fn(),
		objectStoreNames: { contains: () => storeExists },
		createObjectStore: () => { storeExists = true; },
		transaction: (_name: string, _mode: string) => {
			let pending = 0;
			let completed = false;
			const transaction = {
				oncomplete: null as (() => void) | null,
				onerror: null as (() => void) | null,
				onabort: null as (() => void) | null,
				error: null,
				objectStore: () => ({
					get: (key: string) => request(() => structuredClone(records.get(key))),
					put: (record: { key: string }) => request(() => {
					records.set(record.key, structuredClone(record));
					return record.key;
					})
				})
			};
			function request<Result>(action: () => Result) {
				pending += 1;
				const item = {
					result: undefined as Result | undefined,
					error: null,
					onsuccess: null as (() => void) | null,
					onerror: null as (() => void) | null
				};
				queueMicrotask(() => {
					item.result = action();
					pending -= 1;
					item.onsuccess?.();
					setTimeout(() => {
						if (!completed && pending === 0) {
							completed = true;
							transaction.oncomplete?.();
						}
					}, 0);
				});
				return item;
			}
			return transaction;
		}
	};
	return {
		open: () => {
			const item = {
				result: database,
				error: null,
				onupgradeneeded: null as (() => void) | null,
				onsuccess: null as (() => void) | null,
				onerror: null as (() => void) | null,
				onblocked: null as (() => void) | null
			};
			queueMicrotask(() => {
				if (!storeExists) item.onupgradeneeded?.();
				item.onsuccess?.();
			});
			return item;
		}
	};
}

async function recoveryModule() {
	return import("@/modules/pythonIdeRecovery");
}

beforeEach(() => {
	legacy.copies = [];
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
	vi.resetModules();
	Object.defineProperty(window, "indexedDB", {
		configurable: true,
		value: fakeIndexedDB()
	});
});

afterEach(() => {
	vi.restoreAllMocks();
});

describe("Code IDE recovery drafts", () => {
	it("keeps another project's draft when one save is acknowledged", async () => {
		const recovery = await recoveryModule();
		const first = await recovery.savePythonIdeRecoveryDraft(project("one", "first"), "alice");
		await recovery.savePythonIdeRecoveryDraft(project("two", "second"), "alice");
		await recovery.acknowledgePythonIdeRecoveryDraft(first, "alice");
		const drafts = await recovery.loadPythonIdeRecoveryDrafts("alice");
		expect(drafts.map(draft => draft.project._id)).toEqual(["two"]);
		expect(await recovery.loadPythonIdeRecoveryDrafts("bob")).toEqual([]);
	});

	it("migrates each legacy project once and retains unsaved siblings", async () => {
		legacy.copies = [[project("one", "first"), project("two", "second")]];
		const recovery = await recoveryModule();
		const drafts = await recovery.loadPythonIdeRecoveryDrafts("alice");
		expect(drafts.map(draft => draft.project._id)).toEqual(["one", "two"]);
		expect(await recovery.acknowledgePythonIdeRecoveryDraft(drafts[0], "alice")).toBe(true);
		expect((await recovery.loadPythonIdeRecoveryDrafts("alice")).map(draft => draft.project._id)).toEqual(["two"]);
		expect((await recovery.loadPythonIdeRecoveryDrafts("bob")).map(draft => draft.project._id)).toEqual(["one", "two"]);
	});

	it("does not acknowledge a newer edit after an older save completes", async () => {
		const recovery = await recoveryModule();
		const oldDraft = await recovery.savePythonIdeRecoveryDraft(project("one", "old"), "alice");
		await recovery.savePythonIdeRecoveryDraft(project("one", "new"), "alice");
		await recovery.acknowledgePythonIdeRecoveryDraft(oldDraft, "alice");
		const drafts = await recovery.loadPythonIdeRecoveryDrafts("alice");
		expect(drafts).toHaveLength(1);
		expect(drafts[0].project.files[0].content).toBe("new");
	});

	it("keeps only the latest mirrored generation during repeated offline edits", async () => {
		const recovery = await recoveryModule();
		for (let index = 0; index < 8; index += 1) {
			await recovery.savePythonIdeRecoveryDraft(project("one", `edit ${index}`), "alice");
		}
		expect(window.localStorage.length).toBe(1);
		expect((await recovery.loadPythonIdeRecoveryDrafts("alice"))[0].project.files[0].content).toBe("edit 7");
	});

	it("keeps separate tab drafts for the same remote project", async () => {
		const firstTab = await recoveryModule();
		await firstTab.savePythonIdeRecoveryDraft(project("shared", "tab one"), "alice");
		vi.resetModules();
		const secondTab = await recoveryModule();
		const secondDraft = await secondTab.savePythonIdeRecoveryDraft(project("shared", "tab two"), "alice");
		await secondTab.acknowledgePythonIdeRecoveryDraft(secondDraft, "alice");
		const drafts = await secondTab.loadPythonIdeRecoveryDrafts("alice");
		expect(drafts.map(draft => draft.project.files[0].content)).toEqual(["tab one"]);
	});

	it("recovers from IndexedDB when the localStorage mirror is full", async () => {
		const recovery = await recoveryModule();
		vi.spyOn(window.localStorage, "setItem").mockImplementation(() => {
			throw new DOMException("Synthetic full mirror", "QuotaExceededError");
		});
		await recovery.savePythonIdeRecoveryDraft(project("one", "retained"), "alice");
		const drafts = await recovery.loadPythonIdeRecoveryDrafts("alice");
		expect(drafts[0]?.project.files[0].content).toBe("retained");
		expect(await recovery.loadPythonIdeRecoveryDrafts("bob")).toEqual([]);
	});
});
