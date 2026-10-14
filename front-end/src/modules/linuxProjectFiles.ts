// Keep this policy in parity with back-end/src/utils/linuxProjectFiles.ts.
export const linuxFileSegmentPattern = /^\w(?:[\w .-]*[\w.-])?$/;

export function isLinuxProjectTextPath(value: string) {
	return (
		/\.(?:sh|log|conf|service|timer|html)$/i.test(value) ||
		value.split("/").at(-1) === "crontab.example" ||
		/^(?:starter|solution)\/(?:permissions|compare-notes)\.md$/.test(
			value
		) ||
		/^(?:starter|solution)\/reports\/[^/]+\.txt$/.test(value)
	);
}
