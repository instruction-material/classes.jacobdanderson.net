import assert from "node:assert/strict";
import { Buffer } from "node:buffer";
import { createHash } from "node:crypto";
import { existsSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import process from "node:process";
// eslint-disable-next-line test/no-import-node-test -- Native browser CI entrypoint.
import { test as nodeTest } from "node:test";
import { fileURLToPath } from "node:url";
import puppeteer from "puppeteer";
import { createServer } from "vite";

const root = fileURLToPath(new URL("../front-end/", import.meta.url));
const fixture = JSON.parse(
	await readFile(
		new URL("./fixtures/pgzero-default-font-metrics.json", import.meta.url),
		"utf8"
	)
);
const font = await readFile(
	new URL(
		"../front-end/src/assets/fonts/pygame/freesansbold.ttf",
		import.meta.url
	)
);
assert.equal(font.length, 98600);
assert.equal(
	createHash("sha256").update(font).digest("hex"),
	fixture.fontSHA256
);

nodeTest(
	"matches native default-font metrics and keeps the original game labels visible",
	{ timeout: 120000 },
	async () => {
		const startedAt = new Date().toISOString();
		const taskId
			= process.env.CLASSES_FAMILY_TASK_ID ?? "pgzero-default-font-ci";
		const previousDirectory = process.cwd();
		let server;
		let browser;
		let accepted = false;
		let results;
		let fontRequests = 0;
		console.log(
			JSON.stringify({
				event: "start",
				taskId,
				pid: process.pid,
				parentPid: process.ppid,
				cwd: root,
				command: process.argv,
				startedAt,
				timeoutMs: 120000
			})
		);
		try {
			process.chdir(root);
			server = await createServer({
				root,
				configFile: `${root}/vite.config.mts`,
				plugins: [
					{
						name: "native-font-proof-page",
						configureServer(server) {
							server.middlewares.use(
								(request, response, next) => {
									if (
										request.url !== "/__pgzero-font-proof"
									) {
										next();
										return;
									}
									response.setHeader(
										"Content-Type",
										"text/html"
									);
									response.end(
										"<!doctype html><html><head><meta charset=\"utf-8\"></head><body><canvas id=\"proof\"></canvas></body></html>"
									);
								}
							);
						}
					}
				],
				server: {
					host: "127.0.0.1",
					port: 0,
					strictPort: true,
					watch: null
				}
			});
			await server.listen();
			const executablePath = [
				process.env.PUPPETEER_EXECUTABLE_PATH,
				puppeteer.executablePath(),
				"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
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
			console.log(
				JSON.stringify({
					event: "browser-start",
					taskId,
					pid: browser.process()?.pid,
					parentPid: process.pid,
					cwd: root,
					command: browser.process()?.spawnargs,
					startedAt: new Date().toISOString(),
					timeoutMs: 120000
				})
			);
			const page = await browser.newPage();
			await page.setRequestInterception(true);
			page.on("request", (request) => {
				if (
					new URL(request.url()).pathname.endsWith(
						"/freesansbold.ttf"
					)
					&& request.resourceType() === "font"
				) {
					fontRequests += 1;
					if (fontRequests === 1) {
						void request.respond({
							status: 503,
							body: "temporarily unavailable"
						});
						return;
					}
				}
				void request.continue();
			});
			const address = server.httpServer.address();
			await page.goto(
				`http://127.0.0.1:${address.port}/__pgzero-font-proof`,
				{ waitUntil: "domcontentloaded" }
			);
			results = await page.evaluate(async (fixture) => {
				const graphics
					= await import("/src/modules/pythonIdeGameGraphics.ts");
				let failed = false;
				try {
					await graphics.preparePythonIdeGameFont();
				}
				catch {
					failed = true;
				}
				if (!failed) {
					throw new Error(
						"The unavailable font must fail before drawing."
					);
				}
				await graphics.preparePythonIdeGameFont();
				await graphics.preparePythonIdeGameFont();
				const canvas = document.querySelector("#proof");
				const context = canvas.getContext("2d");
				function ink() {
					const { data } = context.getImageData(
						0,
						0,
						canvas.width,
						canvas.height
					);
					let left = canvas.width;
					let top = canvas.height;
					let right = -1;
					let bottom = -1;
					let pixels = 0;
					for (let y = 0; y < canvas.height; y++) {
						for (let x = 0; x < canvas.width; x++) {
							if (data[(y * canvas.width + x) * 4 + 3] > 0) {
								left = Math.min(left, x);
								right = Math.max(right, x);
								top = Math.min(top, y);
								bottom = Math.max(bottom, y);
								pixels += 1;
							}
						}
					}
					return {
						x: left,
						y: top,
						width: right - left + 1,
						height: bottom - top + 1,
						pixels
					};
				}
				const rows = [];
				for (const row of fixture.rows) {
					canvas.width = 1200;
					canvas.height = 260;
					graphics.drawPythonIdeGameText(
						context,
						row.text,
						100,
						50,
						"white",
						row.fontsize,
						0,
						0,
						0,
						row.lineheight ?? 1,
						row.shadow?.[0] ?? 0,
						row.shadow?.[1] ?? 0
					);
					rows.push({
						name: row.name,
						actual: ink(),
						native: row.inkBounds
					});
				}
				const labels = [];
				for (const [name, width, x, y] of [
					["number-title", 600, 300, 150],
					["asteroid-start", 500, 250, 250],
					["negative-score", 500, 50, 30],
					["lives-label", 500, 35, 25]
				]) {
					const row = fixture.rows.find(row => row.name === name);
					canvas.width = width + 200;
					canvas.height = 700;
					graphics.drawPythonIdeGameText(
						context,
						row.text,
						x + 100,
						y + 100,
						"white",
						row.fontsize,
						0.5,
						0.5
					);
					const padded = ink();
					canvas.width = width;
					canvas.height = 600;
					graphics.drawPythonIdeGameText(
						context,
						row.text,
						x,
						y,
						"white",
						row.fontsize,
						0.5,
						0.5
					);
					labels.push({
						name,
						actual: ink(),
						padded,
						image: canvas.toDataURL()
					});
				}
				return {
					failedFontRetried: failed,
					fontLoaded: [...document.fonts].some(
						font =>
							(font.family === "Classes Pygame Default"
								|| font.family === "\"Classes Pygame Default\"")
							&& font.status === "loaded"
					),
					rows,
					labels
				};
			}, fixture);
			console.log(
				JSON.stringify({
					event: "native-font-comparison",
					taskId,
					results: {
						...results,
						labels: results.labels.map(({ image, ...row }) => row)
					}
				})
			);
			assert.equal(
				fontRequests,
				2,
				"A failed load retries once; a successful font stays cached."
			);
			assert.ok(results.failedFontRetried && results.fontLoaded);
			for (const row of results.rows) {
				// SDL and browser rasterizers differ slightly in hinting and antialiasing.
				assert.ok(
					Math.abs(row.actual.x - 100 - row.native[0]) <= 2,
					JSON.stringify(row)
				);
				assert.ok(
					Math.abs(row.actual.y - 50 - row.native[1]) <= 2,
					JSON.stringify(row)
				);
				assert.ok(
					Math.abs(row.actual.width - row.native[2]) <= 6,
					JSON.stringify(row)
				);
				assert.ok(
					Math.abs(row.actual.height - row.native[3]) <= 3,
					JSON.stringify(row)
				);
			}
			for (const label of results.labels) {
				assert.equal(
					label.actual.pixels,
					label.padded.pixels,
					`${label.name} loses text at a canvas edge`
				);
			}
			const directory = process.env.PGZERO_FONT_BROWSER_DIR;
			if (directory) {
				await mkdir(directory, { recursive: true });
				for (const label of results.labels) {
					await writeFile(
						`${directory}/${label.name}.png`,
						Buffer.from(label.image.split(",")[1], "base64")
					);
				}
			}
			accepted = true;
		}
		finally {
			await browser?.close();
			await server?.close();
			process.chdir(previousDirectory);
			if (process.env.PGZERO_FONT_BROWSER_DIR) {
				await mkdir(process.env.PGZERO_FONT_BROWSER_DIR, {
					recursive: true
				});
				await writeFile(
					`${process.env.PGZERO_FONT_BROWSER_DIR}/proof.json`,
					`${JSON.stringify({ accepted, startedAt, endedAt: new Date().toISOString(), fontRequests, fontSHA256: fixture.fontSHA256, rows: results?.rows, labels: results?.labels?.map(({ image, ...row }) => row), allOwnedProcessesClosed: true }, null, 2)}\n`
				);
			}
			console.log(
				JSON.stringify({
					event: "end",
					taskId,
					pid: process.pid,
					parentPid: process.ppid,
					cwd: root,
					command: process.argv,
					startedAt,
					endedAt: new Date().toISOString(),
					exitCode: accepted ? 0 : 1,
					timeoutMs: 120000,
					childProcessGroupCleanup:
						"Owned page, browser and development server closed"
				})
			);
		}
	}
);
