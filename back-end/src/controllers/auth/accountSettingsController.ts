import type { Request, RequestHandler } from "express";
import type { Model } from "mongoose";
import type { CustomSession } from "../../types/session/CustomSession.js";
import { createHash, randomBytes } from "node:crypto";
import { env } from "node:process";
import { Admin } from "../../models/schemas/Admin.js";
import { Tutor } from "../../models/schemas/Tutor.js";
import { User } from "../../models/schemas/User.js";
import { clearOAuthBrowserBindings } from "../../utils/oauthBrowserBinding.js";
import { recordSecurityAuditEvent } from "../../utils/securityAudit.js";
import { sendTransactionalEmail } from "../../utils/transactionalEmail.js";

function ownAccount(req: Request) {
	if (req.currentAdmin) return { account: req.currentAdmin, Model: Admin as Model<any>, role: "admin" as const };
	if (req.currentTutor) return { account: req.currentTutor, Model: Tutor as Model<any>, role: "tutor" as const };
	if (req.currentUser) return { account: req.currentUser, Model: User as Model<any>, role: "user" as const };
	return null;
}

function versionFilter(version: number) {
	return version === 0
		? { $or: [{ sessionVersion: 0 }, { sessionVersion: { $exists: false } }] }
		: { sessionVersion: version };
}

async function emailConflict(email: string, id: unknown) {
	return (await Promise.all([Admin, Tutor, User].map(Model =>
		(Model as Model<any>).exists({ email, _id: { $ne: id } })
	))).some(Boolean);
}

function verificationUrl(token: string) {
	const configured = env.PASSWORD_RESET_ORIGIN?.trim() || "https://example.com";
	const origin = new URL(configured);
	if (origin.protocol !== "https:" && !(origin.protocol === "http:" && ["localhost", "127.0.0.1"].includes(origin.hostname)))
		throw new Error("Invalid account verification origin");
	const url = new URL("/verify-email", origin.origin);
	url.hash = token;
	return url.toString();
}

export const requestEmailChange: RequestHandler = async (req, res) => {
	const owner = ownAccount(req);
	if (!owner || req.params.ID !== owner.account._id.toString())
		return res.status(403).json({ message: "Only your own email can be changed." });
	const email = typeof req.body?.email === "string" ? req.body.email.trim().toLowerCase() : "";
	const password = typeof req.body?.currentPassword === "string" ? req.body.currentPassword : "";
	if (!/^[^\s@]+@[^\s@][^\s.@]*\.[^\s@]+$/.test(email) || email.length > 320 || password.length < 1 || password.length > 256)
		return res.status(400).json({ message: "Enter a valid email and your current password." });
	if (!await owner.account.comparePassword(password))
		return res.status(403).json({ message: "Current password is incorrect." });
	if (email === owner.account.email)
		return res.status(400).json({ message: "Enter a different email address." });
	if (await emailConflict(email, owner.account._id))
		return res.status(409).json({ message: "Email already exists." });

	const token = randomBytes(32).toString("hex");
	const tokenHash = createHash("sha256").update(token).digest("hex");
	const url = verificationUrl(token);
	const version = owner.account.sessionVersion ?? 0;
	const pending = await owner.Model.findOneAndUpdate({
		_id: owner.account._id,
		email: owner.account.email,
		...versionFilter(version)
	}, { $set: { emailChange: {
		email,
		tokenHash,
		originalEmail: owner.account.email,
		sessionVersion: version,
		expiresAt: new Date(Date.now() + 30 * 60_000),
		requestedAt: new Date()
	} } }, { new: true }).exec();
	if (!pending)
		return res.status(409).json({ message: "Account changed. Sign in again before retrying." });
	try {
		await sendTransactionalEmail({
			to: email,
			subject: "Verify your new account email",
			text: `Confirm your email change: ${url}\nThis link expires in 30 minutes. Your email will not change until you confirm it while signed in.`,
			html: `<p><a href="${url}">Verify your new email</a></p><p>This link expires in 30 minutes. Your email will not change until you confirm it while signed in.</p>`
		});
	}
	catch {
		await owner.Model.updateOne({ "_id": owner.account._id, "emailChange.tokenHash": tokenHash }, { $unset: { emailChange: 1 } }).exec();
		console.warn("account.email_verification.delivery_failed");
		return res.status(502).json({ message: "Verification could not be delivered. Your account email is unchanged." });
	}
	await recordSecurityAuditEvent(req, { action: "account.email.verification.request", targetID: owner.account._id, targetRole: owner.role });
	return res.status(202).json({ message: "Check your new email to verify the change. Your current email remains active." });
};

export const confirmEmailChange: RequestHandler = async (req, res) => {
	const owner = ownAccount(req);
	if (!owner) return res.sendStatus(403);
	const token = typeof req.body?.token === "string" ? req.body.token : "";
	if (!/^[a-f\d]{64}$/i.test(token)) return res.status(400).json({ message: "Invalid verification link." });
	const tokenHash = createHash("sha256").update(token).digest("hex");
	const version = owner.account.sessionVersion ?? 0;
	const filter = {
		"_id": owner.account._id,
		"email": owner.account.email,
		...versionFilter(version),
		"emailChange.tokenHash": tokenHash,
		"emailChange.originalEmail": owner.account.email,
		"emailChange.sessionVersion": version,
		"emailChange.expiresAt": { $gt: new Date() }
	};
	const pending = await owner.Model.findOne(filter).select("+emailChange").lean().exec();
	if (!pending?.emailChange) return res.status(400).json({ message: "This verification link is expired, already used, or belongs to another account." });
	if (await emailConflict(pending.emailChange.email, owner.account._id))
		return res.status(409).json({ message: "Email already exists. Your account email is unchanged." });
	let account;
	try {
		account = await owner.Model.findOneAndUpdate(filter, {
			$set: { email: pending.emailChange.email },
			$inc: { sessionVersion: 1 },
			$unset: { emailChange: 1 }
		}, { new: true }).exec();
	}
	catch (error) {
		if (typeof error === "object" && error !== null && "code" in error && error.code === 11000)
			return res.status(409).json({ message: "Email already exists. Your account email is unchanged." });
		throw error;
	}
	if (!account) return res.status(409).json({ message: "This verification link is no longer valid." });
	(req.session as CustomSession).accountSessionVersion = account.sessionVersion;
	clearOAuthBrowserBindings(res);
	await recordSecurityAuditEvent(req, { action: "account.email.change", targetID: owner.account._id, targetRole: owner.role });
	return res.json({ message: "Email verified and updated." });
};

export const signOutAllSessions: RequestHandler = async (req, res) => {
	const owner = ownAccount(req);
	if (!owner) return res.sendStatus(403);
	await owner.Model.updateOne({ _id: owner.account._id }, { $inc: { sessionVersion: 1 }, $unset: { emailChange: 1 } }).exec();
	await recordSecurityAuditEvent(req, { action: "account.sessions.revoke_all", targetID: owner.account._id, targetRole: owner.role });
	clearOAuthBrowserBindings(res);
	(req.session as any) = null;
	return res.json({ message: "All sessions have been signed out." });
};
