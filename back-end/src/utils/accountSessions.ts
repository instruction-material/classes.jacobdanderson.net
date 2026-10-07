import type { IAdmin } from "../types/entities/IAdmin.js";
import type { ITutor } from "../types/entities/ITutor.js";
import type { IUser } from "../types/entities/IUser.js";
import type { CustomSession } from "../types/session/CustomSession.js";
import { Admin } from "../models/schemas/Admin.js";
import { Tutor } from "../models/schemas/Tutor.js";
import { User } from "../models/schemas/User.js";

export type AccountEntity = IAdmin | ITutor | IUser;
export type AccountRole = "admin" | "tutor" | "user";
export type AccountSessionKey = "adminID" | "tutorID" | "userID";
export type AccountResponseKey = "currentAdmin" | "currentTutor" | "currentUser";
export const DEFAULT_AUTHENTICATED_SESSION_MAX_AGE_MS
	= 24 * 60 * 60 * 1000;
export const REMEMBERED_AUTHENTICATED_SESSION_MAX_AGE_MS
	= 30 * 24 * 60 * 60 * 1000;

export interface AccountCandidate {
	entity: AccountEntity | null;
	responseKey: AccountResponseKey;
	role: AccountRole;
	sessionKey: AccountSessionKey;
}

export async function findAccountsByEmail(normalizedEmail: string) {
	const [user, tutor, admin] = (await Promise.all([
		User.findOne({ email: normalizedEmail }).exec(),
		Tutor.findOne({ email: normalizedEmail }).exec(),
		Admin.findOne({ email: normalizedEmail }).exec()
	])) as [IUser | null, ITutor | null, IAdmin | null];

	return { admin, tutor, user };
}

export async function accountEmailExists(normalizedEmail: string) {
	const [user, tutor, admin] = await Promise.all([
		User.exists({ email: normalizedEmail }),
		Tutor.exists({ email: normalizedEmail }),
		Admin.exists({ email: normalizedEmail })
	]);
	return !!(user || tutor || admin);
}

export function accountCandidatesByPriority(accounts: {
	admin: IAdmin | null;
	tutor: ITutor | null;
	user: IUser | null;
}): AccountCandidate[] {
	return [
		{
			entity: accounts.admin,
			responseKey: "currentAdmin",
			role: "admin",
			sessionKey: "adminID"
		},
		{
			entity: accounts.tutor,
			responseKey: "currentTutor",
			role: "tutor",
			sessionKey: "tutorID"
		},
		{
			entity: accounts.user,
			responseKey: "currentUser",
			role: "user",
			sessionKey: "userID"
		}
	];
}

export function clearSessionRoles(session: CustomSession) {
	delete session.adminID;
	delete session.tutorID;
	delete session.userID;
	delete session.courseCodeLearnerID;
	delete session.courseCodeCredentialVersion;
	delete session.accountSessionVersion;
	delete session.authenticatedSessionExpiresAt;
}

export function authenticatedSessionMaxAge(remember: boolean) {
	return remember
		? REMEMBERED_AUTHENTICATED_SESSION_MAX_AGE_MS
		: DEFAULT_AUTHENTICATED_SESSION_MAX_AGE_MS;
}

export function setAuthenticatedSessionLifetime(
	session: CustomSession,
	maxAge = DEFAULT_AUTHENTICATED_SESSION_MAX_AGE_MS,
	now = Date.now()
) {
	if (!Number.isSafeInteger(maxAge) || maxAge <= 0) {
		throw new TypeError("Authenticated session lifetime must be a positive integer");
	}
	session.authenticatedSessionExpiresAt = now + maxAge;
}

export function setAuthenticatedSessionCookieLifetime(
	request: object,
	maxAge: number
) {
	const req = request as {
		sessionOptions?: { maxAge?: number };
	};
	const options = (req.sessionOptions ??= {});
	options.maxAge = maxAge;
}

export function authenticatedSessionIsCurrent(
	session: CustomSession,
	now = Date.now()
) {
	return Number.isSafeInteger(session.authenticatedSessionExpiresAt)
		&& (session.authenticatedSessionExpiresAt as number) > now;
}

export function getAccountID(entity: AccountEntity) {
	return entity._id.toString();
}

export function serializeAccountEntity(
	entity: AccountEntity
): Record<string, unknown> {
	const serializableEntity
		= "toJSON" in entity && typeof entity.toJSON === "function"
			? entity.toJSON()
			: { ...entity };
	const {
		password: _password,
		sessionVersion: _sessionVersion,
		emailChange: _emailChange,
		...safeEntity
	}
		= serializableEntity as Record<string, unknown>;
	return safeEntity;
}

export function establishAccountSession(
	session: CustomSession,
	candidate: Pick<AccountCandidate, "entity" | "sessionKey">,
	maxAge = DEFAULT_AUTHENTICATED_SESSION_MAX_AGE_MS
) {
	if (!candidate.entity) {
		throw new TypeError("Cannot establish a session without an account");
	}

	clearSessionRoles(session);
	session[candidate.sessionKey] = getAccountID(candidate.entity);
	session.accountSessionVersion = candidate.entity.sessionVersion ?? 0;
	setAuthenticatedSessionLifetime(session, maxAge);
}

export function accountSessionVersionMatches(
	session: CustomSession,
	entity: AccountEntity
) {
	return authenticatedSessionIsCurrent(session)
		&& Number.isInteger(session.accountSessionVersion)
		&& session.accountSessionVersion === (entity.sessionVersion ?? 0);
}
