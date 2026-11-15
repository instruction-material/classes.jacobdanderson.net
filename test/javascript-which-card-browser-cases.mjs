import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const fixture = JSON.parse(readFileSync(
	new URL("./fixtures/javascript-which-card-sources.json", import.meta.url),
	"utf8"
));
export function editedCardSource(resource, filename) {
	const source = fixture.files[resource.role][filename];
	if (filename === "index.html") return source.replace("<h1>Which Card</h1>", "<h1>Saved card selection</h1>");
	if (filename === "styles.css") return `${source}\ncanvas { outline: 3px solid #334155; }\n`;
	if (filename === "script.js") return fixture.files.reference[filename].replace("\"green\"", "\"purple\"");
	return undefined;
}
export async function inspectCards(page, resource, kind, url) {
	await page.goto(url, { waitUntil: "load" });
	await page.waitForSelector("#my-canvas");
	const complete = resource.role === "reference" || kind === "edited";
	const colors = [kind === "edited" ? "purple" : "green", "red", "blue", "yellow", "cyan"];
	const sampled = await page.$eval("#my-canvas", (canvas) => {
		const ctx = canvas.getContext("2d");
		return [75, 275, 475, 675, 875].map(x => [...ctx.getImageData(x, 200, 1, 1).data]);
	});
	assert.deepEqual(sampled, [
		kind === "edited" ? [128, 0, 128, 255] : [0, 128, 0, 255],
		[255, 0, 0, 255],
		[0, 0, 255, 255],
		[255, 255, 0, 255],
		[0, 255, 255, 255]
	]);
	const output = [];
	const cases = [];
	async function clickPoint(x, y, color, label) {
		const rect = await page.$eval("#my-canvas", (canvas) => {
			const r = canvas.getBoundingClientRect();
			return { left: r.left, top: r.top, width: r.width, height: r.height };
		});
		assert.ok(rect.width > 0 && rect.height > 0);
		const client = { x: rect.left + x * rect.width / 1200, y: rect.top + y * rect.height / 800 };
		await page.mouse.click(client.x, client.y);
		if (complete && color) output.push(color);
		const lines = await page.$eval("#log", el => el.textContent.trim().split("\n").filter(Boolean));
		assert.deepEqual(lines, output, label);
		cases.push({ label, logical: [x, y], client, expectedNewLine: complete ? color : null });
	}
	for (let i = 0; i < 5; i++) {
		await clickPoint(i * 200 + 75, 200, colors[i], `center-${i}`);
		await clickPoint(i * 200 + 5, 155, colors[i], `upper-left-${i}`);
		await clickPoint(i * 200 + 145, 245, colors[i], `lower-right-${i}`);
		await clickPoint(i * 200 + 175, 200, null, `gap-${i}`);
	}
	await clickPoint(75, 260, null, "below-card");
	// Move the real canvas within the viewport while retaining the same visible cards.
	await page.evaluate(() => {
		document.body.style.minHeight = `${innerHeight + 400}px`;
		document.body.style.paddingTop = "160px";
		window.scrollTo(0, 120);
	});
	assert.ok(await page.evaluate(() => scrollY) >= 100);
	await clickPoint(275, 200, colors[1], "scrolled-red-center");
	await clickPoint(175, 200, null, "scrolled-gap");
	const scrolledBy = await page.evaluate(() => scrollY);
	await page.evaluate(() => {
		document.body.style.minHeight = "";
		document.body.style.paddingTop = "";
		window.scrollTo(0, 0);
	});
	assert.equal(await page.$eval("h1", el => el.textContent), kind === "edited" ? "Saved card selection" : "Which Card");
	return { palettePixels: sampled, complete, cases, loggedColors: output, nativePointerGeometryVerified: true, scrolledPointerGeometryVerified: true, scrolledBy, editedOutputVerified: kind === "edited" };
}
