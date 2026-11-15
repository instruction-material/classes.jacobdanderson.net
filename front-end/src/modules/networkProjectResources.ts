import { githubRawUrl, parseGitHubResource } from "./codePreview";
import { networkDiagnosticsFivePacks } from "./networkDiagnosticsFiveResources";
import { networkDnsOptionalPacks } from "./networkDnsOptionalResources";
import { networkFirewallOptionalPacks } from "./networkFirewallOptionalResources";
import { networkKernelOptionalPacks } from "./networkKernelOptionalResources";

export const networkSourceRevision = "1fdd3faef06af8782a0d029ba880422b0a9775eb";
export const networkFoundationPacks = [
	{
		pack: "NS-04-ns0-setup-and-tooling",
		revision: networkSourceRevision,
		roleFiles: ["network-notes.md", "main.py", "network_lab.py"],
		coreItemId:
			"network-systems-ns0-setup-and-tooling-curriculum-core-project-network-systems",
		notebookItemId:
			"network-systems-ns0-setup-and-tooling-supplemental-operations-notebook-setup-and-tooling"
	},
	{
		pack: "NS-05-unit-1-the-network-stack-in-plain-english",
		revision: networkSourceRevision,
		roleFiles: ["network-notes.md", "main.py", "network_lab.py"],
		coreItemId:
			"network-systems-unit-1-the-network-stack-in-plain-english-curriculum-core-project-the-network-stack-in-plain-english",
		notebookItemId:
			"network-systems-unit-1-the-network-stack-in-plain-english-supplemental-operations-notebook-the-network-stack-in-plain-english"
	}
] as const;

export const networkNamingSourceRevision =
	"4947560f34919e27c74cecf30099ddbf85c3cef6";
export const networkNamingPacks = [
	{
		pack: "NS-06-unit-2-addresses-and-naming",
		revision: networkNamingSourceRevision,
		roleFiles: [
			"network-notes.md",
			"main.py",
			"network_lab.py",
			"naming_lab.py"
		],
		coreItemId:
			"network-systems-unit-2-addresses-and-naming-curriculum-core-project-addresses-and-naming",
		notebookItemId:
			"network-systems-unit-2-addresses-and-naming-supplemental-operations-notebook-addresses-and-naming"
	},
	{
		pack: "NS-05-unit-2-addresses-and-naming-supplemental-2",
		revision: networkNamingSourceRevision,
		roleFiles: [
			"network-notes.md",
			"main.py",
			"network_lab.py",
			"naming_lab.py"
		],
		coreItemId:
			"network-systems-unit-2-addresses-and-naming-supplemental-addressing-transfer-practice",
		notebookItemId: undefined
	},
	{
		pack: "NS-06-unit-2-addresses-and-naming-supplemental-3",
		revision: networkNamingSourceRevision,
		roleFiles: [
			"network-notes.md",
			"main.py",
			"network_lab.py",
			"naming_lab.py"
		],
		coreItemId:
			"network-systems-unit-2-addresses-and-naming-supplemental-addressing-extension-practice",
		notebookItemId: undefined
	}
] as const;

export const networkTopologySourceRevision =
	"8ede2290a77f4974d8efebe5df6bdd2d38de0733";
export const networkTopologyPacks = [
	{
		pack: "NS6-Router-NAT-Topology-Lab",
		revision: networkTopologySourceRevision,
		roleFiles: [
			"network-notes.md",
			"create_nat_lab.sh",
			"lab-rules.sh",
			"lab_runtime.py"
		],
		coreItemId:
			"network-systems-unit-7-linux-interface-and-route-management-curriculum-project-simulate-a-router-and-nat-lab-in-a-disposable-linux-topology",
		notebookItemId:
			"network-systems-unit-7-linux-interface-and-route-management-supplemental-operations-notebook-linux-interface-and-route-management",
		continuationItemIds: [
			"network-systems-unit-12-secure-exposure-of-services-curriculum-project-pass-validate-the-nat-and-exposure-topology-from-outside",
			"network-systems-unit-12-secure-exposure-of-services-supplemental-operations-notebook-secure-exposure-of-services"
		]
	}
] as const;

export const networkCaptureSourceRevision =
	"5df2b6dc50bf57ef4ce5500189d1c62726540654";
export const networkCapturePacks = [
	{
		pack: "NS5-Tcpdump-HTTP-Capture",
		revision: networkCaptureSourceRevision,
		roleFiles: [
			"network-notes.md",
			"capture_http.sh",
			"capture-options.sh",
			"capture_runtime.py"
		],
		coreItemId:
			"network-systems-unit-10-packet-capture-and-deep-inspection-curriculum-project-capture-and-analyze-a-local-http-request-with-tcpdump",
		notebookItemId:
			"network-systems-unit-10-packet-capture-and-deep-inspection-supplemental-operations-notebook-packet-capture-and-deep-inspection"
	}
] as const;

export const networkFirewallSourceRevision =
	"4880f07adac15dbbebcad6146fbeaff2f554347f";
export const networkFirewallPacks = [
	{
		pack: "NS3-UFW-Web-Server-Policy",
		revision: networkFirewallSourceRevision,
		roleFiles: [
			"network-notes.md",
			"apply_web_policy.sh",
			"policy-rules.sh",
			"web-stack.profile",
			"firewall_runtime.py"
		],
		coreItemId:
			"network-systems-unit-9-firewalls-and-host-policy-curriculum-project-build-and-verify-a-ufw-policy-for-a-web-server",
		notebookItemId:
			"network-systems-unit-9-firewalls-and-host-policy-supplemental-operations-notebook-firewalls-and-host-policy"
	}
] as const;

export const networkReachabilitySourceRevision =
	"33ae65560b4f807e4dc6734436e382995866fc08";
export const networkReachabilityPacks = [
	{
		pack: "NS2-Local-vs-Remote-Reachability-Diagnosis",
		revision: networkReachabilitySourceRevision,
		roleFiles: ["network-notes.md", "diagnose_reachability.sh"],
		coreItemId:
			"network-systems-unit-6-core-diagnostics-curriculum-project-diagnose-why-a-service-is-reachable-locally-but-not-from-another-machine",
		notebookItemId:
			"network-systems-unit-6-core-diagnostics-supplemental-operations-notebook-core-diagnostics"
	}
] as const;

export const networkListenerSourceRevision =
	"33ae65560b4f807e4dc6734436e382995866fc08";
export const networkListenerPacks = [
	{
		pack: "NS1-Listening-Services-Map",
		revision: networkListenerSourceRevision,
		roleFiles: ["network-notes.md", "inventory_services.sh"],
		coreItemId:
			"network-systems-unit-4-ports-and-listening-services-curriculum-project-map-all-listening-services-on-a-linux-host",
		notebookItemId:
			"network-systems-unit-4-ports-and-listening-services-supplemental-operations-notebook-ports-and-listening-services"
	}
] as const;

export const networkResolutionSourceRevision =
	"33ae65560b4f807e4dc6734436e382995866fc08";
export const networkResolutionPacks = [
	{
		pack: "NS4-IPv4-vs-IPv6-Resolution-Comparison",
		revision: networkResolutionSourceRevision,
		roleFiles: ["network-notes.md", "compare_resolution.sh"],
		coreItemId:
			"network-systems-unit-5-dns-and-name-resolution-curriculum-project-compare-ipv4-and-ipv6-resolution-for-the-same-hostname",
		notebookItemId:
			"network-systems-unit-5-dns-and-name-resolution-supplemental-operations-notebook-dns-and-name-resolution"
	}
] as const;

export const networkIPv6SourceRevision =
	"8bfb8ae8ee62f84e462dfca425eac7171416215d";
export const networkIPv6Packs = [
	{
		pack: "NS-08-unit-8-ipv6-in-practice",
		revision: networkIPv6SourceRevision,
		roleFiles: [
			"network-notes.md",
			"main.py",
			"ipv6_lab.py",
			"ipv6-practice-case.md"
		],
		coreItemId:
			"network-systems-unit-8-ipv6-in-practice-curriculum-ipv6-diagnostics-core-project",
		notebookItemId:
			"network-systems-unit-8-ipv6-in-practice-supplemental-operations-notebook-ipv6-in-practice"
	},
	{
		pack: "NS-17-unit-8-ipv6-in-practice-supplemental-2",
		revision: networkIPv6SourceRevision,
		roleFiles: [
			"network-notes.md",
			"main.py",
			"ipv6_lab.py",
			"ipv6-practice-case.md"
		],
		coreItemId:
			"network-systems-unit-8-ipv6-in-practice-supplemental-ipv6-transfer-practice",
		notebookItemId: undefined
	},
	{
		pack: "NS-18-unit-8-ipv6-in-practice-supplemental-3",
		revision: networkIPv6SourceRevision,
		roleFiles: [
			"network-notes.md",
			"main.py",
			"ipv6_lab.py",
			"ipv6-practice-case.md"
		],
		coreItemId:
			"network-systems-unit-8-ipv6-in-practice-supplemental-ipv6-extension-practice",
		notebookItemId: undefined
	}
] as const;

export const networkApplicationSourceRevision =
	"7ac775db856b23ae5f1f575742dfb07eb257eb90";
export const networkApplicationPacks = [
	{
		pack: "NS-09-unit-11-common-application-protocols",
		revision: networkApplicationSourceRevision,
		roleFiles: [
			"network-notes.md",
			"main.py",
			"application_lab.py",
			"application-cases.md"
		],
		coreItemId:
			"network-systems-unit-11-common-application-protocols-curriculum-core-project-common-application-protocols",
		notebookItemId:
			"network-systems-unit-11-common-application-protocols-supplemental-operations-notebook-common-application-protocols"
	},
	{
		pack: "NS-23-unit-11-common-application-protocols-supplemental-2",
		revision: networkApplicationSourceRevision,
		roleFiles: [
			"network-notes.md",
			"main.py",
			"application_lab.py",
			"application-cases.md"
		],
		coreItemId:
			"network-systems-unit-11-common-application-protocols-supplemental-application-protocol-transfer-practice",
		notebookItemId: undefined
	},
	{
		pack: "NS-24-unit-11-common-application-protocols-supplemental-3",
		revision: networkApplicationSourceRevision,
		roleFiles: [
			"network-notes.md",
			"main.py",
			"application_lab.py",
			"application-cases.md"
		],
		coreItemId:
			"network-systems-unit-11-common-application-protocols-supplemental-application-protocol-extension-practice",
		notebookItemId: undefined
	}
] as const;

export const networkLinkRoutingSourceRevision =
	"6dfb1ccbc3e70ca7ec78ed98600438da8f3a9bed";
export const networkLinkRoutingPacks = [
	{
		pack: "NS-07-unit-3-switches-routers-nat-and-the-internet-edge",
		revision: networkLinkRoutingSourceRevision,
		roleFiles: [
			"network-notes.md",
			"main.py",
			"link_routing_lab.py",
			"edge-cases.md"
		],
		coreItemId:
			"network-systems-unit-3-switches-routers-nat-and-the-internet-edge-curriculum-core-project-switches-routers-nat-and-the-internet-edge",
		notebookItemId:
			"network-systems-unit-3-switches-routers-nat-and-the-internet-edge-supplemental-operations-notebook-switches-routers-nat-and-the-internet-edge"
	},
	{
		pack: "NS-07-unit-3-switches-routers-nat-and-the-internet-edge-supplemental-2",
		revision: networkLinkRoutingSourceRevision,
		roleFiles: [
			"network-notes.md",
			"main.py",
			"link_routing_lab.py",
			"edge-cases.md"
		],
		coreItemId:
			"network-systems-unit-3-switches-routers-nat-and-the-internet-edge-supplemental-routing-edge-transfer-practice",
		notebookItemId: undefined
	},
	{
		pack: "NS-08-unit-3-switches-routers-nat-and-the-internet-edge-supplemental-3",
		revision: networkLinkRoutingSourceRevision,
		roleFiles: [
			"network-notes.md",
			"main.py",
			"link_routing_lab.py",
			"edge-cases.md"
		],
		coreItemId:
			"network-systems-unit-3-switches-routers-nat-and-the-internet-edge-supplemental-routing-edge-extension-practice",
		notebookItemId: undefined
	}
] as const;

export const networkCapstoneSourceRevision =
	"efde30862ec77ba94f9c2ad3857a819fd902c23c";
export const networkCapstonePacks = [
	{
		pack: "NS-03-network-systems-lab-17",
		revision: networkCapstoneSourceRevision,
		roleFiles: [
			"network-notes.md",
			"main.py",
			"capstone_lab.py",
			"case.json",
			"edge-cases.md"
		],
		coreItemId:
			"network-systems-network-systems-lab-17-operations-capstone-studio-curriculum-core-project-operations-capstone-studio",
		notebookItemId:
			"network-systems-network-systems-lab-17-operations-capstone-studio-curriculum-operations-capstone-studio-guided-example",
		projectKeyVersion: 2
	},
	{
		pack: "NS-33-applied-studio-17-network-systems-lab-17-supplemental-2",
		revision: networkCapstoneSourceRevision,
		roleFiles: [
			"network-notes.md",
			"main.py",
			"capstone_lab.py",
			"case.json",
			"edge-cases.md"
		],
		coreItemId:
			"network-systems-network-systems-lab-17-operations-capstone-studio-supplemental-operations-capstone-transfer-practice",
		notebookItemId: undefined
	},
	{
		pack: "NS-34-applied-studio-17-network-systems-lab-17-supplemental-3",
		revision: networkCapstoneSourceRevision,
		roleFiles: [
			"network-notes.md",
			"main.py",
			"capstone_lab.py",
			"case.json",
			"edge-cases.md"
		],
		coreItemId:
			"network-systems-network-systems-lab-17-operations-capstone-studio-supplemental-operations-capstone-extension-practice",
		notebookItemId: undefined
	}
] as const;

export const networkSetupSourceRevision =
	"01bc302b3607d82f84176035f6633cdcbef50782";
export const networkSetupPacks = [
	{
		pack: "NS-01-ns0-setup-and-tooling-supplemental-2",
		revision: networkSetupSourceRevision,
		roleFiles: [
			"network-notes.md",
			"main.py",
			"setup_lab.py",
			"case.json",
			"edge-cases.md"
		],
		coreItemId:
			"network-systems-ns0-setup-and-tooling-supplemental-network-systems-setup-transfer-practice",
		notebookItemId: undefined
	},
	{
		pack: "NS-02-ns0-setup-and-tooling-supplemental-3",
		revision: networkSetupSourceRevision,
		roleFiles: [
			"network-notes.md",
			"main.py",
			"setup_lab.py",
			"case.json",
			"edge-cases.md"
		],
		coreItemId:
			"network-systems-ns0-setup-and-tooling-supplemental-network-systems-setup-extension-practice",
		notebookItemId: undefined
	}
] as const;

export const networkTransportSourceRevision =
	"e7cfc98a5320420acbba259dab765da2adc0799a";
export const networkTransportPacks = [
	{
		pack: "NS-03-unit-1-the-network-stack-in-plain-english-supplemental-2",
		revision: networkTransportSourceRevision,
		roleFiles: [
			"network-notes.md",
			"main.py",
			"transport_lab.py",
			"case.json",
			"edge-cases.md"
		],
		coreItemId:
			"network-systems-unit-1-the-network-stack-in-plain-english-supplemental-network-stack-transfer-practice",
		notebookItemId: undefined
	},
	{
		pack: "NS-04-unit-1-the-network-stack-in-plain-english-supplemental-3",
		revision: networkTransportSourceRevision,
		roleFiles: [
			"network-notes.md",
			"main.py",
			"transport_lab.py",
			"case.json",
			"edge-cases.md"
		],
		coreItemId:
			"network-systems-unit-1-the-network-stack-in-plain-english-supplemental-network-stack-extension-practice",
		notebookItemId: undefined
	}
] as const;

export const networkSocketInventorySourceRevision =
	"8629da663b9e797ddbca1dc0217ce6869c823501";
export const networkSocketInventoryPacks = [
	{
		pack: "NS-09-unit-4-ports-and-listening-services-supplemental-2",
		revision: networkSocketInventorySourceRevision,
		roleFiles: [
			"network-notes.md",
			"main.py",
			"listener_lab.py",
			"case.json",
			"edge-cases.md"
		],
		coreItemId:
			"network-systems-unit-4-ports-and-listening-services-supplemental-port-inventory-transfer-practice",
		notebookItemId: undefined
	},
	{
		pack: "NS-10-unit-4-ports-and-listening-services-supplemental-3",
		revision: networkSocketInventorySourceRevision,
		roleFiles: [
			"network-notes.md",
			"main.py",
			"listener_lab.py",
			"case.json",
			"edge-cases.md"
		],
		coreItemId:
			"network-systems-unit-4-ports-and-listening-services-supplemental-port-inventory-extension-practice",
		notebookItemId: undefined
	}
] as const;

export const networkVerifiedPacks = [
	...networkDiagnosticsFivePacks,
	...networkFoundationPacks,
	...networkNamingPacks,
	...networkTopologyPacks,
	...networkCapturePacks,
	...networkFirewallPacks,
	...networkFirewallOptionalPacks,
	...networkKernelOptionalPacks,
	...networkReachabilityPacks,
	...networkListenerPacks,
	...networkResolutionPacks,
	...networkDnsOptionalPacks,
	...networkIPv6Packs,
	...networkApplicationPacks,
	...networkLinkRoutingPacks,
	...networkCapstonePacks,
	...networkSetupPacks,
	...networkTransportPacks,
	...networkSocketInventoryPacks
] as const;

export function networkCourseResource(url: string) {
	const resource = parseGitHubResource(url);
	if (
		!resource ||
		resource.owner.toLowerCase() !== "instruction-material" ||
		resource.repo.toLowerCase() !== "network-systems"
	) {
		return null;
	}
	const [pack, role, ...rest] = resource.path.split("/");
	const definition = networkVerifiedPacks.find(p => p.pack === pack);
	if (
		!definition ||
		resource.ref !== definition.revision ||
		rest.length ||
		(role !== "starter" && role !== "solution")
	) {
		return null;
	}
	return { resource, pack, role, definition };
}

export function networkPinnedCourseUrl(url: string) {
	const resource = parseGitHubResource(url);
	if (
		!resource ||
		resource.owner.toLowerCase() !== "instruction-material" ||
		resource.repo.toLowerCase() !== "network-systems"
	) {
		return url;
	}
	const [pack, role, ...rest] = resource.path.split("/");
	const definition = networkVerifiedPacks.find(p => p.pack === pack);
	if (
		!definition ||
		rest.length ||
		(role !== "starter" && role !== "solution") ||
		(resource.ref !== "main" && resource.ref !== definition.revision)
	) {
		return url;
	}
	return `https://github.com/instruction-material/Network-Systems/tree/${definition.revision}/${pack}/${role}`;
}

export function networkCourseProjectKey(
	courseID: string,
	itemID: string,

	role: "starter" | "reference",
	url: string
) {
	const selected =
		courseID === "network-systems" ? networkCourseResource(url) : null;
	if (!selected) return `${courseID}:${itemID}:${role}`;
	const continuationIDs: readonly string[] =
		"continuationItemIds" in selected.definition
			? selected.definition.continuationItemIds
			: [];
	const shared =
		itemID === selected.definition.notebookItemId ||
		continuationIDs.includes(itemID)
			? selected.definition.coreItemId
			: itemID;
	const version =
		"projectKeyVersion" in selected.definition
			? `-v${selected.definition.projectKeyVersion}`
			: "";
	return `${courseID}:${shared}:${role}:native-network${version}`;
}

export function networkImportFiles(url: string) {
	const selected = networkCourseResource(url);
	if (!selected) return null;
	const { resource, pack, role, definition } = selected;
	return [
		...definition.roleFiles.map(name => `${role}/${name}`),
		"README.md"
	].map(name => {
		const path = `${pack}/${name}`;
		return {
			name,
			file: {
				path,
				htmlUrl: `https://github.com/${resource.owner}/${resource.repo}/blob/${resource.ref}/${path}`,
				rawUrl: githubRawUrl(resource, path),
				label: name,
				size: null
			}
		};
	});
}
