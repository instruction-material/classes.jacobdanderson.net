<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { computed } from "vue";
import { useContentStore } from "@/stores/content";
import { useCoursesStore } from "@/stores/courses";

defineOptions({ name: "HomePage" });

const content = useContentStore();
const { subjectGroups, highlights } = storeToRefs(content);
const coursesStore = useCoursesStore();
const { courses } = storeToRefs(coursesStore);

const libraryStats = computed(() => ({
	courseCount: courses.value.length,
	trackCount: subjectGroups.value.length,
	subjectCount: content.allSubjects.length
}));
</script>

<template>
	<section class="Home">
		<section aria-labelledby="hero-title" class="hero">
			<div class="hero-text">
				<p class="eyebrow">Course Library</p>
				<h1 id="hero-title">
					Build confidence with reusable coding and STEM materials.
				</h1>
				<p>
					Explore project-based course outlines, lesson prompts, and
					progression paths that students, instructors, and families
					can use to plan learning across programming, web
					development, science, and problem-solving topics.
				</p>
			</div>
			<img
				alt="Student and tutor collaborating on a laptop"
				class="hero-image"
				src="https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?auto=format&fit=crop&w=1200&q=80"
			/>
		</section>

		<section aria-labelledby="cta-title" class="cta-group">
			<RouterLink class="cta primary" to="/courses">
				Explore Course Library
			</RouterLink>
			<RouterLink class="cta secondary" to="/signup">
				Plan Your Starting Point
			</RouterLink>
		</section>

		<section aria-labelledby="subjects-title" class="subjects">
			<h2 id="subjects-title">What I teach</h2>
			<p class="intro">
				The library is organized into subject groups so students can
				find a suitable entry point and see where each course can lead.
			</p>
			<div class="subject-grid">
				<article
					v-for="group in subjectGroups"
					:key="group.title"
					class="subject-card"
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

		<section aria-labelledby="highlights-title" class="highlights">
			<h2 id="highlights-title">What I offer</h2>
			<div class="highlight-grid">
				<article
					v-for="highlight in highlights"
					:key="highlight.title"
					class="highlight-card"
				>
					<h3>{{ highlight.title }}</h3>
					<p>{{ highlight.copy }}</p>
				</article>
			</div>
		</section>

		<section aria-labelledby="stats-title" class="stats">
			<h2 id="stats-title">Library Snapshot</h2>
			<div class="stats-grid">
				<article class="stat-card">
					<strong>{{ libraryStats.courseCount }}</strong>
					<span>Current courses</span>
				</article>
				<article class="stat-card">
					<strong>{{ libraryStats.trackCount }}</strong>
					<span>Subject tracks</span>
				</article>
				<article class="stat-card">
					<strong>{{ libraryStats.subjectCount }}</strong>
					<span>Topics covered</span>
				</article>
			</div>
		</section>

		<section aria-labelledby="next-steps-title" class="next-steps">
			<div class="next-steps-card">
				<h2 id="next-steps-title">Ready to get started?</h2>
				<p>
					Start by browsing the course library, then use the getting
					started guide to choose a level, collect tools, and decide
					how you want to practice between sessions or study blocks.
				</p>
				<RouterLink class="cta primary" to="/courses">
					Open Course Library
				</RouterLink>
				<RouterLink class="cta secondary" to="/about">
					How These Materials Work
				</RouterLink>
			</div>
		</section>
	</section>
</template>

<style scoped>
.Home {
	display: flex;
	flex-direction: column;
	gap: 4rem;
	padding: 2.5rem 1.5rem 4rem;
	color: #16202a;
}

.hero {
	display: grid;
	gap: 2rem;
	align-items: center;
	grid-template-columns: repeat(auto-fit, minmax(0, 1fr));
}

.hero-text {
	display: flex;
	flex-direction: column;
	gap: 1.5rem;
}

.hero-text h1 {
	font-size: clamp(2.25rem, 4vw, 3rem);
	line-height: 1.1;
	font-weight: 700;
}

.hero-text p {
	font-size: 1.05rem;
	line-height: 1.6;
	margin: 0;
}

.eyebrow {
	text-transform: uppercase;
	letter-spacing: 0.2em;
	font-size: 0.85rem;
	color: #3a6ea5;
	font-weight: 600;
}

.cta-group {
	display: flex;
	gap: 2rem;
	justify-content: space-around;
	align-items: center;
}

.cta-group * {
	width: 40%;
	margin: 0 auto;
}

.cta {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	padding: 0.85rem 1.5rem;
	border-radius: 999px;
	font-weight: 600;
	text-decoration: none;
	transition:
		transform 0.2s ease,
		box-shadow 0.2s ease;
	border: 2px solid transparent;
}

.cta.primary {
	background-color: #3a6ea5;
	color: white;
}

.cta.primary:hover {
	background-color: #2d5c8a;
	transform: translateY(-2px);
}

.cta.secondary {
	background-color: white;
	border-color: #3a6ea5;
	color: #3a6ea5;
}

.cta.secondary:hover {
	background-color: #e9f2fb;
	transform: translateY(-2px);
}

.hero-image {
	width: 100%;
	max-height: 420px;
	object-fit: cover;
	border-radius: 24px;
	box-shadow: 0 18px 40px rgba(14, 33, 58, 0.18);
}

.hero,
.cta-group,
.subjects,
.highlights,
.stats,
.next-steps {
	max-width: 1100px;
	width: 100%;
	margin: 0 auto;
	text-align: center;
}

.subjects h2,
.highlights h2,
.stats h2,
.next-steps h2 {
	font-size: clamp(1.8rem, 3vw, 2.4rem);
	margin-bottom: 0.75rem;
}

.intro {
	max-width: 720px;
	margin: 0 auto 2.5rem;
	font-size: 1.05rem;
	line-height: 1.6;
	color: #334155;
}

.subject-grid,
.highlight-grid,
.stats-grid {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
	gap: 1rem;
}

.subject-card,
.highlight-card,
.stat-card,
.next-steps-card {
	background: white;
	border-radius: 20px;
	padding: 1.5rem;
	box-shadow: 0 14px 30px rgba(18, 64, 112, 0.08);
}

.subject-card ul {
	list-style: none;
	padding: 0;
	margin: 1rem 0 0;
	display: grid;
	gap: 0.5rem;
}

.stat-card {
	display: grid;
	gap: 0.35rem;
}

.stat-card strong {
	font-size: clamp(2rem, 4vw, 2.75rem);
	color: #1f3d5a;
}

.stat-card span {
	color: #48617a;
	font-weight: 600;
}

.next-steps-card {
	display: grid;
	gap: 1rem;
	max-width: 760px;
	margin: 0 auto;
}

@media (max-width: 900px) {
	.cta-group {
		flex-direction: column;
		gap: 1rem;
	}

	.cta-group * {
		width: 100%;
		max-width: 360px;
	}
}
</style>
