const setup =
	"/courses#usaco-bronze-usb0-setup-and-contest-workflow-usaco-bronze-usb0-setup-and-contest-workflow-curriculum-core-project-setup-and-contest-workflow";
const simulation =
	"/courses#usaco-bronze-unit-1-simulation-and-careful-translation";
const intervals =
	"/courses#usaco-bronze-unit-2-intervals-arrays-and-greedy-warmups";
const counts =
	"/courses#usaco-bronze-unit-3-frequency-maps-sets-sorting-and-prefix-counts";
const search =
	"/courses#usaco-bronze-unit-4-complete-search-structured-state-and-construction";
const mock =
	"/courses#usaco-bronze-unit-5-mock-contests-postmortems-and-silver-readiness-usaco-bronze-unit-5-mock-contests-postmortems-and-silver-readiness-curriculum-mock-contest-and-postmortem-contract";

export const bronzeCourseGuideReadings = {
	"USACO Bronze Reference Guide":
		"Use the official statement for the input bounds, output format, and judge rules of each problem. The course project card adds a small worked case and links its assigned source. Compare the official sample with a smaller case that can be traced by hand before consulting a solution.",
	"USACO Bronze Core Skills":
		"Translate each input event into a state change. Merge intervals after sorting their start points. Choose a map for counts of sparse values, a set for membership, and a direct count array when the value range is small. Bound complete search by counting the cases before writing the loop or recursion.",
	"USACO Bronze Next Topics":
		"Once a Bronze attempt can be justified under the largest stated input, use Silver for problems where a faster query or a graph representation changes the approach. First compare counting a range by scanning it with counting it using two prefix totals. Then trace a small connected component before writing graph traversal.",
	"USACO Bronze Boundaries":
		"Coached Bronze pairs each required project with an explanation, a worked case, and a review. The independent mock contest comes after those guided checkpoints. [Bronze On Demand](/courses#usaco-bronze-on-demand) offers a separate self-paced contest sequence and optional archive for independent practice.",
	"USACO Bronze Prerequisite Check": `Trace a loop over four input events and explain what the program remembers after each one. In the [Road-Crossing setup project](${setup}), a cow's first reported side sets its state. A later observation counts only when that same cow changes sides. Check a repeated side and a change in a short input file.`,
	"USACO Bronze Pathway Map": `[Setup](${setup}) establishes the run and output contract. [Simulation](${simulation}) tracks state, [intervals](${intervals}) expose coverage, [frequency maps](${counts}) make repeated keys visible, and [complete search](${search}) covers feasible states. Finish with the [mock contest and postmortem](${mock}).`,
	"USACO Bronze Follow-Up Path":
		"Use the postmortem to pick the next practice problem. If state was lost, return to simulation and name what each variable represents. If the approach did too much work, count its operations on the largest input. Move to [USACO Silver](/courses#usaco-silver) when the corrected approach and its boundary case can be explained independently.",
	"USACO Bronze Resource Map":
		"Open the starter from its project card, confirm the import, and keep the input file and source together. Follow that pack's README for the compiler or interpreter command. For a named-file problem, compare the named output file byte for byte. For a standard-input problem, replay the fixture through standard input and compare standard output.",
	"USACO Bronze Module Alignment Guide":
		"Trace which observation changes a cow's side in setup. In Milking Cows, compare touching intervals with a real gap. In Diamond Collector, keep the two endpoints when their difference equals the limit and count duplicates as separate diamonds. In Wormholes, explain why each complete pairing is checked exactly once.",
	"USACO Bronze Reference Map":
		"Use the [course source repository](https://github.com/instruction-material/USACO-Bronze) to inspect project files outside the IDE. Open the problem statement and README for the assigned pack first. Compare a worked solution after recording an attempt and a failing case so the difference can be traced to a specific decision.",
	"USACO Bronze Prerequisite Map":
		"Read and reproduce the expected output before debugging an algorithm. State tracking comes before early stopping in The Lost Cow. Sorting comes before merging Milking Cows intervals. Inclusive endpoint checks come before counting a Diamond Collector window. Being able to trace a single pairing comes before enumerating every Wormholes pairing.",
	"USACO Bronze Resource Inventory":
		"Keep the saved attempt, exported source folder, exact run command, and one hand-checked input with expected output. Record the input and output filenames if the statement supplies them. For a wrong answer, keep the smallest reproducing input next to the corrected output so the repair can be replayed.",
	"USACO Bronze Project Ladder":
		"Start with a working source export and a small event trace. Next write a correct simulation and a case that exposes an early stopping error. Then justify the structure used for a counting or search problem. Finish by selecting a problem order, making independent attempts, and revising one approach from the results.",
	"USACO Bronze Checkpoints":
		"For each problem, predict the sample output, add one boundary case, and estimate the maximum work before coding. Check empty or smallest legal input where the statement permits it. Compare the exact output files or lines, then explain why the loop can stop or why search cannot miss a candidate.",
	"USACO Bronze Rubric":
		"Review the output contract, correctness argument, work bound, and reproducible evidence. A correct sample shows one path. A boundary case checks the assumption most likely to fail. In the explanation, name the first invariant that would break under the original bug and show the input where it broke.",
	"USACO Bronze Capstone Gate": `Start the [mock contest](${mock}) after a solo practice run can be reproduced from a fresh export. Choose unseen problems for the timed attempt and reserve hints and references for the postmortem. Keep the problem order, actual results, and a smallest failing case or a concrete next step for each unfinished attempt.`
};
