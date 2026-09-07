import type {
	RawCourse,
	RawCourseModuleItem
} from "../front-end/src/stores/courses/types";
import { execFileSync } from "node:child_process";
import vm from "node:vm";
import {
	courseCatalog,
	loadRawCourse
} from "../front-end/src/stores/courses/index";

const SOURCE_REF = process.env.JUNI_SOURCE_REF ?? "bd194492";
const PROJECT_TITLE_RE = /\b(?:project|capstone)\b/i;

const originalCourseFiles = [
	["scratch-level-1", "scratch-level-1"],
	["scratch-level-2", "scratch-level-2"],
	["python-level-1", "python-level-1"],
	["pygames", "pygames"],
	["python-level-2", "python-level-2"],
	["python-level-3", "python-level-3"],
	["c-level-1", "cpp-level-1"],
	["java-level-1", "java-level-1"],
	["java-level-2", "java-level-2"],
	["java-level-3", "java-level-3"],
	["intro-to-physics", "intro-to-physics"],
	["intro-to-swift-app-development", "intro-to-swift-app-development"],
	[
		"javascript-level-1-javascript-superstar",
		"javascript-level-1"
	],
	[
		"javascript-level-2-javascript-master",
		"javascript-level-2"
	],
	["machine-learning", "machine-learning"]
] as const;

type CourseSection = "curriculum" | "supplementalProjects";

interface OriginalProject {
	content: string;
	hasSourceLink: boolean;
	id: string;
	moduleTitle: string;
	section: CourseSection;
	title: string;
}

interface PlacementMismatch extends OriginalProject {
	courseId: string;
	foundSections: CourseSection[];
	surface: "raw" | "display";
}

interface ContentMismatch extends OriginalProject {
	courseId: string;
	surface: "raw" | "normalized";
}

function loadOriginalCourse(file: string): RawCourse {
	const sourcePath = `front-end/src/stores/courses/${file}.ts`;
	const source = execFileSync("git", ["show", `${SOURCE_REF}:${sourcePath}`], {
		encoding: "utf8"
	});
	const executable = source
		.replace(/^import type[\s\S]*?;\s*/u, "")
		.replace(
			/export const\s+\w+\s*:\s*RawCourse\s*=\s*/u,
			"globalThis.__course = "
		);
	const context = vm.createContext({});
	vm.runInContext(executable, context, { filename: sourcePath });
	const course = (context as { __course?: RawCourse }).__course;

	if (!course) {
		throw new Error(`Unable to load original Juni course from ${sourcePath}.`);
	}

	return course;
}

function originalProjects(course: RawCourse): OriginalProject[] {
	const courseId = slugify(course.name);

	return course.modules.flatMap(module =>
		(["curriculum", "supplementalProjects"] as const).flatMap(section =>
			module[section]
				.filter(
					item =>
						section === "supplementalProjects" ||
						PROJECT_TITLE_RE.test(item.title)
				)
				.map(item => ({
					content: item.content.trim(),
					hasSourceLink: Boolean(
						item.projectLink || item.solutionLink
					),
					id: slugify(
						`${courseId}-${module.title}-${section === "curriculum" ? "curriculum" : "supplemental"}-${item.title}`
					),
					moduleTitle: module.title,
					section,
					title: item.title
				}))
		)
	);
}

function slugify(value: string): string {
	return value
		.toLowerCase()
		.normalize("NFKD")
		.replace(/[\u0300-\u036F]/g, "")
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-+/, "")
		.replace(/-+$/, "");
}

function isOriginalItem(
	item: RawCourseModuleItem,
	original: OriginalProject
): boolean {
	return (
		item.id === original.id ||
		item.aliases?.includes(original.id) === true ||
		item.title === original.title
	);
}

function sectionsForProject(
	course: RawCourse,
	original: OriginalProject
): CourseSection[] {
	const sections = new Set<CourseSection>();

	for (const module of course.modules) {
		for (const section of ["curriculum", "supplementalProjects"] as const) {
			if (module[section].some(item => isOriginalItem(item, original))) {
				sections.add(section);
			}
		}
	}

	return [...sections];
}

function itemForTitle(
	course: RawCourse,
	original: OriginalProject
): RawCourseModuleItem | undefined {
	return course.modules
		.flatMap(module => [
			...module.curriculum,
			...module.supplementalProjects
		])
		.find(item => isOriginalItem(item, original));
}

function placementMatches(
	sections: CourseSection[],
	expected: CourseSection
): boolean {
	return sections.length === 1 && sections[0] === expected;
}

const placementMismatches: PlacementMismatch[] = [];
const missingProjects: Array<
	OriginalProject & { courseId: string; surface: "raw" | "display" }
> = [];
const scratchContentMismatches: ContentMismatch[] = [];
const scratchProjectsWithoutSourceLinks: Array<{
	courseId: string;
	title: string;
}> = [];
const scratchProjectsMissingCurrentLinks: Array<{
	courseId: string;
	title: string;
}> = [];
let originalProjectCount = 0;
let scratchProjectCount = 0;

for (const [courseId, file] of originalCourseFiles) {
	const catalogEntry = courseCatalog.find(entry => entry.id === courseId);

	if (!catalogEntry) {
		throw new Error(`Current course catalog is missing ${courseId}.`);
	}

	const [rawCourse, displayCourse] = await Promise.all([
		catalogEntry.load(),
		loadRawCourse(courseId)
	]);

	if (!displayCourse) {
		throw new Error(`Unable to normalize current course ${courseId}.`);
	}

	for (const project of originalProjects(loadOriginalCourse(file))) {
		originalProjectCount += 1;

		for (const [surface, course] of [
			["raw", rawCourse],
			["display", displayCourse]
		] as const) {
			const foundSections = sectionsForProject(course, project);

			if (foundSections.length === 0) {
				missingProjects.push({
					...project,
					courseId,
					surface
				});
			} else if (!placementMatches(foundSections, project.section)) {
				placementMismatches.push({
					...project,
					courseId,
					foundSections,
					surface
				});
			}
		}

		if (courseId.startsWith("scratch-level-")) {
			scratchProjectCount += 1;
			const rawItem = itemForTitle(rawCourse, project);
			if (!project.hasSourceLink) {
				scratchProjectsWithoutSourceLinks.push({
					courseId,
					title: project.title
				});
			} else if (!rawItem?.projectLink && !rawItem?.solutionLink) {
				scratchProjectsMissingCurrentLinks.push({
					courseId,
					title: project.title
				});
			}

			for (const [surface, course] of [
				["raw", rawCourse],
				["normalized", displayCourse]
			] as const) {
				const current = itemForTitle(course, project);

				if (current?.content.trim() !== project.content) {
					scratchContentMismatches.push({
						...project,
						courseId,
						surface
					});
				}
			}
		}
	}
}

console.log(
	JSON.stringify(
		{
			missingProjectCount: missingProjects.length,
			missingProjects: missingProjects.map(
				({ courseId, section, surface, title }) => ({
					courseId,
					expectedSection: section,
					surface,
					title
				})
			),
			originalProjectCount,
			placementMismatchCount: placementMismatches.length,
			placementMismatches: placementMismatches.map(
				({ courseId, foundSections, section, surface, title }) => ({
					courseId,
					expectedSection: section,
					foundSections,
					surface,
					title
				})
			),
			scratchContentMismatchCount: scratchContentMismatches.length,
			scratchContentMismatches: scratchContentMismatches.map(
				({ courseId, surface, title }) => ({ courseId, surface, title })
			),
			scratchProjectCount,
			scratchProjectsMissingCurrentLinks,
			scratchProjectsWithoutSourceLinks,
			sourceRef: SOURCE_REF
		},
		null,
		2
	)
);

if (placementMismatches.length > 0 || scratchContentMismatches.length > 0) {
	process.exitCode = 1;
}
