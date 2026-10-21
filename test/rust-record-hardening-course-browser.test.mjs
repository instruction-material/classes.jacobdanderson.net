// eslint-disable-next-line test/no-import-node-test -- Native browser CI entrypoint.
import { test } from "node:test";
import { runAssemblyCoreCourseWorkflow } from "./assembly-core-course-browser.mjs";

test(
	"Rust record-hardening consent, exact roles and three saved continuations",
	{ timeout: 180000 },
	async (t) => {
		await runAssemblyCoreCourseWorkflow(t, {
			fixturePath: "./fixtures/rust-record-hardening-contracts.json",
			courseID: "rust-systems-security",
			mode: "rust",
			sourceRepository: "Low-Level-Security",
			moduleID:
				"rust-systems-security-rss10-capstone-harden-a-legacy-tool",
			coreID: "rust-systems-security-rss10-capstone-harden-a-legacy-tool-curriculum-core-project-harden-a-legacy-tool",
			continuationIDs: [
				"rust-systems-security-rss10-capstone-harden-a-legacy-tool-supplemental-project-harden-a-legacy-tool",
				"rust-systems-security-rss10-capstone-harden-a-legacy-tool-supplemental-capstone-harden-a-legacy-tool-transfer-practice",
				"rust-systems-security-rss10-capstone-harden-a-legacy-tool-supplemental-capstone-harden-a-legacy-tool-extension-practice"
			],
			primaryFile: "src/lib.rs",
			taskFile: "observations.md",
			initialFile: "observations.md",
			fileCount: 7,
			readyToken: "cargo test --locked --offline",
			starterToken: "cd starter",
			referenceToken: "cd solution",
			instructionTokens: [
				"1.97.1",
				"edition 2024",
				"parse_record",
				"--case combined",
				"owned"
			],
			outputEnv: "RUST_RECORD_HARDENING_BROWSER_PROOF_DIR",
			defaultOutput: "output/rust-record-hardening-browser",
			kind: "record-hardening"
		});
	}
);
