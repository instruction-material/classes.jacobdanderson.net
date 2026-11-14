# Dispatch capstone cases

## Pressure inputs

Inspect target Desk.preview/send. A new EMAIL rate must remain consistent in preview and stored outcomes. A test must observe renderer failure before storage and notice failure after storage. A storage substitute should preserve ordered snapshots. Identify concrete pressures and a simpler response.

## Pressure answers

The two target methods repeat channel prefix, rate and urgent decisions, giving a price change two target locations. One class also mixes map operations with use-case order, so storage replacement edits orchestration. Hard-wired computation makes a controlled render-failure test harder.

A shared helper addresses duplication cheaply. Repository and renderer seams support the two additional substitution/test pressures but add types, constructor wiring and navigation. Cite the actual locations and demonstrate the chosen scenario. Count unchanged LegacyDesk separately. More classes alone establish no benefit.

## Plan inputs

Sequence centralizing computation, moving map operations, injecting a renderer and changing the urgent fee from 40 to 50. Which preserve behavior? State checks, recovery identity and an omitted pattern.

## Plan answers

Delegating send's computation to preview can preserve every declared result. Moving unchanged map behavior behind a repository and injecting the existing computation can also preserve behavior when validation, ordering and failures stay the same. Run baseline/core/Main after each step.

Changing the urgent fee alters the contract: urgent EMAIL with two copies would cost 300 instead of 280. Schedule that separately. Retain each accepted source/check identity and rollback target. The stable two-channel switch supplies a reason to omit a factory hierarchy; one synchronous sink supplies a reason to omit an event bus.

## Implementation inputs

Start from the passing target. Replace only send's duplicated computation with preview(request), preserving duplicate checks, insert, notification and finally. Then justify one collaborator boundary and update sources.txt for any added Java source.

## Implementation answers

The computation-only checkpoint still reports Core capstone contracts: 4854 passed and the same five Main lines. The target has one computation owner while LegacyDesk remains unchanged. Keep the duplicate rejection before preview and insertion before the sink.

Adding or moving a Java file requires consistent package declaration/path and a sources.txt entry. Compile the exported role folder with `-d classes @sources.txt`. Keep small commits and their matching checks. Native verification executes this intermediate, while source review evaluates the later separation and its costs.

## Architecture inputs

Trace an injected renderer that returns a different valid result, one returning null, a changed-id result, a throwing store and a sink throwing after insertion. Draw permitted package dependencies and propose an independent compilation check.

## Architecture answers

A trusted replacement renderer can explicitly choose different rendered text/cents. Desk.preview requires a non-null result with the request's id; null causes NullPointerException and a changed id causes IllegalArgumentException before storage. A renderer exception also precedes insertion.

If insert throws, no notification follows; adapter effects already performed are not rolled back. A sink failure follows insertion, so the stored dispatch remains. The app imports domain/ports; adapters implement those ports; Composition selects concrete implementations. Compile domain/ports/app without infrastructure or LegacyDesk. The reference's ArchitectureTests checks these seams in 30 assertions. An alternative design needs equivalent contract/effect evidence.

## Reflection inputs

Compare a price change, target computation owners, production Java files and constructor collaborators before and after the reference refactor. Does a passing unchanged starter establish structural improvement?

## Reflection answers

A price change touches one target Java file before and after, so that file count shows no improvement. Initially preview and send both own target rate/rendering decisions; the reference has one StandardRenderer.render owner. LegacyDesk deliberately remains separate.

Count production Java files including Main/Composition and excluding *Tests.java: eight initially, twelve in the supplied reference. Desk's constructor receives one collaborator initially and three afterward. Those are added maintenance costs, rather than measured time savings. A passing unchanged starter establishes behavior. Source review, a demonstrated substitution and the defined counts support the structural argument. Include an omitted pattern, remaining tradeoff and removal trigger.

## Baseline inputs

On the untouched starter, compile and run baseline/core plus both Main modes. Send b then a, retain all(), then send c. Let a sink throw for bad and attempt that id again. Record a recoverable baseline.

## Baseline answers

Baseline reports 2433 passed and core 4854 passed. Both Main modes print:

```text
EMAIL: Hi
sent:a
200
sent:b
[a, b]
```

The earlier snapshot remains b,a; a new snapshot is b,a,c. Returned lists reject mutation. A throwing bad sink leaves bad inserted. Retrying bad raises IllegalArgumentException before another notification. finally releases the guard so a different id can be sent. Retain exact source/output, the invalid-input and failure traces, and a recoverable commit or exported checkpoint.

## Packet inputs

Assemble evidence for a claimed renderer/repository refactor. Include a boundary where a test passes but a design claim still needs inspection. Identify rollback and a simpler alternative.

## Packet answers

Include original/final dependency maps, three to five evidenced pressures, the preserved behavioral contract, small commits with matching checks, defined before/after counts, failure-state table and a replacement demonstration. Count the retained legacy separately.

The unchanged starter already passes core, so green behavior alone cannot prove reduced duplication or useful seams. Compare with the shared-helper-only intermediate, name an omitted pattern and remaining cost, and state a removal trigger. Retain source/check identities giving a clear rollback point for each major change. Optional batch evidence belongs separately from required core.

## Core inputs

Compute the rendered prefix, per-copy rate and total for EMAIL NORMAL copies2; EMAIL URGENT copies2; SMS NORMAL copies3; SMS URGENT copies3, using text Hi. Then check duplicate id, missing id, null request and invalid copy count.

## Core answers

- **EMAIL NORMAL, 2 copies:** `EMAIL: Hi`; 100 × 2 = **200 cents**.
- **EMAIL URGENT, 2 copies:** `URGENT EMAIL: Hi`; 140 × 2 = **280 cents**.
- **SMS NORMAL, 3 copies:** `SMS: Hi`; 60 × 3 = **180 cents**.
- **SMS URGENT, 3 copies:** `URGENT SMS: Hi`; 100 × 3 = **300 cents**.

A duplicate send id raises IllegalArgumentException before computation or another notification. A valid missing id yields Optional.empty; null request raises NullPointerException. Copies 0/21 are invalid;1/20 are included. Empty text is valid and whitespace is preserved.

Core reports 4854 passed and Main has the five lines in the reading. Review decision/rollback evidence and source structure separately. Optional batching may remain unfinished while core passes.

## Understanding inputs

Correct: green starter completes refactoring; one changed file proves duplication removed; repository means persistence; notice failure undoes insertion; busy guard supplies thread safety.

## Understanding answers

The unchanged starter is a behavioral baseline. A single file can contain two copies of the same rule, so inspect ownership and count locations. MemoryDispatches stores only in process memory. A notice failure follows insertion and leaves that outcome committed. The synchronous busy guard rejects specified nested sends; it is not a cross-thread lock.

Support each with the actual method or trace. Compare the smallest helper remedy with any extra seam, including a concrete benefit and maintenance cost.

## Transfer inputs

Preview Request x with text `" Hi "`, EMAIL, URGENT and copies2. Check the desk and notices before sending. Retain a snapshot, send a different id, and compare a report-only client with changing the default renderer.

## Transfer answers

The exact rendered string is `"URGENT EMAIL:  Hi "`, including two spaces after the colon and the final input space. Its cost is 140×2=280. Preview leaves storage/notices empty. A retained all() snapshot remains unchanged after another id is sent.

A report-only client can call preview and format its own presentation without storing or notifying. Injecting a different renderer deliberately changes its computation contract for that composed desk; changing StandardRenderer affects default clients. Compare the desired scope, constructor/test cost and removal trigger. There is no separate transfer starter.

## Extension inputs

On an empty desk, run batch a,b,a,c. Then use a sink throwing for b in a,b,c. Supply a list containing a null element, and let a callback clear the caller's input list. Attempt a nested empty batch during send.

## Extension answers

The duplicate batch commits a,b, then fails before a second a or c is processed. A sink failure for b leaves both a and b inserted, then stops before c. A null list/element raises NullPointerException before any item is sent because the input is copied/validated first.

Clearing the caller's original list during a callback does not change the captured sequence. A nested empty batch raises IllegalStateException while a send is active. Successful output is immutable; an empty top-level batch returns an empty list. Core stays 4854 passed, complete 4869 passed. Preserve this explicit prefix-commit behavior and document external effects without claiming rollback.
