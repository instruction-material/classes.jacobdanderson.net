import type { RawCourse } from "./types";
import { buildImplementationLabGuidance } from "./implementationLabGuidance";
import { buildProjectGuidance } from "./projectGuidance";

const cSystemsEngineeringSourceCourse: RawCourse = {
	name: "C Systems Engineering",
	modules: [
		{
			title: "CSE0 Setup and Tooling",
			curriculum: [
				{
					title: "Preferred IDEs and Core Toolchain",
					content:
						"Standardize on portable C17 in `CLion` or `VS Code` and make the real requirement the underlying toolchain rather than the editor itself. Verify `clang --version`, `cmake --version`, and `lldb --version` or an equivalent GCC and GDB toolchain. Keep `-Wall -Wextra -Wpedantic` enabled, use `CTest` or an equivalent deterministic harness, and run AddressSanitizer/UndefinedBehaviorSanitizer or the closest supported diagnostic before the course depends on unsafe buffers, binary inspection, or dynamic allocation."
				},
				{
					title: "macOS and Windows Setup Walkthroughs",
					content:
						"On macOS, install Apple command-line tools with `xcode-select --install`, then confirm CMake and LLDB are available. On Windows, prefer WSL2 with Ubuntu so the compilation, filesystem, and debugger workflow stays close to the Unix-style environment used by the rest of the course."
				},
				{
					title: "Course Positioning and Prerequisites",
					content:
						"Position the course as the next low-level step after `C++ Level 2`, with C used to expose memory, representation, and data movement more directly. Already be comfortable with variables, loops, functions, arrays, pointers, and manual lifetime reasoning before the course adds stricter debugging and more explicit representation work."
				},
				{
					title: "Core Outcomes and Daily Working Habits",
					content:
						"By the end of the course, the expected outcome is reading binary and hexadecimal representations, using bitwise operators confidently, reasoning about layout and lifetime, and building small systems-style tools in C. Every unit pairs the abstract idea with a printed byte or memory view plus a short written explanation of why the code works."
				},
				{
					title: "CSE0 Setup and Tooling: Core Project",
					ideImport: true,
					content:
						"### Required project: C17 diagnostic readiness\n\n Open the learner pack after confirming the import. The site editor saves source; download and extract the ZIP for native compilation with Clang or GCC, CMake 3.20+, and LLDB or GDB. Read `reading.h`, then implement only `classify_reading` in `starter/main.c`: below 0 returns -1, 0 through 100 returns 0, above 100 returns 1. Direct comparisons avoid overflow at INT_MIN and INT_MAX. Preserve the driver, signature, and nine boundary fixtures in `tests.c`. The unfinished program builds but exits 78 and fails its contract test.\n\nFrom the extracted `starter` folder run `cmake -S . -B build -DCMAKE_BUILD_TYPE=Debug`, `cmake --build build`, `ctest --test-dir build --output-on-failure`, then `./build/cse0_starter`. Record tool versions and the five-reading trace. Add a predicted fixture, demonstrate that changing `> 100` to `>= 100` fails the boundary test, restore the correct code, and rebuild. Follow the included root `README.md` for a sanitizer build, a separate deliberate `unsafe_probe.c` diagnostic, and a debugger breakpoint. Save the attempt before opening the separate reference. Completion evidence is passing contract tests, the expected trace, the diagnostic report, and an explanation of the boundary. An instructor can pause at prediction, failure, correction, and comparison; the same sequence works independently.",
					projectLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/9c2ca21336c7667681091972a0abe9e55921f8fa/CSE-05-cse0-setup-and-tooling/starter",
					solutionLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/9c2ca21336c7667681091972a0abe9e55921f8fa/CSE-05-cse0-setup-and-tooling/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Engineering Notebook: Setup and Tooling",
					content:
						"Keep a short engineering notebook for setup and tooling that records the byte view, memory view, compiler or runtime evidence, and one plain-language explanation of why the code worked or failed. Focus especially on toolchain identity, compiler/debugger verification, and the difference between editing and building to build the habit of explaining systems behavior instead of only trusting output.",
					projectLink:
						"https://github.com/instruction-material/C-Systems-Engineering/blob/9c2ca21336c7667681091972a0abe9e55921f8fa/CSE-05-cse0-setup-and-tooling/README.md"
				},
				{
					title: "Setup and Tooling Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "C systems",
						moduleTitle: "CSE0 Setup and Tooling",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSE-01-cse0-setup-and-tooling-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSE-01-cse0-setup-and-tooling-supplemental-2/solution"
				},
				{
					title: "Setup and Tooling Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "C systems",
						moduleTitle: "CSE0 Setup and Tooling",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSE-02-cse0-setup-and-tooling-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSE-02-cse0-setup-and-tooling-supplemental-3/solution"
				}
			]
		},
		{
			title: "Unit 1: Why C for Systems Work",
			curriculum: [
				{
					title: "Translation Units, Compilation, and Linking",
					content:
						"C becomes useful for systems work once the source-file, object-file, and linked-program path is clear. Linking is not trivia for its own sake; it is the model that explains where declarations, definitions, and build artifacts live."
				},
				{
					title: "Runtime Model Compared to Higher-Level Languages",
					content:
						"Compare C's runtime model to higher-level environments that hide allocation, object layout, and dispatch details. C gives fewer automatic protections but a clearer view of data movement and memory representation, which is exactly why it is valuable for systems work."
				},
				{
					title: "Headers, Source Files, and Observable Build Boundaries",
					content:
						"Use a small multi-file example to show what belongs in a header versus a source file and why duplicate definitions or missing declarations produce concrete compiler or linker failures. This builds an engineering mindset around build boundaries rather than only around syntax."
				},
				{
					title: "Why This Course Uses Small Utilities Instead of Giant Apps",
					content:
						"Reinforce that the course is about engineering fundamentals: bytes, layout, parsing, invariants, and observability. Small CLI tools are a better classroom than oversized UI-heavy apps because each byte and each assumption can be inspected directly."
				},
				{
					title: "Unit 1: Why C for Systems Work: Core Project",
					ideImport: true,
					content:
						"### Required project: translation units and linking\n\n Reuse the reading-classification contract from setup to isolate a new skill: separate declarations in `reading.h` from definitions in `reading.c` and `labels.c`, and link them with the driver in `main.c`. The classifier is provided. Complete only `reading_label` in `starter/labels.c` so categories -1, 0, 1 map to below, within, above, and every other category maps to invalid. The incomplete learner function returns NULL, so the unfinished executable exits 78 and its tests fail. Preserve all six label fixtures and four cross-file cases in `tests.c`.\n\nConfirm the learner import, save it, download and extract the ZIP, and work from `starter`: `cmake -S . -B build -DCMAKE_BUILD_TYPE=Debug`, `cmake --build build`, `ctest --test-dir build --output-on-failure`, and `./build/cse1_link_starter`. Read the included root `README.md` for preprocessing, assembly, object-symbol inspection, debugger and sanitizer commands. Predict what each build stage produces, then reproduce and explain a missing-definition link failure and a duplicate-definition link failure in temporary builds. Restore all sources and pass the complete test suite. Save the attempt before opening the separate reference. Completion requires the category-label trace, passing tests, and evidence that declarations, definitions, object files, and the final executable have distinct jobs. An instructor can guide the predictions and failure explanations without changing the independent reading path.",
					projectLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/9c2ca21336c7667681091972a0abe9e55921f8fa/CSE-06-unit-1-why-c-for-systems-work/starter",
					solutionLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/9c2ca21336c7667681091972a0abe9e55921f8fa/CSE-06-unit-1-why-c-for-systems-work/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Engineering Notebook: Why C for Systems Work",
					content:
						"Keep a short engineering notebook for why C matters in systems work that records the byte view, memory view, compiler or runtime evidence, and one plain-language explanation of why the code worked or failed. Focus especially on source-to-binary boundaries, declarations vs definitions, and what the runtime model exposes to build the habit of explaining systems behavior instead of only trusting output.",
					projectLink:
						"https://github.com/instruction-material/C-Systems-Engineering/blob/9c2ca21336c7667681091972a0abe9e55921f8fa/CSE-06-unit-1-why-c-for-systems-work/README.md"
				},
				{
					title: "Translation Boundary Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "C systems",
						moduleTitle: "Unit 1: Why C for Systems Work",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSE-03-unit-1-why-c-for-systems-work-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSE-03-unit-1-why-c-for-systems-work-supplemental-2/solution"
				},
				{
					title: "Translation Boundary Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "C systems",
						moduleTitle: "Unit 1: Why C for Systems Work",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSE-04-unit-1-why-c-for-systems-work-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSE-04-unit-1-why-c-for-systems-work-supplemental-3/solution"
				}
			]
		},
		{
			title: "Unit 2: Binary, Hex, and Number Representation",
			curriculum: [
				{
					title: "Bits, Nibbles, Bytes, and Words",
					content:
						"Binary representation starts with physical groupings: bits form nibbles, nibbles form bytes, and bytes are the practical units that keep appearing in memory dumps and file formats. This removes the intimidation factor from later byte-level work."
				},
				{
					title: "Decimal, Binary, and Hex Conversions",
					content:
						"Practice converting small values across decimal, binary, and hexadecimal until moving between representations no longer depends on guessing. Hex works as a readable shorthand for groups of four bits, not as an unrelated numbering system."
				},
				{
					title: "Signed vs Unsigned Integers and Two's Complement",
					content:
						"The same 16 bits can name one unsigned value and one signed value. Connect that idea to two's complement and the meaning of the top bit, then explain signedness as an interpretation rule rather than as a different kind of memory."
				},
				{
					title: "Project: Hex and Binary Inspector",
					content:
						"Use the inspector lab to print one value in decimal, hex, and grouped binary, then compare its signed and unsigned 16-bit interpretations. The project makes two's complement visible and requires explicit reasoning about nibbles and bytes instead of hand-waving about 'the number.'",
					projectLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSE1-Hex-and-Binary-Inspector/starter",
					solutionLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSE1-Hex-and-Binary-Inspector/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Engineering Notebook: Binary, Hex, and Number Representation",
					content:
						"Keep a short engineering notebook for binary, hex, and number representation that records the byte view, memory view, compiler or runtime evidence, and one plain-language explanation of why the code worked or failed. Focus especially on signedness, top-bit meaning, and how grouped bits map cleanly to hex digits to build the habit of explaining systems behavior instead of only trusting output.",
					projectLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSE1-Hex-and-Binary-Inspector/starter",
					solutionLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSE1-Hex-and-Binary-Inspector/solution"
				},
				{
					title: "Representation Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "C systems",
						moduleTitle:
							"Unit 2: Binary, Hex, and Number Representation",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSE-05-unit-2-binary-hex-and-number-representation-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSE-05-unit-2-binary-hex-and-number-representation-supplemental-2/solution"
				},
				{
					title: "Representation Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "C systems",
						moduleTitle:
							"Unit 2: Binary, Hex, and Number Representation",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSE-06-unit-2-binary-hex-and-number-representation-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSE-06-unit-2-binary-hex-and-number-representation-supplemental-3/solution"
				}
			]
		},
		{
			title: "Unit 3: Bitwise Operations",
			curriculum: [
				{
					title: "AND, OR, XOR, NOT, and Shifts",
					content:
						"Bitwise operators are data-shaping tools, not abstract truth tables alone. Track what gets cleared with AND, what gets set with OR, what toggles with XOR, and why left and right shifts only make sense when they describe the bit movement clearly."
				},
				{
					title: "Masking, Flag Extraction, and Bit Packing",
					content:
						"Use realistic packed bytes and small protocol-style fields to show why systems code compresses multiple meanings into one byte or word. The emphasis is on reading and writing masks deliberately, not on memorizing operator precedence without context."
				},
				{
					title: "XOR as a Reversible Byte-Level Transform",
					content:
						"Give XOR special attention because it shows up in parity, toggling, checksums, and simple reversible transforms. Explain in plain language why `x ^ k ^ k` returns the original byte instead of treating XOR as a magic classroom trick."
				},
				{
					title: "Project: Bitflag Configuration Parser",
					content:
						"Use the bitflag parser to unpack a compact configuration byte into readable feature toggles and a small mode field. The key lesson is that one byte can carry multiple meanings safely when the masks and shifts are explicit.",
					projectLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSE2-Bitflag-Configuration-Parser/starter",
					solutionLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSE2-Bitflag-Configuration-Parser/solution"
				},
				{
					title: "Project: XOR Encoder Decoder",
					content:
						"Use the XOR lab to compare the original bytes, encoded bytes, and decoded bytes for the same message. Explain why the transform is reversible and what XOR is really doing to each bit.",
					projectLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSE3-XOR-Encoder-Decoder/starter",
					solutionLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSE3-XOR-Encoder-Decoder/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Engineering Notebook: Bitwise Operations",
					content:
						"Keep a short engineering notebook for bitwise operations that records the byte view, memory view, compiler or runtime evidence, and one plain-language explanation of why the code worked or failed. Focus especially on mask design, packed fields, and why each operator changes the bits the way it does to build the habit of explaining systems behavior instead of only trusting output.",
					projectLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSE2-Bitflag-Configuration-Parser/starter",
					solutionLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSE2-Bitflag-Configuration-Parser/solution"
				},
				{
					title: "Bitmask Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "C systems",
						moduleTitle: "Unit 3: Bitwise Operations",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSE-07-unit-3-bitwise-operations-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSE-07-unit-3-bitwise-operations-supplemental-2/solution"
				},
				{
					title: "Bitmask Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "C systems",
						moduleTitle: "Unit 3: Bitwise Operations",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSE-08-unit-3-bitwise-operations-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSE-08-unit-3-bitwise-operations-supplemental-3/solution"
				}
			]
		},
		{
			title: "Unit 4: Memory and Layout",
			curriculum: [
				{
					title: "Addresses and Pointer Arithmetic",
					content:
						"Use arrays and pointer arithmetic to show that addresses move in element-sized steps rather than in vague 'next item' intuition. Connect pointer movement directly to type size and memory layout."
				},
				{
					title: "Stack vs Heap vs Static Storage",
					content:
						"The main storage regions have different lifetime stories: static data lasts for the process, stack data follows scope, and heap data follows explicit allocation and free rules. This framing pays off later when bugs are really lifetime mistakes with visible memory consequences."
				},
				{
					title: "Alignment, Padding, Arrays, and Struct Layout",
					content:
						"Struct layout becomes measurable with `sizeof`, `offsetof`, and printed addresses. Padding and alignment are concrete layout decisions that can be observed directly rather than treated as mysterious compiler behavior."
				},
				{
					title: "Project: Memory Visualizer for Arrays and Structs",
					content:
						"Use the memory visualizer to print stack, heap, and static addresses alongside member offsets in a small struct. Identify likely padding and explain why adjacent array elements move by one element size rather than one byte.",
					projectLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSE4-Memory-Visualizer/starter",
					solutionLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSE4-Memory-Visualizer/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Engineering Notebook: Memory and Layout",
					content:
						"Keep a short engineering notebook for memory and layout that records the byte view, memory view, compiler or runtime evidence, and one plain-language explanation of why the code worked or failed. Focus especially on storage duration, member offsets, and why alignment changes total struct size to build the habit of explaining systems behavior instead of only trusting output.",
					projectLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSE4-Memory-Visualizer/starter",
					solutionLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSE4-Memory-Visualizer/solution"
				},
				{
					title: "Memory Layout Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "C systems",
						moduleTitle: "Unit 4: Memory and Layout",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSE-09-unit-4-memory-and-layout-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSE-09-unit-4-memory-and-layout-supplemental-2/solution"
				},
				{
					title: "Memory Layout Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "C systems",
						moduleTitle: "Unit 4: Memory and Layout",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSE-10-unit-4-memory-and-layout-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSE-10-unit-4-memory-and-layout-supplemental-3/solution"
				}
			]
		},
		{
			title: "Unit 5: Strings and Byte Buffers",
			curriculum: [
				{
					title: "C Strings vs Raw Byte Arrays",
					content:
						"C strings are one special convention built on top of bytes: a sequence terminated by `\\0`. A byte buffer is not automatically a string, and treating arbitrary bytes like text is a fast path to truncated reads or misleading output."
				},
				{
					title: "Length vs Capacity and Null Termination",
					content:
						"Separate the number of meaningful characters from the size of the allocated buffer. Explain why a destination buffer needs capacity-aware copying and where the terminator ends up after a safe copy."
				},
				{
					title: "Safe Copy Patterns and Byte Dumps",
					content:
						"Model fixed-buffer copy rules that preserve space for the terminator and then inspect the actual bytes after the copy. This makes the difference between 'I think it copied safely' and 'I can prove what is in memory' much more concrete."
				},
				{
					title: "Project: Byte Buffer Workbench",
					content:
						"Use the byte-buffer lab to compare a safe fixed-size text copy with a raw packet buffer that contains non-text bytes and an embedded zero. The project requires a clear justification for why `strlen` is valid for one buffer and a bad assumption for the other.",
					projectLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSE5-Byte-Buffer-Workbench/starter",
					solutionLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSE5-Byte-Buffer-Workbench/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Engineering Notebook: Strings and Byte Buffers",
					content:
						"Keep a short engineering notebook for strings and byte buffers that records the byte view, memory view, compiler or runtime evidence, and one plain-language explanation of why the code worked or failed. Focus especially on terminators, capacity checks, and why byte dumps tell a truer story than text output alone to build the habit of explaining systems behavior instead of only trusting output.",
					projectLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSE5-Byte-Buffer-Workbench/starter",
					solutionLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSE5-Byte-Buffer-Workbench/solution"
				},
				{
					title: "Byte Buffer Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "C systems",
						moduleTitle: "Unit 5: Strings and Byte Buffers",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSE-11-unit-5-strings-and-byte-buffers-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSE-11-unit-5-strings-and-byte-buffers-supplemental-2/solution"
				},
				{
					title: "Byte Buffer Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "C systems",
						moduleTitle: "Unit 5: Strings and Byte Buffers",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSE-12-unit-5-strings-and-byte-buffers-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSE-12-unit-5-strings-and-byte-buffers-supplemental-3/solution"
				}
			]
		},
		{
			title: "Unit 6: Files, Streams, and Parsing",
			curriculum: [
				{
					title: "FILE Pointers, Buffered I O, and Binary vs Text Modes",
					content:
						"`FILE *` is the basic stream handle for structured reading and writing. The important decisions are when text parsing is appropriate, when binary formats are more stable, and why checking return values matters more than assuming the file behaved as expected."
				},
				{
					title: "Reading Structured Data One Field at a Time",
					content:
						"Use small record formats to show why systems code often reads fields explicitly instead of trusting compiler-dependent struct layout on disk. This connects file parsing directly to endianness, checksums, and later protocol work."
				},
				{
					title: "Checksums, Validation, and Parse Boundaries",
					content:
						"Validation is part of parsing, not an optional afterthought. Reject bad magic values, mismatched checksums, or truncated records before treating bytes as trustworthy data."
				},
				{
					title: "Project: Packet Serializer Deserializer",
					content:
						"Use the packet lab to write a compact record into an explicit little-endian byte format, then validate and parse it back into readable fields. The lesson is that stable on-the-wire or on-disk formats come from explicit serialization, not from dumping a struct blindly.",
					projectLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSE6-Packet-Serializer-Deserializer/starter",
					solutionLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSE6-Packet-Serializer-Deserializer/solution"
				},
				{
					title: "Project: Fixed Size Log File Reader",
					content:
						"Use the log-reader lab to generate a small binary log file, read each fixed-size record through `FILE *`, and validate its checksum before printing a summary. This makes binary parsing, validation, and repeated record handling visible in one place.",
					projectLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSE8-Fixed-Size-Log-File-Reader/starter",
					solutionLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSE8-Fixed-Size-Log-File-Reader/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Engineering Notebook: Files, Streams, and Parsing",
					content:
						"Keep a short engineering notebook for files, streams, and parsing that records the byte view, memory view, compiler or runtime evidence, and one plain-language explanation of why the code worked or failed. Focus especially on record boundaries, validation order, and why bad input must be rejected before decoding proceeds to build the habit of explaining systems behavior instead of only trusting output.",
					projectLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSE6-Packet-Serializer-Deserializer/starter",
					solutionLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSE6-Packet-Serializer-Deserializer/solution"
				},
				{
					title: "Parser Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "C systems",
						moduleTitle: "Unit 6: Files, Streams, and Parsing",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSE-13-unit-6-files-streams-and-parsing-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSE-13-unit-6-files-streams-and-parsing-supplemental-2/solution"
				},
				{
					title: "Parser Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "C systems",
						moduleTitle: "Unit 6: Files, Streams, and Parsing",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSE-14-unit-6-files-streams-and-parsing-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSE-14-unit-6-files-streams-and-parsing-supplemental-3/solution"
				}
			]
		},
		{
			title: "Unit 7: Dynamic Memory and Lifetime",
			curriculum: [
				{
					title: "malloc, calloc, realloc, and free",
					content:
						"Heap allocation calls are explicit ownership decisions instead of generic ways to 'make more memory.' Track which call zeroes memory, which one resizes an existing region, and why every successful allocation needs a clear path to cleanup."
				},
				{
					title: "Ownership and Lifetime Invariants",
					content:
						"Frame lifetime as an invariant story: who owns the allocation, who may borrow it temporarily, and when the program considers it invalid. This prepares for reasoning about leaks, invalid frees, and stale pointers before those bugs become difficult to debug."
				},
				{
					title: "Leaks, Double Frees, and Invalid Access",
					content:
						"Use small examples to show how heap bugs usually come from broken lifetime rules rather than from the allocator itself being mysterious. Describe each failure in terms of ownership and cleanup instead of only saying the program crashed."
				},
				{
					title: "Project: Dynamic Ring Buffer",
					content:
						"Use the ring-buffer lab to make heap ownership concrete with allocation, resize logic, queue state, and cleanup. The project requires head, count, capacity, and final `free` responsibilities to stay explicit.",
					projectLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSE7-Dynamic-Ring-Buffer/starter",
					solutionLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSE7-Dynamic-Ring-Buffer/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Engineering Notebook: Dynamic Memory and Lifetime",
					content:
						"Keep a short engineering notebook for dynamic memory and lifetime that records the byte view, memory view, compiler or runtime evidence, and one plain-language explanation of why the code worked or failed. Focus especially on allocation ownership, resize rules, and what cleanup path makes the data structure safe to destroy to build the habit of explaining systems behavior instead of only trusting output.",
					projectLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSE7-Dynamic-Ring-Buffer/starter",
					solutionLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSE7-Dynamic-Ring-Buffer/solution"
				},
				{
					title: "Lifetime Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "C systems",
						moduleTitle: "Unit 7: Dynamic Memory and Lifetime",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSE-15-unit-7-dynamic-memory-and-lifetime-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSE-15-unit-7-dynamic-memory-and-lifetime-supplemental-2/solution"
				},
				{
					title: "Lifetime Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "C systems",
						moduleTitle: "Unit 7: Dynamic Memory and Lifetime",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSE-16-unit-7-dynamic-memory-and-lifetime-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSE-16-unit-7-dynamic-memory-and-lifetime-supplemental-3/solution"
				}
			]
		},
		{
			title: "Unit 8: Function Pointers and Dispatch",
			curriculum: [
				{
					title: "Callbacks and Function Pointer Basics",
					content:
						"Function pointers are stored behavior: one part of the program can call another indirectly. The practical model is callbacks, handlers, and code selected by data rather than exotic syntax games."
				},
				{
					title: "Dispatch Tables and State Machines",
					content:
						"A table of handlers or a small state machine can replace long chains of conditionals once a program starts reacting to modes, commands, or parsed tokens. This keeps the lesson engineering-focused and ties directly to protocol parsing or event-driven systems."
				},
				{
					title: "Event-Driven Patterns at a Beginner-Friendly Scale",
					content:
						"Use tiny examples such as a command decoder or mode-driven output formatter to make dispatch observable. The point is to show how systems code often maps values to actions explicitly instead of hiding all behavior in one large control block."
				},
				{
					title: "Design Exercise: Command Handler Table",
					content:
						"Sketch a command table for a toy parser and explain which inputs map to which handlers. The exercise makes indirect control flow understandable before larger programs introduce more complicated dispatch."
				},
				{
					title: "Unit 8: Function Pointers and Dispatch: Core Project",
					content: buildProjectGuidance({
						courseFamily: "C systems",
						moduleTitle: "Unit 8: Function Pointers and Dispatch",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSE-07-unit-8-function-pointers-and-dispatch/starter",
					solutionLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSE-07-unit-8-function-pointers-and-dispatch/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Engineering Notebook: Function Pointers and Dispatch",
					content:
						"Keep a short engineering notebook for function pointers and dispatch that records the byte view, memory view, compiler or runtime evidence, and one plain-language explanation of why the code worked or failed. Focus especially on which values select which handlers and why a dispatch table can be clearer than a giant if-else chain to build the habit of explaining systems behavior instead of only trusting output.",
					projectLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSE-07-unit-8-function-pointers-and-dispatch/starter",
					solutionLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSE-07-unit-8-function-pointers-and-dispatch/solution"
				},
				{
					title: "Dispatch Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "C systems",
						moduleTitle: "Unit 8: Function Pointers and Dispatch",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSE-17-unit-8-function-pointers-and-dispatch-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSE-17-unit-8-function-pointers-and-dispatch-supplemental-2/solution"
				},
				{
					title: "Dispatch Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "C systems",
						moduleTitle: "Unit 8: Function Pointers and Dispatch",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSE-18-unit-8-function-pointers-and-dispatch-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSE-18-unit-8-function-pointers-and-dispatch-supplemental-3/solution"
				}
			]
		},
		{
			title: "Unit 9: Data Structures in C",
			curriculum: [
				{
					title: "Dynamic Arrays, Linked Lists, and Ring Buffers",
					content:
						"Compare the main beginner-friendly C data structures by the questions they answer well: contiguous storage, cheap appends, cheap front removal, or stable node insertion. Justify the structure choice instead of treating every container as a generic list."
				},
				{
					title: "Hash Tables at a Beginner-Friendly Level",
					content:
						"Hash tables can be viewed conceptually as key-to-slot mapping with collision handling, without turning the lesson into a full algorithm course. Systems tools often need fast lookup, and C makes the storage, collision, and ownership tradeoffs visible."
				},
				{
					title: "Data Structure Invariants Are Part of the Design",
					content:
						"Name invariants such as valid count ranges, non-null storage after initialization, or head and tail relationships. This helps debug the structure by reasoning about what must stay true, not only by staring at code."
				},
				{
					title: "Project Pass: Extend the Dynamic Ring Buffer",
					content:
						"Return to the ring-buffer lab and use it as the main data-structure case study for invariants, queue order, and resizing behavior. Treat the structure as a maintained system with rules, not as a one-off container that 'seems to work.'",
					projectLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSE7-Dynamic-Ring-Buffer/starter",
					solutionLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSE7-Dynamic-Ring-Buffer/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Engineering Notebook: Data Structures in C",
					content:
						"Keep a short engineering notebook for data structures in C that records the byte view, memory view, compiler or runtime evidence, and one plain-language explanation of why the code worked or failed. Focus especially on container choice, invariants, and what evidence shows the structure is preserving logical order to build the habit of explaining systems behavior instead of only trusting output.",
					projectLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSE7-Dynamic-Ring-Buffer/starter",
					solutionLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSE7-Dynamic-Ring-Buffer/solution"
				},
				{
					title: "Structure Invariants Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "C systems",
						moduleTitle: "Unit 9: Data Structures in C",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSE-19-unit-9-data-structures-in-c-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSE-19-unit-9-data-structures-in-c-supplemental-2/solution"
				},
				{
					title: "Structure Invariants Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "C systems",
						moduleTitle: "Unit 9: Data Structures in C",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSE-20-unit-9-data-structures-in-c-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSE-20-unit-9-data-structures-in-c-supplemental-3/solution"
				}
			]
		},
		{
			title: "Unit 10: Engineering Math in Code",
			curriculum: [
				{
					title: "Fixed Point Thinking Instead of Immediate Floats",
					content:
						"Represent some physical quantities in scaled integers when exact decimal storage is not available or when deterministic transforms matter. This keeps the math connected to systems constraints instead of assuming floating-point is always the default answer."
				},
				{
					title: "Overflow-Aware Arithmetic and Range Checks",
					content:
						"Think about maximum values before multiplying, shifting, or converting units. Systems code often fails not because the formula is wrong, but because the input range was never checked before the formula ran."
				},
				{
					title: "Unit Conversion Reliability",
					content:
						"Use temperature, voltage, or timing conversions to show why a conversion routine is an engineering artifact, not just a math exercise. Validate ranges, choose units deliberately, and explain the scaling used in the code."
				},
				{
					title: "Numeric Error and Approximation",
					content:
						"Some transforms are exact and some are approximations, especially when integer division or fixed-point rounding is involved. The important skill is to state the approximation clearly and bound the expected error."
				},
				{
					title: "Unit 10: Engineering Math in Code: Core Project",
					content: buildProjectGuidance({
						courseFamily: "C systems",
						moduleTitle: "Unit 10: Engineering Math in Code",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSE-08-unit-10-engineering-math-in-code/starter",
					solutionLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSE-08-unit-10-engineering-math-in-code/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Engineering Notebook: Engineering Math in Code",
					content:
						"Keep a short engineering notebook for engineering math in code that records the byte view, memory view, compiler or runtime evidence, and one plain-language explanation of why the code worked or failed. Focus especially on scaling choices, overflow checks, and why the chosen units make the transform safer to reason about.",
					projectLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSE-08-unit-10-engineering-math-in-code/starter",
					solutionLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSE-08-unit-10-engineering-math-in-code/solution"
				},
				{
					title: "Numeric Reliability Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "C systems",
						moduleTitle: "Unit 10: Engineering Math in Code",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSE-21-unit-10-engineering-math-in-code-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSE-21-unit-10-engineering-math-in-code-supplemental-2/solution"
				},
				{
					title: "Numeric Reliability Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "C systems",
						moduleTitle: "Unit 10: Engineering Math in Code",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSE-22-unit-10-engineering-math-in-code-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSE-22-unit-10-engineering-math-in-code-supplemental-3/solution"
				}
			]
		},
		{
			title: "Unit 11: Systems Tooling",
			curriculum: [
				{
					title: "Compiler Flags and Warning Discipline",
					content:
						"Treat compiler flags as engineering policy rather than optional noise. Use `-Wall`, `-Wextra`, and `-Wpedantic`, then treat warnings as evidence of assumptions that need to be checked before the code deserves trust."
				},
				{
					title: "Debuggers, Sanitizers, and Evidence-Driven Diagnosis",
					content:
						"`lldb` or `gdb` plus sanitizers make low-level bugs easier to understand by pointing at the exact failing access or bad lifetime event. Observation and reproduction replace guess-and-retry debugging with evidence."
				},
				{
					title: "Binary Inspection with objdump and nm",
					content:
						"`objdump` or `llvm-objdump` and `nm` inspect the built artifact itself. Systems engineering includes observing the binary, not only the source, especially when symbols, sections, or compiled layout choices need confirmation."
				},
				{
					title: "Tooling Pass on a Real Utility",
					content:
						"Use one of the earlier projects to inspect warnings, run under the debugger, and compare the file bytes or symbols against the source expectations. This keeps the tooling lesson grounded in familiar course code rather than in synthetic debugging puzzles."
				},
				{
					title: "Unit 11: Systems Tooling: Core Project",
					content: buildProjectGuidance({
						courseFamily: "C systems",
						moduleTitle: "Unit 11: Systems Tooling",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSE-09-unit-11-systems-tooling/starter",
					solutionLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSE-09-unit-11-systems-tooling/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Engineering Notebook: Systems Tooling",
					content:
						"Keep a short engineering notebook for systems tooling that records the byte view, memory view, compiler or runtime evidence, and one plain-language explanation of why the code worked or failed. Focus especially on which tool produced the most useful evidence for a given bug or observation and why to build the habit of explaining systems behavior instead of only trusting output.",
					projectLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSE-09-unit-11-systems-tooling/starter",
					solutionLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSE-09-unit-11-systems-tooling/solution"
				},
				{
					title: "Tooling Evidence Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "C systems",
						moduleTitle: "Unit 11: Systems Tooling",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSE-23-unit-11-systems-tooling-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSE-23-unit-11-systems-tooling-supplemental-2/solution"
				},
				{
					title: "Tooling Evidence Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "C systems",
						moduleTitle: "Unit 11: Systems Tooling",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSE-24-unit-11-systems-tooling-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSE-24-unit-11-systems-tooling-supplemental-3/solution"
				}
			]
		},
		{
			title: "Unit 12: Capstone Engineering Utility",
			curriculum: [
				{
					title: "Scope a Robust CLI Utility",
					content:
						"Frame the capstone as a careful utility that reads structured input, validates it, transforms it, and writes trustworthy output. The challenge is not adding every possible feature; it is building a small tool whose invariants and failure-mode scenarios are clearly understood."
				},
				{
					title: "Read Input, Validate Early, Transform Deliberately",
					content:
						"Validate each row or record before it enters the main transform path. This is the capstone version of the whole course philosophy: bytes and fields become trusted data only after the code has checked the boundaries and assumptions explicitly."
				},
				{
					title: "Write Output That Another Tool Could Trust",
					content:
						"Produce normalized output with stable formatting, explicit derived fields, and clear handling of invalid input. The capstone feels like a utility another engineer could actually use or extend rather than like a classroom printout."
				},
				{
					title: "Project: Capstone Telemetry Transform CLI",
					content:
						"Use the capstone CLI to read structured telemetry input, validate ranges, apply fixed-point transforms, and write normalized output. This project ties together representation, parsing, validation, numeric care, and low-level engineering habits in one small but defensible utility.",
					projectLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSE9-Capstone-Telemetry-Transform-CLI/starter",
					solutionLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSE9-Capstone-Telemetry-Transform-CLI/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Engineering Notebook: Capstone Engineering Utility",
					content:
						"Keep a short engineering notebook for the capstone engineering utility that records the byte view, memory view, compiler or runtime evidence, and one plain-language explanation of why the code worked or failed. Focus especially on input validation order, derived-field logic, and why the final output format is trustworthy.",
					projectLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSE9-Capstone-Telemetry-Transform-CLI/starter",
					solutionLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSE9-Capstone-Telemetry-Transform-CLI/solution"
				},
				{
					title: "Capstone Utility Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "C systems",
						moduleTitle: "Unit 12: Capstone Engineering Utility",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSE-25-unit-12-capstone-engineering-utility-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSE-25-unit-12-capstone-engineering-utility-supplemental-2/solution"
				},
				{
					title: "Capstone Utility Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "C systems",
						moduleTitle: "Unit 12: Capstone Engineering Utility",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSE-26-unit-12-capstone-engineering-utility-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSE-26-unit-12-capstone-engineering-utility-supplemental-3/solution"
				}
			]
		},
		{
			title: "Systems Build 14: Byte Inspector Studio",
			curriculum: [
				{
					title: "Byte Inspector Studio: Core Concepts",
					content: buildImplementationLabGuidance({
						courseFamily: "C systems",
						moduleTitle: "Systems Build 14: Byte Inspector Studio",
						section: "concepts"
					})
				},
				{
					title: "Byte Inspector Studio: Guided Example",
					content: buildImplementationLabGuidance({
						courseFamily: "C systems",
						moduleTitle: "Systems Build 14: Byte Inspector Studio",
						section: "example"
					})
				},
				{
					title: "Byte Inspector Studio: Core Project",
					content: buildImplementationLabGuidance({
						courseFamily: "C systems",
						moduleTitle: "Systems Build 14: Byte Inspector Studio",
						section: "coreProject"
					}),
					projectLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSE-01-systems-build-14/starter",
					solutionLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSE-01-systems-build-14/solution"
				},
				{
					title: "Byte Inspector Studio: Review",
					content: buildImplementationLabGuidance({
						courseFamily: "C systems",
						moduleTitle: "Systems Build 14: Byte Inspector Studio",
						section: "review"
					})
				}
			],
			supplementalProjects: [
				{
					title: "Byte Inspector Studio: Extension Challenge",
					content: buildImplementationLabGuidance({
						courseFamily: "C systems",
						moduleTitle: "Systems Build 14: Byte Inspector Studio",
						section: "extension"
					}),
					projectLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSE-01-systems-build-14/starter",
					solutionLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSE-01-systems-build-14/solution"
				},
				{
					title: "Byte Inspector Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "C systems",
						moduleTitle: "Systems Build 14: Byte Inspector Studio",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSE-27-applied-studio-14-systems-build-14-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSE-27-applied-studio-14-systems-build-14-supplemental-2/solution"
				},
				{
					title: "Byte Inspector Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "C systems",
						moduleTitle: "Systems Build 14: Byte Inspector Studio",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSE-28-applied-studio-14-systems-build-14-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSE-28-applied-studio-14-systems-build-14-supplemental-3/solution"
				}
			]
		},
		{
			title: "Systems Build 15: Memory Layout Studio",
			curriculum: [
				{
					title: "Memory Layout Studio: Core Concepts",
					content: buildImplementationLabGuidance({
						courseFamily: "C systems",
						moduleTitle: "Systems Build 15: Memory Layout Studio",
						section: "concepts"
					})
				},
				{
					title: "Memory Layout Studio: Guided Example",
					content: buildImplementationLabGuidance({
						courseFamily: "C systems",
						moduleTitle: "Systems Build 15: Memory Layout Studio",
						section: "example"
					})
				},
				{
					title: "Memory Layout Studio: Core Project",
					content: buildImplementationLabGuidance({
						courseFamily: "C systems",
						moduleTitle: "Systems Build 15: Memory Layout Studio",
						section: "coreProject"
					}),
					projectLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSE-02-systems-build-15/starter",
					solutionLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSE-02-systems-build-15/solution"
				},
				{
					title: "Memory Layout Studio: Review",
					content: buildImplementationLabGuidance({
						courseFamily: "C systems",
						moduleTitle: "Systems Build 15: Memory Layout Studio",
						section: "review"
					})
				}
			],
			supplementalProjects: [
				{
					title: "Memory Layout Studio: Extension Challenge",
					content: buildImplementationLabGuidance({
						courseFamily: "C systems",
						moduleTitle: "Systems Build 15: Memory Layout Studio",
						section: "extension"
					}),
					projectLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSE-02-systems-build-15/starter",
					solutionLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSE-02-systems-build-15/solution"
				},
				{
					title: "Memory Layout Studio Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "C systems",
						moduleTitle: "Systems Build 15: Memory Layout Studio",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSE-29-applied-studio-15-systems-build-15-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSE-29-applied-studio-15-systems-build-15-supplemental-2/solution"
				},
				{
					title: "Memory Layout Studio Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "C systems",
						moduleTitle: "Systems Build 15: Memory Layout Studio",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSE-30-applied-studio-15-systems-build-15-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSE-30-applied-studio-15-systems-build-15-supplemental-3/solution"
				}
			]
		},
		{
			title: "Systems Build 16: Binary Parser Studio",
			curriculum: [
				{
					title: "Binary Parser Studio: Core Concepts",
					content: buildImplementationLabGuidance({
						courseFamily: "C systems",
						moduleTitle: "Systems Build 16: Binary Parser Studio",
						section: "concepts"
					})
				},
				{
					title: "Binary Parser Studio: Guided Example",
					content: buildImplementationLabGuidance({
						courseFamily: "C systems",
						moduleTitle: "Systems Build 16: Binary Parser Studio",
						section: "example"
					})
				},
				{
					title: "Binary Parser Studio: Core Project",
					content: buildImplementationLabGuidance({
						courseFamily: "C systems",
						moduleTitle: "Systems Build 16: Binary Parser Studio",
						section: "coreProject"
					}),
					projectLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSE-03-systems-build-16/starter",
					solutionLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSE-03-systems-build-16/solution"
				},
				{
					title: "Binary Parser Studio: Review",
					content: buildImplementationLabGuidance({
						courseFamily: "C systems",
						moduleTitle: "Systems Build 16: Binary Parser Studio",
						section: "review"
					})
				}
			],
			supplementalProjects: [
				{
					title: "Binary Parser Studio: Extension Challenge",
					content: buildImplementationLabGuidance({
						courseFamily: "C systems",
						moduleTitle: "Systems Build 16: Binary Parser Studio",
						section: "extension"
					}),
					projectLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSE-03-systems-build-16/starter",
					solutionLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSE-03-systems-build-16/solution"
				},
				{
					title: "Binary Parser Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "C systems",
						moduleTitle: "Systems Build 16: Binary Parser Studio",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSE-31-applied-studio-16-systems-build-16-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSE-31-applied-studio-16-systems-build-16-supplemental-2/solution"
				},
				{
					title: "Binary Parser Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "C systems",
						moduleTitle: "Systems Build 16: Binary Parser Studio",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSE-32-applied-studio-16-systems-build-16-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSE-32-applied-studio-16-systems-build-16-supplemental-3/solution"
				}
			]
		},
		{
			title: "Systems Build 17: Capstone Utility Studio",
			curriculum: [
				{
					title: "Capstone Utility Studio: Core Concepts",
					content: buildImplementationLabGuidance({
						courseFamily: "C systems",
						moduleTitle:
							"Systems Build 17: Capstone Utility Studio",
						section: "concepts"
					})
				},
				{
					title: "Capstone Utility Studio: Guided Example",
					content: buildImplementationLabGuidance({
						courseFamily: "C systems",
						moduleTitle:
							"Systems Build 17: Capstone Utility Studio",
						section: "example"
					})
				},
				{
					title: "Capstone Utility Studio: Core Project",
					content: buildImplementationLabGuidance({
						courseFamily: "C systems",
						moduleTitle:
							"Systems Build 17: Capstone Utility Studio",
						section: "coreProject"
					}),
					projectLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSE-04-systems-build-17/starter",
					solutionLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSE-04-systems-build-17/solution"
				},
				{
					title: "Capstone Utility Studio: Review",
					content: buildImplementationLabGuidance({
						courseFamily: "C systems",
						moduleTitle:
							"Systems Build 17: Capstone Utility Studio",
						section: "review"
					})
				}
			],
			supplementalProjects: [
				{
					title: "Capstone Utility Studio: Extension Challenge",
					content: buildImplementationLabGuidance({
						courseFamily: "C systems",
						moduleTitle:
							"Systems Build 17: Capstone Utility Studio",
						section: "extension"
					}),
					projectLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSE-04-systems-build-17/starter",
					solutionLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSE-04-systems-build-17/solution"
				},
				{
					title: "Capstone Utility Studio Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "C systems",
						moduleTitle:
							"Systems Build 17: Capstone Utility Studio",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSE-33-applied-studio-17-systems-build-17-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSE-33-applied-studio-17-systems-build-17-supplemental-2/solution"
				},
				{
					title: "Capstone Utility Studio Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "C systems",
						moduleTitle:
							"Systems Build 17: Capstone Utility Studio",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSE-34-applied-studio-17-systems-build-17-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/C-Systems-Engineering/tree/main/CSE-34-applied-studio-17-systems-build-17-supplemental-3/solution"
				}
			]
		}
	]
};

interface CSystemsModuleFlow {
	estimatedTime: string;
	flowNote: string;
	keyBlocks: string[];
}

const C_SYSTEMS_PRIMARY_MODULE_COUNT = 13;

const C_SYSTEMS_OPTIONAL_CURRICULUM = new Set([
	"Project: XOR Encoder Decoder",
	"Project: Fixed Size Log File Reader"
]);

const C_SYSTEMS_MODULE_FLOW: Record<string, CSystemsModuleFlow> = {
	"CSE0 Setup and Tooling": {
		estimatedTime: "2–3 sessions · 45–60 minutes each",
		keyBlocks: [
			"C17 / CMake",
			"warnings",
			"sanitizers",
			"CTest",
			"debug evidence"
		],
		flowNote:
			"Establish one clean C17 configure/build/test path before any unsafe-memory exercise. Record the exact warning and sanitizer commands, prove that a deterministic test fails on a controlled regression, and connect one debugger or diagnostic observation to a correction."
	},
	"Unit 1: Why C for Systems Work": {
		estimatedTime: "2–3 sessions · 45–60 minutes each",
		keyBlocks: [
			"translation unit",
			"declaration / definition",
			"object file",
			"link boundary",
			"clean rebuild"
		],
		flowNote:
			"Trace one source file through preprocessing, compilation, object output, and linking, then split a small utility across a header and source file. Reproduce and explain one missing-symbol and one duplicate-definition failure before completing a clean rebuild."
	},
	"Unit 2: Binary, Hex, and Number Representation": {
		estimatedTime: "2–3 sessions · 45–60 minutes each",
		keyBlocks: [
			"bit / byte",
			"hex grouping",
			"fixed-width integer",
			"two's complement",
			"representation check"
		],
		flowNote:
			"Use `stdint.h` fixed-width types and make the bit width explicit in every interpretation. Check zero, one, all-one, sign-bit, minimum, and maximum fixtures and distinguish an object representation from the mathematical value it is being used to encode."
	},
	"Unit 3: Bitwise Operations": {
		estimatedTime: "3 sessions · 45–60 minutes each",
		keyBlocks: [
			"mask",
			"shift width",
			"unsigned operation",
			"packed field",
			"round-trip check"
		],
		flowNote:
			"Design each mask from a labeled bit layout, perform shifts on appropriate unsigned fixed-width values, and reject out-of-range field values before packing. The bitflag parser is required; the XOR encoder is an optional transfer build after set, clear, toggle, extract, and round-trip cases pass."
	},
	"Unit 4: Memory and Layout": {
		estimatedTime: "3 sessions · 45–60 minutes each",
		keyBlocks: [
			"storage duration",
			"sizeof / offsetof",
			"alignment",
			"padding",
			"portable claim"
		],
		flowNote:
			"Measure layout rather than assuming it. Compare arrays and structs with `sizeof`, `offsetof`, and addresses, then label which observations are guaranteed by C and which are implementation-specific; never serialize by dumping a struct's in-memory bytes."
	},
	"Unit 5: Strings and Byte Buffers": {
		estimatedTime: "3–4 sessions · 45–60 minutes each",
		keyBlocks: [
			"length / capacity",
			"null termination",
			"binary-safe API",
			"bounds check",
			"byte dump"
		],
		flowNote:
			"Carry pointer plus explicit capacity or length at every buffer boundary. Verify empty, exact-fit, one-byte-short, embedded-zero, nonterminated, and binary-data fixtures and use `strlen` only after termination is established within the available capacity."
	},
	"Unit 6: Files, Streams, and Parsing": {
		estimatedTime: "4–5 sessions · 45–60 minutes each",
		keyBlocks: [
			"checked I/O",
			"explicit endianness",
			"record boundary",
			"checksum",
			"atomic acceptance"
		],
		flowNote:
			"Specify the byte format before implementing it and decode fields only after bounds, magic, version, length, and checksum checks succeed. Test truncation at every field boundary, extra bytes, unsupported version, checksum failure, and clean round trip; the repeated log reader is a choice after the packet parser is correct."
	},
	"Unit 7: Dynamic Memory and Lifetime": {
		estimatedTime: "4–5 sessions · 45–60 minutes each",
		keyBlocks: [
			"owner / borrower",
			"allocation failure",
			"realloc safety",
			"ring invariant",
			"sanitizer-clean teardown"
		],
		flowNote:
			"Write the owner, borrower, and cleanup rule before allocation. Preserve the original pointer when `realloc` fails, check multiplication and capacity growth for overflow, and verify empty, full, wraparound, growth, allocation-failure, repeated clear, and final teardown behavior under diagnostics."
	},
	"Unit 8: Function Pointers and Dispatch": {
		estimatedTime: "3 sessions · 45–60 minutes each",
		keyBlocks: [
			"function signature",
			"dispatch table",
			"validated index",
			"state transition",
			"unknown command"
		],
		flowNote:
			"Keep every callback signature explicit and validate command or mode values before indexing a dispatch table. Prove each handler, unknown input, null handler, invalid state transition, and deterministic output while comparing the table with a simpler `switch` for the current scale."
	},
	"Unit 9: Data Structures in C": {
		estimatedTime: "4 sessions · 45–60 minutes each",
		keyBlocks: [
			"container contract",
			"representation invariant",
			"ownership",
			"operation cost",
			"failure preservation"
		],
		flowNote:
			"Select a structure from the operations and ownership it needs rather than from familiarity. Extend the ring buffer only after documenting head/count/capacity rules, then check boundary operations, failed growth, ordering after wraparound, cleanup, and the expected cost of each public operation."
	},
	"Unit 10: Engineering Math in Code": {
		estimatedTime: "3–4 sessions · 45–60 minutes each",
		keyBlocks: [
			"fixed-point scale",
			"checked arithmetic",
			"rounding policy",
			"unit contract",
			"error bound"
		],
		flowNote:
			"Define units, scale, valid input range, rounding, and saturation or rejection behavior before arithmetic. Check for overflow before signed operations, use a justified wider intermediate where available, and test minimum, maximum, zero, negative, rounding-boundary, and invalid-range cases."
	},
	"Unit 11: Systems Tooling": {
		estimatedTime: "3 sessions · 45–60 minutes each",
		keyBlocks: [
			"warning policy",
			"debugger",
			"sanitizer",
			"nm / objdump",
			"evidence notebook"
		],
		flowNote:
			"Treat this as a consolidation and binary-forensics pass because warnings and diagnostics have been active since setup. Run an earlier utility through the debugger and sanitizer, inspect symbols or sections with the available `nm`/`objdump` equivalent, and explain which artifact confirms each source-level claim."
	},
	"Unit 12: Capstone Engineering Utility": {
		estimatedTime: "6–8 sessions · 45–60 minutes each",
		keyBlocks: [
			"input contract",
			"validated transform",
			"stable output",
			"failure rollback",
			"reproducible fixture"
		],
		flowNote:
			"Build the telemetry utility in vertical slices around a documented input and output contract. No unvalidated record mutates accepted state or replaces trusted output; complete the course with warning-clean, sanitizer-clean, reproducible normal, boundary, malformed, overflow, truncated, and I/O-failure fixtures."
	}
};

function cSystemsSupplementalPath(title: string) {
	return /extension|challenge|xor encoder|log file reader/i.test(title)
		? ("challenge" as const)
		: ("choice" as const);
}

function decorateCSystemsModule(
	module: RawCourse["modules"][number]
): RawCourse["modules"][number] {
	const flow = C_SYSTEMS_MODULE_FLOW[module.title];
	const optionalCurriculum = module.curriculum.filter(item =>
		C_SYSTEMS_OPTIONAL_CURRICULUM.has(item.title)
	);
	const curriculum = module.curriculum
		.filter(item => !C_SYSTEMS_OPTIONAL_CURRICULUM.has(item.title))
		.map((item, index) => ({
			...item,
			content:
				index === 0
					? `**Course flow:** ${flow.flowNote}\n\n${item.content}`
					: item.content,
			learningPath: "core" as const
		}));

	if (module.title === "CSE0 Setup and Tooling") {
		curriculum.push({
			title: "CSE0 Project 0: C17 Safety Toolchain Readiness",
			content: [
				"**Completion evidence:**",
				"- Compiler, debugger, and CMake versions plus a documented C17 configure/build/test path from a clean checkout.",
				"- Warning-clean output using `-Wall -Wextra -Wpedantic` or the closest supported equivalent.",
				"- AddressSanitizer/UndefinedBehaviorSanitizer or equivalent diagnostic detecting one isolated unsafe fixture, followed by a corrected clean run.",
				"- A deterministic test that exits unsuccessfully when a controlled regression is introduced."
			].join("\n"),
			learningPath: "core"
		});
	}

	if (module.title === "Unit 12: Capstone Engineering Utility") {
		curriculum.push({
			title: "CSE12 Capstone Completion Contract",
			content: [
				"**Completion evidence:**",
				"- Versioned input/output format, clean C17 build, deterministic test command, and sample fixture from a fresh checkout.",
				"- Cases for empty input, valid record, minimum and maximum accepted values, malformed field, unsupported version, bad checksum, truncation at each field boundary, extra bytes, overflow attempt, and failed output write.",
				"- Previous trusted output remains intact after rejected input or write failure, and all temporary allocations and files are cleaned up.",
				"- Warning-clean and sanitizer-clean results plus one byte-level trace, one corrected failure, and one portability limitation."
			].join("\n"),
			learningPath: "core"
		});
	}

	return {
		...module,
		estimatedTime: flow.estimatedTime,
		keyBlocks: flow.keyBlocks,
		curriculum,
		supplementalProjects: [
			...optionalCurriculum.map(item => ({
				...item,
				learningPath: cSystemsSupplementalPath(item.title)
			})),
			...module.supplementalProjects.map(item => ({
				...item,
				learningPath: cSystemsSupplementalPath(item.title)
			}))
		]
	};
}

function buildOptionalSystemsStudioArchive(
	modules: RawCourse["modules"]
): RawCourse["modules"][number] {
	return {
		kind: "appendix",
		title: "Optional Systems Build and Transfer Archive",
		estimatedTime: "Choose individual studios as needed",
		keyBlocks: [
			"byte inspection",
			"memory layout",
			"binary parser",
			"capstone transfer",
			"evidence review"
		],
		curriculum: [
			{
				title: "Systems Studio Archive Guide",
				content:
					"**Course flow:** Systems Build 14: Byte Inspector Studio, Systems Build 15: Memory Layout Studio, Systems Build 16: Binary Parser Studio, and Systems Build 17: Capstone Utility Studio are optional transfer and extension work for units already completed in the required path. Select a studio when its matching byte, layout, parser, or utility evidence needs another pass; completing every archived studio is not required.",
				learningPath: "core"
			}
		],
		supplementalProjects: modules.flatMap(module =>
			[...module.curriculum, ...module.supplementalProjects].map(
				item => ({
					...item,
					learningPath: cSystemsSupplementalPath(item.title)
				})
			)
		)
	};
}

const cSystemsPrimaryModules = cSystemsEngineeringSourceCourse.modules
	.slice(0, C_SYSTEMS_PRIMARY_MODULE_COUNT)
	.map(decorateCSystemsModule);
const cSystemsArchiveModules = cSystemsEngineeringSourceCourse.modules.slice(
	C_SYSTEMS_PRIMARY_MODULE_COUNT
);

export const cSystemsEngineeringCourse: RawCourse = {
	...cSystemsEngineeringSourceCourse,
	modules: [
		...cSystemsPrimaryModules,
		buildOptionalSystemsStudioArchive(cSystemsArchiveModules)
	]
};
