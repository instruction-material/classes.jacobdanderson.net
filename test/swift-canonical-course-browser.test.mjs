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
const projects = [
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
	const coreID = `${moduleID}-curriculum-project-${project.title}`;
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
				fixturePath: `./fixtures/swift-${project.name}-source.json`,
				fileCount: 3,
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
				continuationIDs: [
					coreID,
					...(project.readiness
						? [
								`${moduleID}-supplemental-${
									project.name === "gallery" ? "" : `${project.module}-`
								}readiness-check`
							]
						: [])
				],
				instructionTokens: ["one @main", "iOS simulator", "README.md"],
				readyToken: "Xcode",
				outputEnv: `SWIFT_${project.name.toUpperCase()}_BROWSER_DIR`,
				defaultOutput: `output/swift-${project.name}-browser`
			});
		}
	);
}
