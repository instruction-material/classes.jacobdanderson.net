const broadcastSequence = `### Messages and turns

The \`broadcast [message]\` block starts every matching \`when I receive [message]\` script. Those receivers run together; their order in the sprite list does not give them separate turns. The sending script continues immediately.

\`broadcast [message] and wait\` starts the same receivers, then pauses the sender until they finish. Each receiving script must finish for the sender to continue. A receiver containing \`forever\` keeps it waiting.

### Dance Off

Use a different message for each dancer's turn, such as \`ballerina turn\` and \`next dancer\`. The ballerina's receiver glides onstage, cycles through the costumes twice, waits briefly between costumes so the changes are visible, then glides offstage. Broadcast the next dancer's message after that final glide. Give each remaining dancer the same action-then-message structure. Only the dancer whose turn was announced starts performing.

For a repeatable start, use one green-flag controller: \`broadcast [reset] and wait\`, then announce the first turn. Each finite reset receiver puts its dancer back on the left and selects the starting costume. Keep the dance loop out of the reset receivers.

### Music and ending

Start music in a separate script, outside the costume-change loop. Use \`play sound [music] until done\` inside the music loop so each playback finishes before the next begins. After Champ finishes, broadcast \`show finished\`. In the Stage's receiver, stop its other scripts and then stop all sounds; this ends both the repeating music script and any sound still playing.

### Check the sequence

Start the show twice. Every dancer should reset, one dancer should perform at a time, and the next turn should begin after the previous dancer leaves. Music should continue across costume changes and stop after the final dancer.`;

const bowlFill = `### Bowl Fill: sense throughout the game

At startup, set the bowl's rotation style to \`don't rotate\`. Reset every collection counter to 0. A controller can \`broadcast [reset] and wait\`, reset the built-in timer, set a shared \`playing\` variable to 1, then broadcast \`collect\`. Keep these reset receivers finite.

Each food sprite's \`when I receive [collect]\` script repeats until \`playing = 0\`. Inside that loop, an \`if touching [Bowl]?\` block detects contact. Broadcast the food's own message, such as \`cheese touched\`, and wait for the finite response scripts. A counter receiver checks \`playing = 1\` before adding 1; other receivers can change costumes, move or play a short sound.

After a contact, \`wait until\` either the food is no longer touching the bowl or \`playing = 0\`. This counts one collection per contact instead of adding to the score on every loop iteration. Moving away and touching again allows another collection.

The controller waits until the timer reaches 15, sets \`playing\` to 0, then broadcasts \`game ended\` for the final animation. Including \`playing = 0\` in the contact wait lets a touching sprite finish when time runs out.

Check a long overlap, a move away and a second contact, contact after time expires, and a restart. The counter should increase once per contact, stop at the end, and reset to 0 for the next game.`;

export const scratchBroadcastingLesson = `Broadcasting lets sprites send messages to each other.

${broadcastSequence}

${bowlFill}`;

export const scratchBroadcastingReview = `A broadcast lets sprites send messages to each other.

${broadcastSequence}`;
