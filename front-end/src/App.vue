<script lang="ts" setup>
import { pageTitleForPath } from "@/modules/pageHead";

// https://github.com/vueuse/head
// you can use this to manipulate the document head in any components,
// they will be rendered correctly in the HTML results with vite-ssg
const siteUrl = import.meta.env.VITE_SITE_URL || "https://example.com";
const siteDescription =
	"A reusable course catalog, browser IDE, graphing workspace, and supporting tools for instruction.";
const route = useRoute();
const noindexMatchers = [
	/^\/admin(?:\/|$)/,
	/^\/bluej(?:\/|$)/,
	/^\/profile(?:\/|$)/,
	/^\/ide(?:\/|$)/,
	/^\/python-ide(?:\/|$)/,
	/^\/api(?:\/|$)/
];
const canonicalUrl = computed(() =>
	new URL(route.path || "/", `${siteUrl}/`).toString()
);
const pageTitle = computed(() => pageTitleForPath(route.path || "/"));
const robotsContent = computed(() =>
	noindexMatchers.some(matcher => matcher.test(route.path))
		? "noindex,nofollow"
		: "index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1"
);
const structuredData = computed(() => [
	{
		"@context": "https://schema.org",
		"@type": "EducationalOrganization",
		description: siteDescription,
		name: "Classes",
		url: siteUrl
	},
	{
		"@context": "https://schema.org",
		"@type": "WebSite",
		description: siteDescription,
		name: "Classes",
		url: siteUrl
	}
]);

useHead(
	() =>
		({
			title: pageTitle.value,
			meta: [
				{
					name: "description",
					content: siteDescription
				},
				{
					property: "og:title",
					content: "Classes"
				},
				{
					property: "og:description",
					content: siteDescription
				},
				{
					property: "og:type",
					content: "website"
				},
				{
					property: "og:url",
					content: canonicalUrl.value
				},
				{
					name: "twitter:card",
					content: "summary"
				},
				{
					name: "twitter:title",
					content: "Classes"
				},
				{
					name: "twitter:description",
					content: siteDescription
				},
				{
					name: "robots",
					content: robotsContent.value
				},
				{
					name: "theme-color",
					content: isDark.value ? "#07111f" : "#3158e8"
				}
			],
			link: [
				{
					rel: "icon",
					type: "image/svg+xml",
					href: "/favicon.svg"
				},
				{
					rel: "icon",
					type: "image/png",
					sizes: "32x32",
					href: "/favicon-32x32.png"
				},
				{
					rel: "icon",
					type: "image/png",
					sizes: "16x16",
					href: "/favicon-16x16.png"
				},
				{
					rel: "apple-touch-icon",
					sizes: "180x180",
					href: "/apple-touch-icon.png"
				},
				{
					rel: "manifest",
					href: "/site.webmanifest"
				},
				{
					rel: "canonical",
					href: canonicalUrl.value
				}
			],
			script: [
				...structuredData.value.map((entry, index) => ({
					innerHTML: JSON.stringify(entry),
					key: `ld-json-${index}`,
					type: "application/ld+json"
				}))
			]
		}) as any
);
</script>

<template>
	<RouterView />
</template>

<style></style>
