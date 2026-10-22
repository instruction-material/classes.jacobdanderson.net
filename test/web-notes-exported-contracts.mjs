import assert from "node:assert/strict";
import { Buffer } from "node:buffer";
import { spawn } from "node:child_process";
import { createHash, randomUUID } from "node:crypto";
import { once } from "node:events";
import {
	mkdir,
	mkdtemp,
	readFile,
	rm,
	symlink,
	writeFile
} from "node:fs/promises";
import { createServer } from "node:net";
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
		option("--source", "output/web-notes-native-source")
	);
	const exportsPath = resolve(
		option("--exports", "front-end/output/web-notes-exports")
	);
	const browserPath = option("--browser", "output/web-notes-browser");
	const proofPath = resolve(
		option("--proof", "output/web-notes-native/proof.json")
	);
	const fixture = JSON.parse(
		await readFile(
			new URL("./fixtures/web-notes-source.json", import.meta.url),
			"utf8"
		)
	);
	const names = [...fixture.roleFiles, ...fixture.sharedFiles];
	const sha = bytes => createHash("sha256").update(bytes).digest("hex");
	const parentTask
		= process.env.CLASSES_FAMILY_TASK_ID ?? "web-notes-export-contracts";
	const proof = {
		accepted: false,
		sourceRevision: fixture.revision,
		profiles: [],
		dependencyInputs: {},
		releaseCandidate: false
	};
	const good = {
		title: "Exported fictional orbit",
		body: "A fictional observation.",
		tags: ["moon, sky", "quote\"tag"]
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
		const model = await import(
			pathToFileURL(join(root, "src/models/note.js"))
		);
		const storage = await import(pathToFileURL(join(root, "src/store.js")));
		const lesson = JSON.parse(
			await readFile(join(exportsPath, "lesson-fixtures.json"), "utf8")
		);
		const converted = {
			schemaVersion: 1,
			notes: lesson.legacy.records.map(row => ({
				id: row.key,
				title: row.heading,
				body: row.text,
				tags: [...row.labels],
				createdAt: new Date(row.createdMs).toISOString(),
				updatedAt: new Date(row.changedMs).toISOString()
			}))
		};
		assert.deepEqual(converted, lesson.converted);
		assert.deepEqual(model.validateSnapshot(converted), converted.notes);
		assert.throws(() =>
			model.validateSnapshot({ ...converted, schemaVersion: 2 })
		);
		if (unfinished) {
			assert.throws(
				() => model.validateNoteInput(good),
				error =>
					error.code === "not_implemented" && error.status === 501
			);
			await assert.rejects(
				storage
					.memoryStore()
					.update(storage.seedSnapshot.notes[0].id, good),
				error => error.code === "not_implemented"
			);
			return { unfinished: true, providedLessonFixtureAccepted: true };
		}
		const valid = [
			good,
			{ title: " 雪の星 ", body: " Fictional text ", tags: [" sky "] },
			{ title: "x".repeat(120), body: "x".repeat(2000) }
		];
		const invalid = [
			null,
			[],
			{},
			2,
			{ ...good, extra: true },
			{ ...good, title: " " },
			{ ...good, title: "x".repeat(121) },
			{ ...good, body: "x".repeat(2001) },
			{ ...good, body: "\uD800" },
			{ ...good, tags: "example" },
			{ ...good, tags: ["x", " x "] },
			{ ...good, tags: ["x".repeat(25)] }
		];
		for (const input of valid) {
			const before = structuredClone(input);
			assert.deepEqual(model.validateNoteInput(input), {
				title: input.title.trim(),
				body: input.body.trim(),
				tags: input.tags?.map(value => value.trim()) ?? []
			});
			assert.deepEqual(input, before);
		}
		for (const input of invalid) {
			const before = structuredClone(input);
			assert.throws(
				() => model.validateNoteInput(input),
				error => error.code === "invalid_note" && error.status === 400
			);
			assert.deepEqual(input, before);
		}
		const store = storage.memoryStore();
		const created = await store.create(good);
		const updated = await store.update(created.id, {
			...good,
			body: "A changed fictional value."
		});
		assert.equal(updated.id, created.id);
		assert.equal(updated.createdAt, created.createdAt);
		updated.tags.push("outside");
		assert.deepEqual((await store.read(created.id)).tags, good.tags);
		return {
			unfinished: false,
			valid: valid.length,
			invalid: invalid.length,
			stableIdentityAndCopies: true,
			providedLessonFixtureAccepted: true
		};
	}

	async function server(
		root,
		files,
		unfinished,
		scenario = "ok",
		restore = null
	) {
		const command = [process.execPath, "src/server.js"];
		const startedAt = new Date().toISOString();
		const env = {
			...process.env,
			PORT: "0",
			NOTES_ADAPTER: "memory",
			NOTES_SCENARIO: scenario
		};
		delete env.MONGODB_URI;
		delete env.NOTES_SEED_FILE;
		if (restore) {
			const path = join(dirname(root), `${basename(root)}-restore.json`);
			await writeFile(path, JSON.stringify(restore.snapshot));
			env.NOTES_SEED_FILE = path;
		}
		const child = track(
			spawn(command[0], command.slice(1), {
				cwd: root,
				env,
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
			timeoutMs: 12000
		});
		let stdout = "";
		let stderr = "";
		const exited = once(child, "exit");
		child.stdout.on("data", (bytes) => {
			stdout += bytes;
		});
		child.stderr.on("data", (bytes) => {
			stderr += bytes;
		});
		const timer = setTimeout(() => {
			try {
				process.kill(-child.pid, "SIGKILL");
			}
			catch {}
		}, 12000);
		try {
			let record;
			const deadline = Date.now() + 6000;
			while (!record && Date.now() < deadline) {
				for (const line of stdout.split("\n")) {
					try {
						const value = JSON.parse(line);
						if (value.event === "ready") record = value;
					}
					catch {}
				}
				if (
					!record
					&& (child.exitCode !== null || child.signalCode !== null)
				) {
					throw new Error("Exported service exited before readiness");
				}
				if (!record)
					await new Promise(resolve => setTimeout(resolve, 20));
			}
			assert.ok(record, "bounded owned service readiness");
			assert.equal(record.host, "127.0.0.1");
			const origin = `http://127.0.0.1:${record.port}`;
			const request = async (
				path,
				method = "GET",
				body,
				headers = { "Content-Type": "application/json" }
			) => {
				const response = await fetch(origin + path, {
					method,
					body: body === undefined ? undefined : body,
					headers,
					signal: AbortSignal.timeout(2500)
				});
				const text = await response.text();
				return {
					status: response.status,
					body:
						text
						&& response.headers
							.get("content-type")
							?.includes("application/json")
							? JSON.parse(text)
							: null,
					text
				};
			};
			assert.deepEqual((await request("/health")).body, {
				ok: true,
				store: "memory"
			});
			if (scenario === "unavailable") {
				assert.equal((await request("/api/ready")).status, 503);
				const result = await request("/api/notes");
				assert.equal(result.status, 503);
				assert.deepEqual(result.body, { error: "storage_unavailable" });
				return { scenario, healthyProcessWithUnavailableStorage: true };
			}
			if (restore) {
				assert.notEqual(record.port, restore.originalPort);
				assert.deepEqual(
					(await request("/api/notes/snapshot")).body,
					restore.snapshot
				);
				assert.equal(
					(await request(`/api/notes/${restore.id}`, "DELETE"))
						.status,
					204
				);
				return { scenario, independentSnapshotRestore: true };
			}
			for (const [path, name] of [
				["/", "public/index.html"],
				["/app.js", "public/app.js"],
				["/styles.css", "public/styles.css"]
			]) {
				const response = await fetch(origin + path, {
					signal: AbortSignal.timeout(2500)
				});
				assert.equal(response.status, 200);
				assert.equal(
					sha(new Uint8Array(await response.arrayBuffer())),
					sha(files.get(name))
				);
			}
			for (const path of ["/README.md", "/.env", "/src/models/note.js"])
				assert.equal((await request(path)).status, 404);
			assert.deepEqual((await request("/api/missing")).body, {
				error: "not_found"
			});
			assert.equal((await request("/api/notes", "PATCH")).status, 405);
			assert.equal(
				(await request("/api/notes", "POST", "{bad")).status,
				400
			);
			assert.equal(
				(
					await request("/api/notes", "POST", "{}", {
						"Content-Type": "text/plain"
					})
				).status,
				415
			);
			assert.equal(
				(
					await request(
						"/api/notes",
						"POST",
						JSON.stringify({ body: "x".repeat(17000) })
					)
				).status,
				413
			);
			const result = await request(
				"/api/notes",
				"POST",
				JSON.stringify(good)
			);
			if (unfinished) {
				assert.equal(result.status, 501);
				assert.deepEqual(result.body, { error: "not_implemented" });
				return {
					scenario,
					exactHttpFiles: 3,
					privateFilesRejected: 3,
					unfinishedStarterExplicit: true
				};
			}
			assert.equal(result.status, 201);
			const created = result.body;
			assert.deepEqual(
				(await request(`/api/notes/${created.id}`)).body,
				created
			);
			assert.deepEqual(
				(
					await request(
						`/api/notes?title=${encodeURIComponent(good.title)}`
					)
				).body,
				[created]
			);
			assert.equal(
				(await request("/api/notes", "POST", JSON.stringify(good)))
					.status,
				409
			);
			const changed = await request(
				`/api/notes/${created.id}`,
				"PUT",
				JSON.stringify({
					...good,
					body: "Changed through the exported service."
				})
			);
			assert.equal(changed.status, 200);
			assert.equal(changed.body.id, created.id);
			assert.equal(changed.body.createdAt, created.createdAt);
			assert.deepEqual(changed.body.tags, good.tags);
			const snapshot = (await request("/api/notes/snapshot")).body;
			await server(root, files, false, "ok", {
				snapshot,
				id: created.id,
				originalPort: record.port
			});
			assert.equal(
				(await request(`/api/notes/${created.id}`)).status,
				200
			);
			assert.equal(
				(await request(`/api/notes/${created.id}`, "DELETE")).status,
				204
			);
			assert.equal(
				(await request(`/api/notes/${created.id}`)).status,
				404
			);
			assert.equal(
				(
					await request(
						"/api/notes",
						"POST",
						JSON.stringify({ ...good, extra: true })
					)
				).status,
				400
			);
			return {
				scenario,
				exactHttpFiles: 3,
				privateFilesRejected: 3,
				actualCrudAndStableIdentity: true,
				exactTags: true,
				independentSnapshotRestore: true
			};
		}
		finally {
			clearTimeout(timer);
			if (child.exitCode === null && child.signalCode === null)
				child.kill("SIGTERM");
			const cleanup = setTimeout(() => {
				try {
					process.kill(-child.pid, "SIGKILL");
				}
				catch {}
			}, 1500);
			try {
				await exited;
			}
			finally {
				clearTimeout(cleanup);
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
			for (const text of [good.title, good.body, "Error:", " at "])
				assert.equal(stdout.includes(text), false);
			for (const line of stdout.trim().split("\n")) {
				const value = JSON.parse(line);
				if (value.event === "request") {
					assert.deepEqual(Object.keys(value).sort(), [
						"event",
						"status"
					]);
				}
			}
		}
	}

	async function mongoExports(scratch, profiles) {
		if (!process.env.WEB_NOTES_TEST_MONGOD) {
			return { enabled: false, profiles: [] };
		}
		const reservation = createServer();
		await new Promise(resolveReady =>
			reservation.listen(0, "127.0.0.1", resolveReady)
		);
		const port = reservation.address().port;
		await new Promise(resolveClosed => reservation.close(resolveClosed));
		const database = join(scratch, "owned-mongodb");
		await mkdir(database);
		const command = [
			process.env.WEB_NOTES_TEST_MONGOD,
			"--bind_ip",
			"127.0.0.1",
			"--port",
			String(port),
			"--dbpath",
			database,
			"--wiredTigerCacheSizeGB",
			"0.25",
			"--nounixsocket",
			"--quiet"
		];
		const startedAt = new Date().toISOString();
		const child = track(
			spawn(command[0], command.slice(1), {
				cwd: scratch,
				detached: true,
				stdio: ["ignore", "pipe", "pipe"]
			})
		);
		const exited = once(child, "exit");
		let stdout = "";
		child.stdout.on("data", (bytes) => {
			stdout += bytes;
		});
		child.stderr.on("data", () => {});
		log({
			event: "child-start",
			command,
			cwd: scratch,
			pid: child.pid,
			startedAt,
			timeoutMs: 20000
		});
		const timer = setTimeout(() => {
			try {
				process.kill(-child.pid, "SIGKILL");
			}
			catch {}
		}, 20000);
		const connections = [];
		const results = [];
		try {
			let ready = false;
			const deadline = Date.now() + 10000;
			while (!ready && Date.now() < deadline) {
				ready = stdout.split("\n").some((line) => {
					try {
						const row = JSON.parse(line);
						return (
							row.msg === "Waiting for connections"
							&& row.attr.port === port
						);
					}
					catch {
						return false;
					}
				});
				if (
					!ready
					&& (child.exitCode !== null || child.signalCode !== null)
				) {
					throw new Error("Owned MongoDB exited before readiness");
				}
				if (!ready) {
					await new Promise(resolveReady =>
						setTimeout(resolveReady, 25)
					);
				}
			}
			assert.ok(ready);
			for (const profile of profiles.filter(row =>
				row.name.startsWith("saved-")
			)) {
				const root = join(scratch, profile.name);
				const { mongoStore } = await import(
					pathToFileURL(join(root, "src/store.js"))
				);
				const uri = `mongodb://127.0.0.1:${port}/wdf2_export_${randomUUID().replaceAll("-", "")}`;
				let store = await mongoStore(uri);
				connections.push(store);
				const created = await store.create(good);
				const updated = await store.update(created.id, {
					...good,
					body: "A persisted exported note."
				});
				assert.equal(updated.id, created.id);
				assert.equal(updated.createdAt, created.createdAt);
				assert.deepEqual(updated.tags, good.tags);
				await store.close();
				store = await mongoStore(uri);
				connections.push(store);
				assert.deepEqual(await store.read(created.id), updated);
				const snapshot = {
					schemaVersion: 1,
					notes: await store.list()
				};
				const restored = await mongoStore(`${uri}_restore`, snapshot);
				connections.push(restored);
				assert.deepEqual(await restored.list(), snapshot.notes);
				assert.equal(await restored.remove(created.id), true);
				assert.deepEqual(await store.read(created.id), updated);
				await assert.rejects(
					mongoStore(`${uri}_restore`, snapshot),
					error => error.code === "restore_target_not_empty"
				);
				await restored.close();
				await store.close();
				results.push({
					name: profile.name,
					stableIdentity: true,
					connectionReopenPreservesRecord: true,
					exactTags: true,
					independentRestore: true,
					overwriteRefused: true
				});
			}
			return { enabled: true, profiles: results };
		}
		finally {
			await Promise.allSettled(connections.map(store => store.close()));
			clearTimeout(timer);
			if (child.exitCode === null && child.signalCode === null)
				child.kill("SIGTERM");
			const cleanup = setTimeout(() => {
				try {
					process.kill(-child.pid, "SIGKILL");
				}
				catch {}
			}, 1500);
			try {
				await exited;
			}
			finally {
				clearTimeout(cleanup);
			}
			log({
				event: "child-end",
				pid: child.pid,
				startedAt,
				endedAt: new Date().toISOString(),
				exitCode: child.exitCode,
				signal: child.signalCode,
				cleanup:
					"owned MongoDB and adapter connections closed before disposable data removal"
			});
			assert.equal(child.exitCode, 0);
		}
	}

	await mkdir(dirname(proofPath), { recursive: true });
	const scratch = await mkdtemp(join(dirname(proofPath), "notes-exports-"));
	try {
		assert.equal(await gitRevision(), fixture.revision);
		for (const [path, expected] of Object.entries(
			fixture.dependencyInputs
		)) {
			const bytes = await readFile(join(source, path));
			const canonical = Buffer.from(
				bytes.toString().replace(/\r\n/g, "\n")
			);
			assert.equal(sha(canonical), expected, path);
			proof.dependencyInputs[path] = {
				gitSha256: expected,
				workingSha256: sha(bytes),
				normalizedCRLF: !bytes.equals(canonical)
			};
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
				`web-development-foundations:notes-api:${role === "starter" ? "starter" : "reference"}:web-source-v1`
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
						"web-notes-api-course-proof.json"
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
							&& ["src/models/note.js", "README.md"].includes(name)
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
				for (const scenario of ["unavailable"]) {
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
		proof.mongodbExports = await mongoExports(scratch, profiles);
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
