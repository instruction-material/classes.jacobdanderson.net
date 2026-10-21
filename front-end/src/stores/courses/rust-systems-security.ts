import type { RawCourse } from "./types";
import { buildProjectGuidance } from "./projectGuidance";
import { buildSupportSectionGuidance } from "./supportSectionGuidance";

const rustSystemsSecuritySourceCourse: RawCourse = {
	name: "Rust Systems Security",
	modules: [
		{
			title: "RSS0 Tooling, Cargo, and Why Rust Exists",
			curriculum: [
				{
					title: "Rustup, Cargo, rustfmt, and Clippy",
					content:
						"Standardize the workflow around `rustup`, `cargo`, `rustfmt`, and `clippy`. Feel that the Rust toolchain is part of the security story because it makes structured feedback, repeatable builds, and static analysis normal."
				},
				{
					title: "The Comparative Framing",
					content:
						"Frame the course around specific low-level bug classes from C and C++: dangling pointers, double frees, unchecked indexing, null-like misuse, error-code drift, and race conditions. Every Rust concept answers what changes about those risks."
				},
				{
					title: "Compiler Guidance as an Engineering Tool",
					content:
						"Visible pattern: The compiler as a collaborator that narrows unsafe states early. The goal is not blind obedience to borrow-checker rules; it is understanding the engineering reason those rules exist."
				},
				{
					title: "Tooling, Cargo, and Why Rust Exists: Verification and Reflection",
					content: buildSupportSectionGuidance({
						courseFamily: "Rust systems security",
						moduleTitle: "Tooling, Cargo, and Why Rust Exists",
						section: "verification"
					})
				},
				{
					title: "RSS0 Tooling, Cargo, and Why Rust Exists: Core Project",
					content: buildProjectGuidance({
						courseFamily: "Rust systems",
						moduleTitle: "RSS0 Tooling, Cargo, and Why Rust Exists",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-01-rss0-tooling-cargo-and-why-rust-exists-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-01-rss0-tooling-cargo-and-why-rust-exists-supplemental-2/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Project: First Cargo Audit CLI",
					content:
						"Set up a small Cargo-based CLI and use it to compare a clean Rust workspace with a fragile manual C/C++ build loop.",
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-01-rss0-tooling-cargo-and-why-rust-exists-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-01-rss0-tooling-cargo-and-why-rust-exists-supplemental-2/solution"
				},
				{
					title: "Tooling, Cargo, and Why Rust Exists Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "Rust systems",
						moduleTitle: "RSS0 Tooling, Cargo, and Why Rust Exists",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-01-rss0-tooling-cargo-and-why-rust-exists-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-01-rss0-tooling-cargo-and-why-rust-exists-supplemental-2/solution"
				},
				{
					title: "Tooling, Cargo, and Why Rust Exists Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "Rust systems",
						moduleTitle: "RSS0 Tooling, Cargo, and Why Rust Exists",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-02-rss0-tooling-cargo-and-why-rust-exists-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-02-rss0-tooling-cargo-and-why-rust-exists-supplemental-3/solution"
				}
			]
		},
		{
			title: "RSS1 Ownership, Moves, and Memory Responsibility",
			curriculum: [
				{
					title: "Single Ownership as a Memory Rule",
					content:
						"Ownership means one clear owner for a resource at a time. Compare it directly to ambiguous cleanup responsibility that leads to double free or use-after-free bugs in C and C++."
				},
				{
					title: "Moves, Copies, and Clone",
					content:
						"Distinguish cheap copy semantics for simple values from ownership-moving semantics for heap-backed data. This distinction is central to understanding why Rust prevents some accidental aliasing patterns."
				},
				{
					title: "Drop Timing and Scope",
					content:
						"Explain how values are cleaned up when they leave scope and why that makes resource lifetime more explicit than in manual-memory designs."
				},
				{
					title: "Ownership, Moves, and Memory Responsibility: Verification and Reflection",
					content: buildSupportSectionGuidance({
						courseFamily: "Rust systems security",
						moduleTitle:
							"Ownership, Moves, and Memory Responsibility",
						section: "verification"
					})
				},
				{
					title: "RSS1 Ownership, Moves, and Memory Responsibility: Core Project",
					content: buildProjectGuidance({
						courseFamily: "Rust systems",
						moduleTitle:
							"RSS1 Ownership, Moves, and Memory Responsibility",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-03-rss1-ownership-moves-and-memory-responsibility-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-03-rss1-ownership-moves-and-memory-responsibility-supplemental-2/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Project: Ownership and Move Tracer",
					content:
						"Build a small CLI that moves strings, vectors, and structs through helper functions to make ownership transfers and necessary clones visible.",
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-03-rss1-ownership-moves-and-memory-responsibility-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-03-rss1-ownership-moves-and-memory-responsibility-supplemental-2/solution"
				},
				{
					title: "Ownership, Moves, and Memory Responsibility Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "Rust systems",
						moduleTitle:
							"RSS1 Ownership, Moves, and Memory Responsibility",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-03-rss1-ownership-moves-and-memory-responsibility-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-03-rss1-ownership-moves-and-memory-responsibility-supplemental-2/solution"
				},
				{
					title: "Ownership, Moves, and Memory Responsibility Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "Rust systems",
						moduleTitle:
							"RSS1 Ownership, Moves, and Memory Responsibility",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-04-rss1-ownership-moves-and-memory-responsibility-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-04-rss1-ownership-moves-and-memory-responsibility-supplemental-3/solution"
				}
			]
		},
		{
			title: "RSS2 Borrowing, Aliasing, and Lifetimes",
			curriculum: [
				{
					title: "Shared vs. Mutable Borrowing",
					content:
						"Rust's borrowing rules limit ambiguous mutation and observation. Connect the rules to aliasing bugs that become hard to reason about in larger C/C++ systems."
				},
				{
					title: "Lifetime Reasoning without Mysticism",
					content:
						"Lifetime thinking starts with scope relationships first and explicit annotations second. The goal is practical reasoning about which reference can safely outlive which value."
				},
				{
					title: "Why Borrow Checking Matters for Security",
					content:
						"Make the security angle explicit: a compiler that rejects dangling references or conflicting mutable access is removing a meaningful class of memory safety hazards before runtime."
				},
				{
					title: "Borrowing, Aliasing, and Lifetimes: Verification and Reflection",
					content: buildSupportSectionGuidance({
						courseFamily: "Rust systems security",
						moduleTitle: "Borrowing, Aliasing, and Lifetimes",
						section: "verification"
					})
				},
				{
					title: "RSS2 Borrowing, Aliasing, and Lifetimes: Core Project",
					content: buildProjectGuidance({
						courseFamily: "Rust systems",
						moduleTitle: "RSS2 Borrowing, Aliasing, and Lifetimes",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-05-rss2-borrowing-aliasing-and-lifetimes-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-05-rss2-borrowing-aliasing-and-lifetimes-supplemental-2/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Project: Borrowing and Aliasing Lab",
					content:
						"Refactor a small parser or buffer-manipulation exercise until it satisfies Rust's borrowing model without cloning away the real ownership story.",
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-05-rss2-borrowing-aliasing-and-lifetimes-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-05-rss2-borrowing-aliasing-and-lifetimes-supplemental-2/solution"
				},
				{
					title: "Borrowing, Aliasing, and Lifetimes Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "Rust systems",
						moduleTitle: "RSS2 Borrowing, Aliasing, and Lifetimes",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-05-rss2-borrowing-aliasing-and-lifetimes-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-05-rss2-borrowing-aliasing-and-lifetimes-supplemental-2/solution"
				},
				{
					title: "Borrowing, Aliasing, and Lifetimes Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "Rust systems",
						moduleTitle: "RSS2 Borrowing, Aliasing, and Lifetimes",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-06-rss2-borrowing-aliasing-and-lifetimes-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-06-rss2-borrowing-aliasing-and-lifetimes-supplemental-3/solution"
				}
			]
		},
		{
			title: "RSS3 Option, Result, and Typed Error Paths",
			curriculum: [
				{
					title: "Option instead of Null-like Conventions",
					content:
						"Use `Option` to replace sentinel returns and nullable conventions. Feel why absence modeled in the type system is safer than absence hidden in documentation or magic values."
				},
				{
					title: "Result, Match, and the Question-Mark Operator",
					content:
						"`Result` is a typed alternative to error-code conventions. Pattern matching and `?` create a disciplined error-propagation style, not just new syntax."
				},
				{
					title: "Error Handling and Security Posture",
					content:
						"Connect Rust's typed failure paths to safer parsing and validation. A system is easier to secure when failure states are explicit and hard to ignore."
				},
				{
					title: "Option, Result, and Typed Error Paths: Verification and Reflection",
					content: buildSupportSectionGuidance({
						courseFamily: "Rust systems security",
						moduleTitle: "Option, Result, and Typed Error Paths",
						section: "verification"
					})
				},
				{
					title: "RSS3 Option, Result, and Typed Error Paths: Core Project",
					content: buildProjectGuidance({
						courseFamily: "Rust systems",
						moduleTitle:
							"RSS3 Option, Result, and Typed Error Paths",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-07-rss3-option-result-and-typed-error-paths-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-07-rss3-option-result-and-typed-error-paths-supplemental-2/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Project: Option and Result Audit Tool",
					content:
						"Build a small input-validation or config-parsing tool that uses `Option`, `Result`, and `?` instead of ad hoc null checks or integer status flags.",
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-07-rss3-option-result-and-typed-error-paths-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-07-rss3-option-result-and-typed-error-paths-supplemental-2/solution"
				},
				{
					title: "Option, Result, and Typed Error Paths Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "Rust systems",
						moduleTitle:
							"RSS3 Option, Result, and Typed Error Paths",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-07-rss3-option-result-and-typed-error-paths-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-07-rss3-option-result-and-typed-error-paths-supplemental-2/solution"
				},
				{
					title: "Option, Result, and Typed Error Paths Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "Rust systems",
						moduleTitle:
							"RSS3 Option, Result, and Typed Error Paths",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-08-rss3-option-result-and-typed-error-paths-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-08-rss3-option-result-and-typed-error-paths-supplemental-3/solution"
				}
			]
		},
		{
			title: "RSS4 Strings, Slices, Collections, and Bounds Safety",
			curriculum: [
				{
					title: "String, str, Vec, and Slice Differences",
					content:
						"Owned strings, borrowed string slices, vectors, arrays, and slices are distinct tools rather than one generic container idea. The important distinction is which operations are cheap views and which allocate or move ownership."
				},
				{
					title: "Indexing, Iteration, and Safer Access Patterns",
					content:
						"Compare unchecked indexing habits from C/C++ with safer iteration and checked access in Rust. This is one of the clearest places where the language meaningfully narrows common memory-safety mistakes."
				},
				{
					title: "Parser-Facing Safety",
					content:
						"Use small parser examples so bounds safety feels like a real systems concern rather than a toy rule."
				},
				{
					title: "Strings, Slices, Collections, and Bounds Safety: Verification and Reflection",
					content: buildSupportSectionGuidance({
						courseFamily: "Rust systems security",
						moduleTitle:
							"Strings, Slices, Collections, and Bounds Safety",
						section: "verification"
					})
				},
				{
					title: "RSS4 Strings, Slices, Collections, and Bounds Safety: Core Project",
					content: buildProjectGuidance({
						courseFamily: "Rust systems",
						moduleTitle:
							"RSS4 Strings, Slices, Collections, and Bounds Safety",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-09-rss4-strings-slices-collections-and-bounds-safety-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-09-rss4-strings-slices-collections-and-bounds-safety-supplemental-2/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Project: Slice and Bounds Workbench",
					content:
						"Implement a byte-buffer or log-slice utility that compares safe slicing patterns with familiar off-by-one and unchecked indexing bugs from low-level work.",
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-09-rss4-strings-slices-collections-and-bounds-safety-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-09-rss4-strings-slices-collections-and-bounds-safety-supplemental-2/solution"
				},
				{
					title: "Strings, Slices, Collections, and Bounds Safety Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "Rust systems",
						moduleTitle:
							"RSS4 Strings, Slices, Collections, and Bounds Safety",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-09-rss4-strings-slices-collections-and-bounds-safety-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-09-rss4-strings-slices-collections-and-bounds-safety-supplemental-2/solution"
				},
				{
					title: "Strings, Slices, Collections, and Bounds Safety Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "Rust systems",
						moduleTitle:
							"RSS4 Strings, Slices, Collections, and Bounds Safety",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-10-rss4-strings-slices-collections-and-bounds-safety-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-10-rss4-strings-slices-collections-and-bounds-safety-supplemental-3/solution"
				}
			]
		},
		{
			title: "RSS5 Structs, Enums, and Safer State Models",
			curriculum: [
				{
					title: "Structs for Explicit Data Modeling",
					content:
						"Use structs to make ownership, state, and transitions visible. Good modeling reduces security bugs because it narrows the number of half-valid states code can represent."
				},
				{
					title: "Enums and Impossible States",
					content:
						"Compare tagged enums and pattern matching to ad hoc integer codes, booleans, or loosely coordinated fields. Rust shines when a type can make impossible states unrepresentable."
				},
				{
					title: "Pattern Matching as Validation",
					content:
						"`match` is more than syntax; it forces complete reasoning across every state the program can inhabit."
				},
				{
					title: "Structs, Enums, and Safer State Models: Verification and Reflection",
					content: buildSupportSectionGuidance({
						courseFamily: "Rust systems security",
						moduleTitle: "Structs, Enums, and Safer State Models",
						section: "verification"
					})
				},
				{
					title: "RSS5 Structs, Enums, and Safer State Models: Core Project",
					content: buildProjectGuidance({
						courseFamily: "Rust systems",
						moduleTitle:
							"RSS5 Structs, Enums, and Safer State Models",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-11-rss5-structs-enums-and-safer-state-models-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-11-rss5-structs-enums-and-safer-state-models-supplemental-2/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Project: State Machine Refactor",
					content:
						"Convert a fragile status-code workflow into structs and enums so the compiler helps enforce legal transitions.",
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-11-rss5-structs-enums-and-safer-state-models-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-11-rss5-structs-enums-and-safer-state-models-supplemental-2/solution"
				},
				{
					title: "Structs, Enums, and Safer State Models Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "Rust systems",
						moduleTitle:
							"RSS5 Structs, Enums, and Safer State Models",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-11-rss5-structs-enums-and-safer-state-models-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-11-rss5-structs-enums-and-safer-state-models-supplemental-2/solution"
				},
				{
					title: "Structs, Enums, and Safer State Models Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "Rust systems",
						moduleTitle:
							"RSS5 Structs, Enums, and Safer State Models",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-12-rss5-structs-enums-and-safer-state-models-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-12-rss5-structs-enums-and-safer-state-models-supplemental-3/solution"
				}
			]
		},
		{
			title: "RSS6 Traits, Iterators, and API Contracts",
			curriculum: [
				{
					title: "Traits as Behavior Contracts",
					content:
						"Traits are explicit contracts for reusable behavior. Compare them with interfaces, abstract classes, or virtual methods without losing the Rust-specific emphasis on disciplined composition."
				},
				{
					title: "Iterator Safety vs. Invalidation Risk",
					content:
						"Use iterators and collection transforms to explain why Rust makes it harder to mutate collections in unsafe ways while traversing them."
				},
				{
					title: "Secure API Boundaries",
					content:
						"Good trait and iterator design can reduce misuse by forcing callers into safer shapes. This matters for security-sensitive code because APIs are part of the attack surface."
				},
				{
					title: "Traits, Iterators, and API Contracts: Verification and Reflection",
					content: buildSupportSectionGuidance({
						courseFamily: "Rust systems security",
						moduleTitle: "Traits, Iterators, and API Contracts",
						section: "verification"
					})
				},
				{
					title: "RSS6 Traits, Iterators, and API Contracts: Core Project",
					content: buildProjectGuidance({
						courseFamily: "Rust systems",
						moduleTitle:
							"RSS6 Traits, Iterators, and API Contracts",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-13-rss6-traits-iterators-and-api-contracts-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-13-rss6-traits-iterators-and-api-contracts-supplemental-2/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Project: Trait-Based Validation Pipeline",
					content:
						"Build a multi-step validation pipeline with traits and iterator-based transforms so the work can compare clean contracts with ad hoc callback spaghetti.",
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-13-rss6-traits-iterators-and-api-contracts-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-13-rss6-traits-iterators-and-api-contracts-supplemental-2/solution"
				},
				{
					title: "Traits, Iterators, and API Contracts Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "Rust systems",
						moduleTitle:
							"RSS6 Traits, Iterators, and API Contracts",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-13-rss6-traits-iterators-and-api-contracts-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-13-rss6-traits-iterators-and-api-contracts-supplemental-2/solution"
				},
				{
					title: "Traits, Iterators, and API Contracts Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "Rust systems",
						moduleTitle:
							"RSS6 Traits, Iterators, and API Contracts",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-14-rss6-traits-iterators-and-api-contracts-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-14-rss6-traits-iterators-and-api-contracts-supplemental-3/solution"
				}
			]
		},
		{
			title: "RSS7 Files, Parsers, and Secure CLI Design",
			curriculum: [
				{
					title: "File I/O and Parser Discipline",
					content:
						"Parsing is a systems task where small unchecked assumptions cause real bugs. Rust's file APIs and typed error model support safer parse-and-validate workflows."
				},
				{
					title: "Input Validation and Trust Boundaries",
					content:
						"Make untrusted input a first-class theme. Identify where the CLI receives external data and what validation or normalization happens before it is trusted."
				},
				{
					title: "Security Logging and Failure Visibility",
					content:
						"Structured errors and explicit validation failures make later debugging and auditing easier."
				},
				{
					title: "Files, Parsers, and Secure CLI Design: Verification and Reflection",
					content: buildSupportSectionGuidance({
						courseFamily: "Rust systems security",
						moduleTitle: "Files, Parsers, and Secure CLI Design",
						section: "verification"
					})
				},
				{
					title: "RSS7 Files, Parsers, and Secure CLI Design: Core Project",
					content: buildProjectGuidance({
						courseFamily: "Rust systems",
						moduleTitle:
							"RSS7 Files, Parsers, and Secure CLI Design",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-15-rss7-files-parsers-and-secure-cli-design-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-15-rss7-files-parsers-and-secure-cli-design-supplemental-2/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Project: Secure CLI Audit Tool",
					content:
						"Build a small CLI that parses a log or config file, validates each record, and reports trustworthy failures instead of crashing or silently accepting malformed input.",
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-15-rss7-files-parsers-and-secure-cli-design-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-15-rss7-files-parsers-and-secure-cli-design-supplemental-2/solution"
				},
				{
					title: "Files, Parsers, and Secure CLI Design Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "Rust systems",
						moduleTitle:
							"RSS7 Files, Parsers, and Secure CLI Design",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-15-rss7-files-parsers-and-secure-cli-design-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-15-rss7-files-parsers-and-secure-cli-design-supplemental-2/solution"
				},
				{
					title: "Files, Parsers, and Secure CLI Design Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "Rust systems",
						moduleTitle:
							"RSS7 Files, Parsers, and Secure CLI Design",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-16-rss7-files-parsers-and-secure-cli-design-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-16-rss7-files-parsers-and-secure-cli-design-supplemental-3/solution"
				}
			]
		},
		{
			title: "RSS8 Concurrency and Race Reduction",
			curriculum: [
				{
					title: "Threads, Channels, and Shared State",
					content:
						"Rust concurrency uses the same comparative posture as earlier units. Visible pattern: Where Rust's ownership and trait rules make it harder to create unsafe shared-state patterns."
				},
				{
					title: "Data Races vs. Logic Races",
					content:
						"Be honest about the boundary: Rust removes many memory-safety race problems, but it does not eliminate higher-level logic races or bad protocol design."
				},
				{
					title: "Choosing Channels or Shared Structures",
					content:
						"Compare message-passing and shared-state approaches to make concurrency design tradeoffs explicit instead of applying concurrency tools blindly."
				},
				{
					title: "Concurrency and Race Reduction: Verification and Reflection",
					content: buildSupportSectionGuidance({
						courseFamily: "Rust systems security",
						moduleTitle: "Concurrency and Race Reduction",
						section: "verification"
					})
				},
				{
					title: "RSS8 Concurrency and Race Reduction: Core Project",
					content: buildProjectGuidance({
						courseFamily: "Rust systems",
						moduleTitle: "RSS8 Concurrency and Race Reduction",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-17-rss8-concurrency-and-race-reduction-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-17-rss8-concurrency-and-race-reduction-supplemental-2/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Project: Threads and Channels Monitor",
					content:
						"Build a small concurrent monitor that compares message passing with shared mutable state and highlights how Rust narrows unsafe race patterns.",
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-17-rss8-concurrency-and-race-reduction-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-17-rss8-concurrency-and-race-reduction-supplemental-2/solution"
				},
				{
					title: "Concurrency and Race Reduction Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "Rust systems",
						moduleTitle: "RSS8 Concurrency and Race Reduction",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-17-rss8-concurrency-and-race-reduction-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-17-rss8-concurrency-and-race-reduction-supplemental-2/solution"
				},
				{
					title: "Concurrency and Race Reduction Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "Rust systems",
						moduleTitle: "RSS8 Concurrency and Race Reduction",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-18-rss8-concurrency-and-race-reduction-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-18-rss8-concurrency-and-race-reduction-supplemental-3/solution"
				}
			]
		},
		{
			title: "RSS9 Unsafe, FFI, and Trusted Boundaries",
			curriculum: [
				{
					title: "What Unsafe Actually Means",
					content:
						"`unsafe` is a narrow escape hatch, not a forbidden magic zone. The key question is which guarantees the compiler stops checking and why that creates a smaller trusted computing boundary that must be justified carefully."
				},
				{
					title: "FFI as a Real-World Boundary",
					content:
						"Use FFI examples to show where Rust still depends on external correctness and where unsafety can re-enter the system through other languages or libraries."
				},
				{
					title: "Auditing Unsafe Blocks",
					content:
						"Include comments and reasoning around every unsafe block so each one is treated as an audit target."
				},
				{
					title: "Unsafe, FFI, and Trusted Boundaries: Verification and Reflection",
					content: buildSupportSectionGuidance({
						courseFamily: "Rust systems security",
						moduleTitle: "Unsafe, FFI, and Trusted Boundaries",
						section: "verification"
					})
				},
				{
					title: "RSS9 Unsafe, FFI, and Trusted Boundaries: Core Project",
					content: buildProjectGuidance({
						courseFamily: "Rust systems",
						moduleTitle: "RSS9 Unsafe, FFI, and Trusted Boundaries",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-19-rss9-unsafe-ffi-and-trusted-boundaries-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-19-rss9-unsafe-ffi-and-trusted-boundaries-supplemental-2/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Project: Unsafe and FFI Boundary Review",
					content:
						"Wrap a tiny unsafe or FFI-facing boundary with documented invariants to narrow and audit trust assumptions.",
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-19-rss9-unsafe-ffi-and-trusted-boundaries-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-19-rss9-unsafe-ffi-and-trusted-boundaries-supplemental-2/solution"
				},
				{
					title: "Unsafe, FFI, and Trusted Boundaries Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "Rust systems",
						moduleTitle: "RSS9 Unsafe, FFI, and Trusted Boundaries",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-19-rss9-unsafe-ffi-and-trusted-boundaries-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-19-rss9-unsafe-ffi-and-trusted-boundaries-supplemental-2/solution"
				},
				{
					title: "Unsafe, FFI, and Trusted Boundaries Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "Rust systems",
						moduleTitle: "RSS9 Unsafe, FFI, and Trusted Boundaries",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-20-rss9-unsafe-ffi-and-trusted-boundaries-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-20-rss9-unsafe-ffi-and-trusted-boundaries-supplemental-3/solution"
				}
			]
		},
		{
			title: "RSS10 Capstone: Harden a Legacy Tool",
			curriculum: [
				{
					title: "Port or Harden with a Clear Threat Model",
					content:
						"Choose a small legacy C or C++-style tool and define what can go wrong: parsing bugs, unchecked buffers, confusing state, weak error handling, or brittle ownership. The capstone explicitly compares the old design with the Rust rewrite or hardening pass."
				},
				{
					title: "Document What Rust Improved and What It Did Not",
					content:
						"The final reflection stays technically honest. Rust meaningfully reduces memory-safety and API-misuse risk in many cases, but logic flaws, insecure protocol assumptions, and weak threat models can still survive the port."
				},
				{
					title: "Prepare for Systems, Security, or Compiler Follow-On Work",
					content:
						"Close by positioning the course as a launch point for deeper systems, networking, low-level security, or language tooling work with a sharper mental model of safe systems design."
				},
				{
					title: "Capstone: Harden a Legacy Tool: Verification and Reflection",
					content: buildSupportSectionGuidance({
						courseFamily: "Rust systems security",
						moduleTitle: "Capstone: Harden a Legacy Tool",
						section: "verification"
					})
				},
				{
					title: "RSS10 Capstone: Harden a Legacy Tool: Core Project",
					content: buildProjectGuidance({
						courseFamily: "Rust systems",
						moduleTitle: "RSS10 Capstone: Harden a Legacy Tool",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-21-rss10-capstone-harden-a-legacy-tool-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-21-rss10-capstone-harden-a-legacy-tool-supplemental-2/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Project: Harden a Legacy Tool",
					content:
						"Complete a larger audit-and-port capstone that documents the old bug classes, the Rust redesign, the remaining risks, and the final testing evidence.",
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-21-rss10-capstone-harden-a-legacy-tool-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-21-rss10-capstone-harden-a-legacy-tool-supplemental-2/solution"
				},
				{
					title: "Capstone: Harden a Legacy Tool Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "Rust systems",
						moduleTitle: "RSS10 Capstone: Harden a Legacy Tool",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-21-rss10-capstone-harden-a-legacy-tool-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-21-rss10-capstone-harden-a-legacy-tool-supplemental-2/solution"
				},
				{
					title: "Capstone: Harden a Legacy Tool Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "Rust systems",
						moduleTitle: "RSS10 Capstone: Harden a Legacy Tool",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-22-rss10-capstone-harden-a-legacy-tool-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Low-Level-Security/tree/main/RUST-22-rss10-capstone-harden-a-legacy-tool-supplemental-3/solution"
				}
			]
		}
	]
};

interface RustSystemsModuleFlow {
	stage: string;
	estimatedTime: string;
	keyBlocks: string[];
	practiceSection: string;
	answerSection: string;
	route: string;
	safeRoute: string;
	evidence: string;
	primaryReference: {
		label: string;
		url: string;
	};
	additionalReferences?: Array<{
		label: string;
		url: string;
	}>;
}

const RUST_SYSTEMS_PRACTICE_PACK =
	"/course-assets/rust-systems-security/rust-systems-security-practice-pack.md";
const RUST_SYSTEMS_VERIFICATION_GUIDE =
	"/course-assets/rust-systems-security/rust-systems-security-verification-guide.md";

const RUST_SYSTEMS_MODULE_FLOW: Record<string, RustSystemsModuleFlow> = {
	"RSS0 Tooling, Cargo, and Why Rust Exists": {
		stage: "Reproducible Rust baseline",
		estimatedTime: "2–3 sessions · 45–60 minutes each",
		keyBlocks: [
			"Rust 1.97.1",
			"Edition 2024",
			"Cargo lock",
			"format",
			"Clippy",
			"tests"
		],
		practiceSection: "toolchain-baseline-and-build-evidence-case",
		answerSection: "toolchain-baseline-and-build-evidence-key",
		route: "Create or migrate a tiny Rust 2024 workspace, record `rustc -Vv` and `cargo -V`, inspect the manifest and lock state, then run format, Clippy, tests, and the program from a clean terminal. Compare each tool's evidence with the C or C++ bug class it does and does not address.",
		safeRoute:
			"Use the supplied build transcript when Rust installation, a network-backed advisory refresh, or a new dependency is unavailable. RSS0–RSS10 use pinned Rust 2024 Cargo workspaces. Record each manifest and lock before comparing build evidence.",
		evidence:
			"The baseline records Rust 1.97.1 stable, Cargo, Rust 2024 edition for course-authored work, lock behavior, exact checks, observed output, one compiler diagnostic explained in plain language, and the security limit of every tool.",
		primaryReference: {
			label: "Rust 1.97.1 release",
			url: "https://blog.rust-lang.org/2026/07/16/Rust-1.97.1/"
		},
		additionalReferences: [
			{
				label: "Rust 2024 Edition Guide",
				url: "https://doc.rust-lang.org/edition-guide/editions/creating-a-new-project.html"
			},
			{
				label: "RustSec tooling",
				url: "https://rustsec.org/"
			}
		]
	},
	"RSS1 Ownership, Moves, and Memory Responsibility": {
		stage: "Assign resource responsibility",
		estimatedTime: "4 sessions · 45–60 minutes each",
		keyBlocks: ["owner", "move", "copy", "clone", "scope", "drop"],
		practiceSection: "ownership-resource-ledger-case",
		answerSection: "ownership-resource-ledger-key",
		route: "Trace strings, vectors, file-like handles, and composite records through construction, move, borrow, return, and drop. Predict which binding remains usable before compiling, then redesign ambiguous cleanup responsibility without cloning every value.",
		safeRoute:
			"Use inert labels and in-memory records only. No operating-system resource, real file, network handle, credential, or production object is needed; the supplied ledger provides the same ownership reasoning without code execution.",
		evidence:
			"The ownership table names the resource, current owner, transfer point, permitted borrow, final use, drop point, compiler result, and the narrow reason a clone or copy is valid when one remains.",
		primaryReference: {
			label: "Rust Book ownership chapter",
			url: "https://doc.rust-lang.org/book/ch04-01-what-is-ownership.html"
		}
	},
	"RSS2 Borrowing, Aliasing, and Lifetimes": {
		stage: "Make aliasing and lifetime claims explicit",
		estimatedTime: "4–5 sessions · 45–60 minutes each",
		keyBlocks: [
			"shared borrow",
			"mutable borrow",
			"aliasing",
			"scope",
			"lifetime",
			"minimal clone"
		],
		practiceSection: "borrowing-aliasing-refactor-case",
		answerSection: "borrowing-aliasing-refactor-key",
		route: "Refactor a small record normalizer so read-only observation, exclusive mutation, returned references, and owned results have deliberate signatures. Draw the referent and reference scopes first, then let compiler diagnostics test the prediction.",
		safeRoute:
			"Keep the exercise in one local module over supplied strings and slices. Do not bypass the borrow checker with raw pointers, interior mutability, leaked values, or broad cloning; the supplied diagnostic trace supports a no-compiler route.",
		evidence:
			"The refactor preserves behavior, removes the conflicting borrow, explains why each reference remains valid, identifies the smallest owned boundary, and distinguishes a lifetime relationship from an annotation added merely to silence a diagnostic.",
		primaryReference: {
			label: "Rust Book references and borrowing chapter",
			url: "https://doc.rust-lang.org/book/ch04-02-references-and-borrowing.html"
		}
	},
	"RSS3 Option, Result, and Typed Error Paths": {
		stage: "Represent absence and failure in types",
		estimatedTime: "4–5 sessions · 45–60 minutes each",
		keyBlocks: [
			"Option",
			"Result",
			"error enum",
			"match",
			"question mark",
			"public error"
		],
		practiceSection: "typed-error-parser-case",
		answerSection: "typed-error-parser-key",
		route: "Convert sentinel values, unchecked indexing, panic paths, and vague strings in a label parser into `Option`, a small error enum, deliberate `match` branches, and `?` propagation. Keep internal context while returning a stable caller-facing error.",
		safeRoute:
			"Parse only the bounded supplied text fixtures. Avoid real paths, secrets, logs, protocol payloads, `unwrap`, `expect`, process termination inside library logic, or error text that repeats untrusted input.",
		evidence:
			"Tests cover valid input, absence, malformed structure, unknown kind, boundary length, trailing data, and safe display text; every variant has one caller action and no malformed case panics.",
		primaryReference: {
			label: "Rust Book recoverable errors chapter",
			url: "https://doc.rust-lang.org/book/ch09-02-recoverable-errors-with-result.html"
		}
	},
	"RSS4 Strings, Slices, Collections, and Bounds Safety": {
		stage: "Bound every collection operation",
		estimatedTime: "5 sessions · 45–60 minutes each",
		keyBlocks: [
			"bytes",
			"UTF-8",
			"slice",
			"get",
			"checked arithmetic",
			"capacity"
		],
		practiceSection: "bounds-safe-collections-case",
		answerSection: "bounds-safe-collections-key",
		route: "Process a bounded byte record and UTF-8 label without confusing byte offsets with character positions. Replace arithmetic, capacity, indexing, and slicing assumptions with explicit limits, checked operations, `get`, and typed errors.",
		safeRoute:
			"Use the supplied short byte arrays and strings with fixed input and output caps. No large allocation, arbitrary file, compressed input, recursive expansion, lossy secret-bearing error, or unsafe unchecked access belongs in the exercise.",
		evidence:
			"Boundary tests include empty, exact minimum, exact maximum, one beyond maximum, truncated header, inconsistent length, non-ASCII text, arithmetic overflow, and output-cap behavior with no panic or unbounded allocation.",
		primaryReference: {
			label: "Rust slice documentation",
			url: "https://doc.rust-lang.org/std/primitive.slice.html"
		}
	},
	"RSS5 Structs, Enums, and Safer State Models": {
		stage: "Encode valid state transitions",
		estimatedTime: "4–5 sessions · 45–60 minutes each",
		keyBlocks: [
			"struct",
			"enum",
			"constructor",
			"transition",
			"exhaustive match",
			"invariant"
		],
		practiceSection: "state-machine-enum-case",
		answerSection: "state-machine-enum-key",
		route: "Replace loosely related booleans and optional fields with an enum-backed job state. Give every transition a typed input, valid next state, explicit error, and audit event so contradictory combinations cannot be constructed through the public API.",
		safeRoute:
			"Use a fictional in-memory import job and deterministic event list. Do not add a database, thread, network call, timestamp dependency, real filename, user identity, or hidden state mutation.",
		evidence:
			"The transition table covers every state and event, rejects illegal transitions without partial mutation, keeps private fields behind constructors, and proves that the old contradictory states are unrepresentable through safe callers.",
		primaryReference: {
			label: "Rust Book enums and pattern matching chapter",
			url: "https://doc.rust-lang.org/book/ch06-00-enums.html"
		}
	},
	"RSS6 Traits, Iterators, and API Contracts": {
		stage: "Design a narrow reviewable API",
		estimatedTime: "4–5 sessions · 45–60 minutes each",
		keyBlocks: [
			"trait",
			"generic bound",
			"iterator",
			"ownership contract",
			"error contract",
			"test double"
		],
		practiceSection: "trait-api-contract-case",
		answerSection: "trait-api-contract-key",
		route: "Extract the smallest trait needed by a record-audit pipeline, choose borrowed or owned inputs deliberately, compose iterator adapters without hiding fallible work, and test the caller contract with a deterministic in-memory implementation.",
		safeRoute:
			"Keep the trait local and data-only. Avoid dynamic plugin loading, object-safe complexity without a consumer, network clients, filesystem adapters, global registries, or public API promises beyond the supplied case.",
		evidence:
			"The API review states required behavior, ownership and lifetime expectations, failure semantics, ordering, side effects, complexity assumption, extension point, and a test proving that an alternate implementation needs no privileged access.",
		primaryReference: {
			label: "Rust API Guidelines",
			url: "https://rust-lang.github.io/api-guidelines/"
		}
	},
	"RSS7 Files, Parsers, and Secure CLI Design": {
		stage: "Build a bounded local parser and CLI",
		estimatedTime: "6 sessions · 45–60 minutes each",
		keyBlocks: [
			"argument contract",
			"read limit",
			"parser",
			"path boundary",
			"exit status",
			"diagnostic"
		],
		practiceSection: "secure-cli-parser-case",
		answerSection: "secure-cli-parser-key",
		route: "Separate CLI argument handling, bounded input acquisition, pure parsing, validation, domain work, display, and exit status. Read the supplied fixture through an explicit size cap, reject malformed records without panic, and keep diagnostics useful without echoing whole inputs.",
		safeRoute:
			"Use only the supplied fixture directory or an in-memory byte source. Do not recurse, follow unreviewed links, overwrite input, execute child processes, accept a URL, parse a real secret-bearing file, or fuzz outside a fixed corpus and budget.",
		evidence:
			"The CLI tests prove help and usage behavior, missing and extra arguments, missing file, exact size cap, one-over cap, malformed record, valid output, stable exit codes, no partial output, and privacy-safe diagnostics.",
		primaryReference: {
			label: "Command Line Applications in Rust",
			url: "https://rust-cli.github.io/book/index.html"
		}
	},
	"RSS8 Concurrency and Race Reduction": {
		stage: "Preserve invariants across threads",
		estimatedTime: "5–6 sessions · 45–60 minutes each",
		keyBlocks: [
			"Send",
			"Sync",
			"channel",
			"mutex",
			"atomicity",
			"shutdown"
		],
		practiceSection: "concurrency-invariant-case",
		answerSection: "concurrency-invariant-key",
		route: "Implement a small fixed-work queue with owned messages or one narrow shared state, then reason about sendability, synchronization, compound invariants, error propagation, completion, cancellation, and clean shutdown. Distinguish memory safety from ordering and business-logic correctness.",
		safeRoute:
			"Use a fixed item count, thread count, queue size, timeout, and deterministic test seam. No sockets, daemon threads, unbounded producer, sleep-based correctness claim, shared process environment mutation, or production workload is needed.",
		evidence:
			"Tests account for every item exactly once, preserve the declared aggregate invariant, propagate worker failure, close all channels, join every thread, terminate within the budget, and document deadlock, starvation, ordering, and logic risks Rust does not erase.",
		primaryReference: {
			label: "Rust Book fearless concurrency chapter",
			url: "https://doc.rust-lang.org/book/ch16-00-concurrency.html"
		}
	},
	"RSS9 Unsafe, FFI, and Trusted Boundaries": {
		stage: "Audit the boundary where compiler guarantees stop",
		estimatedTime: "6 sessions · 45–60 minutes each",
		keyBlocks: [
			"safe baseline",
			"unsafe operation",
			"invariant",
			"safe wrapper",
			"FFI contract",
			"Miri limit"
		],
		practiceSection: "unsafe-ffi-boundary-case",
		answerSection: "unsafe-ffi-boundary-key",
		route: "Start with a safe implementation, then review one supplied unsafe or C-ABI boundary only when it serves a named need. Minimize the block, document every precondition and invariant, contain raw values behind a safe wrapper, test invalid callers, and compare ordinary tests with bounded Miri evidence.",
		safeRoute:
			"The required route is a code-and-contract review over supplied snippets; compiling C or running Miri is optional. Never load an unknown library, call an unlicensed binary, weaken host protections, expose raw pointers publicly, or accept an AI-written safety comment as proof.",
		evidence:
			"The unsafe ledger identifies each operation, compiler guarantee surrendered, safety precondition, safe-code dependency, panic or unwind concern, wrapper guarantee, negative test, Miri result or supplied trace, and limitation that remains outside Miri's model.",
		primaryReference: {
			label: "Rust Book unsafe Rust chapter",
			url: "https://doc.rust-lang.org/book/ch20-01-unsafe-rust.html"
		},
		additionalReferences: [
			{
				label: "Miri documentation",
				url: "https://github.com/rust-lang/miri/"
			}
		]
	},
	"RSS10 Capstone: Harden a Legacy Tool": {
		stage: "Legacy-tool hardening capstone",
		estimatedTime: "10–14 sessions · 45–60 minutes each",
		keyBlocks: [
			"behavior contract",
			"threat model",
			"Rust redesign",
			"regression corpus",
			"tool evidence",
			"residual risk"
		],
		practiceSection: "legacy-tool-hardening-capstone-case",
		answerSection: "legacy-tool-hardening-capstone-key",
		route: "Harden the supplied legacy record tool through vertical slices: preserve valid behavior, define trust and resource boundaries, redesign ownership and state, introduce typed errors and bounded parsing, isolate any unavoidable unsafe or FFI code, add concurrency only when justified, and prove the final behavior with a reproducible evidence packet.",
		safeRoute:
			"Use only the supplied pseudocode, byte fixtures, fictional labels, local Rust workspace, fixed corpus, and bounded optional tool runs. No external binary, production code, real vulnerability, secret, public repository issue, live service, or autonomous AI execution belongs in the capstone.",
		evidence:
			"The final packet includes Rust and edition versions, original behavior contract, threat model, old failure modes, redesign map, format and lint results, tests, lock and advisory review, bounded corpus or fuzz evidence, unsafe ledger when present, before-and-after claims, residual risks, and a five-minute reproduction.",
		primaryReference: {
			label: "RustSec Advisory Database",
			url: "https://rustsec.org/"
		},
		additionalReferences: [
			{
				label: "cargo-fuzz documentation",
				url: "https://github.com/rust-fuzz/cargo-fuzz/"
			},
			{
				label: "Miri documentation",
				url: "https://github.com/rust-lang/miri/"
			}
		]
	}
};

function rustSystemsPracticeLink(section: string) {
	return `${RUST_SYSTEMS_PRACTICE_PACK}#${section}`;
}

function rustSystemsVerificationLink(section: string) {
	return `${RUST_SYSTEMS_VERIFICATION_GUIDE}#${section}`;
}

function rustSystemsSupplementalPath(title: string) {
	if (/extension|challenge/i.test(title)) return "challenge" as const;
	if (/^project:/i.test(title)) return "core" as const;
	return "choice" as const;
}

function renderRustSystemsReferences(flow: RustSystemsModuleFlow) {
	const primary = `[${flow.primaryReference.label}](${flow.primaryReference.url})`;
	const additional = flow.additionalReferences ?? [];
	if (additional.length === 0) return primary;

	return [
		primary,
		...additional.map(item => `[${item.label}](${item.url})`)
	].join(", ");
}

function decorateRustSystemsModule(
	module: RawCourse["modules"][number]
): RawCourse["modules"][number] {
	const flow = RUST_SYSTEMS_MODULE_FLOW[module.title];
	if (!flow)
		throw new Error(`Missing Rust Systems Security flow: ${module.title}`);

	const practiceLink = rustSystemsPracticeLink(flow.practiceSection);
	const verificationLink = rustSystemsVerificationLink(flow.answerSection);
	const references = renderRustSystemsReferences(flow);

	return {
		...module,
		kind: "module",
		estimatedTime: flow.estimatedTime,
		keyBlocks: [...flow.keyBlocks],
		curriculum: module.curriculum.map((item, index) => ({
			...item,
			content:
				index === 0
					? `**Course flow:** ${flow.stage}. ${flow.route}

**Bounded practice route:** ${flow.safeRoute}

**Evidence gate:** ${flow.evidence}

**Local continuity:** Complete the [supplied Rust case](${practiceLink}) before comparing it with the [verification guide](${verificationLink}). This route requires no live target, real data, third-party binary, or unbounded tool run.

**Current references:** ${references}. Record the Rust release, edition, target platform, lock state, optional tool versions, and source-fixture edition when the result depends on them.

${item.content}`
					: item.content,
			learningPath: "core" as const,
			...(item.projectLink
				? {
						datasetLink: item.datasetLink ?? practiceLink,
						mediaLink: item.mediaLink ?? flow.primaryReference.url
					}
				: {})
		})),
		supplementalProjects: module.supplementalProjects.map(item => ({
			...item,
			learningPath: rustSystemsSupplementalPath(item.title),
			datasetLink: item.datasetLink ?? practiceLink,
			mediaLink: item.mediaLink ?? flow.primaryReference.url
		}))
	};
}

export const rustSystemsSecurityCourse: RawCourse = {
	...rustSystemsSecuritySourceCourse,
	modules: rustSystemsSecuritySourceCourse.modules.map(
		decorateRustSystemsModule
	)
};
