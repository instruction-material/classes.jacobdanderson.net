import type { PythonIdeFile } from "@/modules/pythonIde";
import { assemblyCourseResource } from "@/modules/assemblyProjectResources";

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
