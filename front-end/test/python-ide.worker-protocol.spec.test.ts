import type { RunPythonProjectOptions } from "@/modules/pythonIdeRuntime";
import { MessageChannel } from "node:worker_threads";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const workerState = vi.hoisted(() => ({
	instances: [] as Array<{
		runID: number | null;
		terminated: boolean;
		emitGlobalMessage: (message: unknown) => void;
		emitPrivateMessage: (message: unknown) => void;
	}>
}));

vi.mock("../src/workers/pythonIdePlainWorker?worker&inline", () => ({
	default: class FakePythonWorker extends EventTarget {
		runID: number | null = null;
		terminated = false;
		private port: MessagePort | null = null;

		constructor() {
			super();
			workerState.instances.push(this);
		}

		postMessage(message: { type: string }, transfer: MessagePort[]) {
			if (message.type !== "connect") return;
			this.port = transfer[0];
			this.port.addEventListener("message", event => {
				this.runID = event.data.id;
			});
			this.port.start();
		}

		emitGlobalMessage(message: unknown) {
			this.dispatchEvent(new MessageEvent("message", { data: message }));
		}

		emitPrivateMessage(message: unknown) {
			this.port?.postMessage(message);
		}

		terminate() {
			this.terminated = true;
			this.port?.close();
		}
	}
}));

import {
	runPythonProject,
	stopPythonIdeRuntimeRun
} from "@/modules/pythonIdeRuntime";

function projectOptions() {
	return {
		mode: "python",
		activeFileName: "main.py",
		files: [{ name: "main.py", content: "print('ok')" }],
		inputText: "",
		gameBridge: { stopLoop: vi.fn() },
		turtleBridge: { reset: vi.fn() },
		onArtifact: vi.fn(),
		onOutput: vi.fn(),
		onProjectFilesUpdate: vi.fn()
	} as unknown as RunPythonProjectOptions;
}

describe("plain Python worker message isolation", () => {
	const parentDescriptor = Object.getOwnPropertyDescriptor(window, "parent");
	const originDescriptor = Object.getOwnPropertyDescriptor(window, "origin");

	beforeEach(() => {
		workerState.instances.length = 0;
		vi.stubGlobal("MessageChannel", MessageChannel);
		Object.defineProperty(window, "parent", {
			configurable: true,
			value: {}
		});
		Object.defineProperty(window, "origin", {
			configurable: true,
			value: "null"
		});
	});

	afterEach(() => {
		stopPythonIdeRuntimeRun();
		if (parentDescriptor)
			Object.defineProperty(window, "parent", parentDescriptor);
		if (originDescriptor)
			Object.defineProperty(window, "origin", originDescriptor);
		vi.unstubAllGlobals();
	});

	it("ignores forged global completion and retains the Stop control", async () => {
		const run = runPythonProject(projectOptions());
		let settled = false;
		void run.then(
			() => {
				settled = true;
			},
			() => {
				settled = true;
			}
		);
		await vi.waitFor(() =>
			expect(workerState.instances[0]?.runID).not.toBeNull()
		);
		const worker = workerState.instances[0];
		worker.emitGlobalMessage({ type: "done", id: worker.runID, files: [] });
		worker.emitGlobalMessage({
			type: "error",
			id: worker.runID,
			message: "forged"
		});
		worker.emitPrivateMessage({
			type: "done",
			id: worker.runID! + 1,
			files: []
		});
		worker.emitPrivateMessage({ type: "unknown", id: worker.runID });
		await new Promise(resolve => setTimeout(resolve, 10));
		expect(settled).toBe(false);
		expect(worker.terminated).toBe(false);

		stopPythonIdeRuntimeRun();
		await expect(run).rejects.toThrow("Python run stopped.");
		expect(worker.terminated).toBe(true);
	});

	it("accepts real private-port completion and destroys that worker", async () => {
		const options = projectOptions();
		const run = runPythonProject(options);
		await vi.waitFor(() =>
			expect(workerState.instances[0]?.runID).not.toBeNull()
		);
		const worker = workerState.instances[0];
		worker.emitPrivateMessage({
			type: "output",
			id: worker.runID,
			kind: "stdout",
			text: "ok"
		});
		worker.emitPrivateMessage({
			type: "done",
			id: worker.runID,
			files: [
				{ name: "main.py", content: "print('ok')", encoding: "text" }
			]
		});
		await expect(run).resolves.toBeUndefined();
		expect(options.onOutput).toHaveBeenCalledWith("stdout", "ok");
		expect(options.onProjectFilesUpdate).toHaveBeenCalledWith([
			{ name: "main.py", content: "print('ok')", encoding: "text" }
		]);
		expect(worker.terminated).toBe(true);
	});

	it("starts a fresh worker after a completed project", async () => {
		const firstRun = runPythonProject(projectOptions());
		await vi.waitFor(() =>
			expect(workerState.instances[0]?.runID).not.toBeNull()
		);
		const firstWorker = workerState.instances[0];
		firstWorker.emitPrivateMessage({
			type: "done",
			id: firstWorker.runID,
			files: []
		});
		await expect(firstRun).resolves.toBeUndefined();
		expect(firstWorker.terminated).toBe(true);

		const secondRun = runPythonProject(projectOptions());
		await vi.waitFor(() =>
			expect(workerState.instances[1]?.runID).not.toBeNull()
		);
		expect(workerState.instances[1]).not.toBe(firstWorker);
		stopPythonIdeRuntimeRun();
		await expect(secondRun).rejects.toThrow("Python run stopped.");
	});
});
