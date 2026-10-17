import extensionReading from "../../assets/course-guides/assembly-register-extension.md?raw";
import partialReading from "../../assets/course-guides/assembly-register-partial.md?raw";

export const assemblyPartialRegisterReading = [
	"## Optional register-width investigation",
	"",
	"After the required integer calculator, isolate data movement from arithmetic. This investigation compares four destination widths from the same initial RAX, so each observation answers which bits a write changes. Predict every row before running the untouched learner and separate reference. Complete only WIDTH_SEED in routine.S, retain the unchanged checks, and explain the observed transitions in trace.md.",
	"",
	partialReading.trim()
].join("\n");

export const assemblyWideningReading = [
	"## Optional interpretation investigation",
	"",
	"Continue from the register-width investigation by interpreting the same low bits as signed and unsigned values. This separate project compares six widening operations. A value that looks positive in one width may be negative in another. Complete only SIGN_BYTE in routine.S; record the operand width, interpretation and full destination result before and after each step in trace.md.",
	"",
	extensionReading.trim()
].join("\n");
