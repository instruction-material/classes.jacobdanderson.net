import type { RawCourse } from "./types";
import reading5 from "./readings/machine-learning-worked-cores/toolchain-compare-environments.md?raw";
import reading4 from "./readings/machine-learning-worked-cores/toolchain-import-check.md?raw";
import reading2 from "./readings/machine-learning-worked-cores/toolchain-platforms.md?raw";
import reading3 from "./readings/machine-learning-worked-cores/toolchain-reproducibility.md?raw";
import reading0 from "./readings/machine-learning-worked-cores/toolchain-setup.md?raw";
import reading1 from "./readings/machine-learning-worked-cores/toolchain-version-recovery.md?raw";

const definitions = [
	["curriculum", "Machine Learning Setup Assumptions", reading0, "reading"],
	["curriculum", "Machine Learning Upgrade Rule", reading1, "reading"],
	["curriculum", "Machine Learning Platform Fallbacks", reading2, "reading"],
	[
		"curriculum",
		"Machine Learning Reproducibility Notes",
		reading3,
		"reading"
	],
	[
		"supplementalProjects",
		"Machine Learning First-Run Smoke Test",
		reading4,
		"assignment"
	],
	[
		"supplementalProjects",
		"Machine Learning Version Drift Review",
		reading5,
		"assignment"
	]
] as const;

export function applyMachineLearningToolchainReadings(course: RawCourse) {
	const module = course.modules.find(
		candidate =>
			candidate.title ===
			"Machine Learning: Toolchain and Version Assumptions"
	);
	for (const [collection, title, content, kind] of definitions) {
		const item = module?.[collection].find(
			candidate => candidate.title === title
		);
		if (!item) {
			throw new Error(
				`Missing Machine Learning toolchain item: ${title}`
			);
		}
		item.content = content;
		item.contentKind = kind;
		item.preserveInstructions = true;
		item.preserveAssignment = true;
	}
}
