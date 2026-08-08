<script lang="ts" setup>
import { onMounted } from "vue";

const CODING_STANDARD_URL =
	"https://static.classes.jacobdanderson.net/coding_standard.md";

useHead({
	meta: [
		{
			content: `0; url=${CODING_STANDARD_URL}`,
			"http-equiv": "refresh"
		},
		{ content: "noindex,nofollow", name: "robots" }
	]
});

onMounted(() => {
	window.location.replace(CODING_STANDARD_URL);
});
</script>

<template>
	<main class="page-shell">
		<p aria-live="polite">Opening the coding standard...</p>
	</main>
</template>
