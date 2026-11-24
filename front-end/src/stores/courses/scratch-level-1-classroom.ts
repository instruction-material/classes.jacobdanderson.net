import type { RawCourse } from "./types";
import projects from "../../../scripts/scratch/projects.json";
import { scratchClassroomGameGuides } from "./scratchClassroomGameGuides";
import { scratchCostumeEditingGuide } from "./scratchProjectGuidance";

const units = [...new Set(projects.map(project => project.unit))];
const introductions: Record<string, string> = {
	"Events and movement":
		"Click one letter in Animate Your Name, identify its event and action, then add one reaction to your own name. Keep a working example beside your addition. Sound, size, turning, dialogue, backdrops and color are choices, not a checklist to complete at once. No loops or broadcasts are needed yet. Explore keyboard movement only after these individual click events work.",
	"Position and reset":
		"Drag a sprite to the place you want it, read x and y, and only then choose a motion block. Use the green flag to restore the starting scene and a click event to act. Compare an immediate go to with a timed glide. A layer block changes overlap, not position.",
	"Dialogue and scenes":
		"The stage owns backdrops; sprites own their own scripts. First use an event to change scenes. Then use a named broadcast to hand the next turn to another sprite. Run two scripts together and notice why a wait or message matters.",
	"Loops and animation":
		"First build a short sequence that works once. Put that sequence inside repeat when you know the count, or forever until you press Stop. Predict the final direction and use a wait to make the intermediate actions visible.",
	"Conditions and decisions":
		"An if block asks a true-or-false question. Keep movement events working while a separate loop checks the wall. Compare touching a wall with touching the goal. Only add and/or after each individual condition works.",
	"Variables and games":
		"A variable remembers a value between events. Choose a meaningful name, reset it on the flag, and change it at exactly the event that earns a point. Combine earlier skills into a game whose rules you can explain to a partner."
};

const remixPractice: Record<
	string,
	{ starter: string; task: string; check: string }
> = {
	"Events and movement": {
		starter: "click-reactions",
		task: "Give the orange robot a click script that changes its color effect by 25. On that same sprite, add a space-key event with clear graphic effects. Keep the blue robot’s click script.",
		check: "Click blue once and orange twice. Press Space. Orange should return to its original colors while blue keeps its changed color. If both clear, inspect which sprite owns each key event."
	},
	"Position and reset": {
		starter: "dress-up",
		task: "Make a try-on and return control for Badge. Its click script should bring it to the front and glide to (0, 0). On the R key, glide it back to its rack at (170, 50) in one second. Compare that return with Hat’s immediate green-flag reset.",
		check: "Put Hat on, try Badge on, then press R. Read Badge’s final x and y and check that Hat stayed in place. Click Badge again to verify it can be worn twice."
	},
	"Dialogue and scenes": {
		starter: "conversation",
		task: "Keep the flag greeting and reply. Add a separate rehearsal on the R key. Have the orange robot say a question for two seconds, then broadcast a new message named rehearsal reply. On the blue robot, receive that message and say an answer for two seconds.",
		check: "After the flag conversation ends, press R once. Orange should ask first and blue should answer once, after the question disappears. Press the flag again and check that the rehearsal question stays out of the original scene."
	},
	"Loops and animation": {
		starter: "dance-loop",
		task: "Add a square dance to the orange robot on the S key. Start at (0, 0) facing 90 degrees. Repeat move 40 steps, wait 0.2 seconds and turn clockwise 90 degrees. Choose the repeat count that returns the robot to its starting position and direction.",
		check: "Run once with three repeats and record the finishing x, y and direction. Predict what one more repeat will change. Run again with four and look for (0, 0) facing 90 degrees."
	},
	"Conditions and decisions": {
		starter: "maze-reset",
		task: "Add a practice checkpoint at (-100, -120). In Player’s wall-touching branch, change the retry destination to that checkpoint. Keep the green-flag start at (-180, -120). Use the arrow controls to test each event separately.",
		check: "Press the flag, touch the purple wall, then press the flag again. Read Player’s coordinates after each event. The first and last positions should match, and the middle one should be the checkpoint. Moving through open space should cause no reset."
	},
	"Variables and games": {
		starter: "click-score",
		task: "Make two versions of the score rule. Keep blue worth one point. In the remix, replace orange’s scoring action with change Score by -1. Keep the single flag reset on the stage. Write a score prediction before each click.",
		check: "Start at zero. Click orange, blue, then blue again. Compare the displayed scores with -1, 0 and 1. Press the flag to check the reset, then try two orange clicks in a row and explain the result."
	}
};

const mazeEndingGuide = [
	"**Turning remix:** This starter's arrows change x and y without turning Player. To experiment with turning, select **Player**, then use Motion's set rotation style block: all around displays turns, left-right only flips horizontally, and don't rotate keeps the costume's original orientation. Direction still affects move steps. Try turn 15 degrees on Player and verify that Wall stays still; undo the experiment to return to the supplied movement. Check the selected thumbnail before moving a script between sprites.",
	"",
	"## Optional ending screen",
	"",
	"After Normal works, use this Hard extension to end the game at the gold Goal. Keep the purple wall as a retry. A text costume is a sprite; a say block makes a speech bubble.",
	"",
	"1. Paint a new sprite named Ending. In Costumes, use the Text tool to write Maze complete! or a message that matches your ending rule. Place it near the center of the stage.",
	"2. On Ending, build when green flag clicked -> hide. This reset runs each time a new game starts. Do not put hide inside a forever loop.",
	"3. On Ending, build when I receive [Maze finished] -> go to front layer -> show. Create the same named message from the Events message menu. Leave this receiver as a short script that finishes.",
	"4. Keep the player's green-flag go to x: -180 y: -120 reset. In a green-flag forever loop on the player, add if touching [Goal] then broadcast [Maze finished] and wait, followed by stop all. Keep the wall-reset check working.",
	"5. Use broadcast and wait so Ending finishes showing before stop all stops the other scripts. Then press the flag again: the ending must hide and the player must return to its start.",
	"",
	"**Check the ending:** Reach the Goal and verify that the text appears in front and arrow movement stops. Restart and verify hidden text, the starting position and working arrows. Touch a wall before reaching the Goal and verify that it still retries. If the text disappears immediately, look for another script hiding it; if it never appears, compare the message names and the order of broadcast and wait / stop all.",
	"",
	"**Explain:** Point to the ending condition, the message sender and receiver, and the two reset scripts. Add this extension one working script at a time; the supplied starter remains your Normal checkpoint.",
	""
].join("\n");

export const scratchLevel1ClassroomCourse: RawCourse = {
	name: "Scratch Level 1: Classroom Edition",
	modules: units.map((unit, index) => ({
		id: `scratch-classroom-${index + 1}`,
		title: `${index + 1}. ${unit}`,
		estimatedTime:
			"One or two class meetings; advance after the checks work",
		keyBlocks: ["Run and predict", "Normal", "Hard", "Explain and test"],
		curriculum: [
			{
				id: `scratch-classroom-${index + 1}-intro`,
				preserveInstructions: unit === "Events and movement",
				title: `${unit}: Start Here`,
				content: `**Concept focus:** ${introductions[unit]}\n\n**Optional planning warmup:** Play a familiar small game, name its input -> action -> feedback rule, then sketch or paper-test one variation before coding. Predict a check a partner could perform. Keep this brief; Normal and Hard still use the saved working starter.\n\n**Class routine:** Run the supplied example together, predict one change, complete **Normal**, and demonstrate the check. **Hard** extends the same project after a working checkpoint. ${unit === "Events and movement" ? `\n\n${scratchCostumeEditingGuide}` : ""}\n\nDownload a starter below or open it in the website IDE. At the end of class, download your own .sb3 file with a recognizable name. Reopen it to verify the saved copy. Use your school's approved Scratch-compatible tool when required.`
			},
			...projects
				.filter(project => project.unit === unit && !project.optional)
				.map(project => ({
					id: project.id,
					title: project.name,
					learningPath: "core" as const,
					projectLink: `/ide?mode=scratch&starter=${project.id}`,
					content: `**Concept:** ${project.concept}\n\n${project.id === "animate-word" ? "**Block guide:** Events supplies when this sprite clicked. Motion turns a letter; its rotation style controls how it appears, not whether it turns. Looks changes size, says dialogue, changes a color effect, or switches the backdrop. Change size by is cumulative; set size to restores a chosen value. Color effects do not recolor the costume itself. Next backdrop cycles through the list; switch backdrop to chooses a named one. Sound: start sound continues immediately; play sound until done waits before the next block. Add a sound from the Sounds tab to use in your own letter. The supplied example uses an original short chime. Green-flag scripts restore this starter's scene; other projects may deliberately run actions on the flag.\n\n" : ""}[Download the starter (.sb3)](/scratch-projects/${project.id}.sb3). Open it with **Open .sb3**, or import it into a Scratch-compatible classroom editor.\n\n**Normal:** ${project.normal}\n\n**Hard:** ${project.hard}\n\n**Check:** ${project.check}\n\n${project.id === "maze-reset" ? `${mazeEndingGuide}\n` : ""}**Explain:** Point to the blocks you changed. Predict what would happen if one value or event changed, then test your prediction. Keep the supplied working scripts as examples rather than replacing the whole project.`
				})),
			...(unit === "Variables and games"
				? [
						{
							id: "scratch-classroom-independent-game",
							title: "Independent Mini-Game",
							projectLink: "/ide?mode=scratch&starter=blank",
							learningPath: "core" as const,
							content: `After the collection game's check works, create your own small game in a new project. Use **Start in IDE** to open a blank project with a backdrop and a sprite but no scripts, or [download the blank project (.sb3)](/scratch-projects/blank.sb3) for your approved classroom editor. In the website editor, **New project** opens the same blank workspace. Download your completed starter first to keep it as a reference, then save your independent game as a separate file.

**Plan:** Choose a player, a goal, controls, a backdrop, and one rule for earning points or reaching an ending. List the sprites, events, repeated actions, conditions, and variables your rule needs.

**Build:** Write the scripts yourself, one working behavior at a time. Use the earlier examples when stuck, then explain how your version differs. Include a green-flag reset and a clear instruction for the player.

**Check:** Ask a partner to play using only your directions. Verify movement, the scoring or ending rule, and restarting. Explain one event, loop, condition, and variable you used, then repair one confusing behavior.`
						}
					]
				: [])
		],
		supplementalProjects: [
			{
				id: `scratch-classroom-${index + 1}-practice`,
				title: `${unit}: Remix Practice`,
				preserveInstructions: true,
				learningPath: "choice" as const,
				projectLink: `/ide?mode=scratch&starter=${remixPractice[unit].starter}`,
				content: `Begin with a copy of the completed Normal project. Use **Open .sb3** for saved work, or **Start in IDE** for the original starter and finish Normal first. Save the remix under a separate name.

**Remix:** ${remixPractice[unit].task}

**Partner check:** ${remixPractice[unit].check}`
			},
			...projects
				.filter(project => project.unit === unit && project.optional)
				.map(project => ({
					id: project.id,
					title: project.name,
					learningPath: "choice" as const,
					preserveInstructions: true,
					projectLink: `/ide?mode=scratch&starter=${project.id}`,
					solutionLink: project.publishReference
						? `/ide?mode=scratch&starter=${project.id}&role=reference`
						: undefined,
					content: `${scratchClassroomGameGuides[project.id]}\n\n[Download this starter (.sb3)](/scratch-projects/${project.id}.sb3). Open the downloaded file with **Open .sb3** in the site IDE or an approved Scratch-compatible editor. Save the prior game under a separate name before importing a continuation.`
				}))
		]
	}))
};
