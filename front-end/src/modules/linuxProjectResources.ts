import { githubRawUrl, parseGitHubResource } from "./codePreview";

export const linuxSourceRevision = "23771d6b5caee2190963b8e730c271544963045d";
export const linuxVerifiedPacks = [
	{
		revision: linuxSourceRevision,
		pack: "LS1-Personal-Lab-VM",
		roleFiles: ["lab_bootstrap_report.sh"],
		coreItemId:
			"linux-systems-ls0-setup-and-tooling-curriculum-project-provision-a-personal-linux-lab-vm",
		notebookItemId:
			"linux-systems-ls0-setup-and-tooling-supplemental-troubleshooting-notebook-setup-and-tooling"
	},
	{
		revision: linuxSourceRevision,
		pack: "LS-05-unit-1-shell-foundations",
		roleFiles: [
			"task.sh",
			"reports/app 1.log",
			"reports/app-2.log",
			"reports/empty.log",
			"reports/notes.txt"
		],
		coreItemId:
			"linux-systems-unit-1-shell-foundations-curriculum-core-project-shell-foundations",
		notebookItemId:
			"linux-systems-unit-1-shell-foundations-supplemental-troubleshooting-notebook-shell-foundations"
	},
	{
		revision: linuxSourceRevision,
		pack: "LS2-Static-Site-from-srv",
		roleFiles: [
			"deploy_static_site.sh",
			"index.html",
			"linux-systems.conf"
		],
		coreItemId:
			"linux-systems-unit-2-filesystem-hierarchy-and-directory-purpose-curriculum-project-deploy-a-static-site-from-srv",
		notebookItemId:
			"linux-systems-unit-2-filesystem-hierarchy-and-directory-purpose-supplemental-troubleshooting-notebook-filesystem-hierarchy-and-directory-purpose"
	},
	{
		revision: linuxSourceRevision,
		pack: "LS-06-unit-3-users-groups-and-permissions",
		roleFiles: ["task.sh", "permissions.md"],
		coreItemId:
			"linux-systems-unit-3-users-groups-and-permissions-curriculum-core-project-users-groups-and-permissions",
		notebookItemId:
			"linux-systems-unit-3-users-groups-and-permissions-supplemental-troubleshooting-notebook-users-groups-and-permissions"
	},
	{
		revision: linuxSourceRevision,
		pack: "LS6-Backup-Cron-and-Timer",
		roleFiles: [
			"backup_home.sh",
			"linux-backup.service",
			"linux-backup.timer",
			"crontab.example"
		],
		coreItemId:
			"linux-systems-unit-8-scheduling-and-automation-curriculum-project-write-a-backup-script-and-schedule-it-with-cron-and-a-timer",
		notebookItemId:
			"linux-systems-unit-8-scheduling-and-automation-supplemental-troubleshooting-notebook-scheduling-and-automation"
	},
	{
		pack: "LS3-Nginx-Reverse-Proxy-App",
		revision: "adc97e7dd268b00afedda3b6ae40032ef29cb723",
		roleFiles: ["app.py", "linux-toy-app.conf", "linux-toy-app.service"],
		coreItemId:
			"linux-systems-unit-11-web-servers-curriculum-project-run-a-small-app-behind-nginx",
		notebookItemId:
			"linux-systems-unit-11-web-servers-supplemental-troubleshooting-notebook-web-servers"
	},
	{
		pack: "LS4-Apache-Virtual-Host-Compare",
		revision: "237c62880e9c96f759a04fa5f171c03797e7453d",
		roleFiles: [
			"linux-systems-apache.conf",
			"linux-systems-nginx.conf",
			"index.html",
			"second.html",
			"compare-notes.md"
		],
		coreItemId:
			"linux-systems-unit-11-web-servers-curriculum-project-configure-an-apache-virtual-host-and-compare-it-to-nginx",
		notebookItemId: null
	},
	{
		pack: "LS5-Systemd-Toy-Service",
		revision: "80d1edc95b7152c55e2c000adda086c9cbadf545",
		roleFiles: [
			"heartbeat_app.py",
			"linux-heartbeat.service",
			"heartbeat.env.example",
			"service-notes.md"
		],
		coreItemId:
			"linux-systems-unit-6-services-and-systemd-curriculum-project-create-a-systemd-service-for-a-toy-app",
		notebookItemId:
			"linux-systems-unit-6-services-and-systemd-supplemental-troubleshooting-notebook-services-and-systemd"
	},
	{
		pack: "LS-13-unit-6-services-and-systemd-supplemental-2",
		revision: "80d1edc95b7152c55e2c000adda086c9cbadf545",
		roleFiles: [
			"linux-service-transfer.service",
			"transfer_app.py",
			"transfer.env.example",
			"service-transfer-notes.md"
		],
		coreItemId:
			"linux-systems-unit-6-services-and-systemd-supplemental-systemd-service-transfer-practice",
		notebookItemId: null
	},
	{
		pack: "LS-14-unit-6-services-and-systemd-supplemental-3",
		revision: "80d1edc95b7152c55e2c000adda086c9cbadf545",
		roleFiles: [
			"20-lab-settings.conf",
			"heartbeat_app.py",
			"linux-service-extension.service",
			"base.env.example",
			"override.env.example",
			"service-extension-notes.md"
		],
		coreItemId:
			"linux-systems-unit-6-services-and-systemd-supplemental-systemd-service-extension-practice",
		notebookItemId: null
	},
	{
		pack: "LS-09-unit-7-logging-and-observability",
		revision: "bbb586068e7cdfb6260153f33a01b7d1d0260941",
		roleFiles: [
			"task.sh",
			"incident_app.sh",
			"linux-logging-case.service",
			"sample.log",
			"incident-notes.md"
		],
		coreItemId:
			"linux-systems-unit-7-logging-and-observability-curriculum-core-project-logging-and-observability",
		notebookItemId:
			"linux-systems-unit-7-logging-and-observability-supplemental-troubleshooting-notebook-logging-and-observability"
	},
	{
		pack: "LS-15-unit-7-logging-and-observability-supplemental-2",
		revision: "bbb586068e7cdfb6260153f33a01b7d1d0260941",
		roleFiles: ["task.sh", "sample.log", "application-notes.md"],
		coreItemId:
			"linux-systems-unit-7-logging-and-observability-supplemental-log-investigation-transfer-practice",
		notebookItemId: null
	},
	{
		pack: "LS-16-unit-7-logging-and-observability-supplemental-3",
		revision: "bbb586068e7cdfb6260153f33a01b7d1d0260941",
		roleFiles: ["logrotate.conf", "task.sh", "retention-notes.md"],
		coreItemId:
			"linux-systems-unit-7-logging-and-observability-supplemental-log-investigation-extension-practice",
		notebookItemId: null
	},
	{
		pack: "LS-07-unit-4-editing-and-configuration",
		revision: "237c62880e9c96f759a04fa5f171c03797e7453d",
		roleFiles: [
			"task.sh",
			"config_app.py",
			"config.json",
			"candidate.json",
			"edit-notes.md"
		],
		coreItemId:
			"linux-systems-unit-4-editing-and-configuration-curriculum-core-project-editing-and-configuration",
		notebookItemId:
			"linux-systems-unit-4-editing-and-configuration-supplemental-troubleshooting-notebook-editing-and-configuration"
	},
	{
		pack: "LS-09-unit-4-editing-and-configuration-supplemental-2",
		revision: "237c62880e9c96f759a04fa5f171c03797e7453d",
		roleFiles: [
			"task.sh",
			"environment_app.py",
			"settings.env",
			"environment-notes.md"
		],
		coreItemId:
			"linux-systems-unit-4-editing-and-configuration-supplemental-configuration-editing-transfer-practice",
		notebookItemId: null
	},
	{
		pack: "LS-10-unit-4-editing-and-configuration-supplemental-3",
		revision: "237c62880e9c96f759a04fa5f171c03797e7453d",
		roleFiles: [
			"task.sh",
			"validate_config.py",
			"primary.conf",
			"secondary.conf",
			"replacement-notes.md"
		],
		coreItemId:
			"linux-systems-unit-4-editing-and-configuration-supplemental-configuration-editing-extension-practice",
		notebookItemId: null
	},
	{
		pack: "LS-08-unit-5-processes-and-job-control",
		revision: "e0435ba87eaab0cee4d3d9d48071cb5e555dfb90",
		roleFiles: ["process-notes.md", "process_worker.py"],
		coreItemId:
			"linux-systems-unit-5-processes-and-job-control-curriculum-core-project-processes-and-job-control",
		notebookItemId:
			"linux-systems-unit-5-processes-and-job-control-supplemental-troubleshooting-notebook-processes-and-job-control"
	},
	{
		pack: "LS-11-unit-5-processes-and-job-control-supplemental-2",
		revision: "f52d55e992742d51ee034a4489cf5982f6031652",
		roleFiles: ["pipeline-notes.md", "pipeline_worker.py"],
		coreItemId:
			"linux-systems-unit-5-processes-and-job-control-supplemental-process-control-transfer-practice",
		notebookItemId: null
	},
	{
		pack: "LS-12-unit-5-processes-and-job-control-supplemental-3",
		revision: "f52d55e992742d51ee034a4489cf5982f6031652",
		roleFiles: ["adoption-notes.md", "adoption_lab.py"],
		coreItemId:
			"linux-systems-unit-5-processes-and-job-control-supplemental-process-control-extension-practice",
		notebookItemId: null
	},
	{
		pack: "LS-10-unit-9-package-management-and-software-layout",
		revision: "6b0dde464ac98599e98b28c0af29fc9fee9e66dd",
		roleFiles: ["package-notes.md", "task.sh", "package_report.py"],
		coreItemId:
			"linux-systems-unit-9-package-management-and-software-layout-curriculum-core-project-package-management-and-software-layout",
		notebookItemId:
			"linux-systems-unit-9-package-management-and-software-layout-supplemental-troubleshooting-notebook-package-management-and-software-layout"
	},
	{
		pack: "LS-19-unit-9-package-management-and-software-layout-supplemental-2",
		revision: "6b0dde464ac98599e98b28c0af29fc9fee9e66dd",
		roleFiles: [
			"manual-notes.md",
			"task.sh",
			"manual_layout.py",
			"owned_lab.py",
			"layout_demo.c"
		],
		coreItemId:
			"linux-systems-unit-9-package-management-and-software-layout-supplemental-package-layout-transfer-practice",
		notebookItemId: null
	},
	{
		pack: "LS-20-unit-9-package-management-and-software-layout-supplemental-3",
		revision: "6b0dde464ac98599e98b28c0af29fc9fee9e66dd",
		roleFiles: [
			"dependency-notes.md",
			"task.sh",
			"dependency_lab.py",
			"owned_lab.py"
		],
		coreItemId:
			"linux-systems-unit-9-package-management-and-software-layout-supplemental-package-layout-extension-practice",
		notebookItemId: null
	},
	{
		pack: "LS-11-unit-10-networking-from-a-systems-view",
		revision: "a1405c46ae27a23358a735c60e483b7d6b237e49",
		roleFiles: [
			"network-notes.md",
			"task.sh",
			"network_lab.py",
			"network_tools.py"
		],
		coreItemId:
			"linux-systems-unit-10-networking-from-a-systems-view-curriculum-core-project-networking-from-a-systems-view",
		notebookItemId:
			"linux-systems-unit-10-networking-from-a-systems-view-supplemental-troubleshooting-notebook-networking-from-a-systems-view"
	},
	{
		pack: "LS-21-unit-10-networking-from-a-systems-view-supplemental-2",
		revision: "a1405c46ae27a23358a735c60e483b7d6b237e49",
		roleFiles: [
			"listener-notes.md",
			"task.sh",
			"network_lab.py",
			"network_tools.py"
		],
		coreItemId:
			"linux-systems-unit-10-networking-from-a-systems-view-supplemental-network-diagnostics-transfer-practice",
		notebookItemId: null
	},
	{
		pack: "LS-22-unit-10-networking-from-a-systems-view-supplemental-3",
		revision: "a1405c46ae27a23358a735c60e483b7d6b237e49",
		roleFiles: [
			"resolver-notes.md",
			"task.sh",
			"network_lab.py",
			"network_tools.py"
		],
		coreItemId:
			"linux-systems-unit-10-networking-from-a-systems-view-supplemental-network-diagnostics-extension-practice",
		notebookItemId: null
	},
	{
		pack: "LS-12-unit-12-storage-backups-and-reliability",
		revision: "9c7902a4b13005fd1a5184db09b9a496a1c5fe10",
		roleFiles: [
			"restore-notes.md",
			"task.sh",
			"storage_lab.py",
			"storage_tools.py"
		],
		coreItemId:
			"linux-systems-unit-12-storage-backups-and-reliability-curriculum-core-project-storage-backups-and-reliability",
		notebookItemId:
			"linux-systems-unit-12-storage-backups-and-reliability-supplemental-troubleshooting-notebook-storage-backups-and-reliability"
	},
	{
		pack: "LS-25-unit-12-storage-backups-and-reliability-supplemental-2",
		revision: "9c7902a4b13005fd1a5184db09b9a496a1c5fe10",
		roleFiles: [
			"integrity-notes.md",
			"task.sh",
			"storage_lab.py",
			"storage_tools.py"
		],
		coreItemId:
			"linux-systems-unit-12-storage-backups-and-reliability-supplemental-backup-reliability-transfer-practice",
		notebookItemId: null
	},
	{
		pack: "LS-26-unit-12-storage-backups-and-reliability-supplemental-3",
		revision: "9c7902a4b13005fd1a5184db09b9a496a1c5fe10",
		roleFiles: [
			"backup-retention-notes.md",
			"task.sh",
			"storage_lab.py",
			"storage_tools.py"
		],
		coreItemId:
			"linux-systems-unit-12-storage-backups-and-reliability-supplemental-backup-reliability-extension-practice",
		notebookItemId: null
	},
	{
		pack: "LS-03-unit-1-shell-foundations-supplemental-2",
		roleFiles: [
			"search-notes.md",
			"task.sh",
			"records/alpha.txt",
			"records/with space.txt",
			"records/-dash.txt"
		],
		coreItemId:
			"linux-systems-unit-1-shell-foundations-supplemental-shell-pipeline-transfer-practice",
		notebookItemId: null,
		revision: "d96bf056157ed05c95cfe2ef5c2bee66501c7f17"
	},
	{
		pack: "LS-04-unit-1-shell-foundations-supplemental-3",
		roleFiles: [
			"pipeline-notes.md",
			"task.sh",
			"count.awk",
			"records/alpha.txt",
			"records/with space.txt",
			"records/-dash.txt"
		],
		coreItemId:
			"linux-systems-unit-1-shell-foundations-supplemental-shell-pipeline-extension-practice",
		notebookItemId: null,
		revision: "d96bf056157ed05c95cfe2ef5c2bee66501c7f17"
	},
	{
		pack: "LS-05-unit-2-filesystem-hierarchy-and-directory-purpose-supplemental-2",
		roleFiles: ["path-notes.md", "task.sh"],
		coreItemId:
			"linux-systems-unit-2-filesystem-hierarchy-and-directory-purpose-supplemental-filesystem-layout-transfer-practice",
		notebookItemId: null,
		revision: "0f7955eba8c8cf27312a980b722f116ab5bf0611"
	},
	{
		pack: "LS-06-unit-2-filesystem-hierarchy-and-directory-purpose-supplemental-3",
		roleFiles: ["filesystem-notes.md", "task.sh", "filesystem_observer.py"],
		coreItemId:
			"linux-systems-unit-2-filesystem-hierarchy-and-directory-purpose-supplemental-filesystem-layout-extension-practice",
		notebookItemId: null,
		revision: "0f7955eba8c8cf27312a980b722f116ab5bf0611"
	},
	{
		pack: "LS-07-unit-3-users-groups-and-permissions-supplemental-2",
		roleFiles: ["unlink-notes.md", "task.sh", "permission_observer.py"],
		coreItemId:
			"linux-systems-unit-3-users-groups-and-permissions-supplemental-permissions-transfer-practice",
		notebookItemId: null,
		revision: "de4ff7b50cd6daaa00e60b1ced3b9f43968e57d2"
	},
	{
		pack: "LS-08-unit-3-users-groups-and-permissions-supplemental-3",
		roleFiles: ["umask-notes.md", "task.sh", "creation_observer.py"],
		coreItemId:
			"linux-systems-unit-3-users-groups-and-permissions-supplemental-permissions-extension-practice",
		notebookItemId: null,
		revision: "de4ff7b50cd6daaa00e60b1ced3b9f43968e57d2"
	}
] as const;

export function linuxCourseResource(url: string) {
	const resource = parseGitHubResource(url);
	if (
		!resource ||
		resource.owner.toLowerCase() !== "instruction-material" ||
		resource.repo.toLowerCase() !== "linux-systems"
	) {
		return null;
	}
	const [pack, role, ...rest] = resource.path.split("/");
	const definition = linuxVerifiedPacks.find(p => p.pack === pack);
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

export function linuxPinnedCourseUrl(url: string) {
	const resource = parseGitHubResource(url);
	if (
		!resource ||
		resource.owner.toLowerCase() !== "instruction-material" ||
		resource.repo.toLowerCase() !== "linux-systems"
	) {
		return url;
	}
	const [pack, role, ...rest] = resource.path.split("/");
	const definition = linuxVerifiedPacks.find(p => p.pack === pack);
	if (
		!definition ||
		rest.length ||
		(role !== "starter" && role !== "solution") ||
		(resource.ref !== "main" && resource.ref !== definition.revision)
	) {
		return url;
	}
	return `https://github.com/instruction-material/Linux-Systems/tree/${definition.revision}/${pack}/${role}`;
}

export function linuxCourseProjectKey(
	courseID: string,
	itemID: string,
	role: "starter" | "reference",
	url: string
) {
	const selected =
		courseID === "linux-systems" ? linuxCourseResource(url) : null;
	if (!selected) return `${courseID}:${itemID}:${role}`;
	const sharedItemID =
		itemID === selected.definition.notebookItemId
			? selected.definition.coreItemId
			: itemID;
	return `${courseID}:${sharedItemID}:${role}:native-linux`;
}

export function linuxImportFiles(url: string) {
	const selected = linuxCourseResource(url);
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
