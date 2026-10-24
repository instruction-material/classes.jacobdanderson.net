// Keep this policy in parity with front-end/src/modules/swiftProjectFiles.ts.
export function isSwiftProjectTextPath(value: string) {
	return (
		["verify-networking.py", "verify-tracker.py", "verify-persistence.py"].includes(value)
		|| /\.(?:swift|md|json|plist|txt)$/i.test(value)
	);
}
