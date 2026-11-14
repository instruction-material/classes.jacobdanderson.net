import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { existsSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import process from "node:process";
// eslint-disable-next-line test/no-import-node-test -- Native CI browser entrypoint.
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import puppeteer from "puppeteer";
import { createServer, preview } from "vite";
import { checkOrbitExperiment } from "./orbit-experiment-browser.mjs";

const root = fileURLToPath(new URL("../front-end/", import.meta.url));
const courseIds = [
	"early-elementary-a-math",
	"early-elementary-b-math",
	"late-elementary-a-math",
	"late-elementary-b-math",
	"early-elementary-a-reading",
	"early-elementary-b-picture-book",
	"algebra-1a",
	"algebra-1b",
	"entrepreneurship-101",
	"middle-school-a-literature",
	"middle-school-b-writing",
	"middle-school-b-writing-retake",
	"middle-school-c-grammar",
	"novel-writing",
	"introduction-to-public-speaking",
	"scratch-level-1-bootcamp",
	"algebra-2a",
	"algebra-2b",
	"intro-to-physics",
	"physics-level-2",
	"pre-algebra-a",
	"geometry-a",
	"geometry-b",
	"middle-school-integrated-science"
];
const readingCounts = [22, 19, 19, 20, 8, 13, 15, 31, 10, 13, 14, 16, 20, 14, 9, 4, 27, 22, 37, 38, 11, 6, 11, 65];
assert.equal(readingCounts.length, courseIds.length);
// Reading counts for explicitly selected teaching scopes.
const focusedReadingCounts = {
	"smart-money-personal-finance": 9,
	"design-patterns-in-java": 32,
	"design-patterns-in-java-part-2": 6,
	"java-level-3": 1,
	"intro-to-environmental-science": 27,
	"elementary-science": 36,
	"intro-to-biology": 8,
	"intro-to-chemistry": 62,
	"python-level-1": 1,
	"python-level-1-classroom": 1
};
const allowedCourseIds = [...courseIds, ...Object.keys(focusedReadingCounts)];
const requestedCourses = process.env.SELF_STUDY_BROWSER_COURSES;
const sourceMode = process.env.SELF_STUDY_BROWSER_SOURCE_MODE ?? "build";
assert.ok(["build", "dev"].includes(sourceMode));
const selectedCourseIds = requestedCourses
	? requestedCourses.split(",")
	: courseIds;
assert.ok(selectedCourseIds.length > 0);
assert.equal(new Set(selectedCourseIds).size, selectedCourseIds.length);
assert.ok(selectedCourseIds.every(id => allowedCourseIds.includes(id)));
const expectedProfiles = selectedCourseIds.length * 4;
const expectedReadingViews = selectedCourseIds.reduce(
	(total, id) => total + (focusedReadingCounts[id] ?? readingCounts[courseIds.indexOf(id)]) * 4,
	0
);
const digest = value => createHash("sha256").update(value).digest("hex");

function account(path, role) {
	const learner = {
		_id: "self-study-learner",
		name: "Course fixture",
		email: "learner@example.invalid",
		age: 14,
		state: "GA",
		courseAccess: allowedCourseIds,
		courseProgress: []
	};
	if (path === "/api/accounts/me") {
		return role === "instructor"
			? { tutorID: "self-study-tutor" }
			: { userID: learner._id };
	}
	if (path === "/api/users/loggedin" && role === "learner")
		return { currentUser: learner };
	if (path === "/api/tutors/loggedin" && role === "instructor") {
		return {
			currentTutor: {
				_id: "self-study-tutor",
				name: "Course fixture",
				email: "tutor@example.invalid",
				age: 30,
				state: "GA",
				usersOfTutorLength: 1,
				coursePermissions: allowedCourseIds,
				editTutors: false,
				saveEdit: "Save"
			}
		};
	}
	if (path === "/api/users/oftutor/self-study-tutor") return [learner];
	return {};
}

async function chooseModule(page, module, index) {
	const toggle = await page.$(".outline-toggle");
	if (
		toggle
		&& (await toggle.boundingBox())
		&& (await toggle.evaluate(
			element => element.getAttribute("aria-expanded") !== "true"
		))
	) {
		await toggle.click();
	}
	const kind = module.kind === "transition" ? "next step" : module.kind;
	const label = `Show ${kind} ${index + 1}: ${module.title}`;
	await page
		.locator(`.outline-button[aria-label=${JSON.stringify(label)}]`)
		.click();
	await page.waitForFunction(
		title =>
			document
				.querySelector("#course-reader-panel h3")
				?.textContent
				.trim() === title,
		{},
		module.title
	);
}

async function chooseView(page, position) {
	await page
		.locator(`.lesson-view-toggle button:nth-child(${position})`)
		.click();
	await page.waitForSelector(
		`.lesson-view-toggle button:nth-child(${position})[aria-pressed='true']`
	);
}

async function checkTableLayout(
	page,
	anchor,
	width,
	stressWideTable,
	expectedParagraphBreaks
) {
	const result = await page.evaluate(
		({ anchor, stressWideTable, expectedParagraphBreaks }) => {
			const content = document
				.getElementById(anchor)
				.querySelector(".item-content-markdown");
			const wrappers = [
				...content.querySelectorAll(".markdown-table-scroll")
			];
			const compactTablesFit = wrappers.every(
				wrapper =>
					wrapper.querySelectorAll("thead th").length > 3
					|| wrapper.scrollWidth <= wrapper.clientWidth + 2
			);
			let wideTableScrolls = null;
			if (stressWideTable && wrappers.length) {
				const clone = content.cloneNode(true);
				try {
					for (const row of clone.querySelectorAll("tr")) {
						while (row.children.length < 12)
							row.append(row.children[0].cloneNode(true));
					}
					content.parentElement.append(clone);
					const wide = clone.querySelector(".markdown-table-scroll");
					wideTableScrolls
						= wide.scrollWidth > wide.clientWidth
							&& document.documentElement.scrollWidth <= innerWidth;
				}
				finally {
					clone.remove();
				}
			}
			return {
				compactTablesFit,
				wideTableScrolls,
				observedParagraphBreaks:
					content.querySelectorAll(":scope > p > br").length,
				expectedParagraphBreaks,
				forcedParagraphBreaks:
					content.querySelectorAll(":scope > p > br").length
					- expectedParagraphBreaks
			};
		},
		{ anchor, stressWideTable, expectedParagraphBreaks }
	);
	assert.equal(
		result.compactTablesFit,
		true,
		`Compact comparison tables fit the ${width}px reading pane`
	);
	assert.equal(
		result.forcedParagraphBreaks,
		0,
		"Paragraph breaks match the reviewed prose and equation layout"
	);
	if (stressWideTable) {
		assert.equal(
			result.wideTableScrolls,
			true,
			"Genuinely wide tables keep independent scrolling"
		);
	}
	return result;
}

async function checkCards(page, module, expected, optional, resourceViews, profileName, assignmentViews) {
	const rows = await page.$$eval(
		"#course-reader-panel .lesson-list > .lesson-item",
		items =>
			items.map(item => ({
				id: item.id,
				title: item.querySelector("h5")?.textContent.trim(),
				classes: item.querySelector(".lesson-card")?.className
			}))
	);
	assert.deepEqual(
		rows.map(row => row.title),
		expected.map(item => item.title),
		`${module.title}: exact assignment placement`
	);
	for (const [index, item] of expected.entries()) {
		assert.equal(rows[index].id, `${module.id}-${item.id}`);
		assert.ok(
			rows[index].classes
				.split(/\s+/)
				.includes(
					`is-${item.learningPath ?? (optional ? "choice" : "core")}`
				),
			`${item.title}: path label`
		);
		if (item.requiredDirective) {
			await page.waitForFunction(
				({ id, required, textMode, scope }) => {
					const row = document.getElementById(id);
					const actual = row
						?.querySelector(".assignment-content")?.[textMode]
						.replace(/\s+/g, " ")
						.trim();
					return scope === "complete" ? actual === required : actual?.includes(required);
				},
				{},
				{
					id: rows[index].id,
					required: item.requiredDirective,
					textMode: item.directiveTextMode ?? "textContent",
					scope: item.assignmentTextScope
				}
			).catch(async (error) => {
				const actual = await page.$eval(
					`#${rows[index].id} .assignment-content`,
					(element, mode) => element[mode].replace(/\s+/g, " ").trim(),
					item.directiveTextMode ?? "textContent"
				);
				throw new Error(
					`${item.title}: complete assignment text did not match.\nExpected: ${item.requiredDirective}\nActual: ${actual}`,
					{ cause: error }
				);
			});
			const actual = await page.$eval(
				`#${rows[index].id} .assignment-content`,
				(element, mode) => element[mode].replace(/\s+/g, " ").trim(),
				item.directiveTextMode ?? "textContent"
			);
			assignmentViews.push({
				module: module.id,
				item: item.id,
				section: optional ? "optional" : "core",
				scope: item.assignmentTextScope ?? "directive",
				expectedTextSHA256: digest(item.requiredDirective),
				renderedTextSHA256: digest(actual)
			});
		}
		for (const check of item.selfChecks ?? []) {
			const selector = `#${rows[index].id} .assignment-content a[href=${JSON.stringify(check.href)}]`;
			assert.equal(await page.$eval(selector, element => element.textContent.trim()), check.label);
			await page.$eval(selector, (element) => {
				element.target = "_self";
			});
			await page.locator(selector).click();
			await page.waitForSelector(".course-resource-card .item-content-markdown");
			assert.equal(new URL(page.url()).searchParams.get("asset"), check.asset);
			assert.equal(await page.$(".course-resource-error"), null);
			assert.equal(await page.$eval(".course-resource-page h1", element => element.textContent.trim()), check.heading);
			await page.waitForFunction(text => document.querySelector(".course-resource-card .item-content-markdown")?.textContent.replace(/\s+/g, " ").trim() === text, {}, check.expectedText);
			assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, `${check.heading}: no viewer overflow`);
			const titleLayout = await page.$eval(".course-resource-page h1", (element) => {
				const bounds = element.getBoundingClientRect();
				const range = document.createRange();
				range.selectNodeContents(element);
				const textBounds = range.getBoundingClientRect();
				return {
					withinViewport: bounds.left >= 0 && bounds.right <= innerWidth,
					textFits: textBounds.left >= bounds.left - 1 && textBounds.right <= bounds.right + 1
				};
			});
			assert.ok(titleLayout.withinViewport && titleLayout.textFits, `${check.heading}: complete viewer title fits`);
			let comparisonTables;
			if (/#capstone-(?:domain|growth)-stress-test$/.test(check.asset)) {
				comparisonTables = await page.$$eval(".course-resource-card .item-content-markdown table", tables => tables.map((table) => {
					const available = table.closest(".item-content-markdown").getBoundingClientRect();
					const bounds = table.getBoundingClientRect();
					return { columns: table.rows[0].cells.length, fits: bounds.left >= available.left - 1 && bounds.right <= available.right + 1, width: bounds.width, availableWidth: available.width };
				}));
				assert.equal(comparisonTables.length, 2, `${check.heading}: both original and changed cases`);
				assert.ok(comparisonTables.every(table => table.columns === 3 && table.fits), `${check.heading}: all compared values fit the viewer`);
			}

			let priceTokens;
			if (/\/(?:judgment|capstone)-checks\.md#core-answers$/.test(check.asset)) {
				const expected = check.asset.includes("/judgment-")
					? ["2300", "2000", "2480", "2160", "2700"]
					: ["200", "280", "180", "300"];
				priceTokens = await page.$eval(".course-resource-card .item-content-markdown", (element, values) => {
					const available = element.getBoundingClientRect();
					return values.map((value) => {
						const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
						const matches = [];
						while (walker.nextNode()) {
							const node = walker.currentNode;
							if (node.parentElement.closest("pre,code")) continue;
							for (const match of node.textContent.matchAll(new RegExp(`\\b${value}\\b`, "g"))) {
								const range = document.createRange();
								range.setStart(node, match.index);
								range.setEnd(node, match.index + value.length);
								const rectangles = Array.from(range.getClientRects()).filter(rect => rect.width > 0);
								matches.push(rectangles.length === 1 && rectangles[0].left >= available.left - 1 && rectangles[0].right <= available.right + 1);
							}
						}
						return { value, occurrences: matches.length, unbrokenAndVisible: matches.length > 0 && matches.every(Boolean) };
					});
				}, expected);
				assert.ok(priceTokens.every(token => token.unbrokenAndVisible), `${check.heading}: complete price values fit on one line`);
			}
			resourceViews.push({ item: item.id, asset: check.asset, fullTextSHA256: digest(check.expectedText), titleLayout, ...(comparisonTables ? { comparisonTables } : {}), ...(priceTokens ? { priceTokens } : {}) });
			if (check.label === "Project self-check" || check.asset.endsWith("#optional-percent-changes")) {
				await page.screenshot({ path: join(process.env.SELF_STUDY_BROWSER_PROOF_DIR ?? "output/self-study-browser", `${profileName}-${item.id}-self-check.png`), fullPage: true });
			}
			await page.goBack({ waitUntil: "domcontentloaded" });
			await page.waitForSelector(`#${rows[index].id}`);
		}
	}
	return rows.map(row => row.id);
}

test(
	"reviewed self-study readings and assignments in both roles and viewport sizes",
	{ timeout: 900000 },
	async () => {
		const previous = process.cwd();
		const output = resolve(
			previous,
			process.env.SELF_STUDY_BROWSER_PROOF_DIR
			?? "output/self-study-browser"
		);
		const taskId
			= process.env.CLASSES_FAMILY_TASK_ID ?? "self-study-browser";
		const startedAt = new Date().toISOString();
		const profiles = [];
		let browser;
		let server;
		let passed = false;
		console.log(
			JSON.stringify({
				event: "start",
				taskId,
				cwd: root,
				command: "self-study-course-browser",
				pid: process.pid,
				startedAt,
				timeoutMs: 900000
			})
		);
		try {
			await mkdir(output, { recursive: true });
			if (sourceMode === "build") {
				assert.ok(
					existsSync(join(root, "dist/index.html")),
					"Build this checkout before checking its pages"
				);
			}
			process.chdir(root);
			if (sourceMode === "dev") {
				server = await createServer({
					root,
					server: { host: "127.0.0.1", port: 0, strictPort: true, open: false }
				});
				await server.listen();
			}
			else {
				server = await preview({
					root,
					preview: { host: "127.0.0.1", port: 0, strictPort: true }
				});
			}
			const origin = `http://127.0.0.1:${server.httpServer.address().port}`;
			const executablePath = [
				process.env.PUPPETEER_EXECUTABLE_PATH,
				puppeteer.executablePath(),
				"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
				"/usr/bin/google-chrome",
				"/usr/bin/chromium"
			].find(value => typeof value === "string" && existsSync(value));
			assert.ok(executablePath, "Chrome is required");
			browser = await puppeteer.launch({
				executablePath,
				headless: true,
				args: ["--no-sandbox"]
			});
			for (const role of ["learner", "instructor"]) {
				for (const width of [390, 1280]) {
					for (const id of selectedCourseIds) {
						const fixture = JSON.parse(
							await readFile(
								join(output, `${id}-${role}.json`),
								"utf8"
							)
						);
						assert.equal(fixture.id, id);
						assert.equal(fixture.role, role);
						if (process.env.GITHUB_SHA) {
							assert.equal(
								fixture.sourceCommit,
								process.env.GITHUB_SHA
							);
						}
						const name = `${id}-${role}-${width}`;
						const context = await browser.createBrowserContext();
						const page = await context.newPage();
						let writes = 0;
						const pageErrors = [];
						const readings = [];
						const assignments = [];
						const resourceViews = [];
						const assignmentViews = [];
						try {
							await page.setViewport({ width, height: 900 });
							page.setDefaultTimeout(20000);
							page.on("pageerror", error =>
								pageErrors.push(String(error)));
							await page.setRequestInterception(true);
							page.on("request", (request) => {
								if (request.isInterceptResolutionHandled())
									return;
								const url = new URL(request.url());
								if (
									url.origin !== origin
									|| url.pathname.startsWith("/api/")
								) {
									if (
										!["GET", "OPTIONS"].includes(
											request.method()
										)
									) {
										writes++;
									}
									void request.respond({
										status: 200,
										contentType: "application/json",
										body: JSON.stringify(
											url.origin === origin
												? account(url.pathname, role)
												: {}
										)
									});
								}
								else {
									void request.continue();
								}
							});
							const [accountResponse] = await Promise.all([
								page.waitForResponse(
									response =>
										response.request().method() === "GET"
										&& new URL(response.url()).pathname
										=== "/api/accounts/me"
								),
								page.goto(
									`${origin}/courses#${fixture.modules[0].id}`,
									{ waitUntil: "networkidle2" }
								)
							]);
							assert.equal(accountResponse.status(), 200);
							await page.waitForFunction(
								role =>
									document
										.querySelector(".site-nav__badge")
										?.textContent
										.trim()
										=== (role === "instructor"
											? "Tutor"
											: "Student"),
								{},
								role
							);
							await page.waitForFunction(
								id =>
									document.querySelector("#course-select")
										?.value === id,
								{},
								id
							);
							const outline = await page.$$eval(
								".outline-button:not(.is-reference) strong",
								items =>
									items.map(item => item.textContent.trim())
							);
							assert.deepEqual(
								outline,
								fixture.modules.filter(module => module.kind !== "appendix").map(module => module.title),
								"Every teaching module is reachable in its teaching group"
							);
							const references = await page.$$eval(
								".outline-button.is-reference",
								buttons =>
									buttons.map(button => ({
										title: button
											.querySelector("strong")
											.textContent
											.trim(),
										group: button
											.closest(".outline-section")
											.querySelector(
												".outline-section-label"
											)
											.textContent
											.trim()
									}))
							);
							assert.deepEqual(
								references,
								fixture.referenceModules.map(module => ({
									title: module.title,
									group: "References"
								})),
								"Legitimate reference appendices retain their separate navigation group"
							);
							for (const module of fixture.internalModules) {
								assert.ok(
									![
										...outline,
										...references.map(r => r.title)
									].includes(module.title),
									"Maintenance records stay outside navigation"
								);
							}
							for (const [
								index,
								module
							] of fixture.modules.entries()) {
								if (fixture.reviewedModuleIds && !fixture.reviewedModuleIds.includes(module.id)) continue;
								const groupIndex = fixture.modules.slice(0, index).filter(candidate => candidate.kind === module.kind).length;
								await chooseModule(page, module, groupIndex);
								await chooseView(page, 3);
								for (const item of module.readings) {
									const anchor = `${module.id}-${item.id}`;
									await page.waitForFunction(
										({ anchor, expected }) =>
											document
												.getElementById(anchor)
												?.querySelector(
													".item-content-markdown"
												)
												?.textContent
												.replace(
													/\s+/g,
													" "
												)
												.trim() === expected,
										{},
										{ anchor, expected: item.expectedText }
									);
									const actual = await page.$eval(
										`[id=${JSON.stringify(anchor)}] .item-content-markdown`,
										element => ({
											text: element.textContent
												.replace(/\s+/g, " ")
												.trim(),
											tableRows:
												element.querySelectorAll(
													"tbody tr"
												).length
										})
									);
									assert.equal(
										actual.tableRows,
										item.tableRows
									);
									const tableLayout = await checkTableLayout(
										page,
										anchor,
										width,
										width === 1280
										&& module.title
										=== "MSC16 Sentence Types",
										item.paragraphBreaks
									);
									const imageLoads = [];
									for (const image of item.images) {
										const before = await page.$eval(`#${anchor}`, (card, expected) => {
											const element = [...card.querySelectorAll("img")].find(candidate => candidate.getAttribute("src") === expected.src && candidate.alt === expected.alt);
											if (!element) throw new Error(`Missing expected image: ${expected.src}`);
											const state = { src: expected.src, loading: element.loading, complete: element.complete, naturalWidth: element.naturalWidth, viewportTop: element.getBoundingClientRect().top };
											element.scrollIntoView({ block: "center", inline: "nearest" });
											return state;
										}, image);
										await page.waitForFunction(
											({ anchor, image }) =>
												[
													...document
														.getElementById(anchor)
														.querySelectorAll("img")
												].some(
													element =>
														element.getAttribute(
															"src"
														) === image.src
														&& element.alt
														=== image.alt
														&& element.complete
														&& element.naturalWidth > 0
												),
											{},
											{ anchor, image }
										);
										imageLoads.push({ before, loaded: true });
									}
									assert.equal(
										await page.$eval(
											`[id=${JSON.stringify(anchor)}]`,
											(element) => {
												const next
													= document.querySelector(
														"#course-reader-panel .learning-card"
													);
												return (
													!next
													|| !!(
														element.compareDocumentPosition(
															next
														)
														& Node.DOCUMENT_POSITION_FOLLOWING
													)
												);
											}
										),
										true,
										"Complete reading precedes project summaries"
									);
									readings.push({
										module: module.id,
										id: item.id,
										contentSHA256: item.contentSHA256,
										renderedTextSHA256: digest(actual.text),
										tableRows: actual.tableRows,
										imagesLoaded: item.images.length,
										imageLoads,
										tableLayout
									});
								}
								assert.equal(
									await page.evaluate(
										() =>
											document.documentElement
												.scrollWidth <= innerWidth
									),
									true,
									`${module.title}: no page overflow`
								);
								if (
									index === 0
									|| (["intro-to-physics", "physics-level-2"].includes(id) && /^(?:Standards Map|Course Roadmap)$/.test(module.title))
									|| (id === "physics-level-2" && /^(?:PHY12|PHY16|PHY17|PHY23) /.test(module.title))
									|| (id === "algebra-1a" && /^AA(?:1|11) /.test(module.title))
									|| Object.hasOwn(focusedReadingCounts, id)
									|| id === "early-elementary-b-picture-book"
									|| (id === "early-elementary-a-reading" && /^(?:JoR1 |JoR2 |JoR5 |JoR Check-In|JoR6 )/.test(module.title))
									|| (id === "late-elementary-b-math" && /^(?:LEB3 |LEB4 |LEB5 |LEB6 |LEB10 |LEB12 |LEB16 |LEB17 |LEB18 )/.test(module.title))
									|| (id === "late-elementary-a-math" && /^(?:LEA1 |LEA4 |LEA9 |LEA12 |LEA13 |LEA16 |LEA17 )/.test(module.title))
									|| (id === "early-elementary-b-math" && /^(?:EEB8 |EEB9 |EEB11 |EEB12 |EEB13 |EEB16 |EEB17 )/.test(module.title))
									|| (id === "early-elementary-a-math" && /^(?:EEA1 |EEA13 |EEA15 |EEA16 |EEA19 )/.test(module.title))
									|| (id === "algebra-1b" && /^AB(?:1|19) /.test(module.title))
									|| module.readings.some(
										item => item.images.length
									)
									|| /Financial Feasibility|Sentence Types|Analyzing Evidence|Entry Diagnostic|Exit Diagnostic|NW10 Writing Dialogue|MYP7 Defense Attorney|MYP9 Master Project/.test(
										module.title
									)
								) {
									await page.$eval(
										"#course-reader-panel",
										element =>
											element.scrollIntoView({
												block: "start"
											})
									);
									await page.screenshot({
										path: join(
											output,
											`${name}-${index + 1}-learn.png`
										)
									});
								}
								await chooseView(page, 1);
								const core = await checkCards(
									page,
									module,
									module.projects,
									false,
									resourceViews,
									name,
									assignmentViews
								);
								if ((Object.hasOwn(focusedReadingCounts, id) && module.title === "GrS2 Loops") || (index === 0 && ["early-elementary-a-reading", "early-elementary-b-picture-book"].includes(id)) || module.projects.some(item => /^(?:Punctuation Treasure Hunt|Picture Book Assembly Portfolio)$/.test(item.title))) {
									await page.screenshot({ path: join(output, `${name}-${index + 1}-complete-projects.png`), fullPage: true });
								}
								await chooseView(page, 2);
								const optional = await checkCards(
									page,
									module,
									module.optional,
									true,
									resourceViews,
									name,
									assignmentViews
								);
								assignments.push({
									module: module.id,
									core,
									optional
								});
							}
							let orbitExperiment;
							if (id === "late-elementary-b-math") {
								const index = fixture.modules.findIndex(module => module.title.startsWith("LEB18 "));
								const module = fixture.modules[index];
								const groupIndex = fixture.modules.slice(0, index).filter(candidate => candidate.kind === module.kind).length;
								await chooseModule(page, module, groupIndex);
								await chooseView(page, 1);
								orbitExperiment = await checkOrbitExperiment(page, output, name);
							}
							assert.equal(writes, 0);
							if (id === "middle-school-integrated-science") assert.equal(resourceViews.length, 117);
							if (id === "pre-algebra-a") assert.equal(resourceViews.length, 23);
							if (id === "geometry-a") assert.equal(resourceViews.length, 17);
							if (id === "geometry-b") assert.equal(resourceViews.length, 13);
							if (id === "early-elementary-a-math") assert.equal(resourceViews.length, 70);
							if (id === "early-elementary-b-math") assert.equal(resourceViews.length, 61);
							if (id === "late-elementary-a-math") assert.equal(resourceViews.length, 62);
							if (id === "late-elementary-b-math") assert.equal(resourceViews.length, 66);
							if (id === "early-elementary-a-reading") assert.equal(resourceViews.length, 17);
							if (id === "early-elementary-b-picture-book") assert.equal(resourceViews.length, 26);
							if (id === "algebra-1a") assert.equal(resourceViews.length, 7);
							if (id === "algebra-1b") assert.equal(resourceViews.length, 3);
							if (id === "algebra-2a") assert.equal(resourceViews.length, 4);
							if (id === "algebra-2b") assert.equal(resourceViews.length, 3);
							assert.deepEqual(pageErrors, []);
							profiles.push({
								id,
								role,
								width,
								sourceCommit: fixture.sourceCommit,
								moduleViews: assignments.length,
								reviewScope: fixture.reviewScope,
								reviewedModuleIds: fixture.reviewedModuleIds,
								completeReadings: readings,
								resourceViews,
								assignmentViews,
								assignments,
								orbitExperiment,
								internalModulesExcluded:
									fixture.internalModules,
								referenceModulesSeparate: references,
								pageErrors,
								writes
							});
							await writeFile(
								join(output, "browser-proof.json"),
								`${JSON.stringify(
									{ complete: false, profiles },
									null,
									2
								)}\n`
							);
							console.log(
								JSON.stringify({
									event: "verified-self-study-course",
									id,
									role,
									width,
									modules: assignments.length,
									readings: readings.length,
									preservedPublishedIdentities:
										fixture.publishedIdentities,
									restoredIdentities:
										fixture.restoredIdentities,
									sourceProjects: fixture.sourceProjects,
									writes
								})
							);
						}
						catch (error) {
							await page
								.screenshot({
									path: join(output, `${name}-failed.png`),
									fullPage: true
								})
								.catch(() => {});
							await writeFile(
								join(output, `${name}-failed.json`),
								`${JSON.stringify(
									{
										id,
										role,
										width,
										url: page.url(),
										error: String(error),
										pageErrors,
										readings,
										assignments
									},
									null,
									2
								)}\n`
							);
							throw error;
						}
						finally {
							await context.close();
						}
					}
				}
			}
			assert.equal(profiles.length, expectedProfiles);
			assert.equal(
				profiles.reduce(
					(total, profile) => total + profile.completeReadings.length,
					0
				),
				expectedReadingViews
			);
			await writeFile(
				join(output, "browser-proof.json"),
				`${JSON.stringify(
					{
						complete: true,
						sourceMode,
						sourceCommit: profiles[0].sourceCommit,
						selectedCourseIds,
						expectedProfiles,
						expectedReadingViews,
						profiles
					},
					null,
					2
				)}\n`
			);
			passed = true;
		}
		finally {
			try {
				if (browser) await browser.close();
			}
			finally {
				if (sourceMode === "dev" && server) {
					await server.close();
				}
				else if (server?.httpServer) {
					await new Promise(resolve =>
						server.httpServer.close(resolve)
					);
				}
				process.chdir(previous);
				console.log(
					JSON.stringify({
						event: "end",
						taskId,
						cwd: root,
						command: "self-study-course-browser",
						pid: process.pid,
						startedAt,
						endedAt: new Date().toISOString(),
						exitCode: passed ? 0 : 1,
						cleanup:
							"browser contexts, browser and preview server closed"
					})
				);
			}
		}
	}
);
