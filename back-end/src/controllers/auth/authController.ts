// src/controllers/auth/authController.ts
import type { RequestHandler } from "express";
import type { Model } from "mongoose";
import type { PasswordResetRole } from "../../models/schemas/PasswordResetToken.js";
import type { CustomSession } from "../../types/session/CustomSession.js";
import { createHash, randomBytes } from "node:crypto";
import { env } from "node:process";
import { Types } from "mongoose";
import { Admin } from "../../models/schemas/Admin.js";
import { PasswordResetToken } from "../../models/schemas/PasswordResetToken.js";
import { Tutor } from "../../models/schemas/Tutor.js";
import { User } from "../../models/schemas/User.js";
import {
	accountCandidatesByPriority,
	clearSessionRoles,
	establishAccountSession,
	findAccountsByEmail,
	getAccountID,
	serializeAccountEntity
} from "../../utils/accountSessions.js";
import { clearOAuthBrowserBindings } from "../../utils/oauthBrowserBinding.js";
import { recordSecurityAuditEvent } from "../../utils/securityAudit.js";
import { sendTransactionalEmail } from "../../utils/transactionalEmail.js";

type Entity = Parameters<typeof getAccountID>[0];
type SelectedLoginCandidate = ReturnType<typeof accountCandidatesByPriority>[number] & {
	entity: Entity;
};

const THIRTY_DAYS_MS: number = 30 * 24 * 60 * 60 * 1000;
const PASSWORD_RESET_EXPIRY_MS = 30 * 60 * 1000;
const PASSWORD_RESET_TOKEN_PATTERN = /^[a-f\d]{64}$/i;
const PASSWORD_RESET_RESPONSE = {
	message: "If an account uses that email, a password reset link is on its way."
};
const DEFAULT_SITE_ORIGIN = "https://example.com";

function hashResetToken(token: string) {
	return createHash("sha256").update(token).digest("hex");
}

function isValidEmailAddress(email: string) {
	const atIndex = email.indexOf("@");
	const domain = email.slice(atIndex + 1);
	return email.length <= 320
		&& atIndex > 0
		&& atIndex === email.lastIndexOf("@")
		&& !/\s/u.test(email)
		&& domain.includes(".")
		&& !domain.startsWith(".")
		&& !domain.endsWith(".");
}

function getPasswordResetUrl(token: string) {
	const configuredOrigin = env.PASSWORD_RESET_ORIGIN?.trim() || DEFAULT_SITE_ORIGIN;
	let origin = DEFAULT_SITE_ORIGIN;
	try {
		origin = new URL(configuredOrigin).origin;
	}
	catch {
		console.warn("PASSWORD_RESET_ORIGIN is invalid; using the fallback site origin.");
	}

	const resetUrl = new URL("/reset-password", origin);
	resetUrl.searchParams.set("token", token);
	return resetUrl.toString();
}

async function deliverPasswordReset(normalizedEmail: string) {
	const accounts = await findAccountsByEmail(normalizedEmail);
	const candidate = [
		{ entity: accounts.admin, role: "admin" as const },
		{ entity: accounts.tutor, role: "tutor" as const },
		{ entity: accounts.user, role: "user" as const }
	].find(item => item.entity);

	if (!candidate?.entity) return;

	const token = randomBytes(32).toString("hex");
	const tokenHash = hashResetToken(token);
	const expiresAt = new Date(Date.now() + PASSWORD_RESET_EXPIRY_MS);

	await PasswordResetToken.findOneAndUpdate(
		{ role: candidate.role, accountID: candidate.entity._id },
		{
			$set: {
				email: normalizedEmail,
				expiresAt,
				tokenHash
			},
			$unset: {
				claimID: 1,
				claimedAt: 1
			}
		},
		{ new: true, setDefaultsOnInsert: true, upsert: true }
	).exec();

	const resetUrl = getPasswordResetUrl(token);
	try {
		await sendTransactionalEmail({
			to: normalizedEmail,
			subject: "Reset your Classes password",
			text: [
				"Use the link below to choose a new password for your Classes account.",
				"",
				resetUrl,
				"",
				"This link expires in 30 minutes and can be used once.",
				"If you did not request this reset, you can ignore this email."
			].join("\n"),
			html: [
				"<p>Use the link below to choose a new password for your Classes account.</p>",
				`<p><a href="${resetUrl}">Choose a new password</a></p>`,
				"<p>This link expires in 30 minutes and can be used once.</p>",
				"<p>If you did not request this reset, you can ignore this email.</p>"
			].join("")
		});
	}
	catch (error) {
		await PasswordResetToken.deleteOne({ tokenHash }).exec();
		throw error;
	}
}

function canMutate(session: CustomSession, entity: Entity) {
	if (session.adminID) return true;
	const entityId: string = getAccountID(entity);
	if (entity instanceof Admin) return session.adminID === entityId;
	if (entity instanceof Tutor) return session.tutorID === entityId;
	if (entity instanceof User) return session.userID === entityId;
	return false;
}

// LOGIN
export const login: RequestHandler = async (req, res) => {
	const normalizedEmail = typeof req.body?.email === "string"
		? req.body.email.trim().toLowerCase()
		: "";
	const password = typeof req.body?.password === "string"
		? req.body.password
		: "";
	const remember = req.body?.remember === true;
	if (
		!isValidEmailAddress(normalizedEmail)
		|| password.length === 0
		|| password.length > 256
	) {
		return res.sendStatus(400);
	}

	const { admin, tutor, user } = await findAccountsByEmail(normalizedEmail);

	const candidates = accountCandidatesByPriority({ admin, tutor, user });
	let selectedCandidate: SelectedLoginCandidate | undefined;
	for (const candidate of candidates) {
		if (!candidate.entity) continue;
		try {
			if (await candidate.entity.comparePassword(password)) {
				selectedCandidate = { ...candidate, entity: candidate.entity };
				break;
			}
		}
		catch {
			console.warn(`Ignoring an unreadable ${candidate.role} password hash during login.`);
		}
	}

	if (!selectedCandidate) {
		return res.status(403).json({ message: "Bad credentials" });
	}

	const session = req.session as CustomSession;
	establishAccountSession(session, selectedCandidate);

	const options = ((req as any).sessionOptions ??= {});
	options.maxAge = remember ? THIRTY_DAYS_MS : undefined;
	clearOAuthBrowserBindings(res);
	return res.json({
		[selectedCandidate.responseKey]:
			serializeAccountEntity(selectedCandidate.entity)
	});
};

export const requestPasswordReset: RequestHandler = (req, res) => {
	const email = typeof req.body?.email === "string" ? req.body.email.trim().toLowerCase() : "";
	if (!isValidEmailAddress(email)) {
		return res.status(400).json({ message: "Enter a valid email address." });
	}

	void deliverPasswordReset(email).catch((error: unknown) => {
		console.error(
			"Password reset delivery failed:",
			error instanceof Error ? error.message : "Unknown delivery error"
		);
	});

	return res.status(202).json(PASSWORD_RESET_RESPONSE);
};

export const confirmPasswordReset: RequestHandler = async (req, res) => {
	const token = typeof req.body?.token === "string" ? req.body.token.trim() : "";
	const newPassword = typeof req.body?.newPassword === "string" ? req.body.newPassword : "";

	if (!PASSWORD_RESET_TOKEN_PATTERN.test(token)) {
		return res.status(400).json({ message: "This password reset link is invalid or expired." });
	}
	if (newPassword.length < 8 || newPassword.length > 256) {
		return res.status(400).json({ message: "Use a password between 8 and 256 characters." });
	}

	const tokenHash = hashResetToken(token);
	const claimID = randomBytes(24).toString("hex");
	const resetRecord = await PasswordResetToken.findOneAndUpdate(
		{
			tokenHash,
			expiresAt: { $gt: new Date() },
			claimID: { $exists: false }
		},
		{
			$set: {
				claimID,
				claimedAt: new Date()
			}
		},
		{ new: true }
	)
		.select("+claimID +claimedAt")
		.exec();
	if (!resetRecord) {
		return res.status(400).json({ message: "This password reset link is invalid or expired." });
	}

	const models: Record<PasswordResetRole, Model<any>> = {
		admin: Admin,
		tutor: Tutor,
		user: User
	};
	const account = await models[resetRecord.role].findById(resetRecord.accountID).exec();
	if (!account) {
		await PasswordResetToken.deleteOne({ tokenHash, claimID }).exec();
		return res.status(400).json({ message: "This password reset link is invalid or expired." });
	}

	try {
		account.password = newPassword;
		account.sessionVersion = (account.sessionVersion ?? 0) + 1;
		await account.save();
		await PasswordResetToken.deleteOne({ tokenHash, claimID }).exec();
		clearSessionRoles(req.session as CustomSession);
		clearOAuthBrowserBindings(res);
		await recordSecurityAuditEvent(req, {
			action: "account.password.reset",
			targetID: account._id,
			targetRole: resetRecord.role
		});
	}
	catch (error) {
		await PasswordResetToken.updateOne(
			{ tokenHash, claimID },
			{
				$unset: {
					claimID: 1,
					claimedAt: 1
				}
			}
		).exec();
		throw error;
	}

	return res.json({ message: "Password updated. You can now log in with your new password." });
};

/** LOGOUT */
export const logout: RequestHandler = (req, res) => {
	clearOAuthBrowserBindings(res);
	// clear cookie-session
	// assuming your cookie-session name is “session”
	(req.session as any) = null;
	return res.sendStatus(200);
};

export const revokeOtherSessions: RequestHandler = async (req, res) => {
	const account = req.currentAdmin ?? req.currentTutor ?? req.currentUser;
	if (!account) {
		return res.status(403).json({ message: "Signed-in account required" });
	}

	account.sessionVersion = (account.sessionVersion ?? 0) + 1;
	await account.save();
	(req.session as CustomSession).accountSessionVersion = account.sessionVersion;
	clearOAuthBrowserBindings(res);
	await recordSecurityAuditEvent(req, {
		action: "account.sessions.revoke",
		targetID: account._id,
		targetRole: req.currentAdmin
			? "admin"
			: req.currentTutor
				? "tutor"
				: "user"
	});
	return res.json({ message: "Other signed-in sessions have been revoked." });
};

// CHECK EMAIL
export const checkEmail: RequestHandler = async (req, res) => {
	const email = typeof req.body?.email === "string"
		? req.body.email.trim().toLowerCase()
		: "";
	if (!isValidEmailAddress(email)) {
		return res.status(400).json({ message: "Valid email required" });
	}
	const [u, t, a] = await Promise.all([
		User.exists({ email }),
		Tutor.exists({ email }),
		Admin.exists({ email })
	]);
	const conflict = [u, t, a].some(Boolean);
	res.status(conflict ? 403 : 200).json({
		message: conflict ? "Already in use" : "Available"
	});
};

/** CHANGE EMAIL */
export const changeEmail: RequestHandler = async (req, res) => {
	// to satisfy TS union‐of‐models overloads, first coerce your array to a single Model<any> type:
	const models = [User, Tutor, Admin] as Array<import("mongoose").Model<any>>;
	const { ID } = req.params;
	const newEmail = typeof req.body?.email === "string"
		? req.body.email.trim().toLowerCase()
		: "";

	if (typeof ID !== "string" || !Types.ObjectId.isValid(ID)) {
		return res.status(400).json({ message: "A valid account ID is required." });
	}
	if (!isValidEmailAddress(newEmail)) {
		return res.status(400).json({ message: "A valid new email is required." });
	}

	const session = req.session as CustomSession;
	const conflictChecks = await Promise.all(
		models.map(Model => Model.exists({ email: newEmail, _id: { $ne: ID } }))
	);
	if (conflictChecks.some(Boolean)) {
		return res.status(403).json({ message: "Email already exists." });
	}

	for (const Model of models) {
		const doc = await Model.findById(ID);
		if (!doc) continue;
		if (!canMutate(session, doc as Entity)) {
			return res.status(403).json({ message: "Not authorized to update this email." });
		}
		doc.email = newEmail;
		doc.sessionVersion = (doc.sessionVersion ?? 0) + 1;
		await doc.save();
		const roleKey = doc instanceof Admin
			? "adminID"
			: doc instanceof Tutor
				? "tutorID"
				: "userID";
		if (session[roleKey] === getAccountID(doc as Entity)) {
			session.accountSessionVersion = doc.sessionVersion;
		}
		clearOAuthBrowserBindings(res);
		await recordSecurityAuditEvent(req, {
			action: "account.email.change",
			targetID: doc._id,
			targetRole: roleKey.replace("ID", "") as "admin" | "tutor" | "user"
		});
		return res.json({ message: "Email updated successfully." });
	}

	return res.status(404).json({ message: "Entity not found." });
};

export const changePassword: RequestHandler = async (req, res) => {
	const models = [User, Tutor, Admin] as Array<import("mongoose").Model<any>>;
	const { ID } = req.params;
	const currentPassword = typeof req.body?.currentPassword === "string"
		? req.body.currentPassword
		: "";
	const newPassword = typeof req.body?.newPassword === "string"
		? req.body.newPassword
		: "";

	if (typeof ID !== "string" || !Types.ObjectId.isValid(ID)) {
		return res.status(400).json({ message: "A valid account ID is required." });
	}
	if (newPassword.length < 8 || newPassword.length > 256) {
		return res.status(400).json({
			message: "Use a password between 8 and 256 characters."
		});
	}

	const session: CustomSession = req.session as CustomSession;
	for (const Model of models) {
		const doc = await Model.findById(ID);
		if (!doc) continue;

		if (!canMutate(session, doc as Entity)) {
			return res.status(403).json({ message: "Not authorized to update this password." });
		}

		const isAdminOverride: boolean = !!session.adminID;
		if (!isAdminOverride) {
			if (currentPassword.length === 0 || currentPassword.length > 256) {
				return res.status(400).json({ message: "A valid current password is required." });
			}
			const matches = await (doc as Entity).comparePassword(currentPassword);
			if (!matches) {
				return res.status(403).json({ message: "Current password is incorrect." });
			}
		}

		doc.password = newPassword;
		doc.sessionVersion = (doc.sessionVersion ?? 0) + 1;
		await doc.save();
		const roleKey = doc instanceof Admin
			? "adminID"
			: doc instanceof Tutor
				? "tutorID"
				: "userID";
		if (session[roleKey] === getAccountID(doc as Entity)) {
			session.accountSessionVersion = doc.sessionVersion;
		}
		clearOAuthBrowserBindings(res);
		await recordSecurityAuditEvent(req, {
			action: "account.password.change",
			targetID: doc._id,
			targetRole: roleKey.replace("ID", "") as "admin" | "tutor" | "user"
		});
		return res.json({ message: "Password updated successfully." });
	}

	return res.status(404).json({ message: "Entity not found." });
};
