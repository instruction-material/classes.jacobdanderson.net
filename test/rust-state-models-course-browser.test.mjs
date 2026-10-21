// eslint-disable-next-line test/no-import-node-test -- Native browser CI entrypoint.
import { test } from "node:test";
import { runAssemblyCoreCourseWorkflow } from "./assembly-core-course-browser.mjs";

const moduleID
	= "rust-systems-security-rss5-structs-enums-and-safer-state-models";
test(
	"Rust state-models consent, exact roles and three saved continuations",
	{ timeout: 180000 },
	async (t) => {
		await runAssemblyCoreCourseWorkflow(t, {
			fixturePath: "./fixtures/rust-state-models-contracts.json",
			courseID: "rust-systems-security",
			mode: "rust",
			sourceRepository: "Low-Level-Security",
			moduleID,
			coreID: `${moduleID}-curriculum-core-project-structs-enums-and-safer-state-models`,
			continuationIDs: [
				`${moduleID}-supplemental-project-state-machine-refactor`,
				`${moduleID}-supplemental-structs-enums-and-safer-state-models-transfer-practice`,
				`${moduleID}-supplemental-structs-enums-and-safer-state-models-extension-practice`
			],
			primaryFile: "src/lib.rs",
			taskFile: "observations.md",
			initialFile: "observations.md",
			fileCount: 9,
			readyToken: "cargo test --locked --offline",
			starterToken: "cd starter",
			referenceToken: "cd solution",
			instructionTokens: [
				"1.97.1",
				"edition 2024",
				"State enum",
				"E0004",
				"E0560"
			],
			outputEnv: "RUST_STATE_MODELS_BROWSER_PROOF_DIR",
			defaultOutput: "output/rust-state-models-browser",
			kind: "state-models"
		});
	}
);
