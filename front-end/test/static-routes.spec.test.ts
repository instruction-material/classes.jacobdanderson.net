import {
	mkdir,
	mkdtemp,
	readFile,
	rm,
	stat,
	writeFile
} from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import {
	SITEMAP_EXCLUDED_ROUTES,
	SITE_URL,
	generateProductionSitemap,
	sitemapOptions
} from "../scripts/sitemap.mts";
import {
	FRIENDLY_NOT_FOUND_ROUTE,
	FRIENDLY_NOT_FOUND_TITLE,
	includedStaticRoutes,
	renderFriendlyNotFoundHead
} from "../scripts/static-route-policy.mts";

const tempDirs: string[] = [];
const frontEndRoot = process.cwd();
const repositoryRoot = join(frontEndRoot, "..");

describe("static route normalization", () => {
	afterEach(async () => {
		await Promise.all(
			tempDirs
				.splice(0)
				.map(tempDir => rm(tempDir, { recursive: true, force: true }))
		);
	});

	it("creates nested index files for clean static URLs", async () => {
		const tempDir = await mkdtemp(join(tmpdir(), "classes-routes-"));
		tempDirs.push(tempDir);
		const { normalizeStaticRoutes } =
			(await import("../scripts/normalize-static-routes.mjs")) as {
				normalizeStaticRoutes: (targetDistDir: string) => Promise<void>;
			};

		await writeFile(join(tempDir, "index.html"), "<main>Home</main>");
		await writeFile(
			join(tempDir, "course-resource.html"),
			"<main>Course Resource</main>"
		);
		await writeFile(join(tempDir, "about.html"), "<main>About</main>");
		await writeFile(
			join(tempDir, "404.html"),
			"<main>Page not found</main>"
		);
		await mkdir(join(tempDir, "admin"), { recursive: true });
		await writeFile(
			join(tempDir, "admin", "student-management.html"),
			"<main>Student management</main>"
		);
		await mkdir(join(tempDir, "course-assets"), { recursive: true });
		await writeFile(
			join(tempDir, "course-assets", "example.html"),
			"<main>Static course asset</main>"
		);

		await normalizeStaticRoutes(tempDir);
		await normalizeStaticRoutes(tempDir);

		await expect(
			readFile(join(tempDir, "course-resource", "index.html"), "utf8")
		).resolves.toBe("<main>Course Resource</main>");
		await expect(
			readFile(join(tempDir, "about", "index.html"), "utf8")
		).resolves.toBe("<main>About</main>");
		await expect(readFile(join(tempDir, "404.html"), "utf8")).resolves.toBe(
			"<main>Page not found</main>"
		);
		await expect(
			readFile(
				join(tempDir, "admin", "student-management", "index.html"),
				"utf8"
			)
		).resolves.toBe("<main>Student management</main>");
		await expect(
			stat(join(tempDir, "index", "index.html"))
		).rejects.toThrow();
		await expect(
			stat(join(tempDir, "404", "index.html"))
		).rejects.toThrow();
		await expect(
			stat(
				join(
					tempDir,
					"admin",
					"student-management",
					"index",
					"index.html"
				)
			)
		).rejects.toThrow();
		await expect(
			stat(join(tempDir, "course-assets", "example", "index.html"))
		).rejects.toThrow();
	});

	it("renders concrete routes plus the friendly not-found artifact", () => {
		expect(
			includedStaticRoutes([
				"/",
				"/courses",
				"/courses",
				"/:all(.*)*",
				"/courses/:courseID"
			])
		).toEqual(["/", "/courses", FRIENDLY_NOT_FOUND_ROUTE]);
	});

	it("writes a noindex title and robots policy into the rendered 404 document", () => {
		const document = [
			"<!doctype html><html><head>",
			"<title>Classes</title>",
			'<meta content="index,follow" name="robots">',
			"</head><body>Page not found</body></html>"
		].join("");
		const rendered404 = renderFriendlyNotFoundHead(
			FRIENDLY_NOT_FOUND_ROUTE,
			document
		);

		expect(rendered404).toContain(
			`<title>${FRIENDLY_NOT_FOUND_TITLE}</title>`
		);
		expect(rendered404).toContain(
			'<meta content="noindex,nofollow" name="robots">'
		);
		expect(rendered404).not.toContain("index,follow");
		expect(renderFriendlyNotFoundHead("/courses", document)).toBe(document);
	});

	it("keeps the friendly 404 private from indexing and serves it through Netlify", async () => {
		const [notFoundPage, netlifyConfig] = await Promise.all([
			readFile(join(frontEndRoot, "src/pages/[...all].vue"), "utf8"),
			readFile(join(repositoryRoot, "netlify.toml"), "utf8")
		]);

		expect(notFoundPage).toContain('name: "robots"');
		expect(notFoundPage).toContain('content: "noindex,nofollow"');
		expect(netlifyConfig.trimEnd()).toMatch(
			/\[\[redirects\]\]\nfrom = "\/\*"\nto = "\/404[.]html"\nstatus = 404\nforce = false$/u
		);
	});

	it("configures the production sitemap without localhost or private routes", () => {
		const options = sitemapOptions();
		const calls: unknown[] = [];

		generateProductionSitemap(options => calls.push(options));

		expect(options.hostname).toBe(SITE_URL);
		expect(options.hostname).toBe("https://example.com");
		expect(options.hostname).not.toContain("localhost");
		expect(options.generateRobotsTxt).toBe(false);
		expect(options.exclude).toEqual(SITEMAP_EXCLUDED_ROUTES);
		expect(options.exclude).toEqual(
			expect.arrayContaining([
				"/404",
				"/admin",
				"/admin/mdmail",
				"/admin/people",
				"/admin/student-management",
				"/bluej",
				"/course-resource",
				"/ide",
				"/profile",
				"/python-ide",
				"/README"
			])
		);
		expect(options.exclude).not.toContain("/graph-sketcher");
		expect(calls).toEqual([options]);
	});
});
