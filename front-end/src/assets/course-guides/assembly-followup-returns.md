# Caller State Across Two Return Paths

Continue the completed Unit 10 search program and keep the signed-branch repair.
This challenge follows an actual RET into its caller on the found and empty
paths. Matching the returned index alone is insufficient. Save the live stack
word, executed return, caller PC and restored stack position in `analysis.md`.
The baseline contract and setup follow this activity.

## Found path

Open the completed Debug assembly_debug executable. Start at the exact routine
entry, before executing its first instruction:

```text
set disassembly-flavor intel
tbreak *debug_first_nonnegative
run
set $entry_sp = (unsigned long long)$rsp
set $caller_pc = *(unsigned long long*)$rsp
info registers rdi rsi rsp
x/gx $rsp
disassemble /r debug_first_nonnegative
tbreak *debug_found
continue
x/i $pc
si
x/i $pc
info registers rax rsp
x/gx $rsp
si
print (unsigned long long)$pc == $caller_pc
print (unsigned long long)$rsp == $entry_sp + 8
print /d (long long)$rax
```

At debug_found, MOV copies the index to RAX; the following instruction is RET.
The default array returns 2. The final si must execute that RET, producing the
recorded caller PC and entry RSP plus eight. Record the actual addresses from
this run. The routine owns no additional stack frame and must leave the caller's
return word intact before RET consumes it.

## Empty path

Use a separate demo copy. Remove the now-unused values array, set expected to -1,
and replace the call arguments with NULL and 0, including the old sizeof-based
count expression. The function permits a null pointer when count<=0. The supplied
function and tests remain unchanged.

Restart at debug_first_nonnegative and capture new entry/caller values. Disassemble
this build and identify the empty-path MOV RAX,-1 and its actual RET address.
Set an instruction breakpoint at that observed RET address, then continue and
execute it with si. Record RDI=0, RSI=0, RAX=-1, the unchanged return word before
RET, and the caller PC/RSP afterward. Trace the guard to show that no array load
occurs on this path. Addresses and breakpoint numbers from the first run are
not assumed to survive a rebuild.

## Completion record

Retain a found-path and an empty-path instruction table, actual caller-return
checks, predictions and unchanged passing contracts. Explain how finish differs
from executing the final instruction with si: finish resumes through the selected
frame's return, while si exposes each actual instruction. Use the instruction
trace to support the claim about the empty path's lack of array reads. Restore
the default demo after saving the separate case.

Reference: [GDB instruction stepping and finish](https://sourceware.org/gdb/current/onlinedocs/gdb.html/Continuing-and-Stepping.html).
