<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { computed, ref, watch } from "vue";
import { useRoute } from "vue-router";
import WorkspaceDisclosure from "@/components/WorkspaceDisclosure.vue";
import { classMeetingUrl, siteLabels } from "@/modules/siteNavigation";
import { useAppStore } from "@/stores/app";

const emit = defineEmits<{
	(e: "loginClick"): void;
	(e: "signupClick"): void;
}>();

const app = useAppStore();
const route = useRoute();
const accountMenu = ref<InstanceType<typeof WorkspaceDisclosure>>();
watch(
	() => route.fullPath,
	() => {
		accountMenu.value?.close();
	}
);
const {
	currentAdmin,
	currentCourseLearner,
	currentTutor,
	currentUser,
	isLoggedIn,
	isAdmin,
	isSessionResolved
} = storeToRefs(app);

interface NavLink {
	label: string;
	to: string;
	exact?: boolean;
	external?: boolean;
}

const primaryLinks = computed<NavLink[]>(() => {
	const links: NavLink[] = [
		{ label: siteLabels.courses, to: "/courses", exact: true },
		{ label: siteLabels.graphing, to: "/graph-sketcher", exact: true },
		{ label: siteLabels.ide, to: "/ide", exact: true }
	];

	if (!isSessionResolved.value) return links;

	if (isLoggedIn.value && !isAdmin.value && !currentTutor.value) {
		links.push({
			label: siteLabels.join,
			to: classMeetingUrl,
			external: false
		});
	}

	if (!isAdmin.value && !currentTutor.value) {
		links.push({
			label: siteLabels.booking,
			to: "/signup",
			exact: true
		});
	}

	if (!isLoggedIn.value) {
		links.push({ label: "About", to: "/about", exact: true });
		links.push({
			label: siteLabels.join,
			to: classMeetingUrl,
			external: false
		});
	}

	return links;
});

const workspaceLinks = computed<NavLink[]>(() => {
	const links: NavLink[] = [];

	if (isAdmin.value) {
		links.push({ label: "Admin", to: "/admin", exact: false });
	}

	if (currentTutor.value) {
		links.push({ label: "Teaching", to: "/teaching", exact: false });
	}

	return links;
});

const accountBadge = computed(() => {
	if (currentAdmin.value) return "Administrator";
	if (currentTutor.value) return "Tutor";
	if (currentUser.value) return "Student";
	if (currentCourseLearner.value) {
		return `Classroom: ${currentCourseLearner.value.username}`;
	}
	return null;
});

function logoutUser() {
	accountMenu.value?.close();
	app.logout();
}

function isLinkActive(link: NavLink) {
	if (link.exact === false) {
		return route.path === link.to || route.path.startsWith(`${link.to}/`);
	}

	return route.path === link.to;
}
</script>

<template>
	<header
		class="site-header"
		:class="{ 'site-header--compact': route.path !== '/' }"
	>
		<div class="site-shell site-shell--wide">
			<nav class="navbar navbar-expand-xl site-nav">
				<div class="site-nav__inner site-surface site-surface--strong">
					<router-link class="site-brand" to="/">
						<span class="site-brand__title">Classes</span>
					</router-link>
					<button
						aria-controls="siteNavbar"
						aria-expanded="false"
						aria-label="Toggle navigation"
						class="navbar-toggler site-toggler"
						data-bs-target="#siteNavbar"
						data-bs-toggle="collapse"
						type="button"
					>
						<span class="navbar-toggler-icon" />
					</button>
					<div
						id="siteNavbar"
						class="collapse navbar-collapse site-nav__panel"
					>
						<div class="site-nav__content">
							<ul class="site-nav__links">
								<li v-for="link in primaryLinks" :key="link.to">
									<a
										v-if="link.external"
										class="site-nav__link"
										:href="link.to"
										target="_blank"
										rel="noopener noreferrer"
										>{{ link.label
										}}<span class="sr-only">
											(opens in a new tab)</span
										></a
									>
									<router-link
										v-else
										class="site-nav__link"
										:class="{
											'is-active': isLinkActive(link),
											'site-nav__book':
												link.to === '/signup'
										}"
										:to="link.to"
									>
										{{ link.label }}
									</router-link>
								</li>
							</ul>

							<div class="site-nav__aside">
								<div class="site-nav__actions">
									<router-link
										v-for="link in workspaceLinks"
										:key="link.to"
										class="site-button site-button--secondary site-nav__action"
										:class="{
											'is-active': isLinkActive(link)
										}"
										:to="link.to"
									>
										{{ link.label }}
									</router-link>

									<RouterLink
										v-if="isSessionResolved && !isLoggedIn"
										class="site-nav__link site-nav__payment"
										:class="{
											'is-active':
												route.path === '/payment'
										}"
										to="/payment"
										>Payment</RouterLink
									>
									<WorkspaceDisclosure
										v-if="isLoggedIn"
										ref="accountMenu"
										class="site-account-menu"
										popover
									>
										<template #label>
											{{
												currentCourseLearner
													? "Classroom"
													: siteLabels.account
											}}
										</template>
										<div class="site-account-menu__content">
											<span class="site-nav__badge">{{
												accountBadge
											}}</span>
											<RouterLink
												class="site-nav__link"
												to="/profile"
												>{{
													currentCourseLearner
														? "Classroom settings"
														: "Account settings"
												}}</RouterLink
											>
											<button
												class="site-button site-button--secondary site-nav__action site-nav__action--danger"
												type="button"
												@click="logoutUser"
											>
												Log out
											</button>
										</div>
									</WorkspaceDisclosure>
									<button
										v-else-if="isSessionResolved"
										class="site-button site-button--secondary site-nav__action"
										type="button"
										@click="emit('loginClick')"
									>
										Log in
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</nav>
		</div>
	</header>
</template>

<style scoped>
.site-header.site-header--compact {
	padding-top: 0;
	border-bottom: 1px solid var(--color-border);
}
.site-header--compact .site-nav__inner {
	padding: 0.25rem 0;
	border: 0;
	border-radius: 0;
	background: transparent;
	box-shadow: none;
	gap: 0.5rem 1rem;
}
.site-header--compact .site-brand__title {
	font-size: 1.15rem;
}
.site-header--compact
	:is(
		.site-nav__link,
		.site-nav__action,
		:deep(.workspace-disclosure__trigger)
	) {
	min-height: 2.75rem;
	padding: 0.35rem 0.65rem;
	font-size: 0.9rem;
}
.site-header--compact .site-nav__aside {
	gap: 0.35rem;
}
.site-header {
	position: relative;
	z-index: 1;
	padding-top: 0.9rem;
}

.site-nav {
	width: 100%;
	padding: 0;
}

.site-nav__panel {
	flex: 1 1 auto;
	min-width: 0;
}

.site-nav__inner {
	width: 100%;
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	justify-content: space-between;
	gap: 0.85rem 1.25rem;
	padding: 0.9rem 1rem;
}

.site-brand {
	display: inline-flex;
	align-items: center;
	flex: 0 0 auto;
	text-decoration: none;
}

.site-brand__title {
	font-family: var(--font-display);
	font-size: clamp(1.35rem, 2vw, 1.55rem);
	font-weight: 600;
	letter-spacing: -0.02em;
	color: var(--color-ink);
}

.site-toggler {
	border: 1px solid var(--color-border);
	border-radius: var(--radius-sm);
	background: rgba(255, 255, 255, 0.74);
}

.site-nav__content {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: clamp(1rem, 2vw, 2.25rem);
	width: 100%;
	min-width: 0;
}

.site-nav__links {
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	gap: 0.55rem;
	margin: 0;
	padding: 0;
	list-style: none;
}

.site-nav__links {
	flex: 1 1 auto;
	justify-content: center;
	min-width: 0;
}

.site-nav__aside {
	display: flex;
	flex: 0 0 auto;
	flex-wrap: wrap;
	align-items: center;
	justify-content: flex-end;
	gap: 0.85rem;
	margin-left: auto;
	min-width: 0;
}

.site-nav__link {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	padding: 0.55rem 0.75rem;
	border-radius: var(--radius-sm);
	color: var(--color-ink-soft);
	font-weight: 600;
	text-decoration: none;
	transition:
		background-color 0.18s ease,
		color 0.18s ease,
		box-shadow 0.18s ease;
}

.site-nav__link:hover,
.site-nav__link.is-active {
	color: var(--color-ink);
	background: rgba(255, 255, 255, 0.64);
	box-shadow: inset 0 0 0 1px rgba(15, 23, 42, 0.08);
}

.site-nav__book,
.site-nav__book:hover,
.site-nav__book.is-active {
	color: var(--color-button-primary-text);
	background: var(--color-button-primary-bg);
	box-shadow: none;
}

.site-nav__actions {
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	justify-content: flex-end;
	gap: 0.65rem;
	flex-shrink: 0;
}

.site-nav__payment,
.site-nav__payment:hover,
.site-nav__payment.is-active {
	color: var(--color-accent);
	text-decoration: underline;
	text-underline-offset: 0.2em;
}

.site-nav__badge {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	padding: 0.45rem 0.7rem;
	border-radius: var(--radius-pill);
	background: rgba(31, 92, 145, 0.08);
	color: var(--color-accent);
	font-size: 0.78rem;
	font-weight: 800;
	text-transform: uppercase;
	letter-spacing: 0.08em;
}

.site-nav__action {
	min-height: 2.9rem;
	padding-inline: 1rem;
}

.site-nav__action.is-active {
	background: rgba(255, 255, 255, 0.92);
	border-color: rgba(31, 92, 145, 0.24);
}

.site-nav__action--danger {
	color: #8c1d26;
	background: rgba(255, 245, 245, 0.96);
	border-color: rgba(244, 114, 114, 0.35);
	box-shadow: none;
}

@media (max-width: 1199px) {
	.site-nav__content {
		flex-direction: column;
		align-items: stretch;
		margin-top: 0.9rem;
	}

	.site-nav__aside {
		flex: 0 0 auto;
		justify-content: flex-start;
	}

	.site-nav__actions {
		justify-content: flex-start;
	}
}

@media (max-width: 700px) {
	.site-nav__links {
		width: 100%;
	}

	.site-nav__links > li {
		width: 100%;
	}

	.site-nav__link,
	.site-nav__action {
		width: 100%;
	}

	.site-nav__actions {
		width: 100%;
	}
}
.site-account-menu {
	position: relative;
}
.site-account-menu :deep(.workspace-disclosure__trigger) {
	display: flex;
	align-items: center;
	justify-content: center;
	list-style: none;
	cursor: pointer;
	padding: 0.65rem 0.85rem;
	border: 1px solid var(--color-border);
	border-radius: var(--radius-sm);
	color: var(--color-ink);
}
.site-account-menu__content {
	min-width: 14rem;
	display: grid;
	gap: 0.5rem;
}
@media (max-width: 1199px) {
	.site-account-menu :deep(.workspace-disclosure__content) {
		position: static;
		margin-top: 0.4rem;
	}
}
</style>
