// Only these role folders have verified, runnable learner and reference packs.
// Legacy USACO folders mix languages and may still contain only a README.
export const usacoRestoredResources = [
	{
		course: "usaco-bronze",
		repository: "USACO-Bronze",
		folder: "UB1-Square-Pasture",
		mode: "python"
	},
	{
		course: "usaco-bronze",
		repository: "USACO-Bronze",
		folder: "UB62-Cow-College",
		mode: "python"
	},
	{
		course: "usaco-bronze",
		repository: "USACO-Bronze",
		folder: "UB63-Feeding-the-Cows",
		mode: "python"
	},
	{
		course: "usaco-silver",
		repository: "USACO-Silver",
		folder: "US9-Number-Triangles",
		mode: "cpp"
	},
	{
		course: "usaco-silver",
		repository: "USACO-Silver",
		folder: "US18-Counting-Haybales",
		mode: "cpp"
	},
	{
		course: "usaco-silver",
		repository: "USACO-Silver",
		folder: "US21-Priority-Queues",
		mode: "cpp"
	},
	{
		course: "usaco-silver",
		repository: "USACO-Silver",
		folder: "US22-Prefix-Sums",
		mode: "cpp"
	},
	{
		course: "usaco-gold",
		repository: "USACO-Gold",
		folder: "UG1-Dynamic-Programming-with-Fibonacci",
		mode: "cpp"
	},
	{
		course: "usaco-gold",
		repository: "USACO-Gold",
		folder: "UG3-Teamwork",
		mode: "cpp"
	},
	{
		course: "usaco-gold",
		repository: "USACO-Gold",
		folder: "UG5-Marathon",
		mode: "cpp"
	},
	{
		course: "usaco-gold",
		repository: "USACO-Gold",
		folder: "UG7-Treasure-Chest",
		mode: "cpp"
	},
	{
		course: "usaco-gold",
		repository: "USACO-Gold",
		folder: "UG8-Bookshelf",
		mode: "cpp"
	},
	{
		course: "usaco-gold",
		repository: "USACO-Gold",
		folder: "UG9-Dijkstras-Algorithm",
		mode: "java"
	},
	{
		course: "usaco-gold",
		repository: "USACO-Gold",
		folder: "UG14-MST",
		mode: "java"
	},
	{
		course: "usaco-gold",
		repository: "USACO-Gold",
		folder: "UG22-Binary-Indexed-Tree-Fenwick-Tree",
		mode: "java"
	}
] as const;

export function restoredUsacoResource(
	courseId: string,
	owner: string,
	repository: string,
	path: string
) {
	if (owner.toLowerCase() !== "instruction-material") return undefined;
	const course =
		courseId === "usaco-bronze-on-demand" ? "usaco-bronze" : courseId;
	return usacoRestoredResources.find(
		resource =>
			resource.course === course &&
			resource.repository.toLowerCase() === repository.toLowerCase() &&
			[
				`${resource.folder}/starter`,
				`${resource.folder}/solution`
			].includes(path)
	);
}

// Course data is also loaded by native Node catalog/media tools without aliases.
export function restoredUsacoResourceUrl(courseId: string, value: string) {
	try {
		const url = new URL(value);
		const [owner, repository, kind, ref, ...path] = url.pathname
			.split("/")
			.slice(1);
		if (
			url.protocol !== "https:" ||
			url.hostname !== "github.com" ||
			kind !== "tree" ||
			!ref
		) {
			return undefined;
		}
		return restoredUsacoResource(
			courseId,
			owner ?? "",
			repository ?? "",
			path.join("/")
		);
	} catch {
		return undefined;
	}
}
