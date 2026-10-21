// eslint-disable-next-line test/no-import-node-test -- Native browser CI entrypoint.
import { test } from "node:test";
import { runAssemblyCoreCourseWorkflow } from "./assembly-core-course-browser.mjs";

const courseID = "web-development-foundations";
const moduleID = `${courseID}-wdf5-stage-4-back-end-basics`;
const coreID = `${moduleID}-curriculum-core-project-back-end-basics`;

test(
	"Web contact: confirmed nested imports, both roles, saved edits and ZIPs",
	{ timeout: 180000 },
	async (t) => {
		await runAssemblyCoreCourseWorkflow(t, {
			kind: "contact-api",
			courseID,
			moduleID,
			coreID,
			mode: "web",
			sourceRepository: "Web-Development-Foundations",
			fixturePath: "./fixtures/web-contact-source.json",
			flatFiles: true,
			sharedFiles: ["README.md"],
			fileCount: 9,
			initialFile: "src/validation.js",
			primaryFile: "src/validation.js",
			taskFile: "README.md",
			projectKey: role =>
				`${courseID}:contact-api:${role === "starter" ? "starter" : "reference"}:web-source-v1`,
			previousProject: role => ({
				_id: `earlier-contact-${role}`,
				title: "Earlier contact attempt",
				mode: "web",
				files: [
					{
						name: "src/validation.js",
						content: "// Earlier contact attempt\n",
						encoding: "text"
					}
				],
				activeFileName: "src/validation.js",
				courseID,
				courseProjectKey: `${courseID}:${coreID}:${role === "starter" ? "starter" : "reference"}`,
				createdAt: "2026-10-01T12:00:00.000Z",
				updatedAt: "2026-10-01T12:00:00.000Z"
			}),
			continuationIDs: [
				`${moduleID}-supplemental-project-booking-or-contact-app-with-email-integration`,
				`${moduleID}-supplemental-back-end-basics-transfer-practice`,
				`${moduleID}-supplemental-back-end-basics-extension-practice`
			],
			continuationsByRole: { solution: [] },
			instructionTokens: [
				"npm ci",
				"root lockfile",
				"127.0.0.1:3002",
				"501",
				"CONTACT_SCENARIO"
			],
			readyToken: "npm run start --workspace",
			starterToken: "WDF3-Booking-Contact-App/starter",
			referenceToken: "WDF3-Booking-Contact-App/solution",
			outputEnv: "WEB_CONTACT_BROWSER_DIR",
			defaultOutput: "output/web-contact-browser"
		});
	}
);
