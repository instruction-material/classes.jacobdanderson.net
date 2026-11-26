import type { RawCourseModule } from "./types";

interface PracticeCase {
	title: string;
	folder: string;
	task: string;
	check: string;
}

interface PracticeGuide {
	repository: string;
	revision: string;
	focus: string;
	checkpoints: string;
	rubric: string;
	capstone: string;
	cases: PracticeCase[];
}

const priorIds = [
	"command-line-task-tracker-with-file-persistence",
	"inventory-or-gradebook-using-stl-containers-and-serialization",
	"state-machine-text-adventure-or-vending-machine",
	"parser-for-a-small-config-format",
	"plugin-style-shape-game-or-entity-system-using-abstract-base-classes"
];

const guides: Partial<Record<string, PracticeGuide>> = {
	"c-level-1": {
		repository: "CPP-Level-1",
		revision: "770aa14c51891d73e4f5c960fa839f8bdf15b964",
		focus: "Practice loop boundaries, vector queries, independent objects, small records and nested iteration using complete examples.",
		checkpoints:
			"Run the worked example and record its output. Make one change in a separate practice copy, then compare a normal input and a boundary input. For the range exercise, test cases with several matches, no matches, and one endpoint that matches.",
		rubric: "Keep the small source change, build command, predictions and results. Name the value that changes on each iteration or state update. Explain how the result differs for an empty vector, a singleton range, or another boundary from the chosen exercise.",
		capstone:
			"For Profile Posts, verify one added post, an invalid selection that preserves the list, and a fresh start with fictional data. Explain which fields belong to Post and which collection belongs to Profile.",
		cases: [
			{
				title: "Count Matches in a Range",
				folder: "CPPF2-For-Loop-Practice",
				task: "After the original output, write a loop that counts multiples of three in an inclusive range. Use a separate count that starts at zero. Predict the final count before running.",
				check: "Check 2 through 10 for three matches, 4 through 5 for zero, and 6 through 6 for one. Explain what the variable counts and which test includes the upper endpoint."
			},
			{
				title: "Filter Scores in Their Original Order",
				folder: "CPPF5-Vectors-Reference",
				task: "Add a function that accepts a vector by const reference and returns scores at or above 90 in their original order. Work with the final four scores from the example.",
				check: "The vector 88, 95, 76, 95 gives 95, 95. An empty vector gives an empty result. Verify that the original values and size stay the same."
			},
			{
				title: "Move One Point and Compare Two Objects",
				folder: "CPPF4-Point-Class",
				task: "Create points at (0, 0) and (-1, 1) in the driver. Set the first point's y coordinate to 1 and use the getters to report whether the objects have equal y coordinates. Keep the header and source files separate.",
				check: "Before the update, the comparison is false. After the update, it is true and the points are still distinct because their x coordinates differ. Build with both implementation files."
			},
			{
				title: "Print a Record Through a Read-Only Helper",
				folder: "CPPF6-Structs-Example",
				task: "Write a function that takes a const Student reference and prints a short label using the existing name fields. Call it for two distinct fictional records. Keep record creation in the driver.",
				check: "Check that each label uses its own record's fields. Change one record in the driver, call the helper again for both, and verify that only one label changes."
			},
			{
				title: "Trace Totals in a Rectangular Grid",
				folder: "CPPF7-Grids-and-2D-Vectors-Reference",
				task: "Replace the demonstration grid in a practice copy with rows [1, 2, 3] and [4, -1, 0]. Add a separate column-total pass and use the number of columns for the inner bound.",
				check: "Row totals are 6 and 3. Column totals are 5, 1 and 3. Check a one-row grid and an empty grid. An empty grid has no totals and must not read row zero."
			}
		]
	},
	"cpp-level-2": {
		repository: "CPP-Level-2",
		revision: "a6aeab398adc05ec7a654301a2e055f6acfeadaa",
		focus: "Practice aliasing, logical lengths, valid pointer ranges, fixed layouts and lifetime on the course's working examples.",
		checkpoints:
			"Before changing an example, mark the owning object, each observer and each valid index or offset. Record which values change after a call. In a bounds exercise, test the empty range and the last valid element, and show where the read is prevented for an invalid range.",
		rubric: "Include the compiler command, the inputs, and the observed states or diagnostics. Explain which object owns the storage and when a borrowed access is valid. When a sanitizer run is available, identify the operations that run exercised.",
		capstone:
			"For a manual-memory capstone, identify the owner and release point for each allocation. Check one rejected operation and one copy or move case in the warning-clean and supported sanitizer builds.",
		cases: [
			{
				title: "Trace a Different Call Order",
				folder: "CPPM0-Lifetime-Tracing-Warm-Up/starter",
				task: "Move the reference update before the copy update in the ScoreCard example. Label the caller's object and the value parameter before making the change.",
				check: "Taylor reaches 80 after the reference update. The copy then reaches 90 while the caller remains at 80. Compare addresses within the same run and verify the debug build prints the same named scores."
			},
			{
				title: "Sum a Logical Prefix",
				folder: "CPPM2-Array-Basics-Reference",
				task: "Add a helper that receives the initialized array and a logical length. Sum only that many elements after the demonstration has written 0 through 9 into the array. Reject lengths outside 0 through 10 at the call boundary.",
				check: "Lengths 0, 3 and 10 produce 0, 3 and 45. Length 11 is rejected before the helper reads an element. Explain why the length argument is required."
			},
			{
				title: "Find a Value Within a Pointer Range",
				folder: "CPPM2-Pointer-Arithmetic-Reference",
				task: "Search the existing array of 20 initialized integers from its first element to its one-past boundary. Report the matching offset, or say no match. Test the boundary before reading through the current pointer.",
				check: "Seven is at offset 7 and 20 is absent. An empty range produces no match. Explain which two pointers can be subtracted to obtain the offset."
			},
			{
				title: "Compare Rows and Columns in Fixed Storage",
				folder: "CPPM3-Two-Dimensional-Arrays-Reference",
				task: "Use a separate 2-by-3 array initialized with rows [1, 2, 3] and [4, 5, 6]. Write a read-only column-total pass that keeps the actual row width in the function's parameter type.",
				check: "The three column totals are 5, 7 and 9. Compare the columns with row totals 6 and 15. Run the ordinary and sanitizer builds with both bounds visible."
			},
			{
				title: "Verify the Lifetime of an Allocated Value",
				folder: "CPPM4-Dynamic-Variables-Reference",
				task: "Add a temporary const int* observer of the existing integer owned by p1. Print the value through the observer while the integer is live, clear the observer and let the existing cleanup release the integer. Use the input value 7 in the ordinary and sanitizer builds.",
				check: "The observer reports 7 before cleanup. There is one release for that allocation. Record the input, the order of observation and release, and the sanitizer result."
			}
		]
	},
	"cpp-level-3": {
		repository: "CPP-Level-3",
		revision: "d2b1820f2c253e7c3e7a07f6c6daef38ed7a2952",
		focus: "Use completed base projects to practice persistence, rejected input, index consistency, file publication and command-state transitions.",
		checkpoints:
			"Begin with a working base project and an isolated copy of any input and output files. Record the accepted state before the variation. Check a successful update and a rejected input or command, then record the resulting state and any file changes that should survive a restart.",
		rubric: "Keep the build command, input or command transcript, exit status and observed state for each case. State where validation ends and an accepted update begins. When persistence is involved, compare the saved and restored results or check that rejected input leaves accepted bytes unchanged.",
		capstone:
			"For the saveable simulation, demonstrate a complete round trip and a rejected command from a documented phase. Use a fresh directory and show that rejected work preserves accepted state.",
		cases: [
			{
				title: "Test Task Ordering After Save and Reload",
				folder: "CPPI1-Saveable-Task-Manager/starter",
				task: "Complete or reopen the base Task Manager first. In a disposable data file, add three differently named tasks. Mark the middle task done, save explicitly, start a new process on that file and list the tasks.",
				check: "The same three tasks appear in their original stored order, with only the middle task done. Compare the pre-save and reloaded lists and identify which routine rebuilds the stored representation."
			},
			{
				title: "Compare Selective Import With Full Reload",
				folder: "CPPI1-Import-and-Reject-Bad-Rows/starter",
				task: "Complete or reopen the base project. From its fixtures, make a mixed import file with one accepted record and one invalid row. In a separate copy of the saved file, damage the last record and attempt reload.",
				check: "The import adds only its accepted row and reports the rejection. The reload preserves the accepted in-memory list when the damaged file is rejected. Retain both before-and-after lists and the two messages."
			},
			{
				title: "Check a Rejected Duplicate Across Inventory Views",
				folder: "CPPI3-Inventory-Indexer/starter",
				task: "After the base indexer works, insert two distinct records, then attempt to add a third with one existing ID and a different category. Query both the ID and both affected categories.",
				check: "Reject the new record, preserve the original ID lookup and leave category membership unchanged. Test this after a successful new insertion as well as against the existing sample inventory."
			},
			{
				title: "Preserve an Existing Report on Rejected Input",
				folder: "CPPI4-Resource-Safe-File-Processor/starter",
				task: "After the base processor works, generate a report from its supplied scores.tsv. Record the report bytes, then copy the input, add one invalid record at the end and run the processor against the same report path.",
				check: "The process reports failure and the old report bytes are identical. Correct the copied record and retry. Explain which operation transfers ownership of the finished report to its final path."
			},
			{
				title: "Verify Load Failure and Recovery in the Rover",
				folder: "CPPI6-Saveable-Command-Simulation/starter",
				task: "After the capstone works, save a valid running-phase snapshot. Make a malformed copy by changing an existing field to text outside its documented domain. Attempt to load the copy, then load the unchanged snapshot.",
				check: "The first load reports rejection while position and phase remain unchanged. The second restores the saved position and phase. Capture the state before each load and compare it to the observed result."
			}
		]
	}
};

export function cppPracticeGuide(
	courseId: string,
	label: string
): RawCourseModule | undefined {
	const guide = guides[courseId];
	if (!guide) return undefined;
	const source = `https://github.com/instruction-material/${guide.repository}/tree/${guide.revision}`;
	return {
		kind: "appendix",
		title: "Project Practice Guide",
		curriculum: [
			{
				title: `${label} Project Ladder`,
				content: guide.focus,
				contentKind: "reading"
			},
			{
				title: `${label} Checkpoints`,
				content: guide.checkpoints,
				contentKind: "reading"
			},
			{
				title: `${label} Rubric`,
				content: guide.rubric,
				contentKind: "reading"
			},
			{
				title: `${label} Capstone Gate`,
				content: guide.capstone,
				contentKind: "reading"
			}
		],
		supplementalProjects: guide.cases.map((exercise, index) => ({
			id: `${courseId}-project-practice-guide-supplemental-practice-project-${priorIds[index]}`,
			title: `Practice Project: ${exercise.title}`,
			projectLink: `${source}/${exercise.folder}`,
			solutionLink: exercise.folder.endsWith("/starter")
				? `${source}/${exercise.folder.replace(/\/starter$/, "/solution")}`
				: undefined,
			ideImport: true,
			learningPath: "choice",
			contentKind: "assignment",
			preserveInstructions: true,
			content: `${exercise.task}\n\n**Checkpoints:** ${exercise.check}`
		}))
	};
}
