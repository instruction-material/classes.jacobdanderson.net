<script lang="ts" setup>
import { ref } from "vue";
import { api } from "@/api"; // baseURL: "/api"

const to = ref("");
const subject = ref("");
const md = ref("");
const sending = ref(false);
const result = ref("");

async function sendMail() {
	result.value = "";
	sending.value = true;
	try {
		const { data } = await api.post(
			"/admin-mail/send",
			{ to: to.value, subject: subject.value, md: md.value },
			{ withCredentials: true }
		);
		result.value = JSON.stringify(data, null, 2);
	} catch (e: any) {
		result.value = e?.response?.data
			? JSON.stringify(e.response.data, null, 2)
			: String(e);
	} finally {
		sending.value = false;
	}
}
</script>

<template>
	<section class="wrap">
		<h2>Send Markdown Email (Admin)</h2>
		<label
			>To
			<input
				v-model="to"
				type="email"
				placeholder="recipient@example.com"
		/></label>
		<label
			>Subject <input v-model="subject" type="text" placeholder="Subject"
		/></label>
		<label>Markdown</label>
		<textarea v-model="md" placeholder="**Hello** _world_"></textarea>
		<button :disabled="sending" @click="sendMail">Send</button>

		<pre v-if="result" class="result">{{ result }}</pre>
	</section>
</template>

<style scoped>
.wrap {
	max-width: 900px;
	margin: 24px auto;
	padding: 16px;
}
label {
	display: block;
	margin: 12px 0 6px;
	font-weight: 600;
}
input,
textarea {
	width: 100%;
	padding: 10px;
	box-sizing: border-box;
}
textarea {
	height: 320px;
	font-family: ui-monospace, Menlo, Consolas, monospace;
}
button {
	margin-top: 16px;
	padding: 10px 16px;
}
.result {
	white-space: pre-wrap;
	background: #f7f7f7;
	border: 1px solid #ddd;
	padding: 12px;
	margin-top: 16px;
}
</style>

<route lang="json">
{
	"meta": {
		"layout": false,
		"requiresAdmin": true
	}
}
</route>
