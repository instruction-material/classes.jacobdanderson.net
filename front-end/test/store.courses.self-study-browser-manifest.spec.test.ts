import type { CourseModuleItem } from "@/stores/courses/types";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { createPinia, setActivePinia } from "pinia";
import MarkdownIt from "markdown-it";
import { expect, it } from "vitest";
import moneyMindedAdditions from "../../test/fixtures/money-minded-restored-identities.json";
import smartMoneyAdditions from "../../test/fixtures/smart-money-restored-identities.json";
import published from "../../test/fixtures/catalog-published-identities.json";
import elementaryAdditions from "../../test/fixtures/early-elementary-a-restored-identities.json";
import elementaryBAdditions from "../../test/fixtures/early-elementary-b-restored-identities.json";
import lateElementaryAAdditions from "../../test/fixtures/late-elementary-a-restored-identities.json";
import lateElementaryBAdditions from "../../test/fixtures/late-elementary-b-restored-identities.json";
import joyOfReadingAdditions from "../../test/fixtures/joy-of-reading-restored-identities.json";
import pictureBookAdditions from "../../test/fixtures/picture-book-restored-identities.json";
import ventureAdditions from "../../test/fixtures/entrepreneurship-restored-core-identities.json";
import grammarAdditions from "../../test/fixtures/grammar-mechanics-restored-identities.json";
import literatureAdditions from "../../test/fixtures/middle-school-literature-restored-identities.json";
import writingAdditions from "../../test/fixtures/middle-school-writing-restored-identities.json";
import speakingAdditions from "../../test/fixtures/public-speaking-restored-identities.json";
import {
	isLessonLearningItem,
	lessonContentSections
} from "@/modules/courseLessonPresentation";
import { normalizeInlineCourseMarkdown } from "@/modules/courseMarkdown";
import { useAppStore } from "@/stores/app";
import { useCoursesStore } from "@/stores/courses";
import { algebra1ACourse } from "@/stores/courses/algebra-1a";
import algebra1ACourseReadings from "@/stores/courses/algebra1ACourseReadingsData.json";
import { algebra1BCourse } from "@/stores/courses/algebra-1b";
import { algebraErrorAnalysisCases } from "@/stores/courses/algebraErrorAnalysisCases";
import { algebra2ACourse } from "@/stores/courses/algebra-2a";
import { algebra2BCourse } from "@/stores/courses/algebra-2b";
import { introToPhysicsCourse } from "@/stores/courses/intro-to-physics";
import { physicsLevel2Course } from "@/stores/courses/physics-level-2";
import { geometryACourse } from "@/stores/courses/geometry-a";
import { geometryBCourse } from "@/stores/courses/geometry-b";
import { middleSchoolIntegratedScienceCourse } from "@/stores/courses/middle-school-integrated-science";
import { introToBiologyCourse } from "@/stores/courses/intro-to-biology";
import { introToChemistryCourse } from "@/stores/courses/intro-to-chemistry";
import { introToEnvironmentalScienceCourse } from "@/stores/courses/intro-to-environmental-science";
import { elementaryScienceCourse } from "@/stores/courses/elementary-science";
import { preAlgebraACourse } from "@/stores/courses/pre-algebra-a";
import { preAlgebraBCourse } from "@/stores/courses/pre-algebra-b";
import {
	earlyElementaryMathACourse,
	earlyElementaryMathBCourse,
	lateElementaryMathACourse,
	lateElementaryMathBCourse,
	earlyElementaryJoyOfReadingCourse,
	earlyElementaryPictureBookCourse,
	smartMoneyPersonalFinanceCourse,
	moneyMindedInvestingCourse,
	entrepreneurship101Course,
	grammarMechanicsCourse,
	introductionToPublicSpeakingCourse,
	middleSchoolLiteratureCourse,
	middleSchoolWritingCourse,
	middleSchoolWritingRetakeCourse,
	novelWritingCourse,
	scratchLevel1BootcampCourse
} from "@/stores/courses/source-library-courses";

import { designPatternsInJavaCourse } from "@/stores/courses/design-patterns-in-java";
import { designPatternsInJavaPart2Course } from "@/stores/courses/design-patterns-in-java-part-2";
import { javaLevel3Course } from "@/stores/courses/java-level-3";
import { networkSystemsCourse } from "@/stores/courses/network-systems";
import { aiLevel1Course } from "@/stores/courses/ai-level-1";
import { pythonicDesignPatternsCourse } from "@/stores/courses/pythonic-design-patterns";

function isReviewedModule(id: string, title: string) {
	if (id === "java-level-3") return title === "AJ4 Recursion";
	if (id === "pythonic-design-patterns") return /^PDP[0-8] /.test(title);
	return true;
}
const cases = [
	{
		id: "pythonic-design-patterns",
		source: pythonicDesignPatternsCourse,
		readings: 28,
		additions: []
	},
	{
		id: "money-minded-investing",
		source: moneyMindedInvestingCourse,
		readings: 11,
		additions: moneyMindedAdditions
	},
	{
		id: "pre-algebra-b",
		source: preAlgebraBCourse,
		readings: 11,
		additions: []
	},
	{ id: "ai-level-1", source: aiLevel1Course, readings: 34, additions: [] },
	{
		id: "network-systems",
		source: networkSystemsCourse,
		readings: 56,
		additions: []
	},
	{
		id: "design-patterns-in-java-part-2",
		source: designPatternsInJavaPart2Course,
		readings: 30,
		additions: []
	},
	{
		id: "design-patterns-in-java",
		source: designPatternsInJavaCourse,
		readings: 32,
		additions: []
	},
	{
		id: "java-level-3",
		source: javaLevel3Course,
		readings: 1,
		additions: []
	},
	{
		id: "intro-to-environmental-science",
		source: introToEnvironmentalScienceCourse,
		readings: 27,
		additions: []
	},
	{
		id: "intro-to-chemistry",
		source: introToChemistryCourse,
		readings: 62,
		additions: []
	},
	{
		id: "intro-to-biology",
		source: introToBiologyCourse,
		readings: 8,
		additions: []
	},
	{
		id: "elementary-science",
		source: elementaryScienceCourse,
		readings: 36,
		additions: []
	},
	{
		id: "middle-school-integrated-science",
		source: middleSchoolIntegratedScienceCourse,
		readings: 65,
		additions: []
	},
	{
		id: "early-elementary-b-picture-book",
		source: earlyElementaryPictureBookCourse,
		readings: 13,
		additions: pictureBookAdditions
	},
	{
		id: "early-elementary-a-reading",
		source: earlyElementaryJoyOfReadingCourse,
		readings: 8,
		additions: joyOfReadingAdditions
	},
	{
		id: "late-elementary-b-math",
		source: lateElementaryMathBCourse,
		readings: 20,
		additions: lateElementaryBAdditions
	},
	{
		id: "late-elementary-a-math",
		source: lateElementaryMathACourse,
		readings: 19,
		additions: lateElementaryAAdditions
	},
	{
		id: "early-elementary-b-math",
		source: earlyElementaryMathBCourse,
		readings: 19,
		additions: elementaryBAdditions
	},
	{
		id: "early-elementary-a-math",
		source: earlyElementaryMathACourse,
		readings: 22,
		additions: elementaryAdditions
	},
	{
		id: "algebra-1a",
		source: algebra1ACourse,
		readings: 21,
		additions: []
	},
	{
		id: "algebra-1b",
		source: algebra1BCourse,
		readings: 31,
		additions: []
	},
	{
		id: "geometry-b",
		source: geometryBCourse,
		readings: 11,
		additions: []
	},
	{
		id: "geometry-a",
		source: geometryACourse,
		readings: 6,
		additions: []
	},
	{
		id: "smart-money-personal-finance",
		source: smartMoneyPersonalFinanceCourse,
		readings: 9,
		additions: smartMoneyAdditions
	},
	{
		id: "entrepreneurship-101",
		source: entrepreneurship101Course,
		readings: 10,
		additions: ventureAdditions
	},
	{
		id: "middle-school-a-literature",
		source: middleSchoolLiteratureCourse,
		readings: 13,
		additions: literatureAdditions
	},
	{
		id: "middle-school-b-writing",
		source: middleSchoolWritingCourse,
		readings: 14,
		additions: writingAdditions["middle-school-b-writing"]
	},
	{
		id: "middle-school-b-writing-retake",
		source: middleSchoolWritingRetakeCourse,
		readings: 16,
		additions: writingAdditions["middle-school-b-writing-retake"]
	},
	{
		id: "middle-school-c-grammar",
		source: grammarMechanicsCourse,
		readings: 20,
		additions: grammarAdditions
	},
	{
		id: "novel-writing",
		source: novelWritingCourse,
		readings: 14,
		additions: []
	},
	{
		id: "introduction-to-public-speaking",
		source: introductionToPublicSpeakingCourse,
		readings: 9,
		additions: speakingAdditions
	},
	{
		id: "scratch-level-1-bootcamp",
		source: scratchLevel1BootcampCourse,
		readings: 4,
		additions: []
	},
	{
		id: "algebra-2a",
		source: algebra2ACourse,
		readings: 27,
		additions: []
	},
	{
		id: "algebra-2b",
		source: algebra2BCourse,
		readings: 22,
		additions: []
	},
	{
		id: "intro-to-physics",
		source: introToPhysicsCourse,
		readings: 37,
		additions: []
	},
	{
		id: "physics-level-2",
		source: physicsLevel2Course,
		readings: 38,
		additions: []
	},
	{
		id: "pre-algebra-a",
		source: preAlgebraACourse,
		readings: 11,
		additions: []
	}
] as const;
const markdown = new MarkdownIt({ breaks: true, html: false, linkify: true });
const digest = (value: string) =>
	createHash("sha256").update(value).digest("hex");
const chemistryModuleCounts: Record<string, [number, number, number]> = {
	CHM1: [6, 1, 2],
	CHM2: [5, 1, 4],
	CHM3: [5, 2, 2],
	CHM4: [5, 1, 3],
	CHM5: [6, 1, 2],
	CHM6: [5, 2, 3],
	CHM7: [4, 1, 6],
	CHM8: [3, 1, 6],
	CHM9: [8, 1, 2],
	CHM10: [5, 1, 2],
	CHM11: [5, 2, 3],
	Reference: [5, 0, 2]
};
const environmentalModuleCounts: Record<string, [number, number, number]> = {
	ES1: [3, 3, 3],
	ES2: [4, 2, 3],
	ES3: [3, 2, 3],
	ES4: [4, 2, 3],
	ES5: [4, 2, 3],
	ES6: [3, 2, 3],
	ES7: [3, 2, 3],
	ES8: [3, 2, 3]
};
const intentionalMathLineBreaks: Record<string, Record<string, number>> = {
	"algebra-2a": {
		"Applications and Parabola Geometry": 1,
		"Graphing and Roots of Rational Functions": 3,
		"Multiplying, Dividing, and Simplifying Rational Expressions": 2,
		"Adding, Subtracting, and Solving Rational Equations": 2,
		"Piecewise Models and Continuity": 2
	},
	"algebra-2b": {
		"Logarithm Properties and Change of Base": 2,
		"Arithmetic Sequences and nth Terms": 1,
		"Arithmetic Series and Application Problems": 1,
		"Geometric Sequences and Exponential Patterns": 1,
		"Geometric Sums and Infinite Series": 2,
		"Inverses and Matrix Division": 3,
		"Sine, Cosine, and Tangent Graph Features": 1
	}
};

function reading(item: CourseModuleItem) {
	const container = document.createElement("div");
	container.innerHTML = markdown.render(
		normalizeInlineCourseMarkdown(item.content)
	);
	return {
		id: item.id,
		title: item.title,
		learningPath: item.learningPath,
		contentSHA256: digest(item.content),
		expectedText: container.textContent!.replace(/\s+/g, " ").trim(),
		tableRows: container.querySelectorAll("tbody tr").length,
		paragraphBreaks: container.querySelectorAll(":scope > p > br").length,
		images: [
			...[...container.querySelectorAll("img")].map(image => ({
				src: image.getAttribute("src"),
				alt: image.alt
			})),
			...(item.mediaLink &&
			/(?:course-assets|static\.classes\.jacobdanderson\.net)\/algebra-2[ab]\/.+\.svg$/.test(
				item.mediaLink
			)
				? [
						{
							src: item.mediaLink,
							alt: `Project demo media for ${item.title}`
						}
					]
				: [])
		]
	};
}

it.each(
	cases.flatMap(course =>
		["learner", "instructor"].map(role => ({ ...course, role }))
	)
)(
	"binds complete browser expectations for $id $role",
	async ({ id, role, source, readings: count, additions }) => {
		setActivePinia(createPinia());
		if (role === "instructor")
			useAppStore().setCurrentTutor({
				_id: "self-study-tutor",
				name: "Tutor",
				email: "tutor@example.invalid",
				age: 30,
				state: "GA",
				usersOfTutorLength: 0,
				coursePermissions: [id],
				editTutors: false,
				saveEdit: "Save"
			});
		const course = (await useCoursesStore().loadCourseById(id))!;
		for (const entry of algebraErrorAnalysisCases.filter(
			entry => entry.course === id
		)) {
			const module = course.modules.find(
				module => module.title === entry.module
			)!;
			const task = module.supplementalProjects.find(item =>
				item.title.includes("Modeling or Error Analysis")
			)!;
			expect(task.contentKind, entry.heading).toBe("assignment");
			expect(task.content, entry.heading).toContain(entry.given);
			expect(task.content, entry.heading).toContain(entry.flawed);
			for (const question of entry.questions)
				expect(task.content, entry.heading).toContain(question);
		}
		const identities = course.modules.flatMap(module =>
			(
				[
					["core", module.curriculum],
					["optional", module.supplementalProjects]
				] as const
			).flatMap(([section, items]) =>
				items.map(item => ({
					moduleId: module.id,
					id: item.id,
					section
				}))
			)
		);
		const originals = identities.filter(
			item => !additions.some(added => added.id === item.id)
		);
		expect(identities).toHaveLength(published[id].items + additions.length);
		expect(digest(JSON.stringify(originals))).toBe(published[id].sha256);
		if (id === "algebra-1a") {
			for (const entry of algebra1ACourseReadings) {
				const moduleTitle =
					entry.module === "Standards Map"
						? "Algebra 1A Reference"
						: entry.module;
				const module = course.modules.find(
					module => module.title === moduleTitle
				)!;
				const item = [
					...module.curriculum,
					...module.supplementalProjects
				].find(
					item => item.title === (entry.displayTitle ?? entry.title)
				)!;
				expect(item, entry.title).toBeDefined();
				const fullContent = entry.content
					.split(/\n\n\*\*(?:Concept path|Quick check|Goal):\*\*/)[0]
					.trim();
				expect(item.content, entry.title).toBe(fullContent);
			}
		}
		for (const added of additions)
			expect(identities.filter(item => item.id === added.id)).toEqual([
				added
			]);
		if (
			["intro-to-chemistry", "intro-to-environmental-science"].includes(
				id
			)
		) {
			for (const rawModule of source.modules) {
				const displayedModule = course.modules.find(
					module => module.title === rawModule.title
				)!;
				expect(displayedModule, rawModule.title).toBeDefined();
				for (const section of [
					"curriculum",
					"supplementalProjects"
				] as const) {
					for (const rawItem of rawModule[section]) {
						const displayed = displayedModule[section].find(
							item => item.title === rawItem.title
						)!;
						expect(displayed, rawItem.title).toBeDefined();
						expect(displayed.content, rawItem.title).toBe(
							rawItem.content.trim()
						);
						expect(displayed.contentKind, rawItem.title).toBe(
							rawItem.contentKind
						);
					}
				}
			}
		}
		const legacyReadingProjectIds = new Map<object, string>();
		if (
			id === "early-elementary-a-reading" ||
			id === "early-elementary-b-picture-book"
		) {
			for (const module of source.modules) {
				for (const section of [
					"curriculum",
					"supplementalProjects"
				] as const) {
					for (const item of module[section]) {
						const sectionId =
							section === "curriculum"
								? "curriculum"
								: "supplemental";
						const originalId = [
							id,
							module.title,
							sectionId,
							item.title
						]
							.join("-")
							.toLowerCase()
							.replace(/[^a-z0-9]+/g, "-")
							.replace(/^-|-$/g, "");
						legacyReadingProjectIds.set(
							item,
							item.id ?? originalId
						);
					}
				}
			}
		}
		const sourceProjects = source.modules
			.filter(module => isReviewedModule(id, module.title))
			.flatMap(module => [
				...module.curriculum,
				...module.supplementalProjects
			])
			// AI and the reviewed Pythonic opening replace generic generated briefs
			// with authored contracts. Their focused tests and complete browser-body
			// hashes below establish the new directives; all published IDs stay checked.
			.filter(
				item =>
					id !== "ai-level-1" &&
					id !== "pythonic-design-patterns" &&
					item.content.startsWith("**Project goal:**")
			);
		const all = course.modules.flatMap(module => [
			...module.curriculum,
			...module.supplementalProjects
		]);
		for (const project of sourceProjects) {
			const item = all.find(
				item =>
					item.title === project.title ||
					item.aliases?.includes(project.title) ||
					item.id === legacyReadingProjectIds.get(project)
			)!;
			expect(item, project.title).toBeDefined();
			expect(isLessonLearningItem(item), item.title).toBe(false);
			expect(item.learningPath, item.title).toBe(project.learningPath);
			const originalPrompt = project.content
				.replace(/^\*\*Project goal:\*\*\s*/, "")
				.split("**Completion evidence:**")[0]
				.trim();
			const displayedPrompt = item.content
				.replace(/^\*\*Project goal:\*\*\s*/, "")
				.split("**Completion evidence:**")[0]
				.trim();
			if (
				[
					"scratch-level-1-bootcamp",
					"introduction-to-public-speaking",
					"middle-school-a-literature"
				].includes(id)
			)
				expect(displayedPrompt, project.title).toBe(originalPrompt);
		}
		const card = (item: CourseModuleItem) => {
			const focusedJavaTask =
				[
					"java-level-3",
					"design-patterns-in-java",
					"design-patterns-in-java-part-2"
				].includes(id) &&
				course.modules.some(
					module =>
						isReviewedModule(id, module.title) &&
						[
							...module.curriculum,
							...module.supplementalProjects
						].some(row => row.id === item.id)
				);
			const focusedPythonicTask =
				id === "pythonic-design-patterns" &&
				course.modules.some(
					module =>
						isReviewedModule(id, module.title) &&
						[
							...module.curriculum,
							...module.supplementalProjects
						].some(row => row.id === item.id)
				);
			const completeMathAssignment = [
				"early-elementary-a-math",
				"early-elementary-b-math",
				"late-elementary-a-math",
				"algebra-1b",
				"algebra-2a",
				"algebra-2b"
			].includes(id);
			const completeAssignment =
				focusedJavaTask ||
				focusedPythonicTask ||
				completeMathAssignment ||
				[
					"pre-algebra-b",
					"ai-level-1",
					"smart-money-personal-finance",
					"money-minded-investing",
					"network-systems",
					"algebra-1a",
					"intro-to-environmental-science",
					"elementary-science",
					"intro-to-biology",
					"intro-to-chemistry",
					"middle-school-integrated-science",
					"early-elementary-a-reading",
					"early-elementary-b-picture-book"
				].includes(id);
			const fullBlocks =
				focusedJavaTask ||
				focusedPythonicTask ||
				[
					"pre-algebra-b",
					"ai-level-1",
					"smart-money-personal-finance",
					"money-minded-investing",
					"network-systems",
					"intro-to-environmental-science",
					"elementary-science",
					"intro-to-biology",
					"intro-to-chemistry",
					"middle-school-integrated-science",
					"early-elementary-a-math",
					"early-elementary-b-math",
					"late-elementary-a-math",
					"late-elementary-b-math",
					"early-elementary-a-reading",
					"early-elementary-b-picture-book",
					"algebra-1a",
					"algebra-1b",
					"pre-algebra-a",
					"geometry-a",
					"geometry-b",
					"algebra-2a",
					"algebra-2b"
				].includes(id);
			const selfChecks = fullBlocks
				? [
						...item.content.matchAll(
							/\[(Check answers and reasoning|Project self-check|Figurative-language self-check|Case inputs|Runoff inputs)\]\(([^)]+)\)/g
						)
					].map(([, label, href]) => {
						const url = new URL(href, "https://example.invalid");
						const asset = url.searchParams.get("asset")!;
						const [path, anchor] = asset.split("#");
						const source = readFileSync(
							join(process.cwd(), "public", path),
							"utf8"
						);
						const section = source
							.split(/^## /m)
							.slice(1)
							.find(
								section =>
									section
										.split("\n", 1)[0]
										.toLowerCase()
										.replace(/[^a-z0-9\s-]/g, "")
										.trim()
										.replace(/\s+/g, "-") === anchor
							);
						expect(section, asset).toBeDefined();
						const container = document.createElement("div");
						container.innerHTML = markdown.render(
							section!.slice(section!.indexOf("\n") + 1).trim()
						);
						return {
							label,
							href,
							asset,
							heading: section!.split("\n", 1)[0].trim(),
							expectedText: container
								.textContent!.replace(/\s+/g, " ")
								.trim()
						};
					})
				: [];
			if (focusedJavaTask) expect(selfChecks, item.id).toHaveLength(2);
			// These authored labels become separate headings in assignment cards.
			// Keep every body word while matching the displayed heading punctuation.
			let fullAssignment = fullBlocks
				? item.content
						.replace(/^\*\*(Goal|Steps):\*\*/gm, "**$1**")
						.replace(
							/^\*\*Extension:\*\*/gm,
							"**Optional · Extension**"
						)
				: item.content;
			if (
				completeAssignment ||
				[
					"algebra-1a",
					"algebra-1b",
					"early-elementary-a-math"
				].includes(id)
			) {
				const sections = lessonContentSections(
					item.content,
					item.contentKind ?? "assignment"
				);
				expect(
					sections.some(section => section.kind === "learn"),
					item.title
				).toBe(false);
				fullAssignment = sections
					.map(section => {
						const label =
							section.kind === "optional" &&
							section.label !== "Optional"
								? `Optional · ${section.label}`
								: section.label;
						return `### ${label}\n\n${section.content}`;
					})
					.join("\n\n");
			}
			const completionIndex = item.content
				.toLowerCase()
				.indexOf("**completion evidence:**");
			const directive =
				completionIndex < 0
					? undefined
					: item.content
							.slice(0, completionIndex)
							.replace(/^\*\*(?:Project )?goal:\*\*\s*/i, "")
							.trim();
			const container = document.createElement("div");
			container.innerHTML = markdown.render(
				normalizeInlineCourseMarkdown(
					completeAssignment
						? fullAssignment
						: (directive ??
								([
									"early-elementary-a-math",
									"early-elementary-b-math",
									"late-elementary-a-math",
									"late-elementary-b-math",
									"early-elementary-a-reading",
									"early-elementary-b-picture-book",
									"algebra-1a",
									"algebra-1b",
									"introduction-to-public-speaking",
									"middle-school-c-grammar",
									"intro-to-physics",
									"physics-level-2",
									"pre-algebra-a",
									"geometry-a",
									"geometry-b",
									"algebra-2a",
									"algebra-2b"
								].includes(id)
									? fullAssignment
									: ""))
				)
			);
			if (
				completeAssignment &&
				!completeMathAssignment &&
				![
					"pre-algebra-b",
					"money-minded-investing",
					"ai-level-1",
					"network-systems",
					"algebra-1a",
					"middle-school-integrated-science",
					"elementary-science",
					"intro-to-biology",
					"intro-to-environmental-science",
					"intro-to-chemistry"
				].includes(id)
			) {
				const completion = item.content.split(
					"**Completion evidence:**"
				)[1];
				if (item.learningPath === "core")
					expect(completion, item.title).toBeTruthy();
				if (completion) {
					const evidence = document.createElement("div");
					evidence.innerHTML = markdown.render(
						normalizeInlineCourseMarkdown(completion)
					);
					expect(
						container.textContent!.replace(/\s+/g, " ").trim(),
						item.title
					).toContain(
						evidence.textContent!.replace(/\s+/g, " ").trim()
					);
				}
			}
			if (id === "network-systems" && item.learningPath === "core") {
				expect(item.content, item.title).toMatch(
					/network-notes\.md|notebook/i
				);
				expect(
					container.textContent!.trim().length,
					item.title
				).toBeGreaterThan(300);
			}
			if (
				id === "middle-school-c-grammar" &&
				(item.title.startsWith("Practice Map:") ||
					item.title.startsWith("Extension Review:"))
			) {
				expect(
					container.textContent!.trim().length,
					item.title
				).toBeGreaterThan(170);
				expect(container.textContent, item.title).not.toContain(
					"speech outline"
				);
			}
			return {
				id: item.id,
				title: item.title,
				learningPath: item.learningPath,
				selfChecks,
				sourceContentSHA256: digest(item.content),
				assignmentTextScope: completeAssignment
					? "complete"
					: "directive",
				directiveTextMode: fullBlocks ? "innerText" : "textContent",
				requiredDirective: container
					.textContent!.replace(/\s+/g, " ")
					.trim()
			};
		};
		const algebra = id === "algebra-2a" || id === "algebra-2b";
		const algebra1 = id === "algebra-1a" || id === "algebra-1b";
		const modules = course.modules
			.filter(
				module =>
					!module.internal &&
					(!(
						algebra ||
						id === "algebra-1b" ||
						[
							"early-elementary-a-math",
							"early-elementary-b-math",
							"late-elementary-a-math",
							"late-elementary-b-math",
							"early-elementary-a-reading",
							"early-elementary-b-picture-book"
						].includes(id)
					) ||
						module.kind !== "appendix")
			)
			.map(module => ({
				id: module.id,
				title: module.title,
				kind: module.kind ?? "module",
				retainedInternalItems: [
					...module.curriculum,
					...module.supplementalProjects
				]
					.filter(item => item.internal)
					.map(item => ({ id: item.id, title: item.title })),
				readings: [...module.curriculum, ...module.supplementalProjects]
					.filter(
						item => !item.internal && isLessonLearningItem(item)
					)
					.map(reading),
				projects: module.curriculum
					.filter(
						item => !item.internal && !isLessonLearningItem(item)
					)
					.map(card),
				optional: module.supplementalProjects
					.filter(
						item => !item.internal && !isLessonLearningItem(item)
					)
					.map(card)
			}));
		expect(
			modules
				.filter(module => isReviewedModule(id, module.title))
				.flatMap(module => module.readings)
		).toHaveLength(count);
		if (id === "pythonic-design-patterns") {
			expect(
				modules.filter(module => module.kind === "module")
			).toHaveLength(13);
			const reviewed = modules.filter(module =>
				isReviewedModule(id, module.title)
			);
			expect(reviewed).toHaveLength(9);
			expect(reviewed.flatMap(module => module.readings)).toHaveLength(
				28
			);
			const tasks = reviewed.flatMap(module => [
				...module.projects,
				...module.optional
			]);
			expect(tasks).toHaveLength(35);
			expect(
				tasks.every(task => task.assignmentTextScope === "complete")
			).toBe(true);
		} else if (id === "pre-algebra-b") {
			expect(modules).toHaveLength(10);
			expect(
				modules.filter(module => module.kind === "module")
			).toHaveLength(9);
			expect(modules.flatMap(module => module.readings)).toHaveLength(11);
			const activities = modules.flatMap(module => [
				...module.projects,
				...module.optional
			]);
			expect(activities).toHaveLength(34);
			expect(
				activities.every(
					item => item.assignmentTextScope === "complete"
				)
			).toBe(true);
			expect(activities.flatMap(item => item.selfChecks)).toHaveLength(
				14
			);
		} else if (id === "design-patterns-in-java") {
			expect(modules).toHaveLength(14);
			const activities = modules.flatMap(module => [
				...module.projects,
				...module.optional
			]);
			expect(activities).toHaveLength(102);
			expect(
				modules.flatMap(module => [
					...module.readings,
					...module.projects,
					...module.optional
				])
			).toHaveLength(134);
			expect(
				activities.every(
					item => item.assignmentTextScope === "complete"
				)
			).toBe(true);
			expect(activities.flatMap(item => item.selfChecks)).toHaveLength(
				204
			);
		} else if (id === "design-patterns-in-java-part-2") {
			expect(modules).toHaveLength(14);
			const reviewed = modules.filter(module =>
				isReviewedModule(id, module.title)
			);
			expect(reviewed).toHaveLength(14);
			expect(reviewed.flatMap(module => module.readings)).toHaveLength(
				30
			);
			const activities = reviewed.flatMap(module => [
				...module.projects,
				...module.optional
			]);
			expect(activities).toHaveLength(129);
			expect(
				reviewed.flatMap(module => [
					...module.readings,
					...module.projects,
					...module.optional
				])
			).toHaveLength(159);
			expect(
				activities.every(
					item => item.assignmentTextScope === "complete"
				)
			).toBe(true);
			expect(activities.flatMap(item => item.selfChecks)).toHaveLength(
				258
			);
		} else if (id === "network-systems") {
			expect(modules).toHaveLength(21);
			expect(
				modules.filter(module => module.kind === "module")
			).toHaveLength(14);
			expect(
				modules.filter(module => module.kind === "appendix")
			).toHaveLength(7);
			expect(modules.flatMap(module => module.readings)).toHaveLength(56);
			const activities = modules.flatMap(module => [
				...module.projects,
				...module.optional
			]);
			expect(activities).toHaveLength(79);
			expect(
				activities.every(
					item => item.assignmentTextScope === "complete"
				)
			).toBe(true);
		} else if (id === "java-level-3") expect(modules).toHaveLength(25);
		else if (id === "algebra-1a") {
			expect(modules).toHaveLength(22);
			expect(
				modules
					.filter(module => module.kind === "appendix")
					.map(module => module.title)
			).toEqual(["Algebra 1A Reference"]);
			expect(modules.flatMap(module => module.readings)).toHaveLength(21);
			const activities = modules.flatMap(module => [
				...module.projects,
				...module.optional
			]);
			expect(activities).toHaveLength(63);
			expect(
				activities.every(
					item => item.assignmentTextScope === "complete"
				)
			).toBe(true);
		} else if (id === "ai-level-1") {
			expect(modules).toHaveLength(18);
			expect(
				modules.filter(module => module.kind === "module")
			).toHaveLength(16);
			expect(
				modules
					.filter(module => module.kind === "appendix")
					.map(module => module.title)
			).toEqual([
				"Unit 9: Repo Extension Bank and Canonical Variants",
				"AI Level 1 Reference"
			]);
			expect(modules.flatMap(module => module.readings)).toHaveLength(34);
			const activities = modules.flatMap(module => [
				...module.projects,
				...module.optional
			]);
			expect(activities).toHaveLength(88);
			expect(
				activities.every(
					item => item.assignmentTextScope === "complete"
				)
			).toBe(true);
		} else if (algebra1) expect(modules).toHaveLength(25);
		else if (algebra)
			expect(modules).toHaveLength(id === "algebra-2a" ? 15 : 12);
		else
			expect(
				modules.filter(module => module.kind === "module")
			).toHaveLength(
				["geometry-a", "geometry-b"].includes(id)
					? 7
					: id === "pre-algebra-a"
						? 8
						: ["intro-to-physics", "physics-level-2"].includes(id)
							? 17
							: id === "middle-school-integrated-science"
								? 10
								: [
											"elementary-science",
											"intro-to-environmental-science"
									  ].includes(id)
									? 8
									: id === "intro-to-chemistry"
										? 11
										: count
			);
		for (const module of modules) {
			if (!isReviewedModule(id, module.title)) continue;
			if (id === "pythonic-design-patterns") {
				expect(module.readings).toHaveLength(
					/^PDP8 /.test(module.title) ? 2 : /^PDP[14] /.test(module.title) ? 4 : 3
				);
			} else if (id === "pre-algebra-b") {
				expect(module.readings, module.title).toHaveLength(
					module.kind === "appendix"
						? 1
						: /^PAB(?:1|6|10|15|20)-/.test(module.title)
							? 2
							: 0
				);
			} else if (id === "ai-level-1") {
				const expected =
					module.title === "AI Level 1 Reference"
						? 6
						: module.title.startsWith("FAI0")
							? 3
							: module.title.startsWith("Unit 9:")
								? 1
								: module.title.endsWith(": Practice Studio") ||
									  /^Unit [78]:/.test(module.title)
									? 2
									: 1;
				expect(module.readings, module.title).toHaveLength(expected);
			} else if (id === "network-systems") {
				const expected =
					{
						"Standards Map": 6,
						"Course Roadmap": 6,
						"Project Practice Guide": 4,
						"Network Systems: Systems and Security Lab Safety Policy": 4,
						"Network Systems: Defensive Lab Contract": 4,
						"Network Systems: Toolchain and Version Assumptions": 4,
						"Optional Network Expansion and Integration Studio Archive": 11,
						"Network Systems Lab 17: Operations Capstone Studio": 3,
						"Unit 2: Addresses and Naming": 2
					}[module.title] ?? 1;
				expect(module.readings, module.title).toHaveLength(expected);
			} else if (id === "design-patterns-in-java") {
				const expected =
					{
						"Optional Applied Java Pattern Studios": 7,
						"Standards Map": 5,
						"Course Roadmap": 6,
						"Project Practice Guide": 4
					}[module.title] ?? 1;
				expect(module.readings, module.title).toHaveLength(expected);
			} else if (id === "design-patterns-in-java-part-2") {
				expect(module.readings, module.title).toHaveLength(
					[
						"Standards Map",
						"Course Roadmap",
						"Project Practice Guide"
					].includes(module.title)
						? 4
						: module.title === "Optional Refactoring Clinics 11–17"
							? 8
							: 1
				);
			} else if (id === "geometry-a")
				expect(module.readings, module.title).toHaveLength(
					module.title.startsWith("Check-In")
						? 0
						: module.title.startsWith("GEOA4")
							? 2
							: 1
				);
			else if (id === "geometry-b")
				expect(module.readings, module.title).toHaveLength(
					module.title.startsWith("Check-In #1")
						? 0
						: /^(?:GEOB3|GEOB5|GEOB7|GEOB9)/.test(module.title)
							? 2
							: 1
				);
			else if (id === "pre-algebra-a")
				expect(module.readings, module.title).toHaveLength(
					module.title === "Pre-Algebra A Kick-Off" ||
						module.title === "Check-In #1"
						? 0
						: /^(?:PAA3|PAA8|PAA13|PAA18)/.test(module.title)
							? 2
							: 1
				);
			else if (
				["intro-to-physics", "physics-level-2"].includes(id) &&
				module.kind === "appendix"
			)
				expect(module.readings.length, module.title).toBeGreaterThan(0);
			else if (id === "physics-level-2")
				expect(module.readings, module.title).toHaveLength(
					module.title.startsWith("PHY8 ") ? 2 : 1
				);
			else if (id === "elementary-science")
				expect(module.readings).toHaveLength(
					module.kind === "appendix"
						? ["Standards Map", "Course Roadmap"].includes(
								module.title
							)
							? 6
							: 4
						: 1
				);
			else if (id === "middle-school-integrated-science")
				expect(module.readings).toHaveLength(
					module.kind === "appendix"
						? ["Standards Map", "Course Roadmap"].includes(
								module.title
							)
							? 6
							: 4
						: module.title.startsWith("MS9 ")
							? 5
							: 4
				);
			else if (
				[
					"intro-to-chemistry",
					"intro-to-environmental-science"
				].includes(id)
			) {
				const expected = (
					id === "intro-to-chemistry"
						? chemistryModuleCounts
						: environmentalModuleCounts
				)[module.title.split(" ")[0]];
				expect(expected, module.title).toBeDefined();
				expect(
					[
						module.readings.length,
						module.projects.length,
						module.optional.length
					],
					module.title
				).toEqual(expected);
			} else if (!algebra && !algebra1)
				expect(module.readings, module.title).toHaveLength(1);
			else if (algebra && module.readings.length === 0)
				expect(module.title).toMatch(/capstone/i);
			for (const reading of module.readings) {
				expect(
					reading.expectedText.length,
					module.title + " / " + reading.title
				).toBeGreaterThan(150);
				expect(reading.paragraphBreaks, reading.title).toBe(
					intentionalMathLineBreaks[id]?.[reading.title] ?? 0
				);
			}
		}
		if (process.env.SELF_STUDY_BROWSER_PROOF_DIR) {
			const output = process.env.SELF_STUDY_BROWSER_PROOF_DIR;
			mkdirSync(output, { recursive: true });
			writeFileSync(
				join(output, `${id}-${role}.json`),
				JSON.stringify(
					{
						schemaVersion: 1,
						sourceCommit:
							process.env.GITHUB_SHA ??
							execFileSync("git", ["rev-parse", "HEAD"], {
								encoding: "utf8"
							}).trim(),
						id,
						role,
						publishedIdentities: published[id].items,
						restoredIdentities: additions.length,
						sourceProjects: sourceProjects.length,
						modules,
						...([
							"pythonic-design-patterns",
							"java-level-3",
							"design-patterns-in-java-part-2",
							"design-patterns-in-java"
						].includes(id)
							? {
									reviewedModuleIds: modules
										.filter(module =>
											isReviewedModule(id, module.title)
										)
										.map(module => module.id)
								}
							: {}),
						reviewScope:
							id === "pythonic-design-patterns"
								? "PDP0-PDP8 scope: twenty-eight complete readings, nine core tasks and twenty-six supplemental activities per role/width profile. All 111 course identities and complete navigation are retained; the other course bodies, source families and IDE workflows require separate acceptance."
								: id === "design-patterns-in-java"
									? "Complete primary course: ten teaching units, applied studios and three reference appendices. All 134 published identities covered by 32 complete readings, 102 activities and 204 input/answer case views per role/width profile."
									: id === "design-patterns-in-java-part-2"
										? "Complete course: DPR1-DPR10, seven optional clinics and three reference appendices. All159published identities are covered by30readings,129activities and258input/answer case views per role/width profile. Individual source-editor qualifications remain separately recorded."
										: id === "java-level-3"
											? "AJ4 only: one reading, two core projects, three optional tasks and ten input/response views per profile. All 217 course identities checked; other Java units are outside this teaching and runtime acceptance."
											: id ===
												  "intro-to-environmental-science"
												? "Complete Environmental Science teaching and tasks:27readings,17coreactivities,24optionalactivities and82input/response views per profile;all68published identities retained. Owned photosynthesis model and supplied climate/pollution practice cases;legacy image record retained internally."
												: id === "intro-to-chemistry"
													? "Complete Chemistry teaching and tasks:62readings,14coreactivities,37optionalactivities and102input/response views per profile;all113published identities retained. Original video evidence remains distinct from authored text alternatives."
													: id === "intro-to-biology"
														? "Eight worked body-systems units:8readings,36coreactivities,24optionalprojects and120input/response views per profile;all68published identities retained. Original three legacy images remain separately identified."
														: id ===
															  "elementary-science"
															? "Eight teaching units and six reference appendices:36readings,48coreactivities,16optionalprojects and11optionalreferenceactivities;all111published identities checked."
															: id ===
																  "middle-school-integrated-science"
																? "Complete ten teaching units and five reference appendices:65readings,58complete optional/required activities and117input/response views per role/width profile;all123published identities retained."
																: id ===
																	  "early-elementary-a-reading"
																	? "Complete on-site explanations and supplied-text task defaults; original Juni named texts are retained as historical provenance,not claimed as recovered."
																	: id ===
																		  "early-elementary-b-picture-book"
																		? "Complete supplied teaching,practice,Nico narrative/performance inputs and briefs;the historical Gabby Tries text is not claimed as recovered."
																		: "complete course reading and assignment view",
						...(id === "pythonic-design-patterns"
							? {
									executableSourceAssignments: course.modules
										.filter(module =>
											isReviewedModule(id, module.title)
										)
										.flatMap(module => [
											...module.curriculum,
											...module.supplementalProjects
										])
										.filter(item =>
											item.projectLink?.includes(
												"github.com/instruction-material/Pythonic-Design-Patterns/"
											)
										)
										.map(item => ({
											id: item.id,
											starterUrl: item.projectLink
										})),
									remainingCourseScopeAccepted: false
								}
							: {}),
						internalModules: course.modules
							.filter(module => module.internal)
							.map(module => ({
								id: module.id,
								title: module.title
							})),
						referenceModules: course.modules
							.filter(
								module =>
									!module.internal &&
									module.kind === "appendix"
							)
							.map(module => ({
								id: module.id,
								title: module.title
							}))
					},
					null,
					2
				) + "\n"
			);
		}
	}
);
