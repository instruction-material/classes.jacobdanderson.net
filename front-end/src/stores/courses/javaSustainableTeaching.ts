import type { RawCourseModule, RawCourseModuleItem } from "./types";
import {
	javaSustainableModuleID,
	javaSustainableProjects,
	javaSustainableURL
} from "@/modules/javaSearchResources";

function workflow(sources = "Main.java ContractTests.java") {
	return `Open the starter in the site IDE and confirm the import. **Run** shows the Java 21 commands. Save the attempt, download its ZIP and open a terminal in the extracted project folder.

\`\`\`sh
javac --release 21 -Xlint:all -Werror ${sources}
java ContractTests
java Main
\`\`\`

The untouched starter compiles and identifies an unfinished method when checked. Build each project in its own folder.`;
}

type Pack = Parameters<typeof javaSustainableURL>[0];

function reading(
	title: string,
	content: string,
	identity?: Pick<RawCourseModuleItem, "id" | "aliases">
): RawCourseModuleItem {
	return {
		...identity,
		title,
		content,
		contentKind: "reading",
		preserveInstructions: true,
		preserveAssignment: true
	};
}

function assignment(
	title: string,
	pack: Pack,
	content: string
): RawCourseModuleItem {
	return {
		title,
		content,
		contentKind: "assignment",
		preserveInstructions: true,
		preserveAssignment: true,
		ideImport: true,
		projectLink: javaSustainableURL(pack, "starter"),
		solutionLink: javaSustainableURL(pack, "solution")
	};
}

export function buildJavaSustainableProgrammingModule(): RawCourseModule {
	const [bakery, nodes, exceptions, stock, readings] =
		javaSustainableProjects;
	return {
		id: javaSustainableModuleID,
		title: "AJ10 Sustainable Programming",
		curriculum: [
			reading(
				"Nested Classes",
				`A class nested inside another class can keep a supporting type near its owner. A static nested class has no enclosing instance. Create a product with new Bakery.Product(...) when the product's name, ingredients and batch size contain all of its information. Nested records are implicitly static.

An inner class has an enclosing instance. A worker created inside the bakery can use Bakery.this.name when formatting a badge. When the bakery name is “Harbor Bakery” and Alex is a baker, the badge reads Alex | Baker | Harbor Bakery. Each worker still owns its own name, role and hourly pay.

Collecting the input belongs in the console driver. Keep one Scanner while reading a worker and then a product. Two scanners on the same stream can buffer each other's input. The model stores and validates the resulting values. List.copyOf prevents a caller from changing the product by mutating the original ingredient list.`,
				{
					id: `${javaSustainableModuleID}-curriculum-sustainable-programming-core-concepts`,
					aliases: [
						"core-concepts",
						`${javaSustainableModuleID}-curriculum-core-concepts`,
						`${javaSustainableModuleID}-curriculum-core-concepts-and-learning-sequence`
					]
				}
			),
			{
				...assignment(
					"AJ10 Project 1: Bakery Model",
					bakery.pack,
					`Read the fields from one Scanner and build a Bakery. The worker badge uses the worker's own name and role and the enclosing bakery's name. Use the given Product record for the product and keep its ingredients in a copied list. Hourly pay is an integer count of cents. Batch size is a positive integer.

${workflow("*.java")}

**Checkpoints:** The sample prints Alex | Baker | Harbor Bakery and Scone (Lemon) | flour, lemon. Try java Main input with the fields in README.md. Verify that modifying an ingredient list after making a product cannot change that product. Explain why a product can be created without a bakery while a worker belongs to one.`
				),
				aliases: ["AJ10 Project 1: Juni Bakery"]
			},
			reading(
				"Generics",
				`A type parameter makes a reusable class while keeping its methods type-checked. A Node<String> accepts and returns strings. A Node<Integer> accepts and returns integers through the same class definition. For example, a string node can append a suffix to node.get() because the returned type is String.

To store nodes with different value types, create a Node<?>[] array. The wildcard represents each node's unknown value type when the array is read. Reading a value through a wildcard yields Object. Writing an arbitrary string through it is unsafe because that slot could be an integer node. A separately typed reference still supports its own set operation.

Trace the types of a Node<Character> holding C and a Node<String> holding hello. Place both in the same wildcard array. Then explain why using raw Node would lose compile-time type checks and why String.valueOf prints the text null for a missing value.`
			),
			assignment(
				"AJ10 Project 2: Anything Array",
				nodes.pack,
				`Implement typed get and set in Node<T>. Create one mixed Node<?>[] containing character, string, boolean, integer and decimal nodes. Build and update the character and string nodes through their concrete types before putting them in the wildcard array. Keep type checking enabled and avoid casts or raw Node declarations.

${workflow()}

**Checkpoints:** The console prints C, hello world, true, 100 and 3.1415 on separate lines. Check a typed update and a null value. Explain why the array can hold nodes with different type parameters even though every element is a node.`
			),
			reading(
				"Exception Handling",
				`Handle expected failures where the program can decide what to do next. A method that reads a local file can declare throws IOException and let its caller report a problem. Integer.parseInt throws NumberFormatException on invalid or out-of-range input. Use a separate handler for each operation so the message describes the actual failure.

Validate optional text before accessing it. A null or empty word has no first letter. An explicit check can return false without catching NullPointerException. Catching broad runtime exceptions can also hide faults in unrelated logic.

The division method declares a custom checked exception for zero. Cast a numerator to double before dividing two integers. Thus 5 ÷ 2 produces 2.5. Dividing as integers and then assigning the result to a double has already lost the fractional part. Test both outcomes and identify the condition that selects the exception.`
			),
			assignment(
				"AJ10 Project 3: Exception Practice",
				exceptions.pack,
				`Implement signed integer parsing, first-vowel detection, UTF-8 word counting and fractional division. Reject missing or invalid integer text with NumberFormatException. Return false for a null or empty word. Let the file read signal IOException. Throw the supplied DivideByZeroException for zero denominators.

${workflow()}

**Checkpoints:** Keep sample.txt with the Java files. The default quotient is 2.5 and the file has three words. Run java Main bad 2 missing-course-file.txt and java Main 5 0 to see the separate input, file and division messages. Check uppercase Apple and an empty word. Explain which caller handles each exception.`
			)
		],
		supplementalProjects: [
			assignment(
				"Sustainable Programming: Extension Challenge",
				bakery.pack,
				`Reopen the saved bakery workspace. Implement batchesFor in the Product record. Reject a negative order. Divide the requested quantity by the positive batch size and add one if a remainder remains. Keep all calculations in integers and handle the largest int without overflowing through a pre-addition.

Compile the saved Java files, then run java ContractTests batches and java Main batches. A six-item batch supplies three example orders of 0, 6 and 10 in zero, one and two batches respectively. Add one exact multiple and one nonmultiple. Explain why this calculation belongs to Product and uses no bakery or worker state.`
			),
			assignment(
				"Refactoring Transfer Practice",
				stock.pack,
				`Implement a parser for one inventory line containing a name and a nonnegative integer amount separated by one vertical bar. Trim surrounding whitespace, then return a Stock record. Reject missing or repeated separators, an empty name and an invalid amount with a useful IllegalArgumentException. Keep the parser independent of display or input collection.

${workflow()}

**Checkpoints:** flour | 12 produces a record containing flour and 12. Verify lemon | 0, then reject flour | −1, a missing field and a second separator. Show where validation lives so a second caller can reuse it without copying rules.`
			),
			assignment(
				"Maintainability Extension Practice",
				readings.pack,
				`Process a batch of independent temperature readings. The given read method accepts finite values in the inclusive range −40 through 60. Call it once for each line. Preserve the order of successful values and collect one-based line numbers for failures. Continue after a bad line and return both lists as one report.

${workflow()}

**Checkpoints:** For 12.5, bad, NaN, −40, 61, 60, expect [12.5, −40.0, 60.0] and lines [2, 3, 5]. Check missing values, infinity and an empty batch. Explain what is validated once and what the per-line handler does.`
			)
		]
	};
}
