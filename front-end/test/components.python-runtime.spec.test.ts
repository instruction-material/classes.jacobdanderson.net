import { flushPromises, mount } from "@vue/test-utils";
import { createPinia } from "pinia";
import { describe, expect, it, vi } from "vitest";
import { createMemoryHistory, createRouter } from "vue-router";
import CodeIdeWorkspace from "@/components/CodeIdeWorkspace.vue";

const calls = vi.hoisted(() => ({
	get: vi.fn(),
	post: vi.fn(),
	put: vi.fn(),
	delete: vi.fn()
}));
vi.mock("@/api", () => ({ api: calls }));

describe("runtime-only Python surface", () => {
	it("reports a later game frame failure and clears the running status", async () => {
		vi.stubGlobal(
			"ResizeObserver",
			class {
				observe() {}
				disconnect() {}
			}
		);
		vi.stubGlobal(
			"requestAnimationFrame",
			vi.fn(() => 1)
		);
		vi.stubGlobal("cancelAnimationFrame", vi.fn());
		const router = createRouter({
			history: createMemoryHistory(),
			routes: [{ path: "/", component: { template: "<div/>" } }]
		});
		await router.push("/");
		let wrapper: ReturnType<typeof mount> | undefined;
		try {
			wrapper = mount(CodeIdeWorkspace, {
				props: { runtimeOnly: true },
				global: { plugins: [createPinia(), router] }
			});
			const runtime = wrapper.vm.$.setupState as {
				startGameLoop: (tick: () => Promise<void>) => void;
				runMessage: string;
				isGameLoopActive: boolean;
			};
			runtime.startGameLoop(async () => {
				throw new Error("late tick failure");
			});
			await flushPromises();
			const errors = wrapper
				.emitted("runtimeMessage")
				?.map(
					([message]) => message as { type: string; message?: string }
				)
				.filter(message => message.type === "error");
			expect(errors).toHaveLength(1);
			expect(errors![0].message).toContain("late tick failure");
			expect(runtime.runMessage).toBe("Run failed");
			expect(runtime.isGameLoopActive).toBe(false);
		} finally {
			wrapper?.unmount();
			vi.unstubAllGlobals();
		}
	});

	it("mounts and unmounts without account requests, persistence or editor controls", async () => {
		const storage = Object.getOwnPropertyDescriptor(
			window,
			"localStorage"
		)!;
		const database = Object.getOwnPropertyDescriptor(window, "indexedDB");
		const denyStorage = vi.fn(() => {
			throw new Error("No origin storage in this fixture");
		});
		const router = createRouter({
			history: createMemoryHistory(),
			routes: [{ path: "/", component: { template: "<div/>" } }]
		});
		await router.push("/");
		Object.defineProperty(window, "localStorage", {
			configurable: true,
			get: denyStorage
		});
		Object.defineProperty(window, "indexedDB", {
			configurable: true,
			get: denyStorage
		});
		const observe = vi.fn();
		vi.stubGlobal(
			"ResizeObserver",
			class {
				observe = observe;
				disconnect = vi.fn();
			}
		);
		let wrapper: ReturnType<typeof mount> | undefined;
		try {
			wrapper = mount(CodeIdeWorkspace, {
				props: { runtimeOnly: true },
				global: { plugins: [createPinia(), router] }
			});
			await flushPromises();
			expect(wrapper.findAll("textarea, input, button")).toHaveLength(0);
			const runtime = wrapper.vm.$.setupState as {
				appendArtifact: (artifact: {
					title: string;
					mimeType: string;
					data: string;
				}) => void;
			};
			runtime.appendArtifact({
				title: "PySynth: demo.wav",
				mimeType: "audio/wav",
				data: "bounded WAV fixture"
			});
			runtime.appendArtifact({
				title: "Local report",
				mimeType: "text/plain",
				data: "report"
			});
			expect(wrapper.emitted("runtimeMessage")).toContainEqual([
				{
					type: "audio",
					title: "PySynth: demo.wav",
					data: "bounded WAV fixture"
				}
			]);
			expect(
				wrapper
					.emitted("runtimeMessage")
					?.filter(
						([message]) =>
							(message as { type: string }).type === "audio"
					)
			).toHaveLength(1);
			document.dispatchEvent(new Event("visibilitychange"));
			window.dispatchEvent(new Event("pagehide"));
			wrapper.unmount();
			wrapper = undefined;
			await flushPromises();
			expect(denyStorage).not.toHaveBeenCalled();
			for (const call of Object.values(calls))
				expect(call).not.toHaveBeenCalled();
		} finally {
			wrapper?.unmount();
			Object.defineProperty(window, "localStorage", storage);
			if (database) Object.defineProperty(window, "indexedDB", database);
			else Reflect.deleteProperty(window, "indexedDB");
			vi.unstubAllGlobals();
		}
	});
});
