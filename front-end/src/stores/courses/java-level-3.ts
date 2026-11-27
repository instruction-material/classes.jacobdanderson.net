import type { RawCourse, RawCourseModuleItem } from "./types";
import {
	classroomReferenceItem,
	gitCourseGuideLink
} from "./classroomReferenceGuides";
import { buildJavaBinarySearchModule } from "./javaBinarySearchTeaching";
import { buildJavaBinaryTreeModule } from "./javaBinaryTreeTeaching";
import {
	buildJavaBubbleSortModule,
	buildJavaCheckIn2Module
} from "./javaBubbleCheckIn2Teaching";
import { buildJavaCheckIn1Module } from "./javaCheckIn1Teaching";
import { buildJavaCheckIn3Module } from "./javaCheckIn3Teaching";
import { buildJavaCheckIn4Module } from "./javaCheckIn4Teaching";
import {
	buildJavaCollectionsModule,
	buildJavaPipelinesModule
} from "./javaCollectionPipelinesTeaching";
import { buildJavaConcurrencySimulationModule } from "./javaConcurrencySimulationTeaching";
import { completeJavaFoundationReview } from "./javaFoundationReviewTeaching";
import { buildJavaGraphModule } from "./javaGraphTeaching";
import { buildJavaHashTableModule } from "./javaHashTableTeaching";
import { buildJavaLinkedListModule } from "./javaLinkedListTeaching";
import { buildJavaPackageReviewModule } from "./javaPackageReviewTeaching";
import { buildJavaPriorityMapModule } from "./javaPriorityMapTeaching";
import { completeJavaRecursionModule } from "./javaRecursionTeaching";
import { buildJavaReferenceLibraryModule } from "./javaReferenceLibraryTeaching";
import { completeJavaSearchModule } from "./javaSearchTeaching";
import {
	buildJavaElementarySortingModule,
	buildJavaMergeSortingModule
} from "./javaSortingTeaching";
import { buildJavaStackQueueModule } from "./javaStackQueueTeaching";
import { buildJavaStreetSearcherModule } from "./javaStreetSearcherTeaching";
import { buildJavaSustainableProgrammingModule } from "./javaSustainableTeaching";
import { isCoreProjectTitle } from "./projectGrouping";
import { buildProjectGuidance } from "./projectGuidance";
import { buildSupportSectionGuidance } from "./supportSectionGuidance";

const javaLevel3SourceCourse: RawCourse = {
	name: "Java Level 3",
	modules: [
		{
			title: "AJ0 Visual Foundations Audit",
			curriculum: [
				{
					title: "Confirm the Visual-to-Text Progression",
					content:
						"This short audit precedes advanced Java work. A ready explanation traces the path from a visible robot object, to console variables and methods, to custom classes and collections. When that path is weak, the relevant Java Level 1 or Level 2 bridge comes before recursion, algorithms, or data structures."
				},
				{
					title: "Tool Choice for Advanced Work",
					content:
						"BlueJ remains useful for object inspection and quick class experiments, while Java Level 3 mostly runs in the same environment used for larger projects: CodeHS, VS Code, or the browser Code IDE depending on school restrictions. Choose the tool that makes compile errors, tests, files, and multiple classes easiest to inspect."
				},
				{
					title: "Readiness Evidence",
					content: `Before moving into the review modules, the evidence set includes one runnable console program, one custom class with constructors and methods, and one collection trace. Each artifact is explained through state, method calls, and evidence from output or tests.${
						gitCourseGuideLink
					}`
				}
			],
			supplementalProjects: [
				{
					title: "AJ0 Supplemental Project 1: Trace Translation",
					content:
						"Translate a short robot trace into a console/object trace: initial state, method call, changed state, and output. The result proves transfer between visual and non-visual evidence."
				}
			]
		},
		{
			title: "AJ1 Review: Variables, Strings, and Input",
			curriculum: [
				{
					title: "Introductions and Setup",
					content: `**Concept path:** Java programs move through a source-edit, compile, run, and observe cycle. A useful setup pass identifies where source files live, where compiled output appears, how the terminal reports errors, and how project folders separate one exercise from another.

**Practice targets:** Open a small Java project, identify the file containing the entry point, run it once unchanged, make one visible output change, run it again, and confirm that the displayed result came from the newest source file rather than stale output.

**Evidence target:** A reliable setup is visible when a small source change produces a predictable new console result and compile errors can be traced back to a specific file and line.`
				},
				{
					title: "Creating and Running a Java Program",
					content: `**Concept path:** A Java application starts from a class that contains the main method. The class name, file name, braces, method header, and statements work together to create the smallest runnable program.

**Practice targets:** Locate the class declaration, the main method header, and the first executable statement. Add several console outputs, distinguish fixed text from calculated values, and keep braces and semicolons aligned so the compiler can parse the program.

**Evidence target:** The program can be explained from file to class to main method to statement order, and each line of output can be traced to the exact statement that produced it.`
				},
				{
					title: "Compilation",
					content: `**Concept path:** Java source code is compiled before execution. Compilation catches syntax and type errors, then produces bytecode that the Java runtime executes. Runtime behavior begins only after the compiler accepts the source.

**Practice targets:** Create and fix common compile-time errors such as missing semicolons, mismatched braces, wrong capitalization, and incompatible assignments. Then compare them with runtime or logic errors where the program compiles but behaves incorrectly.

**Evidence target:** Error messages are useful when the filename, line number, symbol name, and surrounding code are read together instead of treating the first red message as a mystery.`
				},
				{
					title: "Variables, Primitive Data Types, and Strings",
					content: `**Concept path:** Variables name stored values, while types describe what operations are valid. Primitive types such as int, boolean, and double store direct values. String values are objects, so they support methods such as length(), charAt(), substring(), and equals().

**Practice targets:** Declare variables with meaningful names, update them safely, combine text with numeric values, and compare strings using equals() rather than ==. Include small checks for off-by-one indexing, integer division, and boolean expressions.

**Evidence target:** A strong solution makes each variable's role obvious, produces correct output for more than one input, and avoids relying on accidental string or numeric behavior.`
				},
				{
					title: "Input, Output, and Commenting",
					content: `**Concept path:** Console programs become interactive when Scanner reads typed input and output statements explain what is needed next. print() keeps output on the same line, println() ends the line, and comments preserve reasoning that is not obvious from code alone.

**Practice targets:** Read strings, integers, and decimal values; name prompts clearly; handle the common nextInt() then nextLine() newline issue; and keep comments focused on purpose, assumptions, or a non-obvious decision.

**Evidence target:** The program is readable from the console alone: prompts describe the expected input, output spacing is intentional, and comments clarify reasoning rather than repeating the statement literally.`
				},
				{
					title: "AJ1 Project 1: Mad Libs",
					content: `**Project target:** Build a console Mad Libs program that collects several typed words, stores each value in a descriptive variable, and inserts those values into a complete story.

**Build path:** Plan the story before coding so every blank has a clear part of speech. Then create prompts, read input with Scanner, combine fixed text with variables, and preserve spacing, punctuation, and line breaks.

**Evidence target:** The story remains readable after multiple runs with different inputs, and the source code clearly separates input collection from final story output.`,
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ1-Mad-Lib",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ1-Mad-Lib"
				},
				{
					title: "AJ1 Project 2: Chat Bot",
					content: `**Project target:** Create a console chatbot that collects responses, stores them in variables, and produces replies that depend on earlier input.

**Build path:** Keep each prompt short and specific, normalize text where needed, and use conditionals for at least a few different response paths. A fallback response keeps the conversation stable when input does not match the expected wording.

**Evidence target:** The chatbot has a repeatable conversation flow, at least one branch based on typed input, and output that makes sense even when responses vary.`,
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ1-Chat-Bot",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ1-Chat-Bot"
				}
			],
			supplementalProjects: [
				{
					title: "Review: Variables, Strings, and Input: Extension Challenge",
					content: buildSupportSectionGuidance({
						courseFamily: "Java Level 3",
						moduleTitle: "Review: Variables, Strings, and Input",
						section: "extension"
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ1-Mad-Lib",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ1-Mad-Lib"
				},
				{
					title: "Java Syntax Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "Java Level 3",
						moduleTitle:
							"AJ1 Review: Variables, Strings, and Input",
						itemTitle: "Java Syntax Transfer Practice",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/J3-01-aj1-review-variables-strings-and-input-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/J3-01-aj1-review-variables-strings-and-input-supplemental-2/solution"
				},
				{
					title: "Console Input Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "Java Level 3",
						moduleTitle:
							"AJ1 Review: Variables, Strings, and Input",
						itemTitle: "Console Input Extension Practice",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/J3-02-aj1-review-variables-strings-and-input-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/J3-02-aj1-review-variables-strings-and-input-supplemental-3/solution"
				}
			]
		},
		{
			title: "AJ2 Review: Arrays and ArrayLists",
			curriculum: [
				{
					title: "Review Focus",
					content: `**Concept path:** Arrays and ArrayLists both store ordered collections, but they make different tradeoffs. Arrays have fixed length and direct indexed storage. ArrayLists resize and provide methods for insertion, removal, and replacement.

**Practice targets:** Compare length with size(), index access with get(), assignment with set(), and fixed storage with dynamic growth. Include at least one example where an array is the simpler structure and one where an ArrayList is more appropriate.

**Evidence target:** Collection code is strongest when index bounds, mutation points, and traversal order are visible and tested with empty, single-item, and multi-item cases.`
				},
				{
					title: "Arrays",
					content: `**Concept path:** Arrays are fixed-size ordered collections where every element has the same type. Indexing starts at 0, the final valid index is length - 1, and direct access is fast when the index is known.

**Practice targets:** Create arrays with explicit values and with a size only, fill them with loops, read and update individual elements, and print them with both standard loops and enhanced for loops where mutation is not needed.

**Evidence target:** Correct array code avoids off-by-one errors, handles the first and last element deliberately, and does not use an index outside the valid range.`
				},
				{
					title: "AJ2 Project 1: Array Practice",
					content: `**Project target:** Write a group of array utility methods that transform values, compute totals, generate random data, and summarize strings.

**Build path:** Keep each method responsible for one task: double numeric values, sum even numbers, generate random doubles, or total word lengths. Use parameters and return values so methods can be tested without rewriting the main method every time.

**Evidence target:** Each method has at least one standard scenario plus one edge case, such as an empty array, a one-element array, or an array with no even numbers.`,
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ2-Array-Practice",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ2-Array-Practice"
				},
				{
					title: "Two-Dimensional Arrays",
					content: `**Concept path:** A two-dimensional array is an array of rows, and each row contains elements at column indices. This structure is useful for grids, tables, matrices, maps, and board-like data.

**Practice targets:** Access a specific row and column, traverse by rows, traverse by columns when appropriate, and distinguish the number of rows from the number of columns. Include rectangular arrays as well as square arrays so the two dimensions are not accidentally treated as identical.

**Evidence target:** Nested-loop code is correct when the outer and inner bounds match the actual row and column lengths, not a memorized size.`
				},
				{
					title: "AJ2 Project 2: Two-Dimensional Array Practice",
					content: `**Project target:** Build utility methods for square grids and general matrices, including filling, printing, maximum search, random generation, and target search.

**Build path:** Use predictable small matrices before adding random values. Print intermediate grids in a readable row-and-column layout so incorrect indexing is visible.

**Evidence target:** The methods work for targets at the first cell, last cell, middle cells, and missing values, and maximum-value logic handles negative numbers as well as positive numbers.`,
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ2-Two-Dimensional-Array-Practice",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ2-Two-Dimensional-Array-Practice"
				},
				{
					title: "ArrayLists",
					content: `**Concept path:** ArrayLists are resizable lists backed by object references. They trade fixed-size simplicity for methods that make insertion, deletion, replacement, and dynamic growth easier.

**Practice targets:** Use add(), get(), set(), remove(), contains(), and size() in small examples. Pay special attention to removal while iterating because removing an item shifts later indices left.

**Evidence target:** ArrayList code is reliable when it clearly handles changing size, avoids skipped elements during removal, and chooses wrapper types such as Integer for primitive-style values.`
				},
				{
					title: "Primitive Wrapper Objects",
					content: `**Concept path:** Java generics work with reference types, so collections such as ArrayList use wrapper classes like Integer, Double, Boolean, and Character instead of primitive types directly. Autoboxing converts a primitive into its wrapper when needed, and unboxing converts it back.

**Practice targets:** Create ArrayList<Integer> and ArrayList<Double> examples, perform arithmetic with retrieved values, and identify where Java converts between primitive and wrapper forms automatically.

**Evidence target:** Code that uses wrappers well avoids null unboxing errors and keeps numeric intent clear despite the object wrapper around the value.`
				},
				{
					title: "AJ2 Project 3: ArrayList Practice",
					content: `**Project target:** Build ArrayList methods that filter values, search for a pair with a target relationship, remove an extreme value, and append summary data.

**Build path:** Use separate methods for filtering even numbers, checking for two values that sum to zero, removing the smallest value, and appending the total sum. Keep mutation explicit so it is clear which methods modify the original list.

**Evidence target:** The project handles duplicates, all-negative lists, all-positive lists, empty lists where relevant, and lists where the smallest value appears more than once.`,
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ2-Array-List-Practice",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ2-Array-List-Practice"
				}
			],
			supplementalProjects: [
				{
					title: "AJ2 Supplemental Project 1: Test Scores",
					content: `**Project target:** Store numeric test scores, compute summary statistics, and convert the average into a letter-grade category.

**Build path:** Validate the score range, calculate the total and average with clear numeric types, and use conditionals that make grade boundaries unambiguous.

**Evidence target:** Boundary cases such as exactly 90, exactly 80, a perfect score, and a low score produce the expected category.`,
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ2-Test-Scores",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ2-Test-Scores"
				},
				{
					title: "AJ2 Supplemental Project 2: Matrix Addition",
					content: `**Project target:** Add two matrices by combining entries at matching row and column positions.

**Build path:** Confirm that both matrices have compatible dimensions, traverse rows and columns with nested loops, and store each sum in a result matrix rather than overwriting input data too early.

**Evidence target:** The output matrix has the same dimensions as the inputs, and each cell can be verified by one hand calculation.`,
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ2-Matrix-Addition",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ2-Matrix-Addition"
				},
				{
					title: "AJ2 Supplemental Project 3: Sandwich Orders",
					content: `**Project target:** Model a sandwich order with an ArrayList of ingredients and convert that order into a compact representation.

**Build path:** Store available ingredients, collect selected ingredients, preserve ordering where it matters, and create abbreviations through a clear rule rather than hard-coded output only.

**Evidence target:** Repeated ingredients, missing ingredients, and differently ordered selections produce predictable results.`,
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ2-Sandwich-Orders",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ2-Sandwich-Orders"
				}
			]
		},
		{
			title: "AJ3 Review: Objects and Classes",
			curriculum: [
				{
					title: "Object-Oriented Programming",
					content: `**Concept path:** Object-oriented Java is clearest when each class owns one coherent responsibility. A class defines the fields and behavior available to its objects, while each object stores its own state.

**Practice targets:** Identify which data belongs in fields, which behavior belongs in methods, and which setup belongs in constructors. Separate object state from local variables so long-lived information is stored in the correct place.

**Evidence target:** A class is well-shaped when another file can create objects, call public methods, and understand the object state without directly editing private data.`
				},
				{
					title: "Public and Private Instance Variables",
					content: `**Concept path:** Encapsulation protects object state by keeping fields private and exposing controlled operations through methods. Public fields make quick experiments easy, but they also allow invalid state from anywhere in the program.

**Practice targets:** Convert public fields into private fields, add getters and setters where useful, and enforce at least one rule inside a setter or constructor.

**Evidence target:** Invalid values are rejected or normalized at the class boundary instead of requiring every caller to remember the same rule.`
				},
				{
					title: "Constructors",
					content: `**Concept path:** Constructors establish an object's starting state. A no-argument constructor provides a default setup, while overloaded constructors allow specific starting values.

**Practice targets:** Write multiple constructors for the same class, use this to resolve field and parameter names, and avoid duplicated setup logic when one constructor can delegate to another.

**Evidence target:** Every constructed object begins in a valid state, and object creation examples show why each constructor signature exists.`
				},
				{
					title: "Class Methods",
					content: `**Concept path:** Methods define what an object can do. Accessor methods expose state safely, mutator methods update state according to rules, and toString() creates a readable summary for debugging and display.

**Practice targets:** Write getters, setters, behavior methods, and a toString() method that includes the important fields without exposing implementation details unnecessarily.

**Evidence target:** Method calls read naturally from the outside of the class and keep state changes inside the class's rules.`
				},
				{
					title: "AJ3 Project 1: Student Class",
					content: `**Project target:** Create a Student class that stores identity and academic data with private fields and public methods.

**Build path:** Define fields, constructors, getters, setters, validation rules, and a toString() method. Then create several Student objects from main and update them through methods rather than direct field access.

**Evidence target:** The class supports valid object creation, readable output, controlled updates, and at least one rejected or corrected invalid value.`,
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ3-Student-Class",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ3-Student-Class"
				},
				{
					title: "Static Variables and Methods",
					content: `**Concept path:** Static members belong to the class itself rather than to one object. They are useful for shared constants, class-wide counters, utility methods, and state that genuinely applies across all instances.

**Practice targets:** Add a static counter such as numStudents, update it during construction, expose it through a static getter, and compare it with an instance field that differs for each object.

**Evidence target:** The output distinguishes per-object state from class-wide state, and static data is not used as a shortcut for information that belongs in each object.`
				},
				{
					title: "Inheritance and Subclasses",
					content: `**Concept path:** Inheritance models an is-a relationship: a subclass is a more specific version of its superclass. The subclass inherits accessible behavior, can add new behavior, and can override methods when the general behavior is not specific enough.

**Practice targets:** Create a superclass with shared fields and methods, extend it with a subclass, call super() from the subclass constructor, and override one method with more specific behavior.

**Evidence target:** Shared behavior appears only once in the superclass, while subclass-specific details stay in the subclass.`
				},
				{
					title: "AJ3 Project 2: BakedGood Class",
					content: `**Project target:** Create a BakedGood model that can grow from a basic class into a small inheritance hierarchy.

**Build path:** Store common baked-good data such as name, ingredients, quantity, and size-related information. Then identify which behavior belongs to all baked goods and which behavior varies by subtype.

**Evidence target:** The base class is useful on its own as a shared model and also prepares cleanly for later abstract classes, interfaces, and enum-based constraints.`,
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ3-Baked-Good",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ3-Baked-Good"
				},
				{
					title: "Abstract Classes and Methods",
					content: `**Concept path:** Abstract classes define shared state or behavior while leaving some details incomplete. Abstract methods name behavior that every concrete subclass must provide.

**Practice targets:** Convert a general class into an abstract class, add an abstract method for price calculation, and implement that method in a concrete subclass such as Bread.

**Evidence target:** The abstract type captures common structure without pretending that every baked good uses the same pricing rule.`
				},
				{
					title: "Interfaces",
					content: `**Concept path:** Interfaces define capabilities without committing to one inheritance tree. A class can implement an interface to promise that certain methods exist, even when the class already extends another type.

**Practice targets:** Create a ForSale-style interface, implement its methods, and use Comparable or Comparator to order baked goods by a meaningful property such as ingredient count or price.

**Evidence target:** Interface-based code can operate on any object that provides the promised behavior, not just one specific class name.`
				},
				{
					title: "Enums",
					content: `**Concept path:** Enums represent a fixed set of named choices. They make code safer than loose strings when only a small number of values are valid.

**Practice targets:** Replace string-based categories with enum constants such as loaf sizes, pass enum values through constructors, and use switch expressions or conditionals where behavior depends on the chosen constant.

**Evidence target:** Invalid category names cannot be created by typo, and every valid enum value has a clear meaning in the program.`
				}
			],
			supplementalProjects: [
				classroomReferenceItem("records"),
				{
					title: "Review: Objects and Classes: Extension Challenge",
					content: buildSupportSectionGuidance({
						courseFamily: "Java Level 3",
						moduleTitle: "Review: Objects and Classes",
						section: "extension"
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ3-Student-Class",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ3-Student-Class"
				},
				{
					title: "Object Model Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "Java Level 3",
						moduleTitle: "AJ3 Review: Objects and Classes",
						itemTitle: "Object Model Transfer Practice",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/J3-03-aj3-review-objects-and-classes-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/J3-03-aj3-review-objects-and-classes-supplemental-2/solution"
				},
				{
					title: "Inheritance Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "Java Level 3",
						moduleTitle: "AJ3 Review: Objects and Classes",
						itemTitle: "Inheritance Extension Practice",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/J3-04-aj3-review-objects-and-classes-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/J3-04-aj3-review-objects-and-classes-supplemental-3/solution"
				}
			]
		},
		{
			title: "AJ4 Recursion",
			curriculum: [
				{
					title: "Recursion",
					content: `**Concept path:** Recursive methods solve a problem by calling themselves on a smaller version of the same problem. Each method needs a base case that stops the chain and a recursive case that moves toward that stop condition.

**Practice targets:** Identify the base case, identify what gets smaller, trace several calls by hand, and compare the recursive solution with an iterative loop when both versions are reasonable.

**Evidence target:** A recursive method is valid when every allowed input eventually reaches a base case and each returned value contributes to the larger answer correctly.`
				},
				{
					title: "Sum of the First N Numbers",
					content: `**Concept path:** Summing the first n numbers is a compact recursion example because sum(n) can be described as n plus sum(n - 1), with sum(1) as a natural stopping point.

**Practice targets:** Trace sum(4) or sum(5) as a stack of calls, then unwind the returns in the opposite direction. Compare that trace with a loop that accumulates the same total.

**Evidence target:** The trace shows both the downward call phase and the upward return phase, not just the final numeric answer.`
				},
				{
					title: "Call Stack",
					content: `**Concept path:** Every method call gets a stack frame containing its local variables and return location. Recursion creates many frames, so missing or unreachable base cases can produce stack overflow.

**Practice targets:** Draw stack frames for a short recursive call, label the parameter values in each frame, and identify exactly where execution resumes after a recursive call returns.

**Evidence target:** Stack reasoning explains why recursion can be elegant but not free: each call has memory and control-flow overhead.`
				},
				{
					title: "AJ4 Project 1: Recursion Practice",
					content: `**Project target:** Implement several recursive methods that use different recursive patterns: numeric countdown, digit decomposition, branching recursion, and string narrowing.

**Build path:** Create methods for exponents, factorials, digit sums, Fibonacci numbers, and palindrome checking. For each method, write the base case first, then define how the input moves closer to it.

**Evidence target:** Each method includes small test calls whose answers can be checked mentally, plus at least one edge case such as zero, one, an empty string, or a one-character string.`,
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ4-Recursion-Practice",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ4-Recursion-Practice"
				},
				{
					title: "AJ4 Project 2: Divisible by 7",
					content: `**Project target:** Implement a recursive divisibility-by-7 test that reduces a large number into a smaller value while preserving whether divisibility holds.

**Build path:** Encode the divisibility rule carefully, print or trace intermediate values during early testing, and stop at a small enough base case to decide true or false.

**Evidence target:** The method agrees with direct modulo checks for several positive numbers, including values that are divisible by 7, not divisible by 7, and already small.`,
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ4-Divisible-by-7",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ4-Divisible-by-7"
				}
			],
			supplementalProjects: [
				{
					title: "Recursion: Extension Challenge",
					content: buildSupportSectionGuidance({
						courseFamily: "Java Level 3",
						moduleTitle: "Recursion",
						section: "extension"
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ4-Recursion-Practice",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ4-Recursion-Practice"
				},
				{
					title: "Recursive Trace Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "Java Level 3",
						moduleTitle: "AJ4 Recursion",
						itemTitle: "Recursive Trace Transfer Practice",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/J3-05-aj4-recursion-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/J3-05-aj4-recursion-supplemental-2/solution"
				},
				{
					title: "Recursive Backtracking Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "Java Level 3",
						moduleTitle: "AJ4 Recursion",
						itemTitle: "Recursive Backtracking Extension Practice",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/J3-06-aj4-recursion-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/J3-06-aj4-recursion-supplemental-3/solution"
				}
			]
		},
		{
			title: "AJ5 Linear Search and Big-O Notation",
			curriculum: [
				{
					title: "Linear Search",
					content: `**Concept path:** Linear search scans a collection one item at a time. It works on unsorted data, sorted data, arrays, ArrayLists, and many other sequential structures because it makes no ordering assumption.

**Practice targets:** Trace searches where the target is first, middle, last, and missing. Return either the matching index, the matching value, or a boolean result depending on the method contract.

**Contract check:** Decide what the method promises before writing the loop. A method that returns an index does not also print the answer, and a method that returns true or false keeps location details out of the contract when the caller only needs membership.

**Evidence target:** Runtime reasoning distinguishes best case, worst case, and average case rather than treating every search as the same amount of work. A strong trace names how many comparisons happened and why the loop stopped.`
				},
				{
					title: "AJ5 Project 1: Linear Search Implementation",
					content: `**Project target:** Implement a linear search method with a clear contract: return the target index when found and -1 when absent.

**Build path:** Traverse from left to right, check each element once, return immediately when the target is found, and return -1 only after the loop finishes without a match.

**Evidence target:** Tests cover the first index, a later index, repeated values, a missing value, and an empty array if the method accepts one.`,
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ5-Linear-Search",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ5-Linear-Search"
				},
				{
					title: "Introduction to Big-O Analysis",
					content: `**Concept path:** Big-O notation describes how runtime or memory use grows as input size grows. It ignores constant factors and lower-order terms so algorithms can be compared by their long-term growth pattern.

**Practice targets:** Classify constant, logarithmic, linear, linearithmic, quadratic, and exponential patterns. Simplify expressions by keeping the dominant term and dropping constants.

**Comparison habit:** Use the same input variable when comparing algorithms. Searching one array of size n and then sorting a different list of size m uses separate labels unless the relationship between n and m is stated.

**Evidence target:** A runtime claim is tied to a counted operation, a variable input size, and a reason the dominant term controls growth. The explanation predicts what changes when the input doubles.`
				},
				{
					title: "AJ5 Project 2: Big-O Practice",
					content: `**Project target:** Analyze runtime expressions and connect each simplified Big-O result to a concrete algorithm pattern.

**Build path:** For each expression, identify the dominant term, remove constants, and explain what kind of code shape could produce that growth, such as one loop, nested loops, repeated halving, or recursive branching.

**Evidence target:** The explanation is stronger than the label alone because it links the notation to a real control-flow pattern.`,
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ5-Big-O-Practice-Starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ5-Big-O-Practice"
				}
			],
			supplementalProjects: [
				{
					title: "Linear Search and Big O Notation: Extension Challenge",
					content: buildSupportSectionGuidance({
						courseFamily: "Java Level 3",
						moduleTitle: "Linear Search and Big O Notation",
						section: "extension"
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ5-Linear-Search",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/AJ5-Linear-Search"
				},
				{
					title: "Search Runtime Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "Java Level 3",
						moduleTitle: "AJ5 Linear Search and Big-O Notation",
						itemTitle: "Search Runtime Transfer Practice",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/J3-07-aj5-linear-search-and-big-o-notation-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/J3-07-aj5-linear-search-and-big-o-notation-supplemental-2/solution"
				},
				{
					title: "Runtime Comparison Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "Java Level 3",
						moduleTitle: "AJ5 Linear Search and Big-O Notation",
						itemTitle: "Runtime Comparison Extension Practice",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/J3-08-aj5-linear-search-and-big-o-notation-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/J3-08-aj5-linear-search-and-big-o-notation-supplemental-3/solution"
				}
			]
		},
		buildJavaBinarySearchModule(),
		buildJavaCheckIn1Module(),
		buildJavaElementarySortingModule(),
		buildJavaBubbleSortModule(),
		buildJavaMergeSortingModule(),
		buildJavaCheckIn2Module(),
		buildJavaSustainableProgrammingModule(),
		buildJavaLinkedListModule(),
		buildJavaStackQueueModule(),
		buildJavaPriorityMapModule(),
		buildJavaCheckIn3Module(),
		buildJavaBinaryTreeModule(),
		buildJavaHashTableModule(),
		buildJavaGraphModule(),
		buildJavaCheckIn4Module(),
		buildJavaStreetSearcherModule(),
		buildJavaReferenceLibraryModule(),
		buildJavaPackageReviewModule(),
		buildJavaCollectionsModule(),
		buildJavaPipelinesModule(),
		buildJavaConcurrencySimulationModule(),
		{
			id: "java-level-3-pending-demo-media",
			title: "Project Walkthroughs",
			kind: "appendix",
			curriculum: [
				{
					id: "java-level-3-pending-demo-media-curriculum-pending-java-level-3-demo-media",
					title: "Written Project Walkthroughs",
					content: [
						"- [Binary search with iteration](/courses#java-level-3-aj6-binary-search-java-level-3-aj6-binary-search-curriculum-aj6-project-1-binary-search-with-iteration)",
						"- [Merge Sort](/courses#java-level-3-aj9-merge-sort-java-level-3-aj9-merge-sort-curriculum-aj9-project-3-merge-sort)",
						"- [Binary search trees](/courses#java-level-3-aj14-binary-search-trees-java-level-3-aj14-binary-search-trees-curriculum-binary-search-trees)",
						"- [Street Searcher completion checks](/courses#java-level-3-aj17-master-project-google-maps-java-level-3-aj17-master-project-google-maps-curriculum-street-searcher-capstone-definition-of-done)"
					].join("\n")
				}
			],
			supplementalProjects: []
		}
	]
};

const JAVA_LEVEL_3_OPTIONAL_MODULES = new Set([
	"AJ1 Review: Variables, Strings, and Input",
	"AJ2 Review: Arrays and ArrayLists",
	"AJ3 Review: Objects and Classes",
	"AJ8 Bubble Sort",
	"AJ18 Repo Extension, Starter, and Capstone Library"
]);

const JAVA_LEVEL_3_ADVANCED_MODULES = new Set([
	"AJ19 Post-C++ Java Tooling, Testing, and Packages",
	"AJ20 Generics, Interfaces, and Collection API Design",
	"AJ21 Streams, Files, and Data Pipelines",
	"AJ22 Concurrency, Services, and Capstone Architecture"
]);

const JAVA_LEVEL_3_ARCHIVE_ITEMS = new Set(["Check-In #2: Bubble Sort"]);

const JAVA_LEVEL_3_SECONDARY_PROJECTS = new Set([
	"AJ4 Project 2: Divisible by 7",
	"AJ5 Project 2: Big-O Practice",
	"AJ6 Project 2: Binary Search with Recursion",
	"AJ6 Project 3: Precise Square Roots",
	"Check-In #1: Additional Practice Project",
	"Check-In #2: Additional Practice Project",
	"AJ10 Project 2: Anything Array",
	"AJ10 Project 3: Exception Practice",
	"AJ11 Project 2: Doubly Linked List",
	"Check-In #3: Additional Practice Project",
	"AJ14 Project 3: BST Clear and Remove",
	"AJ15 Project 2: Mini Search Engine",
	"Check-In #4: Additional Practice Project"
]);

const JAVA_LEVEL_3_MODULE_FLOW: Record<
	string,
	{
		estimatedTime: string;
		keyBlocks: string[];
		flowNote: string;
	}
> = {
	"AJ0 Visual Foundations Audit": {
		estimatedTime: "2 sessions · 45–60 minutes each",
		keyBlocks: [
			"Java 21",
			"clean build",
			"repeatable tests",
			"seeded fixture",
			"measurement record"
		],
		flowNote:
			"Use the visual-object audit as a short placement gate, then pin the algorithm lab to Java 21 with clean builds, warnings, repeatable tests, seeded data, and recorded measurement conditions. Select prerequisite review from the optional archive only when the evidence identifies a gap."
	},
	"AJ4 Recursion": {
		estimatedTime: "3 sessions · 45–60 minutes each",
		keyBlocks: [
			"base case",
			"decreasing measure",
			"call stack",
			"input domain",
			"iterative comparison"
		],
		flowNote:
			"State the input domain, base case, and quantity that strictly decreases before coding. Trace calls and returns, test the smallest accepted inputs and one rejected input, and compare the recursive design with a loop when recursion adds stack cost without clearer structure."
	},
	"AJ5 Linear Search and Big-O Notation": {
		estimatedTime: "3 sessions · 45–60 minutes each",
		keyBlocks: [
			"search contract",
			"comparison count",
			"best and worst case",
			"growth variable",
			"bounded empirical claim"
		],
		flowNote:
			"Define the search return contract and count comparisons on empty, first, middle, last, duplicate, and missing cases. Keep asymptotic reasoning separate from timings: Big-O follows from the algorithm, while measurements only describe the recorded implementation, fixture, and environment."
	},
	"AJ6 Binary Search": {
		estimatedTime: "3 sessions · 45–60 minutes each",
		keyBlocks: [
			"sorted precondition",
			"low-high invariant",
			"safe midpoint",
			"strict interval shrink",
			"missing target"
		],
		flowNote:
			"Verify or document sorted input, maintain an inclusive low-high invariant, calculate the midpoint without overflow, and move past it after every miss. Test empty, one-element, even, odd, duplicate, first, last, below-range, above-range, and missing targets."
	},
	"Check-In #1": {
		estimatedTime: "2 sessions · 45–60 minutes each",
		keyBlocks: [
			"recursive trace",
			"linear-search contract",
			"binary-search invariant",
			"growth explanation",
			"targeted reteach"
		],
		flowNote:
			"Use prediction, implementation, and boundary evidence to distinguish recursion, linear search, binary search, and growth analysis. Assign only the transfer item tied to an observed weakness before sorting begins."
	},
	"AJ7 Selection and Insertion Sort": {
		estimatedTime: "4 sessions · 45–60 minutes each",
		keyBlocks: [
			"sorted prefix",
			"loop invariant",
			"comparison count",
			"swap or shift",
			"stability claim"
		],
		flowNote:
			"Trace the sorted prefix and remaining region after every outer iteration. Verify sortedness and element preservation on empty, one-value, sorted, reverse, duplicate, and negative-value fixtures; claim stability or in-place behavior only when the implementation proves it."
	},
	"AJ9 Merge Sort": {
		estimatedTime: "4 sessions · 45–60 minutes each",
		keyBlocks: [
			"divide",
			"merge invariant",
			"temporary storage",
			"permutation oracle",
			"measurement protocol"
		],
		flowNote:
			"Build and test merge independently before recursion composes it into merge sort. Use an oracle for sortedness, element counts, duplicates, and idempotence, then compare algorithms with fixed seeded fixtures, warm-up, repeated runs, and bounded conclusions."
	},
	"Check-In #2": {
		estimatedTime: "2 sessions · 45–60 minutes each",
		keyBlocks: [
			"selection trace",
			"insertion trace",
			"merge trace",
			"sort oracle",
			"complexity explanation"
		],
		flowNote:
			"Demonstrate selection, insertion, and merge-sort invariants plus one property-based sort check. Bubble sort remains available as optional comparison material, not a prerequisite for the data-structure sequence."
	},
	"AJ10 Sustainable Programming": {
		estimatedTime: "4 sessions · 45–60 minutes each",
		keyBlocks: [
			"ownership boundary",
			"generic contract",
			"no raw type",
			"specific exception",
			"refactor test"
		],
		flowNote:
			"Treat maintainability as explicit ownership, type, and failure contracts. Use nested types only when ownership is clearer, generics without raw types or unchecked casts, and exceptions at recoverable boundaries; preserve behavior with characterization tests during refactoring."
	},
	"AJ11 Linked Lists": {
		estimatedTime: "4 sessions · 45–60 minutes each",
		keyBlocks: [
			"head and tail",
			"size invariant",
			"link ownership",
			"empty transition",
			"reachability trace"
		],
		flowNote:
			"Draw references before changing them and maintain explicit head, tail, size, and reachability invariants. Test empty-to-one, one-to-empty, front, middle, end, duplicate, and missing operations without losing nodes or retaining removed links."
	},
	"AJ12 Stacks and Queues": {
		estimatedTime: "3 sessions · 45–60 minutes each",
		keyBlocks: [
			"LIFO",
			"FIFO",
			"ArrayDeque",
			"empty policy",
			"operation sequence"
		],
		flowNote:
			"Model LIFO and FIFO behavior through operation sequences and use `ArrayDeque` for ordinary stack and queue clients. Define the empty-structure policy, avoid storing `null`, and test interleaved operations rather than isolated pushes or enqueues."
	},
	"AJ13 Priority Queues and Maps": {
		estimatedTime: "4 sessions · 45–60 minutes each",
		keyBlocks: [
			"priority comparator",
			"deterministic tie breaker",
			"map key contract",
			"missing key",
			"duplicate update"
		],
		flowNote:
			"Derive collection choice from required operations. Priority queues need a total comparator with deterministic ties; maps need stable key equality and a duplicate policy. Test empty, tie, missing, duplicate, update, and removal behavior without relying on iteration order."
	},
	"Check-In #3": {
		estimatedTime: "2 sessions · 45–60 minutes each",
		keyBlocks: [
			"linked invariant",
			"stack sequence",
			"queue sequence",
			"priority tie",
			"map lookup"
		],
		flowNote:
			"Use one invariant trace and one transfer implementation for linked lists, stacks, queues, priority queues, and maps. Continue only after empty-state and boundary behavior can be explained from the chosen representation."
	},
	"AJ14 Binary Search Trees": {
		estimatedTime: "5 sessions · 45–60 minutes each",
		keyBlocks: [
			"BST ordering",
			"duplicate policy",
			"recursive traversal",
			"root replacement",
			"size invariant"
		],
		flowNote:
			"Document ordering and duplicate policy before insertion, then preserve reachability and size through search and traversal. Test empty, root, leaf, one-child, two-child, missing, duplicate, skewed, and balanced cases before attempting optional removal."
	},
	"AJ15 Hash Tables": {
		estimatedTime: "5 sessions · 45–60 minutes each",
		keyBlocks: [
			"equals and hashCode",
			"bucket index",
			"collision policy",
			"load factor",
			"rehash invariant"
		],
		flowNote:
			"Treat hashing as a key contract plus collision and resize policies. Map every hash code safely to a bucket, preserve all entries through rehashing, and verify collisions, updates, removals, negative hashes, threshold boundaries, and equality-equivalent keys."
	},
	"AJ16 Graphs": {
		estimatedTime: "5 sessions · 45–60 minutes each",
		keyBlocks: [
			"vertex identity",
			"edge direction",
			"nonnegative weight",
			"disconnected graph",
			"predecessor path"
		],
		flowNote:
			"Define vertex identity, edge direction, duplicate-edge policy, and weight domain before traversal. Dijkstra uses nonnegative weights, overflow-aware distances, stale-priority-entry handling, and explicit unreachable results; verify path and total cost on deterministic fixtures."
	},
	"Check-In #4": {
		estimatedTime: "2 sessions · 45–60 minutes each",
		keyBlocks: [
			"tree invariant",
			"hash collision",
			"rehash trace",
			"graph model",
			"shortest-path proof"
		],
		flowNote:
			"Prove one tree invariant, one collision-and-resize sequence, and one graph shortest-path result before capstone work. Use failed evidence to select focused practice rather than repeating every structure project."
	},
	"AJ17 Master Project: Google Maps": {
		estimatedTime: "8–10 sessions · 45–60 minutes each",
		keyBlocks: [
			"course-owned graph data",
			"validated loader",
			"route result",
			"deterministic oracle",
			"portfolio evidence"
		],
		flowNote:
			"Build a local street-searcher over course-owned or openly licensed fixture data without live location collection or external routing services. Separate loading, graph storage, shortest-path logic, route reconstruction, and presentation, then prove route and cost against small hand-computed graphs."
	}
};

function javaLevel3SupplementalPath(title: string) {
	return /extension|challenge|recursive|square root|doubly|remove|mini search|concurr|capstone|open addressing|chaining/i.test(
		title
	)
		? ("challenge" as const)
		: ("choice" as const);
}

function strengthenJavaLevel3Item(
	item: RawCourseModuleItem
): RawCourseModuleItem {
	if (item.title === "Binary Search") {
		return {
			...item,
			content: `${item.content}

**Implementation contract:** Use \`low + (high - low) / 2\` for the midpoint, move the selected bound past \`mid\`, and return the documented missing result only after the interval is empty.`
		};
	}

	return item;
}

function insertJavaLevel3Item(
	items: RawCourseModuleItem[],
	beforeTitle: string,
	item: RawCourseModuleItem
) {
	const index = items.findIndex(candidate => candidate.title === beforeTitle);
	if (index === -1) return [...items, item];
	return [...items.slice(0, index), item, ...items.slice(index)];
}

function decorateJavaLevel3Module(
	module: RawCourse["modules"][number]
): RawCourse["modules"][number] {
	const flow = JAVA_LEVEL_3_MODULE_FLOW[module.title];
	const movedProjects = module.curriculum.filter(
		item =>
			JAVA_LEVEL_3_SECONDARY_PROJECTS.has(item.title) &&
			!isCoreProjectTitle(item.title)
	);
	let curriculum: RawCourseModuleItem[] = module.curriculum
		.filter(
			item =>
				!movedProjects.includes(item) &&
				!JAVA_LEVEL_3_ARCHIVE_ITEMS.has(item.title)
		)
		.map(strengthenJavaLevel3Item)
		.map(item => ({
			...item,
			learningPath: "core" as const
		}));

	if (module.title === "AJ0 Visual Foundations Audit") {
		curriculum.push({
			title: "Java 21 Algorithm Lab Readiness",
			content: [
				"**Completion evidence:**",
				"- Record the pinned Java 21 runtime and compiler versions, run a clean build with `javac -Xlint:all` or the repository's equivalent warning gate, and remove stale class output before rerunning.",
				"- Execute repeatable tests through the existing project runner; use JUnit 5 when configured, otherwise use a deterministic assertion harness until it is.",
				"- Generate fixtures with a fixed seed and record input size, distribution, warm-up, repetitions, elapsed-time method, and environment for any benchmark.",
				"- State clearly that timing evidence describes the measured implementation and does not establish an asymptotic complexity class by itself."
			].join("\n"),
			learningPath: "core"
		});
	}

	if (module.title === "AJ4 Recursion") {
		curriculum = insertJavaLevel3Item(
			curriculum,
			"AJ4 Project 1: Recursion Practice",
			{
				title: "Recursion Termination and Equivalence Contract",
				content: [
					"**Completion evidence:**",
					"- Document accepted inputs, rejected inputs, base cases, and the integer or structural measure that strictly decreases on every recursive call.",
					"- Trace call and return frames for zero or empty, one-step, ordinary, and invalid cases.",
					"- Compare each recursive result with a simple independent oracle or iterative implementation on a bounded fixture set.",
					"- Set a deliberate input limit when recursion depth can exceed the practical stack budget; invalid input does not recurse indefinitely."
				].join("\n"),
				learningPath: "core"
			}
		);
	}

	if (module.title === "AJ9 Merge Sort") {
		curriculum.push({
			title: "Sorting Oracle and Measurement Contract",
			content: [
				"**Completion evidence:**",
				"- Test empty, one-value, sorted, reverse, duplicate-heavy, negative, and extreme-value fixtures.",
				"- Verify nondecreasing order, unchanged element counts, idempotence, and stability only when the implementation claims stability.",
				"- Compare results with `Arrays.sort()` on copied fixtures while preserving the original input for permutation checks.",
				"- Benchmarks use fixed seeded data, identical input copies, warm-up, repeated runs, recorded environment, and conclusions limited to the measured range; timing evidence does not establish an asymptotic complexity class."
			].join("\n"),
			learningPath: "core"
		});
	}

	if (module.title === "AJ10 Sustainable Programming") {
		curriculum.push({
			title: "Maintainability, Type, and Failure Contract",
			content: [
				"**Completion evidence:**",
				"- A nested type has a documented ownership reason; otherwise it remains a separate class.",
				"- Generic APIs explain the type parameter, work with at least two concrete types, and introduce no raw types or unjustified unchecked casts.",
				"- Expected invalid input is validated, recoverable exceptions are caught specifically at a useful boundary, and programming errors are not hidden.",
				"- Characterization tests capture behavior before one refactor and prove the intended behavior remains afterward."
			].join("\n"),
			learningPath: "core"
		});
	}

	curriculum = curriculum.map((item, index) => ({
		...item,
		content:
			index === 0
				? `**Course flow:** ${flow.flowNote}\n\n${item.content}`
				: item.content
	}));

	return {
		...module,
		estimatedTime: flow.estimatedTime,
		keyBlocks: flow.keyBlocks,
		curriculum,
		supplementalProjects: [
			...module.supplementalProjects,
			...movedProjects
		].map(item => ({
			...item,
			learningPath: javaLevel3SupplementalPath(item.title)
		}))
	};
}

function buildJavaLevel3PlacementArchive(
	modules: RawCourse["modules"]
): RawCourse["modules"][number] {
	const extractedItems = javaLevel3SourceCourse.modules
		.flatMap(module => module.curriculum)
		.filter(item => JAVA_LEVEL_3_ARCHIVE_ITEMS.has(item.title));

	return {
		id: "java-level-3-optional-java-foundations-bubble-sort-and-reference-archive",
		kind: "appendix",
		title: "Java Foundations Reference Archive",
		estimatedTime:
			"Choose only the review or comparison material indicated by evidence",
		keyBlocks: [
			"syntax review",
			"collection review",
			"OOP review",
			"bubble-sort comparison",
			"capstone reference"
		],
		curriculum: [
			{
				title: "Placement and Reference Archive Guide",
				content:
					"**Course flow:** AJ1 Review: Variables, Strings, and Input; AJ2 Review: Arrays and ArrayLists; AJ3 Review: Objects and Classes; AJ8 Bubble Sort; and AJ18 Repo Extension, Starter, and Capstone Library are optional. Use AJ0 or a check-in to name the gap, select the smallest matching item, record the new evidence, and return to the required sequence.",
				learningPath: "core"
			},
			...modules.flatMap(module =>
				module.curriculum
					.filter(item => !JAVA_LEVEL_3_ARCHIVE_ITEMS.has(item.title))
					.map(item => ({
						...item,
						learningPath: "core" as const
					}))
			),
			...extractedItems.map(item => ({
				...item,
				learningPath: "core" as const
			}))
		],
		supplementalProjects: modules.flatMap(module =>
			module.supplementalProjects.map(item => ({
				...item,
				learningPath: javaLevel3SupplementalPath(item.title)
			}))
		)
	};
}

function buildAdvancedJavaEngineeringArchive(
	modules: RawCourse["modules"]
): RawCourse["modules"][number] {
	return {
		kind: "appendix",
		title: "Optional Advanced Java Engineering Sequence",
		estimatedTime:
			"Follow AJ19–AJ22 in order as a post-course continuation",
		keyBlocks: [
			"packages and tests",
			"generic API",
			"typed data pipeline",
			"bounded executor",
			"service architecture"
		],
		curriculum: [
			{
				title: "Advanced Java Engineering Sequence Guide",
				content: [
					"**Course flow:**",
					"",
					"1. **AJ19 Post-C++ Java Tooling, Testing, and Packages** establishes the build, package, test, and repository workflow.",
					"2. **AJ20 Generics, Interfaces, and Collection API Design** develops reusable type-safe APIs.",
					"3. **AJ21 Streams, Files, and Data Pipelines** connects collections to bounded file-processing workflows.",
					"4. **AJ22 Concurrency, Services, and Capstone Architecture** completes the sequence with controlled concurrency and service design.",
					"",
					"**Entry and safety boundary:** This optional continuation follows the Street Searcher capstone when deeper Java engineering is the next goal. It uses Java 21, clean package/build/test boundaries, UTF-8 temporary fixtures, no raw generic types, bounded executors, explicit shutdown and interrupt policy, deterministic reports, and no real personal or credential data."
				].join("\n"),
				learningPath: "core"
			}
		],
		supplementalProjects: modules.flatMap(module =>
			[...module.curriculum, ...module.supplementalProjects].map(
				item => ({
					...item,
					learningPath: javaLevel3SupplementalPath(item.title)
				})
			)
		)
	};
}

const javaLevel3PrimaryModules = javaLevel3SourceCourse.modules
	.filter(
		module =>
			!JAVA_LEVEL_3_OPTIONAL_MODULES.has(module.title) &&
			!JAVA_LEVEL_3_ADVANCED_MODULES.has(module.title) &&
			module.id !== "java-level-3-pending-demo-media"
	)
	.map(decorateJavaLevel3Module);
const javaLevel3PlacementArchiveModules = javaLevel3SourceCourse.modules
	.filter(module => JAVA_LEVEL_3_OPTIONAL_MODULES.has(module.title))
	.map(completeJavaFoundationReview);
const javaLevel3AdvancedModules = javaLevel3SourceCourse.modules.filter(
	module => JAVA_LEVEL_3_ADVANCED_MODULES.has(module.title)
);
const javaLevel3WalkthroughModule = javaLevel3SourceCourse.modules.at(-1)!;

const previousJavaPracticeModules = new Set([
	"AJ1 Review: Variables, Strings, and Input",
	"AJ3 Review: Objects and Classes",
	"AJ4 Recursion",
	"AJ5 Linear Search and Big-O Notation",
	"AJ6 Binary Search",
	"Check-In #1",
	"AJ7 Selection and Insertion Sort",
	"AJ8 Bubble Sort",
	"AJ9 Merge Sort",
	"Check-In #2",
	"AJ10 Sustainable Programming",
	"AJ11 Linked Lists",
	"AJ13 Priority Queues and Maps",
	"Check-In #3",
	"AJ14 Binary Search Trees",
	"AJ15 Hash Tables",
	"AJ16 Graphs",
	"Check-In #4",
	"AJ17 Master Project: Google Maps"
]);

function previousJavaProgressSlug(value: string) {
	return value
		.toLowerCase()
		.normalize("NFKD")
		.replace(/[\u0300-\u036F]/g, "")
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-+|-+$/g, "");
}

for (const module of [
	...javaLevel3PrimaryModules,
	...javaLevel3PlacementArchiveModules
]) {
	if (!previousJavaPracticeModules.has(module.title)) continue;
	const previousTopic = module.title.replace(/^AJ\d+ (?:Review: )?/u, "");
	const previousModuleId = previousJavaProgressSlug(
		`java-level-3-${module.title}`
	);
	for (const item of module.supplementalProjects) {
		const practiceNumber = item.projectLink?.match(
			/-supplemental-([23])\/starter$/u
		)?.[1];
		if (!practiceNumber) continue;
		const purpose = practiceNumber === "2" ? "Transfer" : "Extension";
		const previousId = previousJavaProgressSlug(
			`${previousModuleId}-supplemental-${purpose} Practice: ${previousTopic}`
		);
		item.aliases = [...new Set([...(item.aliases ?? []), previousId])];
	}
}

export const javaLevel3Course: RawCourse = {
	...javaLevel3SourceCourse,
	modules: [
		...javaLevel3PrimaryModules
			.map(completeJavaRecursionModule)
			.map(completeJavaSearchModule),
		buildJavaLevel3PlacementArchive(javaLevel3PlacementArchiveModules),
		buildAdvancedJavaEngineeringArchive(javaLevel3AdvancedModules),
		{
			...javaLevel3WalkthroughModule,
			kind: "appendix",
			estimatedTime: "Reference only",
			keyBlocks: ["worked examples", "project checks"],
			curriculum: javaLevel3WalkthroughModule.curriculum.map(item => ({
				...item,
				learningPath: "core"
			}))
		}
	]
};
