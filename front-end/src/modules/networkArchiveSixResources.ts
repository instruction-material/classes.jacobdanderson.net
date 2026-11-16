export const networkArchiveSixRevision =
	"429c6e5098ea10044a0421f67a4625df9835d04e";

export const networkArchiveSixPacks = [
	{
		pack: "NS-10-ns13-expansion-ideas-and-next-steps",
		revision: "429c6e5098ea10044a0421f67a4625df9835d04e",
		kind: "expansion-plan",
		roleFiles: [
			"network-notes.md",
			"main.py",
			"archive_lab.py",
			"observations.json",
			"assessment.json",
			"edge-cases.md",
			"SOURCES.md"
		],
		coreItemId:
			"network-systems-optional-network-expansion-and-integration-studio-archive-supplemental-core-project-expansion-ideas-and-next-steps",
		notebookItemId:
			"network-systems-optional-network-expansion-and-integration-studio-archive-supplemental-operations-notebook-expansion-ideas-and-next-steps",
		continuationItemIds: []
	},
	{
		pack: "NS-27-ns13-expansion-ideas-and-next-steps-supplemental-2",
		revision: "429c6e5098ea10044a0421f67a4625df9835d04e",
		kind: "expansion-transfer",
		roleFiles: [
			"network-notes.md",
			"main.py",
			"archive_lab.py",
			"observations.json",
			"assessment.json",
			"edge-cases.md",
			"SOURCES.md"
		],
		coreItemId:
			"network-systems-optional-network-expansion-and-integration-studio-archive-supplemental-next-steps-transfer-practice",
		notebookItemId: null,
		continuationItemIds: []
	},
	{
		pack: "NS-28-ns13-expansion-ideas-and-next-steps-supplemental-3",
		revision: "429c6e5098ea10044a0421f67a4625df9835d04e",
		kind: "expansion-claims",
		roleFiles: [
			"network-notes.md",
			"main.py",
			"archive_lab.py",
			"observations.json",
			"assessment.json",
			"edge-cases.md",
			"SOURCES.md"
		],
		coreItemId:
			"network-systems-optional-network-expansion-and-integration-studio-archive-supplemental-next-steps-extension-practice",
		notebookItemId: null,
		continuationItemIds: []
	},
	{
		pack: "NS-02-network-systems-lab-16",
		revision: "429c6e5098ea10044a0421f67a4625df9835d04e",
		kind: "exposure-core",
		roleFiles: [
			"network-notes.md",
			"main.py",
			"archive_lab.py",
			"observations.json",
			"assessment.json",
			"edge-cases.md",
			"SOURCES.md"
		],
		coreItemId:
			"network-systems-optional-network-expansion-and-integration-studio-archive-supplemental-core-project-service-exposure-studio",
		notebookItemId: null,
		continuationItemIds: [
			"network-systems-optional-network-expansion-and-integration-studio-archive-supplemental-extension-challenge-service-exposure-studio"
		]
	},
	{
		pack: "NS-31-applied-studio-16-network-systems-lab-16-supplemental-2",
		revision: "429c6e5098ea10044a0421f67a4625df9835d04e",
		kind: "exposure-families",
		roleFiles: [
			"network-notes.md",
			"main.py",
			"archive_lab.py",
			"observations.json",
			"assessment.json",
			"edge-cases.md",
			"SOURCES.md"
		],
		coreItemId:
			"network-systems-optional-network-expansion-and-integration-studio-archive-supplemental-service-exposure-transfer-practice",
		notebookItemId: null,
		continuationItemIds: []
	},
	{
		pack: "NS-32-applied-studio-16-network-systems-lab-16-supplemental-3",
		revision: "429c6e5098ea10044a0421f67a4625df9835d04e",
		kind: "exposure-policy",
		roleFiles: [
			"network-notes.md",
			"main.py",
			"archive_lab.py",
			"observations.json",
			"assessment.json",
			"edge-cases.md",
			"SOURCES.md"
		],
		coreItemId:
			"network-systems-optional-network-expansion-and-integration-studio-archive-supplemental-service-exposure-extension-practice",
		notebookItemId: null,
		continuationItemIds: []
	}
] as const;

export function networkArchiveSixInstructions(pack: string, role: string) {
	const selected = networkArchiveSixPacks.find(item => item.pack === pack);
	if (!selected) return null;
	return [
		"Keep all seven role files and the shared README.md together. Python programming is optional; complete assessment.json and explain the cited network observations in network-notes.md.",
		`Run cd ${role}, then python3 main.py with Python 3.10 or later.`,
		"Read a captured command with python3 main.py --show route-gap --field routeGet4. Use --show wrong-upstream --field http4 for its actual responding application.",
		"Exit 1 means the factual assessment is incomplete or disagrees with the supplied observations; exit 2 means invalid input; exit 0 leaves notebook review open.",
		"These commands analyze recorded isolated-Linux observations. README.md also supplies the separately owned Linux capstone route for collecting and inspecting a fresh inside.json.",
		"Save and reopen this role, then export the complete ZIP. The reference remains a separate attempt."
	];
}
