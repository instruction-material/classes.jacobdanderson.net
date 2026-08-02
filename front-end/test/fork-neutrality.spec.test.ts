import { existsSync, readdirSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const frontEndRoot = process.cwd();
const repositoryRoot = resolve(frontEndRoot, "..");
const publicSurfaceFiles = [
	resolve(frontEndRoot, "scripts/static-route-policy.mts"),
	resolve(frontEndRoot, "src/App.vue"),
	resolve(frontEndRoot, "src/components/TheFooter.vue"),
	resolve(frontEndRoot, "src/components/TheHeader.vue"),
	resolve(frontEndRoot, "src/modules/pageHead.ts"),
	...vueFilesUnder(resolve(frontEndRoot, "src/pages"))
];
const nativeDeploymentFiles = [
	resolve(repositoryRoot, ".github/workflows/ci.yml"),
	resolve(repositoryRoot, "README.md"),
	resolve(repositoryRoot, "package.json"),
	resolve(repositoryRoot, "docs/native-production-deployment.md"),
	resolve(repositoryRoot, "scripts/prepare-native-release.sh"),
	resolve(repositoryRoot, "scripts/promote-native-release.sh"),
	resolve(repositoryRoot, "scripts/verify-native-release.mjs"),
	resolve(repositoryRoot, "scripts/verify-native-source.sh"),
	resolve(repositoryRoot, "test/native-nginx-fixture.mjs"),
	resolve(repositoryRoot, "test/native-production-deployment.test.mjs"),
	...regularFilesUnder(resolve(repositoryRoot, "deploy/native")),
	...regularFilesUnder(resolve(repositoryRoot, "test/fixtures/native-nginx"))
];
const deploymentSecurityFiles = [
	resolve(repositoryRoot, "netlify.toml"),
	resolve(repositoryRoot, "scripts/production-security-headers.mjs"),
	resolve(repositoryRoot, "scripts/production-security-headers-smoke.mjs"),
	...nativeDeploymentFiles
];

function regularFilesUnder(directory: string): string[] {
	return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
		if (entry.isDirectory()) {
			return regularFilesUnder(resolve(directory, entry.name));
		}
		if (!entry.isFile()) return [];
		return [resolve(directory, entry.name)];
	});
}

function vueFilesUnder(directory: string): string[] {
	return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
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
		expect(publicSurface).not.toContain("/__central-analytics/");
	});

	it("keeps deployment security defaults neutral and asset access shared", () => {
		const deploymentSecuritySurface = deploymentSecurityFiles
			.map(source)
			.join("\n");

		expect(deploymentSecuritySurface).not.toMatch(
			/https:\/\/classes\.jacobdanderson\.net|scheduler\.classes\.jacobdanderson\.net|jacobdanderson\.s3/i
		);
		expect(deploymentSecuritySurface).not.toContain(
			"/__central-analytics/"
		);
		expect(deploymentSecuritySurface).not.toContain(
			"https://docs.google.com"
		);
		expect(deploymentSecuritySurface).toContain(
			"https://scheduler.example.com"
		);
		expect(deploymentSecuritySurface).toContain(
			"https://static.classes.jacobdanderson.net"
		);
	});

	it("keeps every native deployment artifact fork-neutral", () => {
		const nativeDeploymentSurface = nativeDeploymentFiles
			.map(source)
			.join("\n");
		const withoutAllowedSharedReferences = nativeDeploymentSurface
			.replaceAll("static.classes.jacobdanderson.net", "")
			.replaceAll("instruction-material/classes.jacobdanderson.net", "");

		expect(withoutAllowedSharedReferences).not.toContain(
			"classes.jacobdanderson.net"
		);
		for (const forbidden of [
			/anderson-webops/i,
			/jacobdanderson\.s3/i,
			/scheduler\.classes\.jacobdanderson\.net/i,
			/Classes with Jacob|Jacob Anderson/i,
			/includeSubDomains/i,
			/\/__central-analytics\//i
		]) {
			expect(nativeDeploymentSurface).not.toMatch(forbidden);
		}
		expect(nativeDeploymentSurface).toContain("classes.example.com");
		expect(nativeDeploymentSurface).toContain("/srv/classes.example.com");
		expect(nativeDeploymentSurface).toContain("/etc/classes.example.com");
		expect(nativeDeploymentSurface).toContain(
			"instruction-material/classes.jacobdanderson.net"
		);
		expect(nativeDeploymentSurface).toContain(
			"https://scheduler.example.com"
		);
		expect(nativeDeploymentSurface).toContain(
			"https://static.classes.jacobdanderson.net"
		);
	});

	it("links setup notes to the fork documentation", () => {
		const homePage = source(resolve(frontEndRoot, "src/pages/index.vue"));

		expect(homePage).toContain(
			"https://github.com/instruction-material/classes.jacobdanderson.net#readme"
		);
		expect(homePage).not.toContain("to=\"/README\"");
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

	it("does not assume control of every downstream subdomain", () => {
		const deploymentSecuritySurface = deploymentSecurityFiles
			.map(source)
			.join("\n");

		expect(deploymentSecuritySurface).toContain(
			"Strict-Transport-Security = \"max-age=31536000\""
		);
		expect(deploymentSecuritySurface).not.toContain("includeSubDomains");
	});
});
