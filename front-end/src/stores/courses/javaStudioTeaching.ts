import type { RawCourseModule } from "./types";
import type { JavaStudioKey } from "@/modules/javaStudioResources";
import { courseAssetViewerUrl } from "@/modules/courseAssetPreview";
import { javaStudioURL } from "@/modules/javaStudioResources";

const lessons: Record<
	string,
	{ key: JavaStudioKey; section: string; content: string }
> = {
	"Strategy Selection Refactor: Core Concepts": {
		key: "strategy",
		section: "concepts",
		content:
			"Strategy places interchangeable algorithms behind one operation. Here Plan is a closed choice of BULK, FLAT or MEMBER. PricingRule is a function from a validated quantity to integer cents. CartPricer selects a rule; quote and receipt must agree about the same order. A rule object owns an algorithm, while CartPricer owns selection and receipt formatting.\n\nThe starter repeats pricing in quote and receipt. Extracting one helper removes that duplication without introducing a strategy map. The reference instead has BulkRule, FlatRule and MemberRule behind PricingRule; MemberRule reuses BulkRule. Compare the actual change pressure and file/setup cost. Passing the same output checks establishes behavior preservation, while the dependency map and decision record establish what structural change occurred.\n\n### Supplied contract\n\nQuantities are whole integers from 0 through 1000. Prices are whole cents. Plans are BULK, FLAT and MEMBER.\n\n| Plan | Unit price or rule |\n| --- | --- |\n| BULK, 0–4 units | 350 cents per unit |\n| BULK, 5–9 units | 300 cents per unit |\n| BULK, 10–1000 units | 250 cents per unit |\n| FLAT | 400 cents per unit |\n| MEMBER | 90% of the BULK total, using integer arithmetic |\n\n`CartPricer.quote(plan, units)` returns the total. `receipt` returns exactly `PLAN|units|total`. Null plan raises NullPointerException before quantity validation. An out-of-range quantity raises IllegalArgumentException. The same inputs can be reused; these operations have no external effects. PricingRule implementations receive an already validated quantity.\n\nFor six units, BULK = 1800, FLAT = 2400 and MEMBER = 1620 cents. Bulk boundaries are 4 → 1400, 5 → 1500, 9 → 2700 and 10 → 2500. Zero costs zero for every built-in plan.\n\n### Native Java workflow\n\nUse JDK 21 and keep the exported role folder together, including its src packages and sources.txt. The starter already passes core. The optional operation is deliberately unfinished there.\n\n```sh\njavac --release 21 -Xlint:all -Werror -d classes @sources.txt\njava -cp classes ContractTests base\njava -cp classes ContractTests core\njava -cp classes Main base\njava -cp classes Main\n```"
	},
	"Strategy Selection Refactor: Guided Example": {
		key: "strategy",
		section: "example",
		content:
			'For six units, BULK is 6\u00D7300 = 1800 cents, FLAT is 6\u00D7400 = 2400 and MEMBER is 1800\u00D790/100 = 1620. receipt(BULK,6) is BULK|6|1800. At the thresholds, BULK 4 is 1400, 5 is 1500, 9 is 2700 and 10 is 2500. The whole-order rate change can reduce a total. It is the supplied behavior to preserve.\n\nTrace quote and receipt in the working starter, then in the reference. Mark both original decision sites and the reference\'s single selection map. The matching totals establish the contract; the source trace identifies the changed responsibilities. The optional priceUsing method is separate from core selection.\n\n\n### Complete supplied driver\n\n```java\nimport pricing.CartPricer;\nimport pricing.Plan;\nimport pricing.legacy.LegacyPricer;\n\npublic final class Main {\n    public static void main(String[] args) {\n        if (args.length > 0 && args[0].equals("base")) {\n            LegacyPricer cart = new LegacyPricer();\n            System.out.println(cart.quote(Plan.BULK, 6));\n            System.out.println(cart.quote(Plan.FLAT, 6));\n            System.out.println(cart.quote(Plan.MEMBER, 6));\n            System.out.println(cart.receipt(Plan.BULK, 6));\n        } else {\n            CartPricer cart = new CartPricer();\n            System.out.println(cart.quote(Plan.BULK, 6));\n            System.out.println(cart.quote(Plan.FLAT, 6));\n            System.out.println(cart.quote(Plan.MEMBER, 6));\n            System.out.println(cart.receipt(Plan.BULK, 6));\n        }\n    }\n}\n```\n\nBoth modes print 1800, 2400, 1620 and BULK|6|1800 on separate lines.\n\nCompile with the commands in Core Concepts; compare Main base with Main after each structural step.'
	},
	"Core Project: Strategy Selection Refactor": {
		key: "strategy",
		section: "core",
		content:
			"Refactor CartPricer so quote and receipt share one pricing decision. Preserve LegacyPricer, Main and ContractTests. First route receipt through quote and keep core green. Then compare that helper-only intermediate with the reference's three PricingRule implementations and one Plan selection map. MEMBER delegates its underlying bulk calculation. Update sources.txt for added classes, keeping the public quote/receipt contract unchanged.\n\nRecord the before/after decision sites, the added collaborators and one future rule change. Keep a reason to retain or remove each abstraction. The starter already returns the required values; the project deliverable is a justified structural refactor with the protected behavior still passing.\n"
	},
	"Review: Strategy Selection Refactor": {
		key: "strategy",
		section: "review",
		content:
			"Compare the legacy duplicate calculation, helper-only intermediate and selected rule composition. For each, locate the selection decision, quote and receipt rule reuse, and the change needed to add one algorithm. Explain the distinction between a closed Plan enum and optional caller-supplied PricingRule. Use measured files/decision sites and DECISIONS.md to justify the chosen boundary.\n\nAnswer the fixed cases below before opening the self-check. Give the exact value or exception, then explain what the passing checks establish about behavior and what still requires structural review.\n"
	},
	"Extension Challenge: Strategy Selection Refactor": {
		key: "strategy",
		section: "extension",
		content:
			"Implement the optional CartPricer.priceUsing(units, rule). Validate quantity first, reject a null rule, invoke it once with the original quantity and return its nonnegative long unchanged. Reject a negative result with IllegalArgumentException. Preserve the identity of an exception thrown by the callback. A failed callback must not affect later ordinary quotes.\n\nComplete core before this extension. Keep the new injected rule outside the closed Plan selector unless a separate design decision justifies changing that API. Add a call counter and an exception marker to the evidence in DECISIONS.md.\n"
	},
	"Strategy Selection Refactor Transfer Practice": {
		key: "strategy",
		section: "transfer",
		content:
			"Written transfer: a different studio charges 275 cents per unit, with a 500-cent minimum only for positive quantities; zero costs zero. Specify its complete quantity rule, predict the four fixed cases and choose a helper, lambda or class. Explain how it could fit PricingRule without changing BULK/FLAT/MEMBER.\n\nThis is an independent reasoning case, not a request to change the supplied three Plan prices. Keep the reference closed for the first prediction. Record the result and the cost/removal argument in DECISIONS.md.\n"
	},
	"Strategy Selection Refactor Extension Practice": {
		key: "strategy",
		section: "extension-review",
		content:
			"Review optional injection using a recording rule, a negative-returning rule and an exception marker. Report the exact argument, invocation count, return or exception identity, then run an ordinary FLAT quote afterward. Include invalid quantity plus null rule to establish validation order.\n\n**Completion evidence:** Explain whether a stateless lambda or a named class best expresses each callback. Revisit the removal trigger if the only remaining variation is one fixed arithmetic function.\n"
	},
	"Structural Wrapper Refactor: Core Concepts": {
		key: "wrapper",
		section: "concepts",
		content:
			"A wrapper implements the same interface as the object it contains and delegates through that interface. It can transform a result, measure a call or control access. In this studio Source.load(key) is that common boundary. ReadDesk exposes the original client operations while independently composed wrappers own counting, caching, uppercasing and prefixing.\n\nOrder controls meaning. Counting(Cache(Source)) counts every request; Cache(Counting(Source)) counts misses. Prefix(Upper(Source)) preserves a lowercase prefix while Upper(Prefix(Source)) uppercases it. A cache also owns mutable state and a lifetime. Two equivalent return strings do not establish equivalent request counts or stale-value behavior. Compare the smaller extracted-helper design with independently reusable wrappers before accepting four extra classes.\n\n### Supplied contract\n\nA key matches `[a-z][a-z0-9-]{0,15}`. Null key raises NullPointerException; other invalid keys raise IllegalArgumentException before attempts or source calls. Constructor source and prefix are non-null. Calls are sequential.\n\nEvery valid read increases the attempt count, including cache hits and failed source calls. A cache hit returns its saved transformed string without calling the source. A miss loads a non-null string, optionally uppercases it using Locale.ROOT, then adds the unchanged prefix. Only successful results enter the cache. Empty strings are valid cached results.\n\nThe cache belongs to that ReadDesk instance. Changes to the underlying source stay invisible for an already cached key until clearCache; clearing preserves the attempt count. Source exceptions propagate unchanged. A null source result raises NullPointerException and is not cached.\n\nThe reference call order is Counting → optional Cache → Prefix → optional Upper → supplied Source. Counting sees every valid request. Prefix sits outside Upper so a prefix of `tag:` stays lowercase. The Source interface expects validated keys and non-null successful results.\n\n| Input text | Prefix | Uppercase | Result |\n| --- | --- | --- | --- |\n| Hi | tag: | yes | tag:HI |\n| Hi | tag: | no | tag:Hi |\n| Straße | empty | yes | STRASSE |\n| empty | tag: | yes | tag: |\n\n### Native Java workflow\n\nUse JDK 21 and keep the exported role folder together, including its src packages and sources.txt. The starter already passes core. The optional operation is deliberately unfinished there.\n\n```sh\njavac --release 21 -Xlint:all -Werror -d classes @sources.txt\njava -cp classes ContractTests base\njava -cp classes ContractTests core\njava -cp classes Main base\njava -cp classes Main\n```"
	},
	"Structural Wrapper Refactor: Guided Example": {
		key: "wrapper",
		section: "example",
		content:
			'Main loads Hi under one key. Its first read returns tag:HI and caches that transformed value. The second returns the same text, attempts becomes 2 and the supplied source has been called once. clearCache leaves attempts unchanged; the next read loads again. Main then reports two source calls.\n\nTrace a failing source call: attempts increases, the exact exception propagates and no value enters the cache. A later successful call can recover. With uppercase disabled, Hi remains Hi. With text Stra\u00DFe and an empty prefix, Locale.ROOT produces STRASSE. An empty source string with prefix tag: produces tag: and remains a valid cache entry.\n\n\n### Complete supplied driver\n\n```java\nimport wrapping.ReadDesk;\nimport wrapping.Source;\nimport wrapping.legacy.LegacyReader;\n\npublic final class Main {\n    public static void main(String[] args) {\n        int[] loads = {0};\n        Source source = key -> { loads[0]++; return "Hi"; };\n        if (args.length > 0 && args[0].equals("base")) {\n            LegacyReader desk = new LegacyReader(source, "tag:", true, true);\n            System.out.println(desk.read("a"));\n            System.out.println(desk.read("a"));\n            System.out.println(desk.attempts());\n            System.out.println(loads[0]);\n            desk.clearCache();\n            System.out.println(desk.read("a"));\n            System.out.println(loads[0]);\n        } else {\n            ReadDesk desk = new ReadDesk(source, "tag:", true, true);\n            System.out.println(desk.read("a"));\n            System.out.println(desk.read("a"));\n            System.out.println(desk.attempts());\n            System.out.println(loads[0]);\n            desk.clearCache();\n            System.out.println(desk.read("a"));\n            System.out.println(loads[0]);\n        }\n    }\n}\n```\n\nBoth modes print tag:HI, tag:HI, 2, 1, tag:HI and 2 on separate lines.\n\nCompile with the commands in Core Concepts; compare Main base with Main after each structural step.'
	},
	"Core Project: Structural Wrapper Refactor": {
		key: "wrapper",
		section: "core",
		content:
			"Refactor ReadDesk into composable Source collaborators while preserving its constructor and public core methods. Start by extracting just the load/transform helper. Then separate UpperSource, PrefixSource, CacheSource and CountingSource. Construct Counting outside optional Cache, with Prefix outside optional Upper. ReadDesk owns that selected composition and its cache lifetime.\n\nKeep LegacyReader, Main and ContractTests unchanged; add new package paths to sources.txt. Trace the same miss, hit, failure and clear in both designs. Record returned text, attempts, source calls, wrapper order and ownership. Compare four added classes and wiring with the helper-only alternative.\n"
	},
	"Review: Structural Wrapper Refactor": {
		key: "wrapper",
		section: "review",
		content:
			"Draw the selected wrapper chain and identify which object owns attempts, cached values and the supplied Source. Explain the effect of moving Counting through Cache and moving Prefix through Upper. Compare this composition with the extracted-helper intermediate using one change scenario and its added setup cost.\n\nFor each fixed case, trace calls and state in order. Record why an empty string is cacheable, why a failed load is not, and what clearCache preserves. A matching final string alone cannot establish equivalent metrics or lifetime.\n"
	},
	"Extension Challenge: Structural Wrapper Refactor": {
		key: "wrapper",
		section: "extension",
		content:
			"Implement optional invalidate(key). Validate first, remove only that key's cached value and return whether it existed. A disabled cache returns false. Do not load from Source or change attempts. An empty-string cached value still counts as an existing entry. Other keys remain cached.\n\n**Completion evidence:** Use the same saved ReadDesk project. Check an existing key, an absent key, repeated invalidation, invalid input and the no-cache configuration. Record attempts and source calls before and after.\n"
	},
	"Structural Wrapper Refactor Transfer Practice": {
		key: "wrapper",
		section: "transfer",
		content:
			"Written transfer: compare Counting(Cache(Source)) and Cache(Counting(Source)) for read a, read a, clear cache, read a. The source always returns x. Predict returned values, outer request count and underlying calls. State whether a caller needs requests or cache misses, and which object owns the lifetime.\n\nThen compare Prefix(Upper(Source)) and Upper(Prefix(Source)) with text Hi and prefix tag:. Give the exact strings. Explain why identical interfaces do not make those orders interchangeable.\n"
	},
	"Structural Wrapper Refactor Extension Practice": {
		key: "wrapper",
		section: "extension-review",
		content:
			"Review selective invalidation with two cached keys, including one empty string. Remove one entry, repeat removal and read the other. Show that invalidation does not call Source or increase attempts and that the unrelated key remains a cache hit.\n\n**Completion evidence:** Compare full clearCache with one-key invalidation. Explain whether per-instance cache ownership remains adequate for the stated change scenario, and record the cost of any proposed broader lifetime.\n"
	},
	"Architecture Judgment Capstone: Core Concepts": {
		key: "architecture",
		section: "concepts",
		content:
			"An architecture boundary controls which code may depend on which detail. A repository is an application-facing storage contract. Dependency injection supplies an implementation at a composition boundary. In this notebook, validation and version-conflict rules are business behavior; LinkedHashMap is a storage detail; audit delivery is a separate effect.\n\nThe starter's NotebookDesk contains all three concerns. A helper-only cleanup can improve its readability. The reference moves business rules to NotebookService, storage to MemoryNotes and setup to Composition. Its application imports api and ports, and compiles with a fake repository without memory or Composition. This is a demonstrated substitution seam. Its extra interface and wiring need a concrete change scenario to justify them.\n\nA version check alone provides no atomic concurrency guarantee. An audit callback is also outside storage: saving before auditing means an audit failure leaves the committed state visible. Keep those limitations explicit when interpreting passing tests.\n\n### Supplied contract\n\nIDs match `[a-z][a-z0-9-]{0,15}`. Text is non-null, at most 80 Unicode code points, and contains neither CR nor LF. Empty text and spaces are valid and unchanged. Null ID/text raises NullPointerException; other invalid values raise IllegalArgumentException before state changes or audit events. Expected versions must be positive, including for a missing ID. Calls are sequential; audit callbacks observe committed state and do not mutate the notebook.\n\n- create(id,text) appends a new immutable Note at version 1. Duplicate IDs raise\n  IllegalStateException without changing the old note or emitting an event.\n- edit(id,expectedVersion,text) returns false for a missing/stale note. A matching\n  version replaces text and increments the version, even for identical text.\n  Overflow raises ArithmeticException before saving. Existing position is stable.\n- find(id) returns Optional.empty for an absent valid ID.\n- all() returns an immutable snapshot in insertion order. Later edits cannot\n  change an earlier snapshot. Each composed notebook owns independent storage.\n- Successful create/edit saves first, then emits exactly one CREATED/EDITED event\n  with the committed Note. Audit exceptions propagate unchanged after commit.\n  This exercise has no transaction or durable storage guarantee.\n\n### Native Java workflow\n\nUse JDK 21 and keep the exported role folder together, including its src packages and sources.txt. The starter already passes core. The optional operation is deliberately unfinished there.\n\n```sh\njavac --release 21 -Xlint:all -Werror -d classes @sources.txt\njava -cp classes ContractTests base\njava -cp classes ContractTests core\njava -cp classes Main base\njava -cp classes Main\n```"
	},
	"Architecture Judgment Capstone: Guided Example": {
		key: "architecture",
		section: "example",
		content:
			'Main creates plan/Read at version 1 and emits CREATED|plan|1. Editing expected version 1 to Sketch commits version 2, emits EDITED|plan|2 and returns true. Another edit with expected version 1 returns false, leaves Sketch at version 2 and emits nothing. all contains one note.\n\nTrace storage before audit. If an audit sink throws on create, the caller receives that same exception but find still returns the saved note. Repeating create as though it rolled back would hit the duplicate-ID rule. Capture all before editing: its immutable Note remains at the older version even after the live notebook changes.\n\n\n### Complete supplied driver\n\n```java\nimport notebook.Composition;\nimport notebook.api.Action;\nimport notebook.api.AuditSink;\nimport notebook.api.Notebook;\nimport notebook.legacy.LegacyNotebook;\n\npublic final class Main {\n    private Main() {}\n    public static void main(String[] args) {\n        AuditSink audit = (action, note) ->\n            System.out.println(action + "|" + note.id() + "|" + note.version());\n        Notebook book = args.length > 0 && args[0].equals("base")\n            ? new LegacyNotebook(audit) : Composition.create(audit);\n        book.create("plan", "Read");\n        System.out.println(book.edit("plan", 1, "Sketch"));\n        System.out.println(book.edit("plan", 1, "Stale"));\n        System.out.println(book.find("plan").orElseThrow().text());\n        System.out.println(book.all().size());\n    }\n}\n```\n\nBoth modes print CREATED|plan|1, EDITED|plan|2, true, false, Sketch and 1 on separate lines.\n\nCompile with the commands in Core Concepts; compare Main base with Main after each structural step.'
	},
	"Core Project: Architecture Judgment Capstone": {
		key: "architecture",
		section: "core",
		content:
			"Refactor NotebookDesk behind the existing Notebook API. First extract repeated edit validation into a helper. Then introduce a NoteRepository port, a MemoryNotes implementation and a NotebookService that receives repository and AuditSink. Composition selects the concrete collaborators. Keep Note, LegacyNotebook, Main and ContractTests unchanged.\n\nDraw package arrows. Compile api, ports and application with a fake repository and without memory or Composition. Verify storage failure prevents auditing, overflow preserves the previous version and successful storage precedes audit. Record the added setup cost, the demonstrated substitution and a simpler counterfactual. Preserve sequential semantics; concurrency is a separate contract change.\n"
	},
	"Review: Architecture Judgment Capstone": {
		key: "architecture",
		section: "review",
		content:
			"Compare the monolith, helper-only cleanup and injected repository. Identify which file changes for a new in-memory representation, a new business validation rule or a new audit destination. Show the actual package arrows and isolated application compile, then explain which demonstrated substitution earns the added seam.\n\nFor the fixed cases, state the returned value, stored version, event and snapshot result. Explain why audit failure after commit leaves saved state and why find-then-save is limited to the supplied sequential model.\n"
	},
	"Extension Challenge: Architecture Judgment Capstone": {
		key: "architecture",
		section: "extension",
		content:
			"Implement optional remove(id,expectedVersion). Validate both arguments before lookup. Missing and stale IDs return false. A match removes the note before one REMOVED event containing its last version, then returns true. An audit exception propagates unchanged after removal. Prior snapshots retain their original note. Recreating the ID appends a fresh note at version 1.\n\nUse the same saved notebook project. Core remains complete without this operation. Extend the decision record with event order, failed/stale removals and the changed insertion order after recreation.\n"
	},
	"Architecture Judgment Capstone Transfer Practice": {
		key: "architecture",
		section: "transfer",
		content:
			"Written transfer: two clients both read version 2, then sequentially edit using expected version 2. Predict each result, final version and edit event count. Propose the repository operation required if those writes were actually concurrent.\n\n**Completion evidence:** The existing port uses separate find and save. Explain why a new storage adapter alone cannot guarantee atomic conflict detection. State the needed compare-and-update contract, and keep that behavior change separate from this behavior-preserving refactor.\n"
	},
	"Architecture Judgment Capstone Extension Practice": {
		key: "architecture",
		section: "extension-review",
		content:
			"Review removal by preserving a second note, removing the first, retrying removal and recreating the first. Record the snapshot before removal, current insertion order, versions and audit events. Repeat with a sink that throws on REMOVED; check actual stored state after the exception.\n\n**Completion evidence:** Explain the distinction between a reported audit failure and a storage rollback. Propose an explicit transaction/delivery contract before claiming stronger guarantees, and state the extra machinery that contract would require.\n"
	}
};
export function completeJavaStudios(module: RawCourseModule): RawCourseModule {
	if (module.title !== "Optional Applied Java Pattern Studios") return module;
	return {
		...module,
		curriculum: module.curriculum.map(item => ({
			...item,
			contentKind: "reading" as const,
			preserveInstructions: true,
			content:
				"Choose Strategy Selection after DPJ6/DPJ9, Structural Wrapper after DPJ5, or Architecture Judgment after DPJ8/DPJ10. Each optional studio compares a working baseline, a helper-only intermediate and a justified refactor. Core projects preserve the supplied behavior. Extensions add separately specified operations; transfer cases develop an independent design judgment."
		})),
		supplementalProjects: module.supplementalProjects.map(item => {
			const publishedTitle = item.title
				.replace(/^(.+): Core Project$/, "Core Project: $1")
				.replace(/^(.+): Review and Reflection$/, "Review: $1")
				.replace(
					/^(.+): Extension Challenge$/,
					"Extension Challenge: $1"
				);
			const lesson = lessons[publishedTitle];
			if (!lesson) {
				throw new Error(
					`Missing applied Java studio lesson: ${item.title}`
				);
			}
			const reading = ["concepts", "example"].includes(lesson.section);
			const anchor = `${lesson.key}-${lesson.section}`;
			const path =
				"/course-assets/design-patterns-in-java/studio-checks.md#";
			const links = reading
				? ""
				: `\n\n[Case inputs](${courseAssetViewerUrl(`${path + anchor}-inputs`)}) · [Project self-check](${courseAssetViewerUrl(`${path + anchor}-answers`)})`;
			return {
				...item,
				content: lesson.content + links,
				contentKind: reading
					? ("reading" as const)
					: ("assignment" as const),
				preserveInstructions: true,
				ideImport: true,
				projectLink: javaStudioURL(lesson.key, "starter"),
				solutionLink: javaStudioURL(lesson.key, "solution")
			};
		})
	};
}
