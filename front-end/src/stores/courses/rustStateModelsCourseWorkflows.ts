import type { RawCourse } from "./types";
import reading from "../../assets/course-guides/rust-state-models.md?raw";
import {
	rustStateModelsItemIds,
	rustStateModelsModuleId,
	rustStateModelsPack,
	rustStateModelsRevision
} from "../../modules/rustProjectResources";

const activities = [
	{
		kind: "core",
		section: "curriculum",
		match: /Core Project:/,
		title: "Review States and Invariants",
		path: "core",
		task: "Complete CORE and LIMITS in observations.md. Enumerate the eight legacy shapes and all nine phase/event pairs. Refactor the public flags into a private payload enum while preserving error priority, valid round trips and unchanged state on error. Add an independent reviewer and transition regression."
	},
	{
		kind: "workflow",
		section: "supplementalProjects",
		match: /State Machine Refactor/,
		title: "Project: Validated Legacy Transitions",
		path: "core",
		task: "Continue the same saved project and complete WORKFLOW. Audit from_legacy and snapshot, including missing or stale reviewer data and an inconsistent shape containing an invalid name. Verify Reset clears its reviewer before re-review. Explain why external legacy data still needs validation after the enum refactor."
	},
	{
		kind: "choice",
		section: "supplementalProjects",
		match: /Transfer Practice/,
		title: "Unicode Reviewer Names",
		path: "choice",
		task: "Continue the saved project and complete CHOICE. Replace the starter's byte budget with the 32-scalar policy. Compare ASCII, é, emoji and combining marks; test 32 versus 33 scalars, empty names, controls, surrounding whitespace and the reserved dash. Add independent boundary cases and distinguish scalars from displayed characters."
	},
	{
		kind: "challenge",
		section: "supplementalProjects",
		match: /Extension Practice/,
		title: "Compiler Contracts and State Refusals",
		path: "challenge",
		task: "Continue the saved project and complete CHALLENGE. Compile all three diagnostics against the selected role's actual library. Predict E0004 for the omitted Published match and E0560 for raw flags against the reference. Record stdout, stderr and status for the exhaustive match and starter's returned error. Separate representation restrictions from runtime transition rules."
	}
] as const;

export function applyRustStateModelsCourseWorkflows(
	course: RawCourse,
	courseId: string
) {
	if (courseId !== "rust-systems-security") return;
	const module = course.modules.find(item => item.title.startsWith("RSS5 "));
	if (!module) return;
	module.id = rustStateModelsModuleId;
	const concepts = module.curriculum.find(item =>
		item.title.endsWith("Core Concepts")
	);
	if (concepts) {
		concepts.content = reading.split("## Build and observe")[0].trim();
		concepts.preserveInstructions = true;
	}
	const review = module.curriculum.find(item =>
		item.title.startsWith("Verification Review:")
	);
	if (review) {
		review.content =
			"Verify all eight legacy shapes and all nine phase/event pairs, unchanged state on errors, valid snapshot round trips and Reset removing stale reviewer data. Check shape errors before invalid names and already-reviewed/already-published before name validation. Compare the starter's byte budget with the reference's 32-scalar policy. Distinguish malformed syntax returning 64 before any events from semantic errors returning 65 after possible earlier progress. Build the selected library, compare E0004 and E0560 with the exhaustive and raw-flags diagnostics, then cargo clean and repeat the tests. Explain representation guarantees separately from business rules and actual authorization.";
		review.preserveInstructions = true;
	}

	for (const activity of activities) {
		const item = module[activity.section].find(candidate =>
			activity.match.test(candidate.title)
		);
		if (!item) continue;
		item.id = rustStateModelsItemIds[activity.kind];
		item.title = activity.title;
		item.learningPath = activity.path;
		item.content = `${activity.task}\n\n${reading.trim()}`;
		item.preserveInstructions = true;
		const root = `https://github.com/instruction-material/Low-Level-Security/tree/${rustStateModelsRevision}/${rustStateModelsPack}`;
		item.projectLink = `${root}/starter`;
		item.solutionLink = `${root}/solution`;
		item.ideImport = true;
	}
}
