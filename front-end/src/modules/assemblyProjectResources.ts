import { githubRawUrl, parseGitHubResource } from "@/modules/codePreview";

export const assemblySourceRevision =
	"117e34fb8ff90c2046da71090c37e7b45ef20624";
export const assemblyOpeningPack = "ASM-04-asm0-setup-and-tooling";
export const assemblyRoleFiles = [
	"routine.S",
	"main.c",
	"transform.h",
	"abi_checks.S",
	"tests.c",
	"CMakeLists.txt"
] as const;

export function assemblyCourseResource(url: string) {
	const resource = parseGitHubResource(url);
	if (
		!resource ||
		resource.owner.toLowerCase() !== "instruction-material" ||
		resource.repo.toLowerCase() !== "assembly" ||
		resource.ref !== assemblySourceRevision
	) {
		return null;
	}
	const [pack, role, ...rest] = resource.path.split("/");
	if (
		pack !== assemblyOpeningPack ||
		rest.length ||
		(role !== "starter" && role !== "solution")
	) {
		return null;
	}
	return { resource, pack, role };
}

export function assemblyCourseProjectKey(
	courseID: string,
	itemID: string,
	role: "starter" | "reference",
	url: string
) {
	const base = `${courseID}:${itemID}:${role}`;
	return courseID === "assembly" && assemblyCourseResource(url)
		? `${base}:native-assembly`
		: base;
}

export function assemblyImportFiles(url: string) {
	const selected = assemblyCourseResource(url);
	if (!selected) return null;
	const { resource, pack, role } = selected;
	return [
		...assemblyRoleFiles.map(name => `${role}/${name}`),
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
