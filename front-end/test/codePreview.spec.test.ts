import { flushPromises, mount } from "@vue/test-utils";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import CodePreview from "@/components/CodePreview.vue";
import {
	githubRawUrl,
	listGitHubProjectFiles,
	listPreviewFiles,
	loadGitHubProjectFile,
	loadPreviewFile,
	parseGitHubResource,
	resetCodePreviewCaches
} from "@/modules/codePreview";

function jsonResponse(body: unknown) {
	return new Response(JSON.stringify(body), {
		status: 200,
		headers: { "content-type": "application/json" }
	});
}

function textResponse(body: string) {
	return new Response(body, {
		status: 200,
		headers: { "content-type": "text/plain" }
	});
}

describe("code preview GitHub helpers", () => {
	beforeEach(() => {
		resetCodePreviewCaches();
	});

	afterEach(() => {
		resetCodePreviewCaches();
		vi.restoreAllMocks();
	});

	it("parses GitHub blob links and creates raw file URLs", () => {
		const resource = parseGitHubResource(
			"https://github.com/instruction-material/APCS/blob/main/APCS1-Mad-Libs/starter/Main.java"
		);

		expect(resource).toMatchObject({
			mode: "blob",
			owner: "instruction-material",
			repo: "APCS",
			ref: "main",
			path: "APCS1-Mad-Libs/starter/Main.java"
		});
		expect(resource && githubRawUrl(resource)).toBe(
			"https://raw.githubusercontent.com/instruction-material/APCS/main/APCS1-Mad-Libs/starter/Main.java"
		);
	});

	it("lists likely code files from folder links and caches directory/file fetches", async () => {
		const fetcher = vi.fn(async (url: string | URL | Request) => {
			const requestUrl = String(url);

			if (requestUrl.includes("/contents/APCS1-Mad-Libs/starter?")) {
				return jsonResponse([
					{
						download_url:
							"https://raw.githubusercontent.com/instruction-material/APCS/main/APCS1-Mad-Libs/starter/Main.java",
						html_url:
							"https://github.com/instruction-material/APCS/blob/main/APCS1-Mad-Libs/starter/Main.java",
						name: "Main.java",
						path: "APCS1-Mad-Libs/starter/Main.java",
						size: 42,
						type: "file"
					},
					{
						download_url:
							"https://raw.githubusercontent.com/instruction-material/APCS/main/APCS1-Mad-Libs/starter/package-lock.json",
						html_url:
							"https://github.com/instruction-material/APCS/blob/main/APCS1-Mad-Libs/starter/package-lock.json",
						name: "package-lock.json",
						path: "APCS1-Mad-Libs/starter/package-lock.json",
						size: 40,
						type: "file"
					},
					{
						download_url:
							"https://raw.githubusercontent.com/instruction-material/APCS/main/APCS1-Mad-Libs/starter/logo.png",
						html_url:
							"https://github.com/instruction-material/APCS/blob/main/APCS1-Mad-Libs/starter/logo.png",
						name: "logo.png",
						path: "APCS1-Mad-Libs/starter/logo.png",
						size: 30,
						type: "file"
					},
					{
						download_url: null,
						html_url:
							"https://github.com/instruction-material/APCS/tree/main/APCS1-Mad-Libs/starter/src",
						name: "src",
						path: "APCS1-Mad-Libs/starter/src",
						size: 0,
						type: "dir"
					}
				]);
			}

			if (requestUrl.includes("/contents/APCS1-Mad-Libs/starter/src?")) {
				return jsonResponse([
					{
						download_url:
							"https://raw.githubusercontent.com/instruction-material/APCS/main/APCS1-Mad-Libs/starter/src/Helper.java",
						html_url:
							"https://github.com/instruction-material/APCS/blob/main/APCS1-Mad-Libs/starter/src/Helper.java",
						name: "Helper.java",
						path: "APCS1-Mad-Libs/starter/src/Helper.java",
						size: 36,
						type: "file"
					}
				]);
			}

			if (requestUrl.endsWith("/Main.java")) {
				return textResponse("public class Main {}");
			}

			return new Response("missing", { status: 404 });
		}) as typeof fetch;

		const files = await listPreviewFiles(
			"https://github.com/instruction-material/APCS/tree/main/APCS1-Mad-Libs/starter",
			fetcher
		);
		const cachedFiles = await listPreviewFiles(
			"https://github.com/instruction-material/APCS/tree/main/APCS1-Mad-Libs/starter",
			fetcher
		);

		expect(files.map(file => file.path)).toEqual([
			"APCS1-Mad-Libs/starter/Main.java",
			"APCS1-Mad-Libs/starter/src/Helper.java"
		]);
		expect(cachedFiles).toBe(files);
		expect(fetcher).toHaveBeenCalledTimes(2);

		const preview = await loadPreviewFile(files[0]!, fetcher);
		const cachedPreview = await loadPreviewFile(files[0]!, fetcher);

		expect(preview.content).toBe("public class Main {}");
		expect(cachedPreview).toBe(preview);
		expect(fetcher).toHaveBeenCalledTimes(3);
	});

	it("imports complete source without reusing a cut-off preview", async () => {
		const [file] = await listGitHubProjectFiles(
			"https://github.com/example/course/blob/main/starter/main.py"
		);
		const source = `${"# source\n".repeat(10000)}print("last line")\n`;
		const fetcher = vi.fn(async () => textResponse(source));
		const preview = await loadPreviewFile(file!, fetcher);
		expect(preview.truncated).toBe(true);
		expect(preview.content).not.toContain("last line");
		const imported = await loadGitHubProjectFile(file!, fetcher);
		expect(imported.truncated).toBe(false);
		expect(imported.content).toBe(source);
		expect(fetcher).toHaveBeenCalledTimes(2);
	});

	it("checks the actual UTF-8 byte limit when a response has no length header", async () => {
		const [file] = await listGitHubProjectFiles(
			"https://github.com/example/course/blob/main/main.py"
		);
		await expect(
			loadGitHubProjectFile(file!, async () =>
				textResponse("é".repeat(500001))
			)
		).rejects.toThrow("too large");
	});

	it("rejects incomplete file lists even when a partial preview is cached", async () => {
		const url = "https://github.com/example/course/tree/main/starter";
		const makeFiles = (count: number) =>
			Array.from({ length: count }, (_, index) => ({
				type: "file",
				name: `file${index}.py`,
				path: `starter/file${index}.py`,
				size: 1,
				html_url: `https://github.com/example/course/blob/main/starter/file${index}.py`,
				download_url: null
			}));
		const fetcher = vi.fn(async () => jsonResponse(makeFiles(81)));
		expect(await listPreviewFiles(url, fetcher)).toHaveLength(80);
		await expect(listGitHubProjectFiles(url, fetcher)).rejects.toThrow(
			"file limit"
		);
		expect(fetcher).toHaveBeenCalledTimes(2);
		fetcher.mockImplementation(async () => jsonResponse(makeFiles(80)));
		expect(await listGitHubProjectFiles(url, fetcher)).toHaveLength(80);
	});

	it("does not skip oversize source while importing a folder", async () => {
		await expect(
			listGitHubProjectFiles(
				"https://github.com/example/course/tree/main/starter",
				async () =>
					jsonResponse([
						{
							type: "file",
							name: "main.py",
							path: "starter/main.py",
							size: 1000001
						}
					])
			)
		).rejects.toThrow("too large: starter/main.py");
	});

	it("rejects folders beyond the supported import depth", async () => {
		const fetcher = vi.fn(async (url: string | URL | Request) => {
			const path = new URL(String(url)).pathname.split("/contents/")[1];
			return jsonResponse([
				{ type: "dir", name: "nested", path: `${path}/nested` }
			]);
		});
		await expect(
			listGitHubProjectFiles(
				"https://github.com/example/course/tree/main/starter",
				fetcher
			)
		).rejects.toThrow("folder depth limit");
		expect(fetcher).toHaveBeenCalledTimes(4);
	});
});

describe("CodePreview.vue", () => {
	beforeEach(() => {
		resetCodePreviewCaches();
	});

	afterEach(() => {
		resetCodePreviewCaches();
		vi.unstubAllGlobals();
	});

	it("loads an escaped read-only preview only after the user opens it", async () => {
		const fetchMock = vi.fn(async (url: string | URL | Request) => {
			const requestUrl = String(url);

			if (requestUrl.includes("/contents/APCS1-Mad-Libs/starter?")) {
				return jsonResponse([
					{
						download_url:
							"https://raw.githubusercontent.com/instruction-material/APCS/main/APCS1-Mad-Libs/starter/Main.java",
						html_url:
							"https://github.com/instruction-material/APCS/blob/main/APCS1-Mad-Libs/starter/Main.java",
						name: "Main.java",
						path: "APCS1-Mad-Libs/starter/Main.java",
						size: 52,
						type: "file"
					}
				]);
			}

			if (requestUrl.endsWith("/Main.java")) {
				return textResponse("<script>alert('xss')</script>");
			}

			return new Response("missing", { status: 404 });
		});
		vi.stubGlobal("fetch", fetchMock);

		const wrapper = mount(CodePreview, {
			props: {
				resources: [
					{
						host: "github.com",
						kind: "project",
						label: "Starter project",
						url: "https://github.com/instruction-material/APCS/tree/main/APCS1-Mad-Libs/starter"
					}
				]
			}
		});

		expect(wrapper.text()).toContain("Preview starter code");
		expect(fetchMock).not.toHaveBeenCalled();

		await wrapper.find("button").trigger("click");
		await flushPromises();

		expect(fetchMock).toHaveBeenCalledTimes(2);
		expect(wrapper.text()).toContain("<script>alert('xss')</script>");
		expect(wrapper.find("script").exists()).toBe(false);
		expect(wrapper.find(".code-preview-open-link").text()).toContain(
			"Open on GitHub"
		);
	});
});
