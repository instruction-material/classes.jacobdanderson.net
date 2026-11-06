import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { mkdir } from "node:fs/promises";
import { createRequire } from "node:module";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { test as nodeTest } from "node:test";
import puppeteer from "puppeteer";
import { createServer } from "vite";
import { runAxeInPage } from "../scripts/a11y-axe-runtime.mjs";

const root = fileURLToPath(new URL("../front-end/", import.meta.url));
const schedulerUrl = "https://scheduler.example.com/";
const axeSource = createRequire(import.meta.url).resolve("axe-core/axe.min.js");

nodeTest(
	"embedded booking preserves Classes navigation, sizing and theme",
	{ timeout: 120000 },
	async () => {
		let browser;
		let server;
		const previousDirectory = process.cwd();
		const startedAt = new Date().toISOString();
		const taskId =
			process.env.CLASSES_FAMILY_TASK_ID ?? "signup-browser-ci";
		console.log(
			JSON.stringify({
				event: "start",
				taskId,
				cwd: root,
				command: "signup-browser",
				pid: process.pid,
				startedAt,
				timeoutMs: 120000
			})
		);
		try {
			process.chdir(root);
			server = await createServer({
				root,
				server: { host: "127.0.0.1", port: 0, strictPort: true }
			});
			await server.listen();
			const origin = `http://127.0.0.1:${server.httpServer.address().port}`;
			const executablePath = [
				process.env.PUPPETEER_EXECUTABLE_PATH,
				await puppeteer.executablePath(),
				"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
				"/usr/bin/google-chrome",
				"/usr/bin/chromium"
			].find(value => value && existsSync(value));
			assert.ok(
				executablePath,
				"Chrome is required for the booking browser test"
			);
			browser = await puppeteer.launch({
				executablePath,
				headless: true,
				args: ["--no-sandbox"]
			});
			const page = await browser.newPage();
			await page.emulateMediaFeatures([
				{ name: "prefers-color-scheme", value: "light" },
				{ name: "prefers-reduced-motion", value: "reduce" }
			]);
			try {
				const schedulerRequests = [];
				await page.setCacheEnabled(false);
				await page.setRequestInterception(true);
				page.on("request", request => {
					const url = new URL(request.url());
					if (url.origin === new URL(schedulerUrl).origin) {
						schedulerRequests.push({
							url: request.url(),
							mainFrame: request.frame() === page.mainFrame(),
							navigation: request.isNavigationRequest()
						});
						const title =
							url.pathname === "/portal"
								? "Manage bookings fixture"
								: "Calendar fixture";
						void request.respond({
							status: 200,
							contentType: "text/html",
							body: `<!doctype html><html lang="en"><head><title>${title}</title>
<style>body{margin:0;padding:16px;font:16px Arial;color:#102235;background:#f3f7fb}html.dark body{color:#f4f8ff;background:#0a1525}main{min-height:1280px}button{padding:12px}</style></head>
<body><main><h1>${title}</h1><button id="grow">Show booking details</button></main>
<script>
function resize(){ parent.postMessage({source:"scheduler.example.com",type:"scheduler:resize",height:document.documentElement.scrollHeight}, "${origin}"); }
window.addEventListener("message",event=>{ if(event.source!==parent || event.origin!=="${origin}") return; if(event.data.type==="scheduler:theme"){ document.documentElement.classList.toggle("dark",event.data.theme==="dark"); resize(); }});
document.getElementById("grow").onclick=()=>{document.querySelector("main").style.minHeight="1640px";resize();};
new ResizeObserver(resize).observe(document.querySelector("main"));
resize();</script></body></html>`
						});
					} else if (
						url.origin !== origin ||
						url.pathname.startsWith("/api/")
					) {
						// Isolate every production API/analytics request; never create bookings.
						void request.respond({
							status: 200,
							contentType: "application/json",
							body: "{}"
						});
					} else {
						void request.continue();
					}
				});
				for (const width of [390, 1280]) {
					console.log(`Checking inline booking at ${width}px`);
					await page.setViewport({ width, height: 900 });
					await page.goto(
						`${origin}/signup?redirect=https://example.invalid/&token=do-not-forward`,
						{ waitUntil: "networkidle0" }
					);
					await page.waitForSelector("#app[data-v-app]");
					await page.waitForFunction(
						() =>
							document
								.querySelector(".scheduler-frame")
								?.getBoundingClientRect().height >= 1280
					);
					assert.equal(new URL(page.url()).pathname, "/signup");
					assert.equal(new URL(page.url()).origin, origin);
					assert.ok(await page.$(".site-header .site-nav"));
					const frameUrl = new URL(
						await page.$eval(".scheduler-frame", frame => frame.src)
					);
					assert.equal(frameUrl.origin, new URL(schedulerUrl).origin);
					assert.equal(frameUrl.searchParams.get("embed"), "1");
					assert.deepEqual([...frameUrl.searchParams.keys()].sort(), [
						"embed",
						"theme"
					]);
					assert.ok(
						schedulerRequests
							.filter(request => request.navigation)
							.every(request => !request.mainFrame)
					);
					const box = await page.$eval(".scheduler-frame", frame => {
						const bounds = frame.getBoundingClientRect();
						return {
							width: bounds.width,
							top: bounds.top,
							headerBottom: document
								.querySelector(".site-header")
								.getBoundingClientRect().bottom
						};
					});
					assert.ok(
						box.width >= width - 40,
						"Calendar must use the full page width"
					);
					assert.ok(
						box.top >= box.headerBottom,
						"Calendar must not cover Classes navigation"
					);
					assert.equal(
						await page.evaluate(
							() =>
								document.documentElement.scrollWidth <=
								window.innerWidth
						),
						true
					);
					const child = page
						.frames()
						.find(frame => frame.url() === frameUrl.href);
					assert.ok(child, "Scheduler must remain a child frame");
					await child.click("#grow");
					await page.waitForFunction(
						() =>
							document
								.querySelector(".scheduler-frame")
								.getBoundingClientRect().height >= 1640
					);
					const navigationCount = schedulerRequests.filter(
						request => request.navigation
					).length;
					await page
						.locator('button[aria-label="Switch to dark mode"]')
						.click();
					await page.waitForFunction(() =>
						document.documentElement.classList.contains("dark")
					);
					await child.waitForFunction(() =>
						document.documentElement.classList.contains("dark")
					);
					assert.equal(
						schedulerRequests.filter(request => request.navigation)
							.length,
						navigationCount,
						"Changing theme must preserve an in-progress booking"
					);
					await page.addScriptTag({ path: axeSource });
					const result = await runAxeInPage(page);
					assert.deepEqual(
						result.violations,
						[],
						`Booking accessibility at ${width}px`
					);
					if (process.env.BOOKING_SCREENSHOT_DIR) {
						await page.evaluate(() => window.scrollTo(0, 0));
						const directory = join(
							previousDirectory,
							process.env.BOOKING_SCREENSHOT_DIR
						);
						await mkdir(directory, { recursive: true });
						await page.screenshot({
							path: join(directory, `signup-${width}.png`),
							fullPage: false
						});
					}
					await page.locator(".scheduler-toolbar button").click();
					await page.waitForFunction(
						() =>
							new URL(
								document.querySelector(".scheduler-frame").src
							).pathname === "/portal"
					);
					assert.equal(new URL(page.url()).pathname, "/signup");
					await page.locator(".scheduler-toolbar button").click();
					await page.waitForFunction(
						() =>
							new URL(
								document.querySelector(".scheduler-frame").src
							).pathname === "/"
					);
					if (width < 1200) await page.click(".site-toggler");
					await page.waitForSelector(
						'.site-header a[href="/about"]',
						{ visible: true }
					);
					// Header links use the client router. Check the resulting route
					// and rendered content rather than waiting for a document reload.
					await page.locator('.site-header a[href="/about"]').click();
					await page.waitForFunction(
						() =>
							location.pathname === "/about" &&
							Boolean(document.querySelector(".about-page"))
					);
					assert.equal(new URL(page.url()).pathname, "/about");
					assert.equal(new URL(page.url()).origin, origin);
					assert.equal(await page.$(".scheduler-frame"), null);
					await page.goBack({ waitUntil: "domcontentloaded" });
					await page.waitForFunction(
						() =>
							location.pathname === "/signup" &&
							document
								.querySelector(".scheduler-frame")
								?.getBoundingClientRect().height >= 1280
					);
					assert.equal(new URL(page.url()).pathname, "/signup");
					assert.ok(await page.$(".scheduler-frame"));
					// Return to light before the next viewport's theme test.
					await page
						.locator('button[aria-label="Switch to light mode"]')
						.click();
				}
			} catch (error) {
				console.error(
					await page.evaluate(() => ({
						url: location.href,
						width: window.innerWidth,
						theme: document.documentElement.className,
						frameHeight:
							document.querySelector(".scheduler-frame")?.style
								.height,
						status: document.querySelector(".scheduler-status")
							?.textContent
					}))
				);
				for (const frame of page
					.frames()
					.filter(frame => frame !== page.mainFrame())) {
					console.error(
						await frame
							.evaluate(() => ({
								heading:
									document.querySelector("h1")?.textContent,
								contentHeight:
									document.documentElement.scrollHeight
							}))
							.catch(() => "Frame unavailable")
					);
				}
				throw error;
			} finally {
				await page.close();
			}
		} finally {
			if (browser) await browser.close();
			if (server) await server.close();
			process.chdir(previousDirectory);
			console.log(
				JSON.stringify({
					event: "cleanup",
					taskId,
					pid: process.pid,
					startedAt,
					endedAt: new Date().toISOString()
				})
			);
		}
	}
);
