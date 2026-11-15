import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
const fixture = JSON.parse(
	readFileSync(
		new URL(
			"./fixtures/javascript-hundred-squares-sources.json",
			import.meta.url
		),
		"utf8"
	)
);
const solutionMarker =
	"// Solution: original grid geometry with responsive SVG.\n\n";
export function editedSquaresSource(resource, filename) {
	if (filename === "index.html")
		return fixture.files[resource.role][filename]
			.replace("<body>", '<body data-squares-edited="true">')
			.replace("<h1>100 Squares</h1>", "<h1>Saved square grid</h1>");
	if (filename === "styles.css")
		return (
			fixture.files[resource.role][filename] +
			"\n#drawing svg { border: 3px solid #334155; }\n"
		);
	if (filename === "script.js") {
		const source = fixture.files.reference[filename].replace(
			'.attr("fill", `rgb(${r},${g},${b})`);',
			'.attr("fill", `rgb(${r},${g},${b})`)\n      .attr("stroke", "#334155")\n      .attr("stroke-width", 2);'
		);
		assert.notEqual(source, fixture.files.reference[filename]);
		return (
			(resource.role === "starter"
				? fixture.files.starter[filename] +
					"\n" +
					source.split(solutionMarker)[1]
				: source) + "\n// Saved square grid attempt.\n"
		);
	}
	return undefined;
}
export async function inspectSquares(page, resource, kind, url) {
	const errors = [],
		dialog = async d => {
			errors.push("Unexpected dialog: " + d.type());
			await d.dismiss();
		};
	page.on("dialog", dialog);
	try {
		if (resource.role === "starter" && kind === "exact") {
			await page.goto(url, { waitUntil: "load" });
			assert.equal(
				await page.$$eval("#drawing svg", rows => rows.length),
				0
			);
			assert.deepEqual(errors, []);
			return { blankStarterRetained: true, cases: [] };
		}
		const cases = [];
		let firstColors;
		for (let run = 0; run < 2; run++) {
			await page.goto(url, { waitUntil: "load" });
			await page.waitForSelector("#drawing svg rect");
			const state = await page.evaluate(() => {
				const svg = document.querySelector("#drawing svg"),
					bounds = svg.getBoundingClientRect();
				return {
					svgCount: document.querySelectorAll("#drawing svg").length,
					width: svg.getAttribute("width"),
					height: svg.getAttribute("height"),
					viewBox: svg.getAttribute("viewBox"),
					role: svg.getAttribute("role"),
					label: svg.getAttribute("aria-label"),
					cells: [...svg.querySelectorAll("rect")].map(r => ({
						x: Number(r.getAttribute("x")),
						y: Number(r.getAttribute("y")),
						width: Number(r.getAttribute("width")),
						height: Number(r.getAttribute("height")),
						fill: r.getAttribute("fill"),
						computedFill: getComputedStyle(r).fill,
						validColor: CSS.supports(
							"color",
							r.getAttribute("fill")
						),
						stroke: r.getAttribute("stroke"),
						strokeWidth: r.getAttribute("stroke-width")
					})),
					left: bounds.left,
					right: bounds.right,
					renderedWidth: bounds.width,
					renderedHeight: bounds.height,
					scrollWidth: document.documentElement.scrollWidth,
					viewport: innerWidth,
					heading: document.querySelector("h1").textContent,
					edited: document.body.dataset.squaresEdited === "true"
				};
			});
			assert.deepEqual(errors, []);
			assert.equal(state.svgCount, 1);
			assert.equal(state.width, "1000");
			assert.equal(state.height, "1000");
			assert.equal(state.viewBox, "0 0 1000 1000");
			assert.equal(state.role, "img");
			assert.ok(state.label.includes("100"));
			assert.equal(state.cells.length, 100);
			const x = new Set(),
				y = new Set(),
				pairs = new Set(),
				colors = [];
			for (const cell of state.cells) {
				assert.equal(cell.width, 50);
				assert.equal(cell.height, 50);
				x.add(cell.x);
				y.add(cell.y);
				pairs.add(cell.x + ":" + cell.y);
				const color = cell.fill.match(/^rgb\((\d+),(\d+),(\d+)\)$/);
				assert.ok(color);
				const channels = color.slice(1).map(Number);
				assert.ok(
					channels.every(
						c => Number.isInteger(c) && c >= 1 && c <= 255
					)
				);
				assert.ok(cell.validColor);
				assert.equal(cell.computedFill.replaceAll(" ", ""), cell.fill);
				if (kind === "edited") {
					assert.equal(cell.stroke, "#334155");
					assert.equal(cell.strokeWidth, "2");
				}
				colors.push(cell.fill);
			}
			assert.equal(pairs.size, 100);
			assert.deepEqual(
				[...x].sort((a, b) => a - b),
				fixture.coordinateValues
			);
			assert.deepEqual(
				[...y].sort((a, b) => a - b),
				fixture.coordinateValues
			);
			assert.ok(state.left >= -1 && state.right <= state.viewport + 1);
			assert.ok(state.scrollWidth <= state.viewport + 1);
			assert.ok(Math.abs(state.renderedWidth - state.renderedHeight) < 1);
			assert.equal(
				state.heading,
				kind === "edited" ? "Saved square grid" : "100 Squares"
			);
			assert.equal(state.edited, kind === "edited");
			assert.ok(new Set(colors).size > 1);
			if (run === 0) firstColors = colors;
			else assert.notDeepEqual(colors, firstColors);
			cases.push({
				run,
				rectangles: state.cells.length,
				distinctX: [...x].sort((a, b) => a - b),
				distinctY: [...y].sort((a, b) => a - b),
				allCells: state.cells,
				randomColorsChangedOnReload: run === 1,
				fullSVGWithinViewport: true
			});
		}
		return {
			cases,
			originalGeometryVerified: true,
			completeRGBChannelsVerified: true,
			reloadChangesColorsOnly: true,
			editedOutputVerified: kind === "edited"
		};
	} finally {
		page.off("dialog", dialog);
	}
}
