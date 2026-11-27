const arcadeSource =
	"https://github.com/instruction-material/Python-Level-1/tree/ebe5b69c4fc15775e4405f61d68b20ebd02aea96";

const projects = {
	stars: {
		title: "GrS13 Supplemental Project 1: Light the Stars",
		folder: "GrS14-Light-the-Stars",
		individual: `Steer with Left and Right to light ten stars before the sky darkens. The starter draws the scene, reflects the player at the walls and advances the timer. The list unlit holds the stars that still count toward the goal.

1. Complete touching(first, second). Require the absolute difference to be below 10 on both axes.
2. In advance, loop over a copy of unlit. When the player touches a star, color it yellow and remove it from unlit so the same star cannot count again.
3. Count lit stars with 10 - len(unlit). The supplied end conditions check the empty list before the timer, so lighting the last star on the final frame wins.

**Checkpoints:** Positions (0, 0) and (9, -9) are in contact. A difference of 10 on one axis is outside the hitbox. To test quickly, reduce frames_left to 2. Try a final star within reach, then try an unlit star outside reach and check that these produce different endings.`,
		classroom: `Run the prepared evening scene and use Left and Right to steer. Trace a star from the unlit list to a yellow dot on the canvas.

**Normal:** In \`normal_addition()\`, print len(unlit) and the number already lit, 10 - len(unlit). The two counts always add to 10. Observe what changes when a star lights.

**Hard:** In \`hard_addition()\`, set the remaining frame count to 1 with a global declaration. Move the last unlit star to the player's position and keep just that star in unlit. Confirm that the final frame lights the star and shows the win message. Repeat with the star beyond reach to see the timeout.

**Checkpoints:** A yellow star stays visible after leaving the list. Once the round ends, the background and counter stop updating.`
	},
	dodgeball: {
		title: "GrS13 Supplemental Project 2: Dodgeball",
		folder: "Grs13-Dodgeball",
		individual: `Turn the bouncing-ball room into a survival game. The starter moves all ten balls, reflects them at the walls and shows the lives counter. Left and Right steer the player.

1. Finish touching(first, second) with an absolute difference below 10 on each axis.
2. In advance, check contact after every ball has moved. On the first hit, subtract one life, move the player to (0, 0), and break out of the collision loop.
3. Use the supplied lives display and timer check. They should show the new count during play and Game over when it reaches zero.

**Checkpoints:** Put two balls where they can touch the player on the same frame. The count must go down by one. Set lives to 1 and force another hit. Motion should stop on the same frame the game-over message appears.`,
		classroom: `Run the prepared dodgeball game. Trace the movement loop separately from the contact loop. Left and Right steer the player.

**Normal:** In \`normal_addition()\`, move two balls to the player's position and give both the player's heading. Watch the next redraw and confirm that only one life is lost.

**Hard:** In \`hard_addition()\`, set lives to 1 with a global declaration and print the value before the timer advances. Confirm that the forced hit ends the game and leaves lives at 0.

**Checkpoints:** The contact loop stops at its first hit. Check that the ball motion and the score display stop together when the round ends.`
	},
	spaceEater: {
		title: "GrS14 Project 1: Space Eater",
		folder: "GrS14-Space-Eater",
		individual: `Build a complete game by steering with Left and Right to collect ten moving targets before time runs out. The starter supplies the board, the list of ten targets, keyboard handlers, wall reflections and a frame timer. R resets the round.

1. Complete touching(first, second). Use the targets' and player's coordinates to test whether both absolute differences are below 10.
2. In advance, move and reflect each target before checking it. On contact, add one point and use place_target(target) to send that same target to a new location and heading. Stop checking this frame when score reaches winning_score.
3. Trace how advance and reset_round maintain score, frames_left and playing. The end-of-round message should stay visible while play is paused. R should reset all three state values without scheduling a second timer.

**Checkpoints:** At a difference of 9 on each axis the positions touch. A difference of 10 on either axis misses. Test an ordinary score increase, a win at ten, and running out of time below ten. Press R after both endings and check for a zero score, a full timer and the player facing right from the center.`,
		classroom: `Run the prepared Space Eater game. Steer with Left and Right. Collect ten targets before time runs out, then press R to play again.

**Course flow:** Trace movement and reflection, then follow one target contact through scoring and relocation. Use the ending and restart checks to prepare for the master project.

**Normal:** In \`normal_addition()\`, put one target four steps ahead of the centered player with heading 0. Check that the first timer tick scores a point and relocates that target.

**Hard:** In \`hard_addition()\`, use global declarations to set score to 9 and frames_left to 1. With the Normal target in reach, check that the final tick wins instead of timing out. Move that target out of reach to test timeout, then press R after each result.

**Checkpoints:** Replay restores a zero score and a full countdown with the player at the center. Repeated R presses keep the same movement speed because they reuse the running timer.`
	}
};

function asAssignment(project: (typeof projects)[keyof typeof projects]) {
	return {
		title: project.title,
		content: project.individual,
		contentKind: "assignment" as const,
		preserveInstructions: true,
		projectLink: `${arcadeSource}/${project.folder}/starter`,
		solutionLink: `${arcadeSource}/${project.folder}/solution`
	};
}

export const pythonLevel1ArcadeSupplementalProjects = [
	asAssignment(projects.stars),
	asAssignment(projects.dodgeball)
];

export const pythonLevel1SpaceEaterProject = asAssignment(projects.spaceEater);

export function pythonLevel1ClassroomArcadeContent(title: string) {
	const project = Object.values(projects).find(row => row.title === title);
	return project?.classroom;
}
