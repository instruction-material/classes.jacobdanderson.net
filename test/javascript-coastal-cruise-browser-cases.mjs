import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const fixture = JSON.parse(readFileSync(new URL("./fixtures/javascript-coastal-cruise-sources.json", import.meta.url), "utf8"));
export function editedCruiseSource(resource, filename) {
	const source = fixture.files[resource.role][filename];
	if (filename === "index.html") return source.replace("<h1>Coastal Cruise</h1>", "<h1>Saved cruise manifest</h1>");
	if (filename === "styles.css") return `${source}\npre { border-left: 3px solid #334155; padding-left: 0.5rem; }\n`;
	if (filename === "script.js") return fixture.files.reference[filename].replace("const maxSeats = 2;", "const maxSeats = 3;");
	return undefined;
}
export async function inspectCruise(page, resource, kind, url) {
	const complete = resource.role === "reference" || kind === "edited";
	const capacity = kind === "edited" ? 3 : 2;
	const extra = capacity === 3 ? ["Grace", "3"] : [];
	const manifest = ["Seat 1: Ada", "Seat 2: Lin", ...(capacity === 3 ? ["Seat 3: Grace"] : [])];
	const scenarios = complete
		? [
				{ name: "full-ship", inputs: ["Ada", "1", "Lin", "2", ...extra], expected: manifest, invalid: 0 },
				{ name: "occupied-seat", inputs: ["Ada", "1", "Eve", "1", "Lin", "2", ...extra], expected: manifest, duplicate: true },
				{ name: "empty-name", inputs: [" ", "1", "Ada", "1", "Lin", "2", ...extra], expected: manifest, invalid: 1 },
				{ name: "invalid-numbers", inputs: ["Ada", "0", "Ada", String(capacity + 1), "Ada", "1.5", "Ada", "no", "Ada", "1", "Lin", "2", ...extra], expected: manifest, invalid: 4 },
				{ name: "cancel-name", inputs: [null], expected: ["Registration cancelled."], cancelled: true },
				{ name: "cancel-seat", inputs: ["Ada", null], expected: ["Registration cancelled."], cancelled: true },
				{ name: "cancel-after-reservation", inputs: ["Ada", "1", "Lin", null], expected: ["Registration cancelled."], cancelled: true },
				{ name: "literal-name", inputs: [" <b>Ada</b> ", "1", "Lin", "2", ...extra], expected: ["Seat 1: <b>Ada</b>", ...manifest.slice(1)] }
			]
		: [{ name: "unfinished-starter", inputs: [], expected: [] }];
	const cases = [];
	for (const scenario of scenarios) {
		let cursor = 0;
		let dialogError;
		const alerts = [];
		const handle = async (dialog) => {
			if (dialog.type() === "prompt") {
				if (cursor >= scenario.inputs.length) {
					dialogError = "Unexpected extra prompt";
					await dialog.dismiss();
				}
				else {
					const input = scenario.inputs[cursor++];
					if (input === null) await dialog.dismiss();
					else await dialog.accept(input);
				}
			}
			else {
				assert.equal(dialog.type(), "alert");
				alerts.push(dialog.message());
				await dialog.dismiss();
			}
		};
		const listener = (dialog) => {
			void handle(dialog).catch((error) => {
				dialogError = String(error);
			});
		};
		page.on("dialog", listener);
		try {
			await page.goto(url, { waitUntil: "load" });
			await page.waitForSelector("#log");
			await page.waitForFunction(count => document.querySelector("#log").textContent.trim().split("\n").filter(Boolean).length === count, {}, scenario.expected.length);
			assert.equal(dialogError, undefined, scenario.name);
			assert.equal(cursor, scenario.inputs.length);
			const lines = await page.$eval("#log", el => el.textContent.trim().split("\n").filter(Boolean));
			assert.deepEqual(lines, scenario.expected, scenario.name);
			assert.equal(alerts.some(a => a.startsWith("Woo!")), complete && !scenario.cancelled);
			if (scenario.duplicate) assert.equal(alerts.filter(a => a.startsWith("The seat was full")).length, 1);
			if (scenario.invalid !== undefined) assert.equal(alerts.filter(a => a.startsWith("Enter a name and")).length, scenario.invalid);
			assert.equal(await page.$eval("#log", el => el.querySelector("b")), null);
			cases.push({ name: scenario.name, nativePrompts: cursor, expected: scenario.expected, alerts, literalTextVerified: true });
		}
		finally {
			page.off("dialog", listener);
		}
	}
	assert.equal(await page.$eval("h1", el => el.textContent), kind === "edited" ? "Saved cruise manifest" : "Coastal Cruise");
	return { complete, capacity, nativeRegistrationCases: cases.length, cases, savedCapacityEditVerified: kind === "edited" };
}
