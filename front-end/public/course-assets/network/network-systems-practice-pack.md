# Network Systems Practice Pack

These supplied cases provide deterministic evidence when an owned Linux VM, isolated namespace topology, safe privileged access, or approved packet capture is unavailable. All names, addresses, packet excerpts, DNS data, and service records are fictional or reserved for documentation. Replace supplied evidence with live observations only inside an owned disposable lab.

## Lab Boundary and Readiness Case

```text
$ cat /etc/os-release
PRETTY_NAME="Ubuntu 26.04 LTS"
VERSION_ID="26.04"

$ uname -srm
Linux 6.20.0-lab-generic x86_64

$ ip -brief address
lo    UNKNOWN 127.0.0.1/8 ::1/128
ens3  UP      192.0.2.10/24 2001:db8:10::10/64

$ ip route
default via 192.0.2.1 dev ens3
192.0.2.0/24 dev ens3 proto kernel scope link src 192.0.2.10

$ ss -lntup
Netid State  Local Address:Port  Process
tcp   LISTEN 127.0.0.1:8080     users:(("python3",pid=2410,fd=3))

$ ufw status
Status: inactive
```

Scope record: owned disposable VM, user-mode NAT, snapshot `network-systems-ready`, no bridged adapter, no public listener, no real credentials, and no non-lab capture.

Create a readiness card with target, boundary, interfaces, addresses, routes, resolver, listeners, firewall state, tool versions, stop conditions, and exact reset or cleanup route. Identify any missing evidence before a privileged lab begins.

## Request Path and Transport Case

A local client at `127.0.0.1:49152` sends an HTTP request to `127.0.0.1:8080`.

```text
Process: curl, PID 3201
Client socket: 127.0.0.1:49152
Server socket: 127.0.0.1:8080
Transport: TCP
Flags: SYN; SYN,ACK; ACK; PSH,ACK; PSH,ACK; FIN,ACK
Application result: HTTP/1.1 200 OK
Body: {"status":"ready"}
```

Trace process, socket, source and destination ports, transport state, IP packet, loopback interface, receiving process, application response, and return path. Then explain what changes if the same payload is sent over UDP and which delivery guarantees move into the application.

## Address Name and Scope Case

Classify every value by type and scope.

| Value                                | Observation                          |
| ------------------------------------ | ------------------------------------ |
| `02:00:5e:10:00:0a`                  | link-layer address                   |
| `192.0.2.10/24`                      | IPv4 documentation prefix            |
| `127.0.0.1`                          | IPv4 loopback                        |
| `2001:db8:10::10/64`                 | IPv6 documentation prefix            |
| `fe80::10%ens3`                      | IPv6 link-local plus zone identifier |
| `app.blue-lantern.test`              | fictional hostname                   |
| `app.blue-lantern.test. 60 IN A ...` | DNS record                           |
| `http://app.blue-lantern.test:8080/` | URL                                  |
| `[2001:db8:10::10]:8080`             | IPv6 socket endpoint                 |

Explain which values identify an interface, routeable address, name, DNS answer, or application endpoint. State why a successful name lookup does not prove that the destination port or application is reachable.

## Subnet Route and NAT Case

Topology:

```text
clientns 192.0.2.10/24
    |
    | 192.0.2.1/24
routerns
    | 198.51.100.1/24
    |
serverns 198.51.100.20/24
```

Routes:

```text
clientns: default via 192.0.2.1 dev client0
routerns: 192.0.2.0/24 dev route0; 198.51.100.0/24 dev route1
serverns: default via 198.51.100.1 dev server0
```

Optional translation record:

```text
before: 192.0.2.10:49152 -> 198.51.100.20:8080
after:  198.51.100.1:40001 -> 198.51.100.20:8080
```

Predict local-prefix decisions, next hops, forwarding, translation, and return path. Write a cleanup inventory for `clientns`, `routerns`, `serverns`, and all virtual links before describing any creation command.

## Listener and Reachability Case

```text
$ ss -lntup
tcp LISTEN 0 128 127.0.0.1:8080 0.0.0.0:* users:(("python3",pid=2410,fd=3))
tcp LISTEN 0 128 192.0.2.10:8088 0.0.0.0:* users:(("nginx",pid=2500,fd=7))
udp UNCONN 0 0   127.0.0.53:53  0.0.0.0:* users:(("resolved",pid=520,fd=13))
```

```text
$ curl -sS http://127.0.0.1:8080/health
{"status":"ready"}

$ curl -sS http://192.0.2.10:8088/health
{"status":"ready"}
```

Create a service map with protocol, bind address, port, process, user, expected audience, local test, and evidence still missing for a remote claim. Distinguish loopback-only, lab-segment, wildcard, and unknown exposure.

## DNS Resolution and Cache Case

```text
$ dig @192.0.2.53 app.blue-lantern.test A
;; status: NOERROR
app.blue-lantern.test. 60 IN A 192.0.2.10

$ dig @192.0.2.53 app.blue-lantern.test AAAA
;; status: NOERROR
app.blue-lantern.test. 60 IN AAAA 2001:db8:10::10

$ dig @192.0.2.54 app.blue-lantern.test A
;; status: NXDOMAIN

$ getent hosts app.blue-lantern.test
127.0.0.1 app.blue-lantern.test
```

Compare resolver identity, status, answer type, TTL, and local override behavior. Explain why `getent` differs from both DNS responses, what an expired cache could change, and which independent checks are required before describing IPv4 or IPv6 service reachability.

## Diagnostic Evidence Ladder Case

Symptom: a client reports `curl: (7) Failed to connect`.

```text
server$ systemctl is-active lantern-api
active

server$ ss -ltnp '( sport = :8080 )'
LISTEN 0 128 127.0.0.1:8080 0.0.0.0:* users:(("python3",pid=2410,fd=3))

server$ curl -sS http://127.0.0.1:8080/health
{"status":"ready"}

client$ getent ahosts app.blue-lantern.test
192.0.2.10 STREAM app.blue-lantern.test

client$ ip route get 192.0.2.10
192.0.2.10 via 192.0.2.1 dev client0 src 192.0.2.20

client$ nc -vz -w 2 192.0.2.10 8080
nc: connect to 192.0.2.10 port 8080 (tcp) failed: Connection refused
```

Walk process, listener, local application, name, route, policy, transport, and remote application gates. Name the first failing layer, reject at least two alternatives, select one narrow correction, and list the exact retest sequence.

## Interface Route and Neighbor Case

```text
$ ip -brief link
lo      UNKNOWN
ens3    UP
lab0    DOWN

$ ip -brief address
ens3    UP 192.0.2.10/24 2001:db8:10::10/64
lab0    DOWN 198.51.100.10/24

$ ip route get 198.51.100.20
198.51.100.20 via 192.0.2.1 dev ens3 src 192.0.2.10

$ ip neigh
192.0.2.1 dev ens3 lladdr 02:00:5e:00:00:01 REACHABLE
198.51.100.20 dev lab0 FAILED
```

Predict the selected source, interface, next hop, and neighbor behavior. Explain why flushing a route table or bringing down `ens3` is outside the task. Propose one temporary namespace-only change and its exact revert.

## IPv6 Dual Stack Case

```text
$ ip -6 -brief address
lo   UNKNOWN ::1/128
ens3 UP      fe80::10/64 2001:db8:10::10/64

$ ip -6 route
2001:db8:10::/64 dev ens3 proto kernel metric 256
fe80::/64 dev ens3 proto kernel metric 256

$ ss -ltn
LISTEN 0 128 0.0.0.0:8080 0.0.0.0:*

$ curl -4 -sS http://app.blue-lantern.test:8080/health
{"status":"ready"}

$ curl -6 -sS http://app.blue-lantern.test:8080/health
curl: (7) Failed to connect
```

Identify address scopes and the observed missing IPv6 listener. Separate that server-side gap from the client's unrecorded AAAA answer, selected destination and selected route. State which earlier gates remain unknown before localizing its failure. Explain why IPv4 success does not verify IPv6 and why a link-local destination needs interface context.

## Firewall Policy and Rollback Case

Intended policy: permit SSH only from the administration namespace, permit HTTP only from the client namespace, and deny every other inbound lab flow.

```text
$ ufw status numbered
Status: active
[1] 22/tcp ALLOW IN 192.0.2.50
[2] 80/tcp ALLOW IN 192.0.2.0/24
[3] 8080/tcp ALLOW IN Anywhere

$ ufw --dry-run delete 3
<generated rules remove the broad 8080 allowance>
```

Create an intended-traffic matrix, identify the overbroad rule, record the console or second-session recovery route, preview the smallest correction, verify allowed and denied paths for IPv4 and IPv6, and write numbered-delete, reset, and snapshot rollback steps.

## Bounded Packet Capture Case

Declared question: did the local client receive a TCP reset or complete the HTTP exchange?

Capture boundary: owned loopback interface, host `127.0.0.1`, TCP port `8080`, maximum 12 packets, no credentials, no third-party traffic.

```text
12:00:01.001 IP 127.0.0.1.49152 > 127.0.0.1.8080: Flags [S], seq 100
12:00:01.002 IP 127.0.0.1.8080 > 127.0.0.1.49152: Flags [S.], seq 500, ack 101
12:00:01.003 IP 127.0.0.1.49152 > 127.0.0.1.8080: Flags [.], ack 501
12:00:01.010 IP 127.0.0.1.49152 > 127.0.0.1.8080: Flags [P.], length 78
12:00:01.014 IP 127.0.0.1.8080 > 127.0.0.1.49152: Flags [P.], length 96
12:00:01.020 IP 127.0.0.1.49152 > 127.0.0.1.8080: Flags [F.], ack 597
```

Interpret tuple, flags and the observed sequence. State what remains unanswered when HTTP payload bytes and the closing exchange are absent. List the application evidence needed to establish a completed HTTP response, the minimum fields for a redacted submission and the stop condition for a live capture.

## Protocol and TLS Visibility Case

```text
$ curl -I http://127.0.0.1:8088/health
HTTP/1.1 301 Moved Permanently
Location: https://app.blue-lantern.test/health

$ openssl s_client -connect 192.0.2.10:8443 -servername app.blue-lantern.test
Protocol  : TLSv1.3
Requested SNI: app.blue-lantern.test
Verify return code: 0 (ok)

Packet summary:
client -> server TCP SYN
server -> client TCP SYN,ACK
client -> server TLS ClientHello
server -> client TLS ServerHello
encrypted application data
```

Separate the redirect, negotiated TLS version, requested SNI, certificate-chain result and hostname-verification result. The displayed SNI is a label in this constructed summary. The command has no -verify_hostname option, so the supplied result leaves the intended hostname match unestablished. Identify the next owned-lab check using -verify_hostname and -verify_return_error with the lab's trusted CA configuration. No live TLS connection or CA file is required for this supplied-case diagnosis. See the [OpenSSL s_client options](https://docs.openssl.org/3.5/man1/openssl-s_client/).

## Least Exposure Service Case

```text
toy application: 127.0.0.1:8080
reverse proxy:    192.0.2.10:8088
allowed client:   192.0.2.20
blocked client:   192.0.2.30
fictional name:   app.blue-lantern.test
```

```text
$ curl -sS http://127.0.0.1:8080/health
{"status":"ready"}

$ curl -sS -H 'Host: app.blue-lantern.test' http://192.0.2.10:8088/health
{"status":"ready"}

$ nc -vz -w 2 192.0.2.10 8080
connection refused
```

Treat the shown commands as server-local observations. Map service identity, upstream bind, proxy listener, route, intended client policy and Host header. Keep the declared allowed and blocked clients separate from measured reachability: this excerpt supplies no request from either client. Name the additional bounded client observations, policy records and logs needed for those claims. Preserve the upstream as loopback-only and include proxy/policy cleanup in a live runbook.

## Routed Operations Capstone Case

Target:

- `clientns`, `routerns`, and `serverns` form a disposable routed topology.
- `app.blue-lantern.test` resolves to the server documentation address.
- A toy application binds to server loopback and a local proxy exposes one port only to `clientns`.
- IPv4 works; IPv6 evidence explains one deliberate family-specific difference.
- One narrow supplied packet excerpt answers a declared question.
- Cleanup removes rules, listeners, namespaces, virtual links, and temporary name data.

Injected incidents:

1. The proxy binds only to IPv4 while the name publishes A and AAAA records.
2. A host-policy rule permits the wrong source prefix and blocks `clientns`.

Produce a complete evidence ladder for each incident. Identify the first failing layer before making a change, correct one layer at a time, repeat the same checks, preserve intentionally closed paths, and finish with cleanup proof plus known limitations.
