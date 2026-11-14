import { githubRawUrl, parseGitHubResource } from "@/modules/codePreview";
import { javaJudgmentProjectKey } from "./javaJudgmentResources";

export const javaCapstoneRevision = "070de5bd4d29e7b21489170cc024aef07b9ba160";
export const javaCapstoneModuleID =
	"design-patterns-in-java-dpj10-capstone-refactor";
export const javaCapstoneReadingID =
	"design-patterns-in-java-dpj10-capstone-refactor-curriculum-capstone-launch-start-from-a-cluttered-java-application";
export const javaCapstoneImplementationID =
	"design-patterns-in-java-dpj10-capstone-refactor-curriculum-implementation-pass-preserve-behavior-while-improving-structure";
export const javaCapstoneArchitectureID =
	"design-patterns-in-java-dpj10-capstone-refactor-curriculum-architecture-review-package-layout-seams-and-testability";
export const javaCapstoneGateID =
	"design-patterns-in-java-dpj10-capstone-refactor-curriculum-capstone-gate-characterize-before-change";
export const javaCapstoneCoreID =
	"design-patterns-in-java-dpj10-capstone-refactor-curriculum-core-project-capstone-refactor";
export const javaCapstoneExtensionID =
	"design-patterns-in-java-dpj10-capstone-refactor-supplemental-capstone-refactor-extension-practice";
export const javaCapstoneWorkspaceItems = [
	javaCapstoneReadingID,
	javaCapstoneImplementationID,
	javaCapstoneArchitectureID,
	javaCapstoneGateID,
	javaCapstoneCoreID,
	javaCapstoneExtensionID
] as const;
export const javaCapstoneFiles = {
	starter: [
		"CHECKPOINTS.md",
		"ContractTests.java",
		"DECISIONS.md",
		"Main.java",
		"README.md",
		"sources.txt",
		"src/dispatch/Composition.java",
		"src/dispatch/app/Desk.java",
		"src/dispatch/domain/Dispatch.java",
		"src/dispatch/domain/Request.java",
		"src/dispatch/legacy/LegacyDesk.java",
		"src/dispatch/ports/DeskApi.java",
		"src/dispatch/ports/NoticeSink.java"
	],
	solution: [
		"ArchitectureTests.java",
		"CHECKPOINTS.md",
		"ContractTests.java",
		"DECISIONS.md",
		"Main.java",
		"README.md",
		"sources.txt",
		"src/dispatch/Composition.java",
		"src/dispatch/app/Desk.java",
		"src/dispatch/domain/Dispatch.java",
		"src/dispatch/domain/Request.java",
		"src/dispatch/infra/MemoryDispatches.java",
		"src/dispatch/infra/StandardRenderer.java",
		"src/dispatch/legacy/LegacyDesk.java",
		"src/dispatch/ports/DeskApi.java",
		"src/dispatch/ports/DispatchRepository.java",
		"src/dispatch/ports/NoticeSink.java",
		"src/dispatch/ports/Renderer.java"
	]
} as const;
export function javaCapstoneURL(role: "starter" | "solution") {
	return `https://github.com/instruction-material/Java-Level-3/tree/${
		javaCapstoneRevision
	}/DPJ10-Dispatch-Refactor-Packs/${role}`;
}
export function javaCapstoneResource(url: string) {
	const resource = parseGitHubResource(url);
	if (
		!resource ||
		resource.mode !== "tree" ||
		resource.owner.toLowerCase() !== "instruction-material" ||
		resource.repo.toLowerCase() !== "java-level-3" ||
		resource.ref !== javaCapstoneRevision
	) {
		return null;
	}
	const [pack, role, extra] = resource.path.split("/");
	if (
		pack !== "DPJ10-Dispatch-Refactor-Packs" ||
		extra !== undefined ||
		(role !== "starter" && role !== "solution")
	) {
		return null;
	}
	return { resource, pack, role } as const;
}
export function javaCapstoneProjectKey(
	courseID: string,
	itemID: string,
	role: "starter" | "reference",
	url: string
) {
	const selected = javaCapstoneResource(url);
	if (!selected || courseID !== "design-patterns-in-java")
		return javaJudgmentProjectKey(courseID, itemID, role, url);
	const shared = (javaCapstoneWorkspaceItems as readonly string[]).includes(
		itemID
	);
	return [
		courseID,
		shared
			? role === "starter"
				? javaCapstoneCoreID
				: javaCapstoneReadingID
			: itemID,
		role,
		"native-java-capstone"
	].join(":");
}
export function javaCapstoneImportFiles(url: string) {
	const selected = javaCapstoneResource(url);
	if (!selected) return null;
	return javaCapstoneFiles[selected.role].map(name => {
		const path = `${selected.resource.path}/${name}`;
		return {
			name,
			file: {
				path,
				label: name,
				size: null,
				htmlUrl: `https://github.com/${selected.resource.owner}/${
					selected.resource.repo
				}/blob/${selected.resource.ref}/${path}`,
				rawUrl: githubRawUrl(selected.resource, path)
			}
		};
	});
}
