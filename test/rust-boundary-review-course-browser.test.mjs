// eslint-disable-next-line test/no-import-node-test -- Native browser CI entrypoint.
import { test } from "node:test";
import { runAssemblyCoreCourseWorkflow } from "./assembly-core-course-browser.mjs";

test(
	"Rust boundary-review consent, exact roles and three saved continuations",
	{ timeout: 180000 },
	async (t) => {
		await runAssemblyCoreCourseWorkflow(t, {
			fixturePath: "./fixtures/rust-boundary-review-contracts.json",
			courseID: "rust-systems-security",
			mode: "rust",
			sourceRepository: "Low-Level-Security",
			moduleID:
				"rust-systems-security-rss9-unsafe-ffi-and-trusted-boundaries",
			coreID: "rust-systems-security-rss9-unsafe-ffi-and-trusted-boundaries-curriculum-core-project-unsafe-ffi-and-trusted-boundaries",
			continuationIDs: [
				"rust-systems-security-rss9-unsafe-ffi-and-trusted-boundaries-supplemental-project-unsafe-and-ffi-boundary-review",
				"rust-systems-security-rss9-unsafe-ffi-and-trusted-boundaries-supplemental-unsafe-ffi-and-trusted-boundaries-transfer-practice",
				"rust-systems-security-rss9-unsafe-ffi-and-trusted-boundaries-supplemental-unsafe-ffi-and-trusted-boundaries-extension-practice"
			],
			primaryFile: "src/lib.rs",
			taskFile: "observations.md",
			initialFile: "observations.md",
			fileCount: 12,
			readyToken: "cargo test --locked --offline",
			starterToken: "cd starter",
			referenceToken: "cd solution",
			instructionTokens: [
				"1.97.1",
				"edition 2024",
				"raw_sum",
				"E0133",
				"miri-dangling.rs"
			],
			outputEnv: "RUST_BOUNDARY_REVIEW_BROWSER_PROOF_DIR",
			defaultOutput: "output/rust-boundary-review-browser",
			kind: "boundary-review"
		});
	}
);
