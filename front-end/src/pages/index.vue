<script lang="ts" setup>
defineOptions({ name: "HomePage" });

const subjectGroups = [
        {
                title: "Programming & Computer Science",
                subjects: [
                        "Python",
                        "Intro to Artificial Intelligence",
                        "Intro to Machine Learning",
                        "Java",
                        "C++",
                        "C",
                        "Scratch",
                ],
        },
        {
                title: "Web Technologies",
                subjects: ["HTML", "CSS", "JavaScript", "TypeScript", "Responsive Design"],
        },
        {
                title: "STEM & Language",
                subjects: ["Math", "Physics", "Spanish"],
        },
];

const highlights = [
        {
                title: "Experienced Instructor",
                copy: "Former Juni Learning instructor now offering direct 1:1 sessions tailored to each learner's goals and pace.",
        },
        {
                title: "Project-Based Learning",
                copy: "Every class connects concepts to real-world challenges so students can apply their skills immediately.",
        },
        {
                title: "Flexible Scheduling",
                copy: "50-minute lessons with built-in buffer time to finish tough problems without feeling rushed.",
        },
];
</script>

<template>
        <section class="Home">
                <div class="hero">
                        <div class="hero-text">
                                <p class="eyebrow">One-on-one tutoring with Jacob D. Anderson</p>
                                <h1>Build confidence in coding, STEM, and Spanish.</h1>
                                <p>
                                        I specialize in guiding middle school, high school, and adult learners through programming,
                                        engineering, and language topics. Every session is structured around the student's goals—whether
                                        that's acing a class, preparing for AP exams, or exploring new technologies like AI and machine
                                        learning.
                                </p>
                                <div class="hero-actions">
                                        <RouterLink class="cta primary" to="/signup">Book a class</RouterLink>
                                        <RouterLink class="cta secondary" to="/supportus">See tuition details</RouterLink>
                                </div>
                        </div>
                        <img
                                alt="Student and tutor collaborating on a laptop"
                                class="hero-image"
                                src="https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?auto=format&fit=crop&w=1200&q=80"
                        />
                </div>

                <section aria-labelledby="subjects-title" class="subjects">
                        <h2 id="subjects-title">What I teach</h2>
                        <p class="intro">
                                Choose from structured curricula or bespoke projects across computer science, STEM, and language.
                        </p>
                        <div class="subject-grid">
                                <article v-for="group in subjectGroups" :key="group.title" class="subject-card">
                                        <h3>{{ group.title }}</h3>
                                        <ul>
                                                <li v-for="subject in group.subjects" :key="subject">{{ subject }}</li>
                                        </ul>
                                </article>
                        </div>
                </section>

                <section aria-labelledby="highlights-title" class="highlights">
                        <h2 id="highlights-title">Why families work with me</h2>
                        <div class="highlight-grid">
                                <article v-for="highlight in highlights" :key="highlight.title" class="highlight-card">
                                        <h3>{{ highlight.title }}</h3>
                                        <p>{{ highlight.copy }}</p>
                                </article>
                        </div>
                </section>

                <section aria-labelledby="next-steps-title" class="next-steps">
                        <div class="next-steps-card">
                                <h2 id="next-steps-title">Ready to get started?</h2>
                                <p>
                                        Pick a time on my Calendly, tell me a bit about the learner, and I’ll confirm within one business
                                        day. Returning students can use the same link to book ongoing sessions.
                                </p>
                                <RouterLink class="cta primary" to="/signup">Schedule on Calendly</RouterLink>
                                <a class="cta secondary" href="mailto:jacob@jacobdanderson.net">Email me a question</a>
                        </div>
                </section>
        </section>
</template>

<style scoped>
.Home {
        display: flex;
        flex-direction: column;
        gap: 4rem;
        padding: 2rem 1.5rem 4rem;
        color: #16202a;
}

.hero {
        display: grid;
        gap: 2rem;
        align-items: center;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
}

.hero-text {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
}

.hero-text h1 {
        font-size: clamp(2.25rem, 4vw, 3rem);
        line-height: 1.1;
        font-weight: 700;
}

.hero-text p {
        font-size: 1.05rem;
        line-height: 1.6;
        margin: 0;
}

.eyebrow {
        text-transform: uppercase;
        letter-spacing: 0.2em;
        font-size: 0.85rem;
        color: #3a6ea5;
        font-weight: 600;
}

.hero-actions {
        display: flex;
        flex-wrap: wrap;
        gap: 1rem;
}

.cta {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        padding: 0.85rem 1.5rem;
        border-radius: 999px;
        font-weight: 600;
        text-decoration: none;
        transition: transform 0.2s ease, box-shadow 0.2s ease;
        border: 2px solid transparent;
}

.cta.primary {
        background-color: #3a6ea5;
        color: white;
}

.cta.primary:hover {
        background-color: #2d5c8a;
        transform: translateY(-2px);
}

.cta.secondary {
        background-color: white;
        border-color: #3a6ea5;
        color: #3a6ea5;
}

.cta.secondary:hover {
        background-color: #e9f2fb;
        transform: translateY(-2px);
}

.hero-image {
        width: 100%;
        max-height: 420px;
        object-fit: cover;
        border-radius: 24px;
        box-shadow: 0 18px 40px rgba(14, 33, 58, 0.18);
}

.subjects,
.highlights,
.next-steps {
        max-width: 1100px;
        width: 100%;
        margin: 0 auto;
        text-align: center;
}

.subjects h2,
.highlights h2,
.next-steps h2 {
        font-size: clamp(1.8rem, 3vw, 2.4rem);
        margin-bottom: 0.75rem;
}

.intro {
        max-width: 720px;
        margin: 0 auto 2.5rem;
        font-size: 1.05rem;
        line-height: 1.6;
        color: #334155;
}

.subject-grid {
        display: grid;
        gap: 1.5rem;
        grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
}

.subject-card {
        padding: 1.75rem;
        background: white;
        border-radius: 20px;
        box-shadow: 0 10px 30px rgba(16, 42, 66, 0.08);
        text-align: left;
}

.subject-card h3 {
        margin-bottom: 0.75rem;
        font-size: 1.2rem;
        color: #1f3d5a;
}

.subject-card ul {
        list-style: none;
        padding: 0;
        margin: 0;
        display: grid;
        gap: 0.4rem;
        color: #334155;
}

.highlight-grid {
        display: grid;
        gap: 1.5rem;
        grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
}

.highlight-card {
        padding: 1.75rem;
        border-radius: 20px;
        background: linear-gradient(145deg, #e7f2ff, #f7fbff);
        box-shadow: 0 14px 30px rgba(18, 64, 112, 0.08);
        text-align: left;
}

.highlight-card h3 {
        margin-bottom: 0.75rem;
        font-size: 1.2rem;
        color: #1f3d5a;
}

.highlight-card p {
        margin: 0;
        color: #2d3f55;
        line-height: 1.6;
}

.next-steps {
        text-align: center;
}

.next-steps-card {
        margin: 0 auto;
        max-width: 720px;
        padding: 2.5rem;
        background: #0f1f2f;
        color: white;
        border-radius: 24px;
        display: grid;
        gap: 1.5rem;
        box-shadow: 0 24px 50px rgba(10, 25, 40, 0.25);
}

.next-steps-card p {
        margin: 0;
        font-size: 1.05rem;
        line-height: 1.6;
        color: #e6edf5;
}

.next-steps-card .cta.secondary {
        background-color: transparent;
        color: white;
        border-color: rgba(255, 255, 255, 0.6);
}

.next-steps-card .cta.secondary:hover {
        background-color: rgba(255, 255, 255, 0.12);
}

@media (max-width: 600px) {
        .Home {
                padding: 1.5rem 1rem 3rem;
        }

        .hero {
                gap: 1.5rem;
        }

        .subject-card,
        .highlight-card {
                padding: 1.5rem;
        }

        .next-steps-card {
                padding: 2rem 1.5rem;
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
