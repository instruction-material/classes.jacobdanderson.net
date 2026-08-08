# Python Turtle Project Reference

This reference collects the Turtle patterns used in a small game-style project:
basic movement, clean code organization, score display, boundary checks, and
moving triangle enemies. It is meant to be read while building, debugging, or
reviewing a Turtle project.

## Turtle Command Reference

Turtle commands become much easier to remember when the argument units are
clear. Movement distances are measured in screen pixels, turns are measured in
degrees, and coordinates are measured from the center of the canvas.

| Command | Argument or unit | What it does |
| --- | --- | --- |
| `forward(distance)` | pixels | Moves the turtle forward in the direction it is facing. |
| `backward(distance)` | pixels | Moves the turtle backward without changing its heading. |
| `left(degrees)` | degrees | Turns the turtle counterclockwise. |
| `right(degrees)` | degrees | Turns the turtle clockwise. |
| `goto(x, y)` | coordinate pair | Moves the turtle to a specific position. The center is approximately `(0, 0)`. |
| `penup()` | no argument | Moves without drawing a line. |
| `pendown()` | no argument | Starts drawing again after the pen has been lifted. |
| `shape("triangle")` | shape name | Changes the visible turtle shape. Common shapes include `turtle`, `arrow`, `circle`, `square`, and `triangle`. |
| `stamp()` | no argument | Leaves a copy of the turtle's current shape on the canvas. |
| `write(text)` | string or value | Writes text at the turtle's current location. |
| `clear()` | no argument | Clears drawings or text made by that specific turtle. |
| `xcor()` and `ycor()` | no argument | Return the turtle's current x-coordinate and y-coordinate. |
| `hideturtle()` | no argument | Hides the turtle cursor while still allowing it to draw or write. |
| `speed(0)` | speed setting | Draws as quickly as possible. |

Useful movement examples:

```python
player.forward(50)      # Move 50 pixels forward
player.left(90)         # Turn 90 degrees counterclockwise
player.right(45)        # Turn 45 degrees clockwise
player.penup()
player.goto(-120, 80)   # Move to x = -120 and y = 80 without drawing
player.pendown()
```

## Project Organization

Readable Turtle programs usually follow the same broad structure. The exact
details can change, but keeping these sections separate makes the project easier
to extend.

1. Imports

   Put library imports at the top. For a Turtle game, this often includes
   `turtle`, `random`, and sometimes `time`.

2. Function definitions

   Define reusable actions before the main project logic. Examples include
   drawing the border, updating the score, checking bounds, and checking
   collisions. Functions should do one clear job when possible.

3. Variables and object attributes

   Create turtles, constants, score variables, speed values, colors, lists of
   enemies, and starting positions in one area. This makes the game state easy
   to find.

4. One-time setup logic

   Draw the border, place the player, display the starting score, and connect
   keyboard controls. These actions happen once when the program starts.

5. Continuous logic

   Put repeated behavior in the animation loop: move enemies, check collisions,
   update score text, bounce from walls, and refresh the screen.

Comments should explain sections and non-obvious decisions. They do not need to
repeat every command. Group related commands together, especially the common
movement pattern `penup()`, `goto(x, y)`, and `pendown()`.

## Score Turtle Pattern

Use a separate turtle for score text so the player turtle can keep moving
without rewriting the score from the wrong location. The score turtle should
hide itself, lift its pen, move to a corner, clear old text, and write the new
score.

```python
SCORE_POSITION = (-180, 175)
SCORE_FONT = ("Arial", 16, "normal")
COLLISION_DISTANCE = 20

score = 0

score_turtle = turtle.Turtle()
score_turtle.hideturtle()
score_turtle.penup()
score_turtle.goto(SCORE_POSITION)


def update_score():
    score_turtle.clear()
    score_turtle.write(f"Score: {score}", font=SCORE_FONT)


def check_collision(player, target):
    global score

    close_x = abs(player.xcor() - target.xcor()) < COLLISION_DISTANCE
    close_y = abs(player.ycor() - target.ycor()) < COLLISION_DISTANCE

    if close_x and close_y:
        score += 1
        update_score()
        return True

    return False
```

The `global score` line is needed because the function changes the value of the
score variable that was created outside the function. Without `global score`,
Python treats `score` as a new local variable inside the function.

Calling `clear()` before `write()` prevents the score from being drawn over
itself repeatedly. Without `clear()`, score text can become thick, bold-looking,
or hard to read because several copies overlap.

## Boundaries and In-Bounds Checks

The visible border and the movement rule are two different pieces of logic. The
border turtle draws the box. The bounds check decides whether a movement or
stamp should be allowed.

```python
BOUNDARY = 160
SIDE_COUNT = 4
RIGHT_ANGLE = 90

border_turtle = turtle.Turtle()
border_turtle.hideturtle()
border_turtle.speed(0)


def draw_border():
    border_turtle.penup()
    border_turtle.goto(-BOUNDARY, -BOUNDARY)
    border_turtle.pendown()

    for _ in range(SIDE_COUNT):
        border_turtle.forward(BOUNDARY * 2)
        border_turtle.left(RIGHT_ANGLE)


def is_inside_bounds(x_position, y_position):
    inside_x = -BOUNDARY <= x_position <= BOUNDARY
    inside_y = -BOUNDARY <= y_position <= BOUNDARY
    return inside_x and inside_y
```

When checking movement, calculate the target position first. Checking the
turtle's current location is not enough because the current location may still
be legal while the next move would leave the boundary.

```python
def move_player(x_change, y_change):
    next_x = player.xcor() + x_change
    next_y = player.ycor() + y_change

    if is_inside_bounds(next_x, next_y):
        player.goto(next_x, next_y)
```

The same idea works before stamping: decide whether the stamp position is legal
before calling `stamp()`.

## Game Template with Score, Boundaries, and Moving Triangles

This template combines the project pieces into one organized program. It uses
visual feedback only. Sound is intentionally left out because Python Turtle
environments do not always support the same sound playback tools.

```python
import random
import time
import turtle


#######################
###   CONSTANTS     ###
#######################

BOUNDARY = 160
SIDE_COUNT = 4
RIGHT_ANGLE = 90
PLAYER_STEP = 15
HIT_DISTANCE = 20
ENEMY_RESPAWN_BOUNDARY = 120
SCREEN_SIZE = (420, 420)
SCORE_POSITION = (-180, 175)
SCORE_FONT = ("Arial", 16, "normal")
PLAYER_COLOR = "blue"
FRAME_DELAY_SECONDS = 0.03
ENEMY_STARTS = [
    (-100, -70, 2, 3, "red"),
    (80, 40, -3, 2, "purple"),
    (20, 120, 2, -2, "orange")
]


#######################
###   VARIABLES     ###
#######################
score = 0
enemies = []

screen = turtle.Screen()
screen.setup(SCREEN_SIZE[0], SCREEN_SIZE[1])
screen.tracer(0)

player = turtle.Turtle()
player.shape("turtle")
player.color(PLAYER_COLOR)
player.penup()

score_turtle = turtle.Turtle()
score_turtle.hideturtle()
score_turtle.penup()
score_turtle.goto(SCORE_POSITION)

border_turtle = turtle.Turtle()
border_turtle.hideturtle()
border_turtle.speed(0)


#######################
###   FUNCTIONS     ###
#######################

# Check whether one position is inside the project boundary
def is_inside_bounds(x_position, y_position):
    inside_x = -BOUNDARY <= x_position <= BOUNDARY
    inside_y = -BOUNDARY <= y_position <= BOUNDARY
    return inside_x and inside_y


# Replace the old score text with the current value
def update_score():
    score_turtle.clear()
    score_turtle.write(f"Score: {score}", font=SCORE_FONT)


# Draw the square project boundary
def draw_border():
    border_turtle.penup()
    border_turtle.goto(-BOUNDARY, -BOUNDARY)
    border_turtle.pendown()

    # Draw each side with the same length and turn
    for _ in range(SIDE_COUNT):
        border_turtle.forward(BOUNDARY * 2)
        border_turtle.left(RIGHT_ANGLE)


# Move the player only when the destination stays in bounds
def move_player(x_change, y_change):
    next_x = player.xcor() + x_change
    next_y = player.ycor() + y_change

    # Apply the movement only when the destination is legal
    if is_inside_bounds(next_x, next_y):
        player.goto(next_x, next_y)


# Move the player up by one step
def move_up():
    move_player(0, PLAYER_STEP)


# Move the player down by one step
def move_down():
    move_player(0, -PLAYER_STEP)


# Move the player left by one step
def move_left():
    move_player(-PLAYER_STEP, 0)


# Move the player right by one step
def move_right():
    move_player(PLAYER_STEP, 0)


# Create one moving triangle enemy
def make_enemy(x_position, y_position, x_speed, y_speed, color_name):
    enemy = turtle.Turtle()
    enemy.shape("triangle")
    enemy.color(color_name)
    enemy.penup()
    enemy.goto(x_position, y_position)
    enemy.x_speed = x_speed
    enemy.y_speed = y_speed
    enemies.append(enemy)


# Move every enemy and reverse its speed at a boundary
def move_enemies():
    # Update each enemy independently
    for enemy in enemies:
        next_x = enemy.xcor() + enemy.x_speed
        next_y = enemy.ycor() + enemy.y_speed

        # Reverse horizontal motion before leaving the boundary
        if not is_inside_bounds(next_x, enemy.ycor()):
            enemy.x_speed *= -1
            next_x = enemy.xcor() + enemy.x_speed

        # Reverse vertical motion before leaving the boundary
        if not is_inside_bounds(enemy.xcor(), next_y):
            enemy.y_speed *= -1
            next_y = enemy.ycor() + enemy.y_speed

        enemy.goto(next_x, next_y)


# Update the score and reset enemies that touch the player
def check_enemy_collisions():
    global score

    # Check every enemy against the current player position
    for enemy in enemies:
        close_x = abs(player.xcor() - enemy.xcor()) < HIT_DISTANCE
        close_y = abs(player.ycor() - enemy.ycor()) < HIT_DISTANCE

        # Count and reset an enemy only after a collision
        if close_x and close_y:
            score += 1
            update_score()
            enemy.goto(
                random.randint(-ENEMY_RESPAWN_BOUNDARY, ENEMY_RESPAWN_BOUNDARY),
                random.randint(-ENEMY_RESPAWN_BOUNDARY, ENEMY_RESPAWN_BOUNDARY)
            )

###########################
###   EVENT LISTENERS   ###
###########################

screen.onkey(move_up, "Up")
screen.onkey(move_down, "Down")
screen.onkey(move_left, "Left")
screen.onkey(move_right, "Right")
screen.listen()


#######################
###   MAIN CODE     ###
#######################

draw_border()
update_score()

# Create each enemy from the shared configuration
for enemy_start in ENEMY_STARTS:
    make_enemy(*enemy_start)

# Continue updating the game until the window closes
while True:
    move_enemies()
    check_enemy_collisions()
    screen.update()
    time.sleep(FRAME_DELAY_SECONDS)
```

## Moving Triangles Homework Extension

The moving-triangle extension can be built in small steps:

1. Create more than one triangle turtle.
2. Store all triangle turtles in a list.
3. Give each triangle two movement values, such as `x_speed` for horizontal
   speed and `y_speed` for vertical speed.
4. In a loop, add `x_speed` and `y_speed` to each triangle's current position.
5. If the next x-position would leave the boundary, multiply `x_speed` by `-1`.
6. If the next y-position would leave the boundary, multiply `y_speed` by `-1`.
7. Move the triangle to the corrected next position.

This pattern makes the triangles appear to bounce. The important idea is that
direction is stored as data, not hardcoded as one permanent movement command.

## Sound in CodeHS Turtle

CodeHS supports uploaded audio files in programs, including common formats such
as MP3, OGG, and WAV. The CodeHS Python Turtle command reference does not show a
built-in Turtle sound command, so this reference does not include sound in the
Turtle template.

Official references:

- [CodeHS file uploads](https://help.codehs.com/en/articles/2372009-uploading-a-file-to-your-program)
- [CodeHS Python Turtle commands](https://codehs.com/documentation/new/python-turtle)

For a Turtle project, use visual feedback first: score changes, color changes,
stamps, messages, or movement changes. If sound becomes a requirement, test a
small CodeHS program in the exact environment first. If reliable sound playback
is needed for a larger game, Pygame is usually the better next tool because it is
designed for game loops, input, graphics, and sound.
