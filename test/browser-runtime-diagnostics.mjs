import { readFileSync, statfsSync } from "node:fs";
import { join } from "node:path";
import process from "node:process";

const pageFailures = new WeakMap();

export function recordBrowserPageFailure(page, error) {
	if (!pageFailures.has(page)) pageFailures.set(page, error);
}

export function browserPageFailure(page, observedError) {
	return pageFailures.get(page) ?? observedError;
}

function resourceFile(path) {
	try {
		return readFileSync(path, "utf8").trim();
	}
	catch {
		return null;
	}
}

export function browserResourceLimits() {
	const result = { platform: process.platform };
	if (process.platform !== "linux") return result;
	const hierarchy = resourceFile("/proc/self/cgroup");
	const ownGroup = hierarchy
		?.split("\n")
		.find(line => line.startsWith("0::"))
		?.slice(3);
	const relative = ownGroup?.replace(/^\/+/, "");
	const group
		= relative && !relative.split("/").includes("..")
			? join("/sys/fs/cgroup", relative)
			: "/sys/fs/cgroup";
	result.cgroup = group;
	result.memoryMax = resourceFile(join(group, "memory.max"));
	result.memoryCurrent = resourceFile(join(group, "memory.current"));
	result.memoryPeak = resourceFile(join(group, "memory.peak"));
	result.memoryEvents = resourceFile(join(group, "memory.events"));
	try {
		const stats = statfsSync("/dev/shm");
		result.sharedMemoryAvailableBytes = stats.bavail * stats.bsize;
		result.sharedMemoryTotalBytes = stats.blocks * stats.bsize;
	}
	catch {
		result.sharedMemoryAvailableBytes = null;
	}
	return result;
}

export async function captureBrowserDiagnostics(browser, record) {
	record.browserVersion = await browser.version();
	record.resourceLimitsAtStart = browserResourceLimits();
	record.rendererCrashes = [];
	record.stderrTail = "";
	const stream = browser.process()?.stderr;
	const collectStderr = (chunk) => {
		record.stderrTail = (record.stderrTail + chunk.toString()).slice(
			-32768
		);
	};
	stream?.on("data", collectStderr);
	const session = await browser.target().createCDPSession();
	let reportCrash;
	const rendererCrash = new Promise((resolve) => {
		reportCrash = resolve;
	});
	session.on("Target.targetCrashed", (event) => {
		record.rendererCrashes.push({
			...event,
			at: new Date().toISOString(),
			resourceLimits: browserResourceLimits()
		});
		reportCrash(event);
	});
	await session.send("Target.setDiscoverTargets", { discover: true });
	return {
		rendererCrash,
		async dispose() {
			record.resourceLimitsAtClose = browserResourceLimits();
			stream?.removeListener("data", collectStderr);
			await session.detach().catch(() => {});
		}
	};
}
