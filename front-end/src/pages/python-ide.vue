<script setup lang="ts">
import { onBeforeMount } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

onBeforeMount(() => {
	router.replace({
		hash: route.hash,
		path: "/ide",
		query: route.query
	});
});
</script>

<template>
	<div />
</template>
