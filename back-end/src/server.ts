// src/server.ts
import process, { env, exit } from "node:process";
import bodyParser from "body-parser";
import cookieSession from "cookie-session";
import express from "express";
import mongoose from "mongoose";

import { quoteProxy } from "./controllers/common/quoteProxy.js";
import {
	validAccountSession,
	validTutorOrAdminSession
} from "./middleware/auth.js";
import { apiNotFound } from "./middleware/notFound.js";
import {
	claimCodeIdeProjectPayloadReservation,
	codeIdeProjectMutationAuthScope,
	createCodeIdeProjectJsonParser,
	createCodeIdeProjectPayloadConcurrencyGuard
} from "./middleware/projectPayload.js";
import {
	codeIdeProjectApiMountPath,
	createAdminMailLimiter,
	createApiIngressLimiter,
	createCodeIdeHeavyProjectPayloadLimiter,
	createCodeIdeProjectAccountWriteLimiter,
	createCodeIdeProjectDataAccessLimiter,
	createCodeIdeProjectIngressLimiter
} from "./middleware/rateLimiters.js";
import { createApiSecurityHeaders } from "./middleware/securityHeaders.js";
import { createNoteAwareRequestOriginGuard, sessionNoteEvidenceAuth } from "./middleware/sessionNoteEvidenceAuth.js";
import { accountRoutes } from "./routes/accountRoutes.js";
import { adminMailRoutes, sessionNoteSending } from "./routes/adminMailRoutes.js";
import { adminRoutes } from "./routes/adminRoutes.js";
import { courseAccessCodeRoutes } from "./routes/courseAccessCodeRoutes.js";
import { ideReportRoutes } from "./routes/ideReportRoutes.js";
import { sessionNoteEvidenceRoutes } from "./routes/sessionNoteEvidenceRoutes.js";
import { sessionNoteVerificationRoutes } from "./routes/sessionNoteVerificationRoutes.js";
import { tutorRoutes } from "./routes/tutorRoutes.js";
import { userRoutes } from "./routes/userRoutes.js";

import { selectMongoConnection } from "./security/mongoConnection.js";
import { ensureNoteWorkflowIndexes, noteOperationalEvent } from "./services/sessionNoteSending.js";
import {
	internalDiagnosticsAuthorized,
	readInternalDiagnosticsKey
} from "./utils/internalDiagnostics.js";
import { getRoleTransferReadiness } from "./utils/roleTransferReadiness.js";
import {
	createSessionCookieOptions,
	crossSiteSessionCookiesEnabled,
	readSessionSecret,
	readTrustProxySetting,
	serverListenHost
} from "./utils/serverSecurity.js";

import { readMongoSecret } from "./vaultClient.js";

async function main() {
	const app = express();
	const internalDiagnosticsKey = readInternalDiagnosticsKey(
		env.INTERNAL_DIAGNOSTICS_KEY
	);
	const isProd = env.NODE_ENV === "production";
	const sessionSecret = readSessionSecret(env.SESSION_SECRET, isProd);

	app.set("trust proxy", readTrustProxySetting(env.TRUST_PROXY, isProd));
	app.use(createApiSecurityHeaders());

	// Health checks bypass rate limiting but receive the same security headers.
	app.get("/healthz", (_req, res) => {
		res.set("Cache-Control", "no-store");
		res.json({ ok: true });
	});

	// Bound database-backed traffic before parsing request bodies. Sensitive
	// endpoints retain their stricter route-specific limits below.
	app.use(createApiIngressLimiter());
	app.use(codeIdeProjectApiMountPath, createCodeIdeProjectIngressLimiter());

	// Reject unsafe cross-origin requests before parsing their bodies or making
	// cookie-backed identity available. Apple's exact form-post callback is
	// exempt here and remains constrained by its dedicated parser below.
	app.use(createNoteAwareRequestOriginGuard());

	// Signed sessions are available to the per-account project limiter before
	// any project auth middleware performs a database lookup.
	app.use(
		cookieSession(
			createSessionCookieOptions({
				crossSite: crossSiteSessionCookiesEnabled(env.CROSS_SITE),
				isProduction: isProd,
				sessionSecret
			})
		)
	);
	const projectJson = createCodeIdeProjectJsonParser();
	const projectDataAccessLimiter = createCodeIdeProjectDataAccessLimiter();
	const heavyProjectPayloadLimiter
		= createCodeIdeHeavyProjectPayloadLimiter();
	const projectPayloadConcurrencyGuard
		= createCodeIdeProjectPayloadConcurrencyGuard();
	const projectBodyMethods = new Set(["PATCH", "POST", "PUT"]);
	const projectMutationMethods = new Set(["DELETE", ...projectBodyMethods]);
	const authenticateProjectMutation: express.RequestHandler = (
		req,
		res,
		next
	) => {
		if (!projectMutationMethods.has(req.method.toUpperCase())) {
			next();
			return;
		}

		const authScope = codeIdeProjectMutationAuthScope(req);
		if (authScope === "account") {
			return validAccountSession(req, res, next);
		}
		if (authScope === "managed") {
			return validTutorOrAdminSession(req, res, next);
		}
		res.setHeader("Allow", "GET");
		res.status(405).json({ message: "Project mutation is not allowed here" });
	};
	const limitProjectBody
		= (limiter: express.RequestHandler) =>
			(
				req: express.Request,
				res: express.Response,
				next: express.NextFunction
			) => {
				if (!projectBodyMethods.has(req.method.toUpperCase())) {
					next();
					return;
				}
				limiter(req, res, next);
			};
	app.use(
		codeIdeProjectApiMountPath,
		(_req, res, next) => {
			res.setHeader("Cache-Control", "no-store");
			next();
		},
		projectDataAccessLimiter,
		createCodeIdeProjectAccountWriteLimiter(),
		authenticateProjectMutation,
		limitProjectBody(heavyProjectPayloadLimiter),
		limitProjectBody(projectPayloadConcurrencyGuard),
		limitProjectBody(projectJson),
		limitProjectBody(claimCodeIdeProjectPayloadReservation)
	);

	app.use("/ide-reports", ideReportRoutes);
	app.use("/session-notes/verification", sessionNoteVerificationRoutes);

	app.use("/session-notes/evidence", sessionNoteEvidenceAuth, bodyParser.json({ limit: "16kb" }), sessionNoteEvidenceRoutes);

	// Parse only after coarse network, request-origin, and per-account checks.
	app.use(
		"/accounts/oauth/apple/callback",
		(req, res, next) => {
			if (req.method === "POST" && !req.is("application/x-www-form-urlencoded")) {
				res.sendStatus(415);
				return;
			}
			next();
		},
		bodyParser.urlencoded({
			extended: false,
			limit: "16kb",
			parameterLimit: 10
		})
	);
	app.use(bodyParser.urlencoded({ extended: false, limit: "1mb" }));
	app.use(bodyParser.json({ limit: "1mb" }));

	// Cache-control for auth endpoints.
	app.use((req, res, next) => {
		if (
			req.path.startsWith("/accounts")
			|| req.path.startsWith("/course-access")
			|| req.path.endsWith("/loggedin")
		) {
			res.setHeader("Cache-Control", "no-store");
		}
		next();
	});

	// Sensitive routes retain their narrower purpose-specific limits.
	app.use("/admin-mail", createAdminMailLimiter(), adminMailRoutes);

	//
	app.use("/quotes", quoteProxy);

	// ready
	app.get("/readyz", async (_req, res) => {
		const connection = mongoose.connection;
		const state = connection.readyState;
		if (state !== 1 || !connection.db) {
			return res
				.status(503)
				.set("Cache-Control", "no-store")
				.json({
					ready: false,
					components: {
						db: { ok: false, state }
					}
				});
		}

		try {
			await connection.db.admin().ping();
			const roleTransfers = await getRoleTransferReadiness();
			const requireRoleTransfers = env.REQUIRE_ROLE_TRANSFER_TRANSACTIONS === "true";
			const ready = !requireRoleTransfers || roleTransfers.ok;
			return res
				.status(ready ? 200 : 503)
				.set("Cache-Control", "no-store")
				.json({
					ready,
					components: {
						db: { ok: true, state },
						roleTransfers
					}
				});
		}
		catch {
			return res
				.status(503)
				.set("Cache-Control", "no-store")
				.json({
					ready: false,
					components: {
						db: {
							ok: false,
							state,
							error: "db-ping-failed"
						}
					}
				});
		}
	});

	const mongoConnection = await selectMongoConnection(
		env,
		readMongoSecret
	);
	await mongoose.connect(mongoConnection.uri);
	console.log("MongoDB connection established");
	let noteWorkerBusy = false;
	let noteWorker: ReturnType<typeof setInterval> | undefined;
	if (env.SESSION_NOTES_WORKER_ENABLED === "true" || env.SESSION_NOTES_SEND_ENABLED === "true") {
		await ensureNoteWorkflowIndexes();
		const recover = async () => {
			if (noteWorkerBusy) return;
			noteWorkerBusy = true;
			try {
				await sessionNoteSending.recover();
			}
			catch { noteOperationalEvent("worker", "recovery_unavailable"); }
			finally { noteWorkerBusy = false; }
		};
		await recover();
		noteWorker = setInterval(() => void recover(), 30_000);
		noteWorker.unref();
	}
	const c = mongoose.connection;
	app.get("/_dbinfo", (req, res) => {
		if (
			!internalDiagnosticsAuthorized(req, {
				diagnosticsKey: internalDiagnosticsKey
			})
		) {
			return res.status(403).set("Cache-Control", "no-store").json({ ok: false, error: "forbidden" });
		}

		res.set("Cache-Control", "no-store").json({
			databaseName: c.db?.databaseName ?? null,
			host: c.host || null,
			name: c.name || null,
			readyState: c.readyState,
			usingVault: mongoConnection.source === "vault"
		});
	});

	// Your routes (note: you’ve commented an axios baseURL elsewhere; these are mounted as-is)
	app.use("/tutors", tutorRoutes);
	app.use("/users", userRoutes);
	app.use("/admins", adminRoutes);
	app.use("/accounts", accountRoutes);
	app.use("/course-access", courseAccessCodeRoutes);

	// The public site owns branded HTML errors. The API must never fall through
	// to Express's stock HTML error document.
	app.use(apiNotFound);
	app.use((error: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
		const status = (error as { status?: number })?.status;
		const safeStatus = status === 413 ? 413 : status === 400 ? 400 : 503;
		res.status(safeStatus).set("Cache-Control", "no-store").json({ message: safeStatus === 413 ? "Request too large" : safeStatus === 400 ? "Invalid request" : "Service temporarily unavailable" });
	});

	const PORT = Number(env.PORT || 3008);
	const listenHost = serverListenHost(isProd, env.HOST);
	const onListening = () => {
		const hostDescription = listenHost ?? "all configured interfaces";
		console.log(`Server listening on ${hostDescription}:${PORT}!`);
	};
	const server = listenHost ? app.listen(PORT, listenHost, onListening) : app.listen(PORT, onListening);
	let isShuttingDown = false;
	const shutdownTimeoutMs = Number(env.SHUTDOWN_TIMEOUT_MS || 10_000);

	const shutdown = async (signal: NodeJS.Signals) => {
		if (isShuttingDown) {
			return;
		}

		isShuttingDown = true;
		if (noteWorker) clearInterval(noteWorker);
		console.log(`${signal} received, shutting down gracefully...`);
		const forceShutdownTimer = setTimeout(() => {
			console.error("Graceful shutdown timed out; closing active connections.");
			server.closeAllConnections();
			exit(1);
		}, shutdownTimeoutMs);
		forceShutdownTimer.unref();

		try {
			if (server.listening) {
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

			if (mongoose.connection.readyState !== 0) {
				await mongoose.disconnect();
			}

			console.log("Graceful shutdown complete.");
			clearTimeout(forceShutdownTimer);
			exit(0);
		}
		catch {
			clearTimeout(forceShutdownTimer);
			console.error(
				"Graceful shutdown failed. Check service connectivity."
			);
			exit(1);
		}
	};

	process.once("SIGINT", () => {
		void shutdown("SIGINT");
	});
	process.once("SIGTERM", () => {
		void shutdown("SIGTERM");
	});
}

main().catch(() => {
	console.error(
		"Server startup failed. Check configuration and service connectivity."
	);
	exit(1);
});
