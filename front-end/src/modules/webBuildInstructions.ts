import {
	webCourseResource,
	webMaintainedSourceRevision,
	webModulePortfolioPack,
	webPortfolioPack
} from "./webProjectResources";

export function webBuildInstructions(starterUrl?: string) {
	const selected = webCourseResource(starterUrl ?? "");
	if (!selected) {
		return [
			"Save and download the web files, then use a local web server to open the extracted index.html.",
			"Use the project's README for its server and build commands. This workspace edits source and does not run Node.js or npm."
		];
	}
	if (selected.definition.workflow === "standalone") {
		return [
			"Save and download the ZIP, then extract it with every imported file.",
			"Use Node.js 24 in the extracted project folder containing index.html and serve.mjs:",
			"node serve.mjs",
			"Open http://127.0.0.1:4174. Stop this exercise's server with Ctrl+C when finished.",
			`For the complete source repository at ${selected.resource.ref}:`,
			`node ${selected.pack}/serve.mjs ${selected.role} 4174`,
			"The included file server runs the source directly. Read README.md for state contracts, fixture cases and completion checks."
		];
	}
	const nativePack =
		selected.definition.version === 1
			? webPortfolioPack
			: webModulePortfolioPack;
	const workspace = `${nativePack}/${selected.role}`;
	return [
		"Save and download the ZIP to preserve edited files.",
		`Use the complete Web-Development-Foundations source repository at ${webMaintainedSourceRevision} with Node.js 24.`,
		`Copy exported HTML, CSS and JavaScript into ${workspace}; retain that checkout's workspace package.json, root package.json and root package-lock.json.`,
		"The role ZIP contains its package.json and source files, but not the monorepo's root lockfile. It is not a standalone npm ci checkout.",
		"From the complete repository root:",
		`npm ci --workspace ${workspace}`,
		`npm run dev --workspace ${workspace} -- --host 127.0.0.1 --port 5173 --strictPort`,
		"Open http://127.0.0.1:5173. Stop this server with Ctrl+C when finished.",
		`npm run build --workspace ${workspace}`,
		`npm run preview --workspace ${workspace} -- --host 127.0.0.1 --port 4173 --strictPort`,
		"Open http://127.0.0.1:4173 to inspect the built output, then stop this preview with Ctrl+C.",
		"A build, local preview and public deployment are separate checks. The course reading supplies the request, debugging and viewport exercises."
	];
}
