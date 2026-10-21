import type { RawCourse } from "./types";
import reading from "../../assets/course-guides/rust-cargo-tooling.md?raw";
import {
	rustCargoItemIds,
	rustCargoModuleId,
	rustCargoPack,
	rustCargoRevision
} from "../../modules/rustProjectResources";

const activities = [
	{
		kind: "core",
		section: "curriculum",
		match: /Core Project:/,

		title: "Cargo Toolchain Baseline",
		path: "core",

		task: "Complete BASELINE, PREDICT, CHECKS and LIMITS in observations.md. Record the actual compiler, Cargo, formatting, lint, test and program results before comparing them with the reference."
	},
	{
		kind: "workflow",
		section: "supplementalProjects",
		match: /First Cargo Audit CLI/,

		title: "Project: First Cargo Workflow Audit",
		path: "core",

		task: "Continue the Cargo baseline in the same saved project. Complete CLEAN and COMPARE: preserve a formatting refusal and repair, rebuild after cargo clean, compare lockfile bytes and explain the supplied stale C executable case."
	},
	{
		kind: "choice",
		section: "supplementalProjects",
		match: /Transfer Practice/,

		title: "Label Input Boundary Cases",
		path: "choice",

		task: "Continue the saved baseline with the choice activity. Predict the four specified boundary inputs, add one named unit test, repeat the checks and record which property that assertion covers."
	},
	{
		kind: "challenge",
		section: "supplementalProjects",
		match: /Extension Practice/,

		title: "Moved Values and Compiler Diagnostics",
		path: "challenge",

		task: "Continue the saved baseline with the diagnostic challenge. Predict both compilations, capture the actual E0382 refusal and corrected run, and explain ownership, borrowing and why the rejected program has no runtime trace."
	}
] as const;

export function applyRustCargoCourseWorkflows(
	course: RawCourse,
	courseId: string
) {
	if (courseId !== "rust-systems-security") return;
	const module = course.modules.find(item => item.title.startsWith("RSS0 "));
	if (!module) return;
	module.id = rustCargoModuleId;
	for (const activity of activities) {
		const item = module[activity.section].find(candidate =>
			activity.match.test(candidate.title)
		);
		if (!item) continue;
		item.id = rustCargoItemIds[activity.kind];
		item.title = activity.title;
		item.learningPath = activity.path;
		item.content = `${activity.task}\n\n${reading.trim()}`;
		item.preserveInstructions = true;
		const root = `https://github.com/instruction-material/Low-Level-Security/tree/${rustCargoRevision}/${rustCargoPack}`;
		item.projectLink = `${root}/starter`;
		item.solutionLink = `${root}/solution`;
		item.ideImport = true;
	}
}
