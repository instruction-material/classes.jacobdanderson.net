import type SMTPTransport from "nodemailer/lib/smtp-transport/index.js";
import { execFileSync } from "node:child_process";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { createServer } from "node:net";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createServer as createTlsServer } from "node:tls";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { sendTransactionalEmail } from "../src/utils/transactionalEmail.js";

const mail = vi.hoisted(() => ({ createTransport: vi.fn(), sendMail: vi.fn() }));
vi.mock("nodemailer", () => ({ default: { createTransport: mail.createTransport } }));

const message = {
	to: "recipient@example.invalid",
	subject: "Synthetic reset notice",
	text: "Synthetic message only",
	html: "<p>Synthetic message only</p>"
};

beforeEach(() => {
	for (const name of Object.keys(process.env).filter(name => name.startsWith("SMTP_"))) {
		vi.stubEnv(name, "");
	}
	mail.createTransport.mockReset().mockReturnValue({ sendMail: mail.sendMail });
	mail.sendMail.mockReset().mockResolvedValue({});
});
afterEach(() => vi.unstubAllEnvs());

describe("transactional email encryption", () => {
	it("delivers a synthetic message over verified implicit TLS with a configured CA", async () => {
		const directory = await mkdtemp(join(tmpdir(), "classes-mail-tls-"));
		const keyFile = join(directory, "fixture.key");
		const certificateFile = join(directory, "fixture.crt");
		const actual = await vi.importActual<typeof import("nodemailer")>("nodemailer");
		const transports: ReturnType<typeof actual.default.createTransport>[] = [];
		let server: ReturnType<typeof createTlsServer> | undefined;
		let delivered = 0;
		try {
			execFileSync("openssl", ["req", "-x509", "-newkey", "rsa:2048", "-nodes", "-keyout", keyFile,
				"-out", certificateFile, "-days", "1", "-subj", "/CN=localhost", "-addext", "subjectAltName=DNS:localhost"],
			{ stdio: "ignore", timeout: 10_000 });
			server = createTlsServer({ key: await readFile(keyFile), cert: await readFile(certificateFile) }, socket => {
				socket.setEncoding("utf8");
				socket.write("220 localhost synthetic SMTP\r\n");
				let pending = "";
				let readingMessage = false;
				socket.on("data", chunk => {
					pending += chunk;
					while (pending.includes("\r\n")) {
						const boundary = pending.indexOf("\r\n");
						const line = pending.slice(0, boundary);
						pending = pending.slice(boundary + 2);
						if (readingMessage) {
							if (line === ".") {
								delivered++;
								readingMessage = false;
								socket.write("250 synthetic message accepted\r\n");
							}
						} else if (line === "DATA") {
							readingMessage = true;
							socket.write("354 synthetic fixture ready\r\n");
						} else if (line === "QUIT") socket.end("221 goodbye\r\n");
						else socket.write("250 localhost\r\n");
					}
				});
			});
			await new Promise<void>(resolve => server!.listen(0, "127.0.0.1", resolve));
			const address = server.address();
			if (!address || typeof address === "string") throw new Error("No fixture listener");
			for (const prefix of ["SMTP_PRIMARY", "SMTP_FALLBACK"]) {
				vi.stubEnv(`${prefix}_HOST`, "127.0.0.1");
				vi.stubEnv(`${prefix}_PORT`, String(address.port));
				vi.stubEnv(`${prefix}_SECURE`, "true");
				vi.stubEnv(`${prefix}_SERVERNAME`, "localhost");
				vi.stubEnv(`${prefix}_CA_FILE`, certificateFile);
			}
			mail.createTransport.mockImplementation((options: SMTPTransport.Options) => {
				const transport = actual.default.createTransport(options);
				transports.push(transport);
				return transport;
			});
			await sendTransactionalEmail(message);
			expect(delivered).toBe(1);
			expect(mail.createTransport).toHaveBeenCalledTimes(1);
		} finally {
			transports.forEach(transport => transport.close());
			if (server?.listening) await new Promise<void>((resolve, reject) => server!.close(error => error ? reject(error) : resolve()));
			await rm(directory, { recursive: true, force: true });
		}
	});
	it("requires TLS on the default primary and does not try fallback after success", async () => {
		await sendTransactionalEmail(message);
		expect(mail.createTransport).toHaveBeenCalledExactlyOnceWith(expect.objectContaining({
			host: "127.0.0.1", port: 25, secure: false, requireTLS: true,
			connectionTimeout: 15_000, socketTimeout: 15_000,
			tls: { servername: "mail.example.com", minVersion: "TLSv1.2" }
		}));
		expect(mail.sendMail).toHaveBeenCalledExactlyOnceWith(expect.objectContaining(message));
	});

	it("preserves aliases and implicit TLS while protecting fallback too", async () => {
		vi.stubEnv("SMTP_HOST", "legacy.example.invalid");
		vi.stubEnv("SMTP_PORT", "465");
		vi.stubEnv("SMTP_SECURE", "true");
		vi.stubEnv("SMTP_SERVERNAME", "legacy.example.invalid");
		vi.stubEnv("SMTP_FALLBACK_HOST", "fallback.example.invalid");
		vi.stubEnv("SMTP_FALLBACK_SERVERNAME", "fallback.example.invalid");
		vi.stubEnv("SMTP_FALLBACK_USER", "synthetic-user");
		vi.stubEnv("SMTP_FALLBACK_PASS", "synthetic-not-a-credential");
		mail.sendMail.mockRejectedValueOnce(new Error("Synthetic primary failure"));
		await sendTransactionalEmail(message);
		expect(mail.createTransport).toHaveBeenNthCalledWith(1, expect.objectContaining({
			host: "legacy.example.invalid", port: 465, secure: true, requireTLS: true,
			tls: { servername: "legacy.example.invalid", minVersion: "TLSv1.2" }
		}));
		expect(mail.createTransport).toHaveBeenNthCalledWith(2, expect.objectContaining({
			host: "fallback.example.invalid", port: 587, secure: false, requireTLS: true,
			auth: { user: "synthetic-user", pass: "synthetic-not-a-credential" },
			tls: { servername: "fallback.example.invalid", minVersion: "TLSv1.2" }
		}));
		for (const [options] of mail.createTransport.mock.calls) {
			expect(options.tls.rejectUnauthorized).not.toBe(false);
			expect(options.ignoreTLS).not.toBe(true);
		}
	});

	it("honors primary precedence and retains both delivery errors", async () => {
		vi.stubEnv("SMTP_HOST", "legacy.example.invalid");
		vi.stubEnv("SMTP_PRIMARY_HOST", "primary.example.invalid");
		vi.stubEnv("SMTP_FALLBACK_SECURE", "true");
		const failures = [new Error("Primary unavailable"), new Error("Fallback unavailable")];
		mail.sendMail.mockRejectedValueOnce(failures[0]).mockRejectedValueOnce(failures[1]);
		await expect(sendTransactionalEmail(message)).rejects.toMatchObject({ errors: failures });
		expect(mail.createTransport.mock.calls[0][0].host).toBe("primary.example.invalid");
		expect(mail.createTransport.mock.calls[1][0]).toMatchObject({ secure: true, requireTLS: true });
	});

	it("refuses both plaintext-only loopback relays before sending any message", async () => {
		const actual = await vi.importActual<typeof import("nodemailer")>("nodemailer");
		const transports: ReturnType<typeof actual.default.createTransport>[] = [];
		mail.createTransport.mockImplementation((options: SMTPTransport.Options) => {
			const transport = actual.default.createTransport(options);
			transports.push(transport);
			return transport;
		});
		const commands: string[] = [];
		const server = createServer(socket => {
			socket.setEncoding("utf8");
			socket.write("220 synthetic.example ESMTP\r\n");
			let pending = "";
			socket.on("data", chunk => {
				pending += chunk;
				while (pending.includes("\r\n")) {
					const boundary = pending.indexOf("\r\n");
					const command = pending.slice(0, boundary).split(" ")[0];
					pending = pending.slice(boundary + 2);
					commands.push(command);
					if (command === "EHLO") socket.write("250 synthetic.example\r\n");
					else socket.end("454 TLS unavailable in synthetic fixture\r\n");
				}
			});
		});
		await new Promise<void>(resolve => server.listen(0, "127.0.0.1", resolve));
		try {
			const address = server.address();
			if (!address || typeof address === "string") throw new Error("No fixture listener");
			for (const prefix of ["SMTP_PRIMARY", "SMTP_FALLBACK"]) {
				vi.stubEnv(`${prefix}_HOST`, "127.0.0.1");
				vi.stubEnv(`${prefix}_PORT`, String(address.port));
				vi.stubEnv(`${prefix}_SECURE`, "false");
			}
			await expect(sendTransactionalEmail(message)).rejects.toBeInstanceOf(AggregateError);
			expect(commands.filter(command => command === "STARTTLS")).toHaveLength(2);
			expect(commands.some(command => ["AUTH", "MAIL", "RCPT", "DATA"].includes(command))).toBe(false);
		} finally {
			transports.forEach(transport => transport.close());
			await new Promise<void>((resolve, reject) => server.close(error => error ? reject(error) : resolve()));
		}
	});
});
