<script setup lang="ts">
import { ref, watch } from "vue";
import { api } from "@/api";
import AccountSecurity from "@/components/AccountSecurity.vue";
import { useAppStore } from "@/stores/app";

const props = defineProps<{
	entity: { _id: string; name: string; email: string };
	role: "admin" | "tutor" | "user";
}>();
const app = useAppStore();
const name = ref(props.entity.name);
const status = ref("");
const error = ref("");
const busy = ref(false);
watch(
	() => props.entity.name,
	value => {
		name.value = value;
	}
);
async function saveName() {
	if (busy.value) return;
	status.value = error.value = "";
	busy.value = true;
	try {
		const path =
			props.role === "user"
				? "/users/user/"
				: props.role === "tutor"
					? "/tutors/"
					: "/admins/";
		await api.put(path + props.entity._id, { name: name.value.trim() });
		if (props.role === "admin") await app.refreshCurrentAdmin();
		else if (props.role === "tutor") await app.refreshCurrentTutor();
		else await app.refreshCurrentUser();
		status.value = "Name updated.";
	} catch (cause: any) {
		error.value =
			cause.response?.data?.message ?? "Unable to update your name.";
	} finally {
		busy.value = false;
	}
}
</script>

<template>
	<section class="self-account-settings">
		<h2>Profile</h2>
		<form class="profile-name-form" @submit.prevent="saveName">
			<label>
				<span>Name</span>
				<input
					v-model="name"
					autocomplete="name"
					required
					maxlength="160"
					:disabled="busy"
				/>
			</label>
			<button
				class="btn-secondary btn"
				type="submit"
				:disabled="busy || name.trim() === entity.name"
			>
				{{ busy ? "Saving…" : "Save name" }}
			</button>
		</form>
		<p v-if="status" role="status">{{ status }}</p>
		<p v-if="error" role="alert">{{ error }}</p>
		<div class="profile-email">
			<span>Email</span><span>{{ entity.email }}</span>
		</div>
		<AccountSecurity
			:entity-id="entity._id"
			:email="entity.email"
			:role="role"
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
.profile-name-form {
	display: flex;
	align-items: end;
	gap: 0.65rem;
	flex-wrap: wrap;
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
}
.profile-email {
	display: grid;
	gap: 0.3rem;
	font-size: 0.9rem;
	overflow-wrap: anywhere;
}
.profile-email > span:first-child {
	color: var(--color-ink-soft);
}
</style>
