import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { courseContentSecurityPolicy } from "../scripts/native-csp-from-map.mjs";
import {
	contentSecurityPolicies,
	exactSecurityHeaders,
	serializeContentSecurityPolicy
} from "../scripts/production-security-headers.mjs";

const repositoryRoot = path.resolve(import.meta.dirname, "..");

async function source(relativePath) {
	return fs.readFile(path.join(repositoryRoot, relativePath), "utf8");
}

test("native candidate snapshots preserve independent protected bytes", () => {
	const result = spawnSync("python3", ["-B", "test/native-candidate-snapshot.test.py"], {
		cwd: repositoryRoot,
		encoding: "utf8",
		timeout: 30000
	});
	assert.equal(result.status, 0, result.stderr || result.error?.message);
});

function nginxAddHeaderValues(sourceText) {
	const values = new Map();
	const addHeaderPattern = /^\s*add_header\s+([A-Za-z0-9-]+)\s+"((?:\\.|[^"\\])*)"\s+always;\s*$/gmu;
	for (const match of sourceText.matchAll(addHeaderPattern)) {
		const name = match[1].toLowerCase();
		values.set(name, [...(values.get(name) ?? []), match[2]]);
	}
	return values;
}

test("native Nginx keeps static, API, and hidden-file boundaries separate", async () => {
	const [maps, headers, policy, host, unit] = await Promise.all([
		source("deploy/native/classes-http-maps.conf"),
		source("deploy/native/classes-static-headers.conf"),
		source("deploy/native/classes-server-policy.conf"),
		source("deploy/native/host-nginx.conf.example"),
		source("deploy/native/classes-api.service")
	]);

	for (const profile of [
		"standard",
		"course-scratch",
		"code-ide",
		"graph-sketcher",
		"scheduler-embed",
		"wheel-embed",
		"student-management-embed",
		"python-worker"
	]) {
		assert.ok(maps.includes(serializeContentSecurityPolicy(profile)), `${profile} CSP drifted`);
	}
	assert.ok(
		maps.includes(
			`~^/courses(?:/|$) "${serializeContentSecurityPolicy("course-scratch")}";`
		),
		"/courses must bind the exact course-scratch CSP"
	);
	assert.match(maps, /map \$uri \$classes_resource_policy \{\s*default "same-origin";\s*~\^\/scratch-runtime\/ "cross-origin";/u);
	assert.match(maps, /map \$uri \$classes_public_asset_origin \{\s*default "";\s*~\^\/scratch-runtime\/ "\*";/u);
	const configuredHeaders = nginxAddHeaderValues(headers);
	for (const [name, value] of Object.entries(exactSecurityHeaders)) {
		assert.deepEqual(configuredHeaders.get(name), [name === "cross-origin-resource-policy" ? "$classes_resource_policy" : value]);
	}
	assert.match(policy, /error_page 404 =404 \/404[.]html;/u);
	assert.match(policy, /location = \/__central-analytics \{\s*return 404;/u);
	assert.match(policy, /location \^~ \/__central-analytics\/ \{\s*return 404;/u);
	assert.match(policy, /location = \/404[.]html \{\s*internal;/u);
	assert.match(policy, /location \/ \{\s*try_files \$uri \$uri\/ =404;/u);
	assert.doesNotMatch(policy, /try_files[^;]*index[.]html/u);
	assert.match(policy, /location = \/index[.]html \{/u);
	assert.ok(policy.includes("if ($request_uri ~ ^/index[.]html"));
	assert.match(policy, /location = \/coding_standard \{/u);
	assert.match(policy, /location = \/coding_standard\/ \{/u);
	assert.match(
		policy,
		/return 308 https:\/\/static[.]classes[.]jacobdanderson[.]net\/coding_standard[.]md\$is_args\$args;/u
	);
	assert.match(policy, /classes_legacy_route/u);
	assert.match(policy, /location = \/admin\/student-management[.]html \{/u);
	assert.match(policy, /classes_direct_index_route/u);
	assert.match(policy, /try_files \$uri =404;/u);
	assert.match(policy, /return 308 https:\/\/classes[.]example[.]com/u);
	assert.match(policy, /proxy_pass http:\/\/127[.]0[.]0[.]1:3008\//u);
	assert.match(policy, /proxy_set_header X-Forwarded-For \$remote_addr;/u);
	assert.doesNotMatch(policy, /proxy_intercept_errors/u);
	assert.match(policy, /location ~ \(\^\|\/\)\\[.] \{/u);
	assert.match(policy, /access_log off;/u);
	assert.match(host, /listen \[::\]:80;/u);
	assert.match(host, /include \/etc\/nginx\/snippets\/classes-http-maps[.]conf;/u);
	assert.match(unit, /Environment=HOST=127[.]0[.]0[.]1/u);
	assert.match(unit, /Environment=PORT=3008/u);
	assert.match(unit, /ExecStart=\/usr\/bin\/node back-end\/dist\/server[.]js/u);
	assert.match(unit, /ProtectSystem=strict/u);
});

test("Nginx header parsing preserves literal backslash sequences", () => {
	const value = String.raw`literal\path\(value\)`;
	const configuredHeaders = nginxAddHeaderValues(
		`add_header X-Literal-Test "${value}" always;\n`
	);

	assert.deepEqual(configuredHeaders.get("x-literal-test"), [value]);
});

test("native smoke checks use the policy sealed with each release", async () => {
	const maps = await source("deploy/native/classes-http-maps.conf");
	const currentPolicy = courseContentSecurityPolicy(maps);
	assert.equal(currentPolicy, serializeContentSecurityPolicy("course-scratch"));
	const courseLine = maps
		.split("\n")
		.find(line => line.trim().startsWith("~^/courses(?:/|$) \""));
	assert.ok(courseLine);
	const legacyLine = courseLine.replaceAll(" https://images.unsplash.com", "");
	assert.notEqual(legacyLine, courseLine);
	const legacyMaps = maps.replace(courseLine, legacyLine);
	assert.equal(
		courseContentSecurityPolicy(legacyMaps),
		currentPolicy.replaceAll(" https://images.unsplash.com", "")
	);
	assert.throws(
		() => courseContentSecurityPolicy(`${maps}\n${courseLine}`),
		/unique course policy/u
	);
	const helper = path.join(repositoryRoot, "scripts/native-csp-from-map.mjs");
	const result = spawnSync(
		process.execPath,
		[helper, path.join(repositoryRoot, "deploy/native/classes-http-maps.conf")],
		{ encoding: "utf8" }
	);
	assert.equal(result.status, 0, result.stderr);
	assert.equal(result.stdout, currentPolicy);
});

test("prepare and promotion scripts enforce exact provenance and rollback gates", async () => {
	const [prepare, promote, verifier, documentation] = await Promise.all([
		source("scripts/prepare-native-release.sh"),
		source("scripts/promote-native-release.sh"),
		source("scripts/verify-native-release.mjs"),
		source("docs/native-production-deployment.md")
	]);

	assert.ok(prepare.includes('CLASSES_BUILD_REVISION="$classes_revision" \\'));
	assert.ok(prepare.includes('CLASSES_BUILD_RELEASE="$classes_tag" \\'));

	assert.match(prepare, /Prepare releases as the unprivileged classes-build user/u);
	assert.match(prepare, /verify-native-source[.]sh/u);
	assert.match(prepare, /npm --prefix "\$1"/u);
	assert.match(prepare, /run -w front-end test:unit/u);
	assert.match(prepare, /run -w back-end test/u);
	assert.match(prepare, /run audit/u);
	assert.match(prepare, /classes_staging_candidate\/back-end" ci/u);
	assert.match(prepare, /back-end\/node_modules\/[.]bin/u);
	const policyCopy = prepare.search(
		/^\t"\$classes_build_source\/back-end\/[.]npmrc" \\$/mu
	);
	const runtimeInstall = prepare.search(
		/^classes_npm "\$classes_staging_candidate\/back-end" ci \\$/mu
	);
	const policyRemoval = prepare.search(
		/^rm -f -- "\$classes_staging_candidate\/back-end\/[.]npmrc"$/mu
	);
	const manifestWrite = prepare.search(
		/^node "\$classes_staging_candidate\/scripts\/verify-native-release[.]mjs" \\$/mu
	);
	assert.ok(policyCopy >= 0 && policyCopy < runtimeInstall);
	assert.ok(runtimeInstall < policyRemoval && policyRemoval < manifestWrite);
	assert.match(prepare.slice(runtimeInstall, policyRemoval), /^\t--include=optional \\$/mu);
	assert.match(prepare.slice(runtimeInstall, policyRemoval), /^\t--strict-allow-scripts$/mu);
	assert.match(promote, /Candidate must remain inside the managed [.]candidates directory/u);
	assert.match(promote, /verify-native-source[.]sh/u);
	const candidateProof = 'node "$classes_source_dir/scripts/verify-native-provenance.mjs" "$classes_candidate"';
	const finalProof = '[[ "$(native_manifest_digest "$classes_final_release/.classes-native-release.json")" == "$classes_authenticated_manifest_sha256" ]]';
	assert.ok(promote.indexOf(candidateProof) > promote.indexOf("snapshot-native-candidate.py"));
	assert.ok(promote.indexOf(candidateProof) < promote.indexOf('mv -- "$classes_candidate" "$classes_final_release"'));
	assert.ok(promote.indexOf(finalProof) > promote.indexOf('mv -- "$classes_candidate" "$classes_final_release"'));
	assert.ok(promote.indexOf(finalProof) < promote.indexOf('atomic_link "$classes_final_release" "$classes_current_link"'));
	assert.ok(promote.indexOf('classes_authenticated_manifest_sha256="$(native_manifest_digest "$classes_manifest")"') > promote.indexOf(candidateProof));
	assert.equal(promote.match(/verify-native-provenance[.]mjs/gu).length, 1);
	assert.match(promote, /restore_previous\(\) \{\s*node "\$classes_source_dir\/scripts\/verify-native-release[.]mjs" "\$classes_previous_target" \|\| return 1/u);
	assert.doesNotMatch(promote, /verify-native-provenance[.]mjs" "\$classes_previous_target"/u);
	assert.match(promote, /Promotion requires an existing current release symlink for rollback/u);
	assert.match(promote, /snapshot-native-candidate[.]py/u);
	assert.doesNotMatch(promote, /chown -R/u);
	assert.ok(
		promote.indexOf("snapshot-native-candidate.py")
		< promote.indexOf('node "$classes_source_dir/scripts/verify-native-release.mjs" "$classes_candidate"')
	);
	assert.ok(
		promote.indexOf('"$classes_source_dir/$classes_release_input" "$classes_candidate/$classes_release_input"')
		< promote.indexOf('mv -- "$classes_candidate" "$classes_final_release"')
	);
	assert.match(promote, /nginx -t/u);
	assert.match(promote, /verify_nginx_includes/u);
	assert.match(promote, /grep -Fxc "# configuration file \$classes_target:"/u);
	assert.match(promote, /atomic_link "\$classes_final_release" "\$classes_current_link"/u);
	assert.match(promote, /restore_previous/u);
	assert.doesNotMatch(promote, /if ! \(\s*set -e/u);
	assert.match(promote, /classes_activation_status=\$[?]/u);
	assert.match(promote, /classes_rollback_status=\$[?]/u);
	assert.match(promote, /if \(\( classes_rollback_status == 0 \)\); then/u);
	assert.match(promote, /classes_previous_revision=/u);
	assert.match(promote, /for _classes_attempt in \{1[.][.]30\}/u);
	assert.match(promote, /wait_for_api_ready "\$classes_work_dir\/activation"/u);
	assert.match(promote, /wait_for_api_ready "\$classes_work_dir\/rollback"/u);
	assert.match(promote, /verify_nginx_includes "\$classes_work_dir\/rollback-nginx[.]dump"/u);
	assert.match(
		promote,
		/smoke_release\s+\\\s+"\$classes_previous_target"\s+\\\s+"\$classes_previous_revision"\s+\\\s+"\$classes_work_dir\/rollback"/u
	);
	assert.match(
		promote,
		/cmp --silent "\$classes_probe_prefix[.]root[.]body" "\$classes_expected_release\/front-end\/dist\/index[.]html"/u
	);
	assert.match(
		promote,
		/cmp --silent "\$classes_probe_prefix[.]not-found[.]body" "\$classes_expected_release\/front-end\/dist\/404[.]html"/u
	);
	assert.match(promote, /capture_https \/api\/readyz "\$classes_probe_prefix[.]ready[.]body"/u);
	assert.match(promote, /__native-release-missing-\$classes_expected_revision/u);
	assert.match(promote, /api\/__native-release-missing-\$classes_expected_revision/u);
	assert.match(promote, /classes_preserve_work=true/u);
	assert.match(promote, /--resolve "classes[.]example[.]com:443:127[.]0[.]0[.]1"/u);
	assert.match(promote, /--resolve "classes[.]example[.]com:80:127[.]0[.]0[.]1"/u);
	assert.match(promote, /https:\/\/classes[.]example[.]com\$classes_http_path/u);
	assert.match(promote, /capture_https \/courses\//u);
	assert.match(
		promote,
		/require_coding_standard_redirect "\/coding_standard\?probe=1"/u
	);
	assert.match(promote, /node "\$classes_source_dir\/scripts\/native-csp-from-map[.]mjs"/u);
	assert.match(promote, /"\$classes_expected_release\/deploy\/native\/classes-http-maps[.]conf"/u);
	assert.match(promote, /"\$classes_work_dir\/activation" \\\s+true/u);
	assert.match(promote, /"\$classes_require_analytics_denial" == "true"/u);
	assert.match(promote, /"\/__central-analytics\/script[.]js"/u);
	assert.match(
		promote,
		/require_one_header\s+\\\s+"\$classes_probe_prefix[.]courses[.]headers"\s+\\\s+"Content-Security-Policy"\s+\\\s+"\$classes_course_csp"/u
	);
	assert.match(promote, /\/api\/readyz/u);
	assert.match(promote, /"\/404[.]html"/u);
	assert.match(promote, /"\/courses[.]html"/u);
	assert.match(promote, /\/release[.]json/u);
	assert.match(promote, /\/api\/release/u);
	assert.match(promote, /\/api\/__native-release-missing-/u);
	assert.match(promote, /index\(\$0, ":"\)/u);
	assert.match(promote, /--noproxy '\*'/u);
	assert.match(verifier, /front-end\/dist\/[.]vite/u);
	assert.match(verifier, /front-end\/dist\/release[.]json/u);
	assert.match(verifier, /raw static route alias/u);
	assert.match(verifier, /unsupported entry/u);
	assert.match(verifier, /back-end\/node_modules/u);
	assert.match(documentation, /internal `[.]classes-native-release[.]json`/u);
	assert.match(documentation, /fetched `origin\/main`/u);
	assert.match(documentation, /not an initial-cutover tool/u);
	assert.match(documentation, /Any activation failure restores the prior symlink/u);
	assert.match(documentation, /rollback is reported as successful only after/u);
	assert.match(documentation, /activation and rollback diagnostics remain separate/u);
});

test("native provenance rejects rehashed payloads and pins the independent signer", async t => {
	const temporaryRoot = await fs.mkdtemp(path.join(os.tmpdir(), "classes-provenance-"));
	t.after(async () => fs.rm(temporaryRoot, { force: true, recursive: true }));
	const candidate = path.join(temporaryRoot, "candidate");
	for (const directory of [
		"front-end/dist/python-runtime", "back-end/dist",
		"back-end/node_modules/runtime-package", "scripts", "deploy"
	]) await fs.mkdir(path.join(candidate, directory), { recursive: true });
	for (const relativePath of [
		"package.json", "package-lock.json", "front-end/package.json",
		"back-end/package.json", "back-end/package-lock.json",
		"scripts/verify-native-source.sh", "scripts/verify-native-release.mjs"
	]) await fs.copyFile(path.join(repositoryRoot, relativePath), path.join(candidate, relativePath));
	await fs.cp(path.join(repositoryRoot, "deploy/native"), path.join(candidate, "deploy/native"), { recursive: true });
	const contents = {
		"front-end/dist/index.html": "<h1>Course platform</h1>\n",
		"front-end/dist/404.html": "<title>Page not found | Classes</title>\n",
		"front-end/dist/python-runtime/runtime.js": "export {};\n",
		"front-end/dist/python-runtime/runtime.css": "body {}\n",
		"back-end/dist/server.js": "export {};\n",
		"back-end/node_modules/runtime-package/index.js": "export {};\n"
	};
	for (const [relativePath, content] of Object.entries(contents)) {
		await fs.writeFile(path.join(candidate, relativePath), content);
	}
	const tag = "v2.8.4";
	const revision = "a".repeat(40);
	const manifestPath = path.join(candidate, ".classes-native-release.json");
	const internalVerifier = path.join(repositoryRoot, "scripts/verify-native-release.mjs");
	const guard = path.join(repositoryRoot, "scripts/verify-native-provenance.mjs");
	const writeManifest = async (selectedTag = tag, selectedRevision = revision) => {
		await fs.rm(manifestPath, { force: true });
		const result = spawnSync(process.execPath, [internalVerifier, "--write", "--tag", selectedTag, "--revision", selectedRevision, candidate], { encoding: "utf8" });
		assert.equal(result.status, 0, result.stderr);
	};
	await writeManifest();
	const trustedManifest = await fs.readFile(manifestPath);
	const digest = createHash("sha256").update(trustedManifest).digest("hex");
	const repository = "instruction-material/classes.jacobdanderson.net";
	const expectedArguments = [
		"attestation", "verify", manifestPath, "--hostname", "github.com", "--repo", repository,
		"--signer-workflow", `${repository}/.github/workflows/native-release.yml`,
		"--source-digest", revision, "--signer-digest", revision,
		"--source-ref", `refs/tags/${tag}`, "--deny-self-hosted-runners"
	];
	const cli = path.join(temporaryRoot, "gh");
	await fs.writeFile(cli, `#!${process.execPath}\nimport fs from "node:fs";\nimport crypto from "node:crypto";\nconst args = process.argv.slice(2);\nfs.writeFileSync(${JSON.stringify(path.join(temporaryRoot, "called.json"))}, JSON.stringify(args));\nif (process.env.TEST_PROVENANCE_UNAVAILABLE === "1") process.exit(1);\nif (JSON.stringify(args) !== ${JSON.stringify(JSON.stringify(expectedArguments))}) process.exit(2);\nif (crypto.createHash("sha256").update(fs.readFileSync(args[2])).digest("hex") !== ${JSON.stringify(digest)}) process.exit(3);\n`, { mode: 0o755 });
	const verify = (extraEnv = {}) => spawnSync(process.execPath, [guard, candidate], {
		encoding: "utf8",
		env: { ...process.env, PATH: `${temporaryRoot}${path.delimiter}${process.env.PATH}`, ...extraEnv }
	});
	assert.equal(verify().status, 0);
	assert.deepEqual(JSON.parse(await fs.readFile(path.join(temporaryRoot, "called.json"), "utf8")), expectedArguments);
	assert.notEqual(verify({ TEST_PROVENANCE_UNAVAILABLE: "1" }).status, 0);
	for (const relativePath of ["back-end/dist/server.js", "back-end/node_modules/runtime-package/index.js", "front-end/dist/index.html"]) {
		await fs.appendFile(path.join(candidate, relativePath), "forged runtime bytes\n");
		await writeManifest();
		assert.equal(spawnSync(process.execPath, [internalVerifier, candidate]).status, 0);
		assert.match(verify().stderr, /lacks verified canonical CI provenance/u);
		await fs.writeFile(path.join(candidate, relativePath), contents[relativePath]);
	}
	const addedFile = path.join(candidate, "back-end/dist/extra.js");
	await fs.writeFile(addedFile, "export {};\n");
	await writeManifest();
	assert.notEqual(verify().status, 0);
	await fs.rm(addedFile);
	await fs.rm(path.join(candidate, "back-end/node_modules/runtime-package/index.js"));
	await writeManifest();
	assert.notEqual(verify().status, 0);
	await fs.writeFile(path.join(candidate, "back-end/node_modules/runtime-package/index.js"), contents["back-end/node_modules/runtime-package/index.js"]);
	await writeManifest("v2.8.5");
	assert.notEqual(verify().status, 0);
	await writeManifest(tag, "b".repeat(40));
	assert.notEqual(verify().status, 0);
	await fs.writeFile(manifestPath, trustedManifest);
	assert.equal(verify().status, 0);
	await fs.rm(cli);
	const missingCli = spawnSync(process.execPath, [guard, candidate], { encoding: "utf8", env: { ...process.env, PATH: temporaryRoot } });
	assert.match(missingCli.stderr, /lacks verified canonical CI provenance/u);
});

test("native release producer isolates signing from untrusted persistent builders", async () => {
	const workflow = await source(".github/workflows/native-release.yml");
	assert.match(workflow, /tags: \[v2\.\*\.\*\]/u);
	assert.match(workflow, /runs-on: ubuntu-24\.04-arm/u);
	assert.match(workflow, /persist-credentials: false/u);
	assert.match(workflow, /prepare-native-release.sh --source "\$GITHUB_WORKSPACE"/u);
	assert.match(workflow, /attest:\s*needs: build\s*runs-on: ubuntu-latest/u);
	assert.match(workflow, /--tag "\$RELEASE_TAG"/u);
	assert.doesNotMatch(workflow, /pull_request|workflow_dispatch|runs-on:.*self-hosted/u);
	assert.doesNotMatch(workflow.slice(0, workflow.indexOf("    attest:")), /id-token: write|attestations: write/u);
	assert.doesNotMatch(workflow.slice(workflow.indexOf("    attest:")), /npm|tar -|node |bash /u);
	for (const action of workflow.matchAll(/uses: ([^\n]+)/gu)) {
		assert.match(action[1], /^actions\/[a-z-]+@[a-f0-9]{40}$/u);
	}
});

test("native source provenance requires canonical fetched origin/main and an annotated tag", async (t) => {
	const temporaryRoot = await fs.mkdtemp(
		path.join(os.tmpdir(), "classes-native-source-")
	);
	t.after(async () => fs.rm(temporaryRoot, { force: true, recursive: true }));
	const git = (...arguments_) => {
		const result = spawnSync("git", ["-C", temporaryRoot, ...arguments_], {
			encoding: "utf8"
		});
		assert.equal(result.status, 0, result.stderr);
		return result.stdout.trim();
	};

	git("init", "--initial-branch=main");
	git("config", "user.name", "Native Fixture");
	git("config", "user.email", "native-fixture@example.invalid");
	await fs.writeFile(path.join(temporaryRoot, "README.md"), "fixture\n");
	git("add", "README.md");
	git("commit", "-m", "Initial fixture");
	git(
		"remote",
		"add",
		"origin",
		"git@github.com:instruction-material/classes.jacobdanderson.net.git"
	);
	git("update-ref", "refs/remotes/origin/main", "HEAD");
	git("tag", "-a", "v2.7.999", "-m", "Fixture release");

	const verifier = path.join(
		repositoryRoot,
		"scripts/verify-native-source.sh"
	);
	const verify = () => spawnSync(
		"bash",
		[verifier, temporaryRoot, "v2.7.999"],
		{ encoding: "utf8" }
	);
	assert.equal(verify().status, 0);

	git("remote", "set-url", "origin", "git@github.com:other/classes.git");
	let rejected = verify();
	assert.notEqual(rejected.status, 0);
	assert.match(rejected.stderr, /origin is not instruction-material/u);
	git(
		"remote",
		"set-url",
		"origin",
		"https://github.com/instruction-material/classes.jacobdanderson.net.git"
	);

	git("update-ref", "-d", "refs/remotes/origin/main");
	rejected = verify();
	assert.notEqual(rejected.status, 0);
	assert.match(rejected.stderr, /missing the fetched origin\/main/u);
	git("update-ref", "refs/remotes/origin/main", "HEAD");

	await fs.writeFile(path.join(temporaryRoot, "README.md"), "new fixture\n");
	git("add", "README.md");
	git("commit", "-m", "Unfetched fixture commit");
	rejected = verify();
	assert.notEqual(rejected.status, 0);
	assert.match(rejected.stderr, /HEAD is not contained in fetched origin\/main/u);
	git("update-ref", "refs/remotes/origin/main", "HEAD");
	git("checkout", "--detach", "v2.7.999");
	assert.equal(verify().status, 0, "An immutable tag remains valid after main advances");
	await fs.writeFile(path.join(temporaryRoot, "README.md"), "unmerged fixture\n");
	git("add", "README.md");
	git("commit", "-m", "Unmerged fixture");
	assert.match(verify().stderr, /HEAD is not contained in fetched origin\/main/u);

	const verifierSource = await source("scripts/verify-native-source.sh");
	assert.doesNotMatch(verifierSource, /git[^\n]*fetch/u);
});

test("internal manifest detects payload drift and stays out of public output", async t => {
	const temporaryRoot = await fs.mkdtemp(path.join(os.tmpdir(), "classes-native-test-"));
	t.after(async () => fs.rm(temporaryRoot, { force: true, recursive: true }));
	const candidate = path.join(temporaryRoot, "candidate");
	for (const directory of [
		"front-end/dist",
		"back-end/dist",
		"back-end/node_modules/runtime-package",
		"front-end",
		"back-end",
		"scripts",
		"deploy"
	]) {
		await fs.mkdir(path.join(candidate, directory), { recursive: true });
	}
	for (const relativePath of [
		"package.json",
		"package-lock.json",
		"front-end/package.json",
		"back-end/package.json",
		"back-end/package-lock.json"
	]) {
		await fs.copyFile(path.join(repositoryRoot, relativePath), path.join(candidate, relativePath));
	}
	for (const scriptName of [
		"verify-native-release.mjs",
		"verify-native-source.sh"
	]) {
		await fs.copyFile(
			path.join(repositoryRoot, "scripts", scriptName),
			path.join(candidate, "scripts", scriptName)
		);
	}
	await fs.cp(path.join(repositoryRoot, "deploy/native"), path.join(candidate, "deploy/native"), {
		recursive: true
	});
	await fs.writeFile(path.join(candidate, "front-end/dist/index.html"), "<h1>Course platform</h1>\n");
	await fs.writeFile(
		path.join(candidate, "front-end/dist/404.html"),
		"<title>Page not found | Classes</title>\n"
	);
	await fs.mkdir(path.join(candidate, "front-end/dist/about"));
	await fs.writeFile(
		path.join(candidate, "front-end/dist/about/index.html"),
		"<h1>About</h1>\n"
	);
	await fs.writeFile(
		path.join(candidate, "front-end/dist/about.html"),
		"<h1>About</h1>\n"
	);
	await fs.writeFile(path.join(candidate, "back-end/dist/server.js"), "export {};\n");
	await fs.writeFile(
		path.join(candidate, "back-end/node_modules/runtime-package/index.js"),
		"export {};\n"
	);

	const verifier = path.join(repositoryRoot, "scripts/verify-native-release.mjs");
	await fs.writeFile(path.join(candidate, "unchecked-top-level.sh"), "exit 0\n");
	let rejectedPayload = spawnSync(
		process.execPath,
		[verifier, "--write", "--tag", "v2.7.205", "--revision", "a".repeat(40), candidate],
		{ encoding: "utf8" }
	);
	assert.notEqual(rejectedPayload.status, 0);
	assert.match(rejectedPayload.stderr, /unsupported entry/u);
	await fs.rm(path.join(candidate, "unchecked-top-level.sh"));

	await fs.copyFile(
		path.join(repositoryRoot, "back-end/.npmrc"),
		path.join(candidate, "back-end/.npmrc")
	);
	rejectedPayload = spawnSync(
		process.execPath,
		[verifier, "--write", "--tag", "v2.7.205", "--revision", "a".repeat(40), candidate],
		{ encoding: "utf8" }
	);
	assert.notEqual(rejectedPayload.status, 0);
	assert.match(rejectedPayload.stderr, /unsupported entry back-end\/\.npmrc/u);
	await fs.rm(path.join(candidate, "back-end/.npmrc"));

	await fs.symlink(
		path.join(candidate, "package.json"),
		path.join(candidate, "unchecked-link")
	);
	rejectedPayload = spawnSync(
		process.execPath,
		[verifier, "--write", "--tag", "v2.7.205", "--revision", "a".repeat(40), candidate],
		{ encoding: "utf8" }
	);
	assert.notEqual(rejectedPayload.status, 0);
	assert.match(rejectedPayload.stderr, /must not contain symlink/u);
	await fs.rm(path.join(candidate, "unchecked-link"));

	const rawAliasResult = spawnSync(
		process.execPath,
		[verifier, "--write", "--tag", "v2.7.205", "--revision", "a".repeat(40), candidate],
		{ encoding: "utf8" }
	);
	assert.notEqual(rawAliasResult.status, 0);
	assert.match(rawAliasResult.stderr, /raw static route alias/u);
	await fs.rm(path.join(candidate, "front-end/dist/about.html"));

	const writeResult = spawnSync(
		process.execPath,
		[verifier, "--write", "--tag", "v2.7.205", "--revision", "a".repeat(40), candidate],
		{ encoding: "utf8" }
	);
	assert.equal(writeResult.status, 0, writeResult.stderr);
	const verifyResult = spawnSync(process.execPath, [verifier, candidate], { encoding: "utf8" });
	assert.equal(verifyResult.status, 0, verifyResult.stderr);
	assert.equal(
		await fs.lstat(path.join(candidate, ".classes-native-release.json")).then(stats => stats.isFile()),
		true
	);
	await assert.rejects(fs.access(path.join(candidate, "front-end/dist/release.json")));

	await fs.appendFile(path.join(candidate, "back-end/dist/server.js"), "// changed\n");
	const driftResult = spawnSync(process.execPath, [verifier, candidate], { encoding: "utf8" });
	assert.notEqual(driftResult.status, 0);
	assert.match(driftResult.stderr, /checksum mismatch/u);

	await fs.writeFile(path.join(candidate, "back-end/dist/server.js"), "export {};\n");
	await fs.rm(path.join(candidate, ".classes-native-release.json"));
	const newReleaseArguments = [verifier, "--write", "--tag", "v2.8.1", "--revision", "a".repeat(40), candidate];
	const missingRuntime = spawnSync(process.execPath, newReleaseArguments, { encoding: "utf8" });
	assert.notEqual(missingRuntime.status, 0);
	assert.match(missingRuntime.stderr, /python-runtime\/runtime.js/u);
	await fs.mkdir(path.join(candidate, "front-end/dist/python-runtime"));
	for (const name of ["runtime.js", "runtime.css"]) {
		await fs.writeFile(path.join(candidate, "front-end/dist/python-runtime", name), "synthetic fixture\n");
	}
	const newRelease = spawnSync(process.execPath, newReleaseArguments, { encoding: "utf8" });
	assert.equal(newRelease.status, 0, newRelease.stderr);
	await fs.rm(path.join(candidate, "front-end/dist/python-runtime/runtime.js"));
	const lostRuntime = spawnSync(process.execPath, [verifier, candidate], { encoding: "utf8" });
	assert.notEqual(lostRuntime.status, 0);
	assert.match(lostRuntime.stderr, /python-runtime\/runtime.js/u);
});

test("all hosting profiles require COOP and CORP consistently", async () => {
	assert.equal(exactSecurityHeaders["cross-origin-opener-policy"], "same-origin");
	assert.equal(exactSecurityHeaders["cross-origin-resource-policy"], "same-origin");
	assert.equal(contentSecurityPolicies.standard["frame-ancestors"][0], "'none'");
	const netlify = await source("netlify.toml");
	assert.match(netlify, /Cross-Origin-Opener-Policy = "same-origin"/u);
	assert.match(netlify, /Cross-Origin-Resource-Policy = "same-origin"/u);
	const packageJson = JSON.parse(await source("package.json"));
	const continuousIntegration = await source(".github/workflows/ci.yml");
	assert.equal(
		packageJson.scripts["test:native-deployment"],
		"node --test test/native-production-deployment.test.mjs"
	);
	assert.equal(
		packageJson.scripts["test:native-nginx"],
		"node test/native-nginx-fixture.mjs"
	);
	assert.match(continuousIntegration, /run: npm run test:native-deployment/u);
	assert.match(continuousIntegration, /run: npm run test:native-nginx/u);
	assert.match(continuousIntegration, /run: npm run build/u);
});
