import assert from "node:assert/strict";
import { rm, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { checkpointOracle } from "./fixtures/cpp-build-debug-packs.mjs";

export function completeBuildDebugFile(folder, name, source) {
	if (!folder.endsWith("/starter") || name !== "score_tools.cpp")
		return source;
	const bug = "for (std::size_t index = 1; index < scores.size(); ++index)";
	assert.equal(source.split(bug).length, 2);
	// This QA edit occurs through CodeMirror. It is never supplied to a learner.
	return source.replace(bug, bug.replace("index = 1", "index = 0"));
}

async function checkProgram(binary, directory, repaired, runNative) {
	const demo = await runNative(binary, [], directory);
	assert.equal(demo.code, 0, demo.stderr);
	assert.equal(demo.stderr, "");
	assert.equal(demo.stdout, `Scores: 40 60 80\nTotal: ${repaired ? 180 : 140}\n`);
	const check = await runNative(binary, ["--check"], directory);
	assert.equal(check.code, repaired ? 0 : 1, check.stderr);
	assert.equal(check.stderr, "");
	assert.equal(check.stdout.split("\n").filter(Boolean).length, 7);
	assert.equal(check.stdout.match(/ PASS\n/g)?.length, repaired ? 7 : 3);
	assert.equal(check.stdout.match(/ FAIL\n/g)?.length ?? 0, repaired ? 0 : 4);
	for (const [scores, total] of [
		[[], 0],
		[[85], repaired ? 85 : 0],
		[[0, 60], 60],
		[[60, 0], repaired ? 60 : 0],
		[[12, 23, 34, 0, 5], repaired ? 74 : 62],
		[Array.from({ length: 20 }).fill(100), repaired ? 2000 : 1900]
	]) {
		const output = await runNative(binary, ["--scores", ...scores.map(String)], directory);
		assert.equal(output.code, 0, output.stderr);
		assert.equal(output.stderr, "");
		assert.equal(output.stdout, `Scores:${scores.map(value => ` ${value}`).join("")}\nTotal: ${total}\n`);
	}
	const trace = await runNative(binary, ["--trace", "--scores", "85"], directory);
	assert.equal(trace.code, 0, trace.stderr);
	assert.equal(trace.stderr, "");
	assert.equal(trace.stdout, repaired ? "Scores: 85\ntrace index=0 score=85 running=85\nTotal: 85\n" : "Scores: 85\nTotal: 0\n");
	for (const args of [
		["--unknown"],
		["--scores", "50", "-1"],
		["--scores", "+1"],
		["--scores", "101"],
		["--scores", "1x"],
		["--scores", " 1"],
		["--scores", "2147483648"],
		["--scores", ...Array.from({ length: 21 }).fill("1")]
	]) {
		const rejected = await runNative(binary, args, directory);
		assert.equal(rejected.code, 2);
		assert.equal(rejected.stdout, "");
		assert.ok(rejected.stderr);
	}
}

async function verify(directory, repaired, runNative) {
	try {
		for (const diagnostic of [false, true]) {
			const flags = ["-std=c++20", "-Wall", "-Wextra", "-Wpedantic", "-Werror", "-g", "-O0", ...(diagnostic ? ["-fsanitize=address,undefined", "-fno-sanitize-recover=all"] : [])];
			const built = await runNative("clang++", [...flags, "main.cpp", "score_ledger.cpp", "score_tools.cpp", "-o", "checkpoint-native"], directory);
			assert.equal(built.code, 0, built.stderr);
			assert.equal(built.stderr, "");
			await checkProgram(join(directory, "checkpoint-native"), directory, repaired, runNative);
			if (repaired) {
				await writeFile(join(directory, "native-check.cpp"), checkpointOracle);
				const harness = await runNative("clang++", [...flags, "-I.", "native-check.cpp", "score_ledger.cpp", "score_tools.cpp", "-o", "native-check"], directory);
				assert.equal(harness.code, 0, harness.stderr);
				assert.equal(harness.stderr, "");
				const observed = await runNative(join(directory, "native-check"), [], directory);
				assert.equal(observed.code, 0, observed.stderr);
				assert.equal(observed.stderr, "");
				assert.equal(observed.stdout, "");
			}
		}
		const make = await runNative("make", ["checkpoint", "checkpoint-debug"], directory);
		assert.equal(make.code, 0, make.stderr);
		for (const header of ["score_ledger.h", "score_tools.h"]) {
			const dependency = await runNative("make", ["-n", "-W", header, "checkpoint", "checkpoint-debug"], directory);
			assert.equal(dependency.code, 0, dependency.stderr);
			assert.equal(dependency.stdout.match(/ -o checkpoint/g)?.length, 2);
		}
		for (const name of ["checkpoint", "checkpoint-debug"])
			await checkProgram(join(directory, name), directory, repaired, runNative);
	}
	finally {
		const cleaned = await runNative("make", ["clean"], directory);
		assert.equal(cleaned.code, 0, cleaned.stderr);
		for (const name of ["native-check.cpp", "native-check", "checkpoint-native"])
			await rm(join(directory, name), { force: true });
	}
}

export async function verifyBuildDebugDefaultExport(directory, runNative) {
	await verify(directory, false, runNative);
}

export async function verifyBuildDebugExport(directory, runNative) {
	await verify(directory, true, runNative);
}
