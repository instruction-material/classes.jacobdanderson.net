<script setup lang="ts">
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import SessionNotes from "./mdmail.vue";

const router = useRouter();
onMounted(() => void router.replace("/admin/mdmail"));
</script>

<template>
	<SessionNotes />
</template>

<route lang="yaml">
meta:
    layout: default
    requiresAdmin: true
</route>
