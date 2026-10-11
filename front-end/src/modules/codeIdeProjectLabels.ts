import type { PythonIdeProject } from "./pythonIde";
import { courseCatalog } from "@/stores/courses/index";
import { getPythonIdeProjectKindLabel } from "./pythonIde";

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
			variant === "native-java" &&
			project.mode === "java");
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
