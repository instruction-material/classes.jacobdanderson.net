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
					pack.folder === "UB63-Feeding-the-Cows";
				expect(item.content).toContain(
					stdio ? "prints no answer" : "no answer file"
				);
				if (stdio) {
					expect(item.content).toContain("Input panel");
					expect(item.content).toContain(
						"python3 main.py < sample.in"
					);
					expect(item.content).not.toContain("rm -f");
					expect(item.content).not.toContain("cat sample.out");
					expect(item.learningPath).not.toBe("core");
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
