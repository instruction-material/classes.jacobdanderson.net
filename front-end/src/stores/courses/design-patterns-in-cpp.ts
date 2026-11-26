import type { RawCourse, RawCourseModuleItem } from "./types";

const setupSource =
	"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/f63768d7f10a215697e2d5d8cbff49c3c2bcf3fb";

const designPatternsInCppSourceCourse: RawCourse = {
	name: "Design Patterns in C++",
	modules: [
		{
			title: "DPC0 Setup and Tooling",
			curriculum: [
				{
					title: "Modern C++ Toolchain Baseline",
					preserveInstructions: true,
					contentKind: "reading",
					content:
						"The formatter project uses C++20 and CMake 3.20 or later. CLion, VS Code and a terminal can all open the same folder. Download the project and extract it before building. The folder containing CMakeLists.txt is the source directory. It contains main.cpp for the demo, checks.cpp for the tests, formatter.h for the declaration, and formatter.cpp for the definition. Both executables link to the same formatter library. The build directory holds compiler output and can be recreated from these source files."
				},
				{
					title: "Compiler, CMake, and Debugger Verification",
					preserveInstructions: true,
					contentKind: "reading",
					content:
						"Check the compiler with `clang++ --version` or `g++ --version`, then run `cmake --version`. At the source directory run `cmake -S . -B cmake-build -DCMAKE_BUILD_TYPE=Debug` and `cmake --build cmake-build`. On a single-configuration macOS or Linux build, `./cmake-build/title` initially prints “design patterns”. To inspect it with LLDB, run `lldb ./cmake-build/title`, then enter `breakpoint set --name format_title`, `run` and `frame variable input`. The displayed argument is the text from main.cpp. Use `continue` to finish. A multi-configuration generator puts the Debug executable in a Debug subdirectory."
				},
				{
					title: "Sanitizers and Warnings as Design Feedback",
					preserveInstructions: true,
					contentKind: "reading",
					content:
						'Warnings flag suspicious code during compilation. Sanitizers report certain runtime problems on the paths the program actually executes. With Clang or GCC on a supported platform, configure a separate build with `cmake -S . -B checked -DCMAKE_BUILD_TYPE=Debug "-DCMAKE_CXX_FLAGS=-Wall -Wextra -Wpedantic -Werror -fsanitize=address,undefined -fno-omit-frame-pointer"`. Run `cmake --build checked` and `ctest --test-dir checked --output-on-failure`. An expected-versus-observed string mismatch is a behavior failure. A sanitizer diagnostic reports a runtime problem. Record which occurred when a test fails.'
				},
				{
					title: "Why CMake Matters Here",
					preserveInstructions: true,
					contentKind: "reading",
					content:
						"The demo and the test runner each define main. Compiling every .cpp file into one executable gives two definitions of main. CMakeLists.txt describes the intended targets. add_library builds the formatter once, add_executable defines each program, and target_link_libraries connects each program to the library. add_test registers a runnable check with CTest. After configuring, use `ctest --test-dir cmake-build -N` to list the three formatter checks. A successful compile and link establish that the executables can be built. Running CTest compares behavior with the supplied expectations."
				},
				{
					title: "DPC0 Setup and Tooling: Core Project",
					preserveInstructions: true,
					contentKind: "assignment",
					content:
						"Build a title formatter from the starter in a separate Debug build directory. CMake builds a library, the title demo and a checks executable. Run `ctest --test-dir cmake-build --output-on-failure`. The empty case passes. The ordinary and spacing cases initially fail because format_title returns its input.\n\nEdit formatter.cpp so that the first character of each whitespace-delimited word is capitalized. Keep all original whitespace and other letters. In ASCII text, “design patterns” becomes “Design Patterns”. A tab between words must remain a tab. Inspect the first mismatched character in the debugger, then rerun the three checks.\n\n**Checkpoints:** Record the original failures, three passing checks after the change, and the output of the title demo. Predict and test one input containing repeated whitespace.",
					projectLink: `${setupSource}/DPC-05-dpc0-setup-and-tooling/starter`,
					solutionLink: `${setupSource}/DPC-05-dpc0-setup-and-tooling/solution`
				}
			],
			supplementalProjects: [
				{
					title: "Modern C++ Comparison: Setup and Tooling",
					preserveInstructions: true,
					contentKind: "assignment",
					content:
						"Reuse the completed title formatter. The current demo calls a free function. Sketch an alternative in which a Formatter interface has a virtual destructor and a const format operation, and a TitleFormatter delegates to the same function. Give the demo exclusive ownership of this object through std::unique_ptr<Formatter>. Compare the output of both versions on the empty and spacing cases.\n\n**Checkpoints:** Mark the owner, the destruction point and the operation selected at runtime. Explain which design you would use when the formatter is fixed, then describe a requirement that would make replacing the formatter at runtime worthwhile. The linked reference demonstrates the original free function.",
					projectLink: `${setupSource}/DPC-05-dpc0-setup-and-tooling/starter`,
					solutionLink: `${setupSource}/DPC-05-dpc0-setup-and-tooling/solution`
				},
				{
					title: "Build Tooling Transfer Practice",
					preserveInstructions: true,
					contentKind: "assignment",
					content:
						"Investigate why a temperature average loses half a degree. Configure the starter with `cmake -S . -B cmake-build -DCMAKE_BUILD_TYPE=Debug`, build it and run CTest. A pair of 10 and 14 gives 12. The starter gives 13 for 12 and 15 and rounds −2.5 toward zero for −4 and −1. Break at mean_temperature in temperature.cpp. Write down the sum, the type of the division and the value returned before the fix.\n\n**Checkpoints:** Change the arithmetic so the operands preserve fractions during division. Run all three checks and compare with a fourth pair of your choice. Explain why converting the result to double after the division would retain the error.",
					projectLink: `${setupSource}/DPC-01-dpc0-setup-and-tooling-supplemental-2/starter`,
					solutionLink: `${setupSource}/DPC-01-dpc0-setup-and-tooling-supplemental-2/solution`
				},
				{
					title: "CMake Workflow Extension Practice",
					preserveInstructions: true,
					contentKind: "assignment",
					content:
						"The starter contains a length library, a demo and a separate checks.cpp. Configure and build it, then run `ctest --test-dir cmake-build -N`. The demo prints 30 for three centimetres, but CTest lists zero tests. Add an executable named length_checks from checks.cpp in CMakeLists.txt. Link it to length and register it as centimetre_conversion with add_test. Reconfigure, rebuild and run CTest again.\n\n**Checkpoints:** Confirm that one test is registered. Change the conversion multiplier from 10 to 100 and observe that the test fails. Restore 10, rebuild and show the passing result. Explain why successfully building the original demo did not verify the conversion.",
					projectLink: `${setupSource}/DPC-02-dpc0-setup-and-tooling-supplemental-3/starter`,
					solutionLink: `${setupSource}/DPC-02-dpc0-setup-and-tooling-supplemental-3/solution`
				}
			]
		},
		{
			title: "DPC1 Why Patterns Look Different in Modern C++",
			curriculum: [
				{
					title: "Ownership Changes the Conversation",
					content:
						"Start with object ownership, RAII, and stack-versus-heap decisions. Lifetime is part of architecture in C++, so some textbook patterns must be rewritten to avoid careless heap graphs."
				},
				{
					title: "Value Semantics versus Reference Semantics",
					content:
						"A plain value type or small immutable object can remove the need for a pattern entirely. In C++, some creation and wrapper patterns only become justified once polymorphism, shared lifetime, or runtime variability is actually needed. Compare both designs before choosing: a value-based object is easier to copy, test, and reason about, while reference-based design can support shared identity, substitution, and late binding. The design decision names the lifetime owner, copy behavior, mutation boundary, and reason a simpler value type was or was not enough."
				},
				{
					title: "Composition over Inheritance with Lifetime in View",
					content:
						"Treat composition as the default because the reason is concrete: fewer fragile inheritance trees, clearer ownership, and easier resource cleanup. A strong design explanation connects the choice to safety and maintainability, not fashion."
				},
				{
					title: "Runtime versus Compile-Time Variation",
					content:
						"C++ can express flexibility through either runtime polymorphism or template-based compile-time structure. The main design skill is spotting when a classic pattern remains useful and when a policy or value type is the cleaner fit."
				},
				{
					title: "DPC1 Why Patterns Look Different in Modern C++: Core Project",
					preserveInstructions: true,
					contentKind: "assignment",
					content:
						"Open the scene preset starter. A preset contains an exposure and an ordered list of effects. The night variant is copied from the base, but editing night also edits the base. Build main.cpp with C++20. Trace where the two objects refer to the same settings, then choose storage that gives each preset its own settings and effect list. Keep the public interface and default copy operations.\n\n**Checkpoints:** After editing night, the original still has exposure 1 and only grain. The variant has exposure 3 with grain and blue. Check that a copy made by assignment keeps its old effect list when the source changes again.",
					projectLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/8977fda5639bc15e8439e523cb99774a7bad3d64/DPC-06-dpc1-why-patterns-look-different-in-modern-cpp/starter",
					solutionLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/8977fda5639bc15e8439e523cb99774a7bad3d64/DPC-06-dpc1-why-patterns-look-different-in-modern-cpp/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Modern C++ Comparison: Why Patterns Look Different in Modern C++",
					preserveInstructions: true,
					contentKind: "assignment",
					content:
						"Compare a value-owned preset with a heap-owned variant that explicitly deep-copies its settings. Draw the ownership relationships before a copy and after editing the copied effect list. Use the same ordinary and nested-copy inputs for both designs. Reset each example to a preset with one grain effect before making a copy. Record both effect lists after each edit.\n\n**Checkpoints:** A variant of a variant can gain glow without changing either ancestor. For each design, explain which operations the compiler can supply and which must be written to maintain independence.",
					projectLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/8977fda5639bc15e8439e523cb99774a7bad3d64/DPC-06-dpc1-why-patterns-look-different-in-modern-cpp/starter",
					solutionLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/8977fda5639bc15e8439e523cb99774a7bad3d64/DPC-06-dpc1-why-patterns-look-different-in-modern-cpp/solution"
				},
				{
					title: "Modern Ownership Transfer Practice",
					preserveInstructions: true,
					contentKind: "assignment",
					content:
						"The inbox owns a draft through a unique pointer. Its preview is a borrowed read-only pointer valid while that draft stays in the inbox. Build the starter with C++20. Implement take so it hands ownership of the exact draft to a caller and leaves the inbox empty. Use the returned owner for subsequent access. The member pointer already records whether the inbox contains a draft.\n\n**Checkpoints:** The sample previews Sketch, takes it, and reads the same title through the returned owner. Check that the inbox is empty after transfer and a second take returns an empty pointer. Rename the transferred draft and place it into a new inbox. Draw which variable owns the draft before take, after take, and after the final move.",
					projectLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/287527c8e559014b5b655b897d54623d18ac161f/DPC-03-dpc1-why-patterns-look-different-in-modern-cpp-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/287527c8e559014b5b655b897d54623d18ac161f/DPC-03-dpc1-why-patterns-look-different-in-modern-cpp-supplemental-2/solution"
				},
				{
					title: "Pattern Adaptation Extension Practice",
					preserveInstructions: true,
					contentKind: "assignment",
					content:
						"A local exhibit tour has two kinds of steps: show a card or pause for a number of seconds. The input vector can contain both in any order. Build main.cpp with C++20 and trace the two describe overloads. Implement render by visiting the active alternative in the variant and returning the string from the matching overload. An exhibit step is a value and can be copied independently of its original.\n\n**Checkpoints:** The demo displays Welcome, pauses for 3 seconds, and displays Map. Add a pause of zero seconds and an empty string card to verify dispatch remains based on the active type. Copy a step, edit the original card title, and confirm the copied step retains its title. Explain where a closed variant works well and what changes when a third step type is added.",
					projectLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/287527c8e559014b5b655b897d54623d18ac161f/DPC-04-dpc1-why-patterns-look-different-in-modern-cpp-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/287527c8e559014b5b655b897d54623d18ac161f/DPC-04-dpc1-why-patterns-look-different-in-modern-cpp-supplemental-3/solution"
				}
			]
		},
		{
			title: "DPC2 Design Foundations",
			curriculum: [
				{
					title: "Abstract Base Classes, Interfaces, and Contracts",
					content:
						"Use abstract base classes intentionally for runtime polymorphism rather than as a default wrapper around every class. The design question is when an interface clarifies a seam and when it merely copies Java habits."
				},
				{
					title: "Const-Correctness and Dependency Direction",
					content:
						"Make `const` part of the design language, not a syntax detail. Clear read-only boundaries help clarify collaboration, ownership, and mutation before the first major pattern refactor."
				},
				{
					title: "Header and Source Organization",
					content:
						"Split declarations, implementations, and stable boundaries cleanly. File organization, include discipline, and smaller APIs are part of good architecture."
				},
				{
					title: "Practical Move Semantics",
					content:
						"Frame move semantics around obvious ownership transfer instead of abstract rules. Explain when move-only types make a design safer and when copying a value remains perfectly appropriate."
				},
				{
					title: "DPC2 Design Foundations: Core Project",
					preserveInstructions: true,
					contentKind: "assignment",
					content:
						"Run the shipping quote starter with a C++20 compiler. The express rate for two parcels is 475 cents, but the starter quotes 200. Trace the Rate parameter as it enters quote. Passing a derived object by value to a base parameter copies only the base part. Change the parameter to use the caller-owned object and preserve virtual dispatch. Keep the policy lifetime long enough for the call.\n\n**Checkpoints:** Two standard parcels cost 200 cents. One and two express parcels cost 275 and 475 cents. An empty express shipment costs zero. Run the express calls through the same base reference and check the complete output.",
					projectLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/8977fda5639bc15e8439e523cb99774a7bad3d64/DPC-07-dpc2-design-foundations/starter",
					solutionLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/8977fda5639bc15e8439e523cb99774a7bad3d64/DPC-07-dpc2-design-foundations/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Modern C++ Comparison: Design Foundations",
					preserveInstructions: true,
					contentKind: "assignment",
					content:
						"Add a second quote function that takes a policy as a template parameter. Test it with a type that implements cents but does not inherit from Rate. Run the original runtime-selected policy through the virtual interface and compare the two call sites. Trace where each call chooses the implementation of cents and which object owns the rate during that call.\n\n**Checkpoints:** Use the same one-parcel and empty-shipment cases. Identify which version can select among several derived rate objects at runtime and which can accept an unrelated type with a compatible operation.",
					projectLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/8977fda5639bc15e8439e523cb99774a7bad3d64/DPC-07-dpc2-design-foundations/starter",
					solutionLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/8977fda5639bc15e8439e523cb99774a7bad3d64/DPC-07-dpc2-design-foundations/solution"
				},
				{
					title: "Interface Contract Transfer Practice",
					preserveInstructions: true,
					contentKind: "assignment",
					content:
						"Compare a fixed reading and a missing reading behind one read-only probe interface. Build the starter with C++20. Implement inspect using the Probe reference passed in by the caller. Call read once. An absent reading produces Missing, a reading strictly below the limit produces Below, and all other readings produce Ready. Keep the concrete probe types out of the decision code.\n\n**Checkpoints:** At limit 10, the demo reports Ready for 10, Below for 9, and Missing when no reading exists. Test a real zero reading with both limit 1 and limit 0. An absent reading and a recorded zero have different meanings. Create a probe that counts its read calls and show that inspect requests exactly one sample.",
					projectLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/287527c8e559014b5b655b897d54623d18ac161f/DPC-05-dpc2-design-foundations-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/287527c8e559014b5b655b897d54623d18ac161f/DPC-05-dpc2-design-foundations-supplemental-2/solution"
				},
				{
					title: "Move Semantics Extension Practice",
					preserveInstructions: true,
					contentKind: "assignment",
					content:
						"A move-only slot lease releases its slot in the destructor. The move constructor already transfers a slot and makes the source lease empty. Build the starter and trace that constructor. Complete move assignment so it releases the destination’s existing slot before transferring the source slot. When the source and destination are the same object, keep the slot. The registry must outlive every lease.\n\n**Checkpoints:** The demo starts with two live slots. Assigning the first lease to the second by move leaves one live slot, and the source becomes empty. After both leases leave scope the registry has zero live slots. Also test assigning an empty moved-from lease and moving through an alias of the same object. Both cases preserve the expected release counts.",
					projectLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/287527c8e559014b5b655b897d54623d18ac161f/DPC-06-dpc2-design-foundations-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/287527c8e559014b5b655b897d54623d18ac161f/DPC-06-dpc2-design-foundations-supplemental-3/solution"
				}
			]
		},
		{
			title: "DPC3 Factory Method, Abstract Factory, and Builder",
			curriculum: [
				{
					title: "Ownership-Aware Creation",
					preserveInstructions: true,
					contentKind: "reading",
					content:
						"The starter builder calls make_unique<MetricCard> directly. That call fixes which widget gets created. Move construction into a virtual creation method and return unique_ptr<Widget>. The concrete factory chooses a product, then transfers ownership to the builder."
				},
				{
					title: "Abstract Factory for Coordinated Families",
					preserveInstructions: true,
					contentKind: "reading",
					content:
						"A theme factory creates a family of metrics, badges and buttons. The light family uses sky, emerald and paper. The dark family uses lime, amber and slate. The builder asks for a widget by purpose and can assemble either family using the same sequence of calls."
				},
				{
					title: "Builder for Configuration-Heavy Setup",
					preserveInstructions: true,
					contentKind: "reading",
					content:
						"In one assembly function, add the active-user metric, queue metric, health badge and action button in display order. Keeping the steps together lets a second theme reuse the layout. The builder owns the products in a vector of unique_ptr values. It borrows the factory for the duration of construction."
				},
				{
					title: "Creation Tradeoffs in Practice",
					preserveInstructions: true,
					contentKind: "reading",
					content:
						"If only a color changes, passing a palette as a value is sufficient. Try a third family that renders plain text instead of styled widgets. Check whether the new implementation can be introduced by changing only the selected factory."
				},
				{
					title: "DPC3 Factory Method, Abstract Factory, and Builder: Core Project",
					preserveInstructions: true,
					contentKind: "assignment",
					content:
						"Open the dashboard starter and compile main.cpp with C++20. Trace which class actually constructs MetricCard. Implement factory methods for metrics, badges and buttons, then have DashboardBuilder use the supplied factory at every step. Assemble the same four rows with both families. Verify the order and the light and dark styles against README.md.\n\n**Checkpoints:** For each theme, show the two metric rows, then the Healthy badge and the Flush cache button. The builder must accept either factory without switching on its type.",
					projectLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/748ac87bb93688229cb03b8c3618829319578156/DPC1-Factories-and-Builders-Workshop/starter",
					solutionLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/748ac87bb93688229cb03b8c3618829319578156/DPC1-Factories-and-Builders-Workshop/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Project: Factories and Builders Workshop",
					preserveInstructions: true,
					contentKind: "assignment",
					content:
						"Extend the core dashboard with a plain-text product family. Use a separate Widget implementation whose render method returns text such as Active users=184. Have each creation method return an owning pointer to the plain-text widget. Pass the new factory to buildStandardDashboard and capture the returned rows. Verify all four rows, their order, and that DashboardBuilder contains no family-specific branch.\n\n**Checkpoints:** The plain-text family renders Active users=184, Build queue=9, status Healthy and action Flush cache in order. The original light and dark dashboards still render correctly.",
					projectLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/748ac87bb93688229cb03b8c3618829319578156/DPC1-Factories-and-Builders-Workshop/starter",
					solutionLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/748ac87bb93688229cb03b8c3618829319578156/DPC1-Factories-and-Builders-Workshop/solution"
				},
				{
					title: "Creation Pattern Transfer Practice",
					preserveInstructions: true,
					contentKind: "assignment",
					content:
						"A print job surrounds a label with square brackets. The starter hard-codes Domestic inside PrintJob::print, even though each subclass provides makeFormatter(). Compile main.cpp with C++20 and compare the domestic and international outputs for Lima. Refactor the shared print operation to request and use the product created by the virtual factory method. Keep the framing code in the base class.\n\n**Checkpoints:** Both labels retain their brackets. A domestic job prints [DOM Lima] and an international job prints [INTL Lima]. Add a pickup formatter and job, then use them through a PrintJob reference without adding a branch to print().",
					projectLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/81684adf1a90d3864f3f2d670ef25a7579b2b9b2/DPC-07-dpc3-factory-method-abstract-factory-and-builder-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/81684adf1a90d3864f3f2d670ef25a7579b2b9b2/DPC-07-dpc3-factory-method-abstract-factory-and-builder-supplemental-2/solution"
				},
				{
					title: "Builder Family Extension Practice",
					preserveInstructions: true,
					contentKind: "assignment",
					content:
						"Build an event listing with a required title, an optional room and a positive capacity. The starter accepts invalid listings and ignores configured fields. Compile main.cpp with C++20. Change ListingBuilder::build to return an empty optional for a missing title or a nonpositive capacity. A valid listing owns its values so that later builder changes leave existing listings intact.\n\n**Checkpoints:** Maps begins with online and one seat. A second build for Lab A has twelve seats. The original listing keeps its first room and capacity. Add tests for a capacity of minus one and the smallest valid capacity.",
					projectLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/81684adf1a90d3864f3f2d670ef25a7579b2b9b2/DPC-08-dpc3-factory-method-abstract-factory-and-builder-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/81684adf1a90d3864f3f2d670ef25a7579b2b9b2/DPC-08-dpc3-factory-method-abstract-factory-and-builder-supplemental-3/solution"
				}
			]
		},
		{
			title: "DPC4 Strategy and Policy-Based Design",
			curriculum: [
				{
					title: "Runtime Strategy Objects",
					content:
						"Strategy first appears in its classic runtime-polymorphism form so swappable behavior is easy to reason about. Use pricing, scoring, or routing rules where the runtime choice is a genuine product requirement."
				},
				{
					title: "Lambdas and Function Objects",
					content:
						"Lambdas and lightweight callables often cover the same design need with less ceremony. Compare the difference between a full strategy family and a short-lived behavior injection."
				},
				{
					title: "Policy-Based Design with Templates",
					content:
						"Policy-based design fits cases where variability is known at compile time and the code benefits from avoiding runtime dispatch. The tradeoff matters more than claiming templates are always better."
				},
				{
					title: "Choosing Runtime versus Compile-Time Flexibility",
					content:
						"Justify whether the design needs late binding, test seams, and plugin-style variability, or whether compile-time selection is cleaner. This is one of the core judgment moves in modern C++ architecture."
				},
				{
					title: "DPC4 Strategy and Policy-Based Design: Core Project",
					preserveInstructions: true,
					contentKind: "assignment",
					content:
						"Compile the simulator in main.cpp as C++20. Trace the same gold order through StudentDiscount and MemberDiscount. Add a strategy that stores a callable and a display name, then pass it to the existing printScenario function through the DiscountStrategy interface. Supply a flash-sale lambda that saves eight percent for orders placed at most one day early. Keep the two shipping policies as template arguments.\n\n**Checkpoints:** For a $120 order one day early, StudentDiscount saves $18, the gold member saves $6 and the flash sale saves $9.60. At two days early the sale saves zero. Identify which call selects behavior through a virtual function and which type fixes the shipping calculation at compile time.",
					projectLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/e2c2200e69ae97d5f807fe210aeab3c183018101/DPC2-Strategy-and-Policy-Simulator/starter",
					solutionLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/e2c2200e69ae97d5f807fe210aeab3c183018101/DPC2-Strategy-and-Policy-Simulator/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Project: Strategy and Policy Simulator",
					preserveInstructions: true,
					contentKind: "assignment",
					content:
						"Use the simulator to investigate two decisions that vary independently. Keep the cart total at $120 and record the discount and shipping price for each order. Change the membership tier from gold to silver while keeping the days constant. Then hold the tier constant and change from one day early to two days early. Calculate the expected amounts before running the program.\n\n**Checkpoints:** Silver membership saves $2.40 and gold saves $6. At two days early, ground shipping costs $4 and priority costs $10. Identify which input fields each strategy or policy actually reads, and explain why changing shipping speed leaves the membership savings unchanged.",
					projectLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/e2c2200e69ae97d5f807fe210aeab3c183018101/DPC2-Strategy-and-Policy-Simulator/starter",
					solutionLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/e2c2200e69ae97d5f807fe210aeab3c183018101/DPC2-Strategy-and-Policy-Simulator/solution"
				},
				{
					title: "Strategy Policy Transfer Practice",
					preserveInstructions: true,
					contentKind: "assignment",
					content:
						"Build a print scheduler that can select its scheduling strategy when the program starts. Run the starter with no argument for arrival order, then with shortest for shortest-job-first. Both modes currently select the first pending job. Complete ShortestJob so it compares durations each time the scheduler needs a job. Preserve arrival order among jobs with equal durations. Leave the queue and output loop independent of the strategy selected by the caller.\n\n**Checkpoints:** The demo queue contains poster (8), card (2), label (2) and map (5). Arrival order is poster, card, label, map. Shortest order is card, label, map, poster. Try a single job and an empty queue, then explain which part owns the pending jobs and which part only inspects them.",
					projectLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/b8f61170b9be30a7e74931a88cf38308a22255ad/DPC-09-dpc4-strategy-and-policy-based-design-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/b8f61170b9be30a7e74931a88cf38308a22255ad/DPC-09-dpc4-strategy-and-policy-based-design-supplemental-2/solution"
				},
				{
					title: "Policy Design Extension Practice",
					preserveInstructions: true,
					contentKind: "assignment",
					content:
						"Build a temperature alarm whose threshold and comparison rule are fixed by its type. The starter passes each integer reading to the policy selected by a template argument. `AtLeast<30>` already includes its boundary. Implement `OutsideBand<Low, High>` so it flags values strictly outside the inclusive range. Require the lower limit to be no greater than the upper limit at compile time. The same filtering function must work with either policy without a switch.\n\n**Checkpoints:** For readings 9, 10, 20, 30 and 31, `AtLeast<30>` reports 30 and 31. `OutsideBand<10, 30>` reports 9 and 31. Try a zero-width band and an empty sample. Show where the compiler fixes the rule and where the running program supplies the data.",
					projectLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/b8f61170b9be30a7e74931a88cf38308a22255ad/DPC-10-dpc4-strategy-and-policy-based-design-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/b8f61170b9be30a7e74931a88cf38308a22255ad/DPC-10-dpc4-strategy-and-policy-based-design-supplemental-3/solution"
				}
			]
		},
		{
			title: "DPC5 Observer and Event Flow",
			curriculum: [
				{
					title: "Subscriptions and Event Fan-Out",
					content:
						"Observer is a controlled way to notify multiple listeners without hard-coding downstream reactions into the publisher. Use event fan-out, logs, dashboards, and alerts as realistic examples rather than abstract listener diagrams."
				},
				{
					title: "Lifetime-Safe Listener Storage",
					content:
						"Make listener lifetime the central C++ wrinkle. Explicitly compare raw pointers, references, shared ownership, and `weak_ptr` so they can avoid dangling callbacks and stale subscriptions."
				},
				{
					title: "Push versus Pull Models",
					content:
						"An event payload can either push full data immediately or require listeners to pull details later. The better choice depends on coupling, cost, and how long the source object remains valid."
				},
				{
					title: "Failure Handling and Event Hygiene",
					content:
						"Compare duplicate subscriptions, expired listeners, ordering, and escalation behavior. Observer is a real operational system with edge cases, not free decoupling."
				},
				{
					title: "DPC5 Observer and Event Flow: Core Project",
					preserveInstructions: true,
					contentKind: "assignment",
					content:
						"Build the event hub in main.cpp with a C++20 compiler. The publisher holds weak pointers and the calling code owns the listeners. Add a summary listener that remembers the latest three event topics in arrival order. Give it a separate method to print the summary on request. Clean expired entries from the hub when publishing. Keep the subscription snapshot so a listener registered during delivery begins with the next publication.\n\n**Checkpoints:** Send build.complete, cache.miss and api.latency, print the summary, release the console listener and send deploy.finish. The final summary starts with cache.miss and ends with deploy.finish. Only a severity of four or higher triggers escalation.",
					projectLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/fa7e1c5b1f188e740685b031e196259d15f1c8bb/DPC3-Observer-Event-Hub/starter",
					solutionLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/fa7e1c5b1f188e740685b031e196259d15f1c8bb/DPC3-Observer-Event-Hub/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Project: Observer Event Hub",
					preserveInstructions: true,
					contentKind: "assignment",
					content:
						"Investigate how listener ownership affects event delivery. Subscribe a counter and a listener that registers another counter the first time it receives an event. Keep the new counter alive in the calling code. Predict the counts before publishing twice, then compare your prediction with the output. Next, release the owner of the first counter and publish again. Trace the subscription snapshot and the weak-pointer lock at each delivery.\n\n**Checkpoints:** The later counter receives zero calls on the first publication and one on the second. Releasing the first counter lets it expire. Explain why copying the weak subscription list preserves the current order without extending listener lifetimes.",
					projectLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/fa7e1c5b1f188e740685b031e196259d15f1c8bb/DPC3-Observer-Event-Hub/starter",
					solutionLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/fa7e1c5b1f188e740685b031e196259d15f1c8bb/DPC3-Observer-Event-Hub/solution"
				},
				{
					title: "Observer Event Transfer Practice",
					preserveInstructions: true,
					contentKind: "assignment",
					content:
						"Route match events to interested listeners. A goal listener receives goal events only, while a general match log can subscribe to all topics with an empty filter. The caller retains ownership of each listener. Implement publish using the subscription snapshot, the topic on each slot and its weak listener pointer. Deliver matching events in registration order. Releasing the caller’s last shared owner ends delivery to that listener.\n\n**Checkpoints:** Publish a goal and a foul with the scoreboard, referee and general log subscribed. The scoreboard records only the goal, the referee records only the foul and the log records both. Release the referee and publish another foul. The general log still receives it. Predict what happens for an unrecognized topic.",
					projectLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/b8f61170b9be30a7e74931a88cf38308a22255ad/DPC-11-dpc5-observer-and-event-flow-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/b8f61170b9be30a7e74931a88cf38308a22255ad/DPC-11-dpc5-observer-and-event-flow-supplemental-2/solution"
				},
				{
					title: "Listener Lifetime Extension Practice",
					preserveInstructions: true,
					contentKind: "assignment",
					content:
						"Use a move-only connection to control how long a clock callback receives ticks. The connection owns a shared callback, while the clock keeps a weak reference to it. Moving a connection transfers that ownership. Destroying a connection already releases it. Implement explicit disconnect, then remove expired weak entries at the start of each tick. Preserve the snapshot so a callback attached during a tick starts with the following tick.\n\n**Checkpoints:** Move the first connection into a new variable. The moved-from connection must have no effect when disconnected. After explicitly disconnecting the new owner, only the second callback runs. When its scope ends, the next tick removes the final expired entry. Test a second disconnect and confirm the counts stay unchanged.",
					projectLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/b8f61170b9be30a7e74931a88cf38308a22255ad/DPC-12-dpc5-observer-and-event-flow-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/b8f61170b9be30a7e74931a88cf38308a22255ad/DPC-12-dpc5-observer-and-event-flow-supplemental-3/solution"
				}
			]
		},
		{
			title: "DPC6 Decorator, Adapter, and Facade",
			curriculum: [
				{
					title: "Decorator with Ownership Clarity",
					content:
						"Decorator layers behavior without exploding subclasses. In C++, explicitly justify whether the wrapper owns the wrapped object, borrows it, or shares it."
				},
				{
					title: "Adapter for Legacy or Third-Party APIs",
					content:
						"Use Adapter when an old or external interface does not match the current domain boundary. The key lesson is to preserve the clean client-side contract rather than leak the odd legacy shape everywhere."
				},
				{
					title: "Facade for Subsystem Cleanup",
					content:
						"Use Facade when a subsystem currently exposes too much detail. A facade simplifies a boundary; it is not a replacement name for another oversized god object."
				},
				{
					title: "Boundary Choice before Pattern Choice",
					content:
						"Decide whether the real problem is layered behavior, mismatched APIs, or subsystem sprawl. The right pattern follows from the boundary issue, not from terminology alone."
				},
				{
					title: "DPC6 Decorator, Adapter, and Facade: Core Project",
					preserveInstructions: true,
					contentKind: "assignment",
					content:
						"Open the import tool and build the starter using the CMake commands in its README. The legacy loader accepts one unquoted label, category and nonnegative integer quantity per CSV line. Give the facade a common source interface, then add an adapter for one JSON object per line. JSON fields may appear in any order. Use json-c to decode escaped text and distinguish an integer from a numeric string. Both adapters return ImportRecord values before the facade prints them.\n\n**Checkpoints:** Import lamp,prop,3 and a JSON record with quantity 3, category prop and label lamp. Their results agree. Reject a batch with a missing category, trailing CSV field or quoted JSON quantity. The role README includes the package and linking instructions.",
					projectLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/fa7e1c5b1f188e740685b031e196259d15f1c8bb/DPC4-Facade-Adapter-Import-Tool/starter",
					solutionLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/fa7e1c5b1f188e740685b031e196259d15f1c8bb/DPC4-Facade-Adapter-Import-Tool/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Project: Facade Adapter Import Tool",
					preserveInstructions: true,
					contentKind: "assignment",
					content:
						"Test whether the facade isolates the reporting code from the input format. Create a pair of equivalent data sets for two inventory items, one in CSV and one in JSON Lines. Reverse the JSON field order and add spaces around the separators. Keep the record order unchanged. Use one reporting function for both lists and compare the record count, labels, categories and quantities.\n\n**Checkpoints:** A zero quantity remains zero. An escaped quote inside a JSON label represents one quote in the imported text. Add an invalid second record and verify the adapter reports an error before a partial batch reaches the report.",
					projectLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/fa7e1c5b1f188e740685b031e196259d15f1c8bb/DPC4-Facade-Adapter-Import-Tool/starter",
					solutionLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/fa7e1c5b1f188e740685b031e196259d15f1c8bb/DPC4-Facade-Adapter-Import-Tool/solution"
				},
				{
					title: "Structural Wrapper Transfer Practice",
					preserveInstructions: true,
					contentKind: "assignment",
					content:
						"Wrap a notice sink with a decorator that records the result of each delivery. NoticeSink is the shared interface. A line can be accepted or rejected. Complete TracingSink::deliver so it forwards the original line once, then records one accepted or rejected entry and returns the wrapped sink’s result. This decorator borrows its sink and trace. Keep those objects alive during its use.\n\n**Checkpoints:** Deliver an ordinary note and an empty note. The plain sink accepts the first and rejects the second. The trace records both outcomes in order. Try two identical notes and verify that there are two calls and two entries. Compose two decorators around one sink and verify that the real sink still receives only one call per message.",
					projectLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/596a491a2da9e2da7d9a31438f74ccbf423d221d/DPC-13-dpc6-decorator-adapter-and-facade-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/596a491a2da9e2da7d9a31438f74ccbf423d221d/DPC-13-dpc6-decorator-adapter-and-facade-supplemental-2/solution"
				},
				{
					title: "Facade Boundary Extension Practice",
					preserveInstructions: true,
					contentKind: "assignment",
					content:
						"The audio tour facade coordinates a track catalog and a player. The caller gives a stop name and a volume from 0 to 100 inclusive. Implement AudioGuide::start. Reject an invalid volume before searching the catalog. If the name has no track ID, return UnknownStop without calling the player. Otherwise pass the looked-up ID and the requested volume to the player exactly once and return Started.\n\n**Checkpoints:** Try the garden at volume 50, an unknown stop and the garden at volume 110. Only the garden at 50 reaches the player. Test the inclusive volume limits of 0 and 100 and check that the same track can start twice. Change the ID stored for the garden and start the same stop with the same volume. Verify that the player receives the new ID.",
					projectLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/596a491a2da9e2da7d9a31438f74ccbf423d221d/DPC-14-dpc6-decorator-adapter-and-facade-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/596a491a2da9e2da7d9a31438f74ccbf423d221d/DPC-14-dpc6-decorator-adapter-and-facade-supplemental-3/solution"
				}
			]
		},
		{
			title: "DPC7 Command and State",
			curriculum: [
				{
					title: "Commands as Explicit User or System Actions",
					content:
						"Command packages actions, queues work, and makes undo or history possible. Good command objects represent meaningful behavior transitions rather than merely wrapping one-line functions."
				},
				{
					title: "Undo and Action History",
					content:
						"Use action history to make the design consequences concrete. Reason about what state a command must capture before execution if it wants to undo safely later."
				},
				{
					title: "State Objects versus Enum-Driven Branching",
					content:
						"Compare explicit State objects with large conditionals driven by enums or flags. The key decision is when branching pressure is big enough that separate state behavior is clearer and safer."
				},
				{
					title: "Queues, Modes, and Control Flow",
					content:
						"Combine Command and State in an editor-style or simulator-style example where mode affects what commands are legal. This keeps the patterns tied to real workflow constraints."
				},
				{
					title: "Command Parsing without a Giant Switch",
					content:
						"Use the CS236 scanner/parser pipeline as a design-pattern bridge: raw text can become tokens, tokens can become command objects, and state objects can decide whether each command is currently legal. Still recognize when a simple `switch` is enough and when the command surface has grown past it."
				},
				{
					title: "DPC7 Command and State: Core Project",
					preserveInstructions: true,
					contentKind: "assignment",
					content:
						"Build the command editor in main.cpp with a C++20 compiler. The starter applies commands immediately and saves a copy of the document after each accepted request begins. Move the work into a queue of uniquely owned command objects. When the queue runs, ask the current mode whether each command may execute. Give each accepted command the information it needs to undo its own edit, then move it to history.\n\n**Checkpoints:** Append Sprint notes and then a second phrase in draft mode. In review mode, reject a replacement, accept an appended approval, and undo once. The original two phrases remain. Explain why rejected commands never enter history.",
					projectLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/e2c2200e69ae97d5f807fe210aeab3c183018101/DPC5-Command-and-State-Editor/starter",
					solutionLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/e2c2200e69ae97d5f807fe210aeab3c183018101/DPC5-Command-and-State-Editor/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Project: Command and State Editor",
					preserveInstructions: true,
					contentKind: "assignment",
					content:
						"Use the editor to investigate when a queued edit receives permission. Put a replacement in the queue while draft mode is active. Switch to review mode before running the queue and predict what will happen to the edit. Repeat with a replacement queued in review and executed in draft. Record the state at enqueue, the state at execution, and the final document for each trial.\n\n**Checkpoints:** A replacement executed in review leaves the text unchanged. A replacement executed in draft changes it. Undo once after each sequence and explain which earlier operation, if any, supplied the history entry.",
					projectLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/e2c2200e69ae97d5f807fe210aeab3c183018101/DPC5-Command-and-State-Editor/starter",
					solutionLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/e2c2200e69ae97d5f807fe210aeab3c183018101/DPC5-Command-and-State-Editor/solution"
				},
				{
					title: "Command State Transfer Practice",
					preserveInstructions: true,
					contentKind: "assignment",
					content:
						'Extend the scanner for a command-line editor. Compile main.cpp as C++20 and enter one instruction per line. The starter recognizes mode draft, mode review and undo. Add append and replace, each followed by one quoted string. Check the opening quote and use std::quoted to read spaces, escaped quotes and empty text. Reject unfinished strings or extra tokens before sending a command to the editor.\n\n**Checkpoints:** Append "first draft", enter review mode, try a quoted replacement, append "!" and undo. The document finishes as first draft. An unquoted replacement reports a syntax error. A quoted replacement in review reaches the editor and reports a mode rejection.',
					projectLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/e2c2200e69ae97d5f807fe210aeab3c183018101/DPC-15-dpc7-command-and-state-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/e2c2200e69ae97d5f807fe210aeab3c183018101/DPC-15-dpc7-command-and-state-supplemental-2/solution"
				},
				{
					title: "Undo State Extension Practice",
					preserveInstructions: true,
					contentKind: "assignment",
					content:
						"Extend the command editor so a user can redo an undone edit. Run the starter with a C++20 compiler. Follow each command as it moves from the execution queue to history. On undo, restore the document and move the command to a redo stack. On redo, check the current mode before applying the command and returning it to history. A new accepted edit clears the redo branch.\n\n**Checkpoints:** Append A and B, undo B, then redo to recover AB. Repeat the undo and try a rejected replacement in review mode. Redo still restores AB. Undo again and append C. A final redo leaves AC. Test two consecutive undos followed by two redos.",
					projectLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/e2c2200e69ae97d5f807fe210aeab3c183018101/DPC-16-dpc7-command-and-state-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/e2c2200e69ae97d5f807fe210aeab3c183018101/DPC-16-dpc7-command-and-state-supplemental-3/solution"
				}
			]
		},
		{
			title: "DPC8 Composite and Iterator",
			curriculum: [
				{
					title: "Trees of Heterogeneous Objects",
					content:
						"Composite works well for scene graphs, widget trees, or editor hierarchies where leaf and container nodes must share a common interface. Structural recursion is useful when it removes special-case tree handling rather than adding ornamental abstraction."
				},
				{
					title: "Traversal without Leaking Storage Details",
					content:
						"Traversal helpers and iterator-style views can keep callers from depending on the exact child container structure. Learn that exposing raw containers too eagerly weakens the abstraction."
				},
				{
					title: "Uniform Operations and Boundary Limits",
					content:
						"Use rendering, flattening, or inspection operations to show the upside of a unified interface. Then compare the limit: not every operation belongs uniformly on both leaves and groups."
				},
				{
					title: "Container Exposure Tradeoffs",
					content:
						"Justify whether to expose iterators, flattened snapshots, visitor-style helpers, or no traversal API at all. C++ gives several options, so the abstraction is deliberate rather than accidental."
				},
				{
					title: "DPC8 Composite and Iterator: Core Project",
					preserveInstructions: true,
					contentKind: "assignment",
					content:
						"Build the scene tree from main.cpp with a C++20 compiler. Both Sprite and Group implement SceneNode. A group owns its children and visits them in insertion order. Add a flattenLabels function that accepts a const SceneNode reference, creates an empty vector, asks the node to collect its labels and returns the result by value. Callers can now obtain a snapshot without receiving mutable access to child storage.\n\n**Checkpoints:** Traverse a root with an empty group followed by a branch containing two equally named sprites. Expect root, empty, branch and both sprite names in order. Explain why equal labels still identify two visits and why a leaf adds exactly one entry.",
					projectLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/e2c2200e69ae97d5f807fe210aeab3c183018101/DPC6-Composite-Scene-Tree/starter",
					solutionLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/e2c2200e69ae97d5f807fe210aeab3c183018101/DPC6-Composite-Scene-Tree/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Project: Composite Scene Tree",
					preserveInstructions: true,
					contentKind: "assignment",
					content:
						"Use the scene tree to compare rendering and flattening on the same input. Put a sprite beneath a group, place a second sprite directly beneath the root, and predict the sequence of labels. Move the first sprite construction to the root after the second sprite, rebuild, and compare both outputs. Keep ownership with exactly one group at each step.\n\n**Checkpoints:** Write the before and after sequences and mark which indentation changed. Save a flattened label vector, add another child, and verify that only a newly collected vector includes it. Explain which operation copied strings and which transferred ownership of a node.",
					projectLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/e2c2200e69ae97d5f807fe210aeab3c183018101/DPC6-Composite-Scene-Tree/starter",
					solutionLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/e2c2200e69ae97d5f807fe210aeab3c183018101/DPC6-Composite-Scene-Tree/solution"
				},
				{
					title: "Composite Traversal Transfer Practice",
					preserveInstructions: true,
					contentKind: "assignment",
					content:
						"Build the starter with C++20. A playlist owns tracks and can also own nested playlists. Track.totalSeconds returns its own duration. Implement Playlist.totalSeconds by asking each entry for its total through the common interface. A nested playlist reports its descendants through the same operation. Keep duration separate from the display name so two tracks with the same name can still contribute their own time.\n\n**Checkpoints:** The demo has a 120-second intro and a nested playlist containing tracks of 90 and 45 seconds, for a total of 255. An empty playlist contributes zero. Add a second track with the same name and a duration of 30 seconds, then predict the new total. Test a second level of nesting before comparing with the reference.",
					projectLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/0e50dcb7b9ddb16a0d845e14bd2649453972b74b/DPC-17-dpc8-composite-and-iterator-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/0e50dcb7b9ddb16a0d845e14bd2649453972b74b/DPC-17-dpc8-composite-and-iterator-supplemental-2/solution"
				},
				{
					title: "Iterator Boundary Extension Practice",
					preserveInstructions: true,
					contentKind: "assignment",
					content:
						"Use a read-only cursor to visit a static outline in breadth-first order. Build main.cpp with C++20. The starter can take the first node from a queue and report exhaustion, but only the root ever enters the queue. Before returning the current node, append its children at the back in their original order. Store borrowed pointers in the queue. Keep the source outline alive and fixed for the entire traversal.\n\n**Checkpoints:** The sample order is Course, Week 1, Week 2, Arrays, Loops, Grid. Test a one-node tree and call next twice after exhaustion. Both calls return null. Start two cursors on the same outline and advance one; the other remains at the root. Explain what would be invalidated if the caller rebuilt a child vector during traversal.",
					projectLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/0e50dcb7b9ddb16a0d845e14bd2649453972b74b/DPC-18-dpc8-composite-and-iterator-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/0e50dcb7b9ddb16a0d845e14bd2649453972b74b/DPC-18-dpc8-composite-and-iterator-supplemental-3/solution"
				}
			]
		},
		{
			title: "DPC9 Singleton, Global State, and Dependency Injection",
			curriculum: [
				{
					title: "Why Singleton Is Attractive",
					preserveInstructions: true,
					contentKind: "reading",
					content:
						"A function-local static object is constructed the first time control reaches its declaration. Later calls return the same object. In a ticket service, two desks can obtain consecutive numbers without either desk receiving a counter in its constructor. Trace the first two calls to globalSequence() in the starter."
				},
				{
					title: "The Real Risks",
					preserveInstructions: true,
					contentKind: "reading",
					content:
						"A third desk in a different clinic also draws from that counter. Opening north, north, south, north gives 1, 2, 3, 4. The clinics require 1, 2, 1, 3. Reordering tests can therefore change the observed numbers. Thread-safe initialization of a local static alone does not make later increments thread-safe."
				},
				{
					title: "Scoped Services and Injected Dependencies",
					preserveInstructions: true,
					contentKind: "reading",
					content:
						"The composition root is the place where the application creates and connects its objects. In main, construct a Sequence for each clinic before creating any TicketDesk. Pass the north sequence to both north desks and the south sequence to the south desk. A Sequence& member borrows an existing counter. Copying the counter would give each desk its own sequence. Local objects are destroyed in reverse construction order, so the counters outlive their desks."
				},
				{
					title: "When a Global Really Is Global",
					preserveInstructions: true,
					contentKind: "reading",
					content:
						"A process-wide sequence would fit a different requirement: every ticket issued by that process must have a different number even across clinics. Write down the scope before choosing a lifetime. If threads can issue tickets concurrently, specify how allocation is synchronized. A restart or a second process changes what a process-local counter can guarantee."
				},
				{
					title: "DPC9 Singleton, Global State, and Dependency Injection: Core Project",
					preserveInstructions: true,
					contentKind: "assignment",
					content:
						"Open the ticket-desk starter. Export the project and run `c++ -std=c++20 -Wall -Wextra -Wpedantic main.cpp -o lab && ./lab` in its folder. Compare the four observed ticket numbers with the clinic requirements. Change TicketDesk to borrow its constructor argument and remove the global lookup. Run again. The north desks must share one sequence while the south desk starts at 1.\n\n**Checkpoints:** The four calls yield 1, 2, 1, 3 and the executable exits successfully. Explain why copying a Sequence into each desk breaks the second check.",
					projectLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/7a868e5fdc31744cb5e37bc9918288eb1480ace2/DPC-08-dpc9-singleton-global-state-and-dependency-injection/starter",
					solutionLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/7a868e5fdc31744cb5e37bc9918288eb1480ace2/DPC-08-dpc9-singleton-global-state-and-dependency-injection/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Modern C++ Comparison: Singleton, Global State, and Dependency Injection",
					preserveInstructions: true,
					contentKind: "assignment",
					content:
						"Use the ticket-desk project to compare the old global lookup with the scoped design. Create a temporary north desk inside a nested scope and issue its first ticket after the first two north tickets. Predict what the original north desk will issue after that scope ends. Run the check, then explain which object owns the sequence and why destroying the temporary desk leaves it usable.\n\n**Checkpoints:** The temporary desk issues north ticket 3, then the original north desk issues ticket 4. A new south desk using its original untouched sequence can still issue ticket 1.",
					projectLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/7a868e5fdc31744cb5e37bc9918288eb1480ace2/DPC-08-dpc9-singleton-global-state-and-dependency-injection/starter",
					solutionLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/7a868e5fdc31744cb5e37bc9918288eb1480ace2/DPC-08-dpc9-singleton-global-state-and-dependency-injection/solution"
				},
				{
					title: "Dependency Injection Transfer Practice",
					preserveInstructions: true,
					contentKind: "assignment",
					content:
						"Open the reservation starter. A reservation expires the instant its clock reaches the deadline. Run main.cpp with C++20, observe the before, at, and after deadline checks, then replace the fixed legacyMinute() call with a borrowed Clock. Each call to expired() must read the current minute. Add a second reservation on the same clock with a different deadline and check both outcomes without sleeping.\n\n**Checkpoints:** With the local clock at 9 and two deadlines at 9 and 10, only the first has expired. At minute 10 both have expired. A separate clock at minute 8 remains unchanged.",
					projectLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/7a868e5fdc31744cb5e37bc9918288eb1480ace2/DPC-19-dpc9-singleton-global-state-and-dependency-injection-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/7a868e5fdc31744cb5e37bc9918288eb1480ace2/DPC-19-dpc9-singleton-global-state-and-dependency-injection-supplemental-2/solution"
				},
				{
					title: "Global State Refactor Extension Practice",
					preserveInstructions: true,
					contentKind: "assignment",
					content:
						"Open the export-receipt starter. Each save must write one line to the stream supplied to that Exporter. Replace the global output lookup while preserving the receipt text, newlines, and order. Build and run main.cpp with C++20. Check that the reports and images stay separate and that destroying one exporter leaves the other destination usable. Add a third destination and inspect its stream after its exporter has gone out of scope.\n\n**Checkpoints:** The report stream contains saved notes.txt followed by saved index.csv. Only saved map.png appears in the image stream. Each receipt ends in a newline.",
					projectLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/7a868e5fdc31744cb5e37bc9918288eb1480ace2/DPC-20-dpc9-singleton-global-state-and-dependency-injection-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/7a868e5fdc31744cb5e37bc9918288eb1480ace2/DPC-20-dpc9-singleton-global-state-and-dependency-injection-supplemental-3/solution"
				}
			]
		},
		{
			title: "DPC10 Patterns for Resource Management",
			curriculum: [
				{
					title: "RAII Wrappers as Architectural Tools",
					content:
						"RAII wrappers belong in the design-pattern conversation, not as a separate memory lecture. A good wrapper makes ownership obvious and impossible to misuse accidentally."
				},
				{
					title: "pImpl and Boundary Stability",
					content:
						"Use `pImpl` when a public type needs a stable boundary while implementation details stay private. Connect this to compile-time hygiene, binary boundaries, and reduced include sprawl."
				},
				{
					title: "Scope Guards and Cleanup Discipline",
					content:
						"Scope guards fit temporary setup and teardown cases where a dedicated wrapper would be too heavy. C++ often solves resource problems with small ownership tools instead of giant frameworks."
				},
				{
					title: "Caches, Handles, and Shared Ownership Decisions",
					content:
						"Compare when a resource cache shares ownership and when a move-only handle is safer. Justify the ownership graph explicitly instead of guessing at what feels convenient."
				},
				{
					title: "DPC10 Patterns for Resource Management: Core Project",
					preserveInstructions: true,
					contentKind: "assignment",
					content:
						"Open the texture manager starter and build main.cpp with C++20. Add terrain twice with player between the requests. Keep the display order and store reusable textures inside PreviewRenderer::Impl. Keep TextureHandle move-only. Add a guard so draw runs one cleanup callback when its scope ends.\n\n**Checkpoints:** Three display entries share two acquired handles. Match each release to its acquisition. Compare the normal exit trace with a case that throws after constructing a guard, catches outside its scope and still observes one callback.",
					projectLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/d97f1ff13b14ceef33ed62f88455ce576bf5dd76/DPC7-RAII-Resource-Manager/starter",
					solutionLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/d97f1ff13b14ceef33ed62f88455ce576bf5dd76/DPC7-RAII-Resource-Manager/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Project: RAII Resource Manager",
					preserveInstructions: true,
					contentKind: "assignment",
					content:
						"Trace ownership when a cleanup guard moves into a nested scope. Use a nonthrowing callback that increments a counter, move the guard and throw inside the nested scope. Catch the exception outside that scope. Then let the moved-from guard go out of scope.\n\n**Checkpoints:** The counter reads one after the catch and one after both destructors. Show that attempting to copy the guard is rejected at compile time. Explain why moving transfers the obligation and why the moved-from guard has no work left.",
					projectLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/d97f1ff13b14ceef33ed62f88455ce576bf5dd76/DPC7-RAII-Resource-Manager/starter",
					solutionLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/d97f1ff13b14ceef33ed62f88455ce576bf5dd76/DPC7-RAII-Resource-Manager/solution"
				},
				{
					title: "RAII Wrapper Transfer Practice",
					preserveInstructions: true,
					contentKind: "assignment",
					content:
						"An output channel allows one active drawing window. The lease holds a reference to the channel, and the channel must outlive the lease. The constructor already tries to open the channel and stores the result. Implement the destructor so only a lease that acquired the channel closes it. The lease stays in its current scope and cannot be copied or moved.\n\n**Checkpoints:** Open one lease and attempt another while the channel is busy. The denied lease owns nothing, and leaving its scope must leave the channel open. Leaving the first lease’s scope closes the channel once. Create a successful lease and throw a simple exception inside that scope. After the catch, check that the channel is available again.",
					projectLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/596a491a2da9e2da7d9a31438f74ccbf423d221d/DPC-21-dpc10-patterns-for-resource-management-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/596a491a2da9e2da7d9a31438f74ccbf423d221d/DPC-21-dpc10-patterns-for-resource-management-supplemental-2/solution"
				},
				{
					title: "Resource Boundary Extension Practice",
					preserveInstructions: true,
					contentKind: "assignment",
					content:
						"A drawing board owns its current labels. A FrameBatch stores proposed changes in a separate vector. Complete commit so it rejects an empty batch or one with an empty label and leaves the board unchanged. When every label is valid, swap the whole batch into the board, then finish the batch. A finished batch rejects another commit and any later append. The board must outlive the batch.\n\n**Checkpoints:** Propose a two-label replacement with one empty label and check that the original board remains visible. Use a fresh batch to replace the board with Map and Key. Call commit again and verify the new labels stay in order. Verify that destroying an uncommitted batch also leaves the board unchanged.",
					projectLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/596a491a2da9e2da7d9a31438f74ccbf423d221d/DPC-22-dpc10-patterns-for-resource-management-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/596a491a2da9e2da7d9a31438f74ccbf423d221d/DPC-22-dpc10-patterns-for-resource-management-supplemental-3/solution"
				}
			]
		},
		{
			title: "DPC11 Legacy Refactoring Lab",
			curriculum: [
				{
					id: "design-patterns-in-cpp-dpc11-legacy-refactoring-lab-curriculum-legacy-refactoring-lab-core-concepts",
					title: "Diagnosing Inheritance and Raw-Pointer Debt",
					aliases: [
						"Legacy Refactoring Lab Core Concepts",
						"Core Concepts",
						"Core Concepts and Learning Sequence"
					],
					preserveInstructions: true,
					preserveAssignment: true,
					contentKind: "reading",
					content:
						"Trace one task through the legacy dispatcher. The caller hands its channel to makeNotifier, receives a heap-allocated notifier, sends the task and deletes the notifier. The caller also decides when to print an escalation. These are separate responsibilities. The channel chooses the destination; urgency controls the priority report.\n\nRun the two supplied tasks. The ordinary email prints [email] Nightly report is ready. The urgent chat prints [chat] Deploy rollback requested and an escalation line. Save the two delivery lines as the behavior to preserve. Mark the manual delete as the lifetime responsibility to move."
				},
				{
					title: "Reducing Implicit Ownership",
					preserveInstructions: true,
					preserveAssignment: true,
					contentKind: "reading",
					content:
						"A return type of LegacyNotifier* does not say who releases the notifier. The starter relies on its caller reaching delete. A std::unique_ptr<DeliveryStrategy> return type gives that responsibility to the returned value. In dispatch, keep the returned pointer in a local variable. Destruction at scope exit also covers an early return or an exception. A virtual destructor lets that pointer correctly destroy a derived strategy.\n\nCompare the notifier with the task. send accepts a const Task& because the task already belongs to its caller and send only reads it during the call. Draw one ownership edge from the local unique pointer to the notifier, and one temporary borrowed edge from send to the task."
				},
				{
					title: "Separating Responsibilities",
					preserveInstructions: true,
					preserveAssignment: true,
					contentKind: "reading",
					content:
						"Use the two properties independently. DeliveryFactory selects email or chat from the channel. DeliveryStrategy::send reports the message to that destination. PriorityPolicy describes whether the task needs escalation. DispatchFacade coordinates one send followed by one priority report.\n\nTrace a second task with the same message and channel and the opposite urgency. Only its priority report changes. Then keep urgency and message fixed and change the channel. Only the delivery label changes. The core project defines two supported channels, email and chat."
				},
				{
					title: "Compile-Time and Runtime Clarity",
					preserveInstructions: true,
					preserveAssignment: true,
					contentKind: "reading",
					content:
						"Compile with C++20 and warnings enabled. The factory signature lets the compiler check who can copy or move the owning handle. Run a two-by-two test of ordinary and urgent work on email and chat to check the behavior the type system cannot prove. Count one delivery per task and compare each message, channel and priority report with the prediction.\n\nIn a debugger, stop once at the call to send and once at the priority policy. Record the selected concrete strategy and the task urgency at those two points. Keeping selection and reporting separate makes a channel regression easier to distinguish from a priority regression."
				},
				{
					title: "DPC11 Legacy Refactoring Lab: Core Project",
					preserveInstructions: true,
					contentKind: "assignment",
					content:
						"Run main.cpp with a C++20 compiler and record the channel and message delivered for each task. In the starter, the caller owns the raw pointer returned by makeNotifier and deletes it after sending. Replace that ownership convention with a factory that returns a unique_ptr to a delivery strategy. Put priority classification in a policy and let a dispatch facade coordinate creation, delivery and reporting.\n\n**Checkpoints:** Use the supplied ordinary email and urgent chat. Each message reaches its original channel exactly once. The reference prints standard handling for the email and immediate escalation for the chat. Explain where cleanup happens if delivery exits early.",
					projectLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/e2c2200e69ae97d5f807fe210aeab3c183018101/DPC8-Legacy-Refactor-Capstone/starter",
					solutionLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/e2c2200e69ae97d5f807fe210aeab3c183018101/DPC8-Legacy-Refactor-Capstone/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Project: Legacy Refactor Capstone",
					preserveInstructions: true,
					contentKind: "assignment",
					content:
						"Use the legacy dispatcher and the refactored dispatcher to write a behavior comparison. Keep message text fixed while testing both priority values on both supported channels. Predict the delivery output separately from the priority report, then run the cases and record what actually changed. Trace ownership from allocation to destruction in each version and identify the smallest interface a caller needs.\n\n**Checkpoints:** A nonurgent email still goes to email and an urgent chat still goes to chat. The reference adds an explicit priority line for ordinary work. Distinguish that reporting change from the preserved routing behavior, and locate the single policy responsible for it.",
					projectLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/e2c2200e69ae97d5f807fe210aeab3c183018101/DPC8-Legacy-Refactor-Capstone/starter",
					solutionLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/e2c2200e69ae97d5f807fe210aeab3c183018101/DPC8-Legacy-Refactor-Capstone/solution"
				},
				{
					title: "Legacy Refactor Transfer Practice",
					preserveInstructions: true,
					contentKind: "assignment",
					content:
						"The workshop charges daily fees for late loans. The existing function has the default rates written in two branches. Build the starter and record the two default totals. Refactor feeFor so the Fees value supplied by the caller is the only source of rates and negative late days count as zero. Use an integer total in cents.\n\n**Checkpoints:** An ordinary loan at two late days costs 150 cents by default. An oversize loan at one late day costs 200 cents. Use 25 and 50 cents as alternate daily rates and verify that the same requests cost 50 and 50. On-time and early returns both cost zero. Explain which behavior the refactor preserves and which result changes only when the caller supplies new rates.",
					projectLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/cee78b27b76c7c4d596a3df3463491c7e4e981cb/DPC-23-dpc11-legacy-refactoring-lab-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/cee78b27b76c7c4d596a3df3463491c7e4e981cb/DPC-23-dpc11-legacy-refactoring-lab-supplemental-2/solution"
				},
				{
					title: "Raw Pointer Refactor Extension Practice",
					preserveInstructions: true,
					contentKind: "assignment",
					content:
						"The preview function allocates a receipt and passes the owning pointer back to its caller. The caller adopts it immediately with a unique pointer. Replace that API with a value return and update the caller to print the value directly. A receipt is a snapshot of the booking title and seat count, valid independently of what happens to the booking.\n\n**Checkpoints:** Both versions print Morning drawing: 2. Keep one receipt, change the booking title and seat count, and make a second receipt. The original still shows the original title and 2 seats. Draw the lifetime of the booking and both receipt variables. Verify that the revised function returns Receipt by value.",
					projectLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/cee78b27b76c7c4d596a3df3463491c7e4e981cb/DPC-24-dpc11-legacy-refactoring-lab-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/cee78b27b76c7c4d596a3df3463491c7e4e981cb/DPC-24-dpc11-legacy-refactoring-lab-supplemental-3/solution"
				}
			]
		},
		{
			title: "DPC12 Capstone Studio",
			curriculum: [
				{
					id: "design-patterns-in-cpp-dpc12-capstone-studio-curriculum-capstone-studio-core-concepts",
					title: "Choosing the Right Medium-Sized Problem",
					aliases: [
						"Capstone Studio Core Concepts",
						"Core Concepts",
						"Core Concepts and Learning Sequence"
					],
					preserveInstructions: true,
					preserveAssignment: true,
					contentKind: "reading",
					content:
						"Use the asset inventory importer to define a problem with a clear boundary. A batch contains names and quantities. The importer accepts every row and updates the inventory, or rejects the batch and retains the earlier inventory. The command prints accepted totals in name order. The important design pressures are adding a second input format and keeping a failed batch from affecting the totals.\n\nStart with the supplied space format and four baseline tests. Write one accepted and one rejected batch. Keep formatting, file storage, and additional editor features outside the first change so each regression has a small cause to inspect."
				},
				{
					title: "Pattern Justification as a Required Deliverable",
					preserveInstructions: true,
					preserveAssignment: true,
					contentKind: "reading",
					content:
						"For each design choice, name a specific change or failure it controls. A shared record reader keeps validation the same for both formats. A temporary inventory keeps a malformed final row from committing the earlier rows. An ordinary Record value keeps each parsed name and quantity local to one iteration. Show these three choices in a short decision table with a test for each.\n\nTrace a valid row followed by an invalid row. Identify the parser boundary, the temporary record and the point where a complete batch replaces the saved totals. Describe what a class hierarchy would buy if input formats needed their own long-lived state."
				},
				{
					title: "Runtime and Compile-Time Tradeoff Review",
					preserveInstructions: true,
					preserveAssignment: true,
					contentKind: "reading",
					content:
						"The reference selects parseSpace or parseComma once at runtime from the requested format. Both functions share a Parser signature and feed readRecord, so the quantity and name rules stay in one place. The selection does not require a heap allocation. A virtual parser interface could carry format-specific state across calls. A fixed parser chosen at compile time fits a tool that is built for exactly one format.\n\nSketch the places a third format would change in each design, then run the same accepted and rejected batches. Compare the smallest change that preserves the common validation and commit boundary."
				},
				{
					title: "Debugging and Sanitizer Readiness",
					preserveInstructions: true,
					preserveAssignment: true,
					contentKind: "reading",
					content:
						"Run ctest --test-dir build -L baseline --output-on-failure after the behavior-preserving refactor. Add the second format in a separate change, then run ctest --test-dir build --output-on-failure for all six supplied cases. Inspect input parsing and the pending totals if an assertion fails.\n\nIn a separate Debug build, enable warnings plus AddressSanitizer and UndefinedBehaviorSanitizer when the compiler supports them. Capture the compiler command and distinguish a test assertion from a sanitizer diagnostic. For the final review, show one successful batch, one rejected final row that leaves earlier totals intact, and a clean rebuild of the refactor without the feature change."
				},
				{
					title: "DPC12 Capstone Studio: Core Project",
					preserveInstructions: true,
					contentKind: "assignment",
					content:
						"Open the asset inventory starter. Use its README to configure CMake, build both targets and run the four baseline checks. Follow a row from standard input into the pending inventory and identify the commit point for a complete batch. Capture a valid space-format report and the rejection of a malformed batch. Refactor the parser boundary while keeping those results, then add the comma format as a separate change.\n\n**Checkpoints:** Run all six CTest cases. Import a valid space batch followed by a comma batch, then a batch with a valid first row and invalid final row. The last batch must leave the previous quantities unchanged. Submit the input files, reports, test results, ownership diagram and separate rollback commits.",
					projectLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/29eaeb6da287955edd423e56da6143664043809c/DPC-09-dpc12-capstone-studio/starter",
					solutionLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/29eaeb6da287955edd423e56da6143664043809c/DPC-09-dpc12-capstone-studio/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Modern C++ Comparison: Capstone Studio",
					preserveInstructions: true,
					contentKind: "assignment",
					content:
						"Use the same inventory capstone to compare two parser designs. Keep the existing space and comma inputs. Implement or sketch a parser interface with one derived class for each format. Compare it with a function selected at runtime and passed to a shared record reader. Trace the ownership of the input, the temporary record and the candidate inventory in both designs.\n\n**Checkpoints:** Run the same valid and rejected batches through both designs. Identify how many sites change when a third format arrives and whether any parser needs to allocate or outlive a single import. Keep the smaller design that meets the recorded change requirement.",
					projectLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/29eaeb6da287955edd423e56da6143664043809c/DPC-09-dpc12-capstone-studio/starter",
					solutionLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/29eaeb6da287955edd423e56da6143664043809c/DPC-09-dpc12-capstone-studio/solution"
				},
				{
					title: "Capstone Architecture Transfer Practice",
					preserveInstructions: true,
					contentKind: "assignment",
					content:
						"A studio planner takes an ordered list of proposed tasks and a minute budget. Complete buildPlan as a function that returns the selected titles and total minutes. Ignore tasks with nonpositive durations. Keep positive-duration tasks in input order and stop at the first one that cannot fit. A task that exactly fills the available time fits. Keep all display code in print.\n\n**Checkpoints:** For tasks of 15, 20 and 10 minutes and a 35-minute budget, the first two tasks fit. At 19 minutes, only the first fits. At 10 minutes, stop at the first task, even though a later task would fit. Try a zero budget, an empty list and a task with a negative estimate. Verify the result by calling buildPlan without capturing console output.",
					projectLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/cee78b27b76c7c4d596a3df3463491c7e4e981cb/DPC-25-dpc12-capstone-studio-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/cee78b27b76c7c4d596a3df3463491c7e4e981cb/DPC-25-dpc12-capstone-studio-supplemental-2/solution"
				},
				{
					title: "Capstone Extension Practice",
					preserveInstructions: true,
					contentKind: "assignment",
					content:
						"The supply desk records requests by ID in arrival order. Extend submit to put an urgent request ahead of every ordinary request while maintaining arrival order within each group. An ID already in the queue is rejected and keeps its original position and priority. Work on the queue operation while leaving the display code unchanged.\n\n**Checkpoints:** Submit ordinary A, urgent B, ordinary C and urgent D. The result is B, D, A, C. Submit urgent A again and verify it returns false and the order stays fixed. Try an all-ordinary queue and an all-urgent queue and check that each keeps its original arrival order. Explain where the new insertion rule lives and how the existing duplicate rule still applies.",
					projectLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/cee78b27b76c7c4d596a3df3463491c7e4e981cb/DPC-26-dpc12-capstone-studio-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/cee78b27b76c7c4d596a3df3463491c7e4e981cb/DPC-26-dpc12-capstone-studio-supplemental-3/solution"
				}
			]
		},
		{
			title: "Pattern Lab 14: Ownership-Aware Refactor Studio",
			curriculum: [
				{
					title: "Ownership-Aware Refactor Concepts",
					preserveInstructions: true,
					preserveAssignment: true,
					contentKind: "reading",
					content:
						"A repair bench owns an instrument after accept moves its unique pointer into the vector. The function takes the handle by value, so the caller has to move it. Find returns a read-only borrowed pointer. The pointer does not extend the instrument’s lifetime."
				},
				{
					title: "Ownership Boundary Example",
					preserveInstructions: true,
					preserveAssignment: true,
					contentKind: "reading",
					content:
						"Trace a lute from make_unique through accept and find. The pointer variable in the caller becomes empty. The instrument itself keeps its address as the vector grows because only its owning handles move. Once extract hands the instrument out, follow the returned handle to identify its new owner."
				},
				{
					title: "Ownership-Aware Refactor Project",
					preserveInstructions: true,
					contentKind: "assignment",
					content:
						"A repair bench owns instruments delivered to it. Complete Bench::accept to move a supplied unique pointer into the container. An empty handle is rejected. Find returns a borrowed read-only pointer. The caller may read it while the bench still owns that instrument.\n\n**Checkpoints:** Move a lute and a drum into the bench. Both incoming handles become empty and the original object addresses can be found by name. An absent name gives nullptr. Predict what happens when the vector grows and explain why moving the handles preserves the stored objects.",
					projectLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/ea7e8bb748261f637433157fa35d9c8bc4fa93f7/DPC-01-pattern-implementation-lab-14/starter",
					solutionLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/ea7e8bb748261f637433157fa35d9c8bc4fa93f7/DPC-01-pattern-implementation-lab-14/solution"
				},
				{
					title: "Ownership Refactor Review",
					preserveInstructions: true,
					preserveAssignment: true,
					contentKind: "reading",
					content:
						"Label the owner and borrower before accept, during find and after extract. Write which operation gives up ownership, which only observes, and where the instrument is destroyed. Verify that an absent name gives no handle and a second matching name can still be found after extracting the first."
				}
			],
			supplementalProjects: [
				{
					title: "Ownership Refactor Extension Challenge",
					preserveInstructions: true,
					contentKind: "assignment",
					content:
						"After accept is working, complete extract. Find the first matching instrument, move its handle to the return value, and erase the vacated entry. Return an empty handle when the name is missing. Keep unrelated entries in their original order.\n\n**Checkpoints:** Remove the lute, then look up the drum and try removing an absent name. The reference prints the recovered name, two successful absence checks and the remaining drum. Use the returned handle to read the lute after extraction.",
					projectLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/ea7e8bb748261f637433157fa35d9c8bc4fa93f7/DPC-01-pattern-implementation-lab-14/starter",
					solutionLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/ea7e8bb748261f637433157fa35d9c8bc4fa93f7/DPC-01-pattern-implementation-lab-14/solution"
				},
				{
					title: "Ownership Refactor Transfer Practice",
					preserveInstructions: true,
					contentKind: "assignment",
					content:
						'An equipment desk owns a checkout record for the duration of a loan. A display receives a weak pointer so it can show the current record without owning it. Complete Display::show. Lock the weak pointer to read a live label and return "(returned)" when no record is live. Keep the owning handle local to the call.\n\n**Checkpoints:** Display a live tripod checkout, then reset the desk’s owning pointer. The display changes to "(returned)". Verify the owner count is one after show returns. Construct an empty display and verify it also reports "(returned)".',
					projectLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/3da74837443c3aa2a9b3e3c27bd9a5b1e15cc671/DPC-27-applied-studio-14-pattern-implementation-lab-14-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/3da74837443c3aa2a9b3e3c27bd9a5b1e15cc671/DPC-27-applied-studio-14-pattern-implementation-lab-14-supplemental-2/solution"
				},
				{
					title: "Ownership Refactor Extension Practice",
					preserveInstructions: true,
					contentKind: "assignment",
					content:
						"A palette exposes a dynamically allocated array through Buffer, a unique pointer with a custom deleter. Implement open so a nonzero size produces a zero-initialized int array paired with CountRelease. A zero size yields an empty Buffer. The release counter must outlive every buffer.\n\n**Checkpoints:** Write a value to a three-slot buffer and move it into another handle. The moved-from handle becomes empty. Reset only the new owner and verify the counter increments once. Destroy an empty buffer and test a second independently allocated buffer.",
					projectLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/3da74837443c3aa2a9b3e3c27bd9a5b1e15cc671/DPC-28-applied-studio-14-pattern-implementation-lab-14-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/3da74837443c3aa2a9b3e3c27bd9a5b1e15cc671/DPC-28-applied-studio-14-pattern-implementation-lab-14-supplemental-3/solution"
				}
			]
		},
		{
			title: "Pattern Lab 15: Runtime Variation Studio",
			curriculum: [
				{
					title: "Runtime Variation Concepts",
					preserveInstructions: true,
					preserveAssignment: true,
					contentKind: "reading",
					content:
						"A Style is a runtime formatting dependency. The caller can construct a brief or detailed formatter and pass either to SignPrinter through the same interface. The printer delegates formatting and remains independent of the rules for each style."
				},
				{
					title: "Runtime Strategy Example",
					preserveInstructions: true,
					preserveAssignment: true,
					contentKind: "reading",
					content:
						"For Maps in room 4, Brief returns Maps and Detailed returns Maps (room 4). Trace both calls to text using the same input object. The printer borrows the current Style. Neither the caller’s exhibit nor the formatter’s lifetime changes during text."
				},
				{
					title: "Runtime Variation Project",
					preserveInstructions: true,
					contentKind: "assignment",
					content:
						"A gallery sign can show only a title or add its room number. SignPrinter receives a Style from its caller and borrows it. Complete text so it calls that style’s format method and returns the result. Keep selection outside the printer and keep both supplied styles alive while the printer uses them.\n\n**Checkpoints:** Pass the same print job to a brief style and a detailed style. For Maps in room 4 the formats are Maps and Maps (room 4). Add another job to confirm the printer uses the argument rather than a fixed room or title.",
					projectLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/ea7e8bb748261f637433157fa35d9c8bc4fa93f7/DPC-02-pattern-implementation-lab-15/starter",
					solutionLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/ea7e8bb748261f637433157fa35d9c8bc4fa93f7/DPC-02-pattern-implementation-lab-15/solution"
				},
				{
					title: "Runtime Variation Review",
					preserveInstructions: true,
					preserveAssignment: true,
					contentKind: "reading",
					content:
						"Use one job and two styles to check the formatting boundary. Then switch a printer’s style without changing the job. Add an independent style that counts calls, and compare that count with the number of print requests. Describe when passing a small function would give the caller the same flexibility."
				}
			],
			supplementalProjects: [
				{
					title: "Runtime Variation Extension Challenge",
					preserveInstructions: true,
					contentKind: "assignment",
					content:
						"After printing with both existing styles works, implement use to switch an existing printer to a new style. Keep the displayed job and both strategies unchanged. Switching back restores the original formatting.\n\n**Checkpoints:** Trace the same Maps sign through brief, detailed and brief formatting. Test a different title and room after each switch. The printer borrows the current strategy, so the strategy must outlive each use.",
					projectLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/ea7e8bb748261f637433157fa35d9c8bc4fa93f7/DPC-02-pattern-implementation-lab-15/starter",
					solutionLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/ea7e8bb748261f637433157fa35d9c8bc4fa93f7/DPC-02-pattern-implementation-lab-15/solution"
				},
				{
					title: "Runtime Variation Transfer Practice",
					preserveInstructions: true,
					contentKind: "assignment",
					content:
						"A print queue has a title and priority for each job. Complete ordered so it makes a copy of the jobs and applies the comparator supplied by its caller. Use a stable sort so jobs that compare equal keep their arrival order. Leave the original queue unchanged.\n\n**Checkpoints:** Order the jobs by title, then by descending priority. For Kim priority 2, Ada priority 1, and Bo priority 2, the title order is Ada, Bo, Kim and the priority order is Kim, Bo, Ada. Verify that the first queue still starts with Kim.",
					projectLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/3da74837443c3aa2a9b3e3c27bd9a5b1e15cc671/DPC-29-applied-studio-15-pattern-implementation-lab-15-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/3da74837443c3aa2a9b3e3c27bd9a5b1e15cc671/DPC-29-applied-studio-15-pattern-implementation-lab-15-supplemental-2/solution"
				},
				{
					title: "Runtime Variation Extension Practice",
					preserveInstructions: true,
					contentKind: "assignment",
					content:
						"A calibration session keeps caller-supplied rules as function objects. The session borrows no rule. Complete measure so it adds the active rule’s result to the stored total and returns the updated total. A replacement rule applies to future measurements. It leaves the accumulated total intact.\n\n**Checkpoints:** Start with the identity rule and measure 3. Replace the rule with one that adds 2 and measure 3 again. The totals are 3 and 8. Change the original offset variable after creating the replacement rule to verify it was captured by value. Swap back to identity and verify the total continues from 8.",
					projectLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/3da74837443c3aa2a9b3e3c27bd9a5b1e15cc671/DPC-30-applied-studio-15-pattern-implementation-lab-15-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/3da74837443c3aa2a9b3e3c27bd9a5b1e15cc671/DPC-30-applied-studio-15-pattern-implementation-lab-15-supplemental-3/solution"
				}
			]
		},
		{
			title: "Pattern Lab 16: Structural Boundary Studio",
			curriculum: [
				{
					title: "Structural Boundary Concepts",
					preserveInstructions: true,
					preserveAssignment: true,
					contentKind: "reading",
					content:
						"The desk and mail supply different representations of one seat request. A facade offers an entry point for each source. The mail adapter translates text to an integer. The shared reservation operation checks the guest name, seat range and occupancy exactly once per adapted request."
				},
				{
					title: "Adapter and Facade Boundary Example",
					preserveInstructions: true,
					preserveAssignment: true,
					contentKind: "reading",
					content:
						"A desk request for seat 2 enters reserve immediately. Mail text 3 becomes one numeric seat before reserve. Mail text 3x is rejected by the adapter. A duplicate seat reaches reserve and is rejected there regardless of which source supplied it. Compare where the three cases stop."
				},
				{
					title: "Structural Boundary Project",
					preserveInstructions: true,
					contentKind: "assignment",
					content:
						"A workshop receives seat requests at its desk and by mail. The desk passes a numeric seat, while mail supplies a seat as text. Both formats must reach reserve with one Guest value. Complete the mail adapter. Convert all characters to an integer and send the guest to the shared reservation operation.\n\n**Checkpoints:** A desk request for seat 2 and a mail request for seat 3 both work. Mail text 3x is invalid. A correctly formed request for an occupied seat fails regardless of source. The accepted guest list contains the same name and numeric seat for each format.",
					projectLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/ea7e8bb748261f637433157fa35d9c8bc4fa93f7/DPC-03-pattern-implementation-lab-16/starter",
					solutionLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/ea7e8bb748261f637433157fa35d9c8bc4fa93f7/DPC-03-pattern-implementation-lab-16/solution"
				},
				{
					title: "Structural Boundary Review",
					preserveInstructions: true,
					preserveAssignment: true,
					contentKind: "reading",
					content:
						"Record one accepted desk request, one accepted mail request and each kind of rejection. Keep a snapshot of the accepted list before a malformed or duplicate request and compare it afterward. Explain how a third request format can reuse the same validation, and support the explanation with one normal and one invalid sample."
				}
			],
			supplementalProjects: [
				{
					title: "Structural Boundary Extension Challenge",
					preserveInstructions: true,
					contentKind: "assignment",
					content:
						"After the two routes share validation, complete withdraw using only its seat argument. Return false for an absent reservation. After a successful withdrawal, either source can reserve that seat again.\n\n**Checkpoints:** Withdraw seat 2, try it again, and submit a new mail request for 2. The first withdrawal succeeds, the second fails, and the new guest takes the freed seat. Existing bookings are preserved.",
					projectLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/ea7e8bb748261f637433157fa35d9c8bc4fa93f7/DPC-03-pattern-implementation-lab-16/starter",
					solutionLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/ea7e8bb748261f637433157fa35d9c8bc4fa93f7/DPC-03-pattern-implementation-lab-16/solution"
				},
				{
					title: "Structural Boundary Transfer Practice",
					preserveInstructions: true,
					contentKind: "assignment",
					content:
						"A cutting list records pieces in centimetres. An older catalogue uses inches. Complete the InchCut adapter so it returns the same Cut structure as the metric path, preserves the label, and multiplies inches by 2.54. The report reads only normalized cuts.\n\n**Checkpoints:** The reference reports the metric Shelf (25.4 cm) and the ten-inch Door (25.4 cm) through one report function. Compare zero inches, half an inch and a larger value using a numeric tolerance. Keep unit conversion out of the report.",
					projectLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/3da74837443c3aa2a9b3e3c27bd9a5b1e15cc671/DPC-31-applied-studio-16-pattern-implementation-lab-16-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/3da74837443c3aa2a9b3e3c27bd9a5b1e15cc671/DPC-31-applied-studio-16-pattern-implementation-lab-16-supplemental-2/solution"
				},
				{
					title: "Structural Boundary Extension Practice",
					preserveInstructions: true,
					contentKind: "assignment",
					content:
						"A catalogue returns either a title or an empty optional for a missing number. Complete Memo::find so repeated lookups for an ID reuse the first result. Cache successful and missing results. The supplied clear operation resets the memo so the next lookup goes back to the catalogue.\n\n**Checkpoints:** Read title 7 twice and missing ID 9 twice. Exactly two source calls are needed before clearing. Clear, then read 7 and verify a third source call. Compare a recorded empty title with a missing ID.",
					projectLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/3da74837443c3aa2a9b3e3c27bd9a5b1e15cc671/DPC-32-applied-studio-16-pattern-implementation-lab-16-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/3da74837443c3aa2a9b3e3c27bd9a5b1e15cc671/DPC-32-applied-studio-16-pattern-implementation-lab-16-supplemental-3/solution"
				}
			]
		},
		{
			title: "Pattern Lab 17: Refactoring Capstone Studio",
			curriculum: [
				{
					title: "Refactoring Capstone Concepts",
					preserveInstructions: true,
					preserveAssignment: true,
					contentKind: "reading",
					content:
						"The kit report mixes counting with presentation in its original main function. Write down the two original lines before editing. Separate the count into a function that returns data so a test can inspect the counts without parsing console output."
				},
				{
					title: "Pattern Selection Example",
					preserveInstructions: true,
					preserveAssignment: true,
					contentKind: "reading",
					content:
						"The sample has two Ready rows of 2 and 3 and one Repair row of 1. The pure count returns 5 and 1, and print handles the output labels. Neither operation needs a class hierarchy. When the third state arrives, add its count to the summary and keep the old two-line report as the default."
				},
				{
					title: "Refactoring Capstone Project",
					preserveInstructions: true,
					contentKind: "assignment",
					content:
						"A classroom kit report counts ready pieces and pieces awaiting repair. The starter counts directly inside main. Move the counting into summarize and have main pass its result to print. Each record contributes its positive quantity to the corresponding category. Keep the supplied ready and repair output identical.\n\n**Checkpoints:** The sample combines two Ready rows (2 and 3) and one Repair row (1). Confirm the report stays ready=5 and repair=1. Test an empty input and a zero-quantity row by calling summarize independently from the printer.",
					projectLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/ea7e8bb748261f637433157fa35d9c8bc4fa93f7/DPC-04-pattern-implementation-lab-17/starter",
					solutionLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/ea7e8bb748261f637433157fa35d9c8bc4fa93f7/DPC-04-pattern-implementation-lab-17/solution"
				},
				{
					title: "Refactoring Capstone Review",
					preserveInstructions: true,
					preserveAssignment: true,
					contentKind: "reading",
					content:
						"Record the original command and exact two-line output, the same output after extraction, and the independent checks for empty and zero-quantity input. Keep the third state in a separate change. Explain why one additional case in the count and one output flag are sufficient for this extension."
				}
			],
			supplementalProjects: [
				{
					title: "Refactoring Capstone Extension Challenge",
					preserveInstructions: true,
					contentKind: "assignment",
					content:
						"After the original two counts are correct, include Retired as a third category. Expose retired in the returned summary and use print’s optional flag to show the third count only when requested. Preserve the ordinary two-line output.\n\n**Checkpoints:** Add three retired pieces and request the extended output. The last line is retired=3 and the original counts remain unchanged. A negative quantity contributes nothing. Run the original output check once again.",
					projectLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/ea7e8bb748261f637433157fa35d9c8bc4fa93f7/DPC-04-pattern-implementation-lab-17/starter",
					solutionLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/ea7e8bb748261f637433157fa35d9c8bc4fa93f7/DPC-04-pattern-implementation-lab-17/solution"
				},
				{
					title: "Refactoring Capstone Transfer Practice",
					preserveInstructions: true,
					contentKind: "assignment",
					content:
						"A schedule lists nondecreasing appointment minutes. Extract longGaps from the existing console loop. Return each consecutive gap that strictly exceeds the supplied threshold, in chronological order. An empty or one-appointment schedule produces no gaps. Keep the original console report unchanged.\n\n**Checkpoints:** For minutes 3, 6, 16 and 19 at threshold 5, the report is 10. At threshold 10 no gap qualifies. At threshold 2 the returned vector is 3, 10, 3. Try repeated minutes and verify the original schedule is unchanged.",
					projectLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/3da74837443c3aa2a9b3e3c27bd9a5b1e15cc671/DPC-33-applied-studio-17-pattern-implementation-lab-17-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/3da74837443c3aa2a9b3e3c27bd9a5b1e15cc671/DPC-33-applied-studio-17-pattern-implementation-lab-17-supplemental-2/solution"
				},
				{
					title: "Refactoring Capstone Extension Practice",
					preserveInstructions: true,
					contentKind: "assignment",
					content:
						"A document revision owns a sorted set of topic labels. Implement combined so it returns a fresh revision containing the union of both inputs. A label appears once even if both revisions contain it. Leave both inputs unchanged and keep reporting separate from the merge.\n\n**Checkpoints:** Merge draft and map with map and review. The result prints draft, map, review in order. Reversing the inputs gives the same labels. Merge with an empty revision and confirm that the input’s labels are preserved.",
					projectLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/3da74837443c3aa2a9b3e3c27bd9a5b1e15cc671/DPC-34-applied-studio-17-pattern-implementation-lab-17-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Design-Patterns-in-CPP/tree/3da74837443c3aa2a9b3e3c27bd9a5b1e15cc671/DPC-34-applied-studio-17-pattern-implementation-lab-17-supplemental-3/solution"
				}
			]
		}
	]
};

const DESIGN_PATTERNS_CPP_CORE_GUIDELINES =
	"https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines";
const DESIGN_PATTERNS_CPP_CTEST =
	"https://cmake.org/cmake/help/latest/guide/tutorial/Testing%20and%20CTest.html";
const DESIGN_PATTERNS_CPP_ASAN =
	"https://clang.llvm.org/docs/AddressSanitizer.html";
const DESIGN_PATTERNS_CPP_UBSAN =
	"https://clang.llvm.org/docs/UndefinedBehaviorSanitizer.html";

const DESIGN_PATTERNS_CPP_PRIMARY_TITLES = new Set([
	"DPC0 Setup and Tooling",
	"DPC1 Why Patterns Look Different in Modern C++",
	"DPC2 Design Foundations",
	"DPC3 Factory Method, Abstract Factory, and Builder",
	"DPC4 Strategy and Policy-Based Design",
	"DPC5 Observer and Event Flow",
	"DPC6 Decorator, Adapter, and Facade",
	"DPC7 Command and State",
	"DPC8 Composite and Iterator",
	"DPC9 Singleton, Global State, and Dependency Injection",
	"DPC10 Patterns for Resource Management",
	"DPC11 Legacy Refactoring Lab",
	"DPC12 Capstone Studio"
]);

const DESIGN_PATTERNS_CPP_FLOW: Record<
	string,
	{
		estimatedTime: string;
		keyBlocks: string[];
		flowNote: string;
	}
> = {
	"DPC0 Setup and Tooling": {
		estimatedTime: "3 sessions · 60–90 minutes each",
		keyBlocks: [
			"C++20 baseline",
			"CMake build",
			"CTest baseline",
			"warnings",
			"AddressSanitizer",
			"UndefinedBehaviorSanitizer"
		],
		flowNote:
			"Prove that one multi-file C++20 project configures, builds, tests, debugs, and passes warning and sanitizer gates before architecture work begins."
	},
	"DPC1 Why Patterns Look Different in Modern C++": {
		estimatedTime: "4 sessions · 60–90 minutes each",
		keyBlocks: [
			"ownership map",
			"value semantics",
			"borrowing",
			"Rule of Zero",
			"copy and move contract",
			"simpler counterfactual"
		],
		flowNote:
			"Start from ownership and value semantics, make copy and move behavior explicit, and introduce a named pattern only after a plain value, callable, or focused helper fails a real change scenario."
	},
	"DPC2 Design Foundations": {
		estimatedTime: "5 sessions · 60–90 minutes each",
		keyBlocks: [
			"interface contract",
			"virtual destruction",
			"object slicing",
			"const-correctness",
			"runtime polymorphism",
			"concept-constrained templates"
		],
		flowNote:
			"Build safe polymorphic boundaries, prevent slicing and destruction errors, and compare virtual dispatch with concept-constrained templates before selecting an extension mechanism."
	},
	"DPC3 Factory Method, Abstract Factory, and Builder": {
		estimatedTime: "5 sessions · 60–90 minutes each",
		keyBlocks: [
			"direct construction",
			"return-by-value",
			"unique ownership",
			"product families",
			"valid configuration",
			"failure guarantee"
		],
		flowNote:
			"Choose a creation technique from validity, family compatibility, ownership, and failure behavior, preferring direct construction or values until runtime variation earns factory machinery."
	},
	"DPC4 Strategy and Policy-Based Design": {
		estimatedTime: "5 sessions · 60–90 minutes each",
		keyBlocks: [
			"runtime Strategy",
			"callable strategy",
			"template policy",
			"concept contract",
			"dispatch cost",
			"test seam"
		],
		flowNote:
			"Implement the same variation with a virtual Strategy, a callable, and a constrained template policy, then select the smallest form that matches when the choice is known."
	},
	"DPC5 Observer and Event Flow": {
		estimatedTime: "5 sessions · 60–90 minutes each",
		keyBlocks: [
			"subscription lifetime",
			"RAII token",
			"weak ownership",
			"delivery order",
			"reentrancy",
			"listener failure"
		],
		flowNote:
			"Treat Observer as a lifetime and event-contract problem: make subscription ownership, delivery order, mutation during publication, and failure behavior testable."
	},
	"DPC6 Decorator, Adapter, and Facade": {
		estimatedTime: "5 sessions · 60–90 minutes each",
		keyBlocks: [
			"wrapper ownership",
			"Decorator order",
			"Adapter translation",
			"Facade workflow",
			"error boundary",
			"dependency containment"
		],
		flowNote:
			"Select a structural pattern from the boundary pressure, define ownership and failure translation, and prove that clients remain independent of wrapper and vendor details."
	},
	"DPC7 Command and State": {
		estimatedTime: "5 sessions · 60–100 minutes each",
		keyBlocks: [
			"command lifetime",
			"captured state",
			"undo contract",
			"legal transitions",
			"queue ownership",
			"failure recovery"
		],
		flowNote:
			"Model meaningful actions and state transitions while making queued-object lifetime, undo scope, invalid transitions, and partial failure explicit."
	},
	"DPC8 Composite and Iterator": {
		estimatedTime: "5 sessions · 60–100 minutes each",
		keyBlocks: [
			"tree ownership",
			"leaf and group contract",
			"traversal order",
			"iterator invalidation",
			"mutation policy",
			"snapshot tradeoff"
		],
		flowNote:
			"Build one owned heterogeneous tree, expose only the traversal contract clients need, and specify exactly when mutation invalidates iterators, references, or views."
	},
	"DPC9 Singleton, Global State, and Dependency Injection": {
		estimatedTime: "4 sessions · 60–90 minutes each",
		keyBlocks: [
			"global lifetime",
			"initialization order",
			"hidden dependency",
			"composition root",
			"test replacement",
			"teardown order"
		],
		flowNote:
			"Replace ambient process state with an application-owned composition root unless a documented process-wide invariant genuinely requires global lifetime."
	},
	"DPC10 Patterns for Resource Management": {
		estimatedTime: "5 sessions · 60–100 minutes each",
		keyBlocks: [
			"RAII handle",
			"Rule of Zero or Five",
			"exception guarantee",
			"move-only type",
			"pImpl boundary",
			"ownership cycle"
		],
		flowNote:
			"Design resource handles around deterministic cleanup, explicit copy and move semantics, stated exception guarantees, and stable implementation boundaries."
	},
	"DPC11 Legacy Refactoring Lab": {
		estimatedTime: "6 sessions · 60–100 minutes each",
		keyBlocks: [
			"characterization baseline",
			"ownership debt",
			"one-step refactor",
			"sanitizer gate",
			"stop condition",
			"rollback point"
		],
		flowNote:
			"Characterize observable behavior, repair ownership before abstraction, and refactor through small reversible steps that keep tests and sanitizer runs green."
	},
	"DPC12 Capstone Studio": {
		estimatedTime: "8–10 sessions · 60–120 minutes each",
		keyBlocks: [
			"behavior baseline",
			"ownership diagram",
			"change scenarios",
			"pattern decision records",
			"before-and-after evidence",
			"rollback packet"
		],
		flowNote:
			"Refactor one medium-sized C++ system from a protected behavioral and lifetime baseline, justify a small pattern set, and demonstrate that a target change became safer or simpler."
	}
};

function designPatternsCppOptionPath(title: string) {
	return /extension|capstone|challenge/i.test(title)
		? ("challenge" as const)
		: ("choice" as const);
}

function insertDesignPatternsCppItem(
	items: RawCourseModuleItem[],
	beforeTitle: string,
	item: RawCourseModuleItem
) {
	const index = items.findIndex(candidate => candidate.title === beforeTitle);
	if (index === -1) return [...items, item];
	return [...items.slice(0, index), item, ...items.slice(index)];
}

function decorateDesignPatternsCppModule(
	module: RawCourse["modules"][number]
): RawCourse["modules"][number] {
	const flow = DESIGN_PATTERNS_CPP_FLOW[module.title];
	let curriculum: RawCourseModuleItem[] = module.curriculum.map(item => ({
		...item,
		learningPath: "core" as const
	}));
	const coreProjectTitle = curriculum.at(-1)?.title ?? "";

	if (module.title === "DPC0 Setup and Tooling") {
		curriculum = insertDesignPatternsCppItem(curriculum, coreProjectTitle, {
			title: "Build, Test, Debug, and Sanitizer Course Contract",
			content: [
				"**Prerequisite:** Enter with C++ classes, inheritance, templates, standard containers, smart pointers, exceptions, separate compilation, and basic unit tests independently usable.",
				"**Baseline:** Configure and build the unedited starter with `cmake -S . -B cmake-build` and `cmake --build cmake-build`. The formatter includes three registered tests. Expect one to pass and two to fail before implementing the formatter. Run `ctest --test-dir cmake-build --output-on-failure`.",
				"**Safety gate:** Keep a warnings-as-errors teaching configuration plus separate AddressSanitizer and UndefinedBehaviorSanitizer configurations. Record any platform-specific unsupported check rather than silently skipping the gate.",
				"**Delivery:** Commit the green build-and-test baseline separately from architecture changes so every later refactor remains reviewable and reversible."
			].join("\n"),
			projectLink: DESIGN_PATTERNS_CPP_CTEST,
			solutionLink: DESIGN_PATTERNS_CPP_ASAN,
			learningPath: "core"
		});
	}

	if (module.title === "DPC1 Why Patterns Look Different in Modern C++") {
		curriculum = insertDesignPatternsCppItem(curriculum, coreProjectTitle, {
			title: "Ownership, Lifetime, and Special-Member Contract",
			content: [
				"Draw each important object's owner, borrowers, and destruction point. Prefer values and the Rule of Zero; use `unique_ptr` for exclusive dynamic ownership and `shared_ptr` only when independently shared lifetime is a real requirement.",
				"",
				"If a type directly manages a resource, define whether it is copyable, move-only, or immovable; implement the complete Rule-of-Five contract when required; and test self-assignment, move transfer, destruction, and a valid moved-from state. Raw pointers and references represent borrowing, never hidden ownership."
			].join("\n"),
			projectLink: DESIGN_PATTERNS_CPP_CORE_GUIDELINES,
			learningPath: "core"
		});
		curriculum = insertDesignPatternsCppItem(curriculum, coreProjectTitle, {
			title: "Pattern Cost and Simpler Counterfactual",
			content: [
				"State one realistic future change, the simplest design that handles it, and the evidence that design no longer contains the pressure. Compare a named pattern with a value, free function, lambda, standard-library component, or small composed object.",
				"",
				"Record added types, indirection, ownership edges, compile dependencies, runtime dispatch, and test setup. Include a removal trigger so an abstraction can be retired when its variation disappears."
			].join("\n"),
			projectLink: DESIGN_PATTERNS_CPP_CORE_GUIDELINES,
			learningPath: "core"
		});
	}

	if (module.title === "DPC2 Design Foundations") {
		curriculum = insertDesignPatternsCppItem(curriculum, coreProjectTitle, {
			title: "Polymorphic Base, Destruction, and Slicing Contract",
			content: [
				"A polymorphic base has either a public virtual destructor or a protected non-virtual destructor. Prevent accidental slicing by passing polymorphic objects through references or owning handles and by suppressing public copy and move when value copying cannot preserve dynamic type.",
				"",
				"Define `const` access, nullability, ownership transfer, exception behavior, and whether cloning is supported before exposing the interface. Test destruction through the intended handle and reject a raw owning pointer at the boundary."
			].join("\n"),
			projectLink: DESIGN_PATTERNS_CPP_CORE_GUIDELINES,
			learningPath: "core"
		});
		curriculum = insertDesignPatternsCppItem(curriculum, coreProjectTitle, {
			title: "Virtual Dispatch versus Constrained Template Boundary",
			content: [
				"Use virtual dispatch for runtime-selected, open-ended implementations with stable object identity or a stable ABI boundary. Use a callable or concept-constrained template when variation is known at compile time and exposing the concrete type is acceptable.",
				"",
				"Compare binary and compile-time coupling, error clarity, test substitution, code size, and plugin needs. The selected boundary must express the requirement rather than merely demonstrate a language feature."
			].join("\n"),
			projectLink: DESIGN_PATTERNS_CPP_CORE_GUIDELINES,
			learningPath: "core"
		});
	}

	if (module.title === "DPC3 Factory Method, Abstract Factory, and Builder") {
		curriculum = insertDesignPatternsCppItem(curriculum, coreProjectTitle, {
			title: "Factory Return, Validity, and Failure Contract",
			content: [
				"Return a value when the concrete result has natural value semantics, `unique_ptr<Base>` for exclusive runtime-polymorphic ownership, and `shared_ptr` only when callers truly share lifetime. Never return a raw owning pointer.",
				"",
				"Test invalid configuration, product-family compatibility, allocation or construction failure, and destruction after partial setup. A factory or builder leaves no leaked resource and never publishes a partially valid object."
			].join("\n"),
			projectLink: DESIGN_PATTERNS_CPP_CORE_GUIDELINES,
			learningPath: "core"
		});
	}

	if (module.title === "DPC4 Strategy and Policy-Based Design") {
		curriculum = insertDesignPatternsCppItem(curriculum, coreProjectTitle, {
			title: "Runtime, Callable, and Policy Evidence Matrix",
			content: [
				"Implement one rule as a virtual Strategy, a focused callable, and a concept-constrained template policy. Exercise the same examples and edge cases against all three forms.",
				"",
				"Choose from runtime replacement, captured state, stable ABI, compile-time validation, code size, build coupling, and test ergonomics. Record why the unused forms cost more than the selected one for this change scenario."
			].join("\n"),
			projectLink: DESIGN_PATTERNS_CPP_CORE_GUIDELINES,
			learningPath: "core"
		});
	}

	if (module.title === "DPC5 Observer and Event Flow") {
		curriculum = insertDesignPatternsCppItem(curriculum, coreProjectTitle, {
			title: "Subscription Token, Reentrancy, and Failure Contract",
			content: [
				"Return a move-only RAII subscription token whose destruction disconnects safely. Define whether the publisher owns listeners, borrows them, or observes them through `weak_ptr`; no callback may outlive its target.",
				"",
				"Test duplicate registration, removal during publication, a listener that subscribes another listener, expired targets, nested publication, ordering, and a throwing listener. State the thread that owns registration and delivery rather than implying thread safety."
			].join("\n"),
			projectLink: DESIGN_PATTERNS_CPP_CORE_GUIDELINES,
			learningPath: "core"
		});
	}

	if (module.title === "DPC6 Decorator, Adapter, and Facade") {
		curriculum = insertDesignPatternsCppItem(curriculum, coreProjectTitle, {
			title: "Structural Boundary Ownership and Error Contract",
			content: [
				"Declare whether each wrapper owns, borrows, or shares the wrapped object. Test nested Decorator order and destruction; keep vendor types, error codes, and resource handles behind Adapter; and make Facade rollback or partial-success behavior explicit.",
				"",
				"Clients depend only on the stable domain contract. Include one replacement fake to prove third-party details and wrapper construction do not leak across the boundary."
			].join("\n"),
			projectLink: DESIGN_PATTERNS_CPP_CORE_GUIDELINES,
			learningPath: "core"
		});
	}

	if (module.title === "DPC7 Command and State") {
		curriculum = insertDesignPatternsCppItem(curriculum, coreProjectTitle, {
			title: "Command Lifetime, Undo, and Transition Contract",
			content: [
				"Queued commands own immutable inputs or hold a lifetime-safe handle to every target; they never capture a dangling reference. Define whether execution is one-shot, repeatable, idempotent, cancelable, or compensating.",
				"",
				"Test illegal state transitions, failure halfway through a command, undo after later edits, bounded history, and destruction with queued work. Record which state is captured before execution and what cannot be reversed."
			].join("\n"),
			projectLink: DESIGN_PATTERNS_CPP_CORE_GUIDELINES,
			learningPath: "core"
		});
	}

	if (module.title === "DPC8 Composite and Iterator") {
		curriculum = insertDesignPatternsCppItem(curriculum, coreProjectTitle, {
			title: "Tree Ownership and Iterator Invalidation Contract",
			content: [
				"Choose one clear owner for every node and state whether child access returns a reference, pointer, iterator, view, or snapshot. Define depth-first or breadth-first order and whether traversal exposes leaves, groups, or both.",
				"",
				"Test empty trees, deep trees, removal of the current node, insertion during traversal, moved containers, and retained references. The iterator invalidation policy either prohibits mutation during traversal or documents exactly which iterators, references, and views become invalid."
			].join("\n"),
			projectLink: DESIGN_PATTERNS_CPP_CORE_GUIDELINES,
			learningPath: "core"
		});
	}

	if (
		module.title ===
		"DPC9 Singleton, Global State, and Dependency Injection"
	) {
		curriculum = insertDesignPatternsCppItem(curriculum, coreProjectTitle, {
			title: "Composition Root and Global-Lifetime Test",
			content: [
				"Create application services in one composition root, pass required collaborators explicitly, and destroy them in a visible order. A service locator that hides lookup behind a global function does not count as dependency injection.",
				"",
				"Before retaining process-wide state, prove why narrower ownership fails, define initialization and teardown order across translation units, state concurrency guarantees, and demonstrate test isolation with a replacement implementation."
			].join("\n"),
			projectLink: DESIGN_PATTERNS_CPP_CORE_GUIDELINES,
			learningPath: "core"
		});
	}

	if (module.title === "DPC10 Patterns for Resource Management") {
		curriculum = insertDesignPatternsCppItem(curriculum, coreProjectTitle, {
			title: "Rule of Zero or Five and Exception-Guarantee Contract",
			content: [
				"Prefer members that make the owning type obey the Rule of Zero. When a custom resource handle needs special members, implement the complete copyable or move-only contract, keep destruction non-throwing, and make ownership transfer visible.",
				"",
				"Name the no-throw, strong, or basic exception guarantee for acquisition, mutation, copy, and move. Test allocation or acquisition failure, self-assignment, move assignment over an existing resource, and cleanup after partial construction."
			].join("\n"),
			projectLink: DESIGN_PATTERNS_CPP_CORE_GUIDELINES,
			learningPath: "core"
		});
		curriculum = insertDesignPatternsCppItem(curriculum, coreProjectTitle, {
			title: "pImpl, Shared Ownership, and Cycle Contract",
			content: [
				"Define the out-of-line destructor, copy and move policy, incomplete-type boundary, and rebuild or ABI pressure that justifies `pImpl`. Do not add it when ordinary encapsulation already contains the change.",
				"",
				"For shared ownership, draw the graph and break back-edges with `weak_ptr`. Test expiration, cache eviction, teardown order, and prove that the final owner releases the resource."
			].join("\n"),
			projectLink: DESIGN_PATTERNS_CPP_CORE_GUIDELINES,
			learningPath: "core"
		});
	}

	if (module.title === "DPC11 Legacy Refactoring Lab") {
		curriculum = insertDesignPatternsCppItem(curriculum, coreProjectTitle, {
			title: "Characterization, Stop, and Rollback Contract",
			content: [
				"Capture output, return values, errors, state changes, and one resource-lifetime edge before editing. Commit the green tests and sanitizer result, then separate ownership repair from pattern introduction with one named transformation per commit.",
				"",
				"Stop when a test failure is unexplained, sanitizer output appears, ownership becomes less explicit, or the diff cannot be reviewed as one behavior-preserving step. Revert to the last green commit instead of layering another abstraction over uncertainty."
			].join("\n"),
			projectLink: DESIGN_PATTERNS_CPP_CTEST,
			solutionLink: DESIGN_PATTERNS_CPP_UBSAN,
			learningPath: "core"
		});
	}

	if (module.title === "DPC12 Capstone Studio") {
		curriculum = insertDesignPatternsCppItem(curriculum, coreProjectTitle, {
			title: "Capstone Gate: Behavior and Lifetime Baseline",
			content: [
				"Freeze representative success, failure, and cleanup behavior with CTest, deterministic fixtures, a documented build command, an ownership diagram, and AddressSanitizer plus UndefinedBehaviorSanitizer runs.",
				"",
				"Tag or commit this baseline before structural work. Every pattern refactor stays behavior-preserving until a separately named feature or bug-fix change is reviewed."
			].join("\n"),
			projectLink: DESIGN_PATTERNS_CPP_CTEST,
			solutionLink: DESIGN_PATTERNS_CPP_ASAN,
			learningPath: "core"
		});
		curriculum = insertDesignPatternsCppItem(curriculum, coreProjectTitle, {
			title: "Capstone Evidence and Rollback Packet",
			content: [
				"Deliver the original and final ownership maps, two realistic change scenarios, pattern decision records, the small commit sequence, green test and sanitizer evidence, and before-and-after measurements such as files touched, duplicated branches, build coupling, or setup required for a test.",
				"",
				"Demonstrate one runtime replacement or compile-time policy change, identify one pattern deliberately not used, name one remaining tradeoff, and retain a clear rollback point for every major structural choice."
			].join("\n"),
			projectLink: DESIGN_PATTERNS_CPP_UBSAN,
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
		supplementalProjects: module.supplementalProjects.map(item => ({
			...item,
			learningPath: designPatternsCppOptionPath(item.title)
		}))
	};
}

function buildDesignPatternsCppStudioAppendix(
	modules: RawCourse["modules"]
): RawCourse["modules"][number] {
	return {
		kind: "appendix",
		title: "Optional Applied C++ Pattern Studios",
		estimatedTime:
			"Choose one studio after its matching core module or use the refactoring studio after DPC11",
		keyBlocks: [
			"ownership refactor",
			"runtime variation",
			"structural boundary",
			"behavior preservation",
			"transfer scenario",
			"refactoring capstone"
		],
		curriculum: [
			{
				title: "Applied Studio Scope Guide",
				contentKind: "reading",
				preserveInstructions: true,
				preserveAssignment: true,
				content:
					"Choose an optional studio after the matching lesson. Build the starter and record its baseline. Verify the studio project before its extension challenge, then complete the review.\n\n- **Pattern Lab 14: Ownership-Aware Refactor Studio.** Choose after DPC2 or DPC10.\n- **Pattern Lab 15: Runtime Variation Studio.** Choose after DPC4.\n- **Pattern Lab 16: Structural Boundary Studio.** Choose after DPC6.\n- **Pattern Lab 17: Refactoring Capstone Studio.** Choose after DPC11.",
				learningPath: "core"
			}
		],
		supplementalProjects: modules.flatMap(module =>
			[...module.curriculum, ...module.supplementalProjects].map(
				item => ({
					...item,
					learningPath: designPatternsCppOptionPath(item.title)
				})
			)
		)
	};
}

const designPatternsCppPrimaryModules = designPatternsInCppSourceCourse.modules
	.filter(module => DESIGN_PATTERNS_CPP_PRIMARY_TITLES.has(module.title))
	.map(decorateDesignPatternsCppModule);
const designPatternsCppStudios = designPatternsInCppSourceCourse.modules.filter(
	module => !DESIGN_PATTERNS_CPP_PRIMARY_TITLES.has(module.title)
);

export const designPatternsInCppCourse: RawCourse = {
	...designPatternsInCppSourceCourse,
	modules: [
		...designPatternsCppPrimaryModules,
		buildDesignPatternsCppStudioAppendix(designPatternsCppStudios)
	]
};
