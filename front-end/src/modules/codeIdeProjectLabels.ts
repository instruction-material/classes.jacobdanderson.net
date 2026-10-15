import type { PythonIdeProject } from "./pythonIde";
import { courseCatalog } from "@/stores/courses/index";
import { getPythonIdeProjectKindLabel } from "./pythonIde";
import { bronzePythonFileIoForKey } from "./usacoBronzeRequiredPacks";

type ProjectLabelMetadata = Pick<
	PythonIdeProject,
	"courseID" | "courseProjectKey" | "mode" | "starterLabel" | "title"
> &
	Partial<Pick<PythonIdeProject, "files">>;

const courseIDs = new Set(courseCatalog.map(course => course.id));

export function getCodeIdeProjectSubtitle(project: ProjectLabelMetadata) {
	const parts = (project.courseProjectKey ?? "").split(":");
	const [courseID = "", itemID = "", role, variant] = parts;
	const supportedShape =
		parts.length === 3 ||
		(parts.length === 4 &&
			((variant === "native-assembly" &&
				project.mode === "assembly" &&
				courseID === "assembly") ||
				(variant === "native-c17" &&
					project.mode === "c" &&
					courseID === "c-systems-engineering") ||
				(variant === "native-linux" &&
					project.mode === "linux" &&
					courseID === "linux-systems") ||
				(variant === "native-network" &&
					project.mode === "linux" &&
					courseID === "network-systems") ||
				(variant === "native-java" && project.mode === "java") ||
				(project.mode === "python" &&
					Boolean(
						bronzePythonFileIoForKey(project.courseProjectKey)
					))));
	const courseMatches =
		project.courseID === undefined || project.courseID === courseID;
	const knownRole =
		supportedShape &&
		courseIDs.has(courseID) &&
		courseMatches &&
		itemID &&
		!/\s/.test(itemID) &&
		(role === "starter" || role === "reference");
	const language = getPythonIdeProjectKindLabel(project);

	if (!knownRole) return language;
	return `${role === "starter" ? "Learner" : "Reference"} · ${language}`;
}

export function getCodeIdeProjectAccessibleLabel(
	project: ProjectLabelMetadata
) {
	const title = project.title || "Untitled Project";
	return `${title} (${getCodeIdeProjectSubtitle(project)})`;
}
