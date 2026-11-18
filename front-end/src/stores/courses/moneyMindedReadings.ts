import type { RawCourse, RawCourseModuleItem } from "./types";
import { formatAuthoredReading } from "./authoredReading";
import materials from "./moneyMindedMaterials.json";

function projectId(module: string, title: string) {
	return `money-minded-investing-${module}-curriculum-${title}`
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-|-$/g, "");
}

export function applyMoneyMindedReadings(course: RawCourse, raw: RawCourse) {
	for (const original of raw.modules) {
		const material = materials.find(unit =>
			original.title.startsWith(`${unit.code} `)
		);
		const module = course.modules.find(row => row.title === original.title);
		const reading = module?.curriculum[0];
		if (!material || !module || !reading) {
			throw new Error(`Missing Money-Minded lesson: ${original.title}`);
		}
		const assignment = (
			source: RawCourseModuleItem,
			previous: RawCourseModuleItem | undefined,
			section: "curriculum" | "supplementalProjects"
		): RawCourseModuleItem => {
			const task = material.tasks.find(row => row.title === source.title);
			if (!task) {
				throw new Error(`Missing Money-Minded inputs: ${source.title}`);
			}
			const asset = `/course-assets/money-minded/exercise-checks-v1.md#${task.anchor}`;
			const href = `/course-resource?asset=${encodeURIComponent(asset)}&label=${encodeURIComponent("Exercise self-check")}`;
			return {
				...source,
				...previous,
				id:
					previous?.id ??
					source.id ??
					(section === "curriculum"
						? projectId(original.title, source.title)
						: undefined),
				content: `${formatAuthoredReading(task.prompt)}\n\n[Project self-check](${href})`,
				contentKind: "assignment",
				learningPath: source.learningPath,
				preserveAssignment: true,
				preserveInstructions: true
			};
		};
		const projects = original.curriculum.slice(1).map(source =>
			assignment(
				source,
				module.curriculum.find(row => row.title === source.title),
				"curriculum"
			)
		);
		const projectIds = new Set(projects.map(row => row.id));
		reading.aliases = reading.aliases?.filter(id => !projectIds.has(id));
		reading.content = formatAuthoredReading(material.reading);
		reading.contentKind = "reading";
		reading.learningPath = "core";
		reading.preserveInstructions = true;
		module.curriculum = [reading, ...projects];
		module.supplementalProjects = original.supplementalProjects.map(
			source =>
				assignment(
					source,
					module.supplementalProjects.find(
						row => row.title === source.title
					),
					"supplementalProjects"
				)
		);
	}
}
