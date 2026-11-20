import type { RawCourse, RawCourseModuleItem } from "./types";
import {
	copyClassroomCourseModules,
	createClassroomLaunchModule
} from "./classroom-course";
import { pyGamesCourse } from "./pygames";

const PYGAMES_SOURCE =
	"https://github.com/instruction-material/PyGames/blob/main";

function launchProject(
	title: string,
	content: string,
	sourceFile: string,
	learningPath: "choice" | "challenge"
): RawCourseModuleItem {
	return {
		title,
		content,
		contentKind: "assignment",
		learningPath,
		preserveInstructions: true,
		solutionLink: `${PYGAMES_SOURCE}/${sourceFile}`
	};
}

const classroomLaunchModule = createClassroomLaunchModule({
	courseId: "pygames-classroom",
	title: "Classroom Launch: Play, Extend, Explain",
	estimatedTime: "4–6 sessions · 45–60 minutes each",
	courseFlow:
		"Build Bouncing Alien and Apple Collector together as the shared launch, then continue through later games by system: collections, physics, platforms, levels, projectiles, or enemy behavior. Platformer, Space Battle, and Space Invaders are the harder integrated builds; the remixes remain supplemental practice.",
	keyBlocks: [
		"run the playable framework",
		"Normal section",
		"Hard section",
		"one-system-at-a-time playtest",
		"save, demonstrate, explain"
	],
	coreItems: [
		{
			title: "Classroom Workflow: Play, Normal, Hard",
			content: `Each classroom game begins with a playable program or a substantial completed framework. Run it unchanged, identify the input-update-draw cycle, and name the state that changes on each frame before editing.

Complete the **Normal** section first and save a playable checkpoint. The **Hard** section is independent and may remain empty without breaking the game. Add one system at a time and replay the same test after every change.

The imported normal_addition() and hard_addition() functions run once after setup; they do not run on every frame. Use them for setup changes. Movement, drawing and input changes belong in the existing update(), draw() or event callback. Label each changed block with a Normal or Hard comment so its purpose remains clear. For a shared setting, update the named game variable rather than creating a temporary local value inside an addition function.

During a class share, show the unchanged behavior and the same playtest after the Normal change. Point to the callback or variable that caused the difference.`
		},
		launchProject(
			"Launch Project 1: Bouncing Alien",
			`Run the alien until it reaches a side wall and then the floor or ceiling. In update(), xspeed and yspeed advance its position independently. The side walls reverse xspeed and the top and bottom reverse yspeed. The pop sound marks a bounce.

**Normal:** Change the horizontal speed from five to three pixels per update. Use the new magnitude for the starting xspeed and for both side-wall reversals. Leave the vertical speed at five.

**Hard:** At a side-wall bounce, place the alien's edge back on the boundary before reversing its horizontal velocity. Compare behavior at a corner with both axes moving.

**Success criteria:** Verify one left or right bounce and one top or bottom bounce. At a side wall only xspeed changes sign, and at the floor or ceiling only yspeed changes sign unless the alien also contacts a side. The Normal change persists after the first side-wall bounce.`,
			"PyG1-Bouncing-Alien.py",
			"choice"
		),
		launchProject(
			"Launch Project 2: Apple Collector",
			`The apple starts at the center. Click its image to move it, then click empty space and watch it stay in place. on_mouse_down() uses collidepoint() to decide which click reached the apple. The original game draws the apple and supplies the hit behavior.

**Normal:** Start a score at zero, add one inside the hit branch, and draw the score alongside the apple. Put the display in draw() so it stays visible after the next frame.

**Hard:** Change the relocation range so the entire apple stays inside the window. Calculate the minimum and maximum center coordinates from the sprite's width and height.

**Success criteria:** Compare a hit, a miss, and a second hit at the new location. The three scores are 1, 1, and 2. For Hard, test the allowed extremes on both axes and check the apple's visible edges.`,
			"PyG2-Apple-Collector.py",
			"choice"
		),
		launchProject(
			"Launch Project 3: Asteroid Dodge",
			`Use the left and right arrows to move the rocket. Its display starts at three lives. Each rock that reaches the bottom is recycled. A collision also sends that rock back to the top and removes a life.

**Normal:** Change the base fall speed in moveRocks() while keeping the difference in speed between the three rocks. Observe one rock that passes beside the rocket and one that hits it.

**Hard:** Add a restart key for the game-over screen. Restore three lives, return the rocket to its opening position, and reset each rock's position. Use the same rock objects for the new round.

**Success criteria:** A rock that passes the rocket leaves the lives count unchanged. A hit removes one life and recycles that rock. At zero lives the game-over message appears. If Hard is complete, check that the restart gives the player a fresh round with three lives.`,
			"PyG3-Asteroid-Dodge.py",
			"choice"
		),
		launchProject(
			"Launch Project 4: Jewel Catch",
			`Move the ship with the arrow keys. The same update loop visits each gem and each bomb. A caught gem adds five points, a bomb hit subtracts ten, and an object that passes the bottom returns to the top.

**Normal:** Give gems a distinct score effect, such as adding six points instead of five. Update checkGemCollision() and keep checkBombCollision() in charge of the bomb penalty.

**Hard:** Use the score to select a normal or faster falling speed. Use a named threshold and apply the speed through the existing gem and bomb loops.

**Success criteria:** Catch two different gems and compare their score changes. A bomb still subtracts ten and an object that leaves the screen without a collision leaves the score unchanged. Check both sides of the threshold for Hard.`,
			"PyG4-Jewel-Catch.py",
			"choice"
		),
		launchProject(
			"Launch Project 5: Keep Up",
			`Run the ball after the opening pause. In update(), GRAVITY increases the downward velocity each frame. The left and right walls reverse horizontal velocity. A left-click on the ball sets its vertical speed to -3 and adds one point. The original game supplies side-wall bounces.

**Normal:** Compare GRAVITY at 0.1 and 0.2. Start each trial with the ball centered and stationary, then compare its downward distance after the same number of updates.

**Hard:** Add a floor response that returns the ball to its opening position with zero horizontal and vertical speeds. Put the check after position updates.

**Success criteria:** The larger gravity value moves the ball farther down in the same time. A click on empty space leaves the score unchanged and a successful left-click adds one. In Hard, the reset puts the ball back at the center without carrying over momentum.`,
			"PyG5-Keep-Up.py",
			"choice"
		),
		launchProject(
			"Launch Project 6: Platformer Game",
			`Use Left and Right to move and Space to jump while grounded. The alien lands when it touches a platform from above while moving down. The diamond ends the level and falling below the screen returns the alien to its spawn point.

**Normal:** Add one stationary platform between two existing landings. Use an existing platform definition as a model and put the new platform within jumping distance.

**Hard:** Give the new platform a horizontal speed and two travel limits. Check that it stays between those limits and compare landing while it moves left and right.

**Success criteria:** Jump through the underside of the new platform and land on it while descending. Space works again after landing. Check that missed jumps can still return to spawn and the original diamond can still be collected.`,
			"PyG6-Platformer-Game.py",
			"challenge"
		),
		launchProject(
			"Launch Project 7: Alien Catch",
			`Press Enter to start with three lives and zero score. During play, Space attempts a catch. When the alien overlaps the target a catch adds one point. A missed catch or an alien crossing the right edge costs a life. At zero lives the game ends.

**Normal:** Add an end-screen message that reports the final score and tells the player how to start another round. Use draw() and the existing end state.

**Hard:** Add a second difficulty setting. Name its starting speed and apply it each time a new round starts. Hold the hit area and initial lives constant while comparing speeds.

**Success criteria:** Check that the message appears only after the last life is lost and reports the score from that round. Press Enter again and verify score zero and three lives. In Hard, compare the first crossing time for the two speeds.`,
			"PyG7-Alien-Catch.py",
			"choice"
		),
		launchProject(
			"Launch Project 8: Target Shoot",
			`Press Enter to start the timed round. Use the arrow keys to move the character and Space to launch one game projectile. checkTargetCollision() handles a hit, lowers the remaining target count, and resets the projectile for reuse.

**Normal:** Add a brief visible hit message. Trigger it in the target-collision handler and draw it during play. Use the existing target count to confirm when a hit occurred.

**Hard:** Add a moving target with two horizontal bounds. Reverse it at the bound and retain the existing hit and end conditions.

**Success criteria:** Compare one hit with one miss. Only the hit displays the message and changes the target count. The message clears before the next round. When the timer expires, confirm that the time stops changing.`,
			"PyG8-Target-Shoot.py",
			"challenge"
		),
		launchProject(
			"Launch Project 9: Space Battle",
			`Use the arrow keys to move the ship and Space to fire. The two ships track health separately. A hit can reduce just one ship's health, and the game switches to win or lose when a ship reaches zero.

**Normal:** Draw a numeric player-health label from the player's current health. Keep the existing enemy health indicator so the player can tell which ship was hit.

**Hard:** Adjust one existing enemy phase threshold. Verify when the new pattern starts and check that the previous schedule ends during the transition.

**Success criteria:** Check that an enemy hit changes the player's label and a player hit changes the enemy indicator. Reach both win and lose states. Press Enter to restart and verify that both health values return to their opening values and old projectiles are gone.`,
			"PyG9-Space-Battle.py",
			"challenge"
		),
		launchProject(
			"Launch Project 10: Space Invaders",
			`Press Enter to start. Move with Left and Right and launch a game projectile with Space. A hit on an alien adds five points. Shields can block projectiles, and an enemy projectile hit costs a life. The pause screen offers Continue and Restart.

**Normal:** Add a separate hit count that increases only when an alien is removed. Show it beside the score and reset it when starting a new round.

**Hard:** Adjust the formation speed when the number of remaining aliens crosses a named threshold. Check that the opening formation speed is restored on restart.

**Success criteria:** Compare a hit on an alien, a hit on a shield, and a miss. Only the alien hit increases the hit count. Check that Continue preserves the count and Restart followed by Enter begins at zero.`,
			"PyG11-Space-Invaders.py",
			"challenge"
		),
		{
			title: "Classroom Playtest and Showcase Routine",
			content: `When a change fails, reproduce it with the same controls and record the state immediately before and after the failure. Check one responsibility at a time: input, update, collision, draw order, score, state transition, or reset.

For a showcase, play the Normal version first and explain the changed function or state variable. Show Hard second only if it remains reliably playable. End with one bug reproduction, one repair, and one next system that can be added without rewriting the framework.`
		}
	],
	supplementalItems: [
		launchProject(
			"Launch Remix: Controls and Feedback",
			`Open the supplied Target Shoot workspace. Press Space when a projectile is ready and again while it is moving. Find the fired flag that prevents both presses from creating new projectiles.

**Normal:** Add a Ready or In flight indicator to the playing scene. Draw the label from the existing flag and keep Space as the launch control.

**Hard:** Add a second launch key that uses the same readiness check. Use a single launch path for both keys so that their behavior stays in sync.

**Success criteria:** Confirm Ready at the start, In flight after launch, and Ready after a hit or reset. An extra press while a projectile is moving leaves the player with the same projectile.`,
			"PyG8-Target-Shoot.py",
			"choice"
		),
		launchProject(
			"Launch Remix: Difficulty and Replay",
			`Open the supplied Alien Catch workspace and time the alien from the left edge to the right edge. Press Enter from the end screen to start a new round, then repeat the timing.

**Normal:** Use a named starting speed in the Enter branch. Set the alien back to the left edge when restarting and compare two fresh rounds.

**Hard:** Increase the speed once after the third successful catch. Use a threshold check and return the speed to its starting value when the next round begins.

**Success criteria:** Record the opening position, three lives, and zero score for each round. The two opening crossings take the same time at the same update rate. After the Hard threshold, the next crossing is faster and a fresh round restores the original pace.`,
			"PyG7-Alien-Catch.py",
			"challenge"
		)
	]
});

export const pyGamesClassroomCourse: RawCourse = {
	name: "PyGames: Classroom Edition",
	modules: [
		classroomLaunchModule,
		...copyClassroomCourseModules(pyGamesCourse.modules)
	]
};
