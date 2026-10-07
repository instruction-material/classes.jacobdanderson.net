<script setup lang="ts">
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import People from "./people.vue";

const router = useRouter();
onMounted(() => void router.replace("/admin/people"));
</script>

<template><People /></template>

<route lang="yaml">
meta:
    layout: default
    requiresAdmin: true
</route>
