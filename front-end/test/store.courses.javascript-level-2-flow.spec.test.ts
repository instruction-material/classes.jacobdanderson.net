import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { loadRawCourse } from "@/stores/courses/index";
import { javascriptLevel2Course } from "@/stores/courses/javascript-level-2";

const EXPECTED_CORE_SEQUENCE = [
	"JSM1 Fundamentals Review",
	"JSM2 Functions",
	"JSM3 Complex Conditionals",
	"JSM4 Canvas",
	"JSM5 Arrays and Iterators",
	"JSM6 Objects and Properties",
	"Check-In #1",
	"JSM7 Helper Functions and Event Listeners",
	"JSM8 Collisions and Controls",
	"JSM9 Games in the Canvas",
	"JSM10 APIs and Requests",
	"JSM11 SQL and Schemas",
	"JSM12 NoSQL and CRUD",
	"Check-In #2",
	"JSM13 Message Board",
	"JSM14 Quiz Game",
	"JSM15 Master Project"
];

const PRACTICE_SECTIONS = [
	"level-1-readiness-and-state-case",
	"function-contract-and-pure-test-case",
	"decision-table-and-ternary-case",
	"canvas-coordinate-and-fallback-case",
	"array-transform-and-grid-case",
	"object-model-and-animation-state-case",
	"logic-data-canvas-checkpoint-case",
	"event-normalization-and-input-case",
	"collision-boundary-case",
	"bounded-game-loop-case",
	"resilient-fetch-and-fixture-case",
	"relational-schema-and-query-case",
	"local-crud-and-persistence-case",
	"events-requests-data-checkpoint-case",
	"safe-message-board-case",
	"accessible-quiz-state-machine-case",
	"browser-app-capstone-case"
];

const ANSWER_SECTIONS = PRACTICE_SECTIONS.map(section =>
	section.replace(/-case$/u, "-key")
);

async function requireJavaScriptLevel2Course() {
	const course = await loadRawCourse("javascript-level-2-javascript-master");
	expect(course).not.toBeNull();
	return course!;
}

function courseItems(module: (typeof javascriptLevel2Course.modules)[number]) {
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
			`../public/course-assets/javascript-level-2/${filename}`
		),
		"utf8"
	);
}

describe("JavaScript Level 2 learner flow", () => {
	it("places each checkpoint after the modules it assesses and retains one appendix", async () => {
		const loaded = await requireJavaScriptLevel2Course();
		const loadedCore = loaded.modules.filter(
			module => module.kind !== "appendix"
		);

		expect(
			javascriptLevel2Course.modules
				.filter(module => module.kind !== "appendix")
				.map(module => module.title)
		).toEqual(EXPECTED_CORE_SEQUENCE);
		expect(loadedCore.map(module => module.title)).toEqual(
			EXPECTED_CORE_SEQUENCE
		);
		expect(loadedCore[6]?.title).toBe("Check-In #1");
		expect(loadedCore[13]?.title).toBe("Check-In #2");
		expect(loadedCore.at(-1)?.title).toBe("JSM15 Master Project");
		expect(javascriptLevel2Course.modules.at(-1)?.title).toBe(
			"Pending Demo Media"
		);
		expect(javascriptLevel2Course.modules.at(-1)?.kind).toBe("appendix");
	});

	it("keeps checkpoints required in sequence and usable as placement previews", () => {
		for (const title of ["Check-In #1", "Check-In #2"]) {
			const module = javascriptLevel2Course.modules.find(
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

	it("adds a schedule and six-part reasoning map to every core module", () => {
		const modules = javascriptLevel2Course.modules.filter(
			module => module.kind !== "appendix"
		);

		for (const module of modules) {
			expect(module.kind, module.title).toBe("module");
			expect(module.estimatedTime, module.title).toMatch(/session/u);
			expect(module.keyBlocks, module.title).toHaveLength(6);
			if (module.title === "JSM10 APIs and Requests") {
				expect(module.curriculum[0].contentKind).toBe("reading");
				for (const concept of [
					"fetch",
					"promise",
					"await",
					"try",
					"catch",
					"finally",
					"JSON",
					"cancellation"
				]) {
					expect(module.curriculum[0].content).toContain(concept);
				}
				continue;
			}
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

	it("retains linked source folders and gives every project local evidence", () => {
		const projectItems = javascriptLevel2Course.modules
			.filter(module => module.kind !== "appendix")
			.flatMap(courseItems)
			.filter(item => item.projectLink);
		const githubItems = projectItems.filter(item =>
			item.projectLink?.includes(
				"github.com/instruction-material/Web-Development-Foundations"
			)
		);

		expect(githubItems).toHaveLength(28);
		const githubUrls = new Set(
			githubItems.flatMap(item => [item.projectLink, item.solutionLink])
		);
		expect(githubUrls.size).toBe(54);
		for (const item of githubItems) {
			expect(item.projectLink, item.title).toContain("/starter");
			expect(item.solutionLink, item.title).toContain("/solution");
			expect(item.solutionLink, item.title).not.toBe(item.projectLink);
		}
		for (const item of projectItems) {
			expect(item.datasetLink, item.title).toMatch(
				/^\/course-assets\/javascript-level-2\/javascript-level-2-practice-pack\.md#/u
			);
			expect(item.mediaLink, item.title).toMatch(/^https:\/\//u);
		}
	});

	it("keeps every practice and verification anchor valid", () => {
		const practiceSlugs = markdownHeadingSlugs(
			assetText("javascript-level-2-practice-pack.md")
		);
		const answerSlugs = markdownHeadingSlugs(
			assetText("javascript-level-2-verification-guide.md")
		);

		for (const section of PRACTICE_SECTIONS) {
			expect(practiceSlugs, section).toContain(section);
		}
		for (const section of ANSWER_SECTIONS) {
			expect(answerSlugs, section).toContain(section);
		}

		for (const module of javascriptLevel2Course.modules.filter(
			candidate => candidate.kind !== "appendix"
		)) {
			const content = module.curriculum[0].content;
			const practiceMatch = content.match(
				/\/course-assets\/javascript-level-2\/javascript-level-2-practice-pack\.md#([a-z0-9-]+)/u
			);
			const answerMatch = content.match(
				/\/course-assets\/javascript-level-2\/javascript-level-2-verification-guide\.md#([a-z0-9-]+)/u
			);

			expect(practiceMatch, module.title).not.toBeNull();
			expect(answerMatch, module.title).not.toBeNull();
			expect(practiceSlugs, module.title).toContain(practiceMatch?.[1]);
			expect(answerSlugs, module.title).toContain(answerMatch?.[1]);
		}
	});

	it("keeps JavaScript Level 2 browser-only and removes browser credential requirements", async () => {
		const text = JSON.stringify(await requireJavaScriptLevel2Course());

		expect(text).toContain("ECMAScript 2026");
		expect(text).toContain("Canvas 2D");
		expect(text).toContain("no package install, back end, or build step");
		expect(text).toContain(
			"Never place a JSONBin master key, access key, database credential"
		);
		expect(text).toContain(
			"do not create, paste, or ship either key in CodePen or browser source"
		);
		expect(text).toContain("Required CRUD stays local");
	});

	it("uses resilient public reads and complete local fallbacks", async () => {
		const text = JSON.stringify(await requireJavaScriptLevel2Course());

		expect(text).toContain("checks Response.ok");
		expect(text).toContain("supports abort or timeout");
		expect(text).toContain("caches repeated reads");
		expect(text).toContain("follows provider fair-use guidance");
		expect(text).toContain(
			"remains usable when offline, blocked by CORS, changed, or rate-limited"
		);
		expect(text).toContain(
			"The fixture route always produces the expected first name"
		);
	});

	it("states source depth and hosted-tool limits honestly", async () => {
		const metadata = (await requireJavaScriptLevel2Course())
			.developmentMetadata;

		expect(metadata?.sourcePolicy).toContain(
			"generic click-to-add-list wrappers"
		);
		expect(metadata?.sourcePolicy).toContain(
			"original CodePen and hosted-tool projects contain most of the historical project variety"
		);
		expect(metadata?.sourcePolicy).toContain(
			"canvas, event, request, relational, CRUD, and capstone evidence"
		);
	});

	it("bounds game loops, canvas access, safe content, and local data", async () => {
		const text = JSON.stringify(await requireJavaScriptLevel2Course());

		expect(text).toContain(
			"Canvas and game work provides semantic controls"
		);
		expect(text).toContain("focus-aware key capture");
		expect(text).toContain(
			"text equivalent for score, status, instructions, and outcomes"
		);
		expect(text).toContain("render text with textContent");
		expect(text).toContain("allow only reviewed URL protocols and origins");
		expect(text).toContain(
			"cap arrays, loops, frames, retries, and stored records"
		);
	});

	it("retains original project depth while strengthening weak data modules", async () => {
		const text = JSON.stringify(await requireJavaScriptLevel2Course());

		expect(text).toContain(
			"Functions turn a repeated process into a named operation"
		);
		expect(text).toContain(
			"API requests are asynchronous because the browser must wait for another service to respond"
		);
		expect(text).toContain(
			"The key skill is separating local page state from persisted remote state"
		);
		expect(text).toContain(
			"Find the parent topic by stable ID"
		);
		expect(text).toContain(
			"A relational database represents entities as tables"
		);
		expect(text).toContain(
			"Neither model removes the need for identifiers, validation, constraints"
		);
	});

	it("publishes a complete metadata, safety, and capstone contract", async () => {
		const metadata = (await requireJavaScriptLevel2Course())
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
