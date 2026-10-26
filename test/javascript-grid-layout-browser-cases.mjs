import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const fixture = JSON.parse(readFileSync(new URL("./fixtures/javascript-grid-layout-sources.json", import.meta.url), "utf8"));

export function editedGridLayoutSource(resource, filename) {
	const reference = fixture.resources.find(row => row.project === resource.project && row.role === "reference");
	const source = readFileSync(new URL(`../front-end/public/course-assets/javascript-level-1/${reference.files.find(file => file.name === filename).path}`, import.meta.url), "utf8");
	if (filename === "script.js") return source.replace(".attr(\"fill\", \"red\")", ".attr(\"fill\", \"purple\")");
	return filename === "index.html"
		? source.replace("<title>", "<title>Saved ").replace("<h1", "<h1 data-saved-edit=\"true\"")
		: `${source}\nbody { border-top: 6px solid #7c3aed; }\n`;
}

export async function inspectGridLayout(page, resource, kind) {
	await page.evaluate(() => document.fonts.ready);
	await page.waitForFunction(() => [...document.images].every(image => image.complete && image.naturalWidth > 0));
	const art = resource.project === "my-javascript-art-part-3";
	const unfinished = resource.role === "starter" && kind === "exact";
	if (art) await page.waitForFunction(() => document.querySelectorAll("#rainbow path").length === 7 && [...document.querySelectorAll("#rainbow path")].every(node => getComputedStyle(node).opacity === "1"));
	const state = await page.evaluate(() => {
		const all = selector => [...document.querySelectorAll(selector)];
		const box = (node) => {
			const r = node.getBoundingClientRect();
			return { x: r.x, y: r.y, width: r.width, height: r.height, right: r.right };
		};
		return {
			width: innerWidth,
			noHorizontalOverflow: document.documentElement.scrollWidth <= innerWidth,
			savedHeading: !!document.querySelector("h1[data-saved-edit]"),
			borderTop: getComputedStyle(document.body).borderTopColor,
			headings: all("h1,h2").map(node => node.textContent.trim()),
			board: document.querySelector(".board") ? box(document.querySelector(".board")) : null,
			tiles: all(".tile").map(node => ({ ...box(node), dark: node.classList.contains("dark") })),
			numbered: all("section[aria-label=\"Twelve numbered cards\"] .card").map(node => ({ ...box(node), text: node.textContent.trim() })),
			info: all("section[aria-label=\"Six learning cards\"] .card").map(box),
			icons: all(".material-icons").map(node => ({ name: node.textContent.trim(), hiddenFromAT: node.getAttribute("aria-hidden") })),
			fontLoaded: [...document.fonts].some(font => font.family.includes("Material Icons") && font.status === "loaded"),
			images: all("img").map(node => ({ ...box(node), alt: node.getAttribute("alt"), loaded: node.complete && node.naturalWidth > 0 })),
			team: all(".team-card").map(node => ({ ...box(node), name: node.querySelector("h2").textContent, nickname: node.querySelector(".nickname").textContent, stats: [...node.querySelectorAll("dd")].map(n => n.textContent), moves: [...node.querySelectorAll("tbody td")].map(n => n.textContent), captions: [...node.querySelectorAll("caption")].map(n => n.textContent) })),
			statsLabels: all(".stats abbr").map(node => node.title),
			employees: all(".employee").map(node => ({ name: node.querySelector("h2").textContent, bio: node.querySelector("p").textContent, radius: getComputedStyle(node.querySelector("img")).borderRadius })),
			works: all(".artwork").map(node => ({ ...box(node), title: node.querySelector("h2").textContent, href: node.querySelector("a").href, paragraphs: [...node.querySelectorAll("p")].map(n => n.textContent), imageBox: box(node.querySelector("img")), contentBox: box(node.querySelector(".art-content")) })),
			svgs: all("svg").map(node => ({ ...box(node), viewBox: node.getAttribute("viewBox"), role: node.getAttribute("role"), labelled: !!document.getElementById(node.getAttribute("aria-labelledby")) })),
			circles: all("svg circle").length,
			paths: all("svg path").length,
			lines: all("svg line").length,
			constellation: all("#constellation circle").map(node => ["cx", "cy", "r"].map(k => Number(node.getAttribute(k)))),
			shield: all("#shield circle").map(node => node.getAttribute("fill"))
		};
	});
	assert.ok(state.noHorizontalOverflow);
	assert.equal(state.headings.filter((_, i) => i === 0).length, 1);
	if (kind === "edited") {
		assert.ok(state.savedHeading);
		assert.equal(state.borderTop, "rgb(124, 58, 237)");
	}
	if (unfinished && !art) {
		assert.equal(state.tiles.length + state.numbered.length + state.team.length + state.employees.length + state.works.length, 0);
		return state;
	}
	const columns = rows => new Set(rows.map(row => Math.round(row.x))).size;
	if (resource.project === "chessboard") {
		assert.equal(state.tiles.length, 64);
		assert.ok(Math.abs(state.board.width - state.board.height) < 1);
		assert.equal(columns(state.tiles), 8);
		assert.equal(new Set(state.tiles.map(row => Math.round(row.y))).size, 8);
		for (const [index, tile] of state.tiles.entries()) {
			assert.equal(tile.dark, (Math.floor(index / 8) + index % 8) % 2 === 1);
			assert.ok(Math.abs(tile.width - tile.height) < 1);
		}
	}
	else if (resource.project === "component-library-grids") {
		assert.deepEqual(state.numbered.map(row => row.text), Array.from({ length: 12 }, (_, i) => String(i + 1)));
		assert.equal(state.info.length, 6);
		assert.equal(columns(state.numbered), state.width >= 993 ? 12 : state.width >= 601 ? 6 : 3);
		assert.equal(columns(state.info), state.width >= 993 ? 3 : state.width >= 601 ? 2 : 1);
		assert.ok(state.fontLoaded);
		assert.deepEqual(state.icons.map(row => row.name), ["favorite_border", "code", "language", "functions", "http", "share"]);
		assert.ok(state.icons.every(row => row.hiddenFromAT === "true"));
	}
	else if (resource.project === "pokemon-team") {
		assert.deepEqual(state.team.map(row => row.name), ["Butterfree", "Tyranitar", "Flygon", "Lanturn", "Roserade", "Machamp"]);
		assert.equal(columns(state.team), state.width >= 993 ? 3 : state.width >= 601 ? 2 : 1);
		assert.equal(state.images.length, 6);
		assert.ok(state.images.every(row => row.loaded && row.alt));
		assert.ok(state.team.every(row => row.nickname && row.stats.length === 6 && row.moves.length === 4 && row.captions.includes("Moves")));
		assert.equal(state.statsLabels.length, 36);
		assert.deepEqual(state.team[0].stats, ["324", "170", "179", "251", "233", "215"]);
		assert.deepEqual(state.team[5].moves, ["Dynamicpunch", "Stone Edge", "Knock Off", "Earthquake"]);
	}
	else if (resource.project === "fake-tech") {
		assert.deepEqual(state.employees.map(row => row.name), ["Mark", "Molly", "Stefan", "Sara", "Janet"]);
		assert.equal(state.images.length, 5);
		assert.deepEqual(state.employees.map(row => row.bio), ["Mark is the CEO of FakeTech.io, he is originally from the East Coast and moved to San Francisco for college. He loves to fish and golf!", "Molly is the CTO of FakeTech.io, and she loves to code in Python and JavaScript! In her free time, she loves to play hockey and play video games!", "Stefan is the CFO of FakeTech.io, and he has known Molly since High School. He loves to dine at nice restaurants and going skiing!", "Sara is the VP of Sales of our FakeTech.io, and she is always looking for a big sale! She loves to go to concerts and run marathons!", "Janet is the VP of Marketing of FakeTech.io, and she has a pet dog named Sparky. She loves her dog and picnics!"]);
		assert.ok(state.employees.every(row => row.radius === "50%"));
	}
	else if (resource.project === "art-gallery") {
		assert.equal(state.works.length, 12);
		assert.equal(state.images.length, 12);
		assert.ok(state.images.every(row => row.loaded && row.alt));
		assert.equal(columns(state.works), state.width >= 993 ? 4 : state.width >= 601 ? 3 : 1);
		assert.ok(state.works.every(row => row.paragraphs.length === 2 && row.paragraphs.every(Boolean)));
		assert.equal(state.works[1].href, "https://en.wikipedia.org/wiki/The_Starry_Night");
		assert.equal(state.works[6].href, "https://en.wikipedia.org/wiki/Girl_with_a_Pearl_Earring");
		assert.equal(state.works[8].href, "https://en.wikipedia.org/wiki/Mark_Rothko");
		assert.equal(state.works[7].title, "Campbell's Soup Cans");
		for (const row of state.works) {
			if (row.width >= 256) assert.ok(row.imageBox.x < row.contentBox.x);
			else assert.ok(row.imageBox.y < row.contentBox.y);
		}
		await page.keyboard.press("Tab");
		const focus = await page.evaluate(() => ({ tag: document.activeElement.tagName, outline: getComputedStyle(document.activeElement).outlineStyle }));
		assert.equal(focus.tag, "A");
		assert.equal(focus.outline, "solid");
		state.keyboardFocus = focus;
	}
	else {
		assert.equal(state.svgs.length, unfinished ? 4 : 5);
		assert.equal(state.paths, 11);
		assert.equal(state.circles, unfinished ? 10 : 16);
		assert.equal(state.lines, 2);
		assert.ok(state.svgs.every(row => row.viewBox && row.role === "img" && row.labelled));
		assert.equal(state.shield[0], kind === "edited" ? "purple" : "red");
		if (!unfinished) assert.deepEqual(state.constellation, [[45, 190, 7], [105, 70, 7], [180, 130, 7], [245, 45, 7], [300, 150, 7], [355, 85, 7]]);
	}
	return state;
}
