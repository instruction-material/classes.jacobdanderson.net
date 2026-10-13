import type { PythonIdeFile } from "@/modules/pythonIde";
import { c17CourseResource } from "@/modules/c17ProjectResources";
import { isValidPythonFileName } from "@/modules/pythonIde";

export function cBuildInstructions(
	files: PythonIdeFile[],
	starterUrl?: string
) {
	const selected = c17CourseResource(starterUrl ?? "");
	const tooling = selected?.pack === "CSE-09-unit-11-systems-tooling";
	const inspector = selected?.pack === "CSE1-Hex-and-Binary-Inspector";
	const bitflag = selected?.pack === "CSE2-Bitflag-Configuration-Parser";
	const textFiles = files.filter(file => file.encoding !== "base64");
	const roles = ["starter", "solution"].filter(role =>
		textFiles.some(file => file.name === `${role}/CMakeLists.txt`)
	);
	const lines = [
		"Save and download the ZIP, then extract it before building.",
		"Native C17 compilation, tests and debugging use Clang or GCC plus CMake; the browser edits and saves the source."
	];
	if (roles.length === 1) {
		const role = roles[0]!;
		return [
			...lines,
			`From the extracted project folder: cd ${role}`,
			"cmake -S . -B build -DCMAKE_BUILD_TYPE=Debug",
			"cmake --build build",
			"ctest --test-dir build --output-on-failure",
			inspector || bitflag
				? "Read ../README.md for the executable name, complete input grammar, boundary predictions and sanitizer option."
				: "Read ../README.md for the executable name, debugger pass, sanitizer build and expected output.",
			...(bitflag
				? [
						"All byte values 0..255 and all four modes are valid. Reserved bits produce a warning; the encryption flag only reports a bit."
					]
				: []),
			...(role === "starter"
				? [
						inspector
							? "With valid input, the untouched learner exits 78 until the three representation functions are completed. Invalid input exits 2 without printing a result. Its contract test checks every 16-bit pattern and initially fails."
							: bitflag
								? "With valid input, the untouched learner exits 78 until the three configuration functions are completed. Invalid input exits 2 without printing a result. Its contract test checks every byte pattern and initially fails."
								: tooling
									? "The untouched learner intentionally fails strict compilation. Follow ../README.md to repair the marked format mismatch, inspect the missing symbol, and diagnose signed overflow before the completed builds pass. Keep warning and sanitizer checks enabled."
									: selected
										? "The untouched learner executable exits 78 and its contract test fails until the named TODOs are completed."
										: "Read ../README.md for the untouched learner's expected failure and the required repairs before comparing completed test output."
					]
				: [
						"Compare the separate reference with a saved learner attempt and explain the boundary tests."
					]),
			...(textFiles.some(file => file.name === "unsafe_probe.c")
				? [
						"Build unsafe_probe.c only with the README's separate diagnostic command; it is excluded from normal CMake targets."
					]
				: [])
		];
	}
	const sources = textFiles.filter(
		file => /\.c$/i.test(file.name) && isValidPythonFileName(file.name)
	);
	return [
		...lines,
		...(sources.length === 1
			? [
					`cc -std=c17 -Wall -Wextra -Wpedantic -Werror -I. '${sources[0]!.name}' -o project`,
					"./project"
				]
			: [
					"Use the project README or CMake targets to select the source files for each executable. Compile test drivers and diagnostic fixtures as separate programs."
				])
	];
}
