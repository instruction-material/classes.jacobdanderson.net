import { describe, expect, it } from "vitest";
import { usacoGoldCourse } from "@/stores/courses/usaco-gold";

const EXPECTED_PRIMARY_SEQUENCE = [
	"USG0 Setup, Contest Contract, and Gold Mindset",
	"Unit 1: Dynamic Programming, Knapsack, and State Design",
	"Unit 2: Shortest Paths, DAGs, and Weighted Graphs",
	"Unit 3: MSTs, DSU, and Connectivity Proofs",
	"Unit 4: Fenwick and Segment Trees, Ordering, and Range Structure",
	"Unit 5: Tree Algorithms, Euler Tours, and Advanced Graph Modeling",
	"Unit 6: Advanced DP, Bitmask State, and Combinatorics",
	"Unit 7: Protected Gold Sets, Postmortems, and Platinum Readiness"
];

function requireModule(title: string) {
	const module = usacoGoldCourse.modules.find(
		candidate => candidate.title === title
	);
	if (!module) throw new Error(`Expected USACO Gold module ${title}.`);
	return module;
}

function moduleText(title: string) {
	const module = requireModule(title);
	return [...module.curriculum, ...module.supplementalProjects]
		.map(item => `${item.title}\n${item.content}`)
		.join("\n");
}

function courseText() {
	return usacoGoldCourse.modules
		.map(module => `${module.title}\n${moduleText(module.title)}`)
		.join("\n");
}

function resourceText() {
	return usacoGoldCourse.modules
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

describe("USACO Gold learner flow", () => {
	it("uses an eight-stage Gold spine and three explicit appendices", () => {
		expect(
			usacoGoldCourse.modules.slice(0, 8).map(module => module.title)
		).toEqual(EXPECTED_PRIMARY_SEQUENCE);
		expect(usacoGoldCourse.modules).toHaveLength(11);
		expect(usacoGoldCourse.modules.slice(8)).toMatchObject([
			{
				kind: "appendix",
				title: "Optional Gold Problem Bank"
			},
			{
				kind: "appendix",
				title: "Optional Historical and Applied Gold Studios"
			},
			{
				kind: "appendix",
				title: "Pending Static Assets"
			}
		]);
	});

	it("gives every required stage pacing, milestones, and explicit paths", () => {
		for (const module of usacoGoldCourse.modules.slice(0, 8)) {
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

	it("preserves the complete problem bank, eight studios, and asset record", () => {
		const curriculumTitles = usacoGoldCourse.modules.flatMap(module =>
			module.curriculum.map(item => item.title)
		);
		const optionTitles = usacoGoldCourse.modules.flatMap(module =>
			module.supplementalProjects.map(item => item.title)
		);

		expect(curriculumTitles).toHaveLength(61);
		expect(optionTitles).toHaveLength(96);
		for (const title of [
			"Native Input/Output Retry",
			"MooTube: Offline Connectivity Practice",
			"MooTube: Changed-Case Retry",
			"Snow Boots: Offline Sweep Extension",
			"Problem Bank: Full Gold Repo",
			"Problem: Roadblock",
			"Problem: Superbull",
			"Problem: Fenced In",
			"Problem: Sleepy Cow Sorting",
			"Dynamic Programming Practice: Core Project",
			"Hoof Paper Scissors: Core Project",
			"Why Did the Cow Cross the Road: Core Project",
			"Cow Routing: Core Project",
			"MST II: Core Project",
			"Watering the Fields: Core Project",
			"I Would Walk 500 Miles: Core Project",
			"Talent Show: Core Project"
		]) {
			expect(optionTitles, title).toContain(title);
		}
		expect(
			moduleText("Optional Historical and Applied Gold Studios")
		).toContain("complete guided practice collection");
		expect(moduleText("Pending Static Assets")).toContain("treasure.txt");
	});

	it("covers the current Gold algorithm and implementation map", () => {
		const text = courseText();

		for (const topic of [
			"push or pull",
			"knapsack",
			"0–1 BFS",
			"Topological Ordering",
			"Kruskal",
			"Prim",
			"segment tree",
			"inversion",
			"Euler-Tour",
			"Tree DP",
			"rerooting",
			"bitmask DP",
			"range DP",
			"digit DP",
			"modular inverse"
		]) {
			expect(text, topic).toContain(topic);
		}
		expect(text).toContain("slow oracle");
		expect(text).toContain("smallest mismatch");
		expect(text).toContain("path compression plus union by size or rank");
		expect(text).toContain("closed or half-open");
		expect(text).toContain("iterative traversal");
	});

	it("matches current Gold contest, certification, I/O, and integrity rules", () => {
		const setup = moduleText(
			"USG0 Setup, Contest Contract, and Gold Mindset"
		);
		const resources = resourceText();

		expect(setup).toContain("continuous four-hour window");
		expect(setup).toContain("US Open uses five hours");
		expect(setup).toContain("12:00 and 12:15");
		expect(setup).toContain(
			"certified result is required for promotion from Gold to Platinum"
		);
		expect(setup).toContain("promotion cutoffs vary by contest");
		expect(setup).toContain("standard input and output");
		expect(setup).toContain("C, C++, Java, and Python");
		expect(setup).toContain("Generative AI");
		expect(setup).toContain("prewritten templates");
		expect(setup).toContain("automated submissions");
		expect(resources).toContain("usaco.org/index.php?page=instructions");
		expect(resources).toContain("usaco.org/index.php?page=details");
		expect(resources).toContain("usaco.guide/gold");
	});

	it("ends with a current protected set, repair loop, and cautious next gate", () => {
		const capstone = moduleText(
			"Unit 7: Protected Gold Sets, Postmortems, and Platinum Readiness"
		);

		expect(capstone).toContain(
			"`Good Cyclic Shifts`, `Picking Flowers`, and `Random Tree Generation`"
		);
		expect(capstone).toContain("reported 750 promotion cutoff");
		expect(capstone).toContain("three unseen Gold problems");
		expect(capstone).toContain("continuous four-hour timer");
		expect(capstone).toContain(
			"no AI, hints, discussion, templates, or solution viewing"
		);
		expect(capstone).toContain("delayed rewrite from an empty file");
		expect(capstone).toContain("at least two protected Gold mocks");
		expect(capstone).toContain("one independent full solve per set");
		expect(capstone).toContain(
			"official certified promotion result remains the authority"
		);
	});
});
