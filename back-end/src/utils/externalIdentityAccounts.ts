import type {
	ExternalIdentityAccountRole,
	ExternalIdentityProvider
} from "../types/entities/IExternalIdentity.js";
import type { AccountCandidate } from "./accountSessions.js";
import { createHash } from "node:crypto";
import { Admin } from "../models/schemas/Admin.js";
import { ExternalIdentity } from "../models/schemas/ExternalIdentity.js";
import { Tutor } from "../models/schemas/Tutor.js";
import { User } from "../models/schemas/User.js";
import {
	accountCandidatesByPriority,
	findAccountsByEmail
} from "./accountSessions.js";

export type ExternalIdentityErrorCode
	= | "account_not_found"
		| "email_unverified"
		| "identity_conflict";

export class ExternalIdentityAccountError extends Error {
	readonly code: ExternalIdentityErrorCode;

	constructor(code: ExternalIdentityErrorCode) {
		super(code);
		this.name = "ExternalIdentityAccountError";
		this.code = code;
	}
}

function isDuplicateKeyError(error: unknown): error is { code: number } {
	return typeof error === "object"
		&& error !== null
		&& "code" in error
		&& error.code === 11000;
}

export function externalIdentitySubjectHash(
	provider: ExternalIdentityProvider,
	subject: string
) {
	return createHash("sha256")
		.update(provider)
		.update("\0")
		.update(subject)
		.digest("hex");
}

async function candidateForRole(
	role: ExternalIdentityAccountRole,
	accountID: unknown
): Promise<AccountCandidate | null> {
	if (role === "admin") {
		const entity = await Admin.findById(accountID).exec();
		return entity
			? {
					entity,
					responseKey: "currentAdmin",
					role,
					sessionKey: "adminID"
				}
			: null;
	}
	if (role === "tutor") {
		const entity = await Tutor.findById(accountID).exec();
		return entity
			? {
					entity,
					responseKey: "currentTutor",
					role,
					sessionKey: "tutorID"
				}
			: null;
	}

	const entity = await User.findById(accountID).exec();
	return entity
		? {
				entity,
				responseKey: "currentUser",
				role,
				sessionKey: "userID"
			}
		: null;
}

async function linkedCandidate(
	provider: ExternalIdentityProvider,
	subject: string
) {
	const subjectHash = externalIdentitySubjectHash(provider, subject);
	let identity = await ExternalIdentity.findOne({
		provider,
		subject: subjectHash
	}).exec();
	let usesLegacyRawSubject = false;
	if (!identity) {
		identity = await ExternalIdentity.findOne({ provider, subject }).exec();
		usesLegacyRawSubject = !!identity;
	}
	if (!identity) return null;

	const candidate = await candidateForRole(
		identity.accountRole,
		identity.accountID
	);
	if (!candidate?.entity) {
		await ExternalIdentity.deleteOne({ _id: identity._id }).exec();
		return null;
	}

	const updates: Record<string, unknown> = { lastLoginAt: new Date() };
	if (usesLegacyRawSubject) updates.subject = subjectHash;
	try {
		await ExternalIdentity.updateOne(
			{ _id: identity._id },
			{
				$set: updates,
				$unset: { emailAtLink: 1 }
			}
		).exec();
	}
	catch (error) {
		if (isDuplicateKeyError(error)) {
			throw new ExternalIdentityAccountError("identity_conflict");
		}
		throw error;
	}
	return candidate;
}

export async function resolveExternalIdentityAccount({
	email,
	provider,
	subject
}: {
	email: string | null;
	provider: ExternalIdentityProvider;
	subject: string;
}): Promise<AccountCandidate> {
	const existingLink = await linkedCandidate(provider, subject);
	if (existingLink?.entity) return existingLink;
	if (!email) {
		throw new ExternalIdentityAccountError("email_unverified");
	}

	const accounts = await findAccountsByEmail(email);
	const matchingCandidates = accountCandidatesByPriority(accounts)
		.filter(item => item.entity);
	if (matchingCandidates.length > 1) {
		throw new ExternalIdentityAccountError("identity_conflict");
	}
	const candidate = matchingCandidates[0];
	if (!candidate?.entity) {
		throw new ExternalIdentityAccountError("account_not_found");
	}

	try {
		await ExternalIdentity.create({
			accountID: candidate.entity._id,
			accountRole: candidate.role,
			lastLoginAt: new Date(),
			provider,
			subject: externalIdentitySubjectHash(provider, subject)
		});
		return candidate;
	}
	catch (error) {
		if (!isDuplicateKeyError(error)) throw error;

		const racedLink = await linkedCandidate(provider, subject);
		if (
			racedLink?.entity
			&& racedLink.role === candidate.role
			&& racedLink.entity._id.toString() === candidate.entity._id.toString()
		) {
			return racedLink;
		}
		throw new ExternalIdentityAccountError("identity_conflict");
	}
}
