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
export const assemblyRecordRevision =
	"2ded92a0103d3e518e08cc152a69428d748aafb7";
export const assemblyRecordPack = "ASM-05-unit-1-machine-model-and-toolchain";
export const assemblyArithmeticRevision =
	"0e6243fe594793b931117133c8dc070983af1617";
export const assemblyArithmeticPack = "ASM-06-unit-3-arithmetic-and-logic";
export const assemblySetupRevision = "c6d1886bc119fc83073bdee57a460ae8eb447d9f";
export const assemblySetupPacks = [
	{
		pack: "ASM-01-asm0-setup-and-tooling-supplemental-2",
		revision: assemblySetupRevision,
		roleFiles: [
			"routine.S",
			"main.c",
			"lab.h",
			"tests.c",
			"CMakeLists.txt",
			"trace.md"
		]
	},
	{
		pack: "ASM-02-asm0-setup-and-tooling-supplemental-3",
		revision: assemblySetupRevision,
		roleFiles: [
			"routine.S",
			"main.c",
			"lab.h",
			"tests.c",
			"CMakeLists.txt",
			"trace.md"
		]
	}
] as const;

export const assemblySyscallPacks = [
	{
		pack: "ASM-17-unit-8-system-calls-and-runtime-interaction-supplemental-2",
		revision: "adb2b8410a45cd7be151b186d107b6170510711f",
		coreItemId:
			"assembly-unit-8-system-calls-and-runtime-interaction-curriculum-system-calls-and-runtime-interaction-core-concepts",
		continuationItemIds: [
			"assembly-unit-8-system-calls-and-runtime-interaction-supplemental-system-call-transfer-practice"
		],
		roleFiles: [
			"routine.S",
			"main.c",
			"lab.h",
			"tests.c",
			"abi_checks.S",
			"CMakeLists.txt",
			"trace.md"
		]
	},
	{
		pack: "ASM-18-unit-8-system-calls-and-runtime-interaction-supplemental-3",
		revision: "adb2b8410a45cd7be151b186d107b6170510711f",
		coreItemId:
			"assembly-unit-8-system-calls-and-runtime-interaction-supplemental-system-call-extension-practice",
		roleFiles: [
			"routine.S",
			"main.c",
			"lab.h",
			"tests.c",
			"abi_checks.S",
			"CMakeLists.txt",
			"trace.md"
		]
	}
] as const;

export const assemblyRegisterPacks = [
	{
		pack: "ASM-05-unit-2-registers-and-data-movement-supplemental-2",
		revision: "3e07b75a56e27321180080ef347957d65521f22e",
		roleFiles: [
			"routine.S",
			"main.c",
			"lab.h",
			"model.c",
			"tests.c",
			"abi_checks.S",
			"CMakeLists.txt",
			"trace.md"
		]
	},
	{
		pack: "ASM-06-unit-2-registers-and-data-movement-supplemental-3",
		revision: "3e07b75a56e27321180080ef347957d65521f22e",
		roleFiles: [
			"routine.S",
			"main.c",
			"lab.h",
			"model.c",
			"tests.c",
			"abi_checks.S",
			"CMakeLists.txt",
			"trace.md"
		]
	}
] as const;

export const assemblyLogicPacks = [
	{
		pack: "ASM-07-unit-3-arithmetic-and-logic-supplemental-2",
		revision: "b56c6b50ed43b6c27d1da8117fe507a32f96032d",
		roleFiles: [
			"routine.S",
			"main.c",
			"lab.h",
			"model.c",
			"tests.c",
			"abi_checks.S",
			"CMakeLists.txt",
			"trace.md"
		]
	},
	{
		pack: "ASM-08-unit-3-arithmetic-and-logic-supplemental-3",
		revision: "b56c6b50ed43b6c27d1da8117fe507a32f96032d",
		roleFiles: [
			"routine.S",
			"main.c",
			"lab.h",
			"model.c",
			"tests.c",
			"abi_checks.S",
			"CMakeLists.txt",
			"trace.md"
		]
	}
] as const;

export const assemblyMachinePacks = [
	{
		pack: "ASM-03-unit-1-machine-model-and-toolchain-supplemental-2",
		revision: "6ab461632744b36324d331cd15902acff3204513",
		roleFiles: [
			"routine.S",
			"main.c",
			"lab.h",
			"model.c",
			"tests.c",
			"abi_checks.S",
			"CMakeLists.txt",
			"trace.md"
		]
	},
	{
		pack: "ASM-04-unit-1-machine-model-and-toolchain-supplemental-3",
		revision: "6ab461632744b36324d331cd15902acff3204513",
		roleFiles: [
			"routine.S",
			"main.c",
			"lab.h",
			"model.c",
			"tests.c",
			"abi_checks.S",
			"CMakeLists.txt",
			"trace.md"
		]
	}
] as const;

export const assemblyControlPacks = [
	{
		pack: "ASM-09-unit-4-branching-and-loops-supplemental-2",
		revision: "610827243f0b8369cd5dd59bcfa029966dd24aac",
		roleFiles: [
			"routine.S",
			"main.c",
			"lab.h",
			"model.c",
			"tests.c",
			"abi_checks.S",
			"CMakeLists.txt",
			"trace.md"
		]
	},
	{
		pack: "ASM-10-unit-4-branching-and-loops-supplemental-3",
		revision: "610827243f0b8369cd5dd59bcfa029966dd24aac",
		roleFiles: [
			"routine.S",
			"main.c",
			"lab.h",
			"model.c",
			"tests.c",
			"abi_checks.S",
			"CMakeLists.txt",
			"trace.md"
		]
	}
] as const;

export const assemblyStackOptionalPacks = [
	{
		pack: "ASM-11-unit-5-the-stack-and-function-calls-supplemental-2",
		revision: "ad7243e4c7577630ec04ce50b03661924d2adfef",
		roleFiles: [
			"routine.S",
			"main.c",
			"lab.h",
			"model.c",
			"tests.c",
			"abi_checks.S",
			"CMakeLists.txt",
			"trace.md"
		]
	},
	{
		pack: "ASM-12-unit-5-the-stack-and-function-calls-supplemental-3",
		revision: "ad7243e4c7577630ec04ce50b03661924d2adfef",
		roleFiles: [
			"routine.S",
			"main.c",
			"lab.h",
			"model.c",
			"tests.c",
			"abi_checks.S",
			"CMakeLists.txt",
			"trace.md"
		]
	}
] as const;

export const assemblyAbiOptionalPacks = [
	{
		pack: "ASM-13-unit-6-calling-conventions-and-abi-supplemental-2",
		revision: "b398a79fd3f3ed025540ac2eff178cc7dc697c4a",
		roleFiles: [
			"routine.S",
			"main.c",
			"lab.h",
			"model.c",
			"tests.c",
			"abi_checks.S",
			"CMakeLists.txt",
			"trace.md"
		]
	},
	{
		pack: "ASM-14-unit-6-calling-conventions-and-abi-supplemental-3",
		revision: "b398a79fd3f3ed025540ac2eff178cc7dc697c4a",
		roleFiles: [
			"routine.S",
			"main.c",
			"lab.h",
			"model.c",
			"tests.c",
			"abi_checks.S",
			"CMakeLists.txt",
			"trace.md"
		]
	}
] as const;

export const assemblyMemoryLayoutOptionalPacks = [
	{
		pack: "ASM-15-unit-7-memory-addressing-and-data-structures-supplemental-2",
		revision: "5c2f24f268db0634d11c587328a0ceb3d0aadeb0",
		roleFiles: [
			"routine.S",
			"main.c",
			"lab.h",
			"model.c",
			"tests.c",
			"abi_checks.S",
			"CMakeLists.txt",
			"trace.md"
		]
	},
	{
		pack: "ASM-16-unit-7-memory-addressing-and-data-structures-supplemental-3",
		revision: "5c2f24f268db0634d11c587328a0ceb3d0aadeb0",
		roleFiles: [
			"routine.S",
			"main.c",
			"lab.h",
			"model.c",
			"tests.c",
			"abi_checks.S",
			"CMakeLists.txt",
			"trace.md"
		]
	}
] as const;

export const assemblyVerifiedPacks = [
	...assemblyMemoryLayoutOptionalPacks,
	...assemblyAbiOptionalPacks,
	...assemblyStackOptionalPacks,
	...assemblyControlPacks,
	...assemblyMachinePacks,
	...assemblyLogicPacks,
	...assemblyRegisterPacks,
	...assemblySyscallPacks,
	...assemblySetupPacks,
	{
		pack: assemblyArithmeticPack,
		revision: assemblyArithmeticRevision,
		coreItemId:
			"assembly-unit-3-arithmetic-and-logic-curriculum-core-project-arithmetic-and-logic",
		continuationItemIds: [
			"assembly-unit-3-arithmetic-and-logic-supplemental-register-trace-worksheet-arithmetic-and-logic"
		],
		roleFiles: [
			"routine.S",
			"main.c",
			"arithmetic.h",
			"model.c",
			"tests.c",
			"abi_checks.S",
			"fault.c",
			"fault.S",
			"CMakeLists.txt",
			"trace.md"
		]
	},
	{
		pack: assemblyRecordPack,
		revision: assemblyRecordRevision,
		coreItemId:
			"assembly-unit-1-machine-model-and-toolchain-curriculum-core-project-machine-model-and-toolchain",
		continuationItemIds: [
			"assembly-unit-1-machine-model-and-toolchain-supplemental-register-trace-worksheet-machine-model-and-toolchain"
		],
		roleFiles: [
			"routine.S",
			"main.c",
			"record.h",
			"abi_checks.S",
			"tests.c",
			"CMakeLists.txt",
			"trace.md"
		]
	},
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
	const selected = assemblyCourseResource(url);
	const definition = selected?.definition;
	const savedItemID =
		courseID === "assembly" &&
		definition &&
		"continuationItemIds" in definition &&
		(definition.continuationItemIds as readonly string[]).includes(itemID)
			? definition.coreItemId
			: itemID;
	const base = `${courseID}:${savedItemID}:${role}`;
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
