import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import {
	contentSecurityPolicies,
	exactSecurityHeaders,
	netlifySecurityHeaderRules,
	serializeContentSecurityPolicy,
	validateContentSecurityPolicy,
	validateSecurityHeaders
} from "../../scripts/production-security-headers.mjs";

const repositoryRoot = resolve(import.meta.dirname, "../..");
const netlifySource = readFileSync(
	resolve(repositoryRoot, "netlify.toml"),
	"utf8"
);

interface NetlifyContentSecurityPolicyRule {
	path: string;
	policy: string;
}

function netlifyContentSecurityPolicyRules(
	source: string
): NetlifyContentSecurityPolicyRule[] {
	return source
		.split("[[headers]]")
		.slice(1)
		.flatMap(block => {
			const path = block.match(/^for = "([^"]+)"/mu)?.[1];
			const policy = block.match(
				/^Content-Security-Policy = "([^"]+)"/mu
			)?.[1];
			return path && policy ? [{ path, policy }] : [];
		});
}

const expectedRuleProfiles = new Map(
	netlifySecurityHeaderRules.map(({ path, profile }) => [path, profile])
);

describe("production security-header policy", () => {
	it("keeps every Netlify route on its exact shared policy profile", () => {
		const rules = netlifyContentSecurityPolicyRules(netlifySource);

		expect(rules.map(rule => rule.path)).toEqual([
			...expectedRuleProfiles.keys()
		]);
		for (const rule of rules) {
			const profile = expectedRuleProfiles.get(rule.path);
			expect(profile).toBeDefined();
			expect(validateContentSecurityPolicy(rule.policy, profile!)).toBe(
				true
			);
			expect(rule.policy).toBe(serializeContentSecurityPolicy(profile!));
		}
	});

	it("does not retain generic network schemes or ordinary-page eval", () => {
		for (const [profile, policy] of Object.entries(
			contentSecurityPolicies
		)) {
			const sources = Object.values(policy).flat();
			expect(sources).not.toContain("http:");
			expect(sources).not.toContain("https:");
			expect(sources).not.toContain("ws:");
			expect(sources).not.toContain("wss:");
			if (profile !== "code-ide" && profile !== "python-worker") {
				expect(sources).not.toContain("'unsafe-eval'");
				expect(sources).not.toContain("'wasm-unsafe-eval'");
				expect(sources).not.toContain("https://cdn.jsdelivr.net");
				expect(sources).not.toContain("https://cdn.plot.ly");
			}
		}
	});

	it("limits frame and IDE allowances to their owning profiles", () => {
		expect(contentSecurityPolicies.standard["frame-src"]).toEqual([
			"'none'"
		]);
		expect(contentSecurityPolicies["scheduler-embed"]["frame-src"]).toEqual(
			["https://scheduler.example.com"]
		);
		expect(contentSecurityPolicies["wheel-embed"]["frame-src"]).toEqual([
			"https://wheeldecide.com"
		]);
		expect(
			contentSecurityPolicies["student-management-embed"]["frame-src"]
		).toEqual(["https://docs.google.com"]);
		expect(contentSecurityPolicies["code-ide"]["connect-src"]).toEqual(
			expect.arrayContaining([
				"https://cdn.jsdelivr.net",
				"https://files.pythonhosted.org",
				"https://pypi.org"
			])
		);
		expect(contentSecurityPolicies["code-ide"]["media-src"]).toEqual([
			"'self'",
			"data:",
			"blob:"
		]);
		expect(contentSecurityPolicies.standard["media-src"]).not.toContain(
			"data:"
		);
		expect(contentSecurityPolicies["graph-sketcher"]["worker-src"]).toEqual(
			["'self'"]
		);
		expect(contentSecurityPolicies.standard["worker-src"]).toEqual([
			"'none'"
		]);
		expect(contentSecurityPolicies["python-worker"]["default-src"]).toEqual(
			["'none'"]
		);
		expect(contentSecurityPolicies["python-worker"]["script-src"]).toEqual([
			"'self'",
			"'unsafe-eval'",
			"'wasm-unsafe-eval'",
			"https://cdn.jsdelivr.net"
		]);
		expect(contentSecurityPolicies["python-worker"]["connect-src"]).toEqual(
			[
				"'self'",
				"https://cdn.jsdelivr.net",
				"https://pypi.org",
				"https://files.pythonhosted.org"
			]
		);
		for (const directive of [
			"base-uri",
			"object-src",
			"frame-ancestors",
			"form-action",
			"img-src",
			"font-src",
			"style-src",
			"frame-src",
			"media-src",
			"worker-src",
			"manifest-src"
		]) {
			expect(contentSecurityPolicies["python-worker"][directive]).toEqual(
				["'none'"]
			);
		}
	});

	it("rejects the former globally permissive policy", () => {
		const broadPolicy = [
			"default-src 'self'",
			"base-uri 'self'",
			"object-src 'none'",
			"frame-ancestors 'none'",
			"form-action 'self'",
			"img-src 'self' data: blob: https:",
			"font-src 'self' data: https:",
			"style-src 'self' 'unsafe-inline' https:",
			"script-src 'self' 'unsafe-inline' 'unsafe-eval' 'wasm-unsafe-eval' blob: https:",
			"connect-src 'self' https: wss: ws:",
			"frame-src 'self' https:",
			"media-src 'self' blob: https:",
			"worker-src 'self' blob:",
			"manifest-src 'self'"
		].join("; ");

		expect(() =>
			validateContentSecurityPolicy(broadPolicy, "standard")
		).toThrow("unexpected img-src sources");
	});

	it("rejects missing, duplicate, extra, and unknown policy data", () => {
		const standard = serializeContentSecurityPolicy("standard");

		expect(() => validateContentSecurityPolicy("", "standard")).toThrow(
			"missing Content-Security-Policy"
		);
		expect(() =>
			validateContentSecurityPolicy(
				`${standard}; script-src 'self'`,
				"standard"
			)
		).toThrow("repeats script-src");
		expect(() =>
			validateContentSecurityPolicy(
				`${standard}; upgrade-insecure-requests`,
				"standard"
			)
		).toThrow("unexpected directive set");
		expect(() => validateContentSecurityPolicy(standard, "other")).toThrow(
			"Unknown Content-Security-Policy profile"
		);
	});

	it("preserves the exact non-CSP security headers", () => {
		const values = new Map<string, string>([
			[
				"content-security-policy",
				serializeContentSecurityPolicy("standard")
			],
			...Object.entries(exactSecurityHeaders)
		] as Array<[string, string]>);
		const headers = { get: (name: string) => values.get(name) ?? null };

		expect(validateSecurityHeaders(headers, "/", "standard")).toBe(true);
		expect(exactSecurityHeaders["referrer-policy"]).toBe(
			"strict-origin-when-cross-origin"
		);
		expect(exactSecurityHeaders["strict-transport-security"]).toBe(
			"max-age=31536000"
		);
		values.set("referrer-policy", "no-referrer");
		expect(() => validateSecurityHeaders(headers, "/", "standard")).toThrow(
			"unexpected referrer-policy"
		);
	});
});
