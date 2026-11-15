import type { RawCourse } from "./types";
import guide1 from "@/assets/course-guides/ai-optional-01.md?raw";
import guide2 from "@/assets/course-guides/ai-optional-02.md?raw";
import guide3 from "@/assets/course-guides/ai-optional-03.md?raw";
import guide4 from "@/assets/course-guides/ai-optional-04.md?raw";
import guide5 from "@/assets/course-guides/ai-optional-05.md?raw";
import guide6 from "@/assets/course-guides/ai-optional-06.md?raw";
import guide7 from "@/assets/course-guides/ai-optional-07.md?raw";
import guide8 from "@/assets/course-guides/ai-optional-08.md?raw";
import guide9 from "@/assets/course-guides/ai-optional-09.md?raw";
import guide10 from "@/assets/course-guides/ai-optional-10.md?raw";
import guide11 from "@/assets/course-guides/ai-optional-11.md?raw";
import guide12 from "@/assets/course-guides/ai-optional-12.md?raw";
import guide13 from "@/assets/course-guides/ai-optional-13.md?raw";
import guide14 from "@/assets/course-guides/ai-optional-14.md?raw";
import guide15 from "@/assets/course-guides/ai-optional-15.md?raw";
import guide16 from "@/assets/course-guides/ai-optional-16.md?raw";
import guide17 from "@/assets/course-guides/ai-optional-17.md?raw";
import guide18 from "@/assets/course-guides/ai-optional-18.md?raw";

const guides: Record<string, string> = {
	"AI-01-unit-1-ai-landscape-and-state-representation-supplemental-4": guide1,
	"AI-02-unit-2-stacks-queues-and-traversal-intuition-supplemental-4": guide2,
	"AI-03-unit-5-rule-based-systems-and-puzzle-framing-supplemental-4": guide3,
	"AI-04-unit-7-features-evaluation-and-responsible-ai-supplemental-3":
		guide4,
	"AI-05-applied-studio-11-ai-search-lab-13-supplemental-2": guide5,
	"AI-06-applied-studio-11-ai-search-lab-13-supplemental-3": guide6,
	"AI-07-applied-studio-12-ai-search-lab-14-supplemental-2": guide7,
	"AI-08-applied-studio-12-ai-search-lab-14-supplemental-3": guide8,
	"AI-09-applied-studio-13-ai-search-lab-15-supplemental-2": guide9,
	"AI-10-applied-studio-13-ai-search-lab-15-supplemental-3": guide10,
	"AI-11-applied-studio-14-ai-search-lab-16-supplemental-2": guide11,
	"AI-12-applied-studio-14-ai-search-lab-16-supplemental-3": guide12,
	"AI-13-applied-studio-15-ai-search-lab-17-supplemental-2": guide13,
	"AI-14-applied-studio-15-ai-search-lab-17-supplemental-3": guide14,
	"AI-15-applied-studio-16-unbeatable-tictactoe-ai-1-supplemental-2": guide15,
	"AI-16-applied-studio-16-unbeatable-tictactoe-ai-1-supplemental-3": guide16,
	"AI-17-applied-studio-17-the-marble-game-ai-copy-supplemental-2": guide17,
	"AI-18-applied-studio-17-the-marble-game-ai-copy-supplemental-3": guide18
};

export function configureAiOptionalProjects(course: RawCourse) {
	let count = 0;
	for (const module of course.modules) {
		for (const item of module.supplementalProjects) {
			const folder = item.projectLink?.match(
				/\/(AI-[^/]+-supplemental-\d+)\/starter$/
			)?.[1];
			const content = folder && guides[folder];
			if (!content) continue;
			Object.assign(item, {
				content,
				contentKind: "assignment",
				preserveInstructions: true,
				preserveAssignment: true
			});
			count += 1;
		}
	}
	if (count !== 18)
		throw new Error("Expected all eighteen authored optional AI projects.");
}
