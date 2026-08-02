import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import {
	contentSecurityPolicies,
	exactSecurityHeaders,
	serializeContentSecurityPolicy
} from "../scripts/production-security-headers.mjs";

const repositoryRoot = path.resolve(import.meta.dirname, "..");

async function source(relativePath) {
	return fs.readFile(path.join(repositoryRoot, relativePath), "utf8");
}

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
		"code-ide",
		"graph-sketcher",
		"scheduler-embed",
		"wheel-embed",
		"student-management-embed",
		"python-worker"
	]) {
		assert.ok(maps.includes(serializeContentSecurityPolicy(profile)), `${profile} CSP drifted`);
	}
	const configuredHeaders = nginxAddHeaderValues(headers);
	for (const [name, value] of Object.entries(exactSecurityHeaders)) {
		assert.deepEqual(configuredHeaders.get(name), [value]);
	}
	assert.match(policy, /error_page 404 =404 \/404[.]html;/u);
	assert.match(policy, /location = \/404[.]html \{\s*internal;/u);
	assert.match(policy, /location \/ \{\s*try_files \$uri \$uri\/ =404;/u);
	assert.doesNotMatch(policy, /try_files[^;]*index[.]html/u);
	assert.match(policy, /location = \/index[.]html \{/u);
	assert.ok(policy.includes("if ($request_uri ~ ^/index[.]html"));
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

test("prepare and promotion scripts enforce exact provenance and rollback gates", async () => {
	const [prepare, promote, verifier, documentation] = await Promise.all([
		source("scripts/prepare-native-release.sh"),
		source("scripts/promote-native-release.sh"),
		source("scripts/verify-native-release.mjs"),
		source("docs/native-production-deployment.md")
	]);

	assert.match(prepare, /Prepare releases as the unprivileged classes-build user/u);
	assert.match(prepare, /verify-native-source[.]sh/u);
	assert.match(prepare, /npm --prefix "\$1"/u);
	assert.match(prepare, /run -w front-end test:unit/u);
	assert.match(prepare, /run -w back-end test/u);
	assert.match(prepare, /run audit/u);
	assert.match(prepare, /classes_staging_candidate\/back-end" ci/u);
	assert.match(prepare, /back-end\/node_modules\/[.]bin/u);
	assert.match(promote, /Candidate must remain inside the managed [.]candidates directory/u);
	assert.match(promote, /verify-native-source[.]sh/u);
	assert.match(promote, /Promotion requires an existing current release symlink for rollback/u);
	assert.match(promote, /chown -R root:root "\$classes_candidate"/u);
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
	assert.match(rejected.stderr, /HEAD is not the exact fetched origin\/main/u);

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
