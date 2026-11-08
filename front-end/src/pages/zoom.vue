<script lang="ts" setup>
defineOptions({ name: "ZoomClassroomPage" });
</script>

<template>
	<section class="page-shell page-shell--narrow zoom-page">
		<div class="zoom-card">
			<h1 class="page-title">No meeting room is configured</h1>
			<p class="page-copy">
				Ask your instructor for the meeting link and class time.
			</p>
			<p class="page-copy">
				Use the link provided for your class to join the session.
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
	padding-top: 1rem;
}

.zoom-card {
	display: grid;
	gap: 0.75rem;
	padding: 0;
}
</style>

<route lang="yaml">
meta:
    layout: default
</route>
