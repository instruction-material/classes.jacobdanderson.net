import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const fixture = JSON.parse(
	readFileSync(
		new URL(
			"./fixtures/javascript-css-practice-sources.json",
			import.meta.url
		),
		"utf8"
	)
);

export function editedCssPracticeSource(resource, filename) {
	const reference = fixture.resources.find(
		row => row.project === resource.project && row.role === "reference"
	);
	const file = reference.files.find(file => file.name === filename);
	const source = readFileSync(
		new URL(
			"../front-end/public/course-assets/javascript-level-1/" + file.path,
			import.meta.url
		),
		"utf8"
	);
	return filename === "index.html"
		? source.replace("<body>", "<body>\n<h1>Saved CSS practice</h1>")
		: source + "\nbody { background-color: #f1f6f8; }\n";
}

export async function inspectCssPractice(page, resource, kind) {
	const edited = kind === "edited";
	const complete = edited || resource.role === "reference";
	const state = await page.evaluate(() => ({
		fits: document.documentElement.scrollWidth <= innerWidth,
		heading: document.querySelector("h1")?.textContent ?? null,
		background: getComputedStyle(document.body).backgroundColor
	}));
	assert.ok(state.fits);
	assert.equal(state.heading, edited ? "Saved CSS practice" : null);
	if (edited) assert.equal(state.background, "rgb(241, 246, 248)");
	if (resource.project === "css-practice-selectors") {
		state.selections = await page.evaluate(() =>
			[".menu > p", ".menu p.special", "#lunch + p"].map(selector => ({
				selector,
				texts: [...document.querySelectorAll(selector)].map(
					node => node.textContent
				)
			}))
		);
		assert.deepEqual(
			state.selections.map(row => row.texts),
			[["Soup", "Salad"], ["Soup", "Pie"], ["After"]]
		);
		const decoration = await page.evaluate(() =>
			[...document.querySelectorAll("p")].map(node => {
				const css = getComputedStyle(node);
				return [
					node.textContent,
					css.borderTopWidth,
					css.outlineStyle === "none" ? "0px" : css.outlineWidth
				];
			})
		);
		assert.deepEqual(
			decoration,
			complete
				? [
						["Soup", "2px", "2px"],
						["Salad", "2px", "0px"],
						["Pie", "0px", "2px"],
						["After", "2px", "0px"]
					]
				: [
						["Soup", "0px", "0px"],
						["Salad", "0px", "0px"],
						["Pie", "0px", "0px"],
						["After", "0px", "0px"]
					]
		);
		state.decoration = decoration;
	} else {
		const originalViewport = page.viewport();
		state.layout = await page.evaluate(() => ({
			display: getComputedStyle(document.querySelector(".cards")).display,
			texts: [...document.querySelectorAll(".card")].map(
				node => node.textContent
			)
		}));
		assert.deepEqual(state.layout.texts, ["One", "Two", "Three"]);
		assert.equal(state.layout.display, complete ? "flex" : "block");
		if (complete) {
			state.widthChecks = [];
			try {
				await page.setViewport({ width: 600, height: 900 });
				for (const width of [480, 280]) {
					const result = await page.evaluate(width => {
						const container = document.querySelector(".cards");
						container.style.width = width + "px";
						const cards = [...container.children].map(node => {
							const bounds = node.getBoundingClientRect();
							return {
								text: node.textContent,
								width: bounds.width,
								top: bounds.top
							};
						});
						return {
							width: container.getBoundingClientRect().width,
							cards,
							fits:
								document.documentElement.scrollWidth <=
								innerWidth
						};
					}, width);
					assert.equal(result.width, width);
					assert.ok(result.fits);
					assert.ok(result.cards.every(card => card.width === 140));
					assert.deepEqual(
						result.cards.map(card => card.text),
						["One", "Two", "Three"]
					);
					assert.equal(
						new Set(result.cards.map(card => card.top)).size,
						width === 480 ? 1 : 3
					);
					state.widthChecks.push(result);
				}
			} finally {
				await page.evaluate(() =>
					document
						.querySelector(".cards")
						.style.removeProperty("width")
				);
				await page.setViewport(originalViewport);
			}
		}
	}
	state.intentionallyUnfinishedStarter = !complete;
	return state;
}
