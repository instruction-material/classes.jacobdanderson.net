import type { RawCourse, RawCourseModuleItem } from "./types";
import { buildImplementationLabGuidance } from "./implementationLabGuidance";
import { buildProjectGuidance } from "./projectGuidance";

const designPatternsInJavaSourceCourse: RawCourse = {
	name: "Design Patterns in Java",
	modules: [
		{
			title: "DPJ1 What Patterns Are and What They Are Not",
			curriculum: [
				{
					title: "Introductions, Tooling, and Multi-File Workflow",
					content:
						"Set up a Java workspace in IntelliJ IDEA or VS Code with a current JDK, a build tool such as Gradle or Maven, and a debugger that works across packages and multiple files. Treat package structure, tests, and build scripts as part of the design lesson rather than as incidental setup."
				},
				{
					title: "Pattern, Anti-Pattern, and Overengineering",
					content:
						"Use Refactoring.Guru's framing that patterns are reusable design ideas, not copy-paste recipes or status symbols. Contrast genuine recurring design problems with over-designed code that introduces interfaces, factories, or inheritance before any flexibility is actually needed."
				},
				{
					title: "Code Smell Survey Before Pattern Selection",
					content:
						"The smell categories that drive this course are bloaters, object-orientation abusers, change preventers, dispensables, and couplers. Beginner-friendly examples such as long methods, switch statements, duplicate code, data clumps, feature envy, and shotgun surgery show why architecture pain appears."
				},
				{
					title: "Worked Example Set: Why Inheritance Ages Badly",
					content:
						"Compare a rigid subclass tree with a composition-based design that can vary behavior without multiplying classes. Use game rules, notifications, or pricing rules to show why 'just add another subclass' becomes costly once behavior starts crossing axes."
				},
				{
					title: "Design Exercise: Smell or Reasonable Simplicity?",
					content:
						"Give several short Java designs and classify them as healthy simplicity, code smell, or pattern-shaped overkill. The point is to train judgment before introducing the named patterns themselves."
				},
				{
					title: "Reflection Question: When Does a Pattern Actually Help?",
					content:
						"Explain the problem that must exist before a pattern becomes justified. Include at least one case where a pattern would be premature and one where a smell clearly points toward structural change."
				},
				{
					title: "DPJ1 What Patterns Are and What They Are Not: Core Project",
					content: buildProjectGuidance({
						courseFamily: "Design Patterns in Java",
						moduleTitle:
							"DPJ1 What Patterns Are and What They Are Not",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-04-dpj1-what-patterns-are-and-what-they-are-not/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-04-dpj1-what-patterns-are-and-what-they-are-not/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Diagnostic Checkpoint",
					content:
						"Readiness check: define a design pattern as a reusable solution shape instead of a library feature or template. Prompt: decide whether every duplicated `if` statement deserves a Strategy refactor, and justify the answer.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-04-dpj1-what-patterns-are-and-what-they-are-not/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-04-dpj1-what-patterns-are-and-what-they-are-not/solution"
				},
				{
					title: "What Patterns Are and What They Are Not Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "Design Patterns in Java",
						moduleTitle:
							"DPJ1 What Patterns Are and What They Are Not",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-01-dpj1-what-patterns-are-and-what-they-are-not-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-01-dpj1-what-patterns-are-and-what-they-are-not-supplemental-2/solution"
				},
				{
					title: "What Patterns Are and What They Are Not Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "Design Patterns in Java",
						moduleTitle:
							"DPJ1 What Patterns Are and What They Are Not",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-02-dpj1-what-patterns-are-and-what-they-are-not-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-02-dpj1-what-patterns-are-and-what-they-are-not-supplemental-3/solution"
				}
			]
		},
		{
			title: "DPJ2 Java Design Foundations",
			curriculum: [
				{
					title: "Interfaces, Abstract Classes, and Contracts",
					content:
						"Interfaces are behavioral contracts, while abstract classes are partial implementation tools; they are not interchangeable ceremony. Use package boundaries, visibility modifiers, and `final` to show how Java makes dependency direction and collaboration visible."
				},
				{
					title: "Composition, Cohesion, and Dependency Direction",
					content:
						"Develop composition over inheritance, high cohesion, and low coupling as the base layer underneath almost every later pattern. Before any refactor starts, explain which class owns which responsibility."
				},
				{
					title: "Worked Example Set: Packages, Seams, and Immutable Value Objects",
					content:
						"Use small Java examples to show how package structure, immutable value types, and constructor injection make systems easier to reason about. Connect this directly to later Builder, Factory, and DI work."
				},
				{
					title: "Refactoring Exercise: Untangle a Responsibility Blob",
					content:
						"Start from a class that creates objects, makes decisions, performs work, and talks directly to every dependency. Split responsibilities into cleaner collaborators before introducing named patterns, so the design foundations are explicit."
				},
				{
					title: "Design Review: Favoring Explicit Package Structure",
					content:
						"The package layout reveals the architecture rather than merely mirroring folders. Good Java design makes stable boundaries obvious in the codebase."
				},
				{
					title: "Reflection Question: What Makes a Good Seam in Java?",
					content:
						"Identify where an interface, fake, or wrapper would make later behavior changes safer. The answer references testability, not abstraction for its own sake."
				},
				{
					title: "DPJ2 Java Design Foundations: Core Project",
					content: buildProjectGuidance({
						courseFamily: "Design Patterns in Java",
						moduleTitle: "DPJ2 Java Design Foundations",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-05-dpj2-java-design-foundations/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-05-dpj2-java-design-foundations/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Diagnostic Checkpoint",
					content:
						"Readiness check: justify an interface with a collaboration boundary rather than habit. Prompt: explain when an immutable data object is cleaner than a highly configurable mutable one.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-05-dpj2-java-design-foundations/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-05-dpj2-java-design-foundations/solution"
				},
				{
					title: "Java Design Foundations Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "Design Patterns in Java",
						moduleTitle: "DPJ2 Java Design Foundations",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-03-dpj2-java-design-foundations-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-03-dpj2-java-design-foundations-supplemental-2/solution"
				},
				{
					title: "Java Design Foundations Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "Design Patterns in Java",
						moduleTitle: "DPJ2 Java Design Foundations",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-04-dpj2-java-design-foundations-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-04-dpj2-java-design-foundations-supplemental-3/solution"
				}
			]
		},
		{
			title: "DPJ3 Creational Patterns I",
			curriculum: [
				{
					title: "Factory Method",
					content:
						"Use Factory Method to centralize creation when subclasses or configuration decide which concrete product exists. Keep the lesson grounded in duplicated constructor logic and hard-coded creation branching."
				},
				{
					title: "Abstract Factory",
					content:
						"Abstract Factory handles product families that must vary together, such as themed UI components, environment-specific services, or game content packs. The important design pressure is consistency across each family rather than sheer number of factory classes."
				},
				{
					title: "Builder",
					content:
						"Use a builder when large object setup, optional configuration, and unreadable telescoping constructors make direct construction hard to follow. Compare a fluent builder with static factories and plain constructors so the tradeoff is concrete."
				},
				{
					title: "Worked Example Set: Duplicated Creation Logic in a Java App",
					content:
						"Refactor a cluttered object-creation flow first into Factory Method, then into Abstract Factory or Builder only if the constraints truly justify it. Use product variability, readability, and test seams as the deciding criteria."
				},
				{
					title: "Pattern Selection Drill: Factory or Builder?",
					content:
						"Use examples that require deciding whether the real problem is product family selection, complex configuration, or both. This prevents Builder and Factory from collapsing into one vague 'object creation' lesson."
				},
				{
					title: "Reflection Question: How Much Creation Logic Is Too Much?",
					content:
						"Explain the point at which direct constructor calls become a maintenance problem. A strong response mentions duplicated rules, hidden dependencies, or families that must stay compatible."
				},
				{
					title: "DPJ3 Creational Patterns I: Core Project",
					content: buildProjectGuidance({
						courseFamily: "Design Patterns in Java",
						moduleTitle: "DPJ3 Creational Patterns I",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-06-dpj3-creational-patterns-i/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-06-dpj3-creational-patterns-i/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Diagnostic Checkpoint",
					content:
						"Readiness check: explain why Abstract Factory is about coordinated families rather than just more factories. Prompt: identify when a named constructor is enough and a Builder is unnecessary.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-06-dpj3-creational-patterns-i/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-06-dpj3-creational-patterns-i/solution"
				},
				{
					title: "Creational Patterns I Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "Design Patterns in Java",
						moduleTitle: "DPJ3 Creational Patterns I",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-05-dpj3-creational-patterns-i-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-05-dpj3-creational-patterns-i-supplemental-2/solution"
				},
				{
					title: "Creational Patterns I Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "Design Patterns in Java",
						moduleTitle: "DPJ3 Creational Patterns I",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-06-dpj3-creational-patterns-i-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-06-dpj3-creational-patterns-i-supplemental-3/solution"
				}
			]
		},
		{
			title: "DPJ4 Creational Patterns II and Boundary Patterns",
			curriculum: [
				{
					title: "Prototype",
					content:
						"Prototype fits when cloning configured objects is simpler than reconstructing them from scratch. Focus on controlled copying, variation from a seed object, and the risks of shallow versus deep copy."
				},
				{
					title: "Singleton and Why to Be Skeptical",
					content:
						"Singleton is part of the classic catalog, but it is best evaluated through the lens of hidden global state, test pain, and lifetime ambiguity. Prefer scoped services and injection unless a truly application-wide single instance is warranted."
				},
				{
					title: "Adapter",
					content:
						"Use Adapter to reconcile mismatched interfaces when integrating older code, third-party libraries, or inconsistent data providers. Stress that Adapter preserves the client-side contract rather than polluting the domain with foreign shapes."
				},
				{
					title: "Facade",
					content:
						"Facade simplifies access to a subsystem that currently exposes too much internal structure. The key distinction is a boundary-oriented facade versus a bloated god object."
				},
				{
					title: "Worked Example Set: Clone, Wrap, or Simplify?",
					content:
						"Give a legacy-integration example where Prototype, Adapter, and Facade must be chosen based on what the current pain actually is. Use this lesson to reinforce that pattern selection starts from forces, not names."
				},
				{
					title: "Reflection Question: Why Is Singleton So Tempting?",
					content:
						"Explain why Singleton often feels convenient at first and why that convenience creates hidden cost later. A strong response compares it with constructor injection or explicit application wiring."
				},
				{
					title: "DPJ4 Creational Patterns II and Boundary Patterns: Core Project",
					content: buildProjectGuidance({
						courseFamily: "Design Patterns in Java",
						moduleTitle:
							"DPJ4 Creational Patterns II and Boundary Patterns",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-07-dpj4-creational-patterns-ii-and-boundary-patterns/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-07-dpj4-creational-patterns-ii-and-boundary-patterns/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Diagnostic Checkpoint",
					content:
						"Readiness check: distinguish wrapping an incompatible API from simplifying a noisy subsystem. Prompt: decide whether a logger actually needs a Singleton.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-07-dpj4-creational-patterns-ii-and-boundary-patterns/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-07-dpj4-creational-patterns-ii-and-boundary-patterns/solution"
				},
				{
					title: "Creational Patterns II and Boundary Patterns Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "Design Patterns in Java",
						moduleTitle:
							"DPJ4 Creational Patterns II and Boundary Patterns",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-07-dpj4-creational-patterns-ii-and-boundary-patterns-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-07-dpj4-creational-patterns-ii-and-boundary-patterns-supplemental-2/solution"
				},
				{
					title: "Creational Patterns II and Boundary Patterns Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "Design Patterns in Java",
						moduleTitle:
							"DPJ4 Creational Patterns II and Boundary Patterns",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-08-dpj4-creational-patterns-ii-and-boundary-patterns-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-08-dpj4-creational-patterns-ii-and-boundary-patterns-supplemental-3/solution"
				}
			]
		},
		{
			title: "DPJ5 Structural Patterns in Depth",
			curriculum: [
				{
					title: "Bridge",
					content:
						"Use Bridge when abstraction and implementation vary independently, such as shapes versus renderers or notifications versus delivery channels. Contrast this with subclass explosions that multiply every combination."
				},
				{
					title: "Composite",
					content:
						"Composite is clearest through recursive structures such as menus, scene graphs, or document trees. The pattern becomes useful when treating leaf and group nodes uniformly makes client code simpler and less branch-heavy."
				},
				{
					title: "Decorator",
					content:
						"Use Decorator to layer behavior without creating endless subclasses for every feature combination. Logging, formatting, scoring, and effect modifiers make good motivating examples."
				},
				{
					title: "Proxy and Flyweight",
					content:
						"Proxy is controlled indirection for lazy loading, access control, or observation, while Flyweight is shared intrinsic state for memory-sensitive repeated objects. The important distinction is why these two patterns solve different problems even though both can involve wrappers and delegation."
				},
				{
					title: "Worked Example Set: Tree, Wrapper, or Indirection?",
					content:
						"Compare a drawing app, resource viewer, and icon-heavy UI to decide whether the real pressure is hierarchy, layered behavior, access indirection, or object count. This helps avoid using Decorator where Composite or Proxy would be cleaner."
				},
				{
					title: "Reflection Question: Which Structural Pattern Changes the Client View?",
					content:
						"Explain how each structural pattern changes what the client needs to know. A strong answer distinguishes hidden subsystem complexity, preserved interface shape, recursive composition, and deferred access."
				},
				{
					title: "DPJ5 Structural Patterns in Depth: Core Project",
					content: buildProjectGuidance({
						courseFamily: "Design Patterns in Java",
						moduleTitle: "DPJ5 Structural Patterns in Depth",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-08-dpj5-structural-patterns-in-depth/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-08-dpj5-structural-patterns-in-depth/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Diagnostic Checkpoint",
					content:
						"Readiness check: justify Flyweight with repeated intrinsic state rather than simple reuse. Prompt: decide whether a layered coffee-order system wants Decorator or Builder.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-08-dpj5-structural-patterns-in-depth/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-08-dpj5-structural-patterns-in-depth/solution"
				},
				{
					title: "Structural Patterns in Depth Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "Design Patterns in Java",
						moduleTitle: "DPJ5 Structural Patterns in Depth",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-09-dpj5-structural-patterns-in-depth-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-09-dpj5-structural-patterns-in-depth-supplemental-2/solution"
				},
				{
					title: "Structural Patterns in Depth Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "Design Patterns in Java",
						moduleTitle: "DPJ5 Structural Patterns in Depth",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-10-dpj5-structural-patterns-in-depth-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-10-dpj5-structural-patterns-in-depth-supplemental-3/solution"
				}
			]
		},
		{
			title: "DPJ6 Behavioral Patterns I",
			curriculum: [
				{
					title: "Strategy",
					content:
						"Use Strategy to replace branching behavior with swappable algorithms for pricing, movement, targeting, scoring, or validation rules. This connects directly to code smells like switch statements and primitive obsession."
				},
				{
					title: "State",
					content:
						"State is an object-oriented response to behavior that changes based on internal mode or phase. Use examples like workflow stages, player states, or document lifecycle transitions to contrast State with Strategy."
				},
				{
					title: "Template Method",
					content:
						"Use Template Method when an algorithm skeleton is fixed but selected steps vary across subclasses. Show both the power and the inheritance coupling so composition tradeoffs stay visible."
				},
				{
					title: "Iterator",
					content:
						"Use Iterator to traverse structures without exposing collection internals or forcing clients to know the storage shape. Compare custom iteration across trees or filtered views with the simpler cases already covered by Java collections."
				},
				{
					title: "Worked Example Set: Replace Conditionals with Behavior Objects",
					content:
						"Start with long conditional logic, then compare refactors using Strategy, State, or Template Method. Explain why one of the three is the best fit instead of using them interchangeably."
				},
				{
					title: "Reflection Question: Where Does the Decision Live Now?",
					content:
						"Explain how Strategy, State, and Template Method relocate variation compared with a giant conditional block. A strong response identifies whether the variability is chosen from outside, driven by object state, or fixed in an algorithm skeleton."
				},
				{
					title: "DPJ6 Behavioral Patterns I: Core Project",
					content: buildProjectGuidance({
						courseFamily: "Design Patterns in Java",
						moduleTitle: "DPJ6 Behavioral Patterns I",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-09-dpj6-behavioral-patterns-i/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-09-dpj6-behavioral-patterns-i/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Diagnostic Checkpoint",
					content:
						"Readiness check: choose State versus Strategy based on who selects the behavior and when it changes. Prompt: decide whether Template Method helps when inheritance is already the source of the current design pain.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-09-dpj6-behavioral-patterns-i/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-09-dpj6-behavioral-patterns-i/solution"
				},
				{
					title: "Behavioral Patterns I Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "Design Patterns in Java",
						moduleTitle: "DPJ6 Behavioral Patterns I",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-11-dpj6-behavioral-patterns-i-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-11-dpj6-behavioral-patterns-i-supplemental-2/solution"
				},
				{
					title: "Behavioral Patterns I Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "Design Patterns in Java",
						moduleTitle: "DPJ6 Behavioral Patterns I",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-12-dpj6-behavioral-patterns-i-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-12-dpj6-behavioral-patterns-i-supplemental-3/solution"
				}
			]
		},
		{
			title: "DPJ7 Behavioral Patterns II",
			curriculum: [
				{
					title: "Observer",
					content:
						"Observer is easiest to understand through notifications, UI listeners, and event-driven collaboration where publishers do not know their consumers in detail. Make coupling direction and unsubscribe behavior explicit."
				},
				{
					title: "Command",
					content:
						"Use Command to package requests as objects that can be queued, logged, replayed, or undone. Connect this pattern to menu systems, editor actions, macro recording, and job execution."
				},
				{
					title: "Chain of Responsibility",
					content:
						"Chain of Responsibility is staged handling where each object can process, pass along, or stop a request. Use middleware, validation pipelines, or event filters as intuitive Java examples."
				},
				{
					title: "Mediator, Memento, and Visitor",
					content:
						"Use Mediator to reduce many-to-many chatter, Memento to capture restorable state without exposing internals recklessly, and Visitor to add operations over stable object structures. Treat these as higher-friction patterns that solve real coordination or traversal pressure rather than default solutions."
				},
				{
					title: "Worked Example Set: Event Flow, Undo, and Cross-Object Coordination",
					content:
						"Compare a notification system, command history, and object-collaboration tangle to decide whether Observer, Command, Chain, Mediator, or Memento best addresses the pressure point. Use Visitor sparingly and only where adding new operations across a fixed node hierarchy is the real challenge."
				},
				{
					title: "Reflection Question: Which Pattern Owns the Conversation?",
					content:
						"Identify where message flow is centered in Observer, Chain of Responsibility, and Mediator. A strong response explains how each changes coupling and control flow."
				},
				{
					title: "DPJ7 Behavioral Patterns II: Core Project",
					content: buildProjectGuidance({
						courseFamily: "Design Patterns in Java",
						moduleTitle: "DPJ7 Behavioral Patterns II",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-10-dpj7-behavioral-patterns-ii/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-10-dpj7-behavioral-patterns-ii/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Diagnostic Checkpoint",
					content:
						"Readiness check: distinguish event subscription from ordered request handling and centralized coordination. Prompt: identify when Memento is better than exposing every field for manual rollback.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-10-dpj7-behavioral-patterns-ii/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-10-dpj7-behavioral-patterns-ii/solution"
				},
				{
					title: "Behavioral Patterns II Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "Design Patterns in Java",
						moduleTitle: "DPJ7 Behavioral Patterns II",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-13-dpj7-behavioral-patterns-ii-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-13-dpj7-behavioral-patterns-ii-supplemental-2/solution"
				},
				{
					title: "Behavioral Patterns II Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "Design Patterns in Java",
						moduleTitle: "DPJ7 Behavioral Patterns II",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-14-dpj7-behavioral-patterns-ii-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-14-dpj7-behavioral-patterns-ii-supplemental-3/solution"
				}
			]
		},
		{
			title: "DPJ8 Modern Extensions and Architecture-Level Patterns",
			curriculum: [
				{
					title: "Dependency Injection",
					content:
						"Constructor injection and dependency inversion are practical architecture tools, not container worship. Injected collaborators create seams for testing and refactoring even without a DI framework."
				},
				{
					title: "Plugin Architecture and Event Bus Thinking",
					content:
						"Use plugin loading and event bus or pub-sub concepts as architecture-level extensions of classic pattern thinking. Connect these ideas back to Observer, Factory, and Adapter rather than presenting them as disconnected framework magic."
				},
				{
					title: "MVC or MVVM at a Conceptual Level",
					content:
						"MVC and MVVM are responsibility-separation patterns that appear above the class level. The goal is conceptual clarity, not framework-specific detail."
				},
				{
					title: "Repository and Service Layering",
					content:
						"Repository and service boundaries keep domain logic, persistence, and integration concerns from collapsing into the same classes. Use this to reinforce package structure and dependency direction from the earlier modules."
				},
				{
					title: "Worked Example Set: From Pattern Catalog to Application Architecture",
					content:
						"Compare a small desktop-style app, a notification service, and a plugin-based tool to see how multiple patterns combine into a coherent architecture. Stop treating patterns as isolated boxes and start seeing them as collaboration choices."
				},
				{
					title: "Reflection Question: When Does a Pattern Become Architecture?",
					content:
						"Explain the difference between class-level pattern use and architecture-level responsibility separation. A strong response identifies when the main design question shifts from one class to the shape of the whole system."
				},
				{
					title: "DPJ8 Modern Extensions and Architecture-Level Patterns: Core Project",
					content: buildProjectGuidance({
						courseFamily: "Design Patterns in Java",
						moduleTitle:
							"DPJ8 Modern Extensions and Architecture-Level Patterns",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-11-dpj8-modern-extensions-and-architecture-level-patterns/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-11-dpj8-modern-extensions-and-architecture-level-patterns/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Diagnostic Checkpoint",
					content:
						"Readiness check: describe DI without mentioning a container at all. Prompt: explain what a repository boundary protects the rest of the system from.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-11-dpj8-modern-extensions-and-architecture-level-patterns/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-11-dpj8-modern-extensions-and-architecture-level-patterns/solution"
				},
				{
					title: "Modern Extensions and Architecture Level Patterns Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "Design Patterns in Java",
						moduleTitle:
							"DPJ8 Modern Extensions and Architecture-Level Patterns",
						itemTitle:
							"Modern Extensions and Architecture Level Patterns Transfer Practice",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-15-dpj8-modern-extensions-and-architecture-level-patterns-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-15-dpj8-modern-extensions-and-architecture-level-patterns-supplemental-2/solution"
				},
				{
					title: "Modern Extensions and Architecture Level Patterns Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "Design Patterns in Java",
						moduleTitle:
							"DPJ8 Modern Extensions and Architecture-Level Patterns",
						itemTitle:
							"Modern Extensions and Architecture Level Patterns Extension Practice",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-16-dpj8-modern-extensions-and-architecture-level-patterns-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-16-dpj8-modern-extensions-and-architecture-level-patterns-supplemental-3/solution"
				}
			]
		},
		{
			title: "DPJ9 Pattern Selection and Refactoring Judgment",
			curriculum: [
				{
					title: "Smell-to-Pattern Mapping",
					aliases: ["Smell-to-Pattern Mapping"],
					content:
						"Map common smells to likely pattern responses: switch statements toward Strategy or State, tangled construction toward Factory or Builder, subsystem chaos toward Facade, and cross-package mismatch toward Adapter. Stress that the mapping is a hypothesis, not a mechanical rule."
				},
				{
					title: "When Not to Use the Pattern",
					aliases: ["When Not to Use the Pattern"],
					content:
						"Every pattern now gets an explicit restraint pass. Delete abstractions, collapse hierarchies, or keep direct code when the collaboration pressure is low."
				},
				{
					title: "Design Review Exercise: Name the Tradeoff, Not Just the Pattern",
					content:
						"Review a medium example and argue for or against introducing a pattern. Credit goes to the quality of the tradeoff analysis, not to how many pattern names are mentioned."
				},
				{
					title: "Refactoring Preview: Pattern Selection Requires Safe Change",
					content:
						"Bridge into the follow-up refactoring course by showing that pattern choice is inseparable from small, safe code transformation steps. Visible pattern: Why Extract Method, Move Method, Replace Conditional with Polymorphism, and similar refactorings are the path into better design."
				},
				{
					title: "Brittle Object Model Refactor Studio",
					aliases: [
						"Mini Lab: Improve a Brittle Object Model with Restraint"
					],
					content:
						"Start from a messy Java design, identify only the highest-value improvements, and refactor toward a smaller justified set of patterns. Include a note about what was intentionally left alone."
				},
				{
					title: "Reflection Question: What Improvement Was Actually Measured?",
					content:
						"Explain how the refactor improved extensibility, readability, or testability rather than merely increasing abstraction. A strong answer mentions a before-and-after collaboration or change scenario."
				},
				{
					title: "DPJ9 Pattern Selection and Refactoring Judgment: Core Project",
					content: buildProjectGuidance({
						courseFamily: "Design Patterns in Java",
						moduleTitle:
							"DPJ9 Pattern Selection and Refactoring Judgment",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-12-dpj9-pattern-selection-and-refactoring-judgment/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-12-dpj9-pattern-selection-and-refactoring-judgment/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Diagnostic Checkpoint",
					content:
						"Readiness check: argue against a pattern when the underlying smell is weak. Prompt: identify the smallest useful next refactor rather than the biggest theoretical rewrite.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-12-dpj9-pattern-selection-and-refactoring-judgment/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-12-dpj9-pattern-selection-and-refactoring-judgment/solution"
				},
				{
					title: "Pattern Selection and Refactoring Judgment Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "Design Patterns in Java",
						moduleTitle:
							"DPJ9 Pattern Selection and Refactoring Judgment",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-17-dpj9-pattern-selection-and-refactoring-judgment-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-17-dpj9-pattern-selection-and-refactoring-judgment-supplemental-2/solution"
				},
				{
					title: "Pattern Selection and Refactoring Judgment Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "Design Patterns in Java",
						moduleTitle:
							"DPJ9 Pattern Selection and Refactoring Judgment",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-18-dpj9-pattern-selection-and-refactoring-judgment-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-18-dpj9-pattern-selection-and-refactoring-judgment-supplemental-3/solution"
				}
			]
		},
		{
			title: "DPJ10 Capstone Refactor",
			curriculum: [
				{
					title: "Capstone Launch: Start from a Cluttered Java Application",
					content:
						"Begin with a medium-sized Java program that has real design pain, such as duplicated creation logic, long conditionals, hidden dependencies, or weak package boundaries. The capstone feels like a rescue mission, not a greenfield architecture fantasy."
				},
				{
					title: "Problem Framing: Identify Three to Five Real Design Pressures",
					content:
						"Document the specific smells and collaboration failures they intend to fix. Good capstones name the real change scenarios that currently hurt."
				},
				{
					title: "Refactor Plan: Choose a Small Justified Pattern Set",
					content:
						"Select only the patterns that address the identified pressures, such as Strategy for branching behavior, Factory for unstable creation, Observer for notification flow, or Facade for subsystem chaos. Explain why other patterns were not chosen."
				},
				{
					title: "Implementation Pass: Preserve Behavior While Improving Structure",
					content:
						"Apply the refactor in disciplined steps, keeping the application runnable and reviewable throughout the process. Use tests, debug checkpoints, or demo scripts to ensure behavior remains intact."
				},
				{
					title: "Architecture Review: Package Layout, Seams, and Testability",
					content:
						"Evaluate the final design in terms of package structure, dependency direction, and ease of change. The resulting design is defensible as actually easier to extend or test."
				},
				{
					title: "Capstone Reflection: What Changed and What Stayed Simple?",
					content:
						"Close the course by documenting the original pain, the chosen patterns, the tradeoffs introduced, and the places where simplicity won over more abstraction. This reflection prepares the path into the follow-up refactoring course."
				},
				{
					title: "DPJ10 Capstone Refactor: Core Project",
					content: buildProjectGuidance({
						courseFamily: "Design Patterns in Java",
						moduleTitle: "DPJ10 Capstone Refactor",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-13-dpj10-capstone-refactor/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-13-dpj10-capstone-refactor/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Diagnostic Checkpoint",
					content:
						"Readiness check: justify each introduced pattern with a concrete before-and-after change story. Prompt: name which parts of the final design remained intentionally plain.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-13-dpj10-capstone-refactor/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-13-dpj10-capstone-refactor/solution"
				},
				{
					title: "Capstone Refactor Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "Design Patterns in Java",
						moduleTitle: "DPJ10 Capstone Refactor",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-19-dpj10-capstone-refactor-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-19-dpj10-capstone-refactor-supplemental-2/solution"
				},
				{
					title: "Capstone Refactor Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "Design Patterns in Java",
						moduleTitle: "DPJ10 Capstone Refactor",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-20-dpj10-capstone-refactor-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-20-dpj10-capstone-refactor-supplemental-3/solution"
				}
			]
		},
		{
			title: "Strategy Selection Refactor Studio",
			curriculum: [
				{
					title: "Strategy Selection Refactor: Core Concepts",
					content: buildImplementationLabGuidance({
						courseFamily: "Java design patterns",
						moduleTitle: "Strategy Selection Refactor Studio",
						section: "concepts"
					})
				},
				{
					title: "Strategy Selection Refactor: Guided Example",
					content: buildImplementationLabGuidance({
						courseFamily: "Java design patterns",
						moduleTitle: "Strategy Selection Refactor Studio",
						section: "example"
					})
				},
				{
					title: "Strategy Selection Refactor: Core Project",
					content: buildImplementationLabGuidance({
						courseFamily: "Java design patterns",
						moduleTitle: "Strategy Selection Refactor Studio",
						section: "coreProject"
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-01-pattern-implementation-lab-15/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-01-pattern-implementation-lab-15/solution"
				},
				{
					title: "Strategy Selection Refactor: Review and Reflection",
					content: buildImplementationLabGuidance({
						courseFamily: "Java design patterns",
						moduleTitle: "Strategy Selection Refactor Studio",
						section: "review"
					})
				}
			],
			supplementalProjects: [
				{
					title: "Strategy Selection Refactor: Extension Challenge",
					content: buildImplementationLabGuidance({
						courseFamily: "Java design patterns",
						moduleTitle: "Strategy Selection Refactor Studio",
						section: "extension"
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-01-pattern-implementation-lab-15/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-01-pattern-implementation-lab-15/solution"
				},
				{
					title: "Strategy Selection Refactor Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "Design Patterns in Java",
						moduleTitle: "Strategy Selection Refactor Studio",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-29-applied-studio-15-pattern-implementation-lab-15-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-29-applied-studio-15-pattern-implementation-lab-15-supplemental-2/solution"
				},
				{
					title: "Strategy Selection Refactor Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "Design Patterns in Java",
						moduleTitle: "Strategy Selection Refactor Studio",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-30-applied-studio-15-pattern-implementation-lab-15-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-30-applied-studio-15-pattern-implementation-lab-15-supplemental-3/solution"
				}
			]
		},
		{
			title: "Structural Wrapper Refactor Studio",
			curriculum: [
				{
					title: "Structural Wrapper Refactor: Core Concepts",
					content: buildImplementationLabGuidance({
						courseFamily: "Java design patterns",
						moduleTitle: "Structural Wrapper Refactor Studio",
						section: "concepts"
					})
				},
				{
					title: "Structural Wrapper Refactor: Guided Example",
					content: buildImplementationLabGuidance({
						courseFamily: "Java design patterns",
						moduleTitle: "Structural Wrapper Refactor Studio",
						section: "example"
					})
				},
				{
					title: "Structural Wrapper Refactor: Core Project",
					content: buildImplementationLabGuidance({
						courseFamily: "Java design patterns",
						moduleTitle: "Structural Wrapper Refactor Studio",
						section: "coreProject"
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-02-pattern-implementation-lab-16/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-02-pattern-implementation-lab-16/solution"
				},
				{
					title: "Structural Wrapper Refactor: Review and Reflection",
					content: buildImplementationLabGuidance({
						courseFamily: "Java design patterns",
						moduleTitle: "Structural Wrapper Refactor Studio",
						section: "review"
					})
				}
			],
			supplementalProjects: [
				{
					title: "Structural Wrapper Refactor: Extension Challenge",
					content: buildImplementationLabGuidance({
						courseFamily: "Java design patterns",
						moduleTitle: "Structural Wrapper Refactor Studio",
						section: "extension"
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-02-pattern-implementation-lab-16/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-02-pattern-implementation-lab-16/solution"
				},
				{
					title: "Structural Wrapper Refactor Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "Design Patterns in Java",
						moduleTitle: "Structural Wrapper Refactor Studio",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-31-applied-studio-16-pattern-implementation-lab-16-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-31-applied-studio-16-pattern-implementation-lab-16-supplemental-2/solution"
				},
				{
					title: "Structural Wrapper Refactor Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "Design Patterns in Java",
						moduleTitle: "Structural Wrapper Refactor Studio",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-32-applied-studio-16-pattern-implementation-lab-16-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-32-applied-studio-16-pattern-implementation-lab-16-supplemental-3/solution"
				}
			]
		},
		{
			title: "Architecture Judgment Capstone Studio",
			curriculum: [
				{
					title: "Architecture Judgment Capstone: Core Concepts",
					content: buildImplementationLabGuidance({
						courseFamily: "Java design patterns",
						moduleTitle: "Architecture Judgment Capstone Studio",
						section: "concepts"
					})
				},
				{
					title: "Architecture Judgment Capstone: Guided Example",
					content: buildImplementationLabGuidance({
						courseFamily: "Java design patterns",
						moduleTitle: "Architecture Judgment Capstone Studio",
						section: "example"
					})
				},
				{
					title: "Architecture Judgment Capstone: Core Project",
					content: buildImplementationLabGuidance({
						courseFamily: "Java design patterns",
						moduleTitle: "Architecture Judgment Capstone Studio",
						section: "coreProject"
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-03-pattern-implementation-lab-17/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-03-pattern-implementation-lab-17/solution"
				},
				{
					title: "Architecture Judgment Capstone: Review and Reflection",
					content: buildImplementationLabGuidance({
						courseFamily: "Java design patterns",
						moduleTitle: "Architecture Judgment Capstone Studio",
						section: "review"
					})
				}
			],
			supplementalProjects: [
				{
					title: "Architecture Judgment Capstone: Extension Challenge",
					content: buildImplementationLabGuidance({
						courseFamily: "Java design patterns",
						moduleTitle: "Architecture Judgment Capstone Studio",
						section: "extension"
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-03-pattern-implementation-lab-17/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-03-pattern-implementation-lab-17/solution"
				},
				{
					title: "Architecture Judgment Capstone Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "Design Patterns in Java",
						moduleTitle: "Architecture Judgment Capstone Studio",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-33-applied-studio-17-pattern-implementation-lab-17-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-33-applied-studio-17-pattern-implementation-lab-17-supplemental-2/solution"
				},
				{
					title: "Architecture Judgment Capstone Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "Design Patterns in Java",
						moduleTitle: "Architecture Judgment Capstone Studio",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-34-applied-studio-17-pattern-implementation-lab-17-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-3/tree/main/DPJ-34-applied-studio-17-pattern-implementation-lab-17-supplemental-3/solution"
				}
			]
		}
	]
};

const DESIGN_PATTERNS_JAVA_JUNIT = "https://docs.junit.org/current/user-guide/";
const DESIGN_PATTERNS_JAVA_RECORDS =
	"https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/lang/Record.html";
const DESIGN_PATTERNS_JAVA_SEALED =
	"https://docs.oracle.com/javase/specs/jls/se25/html/jls-8.html#jls-8.1.1.2";
const DESIGN_PATTERNS_JAVA_SERVICE_LOADER =
	"https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/util/ServiceLoader.html";

const DESIGN_PATTERNS_JAVA_PRIMARY_TITLES = new Set([
	"DPJ1 What Patterns Are and What They Are Not",
	"DPJ2 Java Design Foundations",
	"DPJ3 Creational Patterns I",
	"DPJ4 Creational Patterns II and Boundary Patterns",
	"DPJ5 Structural Patterns in Depth",
	"DPJ6 Behavioral Patterns I",
	"DPJ7 Behavioral Patterns II",
	"DPJ8 Modern Extensions and Architecture-Level Patterns",
	"DPJ9 Pattern Selection and Refactoring Judgment",
	"DPJ10 Capstone Refactor"
]);

const DESIGN_PATTERNS_JAVA_FLOW: Record<
	string,
	{
		estimatedTime: string;
		keyBlocks: string[];
		flowNote: string;
	}
> = {
	"DPJ1 What Patterns Are and What They Are Not": {
		estimatedTime: "4 sessions · 60–90 minutes each",
		keyBlocks: [
			"course prerequisite",
			"characterization baseline",
			"design pressure",
			"pattern vocabulary",
			"overengineering test",
			"decision record"
		],
		flowNote:
			"Establish a runnable multi-file Java baseline, distinguish a recurring design pressure from ordinary complexity, and document why a pattern earns its cost before implementing one."
	},
	"DPJ2 Java Design Foundations": {
		estimatedTime: "5 sessions · 60–90 minutes each",
		keyBlocks: [
			"contract and implementation",
			"composition",
			"cohesion and coupling",
			"package boundary",
			"records and sealed types",
			"test seam"
		],
		flowNote:
			"Build cohesive collaborators and explicit package dependencies, then compare interfaces and abstract classes with records, sealed types, enums, and lambdas that can make a named pattern unnecessary."
	},
	"DPJ3 Creational Patterns I": {
		estimatedTime: "5 sessions · 60–90 minutes each",
		keyBlocks: [
			"direct construction",
			"Factory Method",
			"Abstract Factory",
			"Builder",
			"product family",
			"creation decision matrix"
		],
		flowNote:
			"Start from direct construction, identify the exact creation pressure, and adopt Factory Method, Abstract Factory, or Builder only when a simpler constructor or static factory no longer expresses the rules."
	},
	"DPJ4 Creational Patterns II and Boundary Patterns": {
		estimatedTime: "5 sessions · 60–90 minutes each",
		keyBlocks: [
			"copy semantics",
			"Prototype",
			"Singleton risk",
			"Adapter",
			"Facade",
			"boundary ownership"
		],
		flowNote:
			"Make copy depth and global lifetime explicit, challenge Singleton against dependency injection, and separate compatibility translation with Adapter from subsystem simplification with Facade."
	},
	"DPJ5 Structural Patterns in Depth": {
		estimatedTime: "6 sessions · 60–90 minutes each",
		keyBlocks: [
			"Bridge",
			"Composite",
			"Decorator",
			"Proxy",
			"Flyweight",
			"identity and lifecycle"
		],
		flowNote:
			"Compare structural patterns by the client-visible contract, identity, ownership, and lifecycle they preserve rather than by diagram shape alone."
	},
	"DPJ6 Behavioral Patterns I": {
		estimatedTime: "5 sessions · 60–90 minutes each",
		keyBlocks: [
			"Strategy",
			"State",
			"Template Method",
			"Iterator",
			"functional interface",
			"conditional replacement"
		],
		flowNote:
			"Move varying decisions into explicit behavior while comparing classic classes with lambdas, enums, and sealed state models that can provide a smaller Java design."
	},
	"DPJ7 Behavioral Patterns II": {
		estimatedTime: "6 sessions · 60–90 minutes each",
		keyBlocks: [
			"Observer",
			"Command",
			"Chain of Responsibility",
			"Mediator",
			"Memento and Visitor",
			"event and undo lifecycle"
		],
		flowNote:
			"Model event delivery, commands, undo state, and multi-object coordination with explicit ordering, ownership, error, memory, and unsubscription rules."
	},
	"DPJ8 Modern Extensions and Architecture-Level Patterns": {
		estimatedTime: "6 sessions · 60–100 minutes each",
		keyBlocks: [
			"dependency injection",
			"ServiceLoader plugins",
			"event bus",
			"MVC and MVVM",
			"repository boundary",
			"architecture fitness"
		],
		flowNote:
			"Scale from object-level patterns to application boundaries, implement a real Java service-provider seam, and keep architecture labels tied to dependency direction and replaceable behavior."
	},
	"DPJ9 Pattern Selection and Refactoring Judgment": {
		estimatedTime: "5 sessions · 60–100 minutes each",
		keyBlocks: [
			"smell diagnosis",
			"simpler alternative",
			"pattern tradeoff",
			"safe refactor sequence",
			"measurement",
			"pattern removal"
		],
		flowNote:
			"Select patterns from a diagnosed change pressure, preserve behavior through small test-backed steps, compare against a simpler counterfactual, and remove abstractions that no longer earn their cost."
	},
	"DPJ10 Capstone Refactor": {
		estimatedTime: "8–10 sessions · 60–120 minutes each",
		keyBlocks: [
			"characterization suite",
			"change scenarios",
			"small refactor commits",
			"architecture review",
			"before-and-after evidence",
			"rollback packet"
		],
		flowNote:
			"Refactor one cluttered Java application from a protected behavioral baseline, justify a small pattern set, preserve observable behavior, and present evidence that future changes became safer or simpler."
	}
};

function designPatternsJavaOptionPath(title: string) {
	return /extension|architecture judgment|structural wrapper/i.test(title)
		? ("challenge" as const)
		: ("choice" as const);
}

function insertDesignPatternsJavaItem(
	items: RawCourseModuleItem[],
	beforeTitle: string,
	item: RawCourseModuleItem
) {
	const index = items.findIndex(candidate => candidate.title === beforeTitle);
	if (index === -1) return [...items, item];
	return [...items.slice(0, index), item, ...items.slice(index)];
}

function decorateDesignPatternsJavaModule(
	module: RawCourse["modules"][number]
): RawCourse["modules"][number] {
	const flow = DESIGN_PATTERNS_JAVA_FLOW[module.title];
	let curriculum: RawCourseModuleItem[] = module.curriculum.map(item => ({
		...item,
		learningPath: "core" as const
	}));
	const coreProjectTitle = curriculum.at(-1)?.title ?? "";

	if (module.title === "DPJ1 What Patterns Are and What They Are Not") {
		curriculum = insertDesignPatternsJavaItem(
			curriculum,
			coreProjectTitle,
			{
				title: "Java Pattern Course Contract and Characterization Baseline",
				content: [
					"**Prerequisite:** Enter after Java classes, interfaces, inheritance, collections, exceptions, packages, generics, build tools, and basic unit tests are independently usable.",
					"**Baseline:** Build and run the starter before editing it. Add JUnit characterization tests for every observable behavior the refactor must preserve, including one error or edge path.",
					"**Decision record:** Name the change pressure, current pain, simplest viable alternative, candidate pattern, added cost, and evidence that would justify removing the pattern later.",
					"**Delivery:** Commit the green baseline separately from each small refactor so behavior and structure changes remain reviewable."
				].join("\n"),
				projectLink: DESIGN_PATTERNS_JAVA_JUNIT,
				learningPath: "core"
			}
		);
		curriculum = insertDesignPatternsJavaItem(
			curriculum,
			coreProjectTitle,
			{
				title: "One Change Scenario Before One Abstraction",
				content:
					"Describe one realistic future change and implement it once in the simple design before extracting an interface or pattern. If the change remains local and clear, keep the simpler code. If it scatters rules, duplicates decisions, or couples unrelated classes, record that evidence and refactor the smallest boundary that contains the pressure.",
				projectLink: DESIGN_PATTERNS_JAVA_JUNIT,
				learningPath: "core"
			}
		);
	}

	if (module.title === "DPJ2 Java Design Foundations") {
		curriculum = insertDesignPatternsJavaItem(
			curriculum,
			coreProjectTitle,
			{
				title: "Modern Java Types Before Classic Pattern Machinery",
				content: [
					"Use a record for a shallowly immutable, transparent value carrier; use an enum for a small fixed set with modest behavior; and use a sealed interface when the permitted family is intentionally closed.",
					"",
					"Compare these tools with Builder, State, Visitor, and class hierarchies. A classic pattern earns its place only when variation, lifecycle, or collaboration extends beyond what the language feature expresses clearly."
				].join("\n"),
				projectLink: DESIGN_PATTERNS_JAVA_RECORDS,
				solutionLink: DESIGN_PATTERNS_JAVA_SEALED,
				learningPath: "core"
			}
		);
		curriculum = insertDesignPatternsJavaItem(
			curriculum,
			coreProjectTitle,
			{
				title: "Package Dependency and Test-Seam Contract",
				content: [
					"Draw the package dependency arrows before refactoring. Domain code cannot import infrastructure details; composition at the application boundary selects concrete collaborators.",
					"",
					"Create one fake or in-memory collaborator at the seam, test the domain behavior without network, file, clock, or database effects, and reject interfaces that exist without a second implementation, a test seam, or a stable boundary."
				].join("\n"),
				projectLink: DESIGN_PATTERNS_JAVA_JUNIT,
				learningPath: "core"
			}
		);
	}

	if (module.title === "DPJ3 Creational Patterns I") {
		curriculum = insertDesignPatternsJavaItem(
			curriculum,
			coreProjectTitle,
			{
				title: "Creational Pattern Decision Matrix",
				content: [
					"Use a constructor or named static factory for simple, valid creation; Factory Method when a creator varies one product; Abstract Factory when compatible product families vary together; and Builder when staged or optional configuration would otherwise obscure validity.",
					"",
					"For every choice, test invalid configuration, default values, product-family compatibility, and whether dependencies are visible at construction time."
				].join("\n"),
				projectLink:
					"https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/util/function/Supplier.html",
				learningPath: "core"
			}
		);
	}

	if (module.title === "DPJ4 Creational Patterns II and Boundary Patterns") {
		curriculum = insertDesignPatternsJavaItem(
			curriculum,
			coreProjectTitle,
			{
				title: "Copy, Global State, and Boundary Risk Contract",
				content: [
					"**Prototype:** Define shallow versus deep copy, identity, mutable collection ownership, and failure behavior before cloning.",
					"**Singleton:** Treat global lifetime, hidden dependencies, test isolation, initialization order, and thread safety as explicit costs. Compare with one application-owned instance passed through constructors.",
					"**Adapter:** Translate one external contract into the domain's contract without leaking vendor types inward.",
					"**Facade:** Offer a smaller workflow over a subsystem without pretending the subsystem has become simple internally."
				].join("\n"),
				projectLink:
					"https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/lang/Cloneable.html",
				learningPath: "core"
			}
		);
	}

	if (module.title === "DPJ5 Structural Patterns in Depth") {
		curriculum = insertDesignPatternsJavaItem(
			curriculum,
			coreProjectTitle,
			{
				title: "Structural Pattern Identity and Lifecycle Contract",
				content: [
					"Bridge separates two independent axes of variation; Composite gives leaves and groups one client contract; Decorator adds nestable behavior; Proxy controls access or lifecycle; Flyweight shares immutable intrinsic state.",
					"",
					"For each implementation, state whether object identity is observable, who owns wrapped or shared resources, whether ordering changes behavior, how equality works, and which failures cross the boundary."
				].join("\n"),
				projectLink:
					"https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/lang/ref/WeakReference.html",
				learningPath: "core"
			}
		);
	}

	if (module.title === "DPJ6 Behavioral Patterns I") {
		curriculum = insertDesignPatternsJavaItem(
			curriculum,
			coreProjectTitle,
			{
				title: "Functional Strategy and Explicit-State Alternatives",
				content: [
					"Implement one Strategy as classes and one as a focused functional interface or method reference. Keep a class when behavior needs named state, lifecycle, dependencies, or multiple operations.",
					"",
					"Compare State objects with an enum or sealed state family, and compare Template Method inheritance with composition. Preserve illegal-transition tests and make the owner of every decision explicit."
				].join("\n"),
				projectLink:
					"https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/util/function/package-summary.html",
				learningPath: "core"
			}
		);
	}

	if (module.title === "DPJ7 Behavioral Patterns II") {
		curriculum = insertDesignPatternsJavaItem(
			curriculum,
			coreProjectTitle,
			{
				title: "Event, Command, and Undo Lifecycle Contract",
				content: [
					"Define event delivery order, duplicate registration, unsubscription, listener failure, reentrant publication, and thread ownership before implementing Observer or Mediator.",
					"",
					"For Command and Memento, define captured input, authorization boundary, idempotency, undo scope, history size, and memory retention. For Chain of Responsibility, prove whether zero, one, or many handlers can act."
				].join("\n"),
				projectLink:
					"https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/util/concurrent/Flow.html",
				learningPath: "core"
			}
		);
	}

	if (
		module.title ===
		"DPJ8 Modern Extensions and Architecture-Level Patterns"
	) {
		curriculum = insertDesignPatternsJavaItem(
			curriculum,
			coreProjectTitle,
			{
				title: "ServiceLoader Plugin Boundary",
				content: [
					"Define one narrow service interface in the core module, implement providers outside it, register them through `META-INF/services` or module `provides` declarations, and discover them with `ServiceLoader`.",
					"",
					"Handle zero, one, and multiple providers; test lazy loading and provider failure; keep application code dependent on the service rather than provider packages; and document that one `ServiceLoader` instance is not safe for concurrent use."
				].join("\n"),
				projectLink: DESIGN_PATTERNS_JAVA_SERVICE_LOADER,
				learningPath: "core"
			}
		);
		curriculum = insertDesignPatternsJavaItem(
			curriculum,
			coreProjectTitle,
			{
				title: "Architecture Pattern Scope and Fitness Contract",
				content: [
					"Name the layer or boundary, allowed dependency direction, data ownership, and one change scenario for MVC/MVVM, Repository, Service Layer, DI, or an event bus.",
					"",
					"Add one architecture fitness check: a package dependency test, isolated domain test, provider replacement test, or end-to-end workflow. Reject a Repository that merely renames a collection and a Service Layer that only forwards every call."
				].join("\n"),
				projectLink: DESIGN_PATTERNS_JAVA_JUNIT,
				learningPath: "core"
			}
		);
	}

	if (module.title === "DPJ9 Pattern Selection and Refactoring Judgment") {
		curriculum = insertDesignPatternsJavaItem(
			curriculum,
			coreProjectTitle,
			{
				title: "Pattern Decision Record and Simpler Counterfactual",
				content: [
					"Record the smell, change pressure, desired property, selected pattern, rejected simpler design, added classes and indirection, expected benefit, and a removal trigger.",
					"",
					"Implement or sketch the simpler counterfactual. Pattern fluency means explaining why this design earns more machinery now, not naming the most patterns."
				].join("\n"),
				projectLink: DESIGN_PATTERNS_JAVA_JUNIT,
				learningPath: "core"
			}
		);
		curriculum = insertDesignPatternsJavaItem(
			curriculum,
			coreProjectTitle,
			{
				title: "Safe Refactor and Measurement Contract",
				content: [
					"Keep characterization tests green through one behavior-preserving step per commit. Separate renames and moves from logic changes, and pause when a failing test cannot be explained.",
					"",
					"Measure the target change before and after: files touched, conditional branches changed, duplicated rules, constructor dependencies, test setup, or time to add a variant. A pattern succeeds only if the chosen pressure improves without hiding a larger cost."
				].join("\n"),
				projectLink: DESIGN_PATTERNS_JAVA_JUNIT,
				learningPath: "core"
			}
		);
	}

	if (module.title === "DPJ10 Capstone Refactor") {
		curriculum = insertDesignPatternsJavaItem(
			curriculum,
			coreProjectTitle,
			{
				title: "Capstone Gate: Characterize Before Change",
				content: [
					"Freeze the starter's observable behavior with JUnit tests, a build command, representative fixtures, and one failure-path assertion. Record any behavior that cannot yet be tested and create a seam before applying a pattern.",
					"",
					"Tag or commit this baseline. Every later structural change must retain the same behavior until the project explicitly schedules a separately reviewed behavior change."
				].join("\n"),
				projectLink: DESIGN_PATTERNS_JAVA_JUNIT,
				learningPath: "core"
			}
		);
		curriculum = insertDesignPatternsJavaItem(
			curriculum,
			coreProjectTitle,
			{
				title: "Capstone Evidence and Rollback Packet",
				content: [
					"Deliver the original design map, change scenarios, decision records, small commit sequence, green test evidence, final dependency map, and before-and-after measurements.",
					"",
					"Demonstrate one new variant or dependency replacement, identify one pattern deliberately not used, name one remaining tradeoff, and retain a clear rollback point for each major structural choice."
				].join("\n"),
				projectLink: DESIGN_PATTERNS_JAVA_JUNIT,
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
			learningPath: designPatternsJavaOptionPath(item.title)
		}))
	};
}

function buildDesignPatternsJavaStudioAppendix(
	modules: RawCourse["modules"]
): RawCourse["modules"][number] {
	return {
		kind: "appendix",
		title: "Optional Applied Java Pattern Studios",
		estimatedTime:
			"Choose one studio after its matching pattern family or capstone diagnosis",
		keyBlocks: [
			"guided refactor",
			"behavior preservation",
			"pattern comparison",
			"transfer scenario",
			"extension scenario",
			"decision reflection"
		],
		curriculum: [
			{
				title: "Applied Studio Scope Guide",
				content:
					"**Course flow:** These three studios preserve the complete applied practice collection without presenting them as three additional required units. Choose Strategy Selection for behavioral variation, Structural Wrapper for client-preserving indirection, or Architecture Judgment for a larger boundary decision. Begin from a green behavioral baseline and close reference code before transfer work.",
				learningPath: "core"
			}
		],
		supplementalProjects: modules.flatMap(module =>
			[...module.curriculum, ...module.supplementalProjects].map(
				item => ({
					...item,
					learningPath: designPatternsJavaOptionPath(item.title)
				})
			)
		)
	};
}

const designPatternsJavaPrimaryModules =
	designPatternsInJavaSourceCourse.modules
		.filter(module => DESIGN_PATTERNS_JAVA_PRIMARY_TITLES.has(module.title))
		.map(decorateDesignPatternsJavaModule);
const designPatternsJavaStudios =
	designPatternsInJavaSourceCourse.modules.filter(
		module => !DESIGN_PATTERNS_JAVA_PRIMARY_TITLES.has(module.title)
	);

export const designPatternsInJavaCourse: RawCourse = {
	...designPatternsInJavaSourceCourse,
	modules: [
		...designPatternsJavaPrimaryModules,
		buildDesignPatternsJavaStudioAppendix(designPatternsJavaStudios)
	]
};
