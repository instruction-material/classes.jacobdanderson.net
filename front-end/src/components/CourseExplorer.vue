<script lang="ts" setup>
import type {
	CourseDefinition,
	CourseModule,
	CourseModuleItem
} from "@/stores/courses";
import { storeToRefs } from "pinia";
import { computed, onMounted, ref, shallowRef, watch } from "vue";
import { useCoursesStore } from "@/stores/courses";
import LazyMarkdownContent from "./LazyMarkdownContent.vue";

interface ResourceLink {
	label: string;
	url: string;
}

const COURSE_SELECTION_STORAGE_KEY = "classes:course-library:selected-course";
const MODULE_SELECTION_STORAGE_KEY_PREFIX =
	"classes:course-library:selected-module:";

const coursesStore = useCoursesStore();
const { courses } = storeToRefs(coursesStore);

const searchQuery = ref("");
const selectedCourseId = ref("");
const activeModuleId = ref("");
const selectedCourse = shallowRef<CourseDefinition | null>(null);
const courseLoadError = ref("");
const isCourseLoading = ref(false);
const isStorageReady = ref(false);

const filteredCourses = computed(() => {
	const query = searchQuery.value.trim().toLowerCase();
	if (!query) return courses.value ?? [];
	return (courses.value ?? []).filter(course =>
		course.name.toLowerCase().includes(query)
	);
});

const courseStats = computed(() => {
	const course = selectedCourse.value;
	if (!course) return null;

	return {
		moduleCount: course.modules.length,
		lessonCount: course.modules.reduce(
			(total, module) => total + module.curriculum.length,
			0
		),
		projectCount: course.modules.reduce(
			(total, module) => total + module.supplementalProjects.length,
			0
		)
	};
});

const activeModule = computed(
	() =>
		selectedCourse.value?.modules.find(
			module => module.id === activeModuleId.value
		) ?? null
);

const activeModuleIndex = computed(() => {
	const course = selectedCourse.value;
	if (!course || !activeModule.value) return 0;
	return course.modules.findIndex(module => module.id === activeModule.value?.id);
});

watch(
	[filteredCourses, isStorageReady],
	([availableCourses, storageReady]) => {
		if (availableCourses.length === 0) {
			selectedCourseId.value = "";
			return;
		}

		if (storageReady) {
			const storedCourseId = readStoredValue(COURSE_SELECTION_STORAGE_KEY);
			if (
				storedCourseId &&
				availableCourses.some(course => course.id === storedCourseId)
			) {
				selectedCourseId.value = storedCourseId;
				return;
			}
		}

		if (
			!selectedCourseId.value ||
			!availableCourses.some(course => course.id === selectedCourseId.value)
		) {
			selectedCourseId.value = availableCourses[0].id;
		}
	},
	{ immediate: true }
);

watch(
	selectedCourseId,
	async (courseId, _previousCourseId, onCleanup) => {
		if (!courseId) {
			selectedCourse.value = null;
			courseLoadError.value = "";
			isCourseLoading.value = false;
			return;
		}

		let cancelled = false;
		onCleanup(() => {
			cancelled = true;
		});

		writeStoredValue(COURSE_SELECTION_STORAGE_KEY, courseId);
		isCourseLoading.value = true;
		courseLoadError.value = "";

		const course = await coursesStore.loadCourseById(courseId);

		if (cancelled) {
			return;
		}

		selectedCourse.value = course;
		courseLoadError.value = course
			? ""
			: "Unable to load this course right now.";
		isCourseLoading.value = false;
	},
	{ immediate: true }
);

watch(
	[selectedCourse, isStorageReady],
	([course, storageReady]) => {
		if (!course) {
			activeModuleId.value = "";
			return;
		}

		if (storageReady) {
			const storedModuleId = readStoredValue(
				moduleSelectionStorageKey(course.id)
			);

			if (
				storedModuleId &&
				course.modules.some(module => module.id === storedModuleId)
			) {
				activeModuleId.value = storedModuleId;
				return;
			}
		}

		activeModuleId.value = course.modules[0]?.id ?? "";
	},
	{ immediate: true }
);

watch(activeModuleId, moduleId => {
	if (!selectedCourse.value || !moduleId) {
		return;
	}

	writeStoredValue(moduleSelectionStorageKey(selectedCourse.value.id), moduleId);
});

function moduleSelectionStorageKey(courseId: string) {
	return `${MODULE_SELECTION_STORAGE_KEY_PREFIX}${courseId}`;
}

function readStoredValue(key: string) {
	if (!isStorageReady.value) return "";

	try {
		return window.localStorage.getItem(key) ?? "";
	} catch {
		return "";
	}
}

function writeStoredValue(key: string, value: string) {
	if (!isStorageReady.value) return;

	try {
		window.localStorage.setItem(key, value);
	} catch {
		// Ignore storage failures; the UI still works without persistence.
	}
}

function itemResourceLinks(item: CourseModuleItem): ResourceLink[] {
	const links: ResourceLink[] = [];

	if (item.projectLink) {
		links.push({
			label: "Project materials",
			url: item.projectLink
		});
	}

	if (item.datasetLink) {
		links.push({
			label: "Dataset",
			url: item.datasetLink
		});
	}

	return links;
}

function itemKeyPrefix(module: CourseModule) {
	return `${module.id}-item`;
}

onMounted(() => {
	isStorageReady.value = true;
});
</script>

<template>
	<section class="CourseExplorer">
		<aside class="course-list-panel">
			<div class="panel-heading">
				<h2>Course Library</h2>
				<p>Select a course to inspect modules, lessons, and project ideas.</p>
			</div>

			<label class="search-label" for="course-search">Search courses</label>
			<input
				id="course-search"
				v-model.trim="searchQuery"
				class="search-input"
				name="course-search"
				placeholder="Search by course name"
				type="search"
			/>

			<div v-if="filteredCourses.length > 0" class="course-list">
				<button
					v-for="course in filteredCourses"
					:key="course.id"
					class="course-button"
					:class="{ 'is-active': course.id === selectedCourseId }"
					type="button"
					@click="selectedCourseId = course.id"
				>
					<span>{{ course.name }}</span>
				</button>
			</div>
			<p v-else class="empty-state">
				No courses matched that search. Try a broader keyword.
			</p>
		</aside>

		<section class="course-detail-panel">
			<div v-if="isCourseLoading" class="status-card">Loading course material…</div>
			<div v-else-if="courseLoadError" class="status-card is-error">
				{{ courseLoadError }}
			</div>
			<div v-else-if="selectedCourse" class="course-shell">
				<header class="course-header">
					<div class="course-copy">
						<p class="eyebrow">Public course overview</p>
						<h2>{{ selectedCourse.name }}</h2>
						<p>
							Use the module list to inspect the scope of the course,
							review the core lesson sequence, and identify optional
							projects for extra practice.
						</p>
					</div>

					<div v-if="courseStats" class="stats-grid">
						<article class="stat-card">
							<strong>{{ courseStats.moduleCount }}</strong>
							<span>Modules</span>
						</article>
						<article class="stat-card">
							<strong>{{ courseStats.lessonCount }}</strong>
							<span>Core lessons</span>
						</article>
						<article class="stat-card">
							<strong>{{ courseStats.projectCount }}</strong>
							<span>Supplemental projects</span>
						</article>
					</div>
				</header>

				<nav aria-label="Course modules" class="module-nav">
					<button
						v-for="module in selectedCourse.modules"
						:key="module.id"
						class="module-button"
						:class="{ 'is-active': module.id === activeModuleId }"
						type="button"
						@click="activeModuleId = module.id"
					>
						{{ module.title }}
					</button>
				</nav>

				<section v-if="activeModule" class="module-panel">
					<header class="module-header">
						<p class="eyebrow">
							Module {{ activeModuleIndex + 1 }} of
							{{ selectedCourse.modules.length }}
						</p>
						<h3>{{ activeModule.title }}</h3>
					</header>

					<div class="module-columns">
						<section class="module-column">
							<div class="column-heading">
								<h4>Core lessons</h4>
								<p>{{ activeModule.curriculum.length }} items</p>
							</div>

							<article
								v-for="(item, index) in activeModule.curriculum"
								:key="`${itemKeyPrefix(activeModule)}-core-${item.id}`"
								class="item-card"
							>
								<header class="item-header">
									<div>
										<p class="item-index">Lesson {{ index + 1 }}</p>
										<h5>{{ item.title }}</h5>
									</div>
									<div
										v-if="itemResourceLinks(item).length > 0"
										class="resource-links"
									>
										<a
											v-for="link in itemResourceLinks(item)"
											:key="link.url"
											:href="link.url"
											rel="noopener"
											target="_blank"
										>
											{{ link.label }}
										</a>
									</div>
								</header>
								<LazyMarkdownContent :content="item.content" />
							</article>
						</section>

						<section class="module-column">
							<div class="column-heading">
								<h4>Supplemental projects</h4>
								<p>{{ activeModule.supplementalProjects.length }} items</p>
							</div>

							<article
								v-for="(item, index) in activeModule.supplementalProjects"
								:key="`${itemKeyPrefix(activeModule)}-supplemental-${item.id}`"
								class="item-card"
							>
								<header class="item-header">
									<div>
										<p class="item-index">Project {{ index + 1 }}</p>
										<h5>{{ item.title }}</h5>
									</div>
									<div
										v-if="itemResourceLinks(item).length > 0"
										class="resource-links"
									>
										<a
											v-for="link in itemResourceLinks(item)"
											:key="link.url"
											:href="link.url"
											rel="noopener"
											target="_blank"
										>
											{{ link.label }}
										</a>
									</div>
								</header>
								<LazyMarkdownContent :content="item.content" />
							</article>

							<p
								v-if="activeModule.supplementalProjects.length === 0"
								class="supplemental-empty"
							>
								This module does not include extra projects yet.
							</p>
						</section>
					</div>
				</section>
			</div>
		</section>
	</section>
</template>

<style scoped>
.CourseExplorer {
	display: grid;
	grid-template-columns: minmax(260px, 320px) minmax(0, 1fr);
	gap: 1.5rem;
	align-items: start;
}

.course-list-panel,
.course-detail-panel {
	background: white;
	border-radius: 28px;
	box-shadow: 0 18px 40px rgba(16, 42, 66, 0.08);
}

.course-list-panel {
	padding: 1.5rem;
	display: grid;
	gap: 1rem;
	position: sticky;
	top: 1.5rem;
}

.panel-heading {
	display: grid;
	gap: 0.5rem;
}

.panel-heading h2,
.course-copy h2,
.module-header h3 {
	margin: 0;
}

.panel-heading p,
.course-copy p,
.module-header p,
.column-heading p,
.supplemental-empty {
	margin: 0;
	color: #48617a;
	line-height: 1.6;
}

.search-label {
	font-size: 0.95rem;
	font-weight: 600;
	color: #19314a;
}

.search-input {
	border: 1px solid #d1dceb;
	border-radius: 14px;
	padding: 0.8rem 0.95rem;
	font: inherit;
}

.course-list {
	display: grid;
	gap: 0.75rem;
}

.course-button,
.module-button {
	border: 1px solid transparent;
	background: #f4f8fc;
	color: #19314a;
	border-radius: 16px;
	padding: 0.9rem 1rem;
	font: inherit;
	font-weight: 600;
	text-align: left;
	transition:
		background-color 0.2s ease,
		border-color 0.2s ease,
		transform 0.2s ease;
}

.course-button:hover,
.module-button:hover {
	background: #e9f2fb;
	transform: translateY(-1px);
}

.course-button.is-active,
.module-button.is-active {
	background: #1f3d5a;
	color: white;
	border-color: #1f3d5a;
}

.empty-state,
.status-card {
	margin: 0;
	padding: 1rem 1.1rem;
	border-radius: 18px;
	background: #f4f8fc;
	color: #48617a;
}

.status-card.is-error {
	background: #fff1f2;
	color: #9f1239;
}

.course-detail-panel {
	padding: 1.5rem;
}

.course-shell {
	display: grid;
	gap: 1.5rem;
}

.course-header {
	display: grid;
	gap: 1rem;
}

.course-copy {
	display: grid;
	gap: 0.75rem;
}

.eyebrow {
	margin: 0;
	text-transform: uppercase;
	letter-spacing: 0.12em;
	font-size: 0.8rem;
	font-weight: 700;
	color: #3a6ea5;
}

.stats-grid {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
	gap: 0.85rem;
}

.stat-card {
	background: #f4f8fc;
	border-radius: 20px;
	padding: 1rem;
	display: grid;
	gap: 0.25rem;
}

.stat-card strong {
	font-size: 1.8rem;
	color: #19314a;
}

.stat-card span {
	color: #48617a;
	font-weight: 600;
}

.module-nav {
	display: flex;
	flex-wrap: wrap;
	gap: 0.75rem;
}

.module-panel {
	display: grid;
	gap: 1.25rem;
}

.module-header {
	display: grid;
	gap: 0.35rem;
}

.module-columns {
	display: grid;
	grid-template-columns: repeat(2, minmax(0, 1fr));
	gap: 1rem;
}

.module-column {
	display: grid;
	gap: 1rem;
	align-content: start;
}

.column-heading {
	display: grid;
	gap: 0.35rem;
}

.column-heading h4,
.item-header h5 {
	margin: 0;
}

.item-card {
	background: #fbfdff;
	border: 1px solid #e1eaf5;
	border-radius: 22px;
	padding: 1.25rem;
	display: grid;
	gap: 0.9rem;
}

.item-header {
	display: grid;
	gap: 0.75rem;
}

.item-index {
	margin: 0 0 0.35rem;
	font-size: 0.8rem;
	font-weight: 700;
	text-transform: uppercase;
	letter-spacing: 0.08em;
	color: #6a85a3;
}

.resource-links {
	display: flex;
	flex-wrap: wrap;
	gap: 0.5rem;
}

.resource-links a {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	padding: 0.45rem 0.75rem;
	border-radius: 999px;
	background: #e9f2fb;
	color: #1f3d5a;
	font-size: 0.9rem;
	font-weight: 600;
	text-decoration: none;
}

.resource-links a:hover {
	background: #dbe9f8;
}

:deep(.item-content-markdown p) {
	margin: 0;
	line-height: 1.7;
	color: #213448;
}

:deep(.item-content-markdown p + p) {
	margin-top: 0.85rem;
}

:deep(.item-content-markdown code) {
	background: #edf4fb;
	padding: 0.1rem 0.35rem;
	border-radius: 0.35rem;
}

@media (max-width: 1100px) {
	.CourseExplorer {
		grid-template-columns: 1fr;
	}

	.course-list-panel {
		position: static;
	}
}

@media (max-width: 800px) {
	.module-columns {
		grid-template-columns: 1fr;
	}
}
</style>
