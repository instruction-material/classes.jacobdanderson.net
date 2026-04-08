<script lang="ts" setup>
import { useContentStore } from "@/stores/content";

defineOptions({ name: "StudyGuidePage" });
const content = useContentStore();
</script>

<template>
	<section class="Payment">
		<div class="intro">
			<h1>Study Guide</h1>
			<p>
				Use this page as a quick reference for pacing, practice, and
				common questions when working through the course library.
			</p>
			<div class="tuition-card">
				<div class="rate">
					<span class="amount">3</span>
					<span class="details">Core habits</span>
				</div>
				<ul>
					<li>Review the previous lesson before starting a new one.</li>
					<li>Keep small notes on bugs, ideas, and questions.</li>
					<li>Finish or revise projects before jumping levels.</li>
				</ul>
			</div>
		</div>

		<section aria-labelledby="rhythm-title" class="payment">
			<h2 id="rhythm-title">Practice Rhythm</h2>
			<p>
				Short, consistent practice usually beats infrequent marathon
				sessions. Try to alternate between learning new material,
				revisiting earlier work, and polishing a recent project.
			</p>
			<div class="note">
				<p>
					A useful pattern is: one guided lesson, one practice block,
					and one project-improvement session each week. That balance
					helps students keep both conceptual understanding and coding
					fluency moving forward.
				</p>
			</div>
		</section>

		<section aria-labelledby="faq-title" class="faq w-100">
			<h2 id="faq-title">FAQ</h2>
			<div id="faqAccordion" class="accordion">
				<div
					v-for="(faq, i) in content.faqs"
					:key="i"
					class="accordion-item"
				>
					<h2 :id="`faq${i}-heading`" class="accordion-header">
						<button
							class="accordion-button collapsed"
							type="button"
							data-bs-toggle="collapse"
							:data-bs-target="`#faq${i}`"
							:aria-expanded="false"
							:aria-controls="`faq${i}`"
						>
							{{ faq.question }}
						</button>
					</h2>
					<div
						:id="`faq${i}`"
						class="accordion-collapse collapse"
						:class="{ show: false }"
						:aria-labelledby="`faq${i}-heading`"
						data-bs-parent="#faqAccordion"
					>
						<div class="accordion-body">
							{{ faq.answer }}
						</div>
					</div>
				</div>
			</div>
		</section>

		<section aria-labelledby="schedule-title" class="schedule">
			<h2 id="schedule-title">Next Step</h2>
			<p>
				Choose a course, work through the first module, and use the
				getting started page if you need help choosing a level or study
				rhythm.
			</p>
			<div class="cta-group">
				<RouterLink class="cta" to="/courses">Browse Courses</RouterLink>
				<RouterLink class="cta ghost" to="/signup">
					Open Getting Started
				</RouterLink>
			</div>
		</section>
	</section>
</template>

<style scoped>
.Payment {
	display: flex;
	flex-direction: column;
	gap: 3rem;
	padding: 2.5rem 1.5rem 4rem;
	color: #16202a;
	align-items: center;
}

.intro {
	max-width: 900px;
	text-align: center;
	display: grid;
	gap: 1.5rem;
}

.intro h1 {
	font-size: clamp(2rem, 3.5vw, 2.75rem);
}

.intro p {
	margin: 0 auto;
	line-height: 1.6;
	font-size: 1.05rem;
	color: #2d3f55;
}

.tuition-card {
	margin: 0 auto;
	padding: 2rem;
	border-radius: 24px;
	background: linear-gradient(135deg, #1f3d5a, #3a6ea5);
	color: white;
	display: grid;
	gap: 1.25rem;
	max-width: 520px;
	box-shadow: 0 24px 50px rgba(13, 38, 63, 0.25);
}

.rate {
	display: flex;
	flex-direction: column;
	gap: 0.35rem;
	align-items: center;
}

.amount {
	font-size: clamp(2.5rem, 5vw, 3.5rem);
	font-weight: 700;
}

.details {
	font-size: 0.95rem;
	letter-spacing: 0.12em;
	text-transform: uppercase;
}

.tuition-card ul {
	list-style: none;
	padding: 0;
	margin: 0;
	display: grid;
	gap: 0.75rem;
	text-align: left;
	font-size: 1rem;
}

.payment,
.faq,
.schedule {
	max-width: 900px;
	margin: 0 auto;
	text-align: center;
	display: grid;
	gap: 1.25rem;
}

.payment p,
.faq p,
.schedule p {
	margin: 0;
	line-height: 1.6;
	color: #2d3f55;
	font-size: 1.05rem;
}

.cta {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	padding: 0.85rem 1.5rem;
	border-radius: 999px;
	font-weight: 600;
	text-decoration: none;
	background-color: #3a6ea5;
	color: white;
	transition:
		background-color 0.2s ease,
		transform 0.2s ease;
	border: 2px solid transparent;
	width: fit-content;
	margin: 0 auto;
}

.cta:hover {
	background-color: #2d5c8a;
	transform: translateY(-2px);
}

.cta.ghost {
	background-color: white;
	border-color: #3a6ea5;
	color: #3a6ea5;
}

.cta.ghost:hover {
	background-color: #e9f2fb;
}

.note {
	background: #f4f8fc;
	border-radius: 16px;
	padding: 1.5rem;
	box-shadow: inset 0 0 0 1px #dbe9f8;
}

.faq {
	text-align: left;
}

.faq h2 {
	text-align: center;
}

.schedule {
	gap: 1rem;
}

.cta-group {
	display: flex;
	flex-wrap: wrap;
	justify-content: center;
	gap: 1rem;
}

@media (max-width: 600px) {
	.Payment {
		padding: 2rem 1.25rem 3rem;
	}
}
</style>
