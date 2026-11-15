# Refactoring studio case inputs

## Capstone diagnosis

The before WorkshopDesk coordinates capacity, open flags, enrolled people, waiters and history in separate maps. Room capacity is 1; ana joins, then cy, then bo. Compare a state-ownership move with changing the waiting order.

## Capstone execution

Use open room/1, join ana, join cy, join bo, leave ana. Compare the baseline after each small extraction. Also try joining a closed room and obtain a retained snapshot before a later mutation.

## Capstone patterns

The application has two fixed report formats and a boolean open/closed rule. It gains a per-session state owner and a renderer consuming snapshots. Consider adding Strategy, State and Factory solely to increase pattern count.

## Capstone architecture

Compare the original all-in-one WorkshopDesk with WorkshopDesk -> SessionBook and DeskReports consuming SessionView snapshots. Analyze report punctuation and FIFO policy as two separate future changes.

## Capstone reflection

Cy waited before bo. A proposed cleanup replaces the FIFO list with a sorted set. The final implementation keeps queue order and uses a small renderer helper.

## Capstone ledger

Checkpoint A passes before extraction. Checkpoint B extracts a membership helper and passes. A proposed combined state move plus queue sorting produces the wrong promoted participant. Choose the next safe action.

## Capstone evidence

A packet contains a green final ContractChecks run and a diagram, but no intermediate sources or compatibility client. Add the evidence needed for the sample app and identify a bounded conclusion.

## Capstone core

Run the supplied baseline demo, then a fresh room/1 trace: ana joins, cy waits, bo waits, ana leaves. Compare both reports, snapshots and history before/after. Also run script-core with sample-input.txt in a terminal.

## Capstone understanding

Classify: extract an unchanged membership predicate; sort [cy,bo] before promotion; change a compact-report delimiter; add durable storage. Use the room/1 FIFO trace.

## Capstone transfer

Compare independent before/after desks through open room/1, join ana, join cy, leave ana, report compact. Then compare a desk that reports a wrong join status and one whose first post-open snapshot is empty but later recovers.

## Capstone extension

An open room has ana enrolled and [cy,bo] waiting. Preview cy->dee, then try cy->bo. Compare missing-old and identity renames, and repeat a no-op request on a closed snapshot.

## Clinic 11 guided

Sample points are (0,0),(3,0),(3,-2),(1,-2). Trace consecutive open-route legs. Then use an empty RouteData named empty.

## Clinic 11 core

Keep the sample's existing public calls; compare them before and after extracting RoutePlan. Separately pass (-100,100),(100,-100), then null RouteData.

## Clinic 11 review

Compare a helper that repeatedly reads RouteData.stops() with a RoutePlan that privately owns the copied list and computes its summary. The existing client calls PlannerAPI.distance(route).

## Clinic 11 continuation

Construct RouteData from a mutable one-point list containing (0,0), then append (3,0) to the caller's list. Summarize the retained RouteData twice and also summarize an empty route.

## Clinic 11 transfer

Compare the sample's longest leg with total distance. Also use the opposing-corner route and an empty route.

## Clinic 11 extension

Replace sample point index 1 with (3,4). Compare the preview and original. Then try index 4 and a null replacement.

## Clinic 12 guided

Render plain/go and compact/go, then compact with an empty message. Extract only plain and repeat all three calls.

## Clinic 12 core

Supply a map containing only caps, whose rule uppercases using Locale.ROOT. Construct MessageService, clear the caller's map, and render caps/go. Also request plain/go from that custom registry.

## Clinic 12 review

A future caps variant must be selected at runtime. Compare adding a new branch inside render with supplying a RenderRule at construction.

## Clinic 12 continuation

Call render(missing,null), render(missing,bad followed by newline), and render(missing,go). Track rule invocations.

## Clinic 12 transfer

A recorder returns mode + colon + text + newline. Render plain over [a, empty string, space-b-space]. Then place an invalid newline-containing message after a valid one.

## Clinic 12 extension

Use PrefixRule with prefix ! and a delegate returning text=go plus newline. Nest prefixes A then B around an identity rule. Try a null message.

## Clinic 13 guided

Use start=2,end=9,step=3; then start=end=100,step=20. Trace the generated values before migrating calls.

## Clinic 13 core

Construct RangeSpec(2,9,3) and compare values(range) with values(2,9,3). Then construct (10,0,0) and (10,0,1).

## Clinic 13 review

Compare a validated start/end/step object with a bag containing start/end/step plus a display color. Which values define one range invariant?

## Clinic 13 continuation

Call values(0,0,1), values(0,101,0), and values with a null RangeSpec.

## Clinic 13 transfer

Select every other position from [8,1,8,2,9], then from a single-element [-1] and from an empty list.

## Clinic 13 extension

Merge [8,2,5,2] with [9,1,5]. Then merge lists containing Integer.MIN_VALUE, zero and Integer.MAX_VALUE.

## Clinic 14 guided

Trace measure(33,3,50), including raw energy, usable energy and lost energy. Compare raw*efficiency/100 with raw/100*efficiency.

## Clinic 14 core

Compare the original measure(33,3,50) with the candidate using raw(33,3) and usable(99,50). Also measure(1000,3600,100).

## Clinic 14 review

The raw query uses only bounded integer parameters. A proposed replacement obtains the current time during each call instead. Is repeated evaluation equivalent?

## Clinic 14 continuation

Try measure(-1,-1,-1), measure(0,3600,100), and usable(3600001,0).

## Clinic 14 transfer

Find loss percentage for EnergyResult(99,49,50), for (0,0,0), and for a maximum all-lost reading.

## Clinic 14 extension

Aggregate (99,49,50) and (100,100,0). Then use twenty maximum all-lost readings and a batch of twenty-one readings.

## Clinic 15 guided

Build plain and marked for rows [a,b], then extract the common row loop and repeat. Include an empty row.

## Clinic 15 core

A custom template records header, line:a, line:empty, footer. Header returns H plus newline, each line uppercases its row plus newline, footer returns F plus newline.

## Clinic 15 review

Compare fixed header/rows/footer order with a design that permits independently chosen runtime header, body and footer policies.

## Clinic 15 continuation

Use a null header result; then a valid first row followed by an invalid newline-containing row; then a body hook that throws IllegalStateException(body) on the second valid row.

## Clinic 15 transfer

Trace WorkflowTrace over [a,empty string], then an empty list. Make the first row callback throw IllegalStateException(stop).

## Clinic 15 extension

Number [a,empty string] with and without a footer, then number an empty list with a footer.

## Clinic 16 guided

Compare null, Profile(Ada,email), and Profile(guest,email) through both Greetings operations.

## Clinic 16 core

After introducing Recipient.of, repeat the three traces and construct Profile with null name or null channel.

## Clinic 16 review

A valid directory lacks a requested key; another directory contains a null stored profile. Compare lookup, the ordinary Greetings API and StrictGreeting.

## Clinic 16 continuation

Use a valid name containing surrounding spaces with channel email, then use a valid name with null channel.

## Clinic 16 transfer

Look up ada and missing in a valid one-entry directory. Then put a null profile under an unrelated valid key and repeat a missing lookup.

## Clinic 16 extension

Call StrictGreeting with a present Ada profile, an empty Optional and a null Optional container.

## Clinic 17 guided

Use read(10,false), code(20,true), draw(5,false). Trace summary and remainingMinutes before and after the helper-only extraction.

## Clinic 17 core

Run the sample through the helper, analysis-only and final formatter states. Retain an earlier source snapshot and replay it in an isolated working copy.

## Clinic 17 review

A proposed cleanup sorts unfinished titles in the existing summary. Another moves formatting without changing title order. Which is part of this behavior-preserving sequence?

## Clinic 17 continuation

Use two unfinished tasks both named same, with 0 and 120 minutes. Then use eight 120-minute unfinished tasks and a ninth task.

## Clinic 17 transfer

Compare [before,step1,final] with [before,bad,final], then [a] with [a,b], and an empty sequence with [a].

## Clinic 17 extension

Sort the sample into a separate preview. Include equal-title tasks with different minutes/done values.

## Refactoring prerequisites

Snapshot [ana] before the caller appends bo. On an existing desk call join(null,null). Compare a membership-helper extraction with sorting waiting participants [cy,bo].

## Refactoring pathways

Choose practice for a start/end/step clump, a caller-supplied rendering rule and a report with duplicate calculations plus mixed formatting.


## Refactoring prerequisite map

A Java application has working public calls but mixes input validation, calculation, mutable state and console output. A planned capstone must preserve its behavior while moving responsibilities. Place the ten core units in a defensible order. Add optional edges for route ownership, range arguments, document hooks and explicit guest handling. For each edge, name a value, failure or effect that must stay protected.

## Refactoring resource inventory

Compare the workshop starter and DPJ7 editor starter. In the workshop, a new src/app/SessionBook.java is extracted and Main script-core reads commands. Identify the compile inputs and the saved record of responsibility changes. In the editor, select EventBus or ReplaceCommand and identify which complete core behavior still needs protection. Keep reference code and worked answers separate from the starting program.
