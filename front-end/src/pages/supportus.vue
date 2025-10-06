<script lang="ts" setup>
defineOptions({ name: "SupportUsPage" });
</script>

<template>
        <section class="Supportus">
                <div class="intro">
                        <h1>Tuition &amp; payment</h1>
                        <p>
                                Each class is a 50-minute 1:1 session for $40. I always leave an extra 10-minute buffer so we can wrap up a
                                project or finish debugging without rushing.
                        </p>
                        <div class="tuition-card">
                                <div class="rate">
                                        <span class="amount">$40</span>
                                        <span class="details">per class • 50 minutes</span>
                                </div>
                                <ul>
                                        <li>Flexible recurring or one-time scheduling</li>
                                        <li>Follow-up notes with key takeaways and next steps</li>
                                        <li>Homework review or project feedback between sessions</li>
                                </ul>
                        </div>
                </div>

                <section aria-labelledby="payment-title" class="payment">
                        <h2 id="payment-title">How to pay</h2>
                        <p>
                                Venmo is the easiest way to submit payment before or after class. Tap the button below to open my Venmo profile
                                in a new tab.
                        </p>
                        <a
                                class="cta"
                                href="https://www.venmo.com/u/jacoba1100254352-classes"
                                rel="noreferrer"
                                target="_blank"
                        >
                                Open Venmo profile
                        </a>
                        <div class="note">
                                <p>
                                        Prefer a different method? I can also accept Zelle or mailed checks—just reach out and we’ll set up what
                                        works best for your family.
                                </p>
                        </div>
                </section>

                <section aria-labelledby="faq-title" class="faq">
                        <h2 id="faq-title">Frequently asked questions</h2>
                        <article>
                                <h3>Can siblings or friends join the same session?</h3>
                                <p>
                                        Absolutely. Small group lessons are available upon request and can be customized for shared goals. Email me
                                        for details and pricing adjustments.
                                </p>
                        </article>
                        <article>
                                <h3>What happens if we need to reschedule?</h3>
                                <p>
                                        Life happens! Just let me know at least 12 hours in advance and we can shift the meeting to a new time or roll
                                        the credit to your next session.
                                </p>
                        </article>
                        <article>
                                <h3>Do you offer progress updates?</h3>
                                <p>
                                        Yes. I provide quick session summaries highlighting wins, challenges, and recommended practice so parents and
                                        students can stay aligned between meetings.
                                </p>
                        </article>
                </section>

                <section aria-labelledby="schedule-title" class="schedule">
                        <h2 id="schedule-title">Ready to schedule?</h2>
                        <p>Book through Calendly or email me to coordinate a recurring spot that matches your schedule.</p>
                        <RouterLink class="cta" to="/signup">Book a class</RouterLink>
                        <a class="cta ghost" href="mailto:jacob@jacobdanderson.net">Email Jacob</a>
                </section>
        </section>
</template>

<style scoped>
.Supportus {
        display: flex;
        flex-direction: column;
        gap: 3rem;
        padding: 2.5rem 1.5rem 4rem;
        color: #16202a;
}

.intro {
        max-width: 900px;
        margin: 0 auto;
        text-align: center;
        display: grid;
        gap: 1.5rem;
}

.intro h1 {
        font-size: clamp(2rem, 3.5vw, 2.75rem);
}

.intro p {
        margin: 0 auto;
        max-width: 680px;
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
        transition: background-color 0.2s ease, transform 0.2s ease;
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

.faq article {
        background: white;
        border-radius: 20px;
        padding: 1.75rem;
        box-shadow: 0 14px 30px rgba(18, 64, 112, 0.08);
        display: grid;
        gap: 0.75rem;
}

.faq h3 {
        margin: 0;
        font-size: 1.2rem;
        color: #1f3d5a;
}

.schedule {
        gap: 1rem;
}

@media (max-width: 600px) {
        .Supportus {
                padding: 2rem 1.25rem 3rem;
        }

        .tuition-card {
                padding: 1.75rem 1.5rem;
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
