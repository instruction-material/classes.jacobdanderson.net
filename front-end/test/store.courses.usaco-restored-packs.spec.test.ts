import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it } from "vitest";
import { lessonContentSections } from "@/modules/courseLessonPresentation";
import { cppBuildInstructions } from "@/modules/cppBuildInstructions";
import { javaNativeBuildInstructions } from "@/modules/javaNativeBuildInstructions";
import {
	pythonIdeModeForCourseId,
	pythonIdeModeForCourseResource
} from "@/modules/pythonIde";
import { usacoRestoredResources } from "@/modules/usacoProjectResources";
import { useAppStore } from "@/stores/app";
import { useCoursesStore } from "@/stores/courses";
import { marathonSavedItemId } from "@/stores/courses/usacoRestoredProjectBriefs";
import { usacoExistingProjectIds } from "../../test/fixtures/usaco-restored-packs.mjs";

beforeEach(() => setActivePinia(createPinia()));

describe("restored USACO project workflows", () => {
	it("keeps DP practice optional and uses the real demonstration and file contracts", async () => {
		const course = (await useCoursesStore().loadCourseById("usaco-gold"))!;
		const unit = course.modules.find(module =>
			module.title.startsWith("Unit 1:")
		)!;
		for (const [folder, suffix] of [
			["UG2-0-1-Knapsack", "problem-0-1-knapsack"],
			["UG40-Fruit-Feast", "problem-fruit-feast"]
		]) {
			const item = unit.supplementalProjects.find(item =>
				item.projectLink?.endsWith(`/${folder}/starter`)
			)!;
			expect(item.id).toBe(`${unit.id}-supplemental-${suffix}`);
			expect(item.learningPath).toBe("choice");
			expect(item.ideImport).toBe(true);
			expect(item.content).toContain("five marked learner tasks");
			expect(item.solutionLink).toBeUndefined();
			expect(item.content).not.toContain("/solution");
			for (const role of ["starter", "reference"]) {
				const directions = javaNativeBuildInstructions(
					`usaco-gold:${item.id}:${role}`
				)!.join("\n");
				expect(directions).toContain("javac -encoding UTF-8 Main.java");
				if (folder === "UG2-0-1-Knapsack") {
					expect(item.content).toContain("preceding item row");
					expect(item.content).toContain("index 0 once");
					expect(item.content).toContain("Any optimal subset");
					expect(directions).toContain(
						"reads no input file or standard input"
					);
					expect(directions).toContain("numItems");
					expect(directions).not.toContain("sample.in");
					expect(item.content).not.toContain("java Main <");
					expect(item.content).not.toContain("contest-style input");
				} else {
					expect(item.content).toContain("5000000");
					expect(item.content).toContain("floor(x/2)");
					expect(item.content).toContain("across both phases");
					expect(item.content).toContain("(fullness, waterUsed)");
					expect(directions).toContain("cp sample.in feast.in");
					expect(directions).toContain("java Main --trace");
					expect(directions).toContain("preserve an earlier answer");
				}
			}
			for (const key of [
				`usaco-gold:${item.id}:solution`,
				`usaco-gold:${item.id}:starter:extra`,
				`java-level-1:${item.id}:starter`
			]) {
				expect(javaNativeBuildInstructions(key)).toBeNull();
			}
		}
	});
	it("keeps the three Fenwick practices optional with existing IDs and native roles", async () => {
		const course = (await useCoursesStore().loadCourseById("usaco-gold"))!;
		for (const [folder, id, anchor] of [
			[
				"UG23-Balanced-Photo",
				"usaco-gold-unit-4-fenwick-and-segment-trees-ordering-and-range-structure-supplemental-problem-balanced-photo",
				"usaco-gold-unit-4-fenwick-and-segment-trees-ordering-and-range-structure"
			],
			[
				"UG25-Sleepy-Cow-Sorting",
				"usaco-gold-optional-gold-problem-bank-supplemental-problem-sleepy-cow-sorting",
				"usaco-gold-optional-gold-problem-bank"
			],
			[
				"UG26-Out-of-Sorts",
				"usaco-gold-unit-4-fenwick-and-segment-trees-ordering-and-range-structure-supplemental-problem-out-of-sorts",
				"usaco-gold-unit-4-fenwick-and-segment-trees-ordering-and-range-structure"
			]
		]) {
			const module = course.modules.find(module => module.id === anchor)!;
			const item = module.supplementalProjects.find(item =>
				item.projectLink?.endsWith(`/${folder}/starter`)
			)!;
			expect(item.id).toBe(id);
			expect(item.learningPath).toBe("choice");
			expect(item.ideImport).toBe(true);
			expect(item.content).toContain("five marked learner tasks");
			expect(item.content).not.toContain(
				"maximum displacement that controls"
			);
			for (const role of ["starter", "reference"]) {
				const directions = javaNativeBuildInstructions(
					`usaco-gold:${id}:${role}`
				)!.join("\n");
				expect(directions).toContain("five marked learner tasks");
				expect(directions).toContain("Every valid untouched run");
				expect(directions).toContain("preserves earlier output");
			}
			expect(
				javaNativeBuildInstructions(`usaco-gold:${id}:starter:extra`)
			).toBeNull();
			expect(
				javaNativeBuildInstructions(`another-course:${id}:starter`)
			).toBeNull();
			if (folder === "UG26-Out-of-Sorts") {
				expect(item.content).toContain("forward adjacent-swap sweep");
				expect(item.content).toContain("[2,1,1]");
				expect(item.content).toContain("duplicates are allowed");
			}
			if (folder === "UG25-Sleepy-Cow-Sorting")
				expect(item.content).toContain(
					"Any optimal sequence is accepted"
				);
		}
	});

	it("preserves every preexisting repaired project identity", async () => {
		for (const previous of usacoExistingProjectIds) {
			const course = (await useCoursesStore().loadCourseById(
				previous.course
			))!;
			const item = course.modules
				.flatMap(module => [
					...module.curriculum,
					...module.supplementalProjects
				])
				.find(item => item.id === previous.id);
			expect(item?.projectLink, previous.id).toBe(previous.url);
		}
	});
	it("selects the actual role language without treating README-only packs as code", () => {
		for (const pack of usacoRestoredResources) {
			expect(pythonIdeModeForCourseId(pack.course)).toBeNull();
			for (const role of ["starter", "solution"]) {
				const url = `https://github.com/instruction-material/${pack.repository}/tree/main/${pack.folder}/${role}`;
				expect(pythonIdeModeForCourseResource(pack.course, url)).toBe(
					pack.mode
				);
				expect(
					pythonIdeModeForCourseResource(
						pack.course,
						`${url}/README.md`
					)
				).toBeNull();
				expect(
					pythonIdeModeForCourseResource(
						pack.course,
						url.replace("instruction-material", "someone-else")
					)
				).toBeNull();
			}
		}
		for (const [id, repo, folder] of [
			["usaco-bronze", "USACO-Bronze", "UB1-Square-Pasture-Java"],
			["usaco-silver", "USACO-Silver", "US8-Arithmetic-Progressions"],
			["usaco-gold", "USACO-Gold", "UG6-248"]
		]) {
			expect(
				pythonIdeModeForCourseResource(
					id!,
					`https://github.com/instruction-material/${repo}/tree/main/${folder}/starter`
				)
			).toBeNull();
		}
		expect(
			pythonIdeModeForCourseResource(
				"usaco-bronze-on-demand",
				"https://github.com/instruction-material/USACO-Bronze/tree/main/UB1-Square-Pasture/starter"
			)
		).toBe("python");
	});

	it("loads full contracts and consent-enabled packs without learner reference leaks", async () => {
		for (const pack of usacoRestoredResources) {
			const course = (await useCoursesStore().loadCourseById(
				pack.course
			))!;
			const matches = course.modules
				.flatMap(module => [
					...module.curriculum,
					...module.supplementalProjects
				])
				.filter(item =>
					item.projectLink?.endsWith(`/${pack.folder}/starter`)
				);
			expect(matches.length, pack.folder).toBeGreaterThan(0);
			for (const item of matches) {
				expect(item.ideImport).toBe(true);
				expect(item.solutionLink).toBeUndefined();
				expect(item.content).not.toContain("/solution");
				for (const contract of [
					"Contract and reasoning",
					"Guided implementation",
					"Check and explain",
					"Open, save and run",
					"confirm the import",
					"Existing saved attempts",
					"Protected mocks"
				])
					expect(item.content, pack.folder).toContain(contract);
				expect(item.content.length).toBeGreaterThan(2200);
				expect(item.content).not.toContain("**Studio focus:**");
				expect(item.content).not.toContain("**Build steps:**");
				const visibleProjectContent = lessonContentSections(
					item.content
				)
					.filter(section => section.kind !== "learn")
					.map(section => section.content)
					.join("\n\n");
				for (const heading of [
					"Contract and reasoning",
					"Guided implementation",
					"Check and explain",
					"Open, save and run"
				]) {
					expect(visibleProjectContent, pack.folder).toContain(
						`## ${heading}`
					);
				}
				const stdio =
					pack.folder === "UB62-Cow-College" ||
					pack.folder === "UB63-Feeding-the-Cows" ||
					pack.folder === "UG0-Contest-Contract" ||
					pack.folder === "UG22-Binary-Indexed-Tree-Fenwick-Tree";
				expect(item.content).toContain(
					stdio ? "prints no answer" : "no answer file"
				);
				if (stdio) {
					expect(item.content).toContain("Input panel");
					expect(item.content).toContain(
						pack.mode === "java"
							? "java Main < sample.in"
							: "python3 main.py < sample.in"
					);
					expect(item.content).not.toContain("rm -f");
					expect(item.content).not.toContain("cat sample.out");
					if (pack.mode === "python") {
						expect(item.learningPath).not.toBe("core");
					}
				}
				expect(item.content).toContain(
					pack.mode === "cpp"
						? "-std=c++20"
						: pack.mode === "java"
							? "javac -encoding UTF-8 Main.java"
							: "python3 main.py"
				);
			}
		}
	});

	it("replaces advanced setup work with a distinct native checkpoint and retry", async () => {
		const course = (await useCoursesStore().loadCourseById("usaco-gold"))!;
		const setup = course.modules.find(module =>
			module.title.startsWith("USG0")
		)!;
		const core = setup.curriculum.find(item =>
			item.projectLink?.includes("/UG0-Contest-Contract/starter")
		)!;
		const retry = setup.supplementalProjects.find(item =>
			item.projectLink?.includes("/UG0-Contest-Contract/starter")
		)!;
		expect(core.id).toBe(
			"usaco-gold-usg0-setup-contest-contract-and-gold-mindset-curriculum-core-project-native-input-output-checkpoint"
		);
		expect(retry.id).toBe(
			"usaco-gold-usg0-setup-contest-contract-and-gold-mindset-supplemental-native-input-output-retry"
		);
		expect(core.learningPath).toBe("core");
		expect(retry.learningPath).toBe("choice");
		expect(core.id).not.toBe(retry.id);
		for (const item of [core, retry]) {
			expect(item.ideImport).toBe(true);
			expect(item.solutionLink).toBeUndefined();
			for (const text of [
				"calculateTotal",
				"2999999990",
				"200,000,000,000,000",
				"N=0",
				"O(N) memory",
				"authored sample",
				"changed-case retry",
				"PowerShell",
				"java Main < sample.in"
			])
				expect(item.content).toContain(text);
			for (const role of ["starter", "reference"]) {
				const instructions = javaNativeBuildInstructions(
					`usaco-gold:${item.id}:${role}`
				)!.join("\n");
				expect(instructions).toContain(
					"native input/output checkpoint"
				);
				expect(instructions).toContain("creates no answer file");
				expect(instructions).toContain("calculateTotal");
			}
			for (const alias of item.aliases ?? [])
				expect(alias).not.toContain(
					"setup-and-gold-mindset-curriculum-core-project-setup-and-gold-mindset"
				);
		}
		for (const item of [...setup.curriculum, ...setup.supplementalProjects])
			expect(item.projectLink ?? "").not.toMatch(
				/UG21-Moo-Tube|UG24-|UG27-/
			);
	});

	it("moves historical advanced practice after its prerequisites without changing saved keys", async () => {
		const course = (await useCoursesStore().loadCourseById("usaco-gold"))!;
		const prefix =
			"usaco-gold-usg0-setup-contest-contract-and-gold-mindset";
		for (const [suffix, unit, folder, placement] of [
			[
				"curriculum-core-project-setup-and-gold-mindset",
				"Unit 3:",
				"UG21-Moo-Tube",
				"choice"
			],
			[
				"supplemental-gold-log-setup-and-gold-mindset",
				"Unit 3:",
				"UG21-Moo-Tube",
				"choice"
			],
			[
				"supplemental-why-did-the-cow-cross-the-road-iii",
				"Unit 4:",
				"UG24-Why-Did-the-Cow-Cross-the-Road-III",
				"choice"
			],
			[
				"supplemental-snow-boots",
				"Unit 4:",
				"UG27-Snow-Boots",
				"challenge"
			]
		]) {
			const id = `${prefix}-${suffix}`;
			const module = course.modules.find(module =>
				module.title.startsWith(unit!)
			)!;
			const matches = course.modules
				.flatMap(module => [
					...module.curriculum,
					...module.supplementalProjects
				])
				.filter(item => item.id === id);
			expect(matches).toHaveLength(1);
			const item = module.supplementalProjects.find(
				item => item.id === id
			)!;
			expect(item.projectLink).toBe(
				`https://github.com/instruction-material/USACO-Gold/tree/main/${folder}/starter`
			);
			expect(item.learningPath).toBe(placement);
			expect(item.ideImport).toBe(true);
			expect(item.solutionLink).toBeUndefined();
			expect(item.content).toContain("Contract and reasoning");
			expect(item.content).toContain("Check and explain");
			const native = javaNativeBuildInstructions(
				`usaco-gold:${id}:starter`
			);
			if (folder === "UG21-Moo-Tube") {
				expect(native!.join("\n")).toContain("mootube.in");
				expect(native!.join("\n")).toContain("mootube.out");
				expect(item.content).toContain("six marked learner tasks");
				const mootube = module.supplementalProjects.filter(entry =>
					entry.projectLink?.includes("/UG21-Moo-Tube/starter")
				);
				expect(mootube).toHaveLength(2);
				expect(mootube[0]!.content).toContain(
					"Optional first practice after Unit 3"
				);
				expect(mootube[1]!.content).toContain("Changed-case retry");
				expect(mootube[1]!.content).toContain("wait at least two days");
				expect(mootube[0]!.content).not.toBe(mootube[1]!.content);
				expect(item.content).toContain("original query order");
				expect(item.content).toContain(
					"reference assumes valid contest input"
				);
			} else {
				const input = folder.startsWith("UG24-")
					? "circlecross"
					: "snowboots";
				expect(native!.join("\n")).toContain(input + ".in");
				expect(native!.join("\n")).toContain(input + ".out");
				expect(item.content).toContain(
					folder.startsWith("UG24-")
						? "five marked learner tasks"
						: "six marked learner tasks"
				);
				expect(item.content).toContain("preserve");
				expect(item.content).not.toContain("no confirmed IDE import");
				if (folder.startsWith("UG27-"))
					expect(item.content).toContain(
						"those lines are not answers"
					);
			}
		}
	});

	it("preserves the required Dijkstra checkpoint and its separate optional retry", async () => {
		const course = (await useCoursesStore().loadCourseById("usaco-gold"))!;
		const unit = course.modules.find(module =>
			module.title.includes("Unit 2:")
		)!;
		const core = unit.curriculum.find(item =>
			item.projectLink?.endsWith("/UG9-Dijkstras-Algorithm/starter")
		)!;
		const retry = unit.supplementalProjects.find(item =>
			item.projectLink?.endsWith("/UG9-Dijkstras-Algorithm/starter")
		)!;
		expect(core.learningPath).toBe("core");
		expect(retry.learningPath).toBe("choice");
		expect(core.id).not.toBe(retry.id);
		for (const item of [core, retry]) {
			expect(item.ideImport).toBe(true);
			expect(item.content).toContain("Bellman-Ford");
			expect(item.content).toContain("3,000,000,000");
			expect(item.content).toContain("Unreachable: i");
			expect(item.content).toContain("not historical contest limits");
			expect(item.content).toContain("changed-case retry");
			expect(item.content).toContain(
				"does not execute this file-I/O/priority-queue program"
			);
			expect(item.content).not.toContain("c++ -std=");
			expect(item.solutionLink).toBeUndefined();
			for (const role of ["starter", "reference"]) {
				expect(
					javaNativeBuildInstructions(
						`usaco-gold:${item.id}:${role}`
					)?.join("\n")
				).toContain("JDK 17 or newer");
			}
		}
		expect(core.content).toContain("Required implementation checkpoint");
		expect(retry.content).not.toContain(
			"Required implementation checkpoint"
		);
	});

	it("retains teaching previews outside the native Dijkstra project identities", () => {
		for (const key of [
			undefined,
			"java-level-1:item:starter",
			"usaco-gold:other:reference",
			"usaco-gold-unit-2-shortest-paths:starter"
		]) {
			expect(javaNativeBuildInstructions(key)).toBeNull();
		}
	});
	it("preserves the required Prim checkpoint and its distinct optional retry", async () => {
		const course = (await useCoursesStore().loadCourseById("usaco-gold"))!;
		const unit = course.modules.find(module =>
			module.title.includes("Unit 3:")
		)!;
		const core = unit.curriculum.find(item =>
			item.projectLink?.endsWith("/UG14-MST/starter")
		)!;
		const retry = unit.supplementalProjects.find(item =>
			item.projectLink?.endsWith("/UG14-MST/starter")
		)!;
		expect(core.learningPath).toBe("core");
		expect(retry.learningPath).toBe("choice");
		expect(core.id).not.toBe(retry.id);
		for (const item of [core, retry]) {
			expect(item.ideImport).toBe(true);
			expect(item.solutionLink).toBeUndefined();
			for (const text of [
				"Kruskal",
				"3,000,000,000",
				"Total Distance:",
				"not historical contest limits",
				"changed-case retry",
				"single edge",
				"disconnected graph",
				"does not execute this file-I/O/matrix program",
				"prim.in",
				"prim.out"
			]) {
				expect(item.content).toContain(text);
			}
			expect(item.content).not.toContain("dijkstra.in");
			expect(item.content).not.toContain("c++ -std=");
			for (const role of ["starter", "reference"]) {
				const instructions = javaNativeBuildInstructions(
					`usaco-gold:${item.id}:${role}`
				)!.join("\n");
				expect(instructions).toContain("JDK 17 or newer");
				expect(instructions).toContain("prim.in");
				expect(instructions).toContain("prim.out");
				expect(instructions).not.toContain("dijkstra.in");
			}
		}
		expect(core.content).toContain("Required implementation checkpoint");
		expect(retry.content).not.toContain(
			"Required implementation checkpoint"
		);
	});
	it("does not activate unverified MST variants or malformed native identities", () => {
		const item =
			"usaco-gold-unit-3-msts-dsu-and-connectivity-proofs-supplemental-problem-mst";
		for (const key of [
			`usaco-gold:${item}:solution`,
			`usaco-gold:${item}:starter:extra`,
			`java-level-1:${item}:starter`,
			"usaco-gold:mst-ii:reference"
		]) {
			expect(javaNativeBuildInstructions(key)).toBeNull();
		}
		for (const folder of ["UG14-MST-II/starter", "UG14-MST/legacy"]) {
			expect(
				pythonIdeModeForCourseResource(
					"usaco-gold",
					`https://github.com/instruction-material/USACO-Gold/tree/main/${folder}`
				)
			).toBeNull();
		}
	});

	it("preserves the required Fenwick checkpoint, retry and native standard input", async () => {
		const course = (await useCoursesStore().loadCourseById("usaco-gold"))!;
		const unit = course.modules.find(module =>
			module.title.includes("Unit 4:")
		)!;
		const suffix = "/UG22-Binary-Indexed-Tree-Fenwick-Tree/starter";
		const core = unit.curriculum.find(item =>
			item.projectLink?.endsWith(suffix)
		)!;
		const retry = unit.supplementalProjects.find(item =>
			item.projectLink?.endsWith(suffix)
		)!;
		expect(core.learningPath).toBe("core");
		expect(retry.learningPath).toBe("choice");
		expect(core.id).not.toBe(retry.id);
		for (const item of [core, retry]) {
			expect(item.ideImport).toBe(true);
			expect(item.solutionLink).toBeUndefined();
			for (const text of [
				"plain-array oracle",
				"3,000,000,000",
				"PREFIX -1",
				"not historical contest limits",
				"changed-case retry",
				"internal slot zero is unused",
				"O(N+Q) memory",
				"java Main < sample.in",
				"does not execute this input-driven data structure"
			]) {
				expect(item.content).toContain(text);
			}
			for (const text of [
				"python3 main.py",
				"prim.out",
				"dijkstra.out",
				"rm -f"
			]) {
				expect(item.content).not.toContain(text);
			}
			for (const role of ["starter", "reference"]) {
				const instructions = javaNativeBuildInstructions(
					`usaco-gold:${item.id}:${role}`
				)?.join("\n");
				expect(instructions).toContain("java Main < sample.in");
				expect(instructions).toContain("creates no answer file");
				expect(instructions).toContain("JDK 17 or newer");
				expect(instructions).not.toContain("prim.out");
			}
		}
		expect(core.content).toContain("Required implementation checkpoint");
		expect(retry.content).not.toContain(
			"Required implementation checkpoint"
		);
		for (const key of [
			`usaco-gold:${core.id}:solution`,
			`usaco-gold:${core.id}:starter:extra`,
			`java-level-1:${core.id}:starter`,
			"usaco-gold:fenwick-legacy:reference"
		]) {
			expect(javaNativeBuildInstructions(key)).toBeNull();
		}
		for (const folder of [
			"UG22-Binary-Indexed-Tree-Fenwick-Tree/legacy",
			"UG22-Binary-Indexed-Tree-Fenwick-Tree/starter/Main.java"
		]) {
			expect(
				pythonIdeModeForCourseResource(
					"usaco-gold",
					`https://github.com/instruction-material/USACO-Gold/tree/main/${folder}`
				)
			).toBeNull();
		}
	});

	it("keeps Marathon optional in the range unit and preserves its old identity", async () => {
		const course = (await useCoursesStore().loadCourseById("usaco-gold"))!;
		const range = course.modules.find(module =>
			module.title.includes("Unit 4:")
		)!;
		const marathon = range.supplementalProjects.find(item =>
			item.projectLink?.includes("UG5-Marathon")
		)!;
		expect(marathon.id).toBe(marathonSavedItemId);
		expect(marathon.learningPath).toBe("choice");
		expect(marathon.aliases).toContain(`${range.id}-supplemental-marathon`);
		expect(
			course.modules
				.flatMap(module => [
					...module.curriculum,
					...module.supplementalProjects
				])
				.filter(item => item.projectLink?.includes("UG5-Marathon"))
		).toHaveLength(1);
		expect(marathon.content).toContain("endpoints cannot be skipped");
	});

	it("keeps the two DP bridges optional with their existing saved identities", async () => {
		for (const [courseId, folder, placement] of [
			["usaco-silver", "US9-Number-Triangles", "choice"],
			["usaco-gold", "UG7-Treasure-Chest", "challenge"]
		]) {
			const course = (await useCoursesStore().loadCourseById(courseId!))!;
			const matches = course.modules.flatMap(module =>
				module.supplementalProjects.filter(item =>
					item.projectLink?.includes(`/${folder}/starter`)
				)
			);
			expect(matches).toHaveLength(1);
			expect(matches[0]?.learningPath).toBe(placement);
			expect(matches[0]?.ideImport).toBe(true);
			expect(matches[0]?.content).not.toContain(
				"Required implementation checkpoint"
			);
			if (courseId === "usaco-gold") {
				expect(matches[0]?.content).toContain("December 2010 Silver");
				expect(matches[0]?.content).toContain("1229981");
			} else {
				expect(matches[0]?.content).toContain("O(R²)");
			}
		}
	});

	it("provides C++20 native instructions only for the relevant projects", () => {
		for (const id of ["usaco-silver", "usaco-gold"]) {
			expect(
				cppBuildInstructions(
					[{ name: "main.cpp", content: "" }],
					`${id}:item:starter`
				).join("\n")
			).toContain("-std=c++20");
		}
		expect(
			cppBuildInstructions(
				[{ name: "main.cpp", content: "" }],
				"design-patterns-in-cpp:item:starter"
			).join("\n")
		).toContain("-std=c++17");
	});

	it("keeps the completed packs separate and visible to authorized staff", async () => {
		useAppStore().setCurrentTutor({
			_id: "tutor",
			name: "Tutor",
			email: "tutor@example.invalid",
			age: 30,
			state: "GA",
			usersOfTutorLength: 0,
			coursePermissions: ["usaco-gold"],
			editTutors: false,
			saveEdit: "Save"
		});
		const course = (await useCoursesStore().loadCourseById("usaco-gold"))!;
		const item = course.modules
			.flatMap(module => [
				...module.curriculum,
				...module.supplementalProjects
			])
			.find(item => item.projectLink?.includes("UG5-Marathon"))!;
		expect(item.solutionLink).toBe(
			"https://github.com/instruction-material/USACO-Gold/tree/main/UG5-Marathon/solution"
		);
	});
});
