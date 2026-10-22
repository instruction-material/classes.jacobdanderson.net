// eslint-disable-next-line test/no-import-node-test -- Native browser CI entrypoint.
import { test } from "node:test";
import { runAssemblyCoreCourseWorkflow } from "./assembly-core-course-browser.mjs";

const courseID = "web-development-foundations";
const moduleID = `${courseID}-wdf6-stage-5-databases-and-data-models`;
const coreID = `${moduleID}-curriculum-core-project-databases-and-data-models`;

test(
	"Web notes: confirmed nested imports, both roles, saved edits and ZIPs",
	{ timeout: 180000 },
	async (t) => {
		await runAssemblyCoreCourseWorkflow(t, {
			kind: "notes-api",
			courseID,
			moduleID,
			coreID,
			mode: "web",
			sourceRepository: "Web-Development-Foundations",
			fixturePath: "./fixtures/web-notes-source.json",
			flatFiles: true,
			sharedFiles: ["README.md"],
			fileCount: 10,
			initialFile: "src/models/note.js",
			primaryFile: "src/models/note.js",
			taskFile: "README.md",
			projectKey: role =>
				`${courseID}:notes-api:${role === "starter" ? "starter" : "reference"}:web-source-v1`,
			previousProject: role => ({
				_id: `earlier-notes-${role}`,
				title: "Earlier notes attempt",
				mode: "web",
				files: [
					{
						name: "src/models/note.js",
						content: "// Earlier notes attempt\n",
						encoding: "text"
					}
				],
				activeFileName: "src/models/note.js",
				courseID,
				courseProjectKey: `${courseID}:${coreID}:${role === "starter" ? "starter" : "reference"}`,
				createdAt: "2026-10-01T12:00:00.000Z",
				updatedAt: "2026-10-01T12:00:00.000Z"
			}),
			continuationIDs: [
				`${moduleID}-supplemental-project-blog-or-notes-app-with-mongodb`,
				`${moduleID}-supplemental-database-models-transfer-practice`,
				`${moduleID}-supplemental-database-models-extension-practice`
			],
			continuationsByRole: { solution: [] },
			instructionTokens: [
				"npm ci",
				"root lockfile",
				"127.0.0.1:3001",
				"501",
				"NOTES_SCENARIO"
			],
			readyToken: "npm run start --workspace",
			starterToken: "WDF2-Notes-App-with-MongoDB/starter",
			referenceToken: "WDF2-Notes-App-with-MongoDB/solution",
			outputEnv: "WEB_NOTES_BROWSER_DIR",
			defaultOutput: "output/web-notes-browser"
		});
	}
);
