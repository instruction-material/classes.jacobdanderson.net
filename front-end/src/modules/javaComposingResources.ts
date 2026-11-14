import { githubRawUrl, parseGitHubResource } from "@/modules/codePreview";

export const javaComposingRevision = "834870e36d84a3b4c490b28c636b5b4b8a3bdffe";
export const javaComposingModuleID =
	"design-patterns-in-java-part-2-dpr2-composing-methods";
export const javaComposingReadingID =
	"design-patterns-in-java-part-2-dpr2-composing-methods-curriculum-composing-methods-core-concepts";
export const javaComposingCoreID =
	"design-patterns-in-java-part-2-dpr2-composing-methods-curriculum-core-project-composing-methods";
export const javaComposingSourceItems = [
	"design-patterns-in-java-part-2-dpr2-composing-methods-curriculum-composing-methods-core-concepts",
	"design-patterns-in-java-part-2-dpr2-composing-methods-curriculum-composing-methods-application-check",
	"design-patterns-in-java-part-2-dpr2-composing-methods-curriculum-extraction-semantic-preservation-contract",
	"design-patterns-in-java-part-2-dpr2-composing-methods-curriculum-core-project-composing-methods",
	"design-patterns-in-java-part-2-dpr2-composing-methods-supplemental-understanding-check-composing-methods",
	"design-patterns-in-java-part-2-dpr2-composing-methods-supplemental-composing-methods-extension-practice"
] as const;
export const javaComposingFiles = [
	"CHECKPOINTS.md",
	"ContractTests.java",
	"DECISIONS.md",
	"Main.java",
	"README.md",
	"sources.txt",
	"src/reports/ComposedReport.java",
	"src/reports/LegacyReport.java",
	"src/reports/Summary.java",
	"src/reports/comparison/MethodObjectReport.java"
] as const;
export function javaComposingURL(role: "starter" | "solution") {
	return `https://github.com/instruction-material/Java-Level-3/tree/${javaComposingRevision}/DPR2-Composing-Methods-Packs/${role}`;
}
export function javaComposingResource(url: string) {
	const resource = parseGitHubResource(url);
	if (
		!resource ||
		resource.mode !== "tree" ||
		resource.owner.toLowerCase() !== "instruction-material" ||
		resource.repo.toLowerCase() !== "java-level-3" ||
		resource.ref !== javaComposingRevision
	) {
		return null;
	}
	const [pack, role, extra] = resource.path.split("/");
	if (
		pack !== "DPR2-Composing-Methods-Packs" ||
		extra !== undefined ||
		(role !== "starter" && role !== "solution")
	) {
		return null;
	}
	return { resource, role } as const;
}
export function javaComposingProjectKey(
	courseID: string,
	itemID: string,
	role: "starter" | "reference",
	url: string
) {
	const selected = javaComposingResource(url);
	if (
		!selected ||
		courseID !== "design-patterns-in-java-part-2" ||
		!(javaComposingSourceItems as readonly string[]).includes(itemID)
	) {
		return [courseID, itemID, role].join(":");
	}
	return [
		courseID,
		role === "starter" ? javaComposingCoreID : javaComposingReadingID,
		role,
		"native-java-composing"
	].join(":");
}
export function javaComposingImportFiles(url: string) {
	const selected = javaComposingResource(url);
	if (!selected) return null;
	return javaComposingFiles.map(name => {
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
export function javaComposingNativeInstructions(key?: string): string[] | null {
	const parts = (key ?? "").split(":");
	const [course, item, role, extra] = parts;
	if (
		parts.length !== 4 ||
		course !== "design-patterns-in-java-part-2" ||
		![javaComposingCoreID, javaComposingReadingID].includes(item ?? "") ||
		!["starter", "reference"].includes(role ?? "") ||
		extra !== "native-java-composing"
	) {
		return null;
	}
	return [
		"Java 21 composing methods",
		"Export all ten role files, including src/reports/comparison, DECISIONS.md and CHECKPOINTS.md.",
		"javac --release 21 -Xlint:all -Werror -d classes @sources.txt",
		"java -cp classes ContractTests base",
		"java -cp classes ContractTests core",
		"java -cp classes ContractTests object",
		"java -cp classes Main base",
		"java -cp classes Main",
		"java -cp classes Main object",
		"Baseline and method-object report 6609 passed; core reports 13218 passed. All Main modes print the three exact lines in the lesson.",
		"The starter already passes core. Preserve callback order, call counts, exception identity and long arithmetic while splitting responsibilities.",
		"After optional array adapter work: java -cp classes ContractTests",
		"The complete reference reports 13226 passed; optional work remains independent of core.",
		"These programs read no standard input. Run displays native Java 21 commands."
	];
}
