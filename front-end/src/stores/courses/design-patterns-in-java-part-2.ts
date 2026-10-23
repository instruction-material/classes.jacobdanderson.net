import type { ImplementationLabSection } from "./implementationLabGuidance";
import type { RawCourse, RawCourseModuleItem } from "./types";
import { buildImplementationLabGuidance } from "./implementationLabGuidance";
import { buildProjectGuidance } from "./projectGuidance";

const refactoringClinicContexts = {
	11: {
		focus: "feature envy, Extract Class, Move Method, object ownership, client impact, and tests that prove behavior stayed stable while responsibilities moved",
		artifact:
			"the source class that owns too much behavior, the extracted collaborator, the public method that clients still call, and the tests that compare before-and-after output",
		invariant:
			"the invariant that clients do not need to know which class now owns the moved behavior",
		exampleCase:
			"For **Refactoring Clinic 11**, trace one method that reads more data from another object than from its own class. Record the original call path, the data it uses, the extracted method or class boundary, and the test output before moving anything else.",
		boundaryCase:
			"Then check a case where the moved behavior depends on missing, empty, or unusual collaborator state so the new class boundary does not hide a broken invariant.",
		reviewEvidence:
			"Summarize which behavior moved, which class now owns the decision, what client code did not change, and what test or sample output proves the refactor preserved behavior."
	},
	12: {
		focus: "switch statements, Replace Conditional with Polymorphism, Strategy extraction, branch-specific tests, and evidence that each variant owns its rule instead of one method owning every case",
		artifact:
			"the original conditional hotspot, the replacement interface or superclass, the concrete variants, and the caller that selects or receives the right behavior",
		invariant:
			"the invariant that adding a new variant does not require editing the old branch-heavy method",
		exampleCase:
			"For **Refactoring Clinic 12**, trace one switch or if/else chain through two different branches with expected outputs. Refactor only one branch into a variant first, then compare the mixed state against the original behavior.",
		boundaryCase:
			"Then add an unknown, default, or unsupported case so the design has an explicit failure path rather than silently choosing the wrong subclass or strategy.",
		reviewEvidence:
			"Summarize the branch logic that became polymorphic, the remaining conditional logic if any, the tests for each variant, and the next variant that would be easiest to add."
	},
	13: {
		focus: "long parameter lists, Introduce Parameter Object, Preserve Whole Object, data clumps, validation boundaries, and tests that prove grouping values improved the API without changing results",
		artifact:
			"the original method signature, the new parameter object or preserved source object, validation rules, and the call sites that become simpler after the change",
		invariant:
			"the invariant that grouped data represents one coherent concept rather than a bag of unrelated values",
		exampleCase:
			"For **Refactoring Clinic 13**, choose one call with three or more related parameters and trace how those values travel through the method. Replace the group with a named object, then verify the same output with the old sample input.",
		boundaryCase:
			"Then test an incomplete or inconsistent parameter group so validation happens at a clear boundary instead of being scattered across the method body.",
		reviewEvidence:
			"Summarize which parameters belonged together, where validation now lives, how call sites changed, and whether the new object clarified or merely renamed the same complexity."
	},
	14: {
		focus: "temporary variables, Replace Temp with Query, Split Temporary Variable, calculation pipelines, readable names, and tests that prove each extracted query preserves the same computed value",
		artifact:
			"the original calculation method, the named query methods or split variables, the intermediate values worth checking, and a small expected-output table",
		invariant:
			"the invariant that each named step has one meaning and can be checked independently",
		exampleCase:
			"For **Refactoring Clinic 14**, trace a calculation with at least two intermediate values. Rename or split one temporary at a time, compare intermediate values, and only then extract a query method.",
		boundaryCase:
			"Then check zero, negative, maximum, or precision-sensitive input so the refactor does not accidentally change numeric behavior while improving readability.",
		reviewEvidence:
			"Summarize the before-and-after calculation path, the intermediate values that were verified, and one extraction that would be risky if done before the values were understood."
	},
	15: {
		focus: "duplicated workflows, Template Method, Strategy, hook methods, subclass responsibilities, and tests that prove shared algorithm structure is separated from variable steps",
		artifact:
			"the duplicated workflow methods, the common algorithm skeleton, the variable steps, and representative subclasses or strategies that exercise different behavior",
		invariant:
			"the invariant that shared workflow order stays fixed while individual steps can vary safely",
		exampleCase:
			"For **Refactoring Clinic 15**, compare two similar workflow methods and mark which lines are identical, which lines vary, and which order constraints matter. Extract the shared skeleton before introducing any new variation.",
		boundaryCase:
			"Then add a workflow variant with one missing or optional step so the design exposes whether Template Method hooks or Strategy objects communicate the variation more clearly.",
		reviewEvidence:
			"Summarize why Template Method or Strategy was chosen, which duplicate logic disappeared, what still varies, and which test proves the workflow order stayed correct."
	},
	16: {
		focus: "repeated null checks, Introduce Special Case, Null Object, Optional-return boundaries, default behavior, and tests that prove absence is handled intentionally rather than hidden",
		artifact:
			"the nullable collaborator or return value, the special-case object or explicit Optional boundary, default behavior, and callers that no longer repeat null checks",
		invariant:
			"the invariant that absent data has one explicit policy instead of several slightly different caller-side guesses",
		exampleCase:
			"For **Refactoring Clinic 16**, trace one normal object and one missing object through the same call path. Introduce a special case or explicit absence boundary, then verify both paths still produce deliberate output.",
		boundaryCase:
			"Then check a partially populated object so the design does not confuse a valid object with absent data or use Null Object to hide a data-quality problem.",
		reviewEvidence:
			"Summarize which null checks were removed, where absence is now represented, what default behavior is intentional, and what condition still fails loudly."
	},
	17: {
		focus: "multi-smell sequencing, characterization tests, commit-sized refactor steps, postponed changes, rollback points, and evidence that a refactor plan improves design without becoming a rewrite",
		artifact:
			"the original design-smell map, ordered refactor sequence, characterization tests, final class or method layout, and a short log of changes that were intentionally delayed",
		invariant:
			"the invariant that each step must leave the program runnable and easier to reason about than before",
		exampleCase:
			"For **Refactoring Clinic 17**, select a small legacy slice with at least two smells and write the sequence before editing. Complete one safe step, rerun the characterization checks, and decide whether the next planned step is still correct.",
		boundaryCase:
			"Then test a rollback or stop point by naming the first step that would be too large for one safe refactor and splitting it into smaller verified moves.",
		reviewEvidence:
			"Summarize the final sequence, the smell addressed by each step, the evidence after each checkpoint, and one improvement that was postponed because it belonged in a later refactor."
	}
} satisfies Record<
	number,
	NonNullable<Parameters<typeof buildImplementationLabGuidance>[0]["context"]>
>;

function buildRefactoringClinicGuidance(
	clinic: keyof typeof refactoringClinicContexts,
	section: ImplementationLabSection
) {
	return buildImplementationLabGuidance({
		courseFamily: "Java design patterns",
		moduleTitle: `Refactoring Clinic ${clinic}: Practice Studio`,
		section,
		context: refactoringClinicContexts[clinic]
	});
}

const designPatternsInJavaPart2SourceCourse: RawCourse = {
	name: "Design Patterns in Java Part 2: Refactoring",
	modules: [
		{
			title: "DPR1 Code Smells and Safe Refactoring Workflow",
			curriculum: [
				{
					title: "Refactoring as Behavior-Preserving Design Change",
					content:
						"Use Refactoring.Guru's framing that refactoring changes internal structure without changing externally visible behavior. Work in small steps with a safety net rather than attempting one heroic rewrite."
				},
				{
					title: "Code Smells from Refactoring.Guru",
					content:
						"Survey the smell families explicitly: bloaters such as Long Method, Large Class, Primitive Obsession, Long Parameter List, and Data Clumps; object-orientation abusers such as Alternative Classes with Different Interfaces, Refused Bequest, Switch Statements, and Temporary Field; change preventers such as Divergent Change, Parallel Inheritance Hierarchies, and Shotgun Surgery; dispensables such as Comments, Duplicate Code, Data Class, Dead Code, Lazy Class, and Speculative Generality; and couplers such as Feature Envy, Inappropriate Intimacy, Incomplete Library Class, Message Chains, and Middle Man. Use Java examples that require identifying the dominant smell instead of simply listing everything wrong."
				},
				{
					title: "Refactoring Workflow: Characterize, Slice, Verify",
					content:
						"A repeatable loop anchors the course: identify the smell, describe the desired improvement, isolate the smallest safe step, run tests or manual checks, and only then continue. Treat naming, extraction, and movement as tactical moves toward better architecture."
				},
				{
					title: "Worked Example Set: Smell Diagnosis Before Change",
					content:
						"Review several medium Java snippets and decide whether the dominant pressure is method size, misplaced behavior, bad conditionals, poor object boundaries, or unhealthy inheritance. This sets up the later modules by linking smells to the right category of refactorings."
				},
				{
					title: "Refactor Planning Studio",
					aliases: [
						"Mini Lab: Write the Refactor Plan Before Touching Code"
					],
					content:
						"Write a small staged plan naming the smell, the next one or two refactorings, and the expected benefit before editing. This prevents flailing and makes code review discussion more precise."
				},
				{
					title: "Reflection Question: What Makes a Refactor Reckless?",
					content:
						"Explain how a good refactor differs from a rewrite that merely hopes the new version will be better. A strong response mentions verification and change granularity explicitly."
				},
				{
					title: "DPR1 Code Smells and Safe Refactoring Workflow: Core Project",
					content: buildProjectGuidance({
						courseFamily: "Design Patterns in Java Part 2",
						moduleTitle:
							"DPR1 Code Smells and Safe Refactoring Workflow",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-08-dpr1-code-smells-and-safe-refactoring-workflow/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-08-dpr1-code-smells-and-safe-refactoring-workflow/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Diagnostic Checkpoint",
					content:
						"Readiness check: classify a smell before proposing a pattern or refactoring. Prompt: decide which is riskier: changing five things at once or committing a sequence of tiny safe improvements.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-08-dpr1-code-smells-and-safe-refactoring-workflow/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-08-dpr1-code-smells-and-safe-refactoring-workflow/solution"
				},
				{
					title: "Code Smells and Safe Refactoring Workflow Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "Design Patterns in Java Part 2",
						moduleTitle:
							"DPR1 Code Smells and Safe Refactoring Workflow",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-01-dpr1-code-smells-and-safe-refactoring-workflow-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-01-dpr1-code-smells-and-safe-refactoring-workflow-supplemental-2/solution"
				},
				{
					title: "Code Smells and Safe Refactoring Workflow Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "Design Patterns in Java Part 2",
						moduleTitle:
							"DPR1 Code Smells and Safe Refactoring Workflow",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-02-dpr1-code-smells-and-safe-refactoring-workflow-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-02-dpr1-code-smells-and-safe-refactoring-workflow-supplemental-3/solution"
				}
			]
		},
		{
			title: "DPR2 Composing Methods",
			curriculum: [
				{
					title: "Refactoring.Guru Category: Composing Methods",
					content:
						"Cover the full category directly: Extract Method, Inline Method, Extract Variable, Inline Temp, Replace Temp with Query, Split Temporary Variable, Remove Assignments to Parameters, Replace Method with Method Object, and Substitute Algorithm. Together, these are the core moves for taming Long Method and improving local readability."
				},
				{
					title: "Worked Example Set: Shrinking a Long Method",
					content:
						"Start with a dense Java method, then refactor it in very small steps using extraction, better local names, split temporaries, and algorithm replacement where the logic is overgrown. Many later architectural improvements begin here."
				},
				{
					title: "Method Object Versus Plain Extraction",
					content:
						"Explain when Replace Method with Method Object is justified: many local variables, multi-step computation, or logic that deserves its own collaborator. Compare it against simpler Extract Method work to avoid premature escalation."
				},
				{
					title: "Calculation Pipeline Refactor Studio",
					aliases: [
						"Mini Lab: Refactor a Calculation Pipeline Safely"
					],
					content:
						"Take a pricing, scoring, or report-generation method and refactor it into cleaner smaller steps without changing observable output. Document which composing-method moves were used."
				},
				{
					title: "Pattern Connection: Clear Methods Make Later Patterns Possible",
					content:
						"Strategy, Template Method, and Command become easier to introduce after method-level mess is removed. Patterns often fail when built on top of unreadable methods, so local clarity is part of architectural design rather than cosmetic cleanup."
				},
				{
					title: "Reflection Question: When Is Extraction Enough?",
					content:
						"Explain when smaller methods are enough and when a new class or pattern becomes justified. The answer references responsibility, not raw line count alone."
				},
				{
					title: "DPR2 Composing Methods: Core Project",
					content: buildProjectGuidance({
						courseFamily: "Design Patterns in Java Part 2",
						moduleTitle: "DPR2 Composing Methods",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-09-dpr2-composing-methods/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-09-dpr2-composing-methods/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Diagnostic Checkpoint",
					content:
						"Readiness check: pick the smallest composing-method refactor that improves clarity. Prompt: justify why Method Object is better than another Extract Method in the given case.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-09-dpr2-composing-methods/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-09-dpr2-composing-methods/solution"
				},
				{
					title: "Composing Methods Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "Design Patterns in Java Part 2",
						moduleTitle: "DPR2 Composing Methods",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-03-dpr2-composing-methods-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-03-dpr2-composing-methods-supplemental-2/solution"
				},
				{
					title: "Composing Methods Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "Design Patterns in Java Part 2",
						moduleTitle: "DPR2 Composing Methods",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-04-dpr2-composing-methods-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-04-dpr2-composing-methods-supplemental-3/solution"
				}
			]
		},
		{
			title: "DPR3 Moving Features Between Objects",
			curriculum: [
				{
					title: "Refactoring.Guru Category: Moving Features Between Objects",
					content:
						"Cover Move Method, Move Field, Extract Class, Inline Class, Hide Delegate, Remove Middle Man, Introduce Foreign Method, and Introduce Local Extension. Frame this category as the main response to Feature Envy, Large Class, and muddled collaboration boundaries."
				},
				{
					title: "Worked Example Set: Feature Envy and Large Class",
					content:
						"Start with Java classes that know too much about neighboring objects or accumulate unrelated fields and behaviors. Refactor by moving methods or fields to the real owner, then extract or inline classes only when the split becomes defensible."
				},
				{
					title: "Delegation Boundaries: Hide or Remove the Middle Man",
					content:
						"Hide Delegate and Remove Middle Man are best studied together because they reveal both sides of delegation exposure. The question is not whether delegation is good, but whether the current layer is clarifying or merely forwarding everything."
				},
				{
					title: "Local Extension and Foreign Method for Library Friction",
					content:
						"Use Introduce Foreign Method and Introduce Local Extension to handle awkward third-party or library types without polluting the rest of the codebase. This pairs naturally with Adapter and Facade from the first course."
				},
				{
					title: "Behavior Ownership Refactor Studio",
					aliases: [
						"Mini Lab: Re-home Behavior Without Breaking Clients"
					],
					content:
						"Take a collaboration tangle and move the logic to the objects that actually own the data and decision-making context. Track what client code becomes simpler after the move."
				},
				{
					title: "Reflection Question: Behavior Ownership",
					content:
						"Explain how to detect that a method belongs somewhere else. A good answer mentions what data the method leans on and which object's invariants it really serves."
				},
				{
					title: "DPR3 Moving Features Between Objects: Core Project",
					content: buildProjectGuidance({
						courseFamily: "Design Patterns in Java Part 2",
						moduleTitle: "DPR3 Moving Features Between Objects",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-10-dpr3-moving-features-between-objects/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-10-dpr3-moving-features-between-objects/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Diagnostic Checkpoint",
					content:
						"Readiness check: distinguish Extract Class from Move Method or Move Field. Prompt: decide whether a forwarding layer is clarifying a boundary or hiding nothing useful.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-10-dpr3-moving-features-between-objects/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-10-dpr3-moving-features-between-objects/solution"
				},
				{
					title: "Moving Features Between Objects Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "Design Patterns in Java Part 2",
						moduleTitle: "DPR3 Moving Features Between Objects",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-05-dpr3-moving-features-between-objects-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-05-dpr3-moving-features-between-objects-supplemental-2/solution"
				},
				{
					title: "Moving Features Between Objects Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "Design Patterns in Java Part 2",
						moduleTitle: "DPR3 Moving Features Between Objects",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-06-dpr3-moving-features-between-objects-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-06-dpr3-moving-features-between-objects-supplemental-3/solution"
				}
			]
		},
		{
			title: "DPR4 Organizing Data",
			curriculum: [
				{
					title: "Refactoring.Guru Category: Organizing Data",
					content:
						"Cover Self Encapsulate Field, Replace Data Value with Object, Change Value to Reference, Change Reference to Value, Replace Array with Object, Duplicate Observed Data, Change Unidirectional Association to Bidirectional, Change Bidirectional Association to Unidirectional, Replace Magic Number with Symbolic Constant, Encapsulate Field, Encapsulate Collection, Replace Type Code with Class, Replace Type Code with Subclasses, Replace Type Code with State/Strategy, and Replace Subclass with Fields. The category turns vague or primitive data into expressive, explicit, collaboration-friendly objects and APIs."
				},
				{
					title: "Worked Example Set: Primitive Obsession and Type Codes",
					content:
						"Refactor Java examples that overuse strings, ints, and arrays to represent concepts that deserve real types. Use value objects, symbolic constants, and State or Strategy where behavior is attached to the type code."
				},
				{
					title: "Associations, Encapsulation, and Collection Safety",
					content:
						"Field and collection encapsulation belong beside association direction changes because data design is API design. Good refactors make illegal states harder to represent."
				},
				{
					title: "Data Modeling Lab: Upgrade a Weak Domain Model",
					content:
						"Take a Java model made of primitives and loosely coordinated arrays or collections and evolve it into named objects with better boundaries. Justify every new type introduced."
				},
				{
					title: "Pattern Connection: State, Strategy, and Value Objects",
					content:
						"Connect organizing-data refactors back to patterns from the first course, especially Replace Type Code with State or Strategy. This shows how pattern choice often emerges naturally from better data representation."
				},
				{
					title: "Reflection Question: When Is a Primitive No Longer Good Enough?",
					content:
						"Explain what signs show that a string, int, or array has turned into a disguised domain concept. A strong response mentions validation rules, behavior, or repeated interpretation logic."
				},
				{
					title: "DPR4 Organizing Data: Core Project",
					content: buildProjectGuidance({
						courseFamily: "Design Patterns in Java Part 2",
						moduleTitle: "DPR4 Organizing Data",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-11-dpr4-organizing-data/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-11-dpr4-organizing-data/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Diagnostic Checkpoint",
					content:
						"Readiness check: name when Replace Type Code with Class is enough and when State or Strategy is the better move. Prompt: justify whether a collection is directly exposed or wrapped.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-11-dpr4-organizing-data/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-11-dpr4-organizing-data/solution"
				},
				{
					title: "Organizing Data Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "Design Patterns in Java Part 2",
						moduleTitle: "DPR4 Organizing Data",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-07-dpr4-organizing-data-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-07-dpr4-organizing-data-supplemental-2/solution"
				},
				{
					title: "Organizing Data Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "Design Patterns in Java Part 2",
						moduleTitle: "DPR4 Organizing Data",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-08-dpr4-organizing-data-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-08-dpr4-organizing-data-supplemental-3/solution"
				}
			]
		},
		{
			title: "DPR5 Simplifying Conditional Expressions",
			curriculum: [
				{
					title: "Refactoring.Guru Category: Simplifying Conditional Expressions",
					content:
						"Cover Decompose Conditional, Consolidate Conditional Expression, Consolidate Duplicate Conditional Fragments, Remove Control Flag, Replace Nested Conditional with Guard Clauses, Replace Conditional with Polymorphism, Introduce Null Object, and Introduce Assertion. Frame the category as a response to Switch Statements, complex branching, and unclear control flow."
				},
				{
					title: "Worked Example Set: From Nested Branching to Clear Flow",
					content:
						"Start with deeply nested Java conditionals and clean them in stages using guard clauses, decomposed intent-revealing methods, and consolidation where repetition hides the main logic. Only then consider polymorphism or Null Object when the branching pressure is truly role- or state-driven."
				},
				{
					title: "Replace Conditional with Polymorphism Versus Simpler Cleanup",
					content:
						"Reserve polymorphism for stable behavioral variation across types or states, not for every if-else chain. Compare this with Strategy and State from the first course."
				},
				{
					title: "Null Object and Assertion as Design Signals",
					content:
						"Use Introduce Null Object to remove repeated absence handling when a stable do-nothing implementation clarifies the design. Use assertions to document assumptions that fail loudly rather than becoming buried conditionals."
				},
				{
					title: "Conditional Tangle Refactor Studio",
					aliases: ["Mini Lab: Conditional Tangle Rescue"],
					content:
						"Take a Java policy engine or workflow method with nested flags and refactor it into clearer control flow, optionally ending in polymorphism where justified. Record which conditional refactors happened before any pattern was introduced."
				},
				{
					title: "Reflection Question: When Does a Conditional Signal a Missing Type?",
					content:
						"Explain when a conditional is just logic and when it reveals a deeper modeling problem. A strong response points to recurring variation, duplicated branches, or type-code-driven behavior."
				},
				{
					title: "DPR5 Simplifying Conditional Expressions: Core Project",
					content: buildProjectGuidance({
						courseFamily: "Design Patterns in Java Part 2",
						moduleTitle: "DPR5 Simplifying Conditional Expressions",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-12-dpr5-simplifying-conditional-expressions/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-12-dpr5-simplifying-conditional-expressions/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Diagnostic Checkpoint",
					content:
						"Readiness check: improve a conditional without defaulting immediately to polymorphism. Prompt: decide whether a null check repeated in ten places is a candidate for Null Object.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-12-dpr5-simplifying-conditional-expressions/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-12-dpr5-simplifying-conditional-expressions/solution"
				},
				{
					title: "Simplifying Conditional Expressions Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "Design Patterns in Java Part 2",
						moduleTitle: "DPR5 Simplifying Conditional Expressions",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-09-dpr5-simplifying-conditional-expressions-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-09-dpr5-simplifying-conditional-expressions-supplemental-2/solution"
				},
				{
					title: "Simplifying Conditional Expressions Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "Design Patterns in Java Part 2",
						moduleTitle: "DPR5 Simplifying Conditional Expressions",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-10-dpr5-simplifying-conditional-expressions-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-10-dpr5-simplifying-conditional-expressions-supplemental-3/solution"
				}
			]
		},
		{
			title: "DPR6 Simplifying Method Calls",
			curriculum: [
				{
					title: "Refactoring.Guru Category: Simplifying Method Calls",
					content:
						"Cover Rename Method, Add Parameter, Remove Parameter, Separate Query from Modifier, Parameterize Method, Introduce Parameter Object, Preserve Whole Object, Remove Setting Method, Replace Parameter with Explicit Methods, Replace Parameter with Method Call, Hide Method, Replace Constructor with Factory Method, Replace Error Code with Exception, and Replace Exception with Test. The category treats API cleanup as a design tool for clearer call sites, responsibilities, and object lifecycle."
				},
				{
					title: "Worked Example Set: Cleaning a Public API",
					content:
						"Refactor an awkward Java API by improving names, reducing parameter clutter, separating queries from state changes, and moving from raw constructor or error-code usage toward clearer intent. Use client readability as the main measurement."
				},
				{
					title: "Factory Method Reappears Through Refactoring",
					content:
						"Use Replace Constructor with Factory Method to show how refactoring techniques can lead directly into a design pattern. This is a good bridge between the first course and the second."
				},
				{
					title: "Exceptions, Preconditions, and API Shape",
					content:
						"Compare Replace Error Code with Exception and Replace Exception with Test to clarify when failure is exceptional and when a pre-check is the cleaner API. Connect this to Java method contracts and caller expectations."
				},
				{
					title: "Call-Site Noise Refactor Studio",
					aliases: [
						"Mini Lab: Reduce Call-Site Noise in a Service Layer"
					],
					content:
						"Take a Java service class with confusing calls and refactor it until the main use cases read clearly from the caller's perspective. Highlight which method-call simplifications improved the design most."
				},
				{
					title: "Reflection Question: What Makes a Call Site Honest?",
					content:
						"Explain when an API reveals intent and when it leaks too much internal detail. A strong response mentions naming, parameter shape, and side-effect clarity."
				},
				{
					title: "DPR6 Simplifying Method Calls: Core Project",
					content: buildProjectGuidance({
						courseFamily: "Design Patterns in Java Part 2",
						moduleTitle: "DPR6 Simplifying Method Calls",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-13-dpr6-simplifying-method-calls/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-13-dpr6-simplifying-method-calls/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Diagnostic Checkpoint",
					content:
						"Readiness check: choose between Introduce Parameter Object and Preserve Whole Object. Prompt: identify when a constructor becomes clearer as a factory method.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-13-dpr6-simplifying-method-calls/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-13-dpr6-simplifying-method-calls/solution"
				},
				{
					title: "Simplifying Method Calls Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "Design Patterns in Java Part 2",
						moduleTitle: "DPR6 Simplifying Method Calls",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-11-dpr6-simplifying-method-calls-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-11-dpr6-simplifying-method-calls-supplemental-2/solution"
				},
				{
					title: "Simplifying Method Calls Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "Design Patterns in Java Part 2",
						moduleTitle: "DPR6 Simplifying Method Calls",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-12-dpr6-simplifying-method-calls-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-12-dpr6-simplifying-method-calls-supplemental-3/solution"
				}
			]
		},
		{
			title: "DPR7 Dealing with Generalization",
			curriculum: [
				{
					title: "Refactoring.Guru Category: Dealing with Generalization",
					content:
						"Cover Pull Up Field, Pull Up Method, Pull Up Constructor Body, Push Down Field, Push Down Method, Extract Subclass, Extract Superclass, Extract Interface, Collapse Hierarchy, Form Template Method, Replace Inheritance with Delegation, and Replace Delegation with Inheritance. The category provides disciplined ways to reshape inheritance and abstraction once the real variation is understood."
				},
				{
					title: "Worked Example Set: Fixing a Bad Hierarchy",
					content:
						"Start from an inheritance tree with duplicated members, misplaced behavior, or a base class that no longer reflects reality. Refactor by pulling up, pushing down, collapsing, or extracting hierarchy elements only as warranted by the domain."
				},
				{
					title: "Template Method as a Refactoring Move",
					content:
						"Use Form Template Method to show how repeated algorithm structure in sibling classes can become a controlled inheritance abstraction. Compare that with replacing inheritance by delegation when subclassing has become the actual problem."
				},
				{
					title: "Delegation Versus Inheritance Revisited",
					content:
						"Replace Inheritance with Delegation and Replace Delegation with Inheritance belong together because they compare the forces honestly. Java design does not worship either one uncritically."
				},
				{
					title: "Parallel Hierarchy Refactor Studio",
					aliases: ["Mini Lab: Repair a Parallel Hierarchy"],
					content:
						"Take a Java design where hierarchy changes cascade across multiple class trees and simplify the abstraction story. Explain whether the final design is flatter, deeper, or simply cleaner."
				},
				{
					title: "Reflection Question: Which Abstraction Actually Earned Its Place?",
					content:
						"Identify a removed or collapsed abstraction and explain why it no longer served the model. A strong response distinguishes meaningful generalization from speculative generality."
				},
				{
					title: "DPR7 Dealing with Generalization: Core Project",
					content: buildProjectGuidance({
						courseFamily: "Design Patterns in Java Part 2",
						moduleTitle: "DPR7 Dealing with Generalization",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-14-dpr7-dealing-with-generalization/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-14-dpr7-dealing-with-generalization/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Diagnostic Checkpoint",
					content:
						"Readiness check: say when Extract Interface helps even if Extract Superclass would also compile. Prompt: explain why Collapse Hierarchy can be an improvement rather than a loss of sophistication.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-14-dpr7-dealing-with-generalization/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-14-dpr7-dealing-with-generalization/solution"
				},
				{
					title: "Dealing with Generalization Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "Design Patterns in Java Part 2",
						moduleTitle: "DPR7 Dealing with Generalization",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-13-dpr7-dealing-with-generalization-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-13-dpr7-dealing-with-generalization-supplemental-2/solution"
				},
				{
					title: "Dealing with Generalization Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "Design Patterns in Java Part 2",
						moduleTitle: "DPR7 Dealing with Generalization",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-14-dpr7-dealing-with-generalization-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-14-dpr7-dealing-with-generalization-supplemental-3/solution"
				}
			]
		},
		{
			title: "DPR8 Refactoring Toward Patterns",
			curriculum: [
				{
					title: "From Technique Catalog to Pattern Choice",
					content:
						"Refactoring techniques often pave the road into patterns instead of requiring a direct jump into pattern vocabulary. Include examples such as Replace Constructor with Factory Method toward Factory Method, Replace Type Code with State or Strategy toward State or Strategy, Replace Conditional with Polymorphism toward Strategy or State, and Form Template Method toward Template Method."
				},
				{
					title: "Pattern Entry Paths from Refactoring.Guru",
					content:
						"Common refactoring journeys include Extract Method plus Move Method plus Extract Class toward clearer collaborators; Hide Delegate and Facade toward subsystem simplification; Introduce Local Extension plus Adapter toward boundary cleanup; and command-history refactors toward Command and Memento. The pattern appears as the result of a sequence, not as the first move."
				},
				{
					title: "Worked Example Set: One Smell, Several Possible Destinations",
					content:
						"Take one Java design problem and show more than one plausible refactoring path, such as guard clauses only, Strategy, or State. This makes good design contextual and falsifiable instead of presenting a single pattern as automatically correct."
				},
				{
					title: "Smell-to-Pattern Refactor Studio",
					aliases: [
						"Mini Lab: Refactor Until the Pattern Is Obvious"
					],
					content:
						"Stop after each small change and ask whether the named pattern is now justified or still premature. This builds restraint and sequence awareness."
				},
				{
					title: "Tradeoff Review: Pattern Arrival Versus Pattern Forcing",
					content:
						"Discovering a stable abstraction through refactoring is different from forcing a catalog pattern because it seems advanced. Use before-and-after change scenarios as the arbiter."
				},
				{
					title: "Reflection Question: Which Step Made the Biggest Difference?",
					content:
						"Compare whether the biggest improvement came from the named pattern or from one of the smaller refactoring steps leading up to it. A strong answer often recognizes that the pattern only worked because the groundwork was done first."
				},
				{
					title: "DPR8 Refactoring Toward Patterns: Core Project",
					content: buildProjectGuidance({
						courseFamily: "Design Patterns in Java Part 2",
						moduleTitle: "DPR8 Refactoring Toward Patterns",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-15-dpr8-refactoring-toward-patterns/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-15-dpr8-refactoring-toward-patterns/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Diagnostic Checkpoint",
					content:
						"Readiness check: narrate a multi-step path from smell to pattern without skipping the intermediate refactors. Prompt: decide whether every switch statement needs polymorphism.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-15-dpr8-refactoring-toward-patterns/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-15-dpr8-refactoring-toward-patterns/solution"
				},
				{
					title: "Refactoring Toward Patterns Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "Design Patterns in Java Part 2",
						moduleTitle: "DPR8 Refactoring Toward Patterns",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-15-dpr8-refactoring-toward-patterns-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-15-dpr8-refactoring-toward-patterns-supplemental-2/solution"
				},
				{
					title: "Refactoring Toward Patterns Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "Design Patterns in Java Part 2",
						moduleTitle: "DPR8 Refactoring Toward Patterns",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-16-dpr8-refactoring-toward-patterns-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-16-dpr8-refactoring-toward-patterns-supplemental-3/solution"
				}
			]
		},
		{
			title: "DPR9 Testability, DI, and Refactoring with Confidence",
			curriculum: [
				{
					title: "Tests as Refactoring Safety Nets",
					content:
						"Use tests, approval checks, or explicit manual verification scripts as safety nets during refactoring. The point is confidence in behavior preservation, not maximal test theory."
				},
				{
					title: "Dependency Injection for Refactoring Seams",
					content:
						"Use constructor injection, interface seams, and simple fakes to isolate dependencies while reshaping a design. DI here is a refactoring enabler first and a framework topic second."
				},
				{
					title: "Worked Example Set: Make a Hard-to-Test Class Refactorable",
					content:
						"Start with a class bound to time, I O, random generation, or global state and introduce seams that allow safe small changes. Connect this directly back to Singleton skepticism and public API cleanup."
				},
				{
					title: "Characterization Test Refactor Studio",
					aliases: [
						"Mini Lab: Characterization Test then Structural Change"
					],
					content:
						"Write or simulate a small set of characterization checks on brittle Java code, then perform a planned refactor while preserving the observable behavior. Visible pattern: The emotional difference between refactoring blind and refactoring with a safety net."
				},
				{
					title: "Design Review: Refactoring Pace and Reviewability",
					content:
						"Package refactors into readable commits or change sets rather than one giant diff. Smaller reviewed steps keep the work maintainable for teams and future maintenance."
				},
				{
					title: "Reflection Question: What Let You Move Faster Safely?",
					content:
						"Name the exact seam, test, or dependency change that reduced refactoring risk the most. A strong response connects confidence to design structure, not luck."
				},
				{
					title: "DPR9 Testability, DI, and Refactoring with Confidence: Core Project",
					content: buildProjectGuidance({
						courseFamily: "Design Patterns in Java Part 2",
						moduleTitle:
							"DPR9 Testability, DI, and Refactoring with Confidence",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-16-dpr9-testability-di-and-refactoring-with-confidence/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-16-dpr9-testability-di-and-refactoring-with-confidence/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Diagnostic Checkpoint",
					content:
						"Readiness check: explain why DI improves refactorability even without a framework container. Prompt: identify what kind of test is sufficient before a small structural change.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-16-dpr9-testability-di-and-refactoring-with-confidence/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-16-dpr9-testability-di-and-refactoring-with-confidence/solution"
				},
				{
					title: "Testability, DI, and Refactoring with Confidence Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "Design Patterns in Java Part 2",
						moduleTitle:
							"DPR9 Testability, DI, and Refactoring with Confidence",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-17-dpr9-testability-di-and-refactoring-with-confidence-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-17-dpr9-testability-di-and-refactoring-with-confidence-supplemental-2/solution"
				},
				{
					title: "Testability, DI, and Refactoring with Confidence Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "Design Patterns in Java Part 2",
						moduleTitle:
							"DPR9 Testability, DI, and Refactoring with Confidence",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-18-dpr9-testability-di-and-refactoring-with-confidence-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-18-dpr9-testability-di-and-refactoring-with-confidence-supplemental-3/solution"
				}
			]
		},
		{
			title: "DPR10 Capstone Refactoring Studio",
			curriculum: [
				{
					title: "Capstone Launch: Choose a Messy but Salvageable Java App",
					content:
						"Pick a medium Java codebase with real smells, awkward APIs, poor boundaries, or inheritance trouble. The best capstone begins from code that is ugly enough to matter but stable enough to rescue."
				},
				{
					title: "Diagnosis Pass: Smells, Risks, and Refactor Sequence",
					content:
						"List the main smell categories present, the behavior that must stay unchanged, and the ordered refactoring steps planned. Name both the technique categories and any patterns they expect to emerge."
				},
				{
					title: "Execution Pass: Small Safe Transformations",
					content:
						"Perform the refactor as a sequence of readable changes rather than a single giant rewrite. Include validation after each meaningful stage."
				},
				{
					title: "Pattern Arrival Review",
					content:
						"Identify which patterns genuinely emerged in the final design and which remained unnecessary. This is where the two-course sequence converges into one coherent design mindset."
				},
				{
					title: "Final Architecture Review",
					content:
						"Evaluate the codebase in terms of smell reduction, package clarity, collaboration boundaries, and changeability. Explain the next improvement they would make only if the project continued."
				},
				{
					title: "Capstone Reflection: From Catalog Knowledge to Judgment",
					content:
						"Close the course by documenting which Refactoring.Guru techniques mattered most in practice and which pattern introductions truly paid off. The final goal is design judgment, not catalog recitation."
				},
				{
					title: "DPR10 Capstone Refactoring Studio: Core Project",
					content: buildProjectGuidance({
						courseFamily: "Design Patterns in Java Part 2",
						moduleTitle: "DPR10 Capstone Refactoring Studio",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-17-dpr10-capstone-refactoring-studio/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-17-dpr10-capstone-refactoring-studio/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Diagnostic Checkpoint",
					content:
						"Readiness check: explain the refactor sequence in terms of risk reduction as well as final architecture. Prompt: name which proposed change was intentionally postponed and why.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-17-dpr10-capstone-refactoring-studio/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-17-dpr10-capstone-refactoring-studio/solution"
				},
				{
					title: "Capstone Refactoring Studio Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "Design Patterns in Java Part 2",
						moduleTitle: "DPR10 Capstone Refactoring Studio",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-19-dpr10-capstone-refactoring-studio-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-19-dpr10-capstone-refactoring-studio-supplemental-2/solution"
				},
				{
					title: "Capstone Refactoring Studio Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "Design Patterns in Java Part 2",
						moduleTitle: "DPR10 Capstone Refactoring Studio",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-20-dpr10-capstone-refactoring-studio-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-20-dpr10-capstone-refactoring-studio-supplemental-3/solution"
				}
			]
		},
		{
			title: "Refactoring Clinic 11: Practice Studio",
			curriculum: [
				{
					title: "Refactoring Clinic 11: Core Concepts",
					content: buildRefactoringClinicGuidance(11, "concepts")
				},
				{
					title: "Refactoring Clinic 11: Guided Example",
					content: buildRefactoringClinicGuidance(11, "example")
				},
				{
					title: "Refactoring Clinic 11: Core Project",
					content: buildRefactoringClinicGuidance(11, "coreProject"),
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-01-refactoring-clinic-11/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-01-refactoring-clinic-11/solution"
				},
				{
					title: "Refactoring Clinic 11: Review and Reflection",
					content: buildRefactoringClinicGuidance(11, "review")
				}
			],
			supplementalProjects: [
				{
					title: "Refactoring Clinic 11: Extension Challenge",
					content: buildRefactoringClinicGuidance(11, "extension"),
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-01-refactoring-clinic-11/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-01-refactoring-clinic-11/solution"
				},
				{
					title: "Refactoring Clinic 11 Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "Design Patterns in Java Part 2",
						moduleTitle: "Refactoring Clinic 11: Practice Studio",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-21-applied-studio-11-refactoring-clinic-11-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-21-applied-studio-11-refactoring-clinic-11-supplemental-2/solution"
				},
				{
					title: "Refactoring Clinic 11 Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "Design Patterns in Java Part 2",
						moduleTitle: "Refactoring Clinic 11: Practice Studio",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-22-applied-studio-11-refactoring-clinic-11-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-22-applied-studio-11-refactoring-clinic-11-supplemental-3/solution"
				}
			]
		},
		{
			title: "Refactoring Clinic 12: Practice Studio",
			curriculum: [
				{
					title: "Refactoring Clinic 12: Core Concepts",
					content: buildRefactoringClinicGuidance(12, "concepts")
				},
				{
					title: "Refactoring Clinic 12: Guided Example",
					content: buildRefactoringClinicGuidance(12, "example")
				},
				{
					title: "Refactoring Clinic 12: Core Project",
					content: buildRefactoringClinicGuidance(12, "coreProject"),
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-02-refactoring-clinic-12/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-02-refactoring-clinic-12/solution"
				},
				{
					title: "Refactoring Clinic 12: Review and Reflection",
					content: buildRefactoringClinicGuidance(12, "review")
				}
			],
			supplementalProjects: [
				{
					title: "Refactoring Clinic 12: Extension Challenge",
					content: buildRefactoringClinicGuidance(12, "extension"),
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-02-refactoring-clinic-12/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-02-refactoring-clinic-12/solution"
				},
				{
					title: "Refactoring Clinic 12 Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "Design Patterns in Java Part 2",
						moduleTitle: "Refactoring Clinic 12: Practice Studio",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-23-applied-studio-12-refactoring-clinic-12-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-23-applied-studio-12-refactoring-clinic-12-supplemental-2/solution"
				},
				{
					title: "Refactoring Clinic 12 Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "Design Patterns in Java Part 2",
						moduleTitle: "Refactoring Clinic 12: Practice Studio",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-24-applied-studio-12-refactoring-clinic-12-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-24-applied-studio-12-refactoring-clinic-12-supplemental-3/solution"
				}
			]
		},
		{
			title: "Refactoring Clinic 13: Practice Studio",
			curriculum: [
				{
					title: "Refactoring Clinic 13: Core Concepts",
					content: buildRefactoringClinicGuidance(13, "concepts")
				},
				{
					title: "Refactoring Clinic 13: Guided Example",
					content: buildRefactoringClinicGuidance(13, "example")
				},
				{
					title: "Refactoring Clinic 13: Core Project",
					content: buildRefactoringClinicGuidance(13, "coreProject"),
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-03-refactoring-clinic-13/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-03-refactoring-clinic-13/solution"
				},
				{
					title: "Refactoring Clinic 13: Review and Reflection",
					content: buildRefactoringClinicGuidance(13, "review")
				}
			],
			supplementalProjects: [
				{
					title: "Refactoring Clinic 13: Extension Challenge",
					content: buildRefactoringClinicGuidance(13, "extension"),
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-03-refactoring-clinic-13/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-03-refactoring-clinic-13/solution"
				},
				{
					title: "Refactoring Clinic 13 Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "Design Patterns in Java Part 2",
						moduleTitle: "Refactoring Clinic 13: Practice Studio",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-25-applied-studio-13-refactoring-clinic-13-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-25-applied-studio-13-refactoring-clinic-13-supplemental-2/solution"
				},
				{
					title: "Refactoring Clinic 13 Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "Design Patterns in Java Part 2",
						moduleTitle: "Refactoring Clinic 13: Practice Studio",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-26-applied-studio-13-refactoring-clinic-13-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-26-applied-studio-13-refactoring-clinic-13-supplemental-3/solution"
				}
			]
		},
		{
			title: "Refactoring Clinic 14: Practice Studio",
			curriculum: [
				{
					title: "Refactoring Clinic 14: Core Concepts",
					content: buildRefactoringClinicGuidance(14, "concepts")
				},
				{
					title: "Refactoring Clinic 14: Guided Example",
					content: buildRefactoringClinicGuidance(14, "example")
				},
				{
					title: "Refactoring Clinic 14: Core Project",
					content: buildRefactoringClinicGuidance(14, "coreProject"),
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-04-refactoring-clinic-14/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-04-refactoring-clinic-14/solution"
				},
				{
					title: "Refactoring Clinic 14: Review and Reflection",
					content: buildRefactoringClinicGuidance(14, "review")
				}
			],
			supplementalProjects: [
				{
					title: "Refactoring Clinic 14: Extension Challenge",
					content: buildRefactoringClinicGuidance(14, "extension"),
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-04-refactoring-clinic-14/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-04-refactoring-clinic-14/solution"
				},
				{
					title: "Refactoring Clinic 14 Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "Design Patterns in Java Part 2",
						moduleTitle: "Refactoring Clinic 14: Practice Studio",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-27-applied-studio-14-refactoring-clinic-14-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-27-applied-studio-14-refactoring-clinic-14-supplemental-2/solution"
				},
				{
					title: "Refactoring Clinic 14 Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "Design Patterns in Java Part 2",
						moduleTitle: "Refactoring Clinic 14: Practice Studio",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-28-applied-studio-14-refactoring-clinic-14-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-28-applied-studio-14-refactoring-clinic-14-supplemental-3/solution"
				}
			]
		},
		{
			title: "Refactoring Clinic 15: Practice Studio",
			curriculum: [
				{
					title: "Refactoring Clinic 15: Core Concepts",
					content: buildRefactoringClinicGuidance(15, "concepts")
				},
				{
					title: "Refactoring Clinic 15: Guided Example",
					content: buildRefactoringClinicGuidance(15, "example")
				},
				{
					title: "Refactoring Clinic 15: Core Project",
					content: buildRefactoringClinicGuidance(15, "coreProject"),
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-05-refactoring-clinic-15/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-05-refactoring-clinic-15/solution"
				},
				{
					title: "Refactoring Clinic 15: Review and Reflection",
					content: buildRefactoringClinicGuidance(15, "review")
				}
			],
			supplementalProjects: [
				{
					title: "Refactoring Clinic 15: Extension Challenge",
					content: buildRefactoringClinicGuidance(15, "extension"),
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-05-refactoring-clinic-15/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-05-refactoring-clinic-15/solution"
				},
				{
					title: "Refactoring Clinic 15 Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "Design Patterns in Java Part 2",
						moduleTitle: "Refactoring Clinic 15: Practice Studio",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-29-applied-studio-15-refactoring-clinic-15-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-29-applied-studio-15-refactoring-clinic-15-supplemental-2/solution"
				},
				{
					title: "Refactoring Clinic 15 Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "Design Patterns in Java Part 2",
						moduleTitle: "Refactoring Clinic 15: Practice Studio",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-30-applied-studio-15-refactoring-clinic-15-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-30-applied-studio-15-refactoring-clinic-15-supplemental-3/solution"
				}
			]
		},
		{
			title: "Refactoring Clinic 16: Practice Studio",
			curriculum: [
				{
					title: "Refactoring Clinic 16: Core Concepts",
					content: buildRefactoringClinicGuidance(16, "concepts")
				},
				{
					title: "Refactoring Clinic 16: Guided Example",
					content: buildRefactoringClinicGuidance(16, "example")
				},
				{
					title: "Refactoring Clinic 16: Core Project",
					content: buildRefactoringClinicGuidance(16, "coreProject"),
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-06-refactoring-clinic-16/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-06-refactoring-clinic-16/solution"
				},
				{
					title: "Refactoring Clinic 16: Review and Reflection",
					content: buildRefactoringClinicGuidance(16, "review")
				}
			],
			supplementalProjects: [
				{
					title: "Refactoring Clinic 16: Extension Challenge",
					content: buildRefactoringClinicGuidance(16, "extension"),
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-06-refactoring-clinic-16/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-06-refactoring-clinic-16/solution"
				},
				{
					title: "Refactoring Clinic 16 Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "Design Patterns in Java Part 2",
						moduleTitle: "Refactoring Clinic 16: Practice Studio",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-31-applied-studio-16-refactoring-clinic-16-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-31-applied-studio-16-refactoring-clinic-16-supplemental-2/solution"
				},
				{
					title: "Refactoring Clinic 16 Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "Design Patterns in Java Part 2",
						moduleTitle: "Refactoring Clinic 16: Practice Studio",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-32-applied-studio-16-refactoring-clinic-16-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-32-applied-studio-16-refactoring-clinic-16-supplemental-3/solution"
				}
			]
		},
		{
			title: "Refactoring Clinic 17: Practice Studio",
			curriculum: [
				{
					title: "Refactoring Clinic 17: Core Concepts",
					content: buildRefactoringClinicGuidance(17, "concepts")
				},
				{
					title: "Refactoring Clinic 17: Guided Example",
					content: buildRefactoringClinicGuidance(17, "example")
				},
				{
					title: "Refactoring Clinic 17: Core Project",
					content: buildRefactoringClinicGuidance(17, "coreProject"),
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-07-refactoring-clinic-17/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-07-refactoring-clinic-17/solution"
				},
				{
					title: "Refactoring Clinic 17: Review and Reflection",
					content: buildRefactoringClinicGuidance(17, "review")
				}
			],
			supplementalProjects: [
				{
					title: "Refactoring Clinic 17: Extension Challenge",
					content: buildRefactoringClinicGuidance(17, "extension"),
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-07-refactoring-clinic-17/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-07-refactoring-clinic-17/solution"
				},
				{
					title: "Refactoring Clinic 17 Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "Design Patterns in Java Part 2",
						moduleTitle: "Refactoring Clinic 17: Practice Studio",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-33-applied-studio-17-refactoring-clinic-17-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-33-applied-studio-17-refactoring-clinic-17-supplemental-2/solution"
				},
				{
					title: "Refactoring Clinic 17 Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "Design Patterns in Java Part 2",
						moduleTitle: "Refactoring Clinic 17: Practice Studio",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-34-applied-studio-17-refactoring-clinic-17-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPR-34-applied-studio-17-refactoring-clinic-17-supplemental-3/solution"
				}
			]
		}
	]
};

const DESIGN_PATTERNS_JAVA_PART_2_JUNIT =
	"https://docs.junit.org/current/user-guide/";
const DESIGN_PATTERNS_JAVA_PART_2_RECORDS =
	"https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/lang/Record.html";
const DESIGN_PATTERNS_JAVA_PART_2_OPTIONAL =
	"https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/util/Optional.html";
const DESIGN_PATTERNS_JAVA_PART_2_COMPATIBILITY =
	"https://docs.oracle.com/javase/specs/jls/se25/html/jls-13.html";

const DESIGN_PATTERNS_JAVA_PART_2_PRIMARY_TITLES = new Set([
	"DPR1 Code Smells and Safe Refactoring Workflow",
	"DPR2 Composing Methods",
	"DPR3 Moving Features Between Objects",
	"DPR4 Organizing Data",
	"DPR5 Simplifying Conditional Expressions",
	"DPR6 Simplifying Method Calls",
	"DPR7 Dealing with Generalization",
	"DPR8 Refactoring Toward Patterns",
	"DPR9 Testability, DI, and Refactoring with Confidence",
	"DPR10 Capstone Refactoring Studio"
]);

const DESIGN_PATTERNS_JAVA_PART_2_FLOW: Record<
	string,
	{
		estimatedTime: string;
		keyBlocks: string[];
		flowNote: string;
	}
> = {
	"DPR1 Code Smells and Safe Refactoring Workflow": {
		estimatedTime: "5 sessions · 60–90 minutes each",
		keyBlocks: [
			"change classification",
			"smell diagnosis",
			"behavior inventory",
			"characterization baseline",
			"reversible commit",
			"stop condition"
		],
		flowNote:
			"Classify the requested change, inventory observable behavior, create a green characterization baseline, diagnose one dominant smell, and plan a sequence in which every commit remains runnable and reversible."
	},
	"DPR2 Composing Methods": {
		estimatedTime: "5 sessions · 60–90 minutes each",
		keyBlocks: [
			"Extract Method",
			"temporary variables",
			"evaluation order",
			"side effects",
			"exception behavior",
			"local equivalence"
		],
		flowNote:
			"Use the smallest method-level transformation that clarifies intent while preserving evaluation order, side effects, exceptions, numeric behavior, and the exact public result."
	},
	"DPR3 Moving Features Between Objects": {
		estimatedTime: "5 sessions · 60–90 minutes each",
		keyBlocks: [
			"feature envy",
			"responsibility ownership",
			"Extract Class",
			"Move Method",
			"client compatibility",
			"dependency direction"
		],
		flowNote:
			"Move behavior toward the data and invariant it owns, preserve the client-facing collaboration, and verify that the new dependency direction reduces rather than relocates coupling."
	},
	"DPR4 Organizing Data": {
		estimatedTime: "6 sessions · 60–90 minutes each",
		keyBlocks: [
			"value semantics",
			"record and parameter object",
			"collection ownership",
			"equals and hashCode",
			"validation boundary",
			"data compatibility"
		],
		flowNote:
			"Replace primitive and mutable data clumps with explicit value concepts, preserve equality and collection ownership, and migrate callers without silently changing validation or serialized form."
	},
	"DPR5 Simplifying Conditional Expressions": {
		estimatedTime: "5 sessions · 60–90 minutes each",
		keyBlocks: [
			"decision table",
			"guard clause",
			"decomposition",
			"polymorphism threshold",
			"null policy",
			"branch equivalence"
		],
		flowNote:
			"Capture every branch in a decision table, simplify control flow before adding types, and prove that guard clauses, decomposition, special cases, or polymorphism preserve each supported and failure path."
	},
	"DPR6 Simplifying Method Calls": {
		estimatedTime: "6 sessions · 60–90 minutes each",
		keyBlocks: [
			"honest API",
			"source compatibility",
			"exception contract",
			"null and Optional",
			"call-site migration",
			"deprecation path"
		],
		flowNote:
			"Improve method and object APIs while preserving or deliberately migrating call sites, return and exception contracts, nullability, overload resolution, and externally visible compatibility."
	},
	"DPR7 Dealing with Generalization": {
		estimatedTime: "5 sessions · 60–90 minutes each",
		keyBlocks: [
			"substitutability",
			"inheritance pressure",
			"pull up and push down",
			"Template Method",
			"delegation",
			"hierarchy exit"
		],
		flowNote:
			"Test substitutability before moving members through a hierarchy, keep shared contracts honest, and replace inheritance with delegation when variation or ownership no longer fits one family."
	},
	"DPR8 Refactoring Toward Patterns": {
		estimatedTime: "5 sessions · 60–100 minutes each",
		keyBlocks: [
			"pattern entry path",
			"small transformations",
			"design pressure",
			"simpler destination",
			"pattern evidence",
			"pattern removal"
		],
		flowNote:
			"Let a pattern emerge from a sequence of justified transformations, compare it with a simpler destination, and retain the named pattern only when the original change pressure measurably improves."
	},
	"DPR9 Testability, DI, and Refactoring with Confidence": {
		estimatedTime: "6 sessions · 60–100 minutes each",
		keyBlocks: [
			"legacy seam",
			"clock and randomness",
			"file and network effects",
			"dependency injection",
			"characterization quality",
			"negative path"
		],
		flowNote:
			"Create seams around nondeterminism and external effects, write focused characterization tests that can fail for the right reason, and use dependency injection to make behavior observable before structural change."
	},
	"DPR10 Capstone Refactoring Studio": {
		estimatedTime: "8–12 sessions · 60–120 minutes each",
		keyBlocks: [
			"baseline tag",
			"change ledger",
			"commit-sized sequence",
			"rollback point",
			"before-and-after evidence",
			"remaining risk"
		],
		flowNote:
			"Refactor one salvageable Java application through a recorded sequence of green commits, stop when evidence becomes ambiguous, and present behavior, design, compatibility, and rollback evidence rather than a polished rewrite alone."
	}
};

function designPatternsJavaPart2OptionPath(title: string) {
	return /extension|clinic 1[5-7]/i.test(title)
		? ("challenge" as const)
		: ("choice" as const);
}

function insertDesignPatternsJavaPart2Item(
	items: RawCourseModuleItem[],
	beforeTitle: string,
	item: RawCourseModuleItem
) {
	const index = items.findIndex(candidate => candidate.title === beforeTitle);
	if (index === -1) return [...items, item];
	return [...items.slice(0, index), item, ...items.slice(index)];
}

function decorateDesignPatternsJavaPart2Module(
	module: RawCourse["modules"][number]
): RawCourse["modules"][number] {
	const flow = DESIGN_PATTERNS_JAVA_PART_2_FLOW[module.title];
	let curriculum: RawCourseModuleItem[] = module.curriculum.map(item => ({
		...item,
		learningPath: "core" as const
	}));
	const coreProjectTitle = curriculum.at(-1)?.title ?? "";

	if (module.title === "DPR1 Code Smells and Safe Refactoring Workflow") {
		curriculum = insertDesignPatternsJavaPart2Item(
			curriculum,
			coreProjectTitle,
			{
				title: "Refactor, Bug Fix, Feature, or Performance Change?",
				content: [
					"Classify the task before editing. A refactor preserves externally observable behavior; a bug fix intentionally changes incorrect behavior; a feature adds behavior; and a performance change preserves results while changing a measured resource property.",
					"",
					"Keep these change types in separate commits whenever practical. If a failing characterization test exposes an existing defect, record the current output first, obtain an explicit new expectation, and review the behavior change separately from structural cleanup."
				].join("\n"),
				projectLink: DESIGN_PATTERNS_JAVA_PART_2_JUNIT,
				learningPath: "core"
			}
		);
		curriculum = insertDesignPatternsJavaPart2Item(
			curriculum,
			coreProjectTitle,
			{
				title: "Behavior Inventory and Reversible Commit Contract",
				content: [
					"Inventory return values, output text, exceptions, state changes, file or network effects, ordering, timing-sensitive contracts, and public API shape. Add characterization coverage for the normal path and at least one edge or failure path.",
					"",
					"Commit the green baseline. Perform one named transformation per commit, rerun the focused tests, inspect the diff, and stop when the failure cannot be explained or the next step cannot be rolled back independently."
				].join("\n"),
				projectLink: DESIGN_PATTERNS_JAVA_PART_2_JUNIT,
				learningPath: "core"
			}
		);
	}

	if (module.title === "DPR2 Composing Methods") {
		curriculum = insertDesignPatternsJavaPart2Item(
			curriculum,
			coreProjectTitle,
			{
				title: "Extraction Semantic-Preservation Contract",
				content: [
					"Before Extract Method, Replace Temp with Query, or Substitute Algorithm, trace evaluation order, repeated calls, mutation, exceptions, short-circuiting, numeric conversion, and object identity.",
					"",
					"Use a table of inputs, intermediate values, outputs, and thrown exceptions. A cleaner method body is not equivalent if an extracted query runs twice, a side effect moves, precision changes, or an exception occurs at a different observable point."
				].join("\n"),
				projectLink: DESIGN_PATTERNS_JAVA_PART_2_JUNIT,
				learningPath: "core"
			}
		);
	}

	if (module.title === "DPR3 Moving Features Between Objects") {
		curriculum = insertDesignPatternsJavaPart2Item(
			curriculum,
			coreProjectTitle,
			{
				title: "Ownership Move and Client-Compatibility Contract",
				content: [
					"Name the invariant and data that justify the new owner. Move one method or field at a time, keep the original entry point as a temporary delegating bridge, and migrate callers only after both direct and delegated paths are covered.",
					"",
					"Compare package dependencies, constructor dependencies, public methods, and files touched by one realistic change before and after. Reject a move that merely creates a message chain or exposes another object's internals."
				].join("\n"),
				projectLink: DESIGN_PATTERNS_JAVA_PART_2_JUNIT,
				learningPath: "core"
			}
		);
	}

	if (module.title === "DPR4 Organizing Data") {
		curriculum = insertDesignPatternsJavaPart2Item(
			curriculum,
			coreProjectTitle,
			{
				title: "Value Semantics and Collection Ownership",
				content: [
					"Define identity versus value equality before replacing primitives or data clumps. Keep `equals` and `hashCode` consistent, decide whether ordering participates in equality, and test map or set behavior after the change.",
					"",
					"Use a record for a shallowly immutable transparent carrier when that contract fits. Copy mutable inputs and outputs or expose unmodifiable views according to one explicit collection-ownership policy."
				].join("\n"),
				projectLink: DESIGN_PATTERNS_JAVA_PART_2_RECORDS,
				learningPath: "core"
			}
		);
		curriculum = insertDesignPatternsJavaPart2Item(
			curriculum,
			coreProjectTitle,
			{
				title: "Data Migration and Compatibility Check",
				content: [
					"List every constructor, factory, accessor, serializer, fixture, equality check, and persistence boundary affected by the new representation. Add conversion at one boundary rather than mixing old and new shapes throughout the domain.",
					"",
					"Test missing, extra, invalid, and round-trip data. Preserve the old format through an adapter or explicit migration when external consumers still depend on it; record any deliberate compatibility break separately."
				].join("\n"),
				projectLink: DESIGN_PATTERNS_JAVA_PART_2_COMPATIBILITY,
				learningPath: "core"
			}
		);
	}

	if (module.title === "DPR5 Simplifying Conditional Expressions") {
		curriculum = insertDesignPatternsJavaPart2Item(
			curriculum,
			coreProjectTitle,
			{
				title: "Decision Table and Branch-Equivalence Contract",
				content: [
					"Convert the original conditional into a decision table containing inputs, branch selected, result, state change, and exception. Include boundaries where conditions overlap, no condition matches, or evaluation short-circuits.",
					"",
					"Apply guard clauses and decomposition before polymorphism. Rerun every table row after each step; add a type only when variants own stable behavior rather than when a single conditional merely looks long."
				].join("\n"),
				projectLink: DESIGN_PATTERNS_JAVA_PART_2_JUNIT,
				learningPath: "core"
			}
		);
	}

	if (module.title === "DPR6 Simplifying Method Calls") {
		curriculum = insertDesignPatternsJavaPart2Item(
			curriculum,
			coreProjectTitle,
			{
				title: "Public API Compatibility Contract",
				content: [
					"Inventory source compatibility across public method names, parameter and return types, overloads, checked exceptions, visibility, generic bounds, and reflective or serialized use before changing a call shape.",
					"",
					"Prefer an additive migration: introduce the clearer API, delegate the old API, migrate call sites, mark the old entry point with a documented deprecation path, and remove it only at an intentional compatibility boundary."
				].join("\n"),
				projectLink: DESIGN_PATTERNS_JAVA_PART_2_COMPATIBILITY,
				learningPath: "core"
			}
		);
		curriculum = insertDesignPatternsJavaPart2Item(
			curriculum,
			coreProjectTitle,
			{
				title: "Null, Optional, and Exception Boundary",
				content: [
					"Use one absence policy per boundary: nullable value, `Optional` return, empty collection, special-case object, or exception. Do not use `Optional` as a field or parameter by habit, and do not convert a failure into absence without an explicit contract.",
					"",
					"Test present, absent, invalid, and dependency-failure paths. Keep exception type, message contract if externally relied upon, and cause chain stable during a structural refactor."
				].join("\n"),
				projectLink: DESIGN_PATTERNS_JAVA_PART_2_OPTIONAL,
				learningPath: "core"
			}
		);
	}

	if (module.title === "DPR7 Dealing with Generalization") {
		curriculum = insertDesignPatternsJavaPart2Item(
			curriculum,
			coreProjectTitle,
			{
				title: "Substitutability and Hierarchy-Exit Contract",
				content: [
					"Write contract tests that run against every subtype: accepted inputs, results, exceptions, mutation, and lifecycle rules. Pull members up only when every subtype honors the same meaning; push members down when the base contract is dishonest.",
					"",
					"Compare Template Method, sealed hierarchy, and delegation. Exit inheritance when subclasses reject inherited behavior, depend on fragile protected state, or vary across more than one independent axis."
				].join("\n"),
				projectLink:
					"https://docs.oracle.com/javase/specs/jls/se25/html/jls-8.html#jls-8.1.1.2",
				learningPath: "core"
			}
		);
	}

	if (module.title === "DPR8 Refactoring Toward Patterns") {
		curriculum = insertDesignPatternsJavaPart2Item(
			curriculum,
			coreProjectTitle,
			{
				title: "Pattern Arrival Evidence and Exit Trigger",
				content: [
					"Record the smell, requested change, transformation sequence, simpler destination, pattern introduced, and the exact pressure it relieves. Compare files touched, conditional edits, duplicated rules, dependency count, or test setup for the next variant.",
					"",
					"Define an exit trigger: collapse the abstraction when variants disappear, the boundary stops changing, indirection exceeds the benefit, or a modern Java language feature expresses the same contract more directly."
				].join("\n"),
				projectLink: DESIGN_PATTERNS_JAVA_PART_2_JUNIT,
				learningPath: "core"
			}
		);
	}

	if (
		module.title === "DPR9 Testability, DI, and Refactoring with Confidence"
	) {
		curriculum = insertDesignPatternsJavaPart2Item(
			curriculum,
			coreProjectTitle,
			{
				title: "Legacy Side-Effect Seam Catalog",
				content: [
					"Locate direct calls to clocks, randomness, static globals, environment variables, file systems, network clients, databases, threads, and process exit. Wrap one effect behind the narrowest domain-facing collaborator and inject it at the composition boundary.",
					"",
					"Use deterministic fakes for time and randomness, temporary owned fixtures for files, and in-memory or fake clients for remote effects. Keep integration tests for the real adapter rather than mocking the domain itself."
				].join("\n"),
				projectLink: DESIGN_PATTERNS_JAVA_PART_2_JUNIT,
				learningPath: "core"
			}
		);
		curriculum = insertDesignPatternsJavaPart2Item(
			curriculum,
			coreProjectTitle,
			{
				title: "Characterization Test Quality Contract",
				content: [
					"A characterization test names the observed contract, controls nondeterminism, asserts meaningful outputs or effects, and fails when that behavior changes. Avoid tests that duplicate implementation steps, assert private methods, or pass regardless of the mutation.",
					"",
					"Prove each test can fail by making one temporary local mutation or by checking a known counterexample, then restore the source. Include normal, boundary, and failure paths before widening the refactor."
				].join("\n"),
				projectLink: DESIGN_PATTERNS_JAVA_PART_2_JUNIT,
				learningPath: "core"
			}
		);
	}

	if (module.title === "DPR10 Capstone Refactoring Studio") {
		curriculum = insertDesignPatternsJavaPart2Item(
			curriculum,
			coreProjectTitle,
			{
				title: "Capstone Change Ledger and Stop Points",
				content: [
					"Tag or commit the green baseline, then keep a ledger with smell, risk, planned transformation, expected benefit, focused tests, commit, result, and next decision. Separate structural, behavior, dependency, and formatting changes.",
					"",
					"Define stop points before editing: unexplained test failure, compatibility uncertainty, diff too large to review, missing rollback, or a new design pressure that invalidates the plan. Re-plan from the last green commit rather than forcing the sequence."
				].join("\n"),
				projectLink: DESIGN_PATTERNS_JAVA_PART_2_JUNIT,
				learningPath: "core"
			}
		);
		curriculum = insertDesignPatternsJavaPart2Item(
			curriculum,
			coreProjectTitle,
			{
				title: "Capstone Evidence Review",
				content: [
					"Deliver the behavior inventory, baseline tests, smell map, ordered commits, compatibility notes, before-and-after dependency view, and measurements tied to two realistic change scenarios.",
					"",
					"Demonstrate one postponed improvement, one abandoned refactor with evidence, one remaining risk, and the rollback point for every major change. The review evaluates judgment and safety, not the number of techniques or patterns used."
				].join("\n"),
				projectLink: DESIGN_PATTERNS_JAVA_PART_2_JUNIT,
				learningPath: "core"
			}
		);
	}

	curriculum = curriculum.map((item, index) => ({
		...item,
		content:
			index === 0
				? `**Course flow:** ${flow.flowNote}\n\n${item.content}`
				: item.content
	}));

	return {
		...module,
		estimatedTime: flow.estimatedTime,
		keyBlocks: flow.keyBlocks,
		curriculum,
		supplementalProjects: module.supplementalProjects.map(item => ({
			...item,
			learningPath: designPatternsJavaPart2OptionPath(item.title)
		}))
	};
}

function buildDesignPatternsJavaPart2ClinicAppendix(
	modules: RawCourse["modules"]
): RawCourse["modules"][number] {
	return {
		kind: "appendix",
		title: "Optional Refactoring Clinics 11–17",
		estimatedTime:
			"Choose a clinic after the matching course unit or a capstone diagnosis",
		keyBlocks: [
			"feature ownership",
			"conditional replacement",
			"parameter objects",
			"calculation pipeline",
			"workflow variation",
			"absence policy",
			"multi-smell sequence"
		],
		curriculum: [
			{
				title: "Refactoring Clinic Scope Guide",
				content:
					"**Course flow:** These seven clinics preserve the complete guided practice collection without presenting them as seven additional required units. Select the clinic that matches a diagnosed smell, preserve the original behavior first, complete its guided reconstruction, close reference code, and then attempt the transfer or extension from the last green baseline.",
				learningPath: "core"
			}
		],
		supplementalProjects: modules.flatMap(module =>
			[...module.curriculum, ...module.supplementalProjects].map(
				item => ({
					...item,
					learningPath: designPatternsJavaPart2OptionPath(item.title)
				})
			)
		)
	};
}

const designPatternsJavaPart2PrimaryModules =
	designPatternsInJavaPart2SourceCourse.modules
		.filter(module =>
			DESIGN_PATTERNS_JAVA_PART_2_PRIMARY_TITLES.has(module.title)
		)
		.map(decorateDesignPatternsJavaPart2Module);
const designPatternsJavaPart2Clinics =
	designPatternsInJavaPart2SourceCourse.modules.filter(
		module => !DESIGN_PATTERNS_JAVA_PART_2_PRIMARY_TITLES.has(module.title)
	);

export const designPatternsInJavaPart2Course: RawCourse = {
	...designPatternsInJavaPart2SourceCourse,
	modules: [
		...designPatternsJavaPart2PrimaryModules,
		buildDesignPatternsJavaPart2ClinicAppendix(
			designPatternsJavaPart2Clinics
		)
	]
};
