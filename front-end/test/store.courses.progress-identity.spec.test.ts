import { createPinia, setActivePinia } from "pinia";
import { describe, expect, it } from "vitest";
import { useCoursesStore } from "@/stores/courses";
import { courseCatalog } from "@/stores/courses/index";
import { webDevelopmentFoundationsCourse } from "@/stores/courses/web-development-foundations";
import { researchBackedExpansionCourseIds } from "@/stores/courses/research-expansions";

function historicalId(value: string) {
	return value
		.toLowerCase()
		.normalize("NFKD")
		.replace(/[\u0300-\u036f]/g, "")
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-+|-+$/g, "");
}

describe("saved course progress identities", () => {
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
