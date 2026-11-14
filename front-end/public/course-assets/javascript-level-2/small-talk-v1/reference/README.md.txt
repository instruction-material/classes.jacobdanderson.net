# Small Talk

Build a fictional conversation using exactly two declared variables: aboutMe and aboutYou.
Both are objects. Use at least five corresponding profile properties, including a string, an integer
and a boolean. Assign prompted input to properties and use ternary expressions for match messages.
The supplied reference uses name, city, age, school, favoriteSubject and pineappleOnPizza.
Keep all other working values in those properties; do not add extra variable declarations.

## Supplied files and execution

Open index.html in a browser. All scripts and styles are local; no server or library is required.
The original starter's assignment and blank entry area are preserved in script.js.
Implement the conversation there. The reference completes it with two objects and six prompts.

Cancel or a blank response skips only that question and becomes null in the corresponding field.
The six questions continue and the final page labels absent fields as skipped.
Text is trimmed while preserving display spelling; city, school and subject comparisons ignore case.
For this exercise, age is a whole number from 0 through 120. Invalid numeric input is reported and
skipped. A pizza response normalizes yes/no, including outer whitespace and case, to true/false.
An invalid nonblank pizza answer is reported and skipped. These null values represent unanswered
properties; a completed numeric or boolean answer retains its intended type.

Use textContent when printing the summary, so input is displayed as text.

## Required implementation

Create the fixed fictional profile, then an empty aboutYou object. The supplied path requests six fields in order. A custom profile can retain the original minimum of five corresponding properties and document its own examples.
Normalize each field before the next comparison uses it. Include match/difference messages for
city, age, school, subject and pizza; unanswered fields receive a separate skipped message.
Print the six final fields in the supplied summary element.

## Worked checks

Fixed profile: Riley, Oakville,20, Example School, coding, true.

- Avery / Oakville / 20 / Example School / coding / yes: city, age, school, subject and pizza match.
- Avery / cedar / 0 / Other School / drawing / no: age 0 remains 0, pizza becomes false and comparisons differ.
- Cancel all six: all user properties are null; displayed values are skipped, rather than null or 0.
- Age abc,-1,20.5 or 121: report invalid age and retain null.
- Pizza " YES " becomes true; " no " becomes false; maybe is reported and becomes null.
- Name "<b>Avery</b>" is shown literally, preserving the characters as plain text.

## Completion evidence

Save the two-object source, one matching trace, one differing trace, all-cancel behavior,
age boundaries 0/120 and invalid-age/boolean examples. Inspect typeof for completed age and pizza
properties. The only declared variables are aboutMe and aboutYou, and both objects contain the same
property names. The optional next exercise may compare additional profile fields after the core
works; this pack itself supplies the complete required inputs and behavior.

## Source and declared adaptation

The original blank starter and reference were reviewed from Juni Learning's official CodePen
exports. LICENSE-original.txt retains the original MIT notice, including its upstream attribution.
The local adaptation adds explicit skip/validation policies, typed user preferences and a local
plaintext summary. SOURCES.md records the original links and retained source hashes.
