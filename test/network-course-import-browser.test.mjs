import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { existsSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import process from "node:process";
// eslint-disable-next-line test/no-import-node-test -- Native browser CI entrypoint.
import { test as nodeTest } from "node:test";
import { fileURLToPath } from "node:url";
import { strFromU8, unzipSync } from "fflate";
import puppeteer from "puppeteer";
import { preview } from "vite";
import { confirmProjectImport, downloadProjectZip } from "./ide-workspace-controls.mjs";

const root = fileURLToPath(new URL("../front-end/", import.meta.url));
const fixtures = JSON.parse(await readFile(new URL("./fixtures/network-foundations-contracts.json", import.meta.url), "utf8"));
const storageKey = "classes-python-ide-projects:anonymous";
const earlier = { _id: "earlier-network-work", title: "Earlier observation", mode: "python", files: [{ name: "main.py", content: "# existing work\n" }], activeFileName: "main.py", courseID: "network-systems", courseProjectKey: "network-systems:earlier:starter", createdAt: "2026-10-01T12:00:00.000Z", updatedAt: "2026-10-01T12:00:00.000Z" };
const digest = value => createHash("sha256").update(value).digest("hex");

async function savedProjects(page) {
	return page.evaluate(key => new Promise((resolve, reject) => {
		const opening = indexedDB.open("classes-python-ide", 1);
		opening.onupgradeneeded = () => { opening.transaction.abort(); reject(new Error("Primary project store is not initialized")); };
		opening.onerror = () => reject(opening.error);
		opening.onsuccess = () => {
			const database = opening.result;
			const transaction = database.transaction("projectStores", "readonly");
			const request = transaction.objectStore("projectStores").get(key);
			let projects;
			request.onsuccess = () => { projects = request.result?.projects; };
			transaction.oncomplete = () => { database.close(); resolve(Array.isArray(projects) ? projects : []); };
			transaction.onerror = transaction.onabort = () => { database.close(); reject(transaction.error ?? new Error("Primary store read failed")); };
		};
	}), storageKey);
}

async function exportedBytes(page) {
	await page.evaluate(() => { delete window.__networkArchive; });
	await downloadProjectZip(page);
	await page.waitForFunction(() => window.__networkArchive instanceof Blob);
	return Uint8Array.from(await page.evaluate(async () => Array.from(new Uint8Array(await window.__networkArchive.arrayBuffer()))));
}

async function courseAction(page, origin, fixture, itemID, role) {
	await page.goto(`${origin}/courses#${fixture.moduleId}`, { waitUntil: "domcontentloaded" });
	await page.waitForSelector(".lesson-view-toggle button");
	const card = `#${fixture.moduleId}-${itemID}`;
	for (const position of [1, 2, 3]) {
		await page.locator(`.lesson-view-toggle button:nth-child(${position})`).click();
		if (!(await page.$(card))) continue;
		const href = await page.$eval(card, (element, selectedRole) => [...element.querySelectorAll("a.is-ide-starter")].find(link => new URL(link.href).searchParams.get("starterUrl")?.endsWith(`/${selectedRole}`))?.getAttribute("href"), role);
		if (href) return { href, card };
	}
	assert.fail(`Missing actual ${role} action for ${itemID}`);
}

nodeTest("Network course buttons, consent, exact role exports, notebook saves and attempt reuse", { timeout: 240000 }, async (t) => {
	let server, browser, context;
	let outcome = "failed";
	const taskId = process.env.CLASSES_FAMILY_TASK_ID ?? "network-foundations-browser-ci";
	const startedAt = new Date().toISOString();
	const output = process.env.NETWORK_BROWSER_EXPORT_PROOF_DIR ?? "output/network-exports";
	const screenshots = process.env.COURSE_IMPORT_SCREENSHOT_DIR;
	const profiles = [];
	const cleanup = async () => {
		if (context) { await context.close().catch(() => {}); context = null; }
		if (browser) { await browser.close(); browser = null; }
		if (server) { await server.close(); server = null; }
	};
	t.signal.addEventListener("abort", () => { void cleanup(); }, { once: true });
	console.log(JSON.stringify({ event: "start", taskId, cwd: root, command: process.argv, pid: process.pid, parentPid: process.ppid, startedAt, timeoutMs: 240000 }));
	try {
		await mkdir(output, { recursive: true });
		if (screenshots) await mkdir(screenshots, { recursive: true });
		server = await preview({ root, preview: { host: "127.0.0.1", port: 0, strictPort: true } });
		const origin = server.resolvedUrls.local[0].replace(/\/$/, "");
		const executablePath = [process.env.PUPPETEER_EXECUTABLE_PATH, puppeteer.executablePath(), "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", "/usr/bin/google-chrome", "/usr/bin/chromium"].find(path => path && existsSync(path));
		assert.ok(executablePath, "An existing Chrome installation is required");
		browser = await puppeteer.launch({ executablePath, headless: true, args: ["--no-sandbox"] });
		for (const fixture of fixtures) for (const width of [390, 1280]) for (const role of ["starter", "solution"]) {
			context = await browser.createBrowserContext();
			const page = await context.newPage();
			let catalog = true;
			let remoteWrites = 0;
			const requests = [];
			const learner = { _id: "network-learner", name: "Learner fixture", email: "learner@example.invalid", age: 14, state: "GA", courseAccess: ["network-systems"], courseProgress: [] };
			const tutor = { _id: "network-tutor", name: "Tutor fixture", email: "tutor@example.invalid", age: 30, state: "GA", usersOfTutorLength: 1, coursePermissions: ["network-systems"], editTutors: false, saveEdit: "Save" };
			try {
				await page.setViewport({ width, height: 900 });
				await page.evaluateOnNewDocument((key, legacy) => {
					if (localStorage.getItem(key) === null) localStorage.setItem(key, JSON.stringify([legacy]));
					const create = URL.createObjectURL;
					URL.createObjectURL = blob => { if (blob.type === "application/zip") window.__networkArchive = blob; return create(blob); };
					const click = HTMLAnchorElement.prototype.click;
					HTMLAnchorElement.prototype.click = function () { if (this.download.endsWith(".zip") && this.href.startsWith("blob:")) return; return click.call(this); };
				}, storageKey, earlier);
				await page.setRequestInterception(true);
				page.on("request", request => {
					const url = new URL(request.url());
					if (url.hostname === "raw.githubusercontent.com") {
						const prefix = `/instruction-material/Network-Systems/${fixture.revision}/${fixture.pack}/`;
						const name = decodeURIComponent(url.pathname.slice(prefix.length));
						const file = url.pathname.startsWith(prefix) && (name === "README.md" || name.startsWith(`${role}/`)) ? fixture.files[name] : null;
						requests.push(name);
						void request.respond({ status: file ? 200 : 404, contentType: "text/plain", headers: { "access-control-allow-origin": "*" }, body: file?.content ?? "Unknown source" });
					} else if (url.origin !== origin || url.pathname.startsWith("/api/")) {
						if (!["GET", "OPTIONS"].includes(request.method())) remoteWrites++;
						let body = {};
						if (catalog && url.pathname === "/api/accounts/me") body = role === "starter" ? { userID: learner._id } : { tutorID: tutor._id };
						if (catalog && url.pathname === "/api/users/loggedin") body = { currentUser: learner };
						if (catalog && url.pathname === "/api/tutors/loggedin") body = { currentTutor: tutor };
						if (catalog && url.pathname === `/api/users/oftutor/${tutor._id}`) body = [learner];
						void request.respond({ status: 200, contentType: "application/json", body: JSON.stringify(body) });
					} else void request.continue();
				});
				const action = await courseAction(page, origin, fixture, fixture.coreItemId, role);
				const params = new URL(action.href, origin).searchParams;
				const key = `network-systems:${fixture.coreItemId}:${role === "starter" ? "starter" : "reference"}:native-network`;
				assert.equal(params.get("projectKey"), key);
				assert.equal(params.get("mode"), "linux");
				assert.equal(params.get("starterUrl"), `https://github.com/instruction-material/Network-Systems/tree/${fixture.revision}/${fixture.pack}/${role}`);
				assert.equal(requests.length, 0);
				catalog = false;
				await page.locator(`a[href=${JSON.stringify(action.href)}]`).click();
				await page.waitForSelector("[data-testid='ide-route-import-confirm']");
				assert.equal(requests.length, 0, "No source fetch precedes import consent");
				assert.equal((await savedProjects(page)).filter(project => project.courseProjectKey === key).length, 0);
				await confirmProjectImport(page);
				await page.waitForSelector("select[aria-label='Active project file']");
				const deadline = Date.now() + 10000;
				let saved;
				while (Date.now() < deadline) { saved = (await savedProjects(page)).find(project => project.courseProjectKey === key); if (saved) break; await new Promise(resolve => setTimeout(resolve, 50)); }
				assert.ok(saved, "The primary store contains the imported project");
				assert.equal(saved.mode, "linux");
				assert.equal(saved.activeFileName, `${role}/network-notes.md`);
				assert.deepEqual(saved.files.map(file => file.name).sort(), ["README.md", `${role}/main.py`, `${role}/network_lab.py`, `${role}/network-notes.md`].sort());
				assert.deepEqual([...requests].sort(), saved.files.map(file => file.name).sort());
				const exact = await exportedBytes(page);
				const entries = unzipSync(exact);
				assert.equal(Object.keys(entries).length, 4);
				for (const file of saved.files) {
					assert.equal(digest(file.content), fixture.files[file.name].sha256);
					const member = Object.keys(entries).find(name => name.endsWith(`/${file.name}`));
					assert.ok(member);
					assert.equal(strFromU8(entries[member]), file.content);
				}
				const name = `${fixture.pack}-${role}-${width}`;
				await writeFile(join(output, `${name}-exact.zip`), exact);
				await page.click("button.run-control:not([disabled])");
				await page.waitForFunction(() => document.querySelector(".output-panel")?.textContent.includes("python3 main.py"));
				const instructions = await page.$eval(".output-panel", element => element.textContent);
				assert.ok(instructions.includes("Python programming is optional"));
				assert.ok(!/bash main\.sh|Hello, Linux/.test(instructions));
				if (width < 900) await page.locator(".mobile-view-picker button[data-view='code']").click();
				await page.waitForSelector(".cm-content", { visible: true });
				await page.focus(".cm-content");
				const modifier = await page.evaluate(() => /Mac/.test(navigator.platform) ? "Meta" : "Control");
				const changed = `${saved.files.find(file => file.name === saved.activeFileName).content}\nIndependent network observation ${width}\n`;
				await page.keyboard.down(modifier); await page.keyboard.press("a"); await page.keyboard.up(modifier);
				await page.keyboard.sendCharacter(changed);
				await page.keyboard.down(modifier); await page.keyboard.press("s"); await page.keyboard.up(modifier);
				const editDeadline = Date.now() + 10000;
				let edited;
				while (Date.now() < editDeadline) { edited = (await savedProjects(page)).find(project => project.courseProjectKey === key); if (edited?.files.some(file => file.content === changed)) break; await new Promise(resolve => setTimeout(resolve, 50)); }
				assert.ok(edited.files.some(file => file.content === changed));
				await page.reload({ waitUntil: "domcontentloaded" });
				await page.waitForSelector(".cm-content");
				assert.equal(await page.$("[data-testid='ide-route-import-confirm']"), null);
				assert.deepEqual((await savedProjects(page)).find(project => project.courseProjectKey === key).files, edited.files);
				const editedBytes = await exportedBytes(page);
				const editedEntries = unzipSync(editedBytes);
				for (const file of edited.files) assert.equal(strFromU8(editedEntries[Object.keys(editedEntries).find(path => path.endsWith(`/${file.name}`))]), file.content);
				await writeFile(join(output, `${name}-edited.zip`), editedBytes);
				catalog = true;
				const notebook = await courseAction(page, origin, fixture, fixture.notebookItemId, role);
				assert.equal(new URL(notebook.href, origin).searchParams.get("projectKey"), key);
				catalog = false;
				const beforeReuse = requests.length;
				await page.locator(`a[href=${JSON.stringify(notebook.href)}]`).click();
				await page.waitForSelector(".cm-content");
				assert.equal(await page.$("[data-testid='ide-route-import-confirm']"), null);
				assert.equal(requests.length, beforeReuse);
				const projects = await savedProjects(page);
				const reused = projects.find(project => project.courseProjectKey === key);
				assert.equal(reused._id, edited._id);
				assert.deepEqual(reused.files, edited.files);
				const previous = projects.find(project => project._id === earlier._id);
				assert.ok(previous);
				assert.deepEqual(Object.fromEntries(Object.keys(earlier).map(key => [key, previous[key]])), earlier);
				assert.equal(projects.filter(project => project.courseProjectKey === key).length, 1);
				assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
				assert.equal(remoteWrites, 0);
				if (screenshots) await page.screenshot({ path: join(screenshots, `course-import-network-${name}.png`), fullPage: true });
				profiles.push({ pack: fixture.pack, revision: fixture.revision, role, width, key, consentBeforeFetch: true, sourceFiles: saved.files.map(file => ({ name: file.name, sha256: digest(file.content) })), exactArchive: `${name}-exact.zip`, exactArchiveSha256: digest(exact), editedArchive: `${name}-edited.zip`, editedArchiveSha256: digest(editedBytes), savedProjectID: edited._id, primaryStoreRead: true, savedEditReopened: true, notebookReusedSameAttempt: true, previousWorkPreserved: true, nativeInstructions: true, remoteWrites });
			} finally {
				await page.close();
				await context.close();
				context = null;
			}
		}
		assert.equal(profiles.length, 8);
		await writeFile(join(output, "network-browser-proof.json"), JSON.stringify({ profiles }, null, 2) + "\n");
		outcome = "passed";
	} finally {
		await cleanup();
		console.log(JSON.stringify({ event: "end", taskId, cwd: root, command: process.argv, pid: process.pid, parentPid: process.ppid, startedAt, endedAt: new Date().toISOString(), exitCode: outcome === "passed" ? 0 : 1, timeoutMs: 240000, childProcessGroupCleanup: "pages, contexts, browser and owned preview server closed" }));
	}
});
