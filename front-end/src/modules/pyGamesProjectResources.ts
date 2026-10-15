import { parseGitHubResource } from "./codePreview";

export const pyGamesSourceRevision = "45b42afa13fd956959a05680fe9847b1a79002cb";
// The later file at the default pin contains an unrelated cryptography exercise.
const sourceFileRevisions: Record<string, string> = {
	"PyG4-Falling-Squares.py": "7d14ecd52342b19dfeb1b76ec5eeb2a568e769b0"
};
export const pyGamesLessonSourceFiles: Record<string, string> = {
	"pyg1 project 1: rainbow fill": "PyG1-Rainbow-Fill.py",
	"pyg1 project 2: bouncing alien": "PyG1-Bouncing-Alien.py",
	"pyg1 project 3: wandering ball": "PyG1-Wandering-Ball.py",
	"pyg2 project 1: arrow point": "PyG2-Arrow-Point.py",
	"pyg2 project 2: apple collector": "PyG2-Apple-Collector.py",
	"pyg2 project 3: art box": "PyG2-Art-Box.py",
	"pyg3 project 1: zrect art": "PyG3-ZRect-Art.py",
	"pyg3 project 2: light control": "PyG3-Light-Control.py",
	"pyg3 project 3: beach ball chase": "PyG3-Beach-Ball-Chase.py",
	"pyg3 supplemental project 1: asteroid dodge": "PyG3-Asteroid-Dodge.py",
	"pyg4 project 1: bouncy ball room": "PyG4-Bouncy-Ball-Room.py",
	"pyg4 project 2: falling squares": "PyG4-Falling-Squares.py",
	"pyg4 project 3: jewel catch": "PyG4-Jewel-Catch.py",
	"pyg5 project 1: keep up": "PyG5-Keep-Up.py",
	"pyg5 project 2: golf": "PyG5-Golf.py",
	"pyg5 project 3: ball pit": "PyG5-Ball-Pit.py",
	"pyg6 project 1: stay on the platform": "PyG6-Stay-on-the-Platform.py",
	"pyg6 project 2: platformer game": "PyG6-Platformer-Game.py",
	"pyg6 project 3: falling jump": "PyG6-Falling-Jump.py",
	"pyg7 project 1: alien catch": "PyG7-Alien-Catch.py",
	"pyg7 project 2: beach ball dodge": "PyG7-Beach-Ball-Dodge.py",
	"pyg7 project 3: number count": "PyG7-Number-Count.py",
	"pyg8 project 1: target shoot": "PyG8-Target-Shoot.py",
	"pyg8 project 2: asteroid shoot": "PyG8-Asteroid-Shoot.py",
	"pyg9 project 1: shark chase (fish bowl)": "PyG9-Shark-Chase.py",
	"pyg9 project 2: space battle": "PyG9-Space-Battle.py",
	"pyg10 project 1: ninja versus alien": "PyG10-Ninja-Versus-Alien.py",
	"pyg11 project 1: space invaders": "PyG11-Space-Invaders.py",
	"pyg12 project 1: master project": "PyG12-Master-Project.py"
};
const versionedActivities = new Set([
	"pygames-pyg0-setup-editors-and-asset-workflow-supplemental-transfer-practice-setup-editors-and-asset-workflow",
	"pygames-pyg0-setup-editors-and-asset-workflow-supplemental-setup-editors-and-asset-workflow-extension-practice",
	"pygames-images-and-sprites-practice-studio-supplemental-images-and-sprites-transfer-practice",
	"pygames-images-and-sprites-practice-studio-supplemental-images-and-sprites-extension-practice",
	"pygames-pyg1-object-oriented-programming-actors-supplemental-object-oriented-programming-actors-transfer-practice",
	"pygames-pyg1-object-oriented-programming-actors-supplemental-object-oriented-programming-actors-extension-practice",
	"pygames-pyg2-event-handling-supplemental-event-handling-transfer-practice",
	"pygames-pyg2-event-handling-supplemental-event-handling-extension-practice",
	"pygames-pyg3-object-oriented-programming-advanced-actors-supplemental-object-oriented-programming-advanced-actors-transfer-practice",
	"pygames-pyg3-object-oriented-programming-advanced-actors-supplemental-object-oriented-programming-advanced-actors-extension-practice",
	"pygames-pyg4-managing-multiple-objects-collectibles-supplemental-managing-multiple-objects-collectibles-transfer-practice",
	"pygames-pyg4-managing-multiple-objects-collectibles-supplemental-managing-multiple-objects-collectibles-extension-practice",
	"pygames-check-in-1-actors-events-zrects-collectibles-supplemental-check-in-1-actors-events-zrects-collectibles-transfer-practice",
	"pygames-check-in-1-actors-events-zrects-collectibles-supplemental-check-in-1-actors-events-zrects-collectibles-extension-practice",
	"pygames-pyg5-physics-supplemental-physics-transfer-practice",
	"pygames-pyg5-physics-supplemental-physics-extension-practice",
	"pygames-pyg6-managing-multiple-objects-obstacles-and-surfaces-supplemental-managing-multiple-objects-obstacles-and-surfaces-transfer-practice",
	"pygames-pyg6-managing-multiple-objects-obstacles-and-surfaces-supplemental-managing-multiple-objects-obstacles-and-surfaces-extension-practice",
	"pygames-check-in-2-gravity-friction-platforms-supplemental-check-in-2-gravity-friction-platforms-transfer-practice",
	"pygames-check-in-2-gravity-friction-platforms-supplemental-check-in-2-gravity-friction-platforms-extension-practice",
	"pygames-pyg7-levels-and-system-control-supplemental-levels-and-system-control-transfer-practice",
	"pygames-pyg7-levels-and-system-control-supplemental-levels-and-system-control-extension-practice",
	"pygames-pyg8-game-elements-projectiles-supplemental-game-elements-projectiles-transfer-practice",
	"pygames-pyg8-game-elements-projectiles-supplemental-game-elements-projectiles-extension-practice",
	"pygames-pyg9-game-elements-enemy-ai-supplemental-game-elements-enemy-ai-transfer-practice",
	"pygames-pyg9-game-elements-enemy-ai-supplemental-game-elements-enemy-ai-extension-practice",
	"pygames-check-in-3-system-control-projectiles-enemy-ai-supplemental-check-in-3-system-control-projectiles-enemy-ai-transfer-practice",
	"pygames-check-in-3-system-control-projectiles-enemy-ai-supplemental-check-in-3-system-control-projectiles-enemy-ai-extension-practice",
	"pygames-pyg10-ninja-versus-alien-supplemental-ninja-versus-alien-transfer-practice",
	"pygames-pyg10-ninja-versus-alien-supplemental-ninja-versus-alien-extension-practice",
	"pygames-pyg11-space-invaders-supplemental-space-invaders-transfer-practice",
	"pygames-pyg11-space-invaders-supplemental-space-invaders-extension-practice",
	"pygames-pyg12-master-project-supplemental-master-project-transfer-practice",
	"pygames-pyg12-master-project-supplemental-master-project-extension-practice",
	"pygames-pyg0-setup-editors-and-asset-workflow-curriculum-pyg0-setup-editors-and-asset-workflow-core-project",
	"pygames-pyg0-setup-editors-and-asset-workflow-supplemental-pyg0-setup-editors-and-asset-workflow-extension-challenge",
	"pygames-images-and-sprites-practice-studio-curriculum-images-and-sprites-core-project",
	"pygames-images-and-sprites-practice-studio-supplemental-images-and-sprites-extension-challenge",
	"pygames-pyg12-master-project-curriculum-pyg12-master-project-core-project",
	"pygames-pyg12-master-project-supplemental-pyg12-master-project-extension-challenge"
]);
const sharedActivities: Record<string, string> = {
	"pygames-pyg0-setup-editors-and-asset-workflow-supplemental-pyg0-setup-editors-and-asset-workflow-extension-challenge":
		"pygames-pyg0-setup-editors-and-asset-workflow-curriculum-pyg0-setup-editors-and-asset-workflow-core-project",
	"pygames-images-and-sprites-practice-studio-supplemental-images-and-sprites-extension-challenge":
		"pygames-images-and-sprites-practice-studio-curriculum-images-and-sprites-core-project",
	"pygames-pyg12-master-project-supplemental-pyg12-master-project-extension-challenge":
		"pygames-pyg12-master-project-curriculum-pyg12-master-project-core-project",
	"pygames-pyg12-master-project-curriculum-pyg12-project-1-master-project":
		"pygames-pyg12-master-project-curriculum-pyg12-master-project-core-project"
};
const classroomSharedActivities: Record<string, string> = {
	"pygames-pyg1-object-oriented-programming-actors-curriculum-pyg1-project-2-bouncing-alien":
		"pygames-classroom-classroom-launch-play-extend-explain-curriculum-launch-project-1-bouncing-alien",
	"pygames-pyg2-event-handling-curriculum-pyg2-project-2-apple-collector":
		"pygames-classroom-classroom-launch-play-extend-explain-curriculum-launch-project-2-apple-collector",
	"pygames-pyg3-object-oriented-programming-advanced-actors-supplemental-pyg3-supplemental-project-1-asteroid-dodge":
		"pygames-classroom-classroom-launch-play-extend-explain-curriculum-launch-project-3-asteroid-dodge",
	"pygames-pyg4-managing-multiple-objects-collectibles-curriculum-pyg4-project-3-jewel-catch":
		"pygames-classroom-classroom-launch-play-extend-explain-curriculum-launch-project-4-jewel-catch",
	"pygames-pyg5-physics-curriculum-pyg5-project-1-keep-up":
		"pygames-classroom-classroom-launch-play-extend-explain-curriculum-launch-project-5-keep-up",
	"pygames-pyg6-managing-multiple-objects-obstacles-and-surfaces-curriculum-pyg6-project-2-platformer-game":
		"pygames-classroom-classroom-launch-play-extend-explain-curriculum-launch-project-6-platformer-game",
	"pygames-pyg7-levels-and-system-control-curriculum-pyg7-project-1-alien-catch":
		"pygames-classroom-classroom-launch-play-extend-explain-curriculum-launch-project-7-alien-catch",
	"pygames-pyg8-game-elements-projectiles-curriculum-pyg8-project-1-target-shoot":
		"pygames-classroom-classroom-launch-play-extend-explain-curriculum-launch-project-8-target-shoot",
	"pygames-pyg9-game-elements-enemy-ai-curriculum-pyg9-project-2-space-battle":
		"pygames-classroom-classroom-launch-play-extend-explain-curriculum-launch-project-9-space-battle",
	"pygames-pyg11-space-invaders-curriculum-pyg11-project-1-space-invaders":
		"pygames-classroom-classroom-launch-play-extend-explain-curriculum-launch-project-10-space-invaders"
};
const sourceFiles = new Set([
	"Check-in-1-Additional-Practice-Solution.py",
	"Check-in-1-Solution.py",
	"Check-in-2-Additional-Practice-Solution.py",
	"Check-in-2-Solution.py",
	"Check-in-2-Starter.py",
	"Check-in-3-Solution.py",
	"Check-in-3-Starter.py",
	"Check_in_3_Additional_Practice_Solution.py",
	"PyG0-Template.py",
	"PyG1-Bouncing-Alien.py",
	"PyG1-Rainbow-Fill.py",
	"PyG1-Wandering-Ball.py",
	"PyG10-Ninja-Versus-Alien.py",
	"PyG11-Space-Invaders.py",
	"PyG12-Master-Project.py",
	"PyG2-100-Meter-Dash.py",
	"PyG2-Apple-Collector.py",
	"PyG2-Arrow-Point.py",
	"PyG2-Art-Box.py",
	"PyG2-Odd-Square-Out.py",
	"PyG3-Asteroid-Dodge.py",
	"PyG3-Beach-Ball-Chase.py",
	"PyG3-Colliderect.py",
	"PyG3-Dynamic-Attributes.py",
	"PyG3-Light-Control.py",
	"PyG3-ZRect-Art.py",
	"PyG4-Bouncy-Ball-Room.py",
	"PyG4-Falling-Squares.py",
	"PyG4-Jewel-Catch.py",
	"PyG5-Ball-Pit.py",
	"PyG5-Golf.py",
	"PyG5-Gravity.py",
	"PyG5-Keep-Up.py",
	"PyG6-Falling-Jump.py",
	"PyG6-Multiple-Platforms.py",
	"PyG6-Platform.py",
	"PyG6-Platformer-Game.py",
	"PyG6-Stay-on-the-Platform.py",
	"PyG7-Alien-Catch.py",
	"PyG7-Beach-Ball-Dodge.py",
	"PyG7-Diamond-Chase.py",
	"PyG7-Number-Count.py",
	"PyG8-Asteroid-Shoot.py",
	"PyG8-Target-Shoot.py",
	"PyG9-Shark-Chase.py",
	"PyG9-Space-Battle.py"
]);

export function pyGamesPinnedSourceUrl(file: string) {
	const revision = sourceFileRevisions[file] ?? pyGamesSourceRevision;
	return `https://github.com/instruction-material/PyGames/blob/${revision}/${file}`;
}

export function pyGamesPinnedResourceUrl(url: string) {
	const resource = parseGitHubResource(url);
	if (
		!resource ||
		resource.owner.toLowerCase() !== "instruction-material" ||
		resource.repo.toLowerCase() !== "pygames" ||
		(resource.ref !== "main" &&
			resource.ref !== pyGamesSourceRevision &&
			resource.ref !== sourceFileRevisions[resource.path]) ||
		!sourceFiles.has(resource.path)
	) {
		return url;
	}
	return pyGamesPinnedSourceUrl(resource.path);
}

export function isPyGamesPinnedSourceUrl(url: string) {
	const resource = parseGitHubResource(url);
	return (
		!!resource &&
		sourceFiles.has(resource.path) &&
		url === pyGamesPinnedSourceUrl(resource.path)
	);
}

export function pyGamesCourseProjectKey(
	courseID: string,
	itemID: string,
	role: "starter" | "reference",
	_url?: string
) {
	const shared =
		sharedActivities[itemID] ??
		(courseID === "pygames-classroom"
			? classroomSharedActivities[itemID]
			: undefined) ??
		itemID;
	const version =
		versionedActivities.has(itemID) || versionedActivities.has(shared)
			? ":juni-pygames"
			: "";
	return `${courseID}:${shared}:${role}${version}`;
}
