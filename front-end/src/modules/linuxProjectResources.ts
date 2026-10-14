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
