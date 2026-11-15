import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const fixture = JSON.parse(readFileSync(
	new URL("./fixtures/javascript-refactory-sources.json", import.meta.url),
	"utf8"
));
export function editedRefactorySource(resource, filename) {
	const original = fixture.files[resource.role][filename];
	if (filename === "index.html") return original.replace("<h1>Refactory</h1>", "<h1>Saved factory</h1>");
	if (filename === "styles.css") return `${original}\npre { border-left: 3px solid #334155; }\n`;
	if (filename === "script.js") return `${original}\nconsole.log({ name: "saved edit", retained: true });\n`;
	return undefined;
}
export async function inspectRefactory(page, resource, kind, url) {
	await page.goto(url, { waitUntil: "load" });
	const expected = fixture.expectedReports.map(row => ({ ...row }));
	if (kind === "edited") expected.push({ name: "saved edit", retained: true });
	await page.waitForFunction(count => document.querySelectorAll("#reports pre").length === count, {}, expected.length);
	const state = await page.evaluate(() => ({
		heading: document.querySelector("h1").textContent,
		reports: [...document.querySelectorAll("#reports pre")].map(node => JSON.parse(node.textContent)),
		plainOutput: [...document.querySelectorAll("#reports pre")].every(node => node.children.length === 0),
		scrollWidth: document.documentElement.scrollWidth,
		viewport: innerWidth
	}));
	assert.deepEqual(state.reports, expected);
	assert.equal(state.heading, kind === "edited" ? "Saved factory" : "Refactory");
	assert.equal(state.plainOutput, true);
	assert.ok(state.scrollWidth <= state.viewport + 1);
	return { ...state, originalReportsPreserved: true, editedOutputVerified: kind === "edited" };
}
