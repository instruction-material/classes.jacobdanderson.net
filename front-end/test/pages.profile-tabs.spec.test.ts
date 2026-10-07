import { mount } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it, vi } from "vitest";
import ProfilePage from "@/pages/profile.vue";
import { useAppStore } from "@/stores/app";

vi.mock("@/components/AdminProfile.vue", () => ({
	default: { template: "<section />" }
}));
vi.mock("@/components/CourseExplorer.vue", () => ({
	default: { template: "<section />" }
}));
vi.mock("@/components/TutorProfile.vue", () => ({
	default: { template: "<section />" }
}));
vi.mock("@/components/UserProfile.vue", () => ({
	default: { template: "<section />" }
}));

describe("Profile page account routing", () => {
	beforeEach(() => {
		setActivePinia(createPinia());
	});

	it("opens actual account creation without sending visitors to booking", async () => {
		const app = useAppStore();
		const wrapper = mount(ProfilePage, { global: { stubs: { RouterLink: true } } });
		const button = wrapper.findAll("button").find(button => button.text() === "Create an account")!;
		await button.trigger("click");
		expect(app.signupBlock).toBe(true);
		expect(wrapper.find('[to="/signup"]').exists()).toBe(false);
		wrapper.unmount();
	});
	it("renders account content without embedding course-library tabs", async () => {
		const app = useAppStore();
		app.setCurrentUser({
			_id: "user-1",
			name: "Student Test",
			email: "student@example.com",
			age: 12,
			state: "GA",
			courseAccess: ["python-1"],
			editUsers: false,
			saveEdit: ""
		});

		const wrapper = mount(ProfilePage);

		expect(wrapper.find('[role="tablist"]').exists()).toBe(false);
		expect(wrapper.text()).not.toContain("Course library");
		wrapper.unmount();
	});

	it("explains the email-free workspace to a course-code learner", () => {
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

		const wrapper = mount(ProfilePage, {
			global: {
				stubs: {
					RouterLink: {
						props: ["to"],
						template: "<a><slot /></a>"
					}
				}
			}
		});

		expect(wrapper.text()).toContain("Account Settings");
		expect(wrapper.text()).toContain("Email-free classroom access");
		expect(wrapper.text()).toContain("Open course");
		expect(wrapper.text()).toContain("Open IDE");
		expect(wrapper.text()).not.toContain("Create an account");
		wrapper.unmount();
	});
});
