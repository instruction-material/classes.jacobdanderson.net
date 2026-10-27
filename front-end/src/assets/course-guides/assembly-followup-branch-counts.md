# Counted Branch Outcomes and Equal Results

Use the working Unit 11 performance program. Both roles already pass their
contracts. This investigation counts actual decisions for one call rather than
using elapsed time as evidence of which branch ran. Save the count experiment
in `analysis.md`; keep the supplied routines and contract tests unchanged.
The exact baseline interfaces, fixtures and build commands follow this activity.

## Predict one call

The --example input is [-3,0,5,INT64_MAX,INT64_MAX]. It has five visits, four
nonnegative selections and result 3 modulo 2^64. Zero is selected but contributes
nothing to the sum. A hypothetical strict-positive selection would count only
three values while producing the same result. Numeric agreement cannot identify
which zero decision actually ran.

Open the Debug assembly_performance executable. The temporary entry stop limits
the observation to the first branch-routine invocation. The recorded caller
address ends that invocation's observation before later example calls run:

```text
set disassembly-flavor intel
tbreak *sum_nonnegative_branch
run --example
set $caller_pc = *(unsigned long long*)$rsp
set $visits = 0
set $selected = 0
break *performance_branch_decision
commands
silent
set $visits = $visits + 1
if (long long)$r8 >= 0
set $selected = $selected + 1
end
continue
end
tbreak *$caller_pc
continue
print $visits
print $selected
print /u $rax
```

Expect 5 visits, 4 selected outcomes and returned bits 3. The breakpoint is
immediately after TEST R8,R8; JNS takes the nonnegative path. The counter variables
belong to GDB and do not repair or replace the program's calculation. Retain the
actual entry, decision and caller addresses and match them to linked disassembly.
Record and disable the decision breakpoint before continuing other calls, or
close this debugger session after saving the evidence.

Repeat with the example's element 5 changed to 6. Change the printed expected=3
to expected=4 and all three final result equalities from 3 to 4. Keep contract
tests intact. Visit and selection counts remain 5 and
4; returned bits become 4. Explain why branch counts, numerical output and time
measure different properties. Breakpoint instrumentation perturbs execution, so
these debugger runs do not supply benchmark timings.

Retain both predictions, counter results, returned bits, the exact demo changes
and passing contracts. A guided walkthrough can step the first negative and zero
decisions before running the automatic count.

Reference: [GDB breakpoint command lists](https://sourceware.org/gdb/current/onlinedocs/gdb.html/Break-Commands.html).
