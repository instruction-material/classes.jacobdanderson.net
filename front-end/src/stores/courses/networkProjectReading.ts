import type { RawCourse } from "./types";
import namingReading2 from "../../assets/course-guides/network-addresses-families.md?raw";
import namingReading1 from "../../assets/course-guides/network-addresses-transfer.md?raw";
import namingReading0 from "../../assets/course-guides/network-addresses.md?raw";
import applicationReading2 from "../../assets/course-guides/network-application-boundaries.md?raw";
import applicationReading1 from "../../assets/course-guides/network-application-conditions.md?raw";
import applicationReading0 from "../../assets/course-guides/network-application-responses.md?raw";
import archiveReading2 from "../../assets/course-guides/network-archive-expansion-claims.md?raw";
import archiveReading0 from "../../assets/course-guides/network-archive-expansion-plan.md?raw";
import archiveReading1 from "../../assets/course-guides/network-archive-expansion-transfer.md?raw";
import archiveReading3 from "../../assets/course-guides/network-archive-exposure-core.md?raw";
import archiveReading4 from "../../assets/course-guides/network-archive-exposure-families.md?raw";
import archiveReading5 from "../../assets/course-guides/network-archive-exposure-policy.md?raw";
import capstoneIdentityReading from "../../assets/course-guides/network-capstone-identity.md?raw";
import capstonePrefixReading from "../../assets/course-guides/network-capstone-prefix.md?raw";
import kernelOptionalReading4 from "../../assets/course-guides/network-capture-evidence-transfer.md?raw";
import kernelOptionalReading5 from "../../assets/course-guides/network-capture-selection-extension.md?raw";
import diagnosticsReading2 from "../../assets/course-guides/network-diagnostics-address.md?raw";
import diagnosticsReading1 from "../../assets/course-guides/network-diagnostics-deadline.md?raw";
import diagnosticsReading3 from "../../assets/course-guides/network-diagnostics-port.md?raw";
import diagnosticsReading0 from "../../assets/course-guides/network-diagnostics-protocol.md?raw";
import diagnosticsReading4 from "../../assets/course-guides/network-diagnostics-status.md?raw";
import diagnosticsContinuation from "../../assets/course-guides/network-diagnostics-studio-continuation.md?raw";
import dnsAliasReading from "../../assets/course-guides/network-dns-alias-transfer.md?raw";
import dnsTransportReading from "../../assets/course-guides/network-dns-transport-extension.md?raw";
import kernelOptionalReading2 from "../../assets/course-guides/network-exposure-bypass-transfer.md?raw";
import kernelOptionalReading3 from "../../assets/course-guides/network-exposure-translated-port-extension.md?raw";
import firewallReading from "../../assets/course-guides/network-firewall-policy.md?raw";
import firewallPortReading from "../../assets/course-guides/network-firewall-port-transfer.md?raw";

import firewallProfileReading from "../../assets/course-guides/network-firewall-profile-extension.md?raw";
import captureReading from "../../assets/course-guides/network-http-capture.md?raw";
import inventoryTcpReading from "../../assets/course-guides/network-inventory-tcp.md?raw";

import inventoryUdpReading from "../../assets/course-guides/network-inventory-udp.md?raw";
import ipv6Reading0 from "../../assets/course-guides/network-ipv6-diagnostics.md?raw";
import ipv6Reading2 from "../../assets/course-guides/network-ipv6-family-extension.md?raw";

import ipv6Reading1 from "../../assets/course-guides/network-ipv6-prefix-transfer.md?raw";
import linkRoutingReading2 from "../../assets/course-guides/network-link-routing-mapping.md?raw";
import linkRoutingReading0 from "../../assets/course-guides/network-link-routing-observations.md?raw";
import linkRoutingReading1 from "../../assets/course-guides/network-link-routing-paths.md?raw";
import listenerReading from "../../assets/course-guides/network-listening-services.md?raw";
import capstoneReading from "../../assets/course-guides/network-operations-capstone.md?raw";
import reachabilityReading from "../../assets/course-guides/network-reachability.md?raw";
import resolutionReading from "../../assets/course-guides/network-resolution-comparison.md?raw";
import kernelOptionalReading1 from "../../assets/course-guides/network-routing-dnat-extension.md?raw";
import topologyReading from "../../assets/course-guides/network-routing-exposure.md?raw";
import kernelOptionalReading0 from "../../assets/course-guides/network-routing-snat-transfer.md?raw";
import setupArgumentsReading from "../../assets/course-guides/network-setup-arguments.md?raw";
import setupContextReading from "../../assets/course-guides/network-setup-context.md?raw";
import setupReading from "../../assets/course-guides/network-setup.md?raw";

import transportTcpReading from "../../assets/course-guides/network-transport-tcp.md?raw";
import transportUdpReading from "../../assets/course-guides/network-transport-udp.md?raw";

import transportReading from "../../assets/course-guides/network-transport.md?raw";
import {
	networkCourseResource,
	networkPinnedCourseUrl
} from "../../modules/networkProjectResources";

const readings: Record<string, string> = {
	"NS-10-ns13-expansion-ideas-and-next-steps": archiveReading0,
	"NS-27-ns13-expansion-ideas-and-next-steps-supplemental-2": archiveReading1,
	"NS-28-ns13-expansion-ideas-and-next-steps-supplemental-3": archiveReading2,
	"NS-02-network-systems-lab-16": archiveReading3,
	"NS-31-applied-studio-16-network-systems-lab-16-supplemental-2":
		archiveReading4,
	"NS-32-applied-studio-16-network-systems-lab-16-supplemental-3":
		archiveReading5,
	"NS-13-unit-6-core-diagnostics-supplemental-2": diagnosticsReading0,
	"NS-14-unit-6-core-diagnostics-supplemental-3": diagnosticsReading1,
	"NS-01-network-systems-lab-15": diagnosticsReading2,
	"NS-29-applied-studio-15-network-systems-lab-15-supplemental-2":
		diagnosticsReading3,
	"NS-30-applied-studio-15-network-systems-lab-15-supplemental-3":
		diagnosticsReading4,

	"NS-15-unit-7-linux-interface-and-route-management-supplemental-2":
		kernelOptionalReading0,
	"NS-16-unit-7-linux-interface-and-route-management-supplemental-3":
		kernelOptionalReading1,
	"NS-25-unit-12-secure-exposure-of-services-supplemental-2":
		kernelOptionalReading2,
	"NS-26-unit-12-secure-exposure-of-services-supplemental-3":
		kernelOptionalReading3,
	"NS-21-unit-10-packet-capture-and-deep-inspection-supplemental-2":
		kernelOptionalReading4,
	"NS-22-unit-10-packet-capture-and-deep-inspection-supplemental-3":
		kernelOptionalReading5,
	"NS-19-unit-9-firewalls-and-host-policy-supplemental-2":
		firewallPortReading,
	"NS-20-unit-9-firewalls-and-host-policy-supplemental-3":
		firewallProfileReading,
	"NS-11-unit-5-dns-and-name-resolution-supplemental-2": dnsAliasReading,
	"NS-12-unit-5-dns-and-name-resolution-supplemental-3": dnsTransportReading,
	"NS-09-unit-4-ports-and-listening-services-supplemental-2":
		inventoryUdpReading,
	"NS-10-unit-4-ports-and-listening-services-supplemental-3":
		inventoryTcpReading,
	"NS-03-unit-1-the-network-stack-in-plain-english-supplemental-2":
		transportTcpReading,
	"NS-04-unit-1-the-network-stack-in-plain-english-supplemental-3":
		transportUdpReading,

	"NS-01-ns0-setup-and-tooling-supplemental-2": setupContextReading,
	"NS-02-ns0-setup-and-tooling-supplemental-3": setupArgumentsReading,
	"NS-03-network-systems-lab-17": capstoneReading,
	"NS-33-applied-studio-17-network-systems-lab-17-supplemental-2":
		capstonePrefixReading,
	"NS-34-applied-studio-17-network-systems-lab-17-supplemental-3":
		capstoneIdentityReading,
	"NS-07-unit-3-switches-routers-nat-and-the-internet-edge":
		linkRoutingReading0,
	"NS-07-unit-3-switches-routers-nat-and-the-internet-edge-supplemental-2":
		linkRoutingReading1,
	"NS-08-unit-3-switches-routers-nat-and-the-internet-edge-supplemental-3":
		linkRoutingReading2,
	"NS-09-unit-11-common-application-protocols": applicationReading0,
	"NS-23-unit-11-common-application-protocols-supplemental-2":
		applicationReading1,
	"NS-24-unit-11-common-application-protocols-supplemental-3":
		applicationReading2,
	"NS-04-ns0-setup-and-tooling": setupReading,
	"NS-05-unit-1-the-network-stack-in-plain-english": transportReading,
	"NS-06-unit-2-addresses-and-naming": namingReading0,
	"NS-05-unit-2-addresses-and-naming-supplemental-2": namingReading1,
	"NS-06-unit-2-addresses-and-naming-supplemental-3": namingReading2,
	"NS6-Router-NAT-Topology-Lab": topologyReading,
	"NS5-Tcpdump-HTTP-Capture": captureReading,
	"NS3-UFW-Web-Server-Policy": firewallReading,
	"NS2-Local-vs-Remote-Reachability-Diagnosis": reachabilityReading,
	"NS1-Listening-Services-Map": listenerReading,
	"NS4-IPv4-vs-IPv6-Resolution-Comparison": resolutionReading,
	"NS-08-unit-8-ipv6-in-practice": ipv6Reading0,
	"NS-17-unit-8-ipv6-in-practice-supplemental-2": ipv6Reading1,
	"NS-18-unit-8-ipv6-in-practice-supplemental-3": ipv6Reading2
};

export function withNetworkProjectReadings(
	module: RawCourse["modules"][number]
) {
	const decorate = (
		item: RawCourse["modules"][number]["curriculum"][number]
	) => {
		const projectLink = networkPinnedCourseUrl(item.projectLink ?? "");
		const selected = networkCourseResource(projectLink);
		if (!selected) return item;
		const notebook = item.title.startsWith("Operations Notebook:");
		const topology = selected.pack === "NS6-Router-NAT-Topology-Lab";
		const capture = selected.pack === "NS5-Tcpdump-HTTP-Capture";
		const firewall = selected.pack === "NS3-UFW-Web-Server-Policy";
		const reachability =
			selected.pack === "NS2-Local-vs-Remote-Reachability-Diagnosis";
		const listeners = selected.pack === "NS1-Listening-Services-Map";
		const resolution =
			selected.pack === "NS4-IPv4-vs-IPv6-Resolution-Comparison";
		const ipv6Core = selected.pack === "NS-08-unit-8-ipv6-in-practice";
		const applicationCore =
			selected.pack === "NS-09-unit-11-common-application-protocols";
		const linkRoutingCore =
			selected.pack ===
			"NS-07-unit-3-switches-routers-nat-and-the-internet-edge";
		const exposure = topology && module.title.startsWith("Unit 12:");
		const reading = (
			selected.pack === "NS-02-network-systems-lab-16" &&
			/^Extension Challenge:|: Extension Challenge$/.test(item.title)
				? "## Service exposure: before and after\n\nContinue the saved service-exposure attempt. Preserve the wrong-upstream response before comparing it with the baseline after the upstream correction. Record both address families, the requested front endpoint, the application identity and the remaining public-exposure limit in network-notes.md. Use the full core-card guide and imported README.md for setup and complete input inventory."
				: selected.pack === "NS-01-network-systems-lab-15" &&
					  /^Extension Challenge:|: Extension Challenge$/.test(
							item.title
					  )
					? diagnosticsContinuation
					: readings[selected.pack]
		)
			.replace(
				/This replaces the unrelated port-list exercise previously (?:present )?in this folder\./,
				""
			)
			.replace(
				"Start with an already authorized owned service.",
				"Select an already authorized owned service."
			)
			.replace(
				"Review and save the selected role",
				"Save the selected role"
			)
			.replace(
				"addresses should agree in opposite directions.",
				"addresses agree in opposite directions."
			)
			.replace("facts should change", "facts change")
			.replace("should retain", "retains")
			.replace(
				"Flow membership should follow",
				"Check whether flow membership follows"
			)
			.replace(
				/agreed\s+instructor checkpoint/g,
				"agreed review checkpoint"
			)
			.replace(
				"Independent and instructor use",
				"Independent and guided use"
			)
			.replace(
				"before comparing the evidence with an instructor.",
				"before comparing the evidence during a guided review."
			)
			.replace("Keep your edited rules", "Keep the edited rules")
			.replace(
				"For an instructor walkthrough",
				"For a guided walkthrough"
			)
			.trim();
		const applicationNotebook = `## Keep an application-boundary notebook

Opening this notebook reopens the matching core project and preserves the same saved application attempt. Record the issuing host, ordinary UID, namespace, tool versions and purpose. Keep all five imported files together. Predict the five method/path outcomes and the held-port refusal before opening the results. The reference remains a separate saved role.

### Match the actual request, response and owner

For GET /state, HEAD /state, GET /missing, POST /state and GET /unavailable, retain the request line and fields, numeric local/peer endpoints, response status and fields, exact content bytes, run token and owned PID. Reverse the client/server endpoint view to reconcile both ends. Compare HEAD metadata with its actual zero transferred content. Explain the missing resource, Allow field and Retry-After suggestion without treating an HTTP error status as a failed TCP connection. Retain the separate held-port refusal and both curl observations. Repeat with --changed and a different printable --message; keep the two runs' identities distinct.

### Separate protocol boundaries and supplied reasoning

Read application-cases.md as constructed DNS, TLS and SSH material. Identify the earliest unsupported boundary and the next authorized check for each case. Return to the concept reading for SMTP envelope, acceptance and delivery distinctions. This program sends no mail and measures no DNS lookup, TLS negotiation, SSH login or browser cache. Preserve the issuing context of earlier DNS/NSS evidence before using it in a comparison.

### Review the explanation and close the owned experiment

Keep unexpected results and raw errors. Name an observation that would disprove each explanation and a limit that still remains after it. Confirm the owned child was stopped and reaped and that its PID is absent from the final listener query. A Retry-After suggestion does not prove recovery. Python programming is optional; the actual observations and notebook are the core task. For independent work, predict before reading each response. In a guided walkthrough, pause at connection, method, representation, peer identity and application decision. The transfer validator/redirect task and extension content/policy task have separate optional goals.`;
		const linkRoutingNotebook = `## Keep a bridge, routing and translation notebook

Opening this notebook reopens the matching core project and preserves the same saved Unit 3 attempt. Keep the separate reference role apart from that attempt. Record the disposable Linux VM, hostname, UID, namespace identities, tool versions, exact command and purpose. Keep main.py, link_routing_lab.py, network-notes.md, edge-cases.md and README.md together after exporting. Use root access only in that owned VM. Read the full guide and concept explanation before predicting the stages.

### Explain the bridge before the router

Draw the first bridged topology with its two /24 endpoints, MAC addresses and bridge ports. Predict all six default core stages before reading their outcomes. Match actual learned MAC addresses to FDB ports, retain the disabled IP forwarding setting and explain why the first bridged request succeeds. Keep the deliberate server-facing port-down failure and the restored successful request with actual link state. Explain what those controlled results establish and what a timeout alone leaves uncertain.

Draw the second topology with its two links, middle-interface addresses and endpoint gateways. Record outbound and return route lookups, neighbor observations, the forwarding-off failure and the forwarding-on success. Explain why the latter needs routing but no NAT. Then compare the server's original client peer with its source-translated peer. Match the client and server endpoint views to raw HTTP bytes, current run token, owned listener PID and UID, and actual NAT rule. Keep translation separate from a restrictive filtering policy.

### Change the case and close the observation

Repeat with sudo python3 main.py --alternate --service-port 8087 --mapped-port 18087. Predict the new prefixes, gateways and service endpoint first. The mapped port is used by the optional DNAT exercise; supplying it does not add mapping to the core experiment. Preserve each run's own identities and any contrary outcome. Read the supplied Internet-edge cases as constructed reasoning. State the next authorized observation for an upstream translation or policy uncertainty without claiming that this apparatus measured the public Internet, IPv6 or an ISP.

Check worker termination and reaping, absence of the owned listener, removal of private links and namespaces, and the unchanged outer host snapshot. Keep raw errors and name one observation that would disprove each explanation. Python programming is optional; complete analyze(evidence) only for extra summary practice. For independent work, predict each boundary before inspecting the report. In a paced walkthrough, pause at the bridge, gateway, forwarding and translation transitions. The optional gateway/return-route and destination-mapping projects have their own saved attempts. Unit 7 later edits NS6 commands; Unit 12 continues that later attempt with exposure policy.`;
		const ipv6Notebook = `## Keep an independent IPv6 path notebook

Opening this notebook reopens the matching core project and preserves the same saved IPv6 attempt. Keep the issuing host, ordinary account, tool versions and network namespace beside each report. Predict the explicit IPv4 and IPv6 outcomes before running either binding mode. All five imported files belong to this attempt; the reference remains separate.

### Match actual scope, route and owner evidence

Connect the observed ::1 address, the selected IPv6 lo route and the owned listener to the actual child PID and UID. Keep the current neighbor snapshot without calling it a measured Neighbor Discovery exchange. Match each explicit family curl command, bound address, numeric port, response token, request and peer record. In v6-only mode the exclusively held IPv4 control does not listen. In paired mode a second socket supplies IPv4 service while IPV6_V6ONLY remains one. This is not a single wildcard or mapped-address test. Verify child reaping and the final PID-based socket comparison.

### Keep arithmetic, lookup and supplied cases distinct

Explain the /128 membership table separately from interface assignment and application reachability. Reuse the earlier DNS/NSS observations with their selected server and scope. Read all three cases in ipv6-practice-case.md and label those constructed records explicitly. Locate the first unsupported on-link boundary in Case A; distinguish family policy counters from an HTTP response in Case B; identify the missing link-local interface and separate Router Advertisement, address and router information in Case C. None is a change made by the loopback program.

### Review the diagnosis and its limits

Keep unexpected results and the next authorized observation that could disprove each explanation. IPv4 success cannot replace missing IPv6 evidence. Confirm cleanup without changing interfaces, routes, system name service or policy. Python programming is optional; the notebook and actual networking interpretation are the core work. For independent review, predict each boundary before reading its result. In a guided walkthrough, pause at scope, lookup, route, neighbor where relevant, owner, policy and application response. Follow the complete core guide and imported README.md; the optional prefix and paired-service projects have distinct follow-up goals.`;
		const listenerNotebook = `## Preserve a listener ownership notebook

Opening this notebook reopens the matching core project and preserves its saved listener attempt. Record the issuing machine, account, time and network namespace. Predict the owned example's transport, bind address, port and visible process before collecting evidence. Keep the selected port and the broader account view as separate reports so that a filter cannot hide the context needed for a classification.

### Reconcile sockets with visible owners

Match the actual TCP LISTEN row to its owned process. Compare UDP UNCONN separately; UDP can use the same numeric port without being the same transport endpoint. Record PID and file-descriptor observations where this account can see them. Missing owner text can reflect limited visibility. A familiar port number alone does not identify an application, and a wildcard bind alone does not establish an external path or policy allowance.

### Compare the empty view and classify the evidence

Stop only the owned examples and repeat the filtered commands. Preserve lsof's nonzero empty-selection status, its raw stderr and the successful socket query beside the continuing review section. Distinguish an empty view from an error or permission gap. Classify each relevant live row as expected, internal-only or review-needed using the actual owner, bind scope and stated host role. Keep unknown identities explicit. Bash programming is optional: the named collection block is an extension, while equivalent manual observations and the explanation meet the core goal. For independent work, diagram the additional authorized request needed to test another machine's path. During a guided walkthrough, pause at the first TCP row, the UDP comparison, the empty selection and the proposed classification. Confirm cleanup or required restoration and follow the full core guide and imported README.md.`;
		const resolutionNotebook = `## Preserve a DNS and system lookup notebook

Opening this notebook reopens the matching core project and preserves its saved resolution attempt. Record the issuing machine, question name, A or AAAA type, selected DNS server, port and time. Predict the typed answer set before each query. Keep the system NSS lookup as a separately labeled observation; an explicit dig server does not change the resolver or hosts data used by getent.

### Compare response status and typed records

Keep full DNS output and command status. Read the header status separately from the shell exit code. Distinguish A and AAAA address values from a CNAME alias target, and retain the TTL and actual responding server. Compare the dual-address, A-only, alias and missing-name cases in the optional owned fixture. NOERROR with no AAAA answer is NODATA; NXDOMAIN is a negative name answer in that resolver's view. Neither is the same as receiving no DNS response.

### Contrast lookup paths and remove the owned resolver

Compare the controlled localhost DNS view with the actual system NSS result, including any unavailable lookup or family-filtering behavior. Stop only the owned resolver and preserve the transport failures alongside the continuing system lookup and interpretation. Confirm the process stopped and no hosts, resolver or NSS configuration was edited. Bash programming is optional: the named lookup block is an extension, while equivalent command observations and the notebook meet the core goal. An absent AAAA answer does not prove an IPv4-only service, and a returned IPv6 address does not prove an IPv6 application connection. For independent review, state the further authorized application test needed. In a guided walkthrough, pause after prediction, a negative DNS answer, the localhost contrast and the cleanup comparison. Follow the complete core reading and imported README.md.`;
		const reachabilityNotebook = `## Preserve a reachability evidence notebook

Opening this notebook reopens the matching core project and preserves its saved diagnostic attempt. Run the selected role in an owned Linux environment. Keep the issuing machine, account, expected service owner, bind address, scheme and port beside each report. A destination request from this machine does not measure another machine's path; record that missing comparison explicitly when a second owned machine is unavailable.

### Predict and collect observations

Predict the listening socket, loopback HTTP, destination HTTP and raw TCP outcomes before running the bounded commands. Keep exact arguments, raw errors and statuses. Separate a successful TCP connection from returned HTTP headers, an application status and a useful page. The three route observations describe local configuration; they do not prove packet delivery. A missing process name can reflect permission rather than an absent process.

### Compare a changed case and restore the service

Compare a changed port, the stopped owned service and its restored state. Preserve the selected HTTP or HTTPS scheme and bracketed IPv6 URL in the actual command record. A timeout can reflect filtering, loss, an absent return path or an application deadline. A refusal can arise from a missing listener or an active reject. Keep any separately authorized firewall observation and its permission limits; the script does not inspect privileged policy. Bash programming is optional: the named route block is an extension, while equivalent command observations and the explanation meet the core goal. For independent review, state the smallest further test that could disprove the explanation. In a guided walkthrough, pause at prediction, first failure, route comparison and recovery. Follow the complete core guide and imported README.md for commands and interpretation.`;
		const firewallNotebook = `## Preserve a policy and rollback evidence notebook

Opening this notebook reopens the matching core project and keeps its saved policy attempt. Complete only the management and web cases in policy-rules.sh. The supplied apparatus performs the real UFW experiment in private network and mount namespaces inside an owned disposable Linux VM with root and console access. Keep the selected profile and exact rule choices beside each report.

### Predict the policy boundary

Sketch the client and service endpoints. Predict the fresh management-marker, web and unrequested-service outcomes before activation, while the policy is active and after restoration. Explain why a nondefault management port differs from an assumed OpenSSH profile. The marker is not an SSH daemon. Record the prior inactive state and the retained rule; the project preserves both as evidence for rollback.

### Observe, restore and review

Reconcile actual response tokens, peer and destination tuples, service PID, numbered UFW output and kernel counters. Confirm that the blocked listener remains running. Compare the changed management port and reverse-order runs. Distinguish a logging-rule counter from a retained journal message, and a successful old connection from a fresh allowed connection. Verify the exact private configuration and kernel restoration, all three restored responses, worker reaping, namespace removal and the measured outer host comparison. Python programming is optional; firewall_runtime.py stays unchanged. Review each prediction independently or pause a guided walkthrough at topology, rules, fresh requests and recovery. Follow the full core-card guide and imported README.md for commands and interpretation.`;
		const captureNotebook = `## Preserve an HTTP packet evidence notebook

Opening this notebook reopens the matching core project and preserves its saved capture attempt. Complete the two count/filter choices in capture-options.sh in that project. Use a disposable Linux VM with root access and the tools named in the imported README.md; the site IDE edits and saves the files while the VM performs the real packet capture.

### Predict and identify

Record why the owned loopback interface matches the local HTTP request. Predict the selected service port, the role of the client's ephemeral port, and the effect of including or excluding the independent noise service. Explain why a packet count also needs a wall-clock bound. The supplied numeric display option does not alter the captured headers.

### Compare and review

Keep the original report and the report from --reverse beside their exact settings. Use actual captured bytes and numeric readback to identify SYN, reverse-direction SYN/ACK, the HTTP request line, response status and per-run response token. Compare packet selection with traffic order. A TCP acknowledgement alone does not establish HTTP success, and this plaintext local experiment does not establish what TLS would reveal. Record both process cleanup and unchanged host network configuration. Python programming is optional; the supplied apparatus stays unchanged. Review the explanation independently or pace a walkthrough through endpoints, transport, HTTP, filter contrast and cleanup. Follow the full core-card guide and imported README.md for execution and evidence details.`;
		const topologyContinuation = exposure
			? `## Secure exposure: continue the existing router attempt

Opening this notebook reopens the matching core project and keeps the same saved Unit7 attempt. The routing, forwarding and translation cases remain prerequisites. The additional Unit12 task is the fourth shell case: a stateful forwarding policy, selected with --exposure-policy in the disposable Linux VM.

### Predict the policy boundary

Predict success for an allowed request through 10.10.0.1:18080 and denial for a fresh direct request to 10.20.0.2:8080. Separate the original destination, translated destination and return traffic. Explain why established replies need their own allowance and why a listening socket alone proves neither policy outcome.

### Observe, compare and review

Keep the earlier routing report, the edited filter case, both fresh request outcomes and actual forwarding-rule counters in network-notes.md. Compare the blocked direct request with a successful direct request after the owned policy is restored. Check that routes, translation rules and the server remain available during that comparison. Record interruption cleanup as a separate outcome. The prewritten Python apparatus stays unchanged; programming it is optional. Review the predictions against the retained evidence independently or in a guided walkthrough before completing this capstone pass. Follow the full core-card guide and imported README.md for commands and expected stages.`
			: `## Routing and translation: keep an operations notebook

Opening this notebook reopens the matching core project and keeps the same saved Unit7 attempt. Use the three routing/SNAT/DNAT shell cases in the owned disposable IPv4 topology. The notebook records observations from that project; it is not another implementation assignment.

### Predict and trace

Before running each stage, draw the client, router and service interfaces. Record the client's next hop, the forwarding decision and the service's return route. Predict the source address seen by the server before and after source translation. For destination translation, distinguish the address requested by the client from the actual listening endpoint.

### Observe, explain and review

Keep each prediction beside actual command output, the measured HTTP result and the supporting route or rule in network-notes.md. Compare forwarding-off with routed traffic, then compare the routed, translated and mapping-removed stages. A successful request is evidence for that particular path; it does not establish public Internet reachability. Record cleanup and explain any mismatch before revising the prediction. Review the completed trace independently or use it to pace a guided walkthrough. Python programming is optional; the prewritten apparatus stays unchanged. Follow the full core-card guide and imported README.md for execution. Unit12 later continues this saved attempt with the fourth filter case and --exposure-policy.`;
		return {
			...item,
			projectLink,

			solutionLink: networkPinnedCourseUrl(item.solutionLink ?? ""),
			ideImport: true,
			preserveInstructions: true,

			content:
				notebook && linkRoutingCore
					? linkRoutingNotebook
					: notebook && applicationCore
						? applicationNotebook
						: notebook && ipv6Core
							? ipv6Notebook
							: notebook && listeners
								? listenerNotebook
								: notebook && resolution
									? resolutionNotebook
									: notebook && reachability
										? reachabilityNotebook
										: notebook && firewall
											? firewallNotebook
											: notebook && capture
												? captureNotebook
												: notebook && topology
													? topologyContinuation
													: notebook
														? `${item.content}\n\nContinue the existing core project. Opening this notebook reopens the matching core project rather than creating a second assignment. Keep predictions, actual command output, endpoint and process identities, changed-case comparisons and cleanup in network-notes.md. Follow the complete guide on the core project card and in README.md. Python programming is optional supplemental practice; command observations and the notebook are the core deliverable.`
														: `${exposure ? "Continue the saved Unit7 attempt for the Unit12 Secure Exposure pass. Complete the fourth shell case and run --exposure-policy; the three earlier routing/NAT cases remain prerequisites.\n\n" : ""}${reading}\n\nSource guide: [Network Systems project](${projectLink}). Edit, save, review and export the selected role in the site IDE, then follow README.md in an external Linux terminal. The reference is separate from the learner attempt.`
		};
	};
	return {
		...module,
		curriculum: module.curriculum.map(decorate),
		supplementalProjects: module.supplementalProjects.map(decorate)
	};
}
