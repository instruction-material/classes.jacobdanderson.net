export const networkDiagnosticsFiveRevision =
	"0a45a7c6333ef7f949a0b725bacd608cd9ff6388";

export const networkDiagnosticsFivePacks = [
	{
		pack: "NS-13-unit-6-core-diagnostics-supplemental-2",
		revision: "0a45a7c6333ef7f949a0b725bacd608cd9ff6388",
		kind: "protocol",
		roleFiles: [
			"network-notes.md",
			"main.py",
			"diagnostics_lab.py",
			"diagnose_reachability.sh",
			"case.json"
		],
		coreItemId:
			"network-systems-unit-6-core-diagnostics-supplemental-diagnostic-trace-transfer-practice",
		notebookItemId: undefined,
		continuationItemIds: []
	},
	{
		pack: "NS-14-unit-6-core-diagnostics-supplemental-3",
		revision: "0a45a7c6333ef7f949a0b725bacd608cd9ff6388",
		kind: "deadline",
		roleFiles: [
			"network-notes.md",
			"main.py",
			"diagnostics_lab.py",
			"diagnose_reachability.sh",
			"case.json"
		],
		coreItemId:
			"network-systems-unit-6-core-diagnostics-supplemental-diagnostic-trace-extension-practice",
		notebookItemId: undefined,
		continuationItemIds: []
	},
	{
		pack: "NS-01-network-systems-lab-15",
		revision: "0a45a7c6333ef7f949a0b725bacd608cd9ff6388",
		kind: "address",
		roleFiles: [
			"network-notes.md",
			"main.py",
			"diagnostics_lab.py",
			"diagnose_reachability.sh",
			"case.json"
		],
		coreItemId:
			"network-systems-optional-network-expansion-and-integration-studio-archive-supplemental-core-project-diagnostic-workflow-studio",
		notebookItemId: undefined,
		continuationItemIds: [
			"network-systems-optional-network-expansion-and-integration-studio-archive-supplemental-extension-challenge-diagnostic-workflow-studio"
		]
	},
	{
		pack: "NS-29-applied-studio-15-network-systems-lab-15-supplemental-2",
		revision: "0a45a7c6333ef7f949a0b725bacd608cd9ff6388",
		kind: "port",
		roleFiles: [
			"network-notes.md",
			"main.py",
			"diagnostics_lab.py",
			"diagnose_reachability.sh",
			"case.json"
		],
		coreItemId:
			"network-systems-optional-network-expansion-and-integration-studio-archive-supplemental-diagnostic-workflow-transfer-practice",
		notebookItemId: undefined,
		continuationItemIds: []
	},
	{
		pack: "NS-30-applied-studio-15-network-systems-lab-15-supplemental-3",
		revision: "0a45a7c6333ef7f949a0b725bacd608cd9ff6388",
		kind: "status",
		roleFiles: [
			"network-notes.md",
			"main.py",
			"diagnostics_lab.py",
			"diagnose_reachability.sh",
			"case.json"
		],
		coreItemId:
			"network-systems-optional-network-expansion-and-integration-studio-archive-supplemental-diagnostic-workflow-extension-practice",
		notebookItemId: undefined,
		continuationItemIds: []
	}
] as const;

export function networkDiagnosticsFiveInstructions(pack: string, role: string) {
	const selected = networkDiagnosticsFivePacks.find(
		item => item.pack === pack
	);
	if (!selected) return null;
	const choices: Record<string, string> = {
		protocol:
			"Compare successful TCP with the failed TLS exchange, then correct only scheme in case.json to the owned plain-HTTP service.",
		deadline:
			"Compare the listener and successful TCP with the timed-out HTTP requests, then correct only responseMode in case.json.",
		address:
			"Compare the working loopback HTTP observation with the refused selected address, then correct only targetAddress in case.json. The studio challenge continues this attempt with the two-fault sequence in README.md.",
		port: "Compare the reserved non-listening port with the actual owned HTTP port, then correct only targetPort in case.json.",
		status: "Retain HTTP 500 beside curl status 0 and the successful TCP observation, then correct only httpStatus in case.json."
	};
	return [
		"Use an ordinary account in an owned Linux lab or WSL environment with Python 3.10+, Bash, iproute2, curl, OpenBSD netcat and GNU timeout. Python programming is optional.",
		"The fixture chooses and owns IPv4 loopback endpoints. It reads local configuration and preserves failed statuses; a same-machine target check does not measure a second-machine path.",
		`Read the complete shared README.md, then cd ${
			role
		}. Keep main.py, diagnostics_lab.py, diagnose_reachability.sh, case.json and network-notes.md together.`,
		"python3 main.py --report first-observation.json",
		choices[selected.kind],
		"python3 main.py --report corrected-observation.json",
		"python3 main.py --alternate --report changed-case.json",
		"A normal collection can exit 0 with complete=false. Read all seven diagnostic sections, HTTP status and owned token, the independent raw control and the first failing layer.",
		"Use fresh report names. Record predictions, exact failures, one-field changes, rejected alternatives and cleanup. Check hostUnchanged, sourceUnchanged, worker reaping, socket/reservation closure and temporary workspace removal.",
		"Keep starter and reference attempts separate; notebook completion requires the actual observed evidence and explanation."
	];
}
