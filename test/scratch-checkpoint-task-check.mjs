import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

export async function checkScratchCheckpointTasks(
	page,
	{ origin, files, setRole }
) {
	const output
		= process.env.SCRATCH_ORIGINAL_BROWSER_PROOF_DIR
			|| path.join(files, "original-proof");
	await mkdir(output, { recursive: true });
	const record = { complete: false, views: [] };
	const retain = () =>
		writeFile(
			path.join(output, "checkpoint-tasks.json"),
			`${JSON.stringify(record, null, 2)}\n`
		);
	const modules = [
		{
			id: "scratch-level-2-check-in-1",
			items: [
				[
					"Check-In #1: Nested Loops",
					["repeat 3", "repeat 2", "hexagon", "Download the .sb3 file"],
					true
				],
				[
					"Check-In #1: Cloning",
					["every 2 seconds", "delete themselves"]
				],
				[
					"Check-In #1: Complex Conditionals",
					["Complex-3", "Complex-ALL", "each of the four quadrants"]
				],
				[
					"Scratch Level 2 Check-In 1 Practice Project",
					[
						"count from 1 to 50",
						"spacebar or the up arrow",
						"doesn't say anything"
					]
				]
			]
		},
		{
			id: "scratch-level-2-check-in-2",
			items: [
				[
					"Check-In #2: Strings",
					["first letter", "number of characters", "lengths are 4 and 2"],
					true
				],
				[
					"Check-In #2: Mathematical Operators and Randomness",
					[
						"5 and 6",
						"between 1 and 20",
						"store it in a variable",
						"Math-5"
					]
				],
				["Check-In #2: Lists", ["second item", "Clear the list first"]],
				[
					"Check-In #2: Functions",
					["first 10 multiples", "random number from 1 to 10"]
				],
				[
					"Scratch Level 2 Check-In 2 Practice Project",
					["top five favorites", "dance for 3 seconds"]
				]
			]
		}
	];
	try {
		for (const role of ["learner", "instructor"]) {
			setRole(role);
			for (const width of [390, 1280]) {
				await page.setViewport({ width, height: 900 });
				for (const module of modules) {
					await page.goto("about:blank");
					await page.goto(`${origin}/courses#${module.id}`, {
						waitUntil: "networkidle2"
					});
					await page.waitForSelector(".lesson-view-toggle button");
					await page
						.locator(".lesson-view-toggle button:nth-child(1)")
						.click();
					for (const [title, required, blankStarter] of module.items) {
						record.inProgress = { role, width, title };
						await retain();
						await page.waitForFunction(
							({ title, required }) =>
								[
									...document.querySelectorAll(".lesson-item")
								].some(
									item =>
										item
											.querySelector("h5")
											?.textContent
											.trim() === title
											&& required.every(t =>
												item.textContent
													.replace(/\s+/g, " ")
													.includes(t)
											)
								),
							{},
							{ title, required }
						);
						const actual = await page.$$eval(
							".lesson-item",
							(items, title) => {
								const item = items.find(
									i =>
										i
											.querySelector("h5")
											?.textContent
											.trim() === title
								);
								const starter = item.querySelector(
									"a.resource-link.is-project[href^='/ide?mode=scratch&starter=blank&']"
								);
								const url = starter && new URL(starter.href);
								return {
									text: item.textContent.replace(/\s+/g, " "),
									blankStarter: !!url
										&& url.searchParams.get("course") === "scratch-level-2"
										&& url.searchParams.get("lesson") === item.id
										&& starter.textContent.includes("Start in IDE"),
									contained:
										item.scrollWidth
										<= item.clientWidth + 1
										&& document.documentElement.scrollWidth
										<= innerWidth + 1
								};
							},
							title
						);
						assert.ok(actual.contained, `${title} containment`);
						assert.equal(actual.blankStarter, !!blankStarter, `${title} blank workspace launch`);
						record.views.push({ role, width, title, ...actual });
						await retain();
						if (
							title.includes("Complex Conditionals")
							|| title.includes("Mathematical Operators")
						) {
							await page.$$eval(
								".lesson-item",
								(items, title) =>
									items
										.find(
											i =>
												i
													.querySelector("h5")
													?.textContent
													.trim()
													=== title
										)
										.scrollIntoView({
											behavior: "instant",
											block: "start"
										}),
								title
							);
							await page.screenshot({
								path: path.join(
									output,
									`checkpoint-${
										module.id
									}-${
										role
									}-${
										width
									}.png`
								)
							});
						}
					}
				}
			}
		}
		assert.equal(record.views.length, 36);
		delete record.inProgress;
		record.complete = true;
		return record;
	}
	finally {
		await retain();
	}
}
