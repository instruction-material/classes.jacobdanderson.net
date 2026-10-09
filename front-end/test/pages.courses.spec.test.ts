import { flushPromises, mount } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import * as catalogVisibility from "@/modules/catalogVisibility";
import CoursesPage from "@/pages/courses.vue";
import { useAppStore } from "@/stores/app";

describe("courses page access gate", () => {
	afterEach(() => vi.restoreAllMocks());
	beforeEach(() => {
		document.body.innerHTML = "";
		setActivePinia(createPinia());
	});

	it("opens the canonical catalog without a login gate and offers a red sign-in bar", async () => {
		vi.spyOn(catalogVisibility, "hasOpenCourseCatalog").mockReturnValue(
			true
		);
		const wrapper = mount(CoursesPage, {
			global: {
				stubs: {
					RouterLink: true,
					CourseExplorer: {
						props: { publicCatalog: Boolean, browseAll: Boolean },
						template:
							'<div class="catalog" :data-public="publicCatalog" :data-all="browseAll" />'
					}
				}
			}
		});
		await flushPromises();
		expect(wrapper.get(".catalog").attributes("data-public")).toBe("true");
		expect(wrapper.get(".catalog").attributes("data-all")).toBe("true");
		expect(wrapper.find(".courses-code-entry").exists()).toBe(false);
		await wrapper.get(".catalog-signin button").trigger("click");
		expect(useAppStore().loginBlock).toBe(true);
		wrapper.unmount();
	});

	it("keeps all courses visible to a signed-in canonical learner without assigned courses", async () => {
		vi.spyOn(catalogVisibility, "hasOpenCourseCatalog").mockReturnValue(
			true
		);
		useAppStore().setCurrentUser({
			_id: "synthetic-user",
			name: "Learner",
			email: "learner@example.invalid",
			age: 14,
			state: "GA",
			courseAccess: [],
			editUsers: false,
			saveEdit: "Save"
		});
		const wrapper = mount(CoursesPage, {
			global: {
				stubs: {
					RouterLink: true,
					CourseExplorer: {
						props: { publicCatalog: Boolean, browseAll: Boolean },
						template:
							'<div class="catalog" :data-public="publicCatalog" :data-all="browseAll" />'
					}
				}
			}
		});
		await flushPromises();
		expect(wrapper.get(".catalog").attributes("data-public")).toBe("false");
		expect(wrapper.get(".catalog").attributes("data-all")).toBe("true");
		expect(wrapper.find(".catalog-signin").exists()).toBe(false);
		expect(wrapper.text()).not.toContain("Get course access");
		wrapper.unmount();
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
		expect(wrapper.find(".course-code-access").isVisible()).toBe(false);

		await wrapper.get("button").trigger("click");

		expect(app.loginBlock).toBe(true);
	});

	it("switches between account actions and the classroom form without stacking them", async () => {
		const wrapper = mount(CoursesPage, {
			attachTo: document.body,
			global: { stubs: { RouterLink: true } }
		});
		await flushPromises();
		expect(wrapper.get(".courses-account-entry").isVisible()).toBe(true);
		expect(wrapper.get(".course-code-access").isVisible()).toBe(false);
		await wrapper.get('input[value="course-code"]').setValue(true);
		expect(wrapper.get(".courses-account-entry").isVisible()).toBe(false);
		expect(wrapper.get(".course-code-access").isVisible()).toBe(true);
		await wrapper.get('input[value="account"]').setValue(true);
		expect(wrapper.get(".courses-account-entry").isVisible()).toBe(true);
		expect(wrapper.get(".course-code-access").isVisible()).toBe(false);
		wrapper.unmount();
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
		expect(wrapper.get("h1").classes()).toContain("sr-only");
		expect(wrapper.text()).toContain("Course explorer");
		expect(wrapper.text()).not.toContain("Go to Account");
		expect(wrapper.text()).not.toContain("Use a course code");
	});
});
