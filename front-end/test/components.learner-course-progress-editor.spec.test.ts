import { mount } from "@vue/test-utils";
import { describe, expect, it, vi } from "vitest";
import LearnerCourseProgressEditor from "@/components/LearnerCourseProgressEditor.vue";

const progress = {
	assignedCourseGroups: vi.fn(() => [
		{
			key: "current",
			label: "Current courses",
			courseIds: ["python-1"]
		}
	]),
	assignedCourseIds: vi.fn(() => ["python-1"]),
	unassignedProgressForUser: vi.fn(() => []),
	isItemComplete: vi.fn(() => false),
	isModuleComplete: vi.fn(() => false),
	isProgressCourseLoading: vi.fn(() => false),
	loadSelectedProgressCourse: vi.fn(),
	progressCourseForUser: vi.fn(() => ({
		id: "python-1",
		name: "Python Level 1",
		modules: [
			{
				id: "m1",
				title: "Variables",
				curriculum: [
					{
						id: "lesson-1",
						title: "Printing",
						content: "",
						projectLink: ""
					}
				],
				supplementalProjects: []
			}
		]
	})),
	progressForUser: vi.fn(() => ({
		courseId: "python-1",
		completedModuleIds: [],
		completedItemIds: []
	})),
	removeHistoricalProgress: vi.fn(),
	selectProgressCourse: vi.fn(),
	selectedProgressCourseId: vi.fn(() => "python-1"),
	toggleItem: vi.fn(),
	toggleModule: vi.fn()
};

describe("LearnerCourseProgressEditor", () => {
	it("keeps module completion checkbox outside the summary toggle", () => {
		const wrapper = mount(LearnerCourseProgressEditor, {
			props: {
				courseLabel: (courseId: string) => courseId,
				progress: progress as any,
				userId: "user-1"
			}
		});

		expect(
			wrapper.find(".workspace-disclosure__trigger input").exists()
		).toBe(false);
		expect(
			wrapper
				.find("input[aria-label='Mark module Variables complete']")
				.exists()
		).toBe(true);
	});

	it("groups progress course options by learner course status", () => {
		const groupedProgress = {
			...progress,
			assignedCourseGroups: vi.fn(() => [
				{
					key: "current",
					label: "Current courses",
					courseIds: ["java-1"]
				},
				{
					key: "past",
					label: "Past courses",
					courseIds: ["python-1"]
				}
			]),
			assignedCourseIds: vi.fn(() => ["java-1", "python-1"]),
			selectedProgressCourseId: vi.fn(() => "java-1")
		};

		const wrapper = mount(LearnerCourseProgressEditor, {
			props: {
				courseLabel: (courseId: string) =>
					courseId === "java-1" ? "Java Level 1" : "Python Level 1",
				progress: groupedProgress as any,
				userId: "user-1"
			}
		});

		const groups = wrapper.findAll("optgroup");
		expect(groups.map(group => group.attributes("label"))).toEqual([
			"Current courses",
			"Past courses"
		]);
		expect(wrapper.find("select").element.value).toBe("java-1");
	});

	it("shows unassigned historical completions without an edit control", () => {
		const oldId = "java-without-graphics-standards-map";
		const archivedProgress = {
			...progress,
			assignedCourseGroups: vi.fn(() => []),
			assignedCourseIds: vi.fn(() => []),
			selectedProgressCourseId: vi.fn(() => ""),
			progressCourseForUser: vi.fn(() => null),
			unassignedProgressForUser: vi.fn(() => [
				{
					courseId: "java-without-graphics",
					completedModuleIds: [oldId],
					completedItemIds: []
				}
			])
		};
		const wrapper = mount(LearnerCourseProgressEditor, {
			props: {
				courseLabel: (courseId: string) => courseId,
				progress: archivedProgress as any,
				userId: "user-1"
			}
		});

		expect(wrapper.get(".progress-archive code").text()).toBe(
			"java-without-graphics"
		);
		expect(
			wrapper.get(".progress-archive .historical-progress code").text()
		).toBe(oldId);
		expect(
			wrapper
				.find('.progress-archive button[aria-label^="Remove earlier"]')
				.exists()
		).toBe(false);
	});

	it("shows assigned retired course progress when its outline is unavailable", () => {
		const oldId = "java-without-graphics-standards-map";
		const retiredProgress = {
			...progress,
			assignedCourseGroups: vi.fn(() => [
				{
					key: "current",
					label: "Current courses",
					courseIds: ["java-without-graphics"]
				}
			]),
			assignedCourseIds: vi.fn(() => ["java-without-graphics"]),
			selectedProgressCourseId: vi.fn(() => "java-without-graphics"),
			progressCourseForUser: vi.fn(() => null),
			progressForUser: vi.fn(() => ({
				courseId: "java-without-graphics",
				completedModuleIds: [oldId],
				completedItemIds: []
			}))
		};
		const wrapper = mount(LearnerCourseProgressEditor, {
			props: {
				courseLabel: (courseId: string) => courseId,
				progress: retiredProgress as any,
				userId: "user-1"
			}
		});

		expect(wrapper.get(".historical-progress code").text()).toBe(oldId);
		expect(
			wrapper
				.find(
					'.historical-progress button[aria-label^="Remove earlier"]'
				)
				.exists()
		).toBe(false);
	});
});
