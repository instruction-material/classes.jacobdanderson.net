<script setup lang="ts">
import type { IdeStarter } from "@/modules/ideStarterCatalog";
import { computed, ref, watch } from "vue";
import AccessibleDialog from "@/components/AccessibleDialog.vue";
import { ideStarters } from "@/modules/ideStarterCatalog";

const props = defineProps<{ open: boolean; preferredLanguage?: string }>();
const emit = defineEmits<{
	close: [];
	choose: [starter: IdeStarter];
	import: [];
}>();
const language = ref("all");
const category = ref("Templates");
const search = ref("");
watch(
	() => props.open,
	open => {
		if (open) language.value = props.preferredLanguage ?? "all";
	}
);
const blankStarters: IdeStarter[] = [
	"web",
	"swift",
	"rust",
	"linux",
	"assembly",
	"turtle",
	"python",
	"data",
	"pgzero",
	"java",
	"c",
	"cpp",
	"karel"
].map(mode => ({
	id: `blank-${mode}`,
	label: `Blank ${mode === "web" ? "Web" : mode === "swift" ? "SwiftUI" : mode === "rust" ? "Rust" : mode === "linux" ? "Linux" : mode === "assembly" ? "Assembly" : mode === "turtle" ? "Python Turtle" : mode === "pgzero" ? "Pygame" : mode === "data" ? "Python Data / AI" : mode === "karel" ? "Karel Java" : mode === "java" ? "Java" : mode === "c" ? "C17" : mode === "cpp" ? "C++" : "Python"}`,
	category: "Templates",
	mode: mode as IdeStarter["mode"],
	template: "blank"
}));
const visible = computed(() =>
	(category.value === "Blank" ? blankStarters : ideStarters).filter(
		item =>
			(language.value === "all" || item.mode === language.value) &&
			(category.value === "Blank" || item.category === category.value) &&
			item.label.toLowerCase().includes(search.value.toLowerCase().trim())
	)
);
</script>

<template>
	<AccessibleDialog
		:open="open"
		dialog-id="ide-starter-picker"
		title="Choose a starter"
		description="Creates a separate project; your current files are preserved."
		@close="emit('close')"
	>
		<div class="starter-filters">
			<label
				>Language<select v-model="language">
					<option value="all">All languages</option>
					<option value="turtle">Python Turtle</option>
					<option value="python">Python</option>
					<option value="data">Python Data / AI</option>
					<option value="pgzero">Pygame</option>
					<option value="java">Java / BlueJ</option>
					<option value="assembly">
						Assembly source (Linux x86-64)
					</option>
					<option value="linux">
						Linux scripts and configuration
					</option>
					<option value="swift">SwiftUI source</option>
					<option value="rust">Rust / Cargo source</option>
					<option value="web">HTML, CSS and JavaScript source</option>
					<option value="c">C17 source</option>
					<option value="cpp">C++ source</option>
					<option value="karel">Karel Java</option>
				</select></label
			>
			<label
				>Project type<select v-model="category">
					<option>Blank</option>
					<option>Templates</option>
					<option>Classroom</option>
					<option>Demos</option>
				</select></label
			>
			<label
				>Search starters<input v-model="search" type="search"
			/></label>
		</div>
		<ul class="starter-results">
			<li v-for="item in visible" :key="item.id">
				<button type="button" @click="emit('choose', item)">
					{{ item.label }}
				</button>
			</li>
		</ul>
		<p v-if="!visible.length" role="status">
			No matching starters. Try another language or project type.
		</p>
		<button
			type="button"
			class="site-button site-button--secondary"
			@click="emit('import')"
		>
			Import BlueJ ZIP
		</button>
	</AccessibleDialog>
</template>

<style scoped>
.starter-filters {
	display: grid;
	gap: 0.75rem;
}
.starter-filters label {
	display: grid;
	gap: 0.3rem;
	font: inherit;
	text-transform: none;
	letter-spacing: normal;
}
.starter-filters input,
.starter-filters select {
	width: 100%;
	padding: 0.6rem;
	color: var(--color-ink);
	background: var(--color-surface);
	border: 1px solid var(--color-border);
	border-radius: 0.5rem;
}
.starter-results {
	display: grid;
	gap: 0.5rem;
	padding: 0;
	list-style: none;
}
.starter-results button {
	text-align: left;
	width: 100%;
	padding: 0.75rem;
	background: var(--color-surface);
	color: var(--color-ink);
	border: 1px solid var(--color-border);
	border-radius: 0.5rem;
}
</style>
