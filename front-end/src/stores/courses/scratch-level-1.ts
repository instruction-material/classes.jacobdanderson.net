import type {
	CourseItemLearningPath,
	RawCourse,
	RawCourseModule,
	RawCourseModuleItem
} from "./types";
import { isCoreProjectTitle } from "./projectGrouping";
import {
	buildScratchFluencyDrill,
	buildScratchOpenEndedVariant
} from "./scratchProjectGuidance";
import { buildSupportSectionGuidance } from "./supportSectionGuidance";

export const scratchLevel1Course: RawCourse = {
	name: "Scratch Level 1",
	modules: [
		{
			title: "GS1 Starting in Scratch",
			curriculum: [
				{
					title: "Scratch basics",
					content:
						"Create a Scratch account and explore the code blocks. Learn how the stage and sprites work, and experiment with the green flag to start scripts."
				},
				{
					title: "Project 1 – Hungry Hippo",
					content: `
• Play a sample Hungry Hippo game.
• Create a custom version of the game using a sprite of your choice.
• Make the sprite move using the left, right, up and down arrow keys (use the "point in direction" and "move 10 steps" blocks).
• Decide which module to start in based on understanding of the controls.
• Program the sprite to collect objects and increase its score each time it collects one.
• Create variables for "score" and a timer; increase the score when objects are collected and decrease time as the game runs.
`,
					projectLink: "https://scratch.mit.edu/projects/304003593/"
				},
				{
					title: "Starting in Scratch: Planning and Architecture",
					content: buildSupportSectionGuidance({
						courseFamily: "Scratch",
						moduleTitle: "Starting in Scratch",
						section: "planning"
					})
				},
				{
					title: "Starting in Scratch: Verification and Reflection",
					content: buildSupportSectionGuidance({
						courseFamily: "Scratch",
						moduleTitle: "Starting in Scratch",
						section: "verification"
					})
				}
			],
			supplementalProjects: [
				{
					title: "Starting in Scratch: Extension Challenge",
					content: buildSupportSectionGuidance({
						courseFamily: "Scratch",
						moduleTitle: "Starting in Scratch",
						section: "extension"
					}),
					projectLink: "https://scratch.mit.edu/projects/304003593/"
				},
				{
					title: "Starting in Scratch: Fluency Drill",
					content: buildScratchFluencyDrill({
						project: "Hungry Hippo-style collection",
						focus: "green-flag setup, keyboard movement, and predictable sprite starting positions",
						restartCheck:
							"The player and collectable return to their intended positions, and every movement key still produces one clear action."
					})
				},
				{
					title: "Starting in Scratch: Open-Ended Variant",
					content: buildScratchOpenEndedVariant({
						project: "starter collection game",
						coreIdea: "basic sprite control and visible feedback",
						variation:
							"what gets collected, how the player moves, or where each sprite begins",
						evidence:
							"The finished scene makes the green-flag setup and movement scripts easy to identify."
					})
				}
			]
		},
		{
			title: "GS2 Event Listeners",
			curriculum: [
				{
					title: "Basic event listeners",
					content:
						'Event listeners are blocks that wait for something to happen and then start a script. The "when green flag clicked" and "when arrow key pressed" blocks connect user actions to sprite behavior, so a project can respond when the game starts or when a specific key is pressed.'
				},
				{
					title: "Project 1 – Spinner",
					content: `
It's time to build a fun spinner:

1. When the green flag is clicked, make the arrow point to the right.
2. When the up, left, right or down arrow keys are pressed, point the arrow in the corresponding direction.
3. When the "A" key is pressed, turn the arrow 15 degrees to the left.
4. When the "D" key is pressed, turn the arrow 15 degrees to the right.
5. When the spacebar is pressed, make the arrow point towards the mouse.
`,
					projectLink: "https://scratch.mit.edu/projects/287920173/",
					solutionLink: "https://scratch.mit.edu/projects/287887351/"
				},
				{
					title: "Project 2 – Bouncy Ball Room",
					content: `
1. When the green flag is clicked, have the ball go to a random position.
2. When the space key is pressed, make the ball move 10 steps and bounce off the edge.
3. When the right-arrow key is pressed, change the backdrop.
4. When the up or down arrows are pressed, make the ball grow or shrink (use negative numbers for shrinking).
5. When the ball is clicked, play a sound and change its color.
`,
					projectLink: "https://scratch.mit.edu/projects/287924505/",
					solutionLink: "https://scratch.mit.edu/projects/287922077/"
				},
				{
					title: "Project 3 – Dragonfly Events",
					content: `
1. When the green flag is clicked, move the dragonfly to a random spot.
2. Use the arrow keys to move the dragonfly 20 steps.
3. When the dragonfly is clicked, change its color.
4. When the space bar is pressed, play a pop sound.
5. When the "1" key is pressed, make the dragonfly pop and go to a random position.
6. When the "2" key is pressed, have the dragonfly say something.
7. When the "3" key is pressed, change the background.
Challenge: Add another sprite controlled by the W-A-S-D keys.
`,
					projectLink: "https://scratch.mit.edu/projects/287707460/",
					solutionLink: "https://scratch.mit.edu/projects/284408078/"
				}
			],
			supplementalProjects: [
				{
					title: "Event Listeners: Extension Challenge",
					content: buildSupportSectionGuidance({
						courseFamily: "Scratch",
						moduleTitle: "Event Listeners",
						section: "extension"
					}),
					projectLink: "https://scratch.mit.edu/projects/287920173/",
					solutionLink: "https://scratch.mit.edu/projects/287887351/"
				},
				{
					title: "Event Listeners: Fluency Drill",
					content: buildScratchFluencyDrill({
						project: "event-listener reaction",
						focus: "green-flag, keypress, click, and backdrop events that each cause a different visible response",
						restartCheck:
							"Every event still works after restart, and no event depends on another event being triggered first."
					})
				},
				{
					title: "Event Listeners: Open-Ended Variant",
					content: buildScratchOpenEndedVariant({
						project: "event-driven interaction",
						coreIdea:
							"events as the connection between user actions and sprite behavior",
						variation:
							"which inputs trigger movement, sound, costume changes, messages, or backdrop changes",
						evidence:
							"At least three different event blocks produce distinct results without conflicting scripts."
					})
				}
			]
		},
		{
			title: "GS3 Pen with Event Listeners",
			curriculum: [
				{
					title: "Pen extension introduction",
					content:
						"The Pen extension adds drawing blocks to Scratch. `Pen down` makes the sprite draw as it moves, `Pen up` stops drawing, `erase all` clears the stage drawings, and `change color` changes the pen color."
				},
				{
					title: "Project 1 – Bouncy Ball with Pen",
					content: `
1. When the green flag is clicked, send the ball to a random position.
2. When the spacebar is pressed, make the ball move 10 steps and bounce off the edge.
3. Each time the ball moves, put the pen down so the ball leaves a trail.
4. Each time the ball moves, change the pen color.
5. When the green flag is clicked, erase any existing drawings and lift the pen up before moving the ball to a random position.

`,
					projectLink: "https://scratch.mit.edu/projects/313084455/",
					solutionLink: "https://scratch.mit.edu/projects/287952358/"
				},
				{
					title: "Project 2 – Stencil Pencil",
					content: `
1. The up arrow moves the pencil forward; the down arrow moves it backward.
2. The left arrow rotates the pencil 10 degrees left; the right arrow rotates it 10 degrees right.
3. Pressing "1" lowers the pen (start drawing).
4. Pressing "2" lifts the pen (stop drawing).
5. Clicking the pencil changes its pen color.
6. Pressing "3" increases the pen size; pressing "4" decreases the pen size.
7. When the green flag is clicked, erase all drawings, move the pencil back to the middle of the stage facing right and reset the pen size/color.

Challenge: Trace shapes on other backdrops.

`,
					projectLink: "https://scratch.mit.edu/projects/287738652/",
					solutionLink: "https://scratch.mit.edu/projects/285312799/"
				},
				{
					title: "Project 3 – Beetle Artist",
					content: `
1. Use the arrow keys to move the beetle 10 steps.
2. When the green flag is clicked, erase all drawings.
3. Press "1" to draw a square.
4. Press "2" to draw a triangle.
5. Press "3" to draw an arrow shape.
Challenge: Trace shapes on other backdrops.
`,
					projectLink: "https://scratch.mit.edu/projects/288003770/",
					solutionLink: "https://scratch.mit.edu/projects/287999903/"
				}
			],
			supplementalProjects: [
				{
					title: "Pen with Event Listeners: Extension Challenge",
					content: buildSupportSectionGuidance({
						courseFamily: "Scratch",
						moduleTitle: "Pen with Event Listeners",
						section: "extension"
					}),
					projectLink: "https://scratch.mit.edu/projects/313084455/",
					solutionLink: "https://scratch.mit.edu/projects/287952358/"
				},
				{
					title: "Pen with Event Listeners: Fluency Drill",
					content: buildScratchFluencyDrill({
						project: "pen-control drawing",
						focus: "pen down, pen up, color change, clear, and movement events that make the drawing state visible",
						restartCheck:
							"The drawing clears when expected, and pen state changes do not accidentally continue across unrelated controls."
					})
				},
				{
					title: "Pen with Event Listeners: Open-Ended Variant",
					content: buildScratchOpenEndedVariant({
						project: "interactive drawing tool",
						coreIdea:
							"event-controlled pen state and visual output",
						variation:
							"the drawing tool, color rule, erase behavior, or movement pattern used to create the image",
						evidence:
							"The project demonstrates clear pen-up and pen-down cases, plus one intentional way to reset or revise the drawing."
					})
				}
			]
		},
		{
			title: "GS4 Loops",
			curriculum: [
				{
					title: "Introduction to loops",
					content:
						'Loops repeat code blocks without copying the same instructions many times. The `repeat` block runs a set number of times, while the `forever` block keeps running until the project stops. Repeated "move" and "turn" instructions can create animations, patterns, and continuous sprite movement.'
				},
				{
					title: "Project 1 – Elephant Effects",
					content: `
1. When the "1" key is pressed, grow the elephant ten times (increase size by 10, ten times).
2. When the "2" key is pressed, shrink the elephant ten times.
3. When the "3" key is pressed, change the elephant's color effect forever.
4. When the "4" key is pressed, change a different graphic effect forever.
5. When the "5" key is pressed, hide the elephant, wait one second, then show it again (repeat this sequence).
6. When the space bar is pressed, switch the costume, play a sound and then switch back to the original costume, repeating the whole sequence three times.
`,
					projectLink: "https://scratch.mit.edu/projects/291122885/",
					solutionLink: "https://scratch.mit.edu/projects/291119943/"
				},
				{
					title: "Project 2 – Hot Cross Buns",
					content: `
This project uses the Music extension. When the green flag is clicked, play the song "Hot Cross Buns" twice:

E D C E D C C C C C D D D D E D C.

Use loops for repeated sections. Compose other songs as an extension.
`,
					projectLink: "https://scratch.mit.edu/projects/291117784/",
					solutionLink: "https://scratch.mit.edu/projects/291115434/"
				},
				{
					title: "Project 3 – Drawing Mouse",
					content: `
1. Add an event listener so that when the green flag is clicked, all drawings are erased.
2. When the "1" key is pressed, make the mouse draw a square using a loop at a random location.
3. When the "2" key is pressed, make the mouse draw a triangle.
4. When the "3" key is pressed, make the mouse draw a circle (explain that a circle can be drawn by repeating many small steps that turn in small increments to total 360 degrees).
Challenge: Create other shapes, like an octagon or a star, possibly adding random sizes and colors.
`,
					projectLink: "https://scratch.mit.edu/projects/289744824/",
					solutionLink: "https://scratch.mit.edu/projects/289445069/"
				}
			],
			supplementalProjects: [
				{
					title: "GS4 Supplemental Project 1 – Shapify",
					content: `
1. Use Pen blocks to draw a hexagon. (Hint: divide 360 degrees by the number of sides.)
2. Use the same method to draw an octagon, a decagon, a dodecagon and a circle.
3. Predict what happens if the loop around the circle is replaced with a forever loop, and then try it.
Challenge: Draw a different circle using different numbers.`,
					projectLink: "https://scratch.mit.edu/projects/330468686/",
					solutionLink: "https://scratch.mit.edu/projects/330429172/"
				},
				{
					title: "Loops: Fluency Drill",
					content: buildScratchFluencyDrill({
						project: "loop-driven animation",
						focus: "repeat counts, forever loops, timing, and the difference between one-time setup and repeated behavior",
						restartCheck:
							"The animation starts from the same state each run, and changing the loop count changes the repeated result predictably."
					})
				},
				{
					title: "Loops: Open-Ended Variant",
					content: buildScratchOpenEndedVariant({
						project: "loop-based motion or pattern",
						coreIdea:
							"repetition as a way to control timing, animation, and repeated actions",
						variation:
							"the repeated movement, timing rhythm, costume cycle, or pattern rule",
						evidence:
							"The loop is necessary for the behavior; removing it would make the project visibly incomplete or repetitive by hand."
					})
				}
			]
		},
		{
			title: "GS5 Basic Conditionals",
			curriculum: [
				{
					title: "Introducing conditionals",
					content:
						'Conditionals let a program make decisions. The "if … then" block checks a condition, and sensing blocks such as "touching mouse pointer", "key right arrow pressed", and "touching color ___" provide facts the condition can test. In games, conditionals often sit inside a `forever` loop so Scratch keeps checking for changes. A useful test describes both outcomes: what happens when the condition is true and what remains unchanged when it is false.'
				},
				{
					title: "Project 1 – Dino's Colors",
					content: `
1. Make the dinosaur follow the mouse pointer forever.
2. Use conditionals to make the dinosaur say "I'm in red!" when standing in red; similarly, add conditions for yellow, blue and grey.
`,
					projectLink: "https://scratch.mit.edu/projects/291223299/",
					solutionLink: "https://scratch.mit.edu/projects/291220849/"
				},
				{
					title: "Project 2 – Noisy Reactions",
					content: `
1. When the green flag is clicked, make the ball bounce around the screen forever.
2. Use a conditional so that when the bell touches the ball, the bell swings back and forth and rings four times.
3. When the ball touches lightning, make the lightning strike the ground and play a thunder sound, then return the lightning to the cloud. (Introduce the "go to [sprite]" block.)
4. When the chick touches the ball, make the chick move 5 steps and chirp.
`,
					projectLink: "https://scratch.mit.edu/projects/291542721/",
					solutionLink: "https://scratch.mit.edu/projects/291530292/"
				},
				{
					title: "Project 3 – Magic Wand",
					content: `
1. Make a magic wand move to the frog and turn it into a wizard.
2. Make the wand move to the piano and play three notes (any instrument/notes are fine).
3. Make the wand move to the ghost and send the ghost toward the star.
4. When the ghost touches the star, make the star grow to fill the screen.
`,
					projectLink: "https://scratch.mit.edu/projects/304279087/",
					solutionLink: "https://scratch.mit.edu/projects/304279316/"
				}
			],
			supplementalProjects: [
				{
					title: "GS5 Supplemental Project 1 – Camouflaging Octopus",
					content: `
1. Use event listeners to control the octopus with the arrow keys.
2. Use conditionals so the octopus turns blue when on a blue background.
3. Add conditionals for yellow, green and red backgrounds.`,
					projectLink: "https://scratch.mit.edu/projects/326209430/",
					solutionLink: "https://scratch.mit.edu/projects/326209241/"
				},
				{
					title: "GS5 Supplemental Project 2 – Playing Catch",
					content: `
1. When the green flag is clicked, make the basketball go to Gobo and move forever.
2. When Pico has the ball, use conditionals to pass it back to Gobo.
3. When Gobo has the ball, pass it to Pico.
Challenge: Add more sprites to the game and have the ball pass between them.`,
					projectLink: "https://scratch.mit.edu/projects/326211768/",
					solutionLink: "https://scratch.mit.edu/projects/326211724/"
				},
				{
					title: "Basic Conditionals: Open-Ended Variant",
					content: buildScratchOpenEndedVariant({
						project: "conditional response game",
						coreIdea:
							"if blocks that choose behavior from current sprite or variable state",
						variation:
							"the touch condition, score threshold, color check, or message shown when a condition is met",
						evidence:
							"The project includes at least one case where the condition is true and one case where it is false."
					})
				}
			]
		},
		{
			title: "GS6 Advanced Conditionals",
			curriculum: [
				{
					title: "Conditionals: if/then/else",
					content:
						'The "if … then … else" block allows two possible outcomes. If the condition is true, Scratch runs the first branch; otherwise, it runs the else branch. This structure is useful for choices such as correct versus incorrect, win versus lose, touching versus not touching, or enough points versus not enough points.',
					projectLink: "https://scratch.mit.edu/projects/293372295/",
					solutionLink: "https://scratch.mit.edu/projects/293366003/"
				},
				{
					title: "Project 1 – Dino's Colors II",
					content: `
1. Create controls for the dinosaur using the arrow keys.
2. When the "b" key is pressed, have the dinosaur say "Move me to blue!" for 2 seconds.
3. After speaking, use an if/then/else to check if the dinosaur is touching blue; if it is, say "Good job!", otherwise say "This isn't the right color!".
4. Repeat the previous step for the "r" (red) and "y" (yellow) keys.
5. Add sounds and costume changes for each color.

`,
					projectLink: "https://scratch.mit.edu/projects/293788691/",
					solutionLink: "https://scratch.mit.edu/projects/293787944/"
				},
				{
					title: "Project 2 – Hungry Dinosaur",
					content: `
1. When the green flag is clicked, use if/then blocks to control the dinosaur with the arrow keys.
2. When the space bar is pressed, the dinosaur attempts to eat bananas: if it is touching bananas, change the dinosaur's costume, play a sound or otherwise show the bananas being eaten; if not touching bananas, say "There aren't any bananas here!".
3. When the space bar is pressed, if the bananas are touching the dinosaur, wait one second then move the bananas to a random location; otherwise have the bananas say "I'm over here!".
`,
					projectLink: "https://scratch.mit.edu/projects/293457751/",
					solutionLink: "https://scratch.mit.edu/projects/293291715/"
				},
				{
					title: "Advanced Conditionals: Verification and Reflection",
					content: buildSupportSectionGuidance({
						courseFamily: "Scratch",
						moduleTitle: "Advanced Conditionals",
						section: "verification"
					})
				}
			],
			supplementalProjects: [
				{
					title: "GS6 Supplemental Project 1 – Blast Off Rocketship",
					content: `
1. When the green flag is clicked, start the rocketship at the center bottom of the stage.
2. If the user clicks the mouse, make the rocketship move up 5 steps; otherwise, it goes down 5 steps (always pointing upward).
3. When the rocketship reaches the star, make it blast off using sounds, motion or visual effects.`,
					projectLink: "https://scratch.mit.edu/projects/332463981/",
					solutionLink: "https://scratch.mit.edu/projects/332459692/"
				},
				{
					title: "GS6 Supplemental Project 2 – Baby Fish",
					content: `
1. When the green flag is clicked, make the baby fish continuously go to the mouse pointer.
2. If the baby fish is touching the mom fish, make it say "I found her"; otherwise say "Take me to my mom".
3. Make the mom fish glide around the screen randomly.`,
					projectLink: "https://scratch.mit.edu/projects/332468797/",
					solutionLink: "https://scratch.mit.edu/projects/332464646/"
				},
				{
					title: "Advanced Conditionals: Open-Ended Variant",
					content: buildScratchOpenEndedVariant({
						project: "multi-condition Scratch challenge",
						coreIdea:
							"nested or combined conditions that distinguish several game states",
						variation:
							"the rule that separates win, loss, near-miss, bonus, or warning outcomes",
						evidence:
							"Testing covers each branch, including the case where only part of the combined condition is true."
					})
				}
			]
		},
		{
			title: "GS7 User Input",
			curriculum: [
				{
					title: "Getting user input",
					content:
						'Event listeners respond to button presses, but many projects also need text typed by the user. The "ask ___ and wait" block collects typed input, and the "answer" variable stores the most recent response. The equality (=) block compares the answer to a correct value, while < and > blocks compare typed numbers by size.'
				},
				{
					title: "Project 1 – Math Facts",
					content: `
1. When the "1" key is pressed, have Gobo ask a math question (e.g., "What's 9 – 7?"). Indicate whether the answer is correct or incorrect via costume, sound or speech.
2. When the "2" key is pressed, have Gobo ask a question like "What's a number less than 0?" and indicate whether the answer is correct or incorrect.
3. When the "3" key is pressed, have Gobo ask a harder math question and allow the user to keep answering until the answer is correct. If the answer is too low, Gobo should say "Higher!"; if too high, say "Lower!".`,
					projectLink: "https://scratch.mit.edu/projects/295332936/",
					solutionLink: "https://scratch.mit.edu/projects/294539961/"
				},
				{
					title: "Project 2 – Fortune Teller",
					content: `
1. When the green flag is clicked, play an introduction and ask the user their name.
2. Ask the user "What do you want to know? (Type Love, Money, or Friendship)".
3. Use conditionals to give a fortune based on the user's input.
4. Ask another question such as "Choose a number between 1 and 5" and use conditionals to provide a response.
Challenge: Add more fortunes and questions to make the fortune teller more detailed.`,
					projectLink: "https://scratch.mit.edu/projects/297744913/",
					solutionLink: "https://scratch.mit.edu/projects/297735619/"
				},
				{
					title: "Project 3 – Number Guesser",
					content: `
1. When the green flag is clicked, have the sprite choose a random number between 1 and 20.
2. Ask the user to guess the number.
3. Use if/then/else blocks to tell the user if their guess is too high or too low.
4. Allow the user to keep guessing until they get the number right.
Challenge: Add a counter for the number of guesses and congratulate the player if they guess the number in fewer than 5 tries.`,
					projectLink: "https://scratch.mit.edu/projects/295334181/",
					solutionLink: "https://scratch.mit.edu/projects/294561252/"
				}
			],
			supplementalProjects: [
				{
					title: "GS7 Supplemental Project 1 – Animal Crossing",
					content: `
1. Ask the user if they want to build a shop, plant a tree or explore the island.
2. Use the answer to determine which event occurs.
3. Ask the user yes/no questions to further customize the experience.
4. Use variables to store items collected or tasks completed.
5. Encourage the user to explore and discover secrets.`,
					projectLink: "https://scratch.mit.edu/projects/328309551/",
					solutionLink: "https://scratch.mit.edu/projects/328310531/"
				},
				{
					title: "GS7 Supplemental Project 2 – Space Cadets",
					content: `
1. Ask the user for their name and call them "Captain".
2. Ask which planet (Mars, Jupiter or Saturn) they want to explore.
3. Use conditionals to set the scene for the chosen planet.
4. Ask additional questions (e.g., "Do you want to collect rocks or search for life?") and branch the story based on the answers.
5. Use variables to track discoveries or points.`,
					projectLink: "https://scratch.mit.edu/projects/328310783/",
					solutionLink: "https://scratch.mit.edu/projects/328308418/"
				},
				{
					title: "User Input: Open-Ended Variant",
					content: buildScratchOpenEndedVariant({
						project: "input-based quiz or customization",
						coreIdea:
							"ask-and-answer input that changes variables, messages, or game behavior",
						variation:
							"the prompt, accepted answers, scoring rule, or way the user's response changes the scene",
						evidence:
							"The result changes for at least two different inputs, and blank or unexpected input is handled deliberately."
					})
				}
			]
		},
		{
			title: "GS8 X & Y Coordinates",
			curriculum: [
				{
					title: "Introduction to X & Y coordinates",
					content:
						'The Scratch stage uses an X and Y coordinate plane. The X-axis moves left and right, and the Y-axis moves up and down. The "go to x: ___ y: ___" and "glide ___ secs to x: ___ y: ___" blocks place sprites at specific coordinates or move them smoothly to a target point.'
				},
				{
					title: "Project 1 – Bug Eater",
					content: `
1. When the green flag is clicked, make the praying mantis appear at a random position.
2. When the mouse is clicked, make the mantis glide to the mouse pointer's X and Y position.
3. If the mantis touches a bug, broadcast a message to make the bug disappear and increase the score.
4. Use variables for the score and a timer.
5. End the game when the timer runs out and display the score.`,
					projectLink: "https://scratch.mit.edu/projects/297831461/",
					solutionLink: "https://scratch.mit.edu/projects/297828061/"
				},
				{
					title: "Project 2 – Cake Chaser",
					content: `
1. Set up two sprites: a person and a slice of cake.
2. Use the arrow keys to move the person around the stage.
3. Make the cake appear at random X and Y coordinates.
4. When the person touches the cake, play a sound, move the cake to a new random location and increase the score.
5. Add a timer that counts down and ends the game when it reaches zero.`,
					projectLink: "https://scratch.mit.edu/projects/299085513/",
					solutionLink: "https://scratch.mit.edu/projects/297843021/"
				},
				{
					title: "Project 3 – Talent Show",
					content: `
1. Choose three performers (sprites).
2. When the green flag is clicked, have each performer go to their starting position using X and Y coordinates.
3. Use broadcast messages to make each performer do an act in sequence (dance, jump or play an instrument).
4. After the performances, have all performers bow together.`,
					projectLink: "https://scratch.mit.edu/projects/295339505/",
					solutionLink: "https://scratch.mit.edu/projects/295340057/"
				}
			],
			supplementalProjects: [
				{
					title: "GS8 Supplemental Project 1 – Quadrant Practice",
					content: `
1. Use the arrow keys to move a sprite to each quadrant of the stage.
2. When the sprite reaches a quadrant, display a message such as "I'm in Quadrant I".
3. Challenge: Add shapes or obstacles that must be avoided.`,
					projectLink: "https://scratch.mit.edu/projects/329289426/",
					solutionLink: "https://scratch.mit.edu/projects/329283944/"
				},
				{
					title: "GS8 Supplemental Project 2 – Coordinate Drawings",
					content: `
1. Using the Pen extension, draw a picture by moving the sprite to various X and Y coordinates.
2. Allow the user to enter coordinates to draw their own shapes.
3. Encourage drawing initials or simple pictures.`,
					projectLink: "https://scratch.mit.edu/projects/329294838/",
					solutionLink: "https://scratch.mit.edu/projects/329290359/"
				},
				{
					title: "X & Y Coordinates: Open-Ended Variant",
					content: buildScratchOpenEndedVariant({
						project: "coordinate-navigation scene",
						coreIdea:
							"x and y positions as visible control over sprite placement and movement",
						variation:
							"the target positions, movement bounds, spawn rule, or coordinate-based scoring condition",
						evidence:
							"The project uses both x and y values intentionally, not only drag-and-drop placement."
					})
				}
			]
		},
		{
			title: "GS9 Variables",
			curriculum: [
				{
					title: "Introducing variables",
					content:
						'Variables store information such as scores, timers, answers, or other values that can change while a project runs. The "set [variable] to" block replaces the current value, while "change [variable] by" increases or decreases it. A counting loop can make a sprite count from 1 to 10, count backward, or count by larger steps.'
				},
				{
					title: "Project 1 – Speed Click",
					content: `
1. When the green flag is clicked, create a timer variable and set it to 20.
2. Make a target sprite (e.g., a button) appear in random positions.
3. Each time the target is clicked, increase a score variable by 1.
4. Decrease the timer by 1 every second; when the timer reaches zero, stop the game and display the final score.
5. Consider adding a high-score variable.`,
					projectLink: "https://scratch.mit.edu/projects/299327014/",
					solutionLink: "https://scratch.mit.edu/projects/299311602/"
				},
				{
					title: "Project 2 – Spider Smash",
					content: `
1. When the green flag is clicked, have spiders appear at random positions and move downward.
2. When a spider is clicked, hide it, play a sound and increase the score.
3. Create a timer that counts down; end the game when it reaches zero.
4. Optionally increase difficulty by speeding up the spiders over time.`,
					projectLink: "https://scratch.mit.edu/projects/299272518/",
					solutionLink: "https://scratch.mit.edu/projects/299094220/"
				},
				{
					title: "Variables: Verification and Reflection",
					content: buildSupportSectionGuidance({
						courseFamily: "Scratch",
						moduleTitle: "Variables",
						section: "verification"
					})
				}
			],
			supplementalProjects: [
				{
					title: "GS9 Supplemental Project 1 – Counting Steps",
					content: `
1. Use the arrow keys to move a sprite around the stage.
2. Make a variable called "steps" that increases each time the sprite moves.
3. Display the number of steps taken.
4. Challenge: Add obstacles and a goal to reach.`,
					projectLink: "https://scratch.mit.edu/projects/327635693/",
					solutionLink: "https://scratch.mit.edu/projects/327634746/"
				},
				{
					title: "GS9 Supplemental Project 2 – Hungry Crab",
					content: `
1. Control a crab with the arrow keys.
2. Create a variable called "food" and increase it each time the crab eats a piece of food.
3. Add a timer; when time runs out, end the game and display how much food was collected.`,
					projectLink: "https://scratch.mit.edu/projects/327610777/",
					solutionLink: "https://scratch.mit.edu/projects/327610727/"
				},
				{
					title: "GS9 Supplemental Project 3 – Lunch Money",
					content: `
1. Start with a variable "money" set to 10.
2. Ask the user what they want to buy for lunch (e.g., pizza, sandwich or salad) and subtract the cost from the money variable.
3. If the user can't afford an item, display a message.
4. Allow them to continue buying until the money runs out.`,
					projectLink: "https://scratch.mit.edu/projects/327607937/",
					solutionLink: "https://scratch.mit.edu/projects/327607840/"
				}
			]
		},
		{
			title: "GS10 Message Broadcasting",
			curriculum: [
				{
					title: "Message broadcasting",
					content:
						"Broadcasting lets sprites send messages to each other. This is useful when one sprite needs to wait for another sprite to finish speaking, moving, or changing state before its own script begins.\n\nOpen the Events blocks and compare `broadcast __` with `when I receive __`. Practice by making one sprite finish a short action, broadcast a message, and trigger a second sprite to start moving only after that message is received."
				},
				{
					title: "GS10 Project 1 – Dance Off",
					content: `
It's dancing time! Let's give each sprite a turn to "perform" on the stage.

1. When the green flag is clicked, make the ballerina glide to the middle of the stage and cycle twice through all of her costumes. When she's done, have her glide off to the right side of the stage.
2. One by one, make each of the other dancers do the same thing. Can you add some clapping between each performer? We also need to be sure to make them start back on the left when the green flag is clicked!
3. A dance party isn't very fun without music! Add some code to the backdrop so that it plays dancing music forever. When Champ is done dancing, broadcast a message that stops the music.
4. Can you make it so that the lights change, too? How about some clapping once everyone is done?

`,
					projectLink: "https://scratch.mit.edu/projects/301002220/",
					solutionLink: "https://scratch.mit.edu/projects/300644693/"
				},
				{
					title: "GS10 Project 2 – Bowl Fill",
					content: `
Let's make a game where you control a bowl and try to collect various items!

1. Start by programming the bowl so that it can be controlled by the arrow keys once the green flag is clicked.
2. When a sprite is touched by the bowl, make it broadcast a message (like "Cheese touched", for example).
3. Think about what each sprite should do when it receives these messages. Should they move? Make a sound? What should the bowl do?
4. Add variables to your program that keep track of the number of times each object has been collected.
5. Add a timer that stops the game after 15 seconds. When the timer runs out, broadcast a message that makes all sprites on the screen do something (e.g., spin in a circle, grow and shrink, etc.).

Finally, share the project!`,
					projectLink: "https://scratch.mit.edu/projects/303008513/",
					solutionLink: "https://scratch.mit.edu/projects/302811491/"
				},
				{
					title: "Message Broadcasting: Verification and Reflection",
					content: buildSupportSectionGuidance({
						courseFamily: "Scratch",
						moduleTitle: "Message Broadcasting",
						section: "verification"
					})
				}
			],
			supplementalProjects: [
				{
					title: "GS10 Supplemental Project 1 – Magical Quest",
					content: `

Design your own play, and use the broadcast blocks to set up the scene changes and dialogue between characters!

1. Come up with a story that involves 3-4 characters and scenes. You can use movies or your real life as inspiration!
2. Add the sprites and backdrops you will need to your project.
3. Make your story come to life! Broadcast messages between your sprites to make sure everything happens in the correct sequence.`,
					projectLink: "https://scratch.mit.edu/projects/330301165/",
					solutionLink: "https://scratch.mit.edu/projects/328309254/"
				},
				{
					title: "GS10 Supplemental Project 2 – Cartoon Crash",
					content: `
Pick a partner for Dani to play with, and they will bounce around the screen together!

1. When the green flag is clicked, set up the Start button in the correct position and have Dani explain the instructions.
2. When the Start button is clicked, set up the sprites in the correct positions.
3. Program each sprite so that if it is chosen (i.e., clicked on), it bounces around the room with Dani! If it is not chosen, it should also react appropriately.`,
					projectLink: "https://scratch.mit.edu/projects/330302209/",
					solutionLink: "https://scratch.mit.edu/projects/328312475/"
				},
				{
					title: "Message Broadcasting: Open-Ended Variant",
					content: buildScratchOpenEndedVariant({
						project: "broadcast-coordinated scene",
						coreIdea:
							"messages that synchronize sprites, levels, or state changes",
						variation:
							"the message names, receiver responses, scene transition, or chain of actions after a broadcast",
						evidence:
							"Each broadcast has a clear sender, at least one receiver, and no receiver reacts to the wrong message."
					})
				}
			]
		},
		{
			title: "GS11 Hedgehog Race",
			curriculum: [
				{
					title: "GS11 Project 1 – Hedgehog Race",
					content: `
Let's put our skills to the test! Let's use what we've learned in the course to build this Hedgehog Race game.

Play through the demo and identify the different elements of the game that they will have to program in order to create this game. Helpful questions include: what does each sprite do? How do we control it? How does each sprite react to certain events? What variables do we need to keep track of? How does the game end?

Create a comment in the project to write out the different steps of what we will need to code.

Starter code is provided, but it is also fine to create a project from scratch with custom sprites, costumes, and backdrops.

Finally, share the project!`,
					projectLink: "https://scratch.mit.edu/projects/304551665/",
					solutionLink: "https://scratch.mit.edu/projects/305082197/"
				},
				{
					title: "Hedgehog Race: Debugging and Failure Modes",
					content: buildSupportSectionGuidance({
						courseFamily: "Scratch",
						moduleTitle: "Hedgehog Race",
						section: "debugging"
					})
				},
				{
					title: "Hedgehog Race: Planning and Architecture",
					content: buildSupportSectionGuidance({
						courseFamily: "Scratch",
						moduleTitle: "Hedgehog Race",
						section: "planning"
					})
				},
				{
					title: "Hedgehog Race: Verification and Reflection",
					content: buildSupportSectionGuidance({
						courseFamily: "Scratch",
						moduleTitle: "Hedgehog Race",
						section: "verification"
					})
				}
			],
			supplementalProjects: [
				{
					title: "GS11 Supplemental Project 1 – Save the Wizard",
					content: `
Play through the demo and identify the different elements of the game that they will have to program in order to create this game. Helpful questions include: what does each sprite do? How do we control it? How does each sprite react to certain events? What variables do we need to keep track of? How does the game end?

Create a comment in the project to write out the different steps of what we will need to code.

The wizard has been turned into a frog! Help him collect potions while avoiding skeletons to turn back into a wizard.

1. Let's start by working on our frog wizard! Make it so when the green flag is clicked, he goes to the center of the screen, changes his size and moves when the arrow keys are pressed.
2. Next, let's make the skeleton move! We want the skeleton to go to a random position on the far right side of the screen and constantly move left. When it is touching the frog or the left edge, make it go back to the right side.
3. Now do the same thing to the potion. If you want to make the game more challenging, make the potion wait a few seconds before appearing on the right again. (Hint: you'll need to use show/hide blocks).
4. Our frog needs to be able to level up and down in order to win or lose the game. Start by making a variable to keep track of the level and set it to 1 when the green flag is clicked.
5. Make message broadcasts for leveling up and down. When they level up, if they are at level 4, they win the game. Otherwise, increase their level by 1, switch the costume and increase the size. When they level down, if they are at level 1, they lose the game. Otherwise, decrease their level by 1, switch the costume and decrease the size.
6. Make sure to broadcast the level-up/level-down messages when the skeletons or potion touch the frog.
7. Feel free to add another skeleton to make the game more difficult.
8. Add sound effects and backdrop changes for the finishing touches!`,
					projectLink: "https://scratch.mit.edu/projects/332395747/",
					solutionLink: "https://scratch.mit.edu/projects/330724703/"
				},
				{
					title: "Hedgehog Race: Fluency Drill",
					content: buildScratchFluencyDrill({
						project: "race simulation",
						focus: "random movement, finish-line detection, score or winner state, and clean restart behavior",
						restartCheck:
							"A winner is declared only once, and a new race does not preserve old positions or winner messages."
					})
				},
				{
					title: "Hedgehog Race: Open-Ended Variant",
					content: buildScratchOpenEndedVariant({
						project: "randomized race game",
						coreIdea: "random movement and finish-line logic",
						variation:
							"the racers, track layout, random speed range, obstacle rule, or winner display",
						evidence:
							"Multiple runs can produce different outcomes, and the finish condition remains fair and easy to observe."
					})
				}
			]
		},
		{
			title: "GS12 Asteroid Dodge",
			curriculum: [
				{
					title: "GS12 Project 1 – Asteroid Dodge",
					content: `
Play through the demo and identify the different elements of the game that they will have to program in order to create this game. Helpful questions include: what does each sprite do? How do we control it? How does each sprite react to certain events? What variables do we need to keep track of? How does the game end?

Create a comment in the project to write out the different steps of what we will need to code.

Starter code is provided, but it is also fine to create a project from scratch with custom sprites, costumes, and backdrops.

Finally, share the project!`,
					projectLink: "https://scratch.mit.edu/projects/303001451/",
					solutionLink: "https://scratch.mit.edu/projects/302948550/"
				},
				{
					title: "Asteroid Dodge: Debugging and Failure Modes",
					content: buildSupportSectionGuidance({
						courseFamily: "Scratch",
						moduleTitle: "Asteroid Dodge",
						section: "debugging"
					})
				},
				{
					title: "Asteroid Dodge: Planning and Architecture",
					content: buildSupportSectionGuidance({
						courseFamily: "Scratch",
						moduleTitle: "Asteroid Dodge",
						section: "planning"
					})
				},
				{
					title: "Asteroid Dodge: Verification and Reflection",
					content: buildSupportSectionGuidance({
						courseFamily: "Scratch",
						moduleTitle: "Asteroid Dodge",
						section: "verification"
					})
				}
			],
			supplementalProjects: [
				{
					title: "Asteroid Dodge: Extension Challenge",
					content: buildSupportSectionGuidance({
						courseFamily: "Scratch",
						moduleTitle: "Asteroid Dodge",
						section: "extension"
					}),
					projectLink: "https://scratch.mit.edu/projects/303001451/",
					solutionLink: "https://scratch.mit.edu/projects/302948550/"
				},
				{
					title: "Asteroid Dodge: Fluency Drill",
					content: buildScratchFluencyDrill({
						project: "dodge game",
						focus: "player movement, falling hazards, collision detection, score or lives, and reset timing",
						restartCheck:
							"Hazards restart from sensible positions, and collisions affect the intended lives or score variable exactly once."
					})
				},
				{
					title: "Asteroid Dodge: Open-Ended Variant",
					content: buildScratchOpenEndedVariant({
						project: "avoidance challenge",
						coreIdea:
							"collision rules, movement control, and escalating pressure",
						variation:
							"the hazard pattern, player control scheme, scoring method, or difficulty curve",
						evidence:
							"The project has a clear safe state, danger state, and end condition that can be reproduced during testing."
					})
				}
			]
		},
		{
			title: "GS13 Master Project",
			curriculum: [
				{
					title: "GS13 Project 1 – Master Project",
					content: `For your Master Project, you now have the skills and knowledge to design and build a game of your own! Spend some time brainstorming what kind of game to make, thinking about the past projects created and different elements to incorporate.

Once there is an idea, discuss the plan for programming the game. Helpful questions include: what does each sprite do? How do we control it? How does each sprite react to certain events? What variables do we need to keep track of? How does the game end?`
				},
				{
					title: "Master Project Presentation",
					content: `Once it's complete, prepare a simple presentation about how the project was programmed and share the accomplishment with friends or family.

Another way to celebrate the project is by sharing it with friends or family.`
				},
				{
					title: "Course recap",
					content:
						"End the course by reviewing the major Scratch concepts: events, loops, conditionals, variables, broadcasting, coordinates, game states, sprite behavior, and project planning.\n\nConnect those ideas to Python Level 1. The same logic skills carry over, but the blocks become typed code."
				},
				{
					title: "Optional Extra Practice – Typing Games",
					content: `**Purpose:** This resource supports the transition from Scratch Level 1 into Python Level 1.

Typing practice is not required to complete the Scratch course, but it can make the move to text-based programming smoother. Choose games that feel useful, practice for about 15 to 20 minutes as needed, and move to the intermediate options if the beginner games feel too easy.

**Why it matters:** Scratch programs are assembled from blocks, while Python programs are typed. Keyboard fluency reduces friction so more attention can go toward variables, loops, conditionals, and debugging.

**Beginner typing games:**
- Practice with the Keyboard - Typing Letters: https://scratch.mit.edu/projects/214833806/
- Practice with the Keyboard - Typing Numbers: https://scratch.mit.edu/projects/214828609/
- Practice with the Keyboard - Typing Letters Race: https://www.nitrotype.com/

**Intermediate typing games:**
- Cup Stack Typing: https://www.abcya.com/games/cup-stack-typing-game
- Ghost Typing: https://www.abcya.com/games/ghost_typing
- Koala Paddleboards: https://www.abcya.com/games/spelling_practice

**Advanced typing games:**
- Typing Rocket: https://www.abcya.com/games/typing_rocket
- Type Racer: https://github.com/instruction-material/Python-Level-2/tree/main/PS12-Type-Racer/starter`
				}
			],
			supplementalProjects: [
				{
					title: "GS13 Master Project: Extension Challenge",
					content: buildSupportSectionGuidance({
						courseFamily: "Scratch",
						moduleTitle: "GS13 Master Project",
						section: "extension"
					})
				},
				{
					title: "GS13 Master Project: Fluency Drill",
					content: buildScratchFluencyDrill({
						project: "master-project prototype",
						focus: "one playable slice with controls, feedback, a rule for success or failure, and a visible reset path",
						restartCheck:
							"The prototype demonstrates the main mechanic without needing all final art, levels, or polish."
					})
				},
				{
					title: "GS13 Master Project: Open-Ended Variant",
					content: buildScratchOpenEndedVariant({
						project: "capstone game or interactive story",
						coreIdea:
							"a complete Scratch experience with player input, state, feedback, and replayability",
						variation:
							"the core mechanic, theme, level structure, scoring system, or story branch",
						evidence:
							"The final design includes a playable beginning, middle, and ending or replay loop, plus one tested extension beyond the base version."
					})
				}
			]
		},
		{
			title: "GS14 Mini Game Polish Studio",
			curriculum: [
				{
					title: "Game Polish Concepts",
					content:
						"A polished Scratch game is more than a set of working controls. It needs clear instructions, visible score or progress feedback, balanced difficulty, sound or visual polish, and an ending state that makes the result feel complete. The project is easy to trace from green flag to reset, normal play, win/loss state, and replay."
				},
				{
					title: "Design and Planning Map",
					content:
						"Plan the project by listing the sprites, backdrops, variables, messages, custom blocks, controls, and end conditions. A clear map prevents a large Scratch project from becoming a collection of disconnected scripts."
				},
				{
					title: "Polish Build Requirements",
					content:
						"Build a title screen, clear controls, score feedback, timer or lives, win/loss messages, and a replay path. Test the whole game from the green flag so the finished behavior is visible as one connected experience rather than isolated scripts."
				},
				{
					title: "Debugging and Test Pass",
					content:
						"Test the start state, normal play path, boundary case, and ending state. Record at least one bug or confusing behavior, the likely cause, and the exact Scratch block or script change that fixed it."
				},
				{
					title: "Share and Explain",
					content:
						"Prepare a short explanation of how the project works. Name the most important event, variable, loop, conditional, and message or custom block, then explain how those pieces cooperate."
				}
			],
			supplementalProjects: [
				{
					title: "Checkpoint: Trace the Project State",
					content:
						"Pick one moment during the project and name the current sprite positions, visible variables, active loops, and next event. This checks whether the project is understood as a system rather than as scattered blocks."
				},
				{
					title: "Mini Game Bug Patterns",
					content:
						"Look for scripts that do not reset on the green flag, messages that fire too early, variables that keep old values, clones that never delete, and forever loops that prevent the ending from appearing."
				},
				{
					title: "Extension Project: Polished Mini Game",
					content:
						"Create a polished version of Bug Eater, Cake Chaser, Hedgehog Race, or Asteroid Dodge. Add one feature, clean up one confusing script or repeated block pattern, and explain why the added behavior fits the original game."
				}
			]
		},
		{
			title: "GS15 Interactive Story Studio",
			curriculum: [
				{
					title: "Branching Story Concepts",
					content:
						"An interactive story uses events, broadcasts, costumes, backdrops, and variables to make choices visible. The project shows how a scene starts, which choice changes the story state, what message moves the project to the next scene, and how each ending is reached."
				},
				{
					title: "Design and Planning Map",
					content:
						"Plan the project by listing the sprites, backdrops, variables, messages, custom blocks, controls, and end conditions. A clear map prevents a large Scratch project from becoming a collection of disconnected scripts."
				},
				{
					title: "Story Build Requirements",
					content:
						"Build scene transitions, dialogue timing, character reactions, choice variables, and alternate endings. Test the story from the green flag through at least two different paths so the branching behavior is visible."
				},
				{
					title: "Debugging and Test Pass",
					content:
						"Test the start state, normal play path, boundary case, and ending state. Record at least one bug or confusing behavior, the likely cause, and the exact Scratch block or script change that fixed it."
				},
				{
					title: "Share and Explain",
					content:
						"Prepare a short explanation of how the project works. Name the most important event, variable, loop, conditional, and message or custom block, then explain how those pieces cooperate."
				}
			],
			supplementalProjects: [
				{
					title: "Checkpoint: Trace the Project State",
					content:
						"Pick one moment during the project and name the current sprite positions, visible variables, active loops, and next event. This checks whether the project is understood as a system rather than as scattered blocks."
				},
				{
					title: "Story Bug Patterns",
					content:
						"Look for scripts that do not reset on the green flag, messages that fire too early, variables that keep old values, clones that never delete, and forever loops that prevent the ending from appearing."
				},
				{
					title: "Extension Project: Branching Story",
					content:
						"Create a branching story with at least two meaningful choices and two endings. Add one feature, clean up one script or message sequence, and explain how the added behavior supports the story."
				}
			]
		},
		{
			title: "GS16 Debugging and Remix Studio",
			curriculum: [
				{
					title: "Debugging Concepts",
					content:
						"Scratch debugging starts by making the project state visible. Check green-flag setup, forever loops, sprite visibility, variable resets, coordinates, clone cleanup, and broadcast timing before changing features. A good repair explains what was broken, why it happened, and what evidence shows the fix worked."
				},
				{
					title: "Design and Planning Map",
					content:
						"Plan the project by listing the sprites, backdrops, variables, messages, custom blocks, controls, and end conditions. A clear map prevents a large Scratch project from becoming a collection of disconnected scripts."
				},
				{
					title: "Repair Build Requirements",
					content:
						"Repair broken controls, missing score updates, sprites hidden at start, scripts running in the wrong order, and games that never end. Test each repair from the green flag and keep a short bug log that connects symptoms to script changes."
				},
				{
					title: "Debugging and Test Pass",
					content:
						"Test the start state, normal play path, boundary case, and ending state. Record at least one bug or confusing behavior, the likely cause, and the exact Scratch block or script change that fixed it."
				},
				{
					title: "Share and Explain",
					content:
						"Prepare a short explanation of how the project works. Name the most important event, variable, loop, conditional, and message or custom block, then explain how those pieces cooperate."
				}
			],
			supplementalProjects: [
				{
					title: "Checkpoint: Trace the Project State",
					content:
						"Pick one moment during the project and name the current sprite positions, visible variables, active loops, and next event. This checks whether the project is understood as a system rather than as scattered blocks."
				},
				{
					title: "Debugging Pitfalls",
					content:
						"Look for scripts that do not reset on the green flag, messages that fire too early, variables that keep old values, clones that never delete, and forever loops that prevent the ending from appearing."
				},
				{
					title: "Extension Project: Debug Log and Remix Repair",
					content:
						"Create a debug log plus repaired remix of a small broken project. Add one feature only after the original issue is fixed, clean up one confusing script, and explain how the final version behaves differently."
				}
			]
		},
		{
			title: "GS17 Text-Based Programming Bridge",
			curriculum: [
				{
					title: "Scratch-to-Python Concepts",
					content:
						"Scratch blocks can be translated into text-code ideas: events become starting points, loops become repeated instructions, conditionals become branches, variables store state, custom blocks resemble functions, and coordinates act like numeric data. The bridge task is to explain a Scratch script in pseudocode before writing any Python-style version."
				},
				{
					title: "Design and Planning Map",
					content:
						"Plan the project by listing the sprites, backdrops, variables, messages, custom blocks, controls, and end conditions. A clear map prevents a large Scratch project from becoming a collection of disconnected scripts."
				},
				{
					title: "Translation Build Requirements",
					content:
						"Translate Scratch block screenshots or descriptions into pseudocode and then into simple Python-style statements. For each translated script, identify the start event, stored state, repeated behavior, condition, and output."
				},
				{
					title: "Debugging and Test Pass",
					content:
						"Test the start state, normal play path, boundary case, and ending state. Record at least one bug or confusing behavior, the likely cause, and the exact Scratch block or script change that fixed it."
				},
				{
					title: "Share and Explain",
					content:
						"Prepare a short explanation of how the project works. Name the most important event, variable, loop, conditional, and message or custom block, then explain how those pieces cooperate."
				}
			],
			supplementalProjects: [
				{
					title: "Checkpoint: Trace the Project State",
					content:
						"Pick one moment during the project and name the current sprite positions, visible variables, active loops, and next event. This checks whether the project is understood as a system rather than as scattered blocks."
				},
				{
					title: "Translation Pitfalls",
					content:
						"Look for scripts that do not reset on the green flag, messages that fire too early, variables that keep old values, clones that never delete, and forever loops that prevent the ending from appearing."
				},
				{
					title: "Extension Project: Scratch-to-Python Portfolio",
					content:
						"Create a Scratch-to-Python readiness portfolio with three translated scripts. Include the original Scratch idea, pseudocode, a Python-style version, and a short note explaining what changed during translation."
				}
			]
		}
	]
};

interface ScratchModuleFlowConfig {
	oldTitle: string;
	title: string;
	estimatedTime: string;
	keyBlocks: string[];
	choiceCurriculumTitles?: string[];
	anchorReturn?: string;
	kind?: RawCourseModule["kind"];
}

const SCRATCH_LEVEL_1_FLOW: ScratchModuleFlowConfig[] = [
	{
		oldTitle: "GS1 Starting in Scratch",
		title: "GS1 Starting in Scratch",
		estimatedTime: "1–2 sessions · 45–60 minutes each",
		keyBlocks: [
			"when green flag clicked",
			"go to x: y:",
			"point in direction",
			"move steps"
		]
	},
	{
		oldTitle: "GS2 Event Listeners",
		title: "GS2 Event Listeners",
		estimatedTime: "2 sessions · 45–60 minutes each",
		keyBlocks: [
			"when key pressed",
			"when this sprite clicked",
			"point towards",
			"change costume"
		],
		choiceCurriculumTitles: [
			"Project 2 – Bouncy Ball Room",
			"Project 3 – Dragonfly Events"
		],
		anchorReturn:
			"Connect each arrow key to one player movement and confirm that restarting the project does not create duplicate controls."
	},
	{
		oldTitle: "GS8 X & Y Coordinates",
		title: "GS3 X & Y Coordinates",
		estimatedTime: "2 sessions · 45–60 minutes each",
		keyBlocks: [
			"go to x: y:",
			"change x by",
			"change y by",
			"x position",
			"y position"
		],
		choiceCurriculumTitles: [
			"Project 2 – Cake Chaser",
			"Project 3 – Talent Show"
		],
		anchorReturn:
			"Choose intentional start coordinates for the player and collectable, then test the four stage boundaries."
	},
	{
		oldTitle: "GS3 Pen with Event Listeners",
		title: "GS4 Pen with Event Listeners",
		estimatedTime: "2 sessions · 45–60 minutes each",
		keyBlocks: [
			"pen down",
			"pen up",
			"erase all",
			"set pen color",
			"change pen size"
		],
		choiceCurriculumTitles: [
			"Project 2 – Stencil Pencil",
			"Project 3 – Beetle Artist"
		]
	},
	{
		oldTitle: "GS4 Loops",
		title: "GS5 Loops",
		estimatedTime: "2 sessions · 45–60 minutes each",
		keyBlocks: ["repeat", "forever", "wait", "stop all"],
		choiceCurriculumTitles: [
			"Project 1 – Elephant Effects",
			"Project 2 – Hot Cross Buns"
		]
	},
	{
		oldTitle: "GS9 Variables",
		title: "GS6 Variables",
		estimatedTime: "2 sessions · 45–60 minutes each",
		keyBlocks: [
			"make a variable",
			"set variable to",
			"change variable by",
			"show variable"
		],
		choiceCurriculumTitles: ["Project 2 – Spider Smash"],
		anchorReturn:
			"Add score and timer variables, reset both from the green flag, and verify that each starts with the same value on a second run."
	},
	{
		oldTitle: "GS5 Basic Conditionals",
		title: "GS7 Basic Conditionals",
		estimatedTime: "2 sessions · 45–60 minutes each",
		keyBlocks: ["if then", "touching", "touching color", "key pressed?"],
		choiceCurriculumTitles: [
			"Project 2 – Noisy Reactions",
			"Project 3 – Magic Wand"
		],
		anchorReturn:
			"Detect when the player touches the collectable, increase score exactly once, and move the collectable to a new position."
	},
	{
		oldTitle: "GS6 Advanced Conditionals",
		title: "GS8 Advanced Conditionals",
		estimatedTime: "2 sessions · 45–60 minutes each",
		keyBlocks: ["if then else", "and", "or", "not"],
		choiceCurriculumTitles: ["Project 2 – Hungry Dinosaur"]
	},
	{
		oldTitle: "GS7 User Input",
		title: "GS9 User Input",
		estimatedTime: "2 sessions · 45–60 minutes each",
		keyBlocks: [
			"ask and wait",
			"answer",
			"equals",
			"less than",
			"greater than"
		],
		choiceCurriculumTitles: [
			"Project 2 – Fortune Teller",
			"Project 3 – Number Guesser"
		]
	},
	{
		oldTitle: "GS10 Message Broadcasting",
		title: "GS10 Message Broadcasting",
		estimatedTime: "2 sessions · 45–60 minutes each",
		keyBlocks: [
			"broadcast",
			"broadcast and wait",
			"when I receive",
			"stop all"
		],
		choiceCurriculumTitles: ["GS10 Project 2 – Bowl Fill"],
		anchorReturn:
			"Broadcast a game-over message when the timer reaches zero so every sprite enters the same ending state and can restart cleanly."
	},
	{
		oldTitle: "GS11 Hedgehog Race",
		title: "GS11 Hedgehog Race",
		estimatedTime: "2–3 sessions · 45–60 minutes each",
		keyBlocks: [
			"pick random",
			"repeat until",
			"touching color",
			"broadcast"
		]
	},
	{
		oldTitle: "GS12 Asteroid Dodge",
		title: "GS12 Asteroid Dodge",
		estimatedTime: "2–3 sessions · 45–60 minutes each",
		keyBlocks: [
			"forever",
			"if then",
			"touching",
			"change score",
			"broadcast"
		]
	},
	{
		oldTitle: "GS14 Mini Game Polish Studio",
		title: "GS13 Mini Game Polish Studio",
		estimatedTime: "2 sessions · 45–60 minutes each",
		keyBlocks: [
			"show and hide",
			"sound blocks",
			"broadcast",
			"variables",
			"stop all"
		]
	},
	{
		oldTitle: "GS15 Interactive Story Studio",
		title: "GS14 Interactive Story Studio",
		estimatedTime: "2 sessions · 45–60 minutes each",
		keyBlocks: [
			"broadcast and wait",
			"when I receive",
			"ask and wait",
			"switch backdrop",
			"variables"
		]
	},
	{
		oldTitle: "GS16 Debugging and Remix Studio",
		title: "GS15 Debugging and Remix Studio",
		estimatedTime: "2 sessions · 45–60 minutes each",
		keyBlocks: [
			"green-flag reset",
			"show variable",
			"wait",
			"stop script",
			"broadcast"
		]
	},
	{
		oldTitle: "GS13 Master Project",
		title: "GS16 Master Project",
		estimatedTime: "4–6 sessions · 45–60 minutes each",
		keyBlocks: [
			"events",
			"loops",
			"conditionals",
			"variables",
			"broadcasts"
		]
	},
	{
		oldTitle: "GS17 Text-Based Programming Bridge",
		title: "GS17 Scratch-to-Python Bridge",
		estimatedTime: "1–2 optional sessions · 45–60 minutes each",
		keyBlocks: [
			"event → function",
			"repeat → loop",
			"if → condition",
			"variable → state"
		],
		kind: "transition"
	}
];

const COMBINING_MARKS_RE = /[\u0300-\u036F]/g;
const NON_ALPHANUMERIC_RE = /[^a-z0-9]+/g;
const LEADING_HYPHENS_RE = /^-+/;
const TRAILING_HYPHENS_RE = /-+$/;

function scratchSlugify(value: string) {
	return value
		.toLowerCase()
		.normalize("NFKD")
		.replace(COMBINING_MARKS_RE, "")
		.replace(NON_ALPHANUMERIC_RE, "-")
		.replace(LEADING_HYPHENS_RE, "")
		.replace(TRAILING_HYPHENS_RE, "");
}

function preserveScratchItemIds(
	module: RawCourseModule,
	legacyModuleId: string
) {
	for (const [items, prefix] of [
		[module.curriculum, "curriculum"],
		[module.supplementalProjects, "supplemental"]
	] as const) {
		for (const item of items) {
			item.id ??= scratchSlugify(
				`${legacyModuleId}-${prefix}-${item.title}`
			);
		}
	}
}

function supplementalLearningPath(
	item: Pick<RawCourseModuleItem, "title">
): CourseItemLearningPath {
	return /challenge|extension|open-ended/i.test(item.title)
		? "challenge"
		: "choice";
}

function renameScratchModuleReferences(
	module: RawCourseModule,
	config: ScratchModuleFlowConfig
) {
	const oldPrefix = config.oldTitle.match(/^GS\d+/)?.[0];
	const newPrefix = config.title.match(/^GS\d+/)?.[0];

	for (const item of [...module.curriculum, ...module.supplementalProjects]) {
		item.content = item.content.replaceAll(config.oldTitle, config.title);
		if (oldPrefix && newPrefix && oldPrefix !== newPrefix) {
			item.title = item.title.replace(
				new RegExp(`^${oldPrefix}\\b`),
				newPrefix
			);
		}
	}
}

function configureScratchLevel1Module(
	module: RawCourseModule,
	config: ScratchModuleFlowConfig
) {
	const legacyModuleId = scratchSlugify(`scratch-level-1-${config.oldTitle}`);
	module.id ??= legacyModuleId;
	preserveScratchItemIds(module, legacyModuleId);

	const practiceTitles = new Set(
		(config.choiceCurriculumTitles ?? []).filter(
			title => !isCoreProjectTitle(title)
		)
	);
	const movedPractice = module.curriculum.filter(item =>
		practiceTitles.has(item.title)
	);
	module.curriculum = module.curriculum.filter(
		item => !practiceTitles.has(item.title)
	);

	for (const item of module.curriculum) {
		item.learningPath = "core";
	}
	for (const item of movedPractice) {
		item.learningPath = "choice";
	}
	for (const item of module.supplementalProjects) {
		item.learningPath = supplementalLearningPath(item);
	}
	module.supplementalProjects = [
		...movedPractice,
		...module.supplementalProjects
	];

	if (config.anchorReturn && module.curriculum[0]) {
		module.curriculum[0].content = [
			module.curriculum[0].content,
			`**Hungry Hippo return:** ${config.anchorReturn}`
		].join("\n\n");
	}

	renameScratchModuleReferences(module, config);
	module.title = config.title;
	module.estimatedTime = config.estimatedTime;
	module.keyBlocks = [...config.keyBlocks];
	if (config.kind) {
		module.kind = config.kind;
	} else {
		delete module.kind;
	}

	return module;
}

function configureScratchLevel1Flow(course: RawCourse) {
	const modulesByTitle = new Map(
		course.modules.map(module => [module.title, module])
	);

	course.modules = SCRATCH_LEVEL_1_FLOW.map(config => {
		const module = modulesByTitle.get(config.oldTitle);
		if (!module) {
			throw new Error(
				`Scratch Level 1 flow is missing ${config.oldTitle}.`
			);
		}
		return configureScratchLevel1Module(module, config);
	});
}

configureScratchLevel1Flow(scratchLevel1Course);
