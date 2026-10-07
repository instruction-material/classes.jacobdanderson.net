import type { PythonIdeFile } from "@/modules/pythonIde";
import { isValidPythonFileName } from "@/modules/pythonIde";

export function cppBuildInstructions(
	files: PythonIdeFile[],
	courseProjectKey?: string
) {
	const standard = /^(?:(?:c|cpp)-level-1|cpp-level-[23])(?:[:-]|$)/.test(
		courseProjectKey ?? ""
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
		"Save and download the ZIP, then extract it before compiling.",
		"The browser edits this C++ project; it does not compile or execute it.",
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
