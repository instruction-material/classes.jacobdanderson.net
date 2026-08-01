import process from "node:process";
import { pathToFileURL } from "node:url";
import { smokeErrorMessage, smokeRequest } from "./http-smoke-client.mjs";
import { validateSecurityHeaders } from "./production-security-headers.mjs";

const origin = process.env.CLASSES_SITE_ORIGIN || "https://example.com";
const timeoutMs = Number(process.env.CLASSES_SITE_SMOKE_TIMEOUT_MS || 15000);
const smokePaths = ["/ide"];
const pageUrl = new URL(smokePaths[0], origin);
const GITHUB_REPOSITORY_URL_RE = /https:\/\/github\.com\/[\w.-]+\/[\w.-]+/g;
const BLUEJ_GREENFOOT_PATH = "/k-pet-group/BlueJ-Greenfoot";
export const productionIdeSmokeLimits = Object.freeze({
	maxAssetBytes: 8 * 1024 * 1024,
	maxHtmlBytes: 2 * 1024 * 1024,
	maxImportDepth: 8,
	maxJavaScriptAssets: 40,
	maxJavaScriptImportRequests: 32,
	maxPageAssetRequests: 48,
	maxTotalJavaScriptBytes: 32 * 1024 * 1024
});

export async function boundedResponseText(response, url, maxBytes) {
	const contentLength = Number(response.headers.get("content-length"));
	if (Number.isFinite(contentLength) && contentLength > maxBytes) {
		throw new Error(`${url} exceeded the ${maxBytes}-byte response limit`);
	}

	if (!response.body) {
		const source = await response.text();
		if (new TextEncoder().encode(source).byteLength > maxBytes) {
			throw new Error(`${url} exceeded the ${maxBytes}-byte response limit`);
		}
		return source;
	}

	const reader = response.body.getReader();
	const chunks = [];
	let totalBytes = 0;
	while (true) {
		const { done, value } = await reader.read();
		if (done) break;
		totalBytes += value.byteLength;
		if (totalBytes > maxBytes) {
			await reader.cancel();
			throw new Error(`${url} exceeded the ${maxBytes}-byte response limit`);
		}
		chunks.push(value);
	}

	const bytes = new Uint8Array(totalBytes);
	let offset = 0;
	for (const chunk of chunks) {
		bytes.set(chunk, offset);
		offset += chunk.byteLength;
	}
	return new TextDecoder().decode(bytes);
}

async function fetchText(
	url,
	maxBytes = productionIdeSmokeLimits.maxHtmlBytes
) {
	const response = await smokeRequest(url, {
		headers: {
			accept: "text/html,application/javascript,text/javascript,*/*"
		},
		timeoutMs
	});

	if (!response.ok) {
		throw new Error(`${url} returned HTTP ${response.status}`);
	}

	return await boundedResponseText(response, url, maxBytes);
}

export function pageAssetUrls(html, baseUrl = pageUrl) {
	const urls = new Set();
	const assetAttributeRE = /\b(?:href|src)="([^"]+)"/g;
	for (const match of html.matchAll(assetAttributeRE)) {
		const value = match[1];
		if (!value || !/\.(?:css|js)(?:$|\?)/.test(value)) continue;

		const url = new URL(value, baseUrl);
		if (url.origin !== baseUrl.origin) continue;
		urls.add(url.href);
	}

	return [...urls];
}

export function productionIdeSmokePageUrls(baseOrigin = origin) {
	return smokePaths.map(path => new URL(path, baseOrigin));
}

function isSameOriginJavaScriptAsset(url, originUrl) {
	return (
		url.origin === originUrl.origin
		&& url.pathname.startsWith("/assets/")
		&& url.pathname.endsWith(".js")
	);
}

export function sameOriginJavaScriptImportUrls(source, importerUrl) {
	const urls = new Set();
	const importPatterns = [
		/\bimport\s*\(\s*(["'`])([^"'`]+\.js(?:\?[^"'`]*)?)\1\s*\)/g,
		/\b(?:import|export)\b[^;"'`]+?\bfrom\s*(["'`])([^"'`]+\.js(?:\?[^"'`]*)?)\1/g,
		/\bimport\s*(["'`])([^"'`]+\.js(?:\?[^"'`]*)?)\1/g
	];

	for (const pattern of importPatterns) {
		for (const match of source.matchAll(pattern)) {
			let url;
			try {
				url = new URL(match[2], importerUrl);
			}
			catch {
				continue;
			}
			if (isSameOriginJavaScriptAsset(url, importerUrl)) {
				url.hash = "";
				urls.add(url.href);
			}
		}
	}
	return [...urls];
}

function assertPositiveInteger(value, name) {
	if (!Number.isSafeInteger(value) || value < 1) {
		throw new Error(`${name} must be a positive integer`);
	}
}

export async function discoverSameOriginJavaScriptImportGraph(
	initialAssets,
	fetchSource,
	overrides = {}
) {
	const limits = { ...productionIdeSmokeLimits, ...overrides };
	for (const name of [
		"maxAssetBytes",
		"maxImportDepth",
		"maxJavaScriptAssets",
		"maxJavaScriptImportRequests",
		"maxTotalJavaScriptBytes"
	]) {
		assertPositiveInteger(limits[name], name);
	}
	if (!initialAssets.length) {
		throw new Error("JavaScript import discovery requires an initial asset");
	}
	if (initialAssets.length > limits.maxJavaScriptAssets) {
		throw new Error("JavaScript import discovery exceeded its asset limit");
	}

	const originUrl = new URL(initialAssets[0].url);
	const queue = [];
	const seen = new Set();
	for (const asset of initialAssets) {
		const url = new URL(asset.url);
		if (!isSameOriginJavaScriptAsset(url, originUrl)) {
			throw new Error(`${url.href} is not a same-origin JavaScript asset`);
		}
		if (seen.has(url.href)) continue;
		seen.add(url.href);
		queue.push({ depth: 0, source: asset.source, url });
	}

	const assets = [];
	let importRequests = 0;
	let totalBytes = 0;
	for (let index = 0; index < queue.length; index += 1) {
		const queuedAsset = queue[index];
		let { source } = queuedAsset;
		if (source === undefined) {
			if (importRequests >= limits.maxJavaScriptImportRequests) {
				throw new Error("JavaScript import discovery exceeded its request limit");
			}
			importRequests += 1;
			source = await fetchSource(queuedAsset.url);
		}
		if (typeof source !== "string") {
			throw new TypeError(`${queuedAsset.url.href} did not return JavaScript text`);
		}

		const assetBytes = new TextEncoder().encode(source).byteLength;
		if (assetBytes > limits.maxAssetBytes) {
			throw new Error(`${queuedAsset.url.href} exceeded the JavaScript asset-size limit`);
		}
		totalBytes += assetBytes;
		if (totalBytes > limits.maxTotalJavaScriptBytes) {
			throw new Error("JavaScript import discovery exceeded its total-size limit");
		}
		assets.push({ source, url: queuedAsset.url.href });

		for (const importedUrl of sameOriginJavaScriptImportUrls(
			source,
			queuedAsset.url
		)) {
			if (seen.has(importedUrl)) continue;
			if (queuedAsset.depth >= limits.maxImportDepth) {
				throw new Error("JavaScript import discovery exceeded its depth limit");
			}
			if (seen.size >= limits.maxJavaScriptAssets) {
				throw new Error("JavaScript import discovery exceeded its asset limit");
			}
			seen.add(importedUrl);
			queue.push({
				depth: queuedAsset.depth + 1,
				source: undefined,
				url: new URL(importedUrl)
			});
		}
	}

	return assets;
}

export function containsJavaModeCopy(source) {
	return source.includes("Python or Java") || source.includes("Karel Java") || source.includes("runJavaIdeProject");
}

function containsBlueJGreenfootSourceUrl(source) {
	for (const match of source.matchAll(GITHUB_REPOSITORY_URL_RE)) {
		const parsed = new URL(match[0]);
		if (
			parsed.protocol === "https:"
			&& parsed.hostname === "github.com"
			&& parsed.pathname === BLUEJ_GREENFOOT_PATH
		) {
			return true;
		}
	}
	return false;
}

export function containsCurrentIdeBundleMarkers(source) {
	const hasKarelOverlayRuntime
		= source.includes("karel-robot--")
			&& source.includes(".karel-robot")
			&& source.includes(".karel-robot--north")
			&& source.includes("position:absolute")
			&& source.includes("transition:left .24s")
			&& source.includes("will-change:left, top, transform");

	return (
		source.includes("Code, run, and draw in Python or Java")
		&& source.includes("Workspace type")
		&& source.includes("Browser IDE")
		&& source.includes("BlueJ Java")
		&& source.includes("preview Java console programs or Karel robot")
		&& source.includes("BlueJ integration for desktop object-bench projects")
		&& source.includes("ZIP import")
		&& source.includes("package.bluej export")
		&& source.includes("Karel world ready")
		&& source.includes("BlueJ integration")
		&& source.includes("BlueJ Desktop Integration")
		&& source.includes("Class diagram preview")
		&& source.includes("Object bench class")
		&& source.includes("New BlueJ project")
		&& source.includes("Import BlueJ ZIP")
		&& source.includes("Download project ZIP")
		&& source.includes("Classroom projects")
		&& source.includes("Maze Explorer")
		&& source.includes("Triangle Motion Starter")
		&& source.includes("Download BlueJ ZIP")
		&& source.includes("Java preview skipped projects over")
		&& source.includes("total Java characters")
		&& hasKarelOverlayRuntime
		&& containsBlueJGreenfootSourceUrl(source)
	);
}

export function pythonIdeWorkerAssetUrls(source, pageUrl = new URL("/ide", origin)) {
	const urls = new Set();
	const workerAssetRE = /["'`](\/assets\/pythonIdePlainWorker-[\w-]+\.js(?:\?[^"'`]*)?)["'`]/g;
	for (const match of source.matchAll(workerAssetRE)) {
		const url = new URL(match[1], pageUrl);
		if (url.origin === pageUrl.origin) urls.add(url.href);
	}
	return [...urls];
}

export function containsPlainPythonWorkerMarkers(source) {
	return (
		source.includes("/home/pyodide/classes_project")
		&& source.includes("No more input values are available in the input panel.")
		&& source.includes("loadPackagesFromImports")
		&& source.includes("__classes_run_active_file")
		&& source.includes("pyodide.mjs")
	);
}

export function validatePlainPythonWorkerSecurityHeaders(headers, path) {
	return validateSecurityHeaders(headers, path, "python-worker");
}

async function assertProductionIdePage(pageUrl) {
	const html = await fetchText(
		pageUrl,
		productionIdeSmokeLimits.maxHtmlBytes
	);
	const assetUrls = pageAssetUrls(html, pageUrl);
	if (!assetUrls.length) {
		throw new Error(`${pageUrl.href} did not reference any same-origin JavaScript assets`);
	}
	if (assetUrls.length > productionIdeSmokeLimits.maxPageAssetRequests) {
		throw new Error(`${pageUrl.href} referenced too many initial assets`);
	}

	const assetSources = await Promise.all(
		assetUrls.map(async url => ({
			source: await fetchText(
				url,
				productionIdeSmokeLimits.maxAssetBytes
			),
			url
		}))
	);
	const ideAsset = assetSources.find(asset => asset.source.includes("Code, run, and draw in Python or Java"));
	const karelStyleAsset = assetSources.find(asset => asset.source.includes(".karel-robot"));
	if (!ideAsset) {
		throw new Error(`${pageUrl.href} did not reference the Code IDE bundle`);
	}

	const initialAssetSources = new Map(
		assetSources.map(asset => [asset.url, asset.source])
	);
	const ideImportGraph = await discoverSameOriginJavaScriptImportGraph(
		[ideAsset],
		async url =>
			initialAssetSources.get(url.href)
			?? await fetchText(
				url,
				productionIdeSmokeLimits.maxAssetBytes
			)
	);
	const allAssetSources = new Map(
		assetSources.map(asset => [asset.url, asset])
	);
	for (const asset of ideImportGraph) {
		allAssetSources.set(asset.url, asset);
	}
	const combinedAssetSource = [...allAssetSources.values()]
		.map(asset => asset.source)
		.join("\n");

	if (!containsJavaModeCopy(html) && !containsJavaModeCopy(combinedAssetSource)) {
		throw new Error(`${pageUrl.href} did not include Java mode copy in the HTML or referenced IDE bundle`);
	}

	if (!containsCurrentIdeBundleMarkers(combinedAssetSource)) {
		throw new Error(
			`${pageUrl.href} did not reference a current Code IDE bundle with Java and BlueJ runtime markers`
		);
	}

	const workerAssetUrls = pythonIdeWorkerAssetUrls(combinedAssetSource, pageUrl);
	if (workerAssetUrls.length !== 1) {
		throw new Error(`${pageUrl.href} did not reference exactly one hashed plain-Python worker asset`);
	}
	const workerUrl = new URL(workerAssetUrls[0]);
	const workerResponse = await smokeRequest(workerUrl, {
		headers: {
			accept: "application/javascript,text/javascript,*/*"
		},
		timeoutMs
	});
	if (!workerResponse.ok) {
		throw new Error(`${workerUrl.href} returned HTTP ${workerResponse.status}`);
	}
	validatePlainPythonWorkerSecurityHeaders(workerResponse.headers, workerUrl.pathname);
	const workerSource = await boundedResponseText(
		workerResponse,
		workerUrl,
		productionIdeSmokeLimits.maxAssetBytes
	);
	if (!containsPlainPythonWorkerMarkers(workerSource)) {
		throw new Error(`${workerUrl.href} was not the current plain-Python worker bundle`);
	}

	console.log(
		`OK: ${pageUrl.href} references ${ideAsset?.url ?? "IDE assets"} with current Code IDE Java/BlueJ markers${
			karelStyleAsset ? ` and ${karelStyleAsset.url} with Karel overlay styles` : ""
		} and ${workerUrl.href} with the exact Python-worker security profile`
	);
}

export async function runProductionIdeSmoke() {
	for (const smokePageUrl of productionIdeSmokePageUrls()) {
		await assertProductionIdePage(smokePageUrl);
	}
}

const invokedUrl = process.argv[1] ? pathToFileURL(process.argv[1]).href : "";
if (import.meta.url === invokedUrl) {
	runProductionIdeSmoke().catch((error) => {
		console.error(smokeErrorMessage(error));
		process.exitCode = 1;
	});
}
