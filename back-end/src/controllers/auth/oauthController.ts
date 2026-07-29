import type {
	Request as ExpressRequest,
	RequestHandler,
	Response
} from "express";
import type { ExternalIdentityProvider } from "../../types/entities/IExternalIdentity.js";
import type { CustomSession } from "../../types/session/CustomSession.js";
import { Buffer } from "node:buffer";
import { createHash, randomBytes, timingSafeEqual } from "node:crypto";
import { OAuthLoginAttempt } from "../../models/schemas/OAuthLoginAttempt.js";
import { establishAccountSession } from "../../utils/accountSessions.js";
import {
	ExternalIdentityAccountError,
	resolveExternalIdentityAccount
} from "../../utils/externalIdentityAccounts.js";
import {
	clearOAuthBrowserBinding,
	clearOAuthBrowserBindings,
	OAUTH_ATTEMPT_LIFETIME_MS,
	oauthBrowserBindingFromRequest,
	setOAuthBrowserBinding
} from "../../utils/oauthBrowserBinding.js";
import {
	createOAuthAuthorizationRequest,
	exchangeOAuthAuthorizationCode
} from "../../utils/oauthClient.js";
import {
	enabledOAuthProviders,
	normalizeOAuthReturnTo,
	oauthAuthOrigin,
	oauthCallbackUrl,
	oauthProviderCredentials
} from "../../utils/oauthProviderConfig.js";

const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;
const OAUTH_TOKEN_PATTERN = /^[\w~-]{32,256}$/u;

type OAuthErrorCode
	= | "account_not_found"
		| "cancelled"
		| "email_unverified"
		| "expired"
		| "identity_conflict"
		| "provider_error"
		| "provider_unavailable";

function isProvider(value: unknown): value is ExternalIdentityProvider {
	return value === "apple" || value === "google";
}

function hashSecret(value: string) {
	return createHash("sha256").update(value).digest("hex");
}

function secureHashMatch(candidate: string, expectedHash: string) {
	if (!OAUTH_TOKEN_PATTERN.test(candidate) || !/^[a-f\d]{64}$/iu.test(expectedHash)) {
		return false;
	}
	const candidateHash = Buffer.from(hashSecret(candidate), "hex");
	const expected = Buffer.from(expectedHash, "hex");
	return candidateHash.length === expected.length
		&& timingSafeEqual(candidateHash, expected);
}

function requestParameter(req: ExpressRequest, key: string) {
	const value = req.method === "POST" ? req.body?.[key] : req.query[key];
	return typeof value === "string" ? value : null;
}

function callbackRequest(
	provider: ExternalIdentityProvider,
	req: ExpressRequest
): globalThis.Request | URL {
	if (req.method !== "POST") {
		const callbackUrl = new URL(oauthCallbackUrl(provider));
		for (const [key, value] of Object.entries(req.query)) {
			if (typeof value === "string") callbackUrl.searchParams.set(key, value);
		}
		return callbackUrl;
	}

	const body = new URLSearchParams();
	for (const key of ["code", "error", "error_description", "state"]) {
		const value = req.body?.[key];
		if (typeof value === "string") body.set(key, value);
	}
	return new globalThis.Request(oauthCallbackUrl(provider), {
		body,
		headers: { "content-type": "application/x-www-form-urlencoded" },
		method: "POST"
	});
}

function withOAuthResult(
	returnTo: string,
	key: "oauthError" | "oauthStatus",
	value: string
) {
	const destination = new URL(returnTo, oauthAuthOrigin());
	destination.searchParams.delete("oauthError");
	destination.searchParams.delete("oauthStatus");
	destination.searchParams.set(key, value);
	return `${destination.pathname}${destination.search}${destination.hash}`;
}

function redirectWithError(
	res: Response,
	returnTo: string,
	errorCode: OAuthErrorCode
) {
	return res.redirect(
		303,
		withOAuthResult(returnTo, "oauthError", errorCode)
	);
}

function logOAuthFailure(provider: ExternalIdentityProvider, error: unknown) {
	const errorType = error instanceof Error
		&& /^[A-Za-z][A-Za-z\d]{0,63}$/u.test(error.name)
		? error.name
		: "UnknownProviderError";
	console.error(`OAuth ${provider} login failed (${errorType}).`);
}

export const getOAuthProviders: RequestHandler = (_req, res) => {
	res.json(enabledOAuthProviders());
};

export const startOAuthLogin: RequestHandler = async (req, res) => {
	const provider = req.params.provider;
	const returnTo = normalizeOAuthReturnTo(req.query.returnTo);
	if (!isProvider(provider) || !oauthProviderCredentials(provider)) {
		return redirectWithError(res, returnTo, "provider_unavailable");
	}

	const state = randomBytes(32).toString("base64url");
	const nonce = randomBytes(32).toString("base64url");
	const browserBinding = randomBytes(32).toString("base64url");
	clearOAuthBrowserBinding(
		res,
		provider === "apple" ? "google" : "apple"
	);

	try {
		const authorization = await createOAuthAuthorizationRequest(
			provider,
			state,
			nonce
		);
		await OAuthLoginAttempt.create({
			browserBindingHash: hashSecret(browserBinding),
			codeVerifier: authorization.codeVerifier,
			expiresAt: new Date(Date.now() + OAUTH_ATTEMPT_LIFETIME_MS),
			nonce,
			provider,
			remember: req.query.remember === "true" || req.query.remember === "1",
			returnTo,
			stateHash: hashSecret(state)
		});
		setOAuthBrowserBinding(res, provider, browserBinding);
		return res.redirect(302, authorization.redirectUrl.toString());
	}
	catch (error) {
		await OAuthLoginAttempt.deleteOne({
			provider,
			stateHash: hashSecret(state)
		}).exec().catch(() => undefined);
		clearOAuthBrowserBinding(res, provider);
		logOAuthFailure(provider, error);
		return redirectWithError(res, returnTo, "provider_error");
	}
};

export const finishOAuthLogin: RequestHandler = async (req, res) => {
	const provider = req.params.provider;
	if (!isProvider(provider) || !oauthProviderCredentials(provider)) {
		return redirectWithError(res, "/", "provider_unavailable");
	}

	const state = requestParameter(req, "state");
	if (!state || !OAUTH_TOKEN_PATTERN.test(state)) {
		clearOAuthBrowserBinding(res, provider);
		return redirectWithError(res, "/", "expired");
	}

	const attempt = await OAuthLoginAttempt.findOne({
		expiresAt: { $gt: new Date() },
		provider,
		stateHash: hashSecret(state)
	})
		.select("+browserBindingHash +codeVerifier +nonce +stateHash")
		.exec();
	const returnTo = normalizeOAuthReturnTo(attempt?.returnTo);
	const browserBinding = oauthBrowserBindingFromRequest(req, provider);
	if (
		!attempt
		|| !browserBinding
		|| !secureHashMatch(browserBinding, attempt.browserBindingHash)
	) {
		clearOAuthBrowserBinding(res, provider);
		return redirectWithError(res, returnTo, "expired");
	}

	const consumedAttempt = await OAuthLoginAttempt.findOneAndDelete({
		_id: attempt._id,
		expiresAt: { $gt: new Date() }
	})
		.select("+browserBindingHash +codeVerifier +nonce +stateHash")
		.exec();
	clearOAuthBrowserBindings(res);
	if (!consumedAttempt) {
		return redirectWithError(res, returnTo, "expired");
	}

	const providerError = requestParameter(req, "error");
	if (providerError) {
		const cancelled = providerError === "access_denied"
			|| providerError === "user_cancelled_authorize";
		return redirectWithError(
			res,
			returnTo,
			cancelled ? "cancelled" : "provider_error"
		);
	}

	try {
		const claims = await exchangeOAuthAuthorizationCode(
			provider,
			callbackRequest(provider, req),
			{
				codeVerifier: consumedAttempt.codeVerifier,
				nonce: consumedAttempt.nonce,
				state
			}
		);
		const email = typeof claims.email === "string"
			? claims.email.trim().toLowerCase()
			: "";
		const subject = typeof claims.sub === "string" ? claims.sub.trim() : "";
		const emailVerified = claims.email_verified === true
			|| claims.email_verified === "true";
		if (!subject) {
			return redirectWithError(res, returnTo, "email_unverified");
		}

		const candidate = await resolveExternalIdentityAccount({
			email: email && emailVerified ? email : null,
			provider,
			subject
		});
		establishAccountSession(req.session as CustomSession, candidate);
		const options = ((req as any).sessionOptions ??= {});
		options.maxAge = consumedAttempt.remember ? THIRTY_DAYS_MS : undefined;
		return res.redirect(
			303,
			withOAuthResult(returnTo, "oauthStatus", "success")
		);
	}
	catch (error) {
		if (error instanceof ExternalIdentityAccountError) {
			return redirectWithError(res, returnTo, error.code);
		}
		logOAuthFailure(provider, error);
		return redirectWithError(res, returnTo, "provider_error");
	}
};
