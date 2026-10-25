import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const fixture = JSON.parse(readFileSync(new URL("./fixtures/javascript-media-parallax-sources.json", import.meta.url), "utf8"));
const metadata = JSON.parse(readFileSync(new URL("./fixtures/javascript-media-parallax-metadata.json", import.meta.url), "utf8"));

export function editedMediaParallaxSource(resource, filename) {
	const reference = fixture.resources.find(row => row.project === resource.project && row.role === "reference");
	const source = readFileSync(new URL(`../front-end/public/course-assets/javascript-level-1/${reference.files.find(file => file.name === filename).path}`, import.meta.url), "utf8");
	if (filename === "index.html") return source.replace("<title>", "<title>Saved ").replace("<h1>", "<h1 data-saved-edit=\"true\">Saved ");
	if (filename === "script.js") return `${source}\ndocument.querySelector("h1").style.color = "#7c3aed";\ndocument.querySelector("h1").dataset.savedScript = "true";\n`;
	return `${source}\nbody { border-top: 6px solid #7c3aed; }\n`;
}

export async function inspectMediaParallax(page, resource, kind) {
	await page.evaluate(() => document.fonts.ready);
	const unfinished = resource.role === "starter" && kind === "exact";
	const state = await page.evaluate(() => ({ noHorizontalOverflow: document.documentElement.scrollWidth <= innerWidth, headingCount: document.querySelectorAll("h1").length, savedHeading: document.querySelector("h1")?.textContent.startsWith("Saved "), savedScript: document.querySelector("h1")?.dataset.savedScript === "true", headingColor: getComputedStyle(document.querySelector("h1")).color, borderTop: getComputedStyle(document.body).borderTopColor, reduced: matchMedia("(prefers-reduced-motion: reduce)").matches }));
	assert.ok(state.noHorizontalOverflow);
	assert.equal(state.headingCount, 1);
	if (kind === "edited") {
		assert.ok(state.savedHeading && state.savedScript);
		assert.equal(state.headingColor, "rgb(124, 58, 237)");
		assert.equal(state.borderTop, "rgb(124, 58, 237)");
	}
	if (resource.project === "video-collection") {
		const cards = await page.$$eval(".video-card", nodes => nodes.map((node) => {
			const player = node.querySelector("iframe");
			const box = player.getBoundingClientRect();
			return { title: node.querySelector("h2").textContent, description: node.querySelector("p").textContent, src: player.getAttribute("src"), iframeTitle: player.title, referrerPolicy: player.getAttribute("referrerpolicy"), fullscreen: player.hasAttribute("allowfullscreen"), watch: node.querySelector("a").href, width: box.width, height: box.height };
		}));
		assert.equal(cards.length, unfinished ? 0 : 9);
		for (const [index, card] of cards.entries()) {
			const expected = metadata.videos[index];
			assert.equal(card.src, `https://www.youtube.com/embed/${expected.id}`);
			assert.equal(card.title, expected.title);
			assert.equal(card.description, expected.description);
			assert.equal(card.watch, expected.watchURL);
			assert.equal(card.iframeTitle, `${expected.title} trailer`);
			assert.equal(card.referrerPolicy, "strict-origin-when-cross-origin");
			assert.ok(card.fullscreen && card.width >= 200 && card.height >= 200, JSON.stringify(card));
		}
		state.cards = cards;
		state.videoPlaybackVerifiedByThisTest = false;
		state.offlineShellOnly = true;
	}
	else {
		assert.equal(resource.project, "national-park");
		const count = await page.$$eval(".parallax", nodes => nodes.length);
		assert.equal(count, unfinished ? 0 : 2);
		if (unfinished) {
			state.authoredScaffoldUnfinished = true;
			return state;
		}
		await page.waitForFunction(() => [...document.images].every(image => image.complete && image.naturalWidth > 0));
		assert.deepEqual(await page.$$eval("h2", nodes => nodes.map(n => n.textContent)), ["Location", "Notable features", "Activities", "Visitor tips"]);
		assert.deepEqual(await page.$$eval("figcaption", nodes => nodes.map(n => n.textContent)), ["Lower Falls from Artist Point. National Park Service / William S Keller, 1969.", "Grand Prismatic Spring. National Park Service / Al Mebane, 1973."]);
		const installed = () => page.$$eval(".parallax", nodes => nodes.filter(node => window.M.Parallax.getInstance(node)).length);
		assert.equal(await installed(), state.reduced ? 0 : 2);
		if (state.reduced) {
			assert.ok(await page.$$eval(".parallax img", nodes => nodes.every(node => getComputedStyle(node).transform === "none" && getComputedStyle(node).opacity === "1")));
			state.staticReducedMotionImages = true;
		}
		else {
			await page.evaluate(() => scrollTo({ top: 0, behavior: "instant" }));
			await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
			const before = await page.$eval(".parallax img", node => getComputedStyle(node).transform);
			await page.evaluate(() => scrollTo({ top: 140, behavior: "instant" }));
			await page.waitForFunction(previous => getComputedStyle(document.querySelector(".parallax img")).transform !== previous, {}, before);
			state.realParallaxTransformChanged = true;
			await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);
			await page.waitForFunction(() => [...document.querySelectorAll(".parallax")].every(node => !window.M.Parallax.getInstance(node)) && [...document.querySelectorAll(".parallax img")].every(node => getComputedStyle(node).transform === "none"));
			await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "no-preference" }]);
			await page.waitForFunction(() => [...document.querySelectorAll(".parallax")].every(node => !!window.M.Parallax.getInstance(node)));
			state.inPlaceMotionPreferenceChangesPassed = true;
		}
		state.realParallaxInstances = state.reduced ? 0 : 2;
	}
	return state;
}
