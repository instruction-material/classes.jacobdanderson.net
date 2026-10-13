import type { PythonIdeFile } from "@/modules/pythonIde";
import {
	assemblyArrayPack,
	assemblyCalculatorPack,
	assemblyCourseResource,
	assemblyHelperPack,
	assemblyParserPack,
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
