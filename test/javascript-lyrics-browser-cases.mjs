import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const fixture = JSON.parse(
	readFileSync(
		new URL("./fixtures/javascript-lyrics-sources.json", import.meta.url),
		"utf8"
	)
);
export const lyricScenarios = [
	{ name: "all-correct", answers: ["program", "easier", "clear"], score: 3 },
	{ name: "all-wrong", answers: ["wrong", "wrong", "wrong"], score: 0 },
	{
		name: "mixed-one-correct",
		answers: ["wrong", "wrong", "clear"],
		score: 1
	},
	{ name: "cancel-first", answers: [null, "easier", "clear"], score: 2 },
	{ name: "cancel-second", answers: ["program", null, "clear"], score: 2 },
	{ name: "cancel-third", answers: ["program", "easier", null], score: 2 },
	{ name: "cancel-all", answers: [null, null, null], score: 0 },
	{ name: "empty", answers: ["", "", ""], score: 0 },
	{
		name: "case-and-whitespace",
		answers: [" PROGRAM ", " EaSier ", " CLEAR "],
		score: 3
	}
];
export function editedLyricsSource(_resource, filename) {
	if (!["index.html", "styles.css", "script.js"].includes(filename))
		return undefined;
	const source = fixture.files.reference[filename];
	if (filename === "index.html")
		return source
			.replace("<body>", '<body data-lyrics-edited="true">')
			.replace(
				"<h1>Finish the Lyrics</h1>",
				"<h1>Three-question challenge</h1>"
			);
	if (filename === "styles.css")
		return source + "\n#quiz-score { font-style: italic; }\n";
	return source.replace(
		'"You got " + numCorrect + " answers out of " + numLyrics + " correct!"',
		'"Practice result: " + numCorrect + "/" + numLyrics'
	);
}
export async function inspectLyrics(page, resource, kind, url) {
	if (resource.role === "starter" && kind === "exact") {
		await page.goto(url, { waitUntil: "load" });
		assert.equal(await page.$("#quiz-score"), null);
		assert.equal(await page.$("h1"), null);
		return { blankStarterRetained: true, cases: [] };
	}
	const cases = [];
	for (const scenario of lyricScenarios) {
		const prompts = [],
			alerts = [],
			dialogErrors = [];
		const handler = dialog => {
			const respond = async () => {
				if (dialog.type() === "prompt") {
					const index = prompts.length;
					prompts.push(dialog.message());
					assert.ok(index < 3, "Only three assigned questions");
					const value = scenario.answers[index];
					if (value === null) await dialog.dismiss();
					else await dialog.accept(value);
				} else {
					assert.equal(dialog.type(), "alert");
					alerts.push(dialog.message());
					await dialog.accept();
				}
			};
			void respond().catch(async error => {
				dialogErrors.push(String(error));
				await dialog.dismiss().catch(() => {});
			});
		};
		page.on("dialog", handler);
		try {
			await page.goto(url, { waitUntil: "load" });
			const expected =
				kind === "edited"
					? "Practice result: " + scenario.score + "/3"
					: "You got " +
						scenario.score +
						" answers out of 3 correct!";
			await page.waitForFunction(
				text => {
					const element = document.querySelector("#quiz-score");
					return (
						element?.textContent === text &&
						Number(getComputedStyle(element).opacity) >= 0.99
					);
				},
				{},
				expected
			);
			const state = await page.evaluate(() => {
				const element = document.querySelector("#quiz-score"),
					style = getComputedStyle(element),
					rect = element.getBoundingClientRect();
				return {
					text: element.textContent,
					role: element.getAttribute("role"),
					count: document.querySelectorAll("#quiz-score").length,
					color: style.color,
					fontStyle: style.fontStyle,
					opacity: style.opacity,
					left: rect.left,
					right: rect.right,
					scrollWidth: document.documentElement.scrollWidth,
					viewport: innerWidth,
					heading: document.querySelector("h1")?.textContent,
					edited: document.body.dataset.lyricsEdited === "true"
				};
			});
			assert.deepEqual(dialogErrors, []);
			assert.equal(prompts.length, 3);
			assert.equal(alerts.length, 4);
			assert.deepEqual(prompts, [
				"A tiny bug can hide in a large _____.",
				"A saved copy makes tomorrow's work _____.",
				"A clear name makes a variable's purpose _____."
			]);
			assert.equal(state.text, expected);
			assert.equal(state.role, "status");
			assert.equal(state.count, 1);
			assert.equal(state.edited, kind === "edited");
			assert.equal(
				state.heading,
				kind === "edited"
					? "Three-question challenge"
					: "Finish the Lyrics"
			);
			if (kind === "edited") assert.equal(state.fontStyle, "italic");
			assert.ok(state.left >= -1 && state.right <= state.viewport + 1);
			assert.ok(state.scrollWidth <= state.viewport + 1);
			const values = state.color
				.match(/[\d.]+/g)
				.slice(0, 3)
				.map(Number)
				.map(v => v / 255)
				.map(v =>
					v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4
				);
			const luminance =
				values[0] * 0.2126 + values[1] * 0.7152 + values[2] * 0.0722;
			const contrast = 1.05 / (luminance + 0.05);
			assert.ok(contrast >= 4.5);
			cases.push({
				name: scenario.name,
				answers: scenario.answers,
				expectedScore: scenario.score,
				scoreText: state.text,
				prompts: prompts.length,
				feedbackAlerts: alerts.length,
				contrast
			});
		} finally {
			page.off("dialog", handler);
		}
	}
	return {
		cases,
		allScoresVerified: true,
		cancellationSafeAtEveryQuestion: true,
		normalizationVerified: true,
		freshAttemptsResetCounter: true,
		editedOutputVerified: kind === "edited"
	};
}
