# Generalization case inputs

## parallel

Start with the runnable starter. Use Ada with 3 sessions, Bo with 4 sessions and 2 mentoring slots, and sponsor North Lab. Draw Volunteer -> VolunteerFormatter and Mentor -> MentorFormatter. Run Main baseline. Extract the shared member data, validation and line algorithm, then retire the three formatter files. Add the extracted types to sources.txt.

Predict the exact four lines. Explain which files a third member role would require before and after this change. Keep RosterAPI and CompatibilityClient source calls unchanged.

## judgment

For each proposed relationship, identify shared state, shared behavior and legitimate variation:

- Member above Volunteer and Mentor.
- Member above SponsorBanner.
- LineSource shared by Member and SponsorBanner.
- RoleFormatter plus one formatter subtype per member role.
- DefaultEventBuffer above the same EventBuffer behavior.
- NamedCounter using every Counter operation unchanged.

Compare an open Member with the lesson's sealed Member declaration. Would sealing prevent a permitted Mentor from rejecting sessions=0? Consider a future independent CSV output choice.

## contracts

Write SubtypeProbe.java in the exported project root after the core refactor. Import roster.Volunteer and roster.Mentor. For sessions 0 and 40, print each volunteer's credits and each mentor's credits with mentoringSlots 0 and 8. Each constructor receives name "Ada". Add SubtypeProbe.java to sources.txt, compile the full list, and run java -cp out SubtypeProbe.

Separately enroll Ada(3), take a lines snapshot, and enroll Bo(4,2). Try enrollMentor(null,-1,-1), enrollMentor(" ",-1,-1), enrollMentor("X",-1,-1), and enrollMentor("X",0,-1). Record exception type/message, total and earlier snapshot after each attempt.

In the optional completed event project, call NamedCounter through a Counter parameter: add 5, add 2, reset. Test a negative addition and Long.MAX_VALUE followed by 1. Explain which old List client must migrate on hierarchy exit.

## core

Complete the required roster only. Extract Member and LineSource; edit Roster, Volunteer, Mentor and SponsorBanner; delete RoleFormatter, VolunteerFormatter and MentorFormatter and their source-list entries.

Use empty roster, Ada(3), Bo(4,2), zero/max sessions and zero/max mentoring slots. Test accepted name " Ada " and all validation-order cases from contracts. Run ContractChecks core under -ea and -da. Leave both optional projects unfinished to show independent core completion.

## understanding

Classify these changes by technique and contract:

1. Move name and sessions into Member.
2. Move shared constructor validation into Member.
3. Move delimiter and quoteLabel out of the report base into CsvReport.
4. Remove empty DefaultEventBuffer.
5. Make EventBuffer own its collection.
6. Make NamedCounter inherit all unchanged Counter operations.
7. Seal Member to Volunteer and Mentor.

Explain why matching the four Main baseline lines cannot establish any of these class relationships. Give a counterexample to putting SponsorBanner under Member.

## transfer

Complete only the optional report project from a fresh starter. Keep the roster/event designs unchanged. Extract Report, PlainReport and CsvReport and update sources.txt. Use rows ("tool, kit",2), ("lamp",3), plus empty input, a row whose label is say "hi" and count is 0, and a label containing one newline.

Specify exact output including the final newline. Test null format with null rows, valid format with null rows, and a list containing a null row. For Row, test null/blank label combined with count=-1. Run transfer checks under -ea and -da.

## extension

Complete only EventBuffer, EventFactory and NamedCounter from a fresh starter. With capacity=2, push A, B, C; take a snapshot; call next; try push(null), push(" "), and then next until empty. Retain the earlier snapshot.

Use capacity 0 and 9. Through Counter, add 5 then 2 and reset a NamedCounter("visits"). Test negative amount and overflow without changing the stored count. Compare EventBufferAPI's FIFO calls with old inherited indexed List mutation and serialized ArrayList state. Run extension checks under -ea and -da.
