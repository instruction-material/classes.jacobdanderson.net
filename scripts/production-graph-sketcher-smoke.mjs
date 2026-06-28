import { pathToFileURL } from "node:url";

const origin =
	process.env.CLASSES_SITE_ORIGIN || "https://example.com";
const timeoutMs = Number(
	process.env.CLASSES_SITE_SMOKE_TIMEOUT_MS || 15000
);
const smokePath = "/graph-sketcher";

async function fetchText(url) {
	const controller = new AbortController();
	const timeout = setTimeout(() => controller.abort(), timeoutMs);

	try {
		const response = await fetch(url, {
			headers: {
				accept: "text/html,application/javascript,text/javascript,*/*"
			},
			signal: controller.signal
		});
		if (!response.ok) {
			throw new Error(`${url} returned HTTP ${response.status}`);
		}
		return await response.text();
	} finally {
		clearTimeout(timeout);
	}
}

export function graphSketcherSmokePageUrl(baseOrigin = origin) {
	return new URL(smokePath, baseOrigin);
}

export function pageAssetUrls(html, pageUrl = graphSketcherSmokePageUrl()) {
	const urls = new Set();
	const assetAttributeRE = /\b(?:href|src)="([^"]+)"/g;
	for (const match of html.matchAll(assetAttributeRE)) {
		const value = match[1];
		if (!value || !/\.(?:css|js)(?:$|\?)/.test(value)) continue;
		const url = new URL(value, pageUrl);
		if (url.origin === pageUrl.origin) urls.add(url.href);
	}
	return [...urls];
}

export function containsGraphSketcherRuntimeMarkers(source) {
	return (
		source.includes("Graph Sketcher") &&
		source.includes("Math workspace") &&
		source.includes("Download project") &&
		source.includes("Plot function") &&
		source.includes(".graphsketch") &&
		source.includes(".ograph") &&
		source.includes("classes-graph-sketcher-document-v1") &&
		source.includes("All rendering, imports, and") &&
		source.includes("exports run in this browser.") &&
		source.includes(
			"https://github.com/Jacoba1100254352/GraphSketcher.Linux"
		)
	);
}

export async function runProductionGraphSketcherSmoke() {
	const pageUrl = graphSketcherSmokePageUrl();
	const html = await fetchText(pageUrl);
	const assetUrls = pageAssetUrls(html, pageUrl);
	if (!assetUrls.length) {
		throw new Error(
			`${pageUrl.href} did not reference any same-origin JavaScript or CSS assets`
		);
	}

	const assetSources = [];
	for (const url of assetUrls) {
		assetSources.push({
			source: await fetchText(url),
			url
		});
	}
	const combinedSource = [
		html,
		...assetSources.map(asset => asset.source)
	].join("\n");
	if (!containsGraphSketcherRuntimeMarkers(combinedSource)) {
		throw new Error(
			`${pageUrl.href} did not reference the current client-side Graph Sketcher bundle`
		);
	}
	const runtimeAsset = assetSources.find(asset =>
		asset.source.includes("classes-graph-sketcher-document-v1")
	);
	console.log(
		`OK: ${pageUrl.href} references ${runtimeAsset?.url ?? "the current Graph Sketcher assets"}`
	);
}

const invokedUrl = process.argv[1] ? pathToFileURL(process.argv[1]).href : "";
if (import.meta.url === invokedUrl) {
	runProductionGraphSketcherSmoke().catch(error => {
		console.error(error instanceof Error ? error.message : error);
		process.exitCode = 1;
	});
}
