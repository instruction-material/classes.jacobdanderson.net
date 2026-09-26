import { describe, expect, it } from "vitest";
import {
	boundedResponseText,
	containsCurrentIdeBundleMarkers,
	containsJavaModeCopy,
	containsPlainPythonWorkerMarkers,
	discoverSameOriginJavaScriptImportGraph,
	pageAssetUrls,
	pythonIdeWorkerAssetUrls,
	productionIdeSmokePageUrls,
	sameOriginJavaScriptImportUrls,
	validatePlainPythonWorkerSecurityHeaders
} from "../../scripts/production-ide-smoke.mjs";
import {
	exactSecurityHeaders,
	serializeContentSecurityPolicy
} from "../../scripts/production-security-headers.mjs";

describe("production Code IDE smoke helpers", () => {
	it("checks the single generalized IDE entry route", () => {
		expect(
			productionIdeSmokePageUrls(
				"https://example.com"
			).map(url => url.pathname)
		).toEqual(["/ide"]);
	});

	it("extracts same-origin JavaScript and CSS assets from the IDE page HTML", () => {
		const baseUrl = new URL("https://example.com/ide");
		const html = [
			'<link rel="stylesheet" href="/assets/app.css">',
			'<script type="module" src="/assets/CodeIdeWorkspace-a1b2.js"></script>',
			'<script src="https://example.com/assets/app-c3d4.js"></script>',
			'<link rel="stylesheet" href="https://example.com/assets/CodeIdeWorkspace-e5f6.css">',
			'<script src="https://cdn.example.test/external.js"></script>'
		].join("");

		expect(pageAssetUrls(html, baseUrl)).toEqual([
			"https://example.com/assets/app.css",
			"https://example.com/assets/CodeIdeWorkspace-a1b2.js",
			"https://example.com/assets/app-c3d4.js",
			"https://example.com/assets/CodeIdeWorkspace-e5f6.css"
		]);
	});

	it("requires current Code IDE bundle markers, not generic Java course copy", () => {
		const genericJavaCourseAsset =
			"Java Level 1 mentions Karel Java and a BlueJ Java Project.";
		const currentIdeBundle = [
			"Code, run, and draw in Python or Java",
			"Workspace type",
			"Browser IDE",
			"BlueJ Java",
			"preview Java console programs or Karel robot",
			"BlueJ integration for desktop object-bench projects",
			"ZIP import",
			"package.bluej export",
			"Karel world ready",
			"BlueJ integration",
			"BlueJ Desktop Integration",
			"Class diagram preview",
			"Object bench class",
			"New BlueJ project",
			"Import BlueJ ZIP",
			"Download project ZIP",
			"Classroom projects",
			"Maze Explorer",
			"Triangle Motion Starter",
			"Download BlueJ ZIP",
			"Java preview skipped projects over",
			"total Java characters",
			"karel-robot--",
			".karel-robot",
			".karel-robot--north",
			"position:absolute",
			"transition:left .24s",
			"will-change:left, top, transform",
			"https://github.com/k-pet-group/BlueJ-Greenfoot"
		].join("\n");

		expect(containsJavaModeCopy(genericJavaCourseAsset)).toBe(true);
		expect(containsCurrentIdeBundleMarkers(genericJavaCourseAsset)).toBe(
			false
		);
		expect(containsCurrentIdeBundleMarkers(currentIdeBundle)).toBe(true);
		expect(
			containsCurrentIdeBundleMarkers(
				currentIdeBundle.replace(
					"https://github.com/k-pet-group/BlueJ-Greenfoot",
					"https://github.com.evil.example/k-pet-group/BlueJ-Greenfoot"
				)
			)
		).toBe(false);
	});

	it("extracts and deduplicates only same-origin hashed plain-Python worker assets", () => {
		const baseUrl = new URL("https://example.com/ide");
		const source = [
			'new URL("/assets/pythonIdePlainWorker-a1_B2.js", import.meta.url)',
			'new URL("/assets/pythonIdePlainWorker-a1_B2.js", import.meta.url)',
			'new URL("/assets/pythonIdePlainWorker-c3-d4.js?worker", import.meta.url)',
			'new URL("https://evil.example/pythonIdePlainWorker-e5f6.js")',
			'new URL("/assets/pythonIdePlainWorker.js", import.meta.url)',
			'new URL("/assets/otherWorker-g7h8.js", import.meta.url)'
		].join("\n");

		expect(pythonIdeWorkerAssetUrls(source, baseUrl)).toEqual([
			"https://example.com/assets/pythonIdePlainWorker-a1_B2.js",
			"https://example.com/assets/pythonIdePlainWorker-c3-d4.js?worker"
		]);
	});

	it("follows the real IDE runtime boundary once through cycles and duplicate imports", async () => {
		const entryUrl =
			"https://example.com/assets/CodeIdeWorkspace-a1.js";
		const runtimeLoaderUrl =
			"https://example.com/assets/pythonIdeRuntime-b2.js";
		const runtimeUrl =
			"https://example.com/assets/python-ide-runtime-c3.js";
		const sharedUrl =
			"https://example.com/assets/shared-d4.js";
		const sources = new Map<string, string>([
			[
				entryUrl,
				[
					'const loadPython = () => import("./pythonIdeRuntime-b2.js");',
					'import "./shared-d4.js";'
				].join("\n")
			],
			[
				runtimeLoaderUrl,
				'import{run}from"./python-ide-runtime-c3.js";export{shared}from"./shared-d4.js";'
			],
			[
				runtimeUrl,
				[
					'import "./shared-d4.js";',
					'import "./CodeIdeWorkspace-a1.js";',
					'new Worker(new URL(`/assets/pythonIdePlainWorker-e5F6.js`, `` + import.meta.url), { type: "module" });'
				].join("\n")
			],
			[sharedUrl, 'import "./pythonIdeRuntime-b2.js";']
		]);
		const requests: string[] = [];

		const assets = await discoverSameOriginJavaScriptImportGraph(
			[{ source: sources.get(entryUrl)!, url: entryUrl }],
			async url => {
				requests.push(url.href);
				return sources.get(url.href)!;
			}
		);

		expect(requests).toEqual([runtimeLoaderUrl, sharedUrl, runtimeUrl]);
		expect(assets.map(asset => asset.url)).toEqual([
			entryUrl,
			runtimeLoaderUrl,
			sharedUrl,
			runtimeUrl
		]);
		expect(
			pythonIdeWorkerAssetUrls(
				assets.map(asset => asset.source).join("\n"),
				new URL("https://example.com/ide")
			)
		).toEqual([
			"https://example.com/assets/pythonIdePlainWorker-e5F6.js"
		]);
	});

	it("ignores cross-origin and non-asset JavaScript imports", () => {
		const importer = new URL(
			"https://example.com/assets/CodeIdeWorkspace-a1.js"
		);
		const source = [
			'import("./pythonIdeRuntime-b2.js")',
			'import("https://evil.example/assets/escape-c3.js")',
			'import("http://[invalid].js")',
			'import("/other/not-an-asset-d4.js")',
			'import("./not-javascript.css")'
		].join("\n");

		expect(sameOriginJavaScriptImportUrls(source, importer)).toEqual([
			"https://example.com/assets/pythonIdeRuntime-b2.js"
		]);
	});

	it("enforces the worker response-body size limit", async () => {
		const workerUrl = new URL(
			"https://example.com/assets/pythonIdePlainWorker-a1B2.js"
		);

		await expect(
			boundedResponseText(new Response("12345"), workerUrl, 4)
		).rejects.toThrow("response limit");
		await expect(
			boundedResponseText(new Response("1234"), workerUrl, 4)
		).resolves.toBe("1234");
	});

	it("enforces recursive JavaScript request and size bounds", async () => {
		const entryUrl =
			"https://example.com/assets/CodeIdeWorkspace-a1.js";
		const source = [
			'import("./pythonIdeRuntime-b2.js")',
			'import("./shared-c3.js")'
		].join("\n");
		const requests: string[] = [];

		await expect(
			discoverSameOriginJavaScriptImportGraph(
				[{ source, url: entryUrl }],
				async url => {
					requests.push(url.href);
					return "export {};";
				},
				{ maxJavaScriptImportRequests: 1 }
			)
		).rejects.toThrow("request limit");
		expect(requests).toEqual([
			"https://example.com/assets/pythonIdeRuntime-b2.js"
		]);

		await expect(
			discoverSameOriginJavaScriptImportGraph(
				[{ source: "12345", url: entryUrl }],
				async () => "",
				{ maxAssetBytes: 4 }
			)
		).rejects.toThrow("asset-size limit");
		await expect(
			discoverSameOriginJavaScriptImportGraph(
				[{ source: "12345", url: entryUrl }],
				async () => "",
				{ maxAssetBytes: 10, maxTotalJavaScriptBytes: 4 }
			)
		).rejects.toThrow("total-size limit");
	});

	it("requires the current plain-Python worker runtime markers", () => {
		const currentWorker = [
			"/home/pyodide/classes_project",
			"No more input values are available in the input panel.",
			"loadPackagesFromImports",
			"__classes_run_active_file",
			"pyodide.mjs"
		].join("\n");

		expect(containsPlainPythonWorkerMarkers(currentWorker)).toBe(true);
		expect(
			containsPlainPythonWorkerMarkers(
				currentWorker.replace("loadPackagesFromImports", "loadPackage")
			)
		).toBe(false);
	});

	it("uses the exact Python-worker response security profile", () => {
		const values = new Map<string, string>([
			[
				"content-security-policy",
				serializeContentSecurityPolicy("python-worker")
			],
			...Object.entries(exactSecurityHeaders)
		]);
		const headers = { get: (name: string) => values.get(name) ?? null };
		const workerPath = "/assets/pythonIdePlainWorker-a1B2.js";

		expect(
			validatePlainPythonWorkerSecurityHeaders(headers, workerPath)
		).toBe(true);

		values.set(
			"content-security-policy",
			serializeContentSecurityPolicy("standard")
		);
		expect(() =>
			validatePlainPythonWorkerSecurityHeaders(headers, workerPath)
		).toThrow("python-worker Content-Security-Policy");
	});
});
