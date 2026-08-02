const exactSecurityHeaders = Object.freeze({
	"cross-origin-opener-policy": "same-origin",
	"cross-origin-resource-policy": "same-origin",
	"permissions-policy": "camera=(), geolocation=(), microphone=()",
	"referrer-policy": "strict-origin-when-cross-origin",
	"strict-transport-security": "max-age=31536000",
	"x-content-type-options": "nosniff",
	"x-frame-options": "DENY"
});

function freezePolicy(policy) {
	return Object.freeze(
		Object.fromEntries(
			Object.entries(policy).map(([directive, sources]) => [directive, Object.freeze([...sources])])
		)
	);
}

const standardPolicy = freezePolicy({
	"default-src": ["'self'"],
	"base-uri": ["'self'"],
	"object-src": ["'none'"],
	"frame-ancestors": ["'none'"],
	"form-action": ["'self'"],
	"img-src": [
		"'self'",
		"data:",
		"https://static.classes.jacobdanderson.net",
		"https://images.unsplash.com"
	],
	"font-src": ["'self'"],
	"style-src": ["'self'", "'unsafe-inline'"],
	"script-src": ["'self'", "'unsafe-inline'"],
	"connect-src": ["'self'", "https://api.github.com", "https://raw.githubusercontent.com"],
	"frame-src": ["'none'"],
	"media-src": ["'self'", "https://static.classes.jacobdanderson.net"],
	"worker-src": ["'none'"],
	"manifest-src": ["'self'"]
});

const apiPolicy = freezePolicy({
	"default-src": ["'none'"],
	"base-uri": ["'none'"],
	"form-action": ["'none'"],
	"frame-ancestors": ["'none'"]
});

function extendPolicy(overrides) {
	return freezePolicy({
		...standardPolicy,
		...overrides
	});
}

const contentSecurityPolicies = Object.freeze(
	Object.fromEntries([
		["api", apiPolicy],
		["standard", standardPolicy],
		[
			"code-ide",
			extendPolicy({
				"img-src": ["'self'", "data:", "blob:"],
				"script-src": [
					"'self'",
					"'unsafe-inline'",
					"'unsafe-eval'",
					"'wasm-unsafe-eval'",
					"https://cdn.jsdelivr.net"
				],
				"connect-src": [
					...standardPolicy["connect-src"],
					"https://cdn.jsdelivr.net",
					"https://pypi.org",
					"https://files.pythonhosted.org"
				],
				"frame-src": ["'self'"],
				"media-src": ["'self'", "data:", "blob:"],
				"worker-src": ["'self'"]
			})
		],
		[
			"graph-sketcher",
			extendPolicy({
				"connect-src": ["'self'"],
				"img-src": ["'self'", "data:", "blob:"],
				"media-src": ["'self'"],
				"worker-src": ["'self'"]
			})
		],
		[
			"scheduler-embed",
			extendPolicy({
				"connect-src": [...standardPolicy["connect-src"], "https://scheduler.example.com"],
				"frame-src": ["https://scheduler.example.com"]
			})
		],
		[
			"wheel-embed",
			extendPolicy({
				"frame-src": ["https://wheeldecide.com"]
			})
		],
		[
			"student-management-embed",
			extendPolicy({
				"frame-src": ["'none'"]
			})
		],
		[
			"python-worker",
			freezePolicy({
				"default-src": ["'none'"],
				"base-uri": ["'none'"],
				"object-src": ["'none'"],
				"frame-ancestors": ["'none'"],
				"form-action": ["'none'"],
				"img-src": ["'none'"],
				"font-src": ["'none'"],
				"style-src": ["'none'"],
				"script-src": ["'self'", "'unsafe-eval'", "'wasm-unsafe-eval'", "https://cdn.jsdelivr.net"],
				"connect-src": [
					"'self'",
					"https://cdn.jsdelivr.net",
					"https://pypi.org",
					"https://files.pythonhosted.org"
				],
				"frame-src": ["'none'"],
				"media-src": ["'none'"],
				"worker-src": ["'none'"],
				"manifest-src": ["'none'"]
			})
		]
	])
);

export const netlifySecurityHeaderRules = Object.freeze([
	Object.freeze({ path: "/*", profile: "standard" }),
	Object.freeze({ path: "/graph-sketcher", profile: "graph-sketcher" }),
	Object.freeze({ path: "/graph-sketcher.html", profile: "graph-sketcher" }),
	Object.freeze({ path: "/graph-sketcher/*", profile: "graph-sketcher" }),
	Object.freeze({ path: "/ide", profile: "code-ide" }),
	Object.freeze({ path: "/ide.html", profile: "code-ide" }),
	Object.freeze({ path: "/ide/*", profile: "code-ide" }),
	Object.freeze({ path: "/python-ide", profile: "code-ide" }),
	Object.freeze({ path: "/python-ide.html", profile: "code-ide" }),
	Object.freeze({ path: "/python-ide/*", profile: "code-ide" }),
	Object.freeze({ path: "/bluej", profile: "code-ide" }),
	Object.freeze({ path: "/bluej.html", profile: "code-ide" }),
	Object.freeze({ path: "/bluej/*", profile: "code-ide" }),
	Object.freeze({ path: "/signup", profile: "scheduler-embed" }),
	Object.freeze({ path: "/signup.html", profile: "scheduler-embed" }),
	Object.freeze({ path: "/signup/*", profile: "scheduler-embed" }),
	Object.freeze({ path: "/wheel", profile: "wheel-embed" }),
	Object.freeze({ path: "/wheel.html", profile: "wheel-embed" }),
	Object.freeze({ path: "/wheel/*", profile: "wheel-embed" }),
	Object.freeze({
		path: "/admin/student-management",
		profile: "student-management-embed"
	}),
	Object.freeze({
		path: "/admin/student-management.html",
		profile: "student-management-embed"
	}),
	Object.freeze({
		path: "/admin/student-management/*",
		profile: "student-management-embed"
	}),
	Object.freeze({
		path: "/assets/pythonIdePlainWorker-*.js",
		profile: "python-worker"
	})
]);

export const productionSecurityHeaderProbes = Object.freeze([
	Object.freeze({ path: "/", profile: "standard" }),
	Object.freeze({ path: "/courses/", profile: "standard" }),
	Object.freeze({ path: "/graph-sketcher", profile: "graph-sketcher" }),
	Object.freeze({ path: "/graph-sketcher/", profile: "graph-sketcher" }),
	Object.freeze({ path: "/ide", profile: "code-ide" }),
	Object.freeze({ path: "/ide/", profile: "code-ide" }),
	Object.freeze({ path: "/python-ide", profile: "code-ide" }),
	Object.freeze({ path: "/python-ide/", profile: "code-ide" }),
	Object.freeze({ path: "/bluej", profile: "code-ide" }),
	Object.freeze({ path: "/bluej/", profile: "code-ide" }),
	Object.freeze({ path: "/signup", profile: "scheduler-embed" }),
	Object.freeze({ path: "/signup/", profile: "scheduler-embed" }),
	Object.freeze({ path: "/wheel", profile: "wheel-embed" }),
	Object.freeze({ path: "/wheel/", profile: "wheel-embed" }),
	Object.freeze({
		path: "/admin/student-management",
		profile: "student-management-embed"
	}),
	Object.freeze({
		path: "/admin/student-management/",
		profile: "student-management-embed"
	})
]);

export const productionCanonicalRouteProbes = Object.freeze([
	Object.freeze({ path: "/index.html", profile: "standard", target: "/" }),
	...[
		["graph-sketcher", "graph-sketcher"],
		["ide", "code-ide"],
		["python-ide", "code-ide"],
		["bluej", "code-ide"],
		["signup", "scheduler-embed"],
		["wheel", "wheel-embed"]
	].flatMap(([route, profile]) => [
		Object.freeze({ path: `/${route}.html`, profile, target: `/${route}/` }),
		Object.freeze({
			path: `/${route}/index.html`,
			profile,
			target: `/${route}/`
		})
	]),
	Object.freeze({
		path: "/admin/student-management.html",
		profile: "student-management-embed",
		target: "/admin/student-management/"
	}),
	Object.freeze({
		path: "/admin/student-management/index.html",
		profile: "student-management-embed",
		target: "/admin/student-management/"
	})
]);

function assertion(condition, message) {
	if (!condition) throw new Error(message);
}

function normalizedSources(sources) {
	return [...sources].sort().join(" ");
}

function headerValues(headers, name) {
	if (typeof headers.getAll === "function") return headers.getAll(name);
	const value = headers.get(name);
	return value === null ? [] : [value];
}

export function serializeContentSecurityPolicy(profile) {
	const policy = contentSecurityPolicies[profile];
	assertion(policy, "Unknown Content-Security-Policy profile.");
	return Object.entries(policy)
		.map(([directive, sources]) => `${directive} ${sources.join(" ")}`)
		.join("; ");
}

export function validateContentSecurityPolicy(value, profile) {
	const expected = contentSecurityPolicies[profile];
	assertion(expected, "Unknown Content-Security-Policy profile.");
	assertion(typeof value === "string" && value.trim(), `${profile} response is missing Content-Security-Policy.`);

	const actual = new Map();
	for (const directiveText of value.split(";")) {
		const tokens = directiveText.trim().split(/\s+/u).filter(Boolean);
		if (!tokens.length) continue;
		const [directive, ...sources] = tokens;
		assertion(!actual.has(directive), `${profile} Content-Security-Policy repeats ${directive}.`);
		actual.set(directive, sources);
	}

	assertion(
		actual.size === Object.keys(expected).length,
		`${profile} Content-Security-Policy has an unexpected directive set.`
	);
	for (const [directive, expectedSources] of Object.entries(expected)) {
		const actualSources = actual.get(directive);
		assertion(
			actualSources && normalizedSources(actualSources) === normalizedSources(expectedSources),
			`${profile} Content-Security-Policy has unexpected ${directive} sources.`
		);
	}

	return true;
}

export function validateSecurityHeaders(headers, path, profile) {
	assertion(
		headerValues(headers, "content-security-policy").length === 1,
		`${path} returned duplicate Content-Security-Policy headers.`
	);
	validateContentSecurityPolicy(headers.get("content-security-policy"), profile);
	for (const [name, expectedValue] of Object.entries(exactSecurityHeaders)) {
		assertion(
			headerValues(headers, name).length === 1,
			`${path} returned duplicate ${name} headers.`
		);
		assertion(headers.get(name) === expectedValue, `${path} returned an unexpected ${name} header.`);
	}
	return true;
}

export function validateApiSecurityHeaders(headers, path) {
	assertion(
		headerValues(headers, "content-security-policy").length === 1,
		`${path} returned duplicate Content-Security-Policy headers.`
	);
	validateContentSecurityPolicy(headers.get("content-security-policy"), "api");
	const expected = {
		"cross-origin-opener-policy": "same-origin",
		"cross-origin-resource-policy": "same-origin",
		"permissions-policy": "camera=(), geolocation=(), microphone=()",
		"referrer-policy": "no-referrer",
		"strict-transport-security": "max-age=31536000",
		"x-content-type-options": "nosniff",
		"x-frame-options": "DENY"
	};
	for (const [name, expectedValue] of Object.entries(expected)) {
		assertion(
			headerValues(headers, name).length === 1,
			`${path} returned duplicate ${name} headers.`
		);
		assertion(headers.get(name) === expectedValue, `${path} returned an unexpected ${name} header.`);
	}
	assertion(headers.get("set-cookie") === null, `${path} unexpectedly set a cookie.`);
	return true;
}

export { contentSecurityPolicies, exactSecurityHeaders };
