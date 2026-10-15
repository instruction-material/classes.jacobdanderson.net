import type { RawCourse } from "./types";
import { buildImplementationLabGuidance } from "./implementationLabGuidance";
import { withNetworkProjectReadings } from "./networkProjectReading";
import { buildProjectGuidance } from "./projectGuidance";

const networkSystemsSourceCourse: RawCourse = {
	name: "Network Systems",
	modules: [
		{
			title: "NS0 Setup and Tooling",
			curriculum: [
				{
					title: "Preferred IDE and Real Linux Environment",
					content:
						"Standardize on `VS Code` and make the real requirement a usable Linux shell rather than the editor itself. This course is command-line and lab oriented, so plan to run diagnostics and configuration changes on a Linux VM, remote server, WSL instance, or disposable cloud host rather than only from a local desktop shell."
				},
				{
					title: "macOS and Windows Walkthroughs",
					content:
						"On macOS, install VS Code, add the `code` command to PATH, and plan to run labs against a Linux VM, Docker-based lab, or remote host. On Windows, install WSL2 plus Ubuntu, keep the workspace inside the Linux filesystem, and verify that commands are running in Linux before starting route, firewall, or packet-capture labs."
				},
				{
					title: "Core Tooling and Remote Access",
					content:
						"Verify `ssh`, `curl`, `dig`, and `traceroute` early, then add `Remote - SSH`, `Remote - WSL`, `Docker`, `YAML`, and `EditorConfig` support as needed. Diagnostics, packet capture, firewall editing, and routing changes often happen over a remote shell instead of a local GUI."
				},
				{
					title: "Positioning, Prerequisites, and Core Outcomes",
					content:
						"Position the course after `Linux Systems` and frame it as the layer that explains how services on one host become reachable, unreachable, slow, or misrouted from somewhere else. Already be comfortable editing config files and running Linux diagnostics before the course asks them to reason about ports, sockets, routing, DNS, firewalls, and IPv6 behavior."
				},
				{
					title: "NS0 Setup and Tooling: Core Project",
					content: buildProjectGuidance({
						courseFamily: "network systems",
						moduleTitle: "NS0 Setup and Tooling",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS-04-ns0-setup-and-tooling/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS-04-ns0-setup-and-tooling/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Operations Notebook: Setup and Tooling",
					content:
						"Keep a short operations notebook for setup and tooling that records the commands run, key outputs, one network diagram, and one plain-language explanation of what the evidence proves. Focus especially on remote access method, Linux lab environment, and the first verified command set so the explanation stays grounded in observed network state rather than guesses.",
					projectLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS-04-ns0-setup-and-tooling/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS-04-ns0-setup-and-tooling/solution"
				},
				{
					title: "Setup and Tooling Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "network systems",
						moduleTitle: "NS0 Setup and Tooling",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS-01-ns0-setup-and-tooling-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS-01-ns0-setup-and-tooling-supplemental-2/solution"
				},
				{
					title: "Setup and Tooling Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "network systems",
						moduleTitle: "NS0 Setup and Tooling",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS-02-ns0-setup-and-tooling-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS-02-ns0-setup-and-tooling-supplemental-3/solution"
				}
			]
		},
		{
			title: "Unit 1: The Network Stack in Plain English",
			curriculum: [
				{
					title: "Interfaces, Frames, Packets, Sockets, and Ports",
					content:
						"Interfaces attach a host to a network, frames move across the local link, packets move end to end between IP addresses, sockets connect applications to the network stack, and ports distinguish services on one host. Treat these as related but different objects so later diagnostics can identify which layer is actually failing."
				},
				{
					title: "TCP versus UDP",
					content:
						"Compare TCP and UDP in terms of connection behavior, retransmission expectations, and where reliability lives. Keep the comparison practical: explain why an application chose one or the other and what that choice changes about debugging."
				},
				{
					title: "Client and Server Flow",
					content:
						"Trace a simple client/server exchange from local process to local socket, out through the interface, across the network, and back to a listening service on the destination host. The point is to make later diagnostics feel like checking a known path rather than memorizing unrelated commands."
				},
				{
					title: "One Request, Many Layers",
					content:
						"Narrate one HTTP or SSH request from application intent down through addressing and transport and then back up on the receiving side. This gives the course a stable mental model to revisit in DNS, routing, and firewall units."
				},
				{
					title: "Unit 1: The Network Stack in Plain English: Core Project",
					content: buildProjectGuidance({
						courseFamily: "network systems",
						moduleTitle:
							"Unit 1: The Network Stack in Plain English",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS-05-unit-1-the-network-stack-in-plain-english/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS-05-unit-1-the-network-stack-in-plain-english/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Operations Notebook: The Network Stack in Plain English",
					content:
						"Keep a short operations notebook for the network stack in plain english that records the commands run, key outputs, one network diagram, and one plain-language explanation of what the evidence proves. Focus especially on the path from one client request to one server response so the explanation stays grounded in observed network state rather than guesses.",
					projectLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS-05-unit-1-the-network-stack-in-plain-english/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS-05-unit-1-the-network-stack-in-plain-english/solution"
				},
				{
					title: "Network Stack Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "network systems",
						moduleTitle:
							"Unit 1: The Network Stack in Plain English",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS-03-unit-1-the-network-stack-in-plain-english-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS-03-unit-1-the-network-stack-in-plain-english-supplemental-2/solution"
				},
				{
					title: "Network Stack Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "network systems",
						moduleTitle:
							"Unit 1: The Network Stack in Plain English",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS-04-unit-1-the-network-stack-in-plain-english-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS-04-unit-1-the-network-stack-in-plain-english-supplemental-3/solution"
				}
			]
		},
		{
			title: "Unit 2: Addresses and Naming",
			curriculum: [
				{
					title: "MAC, IPv4, and IPv6 Addresses",
					content:
						"MAC addresses identify local-link endpoints, IPv4 and IPv6 addresses identify network-layer destinations, and hostnames are human-facing labels that must be resolved before packets can move. A hostname may be the name typed by a person, but the wire ultimately carries addresses and link-layer delivery information."
				},
				{
					title: "Public versus Private Addressing",
					content:
						"Private IPv4 ranges and public internet addresses explain why many devices can talk locally without being directly reachable from outside. This connects directly to NAT and to the difference between a home network and a public server."
				},
				{
					title: "IPv6 Address Categories in Practice",
					content:
						"Loopback, link-local, and global unicast addresses are practical address families that show up in diagnostics. This prevents the common confusion where every IPv6 address is assumed to be globally routed in the same way."
				},
				{
					title: "DNS Names versus Actual Endpoints",
					content:
						"DNS is a naming system that maps labels to records, not the same thing as routing or transport. The same hostname may resolve to multiple records, and resolution success does not automatically prove port reachability."
				},
				{
					title: "Unit 2: Addresses and Naming: Core Project",
					content: buildProjectGuidance({
						courseFamily: "network systems",
						moduleTitle: "Unit 2: Addresses and Naming",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS-06-unit-2-addresses-and-naming/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS-06-unit-2-addresses-and-naming/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Operations Notebook: Addresses and Naming",
					content:
						"Keep a short operations notebook for addresses and naming that records the commands run, key outputs, one network diagram, and one plain-language explanation of what the evidence proves. Focus especially on how one hostname, one interface, and one observed IP address relate without meaning the same thing so the explanation stays grounded in observed network state rather than guesses.",
					projectLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS-06-unit-2-addresses-and-naming/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS-06-unit-2-addresses-and-naming/solution"
				},
				{
					title: "Addressing Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "network systems",
						moduleTitle: "Unit 2: Addresses and Naming",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS-05-unit-2-addresses-and-naming-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS-05-unit-2-addresses-and-naming-supplemental-2/solution"
				},
				{
					title: "Addressing Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "network systems",
						moduleTitle: "Unit 2: Addresses and Naming",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS-06-unit-2-addresses-and-naming-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS-06-unit-2-addresses-and-naming-supplemental-3/solution"
				}
			]
		},
		{
			title: "Unit 3: Switches, Routers, NAT, and the Internet Edge",
			curriculum: [
				{
					title: "Local Subnets and Default Gateways",
					content:
						"Local subnet behavior defines which destinations a host can reach directly and which destinations must go through a router. The default gateway is not a magic internet button; it is the next hop chosen when traffic leaves the local segment."
				},
				{
					title: "How Routers Forward Traffic",
					content:
						"A simple multi-hop diagram can show route lookup, next-hop forwarding, and the fact that each router only needs to know the next step rather than the full end-to-end path. This makes tools like `traceroute` and `mtr` more intuitive later."
				},
				{
					title: "NAT and Port Forwarding",
					content:
						"Explain NAT as address translation at the internet edge and pair it with port forwarding to show why inbound reachability on a home network is different from running a service on a public server. This is where local success must be separated from outside reachability."
				},
				{
					title: "Why Home Networks Differ from Public Servers",
					content:
						"Contrast a private LAN behind NAT with a public host that owns its own public address and firewall policy. This contrast prevents assuming that every deployment path behaves like a cloud VM or like a home router."
				},
				{
					title: "Unit 3: Switches, Routers, NAT, and the Internet Edge: Core Project",
					content: buildProjectGuidance({
						courseFamily: "network systems",
						moduleTitle:
							"Unit 3: Switches, Routers, NAT, and the Internet Edge",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS-07-unit-3-switches-routers-nat-and-the-internet-edge/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS-07-unit-3-switches-routers-nat-and-the-internet-edge/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Operations Notebook: Switches, Routers, NAT, and the Internet Edge",
					content:
						"Keep a short operations notebook for switches, routers, nat, and the internet edge that records the commands run, key outputs, one network diagram, and one plain-language explanation of what the evidence proves. Focus especially on default gateways, local-subnet boundaries, and which hop is doing translation so the explanation stays grounded in observed network state rather than guesses.",
					projectLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS-07-unit-3-switches-routers-nat-and-the-internet-edge/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS-07-unit-3-switches-routers-nat-and-the-internet-edge/solution"
				},
				{
					title: "Routing Edge Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "network systems",
						moduleTitle:
							"Unit 3: Switches, Routers, NAT, and the Internet Edge",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS-07-unit-3-switches-routers-nat-and-the-internet-edge-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS-07-unit-3-switches-routers-nat-and-the-internet-edge-supplemental-2/solution"
				},
				{
					title: "Routing Edge Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "network systems",
						moduleTitle:
							"Unit 3: Switches, Routers, NAT, and the Internet Edge",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS-08-unit-3-switches-routers-nat-and-the-internet-edge-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS-08-unit-3-switches-routers-nat-and-the-internet-edge-supplemental-3/solution"
				}
			]
		},
		{
			title: "Unit 4: Ports and Listening Services",
			curriculum: [
				{
					title: "What a Port Actually Identifies",
					content:
						"A port is one part of a socket endpoint, not a complete service identity by itself. A process, protocol, local address, and port together define what is actually listening or connected, which is why port-only explanations are often incomplete."
				},
				{
					title: "Ephemeral Ports and Client-Side Source Ports",
					content:
						"Explain ephemeral ports to avoid assuming the client side of every connection always uses the same number. This is especially important when reading `ss` output or packet captures and separating server ports from temporary client ports."
				},
				{
					title: "Using ss, netstat, and lsof to Map Services",
					content:
						"`ss`, `netstat`, and `lsof -i` map listening sockets and established connections back to processes. Build the habit of proving which process owns a network endpoint before changing firewall rules, killing services, or assuming a port belongs to a particular application."
				},
				{
					title: "Project: Map All Listening Services on a Linux Host",
					content:
						"Use the listening-services lab to inventory TCP and UDP listeners, tie them back to processes, and classify which ports are expected, internal, or suspicious. Produce a short service map that makes the host's network surface visible instead of assuming they know what is exposed.",
					projectLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS1-Listening-Services-Map/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS1-Listening-Services-Map/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Operations Notebook: Ports and Listening Services",
					content:
						"Keep a short operations notebook for ports and listening services that records the commands run, key outputs, one network diagram, and one plain-language explanation of what the evidence proves. Focus especially on how local address, protocol, port, and process identity fit together in one socket listing so the explanation stays grounded in observed network state rather than guesses.",
					projectLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS1-Listening-Services-Map/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS1-Listening-Services-Map/solution"
				},
				{
					title: "Port Inventory Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "network systems",
						moduleTitle: "Unit 4: Ports and Listening Services",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS-09-unit-4-ports-and-listening-services-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS-09-unit-4-ports-and-listening-services-supplemental-2/solution"
				},
				{
					title: "Port Inventory Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "network systems",
						moduleTitle: "Unit 4: Ports and Listening Services",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS-10-unit-4-ports-and-listening-services-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS-10-unit-4-ports-and-listening-services-supplemental-3/solution"
				}
			]
		},
		{
			title: "Unit 5: DNS and Name Resolution",
			curriculum: [
				{
					title: "Recursive and Authoritative Resolution",
					content:
						"Recursive resolvers and authoritative servers play different roles: one follows or caches the answer path, and the other is responsible for the zone data. This distinction matters when a hostname resolves differently from different locations or after a DNS change has only partially propagated."
				},
				{
					title: "Caching and Resolver State",
					content:
						"DNS caching explains why changes can appear inconsistent during deployment or troubleshooting. Cached success, cached failure, TTL behavior, and local override files all shape what a resolver returns before the request ever reaches an authoritative server."
				},
				{
					title: "dig, nslookup, host, and Resolver Configuration",
					content:
						"`dig`, `nslookup`, `host`, `/etc/hosts`, and resolver config files make name resolution visible. The key checks are which tool is showing recursive answers, which tool is showing raw records, and what local overrides might still be in play."
				},
				{
					title: "Project: Compare IPv4 and IPv6 Resolution for the Same Hostname",
					content:
						"The resolution-comparison lab inspects A and AAAA answers, compares resolver outputs, and explains which address family a client is likely to try first. Dual-stack behavior becomes concrete when the same hostname produces different address families with different paths and failure modes.",
					projectLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS4-IPv4-vs-IPv6-Resolution-Comparison/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS4-IPv4-vs-IPv6-Resolution-Comparison/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Operations Notebook: DNS and Name Resolution",
					content:
						"Keep a short operations notebook for dns and name resolution that records the commands run, key outputs, one network diagram, and one plain-language explanation of what the evidence proves. Focus especially on record types, resolver path, caching state, and local override behavior so the explanation stays grounded in observed network state rather than guesses.",
					projectLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS4-IPv4-vs-IPv6-Resolution-Comparison/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS4-IPv4-vs-IPv6-Resolution-Comparison/solution"
				},
				{
					title: "DNS Resolution Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "network systems",
						moduleTitle: "Unit 5: DNS and Name Resolution",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS-11-unit-5-dns-and-name-resolution-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS-11-unit-5-dns-and-name-resolution-supplemental-2/solution"
				},
				{
					title: "DNS Resolution Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "network systems",
						moduleTitle: "Unit 5: DNS and Name Resolution",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS-12-unit-5-dns-and-name-resolution-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS-12-unit-5-dns-and-name-resolution-supplemental-3/solution"
				}
			]
		},
		{
			title: "Unit 6: Core Diagnostics",
			curriculum: [
				{
					title: "ping, traceroute, tracepath, and mtr",
					content:
						"The core path tools answer different questions: `ping` checks basic reachability, `traceroute` estimates hop path, `tracepath` can expose path MTU clues, and `mtr` watches repeated latency and loss patterns. Choose the tool based on the evidence needed instead of treating them as interchangeable."
				},
				{
					title: "curl, nc, and telnet for Service Checks",
					content:
						"`curl`, `nc`, and `telnet` are quick tools for checking whether a TCP service answers, whether the right banner or headers appear, and whether the failure looks like refusal, timeout, or reset. The important habit is to match the tool to the protocol and the question."
				},
				{
					title: "Timeout versus Refusal versus Reset",
					content:
						"Repeat the failure signatures until they become quick to classify: timeout usually means a packet is not getting through or not coming back, refusal usually means the host is reachable but nothing is listening, and reset usually means a TCP conversation was actively torn down. Verification still matters, and the classification becomes an evidence-backed diagnostic habit."
				},
				{
					title: "Project: Diagnose Why a Service Is Reachable Locally but Not from Another Machine",
					content:
						"Use the reachability lab to compare localhost success, same-subnet failure, and outside failure-mode scenarios against service state, route state, and firewall state. Write down the failure signature before editing anything so the later fix has real diagnostic context.",
					projectLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS2-Local-vs-Remote-Reachability-Diagnosis/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS2-Local-vs-Remote-Reachability-Diagnosis/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Operations Notebook: Core Diagnostics",
					content:
						"Keep a short operations notebook for core diagnostics that records the commands run, key outputs, one network diagram, and one plain-language explanation of what the evidence proves. Focus especially on which command answered which question and what the failure signature implied so the explanation stays grounded in observed network state rather than guesses.",
					projectLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS2-Local-vs-Remote-Reachability-Diagnosis/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS2-Local-vs-Remote-Reachability-Diagnosis/solution"
				},
				{
					title: "Diagnostic Trace Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "network systems",
						moduleTitle: "Unit 6: Core Diagnostics",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS-13-unit-6-core-diagnostics-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS-13-unit-6-core-diagnostics-supplemental-2/solution"
				},
				{
					title: "Diagnostic Trace Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "network systems",
						moduleTitle: "Unit 6: Core Diagnostics",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS-14-unit-6-core-diagnostics-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS-14-unit-6-core-diagnostics-supplemental-3/solution"
				}
			]
		},
		{
			title: "Unit 7: Linux Interface and Route Management",
			curriculum: [
				{
					title: "ip addr, ip link, and Interface State",
					content:
						"`ip addr` and `ip link` make interface state visible: assigned addresses, link state, and whether an interface is even up. Higher-level diagnostics cannot compensate for an interface that is down, disconnected, or misaddressed."
				},
				{
					title: "ip route and Static versus Dynamic Paths",
					content:
						"`ip route` is the host's own forwarding decision table. Default routes, directly connected networks, automatically learned paths, and deliberately configured lab overrides explain why a host chooses one next hop instead of another."
				},
				{
					title: "ARP, Neighbor Discovery, and ip neigh",
					content:
						"Use `ip neigh` to connect route choice back to link-layer neighbor resolution. The point is to show that once a host chooses the next hop, it still needs a local-link mapping before traffic can leave on the wire."
				},
				{
					title: "Project: Simulate a Router and NAT Lab in a Disposable Linux Topology",
					content:
						"Use the NAT-topology lab to create a small routed environment with isolated segments, a forwarding node, and explicit edge behavior. The lab makes next-hop logic, interface state, route tables, and selective exposure visible instead of abstract.",
					projectLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS6-Router-NAT-Topology-Lab/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS6-Router-NAT-Topology-Lab/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Operations Notebook: Linux Interface and Route Management",
					content:
						"Keep a short operations notebook for linux interface and route management that records the commands run, key outputs, one network diagram, and one plain-language explanation of what the evidence proves. Focus especially on interface state, next-hop choice, and how a route becomes an actual neighbor-level destination so the explanation stays grounded in observed network state rather than guesses.",
					projectLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS6-Router-NAT-Topology-Lab/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS6-Router-NAT-Topology-Lab/solution"
				},
				{
					title: "Linux Interface Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "network systems",
						moduleTitle:
							"Unit 7: Linux Interface and Route Management",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS-15-unit-7-linux-interface-and-route-management-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS-15-unit-7-linux-interface-and-route-management-supplemental-2/solution"
				},
				{
					title: "Linux Interface Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "network systems",
						moduleTitle:
							"Unit 7: Linux Interface and Route Management",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS-16-unit-7-linux-interface-and-route-management-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS-16-unit-7-linux-interface-and-route-management-supplemental-3/solution"
				}
			]
		},
		{
			title: "Unit 8: IPv6 in Practice",
			curriculum: [
				{
					title: "Global Unicast, Link-Local, and Loopback",
					content:
						"Practical IPv6 diagnostics depend on recognizing global unicast, link-local, and loopback addresses. Link-local addresses have strictly local meaning even though they look like routable IPv6 addresses, so scope must be included in the interpretation."
				},
				{
					title: "SLAAC and DHCPv6 at a Conceptual Level",
					content:
						"SLAAC and DHCPv6 are two different ways a host may learn usable IPv6 configuration. The practical target is not every standard detail; it is understanding why one network auto-configures differently from another and which clues show up in host diagnostics."
				},
				{
					title: "Dual-Stack Behavior",
					content:
						"Dual-stack examples show why a hostname may resolve to both A and AAAA records and why the chosen family changes which path, firewall rules, and failure modes matter. This is a real operational issue rather than a theoretical appendix."
				},
				{
					title: "Common IPv6 Operations Mistakes",
					content:
						"Highlight the mistakes that repeatedly confuse IPv6 operations: forgetting link-local scope, validating only IPv4 reachability, or assuming that an IPv4 firewall policy automatically covers IPv6. These are the habits that create subtle deployment gaps."
				},
				{
					title: "IPv6 Diagnostics Core Project",
					content: buildProjectGuidance({
						courseFamily: "network systems",
						moduleTitle: "Unit 8: IPv6 in Practice",
						itemTitle: "IPv6 Diagnostics Core Project",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS-08-unit-8-ipv6-in-practice/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS-08-unit-8-ipv6-in-practice/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Operations Notebook: IPv6 in Practice",
					content:
						"Keep a short operations notebook for ipv6 in practice that records the commands run, key outputs, one network diagram, and one plain-language explanation of what the evidence proves. Focus especially on address family selection, scope behavior, and which rule sets apply to which traffic so the explanation stays grounded in observed network state rather than guesses.",
					projectLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS-08-unit-8-ipv6-in-practice/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS-08-unit-8-ipv6-in-practice/solution"
				},
				{
					title: "IPv6 Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "network systems",
						moduleTitle: "Unit 8: IPv6 in Practice",
						itemTitle: "Unit 8: IPv6 in Practice Transfer Practice",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS-17-unit-8-ipv6-in-practice-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS-17-unit-8-ipv6-in-practice-supplemental-2/solution"
				},
				{
					title: "IPv6 Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "network systems",
						moduleTitle: "Unit 8: IPv6 in Practice",
						itemTitle:
							"Unit 8: IPv6 in Practice Extension Practice",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS-18-unit-8-ipv6-in-practice-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS-18-unit-8-ipv6-in-practice-supplemental-3/solution"
				}
			]
		},
		{
			title: "Unit 9: Firewalls and Host Policy",
			curriculum: [
				{
					title: "UFW Basics",
					content:
						"UFW provides a safe, readable host-policy layer before raw packet-filter syntax becomes necessary. Allow, deny, limit, delete, and numbered rules are enough to build deliberate service exposure while keeping the recovery path understandable."
				},
				{
					title: "Application Profiles, Logging, and Safe Rollout",
					content:
						"Application profiles, logging, and staged rule rollout treat firewall changes as operational changes with recovery plans. SSH access comes first, intended exposure is documented, and rules are verified from another session before assuming the host is still reachable."
				},
				{
					title: "UFW versus iptables and nftables",
					content:
						"Explain UFW as a policy layer over lower-level packet filtering instead of treating it as a completely separate system. The abstraction remains visible without forcing raw packet-filter syntax too early."
				},
				{
					title: "Project: Build and Verify a UFW Policy for a Web Server",
					content:
						"Use the UFW lab to allow only the intended service surface, keep remote administration safe, and verify the result from another host. Write down which ports are intentionally reachable, which are not, and how they proved both claims.",
					projectLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS3-UFW-Web-Server-Policy/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS3-UFW-Web-Server-Policy/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Operations Notebook: Firewalls and Host Policy",
					content:
						"Keep a short operations notebook for firewalls and host policy that records the commands run, key outputs, one network diagram, and one plain-language explanation of what the evidence proves. Focus especially on numbered rules, safe rollout order, and which evidence proves a rule change really took effect so the explanation stays grounded in observed network state rather than guesses.",
					projectLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS3-UFW-Web-Server-Policy/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS3-UFW-Web-Server-Policy/solution"
				},
				{
					title: "Firewall Policy Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "network systems",
						moduleTitle: "Unit 9: Firewalls and Host Policy",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS-19-unit-9-firewalls-and-host-policy-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS-19-unit-9-firewalls-and-host-policy-supplemental-2/solution"
				},
				{
					title: "Firewall Policy Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "network systems",
						moduleTitle: "Unit 9: Firewalls and Host Policy",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS-20-unit-9-firewalls-and-host-policy-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS-20-unit-9-firewalls-and-host-policy-supplemental-3/solution"
				}
			]
		},
		{
			title: "Unit 10: Packet Capture and Deep Inspection",
			curriculum: [
				{
					title: "tcpdump and Beginner-Friendly Packet Anatomy",
					content:
						"`tcpdump` is the first deep-inspection tool for failures that ports, routes, and DNS no longer explain alone. Begin by identifying source, destination, protocol, ports, and the broad shape of the exchange rather than trying to decode every bit of every header."
				},
				{
					title: "Safe Filter Expressions",
					content:
						"Use small, safe filter expressions such as host, port, and protocol filters so captures stay focused and readable. Learn that the capture filter is part of the diagnostic design, not just an optimization for large networks."
				},
				{
					title: "Host Capture versus Router Capture",
					content:
						"Capture placement is a diagnostic decision. Capturing on the host answers whether the host sent or received packets at all; capturing on a router or edge device answers whether the path is dropping or rewriting traffic before it reaches the service."
				},
				{
					title: "Project: Capture and Analyze a Local HTTP Request with tcpdump",
					content:
						"Use the packet-capture lab to watch one HTTP request from client to server and back, then identify the source port, destination port, and the packets that represent the response. The point is to make one full request visible in the capture rather than collecting noise.",
					projectLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS5-Tcpdump-HTTP-Capture/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS5-Tcpdump-HTTP-Capture/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Operations Notebook: Packet Capture and Deep Inspection",
					content:
						"Keep a short operations notebook for packet capture and deep inspection that records the commands run, key outputs, one network diagram, and one plain-language explanation of what the evidence proves. Focus especially on capture placement, filter choice, and which packets confirmed the hypothesis so the explanation stays grounded in observed network state rather than guesses.",
					projectLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS5-Tcpdump-HTTP-Capture/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS5-Tcpdump-HTTP-Capture/solution"
				},
				{
					title: "Packet Capture Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "network systems",
						moduleTitle:
							"Unit 10: Packet Capture and Deep Inspection",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS-21-unit-10-packet-capture-and-deep-inspection-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS-21-unit-10-packet-capture-and-deep-inspection-supplemental-2/solution"
				},
				{
					title: "Packet Capture Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "network systems",
						moduleTitle:
							"Unit 10: Packet Capture and Deep Inspection",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS-22-unit-10-packet-capture-and-deep-inspection-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS-22-unit-10-packet-capture-and-deep-inspection-supplemental-3/solution"
				}
			]
		},
		{
			title: "Unit 11: Common Application Protocols",
			curriculum: [
				{
					title: "HTTP and HTTPS",
					content:
						"HTTP and HTTPS connect protocol behavior back to ports, hostnames, and TLS. The useful comparison is what remains visible before encryption, what becomes opaque after TLS starts, and why HTTPS diagnostics often require both packet-level and application-level evidence."
				},
				{
					title: "SSH as a Diagnostic and Administrative Protocol",
					content:
						"Treat SSH as both an application protocol and an operational dependency. If SSH works while the public app does not, that contrast becomes a powerful clue about listening services, firewall rules, routing, and reverse proxy layers."
				},
				{
					title: "SMTP and DNS as Support Protocols",
					content:
						"SMTP and DNS show that not every important network protocol looks like interactive browsing. Name resolution and mail transport still depend on the same reachability, port, policy, and evidence-gathering habits used throughout the course."
				},
				{
					title: "How TLS Changes Visibility",
					content:
						"TLS protects application payload visibility but does not make the existence of the connection itself invisible. Addresses, ports, timing, certificate negotiation, and connection metadata can remain visible even when application content becomes opaque."
				},
				{
					title: "Unit 11: Common Application Protocols: Core Project",
					content: buildProjectGuidance({
						courseFamily: "network systems",
						moduleTitle: "Unit 11: Common Application Protocols",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS-09-unit-11-common-application-protocols/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS-09-unit-11-common-application-protocols/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Operations Notebook: Common Application Protocols",
					content:
						"Keep a short operations notebook for common application protocols that records the commands run, key outputs, one network diagram, and one plain-language explanation of what the evidence proves. Focus especially on which parts of the exchange were visible at the transport layer and which parts moved behind TLS so the explanation stays grounded in observed network state rather than guesses.",
					projectLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS-09-unit-11-common-application-protocols/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS-09-unit-11-common-application-protocols/solution"
				},
				{
					title: "Application Protocol Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "network systems",
						moduleTitle: "Unit 11: Common Application Protocols",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS-23-unit-11-common-application-protocols-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS-23-unit-11-common-application-protocols-supplemental-2/solution"
				},
				{
					title: "Application Protocol Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "network systems",
						moduleTitle: "Unit 11: Common Application Protocols",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS-24-unit-11-common-application-protocols-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS-24-unit-11-common-application-protocols-supplemental-3/solution"
				}
			]
		},
		{
			title: "Unit 12: Secure Exposure of Services",
			curriculum: [
				{
					title: "Expose Only What Must Be Reachable",
					content:
						"Exposure is a deliberate design decision, not a side effect of starting a service. A defensible service map names which ports are public, which ports stay private, and how firewall or proxy layers enforce that boundary."
				},
				{
					title: "Reverse Proxy and Firewall Layering",
					content:
						"Use reverse proxies and firewall rules together to show how multiple layers can protect or simplify service exposure. This keeps the course aligned with modern deployment practice where the app process often is not the only public-facing network surface."
				},
				{
					title: "Safe Port Forwarding and External Validation",
					content:
						"Safe port forwarding is a last-mile exposure step that must be paired with limited scope and outside verification. Testing from the same host is not enough once the real question is whether another machine on another segment can reach the service."
				},
				{
					title: "Project Pass: Validate the NAT and Exposure Topology from Outside",
					content:
						"Return to the router and NAT lab and treat it as the capstone exposure exercise: decide which service is reachable, limit what is exposed, and verify the result from another network position. The project ties together routing, firewalls, listening services, and diagnostics into one defensible path explanation.",
					projectLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS6-Router-NAT-Topology-Lab/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS6-Router-NAT-Topology-Lab/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Operations Notebook: Secure Exposure of Services",
					content:
						"Keep a short operations notebook for secure exposure of services that records the commands run, key outputs, one network diagram, and one plain-language explanation of what the evidence proves. Focus especially on what is intentionally public, what stays private, and which external test proved the boundary so the explanation stays grounded in observed network state rather than guesses.",
					projectLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS6-Router-NAT-Topology-Lab/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS6-Router-NAT-Topology-Lab/solution"
				},
				{
					title: "Secure Exposure Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "network systems",
						moduleTitle: "Unit 12: Secure Exposure of Services",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS-25-unit-12-secure-exposure-of-services-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS-25-unit-12-secure-exposure-of-services-supplemental-2/solution"
				},
				{
					title: "Secure Exposure Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "network systems",
						moduleTitle: "Unit 12: Secure Exposure of Services",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS-26-unit-12-secure-exposure-of-services-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS-26-unit-12-secure-exposure-of-services-supplemental-3/solution"
				}
			]
		},
		{
			title: "NS13 Expansion Ideas and Next Steps",
			curriculum: [
				{
					title: "VPN and Tunneling Concepts",
					content:
						"Offer VPN and tunneling as the next step after interfaces, routes, and exposure boundaries are already clear. These topics make far more sense after ordinary reachability works without the tunnel."
				},
				{
					title: "BGP and Internet Routing at a High Level",
					content:
						"Treat BGP and broader internet routing as an advanced appendix rather than a prerequisite. The useful outcome is seeing how route announcements and policy shape the public internet beyond the single-host route table used in the core course."
				},
				{
					title: "Wireless and Home-Network Variations",
					content:
						"Add wireless networking and WPA or WPA2 basics as a follow-on topic that changes the link layer but still preserves much of the same routing, addressing, and service-diagnostic logic from the course."
				},
				{
					title: "Cloud Networking Patterns",
					content:
						"Use cloud networking patterns such as security groups, load balancers, and VPC boundaries as the natural next specialization for deployment or infrastructure work. These ideas land better once host firewalls, ports, routes, and controlled exposure already feel concrete."
				},
				{
					title: "NS13 Expansion Ideas and Next Steps: Core Project",
					content: buildProjectGuidance({
						courseFamily: "network systems",
						moduleTitle: "NS13 Expansion Ideas and Next Steps",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS-10-ns13-expansion-ideas-and-next-steps/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS-10-ns13-expansion-ideas-and-next-steps/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Operations Notebook: Expansion Ideas and Next Steps",
					content:
						"Keep a short operations notebook for expansion ideas and next steps that records the commands run, key outputs, one network diagram, and one plain-language explanation of what the evidence proves. Focus especially on which advanced networking path fits the learning goals and why; the explanation stays grounded in observed network state rather than guesses.",
					projectLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS-10-ns13-expansion-ideas-and-next-steps/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS-10-ns13-expansion-ideas-and-next-steps/solution"
				},
				{
					title: "Next Steps Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "network systems",
						moduleTitle: "NS13 Expansion Ideas and Next Steps",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS-27-ns13-expansion-ideas-and-next-steps-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS-27-ns13-expansion-ideas-and-next-steps-supplemental-2/solution"
				},
				{
					title: "Next Steps Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "network systems",
						moduleTitle: "NS13 Expansion Ideas and Next Steps",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS-28-ns13-expansion-ideas-and-next-steps-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS-28-ns13-expansion-ideas-and-next-steps-supplemental-3/solution"
				}
			]
		},
		{
			title: "Network Systems Lab 15: Diagnostic Workflow Studio",
			curriculum: [
				{
					title: "Diagnostic Workflow Studio: Core Concepts",
					content: buildImplementationLabGuidance({
						courseFamily: "network systems",
						moduleTitle:
							"Network Systems Lab 15: Diagnostic Workflow Studio",
						section: "concepts"
					})
				},
				{
					title: "Diagnostic Workflow Studio: Guided Example",
					content: buildImplementationLabGuidance({
						courseFamily: "network systems",
						moduleTitle:
							"Network Systems Lab 15: Diagnostic Workflow Studio",
						section: "example"
					})
				},
				{
					title: "Diagnostic Workflow Studio: Core Project",
					content: buildImplementationLabGuidance({
						courseFamily: "network systems",
						moduleTitle:
							"Network Systems Lab 15: Diagnostic Workflow Studio",
						section: "coreProject"
					}),
					projectLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS-01-network-systems-lab-15/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS-01-network-systems-lab-15/solution"
				},
				{
					title: "Diagnostic Workflow Studio: Review",
					content: buildImplementationLabGuidance({
						courseFamily: "network systems",
						moduleTitle:
							"Network Systems Lab 15: Diagnostic Workflow Studio",
						section: "review"
					})
				}
			],
			supplementalProjects: [
				{
					title: "Diagnostic Workflow Studio: Extension Challenge",
					content: buildImplementationLabGuidance({
						courseFamily: "network systems",
						moduleTitle:
							"Network Systems Lab 15: Diagnostic Workflow Studio",
						section: "extension"
					}),
					projectLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS-01-network-systems-lab-15/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS-01-network-systems-lab-15/solution"
				},
				{
					title: "Diagnostic Workflow Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "network systems",
						moduleTitle:
							"Network Systems Lab 15: Diagnostic Workflow Studio",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS-29-applied-studio-15-network-systems-lab-15-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS-29-applied-studio-15-network-systems-lab-15-supplemental-2/solution"
				},
				{
					title: "Diagnostic Workflow Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "network systems",
						moduleTitle:
							"Network Systems Lab 15: Diagnostic Workflow Studio",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS-30-applied-studio-15-network-systems-lab-15-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS-30-applied-studio-15-network-systems-lab-15-supplemental-3/solution"
				}
			]
		},
		{
			title: "Network Systems Lab 16: Service Exposure Studio",
			curriculum: [
				{
					title: "Service Exposure Studio: Core Concepts",
					content: buildImplementationLabGuidance({
						courseFamily: "network systems",
						moduleTitle:
							"Network Systems Lab 16: Service Exposure Studio",
						section: "concepts"
					})
				},
				{
					title: "Service Exposure Studio: Guided Example",
					content: buildImplementationLabGuidance({
						courseFamily: "network systems",
						moduleTitle:
							"Network Systems Lab 16: Service Exposure Studio",
						section: "example"
					})
				},
				{
					title: "Service Exposure Studio: Core Project",
					content: buildImplementationLabGuidance({
						courseFamily: "network systems",
						moduleTitle:
							"Network Systems Lab 16: Service Exposure Studio",
						section: "coreProject"
					}),
					projectLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS-02-network-systems-lab-16/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS-02-network-systems-lab-16/solution"
				},
				{
					title: "Service Exposure Studio: Review",
					content: buildImplementationLabGuidance({
						courseFamily: "network systems",
						moduleTitle:
							"Network Systems Lab 16: Service Exposure Studio",
						section: "review"
					})
				}
			],
			supplementalProjects: [
				{
					title: "Service Exposure Studio: Extension Challenge",
					content: buildImplementationLabGuidance({
						courseFamily: "network systems",
						moduleTitle:
							"Network Systems Lab 16: Service Exposure Studio",
						section: "extension"
					}),
					projectLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS-02-network-systems-lab-16/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS-02-network-systems-lab-16/solution"
				},
				{
					title: "Service Exposure Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "network systems",
						moduleTitle:
							"Network Systems Lab 16: Service Exposure Studio",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS-31-applied-studio-16-network-systems-lab-16-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS-31-applied-studio-16-network-systems-lab-16-supplemental-2/solution"
				},
				{
					title: "Service Exposure Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "network systems",
						moduleTitle:
							"Network Systems Lab 16: Service Exposure Studio",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS-32-applied-studio-16-network-systems-lab-16-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS-32-applied-studio-16-network-systems-lab-16-supplemental-3/solution"
				}
			]
		},
		{
			title: "Network Systems Lab 17: Operations Capstone Studio",
			curriculum: [
				{
					title: "Operations Capstone Studio: Core Concepts",
					content: buildImplementationLabGuidance({
						courseFamily: "network systems",
						moduleTitle:
							"Network Systems Lab 17: Operations Capstone Studio",
						section: "concepts"
					})
				},
				{
					title: "Operations Capstone Studio: Guided Example",
					content: buildImplementationLabGuidance({
						courseFamily: "network systems",
						moduleTitle:
							"Network Systems Lab 17: Operations Capstone Studio",
						section: "example"
					})
				},
				{
					title: "Operations Capstone Studio: Core Project",
					content: buildImplementationLabGuidance({
						courseFamily: "network systems",
						moduleTitle:
							"Network Systems Lab 17: Operations Capstone Studio",
						section: "coreProject"
					}),
					projectLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS-03-network-systems-lab-17/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS-03-network-systems-lab-17/solution"
				},
				{
					title: "Operations Capstone Studio: Review",
					content: buildImplementationLabGuidance({
						courseFamily: "network systems",
						moduleTitle:
							"Network Systems Lab 17: Operations Capstone Studio",
						section: "review"
					})
				}
			],
			supplementalProjects: [
				{
					title: "Operations Capstone Studio: Extension Challenge",
					content: buildImplementationLabGuidance({
						courseFamily: "network systems",
						moduleTitle:
							"Network Systems Lab 17: Operations Capstone Studio",
						section: "extension"
					}),
					projectLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS-03-network-systems-lab-17/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS-03-network-systems-lab-17/solution"
				},
				{
					title: "Operations Capstone Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "network systems",
						moduleTitle:
							"Network Systems Lab 17: Operations Capstone Studio",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS-33-applied-studio-17-network-systems-lab-17-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS-33-applied-studio-17-network-systems-lab-17-supplemental-2/solution"
				},
				{
					title: "Operations Capstone Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "network systems",
						moduleTitle:
							"Network Systems Lab 17: Operations Capstone Studio",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS-34-applied-studio-17-network-systems-lab-17-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Network-Systems/tree/main/NS-34-applied-studio-17-network-systems-lab-17-supplemental-3/solution"
				}
			]
		}
	]
};

interface NetworkSystemsModuleFlow {
	stage: string;
	estimatedTime: string;
	keyBlocks: string[];
	practiceSection: string;
	answerSection: string;
	route: string;
	safeRoute: string;
	evidence: string;
	reference: string;
}

const NETWORK_PRACTICE_PACK =
	"/course-assets/network/network-systems-practice-pack.md";
const NETWORK_VERIFICATION_GUIDE =
	"/course-assets/network/network-systems-verification-guide.md";
const NETWORK_PRIMARY_MODULE_COUNT = 13;

const NETWORK_MODULE_FLOW: Record<string, NetworkSystemsModuleFlow> = {
	"NS0 Setup and Tooling": {
		stage: "Lab readiness",
		estimatedTime: "2–3 sessions · 45–60 minutes each",
		keyBlocks: [
			"owned boundary",
			"environment identity",
			"tool inventory",
			"baseline state",
			"stop condition",
			"cleanup route"
		],
		practiceSection: "lab-boundary-and-readiness-case",
		answerSection: "lab-boundary-and-readiness-key",
		route: "Begin in an owned Ubuntu Server 26.04 LTS VM, with Debian 13 as a supported comparison route. Record distribution, kernel, interfaces, addresses, routes, resolver state, listening sockets, firewall state, network mode, snapshot, and tool versions before changing anything.",
		safeRoute:
			"Use loopback, host-only networking, user-mode NAT, or isolated namespaces. Keep bridged adapters, public listeners, real credentials, home-router changes, school or employer networks, and cloud infrastructure outside the lab. The supplied readiness transcript completes the same reasoning without a VM.",
		evidence:
			"A lab card names the owned target, allowed interfaces and addresses, tools, expected traffic, stop conditions, baseline commands, snapshot or cleanup path, and the exact evidence that marks the environment ready.",
		reference: "https://documentation.ubuntu.com/release-notes/26.04/"
	},
	"Unit 1: The Network Stack in Plain English": {
		stage: "Trace one request",
		estimatedTime: "4 sessions · 45–60 minutes each",
		keyBlocks: [
			"application request",
			"socket",
			"transport",
			"packet",
			"frame",
			"response path"
		],
		practiceSection: "request-path-and-transport-case",
		answerSection: "request-path-and-transport-key",
		route: "Trace one local client request from process and socket through source and destination ports, IP packet, local-link frame, receiving socket, application response, and return path. Compare TCP connection state and retransmission with UDP's application-managed delivery expectations.",
		safeRoute:
			"Use a supplied loopback request transcript and packet summary before running a toy local service. No external host is needed, and no layer is inferred from a diagram when a process, socket, route, or packet field can provide direct evidence.",
		evidence:
			"The trace distinguishes interface, frame, packet, transport segment or datagram, socket, port, process, and application data; it identifies what changes at each hop and what remains end to end.",
		reference: "https://www.rfc-editor.org/rfc/rfc9293.html"
	},
	"Unit 2: Addresses and Naming": {
		stage: "Identify endpoints",
		estimatedTime: "4 sessions · 45–60 minutes each",
		keyBlocks: [
			"link address",
			"IPv4 scope",
			"IPv6 scope",
			"prefix",
			"hostname",
			"resolved endpoint"
		],
		practiceSection: "address-name-and-scope-case",
		answerSection: "address-name-and-scope-key",
		route: "Classify each observed identifier as interface name, link-layer address, IPv4 or IPv6 address and prefix, hostname, DNS record, socket endpoint, or URL. Record scope explicitly so loopback, link-local, private, documentation, and globally routed values are not treated as interchangeable.",
		safeRoute:
			"Use reserved documentation addresses, fictional names under `.test`, and supplied A/AAAA answers. Do not publish personal hostnames, MAC addresses, private topology details, or real service inventory in submitted work.",
		evidence:
			"The endpoint map separates name from address, address from prefix, interface identity from host identity, and DNS success from transport reachability; every IPv6 address includes its scope and any required zone identifier.",
		reference: "https://www.rfc-editor.org/rfc/rfc4291.html"
	},
	"Unit 3: Switches, Routers, NAT, and the Internet Edge": {
		stage: "Explain forwarding",
		estimatedTime: "4–5 sessions · 45–60 minutes each",
		keyBlocks: [
			"local prefix",
			"default gateway",
			"forwarding decision",
			"next hop",
			"NAT state",
			"return route"
		],
		practiceSection: "subnet-route-and-nat-case",
		answerSection: "subnet-route-and-nat-key",
		route: "Decide whether a destination is local, identify the selected route and next hop, explain the router's forwarding decision, then track source or destination translation separately from routing. Include the return path so one-way reachability is not mistaken for a complete connection.",
		safeRoute:
			"Build only inside disposable namespaces or an owned host-only VM topology. Use reserved lab prefixes, record all namespace and veth names, avoid host forwarding or home-router edits, and define cleanup before creation.",
		evidence:
			"The topology and route tables predict each hop, neighbor lookup, translated tuple, and return path; tests confirm the prediction, and the cleanup removes every namespace and virtual link created by the lab.",
		reference: "https://ubuntu.com/server/docs/introduction-to-networking"
	},
	"Unit 4: Ports and Listening Services": {
		stage: "Map exposure",
		estimatedTime: "3–4 sessions · 45–60 minutes each",
		keyBlocks: [
			"process",
			"socket",
			"bind address",
			"port",
			"protocol",
			"reachability claim"
		],
		practiceSection: "listener-and-reachability-case",
		answerSection: "listener-and-reachability-key",
		route: "Map each course-owned listener to protocol, local address, port, process, user, and intended audience. Separate a bound socket from host-policy permission, route availability, and a successful application response.",
		safeRoute:
			"Inventory only the owned lab host or supplied `ss` and `lsof` output. Do not enumerate shared machines, expose a wildcard listener beyond the isolated segment, or treat a process name as authorization to probe it.",
		evidence:
			"The service map classifies loopback-only, lab-segment, and review-needed listeners, ties each to a process and owner, records the local application check, and states what additional bounded test is required before claiming remote reachability.",
		reference: "https://man7.org/linux/man-pages/man8/ss.8.html"
	},
	"Unit 5: DNS and Name Resolution": {
		stage: "Resolve and compare",
		estimatedTime: "4 sessions · 45–60 minutes each",
		keyBlocks: [
			"query name",
			"record type",
			"resolver",
			"authority",
			"cache",
			"application result"
		],
		practiceSection: "dns-resolution-and-cache-case",
		answerSection: "dns-resolution-and-cache-key",
		route: "Record the exact name, record type, resolver, answer, TTL, authority or recursion path, local override, and application result. Compare A and AAAA answers without assuming the preferred family or claiming that a correct answer proves the service is reachable.",
		safeRoute:
			"Use fictional `.test` zones, reserved addresses, and supplied `dig` transcripts for resolver and cache reasoning. Queries to approved public documentation names remain optional and never include internal names or identifying resolver details in shared work.",
		evidence:
			"The diagnosis distinguishes no answer, negative answer, stale or cached answer, wrong resolver, local override, and transport failure; it identifies which observation rules out each competing explanation.",
		reference: "https://bind9.readthedocs.io/en/v9.20.23/manpages.html"
	},
	"Unit 6: Core Diagnostics": {
		stage: "Find the first failing layer",
		estimatedTime: "4–5 sessions · 45–60 minutes each",
		keyBlocks: [
			"scope",
			"baseline",
			"evidence ladder",
			"failure signature",
			"single change",
			"retest"
		],
		practiceSection: "diagnostic-evidence-ladder-case",
		answerSection: "diagnostic-evidence-ladder-key",
		route: "Diagnose from nearest dependency outward: process state, listener, local application response, address and route, resolver, host policy, transport probe, remote application response, then bounded packet evidence. Classify timeout, refusal, reset, name failure, route failure, and application error before editing configuration.",
		safeRoute:
			"Use the supplied two-host transcript or two owned lab endpoints. Every command targets one declared address and port; range scans, broad discovery, repeated public probes, and changes made before the failure signature is recorded remain out of scope.",
		evidence:
			"The incident record names the first failing gate, cites the command and output that prove it, rejects at least two plausible alternatives, applies one narrow correction, and repeats the same checks to demonstrate recovery.",
		reference: "https://curl.se/docs/manpage.html"
	},
	"Unit 7: Linux Interface and Route Management": {
		stage: "Read and change local state",
		estimatedTime: "4–5 sessions · 45–60 minutes each",
		keyBlocks: [
			"link state",
			"address",
			"route selection",
			"neighbor",
			"temporary change",
			"revert"
		],
		practiceSection: "interface-route-and-neighbor-case",
		answerSection: "interface-route-and-neighbor-key",
		route: "Read link state, addresses and lifetimes, policy and main routes, selected source and next hop, and neighbor state before making a temporary namespace or VM-only change. Distinguish immediate `ip` state from persistent Netplan, NetworkManager, or systemd-networkd configuration.",
		safeRoute:
			"Never flush, down, rename, or replace a host interface or default route. Practice on a named namespace or disposable VM console, save the baseline, keep a second access path for any remote lab, and use the supplied transcript when recovery cannot be guaranteed.",
		evidence:
			"`ip route get` matches the predicted source, interface, and next hop; neighbor state is interpreted in context; the temporary change has one stated purpose; and the exact revert restores the recorded baseline.",
		reference:
			"https://ubuntu.com/server/docs/explanation/networking/configuring-networks/"
	},
	"Unit 8: IPv6 in Practice": {
		stage: "Diagnose dual stack",
		estimatedTime: "4–5 sessions · 45–60 minutes each",
		keyBlocks: [
			"address scope",
			"prefix",
			"neighbor discovery",
			"A and AAAA",
			"family-specific listener",
			"dual-stack result"
		],
		practiceSection: "ipv6-dual-stack-case",
		answerSection: "ipv6-dual-stack-key",
		route: "Trace IPv6 independently through interface scope, prefix, route, neighbor discovery, resolver answer, listener family, host policy, and application response. Compare it with IPv4 only after each family has its own evidence path.",
		safeRoute:
			"Use loopback, link-local addresses with explicit interfaces, documentation prefixes, supplied route and resolver output, or an isolated namespace pair. No global IPv6 listener or external reachability test is required.",
		evidence:
			"The report explains `::1`, link-local, and global-unicast scope; identifies the selected IPv6 route and listener; compares A and AAAA behavior; and locates one family-specific failure without using IPv4 success as a substitute.",
		reference: "https://www.rfc-editor.org/rfc/rfc8200.html"
	},
	"Unit 9: Firewalls and Host Policy": {
		stage: "Limit exposure",
		estimatedTime: "4–5 sessions · 45–60 minutes each",
		keyBlocks: [
			"baseline rules",
			"least exposure",
			"dry run",
			"alternate access",
			"verification",
			"rollback"
		],
		practiceSection: "firewall-policy-and-rollback-case",
		answerSection: "firewall-policy-and-rollback-key",
		route: "Translate an allowed-traffic statement into the narrowest host policy, inspect current defaults and numbered rules, preview the change, preserve administration access, apply one rule at a time, and verify both allowed and intentionally blocked paths.",
		safeRoute:
			"Use supplied UFW output first and apply rules only inside the owned VM with console or second-session recovery. Never enable a generated policy blindly, alter a shared host, open a public port, or leave the lab enabled after its cleanup gate.",
		evidence:
			"The policy matrix matches the applied IPv4 and IPv6 rules, logs identify the intended decision, the management route remains available, unrelated ports remain closed, and delete/reset plus snapshot rollback returns to the baseline.",
		reference: "https://ubuntu.com/server/docs/security-firewall/"
	},
	"Unit 10: Packet Capture and Deep Inspection": {
		stage: "Answer one packet question",
		estimatedTime: "4 sessions · 45–60 minutes each",
		keyBlocks: [
			"capture authority",
			"interface",
			"filter",
			"packet limit",
			"field interpretation",
			"redaction"
		],
		practiceSection: "bounded-packet-capture-case",
		answerSection: "bounded-packet-capture-key",
		route: "Write one question before opening a capture, select the owned interface and exact host or port filter, cap packet count or duration, generate one known local flow, and interpret only the fields needed to answer the question.",
		safeRoute:
			"Use the supplied packet excerpt by default. Live capture is limited to traffic generated entirely inside the owned lab, with no promiscuous capture, broad interface, third-party payload, credential, session token, or identifying address included in submitted evidence.",
		evidence:
			"The capture note records authority, interface, filter, limit, generated flow, timestamps, source and destination tuple, relevant flags or DNS fields, conclusion, uncertainty, and a redacted minimal excerpt.",
		reference:
			"https://www.wireshark.org/docs/wsug_html_chunked/ChCapCaptureFilterSection.html"
	},
	"Unit 11: Common Application Protocols": {
		stage: "Interpret application evidence",
		estimatedTime: "4–5 sessions · 45–60 minutes each",
		keyBlocks: [
			"request and response",
			"protocol state",
			"status evidence",
			"TLS boundary",
			"certificate identity",
			"visibility limit"
		],
		practiceSection: "protocol-and-tls-visibility-case",
		answerSection: "protocol-and-tls-visibility-key",
		route: "Compare HTTP, HTTPS, SSH, SMTP, and DNS by purpose, transport, message or handshake evidence, identity check, success signal, and common failure. Explain what TLS protects, what metadata remains visible, and what an encrypted packet trace cannot prove about application content.",
		safeRoute:
			"Use supplied transcripts, a loopback HTTP service, fictional mail dialogue, and a local or documentation certificate. Do not connect to unauthorized administration services, send mail, reuse credentials, weaken TLS, or submit private keys or session data.",
		evidence:
			"The protocol comparison identifies expected exchange, port convention without treating it as identity, success or failure signal, TLS visibility boundary, certificate-name result, and one limitation of the observed evidence.",
		reference: "https://datatracker.ietf.org/doc/html/rfc8446"
	},
	"Unit 12: Secure Exposure of Services": {
		stage: "Expose the minimum local path",
		estimatedTime: "5–6 sessions · 45–60 minutes each",
		keyBlocks: [
			"service identity",
			"bind address",
			"reverse proxy",
			"host policy",
			"external lab check",
			"closure proof"
		],
		practiceSection: "least-exposure-service-case",
		answerSection: "least-exposure-service-key",
		route: "Start with a loopback toy service, place a local reverse proxy in front of it, define the intended client segment and one allowed port, then verify process, listener, route, policy, proxy response, and intentionally closed alternatives as separate gates.",
		safeRoute:
			"Keep every endpoint inside the owned host-only or namespace topology. Public DNS, public certificates, router port forwarding, cloud security groups, real domains, internet validation, and persistent exposure are not required.",
		evidence:
			"The exposure record proves the upstream remains loopback-only, the proxy is the only client-facing lab listener, host policy matches the declared client and port, the application response succeeds, unrelated paths fail, and cleanup removes the listener and rule.",
		reference: "https://nginx.org/en/docs/http/ngx_http_proxy_module.html"
	},
	"Network Systems Lab 17: Operations Capstone Studio": {
		stage: "Routed operations capstone",
		estimatedTime: "8–12 sessions · 45–60 minutes each",
		keyBlocks: [
			"isolated topology",
			"dual-stack evidence",
			"local service",
			"least exposure",
			"failure diagnosis",
			"cleanup runbook"
		],
		practiceSection: "routed-operations-capstone-case",
		answerSection: "routed-operations-capstone-key",
		route: "Build one disposable client-router-server topology through vertical slices: boundary card, addresses and routes, local DNS record, toy service and listener, least-exposure policy, application check, bounded packet trace, two failures from different layers, correction, retest, and complete cleanup.",
		safeRoute:
			"Use network namespaces or owned host-only VMs with reserved addresses, fictional names, loopback or lab-segment listeners, supplied packet data, and a snapshot or cleanup script. No bridge, public route, home-router change, cloud credential, real domain, or third-party probe belongs in the capstone.",
		evidence:
			"The operations packet includes topology, versions, scope, baseline, route and listener proof, DNS and application results, policy matrix, minimal packet interpretation, two first-failing-layer diagnoses, corrected retests, cleanup proof, and known limitations.",
		reference: "https://ubuntu.com/server/docs/how-to/networking/"
	}
};

function networkPracticeLink(section: string) {
	return `${NETWORK_PRACTICE_PACK}#${section}`;
}

function networkVerificationLink(section: string) {
	return `${NETWORK_VERIFICATION_GUIDE}#${section}`;
}

function networkSupplementalPath(title: string) {
	if (/extension|challenge/i.test(title)) return "challenge" as const;
	if (/operations notebook/i.test(title)) return "core" as const;
	return "choice" as const;
}

function networkArchivePath(title: string) {
	const learningPath = networkSupplementalPath(title);
	return learningPath === "core" ? ("choice" as const) : learningPath;
}

function decorateNetworkSystemsModule(
	module: RawCourse["modules"][number]
): RawCourse["modules"][number] {
	const flow = NETWORK_MODULE_FLOW[module.title];
	if (!flow) throw new Error(`Missing Network Systems flow: ${module.title}`);

	const practiceLink = networkPracticeLink(flow.practiceSection);
	const verificationLink = networkVerificationLink(flow.answerSection);
	const curriculum = module.curriculum.map((item, index) => ({
		...item,
		content:
			index === 0
				? `**Course flow:** ${flow.stage}. ${flow.route}

**Safe practice route:** ${flow.safeRoute}

**Evidence gate:** ${flow.evidence}

**Local continuity:** Use the [supplied practice case](${practiceLink}) when a compatible Linux environment, isolated topology, approved packet capture, or safe privileged route is unavailable. Record an independent diagnosis before comparing it with the [verification guide](${verificationLink}).

**Primary reference:** [Open the current reference](${flow.reference}). Record the distribution, command version, address family, interface, and lab boundary when behavior is environment-sensitive.

${item.content}`
				: item.content,
		learningPath: "core" as const,
		...(item.projectLink
			? {
					datasetLink: item.datasetLink ?? practiceLink,
					mediaLink: item.mediaLink ?? flow.reference
				}
			: {})
	}));

	return {
		...module,
		kind: "module",
		estimatedTime: flow.estimatedTime,
		keyBlocks: [...flow.keyBlocks],
		curriculum,
		supplementalProjects: module.supplementalProjects.map(item => ({
			...item,
			learningPath: networkSupplementalPath(item.title),
			datasetLink: item.datasetLink ?? practiceLink,
			mediaLink: item.mediaLink ?? flow.reference
		}))
	};
}

function buildOptionalNetworkStudioArchive(
	modules: RawCourse["modules"]
): RawCourse["modules"][number] {
	const practiceLink = networkPracticeLink("routed-operations-capstone-case");
	const verificationLink = networkVerificationLink(
		"routed-operations-capstone-key"
	);
	const reference = "https://ubuntu.com/server/docs/how-to/networking/";

	return {
		kind: "appendix",
		title: "Optional Network Expansion and Integration Studio Archive",
		estimatedTime:
			"Choose one 3–5-session topic or studio when extra transfer is useful",
		keyBlocks: [
			"VPN concepts",
			"internet routing",
			"diagnostic workflow",
			"service exposure",
			"bounded evidence",
			"transfer"
		],
		curriculum: [
			{
				title: "Network Expansion and Integration Archive Guide",
				content: `**Course flow:** NS13 Expansion Ideas and Next Steps, Network Systems Lab 15: Diagnostic Workflow Studio, and Network Systems Lab 16: Service Exposure Studio are optional enrichment after their matching required units. Select one topic or studio to revisit a weak evidence ladder, exposure boundary, or conceptual extension; completing all three is not required before Network Systems Lab 17: Operations Capstone Studio.

**Safe practice route:** Keep the selected work inside the owned isolated topology or use the [supplied capstone case](${practiceLink}). VPN, BGP, wireless, cloud, public routing, real certificates, and public service exposure remain conceptual or transcript-based unless a later course establishes a separately approved lab.

**Evidence gate:** The selected option produces one bounded network question, one topology or transcript, one failure or comparison, one evidence-based conclusion, and one cleanup or scope note.`,
				learningPath: "choice",
				datasetLink: practiceLink,
				solutionLink: verificationLink,
				mediaLink: reference
			}
		],
		supplementalProjects: modules.flatMap(module =>
			[...module.curriculum, ...module.supplementalProjects].map(
				item => ({
					...item,
					learningPath: networkArchivePath(item.title),
					datasetLink: item.datasetLink ?? practiceLink,
					mediaLink: item.mediaLink ?? reference
				})
			)
		)
	};
}

const networkPrimaryModules = networkSystemsSourceCourse.modules
	.slice(0, NETWORK_PRIMARY_MODULE_COUNT)
	.map(decorateNetworkSystemsModule);
const networkCapstoneModule = decorateNetworkSystemsModule(
	networkSystemsSourceCourse.modules.at(-1)!
);
const networkOptionalStudioModules = networkSystemsSourceCourse.modules.slice(
	NETWORK_PRIMARY_MODULE_COUNT,
	-1
);

export const networkSystemsCourse: RawCourse = {
	...networkSystemsSourceCourse,
	modules: [
		...networkPrimaryModules,
		networkCapstoneModule,
		buildOptionalNetworkStudioArchive(networkOptionalStudioModules)
	].map(withNetworkProjectReadings)
};
