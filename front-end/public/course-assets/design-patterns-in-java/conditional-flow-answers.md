# Conditional flow: project self-checks

## baseline

### Baseline observation

LASER gives approved:60 and [training:2>=2, availability:busy=false, decision:approved]. CNC gives busy:0 and [availability:busy=true, decision:busy]. Supervision skips the CNC training probe.

## judgment

### Conditional or variant?

Equivalent inactive outcomes can be consolidated. Ordered denials stay one policy because priority determines the result. Different fee algorithms fit the supplied Policy variants; a single factory dispatch chooses one. Optional observer absence fits a no-op, while required audit absence remains an error.

## decision-table

### Complete valid decision table

Reasons in row order: guest,inactive,closed,too-long,training,busy,approved. The first four valid rows have only decision:reason. Training denial records training:1>=2 then decision:training. Busy records training:2>=2, availability:busy=true, decision:busy. Approval records training:2>=2, availability:busy=false, decision:approved and grants 60 minutes. All denials grant 0. Null audit throws NullPointerException("audit") first, with no audit writes.

## core

### Preserve history and validation

The first appended sequence is training:0>=0, availability:busy=false, decision:approved. The second evaluation appends the same sequence after the first; seed remains first. The earlier snapshot stays unchanged and rejects mutation. Missing machine wins with IllegalArgumentException("machine"); invalid training still raises IllegalArgumentException("trainingLevel") for an inactive member when earlier fields are valid.

## diagnostic

### Find the smallest counterexample

A member with suspended=true,revoked=false exposes AND. A supervised active CNC level 0/20 minute/open/not-busy request exposes an extra training probe if operands are reversed. Any valid guest request exposes two decision events. A null audit must throw NullPointerException("audit"), including when request is null; a no-op hides that required error.

## transfer

### Short-circuit transfer

STANDARD is approved:1 with training:0>=0, availability:busy=false, decision:approved. Supervised CNC 20 is busy:0 with availability:busy=true, decision:busy. CNC 46 is too-long:0 with only decision:too-long. Threshold knowledge does not erase the STANDARD probe, supervision skips training, and duration denial skips both probes.

## extension

### Optional fee and reporter cases

Fees are 4,8,126,16,23 respectively. Approved LASER 60 costs 126 and reports started then completed:approved:126. An absent reporter changes neither decision,credits nor core audit. Guest costs 0. Missing request reports started then failed:IllegalArgumentException:request and rethrows; seed stays. Missing audit reports failure and rethrows NullPointerException("audit"); it stays required.
