import type { PythonIdeFile } from "@/modules/pythonIde";
import { linuxCourseResource } from "@/modules/linuxProjectResources";

export function linuxBuildInstructions(files: PythonIdeFile[], url?: string) {
	const selected = linuxCourseResource(url ?? "");
	const lines = [
		"Save and download the ZIP, then extract it in an owned Linux lab or WSL distribution.",
		"Confirm the environment with uname -s and id. Run shell and service commands in that Linux terminal.",
		"The browser edits and saves source and provides execution guidance. Provisioning, permissions, Nginx and schedulers require separate observations in the lab."
	];
	if (!selected) {
		return [
			...lines,
			"Read README.md and run bash main.sh from the extracted folder.",
			"The example prints Hello, Linux!; a non-Linux shell returns status 2."
		];
	}
	const script = `${selected.role}/${selected.definition.roleFiles[0]}`;
	if (!files.some(file => file.name === script)) {
		return [
			...lines,
			"The selected lab file is missing. Restore the selected role files and follow README.md."
		];
	}
	const commands: Record<string, string[]> = {
		"LS-05-unit-2-filesystem-hierarchy-and-directory-purpose-supplemental-2":
			[
				"Read ../README.md and complete path-notes.md in an ordinary external Linux terminal with Bash. Predict logical and physical paths and both parents before each run.",
				"Repair the named physical-parent traversal. Decode the NUL-delimited records with the supplied loop, retaining spaces and trailing newlines. Compare direct paths, alternate links and a broken target, then verify recovery.",
				"Use only the private temporary directories from the guide. A link name does not establish containment. A successful observation is not completion of the evidence notes; preserve inputs and remove only the disposable case."
			],
		"LS-06-unit-2-filesystem-hierarchy-and-directory-purpose-supplemental-3":
			[
				"Read ../README.md and complete filesystem-notes.md with task.sh and filesystem_observer.py together. Use an ordinary external Linux account with Python 3.8+, GNU stat/head and util-linux findmnt.",
				"Repair the named content-empty decision using actual successful read bytes. Compare a nonempty ordinary file, an empty file and /proc/uptime using metadata, mounted filesystem, captured bytes and the independent commands from the guide.",
				"Retain the bounded-read, quoted-path, permission failure and corrected-path observations. Restore the temporary file mode and remove only the private case. Metadata and reads are separate snapshots; completed observations do not infer completion of the evidence notes."
			],
		"LS-03-unit-1-shell-foundations-supplemental-2": [
			"Read ../README.md and complete search-notes.md in an ordinary Linux terminal with Bash, GNU grep and GNU sort. Keep every supplied records path exactly, including spaces and the leading dash.",
			"Repair the final status decision after the actual grep -F -l -Z and sort -z -u pipeline. Retain literal match, no-match, missing/unreadable input and newline-filename observations with their actual separate tool statuses.",
			"The binary filename stream uses NUL boundaries; inspect it with the guide's read -d loop. Preserve the supplied files, record a changed literal search and remove only the disposable case. Keep this optional transfer separate from the core."
		],
		"LS-04-unit-1-shell-foundations-supplemental-3": [
			"Read ../README.md and complete pipeline-notes.md with count.awk and the complete records folder preserved. Execute the supplied cat/awk pipeline in an ordinary external Linux terminal.",
			"Observe the starter's misleading success with valid plus missing input. Repair the named condition using both saved PIPESTATUS entries, then compare empty input, changed operand order and quoted paths.",
			"In a disposable copy trigger an actual awk syntax error, retain both original stage statuses, restore exact count.awk bytes and verify recovery. Keep this optional extension separate from the core; a printed summary is not evidence that every input was read."
		],
		"LS-12-unit-12-storage-backups-and-reliability": [
			"Read ../README.md and complete restore-notes.md in an ordinary Debian/Ubuntu Linux terminal. Initialize only a fresh child of the private mktemp parent printed by the guide.",
			"Record actual df/du capacity, logical versus allocated bytes, mount identity and inodes. Create and independently checksum the baseline; compare exclusions, binary content, modes and current ownership after a separate restore.",
			"Change the source and restore both recovery points into different new destinations. Observe reserve rejection and destination/name refusal without replacing earlier evidence. The core notebook continues this saved attempt."
		],
		"LS-25-unit-12-storage-backups-and-reliability-supplemental-2": [
			"Read ../README.md and complete integrity-notes.md in a separate fresh owned lab; retain a verified baseline and trusted checksum record.",
			"Compare the actual successful listing of a flipped payload with its failed integrity check; separately observe a truncated archive and refusal before a restore destination is created.",
			"Create a new verified repaired artifact and compare actual restored bytes, modes and ownership. Preserve good and damaged historical evidence; keep this optional transfer separate from the core."
		],
		"LS-26-unit-12-storage-backups-and-reliability-supplemental-3": [
			"Read ../README.md and complete backup-retention-notes.md in its own fresh lab. Create three versioned backups and review the exact keep-two plan before applying it.",
			"Add a newer alphabetically earlier name, observe stale-plan refusal, review a fresh hash/sequence selection, then confirm exactly the selected old copies were removed and the retained copies are unchanged.",
			"Restore both retained recovery points to new paths and explain which older version is no longer available. Keep source data and outside evidence unchanged; a retention count does not replace restoration or an independently protected copy."
		],
		"LS-11-unit-10-networking-from-a-systems-view": [
			"Read ../README.md and complete network-notes.md in an ordinary Linux terminal. Keep terminal A running bash task.sh serve and record its actual port and PID.",
			"In terminal B, enter read -r -p 'Port from the ready line: ' port, then run bash task.sh inspect --port \"$port\" --report first.json.",
			"Compare real interface, selected route, ICMP, exact listener/PID and HTTP evidence. Retain missing-path, stopped and restored cases, a changed prediction and owned cleanup. A saved report does not complete the worksheet; the core notebook continues this attempt."
		],
		"LS-21-unit-10-networking-from-a-systems-view-supplemental-2": [
			"Read ../README.md and complete listener-notes.md using two foreground terminals and each server's actual ready port.",
			"Compare a 127.0.0.2 bind with a 127.0.0.1 request, then a matching destination. Separately observe ready 200, missing path 404, unavailable 503 and recovery.",
			"Read curl status, HTTP status/body and exact socket/PID separately. Keep this optional transfer as its own attempt, preserve each report and stop only the owned foreground server."
		],
		"LS-22-unit-10-networking-from-a-systems-view-supplemental-3": [
			"Read ../README.md and complete resolver-notes.md. Terminal A runs bash task.sh serve; terminal B runs bash task.sh dns --answer ready. Keep both running and record their actual separate ports/PIDs.",
			'In terminal C enter HTTP and DNS ports, then run bash task.sh inspect --dns-port "$dns_port" --http-port "$http_port" --report ready.json. Use the guide\'s explicit dig server/port query for comparison.',
			"Compare ready, wrong and missing DNS answers plus restored state and owned TCP/UDP cleanup. An explicit curl --resolve address bypass tests the app; it does not repair the system resolver. Retain all report bytes and keep this optional extension separate from the core."
		],
		"LS-10-unit-9-package-management-and-software-layout": [
			"Read ../README.md and complete package-notes.md in an ordinary Debian/Ubuntu Linux terminal.",
			"bash task.sh --package bash --command bash --report bash-first.json",
			"Compare actual package metadata, current state versus requested action, file layout and command ownership. Retain a changed package, missing-query failures and preserved report bytes; the core notebook continues this same attempt."
		],
		"LS-19-unit-9-package-management-and-software-layout-supplemental-2": [
			"Read ../README.md and complete manual-notes.md; use a fresh owned lab with the supplied working C source and drivers.",
			"Follow the guide for actual C17 builds, exact archives, owned release installation, real package-ownership queries, version 1.0/2.0 selection and runtime-verified rollback.",
			"Record duplicate/changed archive failures, active-link and byte checks, bounded removal and the unchanged outside sentinel. Keep this optional transfer separate from the core."
		],
		"LS-20-unit-9-package-management-and-software-layout-supplemental-3": [
			"Read ../README.md and complete dependency-notes.md in a separate owned Debian package root; use the supplied driver without sudo.",
			"Observe real missing/wrong-version dependency failures, unpacked versus configured state, runtime success before configuration, upgrade/recovery and dependent-removal rejection.",
			"Read requested action, error flag and current state separately. Retain actual query, audit, runtime and reverse-order removal evidence plus a changed base-first sequence. Keep this optional extension separate from the core."
		],
		"LS-08-unit-5-processes-and-job-control": [
			"Read ../README.md for real process identities, owned signals, waiting and interactive Bash job control.",
			"Complete process-notes.md using the supplied working process_worker.py; both roles provide equipment, not completed observation records.",
			"Use an actual Linux terminal. Follow the full guide for Ctrl+Z/bg/fg/Ctrl+C, actual wait statuses, changed lifetimes, rejected arguments and owned cleanup. The troubleshooting notebook continues this same attempt."
		],
		"LS-11-unit-5-processes-and-job-control-supplemental-2": [
			"Read ../README.md and use a fresh interactive Bash terminal with monitor mode and an empty job table.",
			"Complete pipeline-notes.md using produce and consume modes of pipeline_worker.py; keep this optional transfer separate from the core attempt.",
			"Observe both actual PIDs and their shared process group, group STOP/CONT/INT, resumed data, immediate PIPESTATUS with and without pipefail, the early reader's SIGPIPE and complete owned-job cleanup."
		],
		"LS-12-unit-5-processes-and-job-control-supplemental-3": [
			"Read ../README.md for Linux /proc, the per-process child-subreaper flag, two-terminal observations and explicit record paths.",
			"Complete adoption-notes.md using the supplied working adoption_lab.py and a fresh evidence filename; earlier records are not overwritten.",
			"Observe the actual zombie before wait, the original parent handshake, the same live child's new PPID, internal wait results and overall status, changed timing, separate interruption and owned cleanup. Keep this optional extension separate from the core attempt."
		],
		"LS-09-unit-7-logging-and-observability": [
			"Read ../README.md for the journal fields, scalar JSON records, prediction and owned user-manager setup.",
			"Complete in_scope in task.sh, then run bash task.sh sample.log linux-observe-demo.service aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa 100 500.",
			"Observe the actual missing/invalid configuration exit, journal UID/PID/boot/priority, later invocation recovery, current oneshot state and cleanup. Record incident-notes.md separately from a printed prediction."
		],
		"LS-15-unit-7-logging-and-observability-supplemental-2": [
			"Read ../README.md and complete is_server_failure in task.sh using completion events and numeric HTTP status.",
			"bash task.sh sample.log case-7",
			"Predict request scoping, 503 then 200, incomplete retries, client responses, timezone offsets and malformed-input failures. Record application-notes.md; redacted records do not prove current live health."
		],
		"LS-16-unit-7-logging-and-observability-supplemental-3": [
			"Read ../README.md for the private marker-protected disposable directory and actual logrotate prerequisite.",
			'Complete the two-archive policy in logrotate.conf before running bash task.sh "$lab".',
			"Observe compressed contents, expiration, private active-file creation, empty-run and debug behavior, unchanged external sentinel and cleanup. Record retention-notes.md; manual rotations do not prove scheduling."
		],
		"LS-13-unit-6-services-and-systemd-supplemental-2": [
			"Read ../README.md for the guarded owned user-unit installation and supplied HTTP app.",
			"Complete the named WorkingDirectory and ExecStart app-argument tasks in linux-service-transfer.service. Observe 200/CHDIR and Python exit 2 separately before correcting both paths.",
			"Observe real user-manager state, app PID/UID, an owned 127.0.0.1 socket and GET/HEAD readiness; record restarts, directory-fault recovery, enablement versus running and cleanup."
		],
		"LS-14-unit-6-services-and-systemd-supplemental-3": [
			"Read ../README.md for the guarded owned base-unit and drop-in installation.",
			"Complete the EnvironmentFile reset and replacement in 20-lab-settings.conf; Environment assignments alone do not override file values.",
			"Observe actual process environment and fresh journal rows, file edits before and after restart, invalid settings, recovery, unchanged base unit and drop-in removal restoring base settings."
		],
		"LS5-Systemd-Toy-Service": [
			"HEARTBEAT_INTERVAL=0.1 HEARTBEAT_MESSAGE=sample HEARTBEAT_LIMIT=2 python3 heartbeat_app.py",
			"The untouched learner exits 78 until render_heartbeat is complete; invalid settings exit 2 before a heartbeat.",
			"Read ../README.md for the real user-manager prerequisite and unique owned installation. The service requires its installed heartbeat.env; its template uses the actual user home and identity.",
			"Observe actual service state, MainPID/UID and journal rows, enablement separately from running, manual and unexpected-failure restarts, invalid settings, recovery and complete cleanup.",
			"Complete service-notes.md with observed evidence. A direct app run or parsed unit does not establish manager operation."
		],
		"LS4-Apache-Virtual-Host-Compare": [
			"Read ../README.md for the owned-prefix setup and explicit Apache environment values before starting either server.",
			'apache2 -f "$lab_root/apache.conf" -t',
			'nginx -p "$lab_root/" -c nginx.conf -t',
			"The untouched learner Apache primary host returns 404 for /index.html until its DocumentRoot task is complete; the supplied Nginx comparison and second host already serve their pages.",
			"Compare exact bytes, Host routing, HEAD, missing files, real loopback sockets/PIDs, rejected configuration, graceful reload, restored roots and cleanup. Complete compare-notes.md with actual observations."
		],
		"LS3-Nginx-Reverse-Proxy-App": [
			"APP_PORT=8081 python3 app.py",
			"Keep the app in its terminal; use a second terminal for direct health and inspection requests before starting the owned Nginx prefix from README.md.",
			"curl -i http://127.0.0.1:8081/health",
			"curl -i 'http://127.0.0.1:8081/inspect?mode=read&mode=write&blank='",
			"The untouched starter returns JSON 501 for inspection until its named function is completed. The reference reports the actual path, query, peer and received headers.",
			"Follow README.md for the separate loopback proxy, header comparisons, socket/PID evidence, app-down 502, restored 200 and undo. A parsed user unit is not evidence that a service manager operated it."
		],
		"LS1-Personal-Lab-VM": [
			"bash lab_bootstrap_report.sh",
			"Record the actual distribution, identity, workspace, missing tools and snapshot/reset route. This report does not provision a VM."
		],
		"LS-05-unit-1-shell-foundations": [
			"bash task.sh",
			"The supplied reference prints files=3 errors=3 warnings=2. Complete the starter's warning-count TODO and test empty, changed and missing input. Preserve reports/app 1.log and reports/empty.log."
		],
		"LS-06-unit-3-users-groups-and-permissions": [
			"lab_root=$(mktemp -d)",
			'bash task.sh setup "$lab_root"',
			'bash task.sh inspect "$lab_root"',
			'bash task.sh fix "$lab_root"',
			'bash task.sh verify "$lab_root"',
			"Use an unprivileged account. The starter fix is unfinished. Record parent traversal, unchanged file mode and the undo in permissions.md."
		],
		"LS2-Static-Site-from-srv": [
			"lab_root=$(mktemp -d)",
			'bash deploy_static_site.sh "$lab_root/public"',
			'cmp index.html "$lab_root/public/index.html"',
			"Complete the starter install TODO. Follow README.md for the owned VM Nginx route, loopback serving, unknown-path 404 and restoration. Copying the page does not prove serving."
		],
		"LS6-Backup-Cron-and-Timer": [
			"Follow the README's fabricated source and separate backup-directory setup before running backup_home.sh with both explicit arguments.",
			"Complete the starter retention TODO; verify retention and restore exact bytes. The supplied service and timer are user units. Record actual scheduled output, identity and undo separately."
		],
		"LS-07-unit-4-editing-and-configuration": [
			"Read ../README.md for the owned lab, complete two-terminal workflow, JSON rules and the named validated apply step.",
			"lab=$(mktemp -d)",
			'bash task.sh init "$lab"',
			'python3 config_app.py run "$lab/config.json"',
			"Use only this lab process's reported PID. Observe unchanged cached output before HUP, accepted reload, rejected candidate and reload, exact backup/rollback and clean shutdown. Record edit-notes.md."
		],
		"LS-09-unit-4-editing-and-configuration-supplemental-2": [
			"Read ../README.md for trusted Bash assignment syntax and the distinction between source and export. Complete the named MESSAGE and REPEAT export step.",
			"lab=$(mktemp -d)",
			'cp -- settings.env "$lab/settings.env"',
			'bash task.sh "$lab/settings.env" --watch',
			"Observe actual child PID/UID and environment, file edits before and after restart, explicit message overrides, quoted values, syntax versus value failures, unchanged parent state and cleanup. Record environment-notes.md."
		],
		"LS-10-unit-4-editing-and-configuration-supplemental-3": [
			"Read ../README.md for the explicit two-file lab and literal key/value format. Complete only the anchored timeout replacement.",
			"lab=$(mktemp -d)",
			'bash task.sh init "$lab"',
			'bash task.sh preview "$lab" 25',
			'bash task.sh apply "$lab" 25',
			"Set backup to the exact backup= path printed by apply before running rollback; the full reading shows the comparisons to make first.",
			'bash task.sh rollback "$lab" "$backup"',
			"Verify exact preview/backup bytes, modes, unchanged comments and unrelated numbers, invalid batches, a failed second rename and explicit recovery of both files. Per-file renames do not make the pair atomic. Record replacement-notes.md."
		]
	};
	return [
		...lines,
		`From the extracted folder: cd ${selected.role}`,
		...commands[selected.pack]!,
		"Read ../README.md for the complete prediction, run, changed-case and completion record. Compare the reference after an independent attempt."
	];
}
