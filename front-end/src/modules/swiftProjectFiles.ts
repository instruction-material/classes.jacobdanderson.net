// Keep this policy in parity with back-end/src/utils/swiftProjectFiles.ts.
export function isSwiftProjectTextPath(value: string) {
	return (
		/^(?:starter|solution)\/(FirstLaunch|FavoriteNote|HobbyMap|TaskReview)\.xcodeproj\/(?:project\.pbxproj|xcshareddata\/xcschemes\/\1\.xcscheme)$/u.test(
			value
		) ||
		[
			"verify-networking.py",
			"verify-tracker.py",
			"verify-persistence.py"
		].includes(value) ||
		/\.(?:swift|md|json|plist|txt)$/i.test(value)
	);
}
