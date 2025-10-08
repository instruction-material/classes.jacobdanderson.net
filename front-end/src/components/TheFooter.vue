<script lang="ts" setup></script>

<template>
	<footer class="Footer">
		<div class="Footer__inner">
			<section class="contact">
				<h3>Connect</h3>
				<ul>
					<li>
						<a href="mailto:jacobdanderson@gmail.com"
							>jacobdanderson@gmail.com</a
						>
						<!--						<a href="mailto:jacob@jacobdanderson.net" -->
						<!--							>jacob@jacobdanderson.net</a -->
						<!--						> -->
					</li>
					<li>
						<a
							href="https://www.linkedin.com/in/jacoba1100254352/"
							rel="noreferrer"
							target="_blank"
						>
							LinkedIn
						</a>
					</li>
					<li>
						<a
							href="https://github.com/anderson-webops/classes.jacobdanderson.net"
							rel="noreferrer"
							target="_blank"
						>
							GitHub repository
						</a>
					</li>
				</ul>
			</section>

			<section class="brand">
				<h2>Jacob Anderson Tutoring</h2>
				<p>
					Personalized tutoring for coding, STEM, and Spanish. Serving
					students online across the U.S.
				</p>
			</section>

			<section class="links">
				<h3>Quick links</h3>
				<ul>
					<li>
						<RouterLink to="/signup">Book a class</RouterLink>
					</li>
					<li>
						<RouterLink to="/payment"
							>Tuition &amp; payment</RouterLink
						>
					</li>
					<li>
						<RouterLink to="/about">About Jacob</RouterLink>
					</li>
				</ul>
			</section>
		</div>

		<p class="copy">
			© {{ new Date().getFullYear() }} Jacob Anderson. All rights
			reserved.
		</p>
	</footer>
</template>

<style scoped>
.Footer {
	background: #0f1f2f;
	color: #e6edf5;
	padding: 3rem 1.5rem 2rem;
	margin-top: 4rem;
	/* Ensure nothing weird wraps alongside */
	display: block;
}

.Footer__inner {
	display: grid;
	/* 3 perfectly equal columns */
	grid-template-columns: repeat(3, minmax(0, 1fr));
	gap: 2rem 2.5rem;
	align-items: start;
	justify-items: start;

	/* WIDTH CONTROL:
	   - If you want it to stretch wider, increase or remove max-width.
	   - 100% makes it edge-to-edge inside Footer’s padding. */
	max-width: 1200px; /* try 1280px or remove this line */
	width: 100%;
	margin: 0 auto 2rem;
}

/* Make sure each section can’t force the column wider */
.Footer__inner > section {
	min-width: 0;
}

/* Copyright: own line, never next to columns */
.copy {
	display: block;
	clear: both; /* belts-and-braces if some global floats exist */
	width: 100%;
	text-align: center;
	margin: 0;
	color: #8fa6c1;
	font-size: 0.9rem;
}

/* Tablet: 2 columns */
@media (max-width: 960px) {
	.Footer__inner {
		grid-template-columns: repeat(2, minmax(0, 1fr));
	}
}

/* Phone: 1 column */
@media (max-width: 600px) {
	.Footer {
		padding: 2.5rem 1.25rem 1.75rem;
	}
	.Footer__inner {
		grid-template-columns: 1fr;
	}
}

/* Typography and links (unchanged) */
.brand h2 {
	margin: 0 0 0.75rem 0;
	font-size: 1.6rem;
}
.brand p {
	margin: 0;
	line-height: 1.6;
	color: #c8d8eb;
}

.links h3,
.contact h3 {
	margin: 0 0 0.75rem 0;
	font-size: 1.1rem;
}
.links ul,
.contact ul {
	list-style: none;
	margin: 0;
	padding: 0;
	display: grid;
	gap: 0.75rem;
}

.links a,
.contact a {
	color: #9ec3f4;
	text-decoration: none;
	font-weight: 600;
}
.links a:hover,
.contact a:hover {
	text-decoration: underline;
}
</style>
