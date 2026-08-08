#!/usr/bin/env node

/* eslint style/operator-linebreak: "off" */

import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import process from "node:process";

const DEFAULT_MATERIAL_ROOT = path.join(
	os.homedir(),
	"Documents/Work/Instruction-Material"
);
const MATERIAL_ROOT = path.resolve(
	process.env.INSTRUCTION_MATERIAL_ROOT ?? DEFAULT_MATERIAL_ROOT
);
const WRITE_CHANGES = process.argv.includes("--write");
const CHECK_FORMATTING = process.argv.includes("--check");
const INCLUDE_DIRTY_FILES = process.argv.includes("--include-dirty");
const REPOSITORY_FILTER = process.argv
	.find(argument => argument.startsWith("--repository="))
	?.slice("--repository=".length);
const EXCLUDED_PATHS = new Set(
	process.argv
		.filter(argument => argument.startsWith("--exclude="))
		.map(argument => argument.slice("--exclude=".length))
);
const REPOSITORY_EXCLUSIONS = new Set([
	"classes.jacobdanderson.net",
	"static.classes.jacobdanderson.net"
]);
const CODE_EXTENSION_RE =
	/\.(?:[chs]|cc|cpp|cxx|css|hh|hpp|html|java|js|jsx|mjs|py|rs|sh|swift|ts|tsx)$/i;
const PYTHON_EXTENSION_RE = /\.py$/i;
const CLANG_EXTENSION_RE = /\.(?:c|cc|cpp|cxx|h|hh|hpp|java)$/i;
const PRETTIER_EXTENSION_RE = /\.(?:css|html|js|jsx|mjs|ts|tsx)$/i;
const SWIFT_EXTENSION_RE = /\.swift$/i;
const ARCHIVED_OR_GENERATED_RE =
	/(?:^|\/)(?:_?archived[^/]*|build|coverage|dist|node_modules|pysynth|third[_-]party|vendor)(?:\/|$)/i;
const INTENTIONAL_DEBUGGING_RE =
	/(?:^|[/_-])(?:broken|buggy|debug|debugging)(?:[/_.-]|$)/i;
const SOLUTION_SEGMENT_RE = /(?:^|\/)solutions?(?:\/|$)/i;
const MINIFIED_FILE_RE = /\.min\.(?:css|js)$/i;
const TRAILING_WHITESPACE_RE = /[\t ]+$/gm;
const EXTRA_FINAL_NEWLINES_RE = /\n{2,}$/;
const GENERIC_STANDARD_LINE =
	"Use named constants, descriptive names, and purpose comments before nontrivial scopes";
const FORMATTER_BATCH_SIZE = 100;
const SWIFT_FORMAT_CONFIGURATION = JSON.stringify({
	indentation: { spaces: 4 },
	lineLength: 80,
	maximumBlankLines: 3,
	respectsExistingLineBreaks: true,
	version: 1
});

if (WRITE_CHANGES && CHECK_FORMATTING) {
	throw new Error("Choose either --write or --check, not both");
}

function run(command, args, options = {}) {
	return spawnSync(command, args, {
		cwd: options.cwd,
		encoding: "utf8",
		maxBuffer: 20 * 1024 * 1024,
		stdio: options.capture ? "pipe" : "inherit"
	});
}

function commandOutput(command, args, cwd) {
	const result = run(command, args, { capture: true, cwd });
	if (result.status !== 0) {
		throw new Error(result.stderr || result.stdout || `${command} failed`);
	}
	return result.stdout;
}

function trackedDirtyPaths(repositoryPath) {
	const status = commandOutput(
		"git",
		["status", "--porcelain=v1", "-z", "--untracked-files=no"],
		repositoryPath
	);

	return new Set(
		status
			.split("\0")
			.filter(Boolean)
			.map(record => record.slice(3))
	);
}

function isCourseCode(repositoryName, relativePath, dirtyPaths) {
	if (EXCLUDED_PATHS.has(`${repositoryName}/${relativePath}`)) return false;
	if (!INCLUDE_DIRTY_FILES && dirtyPaths.has(relativePath)) return false;
	if (!CODE_EXTENSION_RE.test(relativePath)) return false;
	if (ARCHIVED_OR_GENERATED_RE.test(relativePath)) return false;
	if (MINIFIED_FILE_RE.test(relativePath)) return false;
	if (
		INTENTIONAL_DEBUGGING_RE.test(relativePath) &&
		!SOLUTION_SEGMENT_RE.test(relativePath)
	) {
		return false;
	}
	return true;
}

function removeGenericStandardBanner(source) {
	const shebang = source.match(/^#![^\n]*\n/)?.[0] ?? "";
	const sourceWithoutShebang = shebang
		? source.slice(shebang.length)
		: source;
	const lines = sourceWithoutShebang.split("\n");
	const isHashRule = line =>
		line.length >= 3 && [...line].every(character => character === "#");
	const isPythonBanner =
		isHashRule(lines[0] ?? "") &&
		(lines[1] ?? "").replaceAll("#", "").trim() === "CODING STANDARD" &&
		isHashRule(lines[2] ?? "") &&
		lines[3] === `# ${GENERIC_STANDARD_LINE}`;

	if (isPythonBanner) {
		const contentStart = lines[4] === "" ? 5 : 4;
		return `${shebang}${lines.slice(contentStart).join("\n")}`;
	}

	const standardCommentIndex = lines[3] === "" ? 4 : 3;
	const isCStyleBanner =
		(lines[0] ?? "").trimStart().startsWith("/*") &&
		(lines[1] ?? "").replaceAll("*", "").trim() === "CODING STANDARD" &&
		(lines[2] ?? "").trimEnd().endsWith("*/") &&
		lines[standardCommentIndex] === `// ${GENERIC_STANDARD_LINE}`;

	if (isCStyleBanner) {
		const nextLine = standardCommentIndex + 1;
		const contentStart = lines[nextLine] === "" ? nextLine + 1 : nextLine;
		return `${shebang}${lines.slice(contentStart).join("\n")}`;
	}

	return source;
}

function normalizeSourceFile(filePath) {
	const originalSource = fs.readFileSync(filePath, "utf8");
	const sourceWithoutBanner = removeGenericStandardBanner(originalSource);
	const normalizedSource = `${sourceWithoutBanner
		.replace(/\r\n?/g, "\n")
		.replace(TRAILING_WHITESPACE_RE, "")
		.replace(EXTRA_FINAL_NEWLINES_RE, "\n")
		.trimEnd()}\n`;

	if (WRITE_CHANGES && normalizedSource !== originalSource) {
		fs.writeFileSync(filePath, normalizedSource, "utf8");
	}

	return normalizedSource !== originalSource;
}

function resolveExecutable(candidates) {
	for (const candidate of candidates) {
		if (candidate.includes(path.sep) && fs.existsSync(candidate)) {
			return candidate;
		}
		const lookup = run("which", [candidate], {
			capture: true
		});
		if (lookup.status === 0) return candidate;
	}
	return null;
}

function formatBatch(command, baseArgs, files, failedFiles, cwd) {
	if (files.length === 0) return;

	const result = run(command, [...baseArgs, ...files], {
		capture: true,
		cwd
	});
	if (result.status === 0) return;

	if (files.length === 1) {
		failedFiles.push({
			file: files[0],
			reason: (result.stderr || result.stdout || "Formatter failed")
				.trim()
				.split("\n")[0]
		});
		return;
	}

	const midpoint = Math.ceil(files.length / 2);
	formatBatch(command, baseArgs, files.slice(0, midpoint), failedFiles, cwd);
	formatBatch(command, baseArgs, files.slice(midpoint), failedFiles, cwd);
}

function formatFiles(command, baseArgs, files, failedFiles, cwd) {
	for (let index = 0; index < files.length; index += FORMATTER_BATCH_SIZE) {
		formatBatch(
			command,
			baseArgs,
			files.slice(index, index + FORMATTER_BATCH_SIZE),
			failedFiles,
			cwd
		);
	}
}

function repositoryPaths() {
	return fs
		.readdirSync(MATERIAL_ROOT, { withFileTypes: true })
		.filter(entry => entry.isDirectory())
		.filter(entry => !REPOSITORY_EXCLUSIONS.has(entry.name))
		.filter(entry => !REPOSITORY_FILTER || entry.name === REPOSITORY_FILTER)
		.map(entry => path.join(MATERIAL_ROOT, entry.name))
		.filter(repositoryPath =>
			fs.existsSync(path.join(repositoryPath, ".git"))
		);
}

const black = resolveExecutable(
	[
		process.env.BLACK_BIN ?? "",
		"black",
		path.join(os.homedir(), "Library/Python/3.10/bin/black")
	].filter(Boolean)
);
const clangFormat = resolveExecutable(
	[
		process.env.CLANG_FORMAT_BIN ?? "",
		"clang-format",
		"/opt/homebrew/opt/llvm/bin/clang-format",
		"/Library/Developer/CommandLineTools/usr/bin/clang-format"
	].filter(Boolean)
);
const prettier = path.resolve("node_modules/.bin/prettier");
const swiftFormat = resolveExecutable(["xcrun"]);

if (!black || !clangFormat || !fs.existsSync(prettier) || !swiftFormat) {
	throw new Error(
		"Required formatters are unavailable: Black, clang-format, Prettier, and swift-format are required"
	);
}

const failedFiles = [];
let selectedFileCount = 0;
let normalizedFileCount = 0;

for (const repositoryPath of repositoryPaths()) {
	const repositoryName = path.basename(repositoryPath);
	const dirtyPaths = trackedDirtyPaths(repositoryPath);
	const relativePaths = commandOutput(
		"git",
		["ls-files", "-z"],
		repositoryPath
	)
		.split("\0")
		.filter(Boolean)
		.filter(relativePath =>
			isCourseCode(repositoryName, relativePath, dirtyPaths)
		);
	const files = relativePaths.map(relativePath =>
		path.join(repositoryPath, relativePath)
	);

	selectedFileCount += files.length;
	for (const filePath of files) {
		if (normalizeSourceFile(filePath)) normalizedFileCount += 1;
	}

	if (!WRITE_CHANGES && !CHECK_FORMATTING) continue;

	formatFiles(
		black,
		[
			...(CHECK_FORMATTING ? ["--check"] : []),
			"--line-length",
			"80",
			"--skip-string-normalization"
		],
		files.filter(filePath => PYTHON_EXTENSION_RE.test(filePath)),
		failedFiles,
		repositoryPath
	);
	formatFiles(
		clangFormat,
		[
			...(CHECK_FORMATTING ? ["--dry-run", "--Werror"] : ["-i"]),
			"--style={BasedOnStyle: LLVM, IndentWidth: 4, ContinuationIndentWidth: 4, ColumnLimit: 80, UseTab: Never, BreakBeforeBraces: Attach, AllowShortFunctionsOnASingleLine: None, SortIncludes: Never, ReflowComments: Never, CommentPragmas: '^\\*   ', PointerAlignment: Left, ReferenceAlignment: Left}"
		],
		files.filter(filePath => CLANG_EXTENSION_RE.test(filePath)),
		failedFiles,
		repositoryPath
	);
	formatFiles(
		prettier,
		[
			CHECK_FORMATTING ? "--check" : "--write",
			"--tab-width",
			"4",
			"--use-tabs",
			"false",
			"--print-width",
			"80"
		],
		files.filter(filePath => PRETTIER_EXTENSION_RE.test(filePath)),
		failedFiles,
		repositoryPath
	);
	formatFiles(
		swiftFormat,
		[
			"swift-format",
			CHECK_FORMATTING ? "lint" : "format",
			...(CHECK_FORMATTING ? ["--strict"] : ["--in-place"]),
			"--ignore-unparsable-files",
			"--configuration",
			SWIFT_FORMAT_CONFIGURATION
		],
		files.filter(filePath => SWIFT_EXTENSION_RE.test(filePath)),
		failedFiles,
		repositoryPath
	);
}

console.log(
	`${WRITE_CHANGES ? "Formatted" : CHECK_FORMATTING ? "Checked" : "Audited"} ${selectedFileCount} course code files; ${normalizedFileCount} require source normalization`
);

if (failedFiles.length > 0) {
	for (const failure of failedFiles) {
		console.error(`Skipped ${failure.file}: ${failure.reason}`);
	}
	process.exitCode = 1;
}
