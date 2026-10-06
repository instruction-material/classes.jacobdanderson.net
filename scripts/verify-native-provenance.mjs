#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import path from "node:path";
import process from "node:process";
import { runNativeReleaseVerification } from "./verify-native-release.mjs";

const candidate = process.argv[2];
if (process.argv.length !== 3 || !candidate || candidate.startsWith("-")) {
	console.error("Usage: verify-native-provenance.mjs CANDIDATE");
	process.exit(2);
}

try {
	const manifest = await runNativeReleaseVerification([candidate]);
	const repository = "instruction-material/classes.jacobdanderson.net";
	const verification = spawnSync("gh", [
		"attestation",
		"verify",
		path.resolve(candidate, ".classes-native-release.json"),
		"--hostname",
		"github.com",
		"--repo",
		repository,
		"--signer-workflow",
		`${repository}/.github/workflows/native-release.yml`,
		"--source-digest",
		manifest.revision,
		"--signer-digest",
		manifest.revision,
		"--source-ref",
		`refs/tags/${manifest.tag}`,
		"--deny-self-hosted-runners"
	], {
		encoding: "utf8",
		timeout: 120000,
		maxBuffer: 1024 * 1024,
		stdio: ["ignore", "pipe", "pipe"]
	});
	if (verification.error || verification.status !== 0) {
		throw new Error("Native release lacks verified canonical CI provenance. Do not regenerate or approve builder checksums to bypass this gate.");
	}
	console.log(`Verified canonical CI provenance for ${manifest.releaseId}.`);
}
catch (error) {
	console.error(error instanceof Error ? error.message : "Native provenance verification failed.");
	process.exitCode = 1;
}
