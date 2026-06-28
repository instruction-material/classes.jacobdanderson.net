import type { SendMailOptions } from "nodemailer";
import { existsSync, readFileSync } from "node:fs";
import { env } from "node:process";
import nodemailer from "nodemailer";

const PRIMARY_FROM_ADDRESS = env.MDMAIL_PRIMARY_FROM
	|| env.MDMAIL_FROM_PRIMARY
	|| env.MDMAIL_FROM
	|| "classes@example.com";
const FALLBACK_FROM_ADDRESS = env.MDMAIL_FALLBACK_FROM
	|| env.MDMAIL_FROM_FALLBACK
	|| "classes@example.com";

export interface TransactionalEmail {
	html: string;
	subject: string;
	text: string;
	to: string;
}

function readOptionalCertificate(filePath: string | undefined) {
	if (!filePath || !existsSync(filePath)) return undefined;
	return readFileSync(filePath);
}

function createPrimaryTransporter() {
	const host = env.SMTP_PRIMARY_HOST || env.SMTP_HOST || "127.0.0.1";
	const ca = readOptionalCertificate(env.SMTP_PRIMARY_CA_FILE || env.SMTP_CA_FILE);

	return nodemailer.createTransport({
		host,
		port: Number(env.SMTP_PRIMARY_PORT || env.SMTP_PORT || 25),
		secure: String(env.SMTP_PRIMARY_SECURE || env.SMTP_SECURE || "false").toLowerCase() === "true",
		connectionTimeout: 15_000,
		socketTimeout: 15_000,
		tls: {
			servername: env.SMTP_PRIMARY_SERVERNAME || env.SMTP_SERVERNAME || "mail.example.com",
			minVersion: "TLSv1.2",
			...(ca ? { ca } : {})
		}
	});
}

function createFallbackTransporter() {
	const user = env.SMTP_FALLBACK_USER || env.SMTP_USER;
	const pass = env.SMTP_FALLBACK_PASS || env.SMTP_PASS;
	const ca = readOptionalCertificate(env.SMTP_FALLBACK_CA_FILE || env.SMTP_CA_FILE);

	return nodemailer.createTransport({
		host: env.SMTP_FALLBACK_HOST || "smtp.gmail.com",
		port: Number(env.SMTP_FALLBACK_PORT || 587),
		secure: String(env.SMTP_FALLBACK_SECURE || "false").toLowerCase() === "true",
		auth: user && pass ? { user, pass } : undefined,
		connectionTimeout: 15_000,
		socketTimeout: 15_000,
		tls: {
			servername: env.SMTP_FALLBACK_SERVERNAME || "smtp.gmail.com",
			minVersion: "TLSv1.2",
			...(ca ? { ca } : {})
		}
	});
}

async function sendMail(
	message: TransactionalEmail,
	options: { from: string; transporter: ReturnType<typeof nodemailer.createTransport> }
) {
	const mail: SendMailOptions = {
		...message,
		from: options.from,
		replyTo: PRIMARY_FROM_ADDRESS
	};
	return options.transporter.sendMail(mail);
}

export async function sendTransactionalEmail(message: TransactionalEmail) {
	try {
		await sendMail(message, {
			from: PRIMARY_FROM_ADDRESS,
			transporter: createPrimaryTransporter()
		});
	}
	catch (primaryError) {
		try {
			await sendMail(message, {
				from: FALLBACK_FROM_ADDRESS,
				transporter: createFallbackTransporter()
			});
		}
		catch (fallbackError) {
			throw new AggregateError(
				[primaryError, fallbackError],
				"Primary and fallback transactional email delivery failed."
			);
		}
	}
}
