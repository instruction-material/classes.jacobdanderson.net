import { api } from "@/api";
import {
	listPreviewFiles,
	loadPreviewFile,
	parseGitHubResource
} from "@/modules/codePreview";

const WHITESPACE_RE = /\s+/g;
const FILE_EXTENSION_RE = /\.[\dA-Z]+$/i;
const JAVA_EXTENSION_RE = /\.java$/i;
const PYTHON_EXTENSION_RE = /\.py$/i;
const CODE_EXTENSION_RE = /\.(?:java|py)$/i;
const SAFE_FILE_SEGMENT_RE = /^\w[\w.-]*$/;
const ROOT_TEXT_FILE_RE = /^\w[\w.-]*\.(?:csv|eps|java|json|md|ps|py|txt)$/i;
const IMAGE_FILE_RE = /^images\/\w[\w.-]*\.(?:gif|jpe?g|png|svg|webp)$/i;
const AUDIO_FILE_RE = /^(?:music|sounds)\/\w[\w.-]*\.(?:mp3|ogg|wav)$/i;
const ASSET_DIRECTORY_NAMES = new Set(["images", "music", "sounds"]);
const PYTHON_IDE_RUNTIME_RESERVED_FILE_NAMES = new Set([
	"_classes_artifacts.py",
	"_classes_keras.py",
	"_classes_pgzero.py",
	"keras.py",
	"pgzero.py",
	"pgzrun.py",
	"pygame.py",
	"pysynth.py",
	"streamlit.py",
	"tensorflow.py",
	"turtle.py",
	"zrect.py"
]);
const PYTHON_IDE_RUNTIME_RESERVED_ROOTS = new Set([
	"keras",
	"pgzero",
	"tensorflow"
]);
const TEXT_FILE_RE = /\.(?:csv|eps|java|json|md|ps|py|txt|svg)$/i;
const IMAGE_EXTENSION_RE = /\.(?:gif|jpe?g|png|svg|webp)$/i;
const SOUND_EXTENSION_RE = /\.wav$/i;
const MUSIC_EXTENSION_RE = /\.(?:mp3|ogg)$/i;
const STARTER_RELATIVE_PREFIX_RE = /^(?:starter|src)\//i;
const PYTHON_IDE_INDEXED_DB_NAME = "classes-python-ide";
const PYTHON_IDE_INDEXED_DB_VERSION = 1;
const PYTHON_IDE_PROJECT_STORE = "projectStores";
const JAVA_ENTRY_POINT_IGNORED_TEXT_RE =
	/"""[\s\S]*?"""|\/\*[\s\S]*?\*\/|\/\/[^\n\r]*|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'/g;
const JAVA_MAIN_METHOD_RE =
	/\bmain\s*\(\s*(?:\w+\s*\[\s*\]\s+\w+|\w+\s+\w+\s*\[\s*\]|\w+\s*\.\.\.\s+\w+)\s*\)/;
const KAREL_RUN_METHOD_RE = /\brun\s*\(\s*\)/;
const PYTHON_IDE_SHARE_ID_RE = /^[\w-]{20,80}$/;

export type PythonIdeFileEncoding = "text" | "base64";

export type PythonIdeMode =
	"data" | "java" | "karel" | "pgzero" | "python" | "turtle";
export type PythonIdeProjectTemplate =
	| "blank"
	| "bluej"
	| "circle-art"
	| "classroom-project"
	| "course"
	| "demo"
	| "firework-festival"
	| "flower-garden"
	| "maze-explorer"
	| "neon-trail"
	| "outline"
	| "picasso"
	| "spiral-galaxy"
	| "turtle-race"
	| "triangle-motion";

export interface PythonIdeFile {
	name: string;
	content: string;
	encoding?: PythonIdeFileEncoding;
}

export interface PythonIdeProject {
	_id: string;
	title: string;
	mode: PythonIdeMode;
	files: PythonIdeFile[];
	activeFileName: string;
	courseID?: string;
	courseProjectKey?: string;
	courseProjectTitle?: string;
	starterLabel?: string;
	starterUrl?: string;
	shared?: boolean;
	shareID?: string;
	shareCreatedAt?: string;
	sharedSourceID?: string;
	createdAt?: string;
	updatedAt?: string;
}

export type SharedPythonIdeProject = Pick<
	PythonIdeProject,
	| "activeFileName"
	| "courseID"
	| "courseProjectKey"
	| "courseProjectTitle"
	| "files"
	| "mode"
	| "starterLabel"
	| "starterUrl"
	| "title"
>;

export type PythonIdeProjectReviewRole = "admin" | "tutor";

export interface PythonIdeProjectReview {
	_id: string;
	sourceProject: string;
	title: string;
	mode: PythonIdeMode;
	files: PythonIdeFile[];
	activeFileName: string;
	courseID?: string;
	courseProjectKey?: string;
	courseProjectTitle?: string;
	reviewerRole: PythonIdeProjectReviewRole;
	reviewerName?: string;
	lastEditedByRole?: PythonIdeProjectReviewRole;
	lastEditedByName?: string;
	visibleToStudent: boolean;
	note?: string;
	sourceUpdatedAt?: string;
	createdAt?: string;
	updatedAt?: string;
}

export interface ManagedPythonIdeProject {
	project: PythonIdeProject;
	review: PythonIdeProjectReview | null;
}

export type PythonIdeProjectMetadata = Omit<PythonIdeProject, "files">;
export type PythonIdeProjectReviewMetadata = Omit<
	PythonIdeProjectReview,
	"files"
>;

export interface ManagedPythonIdeProjectMetadata {
	project: PythonIdeProjectMetadata;
	review: PythonIdeProjectReviewMetadata | null;
}

interface PythonIdeProjectPage<T> {
	nextOffset: number | null;
	projects: T[];
}

interface PythonIdeProjectReviewPage {
	nextOffset: number | null;
	reviews: PythonIdeProjectReviewMetadata[];
}

function nextPythonIdePageOffset(
	currentOffset: number,
	nextOffset: number | null
) {
	if (nextOffset === null) return null;
	if (!Number.isSafeInteger(nextOffset) || nextOffset <= currentOffset) {
		throw new Error("Project list pagination did not advance.");
	}
	return nextOffset;
}

export interface PythonIdeProjectPayload {
	title?: string;
	mode?: PythonIdeMode;
	files?: PythonIdeFile[];
	activeFileName?: string;
	courseID?: string;
	courseProjectKey?: string;
	courseProjectTitle?: string;
	starterLabel?: string;
	starterUrl?: string;
	sharedSourceID?: string;
}

export interface CreatePythonIdeProjectOptions {
	courseID?: string;
	courseProjectKey?: string;
	courseProjectTitle?: string;
	files?: PythonIdeFile[];
	sharedSourceID?: string;
	starterLabel?: string;
	starterUrl?: string;
	template?: PythonIdeProjectTemplate;
	title?: string;
}

interface PythonIdeProjectStorageRecord {
	key: string;
	projects: PythonIdeProject[];
	updatedAt: string;
}

export const pythonIdeStorageNamespace = "classes-python-ide-projects";
export const pythonIdeAllowedFileExtensions = [
	".py",
	".java",
	".csv",
	".json",
	".txt",
	".md",
	".ps",
	".eps",
	".png",
	".jpg",
	".jpeg",
	".gif",
	".svg",
	".webp",
	".wav",
	".mp3",
	".ogg"
] as const;
export const pythonIdeFileUploadAccept =
	pythonIdeAllowedFileExtensions.join(",");

let pythonIdeStorageDbPromise: Promise<IDBDatabase> | null = null;

const pythonIdeCourseModes: Record<string, PythonIdeMode> = {
	"ai-level-1": "data",
	"ap-computer-science-a": "java",
	"data-science-in-python": "data",
	"design-patterns-in-java": "java",
	"design-patterns-in-java-part-2": "java",
	"java-level-1": "karel",
	"java-level-2": "java",
	"java-level-3": "java",
	"machine-learning": "data",
	pygames: "pgzero",
	"pygames-classroom": "pgzero",
	"python-level-1": "turtle",
	"python-level-1-classroom": "turtle",
	"python-level-2": "python",
	"python-level-2-classroom": "python",
	"python-level-3": "python",
	"python-to-java-and-cpp-bridge": "python",
	"pythonic-design-patterns": "python"
};

export function normalizePythonIdeMode(
	value: string | null | undefined,
	fallback: PythonIdeMode = "python"
): PythonIdeMode {
	if (value === "bluej") return "java";
	if (
		value === "data" ||
		value === "java" ||
		value === "karel" ||
		value === "pgzero" ||
		value === "turtle"
	) {
		return value;
	}
	if (value === "python") return "python";
	return fallback;
}

export function pythonIdeModeForCourseId(courseId: string | null | undefined) {
	return courseId ? (pythonIdeCourseModes[courseId] ?? null) : null;
}

export function isValidPythonIdeShareID(value: string | null | undefined) {
	return typeof value === "string" && PYTHON_IDE_SHARE_ID_RE.test(value);
}

export const pythonStarterCode = `#####################
###   CONSTANTS   ###
#####################
GREETING_MESSAGE = "Hello, Python!"
NAME_PROMPT = "What is your name? "


#####################
###   MAIN CODE   ###
#####################
# Store reusable text in named variables before printing
print(GREETING_MESSAGE)

# Collect one user value and use the name clearly
student_name = input(NAME_PROMPT)
print(f"Nice to meet you, {student_name}.")
`;

export const turtleStarterCode = `import turtle

#####################
###   CONSTANTS   ###
#####################
BACKGROUND_COLOR = "white"
PEN_COLOR = "teal"
PEN_SIZE = 3
FORWARD_STEP = 30
TURN_ANGLE = 20
ANIMATION_STEP = 2
ANIMATION_DELAY_MS = 16
DOT_SIZE = 18
DOT_COLOR = "coral"


#####################
###   VARIABLES   ###
#####################
screen = turtle.Screen()
screen.bgcolor(BACKGROUND_COLOR)

pen = turtle.Turtle()
pen.color(PEN_COLOR)
pen.pensize(PEN_SIZE)
is_moving = True


#####################
###   FUNCTIONS   ###
#####################
# Move the turtle by one visible step
def move_forward():
    pen.forward(FORWARD_STEP)

# Turn the turtle by one visible amount
def turn_left():
    pen.left(TURN_ANGLE)

# Switch the animation loop between moving and paused
def toggle_motion():
    global is_moving
    is_moving = not is_moving

# Advance the animation frame when motion is enabled
def animate():
    # Move only while the project is in its active motion state
    if is_moving:
        pen.forward(ANIMATION_STEP)
    screen.ontimer(animate, ANIMATION_DELAY_MS)

# Draw a dot where the user clicks
def draw_dot(x, y):
    pen.penup()
    pen.goto(x, y)
    pen.pendown()
    pen.dot(DOT_SIZE, DOT_COLOR)

# Move the pen while the turtle is dragged
def drag_pen(x, y):
    pen.goto(x, y)


###########################
###   EVENT LISTENERS   ###
###########################
screen.onkey(move_forward, "Up")
screen.onkey(turn_left, "Left")
screen.onkey(toggle_motion, "space")
screen.onclick(draw_dot)
pen.ondrag(drag_pen)
screen.ontimer(animate, ANIMATION_DELAY_MS)
screen.listen()
`;

export const pythonLevel1OutlineStarterCode = `import random
import turtle

#####################
###   CONSTANTS   ###
#####################
NUM_TURTLES = 0
MOVE_DISTANCE = 1


#####################
###   FUNCTIONS   ###
#####################
# Configure one turtle before the main program starts
def setup_turtle(current_turtle, color_name):
    pass

# Run the first keyboard or mouse action
def action_one():
    pass

# Run the second keyboard or mouse action
def action_two():
    pass


#####################
###   VARIABLES   ###
#####################
main_turtle = turtle.Turtle()
# Configure the main turtle here

# Create the shared drawing screen
screen = turtle.Screen()

# Add more project state here as needed

# Store any additional turtles in one collection
turtle_list = []

# Build each extra turtle before the animation loop starts
for _ in range(NUM_TURTLES):
    new_turtle = turtle.Turtle()
    # Configure each additional turtle here
    turtle_list.append(new_turtle)


###########################
###   EVENT LISTENERS   ###
###########################
screen.onkey(action_one, "KEY_HERE")
screen.onkey(action_two, "KEY_HERE")
# Add any other event listeners here

screen.listen()


#####################
###   MAIN CODE   ###
#####################
animation_running = True

# Keep the main animation running while the project is active
while animation_running:
    main_turtle.forward(MOVE_DISTANCE)

    # Conditions and additional actions here
    # Example if main_turtle.ycor() < -200

    # Update each extra turtle in the list
    for current_turtle in turtle_list:
        current_turtle.forward(MOVE_DISTANCE)

        # Conditions and additional actions here
        # Example if current_turtle.xcor() > 3
`;

export const turtleCircleArtStarterCode = `import random
import turtle

#######################
###   CONSTANTS     ###
#######################
BACKGROUND_COLOR = "midnightblue"
ART_COLORS = [
    "red",
    "orange",
    "gold",
    "limegreen",
    "deepskyblue",
    "blueviolet",
    "hotpink"
]
CIRCLE_COUNT = 24
CIRCLE_RADIUS = 55
TURN_ANGLE = 360 / CIRCLE_COUNT
PEN_SIZE = 2
DRAWING_SPEED = 8
ART_POSITIONS = [(-170, 40), (0, -35), (170, 40)]


########################
###   NORMAL SECTION  ###
########################
# Return one color from ART_COLORS
# Use circle_index to create a repeating pattern
def choose_circle_color(circle_index):
    pass


######################
###   HARD SECTION  ###
######################
# Add a center, border, label, or another detail to each burst
def add_burst_detail(x_position, y_position):
    pass


#######################
###   FUNCTIONS     ###
#######################
# Move without drawing a connecting line
def move_to(x_position, y_position):
    artist.penup()
    artist.goto(x_position, y_position)
    artist.pendown()

# Draw one filled circle with a chosen color
def draw_filled_circle(radius, color_name):
    artist.color(color_name)
    artist.begin_fill()
    artist.circle(radius)
    artist.end_fill()

# Build one burst from repeated circles and turns
def draw_circle_burst(x_position, y_position):
    move_to(x_position, y_position)

    for circle_index in range(CIRCLE_COUNT):
        circle_color = choose_circle_color(circle_index)
        if circle_color not in ART_COLORS:
            circle_color = random.choice(ART_COLORS)
        draw_filled_circle(CIRCLE_RADIUS, circle_color)
        artist.right(TURN_ANGLE)

    add_burst_detail(x_position, y_position)


#######################
###   VARIABLES     ###
#######################
screen = turtle.Screen()
screen.bgcolor(BACKGROUND_COLOR)
screen.title("Color Circle Art")

artist = turtle.Turtle()
artist.pensize(PEN_SIZE)
artist.speed(DRAWING_SPEED)


#######################
###   MAIN CODE     ###
#######################
# Run the finished design once, then remix the constants above
for art_position in ART_POSITIONS:
    draw_circle_burst(art_position[0], art_position[1])

artist.hideturtle()
`;

export const turtlePicassoStarterCode = `from random import choice
from turtle import Screen, Turtle

#######################
###   CONSTANTS     ###
#######################
BACKGROUND_COLOR = "black"
COLOR_PALETTE = [
    "red",
    "light blue",
    "green",
    "yellow",
    "white",
    "orange"
]
DRAWING_SPEED = 5


#######################
###   VARIABLES     ###
#######################
screen = Screen()
screen.bgcolor(BACKGROUND_COLOR)
screen.title("Picasso Keyboard Painter")

artist = Turtle()
artist.speed(DRAWING_SPEED)


########################
###   NORMAL SECTION  ###
########################
# Replace this placeholder with your draw_square() function
# Keep the name draw_square or update screen.onkey() below to match
def draw_square():
    pass


######################
###   HARD SECTION  ###
######################
# Add another shape or effect for the B key
def draw_bonus_shape():
    pass


###########################
###   EVENT LISTENERS   ###
###########################
screen.onkey(draw_square, "s")
screen.onkey(draw_bonus_shape, "b")
screen.listen()
`;

export const turtleTriangleMotionStarterCode = `import turtle

#####################
###   CONSTANTS   ###
#####################
BACKGROUND_COLOR = "yellow"
OUTLINE_COLOR = "blue"
FILL_COLOR = "deepskyblue"
MOVE_DISTANCE = 20
TRIANGLE_SIDE_LENGTH = 60
TURN_ANGLE = 120


#####################
###   VARIABLES   ###
#####################
screen = turtle.Screen()
screen.bgcolor(BACKGROUND_COLOR)
screen.title("Triangle Motion Starter")
screen.tracer(0)

artist = turtle.Turtle()
artist.hideturtle()
artist.color(OUTLINE_COLOR, FILL_COLOR)


########################
###   NORMAL SECTION  ###
########################
# Replace this placeholder with code that draws one triangle
# Use TRIANGLE_SIDE_LENGTH and TURN_ANGLE to draw three equal sides
# Add begin_fill() and end_fill() if the triangle should be filled
def draw_triangle():
    pass


######################
###   HARD SECTION  ###
######################
# Add an interior design or a second movable shape
def add_triangle_detail():
    pass


#####################
###   FUNCTIONS   ###
#####################
# Clear the previous triangle and redraw it at the current position
def redraw_triangle():
    artist.clear()
    artist.pendown()
    draw_triangle()
    add_triangle_detail()
    screen.update()

# Move right without drawing a connecting line
def move_right_and_draw():
    artist.penup()
    artist.goto(artist.xcor() + MOVE_DISTANCE, artist.ycor())
    redraw_triangle()

# Move left without drawing a connecting line
def move_left_and_draw():
    artist.penup()
    artist.goto(artist.xcor() - MOVE_DISTANCE, artist.ycor())
    redraw_triangle()


###########################
###   EVENT LISTENERS   ###
###########################
screen.onkey(move_right_and_draw, "Right")
screen.onkey(move_left_and_draw, "Left")
screen.listen()


#####################
###   MAIN CODE   ###
#####################
# Draw once after the student completes draw_triangle()
redraw_triangle()
`;

export const turtleNeonTrailStarterCode = `import random
import turtle

#####################
###   CONSTANTS   ###
#####################
BACKGROUND_COLOR = "black"
TRAIL_COLORS = ["cyan", "magenta", "yellow", "lime", "orange"]
DEFAULT_TRAIL_COLOR = "cyan"
MOVE_DISTANCE = 28
TURN_ANGLE = 30
DOT_SIZE = 10
PEN_SIZE = 4
DRAWING_SPEED = 6


#####################
###   VARIABLES   ###
#####################
screen = turtle.Screen()
screen.bgcolor(BACKGROUND_COLOR)
screen.title("Neon Trail Painter")

artist = turtle.Turtle()
artist.shape("turtle")
artist.pensize(PEN_SIZE)
artist.speed(DRAWING_SPEED)


########################
###   NORMAL SECTION  ###
########################
# Return one color from TRAIL_COLORS
# Try returning your favorite color first
def choose_trail_color():
    pass


######################
###   HARD SECTION  ###
######################
# Add a stamp, shape, or short pattern for the space bar
def add_special_effect():
    pass


#####################
###   FUNCTIONS   ###
#####################
# Use the student choice or choose a friendly fallback
def next_trail_color():
    color_name = choose_trail_color()
    if color_name not in TRAIL_COLORS:
        color_name = random.choice(TRAIL_COLORS)
    return color_name

# Move forward and leave a bright trail
def move_forward():
    artist.color(next_trail_color())
    artist.pendown()
    artist.forward(MOVE_DISTANCE)
    artist.dot(DOT_SIZE)

# Move backward and leave a bright trail
def move_backward():
    artist.color(next_trail_color())
    artist.pendown()
    artist.backward(MOVE_DISTANCE)
    artist.dot(DOT_SIZE)

# Turn left without moving
def turn_left():
    artist.left(TURN_ANGLE)

# Turn right without moving
def turn_right():
    artist.right(TURN_ANGLE)

# Remove the drawing while keeping the controls ready
def clear_trail():
    artist.clear()


###########################
###   EVENT LISTENERS   ###
###########################
screen.onkey(move_forward, "Up")
screen.onkey(move_backward, "Down")
screen.onkey(turn_left, "Left")
screen.onkey(turn_right, "Right")
screen.onkey(add_special_effect, "space")
screen.onkey(clear_trail, "c")
screen.listen()


#####################
###   MAIN CODE   ###
#####################
# Give the painter a bright starting point
artist.color(DEFAULT_TRAIL_COLOR)
artist.dot(DOT_SIZE)
`;

export const turtleFireworkFestivalStarterCode = `import random
import turtle

#####################
###   CONSTANTS   ###
#####################
BACKGROUND_COLOR = "midnight blue"
FIREWORK_COLORS = ["gold", "cyan", "magenta", "orange", "lime", "white"]
DEFAULT_FIREWORK_COLOR = "gold"
RAY_COUNT = 16
RAY_LENGTH = 54
FULL_TURN = 360
CENTER_SIZE = 16
PEN_SIZE = 3
DRAWING_SPEED = 0
STARTING_FIREWORK_POSITIONS = [(-130, 60), (110, -30)]


#####################
###   VARIABLES   ###
#####################
screen = turtle.Screen()
screen.bgcolor(BACKGROUND_COLOR)
screen.title("Firework Festival")
screen.tracer(0)

artist = turtle.Turtle()
artist.hideturtle()
artist.speed(DRAWING_SPEED)
artist.pensize(PEN_SIZE)


########################
###   NORMAL SECTION  ###
########################
# Return one color from FIREWORK_COLORS
# Try using random.choice for a surprise color
def choose_firework_color():
    pass


######################
###   HARD SECTION  ###
######################
# Add a second ring, center design, or sparkling trail
def add_bonus_sparks(x_position, y_position, color_name):
    pass


#####################
###   FUNCTIONS   ###
#####################
# Use the student choice or choose a friendly fallback
def next_firework_color():
    color_name = choose_firework_color()
    if color_name not in FIREWORK_COLORS:
        color_name = random.choice(FIREWORK_COLORS)
    return color_name

# Draw one complete firework around a clicked point
def draw_firework(x_position, y_position):
    color_name = next_firework_color()
    artist.color(color_name)

    for ray_number in range(RAY_COUNT):
        artist.penup()
        artist.goto(x_position, y_position)
        artist.setheading(ray_number * FULL_TURN / RAY_COUNT)
        artist.pendown()
        artist.forward(RAY_LENGTH)

    artist.penup()
    artist.goto(x_position, y_position)
    artist.dot(CENTER_SIZE, color_name)
    add_bonus_sparks(x_position, y_position, color_name)
    screen.update()

# Clear the sky for a new festival
def clear_sky():
    artist.clear()
    screen.update()


###########################
###   EVENT LISTENERS   ###
###########################
screen.onclick(draw_firework)
screen.onkey(clear_sky, "c")
screen.listen()


#####################
###   MAIN CODE   ###
#####################
# Start with finished fireworks and invite more clicks
for firework_position in STARTING_FIREWORK_POSITIONS:
    draw_firework(firework_position[0], firework_position[1])
`;

export const turtleSpiralGalaxyStarterCode = `import turtle

#####################
###   CONSTANTS   ###
#####################
BACKGROUND_COLOR = "black"
STAR_COLORS = ["white", "cyan", "gold", "violet", "deep sky blue"]
DEFAULT_STAR_COLOR = "white"
SPIRAL_STEPS = 105
START_DISTANCE = 2
DISTANCE_GROWTH = 0.34
TURN_ANGLE = 91
STAR_GAP = 4
STAR_SIZE = 5
PEN_SIZE = 2
DRAWING_SPEED = 0


#####################
###   VARIABLES   ###
#####################
screen = turtle.Screen()
screen.bgcolor(BACKGROUND_COLOR)
screen.title("Spiral Galaxy")
screen.tracer(0)

artist = turtle.Turtle()
artist.hideturtle()
artist.speed(DRAWING_SPEED)
artist.pensize(PEN_SIZE)


########################
###   NORMAL SECTION  ###
########################
# Return one color from STAR_COLORS
# Use step_number to alternate between two colors
def choose_star_color(step_number):
    pass


######################
###   HARD SECTION  ###
######################
# Add a planet, moon, comet, or another galaxy
def add_space_feature():
    pass


#####################
###   FUNCTIONS   ###
#####################
# Use the student choice or cycle through the palette
def star_color_for(step_number):
    color_name = choose_star_color(step_number)
    if color_name not in STAR_COLORS:
        color_name = STAR_COLORS[step_number % len(STAR_COLORS)]
    return color_name

# Draw a colorful mathematical spiral
def draw_galaxy():
    for step_number in range(SPIRAL_STEPS):
        artist.color(star_color_for(step_number))
        artist.forward(START_DISTANCE + step_number * DISTANCE_GROWTH)
        artist.left(TURN_ANGLE)

        if step_number % STAR_GAP == 0:
            artist.dot(STAR_SIZE)


#####################
###   MAIN CODE   ###
#####################
# The completed framework creates the galaxy
draw_galaxy()
add_space_feature()
screen.update()
`;

export const turtleRaceDayStarterCode = `import random
import turtle

#####################
###   CONSTANTS   ###
#####################
BACKGROUND_COLOR = "light cyan"
TRACK_COLOR = "slate gray"
RACER_COLORS = ["red", "blue", "green", "purple"]
START_X = -270
FINISH_X = 250
START_Y = -120
LANE_GAP = 80
RACER_COUNT = 4
MIN_STEP = 2
MAX_STEP = 10
RACE_DELAY_MS = 55
FINISH_LINE_BOTTOM = -180
FINISH_SEGMENT_COUNT = 15
FINISH_DASH_LENGTH = 12
ANNOUNCER_COLOR = "navy"
ANNOUNCER_POSITION = (0, 165)
WINNER_FONT = ("Arial", 20, "bold")


#####################
###   VARIABLES   ###
#####################
screen = turtle.Screen()
screen.bgcolor(BACKGROUND_COLOR)
screen.title("Turtle Race Day")

finish_line = turtle.Turtle()
finish_line.hideturtle()
finish_line.color(TRACK_COLOR)
finish_line.pensize(3)

announcer = turtle.Turtle()
announcer.hideturtle()
announcer.color(ANNOUNCER_COLOR)
announcer.penup()

racers = []
race_running = False


########################
###   NORMAL SECTION  ###
########################
# Return a color for each racer number
# Racer numbers begin at zero
def choose_racer_color(racer_number):
    pass


######################
###   HARD SECTION  ###
######################
# Add confetti, a victory lap, or a winner message
def add_finish_celebration(winner):
    pass


#####################
###   FUNCTIONS   ###
#####################
# Use the student choice or the finished race palette
def racer_color_for(racer_number):
    color_name = choose_racer_color(racer_number)
    if color_name not in RACER_COLORS:
        color_name = RACER_COLORS[racer_number % len(RACER_COLORS)]
    return color_name

# Draw a dashed finish line
def draw_finish_line():
    finish_line.penup()
    finish_line.goto(FINISH_X, FINISH_LINE_BOTTOM)
    finish_line.setheading(90)

    for _ in range(FINISH_SEGMENT_COUNT):
        finish_line.pendown()
        finish_line.forward(FINISH_DASH_LENGTH)
        finish_line.penup()
        finish_line.forward(FINISH_DASH_LENGTH)

# Create the racers and place them in their lanes
def create_racers():
    for racer_number in range(RACER_COUNT):
        racer = turtle.Turtle()
        racer.shape("turtle")
        racer.color(racer_color_for(racer_number))
        racer.penup()
        racer.goto(START_X, START_Y + racer_number * LANE_GAP)
        racers.append(racer)

# Move every racer by one random step
def race_step():
    global race_running
    if not race_running:
        return

    for racer in racers:
        racer.forward(random.randint(MIN_STEP, MAX_STEP))
        if racer.xcor() >= FINISH_X:
            race_running = False
            announcer.goto(ANNOUNCER_POSITION)
            announcer.write(
                "We have a winner!",
                align="center",
                font=WINNER_FONT
            )
            add_finish_celebration(racer)
            return

    screen.ontimer(race_step, RACE_DELAY_MS)

# Reset every racer and start a fresh race
def start_race():
    global race_running
    if race_running:
        return

    announcer.clear()
    for racer_number, racer in enumerate(racers):
        racer.goto(
            START_X,
            START_Y + racer_number * LANE_GAP
        )

    race_running = True
    screen.ontimer(race_step, RACE_DELAY_MS)


###########################
###   EVENT LISTENERS   ###
###########################
screen.onkey(start_race, "space")
screen.listen()


#####################
###   MAIN CODE   ###
#####################
# Build the track and begin the first race
draw_finish_line()
create_racers()
start_race()
`;

export const turtleFlowerGardenStarterCode = `import random
import turtle

#####################
###   CONSTANTS   ###
#####################
BACKGROUND_COLOR = "light cyan"
PETAL_COLORS = ["hot pink", "gold", "violet", "orange", "deep sky blue"]
DEFAULT_PETAL_COLOR = "hot pink"
STEM_COLOR = "forest green"
CENTER_COLOR = "goldenrod"
PETAL_COUNT = 8
PETAL_DISTANCE = 18
PETAL_SIZE = 24
CENTER_SIZE = 18
STEM_LENGTH = 55
FULL_TURN = 360
PEN_SIZE = 4
DRAWING_SPEED = 0
STARTING_FLOWER_POSITIONS = [
    (-130, -20),
    (0, 65),
    (135, -35)
]


#####################
###   VARIABLES   ###
#####################
screen = turtle.Screen()
screen.bgcolor(BACKGROUND_COLOR)
screen.title("Flower Garden Clicker")
screen.tracer(0)

artist = turtle.Turtle()
artist.hideturtle()
artist.speed(DRAWING_SPEED)
artist.pensize(PEN_SIZE)


########################
###   NORMAL SECTION  ###
########################
# Return one color from PETAL_COLORS
# Use x_position or y_position to make a pattern
def choose_petal_color(x_position, y_position):
    pass


######################
###   HARD SECTION  ###
######################
# Add a leaf, butterfly, face, or another garden detail
def add_garden_detail(x_position, y_position):
    pass


#####################
###   FUNCTIONS   ###
#####################
# Use the student choice or choose a friendly fallback
def petal_color_for(x_position, y_position):
    color_name = choose_petal_color(x_position, y_position)
    if color_name not in PETAL_COLORS:
        color_name = random.choice(PETAL_COLORS)
    return color_name

# Draw one flower centered on the selected point
def draw_flower(x_position, y_position):
    petal_color = petal_color_for(x_position, y_position)

    artist.color(STEM_COLOR)
    artist.penup()
    artist.goto(x_position, y_position - STEM_LENGTH)
    artist.pendown()
    artist.goto(x_position, y_position)

    artist.penup()
    for petal_number in range(PETAL_COUNT):
        artist.goto(x_position, y_position)
        artist.setheading(petal_number * FULL_TURN / PETAL_COUNT)
        artist.forward(PETAL_DISTANCE)
        artist.dot(PETAL_SIZE, petal_color)

    artist.goto(x_position, y_position)
    artist.dot(CENTER_SIZE, CENTER_COLOR)
    add_garden_detail(x_position, y_position)
    screen.update()

# Clear the canvas to plant a new garden
def clear_garden():
    artist.clear()
    screen.update()


###########################
###   EVENT LISTENERS   ###
###########################
screen.onclick(draw_flower)
screen.onkey(clear_garden, "c")
screen.listen()


#####################
###   MAIN CODE   ###
#####################
# Begin with a small finished garden
for flower_position in STARTING_FLOWER_POSITIONS:
    draw_flower(flower_position[0], flower_position[1])
`;

export const turtleMazeExplorerStarterCode = `import turtle

#####################
###   CONSTANTS   ###
#####################
BACKGROUND_COLOR = "alice blue"
WALL_COLOR = "navy"
PLAYER_COLORS = ["orange", "red", "purple", "green"]
DEFAULT_PLAYER_COLOR = "orange"
GOAL_COLOR = "gold"
GOAL_SIZE = 28
MOVE_DISTANCE = 20
PLAYER_RADIUS = 9
LEFT_BOUNDARY = -280
RIGHT_BOUNDARY = 280
BOTTOM_BOUNDARY = -190
TOP_BOUNDARY = 190
START_POSITION = (-240, -140)
GOAL_POSITION = (240, 140)
WALLS = [
    (-150, -170, -120, 100),
    (-20, -80, 10, 180),
    (100, -180, 130, 60)
]
DRAWING_SPEED = 0
UP_HEADING = 90
DOWN_HEADING = 270
LEFT_HEADING = 180
RIGHT_HEADING = 0
STATUS_POSITION = (0, 165)
STATUS_FONT = ("Arial", 20, "bold")


#####################
###   VARIABLES   ###
#####################
screen = turtle.Screen()
screen.bgcolor(BACKGROUND_COLOR)
screen.title("Maze Explorer")
screen.tracer(0)

wall_artist = turtle.Turtle()
wall_artist.hideturtle()
wall_artist.color(WALL_COLOR)
wall_artist.speed(DRAWING_SPEED)

goal = turtle.Turtle()
goal.hideturtle()
goal.penup()
goal.goto(GOAL_POSITION)

player = turtle.Turtle()
player.shape("turtle")
player.penup()
player.goto(START_POSITION)

status = turtle.Turtle()
status.hideturtle()
status.penup()
status.color(WALL_COLOR)


########################
###   NORMAL SECTION  ###
########################
# Return one color from PLAYER_COLORS
# Try a favorite color before changing anything else
def choose_player_color():
    pass


######################
###   HARD SECTION  ###
######################
# Add a victory drawing, message, or animation
def add_victory_art():
    pass


#####################
###   FUNCTIONS   ###
#####################
# Use the student choice or the finished explorer color
def player_color():
    color_name = choose_player_color()
    if color_name not in PLAYER_COLORS:
        color_name = DEFAULT_PLAYER_COLOR
    return color_name

# Draw one rectangular maze wall
def draw_wall(wall):
    left, bottom, right, top = wall
    wall_artist.penup()
    wall_artist.goto(left, bottom)
    wall_artist.pendown()
    wall_artist.begin_fill()
    wall_artist.goto(right, bottom)
    wall_artist.goto(right, top)
    wall_artist.goto(left, top)
    wall_artist.goto(left, bottom)
    wall_artist.end_fill()

# Check whether a point overlaps a maze wall
def point_touches_wall(x_position, y_position):
    for wall in WALLS:
        left, bottom, right, top = wall
        inside_horizontal = (
            left - PLAYER_RADIUS
            <= x_position
            <= right + PLAYER_RADIUS
        )
        inside_vertical = (
            bottom - PLAYER_RADIUS
            <= y_position
            <= top + PLAYER_RADIUS
        )
        if inside_horizontal and inside_vertical:
            return True
    return False

# Check the canvas boundaries and internal walls
def can_move_to(x_position, y_position):
    inside_canvas = (
        LEFT_BOUNDARY + PLAYER_RADIUS
        <= x_position
        <= RIGHT_BOUNDARY - PLAYER_RADIUS
        and BOTTOM_BOUNDARY + PLAYER_RADIUS
        <= y_position
        <= TOP_BOUNDARY - PLAYER_RADIUS
    )
    return inside_canvas and not point_touches_wall(
        x_position,
        y_position
    )

# Check whether the explorer reached the goal
def check_goal():
    goal_x, goal_y = GOAL_POSITION
    if (
        abs(player.xcor() - goal_x) <= MOVE_DISTANCE
        and abs(player.ycor() - goal_y) <= MOVE_DISTANCE
    ):
        status.clear()
        status.goto(STATUS_POSITION)
        status.write(
            "Maze complete!",
            align="center",
            font=STATUS_FONT
        )
        add_victory_art()

# Move only when the next position is open
def move_by(x_change, y_change):
    next_x = player.xcor() + x_change
    next_y = player.ycor() + y_change
    if can_move_to(next_x, next_y):
        player.goto(next_x, next_y)
        check_goal()
    screen.update()

# Face and move in each arrow-key direction
def move_up():
    player.setheading(UP_HEADING)
    move_by(0, MOVE_DISTANCE)

def move_down():
    player.setheading(DOWN_HEADING)
    move_by(0, -MOVE_DISTANCE)

def move_left():
    player.setheading(LEFT_HEADING)
    move_by(-MOVE_DISTANCE, 0)

def move_right():
    player.setheading(RIGHT_HEADING)
    move_by(MOVE_DISTANCE, 0)


###########################
###   EVENT LISTENERS   ###
###########################
screen.onkey(move_up, "Up")
screen.onkey(move_down, "Down")
screen.onkey(move_left, "Left")
screen.onkey(move_right, "Right")
screen.listen()


#####################
###   MAIN CODE   ###
#####################
# Draw the finished maze and prepare the explorer
for maze_wall in WALLS:
    draw_wall(maze_wall)

player.color(player_color())
goal.dot(GOAL_SIZE, GOAL_COLOR)
screen.update()
`;

export const turtleClassroomProjectStarterCode = `import turtle

#####################
###   CONSTANTS   ###
#####################
BACKGROUND_COLOR = "midnight blue"
SCENE_COLORS = ["cyan", "gold", "hot pink", "lime"]
STAR_SIZE = 42
STAR_POINTS = 5
STAR_TURN = 144
SCENE_POSITIONS = [(-170, 70), (0, -20), (170, 70)]
PEN_SIZE = 3
DRAWING_SPEED = 0


#####################
###   VARIABLES   ###
#####################
screen = turtle.Screen()
screen.bgcolor(BACKGROUND_COLOR)
screen.title("Classroom Turtle Studio")
screen.tracer(0)

artist = turtle.Turtle()
artist.hideturtle()
artist.speed(DRAWING_SPEED)
artist.pensize(PEN_SIZE)


########################
###   NORMAL SECTION  ###
########################
# Complete the Normal task from the course project card
# The completed scene below still runs while this function is empty
def normal_addition():
    pass


######################
###   HARD SECTION  ###
######################
# Complete the Hard task after the Normal version works
# This section can remain empty without breaking the project
def hard_addition():
    pass


#####################
###   FUNCTIONS   ###
#####################
# Move without leaving a connecting line
def move_to(x_position, y_position):
    artist.penup()
    artist.goto(x_position, y_position)
    artist.pendown()

# Draw one filled star from the completed framework
def draw_star(x_position, y_position, color_name):
    move_to(x_position, y_position)
    artist.color(color_name)
    artist.begin_fill()

    for _ in range(STAR_POINTS):
        artist.forward(STAR_SIZE)
        artist.right(STAR_TURN)

    artist.end_fill()

# Draw the completed scene before student additions
def draw_finished_scene():
    for scene_index in range(len(SCENE_POSITIONS)):
        x_position, y_position = SCENE_POSITIONS[scene_index]
        color_name = SCENE_COLORS[scene_index % len(SCENE_COLORS)]
        draw_star(x_position, y_position, color_name)


#####################
###   MAIN CODE   ###
#####################
# Keep the finished framework working at every challenge level
draw_finished_scene()
normal_addition()
hard_addition()
screen.update()
`;

export const pgzeroStarterCode = `import pgzrun

#####################
###   CONSTANTS   ###
#####################
WIDTH = 640
HEIGHT = 400
PLAYER_SIZE = 72
PLAYER_SPEED = 4
PLAYER_IMAGE = "student"
PLAYER_START_POSITION = (WIDTH / 2, HEIGHT / 2)
INSTRUCTION_POSITION = (24, 24)
INSTRUCTION_SIZE = 28
INSTRUCTION_COLOR = "white"


#####################
###   VARIABLES   ###
#####################
player = Actor(PLAYER_IMAGE, PLAYER_START_POSITION)
player.width = PLAYER_SIZE
player.height = PLAYER_SIZE


#####################
###   FUNCTIONS   ###
#####################
# Draw the current frame
def draw():
    screen.clear()
    screen.draw.text(
        "Use the arrow keys to move",
        INSTRUCTION_POSITION,
        color=INSTRUCTION_COLOR,
        fontsize=INSTRUCTION_SIZE
    )
    player.draw()

# Update player movement from held keys
def update():
    # Move left while the left arrow key is held
    if keyboard.left:
        player.x -= PLAYER_SPEED

    # Move right while the right arrow key is held
    if keyboard.right:
        player.x += PLAYER_SPEED

    # Move up while the up arrow key is held
    if keyboard.up:
        player.y -= PLAYER_SPEED

    # Move down while the down arrow key is held
    if keyboard.down:
        player.y += PLAYER_SPEED

pgzrun.go()
`;

export const javaStarterCode = `/**
 * @brief Demonstrate the minimal Java console project shape
 */
public class Main {
/*****************
*   CONSTANTS   *
*****************/

    private static final String GREETING_MESSAGE = "Hello, Java!";


/*****************
*   FUNCTIONS   *
*****************/

    /**
     * @brief Run the starter console program
     *
     * @param args Command-line arguments
     */
    public static void main(String[] args) {
        System.out.println(GREETING_MESSAGE);
    }
}
`;

export const javaOutlineStarterCode = `import java.util.ArrayList;
import java.util.Scanner;

/**
 * @brief Organize an introductory Java console project with helpers and lists
 */
public class Main {
/*****************
*   CONSTANTS   *
*****************/

    private static final int STARTING_SCORE = 0;
    private static final String STARTING_STUDENT_NAME = "Student";


/*****************
*   FUNCTIONS   *
*****************/

    /**
     * @brief Run the starter console program
     *
     * @param args Command-line arguments
     */
    public static void main(String[] args) {
        Scanner inputScanner = new Scanner(System.in);

        int score = STARTING_SCORE;
        String studentName = STARTING_STUDENT_NAME;
        ArrayList<String> notes = new ArrayList<>();

        // Prompt, update variables, and call helper methods here
        // String answer = inputScanner.nextLine();
        notes.add(makeNote(studentName, score));

        // Print each saved note on its own line
        for (String note : notes) {
            System.out.println(note);
        }
    }

    /**
     * @brief Build a readable note from a student name and score
     *
     * @param studentName Name to show in the note
     *
     * @param score Current score value
     *
     * @return Formatted note text
     */
    static String makeNote(String studentName, int score) {
        return studentName + ": " + score;
    }

    /**
     * @brief Run the first custom action
     */
    static void actionOne() {
        // Add an action here
    }

    /**
     * @brief Run the second custom action
     */
    static void actionTwo() {
        // Add another action here
    }
}
`;

export const blueJMainStarterCode = `import java.util.ArrayList;

/**
 * @brief Demonstrate a small BlueJ object-oriented project
 */
public class Main {
/*****************
*   CONSTANTS   *
*****************/

    private static final String STUDENT_NAME = "Ada";
    private static final int GRADE_LEVEL = 9;
    private static final int FIRST_SCORE = 88;
    private static final int SECOND_SCORE = 94;


/*****************
*   FUNCTIONS   *
*****************/

    /**
     * @brief Build and preview a small object-oriented BlueJ project
     *
     * @param args Command-line arguments
     */
    public static void main(String[] args) {
        ArrayList<Integer> scores = new ArrayList<>();
        scores.add(FIRST_SCORE);
        scores.add(SECOND_SCORE);

        // Open this project in BlueJ to inspect the Student object directly
        Student student = new Student(STUDENT_NAME, GRADE_LEVEL);
        student.addScore(scores.get(0));
        student.addScore(scores.get(1));
        student.printSummary();

        // Mirror the same state with console-friendly browser output
        System.out.println(STUDENT_NAME + " is in grade " + GRADE_LEVEL);
        System.out.println("Average: " + averageScore(scores));
    }

    /**
     * @brief Calculate the average score for a list of grades
     *
     * @param scores Scores to average
     *
     * @return Average score or 0 when the list is empty
     */
    static double averageScore(ArrayList<Integer> scores) {
        // Avoid dividing by zero when no scores have been recorded
        if (scores.isEmpty()) {
            return 0;
        }

        int total = 0;

        // Add each score into the running total
        for (int score : scores) {
            total += score;
        }

        return (double) total / scores.size();
    }
}
`;

export const blueJStudentStarterCode = `import java.util.ArrayList;

/**
 * @brief Store one student's grade level and score history
 */
public class Student {
/*****************
*   VARIABLES   *
*****************/

    private final String name;
    private final int gradeLevel;
    private final ArrayList<Integer> scores;


/*****************
*   FUNCTIONS   *
*****************/

    /**
     * @brief Create a student with an empty score list
     *
     * @param name Student name
     *
     * @param gradeLevel Student grade level
     */
    public Student(String name, int gradeLevel) {
        this.name = name;
        this.gradeLevel = gradeLevel;
        this.scores = new ArrayList<>();
    }

    /**
     * @brief Add one score to the student record
     *
     * @param score Score to add
     */
    public void addScore(int score) {
        scores.add(score);
    }

    /**
     * @brief Calculate the student's average score
     *
     * @return Average score or 0 when the list is empty
     */
    public double averageScore() {
        // Avoid dividing by zero when no scores have been recorded
        if (scores.isEmpty()) {
            return 0;
        }

        int total = 0;

        // Add each score into the running total
        for (int score : scores) {
            total += score;
        }

        return (double) total / scores.size();
    }

    /**
     * @brief Print the student summary to the console
     */
    public void printSummary() {
        System.out.println(name + " is in grade " + gradeLevel);
        System.out.println("Average: " + averageScore());
    }
}
`;

export const blueJReadmeStarterText = `BlueJ Java Project

This folder is ready to open in BlueJ after downloading it from the Classes Code IDE.

Start with Main.java, then inspect Student.java to see the object's fields and methods.
The browser Run button previews the same state with console-friendly code in Main.java.

BlueJ: https://www.bluej.org/
BlueJ source: https://github.com/k-pet-group/BlueJ-Greenfoot
`;

export const karelStarterCode = `import kareltherobot.UrRobot;
import kareltherobot.World;
import kareltherobot.Directions;

/**
 * @brief Demonstrate a Karel robot program with a loaded world file
 */
public class Algo implements Directions {
/*****************
*   CONSTANTS   *
*****************/

    private static final int START_STREET = 6;
    private static final int START_AVENUE = 7;
    private static final int START_BEEPERS = 0;
    private static final int MOVE_COUNT = 3;


/*****************
*   FUNCTIONS   *
*****************/

    /**
     * @brief Move one robot through the sample world
     *
     * @param args Command-line arguments
     */
    public static void main(String[] args) {
        // Start Sam at street 6 avenue 7 facing east with no beepers
        UrRobot sam = new UrRobot(START_STREET, START_AVENUE, East, START_BEEPERS);

        // Turn Sam around before moving west
        sam.turnLeft();
        sam.turnLeft();

        // Move Sam across the world using the named move count
        for (int moveIndex = 0; moveIndex < MOVE_COUNT; moveIndex++) {
            sam.move();
        }
    }

    // Load the Karel world before the robot program runs
    static {
        World.setVisible(true);
        World.readWorld("world.txt");
    }
}
`;

export const karelStarterWorld = `rows=10
cols=10
wall 4 4 east
wall 4 5 south
wall 5 7 east
wall 7 4 north
wall 7 4 east
wall 7 5 north
wall 7 6 north
wall 7 7 north
wall 6 7 east
wall 5 4 east
wall 5 5 south
wall 5 6 south
wall 5 7 south
beeper 6 9 1
`;

export const karelOutlineStarterCode = `/**
 * @brief Organize a CodeHS-style Karel program with helper methods
 */
public class MyProgram extends SuperKarel {
/*****************
*   FUNCTIONS   *
*****************/

    /**
     * @brief Run the main Karel command sequence
     */
    public void run() {
        // Move once when the path is open and this corner has no balls
        if (frontIsClear() && noBallsPresent()) {
            move();
        }

        // Continue moving until Karel reaches a blocked edge
        while (frontIsClear()) {
            move();
        }

        // Face the opposite direction before the program ends
        turnAround();
    }

    /**
     * @brief Rotate Karel right using three left turns
     */
    private void turnRight() {
        turnLeft();
        turnLeft();
        turnLeft();
    }

    /**
     * @brief Rotate Karel to face the opposite direction
     */
    private void turnAround() {
        turnLeft();
        turnLeft();
    }
}
`;

export const karelOutlineWorld = `rows=5
cols=5
beeper 1 4 1
`;

export const pgzeroOutlineStarterCode = `#####################
###   CONSTANTS   ###
#####################
WIDTH = 640
HEIGHT = 400
PLAYER_SPEED = 4
ENEMY_SPEED = 2
PLAYER_IMAGE = "student"
PLAYER_START_POSITION = (WIDTH / 2, HEIGHT / 2)
EXTRA_ACTOR_COUNT = 0
TITLE_POSITION = (24, 24)
TITLE_SIZE = 32
TITLE_COLOR = "white"


#####################
###   FUNCTIONS   ###
#####################
# Draw the current game frame
def draw():
    screen.clear()
    screen.draw.text(
        "Game title here",
        TITLE_POSITION,
        color=TITLE_COLOR,
        fontsize=TITLE_SIZE
    )
    player.draw()

    # Draw other actors and UI here

# Update player, enemies, score, and game state
def update():
    pass

# Run the first input action
def action_one():
    pass

# Run the second input action
def action_two():
    pass

# Restore the game to its starting state
def reset_game():
    pass


#####################
###   VARIABLES   ###
#####################
# Create the shared game state
player = Actor(PLAYER_IMAGE, PLAYER_START_POSITION)
score = 0
game_over = False

# Add more game state here as needed

# Store any additional actors in one collection
actors = []
# Create each extra actor before the game loop starts
for _ in range(EXTRA_ACTOR_COUNT):
    new_actor = Actor(PLAYER_IMAGE, PLAYER_START_POSITION)
    # Configure each additional actor here
    actors.append(new_actor)


###########################
###   EVENT HANDLERS   ###
###########################
def on_key_down(key):
    # Route space and return keys to named actions
    if key == keys.SPACE:
        action_one()

    # Route return to the second named action
    elif key == keys.RETURN:
        action_two()

# Add other handlers here, such as on_mouse_down(pos)
`;

export const pgzeroCourseStarterCode = `# Pygame Zero reads WIDTH and HEIGHT when the game starts

#####################
###   CONSTANTS   ###
#####################
WIDTH = 640
HEIGHT = 400
`;

export const pgzeroStudentSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">
	<rect width="120" height="120" rx="26" fill="#5eead4"/>
	<circle cx="42" cy="48" r="8" fill="#0f172a"/>
	<circle cx="78" cy="48" r="8" fill="#0f172a"/>
	<path d="M36 75c13 14 35 14 48 0" fill="none" stroke="#0f172a" stroke-linecap="round" stroke-width="8"/>
</svg>
`;

export const dataScienceSampleCsv = `student,pre,post
Ari,62,81
Bao,71,85
Cleo,58,76
Dev,80,90
`;

export const dataScienceStarterCode = `import matplotlib.pyplot as plt
import pandas as pd

#####################
###   CONSTANTS   ###
#####################
DATA_FILE = "scores.csv"
FIGURE_SIZE = (7, 4)
BAR_COLOR = "#0f766e"
DISPLAY_PRECISION = 2


#####################
###   MAIN CODE   ###
#####################
scores = pd.read_csv(DATA_FILE)

# Store the growth calculation in a named column for reuse
scores["growth"] = scores["post"] - scores["pre"]
print(scores)
print()
print(
    "Average growth:",
    round(scores["growth"].mean(), DISPLAY_PRECISION)
)

# Build the chart from named configuration values
plt.figure(figsize=FIGURE_SIZE)
plt.bar(scores["student"], scores["growth"], color=BAR_COLOR)
plt.title("Growth from pre-check to post-check")
plt.xlabel("Student")
plt.ylabel("Point growth")
plt.tight_layout()
`;

export function getPythonIdeModeLabel(mode: PythonIdeMode) {
	if (mode === "data") return "Data / AI";
	if (mode === "java") return "Java";
	if (mode === "karel") return "Karel Java";
	if (mode === "pgzero") return "PyGame Zero";
	if (mode === "turtle") return "Turtle";
	return "Python";
}

export function isPythonIdeBlueJProject(
	project: Pick<
		PythonIdeProject,
		"courseProjectKey" | "mode" | "starterLabel" | "title"
	> &
		Partial<Pick<PythonIdeProject, "files">>
) {
	if (project.mode !== "java") return false;

	const starterLabel = project.starterLabel?.toLowerCase() ?? "";
	const title = project.title.toLowerCase();
	return (
		project.courseProjectKey === "ide-template:bluej" ||
		starterLabel.includes("bluej") ||
		title.includes("bluej") ||
		project.files?.some(
			file => file.name.toLowerCase() === "package.bluej"
		) === true
	);
}

export function getPythonIdeProjectKindLabel(
	project: Pick<
		PythonIdeProject,
		"courseProjectKey" | "mode" | "starterLabel" | "title"
	> &
		Partial<Pick<PythonIdeProject, "files">>
) {
	return isPythonIdeBlueJProject(project)
		? "BlueJ Java"
		: getPythonIdeModeLabel(project.mode);
}

function getDemoStarterCode(mode: PythonIdeMode) {
	if (mode === "data") return dataScienceStarterCode;
	if (mode === "java") return javaStarterCode;
	if (mode === "karel") return karelStarterCode;
	if (mode === "pgzero") return pgzeroStarterCode;
	if (mode === "turtle") return turtleStarterCode;
	return pythonStarterCode;
}

function clonePythonIdeFiles(files: PythonIdeFile[]) {
	return files.map(file => ({
		name: file.name,
		content: file.content,
		encoding: file.encoding
	}));
}

function getBlankStarterFiles(mode: PythonIdeMode): PythonIdeFile[] {
	if (mode === "pgzero") return getCourseStarterFiles(mode);
	if (mode === "java") {
		return [
			{
				name: "Main.java",
				content: ""
			}
		];
	}
	if (mode === "karel") return getCourseStarterFiles(mode);

	return [
		{
			name: "main.py",
			content: ""
		}
	];
}

function getCourseStarterFiles(mode: PythonIdeMode): PythonIdeFile[] {
	if (mode === "java") {
		return [
			{
				name: "Main.java",
				content: javaStarterCode
			}
		];
	}

	if (mode === "karel") {
		return [
			{
				name: "Algo.java",
				content: karelStarterCode
			},
			{
				name: "world.txt",
				content: karelStarterWorld
			}
		];
	}

	if (mode === "pgzero") {
		return [
			{
				name: "main.py",
				content: pgzeroCourseStarterCode
			}
		];
	}

	return getBlankStarterFiles(mode);
}

function getDemoStarterFiles(mode: PythonIdeMode): PythonIdeFile[] {
	if (mode === "java" || mode === "karel") return getCourseStarterFiles(mode);

	const files = [
		{
			name: "main.py",
			content: getDemoStarterCode(mode)
		}
	];

	if (mode === "data") {
		files.push({
			name: "scores.csv",
			content: dataScienceSampleCsv
		});
	}

	if (mode === "pgzero") {
		files.push({
			name: "images/student.svg",
			content: pgzeroStudentSvg
		});
	}

	return files;
}

function getOutlineStarterFiles(mode: PythonIdeMode): PythonIdeFile[] {
	if (mode === "java") {
		return [
			{
				name: "Main.java",
				content: javaOutlineStarterCode
			}
		];
	}

	if (mode === "karel") {
		return [
			{
				name: "MyProgram.java",
				content: karelOutlineStarterCode
			},
			{
				name: "world.txt",
				content: karelOutlineWorld
			}
		];
	}

	const files = [
		{
			name: "main.py",
			content:
				mode === "pgzero"
					? pgzeroOutlineStarterCode
					: pythonLevel1OutlineStarterCode
		}
	];

	if (mode === "pgzero") {
		files.push({
			name: "images/student.svg",
			content: pgzeroStudentSvg
		});
	}

	return files;
}

function getBlueJStarterFiles(mode: PythonIdeMode): PythonIdeFile[] {
	if (mode !== "java") return getOutlineStarterFiles(mode);

	return [
		{
			name: "Main.java",
			content: blueJMainStarterCode
		},
		{
			name: "Student.java",
			content: blueJStudentStarterCode
		},
		{
			name: "README.TXT",
			content: blueJReadmeStarterText
		}
	];
}

function getGuidedTurtleStarterFiles(
	mode: PythonIdeMode,
	starterCode: string
): PythonIdeFile[] {
	if (mode !== "turtle") return getOutlineStarterFiles(mode);

	return [
		{
			name: "main.py",
			content: starterCode
		}
	];
}

export const pythonIdeClassroomSectionsCode = `########################
###   NORMAL SECTION  ###
########################
# Complete the Normal task from the course project card
# The completed project still runs while this function is empty
def normal_addition():
    pass


######################
###   HARD SECTION  ###
######################
# Complete the Hard task after the Normal version works
# This section can remain empty without breaking the project
def hard_addition():
    pass
`;

const PYTHON_IDE_CLASSROOM_CALLS = `# Run both classroom additions after the completed setup
normal_addition()
hard_addition()
`;
const PYTHON_IDE_CLASSROOM_BLOCKING_RE =
	/^(?:while\b[^\n]*:|pgzrun\.go\s*\(|(?:\w+\.)*(?:done|exitonclick|listen|mainloop)\s*\()/m;

function pythonIdeClassroomDefinitionIndex(source: string) {
	const lines = source.split("\n");
	let index = 0;

	for (let lineIndex = 0; lineIndex < lines.length; lineIndex += 1) {
		const line = lines[lineIndex] ?? "";
		const trimmedLine = line.trim();
		if (
			trimmedLine &&
			!trimmedLine.startsWith("#") &&
			!trimmedLine.startsWith("from __future__ import ")
		) {
			break;
		}
		index += line.length;
		if (lineIndex < lines.length - 1) index += 1;
	}

	return index;
}

export function addPythonIdeClassroomSectionsToSource(source: string) {
	if (
		source.includes("###   NORMAL SECTION") &&
		source.includes("###   HARD SECTION")
	) {
		return source;
	}

	const blockerIndex = source.search(PYTHON_IDE_CLASSROOM_BLOCKING_RE);
	const completedFramework =
		blockerIndex >= 0
			? `${source.slice(0, blockerIndex)}${PYTHON_IDE_CLASSROOM_CALLS}\n${source.slice(blockerIndex)}`
			: `${source.trimEnd()}\n\n\n${PYTHON_IDE_CLASSROOM_CALLS}`;
	const definitionIndex =
		pythonIdeClassroomDefinitionIndex(completedFramework);

	return `${completedFramework.slice(0, definitionIndex)}${pythonIdeClassroomSectionsCode}\n\n\n${completedFramework.slice(definitionIndex)}`;
}

export function addPythonIdeClassroomSections(
	files: PythonIdeFile[]
): PythonIdeFile[] {
	const targetIndex = files.findIndex(
		file =>
			(file.encoding ?? "text") === "text" &&
			file.name.toLowerCase() === "main.py"
	);
	const fallbackIndex = files.findIndex(
		file =>
			(file.encoding ?? "text") === "text" &&
			file.name.toLowerCase().endsWith(".py")
	);
	const fileIndex = targetIndex >= 0 ? targetIndex : fallbackIndex;
	if (fileIndex < 0) return files.map(file => ({ ...file }));

	return files.map((file, index) =>
		index === fileIndex
			? {
					...file,
					content: addPythonIdeClassroomSectionsToSource(file.content)
				}
			: { ...file }
	);
}

function getStarterFilesForTemplate(
	mode: PythonIdeMode,
	template: PythonIdeProjectTemplate
) {
	if (template === "bluej") return getBlueJStarterFiles(mode);
	if (template === "circle-art") {
		return getGuidedTurtleStarterFiles(mode, turtleCircleArtStarterCode);
	}
	if (template === "classroom-project") {
		return getGuidedTurtleStarterFiles(
			mode,
			turtleClassroomProjectStarterCode
		);
	}
	if (template === "demo") return getDemoStarterFiles(mode);
	if (template === "firework-festival") {
		return getGuidedTurtleStarterFiles(
			mode,
			turtleFireworkFestivalStarterCode
		);
	}
	if (template === "flower-garden") {
		return getGuidedTurtleStarterFiles(mode, turtleFlowerGardenStarterCode);
	}
	if (template === "maze-explorer") {
		return getGuidedTurtleStarterFiles(mode, turtleMazeExplorerStarterCode);
	}
	if (template === "neon-trail") {
		return getGuidedTurtleStarterFiles(mode, turtleNeonTrailStarterCode);
	}
	if (template === "outline") return getOutlineStarterFiles(mode);
	if (template === "picasso") {
		return getGuidedTurtleStarterFiles(mode, turtlePicassoStarterCode);
	}
	if (template === "spiral-galaxy") {
		return getGuidedTurtleStarterFiles(mode, turtleSpiralGalaxyStarterCode);
	}
	if (template === "turtle-race") {
		return getGuidedTurtleStarterFiles(mode, turtleRaceDayStarterCode);
	}
	if (template === "triangle-motion") {
		return getGuidedTurtleStarterFiles(
			mode,
			turtleTriangleMotionStarterCode
		);
	}
	if (template === "course") return getCourseStarterFiles(mode);
	return getBlankStarterFiles(mode);
}

export function resolvePythonIdeActiveFileName(
	files: PythonIdeFile[],
	preferredFileName?: string
) {
	return (
		files.find(file => file.name === preferredFileName)?.name ??
		files.find(file => file.name === "Main.java")?.name ??
		files.find(file => file.name === "Algo.java")?.name ??
		files.find(file => file.name === "main.py")?.name ??
		files.find(file => isPythonIdeJavaFile(file.name))?.name ??
		files.find(file => isPythonIdePythonFile(file.name))?.name ??
		files[0]?.name ??
		"main.py"
	);
}

function projectTitleForMode(
	mode: PythonIdeMode,
	template: PythonIdeProjectTemplate = "blank"
) {
	if (template === "bluej" && mode === "java") return "BlueJ Java Project";
	if (template === "circle-art" && mode === "turtle")
		return "Color Circle Art";
	if (template === "classroom-project" && mode === "turtle")
		return "Classroom Turtle Studio";
	if (template === "firework-festival" && mode === "turtle")
		return "Firework Festival";
	if (template === "flower-garden" && mode === "turtle")
		return "Flower Garden Clicker";
	if (template === "maze-explorer" && mode === "turtle")
		return "Maze Explorer";
	if (template === "neon-trail" && mode === "turtle")
		return "Neon Trail Painter";
	if (template === "picasso" && mode === "turtle")
		return "Picasso Keyboard Painter";
	if (template === "spiral-galaxy" && mode === "turtle")
		return "Spiral Galaxy";
	if (template === "turtle-race" && mode === "turtle")
		return "Turtle Race Day";
	if (template === "triangle-motion" && mode === "turtle")
		return "Triangle Motion Starter";

	if (template === "outline") {
		if (mode === "turtle") return "Python Level 1 Outline";
		if (mode === "pgzero") return "PyGame Zero Outline";
		return `${getPythonIdeModeLabel(mode)} Outline`;
	}

	return mode === "data"
		? "Data / AI Notebook"
		: mode === "java"
			? "Java Practice"
			: mode === "karel"
				? "Karel Java World"
				: mode === "pgzero"
					? "PyGame Zero Game"
					: mode === "turtle"
						? "Turtle Drawing"
						: "Python Practice";
}

export function createPythonIdeProject(
	mode: PythonIdeMode = "python",
	options: CreatePythonIdeProjectOptions = {}
): PythonIdeProject {
	const now = new Date().toISOString();
	const template = options.template ?? "blank";
	const files = options.files?.length
		? clonePythonIdeFiles(options.files)
		: getStarterFilesForTemplate(mode, template);
	return {
		_id: `local-${crypto.randomUUID()}`,
		title: options.title ?? projectTitleForMode(mode, template),
		mode,
		files,
		activeFileName: resolvePythonIdeActiveFileName(files),
		courseID: options.courseID,
		courseProjectKey: options.courseProjectKey,
		courseProjectTitle: options.courseProjectTitle,
		starterLabel: options.starterLabel,
		starterUrl: options.starterUrl,
		shared: false,
		sharedSourceID: options.sharedSourceID,
		createdAt: now,
		updatedAt: now
	};
}

export function pythonIdeProjectToPayload(
	project: PythonIdeProject
): PythonIdeProjectPayload {
	const payload: PythonIdeProjectPayload = {
		title: project.title.trim() || "Untitled Code Project",
		mode: project.mode,
		files: project.files,
		activeFileName: resolvePythonIdeActiveFileName(
			project.files,
			project.activeFileName
		),
		courseID: project.courseID,
		courseProjectKey: project.courseProjectKey,
		courseProjectTitle: project.courseProjectTitle,
		starterLabel: project.starterLabel,
		starterUrl: project.starterUrl
	};
	if (isValidPythonIdeShareID(project.sharedSourceID)) {
		payload.sharedSourceID = project.sharedSourceID;
	}
	return payload;
}

export function pythonIdeStorageKey(userID?: string | null) {
	return `${pythonIdeStorageNamespace}:${userID || "anonymous"}`;
}

export function normalizePythonFileName(
	value: string,
	defaultExtension = ".py"
) {
	const cleaned = value
		.trim()
		.replaceAll("\\", "/")
		.replace(/^\.\/+/, "")
		.replace(/\/+/g, "/");
	if (!cleaned) return "";
	const segments = cleaned
		.split("/")
		.map(segment => segment.trim().replaceAll(WHITESPACE_RE, "_"))
		.filter(Boolean);
	if (!segments.length) return "";
	const fileName = segments[segments.length - 1] ?? "";
	const extensionMatch = fileName.match(FILE_EXTENSION_RE);
	if (!extensionMatch) return `${segments.join("/")}${defaultExtension}`;
	const extension = extensionMatch[0].toLowerCase();
	const stem = fileName.slice(0, -extensionMatch[0].length);
	segments[segments.length - 1] = `${stem}${extension}`;
	return segments.join("/");
}

export function isPythonIdeRuntimeReservedPath(value: string) {
	const normalized = value.trim().replaceAll("\\", "/").toLowerCase();
	if (!normalized) return false;
	if (PYTHON_IDE_RUNTIME_RESERVED_FILE_NAMES.has(normalized)) return true;

	const root = normalized.split("/")[0] ?? "";
	return PYTHON_IDE_RUNTIME_RESERVED_ROOTS.has(root);
}

export function isValidPythonFileName(value: string) {
	if (!value || value.length > 80) return false;
	if (value.startsWith("/") || value.includes("\\") || value.includes("//"))
		return false;

	const segments = value.split("/");
	if (
		segments.some(
			segment =>
				!segment ||
				segment === "." ||
				segment === ".." ||
				!SAFE_FILE_SEGMENT_RE.test(segment)
		)
	) {
		return false;
	}

	if (isPythonIdeRuntimeReservedPath(value)) return false;

	if (CODE_EXTENSION_RE.test(value)) {
		const rootDirectory = segments[0]?.toLowerCase();
		return !rootDirectory || !ASSET_DIRECTORY_NAMES.has(rootDirectory);
	}

	if (segments.length === 1) return ROOT_TEXT_FILE_RE.test(value);
	if (segments.length !== 2) return false;
	return IMAGE_FILE_RE.test(value) || AUDIO_FILE_RE.test(value);
}

export function isPythonIdePythonFile(value: string) {
	return PYTHON_EXTENSION_RE.test(value);
}

export function isPythonIdeJavaFile(value: string) {
	return JAVA_EXTENSION_RE.test(value);
}

export function isPythonIdeRunnableFile(
	value: string,
	mode: PythonIdeMode = "python"
) {
	return mode === "java" || mode === "karel"
		? isPythonIdeJavaFile(value)
		: isPythonIdePythonFile(value);
}

export function isPythonIdeTextFile(value: string) {
	return TEXT_FILE_RE.test(value);
}

export function isPythonIdeBinaryAssetFile(
	file: Pick<PythonIdeFile, "encoding">
) {
	return file.encoding === "base64";
}

export function normalizeImportedPythonIdeFileName(value: string) {
	const baseName = value.split(/[\\/]/).pop() ?? value;
	const normalized = normalizePythonFileName(baseName);
	if (IMAGE_EXTENSION_RE.test(normalized)) return `images/${normalized}`;
	if (SOUND_EXTENSION_RE.test(normalized)) return `sounds/${normalized}`;
	if (MUSIC_EXTENSION_RE.test(normalized)) return `music/${normalized}`;
	return normalized;
}

export function getPythonIdeFileMimeType(value: string) {
	const extension = value.match(FILE_EXTENSION_RE)?.[0]?.toLowerCase();
	if (extension === ".gif") return "image/gif";
	if (extension === ".jpg" || extension === ".jpeg") return "image/jpeg";
	if (extension === ".mp3") return "audio/mpeg";
	if (extension === ".ogg") return "audio/ogg";
	if (extension === ".png") return "image/png";
	if (extension === ".svg") return "image/svg+xml";
	if (extension === ".wav") return "audio/wav";
	if (extension === ".webp") return "image/webp";
	return "";
}

export function getPythonIdeAssetDataUrl(file: PythonIdeFile) {
	const mimeType = getPythonIdeFileMimeType(file.name);
	if (!mimeType) return "";
	if (file.encoding === "base64")
		return `data:${mimeType};base64,${file.content}`;
	if (mimeType === "image/svg+xml") {
		return `data:${mimeType};charset=utf-8,${encodeURIComponent(file.content)}`;
	}
	return "";
}

export function getPythonIdeFileKindLabel(value: string) {
	const extension = value.match(FILE_EXTENSION_RE)?.[0]?.toLowerCase();
	if (extension === ".csv") return "CSV";
	if (extension === ".java") return "Java";
	if (extension === ".json") return "JSON";
	if (extension === ".md") return "Markdown";
	if (extension === ".txt") return "Text";
	if (IMAGE_EXTENSION_RE.test(value)) return "Image";
	if (value.startsWith("music/")) return "Music";
	if (AUDIO_FILE_RE.test(value)) return "Sound";
	return "Python";
}

export function getPythonIdeDefaultFileContent(fileName: string) {
	const extension = fileName.match(FILE_EXTENSION_RE)?.[0]?.toLowerCase();
	if (extension === ".csv") return "name,value\nsample,1\n";
	if (extension === ".java")
		return '/**\n * @brief Write a small Java console program\n */\npublic class Main {\n/*****************\n*   CONSTANTS   *\n*****************/\n\n    private static final String GREETING_MESSAGE = "Hello, Java!";\n\n\n/*****************\n*   FUNCTIONS   *\n*****************/\n\n    /**\n     * @brief Run the Java program\n     *\n     * @param args Command-line arguments\n     */\n    public static void main(String[] args) {\n        System.out.println(GREETING_MESSAGE);\n    }\n}\n';
	if (extension === ".json") return '{\n\t"items": []\n}\n';
	if (extension === ".md") return "# Notes\n\n";
	if (extension === ".txt") return "";
	return '#####################\n###   CONSTANTS   ###\n#####################\nGREETING_MESSAGE = "Hello, Python!"\n\n\n#####################\n###   MAIN CODE   ###\n#####################\n# Store reusable text in a named constant before printing\nprint(GREETING_MESSAGE)\n';
}

function baseName(path: string) {
	return path.split("/").filter(Boolean).at(-1) ?? path;
}

function safeProjectFileNameFromStarterPath(
	path: string,
	resourceBasePath: string,
	usedFileNames: Set<string>
) {
	const basePath = resourceBasePath.replace(/\/+$/, "");
	const relativePath =
		basePath && path.startsWith(`${basePath}/`)
			? path.slice(basePath.length + 1)
			: path;
	const normalizedRelativePath = relativePath
		.replace(STARTER_RELATIVE_PREFIX_RE, "")
		.replace(/^\/+/, "");
	const candidatePath = normalizePythonFileName(normalizedRelativePath);
	let fileName = isValidPythonFileName(candidatePath)
		? candidatePath
		: normalizePythonFileName(baseName(normalizedRelativePath));

	if (!isValidPythonFileName(fileName)) return "";

	if (usedFileNames.has(fileName)) {
		const extension = fileName.match(FILE_EXTENSION_RE)?.[0] ?? "";
		const stem = extension
			? fileName.slice(0, -extension.length)
			: fileName;
		let duplicateIndex = 2;
		while (usedFileNames.has(`${stem}_${duplicateIndex}${extension}`)) {
			duplicateIndex += 1;
		}
		fileName = `${stem}_${duplicateIndex}${extension}`;
	}

	usedFileNames.add(fileName);
	return fileName;
}

export async function loadPythonIdeStarterFilesFromGitHub(
	starterUrl: string
): Promise<PythonIdeFile[]> {
	const resource = parseGitHubResource(starterUrl);
	if (!resource) {
		throw new Error(
			"Only public GitHub starter links can open in the IDE."
		);
	}

	const previewFiles = await listPreviewFiles(starterUrl);
	const usedFileNames = new Set<string>();
	const starterFiles: PythonIdeFile[] = [];

	for (const file of previewFiles) {
		const name = safeProjectFileNameFromStarterPath(
			file.path,
			resource.path,
			usedFileNames
		);
		if (!name || !isPythonIdeTextFile(name)) continue;

		const preview = await loadPreviewFile(file);
		starterFiles.push({
			name,
			content: preview.content,
			encoding: "text"
		});
	}

	const runnableFileIndex = starterFiles.findIndex(file =>
		CODE_EXTENSION_RE.test(file.name)
	);
	if (runnableFileIndex <= 0) return starterFiles;

	const [runnableFile] = starterFiles.splice(runnableFileIndex, 1);
	if (runnableFile) starterFiles.unshift(runnableFile);
	return starterFiles;
}

export function getPythonIdeRunnableFile(
	project: Pick<PythonIdeProject, "activeFileName" | "files"> &
		Partial<Pick<PythonIdeProject, "mode">>
) {
	const mode = project.mode ?? "python";
	if (mode === "java") return getJavaIdeRunnableFile(project);
	if (mode === "karel") return getKarelIdeRunnableFile(project);

	return (
		project.files.find(
			file =>
				file.name === project.activeFileName &&
				isPythonIdeRunnableFile(file.name, mode)
		) ??
		project.files.find(file => isPythonIdeRunnableFile(file.name, mode)) ??
		null
	);
}

function getJavaIdeRunnableFile(
	project: Pick<PythonIdeProject, "activeFileName" | "files">
) {
	const javaFiles = project.files.filter(file =>
		isPythonIdeJavaFile(file.name)
	);
	const activeFile = javaFiles.find(
		file => file.name === project.activeFileName
	);
	const mainFile = javaFiles.find(file => file.name === "Main.java");

	return (
		(activeFile && hasJavaMainMethod(activeFile)
			? activeFile
			: undefined) ||
		mainFile ||
		javaFiles.find(hasJavaMainMethod) ||
		activeFile ||
		javaFiles[0] ||
		null
	);
}

function getKarelIdeRunnableFile(
	project: Pick<PythonIdeProject, "activeFileName" | "files">
) {
	const javaFiles = project.files.filter(file =>
		isPythonIdeJavaFile(file.name)
	);
	const activeFile = javaFiles.find(
		file => file.name === project.activeFileName
	);
	const myProgramFile = javaFiles.find(
		file => file.name === "MyProgram.java"
	);
	const algoFile = javaFiles.find(file => file.name === "Algo.java");

	return (
		(activeFile && isLikelyKarelEntryFile(activeFile)
			? activeFile
			: undefined) ||
		myProgramFile ||
		algoFile ||
		javaFiles.find(isLikelyKarelEntryFile) ||
		activeFile ||
		javaFiles[0] ||
		null
	);
}

function hasJavaMainMethod(file: Pick<PythonIdeFile, "content">) {
	return JAVA_MAIN_METHOD_RE.test(javaEntryPointSearchText(file));
}

function isLikelyKarelEntryFile(file: Pick<PythonIdeFile, "content">) {
	const searchText = javaEntryPointSearchText(file);
	return (
		JAVA_MAIN_METHOD_RE.test(searchText) ||
		KAREL_RUN_METHOD_RE.test(searchText)
	);
}

function javaEntryPointSearchText(file: Pick<PythonIdeFile, "content">) {
	return file.content.replace(JAVA_ENTRY_POINT_IGNORED_TEXT_RE, " ");
}

export function loadLocalPythonProjects(userID?: string | null) {
	if (typeof window === "undefined") return [];

	try {
		const raw = window.localStorage.getItem(pythonIdeStorageKey(userID));
		if (!raw) return [];
		const parsed = JSON.parse(raw) as PythonIdeProject[];
		return Array.isArray(parsed) ? parsed : [];
	} catch {
		return [];
	}
}

export async function loadLocalPythonProjectsAsync(userID?: string | null) {
	const key = pythonIdeStorageKey(userID);
	const storedProjects = await readIndexedDbPythonProjects(key);
	const legacyProjects = loadLocalPythonProjects(userID);

	if (storedProjects && legacyProjects.length) {
		const storedProjectsUpdatedAt =
			pythonIdeProjectSetUpdatedAt(storedProjects);
		const legacyProjectsUpdatedAt =
			pythonIdeProjectSetUpdatedAt(legacyProjects);
		if (legacyProjectsUpdatedAt > storedProjectsUpdatedAt) {
			await saveLocalPythonProjectsAsync(legacyProjects, userID);
			return legacyProjects;
		}
		return storedProjects;
	}

	if (storedProjects) return storedProjects;

	if (legacyProjects.length) {
		await saveLocalPythonProjectsAsync(legacyProjects, userID);
	}
	return legacyProjects;
}

export function saveLocalPythonProjects(
	projects: PythonIdeProject[],
	userID?: string | null
) {
	if (typeof window === "undefined") return;
	window.localStorage.setItem(
		pythonIdeStorageKey(userID),
		JSON.stringify(projects)
	);
}

function pythonIdeProjectSetUpdatedAt(projects: PythonIdeProject[]) {
	return projects.reduce((latest, project) => {
		const updatedAt = Date.parse(
			project.updatedAt ?? project.createdAt ?? ""
		);
		return Number.isFinite(updatedAt)
			? Math.max(latest, updatedAt)
			: latest;
	}, 0);
}

export async function saveLocalPythonProjectsAsync(
	projects: PythonIdeProject[],
	userID?: string | null
) {
	const key = pythonIdeStorageKey(userID);

	try {
		await writeIndexedDbPythonProjects(key, projects);
		saveLegacyLocalPythonProjectsMirror(projects, userID);
	} catch (indexedDbError) {
		try {
			saveLocalPythonProjects(projects, userID);
		} catch {
			throw new Error(
				`Could not save Code IDE projects locally. Browser project storage may be full or unavailable. (${formatStorageError(indexedDbError)})`
			);
		}
	}
}

export function clearLocalPythonProjects(userID?: string | null) {
	if (typeof window === "undefined") return;
	window.localStorage.removeItem(pythonIdeStorageKey(userID));
}

export async function clearLocalPythonProjectsAsync(userID?: string | null) {
	const key = pythonIdeStorageKey(userID);
	await deleteIndexedDbPythonProjects(key).catch(() => undefined);
	clearLocalPythonProjects(userID);
}

async function readIndexedDbPythonProjects(key: string) {
	try {
		const db = await openPythonIdeStorageDb();
		const transaction = db.transaction(
			PYTHON_IDE_PROJECT_STORE,
			"readonly"
		);
		const record = await indexedDbRequest<
			PythonIdeProjectStorageRecord | undefined
		>(transaction.objectStore(PYTHON_IDE_PROJECT_STORE).get(key));
		await indexedDbTransactionDone(transaction);
		return Array.isArray(record?.projects) ? record.projects : null;
	} catch {
		return null;
	}
}

async function writeIndexedDbPythonProjects(
	key: string,
	projects: PythonIdeProject[]
) {
	const db = await openPythonIdeStorageDb();
	const transaction = db.transaction(PYTHON_IDE_PROJECT_STORE, "readwrite");
	await indexedDbRequest(
		transaction.objectStore(PYTHON_IDE_PROJECT_STORE).put({
			key,
			projects,
			updatedAt: new Date().toISOString()
		} satisfies PythonIdeProjectStorageRecord)
	);
	await indexedDbTransactionDone(transaction);
}

async function deleteIndexedDbPythonProjects(key: string) {
	const db = await openPythonIdeStorageDb();
	const transaction = db.transaction(PYTHON_IDE_PROJECT_STORE, "readwrite");
	await indexedDbRequest(
		transaction.objectStore(PYTHON_IDE_PROJECT_STORE).delete(key)
	);
	await indexedDbTransactionDone(transaction);
}

function openPythonIdeStorageDb() {
	if (typeof window === "undefined" || !window.indexedDB) {
		return Promise.reject(new Error("IndexedDB is unavailable."));
	}

	pythonIdeStorageDbPromise ??= new Promise<IDBDatabase>(
		(resolve, reject) => {
			const request = window.indexedDB.open(
				PYTHON_IDE_INDEXED_DB_NAME,
				PYTHON_IDE_INDEXED_DB_VERSION
			);

			request.onupgradeneeded = () => {
				const db = request.result;
				if (!db.objectStoreNames.contains(PYTHON_IDE_PROJECT_STORE)) {
					db.createObjectStore(PYTHON_IDE_PROJECT_STORE, {
						keyPath: "key"
					});
				}
			};
			request.onsuccess = () => {
				const db = request.result;
				db.onversionchange = () => {
					db.close();
					pythonIdeStorageDbPromise = null;
				};
				resolve(db);
			};
			request.onerror = () =>
				reject(request.error ?? new Error("Could not open IndexedDB."));
			request.onblocked = () =>
				reject(
					new Error(
						"Code IDE project storage is blocked by another tab."
					)
				);
		}
	).catch(error => {
		pythonIdeStorageDbPromise = null;
		throw error;
	});

	return pythonIdeStorageDbPromise;
}

function indexedDbRequest<T>(request: IDBRequest<T>) {
	return new Promise<T>((resolve, reject) => {
		request.onsuccess = () => resolve(request.result);
		request.onerror = () =>
			reject(request.error ?? new Error("IndexedDB request failed."));
	});
}

function indexedDbTransactionDone(transaction: IDBTransaction) {
	return new Promise<void>((resolve, reject) => {
		transaction.oncomplete = () => resolve();
		transaction.onerror = () =>
			reject(
				transaction.error ?? new Error("IndexedDB transaction failed.")
			);
		transaction.onabort = () =>
			reject(
				transaction.error ?? new Error("IndexedDB transaction aborted.")
			);
	});
}

function saveLegacyLocalPythonProjectsMirror(
	projects: PythonIdeProject[],
	userID?: string | null
) {
	try {
		saveLocalPythonProjects(projects, userID);
	} catch {
		// IndexedDB remains the primary store; the mirror is best-effort.
	}
}

function formatStorageError(error: unknown) {
	return error instanceof Error ? error.message : "storage unavailable";
}

export async function fetchPythonIdeProjects() {
	const projects: PythonIdeProjectMetadata[] = [];
	let offset: number | null = 0;
	while (offset !== null) {
		const response = await api.get<
			PythonIdeProjectPage<PythonIdeProjectMetadata>
		>("/users/loggedin/python-projects", {
			params: { offset }
		});
		const data: PythonIdeProjectPage<PythonIdeProjectMetadata> =
			response.data;
		projects.push(...data.projects);
		offset = nextPythonIdePageOffset(offset, data.nextOffset);
	}
	return projects;
}

export async function fetchPythonIdeProject(
	projectID: string,
	signal?: AbortSignal
) {
	const { data } = await api.get<{ project: PythonIdeProject }>(
		`/users/loggedin/python-projects/${projectID}`,
		{ signal }
	);
	return data.project;
}

export async function fetchSharedPythonIdeProject(shareID: string) {
	if (!isValidPythonIdeShareID(shareID)) {
		throw new Error("Invalid share link.");
	}

	const { data } = await api.get<{ project: SharedPythonIdeProject }>(
		`/users/python-projects/shared/${encodeURIComponent(shareID)}`
	);
	return data.project;
}

export async function fetchVisiblePythonIdeProjectReviews() {
	const reviews: PythonIdeProjectReviewMetadata[] = [];
	let offset: number | null = 0;
	while (offset !== null) {
		const response = await api.get<PythonIdeProjectReviewPage>(
			"/users/loggedin/python-project-reviews",
			{ params: { offset } }
		);
		const data: PythonIdeProjectReviewPage = response.data;
		reviews.push(...data.reviews);
		offset = nextPythonIdePageOffset(offset, data.nextOffset);
	}
	return reviews;
}

export async function fetchVisiblePythonIdeProjectReview(
	reviewID: string,
	signal?: AbortSignal
) {
	const { data } = await api.get<{
		review: PythonIdeProjectReview;
	}>(`/users/loggedin/python-project-reviews/${reviewID}`, { signal });
	return data.review;
}

export async function fetchManagedPythonIdeProjects(userID: string) {
	const projects: ManagedPythonIdeProjectMetadata[] = [];
	let offset: number | null = 0;
	while (offset !== null) {
		const response = await api.get<
			PythonIdeProjectPage<{
				project: PythonIdeProjectMetadata;
				review: PythonIdeProjectReviewMetadata | null;
			}>
		>(`/users/${userID}/python-projects`, {
			params: { offset }
		});
		const data: PythonIdeProjectPage<{
			project: PythonIdeProjectMetadata;
			review: PythonIdeProjectReviewMetadata | null;
		}> = response.data;
		projects.push(...data.projects);
		offset = nextPythonIdePageOffset(offset, data.nextOffset);
	}
	return projects;
}

export async function fetchManagedPythonIdeProject(
	userID: string,
	projectID: string,
	signal?: AbortSignal
) {
	const { data } = await api.get<ManagedPythonIdeProject>(
		`/users/${userID}/python-projects/${projectID}`,
		{ signal }
	);
	return data;
}

export async function createRemotePythonIdeProject(
	payload: PythonIdeProjectPayload
) {
	const { data } = await api.post<{ project: PythonIdeProject }>(
		"/users/loggedin/python-projects",
		payload
	);
	return data.project;
}

export async function createPythonIdeProjectReview(
	userID: string,
	projectID: string
) {
	const { data } = await api.post<{
		project: PythonIdeProject;
		review: PythonIdeProjectReview;
	}>(`/users/${userID}/python-projects/${projectID}/review`, {});
	return data;
}

export async function updatePythonIdeProjectReview(
	userID: string,
	projectID: string,
	reviewID: string,
	payload: {
		activeFileName?: string;
		files?: PythonIdeFile[];
		note?: string;
		refreshFromSource?: boolean;
		visibleToStudent?: boolean;
	}
) {
	const { data } = await api.put<{
		project: PythonIdeProject;
		review: PythonIdeProjectReview;
	}>(
		`/users/${userID}/python-projects/${projectID}/review/${reviewID}`,
		payload
	);
	return data;
}

export async function updateRemotePythonIdeProject(
	projectID: string,
	payload: PythonIdeProjectPayload
) {
	const { data } = await api.put<{ project: PythonIdeProject }>(
		`/users/loggedin/python-projects/${projectID}`,
		payload
	);
	return data.project;
}

export async function updateRemotePythonIdeProjectShare(
	projectID: string,
	shared: boolean
) {
	const { data } = await api.put<{ project: PythonIdeProject }>(
		`/users/loggedin/python-projects/${projectID}/share`,
		{ shared }
	);
	return data.project;
}

export async function deleteRemotePythonIdeProject(projectID: string) {
	await api.delete(`/users/loggedin/python-projects/${projectID}`);
}
