import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { loadRawCourse } from "@/stores/courses/index";
import { rustSystemsSecurityCourse } from "@/stores/courses/rust-systems-security";

const EXPECTED_CORE_SEQUENCE = [
	"RSS0 Tooling, Cargo, and Why Rust Exists",
	"RSS1 Ownership, Moves, and Memory Responsibility",
	"RSS2 Borrowing, Aliasing, and Lifetimes",
	"RSS3 Option, Result, and Typed Error Paths",
	"RSS4 Strings, Slices, Collections, and Bounds Safety",
	"RSS5 Structs, Enums, and Safer State Models",
	"RSS6 Traits, Iterators, and API Contracts",
	"RSS7 Files, Parsers, and Secure CLI Design",
	"RSS8 Concurrency and Race Reduction",
	"RSS9 Unsafe, FFI, and Trusted Boundaries",
	"RSS10 Capstone: Harden a Legacy Tool"
];

const PRACTICE_SECTIONS = [
	"toolchain-baseline-and-build-evidence-case",
	"ownership-resource-ledger-case",
	"borrowing-aliasing-refactor-case",
	"typed-error-parser-case",
	"bounds-safe-collections-case",
	"state-machine-enum-case",
	"trait-api-contract-case",
	"secure-cli-parser-case",
	"concurrency-invariant-case",
	"unsafe-ffi-boundary-case",
	"legacy-tool-hardening-capstone-case"
];

const ANSWER_SECTIONS = PRACTICE_SECTIONS.map(section =>
	section.replace(/-case$/u, "-key")
);

async function requireRustSystemsCourse() {
	const course = await loadRawCourse("rust-systems-security");
	expect(course).not.toBeNull();
	return course!;
}

function courseItems(
	module: (typeof rustSystemsSecurityCourse.modules)[number]
) {
	return [...module.curriculum, ...module.supplementalProjects];
}

function markdownHeadingSlugs(markdown: string) {
	return new Set(
		[...markdown.matchAll(/^#{1,6}[ \t]+(\S.*)$/gmu)].map(([, heading]) =>
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
			`../public/course-assets/rust-systems-security/${filename}`
		),
		"utf8"
	);
}

describe("rust Systems Security learner flow", () => {
	it("keeps one coherent Rust systems progression ending in one capstone", async () => {
		const loaded = await requireRustSystemsCourse();
		const loadedCore = loaded.modules.filter(
			module => module.kind !== "appendix"
		);

		expect(
			rustSystemsSecurityCourse.modules.map(module => module.title)
		).toEqual(EXPECTED_CORE_SEQUENCE);
		expect(loadedCore.map(module => module.title)).toEqual(
			EXPECTED_CORE_SEQUENCE
		);
		expect(loadedCore).toHaveLength(11);
		expect(loadedCore.at(-1)?.title).toContain("Capstone");
	});

	it("adds a bounded schedule and six-part reasoning map to every module", () => {
		for (const module of rustSystemsSecurityCourse.modules) {
			expect(module.kind, module.title).toBe("module");
			expect(module.estimatedTime, module.title).toMatch(/session/u);
			expect(module.keyBlocks, module.title).toHaveLength(6);
			expect(module.curriculum[0].content, module.title).toContain(
				"**Course flow:**"
			);
			expect(module.curriculum[0].content, module.title).toContain(
				"**Bounded practice route:**"
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

	it("keeps every existing source checkpoint traceable as starter and solution", () => {
		const projectItems = rustSystemsSecurityCourse.modules
			.flatMap(courseItems)
			.filter(item => item.projectLink);

		expect(projectItems).toHaveLength(44);
		for (const item of projectItems) {
			expect(item.projectLink, item.title).toContain(
				"github.com/instruction-material/Low-Level-Security"
			);
			expect(item.projectLink, item.title).toContain("/starter");
			expect(item.solutionLink, item.title).toContain("/solution");
			expect(item.solutionLink, item.title).not.toBe(item.projectLink);
			expect(item.datasetLink, item.title).toMatch(
				/^\/course-assets\/rust-systems-security\/rust-systems-security-practice-pack\.md#/u
			);
			expect(item.mediaLink, item.title).toMatch(/^https:\/\//u);
		}
	});

	it("keeps every supplied practice and verification anchor valid", () => {
		const practiceSlugs = markdownHeadingSlugs(
			assetText("rust-systems-security-practice-pack.md")
		);
		const answerSlugs = markdownHeadingSlugs(
			assetText("rust-systems-security-verification-guide.md")
		);

		for (const section of PRACTICE_SECTIONS) {
			expect(practiceSlugs, section).toContain(section);
		}
		for (const section of ANSWER_SECTIONS) {
			expect(answerSlugs, section).toContain(section);
		}

		for (const module of rustSystemsSecurityCourse.modules) {
			const content = module.curriculum[0].content;
			const practiceMatch = content.match(
				/\/course-assets\/rust-systems-security\/rust-systems-security-practice-pack\.md#([a-z0-9-]+)/u
			);
			const answerMatch = content.match(
				/\/course-assets\/rust-systems-security\/rust-systems-security-verification-guide\.md#([a-z0-9-]+)/u
			);

			expect(practiceMatch, module.title).not.toBeNull();
			expect(answerMatch, module.title).not.toBeNull();
			expect(practiceSlugs, module.title).toContain(practiceMatch?.[1]);
			expect(answerSlugs, module.title).toContain(answerMatch?.[1]);
		}
	});

	it("uses the pinned Rust toolchain and edition without rewriting source history", async () => {
		const text = JSON.stringify(await requireRustSystemsCourse());

		expect(text).toContain("Rust 1.97.1");
		expect(text).toContain("Rust 2024 edition");
		expect(text).toContain("pinned Rust 2024 Cargo workspaces");
		expect(text).toContain(
			"cargo clippy --all-targets --all-features -- -D warnings"
		);
		expect(text).toContain("cargo test --locked");
	});

	it("describes the complete pinned workspaces and preserves the earlier checkpoint distinction", async () => {
		const metadata = (await requireRustSystemsCourse()).developmentMetadata;

		expect(metadata?.sourcePolicy).toContain(
			"module-specific Rust 2024 Cargo workspaces"
		);
		expect(metadata?.sourcePolicy).toContain(
			"Earlier label-sanitization checkpoints remain historical source and saved work"
		);
		expect(metadata?.sourcePolicy).toContain(
			"supplied Rust cases and verification guide"
		);
	});

	it("bounds dependency, Miri, fuzzing, unsafe, and FFI evidence", async () => {
		const text = JSON.stringify(await requireRustSystemsCourse());

		expect(text).toContain(
			"cargo audit is an installed RustSec tool whose live advisory refresh may require network access"
		);
		expect(text).toContain(
			"Miri and cargo fuzz are optional, bounded advanced tools"
		);
		expect(text).toContain(
			"Fuzzing has a fixed seed corpus, input-size cap, run or case budget"
		);
		expect(text).toContain(
			"Prefer safe Rust; every unsafe operation names the invariant"
		);
		expect(text).toContain("compiling C or running Miri is optional");
	});

	it("keeps local scope, privacy, AI, and security claims bounded", async () => {
		const text = JSON.stringify(await requireRustSystemsCourse());

		expect(text).toContain(
			"no live service, third-party binary, production repository, real credential, or personal data is required"
		);
		expect(text).toContain(
			"AI may explain diagnostics or suggest test cases only after the learner states the ownership"
		);
		expect(text).toContain(
			"it cannot invent a safety contract, approve an unsafe block"
		);
		expect(text).toContain(
			"none proves complete security or permits widening the project scope"
		);
	});

	it("retains original explanations and distinct opening activity labels", async () => {
		const text = JSON.stringify(await requireRustSystemsCourse());

		expect(text).toContain(
			"Ownership means one clear owner for a resource at a time"
		);
		expect(text).toContain(
			"The key question is which guarantees the compiler stops checking"
		);
		expect(text).toContain("Label Input Boundary Cases");
		expect(text).toContain("A Bounded Mutation and Claim Review");
	});

	it("publishes a complete metadata, safety, and capstone contract", async () => {
		const metadata = (await requireRustSystemsCourse()).developmentMetadata;

		expect(metadata).toBeDefined();
		expect(metadata?.standards.length).toBeGreaterThanOrEqual(5);
		expect(metadata?.toolchain).toHaveLength(5);
		expect(metadata?.safetyPolicy).toHaveLength(6);
		expect(metadata?.courseBoundaries).toHaveLength(4);
		expect(metadata?.capstoneExpectations).toHaveLength(6);
		expect(metadata?.sourcePolicy).toContain("Canonical source repository");
	});
});
