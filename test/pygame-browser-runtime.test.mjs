import assert from "node:assert/strict";
import { Buffer } from "node:buffer";
import { existsSync } from "node:fs";
// eslint-disable-next-line test/no-import-node-test -- Native browser CI entrypoint.
import { test as nodeTest } from "node:test";
import { fileURLToPath } from "node:url";
import puppeteer from "puppeteer";
import { createServer } from "vite";
import { serializeContentSecurityPolicy } from "../scripts/production-security-headers.mjs";
import { publicRuntimeHeaders, pythonFrame } from "./python-frame-fixture.mjs";

// Uses the real IDE and Pyodide runtime. No account or backend is required.
const root = fileURLToPath(new URL("../front-end/", import.meta.url));
const audioFixture = Buffer.alloc(44 + 4000);
audioFixture.write("RIFF", 0);
audioFixture.writeUInt32LE(audioFixture.length - 8, 4);
audioFixture.write("WAVEfmt ", 8);
audioFixture.writeUInt32LE(16, 16);
audioFixture.writeUInt16LE(1, 20);
audioFixture.writeUInt16LE(1, 22);
audioFixture.writeUInt32LE(8000, 24);
audioFixture.writeUInt32LE(16000, 28);
audioFixture.writeUInt16LE(2, 32);
audioFixture.writeUInt16LE(16, 34);
audioFixture.write("data", 36);
audioFixture.writeUInt32LE(4000, 40);
for (let i = 0; i < 2000; i++) {
	audioFixture.writeInt16LE(
		Math.round(2000 * Math.sin((2 * Math.PI * 440 * i) / 8000)),
		44 + i * 2
	);
}

const code = `import pygame
from pygame import Surface, SRCALPHA
import builtins
import sys

# Course programs use the running main module as well as injected built-ins.
for runtime_name in (
    "Actor", "Rect", "ZRect", "screen", "keyboard", "keys", "mouse",
    "keymods", "clock", "Animation", "animate", "tone", "sounds",
    "music", "images", "pgzrun",
):
    assert getattr(sys.modules["__main__"], runtime_name) is getattr(builtins, runtime_name)

# Exercise the unmodified mixer startup sequence present in the Juni checkpoint.
pygame.mixer.pre_init(22050, -16, 2, 1024)
pygame.init()
pygame.mixer.quit()
assert pygame.mixer.get_init() is None
pygame.mixer.init(22050, -16, 2, 1024)
assert pygame.mixer.get_init() == (22050, -16, 2)
sounds.mixer_fixture.play(loops=-1)
music.play("mixer_fixture")
pygame.mixer.quit()
assert pygame.mixer.get_init() is None
try:
    sounds.mixer_fixture.play()
    raise AssertionError("Uninitialized mixer accepted playback")
except RuntimeError:
    pass
pygame.init()
# Music started during setup must survive the runner starting its draw loop.
music.play("mixer_fixture")

WIDTH = 160
HEIGHT = 120
card = Surface((40, 30))
assert card.get_size() == (40, 30)
assert card.get_at((0, 0)) == (0, 0, 0, 255)
assert tuple(card.fill("red")) == (0, 0, 40, 30)
pygame.draw.rect(card, "lime", (5, 5, 10, 10))
assert card.get_at((7, 7)) == (0, 255, 0, 255)
assert tuple(card.get_rect(center=(20, 15))) == (0, 0, 40, 30)
copy = card.copy()
copy.fill("blue")
assert card.get_at((1, 1)) == (255, 0, 0, 255)
copy.set_clip((5, 5, 10, 10))
copy.fill("yellow")
assert copy.get_at((1, 1)) == (0, 0, 255, 255)
assert copy.get_at((6, 6)) == (255, 255, 0, 255)
copy.set_clip(None)
copy.blit(card, (0, 0), (5, 5, 10, 10))
assert copy.get_at((2, 2)) == (0, 255, 0, 255)
alpha = Surface((20, 20), SRCALPHA)
assert alpha.get_at((0, 0)) == (0, 0, 0, 0)
alpha.fill((0, 0, 255, 128))
assert alpha.get_at((1, 1)) == (0, 0, 255, 128)
assert alpha.convert().get_at((0, 0)) == (0, 0, 255, 255)
opaque = Surface((1, 1))
opaque.fill((0, 0, 255, 128))
assert opaque.get_at((0, 0)) == (0, 0, 255, 255)
assert card.convert_alpha().get_flags() & SRCALPHA
scaled = pygame.transform.scale(card, (80, 60))
assert scaled.get_at((14, 14)) == (0, 255, 0, 255)
flipped = pygame.transform.flip(card, True, False)
assert flipped.get_at((32, 7)) == (0, 255, 0, 255)
pygame.transform.scale(card, card.get_size(), card)
assert card.get_at((7, 7)) == (0, 255, 0, 255)
empty = Surface((0, 0))
assert empty.copy().convert().convert_alpha().get_size() == (0, 0)
shapes = Surface((20, 20))
pygame.draw.circle(shapes, "lime", (10, 10), 6, 10)
assert shapes.get_at((10, 10)) == (0, 255, 0, 255)
keyed = Surface((10, 10))
keyed.fill("magenta")
keyed.set_colorkey("magenta")
copy.blit(keyed, (0, 0))
assert copy.get_at((2, 2)) == (0, 255, 0, 255)
for size in [(-1, 20), (5000, 1)]:
    try:
        Surface(size)
        raise AssertionError("Invalid dimensions accepted")
    except ValueError:
        pass
try:
    pygame.display
    raise AssertionError("Unavailable native display API accepted")
except AttributeError as error:
    assert "Pygame Zero" in str(error)
held_surfaces = []
try:
    for index in range(256):
        held_surfaces.append(Surface((1, 1)))
    raise AssertionError("Live surface limit not enforced")
except MemoryError:
    pass
held_surfaces.clear()

from js import document
fixture_actor = Actor("fixture", center=(140, 65))
first_draw = True
dynamic_actor = None

def update():
    global dynamic_actor
    if dynamic_actor is None:
        dynamic_actor = Actor("next_" + "fixture", center=(120, 65))

def draw():
    global first_draw
    screen.fill("white")
    screen.blit(card, (10, 10))
    screen.blit(alpha, (60, 10))
    screen.blit(keyed, (100, 10))
    fixture_actor.draw()
    dynamic_actor.draw()
    if first_draw:
        canvas = document.querySelector("canvas.turtle-canvas--game")
        pixel = canvas.getContext("2d").getImageData(140, 65, 1, 1).data
        assert tuple(pixel) == (255, 0, 255, 255), "Course image was not ready for the first draw"
        dynamic_pixel = canvas.getContext("2d").getImageData(120, 65, 1, 1).data
        assert tuple(dynamic_pixel) == (0, 255, 0, 255), "Image requested during update was not ready for draw"
        first_draw = False
        print("FIRST_IMAGE_READY")
    screen.draw.text("Centered", center=(80, 60), fontsize=18, color="red")
    screen.draw.text("two\\nlines", midtop=(80, 78), fontsize=12, color="blue")
    screen.draw.text("L", topleft=(0, 100), fontsize=14, color="purple")
    screen.draw.text("R", topright=(160, 100), fontsize=14, color="lime")
    screen.draw.text("S", (40, 100), fontsize=14, color="black", shadow=(2, 2), scolor="orange")
    screen.draw.filled_rect(Rect(0, 0, 3, 3), "red")

print("SURFACE_TEST_PASS")
`;

nodeTest(
	"Pygame surfaces, anchored text and first-frame images survive a rerun",
	{ timeout: 180000 },
	async () => {
		let server;
		let browser;
		let outcome = "failed";
		const startedAt = new Date().toISOString();
		const imageRequests = [];
		const taskId = process.env.CLASSES_FAMILY_TASK_ID ?? "pygame-browser-runtime-ci";
		const processEvidence = { taskId, pid: process.pid, parentPid: process.ppid, cwd: root, command: process.argv, startedAt, timeoutMs: 180000 };
		console.log(JSON.stringify({ event: "start", ...processEvidence }));
		const previousDirectory = process.cwd();
		try {
			process.chdir(root);
			server = await createServer({
				root,
				// Prebundle lazy IDE imports before a program starts; avoid cold-cache reloads.
				optimizeDeps: {
					include: [
						"@codemirror/state",
						"@codemirror/view",
						"@codemirror/autocomplete",
						"@codemirror/commands",
						"@codemirror/lang-java",
						"@codemirror/lang-python",
						"@codemirror/language",
						"@codemirror/lint",
						"@codemirror/search",
						"@lezer/highlight",
						"@fortawesome/fontawesome-svg-core",
						"@fortawesome/free-brands-svg-icons",
						"@fortawesome/free-solid-svg-icons",
						"@fortawesome/vue-fontawesome"
					]
				},
				server: {
					host: "127.0.0.1",
					port: 0,
					strictPort: true,
					headers: { "Content-Security-Policy": serializeContentSecurityPolicy("code-ide") }
				}
			});
			await server.listen();
			const address = server.httpServer.address();
			const installedChrome
				= "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
			const executablePath = [
				process.env.PUPPETEER_EXECUTABLE_PATH,
				puppeteer.executablePath(),
				installedChrome,
				"/usr/bin/google-chrome",
				"/usr/bin/chromium"
			].find(path => path && existsSync(path));
			assert.ok(
				executablePath,
				"Install Chrome or set PUPPETEER_EXECUTABLE_PATH."
			);
			browser = await puppeteer.launch({
				executablePath,
				headless: true
			});
			console.log(JSON.stringify({ event: "browser-start", taskId, pid: browser.process()?.pid, parentPid: process.pid, cwd: root, command: browser.process()?.spawnargs, startedAt: new Date().toISOString(), timeoutMs: 180000 }));
			const page = await browser.newPage();
			await page.setViewport({ width: 1440, height: 1000 });
			// This isolated Surface/mixer fixture uses generated images and a real WAV.
			await page.setRequestInterception(true);
			page.on("request", async (request) => {
				if (new URL(request.url()).pathname.includes("/assets/images/")) imageRequests.push(request.url());
				if (request.url().endsWith("/stars.jpg")) {
					void request.respond({ status: 404 });
				}
				else if (new URL(request.url()).pathname.startsWith("/api/")) {
					void request.respond({
						status: 200,
						contentType: "application/json",
						body: "{}"
					});
				}
				else if (
					/\/(?:python-ide|ide)\/assets\/manifest\.json/.test(
						request.url()
					)
				) {
					void request.respond({
						status: 200,
						contentType: "application/json",
						body: JSON.stringify({
							assets: [
								{
									name: "images/fixture.svg",
									mimeType: "image/svg+xml",
									width: 2,
									height: 2,
									url: "/ide/assets/images/fixture.svg"
								},
								{
									name: "images/next_fixture.svg",
									mimeType: "image/svg+xml",
									width: 2,
									height: 2,
									url: "/ide/assets/images/next_fixture.svg"
								},
								{
									name: "images/stars.jpg",
									mimeType: "image/jpeg",
									width: 2048,
									height: 2048,
									url: "/ide/assets/images/stars.jpg"
								},
								{
									name: "sounds/mixer_fixture.wav",
									mimeType: "audio/wav",
									url: "/ide/assets/sounds/mixer_fixture.wav"
								},
								{
									name: "music/mixer_fixture.wav",
									mimeType: "audio/wav",
									url: "/ide/assets/music/mixer_fixture.wav"
								}
							]
						}),
						headers: publicRuntimeHeaders
					});
				}
				else if (request.url().endsWith("/mixer_fixture.wav")) {
					void request.respond({
						status: 200,
						contentType: "audio/wav",
						headers: publicRuntimeHeaders,
						body: audioFixture
					});
				}
				else if (/\/(?:next_)?fixture\.svg$/.test(request.url())) {
					await new Promise(resolve => setTimeout(resolve, 250));
					void request.respond({
						status: 200,
						contentType: "image/svg+xml",
						headers: publicRuntimeHeaders,
						body: `<svg xmlns="http://www.w3.org/2000/svg" width="2" height="2"><rect width="2" height="2" fill="${request.url().endsWith("/next_fixture.svg") ? "lime" : "magenta"}"/></svg>`
					});
				}
				else {
					void request.continue();
				}
			});
			await page.evaluateOnNewDocument((code) => {
				window.__mixerAudioLog = [];
				for (const action of ["play", "pause"]) {
					const original = HTMLMediaElement.prototype[action];
					HTMLMediaElement.prototype[action] = function (...args) {
						window.__mixerAudioLog.push({ action, src: this.src });
						return original.apply(this, args);
					};
				}
				if (window !== window.top) return;
				const now = new Date().toISOString();
				localStorage.setItem(
					"classes-python-ide-projects:anonymous",
					JSON.stringify([
						{
							_id: "local-surface-regression",
							title: "Surface regression",
							mode: "pgzero",
							shared: false,
							activeFileName: "main.py",
							files: [{ name: "main.py", content: code }],
							createdAt: now,
							updatedAt: now
						}
					])
				);
			}, code);
			await page.goto(`http://127.0.0.1:${address.port}/ide`, {
				waitUntil: "networkidle2"
			});
			await page.waitForSelector("button.run-control:not([disabled])");
			for (let run = 0; run < 2; run += 1) {
				const oldFrameElement = await page.$(
					"iframe[title=\"Isolated Python output\"]"
				);
				const oldFrame = await oldFrameElement?.contentFrame();
				if (oldFrame) {
					await oldFrame.evaluate(() => {
						window.__mixerAudioLog = [];
					});
				}
				await page.locator("button.run-control").click();
				const runtime = await pythonFrame(page);
				try {
					await page.waitForFunction(
						() => {
							const output = document.querySelector(".output-panel")?.textContent ?? "";
							if (document.querySelector(".code-ide")?.textContent?.includes("Run failed")) {
								throw new Error(output);
							}
							return output.includes("SURFACE_TEST_PASS");
						},
						{ timeout: 90000 }
					);
					assert.equal(await runtime.evaluate(() => [...document.fonts].some(font =>
						(font.family === "Classes Pygame Default" || font.family === "\"Classes Pygame Default\"") && font.status === "loaded")), true);
					const audioEvents = await runtime.evaluate(
						() => window.__mixerAudioLog ?? []
					);
					for (const folder of ["sounds", "music"]) {
						const played = audioEvents.findIndex(
							event =>
								event.action === "play"
								&& event.src.includes(
									`/${folder}/mixer_fixture.wav`
								)
						);
						assert.ok(
							played >= 0,
							`${folder} playback used the actual audio element`
						);
						assert.ok(
							audioEvents
								.slice(played + 1)
								.some(
									event =>
										event.action === "pause"
										&& event.src === audioEvents[played].src
								),
							`${folder} stopped when the mixer quit`
						);
					}
					const startupMusic = audioEvents.findLastIndex(
						event =>
							event.action === "play"
							&& event.src.includes("/music/mixer_fixture.wav")
					);
					assert.ok(startupMusic >= 0);
					assert.ok(
						!audioEvents
							.slice(startupMusic + 1)
							.some(
								event =>
									event.action === "pause"
									&& event.src === audioEvents[startupMusic].src
							),
						"Runner setup preserves music started by the program"
					);
					await runtime.waitForFunction(
						() => {
							const canvas = document.querySelector(
								"canvas.turtle-canvas--game"
							);
							if (!canvas) return false;
							const pixel = canvas
								.getContext("2d")
								.getImageData(
									(12 * canvas.width) / 160,
									(12 * canvas.height) / 120,
									1,
									1
								)
								.data;
							return pixel[0] === 255 && pixel[1] === 0;
						},
						{ timeout: 15000 }
					);
				}
				catch (error) {
					throw new Error(
						`${error.message}\n${await page.$eval(".code-ide", element => element.textContent).catch(() => page.$eval("body", element => element.textContent))}`
					);
				}
				// Expanding the console must preserve the running game and its surfaces.
				await page.click(".console-expand-toggle");
				assert.equal(
					await page.$eval("button.run-control", element =>
						element.textContent.trim()),
					"Stop"
				);
				await page.click(".console-expand-toggle");
				await runtime.waitForFunction(() => {
					const canvas = document.querySelector(
						"canvas.turtle-canvas--game"
					);
					if (!canvas?.clientHeight) return false;
					const pixel = canvas
						.getContext("2d")
						.getImageData(
							(12 * canvas.width) / 160,
							(12 * canvas.height) / 120,
							1,
							1
						)
						.data;
					return pixel[0] === 255 && pixel[1] === 0;
				});
				const pixels = await runtime.$eval(
					"canvas.turtle-canvas--game",
					(canvas) => {
						const context = canvas.getContext("2d");
						return [
							[12, 12],
							[17, 17],
							[65, 15],
							[105, 15]
						].map(([x, y]) => [
							...context.getImageData(
								(x * canvas.width) / 160,
								(y * canvas.height) / 120,
								1,
								1
							).data
						]);
					}
				);
				assert.deepEqual(pixels[0], [255, 0, 0, 255]);
				assert.deepEqual(pixels[1], [0, 255, 0, 255]);
				assert.deepEqual(pixels[2], [127, 127, 255, 255]);
				assert.deepEqual(pixels[3], [255, 255, 255, 255]);
				const text = await runtime.$eval("canvas.turtle-canvas--game", (canvas) => {
					const context = canvas.getContext("2d");
					const data = context.getImageData(0, 0, canvas.width, canvas.height).data;
					const bounds = (color, top) => {
						const points = [];
						for (let y = top; y < canvas.height; y++) {
							for (let x = 0; x < canvas.width; x++) {
								const offset = (y * canvas.width + x) * 4;
								if (color.every((value, channel) => Math.abs(data[offset + channel] - value) <= 96)) points.push([x, y]);
							}
						}
						return { count: points.length, left: Math.min(...points.map(p => p[0])), right: Math.max(...points.map(p => p[0])), rows: [...new Set(points.map(p => p[1]))] };
					};
					return { center: bounds([255, 0, 0], 45), multiline: bounds([0, 0, 255], 75), left: bounds([128, 0, 128], 100), right: bounds([0, 255, 0], 100), shadow: bounds([255, 165, 0], 100), radius: getComputedStyle(canvas).borderTopLeftRadius, corner: [...context.getImageData(0, 0, 1, 1).data] };
				});
				console.log(JSON.stringify({ event: "text-rendered-pixels", taskId, run, text }));
				assert.ok(text.center.count > 20);
				assert.ok(Math.abs((text.center.left + text.center.right) / 2 - 80) < 4, JSON.stringify(text));
				assert.ok(Math.abs((text.multiline.left + text.multiline.right) / 2 - 80) < 4, JSON.stringify(text));
				// Native fontsize 12 uses an 8px font and 9px line skip.
				assert.ok(text.multiline.rows.some(y => y >= 79 && y <= 85), JSON.stringify(text));
				assert.ok(text.multiline.rows.some(y => y >= 88 && y <= 94), JSON.stringify(text));
				assert.ok(text.multiline.rows.every(y => y >= 79 && y <= 94), JSON.stringify(text));
				assert.ok(text.left.count > 0 && text.left.left < 4);
				assert.ok(text.right.count > 0 && text.right.right >= 155 && text.right.right < 160);
				assert.ok(text.shadow.count > 0);
				assert.equal(text.radius, "0px");
				assert.deepEqual(text.corner, [255, 0, 0, 255]);
				console.log(JSON.stringify({ event: "text-and-first-image-regression", taskId, run, passed: true, text }));
				// Exercise Mu-style Play/Stop from the editor without refreshing the page.
				await page.click(".cm-content");
				await page.keyboard.press("F5");
				await page.waitForFunction(
					() =>
						document
							.querySelector("button.run-control")
							?.textContent
							?.trim() === "Run"
				);
			}
			assert.ok(imageRequests.some(url => url.endsWith("/fixture.svg")));
			assert.ok(imageRequests.some(url => url.endsWith("/next_fixture.svg")));
			assert.ok(!imageRequests.some(url => url.endsWith("/stars.jpg")), "Unused unavailable image remains lazy");
			outcome = "passed";
		}
		finally {
			await browser?.close();
			await server?.close();
			process.chdir(previousDirectory);
			console.log(JSON.stringify({ event: "end", ...processEvidence, browserPID: browser?.process()?.pid, endedAt: new Date().toISOString(), exitCode: outcome === "passed" ? 0 : 1, outcome, childProcessGroupCleanup: "Owned browser pages, contexts and browser closed; owned development server closed" }));
		}
	}
);
