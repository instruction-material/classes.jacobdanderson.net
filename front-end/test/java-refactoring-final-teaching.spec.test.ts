import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { createPinia, setActivePinia } from "pinia";
import { expect, it } from "vitest";
import identities from "./fixtures/java-refactoring-published-course-identities.json";
import { javaRefactoringFinalUnits } from "@/modules/javaRefactoringFinalUnits";
import { extractMarkdownSection } from "@/modules/courseAssetPreview";
import { useCoursesStore } from "@/stores/courses";
import { useAppStore } from "@/stores/app";
import { pythonIdeModeForCourseResource } from "@/modules/pythonIde";

it.each(["learner", "instructor"] as const)(
	"preserves all 159 published identities and complete final teaching/resources for %s",
	async role => {
		setActivePinia(createPinia());
		if (role === "instructor")
			useAppStore().setCurrentTutor({
				_id: "refactoring-final-tutor",
				name: "Tutor",
				email: "tutor@example.invalid",
				age: 30,
				state: "GA",
				usersOfTutorLength: 0,
				coursePermissions: ["design-patterns-in-java-part-2"],
				editTutors: false,
				saveEdit: "Save"
			});
		const course = (await useCoursesStore().loadCourseById(
			"design-patterns-in-java-part-2"
		))!;
		let count = 0;
		for (const [id, expected] of Object.entries(identities)) {
			const module = course.modules.find(value => value.id === id)!;
			expect(module, id).toBeDefined();
			for (const section of [
				"curriculum",
				"supplementalProjects"
			] as const) {
				expect(
					module[section].map(({ id, title, aliases }) => ({
						id,
						title,
						...(aliases ? { aliases } : {})
					}))
				).toEqual(expected[section]);
				count += module[section].length;
			}
		}
		expect(count).toBe(159);
		const all = course.modules.flatMap(module => [
			...module.curriculum,
			...module.supplementalProjects
		]);
		let sourceItems = 0,
			caseItems = 0;
		for (const unit of javaRefactoringFinalUnits) {
			for (const id of unit.sourceItems) {
				const item = all.find(value => value.id === id)!;
				expect(item, id).toBeDefined();
				expect(item.projectLink).toBe(
					"https://github.com/instruction-material/Java-Level-3/tree/" +
						unit.revision +
						"/" +
						unit.pack +
						"/starter"
				);
				expect(item.solutionLink).toBe(
					role === "instructor"
						? "https://github.com/instruction-material/Java-Level-3/tree/" +
								unit.revision +
								"/" +
								unit.pack +
								"/solution"
						: undefined
				);
				expect(
					pythonIdeModeForCourseResource(
						unit.courseID,
						item.projectLink!
					)
				).toBe("java");
				sourceItems++;
				if (item.contentKind === "reading") {
					expect(item.content).toContain("JDK 21");
					expect(item.content).toContain("ContractChecks");
					expect(item.content).toContain("sources.txt");
				} else {
					expect(item.contentKind).toBe("assignment");
					const links = [
						...item.content.matchAll(
							/\[[^\]]+\]\((\/course-resource\?[^)]+)\)/g
						)
					];
					expect(links).toHaveLength(2);
					for (const [, href] of links) {
						const asset = new URL(
							href,
							"https://example.invalid"
						).searchParams.get("asset")!;
						const [path, section] = asset.split("#");
						const markdown = readFileSync(
							resolve("public", path.slice(1)),
							"utf8"
						);
						const selected = extractMarkdownSection(
							markdown,
							section
						);
						expect(
							selected.split("\n\n").slice(1).join("\n\n").trim()
						).not.toBe("");
						expect(
							selected
								.split("\n")
								.filter(line => line.startsWith("## "))
						).toHaveLength(1);
					}
					caseItems++;
				}
			}
		}
		expect(sourceItems).toBe(61);
		expect(caseItems).toBe(53);
		const references = course.modules.find(module =>
			module.id.endsWith("-standards-map")
		)!;
		expect(references.curriculum).toHaveLength(4);
		expect(references.supplementalProjects).toHaveLength(2);
		for (const item of references.curriculum)
			expect(item.contentKind).toBe("reading");
		for (const item of references.supplementalProjects) {
			expect(item.contentKind).toBe("assignment");
			expect(item.content).toContain("refactoring-final-inputs.md");
		}
		const capstone = course.modules.find(module =>
			module.id.endsWith("-dpr10-capstone-refactoring-studio")
		)!;
		expect(capstone.curriculum[0].content).toContain(
			"A different medium Java application"
		);
		expect(capstone.curriculum[0].content).toContain(
			"script-core < sample-input.txt"
		);
		expect(capstone.curriculum[0].content).toContain(
			"Both baseline and core behavior checks pass"
		);
		const clinics = course.modules.find(module =>
			module.id.endsWith("-optional-refactoring-clinics-11-17")
		)!;
		expect(clinics.kind).toBe("appendix");
		expect(clinics.supplementalProjects).toHaveLength(49);
		expect(clinics.curriculum[0].content).toContain("Route ownership");
	}
);
