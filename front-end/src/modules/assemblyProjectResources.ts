import { githubRawUrl, parseGitHubResource } from "@/modules/codePreview";

export const assemblySourceRevision =
	"117e34fb8ff90c2046da71090c37e7b45ef20624";
export const assemblyOpeningPack = "ASM-04-asm0-setup-and-tooling";
export const assemblyRoleFiles = [
	"routine.S",
	"main.c",
	"transform.h",
	"abi_checks.S",
	"tests.c",
	"CMakeLists.txt"
] as const;

export const assemblyCalculatorRevision =
	"37756ab58d42d47a3ae1449950125f444691273f";
export const assemblyCalculatorPack = "ASM1-Integer-Calculator";
export const assemblyArrayRevision = "4e82e4d5f02067a830f92c19e148d0822220ffe9";
export const assemblyArrayPack = "ASM2-Array-Sum-and-Search";
export const assemblyStringRevision =
	"3d66cd9cd20139f8176098475193b791edd2bcd8";
export const assemblyStringPack = "ASM3-String-Length-and-Copy";
export const assemblyHelperRevision =
	"4519a6ecbdb0dc6e932932a8af50a24f2449c8ef";
export const assemblyHelperPack = "ASM4-Call-C-Helper-from-Assembly";
export const assemblyParserRevision =
	"b87661c22a4bc08245cac18a0d6b8d672723eec8";
export const assemblyParserPack = "ASM5-Tiny-Command-Line-Parser";
export const assemblyReverseRevision =
	"8856f11c649863d5eee9914658c11cfb801ead4b";
export const assemblyReversePack = "ASM6-Reverse-Engineering-Toy-Program";
export const assemblyStackRevision = "005e375894ade846a1077e96d4880faea680aed8";
export const assemblyStackPack = "ASM-07-unit-5-the-stack-and-function-calls";
export const assemblyCompilerRevision =
	"4fabbbe92deb893d14e2572121fc2393ae426c7b";
export const assemblyCompilerPack = "ASM-08-unit-9-reading-compiler-output";
export const assemblyDebugRevision = "337648e72f375e30b235936f8deb5cd9ac64cfde";
export const assemblyDebugPack =
	"ASM-09-unit-10-debugging-at-instruction-level";
export const assemblyPerformanceRevision =
	"dfe6d181f0e6e793aebf78270f7c391e3a0225aa";
export const assemblyPerformancePack =
	"ASM-10-unit-11-performance-and-code-shape";
export const assemblyHardeningRevision =
	"fd561a16c6855b7816850eaf3aa6206b6fa895da";
export const assemblyHardeningPack =
	"ASM-25-unit-12-security-and-reliability-visibility-supplemental-2";
export const assemblyHardeningTracePack =
	"ASM-26-unit-12-security-and-reliability-visibility-supplemental-3";
export const assemblyVerifiedPacks = [
	{
		pack: assemblyOpeningPack,
		revision: assemblySourceRevision,
		roleFiles: assemblyRoleFiles
	},
	{
		pack: assemblyCalculatorPack,
		revision: assemblyCalculatorRevision,
		roleFiles: [
			"calculator.S",
			"main.c",
			"calculator.h",
			"abi_checks.S",
			"tests.c",
			"CMakeLists.txt"
		]
	},
	{
		pack: assemblyArrayPack,
		revision: assemblyArrayRevision,
		roleFiles: [
			"array_routines.S",
			"main.c",
			"array_routines.h",
			"abi_checks.S",
			"tests.c",
			"CMakeLists.txt"
		]
	},
	{
		pack: assemblyStringPack,
		revision: assemblyStringRevision,
		roleFiles: [
			"string_routines.S",
			"main.c",
			"string_routines.h",
			"abi_checks.S",
			"tests.c",
			"CMakeLists.txt"
		]
	},
	{
		pack: assemblyHelperPack,
		revision: assemblyHelperRevision,
		roleFiles: [
			"scale_and_clamp.S",
			"main.c",
			"helper.c",
			"helper.h",
			"abi_checks.S",
			"tests.c",
			"CMakeLists.txt"
		]
	},
	{
		pack: assemblyParserPack,
		revision: assemblyParserRevision,
		roleFiles: [
			"parser.S",
			"main.c",
			"parser.h",
			"abi_checks.S",
			"tests.c",
			"CMakeLists.txt"
		]
	},
	{
		pack: assemblyReversePack,
		revision: assemblyReverseRevision,
		roleFiles: [
			"reconstructed.c",
			"mystery.S",
			"main.c",
			"reverse.h",
			"abi_checks.S",
			"tests.c",
			"CMakeLists.txt"
		]
	},
	{
		pack: assemblyStackPack,
		revision: assemblyStackRevision,
		roleFiles: [
			"routine.S",
			"main.c",
			"stack.h",
			"abi_checks.S",
			"tests.c",
			"CMakeLists.txt"
		]
	},
	{
		pack: assemblyCompilerPack,
		revision: assemblyCompilerRevision,
		roleFiles: [
			"model.c",
			"model.h",
			"main.c",
			"tests.c",
			"abi_checks.S",
			"CMakeLists.txt",
			"analysis.md"
		]
	},
	{
		pack: assemblyDebugPack,
		revision: assemblyDebugRevision,
		roleFiles: [
			"routine.S",
			"debug_lab.h",
			"main.c",
			"tests.c",
			"abi_checks.S",
			"CMakeLists.txt",
			"analysis.md"
		]
	},
	{
		pack: assemblyPerformancePack,
		revision: assemblyPerformanceRevision,
		roleFiles: [
			"loops.S",
			"performance.h",
			"dataset.c",
			"main.c",
			"tests.c",
			"abi_checks.S",
			"CMakeLists.txt",
			"analysis.md"
		]
	},
	{
		pack: assemblyHardeningPack,
		revision: assemblyHardeningRevision,
		roleFiles: [
			"analysis.md",
			"trace.md",
			"bytes.S",
			"model.c",
			"main.c",
			"hardening.h",
			"tests.c",
			"abi_checks.S",
			"CMakeLists.txt"
		]
	},
	{
		pack: assemblyHardeningTracePack,
		importPack: assemblyHardeningPack,
		revision: assemblyHardeningRevision,
		roleFiles: [
			"trace.md",
			"analysis.md",
			"bytes.S",
			"model.c",
			"main.c",
			"hardening.h",
			"tests.c",
			"abi_checks.S",
			"CMakeLists.txt"
		]
	}
] as const;

export function assemblyCourseResource(url: string) {
	const resource = parseGitHubResource(url);
	if (
		!resource ||
		resource.owner.toLowerCase() !== "instruction-material" ||
		resource.repo.toLowerCase() !== "assembly"
	) {
		return null;
	}
	const [pack, role, ...rest] = resource.path.split("/");
	const definition = assemblyVerifiedPacks.find(
		p => p.pack === pack && p.revision === resource.ref
	);
	if (
		!definition ||
		rest.length ||
		(role !== "starter" && role !== "solution")
	) {
		return null;
	}
	return { resource, pack, role, definition };
}

export function assemblyCourseProjectKey(
	courseID: string,
	itemID: string,
	role: "starter" | "reference",
	url: string
) {
	const base = `${courseID}:${itemID}:${role}`;
	return courseID === "assembly" && assemblyCourseResource(url)
		? `${base}:native-assembly`
		: base;
}

export function assemblyImportFiles(url: string) {
	const selected = assemblyCourseResource(url);
	if (!selected) return null;
	const { resource, pack, role, definition } = selected;
	const importPack =
		"importPack" in definition ? definition.importPack : pack;
	return [
		...definition.roleFiles.map(name => `${role}/${name}`),
		"README.md"
	].map(name => {
		const path = `${importPack}/${name}`;
		return {
			name,
			file: {
				path,
				htmlUrl: `https://github.com/${resource.owner}/${resource.repo}/blob/${resource.ref}/${path}`,
				rawUrl: githubRawUrl(resource, path),
				label: name,
				size: null
			}
		};
	});
}
