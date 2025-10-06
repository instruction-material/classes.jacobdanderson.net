<script lang="ts" setup>
/* DevTools / warning-friendly name */
defineOptions({ name: "AboutPage" });
</script>

<template>
        <section class="About">
                <div class="content">
                        <div class="copy">
                                <h1>Meet Jacob D. Anderson</h1>
                                <p>
                                        I'm a lifelong learner and educator with a passion for helping students fall in love with
                                        problem-solving. For the last several years I taught coding, math, and science through Juni
                                        Learning, where I guided hundreds of students from their first "Hello World" program all the
                                        way to launching complex capstone projects.
                                </p>
                                <p>
                                        With Juni winding down, I'm excited to continue working directly with families and adult learners.
                                        My goal is to keep the collaborative, project-driven environment you loved while offering even more
                                        flexibility and personalized support.
                                </p>

                                <h2>Teaching philosophy</h2>
                                <ul>
                                        <li>
                                                <strong>Curiosity first:</strong> Concepts stick when students understand the "why" and can
                                                experiment freely.
                                        </li>
                                        <li>
                                                <strong>Transparent goals:</strong> Every class ends with an achievable milestone or plan so you
                                                always know what's next.
                                        </li>
                                        <li>
                                                <strong>Real-world context:</strong> We connect lessons to meaningful projects—apps, games, data
                                                explorations, or engineering challenges.
                                        </li>
                                </ul>

                                <div class="cta-group">
                                        <a class="cta" href="https://www.linkedin.com/in/jacoba1100254352/" target="_blank" rel="noreferrer">
                                                View my LinkedIn
                                        </a>
                                        <a class="cta ghost" href="https://www.jacobdanderson.net" target="_blank" rel="noreferrer">
                                                Visit my portfolio site
                                        </a>
                                </div>
                        </div>
                        <div class="image-wrapper">
                                <img
                                        alt="Jacob D. Anderson working with a student"
                                        src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=900&q=80"
                                />
                        </div>
                </div>

                <section aria-labelledby="experience-title" class="experience">
                        <h2 id="experience-title">Experience snapshot</h2>
                        <div class="experience-grid">
                                <article>
                                        <h3>Juni Learning Instructor</h3>
                                        <p>
                                                Led 1:1 and small-group classes in Python, Java, C++, physics, and AP math. Coached students through
                                                competition prep, research internships, and college application portfolios.
                                        </p>
                                </article>
                                <article>
                                        <h3>Curriculum Designer</h3>
                                        <p>
                                                Developed modules on AI fundamentals, machine learning pipelines, and modern web development using
                                                TypeScript, React, and Vue.
                                        </p>
                                </article>
                                <article>
                                        <h3>Multilingual Mentor</h3>
                                        <p>
                                                Fluent in Spanish and experienced working with bilingual families to support both academic and
                                                conversational goals.
                                        </p>
                                </article>
                        </div>
                </section>
        </section>
</template>

<style scoped>
.About {
        padding: 2.5rem 1.5rem 4rem;
        display: flex;
        flex-direction: column;
        gap: 3rem;
        color: #16202a;
}

.content {
        display: grid;
        gap: 2.5rem;
        align-items: start;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        max-width: 1100px;
        margin: 0 auto;
}

.copy {
        display: grid;
        gap: 1.5rem;
}

.copy h1 {
        font-size: clamp(2rem, 3.5vw, 2.75rem);
        margin-bottom: 0.25rem;
}

.copy p {
        margin: 0;
        line-height: 1.6;
        color: #2d3f55;
        font-size: 1.05rem;
}

.copy h2 {
        font-size: 1.6rem;
        margin-top: 0.5rem;
}

.copy ul {
        list-style: none;
        padding: 0;
        margin: 0;
        display: grid;
        gap: 1rem;
}

.copy li {
        background: #f4f8fc;
        border-radius: 16px;
        padding: 1rem 1.25rem;
        box-shadow: inset 0 0 0 1px #dbe9f8;
        line-height: 1.6;
        color: #1f3d5a;
}

.cta-group {
        display: flex;
        flex-wrap: wrap;
        gap: 1rem;
        margin-top: 0.5rem;
}

.cta {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        padding: 0.75rem 1.4rem;
        border-radius: 999px;
        font-weight: 600;
        text-decoration: none;
        background-color: #3a6ea5;
        color: white;
        transition: background-color 0.2s ease, transform 0.2s ease;
}

.cta:hover {
        background-color: #2d5c8a;
        transform: translateY(-1px);
}

.cta.ghost {
        background-color: transparent;
        color: #3a6ea5;
        border: 2px solid #3a6ea5;
}

.cta.ghost:hover {
        background-color: #e9f2fb;
}

.image-wrapper {
        width: 100%;
        max-width: 520px;
        justify-self: center;
}

.image-wrapper img {
        width: 100%;
        border-radius: 28px;
        box-shadow: 0 20px 45px rgba(13, 38, 63, 0.18);
        object-fit: cover;
}

.experience {
        max-width: 1100px;
        margin: 0 auto;
        text-align: center;
}

.experience h2 {
        font-size: clamp(1.8rem, 3vw, 2.4rem);
        margin-bottom: 2rem;
}

.experience-grid {
        display: grid;
        gap: 1.5rem;
        grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
}

.experience-grid article {
        background: white;
        border-radius: 20px;
        padding: 1.75rem;
        box-shadow: 0 14px 30px rgba(18, 64, 112, 0.08);
        text-align: left;
}

.experience-grid h3 {
        margin-bottom: 0.75rem;
        font-size: 1.2rem;
        color: #1f3d5a;
}

.experience-grid p {
        margin: 0;
        color: #2d3f55;
        line-height: 1.6;
}

@media (max-width: 640px) {
        .About {
                padding: 2rem 1.25rem 3rem;
        }

        .cta-group {
                justify-content: center;
        }
}
</style>

<route lang="json">
{
	"meta": {
		"layout": "default"
	}
}
</route>
