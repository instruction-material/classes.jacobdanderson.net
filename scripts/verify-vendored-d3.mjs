import assert from "node:assert/strict";
import { Buffer } from "node:buffer";
import { createHash } from "node:crypto";
import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import process from "node:process";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
export const policy = JSON.parse(
	await readFile(join(root, "scripts/vendored-d3-security.json"), "utf8")
);
const hash = value => createHash("sha256").update(value).digest("hex");

export function restoreLegacyBundle(source, entry) {
	assert.equal(source.indexOf(policy.patchNotice), source.indexOf("\n") + 1);
	assert.equal(source.split(policy.patchNotice).length - 1, 1);
	const patched = source.replace(policy.patchNotice, "");
	assert.equal(
		patched.split(policy.fixedFragment).length - 1,
		policy.expectedReplacements
	);
	const original = patched
		.split(policy.fixedFragment)
		.join(policy.oldFragment);
	assert.equal(hash(original), entry.originalSHA256);
	return original;
}

export async function inspectVendoredD3(
	directory = join(root, "front-end/public/course-assets")
) {
	const paths = (await readdir(directory, { recursive: true }))
		.filter(path => path.endsWith("/vendor/d3.min.js.txt"))
		.sort();
	assert.ok(
		paths.length > 0,
		"Inspect the actual published course libraries"
	);
	const bundles = [];
	for (const path of paths) {
		const source = await readFile(join(directory, path), "utf8");
		const sha256 = hash(source);
		const legacy = policy.legacyBundles.find(
			entry => entry.patchedSHA256 === sha256
		);
		const maintained = policy.maintainedBundles.find(
			entry => entry.sha256 === sha256
		);
		assert.ok(
			legacy || maintained,
			`Unreviewed or unpatched D3 bundle: ${path}`
		);
		assert.equal(source.includes(policy.oldFragment), false, path);
		if (legacy) {
			assert.equal(Buffer.byteLength(source), legacy.patchedBytes);
			restoreLegacyBundle(source, legacy);
		}
		bundles.push({
			path,
			sha256,
			version: (legacy || maintained).version,
			securityBackport: Boolean(legacy)
		});
	}
	for (const entry of policy.legacyBundles) {
		for (const path of entry.paths) {
			const relative = path.slice(
				"front-end/public/course-assets/".length
			);
			assert.ok(
				bundles.some(
					bundle =>
						bundle.path === relative
						&& bundle.sha256 === entry.patchedSHA256
				),
				path
			);
		}
	}
	return {
		advisory: policy.advisory,
		upstreamFix: policy.upstreamFix,
		knownUnremediatedAdvisoryCopies: 0,
		bundles
	};
}

if (
	process.argv[1]
	&& import.meta.url === pathToFileURL(resolve(process.argv[1])).href
) {
	const proof = await inspectVendoredD3();
	if (process.env.VENDORED_D3_PROOF_FILE) {
		const output = resolve(process.env.VENDORED_D3_PROOF_FILE);
		assert.ok(
			output.startsWith(`${root}/`),
			"Keep proof within the owned checkout"
		);
		await mkdir(dirname(output), { recursive: true });
		await writeFile(output, `${JSON.stringify(proof, null, 2)}\n`);
	}
	console.log(
		JSON.stringify({
			advisory: proof.advisory,
			inspectedCopies: proof.bundles.length,
			backportedCopies: proof.bundles.filter(
				bundle => bundle.securityBackport
			).length,
			knownUnremediatedAdvisoryCopies:
				proof.knownUnremediatedAdvisoryCopies
		})
	);
}
