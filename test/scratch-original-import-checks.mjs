import assert from "node:assert/strict";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { strFromU8, unzipSync } from "fflate";
import { originalAttributionId, originalScratchProjects } from "../front-end/scripts/scratch/generate-original-projects.mjs";
import { applyOriginalProgramCorrection } from "../front-end/scripts/scratch/program-corrections.mjs";
import { checkDottyGraph } from "./scratch-dotty-graph-check.mjs";
import { checkRepairedScratchGame } from "./scratch-game-state-vm-checks.mjs";
import { checkRocketshipRestart } from "./scratch-rocketship-restart-check.mjs";
import { checkSpeedClickRound } from "./scratch-speed-click-round-check.mjs";
import { checkSpellingBeeTraversal } from "./scratch-spelling-traversal-check.mjs";
import { checkWheelFinalGuess } from "./scratch-wheel-final-guess-check.mjs";

export async function checkScratchEventReading(page, { origin, files, setRole }) {
	const output = process.env.SCRATCH_ORIGINAL_BROWSER_PROOF_DIR || path.join(files, "original-proof");
	await mkdir(output, { recursive: true });
	const eventReadingViews = [];
	for (const role of ["learner", "instructor"]) {
		setRole(role);
		for (const width of [390, 1280]) {
			await page.setViewport({ width, height: 900 });
			await page.goto("about:blank");
			await page.goto(`${origin}/courses#scratch-level-1-gs2-event-listeners`, { waitUntil: "networkidle2" });
			await page.waitForSelector(".lesson-view-toggle button");
			await page.click(".lesson-view-toggle button:nth-child(3)");
			await page.waitForFunction(() => [...document.querySelectorAll(".lesson-item")].some(item => item.querySelector("h5")?.textContent.includes("Basic event listeners")));
			await page.$$eval(".lesson-item", items => items.find(item => item.querySelector("h5")?.textContent.includes("Basic event listeners")).scrollIntoView({ behavior: "instant", block: "center" }));
			await page.waitForFunction(() => [...document.querySelectorAll(".lesson-item")].some(item => item.querySelector("h5")?.textContent.includes("Basic event listeners") && item.textContent.includes("top to bottom") && item.querySelector("table")));
			const reading = await page.$$eval(".lesson-item", (items) => {
				const item = items.find(item => item.querySelector("h5")?.textContent.includes("Basic event listeners"));
				return { text: item.textContent, rows: [...item.querySelectorAll("tbody tr")].map(row => [...row.querySelectorAll("td")].map(cell => cell.textContent.trim())), contained: item.scrollWidth <= item.clientWidth && document.documentElement.scrollWidth <= innerWidth };
			});
			assert.deepEqual(reading.rows, [["Up", "0"], ["Right", "90"], ["Down", "180"], ["Left", "-90"]]);
			assert.match(reading.text, /point in direction \(0\)/);
			assert.match(reading.text, /move \(10\) steps/);
			assert.match(reading.text, /another event is needed to point again/);
			assert.match(reading.text, /start sound.*continues immediately/s);
			assert.ok(reading.contained, `${role}/${width}: event reading overflow`);
			await page.screenshot({ path: path.join(output, `event-reading-${role}-${width}.png`) });
			eventReadingViews.push({ role, width, ...reading });
			await writeFile(path.join(output, "event-reading.json"), `${JSON.stringify({ complete: false, views: eventReadingViews }, null, 2)}\n`);
		}
	}
	await writeFile(path.join(output, "event-reading.json"), `${JSON.stringify({ complete: true, sourceCommit: process.env.GITHUB_SHA, views: eventReadingViews }, null, 2)}\n`);
}

export async function checkScratchCoordinateReading(page, { origin, files, setRole }) {
	const output = process.env.SCRATCH_ORIGINAL_BROWSER_PROOF_DIR || path.join(files, "original-proof");
	await mkdir(output, { recursive: true });
	const views = [];
	for (const role of ["learner", "instructor"]) {
		setRole(role);
		for (const width of [390, 1280]) {
			await page.setViewport({ width, height: 900 });
			await page.goto("about:blank");
			await page.goto(`${origin}/courses#scratch-level-1-gs8-x-y-coordinates`, { waitUntil: "networkidle2" });
			await page.waitForSelector(".lesson-view-toggle button");
			await page.locator(".lesson-view-toggle button:nth-child(3)").click();
			await page.waitForFunction(() => [...document.querySelectorAll(".lesson-item")].some(item => item.querySelector("h5")?.textContent.includes("Introduction to X & Y coordinates")));
			await page.$$eval(".lesson-item", items => items.find(item => item.querySelector("h5")?.textContent.includes("Introduction to X & Y coordinates")).scrollIntoView({ behavior: "instant", block: "center" }));
			await page.waitForFunction(() => [...document.querySelectorAll(".lesson-item")].some(item => item.querySelector("h5")?.textContent.includes("Introduction to X & Y coordinates") && item.textContent.includes("Using an answer as a coordinate") && item.querySelector("table")));
			const reading = await page.$$eval(".lesson-item", (items) => {
				const item = items.find(item => item.querySelector("h5")?.textContent.includes("Introduction to X & Y coordinates"));
				const wrapper = item.querySelector(".markdown-table-scroll");
				const bounds = wrapper.getBoundingClientRect();
				const cells = [...wrapper.querySelectorAll("th, td")];
				const compactTableFits = wrapper.scrollWidth <= wrapper.clientWidth + 2 && cells.every(cell => cell.getBoundingClientRect().right <= bounds.right + 1 && cell.scrollWidth <= cell.clientWidth + 1);
				return { text: item.textContent, rows: [...item.querySelectorAll("tbody tr")].map(row => [...row.querySelectorAll("td")].map(cell => cell.textContent.trim())), contained: item.scrollWidth <= item.clientWidth && document.documentElement.scrollWidth <= innerWidth, compactTableFits };
			});
			assert.deepEqual(reading.rows, [["Center", "0", "0"], ["Upper left", String(-480 / 2), String(360 / 2)], ["Upper right", String(480 / 2), String(360 / 2)], ["Lower left", String(-480 / 2), String(-360 / 2)], ["Lower right", String(480 / 2), String(-360 / 2)]]);
			assert.match(reading.text, /\(30, -20\).*\(40, -20\).*\(40, -10\).*\(10, -10\)/s);
			assert.match(reading.text, /second response twice/);
			assert.match(reading.text, /separate green-flag script.*while the question script waits/s);
			assert.ok(reading.contained, `${role}/${width}: coordinate reading overflow`);
			assert.ok(reading.compactTableFits, `${role}/${width}: every coordinate column must fit without horizontal scrolling`);
			for (const heading of ["Reading the stage", "Setting and changing a position", "Using an answer as a coordinate"]) {
				await page.$$eval(".lesson-item h3", (headings, title) => headings.find(item => item.textContent === title).scrollIntoView({ behavior: "instant", block: "start" }), heading);
				await page.screenshot({ path: path.join(output, `coordinate-reading-${role}-${width}-${heading.split(" ")[0].toLowerCase()}.png`) });
			}
			views.push({ role, width, ...reading });
			await writeFile(path.join(output, "coordinate-reading.json"), `${JSON.stringify({ complete: false, views }, null, 2)}\n`);
		}
	}
	await writeFile(path.join(output, "coordinate-reading.json"), `${JSON.stringify({ complete: true, sourceCommit: process.env.GITHUB_SHA, views }, null, 2)}\n`);
}

export async function checkScratchOriginalImports(page, { origin, files, loaded, downloadProject, openFile, newProject, setRole, acceptDialogs }) {
	const output = process.env.SCRATCH_ORIGINAL_BROWSER_PROOF_DIR || path.join(files, "original-proof");
	await mkdir(output, { recursive: true });
	const requests = [];
	const records = [];
	const speechResponses = [];
	const observeSpeech = (response) => {
		if (new URL(response.url()).hostname === "synthesis-service.scratch.mit.edu")
			speechResponses.push({ url: response.url(), status: response.status(), contentType: response.headers()["content-type"] });
	};
	const observe = (request) => {
		const url = new URL(request.url());
		if (/^\/scratch-originals\/\d+\.sb3$/.test(url.pathname)) requests.push(url.pathname);
	};
	page.on("request", observe);
	page.on("response", observeSpeech);
	const route = href => page.evaluate(async (href) => {
		await document.querySelector("#app").__vue_app__.config.globalProperties.$router.push(href);
	}, href);
	const sourceHref = (original) => {
		const binding = original.bindings.find(binding => binding.role === "project" || binding.role === "capstone-direction") || original.bindings[0];
		return `/ide?${new URLSearchParams({ mode: "scratch", originalProject: original.id, course: binding.courseId, role: binding.role === "reference" ? "reference" : "project" })}`;
	};
	const confirm = async () => {
		await page.waitForSelector(".scratch-original-import button:not([disabled])");
		await page.click(".scratch-original-import button");
		await page.waitForSelector(".scratch-original-import", { hidden: true, timeout: 45000 });
		await loaded();
	};
	async function inspect(original) {
		const expected = JSON.parse(await readFile(new URL(`../front-end/scripts/scratch/originals/projects/${original.id}.json`, import.meta.url), "utf8"));
		applyOriginalProgramCorrection(expected, original);
		const vectors = {};
		for (const target of expected.targets) {
			for (const costume of target.costumes) {
				if (costume.dataFormat === "svg")
					vectors[costume.assetId] = (await readFile(new URL(`../front-end/scripts/scratch/originals/assets/${costume.assetId}.svg`, import.meta.url))).toString("base64");
			}
		}
		const frame = page.frames().find(frame => frame !== page.mainFrame());
		const snapshot = await frame.evaluate(async ({ expected, vectors, original, attributionId }) => {
			const vm = window.__courseTestVm;
			const actual = JSON.parse(vm.toJSON());
			const problems = [];
			const mediaMismatches = [];
			const vectorConversions = [];
			const vectorDifferences = [];
			const legacyDeclarations = [];
			const programMismatches = [];
			const signature = block => JSON.stringify({ code: block?.mutation?.proccode, names: JSON.parse(block?.mutation?.argumentnames || "[]").map(String), defaults: JSON.parse(block?.mutation?.argumentdefaults || "[]").map(String), warp: String(block?.mutation?.warp) === "true" });
			async function pixels(bytes) {
				const url = URL.createObjectURL(new Blob([bytes], { type: "image/svg+xml" }));
				try {
					const image = new Image();
					image.src = url;
					await image.decode();
					const width = image.naturalWidth;
					const height = image.naturalHeight;
					if (width < 1 || height < 1 || width > 4096 || height > 4096) throw new Error("Unexpected original vector dimensions");
					const canvas = document.createElement("canvas");
					canvas.width = width;
					canvas.height = height;
					const context = canvas.getContext("2d");
					context.drawImage(image, 0, 0);
					return { width, height, data: context.getImageData(0, 0, width, height).data, canvas };
				}
				finally {
					URL.revokeObjectURL(url);
				}
			}
			for (const target of expected.targets) {
				const current = actual.targets.find(item => item.name === target.name && item.isStage === target.isStage);
				if (!current) {
					problems.push(`Missing target ${target.name}`);
					continue;
				}
				for (const [id, block] of Object.entries(target.blocks)) {
					if (Array.isArray(block)) continue;
					const present = current.blocks[id];
					if (block.shadow && block.opcode.startsWith("argument_reporter_")) {
						const ownerEntry = Object.entries(target.blocks).find(([, candidate]) => candidate.opcode === "procedures_prototype" && Object.values(candidate.inputs || {}).some(input => input.slice(1).includes(id)));
						const ownerId = ownerEntry?.[0];
						const owner = ownerEntry?.[1];
						if (owner && current.blocks[ownerId]?.opcode === "procedures_prototype" && signature(owner) === signature(current.blocks[ownerId])) {
							legacyDeclarations.push({ id, kind: "Blockly-managed argument declaration", owner: ownerId, signature: JSON.parse(signature(owner)) });
							continue;
						}
						if (!block.parent && block.topLevel && !Object.values(target.blocks).some(other => !Array.isArray(other) && (other.next === id || Object.values(other.inputs || {}).some(input => input.slice(1).includes(id))))) {
							legacyDeclarations.push({ id, kind: "Unconnected legacy shadow placeholder", opcode: block.opcode, value: block.fields.VALUE[0] });
							continue;
						}
					}
					const fieldsMatch = present && Object.entries(block.fields || {}).every(([key, value]) => {
						const actual = present.fields?.[key];
						const canonical = expected.targets.find(target => target.isStage).broadcasts?.[value[1]];
						if (key === "BROADCAST_OPTION" && typeof value[1] === "string" && actual?.[1] === value[1] && canonical === actual[0] && String(value[0]).toLowerCase() === String(canonical).toLowerCase()) {
							if (value[0] !== actual[0]) legacyDeclarations.push({ id, kind: "Broadcast label canonicalized from the unchanged message ID", original: value[0], actual: actual[0], messageId: value[1] });
							return true;
						}
						return String(value[0]) === String(actual?.[0]) && (typeof value[1] !== "string" || value[1] === actual?.[1]);
					});
					if (!present || present.opcode !== block.opcode || (present.next || null) !== (block.next || null) || (present.parent || null) !== (block.parent || null) || !fieldsMatch || (block.opcode === "procedures_prototype" && signature(block) !== signature(present))) {
						problems.push(`Changed program block ${target.name}:${id}`);
						programMismatches.push({ target: target.name, id, expected: block, actual: present });
					}
				}
				for (const kind of ["costumes", "sounds"]) {
					const runtimeTarget = vm.runtime.targets.find(item => item.getName() === target.name && item.isStage === target.isStage);
					const checks = await Promise.all(target[kind].map(async (wanted, index) => {
						const have = current[kind][index];
						const loaded = runtimeTarget.sprite[kind][index];
						if (!have || loaded?.broken || wanted.name !== have.name || wanted.dataFormat !== have.dataFormat) return false;
						if (kind === "costumes" && ["rotationCenterX", "rotationCenterY", "bitmapResolution"].some(key => wanted[key] !== undefined && wanted[key] !== have[key])) return false;
						if (wanted.assetId === have.assetId) return true;
						if (kind !== "costumes" || wanted.dataFormat !== "svg" || !loaded?.asset) return false;
						const source = Uint8Array.from(atob(vectors[wanted.assetId]), character => character.charCodeAt(0));
						const before = await pixels(source);
						const after = await pixels(loaded.asset.data);
						const identical = before.width === after.width && before.height === after.height && before.data.every((value, offset) => value === after.data[offset]);
						vectorConversions.push({ target: target.name, name: wanted.name, original: wanted.assetId, sanitized: have.assetId, width: before.width, height: before.height, pixelIdentical: identical });
						if (!identical) {
							let changedChannels = 0;
							let maximumChannelDifference = 0;
							for (let offset = 0; offset < before.data.length; offset++) {
								const difference = Math.abs(before.data[offset] - after.data[offset]);
								if (difference) changedChannels++;
								maximumChannelDifference = Math.max(maximumChannelDifference, difference);
							}
							vectorDifferences.push({ target: target.name, name: wanted.name, original: wanted.assetId, sanitized: have.assetId, changedChannels, maximumChannelDifference, originalSize: [before.width, before.height], sanitizedSize: [after.width, after.height], originalPNG: before.canvas.toDataURL(), sanitizedPNG: after.canvas.toDataURL(), sanitizedSVG: new TextDecoder().decode(loaded.asset.data) });
						}
						return identical;
					}));
					if (current[kind].length !== target[kind].length || checks.some(ok => !ok)) {
						problems.push(`Changed ${kind} in ${target.name}`);
						mediaMismatches.push({ target: target.name, kind, expected: target[kind], actual: current[kind], loaded: runtimeTarget.sprite[kind].map(asset => ({ name: asset.name, assetId: asset.assetId, dataFormat: asset.dataFormat, broken: asset.broken && { assetId: asset.broken.assetId, dataFormat: asset.broken.dataFormat } })) });
					}
				}
			}
			const comment = actual.targets.find(target => target.isStage).comments?.[attributionId]?.text;
			if (!comment?.includes(original.url) || !comment.includes("CC BY-SA 2.0")) problems.push("Missing portable attribution");
			if (original.id === "299311602" && !comment?.includes("Active-round score guard")) problems.push("Missing program correction credit");
			const extensions = original.extensions.map(extension => ({ extension, loaded: vm.extensionManager.isExtensionLoaded(extension) }));
			if (actual.targets.length !== expected.targets.length) problems.push("Changed target count");
			if (extensions.some(extension => !extension.loaded)) problems.push("Extension not loaded");
			return { problems, programMismatches, legacyDeclarations, mediaMismatches, vectorConversions, vectorDifferences, targets: actual.targets.length, extensions, attribution: comment };
		}, { expected, vectors, original, attributionId: originalAttributionId(original.id) });
		if (snapshot.problems.length)
			await writeFile(path.join(output, `project-${original.id}-mismatch.json`), `${JSON.stringify(snapshot, null, 2)}\n`);
		return { ...snapshot, vectorDifferences: undefined };
	}
	try {
		setRole("learner");
		await page.setViewport({ width: 1280, height: 900 });
		await page.goto("about:blank");
		await page.goto(`${origin}/courses#scratch-level-1-gs2-event-listeners`, { waitUntil: "networkidle2" });
		await page.waitForSelector(".lesson-view-toggle button");
		await page.click(".lesson-view-toggle button:first-child");
		const href = await page.$$eval("a.is-ide-starter", links => links.find(link => new URL(link.href).searchParams.get("originalProject") === "287707460")?.getAttribute("href"));
		assert.ok(href, "Original course project needs its own site-IDE entry");
		await page.goto(`${origin}${href}`, { waitUntil: "networkidle2" });
		await page.waitForSelector(".scratch-original-import button:not([disabled])");
		assert.equal(requests.length, 0, "No original archive is fetched before consent");
		await page.click(".scratch-original-import button:nth-of-type(2)");
		assert.equal(requests.length, 0);
		await route("/ide?mode=scratch");
		await route(href);
		await confirm();
		assert.equal(requests.length, 1);
		setRole("instructor");
		await page.goto("about:blank");
		await page.goto(`${origin}/courses#scratch-level-1-gs2-event-listeners`, { waitUntil: "networkidle2" });
		await page.waitForSelector(".lesson-view-toggle button");
		await page.click(".lesson-view-toggle button:first-child");
		const referenceHref = await page.$$eval("a.is-ide-starter", links => links.find(link => new URL(link.href).searchParams.get("originalProject") === "284408078")?.getAttribute("href"));
		assert.ok(referenceHref, "Instructor reference needs its distinct site-IDE entry");
		assert.equal(new URL(referenceHref, origin).searchParams.get("role"), "reference");
		await page.goto(`${origin}${referenceHref}`, { waitUntil: "networkidle2" });
		await confirm();

		for (const original of originalScratchProjects) {
			let snapshot;
			try {
				await route(sourceHref(original));
				await confirm();
				snapshot = await inspect(original);
			}
			catch (error) {
				snapshot = { problems: [`Import verification failed: ${error}`], inspectionFailed: true, stack: error.stack };
				await page.screenshot({ path: path.join(output, `project-${original.id}-failed.png`) }).catch(() => {});
			}
			records.push({ id: original.id, sourceSHA256: original.sourceSHA256, ...snapshot });
			await writeFile(path.join(output, "imports.json"), `${JSON.stringify({ complete: false, records }, null, 2)}\n`);
			if (snapshot.inspectionFailed) {
				await page.goto("about:blank");
				await page.goto(`${origin}/ide?mode=scratch`, { waitUntil: "networkidle2" });
				await page.waitForFunction(() => document.querySelector(".scratch-status")?.textContent.includes("Ready."));
			}
		}
		assert.equal(records.length, originalScratchProjects.length);
		const speedClick = originalScratchProjects.find(project => project.id === "299311602");
		await route(sourceHref(speedClick));
		assert.match(await page.$eval(".scratch-original-import", element => element.textContent), /Reference correction: clicks score only during an active round/);
		await confirm();
		const speedFrame = page.frames().find(frame => frame !== page.mainFrame());
		const speedRound = await checkSpeedClickRound(speedFrame, output);
		await page.$eval(".scratch-toolbar input[maxlength='120']", (input) => {
			input.value = "Speed Click corrected";
			input.dispatchEvent(new Event("input", { bubbles: true }));
		});
		await downloadProject("Speed Click corrected.sb3");
		const speedSaved = unzipSync(new Uint8Array(await readFile(path.join(files, "Speed Click corrected.sb3"))));
		const speedProject = JSON.parse(strFromU8(speedSaved["project.json"]));
		assert.equal(speedProject.targets.find(target => target.name === "Button").blocks["classes-speed-click-round-and"].opcode, "operator_and");
		assert.match(speedProject.targets.find(target => target.isStage).comments[originalAttributionId(speedClick.id)].text, /Active-round score guard/);
		await newProject();
		await openFile(path.join(files, "Speed Click corrected.sb3"));
		const speedReopened = await inspect(speedClick);
		assert.deepEqual(speedReopened.problems, []);
		speedRound.exportReopenedWithCorrectionAndAttribution = true;
		await writeFile(path.join(output, "speed-click-round.json"), `${JSON.stringify(speedRound, null, 2)}\n`);

		const rocketship = originalScratchProjects.find(project => project.id === "332459692");
		await route(sourceHref(rocketship));
		assert.match(await page.$eval(".scratch-original-import", element => element.textContent), /Reference correction: the rocket returns to its starting position on restart/);
		await confirm();
		const rocketFrame = page.frames().find(frame => frame !== page.mainFrame());
		const rocketRestart = await checkRocketshipRestart(rocketFrame, output);
		await page.$eval(".scratch-toolbar input[maxlength='120']", (input) => {
			input.value = "Rocketship corrected";
			input.dispatchEvent(new Event("input", { bubbles: true }));
		});
		await downloadProject("Rocketship corrected.sb3");
		const rocketSaved = unzipSync(new Uint8Array(await readFile(path.join(files, "Rocketship corrected.sb3"))));
		const rocketProject = JSON.parse(strFromU8(rocketSaved["project.json"]));
		assert.equal(rocketProject.targets.find(target => target.name === "Rocketship").blocks["classes-rocketship-reset-position"].opcode, "motion_gotoxy");
		assert.match(rocketProject.targets.find(target => target.isStage).comments[originalAttributionId(rocketship.id)].text, /Restart position reset/);
		await newProject();
		await openFile(path.join(files, "Rocketship corrected.sb3"));
		assert.deepEqual((await inspect(rocketship)).problems, []);
		rocketRestart.exportReopenedWithCorrectionAndAttribution = true;
		await writeFile(path.join(output, "rocketship-restart.json"), `${JSON.stringify(rocketRestart, null, 2)}\n`);

		const spellingBee = originalScratchProjects.find(project => project.id === "357452924");
		await route(sourceHref(spellingBee));
		assert.match(await page.$eval(".scratch-original-import", element => element.textContent), /Reference correction: spelling stops after the last selected letter/);
		await confirm();
		const spellingFrame = page.frames().find(frame => frame !== page.mainFrame());
		const traversal = await checkSpellingBeeTraversal(spellingFrame, output);
		await page.$eval(".scratch-toolbar input[maxlength='120']", (input) => {
			input.value = "Spelling Bee corrected";
			input.dispatchEvent(new Event("input", { bubbles: true }));
		});
		await downloadProject("Spelling Bee corrected.sb3");
		const savedBee = unzipSync(new Uint8Array(await readFile(path.join(files, "Spelling Bee corrected.sb3"))));
		const savedBeeProject = JSON.parse(strFromU8(savedBee["project.json"]));
		assert.equal(savedBeeProject.targets.find(target => target.name === "Sprite1").blocks["classes-spelling-bee-alternate-count"].fields.OPERATOR[0], "ceiling");
		assert.match(savedBeeProject.targets.find(target => target.isStage).comments[originalAttributionId(spellingBee.id)].text, /String traversal bounds/);
		await newProject();
		await openFile(path.join(files, "Spelling Bee corrected.sb3"));
		assert.deepEqual((await inspect(spellingBee)).problems, []);
		const reopenedFrame = page.frames().find(frame => frame !== page.mainFrame());
		const reopenedTraversal = await checkSpellingBeeTraversal(reopenedFrame, output);
		traversal.exportReopenedWithCorrectionAndAttribution = true;
		traversal.reopenedCases = reopenedTraversal.cases;
		await writeFile(path.join(output, "spelling-bee-traversal.json"), `${JSON.stringify(traversal, null, 2)}\n`);

		const dotty = originalScratchProjects.find(project => project.id === "338501835");
		await route(sourceHref(dotty));
		assert.match(await page.$eval(".scratch-original-import", element => element.textContent), /Reference correction: reset the pen and finish the graph at \(180, 180\)/);
		await confirm();
		const dottyFrame = page.frames().find(frame => frame !== page.mainFrame());
		const graph = await checkDottyGraph(dottyFrame, output);
		await page.$eval(".scratch-toolbar input[maxlength='120']", (input) => {
			input.value = "Dotty corrected";
			input.dispatchEvent(new Event("input", { bubbles: true }));
		});
		await downloadProject("Dotty corrected.sb3");
		const savedDotty = unzipSync(new Uint8Array(await readFile(path.join(files, "Dotty corrected.sb3"))));
		const savedDottyProject = JSON.parse(strFromU8(savedDotty["project.json"]));
		assert.equal(savedDottyProject.targets.find(target => target.name === "Dotty").blocks["classes-dotty-reset-pen"].opcode, "pen_penUp");
		assert.match(savedDottyProject.targets.find(target => target.isStage).comments[originalAttributionId(dotty.id)].text, /Absolute-value trace/);
		await newProject();
		await openFile(path.join(files, "Dotty corrected.sb3"));
		assert.deepEqual((await inspect(dotty)).problems, []);
		const reopenedDottyFrame = page.frames().find(frame => frame !== page.mainFrame());
		const reopenedGraph = await checkDottyGraph(reopenedDottyFrame, output);
		graph.exportReopenedWithCorrectionAndAttribution = true;
		graph.reopenedCases = reopenedGraph.cases;
		await writeFile(path.join(output, "dotty-graph.json"), `${JSON.stringify(graph, null, 2)}\n`);

		const wheel = originalScratchProjects.find(project => project.id === "342643080");
		await route(sourceHref(wheel));
		assert.match(await page.$eval(".scratch-original-import", element => element.textContent), /Reference correction: completing the word on the last guess wins/);
		await confirm();
		const wheelFrame = page.frames().find(frame => frame !== page.mainFrame());
		const wheelProof = await checkWheelFinalGuess(wheelFrame, output);
		await page.$eval(".scratch-toolbar input[maxlength='120']", (input) => {
			input.value = "Wheel corrected";
			input.dispatchEvent(new Event("input", { bubbles: true }));
		});
		await downloadProject("Wheel corrected.sb3");
		const wheelSaved = unzipSync(new Uint8Array(await readFile(path.join(files, "Wheel corrected.sb3"))));
		const wheelProject = JSON.parse(strFromU8(wheelSaved["project.json"]));
		assert.match(wheelProject.targets.find(target => target.isStage).comments[originalAttributionId(wheel.id)].text, /Final-guess victory/);
		await newProject();
		await openFile(path.join(files, "Wheel corrected.sb3"));
		assert.deepEqual((await inspect(wheel)).problems, []);
		const wheelReopenedFrame = page.frames().find(frame => frame !== page.mainFrame());
		const reopenedWheel = await checkWheelFinalGuess(wheelReopenedFrame, output);
		wheelProof.reopenedCases = reopenedWheel.cases;
		wheelProof.exportReopenedWithCorrectionAndAttribution = true;
		await writeFile(path.join(output, "wheel-final-guess.json"), `${JSON.stringify(wheelProof, null, 2)}\n`);

		for (const id of ["357453262", "343348430", "348994271", "341945558", "342645999"]) {
			const game = originalScratchProjects.find(project => project.id === id);
			await route(sourceHref(game));
			await confirm();
			const frame = page.frames().find(frame => frame !== page.mainFrame());
			const proof = await checkRepairedScratchGame(frame, output, id);
			const name = `Repaired game ${id}`;
			await page.$eval(".scratch-toolbar input[maxlength='120']", (input, name) => {
				input.value = name;
				input.dispatchEvent(new Event("input", { bubbles: true }));
			}, name);
			await downloadProject(`${name}.sb3`);
			const saved = unzipSync(new Uint8Array(await readFile(path.join(files, `${name}.sb3`))));
			const project = JSON.parse(strFromU8(saved["project.json"]));
			assert.ok(project.targets.find(t => t.isStage).comments[originalAttributionId(id)].text.includes("correction"));
			await newProject();
			await openFile(path.join(files, `${name}.sb3`));
			assert.deepEqual((await inspect(game)).problems, []);
			const reopenedFrame = page.frames().find(frame => frame !== page.mainFrame());
			const reopened = await checkRepairedScratchGame(reopenedFrame, output, id);
			proof.reopenedCases = reopened.cases;
			proof.exportReopenedWithCorrectionAndAttribution = true;
			await writeFile(path.join(output, `game-state-${id}.json`), `${JSON.stringify(proof, null, 2)}\n`);
		}

		const spinner = originalScratchProjects.find(project => project.id === "287887351");
		await route(sourceHref(spinner));
		await confirm();
		const spinnerFrame = page.frames().find(frame => frame !== page.mainFrame());
		await spinnerFrame.locator("[class*=\"green-flag_green-flag\"]").click();
		await spinnerFrame.waitForFunction(() => window.__courseTestVm.runtime.targets.find(target => !target.isStage).direction === 90);
		await spinnerFrame.click("[class*=\"stage_stage_\"] > div > canvas");
		for (const [key, direction] of [["ArrowUp", 0], ["a", -15], ["d", 0]]) {
			await page.keyboard.press(key);
			await spinnerFrame.waitForFunction(direction => window.__courseTestVm.runtime.targets.find(target => !target.isStage).direction === direction, {}, direction);
		}
		const spelling = originalScratchProjects.find(project => project.id === "338832976");
		await route(sourceHref(spelling));
		assert.match(await page.$eval(".scratch-original-import", element => element.textContent), /Text to Speech sends spoken text/);
		await confirm();
		const speechFrame = page.frames().find(frame => frame !== page.mainFrame());
		await speechFrame.evaluate(() => {
			const engine = window.__courseTestVm.runtime.audioEngine;
			const decode = engine.decodeSoundPlayer;
			window.__courseRestoreSpeechDecode = () => {
				engine.decodeSoundPlayer = decode;
			};
			window.__courseSpeechPlayback = [];
			engine.decodeSoundPlayer = async function (sound) {
				const player = await decode.call(this, sound);
				const record = { bytes: sound.data.buffer.byteLength, played: false, stopped: false };
				window.__courseSpeechPlayback.push(record);
				const play = player.play;
				player.play = function (...args) {
					record.played = true;
					return play.apply(this, args);
				};
				player.on("stop", () => {
					record.stopped = true;
				});
				return player;
			};
		});
		await speechFrame.locator("[class*=\"green-flag_green-flag\"]").click();
		await speechFrame.waitForFunction(() => window.__courseSpeechPlayback.filter(record => record.played && record.stopped && record.bytes > 0).length >= 2, { timeout: 45000 });
		await speechFrame.waitForSelector("input[class*=question], [class*=question_question-input] input", { visible: true });
		const speechPlayback = await speechFrame.evaluate(() => {
			window.__courseTestVm.stopAll();
			window.__courseRestoreSpeechDecode();
			return window.__courseSpeechPlayback;
		});
		assert.equal(speechResponses.length, 2);
		assert.ok(speechResponses.every(response => response.status === 200 && response.contentType.startsWith("audio/")));
		await writeFile(path.join(output, "speech.json"), `${JSON.stringify({ project: spelling.id, responses: speechResponses, playback: speechPlayback, originalProgramReachedLetterPrompt: true }, null, 2)}\n`);
		const dragonfly = originalScratchProjects.find(project => project.id === "287707460");
		await route(sourceHref(dragonfly));
		await confirm();
		const frame = page.frames().find(frame => frame !== page.mainFrame());
		await page.$eval(".scratch-toolbar input[maxlength='120']", (input) => {
			input.value = "Dragonfly original edited";
			input.dispatchEvent(new Event("input", { bubbles: true }));
		});
		await frame.waitForFunction(() => window.__courseTestVm.editingTarget?.getName() === "Dragonfly" && Number(document.querySelector("input[placeholder='x']")?.value) === Math.round(window.__courseTestVm.editingTarget.x));
		const xInput = await frame.waitForSelector("input[placeholder='x']");
		await xInput.focus();
		await xInput.evaluate(input => input.select());
		await xInput.type("77");
		await page.keyboard.press("Enter");
		await page.keyboard.press("Tab");
		await frame.waitForFunction(() => window.__courseTestVm.editingTarget.x === 77 && document.querySelector("input[placeholder='x']")?.value === "77");
		await page.waitForFunction(() => document.querySelector(".scratch-status").textContent.includes("Unsaved changes."));
		const beforeReplace = requests.length;
		await route(sourceHref(originalScratchProjects.find(project => project.id === "287920173")));
		acceptDialogs(false);
		const replacementDialog = new Promise(resolve => page.once("dialog", dialog => resolve({ type: dialog.type(), message: dialog.message() })));
		await page.locator(".scratch-original-import button").click();
		assert.deepEqual(await replacementDialog, { type: "confirm", message: "Download your current Scratch project before replacing it. Continue without downloading?" });
		acceptDialogs(true);
		assert.equal(requests.length, beforeReplace, "Declining replacement preserves the current project");
		assert.equal(await frame.$eval("input[placeholder='x']", input => input.value), "77");
		assert.equal(await frame.evaluate(() => window.__courseTestVm.editingTarget.x), 77);
		await page.locator(".scratch-original-import button:nth-of-type(2)").click();
		await page.waitForSelector(".scratch-original-import", { hidden: true });
		assert.equal(requests.length, beforeReplace, "Cancelling the source prompt never fetches a replacement");
		await downloadProject("Dragonfly original edited.sb3");
		const saved = unzipSync(new Uint8Array(await readFile(path.join(files, "Dragonfly original edited.sb3"))));
		const project = JSON.parse(strFromU8(saved["project.json"]));
		assert.equal(project.targets.find(target => !target.isStage).x, 77);
		assert.match(project.targets.find(target => target.isStage).comments[originalAttributionId(dragonfly.id)].text, /JuniLearningScratch/);
		await newProject();
		assert.equal(await frame.evaluate(id => !!JSON.parse(window.__courseTestVm.toJSON()).targets.find(target => target.isStage).comments?.[id], originalAttributionId(dragonfly.id)), false);
		await openFile(path.join(files, "Dragonfly original edited.sb3"));
		await frame.waitForFunction(() => window.__courseTestVm.editingTarget.x === 77 && document.querySelector("input[placeholder='x']")?.value === "77");
		assert.equal(await frame.$eval("input[placeholder='x']", input => input.value), "77");
		assert.equal(await frame.evaluate(id => !!JSON.parse(window.__courseTestVm.toJSON()).targets.find(target => target.isStage).comments?.[id], originalAttributionId(dragonfly.id)), true);
		await page.screenshot({ path: path.join(output, "original-edited-reopened-1280.png"), fullPage: false });
		await page.setViewport({ width: 390, height: 900 });
		await route(sourceHref(dragonfly));
		await page.waitForSelector(".scratch-original-import button:not([disabled])");
		await page.screenshot({ path: path.join(output, "original-consent-390.png"), fullPage: false });
		await confirm();
		await writeFile(path.join(output, "workflow.json"), `${JSON.stringify({ sourceCommit: process.env.GITHUB_SHA, bothCourseRolesVerified: true, consentBeforeFetch: true, cancelBeforeFetch: true, unsavedReplacementDeclined: true, originalKeyboardEventsVerified: true, editedFileReopenedAfterBlankReset: true, portableAttributionRetained: true, speechServiceExecutionVerified: true }, null, 2)}\n`);
		assert.deepEqual(records.filter(record => record.problems.length).map(record => ({ id: record.id, problems: record.problems })), [], "Every original must retain its program, media appearance and extensions");
		await writeFile(path.join(output, "imports.json"), `${JSON.stringify({ complete: true, sourceCommit: process.env.GITHUB_SHA, records, bothCourseRolesVerified: true, consentBeforeFetch: true, cancelBeforeFetch: true, unsavedReplacementDeclined: true, originalKeyboardEventsVerified: true, editedFileReopenedAfterBlankReset: true, portableAttributionRetained: true, speechServiceExecutionVerified: true, wholeCourseSemanticReviewComplete: false }, null, 2)}\n`);
	}
	catch (error) {
		await page.screenshot({ path: path.join(output, "failed.png"), fullPage: false }).catch(() => {});
		await writeFile(path.join(output, "failure.json"), `${JSON.stringify({ error: String(error), completed: records.length, lastProject: records.at(-1)?.id }, null, 2)}\n`);
		throw error;
	}
	finally {
		acceptDialogs(true);
		page.off("request", observe);
		page.off("response", observeSpeech);
	}
}
