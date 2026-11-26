import type { RawCourseModule, RawCourseModuleItem } from "./types";
import {
	javaReviewProjects,
	javaReviewURL
} from "@/modules/javaSearchResources";

const compile =
	"Open the starter in the site IDE and confirm the import. Save and extract the project ZIP. From its folder, compile with javac --release 21 -Xlint:all -Werror Main.java ContractTests.java and run java ContractTests. Run java Main for the sample.";

const assignments = new Map([
	[
		"AJ1 Project 1: Mad Libs",
		{
			pack: javaReviewProjects[0].pack,
			content:
				"Read an animal, a verb, an adjective, and a noun as four complete lines. Insert the values into the supplied sentence pattern. Keep interior spaces and trim the ends of each input.\n\nUse red fox, dance, curious and a lantern on four separate lines. The sentence is “A curious red fox likes to dance with a lantern.” Try an animal name that contains a space."
		}
	],
	[
		"AJ1 Project 2: Chat Bot",
		{
			pack: javaReviewProjects[1].pack,
			content:
				"Read a name and a favorite activity on two lines. Normalize the activity with strip and Locale.ROOT lowercase. Recognize reading and drawing, and give a fallback for other activities.\n\nEnter Mira and DRAWING on separate lines. The bot prints “Hello, Mira! Try sketching a tree.” Check reading and an unrecognized favorite activity."
		}
	],
	[
		"AJ2 Project 1: Array Practice",
		{
			pack: javaReviewProjects[2].pack,
			content:
				"Double each input value in a new array of long values. Sum evens, generate seeded random doubles in [15, 100), and total Java String lengths. Preserve the input arrays.\n\nWith [3, -2, 5], doubling gives [6, -4, 10]. For [3, -2, 4], the even sum is 2. The total length of oak and elm is 6. Check that two Random objects initialized with the same seed return the same sample."
		}
	],
	[
		"AJ2 Project 2: Two-Dimensional Array Practice",
		{
			pack: javaReviewProjects[3].pack,
			content:
				"Build a grid containing row index plus column index, then find the largest value in a possibly ragged grid. Return OptionalInt.empty for a grid with no values. Negative values are legal. Search for a target by row, and create a seeded rectangular grid of doubles in [0, 10).\n\nThe 2-by-3 grid is [[0, 1, 2], [1, 2, 3]]. Traverse each row using its actual length. In a second grid with an empty row and values -5, -3 and -9, the maximum is -3. Trace a target in the last cell and a target that is absent."
		}
	],
	[
		"AJ2 Project 3: ArrayList Practice",
		{
			pack: javaReviewProjects[4].pack,
			content:
				"Build a different ArrayList containing the even values in encounter order. Keep zero, negative evens, and duplicate evens. Keep the input list unchanged when filtering and searching. Find a zero-sum pair of distinct positions. Provide two mutating methods that remove the first minimum and append the checked sum.\n\nFor [5, 2, -4, 2, 7], filtering gives [2, -4, 2]. Two zeros occupy distinct positions and make a valid pair. From [2, -4, 3, -4], removing the first minimum gives [2, 3, -4]. Appending the sum gives [2, 3, -4, 1]."
		}
	],
	[
		"AJ2 Supplemental Project 1: Test Scores",
		{
			pack: javaReviewProjects[5].pack,
			content:
				"Average scores from 0 to 100 using floating-point division. An empty record has no mean. Classify the unrounded mean at the 90, 80, 70, and 60 cutoffs.\n\nFor scores 89 and 90, the mean is 89.5 and the unrounded grade is B. A mean of exactly 90 is A. Check an empty record and an invalid score of 101."
		}
	],
	[
		"AJ2 Supplemental Project 2: Matrix Addition",
		{
			pack: javaReviewProjects[6].pack,
			content:
				"Add corresponding cells into a new matrix. Both inputs must be rectangular and have the same shape. Reject cells whose sum cannot fit in int.\n\nAdding [[1, 2], [3, 4]] and [[4, 3], [2, 1]] gives [[5, 5], [5, 5]]. Verify one cell by hand. Check mismatched row widths and overflow. Confirm that neither input changes when a cell in the result is updated."
		}
	],
	[
		"AJ2 Supplemental Project 3: Sandwich Orders",
		{
			pack: javaReviewProjects[7].pack,
			content:
				"Pair menu names with yes or no answers. Keep the accepted ingredients in menu order and return an abbreviation of their first letters. Trim and compare answers without case differences.\n\nFor lettuce, onion and cheese with answers yes, NO and yes, the abbreviation is lc. Check that all no answers give an empty result and that an unfamiliar answer is rejected."
		}
	],
	[
		"AJ3 Project 1: Student Class",
		{
			pack: javaReviewProjects[8].pack,
			content:
				"Validate a positive student ID and a nonblank display name in the constructor. Store private state and track how many valid objects were created. The attendance flag can be changed independently on each object.\n\nCreate Cedar with ID 7 and Rowan with ID 9. Mark Cedar present, check that Rowan remains absent, and verify that the shared count is 2. Reject an empty name and an ID of zero."
		}
	],
	[
		"AJ3 Project 2: BakedGood Class",
		{
			pack: javaReviewProjects[9].pack,
			content:
				"Represent shared baked-good data with an abstract class. Implement Bread.priceCents using the size enum. Small, medium and large loaves cost 250, 350 and 450 cents. Sort by ingredient count.\n\nA medium loaf costs 350 cents. Compare a loaf with two ingredients to a loaf with one. Change the original ingredient list after creating a loaf and verify that the loaf keeps its original count."
		}
	],
	[
		"Java Syntax Transfer Practice",
		{
			pack: javaReviewProjects[10].pack,
			content:
				"Compute a fare of two base tokens plus three per zone. Zero zones still cost two tokens. Reject a negative zone count and return a long.\n\nFour zones cost 2 + 3 × 4 = 14 tokens. Test zero zones, a negative count and Integer.MAX_VALUE to check the chosen numeric type. Predict which operation needs a long operand before it runs."
		}
	],
	[
		"Console Input Extension Practice",
		{
			pack: javaReviewProjects[11].pack,
			content:
				"Read complete lines until a trimmed nonnegative int appears. Accept zero. Reject malformed, negative, and out-of-range lines. Return an empty result when the text ends.\n\nThe lines bad, -3, 7 and 8 produce 7 and leave 8 unread. Check that zero is a valid result and that end of input after invalid lines gives an empty result."
		}
	],
	[
		"Object Model Transfer Practice",
		{
			pack: javaReviewProjects[12].pack,
			content:
				"Model one library copy with a positive or zero stock count. A successful checkout consumes one copy. Return false on an empty shelf and preserve a nonnegative count.\n\nA shelf with one copy gives true for the first checkout and false for the second. The remaining stock is zero. Keep the count private and check the state after each call."
		}
	],
	[
		"Inheritance Extension Practice",
		{
			pack: javaReviewProjects[13].pack,
			content:
				"Use an abstract Parcel with a weight in whole units. A standard parcel costs 100 cents plus 25 per unit. An express parcel has the same base and costs 50 per unit. Reject negative weight.\n\nAt weight two, standard delivery costs 150 cents and express delivery costs 200 cents. Call both through the Parcel type. Check a zero-weight parcel and an invalid weight of -1."
		}
	]
]);

const extensions = new Map([
	[
		"Review: Variables, Strings, and Input: Extension Challenge",
		{
			pack: javaReviewProjects[0].pack,
			content:
				"Reopen the Mad Lib workbook. Implement headline by trimming the adjective and animal, joining them with a space, converting the result to uppercase with Locale.ROOT, and adding ADVENTURE. For curious and red fox, expect CURIOUS RED FOX ADVENTURE. Run java ContractTests headline and then java Main headline with the original four input lines. Use an animal name with two words and an adjective with leading space. The headline should keep the interior space, remove the outer space, and leave the original story sentence unchanged. Compare the story and headline formatting from the same saved run."
		}
	],
	[
		"Review: Objects and Classes: Extension Challenge",
		{
			pack: javaReviewProjects[8].pack,
			content:
				"Reopen the Student Class workbook. Count how many Student objects are currently marked present. Each instance has its own flag, and the static count of students created answers a separate question. Cedar present and Rowan absent gives 1. Try an empty list and a list with two present students. Run java ContractTests attendance and java Main attendance. Start with two absent students, then change each flag in turn and trace the attendance count from zero to two. After the checks pass, compare the reference's placement of constructor validation with the saved implementation. Explain how each approach keeps the shared count accurate."
		}
	]
]);

const workedExamples: Record<string, string> = {
	"Variables, Primitive Data Types, and Strings":
		"In the console, 7 / 2 evaluates to 3 with int operands. 7.0 / 2 gives 3.5. For typed words, String.strip removes space at the ends and keeps the two words in red fox. Compare their content using equals.",
	"Input, Output, and Commenting":
		"Read a full line with nextLine when spaces belong to the input. Check hasNextLine first. To accept a number on a line, strip it and use Integer.parseInt. For the two lines bad and 7, parsing the first line raises NumberFormatException and parsing the second returns 7.",
	Arrays: "An array [4, 6, 8] has length 3 and index 2 holds 8. Copy into a new array when a transformation must preserve its input. Trace an empty array and a one-element array through a loop with index < length.",
	"Two-Dimensional Arrays":
		"For [[2, 4, 6], [8, 10, 12]], grid[1][2] is 12. The outer loop uses grid.length and the inner loop uses grid[row].length. The same bounds visit all values of [[2], [], [8, 10]] without accessing the empty row.",
	ArrayLists:
		"If a list starts as [2, 5, 7], removing index 1 leaves [2, 7]. The 7 moves from index 2 to index 1. A filter can append accepted values to a new list while leaving the input intact.",
	Constructors:
		"Construct a fictional Student with a name and a positive ID. Validate the inputs before assigning fields and increasing any count shared by the class.",
	"Static Variables and Methods":
		"Cedar and Rowan share the number of Student objects created, but each object has its own attendance flag. Mark Cedar present and trace which value changes and which values stay the same.",
	"Inheritance and Subclasses":
		"A Bread constructor calls super to store the shared name and ingredients, then stores its Size. A ForSale variable can hold the resulting Bread and call priceCents through the interface."
};

function completeItem(item: RawCourseModuleItem): RawCourseModuleItem {
	const extension = extensions.get(item.title);
	const project = assignments.get(item.title);
	const task = extension ?? project;
	if (!task) {
		const example = workedExamples[item.title];
		return example
			? {
					...item,
					content: `${item.content}\n\n**Worked example** ${example}`
				}
			: item;
	}
	return {
		...item,
		content: extension ? task.content : `${task.content}\n\n${compile}`,
		contentKind: "assignment",
		preserveInstructions: true,
		preserveAssignment: true,
		ideImport: true,
		projectLink: javaReviewURL(task.pack, "starter"),
		solutionLink: javaReviewURL(task.pack, "solution")
	};
}

export function completeJavaFoundationReview(
	module: RawCourseModule
): RawCourseModule {
	if (!/^AJ[123] Review: /.test(module.title)) return module;
	return {
		...module,
		curriculum: module.curriculum.map(completeItem),
		supplementalProjects: module.supplementalProjects.map(completeItem)
	};
}
