<script setup lang="ts">
defineProps<{ compact?: boolean }>();
</script>

<template>
	<footer class="site-footer" :class="{ 'site-footer--compact': compact }">
		<div
			v-if="!compact"
			class="site-shell site-shell--wide site-footer__inner"
		>
			<section class="site-footer__brand">
				<h2>Classes</h2>
				<p class="site-footer__summary">
					Course materials and tools for independent learning,
					classroom instruction and one-on-one sessions.
				</p>
			</section>

			<section class="site-footer__group">
				<h3>Connect</h3>
				<ul>
					<li>
						<a href="mailto:contact@example.com">
							Contact<span class="sr-only">
								(opens your email app)</span
							>
						</a>
					</li>
				</ul>
			</section>
		</div>

		<div class="site-shell site-shell--wide site-footer__bottom">
			<p>© {{ new Date().getFullYear() }} Classes.</p>
			<div class="site-action-row">
				<a v-if="compact" href="mailto:contact@example.com"
					>Contact<span class="sr-only">
						(opens your email app)</span
					></a
				>
				<RouterLink to="/privacy">Privacy</RouterLink>
			</div>
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
		</div>
	</footer>
</template>

<style scoped>
.site-footer.site-footer--compact {
	margin-top: 1.5rem;
	padding: 0.5rem 0;
}
.site-footer--compact .site-footer__bottom {
	margin-top: 0;
	padding: 0.5rem;
	border: 0;
}
.site-footer__bottom a {
	color: #9ec3f4;
}
.site-footer {
	margin-top: 4rem;
	padding: 3.5rem 0 1.75rem;
	background: #0f1c2a;
	color: #e6edf5;
}

.site-footer__inner {
	display: grid;
	grid-template-columns: minmax(0, 1.4fr) minmax(0, 0.9fr);
	gap: 2rem 2.5rem;
	align-items: start;
}

.site-footer__brand,
.site-footer__group {
	min-width: 0;
	display: grid;
	gap: 0.9rem;
	text-align: left;
}

.site-footer__brand h2 {
	font-size: clamp(1.9rem, 3vw, 2.4rem);
	color: #f6fbff;
}

.site-footer__summary {
	margin: 0;
	max-width: 28rem;
	color: #b8cadd;
	line-height: 1.7;
}

.site-footer__group h3 {
	margin: 0;
	font-size: 1.05rem;
	color: #f6fbff;
}

.site-footer__group ul {
	list-style: none;
	margin: 0;
	padding: 0;
	display: grid;
	gap: 0.75rem;
}

.site-footer__group a {
	color: #9ec3f4;
	font-weight: 600;
	text-decoration: none;
}

.site-footer__group a:hover {
	text-decoration: underline;
}

.site-footer__bottom {
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	justify-content: space-between;
	gap: 0.85rem 1rem;
	margin-top: 2rem;
	padding-top: 1rem;
	border-top: 1px solid rgba(184, 202, 221, 0.16);
}

.site-footer__bottom p {
	margin: 0;
	color: #8fa6c1;
	font-size: 0.9rem;
	text-align: left;
}

.site-footer__theme-toggle {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	min-height: 2.6rem;
	padding: 0.6rem 0.9rem;
	border: 1px solid rgba(158, 195, 244, 0.34);
	border-radius: 999px;
	background: rgba(255, 255, 255, 0.08);
	color: #f6fbff;
	font-weight: 800;
	line-height: 1.2;
	transition:
		background-color 0.18s ease,
		border-color 0.18s ease,
		transform 0.18s ease;
}

.site-footer__theme-toggle:hover {
	border-color: rgba(158, 195, 244, 0.62);
	background: rgba(158, 195, 244, 0.14);
	transform: translateY(-1px);
}

@media (max-width: 960px) {
	.site-footer__inner {
		grid-template-columns: 1fr;
	}

	.site-footer__brand h2 {
		font-size: clamp(1.6rem, 8vw, 2rem);
	}
}
</style>
