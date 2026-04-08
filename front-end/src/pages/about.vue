<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { computed } from "vue";
import { useContentStore } from "@/stores/content";
import { useCoursesStore } from "@/stores/courses";

defineOptions({ name: "AboutPage" });

const contentStore = useContentStore();
const coursesStore = useCoursesStore();
const { subjectGroups } = storeToRefs(contentStore);
const { courses } = storeToRefs(coursesStore);

const workflow = [
	"Choose a subject track and scan the first module before committing to a level.",
	"Use the core lessons as the default path, then add supplemental projects when learners need more practice or want extra challenge.",
	"Treat each module as a checkpoint: review what feels easy, note what still feels slow, and only then move forward."
];

const coursePreview = computed(() => courses.value.slice(0, 6));
</script>

<template>
	<section class="About">
		<section aria-labelledby="intro-title" class="intro">
			<h1 id="intro-title" class="page-title">About These Materials</h1>

			<div class="copy">
				<p>
					This site packages reusable course outlines, project ideas,
					and progression paths for students learning programming,
					web development, science, and related problem-solving
					topics.
				</p>
				<p>
					The goal is not to prescribe a single teaching style. These
					materials are meant to support guided tutoring, classroom
					enrichment, clubs, and independent review by giving learners
					clear next steps and meaningful projects.
				</p>
			</div>
		</section>

		<section aria-labelledby="philosophy-title" class="philosophy">
			<h2 id="philosophy-title">How to Use the Library</h2>
			<ul>
				<li v-for="step in workflow" :key="step">
					<p>{{ step }}</p>
				</li>
			</ul>
		</section>

		<section aria-labelledby="experience-title" class="experience">
			<h2 id="experience-title">Subject Tracks</h2>
			<div class="experience-grid">
				<article
					v-for="group in subjectGroups"
					:key="group.title"
				>
					<h3>{{ group.title }}</h3>
					<p>{{ group.subjects.join(", ") }}</p>
				</article>
			</div>
		</section>

		<section aria-labelledby="preview-title" class="preview-section">
			<h2 id="preview-title">Courses Included</h2>
			<div class="preview-grid">
				<article
					v-for="course in coursePreview"
					:key="course.id"
					class="preview-card"
				>
					<h3>{{ course.name }}</h3>
				</article>
			</div>
			<RouterLink class="cta" to="/courses">Browse All Courses</RouterLink>
		</section>
	</section>
</template>

<style scoped>
.About {
	padding: 2.5rem 1.5rem 4rem;
	display: flex;
	flex-direction: column;
	gap: 3rem;
	color: #16202a;
	align-items: center;
}

.About > * {
	max-width: 1200px;
	margin: 1% auto;
	width: 100%;
}

.intro {
	margin: 0 auto 1%;
	display: grid;
	gap: 1.5rem;
}

.page-title {
	font-size: clamp(2.4rem, 4vw, 3.2rem);
	margin: 0 0 0.25rem 0;
	text-align: center;
}

.copy {
	display: grid;
	gap: 1.25rem;
}

.copy p,
.philosophy p {
	line-height: 1.7;
	color: #2d3f55;
}

.philosophy,
.experience,
.preview-section {
	display: grid;
	gap: 1.5rem;
}

.philosophy ul {
	margin: 0;
	padding-left: 1.25rem;
	display: grid;
	gap: 1rem;
}

.experience-grid,
.preview-grid {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
	gap: 1rem;
}

.experience-grid article,
.preview-card {
	background: white;
	border-radius: 20px;
	padding: 1.5rem;
	box-shadow: 0 14px 30px rgba(18, 64, 112, 0.08);
}

.preview-card h3,
.experience-grid h3 {
	margin: 0;
}

.cta {
	justify-self: start;
	display: inline-flex;
	align-items: center;
	justify-content: center;
	padding: 0.85rem 1.5rem;
	border-radius: 999px;
	font-weight: 600;
	text-decoration: none;
	background-color: #3a6ea5;
	color: white;
	transition:
		background-color 0.2s ease,
		transform 0.2s ease;
}

.cta:hover {
	background-color: #2d5c8a;
	transform: translateY(-2px);
}

@media (max-width: 960px) {
	.page-title {
		font-size: clamp(1.8rem, 6vw, 2.2rem);
	}
}
</style>
