import { githubRawUrl, parseGitHubResource } from "@/modules/codePreview";

export const c17SourceRevision = "9c2ca21336c7667681091972a0abe9e55921f8fa";
export const c17OpeningPacks = [
	"CSE-05-cse0-setup-and-tooling",
	"CSE-06-unit-1-why-c-for-systems-work"
] as const;

export function c17CourseResource(url: string) {
	const resource = parseGitHubResource(url);
	if (
		!resource ||
		resource.mode !== "tree" ||
		resource.owner.toLowerCase() !== "instruction-material" ||
		resource.repo.toLowerCase() !== "c-systems-engineering" ||
		resource.ref !== c17SourceRevision
	) {
		return null;
	}
	const [pack, role, extra] = resource.path.split("/");
	const selectedPack = c17OpeningPacks.find(candidate => candidate === pack);
	if (
		extra !== undefined ||
		!selectedPack ||
		(role !== "starter" && role !== "solution")
	) {
		return null;
	}
	return { resource, pack: selectedPack, role };
}

export function c17CourseProjectKey(
	courseID: string,
	itemID: string,
	role: "starter" | "reference",
	url: string
) {
	const base = `${courseID}:${itemID}:${role}`;
	return courseID === "c-systems-engineering" && c17CourseResource(url)
		? `${base}:native-c17`
		: base;
}

// Retain the selected role directory so the unchanged README's relative paths
// work after ZIP export. Never enumerate the sibling reference directory.
export function c17ImportFiles(url: string) {
	const selected = c17CourseResource(url);
	if (!selected) return null;
	const { resource, pack, role } = selected;
	const roleFiles = ["main.c", "reading.h", "tests.c", "CMakeLists.txt"];
	if (pack === c17OpeningPacks[1]) roleFiles.push("reading.c", "labels.c");
	const paths = roleFiles.map(name => `${role}/${name}`);
	paths.push("README.md");
	if (pack === c17OpeningPacks[0]) paths.push("unsafe_probe.c");
	return paths.map(name => {
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
