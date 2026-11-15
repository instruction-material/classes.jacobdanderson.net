# DPR9 testability case inputs

## pace

Plan: isolate clock access, isolate ID access, isolate output; run the baseline after each step. Keep the no-argument client. Consider adding retry after these changes.

## confidence

Use Clock.fixed at 2026-11-15T12:00:00Z, ID supplier 17, label lamp and count 2. A recording fake collects dependency calls. Repeat with null label and count -1.

## seams

Capture Main baseline once. Its four fields are instant|id|label|count. For the injected candidate, consider null label with count -1; then valid label with count -1; then valid input whose ID supplier returns -1.

## checks

Use the complete Probe.java in the reading, fixed instant 2026-11-15T12:00:00Z and ID 42. Record kit(0), then an accepted label containing spaces and Unicode. Add an invalid-label case whose sink call count remains unchanged.

## core

Refactor only src/journal/DispatchJournal.java. Inject a Clock, IntSupplier and EntrySink; preserve the default constructor. Use lamp(2), fixed instant 2026-11-15T12:00:00Z and ID 17. Then make the sink throw a retained IOException object.

## understanding

Compare a volatile default capture, an injected exact line comparison and a fake that records calls. Run an explicit throw-new-AssertionError check with -da. Decide whether a retry wrapper is structural refactoring.

## transfer

Normalize 2026-11-15T12:00:00Z|17|lamp|2 followed by newline, then 1970-01-01T00:00:00Z|999999|lamp|2 followed by newline. Change count to 1. Try ID 017, count +2, a missing final newline and an empty capture.

## extension

For Entry(1970-01-01T00:00:00Z,17,lamp,2), use delegates that: succeed; throw IOException first then succeed; throw first and second IOExceptions; throw IllegalStateException bad. Keep the same immutable Entry for every attempt.
