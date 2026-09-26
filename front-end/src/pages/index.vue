<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { serializeJsonLd } from "@/modules/serializeJsonLd";
import { useContentStore } from "@/stores/content";

defineOptions({ name: "HomePage" });

const content = useContentStore();
const siteUrl = import.meta.env.VITE_SITE_URL || "https://example.com";
const { faqs, highlights, subjectGroups } = storeToRefs(content);
const faqStructuredData = computed(() => ({
	"@context": "https://schema.org",
	"@type": "FAQPage",
	mainEntity: faqs.value.map(faq => ({
		"@type": "Question",
		acceptedAnswer: {
			"@type": "Answer",
			text: faq.answer
		},
		name: faq.question
	}))
}));
const courseStructuredData = computed(() =>
	subjectGroups.value.map(group => ({
		"@context": "https://schema.org",
		"@type": "Course",
		description: `Course materials covering ${group.subjects.join(", ")}.`,
		name: `${group.title} courses`,
		provider: {
			"@type": "Organization",
			name: "Instruction Material",
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
				{
					innerHTML: serializeJsonLd(faqStructuredData.value),
					key: "classes-home-faq-jsonld",
					type: "application/ld+json"
				},
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
				<p class="page-eyebrow">
					Reusable course materials and teaching tools
				</p>
				<h1 id="hero-title" class="page-title">Course Platform</h1>
				<p class="page-copy">
					Browse structured courses, use the browser IDE and Graph
					Sketcher, and adapt the supporting teaching workflows for
					your own classroom or instruction program.
				</p>
				<ul class="hero-proof">
					<li class="site-chip">Structured course paths</li>
					<li class="site-chip">Browser programming tools</li>
					<li class="site-chip">Instructor workflows</li>
				</ul>
			</div>
			<figure class="media-frame home-hero__media">
				<img
					alt="Student and tutor collaborating on a laptop"
					class="hero-image"
					fetchpriority="high"
					height="900"
					loading="eager"
					src="https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?auto=format&fit=crop&w=1200&q=80"
					width="1200"
				/>
			</figure>
		</section>

		<section
			aria-label="Primary actions"
			class="site-action-row home-actions"
		>
			<RouterLink class="site-button site-button--primary" to="/courses">
				View Courses
			</RouterLink>
			<RouterLink
				class="site-button site-button--secondary"
				to="/graph-sketcher"
			>
				Open Graph Sketcher
			</RouterLink>
		</section>

		<section aria-labelledby="subjects-title" class="home-section">
			<div class="section-heading">
				<h2 id="subjects-title" class="section-title">
					Course Subjects
				</h2>
				<p class="section-intro">
					The catalog spans first programming projects through AP CS,
					algorithms, systems, web, apps, data, security, math,
					science, and language study.
				</p>
			</div>
			<div class="subject-grid">
				<article
					v-for="group in subjectGroups"
					:key="group.title"
					class="site-surface site-surface--soft subject-card"
				>
					<h3>{{ group.title }}</h3>
					<ul>
						<li v-for="subject in group.subjects" :key="subject">
							{{ subject }}
						</li>
					</ul>
				</article>
			</div>
		</section>

		<section aria-labelledby="highlights-title" class="home-section">
			<div class="section-heading">
				<h2 id="highlights-title" class="section-title">Sessions</h2>
			</div>
			<div class="highlight-grid">
				<article
					v-for="highlight in highlights"
					:key="highlight.title"
					class="site-surface site-surface--soft highlight-card"
				>
					<h3>{{ highlight.title }}</h3>
					<p>{{ highlight.copy }}</p>
				</article>
			</div>
		</section>

		<section aria-labelledby="next-steps-title" class="home-section">
			<div class="site-surface next-steps-card">
				<h2 id="next-steps-title" class="section-title">
					Adapt the Platform
				</h2>
				<p class="section-intro">
					Start with the courses and browser tools, then configure the
					optional account, scheduling, and instructor workflows for
					your own deployment.
				</p>
				<div class="site-action-row">
					<a
						class="site-button site-button--primary"
						href="https://github.com/instruction-material/classes.jacobdanderson.net#readme"
						rel="noopener noreferrer"
						target="_blank"
					>
						Read Setup Notes<span class="sr-only">
							(opens in a new tab)</span
						>
					</a>
					<RouterLink
						class="site-button site-button--secondary"
						to="/pathways"
					>
						View Course Pathways
					</RouterLink>
				</div>
			</div>
		</section>
	</section>
</template>

<style scoped>
.home-page {
	gap: clamp(2.5rem, 6vw, 4.75rem);
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

.hero-proof {
	list-style: none;
	padding: 0;
	margin: 0;
	display: flex;
	flex-wrap: wrap;
	gap: 0.7rem;
}

.home-actions {
	justify-content: flex-start;
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

.subject-grid,
.highlight-grid {
	display: grid;
	gap: 1rem 1.2rem;
	grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
}

.subject-card,
.highlight-card {
	padding: 1.35rem 1.4rem;
	display: grid;
	gap: 0.75rem;
	align-content: start;
}

.subject-card h3,
.highlight-card h3 {
	font-size: 1.12rem;
}

.subject-card ul {
	list-style: none;
	padding: 0;
	margin: 0;
	display: grid;
	gap: 0.55rem;
}

.subject-card li,
.highlight-card p {
	color: var(--color-ink-soft);
	line-height: 1.65;
}

.next-steps-card {
	max-width: 52rem;
	margin-inline: auto;
	padding: clamp(1.5rem, 3vw, 2.2rem);
	display: grid;
	gap: 1rem 1.25rem;
}

@media (max-width: 900px) {
	.home-hero {
		grid-template-columns: 1fr;
	}

	.hero-text {
		max-width: none;
	}
}

@media (max-width: 640px) {
	.home-hero__media {
		aspect-ratio: 4 / 3;
	}
}
</style>

<route lang="yaml">
meta:
    layout: default
</route>
