# DPR1 safe refactoring cases

## application-inputs

1. Reader days 3, 4, 12; staff day 12.
2. Rename cost consistently, then delegate notice only.
3. Both notice and ledger delegate to fee.

## application-answers

1. 0, 25, 225 cents; staff 0. notice and ledger agree with fee.
2. Both preserve core behavior; ledger still owns a duplicate rule in the intermediate.
3. One rule location remains; source comparison establishes the structural change.

## reflection-inputs

1. A rename leaves a cost reference unresolved.
2. A compiled change makes day 4 free.
3. Only Main's sample passes.

## reflection-answers

1. Compilation fails; restore the last exact green source, compile and rerun core.
2. Required reader fee 25 becomes 0; explain a changed requirement before accepting it.
3. That supports the sample, not the entire domain or design judgment.

## classification-inputs

1. Consistent rename; grace changes from 3 to 7.
2. Fix ledger reporting 0 for reader day 4.
3. Equivalent faster algorithm with timings.

## classification-answers

1. Rename is structural; grace changes behavior. Day 4 goes 25 to 0 and day 12 goes 225 to 125.
2. Bug fix restores the supplied 25-cent requirement and agreement with notice.
3. Performance-oriented and potentially a refactor; verify the contract and measurement scope.

## inventory-inputs

1. Mira/Atlas/day 4/reader exact lines.
2. Days -1 and 366, including staff; null Loan.
3. Borrower ' Mira ' with a valid book.

## inventory-answers

1. To Mira: Atlas | overdue=4 | charge=25 and Mira|Atlas|4|25|READER.
2. IllegalArgumentException for days; NullPointerException for notice/ledger null Loan.
3. Spaces are retained; trimming is outside this contract.

## core-inputs

1. Reader days 3, 4, 12, 365; staff 365.
2. Baseline, core and Main commands.
3. Reference rule ownership and optional state.

## core-answers

1. 0, 25, 225, 9050; staff 0.
2. 24190 baseline, 48380 core; Main/base match the four documented lines.
3. notice/ledger delegate to fee; core does not require noticeAll.

## diagnostic-inputs

1. Three copies of one fixed fee rule.
2. Strategy hierarchy without policy variation.
3. Current day 4 fee versus seven-day grace.

## diagnostic-answers

1. Duplicated rule ownership is the dominant issue; consolidate through fee first.
2. Added types/wiring lack a demonstrated current benefit.
3. 25 versus 0; the independent core oracle rejects an unexplained change.

## transfer-inputs

1. Current grace, reader days 0, 4, 7, 8, 12.
2. Proposed seven-day grace at those days.
3. Public outputs affected.

## transfer-answers

1. 0, 25, 100, 125, 225 cents.
2. 0, 0, 0, 25, 125 cents; staff remains 0.
3. fee totals, notice charge and ledger fee must change consistently under the separately reviewed policy.

## extension-inputs

1. Loans [Mira/Atlas/4/reader, Sol/Maps/12/staff, Mira/Atlas/4/reader].
2. Try output.add, then clear input.
3. Empty input; null list; null element.

## extension-answers

1. Three ordered notices: charge 25, charge 0, charge 25, duplicate retained.
2. Output mutation throws UnsupportedOperationException; input clearing leaves three returned strings intact.
3. Empty unmodifiable list; NullPointerException for either null case. Core stays 48380 passed.
