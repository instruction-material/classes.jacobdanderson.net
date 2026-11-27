const sharedSetup =
	"Use a C++20 compiler and check its version with `c++ --version`. On macOS, use Apple Clang with the Xcode Command Line Tools. On Linux, use GCC or Clang. On Windows, run the Linux commands in WSL. Use the site IDE to edit, save and export the project, then open a terminal in the extracted folder to compile and run it.";

const toolchainFallback =
	"If the shell cannot find `c++`, check for `clang++` or `g++` and use the available compiler in the commands. For Make projects, select that compiler explicitly with `make CXX=clang++` or `make CXX=g++`. If the compiler rejects `-std=c++20`, select a C++20-capable installation and rerun the same build.";

const firstProgram =
	"[Program Setup, Syntax, and Compile-Run Cycle](/courses#c-level-1-cppf1-variables-types-strings-and-input-output-c-level-1-cppf1-variables-types-strings-and-input-output-curriculum-program-setup-syntax-and-compile-run-cycle)";
const lifetimeProject =
	"[Lifetime Tracing Warm-Up](/courses#cpp-level-2-cppm0-lifetime-references-and-ownership-framing-cpp-level-2-cppm0-lifetime-references-and-ownership-framing-curriculum-cppm0-project-1-lifetime-tracing-warm-up)";
const buildCheckpoint =
	"[Build and Debug Checkpoint](/courses#cpp-level-3-cppi0-bridge-course-setup-and-positioning-cpp-level-3-cppi0-bridge-course-setup-and-positioning-curriculum-cppi0-project-build-and-debug-checkpoint)";

const commandBlock = (lines: string[]) => ["```sh", ...lines, "```"].join("\n");

export const cppToolchainGuidance: Partial<
	Record<
		string,
		{
			setup: string;
			upgrade: string;
			fallback: string;
			reproduce: string;
			smoke: string;
			drift: string;
		}
	>
> = {
	"c-level-1": {
		setup: sharedSetup,
		upgrade:
			"Repeat the Hello, C++! exercise from a fresh folder after changing compiler or editor. Record the version and whether the same command compiles without warnings. Run the newly built executable, then compare its one-line output with the predicted greeting.",
		fallback: toolchainFallback,
		reproduce:
			"Keep `main.cpp`, the working folder, the compiler name and version, the build command and the exact greeting together. Recompile after editing and verify the new greeting from the resulting executable.",
		smoke: [
			`Save the complete program from ${firstProgram} as main.cpp in an empty folder. Predict the output, then run these commands from that folder.`,
			commandBlock([
				"c++ --version",
				"c++ -std=c++20 -Wall -Wextra -Wpedantic main.cpp -o app",
				"./app"
			]),
			"Expect one line containing `Hello, C++!`. Change the greeting, rebuild, and verify the new line. In a guided review, predict both outputs and point to the command that creates the executable."
		].join("\n\n"),
		drift: "A student edits the greeting, runs `./app` and still sees the old text. Another student's compiler rejects `-std=c++20`. Record the action and message in each case, choose a next command, and rerun the affected stage. A rebuild checks the first case. Checking the compiler version and selecting a toolchain that supports C++20 checks the second."
	},
	"cpp-level-2": {
		setup: `${sharedSetup} Use Make and a compiler with AddressSanitizer and UndefinedBehaviorSanitizer for the debug build. The ordinary and debug builds of ${lifetimeProject} run the same trace.`,
		upgrade:
			"In a fresh export, rebuild both targets and compare the named scores and alias relationships. Addresses can differ across builds. A missing sanitizer, new diagnostic or changed score calls for a separate check, even if the ordinary build starts.",
		fallback: `${toolchainFallback} If the debug build cannot find sanitizer libraries, use the ordinary build to complete the trace and repeat the debug check with a supported Clang or GCC toolchain. Record which build supplied each observation.`,
		reproduce:
			"Keep the starter's Makefile beside main.cpp. Record the ordinary and debug commands, sanitizer availability, the exit results and the named scores. Compare addresses for equality only within a single run.",
		smoke: [
			`Export the starter from ${lifetimeProject}. In the extracted folder, predict Taylor's score after the copy and reference calls. Build and compare both configurations.`,
			commandBlock(["make main main-debug", "./main", "./main-debug"]),
			"Both runs should report Taylor at 70 after the copy, Taylor at 80 after the reference update, and Morgan at 100. The debug run should produce no sanitizer report. In a guided review, explain the address relationships separately from the score changes."
		].join("\n\n"),
		drift: "Two successful traces display different hexadecimal addresses and the same scores. A second computer builds `main` but fails to link `main-debug` because its sanitizer library is missing. Explain which differences affect the trace and which affect verification. Record the version and output, then repeat the debug build on a toolchain with sanitizer support."
	},
	"cpp-level-3": {
		setup: `${sharedSetup} Start with Make inside the ${buildCheckpoint} export. The lesson also documents a CMake and CTest route from the full source repository.`,
		upgrade:
			"After changing the compiler or build generator, use a fresh export. Confirm that both Make targets build, then check that the untouched starter still reports the same failed fixtures and the repaired program passes all seven. Record any change in diagnostics or executable location.",
		fallback: `${toolchainFallback} The project lesson also gives a direct compiler command for the three implementation files. With the full repository and CMake 3.20 or later, use the named CMake targets and run their CTest checks.`,
		reproduce:
			"Save the compiler version, build tool, working directory and names of the three implementation files. Record the normal output, the exit status of `--check` and the failing fixture names before and after the fix.",
		smoke: [
			`Export the starter from ${buildCheckpoint}. From that folder, run the three commands separately and predict which check should fail before editing the source.`,
			commandBlock([
				"make checkpoint checkpoint-debug",
				"./checkpoint",
				"./checkpoint --check"
			]),
			"The unchanged starter prints scores 40, 60 and 80 with a total of 140. The mixed check expects 180 and fails. Follow the linked project to trace and repair the calculation. Rebuild and run all seven checks. During a guided review, explain how a clean compile can coexist with a failing check."
		].join("\n\n"),
		drift: "A clean compile followed by a failing mixed check with expected total 180 and actual total 140 reproduces the starter defect. An undefined-symbol message when building only main.cpp means the other implementation files did not reach the linker. Record the command and failure stage for each case. Repeat with the complete Make target before comparing test output."
	}
};
