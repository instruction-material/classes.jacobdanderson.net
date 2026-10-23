import { githubRawUrl, parseGitHubResource } from "@/modules/codePreview";

export const swiftSourceRevision = "d632ceb25abfac35ec4604babc9ea385a6afbcc2";
export const swiftWelcomePack = "SAD1-Welcome-Profile-App";
export const swiftWelcomeRoot = `https://github.com/instruction-material/Swift/tree/${swiftSourceRevision}/${swiftWelcomePack}`;
export const swiftWelcomeRoleFiles = [
	"ContentView.swift",
	"WelcomeProfileApp.swift"
] as const;

export const swiftNetworkingRevision =
	"d8110b0b359a7499a9de9fc3c31dfac26b411b3e";
export const swiftNetworkingPack = "SAD6-API-Reference-App";
export const swiftNetworkingRoot = `https://github.com/instruction-material/Swift/tree/${swiftNetworkingRevision}/${swiftNetworkingPack}`;

const swiftPacks = [
	{
		pack: swiftWelcomePack,
		revision: swiftSourceRevision,
		projectKey: "welcome-profile",
		roleFiles: swiftWelcomeRoleFiles,
		sharedFiles: ["README.md"]
	},
	{
		pack: swiftNetworkingPack,
		revision: swiftNetworkingRevision,
		projectKey: "api-reference",
		roleFiles: [
			"ContentView.swift",
			"APIReferenceApp.swift",
			"ReferenceClient.swift",
			"ReferenceStore.swift"
		],
		sharedFiles: [
			"README.md",
			"verify-networking.py",
			"tests/ReferenceContracts.swift"
		]
	}
] as const;

export function swiftCourseResource(url: string) {
	const resource = parseGitHubResource(url);
	if (
		!resource ||
		resource.owner.toLowerCase() !== "instruction-material" ||
		resource.repo.toLowerCase() !== "swift" ||
		resource.mode !== "tree"
	) {
		return null;
	}
	const selected = swiftPacks.find(
		pack =>
			["main", pack.revision].includes(resource.ref) &&
			[`${pack.pack}/starter`, `${pack.pack}/solution`].includes(
				resource.path
			)
	);
	if (!selected) return null;
	return {
		...selected,
		resource: { ...resource, ref: selected.revision },
		role: resource.path.endsWith("/starter")
			? ("starter" as const)
			: ("solution" as const)
	};
}

export function swiftCourseResourceUrl(url: string) {
	const selected = swiftCourseResource(url);
	return selected
		? `https://github.com/${selected.resource.owner}/${selected.resource.repo}/tree/${selected.revision}/${selected.pack}/${selected.role}`
		: null;
}

export function swiftCourseProjectKey(
	courseID: string,
	itemID: string,
	role: "starter" | "reference",
	url: string
) {
	const selected = swiftCourseResource(url);
	return courseID === "intro-to-swift-app-development" && selected
		? `${courseID}:${selected.projectKey}:${role}:native-swift-v1`
		: `${courseID}:${itemID}:${role}`;
}

export function swiftImportFiles(url: string) {
	const selected = swiftCourseResource(url);
	if (!selected) return null;
	const { resource, pack, role } = selected;
	return [
		...selected.roleFiles.map(name => ({
			name: `${role}/${name}`,
			path: `${pack}/${role}/${name}`
		})),
		...selected.sharedFiles.map(name => ({ name, path: `${pack}/${name}` }))
	].map(({ name, path }) => ({
		name,
		file: {
			path,
			htmlUrl: `https://github.com/${resource.owner}/${resource.repo}/blob/${resource.ref}/${path}`,
			rawUrl: githubRawUrl(resource, path),
			label: name,
			size: null
		}
	}));
}
