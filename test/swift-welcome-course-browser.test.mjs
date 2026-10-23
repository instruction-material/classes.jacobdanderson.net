// eslint-disable-next-line test/no-import-node-test -- Native browser CI entrypoint.
import { test } from "node:test";
import { runAssemblyCoreCourseWorkflow } from "./assembly-core-course-browser.mjs";

const courseID = "intro-to-swift-app-development";
const moduleID = `${courseID}-sw3-swiftui-views-layout-and-modifiers`;
const coreID = `${moduleID}-curriculum-project-welcome-profile-app`;

test(
	"Swift: consent, selected source, saved roles and complete ZIP exports",
	{ timeout: 180000 },
	async (t) => {
		await runAssemblyCoreCourseWorkflow(t, {
			kind: "swift-welcome",
			courseID,
			moduleID,
			coreID,
			mode: "swift",
			sourceRepository: "Swift",
			fixturePath: "./fixtures/swift-welcome-source.json",
			fileCount: 3,
			initialFile: "ContentView.swift",
			primaryFile: "ContentView.swift",
			taskFile: "README.md",
			starterToken: "ContentView",
			referenceToken: "ContentView",
			projectKey: role =>
				`${courseID}:welcome-profile:${role === "starter" ? "starter" : "reference"}:native-swift-v1`,
			previousProject: role => ({
				_id: "earlier-swift-python-attempt",
				title: "Earlier work",
				mode: "python",
				files: [{ name: "main.py", content: "# earlier work\n" }],
				activeFileName: "main.py",
				courseID,
				courseProjectKey: `${courseID}:${coreID}:${role === "starter" ? "starter" : "reference"}`,
				createdAt: "2026-10-01T12:00:00.000Z",
				updatedAt: "2026-10-01T12:00:00.000Z"
			}),
			continuationIDs: [`${moduleID}-supplemental-readiness-check`],
			instructionTokens: ["Xcode", "iOS simulator", "one @main"],
			readyToken: "Xcode",
			outputEnv: "SWIFT_WELCOME_BROWSER_DIR",
			defaultOutput: "output/swift-welcome-browser"
		});
	}
);
