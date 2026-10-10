# Events and Safe Placement Reference

This optional, runnable reference is separate from Golf, Number Count and their
learner attempts. Start the reference from the course's **Start in IDE** action
and confirm the separate import. It supplies `main.py`, `tile_layout.py` and a
README. No images or sound files are required.

## Trace a click before copying a handler

Run `main.py` in PyGame mode. Before Enter, a click cannot score. Press Enter,
left-click the green rectangle, then click outside it and try a right-click.
Only a left-click on the rectangle adds one hit. Wait a second to see feedback
clear. Press R before that callback runs: the score resets and the old callback
is cancelled. Repeated draw/update frames cannot add hits or reset the score.

Pygame Zero calls `draw`, `update`, `on_mouse_down` and `on_key_down`; their
names matter. Mouse callback parameter names are `pos` and `button`. Pass the
function `clear_feedback` to `clock.schedule_unique`, without `()`, so it runs
later. `time.sleep` blocks the game loop. Keep initial values outside frame
functions. [Event hooks](https://pygame-zero.readthedocs.io/en/stable/hooks.html),
[clock reference](https://pygame-zero.readthedocs.io/en/stable/builtins.html#clock).

`global hits` is needed when the handler rebinds that module variable. Reading
`game_state` does not need a global declaration. Assigning `actor.x` changes an
object's attribute rather than rebinding the variable holding the actor.
In this example `update` deliberately has no changing behavior; adding movement
belongs there, while `draw` displays the current state.

## Finite tile placement

`layout_positions` makes a finite grid of cells, then samples distinct cells
without replacement. Pass the count, canvas width/height, actual tile
width/height and gap. It returns center coordinates and raises `ValueError`
when the requested count cannot fit. It never retries random positions forever.
Keep the helper file beside the importing game. For example:

```python
from tile_layout import layout_positions

positions = layout_positions(15, 600, 400, 40, 40)
for tile, position in zip(tiles, positions):
    tile.pos = position
```

First check `len(tiles) == len(positions)`; zip stops at the shorter sequence.
These positions assume equal rectangular extents and center anchors. For other
anchors or rotated sprites, use their actual bounding rectangles and verify
left/right/top/bottom. In a collision loop exclude the same object with
`other is not tile`; matching an image name does not identify a unique tile.
Check every pair once and confirm that every rectangle stays within the canvas.
An overcrowded layout should report a setup error, not leave the game frozen.

## Transfer without changing the core assignment

Preserve Number Count's assigned tile identity when labels hide. Compare the
clicked tile with the expected number before advancing. Handle the final tile
before indexing another one; reset the level's labels, timer and expected number
together. The published core remains timed memory play through level 15.
An untimed 5/10/15-tile practice mode is optional. Give it a separate saved copy.

For Golf, test a valid left-click, ignored right-click, a moving ball, a fast
pass over the hole, a slow arrival and a restart. A goal transition happens once.
In Alien Catch, schedule the next run and cancel that callback on restart.
Explain the event, state guard and reset in the saved learner project before
consulting its reference.

For optional Golf terrain and audio, use the [Golf Terrain and Sound Guide](/course-assets/references/pgzero-golf-terrain-and-sound.md). It supplies a persistent contact-state trace, a single friction step, threshold-crossing checks and valid local sound setup. Apply one extension to a separate saved Golf attempt after the baseline game works.
