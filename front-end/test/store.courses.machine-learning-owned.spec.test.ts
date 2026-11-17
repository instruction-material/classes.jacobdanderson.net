import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { createPinia, setActivePinia } from "pinia";
import { describe, expect, it } from "vitest";
import { useAppStore } from "@/stores/app";
import { useCoursesStore } from "@/stores/courses";
import { normalizeRawCourse } from "@/stores/courses/normalization";
import { machineLearningCourse } from "@/stores/courses/machine-learning";
import assignments from "@/stores/courses/machine-learning-owned-assignments.json";
import history from "./fixtures/machine-learning-course-history.json";
import sourceFixture from "../../test/fixtures/machine-learning-offline-sources.json";

const allRaw = machineLearningCourse.modules.flatMap(module => [
	...module.curriculum,
	...module.supplementalProjects
]);
const normalizedRaw = normalizeRawCourse(
	"machine-learning",
	machineLearningCourse
);
const owned = normalizedRaw.modules
	.flatMap(module => [...module.curriculum, ...module.supplementalProjects])
	.filter(item => item.preserveInstructions && item.preserveAssignment);

describe("Machine Learning owned assignments and supplied data", () => {
	it("binds all 37 IDE contexts and preserves the exact binary image fixtures", () => {
		expect(sourceFixture.projects).toHaveLength(37);
		expect(
			new Set(sourceFixture.projects.map(project => project.itemId)).size
		).toBe(37);
		expect(
			new Set(sourceFixture.projects.map(project => project.folder)).size
		).toBe(35);
		const binaryFiles = Object.values(sourceFixture.files).filter(
			file => file.encoding === "base64"
		);
		expect(binaryFiles).toHaveLength(192);
		for (const file of binaryFiles) {
			const bytes = Buffer.from(file.content, "base64");
			expect(bytes.subarray(0, 8)).toEqual(
				Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])
			);
			expect(bytes.length).toBe(file.byteLength);
			expect(createHash("sha256").update(bytes).digest("hex")).toBe(
				file.sha256
			);
		}
		for (const project of sourceFixture.projects) {
			const item = owned.find(
				candidate =>
					candidate.projectLink?.includes(
						"/" + project.folder + "/starter"
					) &&
					candidate.content.trim() === project.assignmentText.trim()
			);
			expect(item, project.caseId).toBeDefined();
			for (const role of ["starter", "solution"]) {
				const files = Object.keys(sourceFixture.files).filter(name =>
					name.startsWith(project.folder + "/" + role + "/")
				);
				expect(files.length).toBeLessThanOrEqual(40);
			}
		}
	});

	it("supplies all three promised fixtures with their exact identities", () => {
		const root = path.resolve(
			__dirname,
			"../public/course-assets/machine-learning"
		);
		const manifest = JSON.parse(
			fs.readFileSync(path.join(root, "manifest.json"), "utf8")
		);
		for (const name of [
			"garden_growth.csv",
			"support_tickets.csv",
			"synthetic_housing.csv"
		]) {
			const bytes = fs.readFileSync(path.join(root, name));
			expect(createHash("sha256").update(bytes).digest("hex")).toBe(
				manifest.files[name].sha256
			);
			expect(bytes.toString().trim().split("\n")).toHaveLength(
				manifest.files[name].rows + 1
			);
			expect(bytes.toString().split("\n")[0].split(",")).toEqual(
				manifest.files[name].columns
			);
		}
	});

	it("pairs all thirty supplements with complete tasks and their actual source inputs", () => {
		const entries = Object.entries(assignments.byProjectLink);
		expect(entries).toHaveLength(30);
		for (const [, assignment] of entries) {
			const item = allRaw.find(
				candidate => candidate.projectLink === assignment.projectLink
			)!;
			expect(item).toBeDefined();
			expect(item.content).toBe(assignment.content);
			expect(item.content.length).toBeGreaterThan(1500);
			expect(item.datasetLink).toContain(sourceFixture.revision);
			const datasetPath = new URL(item.datasetLink!).pathname
				.split("/")
				.slice(5)
				.join("/");
			const matchingInputs = Object.keys(sourceFixture.files).filter(
				name =>
					name === datasetPath || name.startsWith(datasetPath + "/")
			);
			expect(matchingInputs.some(name => name.endsWith(".csv"))).toBe(
				true
			);
			expect(item.solutionLink).toBe(assignment.solutionLink);
			expect(item.content).not.toMatch(/Run python3 -I -B test_/);
			expect(item.contentKind).toBe("assignment");
		}
	});

	it("gives preparatory cores their actual workspace rather than a fitted classifier or regressor", () => {
		const data = allRaw.find(item =>
			item.title.endsWith("Data Workflow: Core Project")
		)!;
		const contract = allRaw.find(item =>
			item.title.endsWith("Dataset Strategy: Core Project")
		)!;
		const housing = allRaw.find(item =>
			item.title.startsWith("ML6 Project 1:")
		)!;
		expect(data.projectLink).toContain("/ML0-Offline-Data-Card/starter");
		expect(data.content).toContain("inspect_fixture");
		expect(contract.projectLink).toContain(
			"/ML7-5-Offline-Evaluation-Contract/starter"
		);
		expect(contract.content).toContain("template_family");
		expect(housing.projectLink).toContain(
			"/ML6-Offline-Housing-Comparison/starter"
		);
		for (const term of [
			"train_network",
			"72 training",
			"30 epochs",
			"loss_gradient",
			"best_epoch"
		])
			expect(housing.content).toContain(term);
		expect(housing.datasetLink).toBe(
			"/course-assets/machine-learning/synthetic_housing.csv"
		);
		const legacy = allRaw.find(
			item =>
				item.title ===
				"Regression with Neural Networks: Extension Challenge"
		)!;
		expect(legacy.projectLink).toContain("/ML6-Predicting-House-Prices");
		expect(legacy.ideImport).toBe(false);
	});

	for (const role of ["learner", "instructor"] as const) {
		it(
			"preserves full visible teaching, role boundaries and saved identities for " +
				role,
			async () => {
				setActivePinia(createPinia());
				if (role === "instructor")
					useAppStore().setCurrentTutor({
						_id: "ml-tutor",
						name: "Instructor",
						email: "ml@example.invalid",
						age: 30,
						state: "GA",
						usersOfTutorLength: 0,
						coursePermissions: ["machine-learning"],
						editTutors: false,
						saveEdit: "Save"
					});
				const course =
					(await useCoursesStore().loadCourseById(
						"machine-learning"
					))!;
				const all = course.modules.flatMap(module => [
					...module.curriculum,
					...module.supplementalProjects
				]);
				expect(owned).toHaveLength(52);
				for (const raw of owned) {
					const item = all.find(
						candidate => candidate.title === raw.title
					)!;
					expect(item, raw.title).toBeDefined();
					expect(item.content, raw.title).toBe(raw.content.trim());
					expect(item.projectLink).toBe(raw.projectLink);
					expect(item.datasetLink).toBe(raw.datasetLink);
					expect(item.ideImport).toBe(raw.ideImport);
					expect(item.solutionLink).toBe(
						role === "instructor" ? raw.solutionLink : undefined
					);
				}
				for (const entry of history.filter(
					record => record.kind === "item"
				)) {
					const owners = all.filter(item =>
						[item.id, ...(item.aliases ?? [])].includes(entry.oldId)
					);
					expect(
						owners.map(item => item.id),
						entry.oldId
					).toEqual(entry.currentId ? [entry.currentId] : []);
				}
			}
		);
	}
});
