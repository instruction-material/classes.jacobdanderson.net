import type { RawCourse, RawCourseModuleItem } from "@/stores/courses/types";
import { describe, expect, it } from "vitest";
import { scratchLevel1Course } from "@/stores/courses/scratch-level-1";
import { scratchLevel2Course } from "@/stores/courses/scratch-level-2";

interface ScratchLinkExpectation {
	project: string;
	solution?: string;
	title: string;
}

const SCRATCH_LEVEL_1_PROFILE_LINKS: ScratchLinkExpectation[] = [
	{
		title: "Project 1 – Hungry Hippo",
		project: "304003593"
	},
	{
		title: "Project 1 – Bug Eater",
		project: "297831461",
		solution: "297828061"
	},
	{
		title: "Project 2 – Cake Chaser",
		project: "299085513",
		solution: "297843021"
	},
	{
		title: "Project 3 – Talent Show",
		project: "295339505",
		solution: "295340057"
	},
	{
		title: "GS3 Supplemental Project 1 – Quadrant Practice",
		project: "329289426",
		solution: "329283944"
	},
	{
		title: "GS3 Supplemental Project 2 – Coordinate Drawings",
		project: "329294838",
		solution: "329290359"
	},
	{
		title: "Project 1 – Speed Click",
		project: "299327014",
		solution: "299311602"
	},
	{
		title: "Project 2 – Spider Smash",
		project: "299272518",
		solution: "299094220"
	},
	{
		title: "GS6 Supplemental Project 1 – Counting Steps",
		project: "327635693",
		solution: "327634746"
	},
	{
		title: "GS6 Supplemental Project 2 – Hungry Crab",
		project: "327610777",
		solution: "327610727"
	},
	{
		title: "GS6 Supplemental Project 3 – Lunch Money",
		project: "327607937",
		solution: "327607840"
	},
	{
		title: "Project 2 – Fortune Teller",
		project: "297744913",
		solution: "297735619"
	},
	{
		title: "Project 3 – Number Guesser",
		project: "295334181",
		solution: "294561252"
	},
	{
		title: "GS9 Supplemental Project 1 – Animal Crossing",
		project: "328309551",
		solution: "328310531"
	},
	{
		title: "GS9 Supplemental Project 2 – Space Cadets",
		project: "328310783",
		solution: "328308418"
	}
];

function allItems(course: RawCourse) {
	return course.modules.flatMap(module => [
		...module.curriculum,
		...module.supplementalProjects
	]);
}

function requireItem(course: RawCourse, title: string): RawCourseModuleItem {
	const item = allItems(course).find(candidate => candidate.title === title);
	if (!item) throw new Error(`Expected Scratch project ${title}.`);
	return item;
}

function projectUrl(id: string) {
	return `https://scratch.mit.edu/projects/${id}/`;
}

describe("Scratch project links", () => {
	it("matches the current JuniLearningScratch profile catalog", () => {
		for (const expectation of SCRATCH_LEVEL_1_PROFILE_LINKS) {
			const item = requireItem(scratchLevel1Course, expectation.title);
			expect(item.projectLink, expectation.title).toBe(
				projectUrl(expectation.project)
			);
			expect(item.solutionLink, expectation.title).toBe(
				expectation.solution
					? projectUrl(expectation.solution)
					: undefined
			);
		}

		const hungryHippoExtension = requireItem(
			scratchLevel1Course,
			"Starting in Scratch: Extension Challenge"
		);
		expect(hungryHippoExtension.projectLink).toBe(projectUrl("304003593"));
		expect(hungryHippoExtension.solutionLink).toBeUndefined();
	});

	it("links Fish Food to its project and solution separately", () => {
		const fishFood = requireItem(
			scratchLevel2Course,
			"GM9 Project 1: Fish Food"
		);
		expect(fishFood.projectLink).toBe(projectUrl("315901981"));
		expect(fishFood.solutionLink).toBe(projectUrl("357453262"));
	});
});
