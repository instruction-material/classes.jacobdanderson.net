// eslint-disable-next-line test/no-import-node-test -- Native browser CI entrypoint.
import { test } from "node:test";
import { runAssemblyCoreCourseWorkflow } from "./assembly-core-course-browser.mjs";
const moduleID =
	"rust-systems-security-rss4-strings-slices-collections-and-bounds-safety";
test(
	"Rust label-slices consent, exact roles and three saved continuations",
	{ timeout: 180000 },
	async t => {
		await runAssemblyCoreCourseWorkflow(t, {
			fixturePath: "./fixtures/rust-label-slices-contracts.json",
			courseID: "rust-systems-security",
			mode: "rust",
			sourceRepository: "Low-Level-Security",
			moduleID,
			coreID: `${moduleID}-curriculum-core-project-strings-slices-collections-and-bounds-safety`,
			continuationIDs: [
				`${moduleID}-supplemental-project-slice-and-bounds-workbench`,
				`${moduleID}-supplemental-strings-slices-collections-and-bounds-safety-transfer-practice`,
				`${moduleID}-supplemental-strings-slices-collections-and-bounds-safety-extension-practice`
			],
			primaryFile: "src/lib.rs",
			taskFile: "observations.md",
			initialFile: "observations.md",
			fileCount: 14,
			readyToken: "cargo test --locked --offline",
			starterToken: "cd starter",
			referenceToken: "cd solution",
			instructionTokens: [
				"1.97.1",
				"edition 2024",
				"str_window",
				"E0277",
				"status 101"
			],
			outputEnv: "RUST_LABEL_SLICES_BROWSER_PROOF_DIR",
			defaultOutput: "output/rust-label-slices-browser",
			kind: "label-slices"
		});
	}
);
