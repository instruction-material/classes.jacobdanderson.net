import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const fixture = JSON.parse(readFileSync(new URL("./fixtures/javascript-dynamic-components-sources.json", import.meta.url), "utf8"));

export function editedDynamicComponentsSource(resource, filename) {
	const reference = fixture.resources.find(row => row.project === resource.project && row.role === "reference");
	const source = readFileSync(new URL(`../front-end/public/course-assets/javascript-level-1/${reference.files.find(file => file.name === filename).path}`, import.meta.url), "utf8");
	if (filename === "script.js") return source.replace(".attr(\"fill\", \"red\")", ".attr(\"fill\", \"purple\")").replace("textContent = slide.dataset.title;", "textContent = \"Saved \" + slide.dataset.title;");
	return filename === "index.html" ? source.replace("<title>", "<title>Saved ").replace("<h1>", "<h1 data-saved-edit=\"true\">Saved ") : `${source}\nbody { border-top: 6px solid #7c3aed; }\n`;
}

async function sidebar(page) {
	await page.focus("#menu-trigger");
	await page.keyboard.press("Enter");
	await page.waitForFunction(() => document.querySelector("#menu-trigger").getAttribute("aria-expanded") === "true");
	const state = await page.$eval("#slide-out", node => ({ right: node.getBoundingClientRect().right, width: innerWidth, focusInside: node.contains(document.activeElement) }));
	assert.ok(Math.abs(state.right - state.width) < 2);
	assert.ok(state.focusInside);
	await page.keyboard.press("Escape");
	await page.waitForFunction(() => document.querySelector("#menu-trigger").getAttribute("aria-expanded") === "false");
	assert.equal(await page.evaluate(() => document.activeElement.id), "menu-trigger");
	return state;
}

export async function inspectDynamicComponents(page, resource, kind) {
	await page.evaluate(() => document.fonts.ready);
	const unfinished = resource.role === "starter" && kind === "exact";
	const state = await page.evaluate(() => ({ noHorizontalOverflow: document.documentElement.scrollWidth <= innerWidth, headingCount: document.querySelectorAll("h1").length, savedHeading: document.querySelector("h1")?.textContent.startsWith("Saved "), borderTop: getComputedStyle(document.body).borderTopColor, ids: [...document.querySelectorAll("[id]")].map(n => n.id), reduced: matchMedia("(prefers-reduced-motion: reduce)").matches }));
	assert.ok(state.noHorizontalOverflow);
	assert.equal(state.headingCount, 1);
	assert.equal(new Set(state.ids).size, state.ids.length);
	if (kind === "edited") {
		assert.ok(state.savedHeading);
		assert.equal(state.borderTop, "rgb(124, 58, 237)");
	}
	if (resource.project === "dynamic-components") {
		if (unfinished) {
			assert.equal(await page.$(".carousel"), null);
			assert.equal(await page.$(".modal"), null);
			state.authoredStarterUnfinished = true;
			return state;
		}
		await page.waitForFunction(() => [...document.querySelectorAll(".carousel-item img")].length === 5 && [...document.querySelectorAll(".carousel-item img")].every(n => n.complete && n.naturalWidth > 0));
		const instances = await page.evaluate(() => ({ sidenav: !!window.M.Sidenav.getInstance(document.querySelector(".sidenav")), modal: !!window.M.Modal.getInstance(document.querySelector(".modal")), carousel: !!window.M.Carousel.getInstance(document.querySelector(".carousel")), iconFont: [...document.fonts].some(f => f.family.includes("Material Icons") && f.status === "loaded") }));
		assert.ok(Object.values(instances).every(Boolean), JSON.stringify(instances));
		const prefix = kind === "edited" ? "Saved " : "";
		const title = async expected => page.waitForFunction(value => document.querySelector("#photo-status").textContent === value, {}, prefix + expected);
		await title("Lower Falls from Artist Point");
		await page.click("#next-photo");
		await title("Grand Prismatic Spring");
		await page.focus("#details-trigger");
		await page.keyboard.press("Enter");
		await page.waitForFunction(() => document.querySelector(".modal").classList.contains("open") && document.activeElement.id === "close-details" && document.querySelector("#modal-image").complete && document.querySelector("#modal-image").naturalWidth > 0);
		assert.equal(await page.$eval("#modal-title", n => n.textContent), "Grand Prismatic Spring");
		assert.ok((await page.$eval("#modal-credit", n => n.textContent)).includes("Al Mebane"));
		await page.keyboard.press("Tab");
		assert.ok(await page.$eval(".modal", n => n.contains(document.activeElement)));
		await page.keyboard.press("Escape");
		await page.waitForFunction(() => !document.querySelector(".modal").classList.contains("open") && document.activeElement.id === "details-trigger");
		await page.focus(".carousel");
		await page.keyboard.press("ArrowRight");
		await title("Riverside Geyser");
		await page.keyboard.press("ArrowLeft");
		await title("Grand Prismatic Spring");
		await page.click("#previous-photo");
		await title("Lower Falls from Artist Point");
		await page.click("#previous-photo");
		await title("Undine Falls");
		await page.click("#next-photo");
		await title("Lower Falls from Artist Point");
		state.sidebar = await sidebar(page);
		await page.click("#menu-trigger");
		await page.waitForFunction(() => document.querySelector("#menu-trigger").getAttribute("aria-expanded") === "true");
		await page.click("#slide-out a[href=\"#credits\"]");
		await page.waitForFunction(() => location.hash === "#credits" && document.querySelector("#menu-trigger").getAttribute("aria-expanded") === "false");
		assert.equal(await page.$$eval("#credits li", nodes => nodes.length), 5);
		await page.evaluate(() => {
			location.hash = "photographs";
		});
		state.carouselNavigationChecks = 6;
		state.realMaterializeInstances = instances;
		state.modalKeyboardAndFocusReturn = true;
	}
	else {
		assert.equal(resource.project, "my-javascript-art-part-4");
		await page.waitForFunction(() => document.querySelectorAll("#rainbow path").length === 7 && [...document.querySelectorAll("#rainbow path")].every(n => getComputedStyle(n).opacity === "1"));
		const art = await page.evaluate(() => ({ svgs: document.querySelectorAll(".drawing svg").length, paths: document.querySelectorAll(".drawing svg path").length, circles: document.querySelectorAll(".drawing svg circle").length, lines: document.querySelectorAll(".drawing svg line").length, ellipses: document.querySelectorAll(".drawing svg ellipse").length, accessible: [...document.querySelectorAll(".drawing svg")].every(n => n.getAttribute("viewBox") && n.getAttribute("role") === "img" && document.getElementById(n.getAttribute("aria-labelledby"))), shieldColor: document.querySelector("#shield circle").getAttribute("fill"), planetRadius: document.querySelector("circle.planet")?.getAttribute("r") }));
		assert.equal(art.svgs, unfinished ? 5 : 6);
		assert.equal(art.paths, unfinished ? 11 : 12);
		assert.equal(art.circles, unfinished ? 16 : 20);
		assert.equal(art.lines, 2);
		assert.equal(art.ellipses, unfinished ? 0 : 1);
		assert.ok(art.accessible);
		assert.equal(art.shieldColor, kind === "edited" ? "purple" : "red");
		state.art = art;
		state.sidebar = await sidebar(page);
		if (unfinished) {
			assert.equal(await page.$(".dropdown-trigger"), null);
			state.authoredStarterUnfinished = true;
			return state;
		}
		assert.equal(art.planetRadius, "70");
		const destinations = await page.$$eval("#artwork-menu a", nodes => nodes.map(n => n.hash));
		assert.deepEqual(destinations, ["#rainbow-section", "#shield-section", "#pacman-section", "#snowman-section", "#constellation-section", "#ringed-planet-section"]);
		await page.focus("#artwork-trigger");
		await page.keyboard.press("Enter");
		await page.waitForFunction(() => window.M.Dropdown.getInstance(document.querySelector("#artwork-trigger")).isOpen);
		await page.keyboard.press("ArrowDown");
		await page.keyboard.press("Escape");
		await page.waitForFunction(() => document.querySelector("#artwork-trigger").getAttribute("aria-expanded") === "false");
		assert.equal(await page.evaluate(() => document.activeElement.id), "artwork-trigger");
		await page.click("#artwork-trigger");
		await page.waitForFunction(() => document.querySelector("#artwork-trigger").getAttribute("aria-expanded") === "true");
		await page.click("#artwork-menu a[href=\"#ringed-planet-section\"]");
		await page.waitForFunction(() => document.querySelector("#artwork-trigger").getAttribute("aria-expanded") === "false");
		await page.waitForFunction(() => window.M.anime.running.length === 0);
		await page.evaluate(() => new Promise((resolve) => {
			let previous = scrollY;
			let stable = 0;
			function observe() {
				stable = scrollY === previous ? stable + 1 : 0;
				previous = scrollY;
				if (stable >= 6) resolve();
				else requestAnimationFrame(observe);
			}
			requestAnimationFrame(observe);
		}));
		for (const destination of ["#rainbow-section", "#pacman-section", "#snowman-section", "#constellation-section"]) {
			await page.$eval(destination, node => node.scrollIntoView());
			await page.waitForFunction(hash => !!document.querySelector(`#artwork-menu a[href="${hash}"].active`), {}, destination);
		}
		assert.equal(await page.$$eval(".scrollspy", nodes => nodes.filter(n => window.M.ScrollSpy.getInstance(n)).length), 6);
		await page.evaluate(() => scrollTo(0, 0));
		state.dropdownKeyboardAndFocusReturn = true;
		state.scrollSpySelectionsChecked = 4;
	}
	return state;
}
