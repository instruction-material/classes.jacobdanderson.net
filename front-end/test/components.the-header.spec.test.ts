import { mount } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createSSRApp, nextTick } from "vue";
import { renderToString } from "vue/server-renderer";
import TheHeader from "@/components/TheHeader.vue";
import { useAppStore } from "@/stores/app";

const route = vi.hoisted(() => ({ path: "/" }));
vi.mock("vue-router", () => ({ useRoute: () => route }));

describe("TheHeader.vue", () => {
	beforeEach(() => {
		route.path = "/";
		setActivePinia(createPinia());
	});

	function mountHeader(pinia = createPinia(), resolved = true) {
		setActivePinia(pinia);
		useAppStore().sessionBootstrapStatus = resolved ? "ready" : "pending";
		return mount(TheHeader, {
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
	}

	it("does not pre-render guest navigation before the cookie session is known", async () => {
		const pinia = createPinia();
		const app = createSSRApp(TheHeader);
		app.use(pinia);
		app.component("RouterLink", { template: "<a><slot /></a>" });
		const html = await renderToString(app);
		expect(html).toContain("Courses");
		expect(html).toContain("IDE");
		expect(html).not.toMatch(/Log in|Book a Class|About|Join class/);
	});

	it("keeps a pending session neutral and restores guest controls when resolved", async () => {
		const pinia = createPinia();
		const wrapper = mountHeader(pinia, false);
		expect(wrapper.text()).not.toMatch(
			/Log in|Book a Class|About|Join class/
		);
		useAppStore().sessionBootstrapStatus = "ready";
		await nextTick();
		expect(wrapper.text()).toContain("Log in");
		expect(wrapper.text()).toContain("About");
		wrapper.unmount();
	});

	it("keeps the home header intact and uses the compact header on content pages", () => {
		const home = mountHeader();
		expect(home.classes()).not.toContain("site-header--compact");
		home.unmount();
		route.path = "/courses";
		const courses = mountHeader();
		expect(courses.classes()).toContain("site-header--compact");
		expect(courses.text()).toContain("Courses");
		expect(courses.text()).toContain("Log in");
		courses.unmount();
	});

	it("shows Join class but keeps Pathways out of the primary navigation for visitors", () => {
		const wrapper = mountHeader();

		expect(wrapper.text()).toContain("Join class");
		expect(wrapper.text()).toContain("IDE");
		expect(wrapper.text()).toContain("Graphing");
		expect(wrapper.text()).not.toContain("BlueJ");
		expect(wrapper.text()).not.toContain("Pathways");
	});

	it("keeps Pathways out of the admin navigation without adding public booking links", () => {
		const pinia = createPinia();
		setActivePinia(pinia);
		const app = useAppStore();
		app.setCurrentAdmin({
			_id: "admin-1",
			name: "Admin",
			email: "admin@example.com",
			editAdmins: false,
			saveEdit: "Save"
		});

		const wrapper = mountHeader(pinia);

		expect(wrapper.text()).not.toContain("Join class");
		expect(wrapper.text()).toContain("IDE");
		expect(wrapper.text()).toContain("Graphing");
		expect(wrapper.text()).not.toContain("BlueJ");
		expect(wrapper.text()).not.toContain("Pathways");
		expect(wrapper.text()).toContain("Account");
		expect(wrapper.text()).not.toContain("Book a Class");
	});

	it("shows the Teaching workspace link for tutors", () => {
		const pinia = createPinia();
		setActivePinia(pinia);
		const app = useAppStore();
		app.setCurrentTutor({
			_id: "tutor-1",
			name: "Tutor",
			email: "tutor@example.com",
			age: 30,
			state: "GA",
			usersOfTutorLength: 1,
			coursePermissions: [],
			editTutors: false,
			saveEdit: "Save"
		});

		const wrapper = mountHeader(pinia);

		expect(wrapper.text()).toContain("Teaching");
		expect(wrapper.text()).toContain("Account");
		expect(wrapper.text()).not.toContain("Profile");
	});

	it("identifies course-code learners without sending them to an email account page", () => {
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
			createdAt: "2026-07-25T12:00:00.000Z",
			lastSeenAt: "2026-07-25T12:00:00.000Z"
		});

		const wrapper = mountHeader(pinia);

		expect(wrapper.text()).toContain("Classroom: Student One");
		expect(wrapper.text()).toContain("Log out");
		expect(wrapper.text()).toContain("Classroom");
		expect(wrapper.text()).not.toContain("Log in");
	});
});
