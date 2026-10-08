<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { serializeJsonLd } from "@/modules/serializeJsonLd";
import { useContentStore } from "@/stores/content";

defineOptions({ name: "HomePage" });

const content = useContentStore();
const siteUrl = import.meta.env.VITE_SITE_URL || "https://example.com";
const { subjectGroups } = storeToRefs(content);
const courseStructuredData = computed(() =>
	subjectGroups.value.map(group => ({
		"@context": "https://schema.org",
		"@type": "Course",
		description: `Course materials covering ${group.subjects.join(", ")}.`,
		name: `${group.title} courses`,
		provider: {
			"@type": "Organization",
			name: "Classes",
			url: siteUrl
		}
	}))
);

useHead(
	() =>
		({
			link: [
				{
					href: `${siteUrl}/`,
					rel: "canonical"
				}
			],
			script: [
				...courseStructuredData.value.map((entry, index) => ({
					innerHTML: serializeJsonLd(entry),
					key: `classes-home-course-${index}`,
					type: "application/ld+json"
				}))
			]
		}) as any
);
</script>

<template>
	<section class="page-shell page-shell--wide home-page">
		<section aria-labelledby="hero-title" class="page-hero home-hero">
			<div class="hero-text">
				<h1 id="hero-title" class="page-title">Course Platform</h1>
				<p class="page-copy">
					Explore courses and projects independently or with an
					instructor. Open programming and graphing tools to practice.
				</p>
			</div>
			<figure class="media-frame home-hero__media">
				<img
					alt="Graduates celebrating with graduation caps"
					class="hero-image"
					fetchpriority="high"
					height="900"
					loading="eager"
					src="https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?auto=format&fit=crop&w=1200&q=80"
					width="1200"
				/>
			</figure>
		</section>

		<section aria-labelledby="subjects-title" class="home-section">
			<div class="home-section__heading">
				<div class="section-heading">
					<h2 id="subjects-title" class="section-title">
						Subjects and Course Paths
					</h2>
					<p class="section-intro">
						Start something new or get help with the work already in
						front of you.
					</p>
				</div>
				<RouterLink
					class="site-button site-button--secondary pathway-action"
					to="/pathways"
				>
					Course Pathways
				</RouterLink>
			</div>
			<div class="home-subjects">
				<article
					v-for="group in subjectGroups"
					:key="group.title"
					class="home-subject"
				>
					<h3>{{ group.title }}</h3>
					<p>{{ group.description }}</p>
					<ul :aria-label="`${group.title} subjects`">
						<li v-for="subject in group.subjects" :key="subject">
							{{ subject }}
						</li>
					</ul>
				</article>
			</div>
		</section>

		<section
			aria-labelledby="session-title"
			class="home-section home-session"
		>
			<div class="section-heading">
				<h2 id="session-title" class="section-title">
					How to use the platform
				</h2>
				<p class="section-intro">
					Choose a course, work through its projects and use the tools
					to put new concepts into practice.
				</p>
			</div>
			<ol class="home-session__steps">
				<li>
					<h3>Choose a starting point</h3>
					<p>
						Bring an assignment or explore a course path. Follow the
						lessons that fit what you want to learn.
					</p>
				</li>
				<li>
					<h3>Build and experiment</h3>
					<p>
						Work through projects in the IDE or try mathematical
						ideas in Graphing. Test changes and explain your
						reasoning.
					</p>
				</li>
				<li>
					<h3>Choose your next steps</h3>
					<p>
						Use supplemental projects for more practice or extension
						challenges. Keep a copy of your work to build on next
						time.
					</p>
				</li>
			</ol>
		</section>
	</section>
</template>

<style scoped>
.home-page {
	gap: clamp(2.5rem, 5vw, 4rem);
	padding-bottom: 2rem;
}

.home-hero {
	grid-template-columns: minmax(0, 1.02fr) minmax(18rem, 0.95fr);
	align-items: center;
}

.hero-text {
	display: grid;
	gap: 1.25rem;
	max-width: 38rem;
}

.home-hero__media {
	aspect-ratio: 5 / 4;
}

.hero-image {
	width: 100%;
	height: 100%;
	object-fit: cover;
}

.home-section {
	display: grid;
	gap: 1.35rem;
}

.section-heading {
	display: grid;
	gap: 0.8rem;
	max-width: 44rem;
}

.home-section__heading {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 1rem 2rem;
	flex-wrap: wrap;
}

.pathway-action {
	flex-shrink: 0;
}

.home-subjects {
	display: grid;
	grid-template-columns: repeat(4, minmax(0, 1fr));
	gap: 1.75rem;
}

.home-subject {
	display: grid;
	align-content: start;
	gap: 0.65rem;
	padding-top: 1.25rem;
	border-top: 2px solid var(--color-border-strong);
}

.home-subject h3,
.home-session h3 {
	font: 700 1.05rem / 1.4 var(--font-sans);
}

.home-subject p,
.home-session__steps p {
	margin: 0;
	color: var(--color-ink-soft);
	line-height: 1.65;
}

.home-subject ul {
	display: flex;
	flex-wrap: wrap;
	gap: 0.35rem 0.85rem;
	margin: 0.35rem 0 0;
	padding: 0;
	list-style: none;
	font-size: 0.9rem;
	color: var(--color-ink-soft);
}

.home-session {
	padding-top: 2rem;
	border-top: 1px solid var(--color-border);
}

.home-session__steps {
	display: grid;
	grid-template-columns: repeat(3, minmax(0, 1fr));
	gap: 1.5rem 2rem;
	margin: 0;
	padding-left: 1.5rem;
}

.home-session__steps li {
	padding-left: 0.35rem;
}

.home-session__steps li::marker {
	color: var(--color-accent);
	font-weight: 700;
}

.home-session__steps h3 {
	margin-bottom: 0.5rem;
}

@media (max-width: 900px) {
	.home-hero {
		grid-template-columns: 1fr;
	}

	.hero-text {
		max-width: none;
	}

	.home-subjects {
		grid-template-columns: repeat(2, minmax(0, 1fr));
	}
}

@media (max-width: 640px) {
	.home-hero__media {
		aspect-ratio: 4 / 3;
	}

	.home-subjects,
	.home-session__steps {
		grid-template-columns: 1fr;
	}
}
</style>

<route lang="yaml">
meta:
    layout: default
</route>
