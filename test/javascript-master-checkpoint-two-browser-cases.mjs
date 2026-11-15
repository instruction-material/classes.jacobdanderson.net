import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const fixture = JSON.parse(
	readFileSync(
		new URL(
			"./fixtures/javascript-master-checkpoint-two-sources.json",
			import.meta.url
		),
		"utf8"
	)
);
function title(project) {
	return project === "master-checkpoint-two" ? "Check-In 2" : "Move Analyzer";
}
export function editedCheckpointTwoSource(resource, name) {
	const reference = fixture.files[resource.project].reference[name];
	if (name === "index.html") {
		return reference.replace(
			`<h1>${title(resource.project)}</h1>`,
			`<h1>Saved ${title(resource.project)}</h1>`
		);
	}
	if (name === "styles.css")
		return `${reference}\nmain { outline:3px solid #334155; }\n`;
	if (name.endsWith(".js"))
		return `${reference}\n// Saved completed checkpoint task.\n`;
	return undefined;
}
export async function inspectCheckpointTwo(page, resource, kind, url, width) {
	const complete = resource.role === "reference" || kind === "edited";
	await page.goto(url, { waitUntil: "load" });
	assert.equal(
		await page.$eval("h1", e => e.textContent),
		(kind === "edited" ? "Saved " : "") + title(resource.project)
	);
	let result;
	if (resource.project === "master-checkpoint-two") {
		await page.click("#sum");
		if (!complete) {
			assert.match(
				await page.$eval("#sums", e => e.textContent),
				/Complete sumEvens/
			);
			await page.click("#fixture");
			assert.match(
				await page.$eval("#status", e => e.textContent),
				/Complete firstMove/
			);
			result = { starterExplained: true };
		}
		else {
			const sums = await page.$eval("#sums", e => e.textContent);
			for (const text of [
				"[2,1,6,91,-1] => 8",
				"[0,3,2,91,-1] => 2",
				"[] => 0",
				"[1,2] => 2",
				"[-3,2] => 2",
				"[-4,2] => -2"
			])
				assert.ok(sums.includes(text), text);
			const rectangle = await page.$eval("#board", (e) => {
				const r = e.getBoundingClientRect();
				return {
					x: r.left,
					y: r.top,
					width: r.width,
					height: r.height
				};
			});
			await page.mouse.click(
				rectangle.x + rectangle.width / 2,
				rectangle.y + rectangle.height / 2
			);
			const coordinate = await page.$eval(
				"#position",
				e => e.textContent
			);
			const numbers = coordinate.match(/[\d.]+/g).map(Number);
			assert.ok(
				Math.abs(numbers[0] - 250) < 2
				&& Math.abs(numbers[1] - 250) < 2,
				coordinate
			);
			await page.click("#fixture");
			const original = await page.$eval("#move", e => e.textContent);
			assert.match(original, /pound.*practice fixture/);
			await page.evaluate(() => {
				globalThis.checkpointFetchCalls = 0;
				globalThis.fetch = async () => {
					globalThis.checkpointFetchCalls++;
					return { ok: false, status: 503 };
				};
			});
			await page.click("#live");
			await page.waitForFunction(
				() => !document.querySelector("#live").disabled
			);
			assert.match(
				await page.$eval("#status", e => e.textContent),
				/HTTP 503.*last valid/
			);
			assert.equal(
				await page.$eval("#move", e => e.textContent),
				original
			);
			await page.evaluate(() => {
				globalThis.fetch = async () => {
					globalThis.checkpointFetchCalls++;
					return {
						ok: true,
						json: async () => ({
							results: [{ name: "cached-demo" }]
						})
					};
				};
			});
			for (let i = 0; i < 2; i++) {
				await page.click("#live");
				await page.waitForFunction(
					() => !document.querySelector("#live").disabled
				);
			}
			assert.equal(
				await page.evaluate(() => globalThis.checkpointFetchCalls),
				2
			);
			assert.match(
				await page.$eval("#move", e => e.textContent),
				/cached-demo.*cached/
			);
			result = {
				completeSums: true,
				scaledCanvasPoint: coordinate,
				fixtureFirstName: "pound",
				failurePreservedState: true,
				cachedRequestCount: 2
			};
		}
	}
	else {
		await page.click("#fixture");
		if (!complete) {
			assert.match(
				await page.$eval("#status", e => e.textContent),
				/Complete countTypes/
			);
			result = { starterExplained: true };
		}
		else {
			async function query(value) {
				await page.$eval(
					"#type",
					(e, value) => {
						e.value = value;
					},
					value
				);
				await page.$eval("#query", e => e.requestSubmit());
				return page.$eval("#result", e => e.textContent);
			}
			for (const [input, expected] of [
				["Fire", "fire: 2 of 6"],
				[" WATER ", "water: 2 of 6"],
				["grass", "grass: 0 of 6"],
				["", "Enter a move type"],
				["unknown", "Unknown move type"]
			])
				assert.ok((await query(input)).includes(expected), input);
			const original = await page.$eval("#source", e => e.textContent);
			await page.evaluate(() => {
				globalThis.checkpointFetchCalls = 0;
				globalThis.fetch = async () => {
					globalThis.checkpointFetchCalls++;
					return { ok: false, status: 503 };
				};
			});
			await page.click("#live");
			await page.waitForFunction(
				() => !document.querySelector("#live").disabled
			);
			assert.match(
				await page.$eval("#status", e => e.textContent),
				/HTTP 503.*last valid/
			);
			assert.equal(
				await page.$eval("#source", e => e.textContent),
				original
			);
			await page.evaluate(() => {
				globalThis.fetch = async (url) => {
					globalThis.checkpointFetchCalls++;
					return {
						ok: true,
						json: async () => ({
							name: `move-${url.split("/").at(-2)}`,
							type: { name: "ghost" }
						})
					};
				};
			});
			for (let i = 0; i < 2; i++) {
				await page.click("#live");
				await page.waitForFunction(
					() => !document.querySelector("#live").disabled
				);
			}
			assert.equal(
				await page.evaluate(() => globalThis.checkpointFetchCalls),
				7
			);
			assert.ok((await query("ghost")).includes("ghost: 6 of 6"));
			assert.match(
				await page.$eval("#source", e => e.textContent),
				/Live IDs 1 through 6/
			);
			result = {
				fixtureCounts: true,
				normalizedAndInvalidInput: true,
				failurePreservedState: true,
				cachedRequestCount: 7,
				readyAfterAllSix: true
			};
		}
	}
	assert.equal(
		await page.evaluate(
			() => document.documentElement.scrollWidth > innerWidth + 1
		),
		false
	);
	if (kind === "edited") {
		assert.equal(
			await page.$eval("main", e => getComputedStyle(e).outlineWidth),
			"3px"
		);
	}
	return { width, ...result };
}
