import type { RawCourse } from "./types";
import reading from "../../assets/course-guides/rust-bounded-cli.md?raw";
import {
	rustBoundedCliItemIds,
	rustBoundedCliModuleId,
	rustBoundedCliPack,
	rustBoundedCliRevision
} from "../../modules/rustProjectResources";

const courseReading = reading.trim();
const activities = [
	{
		kind: "core",
		section: "curriculum",
		match: /Core Project:/,
		title: "File Parser Stages",
		path: "core",
		task: "Complete CORE and LIMITS in observations.md. Separate decoding, record validation, domain work and display while keeping the supplied byte, row and diagnostic contracts. Add an independent regression and explain the old/new boundaries."
	},
	{
		kind: "workflow",
		section: "supplementalProjects",
		match: /Secure CLI Audit Tool/,
		title: "Project: Bounded Fixture CLI",
		path: "core",
		task: "Continue the same saved project and complete WORKFLOW. Trace arguments, fixture name, bounded read, UTF-8, records, report and exit status. Predict exact-cap, over-cap, malformed and missing-file outcomes, verify no partial stdout after a valid first row and repeat after cargo clean."
	},
	{
		kind: "choice",
		section: "supplementalProjects",
		match: /Transfer Practice/,
		title: "Short Reads and Failure Reports",
		path: "choice",
		task: "Continue the saved project and complete CHOICE. Implement a different deterministic Read test double. Check short reads, the single overflow probe and private I/O diagnostics. Add a fixed-budget fictional byte corpus and separate the byte bound from execution time."
	},
	{
		kind: "challenge",
		section: "supplementalProjects",
		match: /Extension Practice/,
		title: "Path and Error Boundaries",
		path: "challenge",
		task: "Continue the saved project and complete CHALLENGE. Predict blank-row, CRLF, invalid UTF-8, ninth-row and not-regular fixture errors. Use copied fixtures or in-memory sources, verify one independent priority boundary and explain why static entry checks do not give race-free confinement."
	}
] as const;

export function applyRustBoundedCliCourseWorkflows(
	course: RawCourse,
	courseId: string
) {
	if (courseId !== "rust-systems-security") return;
	const module = course.modules.find(item => item.title.startsWith("RSS7 "));
	if (!module) return;
	module.id = rustBoundedCliModuleId;
	const concepts = module.curriculum.find(item =>
		item.title.endsWith("Core Concepts")
	);
	if (concepts) {
		concepts.content = courseReading.split("## Build and trace")[0].trim();
		concepts.preserveInstructions = true;
	}
	const review = module.curriculum.find(item =>
		item.title.startsWith("Verification Review:")
	);
	if (review) {
		review.content =
			"Verify separate argument, acquisition, decoding, record, domain and display stages. Check exactly 64 versus 65 bytes, eight versus nine rows, UTF-8 before record validation, first line/field errors, missing and non-regular fixtures, working-directory independence and stable 0/64/65/66/74 statuses. Inspect both streams and prove a later error produces no partial report. Use an independent short-read or failing Read source; repeat tests and builds after cargo clean. Explain the byte/time distinction and the assumptions needed by the static fixture boundary.";
		review.preserveInstructions = true;
	}

	for (const activity of activities) {
		const item = module[activity.section].find(candidate =>
			activity.match.test(candidate.title)
		);
		if (!item) continue;
		item.id = rustBoundedCliItemIds[activity.kind];
		item.title = activity.title;
		item.learningPath = activity.path;
		item.content = `${activity.task}\n\n${courseReading}`;
		item.preserveInstructions = true;
		const root = `https://github.com/instruction-material/Low-Level-Security/tree/${rustBoundedCliRevision}/${rustBoundedCliPack}`;
		item.projectLink = `${root}/starter`;
		item.solutionLink = `${root}/solution`;
		item.ideImport = true;
	}
}
