// eslint-disable-next-line test/no-import-node-test -- Native browser CI entrypoint.
import { test } from "node:test";
import { runAssemblyCoreCourseWorkflow } from "./assembly-core-course-browser.mjs";

const courseID = "web-development-foundations";
const moduleID = `${courseID}-wdf7-stage-6-hosting-and-deployment`;
const coreID = `${moduleID}-curriculum-core-project-hosting-and-deployment`;

test(
	"Web deployment: confirmed nested imports, both roles, saved edits and ZIPs",
	{ timeout: 180000 },
	async (t) => {
		await runAssemblyCoreCourseWorkflow(t, {
			kind: "deployment",
			courseID,
			moduleID,
			coreID,
			mode: "web",
			sourceRepository: "Web-Development-Foundations",
			fixturePath: "./fixtures/web-deployment-source.json",
			flatFiles: true,
			sharedFiles: ["README.md"],
			fileCount: role => role === "starter" ? 9 : 10,
			initialFile: "backend/package.json",
			primaryFile: "release-model.mjs",
			taskFile: "README.md",
			projectKey: role =>
				`${courseID}:deployment:${role === "starter" ? "starter" : "reference"}:web-source-v1`,
			previousProject: role => ({
				_id: `earlier-deployment-${role}`,
				title: "Earlier deployment attempt",
				mode: "web",
				files: [
					{
						name: "release-model.mjs",
						content: "// Earlier deployment attempt\n",
						encoding: "text"
					}
				],
				activeFileName: "release-model.mjs",
				courseID,
				courseProjectKey: `${courseID}:${coreID}:${role === "starter" ? "starter" : "reference"}`,
				createdAt: "2026-10-01T12:00:00.000Z",
				updatedAt: "2026-10-01T12:00:00.000Z"
			}),
			continuationIDs: [
				`${moduleID}-supplemental-project-ship-a-front-end-and-back-end-separately`,
				`${moduleID}-supplemental-hosting-deployment-transfer-practice`,
				`${moduleID}-supplemental-hosting-deployment-extension-practice`
			],
			continuationsByRole: { solution: [] },
			instructionTokens: [
				"npm ci",
				"root dependency lockfile",
				"127.0.0.1:4173",
				"127.0.0.1:4001",
				"restore"
			],
			readyToken: "npm run start --workspace",
			starterToken: "WDF5-Separate-Deployment-Lab/starter",
			referenceToken: "WDF5-Separate-Deployment-Lab/solution",
			outputEnv: "WEB_DEPLOYMENT_BROWSER_DIR",
			defaultOutput: "output/web-deployment-browser"
		});
	}
);
