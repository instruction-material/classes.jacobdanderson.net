import type { RawCourse } from "./types";
import reading from "../../assets/course-guides/rust-label-slices.md?raw";
import {
	rustLabelSlicesItemIds,
	rustLabelSlicesModuleId,
	rustLabelSlicesPack,
	rustLabelSlicesRevision
} from "../../modules/rustProjectResources";

// Preserve the imported source README; use neutral concise wording in the course.
const courseReading = reading.replace("one-byte byte slice", "one-byte slice");

const activities = [
	{
		kind: "core",
		section: "curriculum",
		match: /Core Project:/,
		title: "ASCII Packet Labels",
		path: "core",
		task: "Complete the original packet-42! ASCII label filter. Finish CORE, LABEL CASES, PREDICT, CHECKS and LIMITS. Replace the deliberately unfinished identity-baseline test with filter assertions; preserve allowed input and empty output, and test custom punctuation, Unicode and control cases."
	},
	{
		kind: "workflow",
		section: "supplementalProjects",
		match: /Slice and Bounds Workbench/,
		title: "Project: Checked Byte and String Windows",
		path: "core",
		task: "Continue the same saved project and complete WINDOWS. Refactor str_window and byte_window from owned copies into borrowed views. Preserve ordered errors and empty-window behavior. Add a new multibyte fixture, draw its byte offsets, and explain why an interior UTF-8 byte range can form bytes but cannot form str."
	},
	{
		kind: "choice",
		section: "supplementalProjects",
		match: /Transfer Practice/,
		title: "Scalar Positions and Combining Marks",
		path: "choice",
		task: "Continue the saved project and complete CHOICE. Replace char_window's temporary Vec<char> with a borrowed view using char_indices and the final byte boundary. Add a combining-mark test and explain why scalar positions still do not count displayed graphemes."
	},
	{
		kind: "challenge",
		section: "supplementalProjects",
		match: /Extension Practice/,
		title: "Index Refusals and Range Panics",
		path: "challenge",
		task: "Continue the saved project and complete CHALLENGE. Predict E0277, each deliberate panic with status 101, and every checked counterpart. Record actual stdout, stderr and status. Add an independent empty-boundary regression and explain returned errors versus compilation refusal versus a safe Rust process panic."
	}
] as const;

export function applyRustLabelSlicesCourseWorkflows(
	course: RawCourse,
	courseId: string
) {
	if (courseId !== "rust-systems-security") return;
	const module = course.modules.find(item => item.title.startsWith("RSS4 "));
	if (!module) return;
	module.id = rustLabelSlicesModuleId;
	const concepts = module.curriculum.find(item =>
		item.title.endsWith("Core Concepts")
	);
	if (concepts) {
		concepts.content = courseReading
			.split("## Build and observe")[0]
			.trim();
		concepts.preserveInstructions = true;
	}
	const review = module.curriculum.find(item =>
		item.title.startsWith("Verification Review:")
	);
	if (review) {
		review.content =
			"Verify packet-42! becomes packet-42 after the original filter is completed, while allowed labels and empty output stay valid. Compare byte range 1..5, interior byte range 2..3 and scalar range 1..2 on a\uD83E\uDD80bc. Check reversed, out-of-bounds, non-boundary and empty ranges independently, including an empty interval inside a multibyte scalar. Preserve each error class and distinguish combining marks from graphemes. After cargo clean, repeat the tests and compare stdout, stderr and status. Explain why matching printed text does not prove that a returned result borrows the input, and separate E0277 from deliberate status-101 panics and normal returned errors.";
		review.preserveInstructions = true;
	}

	for (const activity of activities) {
		const item = module[activity.section].find(candidate =>
			activity.match.test(candidate.title)
		);
		if (!item) continue;
		item.id = rustLabelSlicesItemIds[activity.kind];
		item.title = activity.title;
		item.learningPath = activity.path;
		item.content = `${activity.task}\n\n${courseReading.trim()}`;
		item.preserveInstructions = true;
		const root = `https://github.com/instruction-material/Low-Level-Security/tree/${rustLabelSlicesRevision}/${rustLabelSlicesPack}`;
		item.projectLink = `${root}/starter`;
		item.solutionLink = `${root}/solution`;
		item.ideImport = true;
	}
}
