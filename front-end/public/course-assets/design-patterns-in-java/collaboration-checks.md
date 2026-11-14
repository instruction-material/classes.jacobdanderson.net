# Collaboration cases

## Application inputs

Restore document A's captured a after replacing it with b; try another document's snapshot. Publish to A/B while A closes B and adds C. Construct a B command while target is A, change target to C before execute, then undo; include an external different-value stale edit.

## Application answers

Restoring the valid snapshot returns the same document to a. A foreign snapshot raises IllegalArgumentException and leaves text unchanged. The first captured dispatch calls A,B; the next calls A,C. Command execution captures C, applies B and becomes DONE; undo restores C and becomes UNDONE. A different-value external edit makes undo raise IllegalStateException without changing text or DONE phase. Repeated execute/undo are rejected.

## Reflection inputs

Compare subscriber notification, first-rejection checks and peer coordination. Compare owner-state restoration with a prototype copy and a new visitor operation with a new node type.

## Reflection answers

Observer visits a captured registration list in order until a listener throws; Chain evaluates ordered checks until rejection/exception; Mediator owns the model/history/notification ordering among peers. Memento restores state on the existing owner, whereas Prototype creates another configured object. A new operation can be a new visitor over existing types; a new node type changes the visitor contract and all implementations. Direct callbacks/functions, a plain state value or a small switch can be simpler when those separate boundaries add no useful variation or ownership.

## Lifecycle inputs

Trace foreign snapshot, different-value stale undo, replacement notification failure, undo notification failure and nested editor mutations. For failed replacement notification, remove the bad subscription and undo.

## Lifecycle answers

Foreign restore raises IllegalArgumentException before mutation. Stale command undo raises IllegalStateException, preserving current text and DONE. After a failed replacement notification, the edit is already applied and its command is on history; the observer exception propagates. Closing that observer permits a later undo that restores the original and pops history. After a failed undo notification, restoration/pop are already committed; a further empty undo returns false. Nested replace/undo raises IllegalStateException before mutation. The outer finally releases its guard, and read-only notification callbacks see committed text/depth. Restoring model text cannot reverse arbitrary earlier callback effects.

## Core inputs

Predict Main's eight lines, duplicate subscriptions/closing, first rejecting check, null verdict, empty visitor group and leaf count, reentrant editor mutations and post-commit notification failure.

## Core answers

Main prints:

```text
replace:Ready->Checked
true
false
undo:Checked->Ready
true
Ready:0
[a,[b,c]]
3
```

Two registrations of the same Consumer both run; closing one leaves the other active. Chain stops at its first rejection; null Verdict raises NullPointerException. Empty group renders [] and counts 0; empty Text still counts 1. The busy guard rejects nested mutations. A listener exception stops later listeners after model/history commit; it does not erase the edit or undo. Core reports 130 passed with optional subscribeOnce unfinished. The complete reference reports 142 passed.

## Understanding inputs

Evaluate the five Understanding Check claims and the value-based stale-undo limit. Include a null visitor result and two duplicate registrations.

## Understanding answers

An in-flight captured callback remains eligible after close; later captured lists omit it. Two registrations of one Consumer have separate tokens. Undo restores model state only and retains earlier external effects. Validation stops at rejection. Failed notification can follow a committed edit. Visitor localizes new operations over a stable family but adding a node type changes all visitor contracts. A same-value external edit is invisible to the command's value guard. Null visitor/result causes NullPointerException. The implementation is single-threaded, and callback-driven nested publication needs bounded logic.

## Transfer inputs

From independent initial counter 0 with gates >0 and <=5, evaluate requests 0, 2, 6, 10. Then let an observer fail after accepted 2, close its token and undo. Render/evaluate Add(2,Add(3,4)).

## Transfer answers

Request 0 fails the first gate and returns false;6 reaches the second gate and returns false. Both leave value 0/depth 0 with no notice. Request 2 commits value 2/depth 1 and publishes 0->2 before returning true. Request 10 raises IllegalArgumentException before gates. Notification failure after accepted 2 propagates while value 2/depth 1 remain committed; closing the bad token allows undo to 0/depth 0 and publication 2->0. Show returns (2+(3+4)); Sum returns 9. A new operation adds a visitor; a new node type expands the sealed family and every visitor interface/implementation.

## Extension inputs

lead publishes one guarded inner event before outer reaches once. Trace lead/once/tail, another event, a throwing once consumer and a token closed before any publication.

## Extension answers

The order is lead:outer,lead:inner,once:inner,tail:inner,tail:outer. The fired guard suppresses once:outer from the old capture. Live membership is then lead/tail; the next event calls only those two. A throwing once consumer is removed before invocation and remains consumed afterward. Closing before a future capture prevents delivery; a token closed only after an in-flight capture retains that capture's normal eligibility. Core stays 130 passed; complete checks report 142 passed.
