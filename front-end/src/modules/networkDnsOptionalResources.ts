export const networkDnsOptionalRevision =
	"b371df70e1e8bbe75ba4bd682fdbf67ecf4ffcce";

export const networkDnsOptionalPacks = [
	{
		pack: "NS-11-unit-5-dns-and-name-resolution-supplemental-2",
		revision: networkDnsOptionalRevision,
		roleFiles: ["network-notes.md", "main.py", "dns_probe.py", "case.json"],
		coreItemId:
			"network-systems-unit-5-dns-and-name-resolution-supplemental-dns-resolution-transfer-practice",
		notebookItemId: undefined
	},
	{
		pack: "NS-12-unit-5-dns-and-name-resolution-supplemental-3",
		revision: networkDnsOptionalRevision,
		roleFiles: ["network-notes.md", "main.py", "dns_probe.py", "case.json"],
		coreItemId:
			"network-systems-unit-5-dns-and-name-resolution-supplemental-dns-resolution-extension-practice",
		notebookItemId: undefined
	}
] as const;

export function networkDnsOptionalInstructions(pack: string, role: string) {
	const selected = networkDnsOptionalPacks.find(item => item.pack === pack);
	if (!selected) return null;
	const extension = selected === networkDnsOptionalPacks[1];
	return [
		"The complete README supplies an owned foreground dnsmasq fixture on loopback, without changing system DNS settings. Use an ordinary Linux account with Python 3.10+, dig and dnsmasq.",
		`Read README.md, then cd ${role}. Keep all role files together.`,
		"python3 main.py --port 1053 --phase live --output first-observation.json",
		extension
			? "Preserve the live NXDOMAIN report, stop only the owned foreground resolver, then run python3 main.py --port 1053 --phase stopped --output stopped-observation.json. Correct stoppedClaim in case.json and use another new output filename."
			: "Predict both typed alias answers. Retain the first v4.course.test result, change only question in case.json to alias.course.test and repeat with --output corrected-observation.json.",
		"Record raw DNS data, command statuses, actual server/port, predictions, the changed case and cleanup in network-notes.md. A runtime goal does not complete the explanation.",
		"Python programming is optional. The required work is configuration, actual DNS observations and their explanation.",
		"Exit 78 records an unmet configured goal. Every report filename must be new. This optional attempt and its reference remain separate from the core DNS project."
	];
}
