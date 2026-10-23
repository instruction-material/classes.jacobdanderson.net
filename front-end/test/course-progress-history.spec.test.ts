import { describe, expect, it } from "vitest";
import {
	nonCatalogCourseProgress,
	unmatchedCourseProgress
} from "@/modules/courseProgressHistory";

const course = {
	id: "pre-algebra-b",
	name: "Pre-Algebra B",
	modules: [
		{
			id: "pre-algebra-b-reference-archive",
			aliases: ["pre-algebra-b-source-activity-archive"],
			title: "Reference Archive",
			curriculum: [
				{
					id: "pre-algebra-b-reference-map",
					aliases: ["pre-algebra-b-old-reference-map"],
					title: "Reference Map",
					content: ""
				}
			],
			supplementalProjects: []
		}
	]
};

describe("unmatched course progress", () => {
	it("keeps retired completions distinct from mapped archive progress", () => {
		const progress = {
			courseId: "pre-algebra-b",
			completedModuleIds: [
				"pre-algebra-b-source-activity-archive",
				"pre-algebra-b-retired-module"
			],
			completedItemIds: [
				"pre-algebra-b-old-reference-map",
				"pre-algebra-b-source-activity-archive-supplemental-checkpoint-source-activity-archive",
				"pre-algebra-b-source-activity-archive-supplemental-transfer-practice-source-activity-archive"
			]
		};

		expect(unmatchedCourseProgress(course, progress)).toEqual([
			{ id: "pre-algebra-b-retired-module", kind: "module" },
			{
				id: "pre-algebra-b-source-activity-archive-supplemental-checkpoint-source-activity-archive",
				kind: "item"
			},
			{
				id: "pre-algebra-b-source-activity-archive-supplemental-transfer-practice-source-activity-archive",
				kind: "item"
			}
		]);
		const wrongCourse = { ...progress, courseId: "pre-algebra-a" };
		expect(unmatchedCourseProgress(course, wrongCourse)).toEqual([]);
	});

	it("keeps a removed course's exact completions without restoring access", () => {
		const removed = {
			courseId: "java-without-graphics",
			completedModuleIds: ["java-without-graphics-old-module"],
			completedItemIds: ["java-without-graphics-old-item"]
		};
		const current = {
			courseId: "python-level-1",
			completedModuleIds: ["python-level-1-module"],
			completedItemIds: []
		};

		expect(
			nonCatalogCourseProgress(
				[
					removed,
					current,
					{ ...removed, completedModuleIds: [], completedItemIds: [] }
				],
				new Set(["python-level-1"])
			)
		).toEqual([removed]);
		expect(unmatchedCourseProgress(null, removed)).toEqual([
			{ id: "java-without-graphics-old-module", kind: "module" },
			{ id: "java-without-graphics-old-item", kind: "item" }
		]);
	});
});
