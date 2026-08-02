#!/usr/bin/env node

import { createHash } from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { pathToFileURL } from "node:url";

const manifestName = ".classes-native-release.json";
const siteName = "classes.example.com";
const requiredFiles = Object.freeze([
	"package.json",
	"package-lock.json",
	"front-end/package.json",
	"back-end/package.json",
	"back-end/package-lock.json",
	"scripts/verify-native-source.sh",
	"scripts/verify-native-release.mjs"
]);
const trackedDirectories = Object.freeze([
	"front-end/dist",
	"back-end/dist",
	"back-end/node_modules",
	"deploy/native"
]);
const forbiddenPublicPaths = Object.freeze([
	"front-end/dist/.vite",
	"front-end/dist/release.json",
	"front-end/dist/api/release",
	"front-end/dist/api/release.html",
	"front-end/dist/api/release/index.html"
]);
const allowedStructuralEntries = Object.freeze({
	".": Object.freeze([
		manifestName,
		"back-end",
		"deploy",
		"front-end",
		"package-lock.json",
		"package.json",
		"scripts"
	]),
	"back-end": Object.freeze([
		"dist",
		"node_modules",
		"package-lock.json",
		"package.json"
	]),
	"deploy": Object.freeze(["native"]),
	"front-end": Object.freeze(["dist", "package.json"]),
	"scripts": Object.freeze([
		"verify-native-release.mjs",
		"verify-native-source.sh"
	])
});

function fail(message) {
	throw new Error(message);
}

async function regularFile(candidateDirectory, relativePath) {
	const absolutePath = path.join(candidateDirectory, relativePath);
	const stats = await fs.lstat(absolutePath).catch(() => null);
	if (!stats?.isFile() || stats.isSymbolicLink()) {
		fail(`Native release is missing regular file ${relativePath}.`);
	}
	return absolutePath;
}

async function collectDirectoryFiles(candidateDirectory, relativeDirectory) {
	const absoluteDirectory = path.join(candidateDirectory, relativeDirectory);
	const rootStats = await fs.lstat(absoluteDirectory).catch(() => null);
	if (!rootStats?.isDirectory() || rootStats.isSymbolicLink()) {
		fail(`Native release is missing directory ${relativeDirectory}.`);
	}

	const files = [];
	async function visit(currentAbsolute, currentRelative) {
		const entries = await fs.readdir(currentAbsolute, { withFileTypes: true });
		entries.sort((left, right) => left.name.localeCompare(right.name));
		for (const entry of entries) {
			const entryAbsolute = path.join(currentAbsolute, entry.name);
			const entryRelative = path.posix.join(currentRelative, entry.name);
			if (entry.isSymbolicLink()) {
				fail(`Native release payload must not contain symlink ${entryRelative}.`);
			}
			if (entry.isDirectory()) {
				await visit(entryAbsolute, entryRelative);
			} else if (entry.isFile()) {
				files.push(entryRelative);
			} else {
				fail(`Native release payload contains unsupported entry ${entryRelative}.`);
			}
		}
	}

	await visit(absoluteDirectory, relativeDirectory);
	return files;
}

async function assertForbiddenPathsAbsent(candidateDirectory) {
	for (const relativePath of forbiddenPublicPaths) {
		const exists = await fs.lstat(path.join(candidateDirectory, relativePath)).then(
			() => true,
			() => false
		);
		if (exists) fail(`Native release must not expose ${relativePath}.`);
	}
}

async function assertAllowedReleaseTree(candidateDirectory) {
	for (const [relativeDirectory, allowedNames] of Object.entries(
		allowedStructuralEntries
	)) {
		const absoluteDirectory = relativeDirectory === "."
			? candidateDirectory
			: path.join(candidateDirectory, relativeDirectory);
		const entries = await fs.readdir(absoluteDirectory, { withFileTypes: true });
		const allowed = new Set(allowedNames);
		for (const entry of entries) {
			const relativePath = relativeDirectory === "."
				? entry.name
				: path.posix.join(relativeDirectory, entry.name);
			if (entry.isSymbolicLink()) {
				fail(`Native release payload must not contain symlink ${relativePath}.`);
			}
			if (!allowed.has(entry.name)) {
				fail(`Native release contains unsupported entry ${relativePath}.`);
			}
		}
	}
}

function assertNoRawStaticRouteAliases(files) {
	const fileSet = new Set(files);
	for (const relativePath of files) {
		if (
			!relativePath.endsWith(".html")
			|| relativePath === "front-end/dist/404.html"
			|| relativePath === "front-end/dist/index.html"
		) {
			continue;
		}
		const cleanRouteIndex = `${relativePath.slice(0, -".html".length)}/index.html`;
		if (fileSet.has(cleanRouteIndex)) {
			fail(
				`Native release contains raw static route alias ${relativePath}.`
			);
		}
	}
}

async function trackedFiles(candidateDirectory) {
	await assertAllowedReleaseTree(candidateDirectory);
	await assertForbiddenPathsAbsent(candidateDirectory);
	const files = [...requiredFiles];
	for (const relativeDirectory of trackedDirectories) {
		const directoryFiles = await collectDirectoryFiles(
			candidateDirectory,
			relativeDirectory
		);
		if (relativeDirectory === "front-end/dist") {
			assertNoRawStaticRouteAliases(directoryFiles);
		}
		files.push(...directoryFiles);
	}
	for (const relativePath of requiredFiles) {
		await regularFile(candidateDirectory, relativePath);
	}
	return [...new Set(files)].sort();
}

async function sha256(absolutePath) {
	const contents = await fs.readFile(absolutePath);
	return createHash("sha256").update(contents).digest("hex");
}

async function checksums(candidateDirectory) {
	const entries = [];
	for (const relativePath of await trackedFiles(candidateDirectory)) {
		entries.push([
			relativePath,
			await sha256(await regularFile(candidateDirectory, relativePath))
		]);
	}
	return Object.fromEntries(entries);
}

function validateIdentity(tag, revision) {
	if (!/^v(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)(?:-[0-9a-z.-]+)?$/u.test(tag)) {
		fail("Native release tag must be a lowercase semantic v-tag.");
	}
	if (!/^[0-9a-f]{40}$/u.test(revision)) {
		fail("Native release revision must be a full lowercase Git revision.");
	}
	return `${tag}-${revision}`;
}

async function assertBranded404(candidateDirectory) {
	const notFoundPath = await regularFile(candidateDirectory, "front-end/dist/404.html");
	const homepagePath = await regularFile(candidateDirectory, "front-end/dist/index.html");
	const [notFoundHtml, notFoundDigest, homepageDigest] = await Promise.all([
		fs.readFile(notFoundPath, "utf8"),
		sha256(notFoundPath),
		sha256(homepagePath)
	]);
	if (!notFoundHtml.includes("Page not found | Classes")) {
		fail("Native release 404.html is not the neutral branded Classes page.");
	}
	if (notFoundDigest === homepageDigest) {
		fail("Native release 404.html must not be the homepage.");
	}
}

async function writeManifest(candidateDirectory, tag, revision) {
	const releaseId = validateIdentity(tag, revision);
	await assertBranded404(candidateDirectory);
	const manifestPath = path.join(candidateDirectory, manifestName);
	const alreadyExists = await fs.lstat(manifestPath).then(
		() => true,
		() => false
	);
	if (alreadyExists) fail(`${manifestName} already exists.`);
	const manifest = {
		schemaVersion: 1,
		site: siteName,
		tag,
		revision,
		releaseId,
		generatedAt: new Date().toISOString(),
		files: await checksums(candidateDirectory)
	};
	await fs.writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, {
		flag: "wx",
		mode: 0o644
	});
	return manifest;
}

function isPlainObject(value) {
	return value !== null && typeof value === "object" && !Array.isArray(value);
}

async function verifyManifest(candidateDirectory) {
	const manifestPath = await regularFile(candidateDirectory, manifestName);
	const manifest = JSON.parse(await fs.readFile(manifestPath, "utf8"));
	if (!isPlainObject(manifest) || manifest.schemaVersion !== 1 || manifest.site !== siteName) {
		fail("Native release manifest has an unsupported identity or schema.");
	}
	const releaseId = validateIdentity(manifest.tag, manifest.revision);
	if (manifest.releaseId !== releaseId) fail("Native release manifest has an inconsistent release ID.");
	if (!isPlainObject(manifest.files)) fail("Native release manifest is missing its file checksums.");
	if (typeof manifest.generatedAt !== "string" || !Number.isFinite(Date.parse(manifest.generatedAt))) {
		fail("Native release manifest has an invalid generation time.");
	}

	await assertBranded404(candidateDirectory);
	const actualChecksums = await checksums(candidateDirectory);
	const expectedPaths = Object.keys(manifest.files).sort();
	const actualPaths = Object.keys(actualChecksums).sort();
	if (JSON.stringify(expectedPaths) !== JSON.stringify(actualPaths)) {
		fail("Native release payload does not match the manifest file set.");
	}
	for (const relativePath of actualPaths) {
		const expectedDigest = manifest.files[relativePath];
		if (!/^[0-9a-f]{64}$/u.test(expectedDigest) || expectedDigest !== actualChecksums[relativePath]) {
			fail(`Native release checksum mismatch for ${relativePath}.`);
		}
	}
	return manifest;
}

function parseArguments(argv) {
	const options = { mode: "verify", tag: "", revision: "", candidate: "" };
	for (let index = 0; index < argv.length; index += 1) {
		const argument = argv[index];
		if (argument === "--write") options.mode = "write";
		else if (argument === "--tag") options.tag = argv[++index] ?? "";
		else if (argument === "--revision") options.revision = argv[++index] ?? "";
		else if (argument === "--help" || argument === "-h") options.mode = "help";
		else if (!argument.startsWith("-") && !options.candidate) options.candidate = argument;
		else fail(`Unsupported argument: ${argument}`);
	}
	return options;
}

export async function runNativeReleaseVerification(argv = process.argv.slice(2)) {
	const options = parseArguments(argv);
	if (options.mode === "help") {
		console.log("Usage: verify-native-release.mjs [--write --tag TAG --revision SHA] CANDIDATE");
		return null;
	}
	if (!options.candidate) fail("A native release candidate directory is required.");
	if (options.mode === "verify" && (options.tag || options.revision)) {
		fail("--tag and --revision are valid only with --write.");
	}
	if (options.mode === "write" && (!options.tag || !options.revision)) {
		fail("--write requires --tag and --revision.");
	}
	const requestedCandidate = path.resolve(options.candidate);
	const requestedStats = await fs.lstat(requestedCandidate).catch(() => null);
	if (!requestedStats?.isDirectory() || requestedStats.isSymbolicLink()) {
		fail("Native release candidate must be a real directory, not a symlink.");
	}
	const candidateDirectory = await fs.realpath(requestedCandidate);
	const candidateStats = await fs.lstat(candidateDirectory);
	if (!candidateStats.isDirectory() || candidateStats.isSymbolicLink()) {
		fail("Native release candidate must be a real directory.");
	}
	const manifest = options.mode === "write"
		? await writeManifest(candidateDirectory, options.tag, options.revision)
		: await verifyManifest(candidateDirectory);
	console.log(`Verified native release ${manifest.releaseId}.`);
	return manifest;
}

const invokedUrl = process.argv[1] ? pathToFileURL(process.argv[1]).href : "";
if (import.meta.url === invokedUrl) {
	runNativeReleaseVerification().catch(error => {
		console.error(error instanceof Error ? error.message : "Native release verification failed.");
		process.exitCode = 1;
	});
}
