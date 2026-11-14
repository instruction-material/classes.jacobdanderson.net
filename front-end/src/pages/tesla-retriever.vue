<script setup lang="ts">
import OrbitExperiment from "@/components/OrbitExperiment.vue";

defineOptions({ name: "TeslaRetrieverPage" });
const returnTo =
	"/courses#late-elementary-b-math-leb18-module-project-chanh-s-space-adventure";
</script>

<template>
	<OrbitExperiment :return-to="returnTo" />
</template>
