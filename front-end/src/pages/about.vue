<script lang="ts" setup>
defineOptions({ name: "AboutPage" });
</script>

<template>
	<section class="page-shell about-page">
		<section aria-labelledby="intro-title" class="page-hero about-intro">
			<div class="copy">
				<h1 id="intro-title" class="page-title">
					Courses and Teaching Tools
				</h1>
				<p class="page-copy">
					This forkable platform combines structured course materials
					with browser-based programming, graphing, and instructor
					workflows.
				</p>
				<p class="page-copy">
					Operators can adapt its identity, catalog, and optional
					services for a classroom or instruction program without
					inheriting another instructor’s personal accounts or payment
					details.
				</p>
			</div>
		</section>

		<section aria-labelledby="fit-title" class="about-section">
			<div class="section-heading">
				<h2 id="fit-title" class="section-title">Best Fit</h2>
			</div>
			<div class="fit-grid">
				<article>
					<h3>Active Coursework</h3>
					<p>
						A strong fit for students who need help finishing an
						assignment, understanding a module, or preparing for the
						next check-in.
					</p>
				</article>
				<article>
					<h3>Projects</h3>
					<p>
						Useful for students building apps, games, labs, or other
						project work and needing direct feedback while the work
						is still in progress.
					</p>
				</article>
				<article>
					<h3>Course Paths</h3>
					<p>
						A good fit when a student needs a defined path with
						linked projects and supplemental practice instead of
						improvised enrichment.
					</p>
				</article>
			</div>
		</section>

		<section aria-labelledby="approach-title" class="about-section">
			<div class="section-heading">
				<h2 id="approach-title" class="section-title">
					How Sessions Run
				</h2>
			</div>
			<ul>
				<li>
					<p>
						<strong>Start with the exact problem:</strong>
						We work from the assignment, bug, or project in front of
						the student instead of drifting into generic lecture.
					</p>
				</li>
				<li>
					<p>
						<strong>Make the reasoning visible:</strong>
						Students explain choices, test cases, and edge cases out
						loud so understanding is easy to check.
					</p>
				</li>
				<li>
					<p>
						<strong>Leave with a next step:</strong>
						Each session ends with what was solved, what still needs
						work, and what to do next.
					</p>
				</li>
			</ul>
		</section>

		<section aria-label="About page actions" class="site-action-row">
			<RouterLink class="site-button site-button--primary" to="/courses">
				View Courses
			</RouterLink>
			<RouterLink
				class="site-button site-button--secondary"
				to="/pathways"
			>
				View Course Pathways
			</RouterLink>
		</section>
	</section>
</template>

<style scoped>
.about-page {
	max-width: 64rem;
}
.about-intro {
	max-width: 52rem;
}
.copy,
.about-section {
	display: grid;
	gap: 0.75rem;
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
</style>

<route lang="yaml">
meta:
    layout: default
</route>
