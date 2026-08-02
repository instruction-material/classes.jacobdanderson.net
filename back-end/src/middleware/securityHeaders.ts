import type { RequestHandler } from "express";
import helmet from "helmet";

export function createApiSecurityHeaders(): RequestHandler {
	return helmet({
		contentSecurityPolicy: {
			directives: {
				baseUri: ["'none'"],
				defaultSrc: ["'none'"],
				formAction: ["'none'"],
				frameAncestors: ["'none'"]
			},
			useDefaults: false
		},
		strictTransportSecurity: {
			includeSubDomains: false,
			maxAge: 31_536_000
		},
		xFrameOptions: { action: "deny" }
	});
}

export function createCrossOriginAssetHeaders(): RequestHandler {
	return helmet.crossOriginResourcePolicy({ policy: "cross-origin" });
}
