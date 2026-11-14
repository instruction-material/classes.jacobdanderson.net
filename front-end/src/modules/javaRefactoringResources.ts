import { githubRawUrl, parseGitHubResource } from "@/modules/codePreview";
import {
	javaComposingProjectKey,
	javaComposingResource
} from "./javaComposingResources";
import {
	javaRefactoringUnitProjectKey,
	javaRefactoringUnitResource
} from "./javaRefactoringUnits";

export const javaRefactoringRevision =
	"56cc9b14b8162f17bc5eeb2f70ed7c0dbcc83251";
export const javaRefactoringModuleID =
	"design-patterns-in-java-part-2-dpr1-code-smells-and-safe-refactoring-workflow";
export const javaRefactoringReadingID =
	"design-patterns-in-java-part-2-dpr1-code-smells-and-safe-refactoring-workflow-curriculum-code-smells-and-safe-refactoring-workflow-core-concepts";
export const javaRefactoringCoreID =
	"design-patterns-in-java-part-2-dpr1-code-smells-and-safe-refactoring-workflow-curriculum-core-project-code-smells-and-safe-refactoring-workflow";
export const javaRefactoringSourceItems = [
	"design-patterns-in-java-part-2-dpr1-code-smells-and-safe-refactoring-workflow-curriculum-code-smells-and-safe-refactoring-workflow-core-concepts",
	"design-patterns-in-java-part-2-dpr1-code-smells-and-safe-refactoring-workflow-curriculum-code-smells-and-safe-refactoring-workflow-application-check",
	"design-patterns-in-java-part-2-dpr1-code-smells-and-safe-refactoring-workflow-curriculum-behavior-inventory-and-reversible-commit-contract",
	"design-patterns-in-java-part-2-dpr1-code-smells-and-safe-refactoring-workflow-curriculum-core-project-code-smells-and-safe-refactoring-workflow",
	"design-patterns-in-java-part-2-dpr1-code-smells-and-safe-refactoring-workflow-supplemental-understanding-check-code-smells-and-safe-refactoring-workflow",
	"design-patterns-in-java-part-2-dpr1-code-smells-and-safe-refactoring-workflow-supplemental-code-smells-and-safe-refactoring-workflow-extension-practice"
] as const;
export const javaRefactoringFiles = [
	"CHECKPOINTS.md",
	"ContractTests.java",
	"DECISIONS.md",
	"Main.java",
	"README.md",
	"sources.txt",
	"src/loans/LegacyLoanDesk.java",
	"src/loans/Loan.java",
	"src/loans/LoanDesk.java"
] as const;
export function javaRefactoringURL(role: "starter" | "solution") {
	return `https://github.com/instruction-material/Java-Level-3/tree/${javaRefactoringRevision}/DPR1-Safe-Refactoring-Packs/${role}`;
}
export function javaRefactoringResource(url: string) {
	const resource = parseGitHubResource(url);
	if (
		!resource ||
		resource.mode !== "tree" ||
		resource.owner.toLowerCase() !== "instruction-material" ||
		resource.repo.toLowerCase() !== "java-level-3" ||
		resource.ref !== javaRefactoringRevision
	) {
		return null;
	}
	const [pack, role, extra] = resource.path.split("/");
	if (
		pack !== "DPR1-Safe-Refactoring-Packs" ||
		extra !== undefined ||
		(role !== "starter" && role !== "solution")
	) {
		return null;
	}
	return { resource, role } as const;
}
export function javaRefactoringProjectKey(
	courseID: string,
	itemID: string,
	role: "starter" | "reference",
	url: string
) {
	if (javaRefactoringUnitResource(url))
		return javaRefactoringUnitProjectKey(courseID, itemID, role, url);
	if (javaComposingResource(url))
		return javaComposingProjectKey(courseID, itemID, role, url);
	const selected = javaRefactoringResource(url);
	if (
		!selected ||
		courseID !== "design-patterns-in-java-part-2" ||
		!(javaRefactoringSourceItems as readonly string[]).includes(itemID)
	) {
		return [courseID, itemID, role].join(":");
	}
	return [
		courseID,
		role === "starter" ? javaRefactoringCoreID : javaRefactoringReadingID,
		role,
		"native-java-refactoring"
	].join(":");
}
export function javaRefactoringImportFiles(url: string) {
	const selected = javaRefactoringResource(url);
	if (!selected) return null;
	return javaRefactoringFiles.map(name => {
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
export function javaRefactoringNativeInstructions(
	key?: string
): string[] | null {
	const parts = (key ?? "").split(":");
	const [course, item, role, extra] = parts;
	if (
		parts.length !== 4 ||
		course !== "design-patterns-in-java-part-2" ||
		![javaRefactoringCoreID, javaRefactoringReadingID].includes(
			item ?? ""
		) ||
		!["starter", "reference"].includes(role ?? "") ||
		extra !== "native-java-refactoring"
	) {
		return null;
	}
	return [
		"Java 21 safe refactoring baseline",
		"Export all nine role files with the src/loans package, DECISIONS.md and CHECKPOINTS.md.",
		"javac --release 21 -Xlint:all -Werror -d classes @sources.txt",
		"java -cp classes ContractTests base",
		"java -cp classes ContractTests core",
		"java -cp classes Main base",
		"java -cp classes Main",
		"Baseline reports 24190 passed and core reports 48380 passed. Both Main modes print the four exact lines in the lesson.",
		"The starter already passes core. Compare its duplicated rule sites with the selected refactor and retain the decision record.",
		"After optional immutable batch work: java -cp classes ContractTests",
		"The complete reference reports 48389 passed; core remains independent of optional work.",
		"These programs read no standard input. Run displays native Java 21 commands."
	];
}
