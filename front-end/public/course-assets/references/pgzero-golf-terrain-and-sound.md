# Golf terrain and sound extensions

Keep the working click-to-hit Golf project in its own saved attempt. These are
optional extensions after valid clicks, wall bounces, stopping, scoring and
round resets work. This guide supplies integration examples rather than a
complete game or an audio asset. Independently, trace each state change before
running it; with an instructor, pause at the same points and predict the result.

## Surface friction and continuous motion

Choose one damping factor per frame. With the lesson's pixels-per-frame speeds,
multiply both components by that factor once before moving the ball. A factor
between zero and one reduces speed; one preserves it; a factor greater than one
increases it. A sand factor closer to zero slows the ball more than grass.
Changing direction belongs to a wall collision, not surface friction. Check
corners and overlapping terrain regions so friction is not applied repeatedly.

A rectangular `ZRect` region can use `ball.colliderect(sand)` to test the Actor's
bounding rectangle. An irregular drawing does not make an irregular collision
shape. Document that approximation or implement and explain a different test.
Test whether the intended rule is any overlap, the center inside, or full
containment; use that rule consistently for friction and sounds.

For optional wind or a slope, add a small acceleration to velocity during each
update in the region, then apply damping and movement. Assigning a constant
velocity instead erases the player's shot. Describe the coordinate signs:
positive x moves right; positive y moves down. Keep the first version in the
lesson's per-frame units. A later `update(dt)` version must consistently convert
both acceleration and movement to time-based units.

## Play once per visit

`draw()` paints the scene. `update()` changes the state. A contact condition can
remain true across many updates; playing the sound inside that condition without
remembering the previous state restarts it repeatedly. Keep changing behavior
in `update()` and presentation in `draw()`. [Game-loop hooks](https://pygame-zero.readthedocs.io/en/stable/hooks.html).

Initialize `was_in_sand = False` beside the other persistent state. Merge the
following logic into the existing update function, before its position update.
Replace its previous grass-friction step with this single selected damping step;
do not add a second `update()` function or multiply by grass friction again
later. Preserve the existing play-mode guard before this logic:

```python
# sand is the existing ZRect; ball is the existing Actor.
def update():
    global was_in_sand
    touching_sand = ball.colliderect(sand)
    damping = 0.90 if touching_sand else FRICTION
    ball.xspeed *= damping
    ball.yspeed *= damping
    if touching_sand and not was_in_sand:
        sounds.sand.play()
    was_in_sand = touching_sand
    # Continue the existing movement, wall and goal checks here.
```

The factor 0.90 is an example to compare with grass 0.95, not a physical constant.
For contact states `False, True, True, False, True`, playback occurs twice, once
on each entry. Remaining still inside does not start another sound. Reset this
flag with velocity at a new round or lava reset. If the new spawn is in sand,
the next update counts a new visit; choose the spawn position deliberately.
Restrict this logic to the same play state as movement.

## An alternative: sound when slowing below a threshold

Choose entry playback or stopping playback first. For a stopping sound, track
`played_this_visit`; clear it after leaving the region, a new shot or a round
reset. Compute a speed magnitude with `hypot(xspeed, yspeed)`. An exact equality
such as `speed == 0.05` can be skipped as damping changes the value. A range such
as `0.01 <= speed <= 0.05` can remain true for several updates and can itself be
skipped. A remembered crossing, `previous_speed > threshold >= speed`, detects
a change from above to at-or-below the threshold, including a jump across it.
Play only when that crossing occurs in sand and `played_this_visit` is false;
then set the flag. Save `previous_speed` after the check, and initialize it from
the current velocity at a new shot or reset. This rule is different from playing
immediately when a ball starts at rest in sand; document the intended behavior.

## Prepare a usable local sound

Place a valid, nonempty WAV or OGG in the project's `sounds` directory. For
`sounds.sand`, use a compatible lowercase filename such as `sounds/sand.wav`.
Check the actual format; renaming an MP4 extension does not convert its audio.
A zero-byte file contains no playable data. Use an owned recording or an asset
with permission for this use, and record its source. A subscription preview or
protected URL is not a ready local asset. [Sound resources](https://pygame-zero.readthedocs.io/en/stable/builtins.html#sounds).

Load once and use `sounds.sand.set_volume(0.5)` for half volume. Volume ranges
from zero to one; values above one cannot amplify a quiet source beyond its
full playback level. Test at a comfortable output volume. First prove the logic
with a visible counter or a printed entry event so a missing sound cannot hide a
state bug, then connect the audio. [Sound volume](https://www.pygame.org/docs/ref/mixer.html#pygame.mixer.Sound.set_volume).

## Verify and explain

Trace entering, staying, leaving and reentering sand; remaining still inside;
negative velocity components; overlapping regions; a fast threshold crossing;
and a new shot. A lava reset returns to the documented position, clears both
velocity components, and resets contact/playback flags once. Verify that the
stroke policy and goal transition remain deliberate and unchanged by redraws.
Save the altered attempt separately, write expected results before execution,
then explain any difference. Keep terrain and audio optional rather than adding
them to the original Golf completion requirements.
