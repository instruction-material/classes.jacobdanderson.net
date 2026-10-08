<script lang="ts" setup>
import WorkspaceDisclosure from "@/components/WorkspaceDisclosure.vue";
import { serializeJsonLd } from "@/modules/serializeJsonLd";
import { useContentStore } from "@/stores/content";

defineOptions({ name: "AboutPage" });
const content = useContentStore();
useHead(() => ({
	script: [
		{
			type: "application/ld+json",
			key: "classes-about-faq",
			innerHTML: serializeJsonLd({
				"@context": "https://schema.org",
				"@type": "FAQPage",
				mainEntity: content.faqs.map(faq => ({
					"@type": "Question",
					name: faq.question,
					acceptedAnswer: { "@type": "Answer", text: faq.answer }
				}))
			})
		}
	]
}));
</script>

<template>
	<section class="page-shell about-page">
		<section aria-labelledby="intro-title" class="about-intro">
			<div class="copy">
				<h1 id="intro-title" class="page-title">
					Courses and Teaching Tools
				</h1>
				<p class="page-copy">
					Explore structured courses, practice with linked projects
					and use programming or graphing tools. Materials support
					independent study, classroom teaching and instructor-led
					sessions.
				</p>
			</div>
		</section>

		<section aria-labelledby="approach-title" class="about-section">
			<h2 id="approach-title" class="section-title">How we work</h2>
			<div class="fit-grid">
				<article>
					<h3>Bring the work</h3>
					<p>
						Start with your assignment, project, bug or skill goal.
					</p>
				</article>
				<article>
					<h3>Think it through</h3>
					<p>
						Explain your choices, test ideas and build
						understanding.
					</p>
				</article>
				<article>
					<h3>Know what’s next</h3>
					<p>Record what was learned and choose a clear next step.</p>
				</article>
			</div>
		</section>

		<section aria-labelledby="faq-title" class="about-faq">
			<h2 id="faq-title" class="section-title">FAQ</h2>
			<WorkspaceDisclosure
				v-for="faq in content.faqs"
				:key="faq.question"
			>
				<template #label>{{ faq.question }}</template>
				<p>{{ faq.answer }}</p>
			</WorkspaceDisclosure>
		</section>

		<section aria-label="About page actions" class="site-action-row">
			<RouterLink class="text-link" to="/pathways">
				View Course Pathways
			</RouterLink>
		</section>
	</section>
</template>

<style scoped>
.about-page {
	max-width: 58rem;
	gap: 1.75rem;
}
.about-intro {
	display: grid;
	grid-template-columns: minmax(0, 1fr);
	align-items: start;
	gap: 2rem;
}
.copy,
.about-section {
	display: grid;
	gap: 0.75rem;
}
.copy .page-copy {
	font-size: 1rem;
}
.fit-grid {
	display: grid;
	grid-template-columns: repeat(3, minmax(0, 1fr));
	gap: 1.5rem;
}
.fit-grid article {
	display: grid;
	align-content: start;
	gap: 0.5rem;
}
.fit-grid h3 {
	font: 600 1rem var(--font-sans);
}
.fit-grid p,
.about-section p {
	color: var(--color-ink-soft);
	line-height: 1.65;
}
.about-faq {
	border-top: 1px solid var(--color-border);
	padding-top: 1.25rem;
}
.about-faq h2 {
	margin-bottom: 0.75rem;
}
.about-faq .workspace-disclosure {
	border-bottom: 1px solid var(--color-border);
}
.about-faq :deep(.workspace-disclosure__trigger) {
	padding: 0.6rem 0;
	cursor: pointer;
	font-size: 0.95rem;
	font-weight: 600;
	color: var(--color-ink);
}
.about-faq p {
	padding: 0 0 0.75rem 1rem;
	margin: 0;
	font-size: 0.95rem;
	line-height: 1.65;
	color: var(--color-ink-soft);
}
@media (max-width: 700px) {
	.about-intro {
		grid-template-columns: 1fr;
	}
	.fit-grid {
		grid-template-columns: 1fr;
		gap: 0.75rem;
	}
}
</style>

<route lang="yaml">
meta:
    layout: default
</route>
