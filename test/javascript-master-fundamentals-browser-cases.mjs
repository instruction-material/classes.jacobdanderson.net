/* global playDoubleOrNothing, printToScreen */
import assert from "node:assert/strict";

import { readFileSync } from "node:fs";

const fixture = JSON.parse(
	readFileSync(
		new URL(
			"./fixtures/javascript-master-fundamentals-sources.json",
			import.meta.url
		),
		"utf8"
	)
);

export function editedFundamentalsSource(resource, filename) {
	const reference = fixture.files[resource.project].reference[filename];

	if (filename === "index.html") {
		return reference.replace(
			`<h1>${resource.title}</h1>`,
			`<h1>Saved ${resource.title}</h1>`
		);
	}

	if (filename === "styles.css") {
		return `${reference}\nmain { outline: 3px solid #334155;
 }\n`;
	}

	if (filename === "script.js")
		return `${reference}\n// Saved completed original-aligned game.\n`;

	return undefined;
}
export async function inspectFundamentals(page, resource, kind, url, width) {
	const complete = resource.role === "reference" || kind === "edited";

	await page.goto(url, { waitUntil: "load" });

	assert.equal(
		await page.$eval("h1", e => e.textContent),
		(kind === "edited" ? "Saved " : "") + resource.title
	);

	if (resource.project === "double-or-nothing") {
		const scenarios = complete
			? [
					{
						name: "stop-before-flip",
						choices: ["N"],
						random: [],
						balance: 1000
					},
					{
						name: "cancel-before-flip",
						choices: [null],
						random: [],
						balance: 1000
					},
					{
						name: "two-heads-then-stop",
						choices: [" y ", "Y", "n"],
						random: [0, 0.499999],
						balance: 4000
					},
					{
						name: "invalid-then-cancel",
						choices: ["invalid", "", null],
						random: [],
						balance: 1000,
						alerts: 2
					},
					{
						name: "tails",
						choices: ["Y"],
						random: [0.5],
						balance: 0
					},
					{
						name: "fresh-round-heads-cancel",
						choices: ["Y", null],
						random: [0],
						balance: 2000
					}
				]
			: [];

		const proofs = [];

		for (const scenario of scenarios) {
			await page.evaluate((values) => {
				window.__randomValues = values;
				Math.random = () => {
					if (!window.__randomValues.length)
						throw new Error("Unexpected random draw");
					return window.__randomValues.shift();
				};
			}, scenario.random);

			let cursor = 0;
			let dialogError;
			const alerts = [];

			const listener = (dialog) => {
				void (async () => {
					if (dialog.type() === "prompt") {
						if (cursor >= scenario.choices.length) {
							dialogError = "Unexpected prompt";
							await dialog.dismiss();
						}
						else {
							const choice = scenario.choices[cursor++];
							if (choice === null) await dialog.dismiss();
							else await dialog.accept(choice);
						}
					}
					else {
						assert.equal(dialog.type(), "alert");
						alerts.push(dialog.message());
						await dialog.accept();
					}
				})().catch((e) => {
					dialogError = String(e);
				});
			};

			page.on("dialog", listener);

			try {
				const previous = await page.$$eval(
					".round-result",
					rows => rows.length
				);

				await page.click("#start");

				await page.waitForFunction(
					count =>
						document.querySelectorAll(".round-result").length
						=== count,
					{},
					previous + 1
				);

				assert.equal(cursor, scenario.choices.length);
				assert.equal(dialogError, undefined);

				assert.equal(alerts.length, scenario.alerts || 0);

				assert.equal(
					await page.$eval(
						".round-result:last-child",
						e => e.textContent
					),
					`You ended Double or Nothing with: $${scenario.balance}.`
				);

				assert.equal(
					await page.evaluate(() => window.__randomValues.length),
					0
				);

				proofs.push({
					name: scenario.name,
					nativePrompts: cursor,
					alerts: alerts.length,
					balance: scenario.balance
				});
			}
			finally {
				page.off("dialog", listener);
			}
		}
		if (!complete) {
			await page.click("#start");

			await page.waitForFunction(() =>
				document
					.querySelector("#status")
					.textContent
					.includes("Complete playDoubleOrNothing")
			);

			assert.equal(await page.$$eval(".round-result", r => r.length), 0);
		}
		else {
			const bounded = await page.evaluate(() =>
				playDoubleOrNothing(
					() => "Y",
					() => 0
				)
			);

			assert.ok(Number.isSafeInteger(bounded) && bounded > 1000);

			const literal = await page.evaluate(() => {
				printToScreen("<img src=x onerror=alert(1)>");
				const p = document.querySelector(".round-result:last-child");
				return {
					text: p.textContent,
					children: p.children.length,
					color: getComputedStyle(p).color
				};
			});

			assert.equal(literal.text, "<img src=x onerror=alert(1)>");
			assert.equal(literal.children, 0);
			assert.equal(literal.color, "rgb(28, 87, 51)");
		}
		await page.focus("#start");
		await page.keyboard.press("Tab");
		await page.focus("#start");

		return {
			complete,
			nativePromptCases: proofs,
			starterTaskExplained: !complete,
			exactIntegerLimit: complete,
			literalOutput: complete,
			width
		};
	}
	assert.equal(
		await page.$eval("caption", e => e.textContent),
		"Three restaurant choices and menu items"
	);

	if (!complete) {
		assert.equal(await page.$$eval("tbody tr", r => r.length), 0);

		return { complete: false, scaffoldVisible: true, width };
	}
	assert.deepEqual(
		await page.$$eval("thead th", r =>
			r.map(e => ({
				name: e.textContent,
				scope: e.getAttribute("scope")
			}))),
		[
			{ name: "Name", scope: "col" },
			{ name: "Favorite Menu Item", scope: "col" },
			{ name: "Photo or Illustration", scope: "col" }
		]
	);

	assert.equal(await page.$$eval("tbody tr", r => r.length), 3);

	await page.waitForFunction(
		() =>
			[...document.images].length === 3
			&& [...document.images].every(
				i =>
					i.complete
					&& i.naturalWidth === 120
					&& i.alt.startsWith("Illustration of")
			)
	);

	assert.deepEqual(
		await page.$$eval("tbody tr", rows =>
			rows.map(r => r.cells[1].textContent)),
		["Fries", "Orange Chicken", "Taco Bowl"]
	);

	const links = await page.$$eval("tbody a", a =>
		a.map(e => ({ url: e.href, target: e.target })));

	assert.ok(
		links.every(l => l.url.startsWith("https://") && l.target === "")
	);

	await page.focus("tbody a");
	assert.equal(
		await page.$eval("tbody a", e => document.activeElement === e),
		true
	);

	const layout = await page.evaluate(() => {
		const check = () =>
			document.documentElement.scrollWidth <= innerWidth + 1
			&& [...document.querySelectorAll("img")].every(
				i =>
					i.getBoundingClientRect().right <= innerWidth
					&& i.getBoundingClientRect().width > 0
			);

		const body = document.querySelector("tbody");
		const clone = body.firstElementChild.cloneNode(true);
		body.append(clone);

		const alternating
			= getComputedStyle(clone).backgroundColor
				=== getComputedStyle(body.children[1]).backgroundColor
				&& getComputedStyle(clone).backgroundColor
				!== getComputedStyle(body.children[0]).backgroundColor;

		const name = body.querySelector("a");
		const before = name.textContent;
		name.textContent = "Long replacement restaurant name ".repeat(8);

		const main = document.querySelector("main");
		main.style.fontSize = "200%";
		const fits = check();

		main.style.fontSize = "";
		name.textContent = before;
		clone.remove();

		return {
			alternating,
			fits,
			allThreeColumns: document.querySelectorAll("thead th").length === 3
		};
	});

	assert.ok(
		layout.alternating && layout.fits && layout.allThreeColumns,
		JSON.stringify(layout)
	);

	return {
		complete: true,
		threeScopedColumns: true,
		threeOriginalMenuItems: true,
		threeLocalIllustrationsLoaded: true,
		descriptiveAlternatives: true,
		sameTabHTTPSLinks: true,
		keyboardFocus: true,
		addedRowAlternates: true,
		longNameAndDoubleTextFit: true,
		width
	};
}
