import type { RawCourse, RawCourseModule, RawCourseModuleItem } from "./types";
import { bridgeProjectBriefs } from "./bridgeProjectBriefs";

const BRIDGE_SOURCE_BASE =
	"https://github.com/instruction-material/Python-to-Java-and-CPP-Bridge/tree/main";

interface BridgeModuleFlow {
	estimatedTime: string;
	flowNote: string;
	keyBlocks: string[];
}

const BRIDGE_BRANCH_MODULES = new Set([
	"PTJ4 Java-Specific Adaptation",
	"PTJ5 C++-Specific Adaptation"
]);

const BRIDGE_MODULE_FLOW: Record<string, BridgeModuleFlow> = {
	"PTJ0 Positioning and Workflow Translation": {
		estimatedTime: "2 sessions · 45–60 minutes each",
		keyBlocks: [
			"Python readiness",
			"compile / run workflow",
			"braces and semicolons",
			"type declarations",
			"same-behavior comparison"
		],
		flowNote:
			"Choose one small Python reference program, confirm variables, conditions, loops, functions, and basic objects are familiar, and verify at least one Java or C++ compile-run path. Translate tiny examples while preserving inputs and outputs; learning one target branch is enough."
	},
	"PTJ1 Functions, Parameters, and Return Types": {
		estimatedTime: "2 sessions · 45–60 minutes each",
		keyBlocks: [
			"method / function signature",
			"parameter types",
			"return types",
			"compiler diagnostics",
			"behavior tests"
		],
		flowNote:
			"Port one Python helper at a time, predict the signature before compiling, fix the first meaningful diagnostic, and verify the target-language function with the same normal and boundary cases."
	},
	"PTJ2 Collections, Strings, and Indexing": {
		estimatedTime: "2–3 sessions · 45–60 minutes each",
		keyBlocks: [
			"Python list",
			"Java array / ArrayList",
			"C++ array / vector",
			"string ranges",
			"boundary cases"
		],
		flowNote:
			"Translate one list-and-string algorithm with a small shared fixture set. Make fixed versus dynamic size, mutation, valid index ranges, and slice replacements visible before choosing a Java or C++ implementation."
	},
	"PTJ3 Classes and Objects across Languages": {
		estimatedTime: "2–3 sessions · 45–60 minutes each",
		keyBlocks: [
			"state and behavior",
			"constructor",
			"encapsulation",
			"Java class file",
			"C++ header / source pair"
		],
		flowNote:
			"Port one small Python class, compare Java and C++ structure, and then choose the Java or C++ exit branch. Completing one branch plus the capstone completes the bridge; the second branch remains an extension."
	},
	"PTJ4 Java-Specific Adaptation": {
		estimatedTime: "Choose-one branch · 2–3 sessions · 45–60 minutes each",
		keyBlocks: [
			"main method",
			"Scanner input",
			"string equality",
			"null handling",
			"Java exit project"
		],
		flowNote:
			"Choose this branch when Java is the next course. Port the quiz game, verify string-content comparisons and input handling, and leave the C++ branch optional."
	},
	"PTJ5 C++-Specific Adaptation": {
		estimatedTime: "Choose-one branch · 2–3 sessions · 45–60 minutes each",
		keyBlocks: [
			"includes and namespace",
			"console streams",
			"vector",
			"value / reference parameters",
			"C++ exit project"
		],
		flowNote:
			"Choose this branch when C++ is the next course. Port the console program, verify vector and parameter behavior, and defer pointer-heavy work to the main C++ sequence; the Java branch remains optional."
	},
	"Language Bridge Lab 17: Bridge Capstone Port Studio": {
		estimatedTime: "3–4 sessions · 45–60 minutes each",
		keyBlocks: [
			"chosen target language",
			"behavior contract",
			"shared fixtures",
			"compiler / runtime diagnosis",
			"readiness reflection"
		],
		flowNote:
			"Port one complete, modest Python program into the chosen target language. Use the same inputs, expected outputs, boundary cases, and class or collection behavior, then document one compiler error and one semantic difference resolved during the port."
	}
};

const BRIDGE_PROJECT_FOLDERS = {
	syntax: "PTJ1-Syntax-Translation-Warmup",
	functions: "PTJ2-Function-Port-Pack",
	collections: "PTJ3-Text-and-Collection-Port-Lab",
	classes: "PTJ4-Shared-Class-Port",
	java: "PTJ5-Python-to-Java-Quiz-Game",
	cpp: "PTJ6-Python-to-CPP-Console-Port",
	capstone: "PTJ7-Task-Tracker-Capstone"
} as const;

type BridgeProject = keyof typeof bridgeProjectBriefs;
type BridgeLesson = [
	title: string,
	content: string,
	contentKind?: RawCourseModuleItem["contentKind"]
];

function projectChoice(
	project: BridgeProject,
	title: string,
	language: "java" | "cpp"
): RawCourseModuleItem {
	const folder = BRIDGE_PROJECT_FOLDERS[project];
	const branch =
		project === "java" || project === "cpp" ? "" : `/${language}`;
	const label = language === "java" ? "Java" : "C++";
	const completionCheck =
		project === "capstone"
			? "\n\n**Completion checks:** Run the extracted project with the shared console fixture. Record the exact build command and compare task IDs, output order and final totals with the Python baseline."
			: "";
	return {
		title: `${title}: ${label} Starter`,
		learningPath: "choice",
		content: `Choose this ${label} starter to complete the shared project above. Only one target is required. The IDE button opens a confirmation before downloading this language’s source and complete README; it imports the starter, not the separate reference. Keep all files together, save and download the project ZIP, then extract and compile it with the README’s native commands. ${language === "java" ? "Use JDK 21; the Java browser runner is a limited preview and native compilation is the completion gate." : "Use a C++17 compiler; the source workspace does not execute C++ in the browser."} Compare the separate ${label} reference after a working draft and fixture record.${completionCheck}`,
		projectLink: `${BRIDGE_SOURCE_BASE}/${folder}/starter${branch}`,
		solutionLink: `${BRIDGE_SOURCE_BASE}/${folder}/solution${branch}`
	};
}

function bridgeModule(
	title: string,
	lessons: BridgeLesson[],
	projectTitle: string,
	project: BridgeProject,
	extension: [string, string]
): RawCourseModule {
	const isBranch = BRIDGE_BRANCH_MODULES.has(title);
	const path = isBranch ? ("choice" as const) : ("core" as const);
	const flow = BRIDGE_MODULE_FLOW[title];
	const curriculum: RawCourseModuleItem[] = lessons.map(
		([lessonTitle, content, contentKind], index) => ({
			title: lessonTitle,
			content:
				index === 0
					? `**Course flow:** ${flow.flowNote}\n\n${content}`
					: content,
			learningPath: path,
			...(contentKind ? { contentKind } : {})
		})
	);
	const projectItem: RawCourseModuleItem = {
		title: projectTitle,
		learningPath: path,
		content: `Complete this project in the chosen target language. Read the supplied Python behavior and contract, predict the fixtures, then use the matching starter choice. Only one target is required.\n\n${bridgeProjectBriefs[project]}`
	};
	const choices =
		project === "java" || project === "cpp"
			? []
			: [
					projectChoice(project, projectTitle, "java"),
					projectChoice(project, projectTitle, "cpp")
				];
	if (project === "java" || project === "cpp") {
		const choice = projectChoice(project, projectTitle, project);
		projectItem.projectLink = choice.projectLink;
		projectItem.solutionLink = choice.solutionLink;
	}
	curriculum.push(projectItem, ...choices);
	return {
		title,
		...(isBranch ? { kind: "transition" as const } : {}),
		estimatedTime: flow.estimatedTime,
		keyBlocks: flow.keyBlocks,
		curriculum,
		supplementalProjects: [
			{
				title: extension[0],
				content: extension[1],
				learningPath: "challenge"
			}
		]
	};
}

export const pythonToJavaAndCppBridgeCourse: RawCourse = {
	name: "Python to Java and C++ Bridge",
	modules: [
		bridgeModule(
			"PTJ0 Positioning and Workflow Translation",
			[
				[
					"Why Typed Languages Feel Harder at First",
					"This bridge assumes Python variables, conditions, loops, functions, lists and simple objects. The existing algorithm remains useful: a port preserves its promised inputs, outputs and state changes while adapting types, syntax and files. Choose Java or C++ as the first target throughout the four shared stages, then complete that language’s exit and capstone. The other target is an optional extension. This authored transition course prepares an experienced Python learner for the main Java or C++ sequence; it does not replace either full introductory course. Start each exercise by predicting the Python result, mapping its data and control flow, and only then editing the target starter. During a facilitated session, explain the prediction and one type decision before running."
				],
				[
					"Compiled vs. Interpreted Workflows",
					"Python runs a script with `python3 file.py`. A native Java workflow compiles source with JDK 21 using `javac *.java`, then runs the class with `java Main`; use `Main`, without `.java` or `.class`, in the run command. A native C++17 workflow compiles all source files with `c++ -std=c++17 -Wall -Wextra -pedantic -I./ *.cpp -o bridge`, then runs `./bridge`. Open a starter with the site’s matching IDE button, confirm the import, read its README and preserve all files. Save and download a project ZIP, extract it, then use the documented native commands. The Java browser runner is a limited preview, so native Java is the authoritative workflow for these projects, especially the class port and capstone. C++ uses native compilation. Importing does not execute code. A compiler error prevents execution; a runtime error occurs after a successful build. Fix the first relevant diagnostic before investigating later messages."
				],
				[
					"Blocks, Braces, and Signatures",
					"Python uses indentation to group a block. Java and C++ use `{` and `}`; indentation still makes the nesting readable, and most simple statements end in `;`. A Python assignment can bind a name to another kind of object later. A typed declaration such as `int count = 3;` fixes that variable’s declared type. Java writes Boolean values as `boolean`; C++ uses `bool`. Java methods belong to a class; the supplied `static` helpers can be called without constructing an object. C++ free functions can appear outside a class. Both languages declare a return type and parameter types before the body. For a tiny condition or loop, mark the opening and closing block, trace the same values as Python, and predict which statement runs next. Avoid changing the algorithm while resolving the syntax."
				],
				[
					"What Transfers Cleanly from Python",
					"Decomposition, conditions, iteration and object state transfer across all three languages. Library spelling and numeric behavior may differ. Python integers can grow; Java `int` has a fixed 32-bit range, and native C++ `int` width depends on its implementation. Integer division in Java/C++ discards the fractional part toward zero; Python `/` returns a floating-point result and `//` floors. Strings and collections also have different APIs and representations. A port therefore needs an explicit input domain and shared fixtures, rather than a visual resemblance between source files. For the warmup, use the provided ASCII strings and bounded integer cases, including the documented minimum-integer rejection. Record a predicted result, actual result and explanation for each case. Compare returned values rather than incidental collection-printing styles."
				],
				[
					"Project: Starter Source Review",
					"Read the chosen warmup starter’s declarations and README before implementing it. Identify the supplied driver, the unfinished callable methods, parameter types, return types, and the native compile/run command. Explain why the starter can compile while still stopping at an implementation reminder. This is a reading checkpoint within the warmup, not another project or another import. Keep learner changes in the starter and consult its separate target-language reference after a working draft."
				],
				[
					"Python Readiness and Toolchain Checkpoint",
					"**Completion evidence:**\n- Predict the supplied Python helper results and explain a condition, loop, function and simple object.\n- Compile and run hello world in the chosen native target; record the exact command and output.\n- Map assignment, condition, loop, function, output and block syntax.\n- Name Java or C++ as the first target. Only one toolchain and one target implementation are required. If a prerequisite is unfamiliar, practise it in Python before starting the port."
				]
			],
			"Project: Syntax Translation Warmup",
			"syntax",
			[
				"Workflow Translation Extension Practice",
				"After a working warmup, port it into the second target and compare the same fixtures. Record the declaration, block and compile/run differences. Reuse the matching starter choice above; this is an optional second-target comparison of the same contract, not another required warmup."
			]
		),
		bridgeModule(
			"PTJ1 Functions, Parameters, and Return Types",
			[
				[
					"From def to Method Signatures",
					"A signature states the callable name, input types and output type. Python can discover an incompatible argument while executing; Java and C++ reject many incompatible calls during compilation. Read the provided helper declarations before changing a body. A Java `static` method belongs to its class without requiring an instance; a C++ free function is callable outside a class. `boolean`/`bool` represents the membership flag, `double` represents the price, and integer helpers return `int`. Preserve the original names and parameter order so the supplied driver and checks still call the same API. Use the Python baseline to decide the behavior of each input. The signature alone does not decide whether an amount may be negative, which letters count as vowels, or which boundary is inclusive; those promises are in the contract."
				],
				[
					"Void, Value Returns, and Compile-Time Mismatches",
					"A value-returning function must produce its promised type on every reachable path. `void` describes a function with no returned value; it does not match a helper whose caller uses a computed score, price or count. `return` ends the current call, so a branch placed after it will not execute. Before compiling, trace every condition to confirm a result is produced. A missing return or incompatible type is a compiler diagnostic; a wrong clamp boundary can compile and still fail a behavior check. Floating-point arithmetic stores approximations, so compare price results with a small stated tolerance rather than assuming every decimal has an exact representation. The shared price inputs are finite, non-negative doubles. Keep the contract’s domain visible rather than adding unrelated input policies during translation."
				],
				[
					"Reading Compiler Feedback Productively",
					"Compiler errors are structured feedback rather than evidence that the language is hostile. Start at the first error’s file and line, inspect the named expression and the preceding statement, then compare its type or punctuation with the declaration. A missing brace or semicolon can cause many later errors; fix one cause and rebuild before changing unrelated lines. Preserve the diagnostic and explain what changed. After a successful build, run ordinary and boundary cases independently of the demonstration driver. For the function pack, predict scores below/at/above the clamp limits, both membership values, empty text and repeated uppercase/lowercase vowels. Confirm the inputs remain unchanged. During a facilitated walkthrough, explain the failing trace and propose the smallest correction; independent study uses the same prediction-and-check record."
				],
				[
					"Functions, Parameters, and Return Types: Verification and Reflection",
					"Make a fixture table with input, predicted output, actual output and pass/fail. Cover each helper, integer extremes where supported, a zero price, both membership values, and ASCII text with no vowels, repeated vowels and punctuation. Record the floating-point tolerance. Keep at least one corrected compiler diagnostic and one corrected behavior mismatch, with their causes. Explain which checks concern types and which concern the algorithm. Completion requires the chosen target’s full callable contract, not only the supplied sample output.",
					"assignment"
				]
			],
			"Project: Function Port Pack",
			"functions",
			[
				"Function Signature Transfer Practice",
				"After the function pack passes, write a type map for each parameter and return value in the other target without reading its reference. Predict a missing-return diagnostic and a wrong-argument-type diagnostic, then verify them in a small disposable example. Keep the original project behavior unchanged."
			]
		),
		bridgeModule(
			"PTJ2 Collections, Strings, and Indexing",
			[
				[
					"Lists vs. Arrays, ArrayLists, and Vectors",
					"Python lists grow dynamically. A Java array has a fixed length after creation and uses `.length`; `ArrayList` grows and uses `.size()`, `.get(index)` and `.add(value)`. A C++ `vector` grows, uses `.size()` and `.push_back(value)`, and provides indexed access or range iteration. The collection pack accepts Java `List<String>` or C++ `const vector<string>&`. Java’s supplied `List.of(...)` is unmodifiable, so build a new result instead of adding to the input. A C++ const reference borrows the vector without copying it and prevents mutation through that reference. The port must preserve input order and duplicates. Draw the input and result as separate collections, then trace which words are retained. A loop that visits each value directly avoids unnecessary index arithmetic."
				],
				[
					"String APIs and Slice Replacement",
					"Python slicing uses an excluded end index. Java `substring(start, end)` also excludes the end; C++ `substr(start, count)` takes a character count instead of an end index. For the first two ASCII characters of `bridge`, Java `substring(0, 2)` and C++ `substr(0, 2)` both produce `br`. For a middle range, convert the Python end into `end - start` for C++. Java strings are immutable, while C++ strings have mutable operations; assigning a new string result is distinct from changing a collection. Java string length counts UTF-16 code units and C++ string size counts bytes. Neither is a general Unicode user-perceived character count. The shared assignment deliberately uses ASCII fixtures. Explain that limit before generalizing the algorithm to names or multilingual text."
				],
				[
					"Bounds and Loop Discipline",
					"Valid indexes run from zero through size minus one. An empty collection has no valid element index, so a loop guard must prevent reading element zero when the size is zero. For an indexed loop, use a strict less-than end condition; a range loop can avoid manual bounds entirely. Before implementing the collection helpers, trace lengths four, five and six to determine the inclusive filter boundary. Trace two equally long words to preserve the first longest match, and retain repeated qualifying words in their original positions. A new result must not alias a mutable input list. Check the original input after calling each helper and test the empty case separately. Compare returned elements, since Java and C++ drivers intentionally print collections differently."
				],
				[
					"Collections, Strings, and Indexing: Verification and Reflection",
					"Verify empty and single-word inputs, lengths around the filter threshold, all-short lists, duplicates and equal-length ties. Record the ordered returned elements and confirm the input is unchanged. Explain the difference between fixed arrays and growing collections, the slice endpoint/count distinction, and the ASCII limitation. During a session, pause after each loop iteration to predict the partial result; independently, write the same trace before execution. Completion requires both helpers in one chosen target and evidence for boundaries, order and non-mutation.",
					"assignment"
				]
			],
			"Project: Text and Collection Port Lab",
			"collections",
			[
				"Collection Indexing Transfer Practice",
				"Trace the same collection fixture once with a range loop and once with indexes in the chosen target. Preserve order, duplicates, the first longest tie and unchanged input. Explain which version makes the bounds easier to verify. This optional refactor reuses the completed collection project."
			]
		),
		bridgeModule(
			"PTJ3 Classes and Objects across Languages",
			[
				[
					"What Stays the Same in OOP",
					"An object combines state with operations that preserve a contract. The account port stores an owner and balance, validates construction, and exposes deposit, withdrawal and summary operations. Draw the balance before and after each call; rejected operations must leave it unchanged. Encapsulation keeps direct balance changes out of callers so the account can enforce its rules consistently. Python, Java and C++ express the same model differently, but validation order and state preservation remain behavior requirements. This teaching example uses finite doubles; production monetary software needs an explicit exact representation. The sample does not establish a production finance design. Start with construction and one valid operation, then rejection cases, before adding formatted output."
				],
				[
					"Java Class Structure",
					"A Java public class belongs in the file matching its name: `BankAccount` in `BankAccount.java`, and the supplied driver `Main` in `Main.java`. A constructor has the class name and no declared return type; `new` constructs an instance. Private fields protect state, while public methods form the callable interface. `this` names the current instance when a field and parameter have the same name. Compile both files together before running `java Main`. Java object variables hold references: assigning `second = first` makes both variables refer to the same account, so a change through one is visible through the other. A separate `new` account has separate state. Explain this with a two-variable diagram and a small prediction before execution."
				],
				[
					"C++ Class Structure and Header/Source Separation",
					"The C++ header declares the class, its fields and public signatures. The implementation `.cpp` defines those methods with `BankAccount::methodName`; the driver `.cpp` calls them. Include the header where its declarations are needed, and compile both source files to provide the method definitions. Compiling only the driver can succeed at syntax checking and fail at linking because definitions are missing. A header guard prevents duplicate declarations within a translation unit. A C++ account variable here holds a value: an ordinary copy creates a separate account whose later balance changes do not change the original. This differs from Java reference assignment. Preserve all imported filenames and the header, use the supplied build command, and avoid adding raw pointers or manual allocation to this exercise."
				],
				[
					"Classes and Objects across Languages: Verification and Reflection",
					"Trace a successful deposit and withdrawal, full withdrawal to zero, an overdraft, zero/negative/non-finite amounts, invalid starting balance and deposit overflow. Compare the summary before and after each rejected operation. Verify exactly two decimal places and a decimal point independent of locale. Create independent accounts, then distinguish Java aliasing from C++ value copying in a separate check. A working sample is insufficient if a rejected transaction corrupts state. Completion evidence includes the chosen target’s files, native build/run commands, an unchanged-state trace and the object-model explanation.",
					"assignment"
				],
				[
					"Choose a Java or C++ Exit Branch",
					"**Completion evidence:**\n- Select the Java or C++ exit that matches the next course or project.\n- Record why it fits the learner’s goal and keep the same target for the capstone.\n- Complete that branch’s console project and the capstone checks.\n- The unselected branch is labeled optional; completing both is an extension, not a requirement."
				]
			],
			"Project: Shared Class Port",
			"classes",
			[
				"Header Source Extension Practice",
				"For a completed C++ class port, build only the driver and inspect the missing-definition linker error, then restore the full build command. For Java, draw a reference-alias trace and compare it with a separate new account. Record the language-specific lesson without altering the account contract."
			]
		),
		bridgeModule(
			"PTJ4 Java-Specific Adaptation",
			[
				[
					"Scanner, main, and Java Project Rhythm",
					"The supplied `public static void main(String[] args)` is the entry point. `Scanner` reads console input; `hasNextLine()` tests availability before `nextLine()` consumes a complete line. A blank line is an answer containing no characters, while end of input means no further line exists. The quiz driver handles EOF by reporting cancellation and retaining the score already earned. Keep that input lifecycle and implement the scoring helper. Read the full native source contract before using the browser preview; native Java compilation and console fixtures are the completion gate. Test correct and incorrect answers, surrounding spaces, mixed case, blank lines and input ending after the first question. Predict the accumulated score after each accepted answer.",
					"reading"
				],
				[
					"String Equality and Reference Habits",
					'Java String `==` compares reference identity; it does not ask whether two separate objects contain the same text. `.equals()` compares contents, and `.equalsIgnoreCase(...)` supports the quiz’s ASCII case-insensitive contract. `new String("class")` can contain the same text as another string while referring to a different object. A null reference names no object, so calling an instance method on null raises a runtime error. If null is allowed by a contract, test it before dereferencing or compare from a known non-null value. The quiz helper’s inputs are explicitly non-null ASCII strings; do not silently invent a null policy. Trimming surrounding whitespace and comparing text are separate operations. Explain which promise comes from the API and which comes from this assignment’s domain, then verify mixed case and surrounding spaces against the Python baseline.'
				],
				[
					"Bridge Exit to Java Level 1",
					"Finish the supplied quiz in native Java, preserving its prompts, two-question scoring and EOF behavior. Explain the helper’s typed signature, content equality and input lifecycle. Record a normal run, a wrong-answer run and an early cancellation with points preserved. The main Java sequence can then deepen classes, collections and larger applications according to its prerequisites; this bridge is a compact transition from existing Python knowledge. Use the task-tracker capstone next in the same language. The C++ branch remains an optional second-target comparison."
				],
				[
					"Java Specific Adaptation: Verification and Reflection",
					"Create the full fixture table from the project brief. Verify points stay between zero and two, empty input is distinguished from an empty line, and cancellation does not erase earned points. Record exact native commands, predicted and observed output, and one corrected String comparison mistake. Explain how `Scanner` and `main` adapt the Python workflow. A facilitated walkthrough pauses before reading a line and before changing the score; independent study writes those predictions in the record.",
					"assignment"
				]
			],
			"Project: Python to Java Quiz Game",
			"java",
			[
				"Java Scanner Transfer Practice",
				"Using the completed quiz driver, predict a blank answer versus immediate EOF and EOF after one correct answer. Verify the output and explain why a line-availability check precedes reading. This optional input trace reuses the quiz; it does not require another scoring project."
			]
		),
		bridgeModule(
			"PTJ5 C++-Specific Adaptation",
			[
				[
					"Includes, std, and Console Streams",
					"C++ headers declare standard library facilities: `<iostream>` for console streams, `<string>` for strings and `<vector>` for vectors. Qualified names such as `std::cout` make their namespace visible. `cin >> guess` reads a whitespace-delimited token; it skips blank whitespace, and `vector compile` supplies two guesses. Python `input()` reads a full line, so translating its interface requires an explicit choice. This source pack deliberately uses token input; a line-based alternative would use `getline` and a changed contract. Check the stream result before scoring so EOF never reuses the previous guess. Build first, then run the executable with a known input fixture. The site workspace supports editing and download; it does not compile C++ in the browser."
				],
				[
					"Vectors, References, and Pass-by-Value Intuition",
					"A C++ value parameter copies its argument, while a reference parameter refers to an existing object. `const string&` and `const vector<string>&` permit reading without copying the whole input and prevent changes through that reference. These inputs must still be valid while the function uses them. A vector owns its elements and supports range iteration; no raw pointers or manual allocation are needed for this console exercise. The scoring helper tests exact case-sensitive membership and returns either zero or one. Duplicate secret words do not award multiple points for one guess. Repeated matching guesses across accepted rounds each earn a point. Keep those two situations distinct in the fixture table and confirm the input vector remains unchanged."
				],
				[
					"Bridge Exit to C++ Level 1",
					"Finish the native console port using the documented C++17 command, retain all supplied input handling, and verify three rounds plus early EOF. Explain includes, stream success/failure, vector iteration and const-reference parameters. Diagnose a compiler or linker message before changing behavior. The main C++ sequence can then deepen ownership, lifetime and larger programs according to its prerequisites; this bridge does not introduce pointer-heavy work. Complete the task-tracker capstone next in C++. The Java branch remains optional for a later second-target comparison."
				],
				[
					"C++ Specific Adaptation: Verification and Reflection",
					"Test exact membership, missing words, case changes, empty/duplicate secret lists, repeated accepted guesses, blank whitespace, immediate EOF and EOF after one match. The last case must score one rather than replaying the previous token. Record the accepted round count and unchanged input vector. Explain why token input differs from Python line input and document the actual native build/run command. Completion requires the whole fixture set and a corrected failure trace, not only a successful three-token sample.",
					"assignment"
				]
			],
			"Project: Python to C++ Console Port",
			"cpp",
			[
				"C++ Vector Extension Practice",
				"Using the completed console port, test duplicated secrets and repeated guesses as separate fixtures, then verify non-mutation and EOF after one match. Explain why membership returns one point per accepted round. This optional trace reuses the console project rather than importing another pack."
			]
		),
		bridgeModule(
			"Language Bridge Lab 17: Bridge Capstone Port Studio",
			[
				[
					"Language Bridge Lab 17: Core Concepts",
					"The task tracker combines typed functions, ordered collections, encapsulated state, validation and a supplied console loop. Read the full contract before selecting the Java or C++ starter. A task’s ID is distinct from its current list position; removal must not recycle an ID or restore the lifetime add budget. Repeated titles are allowed. Model each operation as input, validation, state transition and output. A rejected operation must preserve the same tasks, flags, order and next ID. The list operation returns fresh data so callers cannot mutate the tracker through its result. Use the same chosen language as the exit project; the other target is optional.\n\n**Worked example:** An empty tracker assigns ID 1 to `ADD Read notes`. An `ADD ` with a blank title returns `ERROR: title` and leaves the list and the next ID unchanged. `ADD Plan check` then returns `ADDED 2`. The result distinguishes a rejected attempt from a successful add.",
					"reading"
				],
				[
					"Language Bridge Lab 17: Guided Example",
					"Predict the shared console fixture in the project brief without running it. Draw the state after every successful add, repeated completion, removal and final add. Keep a separate next-ID column rather than deriving it from collection size. Run the supplied Python baseline to check the prediction, then map its record and list representation to the provided target declarations. Implement normalization and one add first, test that a rejected add does not consume an ID, and then implement completion, removal, filtering and summary. The supplied command loop remains separate from the six learner methods. During a facilitated walkthrough, pause at each state change to predict the next output; independent study records the same trace."
				],
				[
					"Language Bridge Lab 17: Review and Reflection",
					"**Completion checks:** Compare the chosen port with Python using the shared ordinary, boundary and invalid-input fixtures. Record state before and after each rejected operation, verify fresh list results and independent trackers, and check the 100-successful-add lifetime boundary after a removal. Compile and run the real console protocol with LF/CRLF and EOF, including input after QUIT that must be ignored. Explain one syntax difference, one type or object-model difference and one diagnosed mismatch. Consult the separately linked target reference after a working draft and explain any revisions."
				],
				[
					"Chosen-Language Capstone Contract",
					"**Completion evidence:**\n- One working Java or C++ task-tracker port of the supplied Python baseline.\n- Shared fixtures with predicted and actual output, including title/ID boundaries, ordering, repeated operations and the lifetime add limit.\n- State-preserving rejection and fresh-result evidence. Include the task list and next successful ID after one rejection.\n- The exact native build/run commands and all required files. Include the compiler version so the run can be repeated on another machine.\n- A comparison record with a type/object difference, a diagnosed failure and the next-course readiness decision. The second target is optional."
				]
			],
			"Language Bridge Lab 17: Core Project",
			"capstone",
			[
				"Language Bridge Lab 17: Extension Challenge",
				"After completing the capstone in one target, use the other target starter and preserve the same task and console contract. Compare Java reference aliasing with ordinary C++ value copying and explain how separate trackers keep separate state. A GUI, sorting or persistence needs a separate explicit behavior contract and is optional.\n\n**Completion checks:** Use two trackers with the same initial contents. Change a task in one tracker and compare the other tracker’s list and totals before and after that change. Repeat the check in both languages and explain why the other tracker’s state stays independent."
			]
		)
	]
};
