import type { RawCourse } from "./types";
import readings from "./swiftReferenceReadings.json";

export function applySwiftReferenceReadings(
	course: RawCourse,
	progressId: (value: string) => string
) {
	for (const module of course.modules) {
		const entries: Record<string, string> | undefined =
			readings[module.title as keyof typeof readings];
		if (entries) {
			for (const item of [
				...module.curriculum,
				...module.supplementalProjects
			]) {
				if (!Object.hasOwn(entries, item.title)) continue;
				item.content = entries[item.title];
				item.preserveInstructions = true;
				if (module.supplementalProjects.includes(item)) {
					item.contentKind = "assignment";
					item.learningPath = "choice";
					item.preserveAssignment = true;
				} else {
					item.contentKind = "reading";
				}
			}
		}

		if (module.kind === "appendix") continue;
		const readiness = module.supplementalProjects.find(
			item => item.title === "Readiness Check"
		);
		if (readiness) {
			readiness.id ??= progressId(
				`intro-to-swift-app-development-${module.title}-supplemental-${readiness.title}`
			);
			readiness.aliases = [
				...new Set([...(readiness.aliases ?? []), readiness.title])
			];
			readiness.title = `${module.title}: Readiness Check`;
		}
	}
}
