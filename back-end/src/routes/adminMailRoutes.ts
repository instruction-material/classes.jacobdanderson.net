// src/routes/adminMailRoutes.ts
import { spawn } from "node:child_process";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { env } from "node:process";
import { Router } from "express";
import { z } from "zod";
import { validAdmin } from "../middleware/auth.js";

const router = Router();

// Env knobs
const FROM_ADDR = env.MDMAIL_FROM || "jacobdanderson@gmail.com";
const MDSEND_PATH = env.MDMAIL_SCRIPT || "/usr/local/bin/mdsend.sh";
const ALLOW_TO = (env.MDMAIL_ALLOW_TO || "").split(",").filter(Boolean);
const MAX_MD_LEN = Number(env.MDMAIL_MAX_MD_LEN || 200_000);

// Basic payload validation
const MailSchema = z.object({
	to: z.email(),
	subject: z.string().trim().min(1).max(200),
	md: z.string().min(1) // size checked below so we can use MAX_MD_LEN
});

router.post("/send", validAdmin, async (req, res) => {
	const parsed = MailSchema.safeParse(req.body);
	if (!parsed.success) {
		return res.status(400).json({ message: "Invalid payload", issues: parsed.error.issues });
	}

	const { to, subject, md } = parsed.data;

	if (ALLOW_TO.length && !ALLOW_TO.includes(to)) {
		return res.status(403).json({ message: "Recipient not allowed" });
	}
	if (md.length > MAX_MD_LEN) {
		return res.status(413).json({ message: "Markdown too large" });
	}

	// temp file for markdown
	const workDir = mkdtempSync(join(tmpdir(), "mdmail-"));
	const mdPath = join(workDir, "message.md");
	writeFileSync(mdPath, md, { encoding: "utf-8" });

	const child = spawn(MDSEND_PATH, [to, subject, mdPath], {
		env: { ...env, FROM_ADDR },
		stdio: ["ignore", "pipe", "pipe"],
	});

	let stdout = "";
	let stderr = "";
	child.stdout.on("data", b => (stdout += b.toString()));
	child.stderr.on("data", b => (stderr += b.toString()));

	child.on("close", (code) => {
		try {
			rmSync(workDir, { recursive: true, force: true });
		}
		catch {}
		res.status(code === 0 ? 200 : 500).json({ ok: code === 0, code, stdout, stderr });
	});
});

export const adminMailRoutes = router;
