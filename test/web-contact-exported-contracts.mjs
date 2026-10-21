import assert from "node:assert/strict";
import { Buffer } from "node:buffer";
import { spawn } from "node:child_process";
import { createHash } from "node:crypto";
import { once } from "node:events";
import {
	mkdir,
	mkdtemp,
	readFile,
	rm,
	symlink,
	writeFile
} from "node:fs/promises";
import { basename, dirname, join, resolve } from "node:path";
import process from "node:process";
import { pathToFileURL } from "node:url";
import { unzipSync } from "fflate";

async function main() {
	function option(name, fallback) {
		const index = process.argv.indexOf(name);
		return index === -1 ? fallback : process.argv[index + 1];
	}
	const source = resolve(
		option("--source", "output/web-contact-native-source")
	);
	const exportsPath = resolve(
		option("--exports", "front-end/output/web-contact-exports")
	);
	const browserPath = option("--browser", "output/web-contact-browser");
	const proofPath = resolve(
		option("--proof", "output/web-contact-native/proof.json")
	);
	const fixture = JSON.parse(
		await readFile(
			new URL("./fixtures/web-contact-source.json", import.meta.url),
			"utf8"
		)
	);
	const names = [...fixture.roleFiles, ...fixture.sharedFiles];
	const sha = bytes => createHash("sha256").update(bytes).digest("hex");
	const parentTask
		= process.env.CLASSES_FAMILY_TASK_ID ?? "web-contact-export-contracts";
	const proof = {
		accepted: false,
		sourceRevision: fixture.revision,
		profiles: [],
		dependencyInputs: {},
		releaseCandidate: false
	};
	const good = {
		name: "Fictional Reader",
		replyTo: "reader@example.invalid",
		topic: "project",
		message: "A fictional request."
	};
	const ownedChildren = new Set();
	function track(child) {
		ownedChildren.add(child);
		child.once("exit", () => ownedChildren.delete(child));
		child.once("error", () => ownedChildren.delete(child));
		return child;
	}
	async function cancel() {
		const children = [...ownedChildren];
		const exits = children.map(child =>
			once(child, "exit").catch(() => {})
		);
		for (const child of children) {
			try {
				process.kill(-child.pid, "SIGTERM");
			}
			catch {}
		}
		const timer = setTimeout(() => {
			for (const child of ownedChildren) {
				try {
					process.kill(-child.pid, "SIGKILL");
				}
				catch {}
			}
		}, 1500);
		await Promise.allSettled(exits);
		clearTimeout(timer);
		log({
			event: "cancelled",
			cleanup: "owned child process groups terminated and awaited"
		});
		process.exit(1);
	}
	process.once("SIGTERM", cancel);
	process.once("SIGINT", cancel);

	function log(value) {
		console.log(JSON.stringify({ parentTask, ...value }));
	}

	async function gitRevision() {
		const startedAt = new Date().toISOString();
		const child = track(
			spawn("git", ["rev-parse", "HEAD"], {
				cwd: source,
				stdio: ["ignore", "pipe", "pipe"],
				detached: true
			})
		);
		log({
			event: "child-start",
			command: ["git", "rev-parse", "HEAD"],
			cwd: source,
			pid: child.pid,
			startedAt,
			timeoutMs: 5000
		});
		let stdout = "";
		child.stdout.on("data", (bytes) => {
			stdout += bytes;
		});
		const timer = setTimeout(() => child.kill("SIGKILL"), 5000);
		try {
			const [code] = await once(child, "exit");
			assert.equal(code, 0);
			return stdout.trim();
		}
		finally {
			clearTimeout(timer);
			log({
				event: "child-end",
				pid: child.pid,
				startedAt,
				endedAt: new Date().toISOString(),
				exitCode: child.exitCode,
				signal: child.signalCode,
				cleanup: "awaited owned metadata process"
			});
		}
	}

	function unpack(bytes, expectedFiles) {
		const entries = unzipSync(bytes);
		assert.equal(Object.keys(entries).length, names.length);
		const files = new Map();
		for (const name of names) {
			const matches = Object.keys(entries).filter(
				path => path === name || path.endsWith(`/${name}`)
			);
			assert.equal(matches.length, 1, name);
			const data = entries[matches[0]];
			if (expectedFiles) {
				const expected = expectedFiles.find(file => file.name === name);
				assert.ok(expected, name);
				if (expected.sha256) {
					assert.equal(sha(data), expected.sha256);
				}
				else {
					assert.equal(
						Buffer.from(data).toString(),
						expected.content
					);
				}
			}
			files.set(name, data);
		}
		return files;
	}

	async function validation(root, unfinished) {
		const { parseContact } = await import(
			pathToFileURL(join(root, "src/validation.js"))
		);
		if (unfinished) {
			assert.equal(parseContact(good).notImplemented, true);
			return { unfinished: true, valid: 0, invalid: 0 };
		}
		const accepted = [
			good,
			{ ...good, name: "AB", message: "1234567890", topic: "lesson" },
			{ ...good, name: "😀".repeat(40), message: "😀".repeat(1000) },
			{
				...good,
				name: "  雪星  ",
				message: "  <b>Fictional text</b>  ",
				replyTo: " reader.name+tag@example.invalid "
			},
			{
				...good,
				name: "x".repeat(80),
				message: "x".repeat(2000),
				replyTo: "o'connor@example.invalid"
			}
		];
		const rejected = [
			null,
			[],
			{},
			"text",
			{ ...good, extra: true },
			{ ...good, name: 1 },
			{ ...good, name: "A" },
			{ ...good, name: "x".repeat(81) },
			{ ...good, name: "😀".repeat(41) },
			{ ...good, message: "123456789" },
			{ ...good, message: "x".repeat(2001) },
			{ ...good, topic: " project " },
			{ ...good, replyTo: null },
			{ ...good, replyTo: ".reader@example.invalid" },
			{ ...good, replyTo: "reader..name@example.invalid" },
			{ ...good, replyTo: "reader@example.12" },
			{ ...good, replyTo: "reader@-example.invalid" },
			{ ...good, replyTo: "雪@example.invalid" },
			{ ...good, replyTo: `${"x".repeat(255)}@example.invalid` }
		];
		for (const input of accepted) {
			const before = structuredClone(input);
			assert.deepEqual(parseContact(input), {
				ok: true,
				value: {
					name: input.name.trim(),
					replyTo: input.replyTo.trim(),
					topic: input.topic,
					message: input.message.trim()
				}
			});
			assert.deepEqual(input, before);
		}
		for (const input of rejected) {
			const before = structuredClone(input);
			const result = parseContact(input);
			assert.equal(result.ok, false);
			assert.ok(result.fields.length);
			assert.ok(
				result.fields.every(field =>
					["request", "name", "replyTo", "topic", "message"].includes(
						field
					)
				)
			);
			assert.equal(new Set(result.fields).size, result.fields.length);
			assert.deepEqual(input, before);
		}
		return {
			unfinished: false,
			valid: accepted.length,
			invalid: rejected.length
		};
	}

	async function server(root, files, unfinished, scenario = "ok") {
		const command = [process.execPath, "src/server.js"];
		const startedAt = new Date().toISOString();
		const child = track(
			spawn(command[0], command.slice(1), {
				cwd: root,
				env: { ...process.env, PORT: "0", CONTACT_SCENARIO: scenario },
				stdio: ["ignore", "pipe", "pipe"],
				detached: true
			})
		);
		log({
			event: "child-start",
			command,
			cwd: root,
			pid: child.pid,
			startedAt,
			timeoutMs: 10000
		});
		let stdout = "";
		let stderr = "";
		const exited = once(child, "exit");
		const timer = setTimeout(() => {
			try {
				process.kill(-child.pid, "SIGKILL");
			}
			catch {}
		}, 10000);
		child.stderr.on("data", (bytes) => {
			stderr += bytes;
		});
		const ready = new Promise((resolveReady, reject) => {
			child.once("error", reject);
			child.stdout.on("data", (bytes) => {
				stdout += bytes;
				const line = stdout
					.split("\n")
					.find(line => line.includes("\"event\":\"ready\""));
				if (line) resolveReady(JSON.parse(line));
			});
		});
		try {
			const record = await Promise.race([
				ready,
				exited.then(() => {
					throw new Error("Exported server exited before readiness");
				})
			]);
			assert.equal(record.host, "127.0.0.1");
			const origin = `http://127.0.0.1:${record.port}`;
			const request = async (
				body,
				status,
				code,
				headers = { "Content-Type": "application/json" }
			) => {
				const response = await fetch(`${origin}/api/contact`, {
					method: "POST",
					headers,
					body,
					signal: AbortSignal.timeout(2500)
				});
				assert.equal(response.status, status);
				const data = await response.json();
				if (code) assert.equal(data.error.code, code);
				else
					assert.deepEqual(data, { ok: true, delivery: "simulated" });
				if (status === 429)
					assert.ok(Number(response.headers.get("retry-after")) > 0);
			};
			const health = await fetch(`${origin}/health`);
			assert.deepEqual(await health.json(), { ok: true });
			if (scenario !== "ok") {
				assert.equal(unfinished, false);
				await request(
					JSON.stringify(good),
					scenario === "fail" ? 503 : 504,
					scenario === "fail"
						? "delivery_unavailable"
						: "delivery_timeout"
				);
				return { scenario, health: true, boundedDeliveryFailure: true };
			}
			for (const [path, name] of [
				["/", "public/index.html"],
				["/app.js", "public/app.js"],
				["/styles.css", "public/styles.css"]
			]) {
				const response = await fetch(origin + path);
				assert.equal(response.status, 200);
				assert.equal(
					sha(new Uint8Array(await response.arrayBuffer())),
					sha(files.get(name))
				);
			}
			for (const path of [
				"/README.md",
				"/.env.example",
				"/src/validation.js"
			])
				assert.equal((await fetch(origin + path)).status, 404);
			const method = await fetch(`${origin}/api/contact`);
			assert.equal(method.status, 405);
			assert.equal(method.headers.get("allow"), "POST");
			await method.arrayBuffer();
			await request(
				JSON.stringify(good),
				unfinished ? 501 : 202,
				unfinished ? "not_implemented" : null
			);
			await request(
				JSON.stringify({ ...good, replyTo: ".reader@example.invalid" }),
				unfinished ? 501 : 400,
				unfinished ? "not_implemented" : "invalid_contact"
			);
			await request("{", 400, "invalid_json");
			await request(
				JSON.stringify({ ...good, extra: true }),
				unfinished ? 501 : 400,
				unfinished ? "not_implemented" : "invalid_contact"
			);
			await request(
				JSON.stringify({ message: "x".repeat(9000) }),
				413,
				"body_too_large"
			);
			await request(JSON.stringify(good), 415, "unsupported_media_type", {
				"Content-Type": "text/plain"
			});
			await request(JSON.stringify(good), 429, "rate_limited");
			return {
				scenario,
				health: true,
				exactHttpFiles: 3,
				privateFilesRejected: 3,
				errorAndRateCases: 7
			};
		}
		finally {
			clearTimeout(timer);
			if (child.exitCode === null && child.signalCode === null)
				child.kill("SIGTERM");
			const cleanupTimer = setTimeout(() => {
				try {
					process.kill(-child.pid, "SIGKILL");
				}
				catch {}
			}, 1500);
			try {
				await exited;
			}
			finally {
				clearTimeout(cleanupTimer);
			}
			log({
				event: "child-end",
				pid: child.pid,
				startedAt,
				endedAt: new Date().toISOString(),
				exitCode: child.exitCode,
				signal: child.signalCode,
				cleanup: "terminated and awaited owned process group"
			});
			assert.equal(stderr, "");
			assert.equal(child.exitCode, 0);
			for (const value of [
				good.name,
				good.replyTo,
				good.message,
				"Error:",
				" at "
			])
				assert.equal(stdout.includes(value), false);
			for (const line of stdout.trim().split("\n")) {
				const record = JSON.parse(line);
				if (record.event === "contact_request") {
					assert.deepEqual(Object.keys(record).sort(), [
						"event",
						"outcome",
						"status"
					]);
				}
			}
		}
	}

	await mkdir(dirname(proofPath), { recursive: true });
	const scratch = await mkdtemp(join(dirname(proofPath), "contact-exports-"));
	try {
		assert.equal(await gitRevision(), fixture.revision);
		for (const path of [
			"package.json",
			"package-lock.json",
			`${fixture.pack}/starter/package.json`,
			`${fixture.pack}/solution/package.json`
		]) {
			proof.dependencyInputs[path] = sha(
				await readFile(join(source, path))
			);
		}
		await symlink(
			join(source, "node_modules"),
			join(scratch, "node_modules"),
			"dir"
		);
		const profiles = [];
		for (const role of ["starter", "solution"]) {
			const meta = JSON.parse(
				await readFile(join(exportsPath, `${role}.json`), "utf8")
			);
			assert.equal(meta.sourceRevision, fixture.revision);
			assert.equal(
				meta.courseProjectKey,
				`web-development-foundations:contact-api:${role === "starter" ? "starter" : "reference"}:web-source-v1`
			);
			profiles.push({
				name: `saved-${role}`,
				role,
				unfinished: false,
				files: unpack(
					await readFile(join(exportsPath, `${role}.zip`)),
					meta.files
				)
			});
		}
		if (browserPath !== "none") {
			const browser = JSON.parse(
				await readFile(
					join(
						resolve(browserPath),
						"web-contact-api-course-proof.json"
					),
					"utf8"
				)
			);
			assert.equal(browser.profiles.length, 4);
			assert.deepEqual(
				new Set(
					browser.profiles.map(row => `${row.role}:${row.width}`)
				),
				new Set([
					"starter:390",
					"starter:1280",
					"solution:390",
					"solution:1280"
				])
			);
			for (const row of browser.profiles) {
				assert.equal(row.revision, fixture.revision);
				for (const flag of [
					"consentBeforeFetch",
					"primaryStoreRead",
					"codeAndTraceSaved",
					"sameAttemptReused",
					"previousWorkPreserved",
					"nativeInstructions"
				])
					assert.equal(row[flag], true);
				for (const [kind, field] of [
					["exactArchive", "sourceFiles"],
					["editedArchive", "editedFiles"]
				]) {
					assert.equal(basename(row[kind]), row[kind]);
					const bytes = await readFile(
						join(resolve(browserPath), row[kind])
					);
					assert.equal(sha(bytes), row[`${kind}Sha256`]);
					const files = unpack(bytes, row[field]);
					for (const [name, data] of files) {
						if (
							kind === "editedArchive"
							&& ["src/validation.js", "README.md"].includes(name)
						) {
							continue;
						}
						const path = `${fixture.pack}/${fixture.sharedFiles.includes(name) ? "" : `${row.role}/`}${name}`;
						assert.equal(sha(data), fixture.files[path].sha256);
					}
					profiles.push({
						name: `${row.role}-${row.width}-${kind}`,
						role: row.role,
						unfinished: row.role === "starter",
						files
					});
				}
			}
		}
		for (const profile of profiles) {
			const root = join(scratch, profile.name);
			for (const [name, bytes] of profile.files) {
				await mkdir(dirname(join(root, name)), { recursive: true });
				await writeFile(join(root, name), bytes);
			}
			const pure = await validation(root, profile.unfinished);
			const http = [
				await server(root, profile.files, profile.unfinished)
			];
			if (profile.name.startsWith("saved-")) {
				for (const scenario of ["fail", "timeout"]) {
					http.push(
						await server(root, profile.files, false, scenario)
					);
				}
			}
			proof.profiles.push({
				name: profile.name,
				role: profile.role,
				files: names.length,
				validation: pure,
				http
			});
		}
		proof.accepted = true;
	}
	finally {
		await rm(scratch, { recursive: true, force: true });
		await writeFile(proofPath, `${JSON.stringify(proof, null, 2)}\n`);
	}
	console.log(
		JSON.stringify({
			accepted: proof.accepted,
			profiles: proof.profiles.length,
			sourceRevision: proof.sourceRevision,
			proofPath
		})
	);
}

main().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});
