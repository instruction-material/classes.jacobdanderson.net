import { readFileSync } from "node:fs";
// eslint-disable-next-line test/no-import-node-test -- Native browser CI entrypoint.
import { test } from "node:test";
import { runAssemblyCoreCourseWorkflow } from "./assembly-core-course-browser.mjs";

const courseID = "web-development-foundations";
const first = `${courseID}-wdf0-setup-and-tooling`;
const modules = `${courseID}-wdf3-stage-2-web-development-foundations`;
const notifications = `${courseID}-wdf4-stage-3-front-end-applications`;
const roleKey = role => (role === "starter" ? "starter" : "reference");
const legacy = JSON.parse(
	readFileSync(
		new URL(
			"./fixtures/web-portfolio-original-source.json",
			import.meta.url
		)
	)
);
function previousPortfolio(role) {
	const files = ["index.html", "main.js", "styles.css", "package.json"].map(
		name => ({
			name,
			content: legacy.files[`${legacy.pack}/${role}/${name}`].content
		})
	);
	files.push({
		name: "README.md",
		content: legacy.files[`${legacy.pack}/README.md`].content
	});
	return {
		_id: `earlier-portfolio-${role}`,
		title: "Earlier portfolio",
		mode: "web",
		files,
		activeFileName: "main.js",
		courseID,
		courseProjectKey: `${courseID}:portfolio:${roleKey(role)}:web-source-v1`,
		starterUrl: `https://github.com/instruction-material/Web-Development-Foundations/tree/${legacy.revision}/${legacy.pack}/${role}`,
		createdAt: "2026-10-01T12:00:00.000Z",
		updatedAt: "2026-10-01T12:00:00.000Z"
	};
}
const definitions = [
	{
		kind: "portfolio-v1",
		fixturePath: "./fixtures/web-portfolio-source.json",
		moduleID: first,
		coreID: `${first}-curriculum-core-project-web-development-foundations`,
		continuationIDs: [
			`${first}-supplemental-workflow-notebook-setup-and-tooling`,
			`${
				first
			}-supplemental-web-development-foundations-setup-transfer-practice`,
			`${
				first
			}-supplemental-web-development-foundations-setup-extension-practice`
		],
		projectKey: role =>
			`${courseID}:portfolio:${roleKey(role)}:web-source-v1`,
		previousProject: role => ({
			...previousPortfolio(role),
			courseProjectKey: `${courseID}:${first}-curriculum-core-project-web-development-foundations:${roleKey(role)}`
		}),
		primaryFile: "main.js",
		fileCount: 5,
		instructionTokens: [
			"npm ci --workspace",
			"root lockfile",
			"127.0.0.1:4173"
		],
		readyToken: "npm ci --workspace"
	},
	{
		kind: "portfolio-v2",
		fixturePath: "./fixtures/web-portfolio-module-source.json",
		moduleID: modules,
		coreID: `${modules}-curriculum-core-project-web-development-foundations`,
		continuationIDs: [
			`${
				modules
			}-supplemental-project-portfolio-site-with-custom-domain-preparation`,
			`${modules}-supplemental-web-foundations-transfer-practice`,
			`${modules}-supplemental-web-foundations-extension-practice`
		],
		projectKey: role =>
			`${courseID}:portfolio:${roleKey(role)}:web-source-v2`,
		primaryFile: "project-idea.js",
		fileCount: 6,
		previousProject: previousPortfolio,
		instructionTokens: [
			"npm ci --workspace",
			"root lockfile",
			"127.0.0.1:4173"
		],
		readyToken: "npm ci --workspace"
	},
	{
		kind: "notifications",
		fixturePath: "./fixtures/web-notification-source.json",
		moduleID: notifications,
		coreID: `${notifications}-curriculum-core-project-front-end-applications`,
		continuationIDs: [
			`${notifications}-supplemental-front-end-apps-transfer-practice`,
			`${notifications}-supplemental-front-end-apps-extension-practice`
		],
		projectKey: role =>
			`${courseID}:notification-state:${roleKey(role)}:web-source-v1`,
		primaryFile: "state.mjs",
		fileCount: 12,
		previousProject: previousPortfolio,
		sharedFiles: ["README.md", "serve.mjs"],
		instructionTokens: ["Node.js 24", "node serve.mjs", "127.0.0.1:4174"],
		readyToken: "node serve.mjs"
	}
];
for (const definition of definitions) {
	test(
		`Web ${definition.kind}: course consent, both roles, saved edits and ZIPs at two widths`,
		{ timeout: 180000 },
		async t => {
			await runAssemblyCoreCourseWorkflow(t, {
				...definition,
				courseID,
				mode: "web",
				sourceRepository: "Web-Development-Foundations",
				flatFiles: true,
				initialFile: "index.html",
				taskFile: "README.md",
				continuationsByRole: { solution: [] },
				starterToken:
					definition.kind === "notifications"
						? "local-client/serve.mjs starter"
						: definition.kind === "portfolio-v1"
							? "Domain/basics/starter"
							: "Domain/starter",
				referenceToken:
					definition.kind === "notifications"
						? "local-client/serve.mjs solution"
						: definition.kind === "portfolio-v1"
							? "Domain/basics/solution"
							: "Domain/solution",
				outputEnv: `WEB_${definition.kind.toUpperCase().replaceAll("-", "_")}_BROWSER_DIR`,
				defaultOutput: `output/web-source-browser/${definition.kind}`
			});
		}
	);
}
