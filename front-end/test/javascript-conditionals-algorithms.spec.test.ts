import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import vm from "node:vm";
import { describe, expect, it } from "vitest";
import { scenarios } from "../../test/javascript-conditionals-browser-cases.mjs";

const fixture = JSON.parse(readFileSync(resolve("../test/fixtures/javascript-conditionals-sources.json"), "utf8"));
for (const resource of fixture.resources) {
	describe(`${resource.project} ${resource.role} source behavior`, () => {
		for (const scenario of scenarios(resource).filter(row => !row.probe)) {
			it(scenario.name, async () => {
				const file = resource.files.find(row => row.name === "script.js");
				const source = readFileSync(resolve("public/course-assets/javascript-level-1", file.path), "utf8").split("function printToScreen")[0];
				const output: string[] = [];
				const alerts: string[] = [];
				let promptCalls = 0;
				let randomCalls = 0;
				let stopAction: () => void = () => {};
				const stop = {
					hidden: true,
					addEventListener: (_event: string, callback: () => void) => {
						stopAction = callback;
					}
				};
				const status = { hidden: true, textContent: "" };
				const math = Object.create(Math);
				math.random = () => {
					const index = randomCalls++;
					return scenario.randomSequence?.[index] ?? scenario.random ?? 0.5;
				};
				new vm.Script(source).runInNewContext({
					Math: math,
					prompt: () => {
						expect(promptCalls).toBeLessThan(scenario.inputs.length);
						return scenario.inputs[promptCalls++];
					},
					alert: (value: string) => alerts.push(value),
					printToScreen: (value: unknown) => output.push(String(value)),
					document: { getElementById: (id: string) => id === "stop-rolls" ? stop : status },
					setTimeout: (callback: () => void) => {
						if (scenario.stopRolling) stopAction();
						callback();
					}
				}, { timeout: 500 });
				await Promise.resolve();
				await Promise.resolve();
				if (scenario.stopRolling) expect(output).toEqual([...scenario.text, "Rolling stopped after 1000 rolls."]);
				else expect(output).toEqual(scenario.text);
				expect(alerts).toEqual(scenario.alerts ?? []);
				expect(promptCalls).toBe(scenario.inputs.length);
				if (scenario.randomCalls !== undefined) expect(randomCalls).toBe(scenario.randomCalls);
				expect(stop.hidden).toBe(true);
				expect(status.hidden).toBe(true);
			});
		}
	});
}
