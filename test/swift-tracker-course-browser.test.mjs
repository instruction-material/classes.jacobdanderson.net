import { readFileSync } from "node:fs";
// eslint-disable-next-line test/no-import-node-test -- Native browser CI entrypoint.
import { it } from "node:test";
import { runAssemblyCoreCourseWorkflow } from "./assembly-core-course-browser.mjs";

const courseID = "intro-to-swift-app-development";
for (const definition of [
	{
		kind: "tracker",
		module: "sw10-lists-forms-and-crud",
		title: "project-simple-tracker-app",
		projectKey: "simple-tracker",
		count: 7,
		shared: [
			"README.md",
			"verify-tracker.py",
			"tests/TrackerContracts.swift"
		]
	},
	{
		kind: "swiftdata",
		module: "sw11-persistence-with-swiftdata",
		title: "project-pass-persist-the-simple-tracker-app",
		projectKey: "swiftdata-tracker",
		count: 9,
		shared: [
			"README.md",
			"verify-persistence.py",
			"tests/PersistenceContracts.swift",
			"Package.swift",
			"tests/PersistenceTests.swift"
		]
	}
]) {
	const moduleID = `${courseID}-${definition.module}`;
	const previousFixture = JSON.parse(
		readFileSync(
			new URL(
				`./fixtures/swift-${definition.kind === "tracker" ? "swiftdata" : "tracker"}-source.json`,
				import.meta.url
			),
			"utf8"
		)
	);

	it(
		`swift ${definition.kind}: consent, complete roles, saved work and exact exports`,
		{ timeout: 180000 },
		async t => {
			await runAssemblyCoreCourseWorkflow(t, {
				kind: `swift-${definition.kind}`,
				courseID,
				moduleID,
				coreID: `${moduleID}-curriculum-${definition.title}`,
				mode: "swift",
				sourceRepository: "Swift",
				fixturePath: `./fixtures/swift-${definition.kind}-source.json`,
				fileCount: definition.count,
				sharedFiles: definition.shared,
				initialFile: "ContentView.swift",
				primaryFile: "ContentView.swift",
				taskFile: "README.md",
				starterToken: "ContentView",
				referenceToken: "ContentView",
				projectKey: role =>
					`${courseID}:${definition.projectKey}:${role === "starter" ? "starter" : "reference"}:native-swift-v1`,
				previousProject: role => ({
					_id: "earlier-other-tracker-attempt",
					title: "Earlier tracker work",
					mode: "swift",
					files: Object.entries(previousFixture.files)
						.filter(
							([path]) =>
								!path.startsWith(
									`${previousFixture.pack}/${role === "starter" ? "solution" : "starter"}/`
								)
						)
						.map(([path, file]) => ({
							name: path.slice(previousFixture.pack.length + 1),
							content: file.content
						})),
					activeFileName: `${role}/ContentView.swift`,
					courseID,
					courseProjectKey: `${courseID}:${definition.kind === "tracker" ? "swiftdata-tracker" : "simple-tracker"}:${role === "starter" ? "starter" : "reference"}:native-swift-v1`,
					createdAt: "2026-10-01T12:00:00.000Z",
					updatedAt: "2026-10-01T12:00:00.000Z"
				}),
				continuationIDs: [
					`${moduleID}-supplemental-${definition.module}-readiness-check`
				],
				instructionTokens: [
					"four Swift files",
					"one @main",
					`python3 ${definition.shared[1]}`
				],
				readyToken: "Xcode",
				outputEnv:
					definition.kind === "tracker"
						? "SWIFT_TRACKER_BROWSER_DIR"
						: "SWIFT_DATA_BROWSER_DIR",
				defaultOutput: `output/swift-${definition.kind}-browser`
			});
		}
	);
}
