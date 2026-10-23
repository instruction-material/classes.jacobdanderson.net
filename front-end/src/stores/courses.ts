import type {
	CourseDefinition,
	CourseModuleItem,
	CourseSummary,
	RawCourse
} from "./courses/types";
import { defineStore } from "pinia";

import { computed } from "vue";
import {
	isInstructionMaterialResourceUrl,
	scratchProjectEmbedUrl
} from "@/modules/resourceUrls";
import { useAppStore } from "./app";
import algebraProgressHistory from "./courses/algebra-progress-history.json";
import apcsaProgressHistory from "./courses/apcsa-progress-history.json";
import assemblyProgressHistory from "./courses/assembly-progress-history.json";
import broadTitleProgressHistory from "./courses/broad-title-progress-history.json";
import cppAlgorithmsProgressHistory from "./courses/cpp-algorithms-progress-history.json";
import cppDesignPatternsProgressHistory from "./courses/cpp-design-patterns-progress-history.json";
import designPatternsPart2ProgressHistory from "./courses/design-patterns-part-2-progress-history.json";
import generatedTitleProgressHistory from "./courses/generated-title-progress-history.json";
import { courseCatalog, loadRawCourse } from "./courses/index";
import javaLevel1ProgressHistory from "./courses/java-level-1-progress-history.json";
import javaLevel2ProgressHistory from "./courses/java-level-2-progress-history.json";
import { isJuniScratchProjectTitle } from "./courses/juniScratchProjects";
import languageBridgeProgressHistory from "./courses/language-bridge-progress-history.json";
import linuxProgressHistory from "./courses/linux-progress-history.json";
import lowLevelSecurityPart2ProgressHistory from "./courses/low-level-security-part-2-progress-history.json";
import lowLevelSecurityProgressHistory from "./courses/low-level-security-progress-history.json";
import machineLearningProgressHistory from "./courses/machine-learning-progress-history.json";
import networkSystemsProgressHistory from "./courses/network-systems-progress-history.json";
import usacoBronzeLegacyProgressHistory from "./courses/usaco-bronze-legacy-progress-history.json";
import usacoProgressHistory from "./courses/usaco-progress-history.json";

function mergeHistoricalAliasMaps(
	...maps: Record<string, string[]>[]
): Record<string, string[]> {
	const merged: Record<string, string[]> = {};
	for (const map of maps) {
		for (const [currentId, previousIds] of Object.entries(map)) {
			merged[currentId] = [...(merged[currentId] ?? []), ...previousIds];
		}
	}
	return merged;
}

function mergeCourseHistoricalAliases(
	base: Record<string, Record<string, string[]>>,
	additional: Record<string, Record<string, string[]>>
): Record<string, Record<string, string[]>> {
	const merged = { ...base };
	for (const [courseId, aliases] of Object.entries(additional)) {
		merged[courseId] = mergeHistoricalAliasMaps(
			base[courseId] ?? {},
			aliases
		);
	}
	return merged;
}

const historicalModuleAliasesBase: Record<string, Record<string, string[]>> = {
	"linux-systems": linuxProgressHistory.modules,
	"low-level-security": lowLevelSecurityProgressHistory.modules,
	"usaco-bronze": usacoBronzeLegacyProgressHistory.modules,
	"low-level-security-part-2": {
		"low-level-security-part-2-low-level-security-lab-13-exploitability-triage-studio":
			["low-level-security-part-2-low-level-security-lab-13"],
		"low-level-security-part-2-low-level-security-lab-14-stack-corruption-hardening-studio":
			["low-level-security-part-2-low-level-security-lab-14"],
		"low-level-security-part-2-low-level-security-lab-15-heap-lifetime-audit-studio":
			["low-level-security-part-2-low-level-security-lab-15"],
		"low-level-security-part-2-low-level-security-lab-16-disclosure-boundary-hardening-studio":
			["low-level-security-part-2-low-level-security-lab-16"],
		"low-level-security-part-2-low-level-security-lab-17-defensive-audit-capstone-studio":
			["low-level-security-part-2-low-level-security-lab-17"]
	},
	"machine-learning": machineLearningProgressHistory.modules,
	"network-systems": {
		"network-systems-network-systems-lab-17-operations-capstone-studio": [
			"network-systems-network-systems-lab-17"
		]
	},
	"python-to-java-and-cpp-bridge": {
		"python-to-java-and-cpp-bridge-language-bridge-lab-17-bridge-capstone-port-studio":
			["python-to-java-and-cpp-bridge-language-bridge-lab-17"]
	}
};
const historicalModuleAliases = mergeCourseHistoricalAliases(
	historicalModuleAliasesBase,
	broadTitleProgressHistory.modules
);
const historicalItemAliasesBase: Record<string, Record<string, string[]>> = {
	...algebraProgressHistory,
	...assemblyProgressHistory,
	...cppAlgorithmsProgressHistory,
	...cppDesignPatternsProgressHistory,
	...usacoProgressHistory,
	"usaco-bronze": mergeHistoricalAliasMaps(
		usacoProgressHistory["usaco-bronze"],
		usacoBronzeLegacyProgressHistory.items
	),
	...apcsaProgressHistory,
	...designPatternsPart2ProgressHistory,
	...javaLevel1ProgressHistory,
	...javaLevel2ProgressHistory,
	...languageBridgeProgressHistory,
	"linux-systems": linuxProgressHistory.items,
	"low-level-security": lowLevelSecurityProgressHistory.items,
	...lowLevelSecurityPart2ProgressHistory,
	"machine-learning": machineLearningProgressHistory.items,
	...networkSystemsProgressHistory
};
const historicalItemAliases = mergeCourseHistoricalAliases(
	mergeCourseHistoricalAliases(
		historicalItemAliasesBase,
		generatedTitleProgressHistory
	),
	broadTitleProgressHistory.items
);

const COMBINING_MARKS_RE = /[\u0300-\u036F]/g;
const NON_ALPHANUMERIC_RE = /[^a-z0-9]+/g;
const LEADING_HYPHENS_RE = /^-+/;
const TRAILING_HYPHENS_RE = /-+$/;
const PARAGRAPH_BREAK_RE = /\n{2,}/;
const NEWLINE_RE = /\n+/g;
const WHITESPACE_RE = /\s+/g;
const INSTRUCTOR_NOTE_RE = /instructor note/i;
const EXCESS_BLANK_LINES_RE = /\n{3,}/g;
const PROJECT_TITLE_RE =
	/\bproject\b|\bcapstone\b|^problem:|^practice:|^extension:|^optional project:/i;
const MERGE_INTO_PREVIOUS_TITLE_RE = /^course recap$/i;
const PRESENTATION_TITLE_RE = /presentation$/i;
const SENTENCE_END_RE = /[.!?]$/;
const SENTENCE_SPLIT_RE = /(?<=[.!?])\s+/;
const TRAILING_SLASH_RE = /\/$/;
const TRAILING_URL_PUNCTUATION_RE = /[),.;:]+$/;
const GITHUB_BLOB_SEGMENT_RE = /\/blob\//i;
const DEDICATED_SOLUTION_SEGMENT_RE =
	/(?:^|\/)solution(?:\/|$)|(?:^|[-_])solution(?:[-_]|$)/i;
const REFERENCE_LEAD_LABEL_RE = /reference|repo|starter/i;
const FIRST_WHITESPACE_RE = /\s/;
const MAX_SUMMARY_SENTENCES = 2;
const MAX_SUMMARY_LENGTH = 240;
const BOILERPLATE_SENTENCE_FILTERS = [
	/^Anchor the lesson in one concrete example and one quick debugging or reasoning check before moving on\.?$/i,
	/^Have students finish the missing implementation, test at least two custom cases, and write down one design change they would make after the first working version\.?$/i,
	/^Have students test at least one custom case, explain the main design choice, and note one revision after the first working draft\.?$/i,
	/^Use this module build as the main implementation checkpoint\.?$/i,
	/^Students finish the starter, verify one custom case, and compare design choices against a worked comparison afterward\.?$/i,
	/^Students should finish the starter, verify one custom case, and compare design choices against the reference solution afterward\.?$/i,
	/^Compare with the reference solution only after a working draft exists\.?$/i,
	/^Break the work into a small sequence, implement the first working version, then tighten one weak spot before calling it done\.?$/i,
	/^Keep the scope small, but require one meaningful design or reasoning choice\.?$/i,
	/^Keep the scope tight, but require one meaningful design or reasoning decision\.?$/i,
	/^The habit should be evidence first, assumptions second\.?$/i,
	/^Have them diagnose a broken attempt, repair it, and explain why the fix works\.?$/i,
	/^End with one quick environment check so students can tell the toolchain is working before the next lesson builds on it\.?$/i,
	/^Close with one concrete example and one quick debugging check so the idea stays attached to code or data rather than isolated vocabulary\.?$/i,
	/^Anchor the lesson in one concrete example and one quick check for understanding before moving on\.?$/i
];
const BOILERPLATE_SENTENCE_REWRITES: Array<{
	pattern: RegExp;
	replace: (...matches: string[]) => string;
}> = [
	{
		pattern:
			/^Use the linked starter and solution for a supplemental project tied to (.+?)\.?$/i,
		replace: (_whole, topic) =>
			`Supplemental practice for ${topic} using the linked starter.`
	},
	{
		pattern:
			/^Extend the work from (.+?) with a tighter constraint, one extra feature, or a slightly more realistic input case\.?$/i,
		replace: (_whole, topic) =>
			`Extend ${topic} with one tighter constraint or extra feature.`
	},
	{
		pattern:
			/^Repeat the core ideas from (.+?) on a smaller problem so the student can work faster, with less prompting, and with cleaner reasoning\.?$/i,
		replace: (_whole, topic) =>
			`Practice ${topic} again on a smaller problem.`
	},
	{
		pattern:
			/^Close (.+?) by checking outputs, comparing alternate approaches, and recording one improvement that would make the work more robust on a second pass\.?$/i,
		replace: (_whole, topic) =>
			`Review ${topic}, compare approaches, and record one improvement for the next pass.`
	}
];
const STRUCTURED_COURSE_SUPPORT_RE =
	/\*\*(?:Normal|Hard|Concept focus|Project goal|Fluency goal|Variant goal|Teaching flow|Learning sequence|Diagnostic guidance|Readiness check|Misconception check|Common pitfalls|Exit check|Mastery check|Remote investigation|Science explanation|Studio focus|AP connection):?\*\*/i;
const MARKDOWN_LIST_BLOCK_RE = /(?:^|\n)\s*(?:[-*]|\d+\.)\s+\S/;
const FENCED_CODE_BLOCK_RE = /(?:^|\n)[\t ]*(?:`{3,}|~{3,})/;
const MARKDOWN_HEADING_RE = /(?:^|\n)[\t ]{0,3}#{1,6}[\t ]+\S/;
const MARKDOWN_TABLE_RE = /(?:^|\n)[\t ]*(?:\|[\t ]*)?:?-{3,}:?[\t ]*\|/;

interface NormalizeCourseOptions {
	includeSolutions: boolean;
}

export type {
	CourseDefinition,
	CourseModule,
	CourseModuleItem
} from "./courses/types";

function slugify(value: string): string {
	return value
		.toLowerCase()
		.normalize("NFKD")
		.replace(COMBINING_MARKS_RE, "")
		.replace(NON_ALPHANUMERIC_RE, "-")
		.replace(LEADING_HYPHENS_RE, "")
		.replace(TRAILING_HYPHENS_RE, "");
}

function courseEntityId(explicitId: string | undefined, fallbackId: string) {
	return explicitId?.trim() ? slugify(explicitId) : fallbackId;
}

function courseEntityAliases(
	explicitId: string | undefined,
	fallbackId: string,
	aliases: string[] | undefined
) {
	const normalizedExplicitId = explicitId?.trim() ? slugify(explicitId) : "";
	return [
		...(normalizedExplicitId ? [fallbackId] : []),
		...(aliases ?? []).map(alias => slugify(alias))
	]
		.map(alias => alias.trim())
		.filter(alias => alias && alias !== normalizedExplicitId);
}

function legacyTitleIds(
	courseId: string,
	scopeId: string,
	titles: string[] | undefined
) {
	return (titles ?? [])
		.filter(title => !isCourseScopedAlias(courseId, title))
		.map(title => slugify(title))
		.filter(Boolean)
		.map(title => `${scopeId}-${title}`);
}

function isCourseScopedAlias(courseId: string, alias: string) {
	return alias === slugify(alias) && alias.startsWith(`${courseId}-`);
}

const HIDDEN_ITEM_TITLES = new Set([
	"session recap & assignment",
	"recap & assignment review"
]);

function shouldHideItem(title: string) {
	return HIDDEN_ITEM_TITLES.has(title.trim().toLowerCase());
}

function normalizeContent(content: string): string {
	const chunks: string[] = [];
	let prose: string[] = [];
	let code: string[] = [];
	let fence = "";
	let indented = false;
	const flushIndentedCode = () => {
		while (code.at(-1)?.trim() === "") code.pop();
		if (code.length) chunks.push(code.join("\n"));
		code = [];
		indented = false;
	};
	const flushProse = () => {
		const text = prose
			.join("\n")
			.split(PARAGRAPH_BREAK_RE)
			.map(part => part.trim())
			.filter(Boolean)
			.filter(part => !INSTRUCTOR_NOTE_RE.test(part))
			.join("\n\n")
			.replace(EXCESS_BLANK_LINES_RE, "\n\n");
		if (text) chunks.push(text);
		prose = [];
	};
	// Prose cleanup must never trim indentation or remove note-like strings
	// inside supplied programs. A closing fence may be longer than its opener.
	for (const line of content.split("\n")) {
		if (fence) {
			code.push(line);
			const closing = line.match(/^[\t ]*(`{3,}|~{3,})[\t ]*\r?$/)?.[1];
			if (
				closing &&
				closing[0] === fence[0] &&
				closing.length >= fence.length
			) {
				chunks.push(code.join("\n"));
				code = [];
				fence = "";
			}
			continue;
		}
		if (indented) {
			if (/^(?: {4}|\t)/.test(line) || line.trim() === "") {
				code.push(line);
				continue;
			}
			flushIndentedCode();
		}
		const opening = line.match(/^[\t ]*(`{3,}|~{3,})/)?.[1];
		if (opening) {
			flushProse();
			fence = opening;
			code = [line];
		} else if (
			/^(?: {4}|\t)/.test(line) &&
			(prose.length === 0 || prose.at(-1)?.trim() === "")
		) {
			flushProse();
			indented = true;
			code = [line];
		} else {
			prose.push(line);
		}
	}
	flushProse();
	if (indented) flushIndentedCode();
	if (code.length) chunks.push(code.join("\n"));
	return chunks.join("\n\n").replace(/^\n+|\n+$/g, "");
}

function ensureSentence(text: string) {
	return SENTENCE_END_RE.test(text) ? text : `${text}.`;
}

function rewriteBoilerplateSentence(sentence: string) {
	const normalizedSentence = sentence.replace(WHITESPACE_RE, " ").trim();

	if (!normalizedSentence) {
		return "";
	}

	if (
		BOILERPLATE_SENTENCE_FILTERS.some(pattern =>
			pattern.test(normalizedSentence)
		)
	) {
		return "";
	}

	for (const { pattern, replace } of BOILERPLATE_SENTENCE_REWRITES) {
		const match = normalizedSentence.match(pattern);

		if (match) {
			return ensureSentence(replace(...match));
		}
	}

	return ensureSentence(normalizedSentence);
}

function compactContent(content: string): string {
	const normalized = normalizeContent(content);

	if (!normalized) {
		return "";
	}

	const sentences = normalized
		.replace(NEWLINE_RE, " ")
		.split(SENTENCE_SPLIT_RE)
		.map(sentence => sentence.trim())
		.filter(Boolean);
	const summary: string[] = [];

	for (const sentence of sentences) {
		const rewritten = rewriteBoilerplateSentence(sentence);

		if (!rewritten) {
			continue;
		}

		if (summary.at(-1)?.toLowerCase() === rewritten.toLowerCase()) {
			continue;
		}

		const candidate = [...summary, rewritten].join(" ");

		if (
			summary.length > 0 &&
			(summary.length >= MAX_SUMMARY_SENTENCES ||
				candidate.length > MAX_SUMMARY_LENGTH)
		) {
			break;
		}

		summary.push(rewritten);
	}

	if (summary.length > 0) {
		return summary.join(" ");
	}

	return "";
}

function displayCourseContent(content: string) {
	const normalized = normalizeContent(content);

	if (STRUCTURED_COURSE_SUPPORT_RE.test(normalized)) {
		return normalized;
	}

	if (
		MARKDOWN_LIST_BLOCK_RE.test(normalized) ||
		/\[[^\]\n]+\]\(\/ide\?[^)\n]+\)/.test(normalized) ||
		FENCED_CODE_BLOCK_RE.test(normalized) ||
		/^(?: {4}|\t)/m.test(normalized) ||
		MARKDOWN_HEADING_RE.test(normalized) ||
		MARKDOWN_TABLE_RE.test(normalized)
	) {
		return normalized;
	}

	return compactContent(normalized);
}

function trimUrl(url: string) {
	return url.trim().replace(TRAILING_URL_PUNCTUATION_RE, "");
}

function canonicalizeResourceUrl(url?: string) {
	if (!url) return undefined;

	const trimmedUrl = trimUrl(url);

	try {
		const parsed = new URL(trimmedUrl);

		if (parsed.hostname !== "github.com") {
			return trimmedUrl;
		}

		// A file link identifies that exact source or reading. Import policies
		// resolve required companion files separately from its display URL.
		return GITHUB_BLOB_SEGMENT_RE.test(parsed.pathname)
			? trimmedUrl
			: trimmedUrl.replace(TRAILING_SLASH_RE, "");
	} catch {
		return trimmedUrl;
	}
}

function extractLeadingResourceLink(title: string, content: string) {
	const separatorIndex = content.indexOf(": ");

	if (separatorIndex < 1 || separatorIndex > 60) {
		return null;
	}

	const label = content.slice(0, separatorIndex).trim();
	const afterLabel = content.slice(separatorIndex + 2).trimStart();

	if (!afterLabel.startsWith("http")) {
		return null;
	}

	const firstWhitespaceIndex = afterLabel.search(FIRST_WHITESPACE_RE);
	const rawUrl =
		firstWhitespaceIndex === -1
			? afterLabel
			: afterLabel.slice(0, firstWhitespaceIndex);
	const remainder =
		firstWhitespaceIndex === -1
			? ""
			: afterLabel.slice(firstWhitespaceIndex).trim();
	const normalizedUrl = canonicalizeResourceUrl(rawUrl);

	if (!normalizedUrl) {
		return null;
	}

	const isInstructionMaterialLink =
		isInstructionMaterialResourceUrl(normalizedUrl);
	const isReferenceLead = REFERENCE_LEAD_LABEL_RE.test(label);

	if (
		!isInstructionMaterialLink &&
		!isReferenceLead &&
		!PROJECT_TITLE_RE.test(title)
	) {
		return null;
	}

	return {
		content: remainder.trim(),
		isSolutionLink:
			/\bsolution\b/i.test(label) ||
			DEDICATED_SOLUTION_SEGMENT_RE.test(normalizedUrl),
		url: normalizedUrl
	};
}

type CourseModuleItemDraft = Omit<CourseModuleItem, "id" | "aliases"> & {
	stableAliases?: string[];
	stableId?: string;
	preserveReferenceAssignment?: boolean;
};

function mergeAdjacentSupportItems(
	items: CourseModuleItemDraft[],
	canMerge: (
		previousItem: CourseModuleItemDraft,
		item: CourseModuleItemDraft
	) => boolean = () => true
) {
	return items.reduce<CourseModuleItemDraft[]>((mergedItems, item) => {
		const previousItem = mergedItems.at(-1);

		if (
			previousItem &&
			!item.projectLink &&
			!item.preserveReferenceAssignment &&
			canMerge(previousItem, item) &&
			(MERGE_INTO_PREVIOUS_TITLE_RE.test(item.title) ||
				(PRESENTATION_TITLE_RE.test(item.title) &&
					PROJECT_TITLE_RE.test(previousItem.title)))
		) {
			previousItem.content = displayCourseContent(
				`${previousItem.content}\n\n${item.content}`
			);
			return mergedItems;
		}

		mergedItems.push(item);
		return mergedItems;
	}, []);
}

function normalizeCourse(
	course: RawCourse,
	courseId = slugify(course.name),
	options: NormalizeCourseOptions = { includeSolutions: true }
) {
	const preserveScratchProjectInstructions =
		courseId.startsWith("scratch-level-");

	return {
		id: courseId,
		name: course.name,
		modules: course.modules.map(module => {
			const generatedModuleId = slugify(`${courseId}-${module.title}`);
			const moduleId = courseEntityId(module.id, generatedModuleId);
			const legacyModuleIds = legacyTitleIds(
				courseId,
				courseId,
				module.aliases
			);
			const moduleAliases = [
				...new Set([
					...courseEntityAliases(
						module.id,
						generatedModuleId,
						module.aliases
					),
					...legacyModuleIds,
					...(historicalModuleAliases[courseId]?.[moduleId] ?? [])
				])
			].filter(alias => alias !== moduleId);

			const mapItems = (
				items: typeof module.curriculum,
				prefix: string
			): CourseModuleItem[] =>
				mergeAdjacentSupportItems(
					items
						.filter(item => !shouldHideItem(item.title))
						.map(item => {
							const explicitProjectLink = canonicalizeResourceUrl(
								item.projectLink
							);
							const extractedLink = extractLeadingResourceLink(
								item.title,
								item.content
							);
							const normalizedSolutionLink =
								canonicalizeResourceUrl(item.solutionLink);
							const projectLinkIsSolution =
								DEDICATED_SOLUTION_SEGMENT_RE.test(
									explicitProjectLink ?? ""
								);
							const legacySolutionLink = projectLinkIsSolution
								? explicitProjectLink
								: undefined;
							const extractedSolutionLink =
								extractedLink?.isSolutionLink
									? extractedLink.url
									: undefined;
							const resolvedSolutionLink =
								normalizedSolutionLink ??
								legacySolutionLink ??
								extractedSolutionLink;
							const playableSolutionEmbedUrl =
								scratchProjectEmbedUrl(
									resolvedSolutionLink ?? ""
								);
							const preserveProjectContent =
								item.preserveInstructions === true ||
								(preserveScratchProjectInstructions &&
									isJuniScratchProjectTitle(
										courseId,
										item.title
									));
							const normalizedContent = preserveProjectContent
								? item.content.trim()
								: normalizeContent(
										extractedLink?.content ?? item.content
									);

							return {
								// A worked reference does not become a starter. Retain the
								// assignment itself when its reference is hidden for learners.
								preserveReferenceAssignment:
									!!normalizedSolutionLink &&
									PROJECT_TITLE_RE.test(item.title) &&
									!DEDICATED_SOLUTION_SEGMENT_RE.test(
										normalizedSolutionLink
									),
								stableAliases: item.aliases,
								stableId: item.id,
								title: item.title,
								content: preserveProjectContent
									? normalizedContent
									: displayCourseContent(normalizedContent),
								learningPath: item.learningPath,
								ideImport: item.ideImport,
								projectLink: (() => {
									if (
										explicitProjectLink &&
										!projectLinkIsSolution
									) {
										return explicitProjectLink;
									}

									if (
										extractedLink?.url &&
										!extractedLink.isSolutionLink
									) {
										return extractedLink.url;
									}

									return undefined;
								})(),
								solutionLink: options.includeSolutions
									? resolvedSolutionLink
									: undefined,
								...(playableSolutionEmbedUrl
									? { playableSolutionEmbedUrl }
									: {}),
								datasetLink: item.datasetLink,
								mediaLink: item.mediaLink
							};
						}),
					(previousItem, item) =>
						!preserveScratchProjectInstructions ||
						(!isJuniScratchProjectTitle(
							courseId,
							previousItem.title
						) &&
							!isJuniScratchProjectTitle(courseId, item.title))
				).map(item => {
					const generatedItemId = slugify(
						`${generatedModuleId}-${prefix}-${item.title}`
					);
					const itemId = courseEntityId(
						item.stableId,
						generatedItemId
					);
					const legacyItemTitles = [
						item.title,
						...(item.stableAliases ?? []).filter(
							alias => !isCourseScopedAlias(courseId, alias)
						)
					];
					const itemAliases = [
						...new Set([
							...(historicalItemAliases[courseId]?.[itemId] ??
								[]),
							...courseEntityAliases(
								item.stableId,
								generatedItemId,
								item.stableAliases
							),
							...legacyTitleIds(
								courseId,
								`${generatedModuleId}-${prefix}`,
								item.stableAliases
							),
							...legacyTitleIds(
								courseId,
								`${moduleId}-${prefix}`,
								item.stableAliases
							),
							...legacyModuleIds.flatMap(moduleHistoryId =>
								legacyItemTitles.map(title =>
									slugify(
										`${moduleHistoryId}-${prefix}-${title}`
									)
								)
							)
						])
					].filter(alias => alias !== itemId);
					const {
						stableAliases: _stableAliases,
						stableId: _stableId,
						preserveReferenceAssignment:
							_preserveReferenceAssignment,
						...normalizedItem
					} = item;

					return {
						...normalizedItem,
						id: itemId,
						...(itemAliases.length ? { aliases: itemAliases } : {})
					};
				});

			return {
				id: moduleId,
				...(moduleAliases.length ? { aliases: moduleAliases } : {}),
				...(module.kind ? { kind: module.kind } : {}),
				title: module.title,
				...(module.estimatedTime
					? { estimatedTime: module.estimatedTime }
					: {}),
				...(module.keyBlocks?.length
					? { keyBlocks: [...module.keyBlocks] }
					: {}),
				curriculum: mapItems(module.curriculum, "curriculum"),
				supplementalProjects: mapItems(
					module.supplementalProjects,
					"supplemental"
				)
			};
		})
	} satisfies CourseDefinition;
}

const courseSummaries: CourseSummary[] = courseCatalog.map(({ id, name }) => ({
	id,
	name
}));

const normalizedLearnerCourseCache = new Map<string, CourseDefinition>();
const normalizedStaffCourseCache = new Map<string, CourseDefinition>();

function courseCacheFor(includeSolutions: boolean) {
	return includeSolutions
		? normalizedStaffCourseCache
		: normalizedLearnerCourseCache;
}

export const useCoursesStore = defineStore("courses", () => {
	const courses = computed(() => courseSummaries);
	const appStore = useAppStore();

	function canViewCourseSolutions(id: string) {
		if (appStore.currentAdmin) return true;
		return appStore.currentTutor?.coursePermissions?.includes(id) ?? false;
	}

	function getCourseById(id: string) {
		return courseCacheFor(canViewCourseSolutions(id)).get(id) ?? null;
	}

	async function loadCourseById(id: string) {
		const includeSolutions = canViewCourseSolutions(id);
		const courseCache = courseCacheFor(includeSolutions);
		const cachedCourse = courseCache.get(id);

		if (cachedCourse) {
			return cachedCourse;
		}

		const rawCourse = await loadRawCourse(id);

		if (!rawCourse) {
			return null;
		}

		const permittedAfterLoad = canViewCourseSolutions(id);
		const finalCache = courseCacheFor(permittedAfterLoad);
		const updatedCachedCourse = finalCache.get(id);
		if (updatedCachedCourse) return updatedCachedCourse;

		const normalizedCourse = normalizeCourse(rawCourse, id, {
			includeSolutions: permittedAfterLoad
		});

		finalCache.set(id, normalizedCourse);

		return normalizedCourse;
	}

	return {
		courses,
		getCourseById,
		loadCourseById
	};
});
