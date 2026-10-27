# Age Milestones

Choose five age conditions and use a ternary expression to produce each message. The completed example keeps the original numerical boundaries: 0–2, 3–4, at least 16, at least 35, and at least 65. These are practice conditions, not determinations of legal or benefit eligibility.

## Validate before comparing

The local exercise accepts a whole practice age from 0 to 150. Blank, negative, fractional, and nonnumeric input are rejected before any milestone calculation. A cancelled original prompt became zero through numeric coercion; a missing value must not become a baby classification. The form has no implicit cancellation value. Clear it and submit to verify the error and the preserved previous result.

## Five independent conditions

`milestoneMessages(age)` returns six strings: Practice age: [age], then Baby example (0–2): yes/no, Toddler example (3–4): yes/no, Milestone at 16: reached/not yet, Milestone at 35: reached/not yet, and Milestone at 65: reached/not yet. Use independent expressions so a later condition does not suppress an earlier result. The middle age interval needs both a lower and an upper comparison.

Trace ages 0, 2, 3, 4, 5, 15, 16, 34, 35, 64, and 65. For every threshold, check just below, exactly at, and just above it. Predict which messages change and which stay the same. Replace the three generic milestones with other explicitly stated practice thresholds only after this baseline works; keep the predicate and its displayed wording consistent.

## Open and work with the source

Confirm the selected starter or reference import in the site IDE. The original starter and reference remain separate roles. The Ternary Operators starter already runs; convert its conditional bodies. The other starters retain their unfinished exercise and the function contracts needed by the local controls. Edit script.js, save the same attempt, and reopen it before continuing. `README.md` contains the full brief. Export the complete ZIP, extract every file, and open index.html. It works without a server, installation, or network connection.

support.js connects labeled controls to the exercise functions and prints results with the bundled D3 version. Keep calculations and decisions in script.js. `SOURCES.md` records the original editor panels, declared dependencies, and deliberate corrections. Read the reference after an independent attempt; retain explanations and trace notes alongside the saved code.

## Verify the result

Predict a true case, a false case, and an exact boundary before running. Compare expected return values with displayed output. Rejected input must preserve the last valid result. Check keyboard controls, a narrow screen, 200% zoom, and reduced motion. Save a visible code edit, reopen the same project, export all companion files, and repeat the checks in the extracted page.
