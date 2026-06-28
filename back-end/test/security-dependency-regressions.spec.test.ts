import type { Server } from "node:http";
import type { RequestHandler } from "express";
import express from "express";
import { Types } from "mongoose";
import { describe, expect, it } from "vitest";
import {
	createAdminMailLimiter,
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
import {
	configuredRequestOrigins,
	createRequestOriginGuard
} from "../src/middleware/requestOriginGuard.js";
import { renderMarkdownEmailHtml } from "../src/utils/markdownEmail.js";
import { internalDiagnosticsAuthorized } from "../src/utils/internalDiagnostics.js";
import {
	defaultSessionNoteSubject,
	documentReferenceID,
	parseScheduledSessionPayload,
	serializeScheduledSession
} from "../src/utils/scheduledSessions.js";

async function withServer<T>(
	handler: RequestHandler,
	run: (baseUrl: string) => Promise<T>,
	responseStatus = 200,
	trustProxy: boolean | string = false
): Promise<T> {
	const app = express();
	app.set("trust proxy", trustProxy);
	app.use(express.json());
	app.use(handler);
	app.all("/limited", (_req, res) => {
		res.status(responseStatus).json({ ok: responseStatus < 400 });
	});

	const server = await new Promise<Server>((resolve) => {
		const instance = app.listen(0, "127.0.0.1", () => resolve(instance));
	});
	const address = server.address();
	if (!address || typeof address === "string") {
		throw new Error("Test server did not bind to an IPv4 port");
	}

	try {
		return await run(`http://127.0.0.1:${address.port}`);
	}
	finally {
		await new Promise<void>((resolve, reject) => {
			server.close((error) => {
				if (error) {
					reject(error);
					return;
				}
				resolve();
			});
		});
	}
}

async function requestLimitedEndpoint(baseUrl: string): Promise<Response> {
	return fetch(`${baseUrl}/limited`, { method: "POST" });
}

function getStandardRateLimitHeader(response: Response): string | null {
	return response.headers.get("ratelimit") ?? response.headers.get("ratelimit-limit");
}

describe("security dependency regressions", () => {
	it("keeps admin mail rate limiting on standard headers and disables legacy headers", async () => {
		await withServer(
			createAdminMailLimiter({ limit: 2, windowMs: 60_000 }),
			async (baseUrl) => {
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
			}
		);
	});

	it("keeps user course progress endpoints protected by the same non-legacy rate-limit header policy", async () => {
		await withServer(
			createUserCourseAccessLimiter({ limit: 1, windowMs: 60_000 }),
			async (baseUrl) => {
				const first = await requestLimitedEndpoint(baseUrl);
				const second = await requestLimitedEndpoint(baseUrl);

				expect(first.status).toBe(200);
				expect(second.status).toBe(429);
				expect(getStandardRateLimitHeader(second)).toBeTruthy();
				expect(second.headers.get("x-ratelimit-limit")).toBeNull();
			}
		);
	});

	it("rate limits repeated password-reset attempts without legacy headers", async () => {
		await withServer(
			createPasswordResetLimiter({ limit: 1, windowMs: 60_000 }),
			async (baseUrl) => {
				const first = await requestLimitedEndpoint(baseUrl);
				const second = await requestLimitedEndpoint(baseUrl);

				expect(first.status).toBe(200);
				expect(second.status).toBe(429);
				expect(getStandardRateLimitHeader(second)).toBeTruthy();
				expect(second.headers.get("x-ratelimit-limit")).toBeNull();
				await expect(second.json()).resolves.toEqual({
					message: "Too many password reset attempts. Please wait and try again."
				});
			}
		);
	});

	it("rate limits repeated OAuth attempts without legacy headers", async () => {
		await withServer(
			createOAuthLoginLimiter({ limit: 1, windowMs: 60_000 }),
			async (baseUrl) => {
				const first = await requestLimitedEndpoint(baseUrl);
				const second = await requestLimitedEndpoint(baseUrl);

				expect(first.status).toBe(200);
				expect(second.status).toBe(429);
				expect(getStandardRateLimitHeader(second)).toBeTruthy();
				expect(second.headers.get("x-ratelimit-limit")).toBeNull();
				await expect(second.json()).resolves.toEqual({
					message: "Too many login attempts. Please wait and try again."
				});
			}
		);
	});

	it("rate limits login, signup, and email-enumeration endpoints", async () => {
		for (const limiter of [
			createLoginIpLimiter({ limit: 1, windowMs: 60_000 }),
			createLoginAccountLimiter({ limit: 1, windowMs: 60_000 })
		]) {
			await withServer(limiter, async (baseUrl) => {
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
			}, 401);
		}

		for (const limiter of [
			createSignupLimiter({ limit: 1, windowMs: 60_000 }),
			createEmailCheckLimiter({ limit: 1, windowMs: 60_000 })
		]) {
			await withServer(limiter, async (baseUrl) => {
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
			async (baseUrl) => {
				const request = (forwardedFor: string) => fetch(`${baseUrl}/limited`, {
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
			async (baseUrl) => {
				const request = (forwardedFor: string) => fetch(`${baseUrl}/limited`, {
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

	it("rejects unsafe requests from unapproved browser origins", async () => {
		await withServer(
			createRequestOriginGuard(new Set(["https://classes.example.test"])),
			async (baseUrl) => {
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
			}
		);
	});

	it("keeps the canonical production origin allowed without a new deployment variable", () => {
		expect(configuredRequestOrigins()).toContain("https://example.com");
	});

	it("never treats forwarded loopback headers as production diagnostics authorization", async () => {
		const handler: RequestHandler = (req, res) => {
			res.status(internalDiagnosticsAuthorized(req, {
				diagnosticsKey: "correct-secret",
				isProduction: true
			}) ? 200 : 403).end();
		};
		await withServer(handler, async (baseUrl) => {
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
					message:
						"Too many course code attempts. Please wait and try again."
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
		expect(html).toContain("<table role=\"presentation\"");
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
