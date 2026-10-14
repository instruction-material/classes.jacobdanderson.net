import type { PythonIdeFile } from "@/modules/pythonIde";

export const linuxStarterCode = `#!/usr/bin/env bash
set -euo pipefail
if [[ $(uname -s) != Linux ]]; then
    printf 'Use a Linux lab or WSL shell.\\n' >&2
    exit 2
fi
printf 'Hello, Linux!\\n'
`;

export const linuxWorkspaceReadme = `# Linux source workspace

Edit and save scripts, configuration and observations here. Download and
extract the ZIP, then open an ordinary account's terminal in an owned Linux
lab or WSL distribution. Confirm the environment with uname -s and id.

Run the example with bash main.sh. Its output is Hello, Linux! followed by
a newline. A non-Linux shell returns status 2.

Imported course packs keep their selected role, fixtures and complete README.
Follow that guide for commands, predictions, changed cases and restoration.
The browser provides source editing and execution guidance. Shell commands,
permissions, Nginx and scheduler changes run in the external Linux lab.
Record provisioning, serving, restoration and scheduled execution separately
from a successful script. A reference run does not complete the learner record.
`;

export function linuxStarterFiles(): PythonIdeFile[] {
	return [
		{ name: "main.sh", content: linuxStarterCode },
		{ name: "README.md", content: linuxWorkspaceReadme }
	];
}
