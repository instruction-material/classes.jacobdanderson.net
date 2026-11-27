function reading(content: string) {
	return {
		content,
		contentKind: "reading" as const,
		preserveInstructions: true
	};
}

function activity(content: string) {
	return {
		content,
		contentKind: "assignment" as const,
		preserveInstructions: true
	};
}

export const scratchLevel2StudioGuidance = {
	arcade: {
		concepts: reading(
			"One script can own the round while each clone owns a short life. Use a stage-wide Round variable such as ready, playing, or ended. A hidden parent can create clones only while Round is playing. A clone then chooses its position, shows itself, and either handles one collision or leaves the stage and deletes itself."
		),
		plan: reading(
			"Use a copy of a previously saved game. Identify the sprite or stage script that starts a round, the sprite that creates clones, and the script that updates Score. Draw one event chain from a hit to a score change and clone deletion. Label any script that should finish before the next level starts."
		),
		build: activity(`Open a copy of a completed clone game. Keep its existing controls and choose one collision that affects Score.

1. Set the score and level to their starting values on the green flag. Set Round to playing only after the starting values are ready.
2. Put the repeated spawn steps in a custom block such as spawn at (x) (y). The parent creates one clone at a time during the round.
3. A hit changes Score once and deletes that clone. A level change can be triggered at Score 3. Record the level change so the same score cannot trigger it again.
4. Set Round to ended before showing the ending. Stop new spawns and clear active clones. A fresh flag click starts a clean round.

**Checkpoints:** Follow three controlled hits to scores 1, 2, 3 and one level change. Leave a clone on-screen at the end and check that it cannot score afterward.`),
		debug: reading(
			"Show Round, Score and Level while diagnosing the project. Keep a clone touching the player long enough for several loop checks. If one hit scores twice, look for a collision script that can loop before deleting the clone. If a level loads twice at score 3, record the change before announcing the new level."
		),
		share: reading(
			"Demonstrate a normal hit, a level change and a restart. Point out which script owns the round and which one deletes an individual clone. Explain what happens when a clone receives a collision after the round has ended."
		),
		check: reading(
			"Pause at score 2 with one clone visible. Predict which variable changes first on a hit, which message or script advances the level, and when the clone disappears. Compare the prediction with the next run."
		),
		pitfalls: reading(
			"Use a finishing receiver for broadcast and wait. A receiver that starts a forever loop can keep the sending script waiting indefinitely. Test cleanup with two visible clones and make the sender resume only after both have stopped or been removed."
		),
		extension: activity(
			"Add a second spawn delay to the refactored game. Keep both delays positive and change the delay only on a level change. Record the delay at start and after the transition. For a repeatable experiment, use 2 seconds in level 1 and 1 second in level 2, with the first spawn after the first wait. Count arrivals through 4 seconds of uninterrupted play in each level.\n\n**Checkpoints:** Expect arrivals at times 2 and 4 in level 1 and at 1, 2, 3 and 4 in level 2. Restart and verify that the initial timing returns."
		)
	},
	simulation: {
		concepts: reading(
			"A trial applies one rule and records one result. For a two-outcome model, use 0 for no token and 1 for a token. The Outcomes list preserves the results in order. Total counts how many tokens were collected. The fraction of token draws is Total divided by the list length after the last trial."
		),
		plan: reading(
			"Use one sprite to run the trials and show the result. Create variables Outcome, Total, and Trial Count plus a list called Outcomes. On the green flag, clear Outcomes and set Total to 0. Add one list entry per trial before starting the next trial."
		),
		build: {
			...activity(`Use **Start in IDE** to open a blank Scratch project for a token-draw simulation.

1. Create a custom block record outcome (value). It adds value to Outcomes and increases Total by value.
2. Try four calls with values 0, 1, 1, and 0. The list has four entries, Total is 2, and the token fraction is 0.5.
3. Replace the four test calls with repeat (Trial Count). In each repetition, set Outcome to pick random 0 to 1 and call record outcome (Outcome).
4. Set Trial Count to 10. After the loop, report Total out of 10. With zero trials, report No trials instead of dividing by zero.

**Checkpoints:** Both fixed and random runs add one list row per trial. In random runs, Total is between 0 and Trial Count. Press the flag twice and check that the second list contains only the new run.`),
			projectLink: "/ide?mode=scratch&starter=blank"
		},
		debug: reading(
			"Before debugging a random run, replay the fixed input 0, 1, 1, 0. After the third value, the list has length 3 and Total is 2. A longer list suggests a duplicate append. A list that matches but a different total points to record outcome or to a Total that was never reset."
		),
		share: reading(
			"Show the four fixed inputs and one random run. Explain why the fixed result should always be 2 out of 4 and why two valid random results may differ. Mention the number of draws alongside each result so the audience can compare the runs."
		),
		check: reading(
			"Pause the fixed run after the second input. Outcomes contains 0 and 1, and Total is 1. Predict the list and total after the next input of 1. Then follow the final input of 0 and explain why it changes the list length without changing Total."
		),
		pitfalls: reading(
			"Clear the list before the first trial and append after drawing a value. If the newest row always seems one step behind the trace, check whether the code appends Outcome before assigning the new draw. Check zero trials before computing a fraction."
		),
		extension: activity(
			"Try a one-in-four token rule by drawing an integer from 1 to 4 and recording 1 only for a draw of 1. Keep the same record outcome block. Use a separate variable for the raw draw so Outcomes still contains only results 0 and 1. Run twelve random trials, then compare the resulting fraction with one quarter. A single short run can differ.\n\n**Checkpoints:** Force the inputs 1, 2, 3, and 4 first. The list should contain 1, 0, 0, and 0 with Total 1. Check that green flag clears the results before the random run."
		)
	},
	debugging: {
		concepts: reading(
			"A repeatable failing case is a short sequence that shows the same fault twice. In a game whose score survives a restart, one sequence is flag, score one point, flag, then read Score. The expected last value is 0. Check the reset script before changing the collision rules."
		),
		plan: reading(
			"Keep the original saved .sb3 and reopen a copy. Choose one behavior to preserve, such as collecting a point, and one failure to repair. Record the first event where the predicted state differs from the actual state. Name the sprite, variable or broadcast involved."
		),
		build: activity(`Repair one issue in a copy of a completed Scratch project. Use a reproducible example such as a score that carries into the next round, a duplicate collision, or an ending that stays visible on restart.

1. Write the controls and events needed to produce the problem, with the expected and actual results.
2. Inspect the scripts that write the affected state. Add a temporary variable monitor or speech cue to identify the first incorrect write.
3. Change the smallest responsible script. If two scripts run the same reset steps, consider one custom reset block in the sprite that owns both scripts.
4. Remove the temporary cues and save the repaired copy.

**Checkpoints:** Repeat the original failing case, one ordinary play case, and two consecutive flag restarts. Show which behavior changed and which two behaviors were preserved.`),
		debug: reading(
			"If a sprite is still hidden after the flag, check which script sends the first hide and which script should show it again. Add a short monitor or speech cue to those two paths. When two scripts can write the same state, inspect their order and give reset one owner."
		),
		share: reading(
			"Show the saved original and corrected copy using the same short input sequence. Point to the first incorrect state in the original, then identify the one script that establishes the right state in the corrected version."
		),
		check: reading(
			"Stop at the first event where the values disagree. Write the previous value, the event, and the next value. For a stale score of 1 after reset, the previous score and next score are both 1 even though the flag should have written 0."
		),
		pitfalls: reading(
			"Changing several scripts at once makes it hard to tell which one fixed the fault. Replay the same sequence after each small change. A restarted project should behave correctly without requiring the stop button, another flag click, or a special order of keyboard inputs."
		),
		extension: activity(
			"After fixing one fault, extract a repeated sequence into one named custom block within the sprite that owns it. For example, if the flag and an in-game reset both clear the score display and hide an ending message, have both scripts call reset display. Keep any work unique to the flag in its own script. Record the display before and after each reset path.\n\n**Checkpoints:** Replay both reset paths with the same starting state and compare the result with the repaired copy. Test the first collision after restart to confirm that scoring still works."
		)
	},
	bridge: {
		concepts: reading(
			"A Scratch list uses position 1 for its first item, while a Python list uses index 0. A Scratch custom block receives inputs and performs actions. A Python function can also return a value. Decide whether a translation should change a list, show something, or return a value before writing it."
		),
		plan: reading(
			"Choose a finished Scratch mechanic with one input and visible output. For a tally, note how many wins the list contains, when the flag clears it, and which script counts the items. Set up a table with the starting list, the expected count, and the actual count."
		),
		build: activity(`Translate one Scratch list operation into pseudocode and a short Python example. A starting example counts the entries equal to 1:

\`\`\`python
def count_tokens(outcomes):
    total = 0
    for outcome in outcomes:
        if outcome == 1:
            total += 1
    return total
\`\`\`

In Scratch, clear Total first, repeat once for each list item, and increase Total when the current item equals 1. A separate action can display that value. In Python, each call creates its own Total and returns the count.

**Checkpoints:** The outcome lists [0, 1, 1, 0], [], and [1] give counts 2, 0, and 1. Call the function twice with [1] and check that each call returns 1.`),
		debug: reading(
			"For [1], verify which first item each version reads. A Scratch index of 0 or a Python index of 1 would miss the only item. A Python loop over values avoids explicit indexes when positions are unnecessary."
		),
		share: reading(
			"Show the Scratch blocks beside the Python steps and run them on the same list. Point to initialization, repetition, selection and output. Explain which Scratch event calls the blocks and where a Python caller would use the returned value."
		),
		check: reading(
			"Trace [0, 1, 1, 0] in both versions. The totals after the four items are 0, 1, 2, and 2. Compare the traces before changing either version."
		),
		pitfalls: reading(
			"A Scratch broadcast may start work on several sprites concurrently. A normal Python function call returns before its caller continues. When translating several receivers, write down the order and the state each receiver reads before choosing explicit function calls."
		),
		extension: activity(
			"Translate a second small behavior that updates data. Try appending one result to Outcomes. In Scratch, add (value) to Outcomes changes the stored list. In Python, a helper can call outcomes.append(value) to change its argument. Use an empty list and append 1, then append 0. Trace the same two updates in both environments.\n\n**Checkpoints:** Expect [] before the first action, [1] after it and [1, 0] at the end. Start a separate list and show that subsequent changes to it leave the first list intact. Explain where the change occurs in each version."
		)
	},
	capstone: {
		plan: reading(`On the Master Project card, use **Start in IDE** to open a blank Scratch project for an original game. Pick one player action, one change to game state, and one clear ending. Name the sprites, controls, starting state, and ending in a comment before beginning.

## Build one playable round

1. Make one playable round with placeholder art. On the green flag, set the starting position, score or other state, and visible backdrop.
2. Use a list where order matters, such as collected items or level goals. Create a custom block with one input so the same script serves two concrete cases.
3. Add the win or loss condition. A finished round stops scoring and can be started again.
4. Download the .sb3 and reopen it before the presentation. Add optional art or extra levels after the first round works.

**Checkpoints:** Show a fresh start, one ordinary action, an edge case, the ending, and a restart. Explain one state change, what the list stores, and two calls to the same custom block.

## Worked plan for a two-light puzzle

The player selects Blue and then Amber to turn on both lamps. Keep the selections in order in a list. A custom block with a color input records the choice and lights the matching lamp. Starting with an empty list, Blue then Amber should finish the round. Amber first should leave the puzzle waiting for a valid first choice. Press the flag after a win and verify that the list and both lamps reset.

## Present the saved project

Demonstrate the controls, one game action, the ending and restart. Open one event script and trace how it calls a custom block, updates state, or changes what appears. Include one case that failed during development and show the fixed behavior.`),
		recap: reading(
			"Pick one mechanic from the finished game. Write what starts it, what repeats, what decides the next action, and what changes. If more than one sprite responds to a message, label the state each receiver reads. The optional bridge uses the same trace to plan a Python version."
		)
	}
};
