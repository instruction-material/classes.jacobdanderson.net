<script lang="ts" setup>
import type { AdminRecipient } from "@/modules/adminRecipients";
import DOMPurify from "dompurify";
import { marked } from "marked";
import { computed, inject, nextTick, onMounted, ref, watch } from "vue";
import { routeLocationKey } from "vue-router";
import { api } from "@/api";
import AdminWorkspaceShell from "@/components/AdminWorkspaceShell.vue";
import { fetchAdminRecipients } from "@/modules/adminRecipients";
import { retainNoteSendIntent } from "@/modules/sessionNoteSendIntent";

// allow single newlines to render as <br> and keep GitHub-flavored markdown
marked.setOptions({ breaks: true, gfm: true });

interface SessionNoteRecord {
	studentId?: string;
	scheduledSessionId?: string;
	_id: string;
	studentName: string;
	primaryEmail: string;
	ccEmails: string[];
	subject: string;
	sessionDate: string;
	markdown: string;
	createdAt: string;
	updatedAt: string;
}

interface SendMailResponse {
	operationId?: string;
	evidenceStatus?: string;
	statusReason?: string;
	ok: boolean;
}

type DateInputEl = HTMLInputElement & { showPicker?: () => void };
const to = ref("");
const subject = ref("");
const md = ref("");
const sending = ref(false);
const sendValidation = ref("");
const noteStudentId = ref("");
const pendingStudentId = ref<string | null>(null);
const requestedStudentInvalid = ref(false);
const noteRoute = inject(routeLocationKey, null);

const noteStudents = ref<
	{ studentId: string; name: string; recipientName?: string | null }[]
>([]);
const noteStudentsLoading = ref(false);
const noteStudentsError = ref("");
const noteOperation = ref<SendMailResponse | null>(null);
let pendingNoteSend: { signature: string; key: string; noteId: string } | null =
	null;
const previewOpen = ref(false);
const adminRecipients = ref<AdminRecipient[]>([]);
const recipientsLoading = ref(false);
const recipientsError = ref("");

const subjectDate = ref("");
const dateInput = ref<DateInputEl | null>(null);

const resultText = ref("");
const recentSessionNotes = ref<SessionNoteRecord[]>([]);
const recentNotesLoading = ref(false);
const recentNotesError = ref("");
let recentNotesRequestToken = 0;
function requestNoteStudent(studentId: string) {
	if (sending.value) return;
	if (
		studentId &&
		!noteStudents.value.some(student => student.studentId === studentId)
	) {
		requestedStudentInvalid.value = true;
		resultText.value =
			"Requested student identity is unavailable. Select a verified student.";
		return;
	}
	requestedStudentInvalid.value = false;
	if (studentId === noteStudentId.value) return;
	if (
		noteStudentId.value &&
		(md.value.trim() || pendingNoteSend || noteOperation.value)
	) {
		pendingStudentId.value = studentId;
		return;
	}
	applyNoteStudent(studentId);
}
function applyNoteStudent(studentId: string) {
	const switchingStudent = Boolean(noteStudentId.value);
	if (switchingStudent) {
		md.value = "";
		subject.value = "";
		subjectDate.value = "";
	}
	pendingNoteSend = null;
	noteOperation.value = null;
	pendingStudentId.value = null;
	resultText.value = "";
	noteStudentId.value = studentId;
}
watch(
	() => noteRoute?.query.student,
	studentId => {
		if (typeof studentId === "string" && noteStudents.value.length)
			requestNoteStudent(studentId);
	}
);

watch(noteStudentId, async () => {
	resetRecentSessionNotes();
	await loadRecentSessionNotes();
});
async function checkNoteOperation() {
	if (!noteOperation.value?.operationId) return;
	try {
		const { data } = await api.get<SendMailResponse>(
			`/admin-mail/session-notes/operations/${noteOperation.value.operationId}`
		);
		noteOperation.value = data;
		resultText.value = `Operation ${data.operationId}: ${data.evidenceStatus}. ${data.statusReason ?? ""}`;
	} catch {
		resultText.value =
			"Tracking unavailable. Keep the operation reference and do not send again.";
	}
}

// helper to render + sanitize MD -> HTML
function renderPreview(markdown: string): string {
	const raw = marked.parse(markdown);
	if (typeof raw !== "string") return "";
	return DOMPurify.sanitize(raw);
}

const livePreviewHtml = computed(() => renderPreview(md.value));
const selectedStudent = computed(() =>
	noteStudents.value.find(
		student => student.studentId === noteStudentId.value
	)
);
const selectedRecipientName = computed(
	() =>
		selectedStudent.value?.recipientName ||
		selectedStudent.value?.name ||
		""
);
const selectedRecipient = computed(() =>
	adminRecipients.value.find(
		recipient =>
			recipient.name.trim().toLowerCase() ===
			selectedRecipientName.value.trim().toLowerCase()
	)
);
const primaryEmail = computed(() => selectedRecipient.value?.emails[0] ?? "");
const ccEmails = computed(() =>
	(selectedRecipient.value?.emails.slice(1) ?? []).filter(Boolean)
);
const liveRecipients = computed(() => parseRecipients(to.value));
const hasSelectedRecipient = computed(() => !!selectedStudent.value);
const recentNotesHeading = computed(() =>
	selectedStudent.value
		? `Recent session notes for ${selectedStudent.value.name}`
		: "Recent session notes"
);
function recipientLabel(student: { studentId: string; name: string }) {
	return noteStudents.value.filter(
		other =>
			other.name.trim().toLowerCase() ===
			student.name.trim().toLowerCase()
	).length > 1
		? `${student.name} · ${student.studentId.slice(-6)}`
		: student.name;
}

watch(
	selectedRecipient,
	() => {
		const recip = selectedRecipient.value;
		if (!recip) {
			to.value = "";
			return;
		}
		const [primary, ...cc] = recip.emails;
		to.value = [primary, ...cc].filter(Boolean).join(", ");
	},
	{ deep: true, immediate: true }
);

watch(
	subjectDate,
	value => {
		if (!value) {
			subject.value = "";
			return;
		}
		subject.value = formatSessionSubject(value);
	},
	{ flush: "sync" }
);

async function loadAdminRecipientList() {
	recipientsLoading.value = true;
	recipientsError.value = "";
	try {
		adminRecipients.value = await fetchAdminRecipients();
	} catch (error: any) {
		adminRecipients.value = [];
		recipientsError.value =
			error?.response?.data?.message ??
			error?.message ??
			"Unable to load saved recipients.";
	} finally {
		recipientsLoading.value = false;
	}
}

async function loadNoteStudents() {
	noteStudentsLoading.value = true;
	noteStudentsError.value = "";
	try {
		const { data } = await api.get("/admin-mail/session-notes/identities");
		noteStudents.value = data.students ?? [];
		const requested = noteRoute
			? noteRoute.query.student
			: new URLSearchParams(window.location.search).get("student");
		if (typeof requested === "string" && requested)
			requestNoteStudent(requested);
	} catch {
		noteStudentsError.value = "Unable to load recipients. Please retry.";
	} finally {
		noteStudentsLoading.value = false;
	}
}

async function reloadRecipients() {
	await loadAdminRecipientList();
	await loadNoteStudents();
}
onMounted(reloadRecipients);

function clearRecipient() {
	requestNoteStudent("");
}

function resetRecentSessionNotes() {
	recentSessionNotes.value = [];
	recentNotesLoading.value = false;
	recentNotesError.value = "";
}

function openDatePicker() {
	// prefer native date picker when available
	if (!dateInput.value) return;
	dateInput.value.focus({ preventScroll: true });
	if (dateInput.value.showPicker) {
		dateInput.value.showPicker();
	} else {
		dateInput.value.click();
	}
}

function handleDateChange(event: Event) {
	const target = event.target as HTMLInputElement | null;
	if (target) {
		subjectDate.value = target.value;
		requestAnimationFrame(() => target.blur()); // hide native picker after selection
		setTimeout(() => target.blur(), 50); // fallback for browsers that keep it open
	}
}

function parseRecipients(raw: string) {
	const parts = raw
		.split(",")
		.map(part => part.trim())
		.filter(Boolean);
	return {
		to: parts[0] ?? "",
		cc: parts.slice(1)
	};
}

function formatSessionSubject(value: string) {
	const parts = parseDateParts(value);
	if (!parts) return "";
	const month = String(parts.month).padStart(2, "0");
	const day = String(parts.day).padStart(2, "0");
	return `Session Notes (${month}/${day})`;
}

const sessionDateFormatter = new Intl.DateTimeFormat("en-US", {
	month: "short",
	day: "numeric",
	year: "numeric"
});

const sessionTimestampFormatter = new Intl.DateTimeFormat("en-US", {
	month: "short",
	day: "numeric",
	year: "numeric",
	hour: "numeric",
	minute: "2-digit"
});

function formatSessionDate(value: string) {
	const parsed = new Date(value);
	if (Number.isNaN(parsed.getTime())) return value;
	return sessionDateFormatter.format(parsed);
}

function formatTimestamp(value: string) {
	const parsed = new Date(value);
	if (Number.isNaN(parsed.getTime())) return value;
	return sessionTimestampFormatter.format(parsed);
}

function noteRecencyLabel(index: number) {
	if (index === 0) return "Most recent";
	if (index === 1) return "2nd most recent";
	return "3rd most recent";
}

async function loadRecentSessionNotes() {
	// Saved versions belong to the selected student, even when siblings share a mailbox.
	if (!noteStudentId.value) {
		resetRecentSessionNotes();
		return;
	}
	const studentId = noteStudentId.value;
	const requestToken = ++recentNotesRequestToken;
	recentNotesLoading.value = true;
	recentNotesError.value = "";
	try {
		const { data } = await api.get(`/users/${studentId}/session-notes`);
		if (
			requestToken !== recentNotesRequestToken ||
			studentId !== noteStudentId.value
		) {
			return;
		}
		recentSessionNotes.value = (data.sessionNotes ?? []).filter(
			(note: SessionNoteRecord) => note.studentId === studentId
		);
	} catch {
		if (
			requestToken === recentNotesRequestToken &&
			studentId === noteStudentId.value
		) {
			recentNotesError.value =
				"Saved notes unavailable for this student.";
		}
	} finally {
		if (
			requestToken === recentNotesRequestToken &&
			studentId === noteStudentId.value
		) {
			recentNotesLoading.value = false;
		}
	}
}

watch([to, subject, md, noteStudentId, pendingStudentId], () => {
	sendValidation.value = "";
});

async function showSendValidation(message: string, fieldId: string) {
	sendValidation.value = message;
	await nextTick();
	document.getElementById(fieldId)?.focus();
}

async function sendMail() {
	if (sending.value) return;
	if (noteStudentsLoading.value || noteStudentsError.value) {
		return showSendValidation(
			noteStudentsError.value ||
				"Recipients are still loading. Please try again.",
			"recipient-select"
		);
	}
	if (!selectedStudent.value || requestedStudentInvalid.value) {
		return showSendValidation(
			"Select a recipient before sending.",
			"recipient-select"
		);
	}
	if (pendingStudentId.value !== null) {
		return showSendValidation(
			"Keep the current recipient or confirm the change before sending.",
			"recipient-select"
		);
	}
	if (!to.value.trim()) {
		return showSendValidation(
			"No saved recipient address is available. Update this student's recipient in People before sending.",
			"recipient-select"
		);
	}
	const sessionDateIso = parseDateIso(subjectDate.value);
	if (!sessionDateIso) {
		return showSendValidation(
			"Choose the note's subject date before sending.",
			"pick-subject-date"
		);
	}
	if (!subject.value.trim()) {
		return showSendValidation(
			"Enter a subject before sending.",
			"subject-input"
		);
	}
	if (!md.value.trim()) {
		return showSendValidation(
			"Write the note before sending.",
			"markdown-input"
		);
	}
	sendValidation.value = "";
	resultText.value = "";
	sending.value = true;
	const curTo = to.value.trim();
	const curSubject = subject.value.trim();
	const curMd = md.value;
	const payload = {
		to: curTo,
		subject: curSubject,
		md: curMd,
		sessionDate: sessionDateIso,
		recipientName: selectedRecipientName.value
	};
	const identity = {
		studentId: noteStudentId.value,
		scheduledSessionId: undefined,
		unlinked: true
	};
	try {
		const signature = JSON.stringify({
			...payload,
			...identity,
			selectedSavedNoteId: ""
		});
		if (!pendingNoteSend || pendingNoteSend.signature !== signature) {
			pendingNoteSend = await retainNoteSendIntent(
				signature,
				async () => {
					const saved = await api.post(
						`/users/${identity.studentId}/session-notes`,
						{
							...identity,
							sessionDate: sessionDateIso.slice(0, 10),
							subject: curSubject,
							markdown: curMd,
							primaryEmail: parseRecipients(curTo).to,
							ccEmails: parseRecipients(curTo).cc
						}
					);
					return saved.data.sessionNote._id;
				}
			);
		}
		const { data } = await api.post<SendMailResponse>(
			"/admin-mail/send",
			{
				...payload,
				...identity,
				noteId: pendingNoteSend.noteId,
				idempotencyKey: pendingNoteSend.key
			},
			{ withCredentials: true }
		);
		if (data.operationId) {
			noteOperation.value = data;
			resultText.value = `Operation ${data.operationId}: ${data.evidenceStatus}. ${data.ok ? "Primary recipient accepted by SMTP; inbox delivery is not confirmed." : "Keep this reference. Do not create another send while this outcome is pending or unconfirmed."}`;
			if (data.ok) await loadRecentSessionNotes();
		} else {
			resultText.value =
				"Sending could not be confirmed. Keep this draft and do not create a separate send.";
		}
	} catch (error: any) {
		resultText.value = error?.response?.data
			? JSON.stringify(error.response.data, null, 2)
			: String(error);
	} finally {
		sending.value = false;
	}
}
function parseDateParts(value: string) {
	const [yearStr, monthStr, dayStr] = value.split("-");
	const year = Number(yearStr);
	const month = Number(monthStr);
	const day = Number(dayStr);
	if (!year || !month || !day) return null;
	return { year, month, day };
}

function parseDateIso(value: string): string | null {
	const parts = parseDateParts(value);
	if (!parts) return null;
	// store at UTC noon to avoid timezone shifts presenting as previous day
	return new Date(
		Date.UTC(parts.year, parts.month - 1, parts.day, 12)
	).toISOString();
}
</script>

<template>
	<AdminWorkspaceShell title="Session notes">
		<section class="wrap">
			<div class="mail-card">
				<div class="field-grid">
					<div class="field">
						<label class="field-label" for="recipient-select"
							>Recipient</label
						>
						<div class="recipient-row">
							<select
								id="recipient-select"
								:value="noteStudentId"
								:disabled="
									sending ||
									noteStudentsLoading ||
									recipientsLoading
								"
								@change="
									requestNoteStudent(
										($event.target as HTMLSelectElement)
											.value
									)
								"
							>
								<option disabled value="">
									Select a person
								</option>
								<option
									v-for="student in noteStudents"
									:key="student.studentId"
									:value="student.studentId"
								>
									{{ recipientLabel(student) }}
								</option>
							</select>
							<button
								v-if="noteStudentId"
								type="button"
								class="ghost-btn"
								:disabled="sending"
								@click="clearRecipient"
							>
								Clear
							</button>
						</div>
						<p
							v-if="recipientsLoading || noteStudentsLoading"
							class="hint"
						>
							Loading recipients…
						</p>
						<div
							v-else-if="recipientsError || noteStudentsError"
							role="alert"
						>
							{{ recipientsError || noteStudentsError }}
							<button type="button" @click="reloadRecipients">
								Retry recipients
							</button>
						</div>
						<div
							v-if="pendingStudentId !== null"
							class="student-context-confirmation"
							role="alert"
						>
							<p>
								Changing recipients clears this draft. Copy it
								and keep any send reference before switching.
							</p>
							<button
								type="button"
								@click="applyNoteStudent(pendingStudentId!)"
							>
								Discard draft and switch recipient
							</button>
							<button
								type="button"
								@click="pendingStudentId = null"
							>
								Keep current recipient
							</button>
						</div>
						<p v-if="requestedStudentInvalid" role="alert">
							The requested student is unavailable. Select a
							recipient before continuing.
						</p>
						<div
							v-if="hasSelectedRecipient"
							class="recipient-preview"
						>
							<div>
								<strong>To:</strong> {{ primaryEmail || "—" }}
							</div>
							<div v-if="ccEmails.length">
								<strong>CC:</strong> {{ ccEmails.join(", ") }}
							</div>
						</div>
					</div>
					<div class="field subject-group">
						<label class="field-label" for="subject-input"
							>Subject</label
						>
						<div class="subject-row">
							<button
								id="pick-subject-date"
								type="button"
								class="picker-btn"
								:disabled="sending"
								@click="openDatePicker"
							>
								{{
									subjectDate
										? "Change subject date"
										: "Pick subject date"
								}}
							</button>
							<input
								id="subject-date-input"
								ref="dateInput"
								v-model="subjectDate"
								type="date"
								class="sr-only"
								aria-label="Pick subject date"
								:disabled="sending"
								@change="handleDateChange"
							/>
							<input
								id="subject-input"
								v-model="subject"
								class="subject-preview"
								placeholder="Session Notes (MM/DD)"
								aria-label="Email subject"
								:disabled="sending"
							/>
						</div>
					</div>
				</div>
				<div class="note-editor">
					<label for="markdown-input">Notes</label>
					<textarea
						id="markdown-input"
						v-model="md"
						placeholder="Write session notes…"
						data-testid="md-input"
						:disabled="sending"
					></textarea>
				</div>
				<div
					v-if="previewOpen"
					id="note-preview"
					class="preview-pane"
					role="region"
					aria-label="Note preview"
					data-testid="live-preview"
				>
					<div class="preview-meta">
						<div>
							<strong>To:</strong> {{ liveRecipients.to || "—" }}
						</div>
						<div v-if="liveRecipients.cc.length">
							<strong>CC:</strong>
							{{ liveRecipients.cc.join(", ") }}
						</div>
						<div>
							<strong>Subject:</strong> {{ subject || "—" }}
						</div>
					</div>
					<div
						class="preview-body"
						data-testid="live-preview-body"
						v-html="livePreviewHtml"
					/>
				</div>
				<div class="mail-card__footer">
					<p v-if="sendValidation" id="send-validation" role="alert">
						{{ sendValidation }}
					</p>
					<button
						type="button"
						class="ghost-btn"
						data-testid="preview-toggle"
						:aria-expanded="previewOpen"
						aria-controls="note-preview"
						@click="previewOpen = !previewOpen"
					>
						{{ previewOpen ? "Hide preview" : "Preview" }}
					</button>
					<button
						v-if="noteOperation"
						type="button"
						class="ghost-btn"
						:disabled="sending"
						@click="checkNoteOperation"
					>
						Check send status
					</button>
					<button
						type="button"
						class="send-btn"
						:disabled="sending"
						:aria-describedby="
							sendValidation ? 'send-validation' : undefined
						"
						@click="sendMail"
					>
						{{ sending ? "Sending…" : "Send" }}
					</button>
				</div>
			</div>
			<pre
				v-if="resultText"
				class="result"
				:role="noteOperation?.ok ? 'status' : 'alert'"
				>{{ resultText }}</pre>
			<div
				v-if="hasSelectedRecipient"
				class="history-card"
				aria-live="polite"
			>
				<div class="history-card__header">
					<h3>{{ recentNotesHeading }}</h3>
				</div>
				<p v-if="recentNotesLoading" class="history-card__empty">
					Loading recent session notes…
				</p>
				<p v-else-if="recentNotesError" class="history-card__empty">
					{{ recentNotesError }}
				</p>
				<p
					v-else-if="recentSessionNotes.length === 0"
					class="history-card__empty"
				>
					No saved session notes were found for this recipient yet.
				</p>
				<div v-else class="history-card__list">
					<article
						v-for="(note, index) in recentSessionNotes"
						:key="note._id"
						class="history-note"
					>
						<div class="history-note__header">
							<div>
								<p class="history-note__eyebrow">
									{{ formatSessionDate(note.sessionDate) }}
								</p>
								<h4>{{ note.subject }}</h4>
							</div>
							<span class="history-note__badge">{{
								noteRecencyLabel(index)
							}}</span>
						</div>
						<p class="history-note__meta">
							Recipients: {{ note.primaryEmail
							}}<template v-if="note.ccEmails.length">
								· CC {{ note.ccEmails.join(", ") }}</template
							>
							· saved {{ formatTimestamp(note.createdAt) }}
						</p>
						<div
							class="history-note__body"
							v-html="renderPreview(note.markdown)"
						/>
					</article>
				</div>
			</div>
		</section>
	</AdminWorkspaceShell>
</template>

<style scoped>
.wrap {
	max-width: 1000px;
	margin: 0 auto;
	display: grid;
	gap: 1rem;
}

.mail-card {
	display: grid;
	gap: 1.1rem;
	padding: 1.35rem;
	border-radius: 24px;
	border: 1px solid #d8e3ed;
	background: linear-gradient(
		180deg,
		rgba(248, 250, 252, 0.96),
		rgba(255, 255, 255, 1)
	);
	box-shadow: inset 0 0 0 1px rgba(226, 232, 240, 0.5);
}

.history-card {
	display: grid;
	gap: 1rem;
	padding: 1.25rem 1.35rem;
	border-radius: 24px;
	border: 1px solid #d8e3ed;
	background: #fff;
	box-shadow: inset 0 0 0 1px rgba(226, 232, 240, 0.45);
}

.history-card__header {
	display: flex;
	flex-wrap: wrap;
	align-items: end;
	justify-content: space-between;
	gap: 0.75rem;
}

.history-card__header h3 {
	margin: 0;
	font-size: 1.3rem;
}

.history-card__empty {
	margin: 0;
	color: #526779;
	line-height: 1.6;
}

.history-card__list {
	display: grid;
	gap: 0.9rem;
}

.history-note {
	display: grid;
	gap: 0.75rem;
	padding: 1rem 1.05rem;
	border-radius: 18px;
	border: 1px solid #e2e8f0;
	background: linear-gradient(
		180deg,
		rgba(248, 250, 252, 0.95),
		rgba(255, 255, 255, 1)
	);
}

.history-note__header {
	display: flex;
	flex-wrap: wrap;
	align-items: start;
	justify-content: space-between;
	gap: 0.75rem;
}

.history-note__header h4 {
	margin: 0;
	font-size: 1.05rem;
}

.history-note__eyebrow {
	margin: 0 0 0.2rem;
	font-size: 0.72rem;
	font-weight: 800;
	letter-spacing: 0.12em;
	text-transform: uppercase;
	color: #2563eb;
}

.history-note__badge {
	display: inline-flex;
	align-items: center;
	padding: 0.35rem 0.7rem;
	border-radius: 999px;
	background: #e0ebff;
	color: #1d4ed8;
	font-size: 0.82rem;
	font-weight: 700;
}

.history-note__meta {
	margin: 0;
	color: #526779;
	font-size: 0.92rem;
	line-height: 1.5;
}

.history-note__body {
	padding-top: 0.15rem;
	color: #0f172a;
}

.history-note__body :deep(ul),
.history-note__body :deep(ol) {
	margin: 0.75em 0 0.75em 0.25rem;
	padding-inline-start: 1.65rem;
	list-style-position: outside;
}

.history-note__body :deep(li) {
	padding-inline-start: 0.25rem;
}

.history-note__body :deep(li + li) {
	margin-top: 0.4em;
}

.mail-card__footer {
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	justify-content: space-between;
	gap: 1rem;
}

.field-grid {
	display: grid;
	grid-template-columns: minmax(0, 1fr);
	gap: 1rem;
}

.preview-pane {
	border: 1px solid #e2e8f0;
	border-radius: 18px;
	padding: 1rem;
	background: #fff;
}

label {
	display: block;
	margin: 0 0 6px;
	font-weight: 600;
}
input,
textarea,
select {
	width: 100%;
	padding: 0.8rem 0.95rem;
	box-sizing: border-box;
	border: 1px solid #d6dee8;
	border-radius: 14px;
	background: #fff;
}
textarea {
	height: 320px;
	font-family: ui-monospace, Menlo, Consolas, monospace;
	line-height: 1.55;
}
.recipient-row {
	display: flex;
	align-items: center;
	gap: 8px;
}
.recipient-row select {
	flex: 1;
	min-width: 0;
}
.recipient-preview {
	background: #f8fafc;
	border: 1px solid #e5e7eb;
	border-radius: 14px;
	padding: 0.8rem 0.95rem;
	margin-top: 8px;
	color: #374151;
}
.recipient-preview strong {
	color: #111827;
}
.subject-row {
	display: flex;
	align-items: center;
	gap: 12px;
}
.subject-preview {
	flex: 1;
	min-width: 240px;
	background: #f8fafc;
	border: 1px solid #d8e3ed;
	border-radius: 14px;
	padding: 0.8rem 0.95rem;
	color: #0f172a;
}
.picker-btn,
.ghost-btn {
	padding: 0.8rem 1rem;
	margin-top: 0;
	border-radius: 14px;
	cursor: pointer;
}
.picker-btn {
	background: linear-gradient(135deg, #2563eb, #1d4ed8);
	border: 1px solid #2563eb;
	color: #fff;
	font-weight: 700;
	box-shadow: 0 12px 24px rgba(37, 99, 235, 0.18);
}
.ghost-btn {
	background: transparent;
	border: 1px solid #d6dee8;
	color: #111827;
}
.ghost-btn:hover {
	background: #f3f4f6;
}
.send-btn {
	padding: 0.85rem 1.25rem;
	background: linear-gradient(135deg, #2563eb, #1d4ed8);
	border: 1px solid #2563eb;
	color: #fff;
	border-radius: 999px;
	font-weight: 700;
	cursor: pointer;
	box-shadow: 0 14px 28px rgba(37, 99, 235, 0.22);
}
.send-btn:disabled {
	background: #9ca3af;
	border-color: #9ca3af;
	cursor: not-allowed;
	box-shadow: none;
}
.result {
	white-space: pre-wrap;
	background: #f7f7f7;
	border: 1px solid #ddd;
	border-radius: 18px;
	padding: 1rem;
}
.hint {
	margin: 4px 0 0;
	font-weight: 400;
	color: #6b7280;
}
.field {
	margin: 0;
}

.field-label {
	display: block;
	margin-bottom: 6px;
	font-weight: 700;
	color: #0f172a;
}
.sr-only {
	position: absolute;
	width: 1px;
	height: 1px;
	padding: 0;
	margin: -1px;
	overflow: hidden;
	clip: rect(0, 0, 0, 0);
	border: 0;
}
.preview-meta {
	font-size: 0.95rem;
	color: #444;
	margin-bottom: 12px;
}
.preview-body :deep(p),
.preview-body :deep(blockquote) {
	margin: 0.6em 0;
}

.preview-body :deep(ul),
.preview-body :deep(ol) {
	margin: 0.75em 0 0.75em 0.25rem;
	padding-inline-start: 1.65rem;
	list-style-position: outside;
}

.preview-body :deep(li) {
	padding-inline-start: 0.25rem;
}

.preview-body :deep(li + li) {
	margin-top: 0.4em;
}

.preview-body :deep(code) {
	background: #f3f4f6;
	color: #111827;
	font-weight: 700;
	padding: 0.1em 0.35em;
	border-radius: 4px;
}
.preview-body :deep(pre) {
	background: #e5e7eb;
	color: #0f172a;
	font-weight: 700;
	border-radius: 10px;
	padding: 12px;
	overflow-x: auto;
	margin: 0.8em 0;
}
.preview-body :deep(pre code) {
	background: transparent;
	color: inherit;
	padding: 0;
	font-family:
		ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono",
		monospace;
}
@media (max-width: 700px) {
	.mail-card {
		padding: 1rem;
	}

	.mail-card__footer,
	.subject-row {
		flex-direction: column;
		align-items: stretch;
	}

	.subject-preview {
		min-width: 0;
	}

	.send-btn,
	.picker-btn,
	.ghost-btn {
		width: 100%;
	}

	.recipient-row .ghost-btn {
		width: auto;
	}
}

@media (min-width: 900px) {
	.field-grid {
		grid-template-columns: minmax(0, 1.2fr) minmax(0, 0.95fr);
		align-items: start;
	}
}
</style>

<route lang="yaml">
meta:
    layout: default
    requiresAdmin: true
</route>
