import type { PythonIdeProject } from "@/modules/pythonIde";
import { loadLegacyLocalPythonProjectCopiesAsync } from "@/modules/pythonIde";

export interface PythonIdeRecoveryDraft {
	draftKey: string;
	generation: string;
	project: PythonIdeProject;
	sequence: number;
}

interface RecoveryRecord {
	key: string;
	drafts: PythonIdeRecoveryDraft[];
	legacySeen: string[];
}

const databaseName = "classes-python-ide-recovery";
const storeName = "ownerDrafts";
const mirrorPrefix = "classes-python-ide-recovery:";
const browserInstanceID =
	typeof crypto !== "undefined" && "randomUUID" in crypto
		? crypto.randomUUID()
		: `${Date.now()}-${Math.random().toString(36).slice(2)}`;
const ownerQueues = new Map<string, Promise<void>>();
let databasePromise: Promise<IDBDatabase> | null = null;
let sequence = 0;

function cloneProject(project: PythonIdeProject): PythonIdeProject {
	return {
		...project,
		files: project.files.map(file => ({ ...file }))
	};
}

function mirrorOwnerPrefix(owner: string) {
	return `${mirrorPrefix}${encodeURIComponent(owner)}:draft:`;
}

function mirrorKey(owner: string, draft: PythonIdeRecoveryDraft) {
	return `${mirrorOwnerPrefix(owner)}${encodeURIComponent(draft.generation)}`;
}

function isRecoveryDraft(value: unknown): value is PythonIdeRecoveryDraft {
	if (!value || typeof value !== "object") return false;
	const draft = value as Partial<PythonIdeRecoveryDraft>;
	return (
		typeof draft.draftKey === "string" &&
		typeof draft.generation === "string" &&
		Number.isSafeInteger(draft.sequence) &&
		!!draft.project &&
		typeof draft.project._id === "string" &&
		typeof draft.project.title === "string" &&
		typeof draft.project.mode === "string" &&
		Array.isArray(draft.project.files) &&
		draft.project.files.every(
			file =>
				file &&
				typeof file.name === "string" &&
				typeof file.content === "string"
		)
	);
}

function readMirrorEntries(owner: string) {
	if (typeof window === "undefined") return [];
	const entries: PythonIdeRecoveryDraft[] = [];
	try {
		const prefix = mirrorOwnerPrefix(owner);
		for (let index = 0; index < window.localStorage.length; index += 1) {
			const key = window.localStorage.key(index);
			if (!key?.startsWith(prefix)) continue;
			const raw = window.localStorage.getItem(key);
			if (!raw) continue;
			try {
				const parsed: unknown = JSON.parse(raw);
				if (isRecoveryDraft(parsed)) entries.push(parsed);
			} catch {
				continue;
			}
		}
	} catch {
		return entries;
	}
	return entries;
}

function writeMirror(owner: string, draft: PythonIdeRecoveryDraft) {
	if (typeof window === "undefined") return false;
	try {
		window.localStorage.setItem(
			mirrorKey(owner, draft),
			JSON.stringify(draft)
		);
		return true;
	} catch {
		return false;
	}
}

function clearMirrorsThrough(
	owner: string,
	draft: PythonIdeRecoveryDraft,
	includeCurrent: boolean
) {
	if (typeof window === "undefined") return false;
	try {
		const prefix = mirrorOwnerPrefix(owner);
		const keys: string[] = [];
		for (let index = 0; index < window.localStorage.length; index += 1) {
			const key = window.localStorage.key(index);
			if (!key?.startsWith(prefix)) continue;
			const raw = window.localStorage.getItem(key);
			if (!raw) continue;
			try {
				const candidate: unknown = JSON.parse(raw);
				if (
					isRecoveryDraft(candidate) &&
					candidate.draftKey === draft.draftKey &&
					(includeCurrent
						? candidate.sequence <= draft.sequence
						: candidate.sequence < draft.sequence)
				) {
					keys.push(key);
				}
			} catch {
				continue;
			}
		}
		for (const key of keys) window.localStorage.removeItem(key);
		return true;
	} catch {
		return false;
	}
}

function queueOwner<Result>(owner: string, action: () => Promise<Result>) {
	const previous = ownerQueues.get(owner) ?? Promise.resolve();
	const operation = previous.then(action);
	const settled = operation.then(
		() => undefined,
		() => undefined
	);
	ownerQueues.set(owner, settled);
	void settled.then(() => {
		if (ownerQueues.get(owner) === settled) ownerQueues.delete(owner);
	});
	return operation;
}

function requestResult<Result>(request: IDBRequest<Result>) {
	return new Promise<Result>((resolve, reject) => {
		request.onsuccess = () => resolve(request.result);
		request.onerror = () =>
			reject(request.error ?? new Error("Recovery storage failed."));
	});
}

function transactionDone(transaction: IDBTransaction) {
	return new Promise<void>((resolve, reject) => {
		transaction.oncomplete = () => resolve();
		transaction.onerror = () =>
			reject(transaction.error ?? new Error("Recovery storage failed."));
		transaction.onabort = () =>
			reject(
				transaction.error ??
					new Error("Recovery storage was interrupted.")
			);
	});
}

function openDatabase() {
	if (typeof window === "undefined" || !window.indexedDB)
		return Promise.reject(new Error("IndexedDB is unavailable."));
	databasePromise ??= new Promise<IDBDatabase>((resolve, reject) => {
		const request = window.indexedDB.open(databaseName, 1);
		request.onupgradeneeded = () => {
			if (!request.result.objectStoreNames.contains(storeName)) {
				request.result.createObjectStore(storeName, { keyPath: "key" });
			}
		};
		request.onsuccess = () => {
			request.result.onversionchange = () => {
				request.result.close();
				databasePromise = null;
			};
			resolve(request.result);
		};
		request.onerror = () =>
			reject(request.error ?? new Error("Recovery storage failed."));
		request.onblocked = () =>
			reject(new Error("Recovery storage is blocked by another tab."));
	}).catch(error => {
		databasePromise = null;
		throw error;
	});
	return databasePromise;
}

async function readRecord(owner: string) {
	const database = await openDatabase();
	const transaction = database.transaction(storeName, "readonly");
	const record = await requestResult<RecoveryRecord | undefined>(
		transaction.objectStore(storeName).get(owner)
	);
	await transactionDone(transaction);
	return record;
}

async function updateRecord<Result>(
	owner: string,
	update: (record: RecoveryRecord) => Result
) {
	const database = await openDatabase();
	const transaction = database.transaction(storeName, "readwrite");
	const store = transaction.objectStore(storeName);
	const current = await requestResult<RecoveryRecord | undefined>(
		store.get(owner)
	);
	const record: RecoveryRecord = current ?? {
		key: owner,
		drafts: [],
		legacySeen: []
	};
	const result = update(record);
	await requestResult(store.put(record));
	await transactionDone(transaction);
	return result;
}

function mergeDrafts(...groups: PythonIdeRecoveryDraft[][]) {
	const latest = new Map<string, PythonIdeRecoveryDraft>();
	for (const group of groups) {
		for (const draft of group) {
			if (!isRecoveryDraft(draft)) continue;
			const previous = latest.get(draft.draftKey);
			if (!previous || draft.sequence >= previous.sequence) {
				latest.set(draft.draftKey, draft);
			}
		}
	}
	return [...latest.values()];
}

export function savePythonIdeRecoveryDraft(
	project: PythonIdeProject,
	owner: string
) {
	const draft: PythonIdeRecoveryDraft = {
		draftKey: `${browserInstanceID}:${project._id}`,
		generation: `${browserInstanceID}:${++sequence}`,
		project: cloneProject(project),
		sequence
	};
	const mirrored = writeMirror(owner, draft);
	if (mirrored) clearMirrorsThrough(owner, draft, false);
	return queueOwner(owner, async () => {
		try {
			await updateRecord(owner, record => {
				record.drafts = mergeDrafts(record.drafts, [draft]);
			});
		} catch (error) {
			if (!mirrored) throw error;
		}
		return draft;
	});
}

export function acknowledgePythonIdeRecoveryDraft(
	draft: PythonIdeRecoveryDraft,
	owner: string
) {
	return queueOwner(owner, async () => {
		try {
			await updateRecord(owner, record => {
				record.drafts = record.drafts.filter(
					candidate =>
						candidate.draftKey !== draft.draftKey ||
						candidate.generation !== draft.generation
				);
			});
		} catch {
			return false;
		}
		return clearMirrorsThrough(owner, draft, true);
	});
}

async function legacyDigest(projects: PythonIdeProject[]) {
	if (typeof crypto === "undefined" || !crypto.subtle) return null;
	const bytes = new TextEncoder().encode(JSON.stringify(projects));
	const digest = await crypto.subtle.digest("SHA-256", bytes);
	return [...new Uint8Array(digest)]
		.map(byte => byte.toString(16).padStart(2, "0"))
		.join("");
}

export function loadPythonIdeRecoveryDrafts(owner: string) {
	return queueOwner(owner, async () => {
		const legacyCopies =
			await loadLegacyLocalPythonProjectCopiesAsync(owner);
		const transientLegacy: PythonIdeRecoveryDraft[] = [];
		for (const sourceProjects of legacyCopies) {
			const projects = sourceProjects.filter(
				project =>
					project &&
					typeof project._id === "string" &&
					Array.isArray(project.files) &&
					project.files.every(
						file =>
							file &&
							typeof file.name === "string" &&
							typeof file.content === "string"
					)
			);
			if (!projects.length) continue;
			const digest = await legacyDigest(projects);
			if (!digest) {
				transientLegacy.push(
					...projects.map((project, index) => ({
						draftKey: `legacy-unverified:${index}:${project._id}`,
						generation: `legacy-unverified:${browserInstanceID}:${index}`,
						project: cloneProject(project),
						sequence: 0
					}))
				);
				continue;
			}
			try {
				await updateRecord(owner, record => {
					if (record.legacySeen.includes(digest)) return;
					record.drafts.push(
						...projects.map((project, index) => ({
							draftKey: `legacy:${digest}:${index}:${project._id}`,
							generation: digest,
							project: cloneProject(project),
							sequence: 0
						}))
					);
					record.legacySeen.push(digest);
				});
			} catch {
				transientLegacy.push(
					...projects.map((project, index) => ({
						draftKey: `legacy-unverified:${digest}:${index}:${project._id}`,
						generation: digest,
						project: cloneProject(project),
						sequence: 0
					}))
				);
			}
		}
		let stored: RecoveryRecord | undefined;
		try {
			stored = await readRecord(owner);
		} catch {
			stored = undefined;
		}
		return mergeDrafts(
			stored?.drafts ?? [],
			readMirrorEntries(owner),
			transientLegacy
		);
	});
}
