import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import {
	fullDocumentNavigationTarget,
	securityHeaderProfileForPath,
	securityProfileChanges
} from "@/modules/security-profile-navigation";
import {
	productionCanonicalRouteProbes,
	productionSecurityHeaderProbes
} from "../../scripts/production-security-headers.mjs";

const repositoryRoot = resolve(import.meta.dirname, "../..");

describe("security-profile navigation", () => {
	it("maps canonical, trailing-slash, and generated HTML aliases", () => {
		for (const path of [
			"/ide",
			"/ide/",
			"/ide.html",
			"/python-ide",
			"/python-ide/",
			"/python-ide.html",
			"/bluej",
			"/bluej/",
			"/bluej.html"
		]) {
			expect(securityHeaderProfileForPath(path)).toBe("code-ide");
		}
		expect(securityHeaderProfileForPath("/signup.html?embed=1")).toBe(
			"scheduler-embed"
		);
		expect(securityHeaderProfileForPath("/wheel/#picker")).toBe(
			"wheel-embed"
		);
		expect(
			securityHeaderProfileForPath("/admin/student-management.html")
		).toBe("student-management-embed");
		expect(securityHeaderProfileForPath("/graph-sketcher.html")).toBe(
			"graph-sketcher"
		);
		expect(securityHeaderProfileForPath("/courses/python-level-1")).toBe(
			"course-scratch"
		);
	});

	it("uses the same profiles as every live route probe", () => {
		for (const { path, profile } of [
			...productionSecurityHeaderProbes,
			...productionCanonicalRouteProbes
		]) {
			expect(securityHeaderProfileForPath(path)).toBe(profile);
		}
	});

	it("reloads only when navigation crosses a document policy", () => {
		expect(securityProfileChanges("/courses", "/about")).toBe(true);
		expect(securityProfileChanges("/", "/courses")).toBe(true);
		expect(
			securityProfileChanges("/courses", "/courses/scratch-level-1")
		).toBe(false);
		expect(securityProfileChanges("/bluej", "/ide?mode=bluej")).toBe(false);
		expect(securityProfileChanges("/", "/ide")).toBe(true);
		expect(securityProfileChanges("/ide", "/courses")).toBe(true);
		expect(securityProfileChanges("/courses", "/graph-sketcher")).toBe(
			true
		);
		expect(securityProfileChanges("/signup", "/wheel")).toBe(true);
		expect(
			fullDocumentNavigationTarget(
				"/courses",
				"/ide",
				"/ide?course=python-level-1#project"
			)
		).toBe("/ide?course=python-level-1#project");
		expect(
			fullDocumentNavigationTarget(
				"/python-ide",
				"/ide",
				"/ide?mode=python"
			)
		).toBeNull();
	});

	it("installs the guard and leaves remote connection hints feature-scoped", () => {
		const mainSource = readFileSync(
			resolve(repositoryRoot, "front-end/src/main.ts"),
			"utf8"
		);
		const appSource = readFileSync(
			resolve(repositoryRoot, "front-end/src/App.vue"),
			"utf8"
		);
		const signupSource = readFileSync(
			resolve(repositoryRoot, "front-end/src/pages/signup.vue"),
			"utf8"
		);
		const ideSource = readFileSync(
			resolve(
				repositoryRoot,
				"front-end/src/components/CodeIdeWorkspace.vue"
			),
			"utf8"
		);

		expect(mainSource).toContain("security-profile-navigation.ts");
		expect(appSource).not.toContain("cdn.jsdelivr.net");
		expect(appSource).not.toContain("schedulerDnsPrefetchHref");
		expect(signupSource).toContain("schedulerDnsPrefetchHref");
		expect(ideSource).toContain("primePythonRuntimeConnection");
	});
});
