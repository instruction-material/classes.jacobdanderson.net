import type { PythonIdeFile } from "@/modules/pythonIde";
import {
	assemblyArrayPack,
	assemblyCalculatorPack,
	assemblyCompilerPack,
	assemblyCourseResource,
	assemblyDebugPack,
	assemblyHelperPack,
	assemblyParserPack,
	assemblyPerformancePack,
	assemblyReversePack,
	assemblyStackPack,
	assemblyStringPack
} from "@/modules/assemblyProjectResources";

export function assemblyBuildInstructions(
	files: PythonIdeFile[],
	starterUrl?: string
) {
	const selected = assemblyCourseResource(starterUrl ?? "");
	const lines = [
		"Save and download the ZIP, then extract it before building.",
		"Assembly compilation, tests and debugging require Linux x86-64, the System V AMD64 ABI, GNU/Clang Intel syntax, and a native Clang or GCC toolchain.",
		"The workspace edits and saves source. Use an x86-64 Linux VM or lab on macOS, or an x86-64 WSL distribution on Windows."
	];
	if (
		selected?.pack === assemblyCalculatorPack &&
		files.some(file => file.name === `${selected.role}/CMakeLists.txt`)
	) {
		return [
			...lines,
			`From the extracted project folder: cd ${selected.role}`,
			"cmake -S . -B build -DCMAKE_BUILD_TYPE=Debug -DCMAKE_C_COMPILER=clang",
			"cmake --build build",
			"ctest --test-dir build --output-on-failure",
			"./build/assembly_calculator",
			"./build/assembly_calculator '/' -21 3",
			"Read ../README.md for the exact 64-bit wrapping arithmetic, division restrictions, GCC/Release builds and GDB trace.",
			"Invalid inputs, divisor zero and INT64_MIN / -1 are rejected with exit 2 before assembly evaluation.",
			selected.role === "starter"
				? "Addition, subtraction and multiplication already work. Complete CALC_DIV, CALC_AND and CALC_XOR in calculator.S; the untouched demo exits 78 without successful result rows."
				: "The reference prints six valid result rows, passes 12,589 arithmetic cases and returns result=-7 for the negative division example."
		];
	}
	if (
		selected?.pack === assemblyArrayPack &&
		files.some(file => file.name === `${selected.role}/CMakeLists.txt`)
	) {
		return [
			...lines,
			`From the extracted project folder: cd ${selected.role}`,
			"cmake -S . -B build -DCMAKE_BUILD_TYPE=Debug -DCMAKE_C_COMPILER=clang -DCMAKE_ASM_COMPILER=clang",
			"cmake --build build",
			"ctest --test-dir build --output-on-failure",
			"./build/assembly_array",
			"Read ../README.md for the exact function contract, GCC/Release builds, bounded memory cases and GDB trace.",
			selected.role === "starter"
				? "Complete ARRAY_SEARCH in array_routines.S; summation already works. The untouched demo exits 78 with no successful rows."
				: "The reference prints sum=48 and first-match indices 0, 3 and -1 and passes 11,280 array cases."
		];
	}
	if (
		selected?.pack === assemblyStringPack &&
		files.some(file => file.name === `${selected.role}/CMakeLists.txt`)
	) {
		return [
			...lines,
			`From the extracted project folder: cd ${selected.role}`,
			"cmake -S . -B build -DCMAKE_BUILD_TYPE=Debug -DCMAKE_C_COMPILER=clang -DCMAKE_ASM_COMPILER=clang",
			"cmake --build build",
			"ctest --test-dir build --output-on-failure",
			"./build/assembly_strings",
			"Read ../README.md for the exact function contract, GCC/Release builds, bounded memory cases and GDB trace.",
			selected.role === "starter"
				? "Complete COPY_SOURCE_LENGTH in string_routines.S; length and bounded-copy loops are present. The untouched demo exits 78 with no successful rows."
				: "The reference returns source length 8 for full, truncated and zero-capacity copies, stores assem in the six-byte buffer and passes 35,900 string cases."
		];
	}
	if (
		selected?.pack === assemblyHelperPack &&
		files.some(file => file.name === `${selected.role}/CMakeLists.txt`)
	) {
		return [
			...lines,
			`From the extracted project folder: cd ${selected.role}`,
			"cmake -S . -B build -DCMAKE_BUILD_TYPE=Debug -DCMAKE_C_COMPILER=clang -DCMAKE_ASM_COMPILER=clang",
			"cmake --build build",
			"ctest --test-dir build --output-on-failure",
			"./build/assembly_helper",
			"The C helper receives the scaled sum and both signed bounds. Its entry stack remainder is 8 modulo 16; restore stack adjustments and all preserved registers before returning.",
			"Read ../README.md for the complete contract, worked trace, GCC/Release builds and GDB instructions.",
			selected.role === "starter"
				? "Complete CALL_CLAMP in scale_and_clamp.S; the sum-and-scale loop is present. The untouched demo exits 78 with no successful rows."
				: "The reference calls the actual C clamp helper, prints scaled and clamped=40 and scaled and clamped=25, and passes 11,280 helper cases."
		];
	}
	if (
		selected?.pack === assemblyParserPack &&
		files.some(file => file.name === `${selected.role}/CMakeLists.txt`)
	) {
		return [
			...lines,
			`From the extracted project folder: cd ${selected.role}`,
			"cmake -S . -B build -DCMAKE_BUILD_TYPE=Debug -DCMAKE_C_COMPILER=clang -DCMAKE_ASM_COMPILER=clang",
			"cmake --build build",
			"ctest --test-dir build --output-on-failure",
			"./build/assembly_parser",
			"./build/assembly_parser sum 12 -4 7",
			"Invalid commands, operand counts, text and out-of-range values are rejected with exit 2 on stderr and no result rows. A failed parse leaves its output unchanged.",
			"Read ../README.md for the complete contract, worked trace, GCC/Release builds and GDB instructions.",
			selected.role === "starter"
				? "Complete PARSE_SIGN and PARSE_BOUND in parser.S; equality and the digit loop are present. The untouched demo exits 78 with no successful rows."
				: "The reference prints sum=15, max=12 and xor=-9, accepts the full signed 64-bit range and passes 9,157 parser/equality cases."
		];
	}
	if (
		selected?.pack === assemblyReversePack &&
		files.some(file => file.name === `${selected.role}/CMakeLists.txt`)
	) {
		return [
			...lines,
			`From the extracted project folder: cd ${selected.role}`,
			"cmake -S . -B build -DCMAKE_BUILD_TYPE=Debug -DCMAKE_C_COMPILER=clang -DCMAKE_ASM_COMPILER=clang",
			"cmake --build build",
			"ctest --test-dir build --output-on-failure",
			"./build/assembly_reverse",
			"./build/assembly_reverse 13",
			"./build/assembly_reverse -9223372036854775808",
			"Keep C undefined-behavior sanitization enabled. The signed comparison and modular offsets must match the unchanged mystery routine across full-width inputs. Invalid operands are rejected with exit 2 and no result rows.",
			"Read ../README.md for the complete contract, worked trace, GCC/Release builds and GDB instructions.",
			selected.role === "starter"
				? "Complete RECONSTRUCT_THRESHOLD in reconstructed.c and record pseudocode for all three phases; keep mystery.S unchanged. The untouched demo exits 78 with no successful rows."
				: "The reference matches all six demo rows and full-width changed cases, passes 10,033 reconstruction cases and retains C undefined-behavior checks."
		];
	}
	if (
		selected?.pack === assemblyStackPack &&
		files.some(file => file.name === `${selected.role}/CMakeLists.txt`)
	) {
		return [
			...lines,
			`From the extracted project folder: cd ${selected.role}`,
			"cmake -S . -B build -DCMAKE_BUILD_TYPE=Debug -DCMAKE_C_COMPILER=clang -DCMAKE_ASM_COMPILER=clang",
			"cmake --build build",
			"ctest --test-dir build --output-on-failure",
			"./build/assembly_stack",
			"Call the supplied leaf first for a and then for b. It clears caller-saved registers, so preserve the still-live values and restore the caller frame.",
			"The leaf enters at stack remainder 8 modulo 16. Both call sites require an aligned stack, and all six preserved registers must survive.",
			"Read ../README.md for the complete contract, worked trace, GCC/Release builds and GDB instructions.",
			selected.role === "starter"
				? "Complete STACK_CALLS in routine.S; keep both real leaf calls, live values, aligned call sites and balanced restoration. The untouched demo exits 78 with no successful rows."
				: "The reference returns 30, 38, 10 and 8 in the four demo rows and passes 10,012 full-width pair cases, with actual ordered calls and aligned leaf entries."
		];
	}
	if (
		selected?.pack === assemblyCompilerPack &&
		files.some(file => file.name === `${selected.role}/CMakeLists.txt`)
	) {
		return [
			...lines,
			`From the extracted project folder: cd ${selected.role}`,
			'cmake -S . -B build-O0 -DCMAKE_BUILD_TYPE=Debug -DCMAKE_C_COMPILER=clang -DCMAKE_ASM_COMPILER=clang -DCMAKE_C_FLAGS_DEBUG="-O0 -g"',
			"cmake --build build-O0",
			"ctest --test-dir build-O0 --output-on-failure",
			"./build-O0/assembly_compiler",
			'cmake -S . -B build-O2 -DCMAKE_BUILD_TYPE=Release -DCMAKE_C_COMPILER=clang -DCMAKE_ASM_COMPILER=clang -DCMAKE_C_FLAGS_RELEASE="-O2 -g -DNDEBUG"',
			"cmake --build build-O2",
			"ctest --test-dir build-O2 --output-on-failure",
			"./build-O2/assembly_compiler",
			"mkdir -p observed",
			"clang -std=c17 -O0 -g -S -masm=intel -fverbose-asm model.c -o observed/model-O0.s",
			"clang -std=c17 -O2 -g -S -masm=intel -fverbose-asm model.c -o observed/model-O2.s",
			"objdump -d -M intel build-O0/assembly_compiler > observed/linked-O0.txt",
			"objdump -d -M intel build-O2/assembly_compiler > observed/linked-O2.txt",
			"Both supplied roles work immediately and check 10,013 full-width triplets plus preserved registers. Successful compilation or execution does not complete the analysis worksheet.",
			"Read ../README.md for the exact modular contract, actual generated listings, GCC comparison, changed-case predictions and GDB trace. The commands above run from the selected role folder.",
			selected.role === "starter"
				? "Complete analysis.md with the actual target/flags, four predictions, instruction mapping, optimization comparison, an independent changed case, a debugger trace and a bounded explanation. Keep model.c unchanged for the primary comparison."
				: "The reference analysis.md supplies portable reasoning and a changed-case example; record the current compiler version, real listings and debugger addresses separately."
		];
	}
	if (
		selected?.pack === assemblyDebugPack &&
		files.some(file => file.name === `${selected.role}/CMakeLists.txt`)
	) {
		return [
			...lines,
			`From the extracted project folder: cd ${selected.role}`,
			"cmake -S . -B build -DCMAKE_BUILD_TYPE=Debug -DCMAKE_C_COMPILER=clang -DCMAKE_ASM_COMPILER=clang",
			"cmake --build build",
			"./build/assembly_debug",
			"ctest --test-dir build --output-on-failure",
			"gdb ./build/assembly_debug",
			"The original branch misinterprets a negative int32_t value using an unsigned condition. Inspect debug_branch_decision, the actual next instruction and SF/OF/ZF/CF before editing.",
			"Read ../README.md for the exact count/memory/ABI contract, unchanged tests, actual debugger steps, GCC/Release builds and independently predicted zero-containing case.",
			selected.role === "starter"
				? "Record the failing trace in analysis.md before repairing DEBUG_SIGNED_BRANCH in routine.S. The untouched demo exits 1 with observed=0 expected=2; retain that evidence, make the minimal signed-branch correction and repeat the same trace."
				: "The reference returns observed=2 expected=2 and passes 10,019 cases. Compare the saved faulty/corrected instruction states; passing code alone does not complete analysis.md."
		];
	}
	if (
		selected?.pack === assemblyPerformancePack &&
		files.some(file => file.name === `${selected.role}/CMakeLists.txt`)
	) {
		return [
			...lines,
			`From the extracted project folder: cd ${selected.role}`,
			'cmake -S . -B build-debug -DCMAKE_BUILD_TYPE=Debug -DCMAKE_C_COMPILER=clang -DCMAKE_ASM_COMPILER=clang -DCMAKE_C_FLAGS_DEBUG="-O0 -g"',
			"cmake --build build-debug",
			"ctest --test-dir build-debug --output-on-failure",
			"./build-debug/assembly_performance --example",
			'cmake -S . -B build-release -DCMAKE_BUILD_TYPE=Release -DCMAKE_C_COMPILER=clang -DCMAKE_ASM_COMPILER=clang -DCMAKE_C_FLAGS_RELEASE="-O2 -g -DNDEBUG"',
			"cmake --build build-release",
			"ctest --test-dir build-release --output-on-failure",
			"./build-release/assembly_performance --benchmark > release-default.csv",
			"./build-release/assembly_performance --benchmark 64 3 2 > release-small.csv",
			"Both roles provide a working baseline. The example returns branch=3 cmov=3 indexed=3 expected=3; CTest checks 11 fixed and guard-page cases.",
			"Native validation additionally exercised 10,015 independent cases, for 10,026 per profile, with six preserved registers.",
			"The default benchmark records 60 rows and the changed-count example records 24. Keep matching checksums, every trial, compiler/flags and machine context; no elapsed-time target or universal winner is supplied.",
			"Compare identity/permuted indexed access on nonnegative values first. Permuting mixed signs also changes branch outcomes, and sequential/indexed comparisons add index-load overhead.",
			"Read ../README.md for the exact modulo/count/index contract, actual debugger steps, monotonic-clock limitations and the complete measurement/interpretation sequence.",
			selected.role === "starter"
				? "Complete analysis.md with predictions, successful correctness evidence, actual repeated measurements, instruction mapping, a changed case and a bounded conclusion."
				: "The reference analysis.md explains invariants and confounders; retain current raw measurements and machine context separately."
		];
	}
	if (
		selected &&
		files.some(file => file.name === `${selected.role}/CMakeLists.txt`)
	) {
		return [
			...lines,
			`From the extracted project folder: cd ${selected.role}`,
			"cmake -S . -B build -DCMAKE_BUILD_TYPE=Debug -DCMAKE_C_COMPILER=clang",
			"cmake --build build",
			"ctest --test-dir build --output-on-failure",
			"./build/assembly_demo",
			"Read ../README.md for the exact 32-bit wrapping contract, GCC/Release builds and GDB trace.",

			selected.role === "starter"
				? "The untouched starter builds, fails its contract test, and exits 78 without a successful total. Complete ASM_TRANSFORM in routine.S."
				: "The reference prints total=100 and passes 10,012 arithmetic cases plus preserved-register checks. Compare with saved learner work."
		];
	}
	return [
		...lines,
		"Follow the project README to choose its source files and entry point. For the supplied single-function example:",

		"cc -std=c17 -Wall -Wextra -Wpedantic main.c routine.S -o project",
		"./project"
	];
}
