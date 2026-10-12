export const cStarterCode = `#include <stdio.h>

int main(void) {
    puts("Hello, C!");
    return 0;
}
`;

export const cWorkspaceReadme = `# C17 workspace

Edit and save C source here, then download and extract the ZIP. Compilation,
tests, debugging, and sanitizers use a native Clang or GCC toolchain.
For this single-file console starter in a macOS, Linux, or WSL shell:

cc -std=c17 -Wall -Wextra -Wpedantic -Werror main.c -o project
./project

Imported course packs include their unchanged README and CMakeLists.txt.
Follow that README to build each executable and run its contract tests.
Keep diagnostic fixtures separate from the normal program.
`;
