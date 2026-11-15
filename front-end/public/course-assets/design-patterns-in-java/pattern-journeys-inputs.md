# Refactoring toward patterns: case inputs

## tradeoffs

Input rows are Notice("z",1), Notice("a",2). Compare the existing text/bracket styles with a requested third pipe format: a|2 and z|1, in label order, under the same Notes header and end=2 footer. The new caller must supply its product creation and ordering without copying the rendering algorithm. Contrast this request with a system whose two one-line formats and two orderings will remain fixed. For each, identify a stopping point, changed files and the cost of the extra types.

## steps

Start from NoticeService in the starter. Use style="bracket", rows lamp(2),kit(3), reverse=true. First extract only formatRow(String,Notice), leaving validation, input copying, ordering and footer in place. Compile and run the baseline checks. Then move row formatting behind NoticeLine, extract the creator and finally the ordering algorithm. Retain the last passing version at each checkpoint and the original input list. Explain which change first reduced the cost of changing a row format.

## arrival

Use these inputs before and after each notice refactor:

| Style | Rows | Reverse |
| --- | --- | --- |
| text | lamp(2),kit(3) | false |
| bracket | lamp(2),kit(3) | true |
| text | empty list | true |
| bracket | " A,B "(0),"[x]:="(9) | false |
| null | null list | false |
| "TEXT" | null list | false |
| text | null list | false |
| text | a list with a null element | false |

The caller's lamp,kit list must retain its original ordering. Identify which creation function is static and which method is overridden, and what owns the shared algorithm. State one future requirement that would earn those separate roles and one that would remove the need for them.

## core

Complete only the notice package. Add the seven extracted types listed in the lesson and update sources.txt. Keep the frozen LegacyNotices, NoticeAPI, Notice, CompatibilityClient and ContractChecks unchanged. Cover count boundaries 0 and 9, invalid -1 and 10, exact accepted labels, a null label, a blank label and embedded CR/LF. Check label before count. Run both formats, both orderings, empty input and the original caller list. Compare Main baseline/core and ContractChecks core with -ea/-da. Leave ticket/editor files at starter to demonstrate independence.

## understanding

Classify each operation: static NoticeCreator.forStyle; overridden createLine; final render; caller-supplied Ordering; current TicketState.next; DayExtension.weekend; DayAdapter.label; Editor.append hiding collaborators; AppendCommand holding receiver and arguments; TextBuffer.Memento holding private saved state. Choose among GuardTicket, StrategyTicket and Ticket for (a) a fixed three-transition lifecycle, (b) customer-selected approval policies, and (c) states acquiring different action/entry/exit behavior. Give the requirement that supports each choice.

## transfer

Initial status is DRAFT and history is empty. Apply finish, approve, approve, finish, reset, then capture history. Apply approve once more and compare that prior snapshot with current history. Try null and "APPROVE" without changing valid state. Compare GuardTicket, StrategyTicket.standard and the completed State implementation. The complete state/action table has nine combinations of three states and three recognized actions. Create TicketState, update sources.txt and run transfer with both assertion settings while the other projects stay at starter.

## extension

On an empty editor, try undo and redo. Append (2026,11,15,"lamp"), append (2026,11,16,"kit"), undo, then attempt (2025,2,29,null). Check text and whether redo remains available. Redo, undo, append (2026,11,17,"c"), then try redo again. Repeat with accepted text " a " and "é\nnext", an empty text, a null text, year 999 with invalid month/day, valid years 1000/9999 and leap day 2000-02-29. Test a Memento created by one buffer against another buffer. Check weekend() for November 14, 15 and 16, 2026. Complete the editor package independently and retain the same public facade calls.
