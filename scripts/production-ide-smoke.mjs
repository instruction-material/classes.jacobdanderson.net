import { pathToFileURL } from "node:url";

const origin = process.env.CLASSES_SITE_ORIGIN || "https://example.com";
const timeoutMs = Number(process.env.CLASSES_SITE_SMOKE_TIMEOUT_MS || 15000);
const smokePaths = ["/ide"];
const pageUrl = new URL(smokePaths[0], origin);

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

export function containsJavaModeCopy(source) {
	return source.includes("Python or Java") || source.includes("Karel Java") || source.includes("runJavaIdeProject");
}

export function containsCurrentIdeBundleMarkers(source) {
	const hasKarelOverlayRuntime =
		source.includes("karel-robot--") &&
		source.includes(".karel-robot") &&
		source.includes(".karel-robot--north") &&
		source.includes("position:absolute") &&
		source.includes("transition:left .24s") &&
		source.includes("will-change:left, top, transform");

	return (
		source.includes("Code, run, and draw in Python or Java") &&
		source.includes("Workspace type") &&
		source.includes("Browser IDE") &&
		source.includes("BlueJ Java") &&
		source.includes("preview Java console programs or Karel robot") &&
		source.includes("BlueJ integration for desktop object-bench projects") &&
		source.includes("ZIP import") &&
		source.includes("package.bluej export") &&
		source.includes("Karel world ready") &&
		source.includes("BlueJ integration") &&
		source.includes("BlueJ Desktop Integration") &&
		source.includes("Class diagram preview") &&
		source.includes("Object bench class") &&
		source.includes("New BlueJ project") &&
		source.includes("Import BlueJ ZIP") &&
		source.includes("Download project ZIP") &&
		source.includes("Classroom projects") &&
		source.includes("Maze Explorer") &&
		source.includes("Triangle Motion Starter") &&
		source.includes("Download BlueJ ZIP") &&
		source.includes("Java preview skipped projects over") &&
		source.includes("total Java characters") &&
		hasKarelOverlayRuntime &&
		source.includes("https://github.com/k-pet-group/BlueJ-Greenfoot")
	);
}

async function assertProductionIdePage(pageUrl) {
	const html = await fetchText(pageUrl);
	const assetUrls = pageAssetUrls(html, pageUrl);
	if (!assetUrls.length) {
		throw new Error(`${pageUrl.href} did not reference any same-origin JavaScript assets`);
	}

	const assetSources = await Promise.all(
		assetUrls.map(async url => ({
			source: await fetchText(url),
			url
		}))
	);
	const combinedAssetSource = assetSources.map(asset => asset.source).join("\n");
	const ideAsset = assetSources.find(asset => asset.source.includes("Code, run, and draw in Python or Java"));
	const karelStyleAsset = assetSources.find(asset => asset.source.includes(".karel-robot"));

	if (!containsJavaModeCopy(html) && !containsJavaModeCopy(combinedAssetSource)) {
		throw new Error(`${pageUrl.href} did not include Java mode copy in the HTML or referenced IDE bundle`);
	}

	if (!containsCurrentIdeBundleMarkers(combinedAssetSource)) {
		throw new Error(
			`${pageUrl.href} did not reference a current Code IDE bundle with Java and BlueJ runtime markers`
		);
	}

	console.log(
		`OK: ${pageUrl.href} references ${ideAsset?.url ?? "IDE assets"} with current Code IDE Java/BlueJ markers` +
			(karelStyleAsset ? ` and ${karelStyleAsset.url} with Karel overlay styles` : "")
	);
}

export async function runProductionIdeSmoke() {
	for (const smokePageUrl of productionIdeSmokePageUrls()) {
		await assertProductionIdePage(smokePageUrl);
	}
}

const invokedUrl = process.argv[1] ? pathToFileURL(process.argv[1]).href : "";
if (import.meta.url === invokedUrl) {
	runProductionIdeSmoke().catch(error => {
		console.error(error instanceof Error ? error.message : error);
		process.exitCode = 1;
	});
}
