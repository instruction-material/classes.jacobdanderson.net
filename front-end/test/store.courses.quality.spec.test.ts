import { beforeEach, describe, expect, it } from "vitest";
import fs from "node:fs";
import { createPinia, setActivePinia } from "pinia";
import { useCoursesStore } from "@/stores/courses";
import {
	courseCatalog,
	loadRawCourse as loadRawCourseWithoutCache
} from "@/stores/courses/index";
import {
	KNOWN_PENDING_STATIC_MEDIA_FILENAMES,
	canonicalStaticMediaUrl,
	hasPendingStaticMediaNotice,
	isLegacyStaticMediaUrl,
	isStaticMediaUrl,
	normalizeStaticMediaUrlsInText,
	pendingStaticMediaNotice,
	staticMediaFilename,
	staticMediaUrlsFromText,
	staticMediaUrl
} from "@/stores/courses/staticMedia";
import { buildProjectGuidance } from "@/stores/courses/projectGuidance";
import { buildSupportSectionGuidance } from "@/stores/courses/supportSectionGuidance";
import {
	parseCourseAssetUrl,
	slugMarkdownHeading
} from "@/modules/courseAssetPreview";
import { isGitHubUrl } from "@/modules/resourceUrls";

const COURSE_SWEEP_TIMEOUT = 180000;
const LEGACY_STATIC_HOST_IN_TEXT_RE =
	/(^|[^a-z0-9.-])static\.junilearning\.com(?=$|[^a-z0-9.-])/i;
const normalizedCoursePromises = new Map<
	string,
	ReturnType<typeof loadRawCourseWithoutCache>
>();

function loadRawCourse(id: string) {
	const cachedCourse = normalizedCoursePromises.get(id);
	if (cachedCourse) return cachedCourse;

	const coursePromise = loadRawCourseWithoutCache(id);
	normalizedCoursePromises.set(id, coursePromise);
	return coursePromise;
}

function allCourseText(course: Awaited<ReturnType<typeof loadRawCourse>>) {
	expect(course).not.toBeNull();
	if (!course) return "";

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

function learnerCourseText(course: Awaited<ReturnType<typeof loadRawCourse>>) {
	expect(course).not.toBeNull();
	if (!course) return "";

	return course.modules
		.filter(module => module.kind !== "appendix")
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

function allCourseItemTitles(
	course: NonNullable<Awaited<ReturnType<typeof loadRawCourse>>>
) {
	return course.modules.flatMap(module =>
		[...module.curriculum, ...module.supplementalProjects].map(item => ({
			module: module.title,
			title: item.title
		}))
	);
}

function wordCount(text: string) {
	return text.match(/\b[\w'+-]+\b/g)?.length ?? 0;
}

function isProjectLikeTitle(title: string) {
	return (
		!isInformationalResourceTitle(title) &&
		/project|capstone|challenge|lab|practice|drill|notebook|audit|reflection|build|create|implement|exercise/i.test(
			title
		)
	);
}

const explicitProjectTitlePattern = new RegExp(
	[
		"^(?:(?:[A-Z]{2,}\\d+(?:\\.\\d+)?|PS\\d+|GM\\d+|JSS\\d+|JSM\\d+|Unit\\s+\\d+)\\s+)?",
		"(?:Core Project|Project|Practice Project|Extension Project|Extension Challenge|Capstone|Master Project|",
		"Supplemental Project|Catalog Project|Graphics Java Project|Guided Practice|Data Practice|Simulation Practice|",
		"Readiness Check|Checkpoint:|Extension:|Supplemental:|Design Exercise:)"
	].join(""),
	"i"
);

const informationalResourceTitlePattern = new RegExp(
	`\\b(?:${[
		"answer key",
		"archive",
		"course asset",
		"free response",
		"frq",
		"guide",
		"handbook",
		"materials?",
		"multiple choice",
		"official scoring",
		"practice exam",
		"reference",
		"resource",
		"rubric",
		"scoring guidelines",
		"setup checklist",
		"textbook",
		"worksheet"
	].join("|")})\\b`,
	"i"
);

function isExplicitProjectTitle(title: string) {
	return (
		explicitProjectTitlePattern.test(title) ||
		/\b(?:Extension|Transfer) Practice\b/i.test(title)
	);
}

function isInformationalResourceTitle(title: string) {
	return (
		!isExplicitProjectTitle(title) &&
		informationalResourceTitlePattern.test(title)
	);
}

const lessonBackbonePattern =
	/\*\*(?:Applied studio|Build focus|Build path|Concept focus|Concept path|Course flow|Course path|Course position|Evidence gate|Evidence of proficiency|Evidence target|Evidence targets|Explanation|Focus|Goal|Investigation|Playable result|Practice route|Project selection|Project target|Readiness check|Readiness map|Result|Science explanation|Scope path|Selected checks|Shared phenomenon|Studio focus|Verification gate):\*\*|Core topics in this module:|Representative solutions|Check-?In #\d+|Check-in goal|\bReview\b/i;

function findItem(
	course: NonNullable<Awaited<ReturnType<typeof loadRawCourse>>>,
	titlePattern: RegExp,
	contentPattern?: RegExp
) {
	for (const module of course.modules) {
		const item = [
			...module.curriculum,
			...module.supplementalProjects
		].find(
			item =>
				titlePattern.test(item.title) &&
				(!contentPattern || contentPattern.test(item.content))
		);

		if (item) return item;
	}

	throw new Error(`Could not find course item matching ${titlePattern}`);
}

function markdownHeadingSlugs(path: string) {
	const markdown = fs.readFileSync(path, "utf8");
	return new Set(
		[...markdown.matchAll(/^##+\s+(.+)$/gm)].map(match =>
			slugMarkdownHeading(match[1])
		)
	);
}

function courseItemLinks(
	courseId: string,
	course: NonNullable<Awaited<ReturnType<typeof loadRawCourse>>>
) {
	return course.modules.flatMap(module =>
		[...module.curriculum, ...module.supplementalProjects].flatMap(item =>
			[
				["projectLink", item.projectLink],
				["solutionLink", item.solutionLink],
				["datasetLink", item.datasetLink],
				["mediaLink", item.mediaLink]
			].flatMap(([kind, link]) =>
				link
					? [
							{
								course: courseId,
								item: item.title,
								kind,
								link,
								module: module.title
							}
						]
					: []
			)
		)
	);
}

function duplicateProjectSolutionLinksInSource(path: string) {
	const source = fs.readFileSync(path, "utf8");
	const itemBlocks = source.split(/\n\s*\},?\n/);

	return itemBlocks.flatMap(block => {
		const title = block.match(/title:\s*"([^"]+)"/)?.[1] ?? "Untitled item";
		const projectLink = block
			.match(/projectLink:\s*(?:\n\s*)?"([^"]+)"/)?.[1]
			?.trim();
		const solutionLink = block
			.match(/solutionLink:\s*(?:\n\s*)?"([^"]+)"/)?.[1]
			?.trim();

		return projectLink && solutionLink === projectLink
			? [`${path} / ${title}: ${projectLink}`]
			: [];
	});
}

function visibleCourseSourceCorpus() {
	const excludedFiles = new Set([
		"course-implementation-artifacts.ts",
		"normalization.ts",
		"research-expansions.ts"
	]);

	return fs
		.readdirSync("src/stores/courses")
		.filter(
			file =>
				file.endsWith(".ts") &&
				!excludedFiles.has(file) &&
				file !== "index.ts"
		)
		.map(file => fs.readFileSync(`src/stores/courses/${file}`, "utf8"))
		.join("\n");
}

function rawCourseSourceCorpus() {
	const excludedFiles = new Set([
		"course-implementation-artifacts.ts",
		"implementationLabGuidance.ts",
		"normalization.ts",
		"physicsContentContext.ts",
		"projectGuidance.ts",
		"public-pathways.ts",
		"research-expansions.ts",
		"supportSectionGuidance.ts",
		"types.ts"
	]);

	return fs
		.readdirSync("src/stores/courses")
		.filter(
			file =>
				file.endsWith(".ts") &&
				!excludedFiles.has(file) &&
				file !== "index.ts"
		)
		.map(file => fs.readFileSync(`src/stores/courses/${file}`, "utf8"))
		.join("\n");
}

function stripLinksFromSource(source: string) {
	return source
		.replace(/https?:\/\/[^"',\s)]+/g, "")
		.replace(
			/["'`][^"'`]*\.(?:gif|jpe?g|mp4|png|svg|webm|zip)["'`]/gi,
			'""'
		);
}

function literalCourseIdsLoadedByTests() {
	return fs
		.readdirSync("test")
		.filter(file => file.endsWith(".ts"))
		.flatMap(file => {
			const source = fs.readFileSync(`test/${file}`, "utf8");

			return [...source.matchAll(/loadRawCourse\("([^"]+)"\)/g)].map(
				match => ({
					file,
					id: match[1]
				})
			);
		});
}

type LoadedCatalogCourse = {
	course: NonNullable<Awaited<ReturnType<typeof loadRawCourse>>>;
	entry: (typeof courseCatalog)[number];
};

let loadedCatalogCoursesPromise: Promise<LoadedCatalogCourse[]> | null = null;
let loadedCatalogTextPromise: Promise<string> | null = null;

async function loadedCatalogCourses() {
	loadedCatalogCoursesPromise ??= Promise.all(
		courseCatalog.map(async entry => {
			const course = await loadRawCourse(entry.id);
			if (!course) throw new Error(`Could not load course ${entry.id}`);

			return { course, entry };
		})
	);

	return loadedCatalogCoursesPromise;
}

async function loadedCatalogCourseList() {
	return (await loadedCatalogCourses()).map(({ course }) => course);
}

async function loadedCatalogText() {
	loadedCatalogTextPromise ??= loadedCatalogCourseList().then(courses =>
		courses.map(allCourseText).join("\n")
	);

	return loadedCatalogTextPromise;
}

describe("course text quality normalization", () => {
	beforeEach(() => {
		setActivePinia(createPinia());
	});

	it("keeps literal course IDs in course tests aligned with the catalog", () => {
		const catalogIds = new Set(courseCatalog.map(entry => entry.id));
		const unknownIds = literalCourseIdsLoadedByTests()
			.filter(reference => !catalogIds.has(reference.id))
			.map(reference => `${reference.file}: ${reference.id}`);

		expect(unknownIds).toEqual([]);
	});

	it("keeps the Java catalog track consolidated to Java Level 1 through Level 3", () => {
		const catalogIds = courseCatalog.map(entry => entry.id);

		expect(catalogIds).not.toContain("java-without-graphics");
		expect(catalogIds).not.toContain("java-with-graphics");
		expect(
			catalogIds.filter(courseId => courseId.startsWith("java-level-"))
		).toEqual(["java-level-1", "java-level-2", "java-level-3"]);
	});

	it("keeps Python course reference links available for colors and data methods", async () => {
		const [pythonLevel1, pythonLevel2] = await Promise.all([
			loadRawCourse("python-level-1"),
			loadRawCourse("python-level-2")
		]);
		const pythonLevel1Text = allCourseText(pythonLevel1);
		const pythonLevel2Text = allCourseText(pythonLevel2);

		expect(pythonLevel1Text).toContain("https://trinket.io/docs/colors");
		expect(pythonLevel1Text).toContain(
			"https://www.w3schools.com/python/python_ref_list.asp"
		);

		for (const referenceUrl of [
			"https://www.w3schools.com/python/python_ref_string.asp",
			"https://www.w3schools.com/python/python_ref_list.asp",
			"https://www.w3schools.com/python/python_ref_dictionary.asp",
			"https://www.w3schools.com/python/python_ref_tuple.asp",
			"https://www.w3schools.com/python/python_ref_set.asp"
		]) {
			expect(pythonLevel2Text).toContain(referenceUrl);
		}
	});

	it("keeps informational resource cards free of generated project scaffolds", async () => {
		const samples = [
			{
				courseId: "ap-computer-science-a",
				moduleTitle: "General: Course Introduction and Setup",
				itemTitle: "Required Textbook"
			},
			{
				courseId: "ap-computer-science-a",
				moduleTitle: "General: Course Introduction and Setup",
				itemTitle: "Reference Pack"
			},
			{
				courseId: "ap-computer-science-a",
				moduleTitle: "General: Course Introduction and Setup",
				itemTitle: "Strings and Printing Reference"
			},
			{
				courseId: "data-science-in-python",
				moduleTitle: "DSP0 Setup and Tooling",
				itemTitle: "Reference Archive: Data Science in Python Workspace"
			},
			{
				courseId: "ai-level-1",
				moduleTitle: "FAI0 Setup and Tooling",
				itemTitle: "Reference Archive: AI Level 1 Workspace"
			},
			{
				courseId: "java-level-2",
				moduleTitle: "Optional Java Level 2 Practice and Reference Archive",
				itemTitle: "Reference: HashMaps Examples"
			}
		];
		const generatedScaffoldPattern =
			/\*\*(?:Goal|Focus|Required outcome|Completion checks|Extension|Concept focus|Practice sequence|Learning sequence|Mastery check):\*\*/i;

		for (const sample of samples) {
			const course = await loadRawCourse(sample.courseId);
			expect(course).not.toBeNull();
			const module = course?.modules.find(
				module => module.title === sample.moduleTitle
			);
			const item = [
				...(module?.curriculum ?? []),
				...(module?.supplementalProjects ?? [])
			].find(item => item.title === sample.itemTitle);

			expect(
				item,
				`${sample.courseId} / ${sample.moduleTitle} / ${sample.itemTitle}`
			).toBeDefined();
			expect(item?.content).not.toMatch(generatedScaffoldPattern);
		}
	});

	it("keeps the APCS textbook reference current and publisher-backed", async () => {
		const course = await loadRawCourse("ap-computer-science-a");
		expect(course).not.toBeNull();

		const item = findItem(course!, /^Required Textbook$/);
		expect(item.content).toContain(
			"Barron's AP Computer Science A Premium, 13th Edition"
		);
		expect(item.content).toContain("2026 exam outline");
		expect(item.projectLink).toContain("simonandschuster.com");
		expect(item.projectLink).toContain("9798349700354");
		expect(item.projectLink).not.toContain("1506287913");
		expect(item.projectLink).not.toContain("amazon.com");
	});

	it(
		"keeps support-labeled course content split into readable paragraphs",
		async () => {
			const denseParagraphs: string[] = [];
			const courses = await loadedCatalogCourses();

			for (const { entry, course } of courses) {
				for (const module of course.modules) {
					for (const item of [
						...module.curriculum,
						...module.supplementalProjects
					]) {
						const paragraphs = item.content.split(/\n\s*\n/);

						for (const [index, paragraph] of paragraphs.entries()) {
							const text = paragraph.replace(/\s+/g, " ").trim();
							if (
								!text ||
								/^[-*]\s|^\d+\.\s|^#{1,6}\s|^\|/.test(text) ||
								/^\*\*[^*\n]{2,60}:\*\*\s*\n(?:\s*-\s+[^\n]+(?:\n|$)){2,}/.test(
									paragraph.trim()
								)
							) {
								continue;
							}

							const numberedCount =
								text.match(
									/(?:^|[;:.])\s*(?:\d+\)|\d+\.)\s+[A-Z0-9`]/g
								)?.length ?? 0;
							const semicolonSectionCount =
								text.match(
									/;\s*(?:and\s+)?(?:then\s+)?[A-Z][^;]{20,}/g
								)?.length ?? 0;
							const boldLabelCount =
								text.match(/\*\*[^*]{2,60}:\*\*/g)?.length ?? 0;

							if (
								text.length > 520 &&
								(boldLabelCount >= 3 ||
									numberedCount >= 2 ||
									semicolonSectionCount >= 3)
							) {
								denseParagraphs.push(
									`${entry.id} > ${module.title} > ${item.title} > paragraph ${index + 1}`
								);
							}
						}
					}
				}
			}

			expect(denseParagraphs).toEqual([]);
		},
		COURSE_SWEEP_TIMEOUT
	);

	it(
		"keeps loaded catalog copy free of mechanical generation artifacts",
		async () => {
			const failures: string[] = [];
			const artifactChecks = [
				{
					name: "empty bullet",
					pattern: /(?:^|\n)\s*[-*]\s*(?:\n|$)/
				},
				{
					name: "stale generated run wording",
					pattern:
						/\b(?:Build the smallest reproducible|Build the core|Verify the intended) the [^.?!\n]+? (?:run|behavior) first\b/i
				},
				{
					name: "duplicate generated word",
					pattern: /\b([A-Za-z]{3,})\s+\1\b/i
				},
				{
					name: "unfinished placeholder",
					pattern: /\b(?:TODO|FIXME|TBD|lorem ipsum)\b/i
				}
			];

			for (const { entry, course } of await loadedCatalogCourses()) {
				for (const module of course.modules) {
					for (const item of [
						...module.curriculum,
						...module.supplementalProjects
					]) {
						const text = item.content;

						for (const { name, pattern } of artifactChecks) {
							const match = text.match(pattern);
							if (!match) continue;

							failures.push(
								`${name}: ${entry.id} > ${module.title} > ${item.title} (${match[0]})`
							);
						}
					}
				}
			}

			expect(failures).toEqual([]);
		},
		COURSE_SWEEP_TIMEOUT
	);

	it(
		"keeps generated checkpoint support from repeating directive checkpoint titles",
		async () => {
			const repetitiveCheckpointSupport: string[] = [];
			const patterns = [
				/\bUse this checkpoint\b/i,
				/\bUse (?:the )?[^.?!\n]{0,120}? checkpoint (?:to|as)\b/i,
				/\b(?:The|the|For the|In the) (?:[A-Z][A-Za-z0-9 +&:.-]{0,80}:\s*)?Check-?In\s+#?\d+(?:\s*:\s*[^.!?\n]{1,100})?(?:\s+Overview)?\s+checkpoint\b/,
				/\bThis checkpoint explanation\b/i
			];
			const courses = await loadedCatalogCourses();

			for (const { entry, course } of courses) {
				for (const module of course.modules) {
					for (const item of [
						...module.curriculum,
						...module.supplementalProjects
					]) {
						const pattern = patterns.find(pattern =>
							pattern.test(item.content)
						);
						if (!pattern) continue;

						repetitiveCheckpointSupport.push(
							`${entry.id} > ${module.title} > ${item.title} > ${pattern}`
						);
					}
				}
			}

			expect(repetitiveCheckpointSupport).toEqual([]);
		},
		COURSE_SWEEP_TIMEOUT
	);

	it(
		"keeps course-meta labels descriptive instead of directive",
		async () => {
			const directiveMetaLabels: string[] = [];
			const patterns = [
				/\*\*(?:Concept path|Course use|Learning path|Reference plan):\*\*\s+Use this\b/i,
				/(?:^|\n)Use this (?:studio|pack|legacy)\b/i
			];
			const courses = await loadedCatalogCourses();

			for (const { entry, course } of courses) {
				for (const module of course.modules) {
					for (const item of [
						...module.curriculum,
						...module.supplementalProjects
					]) {
						const pattern = patterns.find(pattern =>
							pattern.test(item.content)
						);
						if (!pattern) continue;

						directiveMetaLabels.push(
							`${entry.id} > ${module.title} > ${item.title} > ${pattern}`
						);
					}
				}
			}

			expect(directiveMetaLabels).toEqual([]);
		},
		COURSE_SWEEP_TIMEOUT
	);

	it("keeps advanced bridge and reference cards substantive", async () => {
		const samples = [
			{
				courseId: "data-science-in-python",
				itemTitle:
					"Reference Archive: Data Science in Python Workspace",
				minWords: 85,
				required: [/folder layout/i, /sample data/i, /limitation/i]
			},
			{
				courseId: "ai-level-1",
				itemTitle: "Reference Archive: AI Level 1 Workspace",
				minWords: 80,
				required: [
					/state representation/i,
					/search order/i,
					/algorithm/i
				]
			},
			{
				courseId: "python-to-java-and-cpp-bridge",
				itemTitle: "String Equality and Reference Habits",
				minWords: 75,
				required: [
					/\.equals\(\)/i,
					/==/i,
					/null/i,
					/reference identity/i
				]
			},
			{
				courseId: "cpp-level-2",
				itemTitle: "Level 2 Positioning and Ownership Vocabulary",
				minWords: 90,
				required: [/owner/i, /borrower/i, /invariant/i, /valid state/i]
			},
			{
				courseId: "cpp-level-2",
				itemTitle:
					"References, Lifetimes, and Evidence-Based Debugging",
				minWords: 85,
				required: [
					/const/i,
					/alias diagram/i,
					/sanitizers/i,
					/lifetime/i
				]
			},
			{
				courseId: "cpp-level-3",
				itemTitle: "Scanning, Parsing, and Error Boundaries",
				minWords: 90,
				required: [
					/scanner/i,
					/parser/i,
					/accepted and rejected/i,
					/application state/i
				]
			},
			{
				courseId: "cpp-level-3",
				itemTitle: "RAII and Single-Owner Resource Design",
				minWords: 85,
				required: [
					/destructors/i,
					/std::unique_ptr/i,
					/moving/i,
					/std::shared_ptr/i
				]
			},
			{
				courseId: "cpp-level-3",
				itemTitle: "Validation, Exceptions, and Resource Boundaries",
				minWords: 85,
				required: [
					/rollback/i,
					/basic guarantee/i,
					/temporary work/i,
					/RAII/i
				]
			},
			{
				courseId: "cpp-level-3",
				itemTitle: "Advanced Pathways and Program Framing",
				minWords: 95,
				required: [
					/Data Structures and Algorithms/i,
					/Design Patterns/i,
					/C Systems Engineering/i,
					/parse trace/i
				]
			},
			{
				courseId: "java-level-2",
				itemTitle: "Reference and Solution Boundaries",
				minWords: 70,
				required: [
					/starter-style/i,
					/solution-style/i,
					/course pacing/i,
					/current project/i
				]
			},
			{
				courseId: "java-level-2",
				itemTitle: "Reference: HashMaps Examples",
				minWords: 70,
				required: [/HashMap/i, /lookup/i, /missing key/i, /key-value/i]
			},
			{
				courseId: "java-level-2",
				itemTitle: "Reference: Try-Catch Example",
				minWords: 80,
				required: [
					/try/i,
					/catch/i,
					/checked exceptions/i,
					/safely continue/i
				]
			},
			{
				courseId: "java-level-1",
				itemTitle: "Java Level 1 Project: Console Object Model",
				minWords: 95,
				required: [
					/main/i,
					/object state/i,
					/field access/i,
					/Java-specific design/i
				]
			},
			{
				courseId: "java-level-1",
				itemTitle: "Java Level 1 Project: Record-backed Data Summary",
				minWords: 95,
				required: [
					/record components/i,
					/sample rows/i,
					/named components/i,
					/immutable/i
				]
			},
			{
				courseId: "java-level-2",
				itemTitle: "Collections and Contracts",
				minWords: 105,
				required: [
					/mutability/i,
					/duplicate/i,
					/lookup misses/i,
					/HashMap/i
				]
			},
			{
				courseId: "java-level-2",
				itemTitle: "Java Level 2 Project: Interface-driven Simulator",
				minWords: 95,
				required: [
					/interface type/i,
					/implementation class/i,
					/same starting state/i,
					/simulation state/i
				]
			},
			{
				courseId: "java-level-2",
				itemTitle: "Java Level 2 Project: Record-backed CSV Loader",
				minWords: 95,
				required: [
					/expected columns/i,
					/typed record/i,
					/accepted dataset/i,
					/domain logic/i
				]
			},
			{
				courseId: "java-level-3",
				itemTitle: "Reference: Node Class",
				minWords: 80,
				required: [
					/linked-list/i,
					/child nodes/i,
					/object references/i,
					/reassignment/i
				]
			},
			{
				courseId: "java-level-3",
				itemTitle: "Reference: Open Addressing Hash Tables",
				minWords: 80,
				required: [
					/probe sequence/i,
					/tombstones/i,
					/separate chaining/i,
					/successful lookup/i
				]
			}
		];

		for (const sample of samples) {
			const course = await loadRawCourse(sample.courseId);
			expect(course, sample.courseId).not.toBeNull();
			const item = findItem(
				course!,
				new RegExp(`^${sample.itemTitle}$`, "i")
			);

			expect(
				wordCount(item.content),
				sample.itemTitle
			).toBeGreaterThanOrEqual(sample.minWords);
			for (const pattern of sample.required) {
				expect(item.content, `${sample.itemTitle}: ${pattern}`).toMatch(
					pattern
				);
			}
		}
	});

	it(
		"keeps generated support free of article-collision grammar artifacts",
		async () => {
			const artifactPatterns = [
				/\bexpected the\b/i,
				/\bA complete the\b/i,
				/\bThe final the\b/i,
				/\bthe\s+the\b/i,
				/\ba\s+the\b/i,
				/\ban\s+the\b/i
			];
			const failures = (await loadedCatalogCourses()).flatMap(
				({ course, entry }) =>
					course.modules.flatMap(module =>
						[
							...module.curriculum,
							...module.supplementalProjects
						].flatMap(item => {
							const matched = artifactPatterns.find(pattern =>
								pattern.test(item.content)
							);

							return matched
								? [
										`${entry.id} / ${module.title} / ${item.title}: ${matched}`
									]
								: [];
						})
					)
			);

			expect(failures).toEqual([]);
		},
		COURSE_SWEEP_TIMEOUT
	);

	it(
		"removes generated placeholder language from loaded catalog text",
		async () => {
			const corpus = await loadedCatalogText();

			expect(corpus).not.toMatch(/introduce the main goal/i);
			expect(corpus).not.toMatch(/build the central artifact/i);
			expect(corpus).not.toMatch(/alternate supplemental snapshot/i);
			expect(corpus).not.toMatch(
				/Extension Challenge(?:\s*:\s*Extension Challenge|\s+Extension Challenge)/i
			);
			expect(corpus).not.toMatch(/\bclass model class\b/i);
			expect(corpus).not.toMatch(
				/\b[A-Z][A-Za-z0-9 '&:/-]{1,120}? class model\b/
			);
		},
		COURSE_SWEEP_TIMEOUT
	);

	it(
		"keeps pending static media notes free of implementation-facing placeholder copy",
		async () => {
			const failures: string[] = [];
			const staleStaticMediaCopyPattern = new RegExp(
				[
					"has placeholders? for",
					"placeholder appendix",
					"placeholder for (?:a |the )?(?:asset|data file|demo media|diagram|image|static|visual)",
					"static asset placeholder",
					"static image placeholders",
					"static-host placeholders",
					"future class-host placeholders",
					"class static host",
					"class-static URL",
					"static\\.classes placeholders?",
					"when the matching file is available",
					"when the asset is available"
				].join("|"),
				"i"
			);

			for (const { entry, course } of await loadedCatalogCourses()) {
				for (const module of course.modules) {
					for (const item of [
						...module.curriculum,
						...module.supplementalProjects
					]) {
						const match = [
							module.title,
							item.title,
							item.content
						].join("\n").match(
							staleStaticMediaCopyPattern
						);
						if (!match) continue;

						failures.push(
							`${entry.id} / ${module.title} / ${item.title}: ${match[0]}`
						);
					}
				}
			}

			expect(failures).toEqual([]);
		},
		COURSE_SWEEP_TIMEOUT
	);

	it(
		"keeps generated support card titles topic-specific",
		async () => {
			const genericStandaloneTitles = new Set([
				"Applied Challenge",
				"Challenge Lab",
				"Challenge Practice",
				"Core Project",
				"Debugging and Failure Modes",
				"Diagnostic Checkpoint",
				"Extension Challenge",
				"Extension Lab",
				"Extension Practice",
				"Fluency Drill",
				"Focused Practice",
				"Modeling or Error Analysis",
				"Open-Ended Variant",
				"Planning and Architecture",
				"Review and Reflection",
				"Standards Practice Set",
				"Supplemental Project 2",
				"Supplemental Project 3",
				"Transfer Lab",
				"Transfer Practice",
				"Verification and Reflection"
			]);
			const repeatedSuffixPattern =
				/^(Applied Challenge|Core Project|Debugging and Failure Modes|Diagnostic Checkpoint|Extension Challenge|Fluency Drill|Focused Practice|Modeling or Error Analysis|Open-Ended Variant|Planning and Architecture|Review|Standards Practice Set|Transfer Practice|Extension Practice|Challenge Practice|Verification Review):\s+.*:\s+(Applied Challenge|Core Project|Debugging and Failure Modes|Diagnostic Checkpoint|Extension Challenge|Fluency Drill|Focused Practice|Modeling or Error Analysis|Open-Ended Variant|Planning and Architecture|Review and Reflection|Standards Practice Set|Transfer Practice|Extension Practice|Challenge Practice|Verification and Reflection)$/i;
			const genericSupplementalTitlePattern =
				/^Supplemental(?: Project| Practice)?\s+[2-9]$/i;
			const badArtifactPattern =
				/\bImplementation Lab\b|:\s*(?:Core Project|Review and Reflection|Extension Challenge)\s*$|:\s*$/i;
			const loadedCourses = await loadedCatalogCourses();
			const badTitles = loadedCourses.flatMap(({ entry, course }) =>
				course
					? allCourseItemTitles(course).flatMap(item =>
							genericStandaloneTitles.has(item.title) ||
							genericSupplementalTitlePattern.test(item.title) ||
							repeatedSuffixPattern.test(item.title) ||
							badArtifactPattern.test(item.title)
								? [
										`${entry.id} | ${item.module} | ${item.title}`
									]
								: []
						)
					: []
			);
			const corpus = loadedCourses
				.map(({ course }) =>
					allCourseItemTitles(course)
						.map(item => item.title)
						.join("\n")
				)
				.join("\n");
			const dataScienceCourse = loadedCourses.find(
				({ entry }) => entry.id === "data-science-in-python"
			)?.course;
			const dataScienceText = dataScienceCourse
				? allCourseText(dataScienceCourse)
				: "";

			expect(badTitles).toEqual([]);
			expect(corpus).toContain(
				"Transfer Practice: Setup, Editors, and Asset Workflow"
			);
			expect(corpus).toContain("Review: CSV Summaries and Sanity Checks");
			expect(corpus).toContain("Min-Max and Outlier Extension");
			expect(corpus).toContain("Median and Mode Practice");
			expect(dataScienceText).not.toContain(
				"equipment-free investigation writeup"
			);
		},
		COURSE_SWEEP_TIMEOUT
	);

	it("keeps generated planning and verification support sections substantive", () => {
		const examples = [
			buildSupportSectionGuidance({
				courseFamily: "Scratch Level 1",
				moduleTitle: "Starting in Scratch",
				section: "planning"
			}),
			buildSupportSectionGuidance({
				courseFamily: "USACO Bronze",
				moduleTitle: "Why Did the Cow Cross the Road",
				section: "planning"
			}),
			buildSupportSectionGuidance({
				courseFamily: "Rust Systems Security",
				moduleTitle: "Ownership, Moves, and Memory Responsibility",
				section: "verification"
			}),
			buildSupportSectionGuidance({
				courseFamily: "Java Level 2",
				moduleTitle: "Bank Account",
				section: "verification"
			})
		];

		for (const content of examples) {
			expect(wordCount(content)).toBeGreaterThanOrEqual(100);
			expect(content).toMatch(
				/evidence|checkpoint|expected|observed|runnable|baseline|mismatch/i
			);
		}
	});

	it(
		"keeps generated implementation and studio guidance from reverting to repeated scaffolding",
		async () => {
			const retiredPhrases = [
				"Trace the example in the same vocabulary the project will use later",
				"This keeps the example from becoming a demonstration to copy without understanding",
				"A complete verification pass names the expected result",
				"Useful evidence can be a trace, screenshot, console output",
				"If the evidence does not match the expectation",
				"requirements, evidence, and success criteria are specific enough to review later",
				"protected boundary or failure-mode check is named explicitly",
				"The studio result is visible, runnable, inspectable, or supported by concrete evidence",
				"After the studio works, record one mismatch, limitation, or design choice",
				"Compare the studio against the original goal and record at least one improvement or bug fix",
				"Check the studio against the stated success criteria and note one revision",
				"final the studio",
				"last the studio",
				"latest the studio",
				"small the studio",
				"small the lab",
				"the studio normal behavior",
				"the lab normal behavior",
				"**Result quality:** State the question, input data, calculation or transformation, result, and limitation clearly enough to review without reading every line of code."
			];
			const hits: string[] = [];

			for (const entry of courseCatalog) {
				const course = await loadRawCourse(entry.id);
				const text = allCourseText(course);

				for (const phrase of retiredPhrases) {
					if (text.includes(phrase)) {
						hits.push(`${entry.id}: ${phrase}`);
					}
				}
			}

			expect(hits).toEqual([]);
		},
		COURSE_SWEEP_TIMEOUT
	);

	it("keeps Rust Systems Security labels and safety explanations production-ready", async () => {
		const course = await loadRawCourse("rust-systems-security");
		expect(course).not.toBeNull();

		const source = fs.readFileSync(
			"src/stores/courses/rust-systems-security.ts",
			"utf8"
		);
		const loadedCorpus = allCourseText(course!);

		for (const corpus of [source, loadedCorpus]) {
			expect(corpus).not.toMatch(/\bSupplemental [23]\b/);
			expect(corpus).not.toMatch(/\bThis section covers\b/);
			expect(corpus).not.toMatch(/\bKey idea:/);
			expect(corpus).not.toMatch(/\bshould\b/i);
		}

		expect(loadedCorpus).toContain(
			"Tooling, Cargo, and Why Rust Exists Transfer Practice"
		);
		expect(loadedCorpus).toContain(
			"Capstone: Harden a Legacy Tool Extension Practice"
		);
		expect(loadedCorpus).toContain(
			"Ownership means one clear owner for a resource at a time"
		);
		expect(loadedCorpus).toContain(
			"The key question is which guarantees the compiler stops checking"
		);
	});

	it(
		"replaces generic linked-project boilerplate with concrete project guidance",
		async () => {
			const corpus = await loadedCatalogText();

			expect(corpus).not.toMatch(
				/The project should prove the module concept/i
			);
			expect(corpus).not.toMatch(
				/Read the starter and identify the expected inputs/i
			);
			expect(corpus).not.toMatch(
				/Compare with the reference solution only after a working draft exists/i
			);
			expect(corpus).not.toMatch(/Reference solution link/i);
			expect(corpus).not.toMatch(/Solution-Link/i);
			expect(corpus).not.toMatch(/reference solution/i);
			expect(corpus).not.toMatch(
				/Until this project is split into separate starter and solution folders/i
			);
			expect(corpus).not.toMatch(/no separate solution link/i);
			expect(corpus).not.toMatch(/canonical reference\/source location/i);
			expect(corpus).not.toMatch(/starter[-/ ]and[-/ ]solution/i);
			expect(corpus).not.toMatch(/starter\/solution/i);
			expect(corpus).not.toMatch(/finished solution/i);
			expect(corpus).not.toMatch(/same learning goal/i);
			expect(corpus).not.toMatch(/staff[- ]review/i);
			expect(corpus).not.toMatch(/staff-facing/i);
			expect(corpus).not.toMatch(/source-parity/i);
			expect(corpus).not.toMatch(/remediation list/i);
			expect(corpus).not.toMatch(/course notes show/i);
			expect(corpus).not.toMatch(/where visibility controls support/i);
			expect(corpus).not.toMatch(/\*\*Learning scope:\*\*/i);
			expect(corpus).not.toMatch(/These gaps identify/i);
			expect(corpus).not.toMatch(/\*\*Skills to strengthen:\*\*/i);
			expect(corpus).not.toMatch(/\*\*Materials to prepare:\*\*/i);
			expect(corpus).not.toMatch(/before starting a module/i);
			expect(corpus).not.toMatch(
				/Tooling, Materials, and Source Preparation/i
			);
			expect(corpus).not.toMatch(/Learning Roadmap and Sequencing/i);
			expect(corpus).not.toMatch(/Complete the linked/i);
			expect(corpus).not.toMatch(
				/with visible behavior and verification evidence/i
			);
			expect(corpus).not.toMatch(
				/fork(?:ing)? https:\/\/codepen\.io\/junilearning/i
			);
			expect(corpus).not.toMatch(
				/starter at https:\/\/codepen\.io\/junilearning/i
			);
			expect(corpus).not.toMatch(
				/\b(?:a AI|a Algebra|a object|a array|an Java|an Python|an C\+\+)\b/i
			);
			expect(corpus).not.toMatch(
				/\b(?:Java implementation|type-model task|systems artifact|low-level implementation|Core implementation)\b/i
			);
			expect(corpus).not.toMatch(
				/as (?:an AI\/Python|a Java|the USACO Bronze) implementation checkpoint/i
			);
			expect(corpus).not.toMatch(
				/\b(?:core build checkpoint|applied challenge)\b/i
			);
			expect(corpus).toContain("opening the starter resource");
			expect(corpus).toContain("Open the starter resource");
			expect(corpus).toContain("as an AI/Python project");
			expect(corpus).toContain(
				"Make the Syntax Translation Warmup class exercise easy to verify by stating expected behavior"
			);
			expect(corpus).toContain(
				"Build the web-development extension challenge for **JSM1 Fundamentals Review** as a browser-visible feature with clear state, interaction, and error-handling evidence"
			);
			expect(corpus).toContain(
				"Solve the USACO Bronze project for **USB0 Setup and Contest Workflow** with exact input/output behavior, a traceable invariant, and evidence from sample plus custom cases"
			);
			expect(corpus).toContain(
				"Build **Images and Sprites: Practice Studio** as a working version with runnable behavior, inspectable evidence, and a clear boundary case"
			);
			expect(corpus).not.toMatch(
				/Open the starter and name the concrete inputs, outputs, state changes, data structures, or system boundaries involved/
			);
			expect(corpus).not.toMatch(
				/Implement the missing behavior in small runnable steps, checking the result after each meaningful change/
			);
			expect(corpus).not.toMatch(
				/Test a normal path, a boundary or failure path, and one case tied directly to the module's main concept/
			);
			expect(corpus).not.toMatch(
				/Check the draft against the expected behavior after a working version exists; record one difference that affects correctness, readability, robustness, or design/
			);
			expect(corpus).toMatch(
				/Identify the [^\n.]+ user interaction, state change, DOM\/canvas\/API output, and visible error or empty state/
			);
			expect(corpus).toMatch(
				/For [^\n.]+, translate the prompt into input format, output format, constraints, and invariant/
			);
			expect(corpus).toMatch(
				/For [^\n.]+, state the local scope, target, starting state, allowed tools, and stop condition/
			);
			expect(corpus).toMatch(
				/Once [^\n.]+ page behavior works, compare against the reference and record one difference in UI state, validation, accessibility, or error handling/
			);
			expect(corpus).not.toMatch(
				/After the code compiles and tests run, compare against the reference and record one difference in class responsibility, method contract, state handling, or edge-case coverage/
			);
			expect(corpus).not.toMatch(
				/Use the reference after the program has fresh compile\/run evidence, then record one difference in class responsibility or API shape/
			);
			expect(corpus).toMatch(
				/Use [^.\n]+ reference after fresh compile\/run evidence exists, then record one difference in class responsibility or API shape/
			);
			expect(corpus).not.toMatch(
				/Build the solution around one hand-checkable case, then expand to the sample and one adversarial or boundary input/
			);
			expect(corpus).not.toMatch(
				/Record which constraint, edge case, or ordering detail most influenced the algorithm/
			);
			expect(corpus).not.toMatch(
				/Run the sample, one boundary case, and one duplicate, tie, ordering, or off-by-one case before comparing with the reference/
			);
			expect(corpus).not.toMatch(
				/After the solution samples and custom cases pass, compare against the reference and record one difference in invariant, complexity, or edge-case handling/
			);
			expect(corpus).not.toMatch(
				/\*\*Focus:\*\* Prove the idea before coding by writing a smallest-case trace, then confirm the implementation against sample output and one adversarial boundary case/
			);
			expect(corpus).toMatch(
				/\*\*Focus:\*\* [^.\n]+ proof work starts with a smallest-case trace, then confirms the implementation against sample output and one adversarial boundary case/
			);
			expect(corpus).toMatch(
				/After [^.\n]+ samples and custom cases pass, compare against the reference and record one difference in invariant, complexity, or edge-case handling/
			);
			expect(corpus).not.toContain(
				"After the local lab works, compare against the reference and record one difference in evidence capture, boundary assumptions, defensive control, or rollback path"
			);
			expect(corpus).toMatch(
				/Once [^.\n]+ local lab works, compare against the reference and record one difference in evidence capture, boundary assumptions, defensive control, or rollback path/
			);
			expect(corpus).not.toMatch(
				/The artifact demonstrates the module concept through behavior, output, tests, traces, or another concrete result/
			);
			expect(corpus).not.toMatch(
				/The boundary case is named explicitly and is not only the provided sample/
			);
			expect(corpus).not.toMatch(
				/The final note identifies one implementation, debugging, or reasoning choice that mattered/
			);
			expect(corpus).not.toMatch(
				/Add one additional method, test, or subclass\/record use case while preserving the public behavior already built/
			);
			expect(corpus).not.toMatch(
				/Add a debug or benchmark mode that exposes an internal state, memory decision, or performance tradeoff/
			);
			expect(corpus).not.toMatch(
				/Add one small feature that requires reusing the same concept in a new situation rather than only decorating the output/
			);
			expect(corpus).not.toMatch(
				/Add one variant that changes a constraint without changing the core concept/
			);
			expect(corpus).not.toMatch(
				/Change one constraint, case, representation, or requirement while preserving the same core concept/
			);
			expect(corpus).not.toMatch(
				/Change one value, representation, constraint, or error pattern while preserving the same underlying rule/
			);
			expect(corpus).not.toMatch(
				/Change one rule, control, state transition, collision case, scoring rule, or player-feedback requirement while preserving the same play goal/
			);
			expect(corpus).not.toMatch(
				/Change one environment assumption, command option, configuration, rollback path, or reproducibility check while preserving the same system goal/
			);
			expect(corpus).not.toMatch(
				/The Java code compiles cleanly and the expected behavior is visible through output, tests, or method calls/
			);
			expect(corpus).not.toMatch(
				/The code compiles from a clean run and the expected behavior is visible in output or tests/
			);
			expect(corpus).not.toMatch(
				/Use Java syntax and object boundaries deliberately: method contracts, object state, collection choices, and compile-run feedback should all be visible in the finished artifact/
			);
			expect(corpus).not.toMatch(
				/Sketch the classes, methods, records, interfaces, or collections that own the main responsibilities\./
			);
			expect(corpus).not.toMatch(
				/Define the classes, object state, method inputs, return values, and expected console or test output\./
			);
			expect(corpus).not.toMatch(
				/Key terms, a worked example, and one quick transfer check connect this idea to the module project/
			);
			expect(corpus).not.toMatch(
				/The build should make clear what is being created, what constraints matter, and what evidence will prove the work is correct/
			);
			expect(corpus).not.toMatch(
				/Review the result against the original goal and record at least one improvement or bug fix/
			);
			expect(corpus).not.toMatch(
				/Attempt the prompt independently first, then use the result to identify whether the issue is vocabulary, tracing, syntax, design, or test coverage/
			);
			expect(corpus).not.toMatch(
				/Record the specific misconception, complete one focused remediation problem, and revisit the same skill before moving to a more complex project/
			);
			expect(corpus).not.toMatch(
				/Science explanation: Anchor the activity in scientific explanation: observable phenomena, models, data, vocabulary, and claim-evidence-reasoning/
			);
			expect(corpus).not.toMatch(
				/The explanation names the phenomenon, the model or data source, and the target vocabulary/
			);
			expect(corpus).not.toMatch(
				/The explanation identifies the main function, loop, or data structure that drives the result/
			);
			expect(corpus).not.toMatch(
				/Name the input values, helper functions or loops, data structures, and printed output before coding/
			);
			expect(corpus).not.toMatch(
				/\*\*Path:\*\* the (?:lab|studio) connects the activity goal to a visible artifact, verification evidence, and one limitation/i
			);
			expect(corpus).not.toMatch(
				/\*\*Path:\*\* Review path for the (?:lab|studio): inspect the result, name one limitation or bug risk, and record the next improvement/i
			);
			expect(corpus).not.toMatch(
				/\*\*Path:\*\* (?:Build|Debug|Explanation|Planning|Model|Required build|Transfer|Extension) path for the (?:lab|studio):/i
			);
			expect(corpus).toContain(
				"The program demonstrates the required Java behavior without relying on stale build output or hidden IDE state"
			);
			expect(corpus).toContain(
				"Map the program into Java responsibilities before coding: constructor data, method parameters, return values, stored state, and any collection shape"
			);
			expect(corpus).not.toContain(
				"Map Java/C++ bridge PTJ0 Positioning and Workflow Translation into Java responsibilities before coding"
			);
			expect(corpus).not.toContain(
				"Build a minimal runnable version, then add one Java feature at a time: access control, overload, override, interface, record, or collection behavior."
			);
			expect(corpus).not.toContain(
				"Compile after each constructor, method signature, branch, or collection change so the next error has a narrow cause."
			);
			expect(corpus).not.toContain(
				"Keep one small driver example available while compiling after each state, branch, loop, or dispatch change."
			);
			expect(corpus).not.toContain(
				"Check the expected path, a boundary path, and one case that would expose a vague method contract."
			);
			expect(corpus).not.toContain(
				"Add implementation details in slices that keep errors tied to one field, constructor, method, branch, or list operation."
			);
			expect(corpus).not.toContain(
				"Check a normal run, a boundary run, and one run that tests how Java references or objects behave."
			);
			expect(corpus).not.toContain(
				"Implement the smallest visible slice first, then add validation, layout, or persistence behavior with browser checks."
			);
			expect(corpus).not.toContain(
				"Confirm the result after refresh, at another viewport width, and with one invalid or incomplete interaction."
			);
			expect(corpus).not.toContain(
				"Change one API, allocation, loop, branch, build setting, or diagnostic hook at a time."
			);
			expect(corpus).not.toContain(
				"Finish with a repeatable run plus one trace, warning, sanitizer result, debugger observation, or timing clue."
			);
			expect(corpus).not.toContain(
				"Use short command-line cycles to connect the source change to build output, runtime output, and diagnostic evidence."
			);
			expect(corpus).not.toContain(
				"Record normal behavior, abnormal or boundary behavior, and the low-level clue that explains the difference."
			);
			expect(corpus).not.toContain(
				"Build the core run first, then add one diagnostic, error path, or data-structure detail at a time."
			);
			expect(corpus).not.toContain(
				"Verify the intended behavior plus one boundary case using terminal, debugger, sanitizer, trace, or log evidence."
			);
			expect(corpus).toMatch(
				/Build a minimal runnable version of [^.\n]+, then add the Java feature that matters for this module/
			);
			expect(corpus).toMatch(
				/Compile [^.\n]+ after each constructor, method signature, branch, or collection change/
			);
			expect(corpus).toMatch(
				/Keep a small driver example for [^.\n]+ available while compiling after each state, branch, loop, or dispatch change/
			);
			expect(corpus).toMatch(
				/Change one [^.\n]+ API, allocation, loop, branch, build setting, or diagnostic hook at a time/
			);
			expect(corpus).toMatch(
				/Finish [^.\n]+ with a repeatable run plus one trace, warning, sanitizer result, debugger observation, or timing clue/
			);
			expect(corpus).toMatch(
				/Add [^.\n]+ implementation details in slices that keep errors tied to one field, constructor, method, branch, or list operation/
			);
			expect(corpus).toMatch(
				/Implement the smallest visible [^.\n]+ slice first, then add validation, layout, or persistence behavior with browser checks/
			);
			expect(corpus).toMatch(
				/Recheck [^.\n]+ after refresh, at another viewport width, and with one invalid or incomplete interaction/
			);
			expect(corpus).toMatch(
				/Build the core [^.\n]+ first, then add one diagnostic, error path, or data-structure detail at a time/
			);
			expect(corpus).toContain(
				"The page or app shows the expected state change, output, validation, or canvas behavior"
			);
			expect(corpus).not.toContain(
				"The JSS4 Combining Loops and Variables page or app shows the expected state change"
			);
			expect(corpus).not.toContain(
				"The JSM1 Fundamentals Review page or app shows the expected state change"
			);
			expect(corpus).toContain(
				"matches the required input/output format"
			);
			expect(corpus).toContain(
				"The lab boundary, target behavior, and evidence source are explicit"
			);
			expect(corpus).not.toContain(
				"Extend the Java work with one additional method and a test or console trace that proves its contract"
			);
			expect(corpus).toContain(
				"Verify the Division Facts object-design exercise with one standard case and one boundary case that exposes the key concept"
			);
			expect(corpus).toContain(
				"Complete **Function Signature Transfer Practice** as a Java extension challenge that exposes class responsibilities, public behavior, and one edge case"
			);
			expect(corpus).not.toMatch(/\bSupplemental Practice\s+[2-9]\b/i);
			expect(corpus).not.toMatch(/\bSupplemental\s+[2-9]\b/i);
			expect(corpus).not.toContain(
				"Define the Project: Function Port Pack (PTJ1 Functions, Parameters, and Return Types) hosts, addresses, ports, routes, protocols, and trust boundaries before running diagnostics"
			);
			expect(corpus).toContain(
				"Add one transfer case to the program that changes the input, representation, or success condition"
			);
			expect(corpus).toContain(
				"Add one rule, control, level, reset, or feedback variation while preserving the main play goal"
			);
			expect(corpus).toContain(
				"Change one rule or control in the checkpoint while preserving the same play goal"
			);
			expect(corpus).toMatch(
				/Change one success condition in [^\n.]+ and compare it with the original version/
			);
		},
		COURSE_SWEEP_TIMEOUT
	);

	it(
		"keeps internal implementation-planning scaffolds out of visible course text",
		async () => {
			const corpus = await loadedCatalogText();

			expect(corpus).not.toMatch(/Implementation Studio/i);
			expect(corpus).not.toMatch(/Full Lesson Authoring Pack/i);
			expect(corpus).not.toMatch(
				/Source and Asset Parity Implementation/i
			);
			expect(corpus).not.toMatch(
				/Standards, Source, Assessment, and Safety Backbone/i
			);
			expect(corpus).not.toMatch(/Module Backlog and Sequencing/i);
			expect(corpus).not.toMatch(/Ready-to-Author Checklist/i);
			expect(corpus).not.toMatch(/Planning Project:/i);
			expect(corpus).not.toMatch(/\*\*Course scope:\*\*/i);
			expect(corpus).not.toMatch(
				/defines the target artifact, required behavior, and core concepts needed/i
			);
			expect(corpus).not.toMatch(
				/linked starter provides the implementation artifact/i
			);
			expect(corpus).not.toMatch(/Implementation Lab/i);
			expect(corpus).not.toMatch(/Pattern Applied Lab/i);
			expect(corpus).not.toMatch(/: Applied Lab\b/i);
			expect(corpus).not.toMatch(/\bApplied Lab\b/);
			expect(corpus).not.toMatch(/\bstable course ID\b/i);
			expect(corpus).not.toMatch(/\bscript-only snapshots\b/i);
			expect(corpus).not.toMatch(/\bfuture course updates\b/i);
			expect(corpus).not.toMatch(/\bUnity modules should move\b/i);
			expect(corpus).toContain(
				"A polished Scratch game is more than a set of working controls"
			);
			expect(corpus).toContain("extension challenge");
			expect(corpus).toContain("Standards Map");
		},
		COURSE_SWEEP_TIMEOUT
	);

	it(
		"keeps generated planning and reference material in appendices",
		async () => {
			const generatedReferenceTitlePatterns = [
				/^Standards Map$/,
				/^Course Roadmap$/,
				/^Project Practice Guide$/,
				/^Digital Resource Bank$/,
				/Project Taxonomy and Assessment Implementation$/,
				/^Elementary Science Grade-Band Paths$/,
				/^C\+\+ Levels 1-3 Concept Matrix and Placement$/,
				/^Modern Three-Course C\+\+ Spine$/,
				/^AP CSA Exam Alignment and FRQ Practice Map$/,
				/^Dataset, Model, and Evaluation Catalog$/,
				/Systems and Security Lab Safety Policy$/,
				/Toolchain and Version Assumptions$/,
				/^Standards-Mapped Algebra Architecture$/,
				/^K-2 and 3-5 Online Science Scope Map$/,
				/^Middle School Integrated Science 6-8 Scope Map$/,
				/^Data Science, AI Foundations, and Machine Learning Boundary Map$/,
				/Defensive Lab Contract$/
			];
			const courses = await loadedCatalogCourses();
			const generatedReferenceModules = courses.flatMap(
				({ entry, course }) =>
					(course?.modules ?? [])
						.filter(module =>
							generatedReferenceTitlePatterns.some(pattern =>
								pattern.test(module.title)
							)
						)
						.map(module => ({
							courseId: entry.id,
							kind: module.kind,
							title: module.title
						}))
			);
			const coreGeneratedReferences = generatedReferenceModules.filter(
				module => module.kind !== "appendix"
			);

			expect(generatedReferenceModules.length).toBeGreaterThan(100);
			expect(coreGeneratedReferences).toEqual([]);
		},
		COURSE_SWEEP_TIMEOUT
	);

	it(
		"uses course-family support text instead of the generic fallback",
		async () => {
			const corpus = await loadedCatalogText();

			expect(corpus).not.toMatch(
				/module's core concept, a concrete worked example, and a testable artifact/i
			);
			expect(corpus).not.toMatch(
				/A focused example anchors Java reasoning with values versus references, class responsibilities, interfaces or records when useful, and visible verification/i
			);
			expect(corpus).not.toContain(
				"**Extension:** Add a second metric, comparison, or visualization and explain what it changes."
			);
			expect(corpus).not.toMatch(
				/One worked example and one transfer check show how Java reasoning with values versus references, class responsibilities, interfaces or records when useful/i
			);
			expect(corpus).not.toMatch(
				/The first pass makes the rule or model visible for Java type design with objects, fields, methods, collection choices, public APIs, and compile-run feedback/i
			);
			expect(corpus).not.toContain(
				"An independent attempt comes first; the evidence identifies whether the next step is vocabulary, tracing, syntax, design, or testing support."
			);
			expect(corpus).not.toContain(
				"**Studio focus:** Name the lab minimum working version first, then add extensions only after the required behavior is testable."
			);
			expect(corpus).not.toContain(
				"**Studio focus:** For the lab, name the minimum working version first, then add extensions only after the required behavior is testable."
			);
			expect(corpus).not.toContain(
				"**Studio focus:** Use the lab to connect prerequisite ideas to a concrete result, a testable constraint, and a visible review point."
			);
			expect(corpus).not.toContain(
				"**Studio focus:** The lab connects prerequisite ideas to a concrete result, a testable constraint, and a visible review point."
			);
			expect(corpus).not.toMatch(/the work should be able to describe/i);
			expect(corpus).not.toMatch(
				/turn the prompt into a concrete artifact/i
			);
			expect(corpus).not.toMatch(
				/The core vocabulary, one concrete example/i
			);
			expect(corpus).not.toMatch(/The sequence moves from vocabulary/i);
			expect(corpus).not.toMatch(
				/Restate the prompt as a short checklist/i
			);
			expect(corpus).not.toMatch(
				/Normal, boundary, and awkward cases have been checked/i
			);
			expect(corpus).not.toMatch(
				/Mixing up values, references, and state; using the wrong loop condition/i
			);
			expect(corpus).not.toMatch(/fresh the starting point is/i);
			expect(corpus).not.toMatch(/The sequence begins with/i);
			expect(corpus).not.toMatch(/\band and\b/i);
			expect(corpus).not.toMatch(/\bafter already write\b/i);
			expect(corpus).not.toMatch(/\byounger explain\b/i);
			expect(corpus).not.toMatch(/\bshow the modern correction\b/i);
			expect(corpus).not.toMatch(/\bwhere nothing should happen\b/i);
			expect(corpus).not.toMatch(/\bwhere no change should happen\b/i);
			expect(corpus).not.toMatch(/\bcase where nothing should happen\b/i);
			expect(corpus).not.toMatch(
				/\bcase where no change should happen\b/i
			);
			expect(corpus).not.toMatch(/\bshould show\./i);
			expect(corpus).not.toMatch(
				/\bshould be rejected or handled carefully\b/i
			);
			expect(corpus).not.toMatch(
				/\bshould be small enough to trace by hand\b/i
			);
			expect(corpus).not.toMatch(
				/\bshould measure, predict, classify, search, or compare before implementation begins\b/i
			);
			expect(corpus).not.toMatch(
				/\bshould stay current when the course depends\b/i
			);
			expect(corpus).not.toMatch(
				/\bshould produce one runnable artifact\b/i
			);
			expect(corpus).not.toMatch(
				/\bshould answer a practical engineering question\b/i
			);
			expect(corpus).not.toMatch(/\bshould increase independence\b/i);
			expect(corpus).not.toMatch(/\bMake Scratch game design:/i);
			expect(corpus).not.toMatch(
				/\bStart from a small working case, then add one improvement that still reflects Scratch game design:/i
			);
			expect(corpus).not.toMatch(
				/\bMake one design or reasoning choice explicit, test it, and show its effect in the final artifact\b/i
			);
			expect(corpus).not.toMatch(
				/\bIdentify the input or starting state, the main transformation, and the output or conclusion tied to Scratch game design:/i
			);
			expect(corpus).toContain(
				"an ignored-input case where the state remains unchanged"
			);
			expect(corpus).toContain(
				"one case that leaves the structure unchanged"
			);
			expect(corpus).toContain("**Focus:** Scratch game design:");
			expect(corpus).toContain(
				"Choose one design or reasoning decision in the Level 1 Skills Review Application Check project"
			);
			expect(corpus).not.toMatch(/\bRecovered\b/);
			expect(corpus).not.toMatch(
				/recovered (?:course|lesson|applications|results|examples)/i
			);
			expect(corpus).toContain("rerun cleanly with predictable output");
			expect(corpus).toContain("PyGame development");
			expect(corpus).toContain("Swift app development");
			expect(corpus).toContain("Linux systems practice");
			expect(corpus).toContain("network systems practice");
			expect(corpus).toContain("AP CSA Java reasoning");
			expect(corpus).toContain("competitive-programming discipline");
			expect(corpus).toContain("mathematical reasoning");
			expect(corpus).toContain(
				"connects Java syntax to a concrete responsibility"
			);
			expect(corpus).toContain(
				"traces the Java idea from data shape to public behavior"
			);
			expect(corpus).toMatch(
				/\*\*Extension:\*\* Add a second (?:[^.\n]+ )?metric, comparison, or visualization[^.\n]*and explain what it changes/
			);
			expect(corpus).toMatch(
				/the evidence identifies whether the next step is vocabulary, representation choice, algebraic procedure, graph or table reading, or reasonableness/i
			);
			expect(corpus).toMatch(
				/\*\*Studio focus:\*\* For (?!the lab\b)[^.\n]+, name the minimum working version first, then add extensions only after the required behavior is testable/
			);
			expect(corpus).toMatch(
				/\*\*Studio focus:\*\* (?!The lab\b)[^.\n]+ connects prerequisite ideas to a concrete result, a testable constraint, and a visible review point/
			);
		},
		COURSE_SWEEP_TIMEOUT
	);

	it("keeps expanded physics and Scratch modules specific instead of duplicated filler", async () => {
		const courseIds = [
			"intro-to-physics",
			"physics-level-2",
			"scratch-level-1",
			"scratch-level-2"
		];
		const courses = await Promise.all(
			courseIds.map(id => loadRawCourse(id))
		);

		for (const [index, course] of courses.entries()) {
			expect(course, courseIds[index]).not.toBeNull();
			if (!course) continue;

			const moduleTitles = course.modules.map(module => module.title);
			expect(new Set(moduleTitles).size, courseIds[index]).toBe(
				moduleTitles.length
			);
			expect(allCourseText(course), courseIds[index]).not.toMatch(
				/This lab states the target artifact|A representative .* example names the key inputs|Create an original variation inspired by .*Implementation Lab/i
			);
		}
	});

	it("keeps Scratch support text focused on playable projects instead of generic file or lab wording", async () => {
		const courses = await Promise.all([
			loadRawCourse("scratch-level-1"),
			loadRawCourse("scratch-level-2")
		]);
		const corpus = courses.map(allCourseText).join("\n");
		const legacyScratchFocusCount =
			corpus.match(
				/\*\*Focus:\*\* Scratch game design: sprites, event blocks, broadcasts, variables, costumes or backdrops, loops, and playable feedback\./g
			)?.length ?? 0;

		expect(corpus).toContain("Scratch game design");
		expect(corpus).toContain("green-flag setup");
		expect(corpus).toContain("player actions");
		expect(corpus).toContain("sprite responsibilities");
		expect(corpus).toContain("green-flag state");
		expect(corpus).toContain("event or state logic");
		expect(legacyScratchFocusCount).toBeLessThan(25);
		expect(corpus).not.toMatch(
			/module's core concept, a concrete worked example, and a testable artifact/i
		);
		expect(corpus).not.toMatch(/expected file format/i);
		expect(corpus).not.toMatch(/malformed or missing data/i);
	});

	it("does not treat console input/output lessons as file parsing work", async () => {
		const courses = await Promise.all([
			loadRawCourse("java-level-1"),
			loadRawCourse("ap-computer-science-a"),
			loadRawCourse("c-level-1")
		]);
		const corpus = courses.map(allCourseText).join("\n");

		expect(corpus).toContain("values are typed by the user");
		expect(corpus).not.toMatch(
			/Variables(?:, Types, Strings, and Input\/Output| and Input\/Output)[\s\S]{0,2500}expected file format/i
		);
		expect(corpus).not.toMatch(
			/APCS1 Variables and Input\/Output[\s\S]{0,2500}expected file format/i
		);
	});

	it("does not treat multi-file source organization as data-file parsing", async () => {
		const course = await loadRawCourse("c-level-1");
		expect(course).not.toBeNull();

		const item = findItem(course!, /Multi-File Class Implementation/);
		expect(item.content).toContain("declarations belong in headers");
		expect(item.content).toContain("linker behavior");
		expect(item.content).not.toMatch(/expected file format/i);
	});

	it("guards against raw generated grammar artifacts in course sources", () => {
		const sourcePaths = [
			"src/stores/courses/cpp-level-2.ts",
			"src/stores/courses/java-level-1.ts",
			"src/stores/courses/course-implementation-artifacts.ts",
			"src/stores/courses/java-level-3.ts",
			"src/stores/courses/machine-learning.ts",
			"src/stores/courses/public-pathways.ts",
			"src/stores/courses/design-patterns-in-java.ts",
			"src/stores/courses/design-patterns-in-cpp.ts",
			"src/stores/courses/low-level-security-part-2.ts"
		];
		const corpus = sourcePaths
			.map(path => fs.readFileSync(path, "utf8"))
			.join("\n");

		expect(corpus).not.toMatch(/Repo Extension,\s*,/);
		expect(corpus).not.toMatch(/Before any model is trained, Inspect/);
		expect(corpus).not.toMatch(/Trace before running and to identify/);
		expect(corpus).not.toMatch(/and Classify them/);
		expect(corpus).not.toMatch(/C\+\+ Learn/);
		expect(corpus).not.toMatch(/In C\+\+, Explicitly/);
		expect(corpus).not.toMatch(/Visible pattern: This as/);
		expect(corpus).not.toMatch(/Teach patterns through small before/);
		expect(corpus).not.toMatch(/Teach accuracy, precision, recall/);
		expect(corpus).not.toMatch(
			/Students arriving from the Python sequence/
		);
		expect(corpus).not.toMatch(/show the modern correction/);
		expect(corpus).not.toMatch(/younger learners can explain/);
	});

	it("keeps C++ and design-pattern course source copy course-facing", () => {
		const sourcePaths = [
			"src/stores/courses/cpp-level-1.ts",
			"src/stores/courses/cpp-level-2.ts",
			"src/stores/courses/design-patterns-in-java.ts",
			"src/stores/courses/design-patterns-in-cpp.ts"
		];
		const corpus = sourcePaths
			.map(path => fs.readFileSync(path, "utf8"))
			.join("\n");

		expect(corpus).not.toMatch(/\bTeach\b/);
		expect(corpus).not.toMatch(/\bstudents?\b/i);
	});

	it("keeps visible course source copy free of instructor-action artifacts", () => {
		const corpus = visibleCourseSourceCorpus();

		expect(corpus).not.toMatch(/\bshould\b/i);
		expect(corpus).not.toMatch(/\bTeach\b/);
		expect(corpus).not.toMatch(/\bRequire\b/);
		expect(corpus).not.toMatch(/\bEncourage\b/);
		expect(corpus).not.toMatch(/This section covers students/);
		expect(corpus).not.toMatch(/\bUnderstand why/);
		expect(corpus).not.toMatch(
			/for strengthen the existing javascript courses/i
		);
		expect(corpus).not.toMatch(/for good practical projects/i);
		expect(corpus).not.toMatch(/for suggested advanced strand/i);
		expect(corpus).not.toMatch(/for integration with network topics/i);
		expect(corpus).not.toMatch(/\band pair them\b/);
		expect(corpus).not.toMatch(/\bthen connect that difference\b/);
		expect(corpus).not.toMatch(/\bthen show how\b/);
		expect(corpus).not.toMatch(/\bso students\b/i);
		expect(corpus).not.toMatch(/\bstudents can compare\b/i);
		expect(corpus).not.toMatch(/\bstudents can see\b/i);
		expect(corpus).not.toMatch(/\bstudents stop\b/i);
		expect(corpus).not.toMatch(/\bstudents learn\b/i);
		expect(corpus).not.toMatch(/\bstudents start\b/i);
		expect(corpus).not.toMatch(/\bforcing students\b/i);
		expect(corpus).not.toMatch(/Visible pattern: That/);
		expect(corpus).not.toMatch(
			/title:\s*"(?:Course Setup|Lesson|Concept Lesson|Data Mini Lesson):/i
		);
		expect(corpus).not.toMatch(/Use this as a dialogue-based checkpoint/i);
		expect(corpus).not.toMatch(/Pause whenever the student/i);
		expect(corpus).not.toMatch(
			/If (?:a|the) student (?:gets stuck|stalls)/i
		);
		expect(corpus).not.toMatch(/\bwhile the student (?:explains|talks)\b/i);
		expect(corpus).not.toMatch(
			/\bstudents (?:trace|identify|distinguish|draw|describe|choose|see)\b/i
		);
		expect(corpus).not.toMatch(/\bLet students\b/i);
		expect(corpus).not.toMatch(/\bwith your instructor\b/i);
		expect(corpus).not.toMatch(
			/Use the linked starter as a starting point/i
		);
		expect(corpus).not.toMatch(
			/same core idea with a different input, constraint, or edge case/i
		);
		expect(corpus).not.toMatch(/\*\*Use this section:\*\*/i);
		expect(corpus).not.toMatch(/\bComplete an extension project:/i);
		expect(corpus).not.toMatch(/\bThe finished project should\b/i);
		expect(corpus).not.toMatch(
			/\bThis module focuses on (?:turning|using|diagnosing|connecting|combining|organizing|mapping)\b/i
		);
		expect(corpus).not.toMatch(/\bThe work should make\b/i);
		expect(corpus).not.toMatch(/\bThe work should feel\b/i);
		expect(corpus).not.toMatch(/\bfirst (?:session|lesson)\b/i);
		expect(corpus).not.toMatch(/\bfinal-session surprise\b/i);
		expect(corpus).not.toMatch(/\bSession Workflow\b/i);
		expect(corpus).not.toMatch(/\bwhiteboard\b/i);
		expect(corpus).not.toMatch(/content:\s*""/);
	});

	it("keeps raw course copy neutral instead of audience-directed", () => {
		const corpus = rawCourseSourceCorpus();

		expect(corpus).not.toMatch(
			/\b(?:Ask|Have|Tell|Show|Teach|Train|Encourage|Remind|Make sure|Walk|Guide) (?:the )?(?:student|students|learner|learners)\b/i
		);
		expect(corpus).not.toMatch(
			/\bso (?:the )?(?:student|students|learner|learners)\b/i
		);
		expect(corpus).not.toMatch(
			/\b(?:student|students|learner|learners) (?:can|should|will|need|needs|must|learn|start|stop|understand|already|headed)\b/i
		);
		expect(corpus).not.toMatch(
			/\b(?:for|when|once|before) (?:the )?(?:student|students|learner|learners)\b/i
		);
		expect(corpus).not.toMatch(
			/\b(?:This (?:gives|teaches)|should force|force|train) students\b/i
		);
		expect(corpus).not.toMatch(
			/\bstudents (?:who|now|benefit|track|decide|optimize|move|reach|justify|encounter|use|begin)\b/i
		);
		expect(corpus).not.toMatch(/\bConnect with the learner\b/i);
		expect(corpus).not.toMatch(/(?:^|["'`]\s*)Not treat\b/im);
	});

	it("keeps raw display copy free of legacy platform-branded names", () => {
		const corpus = stripLinksFromSource(visibleCourseSourceCorpus());

		expect(corpus).not.toMatch(/\bJuni\b/i);
		expect(corpus).not.toMatch(/\bJunian\b/i);
		expect(corpus).not.toMatch(/single-folder Juni layout/i);
	});

	it("keeps JavaScript course project copy labeled as web development", () => {
		const corpus = [
			"src/stores/courses/javascript-level-1.ts",
			"src/stores/courses/javascript-level-2.ts"
		]
			.map(path => fs.readFileSync(path, "utf8"))
			.join("\n");

		expect(corpus).not.toMatch(/linked Java (?:core|transfer)/i);
		expect(corpus).not.toMatch(/courseFamily: "Java"/i);
		expect(corpus).not.toMatch(/Debugging Math Homework/i);
		expect(corpus).not.toMatch(/math-homework/i);
		expect(corpus).not.toMatch(/homework and chores/i);
		expect(corpus).toContain('courseFamily: "web development"');
	});

	it("keeps generated project guidance labels aligned to course families", () => {
		const courseFamilies = new Map([
			["src/stores/courses/ai-level-1.ts", "AI/Python"],
			["src/stores/courses/c-systems-engineering.ts", "C systems"],
			[
				"src/stores/courses/data-science-in-python.ts",
				"data science in Python"
			],
			["src/stores/courses/machine-learning.ts", "machine learning"],
			["src/stores/courses/network-security.ts", "network security"],
			["src/stores/courses/pygames.ts", "Python/PyGame"],
			[
				"src/stores/courses/python-to-java-and-cpp-bridge.ts",
				"Java/C++ bridge"
			],
			["src/stores/courses/usaco-bronze.ts", "USACO"],
			["src/stores/courses/usaco-silver.ts", "USACO Silver"],
			["src/stores/courses/usaco-gold.ts", "USACO Gold"]
		]);

		for (const [path, family] of courseFamilies) {
			const source = fs.readFileSync(path, "utf8");
			expect(source, path).toContain(`courseFamily: "${family}"`);
		}

		for (const path of [
			"src/stores/courses/usaco-bronze.ts",
			"src/stores/courses/usaco-silver.ts",
			"src/stores/courses/usaco-gold.ts"
		]) {
			const source = fs.readFileSync(path, "utf8");
			expect(source, path).not.toContain('courseFamily: "C++"');
		}

		expect(
			fs.readFileSync(
				"src/stores/courses/c-systems-engineering.ts",
				"utf8"
			)
		).not.toContain('courseFamily: "implementation"');
	});

	it("keeps C Systems lessons explanatory instead of scaffold-labeled", async () => {
		const course = await loadRawCourse("c-systems-engineering");
		const corpus = allCourseText(course);
		const source = fs.readFileSync(
			"src/stores/courses/c-systems-engineering.ts",
			"utf8"
		);

		expect(corpus).toContain(
			"C becomes useful for systems work once the source-file, object-file, and linked-program path is clear."
		);
		expect(corpus).toContain(
			"Bitwise operators are data-shaping tools, not abstract truth tables alone."
		);
		expect(corpus).toContain(
			"Heap allocation calls are explicit ownership decisions instead of generic ways to 'make more memory.'"
		);
		expect(corpus).toContain(
			"C Systems Engineering Setup Transfer Practice"
		);
		expect(corpus).toContain("Representation Transfer Practice");
		expect(corpus).toContain("Dispatch Extension Practice");
		expect(corpus).toContain("Systems Build 14: Byte Inspector Studio");
		expect(corpus).toContain("Systems Build 17: Capstone Utility Studio");
		expect(corpus).toContain("Capstone Utility Studio Extension Practice");
		expect(source).not.toMatch(/This section covers/i);
		expect(source).not.toMatch(/Key idea:/i);
		expect(source).not.toMatch(/Skill target:/i);
		expect(source).not.toMatch(/The goal is to/i);
		expect(source).not.toMatch(/This project should/i);
		expect(corpus).not.toMatch(/\bshould\b/i);
		expect(source).not.toMatch(/\bsupplemental [23]\b/i);
		expect(corpus).not.toMatch(/\bsupplemental [23]\b/i);
		expect(corpus).not.toMatch(/\bImplementation Lab\b/i);
	});

	it("keeps AI Level 1 lessons explanatory instead of scaffold-labeled", async () => {
		const course = await loadRawCourse("ai-level-1");
		const corpus = allCourseText(course);
		const source = fs.readFileSync(
			"src/stores/courses/ai-level-1.ts",
			"utf8"
		);

		expect(corpus).toContain(
			"AI is a family of approaches: rules, search, planning, heuristics, machine learning, and modern generative systems."
		);
		expect(corpus).toContain(
			"DFS is a systematic way to explore one branch fully, record visited nodes, and backtrack cleanly."
		);
		expect(corpus).toContain(
			"Heuristic evaluation is a practical compromise when exhaustive search is too expensive."
		);
		expect(source).not.toMatch(/This section covers/i);
		expect(source).not.toMatch(/Key idea:/i);
		expect(source).not.toMatch(/Skill target:/i);
		expect(source).not.toMatch(/Visible pattern:/i);
		expect(source).not.toMatch(/Practice target:/i);
		expect(source).not.toMatch(/The goal is to/i);
		expect(source).not.toMatch(/\bImplementation Lab\b/i);
		expect(source).not.toMatch(/\bsupplemental [23]\b/i);
		expect(corpus).not.toMatch(/\bImplementation Lab\b/i);
		expect(corpus).not.toMatch(/\bsupplemental [23]\b/i);
		expect(corpus).toContain("AI Search Lab 13: Practice Studio");
		expect(corpus).toContain("Extension Practice: AI Search Lab 17");
		expect(corpus).toContain("Transfer Practice: The Marble Game AI");
	});

	it("keeps Data Science lessons explanatory instead of scaffold-labeled", async () => {
		const course = await loadRawCourse("data-science-in-python");
		const corpus = allCourseText(course);
		const source = fs.readFileSync(
			"src/stores/courses/data-science-in-python.ts",
			"utf8"
		);

		expect(corpus).toContain(
			"Strong data science can provide real value before training any model."
		);
		expect(corpus).toContain(
			"Notebooks are communication tools, not just places to run code."
		);
		expect(corpus).toContain(
			"Dashboard design needs restraint: clear controls, few charts, obvious labels, and a visible explanation of what the user is seeing."
		);
		expect(corpus).toContain(
			"The log turns the capstone into an evidence-backed argument rather than a collection of outputs."
		);
		expect(source).not.toMatch(/This section covers/i);
		expect(source).not.toMatch(/Key idea:/i);
		expect(source).not.toMatch(/Skill target:/i);
		expect(source).not.toMatch(/Practice target:/i);
		expect(source).not.toMatch(/The goal is to/i);
	});

	it("keeps USACO setup problem cards distinct from setup workflow prompts", async () => {
		const setupModules = [
			{
				courseId: "usaco-bronze",
				moduleTitle: "USB0 Setup and Contest Workflow",
				items: [
					{
						title: "Core Project: Setup and Contest Workflow",
						subject: "USB0 Setup and Contest Workflow"
					},
					{
						title: "UB 23 Why Did the Cow Cross the Road II Java",
						subject: "UB 23 Why Did the Cow Cross the Road II Java"
					},
					{
						title: "UB 24 Why Did the Cow Cross the Road III Java",
						subject: "UB 24 Why Did the Cow Cross the Road III Java"
					}
				]
			},
			{
				courseId: "usaco-silver",
				moduleTitle: "USS0 Setup and Silver Transition",
				items: [
					{
						title: "Core Project: Setup and Silver Transition",
						subject: "USS0 Setup and Silver Transition"
					},
					{
						title: "Why Did the Cow Cross the Road III",
						subject: "Why Did the Cow Cross the Road III"
					},
					{
						title: "Paired Up",
						subject: "Paired Up"
					}
				]
			},
			{
				courseId: "usaco-gold",
				moduleTitle: "USG0 Setup, Contest Contract, and Gold Mindset",
				items: [
					{
						title: "Core Project: Setup and Gold Mindset",
						subject: "USG0 Setup and Gold Mindset"
					},
					{
						title: "Why Did the Cow Cross the Road III",
						subject: "Why Did the Cow Cross the Road III"
					},
					{
						title: "Snow Boots",
						subject: "Snow Boots"
					}
				]
			}
		];

		for (const setupModule of setupModules) {
			const course = await loadRawCourse(setupModule.courseId);
			expect(course, setupModule.courseId).not.toBeNull();
			if (!course) continue;

			const module = course.modules.find(
				module => module.title === setupModule.moduleTitle
			);
			expect(module, setupModule.moduleTitle).toBeTruthy();
			if (!module) continue;

			const moduleItems = [
				...module.curriculum,
				...module.supplementalProjects
			];
			const contents = setupModule.items.map(({ title, subject }) => {
				const item = moduleItems.find(item => item.title === title);
				expect(item, `${setupModule.courseId}: ${title}`).toBeTruthy();
				expect(
					item?.content,
					`${setupModule.courseId}: ${title}`
				).toContain(`**${subject}**`);

				return item?.content ?? "";
			});

			expect(
				new Set(contents),
				`${setupModule.courseId} setup project prompts`
			).toHaveProperty("size", contents.length);
		}
	});

	it("keeps generated USACO project prompts unique across tiers and problem cards", async () => {
		const generatedPrompts = new Map<string, string[]>();

		for (const courseId of ["usaco-bronze", "usaco-silver", "usaco-gold"]) {
			const course = await loadRawCourse(courseId);
			expect(course, courseId).not.toBeNull();
			if (!course) continue;

			for (const module of course.modules) {
				for (const item of [
					...module.curriculum,
					...module.supplementalProjects
				]) {
					const content = item.content.replace(/\s+/g, " ").trim();
					if (!content.startsWith("**Goal:**")) continue;

					const entries = generatedPrompts.get(content) ?? [];
					entries.push(
						`${courseId} > ${module.title} > ${item.title}`
					);
					generatedPrompts.set(content, entries);
				}
			}
		}

		const duplicateGroups = [...generatedPrompts.values()].filter(
			entries => entries.length > 1
		);

		expect(duplicateGroups).toEqual([]);
	});

	it("keeps USACO practice blocks contest-specific instead of scaffold-labeled", async () => {
		const courses = await Promise.all([
			loadRawCourse("usaco-bronze"),
			loadRawCourse("usaco-silver"),
			loadRawCourse("usaco-gold")
		]);
		const corpus = courses.map(allCourseText).join("\n");

		for (const course of courses) {
			expect(course).not.toBeNull();
		}

		expect(corpus).not.toMatch(/Implementation Lab/i);
		expect(corpus).not.toMatch(/\bSupplemental [23]\b/i);
		expect(corpus).not.toMatch(/This section covers/i);
		expect(corpus).not.toMatch(/Key idea:/i);
		expect(corpus).not.toMatch(/Skill target:/i);
		expect(corpus).not.toMatch(/Practice target:/i);
		expect(corpus).not.toMatch(/Target skill:/i);
		expect(corpus).not.toMatch(/Practice focus:/i);
		expect(corpus).not.toMatch(/The goal is to/i);
		expect(corpus).toContain("UB 12 Barn Repair Java: Practice Studio");
		expect(corpus).toContain("US Berry Picking: Practice Studio");
		expect(corpus).toContain(
			"Dynamic Programming Practice: Practice Studio"
		);
		expect(corpus).toContain("Hamming Codes Transfer Practice");
		expect(corpus).toContain("MST II Extension Practice");
	});

	it("keeps C++ placement appendices level-specific across Levels 1-3", async () => {
		const courseIds = ["c-level-1", "cpp-level-2", "cpp-level-3"] as const;
		const courseLevels: Record<(typeof courseIds)[number], string> = {
			"c-level-1": "Level 1",
			"cpp-level-2": "Level 2",
			"cpp-level-3": "Level 3"
		};
		const appendixTitles = [
			"C++ Levels 1-3 Concept Matrix and Placement",
			"Modern Three-Course C++ Spine"
		];
		const courses = await Promise.all(
			courseIds.map(async courseId => ({
				courseId,
				course: await loadRawCourse(courseId)
			}))
		);
		const duplicateSummaries: string[] = [];

		for (const { courseId, course } of courses) {
			expect(course, courseId).not.toBeNull();
			if (!course) continue;

			const text = allCourseText(course);
			const level = courseLevels[courseId];
			expect(text, courseId).toContain(`${level} uses this as`);
			expect(text, courseId).toContain(`For ${level}`);
		}

		for (const appendixTitle of appendixTitles) {
			const itemContentByTitle = new Map<string, string[]>();

			for (const { courseId, course } of courses) {
				if (!course) continue;

				const module = course.modules.find(
					module => module.title === appendixTitle
				);
				expect(module, `${courseId}: ${appendixTitle}`).toBeTruthy();
				if (!module) continue;

				for (const item of [
					...module.curriculum,
					...module.supplementalProjects
				]) {
					const contents = itemContentByTitle.get(item.title) ?? [];
					contents.push(item.content.replace(/\s+/g, " ").trim());
					itemContentByTitle.set(item.title, contents);
				}
			}

			for (const [itemTitle, contents] of itemContentByTitle) {
				expect(contents, `${appendixTitle}: ${itemTitle}`).toHaveLength(
					courseIds.length
				);

				if (new Set(contents).size !== contents.length) {
					duplicateSummaries.push(`${appendixTitle}: ${itemTitle}`);
				}
			}
		}

		expect(duplicateSummaries).toEqual([]);
	});

	it("keeps data science, AI, and ML appendices course-specific", async () => {
		const courseIds = [
			"data-science-in-python",
			"ai-level-1",
			"machine-learning"
		] as const;
		const courseLabels: Record<(typeof courseIds)[number], string> = {
			"data-science-in-python": "Data Science",
			"ai-level-1": "AI Foundations",
			"machine-learning": "Machine Learning"
		};
		const appendixTitles = [
			"Dataset, Model, and Evaluation Catalog",
			"Data Science, AI Foundations, and Machine Learning Boundary Map"
		];
		const courses = await Promise.all(
			courseIds.map(async courseId => ({
				courseId,
				course: await loadRawCourse(courseId)
			}))
		);
		const duplicateSummaries: string[] = [];

		for (const { courseId, course } of courses) {
			expect(course, courseId).not.toBeNull();
			if (!course) continue;

			const label = courseLabels[courseId];
			const text = allCourseText(course);
			expect(text, courseId).toContain(`${label} uses`);
			expect(text, courseId).toContain(`For ${label}`);
		}

		for (const appendixTitle of appendixTitles) {
			const itemContentByTitle = new Map<string, string[]>();

			for (const { courseId, course } of courses) {
				if (!course) continue;

				const module = course.modules.find(
					module => module.title === appendixTitle
				);
				expect(module, `${courseId}: ${appendixTitle}`).toBeTruthy();
				if (!module) continue;

				for (const item of [
					...module.curriculum,
					...module.supplementalProjects
				]) {
					const contents = itemContentByTitle.get(item.title) ?? [];
					contents.push(item.content.replace(/\s+/g, " ").trim());
					itemContentByTitle.set(item.title, contents);
				}
			}

			for (const [itemTitle, contents] of itemContentByTitle) {
				expect(contents, `${appendixTitle}: ${itemTitle}`).toHaveLength(
					courseIds.length
				);

				if (new Set(contents).size !== contents.length) {
					duplicateSummaries.push(`${appendixTitle}: ${itemTitle}`);
				}
			}
		}

		expect(duplicateSummaries).toEqual([]);
	});

	it(
		"keeps generated transfer and extension project cards distinct inside each module",
		async () => {
			const duplicateGroups: string[] = [];
			const courses = await loadedCatalogCourses();

			for (const { entry, course } of courses) {
				if (!course) continue;

				for (const module of course.modules) {
					const contentGroups = new Map<string, string[]>();

					for (const item of [
						...module.curriculum,
						...module.supplementalProjects
					]) {
						if (
							!item.projectLink ||
							!/^\*\*(?:Goal|Project goal):\*\*/i.test(
								item.content
							)
						) {
							continue;
						}

						const normalizedContent = item.content
							.replace(/\s+/g, " ")
							.trim();
						const titles =
							contentGroups.get(normalizedContent) ?? [];
						titles.push(item.title);
						contentGroups.set(normalizedContent, titles);
					}

					for (const titles of contentGroups.values()) {
						if (titles.length < 2) continue;

						duplicateGroups.push(
							`${entry.id} > ${module.title} > ${titles.join(" | ")}`
						);
					}
				}
			}

			expect(duplicateGroups).toEqual([]);
		},
		COURSE_SWEEP_TIMEOUT
	);

	it(
		"keeps exact long-form content unique across catalog courses",
		async () => {
			const contentGroups = new Map<string, string[]>();
			const duplicateGroups: string[] = [];
			const courses = await loadedCatalogCourses();

			for (const { entry, course } of courses) {
				if (!course) continue;

				for (const module of course.modules) {
					for (const item of [
						...module.curriculum,
						...module.supplementalProjects
					]) {
						const normalizedContent = item.content
							.replace(/\s+/g, " ")
							.trim();
						if (normalizedContent.length < 280) continue;

						const labels =
							contentGroups.get(normalizedContent) ?? [];
						labels.push(
							`${entry.id} > ${module.title} > ${item.title}`
						);
						contentGroups.set(normalizedContent, labels);
					}
				}
			}

			for (const labels of contentGroups.values()) {
				if (labels.length < 2) continue;

				duplicateGroups.push(labels.join(" || "));
			}

			expect(duplicateGroups).toEqual([]);
		},
		COURSE_SWEEP_TIMEOUT
	);

	it("keeps older JavaScript and Python project prompts from collapsing to one-line tasks", async () => {
		const courses = await Promise.all([
			loadRawCourse("javascript-level-1-javascript-superstar"),
			loadRawCourse("javascript-level-2-javascript-master"),
			loadRawCourse("python-level-1")
		]);
		const corpus = courses.map(allCourseText).join("\n");

		expect(corpus).not.toMatch(/Fix code solving a math problem\./);
		expect(corpus).not.toMatch(/Fix a simulated race that uses loops\./);
		expect(corpus).not.toMatch(/Fix code simulating a football drive\./);
		expect(corpus).not.toMatch(/Use a switch to map animals to sounds\./);
		expect(corpus).not.toMatch(/Fix code so a star appears on a snowman\./);
		expect(corpus).not.toMatch(
			/Fix output order of a stacked shield pattern\./
		);
		expect(corpus).not.toMatch(
			/Draw a car with D3 using rectangles and circles\./
		);
		expect(corpus).not.toMatch(/Build a chessboard with CSS Grid\./);
		expect(corpus).not.toMatch(
			/Complete SQLBolt lessons 1(?:-|–)4 on SELECT queries\./
		);
		expect(corpus).not.toMatch(
			/Complete SQLBolt lessons 6(?:-|–)7 on JOINs\./
		);
		expect(corpus).not.toMatch(
			/Complete SQLBolt lessons 8(?:-|–)12 \(nulls and more\)\./
		);
		expect(corpus).not.toMatch(
			/Complete SQLBolt lessons 13(?:-|–)18 on inserting and altering tables\./
		);
		expect(corpus).not.toMatch(
			/Draw a growing sequence of rotated squares\./
		);
		expect(corpus).not.toMatch(
			/Draw a staircase pattern that spirals outward\./
		);
		expect(corpus).toContain("query examples");
		expect(corpus).toContain("loop that changes size and rotation");
	});

	it("keeps Java Level 3 review modules substantive instead of one-line prompts", async () => {
		const course = await loadRawCourse("java-level-3");
		expect(course).not.toBeNull();
		const corpus = allCourseText(course);

		expect(corpus).not.toMatch(
			/Ask the user for several words, store them in descriptive variables/i
		);
		expect(corpus).not.toMatch(/Use this module as a review resource/i);
		expect(corpus).not.toMatch(
			/Learn how linear search checks items one by one/i
		);
		expect(corpus).not.toMatch(
			/Create a simple chatbot that asks several questions/i
		);
		expect(corpus).not.toMatch(/\bsupplemental [23]\b/i);
		expect(corpus).not.toMatch(/\bSkill target:/i);
		expect(corpus).toContain(
			"Java programs move through a source-edit, compile, run, and observe cycle"
		);
		expect(corpus).toContain("Java Syntax Transfer Practice");
		expect(corpus).toContain("Object Model Transfer Practice");
		expect(corpus).toContain("Recursive Trace Transfer Practice");
		expect(corpus).toContain("Search Runtime Transfer Practice");
		expect(corpus).toContain("Binary Search Edge-Case Practice");
		expect(corpus).toContain("Arrays are fixed-size ordered collections");
		expect(corpus).toContain(
			"Object-oriented Java is clearest when each class owns one coherent responsibility"
		);
		expect(corpus).toContain(
			"Recursive methods solve a problem by calling themselves on a smaller version of the same problem"
		);
		expect(corpus).toContain("Binary search relies on sorted data");
	});

	it("keeps Java Level 3 starter and solution links separate for generics projects", async () => {
		const course = await loadRawCourse("java-level-3");
		expect(course).not.toBeNull();

		const anythingArray = findItem(
			course!,
			/^AJ10 Project 2: Anything Array$/
		);

		expect(anythingArray.projectLink).toBe(
			"https://github.com/instruction-material/Java-Level-3/tree/main/AJ10-Node-Class"
		);
		expect(anythingArray.solutionLink).toBe(
			"https://github.com/instruction-material/Java-Level-3/tree/main/AJ10-Anything-Array"
		);
		expect(anythingArray.projectLink).not.toBe(anythingArray.solutionLink);
	});

	it("keeps Java Level 3 sorting modules substantive instead of one-line prompts", async () => {
		const course = await loadRawCourse("java-level-3");
		expect(course).not.toBeNull();
		const corpus = allCourseText(course);

		expect(corpus).not.toMatch(
			/Learn how selection sort repeatedly finds the smallest remaining element/i
		);
		expect(corpus).not.toMatch(
			/Implement selection sort using two `ArrayList`s/i
		);
		expect(corpus).not.toMatch(
			/Learn how bubble sort repeatedly swaps adjacent values/i
		);
		expect(corpus).not.toMatch(
			/Implement the helper method that merges two sorted lists/i
		);
		expect(corpus).not.toMatch(
			/Describe selection sort, predict the state of an array/i
		);
		expect(corpus).toContain(
			"Selection sort divides a collection into a sorted prefix and an unsorted remainder"
		);
		expect(corpus).toContain(
			"Bubble sort repeatedly compares adjacent values and swaps them when they are out of order"
		);
		expect(corpus).toContain(
			"Merge sort is a divide-and-conquer algorithm"
		);
		expect(corpus).toContain(
			"This review compares selection sort, insertion sort, bubble sort, and merge sort"
		);
		expect(corpus).toContain("Elementary Sorting Transfer Practice");
		expect(corpus).toContain("Bubble Sort Optimization Practice");
		expect(corpus).toContain("Merge Sort Trace Practice");
	});

	it("keeps Java Level 3 advanced track source free of planning shorthand", async () => {
		const course = await loadRawCourse("java-level-3");
		expect(course).not.toBeNull();
		const corpus = allCourseText(course);
		const source = fs.readFileSync(
			"src/stores/courses/java-level-3.ts",
			"utf8"
		);
		const advancedTrackSource = source.slice(
			source.indexOf(
				'title: "AJ19 Post-C++ Java Tooling, Testing, and Packages"'
			)
		);

		expect(advancedTrackSource).not.toMatch(/\bCover:/);
		expect(advancedTrackSource).not.toMatch(
			/Start with a small buggy service/i
		);
		expect(source).not.toMatch(/\bshould\b/i);
		expect(corpus).toContain(
			"Package-organized Java projects separate source roots, package names, public APIs, helper classes, build commands, and test entry points"
		);
		expect(corpus).toContain(
			"Generics are API contracts for reusable, type-safe code"
		);
		expect(corpus).toContain(
			"Java concurrency begins with bounded task execution rather than raw thread chaos"
		);
		expect(corpus).toContain("Refactoring Transfer Practice");
		expect(corpus).toContain("Priority Queue Transfer Practice");
		expect(corpus).toContain("Graph Modeling Extension Practice");
		expect(corpus).toContain("Google Maps Extension Practice");
	});

	it("keeps early Python Turtle prompts structured around planning and verification", async () => {
		const course = await loadRawCourse("python-level-1");
		expect(course).not.toBeNull();
		const source = fs.readFileSync(
			"src/stores/courses/python-level-1.ts",
			"utf8"
		);
		expect(source).not.toMatch(/\bshould\b/i);

		const checks = [
			{
				title: /^GrS1 Supplemental Project 1: Turtle Recap$/,
				required: [
					"personal study guide",
					"filled shape",
					"uses a comment"
				]
			},
			{
				title: /Open Ended Project - Create a Drawing/,
				required: [
					"Plan the drawing",
					"`goto()`",
					"comments naming each part"
				]
			},
			{
				title: /^GrS2 Supplemental Project 7: Loops Recap$/,
				required: ["side count", "turn angle", "traced example"]
			},
			{
				title: /^GrS3 Supplemental Project 2: Debugging Practice$/,
				required: [
					"first error message",
					"rerun the program",
					"several things at once"
				]
			},
			{
				title: /Practice Project/,
				required: [
					"turn amount",
					"step length",
					"connected intentionally"
				]
			},
			{
				title: /Rainbow Ninja Star/,
				required: ["reassignment inside the loop", "color progression"]
			},
			{
				title: /Nested Loop Pattern/,
				required: ["outer loop", "inner loop", "comments naming"]
			},
			{
				title: /^GrS7 Project 1: Build a Neighborhood$/,
				required: [
					"drawHouse()",
					"different positions or sizes",
					"without duplicating"
				]
			},
			{
				title: /Make Your Own Function/,
				required: ["descriptive name", "call it more than once"]
			},
			{
				title: /^GrS8 Project 1: Event Listener Discovery$/,
				required: ["screen.onkey()", "screen.listen()", "callback"]
			},
			{
				title: /Fruit Stand/,
				required: ["own function", "Test every number key"]
			}
		];

		for (const { title, required } of checks) {
			const item = findItem(course!, title);
			expect(item.content.length, item.title).toBeGreaterThan(180);
			for (const phrase of required) {
				expect(item.content, item.title).toContain(phrase);
			}
		}

		const openEndedDrawing = findItem(
			course!,
			/Open Ended Project - Create a Drawing/
		);
		const turtleExploration = findItem(course!, /Turtle Exploration/);
		const turtleRecap = findItem(course!, /Turtle Recap/);

		for (const turtleItem of [
			turtleExploration,
			turtleRecap,
			openEndedDrawing
		]) {
			expect(turtleItem.content, turtleItem.title).toMatch(
				/canvas|Turtle|turtle|coordinate|drawing|visual/i
			);
			expect(turtleItem.content, turtleItem.title).not.toMatch(
				/Name the input values|input surface|input parsing|printed output|awkward inputs?|empty or smallest/i
			);
		}

		expect(openEndedDrawing.content).toContain(
			"Open Ended Project: Create a Drawing"
		);
		expect(openEndedDrawing.content).toMatch(
			/canvas setup|visible canvas behavior|Turtle plan|visible result/i
		);
		expect(openEndedDrawing.content).not.toMatch(
			/^- (?:For|Run|Keep|The )Open Ended Project - Create a Drawing/m
		);
		expect(openEndedDrawing.content).not.toMatch(
			/^- (?:For|Run|Keep|The )Open Ended Project\s*\n- Create a Drawing/m
		);
	});

	it("keeps pending Python Level 1 media out of the learner flow", async () => {
		const course = await loadRawCourse("python-level-1");
		expect(course).not.toBeNull();

		expect(
			course!.modules.some(
				module => module.title === "Pending Demo Media"
			)
		).toBe(false);
		const content = learnerCourseText(course);
		const inventory = course!.modules.find(
			module => module.title === "Pending Source Media Inventory"
		);
		expect(inventory?.kind).toBe("appendix");
		const inventoryText = inventory?.curriculum[0]?.content ?? "";

		for (const filename of [
			"grs1_turtle_exploration(1).mp4",
			"grs8_etch_a_sketch.gif",
			"grs12_snake.gif"
		]) {
			expect(content).not.toContain(filename);
			expect(inventoryText).toContain(filename);
			expect(hasPendingStaticMediaNotice(inventoryText, filename)).toBe(
				true
			);
		}

		expect(content).not.toContain("static.junilearning.com");
	});

	it("keeps unavailable Python Level 2 media out of learner actions", async () => {
		const course = await loadRawCourse("python-level-2");
		expect(course).not.toBeNull();

		const unavailableProjectMedia = [
			[/PS1 Project 1: Mad Libs/, "ps1_mad_libs.gif"],
			[/PS6 Supplemental Project 5: Card Shuffler/, "ps6_card_shuffler.mp4"],
			[/PS12 Project 1: Type Racer/, "ps12_type_racer.mp4"]
		] as const;

		for (const [titlePattern, filename] of unavailableProjectMedia) {
			const item = findItem(course!, titlePattern);
			expect(item.mediaLink).toBeUndefined();
			expect(hasPendingStaticMediaNotice(item.content, filename)).toBe(
				false
			);
		}

		expect(
			course!.modules.find(
				module => module.title === "Pending Static Assets"
			)
		).toBeUndefined();
		const learnerText = allCourseText(course);
		expect(learnerText).not.toContain("Pending Python Level 2 Assets");
		expect(learnerText).not.toContain("static.junilearning.com");
	});

	it("keeps available Python Level 3 media and hides unavailable actions", async () => {
		const course = await loadRawCourse("python-level-3");
		expect(course).not.toBeNull();

		const hostedProject = findItem(course!, /AM1 Project 1: Mad Libs/);
		expect(hostedProject.mediaLink).toBe(staticMediaUrl("am_1_mad_libs.mp4"));
		expect(hostedProject.content).not.toContain("Pending media:");

		const missingProject = findItem(
			course!,
			/AM12 Project 2: File IO and Dictionaries/
		);
		expect(missingProject.mediaLink).toBeUndefined();
		expect(
			hasPendingStaticMediaNotice(
				missingProject.content,
				"am_12_file_io_with_dictionaries.mp4"
			)
		).toBe(false);

		expect(
			course!.modules.find(
				module => module.title === "Pending Static Assets"
			)
		).toBeUndefined();
		const learnerText = allCourseText(course);
		expect(learnerText).not.toContain("Pending Python Level 3 Assets");
		expect(learnerText).not.toContain("static.junilearning.com");
	});

	it("attaches available Data Science data without putting asset backlog in the learner flow", async () => {
		const course = await loadRawCourse("data-science-in-python");
		expect(course).not.toBeNull();

		const summaryBuilder = findItem(course!, /CSV Summary Builder/);
		expect(summaryBuilder.datasetLink).toBe(
			staticMediaUrl("life_expectancy.csv")
		);
		expect(summaryBuilder.content).toContain("**Provided dataset:**");
		expect(
			course!.modules.find(
				module => module.title === "Static Data and Media Status"
			)
		).toBeUndefined();
		const learnerText = learnerCourseText(course);
		expect(learnerText).not.toContain("Data Science Asset Status");
		expect(learnerText).not.toContain("building_permits.csv");
		expect(learnerText).not.toContain("static.junilearning.com");
		const inventory = course!.modules.find(
			module => module.title === "Pending Source Media Inventory"
		);
		expect(inventory?.kind).toBe("appendix");
		expect(inventory?.curriculum[0]?.content).toContain(
			"building_permits.csv"
		);
	});

	it("keeps pending AI Foundations media out of the learner flow", async () => {
		const course = await loadRawCourse("ai-level-1");
		expect(course).not.toBeNull();

		expect(
			course!.modules.find(
				module => module.title === "Pending Static Assets"
			)
		).toBeUndefined();
		const learnerText = learnerCourseText(course);
		expect(learnerText).not.toContain("AI Foundations Media Status");
		expect(learnerText).not.toContain("fai1_project_1.mp4");
		expect(learnerText).not.toContain("fai3_1.png");
		expect(learnerText).not.toContain("static.junilearning.com");
		const inventory = course!.modules.find(
			module => module.title === "Pending Source Media Inventory"
		);
		expect(inventory?.kind).toBe("appendix");
		expect(inventory?.curriculum[0]?.content).toContain(
			"fai1_project_1.mp4"
		);
		expect(inventory?.curriculum[0]?.content).toContain("fai3_1.png");
	});

	it("records Machine Learning media as hosted or pending on the class static host", async () => {
		const course = await loadRawCourse("machine-learning");
		expect(course).not.toBeNull();

		const mediaModule = course!.modules.find(
			module => module.title === "Pending Static Assets"
		);
		expect(mediaModule?.kind).toBe("appendix");

		const mediaItem = mediaModule?.curriculum.find(
			item => item.title === "Machine Learning Media Status"
		);
		expect(mediaItem).toBeDefined();
		const content = mediaItem?.content ?? "";

		for (const filename of [
			"ml1_project_1.mp4",
			"ml4_project_3.mp4",
			"ml7_project_1.mp4"
		]) {
			expect(content).toContain(staticMediaUrl(filename));
			expect(content).not.toContain(
				`file \`${filename}\` is not currently available`
			);
		}

		for (const filename of ["ml3_1.png", "ml3_2.png"]) {
			expect(content).toContain(staticMediaUrl(filename));
			expect(hasPendingStaticMediaNotice(content, filename)).toBe(true);
		}

		expect(content).not.toContain("static.junilearning.com");
	});

	it("reserves pending USACO assets on the class static host", async () => {
		const bronzeOnDemand = await loadRawCourse("usaco-bronze-on-demand");
		const gold = await loadRawCourse("usaco-gold");
		expect(bronzeOnDemand).not.toBeNull();
		expect(gold).not.toBeNull();

		const bronzeModule = bronzeOnDemand!.modules.find(
			module => module.title === "Pending Static Assets"
		);
		const bronzeContent = bronzeModule?.curriculum
			.map(item => item.content)
			.join("\n\n") ?? "";

		for (const filename of ["missionTitle2.png", "nextStepTitle.png"]) {
			expect(bronzeContent).toContain(staticMediaUrl(filename));
			expect(hasPendingStaticMediaNotice(bronzeContent, filename)).toBe(true);
		}

		const goldModule = gold!.modules.find(
			module => module.title === "Pending Static Assets"
		);
		expect(goldModule?.kind).toBe("appendix");

		const goldItem = goldModule?.curriculum.find(
			item => item.title === "USACO Gold Asset Status"
		);
		expect(goldItem).toBeDefined();
		const goldContent = goldItem?.content ?? "";

		expect(goldContent).toContain(staticMediaUrl("treasure.txt"));
		expect(hasPendingStaticMediaNotice(goldContent, "treasure.txt")).toBe(true);
		expect(goldContent).not.toContain("static.junilearning.com");
	});

	it("keeps generated guidance references with spaced hyphens Markdown-safe", () => {
		const guidance = buildProjectGuidance({
			courseFamily: "Python Level 1",
			moduleTitle: "GrS1 Coordinates and Movement",
			itemTitle:
				"GrS1 Supplemental Project 2: Open Ended Project - Create a Drawing",
			projectKind: "extension",
			hasReference: false
		});

		expect(guidance).toContain("Open Ended Project: Create a Drawing");
		expect(guidance).not.toMatch(
			/^- .*Open Ended Project - Create a Drawing/m
		);
		expect(guidance).not.toMatch(
			/^- .*Open Ended Project\s*\n- Create a Drawing/m
		);
	});

	it("keeps later Python Turtle game prompts structured around state and verification", async () => {
		const course = await loadRawCourse("python-level-1");
		expect(course).not.toBeNull();

		const checks = [
			{
				title: /^GrS9 Project 2: More Functions$/,
				required: [
					"parameter values",
					"different sizes",
					"Verify the design"
				]
			},
			{
				title: /^GrS9 Project 3: Polka Dots$/,
				required: [
					"mouse clicks",
					"click coordinates",
					"edges, and corners"
				]
			},
			{
				title: /^GrS13 Project 3: Fluid Motion$/,
				required: [
					"screen.tracer(0)",
					"screen.update()",
					"animation loop"
				]
			},
			{
				title: /^GrS13 Project 5: Turtle Collision$/,
				required: ["hitbox", "boundary cases", "barely touching"]
			},
			{
				title: /^GrS14 Supplemental Project 3: Pong$/,
				required: ["two paddles", "scoring", "reset after each point"]
			},
			{
				title: /^GrS14 Supplemental Project 5: Snake$/,
				required: [
					"body list",
					"self-collision",
					"game-over conditions"
				]
			}
		];

		for (const { title, required } of checks) {
			const item = findItem(course!, title);
			expect(item.content.length, item.title).toBeGreaterThan(220);
			for (const phrase of required) {
				expect(item.content, item.title).toContain(phrase);
			}
		}
	});

	it("links the Python Turtle reference to command, boundary, scoring, and game-template lessons", async () => {
		const course = await loadRawCourse("python-level-1");
		expect(course).not.toBeNull();

		const linkedItems = [
			{
				title: /^Introduction and Setup$/,
				link: "/course-assets/python/turtle-project-reference.md#turtle-command-reference"
			},
			{
				title: /^GrS13 Project 2: Stay Inbounds$/,
				link: "/course-assets/python/turtle-project-reference.md#boundaries-and-in-bounds-checks"
			},
			{
				title: /^GrS13 Project 4: Bouncy Ball Room$/,
				link: "/course-assets/python/turtle-project-reference.md#game-template-with-score-boundaries-and-moving-triangles"
			},
			{
				title: /^GrS13 Project 5: Turtle Collision$/,
				link: "/course-assets/python/turtle-project-reference.md#score-turtle-pattern"
			},
			{
				title: /^GrS14 Project 1: Space Eater$/,
				link: "/course-assets/python/turtle-project-reference.md#game-template-with-score-boundaries-and-moving-triangles"
			}
		];

		for (const { title, link } of linkedItems) {
			const item = findItem(course!, title);
			expect(item.datasetLink, item.title).toBe(link);
		}

		const reference = fs.readFileSync(
			"public/course-assets/python/turtle-project-reference.md",
			"utf8"
		);

		for (const phrase of [
			"forward(distance)",
			"pixels",
			"left(degrees)",
			"Project Organization",
			"global score",
			"score_turtle.clear()",
			"is_inside_bounds",
			"Moving Triangles Homework Extension",
			"CodeHS supports uploaded audio files",
			"CodeHS file uploads",
			"CodeHS Python Turtle commands",
			"built-in Turtle sound command"
		]) {
			expect(reference).toContain(phrase);
		}
	});

	it("keeps Pythonic Design Patterns labels neutral and learner-readable", async () => {
		const course = await loadRawCourse("pythonic-design-patterns");
		expect(course).not.toBeNull();

		const source = fs.readFileSync(
			"src/stores/courses/pythonic-design-patterns.ts",
			"utf8"
		);
		const loadedCorpus = allCourseText(course!);

		for (const corpus of [source, loadedCorpus]) {
			expect(corpus).not.toMatch(/\bSupplemental [23]\b/);
			expect(corpus).not.toMatch(/\bSkill target:/);
			expect(corpus).not.toMatch(/\bThis section covers\b/);
			expect(corpus).not.toMatch(/\bThe goal is to\b/);
			expect(corpus).not.toMatch(/\bshould\b/i);
			expect(corpus).not.toMatch(/Not mistake/);
			expect(corpus).not.toMatch(/\bwhy python changes\b/);
			expect(corpus).not.toMatch(/\bdesign foundations in python\b/);
		}

		expect(loadedCorpus).toContain(
			"Why Python Changes the Design Patterns Conversation Transfer Practice"
		);
		expect(loadedCorpus).toContain(
			"Factory and Builder in Python Extension Practice"
		);
		expect(loadedCorpus).toContain(
			"Packages, imports, and file ownership are part of the design vocabulary"
		);
		expect(loadedCorpus).toContain(
			"External weirdness stays near the edge instead of spreading through the codebase"
		);
	});

	it("keeps PyGame lessons and projects structured instead of dense one-paragraph prompts", async () => {
		const course = await loadRawCourse("pygames");
		expect(course).not.toBeNull();

		const source = fs.readFileSync("src/stores/courses/pygames.ts", "utf8");
		const loadedCorpus = allCourseText(course!);
		const requiredSections = [
			"**Coordinate model:**",
			"**Position keywords:**",
			"**Practice checks:**",
			"**Starter example:**",
			"**Project goal:**",
			"**Implementation steps:**",
			"**Game objects and state:**",
			"**Build sequence:**",
			"**Double-jump prevention:**",
			"**One-time schedule:**",
			"**Repeated schedule:**",
			"**Shark behavior:**",
			"**Hiding mechanic:**",
			"**Projectile behavior:**",
			"**Laser list behavior:**",
			"**Alien behavior:**",
			"**Completion checks:**"
		];

		for (const phrase of requiredSections) {
			expect(source).toContain(phrase);
		}

		expect(source).not.toContain(
			"Create a simple top-down golf game where the player clicks to hit a ball toward a hole. Add Actors for a golf ball, hole, and flag."
		);
		expect(source).not.toContain(
			"Build a Fish Bowl game where a shark chases a diver and seaweed can hide the player. The finished Shark Chase or Fish Bowl game should make these behaviors clear"
		);
		expect(source).not.toContain(
			"Create a boss-style Space Battle where an alien ship with AI fires at the player. The finished game should make the alien behavior clear"
		);
		expect(source).not.toMatch(/\bImplementation Lab\b/);
		expect(source).not.toMatch(/\bSupplemental [23]\b/);
		expect(source).not.toMatch(/\bKey idea:/);
		expect(source).not.toMatch(/\bThe goal is to\b/);
		expect(loadedCorpus).not.toMatch(/\bImplementation Lab\b/);
		expect(loadedCorpus).not.toMatch(/\bSupplemental [23]\b/);
		expect(loadedCorpus).toContain("The score changes only on collision");
		expect(loadedCorpus).toContain("Both projectile lists update safely");
		expect(loadedCorpus).toContain("Images and Sprites: Practice Studio");
		expect(loadedCorpus).toContain(
			"Transfer Practice: Setup, Editors, and Asset Workflow"
		);
		expect(loadedCorpus).toContain("Master Project Extension Practice");
		expect(loadedCorpus).toContain(
			"The original shared asset pack is reserved at https://static.classes.jacobdanderson.net/assets.zip for future hosting"
		);
		expect(findItem(course!, /PyGame Setup with Mu/).datasetLink).toBe(
			"https://static.classes.jacobdanderson.net/assets.zip"
		);
	});

	it("keeps JavaScript normalization focused on web development instead of Java", async () => {
		const courses = await Promise.all([
			loadRawCourse("javascript-level-1-javascript-superstar"),
			loadRawCourse("javascript-level-2-javascript-master")
		]);
		const corpus = courses.map(allCourseText).join("\n");

		expect(corpus).toContain("web-development workflow");
		expect(corpus).not.toContain("object-oriented Java design");
		expect(corpus).not.toContain("classes, method contracts, object state");
	});

	it("keeps JavaScript, Web, and Machine Learning raw source links free of duplicate solution aliases", () => {
		const duplicateLinks = [
			"src/stores/courses/javascript-level-1.ts",
			"src/stores/courses/javascript-level-2.ts",
			"src/stores/courses/machine-learning.ts",
			"src/stores/courses/web-development-foundations.ts"
		].flatMap(duplicateProjectSolutionLinksInSource);

		expect(duplicateLinks).toEqual([]);
	});

	it("keeps AI, data science, and Pythonic root repository links archive-labeled", async () => {
		const courseIds = [
			"ai-level-1",
			"data-science-in-python",
			"pythonic-design-patterns"
		];
		const broadProjectRootLinks: string[] = [];

		for (const courseId of courseIds) {
			const course = await loadRawCourse(courseId);
			expect(course).not.toBeNull();
			if (!course) continue;

			for (const module of course.modules) {
				for (const item of [
					...module.curriculum,
					...module.supplementalProjects
				]) {
					const projectLink = item.projectLink?.trim() ?? "";
					if (
						!/^https:\/\/github\.com\/instruction-material\/[^/]+\/tree\/main\/?$/.test(
							projectLink.replace(/\/+$/, "")
						)
					) {
						continue;
					}

					const context = `${item.title}\n${item.content ?? ""}`;
					const archiveContextPattern =
						/\b(?:archive|reference|workspace|source map|repo bank|problem bank)\b/i;
					if (!archiveContextPattern.test(context)) {
						broadProjectRootLinks.push(
							`${courseId} / ${module.title} / ${item.title}: ${projectLink}`
						);
					}
				}
			}
		}

		expect(broadProjectRootLinks).toEqual([]);
	});

	it("keeps legacy JavaScript web prompts specific enough to stand alone", async () => {
		const courses = await Promise.all([
			loadRawCourse("javascript-level-1-javascript-superstar"),
			loadRawCourse("javascript-level-2-javascript-master")
		]);
		const corpus = courses.map(allCourseText).join("\n");

		expect(corpus).not.toMatch(
			/Practice selectors at https:\/\/flukeout\.github\.io\./
		);
		expect(corpus).not.toMatch(
			/Work through https:\/\/flexboxfroggy\.com\/ to learn flexbox\./
		);
		expect(corpus).not.toMatch(
			/Replicate the Berkshire Hathaway page using learned HTML\/CSS\./
		);
		expect(corpus).not.toMatch(
			/Add Material icons via dependency and use icons as scalable SVGs\./
		);
		expect(corpus).not.toMatch(
			/Use Materialize helpers to hide\/show content by screen size\./
		);
		expect(corpus).not.toMatch(
			/Build a message board storing posts as JSON, with inputs for URL, image, and title; render posts above the form\./
		);
		expect(corpus).not.toMatch(
			/Allow users to add comments to each post and display them beneath posts\./
		);
		expect(corpus).not.toMatch(
			/Define functions \(arrow syntax\), parameters vs arguments, closures, and calling order\./
		);
		expect(corpus).not.toMatch(
			/Draw a landscape using shapes and canvas techniques\./
		);
		expect(corpus).not.toMatch(
			/Repeated logic belongs in small reusable, well-named functions\./
		);
		expect(corpus).not.toMatch(
			/Explain APIs, requests, and why fetch is asynchronous\./
		);
		expect(corpus).toContain(
			"Use CSS Diner to practice selector precision"
		);
		expect(corpus).toContain(
			"Use Flexbox Froggy as a layout reasoning drill"
		);
		expect(corpus).toContain(
			"Functions turn a repeated process into a named operation"
		);
		expect(corpus).toContain(
			"Create a landscape scene with repeated canvas shapes"
		);
		expect(corpus).toContain(
			"Helper functions keep a program understandable by giving a name to repeated or low-level work"
		);
		expect(corpus).toContain(
			"API requests are asynchronous because the browser must wait for another service to respond"
		);
		expect(corpus).toContain(
			"The key skill is separating local page state from persisted remote state"
		);
		expect(corpus).toContain(
			"comments do not accidentally attach to the wrong item"
		);
	});

	it("keeps JavaScript Level 1 prompts student-readable and concrete", async () => {
		const course = await loadRawCourse(
			"javascript-level-1-javascript-superstar"
		);
		expect(course).not.toBeNull();
		const corpus = allCourseText(course);
		const source = fs.readFileSync(
			"src/stores/courses/javascript-level-1.ts",
			"utf8"
		);

		expect(corpus).not.toMatch(/Let the learner/i);
		expect(corpus).not.toMatch(/guide with questions/i);
		expect(corpus).not.toMatch(/Another review checkpoint/i);
		expect(corpus).not.toMatch(/Optional .* idea/i);
		expect(source).not.toMatch(/\bshould\b/i);

		const checks = [
			{
				title: /^JavaScript Level 1: JavaScript Superstar Check-In 1 Overview$/,
				required: ["runnable example", "which fundamentals are fluent"]
			},
			{
				title: /^JSS1 Project 1: Welcome Survey$/,
				required: ["convert the numeric inputs", "one-letter food"]
			},
			{
				title: /^JSS2 Project 1: Tips and Taxes$/,
				required: [
					"intermediate tax and tip values",
					"decimal meal cost"
				]
			},
			{
				title: /^JSS3 Supplemental Project 2: Forgotten Math$/,
				required: ["without using `*`", "multiplying by 0"]
			},
			{
				title: /^JSS6 Project 2: FizzBuzz$/,
				required: ["combined 3-and-5 condition", "too early"]
			},
			{
				title: /^JSS7 Project 3: Pac-Man$/,
				required: ["missing slice", "wider and narrower mouth"]
			},
			{
				title: /^JSS12 Project 2: My Hobby Table$/,
				required: ["thead", "readable without relying only on color"]
			},
			{
				title: /^JSS14 Project 3: Dynamic Components$/,
				required: [
					"three Materialize JavaScript components",
					"after a page refresh"
				]
			},
			{
				title: /^JSS15 Supplemental Project 3: Jun-E-Commerce$/,
				required: [
					"featured products",
					"call-to-action",
					"narrow screen"
				]
			}
		];

		for (const { title, required } of checks) {
			const item = findItem(course!, title);
			expect(item.content.length, item.title).toBeGreaterThan(180);
			for (const phrase of required) {
				expect(item.content, item.title).toContain(phrase);
			}
		}
	});

	it("reserves pending JavaScript Level 1 media on the class static host", async () => {
		const course = await loadRawCourse(
			"javascript-level-1-javascript-superstar"
		);
		expect(course).not.toBeNull();

		const mediaModule = course!.modules.find(
			module => module.title === "Pending Demo Media"
		);
		expect(mediaModule?.kind).toBe("appendix");

		const mediaItem = mediaModule?.curriculum.find(
			item => item.title === "Pending JavaScript Level 1 Demo Media"
		);
		expect(mediaItem).toBeDefined();
		const content = mediaItem?.content ?? "";

		for (const filename of [
			"js1_project_1.mp4",
			"jss8_project_1.mp4",
			"jss_check_in_2_project.mp4"
		]) {
			expect(content).toContain(staticMediaUrl(filename));
			expect(hasPendingStaticMediaNotice(content, filename)).toBe(true);
		}

		expect(content).not.toContain("static.junilearning.com");
	});

	it("reserves pending JavaScript Level 2 media on the class static host", async () => {
		const course = await loadRawCourse(
			"javascript-level-2-javascript-master"
		);
		expect(course).not.toBeNull();

		const mediaModule = course!.modules.find(
			module => module.title === "Pending Demo Media"
		);
		expect(mediaModule?.kind).toBe("appendix");

		const mediaItem = mediaModule?.curriculum.find(
			item => item.title === "Pending JavaScript Level 2 Demo Media"
		);
		expect(mediaItem).toBeDefined();
		const content = mediaItem?.content ?? "";

		for (const filename of [
			"jsm_check_in_project_1.mp4",
			"jsm5_project_4.mp4",
			"jsm14_project_1.mp4"
		]) {
			expect(content).toContain(staticMediaUrl(filename));
			expect(hasPendingStaticMediaNotice(content, filename)).toBe(true);
		}

		expect(content).not.toContain("static.junilearning.com");
	});

	it("reserves pending Java Level 1 media on the class static host", async () => {
		const course = await loadRawCourse("java-level-1");
		expect(course).not.toBeNull();

		const mediaModule = course!.modules.find(
			module => module.title === "Pending Demo Media"
		);
		expect(mediaModule?.kind).toBe("appendix");

		const mediaItem = mediaModule?.curriculum.find(
			item => item.title === "Pending Java Level 1 Demo Media"
		);
		expect(mediaItem).toBeDefined();
		const content = mediaItem?.content ?? "";

		for (const filename of [
			"js1_chatbot.mp4",
			"js2_basic_shapes.png",
			"js9_simple_battleship.mp4"
		]) {
			expect(content).toContain(staticMediaUrl(filename));
			expect(hasPendingStaticMediaNotice(content, filename)).toBe(true);
		}

		expect(content).not.toContain("static.junilearning.com");
	});

	it("reserves pending Java Level 2 media on the class static host", async () => {
		const course = await loadRawCourse("java-level-2");
		expect(course).not.toBeNull();

		const mediaModule = course!.modules.find(
			module => module.title === "Pending Demo Media"
		);
		expect(mediaModule?.kind).toBe("appendix");

		const mediaItem = mediaModule?.curriculum.find(
			item => item.title === "Pending Java Level 2 Demo Media"
		);
		expect(mediaItem).toBeDefined();
		const content = mediaItem?.content ?? "";

		for (const filename of [
			"jm_1_dog_class.mp4",
			"jm_6_pacman_class.mp4",
			"jm_10_tic_tac_toe.mp4"
		]) {
			expect(content).toContain(staticMediaUrl(filename));
			expect(hasPendingStaticMediaNotice(content, filename)).toBe(true);
		}

		expect(content).not.toContain("static.junilearning.com");
	});

	it("reserves pending Java Level 3 media on the class static host", async () => {
		const course = await loadRawCourse("java-level-3");
		expect(course).not.toBeNull();

		const mediaModule = course!.modules.find(
			module => module.title === "Pending Demo Media"
		);
		expect(mediaModule?.kind).toBe("appendix");

		const mediaItem = mediaModule?.curriculum.find(
			item => item.title === "Pending Java Level 3 Demo Media"
		);
		expect(mediaItem).toBeDefined();
		const content = mediaItem?.content ?? "";

		for (const filename of [
			"aj_1_chatbot.mp4",
			"aj_14_BST.mp4",
			"aj_check-in_4.mp4"
		]) {
			expect(content).toContain(staticMediaUrl(filename));
			expect(hasPendingStaticMediaNotice(content, filename)).toBe(true);
		}

		expect(content).not.toContain("static.junilearning.com");
	});

	it("keeps PyGame media on project cards and pending media out of the learner flow", async () => {
		const course = await loadRawCourse("pygames");
		expect(course).not.toBeNull();

		expect(
			course!.modules.find(
				module => module.title === "Demo Media Status"
			)
		).toBeUndefined();

		const allItems = course!.modules.flatMap(module => [
			...module.curriculum,
			...module.supplementalProjects
		]);
		for (const [title, filename] of [
			["PyG1 Project 1: Rainbow Fill", "pyg_1_rainbow_fill.mp4"],
			["PyG5 Project 2: Golf", "pyg_5_golf.mp4"],
			["PyG11 Project 1: Space Invaders", "pyg_11_space_invaders.mp4"]
		] as const) {
			expect(
				allItems.find(item => item.title === title)?.mediaLink
			).toBe(staticMediaUrl(filename));
		}

		const learnerText = JSON.stringify(
			course!.modules.filter(module => module.kind !== "appendix")
		);
		for (const filename of [
			"check_in_2_starter.py",
			"pyg_3_asteroid_dodge.mp4",
			"pyg6_platformer_game.py"
		]) {
			expect(hasPendingStaticMediaNotice(learnerText, filename)).toBe(
				false
			);
		}
		const inventory = course!.modules.find(
			module => module.title === "Pending Source Media Inventory"
		);
		expect(inventory?.kind).toBe("appendix");
		expect(learnerText).not.toContain("static.junilearning.com");
	});

	it("keeps unshipped Scratch visuals out of learner flows", async () => {
		const [scratchLevel1, scratchLevel2] = await Promise.all([
			loadRawCourse("scratch-level-1"),
			loadRawCourse("scratch-level-2")
		]);
		expect(scratchLevel1).not.toBeNull();
		expect(scratchLevel2).not.toBeNull();

		expect(
			scratchLevel1!.modules.find(
				module => module.title === "Pending Static Assets"
			)
		).toBeUndefined();
		expect(
			scratchLevel2!.modules.find(
				module => module.title === "Pending Static Assets"
			)
		).toBeUndefined();
	});

	it("keeps low-level security projects evidence-based instead of generic starter boilerplate", async () => {
		const courses = await Promise.all([
			loadRawCourse("low-level-security"),
			loadRawCourse("low-level-security-part-2")
		]);
		const corpus = courses.map(allCourseText).join("\n");

		expect(corpus).not.toMatch(/Complete the linked security lab/i);
		expect(corpus).not.toMatch(
			/The project should prove the module concept/i
		);
		expect(corpus).not.toMatch(/Read the starter and identify/i);
		expect(corpus).toContain(
			"produces defensive evidence, not just a passing program"
		);
		expect(corpus).toContain("**Focus:**");
		expect(corpus).toContain("local lab boundary");
		expect(corpus).toContain("does not target public systems");
		expect(corpus).toContain("reachability, attacker-controlled input");
		expect(corpus).toContain("sanitizer output");
	});

	it("keeps low-level security implementation labs from regressing to generated filler", () => {
		const sourcePaths = [
			"src/stores/courses/low-level-security.ts",
			"src/stores/courses/low-level-security-part-2.ts"
		];
		const corpus = sourcePaths
			.map(path => fs.readFileSync(path, "utf8"))
			.join("\n");

		expect(corpus).not.toMatch(/This lab states the target artifact/i);
		expect(corpus).not.toMatch(
			/A representative .* example names the key inputs/i
		);
		expect(corpus).not.toMatch(/Build one complete artifact first/i);
		expect(corpus).not.toMatch(
			/Extend the core build with one extra requirement/i
		);
		expect(corpus).not.toMatch(/\bshould\b/i);
		expect(corpus).not.toMatch(/offensive-security-lab-1[67]/i);
		expect(corpus).not.toMatch(
			/LLS-\d+-applied-studio-\d+-offensive-security-lab-1[67]/i
		);
		expect(corpus).toContain("securityLabConceptContent");
		expect(corpus).toContain("securityLabExampleContent");
		expect(corpus).toContain("securityLabReviewContent");
	});

	it("keeps low-level security supplemental labs purpose-specific", async () => {
		const courses = await Promise.all([
			loadRawCourse("low-level-security"),
			loadRawCourse("low-level-security-part-2")
		]);
		const checkedModules: string[] = [];

		for (const course of courses) {
			expect(course).not.toBeNull();
			if (!course) continue;

			for (const module of course.modules.filter(module =>
				/^Low-Level Security Lab (?:[7-9]|1[0-7])(?:$|:)/.test(
					module.title
				)
			)) {
				const challenge = module.supplementalProjects.find(item =>
					/Extension Challenge/.test(item.title)
				);
				const transfer = module.supplementalProjects.find(item =>
					/Transfer Practice/.test(item.title)
				);
				const extension = module.supplementalProjects.find(item =>
					/Extension Practice/.test(item.title)
				);
				expect(challenge, module.title).toBeDefined();
				expect(transfer, module.title).toBeDefined();
				expect(extension, module.title).toBeDefined();
				if (!challenge || !transfer || !extension) continue;

				expect(challenge.content, challenge.title).toContain(
					"extension challenge security lab"
				);
				expect(transfer.content, transfer.title).toContain(
					"transfer-practice security lab"
				);
				expect(extension.content, extension.title).toContain(
					"extension-practice security lab"
				);
				expect(
					new Set([
						challenge.content,
						transfer.content,
						extension.content
					]).size,
					module.title
				).toBe(3);
				checkedModules.push(module.title);
			}
		}

		expect(checkedModules).toEqual([
			"Low-Level Security Lab 7: Sanitizer Triage Studio",
			"Low-Level Security Lab 8: Bounds Regression Studio",
			"Low-Level Security Lab 9: Binary Parser Hardening Studio",
			"Low-Level Security Lab 10: Integer State Safety Studio",
			"Low-Level Security Lab 11: Fuzzing Regression Studio",
			"Low-Level Security Lab 12: Patch Review Handoff Studio",
			"Low-Level Security Lab 13: Exploitability Triage Studio",
			"Low-Level Security Lab 14: Stack Corruption Hardening Studio",
			"Low-Level Security Lab 15: Heap Lifetime Audit Studio",
			"Low-Level Security Lab 16: Disclosure Boundary Hardening Studio",
			"Low-Level Security Lab 17: Defensive Audit Capstone Studio"
		]);
		const combinedText = courses.map(allCourseText).join("\n");
		expect(combinedText).toContain("sanitizer-output triage");
		expect(combinedText).toContain("bounds regression matrices");
		expect(combinedText).toContain("exploitability triage");
		expect(combinedText).toContain("stack-corruption toy-program review");
		expect(combinedText).toContain("capstone audit synthesis");
	});

	it("keeps AI search supplemental labs purpose-specific", async () => {
		const course = await loadRawCourse("ai-level-1");
		expect(course).not.toBeNull();
		if (!course) return;

		const expectedFocusByLab = new Map([
			[13, "frontier instrumentation"],
			[14, "depth limits"],
			[15, "uniform-cost or A* cost accounting"],
			[16, "greedy versus A* comparisons"],
			[17, "game or puzzle search evaluation"]
		]);
		const checkedLabs: number[] = [];

		for (const [labNumber, focus] of expectedFocusByLab) {
			const module = course.modules.find(
				module =>
					module.title ===
					`AI Search Lab ${labNumber}: Practice Studio`
			);
			expect(module, `AI Search Lab ${labNumber}`).toBeDefined();
			if (!module) continue;

			const transfer = module.supplementalProjects.find(
				item =>
					item.title ===
					`Transfer Practice: AI Search Lab ${labNumber}`
			);
			const extension = module.supplementalProjects.find(
				item =>
					item.title ===
					`Extension Practice: AI Search Lab ${labNumber}`
			);
			expect(transfer, module.title).toBeDefined();
			expect(extension, module.title).toBeDefined();
			if (!transfer || !extension) continue;

			expect(transfer.content, transfer.title).toContain(
				"transfer-practice search lab"
			);
			expect(extension.content, extension.title).toContain(
				"extension-practice search lab"
			);
			expect(transfer.content, transfer.title).toContain(focus);
			expect(extension.content, extension.title).toContain(focus);
			expect(transfer.content, module.title).not.toEqual(
				extension.content
			);
			checkedLabs.push(labNumber);
		}

		expect(checkedLabs).toEqual([13, 14, 15, 16, 17]);
	});

	it("keeps Python check-in supplemental checkpoints level-specific", async () => {
		const expectedByCourse = new Map([
			[
				"python-level-1",
				[
					"turtle movement and drawing",
					"function decomposition",
					"game-state updates"
				]
			],
			[
				"python-level-2",
				[
					"string and numeric input",
					"choosing the right collection for a task"
				]
			],
			[
				"python-level-3",
				["stack behavior", "runtime vocabulary", "file input/output"]
			]
		]);
		const checkpointBodies: string[] = [];

		for (const [courseId, expectedPhrases] of expectedByCourse) {
			const course = await loadRawCourse(courseId);
			expect(course, courseId).not.toBeNull();
			if (!course) continue;

			const courseText = allCourseText(course);
			for (const phrase of expectedPhrases) {
				expect(
					courseText,
					`${courseId} should include ${phrase}`
				).toContain(phrase);
			}

			for (const module of course.modules.filter(module =>
				/^Check-In #\d+$/.test(module.title)
			)) {
				const checkpoint = module.supplementalProjects.find(
					item =>
						item.title.startsWith("Checkpoint:") ||
						/Check-In \d+ Practice Project$/.test(item.title)
				);
				expect(checkpoint, `${courseId} ${module.title}`).toBeDefined();
				if (checkpoint) checkpointBodies.push(checkpoint.content);
			}
		}

		expect(new Set(checkpointBodies).size).toBe(checkpointBodies.length);
	});

	it("keeps Python standards and roadmap profiles level-specific", async () => {
		const expectedPhrasesByCourse = new Map([
			[
				"python-level-1",
				[
					"turtle coordinates",
					"Input, casting, and validation mini-lab",
					"Beginner game capstone"
				]
			],
			[
				"python-level-2",
				[
					"collection choice",
					"Text files, CSV-like rows",
					"Data-backed capstone"
				]
			],
			[
				"python-level-3",
				[
					"algorithms and software-quality bridge",
					"Runtime measurement and asymptotic reasoning",
					"Object-oriented capstone"
				]
			]
		]);
		const referenceGuideBodies: string[] = [];

		for (const [courseId, expectedPhrases] of expectedPhrasesByCourse) {
			const course = await loadRawCourse(courseId);
			expect(course, courseId).not.toBeNull();
			if (!course) continue;

			const courseText = allCourseText(course);
			for (const phrase of expectedPhrases) {
				expect(
					courseText,
					`${courseId} should include ${phrase}`
				).toContain(phrase);
			}

			const standardsMap = course.modules.find(
				module => module.title === "Standards Map"
			);
			expect(standardsMap, `${courseId} Standards Map`).toBeDefined();
			const referenceGuide = standardsMap?.curriculum.find(item =>
				item.title.endsWith("Reference Guide")
			);
			expect(referenceGuide, `${courseId} Reference Guide`).toBeDefined();
			if (referenceGuide)
				referenceGuideBodies.push(referenceGuide.content);
		}

		expect(new Set(referenceGuideBodies).size).toBe(
			referenceGuideBodies.length
		);
	});

	it("keeps JavaScript check-in supplemental practice level-specific", async () => {
		const expectedByCourse = new Map([
			[
				"javascript-level-1-javascript-superstar",
				[
					"JavaScript Superstar Check-In #1 Transfer Practice",
					"JavaScript Superstar Check-In #1 Extension Practice",
					"JavaScript Superstar Check-In #2 Transfer Practice",
					"JavaScript Superstar Check-In #2 Extension Practice"
				]
			],
			[
				"javascript-level-2-javascript-master",
				[
					"JavaScript Master Check-In #1 Transfer Practice",
					"JavaScript Master Check-In #1 Extension Practice",
					"JavaScript Master Check-In #2 Transfer Practice",
					"JavaScript Master Check-In #2 Extension Practice"
				]
			]
		]);
		const sourcePathByCourse = new Map([
			[
				"javascript-level-1-javascript-superstar",
				"src/stores/courses/javascript-level-1.ts"
			],
			[
				"javascript-level-2-javascript-master",
				"src/stores/courses/javascript-level-2.ts"
			]
		]);
		const supplementalBodies: string[] = [];

		for (const [courseId, expectedPhrases] of expectedByCourse) {
			const course = await loadRawCourse(courseId);
			expect(course, courseId).not.toBeNull();
			if (!course) continue;

			const sourcePath = sourcePathByCourse.get(courseId);
			expect(sourcePath, courseId).toBeDefined();
			const courseText = [
				sourcePath ? fs.readFileSync(sourcePath, "utf8") : "",
				allCourseText(course)
			].join("\n");
			expect(courseText).not.toMatch(/\bsupplemental [23]\b/i);
			if (courseId === "javascript-level-1-javascript-superstar") {
				expect(courseText).toContain(
					"Combining Loops and Variables Transfer Practice"
				);
				expect(courseText).toContain(
					"Dynamic Websites with JavaScript Extension Practice"
				);
			}
			if (courseId === "javascript-level-2-javascript-master") {
				expect(courseText).toContain(
					"Fundamentals Review Transfer Practice"
				);
				expect(courseText).toContain(
					"Master Project Extension Practice"
				);
			}
			for (const phrase of expectedPhrases) {
				expect(
					courseText,
					`${courseId} should include ${phrase}`
				).toContain(phrase);
			}

			for (const module of course.modules.filter(module =>
				/^Check-In #\d+$/.test(module.title)
			)) {
				for (const item of module.supplementalProjects.filter(item =>
					/supplemental [23]$/i.test(item.title)
				)) {
					supplementalBodies.push(item.content);
				}
			}
		}

		expect(new Set(supplementalBodies).size).toBe(
			supplementalBodies.length
		);
	});

	it("keeps systems and web implementation labs from regressing to generated filler", () => {
		const sourcePaths = [
			"src/stores/courses/assembly.ts",
			"src/stores/courses/c-systems-engineering.ts",
			"src/stores/courses/linux-systems.ts",
			"src/stores/courses/network-security.ts",
			"src/stores/courses/network-systems.ts",
			"src/stores/courses/web-development-foundations.ts"
		];
		const corpus = sourcePaths
			.map(path => fs.readFileSync(path, "utf8"))
			.join("\n");

		expect(corpus).not.toMatch(/This lab states the target artifact/i);
		expect(corpus).not.toMatch(
			/A representative .* example names the key inputs/i
		);
		expect(corpus).not.toMatch(/Build one complete artifact first/i);
		expect(corpus).not.toMatch(
			/Extend the core build with one extra requirement/i
		);
		expect(corpus).toContain("buildImplementationLabGuidance");
		expect(corpus).toContain("Assembly Lab 15: Stack Trace Studio");
		expect(corpus).toContain("Systems Build 14: Byte Inspector Studio");
		expect(corpus).toContain("Full Stack Web Lab 14: Feature Slice Studio");
	});

	it("keeps Network Security guidance specific and defensively scoped", async () => {
		const course = await loadRawCourse("network-security");
		expect(course).not.toBeNull();
		const corpus = allCourseText(course);

		expect(corpus).not.toMatch(/This section covers/i);
		expect(corpus).not.toMatch(/Key idea:/i);
		expect(corpus).not.toMatch(/Skill target:/i);
		expect(corpus).not.toMatch(
			/The goal is to recognize weak assumptions/i
		);
		expect(corpus).not.toMatch(/The goal is to normalize calm/i);
		expect(corpus).not.toMatch(/\bsupplemental [23]\b/i);
		expect(corpus).not.toMatch(/\bImplementation Lab\b/i);
		expect(corpus).not.toMatch(/\bshould\b/i);
		expect(corpus).not.toMatch(/\bhttp and api\b/);
		expect(corpus).not.toMatch(/\btls and secure\b/);
		expect(corpus).not.toMatch(/\bnode\/typescript\b/);
		expect(corpus).not.toMatch(/\bwebsockets\b/);
		expect(corpus).not.toMatch(/\bai-assisted\b/);
		expect(corpus).toContain(
			"Attack surface means every externally reachable input"
		);
		expect(corpus).toContain(
			"TLS protects data in transit against interception and tampering"
		);
		expect(corpus).toContain(
			"Penetration testing is an authorized defensive activity"
		);
		expect(corpus).toContain("never ask it to target unauthorized systems");
		expect(corpus).toContain("Network Security Setup Transfer Practice");
		expect(corpus).toContain("HTTP API Boundary Transfer Practice");
		expect(corpus).toContain("Authorized Testing Transfer Practice");
		expect(corpus).toContain(
			"Network Security Lab 16: Service Boundary Hardening Studio"
		);
		expect(corpus).toContain(
			"Network Security Lab 17: Audit and Disclosure Studio"
		);
		expect(corpus).toContain("Audit Report Extension Practice");
	});

	it("keeps Network Systems explanations topic-specific", async () => {
		const course = await loadRawCourse("network-systems");
		expect(course).not.toBeNull();
		const corpus = allCourseText(course);

		expect(corpus).not.toMatch(/This section covers/i);
		expect(corpus).not.toMatch(/Key idea:/i);
		expect(corpus).not.toMatch(/Skill target:/i);
		expect(corpus).not.toMatch(/The goal is to make port-to-process/i);
		expect(corpus).not.toMatch(/The goal is to make dual-stack/i);
		expect(corpus).not.toMatch(/\bsupplemental [23]\b/i);
		expect(corpus).not.toMatch(/\bImplementation Lab\b/i);
		expect(corpus).not.toMatch(/\bshould\b/i);
		expect(corpus).toContain(
			"Interfaces attach a host to a network, frames move across the local link"
		);
		expect(corpus).toContain(
			"UFW provides a safe, readable host-policy layer"
		);
		expect(corpus).toContain(
			"Safe port forwarding is a last-mile exposure step"
		);
		expect(corpus).toContain("Network Stack Transfer Practice");
		expect(corpus).toContain("DNS Resolution Transfer Practice");
		expect(corpus).toContain("Packet Capture Extension Practice");
		expect(corpus).toContain(
			"Network Systems Lab 15: Diagnostic Workflow Studio"
		);
		expect(corpus).toContain(
			"Network Systems Lab 16: Service Exposure Studio"
		);
		expect(corpus).toContain(
			"Network Systems Lab 17: Operations Capstone Studio"
		);
		expect(corpus).toContain("Operations Capstone Extension Practice");
	});

	it("keeps Data Structures and Algorithms in C++ labels algorithm-specific", async () => {
		const course = await loadRawCourse(
			"data-structures-and-algorithms-in-cpp"
		);
		expect(course).not.toBeNull();
		const corpus = allCourseText(course);

		expect(corpus).not.toMatch(/This section covers/i);
		expect(corpus).not.toMatch(/Key idea:/i);
		expect(corpus).not.toMatch(/Skill target:/i);
		expect(corpus).not.toMatch(/The goal is to/i);
		expect(corpus).not.toMatch(/\bsupplemental [23]\b/i);
		expect(corpus).not.toMatch(/\bImplementation Lab\b/i);
		expect(corpus).not.toMatch(/\bshould\b/i);
		expect(corpus).toContain(
			"Sequence mutation becomes concrete through task filtering and removal"
		);
		expect(corpus).toContain(
			"Shortest-path work is a repeated relaxation problem"
		);
		expect(corpus).toContain(
			"Height maintenance and balance factors are structural evidence"
		);
		expect(corpus).toContain("Setup and Positioning Transfer Practice");
		expect(corpus).toContain("Graph Navigation Transfer Practice");
		expect(corpus).toContain("AVL Rotation Extension Practice");
		expect(corpus).toContain(
			"C++ Algorithm Lab 11: Sequence Invariant Studio"
		);
		expect(corpus).toContain(
			"C++ Algorithm Lab 14: Partition Sorting Studio"
		);
		expect(corpus).toContain(
			"C++ Algorithm Lab 17: Benchmarking Capstone Studio"
		);
		expect(corpus).toContain("Benchmarking Capstone Extension Practice");
	});

	it("keeps Design Patterns in C++ labels pattern-specific", async () => {
		const course = await loadRawCourse("design-patterns-in-cpp");
		expect(course).not.toBeNull();
		const corpus = allCourseText(course);

		expect(corpus).not.toMatch(/This section covers/i);
		expect(corpus).not.toMatch(/Key idea:/i);
		expect(corpus).not.toMatch(/Skill target:/i);
		expect(corpus).not.toMatch(/Practice target:/i);
		expect(corpus).not.toMatch(/The goal is to/i);
		expect(corpus).not.toMatch(/\bsupplemental [23]\b/i);
		expect(corpus).not.toMatch(/\bImplementation Lab\b/i);
		expect(corpus).not.toMatch(/\bshould\b/i);
		expect(corpus).toContain(
			"This makes medium-sized C++ structure feel normal"
		);
		expect(corpus).toContain("Lifetime is part of architecture in C++");
		expect(corpus).toContain(
			"The design question is when an interface clarifies a seam"
		);
		expect(corpus).toContain("Build Tooling Transfer Practice");
		expect(corpus).toContain("Modern Ownership Transfer Practice");
		expect(corpus).toContain("Creation Pattern Transfer Practice");
		expect(corpus).toContain("Observer Event Transfer Practice");
		expect(corpus).toContain("RAII Wrapper Transfer Practice");
		expect(corpus).toContain(
			"Pattern Lab 14: Ownership-Aware Refactor Studio"
		);
		expect(corpus).toContain("Ownership-Aware Refactor Concepts");
		expect(corpus).toContain("Pattern Lab 16: Structural Boundary Studio");
		expect(corpus).toContain("Pattern Lab 17: Refactoring Capstone Studio");
		expect(corpus).toContain("Refactoring Capstone Extension Practice");
	});

	it("keeps Python to Java and C++ Bridge labels transition-specific", async () => {
		const course = await loadRawCourse("python-to-java-and-cpp-bridge");
		expect(course).not.toBeNull();
		const corpus = allCourseText(course);

		expect(corpus).not.toMatch(/This section covers/i);
		expect(corpus).not.toMatch(/Key idea:/i);
		expect(corpus).not.toMatch(/Skill target:/i);
		expect(corpus).not.toMatch(/Practice target:/i);
		expect(corpus).not.toMatch(/The goal is to/i);
		expect(corpus).not.toMatch(/\bsupplemental [23]\b/i);
		expect(corpus).not.toMatch(/\bImplementation Lab\b/i);
		expect(corpus).toContain(
			"Compiler errors are structured feedback rather than evidence that the language is hostile"
		);
		expect(corpus).toContain("Workflow Translation Extension Practice");
		expect(corpus).toContain("Function Signature Transfer Practice");
		expect(corpus).toContain("Collection Indexing Transfer Practice");
		expect(corpus).toContain("Java Scanner Transfer Practice");
		expect(corpus).toContain("C++ Vector Extension Practice");
		expect(corpus).toContain(
			"Language Bridge Lab 11: Compile-Run Comparison Studio"
		);
		expect(corpus).toContain(
			"Language Bridge Lab 13: Collection Porting Studio"
		);
		expect(corpus).toContain(
			"Language Bridge Lab 17: Bridge Capstone Port Studio"
		);
		expect(corpus).toContain("Graphics Translation Studio");
		expect(corpus).toContain("C Foundations Transfer Studio");
	});

	it("keeps Low-Level Security Part 1 defensive and specifically labeled", async () => {
		const course = await loadRawCourse("low-level-security");
		expect(course).not.toBeNull();
		const corpus = allCourseText(course);

		expect(corpus).not.toMatch(/This section covers/i);
		expect(corpus).not.toMatch(/Key idea:/i);
		expect(corpus).not.toMatch(/Skill target:/i);
		expect(corpus).not.toMatch(/Practice target:/i);
		expect(corpus).not.toMatch(/The goal is to/i);
		expect(corpus).not.toMatch(/\bsupplemental [23]\b/i);
		expect(corpus).not.toMatch(/\bImplementation Lab\b/i);
		expect(corpus).not.toMatch(/Offensive Security Lab/i);
		expect(corpus).not.toContain(
			"Build the baseline lab first: reproduce the intended behavior, document the local boundary"
		);
		expect(corpus).not.toContain(
			"Begin with the protected asset, the trust boundary, the unsafe assumption"
		);
		expect(corpus).not.toContain(
			"Keep the work defensive and local. A strong concept note identifies"
		);
		expect(corpus).not.toContain(
			"Finish by naming one remaining limitation without expanding beyond the provided local lab"
		);
		expect(corpus).toContain(
			"Bug-finding starts by creating test inputs designed for rejection"
		);
		expect(corpus).toContain("Memory Layout Transfer Practice");
		expect(corpus).toContain("Parser Hardening Transfer Practice");
		expect(corpus).toContain("Patch Review Transfer Practice");
		expect(corpus).not.toContain("Defensive Exploitability Triage Studio");
		expect(corpus).not.toContain("Defensive Hardening Audit Studio");
		expect(corpus).toContain(
			"Low-Level Security Lab 7: Sanitizer Triage Studio"
		);
		expect(corpus).toContain(
			"Build the **Low-Level Security Lab 7: Sanitizer Triage Studio** baseline first"
		);
		expect(corpus).toContain(
			"Low-Level Security Lab 9: Binary Parser Hardening Studio"
		);
		expect(corpus).toContain(
			"Low-Level Security Lab 12: Patch Review Handoff Studio"
		);
		expect(corpus).toContain(
			"Finish **Low-Level Security Lab 12: Patch Review Handoff Studio** by naming one remaining limitation"
		);
	});

	it("keeps Low-Level Security Part 2 defensive and specifically labeled", async () => {
		const course = await loadRawCourse("low-level-security-part-2");
		expect(course).not.toBeNull();
		const corpus = allCourseText(course);

		expect(corpus).not.toMatch(/This section covers/i);
		expect(corpus).not.toMatch(/Key idea:/i);
		expect(corpus).not.toMatch(/Skill target:/i);
		expect(corpus).not.toMatch(/The goal is to/i);
		expect(corpus).not.toMatch(/\bsupplemental [23]\b/i);
		expect(corpus).not.toMatch(/\bImplementation Lab\b/i);
		expect(corpus).not.toContain(
			"Build the baseline lab first: reproduce the intended behavior, document the local boundary"
		);
		expect(corpus).not.toContain(
			"Begin with the protected asset, the trust boundary, the unsafe assumption"
		);
		expect(corpus).not.toContain(
			"Keep the work defensive and local. A strong concept note identifies"
		);
		expect(corpus).not.toContain(
			"Finish by naming one remaining limitation without expanding beyond the provided local lab"
		);
		expect(corpus).toContain(
			"Exploitability triage is a disciplined decision process"
		);
		expect(corpus).toContain(
			"Common mitigations are factors that change exploitability analysis"
		);
		expect(corpus).toContain(
			"Low Level Security Part 2 Setup Transfer Practice"
		);
		expect(corpus).toContain("Stack Corruption Transfer Practice");
		expect(corpus).toContain("Patch Workflow Extension Practice");
		expect(corpus).toContain(
			"Low-Level Security Lab 13: Exploitability Triage Studio"
		);
		expect(corpus).toContain(
			"Build the **Low-Level Security Lab 13: Exploitability Triage Studio** baseline first"
		);
		expect(corpus).toContain(
			"Low-Level Security Lab 14: Stack Corruption Hardening Studio"
		);
		expect(corpus).toContain(
			"Low-Level Security Lab 17: Defensive Audit Capstone Studio"
		);
		expect(corpus).toContain(
			"Finish **Low-Level Security Lab 17: Defensive Audit Capstone Studio** by naming one remaining limitation"
		);
		expect(corpus).toContain("Defensive Audit Extension Practice");

		const auditPacket = findItem(
			course!,
			/Deliver an Audit Packet and Mitigation Summary/
		);
		expect(auditPacket.content).toContain(
			"findings ranked by impact, attacker assumptions"
		);
		expect(auditPacket.content).toContain(
			"safe security analysis with local-only test fixtures"
		);
		expect(auditPacket.content).not.toMatch(
			/hosts, addresses, ports, routes, protocols/i
		);
		expect(auditPacket.content).not.toMatch(/packet\/service evidence/i);
		expect(auditPacket.content).not.toMatch(
			/packet, port, DNS, route, or service result/i
		);
	});

	it("keeps Linux Systems guidance operational and specific", async () => {
		const course = await loadRawCourse("linux-systems");
		expect(course).not.toBeNull();
		const corpus = allCourseText(course);

		expect(corpus).not.toMatch(/This section covers/i);
		expect(corpus).not.toMatch(/Key idea:/i);
		expect(corpus).not.toMatch(/Skill target:/i);
		expect(corpus).not.toMatch(/The goal is to/i);
		expect(corpus).not.toMatch(/\bsupplemental [23]\b/i);
		expect(corpus).not.toMatch(/\bImplementation Lab\b/i);
		expect(corpus).not.toMatch(/\bshould\b/i);
		expect(corpus).toContain(
			"`grep`, `find`, `rg`, `sort`, `uniq`, `wc`, and `xargs` work as a family"
		);
		expect(corpus).toContain(
			"File permissions and directory permissions behave differently"
		);
		expect(corpus).toContain(
			"`journalctl` is the central way to read systemd-managed service output"
		);
		expect(corpus).toContain("Shell Pipeline Transfer Practice");
		expect(corpus).toContain("systemd Service Transfer Practice");
		expect(corpus).toContain("Backup Reliability Extension Practice");
		expect(corpus).toContain(
			"Linux Systems Lab 14: Service Deployment Studio"
		);
		expect(corpus).toContain(
			"Linux Systems Lab 15: Automation and Observability Studio"
		);
		expect(corpus).toContain(
			"Linux Systems Lab 16: Backup Recovery Studio"
		);
		expect(corpus).toContain(
			"Linux Systems Lab 17: Operations Capstone Studio"
		);
		expect(corpus).toContain("Operations Capstone Extension Practice");
	});

	it("keeps Web Development Foundations guidance specific", async () => {
		const course = await loadRawCourse("web-development-foundations");
		expect(course).not.toBeNull();
		const corpus = allCourseText(course);
		const source = fs.readFileSync(
			"src/stores/courses/web-development-foundations.ts",
			"utf8"
		);

		expect(corpus).not.toMatch(/This section covers/i);
		expect(corpus).not.toMatch(/Key idea:/i);
		expect(corpus).not.toMatch(/Skill target:/i);
		expect(corpus).not.toMatch(/The goal is to/i);
		expect(source).not.toMatch(/should include/i);
		expect(source).not.toMatch(/\bsupplemental [23]\b/i);
		expect(source).not.toMatch(/\bshould\b/i);
		expect(source).not.toContain("local dev server`");
		expect(corpus).toContain(
			"browser devtools, Git/GitHub basics, npm, and project layout need to become recurring strands"
		);
		expect(corpus).toContain(
			"Environment variables are configuration boundaries"
		);
		expect(corpus).toContain(
			"DNS and domain routing are the networking layer"
		);
		expect(corpus).toContain("The expanded path has four main goals");
		expect(corpus).toContain(
			"Browser fundamentals remain the technical base"
		);
		expect(corpus).toContain(
			"Web Development Foundations Setup Transfer Practice"
		);
		expect(corpus).toContain("Course Path Transfer Practice");
		expect(corpus).toContain("JavaScript Bridge Transfer Practice");
		expect(corpus).toContain("Web Foundations Transfer Practice");
		expect(corpus).toContain("Feature Slice Transfer Practice");
		expect(corpus).toContain("Full Stack Web Lab 14: Feature Slice Studio");
		expect(corpus).toContain(
			"Full Stack Web Lab 15: API Integration Studio"
		);
		expect(corpus).toContain(
			"Full Stack Web Lab 16: Data Persistence Studio"
		);
		expect(corpus).toContain(
			"Full Stack Web Lab 17: Deployment Readiness Studio"
		);
		expect(corpus).toContain("Deployment Readiness Extension Practice");
		expect(corpus).not.toMatch(/\bsupplemental [23]\b/i);
		expect(corpus).not.toMatch(/\bImplementation Lab\b/i);
	});

	it("keeps Network Systems IPv6 projects distinct and clearly named", async () => {
		const course = await loadRawCourse("network-systems");
		expect(course).not.toBeNull();

		const module = course!.modules.find(
			module => module.title === "Unit 8: IPv6 in Practice"
		);
		expect(module).toBeDefined();
		if (!module) return;

		const projectItems = [
			...module.curriculum.filter(item =>
				item.title.includes("Core Project")
			),
			...module.supplementalProjects.filter(item =>
				/^(?:IPv6 Transfer Practice|IPv6 Extension Practice)$/.test(
					item.title
				)
			)
		];

		expect(projectItems.map(item => item.title)).toEqual([
			"IPv6 Diagnostics Core Project",
			"IPv6 Transfer Practice",
			"IPv6 Extension Practice"
		]);
		expect(new Set(projectItems.map(item => item.content)).size).toBe(3);
		expect(projectItems[0].content).toContain("First version");
		expect(projectItems[1].content).toContain("Transfer Practice");
		expect(projectItems[2].content).toContain("Extension Practice");
	});

	it("keeps AI, data, and machine learning applied labs from regressing to generated filler", () => {
		const sourcePaths = [
			"src/stores/courses/ai-level-1.ts",
			"src/stores/courses/data-science-in-python.ts",
			"src/stores/courses/machine-learning.ts"
		];
		const corpus = sourcePaths
			.map(path => fs.readFileSync(path, "utf8"))
			.join("\n");

		expect(corpus).not.toMatch(/This lab states the target artifact/i);
		expect(corpus).not.toMatch(
			/A representative .* example names the key inputs/i
		);
		expect(corpus).not.toMatch(/Build one complete artifact first/i);
		expect(corpus).not.toMatch(
			/Extend the core build with one extra requirement/i
		);
		expect(corpus).not.toMatch(/\(COPY\)/i);
		expect(corpus).not.toContain("ai search lab");
		expect(corpus).not.toContain("data analysis lab");
		expect(corpus).not.toMatch(
			/Data Analysis Lab 1[1-7]: Implementation Lab/
		);
		expect(corpus).not.toMatch(/Data Analysis Lab 1[1-7] supplemental/i);
		expect(corpus).not.toMatch(
			/KNN Car Classification: Implementation Lab/
		);
		expect(corpus).not.toMatch(/KNN Car Classification supplemental/i);
		expect(corpus).toContain("AI Search Lab 13: Practice Studio");
		expect(corpus).toContain("Data Analysis Lab 11: Practice Studio");
		expect(corpus).toContain("Data Analysis Lab 17 Extension Practice");
		expect(corpus).toContain("The Marble Game AI");
		expect(corpus).toContain("KNN Car Classification: Practice Studio");
		expect(corpus).toContain("KNN Car Classification Extension Practice");
		expect(corpus).toContain("buildImplementationLabGuidance");
	});

	it("keeps Data Science applied studios named and distinct in the loaded course", async () => {
		const course = await loadRawCourse("data-science-in-python");
		expect(course).not.toBeNull();
		const corpus = allCourseText(course);

		expect(corpus).not.toMatch(
			/Data Analysis Lab 1[1-7]: Implementation Lab/
		);
		expect(corpus).not.toMatch(/Data Analysis Lab 1[1-7]: Practice Studio/);
		expect(corpus).not.toMatch(/complete build-and-review sequence/i);
		expect(corpus).not.toMatch(/open-ended placeholder/i);
		expect(corpus).not.toMatch(/vague enrichment/i);

		const expectedModules = [
			"CSV Summaries and Sanity Checks",
			"Cleaning Missing and Invalid Rows",
			"Grouped Summaries by Category",
			"Visualization Choice and Chart Integrity",
			"Reproducible Mini Reports",
			"Lightweight Dashboards and Filters",
			"Capstone Data Story Readiness"
		];

		for (const expectedModule of expectedModules) {
			expect(
				course!.modules.some(module =>
					module.title.includes(expectedModule)
				),
				expectedModule
			).toBe(true);
		}

		for (const expectedItemTitle of [
			"CSV Summary Builder",
			"Min-Max and Outlier Extension",
			"Median and Mode Practice",
			"Cleaning Report Builder",
			"Chart Integrity Build",
			"Filtered Summary Export",
			"Capstone Readiness Brief",
			"Capstone Scope Review"
		]) {
			expect(
				allCourseItemTitles(course!).some(({ title }) =>
					title.includes(expectedItemTitle)
				),
				expectedItemTitle
			).toBe(true);
		}
		expect(
			allCourseItemTitles(course!).filter(
				({ title }) => title === "Review and Reflection"
			)
		).toEqual([]);

		for (const phrase of [
			"empty-dataset behavior",
			"Cleaning is an analytical decision",
			"Grouped summaries answer different questions",
			"A chart is an argument",
			"rerun the analysis",
			"A dashboard is useful",
			"A capstone data story begins"
		]) {
			expect(corpus).toContain(phrase);
		}
	});

	it("keeps visible implementation-lab course sources free of generated filler", () => {
		const corpus = visibleCourseSourceCorpus();

		expect(corpus).not.toMatch(/This lab states the target artifact/i);
		expect(corpus).not.toMatch(
			/A representative .* example names the key inputs/i
		);
		expect(corpus).not.toMatch(/Build one complete artifact first/i);
		expect(corpus).not.toMatch(
			/Extend the core build with one extra requirement/i
		);
		expect(corpus).not.toMatch(/java foundations build/);
		expect(corpus).not.toMatch(/c algorithm lab/);
		expect(corpus).not.toMatch(/pattern implementation lab/);
		expect(corpus).not.toMatch(/refactoring clinic/);
		expect(corpus).not.toMatch(/language bridge lab/);
		expect(corpus).not.toMatch(/title:\s*"images:/);
		expect(corpus).not.toMatch(/PyGames\/tree\/main\/[^"\n]* /);
	});

	it("keeps visible support sections from regressing to generic filler", () => {
		const corpus = visibleCourseSourceCorpus();

		expect(corpus).not.toMatch(
			/Focus on common mistakes (?:that appear )?in? ?[^.]+\. Diagnose a broken attempt, repair it, and explain why the fix works\./
		);
		expect(corpus).not.toMatch(
			/Break [^.]+ into smaller steps, name the moving pieces, and justify the order in which a clean implementation or solution should be built\./
		);
		expect(corpus).not.toMatch(
			/Finish [^.]+ with a concise review of the required output, one alternate approach, and one specific improvement for a later revision\./
		);
		expect(corpus).not.toMatch(
			/Extend the work from [^.]+ with a tighter constraint, one extra feature, or a slightly more realistic input case\./
		);
		expect(corpus).toContain("buildSupportSectionGuidance");
		expect(corpus).toContain(
			"is planned as a sequence of runnable checkpoints"
		);
		expect(corpus).toContain("ends with a concrete verification pass");
		expect(corpus).toContain(
			"compares the expected result with what actually happened"
		);
		expect(corpus).toContain("extends the ${courseFamily} work");
	});

	it(
		"keeps linked course projects from loading as blank placeholder cards",
		async () => {
			const courses = await loadedCatalogCourseList();
			const linkedItems = courses.flatMap(course =>
				course.modules.flatMap(module =>
					[
						...module.curriculum,
						...module.supplementalProjects
					].filter(item => item.projectLink || item.solutionLink)
				)
			);

			expect(linkedItems.length).toBeGreaterThan(0);

			for (const item of linkedItems) {
				expect(item.content.trim(), item.title).not.toBe("");
				expect(item.content, item.title).not.toMatch(
					/Use the linked starter as a starting point/i
				);
			}
		},
		COURSE_SWEEP_TIMEOUT
	);

	it(
		"keeps Java graphics code links on the source repository",
		async () => {
			const links = (await loadedCatalogCourses()).flatMap(
				({ course, entry }) => courseItemLinks(entry.id, course)
			);
			const legacyJavaGraphicsLinks = links.filter(({ link }) =>
				/^https:\/\/static\.junilearning\.com\/java1\/.+\.java$/i.test(
					link
				)
			);
			const expectedSourceLinks = [
				"graphics/JS2_Basic_Shapes.java",
				"graphics/JS2_Happy_Graphics.java",
				"graphics/JS3_Which_Shape.java",
				"graphics/JS4_Paintball.java",
				"graphics/JS6_Picasso.java"
			];

			expect(legacyJavaGraphicsLinks).toEqual([]);
			for (const sourcePath of expectedSourceLinks) {
				expect(
					links.some(
						({ link }) =>
							link ===
							`https://github.com/instruction-material/Java-Level-1/blob/main/${sourcePath}`
					),
					sourcePath
				).toBe(true);
			}
		},
		COURSE_SWEEP_TIMEOUT
	);

	it(
		"hides broad PyGames repo root pairs while preserving specific source folders",
		async () => {
			const pyGamesCourse = await loadRawCourse("pygames");
			expect(pyGamesCourse).not.toBeNull();
			if (!pyGamesCourse) return;

			const root =
				"https://github.com/instruction-material/PyGames/tree/main";
			const allItems = pyGamesCourse.modules.flatMap(module => [
				...module.curriculum,
				...module.supplementalProjects
			]);
			const broadRootPairs = allItems
				.filter(
					item =>
						item.projectLink === root && item.solutionLink === root
				)
				.map(item => item.title);
			const generatedPracticeItem = allItems.find(
				item =>
					item.projectLink?.includes(
						"/PG-03-pyg1-object-oriented-programming-actors-supplemental-2/starter"
					) &&
					item.solutionLink?.includes(
						"/PG-03-pyg1-object-oriented-programming-actors-supplemental-2/solution"
					)
			);
			const assetFolderItems = allItems.filter(item =>
				[root + "/music", root + "/sounds", root + "/images"].includes(
					item.projectLink ?? ""
				)
			);

			expect(broadRootPairs).toEqual([]);
			expect(generatedPracticeItem?.title).toBe(
				"Object Oriented Programming: Actors Transfer Practice"
			);
			expect(assetFolderItems.length).toBeGreaterThan(0);
			expect(
				assetFolderItems.every(item => item.solutionLink === undefined)
			).toBe(true);
		},
		COURSE_SWEEP_TIMEOUT
	);

	it(
		"does not expose identical project and solution resources",
		async () => {
			const duplicateSolutionLinks = (
				await loadedCatalogCourses()
			).flatMap(({ course, entry }) =>
				course.modules.flatMap(module =>
					[
						...module.curriculum,
						...module.supplementalProjects
					].flatMap(item => {
						const projectLink = item.projectLink?.trim();
						const solutionLink = item.solutionLink?.trim();
						return projectLink && solutionLink === projectLink
							? [
									`${entry.id} / ${module.title} / ${item.title}: ${projectLink}`
								]
							: [];
					})
				)
			);

			expect(duplicateSolutionLinks).toEqual([]);
		},
		COURSE_SWEEP_TIMEOUT
	);

	it(
		"keeps course source links migrated away from Replit and anchored to course-owned GitHub repos",
		async () => {
			const links = (await loadedCatalogCourses()).flatMap(
				({ course, entry }) => courseItemLinks(entry.id, course)
			);
			const courseText = await loadedCatalogText();
			const legacyReplitPatterns = [
				/repl\.it/i,
				/replit\.com/i,
				/skipMigration/i,
				/@JuniLearning/i
			];
			const legacyLinkHits = links
				.filter(({ link }) =>
					legacyReplitPatterns.some(pattern => pattern.test(link))
				)
				.map(
					({ course, module, item, link }) =>
						`${course} / ${module} / ${item}: ${link}`
				);
			const malformedGithubLinks: string[] = [];
			const externalGithubLinks: string[] = [];
			const staleBranchLinks: string[] = [];
			const githubLinks = links.filter(
				({ kind, link }) =>
					(kind === "projectLink" || kind === "solutionLink") &&
					isGitHubUrl(link)
			);

			for (const pattern of legacyReplitPatterns) {
				expect(courseText).not.toMatch(pattern);
			}
			expect(legacyLinkHits).toEqual([]);
			expect(githubLinks.length).toBeGreaterThan(0);

			for (const { course, module, item, link } of githubLinks) {
				const label = `${course} / ${module} / ${item}: ${link}`;
				let parsed: URL;

				try {
					parsed = new URL(link);
				} catch {
					malformedGithubLinks.push(label);
					continue;
				}

				const pathParts = parsed.pathname.split("/").filter(Boolean);
				if (pathParts.length < 2) {
					malformedGithubLinks.push(label);
					continue;
				}

				if (pathParts[0] !== "instruction-material") {
					externalGithubLinks.push(label);
				}

				const mode = pathParts[2];
				const branch = pathParts[3];
				if (
					(mode === "tree" || mode === "blob") &&
					branch &&
					!["main", "master"].includes(branch)
				) {
					staleBranchLinks.push(label);
				}
			}

			expect(malformedGithubLinks).toEqual([]);
			expect(externalGithubLinks).toEqual([]);
			expect(staleBranchLinks).toEqual([]);
		},
		COURSE_SWEEP_TIMEOUT
	);

	it(
		"keeps loaded course module and item titles unique within their visible scope",
		async () => {
			const duplicateLabels: string[] = [];

			for (const entry of courseCatalog) {
				const course = await loadRawCourse(entry.id);
				expect(course, entry.id).not.toBeNull();
				if (!course) continue;

				const moduleTitleCounts = new Map<string, number>();
				for (const module of course.modules) {
					const title = module.title.trim();
					moduleTitleCounts.set(
						title,
						(moduleTitleCounts.get(title) ?? 0) + 1
					);

					const itemTitleCounts = new Map<string, number>();
					for (const item of [
						...module.curriculum,
						...module.supplementalProjects
					]) {
						const itemTitle = item.title.trim();
						itemTitleCounts.set(
							itemTitle,
							(itemTitleCounts.get(itemTitle) ?? 0) + 1
						);
					}

					for (const [itemTitle, count] of itemTitleCounts) {
						if (count > 1) {
							duplicateLabels.push(
								`${entry.id} / ${module.title} / ${itemTitle} (${count})`
							);
						}
					}
				}

				for (const [moduleTitle, count] of moduleTitleCounts) {
					if (count > 1) {
						duplicateLabels.push(
							`${entry.id} / ${moduleTitle} (${count})`
						);
					}
				}
			}

			expect(duplicateLabels).toEqual([]);
		},
		COURSE_SWEEP_TIMEOUT
	);

	it(
		"keeps loaded course titles concise and generated math support grammar neutral",
		async () => {
			const longItemTitles: string[] = [];
			const redundantGenericTitles: string[] = [];
			const nestedBoldProjectGoals: string[] = [];
			const nestedBoldStudioGoals: string[] = [];
			const repeatedStudioTitles: string[] = [];
			const studioParentheticalResidue: string[] = [];
			const studioArticleGrammarResidue: string[] = [];
			const genericFocusedPracticeTitles: string[] = [];
			const genericExtensionProjectTitles: string[] = [];
			const exactGenericSectionTitles: string[] = [];
			const repeatedWords: string[] = [];
			const courses = await loadedCatalogCourseList();
			const corpus = await loadedCatalogText();
			const genericTitleSuffix =
				/(?:Applied Challenge|Core Project|Debugging and Failure Modes|Diagnostic Checkpoint|Extension Challenge|Fluency Drill|Focused Practice|Modeling or Error Analysis|Open-Ended Variant|Planning and Architecture|Standards Practice Set|Supplemental(?: Project| Practice)? [23]|Verification and Reflection)$/i;
			const genericColonTitlePattern =
				/^.+:\s*(?:Applied Challenge|Core Project|Extension Challenge|Supplemental(?: Project| Practice)? [2-9])$/i;
			const stackedGeneratedTitlePattern =
				/\b(?:Supplemental Project \d+:\s*)?(?:Project|Practice|Extension|Transfer)\s*:\s*[^:]{15,}:\s*[^:]{15,}/i;
			const generatedSupplementalResiduePattern =
				/\bsupplemental\s+[2-9]\b/i;
			const nestedBoldProjectGoalPattern =
				/\*\*Goal:\*\*\s+\*\*[^*\n]{1,180}\*\*/;
			const nestedBoldStudioGoalPattern =
				/\*\*(?:Applied studio|Applied lab):\*\*\s+\*\*[^*\n]{1,180}\*\*/;
			const repeatedWordPattern = /\b([A-Za-z][A-Za-z-]{3,})\s+\1\b/i;

			for (const [courseIndex, course] of courses.entries()) {
				expect(course, courseCatalog[courseIndex].id).not.toBeNull();
				if (!course) continue;

				for (const module of course.modules) {
					for (const item of [
						...module.curriculum,
						...module.supplementalProjects
					]) {
						if (item.title.length > 96) {
							longItemTitles.push(
								`${courseCatalog[courseIndex].id} / ${module.title} / ${item.title}`
							);
						}
						if (
							item.title
								.toLowerCase()
								.includes(module.title.toLowerCase()) &&
							item.title.length > 55
						) {
							redundantGenericTitles.push(
								`${courseCatalog[courseIndex].id} / ${module.title} / ${item.title}`
							);
						}
						if (item.title === "Focused Practice") {
							genericFocusedPracticeTitles.push(
								`${courseCatalog[courseIndex].id} / ${module.title} / ${item.title}`
							);
						}
						if (item.title === "Extension Project") {
							genericExtensionProjectTitles.push(
								`${courseCatalog[courseIndex].id} / ${module.title} / ${item.title}`
							);
						}
						if (
							/^(?:Application Check|Changed-Case Review|Concept Path|Core Concepts|Build Requirements|Common Bug Patterns|Data Variation Practice|Diagnostic Checkpoint|Failure Modes|Graph, Diagram, or Data Exercise|Interaction Variation|Project Brief|Reflection and Transfer Practice|State and Contract Practice|Trace and Boundary Case|Transfer Practice|Worked Example)$/i.test(
								item.title
							) ||
							/^(?:Maps|Using a Java Map|Conditionals|For Loops|While Loops|Stacks)$/i.test(
								item.title
							) ||
							/^(?:Review Targets|Representative Review Problems)$/i.test(
								item.title
							) ||
							/^(?:Course Recap|Master Project Presentation)$/i.test(
								item.title
							) ||
							/^Checkpoint:\s*Trace the Project State$/i.test(
								item.title
							) ||
							/^Check-In\s+#?\d+\s+(?:Overview|Core Concepts|Extension Challenge)$/i.test(
								item.title
							) ||
							/^Check-In\s+#?\d+:\s+Additional Practice Project$/i.test(
								item.title
							) ||
							/^Master Project (?:Transfer Practice|Extension Practice)$/i.test(
								item.title
							) ||
							/^Setup and Tooling (?:Transfer Practice|Extension Practice)$/i.test(
								item.title
							) ||
							/^Extension Challenge:\s*Check-In\s+\d+$/i.test(
								item.title
							)
						) {
							exactGenericSectionTitles.push(
								`${courseCatalog[courseIndex].id} / ${module.title} / ${item.title}`
							);
						}
						if (
							genericTitleSuffix.test(item.title) &&
							(item.title.startsWith(`${module.title}:`) ||
								item.title.startsWith(
									`${course.name}: ${module.title}`
								))
						) {
							redundantGenericTitles.push(
								`${courseCatalog[courseIndex].id} / ${module.title} / ${item.title}`
							);
						}
						if (
							genericColonTitlePattern.test(item.title) ||
							stackedGeneratedTitlePattern.test(item.title) ||
							generatedSupplementalResiduePattern.test(item.title)
						) {
							redundantGenericTitles.push(
								`${courseCatalog[courseIndex].id} / ${module.title} / ${item.title}`
							);
						}
						if (nestedBoldProjectGoalPattern.test(item.content)) {
							nestedBoldProjectGoals.push(
								`${courseCatalog[courseIndex].id} / ${module.title} / ${item.title}`
							);
						}
						if (nestedBoldStudioGoalPattern.test(item.content)) {
							nestedBoldStudioGoals.push(
								`${courseCatalog[courseIndex].id} / ${module.title} / ${item.title}`
							);
						}
						if (
							/^\*\*(?:Applied studio|Applied lab):/i.test(
								item.content
							)
						) {
							const escapedItemTitle = item.title.replace(
								/[.*+?^${}()|[\]\\]/g,
								"\\$&"
							);
							const repeatCount = (
								item.content.match(
									new RegExp(escapedItemTitle, "g")
								) ?? []
							).length;
							if (repeatCount > 1) {
								repeatedStudioTitles.push(
									`${courseCatalog[courseIndex].id} / ${module.title} / ${item.title} (${repeatCount})`
								);
							}
							if (
								/the (?:studio|lab) \([^)]{3,80}\)/i.test(
									item.content
								)
							) {
								studioParentheticalResidue.push(
									`${courseCatalog[courseIndex].id} / ${module.title} / ${item.title}`
								);
							}
							const awkwardStudioGrammar = item.content.match(
								/\b(?:smallest complete|minimum working|complete) the (?:studio|lab)(?: artifact)?\b/i
							);
							if (awkwardStudioGrammar) {
								studioArticleGrammarResidue.push(
									`${courseCatalog[courseIndex].id} / ${module.title} / ${item.title} / ${awkwardStudioGrammar[0]}`
								);
							}
						}
						const repeatedWordMatch =
							item.content.match(repeatedWordPattern);
						if (repeatedWordMatch) {
							repeatedWords.push(
								`${courseCatalog[courseIndex].id} / ${module.title} / ${item.title} / ${repeatedWordMatch[0]}`
							);
						}
					}
				}
			}

			expect(longItemTitles).toEqual([]);
			expect(redundantGenericTitles).toEqual([]);
			expect(nestedBoldProjectGoals).toEqual([]);
			expect(nestedBoldStudioGoals).toEqual([]);
			expect(repeatedStudioTitles).toEqual([]);
			expect(studioParentheticalResidue).toEqual([]);
			expect(studioArticleGrammarResidue).toEqual([]);
			expect(genericFocusedPracticeTitles).toEqual([]);
			expect(genericExtensionProjectTitles).toEqual([]);
			expect(exactGenericSectionTitles).toEqual([]);
			expect(repeatedWords).toEqual([]);
			expect(corpus).not.toMatch(/focused practice checkpoint/i);
			expect(corpus).not.toMatch(/should use the checkpoint/i);
			expect(corpus).not.toMatch(/\bThe checkpoint should\b/i);
			expect(corpus).not.toMatch(/\bmodule idea\b/i);
			expect(corpus).not.toMatch(/\bmodule concept\b/i);
			expect(corpus).not.toMatch(/\btarget concept\b/i);
			expect(corpus).not.toMatch(/\btarget artifact\b/i);
			expect(corpus).not.toMatch(/\bproject selection\b/i);
			expect(corpus).not.toMatch(/\bThe final note should\b/i);
			expect(corpus).not.toMatch(/\bThe final note names\b/i);
			expect(corpus).not.toMatch(/\bThe final note identifies\b/i);
			expect(corpus).not.toMatch(/\bThe extension should\b/i);
			expect(corpus).not.toMatch(/\bThe extension stresses\b/i);
			expect(corpus).not.toMatch(/typical the response example/i);
			expect(corpus).not.toMatch(/the response known values/i);
			expect(corpus).not.toMatch(/the response answer/i);
			expect(corpus).not.toMatch(/the response reason/i);
			expect(corpus).not.toMatch(/\bthe A, B, C, D example\b/i);
			expect(corpus).not.toMatch(/\bThis section for\b/i);
			expect(corpus).not.toMatch(/\*\*Course focus:\*\* This section/i);
			expect(corpus).not.toMatch(
				/\*\*(?:Applied studio|Applied lab):\*\* The (?:studio|lab) produces/i
			);
			expect(corpus).not.toMatch(
				/^Represent the module with at least one graph/im
			);
			expect(corpus).not.toMatch(/\*\*Completion check:\*\*/i);
			expect(corpus).not.toMatch(/\bcore project focus:/i);
			expect(corpus).not.toMatch(/\bRun the local the\b/i);
			expect(corpus).not.toMatch(/\b(?:connectings|mappings)\b/i);
			expect(corpus).not.toMatch(
				/\bThis module focuses on (?:combine|connect|diagnose|map|organize|turn|use)\b/i
			);
			expect(corpus).toContain(
				"**Reference map:** Scratch Level 1 uses these standards"
			);
			expect(corpus).toContain(
				"A polished Scratch game is more than a set of working controls"
			);
			expect(corpus).toContain(
				"Create a representation for Momentum, Impulse, and Collisions with at least one graph"
			);
			expect(corpus).toContain(
				"**Focus:** state representation, actions, goal tests, search strategy"
			);
			expect(corpus).toContain("Work a typical example");
			expect(corpus).toContain("Modeling or Error Analysis");
		},
		COURSE_SWEEP_TIMEOUT
	);

	it("keeps course expansion templates from regenerating instructor-action copy", () => {
		const templateCorpus = [
			"src/stores/courses/course-implementation-artifacts.ts",
			"src/stores/courses/research-expansions.ts"
		]
			.map(path => fs.readFileSync(path, "utf8"))
			.join("\n");
		const normalizerCorpus = fs.readFileSync(
			"src/stores/courses/normalization.ts",
			"utf8"
		);

		expect(templateCorpus).not.toMatch(/\bshould\b/i);
		expect(templateCorpus).not.toMatch(/\bTeach\b/);
		expect(templateCorpus).not.toMatch(/Teach students/i);
		expect(templateCorpus).not.toMatch(/Instructor Note/i);
		expect(templateCorpus).not.toMatch(/\*\*Learning sequence:\*\*/i);
		expect(templateCorpus).not.toMatch(/\*\*Completion check:\*\*/i);
		expect(templateCorpus).not.toMatch(/\bUse .* supplemental projects\b/i);
		expect(templateCorpus).not.toMatch(/\bparent-managed\b/i);
		expect(templateCorpus).not.toMatch(/\bparent-supervised\b/i);
		expect(templateCorpus).not.toMatch(/\bfast-track learner should\b/i);
		expect(templateCorpus).not.toMatch(/\bEvery grade band should\b/i);
		expect(templateCorpus).not.toMatch(/\bplaceholder assets\b/i);
		expect(templateCorpus).not.toMatch(/\bcore lessons\b/i);
		expect(templateCorpus).not.toMatch(/\bSequence Map\b/i);
		expect(templateCorpus).not.toMatch(/\bStart with a deterministic\b/i);
		expect(templateCorpus).not.toMatch(/\bStart with one plain\b/i);
		expect(normalizerCorpus).toContain(
			"Fast-track placement still requires"
		);
		expect(normalizerCorpus).not.toContain(
			"A fast-track learner demonstrates"
		);
	});

	it("adds project requirements and completion checks to thin legacy Python project prompts", async () => {
		const course = await loadRawCourse("python-level-2");
		expect(course).not.toBeNull();

		const calendarMachine = findItem(course!, /Calendar Machine/);

		expect(calendarMachine.content).toContain("**Goal:**");
		expect(calendarMachine.content).toContain("**Outcome:**");
		expect(calendarMachine.content).toContain("Test zero days");
		expect(calendarMachine.content).toContain("**Checkpoints:**");
	});

	it("keeps Python Level 2 project outcomes and verification project-specific", async () => {
		const course = await loadRawCourse("python-level-2");
		expect(course).not.toBeNull();
		const corpus = allCourseText(course!);

		expect(corpus).not.toContain(
			"The finished project proves the goal with a normal run"
		);
		expect(corpus).not.toContain(
			"Save or describe at least two sample runs"
		);

		const madLibs = findItem(course!, /Mad Libs/);
		expect(madLibs.content).toContain(
			"The finished project is complete when the story includes every requested word"
		);
		expect(madLibs.content).toContain(
			"The stress case is tied to this project check: The explanation can trace one input prompt through to the final printed sentence"
		);

		const changeMachine = findItem(course!, /Change Machine/);
		expect(changeMachine.content).toContain(
			"Boundary cases such as 0, 4, 5, 10, 25, and 99 cents are tested"
		);
	});

	it(
		"keeps visible course cards above the thin-content floor",
		async () => {
			const thinItems = (await loadedCatalogCourses()).flatMap(
				({ course, entry }) =>
					(course?.modules ?? [])
						.filter(module => module.kind !== "appendix")
						.flatMap(module =>
							[
								...module.curriculum,
								...module.supplementalProjects
							]
								.filter(item => wordCount(item.content) < 80)
								.map(
									item =>
										`${entry.id} / ${module.title} / ${item.title} / ${wordCount(item.content)} words`
								)
						)
			);

			expect(thinItems).toEqual([]);
		},
		COURSE_SWEEP_TIMEOUT
	);

	it(
		"keeps short project-like items backed by review structure",
		async () => {
			const courses = (await loadedCatalogCourses()).map(
				({ course, entry }) => ({
					course,
					id: entry.id
				})
			);
			const reviewStructurePattern =
				/\*\*(?:Outcome|Required outcome|Success criteria|Completion checks|Completion evidence|Checkpoints|Extension):\*\*/i;
			const scratchSupportStructurePattern =
				/\*\*Fluency goal:\*\*[\s\S]+\*\*Practice path:\*\*[\s\S]+\*\*Checkpoint:\*\*|\*\*Variant goal:\*\*[\s\S]+\*\*Design path:\*\*[\s\S]+\*\*Verification:\*\*/i;
			const weakItems = courses.flatMap(({ id, course }) =>
				(course?.modules ?? []).flatMap(module =>
					[
						...module.curriculum.map(item => ({
							section: "curriculum",
							item
						})),
						...module.supplementalProjects.map(item => ({
							section: "supplementalProjects",
							item
						}))
					].flatMap(({ section, item }) => {
						const projectLike =
							!isInformationalResourceTitle(item.title) &&
							(isProjectLikeTitle(item.title) ||
								Boolean(item.projectLink || item.solutionLink));
						const shortWithoutReview =
							projectLike &&
							wordCount(item.content) < 95 &&
							!reviewStructurePattern.test(item.content) &&
							!scratchSupportStructurePattern.test(item.content);

						return shortWithoutReview
							? [
									`${id} | ${module.title} | ${section} | ${item.title} | ${wordCount(item.content)} words`
								]
							: [];
					})
				)
			);

			expect(weakItems).toEqual([]);
		},
		COURSE_SWEEP_TIMEOUT
	);

	it(
		"keeps every core module backed by a visible lesson structure",
		async () => {
			const courses = (await loadedCatalogCourses()).map(
				({ course, entry }) => ({
					course,
					id: entry.id
				})
			);
			const missingBackbone = courses.flatMap(({ id, course }) =>
				(course?.modules ?? [])
					.filter(module => module.kind !== "appendix")
					.filter(
						module =>
							!module.curriculum.some(item =>
								lessonBackbonePattern.test(
									`${item.title}\n${item.content}`
								)
							)
					)
					.map(module => `${id} | ${module.title}`)
			);

			expect(missingBackbone, missingBackbone.join("\n")).toEqual([]);
		},
		COURSE_SWEEP_TIMEOUT
	);

	it("preserves structured guidance after UI course-store normalization", async () => {
		const store = useCoursesStore();
		const course = await store.loadCourseById("python-level-2");
		expect(course).not.toBeNull();

		const calendarMachine = findItem(course!, /Calendar Machine/);

		expect(calendarMachine.content).toContain("**Goal:**");
		expect(calendarMachine.content).toContain("**Outcome:**");
		expect(calendarMachine.content.length).toBeGreaterThan(500);
	});

	it("formats grouped lesson arcs as readable ordered markdown lists", async () => {
		const store = useCoursesStore();
		const [
			course,
			scratchCourse,
			scratchLevel2,
			machineLearning,
			aiLevel1
		] = await Promise.all([
			store.loadCourseById("python-level-3"),
			loadRawCourse("scratch-level-1"),
			loadRawCourse("scratch-level-2"),
			loadRawCourse("machine-learning"),
			loadRawCourse("ai-level-1")
		]);
		expect(course).not.toBeNull();
		expect(scratchCourse).not.toBeNull();
		expect(scratchLevel2).not.toBeNull();
		expect(machineLearning).not.toBeNull();
		expect(aiLevel1).not.toBeNull();

		const lessonArc = findItem(
			course!,
			/Core Concepts/,
			/Core topics in this module:/
		);

		expect(lessonArc.content).toMatch(
			/Core topics in this module:\n\n1\. \*\*Introductions & Setup\*\*/
		);
		expect(lessonArc.content).toMatch(/\n2\. \*\*.+\*\*\n\s+/);
		expect(lessonArc.content).not.toMatch(/1\) .+; 2\)/s);
		expect(lessonArc.content).not.toMatch(/This lesson arc covers/i);

		const scratchStudio = scratchCourse!.modules
			.find(module => module.title === "GS15 Debugging and Remix Studio")
			?.curriculum.find(item => /Core Concepts$/i.test(item.title));

		expect(scratchStudio).toBeDefined();
		expect(scratchStudio!.content).toContain("**Studio practice:**");
		expect(scratchStudio!.content).toContain("\n**Checkpoints:**\n-");
		expect(scratchStudio!.content).toMatch(
			/\*\*Extension:\*\* Add one (?:difficulty option|feedback cue|extra play path)/
		);
		expect(scratchStudio!.content).toContain(
			"\n\n2. **Design and Planning Map**"
		);
		expect(scratchStudio!.content).not.toContain(
			"Concept Path (GS15 Debugging and Remix Studio)"
		);
		expect(scratchStudio!.content).not.toMatch(
			/\n \n\n\*\*Checkpoints:\*\*/
		);

		const scratchBridge = scratchCourse!.modules
			.find(module => module.title === "GS17 Scratch-to-Python Bridge")
			?.curriculum.find(item => /Core Concepts$/i.test(item.title));
		expect(scratchBridge).toBeDefined();
		expect(scratchBridge!.content).toContain(
			"Scratch blocks can be translated into text-code ideas"
		);
		expect(scratchBridge!.content).not.toMatch(/\bconnectings\b/i);

		const scratchLevel2Bridge = scratchLevel2!.modules
			.find(
				module => module.title === "GM15 Scratch-to-Python Bridge"
			)
			?.curriculum.find(item => /Core Concepts$/i.test(item.title));
		expect(scratchLevel2Bridge).toBeDefined();
		expect(scratchLevel2Bridge!.content).toContain(
			"Advanced Scratch concepts map directly to Python readiness"
		);
		expect(scratchLevel2Bridge!.content).not.toMatch(/\bmappings\b/i);

		const platformerPal = findItem(scratchLevel2!, /Platformer Pal/);
		expect(platformerPal.content).toMatch(/^1\. Inspect/m);
		expect(platformerPal.content).toMatch(/\n2\. When the green flag/);
		expect(platformerPal.content).not.toMatch(
			/1\. Inspect[^\n]+ 2\. When the green flag/
		);

		const neuralNetworks = machineLearning!.modules
			.find(module => module.title === "ML4 Neural Networks")
			?.curriculum.find(item => /Core Concepts$/i.test(item.title));
		expect(neuralNetworks).toBeDefined();
		expect(neuralNetworks!.content).toContain(
			"A sigmoid graph is useful here because the sigmoid function always returns a value between 0 and 1."
		);
		expect(neuralNetworks!.content).toContain("**Details:**");
		expect(neuralNetworks!.content).not.toMatch(
			/value between 0 and\s+\n\s*\n\s*1\. Some common activation/
		);

		const aiLandscape = aiLevel1!.modules
			.find(
				module =>
					module.title ===
					"Unit 1: AI Landscape and State Representation"
			)
			?.curriculum.find(item => /Core Concepts$/i.test(item.title));
		expect(aiLandscape).toBeDefined();
		expect(aiLandscape!.content).toContain(
			"Strong representations are easy to inspect"
		);
		expect(aiLandscape!.content).toContain(
			"once the necessary information has been identified"
		);
		expect(aiLandscape!.content).not.toMatch(/\bcourse should\b/i);
		expect(aiLandscape!.content).not.toMatch(/\bShow why\b/);
	});

	it("contextualizes generated studio support without repeated generic scaffolding", async () => {
		const [dataScience, scratchLevel1, webDevelopment, lowLevelSecurity] =
			await Promise.all([
				loadRawCourse("data-science-in-python"),
				loadRawCourse("scratch-level-1"),
				loadRawCourse("web-development-foundations"),
				loadRawCourse("low-level-security")
			]);
		expect(dataScience).not.toBeNull();
		expect(scratchLevel1).not.toBeNull();
		expect(webDevelopment).not.toBeNull();
		expect(lowLevelSecurity).not.toBeNull();

		const csvStudio = findItem(
			dataScience!,
			/^CSV Summaries and Sanity Checks Concepts$/,
			/CSV loading, numeric summaries/
		);
		expect(csvStudio.content).toContain(
			"before interpreting the average.\n\n**Expected outcome:**"
		);
		expect(csvStudio.content).toContain(
			"Include one small hand-checkable case before accepting any larger dataset result.\n\n**Result quality:**"
		);
		expect(csvStudio.content).not.toContain(
			"any larger dataset result is accepted.\n\n**Readable output:**"
		);
		expect(csvStudio.content).toContain("**Build steps:**\n-");
		expect(csvStudio.content).toMatch(
			/(dataset or search space|hypothesis, evidence source|data source)/
		);
		expect(csvStudio.content).not.toContain(
			"Define the Concept Path for DSP10"
		);

		const scratchStudio = scratchLevel1!.modules
			.find(module => module.title === "GS15 Debugging and Remix Studio")
			?.curriculum.find(item => /Core Concepts$/i.test(item.title));
		expect(scratchStudio).toBeDefined();
		expect(scratchStudio.content).toContain(
			"Debug path for the studio: reproduce one realistic failure"
		);
		expect(scratchStudio.content).toContain(
			"The studio can be replayed without stale state from the previous run."
		);
		expect(scratchStudio.content).not.toContain(
			"Check Concept Path against the stated success criteria"
		);

		const webStudio = findItem(
			webDevelopment!,
			/API Integration Studio: Core Concepts/
		);
		expect(webStudio.content).toContain(
			"Map the lab UI event to state, rendering, data flow, and the message shown when something goes wrong."
		);
		expect(webStudio.content).toContain(
			"The lab user input, state update, rendered output, and error messaging are all inspectable."
		);
		expect(webStudio.content).not.toContain(
			"smallest the browser-visible path"
		);
		expect(webStudio.content).not.toContain(
			"Name the Full-Stack Web Lab 15 Core Concepts route or component"
		);

		const securityStudio = findItem(
			lowLevelSecurity!,
			/Low-Level Security Lab 9: Core Concepts/
		);
		expect(securityStudio.content).toContain(
			[
				"For **Low-Level Security Lab 9: Binary Parser Hardening Studio**, name the allowed target,",
				"disallowed actions, evidence source, stop condition, and defensive purpose before running commands."
			].join(" ")
		);
		expect(securityStudio.content).not.toContain(
			"For Low-Level Security Lab 9 Core Concepts, state the authorized local lab boundary"
		);

		const corpus = [
			allCourseText(dataScience),
			allCourseText(scratchLevel1),
			allCourseText(webDevelopment),
			allCourseText(lowLevelSecurity)
		].join("\n");
		expect(corpus).not.toContain(
			"- Requirements, evidence, and success criteria are specific enough to review later."
		);
		expect(corpus).not.toContain(
			"- The final note explains what changed, what was proven, and what limitation remains."
		);
	});

	it("keeps refactoring clinics concept-specific instead of repeated design-pattern filler", async () => {
		const course = await loadRawCourse("design-patterns-in-java-part-2");
		expect(course).not.toBeNull();

		const clinicConcepts = [11, 12, 13, 14, 15, 16, 17].map(clinic =>
			findItem(
				course!,
				new RegExp(`Refactoring Clinic ${clinic}: Core Concepts`)
			)
		);

		expect(new Set(clinicConcepts.map(item => item.content)).size).toBe(7);
		expect(clinicConcepts[0].content).toContain("feature envy");
		expect(clinicConcepts[0].content).toContain("Extract Class");
		expect(clinicConcepts[1].content).toContain(
			"Replace Conditional with Polymorphism"
		);
		expect(clinicConcepts[2].content).toContain(
			"Introduce Parameter Object"
		);
		expect(clinicConcepts[3].content).toContain("Replace Temp with Query");
		expect(clinicConcepts[4].content).toContain("Template Method");
		expect(clinicConcepts[5].content).toContain("Null Object");
		expect(clinicConcepts[6].content).toContain("multi-smell sequencing");

		for (const item of clinicConcepts) {
			expect(item.content).not.toContain(
				"object roles, collaboration boundaries, before-and-after coupling"
			);
		}
	});

	it("keeps Design Patterns in Java Part 2 labels practice-oriented", async () => {
		const course = await loadRawCourse("design-patterns-in-java-part-2");
		expect(course).not.toBeNull();

		const source = fs.readFileSync(
			"src/stores/courses/design-patterns-in-java-part-2.ts",
			"utf8"
		);
		const corpus = allCourseText(course);

		expect(source).not.toMatch(/\bImplementation Lab\b/);
		expect(source).not.toMatch(/\bSupplemental [23]\b/);
		expect(source).not.toMatch(/\bThis section covers\b/);
		expect(source).not.toContain("Key idea:");
		expect(source).not.toMatch(/\bMini Lab\b/);
		expect(source).not.toMatch(/\bshould\b/);
		expect(corpus).not.toMatch(/\bImplementation Lab\b/);
		expect(corpus).not.toMatch(/\bSupplemental [23]\b/);
		expect(corpus).not.toMatch(/\bMini Lab\b/);
		expect(corpus).toContain("Refactoring Clinic 11: Practice Studio");
		expect(corpus).toContain("Refactoring Clinic 17 Extension Practice");
		expect(corpus).toContain("Calculation Pipeline Refactor Studio");
		expect(corpus).toContain("Characterization Test Refactor Studio");
		expect(corpus).toContain("Composing Methods Transfer Practice");
		expect(corpus).toContain(
			"Capstone Refactoring Studio Extension Practice"
		);
	});

	it("keeps modern design-pattern projects distinct across core, transfer, and extension work", async () => {
		const course = await loadRawCourse("design-patterns-in-java");
		expect(course).not.toBeNull();

		const module = course!.modules.find(
			module =>
				module.title ===
				"DPJ8 Modern Extensions and Architecture-Level Patterns"
		);
		expect(module).toBeDefined();
		if (!module) return;

		const projectItems = [
			...module.curriculum.filter(item =>
				item.title.includes("Core Project")
			),
			...module.supplementalProjects.filter(item =>
				/\b(?:Transfer|Extension) Practice\b/.test(item.title)
			)
		];

		expect(projectItems).toHaveLength(3);
		expect(new Set(projectItems.map(item => item.content)).size).toBe(3);
		expect(projectItems[0].content).toContain("Java project");
		expect(projectItems[1].title).toContain("Transfer Practice");
		expect(projectItems[1].content).toContain("Transfer Practice");
		expect(projectItems[2].title).toContain("Extension Practice");
		expect(projectItems[2].content).toContain("Extension Practice");
	});

	it("keeps Design Patterns in Java labels pattern-specific", async () => {
		const course = await loadRawCourse("design-patterns-in-java");
		expect(course).not.toBeNull();
		const corpus = allCourseText(course);
		const source = fs.readFileSync(
			"src/stores/courses/design-patterns-in-java.ts",
			"utf8"
		);

		expect(source).not.toMatch(/Pattern Implementation Lab 1[5-7]/);
		expect(source).not.toMatch(/Supplemental [23]/);
		expect(source).not.toMatch(/Implementation Lab/);
		expect(source).not.toMatch(/Key idea:/);
		expect(source).not.toMatch(/\bMini Lab\b/);
		expect(source).not.toMatch(/\bshould\b/);
		expect(corpus).not.toMatch(/\bMini Lab\b/);
		expect(corpus).toContain("Strategy Selection Refactor Studio");
		expect(corpus).toContain("Structural Wrapper Refactor Studio");
		expect(corpus).toContain("Architecture Judgment Capstone Studio");
		expect(corpus).toContain("Brittle Object Model Refactor Studio");
		expect(corpus).toContain(
			"Strategy Selection Refactor Transfer Practice"
		);
		expect(corpus).toContain(
			"Architecture Judgment Capstone Extension Practice"
		);
	});

	it("keeps Java foundation implementation builds tied to distinct source projects", async () => {
		const javaLevel1 = await loadRawCourse("java-level-1");
		expect(javaLevel1).not.toBeNull();

		const concepts = [13, 14, 15, 16, 17].map(build =>
			findItem(
				javaLevel1!,
				new RegExp(`Java Foundations Build ${build}: Core Concepts`)
			)
		);

		expect(new Set(concepts.map(item => item.content)).size).toBe(5);
		expect(concepts[0].content).toContain("even-value filtering");
		expect(concepts[1].content).toContain("threshold comparisons");
		expect(concepts[2].content).toContain("inclusive range checks");
		expect(concepts[3].content).toContain("adjacent list access");
		expect(concepts[4].content).toContain("two-pass list processing");
	});

	it("keeps the Java course sequence anchored to the visual Karel and BlueJ bridge", async () => {
		const [javaLevel1, javaLevel2, javaLevel3, apCsa] = await Promise.all([
			loadRawCourse("java-level-1"),
			loadRawCourse("java-level-2"),
			loadRawCourse("java-level-3"),
			loadRawCourse("ap-computer-science-a")
		]);

		expect(javaLevel1).not.toBeNull();
		expect(javaLevel2).not.toBeNull();
		expect(javaLevel3).not.toBeNull();
		expect(apCsa).not.toBeNull();

		const javaLevel1Text = allCourseText(javaLevel1);
		const javaLevel2Text = allCourseText(javaLevel2);
		const javaLevel3Text = allCourseText(javaLevel3);
		const apCsaText = allCourseText(apCsa);

		expect(javaLevel1!.modules[0]?.title).toBe(
			"J1A Visual Java Launch: Karel Robot Worlds"
		);
		expect(
			findItem(javaLevel1!, /Course Launch: Start Java Visually/)
				.projectLink
		).toBe("/ide?mode=karel");
		expect(
			findItem(javaLevel1!, /J1A Project 1: Robot Walkthrough/)
				.projectLink
		).toBe("/ide?mode=karel");
		expect(javaLevel1Text).toContain("BlueJ in class");
		expect(javaLevel1Text).toContain("visible robot world");
		expect(javaLevel1Text).toContain(
			"first week or roughly first three class meetings"
		);
		expect(javaLevel1Text).toContain(
			"CodeHS or the browser Code IDE outside class"
		);
		expect(javaLevel1Text).toContain("First-Week Karel Cadence");
		expect(javaLevel1Text).not.toContain("Carol/Karel");
		expect(javaLevel1Text).toContain("Five-Robot Warm-Up Set");
		expect(javaLevel1Text).toContain(
			"Visual Exit Ticket: Ready for Text"
		);
		expect(javaLevel1Text).toContain("int x = 7; x = 9");
		expect(javaLevel1Text).toContain("moveMany(3)");
		expect(javaLevel1Text).toContain(
			"Text Bridge: Variables, Strings, and Input"
		);
		expect(javaLevel1Text).toContain("Optional Python-to-Java Bridge");

		expect(javaLevel2!.modules[0]?.title).toBe("JM0 Visual-to-OOP Bridge");
		expect(javaLevel2Text).toContain("BlueJ Object Bench");
		expect(javaLevel2Text).toContain("Object State Trace");

		expect(javaLevel3!.modules[0]?.title).toBe(
			"AJ0 Visual Foundations Audit"
		);
		expect(javaLevel3Text).toContain("visible robot object");
		expect(apCsaText).toContain("Visual Java Bridge");
		expect(apCsaText).toContain("Karel and BlueJ habits");
	});

	it("keeps Java Level 1 graphics extensions neutral and project-rich", async () => {
		const javaLevel1 = await loadRawCourse("java-level-1");
		expect(javaLevel1).not.toBeNull();

		const javaLevel1Text = allCourseText(javaLevel1);

		expect(javaLevel1Text).toContain("Graphics Extension Positioning");
		expect(javaLevel1Text).toContain(
			"Java Level 1 Graphics Extension: Coordinates, Color, and Shapes"
		);
		expect(javaLevel1Text).toContain(
			"Java Graphics Extension: Coordinate Refactor"
		);
		expect(javaLevel1Text).toContain(
			"Java Graphics Extension: Pattern Parameter Swap"
		);

		expect(javaLevel1Text).not.toContain("Java Track Map: Without Graphics");
		expect(javaLevel1Text).not.toContain("Java Track Map: With Graphics");
		expect(javaLevel1Text).not.toContain("What This Branch Keeps");
		expect(javaLevel1Text).not.toContain("Graphics Branch Positioning");
		expect(javaLevel1Text).not.toContain("Java Graphics Branch");
		expect(javaLevel1Text).not.toMatch(/\bbranch should\b/i);
		expect(javaLevel1Text).not.toMatch(/\bgraphics should\b/i);

		const customGraphicsModules = javaLevel1!.modules.filter(module =>
			/^Java Level 1 Graphics Extension:/.test(module.title)
		);
		expect(customGraphicsModules).toHaveLength(3);

		for (const module of customGraphicsModules) {
			expect(
				module.supplementalProjects.length,
				module.title
			).toBeGreaterThanOrEqual(2);
		}
	});

	it("keeps Java Level 1 applied build labels practice-oriented", async () => {
		const course = await loadRawCourse("java-level-1");
		expect(course).not.toBeNull();

		const source = fs.readFileSync(
			"src/stores/courses/java-level-1.ts",
			"utf8"
		);
		const corpus = allCourseText(course);

		expect(source).not.toMatch(/\bImplementation Lab\b/);
		expect(source).not.toMatch(/\bSupplemental [23]\b/);
		expect(corpus).not.toMatch(/\bImplementation Lab\b/);
		expect(corpus).not.toMatch(/\bSupplemental [23]\b/);
		expect(corpus).toContain(
			"J1X02 Java Foundations Build 13: Practice Studio"
		);
		expect(corpus).toContain(
			"J1X06 Java Foundations Build 17 Extension Practice"
		);
		expect(corpus).toContain("Temperature Converter Transfer Practice");
	});

	it("keeps Java Level 2 advanced project labels practice-oriented", async () => {
		const course = await loadRawCourse("java-level-2");
		expect(course).not.toBeNull();

		const source = fs.readFileSync(
			"src/stores/courses/java-level-2.ts",
			"utf8"
		);
		const corpus = allCourseText(course);

		expect(source).not.toMatch(/\bImplementation Lab\b/);
		expect(source).not.toMatch(/\bSupplemental [23]\b/);
		expect(corpus).not.toMatch(/\bImplementation Lab\b/);
		expect(corpus).not.toMatch(/\bSupplemental [23]\b/);
		expect(corpus).toContain(
			"JM Master Project Example Quiz Game: Practice Studio"
		);
		expect(corpus).toContain("JM Maze Runner Project Extension Practice");
		expect(corpus).toContain(
			"Static Variables & Methods Extension Practice"
		);
	});

	it("formats inline project steps and support labels as readable markdown blocks", async () => {
		const [scratchLevel1, scratchLevel2, pygames] = await Promise.all([
			loadRawCourse("scratch-level-1"),
			loadRawCourse("scratch-level-2"),
			loadRawCourse("pygames")
		]);
		expect(scratchLevel1).not.toBeNull();
		expect(scratchLevel2).not.toBeNull();
		expect(pygames).not.toBeNull();

		const spinner = findItem(scratchLevel1!, /Spinner/);
		expect(spinner.content).toContain(
			"**Goal:** Build a spinner that responds to the green flag"
		);
		expect(spinner.content).toContain("**Event behaviors:**");
		expect(spinner.content).toContain(
			"When the spacebar is pressed, point the arrow toward the mouse"
		);
		expect(spinner.content).toContain("**Checkpoint:**");
		expect(spinner.content).not.toContain(
			"It's time to build a fun spinner"
		);
		expect(spinner.content).not.toContain("Build a working result for");

		const imagesReview = findItem(pygames!, /Review: Images and Sprites/);
		expect(imagesReview.content).toContain(
			"PyGame development: game-loop state, actors, events, collisions, timing, assets, and playable feedback"
		);
		expect(imagesReview.content).not.toContain("Scratch game design");

		const rainbowFill = findItem(pygames!, /Rainbow Fill/);
		expect(rainbowFill.content).toContain("**Outcome:**");
		expect(rainbowFill.content).toContain(
			"Define the project's visible state"
		);
		expect(rainbowFill.content).toContain("**Checkpoints:**");
		expect(rainbowFill.content).toContain(
			"The final explanation names the game loop behavior"
		);
		expect(rainbowFill.content).toContain("**Extension:**");
		expect(rainbowFill.content).not.toContain("Define The project");

		const wheel = findItem(scratchLevel2!, /Wheel of Fortune/);
		expect(wheel.content).toContain(
			"**Lists and variables:**\n- A word-bank list stores possible secret words"
		);
		expect(wheel.content).toContain("**Game flow:**");
		expect(wheel.content).not.toMatch(/\band and\b/i);
	});

	it("keeps generated project support from using robotic or malformed goal text", async () => {
		for (const { id } of courseCatalog) {
			const course = await loadRawCourse(id);
			expect(course).not.toBeNull();
			const text = allCourseText(course);

			expect(text).not.toContain("Build a working result for");
			expect(text).not.toMatch(/\ba extension\b/i);
			expect(text).not.toMatch(/that shows .* through Java/i);
		}
	});

	it("keeps machine learning projects structured instead of wall-of-text notebook prompts", async () => {
		const course = await loadRawCourse("machine-learning");
		expect(course).not.toBeNull();

		const source = fs.readFileSync(
			"src/stores/courses/machine-learning.ts",
			"utf8"
		);

		const requiredSections = [
			"**Setup:**",
			"**Exploration:**",
			"**Algorithm steps:**",
			"**Model steps:**",
			"**Transfer check:**",
			"**Text preprocessing:**",
			"**Neuron model:**",
			"**Worked example:**",
			"**Network shape:**",
			"**Linear baseline:**",
			"**Polynomial model:**",
			"**Model comparison:**",
			"**Evaluation:**",
			"**Model choices:**",
			"**Scoping checks:**",
			"**Notebook workflow:**",
			"**Portfolio framing:**"
		];

		for (const section of requiredSections) {
			expect(source).toContain(section);
		}

		expect(source).not.toContain(
			"Using Google Colab and the Kaggle customer segmentation dataset, build k-means clustering from scratch"
		);
		expect(source).not.toContain(
			"Use Naive Bayes to classify emails as spam or not spam with a realistic text dataset. In Colab"
		);
		expect(source).not.toContain(
			"In Colab, build a neural network to classify weather images (rainy, sunny, cloudy, sunrise). Upload"
		);

		const customerSegmentation = findItem(course!, /Customer Segmentation/);
		expect(customerSegmentation.content).toContain(
			"The algorithm is run more than once so random initialization is visible"
		);

		const spamClassification = findItem(course!, /Email Spam/);
		expect(spamClassification.content).toContain(
			"Name one risk of relying only on accuracy or only on word counts"
		);

		const masterProject = findItem(course!, /Master Project Planning/);
		expect(masterProject.content).toContain(
			"The result can be evaluated with an appropriate metric"
		);
	});

	it("keeps Scratch project prompts structured instead of inline numbered walls", async () => {
		const [scratchLevel1, scratchLevel2] = await Promise.all([
			loadRawCourse("scratch-level-1"),
			loadRawCourse("scratch-level-2")
		]);
		expect(scratchLevel1).not.toBeNull();
		expect(scratchLevel2).not.toBeNull();

		const levelOneSource = fs.readFileSync(
			"src/stores/courses/scratch-level-1.ts",
			"utf8"
		);
		const levelTwoSource = fs.readFileSync(
			"src/stores/courses/scratch-level-2.ts",
			"utf8"
		);
		const source = `${levelOneSource}\n${levelTwoSource}`;

		const requiredSections = [
			"**Project goal:** Help the wizard collect potions",
			"**Project goal:** Guide the baby chick to its parents",
			"**Butterfly controls:**",
			"**State to track:**",
			"**Lists and variables:**",
			"**Custom blocks to build:**",
			"**Function design:**",
			"**Function set:**",
			"**Function roles:**",
			"**Level structure:**",
			"**Pal movement:**",
			"**Level transitions:**"
		];

		for (const section of requiredSections) {
			expect(source).toContain(section);
		}

		expect(source).not.toContain(
			"Play through the demo and identify the game elements that need to be programmed"
		);
		expect(source).not.toContain(
			"Use the arrow keys to help the baby chick find its parents.\\n1. Program the chick"
		);
		expect(source).not.toContain(
			"Welcome to the Wheel of Fortune! In this game, the user has a certain number of guesses"
		);
		expect(source).not.toContain(
			"Build a platformer where Pal collects magic keys and moves through multiple levels.\\n1. Inspect"
		);

		const saveTheWizard = findItem(scratchLevel1!, /Save the Wizard/);
		expect(saveTheWizard.content).toContain(
			"The level variable changes exactly once per collision event"
		);
		expect(allCourseText(scratchLevel1!)).not.toMatch(/\bshould\b/i);

		const babyChick = findItem(scratchLevel2!, /Baby Chick/);
		expect(babyChick.content).toContain(
			"The chick must update its message correctly as it moves between the four possible touching states"
		);

		const rockPaperScissors = findItem(
			scratchLevel2!,
			/Rock Paper Scissors/
		);
		expect(rockPaperScissors.content).toContain(
			"The game handles invalid input, ties, and all six non-tie matchups"
		);

		const platformerPal = findItem(scratchLevel2!, /Platformer Pal/);
		expect(platformerPal.content).toContain(
			"Each level resets cleanly, uses the correct broadcast, and avoids running old level scripts"
		);
		expect(allCourseText(scratchLevel2!)).not.toMatch(/\bshould\b/i);

		const levelTwoTyping = findItem(
			scratchLevel2!,
			/Typing and Code Fluency/
		);
		expect(levelTwoTyping.content).toContain("Code-fluency transitions");
		expect(levelTwoTyping.content).toContain("score = score + 1");
		expect(levelTwoTyping.content).not.toContain(
			"Practice with the Keyboard - Typing Letters"
		);
	});

	it("keeps Scratch source links from reusing a learner project as its own solution", async () => {
		const [scratchLevel1, scratchLevel2] = await Promise.all([
			loadRawCourse("scratch-level-1"),
			loadRawCourse("scratch-level-2")
		]);
		expect(scratchLevel1).not.toBeNull();
		expect(scratchLevel2).not.toBeNull();

		const duplicateScratchResources = [scratchLevel1, scratchLevel2]
			.filter(Boolean)
			.flatMap(course =>
				course!.modules.flatMap(module =>
					[
						...module.curriculum,
						...module.supplementalProjects
					].flatMap(item => {
						const projectLink = item.projectLink?.trim();
						const solutionLink = item.solutionLink?.trim();
						return projectLink && solutionLink === projectLink
							? [
									`${module.title} / ${item.title}: ${projectLink}`
								]
							: [];
					})
				)
			);

		expect(duplicateScratchResources).toEqual([]);
		expect(findItem(scratchLevel2!, /Fish Food/).projectLink).toBe(
			"https://scratch.mit.edu/projects/315901981/"
		);
		expect(findItem(scratchLevel2!, /Fish Food/).solutionLink).toBe(
			"https://scratch.mit.edu/projects/357453262/"
		);
	});

	it("neutralizes repetitive generated supplemental project wording", async () => {
		const [scratchLevel1, scratchLevel2, webDevelopment] =
			await Promise.all([
				loadRawCourse("scratch-level-1"),
				loadRawCourse("scratch-level-2"),
				loadRawCourse("web-development-foundations")
			]);
		expect(scratchLevel1).not.toBeNull();
		expect(scratchLevel2).not.toBeNull();
		expect(webDevelopment).not.toBeNull();

		const scratchCorpus = [
			allCourseText(scratchLevel1),
			allCourseText(scratchLevel2)
		].join("\n");

		expect(scratchCorpus).not.toMatch(/Repeat the core ideas from/i);
		expect(scratchCorpus).not.toMatch(
			/Create an original variation inspired by/i
		);
		expect(scratchCorpus).not.toMatch(
			/\bPractice .* on a focused smaller problem to build speed, independence, and cleaner reasoning/i
		);
		expect(scratchCorpus).not.toMatch(
			/\bDesign a small original variation of .* with one meaningful design or reasoning choice/i
		);
		expect(scratchCorpus).not.toMatch(
			/\bproduces a playable Scratch project with clear event flow/i
		);
		expect(scratchCorpus).not.toMatch(
			/\badds one new constraint, data layout, or behavior that still fits the goal/i
		);
		expect(scratchCorpus).not.toMatch(
			/\bstays centered on sprite roles, event timing, broadcasts, clones, variables, stage behavior/i
		);
		expect(scratchCorpus).toContain(
			"**Fluency goal:** Rebuild the central Hungry Hippo-style collection behavior"
		);
		const startingFluency = findItem(
			scratchLevel1!,
			/Fluency Drill/,
			/Hungry Hippo-style/
		);
		expect(startingFluency.content).not.toContain(
			"**Checkpoints:**\n- The Starting in Scratch project can be replayed"
		);
		expect(startingFluency.content).not.toContain(
			"**Extension:** Add a difficulty option to the Starting in Scratch project"
		);
		expect(scratchCorpus).toContain(
			"**Variant goal:** Build a new starter collection game variation"
		);
		expect(scratchCorpus).toContain(
			"**Variant goal:** Build a new advanced Scratch capstone variation"
		);
		expect(scratchCorpus).not.toContain(
			"Original variant for GS1 Starting in Scratch: change the theme, control rule, score condition, or feedback cue"
		);
		expect(scratchCorpus).toContain(
			"Testing uses one normal word, one short word, and one input with spaces or repeated letters."
		);
		expect(allCourseText(webDevelopment)).not.toMatch(/\bbut Now\b/);
	});

	it("keeps generated concept and supplemental titles concise", async () => {
		const course = await loadRawCourse("python-level-3");
		expect(course).not.toBeNull();

		const corpus = allCourseText(course);

		expect(corpus).toContain("Core Concepts");
		expect(corpus).toContain("Data Variation Practice");
		expect(corpus).not.toContain("Applied Challenge");
		expect(corpus).not.toMatch(/Core Concepts and Learning Sequence/i);
		expect(corpus).not.toMatch(
			/Application, Misconceptions, and Readiness Check/i
		);
		expect(corpus).not.toMatch(/Transfer or Extension Project/i);
	});

	it("links Python Level 3 projects to restored source demo media", async () => {
		const course = await loadRawCourse("python-level-3");
		expect(course).not.toBeNull();

		const items = course!.modules.flatMap(module => [
			...module.curriculum,
			...module.supplementalProjects
		]);
		const byTitle = new Map(items.map(item => [item.title, item]));

		expect(byTitle.get("AM1 Project 1: Mad Libs")?.mediaLink).toBe(
			"https://static.classes.jacobdanderson.net/am_1_mad_libs.mp4"
		);
		expect(
			byTitle.get("AM1 Project 2: Fictional Language Verifier")?.mediaLink
		).toBe(
			"https://static.classes.jacobdanderson.net/am_1_junian_language_verifier.mp4"
		);
		expect(
			byTitle.get("AM12 Project 3: Word Translator with File I/O")
				?.mediaLink
		).toBe(
			"https://static.classes.jacobdanderson.net/am_12_juni_latin.mp4"
		);
		expect(
			byTitle.get("AM14 Project 4: Advanced Tic Tac Toe AI")?.mediaLink
		).toBe(
			"https://static.classes.jacobdanderson.net/am_14_tic_tac_toe_ai_with_forks.mp4"
		);
		expect(
			items
				.map(item => item.mediaLink)
				.filter(Boolean)
				.some(link => isLegacyStaticMediaUrl(link ?? ""))
		).toBe(false);
	});

	it("keeps generated safety and resource cards substantive", async () => {
		const [networkSecurity, dataScience, elementaryScience] =
			await Promise.all([
				loadRawCourse("network-security"),
				loadRawCourse("data-science-in-python"),
				loadRawCourse("elementary-science")
			]);
		expect(networkSecurity).not.toBeNull();
		expect(dataScience).not.toBeNull();
		expect(elementaryScience).not.toBeNull();

		const scopeSheet = findItem(
			networkSecurity!,
			/Safety Project: Threat Model and Scope Sheet/
		);
		const responsibleUse = findItem(
			dataScience!,
			/Boundary Project: Responsible-Use Card/
		);
		const readinessCard = findItem(
			dataScience!,
			/Catalog Project: Dataset Readiness Card/
		);
		const elementaryCorpus = allCourseText(elementaryScience);

		expect(scopeSheet.content).toContain("**Include:**");
		expect(scopeSheet.content).toContain("reset path");
		expect(responsibleUse.content).toContain("possible harm");
		expect(responsibleUse.content).toContain("human review step");
		expect(readinessCard.content).toMatch(/one sanity check/i);
		expect(elementaryCorpus).not.toMatch(
			/same learning goal[\s\S]{0,120}same learning goal/i
		);
		expect(elementaryCorpus).toContain("shared online material");
	});

	it(
		"keeps generated architecture modules reader-facing",
		async () => {
			const loadedCourses = await loadedCatalogCourses();
			const corpus = await loadedCatalogText();

			const internalPhrases = [
				/\binstructor\b/i,
				/\byour student\b/i,
				/\bask the student\b/i,
				/\bhave the student\b/i,
				/\bsession notes?\b/i,
				/\bHQ Support\b/i,
				/\bSlack\b/i,
				/\bJuni\b/i,
				/\bJunian\b/i,
				/\bJuni whiteboard\b/i,
				/\bRecording Studio\b/i,
				/\bteacher\b/i,
				/\bportal\b/i,
				/\b(?:ask|have|let|encourage|show|teach|tell|guide|help)\s+(?:the\s+)?(?:students?|learners?)\b/i,
				/\b(?:students?|learners?)\s+(?:explain|write|build|practice|reason|understand|inspect|trace|identify|distinguish|compare|create|use|complete)\b/i,
				/This lesson arc covers/i,
				/Use this as one/i,
				/(?:^|\n)Use this (?:module|check-in|review|final check-in|checklist|reference|reference build|project|build|supplemental build)\b/i,
				/Treat this as/i,
				/\bfuture lesson writing\b/i,
				/\bfamily can tell\b/i
			];

			for (const phrase of internalPhrases)
				expect(corpus).not.toMatch(phrase);

			expect(corpus).not.toMatch(/The goal is to be able to/i);
			expect(corpus).not.toMatch(/\bThe goal is to\b/i);
			expect(corpus).not.toMatch(/\bThis (?:section|lesson) covers\b/i);
			expect(corpus).not.toMatch(/\bPractice targets?\b/i);
			expect(corpus).not.toMatch(/\bVisible pattern\b/i);
			expect(corpus).not.toMatch(/\bSkill target\b/i);
			expect(corpus).not.toMatch(/\*\*Key idea:\*\*/i);
			expect(corpus).not.toMatch(/\bensure to [a-z]/i);
			expect(corpus).not.toMatch(
				/with a clear input, process, and output path that makes .+ easier to inspect/i
			);
			expect(corpus).not.toMatch(
				/is strongest when the key terms, one traced example, and one nearby transfer case are connected clearly/i
			);
			expect(corpus).not.toMatch(
				/Core vocabulary for .+ one representative example, and a nearby variation/i
			);
			expect(corpus).not.toMatch(
				/connects to .+ through named inputs or state, one step-by-step example, and one changed second case/i
			);
			expect(corpus).not.toMatch(/Summarize [^\n.]+ by naming/i);
			expect(corpus).not.toMatch(
				/A complete check for [^\n.]+ names [^\n.]+, (?:demonstrating|explaining|checking|separating|showing|identifying)/i
			);
			expect(corpus).not.toMatch(
				/\*\*Concept focus:\*\* [^\n.]+ (?:becomes useful when|is checked by|connects the main terms to)/i
			);
			expect(corpus).not.toMatch(
				/\*\*Goal:\*\* (?:Use|Turn|Produce|Complete|Build|Implement|Develop|Create|Finish|Refine) \*\*[^*]+\*\* (?:to turn the module concept|with a stated goal|as a focused checkpoint|around one concrete behavior)/i
			);
			expect(corpus).not.toMatch(
				/\*\*Goal:\*\* \*\*[^*]+\*\* (?:makes [^\n.]+ inspectable|needs an observable result|has a clear input, process, and output path)/i
			);
			expect(corpus).not.toMatch(
				/\*\*Concept path:\*\* (?:The core vocabulary for|Define the terms that matter for|[^\n.]+ makes [^\n.]+ concrete through a rule or model)/i
			);
			expect(corpus).not.toMatch(
				/A complete response for [^\n.]+ names [^\n.]+, (?:identifies|explains|solves|traces|checks|shows|separates|demonstrates|records)/i
			);
			expect(corpus).not.toMatch(
				/\*\*Goal:\*\* \*\*[^*]+\*\* produces a visible result for [^\n.]+: one ordinary path/i
			);
			expect(corpus).not.toMatch(
				/\*\*Goal:\*\* The (?:class model|class exercise|code checkpoint|object-design task|object-design exercise|practice build|type-model task|method-contract exercise|method-contract checkpoint|API checkpoint|object-state build|collection exercise|data-structure exercise|Java design task|design checkpoint|project|activity|program|analysis|work) (?:turns|makes|shows|grows|applies|includes|demonstrates|connects|documents|produces|ends|centers)\b/i
			);
			expect(corpus).not.toMatch(
				/\*\*Concept path:\*\* [^\n.]+ starts with the relevant parts of [^\n.]+, then follows one concrete example through a changed case/i
			);
			expect(corpus).not.toMatch(/\bmakes the central decision for\b/i);
			expect(corpus).not.toMatch(/\bMake the central decision for\b/);
			expect(corpus).not.toMatch(
				/\bconnects the prompt requirements to\b/i
			);
			expect(corpus).not.toMatch(
				/\bConnect the prompt requirements to\b/
			);
			expect(corpus).not.toMatch(
				/\bDocument the input, process, and output path\b/
			);
			expect(corpus).not.toMatch(/\bFinish with an observable result\b/);
			expect(corpus).not.toMatch(
				/\bends with an observable result, a checked assumption, and evidence tied to\b/i
			);
			expect(corpus).not.toMatch(
				/\bdocuments the input, process, and output path\b/i
			);
			expect(corpus).not.toMatch(
				/\bturns [^\n.]{1,160} into a usable model by pairing the rule with a worked example\b/i
			);
			expect(corpus).not.toMatch(
				/\*\*Concept focus:\*\* [^\n.]+ needs one worked example/i
			);
			expect(corpus).not.toMatch(
				/\*\*Concept focus:\*\* [^\n.]+ starts with the terms needed/i
			);
			expect(corpus).not.toMatch(
				/\bThis module focuses on (?:turn|connect|use|map|combine|organize|diagnose)\b/i
			);
			expect(corpus).not.toMatch(/\bThe work should make\b/i);
			expect(corpus).not.toMatch(
				/\b(?:broadcasts|colors|controls|variables|functions|lists|loops|keys|sprites|values|items|rules|tests|checks|steps|modules|projects|examples|conditions|outcomes|details|rings|halves|layers|errors|commands|labels|questions|methods|records|arrays) makes\b/i
			);
			expect(corpus).not.toMatch(
				/\bworking artifact with explicit requirements\b/i
			);
			expect(corpus).not.toMatch(/\bUse this [^.]+ baseline\b/i);
			expect(corpus).not.toMatch(
				/\b(?:the|The) (?:project|program|activity|task|build|checkpoint|exercise|response|practice task|AP Java task|Java checkpoint|code checkpoint|class model|class exercise|type-model task|object-design task|object-design exercise|practice build|method-contract checkpoint|collection exercise|data-structure exercise|API checkpoint|design checkpoint) for (?:Project|Reference|Supplemental|Check-In|Core|PS\d|JS\d|AJ\d|JM\d|APCS\d)\b/i
			);
			expect(corpus).not.toMatch(/\bfor (?:the )?project for\b/i);
			expect(corpus).not.toMatch(
				/\bUse clear structure, naming, and evidence so the [^\n.]{0,120} can be reviewed without relying on memory\b/i
			);
			expect(corpus).not.toMatch(
				/\bcan be reviewed without relying on memory\b/i
			);
			expect(corpus).not.toMatch(
				/\b(?:the|The) [^\n.]{1,120}? (?:project|program|activity|task|exercise) (?:project|program|activity|task|exercise)\b/i
			);
			expect(corpus).not.toMatch(/\bwhich the [^\n.]{1,120}? values\b/i);
			expect(corpus).not.toMatch(
				/\b(?:Explain|Note|Record|Identify) which the\b/i
			);
			expect(corpus).not.toMatch(
				/\beach the [^\n.]{1,120}? Java type\b/i
			);
			expect(corpus).not.toMatch(
				/\bChoose a narrow responsibility for each the\b/i
			);
			expect(corpus).not.toMatch(/\bThe signature project should\b/i);
			expect(corpus).not.toMatch(/\bThe final artifact should\b/i);
			expect(corpus).not.toMatch(
				/\bprerequisite modules, project ladder, and assessment model should already be practiced\b/i
			);
			expect(corpus).not.toMatch(
				/\bOne meaningful condition changes from the core version\b/i
			);
			expect(corpus).not.toMatch(/\bVariant focus: Transfer practice\b/i);
			expect(corpus).not.toMatch(
				/\bVariant focus: Extension practice\b/i
			);
			expect(corpus).not.toMatch(
				/\bThe first complete version is built and verified independently\b/i
			);
			expect(corpus).not.toMatch(
				/\bA concrete example establishes the (?:relevant )?vocabulary\b/i
			);
			expect(corpus).not.toMatch(/\bchecks exercise\b/i);
			expect(corpus).not.toMatch(/\bchecks checks\b/i);
			expect(corpus).not.toMatch(/\bexercise checks exercise\b/i);
		},
		COURSE_SWEEP_TIMEOUT
	);

	it("normalizes legacy platform-branded project names in loaded copy", async () => {
		const courses = await Promise.all([
			loadRawCourse("python-level-2"),
			loadRawCourse("python-level-3"),
			loadRawCourse("data-science-in-python"),
			loadRawCourse("ai-level-1"),
			loadRawCourse("java-level-3"),
			loadRawCourse("javascript-level-1-javascript-superstar"),
			loadRawCourse("javascript-level-2-javascript-master")
		]);
		const corpus = courses.map(allCourseText).join("\n");

		expect(corpus).not.toMatch(/\bJuni\b/i);
		expect(corpus).not.toMatch(/\bJunian\b/i);
		expect(corpus).not.toMatch(/single-folder Juni layout/i);
		expect(corpus).toContain("Archery Simulator");
		expect(corpus).toContain("Word Translator with File I/O");
		expect(corpus).toContain("Fictional Language Verifier");
		expect(corpus).toContain("Command Assistant");
		expect(corpus).toContain("Theme Park Planner");
		expect(corpus).toContain("Book Rule System");
		expect(corpus).toContain("Bakery Model");
		expect(corpus).toContain("Mini Search Engine");
		expect(corpus).toContain("Restaurant Splash Page");
		expect(corpus).toContain("News Homepage");
		expect(corpus).toContain("Department Store Discounts");
		expect(corpus).toContain("a word-translation function");
	});

	it(
		"keeps generated support text aligned to the course domain",
		async () => {
			const mathAndScienceCourses = await Promise.all([
				loadRawCourse("pre-algebra-a"),
				loadRawCourse("pre-algebra-b"),
				loadRawCourse("algebra-1a"),
				loadRawCourse("algebra-1b"),
				loadRawCourse("geometry-a"),
				loadRawCourse("geometry-b"),
				loadRawCourse("algebra-2a"),
				loadRawCourse("algebra-2b"),
				loadRawCourse("pre-calculus-a"),
				loadRawCourse("pre-calculus-b"),
				loadRawCourse("ap-calculus"),
				loadRawCourse("elementary-science"),
				loadRawCourse("middle-school-integrated-science"),
				loadRawCourse("intro-to-chemistry"),
				loadRawCourse("intro-to-physics"),
				loadRawCourse("physics-level-2")
			]);
			const mathScienceCorpus = mathAndScienceCourses
				.map(allCourseText)
				.join("\n");
			const chemistryAssetCorpus = [
				"../public/course-assets/chemistry/chemistry-materials-pack.md",
				"../public/course-assets/chemistry/chemistry-rubrics-answer-key.md"
			]
				.map(assetPath =>
					fs.readFileSync(new URL(assetPath, import.meta.url), "utf8")
				)
				.join("\n");
			const mathScienceAndAssetCorpus = [
				mathScienceCorpus,
				chemistryAssetCorpus
			].join("\n");

			expect(mathScienceAndAssetCorpus).not.toMatch(
				/wrong loop or condition/i
			);
			expect(mathScienceAndAssetCorpus).not.toMatch(
				/assuming hidden state/i
			);
			expect(mathScienceAndAssetCorpus).not.toMatch(
				/syntax, design, or test coverage/i
			);
			expect(mathScienceAndAssetCorpus).not.toMatch(/authorized scope/i);
			expect(mathScienceAndAssetCorpus).not.toMatch(/input shape/i);
			expect(mathScienceAndAssetCorpus).not.toMatch(
				/\b(?:cleaned|generated)\b/i
			);
			expect(mathScienceAndAssetCorpus).not.toMatch(
				/\bpreserved answers\b/i
			);
			expect(mathScienceAndAssetCorpus).not.toMatch(
				/\b(?:restore|restores|restored|preserve|preserves|preserved)\s+the\s+original\b/i
			);
			expect(mathScienceAndAssetCorpus).not.toMatch(
				/\boriginal (?:project|course|version|phenomena)\b/i
			);
			expect(mathScienceAndAssetCorpus).not.toMatch(
				/\bcourse material\b/i
			);
			expect(mathScienceCorpus).toContain(
				"vocabulary, representation choice, algebraic procedure"
			);

			const loadedCourses = await loadedCatalogCourses();
			const allCourses = loadedCourses.map(({ course }) => course);
			const allCorpus = await loadedCatalogText();
			expect(allCorpus).not.toMatch(
				/Failure modes:\*\* Common mistakes include/i
			);
			expect(allCorpus).not.toMatch(/\bCommon pitfalls\b/i);
			expect(allCorpus).not.toMatch(
				/Modify the prompt so it still uses the same concept/i
			);

			const nonSecurityCourses = loadedCourses
				.filter(
					({ entry }) =>
						![
							"network-security",
							"low-level-security",
							"low-level-security-part-2",
							"rust-systems-security"
						].includes(entry.id)
				)
				.map(({ course }) => course);
			expect(
				nonSecurityCourses.map(allCourseText).join("\n")
			).not.toMatch(/authorized scope/i);

			const swift = await loadRawCourse("intro-to-swift-app-development");
			expect(swift).not.toBeNull();
			const swiftCorpus = allCourseText(swift);
			expect(swiftCorpus).toMatch(/unclear state ownership/i);
			expect(swiftCorpus).not.toMatch(/Remote investigation/i);
			expect(swiftCorpus).not.toMatch(/Science explanation/i);
			expect(swiftCorpus).not.toMatch(/CER checkpoint/i);
			expect(swiftCorpus).not.toMatch(/wrong loop condition/i);
		},
		COURSE_SWEEP_TIMEOUT
	);

	it("keeps Swift app development labels explanatory and practice-oriented", async () => {
		const course = await loadRawCourse("intro-to-swift-app-development");
		expect(course).not.toBeNull();

		const source = fs.readFileSync(
			"src/stores/courses/intro-to-swift-app-development.ts",
			"utf8"
		);
		const corpus = allCourseText(course);

		expect(source).not.toMatch(/\bSkill target:/i);
		expect(source).not.toMatch(/\bPractice target:/i);
		expect(source).not.toMatch(/\bKey idea:/i);
		expect(source).not.toMatch(/\bThis section covers\b/i);
		expect(source).not.toMatch(/\bsupplemental [23]\b/i);
		expect(source).not.toMatch(/\bMini Lab\b/i);
		expect(source).not.toMatch(/\bshould\b/i);
		expect(corpus).not.toMatch(/\bSkill target:/i);
		expect(corpus).not.toMatch(/\bPractice target:/i);
		expect(corpus).not.toMatch(/\bsupplemental [23]\b/i);
		expect(corpus).not.toMatch(/\bMini Lab\b/i);
		expect(corpus).toContain("First Blank SwiftUI App Studio");
		expect(corpus).toContain("First Launch Troubleshooting Studio");
		expect(corpus).toContain(
			"Each step changes the signing requirements, metadata expectations, and audience that can access the build."
		);
		expect(corpus).toContain("State and Data Flow Extension Practice");
		expect(corpus).toContain("Capstone App Transfer Practice");
	});

	it(
		"keeps algebra supplemental projects specific, neutral, and topic-aware",
		async () => {
			const courses = await Promise.all([
				loadRawCourse("pre-algebra-a"),
				loadRawCourse("pre-algebra-b"),
				loadRawCourse("algebra-1a"),
				loadRawCourse("algebra-1b"),
				loadRawCourse("geometry-a"),
				loadRawCourse("geometry-b"),
				loadRawCourse("algebra-2a"),
				loadRawCourse("algebra-2b"),
				loadRawCourse("pre-calculus-a"),
				loadRawCourse("pre-calculus-b"),
				loadRawCourse("ap-calculus")
			]);
			const corpus = courses.map(allCourseText).join("\n");
			const supplementalCorpus = courses
				.flatMap(course =>
					course!.modules.flatMap(module =>
						module.supplementalProjects.map(item => item.content)
					)
				)
				.join("\n");
			const checkInModelingBodies = courses.flatMap(course =>
				course!.modules
					.filter(module => /^Check-In #\d+$/.test(module.title))
					.flatMap(module =>
						module.supplementalProjects
							.filter(item =>
								item.title.startsWith(
									"Modeling or Error Analysis"
								)
							)
							.map(item => item.content)
					)
			);

			expect(corpus).not.toMatch(/Develop an application task/i);
			expect(corpus).not.toMatch(
				/Connect .* to a modeling or error-analysis task/i
			);
			expect(corpus).not.toMatch(
				/Turn .* into a compact standards-aligned practice set/i
			);
			expect(corpus).not.toMatch(
				/Apply .* in a modeling, graphing, or error-analysis context/i
			);
			expect(corpus).not.toMatch(/\ba Algebra/i);
			expect(corpus).not.toMatch(/asked students to/i);
			expect(corpus).not.toMatch(/asked learners to/i);
			expect(corpus).not.toMatch(/preparing students to/i);

			expect(supplementalCorpus).toContain("**Steps:**");
			expect(supplementalCorpus).toContain(
				"movement between a rate table"
			);
			expect(supplementalCorpus).toContain("sign error in factoring");
			expect(supplementalCorpus).toContain(
				"testing one value inside the solution set"
			);
			expect(supplementalCorpus).toContain("tracking inputs and outputs");
			expect(supplementalCorpus).toContain("extraneous solution");
			expect(supplementalCorpus).toContain("population, depreciation");
			expect(supplementalCorpus).toContain("linear readiness scenario");
			expect(supplementalCorpus).toContain(
				"nonlinear readiness scenario"
			);
			expect(supplementalCorpus).toContain(
				"advanced-function readiness scenario"
			);
			expect(supplementalCorpus).toContain(
				"cumulative modeling scenario"
			);
			expect(new Set(checkInModelingBodies).size).toBe(
				checkInModelingBodies.length
			);
		},
		COURSE_SWEEP_TIMEOUT
	);

	it("builds substantive neutral source-library course modules", async () => {
		const courses = await Promise.all([
			loadRawCourse("smart-money-personal-finance"),
			loadRawCourse("introduction-to-public-speaking"),
			loadRawCourse("early-elementary-a-math"),
			loadRawCourse("early-elementary-a-reading"),
			loadRawCourse("usaco-bronze-on-demand"),
			loadRawCourse("scratch-level-1-bootcamp")
		]);
		const corpus = courses.map(allCourseText).join("\n");

		for (const course of courses) {
			expect(course).not.toBeNull();
			if (!course) continue;

			const text = allCourseText(course);
			expect(text).toContain("**Concept path:**");
			expect(text).toContain("Core topics in this module:");
			expect(text).toContain("**Evidence checklist:**");
			expect(text).toContain("**Setup:**");
			expect(text).toContain("**Process:**");
			expect(text).toContain("**Completion evidence:**");
			expect(text).toContain("**Transfer move:**");
			expect(text).toContain("**Extension choices:**");
			expect(text).not.toMatch(
				/The .* connection matters because .* builds skill through repeated evidence/i
			);
			expect(text).not.toMatch(
				/Juni|Recording Studio|your instructor|with your instructor|Whiteboard|Learning Targets/i
			);
			expect(text).not.toMatch(/\bshould\b/i);
		}

		const [
			smartMoney,
			publicSpeaking,
			earlyMath,
			earlyReading
		] = courses;
		const nonProgrammingCorpus = [
			smartMoney,
			publicSpeaking,
			earlyMath,
			earlyReading
		]
			.filter(Boolean)
			.map(course => allCourseText(course!))
			.join("\n");

		expect(corpus).toContain("decision record with assumptions");
		expect(corpus).toContain("speech outline with purpose");
		expect(corpus).toContain("worked math record with diagrams");
		expect(corpus).toContain("reading or writing record with claim");
		expect(corpus).toContain("problem-solving record with inputs");
		expect(nonProgrammingCorpus).toContain(
			"the known quantities, needed representation"
		);
		expect(nonProgrammingCorpus).toContain(
			"the passage or draft section, claim or writing goal"
		);
		expect(nonProgrammingCorpus).toContain(
			"the audience, purpose, central message"
		);
		expect(nonProgrammingCorpus).toContain(
			"the goal, assumptions, available evidence"
		);
		expect(nonProgrammingCorpus).not.toMatch(
			/core state, inputs, outputs|first runnable checkpoint|first runnable slice|data or state representation/i
		);
	});

	it("preserves Smart Money original activity anchors with neutral wording", async () => {
		const course = await loadRawCourse("smart-money-personal-finance");
		expect(course).not.toBeNull();
		if (!course) return;

		const text = allCourseText(course);
		const expectedAnchors = [
			"Spend Like Bill Gates Constraint Ladder",
			"Graduate Profile and First-Month Budget",
			"Wealth-Building Research and Financial Perspectives",
			"Income Streams Comparison",
			"Salary Negotiation Case",
			"Wild Card Ledger",
			"Spending Style and Needs-versus-Wants Budget",
			"Profile Budget Revision",
			"Debt Growth and Credit Card Simulation",
			"Credit Card Selection Case",
			"Car Loan and Housing What-If",
			"Long-Run Purchase Value",
			"Vehicle Purchase Decision",
			"Checking-versus-Savings Allocation",
			"Savings Account Offer Case",
			"Retirement Savings Calculator",
			"Investment Account Allocation",
			"Ethical Spending and Investing",
			"Cause-Aligned Business or Awareness Project",
			"Financial Journey Portfolio",
			"Next-Year Outlook"
		];

		expect(text).not.toContain("Source Activity Anchors:");
		expect(text).toContain("neal.fun/spend");
		expect(text).toContain("$30,000 in student debt");
		expect(text).toContain("Budget Planner");
		expect(text).toContain("Expense Tracker");
		expect(text).toContain("**Completion evidence:**");
		for (const anchor of expectedAnchors) {
			expect(text).toContain(anchor);
		}

		expect(text).not.toMatch(
			/Juni|Recording Studio|your instructor|with your instructor|Whiteboard|Learning Targets|HQ Support|Slack/i
		);
		expect(text).not.toMatch(/\bshould\b/i);
		expect(text).not.toContain("static.junilearning.com");
	});

	it("preserves Public Speaking original activity anchors with neutral wording", async () => {
		const course = await loadRawCourse("introduction-to-public-speaking");
		expect(course).not.toBeNull();
		if (!course) return;

		const text = allCourseText(course);
		const expectedAnchors = [
			"Two-Minute Self Introduction",
			"Introduce Another Person",
			"Toast Outline and Delivery Notes",
			"Audience-Centered Three-Part Speech",
			"Annotated Keynote Performance",
			"Personal Narrative Performance",
			"Five-Minute Media Pitch",
			"Happiness v. Money Case Argument",
			"Stand-Up Routine Performance",
			"Ideas Worth Spreading Analysis",
			"TED-Style Talk Portfolio"
		];

		expect(text).not.toContain("Source Activity Anchors:");
		expect(text).toContain("opening, main points, and a closing summary");
		expect(text).toContain("Eye-contact cues");
		expect(text).toContain("Happiness v. Money");
		expect(text).toContain("through-line");
		expect(text).toContain("landscape framing");
		expect(text).toContain("**Completion evidence:**");
		for (const anchor of expectedAnchors) {
			expect(text).toContain(anchor);
		}

		expect(text).not.toMatch(
			/Juni|Recording Studio|your instructor|with your instructor|Whiteboard|Learning Targets|HQ Support|Slack/i
		);
		expect(text).not.toMatch(/\bshould\b/i);
		expect(text).not.toContain("static.junilearning.com");
	});

	it("preserves Money-Minded original activity anchors with neutral wording", async () => {
		const course = await loadRawCourse("money-minded-investing");
		expect(course).not.toBeNull();
		if (!course) return;

		const text = allCourseText(course);
		const expectedAnchors = [
			"Public Company and Stock Market Tour",
			"First Simulated Portfolio Entry",
			"Time-the-Market Comparison",
			"Index and Portfolio Strategy Check",
			"Compounding and Inflation Scenarios",
			"Rule of 72 Portfolio Projection",
			"Dice Risk Ledger",
			"Sharpe Ratio Portfolio Review",
			"Build Your Stax Diversification Review",
			"ETF and Bond Fund Allocation",
			"Stock Category and Sector Rotation Map",
			"Category-Based Portfolio Diversification",
			"Financial Statement and P/E Ratio Review",
			"Undervalued Stock Candidate Review",
			"Private Company Ranking Case",
			"ESG Criteria and Reliability Review",
			"Values-Aligned Portfolio Update",
			"Short Selling and Short Squeeze Case",
			"Overvalued Company Short Plan",
			"Cryptocurrency Value Comparison",
			"Bitcoin Historical Return Case",
			"Investment Strategy Pitch",
			"Private Company Re-Evaluation"
		];

		expect(text).not.toContain("Source Activity Anchors:");
		expect(text).toContain("Apple (AAPL)");
		expect(text).toContain("imaginary $100,000");
		expect(text).toContain("S&P 500, Dow Jones, and Nasdaq");
		expect(text).toContain("Rule of 72");
		expect(text).toContain("Sharpe Ratio");
		expect(text).toContain("SPY, QQQ, and DIA");
		expect(text).toContain("BOTZ");
		expect(text).toContain("cyclical, defensive, growth, blue-chip, or IPO");
		expect(text).toContain("Tesla with GM");
		expect(text).toContain("Republic.co");
		expect(text).toContain("Alphabet, Disney, and PepsiCo");
		expect(text).toContain("Jordans resale analogy");
		expect(text).toContain("GameStop");
		expect(text).toContain("Bitcoin, Ethereum, and Dogecoin");
		expect(text).toContain("**Completion evidence:**");
		for (const anchor of expectedAnchors) {
			expect(text).toContain(anchor);
		}

		expect(text).not.toMatch(
			/Juni|Recording Studio|your instructor|with your instructor|Whiteboard|Learning Targets|HQ Support|Slack|Password/i
		);
		expect(text).not.toMatch(/\bshould\b/i);
		expect(text).not.toContain("static.junilearning.com");
	});

	it("preserves Entrepreneurship original activity anchors with neutral wording", async () => {
		const course = await loadRawCourse("entrepreneurship-101");
		expect(course).not.toBeNull();
		if (!course) return;

		const text = allCourseText(course);
		const expectedAnchors = [
			"Business Canvas Preview",
			"Ideal Wallet Design Sprint",
			"Entrepreneur Strengths and Values Sketch",
			"Brand Foundation Website Page",
			"Empathy Observation Persona",
			"Problem Statement and Initial Solution",
			"Product or Service Prototype",
			"Name, Logo, Tagline, and Feedback Survey",
			"Coffee Shop Customer Needs Simulation",
			"Ideal Customer Persona Profile",
			"Customer Feedback Survey Draft",
			"Feedback Interpretation and Iteration Plan",
			"Revised Prototype Evidence Summary",
			"Competitor Positioning Matrix",
			"Competitor Question Research",
			"Price and Competitor Comparison",
			"Production Cost and Profit Margin Forecast",
			"One-Sentence Value Proposition",
			"Channels and Launch Campaign Sketch",
			"Impact Risk and Alternative Materials Review",
			"Cause-Aligned Website Page and Campaign",
			"Lean Business Canvas Portfolio",
			"Entrepreneur Feedback and Pitch Revision"
		];

		expect(text).not.toContain("Source Activity Anchors:");
		expect(text).toContain("Lean Canvas-style structure");
		expect(text).toContain("coolmathgames.com/0-coffee-shop");
		expect(text).toContain("Duolingo, Airbnb, or Uber");
		expect(text).toContain("disruptive, new-market, integrative, or sustaining innovation");
		expect(text).toContain("1,000 customers");
		expect(text).toContain("**Completion evidence:**");
		for (const anchor of expectedAnchors) {
			expect(text).toContain(anchor);
		}

		expect(text).not.toMatch(
			/Juni|Recording Studio|your instructor|with your instructor|Whiteboard|Learning Targets|HQ Support|Slack|Password/i
		);
		expect(text).not.toMatch(/\bshould\b/i);
		expect(text).not.toContain("static.junilearning.com");
	});

	it("preserves Scratch Bootcamp original activity anchors with neutral wording", async () => {
		const course = await loadRawCourse("scratch-level-1-bootcamp");
		expect(course).not.toBeNull();
		if (!course) return;

		const text = allCourseText(course);
		const expectedAnchors = [
			"Scratch Account and First Project Tour",
			"Dragonfly Event Listener Remix",
			"Beetle Keyboard Drawing Controls",
			"Pencil Drawing Program Controls",
			"Arrow Direction and Mouse Targeting",
			"Ball Looks and Motion Event Set",
			"Elephant Repeat and Forever Effects",
			"Mouse Shape Loops",
			"Hot Cross Buns Music Loop",
			"Button Click Timer Game",
			"Crab Catching Game",
			"Zebra Step Counter",
			"Bootcamp Game Selection",
			"Playable Scratch Game Build"
		];

		expect(text).not.toContain("Source Activity Anchors:");
		expect(text).toContain("**Course flow:**");
		expect(text).toContain("**Completion evidence:**");
		expect(text).toContain("scratch.mit.edu/projects/592006491");
		expect(text).toContain("scratch.mit.edu/projects/287738652");
		expect(text).toContain("scratch.mit.edu/projects/327610777");
		expect(text).toContain("scratch.mit.edu/projects/299272518");
		expect(text).toContain("events, loops, conditionals, variables");
		for (const anchor of expectedAnchors) {
			expect(text).toContain(anchor);
		}

		expect(text).not.toMatch(
			/Juni|Recording Studio|your instructor|with your instructor|Whiteboard|Learning Targets|HQ Support|Slack|Password/i
		);
		expect(text).not.toMatch(/\bshould\b/i);
		expect(text).not.toContain("static.junilearning.com");
	});

	it("preserves Picture Book original activity anchors with neutral wording", async () => {
		const course = await loadRawCourse("early-elementary-b-picture-book");
		expect(course).not.toBeNull();
		if (!course) return;

		const text = allCourseText(course);
		const expectedAnchors = [
			"Favorite Ideas Opinion Board",
			"Opinion Book Seed",
			"Parts of Speech Definition Map",
			"Heads Up Word-Sort Game",
			"Find the Capitalization Rule",
			"Punctuation Treasure Hunt",
			"Comma and Quotation Rule Card",
			"Would You Rather Opinion Reasons",
			"Opinion Paragraph Outline",
			"Favorite Story Structure Review",
			"Original Character and Conflict Seed",
			"Subject-Verb Ambassador Sort",
			"Which Word Works Context Cases",
			"Word Choice Reflection",
			"Gabby Tries Narrative Map",
			"Brainstorm Bonanza Story Plan",
			"Picture Book Plot Diagram",
			"Strong Presentation Criteria",
			"Dramatic Reading with Visual Backdrop",
			"Picture Book Assembly Portfolio"
		];

		expect(text).not.toContain("Source Activity Anchors:");
		expect(text).toContain("opinion book");
		expect(text).toContain("common noun and proper noun");
		expect(text).toContain("markers, pens, colored pencils");
		expect(text).toContain("beast, creature, and animal");
		expect(text).toContain("Gabby Tries");
		expect(text).toContain("**Completion evidence:**");
		for (const anchor of expectedAnchors) {
			expect(text).toContain(anchor);
		}

		expect(text).not.toMatch(
			/Juni|Recording Studio|your instructor|with your instructor|Whiteboard|Learning Targets|HQ Support|Slack|Password/i
		);
		expect(text).not.toMatch(/\bshould\b/i);
		expect(text).not.toContain("static.junilearning.com");
	});

	it("preserves Early Elementary A math original activity anchors with neutral wording", async () => {
		const course = await loadRawCourse("early-elementary-a-math");
		expect(course).not.toBeNull();
		if (!course) return;

		const text = allCourseText(course);
		const expectedAnchors = [
			"Ladybug Number Bond Cases",
			"Starfish Tank Regrouping",
			"Birthday Candy Bag Model",
			"Escape the Game Character Budget",
			"Liang Escape Route Grid",
			"Indiana Jones Length Expedition",
			"Yarn Quilt Length Equations",
			"Akshay Sandwich Number Line",
			"Sandwich Sharing Record",
			"Penguin Place Value Grouping",
			"Bookshelf Regrouping Record",
			"Arcade Ticket Goal Tracker",
			"Millionaire Base-Ten Challenge",
			"Skee-Ball Team Score Ledger",
			"TikTok Creator Follower Analysis",
			"Melody Test Launch Data",
			"Addition, Length, and Place Value Check",
			"Kickball Equal Groups",
			"Board Game Rectangle Partitions",
			"Deserted Island Time Record",
			"Grocery Coin Exchange",
			"Kitchen Utensil Data Display",
			"Bakery Dessert Shape Fractions",
			"Devyn iPhone Data Charts",
			"Launch Party Array Cuts",
			"Multiplication, Measurement, Data, and Shape Check"
		];
		const originalReferences = [
			"ladybug",
			"starfish",
			"birthday candy",
			"Escape the Game",
			"Liang",
			"Indiana Jones",
			"yarn",
			"Akshay",
			"96-meter sandwich",
			"penguins",
			"bookshelf",
			"arcade tickets",
			"Who Wants To Be A Millionaire",
			"skee-ball",
			"TikTok",
			"Melody",
			"kickball",
			"board game",
			"deserted-island",
			"grocery-store",
			"kitchen utensil",
			"bakery dessert",
			"Devyn",
			"iPhone"
		];

		expect(text).not.toContain("Source Activity Anchors:");
		expect(text).toContain("**Completion evidence:**");
		for (const anchor of expectedAnchors) {
			expect(text, anchor).toContain(anchor);
		}
		for (const originalReference of originalReferences) {
			expect(text, originalReference).toContain(originalReference);
		}

		expect(text).not.toMatch(
			/Juni|Recording Studio|your instructor|with your instructor|Whiteboard|Learning Targets|HQ Support|Slack|Password/i
		);
		expect(text).not.toMatch(/\bshould\b/i);
		expect(text).not.toContain("static.junilearning.com");
	});

	it("preserves Early Elementary B math original activity anchors with neutral wording", async () => {
		const course = await loadRawCourse("early-elementary-b-math");
		expect(course).not.toBeNull();
		if (!course) return;

		const text = allCourseText(course);
		const expectedAnchors = [
			"Millionaire Block Strategy Review",
			"Skee-Ball Record Challenge",
			"Recycling Game Show Score Sheet",
			"Twenty-Seven Character Array Properties",
			"Cookout Equal Groups and Missing Amounts",
			"Board Game Expression Tracker",
			"Multiples of Ten Block Comparison",
			"Fritz Four-Week Dosage Budget",
			"Fritz Updated Dosage Plan",
			"Operations and Multiplication Check",
			"Storm Cleanup Measurement Plan",
			"House Decoration Square-Unit Designs",
			"Pear Investment Allocation",
			"Bear Flag Factory Area Budget",
			"Mars Fraction Expedition",
			"Foot-Long Sandwich Number Lines",
			"Zoo Anniversary Scaled Graphs",
			"Zoo Straw Measurement Line Plot",
			"Camping Perimeter Layout",
			"Four-Sided Object Scavenger Hunt",
			"Amazon Warehouse Restock Survey",
			"Warehouse Robot Area Proposal",
			"Measurement, Fraction, Data, and Geometry Check"
		];
		const originalReferences = [
			"Who Wants To Be A Millionaire",
			"skee-ball",
			"recycling game show",
			"27 characters",
			"cookout",
			"board game",
			"multiples of 10",
			"Fritz",
			"Vitamin D",
			"Iron",
			"CoQ10",
			"Duchenne",
			"storm-cleanup",
			"square units",
			"Mar Hershenson",
			"Pear",
			"Xampla",
			"Bear Flag Robotics",
			"Nextmind",
			"Mars",
			"foot-long sandwiches",
			"zoo anniversary",
			"straw",
			"camping-trip",
			"quadrilateral",
			"Akshit Mehta",
			"Amazon Fresh",
			"Standard Rover",
			"Grab-a-Tron",
			"R.A.Z.E"
		];

		expect(text).not.toContain("Source Activity Anchors:");
		expect(text).toContain("**Completion evidence:**");
		for (const anchor of expectedAnchors) {
			expect(text, anchor).toContain(anchor);
		}
		for (const originalReference of originalReferences) {
			expect(text, originalReference).toContain(originalReference);
		}

		expect(text).not.toMatch(
			/Juni|Recording Studio|your instructor|with your instructor|Whiteboard|Learning Targets|HQ Support|Slack|Password/i
		);
		expect(text).not.toMatch(/\bshould\b/i);
		expect(text).not.toContain("static.junilearning.com");
	});

	it("preserves Late Elementary A math original activity anchors with neutral wording", async () => {
		const course = await loadRawCourse("late-elementary-a-math");
		expect(course).not.toBeNull();
		if (!course) return;

		const text = allCourseText(course);
		const expectedAnchors = [
			"Prize Money Place-Value Exchange",
			"Party Food Rounding and Store Distance",
			"Millionaire Addition and Subtraction Review",
			"Soccer Season Team Skill Draft",
			"Soccer Season Synergy Adjustment",
			"Character Factor Arrangement",
			"Halloween Candy One-Digit Multiplication",
			"Birthday Treat Two-Digit Multiplication",
			"Farm Egg Carton Division",
			"Arielle Investment Stage Split",
			"Arielle Company Portfolio Choice",
			"Arielle Reinvestment Growth Plan",
			"Multiplication and Operations Check",
			"Lines, Segments, and Rays Sort",
			"Compass Turn Angle Route",
			"Triangle Attribute Sort",
			"Obtuse Life Shape Photo Collection",
			"Gallery Light Angle Setup",
			"Puppy Pen Perimeter and Symmetry",
			"Quadrilateral Attribute Sort",
			"Backyard Pool Area and Volume",
			"LA River Elevated Park Plan",
			"LA River Pool and Hot Tub Volume Plan",
			"Geometry and Measurement Check"
		];
		const originalReferences = [
			"236 one-dollar bills",
			"57 ten-dollar bills",
			"3 hundred-dollar bills",
			"$14.82",
			"3,218 feet",
			"3,253 feet",
			"Who Wants To Be A Millionaire",
			"Chandan Lodha",
			"5v5 soccer",
			"Oliver",
			"Zai",
			"factors",
			"50",
			"90",
			"Halloween",
			"Snickers",
			"25 classmates",
			"farm egg",
			"122 eggs",
			"Arielle Zuckerberg",
			"$5,134,533",
			"Xampla",
			"Bear Flag Robotics",
			"Nextmind",
			"Playco",
			"CookUnity",
			"Air Protein",
			"Spoon",
			"Literati",
			"SkyDrive",
			"line segment",
			"ray",
			"compass",
			"triangles",
			"Bill Lee",
			"Obtuse Life",
			"perpendicular",
			"23 degrees",
			"puppy",
			"quadrilateral",
			"backyard pool",
			"Dana McKinney",
			"L.A. River",
			"7,280 cubic feet",
			"91-foot width"
		];

		expect(text).not.toContain("Source Activity Anchors:");
		expect(text).toContain("**Completion evidence:**");
		for (const anchor of expectedAnchors) {
			expect(text, anchor).toContain(anchor);
		}
		for (const originalReference of originalReferences) {
			expect(text, originalReference).toContain(originalReference);
		}

		expect(text).not.toMatch(
			/Juni|Recording Studio|your instructor|with your instructor|Whiteboard|Learning Targets|HQ Support|Slack|Password/i
		);
		expect(text).not.toMatch(/\bshould\b/i);
		expect(text).not.toContain("static.junilearning.com");
	});

	it("preserves Late Elementary B math original activity anchors with neutral wording", async () => {
		const course = await loadRawCourse("late-elementary-b-math");
		expect(course).not.toBeNull();
		if (!course) return;

		const text = allCourseText(course);
		const expectedAnchors = [
			"Hot Dog Contest Equivalent Fractions",
			"Chore Ribbon Fraction Ordering",
			"Relay Race Fraction Progress",
			"Fraction of a Fraction Models",
			"Pie Box Fraction Division",
			"Angela Tesla Footprint Report",
			"Carbon Lighthouse Chiffon Cake Ratios",
			"Phone Savings Decimal Exchange",
			"Race Time Decimal Ranking",
			"Birthday Salsa Decimal Budget",
			"Rahul YouTube Views Table",
			"Facebook Sharing Growth Goal",
			"Video Demographics Fraction Analysis",
			"Fractions and Decimals Check",
			"Guinness Unit Conversion Rankings",
			"Israel Argo AI Blueprint Conversion",
			"Autonomous Test Drive Stop Map",
			"Dice and Coin Score Expressions",
			"Donut Shop Production Plan",
			"Birthday Party Division Budget",
			"Town Map Coordinate Routes",
			"Zoo Animal Growth Coordinate Tables",
			"Chanh Tesla Orbit Measurement",
			"Tesla-Retriever Intercept Simulation",
			"Orbit Speed Comparison",
			"Units, Expressions, and Coordinates Check"
		];
		const originalReferences = [
			"hot dog",
			"20 hot dogs",
			"3/4 meter",
			"7/8 meter",
			"relay race",
			"1/8",
			"3/16",
			"2/5 x 1/2",
			"six-flavor pie",
			"Angela Kwok",
			"Carbon Lighthouse",
			"Tesla",
			"175,000 tons",
			"130,000 tons",
			"36 cups",
			"9,450 pennies",
			"4,561 dimes",
			"1.264 seconds",
			"salsa",
			"$10.97",
			"$0.83 tax",
			"Rahul Pandey",
			"YouTube",
			"Facebook",
			"178.603k",
			"3,830",
			"Guinness",
			"Lana",
			"Trey",
			"Israel Kositsky",
			"Argo AI",
			"2,900-pound",
			"1,000-mile",
			"1.61 kilometers",
			"donut shop",
			"326 daily customers",
			"378 guests",
			"192 cars",
			"train stop 8",
			"bus stop 11",
			"Charlie",
			"emperor penguin",
			"Kondo",
			"giant panda",
			"Chanh Nguyen",
			"Tesla-Retriever 9000",
			"98 million miles",
			"0.5 and 3 AU",
			"50,000 mph"
		];

		expect(text).not.toContain("Source Activity Anchors:");
		expect(text).toContain("**Completion evidence:**");
		for (const anchor of expectedAnchors) {
			expect(text, anchor).toContain(anchor);
		}
		for (const originalReference of originalReferences) {
			expect(text, originalReference).toContain(originalReference);
		}

		expect(text).not.toMatch(
			/Juni|Recording Studio|your instructor|with your instructor|Whiteboard|Learning Targets|HQ Support|Slack|Password/i
		);
		expect(text).not.toMatch(/\bshould\b/i);
		expect(text).not.toContain("static.junilearning.com");
	});

	it("preserves Joy of Reading original activity anchors with neutral wording", async () => {
		const course = await loadRawCourse("early-elementary-a-reading");
		expect(course).not.toBeNull();
		if (!course) return;

		const text = allCourseText(course);
		const expectedAnchors = [
			"Character Investigator Report",
			"Sweet Sixteen Character Evidence",
			"Faithful Friend Plot Diagram",
			"Happy Halloween Plot and Character Check",
			"Groceries Storyboard",
			"Megalodon News Report",
			"Figurative Language Drawing Set",
			"Kevin's Crafts Story Review",
			"Lab-Grown Meat Main Idea Report",
			"Bacon and Mittens Review or Figurative Art",
			"Dinosaur Footprint Interview or News Report"
		];

		expect(text).not.toContain("Source Activity Anchors:");
		expect(text).toContain("The Secret Ingredient");
		expect(text).toContain("Moira, Sunli, and Zaira");
		expect(text).toContain("The Faithful Friend");
		expect(text).toContain("Ancient megalodon sharks were huge!");
		expect(text).toContain("hard nut to crack");
		expect(text).toContain("Kevin's Crafts");
		expect(text).toContain("Bacon and Mittens");
		expect(text).toContain("Four-year-old makes a big discovery!");
		expect(text).toContain("**Completion evidence:**");
		for (const anchor of expectedAnchors) {
			expect(text).toContain(anchor);
		}

		expect(text).not.toMatch(
			/Juni|Recording Studio|your instructor|with your instructor|Whiteboard|Learning Targets|HQ Support|Slack|Password/i
		);
		expect(text).not.toMatch(/\bshould\b/i);
		expect(text).not.toContain("static.junilearning.com");
	});

	it("preserves Middle School A literature source anchors with neutral wording", async () => {
		const course = await loadRawCourse("middle-school-a-literature");
		expect(course).not.toBeNull();
		if (!course) return;

		const text = allCourseText(course);
		const expectedAnchors = [
			"Lead Prankster Main Idea Model",
			"Kyra's Fear Main Idea and Evidence",
			"Soccer Summer Best Evidence Sort",
			"Car Ride Inference Record",
			"Show-Don't-Tell Paragraph Draft",
			"Reading Literature Check-In Record",
			"Theme Versus Main Idea Sort",
			"Characters and Themes Analysis",
			"Point of View Effects Lab",
			"Connotation Nation Word Choice Record",
			"Sound Pattern Annotation",
			"Analysis Toolbox Paragraph",
			"Analyzing Literature Check-In Record",
			"Writing from an Image Literature Showcase"
		];

		expect(text).not.toContain("Source Activity Anchors:");
		expect(text).toContain("Lead Prankster");
		expect(text).toContain("Kyra's Fear");
		expect(text).toContain("Soccer Summer");
		expect(text).toContain("Car Ride");
		expect(text).toContain("showing-versus-telling");
		expect(text).toContain("Cinderella");
		expect(text).toContain("Snow White");
		expect(text).toContain("Connotation Nation");
		expect(text).toContain("rhyme and alliteration");
		expect(text).toContain("Analysis Toolbox");
		expect(text).toContain("Writing from an Image");
		expect(text).toContain("**Completion evidence:**");
		for (const anchor of expectedAnchors) {
			expect(text).toContain(anchor);
		}

		expect(text).not.toMatch(
			/Juni|Recording Studio|your instructor|with your instructor|Whiteboard|Learning Targets|HQ Support|Slack|Password/i
		);
		expect(text).not.toMatch(/\bshould\b/i);
		expect(text).not.toContain("static.junilearning.com");
	});

	it("preserves Middle School B writing source anchors with neutral wording", async () => {
		const expectedAnchors = [
			"Steph Curry Argument Parts Model",
			"Hypothetical Hannah Counterclaim Lab",
			"Colon and Comma Quote Integration",
			"Car Ride Evidence Analysis Paragraph",
			"Arguing for the Opposition",
			"Conclusion and Transition Revision Pass",
			"Color-Coded Argument Revision",
			"Opposition Paragraph Revision",
			"Analytical Writing Check-In Record",
			"Character Objective Bank",
			"Nemo Objective-to-Qualities Flowchart",
			"Character Portrait Iceberg",
			"Objective-to-Conflict Generator",
			"Plot Curve Event Map",
			"Jonah and Caleb Point-of-View Rewrite",
			"Final Story Revision",
			"Fiction Writing Check-In Record",
			"Master Project Path and Evidence Plan",
			"Analytical Writing Presentation",
			"Fiction Writing Presentation"
		];
		const originalReferences = [
			"Steph Curry",
			"cell phones at school",
			"TikTok dances",
			"Hypothetical Hannah",
			"dog-versus-cat",
			"Car Ride",
			"transitional devices",
			"color-coding",
			"Harry Potter",
			"Wonder Woman",
			"Spider-Man",
			"Nemo",
			"character portrait",
			"plot curve",
			"Jonah and Caleb",
			"Final Story",
			"Analytical Writing Presentation",
			"Fiction Writing Presentation"
		];

		for (const courseId of [
			"middle-school-b-writing",
			"middle-school-b-writing-retake"
		]) {
			const course = await loadRawCourse(courseId);
			expect(course, courseId).not.toBeNull();
			if (!course) continue;

			const text = allCourseText(course);

			expect(text, courseId).not.toContain("Source Activity Anchors:");
			expect(text, courseId).toContain("**Completion evidence:**");
			for (const anchor of expectedAnchors) {
				expect(text, `${courseId}: ${anchor}`).toContain(anchor);
			}
			for (const originalReference of originalReferences) {
				expect(text, `${courseId}: ${originalReference}`).toContain(
					originalReference
				);
			}

			expect(text, courseId).not.toMatch(
				/Juni|Recording Studio|your instructor|with your instructor|Whiteboard|Learning Targets|HQ Support|Slack|Password/i
			);
			expect(text, courseId).not.toMatch(/\bshould\b/i);
			expect(text, courseId).not.toContain("static.junilearning.com");
		}
	});

	it("preserves Middle School C grammar source anchors with neutral wording", async () => {
		const expectedAnchors = [
			"Snow Day Parts-of-Speech Sort",
			"Pronoun Agreement Repair",
			"Verb and Adverb Action Sort",
			"Gerund, Participle, and Infinitive Identification",
			"Preposition Phrase and Interjection Sort",
			"FANBOYS and Subordination Contrast",
			"Conjunction and Comma Practice",
			"Parts-of-Speech Concept Review",
			"Parts-of-Speech Application Passage",
			"Capitalization Repair Pass",
			"End-Mark and Quotation Repair",
			"Phrase vs. Clause Independence Test",
			"Dependent Clause Practice",
			"Comma Rule Diagnosis",
			"More Practice with Commas",
			"Semicolon Independent-Clause Join",
			"Colon List, Explanation, and Quotation Starter",
			"Comma Splice and Run-On Repair",
			"Coordinate vs. Cumulative Adjective Test",
			"Common Errors Passage Edit",
			"Dashes, Parentheses, and Ellipses Meaning Check",
			"Punctuation Concept Review",
			"Punctuation Application Passage",
			"Subject-Predicate Core Map",
			"Direct and Indirect Object Sentence Diagram",
			"Subjects, Predicates, and Objects Practice",
			"Phrase-and-Clause Sentence Expansion",
			"Sentence Type Identification and Rewrite",
			"More Practice with Sentence Types",
			"Sentence Structure Concept Review",
			"Sentence Structure Application Passage",
			"Grammar Master Project Path and Evidence Plan",
			"Grammar and Mechanics Presentation",
			"Personal Narrative Mechanics Portfolio"
		];
		const originalReferences = [
			"snow day",
			"antecedent",
			"gerund",
			"participle",
			"infinitive",
			"prepositional phrases",
			"interjections",
			"FANBOYS",
			"subordinating conjunction",
			"capitalization",
			"quotation marks",
			"phrases",
			"clauses",
			"commas",
			"semicolons",
			"colons",
			"comma splices",
			"run-on",
			"coordinate",
			"cumulative",
			"dashes",
			"parentheses",
			"ellipses",
			"subjects",
			"predicates",
			"direct object",
			"indirect object",
			"simple",
			"compound",
			"complex",
			"Grammar and Mechanics Presentation",
			"Personal Narrative"
		];

		const course = await loadRawCourse("middle-school-c-grammar");
		expect(course).not.toBeNull();
		if (!course) return;

		const text = allCourseText(course);

		expect(text).not.toContain("Source Activity Anchors:");
		expect(text).toContain("**Completion evidence:**");
		for (const anchor of expectedAnchors) {
			expect(text, anchor).toContain(anchor);
		}
		for (const originalReference of originalReferences) {
			expect(text, originalReference).toContain(originalReference);
		}

		expect(text).not.toMatch(
			/Juni|Recording Studio|your instructor|with your instructor|Whiteboard|Learning Targets|HQ Support|Slack|Password/i
		);
		expect(text).not.toMatch(/\bshould\b/i);
		expect(text).not.toContain("static.junilearning.com");
	});

	it("preserves Novel Writing source anchors with neutral wording", async () => {
		const expectedAnchors = [
			"Novel Scope and Word-Count Plan",
			"Protagonist, Antagonist, and Objective Portraits",
			"Opening Scene Character Introduction",
			"Conflict Ladder",
			"Scene Placement and Atmosphere Draft",
			"Narrative Arc Map",
			"Character Change and Rising Action Check",
			"Point-of-View Consistency Audit",
			"Midpoint Self-Assessment and Revision Plan",
			"Revised Excerpt Reflection",
			"Sensory Setting Expansion",
			"Dialogue Formatting and Subtext Pass",
			"Highest-Tension Conflict Draft",
			"Ending Cause-and-Effect Chain",
			"Final Revision Portfolio",
			"Publication Readiness Reflection"
		];
		const originalReferences = [
			"short story",
			"word count",
			"protagonist",
			"antagonist",
			"character objective",
			"conflict",
			"setting",
			"narrative arc",
			"rising action",
			"point of view",
			"revision plan",
			"sensory language",
			"dialogue",
			"falling action",
			"resolution",
			"publication"
		];

		const course = await loadRawCourse("novel-writing");
		expect(course).not.toBeNull();
		if (!course) return;

		const text = allCourseText(course);

		expect(text).not.toContain("Source Activity Anchors:");
		expect(text).toContain("**Completion evidence:**");
		for (const anchor of expectedAnchors) {
			expect(text, anchor).toContain(anchor);
		}
		for (const originalReference of originalReferences) {
			expect(text, originalReference).toContain(originalReference);
		}

		expect(text).not.toMatch(
			/Juni|Recording Studio|your instructor|with your instructor|Whiteboard|Learning Targets|HQ Support|Slack|Password/i
		);
		expect(text).not.toMatch(/\bshould\b/i);
		expect(text).not.toContain("static.junilearning.com");
	});

	it("keeps all source-library-backed courses registered and neutral", async () => {
		const sourceLibraryBackedCourseIds = [
			"scratch-level-1-bootcamp",
			"early-elementary-a-math",
			"early-elementary-b-math",
			"late-elementary-a-math",
			"late-elementary-b-math",
			"early-elementary-a-reading",
			"early-elementary-b-picture-book",
			"introduction-to-public-speaking",
			"middle-school-a-literature",
			"middle-school-b-writing",
			"middle-school-b-writing-retake",
			"middle-school-c-grammar",
			"novel-writing",
			"smart-money-personal-finance",
			"money-minded-investing",
			"entrepreneurship-101",
			"usaco-bronze-on-demand"
		] as const;
		const catalogIds = new Set(courseCatalog.map(course => course.id));

		for (const courseId of sourceLibraryBackedCourseIds) {
			expect(catalogIds.has(courseId), courseId).toBe(true);

			const course = await loadRawCourse(courseId);
			expect(course, courseId).not.toBeNull();
			if (!course) continue;

			const teachingModules = course.modules.filter(
				module => module.kind !== "appendix"
			);
			const text = allCourseText(course);

			expect(teachingModules.length, courseId).toBeGreaterThanOrEqual(1);
			expect(wordCount(text), courseId).toBeGreaterThan(600);
			expect(text, courseId).toContain("**Concept path:**");
			expect(text, courseId).toContain("Core topics in this module:");
			expect(text, courseId).toContain("**Completion evidence:**");
			expect(text, courseId).not.toMatch(
				/Juni|Recording Studio|your instructor|with your instructor|Whiteboard|Learning Targets|HQ Support|Slack/i
			);
			expect(text, courseId).not.toMatch(/\bshould\b/i);
			expect(text, courseId).not.toContain("static.junilearning.com");
		}
	});

	it("reserves source-library static assets from original source files", async () => {
		const expectedAssetsByCourse = {
			"usaco-bronze-on-demand": [
				"UB1.png",
				"UB2.png",
				"UB3.png",
				"UB4.png",
				"UB5.png",
				"UB6.png",
				"missionTitle2.png",
				"nextStepTitle.png"
			]
		} as const;

		for (const [courseId, filenames] of Object.entries(
			expectedAssetsByCourse
		)) {
			const course = await loadRawCourse(courseId);
			expect(course).not.toBeNull();
			if (!course) continue;

			const mediaModule = course.modules.find(
				module => module.title === "Pending Static Assets"
			);
			expect(mediaModule?.kind).toBe("appendix");
			const content = mediaModule?.curriculum
				.map(item => item.content)
				.join("\n\n") ?? "";

			for (const filename of filenames) {
				expect(content).toContain(staticMediaUrl(filename));
				expect(hasPendingStaticMediaNotice(content, filename)).toBe(true);
			}
			expect(content).not.toContain("static.junilearning.com");
		}
	});

	it("adds Pre-Algebra A reference archive from the math sequence", async () => {
		const course = await loadRawCourse("pre-algebra-a");
		expect(course).not.toBeNull();
		if (!course) return;

		const text = allCourseText(course);
		const mediaLinks = course.modules.flatMap(module =>
			[...module.curriculum, ...module.supplementalProjects]
				.map(item => item.mediaLink)
				.filter((link): link is string => Boolean(link))
		);

		expect(course.modules.map(module => module.title)).toEqual([
			"Pre-Algebra A Kick-Off",
			"PAA1-PAA2 Arithmetic Foundations",
			"PAA3-PAA7 Fractions and Arithmetic",
			"PAA8-PAA12 Decimals, Percents, Ratios, and Rates",
			"Check-In #1",
			"PAA13-PAA17 Expressions and Sequences",
			"PAA18-PAA23 Exponents, Roots, and Scientific Notation",
			"Check-In #2 and Capstone",
			"Pre-Algebra A Reference Archive",
			"Pending Static Assets"
		]);
		expect(text).toContain("Project: Starting a Gardening Business");
		expect(text).toContain("Project: Growing the Gardening Business");
		expect(text).toContain("Project: High and Low Species");
		expect(text).toContain("Project: Mochi's Product Adventure");
		expect(text).toContain("Project: Cookie Catering");
		expect(text).toContain("Project: Designing the Perfect Scanning Device");
		expect(text).toContain("Project: Symptom Spree");
		expect(text).toContain("Project: Red Hot Chilli Chicken");
		expect(text).toContain("Master Project: Pre-Algebra A");
		expect(text).toContain("Reference map:");
		for (const originalReference of [
			"$3000 starting investment",
			"$1500 of inventory",
			"$700 YouTube ad",
			"four tenths of a bag",
			"1,537 minutes",
			"$.000000000265 x 10^9",
			"Giselle Herrera",
			"Rockaway Initiative for Sustainability & Equity",
			"Nikita Jain",
			"12 million pink ropes",
			"20 million white and blue blankets",
			"Chipidee Cookies",
			"300 cookies",
			"2.25 cups of flour",
			"$1.35 for vanilla",
			"Aviv Gilboa",
			"finger scanning",
			"face scanning",
			"phone scanning",
			"Michelle Lee",
			"t^4",
			"4, 16, 64, 256, and 1024",
			"Red Hot Chilli Chicken",
			"Dani California 615",
			"53 new active orders per month",
				"at least 2 student-created problems"
		]) {
			expect(text, originalReference).toContain(originalReference);
		}
		expect(text).toContain("signed numbers");
		expect(text).toContain("d = rt");
		expect(text).toContain("scientific notation");
		expect(text).toContain("paa_kickoff_0.png");
		expect(text).toContain("paa_kickoff_1.png");
		expect(text).toContain("paa1_pset1_0.png");
		expect(text).toMatch(/Pending media/i);
		expect(text).not.toMatch(
			/Juni|Recording Studio|your instructor|with your instructor|Whiteboard|Learning Targets/i
		);
		expect(text).not.toMatch(/\bshould\b/i);
		expect(mediaLinks).toEqual([
			"https://static.classes.jacobdanderson.net/paa_kickoff_0.png",
			"https://static.classes.jacobdanderson.net/paa_kickoff_1.png",
			"https://www.youtube.com/watch?v=8nKPC-WmLjU"
		]);
	});

	it("adds Pre-Algebra B reference archive from the math sequence", async () => {
		const course = await loadRawCourse("pre-algebra-b");
		expect(course).not.toBeNull();
		if (!course) return;

		const text = allCourseText(course);
		const mediaLinks = course.modules.flatMap(module =>
			[...module.curriculum, ...module.supplementalProjects]
				.map(item => item.mediaLink)
				.filter((link): link is string => Boolean(link))
		);

		expect(course.modules.map(module => module.title)).toEqual([
			"Pre-Algebra B Kick-Off",
			"PAB1-PAB5 Data, Averages, and Graphs",
			"Check-In #1: Pre-Algebra B Data and Graphing",
			"PAB6-PAB9 Lines, Angles, Triangles, and Similarity",
			"PAB10-PAB14 Polygons, Area, Circles, and Solids",
			"Check-In #2: Pre-Algebra B Geometry",
			"PAB15-PAB19 Factors, Multiples, and Number Structure",
			"PAB20-PAB23 Counting, Probability, and Applied Modeling",
			"Check-In #3 and Capstone: Pre-Algebra B",
			"Pre-Algebra B Reference Archive"
		]);
		expect(text).toContain("Project: Exploring the World with Marco");
		expect(text).toContain("Project: Gymnastics Geometry Challenge");
		expect(text).toContain("Project: Uber Internship Challenge");
		expect(text).toContain("Project: The MARVELous Theme Park");
		expect(text).toContain("Project: eSmash");
		expect(text).toContain("Project: Airtable Revamped");
		expect(text).toContain("Master Project: Pre-Algebra B");
		expect(text).toContain("Reference map:");
		for (const originalReference of [
			"15 travel responses",
			"range of 7",
			"mode of 1",
			"50, 0, 38, and 9",
			"170 miles",
			"130 miles",
			"Astor Place Alamo sculpture",
			"15-foot side lengths",
			"40 million",
			"560,000",
			"$1.2 million",
			"$1.7 million",
			"25 city responses",
			"18 rural responses",
			"Texas, Colorado, California, New York, Ohio, Kentucky, New Mexico, Pennsylvania, and Arizona",
			"Marco Satala",
			"Corporate Immigration Partners",
			"Kara Christensen",
			"351 degrees",
			"372 degrees",
			"365 degrees",
			"Ben Dreier",
			"1.5 miles",
			"3.0 miles",
			"0.75 miles",
			"Akanksha Bajaj",
			"30-minute tour",
			"15-minute arcade reset",
			"Will Brooke",
			"Electronic Arts",
			"Liquid Hungrybox as 7/9",
			"243/1024",
			"Christine Yeh",
			"90, 43, 98, 18",
			"7 feet by 3 feet by 4 feet",
			"3763 = 53 * 71",
			"753,943,372",
			"at least 2 original problems"
		]) {
			expect(text, originalReference).toContain(originalReference);
		}
		expect(text).toContain("range");
		expect(text).toContain("Pythagorean theorem");
		expect(text).toContain("probability");
		expect(text).toContain("pab5_0.png");
		expect(text).toContain("pab14_0.png");
		expect(text).toContain("pab22_0.png");
		expect(text).toMatch(/Pending media/i);
		expect(text).not.toMatch(
			/Juni|Recording Studio|your instructor|with your instructor|Whiteboard|Learning Targets/i
		);
		expect(text).not.toMatch(/\bshould\b/i);
		expect(mediaLinks).toEqual([
			"https://static.classes.jacobdanderson.net/pab5_0.png",
			"https://www.youtube.com/watch?v=SMLknNJt5Pk",
			"https://static.classes.jacobdanderson.net/pab14_0.png",
			"https://static.classes.jacobdanderson.net/pab22_0.png"
		]);
	});

	it("adds Algebra 1A reference archive from the math sequence", async () => {
		const course = await loadRawCourse("algebra-1a");
		expect(course).not.toBeNull();
		if (!course) return;

		const text = allCourseText(course);
		const moduleTitles = course.modules.map(module => module.title);

		expect(moduleTitles).toContain("Reference Archive: Algebra 1A");
		expect(text).toContain("Algebra 1A Reference Map");
		for (const originalReference of [
			"Kick-off restaurant project",
			"delivery-coordinate interpretation",
			"Movie Star Status",
			"Free Swag",
			"Community Data Analysis",
			"Predicting Avalanches",
			"Cytogenetics Quest",
			"Battle of the Publications",
			"two self-authored problems",
			"https://www.geogebra.org/geometry/gvdvu8g9",
			"https://www.geogebra.org/geometry/nwcaepuc",
			"https://www.desmos.com/calculator/zhckru7sxb",
			"https://drive.google.com/file/d/1YBd552y9UR7QltUlogW00t9BRMtmb22s/view?usp=sharing",
			"https://drive.google.com/file/d/1y5h6nw4yjbxRGTZKGQ3sY5nIDn4G5fnq/view?usp=drive_link"
		]) {
			expect(text, originalReference).toContain(originalReference);
		}

		for (const filename of [
			"aa4_pset1_0.png",
			"aa5_pset2_12.png",
			"aa7_0.png",
			"aa8_pset2_sol0.png",
			"checkin2_app_2.png",
			"checkin3_graphing_1.png"
		]) {
			expect(text, filename).toContain(staticMediaUrl(filename));
			expect(hasPendingStaticMediaNotice(text, filename)).toBe(true);
		}

		expect(text).not.toMatch(
			/Juni|Recording Studio|your instructor|with your instructor|Whiteboard|Learning Targets|static\.junilearning/i
		);
		expect(text).not.toMatch(/\bshould\b/i);
	});

	it("adds Algebra 1B reference archive from the math sequence", async () => {
		const course = await loadRawCourse("algebra-1b");
		expect(course).not.toBeNull();
		if (!course) return;

		const text = allCourseText(course);
		const moduleTitles = course.modules.map(module => module.title);

		expect(moduleTitles).toContain("Reference Archive: Algebra 1B");
		expect(text).toContain("Algebra 1B Reference Map");
		for (const originalReference of [
			"Kick-off amusement-park project",
			"Smart and Elegant",
			"Half-Court Challenge",
			"Put Me in Coach",
			"The Mysteries of Light",
			"particle-wave duality",
			"Radiofungi",
			"astrobiology context",
			"two self-authored problems",
			"https://www.desmos.com/calculator/i1r7bykug4",
			"https://www.desmos.com/calculator/n04wtuzlfe",
			"https://ophysics.com/l5.html",
			"https://www.youtube.com/watch?v=eJTfcV1ZceE",
			"https://www.youtube.com/watch?v=FJDWHm_ZjoM",
			"https://drive.google.com/file/d/1b0Txmj4dY1UOadVDpPHM0oaccMvQEUTs/view?usp=sharing",
			"https://drive.google.com/file/d/12FIj99-PelJqZS0frtjk9PNjv7hxjyBU/view?usp=sharing"
		]) {
			expect(text, originalReference).toContain(originalReference);
		}

		for (const filename of [
			"ab_kickoff_0.png",
			"ab9_0.png",
			"ab9_2.png",
			"ab13_concept2_0.png",
			"ab15_pset1_14.png",
			"ab20_4.png",
			"checkin2_advanced_1_updated.png",
			"checkin2_app_5.png"
		]) {
			expect(text, filename).toContain(staticMediaUrl(filename));
			expect(hasPendingStaticMediaNotice(text, filename)).toBe(true);
		}

		expect(text).not.toMatch(
			/Juni|Recording Studio|your instructor|with your instructor|Whiteboard|Learning Targets|static\.junilearning/i
		);
		expect(text).not.toMatch(/\bshould\b/i);
	});

	it("adds Algebra 2A reference archive from the math sequence", async () => {
		const course = await loadRawCourse("algebra-2a");
		expect(course).not.toBeNull();
		if (!course) return;

		const text = allCourseText(course);
		const moduleTitles = course.modules.map(module => module.title);

		expect(moduleTitles).toContain("Reference Archive: Algebra 2A");
		expect(text).toContain("Algebra 2A Reference Map");
		for (const originalReference of [
			"Complex numbers",
			"Quadratics",
			"Higher-degree polynomials",
			"Rational functions",
			"Radical and piecewise functions",
			"https://www.youtube.com/watch?v=2lbABbfU6Zc&feature=youtu.be",
			"https://www.geogebra.org/calculator/py7khf9c",
			"https://www.desmos.com/calculator/250ny4ueuq",
			"https://www.desmos.com/calculator/auz2qerbgj"
		]) {
			expect(text, originalReference).toContain(originalReference);
		}

		for (const filename of [
			"ala1_concept2_0.png",
			"ala2_concept1_0.png",
			"ala7_concept1_7.png",
			"ala8_concept1_8.png",
			"ala10_pset2_9.png",
			"ala11_pset1_14(1).png",
			"checkin3_piecewise_1.png",
			"checkin3_rational_0.png"
		]) {
			expect(text, filename).toContain(staticMediaUrl(filename));
			expect(hasPendingStaticMediaNotice(text, filename)).toBe(true);
		}

		expect(text).not.toMatch(
			/Juni|Recording Studio|your instructor|with your instructor|Whiteboard|Learning Targets|static\.junilearning/i
		);
		expect(text).not.toMatch(/\bshould\b/i);
	});

	it("adds Algebra 2B reference archive from the math sequence", async () => {
		const course = await loadRawCourse("algebra-2b");
		expect(course).not.toBeNull();
		if (!course) return;

		const text = allCourseText(course);
		const moduleTitles = course.modules.map(module => module.title);

		expect(moduleTitles).toContain("Reference Archive: Algebra 2B");
		expect(text).toContain("Algebra 2B Reference Map");
		for (const originalReference of [
			"Logarithms and the natural logarithm",
			"Growth applications",
			"Matrix operations",
			"Statistics and regression",
			"Trigonometry",
			"https://www.desmos.com/calculator",
			"https://www.desmos.com/calculator/lywhybetzt",
			"https://matrixcalc.org/en/",
			"https://www.geogebra.org/geometry/harzmnkp",
			"https://www.geogebra.org/geometry/grcqk5kt"
		]) {
			expect(text, originalReference).toContain(originalReference);
		}

		for (const filename of [
			"alb1_concept1_0.png",
			"alb2_concept1_2.png",
			"alb7_concept2_2.png",
			"alb7_pset2_4.png",
			"alb8_concept1_8.png",
			"alb9_concept1_0.png",
			"checkin2_ds_1.png",
			"checkin1_trig_1.png"
		]) {
			expect(text, filename).toContain(staticMediaUrl(filename));
			expect(hasPendingStaticMediaNotice(text, filename)).toBe(true);
		}

		expect(text).not.toMatch(
			/Juni|Recording Studio|your instructor|with your instructor|Whiteboard|Learning Targets|static\.junilearning/i
		);
		expect(text).not.toMatch(/\bshould\b/i);
	});

	it("adds Geometry A reference archive from the math sequence", async () => {
		const course = await loadRawCourse("geometry-a");
		expect(course).not.toBeNull();
		if (!course) return;

		const text = allCourseText(course);
		const mediaLinks = course.modules.flatMap(module =>
			[...module.curriculum, ...module.supplementalProjects]
				.map(item => item.mediaLink)
				.filter((link): link is string => Boolean(link))
		);

		expect(course.modules.map(module => module.title)).toEqual([
			"Geometry A Foundations: Definitions, Logic, and Proofs",
			"GEOA4-GEOA5 Lines, Angles, and Coordinate Geometry",
			"Check-In #1: Foundations and Lines",
			"GEOA6-GEOA9 Triangles, Congruence, Similarity, and Right Triangles",
			"Check-In #2: Triangle Relationships",
			"GEOA10-GEOA13 Triangle Centers, Inequalities, and Trigonometry",
			"Check-In #3 and Geometry A Capstone",
			"Geometry A Reference Archive",
			"Pending Static Assets"
		]);
		expect(text).toContain("GEOA1 Definitions and Notation");
		expect(text).toContain("GEOA2 Logical Reasoning");
		expect(text).toContain("GEOA3 Proofs");
		expect(text).toContain("GEOA4 Parallel and Perpendicular Lines");
		expect(text).toContain("GEOA5 Coordinate Geometry");
		expect(text).toContain("GEOA6 Classifying Triangles");
		expect(text).toContain("GEOA7-GEOA8 Congruence and Similarity");
		expect(text).toContain("GEOA9 Right Triangles");
		expect(text).toContain("GEOA10 Bisectors");
		expect(text).toContain("GEOA11 Medians and Altitudes");
		expect(text).toContain("GEOA12-GEOA13 Inequalities and Basic Trigonometry");
		expect(text).toContain("Project: Geometry Notation Reference Map");
		expect(text).toContain("Project: Proof Repair Lab");
		expect(text).toContain("Project: Coordinate Line Design");
		expect(text).toContain("Project: Parallel-Line Proof Case File");
		expect(text).toContain("Project: Triangle Case File");
		expect(text).toContain("Project: Similarity Scale Plan");
		expect(text).toContain("Project: Triangle Center Blueprint");
		expect(text).toContain("Project: Trigonometry Measurement Plan");
		expect(text).toContain("Capstone: Geometry A Design Defense");
		expect(text).toContain("Geometry A Reference Map");
		expect(text).toContain("a^2 + b^2 = c^2");
		expect(text).toContain("SOH-CAH-TOA");
		expect(text).toContain("unsupported visual assumption");
		for (const originalReference of [
			"Geometry foundations",
			"Logical reasoning",
			"Proofs",
			"Lines and angles",
			"Coordinate geometry",
			"Triangle work",
			"https://www.khanacademy.org/math/geometry-home/geometric-constructions/geo-bisectors/v/constructing-a-perpendicular-line-using-a-compass-and-straightedge?modal=1",
			"https://www.khanacademy.org/math/geometry-home/geometric-constructions/polygons-inscribed-in-circles/v/constructing-equilateral-triangle-inscribed-in-circle?modal=1",
			"http://math2.org/math/trig/tables.htm",
			"https://www.desmos.com/scientific"
		]) {
			expect(text, originalReference).toContain(originalReference);
		}

		for (const filename of [
			"geoa1_concept3_0.png",
			"geoa4_concept2_1.png",
			"geoa7_pset4_22.png",
			"geoa8_pset2_21.png",
			"geoa13_concept2_4.png",
			"checkin3_trig_0.png"
		]) {
			expect(text, filename).toContain(staticMediaUrl(filename));
			expect(hasPendingStaticMediaNotice(text, filename)).toBe(true);
		}
		expect(text).not.toMatch(
			/Juni|Recording Studio|your instructor|with your instructor|Whiteboard|Learning Targets|static\.junilearning/i
		);
		expect(text).not.toMatch(/\bshould\b/i);
		expect(mediaLinks).toEqual([]);
	});

	it("adds Geometry B reference archive from the math sequence", async () => {
		const course = await loadRawCourse("geometry-b");
		expect(course).not.toBeNull();
		if (!course) return;

		const text = allCourseText(course);
		const mediaLinks = course.modules.flatMap(module =>
			[...module.curriculum, ...module.supplementalProjects]
				.map(item => item.mediaLink)
				.filter((link): link is string => Boolean(link))
		);

		expect(course.modules.map(module => module.title)).toEqual([
			"GEOB1-GEOB2 Quadrilaterals and Parallelograms",
			"GEOB3-GEOB4 Polygons and Circle Measurement",
			"GEOB5-GEOB6 Circle Theorems and Challenge Problems",
			"Check-In #1: Quadrilaterals, Polygons, and Circles",
			"GEOB7-GEOB8 Transformations",
			"GEOB9-GEOB10 Polyhedra and Round Solids",
			"Check-In #2 and Geometry B Capstone",
			"Geometry B Reference Archive",
			"Pending Static Assets"
		]);
		expect(text).toContain("GEOB1 Introduction to Quadrilaterals");
		expect(text).toContain("GEOB1 Trapezoids");
		expect(text).toContain("GEOB2 Parallelograms, Rhombi, Rectangles, and Squares");
		expect(text).toContain("GEOB3 Properties and Area of Polygons");
		expect(text).toContain("GEOB4 Circumference, Arcs, Chords, Areas, and Sectors");
		expect(text).toContain("GEOB5 Inscribed, Central, Internal, and External Angles");
		expect(text).toContain("GEOB5 Tangents");
		expect(text).toContain("GEOB6 Challenge Circle Problems");
		expect(text).toContain("GEOB7 Translations and Rotations");
		expect(text).toContain("GEOB8 Reflections and Dilations");
		expect(text).toContain("GEOB9 Polyhedra, Prisms, and Pyramids");
		expect(text).toContain("GEOB10 Cylinders, Cones, and Spheres");
		expect(text).toContain("Project: Quadrilateral Classification Case File");
		expect(text).toContain("Project: Circle Measurement Design Brief");
		expect(text).toContain("Project: Circle Challenge Walkthrough");
		expect(text).toContain("Project: Transformation Rule Gallery");
		expect(text).toContain("Project: Packaging Design Optimization");
		expect(text).toContain("Capstone: Geometry B Design Defense");
		expect(text).toContain("180(n - 2)");
		expect(text).toContain("A = pi r^2");
		expect(text).toContain("V - E + F = 2");
		expect(text).toContain("Geometry B Reference Map");
		expect(text).toContain("Quadrilateral foundations");
		expect(text).toContain("Circle measurement");
		expect(text).toContain("Transformations");
		expect(text).toContain("Three-dimensional solids");
		expect(text).toContain("Geometry B Pending Static Assets");
		expect(text).toContain("http://pythagoreanmath.com/wp-content/uploads/2014/08/deriving-the-volume-of-a-pyramid.png");
		expect(text).toContain("https://ds055uzetaobb.cloudfront.net/brioche/uploads/Fv9rxkzWWN-90675.svg?width=350");
		expect(text).toContain("https://www.mathsisfun.com/geometry/images/sphere-cylinder-area2.svg");
		for (const filename of [
			"geob1_pset1_3(1).png",
			"checkin1_angles_2.png",
			"geob5_pset2_23.png",
			"geob8_pset2_19.png",
			"geob10_pset4_9.png"
		]) {
			expect(text, filename).toContain(staticMediaUrl(filename));
			expect(hasPendingStaticMediaNotice(text, filename)).toBe(true);
		}
		expect(text).not.toMatch(
			/Juni|Recording Studio|your instructor|with your instructor|Whiteboard|Learning Targets|static\.junilearning|app\.junilearning/i
		);
		expect(text).not.toMatch(/\bshould\b/i);
		expect(mediaLinks).toEqual([]);
	});

	it("adds Pre-Calculus A reference archive from the math sequence", async () => {
		const course = await loadRawCourse("pre-calculus-a");
		expect(course).not.toBeNull();
		if (!course) return;

		const text = allCourseText(course);
		const mediaLinks = course.modules.flatMap(module =>
			[...module.curriculum, ...module.supplementalProjects]
				.map(item => item.mediaLink)
				.filter((link): link is string => Boolean(link))
		);

		expect(course.modules.map(module => module.title)).toEqual([
			"PCTA1 Piecewise Functions",
			"PCTA2 Higher-Degree Polynomials",
			"PCTA3 Polynomial Division",
			"PCTA4 Zeros of Polynomials",
			"PCTA5 Graphing Polynomials",
			"PCTA6 Arithmetic and Geometric Sequences",
			"PCTA7 Area Under a Curve",
			"PCTA8 The Binomial Theorem",
			"Check-In #1: Polynomial and Sequence Foundations",
			"PCTA9 Rational Functions",
			"PCTA10 Rational Function Operations",
			"PCTA11 Logarithms and Exponents",
			"PCTA12 Function Inverses and Composition",
			"PCTA13 Circles and Ellipses",
			"PCTA14 Parabolas and Hyperbolas",
			"Check-In #2 and Pre-Calculus A Capstone",
			"Pre-Calculus A Reference Archive",
			"Pending Static Assets"
		]);
		expect(text).toContain("Concept: Piecewise Functions");
		expect(text).toContain("Concept: Polynomial Operations and Factoring");
		expect(text).toContain("Concept: Polynomial Long Division and Synthetic Division");
		expect(text).toContain("Concept: Zeros, Factors, and Polynomial Structure");
		expect(text).toContain("Concept: Polynomial Graph Features");
		expect(text).toContain("Concept: Sequences and Sums");
		expect(text).toContain("Concept: Area Under a Curve");
		expect(text).toContain("Concept: The Binomial Theorem");
		expect(text).toContain("Concept: Graphing Rational Functions");
		expect(text).toContain("Concept: Rational Expressions and Equations");
		expect(text).toContain("Concept: Logarithms, Identities, and Graphs");
		expect(text).toContain("Concept: Function Composition and Inverses");
		expect(text).toContain("Concept: Circles and Ellipses");
		expect(text).toContain("Concept: Parabolas, Hyperbolas, and Conic Intersections");
		expect(text).toContain("Riemann");
		expect(text).toContain("Pascal's triangle");
		expect(text).toContain("domain restrictions");
		expect(text).toContain("Capstone: Pre-Calculus A Modeling Portfolio");
		expect(text).toContain("Pre-Calculus A Reference Map");
		expect(text).toContain("Polynomial zeros and graphs");
		expect(text).toContain("Sequences and accumulation");
		expect(text).toContain("Rational functions and expressions");
		expect(text).toContain("Composition, inverses, and conics");
		expect(text).toContain("Pre-Calculus A Pending Static Assets");
		expect(text).toContain("https://www.geogebra.org/m/RCVce5W4");
		expect(text).toContain("https://www.desmos.com/calculator/tgyr42ezjq");
		expect(text).toContain("https://www.desmos.com/calculator/auz2qerbgj");
		for (const filename of [
			"ala11_concept1_0.png",
			"pcta7_pset1_17.png",
			"pcta12_pset2_40.png",
			"pcta14_concept3_7.png",
			"checkin2_rational_0.png"
		]) {
			expect(text, filename).toContain(staticMediaUrl(filename));
			expect(hasPendingStaticMediaNotice(text, filename)).toBe(true);
		}
		expect(text).not.toMatch(
			/Juni|Recording Studio|your instructor|with your instructor|Whiteboard|Learning Targets|static\.junilearning/i
		);
		expect(text).not.toMatch(/\bshould\b/i);
		expect(mediaLinks).toEqual([]);
	});

	it("adds Pre-Calculus B reference archive from the math sequence", async () => {
		const course = await loadRawCourse("pre-calculus-b");
		expect(course).not.toBeNull();
		if (!course) return;

		const text = allCourseText(course);
		const mediaLinks = course.modules.flatMap(module =>
			[...module.curriculum, ...module.supplementalProjects]
				.map(item => item.mediaLink)
				.filter((link): link is string => Boolean(link))
		);

		expect(course.modules.map(module => module.title)).toEqual([
			"PCTB1 Trigonometry Basics",
			"PCTB2 Graphs of Sine and Cosine",
			"PCTB3 Other Trigonometric Graphs",
			"PCTB4 Trigonometric Equations and Identities",
			"PCTB5 Polar Coordinates",
			"PCTB6 Parametric Equations",
			"Check-In #1: Trigonometry and Coordinate Models",
			"PCTB7 Vectors",
			"PCTB8 Matrices Review",
			"PCTB9 Applications of Matrices",
			"PCTB10 Partial Fraction Decomposition",
			"PCTB11 Probability",
			"PCTB12 Limits",
			"PCTB13 Rates of Change",
			"Check-In #2 and Pre-Calculus B Capstone",
			"Pre-Calculus B Reference Archive",
			"Pending Static Assets"
		]);
		expect(text).toContain("Concept: The Unit Circle");
		expect(text).toContain("Concept: Graphing Sine and Cosine");
		expect(text).toContain(
			"Concept: Tangent, Reciprocal, and Inverse Trigonometric Graphs"
		);
		expect(text).toContain(
			"Concept: Trigonometric Identities and Equations"
		);
		expect(text).toContain(
			"Concept: Polar Coordinates and Complex Numbers"
		);
		expect(text).toContain("Concept: Parametric Equations");
		expect(text).toContain("Concept: Introduction to Vectors");
		expect(text).toContain("Concept: Matrix Operations");
		expect(text).toContain("Concept: Linear Systems with Matrices");
		expect(text).toContain("Concept: Partial Fraction Decomposition");
		expect(text).toContain(
			"Concept: Probability, Permutations, and Combinations"
		);
		expect(text).toContain(
			"Concept: Introduction to Limits and Continuity"
		);
		expect(text).toContain(
			"Concept: Average Rate of Change and Derivative Preview"
		);
		expect(text).toContain("Capstone: Pre-Calculus B Modeling Portfolio");
		expect(text).toContain("AP Calculus Readiness Map");
		expect(text).toContain("Pre-Calculus B Reference Map");
		expect(text).toContain("Pre-Calculus B Pending Static Assets");
		expect(text).toContain("Trigonometric graphs");
		expect(text).toContain("Linear-algebra previews");
		expect(text).toContain("https://www.geogebra.org/m/keqhdkaj");
		expect(text).toContain("https://www.desmos.com/calculator/ombx9pxa7j");
		expect(text).toContain("https://matrixcalc.org/en/");
		expect(text).toContain("https://www.geogebra.org/m/nzv8jj9g");
		for (const filename of [
			"pctb1_concept1_0.png",
			"pctb1_pset3_19.png",
			"pctb3_pset4_20.png",
			"pctb7_pset2_2.png",
			"pctb13_concept1_2.png",
			"apc3_pset1_7.png",
			"checkin1_trig_3.png"
		]) {
			expect(text, filename).toContain(staticMediaUrl(filename));
			expect(hasPendingStaticMediaNotice(text, filename)).toBe(true);
		}
		expect(text).not.toMatch(
			/Juni|Recording Studio|your instructor|with your instructor|Whiteboard|Learning Targets|static\.junilearning/i
		);
		expect(text).not.toMatch(/\bshould\b/i);
		expect(mediaLinks).toEqual([]);
	});

	it("keeps math reference archives student-facing", async () => {
		for (const courseId of [
			"pre-algebra-a",
			"pre-algebra-b",
			"algebra-1a",
			"algebra-1b",
			"algebra-2a",
			"algebra-2b",
			"geometry-a",
			"geometry-b",
			"pre-calculus-a",
			"pre-calculus-b"
		]) {
			const course = await loadRawCourse(courseId);
			const text = allCourseText(course);

			expect(text, courseId).not.toMatch(
				/source activity archive|source activity anchors|source anchors preserve|original-source|source sequence|source-preservation|source project/i
			);
		}
	});

	it("adds AP Calculus reference anchors with reserved static media", async () => {
		const course = await loadRawCourse("ap-calculus");
		expect(course).not.toBeNull();
		if (!course) return;

		const text = allCourseText(course);
		const mediaLinks = course.modules.flatMap(module =>
			[...module.curriculum, ...module.supplementalProjects]
				.map(item => item.mediaLink)
				.filter((link): link is string => Boolean(link))
		);

		expect(course.modules.map(module => module.title)).toEqual([
			"APCA0 Preparing for AP Calculus",
			"APC1 Introduction to Limits",
			"APC2 Calculating Limits",
			"APC3 Continuity",
			"APC4 Limits and Continuity Topic Review",
			"APC5 Introduction to Derivatives",
			"APC6 Derivative Rules",
			"APC7 Derivatives of Trigonometric and Other Functions",
			"APC8 Derivatives of Composite, Implicit, and Inverse Functions",
			"APC9 Differentiation Topic Review",
			"APC10 Contextual Applications of Differentiation",
			"APC11 Analytical Applications of Differentiation",
			"APC12 A Function and Its Derivatives",
			"APC13 Applications of Derivatives Topic Review",
			"APC14 Accumulation of Change",
			"APC15 Integrals",
			"APC16 Integration and Accumulation of Change Topic Review",
			"APC17 Introduction to Differential Equations",
			"APC18 Solutions to Differential Equations",
			"APC19 Differential Equations Topic Review",
			"APC20 Interpreting Context for Definite Integrals",
			"APC21 Volumes of Solids Using Integrals",
			"APC22 Applications of Integration Topic Review",
			"APC23 Parametric Equations, Polar Coordinates, and Vector-Valued Functions",
			"APC24 Parametric Equations, Polar Coordinates, and Vector-Valued Functions Topic Review",
			"APC25 Infinite Series",
			"APC26 Infinite Sums and Representing Infinite Series",
			"APC27 Infinite Sequences and Series Topic Review",
			"AP Calculus Reference Archive",
			"Pending Static Assets"
		]);
		expect(text).toContain("Introducing Calculus and Defining Limits");
		expect(text).toContain("Properties and Procedures for Limits");
		expect(text).toContain("Continuity and Limits Involving Infinity");
		expect(text).toContain("Rates of Change and Derivative Definitions");
		expect(text).toContain("Basic and Advanced Derivative Rules");
		expect(text).toContain("Chain Rule, Implicit Differentiation, Inverses, and Higher-Order Derivatives");
		expect(text).toContain("Riemann Sums and the Fundamental Theorem of Calculus");
		expect(text).toContain("Antiderivatives, Evaluating Integrals, and Integration Methods");
		expect(text).toContain("Differential Equations");
		expect(text).toContain("Parametric Equations, Polar Coordinates, and Vector-Valued Calculus");
		expect(text).toContain("Infinite Series and Convergence Tests");
		expect(text).toContain("Power Series, Taylor Series");
		expect(text).toContain("AP Calculus Reference Map");
		expect(text).toContain("AP Calculus Pending Static Assets");
		expect(text).toContain("AB/BC path selection");
		expect(text).toContain("Applications of integration");
		expect(text).toContain("BC representation and series topics");
		expect(text).toContain(
			"https://apstudents.collegeboard.org/exam-policies-guidelines/calculator-policies"
		);
		expect(text).toContain(
			"https://apcentral.collegeboard.org/exam-administration-ordering-scores/exam-dates"
		);
		expect(text).toContain(
			"https://www.khanacademy.org/math/ap-calculus-bc/bc-series-new/bc-10-12/v/error-or-remainder-of-a-taylor-polynomial-approximation"
		);
		for (const filename of [
			"apc1_concept1_0.png",
			"apc10_pset1_24.png",
			"apc16_concept1_12.png",
			"apc21_concept3_24.png",
			"apc23_concept3_5.png",
			"applicationsofintegrals_topicreview_multiplechoice_1.png"
		]) {
			expect(text, filename).toContain(staticMediaUrl(filename));
			expect(hasPendingStaticMediaNotice(text, filename)).toBe(true);
		}
		expect(text).not.toMatch(
			/Juni|Recording Studio|your instructor|with your instructor|Whiteboard|Learning Targets|static\.junilearning/i
		);
		expect(text).not.toMatch(
			/source activity archive|source activity anchors|source anchors preserve|original-source|source sequence|source-preservation/i
		);
		expect(text).not.toMatch(/\bshould\b/i);
		expect(mediaLinks).toEqual([]);
	});

	it(
		"keeps algebra standards architecture course-specific",
		async () => {
			const expectedPhrasesByCourse = new Map([
				[
					"algebra-1a",
					[
						"linear-equation fluency",
						"comparing phone plans",
						"slope/intercept interpretation"
					]
				],
				[
					"algebra-1b",
					[
						"absolute-value or piecewise behavior",
						"projectile height",
						"factored or vertex form"
					]
				],
				[
					"algebra-2a",
					[
						"composition/inverse work",
						"dose decay",
						"logarithmic interpretation"
					]
				],
				[
					"algebra-2b",
					[
						"trigonometric modeling",
						"periodic daylight",
						"rational domain restrictions"
					]
				]
			]);
			const architectureContentByTitle = new Map<string, string[]>();

			for (const [courseId, expectedPhrases] of expectedPhrasesByCourse) {
				const course = await loadRawCourse(courseId);
				expect(course, courseId).not.toBeNull();
				if (!course) continue;

				const courseText = allCourseText(course);
				for (const phrase of expectedPhrases) {
					expect(
						courseText,
						`${courseId} should include ${phrase}`
					).toContain(phrase);
				}

				const architecture = course.modules.find(
					module =>
						module.title === "Standards-Mapped Algebra Architecture"
				);
				expect(
					architecture,
					`${courseId} Standards-Mapped Algebra Architecture`
				).toBeDefined();
				if (!architecture) continue;

				for (const item of [
					...architecture.curriculum,
					...architecture.supplementalProjects
				]) {
					const bodies =
						architectureContentByTitle.get(item.title) ?? [];
					bodies.push(item.content);
					architectureContentByTitle.set(item.title, bodies);
				}
			}

			for (const [title, bodies] of architectureContentByTitle) {
				expect(new Set(bodies).size, title).toBe(bodies.length);
			}
		},
		COURSE_SWEEP_TIMEOUT
	);

	it(
		"keeps generated architecture and capstone cards substantive",
		async () => {
			const courses = await loadedCatalogCourseList();
			const terseFormulaicCards: string[] = [];
			const corpus = await loadedCatalogText();

			for (const [courseIndex, course] of courses.entries()) {
				expect(course).not.toBeNull();

				for (const module of course!.modules) {
					for (const item of [
						...module.curriculum,
						...module.supplementalProjects
					]) {
						const text = item.content.replace(/\s+/g, " ").trim();

						if (
							text.length < 420 &&
							/^\*\*(?:Goal|Concept path|Readiness map|Project goal):\*\*/i.test(
								text
							)
						) {
							terseFormulaicCards.push(
								`${courseCatalog[courseIndex].id} / ${module.title} / ${item.title} / ${text.length}`
							);
						}
					}
				}
			}

			expect(terseFormulaicCards).toEqual([]);
			expect(corpus).toContain("**Anchor structure:**");
			expect(corpus).toContain("**Data-story structure:**");
			expect(corpus).toContain("**Gate sequence:**");
			expect(corpus).toContain("**Option A: Relic Runner:**");
		},
		COURSE_SWEEP_TIMEOUT
	);

	it("formats authored lesson setup text as neutral student-readable sections", async () => {
		const course = await loadRawCourse("c-level-1");
		expect(course).not.toBeNull();

		const setup = findItem(course!, /Program Setup/);

		expect(setup.content).toContain("This lesson begins with");
		expect(setup.content).toContain("**Key topics:**");
		expect(setup.content).toContain("- `#include`");
		expect(setup.content).toContain("**Practice check:**");
		expect(setup.content).not.toMatch(/Start with|Cover:|Students should/);
		expect(setup.content).not.toMatch(/\*\*Learning sequence:\*\*/);
		expect(setup.content).not.toMatch(/\*\*Practice target:\*\*/);
	});

	it("adds AP-specific scaffolding to terse AP Computer Science A algorithm projects", async () => {
		const course = await loadRawCourse("ap-computer-science-a");
		expect(course).not.toBeNull();

		const binarySearch = findItem(
			course!,
			/Binary Search/,
			/\*\*Goal:\*\*/
		);

		expect(binarySearch.content).toContain("AP CSA Java reasoning");
		expect(binarySearch.content).toContain(
			"State the sorted-data precondition"
		);
		expect(binarySearch.content).toContain(
			"Trace at least one search by recording the low, high, and middle indices at each step"
		);
	});

	it("keeps linked AP Computer Science A reference cards substantive", async () => {
		const course = await loadRawCourse("ap-computer-science-a");
		expect(course).not.toBeNull();

		const thinReferenceCards = course!.modules.flatMap(module =>
			[...module.curriculum, ...module.supplementalProjects]
				.filter(item => {
					const hasLinkedResource = Boolean(
						item.projectLink ||
						item.solutionLink ||
						item.datasetLink ||
						item.mediaLink
					);

					return (
						hasLinkedResource &&
						isInformationalResourceTitle(item.title)
					);
				})
				.filter(
					item =>
						item.content.replace(/\s+/g, " ").trim().length < 280 ||
						wordCount(item.content) < 45
				)
				.map(
					item =>
						`${module.title} / ${item.title} / ${wordCount(item.content)} words`
				)
		);

		expect(thinReferenceCards).toEqual([]);
	});

	it("keeps AP Computer Science A course copy direct and neutral", () => {
		const source = fs.readFileSync(
			"src/stores/courses/ap-computer-science-a.ts",
			"utf8"
		);

		expect(source).not.toMatch(/\bshould\b/i);
	});

	it("adds an AP Computer Science A pacing track guide", async () => {
		const course = await loadRawCourse("ap-computer-science-a");
		expect(course).not.toBeNull();

		const guideItem = findItem(course!, /Track Guide/);
		const guidePath = "public/course-assets/apcs/apcs-pacing-tracks.md";
		const guide = fs.readFileSync(guidePath, "utf8");

		expect(guideItem.datasetLink).toBe(
			"/course-assets/apcs/apcs-pacing-tracks.md"
		);
		expect(guideItem.content).toContain("Slow/Supported");
		expect(guideItem.content).toContain("Fast/Quick");
		expect(guide).toContain(
			"This guide compares routes through AP Computer Science A"
		);
		expect(guide).toMatch(/\|\s*Quick Track\s*\|\s*Fast\s*\|/);
		expect(guide).toMatch(/\|\s*Standard Track\s*\|\s*Medium\s*\|/);
		expect(guide).toMatch(/\|\s*Supported Track\s*\|\s*Slow\s*\|/);
		expect(guide).toMatch(/\|\s*Challenge Track\s*\|\s*Hard\s*\|/);
		expect(guide).toMatch(/\|\s*Slow \/ Easy\s*\|\s*Supported Track\s*\|/);
		expect(guide).toMatch(/\|\s*Fast \/ Quick\s*\|\s*Quick Track\s*\|/);
		expect(guide).toMatch(/\|\s*Hard\s*\|\s*Challenge Track\s*\|/);
		expect(guide).toContain("How This Guide Works");
		expect(guide).toContain("Track Labels At A Glance");
		expect(guide).toContain("Course Track Cards");
		expect(guide).toContain("Track Recipes");
		expect(guide).toContain("Module Decisions By Track");
		expect(guide).toContain("Quick Route For A Strong Python/C++ Learner");
		expect(guide).toContain("Fast Placement Decision");
		expect(guide).toContain("Placement Checkpoints");
		expect(guide).toContain("The track can change during the course");
		expect(guide).toContain("Supported / Slow Track");
		expect(guide).toContain("Quick / Fast Track");
		expect(guide).toContain("Challenge / Hard Track");
		expect(guide).toContain("Exam / Score Track");
		expect(guide).toContain("Default sequence:");
		expect(guide).toContain("Advancement rule:");
		expect(guide).toContain("Today-Ready Recommendation");
		expect(guide).toContain("APCS5/APCS6");
		expect(guide).toContain("Generics, interfaces, records");
		expect(guide).not.toMatch(/Instructor Note|HQ Support|Slack|Juni/i);
		expect(guide).not.toMatch(/\bRequire\b|\bEncourage\b|\binstructor\b/i);
	});

	it("keeps reference worksheets and safety boundaries substantive", async () => {
		const apcs = await loadRawCourse("ap-computer-science-a");
		expect(apcs).not.toBeNull();

		for (const title of [
			"Variables Reference",
			"Loops Reference",
			"Chapter 2 Multiple Choice Focus",
			"Loop Reference Pack",
			"Reference: While Loops and Nested Loops"
		]) {
			const item = findItem(
				apcs!,
				new RegExp(`^${title.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`)
			);
			expect(wordCount(item.content), title).toBeGreaterThanOrEqual(85);
			expect(item.content, title).toMatch(
				/trace|AP-style|Java|condition/i
			);
			expect(item.content, title).not.toMatch(/\bshould\b/i);
		}

		const assembly = await loadRawCourse("assembly");
		expect(assembly).not.toBeNull();
		const registerWorksheets = assembly!.modules.flatMap(module =>
			module.supplementalProjects.filter(item =>
				item.title.startsWith("Register-Trace Worksheet:")
			)
		);

		expect(registerWorksheets.length).toBeGreaterThanOrEqual(14);
		for (const item of registerWorksheets) {
			expect(wordCount(item.content), item.title).toBeGreaterThanOrEqual(
				85
			);
			expect(item.content, item.title).toContain("instruction address");
			expect(item.content, item.title).toContain(
				"value before the instruction"
			);
			expect(item.content, item.title).toContain(
				"value after the instruction"
			);
			expect(item.content, item.title).toContain(
				"branch, call, or return"
			);
			expect(item.content, item.title).not.toMatch(/\bshould\b/i);
		}

		const safetySamples = [
			{
				courseId: "assembly",
				title: "Assembly Prohibited Activity"
			},
			{
				courseId: "elementary-science",
				title: "Physical-Material Boundary"
			},
			{
				courseId: "linux-systems",
				title: "Linux Systems Prohibited Activity"
			},
			{
				courseId: "network-systems",
				title: "Network Systems Prohibited Activity"
			},
			{
				courseId: "network-security",
				title: "Network Security Prohibited Activity"
			}
		];

		for (const sample of safetySamples) {
			const course = await loadRawCourse(sample.courseId);
			expect(course).not.toBeNull();
			const item = findItem(course!, new RegExp(`^${sample.title}$`));

			expect(
				wordCount(item.content),
				sample.title
			).toBeGreaterThanOrEqual(75);
			expect(item.content, sample.title).toMatch(
				/Evidence target|Investigation|What to show/
			);
			expect(item.content, sample.title).not.toMatch(/\bshould\b/i);
		}
	});

	it(
		"keeps science investigations explicitly equipment-free and evidence-based",
		async () => {
			const courses = await Promise.all([
				loadRawCourse("elementary-science"),
				loadRawCourse("middle-school-integrated-science"),
				loadRawCourse("intro-to-biology"),
				loadRawCourse("intro-to-environmental-science"),
				loadRawCourse("intro-to-physics"),
				loadRawCourse("intro-to-chemistry"),
				loadRawCourse("physics-level-2")
			]);
			const corpus = courses.map(allCourseText).join("\n");
			const resourceBankBodies = courses.flatMap(course =>
				course!.modules
					.filter(module => module.title === "Digital Resource Bank")
					.flatMap(module =>
						[...module.curriculum, ...module.supplementalProjects]
							.filter(item =>
								[
									"Module-by-Module Resource Mapping Routine",
									"Science Notebook Evidence Routine",
									"Resource Project: Simulation-to-CER Writeup",
									"Resource Project: Model Critique"
								].includes(item.title)
							)
							.map(item => item.content)
					)
			);

			expect(corpus).toContain("**Investigation:**");
			expect(corpus).not.toContain(
				"The activity does not require beakers, kits, or household materials; any physical demonstration is optional and replaceable with a diagram or data table"
			);
			expect(corpus).not.toContain(
				"**Output:** Complete a claim-evidence-reasoning response, a labeled diagram or data table, and one prediction about a changed condition"
			);
			expect(corpus).not.toContain(
				"The activity should rely on accessible digital evidence"
			);
			expect(corpus).not.toContain(
				"Any hands-on observation must be safe, simple, optional, and replaceable with an equivalent source."
			);
			expect(corpus).not.toContain(
				"If an optional observation is used, it stays simple and must be replaceable by the same evidence source named in the activity."
			);
			expect(corpus).not.toContain(
				"Record observations first, then build or annotate a model, and only then write the explanation."
			);
			expect(corpus).not.toContain(
				"Begin with the evidence record, add the model annotation, and finish by explaining what the model accounts for and what it leaves out."
			);
			expect(corpus).not.toContain(
				"uses shared-screen materials, notes, paper, pencil, and"
			);
			expect(corpus).toMatch(
				/No beakers, kits, or required household materials are needed|Physical supplies are optional only|shared digital resources|accessible digital evidence/
			);
			expect(corpus).toContain("claim-evidence-reasoning");
			expect(corpus).not.toContain(
				"Anchor the activity in web development workflow"
			);
			expect(corpus).not.toMatch(
				/motion[^.\n]{0,120}particles, formulas, reactions|graph[^.\n]{0,120}particles, formulas, reactions/i
			);
			expect(corpus).toContain("one labeled observation sketch");
			expect(corpus).toContain("system boundary note");
			expect(corpus).toContain("unit-aware graph or diagram");
			expect(corpus).toContain("coordinate or system definition");
			expect(new Set(resourceBankBodies).size).toBe(
				resourceBankBodies.length
			);
		},
		COURSE_SWEEP_TIMEOUT
	);

	it("adds Intro to Biology from the science source sequence with neutral wording", async () => {
		const course = await loadRawCourse("intro-to-biology");
		expect(course).not.toBeNull();

		const text = allCourseText(course);
		const recommendedNextWork =
			course!.developmentMetadata?.recommendedNextWork.join("\n") ?? "";
		const mediaLinks = course!.modules.flatMap(module =>
			[...module.curriculum, ...module.supplementalProjects]
				.map(item => item.mediaLink)
				.filter((link): link is string => Boolean(link))
		);

		expect(course!.modules.map(module => module.title)).toEqual([
			"BIO1 Human Body Systems",
			"BIO2 Nutrients and Macromolecules",
			"BIO3 Digestive Process",
			"BIO4 Digestion and Absorption",
			"BIO5 Energy Use and Storage",
			"BIO6 Regulation of Digestion",
			"BIO7 Elimination and Excretion",
			"BIO8 Digestive Odyssey Capstone"
		]);
		for (const module of course!.modules) {
			expect(
				module.curriculum.length + module.supplementalProjects.length,
				module.title
			).toBeGreaterThanOrEqual(4);
			expect(
				module.supplementalProjects.length,
				module.title
			).toBeGreaterThanOrEqual(2);
		}

		expect(text).toContain("Project: Dinner Mystery");
		expect(text).toContain("Project: Salad Clue Report");
		expect(text).toContain("Project: Alien Venn Diagram");
		expect(text).toContain("Project: Digestive Odyssey Exhibit");
		expect(text).toContain("travel journal");
		expect(text).toContain("No beakers, kits, dissections");
		expect(text).toContain("Three scenario prompts anchor this module");
		expect(text).toContain("A dinner-mystery graph can match guests");
		expect(text).toContain("A comparison scenario describes an alien");
		expect(text).not.toContain("static.junilearning.com");
		expect(text).not.toMatch(
			/original source|original image filename|source mission|source scenario|source alien/i
		);
		expect(text).not.toMatch(
			/\bplaceholder\b|class static host URL|hosted file becomes available|when the file is available/i
		);
		expect(recommendedNextWork).not.toMatch(/original biology images/i);
		expect(mediaLinks).toEqual([
			"https://static.classes.jacobdanderson.net/biomod1pro1im1.jpg",
			"https://static.classes.jacobdanderson.net/biomod1pro1im2.jpg",
			"https://static.classes.jacobdanderson.net/biomod2pro1im1.png"
		]);
		expect(text).toContain("biomod1pro1im1.jpg");
		expect(text).toContain("biomod1pro1im2.jpg");
		expect(text).toContain("biomod2pro1im1.png");
	});

	it("adds Intro to Environmental Science from the original science source sequence", async () => {
		const course = await loadRawCourse("intro-to-environmental-science");
		expect(course).not.toBeNull();

		const text = allCourseText(course);
		const mediaLinks = course!.modules.flatMap(module =>
			[...module.curriculum, ...module.supplementalProjects]
				.map(item => item.mediaLink)
				.filter((link): link is string => Boolean(link))
		);

		expect(course!.modules.map(module => module.title)).toEqual([
			"ES1 Ecosystems",
			"ES2 Flora and Decomposers",
			"ES3 Fauna",
			"ES4 Weather and Climate",
			"ES5 Geology and Oceanography",
			"ES6 Humans and the Environment",
			"ES7 Earth's Past, Present, and Future",
			"ES8 Environmental Design Capstone"
		]);
		for (const module of course!.modules) {
			expect(
				module.curriculum.length + module.supplementalProjects.length,
				module.title
			).toBeGreaterThanOrEqual(4);
			expect(
				module.curriculum.length,
				module.title
			).toBeGreaterThanOrEqual(1);
			expect(
				module.supplementalProjects.length,
				module.title
			).toBeGreaterThanOrEqual(3);
		}

		expect(text).toContain("Project: Biome Travel Guide");
		expect(text).toContain("Project: Ecosystem Reporter");
		expect(text).toContain("Project: Climate Change Debate Response");
		expect(text).toContain("Project: Transform Our Environment Proposal");
		expect(text).toContain("core biome");
		expect(text).toContain("NASA biome reference");
		expect(text).toMatch(/Pending media/i);
		expect(text).not.toMatch(
			/Juni|Recording Studio|Environmental Science Club|your instructor|Learning Targets/i
		);
		expect(mediaLinks).toEqual([
			"https://static.classes.jacobdanderson.net/c009b919-101b-4a4d-8f19-74885e8f62c0_Photosynthesis-01_577acc78_670x451.png"
		]);
		expect(text).toContain(
			"c009b919-101b-4a4d-8f19-74885e8f62c0_Photosynthesis-01_577acc78_670x451.png"
		);
	});

	it("keeps Intro to Chemistry authored, deduplicated, and resource-specific", async () => {
		const course = await loadRawCourse("intro-to-chemistry");
		expect(course).not.toBeNull();

		const moduleTitles = course!.modules.map(module => module.title);
		const duplicateTitles = moduleTitles.filter(
			(title, index) => moduleTitles.indexOf(title) !== index
		);
		const text = allCourseText(course);
		const items = course!.modules.flatMap(module => [
			...module.curriculum,
			...module.supplementalProjects
		]);
		const linkedItems = items.filter(
			item =>
				item.projectLink ||
				item.mediaLink ||
				item.datasetLink ||
				item.solutionLink ||
				/https?:\/\//i.test(item.content)
		);
		const thinItems = items.filter(item => item.content.length < 650);
		const localMaterialLinks = items.filter(item =>
			item.datasetLink?.includes("chemistry-materials-pack.md")
		);
		const answerKeyLinks = items.filter(item =>
			item.solutionLink?.includes("chemistry-rubrics-answer-key.md")
		);
		const phetLinks = new Set(
			items
				.map(item => item.mediaLink)
				.filter((link): link is string => Boolean(link))
		);

		expect(duplicateTitles).toEqual([]);
		expect(text).not.toMatch(
			/Implementation Studio|Full Lesson Authoring Pack/i
		);
		expect(text).not.toMatch(
			/Standards and Scope Expansion|Module Backlog/i
		);
		expect(text).not.toMatch(/Source and Asset Parity Implementation/i);
		expect(text).not.toMatch(/Guide students|Require students|Push them/i);
		expect(text).not.toMatch(
			/\bshould\b|Original prompt restored|teaching flow|lesson arc|your instructor/i
		);
		expect(text).not.toContain("CHM0");
		expect(items.length).toBeGreaterThanOrEqual(78);
		expect(thinItems).toEqual([]);
		expect(linkedItems).toHaveLength(items.length);
		expect(localMaterialLinks.length).toBeGreaterThan(36);
		expect(answerKeyLinks.length).toBeGreaterThan(28);
		expect(phetLinks.size).toBeGreaterThanOrEqual(7);
		expect(course!.modules.at(-1)?.kind).toBe("appendix");

		const normalizedCourse =
			await useCoursesStore().loadCourseById("intro-to-chemistry");
		expect(normalizedCourse!.modules.at(-1)?.kind).toBe("appendix");

		expect(text).toContain("Phase Diagrams as Maps of Conditions");
		expect(text).toContain(
			"Gas Pressure, Volume, Temperature, and Collisions"
		);
		expect(text).toContain("Naming Compounds from Formula Patterns");
		expect(text).toContain("Checkpoint: Atomic Structure");
		expect(text).toContain("Checkpoint: Energy, Phase Change, and Gases");
		expect(text).toContain("Checkpoint: Quantitative Chemistry Reasoning");
		expect(text).toContain("Checkpoint: Capstone Defense");
		expect(text).toContain("Reaction Energy and Rates");
		expect(text).toContain("Redox, Batteries, and Electron Transfer");
		expect(text).toContain("Investigation Safety Checklist");
		expect(text).toContain("Chemistry Explanation Rubric");
		expect(text).toContain("CHM10 Advanced Chemistry Map");
		expect(text).toContain("Reference Appendix: Chemistry Resource Bank");
		expect(text).toContain("Stoichiometry Error Analysis");
		expect(text).toContain("Phenomena Case Library");
		expect(text).toMatch(/project source index/i);
		expect(text).toContain("Everyday Chemistry Observation Log");
		expect(text).toContain("Material Sorting Challenge");
		expect(text).toContain("Heating and Cooling Diary");
		expect(text).toContain("Reaction Detective Board");
		expect(text).toContain("Kitchen Chemistry Sort");
		expect(text).toContain("Chemistry in Your World Showcase");
		expect(text).toContain("Course Overview and Learning Workflow");
		expect(text).toContain("Atom Simulation and Atom Builder Challenge");
		expect(text).toContain("Water Tension Experiment");
		expect(text).toContain("Making a DIY Lava Lamp");
		expect(text).toContain("Making Oobleck Case Analysis");
		expect(text).toContain("States of Matter Simulation Report");
		expect(text).toContain(
			"Periodic Table Reference Set and Symbol Reading"
		);
		expect(text).toContain("Mystery Element Cards and Symbol Codes");
		expect(text).toContain("Introduction to Chemical Reactions");
		expect(text).toContain("Elephant Toothpaste Case Analysis");
		expect(text).toContain("Making a Volcano Case Analysis");
		expect(text).toContain("Making Invisible Ink Case Analysis");
		expect(text).toContain("Solution Simulation");
		expect(text).toContain("Separating Mixtures");
		expect(text).toContain("Model Your Own Reaction");
		expect(text).toContain("water cohesion and surface tension");
		expect(text).toContain("elephant toothpaste");
		expect(text).toContain("baking-soda volcanoes");
		expect(text).toContain("invisible ink");
		expect(text).toContain("PBS/ChemThink atom simulation");
		expect(text).toContain("PBS periodic table interactive");
		expect(text).toContain("JavaLab dissolution simulation");
		expect(text).toContain("PubChem periodic table");
		expect(text).toContain("Periodic Table Reference Set");
		expect(text).toContain("Royal Society of Chemistry periodic table");
		expect(text).toContain("IUPAC periodic table");
		expect(text).not.toMatch(/\. the activity claim/);
		expect(text).not.toMatch(
			/\b(?:A complete|The final|Final) the activity (?:result|note|response|answer|explanation|work)\b/i
		);
		expect(text).not.toMatch(
			/\*\*Reference purpose:\*\*[^\n]+ \*\*(?:Resource bank|Reference links|Use):\*\*/
		);
		expect(text).toContain(
			"Limiting Reactants, Leftovers, and Heat Released"
		);
		expect(text).toContain("1.5 mol O₂");
		expect(text).toContain("285.8 kJ");

		const coreReferences = findItem(course!, /Core Chemistry References/);
		expect(coreReferences.content).toMatch(
			/\*\*Reference purpose:\*\*[\s\S]+?\n\n\*\*Resource bank:\*\*/
		);
		expect(coreReferences.content).toMatch(/\n\n\*\*Use:\*\*/);

		const periodicTableReferences = findItem(
			course!,
			/^Periodic Table Reference Set$/
		);
		expect(periodicTableReferences.content).toMatch(
			/\*\*Reference purpose:\*\*[\s\S]+?\n\n\*\*Reference links:\*\*/
		);
		expect(periodicTableReferences.content).toContain(
			"A reference note names the source, the element or trend checked, and the exact fact or property the source supported."
		);
		expect(periodicTableReferences.content).not.toMatch(
			/\bactivity claim answers\b/i
		);

		const bondEnergyLesson = items.find(
			item => item.title === "Bond Energies and Reaction Estimates"
		);
		expect(bondEnergyLesson?.content).toContain("| Bond | kJ/mol |");
		expect(bondEnergyLesson?.content).toContain("**Reading the table:**");
		expect(bondEnergyLesson?.content).not.toMatch(/\|\s*\|\s*\|/);
	});

	it("keeps Intro to Chemistry local asset fragments backed by real headings", async () => {
		const course = await loadRawCourse("intro-to-chemistry");
		expect(course).not.toBeNull();

		const materialHeadings = markdownHeadingSlugs(
			"public/course-assets/chemistry/chemistry-materials-pack.md"
		);
		const answerHeadings = markdownHeadingSlugs(
			"public/course-assets/chemistry/chemistry-rubrics-answer-key.md"
		);
		const missingFragments: string[] = [];

		for (const module of course!.modules) {
			for (const item of [
				...module.curriculum,
				...module.supplementalProjects
			]) {
				for (const link of [item.datasetLink, item.solutionLink]) {
					if (!link?.startsWith("/course-assets/chemistry/"))
						continue;
					if (!link.includes("#")) continue;

					const [path, hash] = link.split("#", 2);
					const headingSet = path.includes("materials-pack")
						? materialHeadings
						: answerHeadings;

					if (!headingSet.has(hash)) {
						missingFragments.push(`${item.title}: ${link}`);
					}
				}
			}
		}

		expect(missingFragments).toEqual([]);
	});

	it(
		"keeps every local markdown course asset link backed by a real file and heading fragment",
		async () => {
			const missingAssets: string[] = [];
			const missingFragments: string[] = [];
			const headingCache = new Map<string, Set<string>>();

			for (const entry of courseCatalog) {
				const course = await loadRawCourse(entry.id);
				expect(course).not.toBeNull();

				for (const resource of courseItemLinks(entry.id, course!)) {
					const parsed = parseCourseAssetUrl(resource.link);
					if (!parsed) continue;

					const assetPath = `public${parsed.path}`;
					if (!fs.existsSync(assetPath)) {
						missingAssets.push(
							`${resource.course} / ${resource.module} / ${resource.item}: ${resource.link}`
						);
						continue;
					}

					if (!parsed.hash) continue;

					let headings = headingCache.get(assetPath);
					if (!headings) {
						headings = markdownHeadingSlugs(assetPath);
						headingCache.set(assetPath, headings);
					}

					if (!headings.has(parsed.hash)) {
						missingFragments.push(
							`${resource.course} / ${resource.module} / ${resource.item}: ${resource.link}`
						);
					}
				}
			}

			expect(missingAssets).toEqual([]);
			expect(missingFragments).toEqual([]);
		},
		COURSE_SWEEP_TIMEOUT
	);

	it(
		"keeps unavailable static source media represented by explicit placeholders",
		async () => {
			const pendingFilenames = new Set(
				KNOWN_PENDING_STATIC_MEDIA_FILENAMES
			);
			const unresolvedPendingFilenames = new Set(pendingFilenames);
			const missingPlaceholderNotes: string[] = [];
			const missingPlaceholderLinks: string[] = [];
			for (const entry of courseCatalog) {
				const course = await loadRawCourse(entry.id);
				expect(course).not.toBeNull();

				for (const module of course!.modules) {
					for (const item of [
						...module.curriculum,
						...module.supplementalProjects
					]) {
						const links = [
							item.mediaLink,
							item.datasetLink,
							item.projectLink,
							item.solutionLink,
							...staticMediaUrlsFromText(item.content)
						].filter(
							(link): link is string =>
								!!link && isStaticMediaUrl(link)
						);

						for (const link of links) {
							const filename = staticMediaFilename(link);
							if (!pendingFilenames.has(filename)) continue;

							unresolvedPendingFilenames.delete(filename);

							if (link !== staticMediaUrl(filename)) {
								missingPlaceholderLinks.push(
									`${entry.id} / ${module.title} / ${item.title}: ${link}`
								);
							}

							if (
								!hasPendingStaticMediaNotice(
									item.content,
									filename
								)
							) {
								missingPlaceholderNotes.push(
									`${entry.id} / ${module.title} / ${item.title}: ${filename}`
								);
							}
						}
					}
				}
			}

			expect([...unresolvedPendingFilenames]).toEqual([]);
			expect(missingPlaceholderLinks).toEqual([]);
			expect(missingPlaceholderNotes).toEqual([]);
		},
		COURSE_SWEEP_TIMEOUT
	);

	it(
		"keeps raw course source placeholders for unavailable static media",
		async () => {
			const pendingFilenames = new Set(
				KNOWN_PENDING_STATIC_MEDIA_FILENAMES
			);
			const missingRawPlaceholderNotes: string[] = [];
			const missingRawPlaceholderLinks: string[] = [];

			for (const entry of courseCatalog) {
				const course = await entry.load();

				for (const module of course.modules) {
					for (const item of [
						...module.curriculum,
						...module.supplementalProjects
					]) {
						const links = [
							item.mediaLink,
							item.datasetLink,
							item.projectLink,
							item.solutionLink,
							...staticMediaUrlsFromText(item.content)
						].filter(
							(link): link is string =>
								!!link && isStaticMediaUrl(link)
						);

						for (const link of links) {
							const filename = staticMediaFilename(link);
							if (!pendingFilenames.has(filename)) continue;

							if (link !== staticMediaUrl(filename)) {
								missingRawPlaceholderLinks.push(
									`${entry.id} / ${module.title} / ${item.title}: ${link}`
								);
							}

							if (
								!hasPendingStaticMediaNotice(
									item.content,
									filename
								)
							) {
								missingRawPlaceholderNotes.push(
									`${entry.id} / ${module.title} / ${item.title}: ${filename}`
								);
							}
						}
					}
				}
			}

			expect(missingRawPlaceholderLinks).toEqual([]);
			expect(missingRawPlaceholderNotes).toEqual([]);
		},
		COURSE_SWEEP_TIMEOUT
	);

	it("documents pending static media with the filename and future static URL", () => {
		const notice = pendingStaticMediaNotice("pending-static-demo.mp4");

		expect(notice).toContain("pending-static-demo.mp4");
		expect(notice).toContain(
			"https://static.classes.jacobdanderson.net/pending-static-demo.mp4"
		);
		expect(notice).toMatch(/not currently available/i);
		expect(notice).toMatch(/added later/i);
	});

	it("canonicalizes legacy static media URLs to class-host placeholders", () => {
		const legacyUrl =
			"https://static.junilearning.com/ap_calculus/original-static-demo.mp4?cache=1";
		const futureUrl =
			"https://static.classes.jacobdanderson.net/original-static-demo.mp4";

		expect(canonicalStaticMediaUrl(legacyUrl)).toBe(futureUrl);
		expect(
			normalizeStaticMediaUrlsInText(
				`Legacy media: ${legacyUrl}. Keep the period.`
			)
		).toBe(`Legacy media: ${futureUrl}. Keep the period.`);
		expect(staticMediaUrlsFromText(`Legacy media: ${legacyUrl}.`)).toEqual([
			futureUrl
		]);
	});

	it("extracts static media URLs embedded in course prose", () => {
		expect(
			staticMediaUrlsFromText(
				"Reserve https://static.classes.jacobdanderson.net/original-static-demo.mp4, then continue."
			)
		).toEqual([
			"https://static.classes.jacobdanderson.net/original-static-demo.mp4"
		]);
	});

	it(
		"keeps legacy static media hosts out of raw and normalized course content",
		async () => {
			const legacyOccurrences: string[] = [];

			for (const entry of courseCatalog) {
				const rawCourse = await entry.load();
				const normalizedCourse = await loadRawCourse(entry.id);

				for (const [label, course] of [
					["raw", rawCourse],
					["normalized", normalizedCourse]
				] as const) {
					if (!course) continue;

					for (const module of course.modules) {
						for (const item of [
							...module.curriculum,
							...module.supplementalProjects
						]) {
							const corpus = [
								item.content,
								item.mediaLink,
								item.datasetLink,
								item.projectLink,
								item.solutionLink
							]
								.filter(Boolean)
								.join("\n");

							if (LEGACY_STATIC_HOST_IN_TEXT_RE.test(corpus)) {
								legacyOccurrences.push(
									`${label} ${entry.id} / ${module.title} / ${item.title}`
								);
							}
						}
					}
				}
			}

			expect(legacyOccurrences).toEqual([]);
		},
		COURSE_SWEEP_TIMEOUT
	);

	it(
		"keeps simulation and video resources out of dataset links",
		async () => {
			const mediaInDatasetField: string[] = [];
			const mediaDatasetPattern =
				/\b(?:youtube\.com|youtu\.be|phet\.colorado\.edu|javalab\.org|pbslearningmedia\.org|khanacademy\.org|contrib\.pbslearningmedia\.org)\b/i;

			for (const entry of courseCatalog) {
				const course = await loadRawCourse(entry.id);
				expect(course).not.toBeNull();

				for (const module of course!.modules) {
					for (const item of [
						...module.curriculum,
						...module.supplementalProjects
					]) {
						if (
							item.datasetLink &&
							mediaDatasetPattern.test(item.datasetLink)
						) {
							mediaInDatasetField.push(
								`${entry.id} / ${module.title} / ${item.title}: ${item.datasetLink}`
							);
						}
					}
				}
			}

			expect(mediaInDatasetField).toEqual([]);
		},
		COURSE_SWEEP_TIMEOUT
	);

	it("keeps physics addendum guidance topic-specific instead of template-generated", async () => {
		const courseIds = ["intro-to-physics", "physics-level-2"];
		const genericMisconceptionTemplate =
			/formula-first reasoning, missing units, hidden assumptions, and explanations that confuse a representation with the physical system/i;
		const genericCheckpointTemplate =
			/core quantities, system boundary, and model assumption are identified/i;
		const genericCurriculumTemplates = [
			/usable physics model rather than a memorized list/i,
			/Build the model by first naming the system/i,
			/Each example should include a diagram or table/i,
			/Use a safe remote-friendly simulation, provided dataset, video observation, or paper design case/i,
			/State what stays the same, what changes, which assumption is most fragile/i,
			/Include a visual model, one quantitative or evidence-based element, a limitation, and a brief revision note/i,
			/The introductory physics work does not require beakers, kits, or household materials; any physical demonstration can be replaced with evidence from the provided resource/i,
			/The physics modeling work does not require beakers, kits, or household materials; any physical demonstration can be replaced with evidence from the provided resource/i
		];
		const physicsContextHelper = fs.readFileSync(
			"src/stores/courses/physicsContentContext.ts",
			"utf8"
		);

		expect(physicsContextHelper).not.toMatch(/physicsContentReplacements/);
		expect(physicsContextHelper).not.toMatch(/defaultPhysicsTopicContext/);
		expect(physicsContextHelper).not.toMatch(
			/usable physics model rather than a memorized list/i
		);
		expect(physicsContextHelper).not.toMatch(
			/Each example should include/i
		);
		expect(physicsContextHelper).toContain(
			"Readiness check: define the system boundary"
		);
		expect(physicsContextHelper).toContain(
			"Common failure modes include treating momentum"
		);

		for (const courseId of courseIds) {
			const course = await loadRawCourse(courseId);
			expect(course).not.toBeNull();

			const diagnostics = course!.modules.flatMap(module =>
				module.supplementalProjects
					.filter(item => /Readiness Check$/i.test(item.title))
					.map(item => item.content)
			);
			const misconceptions = course!.modules.flatMap(module =>
				module.supplementalProjects
					.filter(item => /Failure Modes$/i.test(item.title))
					.map(item => item.content)
			);
			const combined = [...diagnostics, ...misconceptions].join("\n");
			const courseText = allCourseText(course);
			const source = fs.readFileSync(
				`src/stores/courses/${
					courseId === "intro-to-physics"
						? "intro-to-physics"
						: "physics-level-2"
				}.ts`,
				"utf8"
			);

			expect(combined).not.toMatch(genericMisconceptionTemplate);
			expect(combined).not.toMatch(genericCheckpointTemplate);
			expect(combined).not.toMatch(/\bWatch for\b/i);
			expect(courseText).toContain("Failure Modes");
			expect(courseText).toContain("Readiness Check");
			expect(courseText).not.toContain("Diagnostic Checkpoint");
			expect(courseText).not.toContain("Misconception Watchlist");
			expect(source).not.toMatch(/\bWatch for\b/i);
			expect(source).not.toMatch(/The correction should replace/i);
			expect(source).not.toContain("Misconception Watchlist");
			expect(source).not.toMatch(/\bMini Lab\b/i);
			expect(source).not.toMatch(/\bshould\b/i);
			expect(courseText).not.toMatch(/\bMini Lab\b/i);
			expect(courseText).not.toMatch(
				/with your instructor|Recording Studio|Juni/i
			);
			for (const pattern of genericCurriculumTemplates) {
				expect(courseText).not.toMatch(pattern);
			}
			expect(courseText).not.toMatch(/\bEach example should\b/i);
			expect(courseText).not.toMatch(/\bThe final explanation should\b/i);
			expect(new Set(diagnostics).size).toBe(diagnostics.length);
			expect(new Set(misconceptions).size).toBe(misconceptions.length);
		}

		const introPhysics = await loadRawCourse("intro-to-physics");
		const introPhysicsCorpus = allCourseText(introPhysics);
		expect(introPhysicsCorpus).toContain(
			"Momentum treats motion as a conserved, direction-aware quantity during short interactions."
		);
		expect(introPhysicsCorpus).toContain(
			"Fluids connect pressure, density, and buoyancy through contact forces spread over area"
		);
		expect(introPhysicsCorpus).toContain(
			"Modern physics introduces places where classical models stop being enough."
		);
		expect(introPhysicsCorpus).toContain(
			"The final portfolio turns physics knowledge into a defended design or investigation."
		);
		expect(introPhysicsCorpus).toContain(
			"The opening workflow is intentionally lightweight and remote-friendly."
		);
		expect(introPhysicsCorpus).toContain(
			"Remote Investigation: Reaction-Time Data"
		);
		expect(introPhysicsCorpus).toContain(
			"Remote Investigation: Circuit Measurement Log"
		);
		expect(introPhysicsCorpus).toContain(
			"Remote Investigation: Grand Experiment Proposal"
		);
		expect(introPhysicsCorpus).not.toMatch(
			/Run a short ruler-drop lab|Use a phone camera to record|Build a simple series or parallel circuit|before touching the hardware|household materials/i
		);

		const physics2 = await loadRawCourse("physics-level-2");
		const physics2Corpus = allCourseText(physics2);
		expect(physics2Corpus).toContain(
			"Investigation or Simulation: Ballistics Model Comparison"
		);
		expect(physics2Corpus).toContain(
			"Investigation or Simulation: Engineering Modeling Challenge"
		);
		expect(physics2Corpus).toContain(
			"Numerical modeling turns a physics relationship into repeated update rules."
		);
		expect(physics2Corpus).toContain(
			"Experimental uncertainty is part of the evidence, not a decoration added after the answer."
		);
		expect(physics2Corpus).toContain(
			"Reference frames determine how position, velocity, time, and event order are described."
		);
		expect(physics2Corpus).toContain(
			"An independent physics portfolio begins with a focused question narrow enough to model and broad enough to matter."
		);
		expect(
			findItem(physics2!, /Failure Modes/, /Bernoulli-style reasoning/)
				.content
		).toContain("continuum models break down");
	});

	it("turns applied studio labs into explicit studio specifications", async () => {
		const course = await loadRawCourse("low-level-security");
		expect(course).not.toBeNull();

		const studioItem = course!.modules
			.flatMap(module => [
				...module.curriculum,
				...module.supplementalProjects
			])
			.find(item => item.content.includes("**Studio focus:**"));

		expect(studioItem?.content).toContain("**Build steps:**");
		expect(studioItem?.content).toContain("**Checkpoints:**");
		expect(studioItem?.content).toMatch(/authorization|authorized/i);
		expect(studioItem?.content).toMatch(/local (lab|evidence|target)/i);
	});

	it("keeps Assembly guidance concrete and architecture-specific", async () => {
		const course = await loadRawCourse("assembly");
		expect(course).not.toBeNull();

		const corpus = allCourseText(course);
		expect(corpus).not.toMatch(/This section covers/i);
		expect(corpus).not.toMatch(/Key idea:/i);
		expect(corpus).not.toMatch(/Skill target:/i);
		expect(corpus).not.toMatch(/\bsupplemental [23]\b/i);
		expect(corpus).not.toMatch(/\bImplementation Lab\b/i);
		expect(corpus).not.toMatch(/\bshould\b/i);
		expect(corpus).toContain(
			"The assembly pipeline is an artifact flow: source becomes object code"
		);
		expect(corpus).toContain(
			"The System V AMD64 calling convention defines where the first arguments live"
		);
		expect(corpus).toContain(
			"Instruction-level debugging treats a single machine instruction as the smallest meaningful step."
		);
		expect(corpus).toContain("Assembly Setup Transfer Practice");
		expect(corpus).toContain("Register Flow Transfer Practice");
		expect(corpus).toContain("Assembly Lab 15: Stack Trace Studio");
		expect(corpus).toContain("Assembly Lab 16: ABI Integration Studio");
		expect(corpus).toContain("Assembly Lab 17: Reverse Trace Studio");
		expect(corpus).toContain("Reverse Trace Extension Practice");
	});
});
