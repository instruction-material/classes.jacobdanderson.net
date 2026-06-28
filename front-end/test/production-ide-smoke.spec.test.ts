import { describe, expect, it } from "vitest";
import {
	containsCurrentIdeBundleMarkers,
	containsJavaModeCopy,
	pageAssetUrls,
	productionIdeSmokePageUrls
} from "../../scripts/production-ide-smoke.mjs";

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
	});
});
