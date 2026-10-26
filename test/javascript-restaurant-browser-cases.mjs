import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const fixture = JSON.parse(
	readFileSync(
		new URL(
			"./fixtures/javascript-restaurant-sources.json",
			import.meta.url
		),
		"utf8"
	)
);

export function editedRestaurantSource(resource, filename) {
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

function frame(page) {
	return page.evaluate(
		() =>
			new Promise(resolve =>
				requestAnimationFrame(() => requestAnimationFrame(resolve))
			)
	);
}

export async function inspectRestaurant(page, resource, kind) {
	const unfinished = resource.role === "starter" && kind === "exact";
	const state = await page.evaluate(() => ({
		noHorizontalOverflow:
			document.documentElement.scrollWidth <= innerWidth,
		headingCount: document.querySelectorAll("h1").length,
		reduced: matchMedia("(prefers-reduced-motion: reduce)").matches,
		width: innerWidth
	}));
	assert.ok(state.noHorizontalOverflow);
	if (unfinished) {
		assert.equal(state.headingCount, 0);
		assert.equal(
			await page.$eval("main", node => node.textContent.trim()),
			""
		);
		assert.equal(await page.$(".card,.parallax"), null);
		assert.equal(await page.evaluate(() => window.M.version), "1.0.0");
		state.authoredCompanionUnfinished = true;
		return state;
	}
	assert.equal(state.headingCount, 1);
	await page.waitForFunction(() =>
		[...document.images].every(
			image => image.complete && image.naturalWidth > 0
		)
	);
	assert.equal(await page.$$eval("img", nodes => nodes.length), 7);
	assert.equal(await page.$$eval(".parallax", nodes => nodes.length), 2);
	assert.deepEqual(
		await page.$$eval(".card h3", nodes =>
			nodes.map(node => node.textContent)),
		["Enchiladas", "Burrito", "Tacos", "Torta", "Sopa"]
	);
	assert.deepEqual(
		await page.$$eval(".price", nodes =>
			nodes.map(node => node.textContent)),
		["$12.50", "$9.50", "$10.50", "$11.50", "$7.50"]
	);
	assert.equal(await page.$$eval(".menu .right", nodes => nodes.length), 2);
	assert.equal(
		await page.$$eval(".card.horizontal", nodes => nodes.length),
		5
	);
	assert.equal(
		await page.$$eval(
			".card.horizontal",
			nodes =>
				nodes.filter(
					node => getComputedStyle(node).flexDirection === "column"
				).length
		),
		state.width <= 600 ? 5 : 0
	);
	if (kind === "edited") {
		const saved = await page.$eval("h1", node => ({
			heading: node.textContent.startsWith("Saved "),
			script: node.dataset.savedScript,
			color: getComputedStyle(node).color,
			linkColor: getComputedStyle(node.querySelector("a")).color
		}));
		assert.ok(saved.heading && saved.script === "true");
		assert.equal(saved.color, "rgb(124, 58, 237)");
		assert.equal(saved.linkColor, "rgb(124, 58, 237)");
		assert.equal(
			await page.$eval(
				"body",
				node => getComputedStyle(node).borderTopColor
			),
			"rgb(124, 58, 237)"
		);
		state.visibleSavedEdits = true;
	}
	if (resource.role === "reference" && kind === "exact" && !state.reduced) {
		const noJavaScript = await page.browserContext().newPage();
		let outsideRequests = 0;
		try {
			await noJavaScript.setViewport({
				width: state.width,
				height: 1000
			});
			await noJavaScript.setJavaScriptEnabled(false);
			await noJavaScript.setRequestInterception(true);
			noJavaScript.on("request", (request) => {
				if (/^https?:/i.test(request.url())) {
					outsideRequests += 1;
					request.abort();
				}
				else {
					request.continue();
				}
			});
			await noJavaScript.goto(page.url(), { waitUntil: "load" });
			await noJavaScript.waitForFunction(() =>
				[...document.images].every(
					image => image.complete && image.naturalWidth > 0
				)
			);
			const fallback = await noJavaScript.evaluate(() => ({
				cards: document.querySelectorAll(".card.horizontal").length,
				images: document.images.length,
				readable: document.documentElement.scrollWidth <= innerWidth,
				staticImages: [
					...document.querySelectorAll(".parallax img")
				].every(
					node =>
						getComputedStyle(node).opacity === "1"
						&& getComputedStyle(node).transform === "none"
				),
				componentScriptAbsent: typeof window.M === "undefined"
			}));
			assert.equal(outsideRequests, 0);
			assert.equal(fallback.cards, 5);
			assert.equal(fallback.images, 7);
			assert.ok(
				fallback.readable
				&& fallback.staticImages
				&& fallback.componentScriptAbsent
			);
			state.noJavaScriptFallback = fallback;
		}
		finally {
			await noJavaScript.close();
		}
	}
	const installed = () =>
		page.$$eval(
			".parallax",
			nodes =>
				nodes.filter(node => window.M.Parallax.getInstance(node)).length
		);
	const enabled = !state.reduced && state.width > 600;
	assert.equal(await installed(), enabled ? 2 : 0);
	if (enabled) {
		await page.evaluate(() => scrollTo({ top: 0, behavior: "instant" }));
		await frame(page);
		const before = await page.$eval(
			".parallax img",
			node => getComputedStyle(node).transform
		);
		await page.evaluate(() => scrollTo({ top: 180, behavior: "instant" }));
		await frame(page);
		const after = await page.$eval(
			".parallax img",
			node => getComputedStyle(node).transform
		);
		assert.notEqual(after, before);
		state.actualParallaxScrollChanged = true;
		await page.emulateMediaFeatures([
			{ name: "prefers-reduced-motion", value: "reduce" }
		]);
		await page.waitForFunction(
			() => document.documentElement.dataset.parallaxMotion === "static"
		);
		assert.equal(await installed(), 0);
		await page.emulateMediaFeatures([
			{ name: "prefers-reduced-motion", value: "no-preference" }
		]);
		await page.waitForFunction(
			() => document.documentElement.dataset.parallaxMotion === "enabled"
		);
		assert.equal(await installed(), 2);
		state.inPlaceMotionPreferenceChanges = true;
	}
	else {
		assert.ok(
			await page.$$eval(".parallax img", nodes =>
				nodes.every(
					node =>
						getComputedStyle(node).transform === "none"
						&& getComputedStyle(node).opacity === "1"
				))
		);
		state.staticFallbackImagesVisible = true;
	}
	await page.focus(".menu-link");
	await page.keyboard.press("Enter");
	await page.waitForFunction(() => {
		const heading = document.querySelector("#menu-title");
		const top = heading?.getBoundingClientRect().top;
		return location.hash === "#menu" && top >= 0 && top < innerHeight;
	});
	assert.ok(page.url().endsWith("#menu"));
	assert.ok(
		await page.$eval(
			"#menu-title",
			node =>
				node.getBoundingClientRect().top >= 0
				&& node.getBoundingClientRect().top < innerHeight
		)
	);
	await page.focus("summary");
	await page.keyboard.press("Enter");
	assert.ok(await page.$eval("details", node => node.open));
	await page.keyboard.press("Enter");
	assert.equal(await page.$eval("details", node => node.open), false);
	state.keyboardMenuAndCreditsPassed = true;
	await page.evaluate(() => scrollTo({ top: 0, behavior: "instant" }));
	return state;
}
