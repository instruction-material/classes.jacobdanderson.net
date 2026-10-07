import type { NoteSnapshot, SendState, SessionNoteSendRecord } from "../types/entities/ISessionNoteSend.js";
import { randomUUID } from "node:crypto";
import { env } from "node:process";
import { Types } from "mongoose";
import { SessionNote } from "../models/schemas/SessionNote.js";
import { SessionNoteEvidence } from "../models/schemas/SessionNoteEvidence.js";
import { SessionNoteSend } from "../models/schemas/SessionNoteSend.js";
import { NoteArchiveError } from "../utils/sessionNoteArchive.js";
import { sessionNoteDeliveryFromSend } from "../utils/sessionNoteDelivery.js";
import { metadataHash, NoteWorkflowError } from "../utils/sessionNoteIdentity.js";
import { noteOperationalEvent } from "../utils/sessionNoteOperational.js";

const WRITE = { writeConcern: { w: "majority" as const, j: true }, maxTimeMS: 5000 };
export const ORPHAN_AFTER_MS = 120_000;
export { noteOperationalEvent } from "../utils/sessionNoteOperational.js";
let ready: Promise<void> | undefined;
export function ensureNoteWorkflowIndexes() {
	ready ??= Promise.all([SessionNoteSend.createIndexes(), SessionNoteEvidence.createIndexes()]).then(() => {});
	return ready.catch((error) => {
		ready = undefined;
		throw error;
	});
}
export interface NoteSendStore {
	insert: (record: SessionNoteSendRecord) => Promise<SessionNoteSendRecord>;
	get: (id: string) => Promise<SessionNoteSendRecord | null>;
	byKey: (actorId: string, keyHash: string) => Promise<SessionNoteSendRecord | null>;
	byVersion: (noteId: string, noteVersion: string) => Promise<SessionNoteSendRecord | null>;
	change: (id: string, expected: Record<string, unknown>, update: Record<string, unknown>) => Promise<SessionNoteSendRecord | null>;
	list: (filter: Record<string, unknown>, limit: number) => Promise<SessionNoteSendRecord[]>;
}
export const mongoNoteSendStore: NoteSendStore = {
	insert: async record => (await SessionNoteSend.create([record], { w: "majority", j: true, wtimeout: 5000 }))[0].toObject(),
	get: async id => SessionNoteSend.findById(id).maxTimeMS(2000).lean(),
	byKey: async (actorId, keyHash) => SessionNoteSend.findOne({ actorId, keyHash }).maxTimeMS(2000).lean(),
	byVersion: async (noteId, noteVersion) => SessionNoteSend.findOne({ noteId, noteVersion }).maxTimeMS(2000).lean(),
	change: async (id, expected, update) => SessionNoteSend.findOneAndUpdate({ _id: id, ...expected }, update, { ...WRITE, returnDocument: "after" }).lean(),
	list: async (filter, limit) => SessionNoteSend.find(filter).sort({ createdAt: 1 }).limit(limit).maxTimeMS(2000).lean()
};
export function classifySmtpFailure(error: unknown): { state: SendState; code: string } {
	const e = error as { command?: string; responseCode?: number; code?: string } | null;
	// Only concrete pre-DATA failures or explicit SMTP negative replies establish nonacceptance.
	// Socket/reset/timeout without a proven phase remains ambiguous.
	if (e && ((["EHLO", "HELO", "STARTTLS", "AUTH", "MAIL FROM", "RCPT TO"].includes(e.command ?? "") || (e.command === "CONN" && ["ECONNREFUSED", "ENOTFOUND", "EDNS"].includes(e.code ?? "")))
		|| (Number.isInteger(e.responseCode) && e.responseCode! >= 400 && e.responseCode! < 600))) {
		return { state: e.responseCode && e.responseCode >= 500 ? "smtp_rejected" : "send_failed", code: "smtp_nonacceptance" };
	}
	return { state: "delivery_unconfirmed", code: "smtp_outcome_ambiguous" };
}
export function noteAssociationMatches(note: any, snapshot: NoteSnapshot) {
	const correction = note.associationCorrections?.at(-1);
	const sessionId = correction?.nextSessionId ?? note.scheduledSessionId;
	const original = correction?.nextSnapshot ?? note.sessionSnapshot;
	if (String(sessionId ?? "") !== String(snapshot.scheduledSessionId ?? "")) return false;
	if (!snapshot.scheduledSessionId) return true;
	if (!original || !snapshot.sessionSnapshot) return false;
	return metadataHash({ startAt: original.startAt, endAt: original.endAt, timezone: original.timezone, scheduleRevision: original.scheduleRevision ?? 0 }) === metadataHash(snapshot.sessionSnapshot);
}
async function ensureNote(record: SessionNoteSendRecord) {
	const existing = await SessionNote.findById(record.noteId);
	if (existing) {
		if (String(existing.user) !== record.note.user
			|| existing.markdown !== record.note.markdown || existing.subject !== record.note.subject
			|| existing.primaryEmail !== record.note.primaryEmail
			|| metadataHash(existing.ccEmails) !== metadataHash(record.note.ccEmails)
			|| existing.sessionDate.getTime() !== record.note.sessionDate.getTime()
			|| !noteAssociationMatches(existing, record.note)) {
			throw new NoteWorkflowError(409, "saved_note_version_conflict");
		}
		if (existing.delivery?.status === "smtp_accepted") throw new NoteWorkflowError(409, "saved_note_already_sent");
		return;
	}
	await SessionNote.updateOne({ _id: new Types.ObjectId(record.noteId) }, { $setOnInsert: {
		...record.note,
		workflowVersion: 2,
		noteVersion: record.noteVersion,
		savedAt: new Date()
	} }, { ...WRITE, upsert: true, runValidators: true });
}
async function projectAcceptance(record: SessionNoteSendRecord) {
	await SessionNote.updateOne({ _id: record.noteId, user: record.note.user }, { $set: {
		workflowVersion: 2,
		noteVersion: record.noteVersion,
		scheduledSessionId: record.note.scheduledSessionId,
		sessionSnapshot: record.note.sessionSnapshot,
		associationStatus: record.note.associationStatus,
		delivery: { source: "site_smtp", status: record.state === "smtp_accepted" ? "smtp_accepted" : "smtp_rejected", ...(record.sentAt ? { sentAt: record.sentAt } : {}) }
	} }, WRITE);
}
export interface NoteSendDependencies {
	protectDispatch?: <T>(record: SessionNoteSendRecord, action: () => Promise<T>) => Promise<T>;
	store?: NoteSendStore;
	ensureNote?: typeof ensureNote;
	projectAcceptance?: typeof projectAcceptance;
	validateBeforeSend: (record: SessionNoteSendRecord) => Promise<void>;
	send: (record: SessionNoteSendRecord) => Promise<unknown>;
	archive: (record: SessionNoteSendRecord) => Promise<void>;
	event?: typeof noteOperationalEvent;
	enabled?: () => boolean;
}
export function createNoteSendWorkflow(deps: NoteSendDependencies) {
	const store = deps.store ?? mongoNoteSendStore;
	const saveNote = deps.ensureNote ?? ensureNote;
	const project = deps.projectAcceptance ?? projectAcceptance;
	const event = deps.event ?? noteOperationalEvent;
	const enabled = deps.enabled ?? (() => env.SESSION_NOTES_SEND_ENABLED === "true");
	async function prepare(input: { actorId: string; keyHash: string; payloadHash: string; note: NoteSnapshot; noteId?: string }) {
		const prior = await store.byKey(input.actorId, input.keyHash);
		if (prior) {
			if (prior.payloadHash !== input.payloadHash) throw new NoteWorkflowError(409, "idempotency_payload_conflict");
			if (prior.state === "preparing") {
				await saveNote(prior);
				return await store.change(prior._id, { state: "preparing" }, { $set: { state: "queued" } }) ?? prior;
			}
			return prior;
		}
		const now = new Date();
		const id = randomUUID();
		const candidate: SessionNoteSendRecord = {
			_id: id,
			actorId: input.actorId,
			keyHash: input.keyHash,
			payloadHash: input.payloadHash,
			noteId: input.noteId ?? new Types.ObjectId().toString(),
			noteVersion: metadataHash(input.note),
			note: input.note,
			state: "preparing",
			messageId: `<${id}@classes-notes.invalid>`,
			archiveState: "not_applicable",
			archiveAttempts: 0,
			attempts: [],
			dispositions: [],
			createdAt: now,
			updatedAt: now
		};
		let record: SessionNoteSendRecord;
		try {
			record = await store.insert(candidate);
		}
		catch (error) {
			if ((error as { code?: number }).code !== 11000) throw error;
			const duplicate = await store.byKey(input.actorId, input.keyHash) ?? await store.byVersion(candidate.noteId, candidate.noteVersion) ?? (await store.list({ noteId: candidate.noteId }, 1))[0];
			if (!duplicate || duplicate.payloadHash !== input.payloadHash) throw new NoteWorkflowError(409, "idempotency_payload_conflict");
			record = duplicate;
		}
		if (record.state === "preparing") {
			await saveNote(record);
			record = await store.change(record._id, { state: "preparing" }, { $set: { state: "queued" } }) ?? await store.get(record._id) ?? record;
		}
		return record;
	}
	async function archive(id: string) {
		const claimed = await store.change(id, {
			state: { $in: ["smtp_accepted", "smtp_rejected"] },
			archiveState: { $in: ["pending", "retry"] },
			archiveAttempts: { $lt: 5 },
			$or: [{ nextArchiveAt: { $exists: false } }, { nextArchiveAt: { $lte: new Date() } }]
		}, { $set: { archiveState: "archiving", archiveClaimedAt: new Date() }, $inc: { archiveAttempts: 1 } });
		if (!claimed) return;
		try {
			await deps.archive(claimed);
		}
		catch (error) {
			const canRetry = error instanceof NoteArchiveError && error.outcome === "not_appended" && claimed.archiveAttempts < 5;
			try {
				await store.change(id, { archiveState: "archiving" }, {
					$set: { archiveState: canRetry ? "retry" : "review_required", ...(canRetry ? { nextArchiveAt: new Date(Date.now() + 60_000 * 2 ** claimed.archiveAttempts) } : {}) },
					...(!canRetry ? { $unset: { nextArchiveAt: "" } } : {})
				});
			}
			catch { event(id, "archive_tracking_requires_attention"); }
			event(id, canRetry ? "archive_tracking_requires_attention" : "archive_outcome_ambiguous");
			return;
		}
		try {
			const recorded = await store.change(id, { archiveState: "archiving" }, { $set: { archiveState: "archived" } });
			if (!recorded) event(id, "archive_tracking_requires_attention");
		}
		catch {
			// APPEND completed. Leave its durable claim for review; never append again.
			event(id, "archive_tracking_requires_attention");
		}
	}
	async function dispatch(id: string) {
		if (!enabled()) return safeOperation(await store.get(id));
		const claimId = randomUUID();
		const claimed = await store.change(id, { "state": "queued", "attempts.19": { $exists: false } }, {
			$set: { state: "sending", claimId, claimedAt: new Date() },
			$push: { attempts: { claimId, startedAt: new Date() } }
		});
		if (!claimed) return safeOperation(await store.get(id));
		const execute = async () => {
			try {
			// Preflight failures establish nonacceptance without contacting SMTP.
				await deps.validateBeforeSend(claimed);
			}
			catch {
				await store.change(id, { state: "sending", claimId }, { $set: { state: "send_failed", errorCode: "dispatch_identity_changed", evidenceRecordedAt: new Date() } });
				event(id, "dispatch_identity_changed");
				return safeOperation(await store.get(id));
			}
			let outcome: SendState;
			let sentAt: Date | undefined;
			let errorCode: string | undefined;
			try {
				const info = await deps.send(claimed);
				const completedAt = new Date();
				const classified = sessionNoteDeliveryFromSend(info as any, claimed.note.primaryEmail, completedAt);
				outcome = classified.status === "smtp_accepted" ? "smtp_accepted" : classified.status === "smtp_rejected" ? "smtp_rejected" : "delivery_unconfirmed";
				sentAt = classified.sentAt;
				if (outcome === "delivery_unconfirmed") errorCode = "smtp_outcome_ambiguous";
			}
			catch (error) {
				({ state: outcome, code: errorCode } = classifySmtpFailure(error));
			}
			let recorded: SessionNoteSendRecord | null;
			try {
				recorded = await store.change(id, { state: "sending", claimId }, {
					$set: { state: outcome, ...(sentAt ? { sentAt } : {}), errorCode, evidenceRecordedAt: new Date(), archiveState: ["smtp_accepted", "smtp_rejected"].includes(outcome) ? "pending" : "not_applicable", [`attempts.${claimed.attempts.length - 1}.outcome`]: outcome }
				});
				if (!recorded) throw new Error("claim_lost");
			}
			catch {
				event(id, "smtp_tracking_reconciliation_required");
				// Durable pre-send intent is left sending, never queued, even if SMTP succeeded.
				return { operationId: id, noteId: claimed.noteId, evidenceStatus: "delivery_unconfirmed", statusReason: "tracking_reconciliation_required", ok: false };
			}
			if (["smtp_accepted", "smtp_rejected"].includes(outcome)) {
				try {
					await project(recorded);
				}
				catch { event(id, "note_projection_pending"); }
				// Persistence precedes optional archival. A failed copy cannot lead to SMTP dispatch.
				try {
					await archive(id);
				}
				catch { event(id, "archive_tracking_requires_attention"); }
				try {
					const refreshed = await store.get(id);
					if (refreshed) return safeOperation(refreshed);
				}
				catch {}
				event(id, "archive_tracking_requires_attention");
				return { ...safeOperation(recorded), archivalStatus: null, statusReason: "archive_tracking_requires_attention" };
			}
			else {
				event(id, errorCode ?? "send_requires_review");
			}
			return safeOperation(recorded);
		};
		if (!deps.protectDispatch) return execute();
		let started = false;
		try {
			return await deps.protectDispatch(claimed, async () => {
				started = true;
				return execute();
			});
		}
		catch {
			if (started) return { operationId: id, noteId: claimed.noteId, evidenceStatus: "delivery_unconfirmed", statusReason: "tracking_reconciliation_required", ok: false };
			await store.change(id, { state: "sending", claimId }, { $set: { state: "send_failed", errorCode: "dispatch_identity_changed", evidenceRecordedAt: new Date() } });
			return safeOperation(await store.get(id));
		}
	}
	async function recover() {
		const cutoff = new Date(Date.now() - ORPHAN_AFTER_MS);
		const stale = await store.list({ state: "sending", claimedAt: { $lt: cutoff } }, 20);
		for (const record of stale) {
			await store.change(record._id, { state: "sending", claimId: record.claimId }, { $set: { state: "delivery_unconfirmed", errorCode: "orphaned_smtp_attempt", evidenceRecordedAt: new Date() } });
			event(record._id, "orphaned_smtp_attempt");
		}
		const staleArchive = await store.list({ archiveState: "archiving", archiveClaimedAt: { $lt: cutoff } }, 20);
		for (const record of staleArchive) {
			await store.change(record._id, { archiveState: "archiving" }, { $set: { archiveState: "review_required" } });
			event(record._id, "archive_outcome_ambiguous");
		}
		// Never automatically move preparing, failed or ambiguous attempts into queued.
		const pending = await store.list({ state: "queued" }, 5);
		for (const record of pending) {
			if (record.createdAt.getTime() < Date.now() - 300_000) {
				const signal = await store.change(record._id, { signalAt: { $exists: false } }, { $set: { signalAt: new Date() } });
				if (signal) event(record._id, "queued_send_stale");
			}
			await dispatch(record._id);
		}
		if (!enabled()) return;
		const archives = await store.list({ state: { $in: ["smtp_accepted", "smtp_rejected"] }, archiveState: { $in: ["pending", "retry"] } }, 5);
		for (const record of archives) {
			try {
				await project(record);
				await archive(record._id);
			}
			catch { event(record._id, "archive_tracking_requires_attention"); }
		}
	}
	return { prepare, dispatch, recover, archive };
}
export function safeOperation(record: SessionNoteSendRecord | null) {
	if (!record) throw new NoteWorkflowError(404, "operation_not_found");
	return {
		operationId: record._id,
		noteId: record.noteId,
		noteVersion: record.noteVersion,
		evidenceStatus: record.state,
		statusReason: record.errorCode ?? record.state,
		ok: record.state === "smtp_accepted",
		sentAt: record.sentAt?.toISOString() ?? null,
		archivalStatus: record.archiveState,
		associationStatus: record.note.associationStatus
	};
}
