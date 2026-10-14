import assert from "node:assert/strict";
import { Buffer } from "node:buffer";
import { createHash } from "node:crypto";
import { existsSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
// eslint-disable-next-line test/no-import-node-test -- Native browser CI runner.
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { strFromU8, unzipSync } from "fflate";
import puppeteer from "puppeteer";
import { preview } from "vite";
import {
	confirmProjectImport,
	downloadProjectZip
} from "./ide-workspace-controls.mjs";

const fixtures = JSON.parse(
	await readFile(
		new URL("./fixtures/linux-owned-labs-contracts.json", import.meta.url),
		"utf8"
	)
);
const definitions = {
	"LS-13-unit-6-services-and-systemd-supplemental-2": ["unit-6-services-and-systemd", "systemd-service-transfer-practice", null],
	"LS-14-unit-6-services-and-systemd-supplemental-3": ["unit-6-services-and-systemd", "systemd-service-extension-practice", null],
	"LS5-Systemd-Toy-Service": [
		"unit-6-services-and-systemd",
		"project-create-a-systemd-service-for-a-toy-app",
		"services-and-systemd"
	],
	"LS4-Apache-Virtual-Host-Compare": [
		"unit-11-web-servers",
		"project-configure-an-apache-virtual-host-and-compare-it-to-nginx",
		null
	],
	"LS3-Nginx-Reverse-Proxy-App": [
		"unit-11-web-servers",
		"project-run-a-small-app-behind-nginx",
		"web-servers"
	],
	"LS1-Personal-Lab-VM": [
		"ls0-setup-and-tooling",
		"project-provision-a-personal-linux-lab-vm",
		"setup-and-tooling"
	],
	"LS-05-unit-1-shell-foundations": [
		"unit-1-shell-foundations",
		"core-project-shell-foundations",
		"shell-foundations"
	],
	"LS2-Static-Site-from-srv": [
		"unit-2-filesystem-hierarchy-and-directory-purpose",
		"project-deploy-a-static-site-from-srv",
		"filesystem-hierarchy-and-directory-purpose"
	],
	"LS-06-unit-3-users-groups-and-permissions": [
		"unit-3-users-groups-and-permissions",
		"core-project-users-groups-and-permissions",
		"users-groups-and-permissions"
	],
	"LS6-Backup-Cron-and-Timer": [
		"unit-8-scheduling-and-automation",
		"project-write-a-backup-script-and-schedule-it-with-cron-and-a-timer",
		"scheduling-and-automation"
	]
};
const storageKey = "classes-python-ide-projects:anonymous";
const legacy = {
	_id: "earlier-linux",
	title: "Earlier attempt",
	mode: "python",
	files: [{ name: "main.py", content: "# preserved work\n" }],
	activeFileName: "main.py",
	courseID: "linux-systems",
	courseProjectKey: "linux-systems:earlier:starter",
	createdAt: "2026-10-01T12:00:00.000Z",
	updatedAt: "2026-10-01T12:00:00.000Z"
};
const digest = value => createHash("sha256").update(value).digest("hex");

test(
	"Linux confirmed imports, exact role exports, saved edits and shared notebook attempts",
	{ timeout: 600_000 },
	async () => {
		let server, browser, context, page;
		const output
			= process.env.LINUX_BROWSER_EXPORT_PROOF_DIR
				?? "output/linux-exports";
		await mkdir(output, { recursive: true });
		const proof = [];
		const courseButtons = [];
		let fixture = fixtures[0];
		let sourceRequests = [];
		let catalog = false;
		try {
			server = await preview({
				root: fileURLToPath(new URL("../front-end/", import.meta.url)),
				preview: { host: "127.0.0.1", port: 0, strictPort: true }
			});
			const origin = server.resolvedUrls.local[0].replace(/\/$/, "");
			const executablePath = [
				process.env.PUPPETEER_EXECUTABLE_PATH,
				puppeteer.executablePath(),
				"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
				"/usr/bin/google-chrome",
				"/usr/bin/chromium"
			].find(path => path && existsSync(path));
			assert.ok(executablePath, "Use an existing Chrome installation");
			browser = await puppeteer.launch({
				executablePath,
				headless: true,
				args: ["--no-sandbox"]
			});
			context = await browser.createBrowserContext();
			page = await context.newPage();
			await page.evaluateOnNewDocument(
				(key, earlier) => {
					if (localStorage.getItem(key) === null)
						localStorage.setItem(key, JSON.stringify([earlier]));
					const create = URL.createObjectURL;
					URL.createObjectURL = (blob) => {
						if (blob.type === "application/zip")
							window.__linuxArchive = blob;
						return create(blob);
					};
					const click = HTMLAnchorElement.prototype.click;
					HTMLAnchorElement.prototype.click = function () {
						if (
							this.download.endsWith(".zip")
							&& this.href.startsWith("blob:")
						) {
							return;
						}
						return click.call(this);
					};
				},
				storageKey,
				legacy
			);
			await page.setRequestInterception(true);
			page.on("request", (request) => {
				const url = new URL(request.url());
				if (url.hostname === "raw.githubusercontent.com") {
					const prefix = `/instruction-material/Linux-Systems/${fixture.revision}/${fixture.pack}/`;
					const name = decodeURIComponent(
						url.pathname.slice(prefix.length)
					);
					sourceRequests.push(name);
					const file = url.pathname.startsWith(prefix)
						? fixture.files[name]
						: null;
					void request.respond({
						status: file ? 200 : 404,
						contentType: "text/plain",
						headers: { "access-control-allow-origin": "*" },
						body: file?.content ?? "Unknown source"
					});
				}
				else if (
					url.origin !== origin
					|| url.pathname.startsWith("/api/")
				) {
					let body = {};
					if (catalog && url.pathname === "/api/accounts/me")
						body = { userID: "linux-learner" };
					if (catalog && url.pathname === "/api/users/loggedin") {
						body = {
							currentUser: {
								_id: "linux-learner",
								name: "Learner fixture",
								email: "learner@example.invalid",
								age: 14,
								state: "GA",
								courseAccess: ["linux-systems"],
								courseProgress: []
							}
						};
					}
					void request.respond({
						status: 200,
						contentType: "application/json",
						body: JSON.stringify(body)
					});
				}
				else {
					void request.continue();
				}
			});
			const savedFor = async key =>
				page.evaluate(
					(storage, k) =>
						JSON.parse(localStorage.getItem(storage) ?? "[]").find(
							p => p.courseProjectKey === k
						),
					storageKey,
					key
				);
			const waitSaved = async key =>
				page.waitForFunction(
					(storage, k) =>
						JSON.parse(localStorage.getItem(storage) ?? "[]").some(
							p => p.courseProjectKey === k
						),
					{},
					storageKey,
					key
				);
			const captureArchive = async () => {
				await downloadProjectZip(page);
				return Buffer.from(
					await page.evaluate(async () =>
						btoa(
							Array.from(
								new Uint8Array(
									await window.__linuxArchive.arrayBuffer()
								),
								byte => String.fromCharCode(byte)
							).join("")
						)
					),
					"base64"
				);
			};
			for (const current of fixtures) {
				fixture = current;
				const [module, core] = definitions[fixture.pack];
				const moduleID = `linux-systems-${module}`;
				const placement = ["LS-13-unit-6-services-and-systemd-supplemental-2", "LS-14-unit-6-services-and-systemd-supplemental-3"].includes(fixture.pack) ? "supplemental" : "curriculum";
				const itemID = `${moduleID}-${placement}-${core}`;
				for (const width of [1280, 360]) {
					for (const theme of ["light", "dark"]) {
						for (const role of ["starter", "solution"]) {
							await page.setViewport({ width, height: 900 });
							await page.emulateMediaFeatures([
								{ name: "prefers-color-scheme", value: theme }
							]);
							const key = `linux-systems:${fixture.pack}-${width}-${theme}:${role === "starter" ? "starter" : "reference"}:native-linux`;
							const lesson = `${moduleID}-${itemID}`;
							const params = new URLSearchParams({
								course: "linux-systems",
								mode: "linux",
								projectKey: key,
								lesson,
								starterUrl: `https://github.com/instruction-material/Linux-Systems/tree/${fixture.revision}/${fixture.pack}/${role}`,
								starterTitle: fixture.pack
							});
							sourceRequests = [];
							await page.goto(`${origin}/ide?${params}`, {
								waitUntil: "domcontentloaded"
							});
							await page.waitForSelector(
								"[data-testid='ide-route-import-confirm']"
							);
							assert.equal(sourceRequests.length, 0);
							await page.keyboard.press("Escape");
							assert.equal(sourceRequests.length, 0);
							await page.goto(`${origin}/ide?${params}`, {
								waitUntil: "domcontentloaded"
							});
							await confirmProjectImport(page);
							await waitSaved(key);
							const saved = await savedFor(key);
							const expected = Object.keys(fixture.files)
								.filter(
									name =>
										name === "README.md"
										|| name.startsWith(`${role}/`)
								)
								.sort();
							assert.deepEqual(
								saved.files.map(f => f.name).sort(),
								expected
							);
							assert.equal(
								sourceRequests.length,
								expected.length
							);
							assert.equal(saved.mode, "linux");
							assert.equal(
								saved.activeFileName,
								fixture.pack === "LS-13-unit-6-services-and-systemd-supplemental-2"
									? `${role}/linux-service-transfer.service`
									: fixture.pack === "LS-14-unit-6-services-and-systemd-supplemental-3"
										? `${role}/20-lab-settings.conf`
										: saved.files.find(
											f =>
												f.name.endsWith(".sh")
												|| f.name.endsWith(".py")
												|| f.name.endsWith(".conf")
										).name
							);
							if (width < 900) {
								await page
									.locator(
										".mobile-view-picker button[data-view='code']"
									)
									.click();
							}
							await page.waitForSelector(".cm-content", {
								visible: true
							});
							assert.equal(
								await page.$(
									".mobile-view-picker button[data-view='canvas']"
								),
								null
							);
							await page.waitForSelector(
								"button.run-control:not([disabled])"
							);
							assert.equal(
								await page.$eval("button.run-control", b =>
									b.textContent.trim()),
								"Linux instructions"
							);
							await page.locator("button.run-control").click();
							await page.waitForFunction(() =>
								[
									...document.querySelectorAll(".output-line")
								].some(line =>
									line.textContent.includes(
										"Read ../README.md"
									)
								)
							);
							assert.equal(
								await page.$(
									"iframe[title='Isolated Python output']"
								),
								null
							);
							const bytes = await captureArchive();
							const entries = unzipSync(bytes);
							assert.equal(
								Object.keys(entries).length,
								expected.length
							);
							for (const file of saved.files) {
								assert.equal(
									file.content,
									fixture.files[file.name].content
								);
								const path = Object.keys(entries).find(path =>
									path.endsWith(`/${file.name}`)
								);
								assert.ok(path);
								assert.equal(
									digest(entries[path]),
									fixture.files[file.name].sha256
								);
							}
							if (width === 1280 && theme === "light") {
								await writeFile(
									join(output, `${fixture.pack}-${role}.zip`),
									bytes
								);
							}
							if (width < 900) {
								await page
									.locator(
										".mobile-view-picker button[data-view='code']"
									)
									.click();
							}
							await page.focus(".cm-content");
							const modifier = await page.evaluate(() =>
								/Mac/.test(navigator.platform)
									? "Meta"
									: "Control"
							);
							const edit = `${
								saved.files.find(
									f => f.name === saved.activeFileName
								).content
							}\n# independent Linux observation\n`;
							await page.keyboard.down(modifier);
							await page.keyboard.press("a");
							await page.keyboard.up(modifier);
							await page.keyboard.sendCharacter(edit);
							await page.keyboard.down(modifier);
							await page.keyboard.press("s");
							await page.keyboard.up(modifier);
							await page.waitForFunction(
								(storage, k) =>
									JSON.parse(localStorage.getItem(storage))
										.find(p => p.courseProjectKey === k)
										?.files
										.some(f =>
											f.content.includes(
												"# independent Linux observation"
											)
										),
								{},
								storageKey,
								key
							);
							const edited = await savedFor(key);
							await page.reload({
								waitUntil: "domcontentloaded"
							});
							await page.waitForSelector(".cm-content");
							assert.deepEqual(
								(await savedFor(key)).files,
								edited.files
							);
							const editedEntries = unzipSync(
								await captureArchive()
							);
							for (const file of edited.files) {
								assert.equal(
									strFromU8(
										editedEntries[
											Object.keys(editedEntries).find(
												path =>
													path.endsWith(
														`/${file.name}`
													)
											)
										]
									),
									file.content
								);
							}
							assert.deepEqual(
								await page.evaluate(
									(storage, id) =>
										JSON.parse(
											localStorage.getItem(storage)
										).find(p => p._id === id),
									storageKey,
									legacy._id
								),
								legacy
							);
							const href = await page.$eval(
								"a[href^='/courses#']",
								a => a.getAttribute("href")
							);
							assert.equal(href, `/courses#${lesson}`);
							if (
								fixture.pack
								=== "LS-05-unit-1-shell-foundations"
								&& role === "starter"
							) {
								await page.screenshot({
									path: join(
										output,
										`linux-shell-${width}-${theme}.png`
									),
									fullPage: false
								});
							}
							if (["LS-13-unit-6-services-and-systemd-supplemental-2", "LS-14-unit-6-services-and-systemd-supplemental-3"].includes(fixture.pack)) {
								await page.screenshot({ path: join(output, `linux-${fixture.pack.includes("supplemental-2") ? "transfer" : "extension"}-${role}-${width}-${theme}.png`), fullPage: false });
							}
							proof.push({
								pack: fixture.pack,
								role,
								width,
								theme,
								exactImport: true,
								exactArchive: true,
								editedSaveReload: true,
								lessonReturn: true,
								consentBeforeFetch: true
							});
							if (fixture.pack === "LS4-Apache-Virtual-Host-Compare") {
								await page.screenshot({
									path: join(output, `linux-apache-${role}-${width}-${theme}.png`),
									fullPage: false
								});
							}
							if (fixture.pack === "LS5-Systemd-Toy-Service") {
								await page.screenshot({
									path: join(output, `linux-systemd-${role}-${width}-${theme}.png`),
									fullPage: false
								});
							}
						}
					}
				}
				await page.setViewport({ width: 1280, height: 900 });
				const [, , notebook] = definitions[fixture.pack];
				const notebookID = `${moduleID}-supplemental-troubleshooting-notebook-${notebook}`;
				const coreKey = `linux-systems:${itemID}:starter:native-linux`;
				let original;
				for (const [id, reuse] of [
					[itemID, false],
					...(notebook ? [[notebookID, true]] : [])
				]) {
					catalog = true;
					sourceRequests = [];
					await page.goto(`${origin}/courses#${moduleID}`, {
						waitUntil: "domcontentloaded"
					});
					await page.waitForSelector(".lesson-view-toggle button");
					let href;
					for (const position of [1, 2, 3]) {
						await page
							.locator(
								`.lesson-view-toggle button:nth-child(${position})`
							)
							.click();
						const card = `#${moduleID}-${id}`;
						if (!(await page.$(card))) continue;
						href = await page.$eval(card, element =>
							[...element.querySelectorAll("a")]
								.find(
									a =>
										a.href.includes("starterUrl=")
										&& new URL(a.href).searchParams.get("starterUrl").endsWith("/starter")
								)
								?.getAttribute("href"));
						if (href) break;
					}
					assert.ok(
						href,
						"The actual lesson must provide an IDE action"
					);
					assert.equal(
						new URL(href, origin).searchParams.get("projectKey"),
						coreKey
					);
					assert.equal(sourceRequests.length, 0);
					if (!reuse) {
						const card = `#${moduleID}-${id}`;
						await page.$eval(card, element =>
							element.scrollIntoView({ block: "start" }));
						await page.waitForSelector(`${card} pre code`);
						assert.ok(
							await page.$(`${card} pre code`),
							"The course renders runnable commands as code blocks"
						);
					}
					catalog = false;
					await page
						.locator(`a[href=${JSON.stringify(href)}]`)
						.click();
					if (!reuse) {
						await confirmProjectImport(page);
						await waitSaved(coreKey);
						original = await savedFor(coreKey);
					}
					else {
						await page.waitForSelector(".cm-content");
						assert.equal(sourceRequests.length, 0);
						assert.equal(
							(await savedFor(coreKey))._id,
							original._id
						);
					}
					courseButtons.push({
						pack: fixture.pack,
						item: id,
						coreKey,
						actualAction: true,
						reusesExistingAttempt: reuse
					});
				}
			}

			catalog = false;
			sourceRequests = [];
			await page.goto(`${origin}/ide?mode=linux&template=demo`, {
				waitUntil: "domcontentloaded"
			});
			await confirmProjectImport(page);
			await waitSaved("ide-template:linux:demo");
			const defaultWorkspace = await savedFor("ide-template:linux:demo");
			assert.equal(defaultWorkspace.mode, "linux");
			assert.deepEqual(
				defaultWorkspace.files.map(f => f.name),
				["main.sh", "README.md"]
			);
			assert.equal(sourceRequests.length, 0);
			await page.waitForSelector("button.run-control:not([disabled])");
			await page.locator("button.run-control").click();
			await page.waitForFunction(() =>
				[...document.querySelectorAll(".output-line")].some(line =>
					line.textContent.includes("bash main.sh")
				)
			);
			const defaultArchive = await captureArchive();
			const defaultEntries = unzipSync(defaultArchive);
			for (const file of defaultWorkspace.files) {
				assert.equal(
					strFromU8(
						defaultEntries[
							Object.keys(defaultEntries).find(path =>
								path.endsWith(`/${file.name}`)
							)
						]
					),
					file.content
				);
			}
			await writeFile(join(output, "default-linux.zip"), defaultArchive);
			assert.equal(proof.length, 80);
			assert.equal(courseButtons.length, 17);
			await writeFile(
				join(output, "browser-proof.json"),
				JSON.stringify({ profiles: proof, courseButtons }, null, 2)
			);
		}
		catch (error) {
			await writeFile(
				join(output, "browser-partial.json"),
				JSON.stringify(
					{ profiles: proof, courseButtons, error: String(error) },
					null,
					2
				)
			);
			if (page) {
				await page.screenshot({ path: join(output, "failure.png") });
				await writeFile(
					join(output, "failure-state.json"),
					JSON.stringify(
						await page.evaluate(() => ({
							url: location.href,
							body: document.body.textContent.slice(-6000)
						})),
						null,
						2
					)
				);
			}
			throw error;
		}
		finally {
			await page?.close();
			await context?.close();
			await browser?.close();
			if (server)
				await new Promise(resolve => server.httpServer.close(resolve));
		}
	}
);
