import process from "node:process";
import { setTimeout } from "node:timers/promises";
import { pathToFileURL } from "node:url";

export async function waitForLoopbackPreview(
	url,
	{
		timeoutMs = 60_000,
		intervalMs = 250,
		requestTimeoutMs = 2_000,
		signal
	} = {}
) {
	const target = new URL(url);
	if (
		target.protocol !== "http:"
		|| target.hostname !== "127.0.0.1"
		|| target.username
		|| target.password
	) {
		throw new Error(
			"Preview readiness requires an HTTP loopback URL at 127.0.0.1"
		);
	}
	for (const value of [timeoutMs, intervalMs, requestTimeoutMs]) {
		if (!Number.isFinite(value) || value <= 0) {
			throw new Error(
				"Readiness time limits must be positive finite numbers"
			);
		}
	}
	const started = performance.now();
	const deadline = started + timeoutMs;
	let attempts = 0;
	let lastError = "No response";
	let lastHttpResult;
	while (performance.now() < deadline) {
		signal?.throwIfAborted();
		attempts++;
		try {
			const requestSignal = AbortSignal.timeout(
				Math.max(
					1,
					Math.ceil(
						Math.min(requestTimeoutMs, deadline - performance.now())
					)
				)
			);
			const response = await fetch(target, {
				redirect: "manual",
				headers: { Connection: "close" },
				signal: signal
					? AbortSignal.any([signal, requestSignal])
					: requestSignal
			});
			lastHttpResult = `HTTP ${response.status}`;
			await response.body?.cancel();
			if (response.status === 200) {
				return {
					attempts,
					elapsedMs: Math.round(performance.now() - started)
				};
			}
			lastError = lastHttpResult;
		}
		catch (error) {
			signal?.throwIfAborted();
			lastError = [error.message, error.cause?.code]
				.filter(Boolean)
				.join(": ");
		}
		const remaining = deadline - performance.now();
		if (remaining > 0) {
			await setTimeout(Math.min(intervalMs, remaining), undefined, {
				signal
			});
		}
	}
	throw new Error(
		`Preview at ${target.href} was not ready within ${timeoutMs}ms (${attempts} attempts; last result: ${lastHttpResult ?? lastError}${lastHttpResult && lastError !== lastHttpResult ? `; last attempt: ${lastError}` : ""})`
	);
}

if (
	process.argv[1]
	&& import.meta.url === pathToFileURL(process.argv[1]).href
) {
	const controller = new AbortController();
	const onSignal = () => controller.abort(new Error("Readiness cancelled"));
	process.once("SIGINT", onSignal);
	process.once("SIGTERM", onSignal);
	const startedAt = new Date().toISOString();
	const metadata = {
		parentTaskId:
			process.env.CLASSES_FAMILY_TASK_ID ?? "cypress-preview-readiness",
		cwd: process.cwd(),
		command: process.argv,
		pid: process.pid,
		parentPid: process.ppid,
		startedAt,
		timeoutMs: 60_000
	};
	console.log(JSON.stringify({ event: "start", ...metadata }));
	try {
		const result = await waitForLoopbackPreview(
			process.argv[2] ?? "http://127.0.0.1:3333",
			{ signal: controller.signal }
		);
		console.log(JSON.stringify({ event: "ready", ...result }));
	}
	catch (error) {
		console.error(error.message);
		process.exitCode = 1;
	}
	finally {
		controller.abort();
		process.removeListener("SIGINT", onSignal);
		process.removeListener("SIGTERM", onSignal);
		console.log(
			JSON.stringify({
				event: "end",
				...metadata,
				endedAt: new Date().toISOString(),
				exitCode: process.exitCode ?? 0,
				childProcessGroupCleanup:
					"No child processes; owned requests cancelled"
			})
		);
	}
}
