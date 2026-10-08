<script setup lang="ts">
defineProps<{ compact?: boolean }>();
</script>

<template>
	<footer class="site-footer" :class="{ 'site-footer--compact': compact }">
		<div class="site-shell site-shell--wide site-footer__bottom">
			<p>© {{ new Date().getFullYear() }} Classes.</p>
			<button
				class="site-footer__theme-toggle"
				type="button"
				:aria-label="
					isDark ? 'Switch to light mode' : 'Switch to dark mode'
				"
				:aria-pressed="isDark"
				@click="toggleDark()"
			>
				{{ isDark ? "Light mode" : "Dark mode" }}
			</button>
			<nav aria-label="Footer" class="site-action-row site-footer__links">
				<RouterLink to="/privacy">Privacy</RouterLink>
				<a href="mailto:contact@example.com">
					Contact<span class="sr-only"> (opens your email app)</span>
				</a>
			</nav>
		</div>
	</footer>
</template>

<style scoped>
.site-footer {
	margin-top: 1.5rem;
	padding: 1rem 0;
	border-top: 1px solid var(--color-border);
	background: var(--color-surface-muted);
	color: var(--color-ink-soft);
}

.site-footer__bottom {
	display: grid;
	grid-template-columns: minmax(0, 1fr) auto auto;
	align-items: center;
	gap: 0.75rem 1.5rem;
}

.site-footer__bottom p {
	margin: 0;
	font-size: 0.85rem;
}

.site-footer__links {
	width: auto;
	justify-content: flex-end;
	gap: 0.5rem 1.1rem;
}

.site-footer__links a {
	width: auto;
	padding-block: 0.3rem;
	color: var(--color-link);
	font-size: 0.9rem;
	text-underline-offset: 0.2em;
}

.site-footer__theme-toggle {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	min-height: 2.25rem;
	padding: 0.4rem 0.7rem;
	border: 1px solid var(--color-border-strong);
	border-radius: var(--radius-pill);
	background: transparent;
	color: var(--color-ink);
	font-size: 0.85rem;
	font-weight: 600;
	line-height: 1.2;
}

.site-footer__theme-toggle:hover {
	background: var(--color-accent-soft);
}

@media (max-width: 700px) {
	.site-footer__bottom {
		grid-template-columns: minmax(0, 1fr) auto;
		gap: 0.5rem 1rem;
	}

	.site-footer__links {
		grid-column: 1 / -1;
	}
}
</style>
