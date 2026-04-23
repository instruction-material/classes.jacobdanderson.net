<script lang="ts" setup>
defineOptions({ name: "OnlinePrepPage" });
</script>

<template>
	<section class="ZoomClassroom">
		<header class="hero">
			<h1>Online Class Prep</h1>
			<p>
				Use this checklist before any remote lesson, tutoring session,
				or independent study block that involves screen sharing, code,
				or collaborative problem solving.
			</p>
		</header>

		<div class="card-grid">
			<article class="zoom-card" aria-labelledby="zoom-card-title">
				<h2 id="zoom-card-title">Before You Start</h2>
				<p>
					Open the tools you expect to use before the session begins
					so the first few minutes can focus on learning instead of
					setup.
				</p>
				<ul class="prep-list">
					<li>Test audio, camera, and screen-sharing permissions.</li>
					<li>
						Open the editor, browser tabs, notebook, and starter
						files.
					</li>
					<li>
						Close distracting apps or unrelated browser windows.
					</li>
				</ul>
			</article>

			<article class="zoom-card">
				<h2>During the Session</h2>
				<ul class="prep-list">
					<li>
						Keep one place for notes, questions, and TODO items.
					</li>
					<li>
						Pause to summarize important ideas in your own words.
					</li>
					<li>Save project states at meaningful checkpoints.</li>
				</ul>
			</article>

			<article class="zoom-card">
				<h2>Afterward</h2>
				<ul class="prep-list">
					<li>
						Write down the next thing to practice while it is fresh.
					</li>
					<li>
						Rename files clearly so projects are easy to revisit.
					</li>
					<li>
						Review one bug, one concept, and one success from the
						session.
					</li>
				</ul>
			</article>
		</div>
	</section>
</template>

<style scoped>
.ZoomClassroom {
	padding: 2.5rem 1.5rem 4rem;
	display: flex;
	flex-direction: column;
	gap: 2.5rem;
	color: #16202a;
	align-items: center;
}

.hero {
	max-width: 720px;
	text-align: center;
	display: grid;
	gap: 1.25rem;
}

.hero h1 {
	font-size: clamp(2rem, 4vw, 2.75rem);
	margin: 0;
}

.hero p {
	margin: 0;
	font-size: 1.05rem;
	line-height: 1.6;
	color: #2d3f55;
}

.card-grid {
	display: grid;
	gap: 2rem;
	width: 100%;
	max-width: 960px;
}

.zoom-card {
	background: white;
	border-radius: 28px;
	padding: 2rem;
	box-shadow: 0 18px 40px rgba(16, 42, 66, 0.08);
	display: grid;
	gap: 1.25rem;
}

.zoom-card h2 {
	margin: 0;
	font-size: clamp(1.8rem, 3vw, 2.3rem);
	text-align: left;
}

p {
	margin: 0;
	line-height: 1.6;
}

.prep-list {
	margin: 0;
	padding-left: 1.25rem;
	display: grid;
	gap: 0.6rem;
	color: #2d3f55;
}

@media (max-width: 768px) {
	.ZoomClassroom {
		padding: 2rem 1.25rem 3rem;
	}

	.zoom-card {
		padding: 1.5rem;
	}
}

@media (min-width: 768px) {
	.card-grid {
		grid-template-columns: repeat(3, minmax(0, 1fr));
	}
}
</style>

<route lang="yaml">
meta:
    layout: default
</route>
