import { createHash, webcrypto } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { unzipSync } from "fflate";
import { afterEach, expect, it, vi } from "vitest";
import { createProjectArchive } from "@/modules/projectArchive";
import {
	machineLearningImageImportFiles,
	machineLearningImagePacks,
	machineLearningImageSourceRevision,
	loadMachineLearningImageFiles
} from "@/modules/machineLearningImageResources";
import {
	clearLocalPythonProjects,
	createPythonIdeProject,
	loadLocalPythonProjects,
	loadPythonIdeStarterFilesFromGitHub,
	saveLocalPythonProjects
} from "@/modules/pythonIde";

const fixture = JSON.parse(
	readFileSync(
		resolve(
			process.cwd(),
			"../test/fixtures/machine-learning-offline-sources.json"
		),
		"utf8"
	)
) as {
	revision: string;
	files: Record<
		string,
		{
			content: string;
			encoding: "text" | "base64";
			sha256: string;
			byteLength: number;
		}
	>;
};
const roles = machineLearningImagePacks.flatMap(pack =>
	(["starter", "solution"] as const).map(role => ({ pack, role }))
);
const url = (pack: string, role: string) =>
	"https://github.com/instruction-material/AI-Level-2/tree/" +
	fixture.revision +
	"/" +
	pack +
	"/" +
	role;
function stubFiles(change?: (path: string, data: Uint8Array) => Response) {
	const fetcher = vi.fn(async (input: string | URL | Request) => {
		const request = new URL(String(input));
		expect(request.origin).toBe("https://raw.githubusercontent.com");
		const prefix =
			"/instruction-material/AI-Level-2/" + fixture.revision + "/";
		expect(request.pathname.startsWith(prefix)).toBe(true);
		const path = decodeURIComponent(request.pathname.slice(prefix.length));
		const f = fixture.files[path]!;
		const data = Uint8Array.from(
			Buffer.from(f.content, f.encoding === "base64" ? "base64" : "utf8")
		);
		return change ? change(path, data) : new Response(data);
	});
	vi.stubGlobal("crypto", webcrypto);
	vi.stubGlobal("fetch", fetcher);
	return fetcher;
}
afterEach(() => {
	vi.unstubAllGlobals();
	clearLocalPythonProjects();
});
it.each(roles)(
	"imports every pinned PNG and source file for $pack/$role",
	async ({ pack, role }) => {
		expect(machineLearningImageSourceRevision).toBe(fixture.revision);
		const fetcher = stubFiles();
		const files = await loadPythonIdeStarterFilesFromGitHub(
			url(pack, role),
			"data"
		);
		expect(fetcher).toHaveBeenCalledTimes(36);
		expect(files).toHaveLength(36);
		expect(files.filter(f => f.encoding === "base64")).toHaveLength(32);
		const project = createPythonIdeProject("data", {
			title: "Weather source import",
			files
		});
		saveLocalPythonProjects([project]);
		const saved = loadLocalPythonProjects()[0]!;
		expect(saved.files).toEqual(files);
		const archive = unzipSync(createProjectArchive(saved));
		for (const f of files) {
			const expected = fixture.files[pack + "/" + role + "/" + f.name]!;
			const raw = Buffer.from(
				f.content,
				f.encoding === "base64" ? "base64" : "utf8"
			);
			expect(createHash("sha256").update(raw).digest("hex")).toBe(
				expected.sha256
			);
			const exported = archive[project.title + "/" + f.name]!;
			expect(createHash("sha256").update(exported).digest("hex")).toBe(
				expected.sha256
			);
			expect(exported.byteLength).toBe(expected.byteLength);
		}
	}
);
it.each(["truncated", "oversized", "changed", "missing"])(
	"refuses a %s PNG instead of importing a partial project",
	async change => {
		stubFiles((path, data) => {
			if (!path.endsWith(".png")) return new Response(data);
			if (change === "missing")
				return new Response(null, { status: 404 });
			if (change === "truncated") return new Response(data.slice(0, -1));
			if (change === "oversized")
				return new Response(new Uint8Array(data.length + 1));
			data[data.length - 1] ^= 1;
			return new Response(data);
		});
		await expect(
			loadMachineLearningImageFiles(
				url(machineLearningImagePacks[0]!, "starter")
			)
		).rejects.toThrow();
	}
);
it("rejects changed model source before returning a project", async () => {
	stubFiles((path, data) => {
		if (path.endsWith("model.py")) data[0] ^= 1;
		return new Response(data);
	});
	await expect(
		loadMachineLearningImageFiles(
			url(machineLearningImagePacks[0]!, "starter")
		)
	).rejects.toThrow("selected version");
});
it.each(["main", "34d579fe9f033e1944e3569ed32c1fb7635162b5"])(
	"leaves unverified revision %s outside this pinned loader",
	async revision => {
		const fetcher = stubFiles();
		const link = url(machineLearningImagePacks[0]!, "starter").replace(
			fixture.revision,
			revision
		);
		expect(machineLearningImageImportFiles(link)).toBeNull();
		expect(await loadMachineLearningImageFiles(link)).toBeNull();
		expect(fetcher).not.toHaveBeenCalled();
	}
);
