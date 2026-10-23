<script lang="ts" setup>
import { computed, ref } from "vue";
import { coursePathwayMaps } from "@/modules/coursePathwayMaps";
import { courseCatalog } from "@/stores/courses/index";

defineOptions({ name: "PathwaysPage" });
const search = ref("");
const category = ref("all");
const categories = [
	{ id: "all", label: "All" },
	{ id: "coding", label: "Coding" },
	{ id: "math", label: "Math" },
	{ id: "science", label: "Science" },
	{ id: "language", label: "Reading and writing" },
	{ id: "life", label: "Life skills" }
];
const courseNameById = new Map(
	courseCatalog.map(course => [course.id, course.name])
);
const visiblePathways = computed(() =>
	coursePathwayMaps.filter(pathway => {
		if (category.value !== "all" && pathway.category !== category.value)
			return false;
		return [
			pathway.title,
			pathway.summary,
			pathway.readiness,
			...pathway.stages.flatMap(stage => stage.courseIds.map(courseName))
		]
			.join(" ")
			.toLowerCase()
			.includes(search.value.trim().toLowerCase());
	})
);
function courseName(courseId: string) {
	return courseNameById.get(courseId) ?? courseId;
}
</script>

<template>
	<section class="page-shell page-shell--wide pathways-page">
		<header class="pathways-heading">
			<h1 class="page-title">Course Pathways</h1>
			<p>Find a starting point. Follow a path or choose a focus.</p>
		</header>
		<div class="pathway-tools">
			<div
				class="pathway-filters"
				role="group"
				aria-label="Filter pathways by subject"
			>
				<button
					v-for="subject in categories"
					:key="subject.id"
					type="button"
					:aria-pressed="category === subject.id"
					@click="category = subject.id"
				>
					{{ subject.label }}
				</button>
			</div>
			<label class="pathway-search">
				<span class="sr-only">Search pathways</span>
				<input
					v-model="search"
					type="search"
					placeholder="Find a subject or course"
				/>
			</label>
		</div>
		<p class="sr-only" role="status">
			{{ visiblePathways.length }} matching pathways
		</p>
		<p v-if="!visiblePathways.length">
			No matching pathways. Try another subject or search.
		</p>
		<div class="pathways-grid">
			<article
				v-for="pathway in visiblePathways"
				:id="`pathway-${pathway.id}`"
				:key="pathway.id"
				class="pathway-card"
				:class="{ 'pathway-card--wide': pathway.id === 'algebra' }"
			>
				<header>
					<h2>{{ pathway.title }}</h2>
					<p class="pathway-summary">{{ pathway.summary }}</p>
				</header>
				<p class="pathway-map-label">
					{{
						pathway.kind === "sequence"
							? "Suggested progression"
							: "Choose a focus"
					}}
				</p>
				<ol
					class="pathway-flow"
					:class="{
						'pathway-flow--sequence': pathway.kind === 'sequence'
					}"
					:aria-label="`${pathway.title}: ${pathway.kind === 'sequence' ? 'suggested progression' : 'course choices'}`"
				>
					<li
						v-for="(stage, index) in pathway.stages"
						:key="stage.title"
						class="pathway-stage"
					>
						<h3>
							<span
								v-if="pathway.kind === 'sequence'"
								class="stage-number"
								aria-hidden="true"
								>{{ index + 1 }}</span
							>{{ stage.title }}
						</h3>
						<ul>
							<li
								v-for="courseId in stage.courseIds"
								:key="courseId"
							>
								<RouterLink :to="`/courses#${courseId}`">{{
									courseName(courseId)
								}}</RouterLink>
							</li>
						</ul>
					</li>
				</ol>
				<p class="pathway-readiness">{{ pathway.readiness }}</p>
			</article>
		</div>
	</section>
</template>

<style scoped>
.pathways-heading p {
	margin-top: 0.5rem;
	color: var(--color-ink-soft);
}
.pathway-tools {
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	justify-content: space-between;
	gap: 0.75rem 1.5rem;
}
.pathway-filters {
	display: flex;
	flex-wrap: wrap;
	gap: 0.35rem;
}
.pathway-filters button {
	padding: 0.4rem 0.7rem;
	border: 1px solid transparent;
	border-radius: 6px;
	background: transparent;
	color: var(--color-ink-soft);
	font-weight: 500;
}
.pathway-filters button[aria-pressed="true"] {
	background: var(--color-accent-soft);
	border-color: var(--color-border-strong);
	color: var(--color-accent-strong);
}
.pathway-search {
	flex: 0 1 18rem;
	margin: 0;
}
.pathway-search input {
	width: 100%;
	padding: 0.55rem 0.75rem;
	border: 1px solid var(--color-border);
	border-radius: 6px;
	background: var(--color-surface);
	color: var(--color-ink);
	font: 400 0.95rem var(--font-sans);
}
.pathways-grid {
	display: grid;
	grid-template-columns: repeat(2, minmax(0, 1fr));
	align-items: start;
	gap: 1.5rem;
}
.pathway-card {
	min-width: 0;
	padding: 1.4rem;
	border: 1px solid var(--color-border);
	border-radius: 10px;
	background: var(--color-surface);
}
.pathway-card--wide {
	grid-column: 1 / -1;
}
.pathway-card h2 {
	font: 600 1.3rem var(--font-sans);
	margin-bottom: 0.5rem;
}
.pathway-summary {
	color: var(--color-ink-soft);
	line-height: 1.55;
	font-size: 0.95rem;
}
.pathway-map-label {
	margin: 1.25rem 0 0.75rem;
	font-size: 0.85rem;
	color: var(--color-ink-muted);
}
.pathway-flow {
	display: flex;
	gap: 1.25rem;
	list-style: none;
	padding: 0;
	margin: 0;
}
.pathway-stage {
	position: relative;
	flex: 1;
	min-width: 0;
	padding: 0.8rem;
	border-radius: 6px;
	background: var(--color-accent-soft);
}
.pathway-flow--sequence > li + li::before {
	content: "→";
	position: absolute;
	left: -1.15rem;
	top: 0.8rem;
	color: var(--color-accent);
}
.pathway-stage h3 {
	display: flex;
	align-items: baseline;
	gap: 0.4rem;
	font: 600 0.95rem/1.4 var(--font-sans);
	margin: 0 0 0.7rem;
}
.stage-number {
	color: var(--color-accent-strong);
}
.pathway-stage ul {
	list-style: none;
	padding: 0;
	margin: 0;
	display: grid;
	gap: 0.6rem;
}
.pathway-stage a {
	display: inline-block;
	color: var(--color-link);
	font-size: 0.9rem;
	font-weight: 500;
	line-height: 1.5;
	text-decoration: underline;
	text-underline-offset: 3px;
	overflow-wrap: anywhere;
}
.pathway-readiness {
	border-top: 1px solid var(--color-border);
	padding-top: 0.85rem;
	margin: 1rem 0 0;
	color: var(--color-ink-soft);
	font-size: 0.9rem;
	line-height: 1.6;
}
@media (max-width: 1150px) {
	.pathways-grid {
		grid-template-columns: 1fr;
	}
}
@media (max-width: 700px) {
	.pathway-card {
		padding: 1rem;
	}
	.pathway-flow {
		flex-direction: column;
	}
	.pathway-flow--sequence > li + li::before {
		content: "↓";
		left: 1rem;
		top: -1.25rem;
	}
	.pathway-search {
		flex-basis: 100%;
	}
}
</style>
