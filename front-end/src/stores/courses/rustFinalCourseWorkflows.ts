import type { RawCourse } from "./types";
import boundaryReviewReading from "../../assets/course-guides/rust-boundary-review.md?raw";
import concurrencyReading from "../../assets/course-guides/rust-concurrency.md?raw";
import recordHardeningReading from "../../assets/course-guides/rust-record-hardening.md?raw";
import {
	rustBoundaryReviewItemIds,
	rustBoundaryReviewModuleId,
	rustBoundaryReviewPack,
	rustBoundaryReviewRevision,
	rustConcurrencyItemIds,
	rustConcurrencyModuleId,
	rustConcurrencyPack,
	rustConcurrencyRevision,
	rustRecordHardeningItemIds,
	rustRecordHardeningModuleId,
	rustRecordHardeningPack,
	rustRecordHardeningRevision
} from "../../modules/rustProjectResources";

const lessons = [
	{
		prefix: "RSS8 ",
		moduleId: rustConcurrencyModuleId,
		ids: rustConcurrencyItemIds,
		pack: rustConcurrencyPack,
		revision: rustConcurrencyRevision,
		reading: concurrencyReading.trim(),
		concepts: concurrencyReading.split("\n## ")[0].trim(),
		review: "Check owned work, unique IDs, u32 totals, the capacity-two channel, close/drain/drop order, cancellation and joining of every started worker. Distinguish the compound Mutex invariant from independent atomic updates and Send/Sync compiler refusals from logical correctness. The receive deadline is not a timed-join or whole-process guarantee. Compare valid, cap, failure and cancellation cases before inspecting results. Verify exactly-once IDs and totals on success, empty stdout with status 65 on semantic failure, and equal started/joined counts in the reference lifecycle evidence. Record actual command streams and compiler identity separately from predictions; explain why process success alone cannot establish these properties.",
		activities: [
			{
				kind: "core",
				section: "curriculum",
				match: "Core Project:",
				title: "Owned Work and Bounded Results",
				path: "core",
				task: "Complete CORE and LIMITS in observations.md. Replace the sequential baseline with two owned partitions and a capacity-two result channel. Keep the accepted IDs, values, error contract and coordinator-owned report; justify every ownership transfer."
			},
			{
				kind: "workflow",
				section: "supplementalProjects",
				match: "Threads and Channels Monitor",
				title: "Project: Joined Worker Lifecycles",
				path: "core",
				task: "Continue the same saved project and complete WORKFLOW. Predict empty, cap, injected failure and pre-cancelled cases, then account for received items, closed endpoints and every started/joined handle. Preserve typed failures and repeat the native checks after cargo clean."
			},
			{
				kind: "choice",
				section: "supplementalProjects",
				match: "Transfer Practice",
				title: "One Compound Ledger Invariant",
				path: "choice",
				task: "Continue the saved project and complete CHOICE. Inspect src/ledger.rs, preserve its values/count/total invariant under one Mutex guard and explain the atomic counterexample. Add one deterministic rejected update that leaves the complete snapshot unchanged."
			},
			{
				kind: "challenge",
				section: "supplementalProjects",
				match: "Extension Practice",
				title: "Send, Sync and Termination Evidence",
				path: "challenge",
				task: "Continue the saved project and complete CHALLENGE. Predict the Rc and Cell Send/Sync refusals, compile all four diagnostics separately and compare the accepted alternatives. Explain which observations support closure/join behavior and which scheduling, panic and host-failure claims remain unproven."
			}
		]
	},
	{
		prefix: "RSS9 ",
		moduleId: rustBoundaryReviewModuleId,
		ids: rustBoundaryReviewItemIds,
		pack: rustBoundaryReviewPack,
		revision: rustBoundaryReviewRevision,
		reading: boundaryReviewReading.trim(),
		concepts: boundaryReviewReading.split("\n## ")[0].trim(),
		review: "Inspect each unsafe operation, the zero-length/null rule, readable allocation, output alignment/disjointness, ownership, no-retention and unwind obligations. Verify status and output protocol checks separately from semantic equality. Compare the two E0133 refusals and read the exact recorded Miri trace with its source, compiler and stated limits. Predict empty, exact-cap and over-limit behavior before running either role. Compare successful checksums against the safe baseline and retain exact stdout, stderr and status. Identify a plausible in-range but incorrect backend result that protocol checks alone cannot reject. Review every allocation, borrow and output precondition before discussing the optional interpreter trace; a check after an invalid write cannot undo it.",
		activities: [
			{
				kind: "core",
				section: "curriculum",
				match: "Core Project:",
				title: "A Safe Contract and Unsafe Ledger",
				path: "core",
				task: "Complete CORE and LIMITS in observations.md. Retain the safe checksum baseline, define its eight-byte contract and audit every raw_sum obligation before changing the public checksum. Explain the named teaching need for the boundary and what the safe wrapper can validate."
			},
			{
				kind: "workflow",
				section: "supplementalProjects",
				match: "Unsafe and FFI Boundary Review",
				title: "Project: Checked Pointer and Status Boundary",
				path: "core",
				task: "Continue the same saved project and complete WORKFLOW. Implement the private checked bridge, distinct initialized output, status handling and safe public API. Record empty, valid, cap and over-limit streams/statuses and repeat after a clean rebuild."
			},
			{
				kind: "choice",
				section: "supplementalProjects",
				match: "Transfer Practice",
				title: "Protocol Checks and Semantic Equality",
				path: "choice",
				task: "Continue the saved project and complete CHOICE. Add one deterministic memory-safe private backend seam. Distinguish refusal, unknown status, missing output, impossible output and a plausible but incorrect checksum; compare against the independent safe baseline."
			},
			{
				kind: "challenge",
				section: "supplementalProjects",
				match: "Extension Practice",
				title: "Explicit Unsafe and Interpreter Evidence",
				path: "challenge",
				task: "Continue the saved project and complete CHALLENGE. Predict both E0133 refusals and compile their explicit alternatives. Read the supplied Miri trace or retain an actual bounded interpreter run with source/compiler identity; explain why this does not certify an arbitrary native pointer or foreign library."
			}
		]
	},
	{
		prefix: "RSS10 ",
		moduleId: rustRecordHardeningModuleId,
		ids: rustRecordHardeningItemIds,
		pack: rustRecordHardeningPack,
		revision: rustRecordHardeningRevision,
		reading: recordHardeningReading.trim(),
		concepts: `${recordHardeningReading
			.split("\n## ")[0]
			.trim()}\n\n## Concrete Rust contract\n${recordHardeningReading
			.split("\n## Concrete Rust contract\n")[1]
			.split("\n## ")[0]
			.trim()}`,
		review: "Preserve the original length/UTF-8/kind grammar and all eight supplied inputs. Check the 12-byte total bound, 1..10 label-byte range, exact consumption, typed refusal order and owned output after source mutation/drop. Inspect the completed threat model, before/after claim table, dependency/lock review, bounded corpus, reproducible outputs and residual-risk analysis. Predict [11] and a thirteen-byte record separately: declared label length and total input length have different precedence. Compare cat, three-byte Unicode and combined-fault runs across roles, recording both streams and status. Demonstrate that the successful label survives source mutation and drop. Keep the fixed corpus, bounded mutation experiment and recorded tool results as separate evidence with explicit limits.",
		activities: [
			{
				kind: "core",
				section: "curriculum",
				match: "Core Project:",
				title: "Typed Records and Owned Output",
				path: "core",
				task: "Complete the original-behavior, trust-boundary and redesign sections of observations.md. Preserve every valid record while replacing combined malformed refusals with the documented typed errors. Retain private fields, an owned label, exact consumption and deterministic error precedence."
			},
			{
				kind: "workflow",
				section: "supplementalProjects",
				match: "Project: Harden a Legacy Tool",
				title: "Project: Reproducible Hardening Evidence",
				path: "core",
				task: "Continue the same saved project and complete the before/after, reproduction and residual-risk packet. Classify all eight original inputs, record actual compiler/lock/check evidence and prepare the five-minute review. Justify why this single-record parser needs neither unsafe nor worker threads."
			},
			{
				kind: "choice",
				section: "supplementalProjects",
				match: "Transfer Practice",
				title: "Valid Grammar and Combined Faults",
				path: "choice",
				task: "Continue the saved project. Choose valid labels across all three kinds or a diagnostic-only byte formatter. Include exact bounds, three-byte Unicode, NUL-compatible grammar, source mutation/drop and one combined fault without changing the original parser contract."
			},
			{
				kind: "challenge",
				section: "supplementalProjects",
				match: "Extension Practice",
				title: "A Bounded Mutation and Claim Review",
				path: "challenge",
				task: "Continue the saved project and record a deterministic mutation experiment: at most 4096 cases, at most 13 bytes each, one process and a 30-second external timeout. Retain the case list, stop rule and cleanup; distinguish these observations from whole-program security claims."
			}
		]
	}
] as const;

export function applyRustFinalCourseWorkflows(
	course: RawCourse,
	courseId: string
) {
	if (courseId !== "rust-systems-security") return;
	for (const lesson of lessons) {
		const module = course.modules.find(item =>
			item.title.startsWith(lesson.prefix)
		);
		if (!module) continue;
		module.id = lesson.moduleId;
		const concepts = module.curriculum.find(item =>
			item.title.endsWith("Core Concepts")
		);
		if (concepts) {
			concepts.content = lesson.concepts;
			concepts.preserveInstructions = true;
		}
		const review = module.curriculum.find(item =>
			item.title.startsWith("Verification Review:")
		);
		if (review) {
			review.content = lesson.review;
			review.preserveInstructions = true;
		}
		for (const activity of lesson.activities) {
			const item = module[activity.section].find(candidate =>
				candidate.title.includes(activity.match)
			);
			if (!item) continue;
			item.id = lesson.ids[activity.kind];
			item.title = activity.title;
			item.learningPath = activity.path;
			item.content = `${activity.task}\n\n${lesson.reading}`;
			item.preserveInstructions = true;
			const root = `https://github.com/instruction-material/Low-Level-Security/tree/${lesson.revision}/${lesson.pack}`;
			item.projectLink = `${root}/starter`;
			item.solutionLink = `${root}/solution`;
			item.ideImport = true;
		}
	}
}
