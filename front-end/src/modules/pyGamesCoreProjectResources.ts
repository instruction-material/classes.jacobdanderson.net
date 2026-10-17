import type { PythonIdeFile } from "./pythonIde";
import { githubRawUrl, parseGitHubResource } from "./codePreview";

export const pyGamesCoreSourceRevision =
	"16643ac61f4f30dd0f5127ac7bbc418f62246bb4";
export const pyGamesCorePacks = [
	{ pack: "PG-CORE-Workspace-and-Assets", task: "workspace_config.py" },
	{ pack: "PG-CORE-Image-Anchors", task: "geometry.py" },
	{ pack: "PG-CORE-Arena-Capstone", task: "game_logic.py" }
] as const;

const sourceFiles: Record<string, { sha256: string; byteLength: number }> = {
	"PG-CORE-Image-Anchors/README.md": {
		sha256: "6acc0ebc7d0a6b5f14a058ccef1f902e62a697f98efe2bbdab40f430dfe5b273",
		byteLength: 4672
	},
	"PG-CORE-Arena-Capstone/README.md": {
		sha256: "edb5b26fae2e1b6a3b4f64b1abda5323bbce2a4258a7eb3e0deb59161e3cff4f",
		byteLength: 6340
	},
	"PG-CORE-Workspace-and-Assets/README.md": {
		sha256: "ff5629ef288a505ba7a40c616eb2a32d8e586972f96826b2158abeb922a0d201",
		byteLength: 4240
	},
	"PG-CORE-Workspace-and-Assets/solution/requirements.txt": {
		sha256: "6d8a387bf21716f17eb957096d5d52f6936d37cfc09fb99f77de325f32eff169",
		byteLength: 41
	},
	"PG-CORE-Workspace-and-Assets/solution/workspace_config.py": {
		sha256: "fa97c09f1afae27b4c7693b0c99f6251dd653435bef7782fdd73717d34fb9ea7",
		byteLength: 168
	},
	"PG-CORE-Workspace-and-Assets/solution/contracts.py": {
		sha256: "54157b276eef6626a4d9dac3e3f2277292ac492c3c6400435aac00b1af807781",
		byteLength: 516
	},
	"PG-CORE-Workspace-and-Assets/solution/main.py": {
		sha256: "462f3abeb474decd2d4b6294d240838bc52e7221acdd10f6a7f164a912258ee2",
		byteLength: 188
	},
	"PG-CORE-Workspace-and-Assets/solution/observations.md": {
		sha256: "56aacd3c4d65f4a219f13c45543c8ab185982f8cadb923a7bf2d2ae98ccb54a7",
		byteLength: 578
	},
	"PG-CORE-Workspace-and-Assets/starter/requirements.txt": {
		sha256: "6d8a387bf21716f17eb957096d5d52f6936d37cfc09fb99f77de325f32eff169",
		byteLength: 41
	},
	"PG-CORE-Workspace-and-Assets/starter/workspace_config.py": {
		sha256: "76492c2684834950840d4ae86e3d383d1f4c9398fc113072130610e89cc165c2",
		byteLength: 168
	},
	"PG-CORE-Workspace-and-Assets/starter/contracts.py": {
		sha256: "54157b276eef6626a4d9dac3e3f2277292ac492c3c6400435aac00b1af807781",
		byteLength: 516
	},
	"PG-CORE-Workspace-and-Assets/starter/main.py": {
		sha256: "462f3abeb474decd2d4b6294d240838bc52e7221acdd10f6a7f164a912258ee2",
		byteLength: 188
	},
	"PG-CORE-Workspace-and-Assets/starter/observations.md": {
		sha256: "56aacd3c4d65f4a219f13c45543c8ab185982f8cadb923a7bf2d2ae98ccb54a7",
		byteLength: 578
	},
	"PG-CORE-Workspace-and-Assets/starter/images/alien.png": {
		sha256: "a435b65656cdecdebd8b2c5510092217995b4754d1afd4bc2fdbd583040c8263",
		byteLength: 2781
	},
	"PG-CORE-Workspace-and-Assets/solution/images/alien.png": {
		sha256: "a435b65656cdecdebd8b2c5510092217995b4754d1afd4bc2fdbd583040c8263",
		byteLength: 2781
	},
	"PG-CORE-Arena-Capstone/solution/requirements.txt": {
		sha256: "6d8a387bf21716f17eb957096d5d52f6936d37cfc09fb99f77de325f32eff169",
		byteLength: 41
	},
	"PG-CORE-Arena-Capstone/solution/game_logic.py": {
		sha256: "58fa5bd42495990dcb79059ed8bbebecf5e23a9acc48c771def695fc98d92498",
		byteLength: 4118
	},
	"PG-CORE-Arena-Capstone/solution/contracts.py": {
		sha256: "198d704d6b0afac5c216e12163369f6695f298ddcfb1e85486a4c8810d1f849e",
		byteLength: 2198
	},
	"PG-CORE-Arena-Capstone/solution/main.py": {
		sha256: "7a1ffb96a39f20d06420a1cac09cb9e9ed194e15d7b05395cc4957c30c9cc140",
		byteLength: 1783
	},
	"PG-CORE-Arena-Capstone/solution/observations.md": {
		sha256: "56aacd3c4d65f4a219f13c45543c8ab185982f8cadb923a7bf2d2ae98ccb54a7",
		byteLength: 578
	},
	"PG-CORE-Arena-Capstone/starter/requirements.txt": {
		sha256: "6d8a387bf21716f17eb957096d5d52f6936d37cfc09fb99f77de325f32eff169",
		byteLength: 41
	},
	"PG-CORE-Arena-Capstone/starter/game_logic.py": {
		sha256: "73336ef9e1b504f571f232fd7ee08a5a1f484cbff97a4ff3d809c7f8334b436b",
		byteLength: 3755
	},
	"PG-CORE-Arena-Capstone/starter/contracts.py": {
		sha256: "198d704d6b0afac5c216e12163369f6695f298ddcfb1e85486a4c8810d1f849e",
		byteLength: 2198
	},
	"PG-CORE-Arena-Capstone/starter/main.py": {
		sha256: "7a1ffb96a39f20d06420a1cac09cb9e9ed194e15d7b05395cc4957c30c9cc140",
		byteLength: 1783
	},
	"PG-CORE-Arena-Capstone/starter/observations.md": {
		sha256: "56aacd3c4d65f4a219f13c45543c8ab185982f8cadb923a7bf2d2ae98ccb54a7",
		byteLength: 578
	},
	"PG-CORE-Arena-Capstone/starter/images/alien.png": {
		sha256: "a435b65656cdecdebd8b2c5510092217995b4754d1afd4bc2fdbd583040c8263",
		byteLength: 2781
	},
	"PG-CORE-Arena-Capstone/solution/images/alien.png": {
		sha256: "a435b65656cdecdebd8b2c5510092217995b4754d1afd4bc2fdbd583040c8263",
		byteLength: 2781
	},
	"PG-CORE-Image-Anchors/solution/requirements.txt": {
		sha256: "6d8a387bf21716f17eb957096d5d52f6936d37cfc09fb99f77de325f32eff169",
		byteLength: 41
	},
	"PG-CORE-Image-Anchors/solution/geometry.py": {
		sha256: "c931c5f55fed6270357d18914e548b74c09cd373703bd3d28f1a1802100af3e3",
		byteLength: 729
	},
	"PG-CORE-Image-Anchors/solution/contracts.py": {
		sha256: "95549834c0fb108cd30de9b18bb69f307642fe181357ee08e9e112d0d7936349",
		byteLength: 916
	},
	"PG-CORE-Image-Anchors/solution/main.py": {
		sha256: "5995c2856fc9fc2e26d9af0ea97f2a5df35a88587e91e551b30a93516cbc5db5",
		byteLength: 565
	},
	"PG-CORE-Image-Anchors/solution/observations.md": {
		sha256: "56aacd3c4d65f4a219f13c45543c8ab185982f8cadb923a7bf2d2ae98ccb54a7",
		byteLength: 578
	},
	"PG-CORE-Image-Anchors/starter/requirements.txt": {
		sha256: "6d8a387bf21716f17eb957096d5d52f6936d37cfc09fb99f77de325f32eff169",
		byteLength: 41
	},
	"PG-CORE-Image-Anchors/starter/geometry.py": {
		sha256: "451c07289f28d11e75aa20e49b23a6c3a600cae12048a618e6e971e7143ae9f7",
		byteLength: 593
	},
	"PG-CORE-Image-Anchors/starter/contracts.py": {
		sha256: "95549834c0fb108cd30de9b18bb69f307642fe181357ee08e9e112d0d7936349",
		byteLength: 916
	},
	"PG-CORE-Image-Anchors/starter/main.py": {
		sha256: "5995c2856fc9fc2e26d9af0ea97f2a5df35a88587e91e551b30a93516cbc5db5",
		byteLength: 565
	},
	"PG-CORE-Image-Anchors/starter/observations.md": {
		sha256: "56aacd3c4d65f4a219f13c45543c8ab185982f8cadb923a7bf2d2ae98ccb54a7",
		byteLength: 578
	},
	"PG-CORE-Image-Anchors/starter/images/alien.png": {
		sha256: "a435b65656cdecdebd8b2c5510092217995b4754d1afd4bc2fdbd583040c8263",
		byteLength: 2781
	},
	"PG-CORE-Image-Anchors/solution/images/alien.png": {
		sha256: "a435b65656cdecdebd8b2c5510092217995b4754d1afd4bc2fdbd583040c8263",
		byteLength: 2781
	}
};

export function pyGamesCoreUrl(
	pack: (typeof pyGamesCorePacks)[number]["pack"],
	role: "starter" | "solution"
) {
	return `https://github.com/instruction-material/PyGames/tree/${pyGamesCoreSourceRevision}/${pack}/${role}`;
}

export function pyGamesCoreResource(url: string) {
	const resource = parseGitHubResource(url);
	if (
		!resource ||
		resource.mode !== "tree" ||
		resource.owner.toLowerCase() !== "instruction-material" ||
		resource.repo.toLowerCase() !== "pygames" ||
		resource.ref !== pyGamesCoreSourceRevision
	) {
		return null;
	}
	const parts = resource.path.split("/");
	if (parts.length !== 2) return null;
	const selected = pyGamesCorePacks.find(pack => pack.pack === parts[0]);
	const role = parts[1];
	if (!selected || (role !== "starter" && role !== "solution")) return null;
	return { ...selected, resource, role };
}

export function pyGamesCoreImportFiles(url: string) {
	const selected = pyGamesCoreResource(url);
	if (!selected) return null;
	return [
		"main.py",
		selected.task,
		"contracts.py",
		"requirements.txt",
		"observations.md",
		"images/alien.png",
		"README.md"
	].map(name => {
		const path =
			name === "README.md"
				? `${selected.pack}/README.md`
				: `${selected.pack}/${selected.role}/${name}`;
		const expected = sourceFiles[path];
		if (!expected) throw new Error("The project file list is incomplete.");
		return {
			name,
			path,
			rawUrl: githubRawUrl(selected.resource, path),
			...expected,
			encoding: name.endsWith(".png")
				? ("base64" as const)
				: ("text" as const)
		};
	});
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

export async function loadPyGamesCoreFiles(
	url: string
): Promise<PythonIdeFile[] | null> {
	const selected = pyGamesCoreImportFiles(url);
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
				const signature = [137, 80, 78, 71, 13, 10, 26, 10];
				const header = new DataView(buffer);
				if (
					!signature.every((byte, index) => bytes[index] === byte) ||
					header.getUint32(16) !== 66 ||
					header.getUint32(20) !== 92
				) {
					throw new Error("The required project image is invalid.");
				}
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
