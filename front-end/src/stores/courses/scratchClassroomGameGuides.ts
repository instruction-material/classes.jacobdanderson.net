export const scratchClassroomGameGuides: Record<string, string> = {
	"falling-catch": `## Optional transfer: a falling catch game

Complete the collection game's Normal check first. This continuation adds a
falling object and different outcomes for a catch and a miss. Keep the original
collection game as a saved .sb3 checkpoint. This is a new project, not a change
to an earlier lesson's progress record.

**Actors and coordinates:** Player moves horizontally near the bottom. Token
falls. Ground is the brown sprite, not the backdrop and not every stage edge.
The upper starting line is y: 145. Pick random -200 to 200 only for x so a new
drop always begins at the top, inside the stage's side margins. Selecting go to
random position would randomize y too. Smaller negative y steps fall more slowly.

**Run and predict:** The supplied arrows already work while held. On Player,
Round ready starts a forever loop containing if key left arrow pressed? then
change x by -5, and a separate right-arrow check with +5. The loop also clamps
x between -200 and 200 and waits 0.03 seconds. Test one tap, a held key, both
keys and releasing the key. The sensing question is checked each loop; it does
not wait for another key-pressed event. Normal speed is intended; turbo changes
the timing and is not the completion check.

**Trace the reset:** Stage's green-flag script sets Score to 0 and broadcasts
Round ready. Player then returns to (-120, -130). Token goes to random x and
y: 145, then repeats its fall and collision checks. This ordered shared-value
reset avoids a score-reset script competing with a separate scoring loop.

**Normal task on Token:** A catch is a worked example: if touching Player?
then change Score by 1 and respawn. Otherwise, if touching Ground?, the starter
already respawns but does not yet lose a point. Add change Score by -1 before
that existing respawn. Keep change y by -3 outside the condition so Token falls
on every pass, including when neither contact is true. Do not replace the
working catch branch or Player's controls.

**One outcome per drop:** Catch has priority, followed by the Ground check in
the otherwise branch. This prevents one drop from being counted as both a
catch and a miss when the sprites overlap. The respawn immediately moves Token
away from contact, so it cannot keep awarding a point for the same drop. The
Score monitor's checkbox controls visibility; hiding it does not clear Score.

**Check:** Predict the untouched starter's score after a miss: it stays at 0.
After the Normal task, restart, catch once and miss once; confirm Score returns
to 0. Catch three times and confirm three distinct drops and three points.
Hold an arrow to observe continuous movement and the boundary clamp. Restart
while Token is low: Score returns to 0, Player returns to its start and a fresh
drop begins at the top. Record actual output and repair one failed check.

**Hard:** Change the fall step or the player's step, one value at a time, and
predict which makes catching easier. Keep the one-outcome rule and reset.
Use an attached comment to explain why falling is outside the collision test.
Draw a trace for a catch, a miss and a tick with neither contact.

**Verification:**

**Partner routine:** One person drives while the other predicts the next
outcome and checks the score. Swap after a saved checkpoint. Download and
reopen the .sb3 before handing it over. This is a shared review/handoff routine;
the editor does not promise simultaneous multi-user editing.

**Explain:** Name the sprite that performs each action, the Boolean sensing
questions, the repeated movement and the shared variable. Retain the completed
catch game before choosing the projectile or level extension.`,
	"projectile-state": `## Optional extension: a two-state projectile

Keep the completed catch game in its own saved file. Start this separate
experiment to study a single projectile before adding opponents, scoring or
multiple shots. Player and Projectile are different actors. The projectile
moves after launch; the player's movement script does not launch it by itself.

**Draw the states before coding:** Ready is isFired = 0, with Projectile hidden
and following Player. Flying is isFired = 1, with Projectile visible and moving
right. The green flag resets the shared value to 0 before Round ready. Space
while ready enters flying. Touching an edge hides Projectile and returns to 0.
While flying, another Space input must not restart the projectile at Player.

- **Ready (0), no Space:** Stay hidden, follow Player, remain 0.
- **Ready (0), Space pressed:** Point right, show, set isFired to 1.
- **Flying (1), no edge contact:** Move 8 steps, remain 1.
- **Flying (1), touching an edge:** Hide, set isFired to 0, await Space release.

**Read the working setup:** Player has the same held-left/right controls as
the catcher. Stage initializes isFired. Projectile's Round ready receiver
hides it and waits until Space is released before starting the loop. The ready
branch goes to Player while hidden and shows it on a launch. An edge return
also waits for release, so holding Space is one press, not an automatic stream
of shots. A new press after release can launch the next flight.

**Normal task on Projectile:** The supplied flying branch contains if <0 = 1>.
It deliberately never runs. Replace the left 0 with the oval isFired reporter;
leave the right value 1. The result is if <isFired = 1>. The variable reporter
contains a value; the equals operator produces the Boolean hexagon required by
if. Do not try to drop the oval variable directly into the hexagonal condition.

Before the repair, pressing Space shows a projectile and sets the monitor to
1, but it does not fly. The flag restores the ready/hidden checkpoint. After
the repair, the same branch moves the projectile and tests touching edge?.
All of the needed actions are supplied; complete the named comparison rather
than replacing the entire project.

**Check one flight:** Restart with Space released. Confirm Projectile is hidden
and isFired = 0. Press Space: it appears at Player and moves right. Move Player
while it is flying: the projectile keeps its own position and is not teleported
back to Player. Hold Space through the edge: it hides, returns to 0 and remains
hidden until release and a fresh press. Release during a flight: the projectile
continues to the edge. Restart during a flight, including while Space is held:
it hides and stays ready until release. Check the monitor and the actual
visibility/movement separately.

**Hard:** Draw a version that fires left or right. Read Player's direction
once at launch and keep that direction for the whole flight. Explain why
reading Player's current direction on every tick could turn a shot in midair.
Specify a target-hit transition before adding targets; an edge and a target
must not trigger duplicate outcomes for the same projectile.

**Verification:**

**Explain and retain:** Label the two states, their entry actions, the Space
trigger, the edge return and both self-loops. Explain why a hidden sprite still
exists and why isFired uses 0/1 comparisons here. Add a concise block comment,
save as a separate .sb3, reopen it and repeat the check before sharing.`,
	"catch-levels": `## Optional extension: three short game levels

Start after the falling catch game's check works. This starter carries the
completed catch/miss rules and held-key controls into a new experiment. Save
the earlier game first. Define the progression before adding more sprites or
backdrops; the level number must change a rule the player can observe.

**Rules:** Score starts at 0, Level at 1 and FallSpeed at 3. A catch adds 1; a
miss subtracts 1. At Score 3 or more, Level 1 advances to Level 2 and FallSpeed
becomes 5. At Score 6 or more, Level 2 advances to Level 3 and FallSpeed becomes
7. A later miss does not demote an earned level. Level 3 is the final level in
this experiment; the flag restarts at Level 1. Score is integer-valued.

**Trace the working setup:** Stage resets all three shared variables before
broadcasting Round ready. Player starts its movement loop. Token starts at
random x in -200 to 200 and y: 145. On each tick it changes y by 0 - FallSpeed,
then handles one catch or miss and respawns. That subtraction makes a positive
speed value move downward; changing y by positive FallSpeed would move upward.

**Normal task on Stage:** The Round ready receiver has two empty conditions.
The first combines Level = 1 and Score > 2. Put set Level to 2 and set FallSpeed
to 5 inside it. The second combines Level = 2 and Score > 5. Put set Level to 3
and set FallSpeed to 7 inside it. For this integer score, > 2 means at least 3,
and > 5 means at least 6. Keep these checks in their supplied forever loop and
leave the working catcher scripts unchanged.

The level guards make progression depend on both current state and score.
After Level 2 is earned, a miss below 3 does not execute a downgrade. If a test
sets Score directly to 6 while Level is 1, the first check can advance to 2
and the second can then advance to 3 in the same loop pass. Explain this
ordered execution rather than assuming that only one if can run.

**Run and predict:** In the untouched starter, scoring works but Level stays
at 1 and FallSpeed stays at 3 because the two action areas are empty. After
the Normal task, collect three drops: confirm Level 2 and visibly faster falls.
Collect until Score reaches 6: confirm Level 3 and speed 7. Miss after earning
each level and confirm its speed is retained. The score monitor alone cannot
prove that the speed changed; watch the fall and inspect the named value.

**Check boundaries and restart:** Test scores 2, 3, 5 and 6. In a separate
changed case, set Score to 6 while Level is 1 and predict the final values.
Restart after reaching Level 3 and confirm Score 0, Level 1, FallSpeed 3, the
starting Player position and a fresh top-of-stage drop. A second restart must
give the same reset. Avoid turbo when comparing the normal difficulty rules.

**Hard:** Choose different thresholds and speeds, document them, then test
just below and at each threshold. Optionally switch a backdrop when a level
changes, but retain the speed rule as observable gameplay. Design an ending
only after the three-level progression is reliable. State what stops,
what remains visible and how the green flag restores the next round.

**Verification:**

**Explain and retain:** Show which variable is score, which is state, which
controls movement and which conditions cause a transition. Use a partner as a
tester with only the written rules, swap driver/navigator roles after saving,
and repair a confusing behavior. Save and reopen a separate .sb3. The required
independent mini-game remains a different task: design an original rule rather
than presenting this supplied continuation as an independent game.`
};
