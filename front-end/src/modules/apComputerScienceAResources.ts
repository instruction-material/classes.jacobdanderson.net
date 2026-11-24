const binarySearchPack =
	"https://github.com/instruction-material/APCS/tree/b12cdaaa9bc35a88d281666f0060bc8a90d470ad/APCS16-Binary-Search";

export const apBinarySearchResources = {
	starter: `${binarySearchPack}/starter`,
	reference: `${binarySearchPack}/solution`
};

export function apComputerScienceAProjectKey(
	courseID: string,
	itemID: string,
	role: "starter" | "reference",
	url: string
) {
	const base = `${courseID}:${itemID}:${role}`;
	// Preserve earlier attempts when opening the runnable binary search pack.
	return courseID === "ap-computer-science-a" &&
		url === apBinarySearchResources[role]
		? `${base}:binary-search-trace`
		: base;
}
