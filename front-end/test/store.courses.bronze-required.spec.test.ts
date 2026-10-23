import MarkdownIt from "markdown-it";
import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it } from "vitest";
import { getCodeIdeProjectSubtitle } from "@/modules/codeIdeProjectLabels";
import { javaNativeBuildInstructions } from "@/modules/javaNativeBuildInstructions";
import { pythonIdeModeForCourseResource } from "@/modules/pythonIde";
import {
	bronzePythonFileIoForKey,
	bronzeRequiredAssignment,
	bronzeRequiredProjectKey
} from "@/modules/usacoBronzeRequiredPacks";
import { useAppStore } from "@/stores/app";
import { useCoursesStore } from "@/stores/courses";

// Captured identities precede the revised titles and placements.
const expected = [
	{
		course: "usaco-bronze",
		id: "usaco-bronze-usb0-setup-and-contest-workflow-curriculum-core-project-setup-and-contest-workflow",
		module: "USB0 Setup and Contest Workflow",
		section: "curriculum",
		path: "core",
		folder: "UB-22-Why-Did-the-Cow-Cross-the-Road-Java",
		mode: "java",
		input: "crossroad.in",
		output: "crossroad.out"
	},
	{
		course: "usaco-bronze",
		id: "usaco-bronze-usb0-setup-and-contest-workflow-supplemental-bronze-log-setup-and-contest-workflow",
		module: "USB0 Setup and Contest Workflow",
		section: "supplementalProjects",
		path: "choice",
		folder: "UB-22-Why-Did-the-Cow-Cross-the-Road-Java",
		mode: "java",
		input: "crossroad.in",
		output: "crossroad.out"
	},
	{
		course: "usaco-bronze",
		id: "usaco-bronze-unit-1-simulation-and-careful-translation-supplemental-problem-transformations",
		module: "Unit 1: Simulation and Careful Translation",
		section: "supplementalProjects",
		path: "choice",
		folder: "UB10-Transformations",
		mode: "python",
		input: "transform.in",
		output: "transform.out"
	},
	{
		course: "usaco-bronze-on-demand",
		id: "usaco-bronze-on-demand-stage-2-strings-modular-arithmetic-and-grids-curriculum-concepts-transformations",
		module: "Stage 2: Strings, Modular Arithmetic, and Grids",
		section: "curriculum",
		path: "core",
		folder: "UB10-Transformations",
		mode: "python",
		input: "transform.in",
		output: "transform.out"
	},
	{
		course: "usaco-bronze",
		id: "usaco-bronze-unit-4-complete-search-structured-state-and-construction-supplemental-problem-wormholes",
		module: "Unit 4: Complete Search, Structured State, and Construction",
		section: "curriculum",
		path: "core",
		folder: "UB16-Wormholes",
		mode: "python",
		input: "wormhole.in",
		output: "wormhole.out"
	},
	{
		course: "usaco-bronze-on-demand",
		id: "usaco-bronze-on-demand-stage-4-complete-search-and-structured-state-curriculum-concepts-wormholes",
		module: "Stage 4: Complete Search and Structured State",
		section: "curriculum",
		path: "core",
		folder: "UB16-Wormholes",
		mode: "python",
		input: "wormhole.in",
		output: "wormhole.out"
	},
	{
		course: "usaco-bronze",
		id: "usaco-bronze-unit-4-complete-search-structured-state-and-construction-curriculum-core-project-search-flavored-bronze-problems",
		module: "Unit 1: Simulation and Careful Translation",
		section: "curriculum",
		path: "core",
		folder: "UB25-The-Lost-Cow",
		mode: "python",
		input: "lostcow.in",
		output: "lostcow.out"
	},
	{
		course: "usaco-bronze",
		id: "usaco-bronze-unit-4-complete-search-structured-state-and-construction-supplemental-problem-the-lost-cow",
		module: "Unit 1: Simulation and Careful Translation",
		section: "supplementalProjects",
		path: "choice",
		folder: "UB25-The-Lost-Cow",
		mode: "python",
		input: "lostcow.in",
		output: "lostcow.out"
	},
	{
		course: "usaco-bronze",
		id: "usaco-bronze-unit-3-frequency-maps-sets-sorting-and-prefix-counts-curriculum-core-project-counting-sorting-and-ranking",
		module: "Unit 3: Frequency Maps, Sets, Sorting, and Prefix Counts",
		section: "curriculum",
		path: "core",
		folder: "UB37-Diamond-Collector",
		mode: "python",
		input: "diamond.in",
		output: "diamond.out"
	},
	{
		course: "usaco-bronze",
		id: "usaco-bronze-unit-3-frequency-maps-sets-sorting-and-prefix-counts-supplemental-problem-diamond-collector",
		module: "Unit 3: Frequency Maps, Sets, Sorting, and Prefix Counts",
		section: "supplementalProjects",
		path: "choice",
		folder: "UB37-Diamond-Collector",
		mode: "python",
		input: "diamond.in",
		output: "diamond.out"
	},
	{
		course: "usaco-bronze",
		id: "usaco-bronze-unit-5-mock-contests-postmortems-and-silver-readiness-curriculum-core-project-contest-sets-and-tier-transition",
		module: "Unit 5: Mock Contests, Postmortems, and Silver Readiness",
		section: "curriculum",
		path: "core",
		folder: "UB50-Milking-Order",
		mode: "python",
		input: "milkorder.in",
		output: "milkorder.out"
	},
	{
		course: "usaco-bronze",
		id: "usaco-bronze-unit-5-mock-contests-postmortems-and-silver-readiness-supplemental-problem-milking-order",
		module: "Unit 5: Mock Contests, Postmortems, and Silver Readiness",
		section: "supplementalProjects",
		path: "challenge",
		folder: "UB50-Milking-Order",
		mode: "python",
		input: "milkorder.in",
		output: "milkorder.out"
	},
	{
		course: "usaco-bronze-on-demand",
		id: "usaco-bronze-on-demand-stage-6-protected-mock-contest-and-postmortem-curriculum-concepts-milking-order",
		module: "Stage 6: Protected Mock Contest and Postmortem",
		section: "curriculum",
		path: "core",
		folder: "UB50-Milking-Order",
		mode: "python",
		input: "milkorder.in",
		output: "milkorder.out"
	},
	{
		course: "usaco-bronze",
		id: "usaco-bronze-unit-4-complete-search-structured-state-and-construction-supplemental-problem-family-tree",
		module: "Unit 4: Complete Search, Structured State, and Construction",
		section: "supplementalProjects",
		path: "choice",
		folder: "UB51-Family-Tree",
		mode: "python",
		input: "family.in",
		output: "family.out"
	},
	{
		course: "usaco-bronze-on-demand",
		id: "usaco-bronze-on-demand-stage-7-bronze-exit-portfolio-and-silver-readiness-curriculum-concepts-family-tree",
		module: "Stage 7: Bronze Exit Portfolio and Silver Readiness",
		section: "curriculum",
		path: "core",
		folder: "UB51-Family-Tree",
		mode: "python",
		input: "family.in",
		output: "family.out"
	},
	{
		course: "usaco-bronze",
		id: "usaco-bronze-unit-2-intervals-arrays-and-greedy-warmups-curriculum-core-project-intervals-arrays-and-greedy-warmups",
		module: "Unit 2: Intervals, Arrays, and Greedy Warmups",
		section: "curriculum",
		path: "core",
		folder: "UB6-Milking-Cows",
		mode: "python",
		input: "milk2.in",
		output: "milk2.out"
	},
	{
		course: "usaco-bronze",
		id: "usaco-bronze-unit-2-intervals-arrays-and-greedy-warmups-supplemental-problem-milking-cows",
		module: "Unit 2: Intervals, Arrays, and Greedy Warmups",
		section: "supplementalProjects",
		path: "choice",
		folder: "UB6-Milking-Cows",
		mode: "python",
		input: "milk2.in",
		output: "milk2.out"
	},
	{
		course: "usaco-bronze-on-demand",
		id: "usaco-bronze-on-demand-stage-3-arrays-intervals-counting-and-greedy-curriculum-concepts-milking-cows",
		module: "Stage 3: Arrays, Intervals, Counting, and Greedy",
		section: "curriculum",
		path: "core",
		folder: "UB6-Milking-Cows",
		mode: "python",
		input: "milk2.in",
		output: "milk2.out"
	}
] as const;
const revision = "f189f7d71b170cfaf69798d411747234ab25d8c4";

describe("bronze required source roles and sequences", () => {
	beforeEach(() => setActivePinia(createPinia()));
	it.each([false, true])(
		"preserves all eighteen progress identities and staff-only references for tutor=%s",
		async tutor => {
			useAppStore().currentTutor = tutor
				? ({
						coursePermissions: [
							"usaco-bronze",
							"usaco-bronze-on-demand"
						]
					} as never)
				: null;
			const store = useCoursesStore();
			for (const courseID of ["usaco-bronze", "usaco-bronze-on-demand"]) {
				const course = (await store.loadCourseById(courseID))!;
				expect(course).toBeDefined();
				const items = course.modules.flatMap(module =>
					(["curriculum", "supplementalProjects"] as const).flatMap(
						section =>
							module[section].map(item => ({
								module,
								section,
								item
							}))
					)
				);
				expect(
					items.filter(entry =>
						expected.some(
							row =>
								row.course === courseID &&
								entry.item.projectLink?.includes(`/${row.folder}/`)
						)
					)
				).toHaveLength(expected.filter(row => row.course === courseID).length);
				for (const row of expected.filter(
					row => row.course === courseID
				)) {
					const matches = items.filter(
						entry => entry.item.id === row.id
					);
					expect(matches, row.id).toHaveLength(1);
					const { module, section, item } = matches[0]!;
					expect(module.title).toBe(row.module);
					expect(section).toBe(row.section);
					expect(item.learningPath).toBe(row.path);
					expect(item.ideImport).toBe(true);
					expect(item.projectLink).toBe(
						`https://github.com/instruction-material/USACO-Bronze/tree/${revision}/${row.folder}/starter`
					);
					expect(
						pythonIdeModeForCourseResource(
							courseID,
							item.projectLink!
						)
					).toBe(row.mode);
					if (tutor) {
						expect(item.solutionLink).toBe(
							item.projectLink!.replace(/\/starter$/, "/solution")
						);
					} else {
						expect(item.solutionLink).toBeUndefined();
						expect(item.content).not.toContain("/solution");
					}
					const html = new MarkdownIt().render(item.content!);
					for (const heading of [
						"Contract and reasoning",
						"Guided implementation",
						"Check and explain",
						"Unit completion requirements",
						"Open, save and run"
					])
						expect(html).toContain(`<h2>${heading}</h2>`);
					for (const detail of [
						row.input,
						row.output,
						"sample.expected",
						"independent",
						"earlier attempt",
						"confirm"
					])
						expect(item.content, row.id).toContain(detail);
					expect(html).toContain('class="language-sh"');
					if (row.section === "supplementalProjects")
						expect(item.content).toContain(
							"Optional changed-case reconstruction"
						);
				}
			}
		}
	);
	it("places simulation and exhaustive search before their unit mastery gates", async () => {
		const course =
			(await useCoursesStore().loadCourseById("usaco-bronze"))!;
		const simulation = course.modules.find(
			module =>
				module.title === "Unit 1: Simulation and Careful Translation"
		)!;
		const search = course.modules.find(
			module =>
				module.title ===
				"Unit 4: Complete Search, Structured State, and Construction"
		)!;
		const lost = expected.find(
			row => row.folder === "UB25-The-Lost-Cow" && row.path === "core"
		)!;
		const worm = expected.find(
			row =>
				row.folder === "UB16-Wormholes" && row.course === "usaco-bronze"
		)!;
		expect(
			search.curriculum
				.concat(search.supplementalProjects)
				.some(item => item.projectLink?.includes("/UB25-The-Lost-Cow/"))
		).toBe(false);
		expect(
			search.supplementalProjects.some(item => item.id === worm.id)
		).toBe(false);
		for (const [module, id] of [
			[simulation, lost.id],
			[search, worm.id]
		] as const) {
			const gate = module.curriculum.findIndex(item =>
				item.title.endsWith("Mastery Gate")
			);
			expect(gate).toBeGreaterThan(
				module.curriculum.findIndex(item => item.id === id)
			);
		}
	});
	it("assigns the wider data-structure work and protects independent mock evidence", async () => {
		const diamond = bronzeRequiredAssignment(
			"usaco-bronze",
			expected.find(
				row =>
					row.folder === "UB37-Diamond-Collector" &&
					row.path === "core"
			)!.id
		)!.pack;
		expect(diamond.requirements).toContain("{1:2,2:1,4:2}");
		expect(diamond.requirements).toContain("[0,1,1,2,2,2]");
		expect(diamond.requirements).toContain("O(N squared)");
		const course = (await useCoursesStore().loadCourseById(
			"usaco-bronze-on-demand"
		))!;
		const mock = course.modules.find(
			module =>
				module.title ===
				"Stage 6: Protected Mock Contest and Postmortem"
		)!;
		const prep = mock.curriculum.find(
			item =>
				item.id ===
				expected.find(
					row =>
						row.course === course.id &&
						row.folder === "UB50-Milking-Order"
				)!.id
		)!;
		for (const rule of [
			"outside the protected timer",
			"three unseen problems",
			"empty files",
			"does not earn",
			"Boolean True"
		])
			expect(prep.content).toContain(rule);
		expect(
			mock.curriculum.some(
				item => item.title === "Protected Mock Contract"
			)
		).toBe(true);
	});
	it("separates new verified file-I/O attempts without relabeling other modes or keys", () => {
		for (const row of expected) {
			for (const role of ["starter", "reference"] as const) {
				const source = `https://github.com/instruction-material/USACO-Bronze/tree/${revision}/${row.folder}/${role === "starter" ? "starter" : "solution"}`;
				const base = `${row.course}:${row.id}:${role}`;
				const suffix =
					row.mode === "java" ? "native-java" : "python-file-io";
				const key = bronzeRequiredProjectKey(
					row.course,
					row.id,
					role,
					source
				);
				expect(key).toBe(`${base}:${suffix}`);
				for (const altered of [
					source.replace(revision, "main"),
					source.replace("github.com", "example.com"),
					`${source}/extra`,
					source.replace(
						/\/(starter|solution)$/,
						role === "starter" ? "/solution" : "/starter"
					)
				])
					expect(
						bronzeRequiredProjectKey(
							row.course,
							row.id,
							role,
							altered
						)
					).toBe(base);
				expect(
					bronzeRequiredProjectKey(
						"python-level-1",
						row.id,
						role,
						source
					)
				).toBe(`python-level-1:${row.id}:${role}`);
				const label = {
					courseID: row.course,
					courseProjectKey: key,
					mode: row.mode,
					title: "Preserved attempt",
					starterLabel: "Source"
				};
				expect(getCodeIdeProjectSubtitle(label)).toBe(
					`${role === "starter" ? "Learner" : "Reference"} · ${row.mode === "java" ? "Java" : "Python"}`
				);
				if (row.mode === "java") {
					expect(
						javaNativeBuildInstructions(key)!.join("\n")
					).toContain("JDK 17");
					expect(
						javaNativeBuildInstructions(key)!.join("\n")
					).toContain("crossroad.in");
					expect(javaNativeBuildInstructions(base)).not.toBeNull();
					expect(bronzePythonFileIoForKey(key)).toBeNull();
				} else {
					expect(bronzePythonFileIoForKey(key)?.input).toBe(
						row.input
					);
					expect(bronzePythonFileIoForKey(base)).toBeNull();
					expect(javaNativeBuildInstructions(key)).toBeNull();
					expect(
						getCodeIdeProjectSubtitle({ ...label, mode: "java" })
					).toBe("Java");
				}
				for (const bad of [
					`${key}:extra`,
					`${row.course}:${row.id}:other:${suffix}`,
					`python-level-1:${row.id}:${role}:${suffix}`
				]) {
					expect(bronzePythonFileIoForKey(bad)).toBeNull();
					expect(javaNativeBuildInstructions(bad)).toBeNull();
				}
			}
		}
		expect(
			bronzeRequiredAssignment("usaco-bronze", "unknown")
		).toBeUndefined();
		expect(
			bronzePythonFileIoForKey(
				"usaco-bronze:unknown:starter:python-file-io"
			)
		).toBeNull();
	});
});
