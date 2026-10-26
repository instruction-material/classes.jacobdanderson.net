import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { loadRawCourse } from "@/stores/courses/index";
import { javascriptLevel1Course } from "@/stores/courses/javascript-level-1";

const EXPECTED_CORE_SEQUENCE = [
	"JSS1 Variables and Data Types",
	"JSS2 Operators and Math",
	"JSS3 For and While Loops",
	"JSS4 Combining Loops and Variables",
	"JSS5 Conditionals",
	"JSS6 Advanced Conditionals",
	"JSS7 Drawing in JavaScript",
	"JSS8 Nested Loops",
	"Check-In #1",
	"JSS9 Introduction to HTML & CSS",
	"JSS10 Animations in JavaScript",
	"JSS11 More HTML & CSS",
	"JSS12 Basic Website Layout",
	"JSS13 The Grid Layout",
	"JSS14 Dynamic Websites with JavaScript",
	"Check-In #2",
	"JSS15 Master Project"
];

const PRACTICE_SECTIONS = [
	"variables-types-and-private-input-case",
	"operators-conversion-and-randomness-case",
	"loop-range-and-stop-condition-case",
	"functions-accumulators-and-generated-values-case",
	"conditional-rule-table-case",
	"compound-condition-and-truthiness-case",
	"native-svg-shape-case",
	"nested-loop-pattern-and-work-budget-case",
	"fundamentals-checkpoint-case",
	"semantic-html-and-css-case",
	"events-animation-and-reduced-motion-case",
	"box-model-positioning-and-reflow-case",
	"component-library-and-native-fallback-case",
	"grid-source-order-and-responsive-case",
	"dom-state-and-safe-rendering-case",
	"web-experience-checkpoint-case",
	"accessible-interactive-site-capstone-case"
];

const ANSWER_SECTIONS = PRACTICE_SECTIONS.map(section =>
	section.replace(/-case$/u, "-key")
);

async function requireJavaScriptLevel1Course() {
	const course = await loadRawCourse(
		"javascript-level-1-javascript-superstar"
	);
	expect(course).not.toBeNull();
	return course!;
}

function courseItems(module: (typeof javascriptLevel1Course.modules)[number]) {
	return [...module.curriculum, ...module.supplementalProjects];
}

function markdownHeadingSlugs(markdown: string) {
	return new Set(
		[...markdown.matchAll(/^#{1,6}\s+(.+)$/gmu)].map(([, heading]) =>
			heading
				.toLowerCase()
				.replace(/[`*_]/gu, "")
				.replace(/[^\p{L}\p{N}\s-]/gu, "")
				.trim()
				.replace(/\s+/gu, "-")
				.replace(/-+/gu, "-")
		)
	);
}

function assetText(filename: string) {
	return fs.readFileSync(
		path.resolve(
			__dirname,
			`../public/course-assets/javascript-level-1/${filename}`
		),
		"utf8"
	);
}

describe("JavaScript Level 1 learner flow", () => {
	it("places each checkpoint after the material it assesses and keeps one appendix", async () => {
		const loaded = await requireJavaScriptLevel1Course();
		const loadedCore = loaded.modules.filter(
			module => module.kind !== "appendix"
		);

		expect(
			javascriptLevel1Course.modules
				.filter(module => module.kind !== "appendix")
				.map(module => module.title)
		).toEqual(EXPECTED_CORE_SEQUENCE);
		expect(loadedCore.map(module => module.title)).toEqual(
			EXPECTED_CORE_SEQUENCE
		);
		expect(loadedCore[8]?.title).toBe("Check-In #1");
		expect(loadedCore[15]?.title).toBe("Check-In #2");
		expect(loadedCore.at(-1)?.title).toBe("JSS15 Master Project");
		expect(javascriptLevel1Course.modules.at(-1)?.title).toBe(
			"Pending Demo Media"
		);
		expect(javascriptLevel1Course.modules.at(-1)?.kind).toBe("appendix");
	});

	it("makes checkpoints required in sequence and optional as placement previews", () => {
		for (const title of ["Check-In #1", "Check-In #2"]) {
			const module = javascriptLevel1Course.modules.find(
				candidate => candidate.title === title
			);
			expect(module?.curriculum[0].content, title).toContain(
				"required checkpoint"
			);
			expect(module?.curriculum[0].content, title).toContain(
				"optional placement preview"
			);
			expect(module?.curriculum[0].content, title).toContain(
				"independent attempt"
			);
		}
	});

	it("adds a bounded schedule and six-part reasoning map to every core module", () => {
		const modules = javascriptLevel1Course.modules.filter(
			module => module.kind !== "appendix"
		);

		for (const module of modules) {
			expect(module.kind, module.title).toBe("module");
			expect(module.estimatedTime, module.title).toMatch(/session/u);
			expect(module.keyBlocks, module.title).toHaveLength(6);
			expect(module.curriculum[0].content, module.title).toContain(
				"**Course flow:**"
			);
			expect(module.curriculum[0].content, module.title).toContain(
				"**Standards route:**"
			);
			expect(module.curriculum[0].content, module.title).toContain(
				"**Evidence gate:**"
			);
			expect(module.curriculum[0].content, module.title).toContain(
				"**Local continuity:**"
			);
			expect(module.curriculum[0].content, module.title).toContain(
				"**Current references:**"
			);
		}
	});

	it("retains original projects and gives every project a local continuity route", () => {
		const projectItems = javascriptLevel1Course.modules
			.filter(module => module.kind !== "appendix")
			.flatMap(courseItems)
			.filter(item => item.projectLink);
		const githubItems = projectItems.filter(item =>
			item.projectLink?.includes(
				"github.com/instruction-material/Web-Development-Foundations"
			)
		);

		expect(githubItems).toHaveLength(12);
		const githubUrls = new Set(
			githubItems.flatMap(item => [item.projectLink, item.solutionLink])
		);
		expect(githubUrls.size).toBe(24);
		for (const item of githubItems) {
			expect(item.projectLink, item.title).toContain("/starter");
			expect(item.solutionLink, item.title).toContain("/solution");
			expect(item.solutionLink, item.title).not.toBe(item.projectLink);
		}
		for (const item of projectItems) {
			expect(item.datasetLink, item.title).toMatch(
				/^\/course-assets\/javascript-level-1\/javascript-level-1-practice-pack\.md#/u
			);
			expect(item.mediaLink, item.title).toMatch(/^https:\/\//u);
		}
	});

	it("keeps every supplied practice and verification anchor valid", () => {
		const practiceSlugs = markdownHeadingSlugs(
			assetText("javascript-level-1-practice-pack.md")
		);
		const answerSlugs = markdownHeadingSlugs(
			assetText("javascript-level-1-verification-guide.md")
		);

		for (const section of PRACTICE_SECTIONS) {
			expect(practiceSlugs, section).toContain(section);
		}
		for (const section of ANSWER_SECTIONS) {
			expect(answerSlugs, section).toContain(section);
		}

		for (const module of javascriptLevel1Course.modules.filter(
			candidate => candidate.kind !== "appendix"
		)) {
			const content = module.curriculum[0].content;
			const practiceMatch = content.match(
				/\/course-assets\/javascript-level-1\/javascript-level-1-practice-pack\.md#([a-z0-9-]+)/u
			);
			const answerMatch = content.match(
				/\/course-assets\/javascript-level-1\/javascript-level-1-verification-guide\.md#([a-z0-9-]+)/u
			);

			expect(practiceMatch, module.title).not.toBeNull();
			expect(answerMatch, module.title).not.toBeNull();
			expect(practiceSlugs, module.title).toContain(practiceMatch?.[1]);
			expect(answerSlugs, module.title).toContain(answerMatch?.[1]);
		}
	});

	it("uses current browser standards and scopes preserved legacy helpers", async () => {
		const text = JSON.stringify(await requireJavaScriptLevel1Course());

		expect(text).toContain("ECMAScript 2026");
		expect(text).toContain("HTML Living Standard");
		expect(text).toContain("Drawing and gallery packs bundle D3 5.16.0");
		expect(text).toContain("animation packs bundle D3 7.9.0");
		expect(text).toContain("D3 7.9.0");
		expect(text).toContain("Materialize 2.2.2");
		expect(text).toContain(
			"printToScreen(), prompt(), and alert() are labeled introductory"
		);
		expect(text).toContain(
			"core concepts also have a native HTML, CSS, DOM, or SVG route"
		);
	});

	it("states the linked source limitation instead of overstating its depth", async () => {
		const metadata = (await requireJavaScriptLevel1Course())
			.developmentMetadata;

		expect(metadata?.sourcePolicy).toContain(
			"generic click-to-add-list wrappers"
		);
		expect(metadata?.sourcePolicy).toContain(
			"original CodePen projects contain most of the historical project variety"
		);
		expect(metadata?.sourcePolicy).toContain(
			"module-specific, host-independent evidence"
		);
	});

	it("bounds privacy, unsafe rendering, accessibility, dependencies, and AI use", async () => {
		const text = JSON.stringify(await requireJavaScriptLevel1Course());

		expect(text).toContain(
			"never request or publish a learner's real password"
		);
		expect(text).toContain(
			"Render learner-controlled text with textContent"
		);
		expect(text).toContain(
			"preserve labels, keyboard operation, focus, source order"
		);
		expect(text).toContain("Treat CodePen, CDN scripts, D3, Materialize");
		expect(text).toContain(
			"AI cannot receive personal responses, invent project requirements"
		);
	});

	it("retains the strongest original project detail and labels", async () => {
		const text = JSON.stringify(await requireJavaScriptLevel1Course());

		expect(text).toContain("convert the numeric inputs");
		expect(text).toContain("combined 3-and-5 condition");
		expect(text).toContain("readable without relying only on color");
		expect(text).toContain(
			"JSS4 Supplemental Project 1: Debugging Football"
		);
		expect(text).toContain(
			"Dynamic Websites with JavaScript Extension Practice"
		);
	});

	it("publishes a complete metadata, safety, and capstone contract", async () => {
		const metadata = (await requireJavaScriptLevel1Course())
			.developmentMetadata;

		expect(metadata).toBeDefined();
		expect(metadata?.standards.length).toBeGreaterThanOrEqual(5);
		expect(metadata?.toolchain).toHaveLength(5);
		expect(metadata?.safetyPolicy).toHaveLength(6);
		expect(metadata?.courseBoundaries).toHaveLength(4);
		expect(metadata?.capstoneExpectations).toHaveLength(6);
		expect(metadata?.sourcePolicy).toContain(
			"Canonical local source repository"
		);
	});
});
