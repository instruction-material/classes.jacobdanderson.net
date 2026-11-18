import type { RawCourse, RawCourseModuleItem } from "./types";
import { pictureBookGuidance } from "./pictureBookGuidance";
import { pictureBookTaskInputs } from "./pictureBookTaskInputs";

function itemId(module: string, title: string) {
	return `early-elementary-b-picture-book-${module}-curriculum-${title}`
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-|-$/g, "");
}
function sampleResponse(anchor: string) {
	const asset = `/course-assets/early-elementary-b-picture-book/practice-checks-v1.md#${
		anchor
	}`;
	return `[Project self-check](/course-resource?asset=${encodeURIComponent(
		asset
	)}&label=${encodeURIComponent("Sample response")})`;
}
export function applyPictureBookGuidance(course: RawCourse, raw: RawCourse) {
	for (const original of raw.modules) {
		const material = pictureBookGuidance.find(
			unit => unit.module === original.title
		);
		const displayed = course.modules.find(
			module =>
				module.title.toLowerCase() === original.title.toLowerCase()
		);
		const reading = displayed?.curriculum[0];
		if (!material || !displayed || !reading)
			throw new Error(`Missing picture-book guidance: ${original.title}`);
		const assignments = original.curriculum
			.slice(1)
			.map((item): RawCourseModuleItem => {
				const previous = [
					...displayed.curriculum,
					...displayed.supplementalProjects
				].find(
					row =>
						row.title === item.title ||
						row.aliases?.includes(item.title)
				);
				const supplied = pictureBookTaskInputs[item.title];
				return {
					...item,
					...previous,
					id:
						previous?.id ??
						item.id ??
						itemId(original.title, item.title),
					title:
						item.title === "Gabby Tries Narrative Map"
							? "Nico Poster Narrative Map"
							: (previous?.title ?? item.title),
					aliases:
						item.title === "Gabby Tries Narrative Map"
							? [
									...new Set([
										...(previous?.aliases ??
											item.aliases ??
											[]),
										item.title
									])
								]
							: (previous?.aliases ?? item.aliases),
					content:
						item.title === "Gabby Tries Narrative Map"
							? supplied!
							: (
									item.content.replace(
										/^\*\*Project goal:\*\*\s*/i,
										""
									) + (supplied ? `\n\n${supplied}` : "")
								).replaceAll(
									"Gabby Tries",
									"the supplied Nico poster story"
								),
					learningPath: "core",
					contentKind: "assignment",
					preserveInstructions: true,
					preserveAssignment: true
				};
			});
		const ids = new Set(assignments.map(item => item.id));
		reading.aliases = reading.aliases?.filter(alias => !ids.has(alias));
		reading.content = `**Method**\n\n${
			material.method
		}\n\n**Worked example**\n\n${material.worked}`;
		reading.contentKind = "reading";
		reading.learningPath = "core";
		reading.preserveInstructions = true;
		displayed.curriculum = [reading, ...assignments];
		displayed.supplementalProjects = original.supplementalProjects.map(
			item => {
				const task = item.title.startsWith("Practice Map:")
					? material.practice
					: item.title.startsWith("Extension Review:")
						? material.challenge
						: undefined;
				if (!task) {
					throw new Error(
						`Unmapped picture-book practice: ${item.title}`
					);
				}
				const previous = displayed.supplementalProjects.find(
					row => row.title === item.title
				);
				return {
					...item,
					...previous,
					content: `**Practice passage and task**\n\n${
						task.prompt
					}\n\n${sampleResponse(task.anchor)}`,
					contentKind: "assignment",
					preserveInstructions: true,
					preserveAssignment: true
				};
			}
		);
	}
}
