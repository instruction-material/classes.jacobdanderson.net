import type { PythonIdeFile } from "@/modules/pythonIde";
import { networkDnsOptionalInstructions } from "./networkDnsOptionalResources";
import { networkFirewallOptionalInstructions } from "./networkFirewallOptionalResources";
import { networkCourseResource } from "./networkProjectResources";

export function networkBuildInstructions(files: PythonIdeFile[], url: string) {
	const selected = networkCourseResource(url);
	if (!selected) return null;
	const { role, definition } = selected;
	const setupContext =
		definition.pack === "NS-01-ns0-setup-and-tooling-supplemental-2";
	const setupArguments =
		definition.pack === "NS-02-ns0-setup-and-tooling-supplemental-3";
	const setup = setupContext || setupArguments;
	const transportTcp =
		definition.pack ===
		"NS-03-unit-1-the-network-stack-in-plain-english-supplemental-2";
	const transportUdp =
		definition.pack ===
		"NS-04-unit-1-the-network-stack-in-plain-english-supplemental-3";
	const transport = transportTcp || transportUdp;
	const inventoryUdp =
		definition.pack ===
		"NS-09-unit-4-ports-and-listening-services-supplemental-2";
	const inventoryTcp =
		definition.pack ===
		"NS-10-unit-4-ports-and-listening-services-supplemental-3";
	const socketInventory = inventoryUdp || inventoryTcp;
	const capstone = definition.pack === "NS-03-network-systems-lab-17";
	const topology = definition.pack === "NS6-Router-NAT-Topology-Lab";
	const capture = definition.pack === "NS5-Tcpdump-HTTP-Capture";
	const firewallOptional = networkFirewallOptionalInstructions(
		definition.pack,
		role
	);
	const firewall =
		definition.pack === "NS3-UFW-Web-Server-Policy" ||
		Boolean(firewallOptional);
	const reachability =
		definition.pack === "NS2-Local-vs-Remote-Reachability-Diagnosis";
	const listeners = definition.pack === "NS1-Listening-Services-Map";
	const resolution =
		definition.pack === "NS4-IPv4-vs-IPv6-Resolution-Comparison";
	const ipv6 = [
		"NS-08-unit-8-ipv6-in-practice",
		"NS-17-unit-8-ipv6-in-practice-supplemental-2",
		"NS-18-unit-8-ipv6-in-practice-supplemental-3"
	].includes(definition.pack);
	const applications = [
		"NS-09-unit-11-common-application-protocols",
		"NS-23-unit-11-common-application-protocols-supplemental-2",
		"NS-24-unit-11-common-application-protocols-supplemental-3"
	].includes(definition.pack);
	const linkRouting = [
		"NS-07-unit-3-switches-routers-nat-and-the-internet-edge",
		"NS-07-unit-3-switches-routers-nat-and-the-internet-edge-supplemental-2",
		"NS-08-unit-3-switches-routers-nat-and-the-internet-edge-supplemental-3"
	].includes(definition.pack);
	const namingCases: Record<string, string> = {
		"NS-06-unit-2-addresses-and-naming":
			"Repeat with python3 main.py --lookup 127.0.0.1, then with --network 192.0.2.65/26. Compare system name lookup, the actual IPv4 endpoint and the separate prefix calculation.",
		"NS-05-unit-2-addresses-and-naming-supplemental-2":
			"Compare the supplied /31 with python3 main.py --network 192.0.2.1/32 --candidates 192.0.2.0,192.0.2.1,192.0.2.2. Explain membership and the point-to-point /31 exception without claiming that an interface was reconfigured.",
		"NS-06-unit-2-addresses-and-naming-supplemental-3":
			"Repeat with python3 main.py --lookup 127.0.0.1. Compare resolver families, actual listener ownership and the IPv6 probe. The IPv6 documentation-prefix table is a separate calculation, not proof of DNS or internet reachability."
	};
	const lines = setup
		? [
				"Save and download the ZIP. Extract it in an owned Linux lab using an ordinary non-root account, Python3.10+, /bin/sh and /bin/bash.",
				"The browser edits and saves the configuration and notebooks. Run the actual command-context or shell-argument observations in the external Linux terminal."
			]
		: topology || capture || firewall || linkRouting || capstone
			? [
					`Save and download the ZIP. Extract it in an owned disposable Linux VM with root access and the tools listed in README.md. This kernel lab requires ${capture ? "an owned network namespace" : "network and mount namespaces"}.`,
					"The browser edits and saves the source and notebook. Run the selected real network experiment in that external VM; the browser cannot perform these Linux kernel operations."
				]
			: reachability || listeners || resolution
				? [
						"Save and download the ZIP. Extract it in an owned Linux lab or WSL environment with an ordinary account and the tools listed in README.md.",
						"The browser edits and saves the source and notebook. Run the bounded Linux observations in that external environment; the browser does not execute the system commands."
					]
				: [
						"Save and download the ZIP. Extract it in an owned Linux lab or WSL environment with an ordinary account, Python3.10+ and the tools listed in README.md.",
						"The browser edits and saves the source and notebook. Run the real socket experiments in that external Linux terminal; browser Python does not provide these Linux observations."
					];
	if (
		!files.some(file => file.name === "README.md") ||
		definition.roleFiles.some(
			name => !files.some(file => file.name === `${role}/${name}`)
		)
	) {
		return [
			...lines,
			"The selected lab is incomplete. Restore all required role files and README.md before following the guide."
		];
	}

	const dnsOptional = networkDnsOptionalInstructions(definition.pack, role);
	if (dnsOptional) return [...lines, ...dnsOptional];
	if (firewallOptional) return [...lines, ...firewallOptional];

	if (socketInventory) {
		return [
			...lines,
			`Read README.md, then cd ${role}. Keep main.py, listener_lab.py, case.json, network-notes.md and edge-cases.md together. Run python3 main.py --report first-observation.json in an ordinary Linux account with Python 3.10+ and ss; use a fresh filename.`,
			inventoryUdp
				? "Compare the same owned UDP inode in listening-only and all-socket inventories before and after connect, retaining the observation before application traffic. Select inventory_view after recording a prediction. A default UDP peer is not a TCP handshake or an application reply."
				: "Compare the parent and child PID/descriptor links, namespace and inode with one listening row. Select group_by after recording a prediction. Follow the remaining child owner after the parent closes, then reconcile the local reply, worker exit and final listening selection.",
			"Change the ASCII token and run again with a new report filename. Compare actual received request/reply bytes. Exit 2 marks an unfinished choice, exit 0 a matching choice, exit 1 a revision or execution error, and exit 64 a pre-experiment refusal. Save the case and complete network-notes.md and edge-cases.md independently of the runtime result.",
			"These are distinct optional activities after the required Unit 4 service map. Python programming is optional. Preserve earlier work and separate learner/reference attempts. The browser edits and exports these files; the native program observes its own loopback sockets without changing services, routes or policy."
		];
	}
	if (transport) {
		return [
			...lines,
			`Read README.md, then cd ${role}. Keep main.py, transport_lab.py, case.json, network-notes.md and edge-cases.md together. Run python3 main.py --report first-observation.json using an ordinary non-root Linux account and a fresh report filename.`,
			transportTcp
				? "Predict how a one-byte first read relates to a four-byte length prefix. Compare firstReadHex, all readCalls, wireHex, applicationInputHex, EOF and decoded records. Change only the case.json framing setting after retaining the first observation; length counts UTF-8 bytes rather than visible characters. Socket reads and send calls do not establish packet boundaries."
				: "Draw the owned UDP queue before and after the diagnostic receive. Match its requested flags, returned truncation flag and prefix to subsequent consumer reads. Change only probe_behavior after retaining the consuming baseline. A truncated peek can leave the complete datagram available; the earlier consuming diagnostic accounts for the missing consumer record.",
			"Use python3 main.py --report corrected-observation.json after the case edit, then predict and run python3 main.py --alternate --report alternate-observation.json. Retain separate reports and the actual endpoint, PID, thread and raw byte observations for each trial.",
			"Check allSocketsClosed, allThreadsJoined, sourceUnchanged and parentUnchanged. Optional strace evidence observes application/kernel calls in this owned IPv4 loopback trial; it is not a packet capture or evidence of remote reachability.",
			"Python programming is optional. These optional activities have distinct questions after the required Unit 1 transport project. The case configuration, actual observations and complete notebook explanation are their deliverables. Keep earlier work and separate learner/reference attempts."
		];
	}
	if (setup) {
		return [
			...lines,
			`Read README.md, then cd ${
				role
			}. Keep main.py, setup_lab.py, case.json, network-notes.md and edge-cases.md together. Run python3 main.py --output first-observation.json with a fresh output filename.`,
			setupContext
				? "Predict command selection and working directory separately. Preserve the unfinished case, change only first_tool to beta and use tool-corrected.json, then change work_area to second and use both-corrected.json. Match the resolved path, worker tag, PID/UID, cwd, interpreter and namespace observations. The bare-name missing-PATH case records an actual launch error, while the absolute owned launcher remains executable."
				: "Compare the actual direct, quoted, unquoted and configured argument vectors. Change only quote_arguments from false to true after predicting the received strings. Keep field splitting, filename expansion and the literal semicolon data distinct; the fixed template does not evaluate variable text as a new command.",
			"Repeat python3 main.py --alternate --output alternate-observation.json and compare its own command name, private paths and inputs. Keep both notebooks and all prior reports. Check target reaping, removal of the private root, unchanged source and the named parent-field comparison.",
			"Python programming is optional. These are separate optional investigations after the required setup project. Configuration, actual observations and a complete explanation are their deliverables; each learner and reference attempt remains separate."
		];
	}
	if (capstone) {
		return [
			...lines,
			`Read README.md, then cd ${
				role
			}. Keep main.py, capstone_lab.py, case.json, network-notes.md and edge-cases.md together. Run sudo python3 main.py --output ./first-observation in that disposable Linux VM. Python3.10+, iproute2, iptables, util-linux, curl, dig, tcpdump and dnsmasq are required.`,
			"The starter contains two deliberate case.json faults. Preserve the first failed attempt, correct only the IPv4 route and use --output ./route-corrected, then correct the loopback upstream port and use --output ./both-corrected. Every output folder must be new.",
			"Repeat with sudo python3 main.py --alternate --output ./alternate-observation. Match actual A/AAAA answers to both family destinations, route and listener evidence, HTTP status and response token, denied controls and the bounded capture.pcap. Preserve both independent first-failing-layer diagnoses.",
			"Check allWorkersReaped, the empty remaining namespace list and the actual parent before/after comparison in receipt.json. Keep raw evidence and limits in network-notes.md and edge-cases.md. The Guided Example reopens the matching core project; the reference and optional challenge have separate saved attempts.",
			"Python programming is optional. The required task is case configuration, predictions, real Linux observations and a complete operations runbook. Keep the supplied fixture unchanged."
		];
	}
	if (linkRouting) {
		return [
			...lines,
			`Read README.md, then cd ${role}. Keep main.py, link_routing_lab.py, network-notes.md and edge-cases.md together. Run sudo python3 main.py in the disposable Linux VM. Python3.10+, iproute2, iptables, util-linux, sysctl and curl are required.`,
			"Repeat with sudo python3 main.py --alternate --service-port 8087 --mapped-port 18087. Predict the private prefixes, gateways and translated endpoints before reading each run. Match its own token, owned PID/UID, numeric client/server endpoints, raw HTTP and kernel state.",
			definition.pack ===
			"NS-07-unit-3-switches-routers-nat-and-the-internet-edge-supplemental-2"
				? "Compare the client gateway removal and restoration, then the missing server return route and its restoration. Preserve both route lookups and new requests. This task adds no NAT; the mapped-port option has no mapping role here."
				: definition.pack ===
					  "NS-08-unit-3-switches-routers-nat-and-the-internet-edge-supplemental-3"
					? "Compare routed, source-translated and destination-mapped endpoint views. After mapping removal test a fresh connection, then retain the successful direct request. Existing connection state is not tested by those new requests."
					: "Compare the bridge with IP forwarding disabled, its port-down failure and restoration, then routing with forwarding off/on and source translation. Match actual learned MAC addresses to bridge FDB ports. The notebook reopens the same saved Unit 3 attempt; the mapped-port option is unused by this core task.",
			"Label edge-cases.md as constructed reasoning material. Confirm the owned worker was stopped and reaped, its listener is absent, private namespaces and links were removed, and hostUnchanged is true. This experiment measures private IPv4 mechanisms, not public Internet access, IPv6 or restrictive filtering policy.",
			"Python programming is optional. The required work is prediction, actual observation and a complete notebook explanation. Unit 7 later edits NS6 forwarding/NAT commands; Unit 12 continues that later saved attempt for exposure policy. Keep the reference separate."
		];
	}
	if (applications) {
		return [
			...lines,
			`Read README.md, then cd ${role}. Keep main.py, application_lab.py, network-notes.md and application-cases.md together. Run python3 main.py in the external Linux terminal with an ordinary account, Python3.10 or newer, curl and ss.`,
			'Repeat with python3 main.py --changed --message "Changed application observation". Retain exact request/response bytes, numeric endpoint and peer, owner PID/UID, the unique response token, curl corroboration and the held-port refusal. Use each run\'s own identity.',
			definition.pack ===
			"NS-23-unit-11-common-application-protocols-supplemental-2"
				? "Keep the initial representation beside the matching-validator 304, compare the stale-validator 200, and retain the redirect and explicitly requested destination as separate exchanges. No browser cache or freshness clock is measured."
				: definition.pack ===
					  "NS-24-unit-11-common-application-protocols-supplemental-3"
					? "Compare 503/Retry-After, 404 and 405/Allow, preserve the four binary octets, and distinguish the changed Host field from the unchanged numeric destination. No automatic recovery or retry is demonstrated."
					: "Compare GET and HEAD content, missing-resource 404, unsupported-method 405/Allow and planned 503/Retry-After with the held-port transport refusal. The notebook card reopens the same saved attempt.",
			"Label application-cases.md as constructed reasoning material. The actual program measures HTTP/1.1 over owned loopback TCP; it does not query DNS, establish TLS or SSH, send SMTP mail, or change system configuration. Verify the owned worker was reaped and its final listener is absent.",
			"Python programming is optional. Complete only analyze(evidence) when choosing supplemental code practice. Actual observations and the complete notebook explanation remain the task; the reference stays separate."
		];
	}
	if (ipv6) {
		return [
			...lines,
			`Read README.md, then cd ${role}. Keep main.py, ipv6_lab.py, network-notes.md and ipv6-practice-case.md together. Run python3 main.py in the external Linux terminal with an ordinary account.`,
			"Compare python3 main.py --binding v6-only with python3 main.py --binding paired using fresh report names. Retain actual IPv6 route/address/neighbor snapshots, the owned PID and UID, separate family listeners, controlled IPv4 refusal, per-run HTTP response token and worker cleanup.",
			definition.pack === "NS-17-unit-8-ipv6-in-practice-supplemental-2"
				? "Calculate the /126 table first. Repeat with --prefix 2001:db8::1/127 --candidates 2001:db8::,2001:db8::1,2001:db8::2, then --prefix 2001:db8::1/128. Prefix membership and offsets are calculations, not address assignment or reachability."
				: definition.pack ===
					  "NS-18-unit-8-ipv6-in-practice-supplemental-3"
					? "Explain why IPV6_V6ONLY=1 remains true while the second IPv4 socket provides IPv4 service. These are two loopback sockets, not one wildcard or mapped-address experiment. Compare the supplied neighbor and family-policy cases separately."
					: "Complete the core notebook and all three supplied cases after the two binding comparisons. Reuse the earlier actual DNS/NSS evidence and retain the issuing host, namespace and scope of every claim. The notebook card reopens this same saved attempt.",
			"Label ipv6-practice-case.md as constructed reasoning evidence. The loopback program does not measure active Neighbor Discovery, Router Advertisements, DHCPv6, DNS family selection, Internet IPv6 or firewall policy.",
			"Python programming is optional. Complete only analyze(evidence) when choosing supplemental code practice; actual networking observations and the complete explanation remain the task. The reference stays separate from the saved attempt."
		];
	}
	if (listeners) {
		return [
			...lines,
			`Read README.md, then cd ${role}. Run bash inventory_services.sh 8080 for an owned example on that port; repeat without an argument for the account's broader view. The script prints to standard output and never opens a report file.`,
			"Compare the actual TCP LISTEN and UDP UNCONN rows, bind addresses, selected namespace and visible process ownership. Stop only the owned examples and repeat. An empty lsof selection can return status 1; retain raw stderr and the other observations before interpreting it.",
			"Bash programming is optional. Complete only the inventory-sections block when choosing the extension; equivalent manual observations, evidence-backed service classifications and the notebook meet the core goal. The reference remains separate from the saved learner attempt.",
			"A port number or missing owner text is not an application identity. A passive local inventory does not prove another machine can reach a service. The operations notebook reopens the same saved attempt."
		];
	}
	if (resolution) {
		return [
			...lines,
			`Read README.md, then cd ${role}. Run bash compare_resolution.sh example.com for the configured resolver, or use an authorized DNS server and port. The optional owned fixture in README.md uses a high port without changing system name-service files.`,
			"For the optional fixture, compare dual.course.test, v4.course.test, alias.course.test, missing.course.test and localhost with server 127.0.0.1 and the selected high port. Retain DNS header status, typed answers, TTL, responding server and command status separately.",
			"Bash programming is optional. Complete only the system-lookup block when choosing the extension; equivalent getent/NSS observations and their explanation meet the core goal. An explicit dig server does not redirect getent or change system configuration.",
			"Compare NODATA, NXDOMAIN, alias data and transport failure after stopping only the owned resolver. An absent AAAA answer does not establish an IPv4-only service, application readiness or a chosen client family. The notebook reopens this saved attempt; the reference stays separate."
		];
	}
	if (reachability) {
		return [
			...lines,
			`Read README.md, then cd ${role}. Run bash diagnose_reachability.sh 127.0.0.1 8080 http for an owned service at that endpoint; replace the host, port and scheme with the actual authorized target.`,
			"Record the exact command, raw output and status for the listener, loopback HTTP, destination HTTP and raw TCP observations. Compare a changed port and a stopped/restored owned service. IPv6 literals are entered without brackets; both HTTP observations use the selected http or https scheme.",
			"Bash programming is optional. Complete only the route-evidence block when choosing that extension; equivalent manual command observations and the notebook meet the core goal. The reference is separate from the saved learner attempt.",
			"Record the issuing machine and label an actual comparison from another owned machine separately. Without that comparison, leave remote reachability unmeasured. The script does not inspect privileged firewall policy or alter configuration. The operations notebook reopens this same saved attempt."
		];
	}
	if (firewall) {
		return [
			...lines,
			`Read README.md, then cd ${role}. Complete only the two cases in policy-rules.sh. Run sudo bash apply_web_policy.sh --output policy-observations.json with a new filename. Use an owned disposable VM with console access.`,
			"Compare with sudo bash apply_web_policy.sh --management-port 22022 --output changed-port.json, then repeat with --reverse and another new output. The apparatus owns private UFW configuration and its client/services; the management marker is not an SSH daemon.",
			"Keep predictions, actual fresh management/web/denied requests, numbered rules, kernel counters and prior-state restoration in network-notes.md. Confirm the blocked listener stays live and all three services return after rollback. The notebook reopens this saved attempt; the reference remains separate.",
			"Python programming is optional. Keep firewall_runtime.py unchanged; the two UFW choices, actual command observations and notebook explanation are required."
		];
	}
	if (capture) {
		return [
			...lines,
			`Read README.md, then cd ${role}. Complete the count and filter choices in capture-options.sh. Run sudo bash capture_http.sh --output capture-observations.json with a new output filename.`,
			"Compare with sudo bash capture_http.sh --reverse --output reversed-capture-observations.json. The supplied apparatus starts its own services, captures only their isolated loopback traffic, retains the pcap and actual HTTP evidence, and stops both processes within a bounded run.",
			"Record the real source/service ports, SYN and SYN/ACK, HTTP request/response bytes, selected versus noise flows, packet count and cleanup in network-notes.md. Its operations-notebook card reopens this same saved attempt; the reference remains separate.",
			"Python programming is optional. Keep the supplied capture_runtime.py apparatus unchanged; the capture choices, command observations and notebook explanation are the required work."
		];
	}
	if (topology) {
		return [
			...lines,
			`Read README.md, then cd ${role}. For Unit7, complete the first three cases in lab-rules.sh and run sudo bash create_nat_lab.sh --output routing-observations.json.`,
			"Unit12 continues the same saved Unit7 attempt. Complete the fourth filter case and run sudo bash create_nat_lab.sh --exposure-policy --output exposure-observations.json. The policy pass requires actual rule counters, mapped success, fresh direct refusal, and direct restoration after removing only the filter.",
			"Keep predictions, the actual reports, original and translated endpoints, rule counters and cleanup evidence in network-notes.md. Both units' notebook cards reopen this same attempt; the reference remains separate.",
			"Python programming is optional. Keep the prewritten lab_runtime.py apparatus unchanged; the shell cases and actual command observations are required for their respective units."
		];
	}
	return [
		...lines,
		`Read README.md, then cd ${role}. Confirm uname -s, id and python3 --version in that terminal. Run python3 main.py with the supplied instrumentation unchanged.`,
		"Complete network-notes.md with predictions, actual commands, endpoint/process identities, changed cases and cleanup. Its operations-notebook card continues this same saved attempt.",

		namingCases[definition.pack] ??
			(definition.pack === "NS-04-ns0-setup-and-tooling"
				? "Repeat with python3 main.py --message 'Second local observation'. Compare the kernel route, actual listener PID and local HTTP response. Loopback success does not establish remote connectivity or DNS correctness."
				: "Compare the normal transport run with python3 main.py --udp-buffer 2 and python3 main.py --without-newline. Distinguish TCP EOF, application framing, empty UDP datagrams and truncation using the actual recorded bytes."),
		"Python programming is optional supplemental practice: complete only analyze(evidence) in main.py if choosing that extension. The notebook and command observations remain the required work."
	];
}
