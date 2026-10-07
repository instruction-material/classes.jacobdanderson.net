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

interface MatchedUserAccount {
	_id: string;
	name: string;
	email: string;
}

interface SendAssociations {
	sessionNoteSavedFor: MatchedUserAccount | null;
	internalEmailsSavedFor: MatchedUserAccount[];
}

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

interface RecentSessionNotesResponse {
	matchedUser: MatchedUserAccount | null;
	sessionNotes: SessionNoteRecord[];
}

interface SendMailResponse {
	operationId?: string;
	evidenceStatus?: string;
	statusReason?: string;
	ok: boolean;
	messageId?: string;
	associations?: SendAssociations;
	recentSessionNotes?: SessionNoteRecord[];
}

type DateInputEl = HTMLInputElement & { showPicker?: () => void };
type MailTab = "compose" | "preview";

const CUSTOM_OPTION = "Custom";
const MAIL_TABS: MailTab[] = ["compose", "preview"];

const messageKind = ref("session-note");
const to = ref("");
const subject = ref("");
const md = ref("");
const sending = ref(false);
const sendValidation = ref("");
const noteStudentId = ref("");
const pendingStudentId = ref<string | null>(null);
const requestedStudentInvalid = ref(false);
const noteRoute = inject(routeLocationKey, null);

const noteSessionId = ref("");
const noteUnlinked = ref(false);
const selectedSavedNoteId = ref("");
const noteStudents = ref<
	{ studentId: string; name: string; recipientName?: string }[]
>([]);
const noteSessions = ref<{ _id: string; startAt: string; timezone: string }[]>(
	[]
);
const noteStudentsLoading = ref(false);
const noteStudentsError = ref("");
const noteOperation = ref<SendMailResponse | null>(null);
let pendingNoteSend: { signature: string; key: string; noteId: string } | null =
	null;
const activeTab = ref<MailTab>("compose");
const selectedRecipientName = ref("");
const adminRecipients = ref<AdminRecipient[]>([]);
const recipientsLoading = ref(false);
const recipientsError = ref("");

const subjectDate = ref("");
const dateInput = ref<DateInputEl | null>(null);

// resultText is only used for error JSON or non-ok responses
const resultText = ref("");
const saveSummary = ref<SendAssociations | null>(null);
const lastSendWasSessionNote = ref(false);
const recentSessionNotes = ref<SessionNoteRecord[]>([]);
const recentNotesOwner = ref<MatchedUserAccount | null>(null);
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
	noteUnlinked.value = false;
	resultText.value = "";
	noteStudentId.value = studentId;
	const verified = noteStudents.value.find(
		student => student.studentId === studentId
	);
	selectedRecipientName.value =
		verified?.recipientName &&
		adminRecipients.value.some(
			recipient => recipient.name === verified.recipientName
		)
			? verified.recipientName
			: switchingStudent
				? ""
				: selectedRecipientName.value;
}
watch(
	() => noteRoute?.query.student,
	studentId => {
		if (typeof studentId === "string" && noteStudents.value.length)
			requestNoteStudent(studentId);
	}
);

watch(noteStudentId, async studentId => {
	resetRecentSessionNotes();
	noteSessionId.value = "";
	selectedSavedNoteId.value = "";
	noteSessions.value = [];
	if (!studentId) return;
	try {
		const { data } = await api.get(`/users/${studentId}/schedule`);
		if (studentId === noteStudentId.value)
			noteSessions.value = data.scheduledSessions ?? [];
		await loadRecentSessionNotes();
	} catch {
		resultText.value = "Unable to load verified sessions.";
	}
});
function loadSavedNote() {
	const note = recentSessionNotes.value.find(
		n =>
			n._id === selectedSavedNoteId.value &&
			n.studentId === noteStudentId.value
	);
	if (!note) return;
	md.value = note.markdown;
	subject.value = note.subject;
	subjectDate.value = note.sessionDate.slice(0, 10);
	noteSessionId.value = note.scheduledSessionId ?? "";
	noteUnlinked.value = !noteSessionId.value;
}
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

// success preview state
const sentOk = ref(false);
const previewTo = ref("");
const previewSubject = ref("");
const sentPreviewHtml = ref("");

// helper to render + sanitize MD -> HTML
function renderPreview(markdown: string): string {
	const raw = marked.parse(markdown);
	if (typeof raw !== "string") return "";
	return DOMPurify.sanitize(raw);
}

const livePreviewHtml = computed(() => renderPreview(md.value));
const selectedRecipient = computed(() =>
	adminRecipients.value.find(
		recipient => recipient.name === selectedRecipientName.value
	)
);
const isCustomRecipient = computed(
	() => selectedRecipientName.value === CUSTOM_OPTION
);
const primaryEmail = computed(() => selectedRecipient.value?.emails[0] ?? "");
const ccEmails = computed(() =>
	(selectedRecipient.value?.emails.slice(1) ?? []).filter(Boolean)
);
const liveRecipients = computed(() => parseRecipients(to.value));
const sentRecipients = computed(() => parseRecipients(previewTo.value));
const hasSelectedRecipient = computed(
	() => !!selectedRecipientName.value && !isCustomRecipient.value
);
const recentNotesHeading = computed(() =>
	selectedRecipientName.value
		? `Recent session notes for ${selectedRecipientName.value}`
		: "Recent session notes"
);

watch(
	() => selectedRecipientName.value,
	name => {
		if (name === CUSTOM_OPTION) {
			to.value = "";
			return;
		}
		const recip = adminRecipients.value.find(r => r.name === name);
		if (!recip) {
			to.value = "";
			return;
		}
		const [primary, ...cc] = recip.emails;
		to.value = [primary, ...cc].filter(Boolean).join(", ");
	},
	{ immediate: true }
);

watch(
	adminRecipients,
	() => {
		if (!selectedRecipientName.value || isCustomRecipient.value) return;
		const recip = selectedRecipient.value;
		if (!recip) {
			to.value = "";
			return;
		}
		const [primary, ...cc] = recip.emails;
		to.value = [primary, ...cc].filter(Boolean).join(", ");
	},
	{ deep: true }
);

watch(
	() => selectedRecipientName.value,
	async name => {
		if (!name || name === CUSTOM_OPTION) {
			resetRecentSessionNotes();
			return;
		}

		await loadRecentSessionNotes();
	},
	{ immediate: true }
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
		noteStudentsError.value = "Unable to load students. Please retry.";
	} finally {
		noteStudentsLoading.value = false;
	}
}

onMounted(async () => {
	await loadAdminRecipientList();
	await loadNoteStudents();
});

function switchTab(tab: MailTab) {
	activeTab.value = tab;
}

function tabButtonId(tab: MailTab) {
	return `tab-${tab}`;
}

function tabPanelId(tab: MailTab) {
	return `panel-${tab}`;
}

function handleTabKeydown(event: KeyboardEvent, tab: MailTab) {
	const currentIndex = MAIL_TABS.indexOf(tab);
	if (currentIndex === -1) return;

	let nextIndex = currentIndex;
	if (event.key === "ArrowRight") {
		nextIndex = (currentIndex + 1) % MAIL_TABS.length;
	} else if (event.key === "ArrowLeft") {
		nextIndex = (currentIndex - 1 + MAIL_TABS.length) % MAIL_TABS.length;
	} else if (event.key === "Home") {
		nextIndex = 0;
	} else if (event.key === "End") {
		nextIndex = MAIL_TABS.length - 1;
	} else {
		return;
	}

	event.preventDefault();
	const nextTab = MAIL_TABS[nextIndex];
	switchTab(nextTab);
	requestAnimationFrame(() => {
		document.getElementById(tabButtonId(nextTab))?.focus();
	});
}

function clearRecipient() {
	selectedRecipientName.value = "";
}

function resetRecentSessionNotes() {
	recentSessionNotes.value = [];
	recentNotesOwner.value = null;
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
	if (messageKind.value === "session-note") {
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
			recentNotesError.value = "";
		} catch {
			if (requestToken === recentNotesRequestToken) {
				recentNotesError.value =
					"Saved notes unavailable for this student.";
			}
		} finally {
			if (requestToken === recentNotesRequestToken)
				recentNotesLoading.value = false;
		}
		return;
	}

	const recipientName = selectedRecipientName.value;
	const resolvedPrimaryEmail = primaryEmail.value;

	if (
		!recipientName ||
		recipientName === CUSTOM_OPTION ||
		!resolvedPrimaryEmail
	) {
		resetRecentSessionNotes();
		return;
	}

	const requestToken = ++recentNotesRequestToken;
	recentNotesLoading.value = true;
	recentNotesError.value = "";

	try {
		const { data } = await api.get<RecentSessionNotesResponse>(
			"/admin-mail/session-notes/recent",
			{
				params: {
					recipientName,
					primaryEmail: resolvedPrimaryEmail
				},
				withCredentials: true
			}
		);

		if (requestToken !== recentNotesRequestToken) return;

		recentSessionNotes.value = data.sessionNotes ?? [];
		recentNotesOwner.value = data.matchedUser ?? null;
	} catch (error: any) {
		if (requestToken !== recentNotesRequestToken) return;

		resetRecentSessionNotes();
		recentNotesError.value =
			error?.response?.data?.message ??
			error?.message ??
			"Unable to load recent session notes.";
	} finally {
		if (requestToken === recentNotesRequestToken) {
			recentNotesLoading.value = false;
		}
	}
}

watch(
	[
		to,
		subject,
		md,
		noteStudentId,
		noteSessionId,
		noteUnlinked,
		messageKind,
		pendingStudentId
	],
	() => {
		sendValidation.value = "";
	}
);

async function showSendValidation(message: string, fieldId: string) {
	sendValidation.value = message;
	activeTab.value = "compose";
	await nextTick();
	document.getElementById(fieldId)?.focus();
}

async function sendMail() {
	if (sending.value) return;
	if (!to.value.trim()) {
		return showSendValidation(
			"Select a recipient before sending.",
			"recipient-select"
		);
	}
	if (messageKind.value === "session-note") {
		if (noteStudentsLoading.value || noteStudentsError.value) {
			return showSendValidation(
				noteStudentsError.value ||
					"Students are still loading. Please try again.",
				"note-student"
			);
		}
		if (!noteStudentId.value || requestedStudentInvalid.value) {
			return showSendValidation(
				"Select the student this note belongs to before sending.",
				"note-student"
			);
		}
		if (pendingStudentId.value !== null) {
			return showSendValidation(
				"Keep the current student or confirm the student change before sending.",
				"note-student"
			);
		}
		if (!subjectDate.value) {
			return showSendValidation(
				"Choose the note's subject date before sending.",
				"pick-subject-date"
			);
		}
		if (!noteSessionId.value && !noteUnlinked.value) {
			return showSendValidation(
				"Select an actual session, or check Unlinked note if the session is not listed.",
				"note-unlinked"
			);
		}
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
	sentOk.value = false;
	sending.value = true;
	saveSummary.value = null;

	const curTo = to.value.trim();
	const curSubject = subject.value.trim();
	const curMd = md.value;
	const sessionDateIso = parseDateIso(subjectDate.value);
	const wasSessionNoteSend = messageKind.value === "session-note";
	const keptRecipientSelection = selectedRecipientName.value;
	const usedCustomRecipient = isCustomRecipient.value;
	const payload: Record<string, unknown> = {
		to: curTo,
		subject: curSubject,
		md: curMd,
		sessionDate: wasSessionNoteSend
			? (sessionDateIso ?? undefined)
			: undefined,
		recipientName: isCustomRecipient.value
			? undefined
			: selectedRecipientName.value || undefined
	};

	try {
		if (wasSessionNoteSend) {
			if (!sessionDateIso) {
				resultText.value =
					"Choose the note label date. The actual session must still be selected separately.";
				return;
			}
			if (
				!noteStudentId.value ||
				(!noteSessionId.value && !noteUnlinked.value)
			) {
				resultText.value =
					"Select the student and actual session, or explicitly mark the note unlinked.";
				return;
			}
			const identity = {
				studentId: noteStudentId.value,
				scheduledSessionId: noteSessionId.value || undefined,
				unlinked: noteUnlinked.value
			};
			const signature = JSON.stringify({
				...payload,
				...identity,
				selectedSavedNoteId: selectedSavedNoteId.value
			});
			if (!pendingNoteSend || pendingNoteSend.signature !== signature) {
				pendingNoteSend = await retainNoteSendIntent(
					signature,
					async () => {
						let noteId = selectedSavedNoteId.value;
						if (!noteId) {
							const saved = await api.post(
								`/users/${noteStudentId.value}/session-notes`,
								{
									...identity,
									sessionDate: sessionDateIso?.slice(0, 10),
									subject: curSubject,
									markdown: curMd,
									primaryEmail: parseRecipients(curTo).to,
									ccEmails: parseRecipients(curTo).cc
								}
							);
							noteId = saved.data.sessionNote._id;
						}
						return noteId;
					}
				);
			}
			Object.assign(payload, identity, {
				noteId: pendingNoteSend.noteId,
				idempotencyKey: pendingNoteSend.key
			});
		}
		const { data } = await api.post<SendMailResponse>(
			"/admin-mail/send",
			payload,
			{
				withCredentials: true
			}
		);

		if (data.operationId) {
			noteOperation.value = data;
			resultText.value = `Operation ${data.operationId}: ${data.evidenceStatus}. ${data.ok ? "Primary recipient accepted by SMTP; inbox delivery is not confirmed." : "Keep this reference. Do not create another send while this outcome is pending or unconfirmed."}`;
			if (data.ok) {
				await loadRecentSessionNotes();
			}
			return;
		}
		if (data?.ok === true) {
			saveSummary.value = data?.associations ?? null;
			lastSendWasSessionNote.value = wasSessionNoteSend;
			// build preview from what we just sent
			previewTo.value = curTo;
			previewSubject.value = curSubject;
			sentPreviewHtml.value = renderPreview(curMd);

			if (wasSessionNoteSend) {
				recentSessionNotes.value = data.recentSessionNotes ?? [];
				recentNotesOwner.value =
					data.associations?.sessionNoteSavedFor ??
					recentNotesOwner.value;
				recentNotesError.value = "";
				recentNotesLoading.value = false;
			}

			// clear inputs while preserving the selected persona path
			if (usedCustomRecipient) {
				selectedRecipientName.value = "";
				to.value = "";
			} else {
				selectedRecipientName.value = keptRecipientSelection;
			}
			subjectDate.value = "";
			subject.value = "";
			md.value = "";
			if (dateInput.value) dateInput.value.value = "";

			// show the pretty preview section, hide JSON
			sentOk.value = true;
			resultText.value = "";
		} else {
			// non-ok (but not thrown)
			sentOk.value = false;
			resultText.value = JSON.stringify(data, null, 2);
		}
	} catch (e: any) {
		sentOk.value = false;
		lastSendWasSessionNote.value = wasSessionNoteSend;
		resultText.value = e?.response?.data
			? JSON.stringify(e.response.data, null, 2)
			: String(e);
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
	<AdminWorkspaceShell title="Notes and Mail">
		<section class="wrap">
			<div class="mail-card">
				<label class="message-kind"
					>Message type<select v-model="messageKind">
						<option value="session-note">Session note</option>
						<option value="internal">Internal message</option>
					</select></label
				>
				<div class="mail-card__header">
					<div>
						<h2>Compose Message</h2>
					</div>
					<div
						class="tabs"
						role="tablist"
						aria-label="Email or preview"
					>
						<button
							:id="tabButtonId('compose')"
							role="tab"
							:aria-controls="tabPanelId('compose')"
							:aria-selected="activeTab === 'compose'"
							class="tab-btn"
							:class="[{ active: activeTab === 'compose' }]"
							:tabindex="activeTab === 'compose' ? 0 : -1"
							type="button"
							data-testid="tab-compose"
							@click="switchTab('compose')"
							@keydown="handleTabKeydown($event, 'compose')"
						>
							Compose
						</button>
						<button
							:id="tabButtonId('preview')"
							role="tab"
							:aria-controls="tabPanelId('preview')"
							:aria-selected="activeTab === 'preview'"
							class="tab-btn"
							:class="[{ active: activeTab === 'preview' }]"
							:tabindex="activeTab === 'preview' ? 0 : -1"
							type="button"
							data-testid="tab-preview"
							@click="switchTab('preview')"
							@keydown="handleTabKeydown($event, 'preview')"
						>
							Preview
						</button>
					</div>
				</div>

				<div class="field-grid">
					<div
						v-if="messageKind === 'session-note'"
						class="field note-identity-fields"
					>
						<label class="field-label" for="note-student"
							>Student identity</label
						>
						<select
							id="note-student"
							:value="noteStudentId"
							:disabled="sending"
							@change="
								requestNoteStudent(
									($event.target as HTMLSelectElement).value
								)
							"
						>
							<option value="">Select student explicitly</option>
							<option
								v-for="student in noteStudents"
								:key="student.studentId"
								:value="student.studentId"
							>
								{{ student.name }} ·
								{{ student.studentId.slice(-6) }}
							</option>
						</select>
						<div v-if="noteStudentsError" role="alert">
							{{ noteStudentsError }}
							<button
								type="button"
								:disabled="noteStudentsLoading"
								@click="loadNoteStudents"
							>
								Retry student list
							</button>
						</div>
						<div
							v-if="pendingStudentId !== null"
							class="student-context-confirmation"
							role="alert"
						>
							<p>
								This draft or send reference belongs to the
								current student. Save or copy it before
								switching. Changing students clears this draft;
								delivery tracking remains available in review.
							</p>
							<button
								type="button"
								@click="applyNoteStudent(pendingStudentId!)"
							>
								Discard draft and switch student
							</button>
							<button
								type="button"
								@click="pendingStudentId = null"
							>
								Keep current student
							</button>
						</div>
						<p v-if="requestedStudentInvalid" role="alert">
							The requested student is unavailable. Select a
							verified student before continuing.
						</p>
						<label class="field-label" for="note-session"
							>Actual session</label
						>
						<select
							id="note-session"
							v-model="noteSessionId"
							:disabled="noteUnlinked"
						>
							<option value="">Select scheduled session</option>
							<option
								v-for="session in noteSessions"
								:key="session._id"
								:value="session._id"
							>
								{{ new Date(session.startAt).toLocaleString() }}
								· {{ session.timezone }} ·
								{{ session._id.slice(-6) }}
							</option>
						</select>
						<label
							><input
								id="note-unlinked"
								v-model="noteUnlinked"
								type="checkbox"
								@change="noteSessionId = ''"
							/>
							Unlinked note; operator review required</label
						>
						<label class="field-label" for="saved-note"
							>Saved note version</label
						>
						<select
							id="saved-note"
							v-model="selectedSavedNoteId"
							@change="loadSavedNote"
						>
							<option value="">
								Save this draft before sending
							</option>
							<option
								v-for="note in recentSessionNotes.filter(
									n => n.studentId === noteStudentId
								)"
								:key="note._id"
								:value="note._id"
							>
								{{ note.sessionDate.slice(0, 10) }} ·
								{{ note._id.slice(-6) }}
							</option>
						</select>
						<button
							v-if="noteOperation"
							type="button"
							class="ghost-btn"
							@click="checkNoteOperation"
						>
							Check send status
						</button>
					</div>

					<div class="field">
						<label class="field-label" for="recipient-select"
							>Recipient</label
						>
						<div class="recipient-row">
							<select
								id="recipient-select"
								v-model="selectedRecipientName"
							>
								<option disabled value="">
									Select a person
								</option>
								<option
									v-for="recipient in adminRecipients"
									:key="recipient.name"
									:value="recipient.name"
								>
									{{ recipient.name }}
								</option>
								<option :value="CUSTOM_OPTION">Custom</option>
							</select>
							<button
								v-if="selectedRecipientName"
								type="button"
								class="ghost-btn"
								@click="clearRecipient"
							>
								Clear
							</button>
						</div>
						<div
							v-if="!isCustomRecipient"
							class="recipient-preview"
						>
							<p v-if="recipientsLoading" class="hint">
								Loading saved recipients…
							</p>
							<p v-else-if="recipientsError" class="error">
								{{ recipientsError }}
							</p>
							<div>
								<strong>To:</strong> {{ primaryEmail || "—" }}
							</div>
							<div v-if="ccEmails.length">
								<strong>CC:</strong> {{ ccEmails.join(", ") }}
							</div>
						</div>
						<div v-else class="manual-recipient">
							<label class="sub-label" for="custom-to"
								>Enter recipient email(s)</label
							>
							<input
								id="custom-to"
								v-model="to"
								type="text"
								placeholder="primary@example.com, cc1@example.com"
							/>
							<p class="hint">
								First email is the main recipient; any others
								become CC.
							</p>
						</div>
					</div>

					<div class="field subject-group">
						<label class="field-label" for="subject-date-input"
							>Subject</label
						>
						<div class="subject-row">
							<button
								v-if="messageKind === 'session-note'"
								id="pick-subject-date"
								type="button"
								class="picker-btn"
								@click="openDatePicker"
							>
								{{
									subjectDate
										? "Change subject date"
										: "Pick subject date"
								}}
							</button>
							<input
								v-show="messageKind === 'session-note'"
								id="subject-date-input"
								ref="dateInput"
								v-model="subjectDate"
								type="date"
								class="sr-only"
								aria-label="Pick subject date"
								@change="handleDateChange"
							/>
							<input
								id="subject-input"
								v-model="subject"
								class="subject-preview"
								placeholder="Session Notes (MM/DD)"
								aria-label="Email subject"
							/>
						</div>
					</div>
				</div>

				<div
					v-if="activeTab === 'compose'"
					:id="tabPanelId('compose')"
					class="tab-panel"
					role="tabpanel"
					:aria-labelledby="tabButtonId('compose')"
				>
					<label for="markdown-input">Markdown</label>
					<textarea
						id="markdown-input"
						v-model="md"
						placeholder="**Hello** _world_"
						data-testid="md-input"
					></textarea>
				</div>

				<div
					v-else
					:id="tabPanelId('preview')"
					class="tab-panel preview-pane"
					role="tabpanel"
					:aria-labelledby="tabButtonId('preview')"
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

			<div
				v-if="hasSelectedRecipient"
				class="history-card"
				aria-live="polite"
			>
				<div class="history-card__header">
					<div>
						<h3>{{ recentNotesHeading }}</h3>
					</div>
					<p v-if="recentNotesOwner" class="history-card__meta">
						Stored on {{ recentNotesOwner.email }}
					</p>
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
							<span class="history-note__badge">
								{{ noteRecencyLabel(index) }}
							</span>
						</div>
						<p class="history-note__meta">
							Recipients: {{ note.primaryEmail }}
							<template v-if="note.ccEmails.length">
								· CC {{ note.ccEmails.join(", ") }}
							</template>
							· saved {{ formatTimestamp(note.createdAt) }}
						</p>
						<div
							class="history-note__body"
							v-html="renderPreview(note.markdown)"
						/>
					</article>
				</div>
			</div>

			<div v-if="sentOk" class="preview" role="status" aria-live="polite">
				<div class="preview-meta">
					<div><strong>To:</strong> {{ sentRecipients.to }}</div>
					<div v-if="sentRecipients.cc.length">
						<strong>CC:</strong> {{ sentRecipients.cc.join(", ") }}
					</div>
					<div><strong>Subject:</strong> {{ previewSubject }}</div>
				</div>
				<div class="preview-body" v-html="sentPreviewHtml"></div>
				<div v-if="saveSummary" class="association-summary">
					<p class="association-title">Account storage</p>
					<p
						v-if="saveSummary.sessionNoteSavedFor"
						class="association-copy"
					>
						Session note saved to
						<strong>
							{{ saveSummary.sessionNoteSavedFor.name }}
						</strong>
						({{ saveSummary.sessionNoteSavedFor.email }}).
					</p>
					<p
						v-else-if="lastSendWasSessionNote"
						class="association-copy"
					>
						No matching user account was found for the primary
						recipient, so this session note was sent without being
						saved to the learner history pane.
					</p>
					<p
						v-if="saveSummary.internalEmailsSavedFor.length"
						class="association-copy"
					>
						Internal email saved for
						<strong>
							{{
								saveSummary.internalEmailsSavedFor
									.map(user => user.name)
									.join(", ")
							}}
						</strong>
						.
					</p>
					<p
						v-else-if="!lastSendWasSessionNote"
						class="association-copy"
					>
						No matching user accounts were found in the recipient
						list, so this email was sent without user-profile
						storage.
					</p>
				</div>
			</div>

			<pre v-else-if="resultText" class="result" role="alert">{{
				resultText
			}}</pre>
		</section>
	</AdminWorkspaceShell>
</template>

<style scoped>
.message-kind {
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	gap: 0.5rem;
	margin: 1rem;
	font: inherit;
	text-transform: none;
	letter-spacing: normal;
}
.message-kind select {
	padding: 0.5rem;
	background: var(--color-surface);
	color: var(--color-ink);
	border: 1px solid var(--color-border);
}
.note-identity-fields {
	grid-column: 1 / -1;
}

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

.history-card__meta,
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

.mail-card__header {
	display: flex;
	flex-wrap: wrap;
	align-items: end;
	justify-content: space-between;
	gap: 1rem;
}

.mail-card__header h2 {
	margin: 0;
	font-size: 1.55rem;
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

.tabs {
	display: inline-flex;
	gap: 8px;
	margin: 0;
}

.tab-btn {
	border: 1px solid #d6dce5;
	background: #f8fafc;
	color: #0f172a;
	padding: 8px 12px;
	border-radius: 999px;
	cursor: pointer;
	font-weight: 600;
}

/*noinspection CssUnusedSymbol*/
.tab-btn.active {
	background: #2563eb;
	color: white;
	border-color: #2563eb;
}

.tab-panel {
	margin-top: 8px;
}

.preview-pane {
	border: 1px solid #e2e8f0;
	border-radius: 18px;
	padding: 1rem;
	background: #fff;
}

label {
	display: block;
	margin: 12px 0 6px;
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
.manual-recipient {
	margin-top: 8px;
}
.sub-label {
	display: block;
	margin-bottom: 4px;
	font-weight: 600;
	color: #0f172a;
}
.subject-group {
	margin-top: 10px;
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
	margin: 12px 0 6px;
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
.preview {
	background: #fff;
	border: 1px solid #d8e3ed;
	border-radius: 22px;
	padding: 1.1rem;
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
.association-summary {
	margin-top: 16px;
	padding-top: 14px;
	border-top: 1px solid #e5e7eb;
	display: grid;
	gap: 6px;
}
.association-title {
	margin: 0;
	font-weight: 700;
	color: #0f172a;
}
.association-copy {
	margin: 0;
	color: #374151;
	line-height: 1.55;
}

@media (max-width: 700px) {
	.mail-card {
		padding: 1rem;
	}

	.mail-card__header,
	.mail-card__footer,
	.subject-row,
	.recipient-row {
		flex-direction: column;
		align-items: stretch;
	}

	.subject-preview {
		min-width: 0;
	}

	.tabs,
	.tab-btn,
	.send-btn,
	.picker-btn,
	.ghost-btn {
		width: 100%;
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
