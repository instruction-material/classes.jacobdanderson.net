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

## Gradual volume changes

For a fading sound, retain its volume between updates. Initialize
`sand_volume = 1.0` beside `was_in_sand`. Merge this helper call into the
existing `update()`, after the play-state guard and contact test:

```python
def update_sand_volume(touching_sand):
    global sand_volume
    if touching_sand:
        sand_volume = max(0.2, sand_volume - 0.005)
    else:
        sand_volume = 1.0
    sounds.sand.set_volume(sand_volume)
```

Call `update_sand_volume(touching_sand)` once each frame. Keep the earlier
entry-only playback check; changing volume does not start or extend a sound.
Use a clip long enough to hear the change. The example decreases by 0.005 per
frame and stops at 0.2, so its timing depends on the frame rate. A time-based
version should decrease by a rate multiplied by `dt`. A nested `while` or
`time.sleep` would prevent the game from processing movement and input.

For contact states `False, True, True, False, True`, the volume becomes
`1.0, 0.995, 0.990, 1.0, 0.995`. Leaving sand resets it immediately, even while
the ball is moving. At a new round, lava reset or accepted new shot, reset both
`was_in_sand = False` and `sand_volume = 1.0`, stop the previous sand sound, and
set its volume to one before the next update. A new visit then starts a fresh
fade rather than inheriting the old one.

`on_mouse_down` runs when the button is pressed; `on_mouse_up` runs when it is
released. Put the accepted shot's one-time reset in the chosen handler, after
its button, play-state and stopped-ball checks. Keep the contact test and
continuous volume changes in `update()`, so they continue between clicks.
Retain `draw()` for display.

## Transparent sprites and rotation

A PNG can store transparent pixels. An opaque black or white background remains
visible until those pixels are removed in an image editor and the result is
exported with transparency. A checkerboard painted into an image is still part
of the image; renaming a JPEG to PNG does not remove its background. Keep the
original file and inspect the exported copy over both light and dark backgrounds.

Put the exported sprite at `images/star.png`, with the `images` folder beside
the game file, and load it with `Actor("star")`. Resource names use lowercase letters,
numbers and underscores, beginning with a letter. The extension is omitted from
the Actor name. A single still image can rotate through code; an animated image
file is unnecessary for a spinning sprite. [Image resources and rotation](https://pygame-zero.readthedocs.io/en/stable/builtins.html).

This complete example uses `images/alien.png` from the supplied course assets.
Run it in PyGame mode or with `pgzrun sprite_rotation.py`:

```python
WIDTH = 400
HEIGHT = 300
sprite = Actor("alien", center=(200, 150))

def draw():
    screen.fill((30, 60, 90))
    sprite.draw()

def update():
    sprite.angle = (sprite.angle + 2) % 360
```

Increasing `angle` turns counterclockwise around the anchor, which defaults to
the center. The example advances two degrees per update; its speed depends on
the frame rate. Replace `"alien"` with `"star"` after the new image is available.
Rotation changes the Actor's bounding rectangle, so recheck wall and collision
behavior. Transparent corners still lie inside that rectangle; a circular
collision rule needs its own geometric test.

## Showing one frame of a sprite sheet

A sprite sheet stores several animation frames in one image. Select a source
rectangle when copying a frame instead of manually saving a separate file for
each frame. In a 64×32 sheet with two 32×32 cells, the rectangles start at
`(0, 0)` and `(32, 0)`; each has width and height 32.

The `area` argument of [Surface.blit](https://www.pygame.org/docs/ref/surface.html#pygame.Surface.blit)
selects the source pixels. The destination position is separate. Pygame Zero's
`screen.blit(surface, position)` displays the cropped result; its second argument
is the destination, rather than a source rectangle.

This complete example creates its own two-frame sheet, so it needs no image
files. Save it as `sprite_sheet.py` and run it in PyGame mode or with
`pgzrun sprite_sheet.py`:

```python
import pygame

WIDTH = 320
HEIGHT = 200
FRAME_SIZE = 32
FRAME_SECONDS = 0.2

sheet = pygame.Surface((64, 32), pygame.SRCALPHA)
pygame.draw.circle(sheet, (230, 80, 60), (16, 16), 12)
pygame.draw.circle(sheet, (245, 190, 40), (48, 16), 8)
frame = pygame.Surface((FRAME_SIZE, FRAME_SIZE), pygame.SRCALPHA)
elapsed = 0.0
frame_index = 0

def draw():
    screen.fill((30, 60, 90))
    frame.fill((0, 0, 0, 0))
    source_rect = Rect(frame_index * FRAME_SIZE, 0, FRAME_SIZE, FRAME_SIZE)
    frame.blit(sheet, (0, 0), source_rect)
    screen.blit(frame, (120, 80))

def update(dt):
    global elapsed, frame_index
    elapsed = (elapsed + dt) % (FRAME_SECONDS * 2)
    frame_index = int(elapsed / FRAME_SECONDS)
```

The source rectangle moves one cell right for frame one. Both frames retain the
same 32×32 output size, keeping their positions aligned. Clear the reusable
frame to transparent pixels before copying the next region, so a smaller shape
does not leave pixels from the previous frame. Create the surfaces once,
outside `draw()`. The elapsed time wraps through the two frames without pausing
input or starting a second game loop.

For a different sheet, record its actual pixel dimensions, cell width and height,
row/column count and frame order. Keep each source rectangle within those bounds.
A desktop image loaded with
[pygame.image.load](https://www.pygame.org/docs/ref/image.html#pygame.image.load)
retains the file's transparency; use `convert_alpha()` after the display is
initialized when preparing an alpha-enabled desktop surface.

Transfer the original PNG as a file, ZIP or direct download. A screenshot of a
displayed sprite can include its preview background, and a photo-sharing route
may re-encode it. Check the received file's format and transparency over light
and dark backgrounds. Changing its extension cannot recover transparency that
was lost.

## Verify and explain

Trace entering, staying, leaving and reentering sand; remaining still inside;
negative velocity components; overlapping regions; a fast threshold crossing;
and a new shot. A lava reset returns to the documented position, clears both
velocity components, and resets contact/playback flags once. Verify that the
stroke policy and goal transition remain deliberate and unchanged by redraws.
Save the altered attempt separately, write expected results before execution,
then explain any difference. Keep terrain and audio optional rather than adding
them to the original Golf completion requirements.
