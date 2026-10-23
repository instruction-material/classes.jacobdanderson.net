import { describe, expect, it, vi } from "vitest";
import { ref } from "vue";
import { useLearnerCourseProgress } from "@/composables/useLearnerCourseProgress";

describe("useLearnerCourseProgress", () => {
	it("does not treat an unscoped title shared by lessons as progress", () => {
		const users = ref([
			{
				_id: "learner-1",
				name: "Learner",
				email: "learner@example.com",
				age: 12,
				state: "GA",
				courseAccess: ["swift"],
				courseProgress: [
					{
						courseId: "swift",
						completedModuleIds: [],
						completedItemIds: ["diagnostic-checkpoint"]
					}
				],
				editUsers: false,
				saveEdit: "Save"
			}
		]);
		const progress = useLearnerCourseProgress(users, vi.fn(), vi.fn());
		expect(
			progress.isItemComplete("learner-1", "swift", {
				id: "swift-new-checkpoint",
				aliases: ["diagnostic-checkpoint"],
				title: "Readiness check",
				content: ""
			})
		).toBe(false);
	});

	it("recognizes and clears saved module and item aliases", () => {
		const users = ref([
			{
				_id: "learner-1",
				name: "Learner",
				email: "learner@example.com",
				age: 12,
				state: "GA",
				courseAccess: ["swift"],
				courseProgress: [
					{
						courseId: "swift",
						completedModuleIds: ["swift-old-module"],
						completedItemIds: ["swift-old-item"]
					}
				],
				editUsers: false,
				saveEdit: "Save"
			}
		]);
		const progress = useLearnerCourseProgress(users, vi.fn(), vi.fn());
		const item = {
			id: "swift-new-item",
			aliases: ["swift-old-item"],
			title: "Lesson",
			content: ""
		};
		const module = {
			id: "swift-new-module",
			aliases: ["swift-old-module"],
			title: "Module",
			curriculum: [item],
			supplementalProjects: []
		};

		expect(progress.isModuleComplete("learner-1", "swift", module)).toBe(
			true
		);
		expect(progress.isItemComplete("learner-1", "swift", item)).toBe(true);
		progress.toggleModule("learner-1", "swift", module, false);
		progress.toggleItem("learner-1", "swift", item, false);
		expect(progress.isModuleComplete("learner-1", "swift", module)).toBe(
			false
		);
		expect(progress.isItemComplete("learner-1", "swift", item)).toBe(false);
		expect(progress.progressSummary("learner-1", "swift")).toEqual({
			completedModuleCount: 0,
			completedItemCount: 0
		});
	});

	it("orders progress course choices as current first, then past, then available", () => {
		const users = ref([
			{
				_id: "learner-1",
				name: "Learner",
				email: "learner@example.com",
				age: 12,
				state: "GA",
				courseAccess: [
					"python-level-1",
					"ap-computer-science-a",
					"python-level-3"
				],
				courseStatus: {
					"python-level-1": "past" as const,
					"ap-computer-science-a": "current" as const,
					"python-level-3": "available" as const
				},
				courseProgress: [],
				editUsers: false,
				saveEdit: "Save"
			}
		]);
		const progress = useLearnerCourseProgress(users, vi.fn(), vi.fn());

		expect(progress.assignedCourseGroups("learner-1")).toEqual([
			{
				key: "current",
				label: "Current courses",
				courseIds: ["ap-computer-science-a"]
			},
			{
				key: "past",
				label: "Past courses",
				courseIds: ["python-level-1"]
			},
			{
				key: "other",
				label: "Other available courses",
				courseIds: ["python-level-3"]
			}
		]);
		expect(progress.assignedCourseIds("learner-1")).toEqual([
			"ap-computer-science-a",
			"python-level-1",
			"python-level-3"
		]);
		expect(progress.selectedProgressCourseId("learner-1")).toBe(
			"ap-computer-science-a"
		);
	});
});
