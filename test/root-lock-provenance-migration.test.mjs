import assert from "node:assert/strict";
import { Buffer } from "node:buffer";
import { mkdir, mkdtemp, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import process from "node:process";
import { it } from "vitest";

import {
	applyTextInsertions,
	assertNoCustomRegistryConfig,
	assertUnambiguousIdentity,
	CANONICAL_REGISTRY,
	canonicalTarballUrl,
	collectOccurrences,
	findInsertion,
	loadPinnedNpm,
	lockInvariant,
	migrateRootLock,
	npmRootFromExecPath,
	PINNED_VERSIONS,
	ProvenanceError,
	validateIncomingEdge,
	validateNodeGuards,
	validateRegistryVersion,
	validateVendoredBraces,
	validateVendoredPicomatch,
	VENDORED_BRACES,
	VENDORED_PICOMATCH
} from "../scripts/migrate-root-lock-provenance.mjs";

const repositoryRoot = resolve(import.meta.dirname, "..");
const npmRoot
	= process.env.NPM_CLI_ROOT ?? npmRootFromExecPath(process.env.npm_execpath);
assert.ok(npmRoot, "NPM_CLI_ROOT must point to pinned npm 12.0.1.");
const pinned = loadPinnedNpm(npmRoot);
const sriA = `sha512-${Buffer.alloc(64, 1).toString("base64")}`;
const sriB = `sha512-${Buffer.alloc(64, 2).toString("base64")}`;

function nodeFor(spec, overrides = {}) {
	const node = {
		location: "node_modules/example",
		name: "example",
		version: "1.2.3",
		isRegistryDependency: true,
		extraneous: false,
		inBundle: false,
		package: {},
		...overrides
	};
	const edge = {
		name: "example",
		spec,
		from: { realpath: process.cwd() },
		valid: true,
		satisfiedBy: () => true
	};
	return { edge, node };
}

it("requires the exact npm 12.0.1 dependency tree", () => {
	assert.deepEqual(pinned.actualVersions, PINNED_VERSIONS);
});

it("repository root lock has trusted provenance on every registry edge", async () => {
	const lock = JSON.parse(
		await readFile(join(repositoryRoot, "package-lock.json"), "utf8")
	);
	const { occurrences, excluded, vendored } = await collectOccurrences(
		repositoryRoot,
		lock,
		pinned
	);
	assert.deepEqual(excluded.sort(), [
		"",
		"back-end",
		"front-end",
		"node_modules/back-end",
		"node_modules/front-end"
	]);
	assert.equal(
		occurrences.length + excluded.length + vendored.length,
		Object.keys(lock.packages).length
	);
	assert.deepEqual(
		vendored.sort(),
		[
			"node_modules/braces",
			...VENDORED_PICOMATCH.map(row => row.location)
		].sort()
	);
	for (const occurrence of occurrences) {
		await validateRegistryVersion(
			occurrence.name,
			occurrence.version,
			{
				name: occurrence.name,
				version: occurrence.version,
				dist: {
					tarball: occurrence.metadata.resolved,
					integrity: occurrence.metadata.integrity
				}
			},
			pinned
		);
	}
});

it("only permits the reviewed local braces identity, edges, and archive", async () => {
	const edge = {
		name: "braces",
		spec: VENDORED_BRACES.resolved,
		valid: true,
		satisfiedBy: () => true
	};
	const node = {
		location: "node_modules/braces",
		name: "braces",
		version: VENDORED_BRACES.version,
		package: { name: VENDORED_BRACES.name },
		edgesIn: new Set([edge])
	};
	await validateVendoredBraces(repositoryRoot, node, VENDORED_BRACES);
	for (const patch of [
		{ resolved: "file:../other.tgz" },
		{ name: "braces" },
		{ version: "3.0.3" },
		{ integrity: sriA }
	]) {
		await assert.rejects(
			validateVendoredBraces(repositoryRoot, node, {
				...VENDORED_BRACES,
				...patch
			}),
			/unrecognized/i
		);
	}
	for (const patch of [
		{ isLink: true },
		{ inBundle: true },
		{ extraneous: true },
		{ edgesIn: new Set() },
		{ location: "node_modules/other" },
		{ edgesIn: new Set([{ ...edge, spec: "file:../other.tgz" }]) },
		{ edgesIn: new Set([{ ...edge, valid: false }]) }
	]) {
		await assert.rejects(
			validateVendoredBraces(
				repositoryRoot,
				{ ...node, ...patch },
				VENDORED_BRACES
			),
			/unrecognized/i
		);
	}
	const fixture = await mkdtemp(join(tmpdir(), "classes-braces-integrity-"));
	await mkdir(join(fixture, "vendor"));
	await writeFile(
		join(fixture, VENDORED_BRACES.resolved.slice(5)),
		"tampered"
	);
	await assert.rejects(
		validateVendoredBraces(fixture, node, VENDORED_BRACES),
		/does not match reviewed bytes/
	);
});

it("accepts a normal range edge that satisfies the locked version", () => {
	const { edge, node } = nodeFor("^1.0.0");
	assert.equal(validateIncomingEdge(edge, node, pinned), "example");
});

it("accepts npm's equals-prefixed exact-version normalization", () => {
	const { edge, node } = nodeFor("=1.2.3");
	assert.equal(validateIncomingEdge(edge, node, pinned), "example");
});

for (const [label, spec] of [
	["alias", "npm:other@^1.0.0"],
	["git", "git+https://github.com/example/example.git"],
	["file", "file:../example"],
	["remote", "https://example.test/example-1.2.3.tgz"],
	["tag", "latest"]
]) {
	it(`rejects ${label} incoming edges`, () => {
		const { edge, node } = nodeFor(spec);
		assert.throws(
			() => validateIncomingEdge(edge, node, pinned),
			ProvenanceError
		);
	});
}

it("rejects an incoming edge that does not satisfy the locked version", () => {
	const { edge, node } = nodeFor("^2.0.0");
	assert.throws(
		() => validateIncomingEdge(edge, node, pinned),
		/does not satisfy incoming registry edge/u
	);
});

it("rejects bundled, extraneous, edge-free, and non-registry nodes", () => {
	for (const override of [
		{ inBundle: true, edgesIn: new Set([{}]) },
		{ extraneous: true, edgesIn: new Set([{}]) },
		{ edgesIn: new Set() },
		{ isRegistryDependency: false, edgesIn: new Set([{}]) }
	]) {
		const guardedNode = { ...nodeFor("^1").node, ...override };
		assert.throws(() => validateNodeGuards(guardedNode), ProvenanceError);
	}
});

it("rejects identity ambiguity and lock-node identity disagreement", () => {
	const node = nodeFor("^1").node;
	assert.throws(
		() => assertUnambiguousIdentity(node, ["example", "other"]),
		/disagree on package identity/u
	);
	assert.throws(
		() => assertUnambiguousIdentity(node, ["other"]),
		/disagrees with incoming edge identity/u
	);
});

it("rejects custom registry configuration", () => {
	assert.doesNotThrow(() =>
		assertNoCustomRegistryConfig(
			`registry=${CANONICAL_REGISTRY}\n`,
			"fixture/.npmrc"
		)
	);
	assert.throws(
		() =>
			assertNoCustomRegistryConfig(
				"@example:registry=https://registry.example.test/\n",
				"fixture/.npmrc"
			),
		/custom registry configuration/iu
	);
});

function registryMetadata(name, version, integrity = sriA) {
	return {
		name,
		version,
		dist: {
			tarball: canonicalTarballUrl(name, version),
			integrity
		}
	};
}

async function fakeVersionFromTgz(_spec, tarball) {
	const match = tarball.match(
		/^https:\/\/registry\.npmjs\.org\/(?:(@[^/]+)\/)?([^/]+)\/-\/[^/]+-(\d+\.\d+\.\d+)\.tgz$/u
	);
	return match
		? {
				name: match[1] ? `${match[1]}/${match[2]}` : match[2],
				version: match[3]
			}
		: null;
}

it("validates canonical tarball identity and one sha512 SRI", async () => {
	assert.deepEqual(
		await validateRegistryVersion(
			"@scope/example",
			"1.2.3",
			registryMetadata("@scope/example", "1.2.3"),
			{ ssri: pinned.ssri, versionFromTgz: fakeVersionFromTgz }
		),
		{
			resolved:
				"https://registry.npmjs.org/@scope/example/-/example-1.2.3.tgz",
			integrity: sriA
		}
	);
});

it("rejects custom or identity-mismatched tarball URLs", async () => {
	for (const tarball of [
		"https://registry.example.test/example/-/example-1.2.3.tgz",
		"https://registry.npmjs.org/other/-/other-1.2.3.tgz"
	]) {
		const metadata = registryMetadata("example", "1.2.3");
		metadata.dist.tarball = tarball;
		await assert.rejects(
			validateRegistryVersion("example", "1.2.3", metadata, {
				ssri: pinned.ssri,
				versionFromTgz: fakeVersionFromTgz
			}),
			/canonical/u
		);
	}
});

it("rejects missing, malformed, and weaker SRI", async () => {
	for (const integrity of [null, "not-sri", "sha1-YWJj"]) {
		await assert.rejects(
			validateRegistryVersion(
				"example",
				"1.2.3",
				registryMetadata("example", "1.2.3", integrity),
				{ ssri: pinned.ssri, versionFromTgz: fakeVersionFromTgz }
			),
			ProvenanceError
		);
	}
});

it("text insertions preserve every pre-existing byte", () => {
	const raw = [
		"{",
		"\t\"packages\": {",
		"\t\t\"node_modules/example\": {",
		"\t\t\t\"version\": \"1.2.3\",",
		"\t\t\t\"license\": \"MIT\"",
		"\t\t}",
		"\t}",
		"}",
		""
	].join("\n");
	const insertion = findInsertion(
		raw,
		{ location: "node_modules/example", version: "1.2.3" },
		{
			resolved: canonicalTarballUrl("example", "1.2.3"),
			integrity: sriA
		}
	);
	const migrated = applyTextInsertions(raw, [insertion]);
	assert.equal(
		migrated.slice(0, insertion.offset)
		+ migrated.slice(insertion.offset + insertion.text.length),
		raw
	);
	assert.deepEqual(
		lockInvariant(JSON.parse(migrated), new Set(["node_modules/example"])),
		lockInvariant(JSON.parse(raw), new Set(["node_modules/example"]))
	);
});

function fakeNode(location, name, version, edgeName = name) {
	const node = {
		location,
		name,
		version,
		isRegistryDependency: true,
		extraneous: false,
		inBundle: false,
		package: {}
	};
	const edge = {
		name: edgeName,
		spec: version,
		from: { realpath: "/fixture" },
		valid: true,
		satisfiedBy: () => true
	};
	node.edgesIn = new Set([edge]);
	return node;
}

function fixtureRuntime(integrity = sriA) {
	const root = {
		location: "",
		isProjectRoot: true,
		isWorkspace: false,
		isLink: false
	};
	const nodes = [
		root,
		fakeNode("node_modules/example", "example", "1.2.3"),
		fakeNode("node_modules/parent", "parent", "2.0.0"),
		fakeNode("node_modules/parent/node_modules/example", "example", "1.2.3")
	];
	return {
		actualVersions: PINNED_VERSIONS,
		Arborist: class {
			async loadVirtual() {
				return {
					inventory: new Map(nodes.map(node => [node.location, node]))
				};
			}
		},
		npa: pinned.npa,
		semver: pinned.semver,
		ssri: pinned.ssri,
		versionFromTgz: fakeVersionFromTgz,
		pacote: {
			async packument(name) {
				const version = name === "example" ? "1.2.3" : "2.0.0";
				return {
					name,
					versions: {
						[version]: registryMetadata(name, version, integrity)
					}
				};
			}
		}
	};
}

async function createFixtureRepository() {
	const repository = await mkdtemp(join(tmpdir(), "lock-provenance-test-"));
	await mkdir(join(repository, "back-end"));
	const lock = {
		name: "fixture",
		version: "1.0.0",
		lockfileVersion: 3,
		requires: true,
		packages: {
			"": { name: "fixture", version: "1.0.0" },
			"node_modules/example": { version: "1.2.3", license: "MIT" },
			"node_modules/parent": { version: "2.0.0", license: "ISC" },
			"node_modules/parent/node_modules/example": {
				version: "1.2.3",
				license: "MIT"
			}
		}
	};
	await writeFile(
		join(repository, "package-lock.json"),
		`${JSON.stringify(lock, null, "\t")}\n`
	);
	await writeFile(
		join(repository, "back-end/package-lock.json"),
		"backend-lock\n"
	);
	return repository;
}

it("hydrates every occurrence and leaves the backend lock byte-identical", async () => {
	const repository = await createFixtureRepository();
	const before = await readFile(
		join(repository, "package-lock.json"),
		"utf8"
	);
	const backEndBefore = await readFile(
		join(repository, "back-end/package-lock.json"),
		"utf8"
	);
	const result = await migrateRootLock({
		repository,
		runtime: fixtureRuntime(),
		write: true,
		concurrency: 2
	});
	const after = await readFile(join(repository, "package-lock.json"), "utf8");
	assert.equal(result.registryOccurrences, 3);
	assert.equal(result.uniquePackageNames, 2);
	assert.equal(result.uniqueIdentities, 2);
	assert.equal(result.addedOccurrences, 3);
	assert.equal((after.match(/"resolved":/gu) ?? []).length, 3);
	assert.equal((after.match(/"integrity":/gu) ?? []).length, 3);
	assert.equal(
		after.replace(/^\t\t\t"resolved": .*\n\t\t\t"integrity": .*\n/gmu, ""),
		before
	);
	assert.equal(
		await readFile(join(repository, "back-end/package-lock.json"), "utf8"),
		backEndBefore
	);
	const check = await migrateRootLock({
		repository,
		runtime: fixtureRuntime(),
		check: true,
		concurrency: 2
	});
	assert.equal(check.addedOccurrences, 0);
	assert.equal(check.alreadyComplete, 3);
	assert.equal(
		await readFile(join(repository, "package-lock.json"), "utf8"),
		after
	);
});

it("fails instead of overwriting conflicting existing provenance", async () => {
	const repository = await createFixtureRepository();
	await migrateRootLock({
		repository,
		runtime: fixtureRuntime(sriA),
		write: true
	});
	await assert.rejects(
		migrateRootLock({
			repository,
			runtime: fixtureRuntime(sriB),
			write: true
		}),
		/conflicts with registry metadata/u
	);
});

it("only permits each reviewed picomatch major at its exact edge and archive", async () => {
	for (const expected of VENDORED_PICOMATCH) {
		const edge = {
			name: "picomatch",
			spec: expected.resolved,
			valid: true,
			satisfiedBy: () => true
		};
		const node = {
			name: "picomatch",
			location: expected.location,
			version: expected.version,
			package: { name: expected.name },
			edgesIn: new Set([edge])
		};
		const metadata = { ...expected };
		delete metadata.location;
		await validateVendoredPicomatch(repositoryRoot, node, metadata);
		for (const patch of [
			{ name: "picomatch" },
			{ version: "4.0.7" },
			{ resolved: "file:../other.tgz" },
			{ integrity: sriA }
		]) {
			await assert.rejects(
				validateVendoredPicomatch(repositoryRoot, node, {
					...metadata,
					...patch
				}),
				/unrecognized/i
			);
		}
		for (const patch of [
			{ location: "node_modules/other/node_modules/picomatch" },
			{ isRegistryDependency: true },
			{ isLink: true },
			{ inBundle: true },
			{ extraneous: true },
			{ edgesIn: new Set() },
			{ edgesIn: new Set([{ ...edge, valid: false }]) },
			{ edgesIn: new Set([{ ...edge, spec: "^4" }]) },
			{ edgesIn: new Set([{ ...edge, satisfiedBy: () => false }]) }
		]) {
			await assert.rejects(
				validateVendoredPicomatch(
					repositoryRoot,
					{ ...node, ...patch },
					metadata
				),
				/unrecognized/i
			);
		}
		const fixture = await mkdtemp(
			join(tmpdir(), "classes-picomatch-integrity-")
		);
		await mkdir(join(fixture, "vendor"));
		await writeFile(join(fixture, expected.resolved.slice(5)), "tampered");
		await assert.rejects(
			validateVendoredPicomatch(fixture, node, metadata),
			/does not match reviewed bytes/
		);
	}
});
