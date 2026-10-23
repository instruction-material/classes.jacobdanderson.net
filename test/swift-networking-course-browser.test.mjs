import { readFileSync } from "node:fs";
// eslint-disable-next-line test/no-import-node-test -- Native browser CI entrypoint.
import { it } from "node:test";
import { runAssemblyCoreCourseWorkflow } from "./assembly-core-course-browser.mjs";

const courseID = "intro-to-swift-app-development";
const moduleID = `${courseID}-sw12-networking-and-data-loading`;
const coreID = `${moduleID}-curriculum-project-api-powered-reference-app`;
const welcome = JSON.parse(
	readFileSync(
		new URL("./fixtures/swift-welcome-source.json", import.meta.url),
		"utf8"
	)
);

it(
	"swift networking: consent, seven source files, saved roles and complete exports",
	{ timeout: 180000 },
	async (t) => {
		await runAssemblyCoreCourseWorkflow(t, {
			kind: "swift-networking",
			courseID,
			moduleID,
			coreID,
			mode: "swift",
			sourceRepository: "Swift",
			fixturePath: "./fixtures/swift-networking-source.json",
			fileCount: 7,
			sharedFiles: [
				"README.md",
				"verify-networking.py",
				"tests/ReferenceContracts.swift"
			],
			initialFile: "ContentView.swift",
			primaryFile: "ContentView.swift",
			taskFile: "README.md",
			starterToken: "ContentView",
			referenceToken: "ContentView",
			projectKey: role =>
				`${courseID}:api-reference:${role === "starter" ? "starter" : "reference"}:native-swift-v1`,
			previousProject: role => ({
				_id: "earlier-swift-welcome-attempt",
				title: "Earlier Welcome Profile work",
				mode: "swift",
				files: [
					`${role}/ContentView.swift`,
					`${role}/WelcomeProfileApp.swift`,
					"README.md"
				].map(name => ({
					name,
					content: welcome.files[`${welcome.pack}/${name}`].content
				})),
				activeFileName: `${role}/ContentView.swift`,
				courseID,
				courseProjectKey: `${courseID}:welcome-profile:${role === "starter" ? "starter" : "reference"}:native-swift-v1`,
				createdAt: "2026-10-01T12:00:00.000Z",
				updatedAt: "2026-10-01T12:00:00.000Z"
			}),
			continuationIDs: [
				`${moduleID}-supplemental-sw12-networking-and-data-loading-readiness-check`
			],
			instructionTokens: [
				"four Swift files",
				"one @main",
				"python3 verify-networking.py"
			],
			readyToken: "Xcode",
			outputEnv: "SWIFT_NETWORKING_BROWSER_DIR",
			defaultOutput: "output/swift-networking-browser"
		});
	}
);
