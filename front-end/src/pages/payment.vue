<script lang="ts" setup>
defineOptions({ name: "PaymentPage" });

useHead({
	title: "Payment Information",
	meta: [
		{
			name: "description",
			content: "Payment information for this course-platform deployment."
		}
	]
});
</script>

<template>
	<section class="page-shell page-shell--narrow payment-page">
		<div class="payment-card site-surface">
			<p class="page-eyebrow">Payment Information</p>
			<h1 class="page-title">No payment destination is configured</h1>
			<p class="page-copy">
				This source fork intentionally ships without personal payment
				accounts, QR codes, phone numbers, or email addresses.
			</p>
			<p class="page-copy">
				An instructor who deploys the platform must publish and verify
				their own payment process before accepting payments.
			</p>
			<div class="site-action-row">
				<RouterLink
					class="site-button site-button--primary"
					to="/courses"
				>
					View Courses
				</RouterLink>
				<RouterLink class="site-button site-button--secondary" to="/">
					Go Home
				</RouterLink>
			</div>
		</div>
	</section>
</template>

<style scoped>
.payment-page {
	padding-top: clamp(2rem, 5vw, 4rem);
}

.payment-card {
	display: grid;
	gap: 1.15rem;
	padding: clamp(1.75rem, 4vw, 3rem);
}
</style>

<route lang="yaml">
meta:
    layout: default
</route>
