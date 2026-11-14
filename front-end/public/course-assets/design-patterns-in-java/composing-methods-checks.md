# Composing Methods checks

## application-inputs

Predict Summary.format(), supplier calls and ordered trace events. The supplier returns each listed sample once in order.
1. [12,-5,20], extras true.
2. [-1,0], extras false.
3. [2147483647,2147483647], extras true.

## application-answers

1. count=3|positive=2|total=30|mean=10; 3 calls; [read:0, bonus:0, read:1, read:2, bonus:2]. Adjusted values are 13,-5,22.
2. count=2|positive=0|total=-1|mean=0; 2 calls; [read:0, read:1]. Java division truncates toward zero.
3. count=2|positive=2|total=4724464022|mean=2362232011; 2 calls; [read:0, bonus:0, read:1, bonus:1]. Each adjusted value is 2362232011, requiring long before addition.

## reflection-inputs

Choose a method boundary and explain its cost.
1. A fixed pipeline reads, adjusts and averages once.
2. A proposed computation revisits several stages that share many intermediate results.
3. The supplier is slow, while the computation and stages remain fixed.

## reflection-answers

1. Small helpers with explicit arguments separate effects from pure arithmetic without an extra lifecycle.
2. A per-call method object can own connected intermediate state and stage methods. Compare field invariants, object construction and reset/reuse risks with helper parameter lists. A proposal alone still needs a concrete stage design; it does not force this choice.
3. Slowness alone does not justify moving locals into fields. Preserve one read per sample. Caching across reports changes freshness and failure behavior and requires its own contract.
A sound response gives the actual change pressure, responsibility, setup cost and a removal trigger, rather than selecting an abstraction by line count.

## semantics-inputs

Use count=3, extras true and sample20 wherever a supplier succeeds. Predict prior trace events, supplier calls and exception identity.
1. The sink throws the same chosen exception on read:0.
2. The supplier returns20 once, then throws the same chosen exception.
3. The sink throws the same chosen exception on bonus:0.
Also explain the trace when extras is false.

## semantics-answers

1. The attempted trace is [read:0]; supplier calls0. That exact sink exception propagates.
2. Trace is [read:0, bonus:0, read:1]; supplier calls2. The exact supplier exception propagates; bonus:1 and the third read never occur.
3. Trace is [read:0, bonus:0]; supplier calls1. The exact sink exception propagates; the second read never occurs.
With extras false, positive samples still count as positive but generate no bonus events. No wrapping or rollback removes prior callback effects.

## core-inputs

Keep baseline and oracle unchanged. Predict results and guard each structural edit.
1. [10,9,0,-11], extras true.
2. Empty report with non-null callbacks that would throw if invoked.
3. 1000 Integer.MAX_VALUE samples, extras true.

## core-answers

1. count=4|positive=2|total=9|mean=2; 4 supplier calls. Trace is [read:0, bonus:0, read:1, bonus:1, read:2, read:3]. Sample9 has zero extra and still emits bonus:1.
2. count=0|positive=0|total=0|mean=0; no callback invocations. Null callbacks are still rejected by validation.
3. count=1000|positive=1000|total=2362232011000|mean=2362232011; 1000 supplier calls and 2000 trace events alternating read:i,bonus:i.
Split meanings, extract one read, extract conditional adjustment, then a pure mean query. The core harness remains13218passed after each actual step; record real observations and recoverable diffs.

## understanding-inputs

Compare baseline, helpers and the complete method object.
1. [10,9,0,-11], extras true.
2. count0 with non-null callbacks.
3. Two consecutive independent calls: first [20] with extras, then [-1,0] without extras.

## understanding-answers

1. All three produce Summary(4,2,9,2) and the same six trace events.
2. All produce Summary(0,0,0,0) with no callback calls.
3. First produces Summary(1,1,22,22), trace[read:0,bonus:0]; second Summary(2,0,-1,0), trace[read:0,read:1]. No totals, counters or trace index carry over.
The comparison creates one Computation for each invocation. Helper-only composition needs less setup here. A staged computation with genuinely shared intermediates can justify fields, with a clearly scoped lifecycle. Method-object6609 and core13218 checks support behavior; a reasoned design choice is separate evidence.

## transfer-inputs

Find a counterexample and safe alternative for each change.
1. Substitute Math.floorDiv(total,count) for Java division.
2. Add a positive sample and its extra as int, then assign to long.
3. Replace the captured sample with repeated supplier queries; the supplier can return20, then-5, then10.

## transfer-answers

1. For [-1,0], total/count is0 while floorDiv is-1. Preserve truncation or explicitly revise the contract and tests.
2. Two MAX samples with extras require adjusted2362232011 and total4724464022. Int addition overflows before a later long assignment. Widen the sample before adding.
3. Reading again consumes another sample and can change the condition, adjusted value, call count or exception point. Capture once, then pass that value to pure calculations. A supplier can also throw on the second call, turning a successful one-sample report into a failure.
New rounding or freshness policies are behavior changes with new acceptance cases.

## extension-inputs

Implement the optional array adapter and inspect its copy and delegation.
1. [12,-5,20] with extras, retain the Summary, then change input[0] to100.
2. Empty, null and length1001 arrays.
3. 1000 MAX samples with extras; compare core and complete harness modes.

## extension-answers

1. Return Summary(3,2,30,10); the adapter leaves input unchanged. Changing the caller array later leaves that immutable result unchanged. Inspect the actual cloned array and delegation through the core computation: output alone does not prove the internal copy.
2. Empty returns Summary(0,0,0,0); null raises NullPointerException; length1001 raises IllegalArgumentException.
3. Return Summary(1000,1000,2362232011000,2362232011). Core remains13218passed with or without the adapter; the complete reference reports13226passed. Avoid shared cursor state. The explicit array copy trades allocation for the stated ownership contract.
