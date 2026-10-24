import { flushPromises, mount } from "@vue/test-utils";
import { createPinia } from "pinia";
import { describe, expect, it, vi } from "vitest";
import { createMemoryHistory, createRouter } from "vue-router";
import CodeIdeWorkspace from "@/components/CodeIdeWorkspace.vue";
import { createPythonIdeProject } from "@/modules/pythonIde";

const calls = vi.hoisted(() => ({
	get: vi.fn(),
	post: vi.fn(),
	put: vi.fn(),
	delete: vi.fn()
}));
vi.mock("@/api", () => ({ api: calls }));

describe("runtime-only Python surface", () => {
	it("bounds mixed sound and tone playback while preserving ordinary loops", async () => {
		class TestAudio extends EventTarget {
			static instances: TestAudio[] = [];
			static rejectNext = false;
			currentTime = 0;
			loop = false;
			volume = 1;
			playCount = 0;
			volumesAtPlay: number[] = [];

			constructor(_source: string) {
				super();
				TestAudio.instances.push(this);
			}

			play() {
				this.playCount += 1;
				this.volumesAtPlay.push(this.volume);
				if (TestAudio.rejectNext) {
					TestAudio.rejectNext = false;
					return Promise.reject(new Error("blocked"));
				}
				return Promise.resolve();
			}

			pause() {}
		}
		class TestAudioContext {
			static instances: TestAudioContext[] = [];
			static oscillators = 0;
			static disconnectedOscillators = 0;
			currentTime = 0;
			destination = {};
			state = "running";

			constructor() {
				TestAudioContext.instances.push(this);
			}

			createOscillator() {
				TestAudioContext.oscillators += 1;
				return {
					type: "sine",
					frequency: { setValueAtTime() {} },
					addEventListener() {},
					connect() {},
					disconnect() {
						TestAudioContext.disconnectedOscillators += 1;
					},
					start() {},
					stop() {}
				};
			}

			createGain() {
				return {
					gain: {
						context: this,
						setValueAtTime() {},
						exponentialRampToValueAtTime() {},
						cancelScheduledValues() {}
					},
					connect() {},
					disconnect() {}
				};
			}

			resume() {
				return Promise.resolve();
			}

			suspend() {
				this.state = "suspended";
				return Promise.resolve();
			}
		}
		vi.stubGlobal("Audio", TestAudio);
		vi.stubGlobal("AudioContext", TestAudioContext);
		vi.stubGlobal(
			"ResizeObserver",
			class {
				observe() {}
				disconnect() {}
			}
		);
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
				projects: ReturnType<typeof createPythonIdeProject>[];
				playGameSound: (name: string, loops?: number) => void;
				playGameTone: (frequency: number, duration: number) => number;
				stopGameSound: (name: string) => void;
				setGameSoundVolume: (name: string, volume: number) => void;
				getGameSoundVolume: (name: string) => number;
				createGuardedGameBridgeRun: () => {
					setSoundVolume: (name: string, volume: number) => void;
					getSoundVolume: (name: string) => number;
				};
				stopAllGameAudio: () => void;
			};
			const project = createPythonIdeProject("pgzero");
			project.files.push({
				name: "sounds/beep.wav",
				content: "UklGRg==",
				encoding: "base64"
			});
			runtime.projects.push(project);
			for (let count = 0; count < 64; count += 1)
				runtime.playGameSound("missing");
			expect(runtime.getGameSoundVolume("beep")).toBe(1);
			runtime.setGameSoundVolume("beep", 0.4);
			runtime.playGameSound("beep");
			expect(TestAudio.instances).toHaveLength(1);
			expect(TestAudio.instances[0].volumesAtPlay).toEqual([0.4]);
			runtime.setGameSoundVolume("beep", 0.2);
			expect(TestAudio.instances[0].volume).toBe(0.2);
			runtime.setGameSoundVolume("other", 0.7);
			expect(TestAudio.instances[0].volume).toBe(0.2);
			runtime.setGameSoundVolume("beep", -1);
			runtime.setGameSoundVolume("beep", Number.NaN);
			expect(runtime.getGameSoundVolume("beep")).toBe(0.2);
			const previousRun = runtime.createGuardedGameBridgeRun();
			const currentRun = runtime.createGuardedGameBridgeRun();
			previousRun.setSoundVolume("beep", 0.9);
			expect(previousRun.getSoundVolume("beep")).toBe(1);
			expect(currentRun.getSoundVolume("beep")).toBe(0.2);
			expect(TestAudio.instances[0].volume).toBe(0.2);
			runtime.stopGameSound("beep");
			TestAudio.instances.length = 0;

			for (let count = 0; count < 16; count += 1)
				runtime.playGameSound("beep", -1);
			for (let count = 0; count < 16; count += 1)
				expect(runtime.playGameTone(440, 10)).toBeGreaterThan(0);
			expect(TestAudio.instances).toHaveLength(16);
			expect(TestAudio.instances.every(audio => audio.loop)).toBe(true);
			expect(TestAudio.instances.every(audio => audio.volume === 0.2)).toBe(true);
			runtime.setGameSoundVolume("beep", 0);
			expect(TestAudio.instances.every(audio => audio.volume === 0)).toBe(true);
			runtime.setGameSoundVolume("beep", 2);
			expect(TestAudio.instances.every(audio => audio.volume === 1)).toBe(true);
			expect(TestAudioContext.oscillators).toBe(16);
			runtime.playGameSound("beep");
			expect(runtime.playGameTone(440, 10)).toBe(0);
			expect(TestAudio.instances).toHaveLength(16);
			expect(TestAudioContext.oscillators).toBe(16);

			TestAudio.instances[0].dispatchEvent(new Event("error"));
			expect(runtime.playGameTone(440, 10)).toBeGreaterThan(0);
			runtime.stopGameSound("beep");
			TestAudio.rejectNext = true;
			runtime.playGameSound("beep");
			await flushPromises();
			for (let count = 0; count < 15; count += 1)
				expect(runtime.playGameTone(440, 10)).toBeGreaterThan(0);
			expect(runtime.playGameTone(440, 10)).toBe(0);
			runtime.stopAllGameAudio();
			expect(TestAudioContext.disconnectedOscillators).toBe(32);
			expect(runtime.getGameSoundVolume("other")).toBe(1);

			runtime.playGameSound("beep", 2);
			const repeated = TestAudio.instances.at(-1)!;
			expect(repeated.loop).toBe(false);
			for (let count = 0; count < 3; count += 1)
				repeated.dispatchEvent(new Event("ended"));
			expect(repeated.playCount).toBe(3);
			runtime.playGameSound("beep", 33);
			expect(TestAudio.instances).toHaveLength(18);
			runtime.stopAllGameAudio();
			expect(runtime.playGameTone(440, 0.2)).toBeGreaterThan(0);
			runtime.stopAllGameAudio();
			vi.useFakeTimers();
			TestAudioContext.instances[0].state = "suspended";
			const priorDisconnects = TestAudioContext.disconnectedOscillators;
			expect(runtime.playGameTone(440, 0.02)).toBeGreaterThan(0);
			vi.advanceTimersByTime(100);
			expect(TestAudioContext.disconnectedOscillators).toBe(
				priorDisconnects + 1
			);
			vi.useRealTimers();

			vi.spyOn(performance, "now").mockReturnValue(
				performance.now() + 1000
			);
			for (let count = 0; count < 32; count += 1)
				runtime.playGameSound("beep", 2);
			const burst = TestAudio.instances.slice(-32);
			expect(burst).toHaveLength(32);
			burst.forEach(audio => audio.dispatchEvent(new Event("ended")));
			expect(burst.every(audio => audio.playCount === 2)).toBe(true);
			burst.forEach(audio => audio.dispatchEvent(new Event("ended")));
			expect(burst.every(audio => audio.playCount === 2)).toBe(true);
		}
		finally {
			wrapper?.unmount();
			vi.useRealTimers();
			vi.restoreAllMocks();
			vi.unstubAllGlobals();
		}
	});

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
		}
		finally {
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
		}
		finally {
			wrapper?.unmount();
			Object.defineProperty(window, "localStorage", storage);
			if (database) Object.defineProperty(window, "indexedDB", database);
			else Reflect.deleteProperty(window, "indexedDB");
			vi.unstubAllGlobals();
		}
	});
});
