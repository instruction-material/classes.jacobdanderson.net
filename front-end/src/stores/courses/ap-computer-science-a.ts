import type { RawCourse, RawCourseModuleItem } from "./types";
import { gitCourseGuideLink } from "./classroomReferenceGuides";
import {
	staticMediaFilename,
	withPendingStaticMediaNotice
} from "./staticMedia";

const APCS_REPO_BASE = "https://github.com/instruction-material/APCS/tree/main";
const STATIC_MEDIA_BASE = "https://static.classes.jacobdanderson.net";
const BARRONS_TEXTBOOK =
	"https://www.simonandschuster.com/books/AP-Computer-Science-A-Premium-13th-Edition-Prep-Book-with-6-Practice-Tests-%2B-Comprehensive-Review/Roselyn-Teukolsky/Barrons-AP-Prep/9798349700354";
const AP_2022_FRQ =
	"https://apcentral.collegeboard.org/media/pdf/ap22-frq-computer-science-a.pdf";
const AP_2022_FRQ_SCORING =
	"https://apcentral.collegeboard.org/media/pdf/ap22-sg-computer-science-a.pdf";
const AP_2026_FRQ =
	"https://apcentral.collegeboard.org/media/pdf/ap26-frq-computer-science-a.pdf";
const AP_CSA_CED =
	"https://apcentral.collegeboard.org/media/pdf/ap-computer-science-a-course-and-exam-description.pdf";
const AP_CSA_EXAM =
	"https://apcentral.collegeboard.org/courses/ap-computer-science-a/exam";
const AP_CSA_QUICK_REFERENCE =
	"https://apcentral.collegeboard.org/media/pdf/ap-computer-science-a-java-quick-reference.pdf";
const AP_FRQ_ARCHIVE =
	"https://apcentral.collegeboard.org/courses/ap-computer-science-a/exam/past-exam-questions";
const APCS_README =
	"https://github.com/instruction-material/APCS/blob/main/README.md";
const APCS_TRACKS_GUIDE = "/course-assets/apcs/apcs-pacing-tracks.md";
const WINDOWS_VSCODE_JAVA_SETUP = `
This checklist supports Java setup on Windows with VS Code:

1. Install a full JDK, not only a Java Runtime. The tested setup uses Eclipse Temurin JDK 21:

\`\`\`powershell
winget install --id EclipseAdoptium.Temurin.21.JDK -e --accept-package-agreements --accept-source-agreements
\`\`\`

2. Close and reopen PowerShell and VS Code after installation so Windows refreshes \`PATH\` and \`JAVA_HOME\`.

3. Install the VS Code Java Extension Pack:

\`\`\`powershell
code --install-extension vscjava.vscode-java-pack
\`\`\`

4. Verify the toolchain from a new PowerShell window:

\`\`\`powershell
java -version
javac -version
echo $env:JAVA_HOME
where.exe java
where.exe javac
\`\`\`

Put the Eclipse Adoptium JDK path before any old Oracle \`javapath\` entry. If Java reports a missing registry key,
missing \`java.dll\`, or missing Java SE Runtime, move the Eclipse Adoptium \`bin\` folder above
\`C:\\ProgramData\\Oracle\\Java\\javapath\` in the system \`Path\`, or remove the old Oracle entry.

5. Open one assignment folder at a time in VS Code, for example:

\`\`\`powershell
code .\\APCS1-Variables-Reference
\`\`\`

Most APCS projects use the default Java package and a \`Main.java\` file, so opening the whole APCS repo can confuse VS Code's
Java runner. For terminal runs, use \`javac Main.java && java Main\` in a single-file assignment, or \`javac *.java && java Main\`
for folders with multiple Java files.

If VS Code still will not run Java, reopen only the assignment folder, re-check \`java -version\` and \`javac -version\`, then run
\`Java: Clean Java Language Server Workspace\` from the VS Code Command Palette.
`.trim();

const repo = (path: string) => `${APCS_REPO_BASE}/${path}`;
const media = (file: string) => `${STATIC_MEDIA_BASE}/${file}`;

function applyApcsPendingMediaNotices(course: RawCourse) {
	for (const module of course.modules) {
		for (const item of [
			...module.curriculum,
			...module.supplementalProjects
		]) {
			if (!item.mediaLink) continue;

			const filename = staticMediaFilename(item.mediaLink);
			if (!filename) continue;

			item.content = withPendingStaticMediaNotice(item.content, filename);
		}
	}
}

function apConcept({
	evidence,
	focus,
	practice
}: {
	evidence: string;
	focus: string;
	practice: string[];
}) {
	return [
		`**Concept path:** ${focus}`,
		`**Practice sequence:**\n${practice.map((step, index) => `${index + 1}. ${step}`).join("\n")}`,
		`**Evidence:** ${evidence}`
	].join("\n\n");
}

function apProject({
	apReasoning,
	checks,
	extension,
	goal,
	steps
}: {
	apReasoning: string;
	checks: string[];
	extension?: string;
	goal: string;
	steps: string[];
}) {
	return [
		`**Goal:** ${goal}`,
		`**Build path:**\n${steps.map((step, index) => `${index + 1}. ${step}`).join("\n")}`,
		`**AP CSA Java reasoning:** ${apReasoning}`,
		`**Checks:**\n${checks.map(check => `- ${check}`).join("\n")}`,
		extension ? `**Extension:** ${extension}` : ""
	]
		.filter(Boolean)
		.join("\n\n");
}

const apComputerScienceASourceCourse: RawCourse = {
	name: "AP Computer Science A",
	modules: [
		{
			title: "General: Course Introduction and Setup",
			curriculum: [
				{
					title: "Course Positioning",
					content:
						"AP Computer Science A is a Java course built around problem solving, object-oriented design, arrays, ArrayLists, inheritance, recursion, and exam-style tracing. It functions as both a real programming class and a specific AP exam prep track."
				},
				{
					title: "Visual Java Bridge",
					content:
						"The revised Java Level 1 path carries Karel and BlueJ habits into AP CSA: track object state, predict method effects, and read compiler feedback carefully. Visual tools do not replace AP evidence; each visual demonstration becomes a written trace, console trace, or FRQ-style explanation before exam practice."
				},
				{
					title: "Track Guide",
					content: [
						"The APCS track guide is the course pacing readme. It separates the course into Slow/Supported, Medium/Standard, Fast/Quick, Hard/Challenge, and Exam-focused tracks, with concrete module decisions, project-load choices, and advancement rules for each route.",
						"The placement checkpoints in the guide connect route choice to evidence: recent code, Java-specific mistakes, hand tracing, object-state explanations, and AP-style written reasoning.",
						"**Fast-placement rule:** APCS1-4 can serve mostly as diagnostics for an experienced Python or C++ background. Backfill only Java-specific gaps such as `.equals()` versus `==`, integer division, casting, `Scanner`, `Math.random()`, file/class naming, and AP-style tracing.",
						"**Core-route rule:** Do not skip APCS5-8, APCS10-12, or APCS13-16 completely. These modules contain the AP-specific Java object model, inheritance/polymorphism, arrays/ArrayLists, wrapper constraints, recursion, runtime, searching, and sorting.",
						"**Challenge rule:** When APCS work is too easy, keep the AP concept but upgrade the artifact: add validation, multiple classes, test cases, file input, a menu loop, edge-case writeups, or an FRQ-style explanation."
					].join("\n\n"),
					datasetLink: APCS_TRACKS_GUIDE
				},
				{
					title: "Java Toolchain and Workflow",
					content:
						"Standardize on a full JDK, not just a runtime, with fast compile-run cycles in `IntelliJ IDEA`, `VS Code`, or an equivalent editor. The workflow supports short iterations, print debugging, and tracing without environment friction. Java 17 or newer is fine for AP CSA work; the current Windows VS Code setup guide has been tested with Eclipse Temurin JDK 21."
				},
				{
					title: "Windows VS Code Java Setup",
					content: WINDOWS_VSCODE_JAVA_SETUP,
					projectLink: APCS_README
				},
				{
					title: "Required Textbook",
					content:
						"Use Barron's AP Computer Science A Premium, 13th Edition for chapter-based multiple choice and free-response practice aligned to the 2026 exam outline. Keep the textbook aligned with the course sequence instead of treating it as a separate study track. The useful pattern is to read or review the relevant chapter section after the Java concept appears in code, then answer a small set of questions with written justification. Mark any missed question by concept: syntax, tracing, object state, array/list traversal, recursion, runtime, or AP wording. Revisit those marks before each check-in so textbook practice feeds back into code work.",
					projectLink: BARRONS_TEXTBOOK
				},
				{
					title: "Reference Pack",
					content:
						"The reference projects for variables, strings, and casting establish a clean notes-and-sandbox workflow from day one. They separate Java syntax issues from actual concept gaps before the first graded-style projects. Use these references as fast comparison examples: first predict what the program prints, then run it, then explain any mismatch using Java vocabulary. A completed pass identifies variable type, expression result type, printed spacing, and any cast or truncation that changes the value. Keep the comparison small enough that one rule is visible at a time.",
					projectLink: repo("APCS1-Variables-Reference/starter"),
					solutionLink: repo("APCS1-Variables-Reference/solution")
				}
			],
			supplementalProjects: [
				{
					title: "Strings and Printing Reference",
					content:
						"This reference build reinforces output formatting, concatenation, escape characters, and readable console output. The checkpoint is being able to predict the exact printed text, including spaces, quotation marks, and line breaks. Use it when a project result is logically correct but visually messy. The expected evidence is a before/after output comparison and a short note explaining which part came from a literal string, which part came from a variable, and where `print` versus `println` changes the layout. This prevents formatting bugs from hiding otherwise correct logic.",
					projectLink: repo(
						"APCS1-Strings-and-Printing-Reference/starter"
					),
					solutionLink: repo(
						"APCS1-Strings-and-Printing-Reference/solution"
					)
				},
				{
					title: "Casting Reference",
					content:
						"This reference build gives a tighter review of integer division, explicit casts, and loss-of-precision reasoning. It explains when Java truncates automatically, when an explicit cast is required, and what information is lost. Use it before rounding, quotient/remainder, or expression-tracing work. A strong check traces the expression twice: once with the original operand types and once after the cast, so the final answer is tied to Java's evaluation rules instead of calculator intuition. Include at least one negative or non-even division case when reviewing.",
					projectLink: repo("APCS1-Casting-Reference/starter"),
					solutionLink: repo("APCS1-Casting-Reference/solution")
				},
				{
					title: "2020 Practice Exam",
					content:
						"Keep the repo practice exam available as a later-course benchmark, but introduce it here so the AP end state is visible early. It does not need to be attempted at the start of the course. Its purpose is to show the final mixture of tracing, object modeling, arrays/lists, recursion, searching, sorting, and written reasoning. Use it later as a timed or semi-timed diagnostic, then sort missed questions by unit rather than treating the score as the only feedback. The review result produces a short targeted practice list.",
					projectLink: repo("APCS-A-2020-Practice-Exam/starter"),
					solutionLink: repo("APCS-A-2020-Practice-Exam/solution")
				}
			]
		},
		{
			title: "Check-In #1",
			curriculum: [
				{
					title: "Review Goal",
					content:
						"The first check-in works as guided review rather than a formal test. It focuses on what the explanation covers and independent debugging across variables, conditionals, loops, and basic exceptions."
				},
				{
					title: "Learning Target Coverage",
					content:
						"The prompt bank concentrates on variables and printing, conditionals, counted and condition-driven loops, and early exception reasoning. This is the first structured checkpoint before the class sequence becomes more object-oriented."
				},
				{
					title: "Core Check-In Prompt Bank",
					content:
						"Run the check-in prompt bank from the APCS repo as the main review source. It collects the variables, conditionals, loops, and exception prompts in one place so the checkpoint stays structured.",
					projectLink: repo("APCS-Check-in-1/starter"),
					solutionLink: repo("APCS-Check-in-1/solution")
				}
			],
			supplementalProjects: [
				{
					title: "Additional Practice: FizzBuzz",
					content:
						"The additional practice project after the check-in gives one more pass through divisibility checks, ordered conditionals, and loop tracing.",
					projectLink: repo(
						"APCS-Check-in-1-Additional-Practice-Project/starter"
					),
					solutionLink: repo(
						"APCS-Check-in-1-Additional-Practice-Project/solution"
					),
					mediaLink: media("ps4_fizzbuzz.gif")
				},
				{
					title: "Variables Reference",
					content:
						"Return to the variables reference when types, assignment, or `Math.random()` range construction are still hesitant. The useful evidence is a short program that declares values, updates them, and explains the resulting type of each expression. Use it to separate syntax mistakes from concept mistakes: a missing semicolon is different from choosing `int` when a decimal result is required. A finished review includes one value update, one printed expression, and one explanation of why the type is valid. Add one AP-style prediction before running the code: state the exact value, type, and printed output expected after the assignment or cast.",
					projectLink: repo("APCS1-Variables-Reference/starter"),
					solutionLink: repo("APCS1-Variables-Reference/solution")
				},
				{
					title: "Loops Reference",
					content:
						"The loop reference pack gives a fast review of counted iteration before APCS4. The focus is predicting the first iteration, last iteration, number of iterations, and the variable state after the loop ends. Use it when a check-in answer has the right idea but prints one too many or one too few values. Useful evidence includes a small trace table with the loop variable, condition result, printed output, and update after each pass. The AP-style check is explaining why the final failed condition stops the loop rather than treating the visible output as the only result.",
					projectLink: repo("APCS4-Loops-Reference/starter"),
					solutionLink: repo("APCS4-Loops-Reference/solution")
				}
			]
		},
		{
			title: "APCS1 Variables and Input/Output",
			curriculum: [
				{
					title: "Variables, Primitive Types, and Strings",
					content:
						"`int`, `double`, `boolean`, and `String` are the basic vocabulary of Java programs. The working target is to declare, initialize, print, and update values without syntax friction."
				},
				{
					title: "Scanners, Formatting, and Casting",
					content:
						"`Scanner`-based input and explicit casting make the stored values and expression results visible enough to reason about precisely."
				},
				{
					title: "Core Project: Mad Libs",
					content:
						"This first APCS1 build combines variables, strings, scanner input, and formatted output without introducing structural overhead. A complete version uses clear prompts, stores each input in a named variable, and produces readable output without accidental missing spaces.",
					projectLink: repo("APCS1-Mad-Libs/starter"),
					solutionLink: repo("APCS1-Mad-Libs/solution"),
					mediaLink: media("apcs1-project-1-mad-libs.mp4")
				},
				{
					title: "Barron's Chapter 2 Habit",
					content:
						"Start multiple-choice tracing early. The APCS1 chapter work is mainly about casting, output, and expression evaluation, so justify answer choices line by line."
				}
			],
			supplementalProjects: [
				{
					title: "Project: Rounding It Off",
					content:
						"This project drills casting-based rounding without relying on `Math` helpers. The useful checkpoint is explaining why adding `0.5` before an integer cast works for positive values and where that shortcut would need more care.",
					projectLink: repo("APCS1-Rounding-It-Off/starter"),
					solutionLink: repo("APCS1-Rounding-It-Off/solution"),
					mediaLink: media("apcs1-project-2-rounding-it-off.mp4")
				},
				{
					title: "Project: Hospital Survey",
					content:
						"This project gives another structured pass through typed input, variable naming, and console formatting. The check is that numeric and text inputs are read with the correct scanner method and then reported with useful labels.",
					projectLink: repo("APCS1-Hospital-Survey/starter"),
					solutionLink: repo("APCS1-Hospital-Survey/solution"),
					mediaLink: media("apcs1-project-3-hospital-survey.mp4")
				},
				{
					title: "Strings and Printing Reference",
					content:
						"Keep the strings and printing reference nearby for review of escape characters, concatenation, and output layout. It is especially useful when the code is logically correct but the displayed result has spacing or formatting bugs. Use the reference to compare expected output against actual output character by character. A good repair names the exact missing literal, extra space, newline, quote, or variable placement that caused the formatting mismatch. Include one example that prints values on the same line and one that intentionally moves to the next line.",
					projectLink: repo(
						"APCS1-Strings-and-Printing-Reference/starter"
					),
					solutionLink: repo(
						"APCS1-Strings-and-Printing-Reference/solution"
					)
				}
			]
		},
		{
			title: "APCS2 Operators",
			curriculum: [
				{
					title: "Arithmetic and Update Operators",
					content:
						"Arithmetic expressions, operator precedence, `%`, and update patterns like `+=`, `++`, and `--` are the basic mechanics for manipulating numeric state. Trace each expression before running it so precedence and mutation order are explicit."
				},
				{
					title: "Relational and Logical Operators",
					content:
						"Evaluate compound boolean expressions exactly, including short-circuit behavior and correct `String` equality with `.equals()`. The goal is to justify why an expression is true or false, not just guess from the final output."
				},
				{
					title: "Core Project: Verifying Expressions",
					content:
						"This project develops expression tracing and boolean reasoning. The checkpoint is being able to evaluate each subexpression in order, name the final boolean result, and explain any short-circuit behavior.",
					projectLink: repo("APCS2-Verifying-Expressions/starter"),
					solutionLink: repo("APCS2-Verifying-Expressions/solution")
				},
				{
					title: "Chapter 2 Multiple Choice Focus",
					content:
						"Barron's Chapter 2 work belongs here because integer division, casting, precedence, and boolean logic are justified without running code. For each missed question, write the expression evaluation in order: parentheses, multiplication or division, remainder, addition or subtraction, relational comparison, and boolean combination. The useful evidence is not only the selected letter but the trace that proves why the other choices are impossible. Keep at least one example where Java's integer division differs from calculator intuition. Add one explanation that names whether Java evaluates an expression as `int`, `double`, `boolean`, or `String` before choosing the answer."
				}
			],
			supplementalProjects: [
				{
					title: "Project: Quotient and Remainder",
					content:
						"This build reinforces integer division and remainder reasoning before `%` becomes automatic. The explanation connects quotient, remainder, truncation, and unit meaning rather than only reporting two numbers.",
					projectLink: repo("APCS2-Quotient-and-Remainder/starter"),
					solutionLink: repo("APCS2-Quotient-and-Remainder/solution"),
					mediaLink: media(
						"apcs2-project-1-quotient-and-remainder.mp4"
					)
				},
				{
					title: "Project: Too Chicken to Cross the Road",
					content:
						"The boolean-only version keeps logic encoded cleanly before conditionals are added in APCS3. A strong solution names each boolean expression, tests both true and false paths, and avoids hiding the decision inside vague variable names.",
					projectLink: repo(
						"APCS2-Too-Chicken-To-Cross-The-Road/starter"
					),
					solutionLink: repo(
						"APCS2-Too-Chicken-To-Cross-The-Road/solution"
					),
					mediaLink: media(
						"apcs2-project-3-too-chicken-to-cross-the-road.mp4"
					)
				},
				{
					title: "Project: Two in One",
					content:
						"This one-line boolean exercise develops concise reasoning about relationships between values. The goal is to write one readable compound expression, then justify the expression with at least one matching case and one non-matching case.",
					projectLink: repo("APCS2-Two-In-One/starter"),
					solutionLink: repo("APCS2-Two-In-One/solution"),
					mediaLink: media("apcs2-project-4-two-in-one.mp4")
				}
			]
		},
		{
			title: "APCS3 Conditionals and Packages",
			curriculum: [
				{
					title: "Conditionals, Scope, and Nesting",
					content:
						"`if`, `else if`, and `else` are precise control-flow tools. A correct explanation names which branch runs and why, especially in nested cases."
				},
				{
					title: "Packages, Math, and Randomness",
					content:
						"Package imports, `Math` methods, and `Math.random()` introduce library code while preserving careful tracing of local control flow."
				},
				{
					title: "Core Project: Elevator Warning",
					content:
						"Elevator Warning is a focused APCS3 project for threshold checks, conditionals, and readable output. The decision structure makes the unsafe condition obvious and handles boundary values exactly, not just typical inputs.",
					projectLink: repo("APCS3-Elevator-Warning/starter"),
					solutionLink: repo("APCS3-Elevator-Warning/solution"),
					mediaLink: media("apcs3-project-3-elevator-warning.mp4")
				},
				{
					title: "Reference Pack",
					content:
						"Keep the conditionals, math-package, and random-number references available as short focused reviews instead of burying those examples inside larger projects. This pack is useful when a larger project fails for a small reason: incorrect branch order, missing `else`, wrong `Math` return type, or an off-by-one random range. A completed reference pass names one exact decision point, one boundary value, and one printed result that proves the rule works. The pack is also useful for separating a syntax problem from a logic problem before continuing a larger project.",
					projectLink: repo("APCS3-Conditionals-Reference/starter"),
					solutionLink: repo("APCS3-Conditionals-Reference/solution")
				}
			],
			supplementalProjects: [
				{
					title: "Project: Too Chicken Take Two",
					content:
						"Redo the APCS2 boolean problem with explicit conditionals and nested branches. Compare this version to the boolean-only version by naming which part became easier to read, which part became longer, and how the same truth cases are preserved.",
					projectLink: repo("APCS3-Too-Chicken-Take-Two/starter"),
					solutionLink: repo("APCS3-Too-Chicken-Take-Two/solution"),
					mediaLink: media("apcs3-project-1-too-chicken-take-two.mp4")
				},
				{
					title: "Reference: Math Package",
					content:
						"This reference project supports focused review of `abs`, `pow`, `sqrt`, and round-off behavior. Connect each method call to its argument types, return type, and any casting needed before storing the result. Use it to prevent a common AP mistake: treating a library method as magic instead of tracing its input and output type. The evidence includes one call with a predictable answer and one call where `double` behavior or casting changes how the result must be stored or printed. A useful review also distinguishes the `Math` class from an object instance.",
					projectLink: repo("APCS3-Math-Package-Reference/starter"),
					solutionLink: repo("APCS3-Math-Package-Reference/solution")
				},
				{
					title: "Reference: Random Numbers",
					content:
						"This reference tightens integer-range generation and helps avoid off-by-one mistakes with `Math.random()`. A strong explanation names the lowest possible value, highest possible value, and why the cast happens after scaling. Use the reference to build several ranges, such as `0` through `9`, `1` through `10`, or `99` through `199`, and explain the formula as `low + (int)(Math.random() * count)`. The finished check identifies the number of possible outcomes, not only the endpoints. Include one range where the lower bound is not zero.",
					projectLink: repo("APCS3-Random-Numbers-Reference/starter"),
					solutionLink: repo(
						"APCS3-Random-Numbers-Reference/solution"
					)
				},
				{
					title: "Project: Math Demo",
					content:
						"Use the `APCS3-Math-Fun` project to practice `Math` methods, packages, casting, and readable output. The finished program demonstrates each calculation with inputs and output that make the method behavior easy to verify.",
					projectLink: repo("APCS3-Math-Fun/starter"),
					solutionLink: repo("APCS3-Math-Fun/solution"),
					mediaLink: media("apcs3-project-2-math-demo.mp4")
				}
			]
		},
		{
			title: "APCS4 Loops and Exceptions",
			curriculum: [
				{
					title: "For Loops, While Loops, and Infinite Loop Risk",
					content:
						"Counted loops and condition-driven loops are separate tools with separate failure modes. The central reasoning question is when a loop terminates and what state changes make that possible."
				},
				{
					title: "Nested Loops and Early Exception Reasoning",
					content:
						"Nested loops create patterns and tables, then connect loop correctness to common runtime errors like bounds issues and arithmetic mistakes."
				},
				{
					title: "Core Project: Translating Loops",
					content:
						"This project translates between `for` and `while` forms while preserving exact behavior. The important check is that initialization, condition, update, and output stay equivalent after the rewrite.",
					projectLink: repo("APCS4-Translating-Loops/starter"),
					solutionLink: repo("APCS4-Translating-Loops/solution"),
					mediaLink: media("apcs4-project-2-translating-loops.mp4")
				},
				{
					title: "Loop Reference Pack",
					content:
						"The loop references support targeted review on tracing, nested iteration, and pattern generation. They practice predicting output before execution and identifying which variable controls each repeated action. This pack is useful before pattern-printing or array traversal if loop boundaries are still uncertain. A useful trace states the initialization, first condition check, body effect, update step, last successful iteration, and the variable value that finally stops the loop. For nested loops, also record the total number of inner-loop executions and the exact moment a newline or row transition occurs.",
					projectLink: repo("APCS4-Loops-Reference/starter"),
					solutionLink: repo("APCS4-Loops-Reference/solution")
				}
			],
			supplementalProjects: [
				{
					title: "Project: For Loop Practice",
					content:
						"This project reinforces counted iteration, accumulators, and output-driven tracing. Each loop has a clear start value, stop condition, update step, and predicted output before the code is treated as finished.",
					projectLink: repo("APCS4-For-Loop-Practice/starter"),
					solutionLink: repo("APCS4-For-Loop-Practice/solution"),
					mediaLink: media("apcs4-project-1-for-loops-practice.mp4")
				},
				{
					title: "Project: While Loop and Nested Loop Practice",
					content:
						"This mixed practice set drills while-loop termination and nested iteration on structured output problems. The key check is explaining which condition eventually becomes false and how many times the inner loop runs.",
					projectLink: repo(
						"APCS4-While-Loop-and-Nested-Loop-Practice/starter"
					),
					solutionLink: repo(
						"APCS4-While-Loop-and-Nested-Loop-Practice/solution"
					),
					mediaLink: media(
						"apcs4-project-3-while-loop-and-nested-loop-practice.mp4"
					)
				},
				{
					title: "Reference: While Loops and Nested Loops",
					content:
						"The reference pack gives one more clean nested-iteration example before arrays arrive. The focus is loop initialization, update placement, and the relationship between row-style output and nested loop structure. Use it to explain which loop controls rows, which loop controls columns, and where the newline belongs. A completed trace counts total inner-loop executions and identifies what would change if the update statement moved inside or outside the inner loop. Include one incorrect placement example and explain the resulting infinite loop, skipped value, or malformed pattern in Java terms.",
					projectLink: repo(
						"APCS4-While-Loops-and-Nested-Loops-Reference/starter"
					),
					solutionLink: repo(
						"APCS4-While-Loops-and-Nested-Loops-Reference/solution"
					)
				}
			]
		},
		{
			title: "Check-In #2",
			curriculum: [
				{
					title: "Review Goal",
					content:
						"Check-In #2 reviews class construction, methods, inheritance vocabulary, access control, and `this` before the course moves into the heavier object-oriented sequence."
				},
				{
					title: "Prompt Bank Coverage",
					content:
						"The check-in concentrates on class definitions, constructors, accessor and mutator methods, static members, inheritance, overriding, and `super`. Treat the answers as evidence of object-model reasoning, not just isolated syntax recall."
				},
				{
					title: "Core Check-In Prompt Bank",
					content:
						"The prompt bank supports the full Check-In #2 review. This checkpoint shows whether classes, methods, and inheritance are ready for the main object-oriented sequence.",
					projectLink: repo("APCS-Check-in-2/starter"),
					solutionLink: repo("APCS-Check-in-2/solution")
				}
			],
			supplementalProjects: [
				{
					title: "Additional Practice: Animal Kingdom",
					content:
						"The taxonomy inheritance project after the check-in gives inheritance one more structured build. The important design target is avoiding repeated data by letting each subclass add only the classification level it owns.",
					projectLink: repo(
						"APCS-Check-in-2-Additional-Practice-Project/starter"
					),
					solutionLink: repo(
						"APCS-Check-in-2-Additional-Practice-Project/solution"
					)
				},
				{
					title: "Class Example",
					content:
						"This short class example reinforces constructor syntax and instance variables. It makes the relationship between a class definition, a constructed object, and the object's stored fields concrete.",
					projectLink: repo("APCS5-Class-Example/starter"),
					solutionLink: repo("APCS5-Class-Example/solution")
				},
				{
					title: "This Reference",
					content:
						"The `this` reference pack clarifies constructor syntax and `this.field`. The checkpoint is distinguishing a parameter name from the instance variable that belongs to the current object. Use it when constructor code compiles but stores the wrong value or leaves a field unchanged. The evidence includes a shadowed-parameter example, the corrected `this.field = parameter` assignment, and a printed object state proving the field was initialized. Add one explanation of when `this` is optional for Java but still useful for readability and one case where omitting it changes which variable is updated.",
					projectLink: repo("APCS6-This-Reference/starter"),
					solutionLink: repo("APCS6-This-Reference/solution")
				}
			]
		},
		{
			title: "APCS5 Classes Part I",
			curriculum: [
				{
					title: "Classes, Fields, and Constructors",
					content:
						"Start the object sequence by focusing on how a class groups state and behavior. The design check is naming what belongs as an instance variable and what belongs in a method."
				},
				{
					title: "Accessors, Mutators, and Method Practice",
					content:
						"Short object builds make getters, setters, parameters, return values, and `this` references concrete. A finished example shows both reading state safely and changing state only through methods that preserve the class contract."
				},
				{
					title: "Core Project: Student Class",
					content:
						"The Student Class build is the main APCS5 implementation checkpoint because it is a clean class-with-state project in this course sequence.",
					projectLink: repo("APCS5-Student-Class/starter"),
					solutionLink: repo("APCS5-Student-Class/solution"),
					mediaLink: media("apcs5-project-2-student-class.mp4")
				},
				{
					title: "Free Response Prep",
					content:
						"Start free-response style writing here so small-class behavior can be explained before inheritance and polymorphism raise the difficulty. The goal is not full exam timing yet; it is writing method behavior precisely enough for partial-credit scoring. A good response names the instance variables involved, explains each method's contract, and uses test calls or object-state examples to prove that the class behaves as specified. The scoring pass marks constructor correctness, field initialization, return type, side effect, and whether every public method preserves the class invariant.",
					projectLink: repo("APCS5-Free-Response-Practice/starter"),
					solutionLink: repo("APCS5-Free-Response-Practice/solution")
				}
			],
			supplementalProjects: [
				{
					title: "Project: Method Practice",
					content:
						"The APCS5 method-practice project gives short parameter and return-value repetitions. Each method identifies its inputs, output, side effects if any, and one call from `main` that proves the method contract is being used correctly.",
					projectLink: repo("APCS5-Practice-with-Methods/starter"),
					solutionLink: repo("APCS5-Practice-with-Methods/solution"),
					mediaLink: media("apcs5-project-1-method-practice.mp4")
				},
				{
					title: "Project: Store Class",
					content:
						"Store Class gives another object model with a small but meaningful state transition. The useful evidence is a before-and-after object state, such as inventory, price, or balance changing through a method rather than direct field access.",
					projectLink: repo("APCS5-Store-Class/starter"),
					solutionLink: repo("APCS5-Store-Class/solution"),
					mediaLink: media("apcs5-project-3-store-class.mp4")
				},
				{
					title: "Supplemental: Spreadsheet Width",
					content:
						"This supplemental build gives precise method specs more implementation practice. The task is useful because it forces careful interpretation of inputs, return values, edge cases, and formatting rules before implementation starts.",
					projectLink: repo("APCS5-Spreadsheet-Width/starter"),
					solutionLink: repo("APCS5-Spreadsheet-Width/solution"),
					mediaLink: media(
						"apcs5-supplemental-project-1-spreadsheet-width.mp4"
					)
				}
			]
		},
		{
			title: "APCS6 Classes Part II",
			curriculum: [
				{
					title: "State Mutation and Reference Semantics",
					content:
						"Continue class work with object references, side effects, and method calls that mutate encapsulated state. The central tracing skill is predicting what changes inside an object after each method call and what remains unchanged. Use before/after state tables for at least one object: field values before the call, parameter values during the call, field values after the call, and any returned value. This prevents a common mistake where a printed result is confused with the object's actual stored state."
				},
				{
					title: "Getters, Setters, `this`, and Primitive vs. Reference",
					content:
						"The APCS6 reference packs distinguish field access, parameter shadowing, and the difference between primitive copies and object references. The important comparison is whether a method receives an independent primitive value or a reference to an object whose fields can be changed. A strong explanation traces one setter call, one getter call, and one object-reference example without using public field access as a shortcut. Include a before/after table with parameter values, field values, and returned values so mutation is separated from local reassignment."
				},
				{
					title: "Core Project: Vending Machine Class",
					content:
						"The vending-machine project is the main APCS6 build because it exercises constructors, fields, controlled mutation, and method design in one compact model.",
					projectLink: repo("APCS6-Vending-Machine-Class/starter"),
					solutionLink: repo("APCS6-Vending-Machine-Class/solution"),
					mediaLink: media(
						"apcs6-project-1-vending-machine-class.mp4"
					)
				},
				{
					title: "Free Response and Multiple Choice Support",
					content:
						"Keep the APCS6 free-response and multiple-choice references available here because subtle object-state mistakes become common at this point. Use these resources after a class project runs to check whether the same behavior can be explained in AP language. The evidence includes one written method contract, one object-state trace, and one multiple-choice elimination where the wrong answers fail because of reference behavior, access rules, or parameter scope. Score the free-response attempt by identifying the first line that changes object state and the exact condition that validates or rejects a setter input.",
					projectLink: repo("APCS6-Free-Response-Practice/starter"),
					solutionLink: repo("APCS6-Free-Response-Practice/solution")
				}
			],
			supplementalProjects: [
				{
					title: "Project: Bank Account Class",
					content:
						"The bank-account build covers clean state transitions, deposits, withdrawals, and invariant thinking. A strong implementation prevents invalid balances, keeps fields encapsulated, and demonstrates state before and after each transaction.",
					projectLink: repo("APCS6-Bank-Account-Class/starter"),
					solutionLink: repo("APCS6-Bank-Account-Class/solution"),
					mediaLink: media("apcs6-project-2-bank-account-class.mp4")
				},
				{
					title: "Project: Farm Class",
					content:
						"The starter and review pair gives another class-based build with simpler domain language. The focus is fields, constructor setup, method-driven updates, and a short demonstration that object state changes only in intended ways.",
					projectLink: repo("APCS6-Farm-Class/starter"),
					solutionLink: repo("APCS6-Farm-Class/solution"),
					mediaLink: media("apcs6-project-1-farm-class.mp4")
				},
				{
					title: "Reference: Getters and Setters",
					content:
						"This reference directly reviews controlled access patterns and field updates. The key idea is that public methods can protect object invariants while still allowing outside code to read or request valid changes. Use it to compare direct field access with method-mediated access. A finished pass identifies which method reads state, which method requests a change, what validation protects the field, and what test proves an invalid update does not corrupt the object. Add one AP-style explanation of why `private` data plus public methods improves reasoning about class behavior.",
					projectLink: repo(
						"APCS6-Getters-and-Setters-Reference/starter"
					),
					solutionLink: repo(
						"APCS6-Getters-and-Setters-Reference/solution"
					)
				}
			]
		},
		{
			title: "APCS7 Inheritance",
			curriculum: [
				{
					title: "Superclass and Subclass Design",
					content:
						"Inheritance captures shared state and behavior without copy-pasting class logic. A valid subclass relationship needs a clear justification."
				},
				{
					title: "Constructors, `super`, and Overriding",
					content:
						"Make constructor chaining and method overriding explicit: what gets inherited, what gets customized, and when `super(...)` is required."
				},
				{
					title: "Core Project: Book and PictureBook Class",
					content:
						"Book and PictureBook Class is the main APCS7 build for readable inheritance practice. The class hierarchy makes the shared superclass behavior and subclass-specific behavior easy to trace.",
					projectLink: repo("APCS7-Books-and-Picture-Books/starter"),
					solutionLink: repo(
						"APCS7-Books-and-Picture-Books/solution"
					),
					mediaLink: media(
						"apcs7-project-4-book-and-picturebook-class.mp4"
					)
				}
			],
			supplementalProjects: [
				{
					title: "Project: Pet Class",
					content:
						"The pet-class build is the first inheritance pass before the class family expands further. The goal is to identify what belongs in the superclass and what remains for subclasses to specialize.",
					projectLink: repo("APCS7-Pets/starter"),
					solutionLink: repo("APCS7-Pets/solution"),
					mediaLink: media("apcs7-project-1-pet-class.mp4")
				},
				{
					title: "Project: More Pets",
					content:
						"The extended pets build gives a second inheritance pass with more subclasses and behavior to compare. The useful evidence is a small set of objects whose shared and specialized behavior can be explained side by side.",
					projectLink: repo("APCS7-Pets/starter"),
					solutionLink: repo("APCS7-Pets/solution"),
					mediaLink: media("apcs7-project-2-more-pets.mp4")
				},
				{
					title: "Project: Pet Special Methods",
					content:
						"The later pet build focuses on overridden object methods and more specialized subclass behavior. Explain which method implementation runs for each object and why overriding is better than duplicating unrelated code.",
					projectLink: repo("APCS7-Dogs/starter"),
					solutionLink: repo("APCS7-Dogs/solution"),
					mediaLink: media("apcs7-project-3-pet-special-methods.mp4")
				},
				{
					title: "APCS7 Inheritance Multiple Choice Reference",
					content:
						"The APCS7 multiple-choice reference reinforces inheritance vocabulary and trace reasoning. Justify each answer by constructor order, inherited member access, or overridden method behavior. Use it after coding a subclass so the terminology stays tied to actual Java behavior. The expected evidence is one eliminated answer for each common misconception: assuming private fields are inherited as directly accessible, skipping `super(...)`, or forgetting that an override changes which method body runs. Add a constructor trace that lists superclass initialization before subclass initialization and labels any compile-time access error separately from runtime dispatch.",
					projectLink: repo(
						"APCS7-Multiple-Choice-Reference/starter"
					),
					solutionLink: repo(
						"APCS7-Multiple-Choice-Reference/solution"
					)
				}
			]
		},
		{
			title: "APCS8 Polymorphism",
			curriculum: [
				{
					title: "Superclass References and Dynamic Dispatch",
					content:
						"Polymorphism combines shared method contracts with runtime method selection based on the actual object type. The AP skill is explaining both compile-time reference restrictions and runtime overridden-method selection."
				},
				{
					title: "Type Reasoning and Invalid Calls",
					content:
						"Explain which method runs, which calls fail at compile time, and why a reference type constrains what members are visible."
				},
				{
					title: "Core Project: Many Shapes",
					content:
						"Many Shapes is the main polymorphism build. It shows superclass references, overridden methods, shared method contracts, and the difference between compile-time visibility and runtime behavior.",
					projectLink: repo("APCS8-Many-Shapes/starter"),
					solutionLink: repo("APCS8-Many-Shapes/solution"),
					mediaLink: media("apcs8-project-1-many-shapes.mp4")
				}
			],
			supplementalProjects: [
				{
					title: "Polymorphism Reference",
					content:
						"The reference pack gives short, explicit examples of superclass references and overridden methods. For each example, identify the declared reference type, actual object type, visible methods, and method body that runs. Use it to separate compile-time visibility from runtime dispatch. A strong trace explains why one method call compiles, why another call fails before running, and why an overridden method body can still run through a superclass reference. Add one cast example and state whether the cast is unnecessary, safe, or a possible `ClassCastException`.",
					projectLink: repo("APCS8-Polymorphism-Reference/starter"),
					solutionLink: repo("APCS8-Polymorphism-Reference/solution")
				},
				{
					title: "APCS8 Polymorphism Multiple Choice Reference",
					content:
						"The APCS8 multiple-choice reference helps when a polymorphic model is easier to code than to trace. The target is eliminating answer choices by compile-time type rules and dynamic dispatch behavior. Use it to practice the two-step AP habit: first list what the reference type permits, then decide which implementation runs from the actual object type. The final explanation makes clear whether an error is compile-time, runtime, or simply the expected override behavior. Mark every answer choice with one of those categories before selecting the final letter.",
					projectLink: repo(
						"APCS8-Multiple-Choice-Reference/starter"
					),
					solutionLink: repo(
						"APCS8-Multiple-Choice-Reference/solution"
					)
				}
			]
		},
		{
			title: "Check-In #3",
			curriculum: [
				{
					title: "Review Goal",
					content:
						"Check-In #3 is cumulative review for polymorphism, software design and lifecycle reasoning, arrays, and ArrayLists before the later AP-heavy units."
				},
				{
					title: "Prompt Bank Coverage",
					content:
						"The prompt bank emphasizes type reasoning, UML and specification thinking, arrays and matrices, ArrayLists, and one final polymorphism pass."
				},
				{
					title: "Core Check-In Prompt Bank",
					content:
						"The GitHub-backed prompt bank supports the main Check-In #3 review sequence. It confirms that design reasoning, polymorphism, arrays, and ArrayLists are ready before the course moves into AP-style algorithm work.",
					projectLink: repo("APCS-Check-in-3/starter"),
					solutionLink: repo("APCS-Check-in-3/solution")
				}
			],
			supplementalProjects: [
				{
					title: "Additional Practice: Letter Shifter",
					content:
						"The letter-shifter project reinforces inheritance, overriding, and character-level string manipulation after the check-in. A strong solution reuses shared shifting logic and handles wraparound cases for uppercase and lowercase letters.",
					projectLink: repo(
						"APCS-Check-in-3-Additional-Practice-Project/starter"
					),
					solutionLink: repo(
						"APCS-Check-in-3-Additional-Practice-Project/solution"
					)
				},
				{
					title: "ArrayList Reference",
					content:
						"The ArrayList reference pack supports mutation or traversal gaps. The focus is method names, shifting behavior after removal, wrapper-class requirements, and when index-based loops are safer than enhanced loops. Use it before any list-removal problem. A completed pass traces `size()`, `get`, `set`, `add`, and `remove`, then explains how indexes shift after removal and why an enhanced `for` loop is not safe for structural mutation. Include a trace where two adjacent items meet the removal condition so the skipped-index risk is visible.",
					projectLink: repo("APCS11-Array-List-Reference/starter"),
					solutionLink: repo("APCS11-Array-List-Reference/solution")
				},
				{
					title: "APCS11 ArrayList Multiple Choice Reference",
					content:
						"The APCS11 multiple-choice reference belongs here because the check-in's later prompts rely on strong collection tracing. The focus is index shifting, removal effects, and wrapper-class constraints rather than memorizing method names only. Use each question as a mini-trace: write the list contents after each operation, mark the current index, and identify whether a primitive value was autoboxed into an object. The right answer follows from the trace, not from recognition of the method name. Add one eliminated answer choice with the exact operation where its imagined list state diverges from Java's actual `ArrayList` behavior.",
					projectLink: repo(
						"APCS11-Multiple-Choice-Reference/starter"
					),
					solutionLink: repo(
						"APCS11-Multiple-Choice-Reference/solution"
					)
				}
			]
		},
		{
			title: "APCS9 Software Development Lifecycle",
			curriculum: [
				{
					title: "Specifications, Design, and Testability",
					content:
						"APCS9 focuses on reading a spec, identifying missing requirements, and designing code that can be tested cleanly instead of guessed into existence.",
					mediaLink: media("apcs9-software-development-lifecycle.png")
				},
				{
					title: "Robust Input and Failure Handling",
					content:
						"Strengthen input handling and validation so malformed input is treated as part of core program correctness. The goal is a program that recovers from invalid input with a clear loop instead of crashing or accepting bad state."
				},
				{
					title: "Core Project: Robust Input Practice",
					content:
						"Robust input practice is the main APCS9 implementation checkpoint. The implementation shows validation loops, clear error messages, and a final valid value before continuing.",
					projectLink: repo("APCS9-Robust-Input-Practice/starter"),
					solutionLink: repo("APCS9-Robust-Input-Practice/solution"),
					mediaLink: media(
						"apcs9-project-1-robust-input-practice.mp4"
					)
				}
			],
			supplementalProjects: [
				{
					title: "Deck Spec / Specification",
					content:
						"Use the deck-specification project to practice reading incomplete requirements, identifying missing decisions, and refining the spec before implementation.",
					projectLink: repo("APCS9-Specification/starter"),
					solutionLink: repo("APCS9-Specification/solution")
				},
				{
					title: "Robust Input Reference Review",
					content:
						"Compare the robust-input practice project with the reference implementation after the local version runs. Look for where invalid values are rejected, where the program repeats, and where valid data finally enters the main logic. Use the comparison to separate validation from processing: validation keeps asking until the data is usable, while processing runs only after the value is trustworthy. The evidence includes one invalid input, one boundary input, and one valid input trace. Add the exception or sentinel condition that prevents the program from accepting malformed data silently.",
					projectLink: repo("APCS9-Robust-Input-Practice/starter"),
					solutionLink: repo("APCS9-Robust-Input-Practice/solution")
				}
			]
		},
		{
			title: "APCS10 Arrays",
			curriculum: [
				{
					title: "Arrays, Indexing, and Fixed Size",
					content:
						"One-dimensional arrays are fixed-size ordered collections with constant-time indexed access and strict bounds. The essential habit is tracing valid indexes from `0` through `length - 1` before writing traversal code."
				},
				{
					title: "Pass-by-Reference Effects and 2D Arrays",
					content:
						"Arrays show how object references behave in methods, then extend that reasoning into two-dimensional arrays and matrix-style traversal. The key AP idea is that a method can modify the contents of an array object even when the parameter variable itself is local. For 2D arrays, trace rows and columns separately: row index, column index, accessed value, update rule, and whether the loop visits the whole matrix or only part of it. Include one example where a method changes an element and one where reassigning the parameter leaves the caller's array reference unchanged."
				},
				{
					title: "Core Project: Practice With Arrays",
					content:
						"The practice-with-arrays project is the main APCS10 implementation checkpoint for traversal, accumulation, and simple array-return methods. The evidence includes a trace of how each loop visits elements and updates an answer.",
					projectLink: repo("APCS10-Practice-With-Arrays/starter"),
					solutionLink: repo("APCS10-Practice-With-Arrays/solution"),
					mediaLink: media(
						"apcs10-project-1-practice-with-arrays.mp4"
					)
				},
				{
					title: "Array Reference Pack",
					content:
						"The array reference build gives a quick review of indexing, `.length`, and default values when array syntax is blocking the more important reasoning about traversal, bounds, and mutation. Use it before moving into accumulation or matrix work. A finished reference pass identifies valid indexes, default element values, the difference between changing an element and reassigning a local parameter, and one out-of-bounds index that the loop must avoid. Add a trace of an accumulator or search variable so the array access is tied to algorithm behavior rather than syntax alone.",
					projectLink: repo("APCS10-Array-Reference/starter"),
					solutionLink: repo("APCS10-Array-Reference/solution")
				}
			],
			supplementalProjects: [
				{
					title: "Project: Random Mad Libs",
					content:
						"Random Mad Lib connects arrays, random indexing, and lightweight string generation. The check is that every random index stays in bounds, every word bank has a clear role, and the generated output still reads as a complete sentence.",
					projectLink: repo("APCS10-Random-Mad-Lib/starter"),
					solutionLink: repo("APCS10-Random-Mad-Lib/solution"),
					mediaLink: media("apcs10-project-2-random-mad-libs.mp4")
				},
				{
					title: "Project: Practice With Two-Dimensional Arrays",
					content:
						"This project develops grid traversal, row-and-column reasoning, and nested loops. A complete solution explains which loop controls rows, which loop controls columns, and how the code changes when the target is a row, column, cell, or whole matrix.",
					projectLink: repo(
						"APCS10-Practice-With-Two-Dimensional-Arrays/starter"
					),
					solutionLink: repo(
						"APCS10-Practice-With-Two-Dimensional-Arrays/solution"
					),
					mediaLink: media(
						"apcs10-project-3-practice-with-two-dimensional-array.mp4"
					)
				},
				{
					title: "Project: Matrix Arithmetic",
					content:
						"Matrix arithmetic is a more structured 2D-array build. The project makes dimension compatibility explicit, then traces at least one cell of the result so array indexing and arithmetic reasoning are connected.",
					projectLink: repo("APCS10-Matrix-Arithmetic/starter"),
					solutionLink: repo("APCS10-Matrix-Arithmetic/solution"),
					mediaLink: media("apcs10-project-4-matrix-arithmetic.mp4")
				},
				{
					title: "Free Response Practice",
					content:
						"Use the 2022 AP CS A FRQ set and official scoring guidelines for Problem 4. Keep the prompt and rubric together so practice includes both solving and scoring. The useful routine is to write a solution under light timing, then score it line by line against the official rubric. Mark whether lost points came from loop bounds, array indexing, missing return values, incorrect conditionals, or incomplete explanation so the next review target is specific. Preserve one revised version that fixes only the first lost point, making the scoring improvement explicit.",
					projectLink: AP_2022_FRQ,
					solutionLink: AP_2022_FRQ_SCORING
				}
			]
		},
		{
			title: "APCS11 ArrayLists",
			curriculum: [
				{
					title: "ArrayLists, Wrapper Constraints, and Core Methods",
					content:
						"`ArrayList` is a resizable ordered collection with method-based access, dynamic size, and object-only storage. The key contrast with arrays is that size changes through methods, while indexes still require careful bounds reasoning."
				},
				{
					title: "Mutation, Traversal, and Removal Rules",
					preserveInstructions: true,
					content: [
						"**Traversal rule:** An enhanced `for` loop is useful for reading each element when indexes are unnecessary. Assigning a new value to its loop variable does not replace the element in the list; use `set(index, value)` for replacement. Adding or removing elements directly through the list during enhanced traversal is unsafe: its iterator can report a `ConcurrentModificationException`. Correctness must not depend on that exception being thrown.",
						"",
						"**Removal example:** With `import java.util.ArrayList;` and `import java.util.Arrays;`, this code removes every even value, including adjacent matches:",
						"",
						"```java",
						"ArrayList<Integer> values = new ArrayList<>(Arrays.asList(1, 2, 2, 3));",
						"for (int i = values.size() - 1; i >= 0; i--) {",
						"    if (values.get(i) % 2 == 0) {",
						"        values.remove(i);",
						"    }",
						"}",
						"System.out.println(values); // [1, 3]",
						"```",
						"",
						"**Index trace:** Removing index 2 leaves `[1, 2, 3]`; removing index 1 then leaves `[1, 3]`. Traversing backward keeps the still-unvisited indexes valid. A forward loop that always increments after removal skips the element shifted into the removed position. For `ArrayList<Integer>`, `remove(i)` with an int argument removes an index; `remove(Integer.valueOf(2))` removes the first matching value.",
						"",
						"**Check:** Trace no matches, adjacent matches, all matches and an empty list before running the code.",
						"",
						"[ArrayList operations and iterator contract](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/ArrayList.html)"
					].join("\n")
				},
				{
					title: "Core Project: Practice With ArrayLists",
					content:
						"The ArrayList practice project is the main APCS11 implementation checkpoint for counting, filtering, mutation, and removal logic.",
					projectLink: repo(
						"APCS11-Practice-With-Array-Lists/starter"
					),
					solutionLink: repo(
						"APCS11-Practice-With-Array-Lists/solution"
					),
					mediaLink: media(
						"apcs11-project-1-practice-with-arraylists.mp4"
					)
				},
				{
					title: "ArrayList Reference Pack",
					content:
						"Keep the ArrayList reference build close for method review and quick syntax reinforcement. It supports fast checks of `add`, `get`, `set`, `remove`, `size`, traversal style, and mutation safety. Use it to compare array and ArrayList thinking directly: arrays expose `.length`, while ArrayLists use `size()` and method calls for access and mutation. A completed pass includes one append, one insertion, one replacement, one removal, and a trace of the final indexes. Add one comparison of forward removal versus backward removal so skipped elements and shifted indexes are explicit.",
					projectLink: repo("APCS11-Array-List-Reference/starter"),
					solutionLink: repo("APCS11-Array-List-Reference/solution")
				}
			],
			supplementalProjects: [
				{
					title: "Project: Fortune Teller",
					content:
						"FortuneTeller combines ArrayLists, random selection, and controlled mutation of collection state. The interesting check is whether random choices remain valid as items are added, removed, or reused.",
					projectLink: repo("APCS11-Fortune-Teller-Class/starter"),
					solutionLink: repo("APCS11-Fortune-Teller-Class/solution"),
					mediaLink: media("apcs11-project-2-fortune-teller.mp4")
				},
				{
					title: "Project: Card Shuffler",
					content:
						"The starter and review pair for Card Shuffler connects objects, ArrayLists, and algorithmic updates in a higher-signal build.",
					projectLink: repo("APCS11-Card-Shuffler/starter"),
					solutionLink: repo("APCS11-Card-Shuffler/solution"),
					mediaLink: media("apcs11-project-3-card-shuffler.mp4")
				},
				{
					title: "Free Response Practice",
					content:
						"The APCS11 FRQ practice build bridges list manipulation and AP free-response expectations. The focus is writing correct list updates while explaining index choices, loop direction, and side effects clearly enough for partial credit. Use the solution after an attempt to check whether the algorithm preserves every required element, skips no elements after removal, and returns or mutates exactly what the prompt requested. The scoring pass identifies the first incorrect line, not only the final symptom. Include a trace of the list before the loop, after each removal, and after the final iteration.",
					projectLink: repo("APCS11-Free-Response-Practice/starter"),
					solutionLink: repo("APCS11-Free-Response-Practice/solution")
				},
				{
					title: "Card and Deck Classes",
					content:
						"The card-and-deck classes provide a bridge build when object-list modeling needs more practice before APCS12 and APCS17.",
					projectLink: repo("APCS11-Card-and-Deck-Classes/starter"),
					solutionLink: repo("APCS11-Card-and-Deck-Classes/solution")
				}
			]
		},
		{
			title: "Check-In #4",
			curriculum: [
				{
					title: "Review Goal",
					content:
						"Check-In #4 is cumulative review of wrapper classes, runtime analysis, recursion, sorting, and searching before the final AP prep stretch."
				},
				{
					title: "Prompt Bank Coverage",
					content:
						"The prompt bank emphasizes computational steps, recursive reasoning, sorting traces, search preconditions, and wrapper-class behavior. Treat it as a readiness check for the algorithm-heavy final third of the course."
				},
				{
					title: "Core Check-In Prompt Bank",
					content:
						"The GitHub-backed prompt bank supports the full Check-In #4 review sequence. It identifies the highest-priority remaining work: wrappers, recursion, sorting, searching, or AP-style trace explanations.",
					projectLink: repo("APCS-Check-in-4/starter"),
					solutionLink: repo("APCS-Check-in-4/solution"),
					mediaLink: media("apcs-check-in-4.mp4")
				}
			],
			supplementalProjects: [
				{
					title: "Additional Practice: Inversion Counting",
					content:
						"Inversion counting after the check-in gives one more applied problem connecting sorting and runtime ideas. The important reasoning is how pair comparisons reveal disorder and why a brute-force count has quadratic cost.",
					projectLink: repo(
						"APCS-Check-in-4-Additional-Practice-Project/starter"
					),
					solutionLink: repo(
						"APCS-Check-in-4-Additional-Practice-Project/solution"
					)
				},
				{
					title: "Project: Minimum and Maximum",
					content:
						"This project is a targeted follow-up when wrapper constants and search initialization still feel abstract. Trace the first element, current best value, comparison result, and update rule so the initialization choice is defensible.",
					projectLink: repo("APCS12-Minimum-and-Maximum/starter"),
					solutionLink: repo("APCS12-Minimum-and-Maximum/solution")
				},
				{
					title: "Runtime Analysis Starter",
					content:
						"The runtime starter supports weak step-counting or loop-cost reasoning. The goal is to connect a loop structure to growth rate before using Big-O notation as shorthand.",
					projectLink: repo("APCS13-Runtime-Analysis/starter"),
					solutionLink: repo("APCS13-Runtime-Analysis/solution")
				}
			]
		},
		{
			title: "APCS12 Wrapper Classes",
			curriculum: [
				{
					title: "Wrapper Types, Autoboxing, and Unboxing",
					content:
						"Wrapper classes are the object form of primitive values, with attention to why collections use them and how autoboxing and unboxing hide conversions."
				},
				{
					title: "Static Constants and Search Initialization",
					content:
						"`Integer.MIN_VALUE` and `Integer.MAX_VALUE` support sane initialization choices for min/max search problems. The concept matters because a bad starting value can make a correct-looking loop fail on all-negative or all-positive data."
				},
				{
					title: "Core Project: Suits, Decks, and Hands",
					content:
						"Suits, Decks, and Hands is the main APCS12 build. The project connects wrapper-aware values, object collections, random selection, and clear class responsibilities in one card-modeling task.",
					projectLink: repo("APCS12-Suit-Deck-and-Hand/starter"),
					solutionLink: repo("APCS12-Suit-Deck-and-Hand/solution"),
					mediaLink: media(
						"apcs12-project-1-suits-decks-and-hands.mp4"
					)
				}
			],
			supplementalProjects: [
				{
					title: "Project: Minimum and Maximum Search",
					content:
						"This build reinforces wrapper constants and collection scanning with boxed integers. The explanation justifies the initial minimum and maximum values, then traces how each comparison can update the answer.",
					projectLink: repo("APCS12-Minimum-and-Maximum/starter"),
					solutionLink: repo("APCS12-Minimum-and-Maximum/solution"),
					mediaLink: media("apcs12-project-2-minimum-search.mp4")
				},
				{
					title: "Project: Deck Class",
					content:
						"Deck Class gives another wrapper-style object around a collection before APCS17. The useful check is whether cards are represented consistently and deck operations preserve valid collection state.",
					projectLink: repo("APCS12-Deck-Class/starter"),
					solutionLink: repo("APCS12-Deck-Class/solution")
				}
			]
		},
		{
			title: "APCS13 Algorithmic Runtime and Linear Search",
			curriculum: [
				{
					title: "Runtime by Step Counting",
					content: apConcept({
						focus: "Runtime analysis compares how work grows as input size grows. Wall-clock time changes with hardware, compiler settings, and background load, so AP CSA reasoning counts loop iterations, comparisons, assignments, recursive calls, or other stable operations.",
						practice: [
							"Choose one code fragment and name the operation being counted.",
							"Trace the count for small inputs such as `n = 1`, `n = 2`, and `n = 5`.",
							"Rewrite the count as a simple expression in terms of `n`.",
							"Summarize the growth rate only after the counted work is clear."
						],
						evidence:
							"A complete runtime explanation connects the code structure to the count. The final Big-O label is not enough unless the loop bounds or recursive calls explain why that label fits."
					})
				},
				{
					title: "Best, Average, and Worst Case",
					content: apConcept({
						focus: "The same algorithm can do different amounts of work depending on the input. Search algorithms are the cleanest examples: the target might be first, last, absent, or positioned near the middle.",
						practice: [
							"Name one input that makes the algorithm finish quickly.",
							"Name one input that forces the largest number of checks.",
							"Explain whether a typical case needs a probability model or only a representative example.",
							"Connect the case labels to the exact comparison or loop that changes."
						],
						evidence:
							"Best, average, and worst-case labels are supported by concrete inputs and a trace of how many checks those inputs cause."
					})
				},
				{
					title: "Core Project: Runtime Analysis",
					content: apProject({
						goal: "Use the runtime-analysis starter to connect Java loop structure to growth-rate reasoning.",
						steps: [
							"Identify the input size for each method before counting anything.",
							"Mark the line or operation that represents the repeated work.",
							"Count the operation for small input sizes and look for the pattern.",
							"Classify the growth rate after the count is visible."
						],
						apReasoning:
							"AP CSA Java reasoning expects the answer to cite code structure: loop bounds, nested loops, early exits, or recursive calls. The notation is a summary of that evidence, not a replacement for it.",
						checks: [
							"The counted operation is named explicitly.",
							"At least one small input trace supports the formula.",
							"The final growth class matches the dominant term rather than a copied guess."
						],
						extension:
							"Compare two implementations of the same task and explain which input sizes would make the difference noticeable."
					}),
					projectLink: repo("APCS13-Runtime-Analysis/starter"),
					solutionLink: repo("APCS13-Runtime-Analysis/solution")
				}
			],
			supplementalProjects: [
				{
					title: "Project: Linear Search Implementation",
					content: apProject({
						goal: "Implement and trace linear search so the result and runtime case are both visible.",
						steps: [
							"Search an unsorted array with a simple left-to-right loop.",
							"Return or report the target as soon as it is found.",
							"Add a sorted-data variant only when the early-exit condition is justified.",
							"Trace found-at-front, found-at-end, and not-found inputs."
						],
						apReasoning:
							"The AP question is not only whether the code finds the target. It is also which comparisons occur, when the loop stops, and how sortedness changes the worst-case or early-exit behavior.",
						checks: [
							"The not-found case terminates without reading past the end.",
							"The found-at-front case performs one comparison.",
							"The sorted variant explains why values beyond the target point no longer need checking."
						],
						extension:
							"Return the first matching index instead of a boolean result, then test duplicates and explain why the first occurrence is returned."
					}),
					projectLink: repo(
						"APCS13-Linear-Search-Implementation/starter"
					),
					solutionLink: repo(
						"APCS13-Linear-Search-Implementation/solution"
					),
					mediaLink: media("apcs13-project-2-linear-search.mp4")
				}
			]
		},
		{
			title: "APCS14 Selection and Insertion Sort",
			curriculum: [
				{
					title: "Selection Sort",
					content: apConcept({
						focus: "Selection sort repeatedly finds the next smallest or largest value and moves it into the sorted region. The sorted region grows from one side, while the unsorted region shrinks by one element per pass.",
						practice: [
							"Trace one pass and record the current index, candidate extreme index, and comparison result.",
							"Swap only after the pass identifies the correct extreme value.",
							"Draw the boundary between sorted and unsorted regions after each pass.",
							"Count the comparisons to connect the algorithm to quadratic runtime."
						],
						evidence:
							"A correct trace explains the invariant: after pass `k`, the first `k` positions contain the correct values in sorted order."
					})
				},
				{
					title: "Insertion Sort",
					content: apConcept({
						focus: "Insertion sort grows a sorted prefix by inserting the next value into the correct earlier position. It rewards nearly sorted data because values often do not need to move far.",
						practice: [
							"Mark the sorted prefix before each pass.",
							"Store the current value and shift larger or smaller values until the insertion point is open.",
							"Compare an already sorted input with a reverse-sorted input.",
							"Explain why the best case has fewer movements than the worst case."
						],
						evidence:
							"The trace shows both the current value being inserted and the sorted prefix remaining sorted after the insertion."
					})
				},
				{
					title: "Core Project: Selection Sort",
					content: apProject({
						goal: "Implement selection sort with a visible sorted-region invariant and traceable comparison behavior.",
						steps: [
							"Choose ascending or descending order and keep that direction consistent.",
							"Loop over each position that will receive the next selected value.",
							"Search the remaining unsorted region for the next extreme value.",
							"Swap after the scan and record how the sorted region changed."
						],
						apReasoning:
							"AP CSA Java reasoning focuses on the invariant and the nested-loop count. The outer loop fixes one position per pass, and the inner loop searches the remaining region.",
						checks: [
							"Already sorted, reverse sorted, duplicate-heavy, and single-element arrays all behave correctly.",
							"The trace identifies the selected index before the swap.",
							"The runtime explanation connects the nested loops to quadratic growth."
						],
						extension:
							"Sort objects by one field, such as card rank or student score, and explain what comparison changed."
					}),
					projectLink: repo("APCS14-Selection-Sort/starter"),
					solutionLink: repo("APCS14-Selection-Sort/solution"),
					mediaLink: media("apcs14-project-1-selection-sort.mp4")
				}
			],
			supplementalProjects: [
				{
					title: "Project: Insertion Sort",
					content: apProject({
						goal: "Implement insertion sort and explain why its behavior changes with input order.",
						steps: [
							"Treat index `0` as the initial sorted prefix.",
							"Take the next value and move left through the prefix until the insertion point is found.",
							"Shift values without overwriting the stored current value.",
							"Trace a nearly sorted input and a reverse-sorted input."
						],
						apReasoning:
							"Insertion sort questions often test loop conditions, index bounds, and the order of assignment during shifting. A clean trace shows why `j >= 0` style bounds checks matter.",
						checks: [
							"The current value is preserved while other values shift.",
							"The algorithm handles duplicates without losing values.",
							"The best-case and worst-case examples are named and justified."
						],
						extension:
							"Add a counter for comparisons and shifts, then compare selection sort and insertion sort on the same inputs."
					}),
					projectLink: repo("APCS14-Insertion-Sort/starter"),
					solutionLink: repo("APCS14-Insertion-Sort/solution"),
					mediaLink: media("apcs14-project-2-insertion-sort.mp4")
				}
			]
		},
		{
			title: "APCS15 Recursion",
			curriculum: [
				{
					title: "Base Cases, Recursive Steps, and Stack Frames",
					content: apConcept({
						focus: "A recursive method solves a problem by delegating a smaller version of the same problem to another method call. The base case stops the chain, and the recursive step must move closer to that stop condition.",
						practice: [
							"Identify the base case before reading the recursive line.",
							"Write the smaller subproblem created by one recursive call.",
							"Draw stack frames for a small input and mark where each call pauses.",
							"Trace the return path separately from the call path."
						],
						evidence:
							"The explanation names the stopping condition, the shrinking input, and the order in which output or return values appear."
					}),
					mediaLink: media("apcs15-recursion-1.png")
				},
				{
					title: "Stack Overflow and Tail Recursion",
					content: apConcept({
						focus: "Every recursive call consumes a stack frame. A missing base case, a base case that is never reached, or a recursive step that does not shrink the problem eventually exhausts the stack.",
						practice: [
							"Find the recursive call and write the next argument value it receives.",
							"Check whether that next input is closer to the base case.",
							"Compare a tail-recursive method with a method that still has work after the recursive call returns.",
							"Explain the error using stack frames rather than only naming `StackOverflowError`."
						],
						evidence:
							"A valid diagnosis points to the exact recursive step that fails to approach the base case or the exact input where the base case is skipped."
					}),
					mediaLink: media("apcs15-recursion-2.png")
				},
				{
					title: "Core Project: Tracing Recursion",
					content: apProject({
						goal: "Trace recursive methods by drawing the call chain, base case, and return path before relying on runtime output.",
						steps: [
							"Read each method and identify the base case.",
							"Trace the calls created by the input from `main`.",
							"Predict printed output or returned values before running the code.",
							"Summarize what the method does for any valid input."
						],
						apReasoning:
							"AP CSA Java reasoning often asks for output order, return value, or termination. The trace needs separate call-down and return-up phases because recursive output can occur before or after the recursive call.",
						checks: [
							"Each frame has its own parameter values.",
							"The base-case frame is identified explicitly.",
							"The predicted output order matches the method body order."
						],
						extension:
							"Modify one base case or recursive step and predict how the output or termination changes."
					}),
					projectLink: repo("APCS15-Tracing-Recursion/starter"),
					solutionLink: repo("APCS15-Tracing-Recursion/solution")
				},
				{
					title: "Recursion Reference Pack",
					content:
						"Keep the recursion reference available for short examples before assigning the longer practice set. It is most useful when a small trace is needed to separate the base case, recursive step, printed output order, and returned value. Use it to draw two views of the same method: the call-down path with parameter values and the return-up path with completed results. A good explanation identifies where recursion stops and whether work happens before or after the recursive call. Add one invalid input or missing-base-case note to explain how stack overflow or nontermination would appear.",
					projectLink: repo("APCS15-Recursion-Reference/starter"),
					solutionLink: repo("APCS15-Recursion-Reference/solution")
				}
			],
			supplementalProjects: [
				{
					title: "Project: Recursion Practice",
					content: apProject({
						goal: "Implement classic recursive methods while keeping the base case, smaller subproblem, and return path explicit.",
						steps: [
							"Write the base case before the recursive case.",
							"Reduce the input in a way that reaches the base case.",
							"Return or print in the correct order for factorials, powers, Fibonacci-style sequences, and string cascades.",
							"Test the smallest valid input, a typical input, and an input near a boundary."
						],
						apReasoning:
							"The AP emphasis is method behavior and traceability. A recursive method that works for one sample but lacks a defensible base case remains fragile.",
						checks: [
							"The recursive call uses a smaller or simpler input.",
							"Return values combine correctly after the recursive call returns.",
							"The method avoids duplicate or infinite work unless the prompt intentionally explores that cost."
						],
						extension:
							"Compare a recursive solution with an iterative version and explain which state is implicit in the call stack."
					}),
					projectLink: repo("APCS15-Recursion-Practice/starter"),
					solutionLink: repo("APCS15-Recursion-Practice/solution"),
					mediaLink: media("apcs15-project-2-recursion-practice.mp4")
				},
				{
					title: "Project: Blob Erase",
					content: apProject({
						goal: "Use recursion to erase a connected region in a 2D grid while avoiding repeated visits and out-of-bounds access.",
						steps: [
							"Represent the image as a 2D array of filled and empty cells.",
							"Reject invalid positions, empty cells, and already-erased cells as base cases.",
							"Erase or mark the current cell before exploring neighbors.",
							"Recurse up, down, left, and right to cover the connected blob."
						],
						apReasoning:
							"This is AP CSA Java reasoning for 2D arrays plus recursion. The correctness depends on the base-case order, row/column bounds, and marking the current cell before recursive expansion.",
						checks: [
							"Starting on an empty cell changes nothing.",
							"Starting outside the grid is handled safely.",
							"A blob with branches erases completely without infinite recursion."
						],
						extension:
							"Return the number of erased cells or add diagonal connectivity, then explain how the base cases and recursive calls changed."
					}),
					projectLink: repo("APCS15-Blob-Erase/starter"),
					solutionLink: repo("APCS15-Blob-Erase/solution"),
					mediaLink: media("apcs15-project-3-blob-erase.mp4")
				},
				{
					title: "Reference: Stack Overflow",
					content: apProject({
						goal: "Diagnose recursive methods that compile but do not terminate safely.",
						steps: [
							"Identify the base case and the recursive call.",
							"Trace two or three calls to see whether the input approaches the base case.",
							"Name the first repeated pattern that proves the recursion will continue indefinitely.",
							"Repair the stop condition or shrinking step and trace again."
						],
						apReasoning:
							"AP CSA Java reasoning treats stack overflow as evidence of a failed recursive structure, not as a random runtime event.",
						checks: [
							"The diagnosis cites a specific input and method line.",
							"The repaired version reaches the base case.",
							"The explanation separates infinite recursion from a long but finite recursion."
						]
					}),
					projectLink: repo(
						"APCS15-Stack-Overflow-Reference/starter"
					),
					solutionLink: repo(
						"APCS15-Stack-Overflow-Reference/solution"
					)
				}
			]
		},
		{
			title: "APCS16 Binary Search and Merge Sort",
			curriculum: [
				{
					title: "Binary Search Preconditions",
					content: apConcept({
						focus: "Binary search is fast because each comparison eliminates half of the remaining sorted search space. Without sorted data, the eliminated half might still contain the target.",
						practice: [
							"State the sorted-data precondition before tracing the algorithm.",
							"Record `low`, `high`, `middle`, and the middle value for each step.",
							"Choose the left or right half by comparing the target with the middle value.",
							"Stop when the target is found or when the bounds cross."
						],
						evidence:
							"A complete trace explains both why the selected half is still possible and why the discarded half is impossible."
					})
				},
				{
					title: "Merge Sort and Divide-and-Conquer",
					content: apConcept({
						focus: "Merge sort divides an array into smaller arrays, sorts those smaller arrays recursively, and then merges sorted halves into one sorted result. The merge step is where most visible work occurs.",
						practice: [
							"Draw the split tree until each subarray has length one.",
							"Merge two sorted one-element arrays by comparing their first values.",
							"Continue merging while preserving sorted order.",
							"Count the merge levels and connect them to `n log n` growth."
						],
						evidence:
							"The explanation separates divide, recursive sort, and merge. A result that is merely sorted is not enough unless the merge decisions can be traced."
					})
				},
				{
					title: "Core Project: Binary Search",
					content: apProject({
						goal: "Implement iterative and recursive binary search while making the sorted-data precondition and bound updates explicit.",
						steps: [
							"State the sorted-data precondition before using the algorithm.",
							"Trace at least one search by recording the low, high, and middle indices at each step.",
							"Move the lower or upper bound past the middle after each failed comparison.",
							"Return the correct result when the target is found or when the range becomes empty."
						],
						apReasoning:
							"AP CSA Java reasoning connects the code to halving behavior. The iterative version exposes loop invariants, while the recursive version exposes base cases and smaller search ranges.",
						checks: [
							"The target at the first, middle, and last positions is found.",
							"The absent-target case terminates when bounds cross.",
							"The recursive version changes the range on every recursive call."
						],
						extension:
							"Return the found index instead of a boolean and decide what to return when duplicates exist."
					}),
					projectLink: repo("APCS16-Binary-Search/starter"),
					solutionLink: repo("APCS16-Binary-Search/solution"),
					mediaLink: media("apcs16-project-1-binary-search.mp4")
				},
				{
					title: "Merge Step Visual",
					content: apProject({
						goal: "Use the merge visual to isolate the sorted-merge operation before implementing the full recursive sort.",
						steps: [
							"Start with two already sorted lists.",
							"Compare the first remaining value from each list.",
							"Move the smaller value into the output list.",
							"Append the rest of the non-empty list after the other side is exhausted."
						],
						apReasoning:
							"The merge operation is valid only because both input halves are already sorted. This precondition explains why the remaining tail can be copied without more cross-comparisons.",
						checks: [
							"Equal values follow a consistent tie rule.",
							"The output length equals the combined input lengths.",
							"The output remains sorted after every move."
						]
					}),
					projectLink: repo("APCS16-Merge-Sort/starter"),
					solutionLink: repo("APCS16-Merge-Sort/solution"),
					mediaLink: media("am_10_merge.mp4")
				}
			],
			supplementalProjects: [
				{
					title: "Project: Merge Sort",
					content: apProject({
						goal: "Implement recursive merge sort and explain how splitting plus merging creates `O(n log n)` behavior.",
						steps: [
							"Use an array of length zero or one as the base case.",
							"Split larger arrays into left and right halves.",
							"Recursively sort each half.",
							"Merge the two sorted halves into one sorted result."
						],
						apReasoning:
							"AP CSA Java reasoning for merge sort depends on recognizing the recursive structure and the linear work at each merge level. The algorithm has no best-case shortcut like insertion sort.",
						checks: [
							"Empty, single-element, duplicate-heavy, and already sorted arrays are handled.",
							"The merge helper assumes sorted inputs and preserves every element.",
							"The runtime explanation identifies both the number of levels and the work per level."
						],
						extension:
							"Track temporary-array allocation or implement an index-range version, then compare clarity and space usage."
					}),
					projectLink: repo("APCS16-Merge-Sort/starter"),
					solutionLink: repo("APCS16-Merge-Sort/solution"),
					mediaLink: media("apcs16-project-2-merge-sort.mp4")
				}
			]
		},
		{
			title: "APCS17 Master Projects and Test Prep",
			curriculum: [
				{
					title: "Practice Exam and FRQ Rhythm",
					content: apConcept({
						focus: "The final APCS stretch changes from learning isolated topics to switching between topics under time pressure. Multiple-choice practice trains recognition and tracing; FRQs train method contracts, partial credit, and concise written reasoning.",
						practice: [
							"Run short mixed-topic sets before assigning full exams.",
							"Score FRQs with official rubrics and identify the exact missed point category.",
							"Keep an error log by unit, such as arrays, ArrayLists, recursion, inheritance, or sorting.",
							"Reserve full practice exams for timed conditions rather than casual review."
						],
						evidence:
							"Practice is productive when missed questions produce a targeted review action, not only a score."
					})
				},
				{
					title: "Next Course Positioning",
					content: apConcept({
						focus: "The next course choice depends on the kind of work that remains challenging after AP CSA: Java design depth, C++ memory and systems work, Python/data projects, or contest-style algorithmic problem solving.",
						practice: [
							"Review the strongest completed project and the hardest unresolved topic.",
							"Compare exam-readiness evidence with independent-project evidence.",
							"Choose one next route and name the prerequisite that makes it appropriate.",
							"Record one skill to preserve during the transition, such as tracing, testing, or design explanation."
						],
						evidence:
							"The recommendation follows from demonstrated work: runnable code, trace explanations, FRQ scoring, and independence on new prompts."
					})
				},
				{
					title: "Core Project: Spaceships",
					content: apProject({
						goal: "Build a nested object model for a spaceship fleet using classes, collections, add/remove behavior, and readable `toString()` output.",
						steps: [
							"Define `Passenger`, `Room`, `Ship`, and `Fleet` responsibilities before coding.",
							"Store collections at the level that owns them: passengers in rooms, rooms in ships, ships in fleets.",
							"Implement add and remove methods that preserve valid state.",
							"Generate a random fleet and print it in a readable hierarchy."
						],
						apReasoning:
							"This capstone tests AP CSA Java reasoning with object ownership, collection traversal, method contracts, and string representation. The design matters as much as the final printed output.",
						checks: [
							"Each class owns only the state that belongs to its abstraction.",
							"Add/remove methods work for empty, typical, and already-missing cases.",
							"The printed fleet can be checked against the constructed object counts."
						],
						extension:
							"Add capacity limits per room or ship and explain where the validation belongs."
					}),
					projectLink: repo("APCS17-Spaceships/starter"),
					solutionLink: repo("APCS17-Spaceships/solution"),
					mediaLink: media("apcs17-master-project-1-spaceships.mp4")
				},
				{
					title: "Past FRQ Archive",
					content:
						"Keep the official College Board FRQ archive available throughout APCS17 for cycling through multiple years of real prompts. Use the archive strategically rather than randomly: choose one question type, attempt it under timing, then score it with the official rubric before moving to another year. Track patterns in missed points, such as missing helper methods, array traversal errors, object-state mistakes, or incomplete written reasoning, so review is driven by evidence. Build a short error log with the year, problem number, lost rubric point, and the Java concept that needs review.",
					projectLink: AP_FRQ_ARCHIVE
				}
			],
			supplementalProjects: [
				{
					title: "Master Project: Elevens",
					content: apProject({
						goal: "Implement the Elevens card-game variation with deck state, hand state, move validation, and replenishment after removals.",
						steps: [
							"Reuse or adapt the deck/card model from earlier modules.",
							"Deal a nine-card hand while cards remain available.",
							"Detect valid moves: pairs summing to eleven or a Jack-Queen-King group.",
							"Remove selected cards, refill the hand, and stop when the deck is cleared or no move remains."
						],
						apReasoning:
							"Elevens combines ArrayList mutation, object modeling, conditionals, and game-state loops. The hardest part is keeping collection changes correct while validating legal moves.",
						checks: [
							"Removing cards does not skip or corrupt later indexes.",
							"The game detects both winning and no-move ending states.",
							"Ace, face-card, and suit behavior matches the stated rules."
						],
						extension:
							"Add a move suggester that lists all valid moves and compare its output with manual traces."
					}),
					projectLink: repo("APCS17-Elevens/starter"),
					solutionLink: repo("APCS17-Elevens/solution"),
					mediaLink: media("apcs17-master-project-2-elevens.mp4")
				},
				{
					title: "Master Project: Decode",
					content: apProject({
						goal: "Build a message-and-tower communication model where matching secret numbers allow encoded messages to be decoded correctly.",
						steps: [
							"Define a `Message` class that stores text and can shift letters forward or backward.",
							"Define a `Tower` class with a secret number used for transmission and receiving.",
							"Preserve spaces, punctuation, or nonletters according to a stated rule.",
							"Test two towers with matching and non-matching secret numbers."
						],
						apReasoning:
							"Decode is AP CSA Java reasoning for strings, methods, object state, and encapsulation. The important design question is which class owns the shifting behavior and which class owns the secret key.",
						checks: [
							"Encoding and decoding with the same number restores the original message.",
							"Different tower numbers produce unreadable or different text.",
							"Wraparound behavior for letters is specified and tested."
						],
						extension:
							"Add a simple history of sent messages or support different shift strategies without exposing tower internals."
					}),
					projectLink: repo("APCS17-Decode/starter"),
					solutionLink: repo("APCS17-Decode/solution"),
					mediaLink: media("apcs17-master-project-3-decode.mp4")
				},
				{
					title: "2022 FRQ and Scoring Guidelines",
					content:
						"The 2022 AP CS A FRQ set and official scoring guidelines support timed practice and post-run scoring conversations. Attempt the prompt before reading the scoring document, then annotate the solution with where each point would be earned or lost. The goal is to learn AP scoring precision: correct idea, correct Java syntax, complete edge handling, and no extra behavior that contradicts the prompt. The follow-up pass rewrites only the missing or contradictory section, then records the exact rubric phrase that the revision now satisfies.",
					projectLink: AP_2022_FRQ,
					solutionLink: AP_2022_FRQ_SCORING
				},
				{
					title: "2020 Repo Practice Exam",
					content:
						"The 2020 practice exam is an additional full-run benchmark for timing, stamina, and mixed-topic switching when those matter more than another isolated concept drill. Use it after the major Java and data-structure topics have appeared. The post-exam review classifies misses by unit and by error type, then chooses one targeted project, trace drill, or FRQ correction before attempting another full mixed set. Record score, timing, skipped questions, and confidence level so the next practice run measures a specific improvement rather than repeating the same mixed review.",
					projectLink: repo("APCS-A-2020-Practice-Exam/starter"),
					solutionLink: repo("APCS-A-2020-Practice-Exam/solution")
				}
			]
		}
	]
};

const AP_CSA_ENRICHMENT_MODULES = new Set([
	"APCS7 Inheritance",
	"APCS8 Polymorphism"
]);

const AP_CSA_REFERENCE_ITEMS = new Set([
	"Required Textbook",
	"Reference Pack",
	"Loop Reference Pack",
	"Array Reference Pack",
	"ArrayList Reference Pack",
	"Recursion Reference Pack",
	"Next Course Positioning"
]);

const AP_CSA_MODULE_FLOW: Record<
	string,
	{
		estimatedTime: string;
		keyBlocks: string[];
		flowNote: string;
	}
> = {
	"General: Course Introduction and Setup": {
		estimatedTime: "2–3 sessions · 45–60 minutes each",
		keyBlocks: [
			"Fall 2025 CED",
			"four official units",
			"Java Quick Reference",
			"fully digital exam",
			"placement evidence"
		],
		flowNote:
			"Anchor pacing to the effective Fall 2025 College Board framework: four units, five computational thinking practices, the current Java Quick Reference, and a fully digital exam. Use recent code and handwritten or typed tracing to choose a route without skipping required AP-specific evidence."
	},
	"Check-In #1": {
		estimatedTime: "2 sessions · 45–60 minutes each",
		keyBlocks: [
			"Java syntax",
			"object-method trace",
			"String method",
			"numeric expression",
			"placement decision"
		],
		flowNote:
			"Use this as placement for Unit 1, not as a generic prerequisite exam. Verify object creation and method calls, exact String and numeric results, compiler reasoning, and one independent correction before assigning targeted review."
	},
	"APCS1 Variables and Input/Output": {
		estimatedTime: "3 sessions · 45–60 minutes each",
		keyBlocks: [
			"Unit 1",
			"primitive value",
			"String object",
			"method call",
			"expression type"
		],
		flowNote:
			"Map variables, primitive values, Strings, object construction, and method calls to Unit 1 Using Objects and Methods. Keyboard input remains useful programming enrichment, but exam-specific work emphasizes supplied values, method calls, exact output, and expression types."
	},
	"APCS2 Operators": {
		estimatedTime: "3 sessions · 45–60 minutes each",
		keyBlocks: [
			"Unit 1",
			"integer division",
			"remainder",
			"compound assignment",
			"boolean result"
		],
		flowNote:
			"Predict type and value before execution for arithmetic, casting, remainder, assignment, relational, and logical expressions. Test zero, sign, truncation, precedence, and boundary cases in the exact Java form used by AP questions."
	},
	"APCS3 Conditionals and Packages": {
		estimatedTime: "3 sessions · 45–60 minutes each",
		keyBlocks: [
			"Unit 1 to Unit 2",
			"library class",
			"boolean condition",
			"branch table",
			"random range"
		],
		flowNote:
			"Bridge Unit 1 library and method use into Unit 2 selection. Trace every branch, use `.equals()` for String content, derive random ranges from their possible endpoints, and explain package imports only to the depth required for accessible library classes."
	},
	"APCS4 Loops and Exceptions": {
		estimatedTime: "4 sessions · 45–60 minutes each",
		keyBlocks: [
			"Unit 2",
			"loop invariant",
			"termination",
			"nested iteration",
			"runtime error trace"
		],
		flowNote:
			"Complete Unit 2 Selection and Iteration with branch and loop traces, including nested loops and common runtime failures. Formal try-catch design is enrichment; the assessed reasoning is condition evaluation, state change, termination, output, and correction."
	},
	"Check-In #2": {
		estimatedTime: "2 sessions · 45–60 minutes each",
		keyBlocks: [
			"Unit 2 checkpoint",
			"branch coverage",
			"loop trace",
			"nested count",
			"FRQ family 1"
		],
		flowNote:
			"Close Unit 2 with one Methods and Control Structures FRQ-style response plus multiple-choice traces. Score method specification, conditions, iteration, helper calls, return value, and boundary behavior separately."
	},
	"APCS5 Classes Part I": {
		estimatedTime: "4 sessions · 45–60 minutes each",
		keyBlocks: [
			"Unit 3",
			"private field",
			"constructor",
			"method contract",
			"object state"
		],
		flowNote:
			"Begin Unit 3 Class Creation with private state, constructors, accessors, behavior methods, and object-state traces. Build from a specification table and test each constructor and method without adding unrequested public behavior."
	},
	"APCS6 Classes Part II": {
		estimatedTime: "4 sessions · 45–60 minutes each",
		keyBlocks: [
			"Unit 3",
			"this",
			"reference semantics",
			"state invariant",
			"FRQ family 2"
		],
		flowNote:
			"Complete Unit 3 through reference semantics, controlled mutation, `this`, constructor validity, and complete class writing. Practice the digital Class Design FRQ as a specification-matching task rather than an open-ended hierarchy exercise."
	},
	"Check-In #3": {
		estimatedTime: "2 sessions · 45–60 minutes each",
		keyBlocks: [
			"Unit 3 checkpoint",
			"class header",
			"private state",
			"constructor",
			"method implementation"
		],
		flowNote:
			"Use a complete class-design prompt to verify Unit 3. Score class header, fields, constructor, method signature, state updates, return behavior, and specification compliance; inheritance and polymorphism remain optional enrichment."
	},
	"APCS9 Software Development Lifecycle": {
		estimatedTime: "4 sessions · 45–60 minutes each",
		keyBlocks: [
			"Unit 4",
			"text-file Scanner",
			"precondition",
			"responsible computing",
			"independent verification"
		],
		flowNote:
			"Open Unit 4 Data Collections with specifications, text-file input, data provenance, failure preconditions, and responsible computing. Keyboard-validation projects remain enrichment; assessed file work uses `File`, `Scanner`, documented formats, and explicit close behavior."
	},
	"APCS10 Arrays": {
		estimatedTime: "5 sessions · 45–60 minutes each",
		keyBlocks: [
			"Unit 4",
			"1D array",
			"2D rectangular array",
			"row-column trace",
			"boundary index"
		],
		flowNote:
			"Develop and analyze 1D and rectangular 2D array algorithms. Test empty 1D arrays and rectangular row/column boundaries, trace row-major and column-major access, and match the current AP exclusion of nonrectangular 2D arrays."
	},
	"APCS11 ArrayLists": {
		estimatedTime: "4 sessions · 45–60 minutes each",
		keyBlocks: [
			"Unit 4",
			"generic element type",
			"index shift",
			"safe removal",
			"FRQ family 3"
		],
		flowNote:
			"Use typed `ArrayList<E>` operations, trace index shifts, and apply safe removal patterns without mutating through an enhanced for loop. Practice filtering, aggregation, and mutation in the current Data Analysis with ArrayList FRQ shape."
	},
	"Check-In #4": {
		estimatedTime: "2 sessions · 45–60 minutes each",
		keyBlocks: [
			"Unit 4 checkpoint",
			"ArrayList FRQ",
			"2D array FRQ",
			"typed response",
			"row scoring"
		],
		flowNote:
			"Use one ArrayList and one 2D-array digital FRQ response to check Unit 4 data reasoning before wrappers and algorithms. Type without compiler feedback, then score each required behavior and correct only the missed row."
	},
	"APCS12 Wrapper Classes": {
		estimatedTime: "3 sessions · 45–60 minutes each",
		keyBlocks: [
			"Unit 4",
			"Integer",
			"Double",
			"autoboxing",
			"parse contract"
		],
		flowNote:
			"Use `Integer` and `Double` as the object bridge for typed collections and parsing. Trace autoboxing, unboxing, null risk, constants, and `parseInt` or `parseDouble` behavior within the current Java Quick Reference."
	},
	"APCS13 Algorithmic Runtime and Linear Search": {
		estimatedTime: "3 sessions · 45–60 minutes each",
		keyBlocks: [
			"Unit 4",
			"linear search",
			"comparison count",
			"first or last match",
			"missing result"
		],
		flowNote:
			"Implement and trace linear search over arrays, ArrayLists, and rows of rectangular 2D arrays. State the return contract, count comparisons, and test empty, first, middle, last, duplicate, and missing cases; treat broader runtime analysis as useful enrichment around the required algorithm."
	},
	"APCS14 Selection and Insertion Sort": {
		estimatedTime: "4 sessions · 45–60 minutes each",
		keyBlocks: [
			"Unit 4",
			"selection sort",
			"insertion sort",
			"iteration trace",
			"element preservation"
		],
		flowNote:
			"Trace every outer iteration of selection and insertion sort on arrays and ArrayLists. Verify sortedness and element preservation on sorted, reverse, duplicate, negative, and short fixtures, with emphasis on determining intermediate states."
	},
	"APCS15 Recursion": {
		estimatedTime: "4 sessions · 45–60 minutes each",
		keyBlocks: [
			"Unit 4",
			"base case",
			"recursive call",
			"stack frame",
			"termination"
		],
		flowNote:
			"Identify base cases, recursive calls, parameter progress, and returned values for Strings and collections. Trace zero or empty, one-step, ordinary, and rejected inputs; newer Java features and tail-recursion optimization are outside the assessed path."
	},
	"APCS16 Binary Search and Merge Sort": {
		estimatedTime: "4 sessions · 45–60 minutes each",
		keyBlocks: [
			"Unit 4",
			"sorted precondition",
			"binary-search trace",
			"merge-sort trace",
			"recursive result"
		],
		flowNote:
			"Finish Unit 4 by determining each recursive step of binary search and merge sort. Enforce sorted input for binary search, strict interval reduction, merge invariants, and exact intermediate collection states; other search and sort families stay outside exam scope."
	},
	"APCS17 Master Projects and Test Prep": {
		estimatedTime: "8–10 sessions · 45–60 minutes each",
		keyBlocks: [
			"42 digital MCQ",
			"four FRQ families",
			"Java Quick Reference",
			"error log",
			"independent mastery"
		],
		flowNote:
			"Shift from topic learning to the current fully digital exam: 42 multiple-choice questions and four free-response families. Use the Quick Reference, type without compiler feedback, score by rubric row, maintain an error log, and complete no-AI readiness checks independently."
	}
};

const AP_CSA_CHECK_IN_COPY: Record<string, Record<string, string>> = {
	"Check-In #1": {
		"Review Goal":
			"Check-In #1 is a placement checkpoint before Unit 1. It samples Java syntax, object creation and method calls, Strings, numeric expressions, and short traces so the supported, standard, quick, challenge, or exam-focused route is selected from concrete evidence.",
		"Learning Target Coverage":
			"Use selected prompts for exact output, expression type and value, String methods, object-method effects, and one simple branch or loop. A miss identifies targeted review; it does not turn the placement check into an early cumulative exam.",
		"Core Check-In Prompt Bank":
			"Use the repository prompt bank selectively for placement. Record the attempted prompt, prediction, result, correction, and route decision, then begin Unit 1 with the smallest review set that addresses the evidence."
	},
	"Check-In #2": {
		"Review Goal":
			"Check-In #2 closes Units 1 and 2 with object-and-method reasoning plus selection and iteration. It includes one Methods and Control Structures FRQ-style method, exact expression or String traces, and multiple-choice work on conditions, loops, and runtime failures.",
		"Prompt Bank Coverage":
			"Use prompt-bank sections on values, method calls, Strings, arithmetic, boolean conditions, `for` and `while` loops, nested iteration, and runtime reasoning. Class-design and inheritance prompts remain for later modules or optional enrichment.",
		"Core Check-In Prompt Bank":
			"Complete the Unit 1 and Unit 2 portions of the repository prompt bank, type one method response without compiler feedback, and record the first incorrect state transition or omitted requirement before revising."
	},
	"Check-In #3": {
		"Review Goal":
			"Check-In #3 closes Unit 3 Class Creation. The checkpoint verifies a complete class header, private instance variables, constructor initialization, requested methods, controlled state changes, reference reasoning, and exact compliance with a supplied specification.",
		"Prompt Bank Coverage":
			"Use class-definition, constructor, accessor, mutator, `this`, reference, and object-state prompts. Inheritance, overriding, and polymorphism prompts belong to the optional enrichment appendix rather than this required checkpoint.",
		"Core Check-In Prompt Bank":
			"Use the class-creation portions of the repository prompt bank and complete one Class Design FRQ-family response without compiler feedback. Score the header, fields, constructor, methods, state behavior, and specification match separately."
	},
	"Check-In #4": {
		"Review Goal":
			"Check-In #4 checks the first Data Collections sequence: 1D arrays, rectangular 2D arrays, `ArrayList`, index shifts, mutation, traversal order, and method contracts before wrapper, recursion, searching, and sorting work continues.",
		"Prompt Bank Coverage":
			"Use array, rectangular 2D-array, and `ArrayList` prompts that expose indexes, row-column order, enhanced-loop limits, insertion, removal, and returned or mutated results.",
		"Core Check-In Prompt Bank":
			"Complete one Data Analysis with ArrayList response and one 2D Array response without compiler feedback. Score each required behavior, syntax boundary, traversal decision, and edge case, then revise only the missed row."
	}
};

function alignApCsaCheckInItem(
	moduleTitle: string,
	item: RawCourseModuleItem
): RawCourseModuleItem {
	const content = AP_CSA_CHECK_IN_COPY[moduleTitle]?.[item.title];
	return content ? { ...item, content } : item;
}

function apCsaSupplementalPath(item: RawCourseModuleItem) {
	return /extension|challenge|inheritance|polymorphism|legacy|2020|2022|next course/i.test(
		`${item.title}\n${item.content}`
	)
		? ("challenge" as const)
		: ("choice" as const);
}

function strengthenApCsaItem(item: RawCourseModuleItem): RawCourseModuleItem {
	if (item.title === "Course Positioning") {
		return {
			...item,
			content:
				"AP Computer Science A is a Java course aligned to the effective Fall 2025 framework: Unit 1 Using Objects and Methods, Unit 2 Selection and Iteration, Unit 3 Class Creation, and Unit 4 Data Collections. Programming projects build durable skill while AP practice repeatedly exercises design, development, analysis, documentation, and responsible computing."
		};
	}

	if (item.title === "Track Guide") {
		return {
			...item,
			content: [
				"The APCS track guide separates Slow/Supported, Medium/Standard, Fast/Quick, Hard/Challenge, and Exam-focused pacing while preserving the four-unit Fall 2025 framework.",
				"Placement uses recent code, Java-specific mistakes, hand tracing, object-state explanations, and AP-style written reasoning. Fast learners may compress early syntax practice, but Unit 1 object/method evidence, Unit 2 selection/iteration, Unit 3 full class creation, and Unit 4 arrays, ArrayLists, rectangular 2D arrays, text files, recursion, searching, and sorting remain represented.",
				"Designing inheritance hierarchies and polymorphic projects now live in optional enrichment because the current CED excludes designing and implementing inheritance relationships from the course and exam.",
				"Challenge work deepens the same assessed concept through validation, tests, data files, edge-case analysis, or specification evidence rather than replacing exam scope with unrelated language features."
			].join("\n\n")
		};
	}

	if (item.title === "Java Toolchain and Workflow") {
		return {
			...item,
			content:
				"Use a full JDK with a fast compile-run cycle. The effective Fall 2025 CED recommends Java 22 and accepts Java 17 as a minimum; this repository's Windows setup remains tested with Temurin 21. Assessed work stays within the current Java Quick Reference and avoids lambdas, streams, and newer language features that are outside AP exam scope."
		};
	}

	if (item.title === "Nested Loops and Early Exception Reasoning") {
		return {
			...item,
			title: "Nested Loops and Runtime Error Reasoning",
			content:
				"Trace nested loops by row, column, and total execution count, then diagnose bounds, arithmetic, and termination failures from the exact state that causes them. Formal try-catch design remains programming enrichment rather than required exam content."
		};
	}

	if (item.title === "Free Response Prep") {
		return {
			...item,
			content:
				"Begin Class Design FRQ-family writing with small, complete specifications. Name the private instance variables, constructor contract, requested methods, return values, and state changes; test ordinary, boundary, and repeated calls. Score each requested class element separately and correct the first missing or contradictory behavior without adding an inheritance hierarchy or unrequested public API."
		};
	}

	if (item.title === "Robust Input and Failure Handling") {
		return {
			...item,
			content:
				"Keyboard validation is useful programming enrichment, but accepting keyboard input is outside current AP exam scope. Use this project to separate optional interface robustness from required Unit 4 text-file reasoning with `File`, `Scanner`, documented preconditions, and explicit close behavior."
		};
	}

	if (item.title === "Practice Exam and FRQ Rhythm") {
		return {
			...item,
			content: apConcept({
				focus: "The final stretch prepares for the fully digital exam: 42 multiple-choice questions and four FRQ families—Methods and Control Structures, Class Design, Data Analysis with ArrayList, and 2D Array.",
				practice: [
					"Run short mixed sets before full digital simulations.",
					"Type FRQ responses without compiler feedback and use the current Java Quick Reference.",
					"Score each response by rubric row and record the exact missed behavior.",
					"Select one targeted correction before another mixed set."
				],
				evidence:
					"Readiness includes timing, typed-code accuracy, specification compliance, and a shrinking error log rather than a score alone."
			})
		};
	}

	if (item.title === "Past FRQ Archive") {
		return {
			...item,
			content:
				"Use the official College Board archive with year labels and scope checks. The 2026 released FRQs align to the revised exam; older questions can still provide useful method, class, array, or list practice but do not completely align with the current framework. Record year, FRQ family, rubric row, lost behavior, and targeted correction.",
			projectLink: AP_FRQ_ARCHIVE
		};
	}

	if (item.title === "2022 FRQ and Scoring Guidelines") {
		return {
			...item,
			content:
				"**Legacy practice:** The 2022 FRQs and scoring guidelines predate the Fall 2025 revision. Use only questions or parts that map cleanly to a current method/control, class-design, ArrayList, or 2D-array target, and label any out-of-scope inheritance or legacy format before assigning the task. Record the mapped current FRQ family, attempted rubric rows, first lost behavior, and corrected response so older material remains targeted practice rather than a substitute exam blueprint."
		};
	}

	if (item.title === "2020 Repo Practice Exam") {
		return {
			...item,
			content:
				"**Legacy practice:** The 2020 repository exam predates the Fall 2025 framework and the fully digital format. Use selected aligned questions for stamina or mixed tracing, never as the current exam blueprint; map every assigned question to one of the four units and record any excluded topic."
		};
	}

	return item;
}

function insertApCsaItem(
	items: RawCourseModuleItem[],
	beforeTitle: string,
	item: RawCourseModuleItem
) {
	const index = items.findIndex(candidate => candidate.title === beforeTitle);
	if (index === -1) return [...items, item];
	return [...items.slice(0, index), item, ...items.slice(index)];
}

function decorateApCsaModule(
	module: RawCourse["modules"][number]
): RawCourse["modules"][number] {
	const flow = AP_CSA_MODULE_FLOW[module.title];
	const movedReferences = module.curriculum.filter(item =>
		AP_CSA_REFERENCE_ITEMS.has(item.title)
	);
	let curriculum: RawCourseModuleItem[] = module.curriculum
		.filter(item => !AP_CSA_REFERENCE_ITEMS.has(item.title))
		.map(strengthenApCsaItem)
		.map(item => alignApCsaCheckInItem(module.title, item))
		.map(item => ({
			...item,
			learningPath: "core" as const
		}));

	if (module.title === "General: Course Introduction and Setup") {
		curriculum = curriculum.map((item, index) =>
			index === 0
				? { ...item, content: item.content + gitCourseGuideLink }
				: item
		);
		curriculum = insertApCsaItem(curriculum, "Track Guide", {
			title: "Current Four-Unit Framework and Digital Exam",
			content: [
				"**Official baseline:** The effective Fall 2025 CED organizes AP CSA into Unit 1 Using Objects and Methods, Unit 2 Selection and Iteration, Unit 3 Class Creation, and Unit 4 Data Collections.",
				"",
				"**Exam contract:** The current fully digital exam has 42 multiple-choice questions in 90 minutes and four free-response questions in 90 minutes: Methods and Control Structures, Class Design, Data Analysis with ArrayList, and 2D Array.",
				"",
				"**Routine:** Use the current Java Quick Reference throughout the course, practice typed responses without compiler feedback, and score design, development, analysis, documentation, and responsible-computing evidence independently."
			].join("\n"),
			projectLink: AP_CSA_CED,
			datasetLink: AP_CSA_QUICK_REFERENCE,
			learningPath: "core"
		});
	}

	if (module.title === "APCS4 Loops and Exceptions") {
		curriculum.push({
			title: "AP Scope Boundary: Iteration and Exceptions",
			content: [
				"**Required AP evidence:** Trace and write conditional, `for`, `while`, and nested-loop code; explain initialization, condition, update, termination, output, and runtime failures.",
				"",
				"**Enrichment boundary:** General try-catch design is not part of the current required framework. Exception-related examples support debugging only; they do not displace selection, iteration, or Methods and Control Structures FRQ practice."
			].join("\n"),
			learningPath: "core"
		});
	}

	if (module.title === "APCS6 Classes Part II") {
		curriculum.push({
			title: "FRQ Family 2: Class Design Contract",
			content: [
				"**Completion evidence:**",
				"- Translate the specification table into a class header, private instance variables, a constructor, and the requested method.",
				"- Match names, parameter types, return types, visibility, initial state, and behavior exactly.",
				"- Test ordinary, boundary, and repeated-call state without adding an inheritance hierarchy or unrequested public API.",
				"- Type one complete response without compiler feedback, then score each required element separately."
			].join("\n"),
			learningPath: "core"
		});
	}

	if (module.title === "APCS9 Software Development Lifecycle") {
		curriculum.push(
			{
				title: "Unit 4 Text-File Input Contract",
				content: [
					"**Completion evidence:**",
					"- Read a documented course-owned text file with `File` and `Scanner`, using only the current Java Quick Reference methods.",
					"- State the file precondition or `throws IOException` boundary and close the scanner after use.",
					"- Test missing-file policy separately from empty, one-record, malformed, and ordinary fixtures.",
					"- If `nextLine()` and token methods appear in enrichment work, explain whitespace behavior; mixed-method analysis and keyboard input remain outside current exam scope."
				].join("\n"),
				projectLink: AP_CSA_CED,
				learningPath: "core"
			},
			{
				title: "Responsible Computing and Independent AI Use",
				content: [
					"Use computing responsibly by checking data provenance, privacy, bias, accessibility, and the social effect of a program design.",
					"",
					"AI tools may support explanation, alternative exploration, or feedback during guided learning only when local course policy permits. Students verify every suggestion, document permitted assistance, and complete protected check-ins and exam simulations independently without AI. No real personal, credential, health, or financial data enters classroom fixtures."
				].join("\n"),
				projectLink: AP_CSA_CED,
				learningPath: "core"
			}
		);
	}

	if (module.title === "Check-In #4") {
		curriculum.push({
			title: "FRQ Families 3 and 4: Data Collections Contract",
			content: [
				"**ArrayList response:** Match the supplied class and method specification, traverse typed objects, mutate without skipped indexes or concurrent modification, and return exactly the requested result.",
				"",
				"**2D-array response:** Treat exam arrays as rectangular, keep row and column indexes distinct, trace requested traversal order, and verify edge rows, edge columns, and the smallest valid grid.",
				"",
				"Type both responses without compiler feedback and score required behavior, syntax, and boundary handling by row."
			].join("\n"),
			learningPath: "core"
		});
	}

	if (module.title === "APCS17 Master Projects and Test Prep") {
		curriculum = insertApCsaItem(curriculum, "Past FRQ Archive", {
			title: "2026 Released FRQ Set",
			content:
				"Use the released 2026 FRQs as the current-framework benchmark. Complete each question in the digital family it represents, type without compiler feedback, use only the supplied classes and current Java Quick Reference, and record uncertain syntax or omitted behavior before comparing with any available official scoring material.",
			projectLink: AP_2026_FRQ,
			learningPath: "core"
		});
		curriculum.push({
			title: "Digital Exam Completion Contract",
			content: [
				"**Readiness evidence:**",
				"- Two timed 90-minute digital sections using 42 multiple-choice questions and four typed FRQs, with the current Quick Reference available.",
				"- FRQ coverage includes Methods and Control Structures, Class Design, Data Analysis with ArrayList, and 2D Array.",
				"- Error log records unit, computational thinking practice, rubric row or reasoning error, correction, and a later successful transfer check.",
				"- At least one full simulation is completed independently without compiler, IDE execution, or AI assistance, followed by targeted review rather than immediate repetition."
			].join("\n"),
			projectLink: AP_CSA_EXAM,
			datasetLink: AP_CSA_QUICK_REFERENCE,
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
		title:
			module.title === "APCS4 Loops and Exceptions"
				? "APCS4 Selection, Iteration, and Runtime Reasoning"
				: module.title,
		estimatedTime: flow.estimatedTime,
		keyBlocks: flow.keyBlocks,
		curriculum,
		supplementalProjects: [
			...module.supplementalProjects.map(strengthenApCsaItem),
			...movedReferences
		].map(item => ({
			...item,
			learningPath: apCsaSupplementalPath(item)
		}))
	};
}

function buildOptionalApCsaOopExtension(
	modules: RawCourse["modules"]
): RawCourse["modules"][number] {
	return {
		kind: "appendix",
		title: "Optional Inheritance and Polymorphism Enrichment",
		estimatedTime:
			"Choose after Unit 3 only when enrichment time is available",
		keyBlocks: [
			"out-of-scope label",
			"superclass",
			"override",
			"dynamic dispatch",
			"substitutability"
		],
		curriculum: [
			{
				title: "Inheritance and Polymorphism Scope Guide",
				content:
					"**Course flow:** APCS7 Inheritance and APCS8 Polymorphism remain available as Java enrichment after Unit 3. The effective Fall 2025 CED explicitly excludes designing and implementing inheritance relationships from AP CSA course and exam scope, so these projects do not replace class-creation or data-collection practice.",
				learningPath: "core"
			}
		],
		supplementalProjects: modules.flatMap(module =>
			[...module.curriculum, ...module.supplementalProjects].map(
				item => ({
					...item,
					learningPath: apCsaSupplementalPath(item)
				})
			)
		)
	};
}

const apCsaPrimaryModules = apComputerScienceASourceCourse.modules
	.filter(module => !AP_CSA_ENRICHMENT_MODULES.has(module.title))
	.map(decorateApCsaModule);
const apCsaEnrichmentModules = apComputerScienceASourceCourse.modules.filter(
	module => AP_CSA_ENRICHMENT_MODULES.has(module.title)
);

export const apComputerScienceACourse: RawCourse = {
	...apComputerScienceASourceCourse,
	modules: [
		...apCsaPrimaryModules,
		buildOptionalApCsaOopExtension(apCsaEnrichmentModules)
	]
};

applyApcsPendingMediaNotices(apComputerScienceACourse);
