import { githubRawUrl, parseGitHubResource } from "@/modules/codePreview";
import { javaBehavioralProjectKey } from "./javaBehavioralResources";

export const javaCollaborationRevision =
	"c137b8cb5a0fec3c3a2effde9fc72d5e86ce394e";
export const javaCollaborationModuleID =
	"design-patterns-in-java-dpj7-behavioral-patterns-ii";
export const javaCollaborationReadingID =
	"design-patterns-in-java-dpj7-behavioral-patterns-ii-curriculum-behavioral-patterns-ii-core-concepts";
export const javaCollaborationApplicationID =
	"design-patterns-in-java-dpj7-behavioral-patterns-ii-curriculum-behavioral-patterns-ii-application-check";
export const javaCollaborationCoreID =
	"design-patterns-in-java-dpj7-behavioral-patterns-ii-curriculum-core-project-behavioral-patterns-ii";
export const javaCollaborationExtensionID =
	"design-patterns-in-java-dpj7-behavioral-patterns-ii-supplemental-behavioral-patterns-ii-extension-practice";
export const javaCollaborationReferenceItems = [
	"design-patterns-in-java-dpj7-behavioral-patterns-ii-curriculum-behavioral-patterns-ii-core-concepts",
	"design-patterns-in-java-dpj7-behavioral-patterns-ii-curriculum-behavioral-patterns-ii-application-check",
	"design-patterns-in-java-dpj7-behavioral-patterns-ii-curriculum-core-project-behavioral-patterns-ii",
	"design-patterns-in-java-dpj7-behavioral-patterns-ii-supplemental-behavioral-patterns-ii-extension-practice"
] as const;
export const javaCollaborationFiles = [
	"ContractTests.java",
	"Main.java",
	"README.md",
	"sources.txt",
	"src/editor/EditCommand.java",
	"src/editor/EditEvent.java",
	"src/editor/EditorMediator.java",
	"src/editor/EventBus.java",
	"src/editor/Nodes.java",
	"src/editor/ReplaceCommand.java",
	"src/editor/TextDocument.java",
	"src/editor/TextVisitor.java",
	"src/editor/Validation.java"
] as const;
export const javaCollaborationWorkedFiles = [
	"Main.java",
	"ContractTests.java",
	"README.md"
] as const;
export function javaCollaborationURL(role: "starter" | "solution" | "example") {
	if (role === "example")
		return `https://github.com/instruction-material/Java-Level-3/tree/${javaCollaborationRevision}/DPJ7-Collaboration-Worked-Example`;
	return `https://github.com/instruction-material/Java-Level-3/tree/${javaCollaborationRevision}/DPJ7-Editor-Collaboration-Packs/${role}`;
}
export function javaCollaborationResource(url: string) {
	const resource = parseGitHubResource(url);
	if (
		!resource ||
		resource.mode !== "tree" ||
		resource.owner.toLowerCase() !== "instruction-material" ||
		resource.repo.toLowerCase() !== "java-level-3" ||
		resource.ref !== javaCollaborationRevision
	) {
		return null;
	}
	const [pack, role, extra] = resource.path.split("/");
	if (pack === "DPJ7-Collaboration-Worked-Example" && role === undefined)
		return { resource, pack, role: "example" as const };
	if (
		pack !== "DPJ7-Editor-Collaboration-Packs" ||
		extra !== undefined ||
		(role !== "starter" && role !== "solution")
	) {
		return null;
	}
	return { resource, pack, role };
}
export function javaCollaborationProjectKey(
	courseID: string,
	itemID: string,
	role: "starter" | "reference",
	url: string
) {
	const selected = javaCollaborationResource(url);
	if (!selected || courseID !== "design-patterns-in-java")
		return javaBehavioralProjectKey(courseID, itemID, role, url);
	const readingReference =
		selected.role !== "example" &&
		role === "reference" &&
		(javaCollaborationReferenceItems as readonly string[]).includes(itemID);
	const learnerContinuation =
		selected.role !== "example" &&
		role === "starter" &&
		[javaCollaborationApplicationID, javaCollaborationExtensionID].includes(
			itemID
		);
	const maintainedID = readingReference
		? javaCollaborationReadingID
		: learnerContinuation
			? javaCollaborationCoreID
			: itemID;
	return `${courseID}:${maintainedID}:${role}:native-java-collaboration`;
}
export function javaCollaborationImportFiles(url: string) {
	const selected = javaCollaborationResource(url);
	if (!selected) return null;
	const names =
		selected.role === "example"
			? javaCollaborationWorkedFiles
			: javaCollaborationFiles;
	return names.map(name => {
		const path = `${selected.resource.path}/${name}`;
		return {
			name,
			file: {
				path,
				label: name,
				size: null,
				htmlUrl: `https://github.com/${selected.resource.owner}/${selected.resource.repo}/blob/${selected.resource.ref}/${path}`,
				rawUrl: githubRawUrl(selected.resource, path)
			}
		};
	});
}
