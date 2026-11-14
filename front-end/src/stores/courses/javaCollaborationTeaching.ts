import type { RawCourseModule, RawCourseModuleItem } from "./types";
import { courseAssetViewerUrl } from "@/modules/courseAssetPreview";
import {
	javaCollaborationModuleID,
	javaCollaborationURL
} from "@/modules/javaCollaborationResources";

function task(item: RawCourseModuleItem, section: string): RawCourseModuleItem {
	const path =
		"/course-assets/design-patterns-in-java/collaboration-checks.md#";
	return {
		...item,
		content: `${item.content}\n\n[Case inputs](${courseAssetViewerUrl(
			`${path + section}-inputs`
		)}) · [Project self-check](${courseAssetViewerUrl(
			`${path + section}-answers`
		)})`,
		contentKind: "assignment",
		preserveInstructions: true,
		preserveAssignment: true
	};
}
export function completeJavaCollaboration(
	module: RawCourseModule
): RawCourseModule {
	if (module.title !== "DPJ7 Behavioral Patterns II") return module;
	return {
		...module,
		id: javaCollaborationModuleID,
		curriculum: [
			{
				id: "design-patterns-in-java-dpj7-behavioral-patterns-ii-curriculum-behavioral-patterns-ii-core-concepts",
				aliases: [
					"design-patterns-in-java-dpj7-behavioral-patterns-ii-curriculum-core-concepts-and-learning-sequence",
					"core-concepts",
					"design-patterns-in-java-dpj7-behavioral-patterns-ii-curriculum-core-concepts"
				],
				title: "Behavioral Patterns II Core Concepts",
				learningPath: "core",
				content: `**Course flow:** Follow a replacement request through validation, command execution, history and notification. Give each state snapshot and subscription an owner. Then add an independent operation over a stable node family. The application check and core project share one saved editor; reflection and lifecycle activities are written analyses.

### Six collaboration responsibilities

Observer lets a publisher notify registered consumers without naming their concrete classes. Registration identity, delivery order, subscription lifetime and listener failures are part of the contract. A callback list alone leaves those decisions unspecified.

Command packages a request and its lifecycle as an object. This editor's ReplaceCommand can execute once and undo once. A command abstraction can support queues or redo when those are explicitly implemented; the one-shot contract here assigns neither.

Memento captures an owner's prior state behind an opaque interface so it can be restored without exposing fields to the caretaker. Restoring preserves the document's identity. Prototype, by comparison, creates another configured object. This memento restores text only; it does not restore notifications or arbitrary external effects.

Chain of Responsibility sends a request through ordered checks. Each check can accept so the next stage runs, or reject and stop the chain. The editor's validation result separates an ordinary policy rejection from an exception.

Mediator owns interaction rules among components. EditorMediator connects validation, commands/history and event delivery, so those peers do not need references to each other. A Facade can offer a convenient workflow entry point; this coordinator also owns peer communication and its ordering. These roles can overlap. Centralized policy adds a risk of an oversized coordinator, so keep each peer's local responsibility explicit.

Visitor adds operations over a stable family of node types. Each node's accept selects the visitor method for that concrete type. TextVisitor and LeafCount traverse the same immutable tree for different results. Adding an operation adds a visitor; adding a new node type changes the visitor interface and its implementations. A direct method or switch can be simpler for one stable operation.

### Complete counter and expression example

The separate Main.java below contains all six roles. Counter owns opaque snapshots, Change packages an update/undo, Notices publishes captured registrations, gates form an ordered request chain, Coordinator owns their wiring/history, and Sum/Show are visitors over expressions.

\`\`\`java
import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.Deque;
import java.util.List;
import java.util.Objects;
import java.util.function.Consumer;
import java.util.function.IntPredicate;

public class Main {
    private static int bounded(int value) {
        if (value < 0 || value > 9) throw new IllegalArgumentException("value must be 0..9");
        return value;
    }
    public static final class Counter {
        private int value;
        public Counter(int value) { this.value = bounded(value); }
        public int value() { return value; }
        public void set(int value) { this.value = bounded(value); }
        public static final class Snapshot {
            private final Counter owner;
            private final int value;
            private Snapshot(Counter owner, int value) { this.owner=owner; this.value=value; }
        }
        public Snapshot save() { return new Snapshot(this,value); }
        public void restore(Snapshot snapshot) {
            Objects.requireNonNull(snapshot,"snapshot");
            if (snapshot.owner != this) throw new IllegalArgumentException("foreign snapshot");
            value=snapshot.value;
        }
    }
    public record Notice(int before, int after) {
        public Notice { bounded(before); bounded(after); }
    }
    public static final class Notices {
        @FunctionalInterface public interface Token extends AutoCloseable { @Override void close(); }
        private record Entry(Consumer<Notice> action, Object identity) {}
        private final List<Entry> entries=new ArrayList<>();
        public Token subscribe(Consumer<Notice> listener) {
            Entry entry=new Entry(Objects.requireNonNull(listener,"listener"),new Object());
            entries.add(entry); return () -> entries.remove(entry);
        }
        public void publish(Notice notice) {
            Objects.requireNonNull(notice,"notice");
            for (Entry entry : List.copyOf(entries)) entry.action().accept(notice);
        }
    }
    public static final class Change {
        private final Counter counter;
        private final int after;
        private Counter.Snapshot before;
        private boolean executed,undone;
        public Change(Counter counter,int after) { this.counter=Objects.requireNonNull(counter,"counter"); this.after=bounded(after); }
        public void execute() {
            if (executed) throw new IllegalStateException("already executed");
            before=counter.save(); counter.set(after); executed=true;
        }
        public void undo() {
            if (!executed || undone || counter.value()!=after) throw new IllegalStateException("undo unavailable");
            counter.restore(before); undone=true;
        }
    }
    public static final class Coordinator {
        private final Counter counter=new Counter(0);
        private final List<IntPredicate> gates;
        private final Notices notices;
        private final Deque<Change> history=new ArrayDeque<>();
        private boolean busy;
        public Coordinator(List<IntPredicate> gates,Notices notices) {
            this.gates=List.copyOf(gates); this.notices=Objects.requireNonNull(notices,"notices");
        }
        public int value() { return counter.value(); }
        public int depth() { return history.size(); }
        private void enter() { if (busy) throw new IllegalStateException("reentrant operation"); busy=true; }
        public boolean request(int value) {
            enter();
            try {
                bounded(value);
                for (IntPredicate gate : gates) if (!gate.test(value)) return false;
                int before=counter.value(); Change command=new Change(counter,value);
                command.execute(); history.push(command);
                notices.publish(new Notice(before,counter.value())); return true;
            } finally { busy=false; }
        }
        public boolean undo() {
            enter();
            try {
                if (history.isEmpty()) return false;
                int before=counter.value(); history.peek().undo(); history.pop();
                notices.publish(new Notice(before,counter.value())); return true;
            } finally { busy=false; }
        }
    }
    public sealed interface Expr permits Value, Add { <R> R accept(Visitor<R> visitor); }
    public interface Visitor<R> { R value(Value node); R add(Add node); }
    public record Value(int number) implements Expr {
        public Value { bounded(number); }
        public <R> R accept(Visitor<R> visitor) { return Objects.requireNonNull(Objects.requireNonNull(visitor,"visitor").value(this),"result"); }
    }
    public record Add(Expr left,Expr right) implements Expr {
        public Add { Objects.requireNonNull(left,"left"); Objects.requireNonNull(right,"right"); }
        public <R> R accept(Visitor<R> visitor) { return Objects.requireNonNull(Objects.requireNonNull(visitor,"visitor").add(this),"result"); }
    }
    public static final class Sum implements Visitor<Integer> {
        public Integer value(Value node) { return node.number(); }
        public Integer add(Add node) { return Math.addExact(node.left().accept(this),node.right().accept(this)); }
    }
    public static final class Show implements Visitor<String> {
        public String value(Value node) { return Integer.toString(node.number()); }
        public String add(Add node) { return "("+node.left().accept(this)+"+"+node.right().accept(this)+")"; }
    }
    public static void main(String[] args) {
        Notices notices=new Notices(); notices.subscribe(n -> System.out.println(n.before()+"->"+n.after()));
        Coordinator coordinator=new Coordinator(List.of(value -> value>0,value -> value<=5),notices);
        System.out.println(coordinator.request(2)); System.out.println(coordinator.request(0));
        System.out.println(coordinator.undo());
        Expr expression=new Add(new Value(2),new Value(3));
        System.out.println(expression.accept(new Show())); System.out.println(expression.accept(new Sum()));
    }
}
\`\`\`

Main prints these seven lines:

\`\`\`text
0->2
true
false
2->0
true
(2+3)
5
\`\`\`

Counter and Value leaves accept integers 0 through 9. Sum can produce a larger result and uses checked int addition. The configured gates require a positive requested value no greater than 5. Request 2 commits before its observer prints 0->2; the caller then prints true. Request 0 is valid model data but fails the first gate, so no command/history/event is added. Undo restores 0, pops history, notifies, then returns true.

Each Notices registration has an independent identity. Closing one of two registrations for the same Consumer leaves the other active. Publication captures its registration list before calling listeners. An exception stops later calls; earlier effects remain. Counter snapshots belong to their original Counter, and Change rejects repeated execution, repeated undo and a different current value.

The expression tree has immutable ordered children. Show renders literal parentheses/addition notation; Sum evaluates it. Each accept rejects a null visitor/result. A bounded recursive depth is assumed. For a single small operation, an ordinary function can be sufficient.

\`\`\`sh
javac --release 21 -Xlint:all -Werror Main.java ContractTests.java
java ContractTests
java Main
\`\`\`

Keep the three complete worked files in their own folder. The harness reports Collaboration worked contracts: 50 passed. Main reads no input and writes no files.

### Editor state and owner-bound snapshots

The assigned pack has thirteen files: Main.java, ContractTests.java, README.md, sources.txt and nine Java files under src/editor. sources.txt lists all eleven Java files. Keep the package tree intact.

TextDocument owns a non-null String excluding CR and LF. Empty text is valid. Null causes NullPointerException; CR/LF causes IllegalArgumentException. replace validates before changing the field.

snapshot returns a fresh opaque Snapshot storing this document's identity and its current immutable String. The snapshot's constructor and fields are private. Implement restore to reject null, reject a different owner before changing text, then restore the captured value. A foreign snapshot causes IllegalArgumentException. Repeated restoration of the same valid snapshot is allowed.

For document A containing a, capture a snapshot, replace with b, then restore: the original document again contains a. A snapshot from another document is rejected even if its text is also a. This owner binding makes the restore boundary visible; it is an in-memory object contract without serialized persistence or distributed identity.

### Observer membership and lifetime

The supplied collaboration model runs synchronously on one thread. Its capture and busy-guard rules describe callback ordering; concurrent access requires a separate synchronization contract.

EditEvent is an immutable record containing Kind.REPLACE or Kind.UNDO plus valid before/after text. EventBus.subscribe takes a non-null Consumer<EditEvent> and returns a Subscription. Every call creates a distinct registration, including repeated calls with the same Consumer. size counts active registrations.

Subscription extends AutoCloseable and narrows close to throw no checked exception. Its implementation is idempotent: close removes that registration; closing it again has no additional effect. A token can also be used in a try-with-resources scope. Retaining a token gives its owner an explicit way to stop future subscription membership.

Implement publish to reject null, capture current registrations, and invoke each captured consumer once in registration order. Closing B during A's callback leaves B in that already captured list. Adding C during A's callback makes C eligible for a later capture, not the current event. Thus a first publication with A/B can produce A,B while the next produces A,C.

A listener may publish another event. That nested call captures a new list and runs synchronously before the outer callback returns. With A publishing one guarded inner event and B receiving both, the call order is A:outer, A:inner, B:inner, B:outer. Reentrant logic must remain bounded; an unconditional republish loop can exhaust the stack.

If a listener throws, propagate that exception and stop later listeners. Do not retry or reverse earlier callback effects. Observer is multicast with a specified failure policy; it is not the validation chain's first-rejection decision.

### Command lifecycle and stale undo

ReplaceCommand retains a non-null TextDocument and a replacement validated at construction. It begins NEW. Implement execute to reject any other phase, take the snapshot at execution time, replace the text and move to DONE.

Taking the snapshot at construction would be too early. Construct a command for B while the document contains A, externally change the document to C, then execute: undo must later restore C.

Implement undo to require DONE and current document text equal to the applied replacement. A different current value raises IllegalStateException, leaves the model unchanged and keeps the command DONE. Otherwise restore the captured memento and move to UNDONE. Repeated execute/undo and execute after undo are rejected. This is a one-shot command without redo.

The stale guard is value-based. An external same-value edit cannot be distinguished from unchanged text. A revision-based model would need a different history contract. Within EditorMediator the document is privately owned and only its coordinated operations mutate it, so normal LIFO undo restores the previous command's expected value.

### Ordered validation chain

Validation copies its non-null list of non-null Checks. Changes to the caller's original list leave the chain unchanged. Each check returns a non-null Verdict. An accepted Verdict has an empty reason; a rejected Verdict requires a nonblank single-line reason.

Implement check to validate candidate text before any stage, call stages once in order, and return the first rejection without calling later stages. An empty chain accepts. A null result raises NullPointerException; a stage exception propagates immediately. Earlier stage effects, if any, remain the stage author's responsibility.

The supplied nonBlank rejects whitespace-only text. maxLength rejects values whose String.length exceeds its nonnegative limit; that length counts UTF-16 code units. For the configured nonBlank/maxLength(12) chain, "Checked" passes and " " fails the first stage. CR/LF or null are model-level invalid calls and fail before any check. Validation policy applies to replacement requests; constructor/undo use the model's valid-text boundary.

### Mediator ordering and failure boundary

EditorMediator privately creates its TextDocument and receives Validation and EventBus collaborators. text and undoDepth expose read-only observations. No document getter exposes the model for outside mutation.

Implement replace with this sequence: enter the busy guard, validate the candidate through the chain, return false on rejection, otherwise capture old text, execute a ReplaceCommand, push it onto history and publish one REPLACE event. Release the guard in finally on every path.

Implement undo to enter the same guard, return false when history is empty, otherwise read old text, undo the top command, pop it and publish one UNDO event. History is a Deque used as a LIFO stack. Undo restores prior model state without rerunning replacement checks.

Every accepted replacement, including an equal-text replacement, creates a command/history entry and an event. A rejected candidate leaves text/history/events unchanged. Main's " " case illustrates ordinary rejection; invalid API text throws.

Model/history commit before notification. If an observer throws after replacement B, the caller receives that exception while the model is B and undo depth has increased. If an observer throws during undo, the restoration and history pop remain committed. These calls promise no atomic external rollback. Blindly retrying a notified edit can add another history entry; observe the state and apply the declared failure policy.

Nested replace/undo during validation or notification raises IllegalStateException before mutation. The outer operation's finally releases the guard even after a failure. Read-only observations are allowed during callbacks and see the committed state at notification time. For A -> replace B -> replace C -> undo -> undo, text/depth progress B:1, C:2, B:1, A:0.

### Visitor operations and tree ownership

Nodes.Node is a sealed family of Text and Group records. Text validates the same non-null/CR/LF boundary. Group captures an unmodifiable ordered child list, preserving duplicates and identities and rejecting null. Immutable Strings and the closed immutable child family make the ordinary tree data immutable.

Text.accept invokes visitor.text(this); Group.accept invokes visitor.group(this). Each rejects a null visitor and null result. The node chooses the typed operation; the visitor supplies the operation's behavior. This is the two-dispatch structure to trace.

TextVisitor.text is supplied. Implement group by visiting each child occurrence in order, collecting its String and surrounding the comma-joined results with brackets. Empty group returns []; a nested example is [a,[b,c],a]. Its literal bracket/comma notation has no escaping convention.

LeafCount is a separate supplied visitor: every Text occurrence counts 1, including empty text; groups sum child counts with checked int addition. The nested example above counts 4. A shared subtree is visited once per occurrence, not once per object identity. Traversal cost follows those occurrences and uses a bounded recursive depth. A visited-set or caching policy would change that contract.

### Core and optional completion

The eight core methods are TextDocument.restore, EventBus.publish, ReplaceCommand.execute/undo, Validation.check, EditorMediator.replace/undo and TextVisitor.group. The application check begins the snapshot/dispatch/command methods; the core project completes the same saved attempt. The full core harness requires all eight methods.

\`\`\`sh
javac --release 21 -Xlint:all -Werror -d classes @sources.txt
java -cp classes ContractTests core
java -cp classes Main
\`\`\`

The untouched starter compiles and names the first unfinished method. Completed core reports Core collaboration contracts: 130 passed. Main prints:

\`\`\`text
replace:Ready->Checked
true
false
undo:Checked->Ready
true
Ready:0
[a,[b,c]]
3
\`\`\`

Optional EventBus.subscribeOnce must invoke its registration at most once across nested publications, remove its live registration before calling the consumer, and guard older captured lists from invoking it again. Set the per-registration fired state before the callback; a throwing callback still consumes the invocation. Closing a token retains the normal captured-list semantics for an in-flight event.

A nested publication can reach the once listener before an older outer list reaches it. The expected order for lead/once/tail is lead:outer, lead:inner, once:inner, tail:inner, tail:outer. A fired guard prevents a second once:outer call after returning from the inner publication.

Core/Main work while subscribeOnce is unfinished. The full java -cp classes ContractTests harness additionally checks it and reports Complete collaboration contracts: 142 passed.

Keep subscription ownership/order, snapshot and command phases, first-rejection traces, committed-state versus notification failure, and two visitor operations alongside the code. Explain one simpler alternative and the added cost of the selected boundaries.

[Consumer](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/function/Consumer.html) defines the callback shape. [AutoCloseable](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/lang/AutoCloseable.html) defines the closing interface; this Subscription adds its own lifetime contract. [Deque](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/Deque.html) documents the stack operations used for history.
`,
				contentKind: "reading",
				preserveInstructions: true,
				ideImport: true,
				projectLink: javaCollaborationURL("example"),
				solutionLink: javaCollaborationURL("solution")
			},
			task(
				{
					id: "design-patterns-in-java-dpj7-behavioral-patterns-ii-curriculum-behavioral-patterns-ii-application-check",
					aliases: [
						"design-patterns-in-java-dpj7-behavioral-patterns-ii-curriculum-application-misconceptions-and-readiness-check",
						"application-check",
						"design-patterns-in-java-dpj7-behavioral-patterns-ii-curriculum-application-check"
					],
					title: "Behavioral Patterns II Application Check",
					learningPath: "core",
					content: `Open the shared editor starter. Implement TextDocument.restore, EventBus.publish and ReplaceCommand.execute/undo. Begin with snapshot owner validation, then captured subscription order and one-shot command phases. The other four core methods remain the next step.

Capture A's text a, replace with b and restore; also try B's snapshot. Register A/B callbacks, let A close B and register C during delivery, and predict first/next publication. Construct a command for B, change its target from A to C before execute, then undo. **Completion evidence:** Keep ownership, callback order and NEW/DONE/UNDONE traces plus a different-value stale undo. The full core harness requires all eight methods.`,
					ideImport: true,
					projectLink: javaCollaborationURL("starter"),
					solutionLink: javaCollaborationURL("solution")
				},
				"application"
			),
			task(
				{
					id: "design-patterns-in-java-dpj7-behavioral-patterns-ii-curriculum-reflection-question-which-pattern-owns-the-conversation",
					title: "Reflection Question: Which Pattern Owns the Conversation?",
					learningPath: "core",
					content: `Compare notification subscribers, first-rejection validation stages and centralized peer coordination. Identify who selects recipients, who stops processing and who owns model/history/event ordering.

Compare Memento restoring an existing model with Prototype creating a new object, and Visitor adding an operation with adding a new node type. **Completion evidence:** Keep five responsibility/cost decisions, one rejected simpler alternative and an example where a direct function or ordinary callback is sufficient. This is a written reflection.`
				},
				"reflection"
			),
			task(
				{
					id: "design-patterns-in-java-dpj7-behavioral-patterns-ii-curriculum-event-command-and-undo-lifecycle-contract",
					title: "Event, Command, and Undo Lifecycle Contract",
					learningPath: "core",
					content: `Trace four independent failures: A, foreign document snapshot; B, stale undo after an external different-value edit; C, a replacement whose first observer throws; D, an undo whose observer throws.

For each, record text, command phase/history depth, exception and later action availability. For C, close the bad subscription and undo. Also try nested replace/undo inside notification and describe which state read-only observers see. **Completion evidence:** Keep the phase/commit table, callback order and a precise distinction between restoring model text and reversing external effects.`
				},
				"lifecycle"
			),
			task(
				{
					id: "design-patterns-in-java-dpj7-behavioral-patterns-ii-curriculum-core-project-behavioral-patterns-ii",
					aliases: [
						"design-patterns-in-java-dpj7-behavioral-patterns-ii-curriculum-core-project",
						"dpj7-behavioral-patterns-ii-core-project",
						"design-patterns-in-java-dpj7-behavioral-patterns-ii-curriculum-dpj7-behavioral-patterns-ii-core-project"
					],
					title: "Core Project: Behavioral Patterns II",
					learningPath: "core",
					content: `Complete the same saved editor's eight methods: TextDocument.restore, EventBus.publish, ReplaceCommand.execute/undo, Validation.check, EditorMediator.replace/undo and TextVisitor.group. Keep all thirteen files and src/editor intact.

Export the saved project and run:
\`\`\`sh
javac --release 21 -Xlint:all -Werror -d classes @sources.txt
java -cp classes ContractTests core
java -cp classes Main
\`\`\`

Core reports 130 passed. Main's exact eight lines are in Core Concepts and the project self-check. Cover duplicate subscriptions, in-flight unsubscribe/add, reentrant publication, one-shot/stale undo, first rejection, post-commit notification failure, busy-guard release and both visitor operations. Optional subscribeOnce remains independent. **Completion evidence:** Keep implementation, ownership/order traces, failure-state table and a simpler rejected alternative before consulting the separate reference.`,
					ideImport: true,
					projectLink: javaCollaborationURL("starter"),
					solutionLink: javaCollaborationURL("solution")
				},
				"core"
			)
		],
		supplementalProjects: [
			task(
				{
					id: "design-patterns-in-java-dpj7-behavioral-patterns-ii-supplemental-understanding-check-behavioral-patterns-ii",
					aliases: [
						"design-patterns-in-java-dpj7-behavioral-patterns-ii-supplemental-dpj7-behavioral-patterns-ii-diagnostic-checkpoint",
						"diagnostic-checkpoint-behavioral-patterns-ii",
						"diagnostic-checkpoint",
						"understanding-check",
						"design-patterns-in-java-dpj7-behavioral-patterns-ii-supplemental-diagnostic-checkpoint-behavioral-patterns-ii",
						"design-patterns-in-java-dpj7-behavioral-patterns-ii-supplemental-diagnostic-checkpoint",
						"design-patterns-in-java-dpj7-behavioral-patterns-ii-supplemental-understanding-check"
					],
					title: "Understanding Check: Behavioral Patterns II",
					learningPath: "choice",
					content: `Evaluate five claims: A, close must remove a consumer from an already captured event; B, undo always reverses every observer effect; C, validation stages all run after an earlier rejection; D, a failed notification means no edit happened; E, Visitor makes adding both operations and node types equally local.

Correct each with a revealing trace from the contracts. Include duplicate registration identity, a same-value limitation of stale detection and a null visitor result. **Completion evidence:** Keep five reasoned corrections and the single-threaded, bounded-reentrancy assumptions. This optional check is written work.`
				},
				"understanding"
			),
			task(
				{
					id: "design-patterns-in-java-dpj7-behavioral-patterns-ii-supplemental-behavioral-patterns-ii-transfer-practice",
					aliases: [
						"design-patterns-in-java-dpj7-behavioral-patterns-ii-supplemental-transfer-practice",
						"design-patterns-in-java-dpj7-behavioral-patterns-ii-supplemental-transfer-practice-behavioral-patterns-ii"
					],
					title: "Behavioral Patterns II Transfer Practice",
					learningPath: "choice",
					content: `Use the complete counter/expression example with gates value>0 and value<=5. Predict requests 0, 2, 6 and 10 as independent cases from initial 0. Then accept 2, let notification throw, close the bad token and undo.

For Add(Value(2),Add(Value(3),Value(4))), predict Show and Sum. Describe the changes needed for a new visitor operation versus a new node type. **Completion evidence:** Keep rule/call order, committed value/history after notification failure, undo results and both visitor outputs. This worksheet assigns no additional starter pack.`
				},
				"transfer"
			),
			task(
				{
					id: "design-patterns-in-java-dpj7-behavioral-patterns-ii-supplemental-behavioral-patterns-ii-extension-practice",
					aliases: [
						"design-patterns-in-java-dpj7-behavioral-patterns-ii-supplemental-extension-practice",
						"design-patterns-in-java-dpj7-behavioral-patterns-ii-supplemental-extension-practice-behavioral-patterns-ii"
					],
					title: "Behavioral Patterns II Extension Practice",
					learningPath: "challenge",
					content: `Complete core first, then continue the same saved editor. Implement only EventBus.subscribeOnce. Retain normal captured-list closing semantics while enforcing one invocation across nested or older dispatch snapshots, and remove the live registration before invoking its consumer.

Use lead/once/tail registrations. On its first outer event, lead publishes one inner event. Predict the complete order and a subsequent event. Also test a throwing once consumer and a token closed before publication. Run core before/after (130 passed), then the full harness (142 passed). **Completion evidence:** Keep the fired/registration lifetime trace, nested order and unchanged core results.`,
					ideImport: true,
					projectLink: javaCollaborationURL("starter"),
					solutionLink: javaCollaborationURL("solution")
				},
				"extension"
			)
		]
	};
}
