# Recorded capstone observations

These are preserved Linux runs of the owned, isolated course fixture, not commands executed by opening this page. Each case retains its own run token, command results and cleanup evidence. Diagnose the first unsupported boundary in each address family before comparing the cases.

The original source is [Network Systems at efde308](https://github.com/instruction-material/Network-Systems/tree/efde30862ec77ba94f9c2ad3857a819fd902c23c); the [original Linux qualification](https://github.com/instruction-material/Network-Systems/actions/runs/43762738707) produced these records. The baseline uses the completed configuration; the other two cases isolate the route and backend-identity failures. They differ from the separate constructed practice-pack scenario.

Read the configured route, DNS result, connection and application identity separately. Within each case, match responses to that case's token; tokens differ across runs. Cleanup is a separate claim from service correctness.

## Baseline

### Configuration and execution boundary

```json
{
  "case": {
    "ipv4_service_route": "198.18.32.0/30",
    "proxy_upstream_port": 9000
  },
  "client4": "198.18.31.2",
  "client6": "2001:db8:31::2",
  "server4": "198.18.32.2",
  "server6": "2001:db8:32::2",
  "publicPort": 8080,
  "name": "blue.capstone.test",
  "token": "5c4072b3885f0f2cb017",
  "identities": {
    "network": "net:[4026532268]",
    "mount": "mnt:[4026532267]",
    "parentNetwork": "net:[4026531833]",
    "parentMount": "mnt:[4026531832]"
  }
}
```

### Addresses, routes and forwarding

```json
{
  "addresses": {
    "ncap-client": {
      "ipv4": {
        "parentTaskId": "network-operations-capstone",
        "cwd": "/home/runner/work/Network-Systems/Network-Systems/NS-03-network-systems-lab-17/solution",
        "command": [
          "ip",
          "-n",
          "ncap-client",
          "-4",
          "-j",
          "address",
          "show"
        ],
        "pid": 3369,
        "parentPid": 3303,
        "processGroup": 3303,
        "startTime": "2026-11-15T21:16:47.422670+00:00",
        "endTime": "2026-11-15T21:16:47.424466+00:00",
        "exitCode": 0,
        "timeoutSeconds": 8,
        "childProcessGroupCleanup": "child exited in the supervised lab process group",
        "stdout": "[{\"ifindex\":1,\"ifname\":\"lo\",\"flags\":[\"LOOPBACK\",\"UP\",\"LOWER_UP\"],\"mtu\":65536,\"qdisc\":\"noqueue\",\"operstate\":\"UNKNOWN\",\"group\":\"default\",\"txqlen\":1000,\"addr_info\":[{\"family\":\"inet\",\"local\":\"127.0.0.1\",\"prefixlen\":8,\"scope\":\"host\",\"label\":\"lo\",\"valid_life_time\":4294967295,\"preferred_life_time\":4294967295}]},{\"ifindex\":3,\"link_index\":2,\"ifname\":\"c-r\",\"flags\":[\"BROADCAST\",\"MULTICAST\",\"UP\",\"LOWER_UP\"],\"mtu\":1500,\"qdisc\":\"noqueue\",\"operstate\":\"UP\",\"group\":\"default\",\"txqlen\":1000,\"link_netnsid\":1,\"addr_info\":[{\"family\":\"inet\",\"local\":\"198.18.31.2\",\"prefixlen\":30,\"scope\":\"global\",\"label\":\"c-r\",\"valid_life_time\":4294967295,\"preferred_life_time\":4294967295}]}]\n",
        "stderr": ""
      },
      "ipv6": {
        "parentTaskId": "network-operations-capstone",
        "cwd": "/home/runner/work/Network-Systems/Network-Systems/NS-03-network-systems-lab-17/solution",
        "command": [
          "ip",
          "-n",
          "ncap-client",
          "-6",
          "-j",
          "address",
          "show"
        ],
        "pid": 3370,
        "parentPid": 3303,
        "processGroup": 3303,
        "startTime": "2026-11-15T21:16:47.424480+00:00",
        "endTime": "2026-11-15T21:16:47.425940+00:00",
        "exitCode": 0,
        "timeoutSeconds": 8,
        "childProcessGroupCleanup": "child exited in the supervised lab process group",
        "stdout": "[{\"ifindex\":1,\"ifname\":\"lo\",\"flags\":[\"LOOPBACK\",\"UP\",\"LOWER_UP\"],\"mtu\":65536,\"operstate\":\"UNKNOWN\",\"txqlen\":1000,\"addr_info\":[{\"family\":\"inet6\",\"local\":\"::1\",\"prefixlen\":128,\"scope\":\"host\",\"valid_life_time\":4294967295,\"preferred_life_time\":4294967295}]},{\"ifindex\":3,\"link\":\"if2\",\"ifname\":\"c-r\",\"flags\":[\"BROADCAST\",\"MULTICAST\",\"UP\",\"LOWER_UP\"],\"mtu\":1500,\"operstate\":\"UP\",\"txqlen\":1000,\"addr_info\":[{\"family\":\"inet6\",\"local\":\"2001:db8:31::2\",\"prefixlen\":64,\"scope\":\"global\",\"nodad\":true,\"valid_life_time\":4294967295,\"preferred_life_time\":4294967295},{\"family\":\"inet6\",\"local\":\"fe80::f831:b3ff:fe9e:f8bf\",\"prefixlen\":64,\"scope\":\"link\",\"valid_life_time\":4294967295,\"preferred_life_time\":4294967295}]}]\n",
        "stderr": ""
      }
    },
    "ncap-router": {
      "ipv4": {
        "parentTaskId": "network-operations-capstone",
        "cwd": "/home/runner/work/Network-Systems/Network-Systems/NS-03-network-systems-lab-17/solution",
        "command": [
          "ip",
          "-n",
          "ncap-router",
          "-4",
          "-j",
          "address",
          "show"
        ],
        "pid": 3371,
        "parentPid": 3303,
        "processGroup": 3303,
        "startTime": "2026-11-15T21:16:47.425954+00:00",
        "endTime": "2026-11-15T21:16:47.427400+00:00",
        "exitCode": 0,
        "timeoutSeconds": 8,
        "childProcessGroupCleanup": "child exited in the supervised lab process group",
        "stdout": "[{\"ifindex\":1,\"ifname\":\"lo\",\"flags\":[\"LOOPBACK\",\"UP\",\"LOWER_UP\"],\"mtu\":65536,\"qdisc\":\"noqueue\",\"operstate\":\"UNKNOWN\",\"group\":\"default\",\"txqlen\":1000,\"addr_info\":[{\"family\":\"inet\",\"local\":\"127.0.0.1\",\"prefixlen\":8,\"scope\":\"host\",\"label\":\"lo\",\"valid_life_time\":4294967295,\"preferred_life_time\":4294967295}]},{\"ifindex\":2,\"link_index\":3,\"ifname\":\"r-c\",\"flags\":[\"BROADCAST\",\"MULTICAST\",\"UP\",\"LOWER_UP\"],\"mtu\":1500,\"qdisc\":\"noqueue\",\"operstate\":\"UP\",\"group\":\"default\",\"txqlen\":1000,\"link_netnsid\":0,\"addr_info\":[{\"family\":\"inet\",\"local\":\"198.18.31.1\",\"prefixlen\":30,\"scope\":\"global\",\"label\":\"r-c\",\"valid_life_time\":4294967295,\"preferred_life_time\":4294967295}]},{\"ifindex\":5,\"link_index\":4,\"ifname\":\"r-s\",\"flags\":[\"BROADCAST\",\"MULTICAST\",\"UP\",\"LOWER_UP\"],\"mtu\":1500,\"qdisc\":\"noqueue\",\"operstate\":\"UP\",\"group\":\"default\",\"txqlen\":1000,\"link_netnsid\":2,\"addr_info\":[{\"family\":\"inet\",\"local\":\"198.18.32.1\",\"prefixlen\":30,\"scope\":\"global\",\"label\":\"r-s\",\"valid_life_time\":4294967295,\"preferred_life_time\":4294967295}]}]\n",
        "stderr": ""
      },
      "ipv6": {
        "parentTaskId": "network-operations-capstone",
        "cwd": "/home/runner/work/Network-Systems/Network-Systems/NS-03-network-systems-lab-17/solution",
        "command": [
          "ip",
          "-n",
          "ncap-router",
          "-6",
          "-j",
          "address",
          "show"
        ],
        "pid": 3372,
        "parentPid": 3303,
        "processGroup": 3303,
        "startTime": "2026-11-15T21:16:47.427411+00:00",
        "endTime": "2026-11-15T21:16:47.428886+00:00",
        "exitCode": 0,
        "timeoutSeconds": 8,
        "childProcessGroupCleanup": "child exited in the supervised lab process group",
        "stdout": "[{\"ifindex\":1,\"ifname\":\"lo\",\"flags\":[\"LOOPBACK\",\"UP\",\"LOWER_UP\"],\"mtu\":65536,\"operstate\":\"UNKNOWN\",\"txqlen\":1000,\"addr_info\":[{\"family\":\"inet6\",\"local\":\"::1\",\"prefixlen\":128,\"scope\":\"host\",\"valid_life_time\":4294967295,\"preferred_life_time\":4294967295}]},{\"ifindex\":2,\"link\":\"if3\",\"ifname\":\"r-c\",\"flags\":[\"BROADCAST\",\"MULTICAST\",\"UP\",\"LOWER_UP\"],\"mtu\":1500,\"operstate\":\"UP\",\"txqlen\":1000,\"addr_info\":[{\"family\":\"inet6\",\"local\":\"2001:db8:31::1\",\"prefixlen\":64,\"scope\":\"global\",\"nodad\":true,\"valid_life_time\":4294967295,\"preferred_life_time\":4294967295},{\"family\":\"inet6\",\"local\":\"fe80::7085:99ff:fe17:9bb9\",\"prefixlen\":64,\"scope\":\"link\",\"valid_life_time\":4294967295,\"preferred_life_time\":4294967295}]},{\"ifindex\":5,\"link\":\"if4\",\"ifname\":\"r-s\",\"flags\":[\"BROADCAST\",\"MULTICAST\",\"UP\",\"LOWER_UP\"],\"mtu\":1500,\"operstate\":\"UP\",\"txqlen\":1000,\"addr_info\":[{\"family\":\"inet6\",\"local\":\"2001:db8:32::1\",\"prefixlen\":64,\"scope\":\"global\",\"nodad\":true,\"valid_life_time\":4294967295,\"preferred_life_time\":4294967295},{\"family\":\"inet6\",\"local\":\"fe80::a4d5:5cff:fe10:636e\",\"prefixlen\":64,\"scope\":\"link\",\"valid_life_time\":4294967295,\"preferred_life_time\":4294967295}]}]\n",
        "stderr": ""
      }
    },
    "ncap-server": {
      "ipv4": {
        "parentTaskId": "network-operations-capstone",
        "cwd": "/home/runner/work/Network-Systems/Network-Systems/NS-03-network-systems-lab-17/solution",
        "command": [
          "ip",
          "-n",
          "ncap-server",
          "-4",
          "-j",
          "address",
          "show"
        ],
        "pid": 3373,
        "parentPid": 3303,
        "processGroup": 3303,
        "startTime": "2026-11-15T21:16:47.428898+00:00",
        "endTime": "2026-11-15T21:16:47.430267+00:00",
        "exitCode": 0,
        "timeoutSeconds": 8,
        "childProcessGroupCleanup": "child exited in the supervised lab process group",
        "stdout": "[{\"ifindex\":1,\"ifname\":\"lo\",\"flags\":[\"LOOPBACK\",\"UP\",\"LOWER_UP\"],\"mtu\":65536,\"qdisc\":\"noqueue\",\"operstate\":\"UNKNOWN\",\"group\":\"default\",\"txqlen\":1000,\"addr_info\":[{\"family\":\"inet\",\"local\":\"127.0.0.1\",\"prefixlen\":8,\"scope\":\"host\",\"label\":\"lo\",\"valid_life_time\":4294967295,\"preferred_life_time\":4294967295}]},{\"ifindex\":4,\"link_index\":5,\"ifname\":\"s-r\",\"flags\":[\"BROADCAST\",\"MULTICAST\",\"UP\",\"LOWER_UP\"],\"mtu\":1500,\"qdisc\":\"noqueue\",\"operstate\":\"UP\",\"group\":\"default\",\"txqlen\":1000,\"link_netnsid\":0,\"addr_info\":[{\"family\":\"inet\",\"local\":\"198.18.32.2\",\"prefixlen\":30,\"scope\":\"global\",\"label\":\"s-r\",\"valid_life_time\":4294967295,\"preferred_life_time\":4294967295}]}]\n",
        "stderr": ""
      },
      "ipv6": {
        "parentTaskId": "network-operations-capstone",
        "cwd": "/home/runner/work/Network-Systems/Network-Systems/NS-03-network-systems-lab-17/solution",
        "command": [
          "ip",
          "-n",
          "ncap-server",
          "-6",
          "-j",
          "address",
          "show"
        ],
        "pid": 3374,
        "parentPid": 3303,
        "processGroup": 3303,
        "startTime": "2026-11-15T21:16:47.430278+00:00",
        "endTime": "2026-11-15T21:16:47.431661+00:00",
        "exitCode": 0,
        "timeoutSeconds": 8,
        "childProcessGroupCleanup": "child exited in the supervised lab process group",
        "stdout": "[{\"ifindex\":1,\"ifname\":\"lo\",\"flags\":[\"LOOPBACK\",\"UP\",\"LOWER_UP\"],\"mtu\":65536,\"operstate\":\"UNKNOWN\",\"txqlen\":1000,\"addr_info\":[{\"family\":\"inet6\",\"local\":\"::1\",\"prefixlen\":128,\"scope\":\"host\",\"valid_life_time\":4294967295,\"preferred_life_time\":4294967295}]},{\"ifindex\":4,\"link\":\"if5\",\"ifname\":\"s-r\",\"flags\":[\"BROADCAST\",\"MULTICAST\",\"UP\",\"LOWER_UP\"],\"mtu\":1500,\"operstate\":\"UP\",\"txqlen\":1000,\"addr_info\":[{\"family\":\"inet6\",\"local\":\"2001:db8:32::2\",\"prefixlen\":64,\"scope\":\"global\",\"nodad\":true,\"valid_life_time\":4294967295,\"preferred_life_time\":4294967295},{\"family\":\"inet6\",\"local\":\"fe80::6c93:32ff:fe1a:93ac\",\"prefixlen\":64,\"scope\":\"link\",\"valid_life_time\":4294967295,\"preferred_life_time\":4294967295}]}]\n",
        "stderr": ""
      }
    }
  },
  "forwarding": {
    "parentTaskId": "network-operations-capstone",
    "cwd": "/home/runner/work/Network-Systems/Network-Systems/NS-03-network-systems-lab-17/solution",
    "command": [
      "ip",
      "netns",
      "exec",
      "ncap-router",
      "sysctl",
      "net.ipv4.ip_forward",
      "net.ipv6.conf.all.forwarding"
    ],
    "pid": 3375,
    "parentPid": 3303,
    "processGroup": 3303,
    "startTime": "2026-11-15T21:16:47.431674+00:00",
    "endTime": "2026-11-15T21:16:47.434700+00:00",
    "exitCode": 0,
    "timeoutSeconds": 8,
    "childProcessGroupCleanup": "child exited in the supervised lab process group",
    "stdout": "net.ipv4.ip_forward = 1\nnet.ipv6.conf.all.forwarding = 1\n",
    "stderr": ""
  },
  "routes4": {
    "parentTaskId": "network-operations-capstone",
    "cwd": "/home/runner/work/Network-Systems/Network-Systems/NS-03-network-systems-lab-17/solution",
    "command": [
      "ip",
      "-n",
      "ncap-client",
      "-4",
      "route",
      "show"
    ],
    "pid": 3376,
    "parentPid": 3303,
    "processGroup": 3303,
    "startTime": "2026-11-15T21:16:47.434716+00:00",
    "endTime": "2026-11-15T21:16:47.436258+00:00",
    "exitCode": 0,
    "timeoutSeconds": 8,
    "childProcessGroupCleanup": "child exited in the supervised lab process group",
    "stdout": "198.18.31.0/30 dev c-r proto kernel scope link src 198.18.31.2 \n198.18.32.0/30 via 198.18.31.1 dev c-r \n",
    "stderr": ""
  },
  "routes6": {
    "parentTaskId": "network-operations-capstone",
    "cwd": "/home/runner/work/Network-Systems/Network-Systems/NS-03-network-systems-lab-17/solution",
    "command": [
      "ip",
      "-n",
      "ncap-client",
      "-6",
      "route",
      "show"
    ],
    "pid": 3377,
    "parentPid": 3303,
    "processGroup": 3303,
    "startTime": "2026-11-15T21:16:47.436270+00:00",
    "endTime": "2026-11-15T21:16:47.437758+00:00",
    "exitCode": 0,
    "timeoutSeconds": 8,
    "childProcessGroupCleanup": "child exited in the supervised lab process group",
    "stdout": "2001:db8:31::/64 dev c-r proto kernel metric 256 pref medium\n2001:db8:32::/64 via 2001:db8:31::1 dev c-r metric 1024 pref medium\nfe80::/64 dev c-r proto kernel metric 256 pref medium\n",
    "stderr": ""
  },
  "routeGet4": {
    "parentTaskId": "network-operations-capstone",
    "cwd": "/home/runner/work/Network-Systems/Network-Systems/NS-03-network-systems-lab-17/solution",
    "command": [
      "ip",
      "-n",
      "ncap-client",
      "-4",
      "route",
      "get",
      "198.18.32.2"
    ],
    "pid": 3378,
    "parentPid": 3303,
    "processGroup": 3303,
    "startTime": "2026-11-15T21:16:47.437774+00:00",
    "endTime": "2026-11-15T21:16:47.439175+00:00",
    "exitCode": 0,
    "timeoutSeconds": 8,
    "childProcessGroupCleanup": "child exited in the supervised lab process group",
    "stdout": "198.18.32.2 via 198.18.31.1 dev c-r src 198.18.31.2 uid 0 \n    cache \n",
    "stderr": ""
  },
  "routeGetServerRouter4": {
    "parentTaskId": "network-operations-capstone",
    "cwd": "/home/runner/work/Network-Systems/Network-Systems/NS-03-network-systems-lab-17/solution",
    "command": [
      "ip",
      "-n",
      "ncap-client",
      "-4",
      "route",
      "get",
      "198.18.32.1"
    ],
    "pid": 3379,
    "parentPid": 3303,
    "processGroup": 3303,
    "startTime": "2026-11-15T21:16:47.439186+00:00",
    "endTime": "2026-11-15T21:16:47.440581+00:00",
    "exitCode": 0,
    "timeoutSeconds": 8,
    "childProcessGroupCleanup": "child exited in the supervised lab process group",
    "stdout": "198.18.32.1 via 198.18.31.1 dev c-r src 198.18.31.2 uid 0 \n    cache \n",
    "stderr": ""
  },
  "routeGet6": {
    "parentTaskId": "network-operations-capstone",
    "cwd": "/home/runner/work/Network-Systems/Network-Systems/NS-03-network-systems-lab-17/solution",
    "command": [
      "ip",
      "-n",
      "ncap-client",
      "-6",
      "route",
      "get",
      "2001:db8:32::2"
    ],
    "pid": 3380,
    "parentPid": 3303,
    "processGroup": 3303,
    "startTime": "2026-11-15T21:16:47.440592+00:00",
    "endTime": "2026-11-15T21:16:47.442012+00:00",
    "exitCode": 0,
    "timeoutSeconds": 8,
    "childProcessGroupCleanup": "child exited in the supervised lab process group",
    "stdout": "2001:db8:32::2 from :: via 2001:db8:31::1 dev c-r src 2001:db8:31::2 metric 1024 pref medium\n",
    "stderr": ""
  }
}
```

### Name service, sockets and policy

```json
{
  "dns": {
    "A": {
      "parentTaskId": "network-operations-capstone",
      "cwd": "/home/runner/work/Network-Systems/Network-Systems/NS-03-network-systems-lab-17/solution",
      "command": [
        "ip",
        "netns",
        "exec",
        "ncap-client",
        "dig",
        "@2001:db8:32::2",
        "-p",
        "15353",
        "blue.capstone.test",
        "A",
        "+short",
        "+time=1",
        "+tries=1"
      ],
      "pid": 3384,
      "parentPid": 3303,
      "processGroup": 3303,
      "startTime": "2026-11-15T21:16:47.463681+00:00",
      "endTime": "2026-11-15T21:16:47.484345+00:00",
      "exitCode": 0,
      "timeoutSeconds": 8,
      "childProcessGroupCleanup": "child exited in the supervised lab process group",
      "stdout": "198.18.32.2\n",
      "stderr": ""
    },
    "AAAA": {
      "parentTaskId": "network-operations-capstone",
      "cwd": "/home/runner/work/Network-Systems/Network-Systems/NS-03-network-systems-lab-17/solution",
      "command": [
        "ip",
        "netns",
        "exec",
        "ncap-client",
        "dig",
        "@2001:db8:32::2",
        "-p",
        "15353",
        "blue.capstone.test",
        "AAAA",
        "+short",
        "+time=1",
        "+tries=1"
      ],
      "pid": 3389,
      "parentPid": 3303,
      "processGroup": 3303,
      "startTime": "2026-11-15T21:16:47.484361+00:00",
      "endTime": "2026-11-15T21:16:47.504650+00:00",
      "exitCode": 0,
      "timeoutSeconds": 8,
      "childProcessGroupCleanup": "child exited in the supervised lab process group",
      "stdout": "2001:db8:32::2\n",
      "stderr": ""
    }
  },
  "dns4": {
    "parentTaskId": "network-operations-capstone",
    "cwd": "/home/runner/work/Network-Systems/Network-Systems/NS-03-network-systems-lab-17/solution",
    "command": [
      "ip",
      "netns",
      "exec",
      "ncap-client",
      "dig",
      "@198.18.32.2",
      "-p",
      "15353",
      "blue.capstone.test",
      "A",
      "+short",
      "+time=1",
      "+tries=1"
    ],
    "pid": 3394,
    "parentPid": 3303,
    "processGroup": 3303,
    "startTime": "2026-11-15T21:16:47.504671+00:00",
    "endTime": "2026-11-15T21:16:47.525358+00:00",
    "exitCode": 0,
    "timeoutSeconds": 8,
    "childProcessGroupCleanup": "child exited in the supervised lab process group",
    "stdout": "198.18.32.2\n",
    "stderr": ""
  },
  "resolvedDestinations": {
    "A": "198.18.32.2",
    "AAAA": "2001:db8:32::2"
  },
  "listeners": {
    "parentTaskId": "network-operations-capstone",
    "cwd": "/home/runner/work/Network-Systems/Network-Systems/NS-03-network-systems-lab-17/solution",
    "command": [
      "ip",
      "netns",
      "exec",
      "ncap-server",
      "ss",
      "-H",
      "-lntup"
    ],
    "pid": 3381,
    "parentPid": 3303,
    "processGroup": 3303,
    "startTime": "2026-11-15T21:16:47.442023+00:00",
    "endTime": "2026-11-15T21:16:47.458256+00:00",
    "exitCode": 0,
    "timeoutSeconds": 8,
    "childProcessGroupCleanup": "child exited in the supervised lab process group",
    "stdout": "udp UNCONN 0      0           198.18.32.2:15353 0.0.0.0:* users:((\"dnsmasq\",pid=3346,fd=4))\nudp UNCONN 0      0      [2001:db8:32::2]:15353    [::]:* users:((\"dnsmasq\",pid=3346,fd=6))\ntcp LISTEN 0      5             127.0.0.1:9000  0.0.0.0:* users:((\"python3\",pid=3347,fd=3))\ntcp LISTEN 0      32          198.18.32.2:15353 0.0.0.0:* users:((\"dnsmasq\",pid=3346,fd=5))\ntcp LISTEN 0      5               0.0.0.0:8088  0.0.0.0:* users:((\"python3\",pid=3347,fd=6))\ntcp LISTEN 0      5               0.0.0.0:8080  0.0.0.0:* users:((\"python3\",pid=3347,fd=4))\ntcp LISTEN 0      32     [2001:db8:32::2]:15353    [::]:* users:((\"dnsmasq\",pid=3346,fd=7))\ntcp LISTEN 0      5                  [::]:8088     [::]:* users:((\"python3\",pid=3347,fd=7))\ntcp LISTEN 0      5                  [::]:8080     [::]:* users:((\"python3\",pid=3347,fd=5))\n",
    "stderr": ""
  },
  "policy4": {
    "parentTaskId": "network-operations-capstone",
    "cwd": "/home/runner/work/Network-Systems/Network-Systems/NS-03-network-systems-lab-17/solution",
    "command": [
      "ip",
      "netns",
      "exec",
      "ncap-server",
      "iptables",
      "-S"
    ],
    "pid": 3382,
    "parentPid": 3303,
    "processGroup": 3303,
    "startTime": "2026-11-15T21:16:47.458269+00:00",
    "endTime": "2026-11-15T21:16:47.461026+00:00",
    "exitCode": 0,
    "timeoutSeconds": 8,
    "childProcessGroupCleanup": "child exited in the supervised lab process group",
    "stdout": "-P INPUT DROP\n-P FORWARD ACCEPT\n-P OUTPUT ACCEPT\n-A INPUT -i lo -j ACCEPT\n-A INPUT -m conntrack --ctstate RELATED,ESTABLISHED -j ACCEPT\n-A INPUT -s 198.18.31.2/32 -p udp -m udp --dport 15353 -j ACCEPT\n-A INPUT -s 198.18.31.2/32 -p tcp -m tcp --dport 8080 -j ACCEPT\n",
    "stderr": ""
  },
  "policy6": {
    "parentTaskId": "network-operations-capstone",
    "cwd": "/home/runner/work/Network-Systems/Network-Systems/NS-03-network-systems-lab-17/solution",
    "command": [
      "ip",
      "netns",
      "exec",
      "ncap-server",
      "ip6tables",
      "-S"
    ],
    "pid": 3383,
    "parentPid": 3303,
    "processGroup": 3303,
    "startTime": "2026-11-15T21:16:47.461040+00:00",
    "endTime": "2026-11-15T21:16:47.463668+00:00",
    "exitCode": 0,
    "timeoutSeconds": 8,
    "childProcessGroupCleanup": "child exited in the supervised lab process group",
    "stdout": "-P INPUT DROP\n-P FORWARD ACCEPT\n-P OUTPUT ACCEPT\n-A INPUT -i lo -j ACCEPT\n-A INPUT -m conntrack --ctstate RELATED,ESTABLISHED -j ACCEPT\n-A INPUT -p ipv6-icmp -j ACCEPT\n-A INPUT -s 2001:db8:31::2/128 -p udp -m udp --dport 15353 -j ACCEPT\n-A INPUT -s 2001:db8:31::2/128 -p tcp -m tcp --dport 8080 -j ACCEPT\n",
    "stderr": ""
  }
}
```

### Application and denied controls

```json
{
  "http4": {
    "command": {
      "parentTaskId": "network-operations-capstone",
      "cwd": "/home/runner/work/Network-Systems/Network-Systems/NS-03-network-systems-lab-17/solution",
      "command": [
        "ip",
        "netns",
        "exec",
        "ncap-client",
        "curl",
        "--noproxy",
        "*",
        "-g",
        "--silent",
        "--show-error",
        "--max-time",
        "1",
        "--header",
        "Host: blue.capstone.test",
        "--output",
        "/tmp/network-capstone-contracts-qi55y1g4/solution-default/http4.body",
        "--write-out",
        "%{http_code}",
        "http://198.18.32.2:8080/health"
      ],
      "pid": 3399,
      "parentPid": 3303,
      "processGroup": 3303,
      "startTime": "2026-11-15T21:16:47.525521+00:00",
      "endTime": "2026-11-15T21:16:47.535736+00:00",
      "exitCode": 0,
      "timeoutSeconds": 3,
      "childProcessGroupCleanup": "child exited in the supervised lab process group",
      "stdout": "200",
      "stderr": ""
    },
    "status": "200",
    "body": "{\"fixture\": \"owned-operations-capstone\", \"token\": \"5c4072b3885f0f2cb017\", \"path\": \"/health\"}"
  },
  "http6": {
    "command": {
      "parentTaskId": "network-operations-capstone",
      "cwd": "/home/runner/work/Network-Systems/Network-Systems/NS-03-network-systems-lab-17/solution",
      "command": [
        "ip",
        "netns",
        "exec",
        "ncap-client",
        "curl",
        "--noproxy",
        "*",
        "-g",
        "--silent",
        "--show-error",
        "--max-time",
        "1",
        "--header",
        "Host: blue.capstone.test",
        "--output",
        "/tmp/network-capstone-contracts-qi55y1g4/solution-default/http6.body",
        "--write-out",
        "%{http_code}",
        "http://[2001:db8:32::2]:8080/health"
      ],
      "pid": 3403,
      "parentPid": 3303,
      "processGroup": 3303,
      "startTime": "2026-11-15T21:16:47.535870+00:00",
      "endTime": "2026-11-15T21:16:47.543711+00:00",
      "exitCode": 0,
      "timeoutSeconds": 3,
      "childProcessGroupCleanup": "child exited in the supervised lab process group",
      "stdout": "200",
      "stderr": ""
    },
    "status": "200",
    "body": "{\"fixture\": \"owned-operations-capstone\", \"token\": \"5c4072b3885f0f2cb017\", \"path\": \"/health\"}"
  },
  "missingPath": {
    "command": {
      "parentTaskId": "network-operations-capstone",
      "cwd": "/home/runner/work/Network-Systems/Network-Systems/NS-03-network-systems-lab-17/solution",
      "command": [
        "ip",
        "netns",
        "exec",
        "ncap-client",
        "curl",
        "--noproxy",
        "*",
        "-g",
        "--silent",
        "--show-error",
        "--max-time",
        "1",
        "--header",
        "Host: blue.capstone.test",
        "--output",
        "/tmp/network-capstone-contracts-qi55y1g4/solution-default/missing.body",
        "--write-out",
        "%{http_code}",
        "http://[2001:db8:32::2]:8080/missing"
      ],
      "pid": 3406,
      "parentPid": 3303,
      "processGroup": 3303,
      "startTime": "2026-11-15T21:16:47.543830+00:00",
      "endTime": "2026-11-15T21:16:47.551397+00:00",
      "exitCode": 0,
      "timeoutSeconds": 3,
      "childProcessGroupCleanup": "child exited in the supervised lab process group",
      "stdout": "404",
      "stderr": ""
    },
    "status": "404",
    "body": "{\"fixture\": \"owned-operations-capstone\", \"token\": \"5c4072b3885f0f2cb017\", \"path\": \"/missing\"}"
  },
  "denied4": {
    "command": {
      "parentTaskId": "network-operations-capstone",
      "cwd": "/home/runner/work/Network-Systems/Network-Systems/NS-03-network-systems-lab-17/solution",
      "command": [
        "ip",
        "netns",
        "exec",
        "ncap-client",
        "curl",
        "--noproxy",
        "*",
        "-g",
        "--silent",
        "--show-error",
        "--max-time",
        "1",
        "--header",
        "Host: blue.capstone.test",
        "--output",
        "/tmp/network-capstone-contracts-qi55y1g4/solution-default/denied4.body",
        "--write-out",
        "%{http_code}",
        "http://198.18.32.2:8088/health"
      ],
      "pid": 3409,
      "parentPid": 3303,
      "processGroup": 3303,
      "startTime": "2026-11-15T21:16:47.551484+00:00",
      "endTime": "2026-11-15T21:16:48.559846+00:00",
      "exitCode": 28,
      "timeoutSeconds": 3,
      "childProcessGroupCleanup": "child exited in the supervised lab process group",
      "stdout": "000",
      "stderr": "curl: (28) Connection timed out after 1001 milliseconds\n"
    },
    "status": "000",
    "body": ""
  },
  "denied6": {
    "command": {
      "parentTaskId": "network-operations-capstone",
      "cwd": "/home/runner/work/Network-Systems/Network-Systems/NS-03-network-systems-lab-17/solution",
      "command": [
        "ip",
        "netns",
        "exec",
        "ncap-client",
        "curl",
        "--noproxy",
        "*",
        "-g",
        "--silent",
        "--show-error",
        "--max-time",
        "1",
        "--header",
        "Host: blue.capstone.test",
        "--output",
        "/tmp/network-capstone-contracts-qi55y1g4/solution-default/denied6.body",
        "--write-out",
        "%{http_code}",
        "http://[2001:db8:32::2]:8088/health"
      ],
      "pid": 3411,
      "parentPid": 3303,
      "processGroup": 3303,
      "startTime": "2026-11-15T21:16:48.559945+00:00",
      "endTime": "2026-11-15T21:16:49.568777+00:00",
      "exitCode": 28,
      "timeoutSeconds": 3,
      "childProcessGroupCleanup": "child exited in the supervised lab process group",
      "stdout": "000",
      "stderr": "curl: (28) Connection timed out after 1001 milliseconds\n"
    },
    "status": "000",
    "body": ""
  },
  "directUpstream": {
    "command": {
      "parentTaskId": "network-operations-capstone",
      "cwd": "/home/runner/work/Network-Systems/Network-Systems/NS-03-network-systems-lab-17/solution",
      "command": [
        "ip",
        "netns",
        "exec",
        "ncap-client",
        "curl",
        "--noproxy",
        "*",
        "-g",
        "--silent",
        "--show-error",
        "--max-time",
        "1",
        "--header",
        "Host: blue.capstone.test",
        "--output",
        "/tmp/network-capstone-contracts-qi55y1g4/solution-default/direct-upstream.body",
        "--write-out",
        "%{http_code}",
        "http://[2001:db8:32::2]:9000/health"
      ],
      "pid": 3412,
      "parentPid": 3303,
      "processGroup": 3303,
      "startTime": "2026-11-15T21:16:49.568882+00:00",
      "endTime": "2026-11-15T21:16:50.577626+00:00",
      "exitCode": 28,
      "timeoutSeconds": 3,
      "childProcessGroupCleanup": "child exited in the supervised lab process group",
      "stdout": "000",
      "stderr": "curl: (28) Connection timed out after 1001 milliseconds\n"
    },
    "status": "000",
    "body": ""
  }
}
```

### Bounded packet reading

```json
{
  "packetRead": {
    "parentTaskId": "network-operations-capstone",
    "cwd": "/home/runner/work/Network-Systems/Network-Systems/NS-03-network-systems-lab-17/solution",
    "command": [
      "tcpdump",
      "-n",
      "-r",
      "/tmp/network-capstone-contracts-qi55y1g4/solution-default/capture.pcap"
    ],
    "pid": 3417,
    "parentPid": 3303,
    "processGroup": 3303,
    "startTime": "2026-11-15T21:16:50.603700+00:00",
    "endTime": "2026-11-15T21:16:50.607151+00:00",
    "exitCode": 0,
    "timeoutSeconds": 8,
    "childProcessGroupCleanup": "child exited in the supervised lab process group",
    "stdout": "21:16:47.472411 IP6 2001:db8:31::2.38369 > 2001:db8:32::2.15353: UDP, length 59\n21:16:47.472528 IP6 2001:db8:32::2.15353 > 2001:db8:31::2.38369: UDP, length 63\n21:16:47.492880 IP6 2001:db8:31::2.60097 > 2001:db8:32::2.15353: UDP, length 59\n21:16:47.492970 IP6 2001:db8:32::2.15353 > 2001:db8:31::2.60097: UDP, length 75\n21:16:47.513538 IP 198.18.31.2.37302 > 198.18.32.2.15353: UDP, length 59\n21:16:47.513654 IP 198.18.32.2.15353 > 198.18.31.2.37302: UDP, length 63\n21:16:47.531681 IP 198.18.31.2.44878 > 198.18.32.2.8080: Flags [S], seq 2024346048, win 64240, options [mss 1460,sackOK,TS val 901516251 ecr 0,nop,wscale 10], length 0\n21:16:47.531706 IP 198.18.32.2.8080 > 198.18.31.2.44878: Flags [S.], seq 60575889, ack 2024346049, win 65160, options [mss 1460,sackOK,TS val 1258612727 ecr 901516251,nop,wscale 10], length 0\n21:16:47.531754 IP 198.18.31.2.44878 > 198.18.32.2.8080: Flags [.], ack 1, win 63, options [nop,nop,TS val 901516252 ecr 1258612727], length 0\n21:16:47.531831 IP 198.18.31.2.44878 > 198.18.32.2.8080: Flags [P.], seq 1:88, ack 1, win 63, options [nop,nop,TS val 901516252 ecr 1258612727], length 87: HTTP: GET /health HTTP/1.1\n21:16:47.531841 IP 198.18.32.2.8080 > 198.18.31.2.44878: Flags [.], ack 88, win 64, options [nop,nop,TS val 1258612728 ecr 901516252], length 0\n21:16:47.533227 IP 198.18.32.2.8080 > 198.18.31.2.44878: Flags [P.], seq 1:188, ack 88, win 64, options [nop,nop,TS val 1258612729 ecr 901516252], length 187: HTTP: HTTP/1.0 200 OK\n21:16:47.533251 IP 198.18.31.2.44878 > 198.18.32.2.8080: Flags [.], ack 188, win 63, options [nop,nop,TS val 901516253 ecr 1258612729], length 0\n21:16:47.533311 IP 198.18.32.2.8080 > 198.18.31.2.44878: Flags [P.], seq 188:280, ack 88, win 64, options [nop,nop,TS val 1258612729 ecr 901516253], length 92: HTTP\n21:16:47.533330 IP 198.18.31.2.44878 > 198.18.32.2.8080: Flags [.], ack 280, win 63, options [nop,nop,TS val 901516253 ecr 1258612729], length 0\n21:16:47.533359 IP 198.18.32.2.8080 > 198.18.31.2.44878: Flags [F.], seq 280, ack 88, win 64, options [nop,nop,TS val 1258612729 ecr 901516253], length 0\n21:16:47.533429 IP 198.18.31.2.44878 > 198.18.32.2.8080: Flags [F.], seq 88, ack 281, win 63, options [nop,nop,TS val 901516253 ecr 1258612729], length 0\n21:16:47.533441 IP 198.18.32.2.8080 > 198.18.31.2.44878: Flags [.], ack 89, win 64, options [nop,nop,TS val 1258612729 ecr 901516253], length 0\n21:16:47.541807 IP6 2001:db8:31::2.58676 > 2001:db8:32::2.8080: Flags [S], seq 2930310197, win 64800, options [mss 1440,sackOK,TS val 416973212 ecr 0,nop,wscale 10], length 0\n21:16:47.541834 IP6 2001:db8:32::2.8080 > 2001:db8:31::2.58676: Flags [S.], seq 2355590685, ack 2930310198, win 64260, options [mss 1440,sackOK,TS val 2311123849 ecr 416973212,nop,wscale 10], length 0\n21:16:47.541853 IP6 2001:db8:31::2.58676 > 2001:db8:32::2.8080: Flags [.], ack 1, win 64, options [nop,nop,TS val 416973212 ecr 2311123849], length 0\n21:16:47.541914 IP6 2001:db8:31::2.58676 > 2001:db8:32::2.8080: Flags [P.], seq 1:88, ack 1, win 64, options [nop,nop,TS val 416973212 ecr 2311123849], length 87: HTTP: GET /health HTTP/1.1\n21:16:47.541923 IP6 2001:db8:32::2.8080 > 2001:db8:31::2.58676: Flags [.], ack 88, win 63, options [nop,nop,TS val 2311123849 ecr 416973212], length 0\n21:16:47.542743 IP6 2001:db8:32::2.8080 > 2001:db8:31::2.58676: Flags [P.], seq 1:188, ack 88, win 63, options [nop,nop,TS val 2311123850 ecr 416973212], length 187: HTTP: HTTP/1.0 200 OK\n21:16:47.542773 IP6 2001:db8:31::2.58676 > 2001:db8:32::2.8080: Flags [.], ack 188, win 64, options [nop,nop,TS val 416973213 ecr 2311123850], length 0\n21:16:47.542796 IP6 2001:db8:32::2.8080 > 2001:db8:31::2.58676: Flags [P.], seq 188:280, ack 88, win 63, options [nop,nop,TS val 2311123850 ecr 416973213], length 92: HTTP\n21:16:47.542809 IP6 2001:db8:31::2.58676 > 2001:db8:32::2.8080: Flags [.], ack 280, win 64, options [nop,nop,TS val 416973213 ecr 2311123850], length 0\n21:16:47.542839 IP6 2001:db8:32::2.8080 > 2001:db8:31::2.58676: Flags [F.], seq 280, ack 88, win 63, options [nop,nop,TS val 2311123850 ecr 416973213], length 0\n21:16:47.542865 IP6 2001:db8:31::2.58676 > 2001:db8:32::2.8080: Flags [F.], seq 88, ack 281, win 64, options [nop,nop,TS val 416973213 ecr 2311123850], length 0\n21:16:47.542875 IP6 2001:db8:32::2.8080 > 2001:db8:31::2.58676: Flags [.], ack 89, win 63, options [nop,nop,TS val 2311123850 ecr 416973213], length 0\n21:16:47.549470 IP6 2001:db8:31::2.58688 > 2001:db8:32::2.8080: Flags [S], seq 948270063, win 64800, options [mss 1440,sackOK,TS val 3947112676 ecr 0,nop,wscale 10], length 0\n21:16:47.549483 IP6 2001:db8:32::2.8080 > 2001:db8:31::2.58688: Flags [S.], seq 3760399788, ack 948270064, win 64260, options [mss 1440,sackOK,TS val 141741282 ecr 3947112676,nop,wscale 10], length 0\n21:16:47.549495 IP6 2001:db8:31::2.58688 > 2001:db8:32::2.8080: Flags [.], ack 1, win 64, options [nop,nop,TS val 3947112676 ecr 141741282], length 0\n21:16:47.549554 IP6 2001:db8:31::2.58688 > 2001:db8:32::2.8080: Flags [P.], seq 1:89, ack 1, win 64, options [nop,nop,TS val 3947112676 ecr 141741282], length 88: HTTP: GET /missing HTTP/1.1\n21:16:47.549569 IP6 2001:db8:32::2.8080 > 2001:db8:31::2.58688: Flags [.], ack 89, win 63, options [nop,nop,TS val 141741282 ecr 3947112676], length 0\n21:16:47.550420 IP6 2001:db8:32::2.8080 > 2001:db8:31::2.58688: Flags [P.], seq 1:195, ack 89, win 63, options [nop,nop,TS val 141741283 ecr 3947112676], length 194: HTTP: HTTP/1.0 404 Not Found\n21:16:47.550447 IP6 2001:db8:31::2.58688 > 2001:db8:32::2.8080: Flags [.], ack 195, win 64, options [nop,nop,TS val 3947112677 ecr 141741283], length 0\n21:16:47.550469 IP6 2001:db8:32::2.8080 > 2001:db8:31::2.58688: Flags [P.], seq 195:288, ack 89, win 63, options [nop,nop,TS val 141741283 ecr 3947112677], length 93: HTTP\n21:16:47.550481 IP6 2001:db8:31::2.58688 > 2001:db8:32::2.8080: Flags [.], ack 288, win 64, options [nop,nop,TS val 3947112677 ecr 141741283], length 0\n21:16:47.550511 IP6 2001:db8:32::2.8080 > 2001:db8:31::2.58688: Flags [F.], seq 288, ack 89, win 63, options [nop,nop,TS val 141741283 ecr 3947112677], length 0\n21:16:47.550548 IP6 2001:db8:31::2.58688 > 2001:db8:32::2.8080: Flags [F.], seq 89, ack 289, win 64, options [nop,nop,TS val 3947112677 ecr 141741283], length 0\n21:16:47.550561 IP6 2001:db8:32::2.8080 > 2001:db8:31::2.58688: Flags [.], ack 90, win 63, options [nop,nop,TS val 141741283 ecr 3947112677], length 0\n",
    "stderr": "reading from file /tmp/network-capstone-contracts-qi55y1g4/solution-default/capture.pcap, link-type EN10MB (Ethernet), snapshot length 262144\n"
  }
}
```

### Cleanup

```json
{
  "completed": true,
  "interrupted": false,
  "workers": [
    {
      "parentTaskId": "network-operations-capstone",
      "cwd": "/home/runner/work/Network-Systems/Network-Systems/NS-03-network-systems-lab-17/solution",
      "command": [
        "ip",
        "netns",
        "exec",
        "ncap-server",
        "dnsmasq",
        "--no-daemon",
        "--conf-file=/dev/null",
        "--no-hosts",
        "--no-resolv",
        "--no-poll",
        "--cache-size=0",
        "--user=root",
        "--bind-interfaces",
        "--port=15353",
        "--listen-address=198.18.32.2",
        "--listen-address=2001:db8:32::2",
        "--address=/blue.capstone.test/198.18.32.2",
        "--address=/blue.capstone.test/2001:db8:32::2",
        "--pid-file=/tmp/network-capstone-contracts-qi55y1g4/solution-default/dnsmasq.pid",
        "--log-queries"
      ],
      "pid": 3346,
      "parentPid": 3303,
      "processGroup": 3303,
      "startTime": "2026-11-15T21:16:45.255502+00:00",
      "timeoutSeconds": 35,
      "log": "dns.log",
      "endTime": "2026-11-15T21:16:50.598249+00:00",
      "exitCode": 0,
      "childProcessGroupCleanup": "owned worker reaped in enclosing supervised lab group"
    },
    {
      "parentTaskId": "network-operations-capstone",
      "cwd": "/home/runner/work/Network-Systems/Network-Systems/NS-03-network-systems-lab-17/solution",
      "command": [
        "ip",
        "netns",
        "exec",
        "ncap-server",
        "/usr/bin/python3",
        "/home/runner/work/Network-Systems/Network-Systems/NS-03-network-systems-lab-17/solution/capstone_lab.py",
        "_serve",
        "8080",
        "9000",
        "5c4072b3885f0f2cb017"
      ],
      "pid": 3347,
      "parentPid": 3303,
      "processGroup": 3303,
      "startTime": "2026-11-15T21:16:45.255930+00:00",
      "timeoutSeconds": 35,
      "log": "service.log",
      "endTime": "2026-11-15T21:16:50.597110+00:00",
      "exitCode": -15,
      "childProcessGroupCleanup": "owned worker reaped in enclosing supervised lab group"
    },
    {
      "parentTaskId": "network-operations-capstone",
      "cwd": "/home/runner/work/Network-Systems/Network-Systems/NS-03-network-systems-lab-17/solution",
      "command": [
        "ip",
        "netns",
        "exec",
        "ncap-server",
        "tcpdump",
        "-i",
        "s-r",
        "-s",
        "0",
        "-n",
        "-U",
        "-c",
        "160",
        "-w",
        "/tmp/network-capstone-contracts-qi55y1g4/solution-default/capture.pcap",
        "tcp port 8080 or udp port 15353"
      ],
      "pid": 3368,
      "parentPid": 3303,
      "processGroup": 3303,
      "startTime": "2026-11-15T21:16:47.392204+00:00",
      "timeoutSeconds": 35,
      "log": "capture.log",
      "endTime": "2026-11-15T21:16:50.593234+00:00",
      "exitCode": 0,
      "childProcessGroupCleanup": "owned worker reaped in enclosing supervised lab group"
    }
  ],
  "remainingNamespaces": "",
  "allWorkersReaped": true
}
```

The recorded parent comparison reports identical before/after snapshots. The matching canonical snapshot SHA-256 is `1b300eafe4841cb56b265ce46a7c2f107aed21e27f600e5e8e8be06540c19494`. Compared fields: ipv4Policy, ipv4Routes, ipv6Policy, ipv6Routes, links. This covers those recorded fields; the parent host's unrelated configuration contents are omitted.

Inside-record SHA-256: b1e22f5448bacfc368908882ee696d6107d1b4840088d244d8b3564a6c4d38a3.

## Route gap

### Configuration and execution boundary

```json
{
  "case": {
    "ipv4_service_route": "198.18.32.0/31",
    "proxy_upstream_port": 9000
  },
  "client4": "198.18.31.2",
  "client6": "2001:db8:31::2",
  "server4": "198.18.32.2",
  "server6": "2001:db8:32::2",
  "publicPort": 8080,
  "name": "blue.capstone.test",
  "token": "039ffe6b49eee4e54b4c",
  "identities": {
    "network": "net:[4026532316]",
    "mount": "mnt:[4026532313]",
    "parentNetwork": "net:[4026531833]",
    "parentMount": "mnt:[4026531832]"
  }
}
```

### Addresses, routes and forwarding

```json
{
  "addresses": {
    "ncap-client": {
      "ipv4": {
        "parentTaskId": "network-operations-capstone",
        "cwd": "/home/runner/work/Network-Systems/Network-Systems/NS-33-applied-studio-17-network-systems-lab-17-supplemental-2/starter",
        "command": [
          "ip",
          "-n",
          "ncap-client",
          "-4",
          "-j",
          "address",
          "show"
        ],
        "pid": 3313,
        "parentPid": 3246,
        "processGroup": 3246,
        "startTime": "2026-11-15T21:16:55.457587+00:00",
        "endTime": "2026-11-15T21:16:55.458710+00:00",
        "exitCode": 0,
        "timeoutSeconds": 8,
        "childProcessGroupCleanup": "child exited in the supervised lab process group",
        "stdout": "[{\"ifindex\":1,\"ifname\":\"lo\",\"flags\":[\"LOOPBACK\",\"UP\",\"LOWER_UP\"],\"mtu\":65536,\"qdisc\":\"noqueue\",\"operstate\":\"UNKNOWN\",\"group\":\"default\",\"txqlen\":1000,\"addr_info\":[{\"family\":\"inet\",\"local\":\"127.0.0.1\",\"prefixlen\":8,\"scope\":\"host\",\"label\":\"lo\",\"valid_life_time\":4294967295,\"preferred_life_time\":4294967295}]},{\"ifindex\":3,\"link_index\":2,\"ifname\":\"c-r\",\"flags\":[\"BROADCAST\",\"MULTICAST\",\"UP\",\"LOWER_UP\"],\"mtu\":1500,\"qdisc\":\"noqueue\",\"operstate\":\"UP\",\"group\":\"default\",\"txqlen\":1000,\"link_netnsid\":1,\"addr_info\":[{\"family\":\"inet\",\"local\":\"198.18.31.2\",\"prefixlen\":30,\"scope\":\"global\",\"label\":\"c-r\",\"valid_life_time\":4294967295,\"preferred_life_time\":4294967295}]}]\n",
        "stderr": ""
      },
      "ipv6": {
        "parentTaskId": "network-operations-capstone",
        "cwd": "/home/runner/work/Network-Systems/Network-Systems/NS-33-applied-studio-17-network-systems-lab-17-supplemental-2/starter",
        "command": [
          "ip",
          "-n",
          "ncap-client",
          "-6",
          "-j",
          "address",
          "show"
        ],
        "pid": 3314,
        "parentPid": 3246,
        "processGroup": 3246,
        "startTime": "2026-11-15T21:16:55.458718+00:00",
        "endTime": "2026-11-15T21:16:55.459755+00:00",
        "exitCode": 0,
        "timeoutSeconds": 8,
        "childProcessGroupCleanup": "child exited in the supervised lab process group",
        "stdout": "[{\"ifindex\":1,\"ifname\":\"lo\",\"flags\":[\"LOOPBACK\",\"UP\",\"LOWER_UP\"],\"mtu\":65536,\"operstate\":\"UNKNOWN\",\"txqlen\":1000,\"addr_info\":[{\"family\":\"inet6\",\"local\":\"::1\",\"prefixlen\":128,\"scope\":\"host\",\"valid_life_time\":4294967295,\"preferred_life_time\":4294967295}]},{\"ifindex\":3,\"link\":\"if2\",\"ifname\":\"c-r\",\"flags\":[\"BROADCAST\",\"MULTICAST\",\"UP\",\"LOWER_UP\"],\"mtu\":1500,\"operstate\":\"UP\",\"txqlen\":1000,\"addr_info\":[{\"family\":\"inet6\",\"local\":\"2001:db8:31::2\",\"prefixlen\":64,\"scope\":\"global\",\"nodad\":true,\"valid_life_time\":4294967295,\"preferred_life_time\":4294967295},{\"family\":\"inet6\",\"local\":\"fe80::a480:e3ff:fe77:54d6\",\"prefixlen\":64,\"scope\":\"link\",\"valid_life_time\":4294967295,\"preferred_life_time\":4294967295}]}]\n",
        "stderr": ""
      }
    },
    "ncap-router": {
      "ipv4": {
        "parentTaskId": "network-operations-capstone",
        "cwd": "/home/runner/work/Network-Systems/Network-Systems/NS-33-applied-studio-17-network-systems-lab-17-supplemental-2/starter",
        "command": [
          "ip",
          "-n",
          "ncap-router",
          "-4",
          "-j",
          "address",
          "show"
        ],
        "pid": 3315,
        "parentPid": 3246,
        "processGroup": 3246,
        "startTime": "2026-11-15T21:16:55.459761+00:00",
        "endTime": "2026-11-15T21:16:55.460782+00:00",
        "exitCode": 0,
        "timeoutSeconds": 8,
        "childProcessGroupCleanup": "child exited in the supervised lab process group",
        "stdout": "[{\"ifindex\":1,\"ifname\":\"lo\",\"flags\":[\"LOOPBACK\",\"UP\",\"LOWER_UP\"],\"mtu\":65536,\"qdisc\":\"noqueue\",\"operstate\":\"UNKNOWN\",\"group\":\"default\",\"txqlen\":1000,\"addr_info\":[{\"family\":\"inet\",\"local\":\"127.0.0.1\",\"prefixlen\":8,\"scope\":\"host\",\"label\":\"lo\",\"valid_life_time\":4294967295,\"preferred_life_time\":4294967295}]},{\"ifindex\":2,\"link_index\":3,\"ifname\":\"r-c\",\"flags\":[\"BROADCAST\",\"MULTICAST\",\"UP\",\"LOWER_UP\"],\"mtu\":1500,\"qdisc\":\"noqueue\",\"operstate\":\"UP\",\"group\":\"default\",\"txqlen\":1000,\"link_netnsid\":0,\"addr_info\":[{\"family\":\"inet\",\"local\":\"198.18.31.1\",\"prefixlen\":30,\"scope\":\"global\",\"label\":\"r-c\",\"valid_life_time\":4294967295,\"preferred_life_time\":4294967295}]},{\"ifindex\":5,\"link_index\":4,\"ifname\":\"r-s\",\"flags\":[\"BROADCAST\",\"MULTICAST\",\"UP\",\"LOWER_UP\"],\"mtu\":1500,\"qdisc\":\"noqueue\",\"operstate\":\"UP\",\"group\":\"default\",\"txqlen\":1000,\"link_netnsid\":2,\"addr_info\":[{\"family\":\"inet\",\"local\":\"198.18.32.1\",\"prefixlen\":30,\"scope\":\"global\",\"label\":\"r-s\",\"valid_life_time\":4294967295,\"preferred_life_time\":4294967295}]}]\n",
        "stderr": ""
      },
      "ipv6": {
        "parentTaskId": "network-operations-capstone",
        "cwd": "/home/runner/work/Network-Systems/Network-Systems/NS-33-applied-studio-17-network-systems-lab-17-supplemental-2/starter",
        "command": [
          "ip",
          "-n",
          "ncap-router",
          "-6",
          "-j",
          "address",
          "show"
        ],
        "pid": 3316,
        "parentPid": 3246,
        "processGroup": 3246,
        "startTime": "2026-11-15T21:16:55.460786+00:00",
        "endTime": "2026-11-15T21:16:55.461820+00:00",
        "exitCode": 0,
        "timeoutSeconds": 8,
        "childProcessGroupCleanup": "child exited in the supervised lab process group",
        "stdout": "[{\"ifindex\":1,\"ifname\":\"lo\",\"flags\":[\"LOOPBACK\",\"UP\",\"LOWER_UP\"],\"mtu\":65536,\"operstate\":\"UNKNOWN\",\"txqlen\":1000,\"addr_info\":[{\"family\":\"inet6\",\"local\":\"::1\",\"prefixlen\":128,\"scope\":\"host\",\"valid_life_time\":4294967295,\"preferred_life_time\":4294967295}]},{\"ifindex\":2,\"link\":\"if3\",\"ifname\":\"r-c\",\"flags\":[\"BROADCAST\",\"MULTICAST\",\"UP\",\"LOWER_UP\"],\"mtu\":1500,\"operstate\":\"UP\",\"txqlen\":1000,\"addr_info\":[{\"family\":\"inet6\",\"local\":\"2001:db8:31::1\",\"prefixlen\":64,\"scope\":\"global\",\"nodad\":true,\"valid_life_time\":4294967295,\"preferred_life_time\":4294967295},{\"family\":\"inet6\",\"local\":\"fe80::8c5b:d1ff:fe0c:f668\",\"prefixlen\":64,\"scope\":\"link\",\"valid_life_time\":4294967295,\"preferred_life_time\":4294967295}]},{\"ifindex\":5,\"link\":\"if4\",\"ifname\":\"r-s\",\"flags\":[\"BROADCAST\",\"MULTICAST\",\"UP\",\"LOWER_UP\"],\"mtu\":1500,\"operstate\":\"UP\",\"txqlen\":1000,\"addr_info\":[{\"family\":\"inet6\",\"local\":\"2001:db8:32::1\",\"prefixlen\":64,\"scope\":\"global\",\"nodad\":true,\"valid_life_time\":4294967295,\"preferred_life_time\":4294967295},{\"family\":\"inet6\",\"local\":\"fe80::ec8c:6eff:febf:bea7\",\"prefixlen\":64,\"scope\":\"link\",\"valid_life_time\":4294967295,\"preferred_life_time\":4294967295}]}]\n",
        "stderr": ""
      }
    },
    "ncap-server": {
      "ipv4": {
        "parentTaskId": "network-operations-capstone",
        "cwd": "/home/runner/work/Network-Systems/Network-Systems/NS-33-applied-studio-17-network-systems-lab-17-supplemental-2/starter",
        "command": [
          "ip",
          "-n",
          "ncap-server",
          "-4",
          "-j",
          "address",
          "show"
        ],
        "pid": 3317,
        "parentPid": 3246,
        "processGroup": 3246,
        "startTime": "2026-11-15T21:16:55.461825+00:00",
        "endTime": "2026-11-15T21:16:55.462828+00:00",
        "exitCode": 0,
        "timeoutSeconds": 8,
        "childProcessGroupCleanup": "child exited in the supervised lab process group",
        "stdout": "[{\"ifindex\":1,\"ifname\":\"lo\",\"flags\":[\"LOOPBACK\",\"UP\",\"LOWER_UP\"],\"mtu\":65536,\"qdisc\":\"noqueue\",\"operstate\":\"UNKNOWN\",\"group\":\"default\",\"txqlen\":1000,\"addr_info\":[{\"family\":\"inet\",\"local\":\"127.0.0.1\",\"prefixlen\":8,\"scope\":\"host\",\"label\":\"lo\",\"valid_life_time\":4294967295,\"preferred_life_time\":4294967295}]},{\"ifindex\":4,\"link_index\":5,\"ifname\":\"s-r\",\"flags\":[\"BROADCAST\",\"MULTICAST\",\"UP\",\"LOWER_UP\"],\"mtu\":1500,\"qdisc\":\"noqueue\",\"operstate\":\"UP\",\"group\":\"default\",\"txqlen\":1000,\"link_netnsid\":0,\"addr_info\":[{\"family\":\"inet\",\"local\":\"198.18.32.2\",\"prefixlen\":30,\"scope\":\"global\",\"label\":\"s-r\",\"valid_life_time\":4294967295,\"preferred_life_time\":4294967295}]}]\n",
        "stderr": ""
      },
      "ipv6": {
        "parentTaskId": "network-operations-capstone",
        "cwd": "/home/runner/work/Network-Systems/Network-Systems/NS-33-applied-studio-17-network-systems-lab-17-supplemental-2/starter",
        "command": [
          "ip",
          "-n",
          "ncap-server",
          "-6",
          "-j",
          "address",
          "show"
        ],
        "pid": 3318,
        "parentPid": 3246,
        "processGroup": 3246,
        "startTime": "2026-11-15T21:16:55.462832+00:00",
        "endTime": "2026-11-15T21:16:55.463852+00:00",
        "exitCode": 0,
        "timeoutSeconds": 8,
        "childProcessGroupCleanup": "child exited in the supervised lab process group",
        "stdout": "[{\"ifindex\":1,\"ifname\":\"lo\",\"flags\":[\"LOOPBACK\",\"UP\",\"LOWER_UP\"],\"mtu\":65536,\"operstate\":\"UNKNOWN\",\"txqlen\":1000,\"addr_info\":[{\"family\":\"inet6\",\"local\":\"::1\",\"prefixlen\":128,\"scope\":\"host\",\"valid_life_time\":4294967295,\"preferred_life_time\":4294967295}]},{\"ifindex\":4,\"link\":\"if5\",\"ifname\":\"s-r\",\"flags\":[\"BROADCAST\",\"MULTICAST\",\"UP\",\"LOWER_UP\"],\"mtu\":1500,\"operstate\":\"UP\",\"txqlen\":1000,\"addr_info\":[{\"family\":\"inet6\",\"local\":\"2001:db8:32::2\",\"prefixlen\":64,\"scope\":\"global\",\"nodad\":true,\"valid_life_time\":4294967295,\"preferred_life_time\":4294967295},{\"family\":\"inet6\",\"local\":\"fe80::fc79:baff:feea:525a\",\"prefixlen\":64,\"scope\":\"link\",\"valid_life_time\":4294967295,\"preferred_life_time\":4294967295}]}]\n",
        "stderr": ""
      }
    }
  },
  "forwarding": {
    "parentTaskId": "network-operations-capstone",
    "cwd": "/home/runner/work/Network-Systems/Network-Systems/NS-33-applied-studio-17-network-systems-lab-17-supplemental-2/starter",
    "command": [
      "ip",
      "netns",
      "exec",
      "ncap-router",
      "sysctl",
      "net.ipv4.ip_forward",
      "net.ipv6.conf.all.forwarding"
    ],
    "pid": 3319,
    "parentPid": 3246,
    "processGroup": 3246,
    "startTime": "2026-11-15T21:16:55.463859+00:00",
    "endTime": "2026-11-15T21:16:55.466347+00:00",
    "exitCode": 0,
    "timeoutSeconds": 8,
    "childProcessGroupCleanup": "child exited in the supervised lab process group",
    "stdout": "net.ipv4.ip_forward = 1\nnet.ipv6.conf.all.forwarding = 1\n",
    "stderr": ""
  },
  "routes4": {
    "parentTaskId": "network-operations-capstone",
    "cwd": "/home/runner/work/Network-Systems/Network-Systems/NS-33-applied-studio-17-network-systems-lab-17-supplemental-2/starter",
    "command": [
      "ip",
      "-n",
      "ncap-client",
      "-4",
      "route",
      "show"
    ],
    "pid": 3320,
    "parentPid": 3246,
    "processGroup": 3246,
    "startTime": "2026-11-15T21:16:55.466353+00:00",
    "endTime": "2026-11-15T21:16:55.467336+00:00",
    "exitCode": 0,
    "timeoutSeconds": 8,
    "childProcessGroupCleanup": "child exited in the supervised lab process group",
    "stdout": "198.18.31.0/30 dev c-r proto kernel scope link src 198.18.31.2 \n198.18.32.0/31 via 198.18.31.1 dev c-r \n",
    "stderr": ""
  },
  "routes6": {
    "parentTaskId": "network-operations-capstone",
    "cwd": "/home/runner/work/Network-Systems/Network-Systems/NS-33-applied-studio-17-network-systems-lab-17-supplemental-2/starter",
    "command": [
      "ip",
      "-n",
      "ncap-client",
      "-6",
      "route",
      "show"
    ],
    "pid": 3321,
    "parentPid": 3246,
    "processGroup": 3246,
    "startTime": "2026-11-15T21:16:55.467340+00:00",
    "endTime": "2026-11-15T21:16:55.468320+00:00",
    "exitCode": 0,
    "timeoutSeconds": 8,
    "childProcessGroupCleanup": "child exited in the supervised lab process group",
    "stdout": "2001:db8:31::/64 dev c-r proto kernel metric 256 pref medium\n2001:db8:32::/64 via 2001:db8:31::1 dev c-r metric 1024 pref medium\nfe80::/64 dev c-r proto kernel metric 256 pref medium\n",
    "stderr": ""
  },
  "routeGet4": {
    "parentTaskId": "network-operations-capstone",
    "cwd": "/home/runner/work/Network-Systems/Network-Systems/NS-33-applied-studio-17-network-systems-lab-17-supplemental-2/starter",
    "command": [
      "ip",
      "-n",
      "ncap-client",
      "-4",
      "route",
      "get",
      "198.18.32.2"
    ],
    "pid": 3322,
    "parentPid": 3246,
    "processGroup": 3246,
    "startTime": "2026-11-15T21:16:55.468324+00:00",
    "endTime": "2026-11-15T21:16:55.469248+00:00",
    "exitCode": 2,
    "timeoutSeconds": 8,
    "childProcessGroupCleanup": "child exited in the supervised lab process group",
    "stdout": "",
    "stderr": "RTNETLINK answers: Network is unreachable\n"
  },
  "routeGetServerRouter4": {
    "parentTaskId": "network-operations-capstone",
    "cwd": "/home/runner/work/Network-Systems/Network-Systems/NS-33-applied-studio-17-network-systems-lab-17-supplemental-2/starter",
    "command": [
      "ip",
      "-n",
      "ncap-client",
      "-4",
      "route",
      "get",
      "198.18.32.1"
    ],
    "pid": 3323,
    "parentPid": 3246,
    "processGroup": 3246,
    "startTime": "2026-11-15T21:16:55.469252+00:00",
    "endTime": "2026-11-15T21:16:55.470213+00:00",
    "exitCode": 0,
    "timeoutSeconds": 8,
    "childProcessGroupCleanup": "child exited in the supervised lab process group",
    "stdout": "198.18.32.1 via 198.18.31.1 dev c-r src 198.18.31.2 uid 0 \n    cache \n",
    "stderr": ""
  },
  "routeGet6": {
    "parentTaskId": "network-operations-capstone",
    "cwd": "/home/runner/work/Network-Systems/Network-Systems/NS-33-applied-studio-17-network-systems-lab-17-supplemental-2/starter",
    "command": [
      "ip",
      "-n",
      "ncap-client",
      "-6",
      "route",
      "get",
      "2001:db8:32::2"
    ],
    "pid": 3324,
    "parentPid": 3246,
    "processGroup": 3246,
    "startTime": "2026-11-15T21:16:55.470216+00:00",
    "endTime": "2026-11-15T21:16:55.471193+00:00",
    "exitCode": 0,
    "timeoutSeconds": 8,
    "childProcessGroupCleanup": "child exited in the supervised lab process group",
    "stdout": "2001:db8:32::2 from :: via 2001:db8:31::1 dev c-r src 2001:db8:31::2 metric 1024 pref medium\n",
    "stderr": ""
  }
}
```

### Name service, sockets and policy

```json
{
  "dns": {
    "A": {
      "parentTaskId": "network-operations-capstone",
      "cwd": "/home/runner/work/Network-Systems/Network-Systems/NS-33-applied-studio-17-network-systems-lab-17-supplemental-2/starter",
      "command": [
        "ip",
        "netns",
        "exec",
        "ncap-client",
        "dig",
        "@2001:db8:32::2",
        "-p",
        "15353",
        "blue.capstone.test",
        "A",
        "+short",
        "+time=1",
        "+tries=1"
      ],
      "pid": 3328,
      "parentPid": 3246,
      "processGroup": 3246,
      "startTime": "2026-11-15T21:16:55.486785+00:00",
      "endTime": "2026-11-15T21:16:55.503983+00:00",
      "exitCode": 0,
      "timeoutSeconds": 8,
      "childProcessGroupCleanup": "child exited in the supervised lab process group",
      "stdout": "198.18.32.2\n",
      "stderr": ""
    },
    "AAAA": {
      "parentTaskId": "network-operations-capstone",
      "cwd": "/home/runner/work/Network-Systems/Network-Systems/NS-33-applied-studio-17-network-systems-lab-17-supplemental-2/starter",
      "command": [
        "ip",
        "netns",
        "exec",
        "ncap-client",
        "dig",
        "@2001:db8:32::2",
        "-p",
        "15353",
        "blue.capstone.test",
        "AAAA",
        "+short",
        "+time=1",
        "+tries=1"
      ],
      "pid": 3333,
      "parentPid": 3246,
      "processGroup": 3246,
      "startTime": "2026-11-15T21:16:55.503994+00:00",
      "endTime": "2026-11-15T21:16:55.520731+00:00",
      "exitCode": 0,
      "timeoutSeconds": 8,
      "childProcessGroupCleanup": "child exited in the supervised lab process group",
      "stdout": "2001:db8:32::2\n",
      "stderr": ""
    }
  },
  "dns4": {
    "parentTaskId": "network-operations-capstone",
    "cwd": "/home/runner/work/Network-Systems/Network-Systems/NS-33-applied-studio-17-network-systems-lab-17-supplemental-2/starter",
    "command": [
      "ip",
      "netns",
      "exec",
      "ncap-client",
      "dig",
      "@198.18.32.2",
      "-p",
      "15353",
      "blue.capstone.test",
      "A",
      "+short",
      "+time=1",
      "+tries=1"
    ],
    "pid": 3338,
    "parentPid": 3246,
    "processGroup": 3246,
    "startTime": "2026-11-15T21:16:55.520742+00:00",
    "endTime": "2026-11-15T21:16:55.537113+00:00",
    "exitCode": 9,
    "timeoutSeconds": 8,
    "childProcessGroupCleanup": "child exited in the supervised lab process group",
    "stdout": ";; UDP setup with 198.18.32.2#15353(198.18.32.2) for blue.capstone.test failed: network unreachable.\n;; no servers could be reached\n",
    "stderr": ""
  },
  "resolvedDestinations": {
    "A": "198.18.32.2",
    "AAAA": "2001:db8:32::2"
  },
  "listeners": {
    "parentTaskId": "network-operations-capstone",
    "cwd": "/home/runner/work/Network-Systems/Network-Systems/NS-33-applied-studio-17-network-systems-lab-17-supplemental-2/starter",
    "command": [
      "ip",
      "netns",
      "exec",
      "ncap-server",
      "ss",
      "-H",
      "-lntup"
    ],
    "pid": 3325,
    "parentPid": 3246,
    "processGroup": 3246,
    "startTime": "2026-11-15T21:16:55.471197+00:00",
    "endTime": "2026-11-15T21:16:55.482956+00:00",
    "exitCode": 0,
    "timeoutSeconds": 8,
    "childProcessGroupCleanup": "child exited in the supervised lab process group",
    "stdout": "udp UNCONN 0      0           198.18.32.2:15353 0.0.0.0:* users:((\"dnsmasq\",pid=3290,fd=4))\nudp UNCONN 0      0      [2001:db8:32::2]:15353    [::]:* users:((\"dnsmasq\",pid=3290,fd=6))\ntcp LISTEN 0      32          198.18.32.2:15353 0.0.0.0:* users:((\"dnsmasq\",pid=3290,fd=5))\ntcp LISTEN 0      5               0.0.0.0:8088  0.0.0.0:* users:((\"python3\",pid=3291,fd=6))\ntcp LISTEN 0      5               0.0.0.0:8080  0.0.0.0:* users:((\"python3\",pid=3291,fd=4))\ntcp LISTEN 0      5             127.0.0.1:9000  0.0.0.0:* users:((\"python3\",pid=3291,fd=3))\ntcp LISTEN 0      32     [2001:db8:32::2]:15353    [::]:* users:((\"dnsmasq\",pid=3290,fd=7))\ntcp LISTEN 0      5                  [::]:8088     [::]:* users:((\"python3\",pid=3291,fd=7))\ntcp LISTEN 0      5                  [::]:8080     [::]:* users:((\"python3\",pid=3291,fd=5))\n",
    "stderr": ""
  },
  "policy4": {
    "parentTaskId": "network-operations-capstone",
    "cwd": "/home/runner/work/Network-Systems/Network-Systems/NS-33-applied-studio-17-network-systems-lab-17-supplemental-2/starter",
    "command": [
      "ip",
      "netns",
      "exec",
      "ncap-server",
      "iptables",
      "-S"
    ],
    "pid": 3326,
    "parentPid": 3246,
    "processGroup": 3246,
    "startTime": "2026-11-15T21:16:55.482968+00:00",
    "endTime": "2026-11-15T21:16:55.484916+00:00",
    "exitCode": 0,
    "timeoutSeconds": 8,
    "childProcessGroupCleanup": "child exited in the supervised lab process group",
    "stdout": "-P INPUT DROP\n-P FORWARD ACCEPT\n-P OUTPUT ACCEPT\n-A INPUT -i lo -j ACCEPT\n-A INPUT -m conntrack --ctstate RELATED,ESTABLISHED -j ACCEPT\n-A INPUT -s 198.18.31.2/32 -p udp -m udp --dport 15353 -j ACCEPT\n-A INPUT -s 198.18.31.2/32 -p tcp -m tcp --dport 8080 -j ACCEPT\n",
    "stderr": ""
  },
  "policy6": {
    "parentTaskId": "network-operations-capstone",
    "cwd": "/home/runner/work/Network-Systems/Network-Systems/NS-33-applied-studio-17-network-systems-lab-17-supplemental-2/starter",
    "command": [
      "ip",
      "netns",
      "exec",
      "ncap-server",
      "ip6tables",
      "-S"
    ],
    "pid": 3327,
    "parentPid": 3246,
    "processGroup": 3246,
    "startTime": "2026-11-15T21:16:55.484923+00:00",
    "endTime": "2026-11-15T21:16:55.486778+00:00",
    "exitCode": 0,
    "timeoutSeconds": 8,
    "childProcessGroupCleanup": "child exited in the supervised lab process group",
    "stdout": "-P INPUT DROP\n-P FORWARD ACCEPT\n-P OUTPUT ACCEPT\n-A INPUT -i lo -j ACCEPT\n-A INPUT -m conntrack --ctstate RELATED,ESTABLISHED -j ACCEPT\n-A INPUT -p ipv6-icmp -j ACCEPT\n-A INPUT -s 2001:db8:31::2/128 -p udp -m udp --dport 15353 -j ACCEPT\n-A INPUT -s 2001:db8:31::2/128 -p tcp -m tcp --dport 8080 -j ACCEPT\n",
    "stderr": ""
  }
}
```

### Application and denied controls

```json
{
  "http4": {
    "command": {
      "parentTaskId": "network-operations-capstone",
      "cwd": "/home/runner/work/Network-Systems/Network-Systems/NS-33-applied-studio-17-network-systems-lab-17-supplemental-2/starter",
      "command": [
        "ip",
        "netns",
        "exec",
        "ncap-client",
        "curl",
        "--noproxy",
        "*",
        "-g",
        "--silent",
        "--show-error",
        "--max-time",
        "1",
        "--header",
        "Host: blue.capstone.test",
        "--output",
        "/tmp/owned-capstone-optional-p40yw1ue/prefix-starter-default/http4.body",
        "--write-out",
        "%{http_code}",
        "http://198.18.32.2:8080/health"
      ],
      "pid": 3343,
      "parentPid": 3246,
      "processGroup": 3246,
      "startTime": "2026-11-15T21:16:55.537249+00:00",
      "endTime": "2026-11-15T21:16:55.543114+00:00",
      "exitCode": 7,
      "timeoutSeconds": 3,
      "childProcessGroupCleanup": "child exited in the supervised lab process group",
      "stdout": "000",
      "stderr": "curl: (7) Failed to connect to 198.18.32.2 port 8080 after 0 ms: Couldn't connect to server\n"
    },
    "status": "000",
    "body": ""
  },
  "http6": {
    "command": {
      "parentTaskId": "network-operations-capstone",
      "cwd": "/home/runner/work/Network-Systems/Network-Systems/NS-33-applied-studio-17-network-systems-lab-17-supplemental-2/starter",
      "command": [
        "ip",
        "netns",
        "exec",
        "ncap-client",
        "curl",
        "--noproxy",
        "*",
        "-g",
        "--silent",
        "--show-error",
        "--max-time",
        "1",
        "--header",
        "Host: blue.capstone.test",
        "--output",
        "/tmp/owned-capstone-optional-p40yw1ue/prefix-starter-default/http6.body",
        "--write-out",
        "%{http_code}",
        "http://[2001:db8:32::2]:8080/health"
      ],
      "pid": 3344,
      "parentPid": 3246,
      "processGroup": 3246,
      "startTime": "2026-11-15T21:16:55.543155+00:00",
      "endTime": "2026-11-15T21:16:55.548865+00:00",
      "exitCode": 0,
      "timeoutSeconds": 3,
      "childProcessGroupCleanup": "child exited in the supervised lab process group",
      "stdout": "200",
      "stderr": ""
    },
    "status": "200",
    "body": "{\"fixture\": \"owned-operations-capstone\", \"token\": \"039ffe6b49eee4e54b4c\", \"path\": \"/health\"}"
  },
  "missingPath": {
    "command": {
      "parentTaskId": "network-operations-capstone",
      "cwd": "/home/runner/work/Network-Systems/Network-Systems/NS-33-applied-studio-17-network-systems-lab-17-supplemental-2/starter",
      "command": [
        "ip",
        "netns",
        "exec",
        "ncap-client",
        "curl",
        "--noproxy",
        "*",
        "-g",
        "--silent",
        "--show-error",
        "--max-time",
        "1",
        "--header",
        "Host: blue.capstone.test",
        "--output",
        "/tmp/owned-capstone-optional-p40yw1ue/prefix-starter-default/missing.body",
        "--write-out",
        "%{http_code}",
        "http://[2001:db8:32::2]:8080/missing"
      ],
      "pid": 3347,
      "parentPid": 3246,
      "processGroup": 3246,
      "startTime": "2026-11-15T21:16:55.548939+00:00",
      "endTime": "2026-11-15T21:16:55.553939+00:00",
      "exitCode": 0,
      "timeoutSeconds": 3,
      "childProcessGroupCleanup": "child exited in the supervised lab process group",
      "stdout": "404",
      "stderr": ""
    },
    "status": "404",
    "body": "{\"fixture\": \"owned-operations-capstone\", \"token\": \"039ffe6b49eee4e54b4c\", \"path\": \"/missing\"}"
  },
  "denied4": {
    "command": {
      "parentTaskId": "network-operations-capstone",
      "cwd": "/home/runner/work/Network-Systems/Network-Systems/NS-33-applied-studio-17-network-systems-lab-17-supplemental-2/starter",
      "command": [
        "ip",
        "netns",
        "exec",
        "ncap-client",
        "curl",
        "--noproxy",
        "*",
        "-g",
        "--silent",
        "--show-error",
        "--max-time",
        "1",
        "--header",
        "Host: blue.capstone.test",
        "--output",
        "/tmp/owned-capstone-optional-p40yw1ue/prefix-starter-default/denied4.body",
        "--write-out",
        "%{http_code}",
        "http://198.18.32.2:8088/health"
      ],
      "pid": 3350,
      "parentPid": 3246,
      "processGroup": 3246,
      "startTime": "2026-11-15T21:16:55.553993+00:00",
      "endTime": "2026-11-15T21:16:55.559398+00:00",
      "exitCode": 7,
      "timeoutSeconds": 3,
      "childProcessGroupCleanup": "child exited in the supervised lab process group",
      "stdout": "000",
      "stderr": "curl: (7) Failed to connect to 198.18.32.2 port 8088 after 0 ms: Couldn't connect to server\n"
    },
    "status": "000",
    "body": ""
  },
  "denied6": {
    "command": {
      "parentTaskId": "network-operations-capstone",
      "cwd": "/home/runner/work/Network-Systems/Network-Systems/NS-33-applied-studio-17-network-systems-lab-17-supplemental-2/starter",
      "command": [
        "ip",
        "netns",
        "exec",
        "ncap-client",
        "curl",
        "--noproxy",
        "*",
        "-g",
        "--silent",
        "--show-error",
        "--max-time",
        "1",
        "--header",
        "Host: blue.capstone.test",
        "--output",
        "/tmp/owned-capstone-optional-p40yw1ue/prefix-starter-default/denied6.body",
        "--write-out",
        "%{http_code}",
        "http://[2001:db8:32::2]:8088/health"
      ],
      "pid": 3351,
      "parentPid": 3246,
      "processGroup": 3246,
      "startTime": "2026-11-15T21:16:55.559426+00:00",
      "endTime": "2026-11-15T21:16:56.565323+00:00",
      "exitCode": 28,
      "timeoutSeconds": 3,
      "childProcessGroupCleanup": "child exited in the supervised lab process group",
      "stdout": "000",
      "stderr": "curl: (28) Connection timed out after 1001 milliseconds\n"
    },
    "status": "000",
    "body": ""
  },
  "directUpstream": {
    "command": {
      "parentTaskId": "network-operations-capstone",
      "cwd": "/home/runner/work/Network-Systems/Network-Systems/NS-33-applied-studio-17-network-systems-lab-17-supplemental-2/starter",
      "command": [
        "ip",
        "netns",
        "exec",
        "ncap-client",
        "curl",
        "--noproxy",
        "*",
        "-g",
        "--silent",
        "--show-error",
        "--max-time",
        "1",
        "--header",
        "Host: blue.capstone.test",
        "--output",
        "/tmp/owned-capstone-optional-p40yw1ue/prefix-starter-default/direct-upstream.body",
        "--write-out",
        "%{http_code}",
        "http://[2001:db8:32::2]:9000/health"
      ],
      "pid": 3352,
      "parentPid": 3246,
      "processGroup": 3246,
      "startTime": "2026-11-15T21:16:56.565406+00:00",
      "endTime": "2026-11-15T21:16:57.572452+00:00",
      "exitCode": 28,
      "timeoutSeconds": 3,
      "childProcessGroupCleanup": "child exited in the supervised lab process group",
      "stdout": "000",
      "stderr": "curl: (28) Connection timed out after 1001 milliseconds\n"
    },
    "status": "000",
    "body": ""
  }
}
```

### Bounded packet reading

```json
{
  "packetRead": {
    "parentTaskId": "network-operations-capstone",
    "cwd": "/home/runner/work/Network-Systems/Network-Systems/NS-33-applied-studio-17-network-systems-lab-17-supplemental-2/starter",
    "command": [
      "tcpdump",
      "-n",
      "-r",
      "/tmp/owned-capstone-optional-p40yw1ue/prefix-starter-default/capture.pcap"
    ],
    "pid": 3359,
    "parentPid": 3246,
    "processGroup": 3246,
    "startTime": "2026-11-15T21:16:57.596253+00:00",
    "endTime": "2026-11-15T21:16:57.598715+00:00",
    "exitCode": 0,
    "timeoutSeconds": 8,
    "childProcessGroupCleanup": "child exited in the supervised lab process group",
    "stdout": "21:16:55.492813 IP6 2001:db8:31::2.47512 > 2001:db8:32::2.15353: UDP, length 59\n21:16:55.492901 IP6 2001:db8:32::2.15353 > 2001:db8:31::2.47512: UDP, length 63\n21:16:55.509618 IP6 2001:db8:31::2.57468 > 2001:db8:32::2.15353: UDP, length 59\n21:16:55.509678 IP6 2001:db8:32::2.15353 > 2001:db8:31::2.57468: UDP, length 75\n21:16:55.547004 IP6 2001:db8:31::2.37380 > 2001:db8:32::2.8080: Flags [S], seq 424624937, win 64800, options [mss 1440,sackOK,TS val 4008641430 ecr 0,nop,wscale 10], length 0\n21:16:55.547026 IP6 2001:db8:32::2.8080 > 2001:db8:31::2.37380: Flags [S.], seq 3271968761, ack 424624938, win 64260, options [mss 1440,sackOK,TS val 3371846727 ecr 4008641430,nop,wscale 10], length 0\n21:16:55.547043 IP6 2001:db8:31::2.37380 > 2001:db8:32::2.8080: Flags [.], ack 1, win 64, options [nop,nop,TS val 4008641430 ecr 3371846727], length 0\n21:16:55.547086 IP6 2001:db8:31::2.37380 > 2001:db8:32::2.8080: Flags [P.], seq 1:88, ack 1, win 64, options [nop,nop,TS val 4008641430 ecr 3371846727], length 87: HTTP: GET /health HTTP/1.1\n21:16:55.547091 IP6 2001:db8:32::2.8080 > 2001:db8:31::2.37380: Flags [.], ack 88, win 63, options [nop,nop,TS val 3371846727 ecr 4008641430], length 0\n21:16:55.548089 IP6 2001:db8:32::2.8080 > 2001:db8:31::2.37380: Flags [P.], seq 1:188, ack 88, win 63, options [nop,nop,TS val 3371846728 ecr 4008641430], length 187: HTTP: HTTP/1.0 200 OK\n21:16:55.548101 IP6 2001:db8:31::2.37380 > 2001:db8:32::2.8080: Flags [.], ack 188, win 64, options [nop,nop,TS val 4008641431 ecr 3371846728], length 0\n21:16:55.548136 IP6 2001:db8:32::2.8080 > 2001:db8:31::2.37380: Flags [P.], seq 188:280, ack 88, win 63, options [nop,nop,TS val 3371846728 ecr 4008641431], length 92: HTTP\n21:16:55.548144 IP6 2001:db8:31::2.37380 > 2001:db8:32::2.8080: Flags [.], ack 280, win 64, options [nop,nop,TS val 4008641431 ecr 3371846728], length 0\n21:16:55.548160 IP6 2001:db8:32::2.8080 > 2001:db8:31::2.37380: Flags [F.], seq 280, ack 88, win 63, options [nop,nop,TS val 3371846728 ecr 4008641431], length 0\n21:16:55.548206 IP6 2001:db8:31::2.37380 > 2001:db8:32::2.8080: Flags [F.], seq 88, ack 281, win 64, options [nop,nop,TS val 4008641431 ecr 3371846728], length 0\n21:16:55.548214 IP6 2001:db8:32::2.8080 > 2001:db8:31::2.37380: Flags [.], ack 89, win 63, options [nop,nop,TS val 3371846728 ecr 4008641431], length 0\n21:16:55.552650 IP6 2001:db8:31::2.37390 > 2001:db8:32::2.8080: Flags [S], seq 1017411626, win 64800, options [mss 1440,sackOK,TS val 2919315389 ecr 0,nop,wscale 10], length 0\n21:16:55.552661 IP6 2001:db8:32::2.8080 > 2001:db8:31::2.37390: Flags [S.], seq 1320445698, ack 1017411627, win 64260, options [mss 1440,sackOK,TS val 1433673311 ecr 2919315389,nop,wscale 10], length 0\n21:16:55.552672 IP6 2001:db8:31::2.37390 > 2001:db8:32::2.8080: Flags [.], ack 1, win 64, options [nop,nop,TS val 2919315389 ecr 1433673311], length 0\n21:16:55.552709 IP6 2001:db8:31::2.37390 > 2001:db8:32::2.8080: Flags [P.], seq 1:89, ack 1, win 64, options [nop,nop,TS val 2919315389 ecr 1433673311], length 88: HTTP: GET /missing HTTP/1.1\n21:16:55.552714 IP6 2001:db8:32::2.8080 > 2001:db8:31::2.37390: Flags [.], ack 89, win 63, options [nop,nop,TS val 1433673311 ecr 2919315389], length 0\n21:16:55.553221 IP6 2001:db8:32::2.8080 > 2001:db8:31::2.37390: Flags [P.], seq 1:195, ack 89, win 63, options [nop,nop,TS val 1433673311 ecr 2919315389], length 194: HTTP: HTTP/1.0 404 Not Found\n21:16:55.553232 IP6 2001:db8:31::2.37390 > 2001:db8:32::2.8080: Flags [.], ack 195, win 64, options [nop,nop,TS val 2919315389 ecr 1433673311], length 0\n21:16:55.553261 IP6 2001:db8:32::2.8080 > 2001:db8:31::2.37390: Flags [P.], seq 195:288, ack 89, win 63, options [nop,nop,TS val 1433673311 ecr 2919315389], length 93: HTTP\n21:16:55.553268 IP6 2001:db8:31::2.37390 > 2001:db8:32::2.8080: Flags [.], ack 288, win 64, options [nop,nop,TS val 2919315389 ecr 1433673311], length 0\n21:16:55.553281 IP6 2001:db8:32::2.8080 > 2001:db8:31::2.37390: Flags [F.], seq 288, ack 89, win 63, options [nop,nop,TS val 1433673311 ecr 2919315389], length 0\n21:16:55.553312 IP6 2001:db8:31::2.37390 > 2001:db8:32::2.8080: Flags [F.], seq 89, ack 289, win 64, options [nop,nop,TS val 2919315389 ecr 1433673311], length 0\n21:16:55.553318 IP6 2001:db8:32::2.8080 > 2001:db8:31::2.37390: Flags [.], ack 90, win 63, options [nop,nop,TS val 1433673311 ecr 2919315389], length 0\n",
    "stderr": "reading from file /tmp/owned-capstone-optional-p40yw1ue/prefix-starter-default/capture.pcap, link-type EN10MB (Ethernet), snapshot length 262144\n"
  }
}
```

### Cleanup

```json
{
  "completed": false,
  "interrupted": false,
  "workers": [
    {
      "parentTaskId": "network-operations-capstone",
      "cwd": "/home/runner/work/Network-Systems/Network-Systems/NS-33-applied-studio-17-network-systems-lab-17-supplemental-2/starter",
      "command": [
        "ip",
        "netns",
        "exec",
        "ncap-server",
        "dnsmasq",
        "--no-daemon",
        "--conf-file=/dev/null",
        "--no-hosts",
        "--no-resolv",
        "--no-poll",
        "--cache-size=0",
        "--user=root",
        "--bind-interfaces",
        "--port=15353",
        "--listen-address=198.18.32.2",
        "--listen-address=2001:db8:32::2",
        "--address=/blue.capstone.test/198.18.32.2",
        "--address=/blue.capstone.test/2001:db8:32::2",
        "--pid-file=/tmp/owned-capstone-optional-p40yw1ue/prefix-starter-default/dnsmasq.pid",
        "--log-queries"
      ],
      "pid": 3290,
      "parentPid": 3246,
      "processGroup": 3246,
      "startTime": "2026-11-15T21:16:53.298395+00:00",
      "timeoutSeconds": 35,
      "log": "dns.log",
      "endTime": "2026-11-15T21:16:57.592368+00:00",
      "exitCode": 0,
      "childProcessGroupCleanup": "owned worker reaped in enclosing supervised lab group"
    },
    {
      "parentTaskId": "network-operations-capstone",
      "cwd": "/home/runner/work/Network-Systems/Network-Systems/NS-33-applied-studio-17-network-systems-lab-17-supplemental-2/starter",
      "command": [
        "ip",
        "netns",
        "exec",
        "ncap-server",
        "/usr/bin/python3",
        "/home/runner/work/Network-Systems/Network-Systems/NS-33-applied-studio-17-network-systems-lab-17-supplemental-2/starter/capstone_lab.py",
        "_serve",
        "8080",
        "9000",
        "039ffe6b49eee4e54b4c"
      ],
      "pid": 3291,
      "parentPid": 3246,
      "processGroup": 3246,
      "startTime": "2026-11-15T21:16:53.298707+00:00",
      "timeoutSeconds": 35,
      "log": "service.log",
      "endTime": "2026-11-15T21:16:57.591272+00:00",
      "exitCode": -15,
      "childProcessGroupCleanup": "owned worker reaped in enclosing supervised lab group"
    },
    {
      "parentTaskId": "network-operations-capstone",
      "cwd": "/home/runner/work/Network-Systems/Network-Systems/NS-33-applied-studio-17-network-systems-lab-17-supplemental-2/starter",
      "command": [
        "ip",
        "netns",
        "exec",
        "ncap-server",
        "tcpdump",
        "-i",
        "s-r",
        "-s",
        "0",
        "-n",
        "-U",
        "-c",
        "160",
        "-w",
        "/tmp/owned-capstone-optional-p40yw1ue/prefix-starter-default/capture.pcap",
        "tcp port 8080 or udp port 15353"
      ],
      "pid": 3312,
      "parentPid": 3246,
      "processGroup": 3246,
      "startTime": "2026-11-15T21:16:55.427283+00:00",
      "timeoutSeconds": 35,
      "log": "capture.log",
      "endTime": "2026-11-15T21:16:57.587931+00:00",
      "exitCode": 0,
      "childProcessGroupCleanup": "owned worker reaped in enclosing supervised lab group"
    }
  ],
  "remainingNamespaces": "",
  "allWorkersReaped": true
}
```

The recorded parent comparison reports identical before/after snapshots. The matching canonical snapshot SHA-256 is `72caeafc127fca7e8388fdada26d72fa5aa22ca53f710d731e85b202a1e3e24a`. Compared fields: ipv4Policy, ipv4Routes, ipv6Policy, ipv6Routes, links. This covers those recorded fields; the parent host's unrelated configuration contents are omitted.

Inside-record SHA-256: d3ae8f4137bb54ec5febf1e94be0ffb4ce8e784b356db6ca028cf59767a88af3.

## Wrong upstream

### Configuration and execution boundary

```json
{
  "case": {
    "ipv4_service_route": "198.18.32.0/30",
    "proxy_upstream_port": 8088
  },
  "client4": "198.18.31.2",
  "client6": "2001:db8:31::2",
  "server4": "198.18.32.2",
  "server6": "2001:db8:32::2",
  "publicPort": 8080,
  "name": "blue.capstone.test",
  "token": "777138ec000f31ae5fa1",
  "identities": {
    "network": "net:[4026532316]",
    "mount": "mnt:[4026532313]",
    "parentNetwork": "net:[4026531833]",
    "parentMount": "mnt:[4026531832]"
  }
}
```

### Addresses, routes and forwarding

```json
{
  "addresses": {
    "ncap-client": {
      "ipv4": {
        "parentTaskId": "network-operations-capstone",
        "cwd": "/home/runner/work/Network-Systems/Network-Systems/NS-34-applied-studio-17-network-systems-lab-17-supplemental-3/starter",
        "command": [
          "ip",
          "-n",
          "ncap-client",
          "-4",
          "-j",
          "address",
          "show"
        ],
        "pid": 4117,
        "parentPid": 4051,
        "processGroup": 4051,
        "startTime": "2026-11-15T21:17:25.665328+00:00",
        "endTime": "2026-11-15T21:17:25.666414+00:00",
        "exitCode": 0,
        "timeoutSeconds": 8,
        "childProcessGroupCleanup": "child exited in the supervised lab process group",
        "stdout": "[{\"ifindex\":1,\"ifname\":\"lo\",\"flags\":[\"LOOPBACK\",\"UP\",\"LOWER_UP\"],\"mtu\":65536,\"qdisc\":\"noqueue\",\"operstate\":\"UNKNOWN\",\"group\":\"default\",\"txqlen\":1000,\"addr_info\":[{\"family\":\"inet\",\"local\":\"127.0.0.1\",\"prefixlen\":8,\"scope\":\"host\",\"label\":\"lo\",\"valid_life_time\":4294967295,\"preferred_life_time\":4294967295}]},{\"ifindex\":3,\"link_index\":2,\"ifname\":\"c-r\",\"flags\":[\"BROADCAST\",\"MULTICAST\",\"UP\",\"LOWER_UP\"],\"mtu\":1500,\"qdisc\":\"noqueue\",\"operstate\":\"UP\",\"group\":\"default\",\"txqlen\":1000,\"link_netnsid\":1,\"addr_info\":[{\"family\":\"inet\",\"local\":\"198.18.31.2\",\"prefixlen\":30,\"scope\":\"global\",\"label\":\"c-r\",\"valid_life_time\":4294967295,\"preferred_life_time\":4294967295}]}]\n",
        "stderr": ""
      },
      "ipv6": {
        "parentTaskId": "network-operations-capstone",
        "cwd": "/home/runner/work/Network-Systems/Network-Systems/NS-34-applied-studio-17-network-systems-lab-17-supplemental-3/starter",
        "command": [
          "ip",
          "-n",
          "ncap-client",
          "-6",
          "-j",
          "address",
          "show"
        ],
        "pid": 4118,
        "parentPid": 4051,
        "processGroup": 4051,
        "startTime": "2026-11-15T21:17:25.666422+00:00",
        "endTime": "2026-11-15T21:17:25.667443+00:00",
        "exitCode": 0,
        "timeoutSeconds": 8,
        "childProcessGroupCleanup": "child exited in the supervised lab process group",
        "stdout": "[{\"ifindex\":1,\"ifname\":\"lo\",\"flags\":[\"LOOPBACK\",\"UP\",\"LOWER_UP\"],\"mtu\":65536,\"operstate\":\"UNKNOWN\",\"txqlen\":1000,\"addr_info\":[{\"family\":\"inet6\",\"local\":\"::1\",\"prefixlen\":128,\"scope\":\"host\",\"valid_life_time\":4294967295,\"preferred_life_time\":4294967295}]},{\"ifindex\":3,\"link\":\"if2\",\"ifname\":\"c-r\",\"flags\":[\"BROADCAST\",\"MULTICAST\",\"UP\",\"LOWER_UP\"],\"mtu\":1500,\"operstate\":\"UP\",\"txqlen\":1000,\"addr_info\":[{\"family\":\"inet6\",\"local\":\"2001:db8:31::2\",\"prefixlen\":64,\"scope\":\"global\",\"nodad\":true,\"valid_life_time\":4294967295,\"preferred_life_time\":4294967295},{\"family\":\"inet6\",\"local\":\"fe80::70ee:9aff:fec0:7c6c\",\"prefixlen\":64,\"scope\":\"link\",\"valid_life_time\":4294967295,\"preferred_life_time\":4294967295}]}]\n",
        "stderr": ""
      }
    },
    "ncap-router": {
      "ipv4": {
        "parentTaskId": "network-operations-capstone",
        "cwd": "/home/runner/work/Network-Systems/Network-Systems/NS-34-applied-studio-17-network-systems-lab-17-supplemental-3/starter",
        "command": [
          "ip",
          "-n",
          "ncap-router",
          "-4",
          "-j",
          "address",
          "show"
        ],
        "pid": 4119,
        "parentPid": 4051,
        "processGroup": 4051,
        "startTime": "2026-11-15T21:17:25.667449+00:00",
        "endTime": "2026-11-15T21:17:25.668465+00:00",
        "exitCode": 0,
        "timeoutSeconds": 8,
        "childProcessGroupCleanup": "child exited in the supervised lab process group",
        "stdout": "[{\"ifindex\":1,\"ifname\":\"lo\",\"flags\":[\"LOOPBACK\",\"UP\",\"LOWER_UP\"],\"mtu\":65536,\"qdisc\":\"noqueue\",\"operstate\":\"UNKNOWN\",\"group\":\"default\",\"txqlen\":1000,\"addr_info\":[{\"family\":\"inet\",\"local\":\"127.0.0.1\",\"prefixlen\":8,\"scope\":\"host\",\"label\":\"lo\",\"valid_life_time\":4294967295,\"preferred_life_time\":4294967295}]},{\"ifindex\":2,\"link_index\":3,\"ifname\":\"r-c\",\"flags\":[\"BROADCAST\",\"MULTICAST\",\"UP\",\"LOWER_UP\"],\"mtu\":1500,\"qdisc\":\"noqueue\",\"operstate\":\"UP\",\"group\":\"default\",\"txqlen\":1000,\"link_netnsid\":0,\"addr_info\":[{\"family\":\"inet\",\"local\":\"198.18.31.1\",\"prefixlen\":30,\"scope\":\"global\",\"label\":\"r-c\",\"valid_life_time\":4294967295,\"preferred_life_time\":4294967295}]},{\"ifindex\":5,\"link_index\":4,\"ifname\":\"r-s\",\"flags\":[\"BROADCAST\",\"MULTICAST\",\"UP\",\"LOWER_UP\"],\"mtu\":1500,\"qdisc\":\"noqueue\",\"operstate\":\"UP\",\"group\":\"default\",\"txqlen\":1000,\"link_netnsid\":2,\"addr_info\":[{\"family\":\"inet\",\"local\":\"198.18.32.1\",\"prefixlen\":30,\"scope\":\"global\",\"label\":\"r-s\",\"valid_life_time\":4294967295,\"preferred_life_time\":4294967295}]}]\n",
        "stderr": ""
      },
      "ipv6": {
        "parentTaskId": "network-operations-capstone",
        "cwd": "/home/runner/work/Network-Systems/Network-Systems/NS-34-applied-studio-17-network-systems-lab-17-supplemental-3/starter",
        "command": [
          "ip",
          "-n",
          "ncap-router",
          "-6",
          "-j",
          "address",
          "show"
        ],
        "pid": 4120,
        "parentPid": 4051,
        "processGroup": 4051,
        "startTime": "2026-11-15T21:17:25.668469+00:00",
        "endTime": "2026-11-15T21:17:25.669496+00:00",
        "exitCode": 0,
        "timeoutSeconds": 8,
        "childProcessGroupCleanup": "child exited in the supervised lab process group",
        "stdout": "[{\"ifindex\":1,\"ifname\":\"lo\",\"flags\":[\"LOOPBACK\",\"UP\",\"LOWER_UP\"],\"mtu\":65536,\"operstate\":\"UNKNOWN\",\"txqlen\":1000,\"addr_info\":[{\"family\":\"inet6\",\"local\":\"::1\",\"prefixlen\":128,\"scope\":\"host\",\"valid_life_time\":4294967295,\"preferred_life_time\":4294967295}]},{\"ifindex\":2,\"link\":\"if3\",\"ifname\":\"r-c\",\"flags\":[\"BROADCAST\",\"MULTICAST\",\"UP\",\"LOWER_UP\"],\"mtu\":1500,\"operstate\":\"UP\",\"txqlen\":1000,\"addr_info\":[{\"family\":\"inet6\",\"local\":\"2001:db8:31::1\",\"prefixlen\":64,\"scope\":\"global\",\"nodad\":true,\"valid_life_time\":4294967295,\"preferred_life_time\":4294967295},{\"family\":\"inet6\",\"local\":\"fe80::447c:fbff:fe5d:abba\",\"prefixlen\":64,\"scope\":\"link\",\"valid_life_time\":4294967295,\"preferred_life_time\":4294967295}]},{\"ifindex\":5,\"link\":\"if4\",\"ifname\":\"r-s\",\"flags\":[\"BROADCAST\",\"MULTICAST\",\"UP\",\"LOWER_UP\"],\"mtu\":1500,\"operstate\":\"UP\",\"txqlen\":1000,\"addr_info\":[{\"family\":\"inet6\",\"local\":\"2001:db8:32::1\",\"prefixlen\":64,\"scope\":\"global\",\"nodad\":true,\"valid_life_time\":4294967295,\"preferred_life_time\":4294967295},{\"family\":\"inet6\",\"local\":\"fe80::ac0c:48ff:fec1:e74e\",\"prefixlen\":64,\"scope\":\"link\",\"valid_life_time\":4294967295,\"preferred_life_time\":4294967295}]}]\n",
        "stderr": ""
      }
    },
    "ncap-server": {
      "ipv4": {
        "parentTaskId": "network-operations-capstone",
        "cwd": "/home/runner/work/Network-Systems/Network-Systems/NS-34-applied-studio-17-network-systems-lab-17-supplemental-3/starter",
        "command": [
          "ip",
          "-n",
          "ncap-server",
          "-4",
          "-j",
          "address",
          "show"
        ],
        "pid": 4121,
        "parentPid": 4051,
        "processGroup": 4051,
        "startTime": "2026-11-15T21:17:25.669501+00:00",
        "endTime": "2026-11-15T21:17:25.670489+00:00",
        "exitCode": 0,
        "timeoutSeconds": 8,
        "childProcessGroupCleanup": "child exited in the supervised lab process group",
        "stdout": "[{\"ifindex\":1,\"ifname\":\"lo\",\"flags\":[\"LOOPBACK\",\"UP\",\"LOWER_UP\"],\"mtu\":65536,\"qdisc\":\"noqueue\",\"operstate\":\"UNKNOWN\",\"group\":\"default\",\"txqlen\":1000,\"addr_info\":[{\"family\":\"inet\",\"local\":\"127.0.0.1\",\"prefixlen\":8,\"scope\":\"host\",\"label\":\"lo\",\"valid_life_time\":4294967295,\"preferred_life_time\":4294967295}]},{\"ifindex\":4,\"link_index\":5,\"ifname\":\"s-r\",\"flags\":[\"BROADCAST\",\"MULTICAST\",\"UP\",\"LOWER_UP\"],\"mtu\":1500,\"qdisc\":\"noqueue\",\"operstate\":\"UP\",\"group\":\"default\",\"txqlen\":1000,\"link_netnsid\":0,\"addr_info\":[{\"family\":\"inet\",\"local\":\"198.18.32.2\",\"prefixlen\":30,\"scope\":\"global\",\"label\":\"s-r\",\"valid_life_time\":4294967295,\"preferred_life_time\":4294967295}]}]\n",
        "stderr": ""
      },
      "ipv6": {
        "parentTaskId": "network-operations-capstone",
        "cwd": "/home/runner/work/Network-Systems/Network-Systems/NS-34-applied-studio-17-network-systems-lab-17-supplemental-3/starter",
        "command": [
          "ip",
          "-n",
          "ncap-server",
          "-6",
          "-j",
          "address",
          "show"
        ],
        "pid": 4122,
        "parentPid": 4051,
        "processGroup": 4051,
        "startTime": "2026-11-15T21:17:25.670494+00:00",
        "endTime": "2026-11-15T21:17:25.671478+00:00",
        "exitCode": 0,
        "timeoutSeconds": 8,
        "childProcessGroupCleanup": "child exited in the supervised lab process group",
        "stdout": "[{\"ifindex\":1,\"ifname\":\"lo\",\"flags\":[\"LOOPBACK\",\"UP\",\"LOWER_UP\"],\"mtu\":65536,\"operstate\":\"UNKNOWN\",\"txqlen\":1000,\"addr_info\":[{\"family\":\"inet6\",\"local\":\"::1\",\"prefixlen\":128,\"scope\":\"host\",\"valid_life_time\":4294967295,\"preferred_life_time\":4294967295}]},{\"ifindex\":4,\"link\":\"if5\",\"ifname\":\"s-r\",\"flags\":[\"BROADCAST\",\"MULTICAST\",\"UP\",\"LOWER_UP\"],\"mtu\":1500,\"operstate\":\"UP\",\"txqlen\":1000,\"addr_info\":[{\"family\":\"inet6\",\"local\":\"2001:db8:32::2\",\"prefixlen\":64,\"scope\":\"global\",\"nodad\":true,\"valid_life_time\":4294967295,\"preferred_life_time\":4294967295},{\"family\":\"inet6\",\"local\":\"fe80::ece7:8eff:fea3:69db\",\"prefixlen\":64,\"scope\":\"link\",\"valid_life_time\":4294967295,\"preferred_life_time\":4294967295}]}]\n",
        "stderr": ""
      }
    }
  },
  "forwarding": {
    "parentTaskId": "network-operations-capstone",
    "cwd": "/home/runner/work/Network-Systems/Network-Systems/NS-34-applied-studio-17-network-systems-lab-17-supplemental-3/starter",
    "command": [
      "ip",
      "netns",
      "exec",
      "ncap-router",
      "sysctl",
      "net.ipv4.ip_forward",
      "net.ipv6.conf.all.forwarding"
    ],
    "pid": 4123,
    "parentPid": 4051,
    "processGroup": 4051,
    "startTime": "2026-11-15T21:17:25.671484+00:00",
    "endTime": "2026-11-15T21:17:25.673948+00:00",
    "exitCode": 0,
    "timeoutSeconds": 8,
    "childProcessGroupCleanup": "child exited in the supervised lab process group",
    "stdout": "net.ipv4.ip_forward = 1\nnet.ipv6.conf.all.forwarding = 1\n",
    "stderr": ""
  },
  "routes4": {
    "parentTaskId": "network-operations-capstone",
    "cwd": "/home/runner/work/Network-Systems/Network-Systems/NS-34-applied-studio-17-network-systems-lab-17-supplemental-3/starter",
    "command": [
      "ip",
      "-n",
      "ncap-client",
      "-4",
      "route",
      "show"
    ],
    "pid": 4124,
    "parentPid": 4051,
    "processGroup": 4051,
    "startTime": "2026-11-15T21:17:25.673955+00:00",
    "endTime": "2026-11-15T21:17:25.675006+00:00",
    "exitCode": 0,
    "timeoutSeconds": 8,
    "childProcessGroupCleanup": "child exited in the supervised lab process group",
    "stdout": "198.18.31.0/30 dev c-r proto kernel scope link src 198.18.31.2 \n198.18.32.0/30 via 198.18.31.1 dev c-r \n",
    "stderr": ""
  },
  "routes6": {
    "parentTaskId": "network-operations-capstone",
    "cwd": "/home/runner/work/Network-Systems/Network-Systems/NS-34-applied-studio-17-network-systems-lab-17-supplemental-3/starter",
    "command": [
      "ip",
      "-n",
      "ncap-client",
      "-6",
      "route",
      "show"
    ],
    "pid": 4125,
    "parentPid": 4051,
    "processGroup": 4051,
    "startTime": "2026-11-15T21:17:25.675017+00:00",
    "endTime": "2026-11-15T21:17:25.676042+00:00",
    "exitCode": 0,
    "timeoutSeconds": 8,
    "childProcessGroupCleanup": "child exited in the supervised lab process group",
    "stdout": "2001:db8:31::/64 dev c-r proto kernel metric 256 pref medium\n2001:db8:32::/64 via 2001:db8:31::1 dev c-r metric 1024 pref medium\nfe80::/64 dev c-r proto kernel metric 256 pref medium\n",
    "stderr": ""
  },
  "routeGet4": {
    "parentTaskId": "network-operations-capstone",
    "cwd": "/home/runner/work/Network-Systems/Network-Systems/NS-34-applied-studio-17-network-systems-lab-17-supplemental-3/starter",
    "command": [
      "ip",
      "-n",
      "ncap-client",
      "-4",
      "route",
      "get",
      "198.18.32.2"
    ],
    "pid": 4126,
    "parentPid": 4051,
    "processGroup": 4051,
    "startTime": "2026-11-15T21:17:25.676048+00:00",
    "endTime": "2026-11-15T21:17:25.677025+00:00",
    "exitCode": 0,
    "timeoutSeconds": 8,
    "childProcessGroupCleanup": "child exited in the supervised lab process group",
    "stdout": "198.18.32.2 via 198.18.31.1 dev c-r src 198.18.31.2 uid 0 \n    cache \n",
    "stderr": ""
  },
  "routeGetServerRouter4": {
    "parentTaskId": "network-operations-capstone",
    "cwd": "/home/runner/work/Network-Systems/Network-Systems/NS-34-applied-studio-17-network-systems-lab-17-supplemental-3/starter",
    "command": [
      "ip",
      "-n",
      "ncap-client",
      "-4",
      "route",
      "get",
      "198.18.32.1"
    ],
    "pid": 4127,
    "parentPid": 4051,
    "processGroup": 4051,
    "startTime": "2026-11-15T21:17:25.677030+00:00",
    "endTime": "2026-11-15T21:17:25.677998+00:00",
    "exitCode": 0,
    "timeoutSeconds": 8,
    "childProcessGroupCleanup": "child exited in the supervised lab process group",
    "stdout": "198.18.32.1 via 198.18.31.1 dev c-r src 198.18.31.2 uid 0 \n    cache \n",
    "stderr": ""
  },
  "routeGet6": {
    "parentTaskId": "network-operations-capstone",
    "cwd": "/home/runner/work/Network-Systems/Network-Systems/NS-34-applied-studio-17-network-systems-lab-17-supplemental-3/starter",
    "command": [
      "ip",
      "-n",
      "ncap-client",
      "-6",
      "route",
      "get",
      "2001:db8:32::2"
    ],
    "pid": 4128,
    "parentPid": 4051,
    "processGroup": 4051,
    "startTime": "2026-11-15T21:17:25.678003+00:00",
    "endTime": "2026-11-15T21:17:25.678962+00:00",
    "exitCode": 0,
    "timeoutSeconds": 8,
    "childProcessGroupCleanup": "child exited in the supervised lab process group",
    "stdout": "2001:db8:32::2 from :: via 2001:db8:31::1 dev c-r src 2001:db8:31::2 metric 1024 pref medium\n",
    "stderr": ""
  }
}
```

### Name service, sockets and policy

```json
{
  "dns": {
    "A": {
      "parentTaskId": "network-operations-capstone",
      "cwd": "/home/runner/work/Network-Systems/Network-Systems/NS-34-applied-studio-17-network-systems-lab-17-supplemental-3/starter",
      "command": [
        "ip",
        "netns",
        "exec",
        "ncap-client",
        "dig",
        "@2001:db8:32::2",
        "-p",
        "15353",
        "blue.capstone.test",
        "A",
        "+short",
        "+time=1",
        "+tries=1"
      ],
      "pid": 4132,
      "parentPid": 4051,
      "processGroup": 4051,
      "startTime": "2026-11-15T21:17:25.694360+00:00",
      "endTime": "2026-11-15T21:17:25.711372+00:00",
      "exitCode": 0,
      "timeoutSeconds": 8,
      "childProcessGroupCleanup": "child exited in the supervised lab process group",
      "stdout": "198.18.32.2\n",
      "stderr": ""
    },
    "AAAA": {
      "parentTaskId": "network-operations-capstone",
      "cwd": "/home/runner/work/Network-Systems/Network-Systems/NS-34-applied-studio-17-network-systems-lab-17-supplemental-3/starter",
      "command": [
        "ip",
        "netns",
        "exec",
        "ncap-client",
        "dig",
        "@2001:db8:32::2",
        "-p",
        "15353",
        "blue.capstone.test",
        "AAAA",
        "+short",
        "+time=1",
        "+tries=1"
      ],
      "pid": 4137,
      "parentPid": 4051,
      "processGroup": 4051,
      "startTime": "2026-11-15T21:17:25.711383+00:00",
      "endTime": "2026-11-15T21:17:25.727854+00:00",
      "exitCode": 0,
      "timeoutSeconds": 8,
      "childProcessGroupCleanup": "child exited in the supervised lab process group",
      "stdout": "2001:db8:32::2\n",
      "stderr": ""
    }
  },
  "dns4": {
    "parentTaskId": "network-operations-capstone",
    "cwd": "/home/runner/work/Network-Systems/Network-Systems/NS-34-applied-studio-17-network-systems-lab-17-supplemental-3/starter",
    "command": [
      "ip",
      "netns",
      "exec",
      "ncap-client",
      "dig",
      "@198.18.32.2",
      "-p",
      "15353",
      "blue.capstone.test",
      "A",
      "+short",
      "+time=1",
      "+tries=1"
    ],
    "pid": 4142,
    "parentPid": 4051,
    "processGroup": 4051,
    "startTime": "2026-11-15T21:17:25.727865+00:00",
    "endTime": "2026-11-15T21:17:25.744261+00:00",
    "exitCode": 0,
    "timeoutSeconds": 8,
    "childProcessGroupCleanup": "child exited in the supervised lab process group",
    "stdout": "198.18.32.2\n",
    "stderr": ""
  },
  "resolvedDestinations": {
    "A": "198.18.32.2",
    "AAAA": "2001:db8:32::2"
  },
  "listeners": {
    "parentTaskId": "network-operations-capstone",
    "cwd": "/home/runner/work/Network-Systems/Network-Systems/NS-34-applied-studio-17-network-systems-lab-17-supplemental-3/starter",
    "command": [
      "ip",
      "netns",
      "exec",
      "ncap-server",
      "ss",
      "-H",
      "-lntup"
    ],
    "pid": 4129,
    "parentPid": 4051,
    "processGroup": 4051,
    "startTime": "2026-11-15T21:17:25.678967+00:00",
    "endTime": "2026-11-15T21:17:25.690452+00:00",
    "exitCode": 0,
    "timeoutSeconds": 8,
    "childProcessGroupCleanup": "child exited in the supervised lab process group",
    "stdout": "udp UNCONN 0      0           198.18.32.2:15353 0.0.0.0:* users:((\"dnsmasq\",pid=4094,fd=4))\nudp UNCONN 0      0      [2001:db8:32::2]:15353    [::]:* users:((\"dnsmasq\",pid=4094,fd=6))\ntcp LISTEN 0      5             127.0.0.1:9000  0.0.0.0:* users:((\"python3\",pid=4095,fd=3))\ntcp LISTEN 0      5               0.0.0.0:8080  0.0.0.0:* users:((\"python3\",pid=4095,fd=4))\ntcp LISTEN 0      5               0.0.0.0:8088  0.0.0.0:* users:((\"python3\",pid=4095,fd=6))\ntcp LISTEN 0      32          198.18.32.2:15353 0.0.0.0:* users:((\"dnsmasq\",pid=4094,fd=5))\ntcp LISTEN 0      32     [2001:db8:32::2]:15353    [::]:* users:((\"dnsmasq\",pid=4094,fd=7))\ntcp LISTEN 0      5                  [::]:8080     [::]:* users:((\"python3\",pid=4095,fd=5))\ntcp LISTEN 0      5                  [::]:8088     [::]:* users:((\"python3\",pid=4095,fd=7))\n",
    "stderr": ""
  },
  "policy4": {
    "parentTaskId": "network-operations-capstone",
    "cwd": "/home/runner/work/Network-Systems/Network-Systems/NS-34-applied-studio-17-network-systems-lab-17-supplemental-3/starter",
    "command": [
      "ip",
      "netns",
      "exec",
      "ncap-server",
      "iptables",
      "-S"
    ],
    "pid": 4130,
    "parentPid": 4051,
    "processGroup": 4051,
    "startTime": "2026-11-15T21:17:25.690457+00:00",
    "endTime": "2026-11-15T21:17:25.692477+00:00",
    "exitCode": 0,
    "timeoutSeconds": 8,
    "childProcessGroupCleanup": "child exited in the supervised lab process group",
    "stdout": "-P INPUT DROP\n-P FORWARD ACCEPT\n-P OUTPUT ACCEPT\n-A INPUT -i lo -j ACCEPT\n-A INPUT -m conntrack --ctstate RELATED,ESTABLISHED -j ACCEPT\n-A INPUT -s 198.18.31.2/32 -p udp -m udp --dport 15353 -j ACCEPT\n-A INPUT -s 198.18.31.2/32 -p tcp -m tcp --dport 8080 -j ACCEPT\n",
    "stderr": ""
  },
  "policy6": {
    "parentTaskId": "network-operations-capstone",
    "cwd": "/home/runner/work/Network-Systems/Network-Systems/NS-34-applied-studio-17-network-systems-lab-17-supplemental-3/starter",
    "command": [
      "ip",
      "netns",
      "exec",
      "ncap-server",
      "ip6tables",
      "-S"
    ],
    "pid": 4131,
    "parentPid": 4051,
    "processGroup": 4051,
    "startTime": "2026-11-15T21:17:25.692488+00:00",
    "endTime": "2026-11-15T21:17:25.694353+00:00",
    "exitCode": 0,
    "timeoutSeconds": 8,
    "childProcessGroupCleanup": "child exited in the supervised lab process group",
    "stdout": "-P INPUT DROP\n-P FORWARD ACCEPT\n-P OUTPUT ACCEPT\n-A INPUT -i lo -j ACCEPT\n-A INPUT -m conntrack --ctstate RELATED,ESTABLISHED -j ACCEPT\n-A INPUT -p ipv6-icmp -j ACCEPT\n-A INPUT -s 2001:db8:31::2/128 -p udp -m udp --dport 15353 -j ACCEPT\n-A INPUT -s 2001:db8:31::2/128 -p tcp -m tcp --dport 8080 -j ACCEPT\n",
    "stderr": ""
  }
}
```

### Application and denied controls

```json
{
  "http4": {
    "command": {
      "parentTaskId": "network-operations-capstone",
      "cwd": "/home/runner/work/Network-Systems/Network-Systems/NS-34-applied-studio-17-network-systems-lab-17-supplemental-3/starter",
      "command": [
        "ip",
        "netns",
        "exec",
        "ncap-client",
        "curl",
        "--noproxy",
        "*",
        "-g",
        "--silent",
        "--show-error",
        "--max-time",
        "1",
        "--header",
        "Host: blue.capstone.test",
        "--output",
        "/tmp/owned-capstone-optional-p40yw1ue/identity-starter-default/http4.body",
        "--write-out",
        "%{http_code}",
        "http://198.18.32.2:8080/health"
      ],
      "pid": 4147,
      "parentPid": 4051,
      "processGroup": 4051,
      "startTime": "2026-11-15T21:17:25.744390+00:00",
      "endTime": "2026-11-15T21:17:25.751372+00:00",
      "exitCode": 0,
      "timeoutSeconds": 3,
      "childProcessGroupCleanup": "child exited in the supervised lab process group",
      "stdout": "200",
      "stderr": ""
    },
    "status": "200",
    "body": "{\"fixture\": \"owned-denial-control\", \"token\": \"777138ec000f31ae5fa1\", \"path\": \"/health\"}"
  },
  "http6": {
    "command": {
      "parentTaskId": "network-operations-capstone",
      "cwd": "/home/runner/work/Network-Systems/Network-Systems/NS-34-applied-studio-17-network-systems-lab-17-supplemental-3/starter",
      "command": [
        "ip",
        "netns",
        "exec",
        "ncap-client",
        "curl",
        "--noproxy",
        "*",
        "-g",
        "--silent",
        "--show-error",
        "--max-time",
        "1",
        "--header",
        "Host: blue.capstone.test",
        "--output",
        "/tmp/owned-capstone-optional-p40yw1ue/identity-starter-default/http6.body",
        "--write-out",
        "%{http_code}",
        "http://[2001:db8:32::2]:8080/health"
      ],
      "pid": 4150,
      "parentPid": 4051,
      "processGroup": 4051,
      "startTime": "2026-11-15T21:17:25.751447+00:00",
      "endTime": "2026-11-15T21:17:25.757665+00:00",
      "exitCode": 0,
      "timeoutSeconds": 3,
      "childProcessGroupCleanup": "child exited in the supervised lab process group",
      "stdout": "200",
      "stderr": ""
    },
    "status": "200",
    "body": "{\"fixture\": \"owned-denial-control\", \"token\": \"777138ec000f31ae5fa1\", \"path\": \"/health\"}"
  },
  "missingPath": {
    "command": {
      "parentTaskId": "network-operations-capstone",
      "cwd": "/home/runner/work/Network-Systems/Network-Systems/NS-34-applied-studio-17-network-systems-lab-17-supplemental-3/starter",
      "command": [
        "ip",
        "netns",
        "exec",
        "ncap-client",
        "curl",
        "--noproxy",
        "*",
        "-g",
        "--silent",
        "--show-error",
        "--max-time",
        "1",
        "--header",
        "Host: blue.capstone.test",
        "--output",
        "/tmp/owned-capstone-optional-p40yw1ue/identity-starter-default/missing.body",
        "--write-out",
        "%{http_code}",
        "http://[2001:db8:32::2]:8080/missing"
      ],
      "pid": 4153,
      "parentPid": 4051,
      "processGroup": 4051,
      "startTime": "2026-11-15T21:17:25.757720+00:00",
      "endTime": "2026-11-15T21:17:25.763871+00:00",
      "exitCode": 0,
      "timeoutSeconds": 3,
      "childProcessGroupCleanup": "child exited in the supervised lab process group",
      "stdout": "404",
      "stderr": ""
    },
    "status": "404",
    "body": "{\"fixture\": \"owned-denial-control\", \"token\": \"777138ec000f31ae5fa1\", \"path\": \"/missing\"}"
  },
  "denied4": {
    "command": {
      "parentTaskId": "network-operations-capstone",
      "cwd": "/home/runner/work/Network-Systems/Network-Systems/NS-34-applied-studio-17-network-systems-lab-17-supplemental-3/starter",
      "command": [
        "ip",
        "netns",
        "exec",
        "ncap-client",
        "curl",
        "--noproxy",
        "*",
        "-g",
        "--silent",
        "--show-error",
        "--max-time",
        "1",
        "--header",
        "Host: blue.capstone.test",
        "--output",
        "/tmp/owned-capstone-optional-p40yw1ue/identity-starter-default/denied4.body",
        "--write-out",
        "%{http_code}",
        "http://198.18.32.2:8088/health"
      ],
      "pid": 4156,
      "parentPid": 4051,
      "processGroup": 4051,
      "startTime": "2026-11-15T21:17:25.763926+00:00",
      "endTime": "2026-11-15T21:17:26.769840+00:00",
      "exitCode": 28,
      "timeoutSeconds": 3,
      "childProcessGroupCleanup": "child exited in the supervised lab process group",
      "stdout": "000",
      "stderr": "curl: (28) Connection timed out after 1001 milliseconds\n"
    },
    "status": "000",
    "body": ""
  },
  "denied6": {
    "command": {
      "parentTaskId": "network-operations-capstone",
      "cwd": "/home/runner/work/Network-Systems/Network-Systems/NS-34-applied-studio-17-network-systems-lab-17-supplemental-3/starter",
      "command": [
        "ip",
        "netns",
        "exec",
        "ncap-client",
        "curl",
        "--noproxy",
        "*",
        "-g",
        "--silent",
        "--show-error",
        "--max-time",
        "1",
        "--header",
        "Host: blue.capstone.test",
        "--output",
        "/tmp/owned-capstone-optional-p40yw1ue/identity-starter-default/denied6.body",
        "--write-out",
        "%{http_code}",
        "http://[2001:db8:32::2]:8088/health"
      ],
      "pid": 4157,
      "parentPid": 4051,
      "processGroup": 4051,
      "startTime": "2026-11-15T21:17:26.769921+00:00",
      "endTime": "2026-11-15T21:17:27.777058+00:00",
      "exitCode": 28,
      "timeoutSeconds": 3,
      "childProcessGroupCleanup": "child exited in the supervised lab process group",
      "stdout": "000",
      "stderr": "curl: (28) Connection timed out after 1001 milliseconds\n"
    },
    "status": "000",
    "body": ""
  },
  "directUpstream": {
    "command": {
      "parentTaskId": "network-operations-capstone",
      "cwd": "/home/runner/work/Network-Systems/Network-Systems/NS-34-applied-studio-17-network-systems-lab-17-supplemental-3/starter",
      "command": [
        "ip",
        "netns",
        "exec",
        "ncap-client",
        "curl",
        "--noproxy",
        "*",
        "-g",
        "--silent",
        "--show-error",
        "--max-time",
        "1",
        "--header",
        "Host: blue.capstone.test",
        "--output",
        "/tmp/owned-capstone-optional-p40yw1ue/identity-starter-default/direct-upstream.body",
        "--write-out",
        "%{http_code}",
        "http://[2001:db8:32::2]:9000/health"
      ],
      "pid": 4158,
      "parentPid": 4051,
      "processGroup": 4051,
      "startTime": "2026-11-15T21:17:27.777148+00:00",
      "endTime": "2026-11-15T21:17:28.784409+00:00",
      "exitCode": 28,
      "timeoutSeconds": 3,
      "childProcessGroupCleanup": "child exited in the supervised lab process group",
      "stdout": "000",
      "stderr": "curl: (28) Connection timed out after 1001 milliseconds\n"
    },
    "status": "000",
    "body": ""
  }
}
```

### Bounded packet reading

```json
{
  "packetRead": {
    "parentTaskId": "network-operations-capstone",
    "cwd": "/home/runner/work/Network-Systems/Network-Systems/NS-34-applied-studio-17-network-systems-lab-17-supplemental-3/starter",
    "command": [
      "tcpdump",
      "-n",
      "-r",
      "/tmp/owned-capstone-optional-p40yw1ue/identity-starter-default/capture.pcap"
    ],
    "pid": 4163,
    "parentPid": 4051,
    "processGroup": 4051,
    "startTime": "2026-11-15T21:17:28.808139+00:00",
    "endTime": "2026-11-15T21:17:28.810737+00:00",
    "exitCode": 0,
    "timeoutSeconds": 8,
    "childProcessGroupCleanup": "child exited in the supervised lab process group",
    "stdout": "21:17:25.700236 IP6 2001:db8:31::2.49373 > 2001:db8:32::2.15353: UDP, length 59\n21:17:25.700317 IP6 2001:db8:32::2.15353 > 2001:db8:31::2.49373: UDP, length 63\n21:17:25.716794 IP6 2001:db8:31::2.58516 > 2001:db8:32::2.15353: UDP, length 59\n21:17:25.716850 IP6 2001:db8:32::2.15353 > 2001:db8:31::2.58516: UDP, length 75\n21:17:25.733136 IP 198.18.31.2.57109 > 198.18.32.2.15353: UDP, length 59\n21:17:25.733193 IP 198.18.32.2.15353 > 198.18.31.2.57109: UDP, length 63\n21:17:25.748572 IP 198.18.31.2.46732 > 198.18.32.2.8080: Flags [S], seq 3262306988, win 64240, options [mss 1460,sackOK,TS val 976596638 ecr 0,nop,wscale 10], length 0\n21:17:25.748591 IP 198.18.32.2.8080 > 198.18.31.2.46732: Flags [S.], seq 1415204338, ack 3262306989, win 65160, options [mss 1460,sackOK,TS val 2235589366 ecr 976596638,nop,wscale 10], length 0\n21:17:25.748606 IP 198.18.31.2.46732 > 198.18.32.2.8080: Flags [.], ack 1, win 63, options [nop,nop,TS val 976596638 ecr 2235589366], length 0\n21:17:25.748648 IP 198.18.31.2.46732 > 198.18.32.2.8080: Flags [P.], seq 1:88, ack 1, win 63, options [nop,nop,TS val 976596638 ecr 2235589366], length 87: HTTP: GET /health HTTP/1.1\n21:17:25.748652 IP 198.18.32.2.8080 > 198.18.31.2.46732: Flags [.], ack 88, win 64, options [nop,nop,TS val 2235589366 ecr 976596638], length 0\n21:17:25.749556 IP 198.18.32.2.8080 > 198.18.31.2.46732: Flags [P.], seq 1:188, ack 88, win 64, options [nop,nop,TS val 2235589367 ecr 976596638], length 187: HTTP: HTTP/1.0 200 OK\n21:17:25.749570 IP 198.18.31.2.46732 > 198.18.32.2.8080: Flags [.], ack 188, win 63, options [nop,nop,TS val 976596639 ecr 2235589367], length 0\n21:17:25.749592 IP 198.18.32.2.8080 > 198.18.31.2.46732: Flags [P.], seq 188:275, ack 88, win 64, options [nop,nop,TS val 2235589367 ecr 976596639], length 87: HTTP\n21:17:25.749598 IP 198.18.31.2.46732 > 198.18.32.2.8080: Flags [.], ack 275, win 63, options [nop,nop,TS val 976596639 ecr 2235589367], length 0\n21:17:25.749644 IP 198.18.32.2.8080 > 198.18.31.2.46732: Flags [F.], seq 275, ack 88, win 64, options [nop,nop,TS val 2235589367 ecr 976596639], length 0\n21:17:25.749654 IP 198.18.31.2.46732 > 198.18.32.2.8080: Flags [F.], seq 88, ack 275, win 63, options [nop,nop,TS val 976596639 ecr 2235589367], length 0\n21:17:25.749659 IP 198.18.32.2.8080 > 198.18.31.2.46732: Flags [.], ack 89, win 64, options [nop,nop,TS val 2235589367 ecr 976596639], length 0\n21:17:25.749669 IP 198.18.31.2.46732 > 198.18.32.2.8080: Flags [.], ack 276, win 63, options [nop,nop,TS val 976596639 ecr 2235589367], length 0\n21:17:25.755217 IP6 2001:db8:31::2.35886 > 2001:db8:32::2.8080: Flags [S], seq 719655439, win 64800, options [mss 1440,sackOK,TS val 1458540550 ecr 0,nop,wscale 10], length 0\n21:17:25.755232 IP6 2001:db8:32::2.8080 > 2001:db8:31::2.35886: Flags [S.], seq 2381296643, ack 719655440, win 64260, options [mss 1440,sackOK,TS val 1114029926 ecr 1458540550,nop,wscale 10], length 0\n21:17:25.755243 IP6 2001:db8:31::2.35886 > 2001:db8:32::2.8080: Flags [.], ack 1, win 64, options [nop,nop,TS val 1458540550 ecr 1114029926], length 0\n21:17:25.755284 IP6 2001:db8:31::2.35886 > 2001:db8:32::2.8080: Flags [P.], seq 1:88, ack 1, win 64, options [nop,nop,TS val 1458540550 ecr 1114029926], length 87: HTTP: GET /health HTTP/1.1\n21:17:25.755289 IP6 2001:db8:32::2.8080 > 2001:db8:31::2.35886: Flags [.], ack 88, win 63, options [nop,nop,TS val 1114029926 ecr 1458540550], length 0\n21:17:25.755877 IP6 2001:db8:32::2.8080 > 2001:db8:31::2.35886: Flags [P.], seq 1:188, ack 88, win 63, options [nop,nop,TS val 1114029927 ecr 1458540550], length 187: HTTP: HTTP/1.0 200 OK\n21:17:25.755890 IP6 2001:db8:31::2.35886 > 2001:db8:32::2.8080: Flags [.], ack 188, win 64, options [nop,nop,TS val 1458540551 ecr 1114029927], length 0\n21:17:25.755899 IP6 2001:db8:32::2.8080 > 2001:db8:31::2.35886: Flags [P.], seq 188:275, ack 88, win 63, options [nop,nop,TS val 1114029927 ecr 1458540551], length 87: HTTP\n21:17:25.755905 IP6 2001:db8:31::2.35886 > 2001:db8:32::2.8080: Flags [.], ack 275, win 64, options [nop,nop,TS val 1458540551 ecr 1114029927], length 0\n21:17:25.755918 IP6 2001:db8:32::2.8080 > 2001:db8:31::2.35886: Flags [F.], seq 275, ack 88, win 63, options [nop,nop,TS val 1114029927 ecr 1458540551], length 0\n21:17:25.755942 IP6 2001:db8:31::2.35886 > 2001:db8:32::2.8080: Flags [F.], seq 88, ack 276, win 64, options [nop,nop,TS val 1458540551 ecr 1114029927], length 0\n21:17:25.755948 IP6 2001:db8:32::2.8080 > 2001:db8:31::2.35886: Flags [.], ack 89, win 63, options [nop,nop,TS val 1114029927 ecr 1458540551], length 0\n21:17:25.761464 IP6 2001:db8:31::2.35896 > 2001:db8:32::2.8080: Flags [S], seq 1733170971, win 64800, options [mss 1440,sackOK,TS val 708676864 ecr 0,nop,wscale 10], length 0\n21:17:25.761475 IP6 2001:db8:32::2.8080 > 2001:db8:31::2.35896: Flags [S.], seq 2257953206, ack 1733170972, win 64260, options [mss 1440,sackOK,TS val 2374593703 ecr 708676864,nop,wscale 10], length 0\n21:17:25.761485 IP6 2001:db8:31::2.35896 > 2001:db8:32::2.8080: Flags [.], ack 1, win 64, options [nop,nop,TS val 708676864 ecr 2374593703], length 0\n21:17:25.761524 IP6 2001:db8:31::2.35896 > 2001:db8:32::2.8080: Flags [P.], seq 1:89, ack 1, win 64, options [nop,nop,TS val 708676864 ecr 2374593703], length 88: HTTP: GET /missing HTTP/1.1\n21:17:25.761541 IP6 2001:db8:32::2.8080 > 2001:db8:31::2.35896: Flags [.], ack 89, win 63, options [nop,nop,TS val 2374593704 ecr 708676864], length 0\n21:17:25.762102 IP6 2001:db8:32::2.8080 > 2001:db8:31::2.35896: Flags [P.], seq 1:195, ack 89, win 63, options [nop,nop,TS val 2374593704 ecr 708676864], length 194: HTTP: HTTP/1.0 404 Not Found\n21:17:25.762115 IP6 2001:db8:31::2.35896 > 2001:db8:32::2.8080: Flags [.], ack 195, win 64, options [nop,nop,TS val 708676865 ecr 2374593704], length 0\n21:17:25.762123 IP6 2001:db8:32::2.8080 > 2001:db8:31::2.35896: Flags [P.], seq 195:283, ack 89, win 63, options [nop,nop,TS val 2374593704 ecr 708676865], length 88: HTTP\n21:17:25.762129 IP6 2001:db8:31::2.35896 > 2001:db8:32::2.8080: Flags [.], ack 283, win 64, options [nop,nop,TS val 708676865 ecr 2374593704], length 0\n21:17:25.762141 IP6 2001:db8:32::2.8080 > 2001:db8:31::2.35896: Flags [F.], seq 283, ack 89, win 63, options [nop,nop,TS val 2374593704 ecr 708676865], length 0\n21:17:25.762164 IP6 2001:db8:31::2.35896 > 2001:db8:32::2.8080: Flags [F.], seq 89, ack 284, win 64, options [nop,nop,TS val 708676865 ecr 2374593704], length 0\n21:17:25.762170 IP6 2001:db8:32::2.8080 > 2001:db8:31::2.35896: Flags [.], ack 90, win 63, options [nop,nop,TS val 2374593704 ecr 708676865], length 0\n",
    "stderr": "reading from file /tmp/owned-capstone-optional-p40yw1ue/identity-starter-default/capture.pcap, link-type EN10MB (Ethernet), snapshot length 262144\n"
  }
}
```

### Cleanup

```json
{
  "completed": false,
  "interrupted": false,
  "workers": [
    {
      "parentTaskId": "network-operations-capstone",
      "cwd": "/home/runner/work/Network-Systems/Network-Systems/NS-34-applied-studio-17-network-systems-lab-17-supplemental-3/starter",
      "command": [
        "ip",
        "netns",
        "exec",
        "ncap-server",
        "dnsmasq",
        "--no-daemon",
        "--conf-file=/dev/null",
        "--no-hosts",
        "--no-resolv",
        "--no-poll",
        "--cache-size=0",
        "--user=root",
        "--bind-interfaces",
        "--port=15353",
        "--listen-address=198.18.32.2",
        "--listen-address=2001:db8:32::2",
        "--address=/blue.capstone.test/198.18.32.2",
        "--address=/blue.capstone.test/2001:db8:32::2",
        "--pid-file=/tmp/owned-capstone-optional-p40yw1ue/identity-starter-default/dnsmasq.pid",
        "--log-queries"
      ],
      "pid": 4094,
      "parentPid": 4051,
      "processGroup": 4051,
      "startTime": "2026-11-15T21:17:23.501081+00:00",
      "timeoutSeconds": 35,
      "log": "dns.log",
      "endTime": "2026-11-15T21:17:28.804135+00:00",
      "exitCode": 0,
      "childProcessGroupCleanup": "owned worker reaped in enclosing supervised lab group"
    },
    {
      "parentTaskId": "network-operations-capstone",
      "cwd": "/home/runner/work/Network-Systems/Network-Systems/NS-34-applied-studio-17-network-systems-lab-17-supplemental-3/starter",
      "command": [
        "ip",
        "netns",
        "exec",
        "ncap-server",
        "/usr/bin/python3",
        "/home/runner/work/Network-Systems/Network-Systems/NS-34-applied-studio-17-network-systems-lab-17-supplemental-3/starter/capstone_lab.py",
        "_serve",
        "8080",
        "8088",
        "777138ec000f31ae5fa1"
      ],
      "pid": 4095,
      "parentPid": 4051,
      "processGroup": 4051,
      "startTime": "2026-11-15T21:17:23.501325+00:00",
      "timeoutSeconds": 35,
      "log": "service.log",
      "endTime": "2026-11-15T21:17:28.803039+00:00",
      "exitCode": -15,
      "childProcessGroupCleanup": "owned worker reaped in enclosing supervised lab group"
    },
    {
      "parentTaskId": "network-operations-capstone",
      "cwd": "/home/runner/work/Network-Systems/Network-Systems/NS-34-applied-studio-17-network-systems-lab-17-supplemental-3/starter",
      "command": [
        "ip",
        "netns",
        "exec",
        "ncap-server",
        "tcpdump",
        "-i",
        "s-r",
        "-s",
        "0",
        "-n",
        "-U",
        "-c",
        "160",
        "-w",
        "/tmp/owned-capstone-optional-p40yw1ue/identity-starter-default/capture.pcap",
        "tcp port 8080 or udp port 15353"
      ],
      "pid": 4116,
      "parentPid": 4051,
      "processGroup": 4051,
      "startTime": "2026-11-15T21:17:25.635046+00:00",
      "timeoutSeconds": 35,
      "log": "capture.log",
      "endTime": "2026-11-15T21:17:28.799856+00:00",
      "exitCode": 0,
      "childProcessGroupCleanup": "owned worker reaped in enclosing supervised lab group"
    }
  ],
  "remainingNamespaces": "",
  "allWorkersReaped": true
}
```

The recorded parent comparison reports identical before/after snapshots. The matching canonical snapshot SHA-256 is `72caeafc127fca7e8388fdada26d72fa5aa22ca53f710d731e85b202a1e3e24a`. Compared fields: ipv4Policy, ipv4Routes, ipv6Policy, ipv6Routes, links. This covers those recorded fields; the parent host's unrelated configuration contents are omitted.

Inside-record SHA-256: d06607e4d4a3c2f64b9daabc50f60de327f1e38305c2bf342ce8e9e20f6cb7d0.

