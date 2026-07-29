import type { Server } from "node:http";
import type { CustomSession } from "../src/types/session/CustomSession.js";
import cookieSession from "cookie-session";
import express from "express";
import { Types } from "mongoose";
import { afterAll, beforeEach, describe, expect, it, vi } from "vitest";

const oauthMocks = vi.hoisted(() => ({
	attemptCreate: vi.fn(),
	attemptDeleteOne: vi.fn(),
	attemptFindOne: vi.fn(),
	attemptFindOneAndDelete: vi.fn(),
	createAuthorizationRequest: vi.fn(),
	exchangeAuthorizationCode: vi.fn(),
	resolveAccount: vi.fn()
}));

vi.mock("../src/models/schemas/OAuthLoginAttempt.js", () => ({
	OAuthLoginAttempt: {
		create: oauthMocks.attemptCreate,
		deleteOne: oauthMocks.attemptDeleteOne,
		findOne: oauthMocks.attemptFindOne,
		findOneAndDelete: oauthMocks.attemptFindOneAndDelete
	}
}));

vi.mock("../src/utils/oauthClient.js", () => ({
	createOAuthAuthorizationRequest: oauthMocks.createAuthorizationRequest,
	exchangeOAuthAuthorizationCode: oauthMocks.exchangeAuthorizationCode
}));

vi.mock("../src/utils/externalIdentityAccounts.js", () => ({
	ExternalIdentityAccountError: class ExternalIdentityAccountError extends Error {
		readonly code: string;

		constructor(code: string) {
			super(code);
			this.code = code;
		}
	},
	resolveExternalIdentityAccount: oauthMocks.resolveAccount
}));

const { accountRoutes } = await import("../src/routes/accountRoutes.js");

interface StoredAttempt {
	_id: Types.ObjectId;
	browserBindingHash: string;
	codeVerifier: string;
	expiresAt: Date;
	nonce: string;
	provider: "apple" | "google";
	remember: boolean;
	returnTo: string;
	stateHash: string;
}

const originalEnvironment = {
	APPLE_OAUTH_CLIENT_ID: process.env.APPLE_OAUTH_CLIENT_ID,
	APPLE_OAUTH_KEY_ID: process.env.APPLE_OAUTH_KEY_ID,
	APPLE_OAUTH_PRIVATE_KEY: process.env.APPLE_OAUTH_PRIVATE_KEY,
	APPLE_OAUTH_TEAM_ID: process.env.APPLE_OAUTH_TEAM_ID,
	AUTH_ORIGIN: process.env.AUTH_ORIGIN,
	GOOGLE_OAUTH_CLIENT_ID: process.env.GOOGLE_OAUTH_CLIENT_ID,
	GOOGLE_OAUTH_CLIENT_SECRET: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
	OAUTH_ENABLED: process.env.OAUTH_ENABLED
};

let storedAttempt: StoredAttempt | null;

function selectableQuery<T>(result: T) {
	const selected = {
		exec: vi.fn().mockResolvedValue(result)
	};
	return {
		select: vi.fn().mockReturnValue(selected)
	};
}

function executableQuery<T>(result: T) {
	return {
		exec: vi.fn().mockResolvedValue(result)
	};
}

function responseCookie(response: Response, name: string) {
	const cookie = response.headers
		.getSetCookie()
		.find(value => value.startsWith(`${name}=`));
	if (!cookie) throw new Error(`Response did not set ${name}`);
	return cookie.split(";", 1)[0];
}

function responseSessionCookies(response: Response) {
	const cookies = response.headers
		.getSetCookie()
		.filter(value =>
			value.startsWith("session=") || value.startsWith("session.sig=")
		)
		.map(value => value.split(";", 1)[0]);
	if (cookies.length !== 2) {
		throw new Error("Response did not set a complete signed session");
	}
	return cookies.join("; ");
}

async function withAccountRoutes<T>(
	run: (baseUrl: string) => Promise<T>
): Promise<T> {
	const app = express();
	app.use(express.urlencoded({ extended: false }));
	app.use(express.json());
	app.use(cookieSession({
		name: "session",
		keys: ["oauth-login-test-secret"]
	}));
	app.post("/test/session/stale-user", (req, res) => {
		(req.session as CustomSession).userID = "stale-user-id";
		res.sendStatus(204);
	});
	app.get("/test/session", (req, res) => {
		const session = req.session as CustomSession;
		res.json({
			adminID: session.adminID ?? null,
			courseCodeLearnerID: session.courseCodeLearnerID ?? null,
			tutorID: session.tutorID ?? null,
			userID: session.userID ?? null
		});
	});
	app.use("/accounts", accountRoutes);

	const server = await new Promise<Server>(resolve => {
		const instance = app.listen(
			{ host: "127.0.0.1", port: 0 },
			() => resolve(instance)
		);
	});
	const address = server.address();
	if (!address || typeof address === "string") {
		throw new TypeError("Test server did not bind to an IPv4 port");
	}

	try {
		const baseUrl = `http://127.0.0.1:${address.port}`;
		process.env.AUTH_ORIGIN = baseUrl;
		return await run(baseUrl);
	}
	finally {
		await new Promise<void>((resolve, reject) => {
			server.close(error => error ? reject(error) : resolve());
		});
	}
}

async function startLogin(
	baseUrl: string,
	provider: "apple" | "google",
	sessionCookie?: string
) {
	const response = await fetch(
		`${baseUrl}/accounts/oauth/${provider}/start?returnTo=%2Fcourses&remember=true`,
		{
			headers: sessionCookie ? { cookie: sessionCookie } : undefined,
			redirect: "manual"
		}
	);
	const location = response.headers.get("location");
	if (!location) throw new Error("OAuth start did not redirect");
	return {
		bindingCookie: responseCookie(response, `classes_oauth_${provider}`),
		location: new URL(location),
		response
	};
}

describe("Google and Apple OAuth login", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		storedAttempt = null;
		process.env.OAUTH_ENABLED = "true";
		process.env.GOOGLE_OAUTH_CLIENT_ID = "google-client-id";
		process.env.GOOGLE_OAUTH_CLIENT_SECRET = "google-client-secret";
		process.env.APPLE_OAUTH_CLIENT_ID = "classes.web";
		process.env.APPLE_OAUTH_KEY_ID = "APPLEKEY";
		process.env.APPLE_OAUTH_TEAM_ID = "APPLETEAM";
		process.env.APPLE_OAUTH_PRIVATE_KEY =
			"-----BEGIN PRIVATE KEY-----\\ntest\\n-----END PRIVATE KEY-----";

		oauthMocks.createAuthorizationRequest.mockImplementation(
			async (provider: string, state: string, nonce: string) => ({
				codeVerifier: `${provider}-code-verifier`,
				redirectUrl: new URL(
					`https://${provider}.example.test/authorize?state=${state}&nonce=${nonce}`
				)
			})
		);
		oauthMocks.attemptCreate.mockImplementation(async (values: StoredAttempt) => {
			storedAttempt = {
				...values,
				_id: new Types.ObjectId()
			};
			return storedAttempt;
		});
		oauthMocks.attemptDeleteOne.mockReturnValue(executableQuery({ deletedCount: 0 }));
		oauthMocks.attemptFindOne.mockImplementation(() =>
			selectableQuery(storedAttempt)
		);
		oauthMocks.attemptFindOneAndDelete.mockImplementation(() => {
			const consumed = storedAttempt;
			storedAttempt = null;
			return selectableQuery(consumed);
		});
		oauthMocks.exchangeAuthorizationCode.mockResolvedValue({
			email: "tutor@example.com",
			email_verified: true,
			sub: "provider-subject"
		});
		oauthMocks.resolveAccount.mockResolvedValue({
			entity: {
				_id: new Types.ObjectId(),
				email: "tutor@example.com"
			},
			responseKey: "currentTutor",
			role: "tutor",
			sessionKey: "tutorID"
		});
	});

	afterAll(() => {
		for (const [key, value] of Object.entries(originalEnvironment)) {
			if (value === undefined) delete process.env[key];
			else process.env[key] = value;
		}
	});

	it("reports only fully configured providers without exposing credentials", async () => {
		await withAccountRoutes(async baseUrl => {
			const response = await fetch(`${baseUrl}/accounts/oauth/providers`);
			const text = await response.text();

			expect(response.status).toBe(200);
			expect(JSON.parse(text)).toEqual({ apple: true, google: true });
			expect(text).not.toContain("google-client-secret");
			expect(text).not.toContain("APPLEKEY");
			expect(response.headers.get("cache-control")).toBeNull();
		});
	});

	it("uses one-time PKCE state and replaces a stale user session with a tutor-only session", async () => {
		await withAccountRoutes(async baseUrl => {
			const staleResponse = await fetch(
				`${baseUrl}/test/session/stale-user`,
				{ method: "POST" }
			);
			const staleSession = responseSessionCookies(staleResponse);
			const started = await startLogin(baseUrl, "google", staleSession);
			const state = started.location.searchParams.get("state");
			expect(state).toMatch(/^[\w~-]{32,256}$/u);
			expect(started.response.status).toBe(302);
			expect(storedAttempt?.stateHash).not.toBe(state);
			expect(storedAttempt).not.toHaveProperty("accessToken");
			expect(storedAttempt).not.toHaveProperty("refreshToken");
			expect(storedAttempt).not.toHaveProperty("idToken");

			const callback = await fetch(
				`${baseUrl}/accounts/oauth/google/callback`
				+ `?code=provider-code&state=${state}&unexpected=provider-profile`,
				{
					headers: {
						cookie: `${staleSession}; ${started.bindingCookie}`
					},
					redirect: "manual"
				}
			);
			const authenticatedSession = responseSessionCookies(callback);
			const sessionResponse = await fetch(`${baseUrl}/test/session`, {
				headers: { cookie: authenticatedSession }
			});

			expect(callback.status).toBe(303);
			expect(callback.headers.get("location"))
				.toBe("/courses?oauthStatus=success");
			expect(callback.headers.getSetCookie()).toEqual(expect.arrayContaining([
				expect.stringContaining("classes_oauth_apple=;"),
				expect.stringContaining("classes_oauth_google=;")
			]));
			await expect(sessionResponse.json()).resolves.toEqual({
				adminID: null,
				courseCodeLearnerID: null,
				tutorID: expect.any(String),
				userID: null
			});
			expect(oauthMocks.exchangeAuthorizationCode).toHaveBeenCalledWith(
				"google",
				expect.any(URL),
				{
					codeVerifier: "google-code-verifier",
					nonce: expect.any(String),
					state
				}
			);
			const providerCallback
				= oauthMocks.exchangeAuthorizationCode.mock.calls[0]?.[1] as
					| URL
					| undefined;
			expect(providerCallback?.searchParams.get("code"))
				.toBe("provider-code");
			expect(providerCallback?.searchParams.has("unexpected")).toBe(false);
			expect(oauthMocks.resolveAccount).toHaveBeenCalledWith({
				email: "tutor@example.com",
				provider: "google",
				subject: "provider-subject"
			});
			expect(storedAttempt).toBeNull();
		});
	});

	it("accepts Apple's form-post callback and passes it to the client runtime", async () => {
		await withAccountRoutes(async baseUrl => {
			const started = await startLogin(baseUrl, "apple");
			const state = started.location.searchParams.get("state");
			const callback = await fetch(
				`${baseUrl}/accounts/oauth/apple/callback`,
				{
					body: new URLSearchParams({
						code: "apple-code",
						state: state ?? "",
						user: JSON.stringify({
							email: "provider-profile@example.com",
							name: { firstName: "Private", lastName: "Profile" }
						})
					}),
					headers: {
						"content-type": "application/x-www-form-urlencoded",
						cookie: started.bindingCookie
					},
					method: "POST",
					redirect: "manual"
				}
			);

			expect(callback.status).toBe(303);
			const request = oauthMocks.exchangeAuthorizationCode.mock.calls[0]?.[1];
			expect(request).toBeInstanceOf(Request);
			expect(request.method).toBe("POST");
			expect(await request.clone().text()).toContain("code=apple-code");
			expect(await request.clone().text()).not.toContain("provider-profile");
		});
	});

	it("rejects non-form Apple callbacks and does not expose a Google POST callback", async () => {
		await withAccountRoutes(async baseUrl => {
			const apple = await fetch(
				`${baseUrl}/accounts/oauth/apple/callback`,
				{
					body: JSON.stringify({ code: "apple-code", state: "state" }),
					headers: { "content-type": "application/json" },
					method: "POST",
					redirect: "manual"
				}
			);
			const google = await fetch(
				`${baseUrl}/accounts/oauth/google/callback`,
				{
					body: new URLSearchParams({
						code: "google-code",
						state: "state"
					}),
					headers: {
						"content-type": "application/x-www-form-urlencoded"
					},
					method: "POST",
					redirect: "manual"
				}
			);

			expect(apple.status).toBe(415);
			expect(google.status).toBe(404);
			expect(oauthMocks.exchangeAuthorizationCode).not.toHaveBeenCalled();
		});
	});

	it("rejects callbacks without the initiating browser binding before token exchange", async () => {
		await withAccountRoutes(async baseUrl => {
			const started = await startLogin(baseUrl, "google");
			const state = started.location.searchParams.get("state");
			const callback = await fetch(
				`${baseUrl}/accounts/oauth/google/callback?code=provider-code&state=${state}`,
				{ redirect: "manual" }
			);

			expect(callback.status).toBe(303);
			expect(callback.headers.get("location"))
				.toBe("/courses?oauthError=expired");
			expect(oauthMocks.exchangeAuthorizationCode).not.toHaveBeenCalled();
			expect(oauthMocks.resolveAccount).not.toHaveBeenCalled();
		});
	});

	it("keeps provider choices disabled when credentials are incomplete", async () => {
		delete process.env.APPLE_OAUTH_PRIVATE_KEY;
		delete process.env.GOOGLE_OAUTH_CLIENT_SECRET;

		await withAccountRoutes(async baseUrl => {
			const response = await fetch(`${baseUrl}/accounts/oauth/providers`);
			await expect(response.json()).resolves.toEqual({
				apple: false,
				google: false
			});
		});
	});

	it("keeps provider choices disabled until OAuth is explicitly enabled", async () => {
		delete process.env.OAUTH_ENABLED;

		await withAccountRoutes(async baseUrl => {
			const response = await fetch(`${baseUrl}/accounts/oauth/providers`);
			await expect(response.json()).resolves.toEqual({
				apple: false,
				google: false
			});
		});
	});

	it("does not log provider error details that may contain callback secrets", async () => {
		const log = vi.spyOn(console, "error").mockImplementation(() => undefined);
		oauthMocks.createAuthorizationRequest.mockRejectedValue(
			new Error("provider response contained code=secret-value")
		);

		try {
			await withAccountRoutes(async baseUrl => {
				const response = await fetch(
					`${baseUrl}/accounts/oauth/google/start`,
					{ redirect: "manual" }
				);
				expect(response.status).toBe(303);
			});

			const output = log.mock.calls.flat().join(" ");
			expect(output).toContain("OAuth google login failed (Error).");
			expect(output).not.toContain("secret-value");
			expect(output).not.toContain("provider response");
		}
		finally {
			log.mockRestore();
		}
	});
});
