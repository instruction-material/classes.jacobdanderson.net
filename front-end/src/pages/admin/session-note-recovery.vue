<script setup lang="ts">
import AdminWorkspaceShell from "@/components/AdminWorkspaceShell.vue";
import SessionNoteEvidenceReview from "@/components/SessionNoteEvidenceReview.vue";
</script>

<template>
	<AdminWorkspaceShell title="Session-note recovery">
		<SessionNoteEvidenceReview />
	</AdminWorkspaceShell>
</template>

<route lang="yaml">
meta:
    layout: default
    requiresAdmin: true
</route>
