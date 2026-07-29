import type { RequestHandler } from "express";
import { env } from "node:process";

const SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);
const APPLE_OAUTH_CALLBACK_PATH = /^\/accounts\/oauth\/apple\/callback$/;
const DEFAULT_PRODUCTION_ORIGIN = "https://example.com";

function normalizedOrigin(value: string | undefined) {
	if (!value) return null;
	try {
		return new URL(value).origin;
	}
	catch {
		return null;
	}
}

export function configuredRequestOrigins() {
	const origins = new Set<string>([DEFAULT_PRODUCTION_ORIGIN]);
	const configuredValues = [
		...(env.ALLOWED_REQUEST_ORIGINS ?? "").split(","),
		env.AUTH_ORIGIN,
		env.PASSWORD_RESET_ORIGIN
	];
	for (const value of configuredValues) {
		const origin = normalizedOrigin(value?.trim());
		if (origin) origins.add(origin);
	}

	if (env.NODE_ENV !== "production") {
		origins.add("http://127.0.0.1:3333");
		origins.add("http://localhost:3333");
	}
	return origins;
}

export function createRequestOriginGuard(
	allowedOrigins = configuredRequestOrigins()
): RequestHandler {
	return (req, res, next) => {
		const isAppleOAuthFormPost
			= req.method === "POST"
				&& APPLE_OAUTH_CALLBACK_PATH.test(req.path);
		if (SAFE_METHODS.has(req.method) || isAppleOAuthFormPost) {
			next();
			return;
		}

		const originHeader = req.get("origin");
		const origin = normalizedOrigin(originHeader);
		const fetchSite = req.get("sec-fetch-site")?.toLowerCase();

		if (
			originHeader === "null"
			|| (originHeader && (!origin || !allowedOrigins.has(origin)))
			|| (!originHeader && fetchSite === "cross-site")
		) {
			res.status(403).json({ message: "Cross-site request rejected" });
			return;
		}

		next();
	};
}
