<script lang="ts" setup></script>

<template>
        <footer class="Footer">
                <div class="Footer__inner">
                        <section class="brand">
                                <h2>Jacob Anderson Tutoring</h2>
                                <p>
                                        Personalized tutoring for coding, STEM, and Spanish. Serving students online across the U.S. from Provo,
                                        Utah.
                                </p>
                        </section>

                        <section class="links">
                                <h3>Quick links</h3>
                                <ul>
                                        <li>
                                                <RouterLink to="/signup">Book a class</RouterLink>
                                        </li>
                                        <li>
                                                <RouterLink to="/supportus">Tuition &amp; payment</RouterLink>
                                        </li>
                                        <li>
                                                <RouterLink to="/about">About Jacob</RouterLink>
                                        </li>
                                </ul>
                        </section>

                        <section class="contact">
                                <h3>Connect</h3>
                                <ul>
                                        <li>
                                                <a href="mailto:jacob@jacobdanderson.net">jacob@jacobdanderson.net</a>
                                        </li>
                                        <li>
                                                <a href="https://www.linkedin.com/in/jacoba1100254352/" rel="noreferrer" target="_blank">
                                                        LinkedIn
                                                </a>
                                        </li>
                                        <li>
                                                <a
                                                        href="https://github.com/Jacoba1100254352/classes.jacobdanderson.net"
                                                        rel="noreferrer"
                                                        target="_blank"
                                                >
                                                        GitHub repository
                                                </a>
                                        </li>
                                </ul>
                        </section>
                </div>

                <p class="copy">© {{ new Date().getFullYear() }} Jacob D. Anderson. All rights reserved.</p>
        </footer>
</template>

<style scoped>
.Footer {
        background: #0f1f2f;
        color: #e6edf5;
        padding: 3rem 1.5rem 2rem;
        margin-top: 4rem;
}

.Footer__inner {
        display: grid;
        gap: 2.5rem;
        grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
        max-width: 1100px;
        margin: 0 auto 2rem;
}

.brand h2 {
        margin-bottom: 0.75rem;
        font-size: 1.6rem;
}

.brand p {
        margin: 0;
        line-height: 1.6;
        color: #c8d8eb;
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

.copy {
        text-align: center;
        margin: 0;
        color: #8fa6c1;
        font-size: 0.9rem;
}

@media (max-width: 600px) {
        .Footer {
                padding: 2.5rem 1.25rem 1.75rem;
        }
}
</style>
