<template>
	<footer class="text-center">
		<div class="content w-100">
			<section class="contact">
				<h3>Resources</h3>
				<ul>
					<li>
						<a
							href="https://github.com/instruction-material"
							rel="noreferrer"
							target="_blank"
						>
							GitHub Organization
						</a>
					</li>
					<li>
						<a
							href="https://github.com/instruction-material/classes.jacobdanderson.net"
							rel="noreferrer"
							target="_blank"
						>
							Site Repository
						</a>
					</li>
				</ul>
			</section>

			<section class="brand">
				<h2>Classes</h2>
				<p>
					Project-based course materials for coding, STEM, and
					independent learning.
				</p>
			</section>

			<section class="links">
				<h3>Quick links</h3>
				<ul>
					<li>
						<RouterLink to="/courses">Course Library</RouterLink>
					</li>
					<li>
						<RouterLink to="/signup">Getting Started</RouterLink>
					</li>
					<li>
						<RouterLink to="/payment">Study Guide</RouterLink>
					</li>
					<li>
						<RouterLink to="/about"
							>About These Materials</RouterLink
						>
					</li>
				</ul>
			</section>
		</div>

		<p class="copy">
			© {{ new Date().getFullYear() }} Instruction Material contributors.
		</p>
	</footer>
</template>

<style scoped>
footer {
	background: #0f1f2f;
	color: #e6edf5;
	padding: 3rem 1.5rem 2rem;
	margin-top: 4rem;
	display: block;
}

.content {
	display: grid;
	grid-template-columns: repeat(3, minmax(0, 1fr));
	gap: 2rem 2.5rem;
	align-items: center;
	justify-items: center;
	align-content: space-around;
	margin: 0 auto 2rem;
}

.content > section {
	min-width: 0;
}

.copy {
	display: block;
	clear: both;
	margin: 0;
	color: #8fa6c1;
	font-size: 0.9rem;
}

@media (max-width: 960px) {
	.content {
		grid-template-columns: 1fr;
	}

	.content > .contact {
		order: 2;
	}

	.content > .brand {
		order: 1;
	}

	.content > .links {
		order: 3;
	}
}

@media (min-width: 960px) {
	.brand {
		width: 100%;
	}
}

.brand h2 {
	margin: 0 0 0.75rem 0;
	font-size: 1.6rem;
}

.brand p {
	margin: auto;
	line-height: 1.6;
	color: #c8d8eb;
}

.links h3,
.contact h3 {
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
