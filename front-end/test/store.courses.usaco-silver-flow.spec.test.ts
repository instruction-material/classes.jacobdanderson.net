import { describe, expect, it } from "vitest";
import { usacoSilverCourse } from "@/stores/courses/usaco-silver";

const EXPECTED_PRIMARY_SEQUENCE = [
	"USS0 Setup and Silver Transition",
	"Unit 1: Maps, Sets, and Problem Modeling",
	"Unit 2: DFS, BFS, Flood Fill, Trees, and Functional Graphs",
	"Unit 3: Sorting, Two Pointers, Compression, and Binary Search",
	"Unit 4: Prefix and Difference Sums, Ranges, and Sliding Windows",
	"Unit 5: Greedy, Priority Queues, Bitwise, and Structured Simulation",
	"Unit 6: Protected Silver Sets, Postmortems, and Gold Readiness"
];

function requireModule(title: string) {
	const module = usacoSilverCourse.modules.find(
		candidate => candidate.title === title
	);
	if (!module) throw new Error(`Expected USACO Silver module ${title}.`);
	return module;
}

function moduleText(title: string) {
	const module = requireModule(title);
	return [...module.curriculum, ...module.supplementalProjects]
		.map(item => `${item.title}\n${item.content}`)
		.join("\n");
}

function courseText() {
	return usacoSilverCourse.modules
		.map(module => `${module.title}\n${moduleText(module.title)}`)
		.join("\n");
}

function resourceText() {
	return usacoSilverCourse.modules
		.flatMap(module => [
			...module.curriculum,
			...module.supplementalProjects
		])
		.flatMap(item => [
			item.projectLink,
			item.solutionLink,
			item.datasetLink,
			item.mediaLink
		])
		.filter(Boolean)
		.join("\n");
}

describe("USACO Silver learner flow", () => {
	it("uses a seven-unit Silver spine and two explicit practice appendices", () => {
		expect(
			usacoSilverCourse.modules.slice(0, 7).map(module => module.title)
		).toEqual(EXPECTED_PRIMARY_SEQUENCE);
		expect(usacoSilverCourse.modules).toHaveLength(9);
		expect(usacoSilverCourse.modules.slice(7)).toMatchObject([
			{
				kind: "appendix",
				title: "Optional Silver Problem Bank"
			},
			{
				kind: "appendix",
				title: "Optional Historical and Applied Silver Studios"
			}
		]);
	});

	it("gives every required unit pacing, milestones, and explicit paths", () => {
		for (const module of usacoSilverCourse.modules.slice(0, 7)) {
			expect(module.estimatedTime, module.title).toMatch(/session/);
			expect(
				module.keyBlocks?.length,
				module.title
			).toBeGreaterThanOrEqual(6);
			expect(
				module.curriculum.every(item => item.learningPath === "core"),
				module.title
			).toBe(true);
			expect(
				module.supplementalProjects.every(item =>
					["choice", "challenge"].includes(item.learningPath ?? "")
				),
				module.title
			).toBe(true);
			expect(module.curriculum[0]?.content, module.title).toContain(
				"**Course flow:**"
			);
		}
	});

	it("preserves the full repository bank and all nine practice studios", () => {
		const curriculumTitles = usacoSilverCourse.modules.flatMap(module =>
			module.curriculum.map(item => item.title)
		);
		const optionTitles = usacoSilverCourse.modules.flatMap(module =>
			module.supplementalProjects.map(item => item.title)
		);

		expect(curriculumTitles).toHaveLength(50);
		expect(optionTitles).toHaveLength(95);
		expect(moduleText("Optional Silver Problem Bank")).toContain(
			"[full Silver problem library]"
		);
		for (const title of [
			"Problem: Floodfill",
			"Problem: Cities and States",
			"Problem: Moocast",
			"Problem: Rectangular Pasture",
			"US Berry Picking: Core Project",
			"Superprime Rib: Core Project",
			"The Castle: Core Project",
			"Sorting a Three Valued Sequence: Core Project",
			"Healthy Holsteins: Core Project",
			"Hamming Codes: Core Project",
			"Priority Queues: Core Project",
			"Hoof Paper Scissors: Core Project",
			"Why Did the Cow Cross the Road: Core Project"
		]) {
			expect(optionTitles, title).toContain(title);
		}
		expect(
			moduleText("Optional Historical and Applied Silver Studios")
		).toContain("complete guided practice collection");
	});

	it("covers the modern Silver pattern map and implementation contracts", () => {
		const text = courseText();

		for (const topic of [
			"maps and sets",
			"two pointers",
			"coordinate compression",
			"custom sorting",
			"prefix and difference sums",
			"sliding windows",
			"DFS/BFS/flood fill",
			"trees and functional graphs",
			"greedy methods",
			"priority queues",
			"bitwise state",
			"constructive output"
		]) {
			expect(text, topic).toContain(topic);
		}
		expect(text).toContain("known-false/known-true or half-open");
		expect(text).toContain("recursion depth");
		expect(text).toContain("aggregate input bound of one million");
		expect(text).toContain("Recompute every required property");
		expect(text).toContain("smallest counterexample");
	});

	it("matches current contest, I/O, integrity, and calibration boundaries", () => {
		const setup = moduleText("USS0 Setup and Silver Transition");
		const ranges = moduleText(
			"Unit 4: Prefix and Difference Sums, Ranges, and Sliding Windows"
		);
		const construction = moduleText(
			"Unit 5: Greedy, Priority Queues, Bitwise, and Structured Simulation"
		);
		const resources = resourceText();

		expect(setup).toContain("continuous four-hour window");
		expect(setup).toContain("five hours for the US Open");
		expect(setup).toContain(
			"Certified result windows applied to Gold and Platinum"
		);
		expect(setup).toContain("terminal-based standard input and output");
		expect(setup).toContain("C, C++, Java, and Python");
		expect(setup).toContain("Generative AI");
		expect(setup).toContain("prewritten templates");
		expect(setup).toContain("automated submissions");
		expect(ranges).toContain("Sliding Window Summation");
		expect(construction).toContain("Sequence Construction");
		expect(construction).toContain("popcount, XOR");
		expect(resources).toContain("usaco.org/index.php?page=instructions");
		expect(resources).toContain("usaco.guide/silver");
		expect(resources).toContain("cpid=1544");
		expect(resources).toContain("cpid=1518");
	});

	it("ends with a current protected set, postmortem repair, and Gold gate", () => {
		const capstone = moduleText(
			"Unit 6: Protected Silver Sets, Postmortems, and Gold Readiness"
		);

		expect(capstone).toContain(
			"`Clash!`, `Milk Buckets`, and `Point Elimination`"
		);
		expect(capstone).toContain("three unseen Silver problems");
		expect(capstone).toContain("continuous four-hour timer");
		expect(capstone).toContain(
			"no AI, hints, discussion, templates, or solution viewing"
		);
		expect(capstone).toContain("delayed rewrite from an empty file");
		expect(capstone).toContain("at least two independent solves");
		expect(capstone).toContain("reported 700 promotion cutoff");
		expect(capstone).toContain("not every Silver contest");
	});
});
