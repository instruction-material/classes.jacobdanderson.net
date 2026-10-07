import assert from "node:assert/strict";
import { readFile, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { taskManagerOracle } from "./fixtures/cpp-task-manager-packs.mjs";

const sources = ["main.cpp", "task_manager.cpp", "command_parser.cpp", "task_storage.cpp"];
const headers = ["task_manager.h", "command_parser.h", "task_storage.h"];
const taskFiles = new Set(sources.slice(1));

export function completeTaskManagerFile(folder, name, source, referenceFiles) {
	if (!folder.endsWith("/starter") || !taskFiles.has(name)) return source;
	assert.match(source, /UNFINISHED/);
	assert.ok(referenceFiles?.[name]);
	// Staff reference bodies are a QA completion, entered through CodeMirror.
	// They are not imported into the learner's untouched pack.
	return referenceFiles[name];
}

async function build(directory, diagnostic, runNative, driver = "main.cpp") {
	const flags = ["-std=c++20", "-Wall", "-Wextra", "-Wpedantic", "-Werror", "-g", "-O0", ...(diagnostic ? ["-fsanitize=address,undefined", "-fno-sanitize-recover=all"] : [])];
	const result = await runNative("clang++", [...flags, "-I.", driver, ...sources.slice(1), "-o", "task-manager-native"], directory);
	assert.equal(result.code, 0, result.stderr);
	assert.equal(result.stderr, "");
}

export async function verifyTaskManagerDefaultExport(directory, runNative) {
	try {
		await build(directory, false, runNative);
		const result = await runNative(join(directory, "task-manager-native"), ["--file", "untouched.tsv"], directory);
		assert.deepEqual(result, { code: 1, stdout: "", stderr: "Error: UNFINISHED: implement loading a task file.\n" });
		const help = await runNative(join(directory, "task-manager-native"), ["--help"], directory);
		assert.equal(help.code, 0, help.stderr);
		assert.match(help.stdout, /Commands: add/);
		assert.equal(help.stderr, "");
	}
	finally {
		await rm(join(directory, "task-manager-native"), { force: true });
	}
}

export async function verifyTaskManagerExport(directory, runNative) {
	try {
		for (const diagnostic of [false, true]) {
			await rm(join(directory, "cli.tsv"), { force: true });
			await build(directory, diagnostic, runNative);
			const binary = join(directory, "task-manager-native");
			const first = await runNative(binary, ["--file", "cli.tsv"], directory, "add \"first\"\nadd \"second\"\ndone 1\nlist open\nlist done\nsave\nquit\nadd \"ignored\"\n");
			assert.deepEqual(first, { code: 0, stdout: "Loaded 0\nAdded 1\nAdded 2\nCompleted 1\nTasks 1\n2 [open] second\nTasks 1\n1 [done] first\nSaved 2\nBye.\n", stderr: "" });
			const saved = "CLASSES_TASKS_V1\n1\t1\tfirst\n2\t0\tsecond\n";
			assert.equal(await readFile(join(directory, "cli.tsv"), "utf8"), saved);
			const reopened = await runNative(binary, ["--file", "cli.tsv"], directory, "add bad\ndone 99\nadd \"unsaved\"\nreload\nlist\nquit\n");
			assert.deepEqual(reopened, { code: 0, stdout: "Loaded 2\nAdded 3\nLoaded 2\nTasks 2\n1 [done] first\n2 [open] second\nBye.\n", stderr: "Error: Expected one quoted task text.\nError: Unknown task ID.\n" });
			assert.equal(await readFile(join(directory, "cli.tsv"), "utf8"), saved);
			const eof = await runNative(binary, ["--file", "cli.tsv"], directory, "add \"unsaved at EOF\"\n");
			assert.deepEqual(eof, { code: 0, stdout: "Loaded 2\nAdded 3\n", stderr: "" });
			assert.equal(await readFile(join(directory, "cli.tsv"), "utf8"), saved);
			await writeFile(join(directory, "native-check.cpp"), taskManagerOracle);
			await build(directory, diagnostic, runNative, "native-check.cpp");
			assert.deepEqual(await runNative(binary, [], directory), { code: 0, stdout: "", stderr: "" });
			// The oracle creates a directory and a link as rejected storage paths.
			for (const name of ["directory.tsv", "link.tsv", "tasks.tsv"])
				await rm(join(directory, name), { recursive: true, force: true });
		}
		const made = await runNative("make", ["task-manager", "task-manager-debug"], directory);
		assert.equal(made.code, 0, made.stderr);
		for (const header of headers) {
			const dependencies = await runNative("make", ["-n", "-W", header, "task-manager", "task-manager-debug"], directory);
			assert.equal(dependencies.code, 0, dependencies.stderr);
			assert.equal(dependencies.stdout.match(/ -o task-manager/g)?.length, 2);
		}
	}
	finally {
		const clean = await runNative("make", ["clean"], directory);
		assert.equal(clean.code, 0, clean.stderr);
		for (const name of ["task-manager-native", "native-check.cpp", "cli.tsv", "tasks.tsv", "tasks.tsv.tmp", "directory.tsv", "link.tsv"])
			await rm(join(directory, name), { recursive: true, force: true });
	}
}
