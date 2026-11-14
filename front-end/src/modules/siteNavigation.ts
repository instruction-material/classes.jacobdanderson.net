export const classMeetingUrl = "/zoom";
export const siteLabels = {
	courses: "Courses",
	ide: "IDE",
	graphing: "Graphing",
	booking: "Schedule Class",
	join: "Join class",
	account: "Account"
} as const;
export const workspacePaths = [
	"/ide",
	"/graph-sketcher",
	"/courses",
	"/teaching",
	"/admin",
	"/profile"
];
export function isWorkspacePath(path: string) {
	return workspacePaths.some(
		base => path === base || path.startsWith(`${base}/`)
	);
}
