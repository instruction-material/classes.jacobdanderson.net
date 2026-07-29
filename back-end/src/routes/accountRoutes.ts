// src/routes/accountRoutes.ts

import type { RequestHandler } from "express";
import type { CustomSession } from "../types/session/CustomSession.js";
import { Router } from "express";
import {
	changeEmail,
	changePassword,
	checkEmail,
	confirmPasswordReset,
	login,
	logout,
	requestPasswordReset,
	revokeOtherSessions
} from "../controllers/auth/authController.js";
import {
	finishOAuthLogin,
	getOAuthProviders,
	startOAuthLogin
} from "../controllers/auth/oauthController.js";
import { validAccountSession } from "../middleware/auth.js";
import {
	createEmailCheckLimiter,
	createLoginAccountLimiter,
	createLoginIpLimiter,
	createOAuthLoginLimiter,
	createPasswordResetAccountLimiter,
	createPasswordResetLimiter,
	createUserCourseAccessLimiter
} from "../middleware/rateLimiters.js";
import { Admin } from "../models/schemas/Admin.js";
import { Tutor } from "../models/schemas/Tutor.js";
import { User } from "../models/schemas/User.js";

const router = Router();
const objectIdPattern = /^[a-f\d]{24}$/i;
const passwordResetLimiter = createPasswordResetLimiter();
const passwordResetAccountLimiter = createPasswordResetAccountLimiter();
const oauthLoginLimiter = createOAuthLoginLimiter();
const loginIpLimiter = createLoginIpLimiter();
const loginAccountLimiter = createLoginAccountLimiter();
const emailCheckLimiter = createEmailCheckLimiter();
const accountMutationLimiter = createUserCourseAccessLimiter();

const requireAppleOAuthFormPost: RequestHandler = (req, res, next) => {
	if (req.params.provider !== "apple") {
		res.sendStatus(404);
		return;
	}
	if (!req.is("application/x-www-form-urlencoded")) {
		res.sendStatus(415);
		return;
	}
	next();
};

async function validExistingSessionId(
	Model: {
		exists: (
			query: Record<string, unknown>
		) => PromiseLike<unknown> | unknown;
	},
	id: unknown,
	sessionVersion: unknown
): Promise<string | null> {
	if (
		typeof id !== "string"
		|| !objectIdPattern.test(id)
		|| !Number.isInteger(sessionVersion)
	) {
		return null;
	}

	const version = sessionVersion as number;
	const versionFilter = version === 0
		? {
				$or: [
					{ sessionVersion: 0 },
					{ sessionVersion: { $exists: false } }
				]
			}
		: { sessionVersion: version };
	return (await Model.exists({
		_id: id,
		...versionFilter
	}))
		? id
		: null;
}

// Route to check if email is available (useful for account creation)
router.post("/checkEmail", emailCheckLimiter, checkEmail);

// Route to change email (could be used by users, tutors, or admins)
router.post(
	"/changeEmail/:ID",
	accountMutationLimiter,
	validAccountSession,
	changeEmail
);

// Route to change password
router.post(
	"/changePassword/:ID",
	accountMutationLimiter,
	validAccountSession,
	changePassword
);

// Route to handle login
router.post("/login", loginIpLimiter, loginAccountLimiter, login);

router.post(
	"/password-reset/request",
	passwordResetLimiter,
	passwordResetAccountLimiter,
	requestPasswordReset
);
router.post("/password-reset/confirm", passwordResetLimiter, confirmPasswordReset);
router.get("/oauth/providers", getOAuthProviders);
router.get("/oauth/:provider/start", oauthLoginLimiter, startOAuthLogin);
router.get("/oauth/:provider/callback", oauthLoginLimiter, finishOAuthLogin);
router.post(
	"/oauth/:provider/callback",
	oauthLoginLimiter,
	requireAppleOAuthFormPost,
	finishOAuthLogin
);

router.delete("/logout", logout);
router.post(
	"/revoke-sessions",
	accountMutationLimiter,
	validAccountSession,
	revokeOtherSessions
);

const currentAccount: RequestHandler = async (req, res) => {
	const session = req.session as CustomSession | undefined;
	if (!session) {
		return res.json({ adminID: null, tutorID: null, userID: null });
	}

	try {
		const [adminID, tutorID, userID] = await Promise.all([
			validExistingSessionId(
				Admin,
				session.adminID,
				session.accountSessionVersion
			),
			validExistingSessionId(
				Tutor,
				session.tutorID,
				session.accountSessionVersion
			),
			validExistingSessionId(
				User,
				session.userID,
				session.accountSessionVersion
			)
		]);

		if (!adminID) delete session.adminID;
		if (!tutorID) delete session.tutorID;
		if (!userID) delete session.userID;
		if (!adminID && !tutorID && !userID) {
			delete session.accountSessionVersion;
		}

		return res.json({ adminID, tutorID, userID });
	}
	catch (error) {
		console.error("Error resolving current account session:", error);
		return res.status(500).json({ message: "Server error while resolving account session" });
	}
};

router.get("/me", currentAccount);

// Export the router
export const accountRoutes = router;
