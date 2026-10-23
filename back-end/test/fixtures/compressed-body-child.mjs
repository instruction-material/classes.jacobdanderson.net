import assert from "node:assert/strict";
import { Buffer } from "node:buffer";
import { createHash } from "node:crypto";
import { once } from "node:events";
import { createServer, request } from "node:http";
import process from "node:process";
import { setTimeout as pause } from "node:timers/promises";
import { deflateSync, gzipSync } from "node:zlib";
import bodyParser from "body-parser";

// Isolated loopback regression for GHSA-27r3-jxmh-p828.
async function main() {
	const variant = process.argv[2];
	assert.ok(
		["valid-gzip", "gzip-trailer", "finish-and-hash"].includes(variant)
	);
	const waitForFinish = variant === "finish-and-hash";
	const payload = JSON.stringify({ retained: "coursework" });
	const encoded = waitForFinish ? deflateSync(payload) : gzipSync(payload);
	const suffix
		= variant === "valid-gzip"
			? Buffer.alloc(0)
			: Buffer.concat([Buffer.from([0]), Buffer.alloc(96 * 1024, 0x58)]);
	const initial = waitForFinish
		? Buffer.concat([encoded, Buffer.from([0])])
		: Buffer.concat([encoded, suffix]);
	const remainder = waitForFinish
		? Buffer.alloc(1536, 0x58)
		: Buffer.alloc(0);
	const expectedHash = createHash("sha256")
		.update(initial)
		.update(remainder)
		.digest("hex");
	const parse = bodyParser.json({ limit: "1mb" });
	let client;
	const server = createServer((incoming, response) => {
		const auditHash = createHash("sha256");
		incoming.on("data", chunk => auditHash.update(chunk));
		parse(incoming, response, (error) => {
			if (error) {
				response.writeHead(error.status ?? 500);
				response.end(error.type ?? "parse error");
				return;
			}
			const send = () => {
				response.setHeader("Content-Type", "application/json");
				if (waitForFinish)
					response.setHeader("X-Wire-Hash", auditHash.digest("hex"));
				response.end(JSON.stringify(incoming.body));
			};
			if (waitForFinish) {
				incoming.once("end", send);
				client.end(remainder);
			}
			else {
				send();
			}
		});
	});
	try {
		server.listen(0, "127.0.0.1");
		await once(server, "listening");
		const address = server.address();
		assert.ok(address && typeof address !== "string");
		const result = await new Promise((resolve, reject) => {
			client = request(
				{
					host: "127.0.0.1",
					port: address.port,
					method: "POST",
					agent: false,
					headers: {
						"Content-Type": "application/json",
						"Content-Encoding": waitForFinish ? "deflate" : "gzip",
						"Content-Length": initial.length + remainder.length
					}
				},
				(response) => {
					let text = "";
					response.setEncoding("utf8");
					response.on("data", (chunk) => {
						text += chunk;
					});
					response.on("error", reject);
					response.on("end", () =>
						resolve({
							status: response.statusCode,
							body: text,
							hash: response.headers["x-wire-hash"]
						}));
				}
			);
			client.on("error", reject);
			client.setTimeout(3000, () =>
				client.destroy(
					new Error("Owned compressed request did not finish")
				));
			if (waitForFinish) client.write(initial);
			else client.end(initial);
		});
		await pause(200);
		assert.equal(result.status, 200);
		assert.equal(result.body, payload);
		if (waitForFinish) assert.equal(result.hash, expectedHash);
		console.log(
			JSON.stringify({
				accepted: true,
				variant,
				status: result.status,
				requestFinished: true,
				rawConsumerPreserved:
					!waitForFinish || result.hash === expectedHash
			})
		);
	}
	finally {
		client?.destroy();
		server.closeAllConnections();
		await new Promise((resolve, reject) =>
			server.close(error => (error ? reject(error) : resolve()))
		);
	}
}

void main().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});
