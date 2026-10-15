import { spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";

const reader = vi.hoisted(() => ({ read: vi.fn() }));
vi.mock("../scripts/reviewed-asset-archive.mjs", () => ({
	readReviewedAssetArchiveFile: reader.read
}));
const directories: string[] = [];
afterEach(async () => {
	vi.unstubAllEnvs();
	vi.unstubAllGlobals();
	await Promise.all(
		directories
			.splice(0)
			.map(dir => rm(dir, { recursive: true, force: true }))
	);
});

function defaultEnvironment(directory: string) {
	return {
		CODE_IDE_ASSETS_FRONT_END_DIR: directory,
		CODE_IDE_ASSETS_ZIP_URL: "",
		CODE_IDE_ASSETS_REFRESH: "",
		CODE_IDE_ASSETS_DOWNLOAD: "",
		PYTHON_IDE_ASSETS_FRONT_END_DIR: "",
		PYTHON_IDE_ASSETS_ZIP_URL: "",
		PYTHON_IDE_ASSETS_REFRESH: "",
		PYTHON_IDE_ASSETS_DOWNLOAD: ""
	};
}

describe("reviewed bundled Code IDE assets", () => {
	it.each([false, true])(
		"stages a fresh real media pack offline with force refresh=%s",
		async forceRefresh => {
			const directory = await mkdtemp(
				join(tmpdir(), "classes-bundled-media-")
			);
			directories.push(directory);
			const marker = join(directory, "unexpected-network-request");
			const hook =
				'import { writeFileSync } from "node:fs"; globalThis.fetch = async () => { writeFileSync(process.env.CLASSES_ASSET_TEST_MARKER, "called"); throw new Error("Network access forbidden by the offline build test"); };';
			expect(existsSync(join(directory, ".cache"))).toBe(false);
			const result = spawnSync(
				process.execPath,
				[
					"--import",
					`data:text/javascript,${encodeURIComponent(hook)}`,
					resolve(
						__dirname,
						"../scripts/download-code-ide-assets.mjs"
					),
					...(forceRefresh ? ["--force"] : [])
				],
				{
					env: {
						...process.env,
						...defaultEnvironment(directory),
						CLASSES_ASSET_TEST_MARKER: marker
					},
					timeout: 20000,
					encoding: "utf8"
				}
			);
			expect(result.status, result.stderr).toBe(0);
			expect(result.stdout + result.stderr).toContain(
				"from the reviewed bundled archive"
			);
			expect(existsSync(marker)).toBe(forceRefresh);
			const content = readFileSync(
				join(directory, "public/ide/assets/manifest.json"),
				"utf8"
			);
			expect(content).toBe(
				readFileSync(
					join(directory, "public/python-ide/assets/manifest.json"),
					"utf8"
				)
			);
			const manifest = JSON.parse(content);
			expect(manifest.assets.length).toBeGreaterThan(100);
			expect(Object.keys(manifest).sort()).toEqual([
				"assets",
				"generatedAt",
				"version"
			]);
			for (const asset of manifest.assets) {
				expect(asset.name).toMatch(/^(?:images|music|sounds)\//);
				expect(
					existsSync(
						join(
							directory,
							"public",
							asset.url
								.split("/")
								.map(decodeURIComponent)
								.join("/")
						)
					)
				).toBe(true);
			}
			expect(
				existsSync(join(directory, "public/python-ide/assets.zip"))
			).toBe(false);
		}
	);

	it("fails before extraction when the bundled archive fails verification", async () => {
		vi.resetModules();
		const directory = await mkdtemp(
			join(tmpdir(), "classes-rejected-media-")
		);
		directories.push(directory);
		for (const [name, value] of Object.entries(
			defaultEnvironment(directory)
		)) {
			vi.stubEnv(name, value);
		}
		reader.read.mockRejectedValue(
			new Error("bundled asset pack failed SHA-256 verification")
		);
		const fetcher = vi.fn();
		vi.stubGlobal("fetch", fetcher);
		await expect(
			import("../scripts/download-code-ide-assets.mjs")
		).rejects.toThrow("failed SHA-256 verification");
		expect(fetcher).not.toHaveBeenCalled();
		expect(
			existsSync(join(directory, "public/ide/assets/manifest.json"))
		).toBe(false);
	});
});
