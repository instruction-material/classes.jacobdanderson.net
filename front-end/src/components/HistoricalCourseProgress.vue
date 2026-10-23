<script lang="ts" setup>
import type { HistoricalProgressEntry } from "@/modules/courseProgressHistory";
import type { CourseProgress } from "@/stores/app";
import type { CourseDefinition } from "@/stores/courses";
import { computed, ref } from "vue";
import WorkspaceDisclosure from "@/components/WorkspaceDisclosure.vue";
import { unmatchedCourseProgress } from "@/modules/courseProgressHistory";

const props = withDefaults(
	defineProps<{
		course: CourseDefinition | null;
		editable?: boolean;
		progress: CourseProgress;
	}>(),
	{ editable: false }
);

const emit = defineEmits<{
	remove: [entry: HistoricalProgressEntry];
}>();

const pageSize = 50;
const visibleCount = ref(pageSize);
const entries = computed(() =>
	unmatchedCourseProgress(props.course, props.progress)
);
const visibleEntries = computed(() =>
	entries.value.slice(0, visibleCount.value)
);
</script>

<template>
	<WorkspaceDisclosure
		v-if="entries.length"
		class="historical-progress"
		:label="`Earlier completions (${entries.length})`"
	>
		<ul>
			<li
				v-for="entry in visibleEntries"
				:key="`${entry.kind}-${entry.id}`"
			>
				<span>{{ entry.kind === "module" ? "Module" : "Item" }}</span>
				<code>{{ entry.id }}</code>
				<button
					v-if="editable"
					type="button"
					:aria-label="`Remove earlier ${entry.kind} completion ${entry.id}`"
					@click="emit('remove', entry)"
				>
					Remove
				</button>
			</li>
		</ul>
		<button
			v-if="visibleCount < entries.length"
			type="button"
			@click="visibleCount += pageSize"
		>
			Show more
		</button>
	</WorkspaceDisclosure>
</template>

<style scoped>
.historical-progress {
	padding: 0.75rem;
	border: 1px solid var(--color-border);
	border-radius: 12px;
	color: var(--color-ink-soft);
}

.historical-progress :deep(.workspace-disclosure__trigger) {
	cursor: pointer;
	color: var(--color-ink);
	font-weight: 700;
}

.historical-progress ul {
	display: grid;
	gap: 0.5rem;
	padding: 0;
	list-style: none;
}

.historical-progress li {
	display: flex;
	flex-wrap: wrap;
	align-items: baseline;
	gap: 0.5rem;
}

.historical-progress code {
	min-width: 0;
	overflow-wrap: anywhere;
}
</style>
