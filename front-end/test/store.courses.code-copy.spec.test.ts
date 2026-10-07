import { describe, expect, it } from "vitest";
import { normalizeRawCourse } from "@/stores/courses/normalization";

function normalized(content: string) {
	return normalizeRawCourse("code-copy-fixture", {
		name: "Supplied source example",
		modules: [
			{
				title: "Reference",
				kind: "appendix",
				curriculum: [{ title: "Complete program", content }],
				supplementalProjects: []
			}
		]
	}).modules[0].curriculum[0].content;
}

describe("copy cleanup preserves supplied source", () => {
	it("preserves borrowing semantics in ordinary explanation text", () => {
		const explanation =
			"A string view borrows the original text without copying, but the view cannot outlive that text.";
		expect(normalized(explanation)).toContain(explanation);
	});

	it("preserves comments, strings, literal branding and grammar inside fenced programs", () => {
		const body =
			'// Definition of a student struct\n// Create Students, then set their fields\nconst label = "Juni";\nconst message = "A student has a input and the the result.";\n';
		for (const [opening, closing] of [
			["```cpp", "```"],
			["~~~cpp", "~~~~"],
			["````text", "````"]
		]) {
			const program = `${opening}\n${body}${closing}`;
			const result = normalized(`A student reads a input.\n\n${program}`);
			expect(result).toContain(`\n\n${program}`);
			expect(result).toContain("A learner reads an input.");
		}
	});

	it("preserves matching inline code and an unclosed block while editing surrounding prose", () => {
		const inline = '`"Juni" Students a input`';
		const longInline = '``a student writes `teacher` and "Juni"``';
		const replacement = "``$& $$ $' $` ${HOME}``";
		const unclosed =
			'~~~cpp\n// Students must preserve this\nconst label = "Juni";';
		const result = normalized(
			`A student reads a input: ${inline} and ${longInline} and ${replacement}.\n\n${unclosed}`
		);
		expect(result).toContain("A learner reads an input:");
		expect(result).toContain(inline);
		expect(result).toContain(longInline);
		expect(result).toContain(replacement);
		expect(result).toContain(unclosed);
		const directive = normalized(
			"Start with `contextmanager`; use a class when reusable state matters."
		);
		expect(directive).toContain("`contextmanager`");
		expect(directive).not.toMatch(/\bStart with\b/);
		const steps = normalized(
			"**Build plan:**\n1. `first()` reads a value.\n2. `second()` checks the value."
		);
		expect(steps).toContain("**Build plan:**\n\n1. `first()`");
		expect(steps).toContain("\n2. `second()`");
	});
});
