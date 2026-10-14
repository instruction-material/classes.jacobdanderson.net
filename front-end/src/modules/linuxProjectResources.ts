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
