import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const fixture = fileURLToPath(
	new URL("./fixtures/compressed-body-child.mjs", import.meta.url)
);

describe("compressed request stream lifecycle", () => {
	it.each(["valid-gzip", "gzip-trailer", "finish-and-hash"])(
		"keeps the process alive and completes %s",
		variant => {
			const startedAt = new Date().toISOString();
			const command = [process.execPath, fixture, variant];
			const child = spawnSync(command[0], command.slice(1), {
				cwd: process.cwd(),
				encoding: "utf8",
				timeout: 6000,
				maxBuffer: 128 * 1024,
				windowsHide: true
			});
			console.log(
				JSON.stringify({
					parentTask:
						process.env.CLASSES_FAMILY_TASK_ID ??
						"compressed-request-regression",
					parentPid: process.pid,
					pid: child.pid,
					cwd: process.cwd(),
					command,
					startedAt,
					finishedAt: new Date().toISOString(),
					exitCode: child.status,
					signal: child.signal,
					timeoutMs: 6000,
					childProcessGroupCleanup:
						"Isolated child reaped; child starts no descendant processes"
				})
			);
			expect(child.error, child.stderr).toBeUndefined();
			expect(child.signal, child.stderr).toBeNull();
			expect(child.status, child.stderr).toBe(0);
			const result = JSON.parse(child.stdout.trim());
			expect(result).toMatchObject({
				accepted: true,
				variant,
				status: 200,
				requestFinished: true,
				rawConsumerPreserved: true
			});
		},
		10_000
	);
});
