#!/usr/bin/env node

import assert from "node:assert/strict";
import { Buffer } from "node:buffer";
import { createHash } from "node:crypto";
import { readFile, rename, stat, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { tmpdir } from "node:os";
import { basename, dirname, join, resolve } from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

export const CANONICAL_REGISTRY = "https://registry.npmjs.org/";
export const PINNED_VERSIONS = Object.freeze({
	"npm": "12.0.1",
	"@npmcli/arborist": "10.0.1",
	"npm-package-arg": "14.0.0",
	"pacote": "22.0.0",
	"semver": "7.8.5",
	"ssri": "14.0.0"
});

const PROVENANCE_FIELDS = new Set(["resolved", "integrity"]);

export const VENDORED_BRACES = Object.freeze({
	name: "@classes/braces",
	version: "3.0.3-classes.1",
	resolved: "file:vendor/classes-braces-3.0.3-classes.1.tgz",
	integrity:
		"sha512-CvnqWaCXetG3nKnHDvxhuL4r8NbU+x+9aw3DqOCQBY9wZzbwK7iVdSkTl20Ddmgu12wIF004obCkseb4ORkVZQ=="
});

// One reviewed local security fork, not a general exception for file/alias edges.
export async function validateVendoredBraces(repository, node, metadata) {
	if (
		node.location !== "node_modules/braces"
		|| node.name !== "braces"
		|| node.version !== VENDORED_BRACES.version
		|| node.package?.name !== VENDORED_BRACES.name
		|| node.isRegistryDependency
		|| node.isLink
		|| node.inBundle
		|| node.package?.inBundle
		|| node.extraneous
		|| !node.edgesIn?.size
		|| Object.entries(VENDORED_BRACES).some(
			([key, value]) => metadata[key] !== value
		)
	) {
		fail("Unrecognized vendored braces identity or provenance.");
	}
	for (const edge of node.edgesIn) {
		if (
			edge.name !== "braces"
			|| edge.spec !== VENDORED_BRACES.resolved
			|| edge.valid !== true
			|| edge.satisfiedBy(node) !== true
		) {
			fail("Unrecognized vendored braces incoming edge.");
		}
	}
	const archive = await readFile(
		join(repository, VENDORED_BRACES.resolved.slice("file:".length))
	);
	const integrity = `sha512-${createHash("sha512").update(archive).digest("base64")}`;
	if (integrity !== VENDORED_BRACES.integrity) {
		fail("Vendored braces archive does not match reviewed bytes.");
	}
}

export const VENDORED_PICOMATCH = Object.freeze([
	{
		location: "node_modules/picomatch",
		name: "@classes/picomatch",
		version: "4.0.7-classes.1",
		resolved: "file:vendor/classes-picomatch-4.0.7-classes.1.tgz",
		integrity:
			"sha512-SDpjhO8QV31gRQv+u/iiZmeux2K8/lybjF3K8KEOyHj8Bz2oZ51EU5YMuZo87Qq/aqpgCnhGMkAJC15jCnNm+Q=="
	},
	{
		location: "node_modules/micromatch/node_modules/picomatch",
		name: "@classes/picomatch",
		version: "2.3.2-classes.1",
		resolved: "file:vendor/classes-picomatch-2.3.2-classes.1.tgz",
		integrity:
			"sha512-29K0u6gPpOvmtV3HP6LHHpzdMW/Tl70zuWCgbDd0GHzQsVBiRNHVV9Pq1j2h8AuMByzJ/UbJKSoW93lltqka2Q=="
	}
]);

export async function validateVendoredPicomatch(repository, node, metadata) {
	const expected = VENDORED_PICOMATCH.find(
		row => row.location === node.location
	);
	if (
		!expected
		|| node.name !== "picomatch"
		|| node.version !== expected.version
		|| node.package?.name !== expected.name
		|| node.isRegistryDependency
		|| node.isLink
		|| node.inBundle
		|| node.package?.inBundle
		|| node.extraneous
		|| !node.edgesIn?.size
		|| ["name", "version", "resolved", "integrity"].some(
			key => metadata[key] !== expected[key]
		)
	) {
		fail("Unrecognized vendored picomatch identity or provenance.");
	}
	for (const edge of node.edgesIn) {
		if (
			edge.name !== "picomatch"
			|| edge.spec !== expected.resolved
			|| edge.valid !== true
			|| edge.satisfiedBy(node) !== true
		) {
			fail("Unrecognized vendored picomatch incoming edge.");
		}
	}
	const archive = await readFile(
		join(repository, expected.resolved.slice("file:".length))
	);
	const integrity = `sha512-${createHash("sha512").update(archive).digest("base64")}`;
	if (integrity !== expected.integrity) {
		fail("Vendored picomatch archive does not match reviewed bytes.");
	}
}

export class ProvenanceError extends Error {
	constructor(message, details = undefined) {
		super(message);
		this.name = "ProvenanceError";
		this.details = details;
	}
}

export function npmRootFromExecPath(npmExecPath) {
	if (typeof npmExecPath !== "string" || !npmExecPath) {
		fail("Cannot infer the pinned npm root without npm_execpath.");
	}
	const cliPath = resolve(npmExecPath);
	if (
		basename(cliPath) !== "npm-cli.js"
		|| basename(dirname(cliPath)) !== "bin"
	) {
		fail(`npm_execpath is not npm's bin/npm-cli.js: ${cliPath}.`);
	}
	return dirname(dirname(cliPath));
}

function fail(message, details = undefined) {
	throw new ProvenanceError(message, details);
}

function readPackageVersion(requireFromNpm, packageName) {
	return requireFromNpm(`${packageName}/package.json`).version;
}

export function loadPinnedNpm(npmRoot) {
	if (!npmRoot) {
		fail("A pinned npm root is required via --npm-root or NPM_CLI_ROOT.");
	}

	const absoluteRoot = resolve(npmRoot);
	const requireFromNpm = createRequire(join(absoluteRoot, "package.json"));
	const actualVersions = {
		"npm": requireFromNpm(join(absoluteRoot, "package.json")).version,
		"@npmcli/arborist": readPackageVersion(
			requireFromNpm,
			"@npmcli/arborist"
		),
		"npm-package-arg": readPackageVersion(
			requireFromNpm,
			"npm-package-arg"
		),
		"pacote": readPackageVersion(requireFromNpm, "pacote"),
		"semver": readPackageVersion(requireFromNpm, "semver"),
		"ssri": readPackageVersion(requireFromNpm, "ssri")
	};

	assert.deepEqual(
		actualVersions,
		PINNED_VERSIONS,
		`The supplied npm tree is not the pinned npm ${PINNED_VERSIONS.npm} tree.`
	);

	return {
		actualVersions,
		Arborist: requireFromNpm("@npmcli/arborist"),
		npa: requireFromNpm("npm-package-arg"),
		pacote: requireFromNpm("pacote"),
		semver: requireFromNpm("semver"),
		ssri: requireFromNpm("ssri"),
		versionFromTgz: requireFromNpm(
			join(
				absoluteRoot,
				"node_modules/@npmcli/arborist/lib/version-from-tgz.js"
			)
		)
	};
}

function canonicalRegistryValue(value) {
	try {
		const url = new URL(value);
		if (!url.pathname.endsWith("/")) {
			url.pathname += "/";
		}
		return url.href;
	}
	catch {
		return null;
	}
}

export function assertNoCustomRegistryConfig(contents, source) {
	for (const [index, rawLine] of contents.split(/\r?\n/u).entries()) {
		const line = rawLine.trim();
		if (!line || line.startsWith("#") || line.startsWith(";")) {
			continue;
		}
		const separator = line.indexOf("=");
		if (separator === -1) {
			continue;
		}
		const key = line.slice(0, separator).trim().toLowerCase();
		const scopedRegistryKey
			= key.startsWith("@")
				&& key.endsWith(":registry")
				&& !key.slice(1, -":registry".length).includes(":");
		if (key !== "registry" && !scopedRegistryKey) {
			continue;
		}
		const value = line.slice(separator + 1).trim();
		const configured = canonicalRegistryValue(value);
		if (configured !== CANONICAL_REGISTRY) {
			fail(`Custom registry configuration is not allowed in ${source}.`, {
				line: index + 1,
				value
			});
		}
	}
}

export function validateNodeGuards(node) {
	if (node.inBundle || node.package?.inBundle) {
		fail(`Bundled dependency is not eligible: ${node.location}.`);
	}
	if (node.extraneous) {
		fail(`Extraneous dependency is not eligible: ${node.location}.`);
	}
	if (!node.edgesIn || node.edgesIn.size === 0) {
		fail(`Dependency has no incoming edge: ${node.location}.`);
	}
	if (!node.isRegistryDependency) {
		fail(`Non-registry dependency is not eligible: ${node.location}.`);
	}
}

export function validateIncomingEdge(edge, node, { npa, semver }) {
	if (!edge.from?.realpath) {
		fail(`Incoming edge has no owning path: ${node.location}.`);
	}

	let parsed;
	try {
		parsed = npa.resolve(edge.name, edge.spec, edge.from.realpath);
	}
	catch (error) {
		fail(`Cannot parse incoming edge for ${node.location}.`, {
			edge: `${edge.name}@${edge.spec}`,
			cause: error.message
		});
	}

	if (parsed.type === "alias") {
		fail(`npm alias edge is not eligible: ${edge.name}@${edge.spec}.`);
	}
	if (!parsed.registry || !["range", "version"].includes(parsed.type)) {
		fail(`Non-registry edge is not eligible: ${edge.name}@${edge.spec}.`, {
			type: parsed.type
		});
	}
	if (!parsed.name) {
		fail(`Incoming registry edge has no package identity: ${edge.name}.`);
	}
	if (edge.valid !== true || edge.satisfiedBy(node) !== true) {
		fail(
			`Locked node does not satisfy incoming edge ${edge.name}@${edge.spec}.`,
			{
				location: node.location,
				version: node.version
			}
		);
	}
	if (!semver.valid(node.version)) {
		fail(
			`Locked node has an invalid version: ${node.location}@${node.version}.`
		);
	}
	if (!semver.satisfies(node.version, parsed.fetchSpec, { loose: false })) {
		fail(`Locked version does not satisfy incoming registry edge.`, {
			edge: `${edge.name}@${parsed.fetchSpec}`,
			locked: node.version
		});
	}

	return parsed.name;
}

export function assertUnambiguousIdentity(node, identities) {
	const unique = [...new Set(identities)];
	if (unique.length !== 1) {
		fail(`Incoming edges disagree on package identity: ${node.location}.`, {
			identities: unique
		});
	}
	if (node.name !== unique[0]) {
		fail(`Lock node name disagrees with incoming edge identity.`, {
			location: node.location,
			nodeName: node.name,
			edgeName: unique[0]
		});
	}
	return unique[0];
}

export function canonicalTarballUrl(name, version) {
	const leaf = name.startsWith("@")
		? name.slice(name.indexOf("/") + 1)
		: name;
	return `${CANONICAL_REGISTRY}${name}/-/${leaf}-${version}.tgz`;
}

export async function validateRegistryVersion(
	name,
	version,
	metadata,
	{ ssri, versionFromTgz }
) {
	if (!metadata || metadata.name !== name || metadata.version !== version) {
		fail(`Packument version metadata does not match ${name}@${version}.`, {
			metadataName: metadata?.name,
			metadataVersion: metadata?.version
		});
	}

	const expectedUrl = canonicalTarballUrl(name, version);
	if (metadata.dist?.tarball !== expectedUrl) {
		fail(`Registry tarball URL is not canonical for ${name}@${version}.`, {
			expected: expectedUrl,
			actual: metadata.dist?.tarball
		});
	}

	let parsedTarball;
	try {
		parsedTarball = new URL(metadata.dist.tarball);
	}
	catch {
		fail(`Registry tarball URL is invalid for ${name}@${version}.`);
	}
	if (
		parsedTarball.protocol !== "https:"
		|| parsedTarball.host !== "registry.npmjs.org"
		|| parsedTarball.username
		|| parsedTarball.password
		|| parsedTarball.search
		|| parsedTarball.hash
	) {
		fail(`Registry tarball URL has a non-canonical origin or components.`, {
			name,
			version,
			tarball: metadata.dist.tarball
		});
	}

	const tarballIdentity = await versionFromTgz("", metadata.dist.tarball);
	if (
		tarballIdentity?.name !== name
		|| tarballIdentity?.version !== version
	) {
		fail(`Tarball URL identity does not match ${name}@${version}.`, {
			tarballIdentity
		});
	}

	const integrity = metadata.dist?.integrity;
	if (typeof integrity !== "string" || !integrity) {
		fail(`Registry metadata has no SRI for ${name}@${version}.`);
	}
	let parsedIntegrity;
	try {
		parsedIntegrity = ssri.parse(integrity);
	}
	catch {
		fail(`Registry metadata has invalid SRI for ${name}@${version}.`);
	}
	if (
		!parsedIntegrity
		|| Object.keys(parsedIntegrity).length !== 1
		|| parsedIntegrity.sha512?.length !== 1
		|| parsedIntegrity.toString() !== integrity
		|| Buffer.from(parsedIntegrity.sha512[0].digest, "base64").length !== 64
	) {
		fail(`Registry metadata does not have one canonical sha512 SRI.`, {
			name,
			version,
			integrity
		});
	}

	return { resolved: expectedUrl, integrity };
}

function cloneWithoutProvenance(value, registryLocations, path = []) {
	if (Array.isArray(value)) {
		return value.map((item, index) =>
			cloneWithoutProvenance(item, registryLocations, [...path, index])
		);
	}
	if (value === null || typeof value !== "object") {
		return value;
	}

	const output = {};
	const isRegistryEntry
		= path.length === 2
			&& path[0] === "packages"
			&& registryLocations.has(path[1]);
	for (const [key, item] of Object.entries(value)) {
		if (isRegistryEntry && PROVENANCE_FIELDS.has(key)) {
			continue;
		}
		output[key] = cloneWithoutProvenance(item, registryLocations, [
			...path,
			key
		]);
	}
	return output;
}

export function lockInvariant(lock, registryLocations) {
	return cloneWithoutProvenance(lock, registryLocations);
}

export function applyTextInsertions(raw, insertions) {
	let output = raw;
	for (const insertion of [...insertions].sort(
		(a, b) => b.offset - a.offset
	)) {
		output
			= output.slice(0, insertion.offset)
				+ insertion.text
				+ output.slice(insertion.offset);
	}
	return output;
}

export function findInsertion(raw, occurrence, provenance) {
	const header = `\t\t${JSON.stringify(occurrence.location)}: {\n`;
	const headerOffset = raw.indexOf(header);
	if (headerOffset === -1 || raw.includes(header, headerOffset + 1)) {
		fail(
			`Cannot uniquely locate lock entry text for ${occurrence.location}.`
		);
	}
	const versionPrefix = `\t\t\t"version": ${JSON.stringify(occurrence.version)}`;
	const versionOffset = headerOffset + header.length;
	if (!raw.startsWith(versionPrefix, versionOffset)) {
		fail(
			`Lock entry does not start with its version: ${occurrence.location}.`
		);
	}
	const afterVersion = versionOffset + versionPrefix.length;
	const resolvedLine = `\t\t\t"resolved": ${JSON.stringify(provenance.resolved)},\n`;
	const integrityLine = `\t\t\t"integrity": ${JSON.stringify(provenance.integrity)}`;

	if (raw.startsWith(",\n", afterVersion)) {
		return {
			offset: afterVersion + 2,
			text: `${resolvedLine}${integrityLine},\n`
		};
	}
	if (raw.startsWith("\n\t\t}", afterVersion)) {
		return {
			offset: afterVersion,
			text: `,\n${resolvedLine}${integrityLine}`
		};
	}
	fail(`Cannot safely insert provenance into ${occurrence.location}.`);
}

function validateExistingProvenance(metadata, expected, location) {
	const hasResolved = Object.hasOwn(metadata, "resolved");
	const hasIntegrity = Object.hasOwn(metadata, "integrity");
	if (hasResolved !== hasIntegrity) {
		fail(`Lock entry has partial provenance: ${location}.`);
	}
	if (!hasResolved) {
		return false;
	}
	if (
		metadata.resolved !== expected.resolved
		|| metadata.integrity !== expected.integrity
	) {
		fail(`Existing lock provenance conflicts with registry metadata.`, {
			location,
			existing: {
				resolved: metadata.resolved,
				integrity: metadata.integrity
			},
			expected
		});
	}
	return true;
}

async function readRepositoryNpmrcs(repository, lock) {
	const sources = new Set([join(repository, ".npmrc")]);
	const workspaces = lock.packages?.[""]?.workspaces;
	if (Array.isArray(workspaces)) {
		for (const workspace of workspaces) {
			if (typeof workspace === "string" && !workspace.includes("*")) {
				sources.add(join(repository, workspace, ".npmrc"));
			}
		}
	}
	for (const source of sources) {
		try {
			assertNoCustomRegistryConfig(
				await readFile(source, "utf8"),
				source
			);
		}
		catch (error) {
			if (error?.code !== "ENOENT") {
				throw error;
			}
		}
	}
}

function assertCanonicalEnvironmentRegistry() {
	for (const key of ["npm_config_registry", "NPM_CONFIG_REGISTRY"]) {
		if (
			process.env[key]
			&& canonicalRegistryValue(process.env[key]) !== CANONICAL_REGISTRY
		) {
			fail(
				`Custom registry environment variable is not allowed: ${key}.`
			);
		}
	}
}

export async function collectOccurrences(repository, lock, runtime) {
	const tree = await new runtime.Arborist({ path: repository }).loadVirtual();
	const occurrences = [];
	const visitedLocations = new Set();
	const excluded = [];
	const vendored = [];

	for (const node of tree.inventory.values()) {
		const location = node.location;
		if (!Object.hasOwn(lock.packages, location)) {
			fail(`Arborist node is absent from the root lock: ${location}.`);
		}
		visitedLocations.add(location);

		if (node.isProjectRoot || node.isWorkspace || node.isLink) {
			excluded.push(location);
			continue;
		}

		if (node.name === "picomatch" && !node.isRegistryDependency) {
			await validateVendoredPicomatch(
				repository,
				node,
				lock.packages[location]
			);
			vendored.push(location);
			continue;
		}
		if (node.name === "braces" && !node.isRegistryDependency) {
			await validateVendoredBraces(
				repository,
				node,
				lock.packages[location]
			);
			vendored.push(location);
			continue;
		}

		validateNodeGuards(node);
		const identities = [...node.edgesIn].map(edge =>
			validateIncomingEdge(edge, node, runtime)
		);
		const name = assertUnambiguousIdentity(node, identities);
		const metadata = lock.packages[location];
		if (metadata.version !== node.version) {
			fail(`Lock metadata version disagrees with Arborist.`, {
				location,
				metadataVersion: metadata.version,
				nodeVersion: node.version
			});
		}
		occurrences.push({ location, name, version: node.version, metadata });
	}

	const unvisited = Object.keys(lock.packages).filter(
		location => !visitedLocations.has(location)
	);
	if (unvisited.length) {
		fail(
			"Root lock has package entries absent from Arborist's virtual tree.",
			{
				unvisited
			}
		);
	}

	return { occurrences, excluded, vendored };
}

async function fetchRegistryProvenance(occurrences, runtime, options) {
	const versionsByName = new Map();
	for (const occurrence of occurrences) {
		if (!versionsByName.has(occurrence.name)) {
			versionsByName.set(occurrence.name, new Set());
		}
		versionsByName.get(occurrence.name).add(occurrence.version);
	}

	const names = [...versionsByName.keys()].sort();
	const provenance = new Map();
	let cursor = 0;
	let completed = 0;
	const concurrency = Math.max(1, Math.min(options.concurrency ?? 8, 16));
	const cache = resolve(
		options.cache ?? join(tmpdir(), "classes-root-lock-provenance-cache")
	);

	async function worker() {
		while (cursor < names.length) {
			const index = cursor++;
			const name = names[index];
			const packument = await runtime.pacote.packument(name, {
				registry: CANONICAL_REGISTRY,
				cache,
				preferOnline: true,
				fullMetadata: true
			});
			if (packument?.name !== name || !packument.versions) {
				fail(`Registry returned the wrong packument for ${name}.`, {
					returnedName: packument?.name
				});
			}
			for (const version of versionsByName.get(name)) {
				const validated = await validateRegistryVersion(
					name,
					version,
					packument.versions[version],
					runtime
				);
				provenance.set(`${name}@${version}`, validated);
			}
			completed += 1;
			options.onProgress?.({ completed, total: names.length, name });
		}
	}

	await Promise.all(Array.from({ length: concurrency }, () => worker()));
	return { provenance, packageNames: names.length, cache };
}

async function atomicWrite(path, contents) {
	const fileStat = await stat(path);
	const temporary = join(
		dirname(path),
		`.${path.split("/").at(-1)}.${process.pid}.${Date.now()}.tmp`
	);
	await writeFile(temporary, contents, { mode: fileStat.mode });
	await rename(temporary, path);
}

export async function migrateRootLock(options) {
	const repository = resolve(options.repository ?? process.cwd());
	const lockPath = join(repository, "package-lock.json");
	const backEndLockPath = join(repository, "back-end/package-lock.json");
	const runtime = options.runtime ?? loadPinnedNpm(options.npmRoot);
	const originalRaw = await readFile(lockPath, "utf8");
	const originalBackEndRaw = await readFile(backEndLockPath, "utf8");
	const lock = JSON.parse(originalRaw);

	if (lock.lockfileVersion !== 3 || !lock.packages) {
		fail("Only an npm lockfileVersion 3 root lock is eligible.");
	}
	assertCanonicalEnvironmentRegistry();
	await readRepositoryNpmrcs(repository, lock);

	const { occurrences, excluded, vendored } = await collectOccurrences(
		repository,
		lock,
		runtime
	);
	const registryLocations = new Set(
		occurrences.map(occurrence => occurrence.location)
	);
	const beforeInvariant = lockInvariant(lock, registryLocations);
	const { provenance, packageNames, cache } = await fetchRegistryProvenance(
		occurrences,
		runtime,
		options
	);

	const insertions = [];
	let alreadyComplete = 0;
	for (const occurrence of occurrences) {
		const expected = provenance.get(
			`${occurrence.name}@${occurrence.version}`
		);
		if (!expected) {
			fail(
				`No registry provenance was validated for ${occurrence.name}.`
			);
		}
		if (
			validateExistingProvenance(
				occurrence.metadata,
				expected,
				occurrence.location
			)
		) {
			alreadyComplete += 1;
			continue;
		}
		insertions.push(findInsertion(originalRaw, occurrence, expected));
	}

	const migratedRaw = applyTextInsertions(originalRaw, insertions);
	const migratedLock = JSON.parse(migratedRaw);
	assert.deepEqual(
		lockInvariant(migratedLock, registryLocations),
		beforeInvariant,
		"A non-provenance root lock field changed during migration."
	);
	assert.equal(
		await readFile(backEndLockPath, "utf8"),
		originalBackEndRaw,
		"The standalone backend lock changed during root migration."
	);

	if (options.check && insertions.length) {
		fail("Root lock provenance is incomplete.", {
			missingOccurrences: insertions.length
		});
	}
	if (options.write && insertions.length) {
		await atomicWrite(lockPath, migratedRaw);
		const writtenRaw = await readFile(lockPath, "utf8");
		assert.equal(
			writtenRaw,
			migratedRaw,
			"Atomic root lock write was not exact."
		);
		assert.equal(
			await readFile(backEndLockPath, "utf8"),
			originalBackEndRaw,
			"The standalone backend lock changed after the write."
		);
	}

	return {
		repository,
		registry: CANONICAL_REGISTRY,
		versions: runtime.actualVersions,
		registryOccurrences: occurrences.length,
		uniquePackageNames: packageNames,
		uniqueIdentities: provenance.size,
		excludedLocations: excluded.sort(),
		vendoredLocations: vendored.sort(),
		alreadyComplete,
		addedOccurrences: insertions.length,
		mode: options.write ? "write" : options.check ? "check" : "dry-run",
		cache
	};
}

function parseArguments(argv) {
	const options = {
		repository: process.cwd(),
		npmRoot: process.env.NPM_CLI_ROOT,
		concurrency: 8
	};
	for (let index = 0; index < argv.length; index += 1) {
		const argument = argv[index];
		if (argument === "--write") {
			options.write = true;
		}
		else if (argument === "--check") {
			options.check = true;
		}
		else if (argument === "--repository") {
			options.repository = argv[++index];
		}
		else if (argument === "--npm-root") {
			options.npmRoot = argv[++index];
		}
		else if (argument === "--cache") {
			options.cache = argv[++index];
		}
		else if (argument === "--concurrency") {
			options.concurrency = Number(argv[++index]);
		}
		else {
			fail(`Unknown argument: ${argument}.`);
		}
	}
	if (options.write && options.check) {
		fail("--write and --check are mutually exclusive.");
	}
	if (!Number.isInteger(options.concurrency) || options.concurrency < 1) {
		fail("--concurrency must be a positive integer.");
	}
	options.npmRoot ??= npmRootFromExecPath(process.env.npm_execpath);
	return options;
}

const isCli
	= process.argv[1]
		&& resolve(process.argv[1]) === resolve(fileURLToPath(import.meta.url));

if (isCli) {
	try {
		const options = parseArguments(process.argv.slice(2));
		let lastReported = 0;
		const result = await migrateRootLock({
			...options,
			onProgress({ completed, total, name }) {
				if (completed === total || completed - lastReported >= 50) {
					process.stderr.write(
						`Validated ${completed}/${total} packuments (latest: ${name}).\n`
					);
					lastReported = completed;
				}
			}
		});
		process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
	}
	catch (error) {
		process.stderr.write(`${error.name}: ${error.message}\n`);
		if (error.details) {
			process.stderr.write(`${JSON.stringify(error.details, null, 2)}\n`);
		}
		process.exitCode = 1;
	}
}
