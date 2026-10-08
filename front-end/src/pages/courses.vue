<script lang="ts" setup>
import { storeToRefs } from "pinia";
import {
	computed,
	defineAsyncComponent,
	inject,
	onMounted,
	ref,
	watch
} from "vue";
import { routeLocationKey } from "vue-router";
import AccessModeToggle from "@/components/AccessModeToggle.vue";
import CourseCodeAccessForm from "@/components/CourseCodeAccessForm.vue";
import { hasOpenCourseCatalog } from "@/modules/catalogVisibility";
import { useAppStore } from "@/stores/app";

defineOptions({ name: "CoursesPage" });

const CourseExplorer = defineAsyncComponent(
	() => import("@/components/CourseExplorer.vue")
);

const app = useAppStore();
const siteReady = ref(false);
const openCatalog = ref(false);
onMounted(() => {
	openCatalog.value = hasOpenCourseCatalog(window.location.origin);
	siteReady.value = true;
});
const route = inject(routeLocationKey, null);
const accessMode = ref<"account" | "course-code">("account");
watch(
	() => route?.hash,
	hash => {
		if (hash === "#classroom-access") accessMode.value = "course-code";
	},
	{ immediate: true }
);
const {
	currentAdmin,
	currentCourseLearner,
	currentTutor,
	currentUser,
	isLoggedIn
} = storeToRefs(app);

const hasAssignedCourseAccess = computed(() => {
	if (currentAdmin.value) return true;
	if (currentTutor.value) {
		return (currentTutor.value.coursePermissions?.length ?? 0) > 0;
	}
	if (currentUser.value) {
		return (currentUser.value.courseAccess?.length ?? 0) > 0;
	}
	if (currentCourseLearner.value) {
		return currentCourseLearner.value.courseAccess.length > 0;
	}
	return false;
});

const heroEyebrow = computed(() => "Course library");

const heroTitle = computed(() => {
	if (!isLoggedIn.value) return "Open Your Courses";
	if (currentCourseLearner.value) return "Your Course";
	if (hasAssignedCourseAccess.value) return "Your Courses";
	return "No Courses Yet";
});

const heroCopy = computed(() => {
	if (!isLoggedIn.value) {
		return "Log in with an account or use the classroom code and username supplied by your tutor.";
	}

	if (currentCourseLearner.value) {
		return `Signed in as ${currentCourseLearner.value.username}. Your Python and Java projects sync to this classroom workspace. Scratch projects need a downloaded .sb3 file; graphs save on this device.`;
	}

	if (hasAssignedCourseAccess.value) {
		return "Search your assigned courses and open module summaries and project links.";
	}

	return "Course access is usually added after enrollment or account setup.";
});

function openLogin() {
	app.setLoginBlock(true);
}

function openSignup() {
	app.setSignupBlock(true);
}
</script>

<template>
	<section
		class="page-shell page-shell--wide courses-page"
		:class="{ 'is-learning': hasAssignedCourseAccess }"
	>
		<template v-if="!siteReady">
			<h1 class="sr-only">Courses</h1>
			<p role="status">Loading courses…</p>
		</template>
		<template v-else-if="openCatalog">
			<h1 class="sr-only">Courses</h1>
			<div v-if="!isLoggedIn" class="catalog-signin">
				<span
					>Sign in for personal course progress and management.</span
				>
				<button type="button" @click="openLogin">Sign in</button>
			</div>
			<CourseExplorer :public-catalog="!isLoggedIn" browse-all />
		</template>
		<template v-else>
			<h1 v-if="hasAssignedCourseAccess" class="sr-only">
				{{ heroTitle }}
			</h1>
			<header v-else class="courses-hero">
				<div class="courses-copy">
					<p class="page-eyebrow">{{ heroEyebrow }}</p>
					<h1 class="page-title courses-title">{{ heroTitle }}</h1>
					<p class="page-copy">
						{{ heroCopy }}
					</p>
				</div>

				<div
					v-if="isLoggedIn && !hasAssignedCourseAccess"
					class="site-action-row courses-actions"
				>
					<RouterLink
						class="site-button site-button--secondary"
						to="/profile"
					>
						Go to Account
					</RouterLink>
				</div>
			</header>

			<section
				v-if="!isLoggedIn"
				id="classroom-access"
				class="courses-code-entry"
			>
				<AccessModeToggle
					v-model="accessMode"
					label="Course access method"
				/>
				<div
					v-show="accessMode === 'account'"
					class="courses-account-entry"
				>
					<div class="site-action-row">
						<button
							class="site-button site-button--primary"
							type="button"
							@click="openLogin"
						>
							Log in
						</button>
						<button
							class="site-button site-button--secondary"
							type="button"
							@click="openSignup"
						>
							Sign up
						</button>
					</div>
					<RouterLink class="text-link" to="/signup"
						>Schedule Class</RouterLink
					>
					<RouterLink class="text-link" to="/pathways">
						Explore course pathways
					</RouterLink>
				</div>
				<div v-show="accessMode === 'course-code'">
					<CourseCodeAccessForm embedded />
				</div>
			</section>

			<section
				v-else-if="!hasAssignedCourseAccess"
				class="courses-gate site-surface site-surface--soft"
				role="status"
			>
				<h2>Get course access</h2>
				<p>
					{{
						currentTutor
							? "Ask an administrator to enable your teaching courses, or email"
							: "Ask your tutor to assign a course, or email"
					}}
					<a class="text-link" href="mailto:contact@example.com">
						contact@example.com
					</a>
					if access should already be enabled.
				</p>
			</section>

			<CourseExplorer v-else />
		</template>
	</section>
</template>

<style scoped>
.catalog-signin {
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	justify-content: space-between;
	gap: 0.4rem 1rem;
	padding: 0.65rem 1rem;
	border: 1px solid var(--color-error-border);
	border-inline-start: 4px solid #dc2626;
	border-radius: 6px;
	background: var(--color-error-surface);
	color: var(--color-error-text);
	font-size: 0.95rem;
}
.catalog-signin button {
	border: 0;
	background: transparent;
	color: inherit;
	text-decoration: underline;
	text-underline-offset: 3px;
	font-weight: 600;
	padding: 0.3rem;
}
.courses-discovery {
	padding: 1rem;
}

.courses-code-entry {
	width: min(100%, 30rem);
	margin-inline: auto;
}

.courses-account-entry {
	display: flex;
	flex-wrap: wrap;
	gap: 0.85rem 1.25rem;
}

.courses-account-entry .site-action-row {
	width: 100%;
}

.courses-account-entry .site-button {
	flex: 1;
}
.is-learning .courses-hero {
	padding: 0.65rem 1rem;
}
.is-learning .courses-title {
	font-size: 1.4rem;
}
.is-learning .page-eyebrow,
.is-learning .page-copy {
	display: none;
}
.courses-page {
	display: flex;
	flex-direction: column;
	gap: 0.75rem;
}

.courses-hero {
	display: flex;
	flex-wrap: wrap;
	align-items: end;
	justify-content: space-between;
	gap: 1.5rem 2rem;
	padding: clamp(1.5rem, 2.7vw, 2.1rem);
}

.courses-copy {
	flex: 1 1 40rem;
	display: flex;
	flex-direction: column;
	gap: 0.85rem;
}

.courses-title {
	font-size: clamp(2.2rem, 4.4vw, 3.4rem);
}

.courses-actions {
	flex: 0 0 auto;
	justify-content: flex-start;
}

.courses-gate {
	padding: clamp(1.5rem, 2.8vw, 2.2rem);
	display: grid;
	gap: 0.85rem;
}

.courses-gate h2 {
	margin: 0 0 0.75rem;
	font-size: clamp(1.35rem, 2vw, 1.75rem);
}

.courses-gate p {
	margin: 0;
	max-width: 52rem;
	line-height: 1.7;
	color: var(--color-ink-soft);
}

@media (max-width: 1500px) {
	.courses-hero {
		align-items: stretch;
	}

	.courses-actions {
		width: 100%;
	}

	.courses-actions > * {
		flex: 1 1 12rem;
	}
}

@media (max-width: 700px) {
	.courses-page {
		padding-top: 0.5rem;
	}

	.courses-actions {
		width: 100%;
	}
}
</style>
