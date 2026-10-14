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
		]
	};
	return [
		...lines,
		`From the extracted folder: cd ${selected.role}`,
		...commands[selected.pack]!,
		"Read ../README.md for the complete prediction, run, changed-case and completion record. Compare the reference after an independent attempt."
	];
}
