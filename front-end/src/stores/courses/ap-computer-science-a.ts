import type { RawCourse, RawCourseModuleItem } from "./types";
import {
	apAdvancedPracticeResources,
	apBinarySearchResources,
	apBlobEraseResources,
	apCheckInAndFrqResources,
	apClassesAndArraysResources,
	apElevatorWarningResources,
	apEnrichmentResources,
	apExpressionsAndClassResources,
	apFarmAndShapeResources,
	apFoundationsSupplementalResources,
	apInputAndCardResources,
	apIntroductoryResources,
	apListsAndAlgorithmsResources,
	apMergeSortResources,
	apRecursionPracticeResources,
	apRecursionReferenceResources,
	apRemainingCoreResources,
	apRuntimeAnalysisResources,
	apStoryShuffleTraceResources,
	apStudentClassResources,
	apTextFileInputResources,
	apVariablesAndLoopsResources
} from "@/modules/apComputerScienceAResources";
import { gitCourseGuideLink } from "./classroomReferenceGuides";
import {
	staticMediaFilename,
	withPendingStaticMediaNotice
} from "./staticMedia";

const STATIC_MEDIA_BASE = "https://static.classes.jacobdanderson.net";
const BARRONS_TEXTBOOK =
	"https://www.simonandschuster.com/books/AP-Computer-Science-A-Premium-13th-Edition-Prep-Book-with-6-Practice-Tests-%2B-Comprehensive-Review/Roselyn-Teukolsky/Barrons-AP-Prep/9798349700354";
const AP_2024_FRQ =
	"https://apcentral.collegeboard.org/media/pdf/ap24-frq-comp-sci-a.pdf";
const AP_2024_FRQ_SCORING =
	"https://apcentral.collegeboard.org/media/pdf/ap24-sg-computer-science-a.pdf";
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
					id: "ap-computer-science-a-general-course-introduction-and-setup-supplemental-required-textbook",
					title: "Practice Resources",
					content: `Use the course lessons and project checks, the sample questions in the [College Board course description](${AP_CSA_CED}), and the [released 2026 free-response set](${AP_2026_FRQ}) for free practice. Pick questions that match the current lesson, explain each answer with a code trace or rubric item, and review missed concepts at the next check-in. Barron's AP Computer Science A Premium, 13th Edition is an optional source of additional questions aligned to the 2026 exam outline.`,
					projectLink: BARRONS_TEXTBOOK,
					contentKind: "reading",
					preserveInstructions: true
				},
				{
					title: "Reference Pack",
					content: `Read each declaration in Main.java. The \`int\` points start at 40, the \`double\` multiplier is 0.5, the \`boolean\` open status is false, and the \`final int\` ticket cost is 10. Run the starter and match its output to those four declarations.

Assign 50 to \`points\` after the first output and print the updated value. Assignment replaces the stored value while keeping the variable's declared type. The ticket cost receives its value in the declaration and keeps it because it is \`final\`. Check that the only changed value is the points. The worked reference shows the reassignment alongside the original four lines.`,
					projectLink:
						apVariablesAndLoopsResources["variables-reference"]
							.starter,
					solutionLink:
						apVariablesAndLoopsResources["variables-reference"]
							.reference,
					ideImport: true,
					preserveInstructions: true,
					preserveAssignment: true
				}
			],
			supplementalProjects: [
				{
					title: "Strings and Printing Reference",
					content:
						"Open the [Strings and Printing Reference in APCS1](/courses#ap-computer-science-a-apcs1-variables-and-input-output-ap-computer-science-a-apcs1-variables-and-input-output-supplemental-strings-and-printing-reference) to practice concatenation, line breaks, and quotation marks in the Java IDE.",
					contentKind: "reading",
					preserveInstructions: true,
					preserveAssignment: true
				},
				{
					title: "Casting Reference",
					content: apProject({
						goal: "Compare integer division with division involving a `double`.",
						steps: [
							"Trace `3 / 2` and `(double) 3 / 2` before running `Main.java`.",
							"Store and print `(double) (3 / 2)`. Identify which operation Java evaluates first.",
							"Cast `-2.75` to `int` and compare the result with rounding down."
						],
						apReasoning:
							"Integer division and a cast to `int` discard a fractional part toward zero. Casting an operand to `double` before dividing preserves the fractional quotient.",
						checks: [
							"The two starter results are 1 and 1.5.",
							"Casting after division gives 1.0 on a JDK. The browser preview can display it as 1.",
							"Casting -2.75 to `int` gives -2."
						]
					}),
					projectLink:
						apVariablesAndLoopsResources["casting-reference"]
							.starter,
					solutionLink:
						apVariablesAndLoopsResources["casting-reference"]
							.reference,
					ideImport: true,
					preserveInstructions: true,
					preserveAssignment: true
				},
				{
					title: "2020 Practice Exam",
					contentKind: "reading",
					preserveInstructions: true,
					content:
						"After practicing methods and lists, use the [APCS17 legacy diagnostic](/courses#ap-computer-science-a-apcs17-master-projects-and-test-prep-ap-computer-science-a-apcs17-master-projects-and-test-prep-supplemental-2020-repo-practice-exam) to review method control, class state, and list traversal. The worksheet includes the inputs and checks for both prompts."
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
					content: apProject({
						goal: "Use a short Java trace to identify what to review before Unit 1.",
						steps: [
							"Predict the type and printed result of `7 / 2` and `7 / 2.0`. Trace `substring(1, 4)` on `crate` using zero-based indexes.",
							"Complete `completeGroups` for a nonnegative item count and a positive group size. Count full groups only.",
							"Trace the branch and the loop after making groups of three from seven items. Run the program, then compare with the prediction."
						],
						apReasoning:
							"Record the first mismatch and the rule behind it. Use the mismatch to choose review of expressions, String methods, or loop bounds.",
						checks: [
							"The expression results are `3` and `3.5`. The slice is `rat`. The completed program prints two group lines.",
							"Check zero items and a case with no leftover items."
						]
					}),
					projectLink: apCheckInAndFrqResources["check-in-1"].starter,
					solutionLink:
						apCheckInAndFrqResources["check-in-1"].reference,
					ideImport: true,
					preserveInstructions: true,
					preserveAssignment: true
				}
			],
			supplementalProjects: [
				{
					title: "Additional Practice: FizzBuzz",
					content: apProject({
						goal: "Use a countdown and divisibility checks to print one result per number.",
						steps: [
							"Run the supplied countdown from 100 through 0.",
							"Check whether the number is divisible by both 3 and 5. Print FizzBuzz in that case.",
							"For the remaining numbers, print Fizz for multiples of 3, Buzz for multiples of 5, and the number itself otherwise."
						],
						apReasoning:
							"A remainder of 0 identifies a multiple. Place the combined condition first so each number receives one label.",
						checks: [
							"The 101 lines begin Buzz, Fizz, 98, 97, Fizz.",
							"The line for 15 is FizzBuzz. The final line for 0 is also FizzBuzz."
						]
					}),
					projectLink: apVariablesAndLoopsResources.fizzbuzz.starter,
					solutionLink:
						apVariablesAndLoopsResources.fizzbuzz.reference,
					ideImport: true,
					preserveInstructions: true,
					preserveAssignment: true,
					mediaLink: media("ps4_fizzbuzz.gif")
				},
				{
					title: "Variables Reference",
					content:
						"Open the [Variables Reference in General](/courses#ap-computer-science-a-general-course-introduction-and-setup-ap-computer-science-a-general-course-introduction-and-setup-supplemental-reference-pack) to check declarations, reassignment, and constants with the same Java workspace used at the start of the course.",
					contentKind: "reading",
					preserveInstructions: true,
					preserveAssignment: true
				},
				{
					title: "Loops Reference",
					content:
						"Open the [Loop Reference Pack in APCS4](/courses#ap-computer-science-a-apcs4-selection-iteration-and-runtime-reasoning-ap-computer-science-a-apcs4-selection-iteration-and-runtime-reasoning-supplemental-loop-reference-pack) to compare the two loop forms. Trace the first successful test, the last printed value, and the condition that ends each loop.",
					contentKind: "reading",
					preserveInstructions: true,
					preserveAssignment: true
				}
			]
		},
		{
			title: "APCS1 Variables and Input/Output",
			curriculum: [
				{
					title: "Variables, Primitive Types, and Strings",
					contentKind: "reading",
					preserveInstructions: true,
					content: [
						"A variable declaration names a type and a place to store a value. Here `int` stores a whole number, `double` stores a floating-point number, and `boolean` stores true or false. `String` is a class. A String variable holds a reference to text.",
						'```java\nint trays = 2;\ndouble price = 1.25;\nString fruit = "pears";\ntrays = trays + 1;\nboolean enough = trays >= 3;\nSystem.out.println(trays + " trays of " + fruit);\nSystem.out.println(trays * price);\nSystem.out.println(enough);\n```',
						"Trace the assignment before predicting the three lines. Java reads the old value of trays on the right, adds one, then stores 3 on the left. The program prints `3 trays of pears`, `3.75`, and `true`. Change the initial count to 1. Which outputs change?"
					].join("\n\n")
				},
				{
					title: "Scanners, Formatting, and Casting",
					contentKind: "reading",
					preserveInstructions: true,
					content: [
						"Put `import java.util.Scanner;` above the class. In a console program, values are typed by the user and Scanner reads them in order. `nextLine()` reads an entire line, including spaces between words. `nextInt()` reads an integer token. For this example enter `North Pier` on the first line and `7` on the second.",
						'```java\nScanner input = new Scanner(System.in);\nString stop = input.nextLine();\nint riders = input.nextInt();\nSystem.out.println(stop + " / " + riders);\nSystem.out.println(riders / 2);\nSystem.out.println((double) riders / 2);\n```',
						"Predict each line before running. The label is `North Pier / 7`. Dividing two integers gives 3 because integer division discards the fractional part. Casting riders to double before division gives 3.5. Compare that with `(double) (riders / 2)`, which converts the integer result to 3.0."
					].join("\n\n")
				},
				{
					title: "Core Project: Mad Libs",
					content: [
						"Build a travel story from four lines of input: an adjective, a place, a plural noun, and a game. Read each whole line with Scanner.nextLine() so names can contain spaces. The starter reads the adjective and shows where the next three inputs belong. Replace each sample string with its own prompt and read.",
						"Test with misty, Cedar Falls, paper boats, and table tennis on separate lines. Expected story: We reached misty Cedar Falls. We raced paper boats and played table tennis. Change only the place to West Bay. Check that both words appear in the first sentence and the game in the second sentence stays the same."
					].join("\n\n"),
					projectLink:
						apStoryShuffleTraceResources["mad-libs"].starter,
					solutionLink:
						apStoryShuffleTraceResources["mad-libs"].reference,
					ideImport: true,
					preserveInstructions: true,
					preserveAssignment: true,
					mediaLink: media("apcs1-project-1-mad-libs.mp4")
				},
				{
					title: "Barron's Chapter 2 Habit",
					content:
						"Predict the type and value of each expression before running it: `9 / 4`, `(double) 9 / 4`, and `(double) (9 / 4)`. Check each step: the first gives the int 2, the second gives the double 2.25, and the third gives the double 2.0 because division happens before the cast. Repeat with 11 and 4. The matching textbook chapter offers additional practice."
				}
			],
			supplementalProjects: [
				{
					title: "Project: Rounding It Off",
					content: apProject({
						goal: "Use casts and arithmetic to round practice amounts between 0 and 999999.",
						steps: [
							"Run Main.java and enter 27.5. The supplied integer cast gives 27.",
							"For rounding up, start at the cast value. Add one only if the original amount is greater than that value.",
							"To round to a nearest multiple, divide by the step, add 0.5, cast, and multiply by the step. Use steps of 1, 10, and 100."
						],
						apReasoning:
							"Before casting, adding 0.5 moves a value at or above the halfway point into the next interval.",
						checks: [
							"For 27.5, down and up are 27 and 28. The nearest 1, 10, and 100 give 28, 30, and 0.",
							"At 30.0, both down and up stay 30. Check ties at 5.0 for tens and 50.0 for hundreds."
						]
					}),
					projectLink: apIntroductoryResources.rounding.starter,
					solutionLink: apIntroductoryResources.rounding.reference,
					ideImport: true,
					preserveInstructions: true,
					preserveAssignment: true,
					mediaLink: media("apcs1-project-2-rounding-it-off.mp4")
				},
				{
					title: "Project: Hospital Survey",
					content: apProject({
						goal: "Read and label a fictional practice record with text, a whole number, and a Boolean.",
						steps: [
							"Run Main.java and enter PRACTICE-17, 12, Sample queue comment, and true on four separate lines.",
							"The starter reads the code and wait. After nextInt, call nextLine once to consume the rest of that line.",
							"Read the following comment with nextLine and the final field with nextBoolean. Print each value with a label."
						],
						apReasoning:
							"Trace which reads consume a token and which consume a line. Preserve the spaces within the comment.",
						checks: [
							"The output reports 12 minutes, the complete comment, and true.",
							"Try another fictional record with an empty comment and false on the last line."
						]
					}),
					projectLink:
						apIntroductoryResources["hospital-survey"].starter,
					solutionLink:
						apIntroductoryResources["hospital-survey"].reference,
					ideImport: true,
					preserveInstructions: true,
					preserveAssignment: true,
					mediaLink: media("apcs1-project-3-hospital-survey.mp4")
				},
				{
					title: "Strings and Printing Reference",
					content: apProject({
						goal: "Predict exact console output when Java combines text and values.",
						steps: [
							"Trace `Main.java` before running. Mark where `print` keeps the cursor on the active line and where `println` starts a new line.",
							"Add a label and a value on the same line, followed by a line break.",
							'In the reference, compare `"" + 2 + 3` with `"" + (2 + 3)`.'
						],
						apReasoning:
							"Java evaluates addition and concatenation from left to right at the same precedence. Parentheses can make arithmetic happen first.",
						checks: [
							"Name: Fern and Score: 4 appear on separate lines.",
							"The newline escape separates First line and Second line. The quotes around Ready appear in the output.",
							"The reference joins the digits as 23 and adds the values as 5."
						]
					}),
					projectLink:
						apFoundationsSupplementalResources["strings-printing"]
							.starter,
					solutionLink:
						apFoundationsSupplementalResources["strings-printing"]
							.reference,
					ideImport: true,
					preserveInstructions: true,
					preserveAssignment: true
				}
			]
		},
		{
			title: "APCS2 Operators",
			curriculum: [
				{
					title: "Arithmetic and Update Operators",
					contentKind: "reading",
					preserveInstructions: true,
					content: [
						"Multiplication, division, and remainder are evaluated before addition and subtraction. Operators at the same level in this example run left to right. Remainder gives the part left over after whole groups are removed.",
						"```java\nint seats = 17;\nint rows = seats / 5;\nint left = seats % 5;\nseats += 2 * left;\nrows++;\nSystem.out.println(seats);\nSystem.out.println(rows);\n```",
						"Record seats, rows, and left after each assignment. Seventeen seats fill three rows of five with two left over. The update adds four to seats. The final lines are 21 and 4. Replace `rows++` with `rows--` and predict the second line."
					].join("\n\n")
				},
				{
					title: "Relational and Logical Operators",
					contentKind: "reading",
					preserveInstructions: true,
					content: [
						"A comparison produces a boolean. With `&&`, Java stops as soon as an operand is false. With `||`, it stops as soon as an operand is true. String.equals compares character content. For objects, `==` compares references.",
						'```java\nString first = new String("oak");\nString second = new String("oak");\nint groups = 0;\nSystem.out.println(first == second);\nSystem.out.println(first.equals(second));\nSystem.out.println(groups != 0 && 12 / groups >= 3);\n```',
						"The first line is false because each constructor created a distinct object. The second is true. The last line is false, and the division is skipped. Predict the last line for groups equal to 3, then 6."
					].join("\n\n")
				},
				{
					title: "Core Project: Verifying Expressions",
					content: apProject({
						goal: "Predict each expression's type and value before running it.",
						steps: [
							"Open `Main.java` and trace the supplied comparison with `40.0`. Add a test for `35 <= forty`.",
							"Cast `40.0` to `int` and compare the result with its original value. Repeat the cast and equality check with `35.5`.",
							"Copy the second Boolean result into another Boolean variable. Print the copy and compare the two Boolean values. For the last test, use `divisor = 0` and check `divisor != 0 && 40 / divisor > 2`."
						],
						apReasoning:
							"Compare values after the cast rather than before it. Assignment preserves the Boolean value. With `&&`, Java tests the right operand only when the left operand is true.",
						checks: [
							"The eight labeled results are false, true, 40, true, false, false, true, and false.",
							"Explain why the final expression completes without dividing by zero."
						]
					}),
					projectLink:
						apExpressionsAndClassResources["verifying-expressions"]
							.starter,
					solutionLink:
						apExpressionsAndClassResources["verifying-expressions"]
							.reference,
					ideImport: true,
					preserveInstructions: true,
					preserveAssignment: true
				},
				{
					title: "Chapter 2 Multiple Choice Focus",
					content:
						"Use the expressions from Verifying Expressions or the free course-description sample questions. Trace parentheses, arithmetic, comparison, and boolean logic before running the code. Explain one example where integer division differs from decimal division, and record the type and value of one expression. The matching textbook chapter is an optional source of similar questions."
				}
			],
			supplementalProjects: [
				{
					title: "Project: Quotient and Remainder",
					content: apProject({
						goal: "Compute a quotient and remainder and use them to reconstruct the dividend.",
						steps: [
							"Run Main.java and enter the dividend first and the divisor second. Use integers from -10000 to 10000.",
							"Use / for the integer quotient and % for the remainder. Print them with separate labels.",
							"Use the supplied zero guard to explain when division has no result."
						],
						apReasoning:
							"Multiply the divisor by the quotient and add the remainder to recover the original dividend.",
						checks: [
							"For 17 divided by 5, the quotient is 3 and the remainder is 2. For 12 divided by 4, the remainder is 0.",
							"For -17 divided by 5, check quotient -3 and remainder -2. For 7 divided by 0, expect the guard message."
						]
					}),
					projectLink:
						apIntroductoryResources["quotient-and-remainder"]
							.starter,
					solutionLink:
						apIntroductoryResources["quotient-and-remainder"]
							.reference,
					ideImport: true,
					preserveInstructions: true,
					preserveAssignment: true,
					mediaLink: media(
						"apcs2-project-1-quotient-and-remainder.mp4"
					)
				},
				{
					title: "Project: Too Chicken to Cross the Road",
					content: apProject({
						goal: "Return one Boolean result from four input flags.",
						steps: [
							"Run `Main.java` with four `true` or `false` tokens in this order: left side clear, right side clear, scared, companion present.",
							"In `canCross`, require both directions to be clear.",
							"Require either that the character is unafraid or that a companion is present. Combine that group with the safety check."
						],
						apReasoning:
							"Use `&&`, `||`, `!`, and parentheses to group the rules. Trace each group before evaluating the full expression.",
						checks: [
							"`true true false false` and `true true true true` both return true.",
							"`true true true false` returns false.",
							"A false safety flag always gives false."
						]
					}),
					projectLink:
						apFoundationsSupplementalResources["boolean-crossing"]
							.starter,
					solutionLink:
						apFoundationsSupplementalResources["boolean-crossing"]
							.reference,
					ideImport: true,
					preserveInstructions: true,
					preserveAssignment: true,
					mediaLink: media(
						"apcs2-project-3-too-chicken-to-cross-the-road.mp4"
					)
				},
				{
					title: "Project: Two in One",
					content: apProject({
						goal: "Determine whether two of three input values sum to the remaining value.",
						steps: [
							"Run Main.java and enter three integers from -10000 to 10000. The starter reads the three positions and prints a placeholder result.",
							"Write three comparisons, one for each possible remaining position. Join them with ||."
						],
						apReasoning:
							"Show which comparison is true for a matching input. For a nonmatching input, show why all three comparisons are false.",
						checks: [
							"2 3 5, 5 2 3, and 2 5 3 all give true.",
							"2 2 4 and -2 3 1 give true. 2 3 6 gives false."
						]
					}),
					projectLink: apIntroductoryResources["two-in-one"].starter,
					solutionLink:
						apIntroductoryResources["two-in-one"].reference,
					ideImport: true,
					preserveInstructions: true,
					preserveAssignment: true,
					mediaLink: media("apcs2-project-4-two-in-one.mp4")
				}
			]
		},
		{
			title: "APCS3 Conditionals and Packages",
			curriculum: [
				{
					title: "Conditionals, Scope, and Nesting",
					contentKind: "reading",
					preserveInstructions: true,
					content: [
						"An if/else-if/else chain runs the first branch whose condition is true, or the final else if all conditions are false. A nested if runs only when execution enters its containing block. A local variable declared inside braces can be used only within its scope.",
						"```java\nint tickets = 4;\nboolean member = true;\nint price;\nif (tickets >= 5) {\n    price = 6;\n} else if (tickets >= 2) {\n    int base = 9;\n    price = base;\n    if (member) {\n        price = base - 1;\n    }\n} else {\n    price = 12;\n}\nSystem.out.println(price);\n```",
						"At four tickets the middle branch runs. Membership changes the price from 9 to 8. Predict the prices at five tickets and at one ticket (6 and 12). Explain why printing base after the chain would fail to compile while printing price works."
					].join("\n\n")
				},
				{
					title: "Packages, Math, and Randomness",
					contentKind: "reading",
					preserveInstructions: true,
					content: [
						"Java groups library classes into packages. Math is in java.lang and can be used directly. A static method such as `Math.abs(-4)` is called on the class. Math.random() returns a double at least zero and strictly less than one.",
						"```java\ndouble sample = 0.75;\nint face = 1 + (int) (sample * 6);\nSystem.out.println(Math.abs(-4));\nSystem.out.println(face);\n```",
						"The lines are 4 and 5. To build a die roll, replace 0.75 with Math.random(). Multiplication gives a value from 0 up to but excluding 6. Casting gives 0 through 5 and adding 1 gives 1 through 6. Trace 0.0 and 0.99 by hand. What changes if the cast occurs before multiplication?"
					].join("\n\n")
				},
				{
					title: "Core Project: Elevator Warning",
					content: apProject({
						goal: "Compare an elevator load with its 1500 lb limit and report the result.",
						steps: [
							"Run Main.java. The starter prints 1499, 1500, and 1501 lb with placeholder comparisons.",
							"In loadStatus, compare the weight to the limit. When the weight exceeds the limit, subtract the limit from the weight.",
							"Report equality separately. For a weight below the limit, subtract the weight from the limit."
						],
						apReasoning:
							"Trace which comparison succeeds for each input. Only a value strictly greater than the limit triggers a warning.",
						checks: [
							"1499 lb reports 1 lb under the limit.",
							"1500 lb reports that the load is at the limit.",
							"1501 lb reports 1 lb over the limit."
						],
						extension:
							"Add calls for loads of 0 lb and 3000 lb. Predict both differences before running."
					}),
					projectLink: apElevatorWarningResources.starter,
					solutionLink: apElevatorWarningResources.reference,
					ideImport: true,
					preserveInstructions: true,
					preserveAssignment: true,
					mediaLink: media("apcs3-project-3-elevator-warning.mp4")
				},
				{
					title: "Reference Pack",
					content: apProject({
						goal: "Trace an if/else chain and a nested boundary check for session capacity.",
						steps: [
							"Inspect `status` in `Main.java`. Use nonnegative reservation counts and a capacity of 10.",
							"Trace the branches for counts below, at, and above capacity. Add calls for 11 and 12.",
							"Explain when the nested condition tests whether exactly one extra seat is needed."
						],
						apReasoning:
							"An if/else chain selects its first matching branch. The nested test runs only after both earlier conditions fail.",
						checks: [
							"9 reports available seats. 10 reports a full session.",
							"11 needs one extra seat. 12 needs multiple extra seats."
						]
					}),
					projectLink:
						apFoundationsSupplementalResources[
							"conditionals-reference"
						].starter,
					solutionLink:
						apFoundationsSupplementalResources[
							"conditionals-reference"
						].reference,
					ideImport: true,
					preserveInstructions: true,
					preserveAssignment: true
				}
			],
			supplementalProjects: [
				{
					title: "Project: Too Chicken Take Two",
					content: apProject({
						goal: "Use nested conditionals to give a specific reason for each crossing decision.",
						steps: [
							"Run `Main.java` with four `true` or `false` tokens: left side clear, right side clear, scared, companion present.",
							"Keep the starter's left-side check and add the right-side check. Report the first blocked direction and stop.",
							"When both sides are clear, report that the character crosses alone if unafraid, crosses with a companion if scared and accompanied, or waits otherwise."
						],
						apReasoning:
							"Compare each branch with the APCS2 Boolean version. A crossing message corresponds to true. A blocked or waiting message corresponds to false.",
						checks: [
							"`false false true true` reports Blocked on the left. `true false false false` reports Blocked on the right.",
							"`true true false false` reports Cross alone. `true true true true` reports Cross with a companion.",
							"`true true true false` reports Wait for a companion."
						]
					}),
					projectLink:
						apFoundationsSupplementalResources[
							"conditional-crossing"
						].starter,
					solutionLink:
						apFoundationsSupplementalResources[
							"conditional-crossing"
						].reference,
					ideImport: true,
					preserveInstructions: true,
					preserveAssignment: true,
					mediaLink: media("apcs3-project-1-too-chicken-take-two.mp4")
				},
				{
					title: "Reference: Math Package",
					content: apProject({
						goal: "Predict the value and return type of a Java Math method call.",
						steps: [
							"Run `Main.java` and record the values and types stored from `Math.abs(-9)`, `Math.pow(3, 2)`, and `Math.sqrt(15)`.",
							"Cast the square root to `int` and compare the result with `Math.round`.",
							"Explain which calls return a `double` value and which return an integer value."
						],
						apReasoning:
							"Math provides static methods in `java.lang`. Here `abs` returns `int`, `pow` and `sqrt` return `double`, and `round` with a `double` argument returns `long`.",
						checks: [
							"The absolute value is 9 and the power is 9.0. The IDE preview can display both as 9. Read the declarations to identify the types.",
							"The square root is between 3 and 4. Casting gives 3 and rounding gives 4."
						]
					}),
					projectLink:
						apFoundationsSupplementalResources["math-reference"]
							.starter,
					solutionLink:
						apFoundationsSupplementalResources["math-reference"]
							.reference,
					ideImport: true,
					preserveInstructions: true,
					preserveAssignment: true
				},
				{
					title: "Reference: Random Numbers",
					content: apProject({
						goal: "Convert a draw from 0.0 inclusive to 1.0 exclusive into an integer in an inclusive range.",
						steps: [
							"Trace the fixed draws through `fromDraw` in `Main.java`. Count the outcomes as high minus low plus one.",
							"Multiply the draw by the count, cast the product to `int`, then add the lowest value.",
							"After checking both bounds with fixed draws, pass `Math.random()` as the draw in a separate call."
						],
						apReasoning:
							"Multiplying first produces a value below the count. The cast selects a bucket numbered 0 through count minus 1. Adding the lower bound shifts those buckets to the target range.",
						checks: [
							"A draw of 0 produces 0 for the range 0 through 9. A draw of 0.9999 produces 10 for the range 1 through 10.",
							"99 through 199 contains 101 outcomes. Draws 0 and 0.9999 produce 99 and 199 respectively."
						]
					}),
					projectLink:
						apFoundationsSupplementalResources["random-range"]
							.starter,
					solutionLink:
						apFoundationsSupplementalResources["random-range"]
							.reference,
					ideImport: true,
					preserveInstructions: true,
					preserveAssignment: true
				},
				{
					title: "Project: Math Demo",
					content: apProject({
						goal: "Calculate a power, its square and fourth roots, and the absolute value of a separate input.",
						steps: [
							"Run `Main.java` with a base from 1 through 20, a power from 0 through 8, and a signed integer from −10000 through 10000.",
							"Keep the supplied `Math.pow` calculation. Take its square root, then take the square root of that result to get the fourth root.",
							"Use `Math.abs` on the signed input. Print each of the four results with its label."
						],
						apReasoning:
							"The power and both roots are `double` results. The signed input and its absolute value remain `int`.",
						checks: [
							"`2 4 -7` gives power 16.0, square root 4.0, fourth root 2.0, and absolute value 7. The IDE preview can omit trailing .0 or display powers in full instead of scientific notation.",
							"With an exponent of zero, both roots and the power equal 1.0."
						]
					}),
					projectLink:
						apFoundationsSupplementalResources["math-demo"].starter,
					solutionLink:
						apFoundationsSupplementalResources["math-demo"]
							.reference,
					ideImport: true,
					preserveInstructions: true,
					preserveAssignment: true,
					mediaLink: media("apcs3-project-2-math-demo.mp4")
				}
			]
		},
		{
			title: "APCS4 Loops and Exceptions",
			curriculum: [
				{
					title: "For Loops, While Loops, and Infinite Loop Risk",
					contentKind: "reading",
					preserveInstructions: true,
					content: [
						"A for loop performs its initialization once, tests before each iteration, and updates after the body. A while loop tests before each iteration too. Write its initial state and update explicitly.",
						"```java\nfor (int index = 1; index < 6; index += 2) {\n    System.out.println(index);\n}\nint next = 1;\nwhile (next < 6) {\n    System.out.println(next);\n    next += 2;\n}\n```",
						"Each loop prints 1, 3, 5, then tests 7 and stops. Starting at 6 would skip both bodies. Trace what would happen if the while update were removed: the next test would still see 1."
					].join("\n\n")
				},
				{
					title: "Nested Loops and Early Exception Reasoning",
					contentKind: "reading",
					preserveInstructions: true,
					content: [
						"The inner loop starts again each time the outer loop enters its body. Track the two counters separately. Here the outer counter determines how many times the inner one runs.",
						"```java\nint visits = 0;\nfor (int row = 1; row <= 3; row++) {\n    for (int col = 0; col < row; col++) {\n        visits++;\n    }\n    System.out.println(visits);\n}\n```",
						"Rows 1, 2, and 3 add one, two, and three visits. The printed totals are 1, 3, and 6. To diagnose a failure, locate the first unsafe operation. If the inner body instead evaluated `12 / col`, integer division would fail on row 1, column 0. If it read `data[col]` from a two-element array, row 3, column 2 would be the first invalid access."
					].join("\n\n")
				},
				{
					title: "Core Project: Translating Loops",
					content: apProject({
						goal: "Translate `for` loops into `while` loops with matching sequences and stopping behavior.",
						steps: [
							"Trace the supplied ascending pair in `Main.java`. Identify the initialization, condition, body, and update in each.",
							"Complete the descending and doubling `while` methods. Move initialization before the loop and keep the update inside it.",
							"Complete `untilMultipleWhile`. Record the current value before the break test. Compare both versions when the initial value is 1 and when it is 0."
						],
						apReasoning:
							"A `break` skips the remaining loop body, including an update after the break test. The conditions must be checked at the same point in the original and translated versions.",
						checks: [
							"The first two pairs give 0 through 9 and 0 through -9. The doubling pair prints 1, 2, 4, 8.",
							"Starting at 1, both break sequences print 1, 2, 3. Starting at 0, both print 0 once."
						]
					}),
					projectLink:
						apExpressionsAndClassResources["translating-loops"]
							.starter,
					solutionLink:
						apExpressionsAndClassResources["translating-loops"]
							.reference,
					ideImport: true,
					preserveInstructions: true,
					preserveAssignment: true,
					mediaLink: media("apcs4-project-2-translating-loops.mp4")
				},
				{
					title: "Loop Reference Pack",
					content: apProject({
						goal: "Produce the same sequence with a counted `for` loop and a `while` loop.",
						steps: [
							"Trace the supplied `for` loop in `Main.java`. Record the initial value, condition, printed value, and update.",
							"Finish the `while` loop using the supplied counter. Test the condition before printing and update the counter inside the loop.",
							"Compare the output and the final failed test for the two loop forms."
						],
						apReasoning:
							"A counted `for` loop groups its three control steps in the header. A `while` loop carries the same state explicitly.",
						checks: [
							"Each form prints 0 through 9 exactly once.",
							"The counter is 10 when the condition first becomes false."
						]
					}),
					projectLink:
						apVariablesAndLoopsResources["loop-reference"].starter,
					solutionLink:
						apVariablesAndLoopsResources["loop-reference"]
							.reference,
					ideImport: true,
					preserveInstructions: true,
					preserveAssignment: true
				}
			],
			supplementalProjects: [
				{
					title: "Project: For Loop Practice",
					content: apProject({
						goal: "Use counted loops for repeated output and accumulators for the product and maximum of supplied data.",
						steps: [
							"In the IDE Input panel, enter a fictional name on line 1 and a count from 0 through 10 on line 2. Run `Main.java` to see the name repeated.",
							"Add a loop that prints the count for each character in the name. Add a second loop that counts down through zero.",
							"Multiply the values in the supplied array. For the maximum of a nonempty array, start with its first value and compare the rest."
						],
						apReasoning:
							"Each loop has a distinct stopping rule. The product starts at 1. Starting the maximum at the first value also works for arrays containing only negative numbers.",
						checks: [
							"With Fern and 3, the output includes three name lines, four 3s, and the countdown 3, 2, 1, 0.",
							"The product is 362880. The maxima are 9 and -4.",
							"A count of 0 prints no names and still includes 0 in the countdown."
						]
					}),
					projectLink:
						apVariablesAndLoopsResources["for-loop-practice"]
							.starter,
					solutionLink:
						apVariablesAndLoopsResources["for-loop-practice"]
							.reference,
					ideImport: true,
					preserveInstructions: true,
					preserveAssignment: true,
					mediaLink: media("apcs4-project-1-for-loops-practice.mp4")
				},
				{
					title: "Project: While Loop and Nested Loop Practice",
					content: apProject({
						goal: "Trace a stopping condition, then build matching staircases and multiplication tables with both loop forms.",
						steps: [
							"Run `Main.java` and trace successive integer divisions of 129 by 2. In the supplied draws, print values until the first 7 or the end of the array.",
							"Write nested `for` loops that print ten rows of stars. Use the row number for the number of stars. Repeat the pattern with nested `while` loops.",
							"Build a 12-by-12 multiplication table with each loop form. Multiply the current row and column, reset the column at the start of each row, and print a newline at the end of the row."
						],
						apReasoning:
							"The outer loop selects a row and the inner loop handles its columns. Check the array bound before reading a draw. The halving loop terminates because positive integers eventually reach 0.",
						checks: [
							"Halving prints 129, 64, 32, 16, 8, 4, 2, 1. The draw sequence prints 3 and 1.",
							"Each staircase has ten rows and each multiplication table has 12 rows of 12 values, ending in 144.",
							"The corresponding for and while outputs agree."
						]
					}),
					projectLink:
						apVariablesAndLoopsResources["while-nested-practice"]
							.starter,
					solutionLink:
						apVariablesAndLoopsResources["while-nested-practice"]
							.reference,
					ideImport: true,
					preserveInstructions: true,
					preserveAssignment: true,
					mediaLink: media(
						"apcs4-project-3-while-loop-and-nested-loop-practice.mp4"
					)
				},
				{
					title: "Reference: While Loops and Nested Loops",
					content: apProject({
						goal: "Trace repeated output and locate the newline in a nested loop.",
						steps: [
							"Follow the counter in the `while` loop and predict how many times Practice appears.",
							"Trace the starter grid, then change the bounds to three rows and four columns, both starting at 0.",
							"Keep the column initializer inside the outer loop. End the line when a complete row has printed."
						],
						apReasoning:
							"The inner loop restarts for every row. A grid with three rows and four columns visits 12 cells.",
						checks: [
							"The first section prints Practice ten times.",
							"The grid begins with `(0,0) (0,1) (0,2) (0,3)` and ends with `(2,0) (2,1) (2,2) (2,3)`."
						]
					}),
					projectLink:
						apVariablesAndLoopsResources["nested-loop-reference"]
							.starter,
					solutionLink:
						apVariablesAndLoopsResources["nested-loop-reference"]
							.reference,
					ideImport: true,
					preserveInstructions: true,
					preserveAssignment: true
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
					content: apProject({
						goal: "Write a Methods and Control Structures response that counts multiples in an inclusive range.",
						steps: [
							"Write `countMultiples(int low, int high, int divisor)` before running it. Both bounds are between -10000 and 10000, `low <= high`, and `divisor > 0`.",
							"Visit each integer from low through high. Increment the count whenever the remainder after division is zero.",
							"Predict the counter at each step for the range -2 through 2 with divisor 2. Then run the supplied examples and correct any differences."
						],
						apReasoning:
							"Score the initial count, inclusive loop bounds, condition, update and return independently.",
						checks: [
							"From 1 to 12, four values are multiples of 3. From -4 to 4, five values are multiples of 2, including zero.",
							"A range containing only 5 counts one multiple of 5. From 1 to 3 there are no multiples of 5."
						]
					}),
					projectLink: apCheckInAndFrqResources["check-in-2"].starter,
					solutionLink:
						apCheckInAndFrqResources["check-in-2"].reference,
					ideImport: true,
					preserveInstructions: true,
					preserveAssignment: true
				}
			],
			supplementalProjects: [
				{
					title: "Additional Practice: Animal Kingdom",
					content: apProject({
						goal: "Trace how an optional Java inheritance exercise builds a classification from selected ranks.",
						steps: [
							"Open the starter. Identify where `Animal` stores the name and formats the description.",
							"Extend the classification returned by `super.classification()`. Add ` > Mammalia` in `Mammal` and ` > Primates` in `Primate`.",
							"Download and extract the ZIP. Run `javac Main.java Animal.java Mammal.java Primate.java`, then `java Main`."
						],
						apReasoning:
							"The inherited `describe()` calls the override for the actual object. Each subclass adds one rank and shares the base name field.",
						checks: [
							"`Robin: Animalia` and `Seal: Animalia > Mammalia` show the two shorter paths.",
							"`Orangutan: Animalia > Mammalia > Primates` shows all three selected ranks. A second primate keeps the path and displays its own name."
						]
					}),
					projectLink:
						apEnrichmentResources["animal-kingdom"].starter,
					solutionLink:
						apEnrichmentResources["animal-kingdom"].reference,
					ideImport: true,
					preserveInstructions: true,
					preserveAssignment: true
				},
				{
					title: "Class Example",
					content: apProject({
						goal: "Trace a constructor argument into an object's field and distinguish printing from returning.",
						steps: [
							"Read `Main.java` and `TestClass.java`. Identify the argument sent to each constructor and the field set by it.",
							"Run the example and compare the two values printed from inside the method with the values received by `main`. Return the field value so both match.",
							"Save and download the ZIP. In the extracted folder, run `javac Main.java TestClass.java`, then `java Main`."
						],
						apReasoning:
							"Each object keeps a separate copy of its field. Printing is a side effect. A returned value can also be stored by the caller.",
						checks: [
							"The two objects store Fern and Moss.",
							"The first call prints and returns Fern. The second prints and returns Moss."
						]
					}),
					projectLink:
						apExpressionsAndClassResources["class-constructor"]
							.starter,
					solutionLink:
						apExpressionsAndClassResources["class-constructor"]
							.reference,
					ideImport: true,
					preserveInstructions: true,
					preserveAssignment: true
				},
				{
					title: "This Reference",
					content: apProject({
						goal: "Use `this` to refer to a field when a constructor parameter has the same name.",
						steps: [
							"Open `Counter.java` and `Main.java`. Trace the one-argument constructor, whose parameter is named `initialValue`.",
							"Complete the two-argument constructor with `this.value = value` and `this.step = step`. Trace both sides of each assignment.",
							"Save and download the ZIP. In the extracted folder, run `javac Main.java Counter.java`, then `java Main`. Advance only the custom counter."
						],
						apReasoning:
							"The qualified name refers to the current object. The bare parameter name inside the shadowing constructor refers to the supplied argument. The counters have independent state.",
						checks: [
							"The standard counter starts at 4. The custom counter starts at 10 and advances to 13.",
							"The standard counter still reads 4 after the custom counter advances."
						]
					}),
					projectLink:
						apExpressionsAndClassResources["this-fields"].starter,
					solutionLink:
						apExpressionsAndClassResources["this-fields"].reference,
					ideImport: true,
					preserveInstructions: true,
					preserveAssignment: true
				}
			]
		},
		{
			title: "APCS5 Classes Part I",
			curriculum: [
				{
					title: "Classes, Fields, and Constructors",
					contentKind: "reading",
					preserveInstructions: true,
					content: [
						"A class defines the fields and methods its objects have. Each `new Ticket(...)` creates a separate object and calls the constructor once. The constructor has the class name and no return type. Here, `this.seat` names the field on the new ticket and `seat` names the constructor parameter.",
						"",
						"```java",
						"class Ticket {",
						"    private final int seat;",
						"",
						"    Ticket(int seat) {",
						"        this.seat = seat;",
						"    }",
						"",
						"    int getSeat() {",
						"        return seat;",
						"    }",
						"}",
						"```",
						"",
						"Use the following calls in the `main` method.",
						"",
						"```java",
						"Ticket first = new Ticket(12);",
						"Ticket second = new Ticket(4);",
						"System.out.println(first.getSeat());",
						"System.out.println(second.getSeat());",
						"```",
						"",
						"The calls print 12 and 4. Trace which ticket supplies `this` on each call. Creating the second ticket assigns its own seat field."
					].join("\n")
				},
				{
					title: "Accessors, Mutators, and Method Practice",
					contentKind: "reading",
					preserveInstructions: true,
					content: [
						"In the Student Class project, `getSchoolType()` reads the current grade and returns a label. Grades 6 through 8 are middle school and grades 9 through 12 are high school. `passGrade()` advances the stored grade by one while it is below 13. Try this sequence in the project's `main` method.",
						"",
						"```java",
						'Student learner = new Student("Sam", "Lee", 8);',
						"System.out.println(learner.getSchoolType());",
						"learner.passGrade();",
						"System.out.println(learner.getSchoolType());",
						"learner.printInfo();",
						"```",
						"",
						"The first call returns `middle school`. After the mutator runs, the accessor returns `high school` and the last call prints `Sam Lee, grade 9`. Predict the grade after a second call to `passGrade()`, then use `printInfo()` to check."
					].join("\n")
				},
				{
					title: "Core Project: Student Class",
					content: apProject({
						goal: "Keep a student's grade in a Java object and derive the school type from that grade.",
						steps: [
							"Run Main.java. Inspect how Student.java stores the names and starting grade for each object.",
							"Complete getSchoolType. Use grades 1–5 for elementary, 6–8 for middle, 9–12 for high school, and 13 for college.",
							"Complete passGrade. Grades 1–12 advance by one. Grade 13 stays fixed."
						],
						apReasoning:
							"Use the current field value to decide what a call returns. A change to one student object affects only that object.",
						checks: [
							"Grade 5 moves to middle school and grade 8 moves to high school.",
							"Grade 12 moves to college. Grade 13 stays at college.",
							"Two students created with the same grade can have different grades after calling passGrade on just one."
						]
					}),
					projectLink: apStudentClassResources.starter,
					solutionLink: apStudentClassResources.reference,
					ideImport: true,
					preserveInstructions: true,
					preserveAssignment: true,
					mediaLink: media("apcs5-project-2-student-class.mp4")
				},
				{
					title: "Free Response Prep",
					content: apProject({
						goal: "Build a class that tracks active days and average daily steps.",
						steps: [
							"Draft the class and constructor. Track the minimum, active days, all days and total steps.",
							"Each `addDailySteps` call records a nonnegative count. The day is active if it meets the minimum.",
							"Return active days in `totalDaysActive`. Use floating division in `averageSteps`, or return 0.0 if empty.",
							"Download the ZIP. Run `javac Main.java StepTracker.java` and then `java Main`."
						],
						apReasoning:
							"Score the constructor, each method's signature, both counts, and the total separately. Include a day exactly on the threshold.",
						checks: [
							"With a threshold of 100, days of 90, 100 and 114 produce two active days and an average of 304 divided by 3.",
							"Adding steps to one tracker leaves a second, independently constructed tracker empty."
						]
					}),
					projectLink:
						apCheckInAndFrqResources["step-tracker-frq"].starter,
					solutionLink:
						apCheckInAndFrqResources["step-tracker-frq"].reference,
					ideImport: true,
					preserveInstructions: true,
					preserveAssignment: true
				}
			],
			supplementalProjects: [
				{
					title: "Project: Method Practice",
					content: apProject({
						goal: "Implement methods that turn parameters into returned values.",
						steps: [
							"Use the supplied `sum` as a model. Complete `factorial` for 0 through 12 and `exponent` for bases -10 through 10 and powers 0 through 9.",
							"Count the letters A, E, I, O, and U regardless of case. Treat an empty string as zero vowels.",
							"Return false for integers below 2. Test divisibility from 2 up to the square root. The condition `candidate <= number / candidate` expresses this bound without multiplying the candidate."
						],
						apReasoning:
							"Keep the method parameter, local accumulator, and returned result separate. Values printed by `main` come from the method returns.",
						checks: [
							"`factorial(0)` and `exponent(-3, 0)` both return 1. `factorial(5)` returns 120.",
							'`numVowels("apple")` returns 2 and `numVowels("IDEA")` returns 3.',
							"23 and 2 are prime. 49 has a factor of 7, and 1 is below the smallest prime."
						]
					}),
					projectLink:
						apExpressionsAndClassResources["method-practice"]
							.starter,
					solutionLink:
						apExpressionsAndClassResources["method-practice"]
							.reference,
					ideImport: true,
					preserveInstructions: true,
					preserveAssignment: true,
					mediaLink: media("apcs5-project-1-method-practice.mp4")
				},
				{
					title: "Project: Store Class",
					content: apProject({
						goal: "Update a store's inventory through a method that rejects invalid orders.",
						steps: [
							"Read `Main.java` and `Store.java`. Start with the supplied apple branch. Add pear and hose branches with unit prices 7 and 15.",
							"Allow a positive quantity up to the available stock. Reduce stock once for a successful purchase and return the price. Return 0 for an unknown item, a nonpositive quantity, or insufficient stock.",
							"Save and download the ZIP. In the extracted folder, run `javac Main.java Store.java`, then `java Main`."
						],
						apReasoning:
							"Private fields hold inventory. `quantity` reads the state and `buy` changes it only when the order satisfies the contract.",
						checks: [
							"Buying five pears costs 35 and leaves 95. Rejected orders leave 95 pears.",
							"Buying the last 20 apples costs 80 and leaves zero. One hose costs 15, leaving 14.",
							"A second `Store` begins with its own inventory."
						]
					}),
					projectLink:
						apExpressionsAndClassResources["store-class"].starter,
					solutionLink:
						apExpressionsAndClassResources["store-class"].reference,
					ideImport: true,
					preserveInstructions: true,
					preserveAssignment: true,
					mediaLink: media("apcs5-project-3-store-class.mp4")
				},
				{
					title: "Supplemental: Spreadsheet Width",
					content: apProject({
						goal: "Return text padded or trimmed to an exact cell width.",
						steps: [
							"Implement `formatCell` in `Main.java`. Start with ordinary text and a width from 0 through 20.",
							"Trim longer text to its first `width` characters. Pad shorter text with spaces. Keep exact-width text as supplied.",
							"Place one visible bar on each side after the interior is ready. Return the complete string to the caller."
						],
						apReasoning:
							"The width is measured between the two bars. At width zero the interior is empty, so no text or padding appears.",
						checks: [
							"At width 5, potato gives `|potat|`, pea gives `|pea  |`, and apple gives `|apple|`.",
							"Empty text at width 3 gives `|   |`. At width 0, pear gives `||`."
						]
					}),
					projectLink:
						apExpressionsAndClassResources["spreadsheet-width"]
							.starter,
					solutionLink:
						apExpressionsAndClassResources["spreadsheet-width"]
							.reference,
					ideImport: true,
					preserveInstructions: true,
					preserveAssignment: true,
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
					contentKind: "reading",
					preserveInstructions: true,
					content: [
						"Use the Vending Machine Class project. A new machine starts with zero peanuts. `setPeanuts` accepts counts from 0 to 100 inclusive, `vendPeanuts` removes one when stock is available, and `getPeanuts` reads the current count. Trace the three variables through this sequence in `main`.",
						"",
						"```java",
						"VendingMachine first = new VendingMachine();",
						"first.setPeanuts(2);",
						"VendingMachine alias = first;",
						"VendingMachine second = new VendingMachine();",
						"alias.vendPeanuts();",
						"System.out.println(first.getPeanuts());",
						"System.out.println(second.getPeanuts());",
						"```",
						"",
						"The outputs are 1 and 0. Assigning `alias = first` copies the reference. Both names reach the machine whose stock changed from 2 to 1. The second `new` created another machine. Predict both outputs if the vending call uses `second` instead."
					].join("\n")
				},
				{
					title: "Getters, Setters, `this`, and Primitive vs. Reference",
					contentKind: "reading",
					preserveInstructions: true,
					content: [
						"Java passes every argument by value. Put this helper inside the Vending Machine project's `Main` class, outside `main`. It receives a copy of the caller's number and a copy of the reference to the caller's machine.",
						"",
						"```java",
						"static void restock(int count, VendingMachine machine) {",
						"    count = count + 1;",
						"    machine.setPeanuts(count);",
						"    machine = new VendingMachine();",
						"    machine.setPeanuts(9);",
						"}",
						"```",
						"",
						"Use the following calls in the project's `main` method.",
						"",
						"```java",
						"int count = 2;",
						"VendingMachine counter = new VendingMachine();",
						"restock(count, counter);",
						"System.out.println(count);",
						"System.out.println(counter.getPeanuts());",
						"```",
						"",
						"The caller prints 2 and 3. The helper's local count becomes 3. Its first setter changes the original machine. Reassigning `machine` makes the last setter act on a new object. In an instance method, `this` identifies the receiver. Trace the receiver of each setter to explain where the 9 went."
					].join("\n")
				},
				{
					title: "Core Project: Vending Machine Class",
					content: apProject({
						goal: "Implement a vending machine that keeps three independent stock counts between 0 and 100, inclusive.",
						steps: [
							"Run Main.java and trace the completed peanut setter and vend method.",
							"Complete the pretzel and candy setters. Reject an invalid quantity by keeping the stored count.",
							"Complete the pretzel and candy vend methods. Reuse the corresponding setter so the stock cannot fall below zero."
						],
						apReasoning:
							"For one valid call and one rejected call, record the field before the call, the argument, and the field afterward.",
						checks: [
							"Loading 3 peanuts, 8 pretzels, and 20 candy succeeds. Requests for −1 or 101 candy leave 20 in stock.",
							"Vending each item five times leaves 0 peanuts, 3 pretzels, and 15 candy.",
							"Check that the setters accept 0 and 100. Vending an empty item leaves its count at 0."
						]
					}),
					projectLink:
						apRemainingCoreResources["vending-machine"].starter,
					solutionLink:
						apRemainingCoreResources["vending-machine"].reference,
					ideImport: true,
					preserveInstructions: true,
					preserveAssignment: true,
					mediaLink: media(
						"apcs6-project-1-vending-machine-class.mp4"
					)
				},
				{
					title: "Free Response and Multiple Choice Support",
					content: apProject({
						goal: "Use supplied static methods to count leap years and compute a weekday.",
						steps: [
							"Count leap years from first through last with `isLeapYear`. Use ordered bounds between 1 and 9999.",
							"Add `dayOfYear` minus one to `firstDayOfYear`, then take the remainder after dividing by seven.",
							"Which years from 1900, 2000 and 2100 are leap years? A) 1900 only. B) 2000 only. C) 1900 and 2100. D) All three.",
							"Download the ZIP. Run `javac Main.java APCalendar.java` and then `java Main`."
						],
						apReasoning:
							"January 1 has ordinal 1, so the offset starts at zero. For a valid Gregorian date, weekday numbers run from 0 for Sunday to 6 for Saturday. Score the range, helper calls, offset and wrap.",
						checks: [
							"From 1999 through 2004 there are two leap years. Of the three century years in the choices, only 2000 is a leap year.",
							"January 1 and February 29 of 2024 give 1 and 4. January 6 and 7 give 6 and 0."
						]
					}),
					projectLink:
						apCheckInAndFrqResources["calendar-frq"].starter,
					solutionLink:
						apCheckInAndFrqResources["calendar-frq"].reference,
					ideImport: true,
					preserveInstructions: true,
					preserveAssignment: true
				}
			],
			supplementalProjects: [
				{
					title: "Project: Bank Account Class",
					content: apProject({
						goal: "Update an account balance and the total across all accounts together.",
						steps: [
							"Open `Main.java` and `BankAccount.java`. Trace the constructors for Fern and Moss. Use the supplied amount check and `credit` helper to complete `deposit`.",
							"Complete `withdraw`. Validate the amount, compare it with the current balance, and subtract it from both totals only on success. Use the supplied decimal-comparison and arithmetic patterns.",
							"Download and extract the project ZIP. Run `javac Main.java BankAccount.java`, then `java Main`."
						],
						apReasoning:
							"Private instance fields belong to each account. Static fields are shared. `BigDecimal` stores the exact decimal changes, and its arithmetic methods return the new value.",
						checks: [
							"Fern’s initial withdrawal fails. A deposit of 25 and a withdrawal of 10 leave 15.",
							"Moss still has 100. The bank total is 115 for two accounts.",
							"A negative, non-finite, or excessive withdrawal leaves both totals unchanged."
						]
					}),
					projectLink:
						apClassesAndArraysResources["bank-account"].starter,
					solutionLink:
						apClassesAndArraysResources["bank-account"].reference,
					ideImport: true,
					preserveInstructions: true,
					preserveAssignment: true,
					mediaLink: media("apcs6-project-2-bank-account-class.mp4")
				},
				{
					title: "Project: Farm Class",
					content: [
						"Model one day on a farm. Each Farm instance tracks its own cow and goat counts and three flags for chores. Animals start unfed and the cows start unmilked. Constructor counts must be nonnegative.",
						"Use feedCows as the pattern for feedGoats. A feeding or milking succeeds once for a nonempty herd. A sale succeeds whenever at least one animal of that species remains. On failure return false and preserve every field. On success update only the relevant field and return true. In this model milk applies to cows.",
						"Run `javac Main.java Farm.java` followed by `java Main`. With one goat, predict the results of two feedings and two sales. Each pair returns true, then false. A second farm retains its original goat and feeding flag. Add a check for milking a farm with zero cows."
					].join("\n\n"),
					projectLink: apFarmAndShapeResources["farm-class"].starter,
					solutionLink:
						apFarmAndShapeResources["farm-class"].reference,
					ideImport: true,
					preserveInstructions: true,
					preserveAssignment: true,
					mediaLink: media("apcs6-project-1-farm-class.mp4")
				},
				{
					title: "Reference: Getters and Setters",
					content: apProject({
						goal: "Use getters to read clock fields and setters to accept valid changes.",
						steps: [
							"Use `setHours` in `Time.java` as a model for `setMins` and `setSecs`. Minutes and seconds range from 0 through 59.",
							"Trace the three checks in `resetTime`. Decide whether a failed check lets any of the three fields change.",
							"Download and extract the project ZIP. Run `javac Main.java Time.java`, then `java Main`. Trace what happens on the increment at the end of the day."
						],
						apReasoning:
							"Validation occurs before assignment. Every getter can return a value from the same valid clock state after an invalid request.",
						checks: [
							"A valid update changes 10:15:20 to 11:25:30. The invocations with hour 24, minute -1, or second 60 leave that time in place.",
							"An invalid reset leaves every field in place. Incrementing 23:59:59 produces 00:00:00."
						]
					}),
					projectLink:
						apClassesAndArraysResources["time-accessors"].starter,
					solutionLink:
						apClassesAndArraysResources["time-accessors"].reference,
					ideImport: true,
					preserveInstructions: true,
					preserveAssignment: true
				}
			]
		},
		{
			title: "APCS7 Inheritance",
			curriculum: [
				{
					title: "Superclass and Subclass Design",
					contentKind: "reading",
					preserveInstructions: true,
					learningPath: "challenge",
					content: [
						"Every picture book in this model is a book. `Book` stores a title, author, and page number. `PictureBook extends Book` adds an illustrator. Both objects can use `hasSameAuthor(Book other)` because `PictureBook` inherits that method. Trace these calls in the Book project’s `main` method.",
						"",
						"```java",
						'Book guide = new Book("Forest", "Lee", 3);',
						'PictureBook atlas = new PictureBook("Trail", "Lee", 7, "Kim");',
						"System.out.println(guide.hasSameAuthor(atlas));",
						"System.out.println(atlas.hasSameAuthor(guide));",
						"```",
						"",
						"Both calls print `true`. The `Book` method compares the text of the authors, even when one argument is a `PictureBook`. Change only the illustrator and predict both results. Then change the author and repeat. Which field belongs in the superclass if both kinds of book need to compare it?",
						"",
						"[Open Book and PictureBook Class practice](/courses#ap-computer-science-a-optional-inheritance-and-polymorphism-enrichment-ap-computer-science-a-optional-inheritance-and-polymorphism-enrichment-supplemental-core-project-book-and-picturebook-class)"
					].join("\n")
				},
				{
					title: "Constructors, `super`, and Overriding",
					contentKind: "reading",
					preserveInstructions: true,
					learningPath: "challenge",
					content: [
						"The `PictureBook` constructor calls `super(title, author, page)` to initialize the book portion of the object, then assigns `this.illustrator`. The completed `toString()` calls `super.toString()` for the book description and appends the illustrator. Use the following calls with the completed project.",
						"",
						"```java",
						'Book first = new Book("Moss", "Lee", 4);',
						'Book second = new PictureBook("Moss", "Lee", 4, "Kim");',
						"System.out.println(first.toString());",
						"System.out.println(second.toString());",
						"```",
						"",
						"The first line is `Moss by Lee (page 4)`. The second adds `, illustrated by Kim`. Both variables have declared type `Book`. At runtime the second object supplies the override. In the starter, `PictureBook.toString()` returns only `super.toString()`. Compare the two outputs before and after completing the override.",
						"",
						"[Open Book and PictureBook Class practice](/courses#ap-computer-science-a-optional-inheritance-and-polymorphism-enrichment-ap-computer-science-a-optional-inheritance-and-polymorphism-enrichment-supplemental-core-project-book-and-picturebook-class)"
					].join("\n")
				},
				{
					title: "Core Project: Book and PictureBook Class",
					content: apProject({
						goal: "Use inheritance to add an illustrator to a book's shared title, author, and page.",
						steps: [
							"Trace the three arguments passed from the `PictureBook` constructor to `Book`.",
							"Reuse `super.toString()` and append `, illustrated by ` and the name. In `hasSameIllustrator`, compare the name text with `equals`.",
							"Download and extract the ZIP. Run `javac Main.java Book.java PictureBook.java`, then `java Main`."
						],
						apReasoning:
							"Constructor chaining initializes shared fields in one place. An override can extend the inherited description.",
						checks: [
							"`Bright Boats by Asha Lee (page 5), illustrated by Sam Ortiz` includes both classes' information.",
							"The sample author comparison is true. The two illustrator comparisons are true and false in order."
						]
					}),
					projectLink: apEnrichmentResources["picture-books"].starter,
					solutionLink:
						apEnrichmentResources["picture-books"].reference,
					ideImport: true,
					preserveInstructions: true,
					preserveAssignment: true,
					mediaLink: media(
						"apcs7-project-4-book-and-picturebook-class.mp4"
					)
				}
			],
			supplementalProjects: [
				{
					title: "Project: Pet Class",
					content: apProject({
						goal: "Use inheritance to share pet names and ages while specializing behavior in subclasses.",
						steps: [
							"Trace how `Dog` passes Maple and age 4 to `Pet` using `super(...)`.",
							"Implement `kind()`, `food()`, and `play()` for `Dog`. Use the inherited `name()` in the play sentence. The same project contains the Cat and Fish work for More Pets.",
							"Download and extract the ZIP. Run `javac Main.java Pet.java Dog.java Cat.java Fish.java`, then `java Main`."
						],
						apReasoning:
							"The inherited `describe()` formats the name and age and calls the subclass override of `kind()`.",
						checks: [
							"The first line reads `Maple (4) is a dog. Food: kibble. Maple plays fetch.`",
							"Change the dog's age in `Main.java`. Only its displayed age changes."
						]
					}),
					projectLink: apEnrichmentResources.pets.starter,
					solutionLink: apEnrichmentResources.pets.reference,
					ideImport: true,
					preserveInstructions: true,
					preserveAssignment: true,
					mediaLink: media("apcs7-project-1-pet-class.mp4")
				},
				{
					title: "Project: More Pets",
					contentKind: "reading",
					preserveInstructions: true,
					content: [
						"Continue the inheritance exercise in the [Pet Class project](/courses#ap-computer-science-a-optional-inheritance-and-polymorphism-enrichment-ap-computer-science-a-optional-inheritance-and-polymorphism-enrichment-supplemental-project-pet-class). Complete `kind()`, `food()`, and `play()` for Cat and Fish. Trace the three objects through the loop in `Main.java` and mark where their behavior differs.",
						"",
						"**Check the last two lines:**",
						"- `Moss (2) is a cat. Food: cat food. Moss chases a toy.`",
						"- `Bubbles (1) is a fish. Food: flakes. Bubbles swims past a hoop.`",
						"",
						"Name the class that owns `describe()` and the class whose `kind()` runs for each line."
					].join("\n"),
					mediaLink: media("apcs7-project-2-more-pets.mp4")
				},
				{
					title: "Project: Pet Special Methods",
					content: apProject({
						goal: "Trace inheritance and method overrides in a dog hierarchy.",
						steps: [
							"Trace the constructor chain from `MiniPoodle` through `Poodle` to `Dog`. Record the size each object passes.",
							"In `Dog.bark()`, return the sound in lower case below size 15 and upper case otherwise. Extend `Poodle.checkIn()` through `super.checkIn()`. In `Pug.play()`, start with the pug's name and `plays tug.`, then append three inherited barks separated by spaces.",
							"Download and extract the ZIP. Run `javac Main.java Dog.java Poodle.java MiniPoodle.java Pug.java`, then `java Main`."
						],
						apReasoning:
							"Both poodles share the override from `Poodle`. The inherited `bark()` gives different output because each dog keeps its own size.",
						checks: [
							"The size 15 dog barks `WOOF`. The poodles bark `BOOF` and `boof` and both append ` Stays with the group.` at check-in.",
							"The pug's last line is `Pip plays tug. snorfle snorfle snorfle`. A different pug name changes the start of the line."
						]
					}),
					projectLink: apEnrichmentResources["dog-methods"].starter,
					solutionLink:
						apEnrichmentResources["dog-methods"].reference,
					ideImport: true,
					preserveInstructions: true,
					preserveAssignment: true,
					mediaLink: media("apcs7-project-3-pet-special-methods.mp4")
				},
				{
					title: "APCS7 Inheritance Multiple Choice Reference",
					contentKind: "reading",
					preserveInstructions: true,
					content: [
						"Trace constructor order and private-member access in this optional Java inheritance worksheet.",
						"```java",
						"class Account {",
						"    private int balance;",
						"    Account(int opening) {",
						"        balance = opening;",
						'        System.out.println("account");',
						"    }",
						"    int balance() { return balance; }",
						"}",
						"class StudentAccount extends Account {",
						"    StudentAccount(int opening) {",
						"        super(opening);",
						'        System.out.println("student");',
						"    }",
						"}",
						"```",
						"",
						"1. For `new StudentAccount(20)`, choose the output order: A. student then account, B. account then student, C. student only.",
						"2. If `super(opening)` is removed, choose the result: A. the compiler inserts `super()` and rejects the constructor, B. the compiler inserts `super(opening)`, C. the balance becomes zero and construction succeeds.",
						"3. Inside a new subclass method, choose a valid way to read the balance: A. `this.balance`, B. `super.balance`, C. `balance()`.",
						"",
						"**Check after tracing:** 1B, 2A, 3C. The superclass initializes before the subclass prints. `Account` has only its one-argument constructor. Its private field is available through the accessible method."
					].join("\n")
				}
			]
		},
		{
			title: "APCS8 Polymorphism",
			curriculum: [
				{
					title: "Superclass References and Dynamic Dispatch",
					contentKind: "reading",
					preserveInstructions: true,
					learningPath: "challenge",
					content: [
						"A `Shape` reference can hold a `Square` or `Rectangle`. The compiler allows a call to `getArea()` because `Shape` declares it. Java selects the implementation using the actual object at that moment. Trace this loop with the completed Many Shapes project.",
						"",
						"```java",
						"Shape[] shapes = {new Square(3), new Rectangle(2, 5)};",
						"for (Shape shape : shapes) {",
						'    System.out.println(shape.getName() + " " + shape.getArea());',
						"}",
						"```",
						"",
						"The first iteration prints `Square 9.0`. The second prints `Rectangle 10.0`. The square multiplies its side by itself. The rectangle multiplies its height by its width. Reversing the array reverses the two output lines. Explain why the loop can process both shapes without checking the class name.",
						"",
						"[Open Many Shapes practice](/courses#ap-computer-science-a-optional-inheritance-and-polymorphism-enrichment-ap-computer-science-a-optional-inheritance-and-polymorphism-enrichment-supplemental-core-project-many-shapes)"
					].join("\n")
				},
				{
					title: "Type Reasoning and Invalid Calls",
					contentKind: "reading",
					preserveInstructions: true,
					learningPath: "challenge",
					content: [
						"The declared type determines which methods the compiler accepts. `Square` declares `getSideLength()` and inherits `getName()` from `Shape`. A `Shape` reference exposes the methods declared by `Shape`, even when it points to a square.",
						"",
						"```java",
						"Square tile = new Square(4);",
						"Shape figure = tile;",
						"System.out.println(figure.getArea());",
						"System.out.println(tile.getSideLength());",
						"```",
						"",
						"The output is `16.0` followed by `4.0`. Now predict the result of changing the last expression to `figure.getSideLength()`. Compilation fails because `Shape` has no such method. Restore the working version. Draw the two references pointing at the same object and explain why `figure.getArea()` runs the square override.",
						"",
						"[Open Many Shapes practice](/courses#ap-computer-science-a-optional-inheritance-and-polymorphism-enrichment-ap-computer-science-a-optional-inheritance-and-polymorphism-enrichment-supplemental-core-project-many-shapes)"
					].join("\n")
				},
				{
					title: "Core Project: Many Shapes",
					content: [
						"Predict the area and perimeter before running Main. This polymorphism example uses the same Shape reference type to call methods on a square, rectangle, right triangle, and circle. The object's class determines which override runs. Use positive dimensions.",
						"Use Square as a worked example. Complete the area and perimeter overrides in Rectangle, RightTriangle, and Circle. A rectangle uses height times width and twice the sum of its dimensions. A right triangle uses half the product of its legs and the sum of the legs and hypotenuse. For a circle use πr² and 2πr.",
						"Run `javac Main.java Circle.java Rectangle.java RightTriangle.java Shape.java Square.java` then `java Main`. For the 5 by 10 rectangle expect 50 and 30. For the 3 by 4 triangle expect 6 and 12. A circle of radius 2.5 has area 6.25π and perimeter 5π. Explain why calling getSideLength through a Shape reference fails to compile even when the object is a Square."
					].join("\n\n"),
					projectLink: apFarmAndShapeResources["many-shapes"].starter,
					solutionLink:
						apFarmAndShapeResources["many-shapes"].reference,
					ideImport: true,
					preserveInstructions: true,
					preserveAssignment: true,
					mediaLink: media("apcs8-project-1-many-shapes.mp4")
				}
			],
			supplementalProjects: [
				{
					title: "Polymorphism Reference",
					contentKind: "reading",
					preserveInstructions: true,
					content: [
						"Use this optional Java polymorphism worksheet to separate which method calls compile from which method bodies run.",
						"```java",
						'class Dog { String sound() { return "woof"; } }',
						"class Poodle extends Dog {",
						'    @Override String sound() { return "yip"; }',
						"}",
						"class MiniPoodle extends Poodle {",
						'    String prance() { return "step"; }',
						"}",
						"class Pug extends Dog {}",
						"// These declarations are inside a method:",
						"// Poodle mini = new MiniPoodle();",
						"// Dog pug = new Pug();",
						"```",
						"",
						"Trace each expression independently. Record the declared type, actual type, and value or failure for `mini.sound()`, `mini.prance()`, `((MiniPoodle) mini).prance()`, and `((Poodle) pug).sound()`.",
						"",
						"**Check after tracing:** The results are `yip`, a compile-time error, `step`, and a runtime `ClassCastException`. `Poodle` declares the override and has no `prance()` method. The first cast succeeds because the object is a `MiniPoodle`. A `Pug` is a `Dog` and has no `Poodle` subtype relationship."
					].join("\n")
				},
				{
					title: "APCS8 Polymorphism Multiple Choice Reference",
					contentKind: "reading",
					preserveInstructions: true,
					content: [
						"Trace an inherited method that calls an overridden method in this optional Java polymorphism worksheet. Amounts are whole units.",
						"```java",
						"class Account {",
						"    int balance;",
						"    Account(int opening) { balance = opening; }",
						"    void withdraw(int amount) { balance -= amount; }",
						"    void transfer(Account target, int amount) {",
						"        withdraw(amount);",
						"        target.balance += amount;",
						"    }",
						"}",
						"class Checking extends Account {",
						"    Checking(int opening) { super(opening); }",
						"    @Override void withdraw(int amount) {",
						"        super.withdraw(amount);",
						"        if (balance < 50) balance -= 2;",
						"    }",
						"}",
						"```",
						"",
						"Inside a method, declare `Account from = new Checking(65);` and `Account to = new Account(12);`. Execute `from.transfer(to, 20);`. Which pair of balances results? A. (45, 32), B. (43, 32), C. (43, 34), D. the call cannot compile. Name the class that supplies each method body in call order.",
						"",
						"**Check after tracing:** B. `Account.transfer` calls `Checking.withdraw`, which calls `Account.withdraw` through `super`. The fee changes only the sender. Repeat with fresh accounts and amount 15. The sender lands on 50 and pays no fee."
					].join("\n")
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
					content: apProject({
						goal: "Design a class that adds or takes a quantity within a fixed capacity.",
						steps: [
							"Draft the class and constructor. The capacity is positive and the starting quantity is between zero and capacity.",
							"Complete `add` and `take` for positive amounts. Reject an overfill or overdraw without changing state.",
							"Compare what an alias and a separate bin see after a successful change.",
							"Download the ZIP. Run `javac Main.java SupplyBin.java` and then `java Main`."
						],
						apReasoning:
							"Score capacity, starting state, accessor, each state update, and the return values separately.",
						checks: [
							"A bin holding two of five slots can add three. Adding one more fails. Taking four then leaves one.",
							"An alias sees the quantity one. A separate bin initialized to two still holds two."
						]
					}),
					projectLink: apCheckInAndFrqResources["check-in-3"].starter,
					solutionLink:
						apCheckInAndFrqResources["check-in-3"].reference,
					ideImport: true,
					preserveInstructions: true,
					preserveAssignment: true
				}
			],
			supplementalProjects: [
				{
					title: "Additional Practice: Letter Shifter",
					content: apProject({
						goal: "Use inheritance to give two subclasses a shared letter transformation.",
						steps: [
							"In `Shifter.java`, convert an uppercase or lowercase ASCII letter to its position within the alphabet. Use `Math.floorMod` to put a shift within 0 through 25, then wrap the resulting index inside the same alphabet.",
							"Copy spaces, numbers, punctuation, and other characters without shifting. Complete `DownShifter` so it invokes the shared helper with -1.",
							"Download and extract the ZIP. Run `javac Main.java Shifter.java UpShifter.java DownShifter.java`, then `java Main`. Enter one line of input."
						],
						apReasoning:
							"Each override chooses the direction. The shared method handles case and wraparound in one place.",
						checks: [
							"Input `Az za-09!` gives `Ba ab-09!` forward and `Zy yz-09!` backward.",
							"Shifting forward and then backward restores the input, including spaces and punctuation."
						]
					}),
					projectLink:
						apClassesAndArraysResources["letter-shifter"].starter,
					solutionLink:
						apClassesAndArraysResources["letter-shifter"].reference,
					ideImport: true,
					preserveInstructions: true,
					preserveAssignment: true
				},
				{
					title: "ArrayList Reference",
					contentKind: "reading",
					preserveInstructions: true,
					content:
						"Trace removing adjacent negatives from `[8, -2, -4, 0]`. If a forward loop removes index 1 and increments, it skips the `-4` that shifted to index 1. Trace the same operation backward and explain why both negatives are removed. Continue with the [ArrayList Reference Pack in APCS11](/courses#ap-computer-science-a-apcs11-arraylists-ap-computer-science-a-apcs11-arraylists-supplemental-arraylist-reference-pack)."
				},
				{
					title: "APCS11 ArrayList Multiple Choice Reference",
					contentKind: "reading",
					preserveInstructions: true,
					content: [
						"Trace list insertion, replacement, and index shifts. This snippet is inside a method with `java.util.ArrayList` imported.",
						"```java",
						"ArrayList<Integer> values = new ArrayList<Integer>();",
						"values.add(6);",
						"values.add(1);",
						"values.add(8);",
						"int originalSize = values.size();",
						"for (int i = 0; i < originalSize; i++) {",
						"    values.add(i + 1, i);",
						"    values.set(i, i + 2);",
						"}",
						"```",
						"",
						"1. Which list remains? A. [2, 3, 4], B. [2, 3, 4, 2, 1, 8], C. [2, 0, 3, 1, 4, 2]. Record the list after each loop pass.",
						"2. Then evaluate `int first = values.remove(1);`. Is `first` 1, 2, or 3? Record the resulting list.",
						"3. Explain why the declaration uses `Integer` and which conversion occurs in `values.add(6)`.",
						"",
						"**Check after tracing:** 1B. The passes leave [2, 0, 1, 8], [2, 3, 1, 1, 8], and [2, 3, 4, 2, 1, 8]. The integer argument in `remove(1)` selects the index overload. It returns 3, which unboxes to `int`, and the list becomes [2, 4, 2, 1, 8]. Generic type arguments use reference types and 6 autoboxes to `Integer`."
					].join("\n")
				}
			]
		},
		{
			title: "APCS9 Software Development Lifecycle",
			curriculum: [
				{
					title: "Specifications, Design, and Testability",
					contentKind: "reading",
					preserveInstructions: true,
					content: [
						"A method contract gives each test a predicted result. Suppose `canReserve(int free, int requested)` must accept a positive request that fits the available seats. Its precondition is `free >= 0`. The method returns a boolean and leaves the seat count unchanged.",
						"",
						"```java",
						"static boolean canReserve(int free, int requested) {",
						"    return requested > 0 && requested <= free;",
						"}",
						"```",
						"",
						"Use the following calls in the `main` method.",
						"",
						"```java",
						"System.out.println(canReserve(3, 2));",
						"System.out.println(canReserve(3, 3));",
						"System.out.println(canReserve(3, 4));",
						"System.out.println(canReserve(3, 0));",
						"```",
						"",
						"The outputs are true, true, false, and false. The second case catches an implementation that rejects the last seat. The fourth catches one that accepts any request below capacity. Add a test for an empty room and state its expected result before running it."
					].join("\n"),
					mediaLink: media("apcs9-software-development-lifecycle.png")
				},
				{
					title: "Robust Input and Failure Handling",
					content:
						"Strengthen input handling and validation so malformed input is treated as part of core program correctness. The goal is a program that recovers from invalid input with a clear loop instead of crashing or accepting bad state."
				},
				{
					title: "Core Project: Robust Input Practice",
					content: [
						"Read four groups of input tokens in order. Divide two integers, print the third character of a word, print the character at a zero-based index in `Juni Learning`, and count between two integers including both endpoints.",
						"Complete the validation loops in `Main.java`. Ask again for a zero divisor, a short word, or an index outside the message. RobustScanner skips malformed numeric tokens. Exhausted input ends the session.",
						"Download the ZIP and extract it. Run `javac Main.java RobustScanner.java`, then `java Main`. Enter `8 2 maple 0 3 1`. The completed program gives 4, p, J, then 3, 2, 1. Repeat with equal endpoints to check that the count prints once."
					].join("\n\n"),
					projectLink:
						apInputAndCardResources["robust-input"].starter,
					solutionLink:
						apInputAndCardResources["robust-input"].reference,
					ideImport: true,
					preserveInstructions: true,
					preserveAssignment: true,
					mediaLink: media(
						"apcs9-project-1-robust-input-practice.mp4"
					)
				}
			],
			supplementalProjects: [
				{
					title: "Deck Spec / Specification",
					contentKind: "reading",
					preserveInstructions: true,
					content: [
						"**Draft requirements:** Two players each have a deck. Each draws one card per round. The higher card wins. Diamonds outrank hearts, hearts outrank spades, and spades outrank clubs. A drawn card leaves its deck. The dealer records remaining cards and wins.",
						"",
						"1. Add rules for rank order, whether rank or suit takes priority, equal cards, and a round with an empty deck.",
						"2. Specify how `Card`, `Deck`, and the dealer divide responsibilities. Write contracts for comparison, drawing, and playing a round. Use a predetermined top card in each test so draw order is repeatable.",
						"3. Write the expected winner or tie, both remaining deck sizes, and both win counts for three independent cases. With zero prior wins, use 2 of diamonds versus king of clubs, an ace of clubs in both decks, then an empty first deck versus a one-card second deck. Each occupied deck starts with one card.",
						"",
						"**Example contract:** Rank takes priority, with ace highest and suit breaking rank ties. Equal cards record a tie. An empty deck stops the round before either draw. Under these rules the second player wins the first case and the two decks become empty. The second case leaves both decks empty with neither win count increased. The third case preserves the second player's card and both scores."
					].join("\n")
				},
				{
					title: "Robust Input Reference Review",
					contentKind: "reading",
					preserveInstructions: true,
					content:
						"Continue in the [Robust Input Practice project](/courses#ap-computer-science-a-apcs9-software-development-lifecycle-ap-computer-science-a-apcs9-software-development-lifecycle-curriculum-core-project-robust-input-practice). Trace `oops 8 0 2 x maple -1 0 3 3`. Mark each rejected token and the field that requests its replacement. The reference produces 4, p, J, and a single 3. End input before the first number or after the short word and check for the end-of-input message."
				}
			]
		},
		{
			title: "APCS10 Arrays",
			curriculum: [
				{
					title: "Arrays, Indexing, and Fixed Size",
					contentKind: "reading",
					preserveInstructions: true,
					content: [
						"An array fixes its length when it is created. With three elements, the valid indexes are 0, 1, and 2. In `main`, predict the value of `total` after each iteration.",
						"",
						"```java",
						"int[] scores = {4, 7, 2};",
						"int total = 0;",
						"for (int i = 0; i < scores.length; i++) {",
						"    total += scores[i];",
						"}",
						"System.out.println(total);",
						"```",
						"",
						"The running totals are 4, 11, and 13. At `i == 3`, the loop condition is false. Using `<=` would attempt to read `scores[3]` and throw an exception. With an empty array, the loop runs zero times and prints 0."
					].join("\n")
				},
				{
					id: "ap-computer-science-a-apcs10-arrays-curriculum-pass-by-reference-effects-and-2d-arrays",
					title: "Array References and 2D Traversal",
					contentKind: "reading",
					preserveInstructions: true,
					content: [
						"Java copies an array reference into a method parameter. The caller can observe writes to the shared array. In this helper, the outer loop selects a row, and the inner loop visits every column in that row.",
						"",
						"```java",
						"static void mark(int[][] grid) {",
						"    for (int r = 0; r < grid.length; r++) {",
						"        for (int c = 0; c < grid[r].length; c++) {",
						"            grid[r][c] += 1;",
						"        }",
						"    }",
						"    grid = new int[][] {{99}};",
						"}",
						"```",
						"",
						"Use the following calls in the `main` method.",
						"",
						"```java",
						"int[][] seats = {{2, 4, 6}, {0, 1, 3}};",
						"mark(seats);",
						"System.out.println(seats.length);",
						"System.out.println(seats[0][2]);",
						"System.out.println(seats[1][0]);",
						"```",
						"",
						"The caller still has two rows. Its last column in row 0 now holds 7 and its first column in row 1 holds 1. Reassigning the local `grid` parameter leaves the caller's `seats` reference pointing to the updated original. Trace the six visited positions in row-major order."
					].join("\n")
				},
				{
					title: "Core Project: Practice With Arrays",
					content: apProject({
						goal: "Traverse arrays to compare endpoints, accumulate results, search for zero, and fill a new array.",
						steps: [
							"Run Main.java and trace how the supplied squares method fills indices 0 through 9.",
							"Complete the endpoint check, sum, character total, and zero search. Add a call for each method as it is completed.",
							"Complete the random array method. Use a fixed seed and check the count and range of its result."
						],
						apReasoning:
							"For a sum or search, record each index or element visited and the value of the accumulated answer.",
						checks: [
							"For [2, 0, −3, 2], the endpoints match, the sum is 1, and the zero search succeeds.",
							"For an empty array, endpoint comparison and the zero search both return false. Its sum is 0.",
							'["sun", "", "sky"] has 6 characters. Three generated doubles all lie in [0, 10).'
						],
						extension:
							"Reverse into a new array without changing the input. Swap the first minimum and maximum in the original array, handling an empty array before reading index 0."
					}),
					projectLink:
						apRemainingCoreResources["array-practice"].starter,
					solutionLink:
						apRemainingCoreResources["array-practice"].reference,
					ideImport: true,
					preserveInstructions: true,
					preserveAssignment: true,
					mediaLink: media(
						"apcs10-project-1-practice-with-arrays.mp4"
					)
				},
				{
					title: "Array Reference Pack",
					content: apProject({
						goal: "Trace array defaults, valid indexes, element updates, and local rebinding.",
						steps: [
							"Run `Main.java` and compare the first element’s default value with the length and last valid index.",
							"Complete `square` so it updates each value in the original array. Compare its effect with `replaceLocally`, which points its parameter at a new array.",
							"Trace the nested iteration through the 2-by-3 example and calculate its total."
						],
						apReasoning:
							"An array parameter contains a copy of the caller’s reference. A method can use that reference to change an element, while assigning a new array to the parameter leaves the caller’s reference in place.",
						checks: [
							"Length 5 gives indexes 0 through 4. Squaring `0 1 2 3 4` yields `0 1 4 9 16`.",
							"The local replacement starts at 42. The caller still has the squared values, and the separate grid sums to 21."
						]
					}),
					projectLink:
						apClassesAndArraysResources["array-reference"].starter,
					solutionLink:
						apClassesAndArraysResources["array-reference"]
							.reference,
					ideImport: true,
					preserveInstructions: true,
					preserveAssignment: true
				}
			],
			supplementalProjects: [
				{
					title: "Project: Random Mad Libs",
					content: apProject({
						goal: "Use independent array choices to print five complete sentences.",
						steps: [
							"Read the adjective, noun, and verb banks. In `choose`, use `random.nextInt(words.length)` to produce an index for the supplied nonempty bank.",
							"Run `Main.java`. Check the grammatical role of each word in the template. Trace a draw at index 0 and at the last valid index of each bank.",
							"Change the seed and compare the selections while keeping the same rules for which bank supplies each word."
						],
						apReasoning:
							"The upper bound to `nextInt` is exclusive. Passing the length keeps the draw in bounds for banks of different sizes.",
						checks: [
							"The program prints five sentences with the form `The adjective noun began to verb at midnight.`",
							"Each chosen word belongs to the correct bank. The IDE preview can draw different words from a native Java run with the same seed."
						]
					}),
					projectLink:
						apClassesAndArraysResources["random-mad-libs"].starter,
					solutionLink:
						apClassesAndArraysResources["random-mad-libs"]
							.reference,
					ideImport: true,
					preserveInstructions: true,
					preserveAssignment: true,
					mediaLink: media("apcs10-project-2-random-mad-libs.mp4")
				},
				{
					title: "Project: Practice With Two-Dimensional Arrays",
					content: apProject({
						goal: "Search a grid, add its values, and compare the sums of its rows.",
						steps: [
							"Trace the supplied `containsValue` and `sumRow` methods. Identify the row and column represented by each loop.",
							"Complete `sumOfArray` by adding the row totals. Complete `isRowMagic` by comparing each row sum with the first.",
							"Handle empty grids explicitly. Their total is 0, and empty or single-row grids have no unequal row sums."
						],
						apReasoning:
							"A two-dimensional array contains rows with their own lengths. Reset a row total at the start of each row and keep the grid total separate.",
						checks: [
							"The first grid contains 6, does not contain 11, and sums to 85. Its rows have different sums.",
							"All rows in the second grid sum to 25, including the row with negative entries."
						]
					}),
					projectLink:
						apClassesAndArraysResources["two-dimensional-arrays"]
							.starter,
					solutionLink:
						apClassesAndArraysResources["two-dimensional-arrays"]
							.reference,
					ideImport: true,
					preserveInstructions: true,
					preserveAssignment: true,
					mediaLink: media(
						"apcs10-project-3-practice-with-two-dimensional-array.mp4"
					)
				},
				{
					title: "Project: Matrix Arithmetic",
					content: apProject({
						goal: "Use compatible shapes to add, subtract, and multiply matrices.",
						steps: [
							"Read the supplied shape checks before filling the result. Addition and subtraction need the same row and column counts. Multiplication needs the left column count to equal the right row count.",
							"In `combine`, use the sign parameter to add or subtract corresponding cells. In `matrixMul`, accumulate the products from one row and one column per result cell.",
							"Use integer inputs with intermediate values that fit in `int`. Incompatible, empty, and jagged grids produce a rejected result."
						],
						apReasoning:
							"The shared index walks across the left row and down the right column. The result has the left matrix’s row count and the right matrix’s column count.",
						checks: [
							"A times B gives rows `19 25` and `43 58`. C plus D is a 3-by-3 grid of 10s.",
							"C minus D gives `-8 -6 -4`, `-2 0 2`, and `4 6 8`. A plus B prints `Incompatible dimensions`."
						]
					}),
					projectLink:
						apClassesAndArraysResources["matrix-arithmetic"]
							.starter,
					solutionLink:
						apClassesAndArraysResources["matrix-arithmetic"]
							.reference,
					ideImport: true,
					preserveInstructions: true,
					preserveAssignment: true,
					mediaLink: media("apcs10-project-4-matrix-arithmetic.mp4")
				},
				{
					title: "Free Response Practice",
					contentKind: "assignment",
					preserveInstructions: true,
					content: `Use Question 4, GridPath, in the [2024 questions](${AP_2024_FRQ}). Trace a path that moves down or right to the smaller available neighbor. When only one neighbor remains, the next move is forced. On the grid {{2, 7, 6}, {4, 1, 3}}, record each visited coordinate from the top left to the bottom right. The values are 2, 4, 1, and 3, so their sum is 10. Write your two method bodies before checking the [official scoring guide](${AP_2024_FRQ_SCORING}). Test one starting location in the last row and one in the last column.`,
					projectLink: AP_2024_FRQ,
					solutionLink: AP_2024_FRQ_SCORING
				}
			]
		},
		{
			title: "APCS11 ArrayLists",
			curriculum: [
				{
					title: "ArrayLists, Wrapper Constraints, and Core Methods",
					contentKind: "reading",
					preserveInstructions: true,
					content: [
						"Place `import java.util.ArrayList;` above the class declaration. A list grows and shrinks as elements are added and removed. `ArrayList<Integer>` stores integer wrapper objects. Java boxes each `int` passed to `add` or `set`. Trace these operations in `main`.",
						"",
						"```java",
						"ArrayList<Integer> scores = new ArrayList<>();",
						"scores.add(4);",
						"scores.add(7);",
						"System.out.println(scores.set(0, 9));",
						"System.out.println(scores.remove(1));",
						"System.out.println(scores.get(0));",
						"System.out.println(scores.size());",
						"```",
						"",
						"The outputs are 4, 7, 9, and 1. `set` returns the replaced value and keeps the list size. Here `remove(1)` selects index 1, returns its value, and shortens the list. Only index 0 remains valid. Predict the outputs after adding 5 before the final size check."
					].join("\n")
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
					content: apProject({
						goal: "Trace operations that read a list, create a new list, or update a list in place.",
						steps: [
							"Run Main.java and trace the completed even-count method.",
							"Implement sum and copy words beginning with lowercase a into a new list. Skip empty strings.",
							"Replace negative values with −1.0 and positive values with 1.0 in place. Keep zero unchanged.",
							"Search backward for the last even number. Remove it by index and stop."
						],
						apReasoning:
							"Record list size and indices before and after each change. Replacement preserves size. Removal shifts every later index.",
						checks: [
							"[3, 2, 5, 2, 7] has two evens and sums to 19. Removing the last even gives [3, 2, 5, 7].",
							'Filtering ["", "apple", "class", "ant"] gives ["apple", "ant"] and leaves the input intact.',
							"[−2.5, 0.0, 6.5] becomes [−1.0, 0.0, 1.0]. A list without an even number stays unchanged."
						]
					}),
					projectLink:
						apRemainingCoreResources["array-list-practice"].starter,
					solutionLink:
						apRemainingCoreResources["array-list-practice"]
							.reference,
					ideImport: true,
					preserveInstructions: true,
					preserveAssignment: true,
					mediaLink: media(
						"apcs11-project-1-practice-with-arraylists.mp4"
					)
				},
				{
					title: "ArrayList Reference Pack",
					content: apProject({
						goal: "Trace append, insertion, replacement, and removal on a list of boxed integers.",
						steps: [
							"Run the starter. Trace how appending adds at the end and how inserting -5 at index 1 shifts every later value.",
							"Replace the last element with 7. An array uses `.length` and brackets. An ArrayList uses `size()` with `get` and `set`.",
							"Complete `removeNegatives` with a backward index loop. Use `remove(i)` to remove by index."
						],
						apReasoning:
							"An index identifies a position, which may change after a removal. Starting at the end keeps earlier positions valid.",
						checks: [
							"Replacement keeps the size at five. The final list is `[42, 0, 7]` after both adjacent negatives are removed.",
							"Check a list of all negative numbers, a list without negatives, and an empty list."
						]
					}),
					projectLink:
						apListsAndAlgorithmsResources["array-list-reference"]
							.starter,
					solutionLink:
						apListsAndAlgorithmsResources["array-list-reference"]
							.reference,
					ideImport: true,
					preserveInstructions: true,
					preserveAssignment: true
				}
			],
			supplementalProjects: [
				{
					title: "Project: Fortune Teller",
					content: apProject({
						goal: "Draw from a shrinking list of fortunes without repeating a draw.",
						steps: [
							"Open `FortuneTeller.java`. Keep the empty-list check before selecting an index.",
							"Use `nextInt(fortunes.size())` to choose an index. Remove that entry and return the string from `remove`.",
							"Download and extract the project. Run `javac Main.java FortuneTeller.java`, then `java Main`."
						],
						apReasoning:
							"The list size changes after each draw. The current size sets the exclusive upper bound for the next index.",
						checks: [
							"The first five results are distinct. The sixth says `No fortunes left.` and the count stays at zero.",
							"Two FortuneTeller objects start with separate lists. Drawing from one leaves the other at five."
						]
					}),
					projectLink:
						apListsAndAlgorithmsResources["fortune-teller"].starter,
					solutionLink:
						apListsAndAlgorithmsResources["fortune-teller"]
							.reference,
					ideImport: true,
					preserveInstructions: true,
					preserveAssignment: true,
					mediaLink: media("apcs11-project-2-fortune-teller.mp4")
				},
				{
					title: "Project: Card Shuffler",
					content: [
						"Start with the thirteen hearts in rank order. Build a new list by repeatedly choosing a random index from the remaining cards, removing that card, and appending it to the result. Keep the original list in its initial order. Copy it into a working list first.",
						"Use Random.nextInt(remaining.size()) only while the working list has cards. After each draw, its size plus the result size equals the input size. Independent runs can give the same ordering. Look for all thirteen different hearts exactly once rather than expecting a particular first card. Also try an empty list and a single card.",
						"Download and extract the ZIP. Run `javac Main.java Card.java` then `java Main`. The starter prints the original suit and an empty result until the draw loop is completed."
					].join("\n\n"),
					projectLink:
						apStoryShuffleTraceResources["card-shuffler"].starter,
					solutionLink:
						apStoryShuffleTraceResources["card-shuffler"].reference,
					ideImport: true,
					preserveInstructions: true,
					preserveAssignment: true,
					mediaLink: media("apcs11-project-3-card-shuffler.mp4")
				},
				{
					title: "Free Response Practice",
					content: apProject({
						goal: "Extract matching delimiter tokens and test whether they are balanced.",
						steps: [
							"Use two distinct configured tokens, such as `(` and `)`. Build a new list from the exact matching strings in the input array, keeping their order.",
							"In `isBalanced`, track unmatched openings. Increase the count on an open token and decrease it on a close token. The input list contains only those two tokens.",
							"Return false as soon as the count becomes negative. After the loop, return whether the count is zero.",
							"Download the ZIP. Run `javac Main.java Delimiters.java` and then `java Main`."
						],
						apReasoning:
							"Equal totals alone cannot establish balance. Trace the running count for a close token followed by an open token.",
						checks: [
							"Two opens followed by two closes pass. A close before an open fails. An unclosed open fails and an empty list passes.",
							"With tokens `(` and `)`, ignore a string such as `text(`. The actual list only includes whole-token matches."
						]
					}),
					projectLink:
						apCheckInAndFrqResources["delimiters-frq"].starter,
					solutionLink:
						apCheckInAndFrqResources["delimiters-frq"].reference,
					ideImport: true,
					preserveInstructions: true,
					preserveAssignment: true
				},
				{
					title: "Card and Deck Classes",
					content: apProject({
						goal: "Model a 52-card deck that deals cards without replacement and resolves a round between two decks.",
						steps: [
							"Read the nested loops that create 13 cards for each of four suits.",
							"In `Deck.java`, choose a random index within the current size, then remove and return the card. An empty deck returns `null`.",
							"In `Card.java`, compare ranks first. If ranks are equal, compare suit names alphabetically. Equal rank and suit ties the round.",
							"Download the ZIP. Compile with `javac Main.java Card.java Deck.java LuckGame.java` and run `java Main`."
						],
						apReasoning:
							"Card owns the comparison, Deck owns the list, and LuckGame owns the scores. A round starts only when both decks have a card.",
						checks: [
							"Each deck starts with 52 distinct cards. The supplied decks use the same seed, so all 52 draws tie and both decks are empty.",
							"Change one seed to exercise both win counters. Wins plus ties still equal 52. An extra attempted round leaves both decks and scores intact."
						]
					}),
					projectLink:
						apListsAndAlgorithmsResources["card-and-deck"].starter,
					solutionLink:
						apListsAndAlgorithmsResources["card-and-deck"]
							.reference,
					ideImport: true,
					preserveInstructions: true,
					preserveAssignment: true
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
					content: apProject({
						goal: "Complete one Data Analysis with ArrayList response and one 2D Array response.",
						steps: [
							"Write `removeShortLabels` to remove strings shorter than the minimum length. Keep the other labels in order and update the supplied list itself.",
							"Write `countPositive` to return the number of strictly positive entries in a rectangular integer grid without modifying its cells.",
							"Record a trace for two adjacent removals and visit every row and column of the sample grid. Run the program only after drafting both methods."
						],
						apReasoning:
							"Score traversal, conditions, mutation boundaries and the return value independently for each method.",
						checks: [
							"Removing labels below length three from `[desk, ox, i, shelf]` gives `[desk, shelf]`.",
							"The rows `[0, 3, -1]` and `[2, -3, 5]` contain three positives. An empty grid contains zero."
						]
					}),
					projectLink: apCheckInAndFrqResources["check-in-4"].starter,
					solutionLink:
						apCheckInAndFrqResources["check-in-4"].reference,
					ideImport: true,
					preserveInstructions: true,
					preserveAssignment: true,
					mediaLink: media("apcs-check-in-4.mp4")
				}
			],
			supplementalProjects: [
				{
					title: "Additional Practice: Inversion Counting",
					content: apProject({
						goal: "Count pairs whose earlier value is strictly greater than their later value.",
						steps: [
							"Implement `pairCount` by comparing each index with the indexes that follow it. Leave the input intact.",
							"Trace the provided insertion sort and count each shift. Compare the result with the pair count.",
							"In the merge, take equal values from the left. When taking a smaller right value, count the remaining left values it passes."
						],
						apReasoning:
							"The direct method considers every pair. The merge method counts a run of inversions at once while sorting.",
						checks: [
							"`[3, 1, 2, 1]` has four inversions. `[4, 3, 2, 1]` has six. Equal values and empty arrays add none.",
							"Both sorting variants leave their arrays in ascending order and return the same count as the pair method."
						],
						extension:
							"For length n, explain why pair counting checks n(n−1)/2 pairs and why merge counting processes each element once per merge level."
					}),
					projectLink:
						apAdvancedPracticeResources["inversion-counting"]
							.starter,
					solutionLink:
						apAdvancedPracticeResources["inversion-counting"]
							.reference,
					ideImport: true,
					preserveInstructions: true,
					preserveAssignment: true
				},
				{
					title: "Project: Minimum and Maximum",
					contentKind: "reading",
					preserveInstructions: true,
					content:
						"Trace the minimum and maximum candidates for `[-6, -9, -3]` after each element. Explain what goes wrong if the maximum starts at zero. Continue with [Minimum and Maximum Search in APCS12](/courses#ap-computer-science-a-apcs12-wrapper-classes-ap-computer-science-a-apcs12-wrapper-classes-supplemental-project-minimum-and-maximum-search)."
				},
				{
					title: "Runtime Analysis Starter",
					contentKind: "reading",
					preserveInstructions: true,
					content:
						"Trace two loops on a four-element array. Visiting every ordered pair takes 16 iterations. Visiting the first element once, the second twice, the third three times, and the fourth four times takes 10. Check the counts in the [Runtime Analysis project](/courses#ap-computer-science-a-apcs13-algorithmic-runtime-and-linear-search-ap-computer-science-a-apcs13-algorithmic-runtime-and-linear-search-curriculum-core-project-runtime-analysis)."
				}
			]
		},
		{
			title: "APCS12 Wrapper Classes",
			curriculum: [
				{
					title: "Wrapper Types, Autoboxing, and Unboxing",
					contentKind: "reading",
					preserveInstructions: true,
					content: [
						"An `ArrayList<Integer>` stores objects. Adding an `int` boxes its value as an `Integer`. Reading that element into an `int` unboxes it. With `import java.util.ArrayList;` above the class, trace the types in this example.",
						"",
						"```java",
						"ArrayList<Integer> readings = new ArrayList<>();",
						'readings.add(Integer.parseInt("12"));',
						"Integer boxed = readings.get(0);",
						"int next = boxed + 1;",
						"System.out.println(next);",
						"System.out.println(readings.get(0));",
						"```",
						"",
						'The outputs are 13 and 12. Parsing produced an integer from text. Addition unboxed the stored value, and assigning the sum to `next` left the list unchanged. A list can also contain `null`. Unboxing that entry in an arithmetic expression throws `NullPointerException`. Predict what happens if the text passed to `parseInt` is `"twelve"`: parsing throws `NumberFormatException` before the list receives anything.',
						"",
						"[Minimum and Maximum Search practice](/courses#ap-computer-science-a-apcs12-wrapper-classes-ap-computer-science-a-apcs12-wrapper-classes-supplemental-project-minimum-and-maximum-search)"
					].join("\n")
				},
				{
					title: "Static Constants and Search Initialization",
					contentKind: "reading",
					preserveInstructions: true,
					content: [
						"Suppose a weather station reports only negative temperatures. Starting a maximum at zero would report a temperature the station never observed. This scan uses the lowest and highest possible `int` values as starting bounds for a nonempty array.",
						"",
						"```java",
						"int[] temperatures = {-8, -2, -15};",
						"int low = Integer.MAX_VALUE;",
						"int high = Integer.MIN_VALUE;",
						"for (int value : temperatures) {",
						"    if (value < low) low = value;",
						"    if (value > high) high = value;",
						"}",
						"System.out.println(low);",
						"System.out.println(high);",
						"```",
						"",
						"After each reading, `(low, high)` is `(-8, -8)`, `(-8, -2)`, then `(-15, -2)`. Either bound can equal a real reading. For an empty input, neither bound describes an observation. The linked project handles that case explicitly and prints `No values`. Trace a single reading of `Integer.MIN_VALUE` to check both bounds.",
						"",
						"[Minimum and Maximum Search practice](/courses#ap-computer-science-a-apcs12-wrapper-classes-ap-computer-science-a-apcs12-wrapper-classes-supplemental-project-minimum-and-maximum-search)"
					].join("\n")
				},
				{
					title: "Core Project: Suits, Decks, and Hands",
					content: [
						"Trace a card transfer through three collections. A suit stores 13 cards in rank order, a deck holds 52 cards, and a hand preserves arrival order.",
						"Complete `Suit.remove(index)`, `Deck.removeRandom()`, and `Hand.removeFirst()`. Remove the selected card from its collection. Return `null` for an invalid index or an empty draw.",
						"Download the ZIP and extract it. Run `javac Main.java Card.java Deck.java Hand.java Suit.java`, then `java Main`. Index 5 selects the 6 of Clubs. The suit has 12 cards left, the deck has 51, and the first card removed from the two-card hand is the 6 of Clubs."
					].join("\n\n"),
					projectLink:
						apInputAndCardResources["suit-deck-hand"].starter,
					solutionLink:
						apInputAndCardResources["suit-deck-hand"].reference,
					ideImport: true,
					preserveInstructions: true,
					preserveAssignment: true,
					mediaLink: media(
						"apcs12-project-1-suits-decks-and-hands.mp4"
					)
				}
			],
			supplementalProjects: [
				{
					title: "Project: Minimum and Maximum Search",
					content: apProject({
						goal: "Find the smallest and largest boxed integers in one traversal.",
						steps: [
							"Keep the early return for an empty list. An empty result lets the caller print `No values`.",
							"Start the minimum at `Integer.MAX_VALUE` and the maximum at `Integer.MIN_VALUE`.",
							"Use an enhanced loop to unbox each value. Update the two candidates independently and return them in minimum, maximum order."
						],
						apReasoning:
							"A value can update both candidates on the first pass. Track the running minimum and maximum after each step.",
						checks: [
							"`[-8, -2, -15]` gives `-15, -2`. `[9, 3, 9]` gives `3, 9`, and `[5]` gives `5, 5`.",
							"An empty list has no extremes. Test the two Integer limits as list entries."
						]
					}),
					projectLink:
						apListsAndAlgorithmsResources["minimum-and-maximum"]
							.starter,
					solutionLink:
						apListsAndAlgorithmsResources["minimum-and-maximum"]
							.reference,
					ideImport: true,
					preserveInstructions: true,
					preserveAssignment: true,
					mediaLink: media("apcs12-project-2-minimum-search.mp4")
				},
				{
					title: "Project: Deck Class",
					content: apProject({
						goal: "Give a deck ownership of its list and define a typed ordering for suits.",
						steps: [
							"Copy the supplied list in the Deck constructor. The Deck and its caller can then remove cards from their own lists independently.",
							"Complete `Suit.compareTo` using the numeric positions of Clubs, Spades, Hearts, and Diamonds from lowest to highest.",
							"Trace how Card uses the Suit only when ranks match. Rank 1 is an ace and rank 13 is a king.",
							"Download the ZIP. Run `javac Main.java Card.java Deck.java Luck.java Suit.java`, then `java Main`."
						],
						apReasoning:
							"Sharing a mutable list causes changes on either side to affect the other. Copying the list keeps deck membership independent.",
						checks: [
							"Clearing the supplied list leaves the deck at two cards. An invalid index returns `null` without removing a card.",
							"The first valid draw returns `12 of Clubs`, and Diamonds ranks above Clubs."
						]
					}),
					projectLink:
						apListsAndAlgorithmsResources["deck-class"].starter,
					solutionLink:
						apListsAndAlgorithmsResources["deck-class"].reference,
					ideImport: true,
					preserveInstructions: true,
					preserveAssignment: true
				}
			]
		},
		{
			title: "APCS13 Algorithmic Runtime and Linear Search",
			curriculum: [
				{
					title: "Runtime by Step Counting",
					contentKind: "reading",
					preserveInstructions: true,
					content: [
						"Count one comparison each time a linear search checks a value against the target. This method returns the number of comparisons through the first match, or the number needed to exhaust the input. Place it inside `Main`, outside `main`.",
						"",
						"```java",
						"static int comparisons(int[] values, int target) {",
						"    int checks = 0;",
						"    for (int value : values) {",
						"        checks++;",
						"        if (value == target) break;",
						"    }",
						"    return checks;",
						"}",
						"```",
						"",
						"In `main`:",
						"",
						"```java",
						"int[] route = {7, 2, 7, 1};",
						"System.out.println(comparisons(route, 7));",
						"System.out.println(comparisons(route, 1));",
						"System.out.println(comparisons(route, 9));",
						"```",
						"",
						"The first 7 ends the first search after one comparison. Searching for 1 visits all four values and succeeds. Searching for 9 also visits all four and fails. The count alone cannot distinguish those last two outcomes. The project returns a boolean for that purpose. For a missing target in an array of length `n`, exactly `n` equality checks run, including zero for an empty array.",
						"",
						"[Linear Search Implementation practice](/courses#ap-computer-science-a-apcs13-algorithmic-runtime-and-linear-search-ap-computer-science-a-apcs13-algorithmic-runtime-and-linear-search-supplemental-project-linear-search-implementation)"
					].join("\n")
				},
				{
					title: "Best, Average, and Worst Case",
					contentKind: "reading",
					preserveInstructions: true,
					content: [
						"Search the four distinct labels below from left to right. Count the equality check that finds the label. This experiment searches for each present label once, so every possible successful position has equal weight.",
						"",
						"```java",
						"int[] labels = {8, 3, 6, 4};",
						"int total = 0;",
						"for (int target : labels) {",
						"    int checks = 0;",
						"    for (int value : labels) {",
						"        checks++;",
						"        if (value == target) break;",
						"    }",
						"    System.out.println(checks);",
						"    total += checks;",
						"}",
						"System.out.println(total / (double) labels.length);",
						"```",
						"",
						"The counts are 1, 2, 3, and 4. Their mean is 2.5 comparisons under the stated model. With half of searches missing and the other half equally divided among these four labels, the expected count becomes `0.5 × 4 + 0.5 × 2.5 = 3.25`. The fastest and slowest counts stay at 1 and 4. Explain how duplicate labels would affect the first-match assumption.",
						"",
						"[Linear Search Implementation practice](/courses#ap-computer-science-a-apcs13-algorithmic-runtime-and-linear-search-ap-computer-science-a-apcs13-algorithmic-runtime-and-linear-search-supplemental-project-linear-search-implementation)"
					].join("\n")
				},
				{
					title: "Core Project: Runtime Analysis",
					content: apProject({
						goal: "Use the runtime-analysis starter to connect Java loop structure to growth-rate reasoning.",
						steps: [
							"Identify the input size for each method before counting anything.",
							"Count each execution of `count++`. In f6, include the increment after the inner loop.",
							"Count the operation for small input sizes and look for the pattern.",
							"Classify the growth rate after the count is visible."
						],
						apReasoning:
							"AP CSA Java reasoning expects the answer to cite code structure: loop bounds, nested loops, early exits, or recursive calls. The notation is a summary of that evidence, not a replacement for it.",
						checks: [
							"The counted operation is named explicitly.",
							"The six supplied calls print 20, 100, 21, 8, 16, and 10. Trace the eight halvings from 128 through 1 to 0.",
							"The final growth class matches the dominant term rather than a copied guess."
						],
						extension:
							"Compare two implementations of the same task and explain which input sizes would make the difference noticeable."
					}),
					projectLink: apRuntimeAnalysisResources.starter,
					solutionLink: apRuntimeAnalysisResources.reference,
					ideImport: true,
					preserveInstructions: true,
					preserveAssignment: true
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
							"Run `Main.java`. Trace the front and end matches in `[7, 2, 7, 1]`, then count the values checked when 9 is absent."
						],
						apReasoning:
							"The AP question is not only whether the code finds the target. It is also which comparisons occur, when the loop stops, and how sortedness changes the worst-case or early-exit behavior.",
						checks: [
							"The not-found case terminates without reading past the end.",
							"The found-at-front case performs one comparison.",
							"In `[-3, 0, 4, 4, 9]`, a search for 2 stops at the first 4. A search for 4 succeeds. An empty array returns false."
						],
						extension:
							"Return the first matching index instead of a boolean result, then test duplicates and explain why the first occurrence is returned."
					}),
					projectLink:
						apListsAndAlgorithmsResources["linear-search"].starter,
					solutionLink:
						apListsAndAlgorithmsResources["linear-search"]
							.reference,
					ideImport: true,
					preserveInstructions: true,
					preserveAssignment: true,
					mediaLink: media("apcs13-project-2-linear-search.mp4")
				},
				{
					title: "Algorithmic Runtime and Linear Search Trace and Boundary Case",
					aliases: ["Applied Challenge"],
					contentKind: "assignment",
					learningPath: "challenge",
					preserveAssignment: true,
					preserveInstructions: true,
					content: [
						"Two shelves use the same inventory search. Shelf A holds IDs `[2, 5, 8, 8, 11]` in ascending order. Shelf B holds `[8, 2, 11, 5, 8]` in arrival order. For targets 5, 7, and 8, list the visited IDs, the boolean result, and the number of entries examined on each shelf.",
						"",
						"On A, stop at a match or at the first larger value. On B, stop only at a match or the end. For target 7 the visits on A are 2, 5, 8 and the result is false. B must inspect all five. For target 8 the counts are three and one. Explain why using the sorted rule on B would miss 5. Add an empty shelf to the trace and check the methods with the same inputs.",
						"",
						"[Open the Linear Search Implementation project](/courses#ap-computer-science-a-apcs13-algorithmic-runtime-and-linear-search-ap-computer-science-a-apcs13-algorithmic-runtime-and-linear-search-supplemental-project-linear-search-implementation)"
					].join("\n")
				}
			]
		},
		{
			title: "APCS14 Selection and Insertion Sort",
			curriculum: [
				{
					title: "Selection Sort",
					contentKind: "reading",
					preserveInstructions: true,
					content: [
						"For each open position, scan the unsorted suffix for its smallest value, then swap that value into the open position. With `import java.util.Arrays;` above the class, print the array after each outer pass.",
						"",
						"```java",
						"int[] values = {4, 1, 3, 1};",
						"for (int i = 0; i < values.length - 1; i++) {",
						"    int min = i;",
						"    for (int j = i + 1; j < values.length; j++) {",
						"        if (values[j] < values[min]) min = j;",
						"    }",
						"    int saved = values[i];",
						"    values[i] = values[min];",
						"    values[min] = saved;",
						"    System.out.println(Arrays.toString(values));",
						"}",
						"```",
						"",
						"The states are `[1, 4, 3, 1]`, `[1, 1, 3, 4]`, and `[1, 1, 3, 4]`. The strict comparison selects the first minimum during a pass. After two passes, the two smallest values occupy their final positions. The last pass still compares 3 and 4. Count the comparisons: `3 + 2 + 1 = 6`, even on an already sorted four-element array. The linked project uses `get` and `set` to perform the same operations on an ArrayList.",
						"",
						"[Selection Sort practice](/courses#ap-computer-science-a-apcs14-selection-and-insertion-sort-ap-computer-science-a-apcs14-selection-and-insertion-sort-curriculum-core-project-selection-sort)"
					].join("\n")
				},
				{
					title: "Insertion Sort",
					contentKind: "reading",
					preserveInstructions: true,
					content: [
						"Before pass `i`, positions before `i` form a sorted prefix. Save the next value so shifting its larger neighbors right cannot overwrite it. With `import java.util.Arrays;` above the class, predict the array and number of shifts after each pass.",
						"",
						"```java",
						"int[] values = {4, 1, 3, 1};",
						"int shifts = 0;",
						"for (int i = 1; i < values.length; i++) {",
						"    int saved = values[i];",
						"    int spot = i;",
						"    while (spot > 0 && values[spot - 1] > saved) {",
						"        values[spot] = values[spot - 1];",
						"        spot--;",
						"        shifts++;",
						"    }",
						"    values[spot] = saved;",
						'    System.out.println(Arrays.toString(values) + " / " + shifts);',
						"}",
						"```",
						"",
						"The cumulative shifts are 1, 2, and 4. In the last pass, 4 and 3 move right. The original 1 stays in place because it equals the saved value. Compare the first pass with selection sort on the same input. On `[1, 1, 3, 4]` there are no shifts, even though the outer loop still runs three times.",
						"",
						"[Insertion Sort practice](/courses#ap-computer-science-a-apcs14-selection-and-insertion-sort-ap-computer-science-a-apcs14-selection-and-insertion-sort-supplemental-project-insertion-sort)"
					].join("\n")
				},
				{
					title: "Core Project: Selection Sort",
					content: apProject({
						goal: "Implement selection sort with a visible sorted-region invariant and traceable comparison behavior.",
						steps: [
							"Run Main.java and predict each pass on [5, −1, 2, −1, 0] before completing the sort.",
							"Loop over each position that will receive the next value in ascending order.",
							"Initialize the selected index to that position and compare it with the rest of the unsorted suffix.",
							"Swap after the scan and record how the sorted prefix changed."
						],
						apReasoning:
							"AP CSA Java reasoning focuses on the invariant and the nested-loop count. The outer loop fixes one position per pass, and the inner loop searches the remaining region.",
						checks: [
							"The first pass chooses index 1. The final list is [−1, −1, 0, 2, 5].",
							"Check an empty list, a single item, duplicates, and sorted and reverse-sorted lists.",
							"Count 4 + 3 + 2 + 1 comparisons for five values. Explain how that sum grows with the list size."
						],
						extension:
							"Sort objects by one field, such as card rank or student score, and explain what comparison changed."
					}),
					projectLink:
						apRemainingCoreResources["selection-sort"].starter,
					solutionLink:
						apRemainingCoreResources["selection-sort"].reference,
					ideImport: true,
					preserveInstructions: true,
					preserveAssignment: true,
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
							"Move each strictly larger value one place right, move the gap left, and add one to the shift count.",
							"Place the saved value in the gap. Trace a nearly sorted input and a reverse-sorted input."
						],
						apReasoning:
							"Insertion sort questions often test loop conditions, index bounds, and the order of assignment during shifting. A clean trace shows why `j >= 0` style bounds checks matter.",
						checks: [
							"The current value is preserved while other values shift.",
							"`[3, -1, 3, 0]` becomes `[-1, 0, 3, 3]` in three shifts. Equal values keep their original order.",
							"`[1, 3, 2, 4]` takes one shift, `[4, 3, 2, 1]` takes six, and an empty or already sorted array takes zero."
						],
						extension:
							"Count comparisons as well as shifts. Compare selection sort and insertion sort on the same inputs."
					}),
					projectLink:
						apListsAndAlgorithmsResources["insertion-sort"].starter,
					solutionLink:
						apListsAndAlgorithmsResources["insertion-sort"]
							.reference,
					ideImport: true,
					preserveInstructions: true,
					preserveAssignment: true,
					mediaLink: media("apcs14-project-2-insertion-sort.mp4")
				},
				{
					title: "Selection and Insertion Sort Trace and Boundary Case",
					aliases: ["Applied Challenge"],
					contentKind: "assignment",
					learningPath: "challenge",
					preserveAssignment: true,
					preserveInstructions: true,
					content: [
						"Three runners arrive in the order `3A, 3B, 1C`. Each label records a finish time and a runner ID. Sort by time alone. Track the IDs on paper so equal times remain distinguishable. For selection sort, scan for the first strictly smaller minimum and swap it into the open position. For insertion sort, shift only times strictly greater than the saved time.",
						"",
						"Record the order after every outer pass. Selection gives `1C, 3B, 3A` after its first swap. Insertion leaves `3A, 3B, 1C` after its first pass and finishes with `1C, 3A, 3B`. Both sort the times correctly. Only insertion preserves arrival order for the tie in this example. Repeat with three equal times. Predict how changing insertion’s `>` to `>=` affects equal runners before checking the trace.",
						"",
						"[Open the Insertion Sort project](/courses#ap-computer-science-a-apcs14-selection-and-insertion-sort-ap-computer-science-a-apcs14-selection-and-insertion-sort-supplemental-project-insertion-sort)"
					].join("\n")
				}
			]
		},
		{
			title: "APCS15 Recursion",
			curriculum: [
				{
					title: "Base Cases, Recursive Steps, and Stack Frames",
					contentKind: "reading",
					preserveInstructions: true,
					content: [
						"Each method call keeps its own parameter and a place to resume. This method stops on an empty string. For a nonempty string it recurses on the suffix, then prints the first character of the current frame. Put the helper inside the class and the call in `main`.",
						"",
						"```java",
						"static void printReverse(String word) {",
						"    if (word.length() > 0) {",
						"        printReverse(word.substring(1));",
						"        System.out.print(word.charAt(0));",
						"    }",
						"}",
						"```",
						"",
						"In `main`:",
						"",
						"```java",
						'printReverse("map");',
						"System.out.println();",
						"```",
						"",
						'The arguments on the way down are `"map"`, `"ap"`, `"p"`, and `""`. The empty frame returns immediately. The suspended frames then print `p`, `a`, and `m`, producing `pam`. Trace `""` and a one-letter word. Predict how the output changes if the print moves before the recursive call.',
						"",
						"[Tracing Recursion practice](/courses#ap-computer-science-a-apcs15-recursion-ap-computer-science-a-apcs15-recursion-curriculum-core-project-tracing-recursion)"
					].join("\n"),
					mediaLink: media("apcs15-recursion-1.png")
				},
				{
					title: "Stack Overflow and Tail Recursion",
					contentKind: "reading",
					preserveInstructions: true,
					content: [
						"A recursive step must approach a reachable base case. For a nonnegative starting value, each call here removes one remaining step and adds one to the running total. The recursive call is the last operation, which makes it a tail call.",
						"",
						"```java",
						"static int countSteps(int remaining, int total) {",
						"    if (remaining == 0) return total;",
						"    return countSteps(remaining - 1, total + 1);",
						"}",
						"```",
						"",
						"In `main`:",
						"",
						"```java",
						"System.out.println(countSteps(3, 0));",
						"System.out.println(countSteps(0, 8));",
						"```",
						"",
						"The first call visits `(3,0)`, `(2,1)`, `(1,2)`, and `(0,3)`. The base frame returns 3 and every waiting frame returns that same value. The second call returns 8 immediately. If the step added one to `remaining`, starting at 3 would visit 4, 5, and 6 and move away from zero. Java does not guarantee tail-call elimination. A large depth can exhaust the stack even with a correct base case. The linked reference models the faulty steps with a bounded loop.",
						"",
						"[Stack Overflow practice](/courses#ap-computer-science-a-apcs15-recursion-ap-computer-science-a-apcs15-recursion-supplemental-reference-stack-overflow)"
					].join("\n"),
					mediaLink: media("apcs15-recursion-2.png")
				},
				{
					title: "Core Project: Tracing Recursion",
					content: [
						"For each call in Main, write the current argument, the next call, and what happens after that call returns. Predict the output before running the starter. Use the comments in the solution to check the trace.",
						'1. Trace f1(4) down to 1 and add the saved arguments while returning.\n2. Trace f2(3). Each call prints its argument. Even values halve, odd values triple and add one. Count transitions separately from the number of printed values. Use the supplied small examples 1, 2, and 3 for this exercise.\n3. Trace f3("fern"). Each frame prints one character after its recursive call returns. Try the empty string.\n4. Trace f4(15678). Each call reduces a nonnegative integer to its digit sum until one digit remains, then tests divisibility by three. Compare 10 and 0.',
						"Check: the sum is 10. The second trace visits 3, 10, 5, 16, 8, 4, 2, 1 and returns 7. The third prints nref. The final call follows 15678 to 27 to 9 and returns true."
					].join("\n\n"),
					projectLink:
						apStoryShuffleTraceResources["tracing-recursion"]
							.starter,
					solutionLink:
						apStoryShuffleTraceResources["tracing-recursion"]
							.reference,
					ideImport: true,
					preserveInstructions: true,
					preserveAssignment: true
				},
				{
					title: "Recursion Reference Pack",
					content: apProject({
						goal: "Trace how the position of a print statement changes recursive output.",
						steps: [
							"Open Main.java. Record the index and current word for each call on red, fern, a period, and skip.",
							"Stop tracing new calls at the period. Unwind the stack and mark which earlier call prints next.",
							"Run the starter and compare its output with the trace. For a second prediction, move the print above the recursive call and compare with the reference."
						],
						apReasoning:
							"Each call keeps its original index. The method checks the end of the array before reading the current word.",
						checks: [
							"The starter prints fern, then red. The period and skip never print.",
							"A period as the first word and an empty array both print nothing.",
							"With no period, the end of the array stops the recursion."
						]
					}),
					projectLink: apRecursionReferenceResources.starter,
					solutionLink: apRecursionReferenceResources.reference,
					ideImport: true,
					preserveInstructions: true,
					preserveAssignment: true
				}
			],
			supplementalProjects: [
				{
					title: "Project: Recursion Practice",
					content: apProject({
						goal: "Implement classic recursive methods while keeping the base case, smaller subproblem, and return path explicit.",
						steps: [
							"Run the starter and trace the supplied string-length method on the word cat. Use the README cases to check your own methods.",
							"Write the base case before the recursive case.",
							"Reduce the input in a way that reaches the base case.",
							"Return or print in the correct order for factorials, powers, Fibonacci-style sequences, and string cascades.",
							"Test the smallest valid input, a typical input, and an input near a boundary."
						],
						apReasoning:
							"Optional Java enrichment. AP CSA assesses tracing recursive methods. This project extends that skill by designing a method and checking how its base case works.",
						checks: [
							"The recursive call uses a smaller or simpler input.",
							"Return values combine correctly after the recursive call returns.",
							"The method avoids duplicate or infinite work unless the prompt intentionally explores that cost."
						],
						extension:
							"Compare a recursive solution with an iterative version and explain which state is implicit in the call stack."
					}),
					projectLink: apRecursionPracticeResources.starter,
					solutionLink: apRecursionPracticeResources.reference,
					ideImport: true,
					preserveInstructions: true,
					preserveAssignment: true,
					mediaLink: media("apcs15-project-2-recursion-practice.mp4")
				},
				{
					title: "Project: Blob Erase",
					content: apProject({
						goal: "Use recursion to erase a connected region in a 2D grid while avoiding repeated visits and out-of-bounds access.",
						steps: [
							"Run the starter and predict which filled cells disappear from the fixed grid when erasing from row 0, column 0.",
							"Represent the image as a 2D array of filled and empty cells.",
							"Reject invalid positions, empty cells, and already-erased cells as base cases.",
							"Erase or mark the current cell before exploring neighbors.",
							"Recurse up, down, left, and right to cover the connected blob."
						],
						apReasoning:
							"Optional Java enrichment. Use the required tracing skills to explain base-case order, row and column bounds, and the effect of marking a cell before exploring its neighbors.",
						checks: [
							"Starting on an empty cell changes nothing.",
							"Starting outside the grid is handled safely.",
							"A blob with branches erases completely without infinite recursion."
						],
						extension:
							"Return the number of erased cells or add diagonal connectivity, then explain how the base cases and recursive calls changed."
					}),
					projectLink: apBlobEraseResources.starter,
					solutionLink: apBlobEraseResources.reference,
					ideImport: true,
					preserveInstructions: true,
					preserveAssignment: true,
					mediaLink: media("apcs15-project-3-blob-erase.mp4")
				},
				{
					title: "Reference: Stack Overflow",
					content: apProject({
						goal: "Diagnose a recursive call that moves away from its base case.",
						steps: [
							"Read the first four inputs printed by the bounded trace. Each is the input an incorrect recursive call would receive.",
							"In `render`, return `Done` at zero. For a positive length, return one dash followed by the result for a smaller length.",
							"Run the repaired method for lengths 3, 0, and 21. The exercise accepts lengths from 0 through 20."
						],
						apReasoning:
							"An increasing input moves away from zero. Each unfinished call needs a stack frame, so recursion that fails to make progress can exhaust stack space.",
						checks: [
							"The incorrect trace is 3, 4, 5, 6. The repaired calls reach zero through 3, 2, 1, 0.",
							"Length 3 produces `---Done`. Length 0 produces `Done`. Length 21 reports `Length out of range`."
						]
					}),
					projectLink:
						apAdvancedPracticeResources["stack-overflow-reference"]
							.starter,
					solutionLink:
						apAdvancedPracticeResources["stack-overflow-reference"]
							.reference,
					ideImport: true,
					preserveInstructions: true,
					preserveAssignment: true
				}
			]
		},
		{
			title: "APCS16 Binary Search and Merge Sort",
			curriculum: [
				{
					title: "Binary Search Preconditions",
					contentKind: "reading",
					preserveInstructions: true,
					content: [
						"Binary search uses sorted data and inclusive bounds. The middle value tells which half can still contain the target. Print the bounds before each comparison to see why discarding the midpoint makes progress.",
						"",
						"```java",
						"static boolean contains(int[] data, int target, int low, int high) {",
						"    if (low > high) return false;",
						"    int mid = low + (high - low) / 2;",
						'    System.out.println(low + ".." + high + " checks " + data[mid]);',
						"    if (data[mid] == target) return true;",
						"    if (target < data[mid]) return contains(data, target, low, mid - 1);",
						"    return contains(data, target, mid + 1, high);",
						"}",
						"```",
						"",
						"In `main`:",
						"",
						"```java",
						"int[] sorted = {-6, -1, 2, 2, 5, 9, 14};",
						"System.out.println(contains(sorted, 7, 0, sorted.length - 1));",
						"```",
						"",
						"The tested values are 2, 9, and 5. The intervals are `0..6`, `4..6`, and `4..4`. The final call receives `5..4` and returns false before indexing. Repeat for 2 and for an empty array. As a counterexample to the sorted-input assumption, trace a search for 8 in `[8, 1, 5]`: the first comparison discards the half containing 8.",
						"",
						"[Binary Search practice](/courses#ap-computer-science-a-apcs16-binary-search-and-merge-sort-ap-computer-science-a-apcs16-binary-search-and-merge-sort-curriculum-core-project-binary-search)"
					].join("\n")
				},
				{
					title: "Merge Sort and Divide-and-Conquer",
					contentKind: "reading",
					preserveInstructions: true,
					content: [
						"Split `[4, 1, 3, 1]` into `[4, 1]` and `[3, 1]`. Each half splits into singletons, which are already sorted. Merging within each half gives `[1, 4]` and `[1, 3]`. The final merge below consumes those two sorted halves. Add `import java.util.Arrays;` above the class.",
						"",
						"```java",
						"int[] left = {1, 4};",
						"int[] right = {1, 3};",
						"int[] merged = new int[left.length + right.length];",
						"int l = 0;",
						"int r = 0;",
						"for (int i = 0; i < merged.length; i++) {",
						"    if (r == right.length || (l < left.length && left[l] <= right[r])) {",
						"        merged[i] = left[l++];",
						"    } else {",
						"        merged[i] = right[r++];",
						"    }",
						"    System.out.println(merged[i]);",
						"}",
						"System.out.println(Arrays.toString(merged));",
						"```",
						"",
						"The chosen elements are left 1, right 1, right 3, then left 4. When the right half is exhausted, the first condition keeps the next read on the left. After every step the output prefix is sorted and contains exactly the consumed elements. Check the same loop with an empty left half. A merge processes each value once. Across the roughly `log₂(n)` split levels, a full merge sort takes `O(n log n)` time.",
						"",
						"[Merge Step Visual practice](/courses#ap-computer-science-a-apcs16-binary-search-and-merge-sort-ap-computer-science-a-apcs16-binary-search-and-merge-sort-curriculum-merge-step-visual)"
					].join("\n")
				},
				{
					title: "Core Project: Binary Search",
					content: apProject({
						goal: "Trace binary search in the runnable Java starter and explain how the sorted-data precondition makes each range reduction valid.",
						steps: [
							"State the sorted-data precondition before using the algorithm.",
							"Trace at least one search by recording the low, high, and middle indices at each step.",
							"Trace the missing target 7, recording the midpoint value, discarded range, and first empty interval.",
							"Run Main.java to compare the predicted results for first, middle, last, missing, and empty cases."
						],
						apReasoning:
							"The AP skill is determining each step and result. In the starter data `[-6, -1, 2, 2, 5, 9, 14]`, a search for 9 begins at indices 0–6. Index 3 holds 2, so only indices 4–6 remain. Index 5 holds 9, so the method returns true. Each call narrows the inclusive interval or returns a result.",
						checks: [
							"The predicted first, middle, and last targets are found.",
							"The trace of an absent target ends when the bounds cross.",
							"The empty case finishes before reading an array element."
						],
						extension:
							"For optional Java practice, complete binaryIterative and compare it with the supplied recursive method on the same inputs."
					}),
					projectLink: apBinarySearchResources.starter,
					solutionLink: apBinarySearchResources.reference,
					ideImport: true,
					preserveInstructions: true,
					preserveAssignment: true,
					mediaLink: media("apcs16-project-1-binary-search.mp4")
				},
				{
					title: "Merge Step Visual",
					content: apProject({
						goal: "Trace the supplied Java merge helper to see how it combines two sorted arrays.",
						steps: [
							"Open and run the starter. Trace the inputs `[-3, 4, 4]` and `[-1, 2, 8]` using one index per input and one for the output.",
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
					projectLink: apMergeSortResources.starter,
					solutionLink: apMergeSortResources.reference,
					ideImport: true,
					preserveInstructions: true,
					preserveAssignment: true,
					mediaLink: media("am_10_merge.mp4")
				}
			],
			supplementalProjects: [
				{
					title: "Project: Merge Sort",
					content: apProject({
						goal: "Implement recursive merge sort and explain how splitting plus merging creates `O(n log n)` behavior.",
						steps: [
							"Run the supplied merge example first. Implement mergeSort in MergeSort.java, then call it separately in Main.java.",
							"Use an array of length zero or one as the base case.",
							"Split larger arrays into left and right halves.",
							"Recursively sort each half.",
							"Merge the two sorted halves into one sorted result."
						],
						apReasoning:
							"Optional Java enrichment. Required AP practice traces how an existing merge sort splits and combines its ranges. This project implements the algorithm and measures the work.",
						checks: [
							"Empty, single-element, duplicate-heavy, and already sorted arrays are handled.",
							"The merge helper assumes sorted inputs and preserves every element.",
							"The runtime explanation identifies both the number of levels and the work per level."
						],
						extension:
							"Track temporary-array allocation or implement an index-range version, then compare clarity and space usage."
					}),
					projectLink: apMergeSortResources.starter,
					solutionLink: apMergeSortResources.reference,
					ideImport: true,
					preserveInstructions: true,
					preserveAssignment: true,
					mediaLink: media("apcs16-project-2-merge-sort.mp4")
				},
				{
					title: "Binary Search and Merge Sort Trace and Boundary Case",
					aliases: ["Applied Challenge"],
					contentKind: "assignment",
					learningPath: "challenge",
					preserveAssignment: true,
					preserveInstructions: true,
					content: [
						"Two sorted station logs contain `[1, 4, 7]` and `[2, 4, 9]`. Merge them, choosing from the first log on a tie. Retain a mark beside each value identifying its log. Then binary-search the merged list for 4, 6, and 9. Start with inclusive bounds, take the lower middle index, and stop when the bounds cross.",
						"",
						"The merged values are `[1, 2, 4, 4, 7, 9]`. The first 4 comes from the first log. The search for 6 inspects indices 2, 4, and 3, then stops with low 4 and high 3. Searching for 4 can establish membership after one comparison. Explain which extra condition a search for the first occurrence would have to establish. Check the boundary case where both logs are empty.",
						"",
						"[Open the Binary Search project](/courses#ap-computer-science-a-apcs16-binary-search-and-merge-sort-ap-computer-science-a-apcs16-binary-search-and-merge-sort-curriculum-core-project-binary-search)"
					].join("\n")
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
							"Run Main.java. Trace how Passenger, Room, Spaceship, and Fleet form the two-ship example.",
							"Complete the add and remove methods in each class that owns a collection. Ignore null additions and report whether a removal succeeded.",
							"Compare the printed counts with the constructed objects before and after removing one passenger.",
							"Generate a small fleet with a repeatable seed and check its printed hierarchy."
						],
						apReasoning:
							"This capstone tests AP CSA Java reasoning with object ownership, collection traversal, method contracts, and string representation. The design matters as much as the final printed output.",
						checks: [
							"The fixed example starts with two ships and three passengers, including two distinct passengers named Ada.",
							"Removing the supplied Ada object succeeds once and keeps the other Ada in the room. A second removal returns false.",
							"An empty collection handles removal safely. The printed sizes match each object’s collection."
						],
						extension:
							"Add capacity limits per room or ship and explain where the validation belongs."
					}),
					projectLink: apRemainingCoreResources.spaceships.starter,
					solutionLink: apRemainingCoreResources.spaceships.reference,
					ideImport: true,
					preserveInstructions: true,
					preserveAssignment: true,
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
						goal: "Validate and apply moves to a hand of up to nine cards.",
						steps: [
							"Accept distinct slots for either a pair totaling eleven or one jack, one queen and one king. Ace is 1. Suits do not affect moves.",
							"Remove a legal selection from highest slot to lowest. Refill from the stock up to nine cards.",
							"Compile the ZIP with `javac Main.java Card.java Deck.java Elevens.java Suit.java`. Run `java Main --demo` for the fixed hand."
						],
						apReasoning:
							"Validate every slot before the first removal. A game is won when both stock and hand are empty. If cards remain and no legal selection exists, the game stops.",
						checks: [
							"In the demo, reject `4 4` without changing the hand. Use `4 5` to remove the 6 and 5, then `1 2 3` to clear the three face cards.",
							"An empty stock can leave a playable hand. A hand of three queens has no move."
						],
						extension:
							"List the legal moves for a fixed hand and compare the result with a manual trace."
					}),
					projectLink: apAdvancedPracticeResources.elevens.starter,
					solutionLink: apAdvancedPracticeResources.elevens.reference,
					ideImport: true,
					preserveInstructions: true,
					preserveAssignment: true,
					mediaLink: media("apcs17-master-project-2-elevens.mp4")
				},
				{
					title: "Master Project: Decode",
					content: apProject({
						goal: "Model towers sending and receiving letter-shifted messages in memory.",
						steps: [
							"Normalize shifts modulo 26. Move ASCII letters within their own case and copy other characters.",
							"Let a tower create a shifted message when sending and reverse the shift when receiving. Keep both earlier messages intact.",
							"Compile the ZIP with `javac Main.java Message.java Tower.java` and run `java Main`."
						],
						apReasoning:
							"Message owns the letter transform. Tower owns the shift number. The letter shift illustrates state and methods without protecting real messages.",
						checks: [
							"Key 5 sends `Az za! 2` as `Fe ef! 2`. Key 5 restores the original. Key 2 gives `Dc cd! 2`.",
							"Compare keys of -1 and 25. Verify that punctuation, emoji and other non-ASCII characters keep their original positions."
						],
						extension:
							"Keep a history of original and encoded messages. Show that receiving one leaves that history intact."
					}),
					projectLink: apAdvancedPracticeResources.decode.starter,
					solutionLink: apAdvancedPracticeResources.decode.reference,
					ideImport: true,
					preserveInstructions: true,
					preserveAssignment: true,
					mediaLink: media("apcs17-master-project-3-decode.mp4")
				},
				{
					title: "2024 FRQ and Scoring Guidelines",
					id: "ap-computer-science-a-apcs17-master-projects-and-test-prep-supplemental-2022-frq-and-scoring-guidelines",
					contentKind: "assignment",
					preserveInstructions: true,
					learningPath: "challenge",
					content: `Use Question 2, Scoreboard, in the [2024 questions](${AP_2024_FRQ}) for a timed class-design response. Follow its public member specifications. Before compiling, trace two teams named East and West. Starting with East active, record 3 points, then 0, then 2. The resulting scores are East 3 and West 2, with West active. Create a second scoreboard and confirm it has independent state. Apply the [2024 scoring guide](${AP_2024_FRQ_SCORING}) to the original response. For each missed point, identify the required behavior, revise the affected code, and replay the same calls. Use the 2026 set in this module for current-format practice.`,
					projectLink: AP_2024_FRQ,
					solutionLink: AP_2024_FRQ_SCORING
				},
				{
					title: "2020 Repo Practice Exam",
					contentKind: "reading",
					preserveInstructions: true,
					content: [
						"The 2020 repository exam predates the current framework. These two original diagnostic prompts practice skills from the legacy exercises. Type both responses, then compare the behavior with the supplied cases.",
						"",
						"**Methods and class state.** A `CodeChecker` starts with zero failures. Write the instance method `boolean record(int value)` and the required field. The input is a three-digit positive integer. Its final digit must equal the sum of its first two digits modulo 10. Increment the field exactly once per invalid value. Give a read-only method `int getFailures()`.",
						"",
						"**List traversal.** An `ArrayList<Item>` contains non-null items with methods `String getMaker()` and `int getPrice()`. Write `Item cheapestByMaker(ArrayList<Item> items, String maker)`. Return the lowest-priced matching item, keeping the first in a tie. Return `null` if there is no match. Inputs and maker fields are non-null, and the method leaves the list unchanged.",
						"",
						"**Check the responses.** Calls with 235, 453, and 987 return true, false, and true, leaving one failure. For the items Oak/9, Pine/4, Oak/6, Oak/6 in that order, searching Oak returns the first Oak/6 object. Searching Ash or using an empty list returns `null`. Use content equality for the maker and replace the best match only for a strictly lower price.",
						"",
						`For published exam practice, see the [College Board free-response archive](${AP_FRQ_ARCHIVE}).`
					].join("\n")
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
	"Practice Resources",
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
			"Trace parameters, base cases and returns for recursive methods using Strings and collections. Compare zero or empty, one-step, ordinary, and rejected inputs. Writing recursive methods is optional Java enrichment."
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
			"Check-In #1 is a placement checkpoint before Unit 1. It samples Java syntax, String method calls, numeric expressions, and short traces to guide the choice of pace.",
		"Learning Target Coverage":
			"Use selected prompts for exact output, expression type and value, String methods, and one simple branch or loop. Use a missed prediction to choose which topic to review before Unit 1."
	},
	"Check-In #2": {
		"Review Goal":
			"Check-In #2 closes Units 1 and 2 with a Methods and Control Structures response. Use the written method and its trace to check parameter use, selection, and iteration.",
		"Prompt Bank Coverage":
			"Explain method parameters and return values, trace a range with a loop, and use a remainder condition to update a counter. Record the first incorrect state or omitted requirement before revising."
	},
	"Check-In #3": {
		"Review Goal":
			"Check-In #3 closes Unit 3 Class Creation. The checkpoint verifies a complete class header, private instance variables, constructor initialization, requested methods, controlled state changes, reference reasoning, and exact compliance with a supplied specification.",
		"Prompt Bank Coverage":
			"Check the class definition, constructor, accessor, two mutators, and object state. Explain how an alias observes a change made to the same object."
	},
	"Check-In #4": {
		"Review Goal":
			"Check-In #4 checks the first Data Collections sequence: 1D arrays, rectangular 2D arrays, `ArrayList`, index shifts, mutation, traversal order, and method contracts before wrapper, recursion, searching, and sorting work continues.",
		"Prompt Bank Coverage":
			"Trace indexes after a removal and row-column order in a rectangular grid. Explain which method mutates its input and which returns a value."
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
	if (item.learningPath === "choice" || item.learningPath === "challenge")
		return item.learningPath;
	return /extension|challenge|inheritance|polymorphism|optional Java enrichment|legacy|2020|2022|next course/i.test(
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
			title: "Nested Loops and Runtime Error Reasoning"
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
			contentKind: "reading",
			preserveInstructions: true,
			content:
				"Use the official College Board archive with year labels and scope checks. The 2026 released FRQs align to the revised exam; older questions can still provide useful method, class, array, or list practice but do not completely align with the current framework. Record year, FRQ family, rubric row, lost behavior, and targeted correction.",
			projectLink: AP_FRQ_ARCHIVE
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
			contentKind: "reading",
			preserveInstructions: true,
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
			preserveInstructions: true,
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
			preserveInstructions: true,
			preserveAssignment: true,
			contentKind: "assignment",
			content: [
				"Write a public Java class named `SupplyBin` without compiler feedback first. Store the fixed capacity and current quantity in private instance fields. Each bin keeps its own state.",
				"",
				"| Public member | Required behavior |",
				"| --- | --- |",
				"| `SupplyBin(int capacity, int quantity)` | Set the capacity and starting quantity. Assume capacity is positive and quantity is between zero and capacity, inclusive. |",
				"| `int getQuantity()` | Return the current quantity. |",
				"| `boolean add(int amount)` | Add a positive amount if it fits in the remaining space. Return true on success. Otherwise return false and preserve the quantity. |",
				"| `boolean take(int amount)` | Remove a positive amount if it is available. Return true on success. Otherwise return false and preserve the quantity. |",
				"",
				"**Check the response.** Starting at 2 in a bin with capacity 5, adding 3 succeeds, adding 1 fails, and taking 4 succeeds. The final quantity is 1. Trace zero, an exact withdrawal, and an oversized request. Check that two independently created bins can hold different quantities.",
				"",
				"Score the field declarations, constructor, accessor, and each mutator separately against the table. Then open [Check-In #3 practice](/courses#ap-computer-science-a-check-in-3-ap-computer-science-a-check-in-3-curriculum-core-check-in-prompt-bank) to run the response and compare it with the reference."
			].join("\n"),
			learningPath: "core"
		});
	}

	if (module.title === "APCS9 Software Development Lifecycle") {
		curriculum.push(
			{
				title: "Unit 4 Text-File Input Contract",
				content: [
					"Read the observations in `gates.txt` and report how many are open. Each observation is one lowercase word, `open` or `closed`. Spaces and line breaks separate observations. An empty file is valid. Any other word invalidates the entire log.",
					"Open the starter and inspect `Main.java`. A File names the path. Constructing a Scanner opens it for reading. In `GateLog.countOpen`, `hasNext()` checks whether a token remains and `next()` consumes it. Complete the counter update. Main closes the scanner after the method returns, including when it returns -1 for an invalid token.",
					"Download and extract the ZIP. From the folder containing `gates.txt`, run `javac Main.java GateLog.java` and then `java Main`. The supplied file gives `Open: 3` in the completed program. An empty file or a single `closed` gives `Open: 0`. For `open unknown open`, expect `Invalid observation.`",
					"Temporarily rename the file. The program cannot open it and propagates an IOException before it starts counting. Restore its name and explain why an empty file produces a result."
				].join("\n\n"),
				projectLink: apTextFileInputResources.starter,
				solutionLink: apTextFileInputResources.reference,
				datasetLink: AP_CSA_CED,
				ideImport: true,
				preserveInstructions: true,
				preserveAssignment: true,
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
			contentKind: "assignment",
			preserveAssignment: true,
			preserveInstructions: true,
			content: [
				"Write both method bodies before opening the runnable [Check-In #4 practice](/courses#ap-computer-science-a-check-in-4-ap-computer-science-a-check-in-4-curriculum-core-check-in-prompt-bank).",
				"",
				'**ArrayList response.** Implement `public static void removeShortLabels(ArrayList<String> labels, int minimumLength)`. The list and its elements are non-null. Remove every string shorter than the minimum in place and preserve the order of the remaining strings. For the list `["desk", "ox", "i", "shelf"]` and a minimum of 3, the caller must see `["desk", "shelf"]`. Trace what happens to the index of the next entry after a removal. Test an empty list and a label exactly as long as the minimum.',
				"",
				"**2D-array response.** Implement `public static int countPositive(int[][] grid)` for a rectangular grid. Return the number of entries strictly greater than zero and preserve every entry. For `{{0, 3, -1}, {2, -3, 5}}`, the result is 3. Trace which coordinates contribute. Check an empty grid, a zero-width row, and a one-cell grid.",
				"",
				"Score the first response for removal, adjacency, and order. Score the second for row and column bounds, the positive-value condition, and the returned count. Run both on the same inputs to compare the observations with the predictions."
			].join("\n"),
			learningPath: "core"
		});
	}

	if (module.title === "APCS17 Master Projects and Test Prep") {
		curriculum = insertApCsaItem(curriculum, "Past FRQ Archive", {
			title: "2026 Released FRQ Set",
			contentKind: "assignment",
			preserveInstructions: true,
			content:
				"Use the linked 2026 free-response questions. For each part, copy the required method or class header, identify what the caller supplies, and write the response without compiler feedback. Use the Java Quick Reference from the setup module. Trace one ordinary input and one boundary input through the completed response. Record the expected return value, any change to an object or collection, and the line responsible for that change. Save the original response and compare it with the [2026 scoring guide](https://apcentral.collegeboard.org/media/pdf/ap26-sg-computer-science-a.pdf). Mark the first place it misses a requirement, revise that part, and repeat the same two traces.",
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
