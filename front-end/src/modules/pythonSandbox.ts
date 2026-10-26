import type { IdeStage } from "./ideDiagnostics";
import type { PythonIdeFile, PythonIdeProject } from "./pythonIde";
import { safeRuntimeVersion } from "./ideDiagnostics";
import { isPythonIdeTextFile, isValidPythonFileName } from "./pythonIde";

export interface PythonSandboxRun {
	mode: "python" | "turtle" | "pgzero" | "data";
	files: PythonIdeFile[];
	activeFileName: string;
	inputText: string;
}

export function sandboxPointerRelease(value: unknown, channel: string) {
	if (!value || typeof value !== "object" || Array.isArray(value))
		return null;
	const message = value as Record<string, unknown>;
	if (
		Object.keys(message).sort().join(",") !==
			"button,channel,clientX,clientY,type" ||
		message.channel !== channel ||
		message.type !== "pointer-release"
	) {
		return null;
	}
	const { button, clientX, clientY } = message;
	if (
		typeof button !== "number" ||
		!Number.isInteger(button) ||
		button < 0 ||
		button > 4 ||
		typeof clientX !== "number" ||
		!Number.isFinite(clientX) ||
		Math.abs(clientX) > 100_000 ||
		typeof clientY !== "number" ||
		!Number.isFinite(clientY) ||
		Math.abs(clientY) > 100_000
	) {
		return null;
	}
	return { button, clientX, clientY };
}

export function sandboxFiles(
	value: unknown,
	textOnly = false
): PythonIdeFile[] | null {
	if (!Array.isArray(value) || value.length > 40) return null;
	const names = new Set<string>();
	const files: PythonIdeFile[] = [];
	let total = 0;
	for (const item of value) {
		if (!item || typeof item !== "object" || Array.isArray(item))
			return null;
		if (
			Object.keys(item).some(
				key => !["name", "content", "encoding"].includes(key)
			)
		) {
			return null;
		}
		const { name, content, encoding = "text" } = item;
		if (
			typeof name !== "string" ||
			name.length > 80 ||
			names.has(name.toLowerCase())
		) {
			return null;
		}
		if (
			!isValidPythonFileName(name) ||
			(textOnly && !isPythonIdeTextFile(name))
		) {
			return null;
		}
		if (typeof content !== "string" || content.length > 3_000_000)
			return null;
		if (encoding !== "text" && (textOnly || encoding !== "base64"))
			return null;
		total += name.length + content.length;
		if (total > 12_000_000) return null;
		names.add(name.toLowerCase());
		files.push({ name, content, encoding });
	}
	return files;
}

export function sandboxRun(value: unknown): PythonSandboxRun | null {
	if (!value || typeof value !== "object" || Array.isArray(value))
		return null;
	const run = value as PythonSandboxRun;
	if (
		Object.keys(run).some(
			key =>
				!["mode", "files", "activeFileName", "inputText"].includes(key)
		)
	) {
		return null;
	}
	if (!["python", "turtle", "pgzero", "data"].includes(run.mode)) return null;
	if (typeof run.inputText !== "string" || run.inputText.length > 100_000)
		return null;
	if (
		typeof run.activeFileName !== "string" ||
		!/\.py$/i.test(run.activeFileName)
	) {
		return null;
	}
	const files = sandboxFiles(run.files);
	if (
		!files?.some(
			file => file.name === run.activeFileName && file.encoding === "text"
		)
	) {
		return null;
	}
	return {
		mode: run.mode,
		files,
		activeFileName: run.activeFileName,
		inputText: run.inputText
	};
}

export function sandboxFrameDocument(origin: string, channel: string) {
	const parsed = new URL(origin);
	if (
		!["http:", "https:"].includes(parsed.protocol) ||
		parsed.origin !== origin ||
		!/^[\w-]{20,80}$/.test(channel)
	) {
		throw new Error("Invalid runtime frame configuration.");
	}
	const assets = `${origin}/python-runtime/`;
	const media = `${origin}/ide/assets/`;
	const legacyMedia = `${origin}/python-ide/assets/`;
	const escape = (value: string) =>
		value
			.replaceAll("&", "&amp;")
			.replaceAll('"', "&quot;")
			.replaceAll("<", "&lt;");
	const policy = `default-src 'none'; base-uri ${origin}; script-src ${assets} https://cdn.jsdelivr.net 'unsafe-inline' 'unsafe-eval' 'wasm-unsafe-eval'; style-src ${assets} 'unsafe-inline'; connect-src ${media} ${legacyMedia} https://cdn.jsdelivr.net https://pypi.org https://files.pythonhosted.org; img-src ${media} ${legacyMedia} data: blob:; media-src ${media} ${legacyMedia} data: blob:; font-src ${assets}freesansbold.ttf; worker-src blob:; frame-src 'self' blob:; form-action 'none'; object-src 'none'`;
	return `<!doctype html><html><head><meta charset="utf-8"><meta name="referrer" content="no-referrer"><meta http-equiv="Content-Security-Policy" content="${escape(policy)}"><base href="${escape(origin)}/"><link rel="stylesheet" crossorigin="anonymous" href="${assets}runtime.css"><title>Isolated Python output</title></head><body data-channel="${escape(channel)}" data-parent-origin="${escape(origin)}"><div id="python-runtime-root"></div><script crossorigin="anonymous" src="${assets}runtime.js"></script></body></html>`;
}

export interface SandboxCallbacks {
	isCurrent: () => boolean;
	onOutput: (kind: "stdout" | "stderr" | "system", text: string) => void;
	onFiles: (files: PythonIdeFile[]) => void;
	onActivity: (active: boolean) => void;
	onError?: (message: string) => void;
	onStage?: (stage: IdeStage) => void;
	onPythonVersion?: (version: string) => void;
	onAudio?: (title: string, data: string) => void;
}

export function sandboxWavData(value: unknown): string | null {
	if (
		typeof value !== "string" ||
		value.length < 60 ||
		value.length > 1_500_000 ||
		value.length % 4 !== 0 ||
		!/^[A-Z0-9+/]*={0,2}$/i.test(value)
	) {
		return null;
	}
	try {
		const bytes = atob(value);
		if (
			bytes.length < 44 ||
			bytes.slice(0, 4) !== "RIFF" ||
			bytes.slice(8, 12) !== "WAVE"
		) {
			return null;
		}
		const size =
			bytes.charCodeAt(4) +
			bytes.charCodeAt(5) * 256 +
			bytes.charCodeAt(6) * 65536 +
			bytes.charCodeAt(7) * 16777216;
		return size + 8 === bytes.length ? value : null;
	} catch {
		return null;
	}
}

export function startPythonSandbox(
	host: HTMLElement,
	run: PythonSandboxRun,
	callbacks: SandboxCallbacks
) {
	const checked = sandboxRun(run);
	if (!checked) {
		throw new Error(
			"Project exceeds the isolated runtime file or input limits."
		);
	}
	const isDrawingRun = ["turtle", "pgzero"].includes(checked.mode);
	const frame = document.createElement("iframe");
	const channel = crypto.randomUUID();
	frame.title = "Isolated Python output";
	frame.setAttribute("sandbox", "allow-scripts");
	frame.setAttribute("referrerpolicy", "no-referrer");
	frame.style.cssText =
		checked.mode === "python"
			? "display:none"
			: "display:block;width:100%;height:100%;border:0;background:white";
	frame.srcdoc = sandboxFrameDocument(window.location.origin, channel);
	let active = true;
	let started = false;
	let finished = false;
	let filesReceived = false;
	let outputBytes = 0;
	let audioBytes = 0;
	let audioCount = 0;
	let messages = 0;
	let windowStart = Date.now();
	let resolveDone: () => void;
	let rejectDone: (reason: Error) => void;
	const done = new Promise<void>((resolve, reject) => {
		resolveDone = resolve;
		rejectDone = reject;
	});
	const timeout = window.setTimeout(
		fail,
		30_000,
		"The isolated Python runtime did not start."
	);
	function destroy() {
		active = false;
		window.clearTimeout(timeout);
		window.removeEventListener("message", receive);
		window.removeEventListener("mouseup", releasePointer);
		frame.remove();
		callbacks.onActivity(false);
		if (!finished) {
			finished = true;
			resolveDone();
		}
	}
	function fail(message: string) {
		try {
			callbacks.onError?.(message);
		} finally {
			if (!finished) {
				finished = true;
				rejectDone(new Error(message));
			}
			destroy();
		}
	}
	function releasePointer(event: MouseEvent) {
		if (!active || !started || !callbacks.isCurrent() || !isDrawingRun) {
			return;
		}
		const bounds = frame.getBoundingClientRect();
		frame.contentWindow?.postMessage(
			{
				channel,
				type: "pointer-release",
				button: event.button,
				clientX: event.clientX - bounds.left,
				clientY: event.clientY - bounds.top
			},
			"*"
		);
	}
	function receive(event: MessageEvent) {
		if (
			!active ||
			!callbacks.isCurrent() ||
			event.source !== frame.contentWindow ||
			event.origin !== "null"
		) {
			return;
		}
		const message = event.data;
		if (
			!message ||
			typeof message !== "object" ||
			Array.isArray(message) ||
			message.channel !== channel
		) {
			return;
		}
		if (Date.now() - windowStart > 1000) {
			windowStart = Date.now();
			messages = 0;
		}
		if (++messages > 1000) {
			fail("The runtime exceeded its message limit.");
			return;
		}
		const keys = Object.keys(message).sort().join(",");
		if (message.type === "ready" && keys === "channel,type" && !started) {
			started = true;
			window.clearTimeout(timeout);
			frame.contentWindow?.postMessage(
				{ channel, type: "run", run: checked },
				"*"
			);
		} else if (
			started &&
			message.type === "stage" &&
			keys === "channel,stage,type" &&
			[
				"preparing",
				"loading-assets",
				"loading-runtime",
				"loading-packages",
				"executing",
				"rendering",
				"completed",
				"stopped"
			].includes(message.stage)
		) {
			callbacks.onStage?.(message.stage);
		} else if (
			started &&
			message.type === "version" &&
			keys === "channel,type,version" &&
			safeRuntimeVersion(message.version) !== "unknown"
		) {
			callbacks.onPythonVersion?.(message.version);
		} else if (
			started &&
			message.type === "output" &&
			keys === "channel,kind,text,type"
		) {
			if (
				!["stdout", "stderr", "system"].includes(message.kind) ||
				typeof message.text !== "string" ||
				message.text.length > 16_000
			) {
				return;
			}
			outputBytes += message.text.length;
			if (outputBytes <= 1_000_000)
				callbacks.onOutput(message.kind, message.text);
		} else if (
			started &&
			message.type === "audio" &&
			keys === "channel,data,title,type" &&
			typeof message.title === "string" &&
			message.title.trim().length > 0 &&
			message.title.length <= 120 &&
			typeof message.data === "string" &&
			audioCount < 12 &&
			audioBytes + message.data.length <= 1_500_000
		) {
			const data = sandboxWavData(message.data);
			if (data) {
				audioBytes += data.length;
				audioCount++;
				callbacks.onAudio?.(message.title, data);
			}
		} else if (
			started &&
			message.type === "files" &&
			keys === "channel,files,type" &&
			!filesReceived
		) {
			const files = sandboxFiles(message.files, true);
			if (files) {
				filesReceived = true;
				callbacks.onFiles(files);
			}
		} else if (
			started &&
			message.type === "activity" &&
			keys === "active,channel,type" &&
			typeof message.active === "boolean"
		) {
			callbacks.onActivity(message.active);
		} else if (
			started &&
			message.type === "done" &&
			keys === "channel,type" &&
			!finished
		) {
			finished = true;
			resolveDone();
		} else if (
			started &&
			message.type === "error" &&
			keys === "channel,message,type" &&
			typeof message.message === "string" &&
			message.message.length <= 16_000
		) {
			fail(message.message);
		}
	}
	window.addEventListener("message", receive);
	window.addEventListener("mouseup", releasePointer);
	host.replaceChildren(frame);
	return { done, destroy };
}

export function unchangedRunFiles(
	project: PythonIdeProject,
	snapshot: PythonIdeFile[]
) {
	return (
		project.files.length === snapshot.length &&
		snapshot.every(file =>
			project.files.some(
				current =>
					current.name === file.name &&
					current.content === file.content &&
					(current.encoding ?? "text") === (file.encoding ?? "text")
			)
		)
	);
}
