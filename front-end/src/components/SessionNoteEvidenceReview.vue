<script setup lang="ts">
import { ref } from "vue";
import { api } from "@/api";
import WorkspaceDisclosure from "@/components/WorkspaceDisclosure.vue";
import { retainEvidenceActionKey } from "@/modules/sessionNoteSendIntent";

interface Operation {
	operationId: string;
	noteId: string;
	evidenceStatus: string;
	statusReason: string;
	archivalStatus: string;
}
const operations = ref<Operation[]>([]);
const sendingPaused = ref<boolean | null>(null);
const unlinked = ref<{ noteId: string; studentId: string | null }[]>([]);
const external = ref<
	{ recordId: string; studentId: string; evidenceStatus: string }[]
>([]);
const writers = ref<
	{
		studentId: string;
		writerId: string;
		startedAt: string;
		active: boolean;
	}[]
>([]);
const writer = ref({ studentId: "", writerId: "", evidenceRef: "" });
const message = ref("");
const loading = ref(false);
const selectedOperation = ref("");
const evidenceRef = ref("");
const decision = ref("keep_unconfirmed");
const association = ref({ noteId: "", studentId: "", scheduledSessionId: "" });
const registration = ref({
	studentId: "",
	scheduledSessionId: "",
	noteId: "",
	classDate: "",
	source: "admin_attestation",
	observedSendAt: "",
	evidenceRef: "",
	unlinked: false
});
async function loadReview() {
	loading.value = true;
	try {
		const { data } = await api.get("/admin-mail/session-notes/review");
		operations.value = data.operations;
		sendingPaused.value =
			typeof data.sendingPaused === "boolean" ? data.sendingPaused : null;
		unlinked.value = data.unlinkedNotes ?? [];
		external.value = data.externalEvidence ?? [];
		writers.value = data.writerMarkers ?? [];
	} catch {
		sendingPaused.value = null;
		message.value = "Review queue unavailable.";
	} finally {
		loading.value = false;
	}
}
async function disposition() {
	try {
		await api.post(
			`/admin-mail/session-notes/operations/${selectedOperation.value}/disposition`,
			{
				decision: decision.value,
				evidenceRef: evidenceRef.value,
				idempotencyKey: await retainEvidenceActionKey(
					JSON.stringify({
						kind: "disposition",
						operation: selectedOperation.value,
						decision: decision.value,
						evidenceRef: evidenceRef.value
					})
				)
			}
		);
		message.value = decision.value.startsWith("archive_")
			? "Archival disposition recorded. SMTP evidence is unchanged; no email was sent."
			: decision.value === "retry_nonaccepted"
				? "Audited retry queued. Delivery occurs only when sending is enabled."
				: "Disposition recorded. No email was sent.";
		await loadReview();
	} catch {
		message.value =
			"Disposition rejected or unavailable. The existing state is preserved.";
	}
}
async function releaseWriter() {
	try {
		await api.post(
			`/admin-mail/session-notes/students/${writer.value.studentId}/writer-disposition`,
			{
				writerId: writer.value.writerId,
				evidenceRef: writer.value.evidenceRef,
				decision: "confirmed_process_stopped",
				idempotencyKey: await retainEvidenceActionKey(
					JSON.stringify({
						kind: "writer-disposition",
						...writer.value
					})
				)
			}
		);
		message.value =
			"Stopped writer disposition recorded. No email was sent.";
		await loadReview();
	} catch {
		message.value =
			"Marker retained. Pause sending/recovery, verify the old process stopped, and check the protected evidence reference.";
	}
}
async function correctAssociation() {
	try {
		await api.post(
			`/admin-mail/session-notes/${association.value.noteId}/association`,
			{
				studentId: association.value.studentId,
				scheduledSessionId: association.value.scheduledSessionId,
				idempotencyKey: await retainEvidenceActionKey(
					JSON.stringify({
						kind: "association",
						...association.value
					})
				)
			}
		);
		message.value = "Session identity correction recorded with history.";
		await loadReview();
	} catch {
		message.value =
			"Association rejected. Verify the actual student and session IDs.";
	}
}
let evidenceKey = "";
let evidenceSignature = "";
async function registerEvidence() {
	const { noteId, scheduledSessionId, ...fields } = registration.value;
	const signature = JSON.stringify(registration.value);
	if (signature !== evidenceSignature) {
		evidenceSignature = signature;
		evidenceKey = crypto.randomUUID();
	}
	try {
		await api.post("/session-notes/evidence", {
			...fields,
			noteId: noteId || undefined,
			scheduledSessionId: scheduledSessionId || undefined,
			evidenceType:
				fields.source === "mac_sent_item"
					? "observed_sent_item"
					: "user_attestation",
			idempotencyKey: evidenceKey
		});
		message.value =
			"External evidence registered separately. This does not claim site SMTP acceptance or inbox delivery.";
	} catch {
		message.value =
			"Registration rejected or unavailable. Keep the same evidence reference for retries.";
	}
}
</script>

<template>
	<WorkspaceDisclosure
		class="evidence-review"
		@toggle="open => open && loadReview()"
	>
		<template #label>Session-note evidence review</template>
		<p>
			Use verified student and session IDs. Dates and shared mailboxes do
			not identify a class. A proven-nonacceptance retry queues delivery;
			uncertain outcomes remain blocked.
		</p>
		<p v-if="sendingPaused === true" role="status">
			Session-note sending is paused. Queued operations require operator
			activation before they can attempt SMTP; do not submit duplicate
			sends.
		</p>
		<button type="button" :disabled="loading" @click="loadReview">
			Refresh review queue
		</button>
		<p role="status">{{ message }}</p>
		<ul>
			<li v-for="operation in operations" :key="operation.operationId">
				{{ operation.operationId }} · {{ operation.evidenceStatus }} ·
				{{ operation.statusReason }} · note {{ operation.noteId }} ·
				archive {{ operation.archivalStatus }}
			</li>
			<li v-for="note in unlinked" :key="note.noteId">
				Unlinked note {{ note.noteId }} · student {{ note.studentId }}
			</li>
			<li v-for="item in external" :key="item.recordId">
				External {{ item.recordId }} · student {{ item.studentId }} ·
				{{ item.evidenceStatus }}
			</li>
			<li v-for="item in writers" :key="item.writerId">
				Writer {{ item.writerId }} · student {{ item.studentId }} ·
				since {{ item.startedAt }} ·
				{{ item.active ? "active" : "requires process review" }}
			</li>
		</ul>
		<form v-if="writers.length" @submit.prevent="releaseWriter">
			<h3>Review a stopped writer</h3>
			<p>
				Pause sending and recovery first. Verify that the old process
				has stopped using protected operational evidence. Time alone
				cannot prove it stopped; active writers cannot be cleared.
			</p>
			<label
				>Student ID <input v-model="writer.studentId" required
			/></label>
			<label
				>Writer ID <input v-model="writer.writerId" required
			/></label>
			<label
				>Protected evidence reference (SHA-256)
				<input
					v-model="writer.evidenceRef"
					required
					pattern="[a-f0-9]{64}"
			/></label>
			<button type="submit">Record stopped-process disposition</button>
		</form>
		<form @submit.prevent="disposition">
			<h3>Resolve an uncertain send or archive</h3>
			<label
				>Operation ID <input v-model="selectedOperation" required
			/></label>
			<label
				>Protected evidence reference (SHA-256)
				<input v-model="evidenceRef" required pattern="[a-f0-9]{64}"
			/></label>
			<label
				>Disposition
				<select v-model="decision">
					<option value="retry_nonaccepted">
						Queue a retry after proven nonacceptance
					</option>
					<option value="keep_unconfirmed">
						Keep outcome unconfirmed
					</option>
					<option value="confirmed_not_accepted">
						Evidence establishes nonacceptance
					</option>
					<option value="archive_confirmed_present">
						Archive: evidence confirms the Sent copy exists
					</option>
					<option value="archive_confirmed_absent">
						Archive: proven absent, queue an archive-only retry
					</option>
					<option value="archive_keep_unconfirmed">
						Archive: keep the append outcome unconfirmed
					</option>
				</select></label
			>
			<p>
				A Sent item can be registered below. Manual review cannot
				manufacture an SMTP acceptance timestamp. Pause sending and
				recovery before resolving an archive, and verify its outcome
				against protected mailbox evidence.
			</p>
			<button type="submit">Record disposition</button>
		</form>
		<form @submit.prevent="correctAssociation">
			<h3>Verify or correct a note’s session</h3>
			<label
				>Note ID <input v-model="association.noteId" required
			/></label>
			<label
				>Student ID <input v-model="association.studentId" required
			/></label>
			<label
				>Actual scheduled session ID
				<input v-model="association.scheduledSessionId" required
			/></label>
			<button type="submit">Record session correction</button>
		</form>
		<form @submit.prevent="registerEvidence">
			<h3>Register mail sent outside Classes</h3>
			<label
				>Student ID <input v-model="registration.studentId" required
			/></label>
			<label
				>Scheduled session ID
				<input
					v-model="registration.scheduledSessionId"
					:disabled="registration.unlinked"
			/></label>
			<label
				><input
					v-model="registration.unlinked"
					type="checkbox"
					@change="registration.scheduledSessionId = ''"
				/>
				No verified session; review required</label
			>
			<label
				>Saved note ID (optional) <input v-model="registration.noteId"
			/></label>
			<label
				>Class date
				<input v-model="registration.classDate" type="date" required
			/></label>
			<label
				>Observed send timestamp (ISO 8601 with timezone)
				<input
					v-model="registration.observedSendAt"
					placeholder="2026-10-04T15:00:00Z"
					required
			/></label>
			<label
				>Evidence source
				<select v-model="registration.source">
					<option value="admin_attestation">
						Administrator attestation
					</option>
					<option value="mac_sent_item">Observed Sent item</option>
				</select></label
			>
			<label
				>Opaque local evidence reference (SHA-256)
				<input
					v-model="registration.evidenceRef"
					pattern="[a-f0-9]{64}"
					required
			/></label>
			<p>
				Submit metadata only. Keep note contents, subjects, addresses
				and mailbox identifiers private.
			</p>
			<button type="submit">Register evidence</button>
		</form>
	</WorkspaceDisclosure>
</template>

<style scoped>
.evidence-review {
	margin: 1.5rem 0;
}
form {
	display: grid;
	gap: 0.75rem;
	margin-top: 1.5rem;
}
label {
	display: grid;
	gap: 0.25rem;
}
input,
select {
	width: 100%;
}
input[type="checkbox"] {
	width: auto;
}
li {
	overflow-wrap: anywhere;
}
</style>
