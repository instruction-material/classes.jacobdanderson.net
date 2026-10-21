// eslint-disable-next-line test/no-import-node-test -- Native browser CI entrypoint.
import { test } from "node:test";
import { runAssemblyCoreCourseWorkflow } from "./assembly-core-course-browser.mjs";

const moduleID
	= "rust-systems-security-rss7-files-parsers-and-secure-cli-design";
test(
	"Rust bounded-cli consent, exact roles and three saved continuations",
	{ timeout: 180000 },
	async (t) => {
		await runAssemblyCoreCourseWorkflow(t, {
			fixturePath: "./fixtures/rust-bounded-cli-contracts.json",
			courseID: "rust-systems-security",
			mode: "rust",
			sourceRepository: "Low-Level-Security",
			moduleID,
			coreID: `${moduleID}-curriculum-core-project-files-parsers-and-secure-cli-design`,
			continuationIDs: [
				`${moduleID}-supplemental-project-secure-cli-audit-tool`,
				`${moduleID}-supplemental-files-parsers-and-secure-cli-design-transfer-practice`,
				`${moduleID}-supplemental-files-parsers-and-secure-cli-design-extension-practice`
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
				"acquire",
				"--file cap.txt",
				"status 66"
			],
			outputEnv: "RUST_BOUNDED_CLI_BROWSER_PROOF_DIR",
			defaultOutput: "output/rust-bounded-cli-browser",
			kind: "bounded-cli"
		});
	}
);
