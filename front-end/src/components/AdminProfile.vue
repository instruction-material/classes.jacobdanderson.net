<script lang="ts" setup>
import type { AdminRecipient } from "@/modules/adminRecipients";
import { storeToRefs } from "pinia";
import { computed, onMounted, ref, watch } from "vue";
import { api } from "@/api";
import AccessibleDialog from "@/components/AccessibleDialog.vue";
import CourseAccessCodeManager from "@/components/CourseAccessCodeManager.vue";
import LearnerCourseAccess from "@/components/LearnerCourseAccess.vue";
import LearnerWorkspace from "@/components/LearnerWorkspace.vue";
import SelfAccountSettings from "@/components/SelfAccountSettings.vue";
import WorkspaceDisclosure from "@/components/WorkspaceDisclosure.vue";
import { useCourseAccessDrafts } from "@/composables/useCourseAccessDrafts";
import { useDeleteAccount } from "@/composables/useDeleteAccount";
import { fetchAdminRecipients } from "@/modules/adminRecipients";
import { cleanCourseStatusMap } from "@/modules/courseAccess";
import { useAppStore } from "@/stores/app";
import { useCoursesStore } from "@/stores/courses";
import { isListedCourse } from "@/stores/courses/index";

const props = defineProps<{
	mode?: "account" | "people" | "profile" | "manage";
}>();

/* -------------------------------------------------- */
const app = useAppStore();
const { currentAdmin, tutors, users } = storeToRefs(app);
const selectedLearnerId = ref("");
const selectedTutorId = ref("");
const selectedTutors = computed(() =>
	tutors.value.filter(tutor => tutor._id === selectedTutorId.value)
);
watch(
	tutors,
	value => {
		if (!value.some(tutor => tutor._id === selectedTutorId.value))
			selectedTutorId.value = value[0]?._id ?? "";
	},
	{ immediate: true }
);
const loading = ref(false);
const savingAssignments = ref(false);
const savingInstructor = ref(false);
const error = ref("");
const success = ref("");
const deleteMe = useDeleteAccount("admin");
const userAssignments = ref<Record<string, string[]>>({});
const userEditing = ref<Record<string, boolean>>({});
const userRecipientNames = ref<Record<string, string>>({});
const tutorEditing = ref<Record<string, boolean>>({});
const tutorCourseSelections = ref<Record<string, string[]>>({});
const {
	selections: userCourseSelections,
	statuses: userCourseStatuses,
	reset: resetCourseDraft,
	toggle: onUserCourseToggle,
	setStatus: onUserCourseStatusChange
} = useCourseAccessDrafts(users);
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
const courseOptions = computed(() =>
	(courses.value ?? []).filter(course => isListedCourse(course.id))
);
const courseNameMap = computed<Record<string, string>>(
	() =>
		courses.value?.reduce(
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

	loading.value = true;
	try {
		await Promise.all([
			app.fetchTutors(),
			app.fetchUsers(),
			recipientListRequest
		]);
	} catch {
		error.value = "Unable to load people. Refresh to try again.";
	} finally {
		loading.value = false;
	}
}

onMounted(loadAll);

watch(
	users,
	value => {
		const assignments: Record<string, string[]> = {};
		const editing: Record<string, boolean> = {};
		const recipientNames: Record<string, string> = {};
		for (const user of value) {
			assignments[user._id] = (user.tutors ?? []).map(t =>
				typeof t === "string" ? t : t._id
			);
			editing[user._id] = false;
			recipientNames[user._id] = user.recipientName ?? "";
		}
		userAssignments.value = assignments;
		userEditing.value = editing;
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
		resetCourseDraft(userID);
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
	if (savingInstructor.value || !currentAdmin.value) return;
	const adminId = currentAdmin.value._id;
	savingInstructor.value = true;
	try {
		success.value = "";
		error.value = "";
		await api.put(`/tutors/${tutorID}/courses`, {
			courseIDs: tutorCourseSelections.value[tutorID] ?? []
		});
		if (currentAdmin.value?._id !== adminId) return;
		success.value = "Updated tutor course access.";
		await app.fetchTutors();
		tutorEditing.value = { ...tutorEditing.value, [tutorID]: false };
	} catch (e: any) {
		error.value =
			e.response?.data?.message ??
			e.message ??
			"Unable to update tutor courses";
	} finally {
		savingInstructor.value = false;
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

async function saveUserEditorChanges(userID: string) {
	if (savingAssignments.value || !currentAdmin.value) return;
	savingAssignments.value = true;
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
	} finally {
		savingAssignments.value = false;
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
			<p v-if="loading" role="status">Loading people…</p>
			<LearnerWorkspace
				v-if="!loading && currentAdmin"
				v-model="selectedLearnerId"
				:learners="users"
				:busy="savingAssignments"
				:dirty="!!userEditing[selectedLearnerId]"
				can-send
				@discard="cancelUserEdit"
			>
				<template #default="{ learner: u }">
					<div class="course-toolbar">
						<button
							class="btn-secondary btn"
							type="button"
							@click="
								userEditing[u._id]
									? cancelUserEdit(u._id)
									: startUserEdit(u._id)
							"
						>
							{{
								userEditing[u._id]
									? "Cancel edits"
									: "Edit assignments"
							}}
						</button>
					</div>
					<p class="assignment-summary">
						{{ assignedTutorLabel(u._id) }}:
						{{ assignedTutorNames(u._id).join(", ") || "None" }}
					</p>
					<LearnerCourseAccess
						v-if="!userEditing[u._id]"
						:courses="courseOptions"
						:student-id="u._id"
						:student-name="u.name"
						:selected="userCourseSelections[u._id] ?? []"
						:statuses="userCourseStatuses[u._id] ?? {}"
					/>
					<form
						v-else
						class="assignment-editor"
						@submit.prevent="saveUserEditorChanges(u._id)"
					>
						<label
							>Associated recipient
							<select v-model="userRecipientNames[u._id]">
								<option value="">
									No associated recipient
								</option>
								<option
									v-for="name in recipientOptionsForUser(
										u._id
									)"
									:key="name"
									:value="name"
								>
									{{ name }}
								</option>
							</select>
						</label>
						<p v-if="recipientListError" role="alert">
							{{ recipientListError }}
						</p>
						<label
							>Assign tutors
							<select
								multiple
								:value="userAssignments[u._id] ?? []"
								:disabled="!tutors.length"
								@change="onTutorSelectionChange(u._id, $event)"
							>
								<option
									v-for="t in tutors"
									:key="t._id"
									:value="t._id"
								>
									{{ t.name }}
								</option>
							</select>
						</label>
						<LearnerCourseAccess
							editable
							:courses="courseOptions"
							:student-id="u._id"
							:student-name="u.name"
							:selected="userCourseSelections[u._id] ?? []"
							:statuses="userCourseStatuses[u._id] ?? {}"
							:allowed="userAllowedCourses[u._id] ?? new Set()"
							@toggle="
								(courseId, checked) =>
									onUserCourseToggle(u._id, courseId, checked)
							"
							@status="
								(courseId, value) =>
									onUserCourseStatusChange(
										u._id,
										courseId,
										value
									)
							"
						/>
						<div class="action-row">
							<button
								class="btn-primary btn"
								type="submit"
								:disabled="savingAssignments"
							>
								{{
									savingAssignments
										? "Saving…"
										: "Save assignments"
								}}
							</button>
							<button
								class="btn-secondary btn"
								type="button"
								:disabled="savingAssignments"
								@click="cancelUserEdit(u._id)"
							>
								Cancel
							</button>
						</div>
					</form>
					<WorkspaceDisclosure class="person-advanced">
						<template #label>Student account</template>
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
					</WorkspaceDisclosure>
				</template>
			</LearnerWorkspace>
			<WorkspaceDisclosure class="tutor-management">
				<template #label>Instructor permissions</template>
				<section class="directory-section">
					<label class="instructor-selector"
						>Select instructor
						<select
							v-model="selectedTutorId"
							:disabled="savingInstructor"
						>
							<option v-if="!tutors.length" value="">
								No instructors
							</option>
							<option
								v-for="t in tutors"
								:key="t._id"
								:value="t._id"
							>
								{{ t.name }}
							</option>
						</select>
					</label>
					<div class="directory-grid">
						<article
							v-for="t in selectedTutors"
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
									:disabled="savingInstructor"
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

							<WorkspaceDisclosure
								class="summary-block is-inline is-collapsible"
								trigger-class="summary-toggle"
							>
								<template #label>
									<span class="summary-label">
										Course access
									</span>
								</template>
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
							</WorkspaceDisclosure>

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
											:disabled="savingInstructor"
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
										:disabled="savingInstructor"
										:aria-label="`Save course access for ${t.name}`"
										@click="saveTutorCourses(t._id)"
									>
										{{
											savingInstructor
												? "Saving…"
												: "Save courses"
										}}
									</button>
									<button
										class="btn-secondary btn"
										type="button"
										:aria-label="`Cancel course edits for ${t.name}`"
										:disabled="savingInstructor"
										@click="cancelTutorEdit(t._id)"
									>
										Cancel
									</button>
								</div>
							</div>
							<WorkspaceDisclosure class="person-advanced">
								<template #label>Instructor account</template>
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
							</WorkspaceDisclosure>
						</article>
					</div>
				</section>
			</WorkspaceDisclosure>
			<WorkspaceDisclosure>
				<template #label>Create or manage classroom codes</template>
				<CourseAccessCodeManager :courses="courseOptions" />
			</WorkspaceDisclosure>
			<WorkspaceDisclosure class="person-advanced">
				<template #label>Administrator account</template>
				<button
					v-if="currentAdmin"
					class="btn-danger btn"
					type="button"
					@click="confirmDeleteAdmin"
				>
					Delete admin account
				</button>
			</WorkspaceDisclosure>
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
.admin-workspace {
	display: grid;
	gap: 1rem;
	min-width: 0;
	color: var(--color-ink);
}
.admin-workspace :is(p, label, button, select) {
	font-family: inherit;
}
.admin-workspace :is(section, article) {
	min-width: 0;
	margin: 0;
}
.admin-workspace :is(:deep(.workspace-disclosure__trigger), label) {
	font-size: 0.95rem;
}
.admin-workspace :deep(.workspace-disclosure__trigger) {
	cursor: pointer;
}
.admin-workspace select {
	max-width: 100%;
	font: inherit;
	color: var(--color-ink);
	background: var(--color-surface);
	border: 1px solid var(--color-border);
	border-radius: var(--radius-sm);
	padding: 0.5rem 0.65rem;
}
.course-toolbar,
.directory-card-header,
.action-row {
	display: flex;
	flex-wrap: wrap;
	gap: 0.5rem;
	align-items: center;
	justify-content: space-between;
}
.course-toolbar {
	margin-bottom: 0.5rem;
}
.action-row {
	justify-content: start;
	margin: 0.75rem 0;
}
.assignment-summary {
	color: var(--color-ink-soft);
	font-size: 0.95rem;
}
.assignment-editor {
	display: grid;
	gap: 1rem;
	margin: 1rem 0;
}
.assignment-editor > label,
.instructor-selector {
	display: grid;
	gap: 0.5rem;
	max-width: 30rem;
}
.assignment-editor select[multiple] {
	min-height: 6rem;
}
.person-advanced,
.tutor-management {
	border-top: 1px solid var(--color-border);
	padding-top: 0.75rem;
	margin-top: 1rem;
}
.directory-grid {
	display: grid;
	gap: 1rem;
	min-width: 0;
}
.directory-card {
	padding: 0.75rem 0;
}
.directory-card-header h4,
.directory-card-header p {
	margin: 0.25rem 0;
	overflow-wrap: anywhere;
}
.summary-block {
	margin: 0.75rem 0;
}
.summary-list {
	padding: 0;
	list-style: none;
}
.summary-list li {
	padding: 0.4rem 0;
	border-bottom: 1px solid var(--color-border);
}
.checkbox-grid {
	display: grid;
	gap: 0.5rem;
	margin: 0.75rem 0;
}
.checkbox-grid label {
	display: flex;
	gap: 0.6rem;
	align-items: center;
	overflow-wrap: anywhere;
}
.btn-secondary {
	background: var(--color-surface);
	color: var(--color-ink);
	border: 1px solid var(--color-border);
}
.btn {
	font: inherit;
	padding: 0.4rem 0.7rem;
}
.status-banner {
	margin: 0;
}
.is-error {
	color: var(--color-danger, #b91c1c);
}
@media (max-width: 380px) {
	.course-toolbar {
		align-items: start;
	}
}
</style>
