import { githubRawUrl, parseGitHubResource } from "@/modules/codePreview";
import { javaCollaborationProjectKey } from "./javaCollaborationResources";

export const javaArchitectureRevision =
	"887243961b1fe595392e4aa10422b52b9eb41c2c";
export const javaArchitectureModuleID =
	"design-patterns-in-java-dpj8-modern-extensions-and-architecture-level-patterns";
export const javaArchitectureReadingID =
	"design-patterns-in-java-dpj8-modern-extensions-and-architecture-level-patterns-curriculum-modern-extensions-and-architecture-level-patterns-core-concepts";
export const javaArchitectureApplicationID =
	"design-patterns-in-java-dpj8-modern-extensions-and-architecture-level-patterns-curriculum-modern-extensions-and-architecture-level-patterns-application-check";
export const javaArchitectureCoreID =
	"design-patterns-in-java-dpj8-modern-extensions-and-architecture-level-patterns-curriculum-core-project-modern-extensions-and-architecture-level-patterns";
export const javaArchitectureExtensionID =
	"design-patterns-in-java-dpj8-modern-extensions-and-architecture-level-patterns-supplemental-modern-extensions-and-architecture-level-patterns-extension-practice";
export const javaArchitecturePluginID =
	"design-patterns-in-java-dpj8-modern-extensions-and-architecture-level-patterns-curriculum-serviceloader-plugin-boundary";
export const javaArchitectureReferenceItems = [
	"design-patterns-in-java-dpj8-modern-extensions-and-architecture-level-patterns-curriculum-serviceloader-plugin-boundary",
	"design-patterns-in-java-dpj8-modern-extensions-and-architecture-level-patterns-curriculum-modern-extensions-and-architecture-level-patterns-core-concepts",
	"design-patterns-in-java-dpj8-modern-extensions-and-architecture-level-patterns-curriculum-modern-extensions-and-architecture-level-patterns-application-check",
	"design-patterns-in-java-dpj8-modern-extensions-and-architecture-level-patterns-curriculum-core-project-modern-extensions-and-architecture-level-patterns",
	"design-patterns-in-java-dpj8-modern-extensions-and-architecture-level-patterns-supplemental-modern-extensions-and-architecture-level-patterns-extension-practice"
] as const;
export const javaArchitectureFiles = [
	"ContractTests.java",
	"META-INF/services/notes.plugins.TextPlugin",
	"Main.java",
	"README.md",
	"sources.txt",
	"src/notes/application/NoteService.java",
	"src/notes/domain/Note.java",
	"src/notes/infra/BracketPlugin.java",
	"src/notes/infra/InMemoryNotes.java",
	"src/notes/infra/UppercasePlugin.java",
	"src/notes/plugins/PluginCatalog.java",
	"src/notes/plugins/TextPlugin.java",
	"src/notes/ports/NoteRepository.java",
	"src/notes/ports/NoteSink.java",
	"src/notes/ui/NoteViewModel.java"
] as const;
export const javaArchitectureWorkedFiles = [
	"Main.java",
	"ContractTests.java",
	"README.md"
] as const;
export function javaArchitectureURL(role: "starter" | "solution" | "example") {
	if (role === "example")
		return `https://github.com/instruction-material/Java-Level-3/tree/${javaArchitectureRevision}/DPJ8-Architecture-Worked-Example`;
	return `https://github.com/instruction-material/Java-Level-3/tree/${javaArchitectureRevision}/DPJ8-Notebook-Architecture-Packs/${role}`;
}
export function javaArchitectureResource(url: string) {
	const resource = parseGitHubResource(url);
	if (
		!resource ||
		resource.mode !== "tree" ||
		resource.owner.toLowerCase() !== "instruction-material" ||
		resource.repo.toLowerCase() !== "java-level-3" ||
		resource.ref !== javaArchitectureRevision
	) {
		return null;
	}
	const [pack, role, extra] = resource.path.split("/");
	if (pack === "DPJ8-Architecture-Worked-Example" && role === undefined)
		return { resource, pack, role: "example" as const };
	if (
		pack !== "DPJ8-Notebook-Architecture-Packs" ||
		extra !== undefined ||
		(role !== "starter" && role !== "solution")
	) {
		return null;
	}
	return { resource, pack, role };
}
export function javaArchitectureProjectKey(
	courseID: string,
	itemID: string,
	role: "starter" | "reference",
	url: string
) {
	const selected = javaArchitectureResource(url);
	if (!selected || courseID !== "design-patterns-in-java")
		return javaCollaborationProjectKey(courseID, itemID, role, url);
	const readingReference =
		selected.role !== "example" &&
		role === "reference" &&
		(javaArchitectureReferenceItems as readonly string[]).includes(itemID);
	const learnerContinuation =
		selected.role !== "example" &&
		role === "starter" &&
		[
			javaArchitectureApplicationID,
			javaArchitecturePluginID,
			javaArchitectureExtensionID
		].includes(itemID);
	const maintainedID = readingReference
		? javaArchitectureReadingID
		: learnerContinuation
			? javaArchitectureCoreID
			: itemID;
	return `${courseID}:${maintainedID}:${role}:native-java-architecture`;
}
export function javaArchitectureImportFiles(url: string) {
	const selected = javaArchitectureResource(url);
	if (!selected) return null;
	const names =
		selected.role === "example"
			? javaArchitectureWorkedFiles
			: javaArchitectureFiles;
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
