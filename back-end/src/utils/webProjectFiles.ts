// Keep this policy in parity with front-end/src/modules/webProjectFiles.ts.
export function isWebProjectTextPath(value: string) {
	return /\.(?:html?|css|[cm]?js|json|md|txt)$/i.test(value);
}

export function isWebProjectSourcePath(value: string) {
	return /\.(?:html?|[cm]?js)$/i.test(value);
}
