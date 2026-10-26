import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const fixture = JSON.parse(readFileSync(new URL("./fixtures/javascript-master-project-sources.json", import.meta.url), "utf8"));

export function editedMasterProjectSource(resource, filename) {
	const reference = fixture.resources.find(row => row.project === resource.project && row.role === "reference");
	const source = readFileSync(new URL(`../front-end/public/course-assets/javascript-level-1/${reference.files.find(file => file.name === filename).path}`, import.meta.url), "utf8");
	if (filename === "index.html") return source.replace("<title>", "<title>Saved ").replace("<h1>", "<h1 data-saved-edit=\"true\">Saved ");
	if (filename === "script.js") return `${source}\ndocument.querySelector("h1").style.color = "#7c3aed";\ndocument.querySelector("h1").dataset.savedScript = "true";\n`;
	return `${source}\nbody { border-top: 6px solid #7c3aed; }\n`;
}

export async function inspectMasterProject(page, resource, kind) {
	await page.evaluate(() => document.fonts.ready);
	const unfinished = resource.role === "starter" && kind === "exact";
	const state = await page.evaluate(() => ({
		noHorizontalOverflow: document.documentElement.scrollWidth <= innerWidth,
		headingCount: document.querySelectorAll("h1").length,
		savedHeading: document.querySelector("h1")?.textContent.startsWith("Saved "),
		savedScript: document.querySelector("h1")?.dataset.savedScript === "true",
		headingColor: document.querySelector("h1") ? getComputedStyle(document.querySelector("h1")).color : null,
		borderTop: getComputedStyle(document.body).borderTopColor,
		reduced: matchMedia("(prefers-reduced-motion: reduce)").matches
	}));
	assert.ok(state.noHorizontalOverflow);
	if (unfinished) {
		assert.equal(state.headingCount, 0);
		assert.equal(await page.$eval("main", n => n.textContent.trim()), "");
		assert.equal(await page.$(".sidenav,.modal,.collapsible"), null);
		assert.equal(await page.evaluate(() => window.d3.version), "6.1.1");
		assert.equal(await page.evaluate(() => window.M.version), "1.0.0");
		state.originalBlankExerciseRetained = true;
		return state;
	}
	assert.equal(state.headingCount, 1);
	if (kind === "edited") {
		assert.ok(state.savedHeading && state.savedScript);
		assert.equal(state.headingColor, "rgb(124, 58, 237)");
		assert.equal(state.borderTop, "rgb(124, 58, 237)");
	}
	const instances = await page.evaluate(() => ({
		sidenav: !!window.M.Sidenav.getInstance(document.querySelector(".sidenav")),
		modal: !!window.M.Modal.getInstance(document.querySelector(".modal")),
		collapsible: !!window.M.Collapsible.getInstance(document.querySelector(".collapsible")),
		iconFont: [...document.fonts].some(f => f.family.includes("Material Icons") && f.status === "loaded")
	}));
	assert.ok(Object.values(instances).every(Boolean), JSON.stringify(instances));
	assert.equal(await page.$$eval(".program", nodes => nodes.length), 3);
	for (const id of ["coding", "math", "web"]) {
		await page.focus(`#${id}-header`);
		await page.keyboard.press(id === "math" ? "Space" : "Enter");
		await page.waitForFunction(value => document.getElementById(`${value}-header`).getAttribute("aria-expanded") === "true", {}, id);
		assert.ok(await page.$eval(`#${id}-detail`, n => n.getBoundingClientRect().height > 0));
	}
	assert.equal(await page.$$eval(".collapsible-header[aria-expanded=true]", n => n.length), 1);
	if (await page.evaluate(() => innerWidth < 993)) {
		await page.focus("#menu-trigger");
		await page.keyboard.press("Enter");
		await page.waitForFunction(() => document.querySelector("#menu-trigger").getAttribute("aria-expanded") === "true" && document.querySelector("#nav-mobile").contains(document.activeElement));
		const edge = await page.$eval("#nav-mobile", node => ({ right: node.getBoundingClientRect().right, viewport: innerWidth }));
		assert.ok(Math.abs(edge.right - edge.viewport) < 2, JSON.stringify(edge));
		await page.keyboard.press("Escape");
		await page.waitForFunction(() => document.activeElement.id === "menu-trigger" && document.querySelector("#menu-trigger").getAttribute("aria-expanded") === "false");
		await page.click("#menu-trigger");
		await page.waitForFunction(() => document.querySelector("#nav-mobile").getAttribute("aria-hidden") === "false" && document.querySelector("#nav-mobile").contains(document.activeElement));
		await page.click("#nav-mobile a[href='#about']");
	}
	else {
		await page.click("nav a[href='#about']");
	}
	await page.waitForFunction(() => document.querySelector("#about").classList.contains("open") && document.activeElement.id === "close-about");
	assert.equal(await page.$eval("#about", n => n.getAttribute("aria-hidden")), "false");
	await page.keyboard.press("Tab");
	assert.ok(await page.$eval("#about", n => n.contains(document.activeElement)));
	await page.keyboard.down("Shift");
	try {
		await page.keyboard.press("Tab");
	}
	finally {
		await page.keyboard.up("Shift");
	}
	assert.ok(await page.$eval("#about", n => n.contains(document.activeElement)));
	await page.keyboard.press("Escape");
	await page.waitForFunction(() => !document.querySelector("#about").classList.contains("open") && document.querySelector("#about").getAttribute("aria-hidden") === "true");
	assert.equal(await page.evaluate(() => document.activeElement.id || document.activeElement.getAttribute("href")), await page.evaluate(() => innerWidth < 993 ? "menu-trigger" : "#about"));
	assert.equal(await page.$$eval(".sidenav-overlay", nodes => nodes.length), 1);
	assert.equal(await page.$$eval(".drag-target", nodes => nodes.length), 1);
	assert.equal(await page.$$eval("[id]", nodes => new Set(nodes.map(n => n.id)).size), await page.$$eval("[id]", nodes => nodes.length));
	if (state.reduced) assert.ok(await page.evaluate(() => [window.M.Sidenav.getInstance(document.querySelector(".sidenav")), window.M.Modal.getInstance(document.querySelector(".modal")), window.M.Collapsible.getInstance(document.querySelector(".collapsible"))].every(n => n.options.inDuration === 0 && n.options.outDuration === 0)));
	state.realMaterializeInstances = instances;
	state.accordionKeyboardChecks = 3;
	state.menuAndDialogKeyboardFocus = true;
	return state;
}
