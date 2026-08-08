export const SITE_URL = "https://classes.jacobdanderson.net";

export const SITEMAP_EXCLUDED_ROUTES = [
	"/404",
	"/README",
	"/admin",
	"/admin/mdmail",
	"/admin/people",
	"/admin/student-management",
	"/bluej",
	"/coding_standard",
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
