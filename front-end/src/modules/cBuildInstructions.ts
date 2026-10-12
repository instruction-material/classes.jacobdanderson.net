import type { PythonIdeFile } from "@/modules/pythonIde";
import { isValidPythonFileName } from "@/modules/pythonIde";

export function cBuildInstructions(files: PythonIdeFile[]) {
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
			"Read ../README.md for the executable name, debugger pass, sanitizer build and expected output.",
			...(role === "starter"
				? [
						"The untouched learner executable exits 78 and its contract test fails until the named TODO is completed."
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
