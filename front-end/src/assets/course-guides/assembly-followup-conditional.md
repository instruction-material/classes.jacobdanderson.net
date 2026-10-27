# Conditional Breakpoints and Reachable Decisions

Continue the completed Unit 10 search program. Keep its signed-branch repair and
unchanged passing contracts. This investigation uses a conditional instruction
breakpoint to distinguish an unwanted stop from a decision that is never reached.
Save predictions and actual observations in `analysis.md`. The baseline contract,
files and build commands follow this activity.

## Predict and stop at the second element

The default array is {-8,-1,4}. Predict first nonnegative index 2. At the second
comparison RCX is 1, R8D represents -1, and CMP against zero gives SF=1, OF=0,
ZF=0 and CF=0. The repaired signed >= branch is not taken. A conditional
breakpoint evaluates an expression when its instruction is reached; a false
condition continues execution instead of stopping.

Build the completed starter in Debug and open its assembly_debug executable:

```text
set disassembly-flavor intel
break *debug_branch_decision if $rcx == 1
run
info registers rcx r8 eflags rip
print (int)$r8
x/i $pc
si
x/i $pc
finish
print /d $rax
```

Retain the real instruction addresses, the condition, second element, flags,
successor and final index. The default run must stop at index 1 and return 2.
With an untouched faulty starter, this instruction is reached at index 0 but the
condition is false. The wrong unsigned branch then returns 0 before index 1 can
be reached. An absent conditional stop does not distinguish those events by
itself. Confirm reachability with an unconditional stop in a separate run.

In a separate demo copy, replace {-8,-1,4} with {-8,0,4} and change the demo's
expected index from 2 to 1. Keep the function and supplied contract tests intact.
Predict the second comparison: ZF=1, SF=0 and OF=0; the signed >= branch is taken
and returns 1. A strict-greater branch would skip zero and return 2. Repeat the
same conditional stop and compare the observed successor.

## Completion record

Retain both predictions, both real stops, branch/return evidence, the two demo
edits and unchanged passing contracts. Explain three separate possibilities:
the location is not reached, the condition is false, or the condition is true
and the debugger stops. A walkthrough can pause at those alternatives before
each run. Restore the ordinary demo before continuing another activity.

Reference: [GDB break conditions](https://sourceware.org/gdb/current/onlinedocs/gdb.html/Conditions.html).
