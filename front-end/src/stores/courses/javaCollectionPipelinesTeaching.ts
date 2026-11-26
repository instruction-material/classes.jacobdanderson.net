import type { RawCourseModule, RawCourseModuleItem } from "./types";
import {
	javaCollectionPipelinesProjects,
	javaCollectionPipelinesURL
} from "@/modules/javaSearchResources";

const [repository, scheduler, registry, logs, csv, report] =
	javaCollectionPipelinesProjects;

function reading(title: string, content: string): RawCourseModuleItem {
	return {
		title,
		content,
		contentKind: "reading",
		preserveAssignment: true,
		preserveInstructions: true
	};
}

function project(
	entry: (typeof javaCollectionPipelinesProjects)[number],
	title: string,
	content: string,
	sourceFiles = "Main.java ContractTests.java"
): RawCourseModuleItem {
	return {
		id: entry.id,
		title,
		content: `${content}

Open the starter in the site IDE and confirm the import. Save and extract the project ZIP. From its folder, run javac --release 21 -Xlint:all -Werror ${sourceFiles}. Run java ContractTests for the checks and java Main for the example.`,
		contentKind: "assignment",
		ideImport: true,
		preserveAssignment: true,
		preserveInstructions: true,
		projectLink: javaCollectionPipelinesURL(entry.pack, "starter"),
		solutionLink: javaCollectionPipelinesURL(entry.pack, "solution")
	};
}

export function buildJavaCollectionsModule(): RawCourseModule {
	return {
		title: "AJ20 Generics, Interfaces, and Collection API Design",
		curriculum: [
			reading(
				"Generics as API Contracts",
				`Generics are API contracts for reusable, type-safe code. Repository<T extends Identified> can call id() on any accepted item. A Repository<CourseRecord> accepts course records and returns course records from lookups. A Repository<StudentRecord> uses the same operations with student records. Predict the compile result of adding a StudentRecord to a Repository<CourseRecord>.`
			),
			reading(
				"Interfaces, Comparators, and Collection Choices",
				`A Map provides lookup by key, a List retains a sequence, and a Set tests membership without duplicate values. A PriorityQueue offers new work and polls the next item under its comparator. Poll repeatedly to see the full order. A queue iterator shows the underlying heap traversal.

For two tasks with the same deadline, compare their IDs after comparing deadlines. A sorted copy is simple when all tasks are already available. A priority queue helps when tasks keep arriving between polls. Explain which operation each representation makes easy.`
			),
			reading(
				"Records as Immutable Data Carriers",
				`A record provides accessors, value equality, a hash code and a text representation. In CourseRecord, the compact constructor rejects a blank ID and a negative module count. Two records with the same component values compare equal. Try changing just the title and predict the comparison.

A final record component can still refer to a mutable object. If the component holds tags, copy them with List.copyOf at construction to preserve a snapshot. Trace what happens if the caller later modifies its original ArrayList.`
			),
			project(
				repository,
				"AJ20 Project 1: Generic Repository and Query Filters",
				`Complete findAll in Repository.java. Visit stored values in registration order, apply the supplied predicate and return an immutable snapshot. Implement sorted by copying the values and sorting the copy with the supplied comparator. The repository keeps one value per ID and its original order. Lookups and removals return an empty Optional for a missing ID.

The two repositories hold course records and sample enrollments. The included example finds Java Level 3 as the active large course and Ada’s enrollment with at least 12 completed modules. Take a snapshot, remove an item from the repository and check that the snapshot still contains it.`,
				"*.java"
			),
			project(
				scheduler,
				"AJ20 Project 2: Comparator-Driven Priority Scheduler",
				`Build comparators for earliest deadline, highest importance and shortest duration. Append task ID as the last tie-breaker when constructing the scheduler. Submit each task to the PriorityQueue and poll it until empty. Then compare the result with the supplied sorted-copy implementation. Keep the input list intact.

In the starter scenario A and B share a deadline, so deadline order is [A, B, C]. Importance gives [B, A, C] and duration gives [C, B, A]. Try a custom comparator that orders IDs in reverse. State why the queue's poll order can differ from its iteration order.`
			)
		],
		supplementalProjects: [
			project(
				registry,
				"AJ20 Project 3: Type-Safe Plugin Registry",
				`Implement a registry that stores named Plugin<T> values. Trim surrounding space from the name, reject an empty name and keep the first registration for each name. When running a plugin, find it in the map and call its typed method. Reject unknown names explicitly.

Use the four supplied string plugins to transform leaf. Upper gives LEAF, reverse gives fael and length gives 4. Add an integer registry with a doubling plugin. Verify that trailing spaces in a command name are accepted and a second trim registration leaves the original command available.`
			)
		]
	};
}

export function buildJavaPipelinesModule(): RawCourseModule {
	return {
		title: "AJ21 Streams, Files, and Data Pipelines",
		curriculum: [
			reading(
				"File-Backed Data Pipelines",
				`A file pipeline reads text, parses typed rows, records rejected lines and reports results. For the row oak,3,READY, the fields become an ID, an integer count and a status. For maple,-1,READY, the parser reports a negative count. Keep the original line numbers in the rejection list and the original file available for review.

If the input contains two rows for oak, compare their IDs after trimming. The first accepted row owns the ID, and the later occurrence becomes a rejection. Trace the accepted IDs after a failed row and after the next successful row.`
			),
			reading(
				"Lambdas, Streams, and Readable Transformations",
				`A predicate accepts or rejects one value. A mapping function transforms one value into another. A collector combines results. In the log workbook, Event::type maps each record to a category, then groupingBy counts records by category. Collect into a TreeMap so the report uses alphabetical order.

Trace two CHECKOUT events and one RETURN event through a loop with Map.merge and then through the stream. Both produce CHECKOUT=2 and RETURN=1. The loop can expose individual updates during debugging, and the stream states the transformation directly.`
			),
			project(
				logs,
				"AJ21 Project 1: Log Analyzer Pipeline",
				`Read events.txt as UTF-8 with the supplied reader. Implement parse for time, category and actor separated by vertical bars. Parse the time as a LocalTime and reject missing fields. Add a stream that counts events into a sorted map, and compare its result with the existing loop. The report includes chronological bounds and ranks equal frequencies alphabetically.

The sample has two CHECKOUT events and one RETURN. The bounds are 08:05 and 10:20 and the reader rejects lines 2 and 5. Keep the fixture alongside Main.java. Check an empty event list and a tie between two categories.`
			),
			project(
				csv,
				"AJ21 Project 2: CSV Import Validator",
				`Parse the three unquoted fields ID, count and status in records.csv. Count must be a nonnegative int and status must be READY or WAITING. Copy the existing rows into a map keyed by ID. Add each valid row only after checking the ID, and store each failure as a rejection with its one-based line number and reason.

The fixture accepts oak and cedar alongside the original existing ID. Lines 2, 3, 5 and 6 are rejected. Check that a duplicate of an existing ID cannot overwrite it and that a failure does not discard earlier accepted rows. Keep records.csv next to the Java files.`
			)
		],
		supplementalProjects: [
			project(
				report,
				"AJ21 Project 3: Report Builder Refactor",
				`Run the starter's java Main and save the original report. Extract parse for one name and quantity, aggregate for totals and a skipped-row count, and format for ordered output lines. Connect the three methods through report. Use long totals, ignore malformed rows and sort names alphabetically.

The sample prints elm=4, oak=5 and skipped=1. Each extracted stage has its own checks. Rebuild the report and compare each line with the saved original. Try replacing format with a version that prints a different separator and explain why only the presentation stage needs to change.`
			)
		]
	};
}
