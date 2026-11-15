import type { FinalRefactoringEntry } from "./javaRefactoringFinalLessons";
import type { RawCourseModule, RawCourseModuleItem } from "./types";
import { courseAssetViewerUrl } from "@/modules/courseAssetPreview";
import { javaRefactoringFinalUnits } from "@/modules/javaRefactoringFinalUnits";
import { javaRefactoringUnitURL } from "@/modules/javaRefactoringUnits";
import { javaRefactoringFinalLessons } from "./javaRefactoringFinalLessons";

export function completeJavaRefactoringFinalLesson(
	module: RawCourseModule
): RawCourseModule {
	const lesson = javaRefactoringFinalLessons.find(
		value => value.title === module.title
	);
	if (!lesson) return module;
	const unit = javaRefactoringFinalUnits.find(
		value => value.id === lesson.unitID
	);
	if (!unit) throw new Error("Missing refactoring project definition");
	const complete = (entry: FinalRefactoringEntry): RawCourseModuleItem => {
		const { caseSection, ...item } = entry;
		let content = item.content;
		if (
			lesson.unitID === "capstone-refactoring" &&
			item.id === unit.readingID
		) {
			const flow = module.curriculum[0]?.content.split("\n\n")[0];
			if (flow?.startsWith("**Course flow:**"))
				content = `${flow}\n\n${content}`;
		}
		if (caseSection) {
			content += `\n\n[Case inputs](${courseAssetViewerUrl(
				`/course-assets/design-patterns-in-java/refactoring-final-inputs.md#${
					caseSection
				}`
			)}) · [Project self-check](${courseAssetViewerUrl(
				`/course-assets/design-patterns-in-java/refactoring-final-answers.md#${
					caseSection
				}`
			)})`;
		}
		return {
			...item,
			content,
			ideImport: true,
			projectLink: javaRefactoringUnitURL(unit.id, "starter"),
			solutionLink: javaRefactoringUnitURL(unit.id, "solution")
		};
	};
	return {
		...module,
		...(lesson.unitID === "capstone-refactoring"
			? { id: unit.moduleID }
			: {}),
		curriculum: lesson.curriculum.map(complete),
		supplementalProjects: lesson.supplementalProjects.map(complete)
	};
}
