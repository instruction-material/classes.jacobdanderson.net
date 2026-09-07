import type { UserModule } from "@/types";
import { START_LOCATION } from "vue-router";

export type SecurityHeaderProfile =
	| "code-ide"
	| "course-scratch"
	| "graph-sketcher"
	| "scheduler-embed"
	| "standard"
	| "student-management-embed"
	| "wheel-embed";

function normalizedPath(path: string) {
	const withoutQueryOrHash = path.split(/[?#]/u, 1)[0] || "/";
	const withoutHtml = withoutQueryOrHash.replace(/\.html$/u, "");
	return withoutHtml.length > 1
		? withoutHtml.replace(/\/+$/u, "")
		: withoutHtml;
}

export function securityHeaderProfileForPath(
	path: string
): SecurityHeaderProfile {
	const normalized = normalizedPath(path);
	if (/^\/(?:bluej|ide|python-ide)(?:\/|$)/u.test(normalized)) {
		return "code-ide";
	}
	if (/^\/courses(?:\/|$)/u.test(normalized)) {
		return "course-scratch";
	}
	if (/^\/graph-sketcher(?:\/|$)/u.test(normalized)) {
		return "graph-sketcher";
	}
	if (/^\/signup(?:\/|$)/u.test(normalized)) {
		return "scheduler-embed";
	}
	if (/^\/wheel(?:\/|$)/u.test(normalized)) {
		return "wheel-embed";
	}
	if (/^\/admin\/student-management(?:\/|$)/u.test(normalized)) {
		return "student-management-embed";
	}
	return "standard";
}

export function securityProfileChanges(fromPath: string, toPath: string) {
	return (
		securityHeaderProfileForPath(fromPath) !==
		securityHeaderProfileForPath(toPath)
	);
}

export function fullDocumentNavigationTarget(
	fromPath: string,
	toPath: string,
	toFullPath: string
) {
	return securityProfileChanges(fromPath, toPath) ? toFullPath : null;
}

export const install: UserModule = ({ router }) => {
	if (import.meta.env.SSR) return;

	router.beforeEach((to, from) => {
		if (from === START_LOCATION) return;
		const navigationTarget = fullDocumentNavigationTarget(
			from.path,
			to.path,
			to.fullPath
		);
		if (!navigationTarget) return;

		// CSP is a document policy; an SPA route change cannot replace it. Load a
		// new document when the destination uses a different exact policy.
		window.location.assign(navigationTarget);
		return false;
	});
};
