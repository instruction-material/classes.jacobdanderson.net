# Refactoring judgment cases

## Review inputs

Compare Legacy/Direct/Pluggable banner and email for `" hello "`, `""`, null and `"a\nb"`. First inject the fixed NOTICE formatter, then `text -> "[" + text + "]"`. Choose a design for a fixed application-wide style and for caller-selected channel styles.

## Review answers

Fixed formatting gives `NOTICE: HELLO` and `NOTICE: ` through either entrypoint. Null raises NullPointerException; a line break raises IllegalArgumentException before the callback. The bracket policy yields `[ hello ]` and `[]`, an explicitly selected behavior change.

Legacy has two copies of the rule. Direct owns it in one private helper and adds no injected dependency. Pluggable owns a formatter reference and constructor contract, invokes it once for valid input, and validates its result. A fixed application can use Direct; caller-selected styles create a reason for injection. Identify wiring/validation cost and a removal trigger. A class hierarchy needs its own justification.

## Preview inputs

Compile the untouched nine-file starter with Java 21. Run `ContractTests base`, `Main base` and `ContractTests core` separately. Predict REGULAR 10 STANDARD, MEMBER 10 STANDARD and zero MEMBER EXPRESS. Keep a recoverable starting checkpoint.

## Preview answers

Baseline reports `Baseline judgment contracts: 1221 passed`. Main base prints:

```text
REGULAR|STANDARD|10|2000|0|2000
2700
```

Untouched core rejects `UnsupportedOperationException: Implement the behavior-preserving quote.` The legacy baseline runs while the target is unfinished.

The three orders total 2000, 2300 and 0. Membership changes the free-standard threshold. Preserve the files/output as a checkpoint. Copying unchanged legacy behavior into the two target methods is one first step before centralizing decisions. The helper bodies are supplied scaffolding.

## Reflection inputs

Compare target quote/receipt before and after centralizing pricing. Define rule-location and files-touched counts. Does passing core prove the target is free of duplication? How does retaining LegacyCheckout affect repository-wide counts?

## Reflection answers

Copied correct target methods can pass 2435 core checks while duplicating decisions. Tests observe results; inspect source to determine ownership. Define each price/threshold rule, count its target locations before/after, and retain the same scope.

One Checkout.java file can contain multiple duplicate rules, so files touched alone is weak evidence. Legacy deliberately retains baseline decisions. Count it separately instead of claiming one repository-wide rule location. Record added types, dependencies, navigation and setup costs. Measurements support conclusions only within the stated scenario.

## Decision inputs

For fixed pricing, compare private helpers with ShippingPolicy and separate strategy classes. Then consider caller-selected per-request shipping. Complete `DECISIONS.md` with a simpler alternative, measurable benefit, cost and removal trigger.

## Decision answers

Fixed-table helpers centralize subtotal/shipping without a public hierarchy. Record the 606-order contract, quote/receipt delegation and scoped counts. Policy types need a concrete selection, state or lifecycle pressure.

Caller-selected per-call shipping is actual variation. ToIntFunction<Order> expresses it with one callback and a bounded fee. Record null/failure validation, wiring and external-effect risks. A removal trigger could be removal of caller choice when only one fixed policy remains. Include preserved behavior, rejected counterfactual, change scenario, commit/check identities and rollback target. Multiple designs can be justified by explicit evidence.

## Measurement inputs

Plan a rename, redirecting receipt through quote, centralizing subtotal/shipping, and changing the threshold from 2000 to 2500. Which preserve declared behavior? Choose boundary checks and rollback evidence.

## Measurement answers

A semantics-preserving rename and delegations can retain the table; run baseline/core after each step. A threshold change alters behavior: REGULAR 10 STANDARD gains shipping. Schedule that contract change separately.

Check quantities 0/100, regular 9/10 standard, member 11/12 standard, positive express/pickup, null order, exact receipt fields and the full independent table. Retain exported source, one behavior-preserving step per commit, matching checks and the last accepted revision. A save/ZIP gives a checkpoint; Git creates commits. Explain unexpected failures before continuing.

## Core inputs

Compute subtotal, shipping, total and receipt for REGULAR 9 STANDARD; REGULAR 10 STANDARD; MEMBER 11 STANDARD; MEMBER 12 STANDARD; MEMBER 10 EXPRESS; MEMBER 0 EXPRESS. Run baseline/core/Main on the completed target and assess rule ownership.

## Core answers

- **Regular 9 standard:** 1800 subtotal + 500 shipping = **2300 total**.
- **Regular 10 standard:** 2000 subtotal + 0 shipping = **2000 total**.
- **Member 11 standard:** 1980 subtotal + 500 shipping = **2480 total**.
- **Member 12 standard:** 2160 subtotal + 0 shipping = **2160 total**.
- **Member 10 express:** 1800 subtotal + 900 shipping = **2700 total**.
- **Member 0 express:** 0 subtotal + 0 shipping = **0 total**.

The first receipt is `REGULAR|STANDARD|9|1800|500|2300`. Null order raises NullPointerException. Order rejects quantities outside 0..100 and null enum fields. Totals rejects negative components and detects overflowing addition.

Baseline reports 1221 passed; core reports 2435 passed. Main prints:

```text
REGULAR|STANDARD|10|2000|0|2000
REGULAR|STANDARD|10|2000|0|2000
2700
```

Preserve legacy and independent tests. Review target rule ownership and `DECISIONS.md` separately. Core passes with optional quoteWith unfinished.

## Understanding inputs

Correct with examples: green tests prove duplication removed; helpers require interfaces; characterization defines desired behavior; injected zero-unit shipping must be zero; callback failure undoes external effects.

## Understanding answers

A duplicated correct target passes checks; source review supplies duplication evidence. Direct's private helper needs no interface. Characterization records observations and can preserve a defect; the independently declared table establishes intended bounded behavior here.

Zero units with quoteWith returning 100 gives total 100; ordinary quote remains zero. A callback increment followed by a thrown exception leaves that increment visible. No transaction is supplied. Separate structural judgment, intended behavior and side-effect promises.

## Transfer inputs

For `" hi "`, `""` and `"a\nb"`, predict Legacy/Direct versus a bracket formatter. Trace a callback returning null and one incrementing a counter before throwing. Choose a design for a stated channel requirement.

## Transfer answers

Legacy/Direct return `NOTICE: HI` and `NOTICE: `. The bracket policy returns `[ hi ]` and `[]`. Both entrypoints reject a line break before invocation: IllegalArgumentException and zero calls. Null input raises NullPointerException before invocation.

A valid input with null callback result invokes once, then raises NullPointerException. A throwing callback runs once; its exception propagates and its prior increment remains. Fixed-format equivalence does not imply equivalence to every formatter. Choose a helper for one fixed rule or injection for required caller choice, and name constructor/validation/ownership cost.

## Extension inputs

Predict MEMBER 10 STANDARD with policy 250; zero MEMBER EXPRESS with policy 100; fees -1/10001; null policy; throwing callback. Count invocations and re-run ordinary quote/core before and after.

## Extension answers

The first returns 1800+250=2050; ordinary quote remains 1800+500=2300. Zero units with policy 100 gives 100. Invoke exactly once for every valid non-null order/policy, including zero quantity. Fees 0/10000 are accepted; -1/10001 raise IllegalArgumentException after one call.

Null order/policy raises NullPointerException before invocation. Callback exceptions propagate after the invocation; prior effects remain. Core stays `Core judgment contracts: 2435 passed`; complete reports `Complete judgment contracts: 2445 passed`. Core also passes with optional quoteWith still throwing. Keep the actual variation and removal trigger in `DECISIONS.md`.
