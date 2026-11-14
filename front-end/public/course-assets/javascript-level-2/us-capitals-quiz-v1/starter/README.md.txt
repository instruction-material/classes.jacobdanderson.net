# U.S. State Capitals Quiz

Implement a U.S. state-capitals quiz using the supplied fifty state records and map outlines. A correct answer colors that state green; an incorrect answer colors it red. The current question, feedback, answer count, score and completed results also appear as page text.

## Trace the state machine

Read model.js and the event handlers in script.js. createQuiz validates and copies the dataset, then produces a ready game with no current question and an empty answers array. Starting chooses one unanswered state and enters asking. An accepted answer is recorded once and changes the phase to feedback. The next action chooses another unanswered state or enters complete when no records remain.

For a three-state trace containing Alabama, Alaska and Arizona, inject a random function that returns zero. Alabama is selected first. Submitting Montgomery records one correct answer. Submitting again during feedback returns false and keeps the answer count at one. Advancing selects Alaska. After all three answers, advancing returns no next question and completes a three-question game. The total comes from the data length; it is never a separate hard-coded guess limit.

## Complete the three task functions

Complete chooseQuestion(game, random), submitAnswer(game, value) and advanceQuiz(game, random) in model.js. Earlier validation, startup, reset, scoring, form events and rendering are supplied.

chooseQuestion constructs the set of answered IDs, filters the dataset to unanswered states and returns null for an empty remainder. Validate that the random value is finite and within [0, 1), then choose Math.floor(value * remaining.length). A state ID stays the same throughout the quiz.

submitAnswer accepts input only during asking. Normalize a capital name by trimming outer whitespace, collapsing repeated spaces and comparing without case. Preserve punctuation unless an explicitly listed alias permits another form. Minnesota supplies St. Paul, Saint Paul and St Paul as accepted forms. Reject blank or overlength input without consuming the question. Check the selected state's acceptedAnswers, append exactly one {id, answer, correct} result and enter feedback. A repeated submit leaves the result unchanged.

advanceQuiz works only during feedback. Use chooseQuestion to obtain the next record. A returned record enters asking; null enters complete and clears the current question. Both the score and total are derived from the game, so a smaller validated dataset also finishes correctly.

## Read the data and the map

data.js contains suppliedJSON. JSON.parse turns that string into a dataset with schemaVersion, viewBox and states. Each state has a two-digit ID, name, capital, acceptedAnswers and a bounded path string. The validator checks versions, duplicate IDs and names, fields, answer aliases and map coordinates. It copies expected fields into a fresh document.

The map renderer creates Path2D objects from those supplied paths, transforms their view box into the canvas and colors them from answer records. Alaska and Hawaii use insets. The results list repeats the meaningful answer outcomes as text. Rendering reads game state without adding answers or changing the score.

The Dataset section accepts a local JSON file of at most one MiB. Invalid or empty data leaves the current quiz intact and displays its error. Use supplied data restores the included fifty-state dataset. No network request is required.

## Run and verify

Open index.html in a current browser. Keep all files together. Complete the starter functions, save the same IDE attempt, export its ZIP and open the exported HTML. README.md, CASES.md and SOURCES.md travel with the code.

Check correct, wrong, blank, repeated and final answers with keyboard and pointer input. Verify the map and text results agree, all fifty distinct IDs occur once, reset clears the previous attempt, malformed data preserves a valid game and a smaller dataset uses its actual total. The reference provides one implementation for comparison after an attempt.

Complete the three task functions before comparing the reference.
