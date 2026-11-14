# Java pattern appendix cases

## prerequisite-inputs

1. A constructor receives PricingRule; its method calls priceFor(3).
2. Independent snapshot of [a,b], then input list gains c.
3. Validate, save a Note, then audit throws.

## prerequisite-answers

1. The composing caller chooses the implementation; that supplied object receives argument3.
2. The snapshot remains [a,b]; mutable elements would need a separate ownership rule.
3. Save has committed; audit failure alone does not prove or perform rollback.

## strategy-inputs

1. BULK quantities4,5,9,10; MEMBER6.
2. receipt(BULK,6) versus quote(BULK,6).
3. Null plan with invalid units versus valid plan with invalid units.

## strategy-answers

1. 1400,1500,2700,2500 cents; MEMBER1620.
2. BULK|6|1800 versus1800, agreeing about total.
3. NullPointerException before quantity validation; IllegalArgumentException for invalid quantity.

## observer-inputs

1. Capture[A,B]; A closes B during its callback; publish again.
2. A throws before B during the first event.
3. The same Consumer subscribes twice; close one registration.

## observer-answers

1. First event reaches A then B; next captured list contains A only.
2. The same exception propagates and B does not run for that publication.
3. One independent registration remains for a later captured list.

## factory-inputs

1. BOXED Notes/[one,two], count true, footer End.
2. PLAIN heading and BOXED body product used together.
3. BOXED Notes with empty body, count false and empty footer.

## factory-answers

1. [Notes] then | one | then | two | then Lines: 2 then End, each with LF.
2. Reject mismatched Style metadata with IllegalArgumentException.
3. [Notes] followed by LF only.

## command-inputs

1. New ReplaceCommand: Ready to Checked, then undo.
2. Try executing that one-shot command again.
3. After execute, change text to Other, then undo.

## command-answers

1. Text Checked/DONE after execute; Ready/UNDONE after undo.
2. Reject the invalid phase; no redo is supplied.
3. Reject stale undo, retain Other and DONE. This is a value guard, not revision identity.

## notebook-inputs

1. Create plan/Read; edit(plan,1,Sketch); edit(plan,1,Stale).
2. Snapshot before the first edit, then inspect it afterward.
3. Audit throws after a save.

## notebook-answers

1. Create version1; first edit true/version2; second false/version2, with no second edit event.
2. Snapshot retains Read/version1; live notebook has Sketch/version2.
3. Exact exception propagates; saved state remains committed.
