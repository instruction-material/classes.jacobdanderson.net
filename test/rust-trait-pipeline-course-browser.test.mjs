// eslint-disable-next-line test/no-import-node-test -- Native browser CI entrypoint.
import { test } from "node:test";
import { runAssemblyCoreCourseWorkflow } from "./assembly-core-course-browser.mjs";

const moduleID
	= "rust-systems-security-rss6-traits-iterators-and-api-contracts";
test(
	"Rust trait-pipeline consent, exact roles and three saved continuations",
	{ timeout: 180000 },
	async (t) => {
		await runAssemblyCoreCourseWorkflow(t, {
			fixturePath: "./fixtures/rust-trait-pipeline-contracts.json",
			courseID: "rust-systems-security",
			mode: "rust",
			sourceRepository: "Low-Level-Security",
			moduleID,
			coreID: `${moduleID}-curriculum-core-project-traits-iterators-and-api-contracts`,
			continuationIDs: [
				`${moduleID}-supplemental-project-trait-based-validation-pipeline`,
				`${moduleID}-supplemental-traits-iterators-and-api-contracts-transfer-practice`,
				`${moduleID}-supplemental-traits-iterators-and-api-contracts-extension-practice`
			],
			primaryFile: "src/lib.rs",
			taskFile: "observations.md",
			initialFile: "observations.md",
			fileCount: 11,
			readyToken: "cargo test --locked --offline",
			starterToken: "cd starter",
			referenceToken: "cd solution",
			instructionTokens: [
				"1.97.1",
				"edition 2024",
				"RowSource",
				"E0046",
				"E0505"
			],
			outputEnv: "RUST_TRAIT_PIPELINE_BROWSER_PROOF_DIR",
			defaultOutput: "output/rust-trait-pipeline-browser",
			kind: "trait-pipeline"
		});
	}
);
