import type { PythonIdeFile } from "@/modules/pythonIde";
import {
	assemblyArrayPack,
	assemblyCalculatorPack,
	assemblyCourseResource,
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
