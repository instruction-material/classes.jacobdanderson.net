import compareReading from "../../assets/course-guides/assembly-logic-compare.md?raw";
import shiftReading from "../../assets/course-guides/assembly-logic-shift.md?raw";

export const assemblyComparisonReading = [
	"## Optional comparison investigation",
	"",
	"After the required arithmetic project, turn comparison flags into six concrete decisions. Interpret the same operand bits as unsigned values, signed values and equal values, then predict each result before running either role. Complete only COMPARE_SIGNED in routine.S and record the CMP flags, SETcc result and stored value in trace.md. Preserve the unchanged contracts and the separate reference attempt.",
	"",
	compareReading.trim()
].join("\n");

export const assemblyShiftReading = [
	"## Optional variable-count investigation",
	"",
	"Continue from the arithmetic project by separating logical shifts from signed arithmetic shifts. Predict how the 64-bit operand and the effective CL count affect each result, including counts 0, 63, 64 and 65. Complete only SHIFT_SIGNED in routine.S and record the before/after register and stored result in trace.md. Read the complete guide for the mathematical models, controlled regression and debugger checkpoints.",
	"",
	shiftReading.trim()
].join("\n");
