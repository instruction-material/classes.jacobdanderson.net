// eslint-disable-next-line test/no-import-node-test -- Native browser CI entrypoint.
import { test } from "node:test";
import { runAssemblyCoreCourseWorkflow } from "./assembly-core-course-browser.mjs";

const courseID = "web-development-foundations";
const moduleID = `${courseID}-wdf4-stage-3-front-end-applications`;
const coreID = `${moduleID}-supplemental-project-real-time-chat-or-notification-app`;

test(
	"Live chat: confirmed nested source imports, saved roles and exact ZIPs",
	{ timeout: 180000 },
	async (t) => {
		await runAssemblyCoreCourseWorkflow(t, {
			kind: "live-chat",
			courseID,
			moduleID,
			coreID,
			mode: "web",
			sourceRepository: "Web-Development-Foundations",
			fixturePath: "./fixtures/web-live-chat-source.json",
			flatFiles: true,
			sharedFiles: ["README.md"],
			fileCount: role => (role === "starter" ? 5 : 6),
			initialFile: "src/server.js",
			primaryFile: "public/chat.js",
			taskFile: "README.md",
			projectKey: role =>
				`${courseID}:live-chat:${role === "starter" ? "starter" : "reference"}:web-source-v1`,
			previousProject: role => ({
				_id: `earlier-notification-${role}`,
				title: "Earlier notification investigation",
				mode: "web",
				files: [
					{
						name: "state.mjs",
						content: "// Retained fixture investigation\n",
						encoding: "text"
					}
				],
				activeFileName: "state.mjs",
				courseID,
				courseProjectKey: `${courseID}:notification-state:${role === "starter" ? "starter" : "reference"}:web-source-v1`,
				createdAt: "2026-10-01T12:00:00.000Z",
				updatedAt: "2026-10-01T12:00:00.000Z"
			}),
			continuationIDs: [],
			instructionTokens: [
				"npm ci",
				"root dependency lockfile",
				"127.0.0.1:3003",
				"two browser windows",
				"Socket.IO"
			],
			readyToken: "npm run start --workspace",
			starterToken: "WDF4-Realtime-Chat-App/starter",
			referenceToken: "WDF4-Realtime-Chat-App/solution",
			outputEnv: "WEB_CHAT_BROWSER_DIR",
			defaultOutput: "output/web-live-chat-browser"
		});
	}
);
