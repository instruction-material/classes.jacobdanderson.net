import assert from "node:assert/strict";
import { spawn, spawnSync } from "node:child_process";
import { once } from "node:events";
import fs from "node:fs/promises";
import { createServer } from "node:net";
import os from "node:os";
import path from "node:path";
import process from "node:process";

const repositoryRoot = path.resolve(import.meta.dirname, "..");
const fixtureSource = path.join(
	repositoryRoot,
	"test/fixtures/native-nginx/site"
);
const canonicalOrigin = "https://classes.example.com";

function safeNginxPath(value) {
	assert.match(value, /^[/\w.-]+$/u, `Unsafe fixture path: ${value}`);
	return value;
}

function replaceOnce(source, needle, replacement) {
	assert.equal(source.split(needle).length - 1, 1, `Expected one ${needle}`);
	return source.replace(needle, replacement);
}

async function reservePort() {
	const server = createServer();
	server.listen(0, "127.0.0.1");
	await once(server, "listening");
	const address = server.address();
	assert.ok(address && typeof address === "object");
	const { port } = address;
	server.close();
	await once(server, "close");
	return port;
}

function delay(milliseconds) {
	return new Promise(resolve => setTimeout(resolve, milliseconds));
}

async function stopNginx(childProcess) {
	if (childProcess.exitCode !== null) return;
	childProcess.kill("SIGTERM");
	await Promise.race([
		once(childProcess, "exit"),
		delay(2_000).then(() => {
			if (childProcess.exitCode === null) childProcess.kill("SIGKILL");
		})
	]);
}

async function runFixture() {
	const nginxVersion = spawnSync("nginx", ["-v"], { encoding: "utf8" });
	assert.equal(
		nginxVersion.status,
		0,
		"The native Nginx fixture requires an installed nginx binary."
	);

	const temporaryRoot = await fs.mkdtemp(
		path.join(os.tmpdir(), "classes-native-nginx-")
	);
	let nginxProcess = null;
	try {
		const distDirectory = path.join(temporaryRoot, "dist");
		const mapsPath = path.join(temporaryRoot, "classes-http-maps.conf");
		const headersPath = path.join(
			temporaryRoot,
			"classes-static-headers.conf"
		);
		const policyPath = path.join(
			temporaryRoot,
			"classes-server-policy.conf"
		);
		const configPath = path.join(temporaryRoot, "nginx.conf");
		await fs.cp(fixtureSource, distDirectory, { recursive: true });

		const [maps, headers, sourcePolicy] = await Promise.all([
			fs.readFile(
				path.join(repositoryRoot, "deploy/native/classes-http-maps.conf"),
				"utf8"
			),
			fs.readFile(
				path.join(
					repositoryRoot,
					"deploy/native/classes-static-headers.conf"
				),
				"utf8"
			),
			fs.readFile(
				path.join(
					repositoryRoot,
					"deploy/native/classes-server-policy.conf"
				),
				"utf8"
			)
		]);

		let policy = replaceOnce(
			sourcePolicy,
			"root /srv/classes.example.com/current/front-end/dist;",
			`root ${safeNginxPath(distDirectory)};`
		);
		const installedHeadersPath = "/etc/nginx/snippets/classes-static-headers.conf";
		assert.ok(policy.includes(installedHeadersPath));
		policy = policy.replaceAll(
			installedHeadersPath,
			safeNginxPath(headersPath)
		);

		await Promise.all([
			fs.writeFile(mapsPath, maps),
			fs.writeFile(headersPath, headers),
			fs.writeFile(policyPath, policy)
		]);

		const port = await reservePort();
		const nginxConfig = [
			"worker_processes 1;",
			`pid ${safeNginxPath(path.join(temporaryRoot, "nginx.pid"))};`,
			`error_log ${safeNginxPath(path.join(temporaryRoot, "error.log"))} notice;`,
			"events { worker_connections 64; }",
			"http {",
			`	include ${safeNginxPath(mapsPath)};`,
			"	default_type text/html;",
			"	server {",
			`		listen 127.0.0.1:${port};`,
			"		server_name classes.example.com;",
			`		include ${safeNginxPath(policyPath)};`,
			"	}",
			"}",
			""
		].join("\n");
		await fs.writeFile(configPath, nginxConfig);

		const nginxArguments = [
			"-p",
			`${safeNginxPath(temporaryRoot)}/`,
			"-c",
			safeNginxPath(configPath)
		];
		const configTest = spawnSync("nginx", [...nginxArguments, "-t"], {
			encoding: "utf8"
		});
		assert.equal(
			configTest.status,
			0,
			`${configTest.stdout}\n${configTest.stderr}`
		);

		nginxProcess = spawn("nginx", [
			...nginxArguments,
			"-g",
			"daemon off;"
		]);
		let stderr = "";
		nginxProcess.stderr.setEncoding("utf8");
		nginxProcess.stderr.on("data", (chunk) => {
			stderr += chunk;
		});

		const request = requestPath => fetch(
			`http://127.0.0.1:${port}${requestPath}`,
			{
				headers: { Host: "classes.example.com" },
				redirect: "manual"
			}
		);
		let ready = false;
		for (let attempt = 0; attempt < 50; attempt += 1) {
			if (nginxProcess.exitCode !== null) break;
			try {
				const response = await request("/");
				if (response.status === 200) {
					ready = true;
					break;
				}
			}
			catch {
				// Nginx may still be binding its fixture port.
			}
			await delay(100);
		}
		assert.equal(ready, true, `Nginx fixture did not become ready.\n${stderr}`);

		for (const [requestPath, marker] of [
			["/", "Classes root fixture"],
			["/courses/", "Classes courses fixture"],
			["/ide/", "Classes IDE fixture"]
		]) {
			const response = await request(requestPath);
			assert.equal(response.status, 200, `${requestPath} must not redirect`);
			assert.ok((await response.text()).includes(marker));
		}

		for (const [requestPath, location] of [
			["/index.html?probe=1", `${canonicalOrigin}/?probe=1`],
			[
				"/courses/index.html?probe=1",
				`${canonicalOrigin}/courses/?probe=1`
			],
			["/ide/index.html?probe=1", `${canonicalOrigin}/ide/?probe=1`]
		]) {
			const response = await request(requestPath);
			assert.equal(response.status, 308);
			assert.equal(response.headers.get("location"), location);
		}

		for (const requestPath of [
			"/404.html",
			"/courses.html",
			"/unknown-fixture-route"
		]) {
			const response = await request(requestPath);
			assert.equal(response.status, 404);
			assert.match(await response.text(), /Classes not-found fixture/u);
		}

		console.log("Native Nginx fixture passed clean-route, redirect, and 404 checks.");
	}
	finally {
		if (nginxProcess) await stopNginx(nginxProcess);
		await fs.rm(temporaryRoot, { force: true, recursive: true });
	}
}

runFixture().catch((error) => {
	console.error(error instanceof Error ? error.message : "Native Nginx fixture failed.");
	process.exitCode = 1;
});
