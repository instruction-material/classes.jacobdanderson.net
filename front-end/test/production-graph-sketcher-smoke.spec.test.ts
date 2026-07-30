import { describe, expect, it } from "vitest";
import {
	containsGraphSketcherRuntimeMarkers,
	graphSketcherSmokePageUrl,
	pageAssetUrls
} from "../../scripts/production-graph-sketcher-smoke.mjs";

describe("production Graph Sketcher smoke helpers", () => {
	it("checks the public Graph Sketcher route", () => {
		expect(
			graphSketcherSmokePageUrl(
				"https://example.com"
			).pathname
		).toBe("/graph-sketcher");
	});

	it("extracts only same-origin JavaScript and CSS assets", () => {
		const pageUrl = new URL(
			"https://example.com/graph-sketcher"
		);
		const html = [
			'<link rel="stylesheet" href="/assets/app.css">',
			'<script type="module" src="/assets/GraphSketcherWorkspace-a1.js"></script>',
			'<script src="https://cdn.example.test/external.js"></script>'
		].join("");

		expect(pageAssetUrls(html, pageUrl)).toEqual([
			"https://example.com/assets/app.css",
			"https://example.com/assets/GraphSketcherWorkspace-a1.js"
		]);
	});

	it("requires the current client-only editor markers", () => {
		const currentRuntime = [
			"Graph Sketcher",
			"Math workspace",
			"Download project",
			"Plot function",
			".graphsketch",
			".ograph",
			"classes-graph-sketcher-document-v1",
			"All rendering, imports, and",
			"exports run in this browser.",
			"https://github.com/Jacoba1100254352/GraphSketcher.Linux"
		].join("\n");

		expect(containsGraphSketcherRuntimeMarkers("Graph Sketcher")).toBe(false);
		expect(containsGraphSketcherRuntimeMarkers(currentRuntime)).toBe(true);
	});
});
