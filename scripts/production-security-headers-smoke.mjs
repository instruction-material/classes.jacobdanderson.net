import process from "node:process";
import { pathToFileURL } from "node:url";
import { smokeRequest } from "./http-smoke-client.mjs";
import {
	productionSecurityHeaderProbes,
	validateApiSecurityHeaders,
	validateSecurityHeaders
} from "./production-security-headers.mjs";

const origin = process.env.CLASSES_SITE_ORIGIN || "https://example.com";
const timeoutMs = Number(process.env.CLASSES_SITE_SMOKE_TIMEOUT_MS || 15_000);
let currentProbe = "initialization";
const allowedRedirectStatuses = new Set([301, 302, 303, 307, 308]);

function assertion(condition, message) {
	if (!condition) throw new Error(message);
}

export async function runProductionSecurityHeadersSmoke() {
	for (const { path, profile } of productionSecurityHeaderProbes) {
		currentProbe = `${profile} profile at ${path}`;
		const response = await smokeRequest(new URL(path, origin), {
			redirect: "manual",
			timeoutMs
		});
		assertion(
			response.ok || allowedRedirectStatuses.has(response.status),
			`${path} returned HTTP ${response.status}.`
		);
		validateSecurityHeaders(response.headers, path, profile);
	}

	for (const { path, status } of [
		{ path: "/api/healthz", status: 200 },
		{ path: "/api/readyz", status: 200 },
		{ path: "/api/__classes-security-probe-missing", status: 404 }
	]) {
		currentProbe = `API boundary at ${path}`;
		const response = await smokeRequest(new URL(path, origin), {
			redirect: "manual",
			timeoutMs
		});
		assertion(response.status === status, `${path} returned HTTP ${response.status}.`);
		assertion(
			response.headers.get("content-type")?.includes("application/json"),
			`${path} did not return JSON.`
		);
		assertion(
			response.headers.get("cache-control")?.includes("no-store"),
			`${path} must not be cached.`
		);
		validateApiSecurityHeaders(response.headers, path);
		if (status === 404) {
			const body = await response.json();
			assertion(
				body
				&& typeof body === "object"
				&& !Array.isArray(body)
				&& Object.keys(body).join(",") === "message"
				&& body.message === "Not found",
				`${path} returned an unexpected not-found body.`
			);
		}
	}

	currentProbe = "complete";
	console.log(`OK: ${origin} returned every exact route-scoped security-header profile.`);
}

const invokedUrl = process.argv[1] ? pathToFileURL(process.argv[1]).href : "";
if (import.meta.url === invokedUrl) {
	runProductionSecurityHeadersSmoke().catch(() => {
		// Response bodies and header values are deliberately omitted. The route
		// profile is enough to identify the failing deployment boundary.
		console.error(
			`Classes production security-header verification failed at ${currentProbe}; response details were not logged.`
		);
		process.exitCode = 1;
	});
}
