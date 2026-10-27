import type { RawCourse } from "./types";
import { buildImplementationLabGuidance } from "./implementationLabGuidance";
import { withNetworkCapstoneReading } from "./networkCapstoneReading";
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
					id: "network-systems-unit-3-switches-routers-nat-and-the-internet-edge-curriculum-switches-routers-nat-and-the-internet-edge-core-concepts",
					title: "Bridged Links, Routed Paths and Translated Connections",
					preserveInstructions: true,
					content:
						"## Follow a frame, a packet and a connection\n\nDraw the client, middle device and server before predicting an outcome. Mark each interface's IP prefix, MAC address and link. A single box can bridge frames, route IP packets, translate connection addresses and apply filtering rules. Those operations answer different questions. The Unit 3 apparatus supplies its configuration so the required work is to explain observations. Unit 7 later asks for forwarding and NAT command edits in NS6. Unit 12 continues that saved NS6 attempt with a restrictive exposure policy. Keep those later configuration tasks distinct from this introduction.\n\n### A bridge connects an Ethernet segment\n\nAn Ethernet frame carries source and destination MAC addresses. A bridge learns source MAC addresses on its ports and uses its forwarding database (FDB) when forwarding frames. A destination not yet learned can require flooding to eligible ports; an FDB entry is therefore a time-bound observation, not an inventory of every attached device. Link state and bridge port state also affect forwarding. The virtual bridge in this exercise has spanning tree disabled and no VLAN exercise. Its results do not demonstrate physical switch behavior, VLAN isolation or spanning-tree convergence.\n\nIn the first topology, client 10.31.0.2/24 and server 10.31.0.3/24 share a bridged link. The client treats the server prefix as on-link. IPv4 neighbor resolution associates an on-link next hop with a link-layer address. The bridge forwards Ethernet frames between its two ports even while the middle namespace's IP forwarding setting is zero. Match actual peer MAC addresses to the learned FDB ports. This is evidence about this bridge configuration; it is not a rule that all traffic through any bridge bypasses every filtering hook.\n\nPause and predict what happens when the server-facing bridge port goes down. Retain the failed request alongside the deliberately changed port state, then compare a fresh successful request after restoration. A timeout alone is ambiguous. The controlled change, actual state and restored result together support the explanation. Keep the original failed result rather than replacing it with the successful retry.\n\n### A router needs an outbound and return path\n\nIn the second topology, the server moves to 10.32.0.2/24 on another link. The middle interfaces are 10.31.0.1/24 and 10.32.0.1/24. Each endpoint has its adjacent middle address as a gateway. For an off-link destination, the client resolves its next hop's MAC address while retaining the remote server as the IP destination. A gateway is the next hop, not a claim that the whole Internet is reachable. The route lookup, selected interface and neighbor entries describe different parts of that decision.\n\nThe middle namespace must also permit IPv4 forwarding. With forwarding disabled, configured connected routes alone do not carry this request between the links. With forwarding enabled and appropriate endpoint return routes, the server receives a fresh request and sees the original client address. Basic routing here needs no address translation. In the optional transfer exercise, removing the client gateway prevents the outbound route; restoring it permits another request. Removing the server's default route then breaks the return direction. Compare both route lookups and each restoration before naming the failed boundary. These constructed failures do not establish that any unrelated timeout has the same cause.\n\n### Translation changes endpoint views\n\nSource NAT (SNAT) in this apparatus changes the source address seen at the server from the client address to the middle device's server-facing address. Preserve the client's numeric local and peer endpoints, the server's observed local and peer endpoints, the actual translation rule and the response token. The two endpoint views can differ while belonging to one observed exchange. Routing determines where packets go; translation changes selected address or port fields. Translation alone does not establish a restrictive policy or application authorization.\n\nThe optional mapping exercise adds destination NAT (DNAT). The client requests the middle device's client-facing address on mapped port 18080; the rule maps that destination to the server on service port 8080. Compare that request with the server's actual local endpoint. Connection tracking maintains translation state for the flow and corresponding replies. The experiment opens a fresh curl process and TCP connection for each case. Removing the mapping and testing a new connection demonstrates that new attempt's outcome. It does not prove that every existing connection immediately loses an earlier mapping. Retain the successful direct request after mapping removal as a separate comparison.\n\n### Boundaries, changed cases and completion\n\nRepeat with the alternate private prefixes and service/mapped ports shown in the guide. Predict the affected gateway, on-link destination and translated peer before reading the report. Match each run's unique token, owned listener PID and UID, raw HTTP result and namespace identities. Use the complete notebook to explain both expected and contrary results. Keep `edge-cases.md` labeled as supplied reasoning cases rather than actual public probes. Python summary programming is optional; collecting a report does not complete the explanation.\n\nA home network can have multiple translation layers, ISP restrictions and an upstream firewall. A port mapping on one router establishes none of those other conditions. A public server can have a directly routed address while still restricting traffic. IPv6 routing, neighbor discovery and policy require their own evidence; this private IPv4 experiment measures none of them. Confirm the worker was reaped, the owned listener disappeared, private namespaces and links were removed, and outer host configuration matched its initial snapshot. Save the original report with the notebook, including errors and remaining uncertainty.\n\nFor further detail, use the [Linux bridge documentation](https://www.kernel.org/doc/html/latest/networking/bridge.html), [route command reference](https://man7.org/linux/man-pages/man8/ip-route.8.html) and [NAT target reference](https://man7.org/linux/man-pages/man8/iptables-extensions.8.html). The actual course guide defines this experiment's narrower scope."
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
						"A local network endpoint includes a transport, address and port; the observed PID connects that socket to a local owner. A TCP connection also has a peer address and port. The same numeric port can be used by TCP and UDP because they are different transports. Preserve the namespace and bind address when comparing rows: loopback, wildcard and a specific interface address describe different local scopes. A familiar port number is a clue rather than an application identity, and a local listener is not proof that a request from another machine succeeds."
				},
				{
					title: "Ephemeral Ports and Client-Side Source Ports",
					content:
						"Explain ephemeral ports to avoid assuming the client side of every connection always uses the same number. This is especially important when reading `ss` output or packet captures and separating server ports from temporary client ports."
				},
				{
					title: "Using ss, netstat, and lsof to Map Services",
					content:
						"Use `ss -ltnp` for TCP listeners and `ss -lunp` for UDP sockets, retaining the actual bind address, port and any visible PID. UDP UNCONN is not TCP LISTEN and does not by itself describe a broken service. `lsof -nP` supplies a process/file-descriptor view that can complement the socket table. Permissions and namespaces can limit or change the visible rows; missing owner text does not establish an unowned socket. An empty lsof selection can return status 1, so keep raw stderr and the other observations before interpreting a nonzero status."
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
						"An authoritative DNS server supplies data for its zone. A recursive resolver follows the lookup process or answers from its cache. Different selected resolvers can return different views, and cached records can remain until their permitted lifetime expires after an authoritative update. Record the actual responding server, question type, response status and time before comparing results. Repeating the same question against another authorized resolver tests a view difference; using two client tools with the same configured resolver does not automatically create two independent views."
				},
				{
					title: "Caching and Resolver State",
					content:
						"DNS cache state and local name-service policy are separate observations. Positive and negative DNS answers can be cached, and a record TTL describes a cache lifetime rather than an IP hop limit. A received NOERROR response with no answer of the requested type differs from NXDOMAIN, and both differ from a missing response. Local hosts data and the Linux Name Service Switch can affect an application lookup without appearing in a direct dig query. Keep the selected DNS server and the actual system lookup path explicit instead of attributing every difference to propagation."
				},
				{
					title: "dig, nslookup, host, and Resolver Configuration",
					content:
						"`dig`, `nslookup` and `host` are DNS clients; their outputs need to be tied to the question and responding server. A system lookup such as `getent ahosts` follows the Linux name-service configuration and can include hosts data and address-family policy. An explicit dig server or port does not redirect getent or edit system files. Compare the full DNS header, typed answers and server with the separate NSS output and statuses. A CNAME is an alias, an A or AAAA value is address data, and neither the presence nor order of these records proves a later application connection."
				},
				{
					title: "Project: Compare IPv4 and IPv6 Resolution for the Same Hostname",
					content:
						"Compare full A and AAAA responses with the separate system NSS lookup. Predict typed record sets and distinguish NODATA, NXDOMAIN, aliases and DNS transport failures in the optional owned resolver. Keep DNS facts separate from application behavior: a missing AAAA answer does not establish an IPv4-only service, and the lookup alone does not measure a client's selected family or connection success.",
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
						"The path tools answer different questions. An ICMP echo reply from `ping` establishes that this particular request and reply succeeded; it does not prove that a TCP service or application is ready. `traceroute` estimates a path from hop-limit responses, `tracepath` can expose path MTU clues, and `mtr` repeats observations over time. An intermediate router can limit diagnostic replies while continuing to forward application traffic, so an isolated missing hop or apparent per-hop loss is not enough to locate an application failure. Record the source machine, protocol, destination and time before comparing results."
				},
				{
					title: "curl, nc, and telnet for Service Checks",
					content:
						"`nc` can test whether a TCP connection is established, while `curl` can exchange HTTP headers or content and report TLS or application errors. A successful TCP connection does not prove that the expected application answered. Use the actual service scheme and a finite connection and total deadline; a plain HTTP service does not become HTTPS by changing the URL. Distinguish direct endpoint observations from proxy behavior and read the HTTP status as well as the command status. `telnet` is useful only for an authorized plain-text protocol experiment; it does not validate TLS or a useful application response."
				},
				{
					title: "Timeout versus Refusal versus Reset",
					content:
						"Treat timeout, refusal and reset as observations that narrow a question rather than identify a unique cause. A timeout can reflect filtering, loss, an absent return path or an application that accepted TCP but did not answer. A refusal is compatible with an absent listener or an active reject. A reset means the conversation was actively closed, without proving which application or policy caused it. Compare listener binding, addresses, routes and any separately authorized policy evidence before proposing a change. Keep the issuing machine explicit: a local destination probe does not measure a second machine's path."
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
					id: "network-systems-unit-8-ipv6-in-practice-curriculum-in-practice-core-concepts",
					title: "Address Families and IPv6 Diagnostic Paths",
					preserveInstructions: true,
					content:
						"## Read an IPv6 path as separate evidence\n\nAn address, prefix, interface, route, neighbor entry, DNS answer, listening socket\nand application response describe different parts of a path. Diagnose IPv6\nusing its own observations before comparing it with IPv4. A successful IPv4\nrequest does not establish that any IPv6 step succeeds.\n\n### Address families, scope and prefixes\n\nIPv6 addresses contain 128 bits. The loopback address ::1 remains within the\ncurrent node and network namespace. A link-local address in fe80::/10 belongs\nto one link; retain the actual interface or zone when identifying a link-local\ndestination or next hop. The same numeric link-local value can exist on two\ndifferent links. A global-unicast address has a different scope, but its shape\nalone proves neither a usable route nor Internet application connectivity.\nThe 2001:db8::/32 examples in the supplied cases are documentation addresses.\n\nA prefix states how many leading bits select a numeric block. A /126 contains\nfour addresses, a /127 contains two and a /128 identifies one. IPv6 has no\nbroadcast address. Do not apply the ordinary IPv4 network/broadcast subtraction\nto every IPv6 prefix, or infer that every numeric member is an assignable\napplication endpoint. Keep calculation, interface assignment and observed\nservice behavior as separate claims.\n\n### Lookup, route and on-link delivery\n\nAn A answer contains IPv4 address data; an AAAA answer contains IPv6 address\ndata. A system NSS lookup can also use local hosts data and system policy.\nAn explicit server selected for a DNS query does not change that system lookup.\nRetain the question, record type, responding server, response status and time\nwhen comparing answers. A CNAME is an alias, a negative name answer differs\nfrom a transport failure, and answer order alone does not establish which\nfamily a later application actually used.\n\nRead the selected IPv6 route, source address and outgoing interface. For an\non-link destination or next hop, Neighbor Discovery provides relevant link-layer\nand reachability information. A FAILED neighbor entry can locate a problem\nbefore a TCP listener or application is reached. An empty passive table does\nnot establish a broken neighbor protocol. Loopback does not exercise on-link\nNeighbor Discovery. The actual loopback route to ::1 is evidence for this local\npath only; the supplied cases cover the separate on-link reasoning.\n\n### Router information, address configuration and next hops\n\nRouter Advertisements can carry prefix information and router information with\ndifferent meanings. An on-link indication, permission for autonomous address\nconfiguration and a nonzero router lifetime are separate facts. SLAAC can use\nadvertised information to form an address. DHCPv6 can provide addresses or\nother configuration. A DHCPv6 lease by itself does not establish the chosen\ndefault router, source address or working application path. Compare actual\naddress state and the selected route instead of guessing from a configuration\nmechanism's name. The owned loopback program does not send or capture Router\nAdvertisements or DHCPv6 exchanges.\n\n### Listener family, policy and application response\n\nA TCP endpoint includes its family, bound address and port. Two sockets can\nshare one numeric port while belonging to different address families. The\nproject sets IPV6_V6ONLY=1 on its ::1 listener. In paired mode a distinct\n127.0.0.1 socket supplies IPv4 service. That result does not demonstrate one\nwildcard dual-stack socket, mapped IPv4 addresses or automatic client family\nselection. Match the actual PID, UID, address, port and per-run response token.\n\nInspect policy for the relevant family and path. A rule shown for IPv4 alone\nis insufficient evidence about IPv6; some shared rulesets handle both families,\nso retain the actual rule, family conditions, chain and match evidence. A live\nlistener does not prove policy allowance. A packet counter establishes matching\npackets, while an HTTP response separately establishes an application exchange.\nA real timeout needs further evidence before it is attributed to a firewall.\n\n### Predict, observe and explain\n\nUse the complete core guide and its five imported files. Predict IPv4 refusal\nand IPv6 success in v6-only mode, then compare the two owned responses in paired\nmode. Retain raw commands, listener ownership, request/response records and\nworker cleanup. Keep the actual neighbor snapshot separate from a claim about\nan actively measured neighbor exchange.\n\nComplete supplied Cases A, B and C as explicitly labeled constructed reasoning exercises.\nTrace the first unsupported boundary in each family, compare intended and\nactual address assignment, and name the next authorized observation needed to\ntest the diagnosis. Reuse the earlier DNS/NSS observations with their scope\nintact. No host configuration or firewall change is required for this project.\n\nFor independent review, make predictions before reading the next observation\nand preserve unexpected results. In a guided walkthrough, pause at scope,\nlookup, selected route, neighbor where relevant, listener, policy, application\nresponse and cleanup. The operations notebook continues this same required\nattempt. Prefix transfer and paired-service extension projects remain optional;\nPython analysis is supplemental practice rather than a prerequisite for the\nnetworking explanation."
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
					id: "network-systems-unit-11-common-application-protocols-curriculum-common-application-protocols-core-concepts",
					title: "Application Messages, Identity and Operational Boundaries",
					preserveInstructions: true,
					content:
						"## Identify the application boundary before choosing a correction\n\nA route, connection, protocol reply, trusted peer and completed operation are\ndifferent observations. Record the issuing host and namespace, intended\nservice, numeric destination and current time. Keep the requested hostname or\nauthority separately. Conventional port numbers are useful clues; they do not\nestablish which program answered or whether the intended operation succeeded.\nUse the actual protocol version and endpoint records when comparing results.\n\n### HTTP messages and representations\n\nAn HTTP request names a method and target and can carry fields and content.\nThe response carries a status, fields and sometimes a representation. GET\nretrieves a representation; HEAD supplies corresponding metadata without\ntransferring its content. A positive Content-Length on HEAD describes the\nrepresentation rather than a body that arrived. Content-Type describes the\nrepresentation format, while byte length and exact bytes remain separate facts.\nRetain binary content without replacing undecodable octets with text placeholders.\n\nThe required local project observes HTTP/1.1 directly. Its raw client reads each\nclosed connection through EOF and retains request and response bytes. A 404\nlocates a missing resource in that service's request handling; a 405 includes\nthe methods it permits. A planned 503 is a received application decision. The\nheld-port refusal has no HTTP response to classify. Distinguish a client\nprogram's exit status from the status inside a received protocol message.\n\nThe transfer project adds a matching validator, a stale validator and an\nexplicit redirect comparison. Keep a retained representation beside a 304\nresponse; the empty response is not a replacement body. Follow the separate\nLocation and destination exchanges rather than silently merging them. These\nrecords do not install a browser cache or measure a cache freshness lifetime.\nIn the extension project, an altered Host field changes an application request\nwhile the numeric loopback connection stays the same. That local behavior\ndoes not establish another server's virtual-host or authorization policy.\n\n### DNS and application reachability\n\nDNS questions and answers have their own protocol status and record types.\nAn A or AAAA answer supplies address data. An MX answer names a mail exchanger;\nthat name still needs usable address and application-path evidence. A negative\nname answer differs from a query with no received DNS response. Keep the\nselected resolver, question, type, status and time. System NSS lookup may use\nlocal data and policy that differ from an explicit DNS query. Use the earlier\nresolution exercise for actual DNS/NSS comparisons. Neither an answer nor an\nanswer's position proves that a later application used that address successfully.\n\n### HTTPS, TLS identity and visibility\n\nHTTPS protects HTTP with TLS. Separate the negotiated TLS connection, verification\nof the intended peer and the later HTTP operation. A trust-chain or name error\ncan stop a client before any HTTP status arrives. A trusted TLS connection can\nstill return an HTTP authentication or application error. Inspect the authorized\nclient's verification result before describing the operation as successful.\n\nPassive visibility depends on protocol version and observation position.\nFor TLS 1.3, handshake messages after ServerHello are encrypted, including the\nserver's certificate message. A passive capture without the relevant secrets\ndoes not expose that certificate or HTTP content merely because a connection\nis visible. IP addresses, transport endpoints, sizes and timing can still be\nobserved at the capture point. Preserve the negotiated version and distinguish\nclient diagnostic output from information visible to an unrelated observer.\nDo not assume that a hostname field is always visible or that TLS authenticates\nan application account. The current HTTP program establishes no TLS session.\n\n### SSH host identity and account authorization\n\nSSH also has several boundaries: reaching a server, verifying its host identity,\nauthenticating an account and completing an authorized operation. A changed\nhost-key warning is not the same evidence as an account key being rejected.\nA working SSH session and a failing web request can narrow a comparison only\nwhen their hosts, addresses, ports, policies and issuing contexts are retained.\nThey are different services and can follow different paths. Verify the expected\nhost identity through an independent trusted channel before changing remembered\nkeys. Do not disable verification to manufacture a successful diagnostic result.\n\n### SMTP submission, relay and delivery evidence\n\nSMTP transfers mail using commands and replies. Submission accepts outgoing\nmessages from an authorized client; relay transfers messages between mail\nsystems. Envelope sender and recipient commands have a different role from\nthe message's displayed From and To headers. Preserve that distinction when\nexplaining routing or an authorization failure.\n\nAn SMTP dialogue can include a greeting, EHLO capabilities, MAIL FROM, RCPT TO\nand DATA. The end of DATA is followed by the receiving server's decision about\naccepting that message. A positive completion reply at that point establishes\nacceptance by that server, rather than final inbox placement or human reading.\nRetain the queue identifier and issuing server if later delivery is investigated.\nTemporary 4xx and permanent 5xx replies call for different policy decisions;\nthe exact command and enhanced diagnostic text matter to the interpretation.\n\nTLS may begin immediately for implicit-TLS submission, conventionally port 465,\nor be negotiated through STARTTLS on a submission connection, commonly port 587.\nKeep configured TLS requirements, peer verification and account authentication\nseparate. A TCP connection or an advertised capability alone proves none of\nthose completed steps. This course project sends no mail and opens no SMTP\nconnection. Use supplied records for this comparison rather than contacting\nan unrelated mail server.\n\n### Independent diagnosis and paced review\n\nFor each protocol, record the last supported boundary, the observed result,\nplausible alternatives and the next authorized observation that could distinguish\nthem. Predict before opening each result. In a paced walkthrough, pause at\nlookup, connection, peer identity and application response before proceeding.\nKeep actual HTTP records separate from the constructed DNS/TLS/SSH cases.\nComplete the core notebook in the same saved attempt; optional transfer and\nextension tasks have their own goals and saved work. Python summaries are\noptional. A successful run does not establish completion of the explanations.\n\nProtocol references: [HTTP semantics, RFC 9110](https://www.rfc-editor.org/rfc/rfc9110.html),\n[TLS 1.3, RFC 8446](https://www.rfc-editor.org/rfc/rfc8446.html),\n[SMTP, RFC 5321](https://www.rfc-editor.org/rfc/rfc5321.html) and\n[mail submission TLS, RFC 8314](https://www.rfc-editor.org/rfc/rfc8314.html)."
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
	]
		.map(withNetworkProjectReadings)
		.map(withNetworkCapstoneReading)
};
