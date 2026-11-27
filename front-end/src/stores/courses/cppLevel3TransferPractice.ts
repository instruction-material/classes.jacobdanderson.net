import type { RawCourseModuleItem } from "./types";

const source =
	"https://github.com/instruction-material/CPP-Level-3/tree/5695d18a91ab249b7db4003df49cd4dc47d8c480";

function practice(
	title: string,
	folder: string,
	content: string
): RawCourseModuleItem {
	return {
		title,
		aliases: ["Applied Challenge"],
		content,
		contentKind: "assignment",
		preserveInstructions: true,
		ideImport: true,
		projectLink: `${source}/${folder}/starter`,
		solutionLink: `${source}/${folder}/solution`
	};
}

export const cppLevel3TransferPractice = {
	build: practice(
		"Bridge Course Setup and Positioning Transfer Practice",
		"CPPI0-Build-and-Debug-Checkpoint",
		`**Goal:** Check that a change to a shared header rebuilds both programs.

**Work:** Use a copy of the completed Build and Debug Checkpoint. The linked starter provides the original project files if needed. Build it with \`make checkpoint checkpoint-debug\`. Run \`make -n checkpoint checkpoint-debug\` and predict whether it will print a compiler invocation. Next run \`make -n -W score_ledger.h checkpoint checkpoint-debug\`. The \`-n\` option prints commands without executing them. The \`-W\` option tells Make to treat the named file as newly modified.

**Checks:** In the first dry run, neither target needs a compiler invocation. In the second, expect one compiler command for each executable. Identify which command includes \`-g -O0\`, then explain what could happen if a header used by both builds were missing from one prerequisite list. Keep the two dry runs and the explanation.`
	),
	maze: practice(
		"Recursion and the Call Stack Trace and Boundary Case",
		"CPPI2-Recursive-Maze-Search",
		`**Goal:** Trace the effect of blocking the sole route in a non-square maze.

**Work:** Use the completed Maze Search. In a native terminal, run \`make maze-search\`, then feed this input to \`./maze-search --trace\`:

\`\`\`text
2 3
S#E
...
\`\`\`

Repeat with \`.#.\` as the second grid row. Before each run, mark the legal neighboring cells in up, right, down, left order. Label coordinates \`row column\` starting at zero.

**Checks:** The first search prints \`Path 5\` and visits the path \`0 0\`, \`1 0\`, \`1 1\`, \`1 2\`, \`0 2\`. The second prints \`No path\` with status 0. Identify where the second search backtracks and why this valid maze has a different result from an input-validation failure.`
	),
	inventory: practice(
		"STL Containers, Iterators, and Algorithms Trace and Boundary Case",
		"CPPI3-Inventory-Indexer",
		`**Goal:** Verify that a category merge preserves row order and keeps duplicate names visible.

**Work:** In a copy of the completed Inventory Indexer, use the demonstration in \`main.cpp\` to add these rows in order. Each row has ID, name, category and quantity.

| ID | Name | Category | Quantity |
| --- | --- | --- | --- |
| 7 | beta | tools | 3 |
| 2 | alpha | tools | 1 |
| 9 | alpha | lab | 2 |

Predict the lab selection before and after renaming \`tools\` to \`lab\`. Project the names from the merged view and print the category set. Compile with \`c++ -std=c++20 -Wall -Wextra -Wpedantic -Werror main.cpp -o inventory\` and run \`./inventory\`.

**Checks:** Before the rename, lab contains only ID 9. The merged lab contains IDs 7, 2 and 9 in that order. Its sorted name projection is \`alpha alpha beta\`. The category set contains only \`lab\`, and selecting \`tools\` gives an empty result. Explain why sorting the projection leaves inventory order intact.`
	),
	files: practice(
		"RAII, Smart Pointers, and Robust Error Handling Transfer Practice",
		"CPPI4-Resource-Safe-File-Processor",
		`**Goal:** Verify that different valid line endings produce identical report bytes.

**Work:** Use the completed File Processor in a practice directory. Build with \`make main\`. Use these commands to create two test files with the same records. The second uses CRLF between lines and ends without a final newline.

\`\`\`sh
printf 'CPPI4_SCORES_V1\\nAda\\t60\\nLin\\t59\\n' > lf.tsv
printf 'CPPI4_SCORES_V1\\r\\nAda\\t60\\r\\nLin\\t59' > crlf.tsv
./main lf.tsv lf-report.tsv
./main crlf.tsv crlf-report.tsv
cmp lf-report.tsv crlf-report.tsv
\`\`\`

**Checks:** Both runs return 0. In each report Ada receives \`pass\`, Lin receives \`review\`, and the \`TOTAL\` row has count 2 and score sum 119. A successful \`cmp\` prints nothing. Explain where the reader handles line endings and why that step must preserve the actual field bytes.`
	),
	fractions: practice(
		"Value Types, Operator Overloading, and Templates Transfer Practice",
		"CPPI5-Fraction-Toolkit",
		`**Goal:** Test how equivalent fractions behave under comparison and sorting.

**Work:** Use the completed Fraction Toolkit. Run \`make main\`, then predict every output line for \`./main 1/2 -2/-4\` and \`./main -1/2 2/-4\`. For each command, reduce the two inputs on paper and place their values and zero on a number line before running it.

**Checks:** In the first case both values print as \`1/2\`, \`LESS\` is false, the sum is \`1/1\`, the product is \`1/4\` and the sorted sequence is \`0/1 1/2 1/2\`. In the second both print as \`-1/2\`, \`LESS\` is false, the sum is \`-1/1\`, the product is \`1/4\` and the sorted sequence is \`-1/2 -1/2 0/1\`. Explain why different input spellings can produce identical values and why equal elements still appear twice in the sorted sequence.`
	),
	rover: practice(
		"Polymorphism and Bridge to Advanced C++ Transfer Practice",
		"CPPI6-Saveable-Command-Simulation",
		`**Goal:** Distinguish reachability, permitted mutation and a direct edge in the rover simulation.

**Work:** Use the completed rover. Build it with \`make main\`. Run \`./main\` with the following commands on separate lines. Predict the phase, position and move count after each one.

\`\`\`text
start
link entry dock
route dock
move dock
move lab
route entry
route dock
show
quit
\`\`\`

**Checks:** The program rejects the link while running and rejects the direct move from entry to dock. The first \`route dock\` prints \`route entry -> lab -> dock\`. After the move to lab, \`route entry\` prints \`route unavailable\` and \`route dock\` prints \`route lab -> dock\`. The final state is running at lab with one move. Explain which commands read the graph and which successfully change rover state.`
	)
};
