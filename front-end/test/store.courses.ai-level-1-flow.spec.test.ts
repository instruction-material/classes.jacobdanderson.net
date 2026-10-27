import { describe, expect, it } from "vitest";
import { aiLevel1Course } from "@/stores/courses/ai-level-1";
import { loadRawCourse } from "@/stores/courses/index";

const EXPECTED_TEACHING_MODULES = [
	"FAI0 Setup and Tooling",
	"Unit 1: AI Landscape and State Representation",
	"Unit 2: Stacks, Queues, and Traversal Intuition",
	"Unit 3: DFS, BFS, and Reachability",
	"AI Search Lab 13: Practice Studio",
	"Unit 4: Informed and Bounded Search",
	"AI Search Lab 14: Practice Studio",
	"AI Search Lab 15: Practice Studio",
	"AI Search Lab 16: Practice Studio",
	"Unit 5: Rule-Based Systems and Puzzle Framing",
	"Unit 6: Heuristics and Game AI",
	"AI Search Lab 17: Practice Studio",
	"Unbeatable TicTacToe AI 1: Practice Studio",
	"The Marble Game AI: Practice Studio",
	"Unit 7: Features, Evaluation, and Responsible AI",
	"Unit 8: Capstone and Portfolio Build"
];

function teachingModules() {
	return aiLevel1Course.modules.filter(module => module.kind !== "appendix");
}

function requireSourceModule(title: string) {
	const module = aiLevel1Course.modules.find(
		candidate => candidate.title === title
	);
	if (!module) throw new Error(`Expected AI Level 1 module ${title}.`);
	return module;
}

describe("AI Level 1 learner flow", () => {
	it("keeps introductory search readings free of model-analysis boilerplate", async () => {
		const course = (await loadRawCourse("ai-level-1"))!;
		for (const title of [
			"Bridge Positioning between Core Python and ML",
			"How to Read an AI Problem Statement"
		]) {
			const authored = aiLevel1Course.modules[0].curriculum.find(
				item => item.title === title
			)!;
			const displayed = course.modules[0].curriculum.find(
				item => item.title === title
			)!;
			expect(displayed.content, title).toBe(authored.content);
			expect(displayed.content, title).not.toContain(
				"dataset assumptions"
			);
		}
	});

	it("provides a reproducible local setup with an observable result", async () => {
		const course = await loadRawCourse("ai-level-1");
		const reading = course!.modules
			.flatMap(module => module.curriculum)
			.find(
				item =>
					item.title ===
					"Python Environment for Search and Graph Labs"
			);
		expect(reading?.content).toContain("python3 -m venv .venv");
		expect(reading?.content).toContain("py -3 -m venv .venv");
		expect(reading?.content).toContain(
			"python -m pip install networkx matplotlib jupyterlab"
		);
		expect(reading?.content).toContain("nx.shortest_path(graph, 0, 2)");
		expect(reading?.content).toContain("[0, 1, 2]");
		expect(reading?.content).toContain("`graph-check.png`");
		expect(reading?.content).toContain("sys.executable");
		expect(reading?.content).not.toContain("analysis uses clear structure");
	});

	it("places search and game studios beside their prerequisite units", () => {
		expect(teachingModules().map(module => module.title)).toEqual(
			EXPECTED_TEACHING_MODULES
		);
		expect(
			EXPECTED_TEACHING_MODULES.indexOf(
				"AI Search Lab 13: Practice Studio"
			)
		).toBe(
			EXPECTED_TEACHING_MODULES.indexOf(
				"Unit 3: DFS, BFS, and Reachability"
			) + 1
		);
		expect(
			EXPECTED_TEACHING_MODULES.indexOf(
				"Unit 7: Features, Evaluation, and Responsible AI"
			)
		).toBeGreaterThan(
			EXPECTED_TEACHING_MODULES.indexOf(
				"The Marble Game AI: Practice Studio"
			)
		);
	});

	it("gives every teaching module pacing, trace targets, and explicit paths", () => {
		for (const module of teachingModules()) {
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

	it("retains the authored work while separating enrichment", () => {
		const modules = teachingModules();
		expect(
			modules.reduce(
				(total, module) => total + module.curriculum.length,
				0
			)
		).toBe(73);
		expect(
			modules.reduce(
				(total, module) => total + module.supplementalProjects.length,
				0
			)
		).toBe(56);
		expect(
			requireSourceModule(
				"Unit 6: Heuristics and Game AI"
			).supplementalProjects.find(
				item => item.title === "Project: Unbeatable Tic-Tac-Toe AI"
			)?.learningPath
		).toBe("challenge");
		expect(
			requireSourceModule(
				"AI Search Lab 15: Practice Studio"
			).supplementalProjects.find(
				item => item.title === "Transfer Practice: AI Search Lab 15"
			)?.learningPath
		).toBe("choice");
	});

	it("turns the repository variant bank into an optional appendix", () => {
		const bank = requireSourceModule(
			"Unit 9: Repo Extension Bank and Canonical Variants"
		);
		expect(bank.kind).toBe("appendix");
		expect(bank.estimatedTime).toBeUndefined();
		expect(bank.keyBlocks).toBeUndefined();
		expect(bank.curriculum[0]?.content).toContain(
			"**Optional reference bank:**"
		);
		expect(
			[...bank.curriculum, ...bank.supplementalProjects].every(item =>
				["choice", "challenge"].includes(item.learningPath ?? "")
			)
		).toBe(true);
	});

	it("stages capstone work from a baseline through stress testing", () => {
		const capstone = requireSourceModule(
			"Unit 8: Capstone and Portfolio Build"
		);
		expect(capstone.curriculum[0]?.content).toContain(
			"minimum working baseline"
		);
		expect(capstone.keyBlocks).toContain("stress test");
		expect(capstone.keyBlocks).toContain("portfolio explanation");
	});

	it("keeps pending media bookkeeping out of the normalized learner flow", async () => {
		const course = await loadRawCourse("ai-level-1");
		expect(course).not.toBeNull();

		const text = JSON.stringify(
			course!.modules.filter(module => module.kind !== "appendix")
		);
		expect(text).not.toContain("AI Foundations Media Status");
		expect(text).not.toContain("fai1_project_1.mp4");
		expect(text).not.toContain("fai3_1.png");
		expect(
			course!.modules.find(
				module => module.title === "Pending Static Assets"
			)
		).toBeUndefined();
		const inventory = course!.modules.find(
			module => module.title === "Pending Source Media Inventory"
		);
		expect(inventory?.kind).toBe("appendix");
		expect(inventory?.curriculum[0]?.content).toContain(
			"fai1_project_1.mp4"
		);
	});
});
