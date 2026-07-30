import { flushPromises, mount } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it } from "vitest";
import CoursesPage from "@/pages/courses.vue";
import { useAppStore } from "@/stores/app";

describe("courses page access gate", () => {
	beforeEach(() => {
		setActivePinia(createPinia());
	});

	it("opens the login modal when a logged-out visitor clicks Log in", async () => {
		const pinia = createPinia();
		setActivePinia(pinia);
		const app = useAppStore();

		const wrapper = mount(CoursesPage, {
			global: {
				plugins: [pinia],
				stubs: {
					RouterLink: {
						props: ["to"],
						template: "<a><slot /></a>"
					}
				}
			}
		});

		await flushPromises();
		expect(wrapper.text()).toContain("Open Your Courses");
		expect(wrapper.text()).toContain("Use a course code");

		await wrapper.get("button").trigger("click");

		expect(app.loginBlock).toBe(true);
	});

	it("shows the access request message for a learner with no courses", async () => {
		const pinia = createPinia();
		setActivePinia(pinia);
		const app = useAppStore();

		app.setCurrentUser({
			_id: "user-1",
			name: "Student",
			email: "student@example.com",
			age: 12,
			state: "GA",
			courseAccess: [],
			editUsers: false,
			saveEdit: "Save"
		});

		const wrapper = mount(CoursesPage, {
			global: {
				plugins: [pinia],
				stubs: {
					RouterLink: {
						props: ["to"],
						template: "<a><slot /></a>"
					}
				}
			}
		});

		await flushPromises();

		expect(wrapper.text()).toContain("No Courses Yet");
		expect(wrapper.text()).toContain("contact@example.com");
	});

	it("keeps booking calls out of the assigned-course view", async () => {
		const pinia = createPinia();
		setActivePinia(pinia);
		const app = useAppStore();

		app.setCurrentUser({
			_id: "user-1",
			name: "Student",
			email: "student@example.com",
			age: 12,
			state: "GA",
			courseAccess: ["javascript-level-1"],
			editUsers: false,
			saveEdit: "Save"
		});

		const wrapper = mount(CoursesPage, {
			global: {
				plugins: [pinia],
				stubs: {
					CourseExplorer: {
						template: "<div>Course explorer</div>"
					},
					RouterLink: {
						props: ["to"],
						template: "<a><slot /></a>"
					}
				}
			}
		});

		await flushPromises();

		expect(wrapper.text()).toContain("Your Courses");
		expect(wrapper.text()).not.toContain("Book a Class");
	});

	it("opens only the assigned course for a course-code learner", async () => {
		const pinia = createPinia();
		setActivePinia(pinia);
		const app = useAppStore();
		app.setCurrentCourseLearner({
			_id: "course-learner-1",
			username: "Student One",
			courseID: "python-level-1",
			courseAccess: ["python-level-1"],
			courseStatus: { "python-level-1": "current" },
			role: "course-code",
			codeLabel: "Period 2",
			createdAt: "2026-07-25T12:00:00.000Z",
			lastSeenAt: "2026-07-25T12:00:00.000Z"
		});

		const wrapper = mount(CoursesPage, {
			global: {
				plugins: [pinia],
				stubs: {
					CourseExplorer: {
						template: "<div>Course explorer</div>"
					},
					RouterLink: {
						props: ["to"],
						template: "<a><slot /></a>"
					}
				}
			}
		});

		await flushPromises();

		expect(wrapper.text()).toContain("Your Course");
		expect(wrapper.text()).toContain("Signed in as Student One");
		expect(wrapper.text()).toContain("Course explorer");
		expect(wrapper.text()).not.toContain("Go to Account");
		expect(wrapper.text()).not.toContain("Use a course code");
	});
});
