import type { RawCourseModule, RawCourseModuleItem } from "./types";
import {
	javaPackageReviewProjects,
	javaPackageReviewURL
} from "@/modules/javaSearchResources";

const [gradebook, parser, shipping] = javaPackageReviewProjects;

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
	item: (typeof javaPackageReviewProjects)[number],
	title: string,
	content: string
): RawCourseModuleItem {
	return {
		id: item.id,
		title,
		content: `${content}

Open the starter in the site IDE and confirm the import. Save and extract the ZIP, keeping the src directory intact. From the folder containing sources.txt, run javac --release 21 -Xlint:all -Werror -d out @sources.txt. Run the tests with java -cp out checks.ContractTests and the demonstration with java -cp out runner.Main.`,
		contentKind: "assignment",
		ideImport: true,
		preserveInstructions: true,
		preserveAssignment: true,
		projectLink: javaPackageReviewURL(item.pack, "starter"),
		solutionLink: javaPackageReviewURL(item.pack, "solution")
	};
}

export function buildJavaPackageReviewModule(): RawCourseModule {
	return {
		title: "AJ19 Post-C++ Java Tooling, Testing, and Packages",
		curriculum: [
			reading(
				"Positioning the Advanced Java Track",
				`Start this optional sequence after building a program with several collaborating classes. The gradebook uses typed records and a service. The parser accepts a complete command as text and returns a typed value. Their tests can call the application logic without supplying console input.

For a fictional gradebook, a test calls submit with an unknown assignment and checks that the recorded mean stays unchanged. The runner is free to show the same behavior through a message. Classify the validation and output steps by which component owns them.`
			),
			reading(
				"Packages, Builds, and Test Boundaries",
				`A class declared in package gradebook belongs under src/gradebook. Place console code in src/runner and the test harness in src/checks. Import gradebook.Gradebook into both callers. This makes the direction of the dependencies visible.

The supplied sources.txt lists the three source paths. The -d out option puts compiled classes in package directories below out. The -cp out option tells java where to find them. Invoke checks.ContractTests for the checks and runner.Main for the sample. When a check fails, read its expected and actual values before changing the service.`
			),
			project(
				gradebook,
				"AJ19 Project 1: Tested Gradebook Service",
				`Implement submit and mean in Gradebook. Check that the fictional student and assignment exist and the submitted number is finite and between 0 and 100. A later score updates the same student and assignment. A rejected update leaves the previous score intact. Weight only submitted scores and return an empty mean for a student with no scores.

A practice score of 80 at weight one and a project score of 90 at weight three give (80 + 270) / 4 = 87.50, a B. Add a case for a student with one score and another for a rejected update. Keep input and output in the runner.`
			),
			project(
				parser,
				"AJ19 Project 2: Command Parser Test Harness",
				`Implement Parser.parse. Strip the line, split on whitespace and compare the command verb without case differences. ADD needs a one-word item and a positive int count, while PRINT and QUIT take no additional arguments. Return the supplied command record. Reject extra words, unknown verbs and invalid numbers with IllegalArgumentException.

The line add followed by pencils and 3 produces Add[item=pencils, count=3]. PRINT produces Print[]. Test an empty line, an out-of-range count and an extra word. Call the parser in the tests without starting the runner.`
			)
		],
		supplementalProjects: [
			project(
				shipping,
				"AJ19 Project 3: Characterization Test Bug Fix",
				`The price policy charges 250 cents below a subtotal of 5,000 cents and gives free shipping at 5,000 cents or above. The starter places the cutoff one cent too high. Before editing, run java -cp out checks.ContractTests characterize to capture the old 250-cent result at the cutoff. Then run the default tests to reproduce the failed requirement.

Make the comparison inclusive and rerun the default tests. At 4,999 cents the charge stays 250 cents. At 5,000 and 5,001 cents it becomes zero. Negative input remains invalid. Save the before and after results.`
			)
		]
	};
}
