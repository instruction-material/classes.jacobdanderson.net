import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const fixture = JSON.parse(
	readFileSync(
		new URL(
			"./fixtures/javascript-fundamentals-checkpoint-sources.json",
			import.meta.url
		),
		"utf8"
	)
);
export function editedFundamentalsCheckpointSource(resource, filename) {
	const reference = fixture.resources.find(row => row.role === "reference");
	const file = reference.files.find(row => row.name === filename);
	const original = readFileSync(
		new URL(
			"../front-end/public/course-assets/javascript-level-1/" + file.path,
			import.meta.url
		),
		"utf8"
	);
	return filename === "index.html"
		? original.replace(
				"<h1>Fundamentals checkpoint</h1>",
				"<h1>Saved fundamentals checkpoint</h1>"
			)
		: original + "\n// Saved checkpoint work\n";
}

export async function inspectFundamentalsCheckpoint(page, resource, kind) {
	const complete = kind === "edited" || resource.role === "reference";
	const state = await page.evaluate(() => ({
		heading: document.querySelector("h1").textContent,
		fits: document.documentElement.scrollWidth <= innerWidth
	}));
	assert.equal(
		state.heading,
		kind === "edited"
			? "Saved fundamentals checkpoint"
			: "Fundamentals checkpoint"
	);
	assert.ok(state.fits);
	const exercises = [
		"variables",
		"math",
		"loops",
		"conditionals",
		"drawing",
		"nested"
	];
	const cases = exercises.map(exercise => ({
		exercise,
		prompt: "teal",
		seed: 0
	}));
	cases.find(c => c.exercise === "conditionals").prompt = "50";
	if (complete)
		cases.push(
			{ exercise: "variables", prompt: null, seed: 0 },
			{ exercise: "variables", prompt: "", seed: 0 },
			{ exercise: "math", prompt: "", seed: 0.999999 },
			{ exercise: "loops", prompt: "", seed: 0.999999 },
			...["51", "0", "", null, "NaN", "Infinity"].map(prompt => ({
				exercise: "conditionals",
				prompt,
				seed: 0
			}))
		);
	const results = [];
	for (const scenario of cases) {
		const alerts = [];
		const dialog = async dialog => {
			if (dialog.type() === "prompt") {
				if (scenario.prompt === null) await dialog.dismiss();
				else await dialog.accept(scenario.prompt);
			} else {
				alerts.push(dialog.message());
				await dialog.accept();
			}
		};
		page.on("dialog", dialog);
		try {
			await page.evaluate(seed => {
				Math.random = () => seed;
			}, scenario.seed);
			await page.select("#exercise", scenario.exercise);
			await page.click("#run");
			await page.waitForFunction(
				() =>
					document.querySelectorAll("#output p,#output svg").length >
					0
			);
			const output = await page.evaluate(() => ({
				lines: [...document.querySelectorAll("#output p")].map(
					node => node.textContent
				),
				svg: [...document.querySelectorAll("#output svg")].map(svg => ({
					width: svg.getAttribute("width"),
					height: svg.getAttribute("height"),
					viewBox: svg.getAttribute("viewBox"),
					rect: [...svg.querySelectorAll("rect")].map(node =>
						["x", "y", "width", "height", "fill"].map(name =>
							node.getAttribute(name)
						)
					),
					circles: [...svg.querySelectorAll("circle")].map(node =>
						["cx", "cy", "r", "fill"].map(name =>
							node.getAttribute(name)
						)
					)
				})),
				fits: document.documentElement.scrollWidth <= innerWidth
			}));
			assert.ok(output.fits);
			if (!complete) {
				assert.deepEqual(output.lines, [
					"Implement the " + scenario.exercise + " exercise."
				]);
				assert.deepEqual(alerts, []);
			} else if (scenario.exercise === "variables") {
				assert.deepEqual(output.lines, [
					"10 hello world true",
					scenario.prompt === null
						? "Color entry cancelled."
						: "Your favorite color is " + scenario.prompt
				]);
				assert.deepEqual(
					alerts,
					scenario.prompt === null
						? []
						: ["Your favorite color is " + scenario.prompt]
				);
			} else if (scenario.exercise === "math") {
				const original = scenario.seed === 0 ? 1 : 256;
				assert.deepEqual(output.lines, [
					"Original: " + original,
					"Plus 5: " + (original + 5),
					"Times 10: " + original * 10,
					"Remainder by 3: " + (original % 3)
				]);
			} else if (scenario.exercise === "loops") {
				const evens = Array.from({ length: 11 }, (_, i) =>
					String(i * 2)
				);
				const number = scenario.seed === 0 ? 0 : 10;
				assert.deepEqual(output.lines, [
					"For loop",
					...evens,
					"While loop",
					...evens,
					"Six random integers",
					...Array(6).fill(String(number)),
					"Total: " + 6 * number
				]);
			} else if (scenario.exercise === "conditionals") {
				const invalid =
					scenario.prompt === null ||
					scenario.prompt === "" ||
					["NaN", "Infinity"].includes(scenario.prompt);
				assert.deepEqual(
					output.lines,
					invalid
						? ["Enter a finite number."]
						: [
								Number(scenario.prompt) <= 50
									? "Success: number is at most 50."
									: "Sorry: number is greater than 50.",
								"Both rule: you cannot go outside.",
								"Either rule: you can go outside."
							]
				);
			} else if (scenario.exercise === "drawing") {
				assert.deepEqual(output.lines, []);
				assert.deepEqual(output.svg, [
					{
						width: "500",
						height: "500",
						viewBox: "0 0 500 500",
						rect: [["100", "120", "200", "200", "green"]],
						circles: [["200", "220", "50", "blue"]]
					}
				]);
			} else {
				assert.deepEqual(output.lines, [
					"For loops",
					"****",
					"***",
					"**",
					"*",
					"While loops",
					"****",
					"***",
					"**",
					"*"
				]);
			}
			results.push({
				...scenario,
				output,
				alerts,
				passed: true,
				intentionalStarterStop: !complete
			});
		} finally {
			page.off("dialog", dialog);
		}
	}
	assert.equal(results.length, complete ? 16 : 6);
	if (complete) {
		await page.select("#exercise", "drawing");
		await page.click("#run");
		await page.waitForSelector("#output svg");
		state.visualFinalExample = "drawing";
	}
	return { ...state, complete, scenarioExecutions: results.length, results };
}
