import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const fixture = JSON.parse(readFileSync(new URL("./fixtures/javascript-basic-layout-sources.json", import.meta.url), "utf8"));

export function editedBasicLayoutSource(resource, filename) {
	const reference = fixture.resources.find(row => row.project === resource.project && row.role === "reference");
	const source = readFileSync(new URL(`../front-end/public/course-assets/javascript-level-1/${reference.files.find(file => file.name === filename).path}`, import.meta.url), "utf8");
	if (filename === "script.js") return source.replace(".attr(\"fill\", \"red\")", ".attr(\"fill\", \"purple\")");
	return filename === "index.html"
		? source.replace("<title>", "<title>Saved ").replace("<h1", "<h1 data-saved-edit=\"true\"")
		: `${source}\nbody { border-top: 6px solid #7c3aed; }\n`;
}

export async function inspectBasicLayout(page, resource, kind) {
	await page.evaluate(() => document.fonts.ready);
	const art = resource.project === "my-javascript-art-part-2";
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
			rootFontSize: Number.parseFloat(getComputedStyle(document.documentElement).fontSize),
			noHorizontalOverflow: document.documentElement.scrollWidth <= innerWidth,
			headings: all("h1,h2").map(node => node.textContent.trim()),
			savedHeading: !!document.querySelector("h1[data-saved-edit]"),
			borderTop: getComputedStyle(document.body).borderTopColor,
			cards: all(".card-panel").map(node => ({ ...box(node), text: node.textContent.trim() })),
			sections: all(".section").map(node => ({ ...box(node), text: node.textContent.trim(), container: node.parentElement.classList.contains("container") })),
			rows: all("tbody tr").map(node => node.textContent.replace(/\s+/g, " ").trim()),
			caption: document.querySelector("caption")?.textContent,
			columnHeaders: all("thead th[scope=\"col\"]").length,
			rowHeaders: all("tbody th[scope=\"row\"]").length,
			playerLinks: all("tbody th a").map(node => ({ href: node.href, text: node.textContent.trim() })),
			visibleIcons: all(".material-icons").filter(node => node.getClientRects().length).map(node => ({ text: node.textContent.trim(), fontSize: Number.parseFloat(getComputedStyle(node).fontSize), fontFamily: getComputedStyle(node).fontFamily, hiddenFromAT: node.getAttribute("aria-hidden"), accessibleName: node.nextElementSibling?.textContent.trim() })),
			visibleLists: all("[role=\"list\"]").filter(node => node.getClientRects().length).length,
			iconFontLoaded: [...document.fonts].some(font => font.family.includes("Material Icons") && font.status === "loaded"),
			svgs: all("svg").map(node => ({ ...box(node), viewBox: node.getAttribute("viewBox"), role: node.getAttribute("role"), labelled: !!document.getElementById(node.getAttribute("aria-labelledby")) })),
			paths: all("svg path").length,
			circles: all("svg circle").length,
			lines: all("svg line").length,
			circleFills: all("#shield circle").map(node => node.getAttribute("fill")),
			snowman: all("#snowman circle").map(node => ["cx", "cy", "r"].map(name => Number(node.getAttribute(name))))
		};
	});
	assert.ok(state.noHorizontalOverflow);
	if (unfinished && !art) {
		assert.equal(state.headings.length + state.rows.length + state.visibleIcons.length, 0);
		return state;
	}
	if (kind === "edited") {
		assert.ok(state.savedHeading);
		assert.equal(state.borderTop, "rgb(124, 58, 237)");
	}
	if (resource.project === "rainbow-sections") {
		const colors = ["Red", "Orange", "Yellow", "Green", "Blue", "Indigo", "Purple"];
		assert.deepEqual(state.cards.map(node => node.text), colors);
		assert.equal(state.sections.length, 14);
		assert.deepEqual(state.sections.map(node => node.text), [...colors, ...colors]);
		assert.ok(state.cards.every(node => node.width < state.width));
		assert.ok(state.sections.slice(0, 7).every(node => node.container && node.width < state.width));
		assert.ok(state.sections.slice(7).every(node => !node.container && Math.abs(node.width - state.width) < 1));
	}
	else if (resource.project === "reverse-the-rainbow") {
		const names = ["face", "bug_report", "fingerprint", "autorenew", "build", "card_travel", "event_seat"];
		const large = state.width >= 993;
		assert.equal(state.visibleLists, 1);
		assert.ok(state.iconFontLoaded);
		assert.deepEqual(state.visibleIcons.map(node => node.text), large ? names : names.toReversed());
		assert.ok(state.visibleIcons.every(node => node.fontSize === state.rootFontSize * (large ? 6 : 2) && node.fontFamily.includes("Material Icons") && node.hiddenFromAT === "true" && node.accessibleName));
	}
	else if (art) {
		assert.equal(state.svgs.length, unfinished ? 3 : 4);
		assert.equal(state.paths, unfinished ? 10 : 11);
		assert.equal(state.circles, unfinished ? 4 : 10);
		assert.equal(state.lines, unfinished ? 0 : 2);
		assert.ok(state.svgs.every(node => node.viewBox && node.role === "img" && node.labelled));
		assert.equal(state.circleFills[0], kind === "edited" ? "purple" : "red");
		if (!unfinished) assert.deepEqual(state.snowman, [[150, 50, 50], [125, 35, 5], [175, 35, 5], [150, 50, 5], [150, 160, 70], [150, 300, 100]]);
	}
	else {
		assert.equal(state.rows.length, 10);
		assert.equal(state.caption, "2019 NFL First Team All-Pro Offense");
		assert.equal(state.columnHeaders, 3);
		assert.equal(state.rowHeaders, 10);
		assert.ok(state.rows.includes("Zack Martin Dallas Cowboys Right Guard"));
		if (resource.project === "table-documentation-dive") {
			assert.equal(state.playerLinks.length, 10);
			assert.ok(state.playerLinks.every(link => link.href.startsWith("https://en.wikipedia.org/wiki/")));
			await page.hover("tbody tr:nth-child(2)");
			await page.waitForFunction(() => {
				const row = document.querySelector("tbody tr:nth-child(2)");
				return row.matches(":hover") && getComputedStyle(row).backgroundColor !== "rgba(0, 0, 0, 0)";
			}, { timeout: 3000 });
			assert.notEqual(await page.$eval("tbody tr:nth-child(2)", node => getComputedStyle(node).backgroundColor), "rgba(0, 0, 0, 0)");
			await page.mouse.move(0, 0);
			await page.keyboard.press("Tab");
			await page.waitForFunction(() => {
				const row = document.activeElement.closest("tr");
				return row && getComputedStyle(row).backgroundColor === "rgb(213, 231, 245)";
			}, { timeout: 3000 });
			const focus = await page.evaluate(() => ({ link: document.activeElement.textContent.trim(), row: getComputedStyle(document.activeElement.closest("tr")).backgroundColor, outline: getComputedStyle(document.activeElement).outlineStyle }));
			assert.equal(focus.link, "Lamar Jackson");
			assert.equal(focus.row, "rgb(213, 231, 245)");
			assert.equal(focus.outline, "solid");
			state.keyboardFocus = focus;
		}
		else {
			assert.equal(state.playerLinks.length, 0);
		}
	}
	return state;
}
