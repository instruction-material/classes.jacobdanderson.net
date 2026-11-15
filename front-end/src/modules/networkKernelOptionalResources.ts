export const networkKernelOptionalRevision =
	"033893724fbae7a81100cad24a4c7386b8fef6d7";

export const networkKernelOptionalPacks = [
	{
		pack: "NS-15-unit-7-linux-interface-and-route-management-supplemental-2",
		revision: "033893724fbae7a81100cad24a4c7386b8fef6d7",
		family: "routing",
		kind: "snat-source",
		exposure: false,
		roleFiles: [
			"network-notes.md",
			"create_nat_lab.sh",
			"lab_runtime.py",
			"lab-rules.sh"
		],
		coreItemId:
			"network-systems-unit-7-linux-interface-and-route-management-supplemental-linux-interface-transfer-practice",
		notebookItemId: undefined
	},
	{
		pack: "NS-16-unit-7-linux-interface-and-route-management-supplemental-3",
		revision: "033893724fbae7a81100cad24a4c7386b8fef6d7",
		family: "routing",
		kind: "dnat-port",
		exposure: false,
		roleFiles: [
			"network-notes.md",
			"create_nat_lab.sh",
			"lab_runtime.py",
			"lab-rules.sh"
		],
		coreItemId:
			"network-systems-unit-7-linux-interface-and-route-management-supplemental-linux-interface-extension-practice",
		notebookItemId: undefined
	},
	{
		pack: "NS-25-unit-12-secure-exposure-of-services-supplemental-2",
		revision: "033893724fbae7a81100cad24a4c7386b8fef6d7",
		family: "routing",
		kind: "exposure-bypass",
		exposure: true,
		roleFiles: [
			"network-notes.md",
			"create_nat_lab.sh",
			"lab_runtime.py",
			"lab-rules.sh"
		],
		coreItemId:
			"network-systems-unit-12-secure-exposure-of-services-supplemental-secure-exposure-transfer-practice",
		notebookItemId: undefined
	},
	{
		pack: "NS-26-unit-12-secure-exposure-of-services-supplemental-3",
		revision: "033893724fbae7a81100cad24a4c7386b8fef6d7",
		family: "routing",
		kind: "exposure-port",
		exposure: true,
		roleFiles: [
			"network-notes.md",
			"create_nat_lab.sh",
			"lab_runtime.py",
			"lab-rules.sh"
		],
		coreItemId:
			"network-systems-unit-12-secure-exposure-of-services-supplemental-secure-exposure-extension-practice",
		notebookItemId: undefined
	},
	{
		pack: "NS-21-unit-10-packet-capture-and-deep-inspection-supplemental-2",
		revision: "033893724fbae7a81100cad24a4c7386b8fef6d7",
		family: "capture",
		kind: "capture-bound",
		exposure: false,
		roleFiles: [
			"network-notes.md",
			"capture_http.sh",
			"capture_runtime.py",
			"capture-options.sh"
		],
		coreItemId:
			"network-systems-unit-10-packet-capture-and-deep-inspection-supplemental-packet-capture-transfer-practice",
		notebookItemId: undefined
	},
	{
		pack: "NS-22-unit-10-packet-capture-and-deep-inspection-supplemental-3",
		revision: "033893724fbae7a81100cad24a4c7386b8fef6d7",
		family: "capture",
		kind: "capture-selection",
		exposure: false,
		roleFiles: [
			"network-notes.md",
			"capture_http.sh",
			"capture_runtime.py",
			"capture-options.sh"
		],
		coreItemId:
			"network-systems-unit-10-packet-capture-and-deep-inspection-supplemental-packet-capture-extension-practice",
		notebookItemId: undefined
	}
] as const;

export function networkKernelOptionalInstructions(pack: string, role: string) {
	const selected = networkKernelOptionalPacks.find(
		item => item.pack === pack
	);
	if (!selected) return null;
	const capture = selected.family === "capture";
	const launcher = capture ? "capture_http.sh" : "create_nat_lab.sh";
	const exposure = selected.exposure ? " --exposure-policy" : "";
	const task: Record<string, string> = {
		"snat-source":
			"Retain the successful but untranslated first requests. Correct only the SNAT source-prefix match in lab-rules.sh using the actual client subnet; compare reported peers.",
		"dnat-port":
			"Retain the failed mapped request beside working routed requests. Correct only the DNAT destination port in lab-rules.sh to the actual owned server listener.",
		"exposure-bypass":
			"Retain the direct-path bypass under the first policy. Restore the original destination/port condition in the filter case of lab-rules.sh and compare fresh mapped/direct requests.",
		"exposure-port":
			"Retain the legitimate mapped request denied by the first policy. Correct only its packet destination-port match after DNAT; keep the separate original tuple condition.",
		"capture-bound":
			"Preserve the two-packet first report and PCAP while comparing actual successful HTTP requests. Change only packetLimit in capture-options.sh; compare complete evidence at 64 and 32.",
		"capture-selection":
			"Preserve the broad first capture including the second owned listener. Change only filterPort in capture-options.sh and compare default and --reverse request order."
	};
	return [
		`Use an owned disposable Linux VM with root access, console access and a snapshot. Python 3.10+, iproute2, iptables and util-linux are required, plus ${
			capture ? "tcpdump." : "curl."
		} Python programming is optional.`,
		`Read the shared README.md, then cd ${
			role
		}. Keep all role files together and preserve the supplied apparatus.`,
		`sudo bash ${launcher}${exposure} --output first-observations.json`,
		task[selected.kind],
		`sudo bash ${launcher}${exposure} --output corrected-observations.json`,
		capture
			? "A zero launcher status can retain complete=false for an insufficient or broad capture. Reconcile the actual request bytes, PCAP and capture command; retain errors and cleanup evidence."
			: "A zero launcher status means the owned experiment ran; an incomplete task still has lab.complete=false. Retain the first report, actual errors and cleanup evidence.",
		capture
			? "Compare numeric endpoints, the exact invocation, packet bytes, request/response identities and both child-reaping fields. The owned capture uses a private network namespace."
			: selected.exposure
				? "Compare both pre-policy baselines, fresh mapped/direct requests, private filter counters and restoration, worker reaping and namespace removal."
				: "Compare every route/translation stage, actual HTTP peers, kernel rules, mapping removal, worker reaping and namespace removal.",
		"Use a new report filename for each observation. Record predictions, first failure, the single changed choice, evidence and limits in network-notes.md. This optional attempt and its reference remain separate from the core project."
	];
}
