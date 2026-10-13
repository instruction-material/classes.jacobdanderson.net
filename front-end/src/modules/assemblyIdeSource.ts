import type { PythonIdeFile } from "@/modules/pythonIde";

export const assemblyStarterCode = `#if !defined(__linux__) || !defined(__x86_64__)
#error "Use the Linux x86-64 System V target."
#endif
.intel_syntax noprefix
.text
.global transform_value
.type transform_value, @function
transform_value:
    lea eax, [rdi + rdi + 5]
    ret
.size transform_value, .-transform_value
.section .note.GNU-stack,"",@progbits
`;

export const assemblyWorkspaceReadme = `# Assembly workspace

Edit and save the source here, then download and extract the ZIP. This example
uses Linux x86-64, the System V AMD64 ABI and GNU/Clang Intel-syntax .S files.
Use an x86-64 Linux lab or WSL environment for compilation and debugging.
The C caller passes three; the assembly function returns eleven.

cc -std=c17 -Wall -Wextra -Wpedantic main.c routine.S -o project
./project

The output is result=11 followed by a newline. Imported course packs retain
their complete README and selected role directory. Follow that guide for
CMake, contract tests and the debugger trace rather than mixing role files.
`;

export function assemblyStarterFiles(): PythonIdeFile[] {
	return [
		{ name: "routine.S", content: assemblyStarterCode },
		{
			name: "main.c",
			content:
				'#include <stdio.h>\nextern int transform_value(int input);\nint main(void) { printf("result=%d\\n", transform_value(3)); return 0; }\n'
		},
		{ name: "README.md", content: assemblyWorkspaceReadme }
	];
}
