<script lang="ts" setup>
import type { AdminRecipient } from "@/modules/adminRecipients";
import type {
	CourseAccessStatus,
	CourseStatusMap
} from "@/modules/courseAccess";
import { storeToRefs } from "pinia";
import { computed, onMounted, ref, watch } from "vue";
import { api } from "@/api";
import AccessibleDialog from "@/components/AccessibleDialog.vue";
import CourseAccessCodeManager from "@/components/CourseAccessCodeManager.vue";
import LearnerCodeReviewTools from "@/components/LearnerCodeReviewTools.vue";
import LearnerContextActions from "@/components/LearnerContextActions.vue";
import LearnerSessionTools from "@/components/LearnerSessionTools.vue";
import SelfAccountSettings from "@/components/SelfAccountSettings.vue";
import { useDeleteAccount } from "@/composables/useDeleteAccount";
import { fetchAdminRecipients } from "@/modules/adminRecipients";
import {
	cleanCourseStatusMap,
	groupCoursesByLearnerStatus
} from "@/modules/courseAccess";
import { useAppStore } from "@/stores/app";
import { useCoursesStore } from "@/stores/courses";

const props = defineProps<{
	mode?: "account" | "people" | "profile" | "manage";
}>();

/* -------------------------------------------------- */
const app = useAppStore();
const { currentAdmin, tutors, users } = storeToRefs(app);
const learnerSearch = ref("");
const filteredUsers = computed(() =>
	users.value.filter(user =>
		`${user.name} ${user.email}`
			.toLowerCase()
			.includes(learnerSearch.value.trim().toLowerCase())
	)
);
const error = ref("");
const success = ref("");
const deleteMe = useDeleteAccount("admin");
const userAssignments = ref<Record<string, string[]>>({});
const userEditing = ref<Record<string, boolean>>({});
const userRecipientNames = ref<Record<string, string>>({});
const tutorEditing = ref<Record<string, boolean>>({});
const tutorCourseSelections = ref<Record<string, string[]>>({});
const userCourseSelections = ref<Record<string, string[]>>({});
const userCourseStatuses = ref<Record<string, CourseStatusMap>>({});
const adminRecipients = ref<AdminRecipient[]>([]);
const recipientListError = ref("");
const confirmation = ref<{
	confirmLabel: string;
	description: string;
	onConfirm: () => Promise<void> | void;
	title: string;
	variant?: "danger" | "primary";
} | null>(null);
const confirmationBusy = ref(false);

const viewMode = computed(() => props.mode ?? "profile");

const coursesStore = useCoursesStore();
const { courses } = storeToRefs(coursesStore);
const courseOptions = computed(() => courses.value ?? []);
const courseNameMap = computed<Record<string, string>>(
	() =>
		courseOptions.value?.reduce(
			(map, course) => {
				map[course.id] = course.name;
				return map;
			},
			{} as Record<string, string>
		) ?? {}
);
const adminRecipientNames = computed(() =>
	adminRecipients.value.map(recipient => recipient.name)
);
const confirmationTitle = computed(() => confirmation.value?.title ?? "");
const confirmationDescription = computed(
	() => confirmation.value?.description ?? ""
);
const confirmationConfirmLabel = computed(
	() => confirmation.value?.confirmLabel ?? "Confirm"
);
const isPeopleMode = computed(
	() => viewMode.value === "people" || viewMode.value === "manage"
);
const isAccountMode = computed(() => !isPeopleMode.value);

/* fetch everything once */
async function loadAll() {
	if (isAccountMode.value) {
		await app.refreshCurrentAdmin();
		return;
	}
	const recipientListRequest = fetchAdminRecipients()
		.then(recipients => {
			adminRecipients.value = recipients;
			recipientListError.value = "";
		})
		.catch((error: any) => {
			adminRecipients.value = [];
			recipientListError.value =
				error?.response?.data?.message ??
				error?.message ??
				"Unable to load saved recipient labels.";
		});

	await Promise.all([
		app.fetchTutors(),
		app.fetchUsers(),
		app.refreshCurrentAdmin(),
		recipientListRequest
	]);
}

onMounted(loadAll);

watch(
	users,
	value => {
		const assignments: Record<string, string[]> = {};
		const editing: Record<string, boolean> = {};
		const courses: Record<string, string[]> = {};
		const courseStatuses: Record<string, CourseStatusMap> = {};
		const recipientNames: Record<string, string> = {};
		for (const user of value) {
			assignments[user._id] = (user.tutors ?? []).map(t =>
				typeof t === "string" ? t : t._id
			);
			editing[user._id] = false;
			courses[user._id] = [...(user.courseAccess ?? [])];
			courseStatuses[user._id] = cleanCourseStatusMap(
				courses[user._id],
				user.courseStatus
			);
			recipientNames[user._id] = user.recipientName ?? "";
		}
		userAssignments.value = assignments;
		userEditing.value = editing;
		userCourseSelections.value = courses;
		userCourseStatuses.value = courseStatuses;
		userRecipientNames.value = recipientNames;
	},
	{ immediate: true }
);

watch(
	tutors,
	value => {
		const selections: Record<string, string[]> = {};
		const editing: Record<string, boolean> = {};
		for (const tutor of value) {
			selections[tutor._id] = [...(tutor.coursePermissions ?? [])];
			editing[tutor._id] = false;
		}
		tutorCourseSelections.value = selections;
		tutorEditing.value = editing;
	},
	{ immediate: true }
);

const tutorsHeader = computed(() =>
	currentAdmin.value && tutors.value.length === 0 ? "No Tutors Yet" : "Tutors"
);

const usersHeader = computed(() =>
	currentAdmin.value && users.value.length === 0
		? "No Learners Yet"
		: "Learners"
);

const tutorLookup = computed(() => {
	const lookup: Record<string, string> = {};
	for (const t of tutors.value) lookup[t._id] = t.name;
	return lookup;
});

function assignedTutorNames(userID: string) {
	const assigned = userAssignments.value[userID] ?? [];
	return assigned.map(id => tutorLookup.value[id] ?? "Unknown");
}

function assignedTutorLabel(userID: string) {
	return assignedTutorNames(userID).length === 1
		? "Assigned tutor"
		: "Assigned tutors";
}

function tutorCourseLabels(tutorID: string) {
	const list = tutorCourseSelections.value[tutorID] ?? [];
	const names = courseNameMap.value ?? {};
	return list.map(id => names[id] ?? id);
}

function userCourseGroups(userID: string, includeOther = false) {
	return groupCoursesByLearnerStatus(
		courseOptions.value,
		{
			courseAccess: userCourseSelections.value[userID] ?? [],
			courseStatus: userCourseStatuses.value[userID] ?? {}
		},
		{ includeOther }
	);
}

function userCourseStatus(userID: string, courseID: string) {
	return userCourseStatuses.value[userID]?.[courseID] ?? "current";
}

function recipientOptionsForUser(userID: string) {
	const currentValue = userRecipientNames.value[userID]?.trim();
	if (!currentValue || adminRecipientNames.value.includes(currentValue)) {
		return adminRecipientNames.value;
	}
	return [...adminRecipientNames.value, currentValue];
}

function startUserEdit(userID: string) {
	userEditing.value = { ...userEditing.value, [userID]: true };
	success.value = "";
	error.value = "";
}

function cancelUserEdit(userID: string) {
	const user = users.value.find(u => u._id === userID);
	if (user) {
		userAssignments.value = {
			...userAssignments.value,
			[userID]: (user.tutors ?? []).map(t =>
				typeof t === "string" ? t : t._id
			)
		};
		userCourseSelections.value = {
			...userCourseSelections.value,
			[userID]: [...(user.courseAccess ?? [])]
		};
		userCourseStatuses.value = {
			...userCourseStatuses.value,
			[userID]: cleanCourseStatusMap(
				user.courseAccess ?? [],
				user.courseStatus
			)
		};
		userRecipientNames.value = {
			...userRecipientNames.value,
			[userID]: user.recipientName ?? ""
		};
	}
	userEditing.value = { ...userEditing.value, [userID]: false };
	success.value = "";
	error.value = "";
}

function toggleTutorEdit(tutorID: string) {
	tutorEditing.value = {
		...tutorEditing.value,
		[tutorID]: !tutorEditing.value[tutorID]
	};
	success.value = "";
	error.value = "";
}

function cancelTutorEdit(tutorID: string) {
	const tutor = tutors.value.find(t => t._id === tutorID);
	if (tutor) {
		tutorCourseSelections.value = {
			...tutorCourseSelections.value,
			[tutorID]: [...(tutor.coursePermissions ?? [])]
		};
	}
	tutorEditing.value = { ...tutorEditing.value, [tutorID]: false };
	success.value = "";
	error.value = "";
}

function onTutorCourseToggle(
	tutorID: string,
	courseID: string,
	checked: boolean
) {
	const existing = new Set(tutorCourseSelections.value[tutorID] ?? []);
	if (checked) existing.add(courseID);
	else existing.delete(courseID);
	tutorCourseSelections.value = {
		...tutorCourseSelections.value,
		[tutorID]: [...existing]
	};
}

function onTutorSelectionChange(userID: string, event: Event) {
	const target = event.target as HTMLSelectElement;
	const selected = Array.from(target.selectedOptions).map(
		option => option.value
	);
	userAssignments.value = {
		...userAssignments.value,
		[userID]: selected
	};
}

async function saveTutorCourses(tutorID: string) {
	try {
		success.value = "";
		error.value = "";
		await api.put(`/tutors/${tutorID}/courses`, {
			courseIDs: tutorCourseSelections.value[tutorID] ?? []
		});
		success.value = "Updated tutor course access.";
		await app.fetchTutors();
		tutorEditing.value = { ...tutorEditing.value, [tutorID]: false };
	} catch (e: any) {
		error.value =
			e.response?.data?.message ??
			e.message ??
			"Unable to update tutor courses";
	}
}

async function demoteTutor(tutorID: string) {
	try {
		success.value = "";
		error.value = "";
		await api.post(`/tutors/${tutorID}/demote`);
		await Promise.all([app.fetchUsers(), app.fetchTutors()]);
		success.value = "Tutor demoted to user.";
	} catch (e: any) {
		error.value =
			e.response?.data?.message ?? e.message ?? "Unable to demote tutor";
	}
}

const userAllowedCourses = computed(() => {
	const lookup: Record<string, Set<string>> = {};
	for (const userID of Object.keys(userAssignments.value)) {
		const tutorsForUser = userAssignments.value[userID] ?? [];
		const allowed = new Set<string>();
		for (const tutorID of tutorsForUser) {
			const courses = tutorCourseSelections.value[tutorID] ?? [];
			for (const course of courses) allowed.add(course);
		}
		lookup[userID] = allowed;
	}
	return lookup;
});

function normalizeCourseStatus(status: string): CourseAccessStatus {
	if (status === "past") return "past";
	if (status === "available") return "available";
	return "current";
}

function onUserCourseToggle(
	userID: string,
	courseID: string,
	checked: boolean
) {
	const existing = new Set(userCourseSelections.value[userID] ?? []);
	if (checked) existing.add(courseID);
	else existing.delete(courseID);
	const nextCourses = [...existing];
	const nextStatuses = cleanCourseStatusMap(
		nextCourses,
		userCourseStatuses.value[userID] ?? {}
	);
	userCourseSelections.value = {
		...userCourseSelections.value,
		[userID]: nextCourses
	};
	userCourseStatuses.value = {
		...userCourseStatuses.value,
		[userID]: nextStatuses
	};
}

function onUserCourseStatusChange(
	userID: string,
	courseID: string,
	status: string
) {
	if (!(userCourseSelections.value[userID] ?? []).includes(courseID)) return;
	userCourseStatuses.value = {
		...userCourseStatuses.value,
		[userID]: {
			...(userCourseStatuses.value[userID] ?? {}),
			[courseID]: normalizeCourseStatus(status)
		}
	};
}

async function saveUserEditorChanges(userID: string) {
	try {
		success.value = "";
		error.value = "";
		const allowed = userAllowedCourses.value[userID] ?? new Set<string>();
		const selection = (userCourseSelections.value[userID] ?? []).filter(
			id => allowed.has(id)
		);
		const courseStatus = cleanCourseStatusMap(
			selection,
			userCourseStatuses.value[userID]
		);

		await api.put(`/users/${userID}/recipient`, {
			recipientName: userRecipientNames.value[userID] ?? ""
		});
		await api.put(`/users/${userID}/tutors`, {
			tutorIDs: userAssignments.value[userID] ?? []
		});
		await api.put(`/users/${userID}/courses`, {
			courseIDs: selection,
			courseStatus
		});

		await Promise.all([app.fetchUsers(), app.fetchTutors()]);
		userEditing.value = { ...userEditing.value, [userID]: false };
		success.value = "Saved learner assignments.";
	} catch (e: any) {
		error.value =
			e.response?.data?.message ??
			e.message ??
			"Unable to save learner assignments";
	}
}

function openConfirmation(config: NonNullable<typeof confirmation.value>) {
	confirmation.value = config;
}

function closeConfirmation() {
	if (confirmationBusy.value) return;
	confirmation.value = null;
}

async function runConfirmation() {
	if (!confirmation.value) return;
	confirmationBusy.value = true;
	try {
		await confirmation.value.onConfirm();
		confirmation.value = null;
	} finally {
		confirmationBusy.value = false;
	}
}

function userDisplayName(userID: string) {
	return users.value.find(user => user._id === userID)?.name ?? "this user";
}

function tutorDisplayName(tutorID: string) {
	return (
		tutors.value.find(tutor => tutor._id === tutorID)?.name ?? "this tutor"
	);
}

function promoteToTutor(userID: string) {
	const name = userDisplayName(userID);
	openConfirmation({
		title: "Promote learner to tutor?",
		description: `${name} will move from the learner list to the tutor list and can be granted course permissions.`,
		confirmLabel: "Promote to tutor",
		variant: "primary",
		onConfirm: () => promoteUserToTutor(userID)
	});
}

async function promoteUserToTutor(userID: string) {
	try {
		await api.post(`/users/${userID}/promote`);
		await Promise.all([app.fetchUsers(), app.fetchTutors()]);
		success.value = "User promoted to tutor.";
		error.value = "";
	} catch (e: any) {
		error.value =
			e.response?.data?.message ?? e.message ?? "Unable to promote user";
	}
}

function confirmDemote(tutorID: string) {
	const name = tutorDisplayName(tutorID);
	openConfirmation({
		title: "Demote tutor to learner?",
		description: `${name} will lose tutor privileges and return to the learner list.`,
		confirmLabel: "Demote to user",
		variant: "danger",
		onConfirm: () => demoteTutor(tutorID)
	});
}

function removeTutor(tutorID: string) {
	const name = tutorDisplayName(tutorID);
	openConfirmation({
		title: "Delete tutor account?",
		description: `${name} will be permanently removed from the tutor directory.`,
		confirmLabel: "Delete tutor",
		variant: "danger",
		onConfirm: () => deleteTutor(tutorID)
	});
}

async function deleteTutor(tutorID: string) {
	try {
		await api.delete(`/tutors/remove/${tutorID}`);
		await app.fetchTutors();
		success.value = "Tutor removed.";
	} catch (e: any) {
		error.value =
			e.response?.data?.message ?? e.message ?? "Unable to delete tutor";
	}
}

function removeUser(userID: string) {
	const name = userDisplayName(userID);
	openConfirmation({
		title: "Delete learner account?",
		description: `${name} will be permanently removed from the learner directory.`,
		confirmLabel: "Delete user",
		variant: "danger",
		onConfirm: () => deleteUser(userID)
	});
}

async function deleteUser(userID: string) {
	try {
		await api.delete(`/users/admin/${userID}`);
		await app.fetchUsers();
		success.value = "User removed.";
	} catch (e: any) {
		error.value =
			e.response?.data?.message ?? e.message ?? "Unable to delete user";
	}
}

function confirmDeleteAdmin() {
	if (!currentAdmin.value) return;
	const admin = currentAdmin.value;
	openConfirmation({
		title: "Delete admin account?",
		description: `${admin.name} (${admin.email}) will be permanently removed. This is destructive and cannot be undone from this screen.`,
		confirmLabel: "Delete admin account",
		variant: "danger",
		onConfirm: () => deleteMe(admin._id)
	});
}
</script>

<template>
	<section class="admin-workspace">
		<p
			v-if="success"
			class="status-banner is-success"
			role="status"
			aria-live="polite"
		>
			{{ success }}
		</p>
		<p v-if="error" class="status-banner is-error" role="alert">
			{{ error }}
		</p>

		<template v-if="isAccountMode">
			<SelfAccountSettings
				v-if="currentAdmin"
				:entity="currentAdmin"
				role="admin"
			/>
		</template>

		<template v-else>
			<label class="roster-search"
				>Search learners<input
					v-model="learnerSearch"
					type="search"
					placeholder="Name or email"
			/></label>
			<p v-if="!filteredUsers.length">No matching learners.</p>

			<section class="directory-section">
				<div class="section-heading">
					<div>
						<p class="workspace-eyebrow">Learners</p>
						<h3>{{ usersHeader }}</h3>
					</div>
				</div>

				<div class="directory-grid">
					<article
						v-for="u in filteredUsers"
						:key="u._id"
						class="directory-card"
					>
						<details class="person-details">
							<summary>
								<strong>{{ u.name }}</strong
								><span>{{ u.email }}</span>
							</summary>
							<div class="person-tools">
								<div
									class="directory-card-header is-user-card-header"
								>
									<button
										class="btn-secondary btn"
										type="button"
										:aria-label="
											userEditing[u._id]
												? `Close assignment editor for ${u.name}`
												: `Manage access for ${u.name}`
										"
										@click="
											userEditing[u._id]
												? cancelUserEdit(u._id)
												: startUserEdit(u._id)
										"
									>
										{{
											userEditing[u._id]
												? "Close settings"
												: "Edit assignments"
										}}
									</button>
								</div>

								<div class="info-grid">
									<div class="summary-block is-inline">
										<p class="summary-label">
											{{ assignedTutorLabel(u._id) }}
										</p>
										<ul
											v-if="
												assignedTutorNames(u._id).length
											"
											class="summary-list"
										>
											<li
												v-for="tutorName in assignedTutorNames(
													u._id
												)"
												:key="`${u._id}-${tutorName}`"
											>
												{{ tutorName }}
											</li>
										</ul>
										<p v-else class="summary-copy is-muted">
											No tutor assigned yet
										</p>
									</div>
									<details
										class="summary-block is-inline is-collapsible"
									>
										<summary class="summary-toggle">
											<span class="summary-label">
												Course access
											</span>
										</summary>
										<div
											v-if="
												userCourseGroups(String(u._id))
													.length
											"
											class="summary-course-groups"
										>
											<div
												v-for="group in userCourseGroups(
													String(u._id)
												)"
												:key="`${u._id}-${group.key}`"
												class="summary-course-group"
											>
												<p class="summary-group-label">
													{{ group.label }}
												</p>
												<ul class="summary-list">
													<li
														v-for="course in group.courses"
														:key="`${u._id}-${course.id}`"
													>
														{{ course.name }}
													</li>
												</ul>
											</div>
										</div>
										<p v-else class="summary-copy is-muted">
											No course access yet
										</p>
									</details>
								</div>

								<details class="person-advanced">
									<summary>Advanced Settings</summary>
									<div class="action-row">
										<button
											class="btn-secondary btn"
											type="button"
											@click="promoteToTutor(u._id)"
										>
											Promote to tutor
										</button>
										<button
											class="btn-danger btn"
											type="button"
											@click="removeUser(u._id)"
										>
											Delete learner
										</button>
									</div>
								</details>
								<LearnerContextActions
									:student-id="String(u._id)"
									can-send
								/>
								<LearnerSessionTools
									:user-email="u.email"
									:user-id="String(u._id)"
									:user-name="u.name"
								/>

								<LearnerCodeReviewTools
									:user-email="u.email"
									:user-id="String(u._id)"
									:user-name="u.name"
								/>

								<div
									v-if="userEditing[u._id]"
									class="assignment-editor"
								>
									<div class="editor-block">
										<label
											class="editor-label"
											:for="`recipient-name-${u._id}`"
										>
											Associated recipient
										</label>
										<select
											:id="`recipient-name-${u._id}`"
											v-model="
												userRecipientNames[
													String(u._id)
												]
											"
											class="editor-select is-single"
										>
											<option value="">
												No associated recipient
											</option>
											<option
												v-for="recipientName in recipientOptionsForUser(
													String(u._id)
												)"
												:key="`${u._id}-${recipientName}`"
												:value="recipientName"
											>
												{{ recipientName }}
											</option>
										</select>

										<p
											v-if="recipientListError"
											class="helper-text error-text"
										>
											{{ recipientListError }}
										</p>
									</div>

									<div class="editor-block">
										<label
											class="editor-label"
											:for="`tutor-select-${u._id}`"
										>
											Assign tutors
										</label>
										<select
											:id="`tutor-select-${u._id}`"
											class="editor-select"
											:disabled="tutors.length === 0"
											multiple
											:value="
												userAssignments[u._id] ?? []
											"
											@change="
												onTutorSelectionChange(
													u._id,
													$event
												)
											"
										>
											<option
												v-for="t in tutors"
												:key="t._id"
												:value="t._id"
											>
												{{ t.name }}
											</option>
										</select>
									</div>

									<div class="editor-block">
										<p class="editor-label">
											Allowed courses
										</p>

										<div class="course-access-groups">
											<section
												v-for="group in userCourseGroups(
													String(u._id),
													true
												)"
												:key="`${u._id}-edit-${group.key}`"
												class="course-access-group"
											>
												<p
													class="course-access-group-title"
												>
													{{ group.label }}
												</p>
												<div class="checkbox-grid">
													<div
														v-for="course in group.courses"
														:key="course.id"
														class="course-choice"
														:class="{
															disabled:
																!userAllowedCourses[
																	String(
																		u._id
																	)
																]?.has(
																	course.id
																)
														}"
													>
														<label>
															<input
																:checked="
																	userCourseSelections[
																		String(
																			u._id
																		)
																	]?.includes(
																		course.id
																	)
																"
																:disabled="
																	!userAllowedCourses[
																		String(
																			u._id
																		)
																	]?.has(
																		course.id
																	)
																"
																type="checkbox"
																@change="
																	onUserCourseToggle(
																		u._id,
																		course.id,
																		(
																			$event.target as HTMLInputElement
																		)
																			.checked
																	)
																"
															/>
															<span>{{
																course.name
															}}</span>
														</label>
														<select
															v-if="
																userCourseSelections[
																	String(
																		u._id
																	)
																]?.includes(
																	course.id
																)
															"
															class="course-status-select"
															:value="
																userCourseStatus(
																	String(
																		u._id
																	),
																	course.id
																)
															"
															:aria-label="`Set ${course.name} status for ${u.name}`"
															@change="
																onUserCourseStatusChange(
																	String(
																		u._id
																	),
																	course.id,
																	(
																		$event.target as HTMLSelectElement
																	).value
																)
															"
														>
															<option
																value="current"
															>
																Current
															</option>
															<option
																value="past"
															>
																Past
															</option>
															<option
																value="available"
															>
																Available
															</option>
														</select>
													</div>
												</div>
											</section>
										</div>
									</div>

									<div class="action-row">
										<button
											class="btn-primary btn"
											type="button"
											:aria-label="`Save learner assignments for ${u.name}`"
											@click="
												saveUserEditorChanges(u._id)
											"
										>
											Save
										</button>
										<button
											class="btn-secondary btn"
											type="button"
											:aria-label="`Cancel learner assignment edits for ${u.name}`"
											@click="cancelUserEdit(u._id)"
										>
											Cancel
										</button>
									</div>
								</div>
							</div>
						</details>
					</article>
				</div>
			</section>
			<details class="tutor-management">
				<summary>
					Tutors and teaching permissions ({{ tutors.length }})
				</summary>
				<section class="directory-section">
					<div class="section-heading">
						<div>
							<p class="workspace-eyebrow">Tutors</p>
							<h3>{{ tutorsHeader }}</h3>
						</div>
					</div>

					<div class="directory-grid">
						<article
							v-for="t in tutors"
							:key="t._id"
							class="directory-card"
						>
							<div class="directory-card-header">
								<div>
									<h4>{{ t.name }}</h4>
									<p>{{ t.email }}</p>
								</div>
								<button
									class="btn-secondary btn"
									type="button"
									:aria-label="
										tutorEditing[t._id]
											? `Close course editor for ${t.name}`
											: `Edit courses for ${t.name}`
									"
									@click="toggleTutorEdit(t._id)"
								>
									{{
										tutorEditing[t._id]
											? "Close editor"
											: "Edit courses"
									}}
								</button>
							</div>

							<details
								class="summary-block is-inline is-collapsible"
							>
								<summary class="summary-toggle">
									<span class="summary-label">
										Course access
									</span>
								</summary>
								<ul
									v-if="tutorCourseLabels(t._id).length"
									class="summary-list"
								>
									<li
										v-for="course in tutorCourseLabels(
											t._id
										)"
										:key="`${t._id}-${course}`"
									>
										{{ course }}
									</li>
								</ul>
								<p v-else class="summary-copy is-muted">
									No course access enabled
								</p>
							</details>

							<div
								v-if="tutorEditing[t._id]"
								class="course-editor"
							>
								<div class="checkbox-grid">
									<label
										v-for="course in courseOptions"
										:key="course.id"
									>
										<input
											:checked="
												tutorCourseSelections[
													t._id
												]?.includes(course.id)
											"
											type="checkbox"
											@change="
												onTutorCourseToggle(
													t._id,
													course.id,
													(
														$event.target as HTMLInputElement
													).checked
												)
											"
										/>
										{{ course.name }}
									</label>
								</div>
								<div class="action-row">
									<button
										class="btn-primary btn"
										type="button"
										:aria-label="`Save course access for ${t.name}`"
										@click="saveTutorCourses(t._id)"
									>
										Save courses
									</button>
									<button
										class="btn-secondary btn"
										type="button"
										:aria-label="`Cancel course edits for ${t.name}`"
										@click="cancelTutorEdit(t._id)"
									>
										Cancel
									</button>
								</div>
							</div>
							<details class="person-advanced">
								<summary>Advanced Settings</summary>
								<div class="action-row">
									<button
										class="btn-secondary btn"
										type="button"
										@click="confirmDemote(t._id)"
									>
										Demote to learner
									</button>
									<button
										class="btn-danger btn"
										type="button"
										@click="removeTutor(t._id)"
									>
										Delete tutor
									</button>
								</div>
							</details>
						</article>
					</div>
				</section>
			</details>
			<details>
				<summary>Create or manage classroom codes</summary>
				<CourseAccessCodeManager :courses="courseOptions" />
			</details>
			<details class="person-advanced">
				<summary>Advanced Settings</summary>
				<button
					v-if="currentAdmin"
					class="btn-danger btn"
					type="button"
					@click="confirmDeleteAdmin"
				>
					Delete admin account
				</button>
			</details>
		</template>

		<AccessibleDialog
			close-label="Cancel confirmation"
			:description="confirmationDescription"
			dialog-id="admin-confirmation-dialog"
			:open="!!confirmation"
			:title="confirmationTitle"
			@close="closeConfirmation"
		>
			<p class="confirm-copy">
				{{ confirmationDescription }}
			</p>
			<template #footer>
				<button
					class="btn-secondary btn"
					:disabled="confirmationBusy"
					type="button"
					@click="closeConfirmation"
				>
					Cancel
				</button>
				<button
					class="btn"
					:class="
						confirmation?.variant === 'primary'
							? 'btn-primary'
							: 'btn-danger'
					"
					:disabled="confirmationBusy"
					type="button"
					@click="runConfirmation"
				>
					{{
						confirmationBusy
							? "Working..."
							: confirmationConfirmLabel
					}}
				</button>
			</template>
		</AccessibleDialog>
	</section>
</template>

<style scoped>
.roster-search {
	display: grid;
	gap: 0.4rem;
	margin-bottom: 1rem;
	font: inherit;
}
.roster-search input {
	padding: 0.65rem;
	width: 100%;
	color: var(--color-ink);
	background: var(--color-surface);
	border: 1px solid var(--color-border);
	border-radius: 0.5rem;
}
.admin-workspace {
	display: grid;
	gap: 1.1rem;
	width: 100%;
	margin: 0;
}

.admin-workspace p,
.admin-workspace label,
.admin-workspace button,
.admin-workspace input,
.admin-workspace select {
	font-family: inherit;
	text-align: left;
}

.admin-workspace section {
	margin: 0;
}

.workspace-header {
	width: 100%;
	box-sizing: border-box;
	display: grid;
	grid-template-columns: minmax(0, 1fr) minmax(15rem, 19rem);
	align-items: start;
	gap: 1rem 1.5rem;
	padding: clamp(1.35rem, 2.1vw, 1.8rem);
	border-radius: 28px;
	background: linear-gradient(
		180deg,
		rgba(248, 250, 252, 0.9),
		rgba(255, 255, 255, 0.82)
	);
	border: 1px solid rgba(255, 255, 255, 0.48);
	box-shadow: 0 28px 60px -44px rgba(15, 23, 42, 0.44);
}

.workspace-header,
.workspace-sheet,
.directory-section,
.directory-card,
.section-heading,
.directory-grid,
.workspace-stats {
	min-width: 0;
	max-width: 100%;
}

.workspace-header > div:first-child {
	display: grid;
	gap: 0.75rem;
	min-width: 0;
}

.directory-card-header,
.action-row {
	display: flex;
	flex-wrap: wrap;
	justify-content: space-between;
	gap: 1rem;
	min-width: 0;
	max-width: 100%;
}

.section-heading {
	display: grid;
	grid-template-columns: minmax(0, 1fr);
	gap: 0.7rem;
	align-items: flex-start;
}

.workspace-header h2,
.section-heading h3 {
	margin: 0;
	color: #10263a;
}

.workspace-header h2 {
	font-size: clamp(2rem, 4vw, 3rem);
	line-height: 1.08;
}

.section-heading h3 {
	margin-top: 0.1rem;
	font-size: clamp(1.8rem, 3vw, 2.35rem);
	color: #10263a;
	font-family: inherit;
	font-weight: 700;
	letter-spacing: -0.03em;
}

.workspace-header p:last-child,
.section-copy {
	margin: 0;
	line-height: 1.65;
	color: #41566a;
}

.workspace-eyebrow,
.panel-eyebrow,
.summary-label,
.editor-label {
	margin: 0;
	font-size: 0.78rem;
	font-weight: 700;
	letter-spacing: 0.14em;
	text-transform: uppercase;
	color: #0f766e;
}

.workspace-stats {
	width: 100%;
	max-width: 19rem;
	min-width: 0;
	display: grid;
	grid-template-columns: repeat(2, minmax(7.5rem, 1fr));
	gap: 0;
	border-radius: 22px;
	overflow: hidden;
	background: rgba(255, 255, 255, 0.66);
	border: 1px solid rgba(148, 163, 184, 0.22);
	box-shadow: 0 24px 45px -38px rgba(15, 23, 42, 0.55);
}

.stat-pill,
.summary-block,
.sheet-panel,
.directory-card,
.status-banner {
	border-radius: 24px;
	background: rgba(255, 255, 255, 0.88);
	box-shadow: inset 0 0 0 1px rgba(203, 213, 225, 0.68);
}

.stat-pill {
	min-width: 0;
	padding: 1rem 1.1rem;
	border-radius: 0;
	background: transparent;
	box-shadow: none;
	border-right: 1px solid rgba(203, 213, 225, 0.78);
}

.stat-pill:last-child {
	border-right: none;
}

.stat-pill span {
	display: block;
	font-size: 0.74rem;
	font-weight: 700;
	letter-spacing: 0.14em;
	text-transform: uppercase;
	color: #5f7a8e;
}

.stat-pill strong {
	display: block;
	margin-top: 0.35rem;
	font-size: 1.75rem;
	line-height: 1;
	color: #10263a;
}

.status-banner {
	padding: 0.95rem 1.1rem;
	margin: 0;
}

.status-banner.is-success {
	color: #166534;
	background: rgba(240, 253, 244, 0.92);
	box-shadow: inset 0 0 0 1px rgba(134, 239, 172, 0.8);
}

.status-banner.is-error {
	color: #b91c1c;
	background: rgba(254, 242, 242, 0.92);
	box-shadow: inset 0 0 0 1px rgba(252, 165, 165, 0.82);
}

.confirm-copy {
	margin: 0;
	color: var(--color-ink-soft, #41566a);
	line-height: 1.65;
}

.workspace-sheet,
.directory-section {
	display: grid;
	gap: 1.25rem;
	width: 100%;
	margin: 0;
	padding: clamp(1.2rem, 2vw, 1.5rem);
	border-radius: 30px;
	background: linear-gradient(
		180deg,
		rgba(245, 249, 253, 0.98),
		rgba(255, 255, 255, 0.96)
	);
	box-shadow: 0 30px 50px -42px rgba(15, 23, 42, 0.5);
}

.sheet-summary {
	display: grid;
	grid-template-columns: repeat(2, minmax(0, 1fr));
	gap: 1rem;
}

.summary-block,
.sheet-panel,
.directory-card {
	padding: 1.2rem 1.25rem;
}

.summary-block.is-inline {
	padding: 1rem 1.05rem;
}

.summary-block.is-collapsible {
	padding: 0;
}

.summary-toggle {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 1rem;
	padding: 1rem 1.05rem;
	cursor: pointer;
	list-style: none;
}

.summary-toggle::-webkit-details-marker {
	display: none;
}

.summary-toggle::after {
	content: "+";
	color: #5f7a8e;
	font-size: 1.1rem;
	font-weight: 700;
	line-height: 1;
}

.summary-block.is-collapsible[open] .summary-toggle::after {
	content: "−";
}

.summary-copy {
	margin: 0.55rem 0 0;
	line-height: 1.55;
	color: #41566a;
}

.summary-copy.is-muted {
	color: #5c7387;
}

.sheet-body {
	display: grid;
	grid-template-columns: repeat(2, minmax(0, 1fr));
	gap: 1rem;
	align-items: stretch;
}

.panel-header h3,
.directory-card-header h4 {
	margin: 0.25rem 0 0;
	font-size: 1.25rem;
	color: #10263a;
	font-family: inherit;
	font-weight: 700;
	letter-spacing: -0.025em;
}

.directory-card-header h4 {
	font-size: 1.1rem;
}

.directory-card-header p {
	margin: 0.25rem 0 0;
	color: #5f7a8e;
}

.directory-card-header.is-user-card-header {
	align-items: start;
}

.directory-card-identity {
	min-width: 0;
	flex: 1 1 18rem;
}

.directory-card-name-row {
	display: flex;
	align-items: baseline;
	justify-content: space-between;
	gap: 1rem;
	min-width: 0;
	max-width: 100%;
}

.directory-card-name-row h4 {
	margin: 0;
}

.recipient-association {
	margin: 0;
	color: #7a8795;
	font-size: 0.95rem;
	font-weight: 600;
	line-height: 1.4;
	text-align: right;
	overflow-wrap: anywhere;
}

.directory-card-header p,
.summary-list li {
	overflow-wrap: anywhere;
}

.field-stack {
	display: grid;
	gap: 0.75rem;
	margin: 1rem 0 0;
	padding: 0;
}

.security-panel {
	display: grid;
	align-content: start;
	gap: 1rem;
}

.sheet-panel {
	display: grid;
	align-content: start;
	gap: 1rem;
}

.security-copy,
.helper-text,
.section-copy {
	line-height: 1.6;
}

.security-copy,
.helper-text {
	margin: 0.85rem 0 0;
	color: #41566a;
}

.directory-grid {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(min(100%, 320px), 1fr));
	gap: 1rem;
}

.directory-card {
	display: grid;
	align-content: start;
	gap: 0.95rem;
}

.info-grid {
	display: grid;
	grid-template-columns: minmax(0, 1fr);
	gap: 0.85rem;
}

.summary-list {
	display: grid;
	gap: 0;
	list-style: none;
	margin: 0.7rem 0 0;
	padding: 0;
}

.summary-block.is-collapsible .summary-list,
.summary-block.is-collapsible .summary-copy {
	margin-top: 0;
	padding: 0 1.05rem 1rem;
}

.summary-list li {
	padding: 0.45rem 0;
	line-height: 1.55;
	color: #10263a;
}

.summary-list li + li {
	border-top: 1px solid rgba(203, 213, 225, 0.62);
}

.summary-course-groups,
.course-access-groups {
	display: grid;
	gap: 0.9rem;
}

.summary-block.is-collapsible .summary-course-groups {
	padding: 0 1.05rem 1rem;
}

.summary-course-group {
	display: grid;
	gap: 0.2rem;
}

.summary-group-label,
.course-access-group-title {
	margin: 0;
	font-size: 0.76rem;
	font-weight: 800;
	letter-spacing: 0.12em;
	text-transform: uppercase;
	color: #0f766e;
}

.assignment-editor,
.course-editor {
	display: grid;
	gap: 1rem;
	margin-top: 1rem;
	padding-top: 1rem;
	border-top: 1px solid rgba(203, 213, 225, 0.8);
}

.editor-block {
	display: grid;
	gap: 0.7rem;
}

.editor-select {
	min-height: 7rem;
	border: 1px solid rgba(148, 163, 184, 0.55);
	border-radius: 16px;
	padding: 0.75rem 0.85rem;
	background: white;
	color: #10263a;
}

.editor-select.is-single {
	min-height: auto;
	appearance: auto;
}

.checkbox-grid {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(min(100%, 170px), 1fr));
	gap: 0.65rem;
}

.course-choice {
	display: grid;
	gap: 0.55rem;
	padding: 0.8rem 0.9rem;
	border-radius: 16px;
	background: rgba(248, 250, 252, 0.88);
	box-shadow: inset 0 0 0 1px rgba(203, 213, 225, 0.72);
}

.checkbox-grid label {
	display: flex;
	gap: 0.45rem;
	align-items: center;
	font-size: 0.93rem;
	color: #12263a;
}

.checkbox-grid > label {
	padding: 0.8rem 0.9rem;
	border-radius: 16px;
	background: rgba(248, 250, 252, 0.88);
	box-shadow: inset 0 0 0 1px rgba(203, 213, 225, 0.72);
}

.checkbox-grid label.disabled,
.course-choice.disabled {
	opacity: 0.5;
	cursor: not-allowed;
}

.course-status-select {
	width: 100%;
	border: 1px solid rgba(148, 163, 184, 0.55);
	border-radius: 12px;
	padding: 0.5rem 0.65rem;
	background: white;
	color: #10263a;
	font: inherit;
}

:global(html.dark .admin-workspace .course-choice),
:global(html.dark .admin-workspace .checkbox-grid > label) {
	background: var(--color-surface-soft);
	box-shadow: inset 0 0 0 1px var(--color-border-strong);
	color: var(--color-ink);
}

:global(html.dark .admin-workspace .checkbox-grid label) {
	background: transparent;
	color: var(--color-ink);
}

:global(html.dark .admin-workspace .assignment-editor),
:global(html.dark .admin-workspace .course-editor),
:global(html.dark .admin-workspace .editor-block) {
	background: transparent;
}

:global(html.dark .admin-workspace .summary-group-label),
:global(html.dark .admin-workspace .course-access-group-title) {
	color: var(--color-accent);
}

:global(html.dark .admin-workspace .editor-select),
:global(html.dark .admin-workspace .course-status-select) {
	border-color: var(--color-border-strong);
	background: var(--color-surface-muted);
	color: var(--color-ink);
}

.error {
	color: red;
	margin-top: 10px;
}

@media (max-width: 1500px) {
	.workspace-header,
	.section-heading,
	.sheet-summary,
	.sheet-body,
	.info-grid {
		grid-template-columns: 1fr;
	}

	.workspace-stats {
		width: 100%;
		max-width: none;
	}
}

@media (max-width: 640px) {
	.workspace-sheet,
	.directory-section {
		padding: 1.1rem;
		border-radius: 24px;
	}

	.action-row {
		flex-direction: column;
	}

	.directory-card-name-row {
		align-items: flex-start;
		flex-direction: column;
		gap: 0.35rem;
	}

	.recipient-association {
		text-align: left;
	}
}

@media (max-width: 380px) {
	.workspace-stats {
		grid-template-columns: 1fr;
	}

	.stat-pill {
		border-right: none;
		border-bottom: 1px solid rgba(203, 213, 225, 0.78);
	}

	.stat-pill:last-child {
		border-bottom: none;
	}
}

.profile-workspace,
.admin-workspace {
	gap: 0.75rem;
}
.workspace-sheet {
	padding: 0;
	border: 0;
	border-radius: 0;
	box-shadow: none;
	background: transparent;
}
.sheet-body {
	gap: 1rem;
}
.sheet-panel {
	padding: 0.75rem;
	border-radius: 8px;
	box-shadow: none;
}
.profile-associations > summary {
	min-height: 2.75rem;
	align-content: center;
	cursor: pointer;
	color: var(--color-ink-soft);
	font-size: 0.9rem;
}
.directory-grid {
	gap: 0.75rem;
}
.directory-card {
	padding: 0.85rem;
	gap: 0.65rem;
	border-radius: 8px;
	box-shadow: none;
}
.section-heading {
	gap: 0.5rem;
}
.section-heading .workspace-eyebrow {
	display: none;
}
.section-heading h3 {
	font-size: 1.15rem;
}
.summary-block {
	padding: 0.65rem;
	border-radius: 6px;
}

.admin-workspace .directory-section {
	background: transparent;
	border: 0;
	padding: 0;
	gap: 0.5rem;
	box-shadow: none;
}
.admin-workspace .directory-grid {
	grid-template-columns: minmax(0, 1fr);
	gap: 0;
}
.admin-workspace .directory-card {
	padding: 0;
	border: 0;
	border-bottom: 1px solid var(--color-border);
	border-radius: 0;
	background: transparent;
}
.person-details > summary {
	display: flex;
	align-items: center;
	flex-wrap: wrap;
	gap: 0.25rem 1rem;
	cursor: pointer;
	padding: 0.75rem 0.35rem;
	list-style: none;
}
.person-details > summary::before {
	content: "›";
	font-size: 1.2rem;
}
.person-details[open] > summary::before {
	content: "⌄";
}
.person-details > summary strong {
	font-size: 1rem;
	font-weight: 600;
}
.person-details > summary > span {
	color: var(--color-ink-soft);
	font-size: 0.85rem;
	overflow-wrap: anywhere;
}
.person-tools {
	padding: 0.35rem 0.75rem 1rem;
	display: grid;
	gap: 0.5rem;
}
.person-advanced > summary {
	cursor: pointer;
	padding-block: 0.5rem;
	font-size: 0.85rem;
	color: var(--color-ink-soft);
}
.admin-workspace .info-grid {
	display: flex;
	flex-wrap: wrap;
	gap: 0.5rem;
	align-items: start;
}
.admin-workspace .info-grid > * {
	flex: 1 1 15rem;
	background: transparent;
	box-shadow: none;
	padding: 0;
}
.admin-workspace .checkbox-grid {
	display: grid;
	grid-template-columns: minmax(0, 1fr);
	gap: 0.25rem;
}
.admin-workspace .course-choice {
	display: flex;
	flex-wrap: wrap;
	gap: 0.5rem;
	padding: 0.35rem 0.5rem;
	border-radius: 4px;
	box-shadow: none;
	align-items: center;
}
.admin-workspace .course-choice label {
	flex: 1 1 15rem;
}
.admin-workspace .course-status-select {
	width: auto;
	padding: 0.25rem 0.4rem;
	border-radius: 4px;
}
.admin-workspace .tutor-management .directory-card {
	padding: 0.75rem 0.35rem;
}
</style>
