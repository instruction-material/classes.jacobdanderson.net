<script lang="ts" setup>
defineOptions({ name: "PrivacyPage" });

useHead({
	meta: [
		{
			content:
				"How optional course players and explicitly submitted IDE problem reports handle information.",
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
			<h1 class="page-title">Course Players and IDE Reports</h1>
			<p class="page-copy">
				This notice covers optional Scratch solution players and IDE
				problem reports.
			</p>
		</header>

		<section
			aria-labelledby="ide-report-privacy-title"
			class="privacy-card site-surface site-surface--soft"
		>
			<h2 id="ide-report-privacy-title">
				IDE diagnostics and problem reports
			</h2>
			<p>
				Copy diagnostics copies a local snapshot. Report a problem sends
				information only after you preview and confirm it. The preview
				includes site/build identity, browser and runtime versions,
				execution stage, error classification, and optional sanitized
				stack locations. It excludes code, input, console output, file
				names, and raw tracebacks.
			</p>
			<p>
				You may add a description. Leave out student names, code,
				passwords, and private values. Submitted reports are available
				only to administrators and expire after 90 days. Reports do not
				contain account identifiers or request headers. Existing server
				access logs and rate limiting are separate from these reports.
			</p>
			<p>
				Ordinary programming errors are distinguished from possible IDE
				issues and do not generate outage alerts. There is no automatic
				error-report submission. Desktop BlueJ errors and versions
				cannot be read by the website.
			</p>
		</section>

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
