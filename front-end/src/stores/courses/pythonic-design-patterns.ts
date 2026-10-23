import type { RawCourse, RawCourseModuleItem } from "./types";
import { buildProjectGuidance } from "./projectGuidance";

const pythonicDesignPatternsSourceCourse: RawCourse = {
	name: "Pythonic Design Patterns",
	modules: [
		{
			title: "PDP0 Setup and Tooling",
			curriculum: [
				{
					title: "Editor, Interpreter, and Project Baseline",
					content:
						"Standardize on `Python 3` in either `PyCharm` or `VS Code`, verify the interpreter path, and make multi-file project navigation part of the opening setup. From the beginning, the course emphasizes architecture rather than a sequence of isolated scripts."
				},
				{
					title: "Packages, Virtual Environments, and Lightweight Testing",
					content:
						"Use a virtual environment, a simple `tests/` folder, and at least one repeatable run command before the first real pattern lab begins. Learn that safe refactoring depends on a stable workflow, not just on good intentions."
				},
				{
					title: "Positioning against Python 2, Python 3, and the Java Track",
					content:
						"Frame this course as a follow-up after Python fundamentals for improving structure, reuse, and maintainability. The Python track borrows the judgment from the Java design-patterns sequence without copying the Java object model."
				},
				{
					title: "Pattern Names as Compression, Not Decoration",
					content:
						"Refactoring.Guru's core framing treats patterns as reusable solution shapes, but Python often offers a lighter feature such as a function, decorator, context object, or module boundary. Restraint is part of the design vocabulary from the beginning."
				},
				{
					title: "PDP0 Setup and Tooling: Core Project",
					content: buildProjectGuidance({
						courseFamily: "Python",
						moduleTitle: "PDP0 Setup and Tooling",
						projectKind: "core",
						hasReference: false
					})
				}
			],
			supplementalProjects: [
				{
					title: "Pattern Journal: Setup and Tooling",
					content:
						"Keep a compact journal for setup and tooling that records the design pressure, the simplest Python feature that might solve it, the named pattern if one is still justified, and one short note about which workflow choices will make later refactors observable and safe. The habit is diagnosis first, pattern name second."
				},
				{
					title: "Setup Snapshot: Pythonic Design Patterns",
					content:
						"Create a compact setup snapshot for the course workspace. Record the Python version, editor, virtual-environment command, project folder structure, and one repeatable test or run command. Add a small pattern-journal template with columns for design pressure, simplest Python feature, possible pattern name, and verification evidence. The final snapshot makes clear how future labs will be run, tested, and compared before any pattern names are introduced."
				}
			]
		},
		{
			title: "PDP1 Why Python Changes the Design-Patterns Conversation",
			curriculum: [
				{
					title: "Dynamic Typing, Duck Typing, and Protocol Thinking",
					content:
						"Focus on behavior and shape rather than concrete inheritance trees. Pythonic architecture often starts from the question 'what capabilities are required?' instead of 'which subclass exists?'"
				},
				{
					title: "Functions, Closures, and Decorators as First-Class Design Tools",
					content:
						"Make functions and decorators part of the design-pattern conversation immediately. Many Strategy-, Command-, and Proxy-like needs can be met cleanly with callables before adding extra classes."
				},
				{
					title: "Modules and Packages as Architectural Boundaries",
					content:
						"Python module boundaries often do work that other languages push into extra classes. Packages, imports, and file ownership are part of the design vocabulary, not just project setup details."
				},
				{
					title: "When the Textbook Form Still Helps",
					content:
						"Do not overcorrect into 'never use patterns in Python'. Explicit patterns still help when state, extension pressure, third-party integration, or team readability justify them. The useful question is whether the pattern makes the next change safer and clearer than a direct function or small module would. Keep the textbook form when it names stable roles, isolates an external system, or makes variation explicit; simplify it when the class structure only adds ceremony without changing the behavior or maintenance story. A good comparison shows the simple version first, then explains the concrete pressure that made the pattern worthwhile."
				},
				{
					title: "PDP1 Why Python Changes the Design-Patterns Conversation: Core Project",
					content: buildProjectGuidance({
						courseFamily: "Python",
						moduleTitle:
							"PDP1 Why Python Changes the Design-Patterns Conversation",
						projectKind: "core",
						hasReference: false
					}),
					projectLink:
						"https://github.com/instruction-material/Pythonic-Design-Patterns/tree/main/PDP-01-pdp1-why-python-changes-the-design-patterns-conversation-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Pythonic-Design-Patterns/tree/main/PDP-01-pdp1-why-python-changes-the-design-patterns-conversation-supplemental-2/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Pattern Journal: Why Python Changes the Design-Patterns Conversation",
					content:
						"Keep a compact journal for why Python changes the design-patterns conversation that records the design pressure, the simplest Python feature that might solve it, the named pattern if one is still justified, and one short note about which Python features replace ceremony and which ones simply hide it. The habit is diagnosis first, pattern name second.",
					projectLink:
						"https://github.com/instruction-material/Pythonic-Design-Patterns/tree/main/PDP-02-pdp1-why-python-changes-the-design-patterns-conversation-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Pythonic-Design-Patterns/tree/main/PDP-02-pdp1-why-python-changes-the-design-patterns-conversation-supplemental-3/solution"
				},
				{
					title: "Why Python Changes the Design Patterns Conversation Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "Python",
						moduleTitle:
							"PDP1 Why Python Changes the Design-Patterns Conversation",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Pythonic-Design-Patterns/tree/main/PDP-01-pdp1-why-python-changes-the-design-patterns-conversation-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Pythonic-Design-Patterns/tree/main/PDP-01-pdp1-why-python-changes-the-design-patterns-conversation-supplemental-2/solution"
				},
				{
					title: "Why Python Changes the Design Patterns Conversation Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "Python",
						moduleTitle:
							"PDP1 Why Python Changes the Design-Patterns Conversation",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Pythonic-Design-Patterns/tree/main/PDP-02-pdp1-why-python-changes-the-design-patterns-conversation-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Pythonic-Design-Patterns/tree/main/PDP-02-pdp1-why-python-changes-the-design-patterns-conversation-supplemental-3/solution"
				}
			]
		},
		{
			title: "PDP2 Design Foundations in Python",
			curriculum: [
				{
					title: "Composition over Inheritance in a Python Setting",
					content:
						"Small Python examples show why composition, delegation, and explicit collaborators scale better than eager subclass trees. Inheritance used only as a habit deserves skepticism."
				},
				{
					title: "Protocols, ABCs, and Informal Interfaces",
					content:
						"`typing.Protocol`, abstract base classes, and duck typing are three different contract tools with different tradeoffs. Python can express contracts lightly without pretending every project needs heavy interface scaffolding."
				},
				{
					title: "Data Classes, Configuration Objects, and Dependency Direction",
					content:
						"Use `dataclasses` and small configuration objects to make dependencies explicit and data movement readable. This sets up later Builder, Adapter, and refactoring work."
				},
				{
					title: "Seams for Testing and Refactoring",
					content:
						"Show where to place seams for file I/O, network access, time, randomness, and external services. Good Python design makes later tests and later cleanup easier without adding fake complexity."
				},
				{
					title: "PDP2 Design Foundations in Python: Core Project",
					content: buildProjectGuidance({
						courseFamily: "Python",
						moduleTitle: "PDP2 Design Foundations in Python",
						projectKind: "core",
						hasReference: false
					}),
					projectLink:
						"https://github.com/instruction-material/Pythonic-Design-Patterns/tree/main/PDP-03-pdp2-design-foundations-in-python-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Pythonic-Design-Patterns/tree/main/PDP-03-pdp2-design-foundations-in-python-supplemental-2/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Pattern Journal: Design Foundations in Python",
					content:
						"Keep a compact journal for design foundations in Python that records the design pressure, the simplest Python feature that might solve it, the named pattern if one is still justified, and one short note about which boundary would be easiest to fake, replace, or move later. The habit is diagnosis first, pattern name second.",
					projectLink:
						"https://github.com/instruction-material/Pythonic-Design-Patterns/tree/main/PDP-04-pdp2-design-foundations-in-python-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Pythonic-Design-Patterns/tree/main/PDP-04-pdp2-design-foundations-in-python-supplemental-3/solution"
				},
				{
					title: "Design Foundations in Python Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "Python",
						moduleTitle: "PDP2 Design Foundations in Python",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Pythonic-Design-Patterns/tree/main/PDP-03-pdp2-design-foundations-in-python-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Pythonic-Design-Patterns/tree/main/PDP-03-pdp2-design-foundations-in-python-supplemental-2/solution"
				},
				{
					title: "Design Foundations in Python Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "Python",
						moduleTitle: "PDP2 Design Foundations in Python",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Pythonic-Design-Patterns/tree/main/PDP-04-pdp2-design-foundations-in-python-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Pythonic-Design-Patterns/tree/main/PDP-04-pdp2-design-foundations-in-python-supplemental-3/solution"
				}
			]
		},
		{
			title: "PDP3 Strategy Without Ceremony",
			curriculum: [
				{
					title: "Functions as Strategies",
					content:
						"Start Strategy with plain callables and dictionaries of behavior rather than with class hierarchies. First feel how simple it is to swap behavior in Python before adding object structure."
				},
				{
					title: "Callable Objects When State Matters",
					content:
						"Callable objects fit best when a strategy needs configuration, history, or bundled helper methods. This keeps the class-based form tied to a real reason instead of turning it into the default."
				},
				{
					title: "Replacing Long Conditionals with Selected Behavior",
					content:
						"Use long pricing, scoring, or rule-selection chains to show when Strategy improves clarity. Connect the pattern to conditional pressure rather than to abstract pattern memorization."
				},
				{
					title: "When a Dictionary Lookup Beats a Full Pattern",
					content:
						"Explicitly compare Strategy with a simple mapping of names to functions. The Pythonic lesson is that structure grows only when the problem justifies it."
				},
				{
					title: "PDP3 Strategy Without Ceremony: Core Project",
					content: buildProjectGuidance({
						courseFamily: "Python",
						moduleTitle: "PDP3 Strategy Without Ceremony",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Pythonic-Design-Patterns/tree/main/PDP1-Strategy-Rulebook/starter",
					solutionLink:
						"https://github.com/instruction-material/Pythonic-Design-Patterns/tree/main/PDP1-Strategy-Rulebook/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Project: Strategy Rulebook",
					content:
						"Build a small rule-selection engine where pricing or scoring behavior can be swapped between plain functions, configured callables, and named selections. Strategy appears first in a Pythonic form before the course grows more structural.",
					projectLink:
						"https://github.com/instruction-material/Pythonic-Design-Patterns/tree/main/PDP1-Strategy-Rulebook/starter",
					solutionLink:
						"https://github.com/instruction-material/Pythonic-Design-Patterns/tree/main/PDP1-Strategy-Rulebook/solution"
				},
				{
					title: "Strategy Without Ceremony Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "Python",
						moduleTitle: "PDP3 Strategy Without Ceremony",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Pythonic-Design-Patterns/tree/main/PDP-05-pdp3-strategy-without-ceremony-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Pythonic-Design-Patterns/tree/main/PDP-05-pdp3-strategy-without-ceremony-supplemental-2/solution"
				},
				{
					title: "Strategy Without Ceremony Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "Python",
						moduleTitle: "PDP3 Strategy Without Ceremony",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Pythonic-Design-Patterns/tree/main/PDP-06-pdp3-strategy-without-ceremony-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Pythonic-Design-Patterns/tree/main/PDP-06-pdp3-strategy-without-ceremony-supplemental-3/solution"
				}
			]
		},
		{
			title: "PDP4 Factory and Builder in Python",
			curriculum: [
				{
					title: "Factory Functions and Named Constructors",
					content:
						"Factory functions and `@classmethod` constructors are the default Python tools for creation pressure. These options already solve many textbook Factory Method problems cleanly before a heavier pattern form is needed."
				},
				{
					title: "Builder for Configuration-Heavy Objects",
					content:
						"Builder fits best when object setup becomes noisy, order-sensitive, or full of optional configuration. The key question is readability and correctness, not pattern completionism."
				},
				{
					title: "Families, Variants, and Environment Selection",
					content:
						"Use exporters, notifiers, parsers, or service clients to show when a factory is selecting between coordinated variants. Keep the lesson practical by tying it to configuration and deployment choices."
				},
				{
					title: "What to Avoid in Python Creation Code",
					content:
						"Warn against creation frameworks that merely hide constructors behind more constructors. Python creation code usually becomes shorter and clearer, not more ceremonial."
				},
				{
					title: "PDP4 Factory and Builder in Python: Core Project",
					content: buildProjectGuidance({
						courseFamily: "Python",
						moduleTitle: "PDP4 Factory and Builder in Python",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Pythonic-Design-Patterns/tree/main/PDP2-Factory-and-Builder-Config-Kit/starter",
					solutionLink:
						"https://github.com/instruction-material/Pythonic-Design-Patterns/tree/main/PDP2-Factory-and-Builder-Config-Kit/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Project: Factory and Builder Config Kit",
					content:
						"Construct reports or exporters from configuration while choosing concrete output strategies through factories and using a lightweight builder only where the setup truly gets noisy. This lab is about learning where the boundary between useful structure and needless ceremony sits.",
					projectLink:
						"https://github.com/instruction-material/Pythonic-Design-Patterns/tree/main/PDP2-Factory-and-Builder-Config-Kit/starter",
					solutionLink:
						"https://github.com/instruction-material/Pythonic-Design-Patterns/tree/main/PDP2-Factory-and-Builder-Config-Kit/solution"
				},
				{
					title: "Factory and Builder in Python Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "Python",
						moduleTitle: "PDP4 Factory and Builder in Python",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Pythonic-Design-Patterns/tree/main/PDP-07-pdp4-factory-and-builder-in-python-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Pythonic-Design-Patterns/tree/main/PDP-07-pdp4-factory-and-builder-in-python-supplemental-2/solution"
				},
				{
					title: "Factory and Builder in Python Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "Python",
						moduleTitle: "PDP4 Factory and Builder in Python",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Pythonic-Design-Patterns/tree/main/PDP-08-pdp4-factory-and-builder-in-python-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Pythonic-Design-Patterns/tree/main/PDP-08-pdp4-factory-and-builder-in-python-supplemental-3/solution"
				}
			]
		},
		{
			title: "PDP5 Observer, Events, and Callbacks",
			curriculum: [
				{
					title: "Subscription Lists and Event Fan-Out",
					content:
						"Observer is a controlled way to notify multiple listeners without hard-coding every downstream action into the source object. In Python, this often begins with lists of callables before it becomes a larger event abstraction."
				},
				{
					title: "Designing Event Payloads and Listener Contracts",
					content:
						"Event payload shape affects coupling. A good event system tells subscribers enough to act without leaking the entire source object or making every listener depend on internal details."
				},
				{
					title: "Unsubscribe, Ordering, and Failure Handling",
					content:
						"Make the operational concerns explicit: duplicate subscriptions, stale listeners, listener exceptions, and event ordering all affect whether an event system stays understandable. Do not mistake Observer for free decoupling."
				},
				{
					title: "Sync versus Async Event Flow",
					content:
						"Keep async treatment conceptual but concrete enough to distinguish when immediate callbacks are sufficient and when background event handling changes the failure model."
				},
				{
					title: "PDP5 Observer, Events, and Callbacks: Core Project",
					content: buildProjectGuidance({
						courseFamily: "Python",
						moduleTitle: "PDP5 Observer, Events, and Callbacks",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Pythonic-Design-Patterns/tree/main/PDP3-Observer-Notification-Hub/starter",
					solutionLink:
						"https://github.com/instruction-material/Pythonic-Design-Patterns/tree/main/PDP3-Observer-Notification-Hub/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Project: Observer Notification Hub",
					content:
						"Build an event bus that fans account or order events out to several listeners such as logs, summaries, and user-facing notifications. The lab makes event boundaries and unsubscribe behavior observable rather than magical.",
					projectLink:
						"https://github.com/instruction-material/Pythonic-Design-Patterns/tree/main/PDP3-Observer-Notification-Hub/starter",
					solutionLink:
						"https://github.com/instruction-material/Pythonic-Design-Patterns/tree/main/PDP3-Observer-Notification-Hub/solution"
				},
				{
					title: "Observer, Events, and Callbacks Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "Python",
						moduleTitle: "PDP5 Observer, Events, and Callbacks",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Pythonic-Design-Patterns/tree/main/PDP-09-pdp5-observer-events-and-callbacks-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Pythonic-Design-Patterns/tree/main/PDP-09-pdp5-observer-events-and-callbacks-supplemental-2/solution"
				},
				{
					title: "Observer, Events, and Callbacks Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "Python",
						moduleTitle: "PDP5 Observer, Events, and Callbacks",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Pythonic-Design-Patterns/tree/main/PDP-10-pdp5-observer-events-and-callbacks-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Pythonic-Design-Patterns/tree/main/PDP-10-pdp5-observer-events-and-callbacks-supplemental-3/solution"
				}
			]
		},
		{
			title: "PDP6 Decorator, Proxy, and Facade",
			curriculum: [
				{
					title: "Function Decorators and Object Wrappers",
					content:
						"Compare function decorators with object-level wrappers to show where each style shines. Logging, caching, metrics, and access checks often start as decorators before they need a fuller proxy or wrapper object."
				},
				{
					title: "Proxy for Control, Facade for Simplicity",
					content:
						"Make the distinction explicit: a proxy controls or guards access to something real, while a facade simplifies a messy subsystem. Stop grouping every wrapper under one vague category."
				},
				{
					title: "Layering Behavior without Hiding Intent",
					content:
						"Wrappers can become unreadable if they stack carelessly. A Pythonic design still lets another developer explain the actual call path without hunting through invisible magic."
				},
				{
					title: "Cross-Cutting Concerns without Framework Bloat",
					content:
						"Use caching, auth checks, tracing, and high-level service orchestration as examples of cross-cutting concerns. Apply these narrowly rather than building a mini-framework by accident."
				},
				{
					title: "PDP6 Decorator, Proxy, and Facade: Core Project",
					content: buildProjectGuidance({
						courseFamily: "Python",
						moduleTitle: "PDP6 Decorator, Proxy, and Facade",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Pythonic-Design-Patterns/tree/main/PDP4-Decorator-Proxy-Facade-Toolkit/starter",
					solutionLink:
						"https://github.com/instruction-material/Pythonic-Design-Patterns/tree/main/PDP4-Decorator-Proxy-Facade-Toolkit/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Project: Decorator, Proxy, and Facade Toolkit",
					content:
						"Wrap a small profile or content service with metrics, lightweight authorization, caching, and one simplifying facade. The project separates adding behavior, guarding access, and simplifying a subsystem boundary.",
					projectLink:
						"https://github.com/instruction-material/Pythonic-Design-Patterns/tree/main/PDP4-Decorator-Proxy-Facade-Toolkit/starter",
					solutionLink:
						"https://github.com/instruction-material/Pythonic-Design-Patterns/tree/main/PDP4-Decorator-Proxy-Facade-Toolkit/solution"
				},
				{
					title: "Decorator, Proxy, and Facade Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "Python",
						moduleTitle: "PDP6 Decorator, Proxy, and Facade",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Pythonic-Design-Patterns/tree/main/PDP-11-pdp6-decorator-proxy-and-facade-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Pythonic-Design-Patterns/tree/main/PDP-11-pdp6-decorator-proxy-and-facade-supplemental-2/solution"
				},
				{
					title: "Decorator, Proxy, and Facade Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "Python",
						moduleTitle: "PDP6 Decorator, Proxy, and Facade",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Pythonic-Design-Patterns/tree/main/PDP-12-pdp6-decorator-proxy-and-facade-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Pythonic-Design-Patterns/tree/main/PDP-12-pdp6-decorator-proxy-and-facade-supplemental-3/solution"
				}
			]
		},
		{
			title: "PDP7 State and Command",
			curriculum: [
				{
					title: "Explicit State Objects versus Enum-Driven Branching",
					content:
						"State is a response to behavior that changes by mode, not a universal replacement for every flag. Compare a growing branch tree with explicit state objects and choose based on the actual complexity."
				},
				{
					title: "Commands as Callables, Objects, and History Entries",
					content:
						"Use closures, small command objects, and history records to show several Pythonic forms of Command. The common theme is packaging an action so it can be queued, logged, retried, or undone."
				},
				{
					title: "Undo, Replay, and Action Queues",
					content:
						"Command becomes more valuable when actions need history or delayed execution. This keeps the pattern tied to a real operational benefit rather than a naming exercise."
				},
				{
					title: "Combining State and Command Carefully",
					content:
						"Turn-based flows, editors, and workflow systems often use both patterns together. Mode logic and action packaging stay separate so the design remains explainable."
				},
				{
					title: "PDP7 State and Command: Core Project",
					content: buildProjectGuidance({
						courseFamily: "Python",
						moduleTitle: "PDP7 State and Command",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Pythonic-Design-Patterns/tree/main/PDP5-State-Command-Quest-Loop/starter",
					solutionLink:
						"https://github.com/instruction-material/Pythonic-Design-Patterns/tree/main/PDP5-State-Command-Quest-Loop/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Project: State and Command Quest Loop",
					content:
						"Build a small quest or workflow loop where explicit states govern allowed actions and command objects or callables power history, replay, or undo. The lab functions as applied control-flow cleanup, not just game-themed syntax practice.",
					projectLink:
						"https://github.com/instruction-material/Pythonic-Design-Patterns/tree/main/PDP5-State-Command-Quest-Loop/starter",
					solutionLink:
						"https://github.com/instruction-material/Pythonic-Design-Patterns/tree/main/PDP5-State-Command-Quest-Loop/solution"
				},
				{
					title: "State and Command Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "Python",
						moduleTitle: "PDP7 State and Command",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Pythonic-Design-Patterns/tree/main/PDP-13-pdp7-state-and-command-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Pythonic-Design-Patterns/tree/main/PDP-13-pdp7-state-and-command-supplemental-2/solution"
				},
				{
					title: "State and Command Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "Python",
						moduleTitle: "PDP7 State and Command",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Pythonic-Design-Patterns/tree/main/PDP-14-pdp7-state-and-command-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Pythonic-Design-Patterns/tree/main/PDP-14-pdp7-state-and-command-supplemental-3/solution"
				}
			]
		},
		{
			title: "PDP8 Adapter and Integration Boundaries",
			curriculum: [
				{
					title: "Adapters for Third-Party Data and APIs",
					content:
						"Adapter is a boundary-normalization tool whenever outside systems return awkward names, shapes, or expectations. External weirdness stays near the edge instead of spreading through the codebase."
				},
				{
					title: "Compatibility Layers and Anti-Corruption Boundaries",
					content:
						"Use the adapter lesson to introduce the broader idea of keeping internal models clean even when vendors or legacy inputs are messy. This is one of the most practically useful patterns in Python service and tooling work."
				},
				{
					title: "Testing Adapters with Small, Explicit Fixtures",
					content:
						"Adapter code is validated with tiny fixtures that make field mapping and default handling obvious. Treat boundary tests as evidence that the internal model is staying protected."
				},
				{
					title: "When a Translation Function Is Enough",
					content:
						"Not every adapter needs a class. A well-named translation function or lightweight wrapper may be the clearest move when the source pressure is small."
				},
				{
					title: "PDP8 Adapter and Integration Boundaries: Core Project",
					content: buildProjectGuidance({
						courseFamily: "Python",
						moduleTitle: "PDP8 Adapter and Integration Boundaries",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Pythonic-Design-Patterns/tree/main/PDP6-Adapter-Template-Import-Pipeline/starter",
					solutionLink:
						"https://github.com/instruction-material/Pythonic-Design-Patterns/tree/main/PDP6-Adapter-Template-Import-Pipeline/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Project: Adapter and Import Pipeline",
					content:
						"Normalize several awkward external record formats into one internal model, then run them through a clean import pipeline. The point is to make the integration boundary explicit and keep vendor-specific noise out of the rest of the app.",
					projectLink:
						"https://github.com/instruction-material/Pythonic-Design-Patterns/tree/main/PDP6-Adapter-Template-Import-Pipeline/starter",
					solutionLink:
						"https://github.com/instruction-material/Pythonic-Design-Patterns/tree/main/PDP6-Adapter-Template-Import-Pipeline/solution"
				},
				{
					title: "Adapter and Integration Boundaries Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "Python",
						moduleTitle: "PDP8 Adapter and Integration Boundaries",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Pythonic-Design-Patterns/tree/main/PDP-15-pdp8-adapter-and-integration-boundaries-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Pythonic-Design-Patterns/tree/main/PDP-15-pdp8-adapter-and-integration-boundaries-supplemental-2/solution"
				},
				{
					title: "Adapter and Integration Boundaries Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "Python",
						moduleTitle: "PDP8 Adapter and Integration Boundaries",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Pythonic-Design-Patterns/tree/main/PDP-16-pdp8-adapter-and-integration-boundaries-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Pythonic-Design-Patterns/tree/main/PDP-16-pdp8-adapter-and-integration-boundaries-supplemental-3/solution"
				}
			]
		},
		{
			title: "PDP9 Template Method versus Higher-Order Functions",
			curriculum: [
				{
					title: "Inheritance-Based Skeletons and Hook Methods",
					content:
						"The textbook Template Method shape is included for recognition, but the use case stays concrete: a stable algorithm skeleton with a few genuine hooks. Treat it as a niche tool, not a default architecture style."
				},
				{
					title: "Replacing Template Method with Callables or Composition",
					content:
						"Higher-order functions, small collaborators, or composed pipeline steps often express the same intent more cleanly in Python. Compare the tradeoff directly instead of relying on a slogan."
				},
				{
					title: "Choosing by Extension Pressure",
					content:
						"Compare several variations of a workflow and ask whether the extension points are truly stable enough to justify an inheritance skeleton. If the answer is no, the design stays lighter."
				},
				{
					title: "Readability and Onboarding Cost",
					content:
						"Template Method can obscure behavior for newer readers when hooks are scattered across subclasses. Pythonic design makes the final control flow easier to follow, not harder."
				},
				{
					title: "PDP9 Template Method versus Higher-Order Functions: Core Project",
					content: buildProjectGuidance({
						courseFamily: "Python",
						moduleTitle:
							"PDP9 Template Method versus Higher-Order Functions",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Pythonic-Design-Patterns/tree/main/PDP6-Adapter-Template-Import-Pipeline/starter",
					solutionLink:
						"https://github.com/instruction-material/Pythonic-Design-Patterns/tree/main/PDP6-Adapter-Template-Import-Pipeline/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Project: Compare Template Skeletons with Callable Pipelines",
					content:
						"Use the same import or workflow problem in both an inheritance-based and higher-order-function form, then explain which version is easier to evolve and why. The exercise makes the Pythonic bias toward simpler extension mechanisms feel earned.",
					projectLink:
						"https://github.com/instruction-material/Pythonic-Design-Patterns/tree/main/PDP6-Adapter-Template-Import-Pipeline/starter",
					solutionLink:
						"https://github.com/instruction-material/Pythonic-Design-Patterns/tree/main/PDP6-Adapter-Template-Import-Pipeline/solution"
				},
				{
					title: "Method versus Higher Order Functions Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "Python",
						moduleTitle:
							"PDP9 Template Method versus Higher-Order Functions",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Pythonic-Design-Patterns/tree/main/PDP-17-pdp9-template-method-versus-higher-order-functions-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Pythonic-Design-Patterns/tree/main/PDP-17-pdp9-template-method-versus-higher-order-functions-supplemental-2/solution"
				},
				{
					title: "Method versus Higher Order Functions Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "Python",
						moduleTitle:
							"PDP9 Template Method versus Higher-Order Functions",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Pythonic-Design-Patterns/tree/main/PDP-18-pdp9-template-method-versus-higher-order-functions-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Pythonic-Design-Patterns/tree/main/PDP-18-pdp9-template-method-versus-higher-order-functions-supplemental-3/solution"
				}
			]
		},
		{
			title: "PDP10 Singleton, Global State, and Module Patterns",
			curriculum: [
				{
					title: "Module-Level Singletons and Why They Feel Convenient",
					content:
						"Module state, cached objects, and one-per-process resources are Python's practical forms of singleton-like behavior. The topic starts from real convenience before moving into the costs."
				},
				{
					title: "Hidden Globals, Implicit Coupling, and Test Pain",
					content:
						"Global state quietly spreads dependencies across functions and modules. Connect hidden global reads and writes to flaky tests, surprising behavior, and difficult refactors."
				},
				{
					title: "Context Objects, App Factories, and Explicit Wiring",
					content:
						"Offer practical alternatives such as configuration objects, explicit dependency injection, app factories, or small service containers. The replacement is simpler to reason about, not theoretically purer."
				},
				{
					title: "When Shared Process State Is Still Legitimate",
					content:
						"Do not pretend every shared object is wrong. Some caches, registries, or process-wide resources are fine if their lifecycle and ownership are explicit and narrow."
				},
				{
					title: "PDP10 Singleton, Global State, and Module Patterns: Core Project",
					content: buildProjectGuidance({
						courseFamily: "Python",
						moduleTitle:
							"PDP10 Singleton, Global State, and Module Patterns",
						projectKind: "core",
						hasReference: false
					}),
					projectLink:
						"https://github.com/instruction-material/Pythonic-Design-Patterns/tree/main/PDP-19-pdp10-singleton-global-state-and-module-patterns/starter",
					solutionLink:
						"https://github.com/instruction-material/Pythonic-Design-Patterns/tree/main/PDP-19-pdp10-singleton-global-state-and-module-patterns/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Pattern Journal: Singleton, Global State, and Module Patterns",
					content:
						"Keep a compact journal for singleton, global state, and module patterns that records the design pressure, the simplest Python feature that might solve it, the named pattern if one is still justified, and one short note about which shared objects are explicit resources and which ones are just hidden dependencies. The habit is diagnosis first, pattern name second.",
					projectLink:
						"https://github.com/instruction-material/Pythonic-Design-Patterns/tree/main/PDP-20-pdp10-singleton-global-state-and-module-patterns/starter",
					solutionLink:
						"https://github.com/instruction-material/Pythonic-Design-Patterns/tree/main/PDP-20-pdp10-singleton-global-state-and-module-patterns/solution"
				},
				{
					title: "Singleton, Global State, and Module Patterns Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "Python",
						moduleTitle:
							"PDP10 Singleton, Global State, and Module Patterns",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Pythonic-Design-Patterns/tree/main/PDP-19-pdp10-singleton-global-state-and-module-patterns/starter",
					solutionLink:
						"https://github.com/instruction-material/Pythonic-Design-Patterns/tree/main/PDP-19-pdp10-singleton-global-state-and-module-patterns/solution"
				},
				{
					title: "Singleton, Global State, and Module Patterns Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "Python",
						moduleTitle:
							"PDP10 Singleton, Global State, and Module Patterns",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Pythonic-Design-Patterns/tree/main/PDP-20-pdp10-singleton-global-state-and-module-patterns/starter",
					solutionLink:
						"https://github.com/instruction-material/Pythonic-Design-Patterns/tree/main/PDP-20-pdp10-singleton-global-state-and-module-patterns/solution"
				}
			]
		},
		{
			title: "PDP11 Refactoring Python Code Smells",
			curriculum: [
				{
					title: "From Large Script to Coherent Modules",
					content:
						"Script-to-application refactors work best as a series of small moves: extract functions, name concepts, isolate I/O, group state, and split files by responsibility. The point is to make evolution realistic instead of magical."
				},
				{
					title: "Tangled Conditionals and Mixed Responsibilities",
					content:
						"Use duplicate branches, mixed formatting/business logic, and kitchen-sink classes to show when Strategy, Adapter, or simple extraction might help. Map smells to the smallest effective cleanup step."
				},
				{
					title: "Data, Behavior, and Overgrown Objects",
					content:
						"Class design starts by separating real behavior, plain data storage, and overloaded responsibilities. Python code can move behavior closer to the data without treating every record as an object-heavy design exercise."
				},
				{
					title: "Tests and Characterization before Structural Change",
					content:
						"Lightweight characterization tests or scripted assertions exist before bigger changes land. Even in Python, safe refactoring depends on evidence that the external behavior still holds."
				},
				{
					title: "PDP11 Refactoring Python Code Smells: Core Project",
					content: buildProjectGuidance({
						courseFamily: "Python",
						moduleTitle: "PDP11 Refactoring Python Code Smells",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Pythonic-Design-Patterns/tree/main/PDP7-Pythonic-Refactor-Capstone/starter",
					solutionLink:
						"https://github.com/instruction-material/Pythonic-Design-Patterns/tree/main/PDP7-Pythonic-Refactor-Capstone/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Project: Pythonic Refactor Capstone Starter",
					content:
						"Begin with a deliberately messy text-processing or workflow app, identify the dominant smells, and plan a staged cleanup that uses only the patterns the code actually earns. This is the handoff into the final capstone sequence.",
					projectLink:
						"https://github.com/instruction-material/Pythonic-Design-Patterns/tree/main/PDP7-Pythonic-Refactor-Capstone/starter",
					solutionLink:
						"https://github.com/instruction-material/Pythonic-Design-Patterns/tree/main/PDP7-Pythonic-Refactor-Capstone/solution"
				},
				{
					title: "Refactoring Python Code Smells Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "Python",
						moduleTitle: "PDP11 Refactoring Python Code Smells",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Pythonic-Design-Patterns/tree/main/PDP-21-pdp11-refactoring-python-code-smells-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Pythonic-Design-Patterns/tree/main/PDP-21-pdp11-refactoring-python-code-smells-supplemental-2/solution"
				},
				{
					title: "Refactoring Python Code Smells Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "Python",
						moduleTitle: "PDP11 Refactoring Python Code Smells",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Pythonic-Design-Patterns/tree/main/PDP-22-pdp11-refactoring-python-code-smells-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Pythonic-Design-Patterns/tree/main/PDP-22-pdp11-refactoring-python-code-smells-supplemental-3/solution"
				}
			]
		},
		{
			title: "PDP12 Capstone Pythonic Refactor Studio",
			curriculum: [
				{
					title: "Choose a Messy but Salvageable App",
					content:
						"Use a medium-sized Python project with real duplication, mixed responsibilities, and awkward boundaries, but keep it small enough for the whole system to stay explainable. The capstone feels like rescue work, not greenfield architecture fiction."
				},
				{
					title: "Refactor in Small, Defensible Steps",
					content:
						"Use a sequence of narrow changes with explanation after each one: what pressure was reduced, what stayed stable, and why the next move became clearer. This keeps the capstone centered on judgment rather than on code churn."
				},
				{
					title: "Document Patterns Used and Patterns Avoided",
					content:
						"The reflection records which patterns arrived naturally, which possible patterns were rejected, and why the Pythonic solution stayed lighter in some areas. The avoidance decisions matter as much as the chosen ones."
				},
				{
					title: "Final Review: More Pythonic, More Maintainable, Still Explainable",
					content:
						"The final standard is not 'contains many patterns'. The final standard is that the code is easier to read, safer to change, and easier to explain to another developer than the starting version."
				},
				{
					title: "PDP12 Capstone Pythonic Refactor Studio: Core Project",
					content: buildProjectGuidance({
						courseFamily: "Python",
						moduleTitle: "PDP12 Capstone Pythonic Refactor Studio",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Pythonic-Design-Patterns/tree/main/PDP7-Pythonic-Refactor-Capstone/starter",
					solutionLink:
						"https://github.com/instruction-material/Pythonic-Design-Patterns/tree/main/PDP7-Pythonic-Refactor-Capstone/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Project: Pythonic Refactor Capstone",
					content:
						"Take the capstone starter through diagnosis, extraction, boundary cleanup, and final polish, then compare the finished structure against the original in a short architecture review. The best solutions are lighter and clearer, not more ornate.",
					projectLink:
						"https://github.com/instruction-material/Pythonic-Design-Patterns/tree/main/PDP7-Pythonic-Refactor-Capstone/starter",
					solutionLink:
						"https://github.com/instruction-material/Pythonic-Design-Patterns/tree/main/PDP7-Pythonic-Refactor-Capstone/solution"
				},
				{
					title: "Capstone Pythonic Refactor Studio Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "Python",
						moduleTitle: "PDP12 Capstone Pythonic Refactor Studio",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Pythonic-Design-Patterns/tree/main/PDP-23-pdp12-capstone-pythonic-refactor-studio-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Pythonic-Design-Patterns/tree/main/PDP-23-pdp12-capstone-pythonic-refactor-studio-supplemental-2/solution"
				},
				{
					title: "Capstone Pythonic Refactor Studio Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "Python",
						moduleTitle: "PDP12 Capstone Pythonic Refactor Studio",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Pythonic-Design-Patterns/tree/main/PDP-24-pdp12-capstone-pythonic-refactor-studio-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Pythonic-Design-Patterns/tree/main/PDP-24-pdp12-capstone-pythonic-refactor-studio-supplemental-3/solution"
				}
			]
		}
	]
};

const PYTHONIC_PATTERNS_UNITTEST =
	"https://docs.python.org/3.14/library/unittest.html";
const PYTHONIC_PATTERNS_TYPING =
	"https://docs.python.org/3.14/library/typing.html#typing.Protocol";
const PYTHONIC_PATTERNS_DATACLASSES =
	"https://docs.python.org/3.14/library/dataclasses.html";
const PYTHONIC_PATTERNS_FUNCTOOLS =
	"https://docs.python.org/3.14/library/functools.html";
const PYTHONIC_PATTERNS_CONTEXTLIB =
	"https://docs.python.org/3.14/library/contextlib.html";
const PYTHONIC_PATTERNS_ENTRY_POINTS =
	"https://docs.python.org/3.14/library/importlib.metadata.html#entry-points";
const PYTHONIC_PATTERNS_WEAKREF =
	"https://docs.python.org/3.14/library/weakref.html#weakref.WeakMethod";
const PYTHONIC_PATTERNS_CONTEXTVARS =
	"https://docs.python.org/3.14/library/contextvars.html";

const PYTHONIC_PATTERNS_FLOW: Record<
	string,
	{
		estimatedTime: string;
		keyBlocks: string[];
		flowNote: string;
	}
> = {
	"PDP0 Setup and Tooling": {
		estimatedTime: "3 sessions · 60–90 minutes each",
		keyBlocks: [
			"Python 3.14 baseline",
			"virtual environment",
			"package layout",
			"unittest discovery",
			"type-checking boundary",
			"green baseline"
		],
		flowNote:
			"Establish one reproducible Python 3.14 package with an isolated environment, repeatable tests, and a green baseline before any structural refactor."
	},
	"PDP1 Why Python Changes the Design-Patterns Conversation": {
		estimatedTime: "4 sessions · 60–90 minutes each",
		keyBlocks: [
			"design pressure",
			"function or value",
			"module boundary",
			"named pattern",
			"simpler counterfactual",
			"removal trigger"
		],
		flowNote:
			"Compare each named pattern with a function, value, callable, protocol, context manager, or module boundary, then keep only the structure earned by a concrete change scenario."
	},
	"PDP2 Design Foundations in Python": {
		estimatedTime: "5 sessions · 60–90 minutes each",
		keyBlocks: [
			"duck typing",
			"Protocol",
			"ABC",
			"dataclass contract",
			"dependency seam",
			"static and runtime checks"
		],
		flowNote:
			"Choose the lightest useful contract, model plain data without mutable-default traps, and isolate side effects behind replaceable collaborators."
	},
	"PDP3 Strategy Without Ceremony": {
		estimatedTime: "4 sessions · 60–90 minutes each",
		keyBlocks: [
			"plain function",
			"callable object",
			"behavior registry",
			"signature contract",
			"unknown selection",
			"stateful strategy"
		],
		flowNote:
			"Implement swappable behavior as functions first, then adopt a callable object or explicit registry only when state, discovery, or lifecycle creates real pressure."
	},
	"PDP4 Factory and Builder in Python": {
		estimatedTime: "5 sessions · 60–90 minutes each",
		keyBlocks: [
			"direct construction",
			"named constructor",
			"factory registry",
			"valid configuration",
			"entry-point plugin",
			"failure contract"
		],
		flowNote:
			"Move from direct construction to named constructors, registries, builders, or package entry points only as validity and extension requirements grow."
	},
	"PDP5 Observer, Events, and Callbacks": {
		estimatedTime: "5 sessions · 60–100 minutes each",
		keyBlocks: [
			"subscription handle",
			"weak bound method",
			"delivery order",
			"reentrancy",
			"sync callback",
			"async task ownership"
		],
		flowNote:
			"Define subscription lifetime and delivery semantics first, then make synchronous and asynchronous failure paths explicit rather than treating callbacks as free decoupling."
	},
	"PDP6 Decorator, Proxy, and Facade": {
		estimatedTime: "5 sessions · 60–100 minutes each",
		keyBlocks: [
			"decorator transparency",
			"metadata preservation",
			"proxy contract",
			"cache invalidation",
			"facade boundary",
			"context-manager lifecycle"
		],
		flowNote:
			"Add cross-cutting behavior without hiding call semantics, preserve wrapped-function contracts, and use context managers for deterministic resource lifecycle."
	},
	"PDP7 State and Command": {
		estimatedTime: "5 sessions · 60–100 minutes each",
		keyBlocks: [
			"legal transition",
			"command input",
			"mutable capture",
			"idempotency",
			"undo scope",
			"history limit"
		],
		flowNote:
			"Package meaningful actions and mode transitions while specifying captured state, retry behavior, undo limits, and bounded history."
	},
	"PDP8 Adapter and Integration Boundaries": {
		estimatedTime: "5 sessions · 60–100 minutes each",
		keyBlocks: [
			"external schema",
			"internal model",
			"version mapping",
			"missing field",
			"error translation",
			"round-trip fixture"
		],
		flowNote:
			"Translate versioned external shapes into one stable internal model, keep vendor exceptions at the edge, and prove the mapping with explicit fixtures."
	},
	"PDP9 Template Method versus Higher-Order Functions": {
		estimatedTime: "4 sessions · 60–90 minutes each",
		keyBlocks: [
			"algorithm skeleton",
			"hook method",
			"callable pipeline",
			"generator pipeline",
			"cleanup",
			"extension pressure"
		],
		flowNote:
			"Compare inheritance hooks with composed callables and generators, preserving visible control flow and deterministic cleanup."
	},
	"PDP10 Singleton, Global State, and Module Patterns": {
		estimatedTime: "4 sessions · 60–90 minutes each",
		keyBlocks: [
			"module cache",
			"application factory",
			"composition root",
			"context-local state",
			"test reset",
			"shutdown lifecycle"
		],
		flowNote:
			"Replace ambient module state with explicit application wiring or context-local state unless a documented process-wide lifecycle genuinely requires sharing."
	},
	"PDP11 Refactoring Python Code Smells": {
		estimatedTime: "6 sessions · 60–100 minutes each",
		keyBlocks: [
			"characterization test",
			"side-effect seam",
			"one-step refactor",
			"behavior-change boundary",
			"stop condition",
			"rollback point"
		],
		flowNote:
			"Protect observable behavior, isolate side effects, and remove one smell at a time through reviewable commits that can be reverted independently."
	},
	"PDP12 Capstone Pythonic Refactor Studio": {
		estimatedTime: "8–10 sessions · 60–120 minutes each",
		keyBlocks: [
			"green baseline",
			"dependency map",
			"change scenarios",
			"pattern decisions",
			"before-and-after evidence",
			"rollback packet"
		],
		flowNote:
			"Refactor one salvageable Python application from a protected baseline, choose a deliberately small pattern set, and demonstrate that target changes became safer or simpler."
	}
};

function pythonicPatternsOptionPath(title: string) {
	return /extension|capstone|challenge/i.test(title)
		? ("challenge" as const)
		: ("choice" as const);
}

function insertPythonicPatternsItem(
	items: RawCourseModuleItem[],
	beforeTitle: string,
	item: RawCourseModuleItem
) {
	const index = items.findIndex(candidate => candidate.title === beforeTitle);
	if (index === -1) return [...items, item];
	return [...items.slice(0, index), item, ...items.slice(index)];
}

function priorPracticeTitle(moduleTitle: string, itemTitle: string) {
	const moduleMatch = /^PDP(\d{1,2}) /.exec(moduleTitle);
	if (!moduleMatch) return null;
	const moduleNumber = Number(moduleMatch[1]);
	if (moduleNumber < 1 || moduleNumber > 12) return null;
	const moduleTopic = moduleTitle.slice(moduleMatch[0].length);
	const practice = itemTitle.endsWith("Transfer Practice")
		? "Transfer Practice"
		: itemTitle.endsWith("Extension Practice")
			? "Extension Practice"
			: null;
	if (!practice) return null;
	return `${practice}: ${moduleTopic.replace(/^Template /, "")}`;
}

function decoratePythonicPatternsModule(
	module: RawCourse["modules"][number]
): RawCourse["modules"][number] {
	const flow = PYTHONIC_PATTERNS_FLOW[module.title];
	let curriculum: RawCourseModuleItem[] = module.curriculum.map(item => ({
		...item,
		learningPath: "core" as const
	}));
	const coreProjectTitle = curriculum.at(-1)?.title ?? "";

	if (module.title === "PDP0 Setup and Tooling") {
		curriculum = insertPythonicPatternsItem(curriculum, coreProjectTitle, {
			title: "Python 3.14 Build, Test, and Type Contract",
			content: [
				"**Prerequisite:** Enter after functions, classes, decorators, exceptions, packages, comprehensions, generators, context managers, and basic type hints are independently usable.",
				"**Runtime baseline:** Pin Python 3.14 for the course workspace, create `.venv`, install only declared project requirements, and record `python --version` plus the command that runs the package.",
				"**Verification:** Discover tests with `python -m unittest discover -s tests`, compile the package with `python -m compileall`, and run the configured static type checker over public boundaries.",
				"**Delivery:** Commit the green unedited baseline separately from every later refactor so structural changes remain reviewable and reversible."
			].join("\n"),
			projectLink: PYTHONIC_PATTERNS_UNITTEST,
			learningPath: "core"
		});
	}

	if (
		module.title ===
		"PDP1 Why Python Changes the Design-Patterns Conversation"
	) {
		curriculum = insertPythonicPatternsItem(curriculum, coreProjectTitle, {
			title: "Python Feature Ladder before Pattern Machinery",
			content: [
				"Try a value or `dataclass`, a pure function, a closure, a callable object, a dictionary registry, a `Protocol`, a context manager, and a module boundary before adding a classic class family.",
				"",
				"Stop at the first form that keeps state, lifecycle, extension, and testing explicit. Dynamic syntax can remove ceremony, but it does not remove the need for a stable contract."
			].join("\n"),
			projectLink: PYTHONIC_PATTERNS_TYPING,
			learningPath: "core"
		});
		curriculum = insertPythonicPatternsItem(curriculum, coreProjectTitle, {
			title: "Pattern Decision Record and Removal Trigger",
			content: [
				"Record one realistic future change, current duplication or coupling, the simplest Python alternative, the selected pattern, added indirection, test cost, and evidence that earns the extra structure.",
				"",
				"Include a removal trigger and sketch the simpler counterfactual. Pattern fluency means keeping the smallest design that supports the change, not maximizing pattern names."
			].join("\n"),
			projectLink: PYTHONIC_PATTERNS_UNITTEST,
			learningPath: "core"
		});
	}

	if (module.title === "PDP2 Design Foundations in Python") {
		curriculum = insertPythonicPatternsItem(curriculum, coreProjectTitle, {
			title: "Protocol, ABC, and Runtime-Validation Contract",
			content: [
				"Use duck typing for a local obvious capability, `Protocol` for static structural contracts across boundaries, and an ABC when shared implementation or runtime registration is part of the design.",
				"",
				"Annotations are not runtime enforcement. A `runtime_checkable` protocol verifies only attribute presence, not complete signatures or value types, so external input still needs explicit validation. Test one conforming fake and one malformed runtime value."
			].join("\n"),
			projectLink: PYTHONIC_PATTERNS_TYPING,
			learningPath: "core"
		});
		curriculum = insertPythonicPatternsItem(curriculum, coreProjectTitle, {
			title: "Data-Class Mutability and Boundary Contract",
			content: [
				"Define whether each record is mutable, hashable, comparable, or frozen. Use `default_factory` for mutable fields, validate invariants at construction, and avoid `unsafe_hash` unless mutation cannot invalidate keyed collections.",
				"",
				"Keep transport dictionaries at integration edges and convert them into named internal values. A data class carries data transparently; behavior moves onto it only when that behavior protects the record's own invariant."
			].join("\n"),
			projectLink: PYTHONIC_PATTERNS_DATACLASSES,
			learningPath: "core"
		});
	}

	if (module.title === "PDP3 Strategy Without Ceremony") {
		curriculum = insertPythonicPatternsItem(curriculum, coreProjectTitle, {
			title: "Callable Signature, Registry, and State Contract",
			content: [
				"Give every strategy one typed callable signature and the same success, edge, and failure examples. A registry rejects duplicate keys, handles unknown names explicitly, and never relies on import order for correctness.",
				"",
				"Use a callable object only when configuration, history, caching, or lifecycle is visible state. Test that state across repeated calls and keep selection separate from execution."
			].join("\n"),
			projectLink: PYTHONIC_PATTERNS_TYPING,
			learningPath: "core"
		});
	}

	if (module.title === "PDP4 Factory and Builder in Python") {
		curriculum = insertPythonicPatternsItem(curriculum, coreProjectTitle, {
			title: "Construction Validity and Factory Failure Contract",
			content: [
				"Use direct construction or a named class method for one concrete type, a registry-backed factory for runtime selection, and a builder only when staged configuration protects validity or readability.",
				"",
				"Test missing and unknown configuration, incompatible options, plugin construction failure, and whether defaults are copied rather than shared. Never publish a partially valid object."
			].join("\n"),
			projectLink: PYTHONIC_PATTERNS_DATACLASSES,
			learningPath: "core"
		});
		curriculum = insertPythonicPatternsItem(curriculum, coreProjectTitle, {
			title: "Package Entry-Point Plugin Boundary",
			content: [
				"Expose one narrow protocol in the core package and discover optional third-party providers through `importlib.metadata.entry_points()` rather than importing every implementation directly.",
				"",
				"Handle zero, one, multiple, duplicate, and broken providers; load lazily; keep provider exceptions at the composition boundary; and test discovery from metadata without making import side effects the registration mechanism."
			].join("\n"),
			projectLink: PYTHONIC_PATTERNS_ENTRY_POINTS,
			learningPath: "core"
		});
	}

	if (module.title === "PDP5 Observer, Events, and Callbacks") {
		curriculum = insertPythonicPatternsItem(curriculum, coreProjectTitle, {
			title: "Subscription Lifetime, Reentrancy, and Weak-Method Contract",
			content: [
				"Return an idempotent subscription handle or context manager that disconnects explicitly. Bound-method listeners either unsubscribe before their owner dies or use `weakref.WeakMethod`; plain weak references do not retain a temporary bound-method object correctly.",
				"",
				"Test duplicate registration, removal during publication, nested publication, a listener added mid-delivery, dead listeners, ordering, and one listener that raises. Define whether publication stops, aggregates errors, or isolates failures."
			].join("\n"),
			projectLink: PYTHONIC_PATTERNS_WEAKREF,
			learningPath: "core"
		});
		curriculum = insertPythonicPatternsItem(curriculum, coreProjectTitle, {
			title: "Synchronous versus Asynchronous Delivery Contract",
			content: [
				"A synchronous publisher completes listeners before returning and exposes failures in the caller's stack. An asynchronous publisher owns every created task, awaits or supervises completion, and defines ordering, cancellation, backpressure, and shutdown.",
				"",
				"Never discard a coroutine or create an unobserved background task as an Observer shortcut. Test cancellation and listener failure with the event loop under project control."
			].join("\n"),
			projectLink:
				"https://docs.python.org/3.14/library/asyncio-task.html",
			learningPath: "core"
		});
	}

	if (module.title === "PDP6 Decorator, Proxy, and Facade") {
		curriculum = insertPythonicPatternsItem(curriculum, coreProjectTitle, {
			title: "Decorator Transparency and Proxy State Contract",
			content: [
				"Use `functools.wraps` or `update_wrapper` so names, documentation, annotations, and `__wrapped__` remain inspectable. Preserve positional and keyword behavior, return values, exceptions, sync versus async behavior, and generator semantics.",
				"",
				"For caching, authorization, retry, or lazy proxies, define cache keys, invalidation, concurrency, exception caching, and observable identity. Test stacked decorator order and bypass the wrapper through `__wrapped__` when isolating the core behavior."
			].join("\n"),
			projectLink: PYTHONIC_PATTERNS_FUNCTOOLS,
			learningPath: "core"
		});
		curriculum = insertPythonicPatternsItem(curriculum, coreProjectTitle, {
			title: "Context Manager and ExitStack Lifecycle Pattern",
			content: [
				"Use a `with` boundary when setup and cleanup must remain paired across success and exceptions. Start with `contextmanager`; use a class when reusable state or richer methods matter, and use `ExitStack` for a data-driven number of resources.",
				"",
				"Test acquisition failure halfway through setup, reverse-order cleanup, exception suppression, repeated use, and nested use. Resource release never depends on garbage collection timing."
			].join("\n"),
			projectLink: PYTHONIC_PATTERNS_CONTEXTLIB,
			learningPath: "core"
		});
	}

	if (module.title === "PDP7 State and Command") {
		curriculum = insertPythonicPatternsItem(curriculum, coreProjectTitle, {
			title: "Command Capture, Retry, and Undo Contract",
			content: [
				"Capture immutable command inputs or make an intentional snapshot; do not close over mutable state whose later value changes the recorded action. Define whether execution is one-shot, idempotent, retryable, cancelable, or compensating.",
				"",
				"Test illegal transitions, failure halfway through execution, undo after later commands, replay in a fresh process when supported, and a bounded history policy. Record which effects cannot be reversed."
			].join("\n"),
			projectLink: PYTHONIC_PATTERNS_DATACLASSES,
			learningPath: "core"
		});
	}

	if (module.title === "PDP8 Adapter and Integration Boundaries") {
		curriculum = insertPythonicPatternsItem(curriculum, coreProjectTitle, {
			title: "Schema Version, Validation, and Error-Mapping Contract",
			content: [
				"Name the supported external versions, required and optional fields, default policy, unknown-field policy, timezone and unit conversions, and the stable internal model before writing the adapter.",
				"",
				"Translate vendor exceptions into domain errors without losing the original cause. Test minimal, complete, malformed, unknown-version, and round-trip fixtures where export exists, and keep raw payloads out of core modules."
			].join("\n"),
			projectLink: PYTHONIC_PATTERNS_TYPING,
			learningPath: "core"
		});
	}

	if (module.title === "PDP9 Template Method versus Higher-Order Functions") {
		curriculum = insertPythonicPatternsItem(curriculum, coreProjectTitle, {
			title: "Callable and Generator Pipeline Contract",
			content: [
				"Express the workflow once as Template Method hooks and once as named callable or generator stages. Keep ordering, short-circuit behavior, error propagation, and data ownership visible in both versions.",
				"",
				"When a generator owns a resource, bind that resource to a surrounding context manager and test early termination, `close()`, exceptions, and partial consumption. Choose the form with the clearest control flow for the expected extension."
			].join("\n"),
			projectLink: PYTHONIC_PATTERNS_CONTEXTLIB,
			learningPath: "core"
		});
	}

	if (module.title === "PDP10 Singleton, Global State, and Module Patterns") {
		curriculum = insertPythonicPatternsItem(curriculum, coreProjectTitle, {
			title: "Application Factory, Import Cache, and Context-Local Contract",
			content: [
				"Create configuration and services in one application factory, pass collaborators explicitly, and expose a deterministic shutdown path. Re-importing a module normally returns cached module state, so tests cannot assume import syntax creates a fresh singleton.",
				"",
				"Use `ContextVar` for task-local request context, not as a service locator. Test token reset, copied contexts, concurrent tasks, test isolation, and teardown of process-wide resources."
			].join("\n"),
			projectLink: PYTHONIC_PATTERNS_CONTEXTVARS,
			learningPath: "core"
		});
	}

	if (module.title === "PDP11 Refactoring Python Code Smells") {
		curriculum = insertPythonicPatternsItem(curriculum, coreProjectTitle, {
			title: "Characterization, Stop, and Rollback Contract",
			content: [
				"Capture return values, output, exceptions, file or network effects, ordering, and one awkward edge before editing. Commit the green baseline, introduce side-effect seams, and apply one named behavior-preserving transformation per commit.",
				"",
				"Stop when a failure is unexplained, a diff mixes behavior with structure, typing becomes less precise, or the step cannot be rolled back independently. A bug fix or feature follows a separately named test and commit."
			].join("\n"),
			projectLink: PYTHONIC_PATTERNS_UNITTEST,
			learningPath: "core"
		});
	}

	if (module.title === "PDP12 Capstone Pythonic Refactor Studio") {
		curriculum = insertPythonicPatternsItem(curriculum, coreProjectTitle, {
			title: "Capstone Gate: Characterize before Change",
			content: [
				"Freeze representative success, failure, and side-effect behavior with tests, deterministic fixtures, a documented run command, a package-dependency map, and one static-type-check result.",
				"",
				"Tag or commit this baseline before structural work. Pattern refactors preserve behavior until a separately reviewed feature, bug fix, or performance change is scheduled."
			].join("\n"),
			projectLink: PYTHONIC_PATTERNS_UNITTEST,
			learningPath: "core"
		});
		curriculum = insertPythonicPatternsItem(curriculum, coreProjectTitle, {
			title: "Capstone Evidence and Rollback Packet",
			content: [
				"Deliver the original and final dependency maps, two realistic change scenarios, pattern decision records, the small commit sequence, green tests, and before-and-after measurements such as modules touched, duplicated branches, test setup, import coupling, or time to add a provider.",
				"",
				"Demonstrate one collaborator or provider replacement, identify one pattern deliberately not used, name one remaining tradeoff, and retain a clear rollback point for every major structural choice."
			].join("\n"),
			projectLink: PYTHONIC_PATTERNS_TYPING,
			learningPath: "core"
		});
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
		supplementalProjects: module.supplementalProjects.map(item => {
			const previousTitle = priorPracticeTitle(module.title, item.title);
			return {
				...item,
				...(previousTitle
					? { aliases: [...(item.aliases ?? []), previousTitle] }
					: {}),
				learningPath: pythonicPatternsOptionPath(item.title)
			};
		})
	};
}

export const pythonicDesignPatternsCourse: RawCourse = {
	...pythonicDesignPatternsSourceCourse,
	modules: pythonicDesignPatternsSourceCourse.modules.map(
		decoratePythonicPatternsModule
	)
};
