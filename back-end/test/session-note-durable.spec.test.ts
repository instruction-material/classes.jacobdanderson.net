import type { Server, Socket } from "node:net";
import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { createServer } from "node:net";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import express from "express";
import { createHash, randomUUID } from "node:crypto";
import mongoose, { Types } from "mongoose";
import nodemailer from "nodemailer";
import {
	afterAll,
	beforeAll,
	beforeEach,
	describe,
	expect,
	it,
	vi
} from "vitest";
import { SessionNoteSend } from "../src/models/schemas/SessionNoteSend.js";
import { SessionNote } from "../src/models/schemas/SessionNote.js";
import {
	createNoteSendWorkflow,
	mongoNoteSendStore,
	ensureNoteWorkflowIndexes,
	ORPHAN_AFTER_MS
} from "../src/services/sessionNoteSending.js";
import { metadataHash } from "../src/utils/sessionNoteIdentity.js";
import { noteVerificationMetadata } from "../src/utils/sessionNoteVerificationMetadata.js";
import {
	confirmedArchiveAppend,
	NoteArchiveError
} from "../src/utils/sessionNoteArchive.js";

vi.mock("imapflow", () => ({
	ImapFlow: class {
		on = () => this;
		connect = async () => {};
		append = async (destination: string) => ({
			destination,
			uid: 42,
			uidValidity: 1n
		});
		logout = async () => {};
	}
}));
const mongod =
	process.env.SESSION_NOTE_FIXTURE_MONGOD ?? "/opt/homebrew/bin/mongod";
describe.skipIf(!existsSync(mongod))(
	"isolated standalone MongoDB and non-relaying SMTP",
	() => {
		let dbPath: string;
		let uri: string;
		let mongo: ReturnType<typeof spawn>;
		let sink: Server;
		const sockets = new Set<Socket>();
		let port: number;
		let received = 0;
		let timeoutData = false;
		let http: import("node:http").Server;
		let apiBase: string;
		const adminID = new Types.ObjectId();
		const studentID = new Types.ObjectId();
		const sessionID = new Types.ObjectId();
		const readToken = "r".repeat(43);
		const writeToken = "w".repeat(43);
		let ccOnly = false;
		const archive = vi.fn();
		const event = vi.fn();
		const note = () => ({
			user: new Types.ObjectId().toString(),
			studentName: "Synthetic Student",
			primaryEmail: "student@example.test",
			ccEmails: ["parent@example.test"],
			subject: "Synthetic notes",
			markdown: "Synthetic fixture",
			html: "<p>Synthetic fixture</p>",
			sessionDate: new Date("2026-09-18T12:00:00Z"),
			associationStatus: "unlinked_review_required" as const
		});
		function workflow(overrides = {}) {
			return createNoteSendWorkflow({
				enabled: () => true,
				validateBeforeSend: async () => {},
				send: async record =>
					nodemailer
						.createTransport({
							host: "127.0.0.1",
							port,
							secure: false,
							ignoreTLS: true,
							socketTimeout: 200
						})
						.sendMail({
							from: "fixture@example.test",
							to: record.note.primaryEmail,
							cc: record.note.ccEmails,
							text: record.note.markdown,
							messageId: record.messageId
						}),
				archive,
				event,
				...overrides
			});
		}
		async function prepare(w = workflow(), snapshot = note()) {
			return w.prepare({
				actorId: new Types.ObjectId().toString(),
				keyHash: metadataHash("fixture-key"),
				payloadHash: metadataHash(snapshot),
				note: snapshot
			});
		}
		beforeAll(async () => {
			dbPath = await mkdtemp(join(tmpdir(), "classes-note-fixture-"));
			// Reserve a local port; no production URI or environment files are consulted.
			const reserve = createServer();
			await new Promise<void>(resolve =>
				reserve.listen(0, "127.0.0.1", resolve)
			);
			const dbPort = (reserve.address() as any).port;
			await new Promise<void>(resolve => reserve.close(() => resolve()));
			uri =
				"mongodb://127.0.0.1:" +
				dbPort +
				"/synthetic_session_notes_protected_copy";
			mongo = spawn(
				mongod,
				[
					"--dbpath",
					dbPath,
					"--bind_ip",
					"127.0.0.1",
					"--port",
					String(dbPort),
					"--wiredTigerCacheSizeGB",
					"0.25",
					"--quiet"
				],
				{ stdio: ["ignore", "ignore", "ignore"], detached: true }
			);
			console.info(
				JSON.stringify({
					task: "session-note-synthetic-fixture",
					cwd: dbPath,
					command: "isolated mongod",
					pid: mongo.pid,
					startedAt: new Date().toISOString()
				})
			);
			let connected = false;
			for (let i = 0; i < 40; i++) {
				try {
					await mongoose.connect(uri, {
						serverSelectionTimeoutMS: 100
					});
					connected = true;
					break;
				} catch {
					await new Promise(resolve => setTimeout(resolve, 100));
				}
			}
			if (!connected) throw new Error("Synthetic MongoDB did not start");
			await ensureNoteWorkflowIndexes();
			sink = createServer(socket => {
				sockets.add(socket);
				socket.on("close", () => sockets.delete(socket));
				socket.write("220 synthetic.local ESMTP\r\n");
				let buffer = "";
				let data = false;
				socket.on("data", chunk => {
					buffer += chunk.toString();
					while (buffer.includes("\r\n")) {
						const pos = buffer.indexOf("\r\n");
						const line = buffer.slice(0, pos);
						buffer = buffer.slice(pos + 2);
						if (data) {
							if (line === ".") {
								data = false;
								received++;
								if (!timeoutData)
									socket.write(
										"250 accepted by synthetic sink\r\n"
									);
							}
						} else if (/^(EHLO|HELO)/.test(line))
							socket.write("250 synthetic.local\r\n");
						else if (/^RCPT TO.*student@/.test(line) && ccOnly)
							socket.write("550 synthetic primary rejection\r\n");
						else if (/^(MAIL FROM|RCPT TO|RSET)/.test(line))
							socket.write("250 ok\r\n");
						else if (line === "DATA") {
							data = true;
							socket.write("354 end with dot\r\n");
						} else if (line === "QUIT") {
							socket.end("221 bye\r\n");
						}
					}
				});
			});
			await new Promise<void>(resolve =>
				sink.listen(0, "127.0.0.1", resolve)
			);
			port = (sink.address() as any).port;
			vi.stubEnv("SMTP_PRIMARY_HOST", "127.0.0.1");
			vi.stubEnv("SMTP_PRIMARY_PORT", String(port));
			vi.stubEnv("SMTP_PRIMARY_SERVERNAME", "synthetic.local");
			vi.stubEnv("IMAP_APPEND_PASS", "synthetic-only");
			vi.stubEnv("SESSION_NOTES_SEND_ENABLED", "true");
			vi.stubEnv("MDMAIL_ALLOW_TO", "");
			vi.stubEnv(
				"SESSION_NOTES_READ_TOKEN_SHA256",
				createHash("sha256").update(readToken).digest("hex")
			);
			vi.stubEnv(
				"SESSION_NOTES_READ_TOKEN_EXPIRES_AT",
				new Date(Date.now() + 60_000).toISOString()
			);
			vi.stubEnv(
				"SESSION_NOTES_EVIDENCE_TOKEN_SHA256",
				createHash("sha256").update(writeToken).digest("hex")
			);
			vi.stubEnv(
				"SESSION_NOTES_EVIDENCE_TOKEN_EXPIRES_AT",
				new Date(Date.now() + 60_000).toISOString()
			);
			vi.stubEnv("SESSION_NOTES_EVIDENCE_SCOPE", "register");
			vi.stubEnv("SESSION_NOTES_EVIDENCE_STUDENT_IDS", String(studentID));
			const { adminMailRoutes } =
				await import("../src/routes/adminMailRoutes.js");
			const { userRoutes } = await import("../src/routes/userRoutes.js");
			const { sessionNoteEvidenceRoutes } =
				await import("../src/routes/sessionNoteEvidenceRoutes.js");
			const { sessionNoteVerificationRoutes } =
				await import("../src/routes/sessionNoteVerificationRoutes.js");
			const { createNoteAwareRequestOriginGuard } =
				await import("../src/middleware/sessionNoteEvidenceAuth.js");
			const app = express();
			app.use(createNoteAwareRequestOriginGuard());
			app.use((req, _res, next) => {
				req.session = {
					adminID: req.get("x-fixture-admin")
						? String(adminID)
						: undefined,
					accountSessionVersion: 0,
					authenticatedSessionExpiresAt: Date.now() + 60_000
				};
				next();
			});
			app.use(express.json({ limit: "1mb" }));
			app.use("/admin-mail", adminMailRoutes);
			app.use("/users", userRoutes);
			app.use("/session-notes/evidence", sessionNoteEvidenceRoutes);
			app.use("/verify", sessionNoteVerificationRoutes);
			http = await new Promise(resolve => {
				const instance = app.listen(0, "127.0.0.1", () =>
					resolve(instance)
				);
			});
			apiBase = "http://127.0.0.1:" + (http.address() as any).port;
		}, 20_000);
		beforeEach(async () => {
			vi.stubEnv("SESSION_NOTES_SEND_ENABLED", "true");
			vi.stubEnv("SESSION_NOTES_WORKER_ENABLED", "false");
			vi.stubEnv("ADMIN_MAIL_RECIPIENTS_JSON", "[]");
			await SessionNoteSend.deleteMany({});
			await SessionNote.deleteMany({});
			const { User } = await import("../src/models/schemas/User.js");
			const { Admin } = await import("../src/models/schemas/Admin.js");
			const { ScheduledSession } =
				await import("../src/models/schemas/ScheduledSession.js");
			const { SessionNoteEvidence } =
				await import("../src/models/schemas/SessionNoteEvidence.js");
			await Promise.all([
				User.deleteMany({}),
				Admin.deleteMany({}),
				ScheduledSession.deleteMany({}),
				SessionNoteEvidence.deleteMany({})
			]);
			await User.collection.insertOne({
				_id: studentID,
				name: "Synthetic Student",
				email: "student@example.test",
				tutors: [],
				recipientNameKey: "synthetic student"
			});
			await Admin.collection.insertOne({
				_id: adminID,
				name: "Fixture Admin",
				email: "admin@example.test",
				sessionVersion: 0
			});
			await ScheduledSession.create({
				_id: sessionID,
				user: studentID,
				title: "Synthetic class",
				startAt: new Date("2026-09-19T01:00:00Z"),
				endAt: new Date("2026-09-19T02:00:00Z"),
				timezone: "America/Los_Angeles"
			});
			received = 0;
			timeoutData = false;
			ccOnly = false;
			archive.mockReset().mockResolvedValue(undefined);
			event.mockReset();
		});
		afterAll(async () => {
			if (http) {
				http.closeAllConnections();
				await new Promise<void>(resolve => http.close(() => resolve()));
			}
			vi.unstubAllEnvs();
			for (const socket of sockets) socket.destroy();
			if (sink)
				await new Promise<void>(resolve => sink.close(() => resolve()));
			await mongoose.disconnect();
			if (mongo?.pid) {
				const ended = new Promise(resolve =>
					mongo.once("exit", resolve)
				);
				process.kill(-mongo.pid, "SIGTERM");
				await ended;
				console.info(
					JSON.stringify({
						task: "session-note-synthetic-fixture",
						pid: mongo.pid,
						endedAt: new Date().toISOString(),
						exitCode: mongo.exitCode,
						cleanup: "process group stopped"
					})
				);
			}
			if (dbPath) await rm(dbPath, { recursive: true, force: true });
		}, 20_000);
		it("does not contact SMTP if intent persistence fails", async () => {
			const w = workflow({
				store: {
					...mongoNoteSendStore,
					insert: async () => {
						throw new Error("synthetic DB failure");
					}
				}
			});
			await expect(prepare(w)).rejects.toThrow();
			expect(received).toBe(0);
		});
		it("does not dispatch when note persistence fails and safely resumes preparing on equivalent retry", async () => {
			const snapshot = note();
			const actorId = new Types.ObjectId().toString();
			const input = {
				actorId,
				keyHash: metadataHash("same-key"),
				payloadHash: metadataHash(snapshot),
				note: snapshot
			};
			const broken = workflow({
				ensureNote: async () => {
					throw new Error("synthetic DB failure");
				}
			});
			await expect(broken.prepare(input)).rejects.toThrow();
			expect(received).toBe(0);
			expect(await SessionNoteSend.countDocuments()).toBe(1);
			const w = workflow();
			const record = await w.prepare(input);
			expect(record.state).toBe("queued");
			await w.dispatch(record._id);
			expect(received).toBe(1);
		});
		it("atomically deduplicates concurrent equivalent requests and dispatches once", async () => {
			const w = workflow();
			const snapshot = note();
			const input = {
				actorId: new Types.ObjectId().toString(),
				keyHash: metadataHash("same-key"),
				payloadHash: metadataHash(snapshot),
				note: snapshot
			};
			const [a, b] = await Promise.all([
				w.prepare(input),
				w.prepare(input)
			]);
			expect(a._id).toBe(b._id);
			expect(await SessionNoteSend.countDocuments()).toBe(1);
			await Promise.all([w.dispatch(a._id), w.dispatch(b._id)]);
			expect(received).toBe(1);
			expect(archive).toHaveBeenCalledTimes(1);
		});
		it("rejects changed payloads using an existing key", async () => {
			const w = workflow();
			const record = await prepare(w);
			await expect(
				w.prepare({
					actorId: record.actorId,
					keyHash: record.keyHash,
					payloadHash: "changed",
					note: record.note
				})
			).rejects.toMatchObject({ status: 409 });
			expect(received).toBe(0);
		});
		it("preserves an existing saved note instead of making an unrelated duplicate", async () => {
			const snapshot = note();
			const saved = await SessionNote.create({
				...snapshot,
				workflowVersion: 2,
				savedAt: new Date()
			});
			const w = workflow();
			const record = await w.prepare({
				actorId: new Types.ObjectId().toString(),
				keyHash: metadataHash("same-key"),
				payloadHash: metadataHash(snapshot),
				noteId: String(saved._id),
				note: snapshot
			});
			await w.dispatch(record._id);
			expect(await SessionNote.countDocuments()).toBe(1);
			expect(record.noteId).toBe(String(saved._id));
			expect(
				(await SessionNoteSend.findById(record._id))!.attempts
			).toHaveLength(1);
		});
		it("reports accepted-but-unrecorded tracking trouble, then recovers without a second send", async () => {
			const w = workflow({
				store: {
					...mongoNoteSendStore,
					change: async (id, expected, update) => {
						if ((update.$set as any)?.state === "smtp_accepted")
							throw new Error(
								"synthetic persistence failure after DATA"
							);
						return mongoNoteSendStore.change(id, expected, update);
					}
				}
			});
			const record = await prepare(w);
			expect(await w.dispatch(record._id)).toMatchObject({
				operationId: record._id,
				evidenceStatus: "delivery_unconfirmed",
				statusReason: "tracking_reconciliation_required"
			});
			expect(received).toBe(1);
			await SessionNoteSend.updateOne(
				{ _id: record._id },
				{
					$set: {
						claimedAt: new Date(Date.now() - ORPHAN_AFTER_MS - 1)
					}
				}
			);
			await workflow().recover();
			await workflow().dispatch(record._id);
			expect((await SessionNoteSend.findById(record._id))!.state).toBe(
				"delivery_unconfirmed"
			);
			expect(received).toBe(1);
		});
		it("does not blindly fail over or resend a DATA timeout", async () => {
			timeoutData = true;
			const w = workflow();
			const record = await prepare(w);
			expect(await w.dispatch(record._id)).toMatchObject({
				evidenceStatus: "delivery_unconfirmed"
			});
			await w.recover();
			await w.dispatch(record._id);
			expect(received).toBe(1);
			expect(archive).not.toHaveBeenCalled();
		});
		it("does not mark primary SMTP acceptance when only CC was accepted", async () => {
			ccOnly = true;
			const w = workflow();
			const record = await prepare(w);
			expect(await w.dispatch(record._id)).toMatchObject({
				evidenceStatus: "smtp_rejected",
				sentAt: null
			});
		});
		it("returns refreshed archival success without a selected mailbox and never resends SMTP", async () => {
			const append = vi
				.fn()
				.mockResolvedValue({
					destination: "Synthetic Sent",
					uid: 42,
					uidValidity: 1n
				});
			archive.mockImplementation(() =>
				confirmedArchiveAppend({
					destination: () => "Synthetic Sent",
					connect: async () => {},
					append,
					logout: async () => {}
				})
			);
			const w = workflow();
			const record = await prepare(w);
			expect(await w.dispatch(record._id)).toMatchObject({
				evidenceStatus: "smtp_accepted",
				archivalStatus: "archived"
			});
			await w.dispatch(record._id);
			await w.recover();
			expect(append).toHaveBeenCalledTimes(1);
			expect(received).toBe(1);
		});
		it.each([
			{ result: false, archivalStatus: "retry" },
			{ result: undefined, archivalStatus: "review_required" },
			{ result: { destination: "Another mailbox" }, archivalStatus: "review_required" }
		])("returns $archivalStatus for the actual APPEND result without another SMTP attempt", async ({ result, archivalStatus }) => {
			const append = vi.fn().mockResolvedValue(result);
			archive.mockImplementation(() => confirmedArchiveAppend({
				destination: () => "Synthetic Sent",
				connect: async () => {},
				append,
				logout: async () => {}
			}));
			const w = workflow();
			const record = await prepare(w);
			expect(await w.dispatch(record._id)).toMatchObject({ evidenceStatus: "smtp_accepted", archivalStatus });
			await w.dispatch(record._id);
			await w.recover();
			expect(append).toHaveBeenCalledTimes(1);
			expect(received).toBe(1);
		});
		it("preserves accepted evidence if the final operation refresh fails", async () => {
			const store = {
				...mongoNoteSendStore,
				get: vi
					.fn()
					.mockRejectedValue(new Error("Synthetic refresh failure"))
			};
			const w = workflow({ store });
			const record = await prepare(w);
			expect(await w.dispatch(record._id)).toMatchObject({
				ok: true,
				evidenceStatus: "smtp_accepted",
				archivalStatus: null,
				statusReason: "archive_tracking_requires_attention"
			});
			await workflow().dispatch(record._id);
			expect(archive).toHaveBeenCalledTimes(1);
			expect(received).toBe(1);
		});
		it("retries archival alone after failure and retains accepted evidence", async () => {
			archive.mockRejectedValueOnce(new NoteArchiveError("not_appended"));
			const w = workflow();
			const record = await prepare(w);
			expect(await w.dispatch(record._id)).toMatchObject({
				evidenceStatus: "smtp_accepted",
				archivalStatus: "retry"
			});
			await SessionNoteSend.updateOne(
				{ _id: record._id },
				{ $set: { nextArchiveAt: new Date(0) } }
			);
			await w.recover();
			expect(archive).toHaveBeenCalledTimes(2);
			expect(received).toBe(1);
			expect(
				(await SessionNoteSend.findById(record._id))!.archiveState
			).toBe("archived");
		});
		it("does not automatically retry archival with an uncertain prior append outcome", async () => {
			const w = workflow();
			const record = await prepare(w);
			await w.dispatch(record._id);
			await SessionNoteSend.updateOne(
				{ _id: record._id },
				{
					$set: {
						archiveState: "archiving",
						archiveClaimedAt: new Date(0)
					}
				}
			);
			await w.recover();
			expect(archive).toHaveBeenCalledTimes(1);
			expect(
				(await SessionNoteSend.findById(record._id))!.archiveState
			).toBe("review_required");
		});
		it("does not append again after acceptance tracking fails", async () => {
			let trackingFailed = false;
			const store = {
				...mongoNoteSendStore,
				change: async (
					id: string,
					expected: Record<string, unknown>,
					update: Record<string, any>
				) => {
					if (update.$set?.archiveState === "archived") {
						trackingFailed = true;
						throw new Error(
							"Synthetic archival persistence failure"
						);
					}
					return mongoNoteSendStore.change(id, expected, update);
				}
			};
			const w = workflow({ store });
			const record = await prepare(w);
			expect(await w.dispatch(record._id)).toMatchObject({
				evidenceStatus: "smtp_accepted",
				archivalStatus: "archiving"
			});
			expect(trackingFailed).toBe(true);
			expect(archive).toHaveBeenCalledTimes(1);
			const accepted = await SessionNoteSend.findById(record._id);
			expect(accepted!.archiveState).toBe("archiving");
			expect(accepted!.sentAt).toBeInstanceOf(Date);
			await SessionNoteSend.updateOne(
				{ _id: record._id },
				{ $set: { archiveClaimedAt: new Date(0) } }
			);
			await w.recover();
			await w.dispatch(record._id);
			expect(archive).toHaveBeenCalledTimes(1);
			expect(received).toBe(1);
			expect(
				(await SessionNoteSend.findById(record._id))!.archiveState
			).toBe("review_required");
		});
		it("keeps an APPEND timeout under review while preserving accepted SMTP evidence", async () => {
			archive.mockRejectedValueOnce(new NoteArchiveError("unconfirmed"));
			const w = workflow();
			const record = await prepare(w);
			expect(await w.dispatch(record._id)).toMatchObject({
				evidenceStatus: "smtp_accepted",
				archivalStatus: "review_required"
			});
			await w.recover();
			expect(archive).toHaveBeenCalledTimes(1);
			expect(received).toBe(1);
			const saved = await SessionNoteSend.findById(record._id);
			expect(saved!.state).toBe("smtp_accepted");
			expect(saved!.archiveState).toBe("review_required");
			expect(event).toHaveBeenCalledWith(
				record._id,
				"archive_outcome_ambiguous"
			);
		});
		it("audits archival dispositions without changing or resending accepted SMTP evidence", async () => {
			const w = workflow();
			const record = await prepare(w);
			await w.dispatch(record._id);
			await SessionNoteSend.updateOne(
				{ _id: record._id },
				{ $set: { archiveState: "review_required" } }
			);
			await SessionNote.updateOne(
				{ _id: record.noteId },
				{ $set: { associationReviewResolved: true } }
			);
			const path =
				"/admin-mail/session-notes/operations/" +
				record._id +
				"/disposition";
			const payload = {
				decision: "archive_confirmed_present",
				evidenceRef: "a".repeat(64),
				idempotencyKey: "archive-disposition-synthetic"
			};
			expect((await post(path, payload)).status).toBe(409);
			vi.stubEnv("SESSION_NOTES_SEND_ENABLED", "false");
			expect(
				(
					await post(path, payload, {
						authorization: "Bearer " + readToken
					})
				).status
			).toBe(403);
			expect(
				(
					await post(path, payload, {
						authorization: "Bearer " + writeToken
					})
				).status
			).toBe(403);
			expect(
				(
					await post(path, payload, {
						...adminHeaders,
						origin: "https://foreign.example.test"
					})
				).status
			).toBe(403);
			const review = await (
				await fetch(apiBase + "/admin-mail/session-notes/review", {
					headers: adminHeaders
				})
			).json();
			expect(review.operations).toEqual(
				expect.arrayContaining([
					expect.objectContaining({
						operationId: record._id,
						archivalStatus: "review_required"
					})
				])
			);
			const responses = await Promise.all([
				post(path, payload),
				post(path, payload)
			]);
			expect(responses.map(response => response.status)).toEqual([
				200, 200
			]);
			const saved = await SessionNoteSend.findById(record._id);
			expect(saved!.state).toBe("smtp_accepted");
			expect(saved!.archiveState).toBe("archived");
			expect(saved!.dispositions).toHaveLength(1);
			expect(saved!.sentAt).toEqual(
				(await SessionNote.findById(record.noteId))!.delivery!.sentAt
			);
			expect(
				(await post(path, { ...payload, evidenceRef: "b".repeat(64) }))
					.status
			).toBe(409);
			expect(received).toBe(1);
			expect(archive).toHaveBeenCalledTimes(1);
		});
		it("allows a bounded archive-only retry only after audited proof of absence", async () => {
			archive.mockRejectedValueOnce(new NoteArchiveError("unconfirmed"));
			const w = workflow({
				enabled: () => process.env.SESSION_NOTES_SEND_ENABLED === "true"
			});
			const record = await prepare(w);
			await w.dispatch(record._id);
			vi.stubEnv("SESSION_NOTES_SEND_ENABLED", "false");
			const path =
				"/admin-mail/session-notes/operations/" +
				record._id +
				"/disposition";
			const absent = {
				decision: "archive_confirmed_absent",
				evidenceRef: "c".repeat(64),
				idempotencyKey: "archive-absence-synthetic"
			};
			expect((await post(path, absent)).status).toBe(200);
			expect(
				(await SessionNoteSend.findById(record._id))!.archiveState
			).toBe("retry");
			await w.recover();
			expect(archive).toHaveBeenCalledTimes(1);
			vi.stubEnv("SESSION_NOTES_SEND_ENABLED", "true");
			await w.recover();
			expect(archive).toHaveBeenCalledTimes(2);
			expect(received).toBe(1);
			expect(
				(await SessionNoteSend.findById(record._id))!.archiveState
			).toBe("archived");
			await SessionNoteSend.updateOne(
				{ _id: record._id },
				{
					$set: {
						archiveState: "review_required",
						archiveAttempts: 5
					}
				}
			);
			vi.stubEnv("SESSION_NOTES_SEND_ENABLED", "false");
			expect(
				(
					await post(path, {
						...absent,
						idempotencyKey: "archive-max-attempts-synthetic",
						evidenceRef: "d".repeat(64)
					})
				).status
			).toBe(409);
		});
		it("recovers after a process is killed following SMTP acceptance without resending", async () => {
			const w = workflow();
			const record = await prepare(w);
			const path = fileURLToPath(
				new URL(
					"./fixtures/session-note-crash-worker.ts",
					import.meta.url
				)
			);
			const child = spawn(
				process.execPath,
				["--import", "tsx", path, uri, String(port), record._id],
				{ detached: true, stdio: ["ignore", "pipe", "pipe"] }
			);
			console.info(
				JSON.stringify({
					task: "session-note-synthetic-crash",
					cwd: process.cwd(),
					command: "synthetic crash fixture",
					pid: child.pid,
					startedAt: new Date().toISOString()
				})
			);
			const exited = new Promise<void>(resolve =>
				child.once("exit", () => resolve())
			);
			try {
				await new Promise<void>((resolve, reject) => {
					const timer = setTimeout(
						() => reject(new Error("Crash fixture timeout")),
						10_000
					);
					child.stdout!.on("data", chunk => {
						if (
							chunk.toString().includes("synthetic_smtp_accepted")
						) {
							clearTimeout(timer);
							resolve();
						}
					});
					child.once("error", error => {
						clearTimeout(timer);
						reject(error);
					});
				});
				process.kill(-child.pid!, "SIGKILL");
				await exited;
				expect(received).toBe(1);
				expect(
					(await SessionNoteSend.findById(record._id))!.state
				).toBe("sending");
				await SessionNoteSend.updateOne(
					{ _id: record._id },
					{ $set: { claimedAt: new Date(0) } }
				);
				await w.recover();
				await w.dispatch(record._id);
				expect(received).toBe(1);
				expect(
					(await SessionNoteSend.findById(record._id))!.state
				).toBe("delivery_unconfirmed");
			} finally {
				if (child.exitCode === null && child.signalCode === null) {
					process.kill(-child.pid!, "SIGKILL");
					await exited;
				}
				console.info(
					JSON.stringify({
						task: "session-note-synthetic-crash",
						pid: child.pid,
						endedAt: new Date().toISOString(),
						exitCode: child.exitCode,
						signal: child.signalCode,
						cleanup: "process group stopped"
					})
				);
			}
		}, 15_000);
		it("distinguishes save-only records from legacy records without inventing timestamps", () => {
			const row = {
				_id: new Types.ObjectId(),
				sessionDate: new Date(),
				createdAt: new Date(),
				updatedAt: new Date()
			};
			expect(noteVerificationMetadata(row)).toMatchObject({
				evidenceStatus: "legacy_missing_metadata",
				sentAt: null
			});
			expect(
				noteVerificationMetadata({
					...row,
					workflowVersion: 2,
					savedAt: new Date()
				})
			).toMatchObject({ evidenceStatus: "saved_not_sent", sentAt: null });
		});
		const adminHeaders = {
			"x-fixture-admin": "true",
			origin: "http://localhost:3333",
			"content-type": "application/json"
		};
		async function post(
			path: string,
			body: unknown,
			headers = adminHeaders
		) {
			return fetch(apiBase + path, {
				method: "POST",
				headers,
				body: JSON.stringify(body)
			});
		}
		function externalPayload(extra = {}) {
			return {
				studentId: String(studentID),
				scheduledSessionId: String(sessionID),
				classDate: "2026-09-18",
				source: "mac_sent_item",
				evidenceType: "observed_sent_item",
				observedSendAt: "2026-09-20T01:00:00Z",
				evidenceRef: "a".repeat(64),
				idempotencyKey: "external-synthetic-key",
				...extra
			};
		}
		it("registers external metadata idempotently without SMTP or note content", async () => {
			const headers = {
				authorization: "Bearer " + writeToken,
				"content-type": "application/json"
			};
			const [first, retry] = await Promise.all([
				post("/session-notes/evidence", externalPayload(), headers),
				post("/session-notes/evidence", externalPayload(), headers)
			]);
			expect([first.status, retry.status].sort()).toEqual([201, 201]);
			expect((await first.json()).recordId).toBe(
				(await retry.json()).recordId
			);
			const response = await fetch(
				apiBase +
					"/verify?studentId=" +
					studentID +
					"&from=2026-09-01&to=2026-09-30",
				{ headers: { authorization: "Bearer " + readToken } }
			);
			const body = await response.json();
			expect(body.records[0]).toMatchObject({
				evidenceStatus: "external_observed",
				sentAt: null,
				externalSentAt: "2026-09-20T01:00:00.000Z",
				scheduledSessionId: String(sessionID),
				actualSessionStartAt: "2026-09-19T01:00:00.000Z"
			});
			expect(JSON.stringify(body)).not.toMatch(
				/student@example|subject|markdown|evidenceRef|externalEventId/
			);
			expect(received).toBe(0);
		});
		it.each([
			{ subject: "private" },
			{ recipients: ["private@example.test"] },
			{ source: "site_smtp" },
			{ observedSendAt: "2099-01-01T00:00:00Z" },
			{ scheduledSessionId: new Types.ObjectId().toString() }
		])("rejects invalid or foreign external metadata %j", async extra => {
			const response = await post(
				"/session-notes/evidence",
				externalPayload(extra),
				{
					authorization: "Bearer " + writeToken,
					"content-type": "application/json"
				}
			);
			expect([400, 409]).toContain(response.status);
			expect(received).toBe(0);
		});
		it("rejects read-token mutations, expired/insufficient scopes, and cross-site administrator writes", async () => {
			expect(
				(
					await post("/session-notes/evidence", externalPayload(), {
						authorization: "Bearer " + readToken,
						"content-type": "application/json",
						origin: "http://localhost:3333"
					})
				).status
			).toBe(401);
			expect(
				(
					await post("/session-notes/evidence", externalPayload(), {
						...adminHeaders,
						origin: "https://attacker.example"
					})
				).status
			).toBe(403);
			expect(
				(
					await post("/session-notes/evidence", externalPayload(), {
						...adminHeaders,
						origin: ""
					})
				).status
			).toBe(403);
			vi.stubEnv("SESSION_NOTES_EVIDENCE_SCOPE", "admin");
			expect(
				(
					await post("/session-notes/evidence", externalPayload(), {
						authorization: "Bearer " + writeToken,
						"content-type": "application/json",
						origin: "http://localhost:3333"
					})
				).status
			).toBe(401);
			vi.stubEnv("SESSION_NOTES_EVIDENCE_SCOPE", "register");
			expect(
				(
					await post(
						"/session-notes/evidence",
						externalPayload({
							studentId: new Types.ObjectId().toString()
						}),
						{
							authorization: "Bearer " + writeToken,
							"content-type": "application/json"
						}
					)
				).status
			).toBe(403);
			expect(received).toBe(0);
		});
		it("preserves coverage on empty and every paginated mixed-evidence response", async () => {
			const headers = { authorization: "Bearer " + readToken };
			let page = await (
				await fetch(
					apiBase +
						"/verify?studentId=" +
						studentID +
						"&from=2026-09-01&to=2026-09-30&limit=1",
					{ headers }
				)
			).json();
			expect(page).toMatchObject({
				schemaVersion: 2,
				coverage: "site_records_only",
				coverageSince: null,
				records: []
			});
			await post("/session-notes/evidence", externalPayload());
			await post("/users/" + studentID + "/session-notes", {
				sessionDate: "2026-09-18",
				scheduledSessionId: String(sessionID),
				markdown: "Synthetic saved-only notes"
			});
			const ids = new Set();
			let cursor = "";
			do {
				page = await (
					await fetch(
						apiBase +
							"/verify?studentId=" +
							studentID +
							"&from=2026-09-01&to=2026-09-30&limit=1" +
							cursor,
						{ headers }
					)
				).json();
				expect(page.schemaVersion).toBe(2);
				expect(page.coverageDetails.completeHistoricalCoverage).toBe(
					false
				);
				expect(page.statusMeaning).toContain("incomplete evidence");
				for (const row of page.records) {
					expect(ids.has(row.recordId)).toBe(false);
					ids.add(row.recordId);
				}
				cursor = page.nextCursor ? "&cursor=" + page.nextCursor : "";
			} while (cursor);
			expect(ids.size).toBe(2);
			expect(received).toBe(0);
		});
		it("saves then sends exactly that version with explicit session identity and retains safe operation status", async () => {
			const saved = await (
				await post("/users/" + studentID + "/session-notes", {
					sessionDate: "2026-09-18",
					scheduledSessionId: String(sessionID),
					markdown: "Synthetic exact notes",
					subject: "Synthetic class"
				})
			).json();
			const body = {
				to: "student@example.test",
				md: "Synthetic exact notes",
				subject: "Synthetic class",
				sessionDate: "2026-09-18",
				studentId: String(studentID),
				scheduledSessionId: String(sessionID),
				noteId: saved.sessionNote._id,
				idempotencyKey: "synthetic-http-send-key"
			};
			const [one, two] = await Promise.all([
				post("/admin-mail/send", body),
				post("/admin-mail/send", body)
			]);
			expect([200, 202]).toContain(one.status);
			expect([200, 202]).toContain(two.status);
			const first = await one.json();
			const second = await two.json();
			expect(first.operationId).toBe(second.operationId);
			expect(received).toBe(1);
			expect(await SessionNote.countDocuments()).toBe(1);
			expect(
				(await post("/admin-mail/send", { ...body, md: "different" }))
					.status
			).toBe(409);
			expect((await post("/admin-mail/send", body)).status).toBe(200);
			expect(received).toBe(1);
			const status = await (
				await fetch(
					apiBase +
						"/admin-mail/session-notes/operations/" +
						first.operationId,
					{ headers: adminHeaders }
				)
			).json();
			expect(status.evidenceStatus).toBe("smtp_accepted");
			expect(JSON.stringify(status)).not.toMatch(
				/example.test|messageId|subject|markdown/
			);
		});

		it("rehearses the index-only migration with a verified synthetic backup and preserves every record", async () => {
			const snapshot = note();
			await SessionNote.create({
				...snapshot,
				delivery: {
					source: "site_smtp",
					status: "smtp_accepted",
					sentAt: new Date("2026-09-20T00:00:00Z")
				}
			});
			const archivePath = join(dbPath, "synthetic-backup.json");
			const backupBytes = JSON.stringify(
				await SessionNote.find({}).lean()
			);
			await writeFile(archivePath, backupBytes, { mode: 0o600 });
			const manifest = join(dbPath, "synthetic-backup-manifest.json");
			await writeFile(
				manifest,
				JSON.stringify({
					backupVerified: true,
					archivePath,
					sha256: createHash("sha256")
						.update(backupBytes)
						.digest("hex")
				}),
				{ mode: 0o600 }
			);
			const path = fileURLToPath(
				new URL(
					"../src/maintenance/sessionNoteIndexes.ts",
					import.meta.url
				)
			);
			const child = spawn(
				process.execPath,
				["--import", "tsx", path, "--apply", "--rehearsal"],
				{
					env: {
						...process.env,
						SESSION_NOTE_MIGRATION_URI: uri,
						SESSION_NOTES_SEND_ENABLED: "false",
						SESSION_NOTE_BACKUP_MANIFEST: manifest
					},
					stdio: ["ignore", "pipe", "pipe"]
				}
			);
			let output = "";
			child.stdout!.on("data", chunk => {
				output += chunk.toString();
			});
			const code = await new Promise<number | null>(resolve =>
				child.once("exit", resolve)
			);
			expect(code).toBe(0);
			expect(JSON.parse(output)).toMatchObject({
				applied: true,
				rehearsal: true,
				mailDisabled: true
			});
			expect(JSON.stringify(await SessionNote.find({}).lean())).toBe(
				backupBytes
			);
			expect(received).toBe(0);
		});
		it("requires audited correction of an unlinked note and never uses a class date as session identity", async () => {
			const response = await post(
				"/users/" + studentID + "/session-notes",
				{
					sessionDate: "2026-09-18",
					markdown: "Synthetic unlinked notes",
					unlinked: true
				}
			);
			const saved = (await response.json()).sessionNote;
			expect(
				(
					await post(
						"/admin-mail/session-notes/" +
							saved._id +
							"/association",
						{
							studentId: String(studentID),
							scheduledSessionId: new Types.ObjectId().toString(),
							idempotencyKey: "association-synthetic-key"
						}
					)
				).status
			).toBe(409);
			const payload = {
				studentId: String(studentID),
				scheduledSessionId: String(sessionID),
				idempotencyKey: "association-synthetic-key"
			};
			expect(
				(
					await post(
						"/admin-mail/session-notes/" +
							saved._id +
							"/association",
						payload
					)
				).status
			).toBe(200);
			expect(
				(
					await post(
						"/admin-mail/session-notes/" +
							saved._id +
							"/association",
						payload
					)
				).status
			).toBe(200);
			const note = await SessionNote.findById(saved._id);
			expect(note!.associationCorrections).toHaveLength(1);
			const row = noteVerificationMetadata(note!.toObject());
			expect(row).toMatchObject({
				classDate: "2026-09-18",
				actualSessionStartAt: "2026-09-19T01:00:00.000Z",
				associationStatus: "verified_session",
				sentAt: null
			});
			expect(received).toBe(0);
		});
		it("retains schedule changes and refuses to dispatch an outdated session snapshot", async () => {
			const { ScheduledSession } =
				await import("../src/models/schemas/ScheduledSession.js");
			const saved = await (
				await post("/users/" + studentID + "/session-notes", {
					sessionDate: "2026-09-18",
					scheduledSessionId: String(sessionID),
					markdown: "Synthetic notes",
					subject: "Synthetic"
				})
			).json();
			const response = await fetch(
				apiBase + "/users/" + studentID + "/schedule/" + sessionID,
				{
					method: "PUT",
					headers: adminHeaders,
					body: JSON.stringify({
						startAt: "2026-09-20T01:00:00Z",
						endAt: "2026-09-20T02:00:00Z"
					})
				}
			);
			expect(response.status).toBe(200);
			const session = await ScheduledSession.findById(sessionID);
			expect(session!.scheduleRevision).toBe(1);
			expect(session!.scheduleHistory).toHaveLength(1);
			expect(
				session!.scheduleHistory![0].previous.startAt.toISOString()
			).toBe("2026-09-19T01:00:00.000Z");
			// An explicit saved version records the old occurrence. No nearest-date substitution is permitted.
			const result = await post("/admin-mail/send", {
				to: "student@example.test",
				md: "Synthetic notes",
				subject: "Synthetic",
				sessionDate: "2026-09-18",
				studentId: String(studentID),
				scheduledSessionId: String(sessionID),
				noteId: saved.sessionNote._id,
				idempotencyKey: "reschedule-synthetic-key"
			});
			expect([202, 409]).toContain(result.status);
			expect(received).toBe(0);
		});

		it("keeps midnight and DST occurrences distinct even with the same class-date label", async () => {
			const { ScheduledSession } =
				await import("../src/models/schemas/ScheduledSession.js");
			const first = await ScheduledSession.create({
				user: studentID,
				title: "Synthetic DST first",
				startAt: new Date("2026-11-01T05:30:00Z"),
				endAt: new Date("2026-11-01T06:00:00Z"),
				timezone: "America/New_York"
			});
			const second = await ScheduledSession.create({
				user: studentID,
				title: "Synthetic DST second",
				startAt: new Date("2026-11-01T06:30:00Z"),
				endAt: new Date("2026-11-01T07:00:00Z"),
				timezone: "America/New_York"
			});
			for (const session of [first, second]) {
				const response = await post(
					"/users/" + studentID + "/session-notes",
					{
						sessionDate: "2026-11-01",
						scheduledSessionId: String(session._id),
						markdown: "Synthetic occurrence"
					}
				);
				expect(response.status).toBe(201);
				const row = noteVerificationMetadata(
					(await SessionNote.findById(
						(await response.json()).sessionNote._id
					))!.toObject()
				);
				expect(row.scheduledSessionId).toBe(String(session._id));
				expect(row.actualSessionStartAt).toBe(
					session.startAt.toISOString()
				);
				expect(row.sessionTimezone).toBe("America/New_York");
			}
			expect(received).toBe(0);
		});
		it("requires child identity for shared parent mailboxes and rejects duplicate-name queries", async () => {
			const { User } = await import("../src/models/schemas/User.js");
			const { resolveNoteIdentity } =
				await import("../src/utils/sessionNoteIdentity.js");
			const other = new Types.ObjectId();
			await User.collection.insertOne({
				_id: other,
				name: "Synthetic Student",
				email: "other@example.test",
				tutors: [],
				recipientNameKey: "other child"
			});
			vi.stubEnv(
				"ADMIN_MAIL_RECIPIENTS_JSON",
				JSON.stringify([
					{
						name: "synthetic student",
						emails: ["parent@example.test"]
					},
					{ name: "other child", emails: ["parent@example.test"] }
				])
			);
			const req = { currentAdmin: { _id: adminID } } as any;
			const selected = await resolveNoteIdentity(req, {
				studentId: String(studentID),
				scheduledSessionId: String(sessionID),
				primaryEmail: "parent@example.test",
				recipientName: "synthetic student"
			});
			expect(String(selected.student._id)).toBe(String(studentID));
			await expect(
				resolveNoteIdentity(req, {
					studentId: String(studentID),
					unlinked: true,
					primaryEmail: "parent@example.test",
					recipientName: "other child"
				})
			).rejects.toMatchObject({ code: "recipient_identity_conflict" });
			await expect(
				resolveNoteIdentity(req, {
					studentId: String(other),
					scheduledSessionId: String(sessionID),
					primaryEmail: "parent@example.test",
					recipientName: "other child"
				})
			).rejects.toMatchObject({ code: "session_identity_conflict" });
			const response = await fetch(
				apiBase +
					"/verify?studentName=Synthetic%20Student&from=2026-09-01&to=2026-09-30",
				{ headers: { authorization: "Bearer " + readToken } }
			);
			expect(response.status).toBe(409);
			expect(received).toBe(0);
			vi.stubEnv("ADMIN_MAIL_RECIPIENTS_JSON", "[]");
		});
		it("signals stale queued work once while paused and never sends or archives", async () => {
			const w = workflow({ enabled: () => false });
			const intent = await prepare(w);
			await SessionNoteSend.collection.updateOne(
				{ _id: intent._id },
				{ $set: { createdAt: new Date(Date.now() - 400_000) } }
			);
			await w.recover();
			await w.recover();
			expect(
				event.mock.calls.filter(call => call[1] === "queued_send_stale")
			).toHaveLength(1);
			expect((await mongoNoteSendStore.get(intent._id))!.state).toBe(
				"queued"
			);
			expect(received).toBe(0);
			expect(archive).not.toHaveBeenCalled();
		});
		it("does not route a partial note request into ordinary non-durable mail", async () => {
			const response = await post("/admin-mail/send", {
				to: "student@example.test",
				subject: "Synthetic",
				md: "Synthetic notes",
				studentId: String(studentID),
				noteId: new Types.ObjectId().toString(),
				idempotencyKey: "missing-date-synthetic"
			});
			expect(response.status).toBe(400);
			expect(received).toBe(0);
		});
		it("normalizes mixed-case and repeated CC addresses across save and send", async () => {
			const saved = await (
				await post("/users/" + studentID + "/session-notes", {
					sessionDate: "2026-09-18",
					scheduledSessionId: String(sessionID),
					markdown: "Synthetic CC",
					subject: "Synthetic",
					ccEmails: ["PARENT@example.test", "parent@example.test"]
				})
			).json();
			const response = await post("/admin-mail/send", {
				to: "student@example.test,PARENT@example.test,parent@example.test",
				md: "Synthetic CC",
				subject: "Synthetic",
				sessionDate: "2026-09-18",
				studentId: String(studentID),
				scheduledSessionId: String(sessionID),
				noteId: saved.sessionNote._id,
				idempotencyKey: "canonical-cc-synthetic"
			});
			expect(response.status).toBe(200);
			expect(received).toBe(1);
			expect(
				(await SessionNote.findById(saved.sessionNote._id))!.ccEmails
			).toEqual(["parent@example.test"]);
		});
		it("revalidates a revoked guardian mapping before queued dispatch", async () => {
			vi.stubEnv(
				"ADMIN_MAIL_RECIPIENTS_JSON",
				JSON.stringify([
					{
						name: "synthetic student",
						emails: ["parent@example.test"]
					}
				])
			);
			vi.stubEnv("SESSION_NOTES_SEND_ENABLED", "false");
			const saved = await (
				await post("/users/" + studentID + "/session-notes", {
					sessionDate: "2026-09-18",
					scheduledSessionId: String(sessionID),
					markdown: "Synthetic guardian",
					subject: "Synthetic",
					primaryEmail: "parent@example.test"
				})
			).json();
			const body = {
				to: "parent@example.test",
				md: "Synthetic guardian",
				subject: "Synthetic",
				sessionDate: "2026-09-18",
				studentId: String(studentID),
				scheduledSessionId: String(sessionID),
				noteId: saved.sessionNote._id,
				idempotencyKey: "guardian-revoked-synthetic"
			};
			expect((await post("/admin-mail/send", body)).status).toBe(202);
			vi.stubEnv("ADMIN_MAIL_RECIPIENTS_JSON", "[]");
			vi.stubEnv("SESSION_NOTES_SEND_ENABLED", "true");
			const response = await post("/admin-mail/send", body);
			expect((await response.json()).evidenceStatus).toBe("send_failed");
			expect(received).toBe(0);
		});
		it("fences account removal against active writers and refuses writes after removal", async () => {
			const { withSessionNoteWriter, fenceSessionNoteAccountRemoval } =
				await import("../src/services/sessionNoteWriteFence.js");
			const { User } = await import("../src/models/schemas/User.js");
			let finish!: () => void;
			const pending = withSessionNoteWriter(
				String(studentID),
				async () =>
					new Promise<void>(resolve => {
						finish = resolve;
					})
			);
			await vi.waitFor(() => expect(finish).toBeTypeOf("function"));
			await expect(
				fenceSessionNoteAccountRemoval(
					String(studentID),
					undefined as any
				)
			).rejects.toMatchObject({
				code: "session_note_writers_require_review_before_removal"
			});
			finish();
			await pending;
			await fenceSessionNoteAccountRemoval(
				String(studentID),
				undefined as any
			);
			await User.deleteOne({ _id: studentID });
			const write = vi.fn();
			await expect(
				withSessionNoteWriter(String(studentID), write)
			).rejects.toMatchObject({
				code: "student_missing_removing_or_writer_limit"
			});
			expect(write).not.toHaveBeenCalled();
			expect(received).toBe(0);
		});
		it("offers an audited retry only after proven nonacceptance", async () => {
			const saved = await (
				await post("/users/" + studentID + "/session-notes", {
					sessionDate: "2026-09-18",
					scheduledSessionId: String(sessionID),
					markdown: "Synthetic retry",
					subject: "Synthetic"
				})
			).json();
			const body = {
				to: "student@example.test",
				md: "Synthetic retry",
				subject: "Synthetic",
				sessionDate: "2026-09-18",
				studentId: String(studentID),
				scheduledSessionId: String(sessionID),
				noteId: saved.sessionNote._id,
				idempotencyKey: "nonaccepted-retry-synthetic"
			};
			ccOnly = true;
			const initial = await (await post("/admin-mail/send", body)).json();
			expect(initial.evidenceStatus).toBe("smtp_rejected");
			expect(received).toBe(0);
			const disposition = {
				decision: "retry_nonaccepted",
				evidenceRef: "c".repeat(64),
				idempotencyKey: "audited-retry-synthetic"
			};
			expect(
				(
					await post(
						"/admin-mail/session-notes/operations/" +
							initial.operationId +
							"/disposition",
						disposition
					)
				).status
			).toBe(200);
			ccOnly = false;
			expect((await post("/admin-mail/send", body)).status).toBe(200);
			expect(received).toBe(1);
			const current = await mongoNoteSendStore.get(initial.operationId);
			expect(current!.attempts).toHaveLength(2);
			expect(current!.dispositions).toHaveLength(1);
			const ambiguous = await prepare();
			await SessionNoteSend.updateOne(
				{ _id: ambiguous._id },
				{ $set: { state: "delivery_unconfirmed" } }
			);
			expect(
				(
					await post(
						"/admin-mail/session-notes/operations/" +
							ambiguous._id +
							"/disposition",
						{
							...disposition,
							idempotencyKey: "ambiguous-retry-synthetic"
						}
					)
				).status
			).toBe(409);
			expect(received).toBe(1);
		});
		it("registers evidence against the corrected association and retains uppercase ID query coverage", async () => {
			const { ScheduledSession } =
				await import("../src/models/schemas/ScheduledSession.js");
			const replacement = await ScheduledSession.create({
				user: studentID,
				title: "Synthetic corrected",
				startAt: new Date("2026-09-22T01:00:00Z"),
				endAt: new Date("2026-09-22T02:00:00Z"),
				timezone: "UTC"
			});
			const saved = await (
				await post("/users/" + studentID + "/session-notes", {
					sessionDate: "2026-09-18",
					scheduledSessionId: String(sessionID),
					markdown: "Synthetic correction"
				})
			).json();
			expect(
				(
					await post(
						"/admin-mail/session-notes/" +
							saved.sessionNote._id +
							"/association",
						{
							studentId: String(studentID),
							scheduledSessionId: String(replacement._id),
							idempotencyKey: "corrected-note-synthetic"
						}
					)
				).status
			).toBe(200);
			const evidence = {
				studentId: String(studentID),
				scheduledSessionId: String(replacement._id),
				noteId: saved.sessionNote._id,
				classDate: "2026-09-18",
				source: "mac_sent_item",
				evidenceType: "observed_sent_item",
				observedSendAt: "2026-09-22T03:00:00Z",
				evidenceRef: "e".repeat(64),
				idempotencyKey: "corrected-evidence-synthetic"
			};
			const headers = {
				authorization: "Bearer " + writeToken,
				"content-type": "application/json"
			};
			expect(
				(await post("/session-notes/evidence", evidence, headers))
					.status
			).toBe(201);
			expect(
				(
					await post(
						"/session-notes/evidence",
						{
							...evidence,
							scheduledSessionId: String(sessionID),
							evidenceRef: "d".repeat(64),
							idempotencyKey: "wrong-old-evidence-synthetic"
						},
						headers
					)
				).status
			).toBe(409);
			const result = await (
				await fetch(
					apiBase +
						"/verify?studentId=" +
						String(studentID).toUpperCase() +
						"&from=2026-09-01&to=2026-09-30",
					{ headers: { authorization: "Bearer " + readToken } }
				)
			).json();
			expect(result.records).toHaveLength(2);
			expect(
				result.records.some(
					(r: any) => r.evidenceStatus === "external_observed"
				)
			).toBe(true);
			expect(received).toBe(0);
		});
		it("cannot bypass an unresolved intent by changing the saved version", async () => {
			const w = workflow();
			const first = await prepare(w);
			await SessionNoteSend.updateOne(
				{ _id: first._id },
				{ $set: { state: "delivery_unconfirmed" } }
			);
			const changed = {
				...first.note,
				subject: "Changed synthetic version"
			};
			await expect(
				w.prepare({
					actorId: first.actorId,
					keyHash: metadataHash("new-key-synthetic"),
					payloadHash: metadataHash(changed),
					noteId: first.noteId,
					note: changed
				})
			).rejects.toMatchObject({ code: "idempotency_payload_conflict" });
			expect(
				await SessionNoteSend.countDocuments({ noteId: first.noteId })
			).toBe(1);
			await w.recover();
			expect(received).toBe(0);
		});
		it("requires paused recovery and audited stopped-process evidence to clear orphan writers", async () => {
			const { User } = await import("../src/models/schemas/User.js");
			const { withSessionNoteWriter } =
				await import("../src/services/sessionNoteWriteFence.js");
			const id = randomUUID();
			await User.collection.updateOne({ _id: studentID }, {
				$push: {
					noteWorkflowWriters: {
						id,
						at: new Date(Date.now() - 180_000)
					}
				}
			} as any);
			const path =
				"/admin-mail/session-notes/students/" +
				studentID +
				"/writer-disposition";
			const payload = {
				writerId: id,
				decision: "confirmed_process_stopped",
				evidenceRef: "a".repeat(64),
				idempotencyKey: "orphan-writer-synthetic"
			};
			expect((await post(path, payload)).status).toBe(409);
			vi.stubEnv("SESSION_NOTES_SEND_ENABLED", "false");
			expect(
				(
					await post(path, payload, {
						authorization: "Bearer " + readToken
					})
				).status
			).toBe(403);
			const review = await (
				await fetch(apiBase + "/admin-mail/session-notes/review", {
					headers: adminHeaders
				})
			).json();
			expect(review.writerMarkers).toEqual([
				{
					studentId: String(studentID),
					writerId: id,
					startedAt: expect.any(String),
					active: false
				}
			]);
			const responses = await Promise.all([
				post(path, payload),
				post(path, payload)
			]);
			expect(responses.map(r => r.status)).toEqual([200, 200]);
			const user = await User.findById(studentID).select(
				"+noteWorkflowWriters +noteWorkflowWriterDispositions"
			);
			expect(user!.noteWorkflowWriters).toHaveLength(0);
			expect(user!.noteWorkflowWriterDispositions).toHaveLength(1);
			expect(
				(await post(path, { ...payload, evidenceRef: "b".repeat(64) }))
					.status
			).toBe(409);
			await withSessionNoteWriter(String(studentID), async () => {
				const current = await User.findById(studentID).select(
					"+noteWorkflowWriters"
				);
				expect(
					(
						await post(path, {
							...payload,
							writerId: current!.noteWorkflowWriters![0].id,
							idempotencyKey: "active-writer-synthetic"
						})
					).status
				).toBe(409);
			});
			expect(received).toBe(0);
		});
		it("preserves withdrawn external evidence and honest retry acknowledgments", async () => {
			const first = await (
				await post("/session-notes/evidence", externalPayload())
			).json();
			const correction = externalPayload({
				replaces: first.recordId,
				correctionReason: "withdrawn",
				evidenceRef: "f".repeat(64),
				idempotencyKey: "withdrawn-correction-synthetic"
			});
			const result = await post("/session-notes/evidence", correction);
			expect(result.status).toBe(201);
			expect((await result.json()).evidenceStatus).toBe(
				"external_withdrawn"
			);
			expect(
				(
					await (
						await post("/session-notes/evidence", correction)
					).json()
				).evidenceStatus
			).toBe("external_withdrawn");
			const response = await fetch(
				apiBase +
					"/verify?studentId=" +
					studentID +
					"&from=2026-09-01&to=2026-09-30",
				{ headers: { authorization: "Bearer " + readToken } }
			);
			const rows = (await response.json()).records;
			expect(rows.map((r: any) => r.evidenceStatus).sort()).toEqual([
				"external_superseded",
				"external_withdrawn"
			]);
			expect(
				rows.find((r: any) => r.recordId === first.recordId)
					.supersededByRecordId
			).toBeTruthy();
			expect(received).toBe(0);
		});
	}
);
