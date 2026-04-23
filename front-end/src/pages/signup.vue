<script lang="ts" setup>
defineOptions({ name: "SignupPage" });
</script>

<template>
	<section class="Signup">
		<section class="intro">
			<h1>Getting Started</h1>
			<p>
				Use this page to choose a starting level, collect the right
				tools, and decide how you want to work through the course
				library.
			</p>
		</section>

		<section aria-labelledby="steps-title" class="guide-grid">
			<h2 id="steps-title">Suggested First Steps</h2>
			<div class="step-grid">
				<article class="step-card">
					<h3>1. Pick a Track</h3>
					<p>
						Start with the subject group that matches current goals:
						fundamentals, web development, science, or an advanced
						specialization.
					</p>
				</article>
				<article class="step-card">
					<h3>2. Match the Level</h3>
					<p>
						Read the first module of a candidate course. If most of
						it feels familiar, move one level higher. If it feels
						overwhelming, step back and build momentum first.
					</p>
				</article>
				<article class="step-card">
					<h3>3. Gather Tools</h3>
					<p>
						Prepare the coding environment, notebook, browser tabs,
						and any linked references before beginning a module so
						you can stay focused on the lesson itself.
					</p>
				</article>
			</div>
		</section>

		<section aria-labelledby="checklist-title" class="after-booking d-grid">
			<h2 id="checklist-title">Learner Checklist</h2>
			<ol>
				<li>Choose one main course and one optional stretch topic.</li>
				<li>Block regular practice time instead of cramming.</li>
				<li>Keep project files and notes in one consistent folder.</li>
				<li>Review recent lessons before opening the next module.</li>
			</ol>
			<div class="cta-group">
				<RouterLink class="cta" to="/courses">
					Open Course Library
				</RouterLink>
				<RouterLink class="cta ghost" to="/payment">
					Read the Study Guide
				</RouterLink>
			</div>
		</section>
	</section>
</template>

<style scoped>
.Signup {
	display: flex;
	flex-direction: column;
	gap: 3rem;
	padding: 2.5rem 1.5rem 4rem;
	color: #16202a;
	align-items: center;
}

.intro h1 {
	font-size: clamp(2rem, 3.5vw, 2.75rem);
}

.intro p {
	margin: 0;
	line-height: 1.6;
	color: #2d3f55;
	font-size: 1.05rem;
}

.intro,
.guide-grid,
.after-booking {
	max-width: 960px;
	margin: 0;
	text-align: center;
	gap: 1.25rem;
}

.guide-grid h2,
.after-booking h2 {
	font-size: clamp(1.8rem, 3vw, 2.3rem);
}

.step-grid {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
	gap: 1rem;
}

.step-card {
	background: white;
	border-radius: 24px;
	padding: 1.75rem;
	box-shadow: 0 18px 40px rgba(16, 42, 66, 0.08);
	display: grid;
	gap: 0.75rem;
	text-align: left;
}

.step-card h3 {
	margin: 0;
	color: #19314a;
}

.step-card p {
	margin: 0;
	line-height: 1.6;
	color: #2d3f55;
}

.after-booking ol {
	margin: 0;
	padding-left: 1.25rem;
	text-align: left;
	line-height: 1.6;
	color: #2d3f55;
	background: #f4f8fc;
	border-radius: 20px;
	padding: 1.5rem 1.75rem 1.5rem 2.5rem;
	box-shadow: inset 0 0 0 1px #dbe9f8;
}

.cta-group {
	display: flex;
	flex-wrap: wrap;
	justify-content: center;
	gap: 1rem;
}

.cta {
	justify-self: center;
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

.cta.ghost {
	background-color: white;
	border: 2px solid #3a6ea5;
	color: #3a6ea5;
}

.cta.ghost:hover {
	background-color: #e9f2fb;
}

@media (max-width: 640px) {
	.Signup {
		padding: 2rem 1.25rem 3rem;
	}
}
</style>

<route lang="yaml">
meta:
    layout: default
</route>
