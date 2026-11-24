import type { RawCourseModuleItem } from "./types";

export const scratchBootcampTasks = [
	{
		id: "592006491",
		title: "Dragonfly Event Listener Remix",
		sourceSHA256:
			"c9dc0ec66b47df6cebc942aaf97a559138309a3b20e8de1c83227b64361cf9cd",
		publishedInstructionsSHA256:
			"9a2c05d56a2df38325179402e32c00b5fff1ef8c8acacae0d160657d3eb7d7d3",
		content: `The starter supplies the dragonfly and wetland backdrop; add its event scripts.

1. When the green flag is clicked, make the dragonfly go to a random position.
2. When the space key is pressed, play its pop sound.
3. When the dragonfly is clicked, make it say a short message such as "Buzzzz".`
	},
	{
		id: "592008620",
		title: "Beetle Keyboard Drawing Controls",
		sourceSHA256:
			"c75af913a4066c6eee722d6d4b02ffb9abcdaddb77446e004088cee987849b2c",
		publishedInstructionsSHA256:
			"779089e881cd1aaff7233159572d6e0948271c0a09e58e540300bf2815a66be7",
		content: `Use the supplied beetle and drawing backdrops.

1. Make each arrow key move the beetle 10 steps in that key's direction.
2. On the green flag, erase the drawing and return the beetle to the center facing right. Lift the pen while returning, then lower it for a shape.
3. Use the 1 key to draw a square with movement and turns.
4. Use the 2 key to draw a triangle.
5. Use the 3 key to draw an arrow shape.`
	},
	{
		id: "592014695",
		title: "Elephant Repeat and Forever Effects",
		sourceSHA256:
			"80dd2938cac5009156b03d8d0af415fb034102d03ab53efbb0002a16d5350ed7",
		publishedInstructionsSHA256:
			"853cbcbf29fa2eb5d42cbc644c293d6deb429e4cb4c6ec46237e55a502f3cb77",
		content: `Add key events to the supplied elephant.

1. With the 1 key, repeat 10 changes of size by 10.
2. With the 2 key, repeat 10 changes of size by -10.
3. With the 3 key, change the color effect in a forever loop.
4. With the 4 key, change another graphic effect in a forever loop.
5. With the 5 key, repeatedly hide, wait 1 second and show the elephant. Include a visible wait before hiding again.
On the green flag, show the elephant, restore size 100 and clear graphic effects so a new run starts predictably.`
	},
	{
		id: "592019210",
		title: "Button Click Timer Game",
		sourceSHA256:
			"771e33f9b759c4509ef7f8a4c4ad63ec0f6b7fdbdf1083dd2e8224d74703e42d",
		publishedInstructionsSHA256:
			"0f070b71e18f7509ec1259c1b3dc8d5a78f9d10e8c77249a503d5b5ffcad0549",
		content: `The starter already has the green-flag introduction and click costume/sound feedback. Extend those stacks.

1. Make a Clicks variable and reset it to 0 at the start.
2. Count a button click only while the round is active. The same click switches to Pressed and plays Coin, then restores Regular.
3. Make a Seconds left variable and start it at 10.
4. Before counting down, show the button and say "Ready...", "Set..." and "Go!" for 1 second each. Keep scoring inactive during this introduction.
5. Enable scoring, then repeat 10 times: wait 1 second and reduce Seconds left by 1.
6. At 0, disable scoring and hide the button. A new green-flag start shows Regular and resets both counters.
A Playing variable with values 0 and 1 can guard the existing click stack, as shown in the lesson.`
	},
	{
		id: "601699148",
		title: "Mouse Shape Loops",
		sourceSHA256:
			"9feeedbdb5d2b6616ef13786614ab774258be9cdc115aea4a0f8805c34cb37d2",
		publishedInstructionsSHA256:
			"eef253db1e45b4b4f8aac7f4af8739635ee25c15278e1699f2c76ba271d233b7",
		content: `Add shape scripts to the supplied mouse.

1. On the green flag, erase the drawing and reset the mouse's position, direction and pen state.
2. With the 1 key, use a loop to draw a triangle.
3. With the 2 key, use a loop to draw a circle-like shape from small turns and movements.
4. Add another number-key design, such as an octagon, star or spiral. Change the turn amount, distance or repeat count deliberately.`
	},
	{
		id: "608768681",
		title: "Hungry Shark",
		sourceSHA256:
			"4a7560987b415b499ae5c20c731398e9ae9c570ee2e81a4320cc761200a37216",
		publishedInstructionsSHA256:
			"1ebe0dceda282f8affbf5289051f731fd3f9c3bcfbd86c671a5af01ddeef1f90",
		content: `Use the shark, ordinary fish and pufferfish in the starter.

1. On the green flag, reset Score to 0 and make Shark 2 follow the mouse pointer continuously.
2. While the mouse button is pressed, switch the shark to its closed-mouth costume and play its supplied Bite sound. Restore its resting costume when the button is released.
3. Make Fish and Fish2 move to random positions, wait 2 seconds and repeat.
4. A catch needs both conditions: the mouse button is down and that fish is touching Shark 2.
5. For a caught ordinary fish, add 1 to Score, play the fish's bubbles sound and move it away immediately. One contact must not score repeatedly.
6. Give each pufferfish similar movement and collision code, but subtract 1 when it is caught.
7. Create a Playing variable for all sprites and reset it to 1 on the green flag. Choose an ending. For a target-score round, set Playing to 0 when Score reaches 5 and show the score. For a timed round, set Playing to 0 when time expires. Guard movement and scoring with Playing, then try another bite after the result appears.
Restart with score, positions and costumes reset. The fish scripts belong to the fish sprites; the supplied sound is Bite rather than a separate whoosh clip.`
	},
	{
		id: "608770708",
		title: "Save the Princess",
		sourceSHA256:
			"5149adb648b73b120a7774ae5b6f10f164dece7f71a79f0ffe467ca83459370e",
		publishedInstructionsSHA256:
			"235318c656f9fd374e6dcad9bc6509fce4edcc9d781db0b5b2fa6cc47ad774e4",
		content: `Use the supplied Princess and Dragon.

1. Make the left and right arrow keys move Princess horizontally.
2. Make Dragon fall by decreasing y repeatedly.
3. When Dragon reaches the lower boundary or touches Princess, return it to the top at a random x position.
4. Create Lives and reset it to 3 on the green flag.
5. A Dragon contact subtracts exactly 1 life before that Dragon respawns away from Princess. Reaching the lower boundary alone does not cost a life. End play when Lives reaches 0.
6. Reset Timer to 60, reduce it once per second and end the round at 0. The finished state stops movement and further life changes.
A new green-flag run restores all actors, Lives and Timer. The saved variable values in the empty starter do not implement these reset or countdown scripts.`
	}
];

export function scratchBootcampTask(id: string) {
	const task = scratchBootcampTasks.find(task => task.id === id);
	if (!task) throw new Error(`Unknown Scratch Bootcamp task: ${id}`);
	return task.content;
}

export const scratchBootcampPractice: Record<string, RawCourseModuleItem[]> = {
	"GS1 Event Listeners and Movement": [
		{
			title: "Practice Map: Event Listeners and Movement",
			learningPath: "choice",
			contentKind: "assignment",
			preserveInstructions: true,
			preserveAssignment: true,
			projectLink: "https://scratch.mit.edu/projects/592006491/",
			content: `Find a misplaced block in a Dragonfly remix. On the dragonfly, attach go to random position to the green flag. Under when space key pressed, attach start sound pop and say Buzzzz for two seconds. Leave the sprite-click hat empty. Predict what pressing space and clicking the sprite will each do, then run both tests.

Move one block so space triggers only the sound and a click triggers only speech. Repeat both tests and restart with the flag. Record the input and observed response before and after the move. Explain why adding a new click hat without attaching the speech block leaves the behavior unchanged.`
		},
		{
			title: "Extension Review: Event Listeners and Movement",
			learningPath: "challenge",
			contentKind: "assignment",
			preserveInstructions: true,
			preserveAssignment: true,
			projectLink: "https://scratch.mit.edu/projects/592008620/",
			content: `Give the beetle two arrow-key controls that still work after it turns. On the green flag, lift the pen, go to x: 0 y: 0, and point right. On right arrow, change x by 10. On up arrow, change y by 10. Show the beetle’s x position and y position using the monitors in Motion.

Start at the center and tap right twice and up once. Record the coordinates. Point the beetle left, start from the center again without resetting its direction, and repeat the same keys. Compare both runs with x: 20 y: 10. Explain what would differ if the right-arrow stack used move 10 steps instead.`
		}
	],
	"GS2 Loops": [
		{
			title: "Practice Map: Loops",
			learningPath: "choice",
			contentKind: "assignment",
			preserveInstructions: true,
			preserveAssignment: true,
			projectLink: "https://scratch.mit.edu/projects/601699148/",
			content: `Draw two polygons with the mouse sprite. Add the Pen extension. Use the green flag to erase all, lift the pen, return to the center, and point right. On key 1, lower the pen and repeat four pairs of move 40 steps and turn clockwise 90 degrees. Lift the pen after the loop. Run the script and check whether the fourth edge ends where the first began.

Duplicate the key stack for key 2. Make a triangle with three equal sides by changing both the repeat count and the turn. Test from the same starting position. Explain why three turns of 120 degrees close the triangle and why three turns of 90 degrees leave a gap.`
		},
		{
			title: "Extension Review: Loops",
			learningPath: "challenge",
			contentKind: "assignment",
			preserveInstructions: true,
			preserveAssignment: true,
			projectLink: "https://scratch.mit.edu/projects/592014695/",
			content: `Make the elephant flash exactly three times when the 5 key is pressed. On the green flag, show the sprite and clear graphic effects. Under the key hat, repeat three times: hide, wait half a second, show, then wait half a second. Leave a say block after the loop so the elephant announces Done.

Move the final wait outside the loop and predict how long the elephant will be visible between flashes. Run both versions. Restore the wait inside and compare repeat 3 with forever: identify which version can reach Done. Save the finite version and describe the observed difference in timing.`
		}
	],
	"GS3 Conditionals and Variables": [
		{
			title: "Practice Map: Conditionals and Variables",
			learningPath: "choice",
			contentKind: "assignment",
			preserveInstructions: true,
			preserveAssignment: true,
			projectLink: "https://scratch.mit.edu/projects/592019210/",
			content: `Use the Button Click Timer starter to test when a click earns a point. Make Clicks and Playing variables for all sprites. Reset both to zero at the start of the existing green-flag stack. Keep its show block and Ready, Set, Go messages. After Go, set Playing to 1, wait three seconds, and set Playing to 0. Add a check to the existing click stack: change Clicks by 1 only if Playing equals 1.

Click once during Ready, twice during the three-second round, and once after it. Record Clicks after each phase. A correct run ends at 2 and a restart resets it to 0. Use the Playing monitor to distinguish a late click from a broken guard.`
		},
		{
			title: "Extension Review: Conditionals and Variables",
			learningPath: "challenge",
			contentKind: "assignment",
			preserveInstructions: true,
			preserveAssignment: true,
			projectLink: "https://scratch.mit.edu/projects/327635693/",
			content: `Give the zebra a Steps counter and a second counter named Distance. Reset both on the green flag and go to x: 0 y: 0. In the right-arrow stack change x by 10, and in the left-arrow stack change x by -10. Each successful key event adds 1 to Steps and 10 to Distance, regardless of direction.

Tap right twice and left once. Compare x position, Steps and Distance with 10, 3 and 30. Then tap left again. Explain why Distance increases even while the zebra returns to the center. Save a second input sequence and its predicted and observed values.`
		}
	],
	"GS4 Master Project": [
		{
			title: "Practice Map: Master Project",
			learningPath: "choice",
			contentKind: "assignment",
			preserveInstructions: true,
			preserveAssignment: true,
			content: `Reopen the saved game from Bootcamp Game Selection. Test one successful action and one near miss from the same starting state. For Spider Smash or Hungry Shark, compare contact while pressing the mouse button with contact while the button is released. For Save the Princess, compare a dragon reaching the lower boundary with a dragon touching the princess.

Record the starting Score or Lives, the input, and the ending value in each run. A miss leaves that value unchanged. A single scoring contact changes it once. If holding an input counts the same contact repeatedly, move the actor away on contact or wait until contact ends before allowing another change. Retest the same two cases.`
		},
		{
			title: "Extension Review: Master Project",
			learningPath: "challenge",
			contentKind: "assignment",
			preserveInstructions: true,
			preserveAssignment: true,
			content: `Open the saved playable game. Shorten one round for testing: start its countdown at three seconds, use one life, or choose a winning score of one. Identify the script that sets the finished state and which scripts still accept movement or scoring input.

Play to the ending and repeat the last input. Check that the displayed result stays fixed. Start again and check the score or lives, costumes, visibility, positions, and controls that the previous round changed. Restore the intended round length or target, download the .sb3, and play it again from the saved file. Report one restart defect you corrected or one failed prediction the test ruled out.`
		}
	]
};
