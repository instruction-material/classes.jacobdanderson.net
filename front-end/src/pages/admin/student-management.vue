<script setup lang="ts">
import AdminWorkspaceShell from "@/components/AdminWorkspaceShell.vue";
</script>

<template>
	<AdminWorkspaceShell
		:action="{
			href: '/admin/people',
			label: 'Open people workspace'
		}"
		intro="Use the native people and course workspaces for accounts, access, and progress. This source fork does not publish an external roster document."
		title="Roster Integration"
	>
		<section class="roster-panel">
			<h2>No external roster is configured</h2>
			<p>
				Spreadsheet edit links, published document identifiers, and
				embedded rosters are deployment-specific student records. Add an
				approved integration only after applying the deployment’s
				access, privacy, and retention requirements.
			</p>
		</section>
	</AdminWorkspaceShell>
</template>

<style scoped>
.roster-panel {
	display: grid;
	gap: 0.8rem;
	padding: clamp(1.25rem, 3vw, 2rem);
	border: 1px solid var(--color-border);
	border-radius: 22px;
	background: var(--color-surface-strong);
	color: var(--color-ink);
}

.roster-panel h2,
.roster-panel p {
	margin: 0;
}

.roster-panel p {
	color: var(--color-ink-soft);
	line-height: 1.65;
}
</style>

<route lang="yaml">
meta:
    layout: default
    requiresAdmin: true
</route>
