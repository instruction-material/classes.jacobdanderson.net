import { describe, expect, it } from "vitest";
import { isCoreProjectTitle } from "@/stores/courses/projectGrouping";

describe("course project grouping", () => {
	it("keeps projects core and explicit supplemental projects in practice", () => {
		expect(isCoreProjectTitle("Project 2: Smiley Face")).toBe(true);
		expect(isCoreProjectTitle("Capstone: Design Defense")).toBe(true);
		expect(isCoreProjectTitle("Supplemental Project 1: Color Lab")).toBe(
			false
		);
		expect(
			isCoreProjectTitle("Check-In #1: Additional Practice Project")
		).toBe(false);
		expect(isCoreProjectTitle("Answer Key and Worked Solution")).toBe(false);
	});
});
