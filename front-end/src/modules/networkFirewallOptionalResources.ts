export const networkFirewallOptionalRevision =
	"4880f07adac15dbbebcad6146fbeaff2f554347f";

export const networkFirewallOptionalPacks = [
	{
		pack: "NS-19-unit-9-firewalls-and-host-policy-supplemental-2",
		revision: "4880f07adac15dbbebcad6146fbeaff2f554347f",
		roleFiles: [
			"network-notes.md",
			"apply_web_policy.sh",
			"policy-rules.sh",
			"web-stack.profile",
			"firewall_runtime.py"
		],
		coreItemId:
			"network-systems-unit-9-firewalls-and-host-policy-supplemental-firewall-policy-transfer-practice",
		notebookItemId: undefined
	},
	{
		pack: "NS-20-unit-9-firewalls-and-host-policy-supplemental-3",
		revision: "4880f07adac15dbbebcad6146fbeaff2f554347f",
		roleFiles: [
			"network-notes.md",
			"apply_web_policy.sh",
			"policy-rules.sh",
			"web-stack.profile",
			"firewall_runtime.py"
		],
		coreItemId:
			"network-systems-unit-9-firewalls-and-host-policy-supplemental-firewall-policy-extension-practice",
		notebookItemId: undefined
	}
] as const;

export function networkFirewallOptionalInstructions(
	pack: string,
	role: string
) {
	const index = networkFirewallOptionalPacks.findIndex(
		item => item.pack === pack
	);
	if (index < 0) return null;
	return [
		"Use an owned disposable Linux VM with console access, a snapshot, Python 3.10+, UFW, iproute2, iptables, util-linux and curl. Python programming is optional.",
		`Read README.md, then cd ${
			role
		}. Keep all role files together. The supplied runtime owns private network/mount namespaces and restores its private policy.`,
		"sudo bash apply_web_policy.sh --output first-observation.json",
		"sudo bash apply_web_policy.sh --management-port 22022 --output changed-port.json",
		index === 0
			? "Keep the starter's default-port success and changed-port failure. Change only the management allowance in policy-rules.sh to use MANAGEMENT_PORT. Repeat both ports and --reverse with new output filenames."
			: "Retain the starter's actual exposure of the unrequested TCP listener. Change only web-stack.profile to the requested 8080/tcp profile. Compare a fresh run, changed management port and --reverse. Preserve the separate UDP-profile counterexample.",
		"Compare baseline, active and restored fresh requests with listener identities, kernel rules/counters, private rollback and outer-host observations. Record the explanation and cleanup in network-notes.md.",
		"The management marker is HTTP on the selected port. It does not establish SSH, IPv6, TLS or Internet policy. Existing reports are preserved; this optional project and its reference use separate saved attempts."
	];
}
