import { describe, expect, it } from "vitest";
import { usacoBronzeOnDemandCourse } from "@/stores/courses/source-library-courses";

const EXPECTED_PRIMARY_SEQUENCE = [
	"UB0 On-Demand Setup, Rules, and Placement",
	"Stage 1: Simulation and Exact Translation",
	"Stage 2: Strings, Modular Arithmetic, and Grids",
	"Stage 3: Arrays, Intervals, Counting, and Greedy",
	"Stage 4: Complete Search and Structured State",
	"Stage 5: Modern Bronze Patterns and Construction",
	"Stage 6: Protected Mock Contest and Postmortem",
	"Stage 7: Bronze Exit Portfolio and Silver Readiness"
];

const HISTORICAL_PROBLEM_TOPICS = [
	"Welcome to USACO Bronze!",
	"Square Pasture",
	"Your Ride Is Here",
	"Friday the Thirteenth",
	"Broken Necklace",
	"Greedy Gift Givers",
	"Milking Cows",
	"Name That Number",
	"Palindromic Squares",
	"Dual Palindromes",
	"Transformations",
	"Mixing Milk",
	"Barn Repair",
	"Combination Lock",
	"Prime Cryptarithm",
	"Ski Course Design",
	"Wormholes",
	"Block Game",
	"The Cow-Signal",
	"Don't Be Last",
	"Hoof, Paper, Scissors",
	"Cow Tipping",
	"Why Did the Cow Cross the Road",
	"Why Did the Cow Cross the Road II",
	"Why Did the Cow Cross the Road III",
	"The Lost Cow",
	"Bovine Genomics",
	"Modern Art",
	"Fence Painting",
	"Speeding Ticket",
	"Contaminated Milk",
	"Promotion Counting",
	"Angry Cows",
	"Mowing the Field",
	"Milk Pails",
	"Circular Barn",
	"Load Balancing",
	"Diamond Collector",
	"Bull in a China Shop",
	"Field Reduction",
	"Blocked Billboard",
	"The Bovine Shuffle",
	"Milk Measurement",
	"Blocked Billboard II",
	"Lifeguards",
	"Out of Place",
	"Teleportation",
	"Hoofball",
	"Taming the Herd",
	"Team Tic Tac Toe",
	"Milking Order",
	"Family Tree",
	"Additional Practice Problems"
];

function requireModule(title: string) {
	const module = usacoBronzeOnDemandCourse.modules.find(
		candidate => candidate.title === title
	);
	if (!module) {
		throw new Error(`Expected USACO Bronze: On Demand module ${title}.`);
	}
	return module;
}

function moduleText(title: string) {
	const module = requireModule(title);
	return [...module.curriculum, ...module.supplementalProjects]
		.map(item => `${item.title}\n${item.content}`)
		.join("\n");
}

function courseText() {
	return usacoBronzeOnDemandCourse.modules
		.map(module => `${module.title}\n${moduleText(module.title)}`)
		.join("\n");
}

function resourceText() {
	return usacoBronzeOnDemandCourse.modules
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

describe("USACO Bronze: On Demand learner flow", () => {
	it("uses an eight-stage self-paced spine and five explicit appendices", () => {
		expect(
			usacoBronzeOnDemandCourse.modules
				.slice(0, 8)
				.map(module => module.title)
		).toEqual(EXPECTED_PRIMARY_SEQUENCE);
		expect(usacoBronzeOnDemandCourse.modules).toHaveLength(13);
		expect(
			usacoBronzeOnDemandCourse.modules.slice(8).map(module => ({
				kind: module.kind,
				title: module.title
			}))
		).toEqual([
			{
				kind: "appendix",
				title: "Optional Foundation Problem Archive"
			},
			{
				kind: "appendix",
				title: "Optional Classical Search and Simulation Archive"
			},
			{
				kind: "appendix",
				title: "Optional Modern Bronze Patterns Archive"
			},
			{
				kind: "appendix",
				title: "Optional Late Bronze Practice Archive"
			},
			{
				kind: "appendix",
				title: "Worked Traces"
			}
		]);
	});

	it("gives each required stage pacing, milestones, and explicit paths", () => {
		for (const module of usacoBronzeOnDemandCourse.modules.slice(0, 8)) {
			expect(module.estimatedTime, module.title).toMatch(/session/);
			expect(
				module.keyBlocks?.length,
				module.title
			).toBeGreaterThanOrEqual(5);
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

	it("preserves every historical topic while making the bank optional", () => {
		const text = courseText();
		const curriculumCount = usacoBronzeOnDemandCourse.modules.reduce(
			(total, module) => total + module.curriculum.length,
			0
		);
		const optionCount = usacoBronzeOnDemandCourse.modules.reduce(
			(total, module) => total + module.supplementalProjects.length,
			0
		);

		expect(curriculumCount).toBe(39);
		expect(optionCount).toBe(151);
		for (const topic of HISTORICAL_PROBLEM_TOPICS) {
			expect(text, topic).toContain(`Concepts: ${topic}`);
			expect(text, topic).toContain(`Practice Map: ${topic}`);
			expect(text, topic).toContain(`Extension Review: ${topic}`);
		}
		expect(moduleText("Optional Foundation Problem Archive")).toContain(
			"One careful attempt, postmortem, and later rewrite"
		);
		expect(moduleText("Optional Modern Bronze Patterns Archive")).toContain(
			"stage gate exposed a specific weakness"
		);
	});

	it("uses placement, a help ladder, spaced retries, and stage gates", () => {
		const setup = moduleText("UB0 On-Demand Setup, Rules, and Placement");
		const simulation = moduleText(
			"Stage 1: Simulation and Exact Translation"
		);
		const modern = moduleText(
			"Stage 5: Modern Bronze Patterns and Construction"
		);

		expect(setup).toContain("two-problem placement attempt");
		expect(setup).toContain("75-minute limit per problem");
		expect(setup).toContain("after at least two days");
		expect(setup).toContain("one diagnostic hint");
		expect(setup).toContain("later independent rewrite");
		expect(simulation).toContain("Stage 1 Mastery Gate");
		expect(modern).toContain("Stage 5 Mastery Gate");
		expect(modern).toContain(
			"repeat a related problem after at least two days"
		);
	});

	it("matches current I/O, scoring, pattern, and contest-integrity rules", () => {
		const text = courseText();
		const resources = resourceText();

		expect(text).toContain("three or four algorithmic problems");
		expect(text).toContain("four-to-five-hour personal window");
		expect(text).toContain("partial credit");
		expect(text).toContain(
			"Current problems use terminal-based standard input and output"
		);
		expect(text).toContain("before December 2020");
		expect(text).toContain("wrong answer");
		expect(text).toContain("time limit");
		expect(text).toContain("runtime or memory error");
		expect(text).toContain("one million values");
		expect(text).toContain("64-bit");
		expect(text).toContain("constructive outputs");
		expect(text).toContain("total-input bound");
		expect(text).toContain("Generative AI");
		expect(text).toContain("prewritten templates");
		expect(text).toContain("automated submissions");
		expect(resources).toContain("usaco.org/index.php?page=instructions");
		expect(resources).toContain("usaco.org/index.php?page=contests");
		expect(resources).toContain("usaco.org/index.php?page=viewproblem2");
		for (const repositoryPath of [
			"UB1-Square-Pasture",
			"UB6-Milking-Cows",
			"UB10-Transformations",
			"UB16-Wormholes",
			"UB50-Milking-Order",
			"UB51-Family-Tree"
		]) {
			expect(resources, repositoryPath).toContain(
				`USACO-Bronze/tree/main/${repositoryPath}/starter`
			);
			expect(resources, repositoryPath).toContain(
				`USACO-Bronze/tree/main/${repositoryPath}/solution`
			);
		}
	});

	it("ends with a protected mock, postmortem repair, and Silver gate", () => {
		const mock = moduleText(
			"Stage 6: Protected Mock Contest and Postmortem"
		);
		const exit = moduleText(
			"Stage 7: Bronze Exit Portfolio and Silver Readiness"
		);

		expect(mock).toContain("three unseen Bronze problems");
		expect(mock).toContain("no AI, hints, discussion, templates");
		expect(mock).toContain("smallest counterexample");
		expect(mock).toContain("clean rewrite from an empty file");
		expect(exit).toContain("two complete independent solves");
		expect(exit).toContain("each of two protected mocks");
		expect(exit).toContain("Promotion thresholds vary by contest");
		expect(exit).toContain("official live result remains authoritative");
	});
});
