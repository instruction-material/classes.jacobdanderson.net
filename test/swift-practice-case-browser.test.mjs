import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { existsSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
// eslint-disable-next-line test/no-import-node-test -- Actual course browser gate.
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import puppeteer from "puppeteer";
import { preview } from "vite";

const root = fileURLToPath(new URL("../", import.meta.url));
const courseID = "intro-to-swift-app-development";
const baseline = JSON.parse(
	await readFile(
		new URL(
			"../front-end/test/fixtures/swift-practice-progress-before.json",
			import.meta.url
		),
		"utf8"
	)
);
const workspaceKey = "classes-python-ide-projects:anonymous";
const earlierWork = JSON.stringify([
	{
		_id: "earlier-swift-attempt",
		title: "Saved tracker work",
		mode: "swift",
		files: [
			{
				name: "ContentView.swift",
				content: "// Earlier saved learner work\n",
				encoding: "text"
			}
		],
		activeFileName: "ContentView.swift",
		courseID,
		courseProjectKey: `${courseID}:simple-tracker:starter:native-swift-v1`,
		createdAt: "2026-10-01T12:00:00.000Z",
		updatedAt: "2026-10-01T12:00:00.000Z"
	}
]);

test(
	"Swift practice: all saved cases render with relevant tasks and resource controls",
	{ timeout: 600000 },
	async (t) => {
		let server, browser, context;
		const output = path.resolve(
			process.env.SWIFT_PRACTICE_BROWSER_DIR
			?? "output/swift-practice-cases"
		);
		const startedAt = new Date().toISOString();
		const taskId
			= process.env.CLASSES_FAMILY_TASK_ID ?? "swift-practice-cases";
		const proof = {
			accepted: false,
			startedAt,
			profiles: [],
			sourceHashes: {},
			sourceRequests: 0,
			remoteWrites: 0,
			fullResourceViews: 0
		};
		const cleanup = async () => {
			if (context) {
				await context.close().catch(() => {});
				context = null;
			}
			if (browser) {
				await browser.close();
				browser = null;
			}
			if (server) {
				await server.close();
				server = null;
			}
		};
		t.signal.addEventListener(
			"abort",
			() => {
				void cleanup();
			},
			{ once: true }
		);
		console.log(
			JSON.stringify({
				event: "start",
				parentTaskId: taskId,
				parentPid: process.ppid,
				pid: process.pid,
				cwd: root,
				command: process.argv,
				startedAt,
				timeoutMs: 600000
			})
		);
		try {
			await mkdir(path.join(output, "screenshots"), { recursive: true });
			assert.equal(baseline.rows.length, 41);
			assert.ok(
				existsSync(path.join(root, "front-end/dist/index.html")),
				"Build this exact source before browser validation"
			);
			for (const name of [
				"test/swift-practice-case-browser.test.mjs",
				"front-end/test/fixtures/swift-practice-progress-before.json",
				"front-end/src/components/CourseExplorer.vue",
				"front-end/src/stores/courses/intro-to-swift-app-development.ts",
				"front-end/public/course-assets/swift/intro-swift-practice-pack.md",
				"front-end/public/course-assets/swift/intro-swift-verification-guide.md"
			]) {
				proof.sourceHashes[name] = createHash("sha256")
					.update(await readFile(path.join(root, name)))
					.digest("hex");
			}
			server = await preview({
				root: path.join(root, "front-end"),
				preview: { host: "127.0.0.1", port: 0, strictPort: true }
			});
			const origin = server.resolvedUrls.local[0].replace(/\/$/u, "");
			const executablePath = [
				process.env.PUPPETEER_EXECUTABLE_PATH,
				await puppeteer.executablePath(),
				"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
				"/usr/bin/google-chrome",
				"/usr/bin/chromium"
			].find(value => value && existsSync(value));
			assert.ok(executablePath, "Use an existing Chrome installation");
			browser = await puppeteer.launch({
				executablePath,
				headless: true,
				args: ["--no-sandbox"]
			});
			const learner = {
				_id: "practice-learner",
				name: "Learner fixture",
				email: "learner@example.invalid",
				age: 14,
				state: "GA",
				courseAccess: [courseID],
				courseProgress: []
			};
			const tutor = {
				_id: "practice-tutor",
				name: "Tutor fixture",
				email: "tutor@example.invalid",
				age: 30,
				state: "GA",
				usersOfTutorLength: 1,
				coursePermissions: [courseID],
				editTutors: false,
				saveEdit: "Save"
			};
			for (const width of [390, 1280]) {
				for (const role of ["learner", "tutor"]) {
					context = await browser.createBrowserContext();
					const page = await context.newPage();
					await page.setViewport({ width, height: 900 });
					await page.emulateMediaFeatures([
						{ name: "prefers-reduced-motion", value: "reduce" }
					]);
					await page.evaluateOnNewDocument(
						(key, value) => {
							if (localStorage.getItem(key) === null)
								localStorage.setItem(key, value);
						},
						workspaceKey,
						earlierWork
					);
					const intercept = async (target) => {
						await target.setRequestInterception(true);
						target.on("request", (request) => {
							const url = new URL(request.url());
							if (
								url.hostname === "raw.githubusercontent.com"
								|| url.hostname === "api.github.com"
							) {
								proof.sourceRequests++;
							}
							if (
								url.origin !== origin
								|| url.pathname.startsWith("/api/")
							) {
								if (
									!["GET", "OPTIONS"].includes(
										request.method()
									)
								) {
									proof.remoteWrites++;
								}
								let body = {};
								if (url.pathname === "/api/accounts/me") {
									body
										= role === "learner"
											? { userID: learner._id }
											: { tutorID: tutor._id };
								}
								if (url.pathname === "/api/users/loggedin")
									body = { currentUser: learner };
								if (url.pathname === "/api/tutors/loggedin")
									body = { currentTutor: tutor };
								if (
									url.pathname
									=== `/api/users/oftutor/${tutor._id}`
								) {
									body = [learner];
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
					};
					await intercept(page);
					let selectedModule = "";
					let viewed = 0;
					for (const [index, row] of baseline.rows.entries()) {
						proof.currentCase = {
							width,
							role,
							id: row.id,
							caseUrl: row.caseUrl
						};
						await writeFile(
							path.join(output, "proof.json"),
							`${JSON.stringify(proof, null, 2)}\n`
						);
						if (selectedModule !== row.moduleId) {
							await page.goto(
								`${origin}/courses#${row.moduleId}`,
								{ waitUntil: "domcontentloaded" }
							);
							const toggle
								= ".lesson-view-toggle button:nth-child(2)";
							await page.waitForSelector(toggle);
							await page.locator(toggle).click();
							await page.waitForSelector(
								`${toggle}[aria-pressed='true']`
							);
							selectedModule = row.moduleId;
						}
						const selector = `#${row.moduleId}-${row.id}`;
						await page.waitForSelector(selector);
						await page.waitForFunction(
							(selector, task) =>
								document
									.querySelector(selector)
									?.textContent
									.includes(task),
							{},
							selector,
							row.taskText
						);
						const rendered = await page.$eval(
							selector,
							element => ({
								title: element.querySelector("h5")?.textContent,
								links: [
									...element.querySelectorAll(
										".resource-list a"
									)
								].map(link => ({
									href: link.getAttribute("href"),
									label: link
										.querySelector(".resource-link-label")
										?.textContent
										?.trim(),
									ide: link.classList.contains(
										"is-ide-starter"
									),
									solution:
										link.classList.contains("is-solution")
								})),
								width: element.getBoundingClientRect().width,
								scrollWidth: element.scrollWidth
							})
						);
						assert.equal(rendered.title, row.title);
						assert.ok(
							rendered.links.every(
								link =>
									!link.ide
									&& !/\/Swift\/tree\/[^/]+\/SAD-\d{2}-/u.test(
										link.href ?? ""
									)
							)
						);
						const cases = rendered.links.filter(
							link =>
								link.href?.startsWith("/course-resource?")
								&& new URL(link.href, origin).searchParams.get(
									"asset"
								) === row.caseUrl
						);
						assert.equal(
							cases.length,
							1,
							"One practice action without duplicate dataset links"
						);
						assert.ok(cases[0].label.startsWith("Practice case"));
						assert.equal(
							rendered.links.filter(link => link.solution).length,
							role === "tutor" ? 1 : 0
						);
						assert.ok(
							rendered.scrollWidth
							<= Math.ceil(rendered.width) + 2,
							"Practice card fits its viewport"
						);
						await page
							.locator(`${selector} .course-asset-preview-toggle`)
							.click();
						await page.waitForFunction(
							selector =>
								document
									.querySelector(
										`${
											selector
										} .course-asset-preview-content .item-content-markdown`
									)
									?.textContent
									.includes("Task"),
							{},
							selector
						);
						assert.equal(
							await page.$(
								`${selector} .course-asset-preview-error`
							),
							null
						);
						const fullLink = await page.$eval(
							`${selector} .course-asset-preview-open-link`,
							link => link.getAttribute("href")
						);
						assert.equal(
							new URL(fullLink, origin).searchParams.get("asset"),
							row.caseUrl
						);
						if (role === "tutor") {
							await page.select(
								`${selector} .course-asset-preview-control select`,
								row.verificationUrl
							);
							await page.waitForFunction(
								(selector, key) =>
									document
										.querySelector(
											`${
												selector
											} .course-asset-preview-open-link`
										)
										?.getAttribute("href")
										?.includes(encodeURIComponent(key))
										&& document
											.querySelector(
												`${
													selector
												} .course-asset-preview-content .item-content-markdown`
											)
											?.textContent
											.trim()
											.length > 0,
								{},
								selector,
								row.verificationUrl
							);
						}
						if (index === 0) {
							const viewer = await context.newPage();
							try {
								await viewer.setViewport({
									width,
									height: 900
								});
								await intercept(viewer);
								await viewer.goto(
									new URL(fullLink, origin).href,
									{ waitUntil: "domcontentloaded" }
								);
								await viewer.waitForFunction(() =>
									document
										.querySelector(".item-content-markdown")
										?.textContent
										.includes(
											"Supplied environment record"
										)
								);
								proof.fullResourceViews++;
							}
							finally {
								await viewer.close();
							}
						}
						if ([0, 32].includes(index)) {
							await page.$eval(
								`${selector} .course-asset-preview`,
								element =>
									element.scrollIntoView({ block: "center" })
							);
							await page.screenshot({
								path: path.join(
									output,
									"screenshots",
									`${role}-${width}-${index}.png`
								)
							});
						}
						assert.equal(
							await page.evaluate(
								key => localStorage.getItem(key),
								workspaceKey
							),
							earlierWork
						);
						viewed++;
					}
					proof.profiles.push({
						role,
						width,
						cases: viewed,
						savedIDsRecognized: viewed,
						inlineCaseViews: viewed,
						inlineVerificationViews: role === "tutor" ? viewed : 0,
						earlierWorkspacePreserved: true
					});
					await context.close();
					context = null;
				}
			}
			assert.equal(proof.profiles.length, 4);
			assert.equal(
				proof.profiles.reduce((sum, profile) => sum + profile.cases, 0),
				164
			);
			assert.equal(proof.fullResourceViews, 4);
			assert.equal(proof.sourceRequests, 0);
			assert.equal(proof.remoteWrites, 0);
			proof.accepted = true;
		}
		finally {
			await cleanup();
			proof.finishedAt = new Date().toISOString();
			await writeFile(
				path.join(output, "proof.json"),
				`${JSON.stringify(proof, null, 2)}\n`
			);
			console.log(
				JSON.stringify({
					event: "end",
					parentTaskId: taskId,
					parentPid: process.ppid,
					pid: process.pid,
					cwd: root,
					command: process.argv,
					startedAt,
					finishedAt: proof.finishedAt,
					exitCode: proof.accepted ? 0 : 1,
					timeoutMs: 600000,
					cleanup:
						"Owned pages, contexts, browser and preview server closed"
				})
			);
		}
	}
);
