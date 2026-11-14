import { githubRawUrl, parseGitHubResource } from "@/modules/codePreview";
import { javaArchitectureProjectKey } from "./javaArchitectureResources";

export const javaJudgmentRevision = "756fcf2f37c8cf0daeb70fcc86916c91a24973f7";
export const javaJudgmentModuleID =
	"design-patterns-in-java-dpj9-pattern-selection-and-refactoring-judgment";
export const javaJudgmentReadingID =
	"design-patterns-in-java-dpj9-pattern-selection-and-refactoring-judgment-curriculum-pattern-selection-and-refactoring-judgment-core-concepts";
export const javaJudgmentPreviewID =
	"design-patterns-in-java-dpj9-pattern-selection-and-refactoring-judgment-curriculum-refactoring-preview-pattern-selection-requires-safe-change";
export const javaJudgmentCoreID =
	"design-patterns-in-java-dpj9-pattern-selection-and-refactoring-judgment-curriculum-core-project-pattern-selection-and-refactoring-judgment";
export const javaJudgmentExtensionID =
	"design-patterns-in-java-dpj9-pattern-selection-and-refactoring-judgment-supplemental-pattern-selection-and-refactoring-judgment-extension-practice";
export const javaJudgmentReferenceItems = [
	javaJudgmentReadingID,
	javaJudgmentPreviewID,
	javaJudgmentCoreID,
	javaJudgmentExtensionID
] as const;
export const javaJudgmentFiles = [
	"ContractTests.java",
	"DECISIONS.md",
	"Main.java",
	"README.md",
	"sources.txt",
	"src/checkout/Checkout.java",
	"src/checkout/LegacyCheckout.java",
	"src/checkout/Order.java",
	"src/checkout/Totals.java"
] as const;
export const javaJudgmentWorkedFiles = [
	"Main.java",
	"ContractTests.java",
	"README.md"
] as const;

export function javaJudgmentURL(role: "starter" | "solution" | "example") {
	if (role === "example") {
		return `https://github.com/instruction-material/Java-Level-3/tree/${
			javaJudgmentRevision
		}/DPJ9-Judgment-Worked-Example`;
	}
	return `https://github.com/instruction-material/Java-Level-3/tree/${
		javaJudgmentRevision
	}/DPJ9-Checkout-Judgment-Packs/${role}`;
}
export function javaJudgmentResource(url: string) {
	const resource = parseGitHubResource(url);
	if (
		!resource ||
		resource.mode !== "tree" ||
		resource.owner.toLowerCase() !== "instruction-material" ||
		resource.repo.toLowerCase() !== "java-level-3" ||
		resource.ref !== javaJudgmentRevision
	) {
		return null;
	}
	const [pack, role, extra] = resource.path.split("/");
	if (pack === "DPJ9-Judgment-Worked-Example" && role === undefined)
		return { resource, pack, role: "example" as const };
	if (
		pack !== "DPJ9-Checkout-Judgment-Packs" ||
		extra !== undefined ||
		(role !== "starter" && role !== "solution")
	) {
		return null;
	}
	return { resource, pack, role };
}
export function javaJudgmentProjectKey(
	courseID: string,
	itemID: string,
	role: "starter" | "reference",
	url: string
) {
	const selected = javaJudgmentResource(url);
	if (!selected || courseID !== "design-patterns-in-java")
		return javaArchitectureProjectKey(courseID, itemID, role, url);
	const readingReference =
		selected.role !== "example" &&
		role === "reference" &&
		(javaJudgmentReferenceItems as readonly string[]).includes(itemID);
	const learnerContinuation =
		selected.role !== "example" &&
		role === "starter" &&
		[javaJudgmentPreviewID, javaJudgmentExtensionID].includes(itemID);
	const maintainedID = readingReference
		? javaJudgmentReadingID
		: learnerContinuation
			? javaJudgmentCoreID
			: itemID;
	return [courseID, maintainedID, role, "native-java-judgment"].join(":");
}
export function javaJudgmentImportFiles(url: string) {
	const selected = javaJudgmentResource(url);
	if (!selected) return null;
	const names =
		selected.role === "example"
			? javaJudgmentWorkedFiles
			: javaJudgmentFiles;
	return names.map(name => {
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
