<template>
	<section class="wrap">
		<h2>Student Management (Admin)</h2>
		<p class="helper-text">
			Use the embedded spreadsheet below to manage student information
			without leaving the dashboard.
		</p>
		<div class="iframe-wrap">
			<iframe
				allowfullscreen
				loading="lazy"
				src="https://docs.google.com/spreadsheets/d/e/2PACX-1vSaHeIeRi1nujjE_klPrxwQ5v6Wf4gLNGgUrcbUIl2gnwCRuf7PQUD0EOT44SLqpotNODfm2bfjqEEN/pubhtml?gid=891834841&amp;single=true&amp;widget=true&amp;headers=false"
				title="Student Management Spreadsheet"
			></iframe>
		</div>
	</section>
</template>

<style scoped>
.wrap {
	max-width: 1100px;
	margin: 24px auto;
	padding: 16px;
	display: flex;
	flex-direction: column;
	gap: 16px;
}

.helper-text {
	margin: 0;
	color: #4a4a4a;
}

.iframe-wrap {
	position: relative;
	width: 100%;
	padding-top: min(70vw, 70%);
	border: 1px solid #d8dee4;
	border-radius: 8px;
	overflow: hidden;
	background: #fff;
}

.iframe-wrap iframe {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	border: 0;
}

@media (min-width: 992px) {
	.iframe-wrap {
		padding-top: 650px;
	}
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
