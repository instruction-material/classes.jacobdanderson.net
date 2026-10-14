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
			"The selected lab script is missing. Restore the selected role files and follow README.md."
		];
	}
	const commands: Record<string, string[]> = {
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
