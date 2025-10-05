import type { SendMailOptions } from "nodemailer";
import { env } from "node:process";
import { Router } from "express";
import { marked } from "marked";
import nodemailer from "nodemailer";
import { z } from "zod";
import { validAdmin } from "../middleware/auth.js";

const router = Router();

const FROM_ADDR = env.MDMAIL_FROM || "no-reply@example.com";
const ALLOW_TO = (env.MDMAIL_ALLOW_TO || "").split(",").filter(Boolean);
const MAX_MD_LEN = Number(env.MDMAIL_MAX_MD_LEN || 200_000);

const MailSchema = z.object({
	to: z.email(),
	subject: z.string().trim().min(1).max(200),
	md: z.string().min(1),
});

router.post("/send", validAdmin, async (req, res) => {
	const parsed = MailSchema.safeParse(req.body);
	if (!parsed.success) {
		return res
			.status(400)
			.json({ message: "Invalid payload", issues: parsed.error.issues });
	}

	const { to, subject, md } = parsed.data;

	if (ALLOW_TO.length && !ALLOW_TO.includes(to)) {
		return res.status(403).json({ message: "Recipient not allowed" });
	}
	if (md.length > MAX_MD_LEN) {
		return res.status(413).json({ message: "Markdown too large" });
	}

	// Create transporter
	const transporter = nodemailer.createTransport({
		host: env.SMTP_HOST!,
		port: Number(env.SMTP_PORT ?? 587),
		secure: String(env.SMTP_SECURE || "").toLowerCase() === "true",
		auth:
			env.SMTP_USER && env.SMTP_PASS
				? { user: env.SMTP_USER, pass: env.SMTP_PASS }
				: undefined,
	});

	// Convert markdown to HTML and await the result
	const htmlBody: string = await marked.parse(md);

	// Build mail options
	const mailOptions: SendMailOptions = {
		from: FROM_ADDR,
		to,
		subject,
		text: md,
		html: htmlBody, // definitely a string here
	};

	try {
		// Use the promise version: no callback
		const info = await transporter.sendMail(mailOptions);
		// TS should infer info: SentMessageInfo
		return res.json({ ok: true, messageId: info.messageId });
	}
	catch (err: any) {
		console.error("sendMail error:", err);
		return res
			.status(502)
			.json({ ok: false, message: err.message || "SMTP send failed" });
	}
});

export const adminMailRoutes = router;
