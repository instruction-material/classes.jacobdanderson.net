import { existsSync, readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const frontEndRoot = process.cwd();
const repositoryRoot = resolve(frontEndRoot, "..");
const publicSurfaceFiles = [
	resolve(frontEndRoot, "src/App.vue"),
	resolve(frontEndRoot, "src/components/TheFooter.vue"),
	resolve(frontEndRoot, "src/components/TheHeader.vue"),
	resolve(frontEndRoot, "src/modules/pageHead.ts"),
	...vueFilesUnder(resolve(frontEndRoot, "src/pages"))
];

function vueFilesUnder(directory: string): string[] {
	return readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
		if (entry.isDirectory()) {
			return vueFilesUnder(resolve(directory, entry.name));
		}
		if (!entry.isFile() || !entry.name.endsWith(".vue")) return [];
		return [resolve(directory, entry.name)];
	});
}

function source(file: string) {
	return readFileSync(file, "utf8");
}

describe("instruction-material fork neutrality", () => {
	it("does not expose an inherited instructor identity or payment destination", () => {
		const publicSurface = publicSurfaceFiles.map(source).join("\n");

		expect(publicSurface).not.toMatch(
			/Classes with Jacob|Jacob Anderson|jacoba1100254352|jacobdanderson\.s3|venmo\.com\/u\/|https:\/\/(?:[\w-]+\.)?zoom\.us\/(?:j|my)\/|https:\/\/docs\.google\.com\/spreadsheets\/d\/|Sophia's Wheel/i
		);
	});

	it("does not ship inherited Zelle QR-code images", () => {
		for (const filename of ["Zelle_Email.jpeg", "Zelle_Number.jpeg"]) {
			expect(
				existsSync(resolve(frontEndRoot, "src/assets/Images", filename))
			).toBe(false);
		}
	});

	it("does not ship personal-data-bearing design screenshots", () => {
		for (const filename of [
			"dark-mode-admin-infill-comparison.png",
			"dark-mode-admin-infill-fixed.png"
		]) {
			expect(
				existsSync(resolve(repositoryRoot, "docs/design-qa", filename))
			).toBe(false);
		}
	});
});
