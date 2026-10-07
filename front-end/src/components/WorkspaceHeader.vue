<script setup lang="ts">
defineProps<{ title: string; description?: string }>();
</script>

<template>
	<header class="workspace-heading">
		<div>
			<div class="workspace-heading__title">
				<h1>{{ title }}</h1>
				<slot name="title" />
			</div>
			<p v-if="description">{{ description }}</p>
		</div>
		<div v-if="$slots.default" class="workspace-heading__actions">
			<slot />
		</div>
	</header>
</template>

<style scoped>
.workspace-heading {
	display: flex;
	align-items: center;
	justify-content: space-between;
	flex-wrap: wrap;
	gap: 0.5rem;
	padding: 0.25rem 0;
	color: var(--color-ink);
}
.workspace-heading__title {
	display: flex;
	align-items: center;
	flex-wrap: wrap;
	gap: 0.65rem;
}
.workspace-heading h1 {
	margin: 0;
	font-size: clamp(1.2rem, 2vw, 1.5rem);
}
.workspace-heading p {
	margin: 0.35rem 0 0;
	color: var(--color-ink-soft);
	max-width: 65ch;
	font-size: 0.95rem;
}
.workspace-heading__actions {
	display: flex;
	gap: 0.5rem;
	flex-wrap: wrap;
	align-items: center;
}
</style>
