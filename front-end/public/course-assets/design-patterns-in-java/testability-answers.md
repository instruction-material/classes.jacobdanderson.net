# DPR9 testability self-checks

## pace

Each extraction can preserve behavior and be reviewed separately. The default constructor remains an assembly point; the injected constructor admits exact collaborators. Retrying is a later feature change: the core still writes once. A passing baseline is the rollback checkpoint, while the core checks additionally prove the supplied collaborators are actually used.

## confidence

The valid result is 2026-11-15T12:00:00Z|17|lamp|2 followed by a newline. Calls are clock, id, sink, once each. Invalid input throws NullPointerException with message label and records no dependency calls. This replaces process-wide clock/output control with explicit inputs; a recording fake observes its interface calls rather than a real service's persistence.

## seams

The first two fields vary in default captures. The last two remain lamp and 2. Null label wins over count and makes no dependency calls. Invalid count reports count before dependency calls. Invalid supplied ID is rejected after obtaining time and ID and before the sink. Preserve output/returned Entry agreement; direct helper extraction alone does not let a caller control the clock.

## checks

The first line is exactly 2026-11-15T12:00:00Z|42|kit|0 with its final newline. The returned Entry equals the value recorded by the sink. Preserve accepted label characters rather than trimming. A changed count must fail the explicit line comparison under -ea and -da. Separate probe checks leave ContractChecks unchanged and make each expected observation inspectable.

## core

The fixed line is 2026-11-15T12:00:00Z|17|lamp|2 plus newline, with clock/id/sink called once in that order. The failing sink produces UncheckedIOException with message journal and the original IOException as cause after one attempt. Constructor null checks occur clock, ids, sink. Label errors precede count errors and every dependency call. Baseline and core contracts pass with assertions enabled and disabled.

## understanding

Default characterization protects output shape, return agreement, bounds and validation. Injected checks protect exact controlled results; recording fakes add call order and count. Clock, IntSupplier and EntrySink are supplied through ordinary construction; a container is unnecessary. Explicit failures execute under -da while the assert keyword may be disabled. Retry changes failure behavior and needs its own declared contract and checks.

## transfer

The two valid captures normalize to <time>|<id>|lamp|2 followed by newline. Count 1 instead produces <time>|<id>|lamp|1, so the approval changes. All four malformed examples throw IllegalArgumentException with message line; null throws NullPointerException with message line. Mask only time and ID, validate canonical fields and retain label/count. This optional task can pass while the journal and retry remain at starter.

## extension

Attempt counts are 1, 2, 2 and 1. Two IOExceptions propagate the second with the first suppressed when their identities differ; a repeated same exception avoids self-suppression. Runtime failures propagate unchanged after one attempt. Null delegate/entry are rejected before delegation. The policy assumes IOException means no commit. Real partial writes or lost acknowledgments require idempotence or reconciliation before retry is suitable.
