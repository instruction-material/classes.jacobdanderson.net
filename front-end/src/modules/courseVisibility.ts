import type { CourseModule, RawCourseModule } from "@/stores/courses/types";

export function visibleCourseModules<T extends CourseModule | RawCourseModule>(
	modules: readonly T[]
): T[] {
	return modules
		.filter(module => !module.internal)
		.map(module => ({
			...module,
			curriculum: module.curriculum.filter(item => !item.internal),
			supplementalProjects: module.supplementalProjects.filter(
				item => !item.internal
			)
		}));
}
