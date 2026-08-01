const SITE_TITLE = "Classes";

const ROUTE_TITLES: Array<[RegExp, string]> = [
	[/^\/$/, SITE_TITLE],
	[/^\/bluej(?:\/|$)/, "IDE"],
	[/^\/courses(?:\/|$)/, "Courses"],
	[/^\/pathways(?:\/|$)/, "Pathways"],
	[/^\/course-resource(?:\/|$)/, "Course Resource"],
	[/^\/graph-sketcher(?:\/|$)/, "Graph Sketcher"],
	[/^\/ide(?:\/|$)/, "IDE"],
	[/^\/python-ide(?:\/|$)/, "IDE"],
	[/^\/zoom(?:\/|$)/, "Zoom"],
	[/^\/signup(?:\/|$)/, "Book a Class"],
	[/^\/payment(?:\/|$)/, "Tuition"],
	[/^\/zelle(?:\/|$)/, "Zelle"],
	[/^\/about(?:\/|$)/, "About"],
	[/^\/profile(?:\/|$)/, "Account"],
	[/^\/reset-password(?:\/|$)/, "Reset Password"],
	[/^\/admin\/student-management(?:\/|$)/, "Student Management"],
	[/^\/admin\/mdmail(?:\/|$)/, "Mail Tools"],
	[/^\/admin\/people(?:\/|$)/, "People"],
	[/^\/admin(?:\/|$)/, "Admin"],
	[/^\/teaching(?:\/|$)/, "Teaching"],
	[/^\/wheel(?:\/|$)/, "Wheel"],
	[/^\/README(?:\/|$)/, "Readme"]
];

function normalizePath(path: string) {
	const normalized = path.trim().split(/[?#]/, 1)[0] || "/";
	if (normalized === "/") return normalized;
	return normalized.replace(/\/+$/g, "");
}

export function pageTitleForPath(path: string) {
	const normalized = normalizePath(path);
	const matchedTitle =
		ROUTE_TITLES.find(([pattern]) => pattern.test(normalized))?.[1] ??
		"Page Not Found";

	if (matchedTitle === SITE_TITLE) return SITE_TITLE;
	return `${matchedTitle} | ${SITE_TITLE}`;
}
