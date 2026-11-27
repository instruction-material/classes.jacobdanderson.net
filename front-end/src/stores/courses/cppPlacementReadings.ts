import type { RawCourseModule, RawCourseModuleItem } from "./types";

const placementReadings = {
	"c-level-1": {
		checks: {
			evidence:
				"Show the empty view, try the invalid removal, then show the empty view again. Explain how the second view proves that the stored data stayed the same.",
			miniBuild:
				"Search for `Blue Sky`, `A River`, and `Ocean`, then enter a blank line. Expect position 1, position 2, no match, and a rejected blank input respectively.",
			harness:
				"In the first run, the added text appears once at position 1. After the rejected removal, the list should still contain the same text at position 1.",
			review: "Try positions 0, 1, and 2 against a one-post list. Position 1 should succeed. Show that both invalid cases preserve the stored post."
		},
		progression:
			"Start with one file that reads input and reports a result. In Number Games, trace a loop and move a repeated calculation into a function. In Profile Posts, keep a list of posts in a class and reject invalid commands. Continue to Level 2 when a small multi-file program can be built and explained from a fresh folder.",
		representation:
			"Profile Posts stores an ordered sequence in a vector. With posts `First` and `Second`, the display shows positions 1 and 2, while the vector uses indexes 0 and 1. Validate the displayed position before subtracting 1. Position 0 is invalid even when the vector contains two posts.",
		boundary:
			"A function receiving `int total` works with its own copy. A function receiving `int& total` can change the caller's value. Starting from 7, add 3 through each parameter type in separate runs. The caller observes 7 after the copy and 10 after the reference call.",
		placement:
			"Predict three things before running a program: which branch handles a missing value, how many times a loop visits a four-item vector, and whether a function changes the caller's value. Revisit the relevant input, loop, or parameter-passing lesson when a prediction fails.",
		evidence:
			"Choose a completed project and show one input check, one traversal, and one helper call. For each, record the input, predicted output, and actual output. In Profile Posts, displaying an empty list should succeed, while removing position 1 should leave the list empty.",
		miniBuild:
			"Read a full-line search term and find it in an ordered vector of fictional book titles. Start with `Blue Sky` and `A River`. Report the one-based position of the first exact match. A blank line is invalid, and a missing title prints `No match`. Try `A River` and expect position 2.",
		focus: "Use a struct to hold a post's text and a class to keep the post list consistent. A small helper can translate a validated display position to an index. Keep input prompts out of the helper so the same rule can be checked with several inputs.",
		build: "A compiler checks the source and creates an executable. Rebuild after changing the source, then run the new executable. If a program declares a class in a header and defines its methods in a separate `.cpp` file, compile both implementation files together.",
		memory: "An object owns a vector stored as one of its fields. A reference parameter can read or change that existing field within a call. Use a const reference when the function only reads it. Try adding an item through the reference to see why const matters.",
		next: "Before starting [C++ Level 2](/courses#cpp-level-2), build and run a two-file class project and explain what changes when a vector is passed by value or by reference. In Level 2 the same distinction helps explain which object owns a buffer and which code only borrows it.",
		harness:
			"Write down the complete compile command for Profile Posts. From a fresh export, run a case that adds and displays one fictional post and a case that tries to remove display position 0. Keep both expected outputs. Rebuild and repeat the same two cases after making a small change.",
		review: "Mark the post list owned by a Profile object and the copied text supplied to an add operation. Explain how an invalid position leaves the vector unchanged. Extract one bounds check if two operations check the same range differently, then rerun the invalid-position case."
	},
	"cpp-level-2": {
		checks: {
			evidence:
				"After making the copy, change the first element in the original and check that the copy still holds the earlier value. Mark each independently owned buffer.",
			miniBuild:
				"Use the same buffer with lengths 1, 2, and 3 and expect sums 3, 10, and 19. The zero-length case must return without reading any element.",
			harness:
				"Name which allocation each live object owns after the copy. Save the original and copied values before mutation, then check that only the copy changes.",
			review: "For distinct source and destination objects that both contain data, show what happens to the destination's previous buffer and identify each surviving owner."
		},
		progression:
			"Trace a reference to a live object before walking an array with a pointer. Follow with a heap allocation, then a class that owns a matrix buffer. Compare the manual cleanup and copy-control rules with the final ownership reflection using standard-library types.",
		representation:
			"A rectangular matrix stored in one buffer maps row 1, column 2 of a two-by-three matrix to index 5. The multiplication uses the column count, so row 1 starts at index 3. Check both coordinates before computing the index. A row of 2 is already outside the matrix.",
		boundary:
			"A pointer into a buffer borrows an address. The buffer's owner controls its lifetime. Once an owning dynamic array reallocates, obtain a fresh pointer before reading the elements again. A pointer into the old allocation ends its useful lifetime even if its stored address still looks plausible.",
		placement:
			"Draw two matrices before and after copying the first into the second. After changing one element in the copy, the original should retain its value. If both change, check buffer ownership and the copy implementation before starting a larger design.",
		evidence:
			"Trace a small dynamic array through construction, growth, copy, and destruction. Write down the element count, capacity, and owner after each event. Include one empty array and one growth event, and explain what happens to any borrowed address at growth.",
		miniBuild:
			"Store values 3, 7, and 9 in a contiguous buffer and implement a read-only sum. Pass the buffer and length together. Test a zero-length range with expected sum 0 and the full range with expected sum 19. In the review, identify the code that owns the buffer and the read that borrows it.",
		focus: "Trace copy construction separately from copy assignment. The first creates an object with a new lifetime. The second updates an existing object that may already own storage. Both should leave independent owners. Test assignment to an object that already stores data.",
		build: "Use the ordinary and debug targets from Lifetime Tracing Warm-Up. Compare the named scores and alias relationships from both runs. Use the sanitizer build again after changing an owning class, and document the exact command and the action that first produced a diagnostic.",
		memory: "Pair each owned allocation with exactly one cleanup operation. In a class, put cleanup in the destructor and define the needed copy behavior together. In ordinary code, a vector can manage the buffer as a field and handle cleanup and independent copying through its own operations.",
		next: "Continue to [C++ Level 3](/courses#cpp-level-3) after explaining a deep copy, a borrowed range, and one invalid bound. Reproduce one case where a copy changes independently and one where a reference deliberately observes a change. These cases prepare for designing interfaces with clear ownership.",
		harness:
			"Choose a matrix or dynamic-array project. Keep commands for a warning-clean build and a debug build. Run a small normal case, a zero-size case, and a copy followed by mutation of the copy. Record the values observed in each owner and any debug diagnostic.",
		review: "Draw the constructor, copy, assignment, and destructor paths of the manual matrix class. Mark the expression that allocates storage and the object that frees it. Check how the drawing changes when a caller borrows one element and when an assignment replaces existing data."
	},
	"cpp-level-3": {
		checks: {
			evidence:
				"Replay the malformed input between two reads of the same state. Identify the point of rejection and verify that both reads produce the same result.",
			miniBuild:
				"Run `list` on an empty list, then try the four-command sample. Run `list` again after the rejected `add` and compare the order and count.",
			harness:
				"For each fixture, write the expected output and state. Preserve a rejection fixture followed by a read of the same state so any partial update is visible.",
			review: "Replay a valid change and an invalid change through both implementations. Verify equal state after the valid action and state preservation after the invalid action."
		},
		progression:
			"Begin with a reproducible multi-file build and a failing fixture. Practice separating row import from storage, then apply containers, templates, and resource-owning classes. In the final project, keep command parsing, state changes, and formatted output independently checkable.",
		representation:
			"A scanner can return tokens before a parser decides whether the sequence is legal. In a small task application, `add Read a book` has a command and a nonempty argument. `add` can be recognized as the same command but rejected for its missing argument before the task list changes.",
		boundary:
			"An interface can accept a const reference to read a record without taking ownership. When one service creates an owned implementation for another module, its type should make transfer clear. A container of values is a simpler choice when all records have the same concrete type.",
		placement:
			"Take one accepted command and one rejected command from a course project. Trace input handling, parsing, and any state change. A rejected command should preserve the previous state. If it changes state, move validation ahead of the command's mutation.",
		evidence:
			"Write a short map of one project from input to output. Include a parser boundary, an owner for persistent state, and a replayable malformed input. Record which file owns each responsibility and how to tell whether the previous state is preserved.",
		miniBuild:
			"Design a two-command tag list with `add TAG` and `list`. Store one tag per distinct name and display tags in sorted order. Starting empty, `add blue`, `add red`, `add blue`, and `list` should display blue and red once each. An empty `add` should leave the same two entries.",
		focus: "Keep the operations on a data type separate from the way commands are read. Use a template for a genuinely type-independent operation and an interface for behavior that can vary behind a stable contract. Compare the change needed to add a different record type with the change needed to add a different command implementation.",
		build: "Build the Build and Debug Checkpoint and run its `--check` command. The untouched starter builds but reports 140 for a fixture that expects 180. After tracing and repairing the calculation, run all seven checks so a fix for one input is checked against the other cases.",
		memory: "Use a value, vector, or other owning type to keep the lifetime of a resource attached to an object. Pass a reference only within the resource's valid lifetime. During a design review, name the owning object and the point at which the resource is released.",
		next: "Choose the next course from a demonstrated skill. An interest in deriving complexity and selecting data structures leads to [Data Structures and Algorithms in C++](/courses#data-structures-and-algorithms-in-cpp). An interest in substituting implementations behind a stable interface leads to [Design Patterns in C++](/courses#design-patterns-in-cpp).",
		harness:
			"Keep a fixture for a valid command, a malformed command, and a command that changes application state. Run the same sequence from a fresh build and compare outputs and final state. Add the smallest input that exposes a defect before changing its implementation.",
		review: "Trace a command from its parser to the object that owns application state. Show a test that substitutes a different output or storage component through the same contract. Verify that malformed input and existing saved records still follow the original contract after the substitution."
	}
} as const;

export function cppPlacementModules(courseId: string): RawCourseModule[] {
	if (!Object.hasOwn(placementReadings, courseId)) return [];

	const details =
		placementReadings[courseId as keyof typeof placementReadings];

	const matrixId = `${courseId}-c-levels-1-3-concept-matrix-and-placement`;
	const spineId = `${courseId}-modern-three-course-c-spine`;
	const reading = (
		title: string,
		content: string,
		id?: string
	): RawCourseModuleItem => ({
		title,
		content,
		id,
		contentKind: "reading",
		preserveInstructions: true
	});
	const assignment = (
		title: string,
		goal: string,
		checkpoints: string,
		id?: string
	): RawCourseModuleItem => ({
		title,
		id,
		content: `**Goal:** ${goal}\n\n**Checkpoints:** ${checkpoints}`,
		contentKind: "assignment",
		preserveInstructions: true
	});

	return [
		{
			kind: "appendix",
			title: "C++ Levels 1-3 Concept Matrix and Placement",
			curriculum: [
				reading("Baseline and Progression Matrix", details.progression),
				reading(
					"Representation by Example",
					details.representation,
					`${matrixId}-curriculum-cs235-cs236-concept-extraction`
				),
				reading(
					"Value and Lifetime Boundaries",
					details.boundary,
					`${matrixId}-curriculum-no-ai-ml-boundary`
				),
				reading("Placement Check", details.placement)
			],
			supplementalProjects: [
				assignment(
					"Matrix Project: Placement Evidence",
					details.evidence,
					details.checks.evidence
				),
				assignment(
					"Matrix Project: Input and Data Mini Build",
					details.miniBuild,
					details.checks.miniBuild,
					`${matrixId}-supplemental-matrix-project-cs235-cs236-inspired-mini-build`
				)
			]
		},
		{
			kind: "appendix",
			title: "Modern Three-Course C++ Spine",
			curriculum: [
				reading("Level-Specific Focus", details.focus),
				reading("Testing and Build Bar", details.build),
				reading(
					"Object Lifetimes and Ownership",
					details.memory,
					`${spineId}-curriculum-manual-memory-safety-rule`
				),
				reading("Branch Readiness", details.next)
			],
			supplementalProjects: [
				assignment(
					"C++ Spine Project: Build-Test Harness",
					details.harness,
					details.checks.harness
				),
				assignment(
					"C++ Spine Project: Ownership and Interface Review",
					details.review,
					details.checks.review
				)
			]
		}
	];
}
