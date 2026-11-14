# Moving Features Between Objects checks

## application-inputs

Compare the direct JDK operation, ForeignDateMethods and BusinessDate.
1. Input Monday 2024-01-01.
2. Input Tuesday 2024-01-02.
3. Input Sunday 2024-01-07; then null and LocalDate.MAX.
Record result, preserved input and added helper/wrapper cost.

## application-answers

1. All return 2024-01-08, seven days later. A next-or-same operation would change the contract.
2. All return 2024-01-08.
3. Sunday advances one day to 2024-01-08. Null raises NullPointerException in both supplied comparisons; a following Monday beyond LocalDate.MAX raises DateTimeException.
LocalDate is immutable/final. The direct adjuster already expresses this operation; a helper adds a domain name, and BusinessDate adds a wrapper and conversion boundary. A coherent repeated need can justify those costs.

## reflection-inputs

Assign each rule and explain the boundary.
1. Change phone punctuation while keeping the member-name rule.
2. Change the allowed member-name length while keeping phone formatting.
3. Change only the surrounding printed label layout.
Compare the flat, method-only and extracted designs.

## reflection-answers

1. Final ownership is Phone.format; Member and the old printer entrypoint delegate. A utility that still reads both getters spreads representation dependence.
2. Member owns its name invariant; Phone has no name field.
3. ContactPrinter owns the surrounding label and asks Member for telephone behavior.
The extracted Phone owns two related fields, their validity and presentation. A class with no separate invariant/behavior may be inlined; a broad forwarding layer may be removed only after appropriate client migration. Count actual changed files and public dependencies rather than assuming every extra class improves design.

## compatibility-inputs

Keep ClientCompatibility unchanged.
1. Mira/212/5550100 through Member.telephone, ContactPrinter.telephone and ClientCompatibility.render.
2. From that state, call changePhone("020","123"), then read both old getters and render again.
3. Call changePhone("1",null), then changePhone("020",null).
Predict exception precedence and retained state.

## compatibility-answers

1. Both telephone entrypoints return(212)5550100 with one space after the closing parenthesis: "(212) 5550100". The client returns"Mira <(212) 5550100>".
2. IllegalArgumentException for the short number; fields stay 212 and 5550100 and the client output stays identical.
3. The first call raises IllegalArgumentException for area before considering null number. The second raises NullPointerException for number. Both leave 212/5550100 unchanged.
Existing constructor/getter/printer signatures and accepted String identities remain intact. The final model compiles with only Member.java and Phone.java.

## core-inputs

Predict exact observable behavior before extracting fields.
1. Mira/212/5550100, then valid update020/70001234.
2. Name" Mira ", area"0000", number"0000".
3. Original212/5550100, then invalid update020/123.
Retain baseline, oracle, driver and client while compiling each actual step.

## core-answers

1. Original label"Mira <(212) 5550100>"; updated label"Mira <(020) 70001234>"; compatibility field query"020|70001234".
2. Telephone"(0000) 0000"; label" Mira  <(0000) 0000>" including retained leading/trailing name spaces and the label separator. The three String getters retain their supplied objects.
3. IllegalArgumentException; both original fields and label remain. Constructing the replacement before assignment prevents a partial update.
The method-only intermediate precedes Phone extraction. Core reports 4911 passed and Main retains the six exact lines. Compile the final owner separately from printer/client/legacy classes and record real diffs/recovery points.

## understanding-inputs

Classify the responsibility move.
1. Copy telephone formatting into Member, then delegate the old printer entrypoint.
2. Move area/number and their validation into Phone while old Member getters delegate.
3. Replace the old printer entrypoint with direct client access to Phone before client migration.
Explain the dependency graph and compatibility consequences.

## understanding-answers

1. Move Method with a temporary delegating bridge. The original Member→ContactPrinter edge disappears.
2. Move Field and Extract Class, with Member.telephone hiding the delegate. The final path is ContactPrinter→Member→Phone.
3. Public callers would break or acquire new representation dependencies. Keep the bridge during this exercise; deliberate removal requires migrated clients and a compatibility policy.
The unchanged ClientCompatibility source exercises retained calls. Source/isolated-compilation evidence checks the ownership boundary; value tests alone do not prove the structure is better.

## transfer-inputs

Assess three proposed changes.
1. Every caller obtains Member.phone() and builds strings from its getters.
2. changePhone first installs Phone(nextArea,"0000"), then constructs the requested phone.
3. A new BusinessDate wrapper is required for one otherwise clear adjuster call.
Give a counterexample or cost and a justified alternative.

## transfer-answers

1. Formatting and Phone representation now spread across clients. A meaningful Member.telephone operation can keep that policy owned and hidden. Expose a collaborator only when the caller actually owns that responsibility.
2. Starting212/5550100 and requesting020/123 leaves020/0000 after the second construction fails. Validate/construct the entire replacement before one assignment.
3. The direct standard adjuster may suffice. A static domain helper adds less setup; a coherent collection of repeated domain-date operations can justify a wrapper and explicit conversion. Neither technique is automatically preferred by its name.

## extension-inputs

After core implement maskedTelephone without changing stored/full output.
1. area212, number0123.
2. area020, number01234567.
3. Mira/212/5550100, mask it, changePhone("030","01234567"), then mask and render.
Check ordinary getters and labels after masking.

## extension-answers

1. "(212) **23".
2. "(020) ******67".
3. First"(212) *****00", then"(030) ******67"; the client still renders"Mira <(030) 01234567>".
Stored numbers stay exact, including leading zeros. Phone owns the mask rule, Member delegates, and clients retain the old API. Core remains 4911 passed with masking unfinished; complete reference reports 4991 passed.
