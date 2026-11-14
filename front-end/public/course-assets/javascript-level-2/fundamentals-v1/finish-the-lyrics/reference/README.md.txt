# Finish the Lyrics

Build a three-question guessing game using three short lyric snippets, quotations, original sayings or jokes. Each prompt contains one blank. Read an answer, compare it with the missing word, track the number correct, and display the final score with the supplied printToScreen(text) helper.

The original starter has empty HTML/CSS and an assignment comment plus that helper. The local starter keeps the project area empty; the HTML shell, stylesheet and D3 library are included. Open index.html in a browser. The untouched starter asks no questions and displays no score.

## Build the game

1. Choose three snippets and one accepted missing word for each. Record the prompts, answers and expected scores in CASES.md.
2. Set a correct-answer counter to 0 and a total-question count to 3. Use prompt("Question") to collect each answer.
3. A prompt returns a string when accepted and null when cancelled. Check answer !== null before calling answer.trim().toLowerCase(). Compare with a lowercase accepted word. Increment the counter only for a matching answer.
4. Give feedback for each question. A cancelled answer counts as unanswered/incorrect; continue to the next question.
5. After all three questions, call printToScreen("You got " + numCorrect + " answers out of " + numLyrics + " correct!"). Place the project code above the display-helper boundary.
6. Refresh to start a new attempt. Check all-correct, all-wrong, mixed, whitespace/case variants and cancellation at each question. Reopen the saved index.html with styles.css, script.js and vendor together.

## Worked input set

The reference uses these newly authored sayings:

| Prompt | Missing word |
| --- | --- |
| A tiny bug can hide in a large _____. | program |
| A saved copy makes tomorrow's work _____. | easier |
| A clear name makes a variable's purpose _____. | clear |

For program, wrong, clear, the score is 2 out of 3. For a cancelled first answer followed by easier and clear, it is also 2 out of 3. Cancelling every answer gives 0 out of 3. Trimmed, case-insensitive matching accepts " PROGRAM ".

## Local display helper

printToScreen(text) appends one visible result using D3. Its dark text colors, wrapping layout and optional one-second entrance keep the score readable at narrow widths and zoom. Reduced-motion settings show the result immediately. No account, package installation, server, remote font or network connection is needed.

## Completion evidence

Keep the chosen three prompts, their accepted words, the score program and all included assets together. Demonstrate the expected scores above and the equivalent cases for any custom snippets. Every attempt asks three questions, increments only for correct answers, and ends with one final score. Keep the attempt separate from the reference.

## Optional matching comparison

Keep the core attempt and use a separate copy for this experiment. Change only the first question's comparison between these two policies:

- Exact: answer !== null && answer === "program"
- Trimmed/case-insensitive: answer !== null && answer.trim().toLowerCase() === "program"

Answer the other questions with easier and clear. The reference keeps the second policy.

| First answer | Exact-policy score | Trimmed/case-insensitive score |
| --- | --- | --- |
| program | 3 out of 3 | 3 out of 3 |
| PROGRAM | 2 out of 3 | 3 out of 3 |
| space-padded program | 2 out of 3 | 3 out of 3 |
| empty answer | 2 out of 3 | 2 out of 3 |
| cancel | 2 out of 3 | 2 out of 3 |
| wrong | 2 out of 3 | 2 out of 3 |

Use lyric1 in place of answer when editing the supplied reference. Both expressions test cancellation before using the value. Record the observed comparison and explain which policy fits the chosen game.
