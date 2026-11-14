import type { RawCourseModule, RawCourseModuleItem } from "./types";
import { courseAssetViewerUrl } from "@/modules/courseAssetPreview";
import {
	javaJudgmentModuleID,
	javaJudgmentURL
} from "@/modules/javaJudgmentResources";

function task(item: RawCourseModuleItem, section: string): RawCourseModuleItem {
	const path = "/course-assets/design-patterns-in-java/judgment-checks.md#";
	return {
		...item,
		content: `${item.content}\n\n[Case inputs](${courseAssetViewerUrl(
			`${path + section}-inputs`
		)}) · [Project self-check](${courseAssetViewerUrl(
			`${path + section}-answers`
		)})`
	};
}
export function completeJavaJudgment(module: RawCourseModule): RawCourseModule {
	if (module.title !== "DPJ9 Pattern Selection and Refactoring Judgment")
		return module;
	return {
		...module,
		id: javaJudgmentModuleID,
		curriculum: [
			{
				id: "design-patterns-in-java-dpj9-pattern-selection-and-refactoring-judgment-curriculum-pattern-selection-and-refactoring-judgment-core-concepts",
				title: "Pattern Selection and Refactoring Judgment Core Concepts",
				aliases: [
					"design-patterns-in-java-dpj9-pattern-selection-and-refactoring-judgment-curriculum-core-concepts-and-learning-sequence",
					"core-concepts",
					"smell-to-pattern-mapping",
					"when-not-to-use-the-pattern",
					"mini-lab-improve-a-brittle-object-model-with-restraint",
					"design-patterns-in-java-dpj9-pattern-selection-and-refactoring-judgment-curriculum-core-concepts",
					"design-patterns-in-java-dpj9-pattern-selection-and-refactoring-judgment-curriculum-smell-to-pattern-mapping",
					"design-patterns-in-java-dpj9-pattern-selection-and-refactoring-judgment-curriculum-when-not-to-use-the-pattern",
					"design-patterns-in-java-dpj9-pattern-selection-and-refactoring-judgment-curriculum-mini-lab-improve-a-brittle-object-model-with-restraint"
				],
				contentKind: "reading",
				learningPath: "core",
				preserveInstructions: true,
				ideImport: true,
				projectLink: javaJudgmentURL("example"),
				solutionLink: javaJudgmentURL("solution"),
				content: `**Course flow:** Compare a direct helper with an injected policy, characterize a checkout baseline, then preserve its behavior while reducing duplicated decisions. The preview and core project share one saved checkout. Reflection and decision records are written checkpoints; optional policy injection continues the same project after core.

### From change pressure to a design decision

A smell is a reason to investigate. Two methods containing the same pricing rules risk drifting when a price changes. An extra interface can isolate a real variation, but also adds a contract, wiring and navigation. Identify the concrete change first, choose a property to improve and compare the smallest useful alternatives.

For fixed formatting, an ordinary private helper can give two entrypoints one rule location. For independently chosen formatting, an injected function can give the caller a real variation seam. A Strategy class hierarchy is useful when alternatives have substantial behavior, state or lifecycle; a single function may express a small stateless policy. An enum switch is a reasonable closed set. A Factory or plugin mechanism is justified by creation/discovery pressure, rather than by the presence of a conditional alone.

Record the desired property, observable contract, simpler counterfactual, cost and removal trigger. A proposed strategy for speculative future variants creates work now without demonstrating a present benefit. Keep the scope of the decision explicit: client API, internal rule ownership and runtime policy selection are different questions.

### Complete comparison example

This is the complete public Main.java. Its separate three-file folder also includes ContractTests.java and \`README.md\`.

\`\`\`java
import java.util.Locale;
import java.util.Objects;
import java.util.function.UnaryOperator;
public class Main {
    public static String line(String value){
        Objects.requireNonNull(value,"text");
        if(value.indexOf('\\r')>=0 || value.indexOf('\\n')>=0)throw new IllegalArgumentException("single-line text");
        return value;
    }
    public static final class Legacy {
        public static String banner(String text){return "NOTICE: "+line(text).trim().toUpperCase(Locale.ROOT);}
        public static String email(String text){return "NOTICE: "+line(text).trim().toUpperCase(Locale.ROOT);}
    }
    public static final class Direct {
        private static String format(String text){return "NOTICE: "+line(text).trim().toUpperCase(Locale.ROOT);}
        public static String banner(String text){return format(text);}
        public static String email(String text){return format(text);}
    }
    public static final class Pluggable {
        private final UnaryOperator<String> formatter;
        public Pluggable(UnaryOperator<String> formatter){this.formatter=Objects.requireNonNull(formatter,"formatter");}
        public String banner(String text){return line(formatter.apply(line(text)));}
        public String email(String text){return line(formatter.apply(line(text)));}
    }
    public static void main(String[] args){
        Pluggable injected=new Pluggable(text->"NOTICE: "+text.trim().toUpperCase(Locale.ROOT));
        System.out.println(Legacy.banner(" hello "));
        System.out.println(Direct.banner(" hello "));
        System.out.println(injected.banner(" hello "));
    }
}
\`\`\`

Legacy repeats the fixed notice rule in banner and email. Direct routes both entrypoints through format. Pluggable receives a non-null UnaryOperator<String> and calls it once per valid input, validating both the input and the returned single-line result. Null text/result raises NullPointerException; CR or LF raises IllegalArgumentException; an empty line is valid. Fixed formatting trims and uppercases with Locale.ROOT, then prefixes NOTICE:. These methods read no input and write no files.

Main prints NOTICE: HELLO three times. For " hello ", all three chosen implementations agree. For empty input the fixed result is "NOTICE: ". The injected formatter may instead return "["+text+"]": the whitespace is then preserved, yielding "[ hello ]". That is an explicitly selected behavior change. A formatter exception propagates; prior external callback effects have no rollback.

\`\`\`sh
javac --release 21 -Xlint:all -Werror Main.java ContractTests.java
java ContractTests
java Main
\`\`\`

The example harness reports Judgment worked contracts: 49 passed. This demonstrates the fixed behavior and the injection boundary. Tests cannot decide whether the added field, constructor and callback contract are worth maintaining for a particular product.

### Characterization and an independent oracle

Characterization records existing observable behavior before changing structure. It can also preserve a defect. Identify which behavior is required and which is merely observed. Schedule an intentional behavior correction separately so a changed result has an explained cause.

The assigned checkout preserves LegacyCheckout as a comparison baseline and uses an independently written pricing table as an oracle. Agreement between two copied implementations alone could preserve the same mistake in both. The harness checks every allowed combination against the table: 101 quantities times 2 tiers times 3 deliveries equals 606 orders.

The exported pack has nine files: Main.java, ContractTests.java, \`DECISIONS.md\`, \`README.md\`, sources.txt, and four package files under src/checkout: Checkout.java, LegacyCheckout.java, Order.java and Totals.java. Keep package paths intact. All Java uses Java 21 and bounded integer cents. The program reads no standard input and writes no files.

Order is an immutable record: units is 0 through 100 inclusive; tier is REGULAR or MEMBER; delivery is PICKUP, STANDARD or EXPRESS. An out-of-range quantity raises IllegalArgumentException. A null enum field raises NullPointerException. Totals stores nonnegative subtotal and shipping, and computes total with checked integer addition. Negative components are rejected; an overflowing sum raises ArithmeticException. Sharing these immutable values does not create a mutable ownership alias.

### The complete checkout contract

| Decision | Required result in cents |
| --- | --- |
| Regular unit | 200 |
| Member unit | 180 |
| Zero quantity or pickup | shipping 0 |
| Positive-quantity express | shipping 900 |
| Standard with subtotal below 2000 | shipping 500 |
| Standard with subtotal at least 2000 | shipping 0 |

Compute subtotal from units and tier before selecting shipping. The free-standard threshold applies to the discounted subtotal. Regular 10 STANDARD is subtotal 2000, shipping 0, total 2000. Member 10 STANDARD is subtotal 1800, shipping 500, total 2300. Member 11 STANDARD is 1980+500=2480; member 12 STANDARD is 2160+0=2160. A larger order can therefore cost less across this shipping threshold. Preserve that declared rule during this refactor.

Zero MEMBER EXPRESS is 0+0=0. Positive MEMBER EXPRESS with 10 units is 1800+900=2700. Pickup always has zero shipping. A missing order raises NullPointerException. A receipt has exactly six pipe-separated fields, no spaces or added newline: tier|delivery|units|subtotal|shipping|total. For the regular ten-unit standard order it is REGULAR|STANDARD|10|2000|0|2000.

LegacyCheckout.quote and receipt each encode pricing decisions. The target Checkout.quote returns Totals; receipt must present the same values. The reference keeps subtotal/shipping decisions in private helpers and renders receipt from quote. The starter already supplies those helper bodies. The two core tasks are quote and receipt; using the supplied helpers is one supported route. Judge the resulting rule ownership, rather than crediting discovery of helpers that were provided.

### A runnable baseline and safe refactoring steps

Export the selected role and run these commands from that folder:

\`\`\`sh
javac --release 21 -Xlint:all -Werror -d classes @sources.txt
java -cp classes ContractTests base
java -cp classes Main base
\`\`\`

The untouched starter compiles. Baseline mode reports Baseline judgment contracts: 1221 passed before either target method is complete. Main base prints:

\`\`\`text
REGULAR|STANDARD|10|2000|0|2000
2700
\`\`\`

Begin with a recoverable baseline. One route is to copy the unchanged legacy method bodies into Checkout's target methods, run core, then redirect receipt through quote and route quote through the supplied helpers in small steps. A correct but duplicated implementation can pass behavioral tests. The design record and source review determine whether duplication was reduced.

Use one behavior-preserving step per commit: isolate a rename, move or delegation, run the relevant checks, and keep an identifiable rollback target. A local IDE save/ZIP is a useful checkpoint but does not create a Git commit. After exporting, Git can retain the required commit sequence. Explain any failing test before continuing; retain the last accepted source and check output.

\`\`\`sh
java -cp classes ContractTests core
java -cp classes Main
\`\`\`

Complete core reports Core judgment contracts: 2435 passed. Untouched core deliberately rejects the unfinished quote with UnsupportedOperationException: Implement the behavior-preserving quote. Main after core prints:

\`\`\`text
REGULAR|STANDARD|10|2000|0|2000
REGULAR|STANDARD|10|2000|0|2000
2700
\`\`\`

The first receipt comes from legacy and the second from the target. Their equality checks one example; the exhaustive allowed-order checks are stronger evidence for the bounded table. Neither proves general design quality or guarantees behavior beyond the declared domain.

### Measurements and the simpler counterfactual

Define each count before reporting it. Count duplicated rules within the two legacy entrypoints and the target separately. Retaining the legacy oracle intentionally leaves old duplicate rules in the repository. Claiming the whole repository has only one rule location would obscure that scope.

Compare target files touched to change one price or the standard threshold, duplicated rules in target quote/receipt, added types and constructor dependencies, test setup and caller navigation. A private helper can reduce rule locations without adding an interface. Fewer lines can still make a rule harder to inspect; more classes can still make replacement easier. Explain the observed tradeoff.

In \`DECISIONS.md\` record the pressure, preserved contract, chosen design, simpler counterfactual, baseline/final counts with definitions, a concrete change scenario and its cost. Include checks, small commits and rollback identity. A removal trigger names when extra machinery stops earning its maintenance cost, such as removing injection when only one fixed policy remains and callers no longer select behavior.

### Optional per-call shipping policy

After core, implement Checkout.quoteWith(Order, ToIntFunction<Order>). Validate order and policy for null before the callback. Invoke the trusted callback exactly once, even for zero units. Accept a returned fee from 0 through 10000 inclusive; reject a negative or larger value with IllegalArgumentException. Callback exceptions propagate. Calculate the ordinary subtotal and use that returned shipping fee for this call only.

For MEMBER 10 STANDARD with a policy returning 250, quoteWith returns subtotal 1800, shipping 250, total 2050. The ordinary quote still returns 2300. Zero units with a policy returning 100 yields total 100, because this optional API deliberately replaces the normal shipping calculation, including the zero-quantity rule. This is a separate variation contract, not a change to core behavior.

The callback can have external effects. Neither immutable Order nor Totals rolls those effects back if the callback throws or returns an invalid fee. This synchronous pack supplies no isolation, persistence or concurrency guarantee.

\`\`\`sh
java -cp classes ContractTests core
java -cp classes ContractTests
\`\`\`

Core remains 2435 passed; the complete harness reports Complete judgment contracts: 2445 passed. The complete reference implements the optional policy; the starter leaves it independent of core. A green harness supplies behavioral evidence. The decision record supplies the explanation of why this specific seam earns its cost.
`
			},
			task(
				{
					id: "design-patterns-in-java-dpj9-pattern-selection-and-refactoring-judgment-curriculum-design-review-exercise-name-the-tradeoff-not-just-the-pattern",
					title: "Design Review Exercise: Name the Tradeoff, Not Just the Pattern",
					contentKind: "assignment",
					learningPath: "core",
					preserveInstructions: true,
					preserveAssignment: true,
					content: `Compare Legacy, Direct and Pluggable in the complete notice example. Trace banner and email for " hello ", empty text and a null/line-break input. Identify the duplicated rule, how Direct changes its ownership, and what the injected version adds.

Evaluate two requirements: one fixed notice style across the application, and caller-selected formatting for different channels. Choose the smallest design for each and name the rejected alternative, added dependencies and removal trigger. **Completion evidence:** Keep the trace, scoped rule counts, contract boundary and a reasoned decision for both requirements. This is written design review.`
				},
				"review"
			),
			task(
				{
					id: "design-patterns-in-java-dpj9-pattern-selection-and-refactoring-judgment-curriculum-refactoring-preview-pattern-selection-requires-safe-change",
					title: "Refactoring Preview: Pattern Selection Requires Safe Change",
					contentKind: "assignment",
					learningPath: "core",
					preserveInstructions: true,
					preserveAssignment: true,
					ideImport: true,
					projectLink: javaJudgmentURL("starter"),
					solutionLink: javaJudgmentURL("solution"),
					content: `Open the checkout starter and preserve all nine files. Export it, compile with Java 21 and run ContractTests base plus Main base before implementing a target method. Baseline reports 1221 passed; record its exact two output lines.

Continue the same saved checkout through core. Establish target quote/receipt behavior before changing rule ownership; the legacy method bodies and supplied private helpers support small steps. **Completion evidence:** Keep the baseline source/check output, the first recoverable checkpoint, boundary-order predictions and the planned one behavior-preserving step per commit. The untouched starter compiles while core deliberately rejects the unfinished target.`
				},
				"preview"
			),
			task(
				{
					id: "design-patterns-in-java-dpj9-pattern-selection-and-refactoring-judgment-curriculum-reflection-question-what-improvement-was-actually-measured",
					title: "Reflection Question: What Improvement Was Actually Measured?",
					contentKind: "assignment",
					learningPath: "core",
					preserveInstructions: true,
					preserveAssignment: true,
					content: `Compare the legacy and target checkout using defined measurements: files touched to change a price, duplicated rules in target quote/receipt, added types or dependencies and the work to add one real variation. Count the retained legacy separately.

Explain why 2435 passing checks can coexist with duplicated target methods. **Completion evidence:** Keep before/after measurements with scope, an actual change scenario, one added cost and an explanation of which conclusions require source review rather than test output. This is written reflection.`
				},
				"reflection"
			),
			task(
				{
					id: "design-patterns-in-java-dpj9-pattern-selection-and-refactoring-judgment-curriculum-pattern-decision-record-and-simpler-counterfactual",
					title: "Pattern Decision Record and Simpler Counterfactual",
					contentKind: "assignment",
					learningPath: "core",
					preserveInstructions: true,
					preserveAssignment: true,
					content: `Complete \`DECISIONS.md\` in the saved checkout. Record the duplication/change pressure, observable behavior, selected helper or policy design, simpler counterfactual, added types/indirection and removal trigger.

Compare the ordinary helper core with a proposed shipping Strategy hierarchy. Identify the additional requirement that would justify caller-selected policies, then sketch that seam without making it a core requirement. **Completion evidence:** Keep the count definitions, bounded behavior table, tradeoff, change scenario and rollback identity. This is the decision record for the shared project; it assigns no separate starter.`
				},
				"decision"
			),
			task(
				{
					id: "design-patterns-in-java-dpj9-pattern-selection-and-refactoring-judgment-curriculum-safe-refactor-and-measurement-contract",
					title: "Safe Refactor and Measurement Contract",
					contentKind: "assignment",
					learningPath: "core",
					preserveInstructions: true,
					preserveAssignment: true,
					content: `Define a sequence of behavior-preserving checkout changes. Give each step its affected source, checks and rollback target. Separate a rename or delegation from a pricing-policy change; preserve the independent rule table and the legacy baseline.

Use the regular/member threshold cases, zero express and missing order as boundary checks, then run the exhaustive core harness. **Completion evidence:** Retain one behavior-preserving step per commit after export, matching check output and measurements for files touched and duplicated rules. Record the last accepted checkpoint if a failure cannot be explained. This is the shared project's verification plan.`
				},
				"measurement"
			),
			task(
				{
					id: "design-patterns-in-java-dpj9-pattern-selection-and-refactoring-judgment-curriculum-core-project-pattern-selection-and-refactoring-judgment",
					title: "Core Project: Pattern Selection and Refactoring Judgment",
					aliases: [
						"design-patterns-in-java-dpj9-pattern-selection-and-refactoring-judgment-curriculum-core-project",
						"dpj9-pattern-selection-and-refactoring-judgment-core-project",
						"design-patterns-in-java-dpj9-pattern-selection-and-refactoring-judgment-curriculum-dpj9-pattern-selection-and-refactoring-judgment-core-project"
					],
					contentKind: "assignment",
					learningPath: "core",
					preserveInstructions: true,
					preserveAssignment: true,
					ideImport: true,
					projectLink: javaJudgmentURL("starter"),
					solutionLink: javaJudgmentURL("solution"),
					content: `Complete Checkout.quote and receipt in the same saved checkout. Preserve Order, Totals, LegacyCheckout, the independent ContractTests table and package paths. Use integer cents and the declared threshold; receipt has exactly six pipe-separated fields.

\`\`\`sh
javac --release 21 -Xlint:all -Werror -d classes @sources.txt
java -cp classes ContractTests base
java -cp classes ContractTests core
java -cp classes Main
\`\`\`

Baseline reports 1221 passed and core reports 2435 passed. Main's three exact lines are in Core Concepts. Optional quoteWith remains independent. **Completion evidence:** Keep source, boundary table, complete check output, small change checkpoints and \`DECISIONS.md\` explaining rule ownership, the simpler alternative and measured costs before consulting the separate reference.`
				},
				"core"
			)
		],
		supplementalProjects: [
			task(
				{
					id: "design-patterns-in-java-dpj9-pattern-selection-and-refactoring-judgment-supplemental-understanding-check-pattern-selection-and-refactoring-judgment",
					title: "Understanding Check: Pattern Selection and Refactoring Judgment",
					aliases: [
						"design-patterns-in-java-dpj9-pattern-selection-and-refactoring-judgment-supplemental-dpj9-pattern-selection-and-refactoring-judgment-diagnostic-checkpoint",
						"diagnostic-checkpoint-pattern-selection-and-refactoring-judgment",
						"diagnostic-checkpoint",
						"understanding-check",
						"design-patterns-in-java-dpj9-pattern-selection-and-refactoring-judgment-supplemental-diagnostic-checkpoint-pattern-selection-and-refactoring-judgment",
						"design-patterns-in-java-dpj9-pattern-selection-and-refactoring-judgment-supplemental-diagnostic-checkpoint",
						"design-patterns-in-java-dpj9-pattern-selection-and-refactoring-judgment-supplemental-understanding-check"
					],
					contentKind: "assignment",
					learningPath: "choice",
					preserveInstructions: true,
					preserveAssignment: true,
					content: `Evaluate five claims: passing core proves duplication is removed; a helper always requires an interface; characterization alone establishes desired behavior; zero-unit injected shipping must be zero; callback failure rolls back external effects.

Correct each using the notice example or checkout contract. **Completion evidence:** Keep five reasoned corrections, one concrete input/result per claim and the distinction between a behavioral oracle and a design judgment. This optional understanding check is a written worksheet.`
				},
				"understanding"
			),
			task(
				{
					id: "design-patterns-in-java-dpj9-pattern-selection-and-refactoring-judgment-supplemental-pattern-selection-and-refactoring-judgment-transfer-practice",
					title: "Pattern Selection and Refactoring Judgment Transfer Practice",
					aliases: [
						"design-patterns-in-java-dpj9-pattern-selection-and-refactoring-judgment-supplemental-transfer-practice",
						"design-patterns-in-java-dpj9-pattern-selection-and-refactoring-judgment-supplemental-transfer-practice-pattern-selection-and-refactoring-judgment"
					],
					contentKind: "assignment",
					learningPath: "choice",
					preserveInstructions: true,
					preserveAssignment: true,
					content: `Use the complete notice example with " hi ", empty text and "a\\nb". Compare Legacy and Direct to an injected formatter text -> "[" + text + "]". Predict both entrypoints and the point of input validation.

Then use a formatter returning null and one throwing after incrementing a counter. **Completion evidence:** Keep exact strings/exceptions, callback counts, external-effect outcomes and a decision between a fixed helper and injection for one specified channel requirement. This optional transfer worksheet uses the public example and assigns no additional starter.`
				},
				"transfer"
			),
			task(
				{
					id: "design-patterns-in-java-dpj9-pattern-selection-and-refactoring-judgment-supplemental-pattern-selection-and-refactoring-judgment-extension-practice",
					title: "Pattern Selection and Refactoring Judgment Extension Practice",
					aliases: [
						"design-patterns-in-java-dpj9-pattern-selection-and-refactoring-judgment-supplemental-extension-practice",
						"design-patterns-in-java-dpj9-pattern-selection-and-refactoring-judgment-supplemental-extension-practice-pattern-selection-and-refactoring-judgment"
					],
					contentKind: "assignment",
					learningPath: "challenge",
					preserveInstructions: true,
					preserveAssignment: true,
					ideImport: true,
					projectLink: javaJudgmentURL("starter"),
					solutionLink: javaJudgmentURL("solution"),
					content: `Complete core first, then continue the same checkout. Implement only quoteWith: validate order/policy, call policy once, accept 0..10000 inclusive and combine that fee with the normal subtotal. Preserve ordinary quote and receipt.

Check MEMBER 10 STANDARD with fee 250, zero units with fee 100, fees -1 and 10001, null policy and a throwing callback. Run core again (2435 passed), then the complete harness (2445 passed). **Completion evidence:** Keep callback traces, boundary results, unchanged ordinary quote, before/after core output and the decision record explaining this actual variation and its removal trigger.`
				},
				"extension"
			)
		]
	};
}
