import { Buffer } from "node:buffer";
import { createHash } from "node:crypto";
import { createPinia, setActivePinia } from "pinia";
import { describe, expect, it } from "vitest";
import { isLessonLearningItem } from "@/modules/courseLessonPresentation";
import { useCoursesStore } from "@/stores/courses";
import { loadRawCourse } from "@/stores/courses/index";
import fixture from "../../test/fixtures/machine-learning-legacy-clustering-sources.json";

describe("retained Machine Learning clustering activities", () => {
	it("binds thirteen existing activities to exact standalone source roles", async () => {
		setActivePinia(createPinia());
		const course = (await useCoursesStore().loadCourseById("machine-learning"))!;
		expect(fixture.projects).toHaveLength(13);
		expect(new Set(fixture.projects.map(project => project.itemId)).size).toBe(13);
		for (const project of fixture.projects) {
			const module = course.modules.find(row => row.id === project.moduleId)!;
			const item = [...module.curriculum, ...module.supplementalProjects].find(
				row => row.id === project.itemId
			)!;
			expect(item, project.caseId).toBeDefined();
			expect(item.content).toBe(project.assignmentText.trim());
			expect(item.ideImport).toBe(true);
			expect(item.projectLink).toBe(
				`https://github.com/instruction-material/AI-Level-2/tree/${
					fixture.revision}/${project.sources.starter}`
			);
			for (const role of ["starter", "solution"] as const) {
				const prefix = `${project.sources[role]}/`;
				const files = Object.entries(fixture.files).filter(([path]) =>
					path.startsWith(prefix)
				);
				expect(files.some(([path]) => path === `${prefix}main.py`)).toBe(true);
				expect(files.some(([path]) => path === `${prefix}requirements.txt`)).toBe(true);
				expect(files.some(([path]) => path.endsWith(".csv"))).toBe(true);
				for (const [, file] of files) {
					expect(Buffer.byteLength(file.content)).toBe(file.byteLength);
					expect(createHash("sha256").update(file.content).digest("hex")).toBe(file.sha256);
				}
			}
		}
	});

	it("keeps the complete numerical explanation in Learn and the hosted tool optional", async () => {
		const course = (await loadRawCourse("machine-learning"))!;
		const module = course.modules.find(row => row.title === "ML1 K-Means Clustering")!;
		const concepts = module.curriculum.find(row => row.title === "K-Means Clustering Core Concepts")!;
		const orientation = module.curriculum.find(row => row.title === "Optional Google Colab Orientation")!;
		expect(isLessonLearningItem(concepts)).toBe(true);
		expect(isLessonLearningItem(orientation)).toBe(true);
		expect(orientation.learningPath).toBe("choice");
		expect(concepts.content).toContain("79/99");
		expect(concepts.content).toContain("inertia 4/26");
		expect(concepts.content).toContain("empty group has no mean");
		expect(concepts.content).not.toContain("Core topics in this module:");
		expect(orientation.content).not.toContain("Build a small working version");
	});
});
