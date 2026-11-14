import type { RawCourseModule, RawCourseModuleItem } from "./types";
import { courseAssetViewerUrl } from "@/modules/courseAssetPreview";
import {
	javaComposingModuleID,
	javaComposingURL
} from "@/modules/javaComposingResources";

const entries: Array<
	RawCourseModuleItem & { caseSection: string | null; sourceProject: boolean }
> = [
	{
		id: "design-patterns-in-java-part-2-dpr2-composing-methods-curriculum-composing-methods-core-concepts",
		title: "Composing Methods Core Concepts",
		aliases: [
			"design-patterns-in-java-part-2-dpr2-composing-methods-curriculum-core-concepts-and-learning-sequence",
			"core-concepts",
			"design-patterns-in-java-part-2-dpr2-composing-methods-curriculum-core-concepts"
		],
		content:
			'**Course flow:** DPR1 established a protected behavior baseline and small recoverable steps. DPR2 changes method composition inside a fixed report pipeline. Read the contract, predict a trace, run the existing program, split one responsibility and rerun. The same reading and cases support independent work or a guided discussion.\n\n### Nine composing-method techniques\n\nThe [Composing Methods catalog](https://refactoring.guru/refactoring/techniques/composing-methods) names these related transformations:\n\n| Technique | Change and reason |\n| --- | --- |\n| Extract Method | Name a coherent operation and make its inputs and result explicit. |\n| Inline Method | Remove a wrapper whose body communicates its purpose better. |\n| Extract Variable | Give a meaningful name to an expression or intermediate value. |\n| Inline Temp | Replace an unnecessary one-use name with a clear expression. |\n| Replace Temp with Query | Move a calculation into a reusable result-returning method. |\n| Split Temporary Variable | Give distinct intermediate meanings separate variables. |\n| Remove Assignments to Parameters | Keep the input name stable and use a local working value. |\n| Replace Method with Method Object | Give a computation its own instance when shared intermediate state obstructs extraction. |\n| Substitute Algorithm | Replace the computational approach while preserving its selected contract. |\n\nChoose a transformation for a demonstrated readability or change problem. Preserve public types, value ranges, ordering, exceptions and numeric rules at each checkpoint. A shorter body alone does not establish an improvement.\n\n### Effectful reads and pure queries\n\nThe evaluation order includes both callbacks and arithmetic. An IntSupplier can advance a cursor, read a device or throw. Capture its result once. Calling next.getAsInt() twice can obtain two different samples. A Consumer can append an event, throw or change external state. Moving a trace call changes what remains observable after failure.\n\nA [temporary-to-query refactor](https://refactoring.guru/replace-temp-with-query) is useful when the extracted calculation is safe to evaluate at its call sites. The supplied mean(total,count) is pure: fixed arguments produce the same result without external effects. The supplier is an effectful operation. Extracting a read method keeps its call count and position explicit.\n\nFor values [-1,0], total is -1 and Java long division by 2 truncates toward zero, giving mean 0. Math.floorDiv would produce -1. For two Integer.MAX_VALUE samples with the extra enabled, the adjusted value is 2362232011, above int range. The numeric conversion to long must happen before addition; assigning an already-overflowed int result into long preserves the wrong number.\n\n### Complete protected contract\n\nsummarize(int count, boolean includeExtra, IntSupplier next, Consumer<String> trace) first validates count in 0..1000, otherwise IllegalArgumentException. It then requires next and trace to be non-null in that order, even when count is zero. Null callbacks raise NullPointerException.\n\nFor each index i from 0 to count-1:\n\n1. Call trace.accept("read:" + i).\n2. Call next.getAsInt() exactly once and retain that int sample.\n3. Count the sample as positive only when sample>0.\n4. If includeExtra and sample>0, call trace.accept("bonus:" + i), then add sample/10 to that sample using integer truncation. Even a positive sample below 10 emits the bonus event, although the extra is zero.\n5. Add the adjusted value into a long total.\n\nReturn Summary(count,positive,total,mean). Mean is total/count with Java truncation toward zero, or zero for count zero. Summary is an immutable record with those fields. Its format() is exactly count=N|positive=P|total=T|mean=M. The record is a transparent value; the reporting operations produce the stated valid results.\n\nAll int sample values are valid. Callbacks can change state. Propagate their exact original exception object immediately. A failed read trace prevents its supplier call. A failed supplier prevents its bonus trace. A failed bonus trace prevents the next sample. Earlier effects remain visible. Zero count invokes no callbacks; separate report calls retain no computation state. These operations print nothing themselves.\n\n### Source layout and complete driver\n\nThe ten-file role folder contains Main.java, ContractTests.java, README.md, DECISIONS.md, CHECKPOINTS.md and sources.txt. Package reports contains Summary.java, LegacyReport.java and ComposedReport.java. Package reports.comparison contains MethodObjectReport.java. Keep the package tree and source list intact.\n\nLegacyReport is the unchanged dense baseline. ComposedReport is the runnable refactoring target. MethodObjectReport is a complete comparison, with one private Computation instance per invocation. Its fields carry intermediate state through collect and compute, adding object setup and a lifecycle to understand. The [method-object technique](https://refactoring.guru/replace-method-with-method-object) becomes useful when connected stages need shared intermediate state. This fixed pipeline can use simpler helpers. A future staged/revisable computation could earn the extra object; a name alone cannot.\n\nThe supplied driver is complete:\n```java\nimport java.util.ArrayList;\nimport java.util.List;\nimport java.util.function.IntSupplier;\nimport reports.ComposedReport;\nimport reports.LegacyReport;\nimport reports.Summary;\nimport reports.comparison.MethodObjectReport;\n\npublic final class Main {\n    private Main() {}\n    public static void main(String[] args) {\n        int[] samples = {12, -5, 20};\n        int[] cursor = {0};\n        List<String> events = new ArrayList<>();\n        IntSupplier next = () -> samples[cursor[0]++];\n        String mode = args.length == 0 ? "core" : args[0];\n        Summary result;\n        if (mode.equals("base")) result = LegacyReport.summarize(3, true, next, events::add);\n        else if (mode.equals("object")) result = MethodObjectReport.summarize(3, true, next, events::add);\n        else if (mode.equals("core")) result = ComposedReport.summarize(3, true, next, events::add);\n        else throw new IllegalArgumentException("mode");\n        System.out.println(result.format());\n        System.out.println(cursor[0]);\n        System.out.println(events);\n    }\n}\n```\n\n### Compile, compare and refactor\n\nUse JDK 21 from the complete role folder:\n```sh\njavac --release 21 -Xlint:all -Werror -d classes @sources.txt\njava -cp classes ContractTests base\njava -cp classes ContractTests core\njava -cp classes ContractTests object\njava -cp classes Main base\njava -cp classes Main\njava -cp classes Main object\n```\n\nAll three Main modes print:\n```text\ncount=3|positive=2|total=30|mean=10\n3\n[read:0, bonus:0, read:1, read:2, bonus:2]\n```\n\nBaseline and method-object harness modes each report 6609 passed. Core checks baseline and target, reporting 13218 passed for both roles. The starter is already green. Preserve LegacyReport, Summary, Main and ContractTests. First split the temporary that changes from raw sample to adjusted value. Keep long arithmetic. Then extract readSample, preserving the trace before the single supplier call. Extract adjustedValue, retaining the conditional trace. Finally extract the pure mean query.\n\nAfter each actual step, save the diff, command, observed result and recovery point in CHECKPOINTS.md. A failure calls for inspecting that step and restoring the prior green source before proceeding. DECISIONS.md records the responsibility gained and compares the helper-only and per-call method-object alternatives. Optional new files belong in sources.txt.\n\nThe in-site Java Run control displays native build commands. Export the complete project ZIP and execute these commands with JDK 21; the browser does not execute this Java program. Keep learner work and permitted reference work separate. Opening another source activity in this unit continues the same saved role workspace.\n\n### Optional array adapter\n\nAfter core, implement ComposedReport.summarizeValues(int[] values, boolean includeExtra). Require a non-null array, capture a copy, and pass its values in order through the existing computation with a silent trace. Length 0..1000 follows the core count rule; longer input raises IllegalArgumentException. Preserve input, retain no shared state, and return the immutable Summary. All int values are valid. Explain the ownership contract and the copying cost.\n\n```sh\njava -cp classes ContractTests\n```\n\nThe complete reference reports 13226 passed. Core remains complete with the adapter unfinished. Exhaustive small sequences, int limits, maximum count, event interleaving and original failures support the behavioral claim. The design explanation separately justifies the structure chosen.\n',
		contentKind: "reading",
		learningPath: "core",
		preserveInstructions: true,
		caseSection: null,
		sourceProject: true
	},
	{
		id: "design-patterns-in-java-part-2-dpr2-composing-methods-curriculum-composing-methods-application-check",
		title: "Composing Methods Application Check",
		aliases: [
			"application-check",
			"mini-lab-refactor-a-calculation-pipeline-safely",
			"design-patterns-in-java-part-2-dpr2-composing-methods-curriculum-application-check",
			"design-patterns-in-java-part-2-dpr2-composing-methods-curriculum-mini-lab-refactor-a-calculation-pipeline-safely"
		],
		content:
			"Trace the calculation before changing it. For [12,-5,20] with extras enabled, record each read event, supplier call, bonus event, adjusted value, total and final formatted Summary. Repeat [-1,0] without extras and two Integer.MAX_VALUE samples with extras. Use a stateful cursor supplier and a list-backed event sink.\n\n**Completion evidence:** Keep the three exact results and traces. Distinguish raw sample, adjusted long value, running total and mean. Explain why a positive sample below 10 still emits a bonus event, and why a long destination alone cannot repair an earlier int overflow.",
		contentKind: "assignment",
		preserveInstructions: true,
		preserveAssignment: true,
		learningPath: "core",
		caseSection: "application",
		sourceProject: true
	},
	{
		id: "design-patterns-in-java-part-2-dpr2-composing-methods-curriculum-reflection-question-when-is-extraction-enough",
		title: "Reflection Question: When Is Extraction Enough?",
		content:
			"Written comparison: identify the smallest useful boundary for a fixed read/adjust/average flow. Then consider a proposed pipeline with several revisable stages sharing intermediate state. Compare helper parameters with per-call computation fields, the added lifecycle and how a new stage changes each design.\n\n**Completion evidence:** Choose helpers or a method object for each stated case with a concrete responsibility and setup cost. Explain why line count and a desire to use a pattern are weak reasons. Include a removal trigger for a method object whose shared-stage need disappears. A slow supplier alone changes neither responsibility nor the requirement to read once.",
		contentKind: "assignment",
		preserveInstructions: true,
		preserveAssignment: true,
		learningPath: "core",
		caseSection: "reflection",
		sourceProject: false
	},
	{
		id: "design-patterns-in-java-part-2-dpr2-composing-methods-curriculum-extraction-semantic-preservation-contract",
		title: "Extraction Semantic-Preservation Contract",
		content:
			"Establish the extraction contract before moving an effectful expression. Trace a sink that throws on read:0, a supplier that throws on the second sample after returning 20, and a sink that throws on bonus:0. Use the same exception instance to distinguish propagation from wrapping.\n\n**Completion evidence:** Record exact prior events, supplier call count, exception identity and the prevented next action for each failure. Keep includeExtra=false as a separate short-circuit case: positive samples then emit read events only. Compare these observations before and after readSample extraction.",
		contentKind: "assignment",
		preserveInstructions: true,
		preserveAssignment: true,
		learningPath: "core",
		caseSection: "semantics",
		sourceProject: true
	},
	{
		id: "design-patterns-in-java-part-2-dpr2-composing-methods-curriculum-core-project-composing-methods",
		title: "Core Project: Composing Methods",
		aliases: [
			"design-patterns-in-java-part-2-dpr2-composing-methods-curriculum-core-project",
			"dpr2-composing-methods-core-project",
			"design-patterns-in-java-part-2-dpr2-composing-methods-curriculum-dpr2-composing-methods-core-project"
		],
		content:
			"Refactor the runnable ComposedReport in recoverable steps: split the raw and adjusted temporary, extract the ordered read operation, extract conditional adjustment, then the pure mean query. Preserve the baseline, oracle, Summary and driver. Avoid shared mutable computation state.\n\n**Completion evidence:** Record actual diffs and commands in CHECKPOINTS.md; retain 13218 passing core checks after each step, exact Main output and the three fixed case results. Explain the long conversion, negative-division rule and why supplier reads remain single. Compare the final helpers with the complete method-object example using a demonstrated change scenario. Optional array work remains separate.",
		contentKind: "assignment",
		preserveInstructions: true,
		preserveAssignment: true,
		learningPath: "core",
		caseSection: "core",
		sourceProject: true
	},
	{
		id: "design-patterns-in-java-part-2-dpr2-composing-methods-supplemental-understanding-check-composing-methods",
		title: "Understanding Check: Composing Methods",
		aliases: [
			"design-patterns-in-java-part-2-dpr2-composing-methods-supplemental-dpr2-composing-methods-diagnostic-checkpoint",
			"diagnostic-checkpoint-composing-methods",
			"diagnostic-checkpoint",
			"understanding-check",
			"design-patterns-in-java-part-2-dpr2-composing-methods-supplemental-diagnostic-checkpoint-composing-methods",
			"design-patterns-in-java-part-2-dpr2-composing-methods-supplemental-diagnostic-checkpoint",
			"design-patterns-in-java-part-2-dpr2-composing-methods-supplemental-understanding-check"
		],
		content:
			"Use the same saved project to compare LegacyReport, ComposedReport and MethodObjectReport on [10,9,0,-11] with extras, an empty report and two consecutive calls. Explain each temporary or field's lifetime and the behavior of zero-count callbacks.\n\n**Completion evidence:** All three entrypoints produce the same Summary and callback interleaving. Record 6609 method-object checks and 13218 core checks, then justify when a per-call computation object becomes useful. State why reusing one mutable Computation across independent calls would need a different reset/concurrency contract.",
		contentKind: "assignment",
		preserveInstructions: true,
		preserveAssignment: true,
		learningPath: "choice",
		caseSection: "understanding",
		sourceProject: true
	},
	{
		id: "design-patterns-in-java-part-2-dpr2-composing-methods-supplemental-composing-methods-transfer-practice",
		title: "Composing Methods Transfer Practice",
		aliases: [
			"design-patterns-in-java-part-2-dpr2-composing-methods-supplemental-transfer-practice-composing-methods",
			"design-patterns-in-java-part-2-dpr2-composing-methods-supplemental-transfer-practice"
		],
		content:
			"Written transfer: assess three proposed substitutions against the protected report contract. Replace total/count with Math.floorDiv; compute the adjusted sample in int before storing it in long; replace a captured supplier result with repeated next.getAsInt() calls.\n\n**Completion evidence:** Use [-1,0], two Integer.MAX_VALUE values and a stateful supplier respectively as counterexamples. Give the changed value, trace or failure and the required safe form. Classify a new rounding rule or a cached supplier snapshot as an explicit contract change, then describe the new acceptance cases it would need.",
		contentKind: "assignment",
		preserveInstructions: true,
		preserveAssignment: true,
		learningPath: "choice",
		caseSection: "transfer",
		sourceProject: false
	},
	{
		id: "design-patterns-in-java-part-2-dpr2-composing-methods-supplemental-composing-methods-extension-practice",
		title: "Composing Methods Extension Practice",
		aliases: [
			"design-patterns-in-java-part-2-dpr2-composing-methods-supplemental-extension-practice-composing-methods",
			"design-patterns-in-java-part-2-dpr2-composing-methods-supplemental-extension-practice"
		],
		content:
			"Implement optional summarizeValues after the core refactor. Capture a copy of the non-null array, then delegate its values in order through the existing core computation with a silent trace. Accept lengths 0..1000; reject longer input with IllegalArgumentException. Preserve the original array and return the immutable Summary.\n\n**Completion evidence:** Record the normal, empty, null, oversized and maximum-int cases; retain a returned Summary while changing the caller's array. Inspect the actual copy and absence of retained shared state. Keep core at 13218 passed and the complete harness at 13226 passed. Explain the adapter's explicit ownership rule and copying cost.",
		contentKind: "assignment",
		preserveInstructions: true,
		preserveAssignment: true,
		learningPath: "challenge",
		caseSection: "extension",
		sourceProject: true
	}
];
export function completeJavaComposingMethods(
	module: RawCourseModule
): RawCourseModule {
	if (module.title !== "DPR2 Composing Methods") return module;
	const complete = (entry: (typeof entries)[number]): RawCourseModuleItem => {
		const { caseSection, sourceProject, ...item } = entry;
		let content = item.content;
		if (caseSection) {
			const path = `/course-assets/design-patterns-in-java/composing-methods-checks.md#${
				caseSection
			}`;
			content += `\n\n[Case inputs](${courseAssetViewerUrl(`${path}-inputs`)}) · [Project self-check](${courseAssetViewerUrl(`${path}-answers`)})`;
		}
		return {
			...item,
			content,
			...(sourceProject
				? {
						ideImport: true,
						projectLink: javaComposingURL("starter"),
						solutionLink: javaComposingURL("solution")
					}
				: {})
		};
	};
	return {
		...module,
		id: javaComposingModuleID,
		curriculum: entries.slice(0, 5).map(complete),
		supplementalProjects: entries.slice(5).map(complete)
	};
}
