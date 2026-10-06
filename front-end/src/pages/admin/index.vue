<script setup lang="ts">
import AdminWorkspaceShell from "@/components/AdminWorkspaceShell.vue";

const adminTools = [
	{
		title: "IDE reports",
		href: "/admin/ide-reports"
	},
	{
		title: "People and access",
		href: "/admin/people"
	},
	{
		title: "Course workspace",
		href: "/courses"
	},
	{
		title: "Session notes",
		href: "/admin/mdmail"
	},
	{
		title: "Roster integration",
		href: "/admin/student-management"
	}
];
</script>

<template>
	<AdminWorkspaceShell title="Admin Workspace">
		<nav class="tool-grid" aria-label="Admin tools">
			<RouterLink
				v-for="tool in adminTools.filter(tool =>
					['/admin/people', '/admin/mdmail', '/courses'].includes(
						tool.href
					)
				)"
				:key="tool.href"
				:to="tool.href"
				class="tool-card"
			>
				<h2>{{ tool.title }}</h2>
			</RouterLink>
		</nav>
		<details>
			<summary>Reports and roster spreadsheet</summary>
			<nav class="tool-grid">
				<RouterLink
					v-for="tool in adminTools.filter(tool =>
						[
							'/admin/ide-reports',
							'/admin/student-management'
						].includes(tool.href)
					)"
					:key="tool.href"
					:to="tool.href"
					class="tool-card"
					>{{ tool.title }}</RouterLink
				>
			</nav>
		</details>
	</AdminWorkspaceShell>
</template>

<style scoped>
.tool-card {
	background: var(--color-surface) !important;
	border-color: var(--color-border) !important;
	color: var(--color-ink) !important;
}
.tool-grid {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(min(100%, 280px), 1fr));
	gap: 1rem;
}

.tool-card {
	display: grid;
	gap: 0.75rem;
	padding: 1.35rem;
	border-radius: 22px;
	border: 1px solid #d9e2ec;
	background: #fff;
	box-shadow: 0 16px 34px rgba(15, 23, 42, 0.08);
	color: inherit;
	text-decoration: none;
	transition:
		transform 0.18s ease,
		box-shadow 0.18s ease,
		border-color 0.18s ease;
}

.tool-card:hover {
	transform: translateY(-2px);
	border-color: #93c5fd;
	box-shadow: 0 20px 38px rgba(30, 41, 59, 0.12);
}

.tool-card h2 {
	margin: 0;
	font-size: 1.3rem;
}
</style>

<route lang="yaml">
meta:
    layout: default
    requiresAdmin: true
</route>
