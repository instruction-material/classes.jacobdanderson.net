<script setup lang="ts">
import { onMounted, ref } from "vue";
import { api } from "@/api";
import { useAppStore } from "@/stores/app";

const app = useAppStore();
const token = ref("");
const status = ref("");
const error = ref("");
const busy = ref(false);
onMounted(() => {
	token.value = window.location.hash.slice(1);
	window.history.replaceState(
		window.history.state,
		"",
		window.location.pathname + window.location.search
	);
});
async function verify() {
	if (busy.value) return;
	error.value = "";
	busy.value = true;
	try {
		const { data } = await api.post("/accounts/email-change/confirm", {
			token: token.value
		});
		status.value = data.message;
		token.value = "";
		if (app.currentAdmin) await app.refreshCurrentAdmin();
		else if (app.currentTutor) await app.refreshCurrentTutor();
		else await app.refreshCurrentUser();
	} catch (cause: any) {
		error.value =
			cause.response?.data?.message ??
			"Unable to verify this email change.";
	} finally {
		busy.value = false;
	}
}
</script>

<template>
	<section class="page-shell page-shell--narrow">
		<h1>Verify email change</h1>
		<p v-if="status" role="status">{{ status }}</p>
		<template v-else>
			<p>
				Confirm this change while signed in to the account that
				requested it.
			</p>
			<p v-if="error" role="alert">{{ error }}</p>
			<button
				v-if="app.isLoggedIn"
				class="site-button site-button--primary"
				type="button"
				:disabled="busy || !token"
				@click="verify"
			>
				{{ busy ? "Verifying…" : "Verify new email" }}
			</button>
			<button
				v-else
				class="site-button"
				type="button"
				@click="app.setLoginBlock(true)"
			>
				Sign in to verify
			</button>
		</template>
		<RouterLink to="/profile">Account Settings</RouterLink>
	</section>
</template>
