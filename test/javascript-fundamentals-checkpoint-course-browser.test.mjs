import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
// eslint-disable-next-line test/no-import-node-test -- Actual assigned course-source workflows.
import { test } from "node:test";
import { runAssemblyCoreCourseWorkflow } from "./assembly-core-course-browser.mjs";
import { editedFundamentalsCheckpointSource } from "./javascript-fundamentals-checkpoint-browser-cases.mjs";

const fixture = JSON.parse(
	readFileSync(
		new URL(
			"./fixtures/javascript-fundamentals-checkpoint-sources.json",
			import.meta.url
		),
		"utf8"
	)
);
const resources = fixture.resources;
const projects = [...new Set(resources.map(row => row.project))];
assert.equal(resources.length, 2);
assert.equal(projects.length, 1);
for (const resource of resources) {
	for (const file of resource.files) {
		const bytes = readFileSync(
			new URL(
				`../front-end/public/course-assets/javascript-level-1/${file.path}`,
				import.meta.url
			)
		);
		assert.equal(bytes.length, file.byteLength);
		assert.equal(
			createHash("sha256").update(bytes).digest("hex"),
			file.sha256
		);
	}
}

for (const project of projects) {
	const selected = resources.filter(row => row.project === project);
	const roles = selected.some(row => row.role === "reference")
		? ["starter", "solution"]
		: ["starter"];
	const select = role => {
		const selectedRole = role === "starter" ? "starter" : "reference";
		const found = selected.filter(row => row.role === selectedRole);
		assert.equal(found.length, 1);
		return found[0];
	};
	test(
		`JavaScript ${project}: authored assignment consent, saved source and complete ZIPs`,
		{ timeout: 180000 },
		async t => {
			await runAssemblyCoreCourseWorkflow(t, {
				kind: `${project}`,
				courseID: fixture.courseId,
				moduleID: fixture.moduleId,
				coreID: fixture.coreID,
				roles,
				mode: "web",
				fixturePath:
					"./fixtures/javascript-fundamentals-checkpoint-sources.json",
				sourceUrl: role => select(role).urls[0],
				localSource: {
					prefix: "/course-assets/javascript-level-1/",
					files: role => select(role).files
				},
				expectedFile: (role, name) =>
					select(role).files.find(file => file.name === name),
				flatFiles: true,
				fileCount: role => select(role).files.length,
				initialFile: "index.html",
				primaryFile: "index.html",
				editFiles: ["index.html", "script.js", "README.md"],
				editContent: ({ role, filename, original }) =>
					["index.html", "script.js"].includes(filename)
						? editedFundamentalsCheckpointSource(
								select(role),
								filename,
								original
							)
						: undefined,
				taskFile: "README.md",
				continuationIDs: fixture.itemIds,
				projectKey: role =>
					`${fixture.courseId}:${fixture.coreID}:${select(role).role}:${project}:v${select(role).version}`,
				previousProject: () => ({
					_id: `earlier-${project}-attempt`,
					title: "Earlier work",
					mode: "web",
					files: [
						{
							name: "index.html",
							content: "// Earlier nested-loop work\n",
							encoding: "text"
						}
					],
					activeFileName: "index.html",
					courseID: fixture.courseId,
					courseProjectKey: `${fixture.courseId}:earlier:${project}`,
					createdAt: "2026-10-01T12:00:00.000Z",
					updatedAt: "2026-10-01T12:00:00.000Z"
				}),
				instructionTokens: [
					"index.html",
					"README.md",
					"without a server"
				],
				starterToken: "index.html",
				referenceToken: "index.html",
				readyToken: "Open index.html",
				outputEnv: "JAVASCRIPT_FUNDAMENTALS_CHECKPOINT_BROWSER_DIR",
				outputSubdirectory: project,
				defaultOutput:
					"output/javascript-fundamentals-checkpoint-browser"
			});
		}
	);
}
