// Keep this policy in parity with back-end/src/utils/linuxProjectFiles.ts.
export const linuxFileSegmentPattern = /^\w(?:[\w .-]*[\w.-])?$/;

export function isLinuxProjectTextPath(value: string) {
	return (
		/^(?:starter|solution)\/(?:config|candidate)\.json$/.test(value) ||
		/^(?:starter|solution)\/settings\.env$/.test(value) ||
		/^(?:starter|solution)\/(?:heartbeat|transfer|base|override)\.env\.example$/.test(
			value
		) ||
		/\.(?:sh|log|conf|service|timer|html)$/i.test(value) ||
		value.split("/").at(-1) === "crontab.example" ||
		/^(?:starter|solution)\/(?:permissions|compare-notes|service-notes|service-transfer-notes|service-extension-notes|incident-notes|application-notes|retention-notes|edit-notes|environment-notes|replacement-notes|process-notes|pipeline-notes|adoption-notes|package-notes|manual-notes|dependency-notes)\.md$/.test(
			value
		) ||
		/^(?:starter|solution)\/reports\/[^/]+\.txt$/.test(value)
	);
}
