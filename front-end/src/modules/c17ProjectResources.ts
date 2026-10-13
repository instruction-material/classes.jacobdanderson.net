import { githubRawUrl, parseGitHubResource } from "@/modules/codePreview";

export const c17SourceRevision = "9c2ca21336c7667681091972a0abe9e55921f8fa";
export const c17OpeningPacks = [
	"CSE-05-cse0-setup-and-tooling",
	"CSE-06-unit-1-why-c-for-systems-work"
] as const;

export const c17VerifiedPacks = [
	{
		pack: c17OpeningPacks[0],
		revision: c17SourceRevision,
		roleFiles: ["main.c", "reading.h", "tests.c", "CMakeLists.txt"],
		supportFiles: ["README.md", "unsafe_probe.c"]
	},
	{
		pack: c17OpeningPacks[1],
		revision: c17SourceRevision,
		roleFiles: [
			"main.c",
			"reading.h",
			"tests.c",
			"CMakeLists.txt",
			"reading.c",
			"labels.c"
		],
		supportFiles: ["README.md"]
	},
	{
		pack: "CSE-07-unit-8-function-pointers-and-dispatch",
		revision: "390d99a65ce272dbd690537870811756a06bd9bf",
		roleFiles: [
			"main.c",
			"dispatch.h",
			"handlers.c",
			"dispatch.c",
			"tests.c",
			"CMakeLists.txt"
		],
		supportFiles: ["README.md"]
	},
	{
		pack: "CSE-08-unit-10-engineering-math-in-code",
		revision: "008e3e6c7f9a5f469820ec43824ef75d51e01dfd",
		roleFiles: [
			"main.c",
			"engineering_math.h",
			"engineering_math.c",
			"tests.c",
			"CMakeLists.txt"
		],
		supportFiles: ["README.md"]
	},
	{
		pack: "CSE-09-unit-11-systems-tooling",
		revision: "aa4ccdf9398472351985c8cce3d20a719addca5a",
		roleFiles: [
			"main.c",
			"engineering_math.h",
			"engineering_math.c",
			"tests.c",
			"CMakeLists.txt"
		],
		supportFiles: ["README.md"]
	},
	{
		pack: "CSE1-Hex-and-Binary-Inspector",
		revision: "24c52499af8db18b93f5f2807b9631fbe931620c",
		roleFiles: [
			"main.c",
			"input.c",
			"input.h",
			"representation.c",
			"representation.h",
			"tests.c",
			"CMakeLists.txt"
		],
		supportFiles: ["README.md"]
	},
	{
		pack: "CSE2-Bitflag-Configuration-Parser",
		revision: "1221f76d800f52d4f33728c7c1f85dbecd71a48b",
		roleFiles: [
			"main.c",
			"input.c",
			"input.h",
			"configuration.c",
			"configuration.h",
			"tests.c",
			"CMakeLists.txt"
		],
		supportFiles: ["README.md"]
	},
	{
		pack: "CSE3-XOR-Encoder-Decoder",
		revision: "ecf421bd45977b9b63d79b9c2b7af20a921de0c2",
		roleFiles: [
			"main.c",
			"input.c",
			"input.h",
			"transform.c",
			"transform.h",
			"tests.c",
			"CMakeLists.txt"
		],
		supportFiles: ["README.md"]
	}
] as const;

export function c17CourseResource(url: string) {
	const resource = parseGitHubResource(url);
	if (
		!resource ||
		resource.mode !== "tree" ||
		resource.owner.toLowerCase() !== "instruction-material" ||
		resource.repo.toLowerCase() !== "c-systems-engineering"
	) {
		return null;
	}
	const [pack, role, extra] = resource.path.split("/");
	const selected = c17VerifiedPacks.find(
		candidate =>
			candidate.pack === pack && candidate.revision === resource.ref
	);
	if (
		extra !== undefined ||
		!selected ||
		(role !== "starter" && role !== "solution")
	) {
		return null;
	}
	return { resource, pack: selected.pack, role, definition: selected };
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
	const { resource, pack, role, definition } = selected;
	const paths = [
		...definition.roleFiles.map(name => `${role}/${name}`),
		...definition.supportFiles
	];
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
