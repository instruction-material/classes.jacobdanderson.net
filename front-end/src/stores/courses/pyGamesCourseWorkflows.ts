import type { RawCourse, RawCourseModule, RawCourseModuleItem } from "./types";
import {
	isPyGamesPinnedSourceUrl,
	pyGamesCourseProjectKey,
	pyGamesLessonSourceFiles,
	pyGamesPinnedResourceUrl,
	pyGamesPinnedSourceUrl,
	pyGamesSourceRevision
} from "../../modules/pyGamesProjectResources";

export const pyGamesPracticeActivities: Record<
	string,
	{
		file: string;
		topic: string;
		task: string;
		checks: string;
		challenge: boolean;
	}
> = {
	"pygames-pyg0-setup-editors-and-asset-workflow-supplemental-transfer-practice-setup-editors-and-asset-workflow":
		{
			file: "PyG1-Rainbow-Fill.py",
			topic: "Setup and asset workflow",
			task: "Move a copy of the visual program into a fresh project folder, change one named color or window value, save it, close it and reproduce the same result after reopening.",
			checks: "Compare the original and changed frame. Explain the file selected by Run, where the saved source lives, and how the traceback identifies the failing line.",
			challenge: false
		},
	"pygames-pyg0-setup-editors-and-asset-workflow-supplemental-setup-editors-and-asset-workflow-extension-practice":
		{
			file: "PyG1-Rainbow-Fill.py",
			topic: "Setup and asset workflow",
			task: "Make one deliberate misspelling in a name used by draw(), record the traceback and repair it. Then document a fresh-start run from the exported project.",
			checks: "Compare the original and changed frame. Explain the file selected by Run, where the saved source lives, and how the traceback identifies the failing line.",
			challenge: true
		},
	"pygames-images-and-sprites-practice-studio-supplemental-images-and-sprites-transfer-practice":
		{
			file: "PyG1-Bouncing-Alien.py",
			topic: "Image names and sprite geometry",
			task: "Swap the actor to a second image from the asset library while preserving its center. Record how the image dimensions change its bounds.",
			checks: "Test the original image, the replacement, a missing image name and an edge placement. Explain filename, image name, center and bounds as distinct values.",
			challenge: false
		},
	"pygames-images-and-sprites-practice-studio-supplemental-images-and-sprites-extension-practice":
		{
			file: "PyG1-Bouncing-Alien.py",
			topic: "Image names and sprite geometry",
			task: "Compare two image sizes at every window edge. Adapt the placement or boundary rule so the complete sprite remains visible after the swap.",
			checks: "Test the original image, the replacement, a missing image name and an edge placement. Explain filename, image name, center and bounds as distinct values.",
			challenge: true
		},
	"pygames-pyg1-object-oriented-programming-actors-supplemental-object-oriented-programming-actors-transfer-practice":
		{
			file: "PyG1-Bouncing-Alien.py",
			topic: "Actor movement",
			task: "Give the alien independent horizontal and vertical speed values. Change the window proportions and keep both opposite-edge reversals correct.",
			checks: "Test each wall, a corner and unequal speeds. A change to one actor must leave the other actor\u2019s motion independent.",
			challenge: false
		},
	"pygames-pyg1-object-oriented-programming-actors-supplemental-object-oriented-programming-actors-extension-practice":
		{
			file: "PyG1-Bouncing-Alien.py",
			topic: "Actor movement",
			task: "Add a second actor with its own position and speed. Keep both actors bounded and make restarting restore their original states.",
			checks: "Test each wall, a corner and unequal speeds. A change to one actor must leave the other actor\u2019s motion independent.",
			challenge: true
		},
	"pygames-pyg2-event-handling-supplemental-event-handling-transfer-practice":
		{
			file: "PyG2-Apple-Collector.py",
			topic: "Input events",
			task: "Add visible hit and miss counters. A click on the apple moves it once and changes hits; a click elsewhere changes only misses.",
			checks: "Test target-center, target-edge and outside clicks, followed by restart. Compare event position with the target position used for that event.",
			challenge: false
		},
	"pygames-pyg2-event-handling-supplemental-event-handling-extension-practice":
		{
			file: "PyG2-Apple-Collector.py",
			topic: "Input events",
			task: "Add a keyboard restart event that restores counters and a predictable target position. Repeated restart presses preserve the same initial state.",
			checks: "Test target-center, target-edge and outside clicks, followed by restart. Compare event position with the target position used for that event.",
			challenge: true
		},
	"pygames-pyg3-object-oriented-programming-advanced-actors-supplemental-object-oriented-programming-advanced-actors-transfer-practice":
		{
			file: "PyG3-Beach-Ball-Chase.py",
			topic: "Actor geometry and collision",
			task: "Display each actor\u2019s bounds and count a contact only when the pair first begins overlapping. Separate them before counting another contact.",
			checks: "Test separated actors, first contact, sustained overlap and contact after separation. Explain why a per-frame overlap test differs from a contact event.",
			challenge: false
		},
	"pygames-pyg3-object-oriented-programming-advanced-actors-supplemental-object-oriented-programming-advanced-actors-extension-practice":
		{
			file: "PyG3-Beach-Ball-Chase.py",
			topic: "Actor geometry and collision",
			task: "Add a short recovery state after a collision. Keep movement responsive while preventing repeated collision consequences during recovery.",
			checks: "Test separated actors, first contact, sustained overlap and contact after separation. Explain why a per-frame overlap test differs from a contact event.",
			challenge: true
		},
	"pygames-pyg4-managing-multiple-objects-collectibles-supplemental-managing-multiple-objects-collectibles-transfer-practice":
		{
			file: "PyG4-Jewel-Catch.py",
			topic: "Object collections",
			task: "Change the rewards for positive and negative collectibles using named values. Keep collection and removal tied to the object actually touched.",
			checks: "Test no contact, one positive object, one negative object and two simultaneous contacts. Inspect both score changes and the remaining collection.",
			challenge: false
		},
	"pygames-pyg4-managing-multiple-objects-collectibles-supplemental-managing-multiple-objects-collectibles-extension-practice":
		{
			file: "PyG4-Jewel-Catch.py",
			topic: "Object collections",
			task: "Handle two collectibles touched during the same update without skipping a remaining object or awarding the same object twice.",
			checks: "Test no contact, one positive object, one negative object and two simultaneous contacts. Inspect both score changes and the remaining collection.",
			challenge: true
		},
	"pygames-check-in-1-actors-events-zrects-collectibles-supplemental-check-in-1-actors-events-zrects-collectibles-transfer-practice":
		{
			file: "Check-in-1-Additional-Practice-Solution.py",
			topic: "Actors and events checkpoint",
			task: "Explain the model\u2019s event-to-state-to-draw path, then add one visible counter that changes only for its intended interaction.",
			checks: "Write a before/after state table for each interaction, a missed interaction and a repeated interaction. Use the actual model\u2019s controls.",
			challenge: false
		},
	"pygames-check-in-1-actors-events-zrects-collectibles-supplemental-check-in-1-actors-events-zrects-collectibles-extension-practice":
		{
			file: "Check-in-1-Additional-Practice-Solution.py",
			topic: "Actors and events checkpoint",
			task: "Add a second interaction with separate state. Verify that the original interaction still changes only its own counter.",
			checks: "Write a before/after state table for each interaction, a missed interaction and a repeated interaction. Use the actual model\u2019s controls.",
			challenge: true
		},
	"pygames-pyg5-physics-supplemental-physics-transfer-practice": {
		file: "PyG5-Keep-Up.py",
		topic: "Gravity and rebound",
		task: "Compare two named gravity or rebound settings using the same starting state and click sequence. Record the resulting height or airtime.",
		checks: "Test upward travel, falling, the relevant boundary and restart. Separate acceleration from velocity and record the units used by the frame update.",
		challenge: false
	},
	"pygames-pyg5-physics-supplemental-physics-extension-practice": {
		file: "PyG5-Keep-Up.py",
		topic: "Gravity and rebound",
		task: "Add a bounded difficulty increase while retaining a usable starting state and a complete reset of motion and difficulty.",
		checks: "Test upward travel, falling, the relevant boundary and restart. Separate acceleration from velocity and record the units used by the frame update.",
		challenge: true
	},
	"pygames-pyg6-managing-multiple-objects-obstacles-and-surfaces-supplemental-managing-multiple-objects-obstacles-and-surfaces-transfer-practice":
		{
			file: "PyG6-Platformer-Game.py",
			topic: "Surfaces and landing",
			task: "Change one platform\u2019s position or width and verify walking, jumping, landing and falling past it without changing unrelated controls.",
			checks: "Test a normal landing, platform edge, approach from below and a missed platform. Inspect the actor\u2019s velocity and grounded state after each case.",
			challenge: false
		},
	"pygames-pyg6-managing-multiple-objects-obstacles-and-surfaces-supplemental-managing-multiple-objects-obstacles-and-surfaces-extension-practice":
		{
			file: "PyG6-Platformer-Game.py",
			topic: "Surfaces and landing",
			task: "Add a one-way platform: landing from above is allowed while travel from below passes through. Use the previous and next actor positions to explain each decision.",
			checks: "Test a normal landing, platform edge, approach from below and a missed platform. Inspect the actor\u2019s velocity and grounded state after each case.",
			challenge: true
		},
	"pygames-check-in-2-gravity-friction-platforms-supplemental-check-in-2-gravity-friction-platforms-transfer-practice":
		{
			file: "Check-in-2-Additional-Practice-Solution.py",
			topic: "Motion checkpoint",
			task: "Trace one complete movement and collision cycle in the supplied model. Change one motion value and predict the next observed collision before running.",
			checks: "Keep a normal run, a boundary run and the corrected run. Explain the update order and the condition that separates collision from continued motion.",
			challenge: false
		},
	"pygames-check-in-2-gravity-friction-platforms-supplemental-check-in-2-gravity-friction-platforms-extension-practice":
		{
			file: "Check-in-2-Additional-Practice-Solution.py",
			topic: "Motion checkpoint",
			task: "Add a debug display for position, velocity and contact state, then use it to diagnose one deliberately introduced collision error.",
			checks: "Keep a normal run, a boundary run and the corrected run. Explain the update order and the condition that separates collision from continued motion.",
			challenge: true
		},
	"pygames-pyg7-levels-and-system-control-supplemental-levels-and-system-control-transfer-practice":
		{
			file: "PyG7-Alien-Catch.py",
			topic: "Game states and levels",
			task: "Change one level threshold and keep score, objects and the active state consistent across the transition.",
			checks: "Test just before, at and after the threshold, then pause, resume and restart. Draw the permitted state transitions before editing.",
			challenge: false
		},
	"pygames-pyg7-levels-and-system-control-supplemental-levels-and-system-control-extension-practice":
		{
			file: "PyG7-Alien-Catch.py",
			topic: "Game states and levels",
			task: "Add a pause state that freezes gameplay updates while allowing a resume event. Restart must return to the original playable state.",
			checks: "Test just before, at and after the threshold, then pause, resume and restart. Draw the permitted state transitions before editing.",
			challenge: true
		},
	"pygames-pyg8-game-elements-projectiles-supplemental-game-elements-projectiles-transfer-practice":
		{
			file: "PyG8-Asteroid-Shoot.py",
			topic: "Projectile lifecycles",
			task: "Add a named upper bound on live projectiles and visible feedback when that limit is reached. Remove expired projectiles so firing becomes available again.",
			checks: "Test a hit, a miss, offscreen travel, repeated firing and two overlapping targets. Record projectile and target counts before and after each update.",
			challenge: false
		},
	"pygames-pyg8-game-elements-projectiles-supplemental-game-elements-projectiles-extension-practice":
		{
			file: "PyG8-Asteroid-Shoot.py",
			topic: "Projectile lifecycles",
			task: "Handle a projectile that overlaps two targets during one update using one documented collision policy. Apply each projectile\u2019s removal and score consequence once.",
			checks: "Test a hit, a miss, offscreen travel, repeated firing and two overlapping targets. Record projectile and target counts before and after each update.",
			challenge: true
		},
	"pygames-pyg9-game-elements-enemy-ai-supplemental-game-elements-enemy-ai-transfer-practice":
		{
			file: "PyG9-Shark-Chase.py",
			topic: "Enemy decisions",
			task: "Define a named detection distance and make the enemy chase only while the player is within it. Show the current enemy state.",
			checks: "Test outside, exactly at and inside the detection boundary, then entering and leaving the added state. Explain the input used by each decision.",
			challenge: false
		},
	"pygames-pyg9-game-elements-enemy-ai-supplemental-game-elements-enemy-ai-extension-practice":
		{
			file: "PyG9-Shark-Chase.py",
			topic: "Enemy decisions",
			task: "Add a retreat or recovery state with a clear entry and exit condition. Give that state a visible behavior distinct from chasing.",
			checks: "Test outside, exactly at and inside the detection boundary, then entering and leaving the added state. Explain the input used by each decision.",
			challenge: true
		},
	"pygames-check-in-3-system-control-projectiles-enemy-ai-supplemental-check-in-3-system-control-projectiles-enemy-ai-transfer-practice":
		{
			file: "Check_in_3_Additional_Practice_Solution.py",
			topic: "State and projectile checkpoint",
			task: "Trace one input through the model\u2019s update, interaction result and displayed feedback. Add a debug display for the state and active-object counts involved.",
			checks: "Test normal play, the end condition and two consecutive restarts. Compare the initial and restarted object counts and state values.",
			challenge: false
		},
	"pygames-check-in-3-system-control-projectiles-enemy-ai-supplemental-check-in-3-system-control-projectiles-enemy-ai-extension-practice":
		{
			file: "Check_in_3_Additional_Practice_Solution.py",
			topic: "State and projectile checkpoint",
			task: "Create a complete restart path after the model\u2019s end condition. Remove stale moving objects and timers before the new run begins.",
			checks: "Test normal play, the end condition and two consecutive restarts. Compare the initial and restarted object counts and state values.",
			challenge: true
		},
	"pygames-pyg10-ninja-versus-alien-supplemental-ninja-versus-alien-transfer-practice":
		{
			file: "PyG10-Ninja-Versus-Alien.py",
			topic: "Integrated action game",
			task: "Change one enemy or player mechanic behind a named configuration value. Keep controls, collisions, feedback and replay working as a complete slice.",
			checks: "Test each phase, a missed attack, a successful attack, defeat and restart. Present the smallest function or state change that implements the new mechanic.",
			challenge: false
		},
	"pygames-pyg10-ninja-versus-alien-supplemental-ninja-versus-alien-extension-practice":
		{
			file: "PyG10-Ninja-Versus-Alien.py",
			topic: "Integrated action game",
			task: "Add a second enemy phase with an explicit transition. Keep phase-specific objects bounded and clear them on defeat or restart.",
			checks: "Test each phase, a missed attack, a successful attack, defeat and restart. Present the smallest function or state change that implements the new mechanic.",
			challenge: true
		},
	"pygames-pyg11-space-invaders-supplemental-space-invaders-transfer-practice":
		{
			file: "PyG11-Space-Invaders.py",
			topic: "Waves and cleanup",
			task: "Change the formation or wave progression while preserving the original firing and collision rules. Make the next wave\u2019s starting state predictable.",
			checks: "Test the last enemy, the next wave, player defeat and restart. Compare enemy/projectile counts before and after each transition.",
			challenge: false
		},
	"pygames-pyg11-space-invaders-supplemental-space-invaders-extension-practice":
		{
			file: "PyG11-Space-Invaders.py",
			topic: "Waves and cleanup",
			task: "Add one difficulty parameter that changes between waves within a documented bound. Reset it with every new game and prevent projectiles leaking between waves.",
			checks: "Test the last enemy, the next wave, player defeat and restart. Compare enemy/projectile counts before and after each transition.",
			challenge: true
		},
	"pygames-pyg12-master-project-supplemental-master-project-transfer-practice":
		{
			file: "PyG11-Space-Invaders.py",
			topic: "Capstone transfer and recovery",
			task: "Use a completed personal capstone or the supplied game to separate one subsystem into a small helper without changing visible behavior. Compare the same play sequence before and after.",
			checks: "Demonstrate controls, progress, failure or completion and restart. Explain one architecture decision and provide evidence for the repaired failure.",
			challenge: false
		},
	"pygames-pyg12-master-project-supplemental-master-project-extension-practice":
		{
			file: "PyG11-Space-Invaders.py",
			topic: "Capstone transfer and recovery",
			task: "Add one original mechanic with a short acceptance list, then repair a failure found by a different play sequence. Keep a working baseline available for comparison.",
			checks: "Demonstrate controls, progress, failure or completion and restart. Explain one architecture decision and provide evidence for the repaired failure.",
			challenge: true
		}
};
const assetActivities: Record<string, { kind: string; challenge: boolean }> = {
	"pygames-pyg0-setup-editors-and-asset-workflow-curriculum-pyg0-setup-editors-and-asset-workflow-core-project":
		{
			kind: "music",
			challenge: false
		},
	"pygames-pyg0-setup-editors-and-asset-workflow-supplemental-pyg0-setup-editors-and-asset-workflow-extension-challenge":
		{
			kind: "music",
			challenge: true
		},
	"pygames-images-and-sprites-practice-studio-curriculum-images-and-sprites-core-project":
		{
			kind: "images",
			challenge: false
		},
	"pygames-images-and-sprites-practice-studio-supplemental-images-and-sprites-extension-challenge":
		{
			kind: "images",
			challenge: true
		},
	"pygames-pyg12-master-project-curriculum-pyg12-master-project-core-project":
		{
			kind: "sounds",
			challenge: false
		},
	"pygames-pyg12-master-project-supplemental-pyg12-master-project-extension-challenge":
		{
			kind: "sounds",
			challenge: true
		}
};

function workspace(courseID: string, item: RawCourseModuleItem, file?: string) {
	const params = new URLSearchParams({
		course: courseID,
		mode: "pgzero",
		projectKey: pyGamesCourseProjectKey(courseID, item.id!, "starter"),
		starterTitle: item.title,
		starterLabel: courseID.endsWith("-classroom")
			? "Classroom project"
			: "Course project",
		template: courseID.endsWith("-classroom")
			? "classroom-project"
			: "course",
		starter: "course"
	});
	if (file) {
		params.set("starterUrl", pyGamesPinnedSourceUrl(file));
		if (courseID.endsWith("-classroom")) params.set("classroom", "1");
	}
	return `/ide?${params.toString()}`;
}

function originalSource(module: RawCourseModule, item: RawCourseModuleItem) {
	const direct = pyGamesLessonSourceFiles[item.title.toLowerCase()];
	if (direct) return direct;
	const number = module.id?.match(/-check-in-([123])-/)?.[1];
	if (!number) return undefined;
	if (item.id?.includes("additional-practice-project")) {
		return number === "3"
			? "Check_in_3_Additional_Practice_Solution.py"
			: `Check-in-${number}-Additional-Practice-Solution.py`;
	}
	if (
		item.id?.endsWith("-curriculum-check-in-3-system-control") ||
		item.id?.endsWith("-curriculum-check-in-3-projectiles-and-enemy-ai")
	) {
		return "Check-in-3-Solution.py";
	}
	return undefined;
}

const setupReading = `**Goal:** Establish one project that opens, runs, saves and reopens predictably. The following image studio introduces sprite loading.

Create a source file with window constants and a draw callback. Pygame Zero calls draw() to render each frame; screen.fill() paints the window. A visible background distinguishes a running program from an empty file.

~~~python
WIDTH = 640
HEIGHT = 400

def draw():
    screen.fill((30, 40, 70))
~~~

Start the course workspace, enter the example and Run. Change one color value, rerun and compare. Save, close and reopen the same project, then download its ZIP and inspect the source. The site stores source in the project; the selected file and its saved contents determine what runs.

For local use, install Python and Pygame Zero in the chosen editor environment and run pgzrun followed by the source filename from that project folder. Keep images, sounds and music beside the program when those resources are used. The site’s asset library supplies the course media for browser play.

Deliberately misspell screen in the draw callback once. Read the exception name, source filename and line, restore the name and rerun. An independent session records the prediction and observed frame. A paced walkthrough pauses at the first working frame and at the traceback before making the repair.

Completion evidence: the original frame, a changed frame, a repaired traceback, a reopened saved project and its exported source.\n\nPrimary API references: [Pygame Zero built-ins](https://pygame-zero.readthedocs.io/en/stable/builtins.html) and [running in an IDE](https://pygame-zero.readthedocs.io/en/stable/ide-mode.html).`;

const imageReading = `**Goal:** Load an image by name, place its Actor and explain its visible bounds before adding movement.

The images folder contains the artwork. Actor("alien") uses the name alien without the .png extension; the file is images/alien.png. The Actor holds position and image state. Its center, edges and dimensions describe the same rectangle using different measurements. draw() renders it.

~~~python
WIDTH = 640
HEIGHT = 400
actor = Actor("alien")
actor.center = (WIDTH / 2, HEIGHT / 2)

def draw():
    screen.fill((30, 40, 70))
    actor.draw()
~~~

Run the example with the course image library. Record center, width, height and one edge value. Select a second image from the library, change actor.image and restore actor.center. Compare the bounds while keeping the same center. A different-sized image can change its edges without changing the chosen center.

Place the sprite near each window edge and identify when its full rectangle remains visible. Test one misspelled image name, read the failure and restore it. In the supplied classroom model, first locate the Actor construction and draw callback; movement is revisited in the following Actors module.

Save and reopen the project. When exporting a game that uses course images, include its assets through the IDE’s asset/export controls, or place the matching image files in an images folder beside the local program. Verify the exported layout before running pgzrun locally.

Completion evidence: two image names, their dimensions, center-preserving swaps, four edge checks, a repaired missing-image case and a short explanation linking file, Actor and draw callback. The same sequence supports an independent reading or a paced demonstration.\n\nPrimary API reference: [Pygame Zero resources and Actors](https://pygame-zero.readthedocs.io/en/stable/builtins.html).`;

const capstoneReading = `**Goal:** Design and finish one original playable game using the course’s actors, input events, update/draw loop and state management. Reuse earlier work deliberately and credit any supplied model or media.

Write a one-paragraph pitch naming the player action, goal, progress feedback and failure or completion condition. Draw a state diagram containing at least start, play and end states with a restart path. Choose one finishable vertical slice before adding a second mechanic.

Begin with a small window and one controllable actor. Separate input handling, updates and drawing. Add one interaction with an observable consequence, then the score, health or progress needed by the chosen goal. Add a clear end condition and make restart restore actors, collections, timers, score and state. A game may use physics, surfaces, projectiles or enemy behavior when its design calls for them.

Build in checkpoints: controls and drawing; one complete interaction; end and restart; then one original extension. Keep a working saved version after each checkpoint. The classroom workspace supplies an integrated game as an editable starting point; adapt the theme and central mechanic to the pitch. An independent construction can begin with the course scaffold or a copy of a completed personal game.

Create a test table with startup, successful action, missed action, a boundary, completion or defeat, and two consecutive restarts. Record expected and actual results, the state involved and any repair. Check object cleanup and asset filenames. Export and reopen the source and required media to verify that the project travels with its dependencies.

Present a short playthrough, the state diagram, one architecture choice and one repaired failure. Explain the original contribution and any reused system. A paced review follows the same checkpoints; optional polish follows a complete playable slice. There is a range of valid capstone designs, evaluated against the stated pitch and evidence.`;

export function applyPyGamesCourseWorkflows(
	course: RawCourse,
	courseID: string
) {
	if (courseID !== "pygames" && courseID !== "pygames-classroom") return;
	const classroom = courseID === "pygames-classroom";
	for (const module of course.modules) {
		for (const item of [
			...module.curriculum,
			...module.supplementalProjects
		]) {
			if (!item.id) continue;
			const practice = pyGamesPracticeActivities[item.id];
			if (practice) {
				item.projectLink = classroom
					? workspace(courseID, item, practice.file)
					: pyGamesPinnedSourceUrl(practice.file);
				delete item.solutionLink;
				item.ideImport = true;
				item.preserveInstructions = true;
				item.content = `**Goal:** ${practice.topic}. ${practice.task}

**Starting point:** Run the supplied working game unchanged, identify its controls and record one normal interaction. Save an independent copy for this variation. The provided model establishes the game context; evaluate the new behavior against this brief.

**Build sequence:** Locate the event, update, collision or state code involved. Predict one result before editing. Make the smallest coherent change for the chosen variation and rerun the same interaction before adding another change.

${classroom ? `**Normal:** ${practice.challenge ? "Run the supplied model, identify its state and save a working baseline before attempting the selected challenge." : practice.task}\n\n**Hard:** ${practice.challenge ? practice.task : "Choose the separate challenge card after a working Normal checkpoint."}` : `**Required variation:** ${practice.task}`}

**Checks:** ${practice.checks}

**Evidence:** Keep the original observation, changed source, expected/actual test table and one explanation of the state or collection that changed. Save, reopen and export the work with its required assets. The next card or module can continue after a working checkpoint.

**Pacing:** An independent run follows prediction, change, playtest and explanation. A guided session pauses after the prediction and the first changed result. ${classroom ? "Keep a working Normal checkpoint; Hard work is chosen extension practice." : "Choose this optional transfer or challenge when another application of this concept is useful."}

Model source: [Course program](${pyGamesPinnedSourceUrl(practice.file)}).`;
				continue;
			}
			const asset = assetActivities[item.id];
			if (asset) {
				const file =
					asset.kind === "music"
						? "PyG1-Rainbow-Fill.py"
						: asset.kind === "images"
							? "PyG1-Bouncing-Alien.py"
							: "PyG11-Space-Invaders.py";
				item.projectLink = workspace(
					courseID,
					item,
					classroom ? file : undefined
				);
				delete item.solutionLink;
				item.ideImport = true;
				item.preserveInstructions = true;
				item.datasetLink = `https://github.com/instruction-material/PyGames/tree/${pyGamesSourceRevision}/${asset.kind}`;
				item.content = asset.challenge
					? `Continue the matching ${asset.kind === "music" ? "setup" : asset.kind === "images" ? "image studio" : "capstone"} project and keep its working checkpoint. Opening this card continues the same saved attempt.

**${classroom ? "Hard" : "Challenge"}:** ${asset.kind === "music" ? "Reproduce and repair a source-name or resource-path failure after exporting and reopening the project. Record the exact failing filename and the corrected layout." : asset.kind === "images" ? "Change to a differently sized sprite while preserving its chosen center, then verify complete visibility at each window edge. Explain each position or boundary correction." : "Choose one additional mechanic from the capstone pitch, state three acceptance cases and add it without breaking end, restart or cleanup. Preserve a working baseline for comparison."}

**Completion checks:** Reopen the saved core and confirm its controls still work. Repeat the extension check from a fresh run, then describe the specific source or asset change that explains the result. Keep the prediction, changed source, observed result and repaired failure with the core project’s evidence. This is an optional extension of that project.`
					: asset.kind === "music"
						? setupReading
						: asset.kind === "images"
							? imageReading
							: "**Build and verification checkpoint:** Continue the game defined in the Master Project card. This card opens the same saved capstone. Complete controls and drawing, one successful interaction, the end state and a deterministic restart before the original extension. Keep the pitch, state diagram, expected/actual playtest table and exported source/media together. **Completion checks:** Demonstrate two restarts and explain one repaired failure. Record the starting and restored values for score, actors, timers and collections. Confirm that required image and audio files travel with the exported project. The Master Project reading supplies the full independent and paced build sequence.";
				if (classroom) {
					item.content +=
						"\n\n**Normal:** Complete the working core evidence and keep its saved checkpoint.\n\n**Hard:** Choose the matching extension after the Normal checkpoint; keep the baseline available for comparison.";
				}
				continue;
			}
			const file = originalSource(module, item);
			if (!classroom && file) {
				item.projectLink = workspace(courseID, item);
				if (file === "PyG12-Master-Project.py") {
					delete item.solutionLink;
					item.datasetLink = pyGamesPinnedSourceUrl(file);
					item.content = capstoneReading;
					item.preserveInstructions = true;
				} else {
					item.solutionLink = pyGamesPinnedSourceUrl(file);
				}
				item.content +=
					"\n\n**Project workflow:** Start a separate course workspace for this activity and build from the stated prompt. Save a small working checkpoint before the next feature. Record expected and actual normal/boundary behavior, then reopen and export the source with its required assets. The worked source is available in the staff reference after the independent attempt or review checkpoint.";
				continue;
			}
			if (classroom && item.projectLink?.startsWith("/ide?")) {
				const url = new URL(item.projectLink, "https://classes.local");
				const current =
					url.searchParams.get("starterUrl") ??
					(url.searchParams.get("classroomSource")
						? `https://github.com/instruction-material/${url.searchParams.get("classroomSource")}`
						: "");
				const pinned =
					file && file !== "PyG12-Master-Project.py"
						? pyGamesPinnedSourceUrl(file)
						: pyGamesPinnedResourceUrl(current);
				if (
					isPyGamesPinnedSourceUrl(pinned) &&
					pinned.endsWith(".py") &&
					!pinned.endsWith("PyG12-Master-Project.py")
				) {
					url.searchParams.delete("classroomSource");
					url.searchParams.set("starterUrl", pinned);
					url.searchParams.set(
						"projectKey",
						pyGamesCourseProjectKey(courseID, item.id, "starter")
					);
					item.projectLink = `/ide?${url.searchParams.toString()}`;
				} else if (file === "PyG12-Master-Project.py") {
					item.projectLink = workspace(
						courseID,
						item,
						"PyG11-Space-Invaders.py"
					);
					item.content = `${
						capstoneReading
					}\n\n**Normal:** Complete one playable slice with end and restart.\n\n**Hard:** Add the chosen original extension while preserving the Normal checkpoint.`;
					item.preserveInstructions = true;
				}
			}
		}
	}
}
