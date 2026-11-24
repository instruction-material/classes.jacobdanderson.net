import type { PythonIdeFile } from "@/modules/pythonIde";
import { isValidPythonFileName } from "@/modules/pythonIde";

export function cppBuildInstructions(
	files: PythonIdeFile[],
	courseProjectKey?: string
) {
	const key = courseProjectKey ?? "";
	const intro = [
		"Save and download the ZIP, then extract it before compiling.",
		"The browser edits this C++ project; it does not compile or execute it."
	];
	const cmake = files.find(
		file => file.name === "CMakeLists.txt" && file.encoding !== "base64"
	);
	if (cmake) {
		const instructions = [
			...intro,
			"From the directory containing CMakeLists.txt:",
			"cmake -S . -B cmake-build -DCMAKE_BUILD_TYPE=Debug",
			"cmake --build cmake-build"
		];
		if (
			/^\s*(?:enable_testing\s*\(|include\s*\(\s*CTest\s*\))/im.test(
				cmake.content
			)
		) {
			instructions.push(
				"ctest --test-dir cmake-build --output-on-failure"
			);
		}
		return instructions;
	}
	const standard =
		/^(?:(?:c|cpp)-level-1|cpp-level-[23])(?:[:-]|$)/.test(key) ||
		/^usaco-(?:silver|gold)(?::|$)/.test(key) ||
		/^(?:data-structures-and-algorithms-in-cpp|design-patterns-in-cpp)(?::|$)/.test(
			key
		)
			? 20
			: 17;
	const sources = files
		.filter(
			file =>
				/\.(?:cc|cpp|cxx)$/i.test(file.name) &&
				isValidPythonFileName(file.name) &&
				file.encoding !== "base64"
		)
		.map(file => `'${file.name}'`);
	return [
		...intro,
		...(sources.length
			? [
					`For this console project in a macOS/Linux shell with a C++${standard} compiler:`,
					`c++ -std=c++${standard} -Wall -Wextra -Wpedantic -I. ${sources.join(" ")} -o project`,
					"./project"
				]
			: ["Add a .cpp, .cc or .cxx source file before building."]),
		"Use the course README for custom compiler options, dependencies and input checks."
	];
}
