import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it } from "vitest";
import { useCoursesStore } from "@/stores/courses";
import { loadRawCourse } from "@/stores/courses/index";
import { pyGamesCourse } from "@/stores/courses/pygames";

const EXPECTED_TEACHING_MODULES = [
	"PyG0 Setup, Editors, and Asset Workflow",
	"Images and Sprites: Practice Studio",
	"PyG1 Object-Oriented Programming: Actors",
	"PyG2 Event Handling",
	"PyG3 Object-Oriented Programming: Advanced Actors",
	"PyG4 Managing Multiple Objects: Collectibles",
	"Check-In #1: Actors, Events, ZRects, Collectibles",
	"PyG5 Physics",
	"PyG6 Managing Multiple Objects: Obstacles and Surfaces",
	"Check-In #2: Gravity, Friction, Platforms",
	"PyG7 Levels and System Control",
	"PyG8 Game Elements: Projectiles",
	"PyG9 Game Elements: Enemy AI",
	"Check-In #3: System Control, Projectiles, Enemy AI",
	"PyG10 Ninja Versus Alien",
	"PyG11 Space Invaders",
	"PyG12 Master Project"
];

function requireSourceModule(title: string) {
	const module = pyGamesCourse.modules.find(
		candidate => candidate.title === title
	);
	if (!module) throw new Error(`Expected PyGames module ${title}.`);
	return module;
}

describe("PyGames learner flow", () => {
	beforeEach(() => {
		setActivePinia(createPinia());
	});

	it("moves asset practice before actor work and removes media bookkeeping", () => {
		expect(pyGamesCourse.modules.map(module => module.title)).toEqual(
			EXPECTED_TEACHING_MODULES
		);
		expect(
			pyGamesCourse.modules.some(
				module => module.title === "Demo Media Status"
			)
		).toBe(false);
	});

	it("gives every module pacing, implementation targets, and explicit paths", () => {
		for (const module of pyGamesCourse.modules) {
			expect(module.estimatedTime, module.title).toMatch(/session/);
			expect(
				module.keyBlocks?.length,
				module.title
			).toBeGreaterThanOrEqual(5);
			expect(
				module.curriculum.every(item => item.learningPath === "core"),
				module.title
			).toBe(true);
			expect(
				module.supplementalProjects.every(item =>
					["choice", "challenge"].includes(item.learningPath ?? "")
				),
				module.title
			).toBe(true);
			expect(module.curriculum[0]?.content, module.title).toContain(
				"**Course flow:**"
			);
		}
	});

	it("keeps authored projects core and only supplemental work optional", () => {
		const requiredCount = pyGamesCourse.modules.reduce(
			(total, module) => total + module.curriculum.length,
			0
		);
		const choiceAndChallengeCount = pyGamesCourse.modules.reduce(
			(total, module) => total + module.supplementalProjects.length,
			0
		);

		expect(requiredCount).toBe(82);
		expect(choiceAndChallengeCount).toBe(55);

		const actors = requireSourceModule(
			"PyG1 Object-Oriented Programming: Actors"
		);
		expect(
			actors.curriculum.find(
				item => item.title === "PyG1 Project 2: Bouncing Alien"
			)?.learningPath
		).toBe("core");
		expect(
			actors.curriculum.find(
				item => item.title === "PyG1 Project 1: Rainbow Fill"
			)?.learningPath
		).toBe("core");
		expect(
			actors.curriculum.find(
				item => item.title === "PyG1 Project 3: Wandering Ball"
			)?.learningPath
		).toBe("core");

		for (const checkInTitle of [
			"Check-In #1: Actors, Events, ZRects, Collectibles",
			"Check-In #2: Gravity, Friction, Platforms",
			"Check-In #3: System Control, Projectiles, Enemy AI"
		]) {
			const checkIn = requireSourceModule(checkInTitle);
			expect(
				checkIn.supplementalProjects.find(item =>
					item.title.includes("Additional Practice Project")
				)?.learningPath
			).toBe("choice");
		}
	});

	it("frames integrated projects as incremental playable systems", () => {
		expect(
			requireSourceModule("PyG10 Ninja Versus Alien").curriculum[0]
				?.content
		).toContain("minimum playable loop");
		expect(
			requireSourceModule("PyG11 Space Invaders").curriculum[0]?.content
		).toContain("vertical slices");
		expect(
			requireSourceModule("PyG12 Master Project").curriculum[0]?.content
		).toContain("minimum playable version");
	});

	it("preserves project progress IDs in the core listing", async () => {
		const course = await useCoursesStore().loadCourseById("pygames");
		expect(course).not.toBeNull();

		const actors = course!.modules.find(
			module =>
				module.title === "PyG1 Object-Oriented Programming: Actors"
		);
		const rainbowFill = actors?.curriculum.find(
			item => item.title === "PyG1 Project 1: Rainbow Fill"
		);

		expect(rainbowFill?.id).toBe(
			"pygames-pyg1-object-oriented-programming-actors-curriculum-pyg1-project-1-rainbow-fill"
		);
		expect(rainbowFill?.aliases).toBeUndefined();
	});

	it("keeps hosted media on project cards in the normalized learner path", async () => {
		const course = await loadRawCourse("pygames");
		expect(course).not.toBeNull();

		const items = course!.modules.flatMap(module => [
			...module.curriculum,
			...module.supplementalProjects
		]);
		expect(
			items.find(item => item.title === "PyG1 Project 1: Rainbow Fill")
				?.mediaLink
		).toBe(
			"https://static.classes.jacobdanderson.net/pyg_1_rainbow_fill.mp4"
		);
		expect(
			items.find(item => item.title === "PyG5 Project 2: Golf")?.mediaLink
		).toBe("https://static.classes.jacobdanderson.net/pyg_5_golf.mp4");
		expect(
			items.find(item => item.title === "PyG11 Project 1: Space Invaders")
				?.mediaLink
		).toBe(
			"https://static.classes.jacobdanderson.net/pyg_11_space_invaders.mp4"
		);
		expect(JSON.stringify(course)).not.toContain("Demo Media Status");
	});
});
