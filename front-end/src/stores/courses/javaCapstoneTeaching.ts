import type { RawCourseModule, RawCourseModuleItem } from "./types";
import { courseAssetViewerUrl } from "@/modules/courseAssetPreview";
import {
	javaCapstoneModuleID,
	javaCapstoneURL
} from "@/modules/javaCapstoneResources";

function task(item: RawCourseModuleItem, section: string): RawCourseModuleItem {
	const path = "/course-assets/design-patterns-in-java/capstone-checks.md#";
	return {
		...item,
		content: `${item.content}\n\n[Case inputs](${courseAssetViewerUrl(
			`${path + section}-inputs`
		)}) · [Project self-check](${courseAssetViewerUrl(
			`${path + section}-answers`
		)})`
	};
}
export function completeJavaCapstone(module: RawCourseModule): RawCourseModule {
	if (module.title !== "DPJ10 Capstone Refactor") return module;
	return {
		...module,
		id: javaCapstoneModuleID,
		curriculum: [
			{
				id: "design-patterns-in-java-dpj10-capstone-refactor-curriculum-capstone-launch-start-from-a-cluttered-java-application",
				title: "Capstone Launch: Start from a Cluttered Java Application",
				learningPath: "core",
				contentKind: "reading",
				preserveInstructions: true,
				ideImport: true,
				projectLink: javaCapstoneURL("starter"),
				solutionLink: javaCapstoneURL("solution"),
				content: `**Course flow:** Run a complete dispatch application, diagnose its duplicated computation and mixed responsibilities, then refactor it through recoverable checkpoints. The reading, characterization gate, implementation, architecture review, core project and optional batch continue one saved project. Written reviews record the evidence for each design choice.

### The capstone's purpose

This unit applies a small, justified set of collaboration boundaries to one working application. It brings together behavior preservation, pattern selection, dependency direction, state ownership and failure ordering. The follow-up refactoring course studies named transformation families and risk-ordered techniques in greater depth. A repeated review of this application there serves that distinct purpose.

The starter already runs and passes core tests. Its problem is structural: preview and send each contain channel/rate decisions, while one class owns computation, map storage, duplicate checks and notification ordering. A green unchanged starter establishes the baseline. Source inspection, a demonstrated change and the decision record establish an improvement.

The program simulates a dispatch desk. EMAIL and SMS are text formats; it sends no network messages, reads no standard input and writes no files. Each desk owns independent in-memory state that disappears on exit. Java 21 is required.

### Data and the full observable contract

A Request contains id, text, channel, priority and copies. Id matches [a-z][a-z0-9-]*: a, job-2 and case-20 are valid; empty, Bad, 1job and spaces are rejected. Text is non-null and excludes CR/LF; empty text, surrounding spaces, commas and quotes are allowed. Channel is EMAIL or SMS, priority NORMAL or URGENT, and copies is an integer from 1 through 20 inclusive. Invalid keys, lines or ranges raise IllegalArgumentException; null fields raise NullPointerException.

The immutable Request source is:

\`\`\`java
package dispatch.domain;
import java.util.Objects;
/** One bounded, immutable dispatch request; all monetary values are teaching cents. */
public record Request(String id,String text,Channel channel,Priority priority,int copies) {
    public enum Channel { EMAIL, SMS }
    public enum Priority { NORMAL, URGENT }
    public Request {
        id=key(id);text=line(text);
        Objects.requireNonNull(channel,"channel");Objects.requireNonNull(priority,"priority");
        if(copies<1 || copies>20)throw new IllegalArgumentException("copies must be 1..20");
    }
    public static String key(String value) {
        Objects.requireNonNull(value,"id");
        if(!value.matches("[a-z][a-z0-9-]*"))throw new IllegalArgumentException("invalid id");
        return value;
    }
    public static String line(String value) {
        Objects.requireNonNull(value,"text");
        if(value.indexOf('\\r')>=0 || value.indexOf('\\n')>=0)throw new IllegalArgumentException("single-line text");
        return value;
    }
}
\`\`\`

Dispatch is an immutable id/rendered/cents record. It validates the same key and single-line rules and requires nonnegative cents. Its values contain only immutable strings, enums and primitives; sharing a record does not share a mutable collection.

| Channel and priority | Per-copy cents | Exact rendered prefix |
| --- | ---: | --- |
| EMAIL NORMAL | 100 | EMAIL: followed by one space |
| EMAIL URGENT | 140 | URGENT EMAIL: followed by one space |
| SMS NORMAL | 60 | SMS: followed by one space |
| SMS URGENT | 100 | URGENT SMS: followed by one space |

Append the input text exactly after the prefix. Do not trim or uppercase it. Multiply the per-copy rate by copies. Two normal EMAIL copies of Hi produce rendered text EMAIL: Hi and cost 200. Three urgent SMS copies of Ready produce URGENT SMS: Ready and cost 300. Empty normal EMAIL text renders EMAIL: with its final space retained.

The public DeskApi promises:
- preview computes a Dispatch with no storage or notification effect.
- send rejects an existing id before computation, computes the result, inserts it and then calls NoticeSink once with that stored outcome.
- find validates its key and returns Optional.empty when absent.
- all returns an immutable insertion-order snapshot. Later sends leave an earlier returned list unchanged.

A second send of the same id raises IllegalArgumentException and produces no second notification. A null request raises NullPointerException. After sending b, then a, an all() snapshot has b,a. Sending c later leaves that earlier snapshot b,a and makes a new snapshot b,a,c.

### Run and protect the baseline

The starter has thirteen files: nine Java files, \`README.md\`, \`CHECKPOINTS.md\`, \`DECISIONS.md\` and sources.txt. Preserve the src/dispatch package tree. Main, the public API, value records, unchanged LegacyDesk and the independent ContractTests define the comparison boundary.

\`\`\`sh
javac --release 21 -Xlint:all -Werror -d classes @sources.txt
java -cp classes ContractTests base
java -cp classes ContractTests core
java -cp classes Main base
java -cp classes Main
\`\`\`

Run from the exported role folder. Baseline mode checks LegacyDesk and reports Baseline capstone contracts: 2433 passed. Core checks both the preserved baseline and the target selected by Composition, reporting Core capstone contracts: 4854 passed. Both Main modes print:

\`\`\`text
EMAIL: Hi
sent:a
200
sent:b
[a, b]
\`\`\`

Main base selects LegacyDesk; Main without arguments selects the target. Its complete source is:

\`\`\`java
import dispatch.Composition;
import dispatch.domain.Request;
import dispatch.domain.Request.Channel;
import dispatch.domain.Request.Priority;
import dispatch.legacy.LegacyDesk;
import dispatch.ports.DeskApi;
import dispatch.ports.NoticeSink;
public class Main {
    public static void main(String[] args) {
        if(args.length>1 || (args.length==1 && !args[0].equals("base")))throw new IllegalArgumentException("use base or no arguments");
        NoticeSink sink=message->System.out.println("sent:"+message.id());
        DeskApi desk=args.length==1?new LegacyDesk(sink):Composition.create(sink);
        Request first=new Request("a","Hi",Channel.EMAIL,Priority.NORMAL,2);
        System.out.println(desk.preview(first).rendered());
        desk.send(first);
        System.out.println(desk.find("a").orElseThrow().cents());
        desk.send(new Request("b","Ready",Channel.SMS,Priority.URGENT,3));
        System.out.println(desk.all().stream().map(message->message.id()).toList());
    }
}
\`\`\`

The preview prints EMAIL: Hi without a sent notification. Sending a then prints sent:a; find returns its cost 200. Sending b prints sent:b. The final immutable snapshot lists a,b. These are simulated callback observations, rather than actual delivery.

The independent oracle uses a separately written rate/prefix table across all 240 combinations: 20 copy counts, two channels, two priorities and three representative texts. It checks computation, storage, duplicates and effects. Boundary and failure cases add invalid input, snapshots, nested calls and notification failure. Passing these checks does not prove that duplicate rules were removed.

Tag or commit this baseline after export, retaining the exact source and check output. An IDE save or ZIP is a source checkpoint; Git creates the commit history. Keep one behavior-preserving change per commit, with matching checks and a clear rollback point. A desired output change belongs in a separately explained contract change.

### The actual cluttered source

The target initially has the same behavior and structure as the preserved LegacyDesk, with its class/package name changed. The complete preserved class is:

\`\`\`java
package dispatch.legacy;
import dispatch.domain.Dispatch;
import dispatch.domain.Request;
import dispatch.ports.DeskApi;
import dispatch.ports.NoticeSink;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
/** Preserved runnable baseline: rendering, rates, storage and orchestration are coupled. */
public final class LegacyDesk implements DeskApi {
    private final LinkedHashMap<String,Dispatch> sent=new LinkedHashMap<>();
    private final NoticeSink sink;
    private boolean busy;
    public LegacyDesk(NoticeSink sink) { this.sink=Objects.requireNonNull(sink,"sink"); }
    public Dispatch preview(Request request) {
        Objects.requireNonNull(request,"request");
        String rendered;
        int unit;
        if(request.channel()==Request.Channel.EMAIL) {
            rendered="EMAIL: "+request.text();
            unit=100;
        } else {
            rendered="SMS: "+request.text();
            unit=60;
        }
        if(request.priority()==Request.Priority.URGENT) {
            rendered="URGENT "+rendered;
            unit+=40;
        }
        return new Dispatch(request.id(),rendered,unit*request.copies());
    }
    public Dispatch send(Request request) {
        if(busy)throw new IllegalStateException("reentrant send");
        busy=true;
        try {
            Objects.requireNonNull(request,"request");
            if(sent.containsKey(request.id()))throw new IllegalArgumentException("duplicate id");
            String rendered;
            int unit;
            if(request.channel()==Request.Channel.EMAIL) {
                rendered="EMAIL: "+request.text();
                unit=100;
            } else {
                rendered="SMS: "+request.text();
                unit=60;
            }
            if(request.priority()==Request.Priority.URGENT) {
                rendered="URGENT "+rendered;
                unit+=40;
            }
            Dispatch result=new Dispatch(request.id(),rendered,unit*request.copies());
            sent.put(result.id(),result);
            sink.sent(result);
            return result;
        } finally { busy=false; }
    }
    public Optional<Dispatch> find(String id) { return Optional.ofNullable(sent.get(Request.key(id))); }
    public List<Dispatch> all() { return List.copyOf(sent.values()); }
}
\`\`\`

Locate the duplicated channel choice, prefix, rate and urgent adjustment in preview and send. A changed EMAIL price currently needs two target edits. Storage access and use-case order live in the same class, so replacing map behavior or isolating a computation failure also reaches the service implementation.

Diagnose three to five concrete pressures from those locations. Distinguish a repeated rule from a speculative feature. A small application with one fixed computation may need only a shared private helper. Extra interfaces add names, constructors, wiring and navigation that must earn their cost.

### A runnable first refactor

In the target Desk.send only, replace the duplicated block from String rendered through creation of Dispatch result with:

\`\`\`java
Dispatch result=preview(request);
\`\`\`

Keep the duplicate check before it and the insertion, sink call and finally block after it. Compile, run core and run Main again. This creates one target computation owner without moving storage or changing the public API. The supplied native verifier builds this actual intermediate and checks its behavior; \`CHECKPOINTS.md\` describes it.

Next choose one pressure. Move map operations behind a repository contract and verify again. Move computation behind a renderer contract when replacement or isolated tests justify it. Supply collaborators at construction and let a composition root choose concrete adapters. Update sources.txt whenever a Java file is added, moved or removed. Keep package declarations and paths consistent.

A pattern label is a description of the resulting responsibilities. Reproducing the reference's class count is not the grading criterion. Compare a helper-only design with the added seams using the actual change scenario.

### The complete reference and dependency direction

The reference has eighteen files, including fourteen Java files. It adds DispatchRepository, Renderer, MemoryDispatches, StandardRenderer and ArchitectureTests while preserving the baseline, public API and oracle. Its \`DECISIONS.md\` supplies a complete worked rationale.

Desk depends on domain values and ports. MemoryDispatches implements the storage contract; StandardRenderer implements the computation contract. Composition selects them and the sink. The application/domain/ports slice compiles without infrastructure or LegacyDesk, providing an executable dependency-direction check.

DispatchRepository.find validates a key and distinguishes absence. insert rejects null or duplicate values and appends a new id. all supplies an immutable insertion-order snapshot. MemoryDispatches implements that in process memory. Naming a repository creates no persistence or transaction guarantee.

Renderer receives a Request and returns a non-null Dispatch with the same id. Desk.preview validates the request, returned value and identity. A custom renderer may choose other rendering/cost behavior as an explicit replacement contract. StandardRenderer preserves the declared table. The service calls the renderer once for preview and once for each accepted send; a duplicate is rejected before another render.

The service retains orchestration and the mutation guard. A separate facade can be useful over a complex subsystem, but this DeskApi already gives callers a small workflow. The reference keeps the stable two-channel switch, a single synchronous sink and ordinary composition. A factory hierarchy, event bus, asynchronous queue or dependency-injection container needs an additional requirement.

Run the reference's controlled boundary checks with:

\`\`\`sh
java -cp classes ArchitectureTests
\`\`\`

They report Architecture capstone contracts: 30 passed. They substitute rendering, storage and notification, verify call order and count, reject null or changed-id results, and observe failure effects. These checks support this reference's seams; the learner's alternative design needs equivalent evidence.

### Failure order and state ownership

During send, the busy guard rejects a nested send before any nested mutation. It releases in finally after success, validation failure, renderer failure, storage failure or notification failure. A notification callback may read find/all or compute a preview. Those operations do not perform a send.

A computation error occurs before insertion. If insert throws, the service does not notify. A replacement store may have performed its own effects before throwing; the service supplies no rollback for arbitrary adapters. After a successful insert, a sink exception propagates while the dispatch remains stored. Retrying that id is then a duplicate. Record both the caller's exception and the actual stored state.

All collaborators are trusted synchronous code on one thread. The guard prevents the specified nested mutation; it provides neither a concurrency lock nor isolation of external callback effects.

### Measurements and decision evidence

Define counts before comparing them. Count the target separately from the deliberately retained LegacyDesk. Initially two target entrypoints own rate/rendering rules; the reference has one StandardRenderer.render owner. A price change touches one target file before and after, so files touched alone show no improvement. The number of rule locations is the revealing measure.

Count production Java files including Main and Composition but excluding *Tests.java: eight initially, twelve in the reference. Desk receives one collaborator initially and three afterward. These added types and dependencies have a cost. Do not convert those counts into unmeasured claims about development time.

In \`DECISIONS.md\` give the pressure, contract, simpler counterfactual, selected boundary, measured benefit and added cost. Demonstrate a replacement renderer or store with tests, identify one pattern deliberately not used, state one remaining tradeoff and retain a removal trigger. For example, removing independent substitution needs may make a direct helper preferable again.

The final packet contains the original/final dependency maps, before-and-after measurements with definitions, a small commit/check sequence, failure-state evidence and recoverable rollback identities. Use the reference as a comparison after producing an independent argument.

### Optional prefix-commit batching

After core, implement sendBatch on the same desk. The starter inherits an explicit unfinished optional method; its core remains fully runnable.

Reject a nested batch while send is active, including an empty batch. Require a non-null list, copy it and reject null elements before sending anything. Process the copied requests in order through send and return an immutable result list. An empty list returns an empty list.

If a later item fails, stop and propagate the error. For a,b,a,c on an empty desk, the first a and b commit, the repeated a fails as a duplicate, and c is untouched. If the sink throws for b in a,b,c, both a and b remain stored, while c is untouched. This is an explicit prefix-commit contract.

A callback clearing the caller's original list cannot change the captured run. Earlier callback effects and inserted records are not rolled back. Preserve ordinary send and its guard.

\`\`\`sh
java -cp classes ContractTests core
java -cp classes ContractTests
\`\`\`

Core stays at 4854 passed. The complete reference reports Complete capstone contracts: 4869 passed. Submit the copied-input trace, failure/prefix table, immutable-output check and unchanged core results alongside the reason this optional workflow is useful.
`
			},
			task(
				{
					id: "design-patterns-in-java-dpj10-capstone-refactor-curriculum-problem-framing-identify-three-to-five-real-design-pressures",
					title: "Problem Framing: Identify Three to Five Real Design Pressures",
					learningPath: "core",
					contentKind: "assignment",
					preserveInstructions: true,
					preserveAssignment: true,
					content: `Inspect target Desk.preview/send and the preserved LegacyDesk. Cite three to five concrete pressures, including the two rendering/rate locations, storage ownership and a difficult collaborator-failure test. Define the public behavior that must remain stable.

Compare a helper-only remedy with moving computation/storage behind ports. **Completion evidence:** Keep source locations, one real change scenario per selected pressure, expected benefit, added cost and a simpler rejected alternative. This is written diagnosis of the shared capstone.`
				},
				"pressure"
			),
			task(
				{
					id: "design-patterns-in-java-dpj10-capstone-refactor-curriculum-refactor-plan-choose-a-small-justified-pattern-set",
					title: "Refactor Plan: Choose a Small Justified Pattern Set",
					learningPath: "core",
					contentKind: "assignment",
					preserveInstructions: true,
					preserveAssignment: true,
					content: `Plan a small justified pattern set for the diagnosed pressures. Begin with the computation-only checkpoint, then choose whether separate storage/rendering seams earn their cost. Draw dependencies before and after, and keep the stable channel switch and single sink unless a stated requirement calls for more machinery.

**Completion evidence:** Keep ordered behavior-preserving steps, the relevant checks and rollback source for each, a simpler counterfactual and a removal trigger. Explain one pattern deliberately not used. This written plan precedes implementation.`
				},
				"plan"
			),
			task(
				{
					id: "design-patterns-in-java-dpj10-capstone-refactor-curriculum-implementation-pass-preserve-behavior-while-improving-structure",
					title: "Implementation Pass: Preserve Behavior While Improving Structure",
					learningPath: "core",
					contentKind: "assignment",
					preserveInstructions: true,
					preserveAssignment: true,
					ideImport: true,
					projectLink: javaCapstoneURL("starter"),
					solutionLink: javaCapstoneURL("solution"),
					content: `Continue the same runnable capstone. First centralize the repeated computation in target Desk.send through preview, preserving duplicate validation, insert-before-notice and finally order. Run core and Main, then introduce one justified seam at a time.

Update sources.txt and package paths when adding or moving Java files. Preserve LegacyDesk, the public API, value contracts and independent oracle. **Completion evidence:** Keep the exported source, small recoverable commits, matching core results, and the change/cost argument for each new boundary. No unfinished core methods are supplied; improve the working design.`
				},
				"implementation"
			),
			task(
				{
					id: "design-patterns-in-java-dpj10-capstone-refactor-curriculum-architecture-review-package-layout-seams-and-testability",
					title: "Architecture Review: Package Layout, Seams, and Testability",
					learningPath: "core",
					contentKind: "assignment",
					preserveInstructions: true,
					preserveAssignment: true,
					ideImport: true,
					projectLink: javaCapstoneURL("starter"),
					solutionLink: javaCapstoneURL("solution"),
					content: `Continue the same saved source. Draw app -> domain/ports, infrastructure -> domain/ports, and composition -> concrete implementations. Show an isolated app/domain/ports compilation, or equivalent proof for a justified alternative design.

Substitute a renderer or repository in a controlled test. Observe rendering/save/notice order, invalid result identity, snapshot ownership and post-commit sink failure. **Completion evidence:** Keep the dependency map, replacement source/check output, failure-state table and a simpler architecture comparison. The reference's ArchitectureTests reports 30 passed; equivalent evidence matters more than copying its class count.`
				},
				"architecture"
			),
			task(
				{
					id: "design-patterns-in-java-dpj10-capstone-refactor-curriculum-capstone-reflection-what-changed-and-what-stayed-simple",
					title: "Capstone Reflection: What Changed and What Stayed Simple?",
					learningPath: "core",
					contentKind: "assignment",
					preserveInstructions: true,
					preserveAssignment: true,
					content: `Compare the original target with the final design using defined rule-location, changed-file, dependency and setup counts. Count unchanged LegacyDesk separately. Explain a case where one file still needed editing even though duplicated target rules were removed.

**Completion evidence:** Keep the concrete improvement, added cost, one remaining tradeoff, one pattern deliberately not used and a removal trigger. Passing an unchanged starter establishes behavior and supplies no structural improvement evidence. This is written reflection.`
				},
				"reflection"
			),
			task(
				{
					id: "design-patterns-in-java-dpj10-capstone-refactor-curriculum-capstone-gate-characterize-before-change",
					title: "Capstone Gate: Characterize Before Change",
					learningPath: "core",
					contentKind: "assignment",
					preserveInstructions: true,
					preserveAssignment: true,
					ideImport: true,
					projectLink: javaCapstoneURL("starter"),
					solutionLink: javaCapstoneURL("solution"),
					content: `Open the runnable starter and export all thirteen files. Before editing, compile with Java 21 and run ContractTests base/core and both Main modes. Baseline reports 2433 passed, core 4854 passed; the five output lines are supplied in the reading.

Tag or commit this baseline after export. **Completion evidence:** Retain exact source/check identity, an invalid-input case, notification-after-commit observation, old/new snapshot trace and a clear rollback point. Keep the preserved legacy and independent table unchanged.`
				},
				"baseline"
			),
			task(
				{
					id: "design-patterns-in-java-dpj10-capstone-refactor-curriculum-capstone-evidence-and-rollback-packet",
					title: "Capstone Evidence and Rollback Packet",
					learningPath: "core",
					contentKind: "assignment",
					preserveInstructions: true,
					preserveAssignment: true,
					content: `Assemble the capstone evidence and rollback packet: original/final dependency maps, diagnosed change scenarios, decision records, small commit/check sequence, before-and-after measurements with definitions, replacement demonstration and failure-state table.

Include one pattern deliberately not used, one remaining cost and a clear rollback point for each major structural decision. **Completion evidence:** The source is runnable from its exported role folder, core preserves all declared behavior, and the structural claims are supported by source and observations. This is the shared project's written delivery packet.`
				},
				"packet"
			),
			task(
				{
					id: "design-patterns-in-java-dpj10-capstone-refactor-curriculum-core-project-capstone-refactor",
					title: "Core Project: Capstone Refactor",
					aliases: [
						"design-patterns-in-java-dpj10-capstone-refactor-curriculum-core-project",
						"dpj10-capstone-refactor-core-project",
						"design-patterns-in-java-dpj10-capstone-refactor-curriculum-dpj10-capstone-refactor-core-project"
					],
					learningPath: "core",
					contentKind: "assignment",
					preserveInstructions: true,
					preserveAssignment: true,
					ideImport: true,
					projectLink: javaCapstoneURL("starter"),
					solutionLink: javaCapstoneURL("solution"),
					content: `Complete a justified refactor of the same dispatch application. Keep its public behavior, immutable values, preserved baseline and independent oracle. Remove target computation duplication and justify any rendering/storage seams; a helper-only design can be appropriate when its stated requirements support it.

\`\`\`sh
javac --release 21 -Xlint:all -Werror -d classes @sources.txt
java -cp classes ContractTests base
java -cp classes ContractTests core
java -cp classes Main
\`\`\`

Baseline reports 2433 passed and core 4854 passed. Retain the exact five Main lines from the reading. Optional batching remains independent. **Completion evidence:** Submit source, \`CHECKPOINTS.md\` observations, completed \`DECISIONS.md\`, small commits/check output, dependency/replacement evidence and the rollback packet. Consult the separate reference after recording the independent design argument.`
				},
				"core"
			)
		],
		supplementalProjects: [
			task(
				{
					id: "design-patterns-in-java-dpj10-capstone-refactor-supplemental-understanding-check-capstone-refactor",
					title: "Understanding Check: Capstone Refactor",
					aliases: [
						"design-patterns-in-java-dpj10-capstone-refactor-supplemental-dpj10-capstone-refactor-diagnostic-checkpoint",
						"diagnostic-checkpoint-capstone-refactor",
						"diagnostic-checkpoint",
						"understanding-check",
						"design-patterns-in-java-dpj10-capstone-refactor-supplemental-diagnostic-checkpoint-capstone-refactor",
						"design-patterns-in-java-dpj10-capstone-refactor-supplemental-diagnostic-checkpoint",
						"design-patterns-in-java-dpj10-capstone-refactor-supplemental-understanding-check"
					],
					learningPath: "choice",
					contentKind: "assignment",
					preserveInstructions: true,
					preserveAssignment: true,
					content: `Evaluate five claims: a green unchanged starter completes the refactor; one file touched proves rule duplication removed; a Repository name guarantees persistence; a sink failure undoes insertion; a busy guard supplies thread safety.

Correct each using a concrete dispatch source location or trace. **Completion evidence:** Keep five reasoned corrections, a simpler design alternative and the boundary between behavioral tests and structural judgment. This optional check is written work.`
				},
				"understanding"
			),
			task(
				{
					id: "design-patterns-in-java-dpj10-capstone-refactor-supplemental-capstone-refactor-transfer-practice",
					title: "Capstone Refactor Transfer Practice",
					aliases: [
						"design-patterns-in-java-dpj10-capstone-refactor-supplemental-transfer-practice",
						"design-patterns-in-java-dpj10-capstone-refactor-supplemental-transfer-practice-capstone-refactor"
					],
					learningPath: "choice",
					contentKind: "assignment",
					preserveInstructions: true,
					preserveAssignment: true,
					content: `Use the supplied domain/API contract to design a new report-only client. Preview an urgent EMAIL request with two copies and surrounding spaces, then inspect an old snapshot after sending another id. Keep the core application unchanged.

Sketch replacing the renderer for that client and compare explicit injection with changing the stable default switch. **Completion evidence:** Keep exact original prefixes/costs, caller-owned presentation responsibility, snapshot/failure expectations and an added-cost/removal-trigger argument. This optional transfer worksheet assigns no separate starter.`
				},
				"transfer"
			),
			task(
				{
					id: "design-patterns-in-java-dpj10-capstone-refactor-supplemental-capstone-refactor-extension-practice",
					title: "Capstone Refactor Extension Practice",
					aliases: [
						"design-patterns-in-java-dpj10-capstone-refactor-supplemental-extension-practice",
						"design-patterns-in-java-dpj10-capstone-refactor-supplemental-extension-practice-capstone-refactor"
					],
					learningPath: "challenge",
					contentKind: "assignment",
					preserveInstructions: true,
					preserveAssignment: true,
					ideImport: true,
					projectLink: javaCapstoneURL("starter"),
					solutionLink: javaCapstoneURL("solution"),
					content: `After core, continue the same capstone and implement sendBatch. Reject a nested batch even when empty; copy a non-null list and reject null elements before effects. Delegate the captured requests to send in order and return immutable results.

Trace a,b,a,c with a duplicate, a,b,c with a throwing b sink, and a callback clearing the caller's list. Run core before/after (4854 passed), then the full harness (4869 passed). **Completion evidence:** Keep input-copy, committed-prefix and notification-failure traces, immutable output, unchanged core results and the reason for this optional workflow.`
				},
				"extension"
			)
		]
	};
}
