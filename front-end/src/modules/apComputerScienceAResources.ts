const binarySearchPack =
	"https://github.com/instruction-material/APCS/tree/b12cdaaa9bc35a88d281666f0060bc8a90d470ad/APCS16-Binary-Search";
const algorithmPacks =
	"https://github.com/instruction-material/APCS/tree/34f8f99a5ab4b895521c8827fa70c892bc4150fa";

function projectRoles(pack: string) {
	return {
		starter: `${pack}/starter`,
		reference: `${pack}/solution`
	};
}

export const apBinarySearchResources = projectRoles(binarySearchPack);
export const apRecursionPracticeResources = projectRoles(
	`${algorithmPacks}/APCS15-Recursion-Practice`
);
export const apBlobEraseResources = projectRoles(
	`${algorithmPacks}/APCS15-Blob-Erase`
);
export const apMergeSortResources = projectRoles(
	`${algorithmPacks}/APCS16-Merge-Sort`
);

const restoredProjects = {
	"binary-search-trace": apBinarySearchResources,
	"recursion-practice": apRecursionPracticeResources,
	"blob-erase": apBlobEraseResources,
	"merge-sort": apMergeSortResources
};

export function apComputerScienceAProjectKey(
	courseID: string,
	itemID: string,
	role: "starter" | "reference",
	url: string
) {
	const base = `${courseID}:${itemID}:${role}`;
	if (courseID !== "ap-computer-science-a") return base;
	// Preserve earlier attempts when opening a restored source pack.
	const restored = Object.entries(restoredProjects).find(
		([, links]) => url === links[role]
	);
	return restored ? `${base}:${restored[0]}` : base;
}
