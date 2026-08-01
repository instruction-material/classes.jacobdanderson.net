export const FRIENDLY_NOT_FOUND_ROUTE = "/404";
export const FRIENDLY_NOT_FOUND_TITLE = "Page not found | Classes";

const titlePattern = /<title\b[^>]*>[\s\S]*?<\/title>/iu;
const robotsMetaPattern = /<meta\b[^>]*\bname=["']robots["'][^>]*>/iu;

function replaceOrInsertHeadElement(
	html: string,
	pattern: RegExp,
	replacement: string
) {
	if (pattern.test(html)) return html.replace(pattern, replacement);

	return html.replace(/<\/head>/iu, `${replacement}</head>`);
}

export function includedStaticRoutes(paths: string[]) {
	const staticPaths = paths.filter(
		path => !path.includes(":") && !path.includes("*")
	);

	return [...new Set([...staticPaths, FRIENDLY_NOT_FOUND_ROUTE])];
}

export function renderFriendlyNotFoundHead(
	route: string,
	renderedHTML: string
) {
	if (route !== FRIENDLY_NOT_FOUND_ROUTE) return renderedHTML;

	const withTitle = replaceOrInsertHeadElement(
		renderedHTML,
		titlePattern,
		`<title>${FRIENDLY_NOT_FOUND_TITLE}</title>`
	);

	return replaceOrInsertHeadElement(
		withTitle,
		robotsMetaPattern,
		'<meta content="noindex,nofollow" name="robots">'
	);
}
