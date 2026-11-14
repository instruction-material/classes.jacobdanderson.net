# Applied Java studio cases

## strategy-core-inputs

1. BULK units 4,5,9,10; MEMBER units 6
2. FLAT units 0 and 1000; receipt(BULK,6)
3. quote(null,-1); quote(BULK,-1)

## strategy-core-answers

1. 1400,1500,2700,2500;1620 cents
2. 0 and 400000; BULK|6|1800
3. NullPointerException first; IllegalArgumentException

## strategy-review-inputs

1. Change BULK threshold and compare quote/receipt
2. Compare helper versus three strategy classes
3. Core checks pass without priceUsing

## strategy-review-answers

1. Both entrypoints must use the same updated rule; protect specified original values during this refactor.
2. Helper removes duplication; strategies demonstrate replaceable algorithm collaborators. A decision record must justify added wiring.
3. Optional injection is independent of core behavior.

## strategy-extension-inputs

1. Valid units 6, rule returns 99 and records calls
2. Rule returns -1; rule throws marker
3. Invalid units -1 and null rule

## strategy-extension-answers

1. 99, one call, argument 6
2. IllegalArgumentException; the identical marker propagates
3. IllegalArgumentException before checking rule

## strategy-transfer-inputs

1. Quantities 0 and 1 at 275 with positive minimum 500
2. Quantities 2 and 6 under that rule
3. One fixed rule versus several independently selected rules

## strategy-transfer-answers

1. 0 and 500 cents
2. 550 and 1650 cents
3. A helper/lambda can be sufficient for one fixed formula; independent variation can justify PricingRule.

## strategy-extension-review-inputs

1. Rule throws marker; next FLAT quote for 6
2. Rule returns Long.MAX_VALUE for valid units
3. Valid units with null rule; invalid units with non-null recording rule

## strategy-extension-review-answers

1. Marker unchanged, then 2400 cents
2. Return Long.MAX_VALUE unchanged; no extra arithmetic
3. NullPointerException; IllegalArgumentException with zero callback calls

## wrapper-core-inputs

1. Read a twice, Hi, uppercase true, prefix tag:, cache true
2. Clear then read a again
3. Source fails once then succeeds

## wrapper-core-answers

1. tag:HI twice; attempts 2, source calls 1
2. tag:HI; attempts 3, source calls 2
3. Exact first exception, no cached failure; later successful read loads again.

## wrapper-review-inputs

1. Straße, empty prefix, uppercase true
2. Empty source text, prefix tag:, then repeat with cache
3. Invalid key A before first read

## wrapper-review-answers

1. STRASSE using Locale.ROOT
2. tag: twice; both valid, one source call
3. IllegalArgumentException, attempts 0, source calls 0

## wrapper-extension-inputs

1. Cache a and b; invalidate a twice
2. Cache empty string under a, then invalidate a
3. No-cache ReadDesk invalidate(a); invalidate(A)

## wrapper-extension-answers

1. true then false; b retained; no additional attempts/source calls
2. true
3. false; IllegalArgumentException

## wrapper-transfer-inputs

1. a,a,clear,a through Counting(Cache(Source))
2. Same operations through Cache(Counting(Source))
3. Hi with tag:, Prefix outside Upper versus Upper outside Prefix

## wrapper-transfer-answers

1. x,x,x; count 3, source calls 2
2. x,x,x; count 2, source calls 2
3. tag:HI versus TAG:HI

## wrapper-extension-review-inputs

1. Cached a and b, invalidate a, then read b
2. Empty text cached under a, invalidate a, then read a
3. Read invalid key; source returns null on a valid key

## wrapper-extension-review-answers

1. b stays a hit; invalidation changes neither metric, read adds one attempt only.
2. true then successful reload; source calls increase only on the later read.
3. Invalid key changes no metrics; null result raises NullPointerException after one valid attempt and is not cached.

## architecture-core-inputs

1. Create plan/Read, edit(plan,1,Sketch), edit(plan,1,Stale)
2. Take all snapshot before edit, inspect snapshot afterward
3. Create succeeds in storage, audit sink throws marker

## architecture-core-answers

1. Version 1 create, true/version 2, false/version 2; CREATED then one EDITED.
2. Snapshot still contains Read at version 1; live note is Sketch at version 2.
3. Marker propagates unchanged; find still returns the committed version 1 note.

## architecture-review-inputs

1. Duplicate create for plan; edit missing with version 0
2. Empty text and 80 emoji versus 81 emoji
3. Compile application with fake repository, excluding memory and Composition

## architecture-review-answers

1. IllegalStateException without event; IllegalArgumentException before missing-ID result.
2. Empty and 80 code points accepted; 81 rejected.
3. Application builds and can exercise its boundary without concrete storage.

## architecture-extension-inputs

1. Remove missing ID, remove stale plan version 2 when actual version 1
2. Remove matching plan then recreate it after second
3. Sink throws marker on REMOVED

## architecture-extension-answers

1. false and false; no removal event.
2. REMOVED old version, fresh plan at version 1; insertion order second,plan.
3. Marker propagates unchanged; note remains absent.

## architecture-transfer-inputs

1. Two clients read version 2; first sequential edit expects 2
2. Second sequential edit also expects 2
3. Actual concurrent clients use separate find and save

## architecture-transfer-answers

1. true, new version 3, one EDITED event.
2. false; version 3 retained, no second edit event.
3. Those calls do not guarantee atomicity. The storage contract needs atomic compare-and-update on expected version.

## architecture-extension-review-inputs

1. Snapshot before removing first from first,second; inspect afterward
2. Remove first, retry, recreate first
3. Audit failure after removal versus rollback

## architecture-extension-review-answers

1. Earlier snapshot retains both; current notebook contains only second.
2. true, false, fresh version 1; current order second,first.
3. State is already removed; no automatic rollback or durable event delivery is promised.
