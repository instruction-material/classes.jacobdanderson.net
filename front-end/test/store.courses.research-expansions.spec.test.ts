import { describe, expect, it } from "vitest";
import { loadRawCourse } from "@/stores/courses/index";
import {
	researchBackedExpansionCourseIds,
	researchBackedExpansionProfiles
} from "@/stores/courses/research-expansions";

const COURSE_SWEEP_TIMEOUT = 180000;

function allText(
	course: NonNullable<Awaited<ReturnType<typeof loadRawCourse>>>
) {
	return course.modules
		.flatMap(module => [
			module.title,
			...module.curriculum.flatMap(item => [item.title, item.content]),
			...module.supplementalProjects.flatMap(item => [
				item.title,
				item.content
			])
		])
		.join("\n");
}

function moduleText(
	module: NonNullable<
		Awaited<ReturnType<typeof loadRawCourse>>
	>["modules"][number]
) {
	return [
		module.title,
		...module.curriculum.flatMap(item => [item.title, item.content]),
		...module.supplementalProjects.flatMap(item => [
			item.title,
			item.content
		])
	].join("\n");
}

describe("research-backed course family expansions", () => {
	it("keeps research expansion profile lists deduplicated", () => {
		const listFields = [
			"gaps",
			"topics",
			"moduleAdditions",
			"projectTypes",
			"assessments",
			"materials"
		] as const;
		const failures: string[] = [];

		for (const [courseId, profile] of Object.entries(
			researchBackedExpansionProfiles
		)) {
			for (const field of listFields) {
				const normalized = profile[field].map(item =>
					item.trim().toLowerCase()
				);
				if (new Set(normalized).size === normalized.length) continue;

				failures.push(`${courseId}: ${field}`);
			}
		}

		expect(failures).toEqual([]);
	});

	it(
		"adds standards, sequencing, and project practice appendices to every audited course",
		async () => {
			expect(researchBackedExpansionCourseIds.length).toBeGreaterThan(35);

			for (const courseId of researchBackedExpansionCourseIds) {
				const course = await loadRawCourse(courseId);
				const profile = researchBackedExpansionProfiles[courseId];

				expect(course, courseId).not.toBeNull();
				expect(profile, courseId).toBeDefined();

				const referenceExpansionTitles = [
					"Standards Map",
					"Course Roadmap",
					"Project Practice Guide"
				];
				const titles = course!.modules.map(module => module.title);
				for (const title of referenceExpansionTitles) {
					expect(titles, courseId).toContain(title);
				}

				const expansionModules = course!.modules.filter(module =>
					referenceExpansionTitles.includes(module.title)
				);

				expect(expansionModules, courseId).toHaveLength(3);
				expect(
					expansionModules.every(
						module => module.kind === "appendix"
					),
					courseId
				).toBe(true);
				expect(
					expansionModules.every(
						module => module.curriculum.length >= 4
					),
					courseId
				).toBe(true);
				expect(
					expansionModules.every(
						module => module.supplementalProjects.length >= 2
					),
					courseId
				).toBe(true);

				const expansionText = expansionModules
					.map(moduleText)
					.join("\n");
				const referenceAndRoadmapText = expansionModules
					.filter(module => module.title !== "Project Practice Guide")
					.map(moduleText)
					.join("\n");
				const courseLabel = course!.name.trim() || profile.family;
				expect(expansionText, courseId).toContain(
					`${courseLabel} Module Alignment Guide`
				);
				expect(expansionText, courseId).toContain(
					`${courseLabel} Reference Guide`
				);
				expect(expansionText, courseId).toContain(
					`${courseLabel} Prerequisite Map`
				);
				expect(expansionText, courseId).toContain(
					`${courseLabel} Resource Inventory`
				);
				const roadmapModule = expansionModules.find(
					module => module.title === "Course Roadmap"
				);
				expect(roadmapModule, courseId).toBeDefined();
				const roadmapText = moduleText(roadmapModule!);
				if (courseId === "physics-level-2") {
					for (const phrase of [
						"PHY8 constant-acceleration equations",
						"PHY9 free-body diagrams and PHY10 rope constraints",
						"17 module case sections and 17 matching answer sections",
						"/course-assets/physics/physics-level-2-materials-pack.md",
						"/course-assets/physics/physics-level-2-rubrics-answer-key.md"
					])
						expect(roadmapText, courseId).toContain(phrase);
				} else if (courseId === "intro-to-physics") {
					expect(roadmapText, courseId).toContain(
						"PHY2 signed velocity, PHY3 external forces and PHY4 kinetic energy before PHY8 momentum"
					);
					expect(roadmapText, courseId).toContain(
						"PHY5 current/voltage and PHY4 energy before PHY13"
					);
					expect(roadmapText, courseId).toContain(
						"17 module case sections and 17 corresponding answer/rubric sections"
					);
					for (const pack of [
						"intro-physics-materials-pack.md",
						"intro-physics-rubrics-answer-key.md"
					]) {
						expect(roadmapText, courseId).toContain(
							`/course-assets/physics/${pack}`
						);
					}
				} else if (courseId === "middle-school-integrated-science") {
					const roadmapItems = [
						...roadmapModule!.curriculum,
						...roadmapModule!.supplementalProjects
					];
					for (const title of [
						"Resource Map",
						"Module Alignment Guide",
						"Reference Map",
						"Prerequisite Map",
						"Resource Inventory"
					]) {
						const entry = roadmapItems.find(
							item => item.title === `${courseLabel} ${title}`
						);
						expect(entry, title).toBeDefined();
						expect(entry!.contentKind, title).toBe("reading");
						expect(entry!.datasetLink, title).toBe(
							"/course-assets/middle-school-science/middle-school-science-materials-pack.md"
						);
					}
					for (const phrase of [
						"ten sections matching MS1–MS10",
						"distance adds path lengths",
						"displacement compares endpoints",
						"category count divided by sample total",
						"A notebook or digital document is sufficient."
					])
						expect(roadmapText, courseId).toContain(phrase);
				} else if (courseId === "elementary-science") {
					const roadmapItems = [
						...roadmapModule!.curriculum,
						...roadmapModule!.supplementalProjects
					];
					for (const title of [
						"Resource Map",
						"Module Alignment Guide",
						"Reference Map",
						"Prerequisite Map",
						"Resource Inventory"
					]) {
						const entry = roadmapItems.find(
							item => item.title === `${courseLabel} ${title}`
						);
						expect(entry, title).toBeDefined();
						expect(entry!.contentKind, title).toBe("reading");
						expect(entry!.datasetLink, title).toBe(
							"/course-assets/elementary-science/elementary-science-materials-pack.md"
						);
					}
					for (const phrase of [
						"ES1–ES8",
						"interval changes of 1, 2, 2 and 2 m",
						"A bar graph of plant growth requires the subtraction in ES1",
						"No physical supplies beyond paper are required",
						"Each required activity links a local case-input section and an answer section"
					])
						expect(roadmapText, courseId).toContain(phrase);
				} else if (courseId === "design-patterns-in-java") {
					const items = [
						...roadmapModule!.curriculum,
						...roadmapModule!.supplementalProjects
					];
					expect(items).toHaveLength(6);
					expect(
						items.every(item => item.contentKind === "reading")
					).toBe(true);
					for (const detail of [
						"Ordered collections and captured snapshots support Observer dispatch",
						"Exceptions and operation ordering support mediator history and audit failures",
						"sources.txt and src/",
						"immutable Git revisions",
						"JDK 21"
					])
						expect(roadmapText, courseId).toContain(detail);
				} else {
					for (const label of [
						"Map purpose",
						"Map reading",
						"What the map clarifies",
						"Inventory purpose",
						"Inventory reading"
					]) {
						expect(roadmapText, courseId).toContain(
							`**${label}:**`
						);
					}
				}
				expect(roadmapText, courseId).not.toMatch(
					/\*\*Goal:\*\*\s+(?:Draw or write a prerequisite map|Build a resource inventory)/i
				);
				expect(roadmapText, courseId).not.toMatch(
					/\*\*(?:Map guidance|Inventory guidance|Checkpoints):\*\*/i
				);
				expect(roadmapText, courseId).not.toMatch(
					/\bmark each item as\b/i
				);
				expect(expansionText, courseId).not.toMatch(
					/\b(?:Readiness Checklist|Resource Updates|Dependency Graph|Resource Checklist)\b/
				);
				expect(expansionText, courseId).not.toMatch(
					/\*\*(?:Project goal|Required outcome|Completion checks|Readiness evidence):\*\*/
				);
				expect(expansionText, courseId).not.toMatch(
					/\*\*(?:Reference guide|Course connection|Sequence guidance|Project ladder|Course boundaries):\*\*/i
				);
				expect(expansionText, courseId).not.toMatch(
					/\b(?:source-backed|version-aware|hidden materials|learner-created|expected readiness level)\b/i
				);
				expect(expansionText, courseId).not.toMatch(
					/\*\*(?:Ready to practice|Ready when):\*\*/i
				);
				expect(expansionText, courseId).not.toMatch(
					/\b(?:each gap|no gap remains|required [^.]{0,80} gaps|planned [^.]{0,80} module|Use this [^.]{0,80} check to separate)\b/i
				);
				expect(referenceAndRoadmapText, courseId).not.toMatch(
					/^- (?:Add|Apply|Audit|Build|Check|Choose|Clarify|Compare|Complete|Create|Explain|Fix|Keep|Make|Map|Pass|Review|State|Strengthen|Trace|Treat|Use)\b/im
				);
			}
		},
		COURSE_SWEEP_TIMEOUT
	);

	it(
		"keeps research appendices course-specific instead of shared boilerplate",
		async () => {
			const retiredPhrases = [
				"**Finished work shows:** Examples, projects, and checkpoints are traceable to the reference map rather than only to project titles.",
				"Each core-skill item can become a short explanation, a practice check, or a focused review path depending on the current need.",
				"**Practice setup:** A lesson or project is usable when one core skill has a concrete explanation, worked example, practice task, and observable work.",
				"Topic additions are strongest when they include vocabulary, one representative example, one common-error check, and one transfer task.",
				"When that connection is unclear, a smaller bridge practice comes before the major project.",
				"Move it elsewhere when it requires a different prerequisite chain, safety model, or level of depth that would crowd out the core purpose.",
				"Move it elsewhere when that topic requires a different prerequisite chain, safety model, or level of depth that would crowd out the core purpose.",
				"**Use this check to separate:** prerequisite knowledge, required content, optional enrichment, and reference-only material.",
				"- Each planned module cites a standard, official document, or deliberate toolchain target.",
				"If a project expects a skill that has not appeared in a worked example or smaller practice task, a bridge item belongs before that project.",
				"The order follows prerequisite dependency so each extension builds on skills already practiced.",
				"**Useful module pattern:** A complete module states the concept, explains why it matters, includes one worked example, provides one practice task, checks understanding quickly, and offers one extension.",
				"Links that are only background references are labeled that way so they do not look like required assignments.",
				'Each edge explains the dependency in plain language, such as "requires arrays before 2D grids" or "requires variables before simulation state."',
				"AP Computer Science An edge",
				"The first version stays narrow, demonstrable, and easy to verify before optional polish is added.",
				"**Required capstone brief:** Name the target user or problem, the exact project result, the core concept being reused from earlier modules, the minimum viable first version, and the evidence that will prove the first version works."
			];
			const hits: string[] = [];

			for (const courseId of researchBackedExpansionCourseIds) {
				const course = await loadRawCourse(courseId);
				expect(course, courseId).not.toBeNull();
				const text = allText(course!);

				for (const phrase of retiredPhrases) {
					if (text.includes(phrase)) {
						hits.push(`${courseId}: ${phrase}`);
					}
				}
			}

			expect(hits).toEqual([]);
		},
		COURSE_SWEEP_TIMEOUT
	);

	it("carries the researched standards, tooling, safety, and assessment anchors into course text", async () => {
		const courseIds = [
			"ai-level-1",
			"intro-to-chemistry",
			"c-level-1",
			"network-security",
			"machine-learning",
			"unity-game-development",
			"elementary-science"
		];
		const courses = await Promise.all(
			courseIds.map(courseId => loadRawCourse(courseId))
		);
		const corpus = courses
			.filter((course): course is NonNullable<typeof course> =>
				Boolean(course)
			)
			.map(allText)
			.join("\n");

		expect(corpus).toContain("NIST AI RMF");
		expect(corpus).toContain("ACS Chemistry Guidelines");
		expect(corpus).toContain("ISO C++ Core Guidelines");
		expect(corpus).toContain("OWASP Web Security Testing Guide");
		expect(corpus).toContain("scikit-learn Model Evaluation");
		expect(corpus).toContain("Unity Learn");
		expect(corpus).toContain("No physical supplies beyond paper");
		expect(corpus).toContain("Practice Project:");
		expect(corpus).toContain("AI Level 1 Checkpoints");
	});
});
