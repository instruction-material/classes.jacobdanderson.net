import type { Server } from "node:http";
import type { RequestHandler } from "express";
import type { CustomSession } from "../src/types/session/CustomSession.js";
import { readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";
import cookieSession from "cookie-session";
import express from "express";
import { Types } from "mongoose";
import { describe, expect, it } from "vitest";
import {
	codeIdeProjectApiMountPath,
	createAdminMailLimiter,
	createApiIngressLimiter,
	createCodeIdeProjectAccountWriteLimiter,
	createCodeIdeProjectDataAccessLimiter,
	createCodeIdeProjectIngressLimiter,
	createCourseCodeRedemptionLimiter,
	createEmailCheckLimiter,
	createLoginAccountLimiter,
	createLoginIpLimiter,
	createOAuthLoginLimiter,
	createPasswordResetAccountLimiter,
	createPasswordResetLimiter,
	createSignupLimiter,
	createUserCourseAccessLimiter
} from "../src/middleware/rateLimiters.js";
import { configuredRequestOrigins, createRequestOriginGuard } from "../src/middleware/requestOriginGuard.js";
import { createApiSecurityHeaders, createCrossOriginAssetHeaders } from "../src/middleware/securityHeaders.js";
import { renderMarkdownEmailHtml } from "../src/utils/markdownEmail.js";
import {
	internalDiagnosticsAuthorized,
	readInternalDiagnosticsKey
} from "../src/utils/internalDiagnostics.js";
import {
	defaultSessionNoteSubject,
	documentReferenceID,
	parseScheduledSessionPayload,
	serializeScheduledSession
} from "../src/utils/scheduledSessions.js";
import {
	createSessionCookieOptions,
	crossSiteSessionCookiesEnabled,
	readSessionSecret,
	readTrustProxySetting,
	serverListenHost
} from "../src/utils/serverSecurity.js";

async function withConfiguredServer<T>(
	configure: (app: ReturnType<typeof express>) => void,
	run: (baseUrl: string) => Promise<T>
): Promise<T> {
	const app = express();
	configure(app);

	const server = await new Promise<Server>(resolve => {
		const instance = app.listen(0, "127.0.0.1", () => resolve(instance));
	});
	const address = server.address();
	if (!address || typeof address === "string") {
		throw new Error("Test server did not bind to an IPv4 port");
	}

	try {
		return await run(`http://127.0.0.1:${address.port}`);
	} finally {
		await new Promise<void>((resolve, reject) => {
			server.close(error => {
				if (error) {
					reject(error);
					return;
				}
				resolve();
			});
		});
	}
}

async function withServer<T>(
	handler: RequestHandler | RequestHandler[],
	run: (baseUrl: string) => Promise<T>,
	responseStatus = 200,
	trustProxy: boolean | string = false,
	mountPath?: string | RegExp
): Promise<T> {
	return withConfiguredServer(app => {
		app.set("trust proxy", trustProxy);
		app.use(express.json());
		const handlers = Array.isArray(handler) ? handler : [handler];
		if (mountPath) app.use(mountPath, ...handlers);
		else app.use(...handlers);
		app.all(
			[
				"/_dbinfo",
				"/accounts/limited",
				"/admins/limited",
				"/limited",
				"/accounts/oauth/apple/callback",
				"/accounts/oauth/google/callback",
				"/course-access/limited",
				"/readyz",
				"/tutors/limited",
				"/USERS/limited",
				"/users/limited",
				"/users/loggedin/python-projects",
				"/users/loggedin/python-projects/project-1",
				"/users/python-projects/shared/share-id",
				"/USERS/loggedin/python-projects/project-2/share",
				"/users/loggedin/python-projects-archive",
				"/users/student-1/python-projects/project-1/review"
			],
			(_req, res) => {
				res.status(responseStatus).json({ ok: responseStatus < 400 });
			}
		);
	}, run);
}

async function requestLimitedEndpoint(baseUrl: string, path = "/limited"): Promise<Response> {
	return fetch(`${baseUrl}${path}`, { method: "POST" });
}

function getStandardRateLimitHeader(response: Response): string | null {
	return response.headers.get("ratelimit") ?? response.headers.get("ratelimit-limit");
}

describe("security dependency regressions", () => {
	it("pins every GitHub Action and keeps one stable CodeQL category", () => {
		const workflowDirectory = resolve(__dirname, "../../.github/workflows");
		const actionReferences = readdirSync(workflowDirectory)
			.filter(filename => filename.endsWith(".yml") || filename.endsWith(".yaml"))
			.flatMap(filename =>
				readFileSync(resolve(workflowDirectory, filename), "utf8")
					.split(/\r?\n/u)
					.map(line => line.trim())
					.filter(line => line.startsWith("uses:") || line.startsWith("- uses:"))
			);

		expect(actionReferences.length).toBeGreaterThan(0);
		for (const reference of actionReferences) {
			expect(reference).toMatch(
				/^-?\s*uses:\s+[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+(?:\/[A-Za-z0-9_.-]+)?@[a-f0-9]{40}\s+#\s+\S+$/u
			);
		}

		const codeqlWorkflow = readFileSync(
			resolve(workflowDirectory, "codeql-analysis.yml"),
			"utf8"
		);
		expect(codeqlWorkflow).toContain('category: "/language:javascript-typescript"');
	});

	it("rate limits database-backed API routes while leaving readiness probes alone", async () => {
		await withServer(createApiIngressLimiter({ limit: 7, windowMs: 60_000 }), async baseUrl => {
			const firstReadiness = await requestLimitedEndpoint(baseUrl, "/readyz");
			const secondReadiness = await requestLimitedEndpoint(baseUrl, "/readyz");
			const apiResponses = await Promise.all(
				[
					"/_dbinfo",
					"/accounts/limited",
					"/admins/limited",
					"/course-access/limited",
					"/tutors/limited",
					"/USERS/limited",
					"/users/limited"
				].map(path => requestLimitedEndpoint(baseUrl, path))
			);
			const blockedApiRequest = await requestLimitedEndpoint(baseUrl, "/users/limited");

			expect(firstReadiness.status).toBe(200);
			expect(secondReadiness.status).toBe(200);
			expect(firstReadiness.headers.get("ratelimit")).toBeNull();
			for (const response of apiResponses) {
				expect(response.status).toBe(200);
				expect(getStandardRateLimitHeader(response)).toBeTruthy();
			}
			expect(blockedApiRequest.status).toBe(429);
			await expect(blockedApiRequest.json()).resolves.toEqual({
				message: "Too many requests from this network. Please wait and try again."
			});
		});

		await withServer(createApiIngressLimiter(), async baseUrl => {
			const response = await requestLimitedEndpoint(baseUrl, "/users/limited");
			expect(getStandardRateLimitHeader(response)).toContain("30000");
		});
	});

	it("rate limits project ingress without charging project reads", async () => {
		await withServer(
			createCodeIdeProjectIngressLimiter({
				limit: 1,
				windowMs: 60_000
			}),
			async baseUrl => {
				const read = await fetch(`${baseUrl}/limited`);
				const firstWrite = await requestLimitedEndpoint(baseUrl);
				const secondWrite = await requestLimitedEndpoint(baseUrl);

				expect(read.status).toBe(200);
				expect(read.headers.get("ratelimit")).toBeNull();
				expect(firstWrite.status).toBe(200);
				expect(secondWrite.status).toBe(429);
				await expect(secondWrite.json()).resolves.toEqual({
					message: "Too many project changes from this network. Please wait and try again."
				});
			}
		);

		await withServer(createCodeIdeProjectIngressLimiter(), async baseUrl => {
			const response = await requestLimitedEndpoint(baseUrl);
			expect(getStandardRateLimitHeader(response)).toContain("18000");
		});
	});

	it("mounts project protection on collections and descendants without prefix lookalikes", async () => {
		await withServer(
			createCodeIdeProjectIngressLimiter({
				limit: 3,
				windowMs: 60_000
			}),
			async baseUrl => {
				const matchingRequests = [
					fetch(`${baseUrl}/users/loggedin/python-projects`, {
						method: "POST"
					}),
					fetch(`${baseUrl}/users/loggedin/python-projects/project-1`, { method: "PUT" }),
					fetch(`${baseUrl}/USERS/loggedin/python-projects/project-2/share`, { method: "PUT" })
				];
				const matchingResponses = await Promise.all(matchingRequests);
				for (const response of matchingResponses) {
					expect(response.status).toBe(200);
					expect(getStandardRateLimitHeader(response)).toBeTruthy();
				}

				const lookalike = await fetch(`${baseUrl}/users/loggedin/python-projects-archive`, { method: "POST" });
				expect(lookalike.status).toBe(200);
				expect(getStandardRateLimitHeader(lookalike)).toBeNull();

				const blockedDescendant = await fetch(`${baseUrl}/users/student-1/python-projects/project-1/review`, {
					method: "POST"
				});
				expect(blockedDescendant.status).toBe(429);
			},
			200,
			false,
			codeIdeProjectApiMountPath
		);
	});

	it("applies project data limits to anonymous shared-project reads", async () => {
		await withServer(
			createCodeIdeProjectDataAccessLimiter({
				limit: 1,
				windowMs: 60_000
			}),
			async baseUrl => {
				const first = await fetch(
					`${baseUrl}/users/python-projects/shared/share-id`
				);
				const second = await fetch(
					`${baseUrl}/users/python-projects/shared/share-id`
				);

				expect(first.status).toBe(200);
				expect(second.status).toBe(429);
				await expect(second.json()).resolves.toEqual({
					message:
						"Too many project requests. Please wait and try again."
				});
			},
			200,
			false,
			codeIdeProjectApiMountPath
		);
	});

	it("isolates project write limits by signed-in role and falls back to IP", async () => {
		await withConfiguredServer(
			app => {
				app.use((req, _res, next) => {
					const role = req.get("x-test-session-role");
					const id = req.get("x-test-session-id");
					const session = {} as CustomSession;
					if (role === "admin" && id) session.adminID = id;
					if (role === "tutor" && id) session.tutorID = id;
					if (role === "user" && id) session.userID = id;
					if (role === "course-code-learner" && id) {
						session.courseCodeLearnerID = id;
					}
					if (Object.keys(session).length) {
						session.authenticatedSessionExpiresAt = Date.now() + 60_000;
					}
					if (Object.keys(session).length) req.session = session;
					next();
				});
				app.use(
					createCodeIdeProjectAccountWriteLimiter({
						limit: 1,
						windowMs: 60_000
					})
				);
				app.all("/limited", (_req, res) => res.json({ ok: true }));
			},
			async baseUrl => {
				const write = (role?: string, id = "same-object-id") => {
					const headers = new Headers();
					if (role) {
						headers.set("x-test-session-role", role);
						headers.set("x-test-session-id", id);
					}
					return fetch(`${baseUrl}/limited`, {
						headers,
						method: "POST"
					});
				};

				expect((await write("user")).status).toBe(200);
				expect((await write("user")).status).toBe(429);
				expect((await write("tutor")).status).toBe(200);
				expect((await write("course-code-learner")).status).toBe(200);
				expect((await write()).status).toBe(200);
				expect((await write()).status).toBe(429);
			}
		);

		await withServer(createCodeIdeProjectAccountWriteLimiter(), async baseUrl => {
			const response = await requestLimitedEndpoint(baseUrl);
			expect(getStandardRateLimitHeader(response)).toContain("1800");
		});
	});

	it("rejects invalid numeric rate-limit configuration", () => {
		const previousValue = process.env.API_INGRESS_RATE_MAX;
		try {
			for (const invalidValue of ["0", "-1", "1.5", "not-a-number"]) {
				process.env.API_INGRESS_RATE_MAX = invalidValue;
				expect(() => createApiIngressLimiter()).toThrow("API_INGRESS_RATE_MAX must be a positive integer");
			}
		} finally {
			if (previousValue === undefined) {
				delete process.env.API_INGRESS_RATE_MAX;
			} else {
				process.env.API_INGRESS_RATE_MAX = previousValue;
			}
		}
	});

	it("keeps admin mail rate limiting on standard headers and disables legacy headers", async () => {
		await withServer(createAdminMailLimiter({ limit: 2, windowMs: 60_000 }), async baseUrl => {
			const first = await requestLimitedEndpoint(baseUrl);
			const second = await requestLimitedEndpoint(baseUrl);
			const third = await requestLimitedEndpoint(baseUrl);

			expect(first.status).toBe(200);
			expect(second.status).toBe(200);
			expect(third.status).toBe(429);
			expect(getStandardRateLimitHeader(first)).toBeTruthy();
			expect(first.headers.get("x-ratelimit-limit")).toBeNull();
			await expect(third.json()).resolves.toEqual({
				message: "Too many requests, slow down."
			});
		});
	});

	it("keeps user course progress endpoints protected by the same non-legacy rate-limit header policy", async () => {
		await withServer(createUserCourseAccessLimiter({ limit: 1, windowMs: 60_000 }), async baseUrl => {
			const first = await requestLimitedEndpoint(baseUrl);
			const second = await requestLimitedEndpoint(baseUrl);

			expect(first.status).toBe(200);
			expect(second.status).toBe(429);
			expect(getStandardRateLimitHeader(second)).toBeTruthy();
			expect(second.headers.get("x-ratelimit-limit")).toBeNull();
		});
	});

	it("rate limits repeated password-reset attempts without legacy headers", async () => {
		await withServer(createPasswordResetLimiter({ limit: 1, windowMs: 60_000 }), async baseUrl => {
			const first = await requestLimitedEndpoint(baseUrl);
			const second = await requestLimitedEndpoint(baseUrl);

			expect(first.status).toBe(200);
			expect(second.status).toBe(429);
			expect(getStandardRateLimitHeader(second)).toBeTruthy();
			expect(second.headers.get("x-ratelimit-limit")).toBeNull();
			await expect(second.json()).resolves.toEqual({
				message: "Too many password reset attempts. Please wait and try again."
			});
		});
	});

	it("rate limits repeated OAuth attempts without legacy headers", async () => {
		await withServer(createOAuthLoginLimiter({ limit: 1, windowMs: 60_000 }), async baseUrl => {
			const first = await requestLimitedEndpoint(baseUrl);
			const second = await requestLimitedEndpoint(baseUrl);

			expect(first.status).toBe(200);
			expect(second.status).toBe(429);
			expect(getStandardRateLimitHeader(second)).toBeTruthy();
			expect(second.headers.get("x-ratelimit-limit")).toBeNull();
			await expect(second.json()).resolves.toEqual({
				message: "Too many login attempts. Please wait and try again."
			});
		});
	});

	it("rate limits login, signup, and email-enumeration endpoints", async () => {
		for (const limiter of [
			createLoginIpLimiter({ limit: 1, windowMs: 60_000 }),
			createLoginAccountLimiter({ limit: 1, windowMs: 60_000 })
		]) {
			await withServer(
				limiter,
				async baseUrl => {
					const first = await fetch(`${baseUrl}/limited`, {
						body: JSON.stringify({ email: "student@example.com" }),
						headers: { "content-type": "application/json" },
						method: "POST"
					});
					const second = await fetch(`${baseUrl}/limited`, {
						body: JSON.stringify({ email: "student@example.com" }),
						headers: { "content-type": "application/json" },
						method: "POST"
					});
					expect(first.status).toBe(401);
					expect(second.status).toBe(429);
				},
				401
			);
		}

		for (const limiter of [
			createSignupLimiter({ limit: 1, windowMs: 60_000 }),
			createEmailCheckLimiter({ limit: 1, windowMs: 60_000 })
		]) {
			await withServer(limiter, async baseUrl => {
				const first = await fetch(`${baseUrl}/limited`, {
					body: JSON.stringify({ email: "student@example.com" }),
					headers: { "content-type": "application/json" },
					method: "POST"
				});
				const second = await fetch(`${baseUrl}/limited`, {
					body: JSON.stringify({ email: "student@example.com" }),
					headers: { "content-type": "application/json" },
					method: "POST"
				});
				expect(first.status).toBe(200);
				expect(second.status).toBe(429);
			});
		}
	});

	it("applies the login account limit across different source IP addresses", async () => {
		await withServer(
			createLoginAccountLimiter({ limit: 1, windowMs: 60_000 }),
			async baseUrl => {
				const request = (forwardedFor: string) =>
					fetch(`${baseUrl}/limited`, {
						body: JSON.stringify({ email: "  STUDENT@EXAMPLE.COM " }),
						headers: {
							"content-type": "application/json",
							"x-forwarded-for": forwardedFor
						},
						method: "POST"
					});
				const first = await request("192.0.2.10");
				const second = await request("198.51.100.20");

				expect(first.status).toBe(401);
				expect(second.status).toBe(429);
			},
			401,
			"loopback"
		);
	});

	it("applies the password-reset account limit across different source IP addresses", async () => {
		await withServer(
			createPasswordResetAccountLimiter({ limit: 1, windowMs: 60_000 }),
			async baseUrl => {
				const request = (forwardedFor: string) =>
					fetch(`${baseUrl}/limited`, {
						body: JSON.stringify({ email: "  STUDENT@EXAMPLE.COM " }),
						headers: {
							"content-type": "application/json",
							"x-forwarded-for": forwardedFor
						},
						method: "POST"
					});
				const first = await request("192.0.2.10");
				const second = await request("198.51.100.20");

				expect(first.status).toBe(200);
				expect(second.status).toBe(429);
			},
			200,
			"loopback"
		);
	});

	it("sets a restrictive API CSP and scopes cross-origin resource access", async () => {
		await withServer(createApiSecurityHeaders(), async baseUrl => {
			const response = await fetch(`${baseUrl}/limited`);
			const csp = response.headers.get("content-security-policy");

			expect(csp).toContain("default-src 'none'");
			expect(csp).toContain("base-uri 'none'");
			expect(csp).toContain("form-action 'none'");
			expect(csp).toContain("frame-ancestors 'none'");
			expect(csp).not.toContain("script-src");
			expect(csp).not.toContain("style-src");
			expect(csp).not.toContain("upgrade-insecure-requests");
			expect(response.headers.get("cross-origin-resource-policy")).toBe("same-origin");
			expect(response.headers.get("x-frame-options")).toBe("DENY");
		});

		await withServer([createApiSecurityHeaders(), createCrossOriginAssetHeaders()], async baseUrl => {
			const response = await fetch(`${baseUrl}/limited`);
			expect(response.headers.get("cross-origin-resource-policy")).toBe("cross-origin");
		});
	});

	it("keeps production cookies secure and HTTP development bound to loopback", async () => {
		const production = createSessionCookieOptions({
			crossSite: false,
			isProduction: true,
			sessionSecret: "test-secret"
		});
		const crossSiteProduction = createSessionCookieOptions({
			crossSite: true,
			isProduction: true,
			sessionSecret: "test-secret"
		});
		const development = createSessionCookieOptions({
			crossSite: true,
			isProduction: false,
			sessionSecret: "test-secret"
		});

		expect(production).toMatchObject({
			httpOnly: true,
			name: "__Host-session",
			overwrite: true,
			path: "/",
			sameSite: "lax",
			secure: true
		});
		expect(crossSiteProduction).toMatchObject({
			httpOnly: true,
			sameSite: "none",
			secure: true
		});
		expect(development).toMatchObject({
			httpOnly: true,
			name: "session",
			overwrite: true,
			path: "/",
			sameSite: "lax"
		});
		expect(development).not.toHaveProperty("secure");
		expect(crossSiteSessionCookiesEnabled("true")).toBe(true);
		expect(crossSiteSessionCookiesEnabled(" TRUE ")).toBe(true);
		expect(crossSiteSessionCookiesEnabled("false")).toBe(false);
		expect(crossSiteSessionCookiesEnabled(" FALSE ")).toBe(false);
		expect(crossSiteSessionCookiesEnabled("")).toBe(false);
		expect(crossSiteSessionCookiesEnabled(undefined)).toBe(false);
		expect(() => crossSiteSessionCookiesEnabled("1")).toThrow(
			"CROSS_SITE must be true or false"
		);
		expect(() => crossSiteSessionCookiesEnabled("yes")).toThrow(
			"CROSS_SITE must be true or false"
		);
		expect(serverListenHost(false, "0.0.0.0")).toBe("127.0.0.1");
		expect(serverListenHost(true, " :: ")).toBe("::");
		expect(serverListenHost(true, undefined)).toBe("127.0.0.1");
		expect(readTrustProxySetting(undefined, false)).toBe(false);
		expect(readTrustProxySetting(undefined, true)).toBe("loopback");
		expect(readTrustProxySetting("loopback", true)).toBe("loopback");
		expect(readTrustProxySetting(" 1 ", true)).toBe(1);
		expect(readTrustProxySetting("3", true)).toBe(3);
		expect(() => readTrustProxySetting("0.0.0.0/0", true)).toThrow(
			"TRUST_PROXY must be loopback or a hop count from 1 through 3"
		);

		await withConfiguredServer(
			app => {
				app.use(cookieSession(development));
				app.get("/session", (req, res) => {
					(req.session as CustomSession).userID = "development-user";
					res.json({ ok: true });
				});
			},
			async baseUrl => {
				const response = await fetch(`${baseUrl}/session`);
				const setCookie = response.headers.get("set-cookie") ?? "";
				expect(setCookie.toLowerCase()).toContain("httponly");
				expect(setCookie.toLowerCase()).toContain("samesite=lax");
				expect(setCookie.toLowerCase()).not.toMatch(
					/(?:^|[;,]\s*)secure(?:[;,]|$)/
				);
			}
		);
	});

	it("requires a strong production session secret without blocking local development", () => {
		expect(readSessionSecret("x".repeat(32), true)).toBe("x".repeat(32));
		expect(readSessionSecret("é".repeat(16), true)).toBe("é".repeat(16));
		expect(readSessionSecret("short-local-secret", false))
			.toBe("short-local-secret");
		expect(() => readSessionSecret("x".repeat(31), true)).toThrow(
			"SESSION_SECRET must be at least 32 UTF-8 bytes in production"
		);
		expect(() => readSessionSecret(" ", false)).toThrow(
			"Missing SESSION_SECRET"
		);
		expect(() => readSessionSecret(undefined, true)).toThrow(
			"Missing SESSION_SECRET"
		);
	});

	it("keeps readiness and Admin provisioning failures free of secret-bearing errors", () => {
		const serverSource = readFileSync(
			resolve(__dirname, "../src/server.ts"),
			"utf8"
		);
		const adminProvisioningSource = readFileSync(
			resolve(__dirname, "../src/create-admin-user.ts"),
			"utf8"
		);

		expect(serverSource).toContain('error: "db-ping-failed"');
		expect(serverSource).not.toContain(
			'error instanceof Error ? error.message : "db-ping-failed"'
		);
		expect(serverSource).toContain("selectMongoConnection(");
		expect(serverSource).toContain(
			'usingVault: mongoConnection.source === "vault"'
		);
		expect(serverSource).toContain("main().catch(() =>");
		expect(serverSource).not.toContain("console.error(err)");
		expect(serverSource).not.toContain(
			'console.error("Graceful shutdown failed:", error)'
		);

		expect(adminProvisioningSource).toContain(
			"await mongoose.connect(mongoConnection.uri)"
		);
		expect(adminProvisioningSource).toContain("selectMongoConnection(");
		expect(adminProvisioningSource).toContain(
			"adminCreationPayloadSchema.safeParse"
		);
		expect(adminProvisioningSource).toContain(
			"await mongoose.disconnect()"
		);
		expect(adminProvisioningSource).toContain(
			"await accountEmailExists(email)"
		);
		expect(adminProvisioningSource).not.toContain(
			"Admin.exists({ email }).exec()"
		);
		expect(adminProvisioningSource).not.toContain("process.exit(");
		expect(adminProvisioningSource).not.toMatch(
			/console\.error\([^)]*error/iu
		);
	});

	it("registers origin, session, and abuse controls in defensive order", () => {
		const serverSource = readFileSync(resolve(__dirname, "../src/server.ts"), "utf8");
		const securityHeaders = serverSource.indexOf("app.use(createApiSecurityHeaders())");
		const healthRoute = serverSource.indexOf('app.get("/healthz"');
		const ingressLimiter = serverSource.indexOf("app.use(createApiIngressLimiter())");
		const projectIngressLimiter = serverSource.indexOf("createCodeIdeProjectIngressLimiter()");
		const requestOriginGuard = serverSource.indexOf("app.use(createRequestOriginGuard())");
		const cookieSessionMiddleware = serverSource.indexOf("cookieSession(");
		const projectDataLimiter = serverSource.indexOf(
			"createCodeIdeProjectDataAccessLimiter()"
		);
		const projectAccountLimiter = serverSource.indexOf("createCodeIdeProjectAccountWriteLimiter()");
		const heavyProjectLimiter = serverSource.indexOf(
			"createCodeIdeHeavyProjectPayloadLimiter()"
		);
		const projectConcurrencyGuard = serverSource.indexOf(
			"createCodeIdeProjectPayloadConcurrencyGuard()"
		);
		const projectParser = serverSource.indexOf(
			"limitProjectBody(projectJson)"
		);
		const projectRoutes = serverSource.indexOf('app.use("/users", userRoutes)');

		expect(securityHeaders).toBeGreaterThan(-1);
		expect(healthRoute).toBeGreaterThan(securityHeaders);
		expect(ingressLimiter).toBeGreaterThan(healthRoute);
		expect(projectIngressLimiter).toBeGreaterThan(ingressLimiter);
		expect(requestOriginGuard).toBeGreaterThan(projectIngressLimiter);
		expect(cookieSessionMiddleware).toBeGreaterThan(requestOriginGuard);
		expect(projectDataLimiter).toBeGreaterThan(cookieSessionMiddleware);
		expect(projectAccountLimiter).toBeGreaterThan(cookieSessionMiddleware);
		expect(heavyProjectLimiter).toBeGreaterThan(cookieSessionMiddleware);
		expect(projectConcurrencyGuard).toBeGreaterThan(cookieSessionMiddleware);
		expect(projectParser).toBeGreaterThan(projectAccountLimiter);
		expect(projectParser).toBeGreaterThan(heavyProjectLimiter);
		expect(projectParser).toBeGreaterThan(projectConcurrencyGuard);
		expect(projectRoutes).toBeGreaterThan(projectParser);
	});

	it("rejects unsafe requests from unapproved browser origins", async () => {
		await withServer(createRequestOriginGuard(new Set(["https://classes.example.test"])), async baseUrl => {
			const rejected = await fetch(`${baseUrl}/limited`, {
				headers: {
					origin: "https://attacker.example",
					"sec-fetch-site": "cross-site"
				},
				method: "POST"
			});
			const accepted = await fetch(`${baseUrl}/limited`, {
				headers: {
					origin: "https://classes.example.test",
					"sec-fetch-site": "same-origin"
				},
				method: "POST"
			});
			expect(rejected.status).toBe(403);
			expect(accepted.status).toBe(200);
		});
	});

	it("fails closed without request-source headers and accepts an allowed Referer", async () => {
		await withServer(createRequestOriginGuard(new Set(["https://classes.example.test"])), async baseUrl => {
			const missingSource = await fetch(`${baseUrl}/limited`, {
				method: "POST"
			});
			const malformedReferer = await fetch(`${baseUrl}/limited`, {
				headers: { referer: "not a URL" },
				method: "POST"
			});
			const unapprovedReferer = await fetch(`${baseUrl}/limited`, {
				headers: { referer: "https://attacker.example/form" },
				method: "POST"
			});
			const approvedReferer = await fetch(`${baseUrl}/limited`, {
				headers: {
					referer: "https://classes.example.test/account/settings",
					"sec-fetch-site": "same-origin"
				},
				method: "POST"
			});
			const safeRequest = await fetch(`${baseUrl}/limited`);

			expect(missingSource.status).toBe(403);
			expect(malformedReferer.status).toBe(403);
			expect(unapprovedReferer.status).toBe(403);
			expect(approvedReferer.status).toBe(200);
			expect(safeRequest.status).toBe(200);
		});
	});

	it("treats Origin as authoritative when both source headers are present", async () => {
		await withServer(createRequestOriginGuard(new Set(["https://classes.example.test"])), async baseUrl => {
			const response = await fetch(`${baseUrl}/limited`, {
				headers: {
					origin: "https://attacker.example",
					referer: "https://classes.example.test/account/settings"
				},
				method: "POST"
			});

			expect(response.status).toBe(403);
		});
	});

	it("exempts only Apple's exact form-post callback from the origin guard", async () => {
		await withServer(createRequestOriginGuard(new Set(["https://classes.example.test"])), async baseUrl => {
			const apple = await fetch(`${baseUrl}/accounts/oauth/apple/callback`, {
				headers: {
					origin: "https://appleid.apple.com",
					"sec-fetch-site": "cross-site"
				},
				method: "POST"
			});
			const google = await fetch(`${baseUrl}/accounts/oauth/google/callback`, {
				headers: {
					origin: "https://attacker.example",
					"sec-fetch-site": "cross-site"
				},
				method: "POST"
			});

			expect(apple.status).toBe(200);
			expect(google.status).toBe(403);
		});
	});

	it("keeps the neutral production origin and example configuration aligned", () => {
		expect(configuredRequestOrigins()).toContain("https://example.com");
		const envExample = readFileSync(resolve(__dirname, "../.env.EXAMPLE"), "utf8");
		expect(envExample).toMatch(
			/^ALLOWED_REQUEST_ORIGINS=https:\/\/example\.com$/m
		);
		expect(envExample).not.toMatch(
			/^ALLOWED_REQUEST_ORIGINS=https:\/\/classes\.jacobdanderson\.net$/m
		);
	});

	it("never treats forwarded loopback headers as production diagnostics authorization", async () => {
		const handler: RequestHandler = (req, res) => {
			res.status(
				internalDiagnosticsAuthorized(req, {
					diagnosticsKey: "correct-secret"
				})
					? 200
					: 403
			).end();
		};
		await withServer(handler, async baseUrl => {
			const spoofed = await fetch(`${baseUrl}/limited`, {
				headers: { "x-forwarded-for": "127.0.0.1" },
				method: "POST"
			});
			const keyed = await fetch(`${baseUrl}/limited`, {
				headers: { "x-internal-diagnostics-key": "correct-secret" },
				method: "POST"
			});
			expect(spoofed.status).toBe(403);
			expect(keyed.status).toBe(200);
		});
	});

	it("requires an internal diagnostics key outside production too", async () => {
		const handler: RequestHandler = (req, res) => {
			res.status(
				internalDiagnosticsAuthorized(req, {
					diagnosticsKey: "local-diagnostics-secret"
				})
					? 200
					: 403
			).end();
		};
		await withServer(handler, async baseUrl => {
			const missing = await fetch(`${baseUrl}/limited`, {
				method: "POST"
			});
			const keyed = await fetch(`${baseUrl}/limited`, {
				headers: {
					"x-internal-diagnostics-key":
						"local-diagnostics-secret"
				},
				method: "POST"
			});

			expect(missing.status).toBe(403);
			expect(keyed.status).toBe(200);
		});
	});

	it("requires strong internal diagnostics keys whenever diagnostics are enabled", () => {
		expect(readInternalDiagnosticsKey(undefined)).toBeUndefined();
		expect(readInternalDiagnosticsKey("")).toBeUndefined();
		expect(readInternalDiagnosticsKey("x".repeat(32)))
			.toBe("x".repeat(32));
		expect(readInternalDiagnosticsKey("é".repeat(16)))
			.toBe("é".repeat(16));
		expect(() => readInternalDiagnosticsKey("x".repeat(31))).toThrow(
			"INTERNAL_DIAGNOSTICS_KEY must be at least 32 UTF-8 bytes when configured"
		);
		expect(() => readInternalDiagnosticsKey(" ".repeat(32))).toThrow(
			"INTERNAL_DIAGNOSTICS_KEY cannot contain only whitespace"
		);
	});

	it("rate limits repeated classroom code attempts without legacy headers", async () => {
		await withServer(
			createCourseCodeRedemptionLimiter({
				limit: 1,
				windowMs: 60_000
			}),
			async baseUrl => {
				const first = await requestLimitedEndpoint(baseUrl);
				const second = await requestLimitedEndpoint(baseUrl);

				expect(first.status).toBe(200);
				expect(second.status).toBe(429);
				expect(getStandardRateLimitHeader(second)).toBeTruthy();
				expect(second.headers.get("x-ratelimit-limit")).toBeNull();
				await expect(second.json()).resolves.toEqual({
					message: "Too many course code attempts. Please wait and try again."
				});
			}
		);
	});

	it("renders normal markdown into the email HTML shell used by admin mail", async () => {
		const html = await renderMarkdownEmailHtml(
			"# Lesson Notes\n\nStudent completed **arrays** practice.\n\n- Reviewed bounds\n- Discussed edge cases"
		);

		expect(html).toContain("<!doctype html>");
		expect(html).toContain("<h1>Lesson Notes</h1>");
		expect(html).toContain("<strong>arrays</strong>");
		expect(html).toContain("<li>Reviewed bounds</li>");
		expect(html).toContain('<table role="presentation"');
	});

	it("handles malformed deeply nested markdown without throwing or returning a non-string", async () => {
		const nestedMarkdown = `${"[".repeat(250)}safe text${"]".repeat(250)}`;
		const html = await renderMarkdownEmailHtml(nestedMarkdown);

		expect(typeof html).toBe("string");
		expect(html).toContain("safe text");
		expect(html).toContain("<!doctype html>");
	});

	it("parses scheduled sessions with only the supported visible status values", () => {
		const parsed = parseScheduledSessionPayload(
			{
				title: "C++ lesson",
				startAt: "2026-05-12T18:00:00.000Z",
				endAt: "2026-05-12T19:00:00.000Z",
				status: "rescheduled",
				sourceEmail: "STUDENT@example.com"
			},
			{ sourceEmail: "fallback@example.com" }
		);

		expect(parsed.title).toBe("C++ lesson");
		expect(parsed.status).toBe("rescheduled");
		expect(parsed.sourceEmail).toBe("student@example.com");
		expect(parsed.startAt.toISOString()).toBe("2026-05-12T18:00:00.000Z");
	});

	it("rejects no_show and invalid schedule time ranges", () => {
		expect(() =>
			parseScheduledSessionPayload({
				startAt: "2026-05-12T18:00:00.000Z",
				endAt: "2026-05-12T19:00:00.000Z",
				status: "no_show"
			})
		).toThrow("status must be scheduled, cancelled, completed, or rescheduled");

		expect(() =>
			parseScheduledSessionPayload({
				startAt: "2026-05-12T19:00:00.000Z",
				endAt: "2026-05-12T18:00:00.000Z"
			})
		).toThrow("endAt must be after startAt");
	});

	it("serializes scheduled sessions with populated document references", () => {
		const userID = new Types.ObjectId();
		const tutorID = new Types.ObjectId();
		const sessionID = new Types.ObjectId();
		const date = new Date("2026-05-12T18:00:00.000Z");
		const session = {
			_id: sessionID,
			user: { _id: userID },
			tutor: { _id: tutorID },
			title: "Class session",
			startAt: date,
			endAt: new Date(date.getTime() + 60 * 60_000),
			timezone: "America/New_York",
			status: "scheduled",
			createdAt: date,
			updatedAt: date
		} as unknown as Parameters<typeof serializeScheduledSession>[0];
		const serialized = serializeScheduledSession(session);

		expect(documentReferenceID({ _id: tutorID })).toBe(tutorID.toString());
		expect(serialized.user).toBe(userID.toString());
		expect(serialized.tutor).toBe(tutorID.toString());
	});

	it("creates stable default session-note subjects from UTC dates", () => {
		expect(defaultSessionNoteSubject(new Date(Date.UTC(2026, 4, 2, 12)))).toBe("Session Notes (05/02)");
	});
});
