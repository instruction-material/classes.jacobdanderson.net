import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const fixture = JSON.parse(readFileSync(new URL("./fixtures/javascript-html-css-sources.json", import.meta.url), "utf8"));

export function editedHtmlCssSource(resource, filename) {
	const reference = fixture.resources.find(row => row.project === resource.project && row.role === "reference");
	let source = readFileSync(new URL(`../front-end/public/course-assets/javascript-level-1/${reference.files.find(file => file.name === filename).path}`, import.meta.url), "utf8");
	if (resource.project === "html-css-basics") {
		if (filename === "index.html") source = source.replaceAll("Alan", "Ada").replaceAll("Turing", "Lovelace");
		else source = source.replace("background-color: peru", "background-color: lavender").replace("font-size: 20px", "font-size: 24px");
	}
	else if (filename === "index.html") {
		source = source.replace("<h1>Block Display</h1>", "<h1>Block Examples</h1>");
	}
	else {
		source = source.replaceAll("50px", "55px");
	}
	return source;
}

export async function inspectHtmlCss(page, resource, kind) {
	const state = await page.evaluate(() => {
		const all = selector => [...document.querySelectorAll(selector)];
		const bounds = (node) => {
			const box = node.getBoundingClientRect();
			return { x: box.x, y: box.y, width: box.width, height: box.height, right: box.right, bottom: box.bottom };
		};
		return {
			viewportWidth: innerWidth,
			noHorizontalOverflow: document.documentElement.scrollWidth <= innerWidth,
			headings: all("h1").map(node => node.textContent),
			bodyElements: document.body.children.length,
			bodyBackground: getComputedStyle(document.body).backgroundColor,
			spans: all("span").map(node => ({ text: node.textContent, fontSize: getComputedStyle(node).fontSize, fontWeight: getComputedStyle(node).fontWeight })),
			divs: all("div").map(node => ({ text: node.textContent.trim(), align: getComputedStyle(node).textAlign, weight: getComputedStyle(node).fontWeight })),
			breaks: all("br").length,
			links: all("a").map(node => ({ href: node.href, text: node.textContent })),
			images: all("img").map(node => ({ ...bounds(node), alt: node.alt, src: node.getAttribute("src"), loaded: node.complete && node.naturalWidth === 200 && node.naturalHeight === 200 })),
			boxes: all(".box-block,.box-inline-block").map(node => ({ ...bounds(node), display: getComputedStyle(node).display, background: getComputedStyle(node).backgroundColor })),
			tableRows: all("table tr").map(row => [...row.querySelectorAll("td")].map(cell => cell.querySelector("div")?.className)),
			gridRows: all("body > div").filter(node => node.children.length === 2).map(row => [...row.children].map(node => node.className))
		};
	});
	assert.ok(state.noHorizontalOverflow);
	if (resource.role === "starter" && kind === "exact") {
		assert.equal(state.bodyElements, 0);
		return state;
	}
	const edited = kind === "edited";
	if (resource.project === "html-css-basics") {
		assert.equal(state.divs.length, 7);
		assert.equal(state.breaks, 2);
		assert.deepEqual(state.spans.map(node => node.text), edited ? ["Ada", "Lovelace"] : ["Alan", "Turing"]);
		for (const span of state.spans) {
			assert.equal(span.fontSize, edited ? "24px" : "20px");
			assert.equal(span.fontWeight, "400");
		}
		for (const div of state.divs) {
			assert.equal(div.align, "center");
			assert.equal(div.weight, "700");
		}
		assert.equal(state.bodyBackground, edited ? "rgb(230, 230, 250)" : "rgb(205, 133, 63)");
		assert.deepEqual(state.links, [{ href: "https://www.wikipedia.org/", text: "Go To Wikipedia" }]);
		assert.equal(state.images.length, 1);
		assert.deepEqual({ width: state.images[0].width, height: state.images[0].height, alt: state.images[0].alt, src: state.images[0].src, loaded: state.images[0].loaded }, { width: 200, height: 200, alt: "Blue mountains and a gold sun", src: "landscape.svg", loaded: true });
		assert.ok(state.images[0].x >= 0 && state.images[0].right <= state.viewportWidth);
	}
	else {
		assert.deepEqual(state.headings, [edited ? "Block Examples" : "Block Display", "Inline Block Display", "Grid", "Table"]);
		assert.equal(state.boxes.length, 24);
		const size = edited ? 55 : 50;
		const colors = ["rgb(255, 0, 0)", "rgb(255, 165, 0)", "rgb(255, 255, 0)", "rgb(0, 128, 0)", "rgb(0, 0, 255)", "rgb(128, 0, 128)"];
		state.boxes.forEach((box, index) => {
			assert.equal(box.width, size);
			assert.equal(box.height, size);
			assert.equal(box.background, colors[index % 6]);
			assert.equal(box.display, index < 6 ? "block" : "inline-block");
			assert.ok(box.x >= 0 && box.right <= state.viewportWidth);
		});
		for (let index = 1; index < 6; index++) {
			assert.equal(state.boxes[index].x, state.boxes[0].x);
			assert.equal(state.boxes[index].y, state.boxes[index - 1].bottom);
			assert.equal(state.boxes[index + 6].y, state.boxes[6].y);
		}
		const rows = [["box-inline-block box-red", "box-inline-block box-orange"], ["box-inline-block box-yellow", "box-inline-block box-green"], ["box-inline-block box-blue", "box-inline-block box-purple"]];
		assert.deepEqual(state.gridRows, rows);
		assert.deepEqual(state.tableRows, rows);
		for (let index = 12; index < 24; index += 2) assert.equal(state.boxes[index].y, state.boxes[index + 1].y);
	}
	return state;
}
