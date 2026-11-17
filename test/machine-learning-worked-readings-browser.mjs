import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { existsSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { join, resolve } from "node:path";
import process from "node:process";

async function main() {
	const checkout = resolve(process.argv[2]);
	const output = resolve(process.argv[3]);
	const config = process.argv[4];
	const require = createRequire(join(checkout, "package.json"));
	const { createServer, preview } = await import(require.resolve("vite"));
	const MarkdownIt = require("markdown-it");
	const puppeteer = require("puppeteer");

	const markdown = new MarkdownIt();
	const directory = join(
		checkout,
		"front-end/src/stores/courses/readings/machine-learning-worked-cores"
	);
	const definition = JSON.parse(
		await readFile(
			join(
				checkout,
				"test/fixtures/machine-learning-worked-reading-cases.json"
			),
			"utf8"
		)
	);
	assert.equal(definition.items, 13);
	const cases = definition.cases.map(item => [
		item.moduleId.replace(/^machine-learning-/, ""),
		item.title,
		item.file,
		item.view,
		item.staticAudit
	]);
	assert.equal(cases.length, 13);
	process.chdir(join(checkout, "front-end"));
	await mkdir(output, { recursive: true });
	let server, browser, context, page;
	const profiles = [];
	const startedAt = new Date().toISOString();
	let activeCase;
	console.log(
		JSON.stringify({
			event: "start",
			taskId: process.env.CLASSES_FAMILY_TASK_ID,
			pid: process.pid,
			parentPid: process.ppid,
			cwd: process.cwd(),
			command: process.argv,
			startedAt,
			timeoutMs:
				Number(process.env.CLASSES_FAMILY_HEAVY_TIMEOUT_MS) || 300000
		})
	);
	try {
		server = config
			? await createServer({
					configFile: config,
					server: {
						host: "127.0.0.1",
						port: 0,
						strictPort: true,
						watch: {
							ignored: [
								"**/node_modules/**",
								"**/dist/**",
								"**/output/**",
								"**/coverage/**",
								"**/.git/**"
							]
						}
					}
				})
			: await preview({
					root: join(checkout, "front-end"),
					preview: { host: "127.0.0.1", port: 0, strictPort: true }
				});
		if (config) await server.listen();
		const origin = server.resolvedUrls.local[0].replace(/\/$/, "");
		const executablePath = [
			process.env.PUPPETEER_EXECUTABLE_PATH,
			await puppeteer.executablePath(),
			"/usr/bin/google-chrome",
			"/usr/bin/chromium",
			"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
		].find(path => typeof path === "string" && path && existsSync(path));
		assert.ok(executablePath, "An existing Chrome installation is required");
		browser = await puppeteer.launch({
			executablePath,
			headless: true,
			args: ["--no-sandbox"]
		});
		for (const role of ["learner", "instructor"]) {
			for (const width of [390, 1280]) {
				context = await browser.createBrowserContext();
				page = await context.newPage();
				await page.setViewport({ width, height: 900 });
				page.setDefaultTimeout(30000);
				const errors = [];
				let writes = 0;
				page.on("pageerror", error => errors.push(String(error)));
				const user = {
					_id: "ml-reading-user",
					name: "Course fixture",
					email: "learner@example.invalid",
					age: 14,
					state: "GA",
					courseAccess: ["machine-learning"],
					courseProgress: []
				};
				await page.setRequestInterception(true);
				page.on("request", (request) => {
					if (request.isInterceptResolutionHandled()) return;
					const url = new URL(request.url());
					if (
						url.origin !== origin
						|| url.pathname.startsWith("/api/")
					) {
						if (!["GET", "OPTIONS"].includes(request.method()))
							writes++;
						let body = {};
						if (url.pathname === "/api/accounts/me") {
							body
								= role === "instructor"
									? { tutorID: "ml-reading-tutor" }
									: { userID: user._id };
						}
						if (
							url.pathname === "/api/users/loggedin"
							&& role === "learner"
						) {
							body = { currentUser: user };
						}
						if (
							url.pathname === "/api/tutors/loggedin"
							&& role === "instructor"
						) {
							body = {
								currentTutor: {
									_id: "ml-reading-tutor",
									name: "Course fixture",
									email: "tutor@example.invalid",
									age: 30,
									state: "GA",
									usersOfTutorLength: 1,
									coursePermissions: ["machine-learning"],
									editTutors: false,
									saveEdit: "Save"
								}
							};
						}
						if (
							url.pathname
							=== "/api/users/oftutor/ml-reading-tutor"
						) {
							body = [user];
						}
						return void request.respond({
							status: 200,
							contentType: "application/json",
							body: JSON.stringify(body)
						});
					}
					void request.continue();
				});
				for (const [
					module,
					title,
					file,
					expectedView,
					staticAudit
				] of cases) {
					activeCase = { module, title, file };
					const source = await readFile(
						join(directory, file),
						"utf8"
					);
					const sourceSHA256 = createHash("sha256")
						.update(source)
						.digest("hex");
					assert.equal(
						sourceSHA256,
						definition.cases.find(item => item.file === file)
							.sourceSHA256
					);
					await page.goto(
						`${origin}/courses#machine-learning-${module}`,
						{ waitUntil: "domcontentloaded", timeout: 60000 }
					);
					const view = expectedView;
					await page.waitForSelector(
						`.lesson-view-toggle button:nth-child(${view})`
					);
					await page.click(
						`.lesson-view-toggle button:nth-child(${view})`
					);
					const target = {
						prefix: `machine-learning-${module}-`,
						title
					};
					await page.waitForFunction(
						({ prefix, title }) =>
							Array.from(
								document.querySelectorAll(
									"#course-reader-panel [id]"
								)
							).some(
								item =>
									item.id.startsWith(prefix)
									&& item.textContent.includes(title)
							),
						{},
						target
					);
					const anchor = await page.$$eval(
						"#course-reader-panel [id]",
						(items, { prefix, title }) =>
							items.find(
								item =>
									item.id.startsWith(prefix)
									&& item.textContent.includes(title)
							).id,
						target
					);
					await page.$eval(`#${anchor}`, element =>
						element.scrollIntoView({
							behavior: "instant",
							block: "start"
						}));
					const expected = await page.evaluate((html) => {
						const element = document.createElement("div");
						element.innerHTML = html;
						return element.textContent.replace(/\s+/g, " ").trim();
					}, markdown.render(source));
					await page.waitForFunction(
						({ anchor, expected }) =>
							document
								.getElementById(anchor)
								?.querySelector(".item-content-markdown")
								?.textContent
								.replace(/\s+/g, " ")
								.trim() === expected,
						{},
						{ anchor, expected }
					);
					const actual = await page.$eval(
						`#${anchor} .item-content-markdown`,
						element => ({
							text: element.textContent
								.replace(/\s+/g, " ")
								.trim(),
							codeBlocks:
								element.querySelectorAll("pre code").length,
							tableRows:
								element.querySelectorAll("tbody tr").length
						})
					);
					assert.equal(actual.text, expected);
					if (staticAudit) {
						const links = await page.$$eval(
							`#${anchor} a[href]`,
							elements =>
								elements.map(element =>
									element.getAttribute("href")
								)
						);
						assert.ok(
							!links.some(href => href.startsWith("/ide")),
							"The source-only historical audit is not an executable IDE task"
						);
						assert.ok(
							links.every(href => new URL(href, origin).hostname === "github.com"),
							"Historical source filenames must not become unrelated domain links"
						);
						assert.ok(
							links.some(href =>
								href.includes(
									"/tree/7c7ee0ccee9967b38cb0a0fa4a22c6621b7c7a9b/ML4-Diabetes-Diagnosis-With-Neural-Networks"
								)
							)
						);
					}
					assert.equal(
						await page.evaluate(
							() =>
								document.documentElement.scrollWidth
								<= innerWidth + 2
						),
						true,
						`${file}: viewport fits`
					);
					const name = `${file.split("/").at(-1).replace(/\.md$/, "")}-${role}-${width}`;
					await page.screenshot({
						path: join(output, `${name}-top.png`),
						fullPage: true
					});
					await page.$eval(
						`#${anchor} .item-content-markdown`,
						element =>
							element.lastElementChild.scrollIntoView({
								behavior: "instant",
								block: "end"
							})
					);
					await page.waitForFunction(
						(anchor) => {
							const element = document.querySelector(
								`#${anchor} .item-content-markdown`
							)?.lastElementChild;
							if (!element) return false;
							const rect = element.getBoundingClientRect();
							return (
								rect.top >= 0 && rect.bottom <= innerHeight + 1
							);
						},
						{},
						anchor
					);
					await page.screenshot({
						path: join(output, `${name}-end.png`),
						fullPage: true
					});
					profiles.push({
						role,
						width,
						title,
						file,
						anchor,
						sourceSHA256: createHash("sha256")
							.update(source)
							.digest("hex"),
						expectedTextSHA256: createHash("sha256")
							.update(expected)
							.digest("hex"),
						renderedTextSHA256: createHash("sha256")
							.update(actual.text)
							.digest("hex"),
						codeBlocks: actual.codeBlocks,
						tableRows: actual.tableRows,
						viewportFits: true,
						lastParagraphVisible: true,
						staticSourceAuditAccepted: staticAudit
					});
				}
				assert.equal(writes, 0);
				assert.deepEqual(errors, []);
				await context.close();
				context = null;
			}
		}
		assert.equal(profiles.length, 52);
		await writeFile(
			join(output, "accepted.json"),
			`${JSON.stringify({ at: new Date().toISOString(), sourceMode: config ? "actual application dev server" : "exact built application preview", accepted: true, fullLessonViews: 52, actualRoles: ["learner", "instructor"], widths: [390, 1280], allCompleteRenderedLessonTextsMatch: true, allLastParagraphsVisible: true, allApplicationWritesLocallyBlocked: true, profiles }, null, 2)}\n`
		);
		console.log(
			JSON.stringify({ accepted: true, fullLessonViews: profiles.length })
		);
	}
	catch (error) {
		process.exitCode = 1;
		if (page && !page.isClosed()) {
			await writeFile(
				join(output, "failure.json"),
				JSON.stringify(
					{
						error: String(error),
						activeCase,
						markdown: await page.$$eval(".item-content-markdown", elements => elements.map(element => ({ text: element.textContent, html: element.innerHTML }))).catch(() => []),
						url: page.url(),
						body: await page
							.$eval("body", element => element.textContent)
							.catch(() => null)
					},
					null,
					2
				)
			);
		}
		throw error;
	}
	finally {
		await context?.close();
		await browser?.close();
		await server?.close();
		console.log(
			JSON.stringify({
				event: "end",
				pid: process.pid,
				parentPid: process.ppid,
				startedAt,
				endedAt: new Date().toISOString(),
				exitCode: process.exitCode ?? 0,
				childProcessGroupCleanup:
					"owned pages, contexts, browser and dev server closed"
			})
		);
	}
}

main().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});
