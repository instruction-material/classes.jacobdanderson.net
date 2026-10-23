// src/controllers/users/userExtraController.ts
import type { RequestHandler } from "express";
import type { ISessionNote } from "../../types/entities/ISessionNote.js";
import type { CourseAccessStatus } from "../../types/entities/IUser.js";
import { Types } from "mongoose";
import { InternalEmail } from "../../models/schemas/InternalEmail.js";
import { ScheduledSession } from "../../models/schemas/ScheduledSession.js";
import { SessionNote } from "../../models/schemas/SessionNote.js";
import { Tutor } from "../../models/schemas/Tutor.js";
import { User } from "../../models/schemas/User.js";
import { withSessionNoteWriter } from "../../services/sessionNoteWriteFence.js";
import {
	deleteUserAccount,
	UserAccountDeletionAuthorizationError,
	UserAccountDeletionError
} from "../../services/userAccountDeletion.js";
import {
	AccountRoleTransferError,
	promoteUserAccount
} from "../../utils/accountRoleTransfer.js";
import { renderMarkdownEmailHtml } from "../../utils/markdownEmail.js";
import {
	defaultSessionNoteSubject,
	documentReferenceID,
	parseScheduledSessionPayload,
	serializeScheduledSession
} from "../../utils/scheduledSessions.js";
import { recordSecurityAuditEvent } from "../../utils/securityAudit.js";
import { normalizeNoteEmails, noteObjectId, NoteWorkflowError, resolveNoteIdentity, snapshotSession } from "../../utils/sessionNoteIdentity.js";

const MAX_COURSE_ID_LENGTH = 160;
const MAX_COMPLETED_ID_LENGTH = 256;
const MAX_COURSE_PROGRESS_IDS = 1000;
const MAX_COURSE_IDS = 1000;
const RESERVED_COURSE_CONTEXT_IDS = new Set(["__all__"]);

function getUserIDParam(req: { params: { userID?: string | string[] } }, res: any): string | null {
	const paramUserID = req.params.userID;
	const userID = Array.isArray(paramUserID) ? paramUserID[0] : paramUserID;
	if (typeof userID !== "string") {
		res.status(400).json({ message: "Invalid user ID" });
		return null;
	}
	if (!Types.ObjectId.isValid(userID)) {
		res.status(400).json({ message: "Invalid user ID" });
		return null;
	}
	return userID;
}

function normalizeRecipientName(value: string): string {
	return value.trim().toLowerCase();
}

function normalizeStringArray(value: unknown): string[] | null {
	if (!Array.isArray(value)) return null;
	return [...new Set(value.map(item => (typeof item === "string" ? item.trim() : "")).filter(Boolean))];
}

function normalizeCourseProgressIDs(value: unknown): string[] | null {
	if (!Array.isArray(value)) return null;
	if (value.length > MAX_COURSE_PROGRESS_IDS) return null;

	const ids: string[] = [];
	const seen = new Set<string>();
	for (const item of value) {
		if (typeof item !== "string") return null;
		const id = item.trim();
		if (!id || id.length > MAX_COMPLETED_ID_LENGTH) return null;
		if (seen.has(id)) continue;
		seen.add(id);
		ids.push(id);
	}
	return ids;
}

function normalizeCourseAccessIDs(value: unknown): string[] | null {
	if (!Array.isArray(value)) return null;
	if (value.length > MAX_COURSE_IDS) return null;

	const ids: string[] = [];
	const seen = new Set<string>();
	for (const item of value) {
		if (typeof item !== "string") return null;
		const id = item.trim();
		if (
			!id
			|| id.length > MAX_COURSE_ID_LENGTH
			|| RESERVED_COURSE_CONTEXT_IDS.has(id)
		) {
			return null;
		}
		if (seen.has(id)) continue;
		seen.add(id);
		ids.push(id);
	}
	return ids;
}

function normalizeCourseStatus(value: unknown): CourseAccessStatus {
	if (value === "available") return "available";
	if (value === "past") return "past";
	return "current";
}

function courseStatusFromMap(value: unknown, courseId: string): CourseAccessStatus | undefined {
	if (!value || typeof value !== "object" || Array.isArray(value)) return undefined;

	const status = (value as Record<string, unknown>)[courseId];
	if (typeof status === "undefined") return undefined;
	return normalizeCourseStatus(status);
}

function courseStatusForAccess(
	courseIds: string[],
	requestedStatus: unknown,
	existingStatus: unknown,
	hasRequestedStatus: boolean
) {
	const nextStatus: Record<string, CourseAccessStatus> = {};
	for (const courseId of courseIds) {
		nextStatus[courseId] = (hasRequestedStatus
			? courseStatusFromMap(requestedStatus, courseId)
			: courseStatusFromMap(existingStatus, courseId)) ?? "current";
	}
	return nextStatus;
}

function tutorOwnsUser(user: { tutors?: unknown[] } | null, tutorID: string) {
	return (
		user?.tutors?.some(tutor => documentReferenceID(tutor) === tutorID)
		?? false
	);
}

async function findManagedUserForSessionTools(req: Parameters<RequestHandler>[0], res: Parameters<RequestHandler>[1]) {
	const userID = getUserIDParam(req, res);
	if (!userID) return null;

	const user = await User.findById(userID).populate("tutors", "_id");
	if (!user) {
		res.sendStatus(404);
		return null;
	}

	if (req.currentAdmin) {
		return user;
	}

	const actingTutor = req.currentTutor;
	if (!actingTutor) {
		res.status(403).json({ message: "Tutor or admin session required" });
		return null;
	}

	if (!tutorOwnsUser(user, actingTutor._id.toString())) {
		res.status(403).json({ message: "You can only manage sessions for your own students" });
		return null;
	}

	return user;
}

function parseDateOnly(value: unknown): Date | null {
	if (typeof value !== "string") return null;

	const normalized = value.includes("T") ? value : `${value}T00:00:00.000Z`;
	const match = normalized.match(/^(\d{4})-(\d{2})-(\d{2})/);
	if (!match) return null;

	const [, yearStr, monthStr, dayStr] = match;
	const year = Number(yearStr);
	const month = Number(monthStr);
	const day = Number(dayStr);
	if (!year || !month || !day) return null;

	const date = new Date(Date.UTC(year, month - 1, day, 12));
	if (Number.isNaN(date.getTime())) return null;
	if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) {
		return null;
	}
	return date;
}

function serializeSessionNote(
	note: Pick<
		ISessionNote,
		| "_id"
		| "user"
		| "scheduledSessionId"
		| "studentName"
		| "primaryEmail"
		| "ccEmails"
		| "subject"
		| "sessionDate"
		| "markdown"
		| "createdAt"
		| "updatedAt"
	>
) {
	return {
		_id: String(note._id),
		studentId: note.user ? String(note.user) : null,
		scheduledSessionId: note.scheduledSessionId ? String(note.scheduledSessionId) : null,
		studentName: note.studentName,
		primaryEmail: note.primaryEmail,
		ccEmails: note.ccEmails ?? [],
		subject: note.subject,
		sessionDate: note.sessionDate,
		markdown: note.markdown,
		createdAt: note.createdAt,
		updatedAt: note.updatedAt
	};
}

async function getRecentSessionNotesForUser(userID: Types.ObjectId, _email: string) {
	const notes = await SessionNote.find({ user: userID })
		.sort({ sessionDate: -1, createdAt: -1 })
		.limit(3)
		.lean();

	return notes.map(serializeSessionNote);
}

export const getUsersOfTutor: RequestHandler = async (req, res) => {
	const paramTutorID = req.params.tutorID;
	const tutorID = Array.isArray(paramTutorID) ? paramTutorID[0] : paramTutorID;
	if (typeof tutorID !== "string") {
		return res.status(400).json({ message: "Invalid tutor ID" });
	}
	if (!Types.ObjectId.isValid(tutorID)) return res.status(400).json({ message: "Invalid tutor ID" });

	if (
		!req.currentAdmin
		&& req.currentTutor?._id.toString() !== tutorID
	) {
		return res.status(403).json({ message: "You can only view your own students" });
	}

	const requestedLimit = Number(req.query.limit);
	const requestedOffset = Number(req.query.offset);
	const limit = Number.isInteger(requestedLimit)
		? Math.min(Math.max(requestedLimit, 1), 250)
		: 100;
	const offset = Number.isInteger(requestedOffset)
		? Math.min(Math.max(requestedOffset, 0), 10_000)
		: 0;
	const users = await User.find({ tutors: new Types.ObjectId(tutorID) })
		.select("-password -recipientNameKey -sessionVersion")
		.sort({ name: 1 })
		.skip(offset)
		.limit(limit);
	res.setHeader("X-Result-Limit", String(limit));
	res.setHeader("X-Result-Offset", String(offset));
	res.json(users);
};

export const setUserTutors: RequestHandler = async (req, res) => {
	const paramUserID = req.params.userID;
	const userID = Array.isArray(paramUserID) ? paramUserID[0] : paramUserID;
	if (typeof userID !== "string") {
		return res.status(400).json({ message: "Invalid user ID" });
	}
	const { tutorIDs } = req.body as { tutorIDs?: string[] };
	if (!Types.ObjectId.isValid(userID)) return res.status(400).json({ message: "Invalid user ID" });
	if (!Array.isArray(tutorIDs)) return res.status(400).json({ message: "tutorIDs must be an array" });

	const cleanTutorIDs = [...new Set(tutorIDs)]
		.filter(id => Types.ObjectId.isValid(id))
		.map(id => new Types.ObjectId(id));

	const validTutors = await Tutor.find({ _id: { $in: cleanTutorIDs } }, { _id: 1 });
	const validTutorIds = validTutors.map(t => t._id);
	const user = await User.findById(userID);
	if (!user) return res.sendStatus(404);
	user.tutors = validTutorIds;
	await user.save();
	await recordSecurityAuditEvent(req, {
		action: "user.tutors.update",
		metadata: { tutorCount: validTutorIds.length },
		targetID: user._id,
		targetRole: "user"
	});
	res.json({ tutors: user.tutors });
};

export const setUserRecipientAssociation: RequestHandler = async (req, res) => {
	const userID = getUserIDParam(req, res);
	if (!userID) return;

	if (!req.currentAdmin) {
		return res.status(403).json({ message: "Admin session required" });
	}

	const rawRecipientName = req.body?.recipientName;
	const recipientName = typeof rawRecipientName === "string" ? rawRecipientName.trim() : "";
	const recipientNameKey = recipientName ? normalizeRecipientName(recipientName) : undefined;

	if (recipientNameKey) {
		const existingUser = await User.findOne(
			{
				recipientNameKey,
				_id: { $ne: userID }
			},
			{ _id: 1, name: 1 }
		).lean();

		if (existingUser) {
			return res.status(409).json({
				message: `Recipient name is already associated with ${existingUser.name}.`
			});
		}
	}

	const user = await User.findById(userID);
	if (!user) return res.sendStatus(404);

	user.recipientName = recipientName || undefined;
	user.recipientNameKey = recipientNameKey;
	await user.save();

	res.json({ recipientName: user.recipientName ?? null });
};

export const setUserCourseAccess: RequestHandler = async (req, res) => {
	const paramUserID = req.params.userID;
	const userID = Array.isArray(paramUserID) ? paramUserID[0] : paramUserID;
	if (typeof userID !== "string") {
		return res.status(400).json({ message: "Invalid user ID" });
	}
	const { courseIDs } = req.body as {
		courseIDs?: string[];
		courseStatus?: Record<string, unknown>;
	};
	if (!Types.ObjectId.isValid(userID)) return res.status(400).json({ message: "Invalid user ID" });
	if (!Array.isArray(courseIDs)) return res.status(400).json({ message: "courseIDs must be an array" });

	const uniqueCourses = normalizeCourseAccessIDs(courseIDs);
	if (!uniqueCourses) {
		return res.status(400).json({
			message: `courseIDs must contain at most ${MAX_COURSE_IDS} non-empty string IDs of ${MAX_COURSE_ID_LENGTH} characters or fewer`
		});
	}

	const user = await User.findById(userID).populate("tutors", "_id");
	if (!user) return res.sendStatus(404);

	const actingTutor = req.currentTutor;
	const actingAdmin = req.currentAdmin;

	if (!actingAdmin) {
		if (!actingTutor) {
			return res.status(403).json({ message: "Tutor session required" });
		}

		if (!tutorOwnsUser(user, actingTutor._id.toString())) {
			return res.status(403).json({ message: "You can only assign courses for your own students" });
		}

		const allowed = new Set(actingTutor.coursePermissions ?? []);
		const invalidCourse = uniqueCourses.find(course => !allowed.has(course));
		if (invalidCourse) {
			return res.status(403).json({ message: `Course ${invalidCourse} is not enabled for this tutor` });
		}
	}

	user.courseAccess = uniqueCourses;
	user.courseStatus = courseStatusForAccess(
		uniqueCourses,
		req.body?.courseStatus,
		user.courseStatus,
		!!req.body?.courseStatus
	);
	await user.save();
	await recordSecurityAuditEvent(req, {
		action: "user.course-access.update",
		metadata: { courseCount: uniqueCourses.length },
		targetID: user._id,
		targetRole: "user"
	});
	res.json({ courseAccess: user.courseAccess, courseStatus: user.courseStatus });
};

export const setUserCourseProgress: RequestHandler = async (req, res) => {
	const userID = getUserIDParam(req, res);
	if (!userID) return;

	const courseId = typeof req.body?.courseId === "string" ? req.body.courseId.trim() : "";
	const completedModuleIds = normalizeCourseProgressIDs(req.body?.completedModuleIds ?? []);
	const completedItemIds = normalizeCourseProgressIDs(req.body?.completedItemIds ?? []);

	if (
		!courseId
		|| courseId.length > MAX_COURSE_ID_LENGTH
		|| RESERVED_COURSE_CONTEXT_IDS.has(courseId)
	) {
		return res.status(400).json({
			message: `courseId is required and must be ${MAX_COURSE_ID_LENGTH} characters or fewer`
		});
	}

	if (!completedModuleIds || !completedItemIds) {
		return res.status(400).json({
			message: `Completed IDs must be arrays with at most ${MAX_COURSE_PROGRESS_IDS} non-empty string IDs of ${MAX_COMPLETED_ID_LENGTH} characters or fewer`
		});
	}

	const user = await User.findById(userID).populate("tutors", "_id");
	if (!user) return res.sendStatus(404);

	if (!(user.courseAccess ?? []).includes(courseId)) {
		return res.status(400).json({ message: "Course must be assigned before progress can be updated" });
	}

	const actingTutor = req.currentTutor;
	const actingAdmin = req.currentAdmin;

	if (!actingAdmin) {
		if (!actingTutor) {
			return res.status(403).json({ message: "Tutor session required" });
		}

		if (!tutorOwnsUser(user, actingTutor._id.toString())) {
			return res.status(403).json({ message: "You can only update progress for your own students" });
		}

		const allowed = new Set(actingTutor.coursePermissions ?? []);
		if (!allowed.has(courseId)) {
			return res.status(403).json({ message: `Course ${courseId} is not enabled for this tutor` });
		}
	}

	const existingProgress = (user.courseProgress ?? []).filter(progress => progress.courseId !== courseId);
	const updatedBy = actingAdmin?._id ?? actingTutor?._id;
	const updatedByRole: "admin" | "tutor" = actingAdmin ? "admin" : "tutor";
	user.courseProgress = [
		...existingProgress,
		{
			courseId,
			completedModuleIds,
			completedItemIds,
			updatedAt: new Date(),
			...(updatedBy ? { updatedBy } : {}),
			updatedByRole
		}
	].sort((a, b) => (user.courseAccess ?? []).indexOf(a.courseId) - (user.courseAccess ?? []).indexOf(b.courseId));

	await user.save();
	res.json({ courseProgress: user.courseProgress });
};

export const getUserSchedule: RequestHandler = async (req, res) => {
	const user = await findManagedUserForSessionTools(req, res);
	if (!user) return;

	const rawFrom = typeof req.query.from === "string" ? req.query.from : "";
	const from = rawFrom ? new Date(rawFrom) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
	if (Number.isNaN(from.getTime())) {
		return res.status(400).json({ message: "from must be a valid date" });
	}

	const sessions = await ScheduledSession.find({
		user: user._id,
		startAt: { $gte: from }
	})
		.sort({ startAt: 1, createdAt: 1 })
		.limit(50);

	res.json({ scheduledSessions: sessions.map(serializeScheduledSession) });
};

export const createUserScheduledSession: RequestHandler = async (req, res) => {
	const user = await findManagedUserForSessionTools(req, res);
	if (!user) return;

	let parsed;
	try {
		parsed = parseScheduledSessionPayload(req.body ?? {}, { sourceEmail: user.email });
	}
	catch (err) {
		return res.status(400).json({ message: err instanceof Error ? err.message : "Invalid scheduled session" });
	}

	let tutorID = parsed.tutorId;
	if (req.currentTutor) {
		if (tutorID && tutorID !== req.currentTutor._id.toString()) {
			return res.status(403).json({ message: "Tutors can only assign themselves to sessions" });
		}
		tutorID = req.currentTutor._id.toString();
	}

	if (tutorID) {
		if (!Types.ObjectId.isValid(tutorID)) {
			return res.status(400).json({ message: "Invalid tutor ID" });
		}
		if (!tutorOwnsUser(user, tutorID)) {
			return res.status(400).json({ message: "Tutor must be assigned to this student before scheduling" });
		}
	}

	const scheduledSession = await ScheduledSession.create({
		user: user._id,
		tutor: tutorID ? new Types.ObjectId(tutorID) : undefined,
		title: parsed.title,
		courseId: parsed.courseId,
		startAt: parsed.startAt,
		endAt: parsed.endAt,
		timezone: parsed.timezone,
		status: parsed.status,
		notes: parsed.notes,
		sourceEmail: parsed.sourceEmail,
		externalEventId: parsed.externalEventId,
		recurrenceId: parsed.recurrenceId
	});

	res.status(201).json({ scheduledSession: serializeScheduledSession(scheduledSession) });
};

export const updateUserScheduledSession: RequestHandler = async (req, res) => {
	const user = await findManagedUserForSessionTools(req, res);
	if (!user) return;

	const rawSessionID = req.params.sessionID;
	const sessionID = Array.isArray(rawSessionID) ? rawSessionID[0] : rawSessionID;
	if (typeof sessionID !== "string" || !Types.ObjectId.isValid(sessionID)) {
		return res.status(400).json({ message: "Invalid session ID" });
	}

	const scheduledSession = await ScheduledSession.findOne({
		_id: sessionID,
		user: user._id
	});
	if (!scheduledSession) return res.sendStatus(404);

	let parsed;
	try {
		parsed = parseScheduledSessionPayload(
			{
				title: req.body?.title ?? scheduledSession.title,
				courseId: req.body?.courseId ?? scheduledSession.courseId,
				startAt: req.body?.startAt ?? scheduledSession.startAt,
				endAt: req.body?.endAt ?? scheduledSession.endAt,
				timezone: req.body?.timezone ?? scheduledSession.timezone,
				status: req.body?.status ?? scheduledSession.status,
				notes: req.body?.notes ?? scheduledSession.notes,
				sourceEmail: req.body?.sourceEmail ?? scheduledSession.sourceEmail,
				externalEventId: req.body?.externalEventId ?? scheduledSession.externalEventId,
				recurrenceId: req.body?.recurrenceId ?? scheduledSession.recurrenceId,
				tutorId: req.body?.tutorId
			},
			{
				sourceEmail: scheduledSession.sourceEmail ?? user.email,
				status: scheduledSession.status
			}
		);
	}
	catch (err) {
		return res.status(400).json({ message: err instanceof Error ? err.message : "Invalid scheduled session" });
	}

	let tutorID = parsed.tutorId ?? documentReferenceID(scheduledSession.tutor);
	if (req.currentTutor) {
		if (tutorID && tutorID !== req.currentTutor._id.toString()) {
			return res.status(403).json({ message: "Tutors can only assign themselves to sessions" });
		}
		tutorID = req.currentTutor._id.toString();
	}

	if (tutorID) {
		if (!Types.ObjectId.isValid(tutorID)) {
			return res.status(400).json({ message: "Invalid tutor ID" });
		}
		if (!tutorOwnsUser(user, tutorID)) {
			return res.status(400).json({ message: "Tutor must be assigned to this student before scheduling" });
		}
	}

	if (scheduledSession.startAt.getTime() !== parsed.startAt.getTime() || scheduledSession.endAt.getTime() !== parsed.endAt.getTime() || scheduledSession.timezone !== parsed.timezone) {
		if ((scheduledSession.scheduleHistory?.length ?? 0) >= 200) return res.status(409).json({ message: "Schedule history requires operator review" });
		const previous = snapshotSession(scheduledSession);
		const next = { startAt: parsed.startAt, endAt: parsed.endAt, timezone: parsed.timezone };
		scheduledSession.scheduleHistory = [...(scheduledSession.scheduleHistory ?? []), { at: new Date(), actorId: String(req.currentAdmin?._id ?? req.currentTutor?._id), previous, next }];
		scheduledSession.scheduleRevision = (scheduledSession.scheduleRevision ?? 0) + 1;
	}
	scheduledSession.title = parsed.title;
	scheduledSession.courseId = parsed.courseId;
	scheduledSession.startAt = parsed.startAt;
	scheduledSession.endAt = parsed.endAt;
	scheduledSession.timezone = parsed.timezone;
	scheduledSession.status = parsed.status;
	scheduledSession.notes = parsed.notes;
	scheduledSession.sourceEmail = parsed.sourceEmail;
	scheduledSession.externalEventId = parsed.externalEventId;
	scheduledSession.recurrenceId = parsed.recurrenceId;
	scheduledSession.tutor = tutorID ? new Types.ObjectId(tutorID) : undefined;

	await scheduledSession.save();
	res.json({ scheduledSession: serializeScheduledSession(scheduledSession) });
};

export const getUserRecentSessionNotes: RequestHandler = async (req, res) => {
	const user = await findManagedUserForSessionTools(req, res);
	if (!user) return;

	const sessionNotes = await getRecentSessionNotesForUser(user._id, user.email);
	res.json({ sessionNotes });
};

export const createUserSessionNote: RequestHandler = async (req, res) => {
	const user = await findManagedUserForSessionTools(req, res);
	if (!user) return;

	const sessionDate = parseDateOnly(req.body?.sessionDate);
	if (!sessionDate) {
		return res.status(400).json({ message: "sessionDate must be a valid date" });
	}

	const markdown
		= typeof req.body?.markdown === "string"
			? req.body.markdown
			: typeof req.body?.md === "string"
				? req.body.md
				: "";
	if (!markdown.trim()) {
		return res.status(400).json({ message: "markdown is required" });
	}

	let ccEmails = normalizeStringArray(req.body?.ccEmails ?? []);
	if (!ccEmails) {
		return res.status(400).json({ message: "ccEmails must be an array" });
	}

	ccEmails = normalizeNoteEmails(ccEmails);
	const rawSubject = typeof req.body?.subject === "string" ? req.body.subject.trim() : "";
	const subject = rawSubject || defaultSessionNoteSubject(sessionDate);
	const html = await renderMarkdownEmailHtml(markdown);

	let identity;
	try {
		if (req.body?.scheduledSessionId && !noteObjectId.safeParse(req.body.scheduledSessionId).success) return res.status(400).json({ message: "Invalid session identity" });
		identity = await resolveNoteIdentity(req, { studentId: String(user._id), scheduledSessionId: req.body?.scheduledSessionId, unlinked: req.body?.unlinked === true, primaryEmail: typeof req.body?.primaryEmail === "string" ? req.body.primaryEmail : undefined });
	}
	catch (e) { return res.status(e instanceof NoteWorkflowError ? e.status : 503).json({ message: e instanceof NoteWorkflowError ? e.code : "Identity unavailable" }); }
	if (ccEmails.some(email => !/^[^\s@]+@[^\s@][^\s.@]*\.[^\s@]+$/.test(email))) return res.status(400).json({ message: "Invalid CC addresses" });
	if (markdown.length > 200_000 || subject.length > 200 || ccEmails.length > 20) return res.status(413).json({ message: "Note too large" });
	const note = await withSessionNoteWriter(String(user._id), () => SessionNote.create({
		workflowVersion: 2,
		savedAt: new Date(),
		scheduledSessionId: identity.scheduledSessionId,
		sessionSnapshot: identity.sessionSnapshot,
		associationStatus: identity.associationStatus,
		user: user._id,
		studentName: user.name,
		primaryEmail: typeof req.body?.primaryEmail === "string" ? req.body.primaryEmail.trim().toLowerCase() : user.email.trim().toLowerCase(),
		ccEmails,
		subject,
		sessionDate,
		markdown,
		html
	}));

	const recentSessionNotes = await getRecentSessionNotesForUser(user._id, user.email);
	res.status(201).json({
		sessionNote: serializeSessionNote(note),
		recentSessionNotes
	});
};

export const promoteUserToTutor: RequestHandler = async (req, res) => {
	const paramUserID = req.params.userID;
	const userID = Array.isArray(paramUserID) ? paramUserID[0] : paramUserID;
	if (typeof userID !== "string") {
		return res.status(400).json({ message: "Invalid user ID" });
	}
	if (!Types.ObjectId.isValid(userID)) return res.status(400).json({ message: "Invalid user ID" });
	try {
		const tutor = await promoteUserAccount(userID);
		await recordSecurityAuditEvent(req, {
			action: "account.promote.user-to-tutor",
			targetID: tutor._id,
			targetRole: "tutor"
		});
		return res.status(201).json({ tutor });
	}
	catch (error) {
		if (error instanceof NoteWorkflowError) return res.status(error.status).json({ message: error.code });
		if (error instanceof AccountRoleTransferError) {
			await recordSecurityAuditEvent(req, {
				action: "account.promote.user-to-tutor",
				metadata: { statusCode: error.statusCode },
				outcome: "denied",
				targetID: userID,
				targetRole: "user"
			});
			if (error.statusCode === 404) return res.sendStatus(404);
			return res.status(error.statusCode).json({ message: error.message });
		}
		throw error;
	}
};

async function deleteUserAccountAndRecordAudit(
	req: Parameters<RequestHandler>[0],
	res: Parameters<RequestHandler>[1],
	userID: Types.ObjectId,
	action: string,
	{
		omitActor = false,
		requiredTutorID
	}: {
		omitActor?: boolean;
		requiredTutorID?: Types.ObjectId;
	} = {}
) {
	try {
		const result = requiredTutorID
			? await deleteUserAccount(userID, { requiredTutorID })
			: await deleteUserAccount(userID);
		if (!result.deleted) return res.sendStatus(404);

		await recordSecurityAuditEvent(req, {
			action,
			...(omitActor ? { omitActor: true } : {}),
			targetID: result.auditSubjectID,
			targetRole: "user"
		});
		if (omitActor) {
			// cookie-session clears its signed cookie when assigned null. The
			// legacy express-session augmentation does not expose that runtime
			// value in this repository's Request type.
			(req as unknown as { session: null }).session = null;
		}
		return res.sendStatus(200);
	}
	catch (error) {
		if (error instanceof NoteWorkflowError) return res.status(error.status).json({ message: error.code });
		if (error instanceof UserAccountDeletionAuthorizationError) {
			return res.status(error.statusCode).json({ message: error.message });
		}
		if (error instanceof UserAccountDeletionError) {
			return res.status(error.statusCode).json({ message: error.message });
		}
		throw error;
	}
}

export const deleteOwnUser: RequestHandler = async (req, res) => {
	const userID = getUserIDParam(req, res);
	if (!userID) return;

	const actingUser = req.currentUser;
	if (!actingUser) {
		return res.status(403).json({ message: "User session required" });
	}

	if (actingUser._id.toString() !== userID) {
		return res.status(403).json({ message: "You can only delete your own account" });
	}

	const user = await User.findById(userID);
	if (!user) return res.sendStatus(404);

	return deleteUserAccountAndRecordAudit(
		req,
		res,
		user._id,
		"user.delete-self",
		{ omitActor: true }
	);
};

export const deleteUserAsTutor: RequestHandler = async (req, res) => {
	const userID = getUserIDParam(req, res);
	if (!userID) return;

	const actingTutor = req.currentTutor;
	if (!actingTutor) {
		return res.status(403).json({ message: "Tutor session required" });
	}

	const user = await User.findById(userID).populate("tutors", "_id");
	if (!user) return res.sendStatus(404);

	if (!tutorOwnsUser(user, actingTutor._id.toString())) {
		return res.status(403).json({ message: "You can only delete your own students" });
	}

	return deleteUserAccountAndRecordAudit(
		req,
		res,
		user._id,
		"user.delete-by-tutor",
		{ requiredTutorID: actingTutor._id }
	);
};

export const deleteUserAsAdmin: RequestHandler = async (req, res) => {
	const userID = getUserIDParam(req, res);
	if (!userID) return;

	if (!req.currentAdmin) {
		return res.status(403).json({ message: "Admin session required" });
	}

	const user = await User.findById(userID);
	if (!user) return res.sendStatus(404);

	return deleteUserAccountAndRecordAudit(
		req,
		res,
		user._id,
		"user.delete-by-admin"
	);
};

export const getLoggedInUserCommunications: RequestHandler = async (req, res) => {
	const actingUser = req.currentUser;
	if (!actingUser) {
		return res.status(403).json({ message: "User session required" });
	}

	const normalizedEmail = actingUser.email.trim().toLowerCase();
	const [sessionNotes, internalEmails, scheduledSessions] = await Promise.all([
		getRecentSessionNotesForUser(actingUser._id, normalizedEmail),
		InternalEmail.find({ user: actingUser._id }).sort({ sentAt: -1, createdAt: -1 }).limit(12).lean(),
		ScheduledSession.find({
			user: actingUser._id,
			startAt: { $gte: new Date() }
		})
			.sort({ startAt: 1, createdAt: 1 })
			.limit(12)
	]);

	return res.json({
		sessionNotes,
		internalEmails: internalEmails.map(email => ({
			_id: String(email._id),
			matchedRecipientEmail: email.matchedRecipientEmail,
			primaryEmail: email.primaryEmail,
			ccEmails: email.ccEmails ?? [],
			fromAddress: email.fromAddress,
			subject: email.subject,
			markdown: email.markdown,
			messageId: email.messageId ?? null,
			transportUsed: email.transportUsed,
			sentAt: email.sentAt,
			createdAt: email.createdAt,
			updatedAt: email.updatedAt
		})),
		scheduledSessions: scheduledSessions.map(serializeScheduledSession)
	});
};
