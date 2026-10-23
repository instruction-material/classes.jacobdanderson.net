// Keep this policy in parity with back-end/src/utils/swiftProjectFiles.ts.
export function isSwiftProjectTextPath(value: string) {
	return (
		value === "verify-networking.py" ||
		/\.(?:swift|md|json|plist|txt)$/i.test(value)
	);
}
