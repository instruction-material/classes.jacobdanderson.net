const level1Start =
	"/courses#c-level-1-cppf1-variables-types-strings-and-input-output";
const level2Start =
	"/courses#cpp-level-2-cppm0-lifetime-references-and-ownership-framing";
const level3Start =
	"/courses#cpp-level-3-cppi0-bridge-course-setup-and-positioning";

const level1Readiness =
	"/courses#c-level-1-cppf1-variables-types-strings-and-input-output-c-level-1-cppf1-variables-types-strings-and-input-output-curriculum-c-20-toolchain-and-input-readiness-check";
const level2Readiness =
	"/courses#cpp-level-2-cppm0-lifetime-references-and-ownership-framing-cpp-level-2-cppm0-lifetime-references-and-ownership-framing-curriculum-cppm0-project-0-c-20-memory-diagnostics-readiness-check";
const level3Checkpoint =
	"/courses#cpp-level-3-cppi0-bridge-course-setup-and-positioning-cpp-level-3-cppi0-bridge-course-setup-and-positioning-curriculum-cppi0-project-build-and-debug-checkpoint";

export const cppCourseGuideReadings = {
	"c-level-1": {
		"C++ Level 1 Reference Guide": `Use the input lesson in [CPPF1](${level1Start}) to compare reading a number, one word, and a full line. Use the [C++ Core Guidelines](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#s-functions) as an optional reference when splitting a longer program into functions. The project brief supplies the exact behavior and examples to check.`,
		"C++ Level 1 Core Skills":
			"Read a console input, select a branch and trace a loop from its initial value through its stopping condition. Give a calculation a named function and return its result. Use a class for state with rules, a struct for a small record, and a vector for a changing sequence. In a nested vector, identify the row and column before accessing a cell.",
		"C++ Level 1 Next Topics": `Extend Profile Posts with a second list operation that uses the existing model. Try it on an empty list and on a list with two posts. Then trace a function that accepts a const reference to that list. The list remains owned by its caller, which leads into the lifetime questions in [C++ Level 2](${level2Start}).`,
		"C++ Level 1 Boundaries":
			"Profile Posts practices ordinary instance state and commands with standard strings and vectors. The collection manages its storage. Level 2 uses a related problem to examine explicit storage, copying, and destruction after the Level 1 behavior is familiar.",
		"C++ Level 1 Prerequisite Check": `Begin with the toolchain and input readiness check in [CPPF1](${level1Readiness}). Run the same small program once with valid input and once with invalid input. Predict which messages come from the compiler and which come from the running program. Record the two outcomes before proceeding to the console projects.`,
		"C++ Level 1 Pathway Map":
			"Console input and variables → branches and loops → reusable functions → classes, vectors and records → grid traversal → Profile Posts. The capstone combines the command logic from the early console projects with the class and collection behavior from the middle modules.",
		"C++ Level 1 Follow-Up Path": `Continue to [C++ Level 2](${level2Start}) when a Profile Posts run can be explained from input through command selection and list update. Begin by tracing where each object lives and what happens when a copy or a reference crosses a function boundary.`,
		"C++ Level 1 Resource Map":
			"Open the starter on each project card. Use the complete worked examples beside the readings to trace program flow. The course IDE edits, saves, and exports the files. Follow the toolchain appendix and each pack's build instructions to compile the exported files with a native C++20 compiler.",
		"C++ Level 1 Module Alignment Guide":
			"Use a missing or malformed input for CPPF1, a stopping condition for CPPF2, and an argument and return value for CPPF3. For CPPF4–6, explain which object or record changes and which values stay the same. For CPPF7, trace a rectangular grid. For CPPF8, show a sequence of commands, including an invalid command, and the resulting post list.",
		"C++ Level 1 Reference Map":
			"Use the [C++ Level 1 source repository](https://github.com/instruction-material/CPP-Level-1) to browse project files outside the IDE. The lesson's source button identifies the pack for that assignment. Copy a known input from its brief and compare outputs before adding a new case.",
		"C++ Level 1 Prerequisite Map":
			"Functions and loops come before vector processing. Vector indexing comes before nested vector traversal. Classes and record fields come before Profile Posts. If a capstone trace loses track of the list or object, reopen the corresponding collection or class project and test one operation in isolation.",
		"C++ Level 1 Resource Inventory":
			"For a project run, keep its saved source, the exported package, the compiler command, and an input/output pair that can be repeated. In Profile Posts, include the command sequence and final list so the behavior can be checked without reconstructing the editor session."
	},
	"cpp-level-2": {
		"C++ Level 2 Reference Guide":
			"The [C++ Core Guidelines](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#s-resource) explain the distinction between owning resources and borrowing access. In CPPM0 and CPPM1, label the owner before tracing a reference or pointer. In CPPM4, compare the manual array class with the default operations of a class that stores a vector.",
		"C++ Level 2 Core Skills":
			"Trace how a reference or pointer reaches a live value. Pass a raw array with its logical size, validate an offset before use, and keep row and column bounds separate. For a class that owns dynamic storage, explain allocation, deep copy, move, self-assignment and destruction using a repeatable test.",
		"C++ Level 2 Next Topics": `Compare the manual Dynamic Array with vector-backed storage before moving to [C++ Level 3](${level3Start}). Identify which checks still belong to the application after storage becomes automatic. The same distinction is useful when the Level 3 file processor owns a stream and validates records separately.`,
		"C++ Level 2 Boundaries":
			"The manual array and Profile Posts expose lifetime obligations directly in small C++20 projects. Keep allocation inside the owning class and explain every borrowed access. Use the Modern Ownership Reflection to compare that teaching design with resource-managing standard-library types.",
		"C++ Level 2 Prerequisite Check": `From Level 1, trace a function call with one value parameter and one reference parameter. Predict which caller value changes. In the [Memory Diagnostics Readiness Check](${level2Readiness}), build with warnings, run the supplied diagnostics commands, and record which cases they exercise.`,
		"C++ Level 2 Pathway Map":
			"Lifetimes and references → non-owning pointers → raw arrays and bounds → rectangular arrays → allocation and copy control → Profile Posts ownership. The pointer-error lab, Tic Tac Toe, bank transactions, and matrix class offer extra applications of their own modules.",
		"C++ Level 2 Follow-Up Path": `Continue to [C++ Level 3](${level3Start}) after explaining who owns the Profile Posts buffer and demonstrating that a deep copy survives changes to the original. The next course puts storage, commands, and file handling into separate components with explicit contracts.`,
		"C++ Level 2 Resource Map": `Use the worked pointer and array examples for traces and each project card for the matching starter. Export the saved attempt to compile locally with C++20. Use the supported sanitizer setup in [CPPM0](${level2Start}) for the ownership and bounds checks.`,
		"C++ Level 2 Module Alignment Guide":
			"CPPM0–1 record which variables an alias can change. CPPM2–3 compare bounds, including zero length or a non-square grid. CPPM4 records what happens when the array grows, is copied, is moved, or is assigned to itself. CPPM5 repeats the ownership cases through the public Profile Posts operations.",
		"C++ Level 2 Reference Map":
			"The [C++ Level 2 source repository](https://github.com/instruction-material/CPP-Level-2) contains the per-project README files and test commands. Prefer the pack linked by the assignment. An original reference program is a comparison after completing the associated trace or build.",
		"C++ Level 2 Prerequisite Map":
			"Follow the alias trace before reasoning about pointer arithmetic. Trace one contiguous array before comparing the representations of a rectangle. Complete the copy-control exercise before relying on a manual owner inside Profile Posts.",
		"C++ Level 2 Resource Inventory":
			"Keep the exact source files and compiler flags for the run, the input or harness, the expected and observed state, and the diagnostic for any rejected case. For an ownership check, identify which operations were exercised by the sanitizer output."
	},
	"cpp-level-3": {
		"C++ Level 3 Reference Guide":
			"Use the [C++ Core Guidelines](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#s-resource) when identifying file handles and other resources that need scoped owners. Compare the build and debug checkpoint with the rover pack to see how the same compiler requirements apply as source files and interfaces grow.",
		"C++ Level 3 Core Skills":
			"Build a multi-file project, parse commands before mutating state, and trace a recursive search. Select containers for observable query and update behavior. Use scoped ownership for a file operation, preserve a fraction's invariants, and test a rover transition and save/load round trip through public commands.",
		"C++ Level 3 Next Topics":
			"Use the rover's graph to rehearse reachability reasoning, its command interface to compare composition and runtime dispatch, and its persistence boundary to discuss resource ownership. The capstone pathway lesson explains how these connect to Data Structures and Algorithms in C++, Design Patterns in C++, and C Systems Engineering.",
		"C++ Level 3 Boundaries":
			"The required capstone is a local console rover with a bounded graph and a text snapshot. Its scope includes validated commands, recursive routing, phase transitions, and save/load. The course builds these components gradually in smaller projects.",
		"C++ Level 3 Prerequisite Check": `Use a loop, function, vector and class to explain a small console result. Describe which object owns the vector and what a borrowed reference can change. Then run the [Build and Debug Checkpoint](${level3Checkpoint}) and use its trace to explain the deliberately incorrect starting total.`,
		"C++ Level 3 Pathway Map":
			"Multi-file builds → Task Manager commands and persistence → Maze Search → Inventory Indexer → Resource-Safe File Processor → Fraction Toolkit → rover capstone. The rover combines command validation and resource boundaries with recursive traversal and explicit states.",
		"C++ Level 3 Follow-Up Path":
			"After the rover transcript and restart test pass, select a follow-up by the skill to deepen. Data Structures and Algorithms develops structure and complexity choices. Design Patterns develops interfaces and collaboration between classes. C Systems Engineering develops a different language's approach to resources and operating-system interfaces.",
		"C++ Level 3 Resource Map":
			"Use the project card to open the specific multi-file starter. Keep related headers, implementations, and build files together when exporting. The pack's README gives the Make or compiler invocation, input format and a repeatable run. A worked reference is a separate comparison after an attempt.",
		"C++ Level 3 Module Alignment Guide":
			"Evidence progresses from a compiler command and a trace to accepted/rejected parser cases, then to solved and unsolved mazes. Inventory evidence compares ordered rows and sorted projections. File output evidence compares accepted reports and rollback cases. Fraction tests show normalized values, and rover transcripts combine paths, phases and snapshots.",
		"C++ Level 3 Reference Map":
			"The [C++ Level 3 source repository](https://github.com/instruction-material/CPP-Level-3) has the source and build contracts for the course projects. Read the README in the exported project folder for the files and commands that belong to that attempt. Use the capstone's completion assignment to assemble the final evidence.",
		"C++ Level 3 Prerequisite Map":
			"Explain compiler, linker and runtime results before interpreting a program failure. Validate tokens before mutating task data. Trace the maze before implementing route search in the rover. Identify the file commit point before testing snapshot recovery.",
		"C++ Level 3 Resource Inventory":
			"Keep the exported source tree, compiler version, build command, and at least one transcript for each project. For the rover, retain a valid snapshot, a malformed copy, and the before-and-after state so the persistence check can be repeated."
	}
};
