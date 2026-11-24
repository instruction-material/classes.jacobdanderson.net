import { readFileSync } from "node:fs";
// eslint-disable-next-line test/no-import-node-test -- Native browser CI entrypoint.
import { it } from "node:test";
import { runAssemblyCoreCourseWorkflow } from "./assembly-core-course-browser.mjs";

const courseID = "intro-to-swift-app-development";
const welcome = JSON.parse(
	readFileSync(
		new URL("./fixtures/swift-welcome-source.json", import.meta.url),
		"utf8"
	)
);
const anatomyModule = `${courseID}-sw2-xcode-project-anatomy`;
const anatomyTasks = [
	`${anatomyModule}-curriculum-core-project-xcode-project-anatomy`,
	`${anatomyModule}-supplemental-sw2-xcode-project-anatomy-readiness-check`
];
const shapesModule = `${courseID}-swx-shapes-and-legacy-reference-boundaries`;
const projects = [
	{
		name: "shapes-studio",
		module: "swx-shapes-and-legacy-reference-boundaries",
		coreSuffix: "curriculum-core-project-enrichment-and-reference-boundaries",
		key: "shapes-studio",
		linkedTasks: [`${shapesModule}-supplemental-extension-swiftui-shapes-studio`]
	},
	{
		name: "accessible-tasks",
		module: "sw14-app-design-and-accessibility",
		coreSuffix: "curriculum-core-project-app-design-and-accessibility",
		key: "accessible-tasks",
		readiness: true,
		fileCount: 6,
		instructionTokens: ["TaskReview.xcodeproj", "Product > Test", "README.md"]
	},
	{
		name: "favorite-editor",
		module: "sw7-state-and-data-flow",
		coreSuffix: "curriculum-core-project-state-and-data-flow",
		key: "favorite-editor",
		readiness: true,
		fileCount: 7,
		instructionTokens: ["FavoriteNote.xcodeproj", "Product > Test", "README.md"]
	},
	{
		name: "hobby-structure",
		module: "sw6-app-structure-and-lifecycle",
		coreSuffix: "curriculum-core-project-what-an-app-is-structurally",
		key: "hobby-structure",
		readiness: true,
		fileCount: 9,
		instructionTokens: ["HobbyMap.xcodeproj", "Product > Test", "README.md"]
	},
	{
		name: "first-launch",
		module: "sw1-mac-setup-and-first-launch",
		coreSuffix: "curriculum-core-project-mac-setup-and-project-tooling",
		key: "first-launch",
		readiness: true,
		fileCount: 9,
		linkedTasks: anatomyTasks,
		itemModules: Object.fromEntries(anatomyTasks.map(id => [id, anatomyModule])),
		instructionTokens: ["FirstLaunch.xcodeproj", "Product > Test", "README.md"]
	},
	{
		name: "tracker-debugging",
		instructionTokens: ["Tests/TrackerTests.swift", "run swift test", "one @main"],
		module: "sw13-debugging-and-swift-testing",
		coreSuffix: "curriculum-core-project-debugging-and-testing",
		key: "tracker-debugging",
		readiness: true,
		sharedFiles: ["README.md", "Package.swift"],
		fileCount: 6
	},
	{
		name: "simulator-validation",
		sourceFixture: "map",
		module: "sw15-simulator-and-device-validation",
		coreSuffix: "curriculum-core-project-running-on-simulator-and-device",
		key: "map-places",
		readiness: true
	},
	{
		name: "lesson-cards",
		module: "sw5-functions-structs-and-enums",
		coreSuffix: "curriculum-core-project-functions-structs-and-enums",
		key: "lesson-cards",
		readiness: true,
		fileCount: 4
	},
	{
		name: "profile-interests",
		module: "sw4-swift-basics-in-app-context",
		coreSuffix: "curriculum-core-project-swift-basics-in-app-context",
		key: "profile-interests",
		readiness: true,
		fileCount: 4
	},
	{
		name: "gallery",
		module: "sw8-media-maps-and-permission-aware-features",
		title: "media-gallery-app",
		key: "media-gallery",
		readiness: true
	},
	{
		name: "hobby",
		module: "sw9-navigation-and-multi-screen-apps",
		title: "multi-tab-hobby-app",
		key: "multi-tab-hobby",
		readiness: true
	},
	{
		name: "map",
		module: "sw8-media-maps-and-permission-aware-features",
		title: "map-places-app",
		key: "map-places",
		readiness: false
	},
	{
		name: "capstone",
		module: "sw19-capstone-build-and-user-testing",
		title: "publish-ready-capstone-app",
		key: "publish-ready-capstone",
		readiness: true
	}
];

for (const project of projects) {
	const moduleID = `${courseID}-${project.module}`;
	const coreID = `${moduleID}-${project.coreSuffix ?? `curriculum-project-${project.title}`}`;
	it(
		`Swift ${
			project.name
		}: consent, real source, saved roles and complete exports`,
		{ timeout: 180000 },
		async (t) => {
			await runAssemblyCoreCourseWorkflow(t, {
				kind: `swift-${project.name}`,
				courseID,
				moduleID,
				coreID,
				mode: "swift",
				sourceRepository: "Swift",
				fixturePath: `./fixtures/swift-${project.sourceFixture ?? project.name}-source.json`,
				fileCount: project.fileCount ?? 3,
				sharedFiles: project.sharedFiles,
				initialFile: "ContentView.swift",
				primaryFile: "ContentView.swift",
				taskFile: "README.md",
				starterToken: "ContentView",
				referenceToken: "ContentView",
				projectKey: role =>
					`${courseID}:${project.key}:${
						role === "starter" ? "starter" : "reference"
					}:native-swift-v1`,
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
						content:
							welcome.files[`${welcome.pack}/${name}`].content
					})),
					activeFileName: `${role}/ContentView.swift`,
					courseID,
					courseProjectKey: `${courseID}:welcome-profile:${
						role === "starter" ? "starter" : "reference"
					}:native-swift-v1`,
					createdAt: "2026-10-01T12:00:00.000Z",
					updatedAt: "2026-10-01T12:00:00.000Z"
				}),
				itemModules: project.itemModules,
				continuationIDs: [
					coreID,
					...(project.linkedTasks ?? []),
					...(project.readiness
						? [
								`${moduleID}-supplemental-${
									project.name === "gallery" ? "" : `${project.module}-`
								}readiness-check`
							]
						: [])
				],
				instructionTokens: project.instructionTokens ?? ["one @main", "iOS simulator", "README.md"],
				readyToken: "Xcode",
				outputEnv: `SWIFT_${project.name.toUpperCase().replaceAll("-", "_")}_BROWSER_DIR`,
				defaultOutput: `output/swift-${project.name}-browser`
			});
		}
	);
}
