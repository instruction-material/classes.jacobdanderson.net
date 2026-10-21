// Keep this policy in parity with front-end/src/modules/rustProjectFiles.ts.
export function isRustProjectTextPath(value: string) {
	return (
		/\.rs$/i.test(value)
		|| /^(?:(?:starter|solution)\/)?fixtures\/[\w-]{1,28}\.txt$/.test(value)
		|| /(?:^|\/)Cargo\.(?:toml|lock)$/.test(value)
		|| /^(?:(?:starter|solution)\/)?observations\.md$/.test(value)
	);
}
