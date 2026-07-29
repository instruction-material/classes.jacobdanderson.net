// src/server.ts
import process, { env, exit } from "node:process";
import bodyParser from "body-parser";
import cookieSession from "cookie-session";
import express from "express";
import helmet from "helmet";
import mongoose from "mongoose";

import {
	codeIdeAssetsProxy,
	pythonIdeAssetsProxy
} from "./controllers/common/pythonIdeAssetsProxy.js";
import { quoteProxy } from "./controllers/common/quoteProxy.js";
import { createAdminMailLimiter } from "./middleware/rateLimiters.js";
import { createRequestOriginGuard } from "./middleware/requestOriginGuard.js";
import { accountRoutes } from "./routes/accountRoutes.js";
import { adminMailRoutes } from "./routes/adminMailRoutes.js";
import { adminRoutes } from "./routes/adminRoutes.js";
import { courseAccessCodeRoutes } from "./routes/courseAccessCodeRoutes.js";
import { tutorRoutes } from "./routes/tutorRoutes.js";

import { userRoutes } from "./routes/userRoutes.js";
import { internalDiagnosticsAuthorized } from "./utils/internalDiagnostics.js";
import { getRoleTransferReadiness } from "./utils/roleTransferReadiness.js";

import { readMongoSecret } from "./vaultClient.js";

async function main() {
	const app = express();
	const internalDiagnosticsKey = env.INTERNAL_DIAGNOSTICS_KEY;
	const isProd = env.NODE_ENV === "production";
	const codeIdeProjectJsonBodyLimit
		= env.CODE_IDE_PROJECT_BODY_LIMIT || env.PYTHON_IDE_PROJECT_BODY_LIMIT || "15mb";
	const codeIdeProjectJsonRoute = /^\/users\/(?:loggedin\/python-projects|loggedin\/python-project-reviews|[^/]+\/python-projects)(?:\/|$)/;

	// health
	app.get("/healthz", (_req, res) => {
		res.set("Cache-Control", "no-store");
		res.json({ ok: true });
	});

	const SESSION_SECRET = env.SESSION_SECRET;
	if (!SESSION_SECRET) throw new Error("Missing SESSION_SECRET");

	app.set("trust proxy", isProd ? env.TRUST_PROXY || "loopback" : false);
	app.use(helmet({
		contentSecurityPolicy: false,
		crossOriginResourcePolicy: false
	}));

	// 1) parsers first (with limits)
	app.use(
		"/accounts/oauth/apple/callback",
		(req, res, next) => {
			if (
				req.method === "POST"
				&& !req.is("application/x-www-form-urlencoded")
			) {
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
	app.use(codeIdeProjectJsonRoute, bodyParser.json({ limit: codeIdeProjectJsonBodyLimit }));
	app.use(bodyParser.urlencoded({ extended: false, limit: "1mb" }));
	app.use(bodyParser.json({ limit: "1mb" }));

	// 2) sessions BEFORE any route that needs req.session
	///   COOKIES   ///
	const isCrossSite = !!env.CROSS_SITE;
	type CookieSessionOpts = Parameters<typeof cookieSession>[0];

	const cookieOptions: CookieSessionOpts = {
		name: "session",
		keys: [SESSION_SECRET],
		maxAge: 24 * 60 * 60 * 1000,
		sameSite: "lax", // default, safe for dev & same-origin
		secure: false // default in dev
	};

	// Adjust for production
	if (isProd) {
		if (isCrossSite) {
			cookieOptions.sameSite = "none"; // required for cross-site
			cookieOptions.secure = true; // required when SameSite=None
			// cookieOptions.domain = ".example.com"; // optional if you want subdomain sharing
		}
		else {
			cookieOptions.sameSite = "lax"; // fine for same-origin
			cookieOptions.secure = true; // enforce HTTPS cookies
		}
	}

	app.use(cookieSession(cookieOptions));
	app.use(createRequestOriginGuard());

	// 3) cache-control for auth endpoints
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

	// 4) rate limit (can be before or after parsers; keep before routes)
	app.use("/admin-mail", createAdminMailLimiter(), adminMailRoutes);

	//
	app.use("/quotes", quoteProxy);
	app.use("/code-ide-assets", codeIdeAssetsProxy);
	app.use("/python-assets", pythonIdeAssetsProxy);

	// ready
	app.get("/readyz", async (_req, res) => {
		const connection = mongoose.connection;
		const state = connection.readyState;
		if (state !== 1 || !connection.db) {
			return res.status(503).set("Cache-Control", "no-store").json({
				ready: false,
				components: {
					db: { ok: false, state }
				}
			});
		}

		try {
			await connection.db.admin().ping();
			const roleTransfers = await getRoleTransferReadiness();
			const requireRoleTransfers
				= env.REQUIRE_ROLE_TRANSFER_TRANSACTIONS === "true";
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
		catch (error) {
			return res.status(503).set("Cache-Control", "no-store").json({
				ready: false,
				components: {
					db: {
						ok: false,
						state,
						error: error instanceof Error ? error.message : "db-ping-failed"
					}
				}
			});
		}
	});

	// --- Get Mongo URI from Vault (preferred), else env fallback ---
	let mongoUri: string | undefined;
	try {
		const { uri } = await readMongoSecret(); // your Vault client should read from KV v2
		mongoUri = uri;
	}
	catch (e) {
		// Fail silently if Vault is not available, then probably local test (Had to do this to avoid weird requirements
		// console.log("Vault unavailable, falling back to MONGODB_URI:", e);
		const m: string = e?.toString() || "";
		if (!m.includes("Failed to fetch") && !m.includes("connect ECONNREFUSED")) {
			console.log("");
		}

		mongoUri = env.MONGODB_URI;
	}

	if (!mongoUri) {
		throw new Error("No MongoDB URI available (Vault and MONGODB_URI missing)");
	}

	await mongoose.connect(mongoUri);
	console.log("Connected to MongoDB");
	const c = mongoose.connection;
	console.log(`Mongo connected: db=${c.db?.databaseName} host=${c.host} name=${c.name}`);
	app.get("/_dbinfo", (req, res) => {
		if (!internalDiagnosticsAuthorized(req, {
			diagnosticsKey: internalDiagnosticsKey,
			isProduction: isProd
		})) {
			return res.status(403).set("Cache-Control", "no-store").json({ ok: false, error: "forbidden" });
		}

		res.set("Cache-Control", "no-store").json({
			databaseName: c.db?.databaseName ?? null,
			host: c.host || null,
			name: c.name || null,
			readyState: c.readyState,
			usingVault: !!env.VAULT_ROLE_ID && !!env.VAULT_SECRET_ID
		});
	});

	// Your routes (note: you’ve commented an axios baseURL elsewhere; these are mounted as-is)
	app.use("/tutors", tutorRoutes);
	app.use("/users", userRoutes);
	app.use("/admins", adminRoutes);
	app.use("/accounts", accountRoutes);
	app.use("/course-access", courseAccessCodeRoutes);

	const PORT = env.PORT || 3008;
	const server = app.listen(PORT, () => console.log(`Server listening on port ${PORT}!`));
	let isShuttingDown = false;
	const shutdownTimeoutMs = Number(env.SHUTDOWN_TIMEOUT_MS || 10_000);

	const shutdown = async (signal: NodeJS.Signals) => {
		if (isShuttingDown) {
			return;
		}

		isShuttingDown = true;
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
		catch (error) {
			clearTimeout(forceShutdownTimer);
			console.error("Graceful shutdown failed:", error);
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

main().catch((err) => {
	console.error(err);
	exit(1);
});
