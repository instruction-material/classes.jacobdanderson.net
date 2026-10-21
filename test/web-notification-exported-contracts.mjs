import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { once } from "node:events";
import { createHash } from "node:crypto";
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { createConnection } from "node:net";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { unzipSync } from "fflate";

const option = (name, fallback) => {
	const index = process.argv.indexOf(name);
	return index === -1 ? fallback : process.argv[index + 1];
};
const exportsPath = resolve(
	option("--exports", "front-end/output/web-notification-exports")
);
const proofPath = resolve(
	option("--proof", "output/web-notification-native/proof.json")
);
const fixture = JSON.parse(
	await readFile(
		new URL("./fixtures/web-notification-source.json", import.meta.url),
		"utf8"
	)
);
const proof = {
	accepted: false,
	sourceRevision: fixture.revision,
	roles: [],
	releaseCandidate: false
};
const sha = bytes => createHash("sha256").update(bytes).digest("hex");

async function defaultPortFree() {
	return new Promise(resolve => {
		const socket = createConnection({ host: "127.0.0.1", port: 4174 });
		const finish = value => {
			socket.destroy();
			resolve(value);
		};
		socket.once("connect", () => finish(false));
		socket.once("error", error => finish(error.code === "ECONNREFUSED"));
		socket.setTimeout(250, () => finish(false));
	});
}

async function verifyModel(root) {
	const { createState, normalizeEvent, applyEvents, visibleEntries } =
		await import(pathToFileURL(join(root, "state.mjs")));
	const event = {
		id: "e1",
		sequence: 1,
		type: "message",
		text: "  雪の星 <b>text</b>  "
	};
	const a = createState();
	const b = createState();
	a.entries.push(event);
	assert.equal(b.entries.length, 0);
	assert.equal(b.phase, "ready");
	const original = structuredClone(event);
	assert.deepEqual(normalizeEvent(event), {
		...event,
		text: event.text.trim()
	});
	assert.deepEqual(event, original);
	assert.equal(
		normalizeEvent({
			...event,
			id: "x".repeat(32),
			text: "y".repeat(160),
			sequence: 1000000
		}).text.length,
		160
	);
	for (const value of [
		null,
		[],
		{},
		{ ...event, id: "x".repeat(33) },
		{ ...event, type: "other" },
		{ ...event, text: " " },
		{ ...event, text: 42 },
		{ ...event, text: "x".repeat(161) },
		{ ...event, sequence: -1 },
		{ ...event, sequence: 0.5 },
		{ ...event, sequence: 1000001 }
	])
		assert.equal(normalizeEvent(value), null);
	const data = async name =>
		JSON.parse(await readFile(join(root, name + ".json"), "utf8"));
	const current = createState();
	const before = structuredClone(current);
	const next = applyEvents(current, await data("events"));
	assert.deepEqual(
		next.entries.map(row => row.id),
		["e1", "e2"]
	);
	assert.equal(next.duplicates, 1);
	assert.equal(next.rejected, 1);
	assert.equal(next.phase, "connected");
	assert.deepEqual(current, before);
	const delayed = applyEvents(createState(), await data("out-of-order"));
	assert.deepEqual(
		delayed.entries.map(row => row.id),
		["e2", "e3"]
	);
	assert.equal(delayed.rejected, 1);
	assert.equal(delayed.duplicates, 1);
	const history = applyEvents(createState(), await data("history"));
	assert.deepEqual(
		history.entries.map(row => row.id),
		Array.from({ length: 10 }, (_, index) => "e" + (index + 6))
	);
	let bounded = createState();
	for (let i = 0; i < 150; i++)
		bounded = applyEvents(bounded, [
			{ id: "n" + i, sequence: i, type: "status", text: "One update" }
		]);
	assert.equal(bounded.entries.length, 10);
	assert.equal(bounded.seenIds.length, 100);
	assert.equal(applyEvents(createState(), []).phase, "empty");
	for (const value of [null, {}, Array(101).fill(event)])
		assert.throws(() => applyEvents(createState(), value));
	assert.equal(visibleEntries({ ...next, view: "messages" }).length, 1);
	assert.equal(visibleEntries({ ...next, view: "status" }).length, 1);
	assert.equal(visibleEntries(next).length, 2);
}

async function verifyServer(root, files, role) {
	const useDefault = await defaultPortFree();
	const args = useDefault ? ["serve.mjs"] : ["serve.mjs", ".", "0"];
	const child = spawn(process.execPath, args, {
		cwd: root,
		stdio: ["ignore", "pipe", "pipe"]
	});
	const startedAt = new Date().toISOString();
	let timer;
	let stderr = "";
	const parentTask =
		process.env.CLASSES_FAMILY_TASK_ID ??
		"web-notification-export-contracts";
	console.log(
		JSON.stringify({
			event: "child-start",
			parentTask,
			cwd: root,
			command: [process.execPath, ...args],
			pid: child.pid,
			parentPid: process.pid,
			startedAt,
			timeoutMs: 5000
		})
	);
	child.stderr.on("data", chunk => {
		stderr += chunk;
	});
	try {
		const ready = await new Promise((resolve, reject) => {
			let stdout = "";
			timer = setTimeout(
				() => reject(new Error("Exported server readiness timed out")),
				5000
			);
			child.once("error", reject);
			child.once("exit", code =>
				reject(new Error(`Exported server stopped: ${code} ${stderr}`))
			);
			child.stdout.on("data", chunk => {
				stdout += chunk;
				if (stdout.includes("\n")) {
					try {
						resolve(JSON.parse(stdout.trim()));
					} catch (error) {
						reject(error);
					}
				}
			});
		});
		clearTimeout(timer);
		assert.equal(ready.host, "127.0.0.1");
		if (useDefault) assert.equal(ready.port, 4174);
		const url = `http://127.0.0.1:${ready.port}`;
		let comparisons = 0;
		for (const [name, content] of files) {
			const response = await fetch(url + "/" + name);
			if (["README.md", "serve.mjs"].includes(name)) {
				assert.equal(response.status, 404);
				continue;
			}
			assert.equal(response.status, 200);
			assert.equal(await response.text(), content);
			comparisons += 1;
		}
		return {
			role,
			defaultCommandVerified: useDefault,
			cliArguments: args,
			loopback: true,
			exactHttpFiles: comparisons,
			sharedFilesNotServed: 2
		};
	} finally {
		clearTimeout(timer);
		const ended =
			child.exitCode === null ? once(child, "exit") : Promise.resolve();
		if (child.exitCode === null) child.kill("SIGTERM");
		const force = setTimeout(() => {
			if (child.exitCode === null) child.kill("SIGKILL");
		}, 1000);
		await ended;
		clearTimeout(force);
		console.log(
			JSON.stringify({
				event: "child-end",
				parentTask,
				pid: child.pid,
				startedAt,
				endedAt: new Date().toISOString(),
				exitCode: child.exitCode,
				signal: child.signalCode,
				cleanup:
					"terminated and awaited owned server; child inherits outer validation process group"
			})
		);
	}
}

try {
	for (const role of ["starter", "solution"]) {
		const bytes = await readFile(join(exportsPath, role + ".zip"));
		const metadata = JSON.parse(
			await readFile(join(exportsPath, role + ".json"), "utf8")
		);
		assert.equal(metadata.sourceRevision, fixture.revision);
		assert.equal(metadata.activeFileName, "state.mjs");
		assert.equal(
			metadata.courseProjectKey,
			`web-development-foundations:notification-state:${role === "starter" ? "starter" : "reference"}:web-source-v1`
		);
		const expected = new Map(
			Object.entries(fixture.files)
				.filter(
					([path]) =>
						path.startsWith(`${fixture.pack}/${role}/`) ||
						fixture.sharedFiles.some(
							name => path === `${fixture.pack}/${name}`
						)
				)
				.map(([path, row]) => [path.split("/").at(-1), row.content])
		);
		expected.set(
			"state.mjs",
			fixture.files[`${fixture.pack}/solution/state.mjs`].content +
				"\n// Saved notification completion\n"
		);
		assert.equal(expected.size, 12);
		assert.equal(metadata.files.length, 12);
		const zip = unzipSync(bytes);
		assert.equal(Object.keys(zip).length, 12);
		const directory = await mkdtemp(
			join(tmpdir(), "classes-notification-export-")
		);
		try {
			const seen = new Set();
			let archiveRoot;
			let projectRoot;
			for (const [path, content] of Object.entries(zip)) {
				const parts = path.split("/");
				assert.equal(parts.length, 2);
				assert.ok(
					parts[0] &&
						parts[0] !== "." &&
						parts[0] !== ".." &&
						!parts[0].includes("\\") &&
						!parts[0].includes("\0")
				);
				archiveRoot ??= parts[0];
				assert.equal(parts[0], archiveRoot);
				if (!projectRoot) {
					projectRoot = join(directory, archiveRoot);
					await mkdir(projectRoot);
				}
				const name = parts[1];
				assert.ok(expected.has(name));
				assert.ok(!seen.has(name));
				seen.add(name);
				assert.equal(
					new TextDecoder().decode(content),
					expected.get(name)
				);
				assert.equal(
					metadata.files.find(row => row.name === name)?.content,
					expected.get(name)
				);
				await writeFile(join(projectRoot, name), content);
			}
			await verifyModel(projectRoot);
			const server = await verifyServer(projectRoot, expected, role);
			proof.roles.push({
				role,
				zipSha256: sha(bytes),
				exactZipFiles: 12,
				nativeModelContractGroups: 7,
				...server
			});
		} finally {
			await rm(directory, { recursive: true, force: true });
		}
	}
	proof.accepted = true;
} catch (error) {
	proof.error = error.stack;
	process.exitCode = 1;
} finally {
	await mkdir(dirname(proofPath), { recursive: true });
	await writeFile(proofPath, JSON.stringify(proof, null, 2) + "\n");
}
console.log(
	JSON.stringify({
		accepted: proof.accepted,
		roles: proof.roles.length,
		proof: proofPath
	})
);
