<script setup lang="ts">
defineOptions({ name: "ZellePaymentPage" });
</script>

<template>
	<section class="page-shell page-shell--narrow zelle-page">
		<div class="zelle-card site-surface">
			<p class="page-eyebrow">Payment Information</p>
			<h1 class="page-title">Zelle is not configured</h1>
			<p class="page-copy">
				This source fork does not include a Zelle email, phone number,
				or payment QR code.
			</p>
			<div class="site-action-row">
				<RouterLink
					class="site-button site-button--primary"
					to="/payment"
				>
					View Payment Information
				</RouterLink>
			</div>
		</div>
	</section>
</template>

<style scoped>
.zelle-page {
	padding-top: clamp(2rem, 5vw, 4rem);
}

.zelle-card {
	display: grid;
	gap: 1.15rem;
	padding: clamp(1.75rem, 4vw, 3rem);
}
</style>

<route lang="yaml">
meta:
    layout: default
</route>
