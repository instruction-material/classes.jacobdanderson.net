import assert from "node:assert/strict";

export const editedColor = "#7c3aed";

export function editedDrawingSource(resource, source) {
	if (resource.role === "reference") {
		assert.match(source, /\.attr\("fill", "[^"\n]+"\)/u);
		return source.replace(
			/\.attr\("fill", "[^"\n]+"\)/u,
			`.attr("fill", "${editedColor}")`
		);
	}
	if (resource.project === "debugging-olaf-star") {
		assert.ok(!source.includes("let positionX"));
		assert.ok(!source.includes(".attr(\"d\", star)"));
		const starPath
			= /\.attr\("fill", "white"\)\n {2}\.attr\("transform", `translate\(\$\{positionX\},\$\{positionY\}\)`\)/u;
		assert.match(source, starPath);
		return source
			.replace(
				"let star =",
				"let positionX = 150;\nlet positionY = 210;\nlet star ="
			)
			.replace(
				starPath,
				`.attr("d", star)\n  .attr("fill", "${editedColor}")\n  .attr("transform", \`translate(\${positionX},\${positionY})\`)`
			);
	}
	return `${source}\nconst savedDrawing = d3.select("body").append("svg")\n  .attr("width", 120).attr("height", 100)\n  .attr("viewBox", "0 0 120 100").attr("role", "img")\n  .attr("aria-label", "Saved drawing");\nsavedDrawing.append("rect").attr("x", 10).attr("y", 20)\n  .attr("width", 60).attr("height", 40).attr("fill", "${editedColor}");\n`;
}

export async function inspectDrawing(page, resource, kind) {
	const state = await page.evaluate(() => {
		const svg = document.querySelector("svg");
		const all = selector => [...document.querySelectorAll(selector)];
		const attrs = (selector, names) =>
			all(selector).map(node =>
				names.map(name => node.getAttribute(name))
			);
		const bounds = (node) => {
			const rect = node.getBoundingClientRect();
			return {
				x: rect.x,
				y: rect.y,
				width: rect.width,
				height: rect.height,
				right: rect.right,
				bottom: rect.bottom
			};
		};
		return {
			viewportWidth: innerWidth,
			noHorizontalOverflow:
				document.documentElement.scrollWidth <= innerWidth,
			svgCount: all("svg").length,
			viewBox: svg?.getAttribute("viewBox"),
			imageRole: svg?.getAttribute("role"),
			accessibleName: svg?.getAttribute("aria-label"),
			canvas: svg ? bounds(svg) : null,
			rectangles: attrs("svg rect", [
				"x",
				"y",
				"width",
				"height",
				"fill"
			]),
			circles: attrs("svg circle", ["cx", "cy", "r", "fill"]),
			ellipses: attrs("svg ellipse", ["cx", "cy", "rx", "ry", "fill"]),
			paths: attrs("svg path", ["transform", "fill", "d"]),
			lines: attrs("svg line", ["x1", "y1", "x2", "y2", "stroke"]),
			shapeBounds: all(
				"svg rect,svg circle,svg ellipse,svg path,svg line"
			)
				.filter(
					node => node.tagName !== "path" || node.getAttribute("d")
				)
				.map(bounds),
			helper:
				typeof globalThis.degreesToRadians === "function"
					? [0, 90, -90, 180, 360].map(globalThis.degreesToRadians)
					: null
		};
	});
	assert.equal(state.noHorizontalOverflow, true);
	if (
		["smiley-face", "pac-man", "snowman", "debugging-olaf-star"].includes(
			resource.project
		)
	) {
		assert.equal(state.helper?.length, 5);
		[0, Math.PI / 2, -Math.PI / 2, Math.PI, Math.PI * 2].forEach(
			(value, i) => assert.ok(Math.abs(state.helper[i] - value) < 1e-12)
		);
	}
	const untouchedStarter
		= resource.role === "starter"
			&& kind === "exact"
			&& resource.project !== "debugging-olaf-star";
	if (untouchedStarter) {
		assert.equal(
			state.svgCount,
			0,
			"unfinished starter must retain the drawing exercise"
		);
		return state;
	}
	assert.equal(state.svgCount, 1);
	assert.equal(state.imageRole, "img");
	assert.ok(state.accessibleName);
	const addedDrawing
		= resource.role === "starter"
			&& kind === "edited"
			&& resource.project !== "debugging-olaf-star";
	assert.equal(
		state.viewBox,
		addedDrawing ? "0 0 120 100" : resource.viewBox
	);
	assert.ok(state.canvas.width > 0 && state.canvas.height > 0);
	assert.ok(
		state.canvas.x >= -1 && state.canvas.right <= state.viewportWidth + 1
	);
	for (const shape of state.shapeBounds) {
		assert.ok(Object.values(shape).every(Number.isFinite));
		assert.ok(
			shape.x >= state.canvas.x - 1
			&& shape.right <= state.canvas.right + 1,
			"shape must fit the SVG horizontally"
		);
		assert.ok(
			shape.y >= state.canvas.y - 1
			&& shape.bottom <= state.canvas.bottom + 1,
			"shape must fit the SVG vertically"
		);
	}
	if (addedDrawing) {
		assert.deepEqual(state.rectangles, [
			["10", "20", "60", "40", editedColor]
		]);
		return state;
	}
	const firstFill = normal =>
		resource.role === "reference" && kind === "edited"
			? editedColor
			: normal;
	if (resource.project === "basic-shapes") {
		assert.deepEqual(state.rectangles, [
			["50", "75", "50", "50", firstFill("green")]
		]);
		assert.deepEqual(state.circles, [["200", "100", "50", "blue"]]);
		assert.deepEqual(state.ellipses, [["350", "100", "30", "50", "red"]]);
	}
	else if (resource.project === "smiley-face") {
		assert.deepEqual(state.rectangles, [
			["200", "25", "10", "100", firstFill("green")],
			["290", "25", "10", "100", "green"]
		]);
		assert.deepEqual(
			state.paths.map(p => p.slice(0, 2)),
			[["translate(250,200)", "green"]]
		);
	}
	else if (resource.project === "pac-man") {
		assert.deepEqual(
			state.paths.map(p => p.slice(0, 2)),
			[
				["translate(150,110)", firstFill("yellow")],
				["translate(400,110)", "yellow"]
			]
		);
		assert.notEqual(state.paths[0][2], state.paths[1][2]);
	}
	else if (resource.project === "captain-america-shield") {
		assert.deepEqual(state.circles, [
			["200", "200", "110", firstFill("red")],
			["200", "200", "90", "white"],
			["200", "200", "70", "red"],
			["200", "200", "50", "blue"]
		]);
		assert.deepEqual(
			state.paths.map(p => p.slice(0, 2)),
			[["translate(200,200)", "white"]]
		);
	}
	else {
		const olaf = resource.project === "debugging-olaf-star";
		assert.deepEqual(state.circles, [
			["150", olaf ? "100" : "50", "50", firstFill("white")],
			["125", olaf ? "85" : "35", "5", "black"],
			["175", olaf ? "85" : "35", "5", "black"],
			["150", olaf ? "100" : "50", "5", "orange"],
			["150", olaf ? "210" : "160", "70", "white"],
			["150", olaf ? "350" : "300", "100", "white"]
		]);
		assert.equal(state.lines.length, olaf ? 10 : 2);
		assert.equal(
			state.paths[0][0],
			olaf ? "translate(150,120)" : "translate(150,70)"
		);
		if (olaf) {
			assert.equal(state.paths.length, 2);
			if (resource.role === "starter" && kind === "exact") {
				assert.equal(state.paths[1][2], null);
			}
			else {
				assert.deepEqual(state.paths[1].slice(0, 2), [
					"translate(150,210)",
					resource.role === "starter" ? editedColor : "yellow"
				]);
			}
		}
	}
	for (const [, , data] of state.paths) {
		if (data !== null)
			assert.ok(data.length > 0 && !/NaN|Infinity/u.test(data));
	}
	return state;
}
