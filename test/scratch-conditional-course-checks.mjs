import assert from "node:assert/strict";
import { mkdir } from "node:fs/promises";
import { join } from "node:path";
import process from "node:process";

export function scratchCourseAccount(path, role) {
	if (!role) return {};
	const user = { _id: "scratch-course-fixture", name: "Course fixture", email: "course@example.invalid", age: 14, state: "GA", courseAccess: ["scratch-level-1", "scratch-level-1-classroom"], courseProgress: [] };
	if (path === "/api/accounts/me") return role === "instructor" ? { tutorID: "scratch-tutor-fixture" } : { userID: user._id };
	if (path === "/api/users/loggedin" && role === "learner") return { currentUser: user };
	if (path === "/api/tutors/loggedin" && role === "instructor") return { currentTutor: { _id: "scratch-tutor-fixture", name: "Course fixture", email: "course@example.invalid", age: 30, state: "GA", usersOfTutorLength: 1, coursePermissions: ["scratch-level-1", "scratch-level-1-classroom"] } };
	if (path === "/api/users/oftutor/scratch-tutor-fixture") return [user];
	return {};
}

async function readLesson(page, title, required) {
	await page.waitForFunction(title => [...document.querySelectorAll(".lesson-item")].some(item => item.querySelector("h5")?.textContent.includes(title)), {}, title);
	await page.$$eval(".lesson-item", (items, title) => items.find(item => item.querySelector("h5")?.textContent.includes(title)).scrollIntoView(), title);
	await page.waitForFunction(({ title, required }) => {
		const item = [...document.querySelectorAll(".lesson-item")].find(item => item.querySelector("h5")?.textContent.includes(title));
		return !!item && [...item.querySelectorAll(".item-content-markdown")].some(section => section.textContent.includes(required));
	}, {}, { title, required });
	return page.$$eval(".lesson-item", (items, title) => items.find(item => item.querySelector("h5")?.textContent.includes(title)).textContent.replace(/\s+/g, " "), title);
}

export async function checkScratchConditionalCourse(page, origin, setRole) {
	for (const role of ["learner", "instructor"]) {
		setRole(role);
		for (const width of [390, 1280]) {
			await page.setViewport({ width, height: 900 });
			// Returning to another course anchor can reuse the previous document.
			// Start a fresh document so each fixture bootstraps its own account.
			await page.goto("about:blank");
			const [accountResponse] = await Promise.all([
				page.waitForResponse(response => response.request().method() === "GET" && new URL(response.url()).pathname === "/api/accounts/me"),
				page.goto(`${origin}/courses#scratch-level-1-gs5-basic-conditionals`, { waitUntil: "networkidle2" })
			]);
			assert.equal(accountResponse.status(), 200);
			await page.waitForFunction(role => document.querySelector(".site-nav__badge")?.textContent.trim() === (role === "instructor" ? "Tutor" : "Student"), {}, role);
			await page.waitForSelector(".lesson-view-toggle button");
			await page.click(".lesson-view-toggle button:nth-child(3)");
			const colors = await readLesson(page, "Dino's Colors: Sampling and Boundary Decisions", "swap roles");
			assert.match(colors, /eyedropper/);
			assert.match(colors, /last matching check wins/);
			assert.match(colors, /grey, blue, yellow, red/);
			const sounds = await readLesson(page, "Noisy Reactions: Conditions and Sound Order", "message broadcasting module");
			assert.match(sounds, /different Thunder Storm recordings/);
			assert.match(sounds, /wait until not touching Ball\?/);
			assert.match(sounds, /go to Cloud/);
			await page.click(".lesson-view-toggle button:nth-child(2)");
			const timing = await readLesson(page, "Concurrent Lightning Strike Challenge", "completion gate for returning");
			assert.match(timing, /both motion and sound finish/);
			assert.match(timing, /two separate loops/);
			assert.equal(await page.$$eval(".lesson-item", items => items.find(item => item.querySelector("h5")?.textContent.includes("Concurrent Lightning Strike Challenge"))?.querySelectorAll("pre").length), 2, "Both block stacks render with their nesting");
			assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
			if (process.env.SCRATCH_SCREENSHOT_DIR) {
				await mkdir(process.env.SCRATCH_SCREENSHOT_DIR, { recursive: true });
				await page.screenshot({ path: join(process.env.SCRATCH_SCREENSHOT_DIR, `scratch-conditionals-${role}-${width}.png`), fullPage: true });
			}
			await page.click(".lesson-view-toggle button:nth-child(1)");
			for (const id of [291223299, 291542721])
				await page.waitForSelector(`a[href='https://scratch.mit.edu/projects/${id}/']`);
			const references = await page.$$eval("a", links => links.map(link => link.href).filter(href => /scratch\.mit\.edu\/projects\/(?:291220849|291530292)\//.test(href)));
			assert.equal(references.length, role === "instructor" ? 2 : 0);
			console.log(`Scratch conditional guidance, optional timing and source roles verified: ${role} at ${width}px`);
			await page.goto("about:blank");
			await page.goto(`${origin}/courses#scratch-level-1-gs9-variables`, { waitUntil: "networkidle2" });
			await page.waitForSelector(".lesson-view-toggle button");
			await page.click(".lesson-view-toggle button:nth-child(3)");
			const hammer = await readLesson(page, "Spider Smash: Debugging Pitfalls", "initialization order belongs in one controller");
			for (const required of ["else switch costume to [resting costume]", "wait until not mouse down?", "does not mean the pointer is moving downward", "For all sprites", "set Time Left to 60 broadcast [round ready]", "wait 1 seconds change Time Left by -1", "Time Left > 0", "must not sit in the pointer loop", "Score must not increase after the timer ends"])
				assert.ok(hammer.includes(required), required);
			assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
			if (process.env.SCRATCH_SCREENSHOT_DIR) {
				const card = await page.evaluateHandle(() => [...document.querySelectorAll(".lesson-item")].find(item => item.querySelector("h5")?.textContent.includes("Spider Smash: Debugging Pitfalls")));
				await card.asElement().screenshot({ path: join(process.env.SCRATCH_SCREENSHOT_DIR, `scratch-conditionals-hammer-${role}-${width}.png`) });
			}
			console.log(JSON.stringify({ event: "verified-scratch-hammer-guidance", role, width, falseBranchAndReleaseGate: true, sharedTimerAndOrderedReset: true }));
			const speed = await readLesson(page, "Speed Click: Debugging Pitfalls", "Keep scoring inactive during the published Ready/Set/Go sequence");
			for (const required of ["Time Left > 0", "not (Time Left = 0)", "Round Running", "initialization outside the countdown loop", "a deliberately set -1", "restart twice"])
				assert.ok(speed.includes(required), required);
			assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
			if (process.env.SCRATCH_SCREENSHOT_DIR) {
				const card = await page.evaluateHandle(() => [...document.querySelectorAll(".lesson-item")].find(item => item.querySelector("h5")?.textContent.includes("Speed Click: Debugging Pitfalls")));
				await card.asElement().screenshot({ path: join(process.env.SCRATCH_SCREENSHOT_DIR, `scratch-conditionals-speed-click-${role}-${width}.png`) });
				await card.dispose();
			}
			console.log(JSON.stringify({ event: "verified-scratch-speed-click-guidance", role, width, preRoundAndExpiredClicksRejected: true, resetAndCountdownSeparated: true }));
			await page.goto("about:blank");
			await page.goto(`${origin}/courses#scratch-level-1-gs3-pen-with-event-listeners`, { waitUntil: "networkidle2" });
			await page.waitForSelector(".lesson-view-toggle button");
			await page.click(".lesson-view-toggle button:nth-child(2)");
			const independent = await readLesson(page, "Open-Ended Variant: Pen with Event Listeners", "open an empty Scratch project");
			assert.match(independent, /Download the working \.sb3 file/);
			assert.match(independent, /Open \.sb3/);
			const independentLink = await page.$$eval(".lesson-item", (items) => {
				const card = items.find(item => item.querySelector("h5")?.textContent.includes("Open-Ended Variant: Pen with Event Listeners"));
				return [...card.querySelectorAll("a[href]")].find(link => link.textContent.includes("open an empty Scratch project"))?.href;
			});
			const independentUrl = new URL(independentLink);
			assert.equal(independentUrl.origin, new URL(origin).origin);
			assert.equal(independentUrl.pathname, "/ide");
			assert.equal(independentUrl.searchParams.get("mode"), "scratch");
			assert.equal(independentUrl.searchParams.get("starter"), "blank");
			assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
			if (process.env.SCRATCH_SCREENSHOT_DIR) {
				const card = await page.evaluateHandle(() => [...document.querySelectorAll(".lesson-item")].find(item => item.querySelector("h5")?.textContent.includes("Open-Ended Variant: Pen with Event Listeners")));
				await card.asElement().screenshot({ path: join(process.env.SCRATCH_SCREENSHOT_DIR, `scratch-conditionals-independent-link-${role}-${width}.png`) });
				await card.dispose();
			}
			console.log(JSON.stringify({ event: "verified-scratch-independent-link", role, width, sameOriginBlankStarter: true, downloadAndReopenInstructions: true }));
			await page.goto("about:blank");
			await page.goto(`${origin}/courses#scratch-level-1-classroom`, { waitUntil: "networkidle2" });
			await page.waitForSelector(".outline-button[aria-label*='Conditions and decisions']");
			if (await page.$eval(".outline-toggle", button => Boolean(button.offsetWidth || button.offsetHeight)))
				await page.click(".outline-toggle");
			await page.click(".outline-button[aria-label*='Conditions and decisions']");
			await page.waitForSelector(".lesson-view-toggle button");
			await page.click(".lesson-view-toggle button:nth-child(1)");
			const ending = await readLesson(page, "Maze Checkpoint", "Optional ending screen");
			for (const required of ["when green flag clicked -> hide", "when I receive [Maze finished] -> go to front layer -> show", "broadcast [Maze finished] and wait, followed by stop all", "the ending must hide and the player must return to its start", "it still retries"])
				assert.ok(ending.includes(required), required);
			assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
			assert.ok(await page.$$eval("a[href]", links => links.some((link) => {
				const url = new URL(link.href);
				return url.pathname === "/ide" && url.searchParams.get("mode") === "scratch" && url.searchParams.get("starter") === "maze-reset";
			})));
			if (process.env.SCRATCH_SCREENSHOT_DIR) {
				const card = await page.evaluateHandle(() => [...document.querySelectorAll(".lesson-item")].find(item => item.querySelector("h5")?.textContent.includes("Maze Checkpoint")));
				await card.asElement().screenshot({ path: join(process.env.SCRATCH_SCREENSHOT_DIR, `scratch-conditionals-ending-${role}-${width}.png`) });
			}
			console.log(JSON.stringify({ event: "verified-scratch-ending-guidance", role, width, starter: "maze-reset", hideShowRestartAndMessageOrder: true }));
			if (await page.$eval(".outline-toggle", button => Boolean(button.offsetWidth || button.offsetHeight)))
				await page.click(".outline-toggle");
			await page.click(".outline-button[aria-label*='Variables and games']");
			await page.click(".lesson-view-toggle button:nth-child(2)");
			for (const [title, id, required] of [
				["Falling Catch: Catch or Miss", "falling-catch", "one drop from being counted as both"],
				["Ready and Flying: A Two-State Projectile", "projectile-state", "Holding"],
				["Three-Level Catch Game", "catch-levels", "does not demote an earned level"]
			]) {
				const content = await readLesson(page, title, id === "projectile-state" ? "Draw the states before coding" : required);
				assert.ok(content.includes("Normal"));
				assert.ok(content.includes("Check"));
				const links = await page.$$eval(".lesson-item", (items, title) => [...items.find(item => item.querySelector("h5")?.textContent.includes(title)).querySelectorAll("a[href]")].map(link => link.getAttribute("href")), title);
				assert.ok(links.some((href) => {
					const url = new URL(href, origin);
					return url.pathname === "/ide" && url.searchParams.get("mode") === "scratch" && url.searchParams.get("starter") === id;
				}), JSON.stringify(links));
				assert.ok(links.includes(`/scratch-projects/${id}.sb3`));
				const completionIsOptional = await page.$$eval(".lesson-item", (items, title) => {
					const card = items.find(item => item.querySelector("h5")?.textContent.includes(title));
					return [...card.querySelectorAll(".assignment-aside.is-optional")].some(section => section.textContent.includes("Download this starter") || section.textContent.includes("Explain and retain") || section.textContent.includes("Partner routine"));
				}, title);
				assert.equal(completionIsOptional, false, "Saving and explaining the Normal task remain outside Hard");
				assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
				if (process.env.SCRATCH_SCREENSHOT_DIR) {
					const card = await page.evaluateHandle(title => [...document.querySelectorAll(".lesson-item")].find(item => item.querySelector("h5")?.textContent.includes(title)), title);
					await card.asElement().screenshot({ path: join(process.env.SCRATCH_SCREENSHOT_DIR, `scratch-conditionals-${id}-${role}-${width}.png`) });
					await card.dispose();
				}
			}
			console.log(JSON.stringify({ event: "verified-scratch-optional-game-readings", role, width, continuations: 3, downloadAndIdeLinks: true, readableWithoutOverflow: true }));
		}
	}
}
