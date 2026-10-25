import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import vm from "node:vm";
import { describe, expect, it } from "vitest";
import { scenarios } from "../../test/javascript-advanced-conditionals-browser-cases.mjs";

const fixture = JSON.parse(readFileSync(resolve("../test/fixtures/javascript-advanced-conditionals-sources.json"), "utf8"));
for (const resource of fixture.resources) {
	describe(`${resource.project} ${resource.role} source behavior`, () => {
		for (const scenario of scenarios(resource).filter(row => !row.probe)) {
			it(scenario.name, () => {
				const file = resource.files.find(row => row.name === "script.js");
				const source = readFileSync(resolve("public/course-assets/javascript-level-1", file.path), "utf8").split("function printToScreen")[0];
				const output: string[] = [];
				let promptCalls = 0;
				new vm.Script(source).runInNewContext({
					prompt: () => {
						expect(promptCalls).toBeLessThan(scenario.inputs.length);
						return scenario.inputs[promptCalls++];
					},
					printToScreen: (value: unknown) => output.push(String(value))
				}, { timeout: 500 });
				expect(output).toEqual(scenario.text);
				expect(promptCalls).toBe(scenario.inputs.length);
			});
		}
	});
}
