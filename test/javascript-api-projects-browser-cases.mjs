/* global pokemonFixtures */
import assert from "node:assert/strict";
import { Buffer } from "node:buffer";
import { readFileSync } from "node:fs";
import { createContext, runInContext } from "node:vm";

const fixture = JSON.parse(readFileSync(new URL("./fixtures/javascript-api-projects-sources.json", import.meta.url), "utf8"));

export function editedApiProjectSource(resource, filename) {
	const source = fixture.files[resource.project][resource.role][filename];
	if (filename === "index.html") return source.replace(`<h1>${resource.title}</h1>`, `<h1>Saved ${resource.title}</h1>`);
	if (filename === "styles.css") return `${source}\n#output { outline: 3px solid #334155; }\n`;
	if (filename === "script.js") return `${fixture.files[resource.project].reference[filename]}\n// Saved completed project and response observations.\n`;
}

const datasets = new Map();
function supplied(name) {
	if (!datasets.has(name)) {
		const files = fixture.files[name].reference;
		const source = files["fixtures.js"] + (name === "pokedex" ? [1, 2, 3, 4].map(i => files[`pokemon-${i}.js`]).join("\n") : "");
		const variable = name === "pokedex" ? "pokemonFixtures" : name === "fox-generator" ? "foxFixtures" : "jokeFixtures";
		// Only the immutable, repository-owned data literals are evaluated here.
		const scope = createContext();
		runInContext(source, scope);
		datasets.set(name, runInContext(variable, scope));
	}
	return datasets.get(name);
}

export function apiTrafficState() {
	return { mode: "success", calls: [], responseErrors: [], delayedResponses: [], imageFailure: false };
}

export async function fulfillApiProjectRequest(request, resource, traffic) {
	const url = new URL(request.url());
	const project = resource.project;
	const api = project === "pokedex"
		? url.origin === "https://pokeapi.co" && /^\/api\/v2\/pokemon\/[a-z0-9-]+$/.test(url.pathname)
		: project === "fox-generator"
			? url.href === "https://randomfox.ca/floof/"
			: url.href === `https://official-joke-api.appspot.com/jokes/programming/${project === "funny-meter" ? "ten" : "random"}`;
	const sprite = project === "pokedex" && url.origin === "https://raw.githubusercontent.com" && /^\/PokeAPI\/sprites\/master\/sprites\/pokemon\/\d+\.png$/.test(url.pathname);
	const foxImage = project === "fox-generator" && url.origin === "https://randomfox.ca" && /^\/images\/[12]\.jpg$/.test(url.pathname) && !url.search && !url.hash;
	if (!api && !sprite && !foxImage) return false;
	assert.equal(request.method(), "GET");
	traffic.calls.push({ url: request.url(), method: request.method(), kind: api ? "json" : "image", mode: traffic.mode });
	const entries = supplied(project);
	if (sprite || foxImage) {
		if (traffic.imageFailure) {
			await request.respond({ status: 404, body: "missing image" });
			return true;
		}
		const entry = sprite ? entries.find(p => p.id === Number(url.pathname.split("/").at(-1).split(".")[0])) : entries[0];
		assert.ok(entry);
		const source = sprite ? entry.sprites.front_default : entry.image;
		await request.respond({ status: 200, contentType: sprite ? "image/png" : "image/jpeg", body: Buffer.from(source.split(",")[1], "base64") });
		return true;
	}
	let body;
	if (project === "pokedex") {
		const entry = entries.find(p => p.name === url.pathname.split("/").at(-1));
		assert.ok(entry);
		body = { ...entry, sprites: { front_default: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${entry.id}.png` } };
	}
	else if (project === "fox-generator") {
		body = { image: traffic.imageFailure ? "https://randomfox.ca/images/2.jpg" : "https://randomfox.ca/images/1.jpg", link: "https://randomfox.ca/" };
	}
	else {
		body = project === "funny-meter" ? entries : [entries[1]];
	}
	if (traffic.mode === "wrong-shape") body = { unexpected: true };
	if (traffic.mode === "foreign-image") {
		body = project === "pokedex" ? { ...body, sprites: { front_default: "https://example.invalid/wrong.png" } } : { image: "https://example.invalid/fox.jpg" };
	}
	const options = { status: traffic.mode === "http-error" ? 503 : 200, contentType: "application/json", headers: { "Access-Control-Allow-Origin": "*" }, body: traffic.mode === "empty" ? "" : traffic.mode === "invalid-json" ? "{" : JSON.stringify(body) };
	if (["slow", "late"].includes(traffic.mode)) {
		const delay = traffic.mode === "slow" ? 4600 : 350;
		const pending = new Promise(resolve => setTimeout(resolve, delay)).then(() => request.respond(options)).catch(error => traffic.responseErrors.push(String(error)));
		traffic.delayedResponses.push(pending);
	}
	else {
		await request.respond(options);
	}
	return true;
}

async function settled(page) {
	await page.waitForFunction(() => !document.querySelector("#load").disabled && document.querySelector("#status").dataset.state !== "loading");
}
async function load(page) {
	await page.click("#load");
	await settled(page);
}
async function resultText(page) {
	return page.$eval("#output", e => e.textContent);
}

export async function inspectApiProject(page, resource, kind, url, width, traffic) {
	const project = resource.project;
	const complete = resource.role === "reference" || kind === "edited";
	await page.goto(url, { waitUntil: "load" });
	await settled(page);
	if (!complete) {
		assert.match(await page.$eval("#status", e => e.textContent), /Complete /);
		assert.equal(await page.$eval("#output", e => e.children.length), 0);
		assert.equal(traffic.calls.length, 0);
		return { complete, scaffoldErrorExplainsRequiredFunctions: true, noNetworkRequired: true };
	}
	let localCases;
	if (project === "programming-jokes") {
		const entries = supplied(project);
		assert.equal(await page.$eval("#setup", e => e.textContent), entries[0].setup);
		await load(page);
		assert.equal(await page.$eval("#setup", e => e.textContent), entries[1].setup);
		assert.equal(await page.$eval("#punchline", e => e.textContent), entries[1].punchline);
		localCases = { pairedSourceJokes: true, nextSavedResponse: true };
	}
	else if (project === "fox-generator") {
		assert.equal(await page.$$eval("#output figure", rows => rows.length), 1);
		for (let i = 1; i < 13; i++) await load(page);
		assert.equal(await page.$$eval("#output figure", rows => rows.length), 12);
		assert.ok(await page.$$eval("#output img", images => images.every(img => img.complete && img.naturalWidth > 0 && img.alt.length > 0)));
		assert.ok(await page.$$eval("#output figcaption a", links => links.every(link => link.href.startsWith("https://www.fws.gov/media/") && link.textContent.length > 0)));
		localCases = { actualPhotosDecoded: 3, boundedGalleryAfter13Loads: 12, altAndSourceCredits: true };
	}
	else if (project === "pokedex") {
		assert.equal(await page.$$eval("#pokemon-names option", rows => rows.length), 893);
		for (const query of ["pikachu", "25", "893", "bulbasaur"]) {
			await page.$eval("#query", (e, value) => {
				e.value = value;
			}, query);
			await load(page);
			const expected = supplied(project).find(p => p.name === query || String(p.id) === query);
			assert.equal(await page.$eval("#output h2", e => e.textContent), expected.name);
			assert.equal(await page.$$eval("#output dt", rows => rows.length), 6);
			assert.ok(await page.$eval("#output img", image => image.complete && image.naturalWidth === 96));
		}
		const before = await resultText(page);
		await page.$eval("#query", (e) => {
			e.value = "<img src=x onerror=alert(1)>";
		});
		await load(page);
		assert.equal(await resultText(page), before);
		await page.$eval("#query", (e) => {
			e.value = "pikachu";
		});
		let decoded = 0;
		if (resource.role === "reference" && kind === "exact" && width === 1280) {
			decoded = await page.evaluate(async () => {
				let total = 0;
				for (const record of pokemonFixtures) {
					const image = new Image();
					image.src = record.sprites.front_default;
					await image.decode();
					if (image.naturalWidth !== 96 || image.naturalHeight !== 96) throw new Error("Unexpected supplied sprite size");
					total++;
				}
				return total;
			});
			assert.equal(decoded, 893);
		}
		localCases = { indexedNames: 893, actualNameAndIdLookups: 4, replacedResultWithSixStats: true, rejectedMarkupInput: true, allSpritesDecodedInThisProfile: decoded };
	}
	else {
		for (const choice of ["yes", "no", "tie"]) {
			await page.click("#restart");
			for (let i = 0; i < 10; i++) await page.click(choice === "tie" ? i < 5 ? "#yes" : "#no" : `#${choice}`);
			assert.equal(await page.$eval("#result", e => e.textContent), choice === "yes" ? "You liked more jokes." : choice === "no" ? "You disliked more jokes." : "An even split.");
			assert.ok(await page.$eval("#yes", e => e.disabled));
		}
		await page.click("#restart");
		await page.click("#yes", { clickCount: 2 });
		assert.equal(await page.$eval("#progress", e => e.textContent), "Joke 2 of 10");
		await load(page);
		assert.equal(await page.$eval("#progress", e => e.textContent), "Joke 2 of 10");
		await page.click("#restart");
		localCases = { completeSessions: ["all-liked", "all-disliked", "even-split"], doubleClickRecordedOnce: true, partialSessionPreserved: true, restarted: true };
	}
	assert.equal(traffic.calls.length, 0, "Saved responses make no API requests");
	await page.select("#source", "live");
	traffic.mode = "success";
	await load(page);
	assert.ok(traffic.calls.some(c => c.kind === "json"));
	if (project === "pokedex") {
		const count = traffic.calls.filter(c => c.kind === "json").length;
		await load(page);
		assert.equal(traffic.calls.filter(c => c.kind === "json").length, count);
		await page.$eval("#query", (e) => {
			e.value = "ivysaur";
		});
	}
	const valid = await resultText(page);
	for (const mode of ["http-error", "invalid-json", "wrong-shape", "empty", "slow"]) {
		traffic.mode = mode;
		await load(page);
		assert.equal(await resultText(page), valid, `${project}: ${mode}`);
		assert.equal(await page.$eval("#status", e => e.dataset.state), "stale");
	}
	if (["fox-generator", "pokedex"].includes(project)) {
		traffic.mode = "foreign-image";
		await load(page);
		assert.equal(await resultText(page), valid);
		assert.match(await page.$eval("#status", e => e.textContent), /image URL/);
		traffic.mode = "success";
		traffic.imageFailure = true;
		await load(page);
		assert.equal(await resultText(page), valid);
		assert.match(await page.$eval("#status", e => e.textContent), /Image could not/);
		traffic.imageFailure = false;
		if (project === "pokedex") {
			await page.$eval("#query", (e) => {
				e.value = "venusaur";
			});
		}
	}
	traffic.mode = "late";
	await page.click("#load");
	await page.waitForSelector("#cancel:not([hidden])");
	assert.ok(await page.$eval("#load", e => e.disabled));
	await page.click("#cancel");
	await settled(page);
	assert.match(await page.$eval("#status", e => e.textContent), /canceled/);
	await page.select("#source", "saved");
	await load(page);
	const afterCancel = await resultText(page);
	await Promise.all(traffic.delayedResponses);
	assert.equal(await resultText(page), afterCancel, "Canceled late response cannot replace saved data");
	assert.equal(await page.$$eval("script[data-injected]", rows => rows.length), 0);
	assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
	if (kind === "edited") {
		assert.equal(await page.$eval("h1", e => e.textContent), `Saved ${resource.title}`);
		assert.equal(await page.$eval("#output", e => getComputedStyle(e).outlineWidth), "3px");
	}
	return { complete, localCases, mockedLiveServiceCases: ["success", "http-error", "invalid-json", "wrong-shape", "empty", "timeout", "cancel", "late-response"], actualExternalServiceAcceptanceClaimed: false, allServiceTrafficLocallyFulfilled: true, cacheRepeatChecked: project === "pokedex", boundedGetRequests: traffic.calls };
}
