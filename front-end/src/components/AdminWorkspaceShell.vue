<script lang="ts" setup>
import { computed, useSlots } from "vue";
import { useRoute } from "vue-router";
import WorkspaceHeader from "@/components/WorkspaceHeader.vue";

interface WorkspaceAction {
	href: string;
	label: string;
	external?: boolean;
}

defineOptions({ name: "AdminWorkspaceShell" });

withDefaults(
	defineProps<{
		title: string;
		action?: WorkspaceAction | null;
	}>(),
	{
		action: null
	}
);

const route = useRoute();

const navItems = [
	{ label: "Session notes", to: "/admin/mdmail" },
	{ label: "People", to: "/admin/people" },
	{ label: "IDE reports", to: "/admin/ide-reports" }
];

const hasActionSlot = computed(() => !!useSlots().actions);

function isActive(path: string) {
	const currentPath = route?.path ?? "";
	if (path === "/admin") return currentPath === "/admin";
	return currentPath === path || currentPath.startsWith(`${path}/`);
}
</script>

<template>
	<section class="admin-shell">
		<div class="admin-shell__frame">
			<WorkspaceHeader :title="title">
				<div
					v-if="action || hasActionSlot"
					class="admin-shell__actions"
				>
					<slot name="actions">
						<a
							v-if="action?.external"
							:href="action.href"
							class="admin-shell__action"
							rel="noopener noreferrer"
							target="_blank"
						>
							{{ action.label }}
							<span class="sr-only"> (opens in a new tab)</span>
						</a>
						<RouterLink
							v-else-if="action"
							:to="action.href"
							class="admin-shell__action"
						>
							{{ action.label }}
						</RouterLink>
					</slot>
				</div>
			</WorkspaceHeader>

			<nav class="admin-shell__nav" aria-label="Admin sections">
				<RouterLink
					v-for="item in navItems"
					:key="item.to"
					class="admin-shell__nav-link"
					:class="{ 'is-active': isActive(item.to) }"
					:to="item.to"
				>
					{{ item.label }}
				</RouterLink>
			</nav>

			<div class="admin-shell__body">
				<slot />
			</div>
		</div>
	</section>
</template>

<style scoped>
.admin-shell {
	margin: 0;
	padding: 0.75rem 1rem 2rem;
}
.admin-shell__frame {
	width: 100%;
	max-width: 1180px;
	margin: 0 auto;
	display: grid;
	gap: 0.5rem;
	min-width: 0;
}
.admin-shell__actions {
	display: flex;
	flex-wrap: wrap;
	gap: 0.5rem;
	justify-content: flex-end;
}
.admin-shell__action,
.admin-shell__nav-link {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	max-width: 100%;
	padding: 0.6rem 0.85rem;
	border-radius: var(--radius-sm);
	border: 1px solid var(--color-border);
	background: var(--color-surface);
	color: var(--color-ink);
	font-weight: 600;
	text-decoration: none;
}
.admin-shell__nav {
	display: flex;
	flex-wrap: wrap;
	gap: 0.5rem;
}
.admin-shell__action:hover,
.admin-shell__nav-link:hover,
.admin-shell__nav-link.is-active {
	background: var(--color-accent-soft);
	border-color: var(--color-accent);
}
.admin-shell__body {
	padding: clamp(1rem, 3vw, 1.75rem);
	border-radius: var(--radius-md);
	min-width: 0;
	background: var(--color-surface);
	color: var(--color-ink);
	border: 1px solid var(--color-border);
	box-shadow: var(--shadow-soft);
}
@media (max-width: 640px) {
	.admin-shell {
		padding-inline: 0.75rem;
	}
	.admin-shell__actions {
		justify-content: flex-start;
	}
}

.admin-shell__nav-link {
	min-height: 2.75rem;
	padding: 0.35rem 0.65rem;
	border-color: transparent;
	background: transparent;
	font-size: 0.9rem;
}
.admin-shell__nav {
	border-bottom: 1px solid var(--color-border);
	padding-bottom: 0.25rem;
}
</style>
