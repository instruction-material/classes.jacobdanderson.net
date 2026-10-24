import { javascriptCourseResource } from "./javascriptCourseResources";
import {
	webCourseResource,
	webMaintainedSourceRevision,
	webModulePortfolioPack,
	webPortfolioPack
} from "./webProjectResources";

export function webBuildInstructions(starterUrl?: string) {
	const javascript = javascriptCourseResource(starterUrl ?? "");
	if (javascript) {
		return [
			javascript.files.some(file => file.name === "vendor/d3.min.js")
				? "Save and download the ZIP, then extract every file, including vendor/d3.min.js and LICENSE-d3.txt."
				: "Save and download the ZIP, then extract every file.",
			"Open index.html in a browser. The project runs locally without a server, package installation or network connection.",
			"README.md contains the script.js tasks and expected output."
		];
	}
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
	if (selected.definition.workflow === "separate-services") {
		const workspace = `${selected.pack}/${selected.role}`;
		return [
			"Save and download the ZIP with every nested file and any added exercise programs.",
			`Use the complete Web-Development-Foundations checkout at ${selected.resource.ref} with Node.js 24. Copy the exported files into ${workspace}; retain the complete checkout's root manifest and lockfile.`,
			"A selected-role ZIP alone lacks the root dependency lockfile. From the complete repository root, install existing dependencies with npm ci if they are missing.",
			...(selected.role === "starter"
				? [
						`Copy ${workspace}/frontend/env.template.js to ${workspace}/frontend/env.js before startup. Complete digestBytes and assertInventory in release-model.mjs before artifact commands.`
					]
				: []),
			"Run the API and front end in two separate terminals, both initially at the repository root:",
			`npm run start --workspace ${workspace}/backend`,
			`node ${workspace}/frontend/serve.mjs`,
			"Open http://127.0.0.1:4173. The default API is http://127.0.0.1:4001; the ready records show actual loopback ports. This workspace edits source and does not run either native service.",
			"README.md supplies matching shell-specific configuration commands, wrong-origin and unavailable-API cases, build/verify/restore commands and the retained-release rollback drill.",
			"Stop only this exercise's owned processes. A front-end rollback retains the running API and uses a new restore target; it does not rebuild the retained artifact from edited source."
		];
	}
	if (selected.definition.workflow === "node") {
		const workspace = `${selected.pack}/${selected.role}`;
		if (selected.definition.project === "live-chat") {
			return [
				"Save and download the ZIP with every nested file and any added exercise files.",
				`Use the complete Web-Development-Foundations checkout at ${selected.resource.ref} with Node.js 24. Copy the exported files into ${workspace}; retain the checkout's root package.json and package-lock.json.`,
				"The selected-role ZIP lacks the root dependency lockfile. From the complete repository root, install recorded dependencies with npm ci if they are missing, then start the selected role:",
				`npm run start --workspace ${workspace}`,
				"Wait for the JSON ready event and open http://127.0.0.1:3003 in two browser windows. Use the actual port in that record if PORT was changed. Both clients must use the same hostname and port.",
				"This workspace edits source and does not run the Node.js or Socket.IO service. Run the exported source in the matching complete checkout.",
				"README.md supplies startup commands for macOS, Linux and PowerShell, input limits, acknowledgement and recovery checks. The starter broadcasts anonymous text; the reference adds acknowledged nicknames and join/rename/leave notices.",
				"Stop only the owned server with Ctrl+C before starting the other role on the same port. Restarting clears server memory; reconnect each client and check its retained draft before resending."
			];
		}
		if (selected.definition.project === "notes-api") {
			return [
				"Save and download the ZIP to preserve edited source and added exercise files.",
				`Use the complete Web-Development-Foundations source repository at ${selected.resource.ref} with Node.js 24.`,
				`Copy exported src/, public/ and any added exercise files into ${workspace}; retain that checkout's role package.json, root package.json and root package-lock.json.`,
				"The role ZIP lacks the monorepo root lockfile. Run these commands from the complete repository root:",
				"npm ci",
				`npm run start --workspace ${workspace}`,
				"Wait for the ready event, then open http://127.0.0.1:3001 or the selected PORT. This workspace edits source and does not run the Node.js service.",
				"The default memory adapter needs no database. Starter mutations return 501 until validateNoteInput and replaceMemoryNote are completed.",
				"README.md describes NOTES_SEED_FILE snapshots, a separate restore target, the optional isolated local MongoDB adapter, and the NOTES_SCENARIO=unavailable failure case.",
				"Stop only this exercise's server with Ctrl+C before changing adapter, seed file, scenario or port. A memory restart resets data; a MongoDB-backed API restart can retain it."
			];
		}
		return [
			"Save and download the ZIP to preserve edited source.",
			`Use the complete Web-Development-Foundations source repository at ${selected.resource.ref} with Node.js 24.`,
			`Copy the exported src/ and public/ files into ${workspace}; retain that checkout's role package.json, root package.json and root package-lock.json.`,
			"The role ZIP lacks the monorepo root lockfile. Run these commands from the complete repository root:",
			"npm ci",
			`npm run start --workspace ${workspace}`,
			"Wait for the ready event, then open http://127.0.0.1:3002. This workspace edits source and does not run the Node.js service.",
			"The unfinished starter returns 501 until parseContact is implemented. The reference validates requests and simulates delivery without sending email.",
			"Stop this exercise's server with Ctrl+C before changing CONTACT_SCENARIO to fail, timeout or ok and restarting. README.md supplies the shell-specific commands and request checks.",
			"If port 3002 is occupied, select a free PORT as described in README.md. Stop only the server started for this exercise."
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
