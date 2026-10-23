import { createPinia, setActivePinia } from "pinia";
import { describe, expect, it } from "vitest";
import { useCoursesStore } from "@/stores/courses";
import {
	nonCatalogCourseProgress,
	unmatchedCourseProgress
} from "@/modules/courseProgressHistory";
import { courseCatalog } from "@/stores/courses/index";
import { webDevelopmentFoundationsCourse } from "@/stores/courses/web-development-foundations";
import { researchBackedExpansionCourseIds } from "@/stores/courses/research-expansions";
import generatedProjectHistory from "./fixtures/generated-project-history.json";
import generatedTitleCourseHistory from "./fixtures/generated-title-course-history.json";
import broadTitle17b6History from "./fixtures/broad-title-17b6-history.json";
import broadTitle509cHistory from "./fixtures/broad-title-509c-history.json";
import broadTitleAfd19History from "./fixtures/broad-title-afd19-history.json";
import broadTitleEebbHistory from "./fixtures/broad-title-eebb-history.json";
import usacoStudioHistory from "./fixtures/usaco-studio-history.json";
import apcsaCourseHistory from "./fixtures/apcsa-course-history.json";
import machineLearningCourseHistory from "./fixtures/machine-learning-course-history.json";
import designPatternsPart2History from "./fixtures/design-patterns-part-2-history.json";
import linuxCourseHistory from "./fixtures/linux-course-history.json";
import algebraCourseHistory from "./fixtures/algebra-course-history.json";
import assemblyCourseHistory from "./fixtures/assembly-course-history.json";
import cppAlgorithmsCourseHistory from "./fixtures/cpp-algorithms-course-history.json";
import cppDesignPatternsCourseHistory from "./fixtures/cpp-design-patterns-progress-history.json";
import lowLevelSecurityPart2CourseHistory from "./fixtures/low-level-security-part-2-progress-history.json";
import networkSystemsCourseHistory from "./fixtures/network-systems-progress-history.json";
import javaLevel1CourseHistory from "./fixtures/java-level-1-course-history.json";
import javaLevel2CourseHistory from "./fixtures/java-level-2-course-history.json";
import languageBridgeCourseHistory from "./fixtures/language-bridge-course-history.json";
import lowLevelSecurityCourseHistory from "./fixtures/low-level-security-course-history.json";
import usacoBronzeCourseHistory from "./fixtures/usaco-bronze-course-history.json";

function historicalId(value: string) {
	return value
		.toLowerCase()
		.normalize("NFKD")
		.replace(/[\u0300-\u036f]/g, "")
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-+|-+$/g, "");
}

describe("saved course progress identities", () => {
	it("keeps retired Design Patterns studio modules distinct from the shared archive", async () => {
		setActivePinia(createPinia());
		const course = await useCoursesStore().loadCourseById(
			"design-patterns-in-java"
		);
		const previousModuleIds = [11, 12, 13].map(
			index => `design-patterns-in-java-pattern-lab-${index}`
		);
		const previousItemId = historicalId(
			"design-patterns-in-java-pattern-lab-11-curriculum-Pattern Lab 15: Core Concepts"
		);

		expect(
			unmatchedCourseProgress(course, {
				courseId: "design-patterns-in-java",
				completedModuleIds: previousModuleIds,
				completedItemIds: [previousItemId]
			})
		).toEqual(previousModuleIds.map(id => ({ id, kind: "module" })));
	});

	it("keeps retired Pre-Algebra B archive completions visible without reassignment", async () => {
		setActivePinia(createPinia());
		const course = await useCoursesStore().loadCourseById("pre-algebra-b");
		const previousArchiveId = "pre-algebra-b-source-activity-archive";
		const retiredIds = [
			"pre-algebra-b-source-activity-archive-supplemental-checkpoint-source-activity-archive",
			"pre-algebra-b-source-activity-archive-supplemental-transfer-practice-source-activity-archive"
		];

		expect(
			unmatchedCourseProgress(course, {
				courseId: "pre-algebra-b",
				completedModuleIds: [previousArchiveId],
				completedItemIds: retiredIds
			})
		).toEqual(retiredIds.map(id => ({ id, kind: "item" })));
	});

	it("keeps original IDs through shared display-title transforms", async () => {
		setActivePinia(createPinia());
		for (const [courseId, previousId] of [
			[
				"scratch-level-1",
				"scratch-level-1-gs14-mini-game-polish-studio-curriculum-core-concepts"
			],
			[
				"scratch-level-1",
				"scratch-level-1-gs13-master-project-supplemental-gs13-master-project-extension-challenge"
			],
			[
				"ai-level-1",
				"ai-level-1-ai-search-lab-13-curriculum-ai-search-lab-13-review-and-reflection"
			]
		] as const) {
			const course = await useCoursesStore().loadCourseById(courseId);
			const owners = course?.modules.flatMap(module =>
				[...module.curriculum, ...module.supplementalProjects].filter(
					item =>
						item.id === previousId ||
						item.aliases?.includes(previousId)
				)
			);
			expect(owners, previousId).toHaveLength(1);
		}
	});

	it("retains design-pattern practice and studio completions after relabeling", async () => {
		setActivePinia(createPinia());
		const course = await useCoursesStore().loadCourseById(
			"design-patterns-in-java"
		);
		const subjects = [
			"What Patterns Are and What They Are Not",
			"Java Design Foundations",
			"Creational Patterns I",
			"Creational Patterns II and Boundary Patterns",
			"Structural Patterns in Depth",
			"Behavioral Patterns I",
			"Behavioral Patterns II",
			"Modern Extensions and Architecture Level Patterns",
			"Pattern Selection and Refactoring Judgment",
			"Capstone Refactor"
		];
		let checkedIds = 0;
		for (const [index, subject] of subjects.entries()) {
			const moduleId = historicalId(
				`design-patterns-in-java-dpj${index + 1}-${subject}`
			);
			for (const [purpose, number] of [
				["Transfer", 2],
				["Extension", 3]
			] as const) {
				const previousId = historicalId(
					`${moduleId}-supplemental-${purpose} Practice: ${subject}`
				);
				const owners = course?.modules.flatMap(module =>
					module.supplementalProjects.filter(
						item =>
							item.id === previousId ||
							item.aliases?.includes(previousId)
					)
				);
				expect(owners, previousId).toHaveLength(1);
				expect(owners?.[0].projectLink, previousId).toMatch(
					new RegExp(
						`-dpj${index + 1}-${historicalId(subject)}-supplemental-${number}/starter$`,
						"u"
					)
				);
				checkedIds++;
			}
		}
		for (const [subject, moduleNumber, labNumber] of [
			["Strategy Selection Refactor", 11, 15],
			["Structural Wrapper Refactor", 12, 16],
			["Architecture Judgment Capstone", 13, 17]
		] as const) {
			const previousModuleId = `design-patterns-in-java-pattern-lab-${moduleNumber}`;
			const archive = course?.modules.find(
				module =>
					module.title === "Optional Applied Java Pattern Studios"
			);
			expect(archive).toBeDefined();
			for (const [section, previousTitle, currentTitle] of [
				[
					"curriculum",
					`Pattern Lab ${labNumber}: Core Concepts`,
					`${subject}: Core Concepts`
				],
				[
					"curriculum",
					`Pattern Lab ${labNumber}: Guided Example`,
					`${subject}: Guided Example`
				],
				[
					"curriculum",
					`Core Project: Pattern Lab ${labNumber}`,
					`Core Project: ${subject}`
				],
				[
					"curriculum",
					`Review: Pattern Lab ${labNumber}`,
					`Review: ${subject}`
				],
				[
					"supplemental",
					`Extension Challenge: Pattern Lab ${labNumber}`,
					`Extension Challenge: ${subject}`
				],
				[
					"supplemental",
					`Pattern Lab ${labNumber} Transfer Practice`,
					`${subject} Transfer Practice`
				],
				[
					"supplemental",
					`Pattern Lab ${labNumber} Extension Practice`,
					`${subject} Extension Practice`
				]
			] as const) {
				const previousId = historicalId(
					`${previousModuleId}-${section}-${previousTitle}`
				);
				const owners = course?.modules.flatMap(entry =>
					[...entry.curriculum, ...entry.supplementalProjects].filter(
						item =>
							item.id === previousId ||
							item.aliases?.includes(previousId)
					)
				);
				expect(owners, previousId).toHaveLength(1);
				expect(archive?.supplementalProjects).toContain(owners?.[0]);
				expect(owners?.[0].title, previousId).toBe(currentTitle);
				checkedIds++;
			}
		}
		expect(checkedIds).toBe(41);
	});

	it("retains math reference-archive progress from the source-activity labels", async () => {
		setActivePinia(createPinia());
		const archiveItemsByCourse: Record<string, string[]> = {
			"algebra-1a": [
				"curriculum-project-scenario-and-context-links",
				"curriculum-pending-static-asset-placeholders",
				"supplemental-standards-practice-set-source-activity-archive",
				"supplemental-modeling-or-error-analysis-source-activity-archive"
			],
			"algebra-1b": [
				"curriculum-project-scenario-and-context-links",
				"curriculum-pending-static-asset-placeholders",
				"supplemental-standards-practice-set-source-activity-archive",
				"supplemental-modeling-or-error-analysis-source-activity-archive"
			],
			"algebra-2a": [
				"curriculum-project-scenario-and-context-links",
				"curriculum-pending-static-asset-placeholders",
				"supplemental-standards-practice-set-source-activity-archive",
				"supplemental-modeling-or-error-analysis-source-activity-archive"
			],
			"algebra-2b": [
				"curriculum-source-activity-anchors-algebra-2b",
				"curriculum-pending-static-asset-placeholders",
				"supplemental-standards-practice-set-source-activity-archive",
				"supplemental-modeling-or-error-analysis-source-activity-archive"
			],
			"geometry-a": ["curriculum-source-activity-anchors-geometry-a"],
			"geometry-b": ["curriculum-source-activity-anchors-geometry-b"],
			"pre-algebra-a": ["curriculum-pre-algebra-a-source-anchors"],
			"pre-algebra-b": ["curriculum-pre-algebra-b-source-anchors"],
			"pre-calculus-a": [
				"curriculum-source-activity-anchors-pre-calculus-a"
			],
			"pre-calculus-b": [
				"curriculum-source-activity-anchors-pre-calculus-b"
			]
		};
		let checkedIds = 0;

		for (const [courseId, itemSuffixes] of Object.entries(
			archiveItemsByCourse
		)) {
			const course = await useCoursesStore().loadCourseById(courseId);
			const previousModuleId = `${courseId}-source-activity-archive`;
			const archiveOwners = course?.modules.filter(
				module =>
					module.id === previousModuleId ||
					module.aliases?.includes(previousModuleId)
			);
			expect(archiveOwners, previousModuleId).toHaveLength(1);
			const archive = archiveOwners?.[0];
			expect(archive?.title).toContain("Reference Archive");
			checkedIds++;

			for (const suffix of itemSuffixes) {
				const previousId = `${previousModuleId}-${suffix}`;
				const owners = course?.modules.flatMap(module =>
					[
						...module.curriculum,
						...module.supplementalProjects
					].filter(
						item =>
							item.id === previousId ||
							item.aliases?.includes(previousId)
					)
				);
				expect(owners, previousId).toHaveLength(1);
				expect(
					archive?.curriculum.concat(archive.supplementalProjects)
				).toContain(owners?.[0]);
				checkedIds++;
			}
		}

		const preAlgebra =
			await useCoursesStore().loadCourseById("pre-algebra-a");
		const capstoneId =
			"pre-algebra-a-check-in-2-and-capstone-curriculum-source-activity-anchors-pre-algebra-a-capstone";
		const capstoneOwners = preAlgebra?.modules.flatMap(module =>
			module.curriculum.filter(
				item =>
					item.id === capstoneId || item.aliases?.includes(capstoneId)
			)
		);
		expect(capstoneOwners, capstoneId).toHaveLength(1);
		expect(capstoneOwners?.[0].title).toBe(
			"Pre-Algebra A Capstone Reference Map"
		);
		expect(checkedIds + 1).toBe(33);
	});

	it("retains Java Level 3 practice completions across relabeling and archiving", async () => {
		setActivePinia(createPinia());
		const course = await useCoursesStore().loadCourseById("java-level-3");
		const previousModules = [
			[
				"AJ1 Review: Variables, Strings, and Input",
				"Variables, Strings, and Input"
			],
			["AJ3 Review: Objects and Classes", "Objects and Classes"],
			["AJ4 Recursion", "Recursion"],
			[
				"AJ5 Linear Search and Big-O Notation",
				"Linear Search and Big-O Notation"
			],
			["AJ6 Binary Search", "Binary Search"],
			["Check-In #1", "Check-In #1"],
			[
				"AJ7 Selection and Insertion Sort",
				"Selection and Insertion Sort"
			],
			["AJ8 Bubble Sort", "Bubble Sort"],
			["AJ9 Merge Sort", "Merge Sort"],
			["Check-In #2", "Check-In #2"],
			["AJ10 Sustainable Programming", "Sustainable Programming"],
			["AJ11 Linked Lists", "Linked Lists"],
			["AJ13 Priority Queues and Maps", "Priority Queues and Maps"],
			["Check-In #3", "Check-In #3"],
			["AJ14 Binary Search Trees", "Binary Search Trees"],
			["AJ15 Hash Tables", "Hash Tables"],
			["AJ16 Graphs", "Graphs"],
			["Check-In #4", "Check-In #4"],
			["AJ17 Master Project: Google Maps", "Master Project: Google Maps"]
		] as const;
		let checkedIds = 0;

		for (const [moduleTitle, previousTopic] of previousModules) {
			const previousModuleId = historicalId(
				`java-level-3-${moduleTitle}`
			);
			for (const [purpose, practiceNumber] of [
				["Transfer", "2"],
				["Extension", "3"]
			] as const) {
				const previousId = historicalId(
					`${previousModuleId}-supplemental-${purpose} Practice: ${previousTopic}`
				);
				const owners = course?.modules.flatMap(module =>
					module.supplementalProjects.filter(
						item =>
							item.id === previousId ||
							item.aliases?.includes(previousId)
					)
				);
				expect(owners, previousId).toHaveLength(1);
				expect(owners?.[0].projectLink, previousId).toMatch(
					new RegExp(
						`-${previousModuleId.slice("java-level-3-".length)}-supplemental-${practiceNumber}/starter$`,
						"u"
					)
				);
				checkedIds++;
			}
		}
		expect(checkedIds).toBe(38);
	});

	it("retains AI practice-studio completions after the module rename", async () => {
		setActivePinia(createPinia());
		const course = await useCoursesStore().loadCourseById("ai-level-1");
		const previousTitles = [
			"AI Search Lab 13",
			"AI Search Lab 14",
			"AI Search Lab 15",
			"AI Search Lab 16",
			"AI Search Lab 17",
			"Unbeatable TicTacToe AI 1",
			"The Marble Game AI"
		];
		let checkedIds = 0;

		for (const previousTitle of previousTitles) {
			const previousModuleId = historicalId(
				`ai-level-1-${previousTitle}`
			);
			const module = course?.modules.find(
				entry => entry.title === `${previousTitle}: Practice Studio`
			);
			const moduleOwners = course?.modules.filter(
				entry =>
					entry.id === previousModuleId ||
					entry.aliases?.includes(previousModuleId)
			);
			expect(moduleOwners, previousModuleId).toEqual([module]);
			checkedIds++;

			for (const [section, previousItemTitle] of [
				["curriculum", `${previousTitle}: Core Concepts`],
				["curriculum", `${previousTitle}: Guided Example`],
				["curriculum", `Core Project: ${previousTitle}`],
				["curriculum", `Review: ${previousTitle}`],
				["supplemental", `Extension Challenge: ${previousTitle}`],
				["supplemental", `Transfer Practice: ${previousTitle}`],
				["supplemental", `Extension Practice: ${previousTitle}`]
			] as const) {
				const previousId = historicalId(
					`${previousModuleId}-${section}-${previousItemTitle}`
				);
				const owners = course?.modules.flatMap(entry =>
					[...entry.curriculum, ...entry.supplementalProjects].filter(
						item =>
							item.id === previousId ||
							item.aliases?.includes(previousId)
					)
				);
				expect(owners, previousId).toHaveLength(1);
				expect(
					module?.curriculum.concat(module.supplementalProjects)
				).toContain(owners?.[0]);
				const currentItemTitle =
					previousTitle === "Unbeatable TicTacToe AI 1" &&
					/^(Transfer|Extension) Practice:/u.test(previousItemTitle)
						? `${previousTitle} ${previousItemTitle.split(":")[0]}`
						: previousItemTitle;
				expect(owners?.[0].title, previousId).toBe(currentItemTitle);
				checkedIds++;
			}
		}

		const previousUnitSevenId =
			"ai-level-1-unit-7-features-evaluation-and-responsible-ai-supplemental-extension-practice-features-evaluation-and-responsible-ai";
		const unitSevenOwners = course?.modules.flatMap(module =>
			module.supplementalProjects.filter(
				item =>
					item.id === previousUnitSevenId ||
					item.aliases?.includes(previousUnitSevenId)
			)
		);
		expect(unitSevenOwners, previousUnitSevenId).toHaveLength(1);
		expect(unitSevenOwners?.[0].title).toBe(
			"Extension Practice: Features, Evaluation, and Responsible AI"
		);
		expect(checkedIds + 1).toBe(57);
	});

	it("retains check-in practice completions after contextual title changes", async () => {
		setActivePinia(createPinia());
		const historicalModules: Record<string, string[]> = {
			"scratch-level-2": ["check-in-1", "check-in-2"],
			"python-level-1": ["check-in-1", "check-in-2", "check-in-3"],
			pygames: [
				"check-in-1-actors-events-zrects-collectibles",
				"check-in-2-gravity-friction-platforms",
				"check-in-3-system-control-projectiles-enemy-ai"
			],
			"python-level-2": ["check-in-1", "check-in-2"],
			"python-level-3": ["check-in-1", "check-in-2", "check-in-3"],
			"java-level-1": ["check-in-1", "check-in-2"],
			"java-level-2": ["check-in-1", "check-in-2"],
			"java-level-3": [
				"check-in-1",
				"check-in-2",
				"check-in-3",
				"check-in-4"
			],
			"javascript-level-1-javascript-superstar": [
				"check-in-1",
				"check-in-2"
			],
			"javascript-level-2-javascript-master": ["check-in-1", "check-in-2"]
		};
		let checkedIds = 0;

		for (const [courseId, moduleSuffixes] of Object.entries(
			historicalModules
		)) {
			const course = await useCoursesStore().loadCourseById(courseId);
			for (const suffix of moduleSuffixes) {
				const checkInNumber = suffix.match(/check-in-(\d+)/u)?.[1];
				const previousId = `${courseId}-${suffix}-curriculum-check-in-${checkInNumber}-additional-practice-project`;
				const owners = course?.modules.flatMap(module =>
					module.curriculum
						.filter(
							item =>
								item.id === previousId ||
								item.aliases?.includes(previousId)
						)
						.map(item => ({ module, item }))
				);
				expect(owners, previousId).toHaveLength(1);
				expect(owners?.[0].item.title, previousId).toContain(
					"Practice Project"
				);
				checkedIds++;
			}
		}
		expect(checkedIds).toBe(25);
	});

	it("retains physics check completions from before descriptive titles", async () => {
		setActivePinia(createPinia());
		const historicalModules = {
			"intro-to-physics": [
				"phy1-measurement-uncertainty-and-scientific-modeling",
				"phy2-motion-graphs-and-kinematics",
				"phy3-forces-free-body-diagrams-and-newton-s-laws",
				"phy4-gravity-work-and-energy",
				"phy5-electricity-and-basic-circuits",
				"phy6-waves-sound-and-light",
				"phy7-capstone-lab-and-scientific-communication",
				"phy8-momentum-impulse-and-collisions",
				"phy9-rotational-motion-and-torque-basics",
				"phy10-fluids-pressure-and-buoyancy",
				"phy11-heat-temperature-and-thermal-energy",
				"phy12-optics-mirrors-lenses-and-images",
				"phy13-magnetism-and-electromagnetic-induction",
				"phy14-simple-harmonic-motion-and-resonance",
				"phy15-astronomy-gravity-and-orbits",
				"phy16-modern-physics-and-model-limits",
				"phy17-engineering-design-and-physics-portfolio"
			],
			"physics-level-2": [
				"phy8-quantitative-kinematics-and-vector-modeling",
				"phy9-multi-force-systems-and-equilibrium",
				"phy10-friction-inclines-and-connected-systems",
				"phy11-momentum-impulse-and-collisions",
				"phy12-rotational-motion-and-torque",
				"phy13-gravitation-circular-motion-and-orbits",
				"phy14-electricity-circuits-and-fields",
				"phy15-thermal-physics-optics-and-modern-bridges",
				"phy16-engineering-physics-capstone",
				"phy17-numerical-modeling-and-simulation-checks",
				"phy18-experimental-uncertainty-and-curve-fitting",
				"phy19-coupled-systems-and-constraints",
				"phy20-fluids-and-continuum-models",
				"phy21-thermodynamics-and-engines",
				"phy22-electromagnetic-applications-and-signals",
				"phy23-relativity-and-reference-frames-preview",
				"phy24-independent-physics-research-portfolio"
			]
		};
		let checkedIds = 0;

		for (const [courseId, suffixes] of Object.entries(historicalModules)) {
			const course = await useCoursesStore().loadCourseById(courseId);
			const allItems = course?.modules.flatMap(module => [
				...module.curriculum,
				...module.supplementalProjects
			]);
			for (const suffix of suffixes) {
				const moduleId = `${courseId}-${suffix}`;
				const module = course?.modules.find(
					entry => entry.id === moduleId
				);
				expect(module, moduleId).toBeDefined();
				const topic = module?.title.replace(/^PHY\d+\s+/u, "").trim();
				for (const [previousTitle, currentSuffix] of [
					[`Understanding Check: ${topic}`, "Readiness Check"],
					["Failure Modes", "Failure Modes"]
				]) {
					const previousId = historicalId(
						`${moduleId}-supplemental-${previousTitle}`
					);
					const owner = module?.supplementalProjects.find(item =>
						item.title.endsWith(currentSuffix)
					);
					expect(owner?.aliases, previousId).toContain(previousId);
					expect(owner?.id, previousId).not.toBe(previousId);
					expect(
						allItems?.filter(
							item =>
								item.id === previousId ||
								item.aliases?.includes(previousId)
						),
						previousId
					).toEqual([owner]);
					checkedIds++;
				}
			}
		}
		expect(checkedIds).toBe(68);
	});

	it("retains diagnostic checkpoint progress after the label rename", async () => {
		setActivePinia(createPinia());
		const courseHistory = {
			"design-patterns-in-java": { prefix: "dpj", count: 10 },
			"design-patterns-in-java-part-2": { prefix: "dpr", count: 10 },
			"intro-to-physics": { prefix: "phy", count: 17 },
			"physics-level-2": { prefix: "phy", count: 17 },
			"intro-to-swift-app-development": { prefix: "sad", count: 20 }
		} as const;
		let checkedIds = 0;

		for (const [courseId, history] of Object.entries(courseHistory)) {
			const course = await useCoursesStore().loadCourseById(courseId);
			const allItems = course?.modules.flatMap(module => [
				...module.curriculum,
				...module.supplementalProjects
			]);
			let courseChecks = 0;
			for (const module of course?.modules ?? []) {
				const previousModuleId =
					courseId === "intro-to-swift-app-development"
						? module.aliases?.find(alias =>
								/^intro-to-swift-app-development-sad\d+-/u.test(
									alias
								)
							)
						: module.id;
				if (
					!previousModuleId ||
					!new RegExp(
						`^${courseId}-${history.prefix}\\d+-`,
						"u"
					).test(previousModuleId)
				)
					continue;
				const previousTopic = previousModuleId
					.slice(courseId.length + 1)
					.replace(/^[a-z]+\d+-/u, "");
				const previousId = `${previousModuleId}-supplemental-diagnostic-checkpoint-${previousTopic}`;
				const owners = allItems?.filter(
					item =>
						item.id === previousId ||
						item.aliases?.includes(previousId)
				);
				expect(owners, previousId).toHaveLength(1);
				expect(owners?.[0].id, previousId).not.toBe(previousId);
				courseChecks++;
			}
			expect(courseChecks, courseId).toBe(history.count);
			checkedIds += courseChecks;
		}
		expect(checkedIds).toBe(74);
	});

	it("retains Swift lesson progress from before the first label refinement", async () => {
		setActivePinia(createPinia());
		const course = await useCoursesStore().loadCourseById(
			"intro-to-swift-app-development"
		);
		const historicalItems = [
			[
				"sad2-mac-setup-and-project-tooling-curriculum-mini-lab-first-blank-swiftui-app",
				"First Blank SwiftUI App Studio"
			],
			[
				"sad2-mac-setup-and-project-tooling-supplemental-understanding-check-mac-setup-and-project-tooling",
				"SW1 Mac Setup and First Launch: Readiness Check"
			],
			[
				"sad4-running-on-simulator-and-device-curriculum-mini-lab-first-launch-troubleshooting",
				"First Launch Troubleshooting Studio"
			],
			[
				"sad4-running-on-simulator-and-device-supplemental-understanding-check-running-on-simulator-and-device",
				"SW15 Simulator and Device Validation: Readiness Check"
			],
			[
				"sad6-what-an-app-is-structurally-curriculum-reflection-question-which-part-of-an-app-should-change-most-slowly",
				"Reflection Question: Stable App Structure"
			]
		] as const;
		const allItems = course?.modules.flatMap(module => [
			...module.curriculum,
			...module.supplementalProjects
		]);
		for (const [suffix, currentTitle] of historicalItems) {
			const previousId = `intro-to-swift-app-development-${suffix}`;
			const owners = allItems?.filter(item =>
				item.aliases?.includes(previousId)
			);
			expect(owners, previousId).toHaveLength(1);
			expect(owners?.[0].title, previousId).toBe(currentTitle);
		}
	});

	it("retains Swift practice progress from before the label order changed", async () => {
		setActivePinia(createPinia());
		const courseId = "intro-to-swift-app-development";
		const course = await useCoursesStore().loadCourseById(courseId);
		let checkedIds = 0;

		for (const module of course?.modules ?? []) {
			const previousModuleId = module.aliases?.find(alias =>
				/^intro-to-swift-app-development-sad(?:\d+|x)-/u.test(alias)
			);
			if (!previousModuleId) continue;
			const moduleSuffix = previousModuleId.slice(courseId.length + 1);
			const topicSuffix = moduleSuffix.replace(/^sad\d+-/u, "");
			const labels = moduleSuffix.startsWith("sad1-")
				? ["extension"]
				: ["transfer", "extension"];
			for (const label of labels) {
				const previousId = `${previousModuleId}-supplemental-${label}-practice-${topicSuffix}`;
				const owners = course?.modules.flatMap(entry =>
					entry.supplementalProjects.filter(
						item =>
							item.id === previousId ||
							item.aliases?.includes(previousId)
					)
				);
				expect(owners, previousId).toHaveLength(1);
				expect(module.supplementalProjects, previousId).toContain(
					owners?.[0]
				);
				checkedIds++;
			}
		}
		expect(checkedIds).toBe(41);
	});

	it("retains Java pattern lesson progress after studio labels and grouping", async () => {
		setActivePinia(createPinia());
		const historicalLessons = [
			[
				"design-patterns-in-java-part-2",
				"dpr1",
				"Mini Lab: Write the Refactor Plan Before Touching Code"
			],
			[
				"design-patterns-in-java-part-2",
				"dpr2",
				"Mini Lab: Refactor a Calculation Pipeline Safely"
			],
			[
				"design-patterns-in-java-part-2",
				"dpr3",
				"Mini Lab: Re-home Behavior Without Breaking Clients"
			],
			[
				"design-patterns-in-java-part-2",
				"dpr5",
				"Mini Lab: Conditional Tangle Rescue"
			],
			[
				"design-patterns-in-java-part-2",
				"dpr6",
				"Mini Lab: Reduce Call-Site Noise in a Service Layer"
			],
			[
				"design-patterns-in-java-part-2",
				"dpr7",
				"Mini Lab: Repair a Parallel Hierarchy"
			],
			[
				"design-patterns-in-java-part-2",
				"dpr8",
				"Mini Lab: Refactor Until the Pattern Is Obvious"
			],
			[
				"design-patterns-in-java-part-2",
				"dpr9",
				"Mini Lab: Characterization Test then Structural Change"
			],
			["design-patterns-in-java", "dpj9", "Smell-to-Pattern Mapping"],
			["design-patterns-in-java", "dpj9", "When Not to Use the Pattern"],
			[
				"design-patterns-in-java",
				"dpj9",
				"Mini Lab: Improve a Brittle Object Model with Restraint"
			]
		] as const;

		for (const [courseId, moduleCode, oldTitle] of historicalLessons) {
			const course = await useCoursesStore().loadCourseById(courseId);
			const module = course?.modules.find(entry =>
				entry.id.startsWith(`${courseId}-${moduleCode}-`)
			);
			expect(module, `${courseId}-${moduleCode}`).toBeDefined();
			const previousId = historicalId(
				`${module?.id}-curriculum-${oldTitle}`
			);
			const owners = course?.modules
				.flatMap(entry => [
					...entry.curriculum,
					...entry.supplementalProjects
				])
				.filter(item => item.aliases?.includes(previousId));
			expect(owners, previousId).toHaveLength(1);
			expect(module?.curriculum, previousId).toContain(owners?.[0]);
		}
	});

	it("retains extension progress after specific project titles", async () => {
		setActivePinia(createPinia());
		const courseHistory = {
			"intro-to-physics": {
				module: /^intro-to-physics-phy(?:[89]|1[0-7])-/u,
				count: 10
			},
			"physics-level-2": {
				module: /^physics-level-2-phy(?:1[7-9]|2[0-4])-/u,
				count: 8
			},
			"scratch-level-1": {
				module: /^scratch-level-1-gs1[4-7]-/u,
				count: 4
			},
			"scratch-level-2": {
				module: /^scratch-level-2-gm1[2-5]-/u,
				count: 4
			}
		} as const;
		let checkedIds = 0;

		for (const [courseId, history] of Object.entries(courseHistory)) {
			const course = await useCoursesStore().loadCourseById(courseId);
			const allItems = course?.modules.flatMap(module => [
				...module.curriculum,
				...module.supplementalProjects
			]);
			const modules = course?.modules.filter(module =>
				history.module.test(module.id)
			);
			expect(modules, courseId).toHaveLength(history.count);
			for (const module of modules ?? []) {
				const previousId = `${module.id}-supplemental-extension-project`;
				const owners = allItems?.filter(item =>
					item.aliases?.includes(previousId)
				);
				expect(owners, previousId).toHaveLength(1);
				expect(module.supplementalProjects, previousId).toContain(
					owners?.[0]
				);
				checkedIds++;
			}
		}
		expect(checkedIds).toBe(26);
	});

	it("retains JavaScript Level 2 practice completions from before label changes", async () => {
		setActivePinia(createPinia());
		const course = await useCoursesStore().loadCourseById(
			"javascript-level-2-javascript-master"
		);
		const previousTopics = [
			["JSM1 Fundamentals Review", "Fundamentals Review"],
			["JSM3 Complex Conditionals", "Complex Conditionals"],
			["JSM4 Canvas", "Canvas"],
			["JSM5 Arrays and Iterators", "Arrays and Iterators"],
			["JSM6 Objects and Properties", "Objects and Properties"],
			["Check-In #1", "Check-In 1"],
			[
				"JSM7 Helper Functions and Event Listeners",
				"Helper Functions and Event Listeners"
			],
			["JSM8 Collisions and Controls", "Collisions and Controls"],
			["JSM9 Games in the Canvas", "Games in the Canvas"],
			["JSM10 APIs and Requests", "APIs and Requests"],
			["JSM12 NoSQL and CRUD", "NoSQL and CRUD"],
			["Check-In #2", "Check-In 2"],
			["JSM13 Message Board", "Message Board"],
			["JSM14 Quiz Game", "Quiz Game"],
			["JSM15 Master Project", "JavaScript Level 2: JavaScript Master"]
		] as const;
		const extensionOnly = new Set([
			"JSM4 Canvas",
			"JSM5 Arrays and Iterators",
			"JSM6 Objects and Properties",
			"JSM7 Helper Functions and Event Listeners"
		]);
		const allItems = course?.modules.flatMap(module => [
			...module.curriculum,
			...module.supplementalProjects
		]);
		let checkedIds = 0;

		for (const [moduleTitle, topic] of previousTopics) {
			const module = course?.modules.find(
				entry => entry.title === moduleTitle
			);
			expect(module, moduleTitle).toBeDefined();
			const practices = extensionOnly.has(moduleTitle)
				? ["Extension Practice"]
				: ["Transfer Practice", "Extension Practice"];
			for (const practice of practices) {
				const previousId = historicalId(
					`${module?.id}-supplemental-${practice}: ${topic}`
				);
				const owner = module?.supplementalProjects.find(item =>
					item.title.endsWith(practice)
				);
				expect(owner?.aliases, previousId).toContain(previousId);
				expect(owner?.id, previousId).not.toBe(previousId);
				expect(
					allItems?.filter(
						item =>
							item.id === previousId ||
							item.aliases?.includes(previousId)
					),
					previousId
				).toEqual([owner]);
				checkedIds++;
			}
		}
		expect(checkedIds).toBe(26);
	});

	it("retains Pythonic practice completions from before the label reorder", async () => {
		setActivePinia(createPinia());
		const course = await useCoursesStore().loadCourseById(
			"pythonic-design-patterns"
		);
		const previousTopics = [
			"Why Python Changes the Design-Patterns Conversation",
			"Design Foundations in Python",
			"Strategy Without Ceremony",
			"Factory and Builder in Python",
			"Observer, Events, and Callbacks",
			"Decorator, Proxy, and Facade",
			"State and Command",
			"Adapter and Integration Boundaries",
			"Method versus Higher-Order Functions",
			"Singleton, Global State, and Module Patterns",
			"Refactoring Python Code Smells",
			"Capstone Pythonic Refactor Studio"
		];
		const allItems = course?.modules.flatMap(module => [
			...module.curriculum,
			...module.supplementalProjects
		]);

		for (const [index, topic] of previousTopics.entries()) {
			const module = course?.modules.find(entry =>
				entry.title.startsWith(`PDP${index + 1} `)
			);
			expect(module, topic).toBeDefined();
			for (const practice of [
				"Transfer Practice",
				"Extension Practice"
			]) {
				const previousId = historicalId(
					`${module?.id}-supplemental-${practice}: ${topic}`
				);
				const owner = module?.supplementalProjects.find(item =>
					item.title.endsWith(practice)
				);
				expect(owner?.aliases, previousId).toContain(previousId);
				expect(owner?.id, previousId).not.toBe(previousId);
				expect(
					allItems?.filter(
						item =>
							item.id === previousId ||
							item.aliases?.includes(previousId)
					),
					previousId
				).toEqual([owner]);
			}
		}
	});

	it("retains Machine Learning completion owners from before the starter-build rename", async () => {
		setActivePinia(createPinia());
		const course =
			await useCoursesStore().loadCourseById("machine-learning");
		const topics = [
			["customer-segmentation", "Customer Segmentation"],
			["disney-movie-clustering", "Disney Movie Clustering"]
		] as const;
		const sections = [
			"core-concepts",
			"guided-example",
			"core-project",
			"review-and-reflection"
		] as const;
		const supplements = [
			"extension-challenge",
			"supplemental-2-implementation-lab",
			"supplemental-3-implementation-lab"
		] as const;

		for (const [topic, label] of topics) {
			const oldModuleId = `machine-learning-${topic}-implementation-lab`;
			const moduleOwners = course?.modules.filter(
				module =>
					module.id === oldModuleId ||
					module.aliases?.includes(oldModuleId)
			);
			expect(
				moduleOwners?.map(module => module.title),
				oldModuleId
			).toEqual([`${label} Starter Build: Practice Studio`]);
			for (const [section, suffixes] of [
				["curriculum", sections],
				["supplemental", supplements]
			] as const) {
				for (const [index, suffix] of suffixes.entries()) {
					const oldId = `${oldModuleId}-${section}-${topic}-${suffix}`;
					const historicalOwner =
						section === "curriculum"
							? moduleOwners?.[0].curriculum[index]
							: moduleOwners?.[0].supplementalProjects[index];
					const owners = course?.modules.flatMap(candidate =>
						[
							...candidate.curriculum,
							...candidate.supplementalProjects
						].filter(
							entry =>
								entry.id === oldId ||
								entry.aliases?.includes(oldId)
						)
					);
					expect(owners, oldId).toEqual([historicalOwner]);
				}
			}
		}
	});

	it("preserves progress through the archive and Swift enrichment renames", async () => {
		setActivePinia(createPinia());
		const store = useCoursesStore();
		const previousItems = [
			[
				"ai-level-1",
				"ai-level-1-fai0-setup-and-tooling-supplemental-legacy-archive-ai-level-1-workspace",
				"Reference Archive: AI Level 1 Workspace"
			],
			[
				"data-science-in-python",
				"data-science-in-python-dsp0-setup-and-tooling-supplemental-legacy-archive-data-science-in-python-workspace",
				"Reference Archive: Data Science in Python Workspace"
			],
			[
				"intro-to-swift-app-development",
				"intro-to-swift-app-development-sadx-enrichment-and-legacy-archive-boundaries-curriculum-core-concepts",
				"Canonical Swift Repo Structure"
			],
			[
				"intro-to-swift-app-development",
				"intro-to-swift-app-development-sadx-enrichment-and-legacy-archive-boundaries-curriculum-verification-review-sadx-enrichment-and-legacy-archive-boundaries",
				"Verification Review: Enrichment and Reference Boundaries"
			],
			[
				"intro-to-swift-app-development",
				"intro-to-swift-app-development-sadx-enrichment-and-legacy-archive-boundaries-curriculum-core-project-sadx-enrichment-and-legacy-archive-boundaries",
				"Core Project: Enrichment and Reference Boundaries"
			],
			[
				"intro-to-swift-app-development",
				"intro-to-swift-app-development-sadx-enrichment-and-legacy-archive-boundaries-supplemental-extension-swiftui-shapes-studio",
				"Extension: SwiftUI Shapes Studio"
			],
			[
				"intro-to-swift-app-development",
				"intro-to-swift-app-development-sadx-enrichment-and-legacy-archive-boundaries-supplemental-transfer-practice-sadx-enrichment-and-legacy-archive-boundaries",
				"SADX Enrichment and Reference Boundaries Transfer Practice"
			],
			[
				"intro-to-swift-app-development",
				"intro-to-swift-app-development-sadx-enrichment-and-legacy-archive-boundaries-supplemental-extension-practice-sadx-enrichment-and-legacy-archive-boundaries",
				"SADX Enrichment and Reference Boundaries Extension Practice"
			]
		] as const;

		for (const [courseId, previousId, currentTitle] of previousItems) {
			const course = await store.loadCourseById(courseId);
			const items = course?.modules.flatMap(module => [
				...module.curriculum,
				...module.supplementalProjects
			]);
			const currentItems = items?.filter(
				item => item.title === currentTitle
			);
			expect(currentItems, currentTitle).toHaveLength(1);
			expect(currentItems?.[0].aliases, previousId).toContain(previousId);
			const owners = items?.filter(
				item =>
					item.id === previousId || item.aliases?.includes(previousId)
			);
			expect(owners, previousId).toHaveLength(1);
		}

		const swiftCourse = await store.loadCourseById(
			"intro-to-swift-app-development"
		);
		const previousModuleId =
			"intro-to-swift-app-development-sadx-enrichment-and-legacy-archive-boundaries";
		const moduleOwners = swiftCourse?.modules.filter(
			module =>
				module.id === previousModuleId ||
				module.aliases?.includes(previousModuleId)
		);
		expect(moduleOwners).toHaveLength(1);
		expect(moduleOwners?.[0].title).toBe(
			"SWX Shapes and Legacy Reference Boundaries"
		);
	});

	it("retains generated appendix IDs from before the title revisions", async () => {
		setActivePinia(createPinia());
		const store = useCoursesStore();
		const renamedItems = [
			{
				moduleTitle: "Standards Map",
				moduleSuffix: "standards-map",
				intermediateSuffix: "course-foundations",
				items: [
					["curriculum", 0, "Source Map"],
					["supplemental", 0, "Standards Checkpoint"],
					["supplemental", 1, "Sequence Map"]
				]
			},
			{
				moduleTitle: "Course Roadmap",
				moduleSuffix: "course-roadmap",
				intermediateSuffix: "course-next-steps",
				items: [
					["curriculum", 0, "Module Options"],
					["curriculum", 1, "Resources"],
					["curriculum", 2, "Readiness Checklist"],
					["curriculum", 3, "Reference Refresh"],
					["supplemental", 0, "Dependency Graph"],
					["supplemental", 1, "Materials Readiness"]
				]
			}
		] as const;

		for (const courseId of researchBackedExpansionCourseIds) {
			const course = await store.loadCourseById(courseId);
			expect(course, courseId).not.toBeNull();
			for (const configuration of renamedItems) {
				const module = course?.modules.find(
					entry => entry.title === configuration.moduleTitle
				);
				expect(
					module,
					`${courseId}: ${configuration.moduleTitle}`
				).toBeDefined();
				expect(module?.aliases).toContain(
					`${courseId}-${configuration.intermediateSuffix}`
				);
				for (const [section, index, oldTitle] of configuration.items) {
					const item =
						section === "curriculum"
							? module?.curriculum[index]
							: module?.supplementalProjects[index];
					const oldId = historicalId(
						`${courseId}-${configuration.moduleSuffix}-${section}-${course!.name} ${oldTitle}`
					);
					expect(item?.aliases, `${courseId}: ${oldId}`).toContain(
						oldId
					);
				}
			}
		}
	}, 180000);

	it("retains the original chemistry course-map completion ID", async () => {
		setActivePinia(createPinia());
		const store = useCoursesStore();
		const course = await store.loadCourseById("intro-to-chemistry");
		expect(course?.modules[0].curriculum[0].aliases).toContain(
			"intro-to-chemistry-chm1-workflow-safety-measurement-and-models-curriculum-course-map-and-learning-workflow"
		);
	});

	it("retains the original Unity checkpoint completion ID without alias collisions", async () => {
		setActivePinia(createPinia());
		const store = useCoursesStore();
		const course = await store.loadCourseById("unity-game-development");
		const module = course?.modules.find(
			entry =>
				entry.title ===
				"UGD8 Full-Project Starter and Review Repository Plan"
		);
		const item = module?.curriculum.find(
			entry => entry.title === "Checkpoint Workflow"
		);
		const previousId =
			"unity-game-development-ugd8-full-project-starter-and-review-repository-plan-curriculum-session-workflow";

		expect(item?.id).toBe(
			"unity-game-development-ugd8-full-project-starter-and-review-repository-plan-curriculum-checkpoint-workflow"
		);
		expect(item?.aliases).toContain(previousId);
		const owners = course?.modules.flatMap(entry =>
			[...entry.curriculum, ...entry.supplementalProjects].filter(
				candidate =>
					candidate.id === previousId ||
					candidate.aliases?.includes(previousId)
			)
		);
		expect(owners).toEqual([item]);
	});

	it("retains the ten original Algebra project-brief completion IDs", async () => {
		setActivePinia(createPinia());
		const store = useCoursesStore();
		const cases = [
			[
				"algebra-1a",
				"algebra-1a-aa3-module-project-movie-star-status-with-maddie-van-beek",
				"Movie Star Status Project Brief",
				"project-brief"
			],
			[
				"algebra-1a",
				"algebra-1a-aa5-module-project-free-swag-with-amisha-sisodiya",
				"Free Swag Project Brief",
				"project-brief"
			],
			[
				"algebra-1a",
				"algebra-1a-aa7-module-project-community-data-analysis-with-davin-lee",
				"Community Data Analysis Project Brief",
				"project-brief"
			],
			[
				"algebra-1a",
				"algebra-1a-aa11-module-project-predicting-avalanches-with-ruby-lee",
				"Avalanche Prediction Project Brief",
				"project-brief"
			],
			[
				"algebra-1a",
				"algebra-1a-aa15-module-project-cytogenetics-quest-with-dr-renu-bajaj",
				"Cytogenetics Quest Project Brief",
				"project-brief"
			],
			[
				"algebra-1a",
				"algebra-1a-aa16-module-project-battle-of-the-publications-with-konstantin-kaganovsky",
				"Battle of the Publications Project Brief",
				"project-brief"
			],
			[
				"algebra-1b",
				"algebra-1b-ab4-module-project-smart-and-elegant-with-amy-katz",
				"Smart and Elegant Project Brief",
				"project-brief"
			],
			[
				"algebra-1b",
				"algebra-1b-ab16-module-project-j-t-phone-home",
				"J.T. Phone Home Project Brief",
				"project-brief"
			],
			[
				"algebra-1b",
				"algebra-1b-ab20-module-project-the-mysteries-of-light-with-blake-eaton",
				"Mysteries of Light Project Brief",
				"project-brief"
			],
			[
				"algebra-1b",
				"algebra-1b-ab21-module-project-radiofungi-with-sunanda-sharma",
				"Radiofungi Project Brief and Answers",
				"project-brief-and-cleaned-answers"
			]
		] as const;

		for (const [courseId, moduleId, title, previousSuffix] of cases) {
			const course = await store.loadCourseById(courseId);
			const item = course?.modules
				.find(module => module.id === moduleId)
				?.curriculum.find(entry => entry.title === title);
			const previousId = `${moduleId}-curriculum-${previousSuffix}`;
			expect(item, previousId).toBeDefined();
			expect(item?.id).not.toBe(previousId);
			expect(item?.aliases, previousId).toContain(previousId);
		}
	});

	it("retains the twenty original Physics representation and reflection IDs", async () => {
		setActivePinia(createPinia());
		const store = useCoursesStore();
		const course = await store.loadCourseById("intro-to-physics");
		const cases = [
			[
				"intro-to-physics-phy8-momentum-impulse-and-collisions",
				"Momentum Graph and Data Exercise",
				"Momentum Transfer Reflection"
			],
			[
				"intro-to-physics-phy9-rotational-motion-and-torque-basics",
				"Torque Diagram and Data Exercise",
				"Torque Transfer Reflection"
			],
			[
				"intro-to-physics-phy10-fluids-pressure-and-buoyancy",
				"Fluids Data Representation",
				"Fluids Transfer Reflection"
			],
			[
				"intro-to-physics-phy11-heat-temperature-and-thermal-energy",
				"Thermal Graph and Data Exercise",
				"Thermal Design Transfer Reflection"
			],
			[
				"intro-to-physics-phy12-optics-mirrors-lenses-and-images",
				"Optics Ray-Diagram Exercise",
				"Optics Transfer Reflection"
			],
			[
				"intro-to-physics-phy13-magnetism-and-electromagnetic-induction",
				"Electromagnetic Device Diagram",
				"Electromagnetism Transfer Reflection"
			],
			[
				"intro-to-physics-phy14-simple-harmonic-motion-and-resonance",
				"Oscillation Graph Exercise",
				"Resonance Transfer Reflection"
			],
			[
				"intro-to-physics-phy15-astronomy-gravity-and-orbits",
				"Orbit Data and Diagram Exercise",
				"Orbit Transfer Reflection"
			],
			[
				"intro-to-physics-phy16-modern-physics-and-model-limits",
				"Modern Physics Evidence Diagram",
				"Model-Limit Transfer Reflection"
			],
			[
				"intro-to-physics-phy17-engineering-design-and-physics-portfolio",
				"Portfolio Evidence Representation",
				"Portfolio Transfer Reflection"
			]
		] as const;

		for (const [moduleId, representationTitle, reflectionTitle] of cases) {
			const module = course?.modules.find(entry => entry.id === moduleId);
			for (const [title, suffix] of [
				[representationTitle, "graph-diagram-or-data-exercise"],
				[reflectionTitle, "reflection-and-transfer-practice"]
			] as const) {
				const item = module?.curriculum.find(
					entry => entry.title === title
				);
				const previousId = `${moduleId}-curriculum-${suffix}`;
				expect(item, previousId).toBeDefined();
				expect(item?.id).not.toBe(previousId);
				expect(item?.aliases, previousId).toContain(previousId);
			}
		}
	});

	it("retains the first Web Development title-change completion IDs", async () => {
		setActivePinia(createPinia());
		const store = useCoursesStore();
		const course = await store.loadCourseById(
			"web-development-foundations"
		);
		const renamedItems = [
			[
				"Setup and Tooling supplemental 2",
				"Setup and Tooling Transfer Practice"
			],
			[
				"Setup and Tooling supplemental 3",
				"Setup and Tooling Extension Practice"
			],
			[
				"Why the JavaScript Path Should Expand into Web Development",
				"JavaScript Path Into Web Development"
			],
			[
				"Positioning, Goals, and Suggested Course Family supplemental 2",
				"Course Path Transfer Practice"
			],
			[
				"Positioning, Goals, and Suggested Course Family supplemental 3",
				"Course Path Extension Practice"
			],
			[
				"Stage 1: Strengthen the Existing JavaScript Courses supplemental 2",
				"JavaScript Bridge Transfer Practice"
			],
			[
				"Stage 1: Strengthen the Existing JavaScript Courses supplemental 3",
				"JavaScript Bridge Extension Practice"
			],
			[
				"Stage 2: Web Development Foundations supplemental 2",
				"Web Foundations Transfer Practice"
			],
			[
				"Stage 2: Web Development Foundations supplemental 3",
				"Web Foundations Extension Practice"
			],
			[
				"Stage 3: Front End Applications supplemental 2",
				"Front-End Apps Transfer Practice"
			],
			[
				"Stage 3: Front End Applications supplemental 3",
				"Front-End Apps Extension Practice"
			],
			[
				"Stage 4: Back End Basics supplemental 2",
				"Back-End Basics Transfer Practice"
			],
			[
				"Stage 4: Back End Basics supplemental 3",
				"Back-End Basics Extension Practice"
			],
			[
				"Stage 5: Databases and Data Models supplemental 2",
				"Database Models Transfer Practice"
			],
			[
				"Stage 5: Databases and Data Models supplemental 3",
				"Database Models Extension Practice"
			],
			[
				"Stage 6: Hosting and Deployment supplemental 2",
				"Hosting Deployment Transfer Practice"
			],
			[
				"Stage 6: Hosting and Deployment supplemental 3",
				"Hosting Deployment Extension Practice"
			],
			[
				"Hosting and Operations Topics to Add supplemental 2",
				"Hosting Ops Transfer Practice"
			],
			[
				"Hosting and Operations Topics to Add supplemental 3",
				"Hosting Ops Extension Practice"
			],
			[
				"Good Practical Projects supplemental 2",
				"Practical Projects Transfer Practice"
			],
			[
				"Good Practical Projects supplemental 3",
				"Practical Projects Extension Practice"
			],
			[
				"Suggested Advanced Strand supplemental 2",
				"Operations Strand Transfer Practice"
			],
			[
				"Suggested Advanced Strand supplemental 3",
				"Operations Strand Extension Practice"
			],
			[
				"Integration with Network Topics supplemental 2",
				"Network Integration Transfer Practice"
			],
			[
				"Integration with Network Topics supplemental 3",
				"Network Integration Extension Practice"
			],
			[
				"Expansion Ideas and Next Steps supplemental 2",
				"Next Steps Transfer Practice"
			],
			[
				"Expansion Ideas and Next Steps supplemental 3",
				"Next Steps Extension Practice"
			]
		] as const;
		const authoredItems = webDevelopmentFoundationsCourse.modules.flatMap(
			module => [
				...module.curriculum.map(item => ({
					module,
					section: "curriculum" as const,
					item
				})),
				...module.supplementalProjects.map(item => ({
					module,
					section: "supplemental" as const,
					item
				}))
			]
		);
		const allItems =
			course?.modules.flatMap(module => [
				...module.curriculum.map(item => ({
					module,
					section: "curriculum" as const,
					item
				})),
				...module.supplementalProjects.map(item => ({
					module,
					section: "supplemental" as const,
					item
				}))
			]) ?? [];

		for (const [oldTitle, currentTitle] of renamedItems) {
			const matches = authoredItems.filter(
				({ item }) => item.title === currentTitle
			);
			expect(matches, currentTitle).toHaveLength(1);
			const [{ module, section, item }] = matches;
			expect(item.aliases, oldTitle).toContain(oldTitle);
			const oldId = historicalId(
				`web-development-foundations-${module.title}-${section}-${oldTitle}`
			);
			const owners = allItems
				.filter(
					({ item: candidate }) =>
						candidate.id === oldId ||
						candidate.aliases?.includes(oldId)
				)
				.map(({ item: candidate }) => candidate);
			expect(owners, oldId).toHaveLength(1);
		}
	}, 180000);

	it("retains both original Web Development lab progress identities", async () => {
		setActivePinia(createPinia());
		const store = useCoursesStore();
		const course = await store.loadCourseById(
			"web-development-foundations"
		);
		const labs = [
			{
				number: 14,
				current: "Feature Slice Studio",
				curriculum: [
					["Core Concepts", "Core Concepts"],
					["Guided Example", "Guided Example"],
					["Core Project", "Core Project"],
					["Review", "Review and Reflection"]
				],
				supplemental: [
					["Extension Challenge", "Extension Challenge"],
					[
						"Feature Slice Transfer Practice",
						"Full Stack Web Lab 14 Transfer Practice"
					],
					[
						"Feature Slice Extension Practice",
						"Full Stack Web Lab 14 Extension Practice"
					]
				]
			},
			{
				number: 15,
				current: "API Integration Studio",
				curriculum: [
					["Core Concepts", "Core Concepts"],
					["Guided Example", "Guided Example"],
					["Core Project", "Core Project"],
					["Review", "Review and Reflection"]
				],
				supplemental: [
					["Extension Challenge", "Extension Challenge"],
					[
						"API Integration Transfer Practice",
						"Full Stack Web Lab 15 Transfer Practice"
					],
					[
						"API Integration Extension Practice",
						"Full Stack Web Lab 15 Extension Practice"
					]
				]
			},
			{
				number: 16,
				current: "Data Persistence Studio",
				curriculum: [
					["Core Concepts", "Core Concepts"],
					["Guided Example", "Guided Example"],
					["Core Project", "Core Project"],
					["Review", "Review and Reflection"]
				],
				supplemental: [
					["Extension Challenge", "Extension Challenge"],
					[
						"Data Persistence Transfer Practice",
						"Full Stack Web Lab 16 Transfer Practice"
					],
					[
						"Data Persistence Extension Practice",
						"Full Stack Web Lab 16 Extension Practice"
					]
				]
			},
			{
				number: 17,
				current: "Deployment Readiness Studio",
				curriculum: [
					["Core Concepts", "Core Concepts"],
					["Guided Example", "Guided Example"],
					["Core Project", "Core Project"],
					["Review", "Review and Reflection"]
				],
				supplemental: [
					["Extension Challenge", "Extension Challenge"],
					[
						"Deployment Readiness Transfer Practice",
						"Full Stack Web Lab 17 Transfer Practice"
					],
					[
						"Deployment Readiness Extension Practice",
						"Full Stack Web Lab 17 Extension Practice"
					]
				]
			}
		] as const;

		for (const lab of labs) {
			const oldModuleId = historicalId(
				`web-development-foundations-Full Stack Web Lab ${lab.number}: Implementation Lab`
			);
			const module = course?.modules.find(entry =>
				entry.aliases?.includes(oldModuleId)
			);
			expect(module, oldModuleId).toBeDefined();
			expect(module?.title).toContain(lab.current);
			expect(module?.aliases, oldModuleId).toContain(oldModuleId);

			for (const [section, entries] of [
				["curriculum", lab.curriculum],
				["supplemental", lab.supplemental]
			] as const) {
				for (const [currentTitle, oldTitle] of entries) {
					const oldFullTitle = oldTitle.startsWith("Full Stack")
						? oldTitle
						: `Full Stack Web Lab ${lab.number}: ${oldTitle}`;
					const oldItemId = historicalId(
						`${oldModuleId}-${section}-${oldFullTitle}`
					);
					const sectionItems =
						section === "curriculum"
							? module?.curriculum
							: module?.supplementalProjects;
					const item = sectionItems?.find(entry =>
						entry.aliases?.includes(oldItemId)
					);
					expect(item, `${currentTitle}: ${oldItemId}`).toBeDefined();
					const owners = course?.modules.flatMap(entry =>
						[
							...entry.curriculum,
							...entry.supplementalProjects
						].filter(
							candidate =>
								candidate.id === oldItemId ||
								candidate.aliases?.includes(oldItemId)
						)
					);
					expect(owners, oldItemId).toEqual([item]);
					if (
						oldTitle.endsWith("Transfer Practice") ||
						oldTitle.endsWith("Extension Practice")
					) {
						const ordinal = oldTitle.endsWith("Transfer Practice")
							? 2
							: 3;
						const oldestItemId = historicalId(
							`${oldModuleId}-supplemental-Full Stack Web Lab ${lab.number} supplemental ${ordinal}: Implementation Lab`
						);
						expect(item?.aliases, oldestItemId).toContain(
							oldestItemId
						);
						const oldestOwners = course?.modules.flatMap(entry =>
							[
								...entry.curriculum,
								...entry.supplementalProjects
							].filter(
								candidate =>
									candidate.id === oldestItemId ||
									candidate.aliases?.includes(oldestItemId)
							)
						);
						expect(oldestOwners, oldestItemId).toEqual([item]);
					}
				}
			}
		}
	});

	it("retains the intermediate Machine Learning sequence ID", async () => {
		setActivePinia(createPinia());
		const store = useCoursesStore();
		const course = await store.loadCourseById("machine-learning");
		const module = course?.modules.find(
			entry => entry.title === "Standards Map"
		);
		expect(module?.supplementalProjects[1].aliases).toContain(
			"machine-learning-course-foundations-supplemental-machine-learning-learning-sequence"
		);
	});

	it("recognizes section IDs from the generic-title era", async () => {
		setActivePinia(createPinia());
		const store = useCoursesStore();
		const scratchModules = [
			["scratch-level-1", "scratch-level-1-gs14-mini-game-polish-studio"],
			[
				"scratch-level-1",
				"scratch-level-1-gs15-interactive-story-studio"
			],
			[
				"scratch-level-1",
				"scratch-level-1-gs16-debugging-and-remix-studio"
			],
			[
				"scratch-level-1",
				"scratch-level-1-gs17-text-based-programming-bridge"
			],
			["scratch-level-2", "scratch-level-2-gm12-arcade-systems-studio"],
			[
				"scratch-level-2",
				"scratch-level-2-gm13-simulation-and-data-studio"
			],
			[
				"scratch-level-2",
				"scratch-level-2-gm14-code-organization-and-debugging-studio"
			],
			[
				"scratch-level-2",
				"scratch-level-2-gm15-text-based-programming-bridge"
			]
		] as const;

		for (const [courseId, oldModuleId] of scratchModules) {
			const course = await store.loadCourseById(courseId);
			const module = course?.modules.find(
				entry => entry.id === oldModuleId
			);
			expect(module, oldModuleId).toBeDefined();
			const itemAliases = [
				...(module?.curriculum ?? []),
				...(module?.supplementalProjects ?? [])
			].flatMap(item => item.aliases ?? []);
			for (const oldId of [
				`${oldModuleId}-curriculum-core-concepts`,
				`${oldModuleId}-curriculum-build-requirements`,
				`${oldModuleId}-supplemental-common-bug-patterns`
			]) {
				expect(itemAliases, oldId).toContain(oldId);
			}
		}

		const dataScienceModules = [
			"data-science-in-python-dsp10-applied-studio-csv-summaries-and-sanity-checks",
			"data-science-in-python-dsp11-applied-studio-cleaning-missing-and-invalid-rows",
			"data-science-in-python-dsp12-applied-studio-grouped-summaries-by-category",
			"data-science-in-python-dsp13-applied-studio-visualization-choice-and-chart-integrity",
			"data-science-in-python-dsp14-applied-studio-reproducible-mini-reports",
			"data-science-in-python-dsp15-applied-studio-lightweight-dashboards-and-filters",
			"data-science-in-python-dsp16-applied-studio-capstone-data-story-readiness"
		];
		const dataScienceCourse = await store.loadCourseById(
			"data-science-in-python"
		);
		for (const oldModuleId of dataScienceModules) {
			const module = dataScienceCourse?.modules.find(
				entry => entry.id === oldModuleId
			);
			expect(module, oldModuleId).toBeDefined();
			expect(module?.curriculum[0].aliases).toContain(
				`${oldModuleId}-curriculum-concept-path`
			);
			expect(module?.curriculum[1].aliases).toContain(
				`${oldModuleId}-curriculum-worked-example`
			);
		}
	});

	it("recognizes IDs from legacy-branded project titles", async () => {
		setActivePinia(createPinia());
		const store = useCoursesStore();
		const cases = [
			{
				courseId: "python-level-2",
				currentTitle: "PS2 Supplemental Project 8: Archery Simulator",
				oldId: "python-level-2-ps2-for-loops-and-while-loops-supplemental-ps2-supplemental-project-8-juni-archery"
			},
			{
				courseId: "python-level-2",
				currentTitle: "PS5 Supplemental Project 2: Word Translator",
				oldId: "python-level-2-ps5-functions-supplemental-ps5-supplemental-project-2-juni-latin"
			},
			{
				courseId: "python-level-2",
				currentTitle: "PS11 Supplemental Project 2: Theme Park Planner",
				oldId: "python-level-2-ps11-bank-account-supplemental-ps11-supplemental-project-2-juni-world"
			},
			{
				courseId: "python-level-3",
				currentTitle: "AM1 Project 2: Fictional Language Verifier",
				oldId: "python-level-3-am1-review-variables-strings-input-loops-conditionals-curriculum-am1-project-2-junian-language-verifier"
			},
			{
				courseId: "python-level-3",
				currentTitle: "AM1 Project 3: Command Assistant",
				oldId: "python-level-3-am1-review-variables-strings-input-loops-conditionals-curriculum-am1-project-3-juni-assistant"
			},
			{
				courseId: "python-level-3",
				currentTitle: "AM12 Project 3: Word Translator with File I/O",
				oldId: "python-level-3-am12-file-input-output-curriculum-am12-project-3-juni-latin-with-file-io"
			},
			{
				courseId: "ai-level-1",
				currentTitle: "Project: Book Rule System",
				oldId: "ai-level-1-unit-5-rule-based-systems-and-puzzle-framing-supplemental-project-juni-book-rule-system"
			},
			{
				courseId: "java-level-3",
				currentTitle: "AJ10 Project 1: Bakery Model",
				oldId: "java-level-3-aj10-sustainable-programming-curriculum-aj10-project-1-juni-bakery"
			},
			{
				courseId: "java-level-3",
				currentTitle: "AJ15 Project 2: Mini Search Engine",
				oldId: "java-level-3-aj15-hash-tables-curriculum-aj15-project-2-juni-search-engine"
			},
			{
				courseId: "javascript-level-1-javascript-superstar",
				currentTitle: "JSS8 Supplemental Project 1: Archery Simulator",
				oldId: "javascript-level-1-javascript-superstar-jss8-nested-loops-supplemental-jss8-supplemental-project-1-juni-archery"
			},
			{
				courseId: "javascript-level-1-javascript-superstar",
				currentTitle:
					"JSS15 Supplemental Project 1: Restaurant Splash Page",
				oldId: "javascript-level-1-javascript-superstar-jss15-master-project-supplemental-jss15-supplemental-project-1-juni-eatz"
			},
			{
				courseId: "javascript-level-1-javascript-superstar",
				currentTitle: "JSS15 Supplemental Project 2: News Homepage",
				oldId: "javascript-level-1-javascript-superstar-jss15-master-project-supplemental-jss15-supplemental-project-2-juni-news"
			},
			{
				courseId: "javascript-level-2-javascript-master",
				currentTitle: "JSM3 Project 2: Department Store Discounts",
				oldId: "javascript-level-2-javascript-master-jsm3-complex-conditionals-curriculum-jsm3-project-2-juni-department-store"
			}
		];

		for (const { courseId, currentTitle, oldId } of cases) {
			const course = await store.loadCourseById(courseId);
			const item = course?.modules
				.flatMap(module => [
					...module.curriculum,
					...module.supplementalProjects
				])
				.find(item => item.title === currentTitle);
			expect(item, currentTitle).toBeDefined();
			expect(item?.aliases, oldId).toContain(oldId);
		}
	});

	it("retains generated applied-challenge completions after transfer-project renaming", async () => {
		setActivePinia(createPinia());
		const store = useCoursesStore();
		const historicalIds = [
			[
				"python-level-1",
				"python-level-1-check-in-1-supplemental-applied-challenge"
			],
			[
				"python-level-3",
				"python-level-3-am7-binary-search-supplemental-applied-challenge"
			]
		] as const;

		for (const [courseId, historicalId] of historicalIds) {
			const course = await store.loadCourseById(courseId);
			const owners = course?.modules.flatMap(module =>
				module.supplementalProjects.filter(
					item =>
						item.id === historicalId ||
						item.aliases?.includes(historicalId)
				)
			);
			expect(owners, historicalId).toHaveLength(1);
		}

		const retiredCourse = await store.loadCourseById("cpp-level-2");
		const retiredId =
			"cpp-level-2-cppm1-pointers-and-addresses-supplemental-applied-challenge";
		expect(
			unmatchedCourseProgress(retiredCourse, {
				courseId: "cpp-level-2",
				completedModuleIds: [],
				completedItemIds: [retiredId]
			})
		).toEqual([{ id: retiredId, kind: "item" }]);
	});

	it("retains all changed generated-project IDs as current aliases or exact archived history", async () => {
		setActivePinia(createPinia());
		const store = useCoursesStore();
		expect(generatedProjectHistory).toHaveLength(72);

		for (const {
			course: courseId,
			oldId,
			newId
		} of generatedProjectHistory) {
			const course = await store.loadCourseById(courseId);
			const items =
				course?.modules.flatMap(
					module => module.supplementalProjects
				) ?? [];
			const oldOwners = items.filter(
				item => item.id === oldId || item.aliases?.includes(oldId)
			);
			const newOwners = items.filter(
				item => item.id === newId || item.aliases?.includes(newId)
			);
			expect(oldOwners.length, oldId).toBeLessThanOrEqual(1);
			expect(newOwners.length, newId).toBeLessThanOrEqual(1);
			if (newOwners.length) {
				expect(oldOwners, oldId).toEqual(newOwners);
			} else if (!oldOwners.length) {
				expect(
					unmatchedCourseProgress(course, {
						courseId,
						completedModuleIds: [],
						completedItemIds: [oldId]
					})
				).toEqual([{ id: oldId, kind: "item" }]);
			}
		}
	});

	it("keeps USACO studio completions on the same moved lessons", async () => {
		setActivePinia(createPinia());
		const store = useCoursesStore();
		expect(usacoStudioHistory).toHaveLength(216);
		expect(
			usacoStudioHistory.filter(entry => entry.currentId)
		).toHaveLength(188);

		for (const {
			course: courseId,
			kind,
			oldId,
			newId,
			currentId
		} of usacoStudioHistory) {
			const course = await store.loadCourseById(courseId);
			const modules = course?.modules ?? [];
			const items = modules.flatMap(module => [
				...module.curriculum,
				...module.supplementalProjects
			]);
			if (currentId) {
				const currentItem = items.find(item => item.id === currentId);
				expect(currentItem, currentId).toBeDefined();
				expect(currentItem?.aliases, oldId).toContain(oldId);
				expect(
					currentId.split(/-(?:curriculum|supplemental)-/).at(-1),
					currentId
				).toBe(newId.split(/-(?:curriculum|supplemental)-/).at(-1));
			} else {
				expect(kind === "module" || oldId.endsWith("-stacks")).toBe(
					true
				);
				expect(
					unmatchedCourseProgress(course, {
						courseId,
						completedModuleIds: kind === "module" ? [oldId] : [],
						completedItemIds: kind === "item" ? [oldId] : []
					})
				).toEqual([{ id: oldId, kind }]);
			}
		}
	});

	it("preserves AP CSA progress through the course reorganization", async () => {
		setActivePinia(createPinia());
		const course = await useCoursesStore().loadCourseById(
			"ap-computer-science-a"
		);
		const modules = course?.modules ?? [];
		const items = modules.flatMap(module => [
			...module.curriculum,
			...module.supplementalProjects
		]);
		expect(apcsaCourseHistory).toHaveLength(154);
		expect(
			apcsaCourseHistory.filter(entry => !entry.currentId)
		).toHaveLength(7);

		for (const { kind, oldId, currentId } of apcsaCourseHistory) {
			const entities = kind === "module" ? modules : items;
			const owners = entities.filter(
				entity => entity.id === oldId || entity.aliases?.includes(oldId)
			);
			if (currentId) {
				expect(
					owners.map(entity => entity.id),
					oldId
				).toEqual([currentId]);
			} else {
				expect(owners, oldId).toEqual([]);
				expect(
					unmatchedCourseProgress(course, {
						courseId: "ap-computer-science-a",
						completedModuleIds: kind === "module" ? [oldId] : [],
						completedItemIds: kind === "item" ? [oldId] : []
					})
				).toEqual([{ id: oldId, kind }]);
			}
		}
	});

	it("preserves machine-learning progress through studio title changes", async () => {
		setActivePinia(createPinia());
		const course =
			await useCoursesStore().loadCourseById("machine-learning");
		const modules = course?.modules ?? [];
		const items = modules.flatMap(module => [
			...module.curriculum,
			...module.supplementalProjects
		]);
		expect(machineLearningCourseHistory).toHaveLength(66);
		expect(
			machineLearningCourseHistory.filter(entry => !entry.currentId)
		).toHaveLength(2);

		for (const { kind, oldId, currentId } of machineLearningCourseHistory) {
			const entities = kind === "module" ? modules : items;
			const owners = entities.filter(
				entity => entity.id === oldId || entity.aliases?.includes(oldId)
			);
			if (currentId) {
				expect(
					owners.map(entity => entity.id),
					oldId
				).toEqual([currentId]);
			} else {
				expect(owners, oldId).toEqual([]);
				expect(
					unmatchedCourseProgress(course, {
						courseId: "machine-learning",
						completedModuleIds: kind === "module" ? [oldId] : [],
						completedItemIds: kind === "item" ? [oldId] : []
					})
				).toEqual([{ id: oldId, kind }]);
			}
		}
	});

	it("preserves Design Patterns Part 2 progress through clinic relabeling and consolidation", async () => {
		setActivePinia(createPinia());
		const course = await useCoursesStore().loadCourseById(
			"design-patterns-in-java-part-2"
		);
		const modules = course?.modules ?? [];
		const items = modules.flatMap(module => [
			...module.curriculum,
			...module.supplementalProjects
		]);
		expect(designPatternsPart2History).toHaveLength(76);
		expect(
			designPatternsPart2History.filter(entry => !entry.currentId)
		).toHaveLength(7);

		for (const { kind, oldId, currentId } of designPatternsPart2History) {
			const entities = kind === "module" ? modules : items;
			const owners = entities.filter(
				entity => entity.id === oldId || entity.aliases?.includes(oldId)
			);
			if (currentId) {
				expect(
					owners.map(entity => entity.id),
					oldId
				).toEqual([currentId]);
			} else {
				expect(kind).toBe("module");
				expect(owners, oldId).toEqual([]);
				expect(
					unmatchedCourseProgress(course, {
						courseId: "design-patterns-in-java-part-2",
						completedModuleIds: [oldId],
						completedItemIds: []
					})
				).toEqual([{ id: oldId, kind }]);
			}
		}
	});

	it("preserves Linux Systems progress through lesson relabeling and studio consolidation", async () => {
		setActivePinia(createPinia());
		const course = await useCoursesStore().loadCourseById("linux-systems");
		const modules = course?.modules ?? [];
		const items = modules.flatMap(module => [
			...module.curriculum,
			...module.supplementalProjects
		]);
		expect(linuxCourseHistory).toHaveLength(58);
		expect(
			linuxCourseHistory.filter(entry => !entry.currentId)
		).toHaveLength(3);

		for (const { kind, oldId, currentId } of linuxCourseHistory) {
			const entities = kind === "module" ? modules : items;
			const owners = entities.filter(
				entity => entity.id === oldId || entity.aliases?.includes(oldId)
			);
			if (currentId) {
				expect(
					owners.map(entity => entity.id),
					oldId
				).toEqual([currentId]);
			} else {
				expect(kind).toBe("module");
				expect(owners, oldId).toEqual([]);
				expect(
					unmatchedCourseProgress(course, {
						courseId: "linux-systems",
						completedModuleIds: [oldId],
						completedItemIds: []
					})
				).toEqual([{ id: oldId, kind }]);
			}
		}
	});

	it("preserves Assembly progress through lesson relabeling and studio consolidation", async () => {
		setActivePinia(createPinia());
		const course = await useCoursesStore().loadCourseById("assembly");
		const modules = course?.modules ?? [];
		const items = modules.flatMap(module => [
			...module.curriculum,
			...module.supplementalProjects
		]);
		expect(assemblyCourseHistory).toHaveLength(52);
		expect(
			assemblyCourseHistory.filter(entry => !entry.currentId)
		).toHaveLength(3);

		for (const { kind, oldId, currentId } of assemblyCourseHistory) {
			const entities = kind === "module" ? modules : items;
			const owners = entities.filter(
				entity => entity.id === oldId || entity.aliases?.includes(oldId)
			);
			if (currentId) {
				expect(
					owners.map(entity => entity.id),
					oldId
				).toEqual([currentId]);
			} else {
				expect(kind).toBe("module");
				expect(owners, oldId).toEqual([]);
				expect(
					unmatchedCourseProgress(course, {
						courseId: "assembly",
						completedModuleIds: [oldId],
						completedItemIds: []
					})
				).toEqual([{ id: oldId, kind }]);
			}
		}
	});

	it("preserves Algebra practice progress without reassigning retired exercises", async () => {
		setActivePinia(createPinia());
		const store = useCoursesStore();
		const courses = new Map();
		expect(algebraCourseHistory).toHaveLength(142);
		expect(
			algebraCourseHistory.filter(entry => !entry.currentId)
		).toHaveLength(16);

		for (const {
			courseId,
			oldId,
			newId,
			currentId
		} of algebraCourseHistory) {
			if (!courses.has(courseId))
				courses.set(courseId, await store.loadCourseById(courseId));
			const course = courses.get(courseId);
			const items = course?.modules.flatMap(module => [
				...module.curriculum,
				...module.supplementalProjects
			]);
			for (const previousId of [oldId, newId]) {
				const owners = items?.filter(
					item =>
						item.id === previousId ||
						item.aliases?.includes(previousId)
				);
				if (currentId) {
					expect(
						owners?.map(item => item.id),
						previousId
					).toEqual([currentId]);
				} else {
					expect(owners, previousId).toEqual([]);
					expect(
						unmatchedCourseProgress(course, {
							courseId,
							completedModuleIds: [],
							completedItemIds: [previousId]
						})
					).toEqual([{ id: previousId, kind: "item" }]);
				}
			}
		}
	});

	it("preserves C++ algorithm progress without merging retired lab completions", async () => {
		setActivePinia(createPinia());
		const courseId = "data-structures-and-algorithms-in-cpp";
		const course = await useCoursesStore().loadCourseById(courseId);
		const modules = course?.modules ?? [];
		const items = modules.flatMap(module => [
			...module.curriculum,
			...module.supplementalProjects
		]);
		expect(cppAlgorithmsCourseHistory).toHaveLength(76);
		expect(
			cppAlgorithmsCourseHistory.filter(entry => !entry.currentId)
		).toHaveLength(7);

		for (const {
			kind,
			oldId,
			newId,
			currentId
		} of cppAlgorithmsCourseHistory) {
			const entities = kind === "module" ? modules : items;
			for (const previousId of [oldId, newId]) {
				const owners = entities.filter(
					entity =>
						entity.id === previousId ||
						entity.aliases?.includes(previousId)
				);
				if (currentId) {
					expect(
						owners.map(entity => entity.id),
						previousId
					).toEqual([currentId]);
				} else {
					expect(kind).toBe("module");
					expect(owners, previousId).toEqual([]);
					expect(
						unmatchedCourseProgress(course, {
							courseId,
							completedModuleIds: [previousId],
							completedItemIds: []
						})
					).toEqual([{ id: previousId, kind: "module" }]);
				}
			}
		}
	});

	it("preserves systems and C++ pattern progress through studio regrouping", async () => {
		setActivePinia(createPinia());
		const store = useCoursesStore();
		for (const { courseId, history, retired } of [
			{
				courseId: "network-systems",
				history: networkSystemsCourseHistory,
				retired: 2
			},
			{
				courseId: "low-level-security-part-2",
				history: lowLevelSecurityPart2CourseHistory,
				retired: 0
			},
			{
				courseId: "design-patterns-in-cpp",
				history: cppDesignPatternsCourseHistory,
				retired: 4
			}
		]) {
			const course = await store.loadCourseById(courseId);
			const modules = course?.modules ?? [];
			const items = modules.flatMap(module => [
				...module.curriculum,
				...module.supplementalProjects
			]);
			expect(history.filter(entry => !entry.currentId)).toHaveLength(
				retired
			);
			for (const { kind, oldId, newId, currentId } of history) {
				const entities = kind === "module" ? modules : items;
				for (const previousId of [oldId, newId]) {
					const owners = entities.filter(
						entity =>
							entity.id === previousId ||
							entity.aliases?.includes(previousId)
					);
					if (currentId) {
						expect(
							owners.map(entity => entity.id),
							previousId
						).toEqual([currentId]);
					} else {
						expect(kind).toBe("module");
						expect(owners, previousId).toEqual([]);
						expect(
							unmatchedCourseProgress(course, {
								courseId,
								completedModuleIds: [previousId],
								completedItemIds: []
							})
						).toEqual([{ id: previousId, kind: "module" }]);
					}
				}
			}
		}
	});

	it("preserves Java Level 2 practice progress without merging retired studios", async () => {
		setActivePinia(createPinia());
		const courseId = "java-level-2";
		const course = await useCoursesStore().loadCourseById(courseId);
		const modules = course?.modules ?? [];
		const items = modules.flatMap(module => [
			...module.curriculum,
			...module.supplementalProjects
		]);
		expect(javaLevel2CourseHistory).toHaveLength(34);
		expect(
			javaLevel2CourseHistory.filter(entry => !entry.currentId)
		).toHaveLength(2);

		for (const {
			kind,
			oldId,
			newId,
			currentId
		} of javaLevel2CourseHistory) {
			const entities = kind === "module" ? modules : items;
			for (const previousId of [oldId, newId]) {
				const owners = entities.filter(
					entity =>
						entity.id === previousId ||
						entity.aliases?.includes(previousId)
				);
				if (currentId) {
					expect(
						owners.map(entity => entity.id),
						previousId
					).toEqual([currentId]);
				} else {
					expect(kind).toBe("module");
					expect(owners, previousId).toEqual([]);
					expect(
						unmatchedCourseProgress(course, {
							courseId,
							completedModuleIds: [previousId],
							completedItemIds: []
						})
					).toEqual([{ id: previousId, kind: "module" }]);
				}
			}
		}
	});

	it("preserves Java Level 1 practice progress without merging retired studios", async () => {
		setActivePinia(createPinia());
		const courseId = "java-level-1";
		const course = await useCoursesStore().loadCourseById(courseId);
		const modules = course?.modules ?? [];
		const items = modules.flatMap(module => [
			...module.curriculum,
			...module.supplementalProjects
		]);
		expect(javaLevel1CourseHistory).toHaveLength(58);
		expect(
			javaLevel1CourseHistory.filter(entry => !entry.currentId)
		).toHaveLength(6);

		for (const {
			kind,
			oldId,
			newId,
			currentId
		} of javaLevel1CourseHistory) {
			const entities = kind === "module" ? modules : items;
			for (const previousId of [oldId, newId]) {
				const owners = entities.filter(
					entity =>
						entity.id === previousId ||
						entity.aliases?.includes(previousId)
				);
				if (currentId) {
					expect(
						owners.map(entity => entity.id),
						previousId
					).toEqual([currentId]);
				} else {
					expect(kind).toBe("module");
					expect(owners, previousId).toEqual([]);
					expect(
						unmatchedCourseProgress(course, {
							courseId,
							completedModuleIds: [previousId],
							completedItemIds: []
						})
					).toEqual([{ id: previousId, kind: "module" }]);
				}
			}
		}
	});

	it("preserves bridge-course progress without crediting removed studios", async () => {
		setActivePinia(createPinia());
		const courseId = "python-to-java-and-cpp-bridge";
		const course = await useCoursesStore().loadCourseById(courseId);
		const modules = course?.modules ?? [];
		const items = modules.flatMap(module => [
			...module.curriculum,
			...module.supplementalProjects
		]);
		expect(languageBridgeCourseHistory).toHaveLength(99);
		expect(
			languageBridgeCourseHistory.filter(entry => !entry.currentId)
		).toHaveLength(87);

		for (const {
			kind,
			oldId,
			newId,
			currentId
		} of languageBridgeCourseHistory) {
			const entities = kind === "module" ? modules : items;
			for (const previousId of [oldId, newId]) {
				const owners = entities.filter(
					entity =>
						entity.id === previousId ||
						entity.aliases?.includes(previousId)
				);
				if (currentId) {
					expect(
						owners.map(entity => entity.id),
						previousId
					).toEqual([currentId]);
				} else {
					expect(owners, previousId).toEqual([]);
					expect(
						unmatchedCourseProgress(course, {
							courseId,
							completedModuleIds:
								kind === "module" ? [previousId] : [],
							completedItemIds:
								kind === "item" ? [previousId] : []
						})
					).toEqual([{ id: previousId, kind }]);
				}
			}
		}
	});

	it("preserves low-level security lab progress by lab number, not insertion order", async () => {
		setActivePinia(createPinia());
		const courseId = "low-level-security";
		const course = await useCoursesStore().loadCourseById(courseId);
		const modules = course?.modules ?? [];
		const items = modules.flatMap(module => [
			...module.curriculum,
			...module.supplementalProjects
		]);
		expect(lowLevelSecurityCourseHistory).toHaveLength(102);
		expect(
			lowLevelSecurityCourseHistory.filter(entry => !entry.currentId)
		).toHaveLength(2);

		for (const {
			kind,
			oldId,
			currentId
		} of lowLevelSecurityCourseHistory) {
			const entities = kind === "module" ? modules : items;
			const owners = entities.filter(
				entity => entity.id === oldId || entity.aliases?.includes(oldId)
			);
			if (currentId) {
				expect(
					owners.map(entity => entity.id),
					oldId
				).toEqual([currentId]);
			} else {
				expect(owners, oldId).toEqual([]);
				expect(
					unmatchedCourseProgress(course, {
						courseId,
						completedModuleIds: kind === "module" ? [oldId] : [],
						completedItemIds: kind === "item" ? [oldId] : []
					})
				).toEqual([{ id: oldId, kind }]);
			}
		}
	});

	it("preserves USACO Bronze items without crediting consolidated studios", async () => {
		setActivePinia(createPinia());
		const courseId = "usaco-bronze";
		const course = await useCoursesStore().loadCourseById(courseId);
		const modules = course?.modules ?? [];
		const items = modules.flatMap(module => [
			...module.curriculum,
			...module.supplementalProjects
		]);
		expect(usacoBronzeCourseHistory).toHaveLength(72);
		expect(
			usacoBronzeCourseHistory.filter(entry => !entry.currentId)
		).toHaveLength(6);

		for (const { kind, oldId, currentId } of usacoBronzeCourseHistory) {
			const entities = kind === "module" ? modules : items;
			const owners = entities.filter(
				entity => entity.id === oldId || entity.aliases?.includes(oldId)
			);
			if (currentId) {
				expect(
					owners.map(entity => entity.id),
					oldId
				).toEqual([currentId]);
			} else {
				expect(owners, oldId).toEqual([]);
				expect(
					unmatchedCourseProgress(course, {
						courseId,
						completedModuleIds: kind === "module" ? [oldId] : [],
						completedItemIds: kind === "item" ? [oldId] : []
					})
				).toEqual([{ id: oldId, kind }]);
			}
		}
	});

	it("retains contextualized generated-title progress without assigning retired work", async () => {
		setActivePinia(createPinia());
		const store = useCoursesStore();
		const catalogIds = new Set(courseCatalog.map(entry => entry.id));
		expect(generatedTitleCourseHistory).toHaveLength(1966);
		const byCourse = Map.groupBy(
			generatedTitleCourseHistory,
			entry => entry.courseId
		);

		for (const [courseId, history] of byCourse) {
			const course = await store.loadCourseById(courseId);
			const items = course?.modules.flatMap(module => [
				...module.curriculum,
				...module.supplementalProjects
			]);
			for (const { oldId, currentId } of history) {
				const owners = items?.filter(
					item => item.id === oldId || item.aliases?.includes(oldId)
				);
				if (currentId) {
					expect(
						owners?.map(item => item.id),
						oldId
					).toEqual([currentId]);
				} else if (course) {
					expect(owners, oldId).toEqual([]);
					expect(
						unmatchedCourseProgress(course, {
							courseId,
							completedModuleIds: [],
							completedItemIds: [oldId]
						})
					).toEqual([{ id: oldId, kind: "item" }]);
				} else {
					expect(
						nonCatalogCourseProgress(
							[
								{
									courseId,
									completedModuleIds: [],
									completedItemIds: [oldId]
								}
							],
							catalogIds
						)
					).toHaveLength(1);
				}
			}
		}
	});

	it("keeps broad historical title and lab progress on verified lessons or in visible history", async () => {
		setActivePinia(createPinia());
		const store = useCoursesStore();
		const catalogIds = new Set(courseCatalog.map(entry => entry.id));
		for (const [history, expectedCount, expectedOwned] of [
			[broadTitle17b6History, 534, 339],
			[broadTitle509cHistory, 1468, 487],
			[broadTitleAfd19History, 1024, 97],
			[broadTitleEebbHistory, 489, 254]
		] as const) {
			expect(history).toHaveLength(expectedCount);
			expect(history.filter(entry => entry.currentId)).toHaveLength(
				expectedOwned
			);
			for (const [courseId, entries] of Map.groupBy(
				history,
				entry => entry.courseId
			)) {
				const course = await store.loadCourseById(courseId);
				for (const { kind, oldId, currentId } of entries) {
					const owners =
						kind === "module"
							? course?.modules.filter(
									module =>
										module.id === oldId ||
										module.aliases?.includes(oldId)
								)
							: course?.modules.flatMap(module =>
									[
										...module.curriculum,
										...module.supplementalProjects
									].filter(
										item =>
											item.id === oldId ||
											item.aliases?.includes(oldId)
									)
								);
					if (currentId) {
						expect(
							owners?.map(owner => owner.id),
							oldId
						).toEqual([currentId]);
					} else if (course) {
						expect(owners, oldId).toEqual([]);
						expect(
							unmatchedCourseProgress(course, {
								courseId,
								completedModuleIds:
									kind === "module" ? [oldId] : [],
								completedItemIds: kind === "item" ? [oldId] : []
							})
						).toEqual([{ id: oldId, kind }]);
					} else {
						expect(
							nonCatalogCourseProgress(
								[
									{
										courseId,
										completedModuleIds:
											kind === "module" ? [oldId] : [],
										completedItemIds:
											kind === "item" ? [oldId] : []
									}
								],
								catalogIds
							)
						).toHaveLength(1);
					}
				}
			}
		}
	});

	it("does not claim the same scoped ID for different modules or items", async () => {
		setActivePinia(createPinia());
		const store = useCoursesStore();
		for (const { id: courseId } of courseCatalog) {
			const course = await store.loadCourseById(courseId);
			expect(course).not.toBeNull();
			const moduleOwners = new Map<string, string>();
			const itemOwners = new Map<string, string>();
			for (const module of course!.modules) {
				for (const id of [module.id, ...(module.aliases ?? [])]) {
					if (!id.startsWith(`${courseId}-`)) continue;
					const previousOwner = moduleOwners.get(id);
					expect(
						previousOwner === undefined ||
							previousOwner === module.id,
						`${courseId}: ${id}`
					).toBe(true);
					moduleOwners.set(id, module.id);
				}
				for (const item of [
					...module.curriculum,
					...module.supplementalProjects
				]) {
					for (const id of [item.id, ...(item.aliases ?? [])]) {
						if (!id.startsWith(`${courseId}-`)) continue;
						const previousOwner = itemOwners.get(id);
						expect(
							previousOwner === undefined ||
								previousOwner === item.id,
							`${courseId}: ${id}`
						).toBe(true);
						itemOwners.set(id, item.id);
					}
				}
			}
		}
	});
});
