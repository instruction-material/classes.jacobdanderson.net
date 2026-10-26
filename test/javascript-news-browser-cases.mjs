import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import process from "node:process";

const fixture = JSON.parse(
	readFileSync(
		new URL("./fixtures/javascript-news-sources.json", import.meta.url),
		"utf8"
	)
);

export function editedNewsSource(resource, filename) {
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

function wait(page) {
	return page.waitForFunction(() => !document.querySelector(".modal.open"));
}
export async function inspectNews(page, resource, kind) {
	const state = await page.evaluate(() => ({
		noHorizontalOverflow:
			document.documentElement.scrollWidth <= innerWidth,
		reduced: matchMedia("(prefers-reduced-motion: reduce)").matches,
		width: innerWidth
	}));
	assert.ok(state.noHorizontalOverflow);
	if (resource.role === "starter" && kind === "exact") {
		assert.equal(await page.$eval("main", n => n.textContent.trim()), "");
		assert.equal(await page.$(".slider,.modal"), null);
		state.authoredCompanionUnfinished = true;
		return state;
	}
	await page.waitForFunction(() =>
		[...document.images].every(i => i.complete && i.naturalWidth > 0)
	);
	assert.equal(await page.$$eval(".slides > li", n => n.length), 3);
	assert.equal(await page.$$eval(".modal", n => n.length), 3);
	assert.equal(
		await page.$eval("#playback", n => n.getAttribute("aria-pressed")),
		"false"
	);
	assert.equal(await page.$eval("#playback", n => n.disabled), state.reduced);
	const active = () =>
		page.$eval(".slides > li.active", n =>
			[...n.parentElement.children].indexOf(n));
	await page.focus("#next-story");
	await page.keyboard.press("Enter");
	await page.waitForFunction(
		() =>
			document.querySelector(".slides > li.active")
			=== document.querySelectorAll(".slides > li")[1]
	);
	await page.focus("#previous-story");
	await page.keyboard.press("Enter");
	await page.waitForFunction(
		() =>
			document.querySelector(".slides > li.active")
			=== document.querySelectorAll(".slides > li")[0]
	);
	assert.equal(await active(), 0);
	state.keyboardPreviousNextPassed = true;
	await page.waitForFunction(
		() => !document.querySelector(".slides > li.active").inert
	);
	for (let index = 0; index < 3; index++) {
		if (index > 0) {
			await page.focus("#next-story");
			await page.keyboard.press("Enter");
			await page.waitForFunction(
				i =>
					document.querySelector(".slides > li.active")
					=== document.querySelectorAll(".slides > li")[i],
				{},
				index
			);
		}
		const trigger = ".slides > li.active .modal-trigger";
		await page.focus(trigger);
		await page.keyboard.press("Enter");
		await page.waitForFunction(
			i =>
				document.querySelector(`#modal${i}`).classList.contains("open"),
			{},
			index + 1
		);
		await page.waitForFunction(
			i => document.activeElement.closest(`#modal${i}`),
			{},
			index + 1
		);
		await page.waitForFunction(i => getComputedStyle(document.querySelector(`#modal${i}`)).opacity === "1", {}, index + 1);
		if (index === 0 && resource.role === "reference" && kind === "exact" && !state.reduced) {
			const path = join(process.env.JAVASCRIPT_NEWS_BROWSER_DIR ?? "output/javascript-news-browser", "news-homepage", `dialog-${state.width}.png`);
			await page.screenshot({ path, fullPage: false });
			state.dialogScreenshot = path;
		}
		for (let tab = 0; tab < 3; tab++) {
			await page.keyboard.press("Tab");
			if (tab === 0 && index === 0 && resource.role === "reference" && kind === "exact" && !state.reduced) {
				const path = join(process.env.JAVASCRIPT_NEWS_BROWSER_DIR ?? "output/javascript-news-browser", "news-homepage", `dialog-footer-${state.width}.png`);
				await page.screenshot({ path, fullPage: false });
				state.dialogFooterScreenshot = path;
			}
			assert.ok(
				await page.evaluate(
					i => Boolean(document.activeElement.closest(`#modal${i}`)),
					index + 1
				)
			);
		}
		assert.equal(
			await page.$eval("#playback", n => n.getAttribute("aria-pressed")),
			"false"
		);
		await page.keyboard.press("Escape");
		await wait(page);
		await page.waitForFunction(() =>
			document.activeElement.matches(".slides > li.active .modal-trigger")
		);
	}
	state.keyboardModalFocusAndEscapePassed = true;
	state.originalThreeStoryLinksPassed = true;
	if (!state.reduced) {
		await page.focus("#playback");
		await page.keyboard.press("Enter");
		assert.equal(
			await page.$eval("#playback", n => n.getAttribute("aria-pressed")),
			"true"
		);
		await page.keyboard.press("Enter");
		assert.equal(
			await page.$eval("#playback", n => n.getAttribute("aria-pressed")),
			"false"
		);
		await page.emulateMediaFeatures([
			{ name: "prefers-reduced-motion", value: "reduce" }
		]);
		await page.waitForFunction(
			() => document.querySelector("#playback").disabled
		);
		assert.equal(
			await page.$eval("#playback", n => n.getAttribute("aria-pressed")),
			"false"
		);
		await page.emulateMediaFeatures([
			{ name: "prefers-reduced-motion", value: "no-preference" }
		]);
		await page.waitForFunction(
			() => !document.querySelector("#playback").disabled
		);
		assert.equal(
			await page.$eval("#playback", n => n.getAttribute("aria-pressed")),
			"false"
		);
		state.explicitPlaybackAndMotionChangePassed = true;
	}
	if (kind === "edited") {
		assert.ok(
			await page.$eval(
				"h1",
				n =>
					n.textContent.startsWith("Saved ")
					&& n.dataset.savedScript === "true"
			)
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
			assert.ok(
				await fallback.$$eval(
					".modal",
					nodes =>
						nodes.length === 3
						&& nodes.every(
							n =>
								getComputedStyle(n).display !== "none"
								&& n.getBoundingClientRect().height > 0
						)
				)
			);
			assert.equal(outside, 0);
			assert.ok(
				await fallback.evaluate(
					() => document.documentElement.scrollWidth <= innerWidth
				)
			);
			state.noJavaScriptStoriesReadable = true;
		}
		finally {
			await fallback.close();
		}
	}
	await page.waitForFunction(() => !window.M.anime.running.some(animation => animation.animatables.some(({ target }) => target instanceof Node && document.querySelector(".news-slider").contains(target))));
	await page.waitForFunction(() => getComputedStyle(document.querySelector(".slides > li.active .caption")).opacity === "1");
	const caption = await page.$eval(".slides > li.active .feature-card", node => ({ background: getComputedStyle(node).backgroundColor, summary: getComputedStyle(node.querySelector("p")).color }));
	assert.deepEqual(caption, { background: "rgb(255, 255, 255)", summary: "rgb(22, 44, 56)" });
	state.settledCaptionReadable = true;
	await page.evaluate(() => scrollTo({ top: 0, behavior: "instant" }));
	return state;
}
