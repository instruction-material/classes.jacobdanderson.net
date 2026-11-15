/* global businesses, renderBusiness */
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const fixture = JSON.parse(
	readFileSync(
		new URL(
			"./fixtures/javascript-business-directory-sources.json",
			import.meta.url
		),
		"utf8"
	)
);

export function editedBusinessDirectorySource(resource, filename) {
	if (filename === "index.html") {
		return fixture.files[resource.role][filename]
			.replace("<body>", "<body data-directory-edited=\"true\">")
			.replace(
				"<h1>My Favorite Businesses II</h1>",
				"<h1>Four-business directory</h1>"
			);
	}
	if (filename === "styles.css")
		return `${fixture.files[resource.role][filename]}\n.card { border-left: 4px solid #235b45; }\n`;
	if (filename === "script.js")
		return `${fixture.files.reference[filename].replace("// Shared interface setup.", `businesses.push(${JSON.stringify(fixture.editedBusiness)});\n// Shared interface setup.`)}\n// Saved directory attempt.\n`;
	return undefined;
}

export async function inspectBusinessDirectory(page, resource, kind, url) {
	await page.goto(url, { waitUntil: "load" });
	assert.equal(await page.$eval("#business-card", e => e.hidden), true);
	if (resource.role === "starter" && kind === "exact") {
		assert.equal(await page.evaluate(() => businesses.length), 0);
		return { unfinishedStarterRetained: true, cases: [] };
	}
	const expected
		= kind === "edited"
			? [...fixture.data, fixture.editedBusiness]
			: fixture.data;
	const cases = [];
	const submit = async (value) => {
		await page.$eval(
			"#business-input",
			(e, v) => {
				e.value = v;
			},
			value
		);
		await page.click("button[type=\"submit\"]");
	};
	const inspect = async (b) => {
		const actual = await page.evaluate(() => ({
			hidden: document.querySelector("#business-card").hidden,
			status: document.querySelector("#search-status").textContent,
			title: document.querySelector("#business-title").textContent,
			location: document.querySelector("#business-location").textContent,
			CEO: document.querySelector("#business-ceo").textContent,
			products: document.querySelector("#business-products").textContent,
			titleElements:
				document.querySelector("#business-title").children.length,
			imageCount: document.querySelectorAll("#business-image img").length
		}));
		assert.deepEqual(actual, {
			hidden: false,
			status: "",
			title: b.name,
			location: `Located in: ${b.location}`,
			CEO: `CEO: ${b.CEO}`,
			products: `Products offered: ${b.products.join(", ")}`,
			titleElements: 0,
			imageCount: 1
		});
		await page.waitForFunction(() => {
			const image = document.querySelector("#business-image img");
			return image.complete && image.naturalWidth > 0;
		});
		return actual;
	};
	for (const business of expected) {
		await submit(business.name);
		cases.push({ name: business.name, card: await inspect(business) });
	}
	await submit(`  ${expected[0].name}  `);
	await inspect(expected[0]);
	cases.push({ surroundingSpacesAccepted: true });
	for (const input of [
		"No Such Business",
		"",
		"   ",
		expected[0].name.toLowerCase()
	]) {
		await submit(input);
		assert.equal(await page.$eval("#business-card", e => e.hidden), true);
		assert.equal(
			await page.$eval("#search-status", e => e.textContent),
			"No business found."
		);
		cases.push({ input, noMatch: true });
	}
	await submit(expected[1].name);
	await inspect(expected[1]);
	await page.$eval("#business-input", (e) => {
		e.value = "";
	});
	await page.focus("#business-input");
	await page.type("#business-input", "Cedar", { delay: 30 });
	await page.waitForSelector(".autocomplete-content li", { visible: true });
	const options = await page.$$eval(".autocomplete-content li", rows =>
		rows.map(e => e.textContent));
	assert.ok(options.some(name => name.includes(expected[0].name)));
	await page.click(".autocomplete-content li");
	await inspect(expected[0]);
	cases.push({ autocompleteChosen: expected[0].name, options });
	await page.evaluate(() => {
		businesses[0].display_image = "images/missing.svg";
		renderBusiness(businesses[0].name);
	});
	await page.waitForFunction(() => {
		const fallback = document.querySelector(".image-fallback");
		return (
			fallback
			&& !fallback.hidden
			&& document.querySelector("#business-image img").hidden
		);
	});
	assert.equal(
		await page.$eval(".image-fallback", e => e.textContent),
		`Image unavailable for ${expected[0].name}.`
	);
	assert.equal(
		await page.$eval("#business-title", e => e.textContent),
		expected[0].name
	);
	cases.push({ failedImageFallback: true });
	await page.evaluate(() => {
		businesses[0].location = "<b>literal location</b>";
		businesses[0].products = [
			"<em>literal product</em>",
			"Second",
			"Third"
		];
		renderBusiness(businesses[0].name);
	});
	assert.equal(
		await page.$eval("#business-location", e => e.textContent),
		"Located in: <b>literal location</b>"
	);
	assert.equal(
		await page.$eval("#business-location", e => e.children.length),
		0
	);
	assert.equal(
		await page.$eval("#business-products", e => e.children.length),
		0
	);
	assert.equal(
		await page.$eval("#business-products", e => e.textContent),
		"Products offered: <em>literal product</em>, Second, Third"
	);
	cases.push({ literalDataRenderedAsText: true });
	await page.evaluate((original) => {
		Object.assign(businesses[0], original);
		renderBusiness(original.name);
	}, expected[0]);
	await inspect(expected[0]);
	assert.equal(
		await page.$eval("#business-image", e => e.children.length),
		2
	);
	assert.equal(
		await page.$eval(
			"#business-input",
			e => !!document.querySelector(`label[for="${e.id}"]`)
		),
		true
	);
	await page.waitForFunction(() =>
		[...document.querySelectorAll(".autocomplete-content")].every(
			element => getComputedStyle(element).display === "none"
		)
	);
	return {
		cases,
		completeLocalImagesAndLibraries: true,
		allBusinessesChecked: expected.length,
		savedVisualEdit: kind === "edited"
	};
}
