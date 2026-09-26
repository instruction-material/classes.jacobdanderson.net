<script lang="ts" setup>
defineOptions({ name: "ZoomClassroomPage" });
</script>

<template>
	<section class="page-shell page-shell--narrow zoom-page">
		<div class="zoom-card site-surface">
			<p class="page-eyebrow">Online Classroom</p>
			<h1 class="page-title">No meeting room is configured</h1>
			<p class="page-copy">
				This source fork intentionally ships without a public meeting ID
				or join link.
			</p>
			<p class="page-copy">
				An instructor who enables video meetings must provide the link
				through an access-controlled channel appropriate for their
				students.
			</p>
			<div class="site-action-row">
				<RouterLink
					class="site-button site-button--primary"
					to="/courses"
				>
					View Courses
				</RouterLink>
			</div>
		</div>
	</section>
</template>

<style scoped>
.zoom-page {
	padding-top: clamp(2rem, 5vw, 4rem);
}

.zoom-card {
	display: grid;
	gap: 1.15rem;
	padding: clamp(1.75rem, 4vw, 3rem);
}
</style>

<route lang="yaml">
meta:
    layout: default
</route>
