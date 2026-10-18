<script setup lang="ts">
import { onBeforeUnmount, ref, watch } from "vue";
import { api } from "@/api";
import AccountSecurity from "@/components/AccountSecurity.vue";
import { useAppStore } from "@/stores/app";

const props = defineProps<{
	entity: { _id: string; name: string; email: string };
	role: "admin" | "tutor" | "user";
}>();
const app = useAppStore();
const name = ref(props.entity.name);
const editing = ref(false);
const securityBusy = ref(false);
const status = ref("");
const error = ref("");
const busy = ref(false);
let nameRequest: AbortController | null = null;
watch(
	() => props.entity.name,
	value => {
		if (!editing.value) name.value = value;
	}
);
watch(
	() => [props.entity._id, props.role],
	() => {
		nameRequest?.abort();
		nameRequest = null;
		busy.value = editing.value = securityBusy.value = false;
		name.value = props.entity.name;
		status.value = error.value = "";
	},
	{ flush: "sync" }
);
onBeforeUnmount(() => nameRequest?.abort());
function toggleEditing() {
	if (busy.value || securityBusy.value) return;
	name.value = props.entity.name;
	status.value = error.value = "";
	editing.value = !editing.value;
}
async function saveName() {
	if (busy.value || securityBusy.value) return;
	status.value = error.value = "";
	busy.value = true;
	const request = new AbortController();
	nameRequest = request;
	const accountId = props.entity._id;
	const role = props.role;
	try {
		const path =
			role === "user"
				? "/users/user/"
				: role === "tutor"
					? "/tutors/"
					: "/admins/";
		await api.put(
			path + accountId,
			{ name: name.value.trim() },
			{
				signal: request.signal,
				timeout: 30_000
			}
		);
		if (nameRequest !== request) return;
		if (role === "admin") await app.refreshCurrentAdmin();
		else if (role === "tutor") await app.refreshCurrentTutor();
		else await app.refreshCurrentUser();
		if (nameRequest !== request) return;
		editing.value = false;
		status.value = "Name updated.";
	} catch (cause: any) {
		if (nameRequest !== request) return;
		error.value =
			cause.response?.data?.message ?? "Unable to update your name.";
	} finally {
		if (nameRequest === request) {
			nameRequest = null;
			busy.value = false;
		}
	}
}
</script>

<template>
	<section class="self-account-settings">
		<header class="profile-heading">
			<h2>Profile</h2>
			<button
				class="btn-secondary btn"
				type="button"
				:disabled="busy || securityBusy"
				@click="toggleEditing"
			>
				{{ editing ? "Cancel" : "Edit" }}
			</button>
		</header>
		<dl v-if="!editing" class="profile-values">
			<div>
				<dt>Name</dt>
				<dd>{{ entity.name }}</dd>
			</div>
		</dl>
		<form v-else class="profile-name-form" @submit.prevent="saveName">
			<label>
				<span>Name</span>
				<input
					v-model="name"
					name="profile-name"
					autocomplete="name"
					required
					maxlength="160"
					:disabled="busy || securityBusy"
				/>
			</label>
			<button
				class="btn-secondary btn"
				type="submit"
				:disabled="busy || securityBusy || name.trim() === entity.name"
			>
				{{ busy ? "Saving…" : "Update name" }}
			</button>
		</form>
		<p v-if="status" role="status">{{ status }}</p>
		<p v-if="error" role="alert">{{ error }}</p>
		<AccountSecurity
			v-model:editing="editing"
			:entity-id="entity._id"
			:email="entity.email"
			:role="role"
			@busy="securityBusy = $event"
		/>
	</section>
</template>

<style scoped>
.self-account-settings {
	max-width: 44rem;
	display: grid;
	gap: 0.8rem;
}
.self-account-settings h2 {
	font-size: 1.1rem;
	margin: 0 0 0.25rem;
}
.profile-heading {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 1rem;
}
.profile-heading button {
	margin: 0;
}
.profile-values {
	margin: 0;
}
.profile-values > div {
	display: grid;
	grid-template-columns: 6rem minmax(0, 1fr);
	gap: 0.75rem;
	padding-block: 0.35rem;
}
.profile-values dt {
	font-weight: 500;
	color: var(--color-ink-soft);
}
.profile-values dd {
	margin: 0;
	overflow-wrap: anywhere;
}
.profile-name-form {
	display: grid;
	gap: 0.65rem;
}
.profile-name-form label {
	flex: 1 1 15rem;
	display: grid;
	gap: 0.35rem;
	font-size: 0.9rem;
}
.profile-name-form input {
	width: 100%;
	padding: 0.5rem 0.65rem;
	border: 1px solid var(--color-border);
	border-radius: 6px;
	color: var(--color-ink);
	background: var(--color-surface);
}
.profile-name-form button {
	margin: 0;
	justify-self: start;
}
</style>
