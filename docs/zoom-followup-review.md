# Zoom follow-up review

## Current coverage checkpoint, 2026-10-11

The retained corpus contains 77 nonempty transcripts and 53510 utterances.
Source hashes and complete semantic-review coverage are verified against
76 retained review receipts; this includes classified exclusion of one
unrelated work meeting. Review coverage and implementation acceptance are
separate. The aggregate review does not establish that every promised feature
or production gate is complete.

All 52 known empty meeting instances were read again on October 11. They
returned no new readable transcript or summary and no processing indication.
They are not counted as reviewed transcripts. The connector's latest available
room session remains October 9; its actual transcript, summary and notes are
unchanged in the latest read. These reads establish the returned corpus, not
completeness of recordings or history the connector does not expose.

Later course, native-source and website milestones supersede the earlier
pending states below. The accepted v2.8.94 releases include confirmed native
imports and exported roles for the four latest optional algorithm projects.
The full course audit and final feature mapping remain active; source release
publication does not establish native production activation.

## Earlier review and implementation evidence

Reviewed on 2026-10-04 against the canonical source at `292434d4`.
Private transcripts, meeting identifiers, participant names, and quotations are
not included in this repository.

## Coverage and limits

The connected Zoom inventory returned 131 meeting records. Of these, 125 were
hosted by the account holder. All 125 were reconciled with the existing archive
or fetched from the connector, regardless of the inventory's transcript flag.
There were 74 nonempty transcripts, including one unrelated work meeting.
The teaching review therefore covered 73 available transcripts: 61 outside the
previously reviewed learner group and 12 within that group, including two newer
sessions. The returned host records span April 6 through October 3, 2026.

The other 51 host meetings returned no transcript, including 48 previously empty
meetings checked again. Deleted meetings, inaccessible recordings, and history
not returned by the connector are not covered. Each available teaching transcript
was screened for site/course concerns and promises; relevant passages were then
checked against current source. This is not a claim of word-for-word manual
review of unrelated teaching conversation.

## Implemented follow-ups

The August and September Scratch discussions exposed missing requirements or
instructions inconsistent with their linked starters. Public Scratch API records
for the JuniLearningScratch starters and matching solutions were checked on
2026-10-04. Six current course summaries needed correction, including related
starter discrepancies found while checking the reported problems:

| Lesson        | Correction                                                                                                                                     | Published starter                                      |
| ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------ |
| Bug Eater     | Frog asks for X and Y answers and collects a sprite, rather than a mouse-controlled mantis with a score timer.                                 | [Starter](https://scratch.mit.edu/projects/297831461/) |
| Cake Chaser   | Arrow keys control the cake; the beetle chases and ends the game on contact.                                                                   | [Starter](https://scratch.mit.edu/projects/299085513/) |
| Talent Show   | Cat responds to speak, song, spin, draw, and corners; unknown answers and stop are handled.                                                    | [Starter](https://scratch.mit.edu/projects/295339505/) |
| Beetle Artist | Green flag resets position, direction, pen size, and color as well as clearing the drawing.                                                    | [Starter](https://scratch.mit.edu/projects/288003770/) |
| Speed Click   | Ten-second button game, Ready/Set/Go, pressed feedback, and hide/show restart behavior replace the twenty-second random-target summary.        | [Starter](https://scratch.mit.edu/projects/299327014/) |
| Spider Smash  | Mouse-following hammer, mouse-down plus contact scoring, two-second repositioning, and a one-minute game replace falling click-to-hit spiders. | [Starter](https://scratch.mit.edu/projects/299272518/) |

Corrections are explicit in `juniScratchInstructionCorrections.ts`, with hashes of
the archived summaries and the verified public instructions. Course IDs, item
IDs, aliases, placement, starter links, and solution links are unchanged. The
baseline fidelity fixture remains unchanged: six corrections are allowed, and
the other 82 original Scratch project summaries retain their exact baseline
content. Learner-facing regression tests check the actual requirements rather
than only comparing the course with its own correction registry.

The September 26 booking discussion included an unfulfilled promise to open the
dedicated full-page scheduler. `/signup` now replaces its history entry with the
configured scheduler URL, without an embedded calendar or a new tab. Direct
booking and management links remain in the generated page if automatic
navigation is blocked. The destination does not accept incoming query redirects
or forward account data.

## Already present or excluded

An additional teaching transcript became available on October 8. Its discussion
identified three missing explanations in Scratch Level 1: sampling an actual
backdrop color, choosing a priority when a costume touches multiple regions, and
coordinating lightning motion with sound completion. The four public Juni
starter/reference projects for Dino's Colors and Noisy Reactions were inspected
directly on October 8. Their original project instructions, source links,
placement, and progress identities remain unchanged.

Supporting lessons now explain the color picker, repeated and nested checks,
grey as part of the completed assignment, boundary priority, stale-message
clearing, sound selection and waiting, cloud reset, and one reaction per contact.
The original lightning sequence is taught explicitly. A separate optional
broadcast challenge starts motion and sound from one contact decision and waits
for both finite receivers before returning to Cloud. The challenge includes
shorter/longer motion tests and a pointer to the later broadcasting module.
These additions do not expand the six approved project-instruction corrections.

The transcript search listing incorrectly marked this session as lacking a
transcript; the asset reader returned its full transcript. This adds one teaching
session to the earlier review and does not recover the 51 unavailable historical
assets. A brief loading delay resolved during the session and lacked enough
evidence to identify a new site defect.

Current source already includes corrected Scratch links, independent blank
Scratch starters for open-ended work, learner-accessible course progress editing,
dark-mode course styling, the footer theme control, and the PyGame Surface
compatibility bridge. These were not reimplemented. Static HTML is revalidated
with `no-cache`; hashed assets have immutable caching.

Problems resolved during a session, third-party app problems, and bugs in
individual learners' external repositories were excluded from application changes.
Older scheduler date/recurrence discussion was not treated as a reproduced
current defect: this change improves the Classes handoff, not the separate
scheduler's availability or recurrence engine.

## Validation and rollout

Targeted course fidelity, learner-display requirements, scheduler handoff, and
security-profile navigation tests cover these changes. Full project checks and
release validation are recorded with the delivery commit/release.

Local validation passed 29 focused unit tests, project lint/typecheck, and the
isolated browser test for top-level navigation, ignored redirect/token parameters,
Back navigation, and blocked-navigation fallback. The fallback passed Axe at
390px and 1280px with no horizontal overflow; screenshots were inspected. Browser
tests mock external services and do not create bookings. CI retains fallback
screenshots and runs the full project suite. The broad local test run was stopped
when concurrent work overloaded the Mac. Optional guarded fast scanners refused
installed-version drift; their policy was not changed, and native checks remain
the validation authority.

The historical whole-catalog audit reports 131 unmatched legacy identities both
before and after this change. Those existing renamed/reworked non-Scratch entries
are not asserted to be missing coursework. The relevant Scratch gate finds all
88 original projects, zero placement/content mismatches outside the six verified
corrections, and no lost existing source links.

No dependency versions, lockfiles, database content, account progress, credentials,
or production infrastructure are changed. A native deployment requires the
tagged CI artifact and the normal verified promotion process; pushing source or
publishing a release does not establish that production has been updated.
