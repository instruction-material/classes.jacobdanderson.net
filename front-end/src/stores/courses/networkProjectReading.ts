import type { RawCourse } from "./types";
import namingReading2 from "../../assets/course-guides/network-addresses-families.md?raw";
import namingReading1 from "../../assets/course-guides/network-addresses-transfer.md?raw";
import namingReading0 from "../../assets/course-guides/network-addresses.md?raw";

import setupReading from "../../assets/course-guides/network-setup.md?raw";
import transportReading from "../../assets/course-guides/network-transport.md?raw";
import {
	networkCourseResource,
	networkPinnedCourseUrl
} from "../../modules/networkProjectResources";

const readings: Record<string, string> = {
	"NS-04-ns0-setup-and-tooling": setupReading,
	"NS-05-unit-1-the-network-stack-in-plain-english": transportReading,
	"NS-06-unit-2-addresses-and-naming": namingReading0,
	"NS-05-unit-2-addresses-and-naming-supplemental-2": namingReading1,
	"NS-06-unit-2-addresses-and-naming-supplemental-3": namingReading2
};

export function withNetworkProjectReadings(
	module: RawCourse["modules"][number]
) {
	const decorate = (
		item: RawCourse["modules"][number]["curriculum"][number]
	) => {
		const projectLink = networkPinnedCourseUrl(item.projectLink ?? "");
		const selected = networkCourseResource(projectLink);
		if (!selected) return item;
		const notebook = item.title.startsWith("Operations Notebook:");
		const reading = readings[selected.pack]
			.replace(
				/This replaces the unrelated port-list exercise previously (?:present )?in this folder\./,
				""
			)
			.replace("should retain", "retains")
			.replace(
				/agreed\s+instructor checkpoint/g,
				"agreed review checkpoint"
			)
			.replace(
				"Independent and instructor use",
				"Independent and guided use"
			)
			.trim();
		return {
			...item,
			projectLink,

			solutionLink: networkPinnedCourseUrl(item.solutionLink ?? ""),
			ideImport: true,
			preserveInstructions: true,

			content: notebook
				? `${item.content}\n\nContinue the existing core project. Opening this notebook reopens the matching core project rather than creating a second assignment. Keep predictions, actual command output, endpoint and process identities, changed-case comparisons and cleanup in network-notes.md. Follow the complete guide on the core project card and in README.md. Python programming is optional supplemental practice; command observations and the notebook are the core deliverable.`
				: `${reading}\n\nSource guide: [Network Systems project](${projectLink}). Edit, save, review and export the selected role in the site IDE, then follow README.md in an external Linux terminal. The reference is separate from the learner attempt.`
		};
	};
	return {
		...module,
		curriculum: module.curriculum.map(decorate),
		supplementalProjects: module.supplementalProjects.map(decorate)
	};
}
