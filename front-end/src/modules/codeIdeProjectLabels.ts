import type { PythonIdeProject } from "./pythonIde";
import { courseCatalog } from "@/stores/courses/index";
import { javascriptFirstModuleResources } from "./javascriptFirstModuleResources";
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
	const javascriptVersion = parts[4] ?? "";
	const javascriptSource =
		parts.length === 5 &&
		project.mode === "web" &&
		courseID === "javascript-level-1-javascript-superstar" &&
		/^v[1-9]\d*$/.test(javascriptVersion ?? "") &&
		javascriptFirstModuleResources.some(
			source =>
				source.project === variant &&
				source.role === role &&
				Number(javascriptVersion.slice(1)) <= source.version
		);
	const supportedShape =
		javascriptSource ||
		parts.length === 3 ||
		(parts.length === 4 &&
			((variant === "native-swift-v1" &&
				project.mode === "swift" &&
				courseID === "intro-to-swift-app-development") ||
				(variant === "native-rust" &&
					project.mode === "rust" &&
					courseID === "rust-systems-security") ||
				(variant === "native-assembly" &&
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
				(variant === "juni-pygames" &&
					project.mode === "pgzero" &&
					["pygames", "pygames-classroom"].includes(courseID)) ||
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
	return `${role === "starter" ? "Learner" : "Reference"} · ${language}${javascriptSource ? ` · ${javascriptVersion}` : ""}`;
}

export function getCodeIdeProjectAccessibleLabel(
	project: ProjectLabelMetadata
) {
	const title = project.title || "Untitled Project";
	return `${title} (${getCodeIdeProjectSubtitle(project)})`;
}
