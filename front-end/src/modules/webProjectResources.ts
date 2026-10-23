import { githubRawUrl, parseGitHubResource } from "@/modules/codePreview";

export const webMaintainedSourceRevision =
	"5bfdf1b25452fb65aa36d38cea6d836fdf6ae5cc";
export const webPortfolioRevision = webMaintainedSourceRevision;
export const webPortfolioPack = "WDF1-Portfolio-Custom-Domain/basics";
export const webModulePortfolioPack = "WDF1-Portfolio-Custom-Domain";
export const webPortfolioRoot = `https://github.com/instruction-material/Web-Development-Foundations/tree/${webPortfolioRevision}/${webPortfolioPack}`;
export const webModulePortfolioRevision = webMaintainedSourceRevision;
export const webModulePortfolioRoot = `https://github.com/instruction-material/Web-Development-Foundations/tree/${webModulePortfolioRevision}/${webModulePortfolioPack}`;
export const webPortfolioRoleFiles = [
	"index.html",
	"main.js",
	"styles.css",
	"package.json"
] as const;
export const webNotificationRevision = webMaintainedSourceRevision;
export const webNotificationPack = "WDF4-Realtime-Chat-App/local-client";
export const webNotificationRoot = `https://github.com/instruction-material/Web-Development-Foundations/tree/${webNotificationRevision}/${webNotificationPack}`;
export const webChatRevision = "b179a9e0e523a95fc5c71de3434322a7f7840579";
export const webChatPack = "WDF4-Realtime-Chat-App";
export const webChatRoot = `https://github.com/instruction-material/Web-Development-Foundations/tree/${webChatRevision}/${webChatPack}`;
export const webChatRoleFiles = [
	"src/server.js",
	"public/index.html",
	"public/chat.js",
	"package.json"
] as const;
export const webContactRevision = "aed8ef2fcd7488c25c0b977b2099640e7431c55a";
export const webContactPack = "WDF3-Booking-Contact-App";
export const webContactRoot = `https://github.com/instruction-material/Web-Development-Foundations/tree/${webContactRevision}/${webContactPack}`;
export const webContactRoleFiles = [
	"src/validation.js",
	"src/app.js",
	"src/server.js",
	"src/lib/mailer.js",
	"public/index.html",
	"public/app.js",
	"public/styles.css",
	"package.json"
] as const;
export const webNotesRevision = "8d48a2672e987b5ab1c1b7b93ea395f6da5c37a2";
export const webNotesPack = "WDF2-Notes-App-with-MongoDB";
export const webNotesRoot = `https://github.com/instruction-material/Web-Development-Foundations/tree/${webNotesRevision}/${webNotesPack}`;
export const webNotesRoleFiles = [
	"src/models/note.js",
	"src/store.js",
	"src/routes/notes.js",
	"src/app.js",
	"src/server.js",
	"public/index.html",
	"public/app.js",
	"public/styles.css",
	"package.json"
] as const;
export const webDeploymentRevision = "962d1be3da0d954ad774390b78cb044395a12262";
export const webDeploymentPack = "WDF5-Separate-Deployment-Lab";
export const webDeploymentRoot = `https://github.com/instruction-material/Web-Development-Foundations/tree/${webDeploymentRevision}/${webDeploymentPack}`;
export const webDeploymentRoleFiles = [
	"backend/package.json",
	"backend/src/server.js",
	"frontend/index.html",
	"frontend/main.js",
	"frontend/serve.mjs",
	"release.mjs",
	"release-model.mjs"
] as const;

const definitions = [
	{
		revision: webPortfolioRevision,
		pack: webPortfolioPack,
		project: "portfolio",
		version: 1,
		workflow: "vite",
		files: webPortfolioRoleFiles,
		shared: ["README.md"]
	},
	{
		revision: webModulePortfolioRevision,
		pack: webModulePortfolioPack,
		project: "portfolio",
		version: 2,
		workflow: "vite",
		files: [...webPortfolioRoleFiles, "project-idea.js"],
		shared: ["README.md"]
	},
	{
		revision: webNotificationRevision,
		pack: webNotificationPack,
		project: "notification-state",
		version: 1,
		workflow: "standalone",
		files: [
			"index.html",
			"app.mjs",
			"state.mjs",
			"styles.css",
			"events.json",
			"empty.json",
			"invalid.json",
			"malformed.json",
			"history.json",
			"out-of-order.json"
		],
		shared: ["README.md", "serve.mjs"]
	},
	{
		revision: webChatRevision,
		pack: webChatPack,
		project: "live-chat",
		version: 1,
		workflow: "node",
		files: webChatRoleFiles,
		extraRoleFiles: { starter: [], solution: ["public/styles.css"] },
		shared: ["README.md"]
	},
	{
		revision: webContactRevision,
		pack: webContactPack,
		project: "contact-api",
		version: 1,
		workflow: "node",
		files: webContactRoleFiles,
		shared: ["README.md"]
	},
	{
		revision: webNotesRevision,
		pack: webNotesPack,
		project: "notes-api",
		version: 1,
		workflow: "node",
		files: webNotesRoleFiles,
		shared: ["README.md"]
	},
	{
		revision: webDeploymentRevision,
		pack: webDeploymentPack,
		project: "deployment",
		version: 1,
		workflow: "separate-services",
		files: webDeploymentRoleFiles,
		extraRoleFiles: {
			starter: ["frontend/env.template.js"],
			solution: ["frontend/env.js", "frontend/styles.css"]
		},
		shared: ["README.md"]
	}
] as const;
const originalPortfolioRevision = "2c7a9fa89e052cd5cdc51987ebf837ae81e3557f";
const historicalDefinitions = [
	{
		...definitions[0],
		revision: originalPortfolioRevision,
		pack: webModulePortfolioPack
	},
	{ ...definitions[1], revision: "6bfe60b31c07cbfabbc396790f1251503b1f4f7d" },
	{ ...definitions[2], revision: "c18190dcca466f35f1e4a7ed677d922fa80daff8" },
	{ ...definitions[2], revision: "26aa4f20a2230f5b422b0afa67b3d06426875adf" }
] as const;

export function webCourseResource(url: string) {
	const resource = parseGitHubResource(url);
	if (
		!resource ||
		resource.owner.toLowerCase() !== "instruction-material" ||
		resource.repo.toLowerCase() !== "web-development-foundations"
	) {
		return null;
	}
	const originalMainPath = [
		`${webModulePortfolioPack}/starter`,
		`${webModulePortfolioPack}/solution`
	].includes(resource.path);
	const liveChatPath = [
		`${webChatPack}/starter`,
		`${webChatPack}/solution`
	].includes(resource.path);
	// Existing main URLs identify the original four-file saved project.
	const ref =
		resource.ref === "main"
			? originalMainPath
				? originalPortfolioRevision
				: liveChatPath
					? webChatRevision
					: resource.path.startsWith(`${webContactPack}/`)
						? webContactRevision
						: resource.path.startsWith(`${webNotesPack}/`)
							? webNotesRevision
							: resource.path.startsWith(`${webDeploymentPack}/`)
								? webDeploymentRevision
								: webMaintainedSourceRevision
			: resource.ref;
	const definition = [...definitions, ...historicalDefinitions].find(
		row =>
			row.revision === ref &&
			[`${row.pack}/starter`, `${row.pack}/solution`].includes(
				resource.path
			)
	);
	if (!definition) return null;
	const role = resource.path.endsWith("/starter")
		? ("starter" as const)
		: ("solution" as const);
	return {
		resource: { ...resource, ref },
		pack: definition.pack,
		role,
		definition
	};
}

export function webCourseResourceUrl(url: string) {
	const selected = webCourseResource(url);
	return selected
		? `https://github.com/${selected.resource.owner}/${selected.resource.repo}/tree/${selected.resource.ref}/${selected.pack}/${selected.role}`
		: null;
}

export function webCourseProjectKey(
	courseID: string,
	itemID: string,
	role: "starter" | "reference",
	url: string
) {
	const selected = webCourseResource(url);
	return courseID === "web-development-foundations" && selected
		? `${courseID}:${selected.definition.project}:${role}:web-source-v${selected.definition.version}`
		: `${courseID}:${itemID}:${role}`;
}

export function webImportFiles(url: string) {
	const selected = webCourseResource(url);
	if (!selected) return null;
	const { resource, pack, role, definition } = selected;
	const files =
		"extraRoleFiles" in definition
			? [...definition.files, ...definition.extraRoleFiles[role]]
			: definition.files;
	const imports = [
		...files.map(name => ({
			name,
			path: `${pack}/${role}/${name}`
		})),
		...definition.shared.map(name => ({ name, path: `${pack}/${name}` }))
	];
	return imports.map(({ name, path }) => {
		return {
			name,
			file: {
				path,
				htmlUrl: `https://github.com/${resource.owner}/${resource.repo}/blob/${resource.ref}/${path}`,
				rawUrl: githubRawUrl(resource, path),
				label: name,
				size: null
			}
		};
	});
}
