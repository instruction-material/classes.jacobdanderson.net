import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const fixture = JSON.parse(
	readFileSync(
		new URL("./fixtures/javascript-shop-sources.json", import.meta.url),
		"utf8"
	)
);

export function editedShopSource(resource, filename) {
	const reference = fixture.resources.find(
		row => row.project === resource.project && row.role === "reference"
	);
	const source = readFileSync(
		new URL(
			`../front-end/public/course-assets/javascript-level-1/${
				reference.files.find(file => file.name === filename).path
			}`,
			import.meta.url
		),
		"utf8"
	);
	if (filename === "index.html") {
		return source
			.replace("<title>", "<title>Saved ")
			.replace("<h1>", "<h1 data-saved-edit=\"true\">Saved ");
	}
	if (filename === "script.js") {
		return `${
			source
		}\ndocument.querySelector("h1").style.color = "#7c3aed";\ndocument.querySelector("h1 a").style.color = "#7c3aed";\ndocument.querySelector("h1").dataset.savedScript = "true";\n`;
	}
	return `${source}\nbody { border-top: 6px solid #7c3aed; }\n`;
}

async function currentPhoto(page, expected) {
	await page.waitForFunction(
		(index) => {
			const root = document.querySelector("#featured-carousel");
			const active = root.querySelectorAll(".carousel-item")[index];
			const rect = active.getBoundingClientRect();
			const parent = root.getBoundingClientRect();
			return (
				root.dataset.activeFeature === String(index)
				&& Math.abs(rect.left - parent.left) < 1
				&& Math.abs(rect.width - parent.width) < 1
			);
		},
		{},
		expected
	);
	assert.equal(
		await page.$$eval(
			".carousel-item",
			nodes =>
				nodes.filter(
					n => !n.inert && n.getAttribute("aria-hidden") === "false"
				).length
		),
		1
	);
}
async function activate(page, selector) {
	await page.focus(selector);
	await page.keyboard.press("Enter");
}
export async function inspectShop(page, resource, kind) {
	const state = await page.evaluate(() => ({
		noHorizontalOverflow:
			document.documentElement.scrollWidth <= innerWidth,
		reduced: matchMedia("(prefers-reduced-motion: reduce)").matches,
		width: innerWidth
	}));
	assert.ok(state.noHorizontalOverflow);
	if (resource.role === "starter" && kind === "exact") {
		assert.equal(await page.$eval("main", n => n.textContent.trim()), "");
		assert.equal(await page.$(".carousel,.product-card"), null);
		state.authoredCompanionUnfinished = true;
		return state;
	}
	await page.waitForFunction(() =>
		[...document.images].every(i => i.complete && i.naturalWidth > 0)
	);
	assert.equal(await page.$$eval("img", nodes => nodes.length), 10);
	assert.equal(await page.$$eval(".carousel-item", nodes => nodes.length), 4);
	assert.deepEqual(
		await page.$$eval(".product-card h3", nodes =>
			nodes.map(n => n.textContent)),
		fixture.correctedProductLabels
	);
	assert.deepEqual(
		await page.$$eval(".product-card .price", nodes =>
			nodes.map(n => n.textContent)),
		["$270.00", "$80.00", "$30.00", "$350.00", "$70.00", "$50.00"]
	);
	await currentPhoto(page, 0);
	for (let index = 1; index < 4; index++) {
		await activate(page, "#next-feature");
		await currentPhoto(page, index);
	}
	await activate(page, "#next-feature");
	await currentPhoto(page, 0);
	await activate(page, "#previous-feature");
	await currentPhoto(page, 3);
	await activate(page, "#next-feature");
	await currentPhoto(page, 0);
	state.keyboardAllFourPhotosAndWrapPassed = true;
	assert.equal(
		await page.$eval(
			"#featured-carousel",
			node => window.M.Carousel.getInstance(node).options.duration
		),
		state.reduced ? 0 : 200
	);
	if (!state.reduced) {
		await page.emulateMediaFeatures([
			{ name: "prefers-reduced-motion", value: "reduce" }
		]);
		await page.waitForFunction(
			() =>
				window.M.Carousel.getInstance(
					document.querySelector("#featured-carousel")
				).options.duration === 0
		);
		await activate(page, "#next-feature");
		await currentPhoto(page, 1);
		await page.emulateMediaFeatures([
			{ name: "prefers-reduced-motion", value: "no-preference" }
		]);
		await page.waitForFunction(
			() =>
				window.M.Carousel.getInstance(
					document.querySelector("#featured-carousel")
				).options.duration === 200
		);
		await activate(page, "#previous-feature");
		await currentPhoto(page, 0);
		state.liveMotionPreferenceChangePassed = true;
	}
	await activate(page, ".carousel-item.active");
	await page.waitForFunction(
		() =>
			location.hash === "#shop"
			&& document.querySelector("#shop-title").getBoundingClientRect().top
			>= 0
			&& document.querySelector("#shop-title").getBoundingClientRect().top
			< innerHeight
	);
	state.keyboardPhotoShopLinkPassed = true;
	assert.equal(await page.$eval("#cart-count", n => n.textContent), "0");
	assert.equal(await page.$eval("#cart-total", n => n.textContent), "$0.00");
	await activate(page, "[data-add=\"product-1\"]");
	await activate(page, "[data-add=\"product-1\"]");
	await activate(page, "[data-add=\"product-3\"]");
	assert.equal(await page.$eval("#cart-count", n => n.textContent), "3");
	assert.equal(
		await page.$eval("#cart-total", n => n.textContent),
		"$570.00"
	);
	await activate(page, "#cart-summary");
	assert.ok(await page.$eval("#cart-panel", n => n.open));
	assert.equal(await page.$$eval(".cart-entry", nodes => nodes.length), 2);
	await activate(page, "[data-remove=\"product-1\"]");
	assert.equal(
		await page.$eval("#cart-total", n => n.textContent),
		"$300.00"
	);
	assert.ok(
		await page.evaluate(
			() => document.activeElement.dataset.remove === "product-1"
		)
	);
	await page.keyboard.press("Enter");
	assert.equal(await page.$eval("#cart-total", n => n.textContent), "$30.00");
	assert.ok(
		await page.evaluate(
			() => document.activeElement.dataset.remove === "product-3"
		)
	);
	await page.keyboard.press("Enter");
	assert.equal(await page.$eval("#cart-count", n => n.textContent), "0");
	assert.ok(
		await page.evaluate(() => document.activeElement.id === "cart-summary")
	);
	assert.equal(await page.$eval("#cart-empty", n => n.hidden), false);
	state.repeatedQuantityAndRemovalFocusPassed = true;
	for (let index = 1; index <= 6; index++)
		await activate(page, `[data-add="product-${index}"]`);
	assert.equal(await page.$eval("#cart-count", n => n.textContent), "6");
	assert.equal(
		await page.$eval("#cart-total", n => n.textContent),
		"$850.00"
	);
	assert.equal(await page.$$eval(".cart-entry", nodes => nodes.length), 6);
	state.originalSixPriceTotalPassed = true;
	for (let index = 1; index <= 6; index++)
		await activate(page, `[data-remove="product-${index}"]`);
	assert.equal(await page.$eval("#cart-total", n => n.textContent), "$0.00");
	assert.equal(await page.$$eval(".cart-entry", nodes => nodes.length), 0);
	await activate(page, "#cart-summary");
	assert.equal(await page.$eval("#cart-panel", n => n.open), false);
	state.cartKeyboardAddRemoveAndEmptyPassed = true;
	if (kind === "edited") {
		assert.ok(
			await page.$eval(
				"h1",
				n =>
					n.textContent.startsWith("Saved ")
					&& n.dataset.savedScript === "true"
			)
		);
		assert.equal(
			await page.$eval("h1 a", n => getComputedStyle(n).color),
			"rgb(124, 58, 237)"
		);
		state.visibleSavedEdits = true;
	}
	if (resource.role === "reference" && kind === "exact" && !state.reduced) {
		const fallback = await page.browserContext().newPage();
		let outside = 0;
		try {
			await fallback.setJavaScriptEnabled(false);
			await fallback.setViewport({ width: state.width, height: 900 });
			await fallback.setRequestInterception(true);
			fallback.on("request", (request) => {
				if (/^https?:/i.test(request.url())) {
					outside++;
					void request.abort();
				}
				else {
					void request.continue();
				}
			});
			await fallback.goto(page.url(), { waitUntil: "load" });
			assert.equal(
				await fallback.$$eval(".product-card", nodes => nodes.length),
				6
			);
			assert.ok(
				await fallback.$$eval(
					".carousel-item",
					nodes =>
						nodes.length === 4
						&& nodes.every(
							n =>
								getComputedStyle(n).display !== "none"
								&& n.getBoundingClientRect().height > 0
						)
				)
			);
			assert.equal(
				await fallback.$$eval(
					"button[data-add]:disabled",
					nodes => nodes.length
				),
				6
			);
			assert.ok(
				await fallback.evaluate(
					() => document.documentElement.scrollWidth <= innerWidth
				)
			);
			assert.equal(outside, 0);
			state.noJavaScriptCatalogReadable = true;
		}
		finally {
			await fallback.close();
		}
	}
	await currentPhoto(page, 0);
	await page.evaluate(() => scrollTo({ top: 0, behavior: "instant" }));
	return state;
}
