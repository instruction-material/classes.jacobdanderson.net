import type { RawCourseModuleItem } from "./types";
import ownedAssignments from "./machine-learning-owned-assignments.json";

type OwnedAssignment = Pick<RawCourseModuleItem, "content"> &
	Partial<RawCourseModuleItem>;

export function withOwnedMachineLearningAssignment(
	item: RawCourseModuleItem
): RawCourseModuleItem {
	const titles: Record<string, OwnedAssignment> = ownedAssignments.byTitle;
	const projects: Record<string, OwnedAssignment> =
		ownedAssignments.byProjectLink;
	const assignment = titles[item.title] ?? projects[item.projectLink ?? ""];
	if (!assignment) return item;
	return {
		...item,
		...assignment,
		contentKind: "assignment",
		preserveInstructions: true,
		preserveAssignment: true,
		ideImport: assignment.ideImport ?? true
	};
}
