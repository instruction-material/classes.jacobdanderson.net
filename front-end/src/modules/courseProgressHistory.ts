import type { CourseProgress } from "@/stores/app";
import type { CourseDefinition } from "@/stores/courses";

export type HistoricalProgressKind = "module" | "item";

export interface HistoricalProgressEntry {
	id: string;
	kind: HistoricalProgressKind;
}

export function unmatchedCourseProgress(
	course: CourseDefinition | null,
	progress: CourseProgress | null
): HistoricalProgressEntry[] {
	if (!progress || (course && course.id !== progress.courseId)) return [];
	const coursePrefix = course ? `${course.id}-` : null;

	const knownModules = new Set(
		(course?.modules ?? []).flatMap(module => [
			module.id,
			...(module.aliases ?? []).filter(
				alias => coursePrefix && alias.startsWith(coursePrefix)
			)
		])
	);
	const knownItems = new Set(
		(course?.modules ?? []).flatMap(module =>
			[...module.curriculum, ...module.supplementalProjects].flatMap(
				item => [
					item.id,
					...(item.aliases ?? []).filter(
						alias => coursePrefix && alias.startsWith(coursePrefix)
					)
				]
			)
		)
	);

	return [
		...[...new Set(progress.completedModuleIds ?? [])]
			.filter(id => !knownModules.has(id))
			.map(id => ({ id, kind: "module" as const })),
		...[...new Set(progress.completedItemIds ?? [])]
			.filter(id => !knownItems.has(id))
			.map(id => ({ id, kind: "item" as const }))
	];
}

export function nonCatalogCourseProgress(
	progress: CourseProgress[] | undefined,
	catalogIds: ReadonlySet<string>
): CourseProgress[] {
	return (progress ?? []).filter(
		entry =>
			!catalogIds.has(entry.courseId) &&
			((entry.completedModuleIds?.length ?? 0) > 0 ||
				(entry.completedItemIds?.length ?? 0) > 0)
	);
}
