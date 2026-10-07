<script lang="ts" setup>
import { nextTick, watch } from "vue";
import { useRoute } from "vue-router";
import AccountManagement from "~/components/AccountManagement.vue";
import TheHeader from "~/components/TheHeader.vue";
import { useAppStore } from "../stores/app";

const app = useAppStore();
const route = useRoute();
watch(
	() => route.path,
	async () => {
		await nextTick();
		// Focus the persistent landmark, including while an async page is loading.
		document.getElementById("main-content")?.focus({ preventScroll: true });
	}
);

function showLoginModal() {
	app.setLoginBlock(true);
}

function showSignupModal() {
	app.setSignupBlock(true);
}
</script>

<template>
	<div
		class="site-frame"
		:class="{ 'site-frame--content': route.path !== '/' }"
	>
		<a class="skip-link" href="#main-content">Skip to content</a>

		<TheHeader
			@login-click="showLoginModal"
			@signup-click="showSignupModal"
		/>

		<!----------------------------
		-   Login and Signup Forms   -
		----------------------------->

		<AccountManagement />

		<main id="main-content" class="site-main" tabindex="-1">
			<RouterView />
		</main>
		<TheFooter
			v-if="route.path !== '/graph-sketcher'"
			:compact="route.path !== '/'"
		/>
	</div>
</template>
