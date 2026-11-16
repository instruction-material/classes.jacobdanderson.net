import type { PythonIdeFile } from "./pythonIde";
import { githubRawUrl, parseGitHubResource } from "./codePreview";
import manifest from "./machineLearningImageSourceManifest.json";

export const machineLearningImageSourceRevision = manifest.revision;
export const machineLearningImagePacks = manifest.packs;

export function machineLearningImageImportFiles(url: string) {
	const resource = parseGitHubResource(url);
	if (
		!resource ||
		resource.mode !== "tree" ||
		resource.owner.toLowerCase() !== "instruction-material" ||
		resource.repo.toLowerCase() !== "ai-level-2" ||
		resource.ref !== manifest.revision
	) {
		return null;
	}
	const [pack, role, extra] = resource.path.split("/");
	if (
		!pack ||
		!manifest.packs.includes(pack) ||
		(role !== "starter" && role !== "solution") ||
		extra !== undefined
	) {
		return null;
	}
	const prefix = `${pack}/${role}/`;
	const sources: Record<string, { sha256: string; byteLength: number }> =
		manifest.sources;
	return [
		...Object.entries(sources)
			.filter(([path]) => path.startsWith(prefix))
			.map(([path, expected]) => ({
				name: path.slice(prefix.length),
				...expected,
				encoding: "text" as const
			})),
		...Object.entries(manifest.images).map(([name, expected]) => ({
			name,
			...expected,
			encoding: "base64" as const
		}))
	].map(file => ({
		...file,
		rawUrl: githubRawUrl(resource, prefix + file.name)
	}));
}

async function readProjectBytes(
	response: Response,
	byteLength: number
): Promise<ArrayBuffer> {
	if (!response.ok || !response.body)
		throw new Error("A required project file could not be loaded.");
	const bytes = new Uint8Array(byteLength);
	const reader = response.body.getReader();
	let offset = 0;
	try {
		while (true) {
			const { done, value } = await reader.read();
			if (done) break;
			if (offset + value.length > byteLength)
				throw new Error("A required project file is too large.");
			bytes.set(value, offset);
			offset += value.length;
		}
	} finally {
		await reader.cancel().catch(() => {});
		reader.releaseLock();
	}
	if (offset !== byteLength)
		throw new Error("The project download is incomplete.");
	return bytes.buffer;
}

export async function loadMachineLearningImageFiles(
	url: string
): Promise<PythonIdeFile[] | null> {
	const selected = machineLearningImageImportFiles(url);
	if (!selected) return null;
	if (!globalThis.crypto?.subtle)
		throw new Error("Open this page over HTTPS to import the project.");
	const files: PythonIdeFile[] = [];
	for (const file of selected) {
		const controller = new AbortController();
		const timeout = setTimeout(() => controller.abort(), 15000);
		try {
			const response = await fetch(file.rawUrl, {
				signal: controller.signal,
				redirect: "error"
			});
			const buffer = await readProjectBytes(response, file.byteLength);
			const bytes = new Uint8Array(buffer);
			const digest = new Uint8Array(
				await crypto.subtle.digest("SHA-256", buffer)
			);
			let sha256 = "";
			for (const byte of digest) {
				sha256 += byte.toString(16).padStart(2, "0");
			}
			if (sha256 !== file.sha256) {
				throw new Error(
					"A required project file does not match the selected version."
				);
			}
			if (file.encoding === "base64") {
				files.push({
					name: file.name,
					encoding: "base64",
					content: btoa(String.fromCharCode(...bytes))
				});
			} else {
				const content = new TextDecoder("utf-8", {
					fatal: true
				}).decode(buffer);
				if (content.includes("\0"))
					throw new Error("A required source file is invalid.");
				files.push({ name: file.name, content, encoding: "text" });
			}
		} finally {
			clearTimeout(timeout);
		}
	}
	return files;
}
