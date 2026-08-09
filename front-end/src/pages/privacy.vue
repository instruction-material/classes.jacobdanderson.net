<script lang="ts" setup>
defineOptions({ name: "PrivacyPage" });

useHead({
	meta: [
		{
			content:
				"How optional external Scratch solution players handle browser connections.",
			name: "description"
		}
	],
	title: "Privacy | Classes"
});
</script>

<template>
	<section class="page-shell privacy-page">
		<header class="privacy-header">
			<p class="page-eyebrow">Privacy</p>
			<h1 class="page-title">External Course Players</h1>
			<p class="page-copy">
				This notice covers the optional Scratch solution player in the
				course reader.
			</p>
		</header>

		<section
			aria-labelledby="scratch-player-privacy-title"
			class="privacy-card site-surface site-surface--soft"
		>
			<h2 id="scratch-player-privacy-title">Scratch solution players</h2>
			<p>
				Browsing a course does not contact MIT Scratch. If you choose
				<strong>Play solution</strong>, your browser connects to
				Scratch, which may load services it controls, including
				third-party services.
			</p>
			<p>
				Classes does not send your Classes account details, course
				progress, or saved browser projects to the player. Closing the
				player removes it from the page. Activity inside the player is
				handled by Scratch.
			</p>
		</section>
	</section>
</template>

<style scoped>
.privacy-page {
	gap: 1.5rem;
	max-width: 58rem;
}

.privacy-header {
	display: grid;
	gap: 0.85rem;
}

.privacy-card {
	display: grid;
	gap: 1rem;
	padding: clamp(1.4rem, 3vw, 2rem);
}

.privacy-card h2,
.privacy-card p {
	margin: 0;
}

.privacy-card p {
	color: var(--color-ink-soft);
	line-height: 1.7;
}
</style>

<route lang="yaml">
meta:
    layout: default
</route>
