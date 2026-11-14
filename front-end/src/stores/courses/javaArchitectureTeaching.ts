import type { RawCourseModule, RawCourseModuleItem } from "./types";
import { courseAssetViewerUrl } from "@/modules/courseAssetPreview";
import {
	javaArchitectureModuleID,
	javaArchitectureURL
} from "@/modules/javaArchitectureResources";

function task(item: RawCourseModuleItem, section: string): RawCourseModuleItem {
	const path =
		"/course-assets/design-patterns-in-java/architecture-checks.md#";
	return {
		...item,
		content: `${item.content}\n\n[Case inputs](${courseAssetViewerUrl(
			`${path + section}-inputs`
		)}) · [Project self-check](${courseAssetViewerUrl(
			`${path + section}-answers`
		)})`
	};
}
export function completeJavaArchitecture(
	module: RawCourseModule
): RawCourseModule {
	if (
		module.title !==
		"DPJ8 Modern Extensions and Architecture-Level Patterns"
	) {
		return module;
	}
	return {
		...module,
		id: javaArchitectureModuleID,
		curriculum: [
			{
				title: "Modern Extensions and Architecture-Level Patterns Core Concepts",
				id: "design-patterns-in-java-dpj8-modern-extensions-and-architecture-level-patterns-curriculum-modern-extensions-and-architecture-level-patterns-core-concepts",
				aliases: [
					"design-patterns-in-java-dpj8-modern-extensions-and-architecture-level-patterns-curriculum-core-concepts-and-learning-sequence",
					"core-concepts",
					"design-patterns-in-java-dpj8-modern-extensions-and-architecture-level-patterns-curriculum-core-concepts"
				],
				content: `**Course flow:** Trace a notebook request from presentation command through an injected service, repository and notification port. Discover named text plugins through a real Java service-provider descriptor. Keep ownership, dependency direction, packaging and failure boundaries visible. The application check, plugin boundary and core project continue the same saved notebook; reflection and fitness activities are written work.

### Dependency direction and composition

Dependency injection supplies an object's collaborators from outside. NoteService receives a NoteRepository, PluginCatalog and NoteSink in its constructor. It can be tested with an in-memory repository or a different conforming implementation without selecting that implementation itself. Main is the composition root: it chooses infrastructure, discovers plugins and wires the application.

Dependency inversion places the repository/event contracts beside the application concepts that use them. The service imports domain values, ports and plugin API; infrastructure implements those contracts. Constructor injection alone does not guarantee that direction: a service receiving a concrete database adapter would still depend on it.

The repository answers storage questions: find by id, take an ordered snapshot, and save an immutable note. The service owns use-case policy: distinguish create from replace, select transformations, reject nested mutations, commit storage and notify. Those decisions give it work beyond forwarding calls. A small fixed program can use a direct function and ordinary collection when a separate boundary has no useful replacement or ownership purpose.

The supplied packages are:
- notes.domain: immutable Note and validation.
- notes.ports: NoteRepository and NoteSink contracts.
- notes.plugins: TextPlugin and PluginCatalog.
- notes.application: NoteService use cases.
- notes.infra: InMemoryNotes and two provider implementations.
- notes.ui: NoteViewModel and immutable presentation state.

Main may depend on all of them. Domain/ports do not depend on infrastructure or UI, and the service does not import those two packages. This direction permits the service and its contracts to compile without either adapter package.

### Complete explicit-injection example

The separate complete Main.java below uses a Store port, in-memory adapter, injected text processor and observer, Service and explicit presentation model. It illustrates the responsibility boundaries before the assigned notebook adds real plugin discovery.

\`\`\`java
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.function.Consumer;
import java.util.function.UnaryOperator;
/** Small explicit-injection example; the assigned pack adds actual ServiceLoader discovery. */
public class Main {
    public record Item(int id,String text) {
        public Item { if (id<=0) throw new IllegalArgumentException("positive id"); text=line(text); }
    }
    public static String line(String value) {
        Objects.requireNonNull(value,"text");
        if (value.indexOf('\\r')>=0 || value.indexOf('\\n')>=0) throw new IllegalArgumentException("single-line text");
        return value;
    }
    public interface Store {
        Optional<Item> find(int id);
        List<Item> all();
        void save(Item item);
    }
    public static final class Memory implements Store {
        private final Map<Integer,Item> items=new LinkedHashMap<>();
        public Optional<Item> find(int id) {
            if (id<=0) throw new IllegalArgumentException("positive id");
            return Optional.ofNullable(items.get(id));
        }
        public List<Item> all() { return List.copyOf(items.values()); }
        public void save(Item item) { Objects.requireNonNull(item,"item");items.put(item.id(),item); }
    }
    public static final class Service {
        private final Store store;
        private final UnaryOperator<String> processor;
        private final Consumer<Item> notices;
        private boolean busy;
        public Service(Store store,UnaryOperator<String> processor,Consumer<Item> notices) {
            this.store=Objects.requireNonNull(store,"store");
            this.processor=Objects.requireNonNull(processor,"processor");
            this.notices=Objects.requireNonNull(notices,"notices");
        }
        public List<Item> list() { return List.copyOf(store.all()); }
        public Item write(int id,String text) {
            if (busy) throw new IllegalStateException("reentrant mutation");
            busy=true;
            try {
                Item input=new Item(id,text);
                Item output=new Item(id,processor.apply(input.text()));
                store.save(output);notices.accept(output);return output;
            } finally { busy=false; }
        }
    }
    public record Screen(List<String> rows) { public Screen { rows=List.copyOf(rows); } }
    public static final class ViewModel {
        private final Service service;
        private Screen state=new Screen(List.of());
        public ViewModel(Service service) { this.service=Objects.requireNonNull(service,"service"); }
        public Screen state() { return state; }
        public void refresh() { state=new Screen(service.list().stream().map(item->item.id()+"="+item.text()).toList()); }
    }
    public static void main(String[] args) {
        Memory memory=new Memory();
        Service service=new Service(memory,text->text.toUpperCase(java.util.Locale.ROOT),
            item->System.out.println(item.id()+":"+item.text()));
        ViewModel view=new ViewModel(service);
        service.write(1,"hi");view.refresh();System.out.println(view.state().rows());
        service.write(2,"ready");System.out.println(view.state().rows());
        view.refresh();System.out.println(view.state().rows());
    }
}
\`\`\`

Main prints:

\`\`\`text
1:HI
[1=HI]
2:READY
[1=HI]
[1=HI, 2=READY]
\`\`\`

Service.write first validates a positive integer id and non-null single-line text, applies the processor, saves the immutable Item, then notifies. The processor chosen in Main uses Locale.ROOT uppercase. Duplicate ids replace an item while keeping its insertion position. Empty text is valid.

The first notification prints 1:HI before the caller prints the refreshed screen. The second notification prints 2:READY, but the next screen is the earlier snapshot because refresh has not run yet. The final refresh includes both items. Snapshot immutability preserves the old screen; it does not keep that screen automatically synchronized.

A processor exception or invalid result occurs before save. A notification exception occurs after save and leaves the item committed. Nested writes are rejected; finally releases the busy guard. The screen and repository lists are immutable snapshots. This complete example injects one processor explicitly; it contains no service-provider discovery or UI toolkit.

Keep its three files in their own folder:

\`\`\`sh
javac --release 21 -Xlint:all -Werror Main.java ContractTests.java
java ContractTests
java Main
\`\`\`

The worked harness reports Architecture worked contracts: 39 passed. The program reads no standard input and writes no files.

### The notebook model and repository contract

The assigned pack has fifteen files: twelve Java files, README.md, sources.txt and META-INF/services/notes.plugins.TextPlugin. Preserve both the src/notes package tree and the descriptor's exact path/capitalization.

Note is an immutable id/text record. Ids match [a-z][a-z0-9-]*: a and note-2 are valid; empty, Bad, 1a and spaces are rejected with IllegalArgumentException. Null causes NullPointerException. Text is non-null and excludes CR/LF, with empty text allowed. The record validates before a value can enter storage.

InMemoryNotes stores immutable Note values under their ids. Implement find to validate the id and return Optional.empty for absence. Implement save to reject null and upsert by the note's id. A replacement keeps that id's first-insertion position. Saving b, then a, then replacing b yields the order b,a.

Implement all to return an immutable insertion-order snapshot. Later saves leave an earlier returned list unchanged; callers cannot add, clear or replace its entries. The immutable record and String values make sharing those entries safe under this single-threaded contract.

A repository interface separates those promised operations from storage technology. This implementation is in memory and loses its contents when the process exits. A database implementation would have to satisfy the same ordering, value and failure contract or explicitly revise it; naming a class Repository supplies no persistence, transaction or concurrency guarantee.

### Plugin identity and pipeline selection

TextPlugin has id() and apply(String). Its id follows the same key grammar; each apply result must satisfy Note.line. PluginCatalog's supplied constructor captures a non-null iterable of non-null providers. It validates ids and rejects duplicates, even when different provider classes claim the same id. It captures the id-to-provider mapping at construction; a later id() change cannot rename the captured key.

availableIds returns a sorted immutable list. That display order is separate from execution order. Implement apply to validate input text, copy the requested names, resolve every requested name before invoking any provider, then run the selected occurrences in that requested order. Repeated names deliberately invoke the provider again. An empty pipeline returns the original valid text.

For suffix(x)=x+"!" and bracket(x)="["+x+"]", suffix then bracket gives [hi!], while bracket then suffix gives [hi]!. Two suffix occurrences give hi!!. The supplied upper provider uses Locale.ROOT; bracket surrounds literal text without an escaping convention.

A request [count,missing] must fail before count runs. This pre-resolution rule avoids executing a known early stage before discovering a missing later provider. During execution, validate each result immediately: null causes NullPointerException and CR/LF causes IllegalArgumentException. A provider exception propagates and stops the pipeline. Earlier provider side effects remain; the plugin API does not supply rollback. Copying the requested list also prevents a provider's changes to the caller's list from changing the selected run.

### Real ServiceLoader discovery and packaging

The descriptor META-INF/services/notes.plugins.TextPlugin contains these UTF-8 lines:

\`\`\`text
notes.infra.UppercasePlugin
notes.infra.BracketPlugin
\`\`\`

Its filename identifies the service interface; its lines identify provider classes. The two classpath providers implement TextPlugin and have public no-argument constructors. The descriptor and compiled classes must both reach the runtime classpath.

Implement discover with the supplied explicit non-null ClassLoader and ServiceLoader.load(TextPlugin.class, loader), then construct PluginCatalog from the loader's providers. The ServiceLoader API discovers and instantiates lazily when consumed. This wrapper iterates all providers in the catalog constructor, so its own discover call eagerly finishes registration or fails before returning.

ServiceLoader instances are not safe for concurrent use. The notebook and its collaborators run synchronously on one thread. Discovery executes trusted provider code in the process; it supplies no plugin isolation or permissions boundary. ServiceConfigurationError can arise while locating, loading or constructing a provider and propagates out of discover. If a later provider fails, earlier constructor effects are already possible.

Check zero, one, and multiple providers. Empty discovery yields an empty catalog, with no fallback. The shipped descriptor supplies two named providers. A one-line descriptor supplies just that provider; Main's requested pipeline still has to name only available ids. Provider listing order is not an application priority rule: apply uses the explicit requested pipeline.

For a timing experiment, add an observable constructor message to a provider in a temporary copy. Creating a ServiceLoader does not instantiate it. Iteration's next/provider retrieval can instantiate it, and malformed metadata can fail during iteration. A second traversal can reuse the loader's cached provider; a new notebook discover call creates a new loader/catalog. Restore the shipped descriptor and provider sources before using the baseline contract counts.

This pack uses the classpath JAR mechanism. A named-module design would instead declare uses/provides and appropriate module dependencies. Its module setup is a different deployment contract; this pack contains no module-info.java.

javac compiles classes without copying the provider descriptor. Package both explicitly:

\`\`\`sh
javac --release 21 -Xlint:all -Werror -d classes @sources.txt
jar --create --file notebook.jar -C classes . -C . META-INF
java -cp notebook.jar ContractTests core
java -cp notebook.jar Main
\`\`\`

Run from the exported role folder. The JAR includes classes and META-INF/services; its classpath command works without an operating-system-specific classpath separator. Missing metadata makes discovery empty; an unknown listed class can cause ServiceConfigurationError. A successful Java compile alone does not prove provider availability.

### Service policy, events and failures

NoteService receives its repository, plugin catalog and sink. Implement create to enter the guard, validate the id, reject an existing id, transform the candidate text, construct the Note, save it and call sink.saved with the committed value. Release the guard in finally. An existing id raises IllegalArgumentException.

Implement replace with the same ordering, but require an existing id; absence raises NoSuchElementException. Every accepted call saves and notifies, including an equal-text replacement. Invalid text, missing providers and provider errors occur before repository save. A repository save exception prevents sink invocation.

Storage commits before notification. If the sink throws after create("a","one",[]), the caller receives the error while a=one remains saved. Retrying create can then fail as a duplicate. A failed replacement notification similarly leaves the replacement committed. Earlier provider/sink effects and storage have no shared transaction.

The busy guard rejects nested create/replace/copy calls made during plugin or sink work before any nested mutation. Read-only list calls remain available, so a sink can observe the newly saved note. finally releases the guard after rejection, transformation failure or notification failure. Repositories must supply their declared operations without calling back into application mutations.

NoteSink is one event-delivery port. A composition root may route it to a logger, a UI adapter or an explicitly chosen multicast dispatcher. The supplied program uses one sink, so it promises neither an asynchronous queue nor subscriber registration. An event bus can decouple many producers/consumers but requires delivery order, failure policy and subscription ownership, as in DPJ7. Choosing a bus adds those lifecycle obligations.

### Presentation state, MVC and MVVM

NoteViewModel owns an immutable State containing display rows. Implement refresh to read the service's ordered notes, map each to id=text, then replace the state once the new rows are ready. It does not mutate the domain notes or the prior State.

The supplied add command calls service.create, then refreshes on success. If notification throws after the service commits, add propagates that failure and does not reach refresh. Handle the failure and refresh explicitly to display the committed state. This is a visible failure boundary; a cached presentation snapshot is separate from the repository.

| Pattern | Input and presentation responsibility | Application/domain boundary |
| --- | --- | --- |
| MVC | A controller handles input and selects view updates; the view renders model data. | Domain rules and service use cases remain outside the view/controller formatting. |
| MVVM | A view reads or binds presentation state and invokes view-model commands. | The view model calls application services and prepares display state. |

The supplied presentation model illustrates MVVM responsibilities through explicit refresh and add. Main prints its rows. It includes no graphical view, toolkit or automatic data binding. A controller-based version could call the same service and render a response directly. Select the separation according to the actual interaction and state-lifetime needs.

### Core, optional work and architecture fitness

The eight core methods are InMemoryNotes.find/all/save, PluginCatalog.discover/apply, NoteService.create/replace and NoteViewModel.refresh. The application check begins the repository methods; the plugin boundary continues discover/apply; the core project completes the service/presentation methods in that same saved notebook.

The untouched starter compiles and names the first unfinished repository lookup. A complete core reports Core architecture contracts: 102 passed. Main prints:

\`\`\`text
[bracket, upper]
a:[HI]
[a=[HI]]
a:[Ready]
[a=[Ready]]
1
\`\`\`

The first line lists available names. An accepted request for a applies upper then bracket, saves [HI], notifies a:[HI], and refreshes the view. Replacement saves [Ready] and notifies before the explicit refresh. The last line is the repository's one-note count.

Optional NoteService.copy requires an existing source and a new target, transforms the source text using the requested pipeline, saves under the target id and notifies afterward. It preserves the source and uses the same guard/failure boundaries. Core and Main work while copy is unfinished. The complete harness additionally checks it and reports Complete architecture contracts: 112 passed:

\`\`\`sh
java -cp notebook.jar ContractTests
\`\`\`

An architecture fitness check verifies a promised boundary under change. Compile the domain, ports, plugin API/catalog and service while excluding infrastructure/UI. Inject a different repository in tests. Check the JAR's descriptor inventory and replace a provider without changing service code. These checks support dependency direction and substitutability; they do not prove that every future adapter satisfies the contract.

Keep a dependency diagram, ordered provider/request traces, repository snapshot evidence, committed-state versus notification-failure table and explicit view-refresh trace. For each boundary, name one realistic change it makes easier, the added files/indirection, and a simpler design that would be sufficient for a fixed small application.

[ServiceLoader API](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/ServiceLoader.html) documents discovery, classpath metadata, lazy instantiation and failure behavior.
`,
				learningPath: "core",
				contentKind: "reading",
				preserveInstructions: true,
				ideImport: true,
				projectLink: javaArchitectureURL("example"),
				solutionLink: javaArchitectureURL("solution")
			},
			task(
				{
					title: "Modern Extensions and Architecture-Level Patterns Application Check",
					id: "design-patterns-in-java-dpj8-modern-extensions-and-architecture-level-patterns-curriculum-modern-extensions-and-architecture-level-patterns-application-check",
					aliases: [
						"design-patterns-in-java-dpj8-modern-extensions-and-architecture-level-patterns-curriculum-application-misconceptions-and-readiness-check",
						"application-check",
						"design-patterns-in-java-dpj8-modern-extensions-and-architecture-level-patterns-curriculum-application-check"
					],
					content: `Open the notebook starter and implement InMemoryNotes.find/all/save. Validate ids, distinguish absence with Optional.empty, and return immutable insertion-order snapshots. Save b, then a, then replace b; keep an earlier all() result while adding c.

Draw Main -> NoteService -> NoteRepository and InMemoryNotes -> NoteRepository. **Completion evidence:** Keep the b,a ordering trace, immutable old snapshot, invalid-id/null checks and one replacement implementation of the repository port. The remaining five core methods follow in the plugin/core activities.`,
					learningPath: "core",
					contentKind: "assignment",
					preserveInstructions: true,
					preserveAssignment: true,
					ideImport: true,
					projectLink: javaArchitectureURL("starter"),
					solutionLink: javaArchitectureURL("solution")
				},
				"application"
			),
			task(
				{
					title: "Reflection Question: When Does a Pattern Become Architecture?",
					id: "design-patterns-in-java-dpj8-modern-extensions-and-architecture-level-patterns-curriculum-reflection-question-when-does-a-pattern-become-architecture",
					content: `Explain which decisions belong to constructor injection, a repository, a service, a plugin catalog and presentation state. Contrast a class-level pattern with a cross-package dependency rule.

Compare the notebook with a direct fixed collection/function design and a notification service that has many subscribers. **Completion evidence:** Keep a concrete change scenario, dependency direction, state owner, added cost and a simpler alternative for each selected boundary. Explain what changes when a single sink becomes a multicast event bus. This is written reflection.`,
					learningPath: "core",
					contentKind: "assignment",
					preserveInstructions: true,
					preserveAssignment: true
				},
				"reflection"
			),
			task(
				{
					title: "ServiceLoader Plugin Boundary",
					id: "design-patterns-in-java-dpj8-modern-extensions-and-architecture-level-patterns-curriculum-serviceloader-plugin-boundary",
					content: `Continue the same notebook and implement PluginCatalog.discover/apply. Keep the exact META-INF/services/notes.plugins.TextPlugin descriptor and its two provider lines. Resolve every requested id before running any stage; preserve requested order and duplicates, validating every output.

Compare zero, one, and multiple providers in a temporary exported copy. With only upper registered, predict Main's request for upper,bracket. Replace a descriptor line with a missing provider class and explain where ServiceConfigurationError can arise. Observe an instrumented constructor before/after consuming a ServiceLoader; this catalog wrapper consumes it before returning. Restore the supplied baseline metadata afterward. **Completion evidence:** Keep descriptor/JAR inventory, discovery timing, [count,missing] side-effect trace, order/duplicate cases and the distinction between loading trusted code and isolating it. ServiceLoader instances are not safe for concurrent use.`,
					learningPath: "core",
					contentKind: "assignment",
					preserveInstructions: true,
					preserveAssignment: true,
					ideImport: true,
					projectLink: javaArchitectureURL("starter"),
					solutionLink: javaArchitectureURL("solution")
				},
				"plugins"
			),
			task(
				{
					title: "Architecture Pattern Scope and Fitness Contract",
					id: "design-patterns-in-java-dpj8-modern-extensions-and-architecture-level-patterns-curriculum-architecture-pattern-scope-and-fitness-contract",
					content: `Draw allowed imports among domain, ports, plugin API, application, infrastructure, UI and Main. Show why NoteService can compile without infrastructure/UI. Choose one architecture fitness check and specify its expected result and a violation it would catch.

Compare an injected fake repository with the supplied memory adapter, a third text plugin with changed service code, and a new screen format with changed domain code. **Completion evidence:** Keep the dependency diagram, package-only compilation or equivalent isolated check, two change scenarios, and one simpler design that would make the extra boundary unnecessary. This is a written/code-review checkpoint; no additional starter is assigned.`,
					learningPath: "core",
					contentKind: "assignment",
					preserveInstructions: true,
					preserveAssignment: true,
					projectLink: "https://docs.junit.org/current/user-guide/"
				},
				"fitness"
			),
			task(
				{
					title: "Core Project: Modern Extensions and Architecture-Level Patterns",
					id: "design-patterns-in-java-dpj8-modern-extensions-and-architecture-level-patterns-curriculum-core-project-modern-extensions-and-architecture-level-patterns",
					aliases: [
						"design-patterns-in-java-dpj8-modern-extensions-and-architecture-level-patterns-curriculum-core-project",
						"dpj8-modern-extensions-and-architecture-level-patterns-core-project",
						"design-patterns-in-java-dpj8-modern-extensions-and-architecture-level-patterns-curriculum-dpj8-modern-extensions-and-architecture-level-patterns-core-project"
					],
					content: `Complete the same notebook's eight core methods: InMemoryNotes.find/all/save, PluginCatalog.discover/apply, NoteService.create/replace and NoteViewModel.refresh. Preserve all fifteen files, including package paths and the case-sensitive service descriptor.

Export the saved work and run:
\`\`\`sh
javac --release 21 -Xlint:all -Werror -d classes @sources.txt
jar --create --file notebook.jar -C classes . -C . META-INF
java -cp notebook.jar ContractTests core
java -cp notebook.jar Main
\`\`\`

Core reports 102 passed. Main's exact six lines are in Core Concepts and the project self-check. Cover duplicate/missing notes, snapshot ownership, provider selection before effects, post-commit notification failure, mutation guard and stale/refreshed presentation state. Optional copy remains independent. **Completion evidence:** Keep source, dependency/ordering traces, the failure-state table and one simpler rejected alternative before consulting the separate reference.`,
					learningPath: "core",
					contentKind: "assignment",
					preserveInstructions: true,
					preserveAssignment: true,
					ideImport: true,
					projectLink: javaArchitectureURL("starter"),
					solutionLink: javaArchitectureURL("solution")
				},
				"core"
			)
		],
		supplementalProjects: [
			task(
				{
					title: "Understanding Check: Modern Extensions and Architecture-Level Patterns",
					id: "design-patterns-in-java-dpj8-modern-extensions-and-architecture-level-patterns-supplemental-understanding-check-modern-extensions-and-architecture-level-patterns",
					aliases: [
						"design-patterns-in-java-dpj8-modern-extensions-and-architecture-level-patterns-supplemental-dpj8-modern-extensions-and-architecture-level-patterns-diagnostic-checkpoint",
						"diagnostic-checkpoint-modern-extensions-and-architecture-level-patterns",
						"diagnostic-checkpoint",
						"understanding-check",
						"design-patterns-in-java-dpj8-modern-extensions-and-architecture-level-patterns-supplemental-diagnostic-checkpoint-modern-extensions-and-architecture-level-patterns",
						"design-patterns-in-java-dpj8-modern-extensions-and-architecture-level-patterns-supplemental-diagnostic-checkpoint",
						"design-patterns-in-java-dpj8-modern-extensions-and-architecture-level-patterns-supplemental-understanding-check"
					],
					content: `Evaluate five claims: A, constructor injection requires a container; B, a Repository name guarantees database persistence; C, successful javac proves ServiceLoader providers are packaged; D, a sink exception means storage did not change; E, an immutable view snapshot updates itself.

Correct each with a revealing notebook trace. Include an unknown later pipeline name, a duplicate provider id and a nested mutation. **Completion evidence:** Keep five reasoned corrections, the single-threaded assumption and a precise account of where each exception occurs. This optional check is written work.`,
					learningPath: "choice",
					contentKind: "assignment",
					preserveInstructions: true,
					preserveAssignment: true
				},
				"understanding"
			),
			task(
				{
					title: "Modern Extensions and Architecture Level Patterns Transfer Practice",
					id: "design-patterns-in-java-dpj8-modern-extensions-and-architecture-level-patterns-supplemental-modern-extensions-and-architecture-level-patterns-transfer-practice",
					aliases: [
						"design-patterns-in-java-dpj8-modern-extensions-and-architecture-level-patterns-supplemental-transfer-practice",
						"design-patterns-in-java-dpj8-modern-extensions-and-architecture-level-patterns-supplemental-transfer-practice-modern-extensions-and-architecture-level-patterns"
					],
					content: `Use the complete explicit-injection worked example. Write id2=hi, capture the repository list and refresh the view, then write id1=ready and replace id2=new. Predict storage order, earlier snapshots and a screen before/after refresh.

Let the processor return null, then use a sink that throws after a valid write. Explain the difference in storage. Sketch a controller rendering the service result directly and compare it with a cached view-model State. **Completion evidence:** Keep processor/save/notification order, old/new values, failure outcomes and the presentation responsibility comparison. This worksheet assigns no extra starter.`,
					learningPath: "choice",
					contentKind: "assignment",
					preserveInstructions: true,
					preserveAssignment: true
				},
				"transfer"
			),
			task(
				{
					title: "Modern Extensions and Architecture Level Patterns Extension Practice",
					id: "design-patterns-in-java-dpj8-modern-extensions-and-architecture-level-patterns-supplemental-modern-extensions-and-architecture-level-patterns-extension-practice",
					aliases: [
						"design-patterns-in-java-dpj8-modern-extensions-and-architecture-level-patterns-supplemental-extension-practice",
						"design-patterns-in-java-dpj8-modern-extensions-and-architecture-level-patterns-supplemental-extension-practice-modern-extensions-and-architecture-level-patterns"
					],
					content: `Complete core first, then continue the same notebook. Implement only NoteService.copy. Validate source/target ids, require an existing source and absent target, apply the requested pipeline to source text, save under the target id and notify after commit. Preserve the source and the existing mutation guard.

Copy a=one to b with a suffix plugin; include an existing target, missing source, unknown plugin and throwing sink. Run core before/after (102 passed), then the complete harness (112 passed). **Completion evidence:** Keep source/target snapshots, event order, failure-state table and unchanged core results.`,
					learningPath: "challenge",
					contentKind: "assignment",
					preserveInstructions: true,
					preserveAssignment: true,
					ideImport: true,
					projectLink: javaArchitectureURL("starter"),
					solutionLink: javaArchitectureURL("solution")
				},
				"extension"
			)
		]
	};
}
