const pythonLevel1ListsSource =
	"https://github.com/instruction-material/Python-Level-1/tree/9f59ba25f59177e7cf5b2f106c4526341719d3fc";

const listProjects = [
	{
		title: "GrS12 Project 1: List Exploration",
		folder: "GrS12-List-Exploration",
		individual: `Open the starter in Turtle mode. The empty list named colors is ready to fill.

1. Use append to add red, yellow, purple, pink and green in that order.
2. Use for color in colors to set the pen color and move forward 10 steps for each item.
3. Use if "purple" in colors to write yes on the canvas. Write no in the other branch.

**Checkpoints:** The first run draws five segments in the listed order and writes yes. Remove purple and rerun to get four segments and no. With an empty list, explain why the loop draws no segments but the membership check still runs.`,
		classroom: `Run the prepared code first. It draws a segment for each item in colors and writes yes because purple is present.

**Normal:** In \`normal_addition()\`, print the number of colors and the result of checking whether purple is in colors. The unchanged list gives 5 and True.

**Hard:** In \`hard_addition()\`, make a new list of colors from the original list that have at least five letters. Print the filtered list, then print the original again. Expect ["yellow", "purple", "green"] and an unchanged original.

**Checkpoints:** The original drawing still has five segments. Check that adding or filtering a list changes only the result of the matching section.`
	},
	{
		title: "GrS12 Project 2: Which Way Turtles",
		folder: "GrS12-Which-Way-Turtles",
		individual: `Open the starter in Turtle mode. Build one list of Turtle objects and use it in a second loop.

1. Repeat racer_count times. Create a new Turtle, give it the turtle shape and append it to racers.
2. Loop over racers. Use a fixed 90-degree turn for the first check and move that turtle forward 200 steps.
3. Replace the fixed turn with a random integer from 0 to 360. Choose each of the three color components from 0 to 255. The starter sets the Turtle color mode for those values.

**Checkpoints:** Start with one turtle and expect one 200-step path. With ten turtles, expect ten paths, even when two overlap. Set the count to zero and confirm that neither loop tries to use a turtle.`,
		classroom: `Run the prepared ten-turtle scene. Identify the loop that creates the list and the loop that moves each turtle.

**Normal:** In \`normal_addition()\`, print the length of turtles. Then loop over the list and print each turtle's x- and y-coordinates. Expect ten position reports, even if two paths overlap.

**Hard:** In \`hard_addition()\`, count how many turtles finished above y = 0. Start a count at zero and update it only when ycor() is positive. Print the count.

**Checkpoints:** The count is between zero and ten. All ten original paths still appear, and a turtle at y = 0 does not contribute to the count.`
	},
	{
		title: "GrS12 Project 3: Random Number Lists",
		folder: "GrS12-Random-Number-Lists",
		individual: `Open the starter in Turtle mode. The write_row helper places each number on the canvas, with space between values.

1. Begin with numbers = [0, 4, 10] and pass it to write_row at y = 0.
2. Loop over the original values and append each value plus 10 to a second list. Display that list at y = -30.
3. Make a third list by multiplying each second-row value by 10. Display it at y = -60.
4. When the fixed case works, fill numbers with 15 random integers from 0 to 10.

**Checkpoints:** The fixed rows are [0, 4, 10], [10, 14, 20] and [100, 140, 200]. The random run has 15 entries in each row and the same relationship between rows. The first list remains intact.`,
		classroom: `Run the prepared program first. It shows a row of original values, a row with 10 added and a row with the second row multiplied by 10. The original list is named l.

**Normal:** In \`normal_addition()\`, use a loop to count values equal to zero. Print the count and the length of the list. The length is 15, while the count of zeros may change on each run.

**Hard:** In \`hard_addition()\`, use a short fixed list [0, 4, 10] to build and print a new list with 10 added to every value. Show both lists.

**Checkpoints:** The changed list is [10, 14, 20] and the fixed original remains [0, 4, 10]. Confirm that the three original rows still appear.`
	}
];

export const pythonLevel1ListProjects = listProjects.map(project => ({
	title: project.title,
	content: project.individual,
	contentKind: "assignment" as const,
	preserveInstructions: true,
	projectLink: `${pythonLevel1ListsSource}/${project.folder}/starter`,
	solutionLink: `${pythonLevel1ListsSource}/${project.folder}/solution`
}));

export function pythonLevel1ClassroomListContent(title: string) {
	if (title === "Lists: Order, Indexes and Membership") {
		return `In the classroom frameworks, a list already holds colors, turtles or numbers. Run the original scene and identify the list that controls it. Use a second list to collect selected values when the first scene needs its original data.

\`\`\`python
headings = [0, 90, 180, 270]
later_headings = []
for angle in headings:
    if angle >= 180:
        later_headings.append(angle)

print(later_headings)
print(headings)
\`\`\`

The output is [180, 270] followed by [0, 90, 180, 270]. The 180-degree heading is included because the comparison uses greater-than-or-equal. Try an empty starting list and predict both output lines. In a project review, identify which list a drawing loop reads before comparing the original run with a Normal or Hard change.

[Python list method reference](https://www.w3schools.com/python/python_ref_list.asp)`;
	}
	return listProjects.find(project => project.title === title)?.classroom;
}
