# Refactoring studio worked self-checks

## Capstone diagnosis

The room has ana enrolled and [cy,bo] waiting. Coordinated maps risk inconsistent session state, while report changes and queue-policy changes share a class. Extracting a small helper and then moving each session's state/behavior can preserve that result. Sorting waiters changes policy and must be separate. A diagnosis identifies locations and consequences rather than counting smell names.

## Capstone execution

After ana leaves, cy is enrolled and bo remains waiting. The history appends leave:ana:enrolled then promote:cy. A closed-room join throws IllegalStateException(closed). A previously returned snapshot stays unchanged. These promises should remain stable through every stage; a final result alone does not establish the intermediate sequence.

## Capstone patterns

The facade and owned session boundary correspond to actual responsibilities. A helper can handle the two fixed report formats; caller-supplied independent policies would provide a different reason for Strategy. Two lifecycle cases alone do not require a State hierarchy, and ordinary construction need not require a Factory. The decision follows demonstrated variation and ownership.

## Capstone architecture

The old class contains both concerns. In the reference, report formatting is located in DeskReports and session mutation/promotion in SessionBook; WorkshopDesk preserves the public API and session order. Record the actual files and check setup for each scenario. The two concerns still share their declared snapshot/API contract, so the boundary has costs as well as benefits.

## Capstone reflection

Sorting would promote bo first, contradicting the preserved FIFO case, so that proposal is a behavior change or an abandoned refactor with a concrete counterexample. Keeping a small helper can be the justified destination. Automated observations support the protected contracts; the source/risk argument establishes why a boundary was useful.

## Capstone ledger

Retain A and B with their exact source/results. Stop at the explained FIFO mismatch, restore the last understood state in an isolated copy, and separate state ownership from sorting. A small ownership move can be retried against the same case; sorting requires a deliberate new policy. A rollback target is an actual recoverable source, not only a note.

## Capstone evidence

Retain the frozen baseline, unchanged CompatibilityClient result, the small source steps and their passing cases, actual dependency arrows and the FIFO counterexample. Compare the report/promotion change scenarios and keep a recoverable checkpoint. The checks establish their observed values/errors/snapshots; they do not infer a learner's design argument or every untested future use.

## Capstone core

The original Main baseline/core demo remains exactly the output in the reading. In the room/1 trace, cy is promoted before bo and earlier snapshots remain unchanged. Commands continue after a reported runtime error. The role pack includes all API/package files and the sample input. Behavior checks protect the starting promises; actual small source changes establish the refactor.

## Capstone understanding

The unchanged helper can be a structural refactor. Sorting changes the promoted participant; a delimiter change changes output; persistence introduces new effects and failure promises. Keep those changes separately specified. The refactor retains the given FIFO/output/API cases.

## Capstone transfer

The matching implementations compare true. Wrong return status or an intermediate snapshot mismatch compare false even when later rosters agree. Exception class/message are also observations. An empty plan makes no operations; using the same desk twice is rejected with IllegalArgumentException(independent desks).

## Capstone extension

The preview keeps ana enrolled and waiting [dee,bo], retains the old history verbatim and appends rename:cy:dee. The input/live desk remains unchanged. Collision throws IllegalArgumentException(newID). Valid absent/identity no-ops return the exact input snapshot, but a closed snapshot throws IllegalStateException(closed) before no-op handling.

## Clinic 11 guided

The legs are 3,2,2, so total distance is 7. The exact sample summary is walk|stops=4|distance=7. Empty input has distance 0 and summary empty|stops=0|distance=0. There is no closing leg.

## Clinic 11 core

The sample remains distance 7 with the same summary. Opposing coordinate differences contribute 200+200=400; abs(dx+dy) would wrongly cancel them. Null input still throws NullPointerException with message route. Passing values protects behavior; the changed ownership and step log demonstrate the refactor.

## Clinic 11 review

The owned route contains the state and its decision; the client keeps its original API. Merely moving the same foreign-data loop to a differently named helper would not establish that ownership. Construction at the facade adds an object; justify that cost with the cohesive route behavior and representation boundary.

## Clinic 11 continuation

The retained value still has one point, distance 0 and the original name; later caller-list changes do not enter its immutable snapshot. Repeated reads produce the same result. An empty route also has distance 0. These observations protect input ownership and purity.

## Clinic 11 transfer

LongestLeg.measure returns 3 for the sample, 400 for the opposing corners and 0 for empty input. The sample total is 7, so summing instead of taking the maximum is detectably wrong. Input points and order remain unchanged.

## Clinic 11 extension

The preview's consecutive lengths are 7,6,2, totaling 15; the original remains distance 7 with its original points. Index 4 throws IndexOutOfBoundsException with message index. A null replacement throws NullPointerException with message replacement before index validation. Only the selected position changes.

## Clinic 12 guided

The exact results are text=go followed by newline, 2|go followed by newline, and 0| followed by newline. The mixed migration must preserve compact while plain moves behind its rule. Empty text is valid.

## Clinic 12 core

The result is GO with one selected rule call, despite clearing the caller's original map. Plain is unavailable in that custom registry and throws IllegalArgumentException with message mode. The default constructor separately retains plain and compact.

## Clinic 12 review

A supplied rule keeps new behavior outside the existing render method; assembly selects the mapping. The two fixed legacy formats alone could use a simple conditional. The caller-supplied requirement provides the concrete reason for this extraction.

## Clinic 12 continuation

The first throws NullPointerException(message); the second throws IllegalArgumentException(message); the third throws IllegalArgumentException(mode). Message validation precedes unavailable-mode lookup, and no rule runs in these failures.

## Clinic 12 transfer

The successful concatenation has three lines: plain:a, plain: and plain: b . Each item causes one call in order. The later invalid message is found during full-batch validation, so that batch makes zero renderer calls. Empty batches return an empty string without dispatch.

## Clinic 12 extension

The first result is !text=go followed by newline. Nested prefixes yield ABgo, with one call per wrapper/delegate. Null text fails with NullPointerException(message) before a delegate call. Prefix follows constructor validation and precedes the exact delegate result.

## Clinic 13 guided

The first result is [2,5,8], and its description is 2..9/3:[2, 5, 8]. The end is included only if a step lands on it. Equal endpoints produce [100], not an empty list.

## Clinic 13 core

The two valid calls return equal unmodifiable lists [2,5,8]. Validation checks start, end, step, then range consistency: the first invalid group reports IllegalArgumentException(step), the second IllegalArgumentException(range). The old adapter must preserve those outcomes.

## Clinic 13 review

The three numeric components jointly define enumeration and consistency; the color does not. The parameter object owns coherent validation, while output concerns can remain separate. Merely renaming unrelated parameters would add a container without clarifying this invariant.

## Clinic 13 continuation

Results are [0], IllegalArgumentException(end), and NullPointerException(range), respectively. The invalid end is reported before the also-invalid step. Existing integer calls remain available.

## Clinic 13 transfer

Results are [8,8,9], [-1] and []. Positions 0,2,4 determine selection; numeric parity does not. Duplicates and order survive, returned lists are unmodifiable, and caller lists remain unchanged.

## Clinic 13 extension

The first result is [1,2,5,8,9]. Extreme values retain natural ascending order without subtraction overflow. Both inputs remain unchanged, and the returned list is unmodifiable. Duplicate removal is a separate combination feature.

## Clinic 14 guided

The values are raw=99, usable=49, lost=50. Dividing 99 by 100 first would produce zero before multiplication, changing behavior. Splitting the variable names preserves the original computation order.

## Clinic 14 core

Both designs return EnergyResult(99,49,50) in the first case. The maximum case is (3600000,3600000,0). Each query has one meaning, and loss remains raw minus usable.

## Clinic 14 review

The current computation is stable for the same inputs, so extraction can preserve its result. Re-reading a changing dependency can alter the number, value and timing of observations; that requires a stated dependency contract rather than a mechanical query substitution.

## Clinic 14 continuation

The invalid group reports IllegalArgumentException(watts) first. Zero power produces (0,0,0). The raw value above the single-reading maximum reports IllegalArgumentException(raw) before efficiency is used.

## Clinic 14 transfer

The percentages are 50,0 and 100. The nonzero calculation floors lost*100/raw; it uses lost energy as numerator and raw energy as denominator. The zero-raw policy is explicit.

## Clinic 14 extension

The first total is BatchTotal(199,149,50). Twenty maximum readings total (72000000,0,72000000). Twenty-one readings throw IllegalArgumentException(readings). The aggregate has its own long-valued type; the input list and readings stay unchanged.

## Clinic 15 guided

Plain is begin, a, b, end on separate newline-terminated lines. Marked is BEGIN, * a, * b, END. An empty row remains a body row. Shared-loop extraction preserves these outputs before variation moves to subclasses.

## Clinic 15 core

The returned text has lines H, A, empty, F, with the exact recorded hook order. A template using its default empty footer omits that final text deliberately. Invalid rows are rejected before any hook.

## Clinic 15 review

Template Method protects one algorithm's order while subclass hooks provide steps. Independently composed policies can fit runtime assembly or multiple independent variations. Choose the boundary from that requirement, while keeping the original two formats equivalent.

## Clinic 15 continuation

Null header produces NullPointerException(header). Full input validation prevents all hooks in the invalid-row batch. A body failure propagates and prevents later body/footer calls; prior callbacks may already have run and are not rolled back.

## Clinic 15 transfer

The first result is [start,row:a,row:,end] and the empty result [start,end]. Hook arguments preserve phase and value separately. The failing trace stops after start and the first row; no end callback runs.

## Clinic 15 extension

Outputs begin ROWS followed by newline. Body lines are 1:a and 2: with newlines. Footer=true appends total=2; false adds nothing. Empty input with footer yields ROWS then total=0. Caller data is retained.

## Clinic 16 guided

Null gives Hello, guest and screen. Ada gives Hello, Ada and email. The real profile named guest keeps email. Presence is a domain condition, not a comparison against the name string.

## Clinic 16 core

Existing greetings/channels remain equal. Profile(null,null) throws NullPointerException(name); Profile(Ada,null) throws NullPointerException(channel). Invalid construction never silently becomes the guest special case.

## Clinic 16 review

A missing key yields Optional.empty. Invalid stored data fails instead of pretending to be absent. Greetings intentionally defaults accepted null input to guest; StrictGreeting refuses an empty Optional. One policy need not be imposed on every boundary.

## Clinic 16 continuation

Accepted name text is retained exactly in Hello, plus that name, and channel stays email. Null channel fails during Profile construction with message channel. Trimming accepted text or treating that partial object as absent changes the contract.

## Clinic 16 transfer

The valid results are Optional.of(Ada) and Optional.empty. The invalid directory throws NullPointerException(profile) even for a missing lookup because the complete directory is validated. Caller data remains unchanged.

## Clinic 16 extension

The present result is Hello, Ada. Empty throws NoSuchElementException(profile); a null container throws NullPointerException(result). The original guest-default API stays unchanged.

## Clinic 17 guided

The exact four lines are tasks=3, done=1, remaining=15 and open=read,draw, each ending with newline. The helper extraction leaves both entry points equal, establishing a passing checkpoint before the next responsibility move.

## Clinic 17 core

Every stage preserves the same four lines and remainingMinutes=15. Analysis owns the immutable input and derived stats; the formatter consumes that result. The restored earlier checkpoint must still run. Source/result records establish the sequence beyond a final green run.

## Clinic 17 review

Sorting changes open=read,draw to open=draw,read, so it is a separate feature decision. Moving formatting can preserve the original output. A failing or too-large step should return to the last understood checkpoint and be split or replanned.

## Clinic 17 continuation

The duplicate report retains open=same,same and remaining=120. Eight maximum tasks total 960 minutes. Nine tasks throw IllegalArgumentException(tasks). Removing duplicates or changing report order would alter observable behavior.

## Clinic 17 transfer

The first differences are 1,1 and 0. Equal final captures do not conceal an earlier mismatch. Identical sequences return -1, and exact newline differences also count.

## Clinic 17 extension

Preview titles are [code,draw,read], while the original core report remains open=read,draw. Equal-title tasks keep their relative order, all duplicates remain, the result is unmodifiable and the original list is retained.

## Refactoring prerequisites

The copied membership stays [ana]. join(null,null) reports NullPointerException(session) before participant validation and does not mutate the room. An unchanged helper can preserve behavior; sorting would promote bo before cy and changes the FIFO policy.

## Refactoring pathways

The parameter-object work fits DPR6/Clinic13, the runtime variant work fits DPR5 or DPR8/Clinic12, and the sequencing problem fits DPR1/DPR9/Clinic17. Start from each working baseline, retain a small first extraction and choose the next step from its result. Explain a different path with the same protected contract if it is better justified.

