<script lang="ts" setup>
defineOptions({ name: "CourseLibraryPage" });
</script>

<template>
	<section class="CourseLibraryPage">
		<header class="hero">
			<h1>Course Library</h1>
			<p>
				Browse reusable course outlines, lesson sequences, and
				supplemental projects. The library is designed to help students
				and instructors inspect scope before starting a course and to
				revisit material as skills improve.
			</p>
		</header>

		<CourseExplorer />
	</section>
</template>

<style scoped>
.CourseLibraryPage {
	padding: 2.5rem 1.5rem 4rem;
	display: grid;
	gap: 2rem;
	color: #16202a;
}

.hero {
	max-width: 860px;
	margin: 0 auto;
	text-align: center;
	display: grid;
	gap: 1rem;
}

.hero h1 {
	margin: 0;
	font-size: clamp(2.2rem, 4vw, 3rem);
}

.hero p {
	margin: 0;
	line-height: 1.7;
	font-size: 1.05rem;
	color: #2d3f55;
}
</style>

<route lang="json">
{
	"meta": {
		"layout": "default"
	}
}
</route>
