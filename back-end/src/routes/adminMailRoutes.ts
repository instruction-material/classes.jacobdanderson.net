import type { SendMailOptions } from "nodemailer";
import type { SentMessageInfo as SMTPSentMessageInfo } from "nodemailer/lib/smtp-transport/index.js";
import type { SessionNoteDelivery } from "../types/entities/ISessionNote.js";
import { Buffer } from "node:buffer";
import { randomUUID } from "node:crypto";
import { existsSync, readFileSync, statSync } from "node:fs";
import { env } from "node:process";
import { Router } from "express";
import { ImapFlow } from "imapflow";
import nodemailer from "nodemailer";
import { z } from "zod";
import { validAdmin } from "../middleware/auth.js";
import { Admin } from "../models/schemas/Admin.js";
import { InternalEmail } from "../models/schemas/InternalEmail.js";
import { ScheduledSession } from "../models/schemas/ScheduledSession.js";
import { SessionNote } from "../models/schemas/SessionNote.js";
import { SessionNoteEvidence } from "../models/schemas/SessionNoteEvidence.js";
import { SessionNoteSend } from "../models/schemas/SessionNoteSend.js";
import { User } from "../models/schemas/User.js";
import { classifySmtpFailure, createNoteSendWorkflow, ensureNoteWorkflowIndexes, mongoNoteSendStore, noteAssociationMatches, noteOperationalEvent, safeOperation } from "../services/sessionNoteSending.js";
import { noteWriterIsActive, withSessionNoteWriter } from "../services/sessionNoteWriteFence.js";
import { loadAdminRecipients } from "../utils/adminRecipients.js";
import { renderMarkdownEmailHtml } from "../utils/markdownEmail.js";
import { archiveDestination, confirmedArchiveAppend, NoteArchiveError } from "../utils/sessionNoteArchive.js";
import { sessionNoteDeliveryFromSend } from "../utils/sessionNoteDelivery.js";
import { metadataHash, normalizeNoteEmails, noteObjectId, NoteWorkflowError, resolveNoteIdentity } from "../utils/sessionNoteIdentity.js";

import { externalEvidenceStatus } from "../utils/sessionNoteVerificationMetadata.js";

const router = Router();
router.use((_req, res, next) => {
	res.set("Cache-Control", "no-store");
	next();
});
const DATE_PREFIX_RE = /^(\d{4})-(\d{2})-(\d{2})/;
const DEFAULT_PRIMARY_FROM_ADDR = "classes@example.com";
const DEFAULT_FALLBACK_FROM_ADDR = "classes@example.com";
const DEFAULT_PRIMARY_TRANSPORT_HOST = "127.0.0.1";
const DEFAULT_PRIMARY_TRANSPORT_PORT = 25;
const DEFAULT_PRIMARY_TRANSPORT_SERVERNAME = "mail.example.com";
const DEFAULT_FALLBACK_TRANSPORT_HOST = "smtp.gmail.com";
const DEFAULT_FALLBACK_TRANSPORT_PORT = 587;
const DEFAULT_FALLBACK_TRANSPORT_SERVERNAME = "smtp.gmail.com";
const DEFAULT_IMAP_APPEND_HOST = "mail.example.com";
const DEFAULT_IMAP_APPEND_PORT = 993;
const DEFAULT_IMAP_APPEND_USER = "classes@example.com";
const DEFAULT_IMAP_SENT_MAILBOX = "Sent Messages";
const PRIMARY_FROM_ADDR = env.MDMAIL_PRIMARY_FROM
	|| env.MDMAIL_FROM_PRIMARY
	|| env.MDMAIL_FROM
	|| DEFAULT_PRIMARY_FROM_ADDR;
const FALLBACK_FROM_ADDR = env.MDMAIL_FALLBACK_FROM
	|| env.MDMAIL_FROM_FALLBACK
	|| DEFAULT_FALLBACK_FROM_ADDR;
const PRIMARY_TRANSPORT_HOST = env.SMTP_PRIMARY_HOST
	|| env.SMTP_HOST
	|| DEFAULT_PRIMARY_TRANSPORT_HOST;
const PRIMARY_TRANSPORT_PORT = Number(
	env.SMTP_PRIMARY_PORT
	|| env.SMTP_PORT
	|| DEFAULT_PRIMARY_TRANSPORT_PORT
);
const PRIMARY_TRANSPORT_SECURE = String(
	env.SMTP_PRIMARY_SECURE
	|| env.SMTP_SECURE
	|| "false"
).toLowerCase() === "true";
const PRIMARY_TRANSPORT_SERVERNAME = env.SMTP_PRIMARY_SERVERNAME
	|| env.SMTP_SERVERNAME
	|| DEFAULT_PRIMARY_TRANSPORT_SERVERNAME;
const PRIMARY_TRANSPORT_CA_FILE = env.SMTP_PRIMARY_CA_FILE
	|| env.SMTP_CA_FILE;
const FALLBACK_TRANSPORT_HOST = env.SMTP_FALLBACK_HOST
	|| DEFAULT_FALLBACK_TRANSPORT_HOST;
const FALLBACK_TRANSPORT_PORT = Number(
	env.SMTP_FALLBACK_PORT || DEFAULT_FALLBACK_TRANSPORT_PORT
);
const FALLBACK_TRANSPORT_SECURE = String(
	env.SMTP_FALLBACK_SECURE || "false"
).toLowerCase() === "true";
const FALLBACK_TRANSPORT_SERVERNAME = env.SMTP_FALLBACK_SERVERNAME
	|| DEFAULT_FALLBACK_TRANSPORT_SERVERNAME;
const FALLBACK_TRANSPORT_USER = env.SMTP_FALLBACK_USER
	|| env.SMTP_USER;
const FALLBACK_TRANSPORT_PASS = env.SMTP_FALLBACK_PASS
	|| env.SMTP_PASS;
const FALLBACK_TRANSPORT_CA_FILE = env.SMTP_FALLBACK_CA_FILE
	|| env.SMTP_CA_FILE;
const IMAP_APPEND_HOST = env.IMAP_APPEND_HOST || DEFAULT_IMAP_APPEND_HOST;
const IMAP_APPEND_PORT = Number(
	env.IMAP_APPEND_PORT || DEFAULT_IMAP_APPEND_PORT
);
const IMAP_APPEND_SECURE = String(
	env.IMAP_APPEND_SECURE || "true"
).toLowerCase() !== "false";
const IMAP_APPEND_USER = env.IMAP_APPEND_USER || DEFAULT_IMAP_APPEND_USER;
const IMAP_APPEND_PASS = env.IMAP_APPEND_PASS || "";
const IMAP_APPEND_SERVERNAME = env.IMAP_APPEND_SERVERNAME || IMAP_APPEND_HOST;
const IMAP_SENT_MAILBOX = env.IMAP_SENT_MAILBOX || DEFAULT_IMAP_SENT_MAILBOX;
const ALLOW_TO = (env.MDMAIL_ALLOW_TO || "").split(",").filter(Boolean);
const MAX_MD_LEN = Number(env.MDMAIL_MAX_MD_LEN || 200_000);

const MailSchema = z.object({
	to: z.string().trim().min(1).max(5000),
	subject: z.string().trim().min(1).max(200),
	md: z.string().min(1),
	recipientName: z.string().trim().min(1).optional(),
	sessionDate: z.string().trim().optional(),
	studentId: noteObjectId.optional(),
	scheduledSessionId: noteObjectId.optional(),
	noteId: noteObjectId.optional(),
	unlinked: z.boolean().optional(),
	idempotencyKey: z.string().regex(/^[\w-]{16,128}$/).optional()
});

router.get("/recipients", validAdmin, (_req, res) => {
	try {
		return res.json({
			recipients: loadAdminRecipients()
		});
	}
	catch {
		console.warn("admin_mail_recipients_unavailable");
		return res.status(500).json({
			message: "Admin recipient configuration is unavailable."
		});
	}
});

function parseDateOnly(dateStr: string): Date | null {
	// Accept ISO strings (from toISOString) or raw yyyy-mm-dd
	const normalized = dateStr.includes("T") ? dateStr : `${dateStr}T00:00:00.000Z`;
	const match = normalized.match(DATE_PREFIX_RE);
	if (!match) return null;
	const [, yearStr, monthStr, dayStr] = match;
	const year = Number(yearStr);
	const month = Number(monthStr);
	const day = Number(dayStr);
	if (!year || !month || !day) return null;
	// store at UTC noon to avoid TZ-related off-by-one when read in other zones
	const dt = new Date(Date.UTC(year, month - 1, day, 12));
	return Number.isNaN(dt.getTime()) || dt.getUTCFullYear() !== year || dt.getUTCMonth() !== month - 1 || dt.getUTCDate() !== day ? null : dt;
}

type SendMailInfo = SMTPSentMessageInfo;

interface MailBase {
	date: Date;
	to: string;
	cc: string[];
	subject: string;
	text: string;
	html: string;
}

type TransportKind = "primary-local" | "fallback-gmail";

interface MailSendResult {
	fromUsed: string;
	info: SendMailInfo;
	transportUsed: TransportKind;
	usedSenderFallback: boolean;
}

interface MatchedUserAccount {
	_id: string;
	name: string;
	email: string;
}

interface SavedAssociationSummary {
	sessionNoteSavedFor: MatchedUserAccount | null;
	internalEmailsSavedFor: MatchedUserAccount[];
}

interface RecentSessionNoteRecord {
	studentId?: string | null;
	scheduledSessionId?: string | null;
	_id: string;
	studentName: string;
	primaryEmail: string;
	ccEmails: string[];
	subject: string;
	sessionDate: Date;
	markdown: string;
	createdAt: Date;
	updatedAt: Date;
}

interface ImapAppendResult {
	appended: boolean;
	mailbox: string;
}

function readOptionalCA(path: string) {
	try {
		if (existsSync(path)) {
			const st = statSync(path);
			if (st.size > 0) return readFileSync(path);
		}
	}
	catch {}
	return undefined;
}

function createMessageId(fromAddress: string): string {
	const domain = fromAddress.split("@")[1] || "localhost";
	return `<${randomUUID()}@${domain}>`;
}

function normalizeEmail(address: string): string {
	return address.trim().toLowerCase();
}

function normalizeRecipientName(value: string): string {
	return value.trim().toLowerCase();
}

async function findMatchedUsersByEmail(
	recipients: string[]
): Promise<Map<string, MatchedUserAccount>> {
	const normalizedRecipients = [...new Set(recipients.map(normalizeEmail))];
	if (normalizedRecipients.length === 0) {
		return new Map();
	}

	const users = await User.find(
		{ email: { $in: normalizedRecipients } },
		{ _id: 1, name: 1, email: 1 }
	).lean();

	return new Map(
		users.map(user => [
			normalizeEmail(user.email),
			{
				_id: String(user._id),
				name: user.name,
				email: normalizeEmail(user.email)
			}
		])
	);
}

async function findMatchedUserByRecipientName(
	recipientName?: string
): Promise<MatchedUserAccount | null> {
	if (!recipientName?.trim()) {
		return null;
	}

	const normalizedRecipientName = normalizeRecipientName(recipientName);
	const user = await User.findOne(
		{
			recipientNameKey: normalizedRecipientName
		},
		{ _id: 1, name: 1, email: 1, recipientName: 1 }
	).lean();

	if (!user) {
		return null;
	}

	return {
		_id: String(user._id),
		name: user.name,
		email: normalizeEmail(user.email)
	};
}

function dedupeMatchedUsers(
	users: Array<MatchedUserAccount | null>
): MatchedUserAccount[] {
	const deduped = new Map<string, MatchedUserAccount>();
	for (const user of users) {
		if (!user) {
			continue;
		}
		deduped.set(user._id, user);
	}
	return [...deduped.values()];
}

function serializeSessionNote(
	note: {
		_id: unknown;
		studentName: string;
		primaryEmail: string;
		ccEmails?: string[];
		subject: string;
		sessionDate: Date;
		markdown: string;
		createdAt: Date;
		updatedAt: Date;
	}
): RecentSessionNoteRecord {
	return {
		_id: String(note._id),
		studentName: note.studentName,
		primaryEmail: note.primaryEmail,
		ccEmails: note.ccEmails ?? [],
		subject: note.subject,
		sessionDate: note.sessionDate,
		markdown: note.markdown,
		createdAt: note.createdAt,
		updatedAt: note.updatedAt,
		studentId: "user" in note ? String(note.user ?? "") : null,
		scheduledSessionId: "scheduledSessionId" in note ? String(note.scheduledSessionId ?? "") : null
	};
}

async function getRecentSessionNotesForTarget(args: {
	associatedUser: MatchedUserAccount | null;
	primaryEmail: string;
}): Promise<RecentSessionNoteRecord[]> {
	const normalizedPrimaryEmail = normalizeEmail(args.primaryEmail);
	const query = args.associatedUser
		? {
				$or: [
					{ user: args.associatedUser._id },
					{
						user: { $exists: false },
						primaryEmail: normalizedPrimaryEmail
					}
				]
			}
		: normalizedPrimaryEmail
			? {
					user: { $exists: false },
					primaryEmail: normalizedPrimaryEmail
				}
			: null;

	if (!query) {
		return [];
	}

	const sessionNotes = await SessionNote.find(query)
		.sort({ sessionDate: -1, createdAt: -1, _id: -1 })
		.limit(3)
		.lean();

	return sessionNotes.map(serializeSessionNote);
}

async function saveAssociatedRecords(
	args: {
		recipients: string[];
		recipientName?: string;
		sessionDate: Date | null;
		subject: string;
		markdown: string;
		html: string;
		fromUsed: string;
		transportUsed: TransportKind;
		messageId: string | undefined;
		sentAt: Date;
		delivery: SessionNoteDelivery;
	}
): Promise<SavedAssociationSummary> {
	const matchesByEmail = await findMatchedUsersByEmail(args.recipients);
	const recipientMappedUser = await findMatchedUserByRecipientName(
		args.recipientName
	);
	const primaryRecipient = normalizeEmail(args.recipients[0] ?? "");
	const primaryUser = matchesByEmail.get(primaryRecipient) ?? null;
	const associatedPrimaryUser = recipientMappedUser ?? primaryUser;

	let sessionNoteSavedFor: MatchedUserAccount | null = null;
	if (args.sessionDate && associatedPrimaryUser) {
		await SessionNote.create({
			user: associatedPrimaryUser._id,
			studentName:
				args.recipientName
				|| associatedPrimaryUser.name
				|| associatedPrimaryUser.email,
			primaryEmail: primaryRecipient,
			ccEmails: args.recipients.slice(1).map(normalizeEmail),
			subject: args.subject,
			sessionDate: args.sessionDate,
			delivery: args.delivery,
			markdown: args.markdown,
			html: args.html
		});
		sessionNoteSavedFor = associatedPrimaryUser;
	}
	else if (args.sessionDate) {
		await SessionNote.create({
			studentName: args.recipientName || primaryRecipient,
			primaryEmail: primaryRecipient,
			ccEmails: args.recipients.slice(1).map(normalizeEmail),
			subject: args.subject,
			sessionDate: args.sessionDate,
			delivery: args.delivery,
			markdown: args.markdown,
			html: args.html
		});
	}

	const internalEmailsSavedFor
		= args.sessionDate
			? []
			: dedupeMatchedUsers([
					recipientMappedUser,
					...matchesByEmail.values()
				]);

	if (internalEmailsSavedFor.length > 0) {
		await InternalEmail.insertMany(
			internalEmailsSavedFor.map(user => ({
				user: user._id,
				matchedRecipientEmail: user.email,
				primaryEmail: primaryRecipient,
				ccEmails: args.recipients.slice(1).map(normalizeEmail),
				fromAddress: normalizeEmail(args.fromUsed),
				subject: args.subject,
				markdown: args.markdown,
				html: args.html,
				messageId: args.messageId,
				transportUsed: args.transportUsed,
				sentAt: args.sentAt
			}))
		);
	}

	return {
		sessionNoteSavedFor,
		internalEmailsSavedFor
	};
}

router.get("/session-notes/recent", validAdmin, async (req, res) => {
	const parsed = z
		.object({
			recipientName: z.string().trim().min(1).optional(),
			primaryEmail: z.string().trim().email().optional()
		})
		.refine(
			data => Boolean(data.recipientName || data.primaryEmail),
			{ message: "recipientName or primaryEmail is required" }
		)
		.safeParse({
			recipientName:
				typeof req.query.recipientName === "string"
					? req.query.recipientName
					: undefined,
			primaryEmail:
				typeof req.query.primaryEmail === "string"
					? req.query.primaryEmail
					: undefined
		});

	if (!parsed.success) {
		return res.status(400).json({
			message: "Invalid session note lookup",
			issues: parsed.error.issues
		});
	}

	const primaryEmail = normalizeEmail(parsed.data.primaryEmail ?? "");
	const recipientMappedUser = await findMatchedUserByRecipientName(
		parsed.data.recipientName
	);
	const primaryUser = primaryEmail
		? (
				await findMatchedUsersByEmail([primaryEmail])
			).get(primaryEmail) ?? null
		: null;
	const associatedUser = recipientMappedUser ?? primaryUser;
	const sessionNotes = await getRecentSessionNotesForTarget({
		associatedUser,
		primaryEmail
	});

	return res.json({
		matchedUser: associatedUser,
		sessionNotes
	});
});

function createPrimaryTransporter() {
	const caBuf = PRIMARY_TRANSPORT_CA_FILE
		? readOptionalCA(PRIMARY_TRANSPORT_CA_FILE)
		: undefined;

	return nodemailer.createTransport({
		host: PRIMARY_TRANSPORT_HOST,
		port: PRIMARY_TRANSPORT_PORT,
		secure: PRIMARY_TRANSPORT_SECURE,
		connectionTimeout: 15000,
		socketTimeout: 15000,
		tls: {
			servername: PRIMARY_TRANSPORT_SERVERNAME,
			minVersion: "TLSv1.2",
			...(caBuf ? { ca: caBuf } : {})
		}
	});
}

function createFallbackTransporter() {
	const caBuf = FALLBACK_TRANSPORT_CA_FILE
		? readOptionalCA(FALLBACK_TRANSPORT_CA_FILE)
		: undefined;

	return nodemailer.createTransport({
		host: FALLBACK_TRANSPORT_HOST,
		port: FALLBACK_TRANSPORT_PORT,
		secure: FALLBACK_TRANSPORT_SECURE,
		auth:
			FALLBACK_TRANSPORT_USER && FALLBACK_TRANSPORT_PASS
				? {
						user: FALLBACK_TRANSPORT_USER,
						pass: FALLBACK_TRANSPORT_PASS
					}
				: undefined,
		connectionTimeout: 15000,
		socketTimeout: 15000,
		tls: {
			servername: FALLBACK_TRANSPORT_SERVERNAME,
			minVersion: "TLSv1.2",
			...(caBuf ? { ca: caBuf } : {})
		}
	});
}

async function generateRawMimeMessage(
	message: SendMailOptions
): Promise<Buffer> {
	const rawTransporter = nodemailer.createTransport({
		streamTransport: true,
		buffer: true,
		newline: "windows"
	});
	const rawInfo = await rawTransporter.sendMail(message);

	if (!Buffer.isBuffer(rawInfo.message)) {
		throw new TypeError("Raw MIME generation did not return a buffer");
	}

	return rawInfo.message;
}

async function appendSentMessage(
	message: SendMailOptions
): Promise<ImapAppendResult> {
	if (!IMAP_APPEND_PASS) {
		throw new NoteArchiveError("not_appended");
	}

	let rawMessage: Buffer;
	try {
		rawMessage = await generateRawMimeMessage(message);
	}
	catch {
		throw new NoteArchiveError("not_appended");
	}
	const client = new ImapFlow({
		host: IMAP_APPEND_HOST,
		port: IMAP_APPEND_PORT,
		secure: IMAP_APPEND_SECURE,
		auth: {
			user: IMAP_APPEND_USER,
			pass: IMAP_APPEND_PASS
		},
		tls: {
			servername: IMAP_APPEND_SERVERNAME
		},
		connectionTimeout: 15000,
		socketTimeout: 15000,
		logger: false
	});

	client.on("error", () => noteOperationalEvent("internal-mail", "archive_outcome_ambiguous"));
	await confirmedArchiveAppend({
		destination: () => {
			const namespace = (client as ImapFlow & { namespace?: { prefix: string } | false }).namespace;
			return archiveDestination(IMAP_SENT_MAILBOX, namespace ? namespace.prefix : "");
		},
		connect: () => client.connect(),
		append: () => client.append(IMAP_SENT_MAILBOX, rawMessage, ["\\Seen"], message.date),
		logout: () => client.logout()
	});
	return { appended: true, mailbox: IMAP_SENT_MAILBOX };
}

async function sendWithFailover(mailBase: MailBase): Promise<MailSendResult> {
	try {
		const info = await createPrimaryTransporter().sendMail({ ...mailBase, from: PRIMARY_FROM_ADDR });
		return { info, fromUsed: PRIMARY_FROM_ADDR, transportUsed: "primary-local", usedSenderFallback: false };
	}
	catch (error) {
		if (classifySmtpFailure(error).state === "delivery_unconfirmed") throw new NoteWorkflowError(202, "smtp_outcome_ambiguous");
		const info = await createFallbackTransporter().sendMail({ ...mailBase, from: FALLBACK_FROM_ADDR });
		return { info, fromUsed: FALLBACK_FROM_ADDR, transportUsed: "fallback-gmail", usedSenderFallback: true };
	}
}

export const sessionNoteSending = createNoteSendWorkflow({
	protectDispatch: (record, action) => withSessionNoteWriter(record.note.user, action),
	validateBeforeSend: async (record) => {
		const user = await User.findById(record.note.user);
		const note = await SessionNote.findById(record.noteId);
		if (!user || !note || String(note.user) !== record.note.user || note.markdown !== record.note.markdown || note.subject !== record.note.subject || !noteAssociationMatches(note, record.note)) throw new Error("identity_changed");
		await resolveNoteIdentity({ currentAdmin: await Admin.findById(record.actorId) } as any, { studentId: record.note.user, scheduledSessionId: record.note.scheduledSessionId, unlinked: !record.note.scheduledSessionId, primaryEmail: record.note.primaryEmail });
		if (record.note.scheduledSessionId) {
			const session = await ScheduledSession.findOne({ _id: record.note.scheduledSessionId, user: user._id });
			if (!session || metadataHash({ startAt: session.startAt, endAt: session.endAt, timezone: session.timezone, scheduleRevision: session.scheduleRevision ?? 0 }) !== metadataHash(record.note.sessionSnapshot)) throw new Error("schedule_changed");
		}
	},
	// Durable note sends use one transport. No timeout-triggered fallback can resend DATA.
	send: async record => createPrimaryTransporter().sendMail(noteMail(record)),
	archive: async (record) => { await appendSentMessage(noteMail(record)); }
});
function noteMail(record: import("../types/entities/ISessionNoteSend.js").SessionNoteSendRecord): SendMailOptions {
	return { from: PRIMARY_FROM_ADDR, date: record.claimedAt ?? record.createdAt, to: record.note.primaryEmail, cc: record.note.ccEmails, subject: record.note.subject, text: record.note.markdown, html: record.note.html, messageId: record.messageId };
}
router.get("/session-notes/identities", validAdmin, async (_req, res) => {
	try {
		const students = await User.find({}).select({ _id: 1, name: 1, recipientName: 1 }).sort({ name: 1 }).limit(1000).maxTimeMS(2000).lean();
		res.set("Cache-Control", "no-store").json({ students: students.map(s => ({ studentId: String(s._id), name: s.name, recipientName: s.recipientName ?? null })) });
	}
	catch { res.status(503).json({ message: "Student identities unavailable" }); }
});
router.get("/session-notes/operations/:operationId", validAdmin, async (req, res) => {
	try {
		if (!z.uuid().safeParse(req.params.operationId).success) return res.status(400).json({ message: "Invalid operation" });
		res.set("Cache-Control", "no-store").json(safeOperation(await mongoNoteSendStore.get(String(req.params.operationId))));
	}
	catch (e) { res.status(e instanceof NoteWorkflowError ? e.status : 503).json({ message: "Operation unavailable" }); }
});
router.get("/session-notes/review", validAdmin, async (_req, res) => {
	try {
		const records = await SessionNoteSend.find({ $or: [{ state: { $in: ["preparing", "sending", "delivery_unconfirmed", "send_failed", "smtp_rejected"] } }, { state: "queued", createdAt: { $lt: new Date(Date.now() - 300_000) } }, { archiveState: "review_required" }, { "note.associationStatus": "unlinked_review_required" }] }).sort({ createdAt: 1 }).limit(100).maxTimeMS(2000).lean();
		const resolved = await SessionNote.find({ _id: { $in: records.map(r => r.noteId) }, associationReviewResolved: true }).select({ _id: 1 }).limit(100).maxTimeMS(2000).lean();
		const markerUsers = await User.find({ "noteWorkflowWriters.at": { $lt: new Date(Date.now() - 120_000) } }).select({ _id: 1, noteWorkflowWriters: 1 }).limit(100).maxTimeMS(2000).lean();
		const writerMarkers = markerUsers.flatMap(u => (u.noteWorkflowWriters ?? []).filter(w => w.at.getTime() < Date.now() - 120_000).map(w => ({ studentId: String(u._id), writerId: w.id, startedAt: w.at.toISOString(), active: noteWriterIsActive(w.id) }))).slice(0, 100);
		const resolvedIds = new Set(resolved.map(n => String(n._id)));
		const unlinkedNotes = await SessionNote.find({ associationStatus: "unlinked_review_required", associationReviewResolved: { $ne: true } }).select({ _id: 1, user: 1 }).limit(100).maxTimeMS(2000).lean();
		const externalEvidence = await SessionNoteEvidence.find({ associationStatus: "unlinked_review_required" }).select({ _id: 1, studentId: 1, evidenceType: 1, correctionReason: 1 }).limit(100).maxTimeMS(2000).lean();
		res.set("Cache-Control", "no-store").json({ writerMarkers, operations: records.filter(r => !(r.state === "smtp_accepted" && resolvedIds.has(r.noteId) && r.archiveState !== "review_required")).map(safeOperation), externalEvidence: externalEvidence.map(e => ({ recordId: String(e._id), studentId: e.studentId, evidenceStatus: externalEvidenceStatus(e) })), unlinkedNotes: unlinkedNotes.map(n => ({ noteId: String(n._id), studentId: n.user ? String(n.user) : null })), limit: 100 });
	}
	catch { res.status(503).json({ message: "Review queue unavailable" }); }
});
router.post("/session-notes/students/:studentId/writer-disposition", validAdmin, async (req, res) => {
	const parsed = z.object({ writerId: z.uuid(), decision: z.literal("confirmed_process_stopped"), evidenceRef: z.string().regex(/^[a-f0-9]{64}$/), idempotencyKey: z.string().regex(/^[\w-]{16,128}$/) }).strict().safeParse(req.body);
	if (!parsed.success || !noteObjectId.safeParse(req.params.studentId).success) return res.status(400).json({ message: "Invalid writer disposition" });
	if (env.SESSION_NOTES_SEND_ENABLED === "true" || env.SESSION_NOTES_WORKER_ENABLED === "true" || noteWriterIsActive(parsed.data.writerId)) return res.status(409).json({ message: "Pause sending/recovery and verify the old process stopped; active writers cannot be cleared" });
	try {
		const studentId = String(req.params.studentId);
		const keyHash = metadataHash(parsed.data.idempotencyKey);
		const payloadHash = metadataHash({ writerId: parsed.data.writerId, evidenceRef: parsed.data.evidenceRef });
		const student = await User.findById(studentId).select("+noteWorkflowWriterDispositions");
		const prior = student?.noteWorkflowWriterDispositions?.find(d => d.keyHash === keyHash);
		if (prior) {
			if (prior.payloadHash !== payloadHash) throw new NoteWorkflowError(409, "idempotency_payload_conflict");
			return res.json({ writerId: parsed.data.writerId, disposition: "confirmed_process_stopped" });
		}
		const result = await User.updateOne({ "_id": studentId, "noteWorkflowWriters.id": parsed.data.writerId, "noteWorkflowWriterDispositions.19": { $exists: false }, "noteWorkflowWriterDispositions.keyHash": { $ne: keyHash } }, {
			$pull: { noteWorkflowWriters: { id: parsed.data.writerId } },
			$push: { noteWorkflowWriterDispositions: { writerId: parsed.data.writerId, actorId: String(req.currentAdmin!._id), at: new Date(), keyHash, payloadHash, evidenceRef: parsed.data.evidenceRef } }
		}, { writeConcern: { w: "majority", j: true }, maxTimeMS: 5000 });
		if (!result.modifiedCount) {
			const retry = await User.findById(studentId).select("+noteWorkflowWriterDispositions");
			const completed = retry?.noteWorkflowWriterDispositions?.find(d => d.keyHash === keyHash);
			if (completed?.payloadHash !== payloadHash) throw new NoteWorkflowError(409, "writer_disposition_conflict_or_history_full");
		}
		return res.json({ writerId: parsed.data.writerId, disposition: "confirmed_process_stopped" });
	}
	catch (e) { return res.status(e instanceof NoteWorkflowError ? e.status : 503).json({ message: e instanceof NoteWorkflowError ? e.code : "Writer disposition unavailable" }); }
});

router.post("/session-notes/:noteId/association", validAdmin, async (req, res) => {
	const parsed = z.object({ studentId: noteObjectId, scheduledSessionId: noteObjectId, idempotencyKey: z.string().regex(/^[\w-]{16,128}$/) }).strict().safeParse(req.body);
	if (!parsed.success || !noteObjectId.safeParse(req.params.noteId).success) return res.status(400).json({ message: "Invalid association" });
	try {
		const note = await SessionNote.findOne({ _id: req.params.noteId, user: parsed.data.studentId });
		if (!note) throw new NoteWorkflowError(409, "note_identity_conflict");
		const keyHash = metadataHash(parsed.data.idempotencyKey);
		const payloadHash = metadataHash({ studentId: parsed.data.studentId, scheduledSessionId: parsed.data.scheduledSessionId });
		const prior = note.associationCorrections?.find(c => c.keyHash === keyHash);
		if (prior) {
			if (prior.payloadHash !== payloadHash) throw new NoteWorkflowError(409, "idempotency_payload_conflict");
			return res.json({ noteId: String(note._id), associationStatus: "verified_session" });
		}
		const identity = await resolveNoteIdentity(req, parsed.data);
		const updated = await SessionNote.updateOne({ "_id": note._id, "associationCorrections.19": { $exists: false }, "associationCorrections.keyHash": { $ne: keyHash }, "__v": note.__v }, {
			$inc: { __v: 1 },
			$set: { associationReviewResolved: true },
			$push: { associationCorrections: { actorId: String(req.currentAdmin!._id), at: new Date(), keyHash, payloadHash, previousSessionId: note.associationCorrections?.at(-1)?.nextSessionId ?? (note.scheduledSessionId ? String(note.scheduledSessionId) : undefined), nextSessionId: identity.scheduledSessionId, nextSnapshot: identity.sessionSnapshot } }
		}, { writeConcern: { w: "majority", j: true }, maxTimeMS: 5000 });
		if (!updated.modifiedCount) {
			const retry = await SessionNote.findOne({ _id: note._id, user: parsed.data.studentId });
			const completed = retry?.associationCorrections?.find(c => c.keyHash === keyHash);
			if (!completed || completed.payloadHash !== payloadHash) throw new NoteWorkflowError(409, "association_conflict_or_history_full");
		}
		res.json({ noteId: String(note._id), associationStatus: "verified_session" });
	}
	catch (e) { res.status(e instanceof NoteWorkflowError ? e.status : 503).json({ message: e instanceof NoteWorkflowError ? e.code : "Association unavailable" }); }
});
router.post("/session-notes/operations/:operationId/disposition", validAdmin, async (req, res) => {
	const parsed = z.object({ decision: z.enum(["confirmed_not_accepted", "keep_unconfirmed", "retry_nonaccepted", "archive_confirmed_present", "archive_confirmed_absent", "archive_keep_unconfirmed"]), evidenceRef: z.string().regex(/^[a-f0-9]{64}$/), idempotencyKey: z.string().regex(/^[\w-]{16,128}$/) }).strict().safeParse(req.body);
	if (!parsed.success || !z.uuid().safeParse(req.params.operationId).success) return res.status(400).json({ message: "Invalid disposition" });
	try {
		const id = String(req.params.operationId);
		const current = await mongoNoteSendStore.get(id);
		const keyHash = metadataHash(parsed.data.idempotencyKey);
		const payloadHash = metadataHash({ decision: parsed.data.decision, evidenceRef: parsed.data.evidenceRef });
		const prior = current?.dispositions.find(d => d.keyHash === keyHash);
		if (prior) {
			if (prior.payloadHash !== payloadHash) throw new NoteWorkflowError(409, "idempotency_payload_conflict");
			return res.json(safeOperation(current));
		}
		if (parsed.data.decision.startsWith("archive_")) {
			if (env.SESSION_NOTES_SEND_ENABLED === "true" || env.SESSION_NOTES_WORKER_ENABLED === "true") throw new NoteWorkflowError(409, "pause_sending_and_recovery_before_archive_disposition");
			if (!current || !["smtp_accepted", "smtp_rejected"].includes(current.state) || current.archiveState !== "review_required") throw new NoteWorkflowError(409, "archive_disposition_requires_review");
			const retryArchive = parsed.data.decision === "archive_confirmed_absent";
			if (retryArchive && current.archiveAttempts >= 5) throw new NoteWorkflowError(409, "archive_attempt_limit");
			const updated = await mongoNoteSendStore.change(id, {
				"state": current.state,
				"archiveState": "review_required",
				"archiveAttempts": current.archiveAttempts,
				"dispositions.19": { $exists: false },
				"dispositions.keyHash": { $ne: keyHash },
				"dispositions.evidenceRef": { $ne: parsed.data.evidenceRef }
			}, {
				$set: { archiveState: retryArchive ? "retry" : parsed.data.decision === "archive_confirmed_present" ? "archived" : "review_required", ...(retryArchive ? { nextArchiveAt: new Date() } : {}) },
				...(!retryArchive ? { $unset: { nextArchiveAt: "" } } : {}),
				$push: { dispositions: { actorId: String(req.currentAdmin!._id), at: new Date(), decision: parsed.data.decision, evidenceRef: parsed.data.evidenceRef, keyHash, payloadHash } }
			});
			if (!updated) {
				const completed = await mongoNoteSendStore.get(id);
				if (completed?.dispositions.some(d => d.keyHash === keyHash && d.payloadHash === payloadHash)) return res.json(safeOperation(completed));
				throw new NoteWorkflowError(409, "archive_disposition_conflict");
			}
			return res.json(safeOperation(updated));
		}
		const retrying = parsed.data.decision === "retry_nonaccepted";
		if (retrying && (!current || !(current.state === "smtp_rejected" || (current.state === "send_failed" && ["smtp_nonacceptance", "dispatch_identity_changed", "confirmed_not_accepted"].includes(current.errorCode ?? ""))))) throw new NoteWorkflowError(409, "retry_requires_established_nonacceptance");
		const updated = await mongoNoteSendStore.change(id, { "attempts.19": { $exists: false }, "state": retrying ? current!.state : { $in: ["preparing", "queued", "delivery_unconfirmed", "send_failed", "smtp_rejected"] }, "dispositions.19": { $exists: false }, "dispositions.keyHash": { $ne: keyHash }, "dispositions.evidenceRef": { $ne: parsed.data.evidenceRef } }, {
			$set: { state: retrying ? "queued" : parsed.data.decision === "confirmed_not_accepted" ? "send_failed" : "delivery_unconfirmed", errorCode: parsed.data.decision, evidenceRecordedAt: new Date() },
			$push: { dispositions: { actorId: String(req.currentAdmin!._id), at: new Date(), decision: parsed.data.decision, evidenceRef: parsed.data.evidenceRef, keyHash, payloadHash } }
		});
		if (!updated) {
			const retry = await mongoNoteSendStore.get(id);
			const completed = retry?.dispositions.find(d => d.keyHash === keyHash);
			if (completed?.payloadHash === payloadHash) return res.json(safeOperation(retry));
			return res.status(409).json({ message: "Disposition conflict" });
		}
		res.json(safeOperation(updated));
	}
	catch (e) { res.status(e instanceof NoteWorkflowError ? e.status : 503).json({ message: e instanceof NoteWorkflowError ? e.code : "Disposition unavailable" }); }
});

router.post("/send", validAdmin, async (req, res) => {
	try {
		const parsed = MailSchema.safeParse(req.body);
		if (!parsed.success) {
			return res.status(400).json({ message: "Invalid payload", issues: parsed.error.issues });
		}
		const { to, subject, md, sessionDate: sessionDateStr, recipientName } = parsed.data;

		const recipients = normalizeNoteEmails(to.split(","));

		if (recipients.length === 0 || recipients.length > 20) {
			return res.status(400).json({ message: "At least one recipient is required" });
		}

		const invalid = recipients.filter(addr => !z.string().email().safeParse(addr).success);
		if (invalid.length) {
			return res.status(400).json({ message: "Invalid recipients" });
		}

		if (ALLOW_TO.length && !recipients.every(addr => ALLOW_TO.includes(addr)))
			return res.status(403).json({ message: "Recipient not allowed" });
		if (md.length > MAX_MD_LEN) return res.status(413).json({ message: "Markdown too large" });

		// Parse session date when provided (used to persist notes)
		let sessionDate: Date | null = null;
		if (sessionDateStr) {
			const d = parseDateOnly(sessionDateStr);
			if (!d)
				return res.status(400).json({ message: "Invalid sessionDate" });
			sessionDate = d;
		}
		if (!sessionDate && (parsed.data.studentId || parsed.data.noteId || parsed.data.scheduledSessionId || parsed.data.idempotencyKey || parsed.data.unlinked)) return res.status(400).json({ message: "Session-note requests require a class-date label and explicit session identity" });

		const html = await renderMarkdownEmailHtml(md);
		if (sessionDate) {
			const { studentId, scheduledSessionId, unlinked, noteId, idempotencyKey } = parsed.data;
			if (!studentId || !noteId || !idempotencyKey) return res.status(400).json({ message: "Select a student, save a note, and provide an idempotency key", code: "note_identity_required" });
			await ensureNoteWorkflowIndexes();
			const keyHash = metadataHash(idempotencyKey);
			const actorId = String(req.currentAdmin!._id);
			const payloadHash = metadataHash({ studentId, scheduledSessionId: scheduledSessionId ?? null, unlinked: unlinked === true, noteId, to: recipients.map(normalizeEmail), subject, md, sessionDate, recipientName: recipientName ?? null });
			const prior = await mongoNoteSendStore.byKey(actorId, keyHash);
			if (prior) {
				if (prior.payloadHash !== payloadHash) throw new NoteWorkflowError(409, "idempotency_payload_conflict");
				if (prior.state === "preparing") await withSessionNoteWriter(prior.note.user, () => sessionNoteSending.prepare({ actorId, keyHash, payloadHash, noteId: prior.noteId, note: prior.note }));
				const result = prior.state === "queued" || prior.state === "preparing" ? await sessionNoteSending.dispatch(prior._id) : safeOperation(prior);
				return res.status(result.ok ? 200 : 202).json(result);
			}
			const identity = await resolveNoteIdentity(req, { studentId, scheduledSessionId, unlinked, primaryEmail: recipients[0], recipientName });
			const record = await withSessionNoteWriter(studentId, () => sessionNoteSending.prepare({ actorId, keyHash, payloadHash, noteId, note: {
				user: studentId,
				studentName: identity.student.name,
				primaryEmail: normalizeEmail(recipients[0]),
				ccEmails: recipients.slice(1).map(normalizeEmail),
				subject,
				markdown: md,
				html,
				sessionDate,
				scheduledSessionId: identity.scheduledSessionId,
				sessionSnapshot: identity.sessionSnapshot,
				associationStatus: identity.associationStatus
			} }));
			const result = await sessionNoteSending.dispatch(record._id);
			return res.status(result.ok ? 200 : 202).json(result);
		}

		const mailBase = {
			date: new Date(),
			to: recipients[0],
			cc: recipients.slice(1),
			subject,
			text: md,
			html
		};

		const { info, fromUsed, transportUsed } = await sendWithFailover(
			mailBase
		);
		const sentAt = new Date();
		const delivery = sessionNoteDeliveryFromSend(info, recipients[0], sentAt);
		const messageId = info.messageId || createMessageId(fromUsed);

		try {
			await appendSentMessage({
				...mailBase,
				from: fromUsed,
				messageId
			});
			noteOperationalEvent("internal-mail", "archive_complete");
		}
		catch {
			noteOperationalEvent("internal-mail", "archive_failed");
		}

		const savedAssociations = await saveAssociatedRecords({
			recipients,
			recipientName,
			sessionDate,
			subject,
			markdown: md,
			html,
			fromUsed,
			transportUsed,
			messageId,
			sentAt,
			delivery
		});
		const primaryRecipient = normalizeEmail(recipients[0] ?? "");
		const recentSessionNotes = sessionDate
			? await getRecentSessionNotesForTarget({
					associatedUser: savedAssociations.sessionNoteSavedFor,
					primaryEmail: primaryRecipient
				})
			: [];

		return res.json({
			ok: true,
			associations: savedAssociations,
			recentSessionNotes
		});
	}
	catch (err: any) {
		noteOperationalEvent("request", "mail_request_failed");
		return res.status(err instanceof NoteWorkflowError ? err.status : 503).json({ ok: false, message: err instanceof NoteWorkflowError ? err.code : "Mail tracking unavailable; do not resend until the operation is checked" });
	}
});

export const adminMailRoutes = router;
