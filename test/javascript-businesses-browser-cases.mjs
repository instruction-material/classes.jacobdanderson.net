import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
const fixture = JSON.parse(
	readFileSync(
		new URL(
			"./fixtures/javascript-businesses-sources.json",
			import.meta.url
		),
		"utf8"
	)
);
const marker = "// Please don't alter the code below this line!";
export function editedBusinessesSource(resource, filename) {
	if (filename === "index.html")
		return fixture.files[resource.role][filename]
			.replace("<body>", '<body data-businesses-edited="true">')
			.replace(
				"<h1>My Favorite Businesses</h1>",
				"<h1>Four-business directory</h1>"
			);
	if (filename === "styles.css")
		return (
			fixture.files[resource.role][filename] +
			"\n.business-summary { font-style: italic; }\n"
		);
	if (filename === "script.js") {
		const completed = fixture.files.reference[filename].replace(
			"businesses.forEach",
			"businesses.push(" +
				JSON.stringify(fixture.editedBusiness) +
				");\nbusinesses.forEach"
		);
		if (resource.role === "reference")
			return completed + "\n// Saved business directory attempt.\n";
		const prefix = fixture.files.starter[filename].split(marker)[0];
		const main = completed
			.split("// Solution: fictional exercise data.\n\n")[1]
			.split(marker)[0];
		return (
			prefix +
			main +
			marker +
			"\n\n" +
			fixture.files.starter[filename].split(marker + "\n\n")[1] +
			"\n// Saved business directory attempt.\n"
		);
	}
	return undefined;
}
const describe = rows =>
	rows.flatMap(b => [
		b.name +
			" is headquartered in " +
			b.location +
			" and their CEO is " +
			b.CEO +
			".",
		b.name + " offers: " + b.products.join(", ") + "."
	]);
export async function inspectBusinesses(page, resource, kind, url) {
	const errors = [],
		dialog = async d => {
			errors.push("Unexpected dialog: " + d.type());
			await d.dismiss();
		};
	page.on("dialog", dialog);
	try {
		if (resource.role === "starter" && kind === "exact") {
			await page.goto(url, { waitUntil: "load" });
			assert.equal(
				await page.$$eval(".business-summary", nodes => nodes.length),
				0
			);
			assert.deepEqual(errors, []);
			return { blankStarterRetained: true, cases: [] };
		}
		const expected = describe(
				kind === "edited"
					? [...fixture.data, fixture.editedBusiness]
					: fixture.data
			),
			cases = [];
		for (const reduced of [false, true]) {
			await page.emulateMediaFeatures([
				{
					name: "prefers-reduced-motion",
					value: reduced ? "reduce" : "no-preference"
				}
			]);
			await page.goto(url, { waitUntil: "load" });
			await page.waitForFunction(
				count => {
					const rows = [
						...document.querySelectorAll(".business-summary")
					];
					return (
						rows.length === count &&
						rows.every(
							e => Number(getComputedStyle(e).opacity) >= 0.99
						)
					);
				},
				{},
				expected.length
			);
			const state = await page.evaluate(() => {
				const rows = [
					...document.querySelectorAll(".business-summary")
				];
				return {
					paragraphs: rows.map(e => e.textContent),
					rows: rows.map(e => {
						const s = getComputedStyle(e),
							r = e.getBoundingClientRect();
						return {
							color: s.color,
							fontStyle: s.fontStyle,
							left: r.left,
							right: r.right,
							children: e.children.length,
							transform: s.transform
						};
					}),
					heading: document.querySelector("h1").textContent,
					edited: document.body.dataset.businessesEdited === "true",
					scrollWidth: document.documentElement.scrollWidth,
					viewport: innerWidth,
					externalScripts: [...document.scripts].some(s =>
						s.src.startsWith("http")
					),
					literalElements: document.querySelectorAll(
						"#business-summaries b,#business-summaries em,#business-summaries script"
					).length
				};
			});
			assert.deepEqual(errors, []);
			assert.deepEqual(state.paragraphs, expected);
			assert.equal(state.edited, kind === "edited");
			assert.equal(
				state.heading,
				kind === "edited"
					? "Four-business directory"
					: "My Favorite Businesses"
			);
			assert.equal(state.literalElements, 0);
			assert.equal(state.externalScripts, false);
			assert.ok(state.scrollWidth <= state.viewport + 1);
			const contrasts = [];
			for (const row of state.rows) {
				assert.ok(row.left >= -1 && row.right <= state.viewport + 1);
				assert.equal(row.children, 0);
				if (kind === "edited") assert.equal(row.fontStyle, "italic");
				const rgb = row.color
					.match(/[\d.]+/g)
					.slice(0, 3)
					.map(Number)
					.map(v => v / 255)
					.map(v =>
						v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4
					);
				const contrast =
					1.05 /
					(0.2126 * rgb[0] +
						0.7152 * rgb[1] +
						0.0722 * rgb[2] +
						0.05);
				assert.ok(contrast >= 4.5);
				contrasts.push(contrast);
				if (reduced)
					assert.ok(
						row.transform === "none" ||
							row.transform === "matrix(1, 0, 0, 1, 0, 0)"
					);
			}
			cases.push({
				reducedMotion: reduced,
				paragraphs: state.paragraphs,
				paragraphCount: state.rows.length,
				contrasts,
				literalTextVerified: true
			});
		}
		return {
			cases,
			allBusinessFieldsAndProductsVerified: true,
			literalTextVerified: true,
			editedOutputVerified: kind === "edited"
		};
	} finally {
		page.off("dialog", dialog);
	}
}
