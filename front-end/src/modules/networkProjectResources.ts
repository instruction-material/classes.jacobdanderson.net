import { githubRawUrl, parseGitHubResource } from "./codePreview";

export const networkSourceRevision = "1fdd3faef06af8782a0d029ba880422b0a9775eb";
export const networkFoundationPacks = [
	{
		pack: "NS-04-ns0-setup-and-tooling",
		revision: networkSourceRevision,
		roleFiles: ["network-notes.md", "main.py", "network_lab.py"],
		coreItemId:
			"network-systems-ns0-setup-and-tooling-curriculum-core-project-network-systems",
		notebookItemId:
			"network-systems-ns0-setup-and-tooling-supplemental-operations-notebook-setup-and-tooling"
	},
	{
		pack: "NS-05-unit-1-the-network-stack-in-plain-english",
		revision: networkSourceRevision,
		roleFiles: ["network-notes.md", "main.py", "network_lab.py"],
		coreItemId:
			"network-systems-unit-1-the-network-stack-in-plain-english-curriculum-core-project-the-network-stack-in-plain-english",
		notebookItemId:
			"network-systems-unit-1-the-network-stack-in-plain-english-supplemental-operations-notebook-the-network-stack-in-plain-english"
	}
] as const;

export const networkNamingSourceRevision =
	"4947560f34919e27c74cecf30099ddbf85c3cef6";
export const networkNamingPacks = [
	{
		pack: "NS-06-unit-2-addresses-and-naming",
		revision: networkNamingSourceRevision,
		roleFiles: [
			"network-notes.md",
			"main.py",
			"network_lab.py",
			"naming_lab.py"
		],
		coreItemId:
			"network-systems-unit-2-addresses-and-naming-curriculum-core-project-addresses-and-naming",
		notebookItemId:
			"network-systems-unit-2-addresses-and-naming-supplemental-operations-notebook-addresses-and-naming"
	},
	{
		pack: "NS-05-unit-2-addresses-and-naming-supplemental-2",
		revision: networkNamingSourceRevision,
		roleFiles: [
			"network-notes.md",
			"main.py",
			"network_lab.py",
			"naming_lab.py"
		],
		coreItemId:
			"network-systems-unit-2-addresses-and-naming-supplemental-addressing-transfer-practice",
		notebookItemId: undefined
	},
	{
		pack: "NS-06-unit-2-addresses-and-naming-supplemental-3",
		revision: networkNamingSourceRevision,
		roleFiles: [
			"network-notes.md",
			"main.py",
			"network_lab.py",
			"naming_lab.py"
		],
		coreItemId:
			"network-systems-unit-2-addresses-and-naming-supplemental-addressing-extension-practice",
		notebookItemId: undefined
	}
] as const;

export const networkVerifiedPacks = [
	...networkFoundationPacks,
	...networkNamingPacks
] as const;

export function networkCourseResource(url: string) {
	const resource = parseGitHubResource(url);
	if (
		!resource ||
		resource.owner.toLowerCase() !== "instruction-material" ||
		resource.repo.toLowerCase() !== "network-systems"
	) {
		return null;
	}
	const [pack, role, ...rest] = resource.path.split("/");
	const definition = networkVerifiedPacks.find(p => p.pack === pack);
	if (
		!definition ||
		resource.ref !== definition.revision ||
		rest.length ||
		(role !== "starter" && role !== "solution")
	) {
		return null;
	}
	return { resource, pack, role, definition };
}

export function networkPinnedCourseUrl(url: string) {
	const resource = parseGitHubResource(url);
	if (
		!resource ||
		resource.owner.toLowerCase() !== "instruction-material" ||
		resource.repo.toLowerCase() !== "network-systems"
	) {
		return url;
	}
	const [pack, role, ...rest] = resource.path.split("/");
	const definition = networkVerifiedPacks.find(p => p.pack === pack);
	if (
		!definition ||
		rest.length ||
		(role !== "starter" && role !== "solution") ||
		(resource.ref !== "main" && resource.ref !== definition.revision)
	) {
		return url;
	}
	return `https://github.com/instruction-material/Network-Systems/tree/${definition.revision}/${pack}/${role}`;
}

export function networkCourseProjectKey(
	courseID: string,
	itemID: string,

	role: "starter" | "reference",
	url: string
) {
	const selected =
		courseID === "network-systems" ? networkCourseResource(url) : null;
	if (!selected) return `${courseID}:${itemID}:${role}`;
	const shared =
		itemID === selected.definition.notebookItemId
			? selected.definition.coreItemId
			: itemID;
	return `${courseID}:${shared}:${role}:native-network`;
}

export function networkImportFiles(url: string) {
	const selected = networkCourseResource(url);
	if (!selected) return null;
	const { resource, pack, role, definition } = selected;
	return [
		...definition.roleFiles.map(name => `${role}/${name}`),
		"README.md"
	].map(name => {
		const path = `${pack}/${name}`;
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
