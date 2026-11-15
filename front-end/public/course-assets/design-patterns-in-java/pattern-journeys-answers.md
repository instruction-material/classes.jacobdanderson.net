# Refactoring toward patterns: project self-check

## tradeoffs

The third creator supplies a NoticeLine whose result is label + "|" + count + newline. A caller-selected ordering sorts by label. The unchanged template prints Notes, a|2, z|1 and end=2, each followed by a newline. Product creation changes in the new creator; ordering changes in the supplied algorithm. The selection factory needs registration only if the old String-style API must expose that new format. With two stable one-line formats, an extracted method or formatting-function map avoids extra creator types. The cost of the larger practice design is more classes, calls and navigation; independently growing construction or ordering is the pressure that earns those seams.

## steps

The first extracted method returns "[kit:3]\n" for the kit row. Replacing the old branch with result.append(formatRow(style,row)) preserves Notes\n[kit:3]\n[lamp:2]\nend=2\n and the original caller list. It isolates formatting before any hierarchy is introduced. Moving that method into a product gives it a new owner; extracting the creator makes product construction replaceable; extracting Ordering makes sequence selection independently replaceable. An evidence-based reflection identifies the first useful seam and preserves the passing result for every later step rather than treating the final pattern name as the result by itself.

## arrival

Text/original prints Notes\nlamp=2\nkit=3\nend=2\n. Reversed bracket prints Notes\n[kit:3]\n[lamp:2]\nend=2\n. Empty prints Notes\nend=0\n. Literal punctuation/space labels produce Notes\n[ A,B :0]\n[[x]:=:9]\nend=2\n. Input values and list ordering stay unchanged.

The four invalid render cases report NullPointerException("style"), IllegalArgumentException("style"), NullPointerException("notices") and NullPointerException("notice"), in that order. forStyle is a static selection factory. createLine is the overridable Factory Method. render is the final Template Method. Replaceable product construction can earn the creator seam; stable tiny formats can favor merging it back into a smaller collaborator. A retained closed-set boundary switch does not invalidate the refactor.

## core

The completed notice project passes 2040 explicit checks with either assertion setting and preserves the baseline four-line demo. It includes an abstract creator, common NoticeLine product, two concrete creators, final rendering template and two Ordering implementations. New extracted files are present in sources.txt. The untouched starter's behavior checks pass but core completion reports the missing notices.NoticeCreator extraction.

Counts 0 and 9 are accepted; -1 and 10 report IllegalArgumentException("count"). Null label reports NullPointerException("label"); blank or CR/LF-containing labels report IllegalArgumentException("label"), even when count is also invalid. Spaces around an otherwise nonblank label, punctuation and Unicode remain exact. A completed core can coexist with unfinished ticket/editor projects. The reference structure is the stated practice target; the smaller extracted-method alternative can still be a justified production choice under fixed requirements.

## understanding

forStyle is a named static creation seam; createLine supplies the subclass-based Factory Method; render fixes the Template Method algorithm; Ordering is a selectable Strategy. TicketState chooses behavior from current state. DayExtension adds operations to a wrapped external type, while DayAdapter conforms to NoteDate. Editor supplies a Facade and hides delegate traversal. AppendCommand is the request; TextBuffer.Memento is opaque saved receiver state; CommandHistory owns ordering and undo/redo stacks.

Guards suit the stable small lifecycle. A selectable transition policy suits customer-specific rules. State suits substantial state-owned behavior and transitions. These are choices under the stated pressures, not rules that every conditional must become polymorphic. A direct date adapter may combine the extension/adapter layers when only conversion is needed; simple snapshot stacks may suffice for a single editor mutation.

## transfer

The five results are false:DRAFT, true:READY, false:READY, true:DONE and true:DRAFT. History is [DRAFT->READY, READY->DONE, DONE->DRAFT]. The next approve adds DRAFT->READY only to the new history; the earlier snapshot remains the three-entry list. Null action reports NullPointerException("action"); "APPROVE" reports IllegalArgumentException("action"), with both status and history unchanged.

Only DRAFT/approve, READY/finish and DONE/reset transition. The six other recognized state/action pairs return false. GuardTicket, StrategyTicket.standard and the completed Ticket agree on every action sequence through length five. Completed transfer passes 24600 explicit checks with -ea and -da, independently of core/editor. A new required status or changed business rule needs separate feature expectations alongside the preserved baseline.

## extension

Empty undo/redo return false. After two appends, undo returns true and text is "2026-11-15 | lamp\n". The invalid 2025 leap day reports DateTimeException before text validation, retains that text and leaves redo available. Redo restores both lines; undo followed by successful November 17 append leaves "2026-11-15 | lamp\n2026-11-17 | c\n" and redo returns false. Accepted spaces, Unicode and embedded text newlines remain exact.

Empty and null text report IllegalArgumentException("text") and NullPointerException("text") after a valid date. Year 999 reports IllegalArgumentException("year") before month/day/text errors. Years 1000 and 9999 and February 29, 2000 are accepted with ISO date labels. A cross-buffer restore reports IllegalArgumentException("owner") before mutation. November 14/15 are weekend dates; November 16 is not.

Completed extension passes 9595 explicit checks under either assertion setting while other projects may remain at starter. Opaque Memento fields and construction stay private, requests retain receiver/arguments, history clears redo only after a successful new command, and the public EditorAPI calls compile unchanged. A simple snapshot implementation remains a valid smaller alternative when command reuse and richer private receiver state are absent.
