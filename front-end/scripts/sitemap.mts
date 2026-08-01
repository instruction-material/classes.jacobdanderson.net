export const SITE_URL = process.env.VITE_SITE_URL || "https://example.com";

export const SITEMAP_EXCLUDED_ROUTES = [
	"/README",
	"/admin",
	"/admin/mdmail",
	"/admin/people",
	"/admin/student-management",
	"/bluej",
	"/course-resource",
	"/ide",
	"/profile",
	"/python-ide",
	"/wheel"
];

type SitemapOptions = {
	exclude: string[];
	generateRobotsTxt: boolean;
	hostname: string;
};

type GenerateSitemap = (options: SitemapOptions) => void;

export function sitemapOptions(): SitemapOptions {
	return {
		exclude: SITEMAP_EXCLUDED_ROUTES,
		generateRobotsTxt: false,
		hostname: SITE_URL
	};
}

export function generateProductionSitemap(generateSitemap: GenerateSitemap) {
	generateSitemap(sitemapOptions());
}
