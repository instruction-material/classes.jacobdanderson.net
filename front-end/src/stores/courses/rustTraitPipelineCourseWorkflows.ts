import type { RawCourse } from "./types";
import reading from "../../assets/course-guides/rust-trait-pipeline.md?raw";
import {
	rustTraitPipelineItemIds,
	rustTraitPipelineModuleId,
	rustTraitPipelinePack,
	rustTraitPipelineRevision
} from "../../modules/rustProjectResources";

const courseReading = `## Trait and iterator syntax

The supplied trait declares the method every row source must provide:

\`\`\`rust
pub trait RowSource {
    fn rows(&self) -> impl Iterator<Item = &str>;
}
\`\`\`

\`&self\` borrows the source. \`Iterator<Item = &str>\` means each yielded
item is a borrowed string slice, and \`impl Iterator\` lets each implementation
choose its iterator type. These slices cannot outlive the source borrow.
A generic bound such as \`S: RowSource\` lets a consumer accept any source
type that implements this trait; the bound does not transfer ownership.

Iterator adapters such as \`map\` and \`enumerate\` are lazy: they prepare work
that runs when a consumer requests rows. \`enumerate\` supplies zero-based
positions, so add one for this project's source-row errors. \`try_fold\`
updates an accumulator while each step returns \`Ok\` and stops on the first
\`Err\`. Collecting a \`Vec<Result<_, _>>\` instead keeps every row outcome.
The supplied pull counter also shows why \`&self\` alone does not promise
that observing a source has no side effects.

${reading.trim()}`;

const activities = [
	{
		kind: "core",
		section: "curriculum",
		match: /Core Project:/,
		title: "Generic Record Sources",
		path: "core",
		task: "Complete CORE and LIMITS in observations.md. Refactor the concrete audit consumer to accept a generic RowSource and return borrowed labels. Preserve parsing, source order, duplicates and totals. Demonstrate a different local in-memory source, record the old/new signatures and add an independent regression."
	},
	{
		kind: "workflow",
		section: "supplementalProjects",
		match: /Trait-Based Validation Pipeline/,
		title: "Project: Lazy Validation Pipeline",
		path: "core",
		task: "Continue the same saved project and complete WORKFLOW. Replace eager collection with fallible iterator work using try_fold. Predict and measure pulls for an invalid middle row, verify no later row is requested and retain the first one-based error. Explain why no partial Report escapes while earlier source observations remain."
	},
	{
		kind: "choice",
		section: "supplementalProjects",
		match: /Transfer Practice/,
		title: "Every Row Outcome",
		path: "choice",
		task: "Continue the saved project and complete CHOICE. Refactor all_records into a generic borrowing consumer. Preserve one Result per row, errors, source order and original indices. Test errors around a valid row using another deterministic source; compare Vec<Result<...>> with Result<Vec<...>> and explain why discarding errors changes the API."
	},
	{
		kind: "challenge",
		section: "supplementalProjects",
		match: /Extension Practice/,
		title: "Trait and Borrowing Diagnostics",
		path: "challenge",
		task: "Continue the saved project and complete CHALLENGE. Compile the five diagnostics against the selected role's actual library. Record E0046, E0502, the starter-only E0308 and reference-only E0505, plus each working result. Add an independent mutation/last-use case and separate compiler contracts from runtime data errors."
	}
] as const;

export function applyRustTraitPipelineCourseWorkflows(
	course: RawCourse,
	courseId: string
) {
	if (courseId !== "rust-systems-security") return;
	const module = course.modules.find(item => item.title.startsWith("RSS6 "));
	if (!module) return;
	module.id = rustTraitPipelineModuleId;
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
			"Verify a generic data-only RowSource consumer with independent MemoryRows and borrowed-slice sources. Compare concrete owned/eager and generic borrowed/lazy signatures; preserve duplicates, source order, parser error priority and one-based indices. Check empty input, a middle failure and all-outcomes consumption with actual pull counts. Preserve every Result in all_records and explain why filter_map or collecting a Result<Vec<_>, _> changes its contract. Build the selected library and record all five diagnostic outcomes, then cargo clean and repeat tests. Distinguish compiler type/lifetime checks from finiteness, ordering, business rules and production resource policy.";
		review.preserveInstructions = true;
	}

	for (const activity of activities) {
		const item = module[activity.section].find(candidate =>
			activity.match.test(candidate.title)
		);
		if (!item) continue;
		item.id = rustTraitPipelineItemIds[activity.kind];
		item.title = activity.title;
		item.learningPath = activity.path;
		item.content = `${activity.task}\n\n${courseReading}`;
		item.preserveInstructions = true;
		const root = `https://github.com/instruction-material/Low-Level-Security/tree/${rustTraitPipelineRevision}/${rustTraitPipelinePack}`;
		item.projectLink = `${root}/starter`;
		item.solutionLink = `${root}/solution`;
		item.ideImport = true;
	}
}
