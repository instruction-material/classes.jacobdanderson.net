import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { readFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import process from "node:process";
import { it } from "node:test";
import vm from "node:vm";
import {
	inspectVendoredD3,
	policy,
	restoreLegacyBundle
} from "./verify-vendored-d3.mjs";

const root = resolve(import.meta.dirname, "..");
function load(source) {
	const context = vm.createContext({});
	vm.runInContext(source, context, { timeout: 1000 });
	return context.d3;
}
const colors = [
	"red",
	"steelblue",
	"rebeccapurple",
	"transparent",
	"none",
	"",
	"not-a-color",
	"#000",
	"#fff",
	"#1234",
	"#ff00ff80",
	"#abcdef",
	"hsl(180,50%,25%)",
	"rgba(0,0,0,.5)"
];
for (const value of [
	"-25",
	"-1",
	"0",
	".1",
	"1.25",
	"100",
	"1e2",
	"2E+1",
	"-5e-2",
	"999"
]) {
	for (const spaces of ["", " ", "  "]) {
		colors.push(
			`rgb(${spaces}${value}%, 25%, 75%)`,
			`rgba(1,2,3,${spaces}${value})`,
			`hsl(${value},50%,25%)`,
			`hsla(180,50%,25%,${value})`
		);
	}
}

function probe(path, restore) {
	const code = String.raw`
		const fs = require("node:fs");
		const vm = require("node:vm");
		const policy = JSON.parse(fs.readFileSync("scripts/vendored-d3-security.json","utf8"));
		let source = fs.readFileSync(process.argv[1],"utf8");
		if (process.argv[2] === "restore") source = source.replace(policy.patchNotice,"").split(policy.fixedFragment).join(policy.oldFragment);
		const context = vm.createContext({});
		vm.runInContext(source,context,{timeout:1000});
		context.input = "rgb(" + "0".repeat(100000) + "a";
		let result;
		try { result = {timedOut:false,result:vm.runInContext("d3.color(input)",context,{timeout:500})}; }
		catch(error) { if(error.code!=="ERR_SCRIPT_EXECUTION_TIMEOUT")throw error;result={timedOut:true}; }
		console.log(JSON.stringify(result));
	`;
	const command = [
		process.execPath,
		"-e",
		code,
		path,
		restore ? "restore" : "patched"
	];
	const start = new Date().toISOString();
	const child = spawn(command[0], command.slice(1), {
		cwd: root,
		detached: true,
		stdio: ["ignore", "pipe", "pipe"]
	});
	const metadata = {
		parentTask:
			process.env.CLASSES_FAMILY_TASK_ID || "vendored-d3-security",
		parentPid: process.pid,
		cwd: root,
		command,
		pid: child.pid,
		startedAt: start,
		timeoutMs: 3000
	};
	console.log(JSON.stringify({ event: "start", ...metadata }));
	return new Promise((accept, reject) => {
		let output = "";
		let errors = "";
		let cleaned = false;
		let expired = false;
		const cleanup = () => {
			try {
				process.kill(-child.pid, "SIGKILL");
			}
			catch (error) {
				if (error.code !== "ESRCH") throw error;
			}
			cleaned = true;
		};
		child.stdout.on("data", (data) => {
			output += data;
		});
		child.stderr.on("data", (data) => {
			errors += data;
		});
		const deadline = setTimeout(() => {
			expired = true;
			cleanup();
		}, 3000);
		child.on("error", (error) => {
			clearTimeout(deadline);
			cleanup();
			reject(error);
		});
		child.on("close", (status, signal) => {
			clearTimeout(deadline);
			if (status !== 0 && !cleaned) cleanup();
			console.log(
				JSON.stringify({
					event: "end",
					...metadata,
					endedAt: new Date().toISOString(),
					exitCode: status,
					signal,
					timedOut: expired,
					childProcessGroupCleanup: cleaned
				})
			);
			if (status !== 0 || expired)
				return reject(new Error(`Color probe failed: ${errors}`));
			try {
				accept(JSON.parse(output));
			}
			catch (error) {
				reject(error);
			}
		});
	});
}

it("all published legacy D3 copies contain the exact maintainer security patch", async () => {
	const proof = await inspectVendoredD3();
	assert.equal(proof.knownUnremediatedAdvisoryCopies, 0);
	assert.equal(
		proof.bundles.filter(bundle => bundle.securityBackport).length,
		44
	);
});

for (const entry of policy.legacyBundles) {
	it(`D3 ${entry.version} preserves color behavior and rejects the demonstrated backtracking input`, async () => {
		const source = await readFile(join(root, entry.paths[0]), "utf8");
		const original = load(restoreLegacyBundle(source, entry));
		const patched = load(source);
		assert.deepEqual(
			Object.keys(patched).sort(),
			Object.keys(original).sort()
		);
		for (const input of colors) {
			const before = original.color(input);
			const after = patched.color(input);
			assert.equal(
				after === null ? null : after.toString(),
				before === null ? null : before.toString(),
				input
			);
			if (before)
				assert.equal(after.displayable(), before.displayable(), input);
		}
		assert.equal((await probe(entry.paths[0], true)).timedOut, true);
		assert.deepEqual(await probe(entry.paths[0], false), {
			timedOut: false,
			result: null
		});
	});
}
