import type { RawCourse, RawCourseModuleItem } from "./types";
import { joyOfReadingGuidance } from "./joyOfReadingGuidance";

const courseTextDefaults: Record<
	string,
	{
		title: string;
		source: "practice" | "challenge";
	}
> = {
	"Character Investigator Report": {
		title: "Character Investigator Report",
		source: "practice"
	},
	"Sweet Sixteen Character Evidence": {
		title: "Character Inference Report",
		source: "challenge"
	},
	"Faithful Friend Plot Diagram": {
		title: "Garden Sign Plot Diagram",
		source: "practice"
	},
	"Happy Halloween Plot and Character Check": {
		title: "Plot and Character Check",
		source: "practice"
	},
	"Groceries Storyboard": {
		title: "Story Sequence Storyboard",
		source: "practice"
	},
	"Megalodon News Report": {
		title: "Library Notice Report",
		source: "practice"
	},
	"Kevin's Crafts Story Review": {
		title: "Mina's Drawing Story Review",
		source: "practice"
	},
	"Lab-Grown Meat Main Idea Report": {
		title: "Art-Box Labels Main Idea Report",
		source: "challenge"
	},
	"Bacon and Mittens Review or Figurative Art": {
		title: "Story Review or Figurative Art",
		source: "practice"
	},
	"Dinosaur Footprint Interview or News Report": {
		title: "Interview or News Report",
		source: "challenge"
	}
};

const responseExtensions: Record<string, string> = {
	"Character Investigator Report":
		"\n\nExplain how trying the second pin supports the inference.",
	"Kevin's Crafts Story Review":
		"\n\nExplain how Jo’s comment helps cause that change.",
	"Sweet Sixteen Character Evidence":
		"\n\nCompare Mara with Eli in the Character Investigator Report. Write three sentences with one supported action from each passage and one detail that Mara’s passage leaves unknown.",
	"Groceries Storyboard":
		"\n\nDraw or number the meaningful scenes in order. Give each frame a caption, explain why it matters, and connect one event to the lesson.",
	"Megalodon News Report":
		"\n\nUse the report for a short news-style reading with an introduction, key details and a closing. Introduce it as an invented practice notice."
};

const completionStarts: Record<string, string> = {
	"Character Investigator Report": "Separate one appearance detail",
	"Sweet Sixteen Character Evidence": "A reader calls Mara careless",
	"Faithful Friend Plot Diagram": "Name the problem",
	"Happy Halloween Plot and Character Check": "Describe one supported trait",
	"Groceries Storyboard": "Make six numbered scene captions",
	"Megalodon News Report": "Identify the central idea",
	"Kevin's Crafts Story Review": "Write a short review",
	"Lab-Grown Meat Main Idea Report": "Give the central idea",
	"Bacon and Mittens Review or Figurative Art":
		"Write a four-sentence review",
	"Dinosaur Footprint Interview or News Report":
		"Write either a short news script"
};
function suppliedReadingTask(prompt: string, originalTitle: string) {
	const start = prompt.indexOf(completionStarts[originalTitle]);
	if (start < 0)
		throw new Error(`Missing supplied reading task: ${originalTitle}`);
	return `${prompt
		.slice(0, start)
		.trimEnd()}\n\n**Completion evidence:**\n\n${prompt.slice(start)}`;
}

function itemId(module: string, title: string, section = "curriculum") {
	return `early-elementary-a-reading-${module}-${section}-${title}`
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-|-$/g, "");
}
function sampleResponse(anchor: string) {
	const asset = `/course-assets/early-elementary-a-reading/practice-checks-v1.md#${anchor}`;
	return `[Project self-check](/course-resource?asset=${encodeURIComponent(asset)}&label=${encodeURIComponent("Sample response")})`;
}
export function applyJoyOfReadingGuidance(course: RawCourse, raw: RawCourse) {
	for (const original of raw.modules) {
		const material = joyOfReadingGuidance.find(
			unit => unit.module === original.title
		);
		const displayed = course.modules.find(
			module =>
				module.title.toLowerCase() === original.title.toLowerCase()
		);
		const reading = displayed?.curriculum[0];
		if (!material || !displayed || !reading) {
			throw new Error(
				`Missing Joy of Reading guidance: ${original.title}`
			);
		}
		const assignment = (
			item: RawCourseModuleItem,
			section = "curriculum"
		): RawCourseModuleItem => {
			const previous = [
				...displayed.curriculum,
				...displayed.supplementalProjects
			].find(
				row =>
					row.title === item.title ||
					row.aliases?.includes(item.title)
			);
			const replacement = courseTextDefaults[item.title];
			const supplied = replacement
				? material[replacement.source]
				: undefined;
			return {
				...item,
				...previous,
				id:
					previous?.id ??
					item.id ??
					itemId(original.title, item.title, section),
				title: replacement?.title ?? previous?.title ?? item.title,
				aliases: replacement
					? [
							...new Set([
								...(previous?.aliases ?? item.aliases ?? []),
								item.title
							])
						]
					: (previous?.aliases ?? item.aliases),
				content: supplied
					? `**Course-authored reading and task**\n\n${suppliedReadingTask(supplied.prompt, item.title)}${responseExtensions[item.title] ?? ""}${item.title === "Bacon and Mittens Review or Figurative Art" ? `\n\nFor a figurative-art response instead, use these supplied contexts: After several failed attempts, the puzzle was a hard nut to crack. The test was a breeze, so the class finished early. The sunflower was as tall as a giraffe. Draw a literal picture for each phrase, explain its intended meaning and label the figure. Add a supported lesson from Omi’s story.\n\n${sampleResponse("figurative-language-drawing-set").replace("Project self-check", "Figurative-language self-check")}` : ""}\n\n${sampleResponse(supplied.anchor)}`
					: item.content.replace(/^\*\*Project goal:\*\*\s*/i, "") +
						(item.title === "Figurative Language Drawing Set"
							? `\n\n${sampleResponse(
									"figurative-language-drawing-set"
								)}`
							: ""),
				contentKind: "assignment",
				preserveInstructions: true,
				preserveAssignment: true
			};
		};
		const projects = original.curriculum.slice(1).map(item => ({
			...assignment(item),
			learningPath: "core" as const
		}));
		const projectIds = new Set(projects.map(item => item.id));
		reading.aliases = reading.aliases?.filter(
			alias => !projectIds.has(alias)
		);
		reading.content = `**Method**\n\n${material.method}\n\n**Worked example**\n\n${material.worked}`;
		reading.contentKind = "reading";
		reading.learningPath = "core";
		reading.preserveInstructions = true;
		displayed.curriculum = [reading, ...projects];
		displayed.supplementalProjects = original.supplementalProjects.map(
			item => {
				const practice = item.title.startsWith("Practice Map:");
				const challenge = item.title.startsWith("Extension Review:");
				if (!practice && !challenge)
					return assignment(item, "supplemental");
				const reusedAsCore = [
					...original.curriculum,
					...original.supplementalProjects
				].some(candidate => {
					const replacement = courseTextDefaults[candidate.title];
					return (
						replacement?.source ===
						(practice ? "practice" : "challenge")
					);
				});
				const supplied = practice
					? material.practice
					: material.challenge;
				const previous = displayed.supplementalProjects.find(
					row => row.title === item.title
				);
				return {
					...item,
					...previous,
					internal:
						reusedAsCore || previous?.internal || item.internal,
					content: `**Practice passage and task**\n\n${supplied.prompt}\n\n${sampleResponse(supplied.anchor)}`,
					contentKind: "assignment" as const,
					preserveInstructions: true,
					preserveAssignment: true
				};
			}
		);
	}
}
