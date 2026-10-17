import type { PythonIdeFile } from "@/modules/pythonIde";
import {
	assemblyAbiOptionalPacks,
	assemblyArithmeticPack,
	assemblyArrayPack,
	assemblyCalculatorPack,
	assemblyCompilerPack,
	assemblyControlPacks,
	assemblyCourseResource,
	assemblyDebugPack,
	assemblyHardeningPack,
	assemblyHardeningTracePack,
	assemblyHelperPack,
	assemblyLogicPacks,
	assemblyMachinePacks,
	assemblyMemoryLayoutOptionalPacks,
	assemblyParserPack,
	assemblyPerformancePack,
	assemblyRecordPack,
	assemblyRegisterPacks,
	assemblyReversePack,
	assemblySetupPacks,
	assemblyStackOptionalPacks,
	assemblyStackPack,
	assemblyStringPack,
	assemblySyscallPacks
} from "@/modules/assemblyProjectResources";

export function assemblyBuildInstructions(
	files: PythonIdeFile[],
	starterUrl?: string
) {
	const selected = assemblyCourseResource(starterUrl ?? "");
	const lines = [
		"Save and download the ZIP, then extract it before building.",
		"Assembly compilation, tests and debugging require Linux x86-64, the System V AMD64 ABI, GNU/Clang assembly with the syntax specified in README.md, and a native Clang or GCC toolchain.",
		"The workspace edits and saves source. Use an x86-64 Linux VM or lab on macOS, or an x86-64 WSL distribution on Windows."
	];
	if (
		selected &&
		assemblyMemoryLayoutOptionalPacks.some(
			pack => pack.pack === selected.pack
		)
	) {
		if (
			!selected.definition.roleFiles.every(name =>
				files.some(file => file.name === `${selected.role}/${name}`)
			) ||
			!files.some(file => file.name === "README.md")
		) {
			return [
				...lines,
				"This memory investigation is incomplete. Preserve the saved attempt, then restore all eight selected role files and README.md."
			];
		}
		const table =
			selected.pack === assemblyMemoryLayoutOptionalPacks[0].pack;
		return [
			...lines,
			"Use GNU Intel source syntax and ordinary-user Linux x86-64 with CMake 3.20+, Clang or GCC, GDB and binutils.",
			`From the extracted project folder: cd ${selected.role}`,
			"cmake -S . -B build-Debug -DCMAKE_BUILD_TYPE=Debug -DCMAKE_C_COMPILER=clang -DCMAKE_ASM_COMPILER=clang",
			"cmake --build build-Debug --verbose --parallel 1",
			"./build-Debug/app",
			"ctest --test-dir build-Debug --output-on-failure",
			"./build-Debug/app --changed",
			"cmake -S . -B build-Release -DCMAKE_BUILD_TYPE=Release -DCMAKE_C_COMPILER=clang -DCMAKE_ASM_COMPILER=clang",
			"cmake --build build-Release --verbose --parallel 1",
			"ctest --test-dir build-Release --output-on-failure",
			"./build-Release/app --changed",
			"Repeat with GCC in separate build directories. Explicit comparisons keep all contracts active in Release.",
			table
				? "Complete POINTER_LOOKUP in routine.S. At lab_lookup record the masked index, eight-byte pointer slot and stored record address. At lab_selected compare the sixteen-byte C record and exact tag/state/weight access widths."
				: "Complete COPY_DIRECTION in routine.S. At lab_ready record all sixteen original bytes, both offsets and the clamped count. Follow the actual byte load/store labels and show why the overlap requires the selected direction.",
			"At routine entry RDI and RSI hold the unsigned inputs and RDX the owned output pointer. Preserve RBX, RBP, R12–R15, RSP and the caller return address. The zero-input changed example conceals the named mistakes; retain a separate nonzero or boundary prediction.",
			"objdump -d -M intel build-Debug/app",
			"readelf -Ws build-Debug/CMakeFiles/app.dir/routine.S.o",
			"gdb ./build-Debug/app",
			"In GDB set disassembly-flavor intel, break lab_operation and run. Save set $entry_sp = $rsp, set $return_pc = *(unsigned long long*)$rsp and set $output = $rdx. Record current PCs, valid owned addresses, access widths and values before/after each selected load or store. At lab_return inspect outputs through $output, verify the original stack and step RET to the actual caller PC.",
			"Keep main.c, lab.h, model.c, tests.c and abi_checks.S unchanged. Complete only the named routine task and trace.md. Read ../README.md for the five output fields, predictions and controlled regression. Passing 10269 independent pairs does not complete the memory worksheet.",
			selected.role === "starter"
				? "The untouched program builds but its default demonstration exits 78 and contracts fail. Preserve that observation, make the named repair and export routine.S and trace.md together."
				: "The separate reference passes the unchanged contracts and both demonstrations. Retain actual memory and address evidence beside the predictions."
		];
	}
	if (
		selected &&
		assemblyAbiOptionalPacks.some(pack => pack.pack === selected.pack)
	) {
		if (
			!selected.definition.roleFiles.every(name =>
				files.some(file => file.name === `${selected.role}/${name}`)
			) ||
			!files.some(file => file.name === "README.md")
		) {
			return [
				...lines,
				"This ABI argument investigation is incomplete. Preserve the saved attempt, then restore all eight selected role files and README.md."
			];
		}
		const registers = selected.pack === assemblyAbiOptionalPacks[0].pack;
		return [
			...lines,
			"Use GNU Intel source syntax and ordinary-user Linux x86-64 with CMake 3.20+, Clang or GCC, GDB and binutils.",
			`From the extracted project folder: cd ${selected.role}`,
			"cmake -S . -B build-Debug -DCMAKE_BUILD_TYPE=Debug -DCMAKE_C_COMPILER=clang -DCMAKE_ASM_COMPILER=clang",
			"cmake --build build-Debug --verbose --parallel 1",
			"./build-Debug/app",
			"ctest --test-dir build-Debug --output-on-failure",
			"./build-Debug/app --changed",
			"cmake -S . -B build-Release -DCMAKE_BUILD_TYPE=Release -DCMAKE_C_COMPILER=clang -DCMAKE_ASM_COMPILER=clang",
			"cmake --build build-Release --verbose --parallel 1",
			"ctest --test-dir build-Release --output-on-failure",
			"./build-Release/app --changed",
			"Repeat with GCC in separate build directories. Explicit comparisons keep all contracts active in Release.",
			registers
				? "Complete ARGUMENT_REGISTER in routine.S. Record all six integer argument registers at lab_call and lab_helper, then the returned RAX and cleared caller-saved registers at lab_after_call."
				: "Complete STACK_ARGUMENT in routine.S. Record the caller's argument slot at call-site RSP, the pushed return address and the seventh argument at helper-entry RSP+8. Preserve the 40-byte frame and owned saved slots.",
			"At routine entry, RDI and RSI hold the original unsigned inputs, RDX the owned output pointer. Preserve RBX, RBP, R12–R15 and the caller's stack state. Equal inputs conceal these named mistakes; retain an unequal boundary prediction.",
			"objdump -d -M intel build-Debug/app",
			"readelf -Ws build-Debug/CMakeFiles/app.dir/routine.S.o",
			"gdb ./build-Debug/app",
			"In GDB set disassembly-flavor intel, break lab_operation and run. Save set $entry_sp = $rsp, set $return_pc = *(unsigned long long*)$rsp and set $output = $rdx. At lab_call predict RDI, RSI, RDX, RCX, R8 and R9. Step the helper call, observe the actual return address and argument state, and verify RAX and the original values after the reloads. Record both real return PCs and restored stack.",
			"Keep main.c, lab.h, model.c, tests.c and abi_checks.S unchanged. Complete only the named routine task and trace.md. Read ../README.md for all expected fields, default/changed inputs and controlled regressions. Passing 10269 independent pairs does not complete the worksheet.",
			selected.role === "starter"
				? "The untouched program builds but its default demonstration exits 78 and contracts fail. Preserve that observation, make the minimal repair and export routine.S and trace.md together."
				: "The separate reference passes the unchanged contracts and both demonstrations. Retain actual stack and return-address evidence beside the predictions."
		];
	}
	if (
		selected &&
		assemblyStackOptionalPacks.some(pack => pack.pack === selected.pack)
	) {
		if (
			!selected.definition.roleFiles.every(name =>
				files.some(file => file.name === `${selected.role}/${name}`)
			) ||
			!files.some(file => file.name === "README.md")
		) {
			return [
				...lines,
				"This stack investigation is incomplete. Preserve the saved attempt, then restore all eight selected role files and README.md."
			];
		}
		const lifo = selected.pack === assemblyStackOptionalPacks[0].pack;
		return [
			...lines,
			"Use GNU Intel source syntax and ordinary-user Linux x86-64 with CMake 3.20+, Clang or GCC, GDB and binutils.",
			`From the extracted project folder: cd ${selected.role}`,
			"cmake -S . -B build-Debug -DCMAKE_BUILD_TYPE=Debug -DCMAKE_C_COMPILER=clang -DCMAKE_ASM_COMPILER=clang",
			"cmake --build build-Debug --verbose --parallel 1",
			"./build-Debug/app",
			"ctest --test-dir build-Debug --output-on-failure",
			"./build-Debug/app --changed",
			"cmake -S . -B build-Release -DCMAKE_BUILD_TYPE=Release -DCMAKE_C_COMPILER=clang -DCMAKE_ASM_COMPILER=clang",
			"cmake --build build-Release --verbose --parallel 1",
			"ctest --test-dir build-Release --output-on-failure",
			"./build-Release/app --changed",
			"Repeat with GCC in separate build directories. Explicit comparisons keep all contracts active in Release.",
			lifo
				? "Complete LIFO_POP in routine.S. Trace both owned pushed words and POP destinations at lab_pops, then verify lab_restored and the original return address."
				: "Complete LOCAL_RELOAD in routine.S. Trace the three caller-owned local slots, the aligned nested call, the helper's clobbered argument registers and the return to lab_after_call.",
			"At routine entry, RDI and RSI hold the original unsigned inputs, RDX the owned output pointer. Preserve RBX, RBP, R12–R15 and the caller's stack state. Equal inputs conceal these named mistakes; retain an unequal boundary prediction.",
			"objdump -d -M intel build-Debug/app",
			"readelf -Ws build-Debug/CMakeFiles/app.dir/routine.S.o",
			"gdb ./build-Debug/app",
			lifo
				? "In GDB set disassembly-flavor intel, break lab_operation and run. Save set $entry_sp = $rsp, set $return_pc = *(unsigned long long*)$rsp and set $output = $rdx before stepping. Record both owned pushed words, POP destinations and current PCs. At lab_return inspect the outputs through $output, then step RET to verify the original return PC and restored stack."
				: "In GDB set disassembly-flavor intel, break lab_operation and run. Save set $entry_sp = $rsp, set $return_pc = *(unsigned long long*)$rsp and set $output = $rdx before stepping. Record the owned local slots and actual inner/outer return PCs. Inspect final output through $output because the helper clears RDX, and verify stack restoration.",
			"Keep main.c, lab.h, model.c, tests.c and abi_checks.S unchanged. Complete only the named routine task and trace.md. Read ../README.md for all expected fields, default/changed inputs and controlled regressions. Passing 10269 independent pairs does not complete the worksheet.",
			selected.role === "starter"
				? "The untouched program builds but its default demonstration exits 78 and contracts fail. Preserve that observation, make the minimal repair and export routine.S and trace.md together."
				: "The separate reference passes the unchanged contracts and both demonstrations. Retain actual stack and return-address evidence beside the predictions."
		];
	}
	if (
		selected &&
		assemblyControlPacks.some(pack => pack.pack === selected.pack)
	) {
		if (
			!selected.definition.roleFiles.every(name =>
				files.some(file => file.name === `${selected.role}/${name}`)
			) ||
			!files.some(file => file.name === "README.md")
		) {
			return [
				...lines,
				"This control-flow investigation is incomplete. Preserve the saved attempt, then restore all eight selected role files and README.md."
			];
		}
		const dispatch = selected.pack === assemblyControlPacks[0].pack;
		return [
			...lines,
			"Use GNU Intel source syntax and ordinary-user Linux x86-64 with CMake 3.20+, Clang or GCC, GDB and binutils.",
			`From the extracted project folder: cd ${selected.role}`,
			"cmake -S . -B build-Debug -DCMAKE_BUILD_TYPE=Debug -DCMAKE_C_COMPILER=clang -DCMAKE_ASM_COMPILER=clang",
			"cmake --build build-Debug --verbose --parallel 1",
			"./build-Debug/app",
			"ctest --test-dir build-Debug --output-on-failure",
			"./build-Debug/app --changed",
			"cmake -S . -B build-Release -DCMAKE_BUILD_TYPE=Release -DCMAKE_C_COMPILER=clang -DCMAKE_ASM_COMPILER=clang",
			"cmake --build build-Release --verbose --parallel 1",
			"ctest --test-dir build-Release --output-on-failure",
			"./build-Release/app --changed",
			"Repeat both build profiles with GCC in separate directories. Explicit comparisons keep all contracts active in Release.",
			dispatch
				? "Complete DISPATCH_JOIN in routine.S. Trace the chosen case and its actual successor into lab_join. Compare the selector, result, visited-case mask and comparison count with the unchanged model."
				: "Complete LOOP_EXIT in routine.S. At lab_check explain the unsigned equality boundary before entering lab_body. Retain the count/index/sum/visits/mask invariant and test zero, one and fifteen visits.",
			"RDI holds the selector/count input, RSI the 64-bit payload and RDX the owned output buffer. Preserve RBX, RBP, R12–R15 and the caller's stack state.",
			"objdump -d -M intel --disassemble=lab_operation build-Debug/app",
			"readelf -Ws build-Debug/CMakeFiles/app.dir/routine.S.o",
			"gdb ./build-Debug/app",
			"In GDB set disassembly-flavor intel, break lab_operation and run. Record x/i $pc, registers and flags before si, then inspect the actual successor PC. At lab_join observe the stores; at lab_return inspect all output fields before returning.",
			"Keep main.c, lab.h, model.c, tests.c and abi_checks.S unchanged. Complete only the named routine task and trace.md. Read ../README.md for every expected field, default/changed input, controlled regression and required observation. Passing 10269 independent pairs does not complete the worksheet.",
			selected.role === "starter"
				? "The untouched program builds but exits 78 and its contracts fail. Preserve that observation, make the minimal repair and export routine.S and trace.md together."
				: "The separate reference passes the unchanged contracts and both demonstrations. Retain the current control-flow evidence beside the predictions."
		];
	}
	if (
		selected &&
		assemblyMachinePacks.some(pack => pack.pack === selected.pack)
	) {
		if (
			!selected.definition.roleFiles.every(name =>
				files.some(file => file.name === `${selected.role}/${name}`)
			) ||
			!files.some(file => file.name === "README.md")
		) {
			return [
				...lines,
				"This memory or address investigation is incomplete. Preserve the saved attempt, then restore all eight selected role files and README.md."
			];
		}
		const memory = selected.pack === assemblyMachinePacks[0].pack;
		return [
			...lines,
			"Use GNU Intel source syntax and ordinary-user Linux x86-64 with CMake 3.20+, Clang or GCC, GDB and binutils.",
			`From the extracted project folder: cd ${selected.role}`,
			"cmake -S . -B build-Debug -DCMAKE_BUILD_TYPE=Debug -DCMAKE_C_COMPILER=clang -DCMAKE_ASM_COMPILER=clang",
			"cmake --build build-Debug --verbose --parallel 1",
			"./build-Debug/app",
			"ctest --test-dir build-Debug --output-on-failure",
			"./build-Debug/app --changed",
			"cmake -S . -B build-Release -DCMAKE_BUILD_TYPE=Release -DCMAKE_C_COMPILER=clang -DCMAKE_ASM_COMPILER=clang",
			"cmake --build build-Release --verbose --parallel 1",
			"ctest --test-dir build-Release --output-on-failure",
			"./build-Release/app --changed",
			"Repeat both build profiles with GCC using separate build directories; explicit comparisons keep all checks active in Release.",
			memory
				? "Complete MEMORY_SPAN in routine.S. Draw the 16 owned bytes at RSP in increasing address order. At lab_stage4 load the full eight-byte span from offset 3 and compare all six results with the unchanged byte model."
				: "Complete ADDRESS_SCALE in routine.S. At lab_stage2 preserve the base and displacement while using scale 4. Compare all five 64-bit LEA results with the unchanged model; the generated numeric values remain calculations rather than memory loads.",
			"RDI and RSI hold the two input words or the base/index bit patterns. RDX points to the owned output buffer. Store each full 64-bit result in its assigned slot and preserve RBX, RBP, R12–R15 and the caller's stack state.",
			"objdump -d -M intel --disassemble=lab_operation build-Debug/app",
			"readelf -Ws build-Debug/CMakeFiles/app.dir/routine.S.o",
			"gdb ./build-Debug/app",
			"In GDB set disassembly-flavor intel, break lab_stage0, run, and use x/i $pc and si for the operation and its following store. The PC then already reaches the next stage label. Record registers and output slots there before continuing. For memory, capture x/16bx $rsp; for LEA, compare CMP-produced CF/ZF/SF/OF before and after each calculation.",
			"Keep main.c, lab.h, model.c, tests.c and abi_checks.S unchanged. Complete only the named routine task and trace.md. Read ../README.md for every default/changed row, byte-span and address models, controlled regression and required evidence. Passing 10269 independent operand pairs does not complete the worksheet.",
			selected.role === "starter"
				? "The untouched program builds but exits 78 and its contracts fail. Retain that observation, make the minimal repair and export the saved routine.S and trace.md together."
				: "The separate reference passes the unchanged contracts and both demonstrations. Record the current register and output values beside the prediction."
		];
	}
	if (
		selected &&
		assemblyLogicPacks.some(pack => pack.pack === selected.pack)
	) {
		if (
			!selected.definition.roleFiles.every(name =>
				files.some(file => file.name === `${selected.role}/${name}`)
			) ||
			!files.some(file => file.name === "README.md")
		) {
			return [
				...lines,
				"This comparison or shift investigation is incomplete. Preserve the saved attempt, then restore all eight selected role files and README.md."
			];
		}
		const compare = selected.pack === assemblyLogicPacks[0].pack;
		return [
			...lines,
			"Use GNU Intel source syntax and ordinary-user Linux x86-64 with CMake 3.20+, Clang or GCC, GDB and binutils.",
			`From the extracted project folder: cd ${selected.role}`,
			"cmake -S . -B build-Debug -DCMAKE_BUILD_TYPE=Debug -DCMAKE_C_COMPILER=clang -DCMAKE_ASM_COMPILER=clang",
			"cmake --build build-Debug --verbose --parallel 1",
			"./build-Debug/app",
			"ctest --test-dir build-Debug --output-on-failure",
			"./build-Debug/app --changed",
			"cmake -S . -B build-Release -DCMAKE_BUILD_TYPE=Release -DCMAKE_C_COMPILER=clang -DCMAKE_ASM_COMPILER=clang",
			"cmake --build build-Release --verbose --parallel 1",
			"ctest --test-dir build-Release --output-on-failure",
			"./build-Release/app --changed",
			"Repeat both build profiles with GCC using separate build directories; explicit comparisons keep all checks active in Release.",
			compare
				? "Complete COMPARE_SIGNED in routine.S. CMP produces flags; MOV EAX,0 preserves them before SETcc. Compare all six unsigned, signed and equality decisions with the unchanged model, including opposite-sign boundary inputs."
				: "Complete SHIFT_SIGNED in routine.S. Compare SHL, SHR and SAR using the low six count bits. The 64-bit count wraps at 64; distinguish zero fill from sign fill and record the separate effective-count result.",
			"The contract takes the initial register in RDI, incoming bits in RSI and a valid owned output buffer in RDX. Store each full 64-bit result in its assigned slot. Preserve RBX, RBP, R12–R15 and the caller's stack state.",
			"objdump -d -M intel --disassemble=lab_operation build-Debug/app",
			"readelf -Ws build-Debug/CMakeFiles/app.dir/routine.S.o",
			"gdb ./build-Debug/app",
			"In GDB set disassembly-flavor intel, break lab_stage0 and the later stage labels, run, use info registers rdi rsi rdx rax rcx rip eflags, x/i $pc and si. Record RAX before/after each instruction and x/gx at the output slot after its store. For comparisons record CF/ZF/SF/OF from the producing CMP; for shifts record RCX & 63 and avoid claims about undefined flags.",
			"Keep main.c, lab.h, model.c, tests.c and abi_checks.S unchanged. Complete only the named routine task and trace.md. Read ../README.md for every default/changed row, comparison and shift models, controlled regression and required evidence. Passing 10269 independent operand pairs does not complete the worksheet.",
			selected.role === "starter"
				? "The untouched program builds but exits 78 and its contracts fail. Retain that observation, make the minimal repair and export the saved routine.S and trace.md together."
				: "The separate reference passes the unchanged contracts and both demonstrations. Record the current register and output values beside the prediction."
		];
	}
	if (
		selected &&
		assemblyRegisterPacks.some(pack => pack.pack === selected.pack)
	) {
		if (
			!selected.definition.roleFiles.every(name =>
				files.some(file => file.name === `${selected.role}/${name}`)
			) ||
			!files.some(file => file.name === "README.md")
		) {
			return [
				...lines,
				"This register investigation is incomplete. Preserve the saved attempt, then restore all eight selected role files and README.md."
			];
		}
		const partial = selected.pack === assemblyRegisterPacks[0].pack;
		return [
			...lines,
			"Use GNU Intel source syntax and ordinary-user Linux x86-64 with CMake 3.20+, Clang or GCC, GDB and binutils.",
			`From the extracted project folder: cd ${selected.role}`,
			"cmake -S . -B build-Debug -DCMAKE_BUILD_TYPE=Debug -DCMAKE_C_COMPILER=clang -DCMAKE_ASM_COMPILER=clang",
			"cmake --build build-Debug --verbose --parallel 1",
			"./build-Debug/app",
			"ctest --test-dir build-Debug --output-on-failure",
			"./build-Debug/app --changed",
			"cmake -S . -B build-Release -DCMAKE_BUILD_TYPE=Release -DCMAKE_C_COMPILER=clang -DCMAKE_ASM_COMPILER=clang",
			"cmake --build build-Release --verbose --parallel 1",
			"ctest --test-dir build-Release --output-on-failure",
			"./build-Release/app --changed",
			"Repeat both build profiles with GCC using separate build directories; explicit comparisons keep all checks active in Release.",
			partial
				? "Complete WIDTH_SEED in routine.S. Begin each AL/AX/EAX/RAX write from the full initial register. Byte and word writes retain upper bits; a dword write clears the upper 32 bits. Compare all four snapshots with the unchanged model."
				: "Complete SIGN_BYTE in routine.S. Compare MOVSX, MOVZX and MOVSXD at byte, word and dword widths. A 32-bit destination clears upper bits; a signed 32-to-64 conversion uses MOVSXD. Compare all six snapshots with the unchanged model.",
			"The contract takes the initial register in RDI, incoming bits in RSI and a valid owned output buffer in RDX. Store each full 64-bit result in its assigned slot. Preserve RBX, RBP, R12–R15 and the caller's stack state.",
			"objdump -d -M intel --disassemble=lab_operation build-Debug/app",
			"readelf -Ws build-Debug/CMakeFiles/app.dir/routine.S.o",
			"gdb ./build-Debug/app",
			"In GDB set disassembly-flavor intel, break lab_operation, run and step the seed load. Use break lab_stage0 and the later stage labels, info registers rdi rsi rdx rax rip, x/i $pc and si. Record RAX before/after the width instruction and x/gx at the owned output slot after its store.",
			"Keep main.c, lab.h, model.c, tests.c and abi_checks.S unchanged. Complete only the named routine task and trace.md. Read ../README.md for every default/changed row, unsigned-mask model, controlled regression and required evidence. Passing 10269 independent width cases does not complete the worksheet.",
			selected.role === "starter"
				? "The untouched program builds but exits 78 and its contracts fail. Retain that observation, make the minimal repair and export the saved routine.S and trace.md together."
				: "The separate reference passes the unchanged contracts and both demonstrations. Record the current register and output values beside the prediction."
		];
	}
	if (
		selected &&
		assemblySyscallPacks.some(pack => pack.pack === selected.pack)
	) {
		if (
			!selected.definition.roleFiles.every(name =>
				files.some(file => file.name === `${selected.role}/${name}`)
			) ||
			!files.some(file => file.name === "README.md")
		) {
			return [
				...lines,
				"This syscall project is incomplete. Preserve the saved attempt, then restore all seven selected role files and README.md."
			];
		}
		const write = selected.pack === assemblySyscallPacks[0].pack;
		return [
			...lines,
			"Use GNU Intel source syntax and an ordinary-user Linux x86-64 environment with CMake 3.20+, Clang or GCC, GDB and strace.",
			`From the extracted project folder: cd ${selected.role}`,
			"cmake -S . -B build-Debug -DCMAKE_BUILD_TYPE=Debug -DCMAKE_C_COMPILER=clang -DCMAKE_ASM_COMPILER=clang",
			"cmake --build build-Debug --verbose --parallel 1",
			"./build-Debug/app",
			"ctest --test-dir build-Debug --output-on-failure",
			"./build-Debug/app --changed",
			"cmake -S . -B build-Release -DCMAKE_BUILD_TYPE=Release -DCMAKE_C_COMPILER=clang -DCMAKE_ASM_COMPILER=clang",
			"cmake --build build-Release --verbose --parallel 1",
			"ctest --test-dir build-Release --output-on-failure",
			"./build-Release/app --changed",
			"Repeat both profiles with GCC using separate build directories. The checks stay active in Release.",
			write
				? "Complete SYSCALL_WRITE in routine.S. RDI/RSI/RDX already contain the three arguments; RAX selects write=1. Observe raw EBADF without changing errno, libc conversion, measured pipe capacity C, a positive short write, EAGAIN and the remaining byte-exact transfer."
				: "Complete SYSCALL_ARG4 in routine.S. Transfer argument four from RCX to R10 before openat=257. A returned descriptor alone is insufficient: verify actual requested 0600/0400 file modes, raw EEXIST/ENOENT, libc conversion and cleanup.",
			write
				? "strace -f -yy -s 131072 -e trace=write,read,pipe2,fcntl,close ./build-Debug/app"
				: "strace -f -yy -e trace=openat,fstat,newfstatat,close,unlinkat,mkdir,rmdir,umask ./build-Debug/app",
			"gdb ./build-Debug/app",
			write
				? "In GDB set disassembly-flavor intel, break lab_write_boundary, run, record RAX/RDI/RSI/RDX/RCX/R11, then si and record the actual raw return."
				: "In GDB set disassembly-flavor intel, break lab_openat_boundary, run, record RAX/RDI/RSI/RDX/RCX/R10/R11, then si and record the actual raw return.",
			"RCX/R11 are clobbered by the syscall boundary. Preserve RBX, RBP, R12–R15 and the caller's stack state. Keep main.c, lab.h, tests.c and abi_checks.S unchanged; complete only the named routine task and trace.md.",
			"Read ../README.md for the exact normal/changed rows, kernel-versus-libc error convention, owned-fixture cleanup, controlled regressions and evidence table. Passing tests does not complete trace.md.",
			selected.role === "starter"
				? "The untouched program builds but exits 78 and its contracts fail. Save that observation before completing routine.S; reopening the worksheet retains this same saved attempt."
				: "The separate reference passes the unchanged contracts and the default/changed demonstrations. Record current compiler versions and actual kernel observations beside its reasoning."
		];
	}
	if (
		selected &&
		assemblySetupPacks.some(pack => pack.pack === selected.pack)
	) {
		if (
			!selected.definition.roleFiles.every(name =>
				files.some(file => file.name === `${selected.role}/${name}`)
			) ||
			!files.some(file => file.name === "README.md")
		) {
			return [
				...lines,
				"This setup project is incomplete. Restore the complete selected role and README.md before building; preserve the saved attempt first."
			];
		}
		const symbols = selected.pack === assemblySetupPacks[0].pack;
		return [
			...lines,
			"These two optional setup investigations use GNU AT&T source syntax: movl $LAB_VALUE, %eax writes the immediate value into EAX. The objdump -Mintel display changes the notation, not the instruction. Required course projects keep their documented Intel source syntax.",
			`From the extracted project folder: cd ${selected.role}`,
			"cmake -S . -B build-first -DCMAKE_BUILD_TYPE=Debug -DCMAKE_C_COMPILER=clang -DCMAKE_ASM_COMPILER=clang",
			"cmake --build build-first --verbose --parallel 1",
			"Read README.md and retain the first diagnostic. A link failure is expected for the untouched learner; assembly and linking are separate stages.",
			symbols
				? "Inspect lab_answer with nm -P and readelf -Ws. The learner task is the single .globl lab_answer export in routine.S; the separate caller already requests a global symbol."
				: "Inspect the explicit -x assembler selection in compile_commands.json, the unresolved LAB_VALUE symbol and relocation. The learner task is LAB_ASM_LANGUAGE=assembler-with-cpp in CMakeLists.txt; an independent -E command does not prove the selected build preprocesses.",
			"After the documented change, configure a fresh build directory:",
			"cmake -S . -B build-completed -DCMAKE_BUILD_TYPE=Debug -DCMAKE_C_COMPILER=clang -DCMAKE_ASM_COMPILER=clang",
			"cmake --build build-completed --verbose --parallel 1",
			"ctest --test-dir build-completed --output-on-failure",
			"./build-completed/app",
			"cmake -S . -B build-value73 -DCMAKE_C_COMPILER=clang -DCMAKE_ASM_COMPILER=clang -DLAB_VALUE=73",
			"cmake --build build-value73 --parallel 1",
			"ctest --test-dir build-value73 --output-on-failure",
			"./build-value73/app",
			"The changed build prints answer=73. Repeat the staged object/link commands from README.md with GCC, using separate directories. Record observed symbol binding, relocation, instruction bytes and the controlled regression in trace.md; passing tests does not complete that explanation.",
			selected.role === "starter"
				? "The untouched learner reaches a real link failure. Keep main.c, lab.h and tests.c unchanged; complete only the named directive/build-language choice and the separate trace."
				: `The reference prints answer=${symbols ? 42 : 41} and passes the contract. Predict the regression before changing the source; retain the separate learner attempt.`
		];
	}
	if (selected?.pack === assemblyArithmeticPack) {
		const required = [
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
		];
		if (
			!required.every(name =>
				files.some(file => file.name === `${selected.role}/${name}`)
			) ||
			!files.some(file => file.name === "README.md")
		) {
			return [
				...lines,
				"The arithmetic project is incomplete. Save the current work, then import its selected role with all ten role files and the shared README before using its native commands."
			];
		}
		return [
			...lines,
			`From the extracted project folder: cd ${selected.role}`,
			'cmake -S . -B build-O0 -DCMAKE_BUILD_TYPE=Debug -DCMAKE_C_COMPILER=clang -DCMAKE_ASM_COMPILER=clang -DCMAKE_C_FLAGS_DEBUG="-O0 -g" -DCMAKE_ASM_FLAGS_DEBUG="-O0 -g" -DCMAKE_EXPORT_COMPILE_COMMANDS=ON',
			"cmake --build build-O0 --verbose --parallel 1",
			"./build-O0/assembly_arithmetic",
			"ctest --test-dir build-O0 --output-on-failure",
			"./build-O0/assembly_arithmetic --changed",
			"objdump -d -M intel --disassemble=arithmetic_eval build-O0/assembly_arithmetic",
			"gdb ./build-O0/assembly_arithmetic",
			'cmake -S . -B build-O2 -DCMAKE_BUILD_TYPE=Release -DCMAKE_C_COMPILER=clang -DCMAKE_ASM_COMPILER=clang -DCMAKE_C_FLAGS_RELEASE="-O2 -g -DNDEBUG" -DCMAKE_ASM_FLAGS_RELEASE="-O2 -g -DNDEBUG" -DCMAKE_EXPORT_COMPILE_COMMANDS=ON',
			"cmake --build build-O2 --verbose --parallel 1",
			"ctest --test-dir build-O2 --output-on-failure",
			"./build-O2/assembly_arithmetic --changed",
			"mkdir -p observed",
			"clang -std=c17 -O0 -g -S -masm=intel model.c -o observed/model-O0.s",
			"clang -std=c17 -O2 -g -S -masm=intel model.c -o observed/model-O2.s",
			"Locate ARITH_MUL and ARITH_DIV in routine.S and connect each region to its implicit registers and stored result fields.",
			"Trace ADD/SUB, AND/OR/XOR/TEST/CMP and the implicit RDX:RAX multiplication/division registers. Capture only defined CF/ZF/SF/OF; IDIV flags are undefined for this contract.",
			"The public function rejects zero/overflow division without output writes. After recording predictions, the separate owned arithmetic_fault_probe demonstrates the actual kernel SIGFPE for zero and overflow. Its link omits a sanitizer handler; ordinary C contracts remain sanitized.",
			"For the separate fault experiment, follow ../README.md: ulimit -c 0 in the current lab shell, then gdb --args ./build-O0/arithmetic_fault_probe zero; repeat with overflow. Keep these processes separate from passing contract runs.",
			"Complete trace.md with actual instruction addresses, before/after values, defined flags, changed cases, separate fault evidence and the arithmetic_c_mix O0/O2 comparison. Use compile_commands.json and current listings; this comparison makes no timing claim.",
			"Read ../README.md for the exact nine-operation value/auxiliary/flags/defined contract, GCC comparison and GDB checkpoints. Passing code does not complete the required trace explanation.",
			selected.role === "starter"
				? "Complete ARITH_MUL and ARITH_DIV only in routine.S, plus trace.md in this same saved attempt. The untouched demo builds but exits 78 without successful rows; keep the driver, model, ABI checker and tests unchanged."
				: "The reference prints nine operation rows and one C-helper row and passes 591,123 contract cases per completed profile. Record current compiler versions, actual register states and fault evidence beside the portable reference reasoning."
		];
	}
	if (
		selected?.pack === assemblyRecordPack &&
		[
			"routine.S",
			"main.c",
			"record.h",
			"abi_checks.S",
			"tests.c",
			"CMakeLists.txt",
			"trace.md"
		].every(name =>
			files.some(file => file.name === `${selected.role}/${name}`)
		) &&
		files.some(file => file.name === "README.md")
	) {
		return [
			...lines,
			`From the extracted project folder: cd ${selected.role}`,
			'cmake -S . -B build-O0 -DCMAKE_BUILD_TYPE=Debug -DCMAKE_C_COMPILER=clang -DCMAKE_ASM_COMPILER=clang -DCMAKE_C_FLAGS_DEBUG="-O0 -g" -DCMAKE_ASM_FLAGS_DEBUG="-O0 -g" -DCMAKE_EXPORT_COMPILE_COMMANDS=ON',
			"cmake --build build-O0 --verbose --parallel 1",
			"ctest --test-dir build-O0 --output-on-failure",
			"./build-O0/assembly_demo",
			"./build-O0/assembly_demo --changed",
			"readelf -hW -sW build-O0/CMakeFiles/record_decode.dir/routine.S.o",
			"readelf -Wr -sW build-O0/CMakeFiles/assembly_demo.dir/main.c.o",
			"objdump -dr -M intel build-O0/CMakeFiles/assembly_demo.dir/main.c.o",
			"readelf -hW -lW build-O0/assembly_demo",
			"objdump -d -M intel --disassemble=decode_record build-O0/assembly_demo",
			"gdb ./build-O0/assembly_demo",
			'cmake -S . -B build-O2 -DCMAKE_BUILD_TYPE=Release -DCMAKE_C_COMPILER=clang -DCMAKE_ASM_COMPILER=clang -DCMAKE_C_FLAGS_RELEASE="-O2 -g -DNDEBUG" -DCMAKE_ASM_FLAGS_RELEASE="-O2 -g -DNDEBUG" -DCMAKE_EXPORT_COMPILE_COMMANDS=ON',
			"cmake --build build-O2 --verbose --parallel 1",
			"ctest --test-dir build-O2 --output-on-failure",
			"./build-O2/assembly_demo --changed",
			"Compare actual caller disassembly and compile_commands.json across O0/O2. Record symbols, relocation, executable interpreter and the real GDB address/load-width trace in trace.md.",
			"Read ../README.md for the full memory/ABI contract, predicted byte rows, GCC comparison, object/link/load trail and debugger commands. Passing tests does not complete trace.md; this comparison makes no timing claim.",
			selected.role === "starter"
				? "Complete RECORD_DECODE in routine.S and the required trace.md in this same saved attempt. The untouched program links but exits 78; retain that first result and keep the C driver, tests and ABI checker unchanged."
				: "The reference decodes the records and passes 196,609 contract cases per completed profile. Keep actual compiler/artifact identities and debugger observations beside the reference reasoning."
		];
	}
	if (
		selected?.pack === assemblyCalculatorPack &&
		files.some(file => file.name === `${selected.role}/CMakeLists.txt`)
	) {
		return [
			...lines,
			`From the extracted project folder: cd ${selected.role}`,
			"cmake -S . -B build -DCMAKE_BUILD_TYPE=Debug -DCMAKE_C_COMPILER=clang",
			"cmake --build build",
			"ctest --test-dir build --output-on-failure",
			"./build/assembly_calculator",
			"./build/assembly_calculator '/' -21 3",
			"Read ../README.md for the exact 64-bit wrapping arithmetic, division restrictions, GCC/Release builds and GDB trace.",
			"Invalid inputs, divisor zero and INT64_MIN / -1 are rejected with exit 2 before assembly evaluation.",
			selected.role === "starter"
				? "Addition, subtraction and multiplication already work. Complete CALC_DIV, CALC_AND and CALC_XOR in calculator.S; the untouched demo exits 78 without successful result rows."
				: "The reference prints six valid result rows, passes 12,589 arithmetic cases and returns result=-7 for the negative division example."
		];
	}
	if (
		selected?.pack === assemblyArrayPack &&
		files.some(file => file.name === `${selected.role}/CMakeLists.txt`)
	) {
		return [
			...lines,
			`From the extracted project folder: cd ${selected.role}`,
			"cmake -S . -B build -DCMAKE_BUILD_TYPE=Debug -DCMAKE_C_COMPILER=clang -DCMAKE_ASM_COMPILER=clang",
			"cmake --build build",
			"ctest --test-dir build --output-on-failure",
			"./build/assembly_array",
			"Read ../README.md for the exact function contract, GCC/Release builds, bounded memory cases and GDB trace.",
			selected.role === "starter"
				? "Complete ARRAY_SEARCH in array_routines.S; summation already works. The untouched demo exits 78 with no successful rows."
				: "The reference prints sum=48 and first-match indices 0, 3 and -1 and passes 11,280 array cases."
		];
	}
	if (
		selected?.pack === assemblyStringPack &&
		files.some(file => file.name === `${selected.role}/CMakeLists.txt`)
	) {
		return [
			...lines,
			`From the extracted project folder: cd ${selected.role}`,
			"cmake -S . -B build -DCMAKE_BUILD_TYPE=Debug -DCMAKE_C_COMPILER=clang -DCMAKE_ASM_COMPILER=clang",
			"cmake --build build",
			"ctest --test-dir build --output-on-failure",
			"./build/assembly_strings",
			"Read ../README.md for the exact function contract, GCC/Release builds, bounded memory cases and GDB trace.",
			selected.role === "starter"
				? "Complete COPY_SOURCE_LENGTH in string_routines.S; length and bounded-copy loops are present. The untouched demo exits 78 with no successful rows."
				: "The reference returns source length 8 for full, truncated and zero-capacity copies, stores assem in the six-byte buffer and passes 35,900 string cases."
		];
	}
	if (
		selected?.pack === assemblyHelperPack &&
		files.some(file => file.name === `${selected.role}/CMakeLists.txt`)
	) {
		return [
			...lines,
			`From the extracted project folder: cd ${selected.role}`,
			"cmake -S . -B build -DCMAKE_BUILD_TYPE=Debug -DCMAKE_C_COMPILER=clang -DCMAKE_ASM_COMPILER=clang",
			"cmake --build build",
			"ctest --test-dir build --output-on-failure",
			"./build/assembly_helper",
			"The C helper receives the scaled sum and both signed bounds. Its entry stack remainder is 8 modulo 16; restore stack adjustments and all preserved registers before returning.",
			"Read ../README.md for the complete contract, worked trace, GCC/Release builds and GDB instructions.",
			selected.role === "starter"
				? "Complete CALL_CLAMP in scale_and_clamp.S; the sum-and-scale loop is present. The untouched demo exits 78 with no successful rows."
				: "The reference calls the actual C clamp helper, prints scaled and clamped=40 and scaled and clamped=25, and passes 11,280 helper cases."
		];
	}
	if (
		selected?.pack === assemblyParserPack &&
		files.some(file => file.name === `${selected.role}/CMakeLists.txt`)
	) {
		return [
			...lines,
			`From the extracted project folder: cd ${selected.role}`,
			"cmake -S . -B build -DCMAKE_BUILD_TYPE=Debug -DCMAKE_C_COMPILER=clang -DCMAKE_ASM_COMPILER=clang",
			"cmake --build build",
			"ctest --test-dir build --output-on-failure",
			"./build/assembly_parser",
			"./build/assembly_parser sum 12 -4 7",
			"Invalid commands, operand counts, text and out-of-range values are rejected with exit 2 on stderr and no result rows. A failed parse leaves its output unchanged.",
			"Read ../README.md for the complete contract, worked trace, GCC/Release builds and GDB instructions.",
			selected.role === "starter"
				? "Complete PARSE_SIGN and PARSE_BOUND in parser.S; equality and the digit loop are present. The untouched demo exits 78 with no successful rows."
				: "The reference prints sum=15, max=12 and xor=-9, accepts the full signed 64-bit range and passes 9,157 parser/equality cases."
		];
	}
	if (
		selected?.pack === assemblyReversePack &&
		files.some(file => file.name === `${selected.role}/CMakeLists.txt`)
	) {
		return [
			...lines,
			`From the extracted project folder: cd ${selected.role}`,
			"cmake -S . -B build -DCMAKE_BUILD_TYPE=Debug -DCMAKE_C_COMPILER=clang -DCMAKE_ASM_COMPILER=clang",
			"cmake --build build",
			"ctest --test-dir build --output-on-failure",
			"./build/assembly_reverse",
			"./build/assembly_reverse 13",
			"./build/assembly_reverse -9223372036854775808",
			"Keep C undefined-behavior sanitization enabled. The signed comparison and modular offsets must match the unchanged mystery routine across full-width inputs. Invalid operands are rejected with exit 2 and no result rows.",
			"Read ../README.md for the complete contract, worked trace, GCC/Release builds and GDB instructions.",
			selected.role === "starter"
				? "Complete RECONSTRUCT_THRESHOLD in reconstructed.c and record pseudocode for all three phases; keep mystery.S unchanged. The untouched demo exits 78 with no successful rows."
				: "The reference matches all six demo rows and full-width changed cases, passes 10,033 reconstruction cases and retains C undefined-behavior checks."
		];
	}
	if (
		selected?.pack === assemblyStackPack &&
		files.some(file => file.name === `${selected.role}/CMakeLists.txt`)
	) {
		return [
			...lines,
			`From the extracted project folder: cd ${selected.role}`,
			"cmake -S . -B build -DCMAKE_BUILD_TYPE=Debug -DCMAKE_C_COMPILER=clang -DCMAKE_ASM_COMPILER=clang",
			"cmake --build build",
			"ctest --test-dir build --output-on-failure",
			"./build/assembly_stack",
			"Call the supplied leaf first for a and then for b. It clears caller-saved registers, so preserve the still-live values and restore the caller frame.",
			"The leaf enters at stack remainder 8 modulo 16. Both call sites require an aligned stack, and all six preserved registers must survive.",
			"Read ../README.md for the complete contract, worked trace, GCC/Release builds and GDB instructions.",
			selected.role === "starter"
				? "Complete STACK_CALLS in routine.S; keep both real leaf calls, live values, aligned call sites and balanced restoration. The untouched demo exits 78 with no successful rows."
				: "The reference returns 30, 38, 10 and 8 in the four demo rows and passes 10,012 full-width pair cases, with actual ordered calls and aligned leaf entries."
		];
	}
	if (
		selected?.pack === assemblyCompilerPack &&
		files.some(file => file.name === `${selected.role}/CMakeLists.txt`)
	) {
		return [
			...lines,
			`From the extracted project folder: cd ${selected.role}`,
			'cmake -S . -B build-O0 -DCMAKE_BUILD_TYPE=Debug -DCMAKE_C_COMPILER=clang -DCMAKE_ASM_COMPILER=clang -DCMAKE_C_FLAGS_DEBUG="-O0 -g"',
			"cmake --build build-O0",
			"ctest --test-dir build-O0 --output-on-failure",
			"./build-O0/assembly_compiler",
			'cmake -S . -B build-O2 -DCMAKE_BUILD_TYPE=Release -DCMAKE_C_COMPILER=clang -DCMAKE_ASM_COMPILER=clang -DCMAKE_C_FLAGS_RELEASE="-O2 -g -DNDEBUG"',
			"cmake --build build-O2",
			"ctest --test-dir build-O2 --output-on-failure",
			"./build-O2/assembly_compiler",
			"mkdir -p observed",
			"clang -std=c17 -O0 -g -S -masm=intel -fverbose-asm model.c -o observed/model-O0.s",
			"clang -std=c17 -O2 -g -S -masm=intel -fverbose-asm model.c -o observed/model-O2.s",
			"objdump -d -M intel build-O0/assembly_compiler > observed/linked-O0.txt",
			"objdump -d -M intel build-O2/assembly_compiler > observed/linked-O2.txt",
			"Both supplied roles work immediately and check 10,013 full-width triplets plus preserved registers. Successful compilation or execution does not complete the analysis worksheet.",
			"Read ../README.md for the exact modular contract, actual generated listings, GCC comparison, changed-case predictions and GDB trace. The commands above run from the selected role folder.",
			selected.role === "starter"
				? "Complete analysis.md with the actual target/flags, four predictions, instruction mapping, optimization comparison, an independent changed case, a debugger trace and a bounded explanation. Keep model.c unchanged for the primary comparison."
				: "The reference analysis.md supplies portable reasoning and a changed-case example; record the current compiler version, real listings and debugger addresses separately."
		];
	}
	if (
		selected?.pack === assemblyDebugPack &&
		files.some(file => file.name === `${selected.role}/CMakeLists.txt`)
	) {
		return [
			...lines,
			`From the extracted project folder: cd ${selected.role}`,
			"cmake -S . -B build -DCMAKE_BUILD_TYPE=Debug -DCMAKE_C_COMPILER=clang -DCMAKE_ASM_COMPILER=clang",
			"cmake --build build",
			"./build/assembly_debug",
			"ctest --test-dir build --output-on-failure",
			"gdb ./build/assembly_debug",
			"The original branch misinterprets a negative int32_t value using an unsigned condition. Inspect debug_branch_decision, the actual next instruction and SF/OF/ZF/CF before editing.",
			"Read ../README.md for the exact count/memory/ABI contract, unchanged tests, actual debugger steps, GCC/Release builds and independently predicted zero-containing case.",
			selected.role === "starter"
				? "Record the failing trace in analysis.md before repairing DEBUG_SIGNED_BRANCH in routine.S. The untouched demo exits 1 with observed=0 expected=2; retain that evidence, make the minimal signed-branch correction and repeat the same trace."
				: "The reference returns observed=2 expected=2 and passes 10,019 cases. Compare the saved faulty/corrected instruction states; passing code alone does not complete analysis.md."
		];
	}
	if (
		selected?.pack === assemblyPerformancePack &&
		files.some(file => file.name === `${selected.role}/CMakeLists.txt`)
	) {
		return [
			...lines,
			`From the extracted project folder: cd ${selected.role}`,
			'cmake -S . -B build-debug -DCMAKE_BUILD_TYPE=Debug -DCMAKE_C_COMPILER=clang -DCMAKE_ASM_COMPILER=clang -DCMAKE_C_FLAGS_DEBUG="-O0 -g"',
			"cmake --build build-debug",
			"ctest --test-dir build-debug --output-on-failure",
			"./build-debug/assembly_performance --example",
			'cmake -S . -B build-release -DCMAKE_BUILD_TYPE=Release -DCMAKE_C_COMPILER=clang -DCMAKE_ASM_COMPILER=clang -DCMAKE_C_FLAGS_RELEASE="-O2 -g -DNDEBUG"',
			"cmake --build build-release",
			"ctest --test-dir build-release --output-on-failure",
			"./build-release/assembly_performance --benchmark > release-default.csv",
			"./build-release/assembly_performance --benchmark 64 3 2 > release-small.csv",
			"Both roles provide a working baseline. The example returns branch=3 cmov=3 indexed=3 expected=3; CTest checks 11 fixed and guard-page cases.",
			"Native validation additionally exercised 10,015 independent cases, for 10,026 per profile, with six preserved registers.",
			"The default benchmark records 60 rows and the changed-count example records 24. Keep matching checksums, every trial, compiler/flags and machine context; no elapsed-time target or universal winner is supplied.",
			"Compare identity/permuted indexed access on nonnegative values first. Permuting mixed signs also changes branch outcomes, and sequential/indexed comparisons add index-load overhead.",
			"Read ../README.md for the exact modulo/count/index contract, actual debugger steps, monotonic-clock limitations and the complete measurement/interpretation sequence.",
			selected.role === "starter"
				? "Complete analysis.md with predictions, successful correctness evidence, actual repeated measurements, instruction mapping, a changed case and a bounded conclusion."
				: "The reference analysis.md explains invariants and confounders; retain current raw measurements and machine context separately."
		];
	}
	if (
		(selected?.pack === assemblyHardeningPack ||
			selected?.pack === assemblyHardeningTracePack) &&
		files.some(file => file.name === `${selected.role}/CMakeLists.txt`)
	) {
		return [
			...lines,
			`From the extracted project folder: cd ${selected.role}`,
			"Both supplied programs are a working baseline. The task is recording and explaining binary evidence.",
			"cmake -S . -B build-baseline -DCMAKE_BUILD_TYPE=Debug -DCMAKE_C_COMPILER=clang -DCMAKE_ASM_COMPILER=clang -DLAB_PROFILE=baseline",
			"cmake --build build-baseline",
			"ctest --test-dir build-baseline --output-on-failure",
			"./build-baseline/assembly_hardening",
			"cmake -S . -B build-guard -DCMAKE_BUILD_TYPE=Debug -DCMAKE_C_COMPILER=clang -DCMAKE_ASM_COMPILER=clang -DLAB_PROFILE=guard",
			"cmake --build build-guard",
			"ctest --test-dir build-guard --output-on-failure",
			"cmake -S . -B build-guard-pie -DCMAKE_BUILD_TYPE=Debug -DCMAKE_C_COMPILER=clang -DCMAKE_ASM_COMPILER=clang -DLAB_PROFILE=guard-pie",
			"cmake --build build-guard-pie",
			"ctest --test-dir build-guard-pie --output-on-failure",
			"./build-guard-pie/assembly_hardening ABC",
			"Each profile passes 69 physical/fixed and 10,010 independent cases, for 10,079 per profile. Repeat both optimization levels and compilers as described in ../README.md.",
			"The profiles isolate C stack guarding and position independence. Handwritten instructions remain unchanged; a guard is not a bounds or pointer-validity check.",
			"Read ../README.md for the exact byte/count contract, all three profiles, function disassembly and GDB commands, including show disable-randomization. Record the observed policy and its limits.",
			selected.pack === assemblyHardeningTracePack
				? "Complete trace.md with actual entry registers, executed instructions, returns, changed inputs and debugger-policy evidence. This saved workspace is separate from the static analysis."
				: "Complete analysis.md with predictions, exact build commands, function-scoped guard evidence, ELF types, unchanged results and bounded conclusions. The separate trace worksheet extends this investigation."
		];
	}
	if (
		selected &&
		files.some(file => file.name === `${selected.role}/CMakeLists.txt`)
	) {
		return [
			...lines,
			`From the extracted project folder: cd ${selected.role}`,
			"cmake -S . -B build -DCMAKE_BUILD_TYPE=Debug -DCMAKE_C_COMPILER=clang",
			"cmake --build build",
			"ctest --test-dir build --output-on-failure",
			"./build/assembly_demo",
			"Read ../README.md for the exact 32-bit wrapping contract, GCC/Release builds and GDB trace.",

			selected.role === "starter"
				? "The untouched starter builds, fails its contract test, and exits 78 without a successful total. Complete ASM_TRANSFORM in routine.S."
				: "The reference prints total=100 and passes 10,012 arithmetic cases plus preserved-register checks. Compare with saved learner work."
		];
	}
	return [
		...lines,
		"Follow the project README to choose its source files and entry point. For the supplied single-function example:",

		"cc -std=c17 -Wall -Wextra -Wpedantic main.c routine.S -o project",
		"./project"
	];
}
