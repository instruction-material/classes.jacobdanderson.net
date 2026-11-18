import { flushPromises, mount, type VueWrapper } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { api } from "@/api";
import CourseExplorer from "@/components/CourseExplorer.vue";
import { useAppStore } from "@/stores/app";
import { useCoursesStore } from "@/stores/courses";

vi.mock("@/api", () => ({
	api: { get: vi.fn(), put: vi.fn().mockResolvedValue({}) }
}));

let wrapper: VueWrapper | undefined;
const module = {
	id: "module-1",
	title: "Events",
	estimatedTime: "2 sessions · 45–60 minutes each",
	keyBlocks: ["when key pressed", "change x"],
	curriculum: [
		{
			id: "concept",
			title: "Event Concepts",
			content: "Understand keyboard callbacks."
		},
		{
			id: "project",
			title: "Movement Project",
			content:
				"**Objective:** Learn coordinates.\n\n**Instructions:** Move a sprite with arrow keys.\n\n**Note:** Coordinates start at the center.\n\n**Optional:** Add a second sprite."
		}
	],
	supplementalProjects: [
		{
			id: "extra",
			title: "Maze Project",
			content:
				"**Normal:** Build a maze.\n\n**Hard:** Add moving obstacles."
		}
	]
};

beforeEach(() => {
	vi.clearAllMocks();
	window.history.replaceState({}, "", "/courses");
	const values = new Map<string, string>();
	Object.defineProperty(window, "localStorage", {
		configurable: true,
		value: {
			getItem: (key: string) => values.get(key) ?? null,
			setItem: (key: string, value: string) => values.set(key, value),
			removeItem: (key: string) => values.delete(key)
		}
	});
});
afterEach(() => {
	wrapper?.unmount();
	vi.restoreAllMocks();
	window.history.replaceState({}, "", "/courses");
});

async function openLesson(hash = "", staff = false, withConceptReading = true) {
	window.history.replaceState({}, "", "/courses" + hash);
	const pinia = createPinia();
	setActivePinia(pinia);
	const courses = useCoursesStore();
	const course = courses.courses[0];
	vi.spyOn(courses, "loadCourseById").mockResolvedValue({
		id: course.id,
		name: course.name,
		modules: [
			{
				...module,
				curriculum: withConceptReading
					? module.curriculum
					: module.curriculum.filter(item => item.id !== "concept")
			},
			{
				id: "module-2",
				title: "Next Lesson",
				keyBlocks: ["game design"],
				curriculum: [
					{
						id: "next",
						title: "Next Project",
						content: "Create a new game."
					}
				],
				supplementalProjects: []
			}
		]
	});
	useAppStore().setCurrentUser({
		_id: "synthetic-student",
		name: "Example",
		email: "example@example.invalid",
		age: 12,
		state: "GA",
		courseAccess: [course.id],
		courseProgress: [],
		editUsers: false,
		saveEdit: "Save"
	});
	if (staff) {
		const app = useAppStore();
		vi.mocked(api.get).mockResolvedValue({ data: [app.currentUser] });
		app.setCurrentUser(null);
		app.setCurrentTutor({
			_id: "synthetic-tutor",
			name: "Tutor",
			email: "tutor@example.invalid",
			age: 30,
			state: "GA",
			coursePermissions: [course.id],
			usersOfTutorLength: 1,
			editTutors: false,
			saveEdit: "Save"
		});
	}
	wrapper = mount(CourseExplorer, { global: { plugins: [pinia] } });
	await flushPromises();
	await vi.waitFor(() =>
		expect(wrapper!.text()).toContain("Move a sprite with arrow keys.")
	);
	return { wrapper, course };
}

describe("course lesson views", () => {
	it("defaults to project cards with clear assignment and aside styling", async () => {
		const { wrapper } = await openLesson();
		expect(
			wrapper
				.get(".lesson-view-toggle button:first-child")
				.attributes("aria-pressed")
		).toBe("true");
		expect(wrapper.findAll(".lesson-card")).toHaveLength(1);
		expect(wrapper.get(".assignment-section").text()).toContain(
			"Move a sprite with arrow keys."
		);
		expect(wrapper.get(".assignment-aside.is-note").text()).toContain(
			"Coordinates start at the center."
		);
		expect(wrapper.get(".assignment-aside.is-optional").text()).toContain(
			"Add a second sprite."
		);
		expect(wrapper.text()).not.toContain("Learn coordinates.");
		expect(wrapper.text()).not.toContain("Understand keyboard callbacks.");
		expect(wrapper.text()).not.toContain("Maze Project");
		expect(wrapper.text()).not.toContain("Lesson guide");
		expect(wrapper.text()).not.toContain("45–60");
	});

	it("keeps supplemental work separate and concepts and key blocks in Learn", async () => {
		const { wrapper } = await openLesson();
		await wrapper
			.get(".lesson-view-toggle button:nth-child(2)")
			.trigger("click");
		await vi.waitFor(() =>
			expect(wrapper.text()).toContain("Build a maze.")
		);
		expect(wrapper.findAll(".lesson-card")).toHaveLength(1);
		expect(wrapper.text()).toContain("Maze Project");
		expect(wrapper.text()).not.toContain("Movement Project");
		expect(wrapper.get(".assignment-section").text()).toContain(
			"Build a maze."
		);
		expect(wrapper.get(".assignment-aside.is-optional").text()).toContain(
			"Add moving obstacles."
		);
		await wrapper
			.get(".lesson-view-toggle button:last-child")
			.trigger("click");
		await flushPromises();
		expect(wrapper.text()).toContain("Understand keyboard callbacks.");
		expect(wrapper.text()).toContain("Learn coordinates.");
		expect(wrapper.text()).toContain("when key pressed");
		expect(wrapper.text()).not.toContain("Move a sprite with arrow keys.");
	});

	it("keeps embedded learning available without standalone reading cards", async () => {
		const { wrapper } = await openLesson("", false, false);
		const learn = wrapper
			.findAll(".lesson-view-toggle button")
			.find(button => button.text() === "Learn");
		expect(learn).toBeDefined();
		await learn!.trigger("click");
		await flushPromises();
		expect(wrapper.findAll(".lesson-card")).toHaveLength(0);
		expect(wrapper.get(".learning-card").text()).toContain(
			"Learn coordinates."
		);
	});

	it.each([
		["extra", "supplemental", "Maze Project"],
		["concept", "learn", "Event Concepts"]
	])("opens the view for a deep link to %s", async (itemId, view, title) => {
		const { wrapper } = await openLesson();
		window.history.replaceState({}, "", `/courses#module-1-${itemId}`);
		window.dispatchEvent(new Event("hashchange"));
		await flushPromises();
		expect(
			wrapper.get("#lesson-view-content").attributes("aria-label")
		).toBe(view === "learn" ? "Learn" : "Supplemental Projects");
		expect(wrapper.text()).toContain(title);
	});

	it("searches all views and resets to Projects when changing lessons", async () => {
		const { wrapper } = await openLesson();
		await wrapper.get("#course-search").setValue("Maze Project");
		await flushPromises();
		expect(wrapper.text()).toContain("Maze Project");
		expect(
			wrapper
				.get(".lesson-view-toggle button:nth-child(2)")
				.attributes("aria-pressed")
		).toBe("true");
		await wrapper.get("#course-search").setValue("Event Concepts");
		await flushPromises();
		expect(wrapper.text()).toContain("Event Concepts");
		expect(
			wrapper
				.get(".lesson-view-toggle button:last-child")
				.attributes("aria-pressed")
		).toBe("true");
		await wrapper.get("#course-search").setValue("");
		await wrapper
			.get('[aria-label="Show module 2: Next Lesson"]')
			.trigger("click");
		expect(
			wrapper
				.findAll(".lesson-view-toggle button")
				.map(button => button.text())
		).toEqual(["Projects", "Supplemental Projects"]);
		expect(
			wrapper
				.get(".lesson-view-toggle button:first-child")
				.attributes("aria-pressed")
		).toBe("true");
		await wrapper
			.get(".lesson-view-toggle button:nth-child(2)")
			.trigger("click");
		expect(wrapper.text()).toContain(
			"No supplemental projects for this lesson."
		);
	});

	it("retains completion IDs for learning and supplemental items", async () => {
		const { wrapper, course } = await openLesson("", true);
		await wrapper
			.get(".lesson-view-toggle button:last-child")
			.trigger("click");
		await wrapper.get(".progress-toggle.is-item input").setValue(true);
		await wrapper
			.get(".lesson-view-toggle button:nth-child(2)")
			.trigger("click");
		await wrapper.get(".progress-toggle.is-item input").setValue(true);
		await wrapper
			.get(".lesson-view-toggle button:last-child")
			.trigger("click");
		expect(
			wrapper.get<HTMLInputElement>(".progress-toggle.is-item input")
				.element.checked
		).toBe(true);
		await vi.waitFor(() =>
			expect(api.put).toHaveBeenCalledWith(
				"/users/synthetic-student/course-progress",
				{
					courseId: course.id,
					completedModuleIds: [],
					completedItemIds: ["concept", "extra"]
				}
			)
		);
	});
});
