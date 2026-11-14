import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
const fixture = JSON.parse(
	readFileSync(
		new URL(
			"./fixtures/javascript-small-talk-sources.json",
			import.meta.url
		),
		"utf8"
	)
);
export function editedSmallTalkSource(resource, filename) {
	if (filename === "index.html")
		return fixture.files[resource.role][filename]
			.replace("<body>", '<body data-small-talk-edited="true">')
			.replace("<h1>Small Talk</h1>", "<h1>Profile comparison</h1>");
	if (filename === "styles.css")
		return (
			fixture.files[resource.role][filename] +
			"\n#summary { font-style: italic; }\n"
		);
	if (filename === "script.js")
		return (
			(resource.role === "starter"
				? fixture.files.starter[filename] +
					"\n" +
					fixture.files.reference[filename]
				: fixture.files.reference[filename]) +
			"\n// Saved profile comparison attempt.\n"
		);
	return undefined;
}
export async function inspectSmallTalk(page, resource, kind, url) {
	if (resource.role === "starter" && kind === "exact") {
		const prompts = [],
			handler = dialog => {
				prompts.push(dialog.message());
				void dialog.dismiss();
			};
		page.on("dialog", handler);
		try {
			await page.goto(url, { waitUntil: "load" });
			assert.equal(await page.$eval("#summary", e => e.textContent), "");
			assert.deepEqual(prompts, []);
			return { blankStarterRetained: true, cases: [] };
		} finally {
			page.off("dialog", handler);
		}
	}
	const cases = [];
	for (const scenario of fixture.scenarios) {
		const prompts = [],
			alerts = [],
			dialogErrors = [];
		const handler = dialog => {
			void (async () => {
				if (dialog.type() === "prompt") {
					const index = prompts.length;
					prompts.push(dialog.message());
					assert.ok(index < 6);
					const value = scenario.answers[index];
					if (value === null) await dialog.dismiss();
					else await dialog.accept(value);
				} else {
					assert.equal(dialog.type(), "alert");
					alerts.push(dialog.message());
					await dialog.accept();
				}
			})().catch(async error => {
				dialogErrors.push(String(error));
				await dialog.dismiss().catch(() => {});
			});
		};
		page.on("dialog", handler);
		try {
			await page.goto(url, { waitUntil: "load" });
			const state = await page.evaluate(() => {
				const element = document.getElementById("summary"),
					style = getComputedStyle(element),
					rect = element.getBoundingClientRect();
				return {
					text: element.textContent,
					values: aboutYou,
					keys: Object.keys(aboutMe),
					role: element.getAttribute("aria-live"),
					fontStyle: style.fontStyle,
					color: style.color,
					left: rect.left,
					right: rect.right,
					scrollWidth: document.documentElement.scrollWidth,
					viewport: innerWidth,
					heading: document.querySelector("h1").textContent,
					edited: document.body.dataset.smallTalkEdited === "true",
					markupElements: element.querySelectorAll("*").length
				};
			});
			assert.deepEqual(dialogErrors, []);
			assert.equal(prompts.length, 6);
			assert.equal(alerts.length, scenario.alerts);
			assert.deepEqual(state.values, scenario.values);
			assert.deepEqual(state.keys, Object.keys(scenario.values));
			assert.equal(state.text, scenario.summary);
			assert.equal(state.role, "polite");
			assert.equal(state.markupElements, 0);
			assert.equal(state.edited, kind === "edited");
			assert.equal(
				state.heading,
				kind === "edited" ? "Profile comparison" : "Small Talk"
			);
			assert.ok(!/\b(?:null|NaN)\b/.test(prompts.join("\n")));
			if (kind === "edited") assert.equal(state.fontStyle, "italic");
			assert.ok(state.left >= -1 && state.right <= state.viewport + 1);
			assert.ok(state.scrollWidth <= state.viewport + 1);
			if (scenario.name === "trim-and-case") {
				assert.ok(prompts[2].includes("same city"));
				assert.ok(prompts[4].includes("same school"));
				assert.ok(prompts[5].includes("share a favorite subject"));
				assert.ok(alerts.at(-1).includes("agree about pizza"));
			}
			if (scenario.name === "differs")
				assert.ok(alerts.at(-1).includes("differ about pizza"));
			cases.push({
				name: scenario.name,
				prompts: prompts.length,
				alerts: alerts.length,
				values: state.values,
				summary: state.text
			});
		} finally {
			page.off("dialog", handler);
		}
	}
	return {
		cases,
		typedValuesVerified: true,
		allQuestionsContinue: true,
		literalTextVerified: true,
		editedOutputVerified: kind === "edited"
	};
}
