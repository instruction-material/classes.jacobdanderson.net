import { createHash, webcrypto } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { unzipSync } from "fflate";
import { afterEach, expect, it, vi } from "vitest";
import { createProjectArchive } from "@/modules/projectArchive";
import {
	loadPyGamesCoreFiles,
	pyGamesCoreImportFiles,
	pyGamesCorePacks,
	pyGamesCoreResource,
	pyGamesCoreSourceRevision
} from "@/modules/pyGamesCoreProjectResources";
import {
	clearLocalPythonProjects,
	createPythonIdeProject,
	loadLocalPythonProjects,
	saveLocalPythonProjects
} from "@/modules/pythonIde";

const fixture = JSON.parse(
	readFileSync(
		resolve(
			process.cwd(),
			"../test/fixtures/pygames-core-verified-source.json"
		),
		"utf8"
	)
) as {
	revision: string;
	files: Record<
		string,
		{ contentBase64: string; sha256: string; byteLength: number }
	>;
};
const roles = pyGamesCorePacks.flatMap(pack =>
	(["starter", "solution"] as const).map(role => ({ ...pack, role }))
);

function url(pack: string, role: string) {
	return `https://github.com/instruction-material/PyGames/tree/${fixture.revision}/${pack}/${role}`;
}

function bytes(path: string) {
	return Uint8Array.from(
		Buffer.from(fixture.files[path]!.contentBase64, "base64")
	);
}

function stubFiles(change?: (path: string, body: Uint8Array) => Response) {
	const fetcher = vi.fn(async (input: string | URL | Request) => {
		const path = new URL(String(input)).pathname;
		const prefix = `/instruction-material/PyGames/${fixture.revision}/`;
		expect(path.startsWith(prefix)).toBe(true);
		const name = decodeURIComponent(path.slice(prefix.length));
		const body = bytes(name);
		return change ? change(name, body) : new Response(body);
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
	"imports and preserves complete $pack/$role bytes",
	async entry => {
		expect(fixture.revision).toBe(pyGamesCoreSourceRevision);
		const fetcher = stubFiles();
		const selected = pyGamesCoreImportFiles(url(entry.pack, entry.role))!;
		const files = (await loadPyGamesCoreFiles(
			url(entry.pack, entry.role)
		))!;
		expect(files.map(file => file.name)).toEqual([
			"main.py",
			entry.task,
			"contracts.py",
			"requirements.txt",
			"observations.md",
			"images/alien.png",
			"README.md"
		]);
		expect(fetcher).toHaveBeenCalledTimes(7);
		for (const [index, file] of files.entries()) {
			const data = Buffer.from(
				file.content,
				file.encoding === "base64" ? "base64" : "utf8"
			);
			expect(createHash("sha256").update(data).digest("hex")).toBe(
				selected[index]!.sha256
			);
			expect(data.byteLength).toBe(selected[index]!.byteLength);
		}
		const project = createPythonIdeProject("pgzero", { files });
		saveLocalPythonProjects([project]);
		const reopened = loadLocalPythonProjects()[0]!;
		expect(reopened.files).toEqual(files);
		const archive = unzipSync(createProjectArchive(reopened));
		for (const [index, file] of files.entries()) {
			const data = archive[`${project.title}/${file.name}`]!;
			expect(createHash("sha256").update(data).digest("hex")).toBe(
				selected[index]!.sha256
			);
		}
	}
);

it.each(["main", "abc7a6c6cb9bc991b37ca6eb239f3d418185b09f"])(
	"leaves unrecognized source revision %s outside the verified loader",
	async revision => {
		const fetcher = stubFiles();
		const link = url(pyGamesCorePacks[0].pack, "starter").replace(
			fixture.revision,
			revision
		);
		expect(pyGamesCoreResource(link)).toBeNull();
		expect(await loadPyGamesCoreFiles(link)).toBeNull();
		expect(fetcher).not.toHaveBeenCalled();
	}
);

it.each(["truncated", "oversized", "changed", "missing"])(
	"refuses a %s PNG without returning a partial project",
	async change => {
		stubFiles((path, body) => {
			if (!path.endsWith(".png")) return new Response(body);
			if (change === "missing")
				return new Response(null, { status: 404 });
			if (change === "truncated") return new Response(body.slice(0, -1));
			if (change === "oversized") {
				const oversized = new Uint8Array(body.length + 1);
				oversized.set(body);
				return new Response(oversized);
			}
			body[body.length - 1] ^= 1;
			return new Response(body);
		});
		await expect(
			loadPyGamesCoreFiles(url(pyGamesCorePacks[0].pack, "starter"))
		).rejects.toThrow();
	}
);

it("rejects changed source as well as changed assets", async () => {
	stubFiles((path, body) => {
		if (path.endsWith("main.py")) body[0] ^= 1;
		return new Response(body);
	});
	await expect(
		loadPyGamesCoreFiles(url(pyGamesCorePacks[0].pack, "starter"))
	).rejects.toThrow("selected version");
});
