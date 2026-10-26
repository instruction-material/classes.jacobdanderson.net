import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const fixture = JSON.parse(readFileSync(new URL("./fixtures/javascript-more-html-css-sources.json", import.meta.url), "utf8"));

export function editedHtmlCssSource(resource, filename) {
	const reference = fixture.resources.find(row => row.project === resource.project && row.role === "reference");
	const source = readFileSync(new URL(`../front-end/public/course-assets/javascript-level-1/${reference.files.find(file => file.name === filename).path}`, import.meta.url), "utf8");
	if (filename === "script.js") return source.replace(".attr(\"fill\", \"red\")", ".attr(\"fill\", \"purple\")");
	return filename === "index.html"
		? source.replace("<title>", "<title>Saved ").replace("<h1", "<h1 data-saved-edit=\"true\"")
		: `${source}\nbody { border-top: 6px solid #7c3aed; }\n`;
}

export async function inspectHtmlCss(page, resource, kind) {
	await page.evaluate(() => document.fonts.ready);
	if (resource.project === "my-javascript-art" && !(resource.role === "starter" && kind === "exact")) {
		await page.waitForFunction(() => document.querySelectorAll("#rainbow path").length === 7 && [...document.querySelectorAll("#rainbow path")].every(node => getComputedStyle(node).opacity === "1"));
	}
	const state = await page.evaluate(() => {
		const all = selector => [...document.querySelectorAll(selector)];
		const box = (node) => {
			const r = node.getBoundingClientRect();
			return { x: r.x, y: r.y, width: r.width, height: r.height, right: r.right };
		};
		return {
			noHorizontalOverflow: document.documentElement.scrollWidth <= innerWidth,
			bodyElements: document.body.children.length,
			headings: all("h1,h2").map(node => node.textContent.trim()),
			savedHeading: !!document.querySelector("h1[data-saved-edit]"),
			borderTop: getComputedStyle(document.body).borderTopColor,
			boxes: all(".box-block,.box-inline-block").map(node => ({ ...box(node), position: getComputedStyle(node).position })),
			absoluteBoxes: all(".absolute").map(box),
			fontFamily: getComputedStyle(document.body).fontFamily,
			localFontLoaded: [...document.fonts].some(font => font.family === "Noto Sans" && font.status === "loaded"),
			orderedItems: all("ol li").map(node => node.textContent),
			images: all("img").map(node => ({ ...box(node), alt: node.alt, loaded: node.complete && node.naturalWidth > 0 })),
			svgs: all("svg").map(node => ({ ...box(node), viewBox: node.getAttribute("viewBox"), role: node.getAttribute("role"), label: node.getAttribute("aria-labelledby"), labelled: !!document.getElementById(node.getAttribute("aria-labelledby")) })),
			paths: all("svg path").length,
			circles: all("svg circle").length,
			circleFills: all("svg circle").map(node => node.getAttribute("fill")),
			links: all("a").map(node => ({ href: node.getAttribute("href"), text: node.textContent.trim() })),
			historical: document.body.textContent.includes("2020 page layout study"),
			presentationTable: !!document.querySelector("table[role=\"presentation\"]")
		};
	});
	assert.ok(state.noHorizontalOverflow);
	if (resource.role === "starter" && kind === "exact") {
		assert.equal(state.headings.length, 0);
		assert.equal(state.boxes.length + state.images.length + state.svgs.length + state.links.length, 0);
		return state;
	}
	if (kind === "edited") {
		assert.ok(state.savedHeading);
		assert.equal(state.borderTop, "rgb(124, 58, 237)");
	}
	if (resource.project === "box-inception-part-2") {
		assert.deepEqual(state.headings, ["Block Display", "Inline Block Display", "Grid", "Table", "Absolute Positioning"]);
		assert.equal(state.boxes.length, 30);
		assert.equal(state.absoluteBoxes.length, 6);
		for (const box of state.boxes) assert.deepEqual([box.width, box.height], [50, 50]);
		for (let i = 1; i < 6; i++) {
			assert.equal(state.absoluteBoxes[i].x - state.absoluteBoxes[i - 1].x, 10);
			assert.equal(state.absoluteBoxes[i].y - state.absoluteBoxes[i - 1].y, 10);
		}
	}
	else if (resource.project === "my-hero-page") {
		assert.deepEqual(state.orderedItems, ["2012: Miami Heat", "2013: Miami Heat", "2016: Cleveland Cavaliers", "2020: Los Angeles Lakers"]);
		assert.equal(state.images.length, 1);
		assert.ok(state.images[0].loaded && state.images[0].alt.length > 20);
		assert.ok(state.localFontLoaded && state.fontFamily.includes("Noto Sans"));
		assert.equal(state.links.length, 1);
	}
	else if (resource.project === "my-javascript-art") {
		assert.equal(state.svgs.length, 3);
		assert.equal(state.paths, 10);
		assert.equal(state.circles, 4);
		assert.equal(state.circleFills[0], kind === "edited" ? "purple" : "red");
		assert.ok(state.svgs.every(node => node.viewBox && node.role === "img" && node.labelled));
	}
	else {
		assert.ok(state.presentationTable && state.historical);
		assert.ok(state.links.length > 15);
		assert.ok(state.links.every(node => node.href.startsWith("https://")));
		assert.ok(state.links.every(node => !node.href.includes("amp;amp;")));
	}
	return state;
}
