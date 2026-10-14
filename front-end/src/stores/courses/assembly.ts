import type { RawCourse } from "./types";
import { assemblyArrayProjectReading } from "./assemblyArrayProjectReading";
import { assemblyCalculatorProjectReading } from "./assemblyCalculatorProjectReading";
import { assemblyCompilerProjectReading } from "./assemblyCompilerProjectReading";
import { assemblyHelperProjectReading } from "./assemblyHelperProjectReading";
import { assemblyOpeningProjectReading } from "./assemblyOpeningProjectReading";
import { assemblyParserProjectReading } from "./assemblyParserProjectReading";
import { assemblyReverseProjectReading } from "./assemblyReverseProjectReading";
import { assemblyStackProjectReading } from "./assemblyStackProjectReading";
import { assemblyStringProjectReading } from "./assemblyStringProjectReading";
import { buildImplementationLabGuidance } from "./implementationLabGuidance";
import { buildProjectGuidance } from "./projectGuidance";

const assemblySourceCourse: RawCourse = {
	name: "Assembly",
	modules: [
		{
			title: "ASM0 Setup and Tooling",
			curriculum: [
				{
					title: "Preferred IDEs and Core Toolchain",
					content:
						"Standardize the executable course on an `x86-64 Linux` environment using the System V AMD64 ABI, GNU/Clang `.S` files with `.intel_syntax noprefix`, and a consistent C compiler, assembler, linker, debugger, `objdump`, and `CMake`/`CTest` workflow. `CLion` or `VS Code` may edit the files, but the exact target triple, ABI, syntax, build command, and disassembly syntax stay fixed so traces are comparable."
				},
				{
					title: "macOS and Windows Walkthroughs",
					content:
						"On Windows, use an x86-64 WSL2 Linux distribution. On macOS—especially Apple Silicon—use a supported x86-64 Linux VM or remote lab environment for the required path rather than mixing native ARM64 instructions, Mach-O conventions, or the Apple ABI into Linux examples. Native ARM64 comparison belongs in the optional archive after the baseline traces are stable."
				},
				{
					title: "Architecture Choice and Syntax Policy",
					content:
						"Use `x86-64 assembly` first because the debugger support, desktop relevance, and reverse-engineering value are strong for a first course. The required path writes GNU/Clang `.S` source with `.intel_syntax noprefix` and follows the System V AMD64 ABI on Linux. AT&T syntax, NASM syntax, Windows x64 conventions, Mach-O, and ARM64 are recognized as distinct variants rather than silently mixed into active code."
				},
				{
					title: "Audience, Prerequisites, and Core Outcomes",
					content:
						"Position the course after `C Systems Engineering` or equivalent low-level C work. Already be comfortable with pointers, structs, stack versus heap, compilation, and debugger basics before the course asks them to read registers, trace stack frames, and explain calling conventions at the instruction level."
				},
				{
					title: "Core Project: Build and Trace a Linux x86-64 Function",
					id: "assembly-asm0-setup-and-tooling-curriculum-core-project-assembly",
					ideImport: true,
					content: assemblyOpeningProjectReading,
					projectLink:
						"https://github.com/instruction-material/Assembly/tree/117e34fb8ff90c2046da71090c37e7b45ef20624/ASM-04-asm0-setup-and-tooling/starter",
					solutionLink:
						"https://github.com/instruction-material/Assembly/tree/117e34fb8ff90c2046da71090c37e7b45ef20624/ASM-04-asm0-setup-and-tooling/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Register-Trace Worksheet: Setup and Tooling",
					content:
						"Use a focused trace worksheet for setup and tooling that records the key registers, flag changes, memory addresses, and one plain-language explanation of why the control flow moved the way it did. Focus especially on toolchain identity, architecture choice, and why x86-64 is the starting point for the course so the worksheet narrates instruction flow rather than only skimming mnemonics. A complete entry records the instruction address, the value before the instruction, the value after the instruction, and the evidence that explains the next branch, call, or return.",
					projectLink:
						"https://github.com/instruction-material/Assembly/blob/117e34fb8ff90c2046da71090c37e7b45ef20624/ASM-04-asm0-setup-and-tooling/README.md"
				},
				{
					title: "Setup and Tooling Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "assembly",
						moduleTitle: "ASM0 Setup and Tooling",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Assembly/tree/main/ASM-01-asm0-setup-and-tooling-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Assembly/tree/main/ASM-01-asm0-setup-and-tooling-supplemental-2/solution"
				},
				{
					title: "Setup and Tooling Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "assembly",
						moduleTitle: "ASM0 Setup and Tooling",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Assembly/tree/main/ASM-02-asm0-setup-and-tooling-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Assembly/tree/main/ASM-02-asm0-setup-and-tooling-supplemental-3/solution"
				}
			]
		},
		{
			title: "Unit 1: Machine Model and Toolchain",
			curriculum: [
				{
					title: "Assembler, Linker, Object Files, and Executables",
					content:
						"The assembly pipeline is an artifact flow: source becomes object code, object files become a linked executable, and each stage leaves evidence that can be inspected. Symbols, relocation entries, and disassembly output belong in that flow before large hand-written assembly routines are introduced."
				},
				{
					title: "Intel versus AT&T Syntax",
					content:
						"Explain operand ordering, immediate prefixes, register naming, and memory syntax differences between Intel and AT&T notation. The course writes Intel syntax, but the expected outcome is recognizing the same instruction in both forms so compiler output does not become unreadable."
				},
				{
					title: "Disassembly Workflow and Read-Before-Write Discipline",
					content:
						"Start from reading before writing. Disassemble tiny programs, identify function boundaries, spot prologues and epilogues, and only then begin writing their own routines so assembly feels observable rather than mystical."
				},
				{
					title: "C-to-Assembly Compare: Hello Function",
					content:
						"Start with a short C helper and its generated assembly before rewriting anything. Compile it with and without optimization, then identify the arguments, return value, and where the function begins and ends in the disassembly."
				},
				{
					title: "Unit 1: Machine Model and Toolchain: Core Project",
					content: buildProjectGuidance({
						courseFamily: "assembly",
						moduleTitle: "Unit 1: Machine Model and Toolchain",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Assembly/tree/main/ASM-05-unit-1-machine-model-and-toolchain/starter",
					solutionLink:
						"https://github.com/instruction-material/Assembly/tree/main/ASM-05-unit-1-machine-model-and-toolchain/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Register-Trace Worksheet: Machine Model and Toolchain",
					content:
						"Use a focused trace worksheet for machine model and toolchain that records the key registers, flag changes, memory addresses, and one plain-language explanation of why the control flow moved the way it did. Focus especially on source-to-object boundaries, symbol names, and how the disassembler reveals structure so the worksheet narrates instruction flow rather than only skimming mnemonics. A complete entry records the instruction address, the value before the instruction, the value after the instruction, and the evidence that explains the next branch, call, or return.",
					projectLink:
						"https://github.com/instruction-material/Assembly/tree/main/ASM-05-unit-1-machine-model-and-toolchain/starter",
					solutionLink:
						"https://github.com/instruction-material/Assembly/tree/main/ASM-05-unit-1-machine-model-and-toolchain/solution"
				},
				{
					title: "Toolchain Trace Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "assembly",
						moduleTitle: "Unit 1: Machine Model and Toolchain",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Assembly/tree/main/ASM-03-unit-1-machine-model-and-toolchain-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Assembly/tree/main/ASM-03-unit-1-machine-model-and-toolchain-supplemental-2/solution"
				},
				{
					title: "Toolchain Trace Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "assembly",
						moduleTitle: "Unit 1: Machine Model and Toolchain",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Assembly/tree/main/ASM-04-unit-1-machine-model-and-toolchain-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Assembly/tree/main/ASM-04-unit-1-machine-model-and-toolchain-supplemental-3/solution"
				}
			]
		},
		{
			title: "Unit 2: Registers and Data Movement",
			curriculum: [
				{
					title: "General-Purpose Registers and Partial Register Views",
					content:
						"`rax`, `rbx`, `rcx`, `rdx`, pointer registers, and index registers are the working storage for many early examples. The 64-bit, 32-bit, 16-bit, and 8-bit views of a register are connected, so partial-register writes must be traced carefully because some destinations clear upper bits while others preserve them."
				},
				{
					title: "mov, Zero Extension, and Sign Extension",
					content:
						"`mov` represents data transfer rather than hidden computation. Zero-extension and sign-extension instructions show how a smaller value becomes a wider value safely, which matters immediately when mixing bytes, ints, pointers, and return values."
				},
				{
					title: "Immediate, Register, and Memory Operands",
					content:
						"Trace the three core operand categories deliberately: immediate constants, register-to-register moves, and memory loads or stores. The recurring question is: where is the value coming from, and where is it going?"
				},
				{
					title: "Project: Integer Calculator in Assembly",
					id: "assembly-unit-2-registers-and-data-movement-curriculum-project-integer-calculator-in-assembly",
					ideImport: true,
					content: assemblyCalculatorProjectReading,
					projectLink:
						"https://github.com/instruction-material/Assembly/tree/37756ab58d42d47a3ae1449950125f444691273f/ASM1-Integer-Calculator/starter",
					solutionLink:
						"https://github.com/instruction-material/Assembly/tree/37756ab58d42d47a3ae1449950125f444691273f/ASM1-Integer-Calculator/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Register-Trace Worksheet: Registers and Data Movement",
					content:
						"Use a focused trace worksheet for registers and data movement that records the key registers, flag changes, memory addresses, and one plain-language explanation of why the control flow moved the way it did. Focus especially on which register holds each live value and how width changes alter the interpretation so the worksheet narrates instruction flow rather than only skimming mnemonics. A complete entry records the instruction address, the value before the instruction, the value after the instruction, and the evidence that explains the next branch, call, or return.",
					projectLink:
						"https://github.com/instruction-material/Assembly/blob/37756ab58d42d47a3ae1449950125f444691273f/ASM1-Integer-Calculator/README.md"
				},
				{
					title: "Register Flow Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "assembly",
						moduleTitle: "Unit 2: Registers and Data Movement",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Assembly/tree/main/ASM-05-unit-2-registers-and-data-movement-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Assembly/tree/main/ASM-05-unit-2-registers-and-data-movement-supplemental-2/solution"
				},
				{
					title: "Register Flow Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "assembly",
						moduleTitle: "Unit 2: Registers and Data Movement",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Assembly/tree/main/ASM-06-unit-2-registers-and-data-movement-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Assembly/tree/main/ASM-06-unit-2-registers-and-data-movement-supplemental-3/solution"
				}
			]
		},
		{
			title: "Unit 3: Arithmetic and Logic",
			curriculum: [
				{
					title: "add, sub, imul, and idiv",
					content:
						"Arithmetic instructions change explicit machine state rather than acting like magical one-line operators. `add` and `sub` mostly write the named destination, while multiplication and signed division introduce implicit register use, setup requirements, and result locations that must be traced before the answer is trusted."
				},
				{
					title: "and, or, xor, test, and Condition Checks",
					content:
						"Use the logic instructions to connect bit operations to control flow. `test` and `xor` are especially practical because they show up constantly in zero checks, mask checks, and quick register clearing patterns."
				},
				{
					title: "Flags, Condition Codes, and Arithmetic Visibility",
					content:
						"The zero flag, sign flag, carry flag, and overflow flag are observable state produced by arithmetic and logic instructions. A complete explanation names not only the numeric result, but also which flags changed, why they changed, and how a later conditional branch could use that state."
				},
				{
					title: "C-to-Assembly Compare: Arithmetic Helper",
					content:
						"Compare one arithmetic C function with the instruction sequence the compiler produced. Inspect the generated assembly, then explain why the compiler chose that sequence instead of a more literal source-level translation."
				},
				{
					title: "Unit 3: Arithmetic and Logic: Core Project",
					content: buildProjectGuidance({
						courseFamily: "assembly",
						moduleTitle: "Unit 3: Arithmetic and Logic",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Assembly/tree/main/ASM-06-unit-3-arithmetic-and-logic/starter",
					solutionLink:
						"https://github.com/instruction-material/Assembly/tree/main/ASM-06-unit-3-arithmetic-and-logic/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Register-Trace Worksheet: Arithmetic and Logic",
					content:
						"Use a focused trace worksheet for arithmetic and logic that records the key registers, flag changes, memory addresses, and one plain-language explanation of why the control flow moved the way it did. Focus especially on flag changes, implicit register use, and the difference between value changes and status changes so the worksheet narrates instruction flow rather than only skimming mnemonics. A complete entry records the instruction address, the value before the instruction, the value after the instruction, and the evidence that explains the next branch, call, or return.",
					projectLink:
						"https://github.com/instruction-material/Assembly/tree/main/ASM-06-unit-3-arithmetic-and-logic/starter",
					solutionLink:
						"https://github.com/instruction-material/Assembly/tree/main/ASM-06-unit-3-arithmetic-and-logic/solution"
				},
				{
					title: "Flag Logic Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "assembly",
						moduleTitle: "Unit 3: Arithmetic and Logic",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Assembly/tree/main/ASM-07-unit-3-arithmetic-and-logic-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Assembly/tree/main/ASM-07-unit-3-arithmetic-and-logic-supplemental-2/solution"
				},
				{
					title: "Flag Logic Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "assembly",
						moduleTitle: "Unit 3: Arithmetic and Logic",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Assembly/tree/main/ASM-08-unit-3-arithmetic-and-logic-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Assembly/tree/main/ASM-08-unit-3-arithmetic-and-logic-supplemental-3/solution"
				}
			]
		},
		{
			title: "Unit 4: Branching and Loops",
			curriculum: [
				{
					title: "cmp, jmp, and Conditional Jumps",
					content:
						"Branching becomes clearer when the compare-and-branch relationship is explicit: `cmp` prepares flags, unconditional jumps move control directly, and `jcc` instructions read the current flag state. Conditional jumps are easier to predict when they are tied back to the instruction that last set the relevant flags."
				},
				{
					title: "Loop Construction and State Tracing",
					content:
						"Loops are built from labels, compares, and jumps instead of hiding iteration in higher-level syntax. The key prediction targets are the loop counter, current address, and exit condition before the next instruction runs."
				},
				{
					title: "Search and Accumulation Patterns",
					content:
						"Use array summation, scanning, and threshold checks as the recurring examples because they produce visible state changes without introducing too much scaffolding. These patterns also transfer directly into later performance and compiler-output discussions."
				},
				{
					title: "Project: Array Sum and Search Routines",
					id: "assembly-unit-4-branching-and-loops-curriculum-project-array-sum-and-search-routines",
					ideImport: true,
					content: assemblyArrayProjectReading,
					projectLink:
						"https://github.com/instruction-material/Assembly/tree/4e82e4d5f02067a830f92c19e148d0822220ffe9/ASM2-Array-Sum-and-Search/starter",
					solutionLink:
						"https://github.com/instruction-material/Assembly/tree/4e82e4d5f02067a830f92c19e148d0822220ffe9/ASM2-Array-Sum-and-Search/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Register-Trace Worksheet: Branching and Loops",
					content:
						"Use a focused trace worksheet for branching and loops that records the key registers, flag changes, memory addresses, and one plain-language explanation of why the control flow moved the way it did. Focus especially on loop counters, branch conditions, and which instruction actually decides whether the next iteration runs so the worksheet narrates instruction flow rather than only skimming mnemonics. A complete entry records the instruction address, the value before the instruction, the value after the instruction, and the evidence that explains the next branch, call, or return.",
					projectLink:
						"https://github.com/instruction-material/Assembly/blob/4e82e4d5f02067a830f92c19e148d0822220ffe9/ASM2-Array-Sum-and-Search/README.md"
				},
				{
					title: "Branch Trace Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "assembly",
						moduleTitle: "Unit 4: Branching and Loops",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Assembly/tree/main/ASM-09-unit-4-branching-and-loops-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Assembly/tree/main/ASM-09-unit-4-branching-and-loops-supplemental-2/solution"
				},
				{
					title: "Branch Trace Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "assembly",
						moduleTitle: "Unit 4: Branching and Loops",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Assembly/tree/main/ASM-10-unit-4-branching-and-loops-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Assembly/tree/main/ASM-10-unit-4-branching-and-loops-supplemental-3/solution"
				}
			]
		},
		{
			title: "Unit 5: The Stack and Function Calls",
			curriculum: [
				{
					title: "call, ret, and Return Addresses",
					content:
						"`call` and `ret` are stack operations as well as control-flow operations. A call places the return address on the stack, so call depth, frame layout, and corruption bugs become visible as concrete data movement rather than abstract function behavior."
				},
				{
					title: "Stack Frames and Local Storage",
					content:
						"Stack frames are a bookkeeping convention rather than a law of nature. The important patterns are the prologue, the epilogue, when local stack space is reserved, and why optimized code may partially remove the frame that a beginner expects to see."
				},
				{
					title: "Saved Registers and Stack Alignment",
					content:
						"Explain why some registers must be preserved across calls and why stack alignment matters before calling into another function. This is the point where calls become ABI obligations, not just jumps with a convenient return."
				},
				{
					title: "C-to-Assembly Compare: Stack Frame Walkthrough",
					content:
						"Use a tiny C function with one local variable and one nested call to make the stack frame concrete. Map each assembly frame adjustment back to the source-level intent before changing the code."
				},
				{
					title: "Unit 5: The Stack and Function Calls: Core Project",
					id: "assembly-unit-5-the-stack-and-function-calls-curriculum-core-project-the-stack-and-function-calls",
					ideImport: true,
					content: assemblyStackProjectReading,
					projectLink:
						"https://github.com/instruction-material/Assembly/tree/005e375894ade846a1077e96d4880faea680aed8/ASM-07-unit-5-the-stack-and-function-calls/starter",
					solutionLink:
						"https://github.com/instruction-material/Assembly/tree/005e375894ade846a1077e96d4880faea680aed8/ASM-07-unit-5-the-stack-and-function-calls/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Register-Trace Worksheet: The Stack and Function Calls",
					content:
						"Use a focused trace worksheet for the stack and function calls that records the key registers, flag changes, memory addresses, and one plain-language explanation of why the control flow moved the way it did. Focus especially on return addresses, saved registers, and why the stack pointer moves when a function prepares for another call so the worksheet narrates instruction flow rather than only skimming mnemonics. A complete entry records the instruction address, the value before the instruction, the value after the instruction, and the evidence that explains the next branch, call, or return.",
					projectLink:
						"https://github.com/instruction-material/Assembly/blob/005e375894ade846a1077e96d4880faea680aed8/ASM-07-unit-5-the-stack-and-function-calls/README.md"
				},
				{
					title: "Stack Frame Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "assembly",
						moduleTitle: "Unit 5: The Stack and Function Calls",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Assembly/tree/main/ASM-11-unit-5-the-stack-and-function-calls-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Assembly/tree/main/ASM-11-unit-5-the-stack-and-function-calls-supplemental-2/solution"
				},
				{
					title: "Stack Frame Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "assembly",
						moduleTitle: "Unit 5: The Stack and Function Calls",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Assembly/tree/main/ASM-12-unit-5-the-stack-and-function-calls-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Assembly/tree/main/ASM-12-unit-5-the-stack-and-function-calls-supplemental-3/solution"
				}
			]
		},
		{
			title: "Unit 6: Calling Conventions and ABI",
			curriculum: [
				{
					title: "Parameter Passing and Return Values",
					content:
						"The System V AMD64 calling convention defines where the first arguments live, where integer return values come back, and when extra values spill to the stack. Before stepping through a call, the expected argument registers and return register are predictable from the function signature."
				},
				{
					title: "Caller-Saved versus Callee-Saved Registers",
					content:
						"Frame register-saving rules as part of a contract between functions. The point is not rote memorization alone; it is understanding why a function that forgets to preserve the wrong register can silently corrupt its caller."
				},
				{
					title: "Interacting with C Cleanly",
					content:
						"Use mixed C and assembly examples to show how prototypes, symbol names, argument widths, and return values must line up across languages. This keeps ABI work grounded in practical interoperability rather than only in diagrams."
				},
				{
					title: "Project: Call a C Helper from Assembly",
					id: "assembly-unit-6-calling-conventions-and-abi-curriculum-project-call-a-c-helper-from-assembly",
					ideImport: true,
					content: assemblyHelperProjectReading,
					projectLink:
						"https://github.com/instruction-material/Assembly/tree/4519a6ecbdb0dc6e932932a8af50a24f2449c8ef/ASM4-Call-C-Helper-from-Assembly/starter",
					solutionLink:
						"https://github.com/instruction-material/Assembly/tree/4519a6ecbdb0dc6e932932a8af50a24f2449c8ef/ASM4-Call-C-Helper-from-Assembly/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Register-Trace Worksheet: Calling Conventions and ABI",
					content:
						"Use a focused trace worksheet for calling conventions and abi that records the key registers, flag changes, memory addresses, and one plain-language explanation of why the control flow moved the way it did. Focus especially on argument registers, preserved registers, and what must be restored before returning so the worksheet narrates instruction flow rather than only skimming mnemonics. A complete entry records the instruction address, the value before the instruction, the value after the instruction, and the evidence that explains the next branch, call, or return.",
					projectLink:
						"https://github.com/instruction-material/Assembly/blob/4519a6ecbdb0dc6e932932a8af50a24f2449c8ef/ASM4-Call-C-Helper-from-Assembly/README.md"
				},
				{
					title: "Calling Convention Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "assembly",
						moduleTitle: "Unit 6: Calling Conventions and ABI",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Assembly/tree/main/ASM-13-unit-6-calling-conventions-and-abi-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Assembly/tree/main/ASM-13-unit-6-calling-conventions-and-abi-supplemental-2/solution"
				},
				{
					title: "Calling Convention Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "assembly",
						moduleTitle: "Unit 6: Calling Conventions and ABI",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Assembly/tree/main/ASM-14-unit-6-calling-conventions-and-abi-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Assembly/tree/main/ASM-14-unit-6-calling-conventions-and-abi-supplemental-3/solution"
				}
			]
		},
		{
			title: "Unit 7: Memory Addressing and Data Structures",
			curriculum: [
				{
					title: "Base Plus Index Plus Scale Addressing",
					content:
						"Complex addressing is a readable formula, not a syntax trick. Decode the base register, scaled index, and displacement into a statement such as 'array base plus element index times element size plus field offset,' then verify that the resulting address matches the data being loaded or stored."
				},
				{
					title: "Arrays, Strings, and Sequential Memory Walks",
					content:
						"Use arrays and strings to reinforce that iteration in assembly is really address arithmetic and stop conditions. The key habit is explaining which address gets read next and why the loop exits when it does."
				},
				{
					title: "Struct Field Offsets and Data Layout Thinking",
					content:
						"Bring back struct offsets from C so assembly code that addresses a field becomes layout reasoning made explicit. This helps transfer earlier layout work into reverse engineering and compiler-output reading later in the course."
				},
				{
					title: "Project: String Length and Copy Routines",
					id: "assembly-unit-7-memory-addressing-and-data-structures-curriculum-project-string-length-and-copy-routines",
					ideImport: true,
					content: assemblyStringProjectReading,
					projectLink:
						"https://github.com/instruction-material/Assembly/tree/3d66cd9cd20139f8176098475193b791edd2bcd8/ASM3-String-Length-and-Copy/starter",
					solutionLink:
						"https://github.com/instruction-material/Assembly/tree/3d66cd9cd20139f8176098475193b791edd2bcd8/ASM3-String-Length-and-Copy/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Register-Trace Worksheet: Memory Addressing and Data Structures",
					content:
						"Use a focused trace worksheet for memory addressing and data structures that records the key registers, flag changes, memory addresses, and one plain-language explanation of why the control flow moved the way it did. Focus especially on address formulas, stop conditions, and where each byte load or store lands in memory so the worksheet narrates instruction flow rather than only skimming mnemonics. A complete entry records the instruction address, the value before the instruction, the value after the instruction, and the evidence that explains the next branch, call, or return.",
					projectLink:
						"https://github.com/instruction-material/Assembly/blob/3d66cd9cd20139f8176098475193b791edd2bcd8/ASM3-String-Length-and-Copy/README.md"
				},
				{
					title: "Addressing Mode Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "assembly",
						moduleTitle:
							"Unit 7: Memory Addressing and Data Structures",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Assembly/tree/main/ASM-15-unit-7-memory-addressing-and-data-structures-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Assembly/tree/main/ASM-15-unit-7-memory-addressing-and-data-structures-supplemental-2/solution"
				},
				{
					title: "Addressing Mode Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "assembly",
						moduleTitle:
							"Unit 7: Memory Addressing and Data Structures",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Assembly/tree/main/ASM-16-unit-7-memory-addressing-and-data-structures-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Assembly/tree/main/ASM-16-unit-7-memory-addressing-and-data-structures-supplemental-3/solution"
				}
			]
		},
		{
			title: "Unit 8: System Calls and Runtime Interaction",
			curriculum: [
				{
					title: "Minimal Linux Syscall Examples",
					content:
						"Direct syscalls expose the lowest visible interface between user-space code and the kernel, even when the classroom build sometimes uses a libc-backed harness for portability. The central pattern is putting the syscall number and arguments in the required registers, executing the boundary-crossing instruction, and interpreting the return value as success or failure."
				},
				{
					title: "libc versus Direct Syscalls",
					content:
						"Compare libc calls and direct syscalls so runtime interaction is visible at different layers. The key lesson is not choosing one forever, but understanding what extra behavior a runtime library adds beyond the raw kernel boundary."
				},
				{
					title: "argc, argv, and Process Startup State",
					content:
						"Use command-line arguments as a beginner-friendly runtime surface that still reveals process state, string parsing, and error handling. This provides a concrete input path without requiring a large UI or framework."
				},
				{
					title: "Project: Tiny Command-Line Parser",
					id: "assembly-unit-8-system-calls-and-runtime-interaction-curriculum-project-tiny-command-line-parser",
					ideImport: true,
					content: assemblyParserProjectReading,
					projectLink:
						"https://github.com/instruction-material/Assembly/tree/b87661c22a4bc08245cac18a0d6b8d672723eec8/ASM5-Tiny-Command-Line-Parser/starter",
					solutionLink:
						"https://github.com/instruction-material/Assembly/tree/b87661c22a4bc08245cac18a0d6b8d672723eec8/ASM5-Tiny-Command-Line-Parser/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Register-Trace Worksheet: System Calls and Runtime Interaction",
					content:
						"Use a focused trace worksheet for system calls and runtime interaction that records the key registers, flag changes, memory addresses, and one plain-language explanation of why the control flow moved the way it did. Focus especially on argument pointers, parse-state changes, and the exact point where invalid input stops the flow so the worksheet narrates instruction flow rather than only skimming mnemonics. A complete entry records the instruction address, the value before the instruction, the value after the instruction, and the evidence that explains the next branch, call, or return.",
					projectLink:
						"https://github.com/instruction-material/Assembly/blob/b87661c22a4bc08245cac18a0d6b8d672723eec8/ASM5-Tiny-Command-Line-Parser/README.md"
				},
				{
					title: "System Call Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "assembly",
						moduleTitle:
							"Unit 8: System Calls and Runtime Interaction",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Assembly/tree/main/ASM-17-unit-8-system-calls-and-runtime-interaction-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Assembly/tree/main/ASM-17-unit-8-system-calls-and-runtime-interaction-supplemental-2/solution"
				},
				{
					title: "System Call Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "assembly",
						moduleTitle:
							"Unit 8: System Calls and Runtime Interaction",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Assembly/tree/main/ASM-18-unit-8-system-calls-and-runtime-interaction-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Assembly/tree/main/ASM-18-unit-8-system-calls-and-runtime-interaction-supplemental-3/solution"
				}
			]
		},
		{
			title: "Unit 9: Reading Compiler Output",
			curriculum: [
				{
					title: "Compile C to Assembly on Purpose",
					content:
						"Make compiler output a first-class learning tool. Repeatedly compile small C helpers to assembly so manual code shape can be compared to the compiler's choices instead of imagining the compiler as an opaque black box."
				},
				{
					title: "Map Source Lines to Instructions",
					content:
						"Align a source-level branch, loop, or local variable with its instruction-level representation. This becomes the bridge between high-level reasoning and low-level debugging when stepping instruction by instruction."
				},
				{
					title: "Optimization Changes the Shape, Not the Goal",
					content:
						"Unoptimized code favors readability and stack-heavy layouts, while optimized code may remove frames, reuse registers aggressively, or replace obvious source structure with tighter control flow. The point is to understand what changed and what semantic goal stayed the same."
				},
				{
					title: "C-to-Assembly Compare: Loop at O0 and O2",
					content:
						"Compile the same small loop with two optimization levels and compare the resulting assembly. Identify which parts got shorter, which values moved into registers, and which source-level intent remained unchanged."
				},
				{
					title: "Unit 9: Reading Compiler Output: Core Project",
					id: "assembly-unit-9-reading-compiler-output-curriculum-core-project-reading-compiler-output",
					ideImport: true,
					content: assemblyCompilerProjectReading,
					projectLink:
						"https://github.com/instruction-material/Assembly/tree/4fabbbe92deb893d14e2572121fc2393ae426c7b/ASM-08-unit-9-reading-compiler-output/starter",
					solutionLink:
						"https://github.com/instruction-material/Assembly/tree/4fabbbe92deb893d14e2572121fc2393ae426c7b/ASM-08-unit-9-reading-compiler-output/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Register-Trace Worksheet: Reading Compiler Output",
					content:
						"Optional follow-up after the required analysis.md evidence: compare another compiler or a separately changed C expression. Record the target, flags, input, observed instruction addresses and entry/return values, then explain which observation changed. Keep the required baseline comparison and saved learner worksheet intact.",
					projectLink:
						"https://github.com/instruction-material/Assembly/blob/4fabbbe92deb893d14e2572121fc2393ae426c7b/ASM-08-unit-9-reading-compiler-output/README.md"
				},
				{
					title: "Compiler Output Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "assembly",
						moduleTitle: "Unit 9: Reading Compiler Output",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Assembly/tree/main/ASM-19-unit-9-reading-compiler-output-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Assembly/tree/main/ASM-19-unit-9-reading-compiler-output-supplemental-2/solution"
				},
				{
					title: "Compiler Output Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "assembly",
						moduleTitle: "Unit 9: Reading Compiler Output",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Assembly/tree/main/ASM-20-unit-9-reading-compiler-output-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Assembly/tree/main/ASM-20-unit-9-reading-compiler-output-supplemental-3/solution"
				}
			]
		},
		{
			title: "Unit 10: Debugging at Instruction Level",
			curriculum: [
				{
					title: "Step Instructions, Not Just Source Lines",
					content:
						"Instruction-level debugging treats a single machine instruction as the smallest meaningful step. One compare, move, load, store, or conditional jump can change the state that the next instruction depends on, so the trace records the machine state before and after each step."
				},
				{
					title: "Watching Registers and Memory Together",
					content:
						"Use the debugger to watch the register file and selected memory ranges at the same time. The important habit is correlating the pointer values with the bytes they reference instead of treating registers and memory as separate worlds."
				},
				{
					title: "Breakpoints on Functions and Addresses",
					content:
						"Symbolic breakpoints and raw address breakpoints both matter: symbols are convenient when source context exists, while address breakpoints still work for stripped-down instruction sequences. This becomes especially useful once optimization or reverse-engineering exercises make source-line stepping unreliable."
				},
				{
					title: "Instruction-Level Debug Pass on an Existing Lab",
					content:
						"Re-open an earlier lab and debug it from the assembly side only, without immediately jumping back to the C harness. Prove they can explain the bug or behavior from the instruction stream and machine state directly."
				},
				{
					title: "Unit 10: Debugging at Instruction Level: Core Project",
					content: buildProjectGuidance({
						courseFamily: "assembly",
						moduleTitle: "Unit 10: Debugging at Instruction Level",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Assembly/tree/main/ASM-09-unit-10-debugging-at-instruction-level/starter",
					solutionLink:
						"https://github.com/instruction-material/Assembly/tree/main/ASM-09-unit-10-debugging-at-instruction-level/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Register-Trace Worksheet: Debugging at Instruction Level",
					content:
						"Use a focused trace worksheet for debugging at instruction level that records the key registers, flag changes, memory addresses, and one plain-language explanation of why the control flow moved the way it did. Focus especially on where execution stopped, which machine state changed next, and what the next branch decision depends on so the worksheet narrates instruction flow rather than only skimming mnemonics. A complete entry records the instruction address, the value before the instruction, the value after the instruction, and the evidence that explains the next branch, call, or return.",
					projectLink:
						"https://github.com/instruction-material/Assembly/tree/main/ASM-09-unit-10-debugging-at-instruction-level/starter",
					solutionLink:
						"https://github.com/instruction-material/Assembly/tree/main/ASM-09-unit-10-debugging-at-instruction-level/solution"
				},
				{
					title: "Instruction Debugging Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "assembly",
						moduleTitle: "Unit 10: Debugging at Instruction Level",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Assembly/tree/main/ASM-21-unit-10-debugging-at-instruction-level-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Assembly/tree/main/ASM-21-unit-10-debugging-at-instruction-level-supplemental-2/solution"
				},
				{
					title: "Instruction Debugging Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "assembly",
						moduleTitle: "Unit 10: Debugging at Instruction Level",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Assembly/tree/main/ASM-22-unit-10-debugging-at-instruction-level-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Assembly/tree/main/ASM-22-unit-10-debugging-at-instruction-level-supplemental-3/solution"
				}
			]
		},
		{
			title: "Unit 11: Performance and Code Shape",
			curriculum: [
				{
					title: "Branch Cost and Predictability",
					content:
						"Branches can affect performance, but this unit is about evidence rather than premature micro-optimization. Predictable straight-line code often behaves differently from branch-heavy code even when the instruction count looks similar on paper, so measurements and traces matter more than guesses."
				},
				{
					title: "Memory Locality and Access Patterns",
					content:
						"Use array walks and pointer-chasing examples to connect performance back to layout and locality. The key lesson is that where data lives in memory can matter as much as the arithmetic instructions operating on it."
				},
				{
					title: "Instruction Count versus Real Performance",
					content:
						"Distrust simplistic 'fewer instructions always wins' thinking. Some instructions are more expensive than others, memory access matters, and compiler optimizations often reshape the cost model in ways that require observation rather than assumption."
				},
				{
					title: "C-to-Assembly Compare: Loop Shape versus Loop Cost",
					content:
						"Compare two small assembly listings from alternate versions of an array routine. Decide whether visible instruction count alone tells the whole performance story, then name the missing evidence such as memory access, branching, or cache behavior."
				},
				{
					title: "Unit 11: Performance and Code Shape: Core Project",
					content: buildProjectGuidance({
						courseFamily: "assembly",
						moduleTitle: "Unit 11: Performance and Code Shape",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Assembly/tree/main/ASM-10-unit-11-performance-and-code-shape/starter",
					solutionLink:
						"https://github.com/instruction-material/Assembly/tree/main/ASM-10-unit-11-performance-and-code-shape/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Register-Trace Worksheet: Performance and Code Shape",
					content:
						"Use a focused trace worksheet for performance and code shape that records the key registers, flag changes, memory addresses, and one plain-language explanation of why the control flow moved the way it did. Focus especially on branch frequency, memory-access patterns, and which cost assumptions came from evidence versus guesswork so the worksheet narrates instruction flow rather than only skimming mnemonics. A complete entry records the instruction address, the value before the instruction, the value after the instruction, and the evidence that explains the next branch, call, or return.",
					projectLink:
						"https://github.com/instruction-material/Assembly/tree/main/ASM-10-unit-11-performance-and-code-shape/starter",
					solutionLink:
						"https://github.com/instruction-material/Assembly/tree/main/ASM-10-unit-11-performance-and-code-shape/solution"
				},
				{
					title: "Code Shape Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "assembly",
						moduleTitle: "Unit 11: Performance and Code Shape",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Assembly/tree/main/ASM-23-unit-11-performance-and-code-shape-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Assembly/tree/main/ASM-23-unit-11-performance-and-code-shape-supplemental-2/solution"
				},
				{
					title: "Code Shape Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "assembly",
						moduleTitle: "Unit 11: Performance and Code Shape",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Assembly/tree/main/ASM-24-unit-11-performance-and-code-shape-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Assembly/tree/main/ASM-24-unit-11-performance-and-code-shape-supplemental-3/solution"
				}
			]
		},
		{
			title: "Unit 12: Security and Reliability Visibility",
			curriculum: [
				{
					title: "Stack Canaries, PIE, and Binary Hardening Signals",
					content:
						"Stack canaries, PIE, and related hardening features appear as visible patterns around familiar function, call, and process-layout code. This is not exhaustive exploit-mitigation coverage; the useful skill is recognizing how security features show up in ordinary disassembly and runtime layout evidence."
				},
				{
					title: "How Assembly Explains Low-Level Bugs",
					content:
						"Buffer mistakes, stale pointers, and bad control-flow assumptions become easier to explain once the actual loads, stores, and branch decisions are visible. Use assembly as a clarity tool for reliability work, not only as a language to write by hand."
				},
				{
					title: "Reverse Engineering as a Reliability and Security Skill",
					content:
						"Position reverse engineering as a way to recover intent from compiled artifacts, inspect unfamiliar binaries, and validate assumptions about generated code. This makes the course useful not only for authorship, but for inspection and debugging work later in security or systems courses."
				},
				{
					title: "Project: Reverse-Engineer a Toy Program Back into Pseudocode",
					id: "assembly-unit-12-security-and-reliability-visibility-curriculum-project-reverse-engineer-a-toy-program-back-into-pseudocode",
					ideImport: true,
					content: assemblyReverseProjectReading,
					projectLink:
						"https://github.com/instruction-material/Assembly/tree/8856f11c649863d5eee9914658c11cfb801ead4b/ASM6-Reverse-Engineering-Toy-Program/starter",
					solutionLink:
						"https://github.com/instruction-material/Assembly/tree/8856f11c649863d5eee9914658c11cfb801ead4b/ASM6-Reverse-Engineering-Toy-Program/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Register-Trace Worksheet: Security and Reliability Visibility",
					content:
						"Use a focused trace worksheet for security and reliability visibility that records the key registers, flag changes, memory addresses, and one plain-language explanation of why the control flow moved the way it did. Focus especially on where the hardening or bug evidence appears around the function and what that reveals about runtime behavior so the worksheet narrates instruction flow rather than only skimming mnemonics. A complete entry records the instruction address, the value before the instruction, the value after the instruction, and the evidence that explains the next branch, call, or return.",
					projectLink:
						"https://github.com/instruction-material/Assembly/blob/8856f11c649863d5eee9914658c11cfb801ead4b/ASM6-Reverse-Engineering-Toy-Program/README.md"
				},
				{
					title: "Reliability Visibility Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "assembly",
						moduleTitle:
							"Unit 12: Security and Reliability Visibility",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Assembly/tree/main/ASM-25-unit-12-security-and-reliability-visibility-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Assembly/tree/main/ASM-25-unit-12-security-and-reliability-visibility-supplemental-2/solution"
				},
				{
					title: "Reliability Visibility Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "assembly",
						moduleTitle:
							"Unit 12: Security and Reliability Visibility",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Assembly/tree/main/ASM-26-unit-12-security-and-reliability-visibility-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Assembly/tree/main/ASM-26-unit-12-security-and-reliability-visibility-supplemental-3/solution"
				}
			]
		},
		{
			title: "ASM13 Expansion Ideas and Next Steps",
			curriculum: [
				{
					title: "ARM64 Comparison Module",
					content:
						"Offer an ARM64 comparison module once x86-64 tracing is stable. The useful lesson is not memorizing a second ISA immediately, but seeing which concepts transfer cleanly across register sets, calling conventions, and instruction encodings."
				},
				{
					title: "SIMD and Wider Data Paths",
					content:
						"Treat SIMD as a later specialization rather than a prerequisite. First be fluent in scalar register tracing and calling conventions, then move into packed-data operations once the underlying mental model is stable."
				},
				{
					title: "Reverse-Engineering Elective",
					content:
						"Extend the course into a reverse-engineering elective with more disassembly-only exercises, function identification, and pseudocode recovery. This is a natural direction for deeper low-level security, tooling, or binary-analysis work."
				},
				{
					title: "Linker, Relocation, and Symbol Deep Dives",
					content:
						"A final expansion path can go deeper into object files, relocation, static versus dynamic linking, and symbol resolution. Those topics make more sense after the core course has already made functions, calls, and build artifacts concrete."
				},
				{
					title: "ASM13 Expansion Ideas and Next Steps: Core Project",
					content: buildProjectGuidance({
						courseFamily: "assembly",
						moduleTitle: "ASM13 Expansion Ideas and Next Steps",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Assembly/tree/main/ASM-11-asm13-expansion-ideas-and-next-steps/starter",
					solutionLink:
						"https://github.com/instruction-material/Assembly/tree/main/ASM-11-asm13-expansion-ideas-and-next-steps/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Register-Trace Worksheet: Expansion Ideas and Next Steps",
					content:
						"Use a focused trace worksheet for expansion ideas and next steps that records the key registers, flag changes, memory addresses, and one plain-language explanation of why the control flow moved the way it did. Focus especially on which next specialization fits the current strengths and why; the worksheet narrates instruction flow rather than only skimming mnemonics. A complete entry records the instruction address, the value before the instruction, the value after the instruction, and the evidence that explains the next branch, call, or return. The final note connects the chosen specialization to a concrete trace skill already demonstrated.",
					projectLink:
						"https://github.com/instruction-material/Assembly/tree/main/ASM-11-asm13-expansion-ideas-and-next-steps/starter",
					solutionLink:
						"https://github.com/instruction-material/Assembly/tree/main/ASM-11-asm13-expansion-ideas-and-next-steps/solution"
				},
				{
					title: "Next Steps Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "assembly",
						moduleTitle: "ASM13 Expansion Ideas and Next Steps",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Assembly/tree/main/ASM-27-asm13-expansion-ideas-and-next-steps-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Assembly/tree/main/ASM-27-asm13-expansion-ideas-and-next-steps-supplemental-2/solution"
				},
				{
					title: "Next Steps Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "assembly",
						moduleTitle: "ASM13 Expansion Ideas and Next Steps",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Assembly/tree/main/ASM-28-asm13-expansion-ideas-and-next-steps-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Assembly/tree/main/ASM-28-asm13-expansion-ideas-and-next-steps-supplemental-3/solution"
				}
			]
		},
		{
			title: "Assembly Lab 15: Stack Trace Studio",
			curriculum: [
				{
					title: "Stack Trace Studio: Core Concepts",
					content: buildImplementationLabGuidance({
						courseFamily: "assembly",
						moduleTitle: "Assembly Lab 15: Stack Trace Studio",
						section: "concepts"
					})
				},
				{
					title: "Stack Trace Studio: Guided Example",
					content: buildImplementationLabGuidance({
						courseFamily: "assembly",
						moduleTitle: "Assembly Lab 15: Stack Trace Studio",
						section: "example"
					})
				},
				{
					title: "Stack Trace Studio: Core Project",
					content: buildImplementationLabGuidance({
						courseFamily: "assembly",
						moduleTitle: "Assembly Lab 15: Stack Trace Studio",
						section: "coreProject"
					}),
					projectLink:
						"https://github.com/instruction-material/Assembly/tree/main/ASM-01-assembly-lab-15/starter",
					solutionLink:
						"https://github.com/instruction-material/Assembly/tree/main/ASM-01-assembly-lab-15/solution"
				},
				{
					title: "Stack Trace Studio: Review",
					content: buildImplementationLabGuidance({
						courseFamily: "assembly",
						moduleTitle: "Assembly Lab 15: Stack Trace Studio",
						section: "review"
					})
				}
			],
			supplementalProjects: [
				{
					title: "Stack Trace Studio: Extension Challenge",
					content: buildImplementationLabGuidance({
						courseFamily: "assembly",
						moduleTitle: "Assembly Lab 15: Stack Trace Studio",
						section: "extension"
					}),
					projectLink:
						"https://github.com/instruction-material/Assembly/tree/main/ASM-01-assembly-lab-15/starter",
					solutionLink:
						"https://github.com/instruction-material/Assembly/tree/main/ASM-01-assembly-lab-15/solution"
				},
				{
					title: "Stack Trace Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "assembly",
						moduleTitle: "Assembly Lab 15: Stack Trace Studio",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Assembly/tree/main/ASM-29-applied-studio-15-assembly-lab-15-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Assembly/tree/main/ASM-29-applied-studio-15-assembly-lab-15-supplemental-2/solution"
				},
				{
					title: "Stack Trace Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "assembly",
						moduleTitle: "Assembly Lab 15: Stack Trace Studio",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Assembly/tree/main/ASM-30-applied-studio-15-assembly-lab-15-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Assembly/tree/main/ASM-30-applied-studio-15-assembly-lab-15-supplemental-3/solution"
				}
			]
		},
		{
			title: "Assembly Lab 16: ABI Integration Studio",
			curriculum: [
				{
					title: "ABI Integration Studio: Core Concepts",
					content: buildImplementationLabGuidance({
						courseFamily: "assembly",
						moduleTitle: "Assembly Lab 16: ABI Integration Studio",
						section: "concepts"
					})
				},
				{
					title: "ABI Integration Studio: Guided Example",
					content: buildImplementationLabGuidance({
						courseFamily: "assembly",
						moduleTitle: "Assembly Lab 16: ABI Integration Studio",
						section: "example"
					})
				},
				{
					title: "ABI Integration Studio: Core Project",
					content: buildImplementationLabGuidance({
						courseFamily: "assembly",
						moduleTitle: "Assembly Lab 16: ABI Integration Studio",
						section: "coreProject"
					}),
					projectLink:
						"https://github.com/instruction-material/Assembly/tree/main/ASM-02-assembly-lab-16/starter",
					solutionLink:
						"https://github.com/instruction-material/Assembly/tree/main/ASM-02-assembly-lab-16/solution"
				},
				{
					title: "ABI Integration Studio: Review",
					content: buildImplementationLabGuidance({
						courseFamily: "assembly",
						moduleTitle: "Assembly Lab 16: ABI Integration Studio",
						section: "review"
					})
				}
			],
			supplementalProjects: [
				{
					title: "ABI Integration Studio: Extension Challenge",
					content: buildImplementationLabGuidance({
						courseFamily: "assembly",
						moduleTitle: "Assembly Lab 16: ABI Integration Studio",
						section: "extension"
					}),
					projectLink:
						"https://github.com/instruction-material/Assembly/tree/main/ASM-02-assembly-lab-16/starter",
					solutionLink:
						"https://github.com/instruction-material/Assembly/tree/main/ASM-02-assembly-lab-16/solution"
				},
				{
					title: "ABI Integration Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "assembly",
						moduleTitle: "Assembly Lab 16: ABI Integration Studio",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Assembly/tree/main/ASM-31-applied-studio-16-assembly-lab-16-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Assembly/tree/main/ASM-31-applied-studio-16-assembly-lab-16-supplemental-2/solution"
				},
				{
					title: "ABI Integration Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "assembly",
						moduleTitle: "Assembly Lab 16: ABI Integration Studio",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Assembly/tree/main/ASM-32-applied-studio-16-assembly-lab-16-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Assembly/tree/main/ASM-32-applied-studio-16-assembly-lab-16-supplemental-3/solution"
				}
			]
		},
		{
			title: "Assembly Lab 17: Reverse Trace Studio",
			curriculum: [
				{
					title: "Reverse Trace Studio: Core Concepts",
					content: buildImplementationLabGuidance({
						courseFamily: "assembly",
						moduleTitle: "Assembly Lab 17: Reverse Trace Studio",
						section: "concepts"
					})
				},
				{
					title: "Reverse Trace Studio: Guided Example",
					content: buildImplementationLabGuidance({
						courseFamily: "assembly",
						moduleTitle: "Assembly Lab 17: Reverse Trace Studio",
						section: "example"
					})
				},
				{
					title: "Reverse Trace Studio: Core Project",
					content: buildImplementationLabGuidance({
						courseFamily: "assembly",
						moduleTitle: "Assembly Lab 17: Reverse Trace Studio",
						section: "coreProject"
					}),
					projectLink:
						"https://github.com/instruction-material/Assembly/tree/main/ASM-03-assembly-lab-17/starter",
					solutionLink:
						"https://github.com/instruction-material/Assembly/tree/main/ASM-03-assembly-lab-17/solution"
				},
				{
					title: "Reverse Trace Studio: Review",
					content: buildImplementationLabGuidance({
						courseFamily: "assembly",
						moduleTitle: "Assembly Lab 17: Reverse Trace Studio",
						section: "review"
					})
				}
			],
			supplementalProjects: [
				{
					title: "Reverse Trace Studio: Extension Challenge",
					content: buildImplementationLabGuidance({
						courseFamily: "assembly",
						moduleTitle: "Assembly Lab 17: Reverse Trace Studio",
						section: "extension"
					}),
					projectLink:
						"https://github.com/instruction-material/Assembly/tree/main/ASM-03-assembly-lab-17/starter",
					solutionLink:
						"https://github.com/instruction-material/Assembly/tree/main/ASM-03-assembly-lab-17/solution"
				},
				{
					title: "Reverse Trace Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "assembly",
						moduleTitle: "Assembly Lab 17: Reverse Trace Studio",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Assembly/tree/main/ASM-33-applied-studio-17-assembly-lab-17-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Assembly/tree/main/ASM-33-applied-studio-17-assembly-lab-17-supplemental-2/solution"
				},
				{
					title: "Reverse Trace Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "assembly",
						moduleTitle: "Assembly Lab 17: Reverse Trace Studio",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Assembly/tree/main/ASM-34-applied-studio-17-assembly-lab-17-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Assembly/tree/main/ASM-34-applied-studio-17-assembly-lab-17-supplemental-3/solution"
				}
			]
		}
	]
};

interface AssemblyModuleFlow {
	estimatedTime: string;
	flowNote: string;
	keyBlocks: string[];
}

const ASSEMBLY_PRIMARY_MODULE_COUNT = 13;

const ASSEMBLY_MODULE_FLOW: Record<string, AssemblyModuleFlow> = {
	"ASM0 Setup and Tooling": {
		estimatedTime: "2–3 sessions · 45–60 minutes each",
		keyBlocks: [
			"x86-64 Linux",
			"System V AMD64",
			"Intel-syntax .S",
			"build / disassemble",
			"debug trace"
		],
		flowNote:
			"Confirm the exact target, ABI, source syntax, and tool versions before reading or writing instructions. Build one mixed C/assembly fixture, disassemble it in Intel syntax, run its deterministic check, and capture one instruction-step trace that connects source, registers, flags, memory, and control flow."
	},
	"Unit 1: Machine Model and Toolchain": {
		estimatedTime: "3 sessions · 45–60 minutes each",
		keyBlocks: [
			"source / object / executable",
			"symbol",
			"relocation",
			"disassembly",
			"O0 / O2 comparison"
		],
		flowNote:
			"Follow one tiny function from C and `.S` source through object files, symbols, relocation, linking, and disassembly. Compare `-O0` and `-O2` only with the exact commands recorded and distinguish source structure from behavior preserved by the compiler."
	},
	"Unit 2: Registers and Data Movement": {
		estimatedTime: "3 sessions · 45–60 minutes each",
		keyBlocks: [
			"register width",
			"partial-register write",
			"sign / zero extension",
			"operand source",
			"trace table"
		],
		flowNote:
			"Trace every move with a before/after value and width. Include the x86-64 rule that a 32-bit general-purpose destination clears the upper 32 bits while 8- and 16-bit writes preserve unaffected bits, then test signed and unsigned extension at boundary values."
	},
	"Unit 3: Arithmetic and Logic": {
		estimatedTime: "3–4 sessions · 45–60 minutes each",
		keyBlocks: [
			"implicit operands",
			"flags",
			"signed / unsigned",
			"idiv precondition",
			"fault case"
		],
		flowNote:
			"Record explicit and implicit operands, result registers, and relevant flags for every arithmetic step. Test zero, sign, carry, and overflow boundaries, prepare the dividend correctly for `idiv`, and handle divisor zero and the signed minimum divided by `-1` fault case deliberately."
	},
	"Unit 4: Branching and Loops": {
		estimatedTime: "3 sessions · 45–60 minutes each",
		keyBlocks: [
			"flag producer",
			"signed branch",
			"unsigned branch",
			"loop invariant",
			"bounded memory walk"
		],
		flowNote:
			"Link each conditional jump to the exact instruction that produced its flags and label whether the comparison is signed or unsigned. Verify empty, one-element, found, not-found, first, last, and bounded-end cases while preserving a written loop invariant."
	},
	"Unit 5: The Stack and Function Calls": {
		estimatedTime: "4 sessions · 45–60 minutes each",
		keyBlocks: [
			"call / ret",
			"return address",
			"stack frame",
			"16-byte alignment",
			"unwind trace"
		],
		flowNote:
			"Draw stack state before and after `call`, prologue, local allocation, nested call, epilogue, and `ret`. Preserve required 16-byte call-site alignment for the pinned ABI and prove balanced stack restoration across normal and early-return paths."
	},
	"Unit 6: Calling Conventions and ABI": {
		estimatedTime: "4 sessions · 45–60 minutes each",
		keyBlocks: [
			"argument register",
			"return register",
			"caller-saved",
			"callee-saved",
			"C interop"
		],
		flowNote:
			"Use the System V AMD64 register table as an executable contract. Call C from assembly and assembly from C, pass boundary values, preserve every callee-saved register touched, maintain stack alignment, and compare the observed call state with the ABI prediction."
	},
	"Unit 7: Memory Addressing and Data Structures": {
		estimatedTime: "4 sessions · 45–60 minutes each",
		keyBlocks: [
			"base + index * scale",
			"element width",
			"struct offset",
			"bounded string",
			"overlap policy"
		],
		flowNote:
			"Derive effective addresses from a labeled layout before executing them. Test empty and bounded arrays/strings, exact capacity, missing terminator, and source/destination overlap policy; every memory walk carries an explicit length or trusted bound."
	},
	"Unit 8: System Calls and Runtime Interaction": {
		estimatedTime: "3–4 sessions · 45–60 minutes each",
		keyBlocks: [
			"Linux syscall ABI",
			"libc boundary",
			"return / error value",
			"argc / argv",
			"unprivileged fixture"
		],
		flowNote:
			"Keep direct calls limited to documented, unprivileged Linux syscalls in the controlled lab and compare them with libc wrappers. Validate `argc` before reading `argv`, check every return value and partial result, and test missing argument, bad path, short write, and ordinary success."
	},
	"Unit 9: Reading Compiler Output": {
		estimatedTime: "3 sessions · 45–60 minutes each",
		keyBlocks: [
			"recorded compiler flags",
			"O0 / O2",
			"source mapping",
			"semantic equivalence",
			"bounded claim"
		],
		flowNote:
			"Compile the same small C fixtures with recorded compiler/version/flags and compare `-O0` with `-O2`. Identify preserved behavior, removed source artifacts, calling-convention obligations, and one limit on what can be inferred from a single compiler build."
	},
	"Unit 10: Debugging at Instruction Level": {
		estimatedTime: "3–4 sessions · 45–60 minutes each",
		keyBlocks: [
			"instruction breakpoint",
			"register watch",
			"memory watch",
			"fault reproduction",
			"evidence correction"
		],
		flowNote:
			"Reproduce one known bug in an existing lab, stop at the first incorrect machine-state transition, and save the register/memory evidence before changing code. Rerun the same trace after the correction and show which previously false invariant now holds."
	},
	"Unit 11: Performance and Code Shape": {
		estimatedTime: "3–4 sessions · 45–60 minutes each",
		keyBlocks: [
			"correctness gate",
			"fixed fixture",
			"repeated measurement",
			"memory locality",
			"bounded conclusion"
		],
		flowNote:
			"Prove identical behavior before comparing code shape or timings. Record build mode, fixture, machine context, repeated measurements, and relevant branch or memory-access evidence; instruction count alone cannot support a universal performance claim."
	},
	"Unit 12: Security and Reliability Visibility": {
		estimatedTime: "5–6 sessions · 45–60 minutes each",
		keyBlocks: [
			"known toy binary",
			"hardening signal",
			"control-flow trace",
			"pseudocode recovery",
			"defensive boundary"
		],
		flowNote:
			"Work only with course-owned toy binaries and use reverse engineering to explain behavior, hardening signals, and reliability failures. Recover pseudocode from a bounded routine, verify it against fixtures, identify one uncertainty, and avoid exploit development or third-party targets."
	}
};

function assemblySupplementalPath(title: string) {
	return /extension|challenge/i.test(title)
		? ("challenge" as const)
		: ("choice" as const);
}

function decorateAssemblyModule(
	module: RawCourse["modules"][number]
): RawCourse["modules"][number] {
	const flow = ASSEMBLY_MODULE_FLOW[module.title];
	const curriculum = module.curriculum.map((item, index) => ({
		...item,
		content:
			index === 0
				? `**Course flow:** ${flow.flowNote}\n\n${item.content}`
				: item.content,
		learningPath: "core" as const
	}));

	if (module.title === "ASM0 Setup and Tooling") {
		curriculum.push({
			title: "ASM0 Project 0: Target and Trace Readiness",
			content: [
				"**Completion evidence:**",
				"- Recorded x86-64 Linux target, System V AMD64 ABI, compiler/assembler/linker/debugger versions, and Intel-syntax disassembly command.",
				"- Clean mixed C/assembly configure/build/test run from a fresh checkout.",
				"- Object-file symbol or relocation evidence plus the linked function in `objdump -Mintel` or the closest supported equivalent.",
				"- One instruction-step table with address, instruction, register/flag or memory value before and after, and the evidence for the next control-flow step."
			].join("\n"),
			learningPath: "core"
		});
	}

	if (module.title === "Unit 12: Security and Reliability Visibility") {
		curriculum.push({
			title: "ASM12 Defensive Reverse-Trace Completion Contract",
			content: [
				"**Completion evidence:**",
				"- Course-owned toy binary, recorded build or provenance, architecture/ABI confirmation, and deterministic input fixtures.",
				"- Function boundary, arguments, return value, stack/register obligations, control-flow graph or trace, and reconstructed pseudocode.",
				"- Cases for normal input, boundary input, rejected input, and one deliberately explained uncertainty or compiler-dependent observation.",
				"- Pseudocode output matches the toy binary on all fixtures; the work does not target third-party software, bypass controls, or develop an exploit."
			].join("\n"),
			learningPath: "core"
		});
	}

	return {
		...module,
		estimatedTime: flow.estimatedTime,
		keyBlocks: flow.keyBlocks,
		curriculum,
		supplementalProjects: module.supplementalProjects.map(item => ({
			...item,
			learningPath: assemblySupplementalPath(item.title)
		}))
	};
}

function buildOptionalAssemblyArchive(
	modules: RawCourse["modules"]
): RawCourse["modules"][number] {
	return {
		kind: "appendix",
		title: "Optional Assembly Pathways and Studio Archive",
		estimatedTime: "Choose individual pathways or studios as needed",
		keyBlocks: [
			"ARM64 comparison",
			"SIMD",
			"stack trace",
			"ABI integration",
			"reverse trace"
		],
		curriculum: [
			{
				title: "Assembly Pathway and Studio Archive Guide",
				content:
					"**Course flow:** ASM13 Expansion Ideas and Next Steps, Assembly Lab 15: Stack Trace Studio, Assembly Lab 16: ABI Integration Studio, and Assembly Lab 17: Reverse Trace Studio are optional pathways and transfer work after the x86-64 Linux/System V baseline is complete. Select only the comparison or studio that matches the next learning goal; completing the whole archive is not required.",
				learningPath: "core"
			}
		],
		supplementalProjects: modules.flatMap(module =>
			[...module.curriculum, ...module.supplementalProjects].map(
				item => ({
					...item,
					learningPath: assemblySupplementalPath(item.title)
				})
			)
		)
	};
}

const assemblyPrimaryModules = assemblySourceCourse.modules
	.slice(0, ASSEMBLY_PRIMARY_MODULE_COUNT)
	.map(decorateAssemblyModule);
const assemblyArchiveModules = assemblySourceCourse.modules.slice(
	ASSEMBLY_PRIMARY_MODULE_COUNT
);

export const assemblyCourse: RawCourse = {
	...assemblySourceCourse,
	modules: [
		...assemblyPrimaryModules,
		buildOptionalAssemblyArchive(assemblyArchiveModules)
	]
};
