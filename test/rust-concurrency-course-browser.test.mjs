// eslint-disable-next-line test/no-import-node-test -- Native browser CI entrypoint.
import { test } from "node:test";
import { runAssemblyCoreCourseWorkflow } from "./assembly-core-course-browser.mjs";

test(
	"Rust concurrency consent, exact roles and three saved continuations",
	{ timeout: 180000 },
	async (t) => {
		await runAssemblyCoreCourseWorkflow(t, {
			fixturePath: "./fixtures/rust-concurrency-contracts.json",
			courseID: "rust-systems-security",
			mode: "rust",
			sourceRepository: "Low-Level-Security",
			moduleID:
				"rust-systems-security-rss8-concurrency-and-race-reduction",
			coreID: "rust-systems-security-rss8-concurrency-and-race-reduction-curriculum-core-project-concurrency-and-race-reduction",
			continuationIDs: [
				"rust-systems-security-rss8-concurrency-and-race-reduction-supplemental-project-threads-and-channels-monitor",
				"rust-systems-security-rss8-concurrency-and-race-reduction-supplemental-concurrency-and-race-reduction-transfer-practice",
				"rust-systems-security-rss8-concurrency-and-race-reduction-supplemental-concurrency-and-race-reduction-extension-practice"
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
				"capacity-two",
				"joined",
				"E0277"
			],
			outputEnv: "RUST_CONCURRENCY_BROWSER_PROOF_DIR",
			defaultOutput: "output/rust-concurrency-browser",
			kind: "concurrency"
		});
	}
);
