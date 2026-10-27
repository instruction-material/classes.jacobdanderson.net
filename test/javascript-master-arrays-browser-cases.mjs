import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const fixture = JSON.parse(
	readFileSync(
		new URL(
			"./fixtures/javascript-master-arrays-sources.json",
			import.meta.url
		),
		"utf8"
	)
);
export function editedArraysSource(resource, filename) {
	const reference = fixture.resources.find(
		r => r.project === resource.project && r.role === "reference"
	);
	const source = readFileSync(
		new URL(
			`../front-end/public/course-assets/javascript-level-2/${reference.files.find(f => f.name === filename).path}`,
			import.meta.url
		),
		"utf8"
	);
	if (filename === "index.html") {
		return source
			.replace("<title>", "<title>Saved ")
			.replace("<h1>", '<h1 data-saved-edit="true">Saved ');
	}
	if (filename === "script.js") {
		return `${
			source
		}\ndocument.querySelector("h1").style.color = "#7c3aed";\ndocument.querySelector("h1").dataset.savedScript = "true";\n`;
	}
	return `${source}\nbody { border-top: 6px solid #7c3aed; }\n`;
}

export async function inspectArrays(page, resource, kind) {
	await page.waitForFunction(
		() => document.querySelector("main")?.dataset.state === "loaded"
	);
	await page.evaluate(async () => {
		await document.fonts.ready;
	});
	const rendered = await page.evaluate(() => {
		const canvas = document.querySelector("canvas");
		const points = [];
		let painted = 0;
		if (canvas) {
			const ctx = canvas.getContext("2d");
			const data = ctx.getImageData(
				0,
				0,
				canvas.width,
				canvas.height
			).data;
			for (let i = 3; i < data.length; i += 4) {
				if (data[i] > 0) painted++;
			}
			const rows =
				document.body.dataset.project === "colorful-cards" ? 1 : 5;
			for (let row = 0; row < rows; row++) {
				for (let col = 0; col < 5; col++) {
					points.push(
						Array.from(
							ctx.getImageData(
								75 + col * 200,
								200 + row * 150,
								1,
								1
							).data
						)
					);
				}
			}
		}
		return {
			output: Array.from(document.querySelectorAll("#output p")).map(
				x => x.textContent
			),
			icons: Array.from(document.querySelectorAll(".row i")).map(x => ({
				name: x.textContent,
				color: Array.from(x.classList)
					.find(v => v.endsWith("-text"))
					?.slice(0, -5),
				hidden: x.getAttribute("aria-hidden"),
				font: getComputedStyle(x).fontFamily
			})),
			pairs: Array.from(document.querySelectorAll("#icon-pairs li")).map(
				x => x.textContent
			),
			fontLoaded: document.fonts.check('64px "Material Icons"'),
			width: canvas?.width,
			height: canvas?.height,
			points,
			painted,
			description: document.querySelector("#drawing-description")
				?.textContent,
			errorVisible: !document.querySelector("#source-error").hidden,
			noHorizontalOverflow:
				document.documentElement.scrollWidth <= innerWidth,
			saved: document.querySelector("h1").dataset.savedScript
		};
	});
	assert.ok(rendered.noHorizontalOverflow);
	assert.equal(rendered.errorVisible, false);
	const unfinished = resource.role === "starter" && kind === "exact";
	if (unfinished) {
		assert.equal(rendered.painted, 0);
		assert.equal(rendered.icons.length, 0);
		if (resource.project === "integrating-iterators")
			assert.deepEqual(rendered.output, ["[]", "undefined", "undefined"]);
		else assert.equal(rendered.output.length, 0);
		return { ...rendered, originalTaskUnfinished: true };
	}
	if (kind === "edited") assert.equal(rendered.saved, "true");
	if (resource.project === "foray-into-arrays") {
		assert.equal(rendered.output.length, 7);
		assert.deepEqual(JSON.parse(rendered.output[0]), [
			"dog",
			"cat",
			"komodo dragon",
			"guinea pig"
		]);
		assert.deepEqual(
			JSON.parse(rendered.output[1]),
			Array.from({ length: 20 }, (_, i) => (i + 1) ** 2)
		);
		assert.deepEqual(
			JSON.parse(rendered.output[2]),
			Array.from({ length: 11 }, (_, i) => (i + 5) ** 2)
		);
		assert.deepEqual(rendered.output.slice(3, 5), ["2870", "1210"]);
		const sample = JSON.parse(rendered.output[5]);
		assert.equal(sample.length, 10);
		assert.ok(sample.every(v => Number.isInteger(v) && v >= 11 && v <= 15));
		assert.equal(rendered.output[6], String(sample[0] === sample.at(-1)));
	} else if (resource.project === "integrating-iterators") {
		assert.equal(rendered.output.length, 6);
		assert.match(rendered.output[0], /\[15,18,42,24,36\]/);
		assert.match(rendered.output[1], /\[9,1,3,0,2\]/);
		assert.deepEqual(rendered.output.slice(2, 4), [
			"olleh dlrow",
			"I am an actual function!"
		]);
		assert.match(rendered.output[4], /1018/);
		assert.match(rendered.output[5], /\[9,3,6,0\]/);
	} else if (resource.project === "pokemon-master") {
		assert.deepEqual(rendered.output, [
			"Psyduck",
			"175",
			"fire",
			"Charmander is a fire-type Pokemon with an id of 4.",
			"Pikachu is a electric-type Pokemon with an id of 25.",
			"Psyduck is a water-type Pokemon with an id of 54.",
			"Togepi is a fairy-type Pokemon with an id of 175.",
			"Skitty is a normal-type Pokemon with an id of 300."
		]);
	} else if (resource.logicalCanvas) {
		assert.equal(rendered.width, resource.logicalCanvas.width);
		assert.equal(rendered.height, resource.logicalCanvas.height);
		const colors = [
			[0, 128, 0, 255],
			[255, 0, 0, 255],
			[0, 0, 255, 255],
			[255, 255, 0, 255],
			[0, 255, 255, 255]
		];
		const rows = resource.project === "colorful-cards" ? 1 : 5;
		assert.equal(rendered.painted, rows * 5 * 150 * 100);
		assert.deepEqual(
			rendered.points,
			Array.from({ length: rows }, (_, row) =>
				Array.from({ length: 5 }, (_, col) => colors[(row + col) % 5])
			).flat()
		);
		assert.match(rendered.description, /green, red, blue, yellow, cyan/);
	} else {
		assert.equal(rendered.icons.length, 6);
		assert.equal(rendered.pairs.length, 6);
		assert.ok(rendered.fontLoaded);
		const allowedIcons = [
			"3d_rotation",
			"access_time",
			"backspace",
			"cached",
			"dashboard",
			"equalizer",
			"filter_hdr",
			"g_translate",
			"headset",
			"image",
			"keyboard",
			"local_airport",
			"monetization_on",
			"notifications_none",
			"opacity",
			"panorama",
			"question_answer",
			"radio",
			"sentiment_dissatisfied",
			"time_to_leave",
			"usb",
			"videogame_asset",
			"wifi"
		];
		const allowedColors = [
			"red",
			"orange",
			"teal",
			"pink",
			"yellow",
			"green",
			"blue",
			"grey",
			"brown",
			"indigo",
			"cyan",
			"lime"
		];
		for (let i = 0; i < 6; i++) {
			const icon = rendered.icons[i];
			assert.ok(allowedIcons.includes(icon.name));
			assert.ok(allowedColors.includes(icon.color));
			assert.equal(icon.hidden, "true");
			assert.match(icon.font, /Material Icons/);
			assert.equal(rendered.pairs[i], `${icon.name}: ${icon.color}`);
		}
	}
	return { ...rendered, actualArrayResultsAccepted: true };
}
