import { githubRawUrl, parseGitHubResource } from "@/modules/codePreview";
import { javaCapstoneProjectKey } from "./javaCapstoneResources";
import {
	javaCollaborationCoreID,
	javaCollaborationProjectKey,
	javaCollaborationURL
} from "./javaCollaborationResources";
import {
	javaCreationalCoreID,
	javaCreationalProjectKey,
	javaCreationalURL
} from "./javaCreationalResources";

export const javaPatternAppendixProjectFamily: Record<string, string> = {
	"design-patterns-in-java-project-practice-guide-supplemental-practice-project-refactor-if-else-behavior-into-strategy":
		"strategy",
	"design-patterns-in-java-project-practice-guide-supplemental-practice-project-add-observer-events-to-a-small-model":
		"collaboration",
	"design-patterns-in-java-project-practice-guide-supplemental-practice-project-convert-duplicate-constructors-to-factory":
		"creational",
	"design-patterns-in-java-project-practice-guide-supplemental-practice-project-implement-command-based-undo":
		"collaboration",
	"design-patterns-in-java-project-practice-guide-supplemental-practice-project-refactor-a-mini-app-with-tests-before-and-after":
		"architecture"
};

export const javaStudioRevision = "863f2ba2ad2fe6c8c20681e3fdff6eeeb7170be9";
export const javaStudios = [
	{
		key: "strategy",
		title: "Strategy Selection Refactor",
		pack: "DPJ-Studio-Strategy-Selection-Packs",
		coreChecks: 12056,
		completeChecks: 12067,
		items: [
			"design-patterns-in-java-optional-applied-java-pattern-studios-supplemental-strategy-selection-refactor-core-concepts",
			"design-patterns-in-java-optional-applied-java-pattern-studios-supplemental-strategy-selection-refactor-guided-example",
			"design-patterns-in-java-optional-applied-java-pattern-studios-supplemental-core-project-strategy-selection-refactor",
			"design-patterns-in-java-optional-applied-java-pattern-studios-supplemental-review-strategy-selection-refactor",
			"design-patterns-in-java-optional-applied-java-pattern-studios-supplemental-extension-challenge-strategy-selection-refactor",
			"design-patterns-in-java-optional-applied-java-pattern-studios-supplemental-strategy-selection-refactor-transfer-practice",
			"design-patterns-in-java-optional-applied-java-pattern-studios-supplemental-strategy-selection-refactor-extension-practice"
		],
		files: {
			starter: [
				"ContractTests.java",
				"DECISIONS.md",
				"Main.java",
				"README.md",
				"sources.txt",
				"src/pricing/CartPricer.java",
				"src/pricing/Plan.java",
				"src/pricing/PricingRule.java",
				"src/pricing/legacy/LegacyPricer.java"
			],
			solution: [
				"ContractTests.java",
				"DECISIONS.md",
				"Main.java",
				"README.md",
				"sources.txt",
				"src/pricing/CartPricer.java",
				"src/pricing/Plan.java",
				"src/pricing/PricingRule.java",
				"src/pricing/legacy/LegacyPricer.java",
				"src/pricing/rules/BulkRule.java",
				"src/pricing/rules/FlatRule.java",
				"src/pricing/rules/MemberRule.java"
			]
		}
	},
	{
		key: "wrapper",
		title: "Structural Wrapper Refactor",
		pack: "DPJ-Studio-Structural-Wrapper-Packs",
		coreChecks: 820,
		completeChecks: 839,
		items: [
			"design-patterns-in-java-optional-applied-java-pattern-studios-supplemental-structural-wrapper-refactor-core-concepts",
			"design-patterns-in-java-optional-applied-java-pattern-studios-supplemental-structural-wrapper-refactor-guided-example",
			"design-patterns-in-java-optional-applied-java-pattern-studios-supplemental-core-project-structural-wrapper-refactor",
			"design-patterns-in-java-optional-applied-java-pattern-studios-supplemental-review-structural-wrapper-refactor",
			"design-patterns-in-java-optional-applied-java-pattern-studios-supplemental-extension-challenge-structural-wrapper-refactor",
			"design-patterns-in-java-optional-applied-java-pattern-studios-supplemental-structural-wrapper-refactor-transfer-practice",
			"design-patterns-in-java-optional-applied-java-pattern-studios-supplemental-structural-wrapper-refactor-extension-practice"
		],
		files: {
			starter: [
				"ContractTests.java",
				"DECISIONS.md",
				"Main.java",
				"README.md",
				"sources.txt",
				"src/wrapping/ReadDesk.java",
				"src/wrapping/Source.java",
				"src/wrapping/legacy/LegacyReader.java"
			],
			solution: [
				"ContractTests.java",
				"DECISIONS.md",
				"Main.java",
				"README.md",
				"sources.txt",
				"src/wrapping/ReadDesk.java",
				"src/wrapping/Source.java",
				"src/wrapping/layers/CacheSource.java",
				"src/wrapping/layers/CountingSource.java",
				"src/wrapping/layers/PrefixSource.java",
				"src/wrapping/layers/UpperSource.java",
				"src/wrapping/legacy/LegacyReader.java"
			]
		}
	},
	{
		key: "architecture",
		title: "Architecture Judgment Capstone",
		pack: "DPJ-Studio-Architecture-Judgment-Packs",
		coreChecks: 124,
		completeChecks: 141,
		items: [
			"design-patterns-in-java-optional-applied-java-pattern-studios-supplemental-architecture-judgment-capstone-core-concepts",
			"design-patterns-in-java-optional-applied-java-pattern-studios-supplemental-architecture-judgment-capstone-guided-example",
			"design-patterns-in-java-optional-applied-java-pattern-studios-supplemental-core-project-architecture-judgment-capstone",
			"design-patterns-in-java-optional-applied-java-pattern-studios-supplemental-review-architecture-judgment-capstone",
			"design-patterns-in-java-optional-applied-java-pattern-studios-supplemental-extension-challenge-architecture-judgment-capstone",
			"design-patterns-in-java-optional-applied-java-pattern-studios-supplemental-architecture-judgment-capstone-transfer-practice",
			"design-patterns-in-java-optional-applied-java-pattern-studios-supplemental-architecture-judgment-capstone-extension-practice"
		],
		files: {
			starter: [
				"ContractTests.java",
				"DECISIONS.md",
				"Main.java",
				"README.md",
				"sources.txt",
				"src/notebook/Composition.java",
				"src/notebook/NotebookDesk.java",
				"src/notebook/api/Action.java",
				"src/notebook/api/AuditSink.java",
				"src/notebook/api/Note.java",
				"src/notebook/api/Notebook.java",
				"src/notebook/legacy/LegacyNotebook.java"
			],
			solution: [
				"ArchitectureProbe.java",
				"ContractTests.java",
				"DECISIONS.md",
				"Main.java",
				"README.md",
				"sources.txt",
				"src/notebook/Composition.java",
				"src/notebook/api/Action.java",
				"src/notebook/api/AuditSink.java",
				"src/notebook/api/Note.java",
				"src/notebook/api/Notebook.java",
				"src/notebook/application/NotebookService.java",
				"src/notebook/legacy/LegacyNotebook.java",
				"src/notebook/memory/MemoryNotes.java",
				"src/notebook/ports/NoteRepository.java"
			]
		}
	}
] as const;
export type JavaStudioKey = (typeof javaStudios)[number]["key"];
export function javaStudioURL(
	key: JavaStudioKey,
	role: "starter" | "solution"
) {
	const studio = javaStudios.find(studio => studio.key === key)!;
	return `https://github.com/instruction-material/Java-Level-3/tree/${javaStudioRevision}/${studio.pack}/${role}`;
}
export function javaStudioResource(url: string) {
	const resource = parseGitHubResource(url);
	if (
		!resource ||
		resource.mode !== "tree" ||
		resource.owner.toLowerCase() !== "instruction-material" ||
		resource.repo.toLowerCase() !== "java-level-3" ||
		resource.ref !== javaStudioRevision
	) {
		return null;
	}
	const [pack, role, extra] = resource.path.split("/");
	const studio = javaStudios.find(studio => studio.pack === pack);
	if (
		!studio ||
		extra !== undefined ||
		(role !== "starter" && role !== "solution")
	) {
		return null;
	}
	return { resource, studio, role } as const;
}
export function javaStudioProjectKey(
	courseID: string,
	itemID: string,
	role: "starter" | "reference",
	url: string
) {
	const appendixFamily = javaPatternAppendixProjectFamily[itemID];
	const sourceRole = role === "starter" ? "starter" : "solution";
	if (courseID === "design-patterns-in-java") {
		if (
			appendixFamily === "collaboration" &&
			url === javaCollaborationURL(sourceRole)
		) {
			return javaCollaborationProjectKey(
				courseID,
				javaCollaborationCoreID,
				role,
				url
			);
		}
		if (
			appendixFamily === "creational" &&
			url === javaCreationalURL(sourceRole)
		) {
			return javaCreationalProjectKey(
				courseID,
				javaCreationalCoreID,
				role,
				url
			);
		}
	}
	const selected = javaStudioResource(url);
	if (
		!selected ||
		courseID !== "design-patterns-in-java" ||
		(!(selected.studio.items as readonly string[]).includes(itemID) &&
			appendixFamily !== selected.studio.key)
	) {
		return javaCapstoneProjectKey(courseID, itemID, role, url);
	}
	return [
		courseID,
		selected.studio.items[2],
		role,
		`native-java-studio-${selected.studio.key}`
	].join(":");
}
export function javaStudioImportFiles(url: string) {
	const selected = javaStudioResource(url);
	if (!selected) return null;
	return selected.studio.files[selected.role].map(name => {
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
export function javaStudioNativeInstructions(key?: string): string[] | null {
	const [course, item, role, extra, more] = (key ?? "").split(":");
	const studio = javaStudios.find(
		studio => extra === `native-java-studio-${studio.key}`
	);
	if (
		!studio ||
		more !== undefined ||
		course !== "design-patterns-in-java" ||
		item !== studio.items[2] ||
		!["starter", "reference"].includes(role ?? "")
	) {
		return null;
	}
	return [
		`Java 21 ${studio.title}`,
		"Export the complete role folder with its src packages, sources.txt and DECISIONS.md.",
		"javac --release 21 -Xlint:all -Werror -d classes @sources.txt",
		"java -cp classes ContractTests base",
		"java -cp classes ContractTests core",
		"java -cp classes Main base",
		"java -cp classes Main",
		`Core reports ${studio.coreChecks} passed. Both Main modes have the same documented output.`,
		"The starter already passes core. Refactor its structure and retain the decision record.",
		"After the optional extension: java -cp classes ContractTests",
		`The complete reference reports ${studio.completeChecks} passed; core remains independent of optional work.`,
		"These programs read no standard input. Run displays native Java 21 commands."
	];
}
