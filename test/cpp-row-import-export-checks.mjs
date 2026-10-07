import assert from "node:assert/strict";
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { rowImportOracle } from "./fixtures/cpp-row-import-packs.mjs";

const sources = ["main.cpp", "task_manager.cpp", "command_parser.cpp", "task_storage.cpp", "task_import.cpp"];

export function completeRowImportFile(folder, name, source, referenceFiles) {
	if (!folder.endsWith("/starter") || name !== "task_import.cpp") return source;
	assert.match(source, /UNFINISHED/);
	assert.equal((source.match(/\/\/ TODO:/g) ?? []).length, 2);
	assert.ok(referenceFiles?.[name]);
	// Complete only the actual importer TODOs through the learner's editor.
	return referenceFiles[name];
}

async function build(directory, diagnostic, runNative, driver = "main.cpp") {
	const flags = ["-std=c++20", "-Wall", "-Wextra", "-Wpedantic", "-Werror", "-g", "-O0", ...(diagnostic ? ["-fsanitize=address,undefined", "-fno-sanitize-recover=all"] : [])];
	const result = await runNative("clang++", [...flags, "-I.", driver, ...sources.slice(1), "-o", "task-import-native"], directory);
	assert.equal(result.code, 0, result.stderr);
	assert.equal(result.stderr, "");
}

export async function verifyRowImportDefaultExport(directory, runNative) {
	try {
		await build(directory, false, runNative);
		await writeFile(join(directory, "incoming.tsv"), "CLASSES_TASKS_V1\n2\t0\tnew\n");
		const result = await runNative(join(directory, "task-import-native"), ["--file", "untouched.tsv"], directory, "add \"base\"\nimport \"incoming.tsv\"\nlist\nquit\n");
		assert.deepEqual(result, { code: 0, stdout: "Loaded 0\nAdded 1\nTasks 1\n1 [open] base\nBye.\n", stderr: "Error: UNFINISHED: implement selective import.\n" });
		await assert.rejects(readFile(join(directory, "untouched.tsv")));
	}
	finally {
		await rm(join(directory, "task-import-native"), { force: true });
		await rm(join(directory, "incoming.tsv"), { force: true });
	}
}

export async function verifyRowImportExport(directory, runNative) {
	const binary = join(directory, "task-import-native");
	const oracleWork = join(directory, "import-oracle-work");
	try {
		for (const diagnostic of [false, true]) {
			await writeFile(join(directory, "export.tsv"), "CLASSES_TASKS_V1\n1\t1\texisting\n");
			const incoming = "CLASSES_TASKS_V1\r\n2\t0\tfirst\r\nbroken\r\n5\t1\tfinished";
			await writeFile(join(directory, "incoming.tsv"), incoming);
			await build(directory, diagnostic, runNative);
			const result = await runNative(binary, ["--file", "export.tsv"], directory, "import \"incoming.tsv\"\nlist\nquit\n");
			assert.deepEqual(result, { code: 0, stdout: "Loaded 1\nImported 2 rejected 1\nRejected line 3: expected ID<TAB>status<TAB>text\nTasks 3\n1 [done] existing\n2 [open] first\n5 [done] finished\nBye.\n", stderr: "" });
			assert.equal(await readFile(join(directory, "export.tsv"), "utf8"), "CLASSES_TASKS_V1\n1\t1\texisting\n");
			const saved = await runNative(binary, ["--file", "export.tsv"], directory, "import \"incoming.tsv\"\nsave\nquit\n");
			assert.equal(saved.code, 0, saved.stderr);
			assert.equal(saved.stdout, "Loaded 1\nImported 2 rejected 1\nRejected line 3: expected ID<TAB>status<TAB>text\nSaved 3\nBye.\n");
			assert.equal(await readFile(join(directory, "export.tsv"), "utf8"), "CLASSES_TASKS_V1\n1\t1\texisting\n2\t0\tfirst\n5\t1\tfinished\n");
			assert.equal(await readFile(join(directory, "incoming.tsv"), "utf8"), incoming);
			const restarted = await runNative(binary, ["--file", "export.tsv"], directory, "add \"next\"\nquit\n");
			assert.deepEqual(restarted, { code: 0, stdout: "Loaded 3\nAdded 6\nBye.\n", stderr: "" });
			await writeFile(join(directory, "import-oracle.cpp"), rowImportOracle);
			await build(directory, diagnostic, runNative, "import-oracle.cpp");
			await mkdir(oracleWork);
			assert.deepEqual(await runNative(binary, [], oracleWork), { code: 0, stdout: "", stderr: "" });
			await rm(oracleWork, { recursive: true });
		}
	}
	finally {
		await rm(oracleWork, { recursive: true, force: true });
		for (const name of ["task-import-native", "import-oracle.cpp", "export.tsv", "incoming.tsv"])
			await rm(join(directory, name), { force: true });
	}
}
