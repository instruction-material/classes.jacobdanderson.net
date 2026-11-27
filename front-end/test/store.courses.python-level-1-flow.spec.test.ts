import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it } from "vitest";
import { useCoursesStore } from "@/stores/courses";
import { loadRawCourse } from "@/stores/courses/index";
import { pythonLevel1Course } from "@/stores/courses/python-level-1";

const EXPECTED_TEACHING_MODULES = [
	"First 10 Days: Show, Play, Then Explain",
	"GrS1 Coordinates and Movement",
	"GrS2 Loops",
	"GrS3 Variables and Random Numbers",
	"GrS4 Conditionals Part 1",
	"Check-In #1",
	"GrS5 Loops with Variables",
	"GrS6 Nested Loops Part 1",
	"GrS7 Functions Part 1",
	"GrS8 Event Listeners",
	"Check-In #2",
	"GrS9 Functions Part 2",
	"GrS10 Nested Loops Part 2",
	"GrS11 Conditionals Part 2",
	"GrS12 Lists",
	"GrS13 Game Mechanics",
	"Check-In #3",
	"GrS14 Space Eater",
	"GrS15 Master Project"
];

function requireSourceModule(title: string) {
	const module = pythonLevel1Course.modules.find(
		candidate => candidate.title === title
	);
	if (!module) throw new Error(`Expected Python Level 1 module ${title}.`);
	return module;
}

describe("python Level 1 learner flow", () => {
	beforeEach(() => {
		setActivePinia(createPinia());
	});

	it("keeps the authored teaching sequence without the media backlog", () => {
		expect(pythonLevel1Course.modules.map(module => module.title)).toEqual(
			EXPECTED_TEACHING_MODULES
		);
		expect(
			pythonLevel1Course.modules.some(
				module => module.title === "Pending Demo Media"
			)
		).toBe(false);
	});

	it("opens each Lists project with the source assigned to its edition", async () => {
		const examples = [
			["List Exploration", "GrS12-List-Exploration", "5 and True"],
			["Which Way Turtles", "GrS12-Which-Way-Turtles", "ten position reports"],
			["Random Number Lists", "GrS12-Random-Number-Lists", "[10, 14, 20]"]
		] as const;
		for (const id of ["python-level-1", "python-level-1-classroom"]) {
			const course = await loadRawCourse(id);
			const module = course?.modules.find(row => row.title === "GrS12 Lists");
			expect(module?.curriculum[0]?.content, id).toContain(
				id.endsWith("-classroom") ? "later_headings.append" : "colors.append"
			);
			for (const [title, folder, normalExample] of examples) {
				const item = module?.curriculum.find(row => row.title.endsWith(title));
				expect(item?.learningPath, title).toBe("core");
				expect(item?.contentKind, title).toBe("assignment");
				expect(item?.solutionLink, title).toMatch(
					new RegExp(`/tree/[a-f0-9]{40}/${folder}/solution$`)
				);
				if (id.endsWith("-classroom")) {
					const query = new URLSearchParams(item?.projectLink?.split("?")[1]);
					expect(query.get("mode")).toBe("turtle");
					expect(query.get("classroomSource")).toMatch(
						new RegExp(`/tree/[a-f0-9]{40}/${folder}/solution$`)
					);
					expect(item?.content, title).toContain(normalExample);
				} else {
					expect(item?.projectLink, title).toMatch(
						new RegExp(`/tree/[a-f0-9]{40}/${folder}/starter$`)
					);
				}
			}
		}
	});

	it("opens the assigned game mechanics source in both editions", async () => {
		const folders = [
			"GrS13-Perpetual-Motion",
			"GrS13-Stay-Inbounds",
			"Python-Level-1-ScreenUpdate",
			"GrS13-Bouncy-Ball-Room",
			"GrS14-Turtle-Collision"
		];
		for (const id of ["python-level-1", "python-level-1-classroom"]) {
			const course = await loadRawCourse(id);
			const module = course?.modules.find(row => row.title === "GrS13 Game Mechanics");
			expect(module?.curriculum.map(item => item.learningPath), id).toEqual(
				folders.map(() => "core")
			);
			for (const [index, folder] of folders.entries()) {
				const item = module?.curriculum[index];
				expect(item?.solutionLink, folder).toMatch(
					new RegExp(`/tree/[a-f0-9]{40}/${folder}/solution$`)
				);
				if (id.endsWith("-classroom")) {
					const query = new URLSearchParams(item?.projectLink?.split("?")[1]);
					expect(query.get("template"), folder).toBe("classroom-project");
					expect(query.get("classroomSource"), folder).toMatch(
						new RegExp(`/tree/[a-f0-9]{40}/${folder}/solution$`)
					);
					expect(item?.content, folder).toContain("**Normal:**");
					expect(item?.content, folder).toContain("**Hard:**");
				} else {
					expect(item?.projectLink, folder).toMatch(
						new RegExp(`/tree/[a-f0-9]{40}/${folder}/starter$`)
					);
				}
			}
		}
	});

	it("keeps the arcade capstone in the core and the transfer games optional", async () => {
		const layouts = [
			{
				moduleTitle: "GrS13 Game Mechanics",
				section: "supplementalProjects",
				index: 0,
				folder: "GrS14-Light-the-Stars",
				checkpoint: "final frame lights the star"
			},
			{
				moduleTitle: "GrS13 Game Mechanics",
				section: "supplementalProjects",
				index: 1,
				folder: "Grs13-Dodgeball",
				checkpoint: "only one life is lost"
			},
			{
				moduleTitle: "GrS14 Space Eater",
				section: "curriculum",
				index: 0,
				folder: "GrS14-Space-Eater",
				checkpoint: "reuse the running timer"
			}
		] as const;
		for (const id of ["python-level-1", "python-level-1-classroom"]) {
			const course = await loadRawCourse(id);
			for (const {
				moduleTitle,
				section,
				index,
				folder,
				checkpoint
			} of layouts) {
				const item = course?.modules.find(
					row => row.title === moduleTitle
				)?.[section][index];
				const solution = new RegExp(
					`/tree/[a-f0-9]{40}/${folder}/solution$`
				);
				expect(item?.learningPath === "core", folder).toBe(
					section === "curriculum"
				);
				expect(item?.solutionLink, folder).toMatch(solution);
				if (id.endsWith("-classroom")) {
					const query = new URLSearchParams(
						item?.projectLink?.split("?")[1]
					);
					expect(query.get("template"), folder).toBe(
						"classroom-project"
					);
					expect(query.get("classroomSource"), folder).toMatch(
						solution
					);
					expect(item?.content, folder).toContain(checkpoint);
				} else {
					expect(item?.projectLink, folder).toMatch(
						new RegExp(`/tree/[a-f0-9]{40}/${folder}/starter$`)
					);
				}
			}
		}
	});

	it("opens working check-in sources and keeps practice under its original ID", async () => {
		const reviews = [
			["Check-in-1", "GrS-Check-in-1-Additional-Practice-Project"],
			[
				"GRS-Check-in-Two-Updated",
				"Check-in-Two-Additional-Practice-ProjectUpdated"
			],
			["GRS-Check-in-Three-Updated", "GrS-Check-in-2-Practice-Project"]
		] as const;
		for (const id of ["python-level-1", "python-level-1-classroom"]) {
			const course = await loadRawCourse(id);
			for (const [index, folders] of reviews.entries()) {
				const number = index + 1;
				const prefix = `python-level-1-check-in-${number}-curriculum-check-in-${number}`;
				const module = course?.modules.find(
					row => row.title === `Check-In #${number}`
				);
				const practice =
					number < 3
						? module?.supplementalProjects
						: module?.curriculum;
				const items = [
					module?.curriculum.find(
						row => row.id === `${prefix}-overview`
					),
					practice?.find(
						row =>
							row.id === `${prefix}-additional-practice-project`
					)
				];
				expect(
					items.map(row => row?.learningPath),
					id
				).toEqual(["core", number < 3 ? "choice" : "core"]);
				for (const [position, folder] of folders.entries()) {
					const item = items[position];
					const reference = new RegExp(
						`/tree/[a-f0-9]{40}/${folder}/solution$`
					);
					expect(item?.solutionLink, folder).toMatch(reference);
					if (id.endsWith("-classroom")) {
						const query = new URLSearchParams(
							item?.projectLink?.split("?")[1]
						);
						expect(query.get("classroomSource"), folder).toMatch(
							reference
						);
						expect(item?.content, folder).toContain("**Normal:**");
						expect(item?.content, folder).toContain("**Hard:**");
					} else {
						expect(item?.projectLink, folder).toMatch(
							new RegExp(`/tree/[a-f0-9]{40}/${folder}/starter$`)
						);
					}
				}
			}
		}
	});

	it("gives every teaching module pacing, command targets, and explicit paths", () => {
		for (const module of pythonLevel1Course.modules) {
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

	it("keeps numbered projects core and separates optional check-in practice", () => {
		const requiredCount = pythonLevel1Course.modules.reduce(
			(total, module) => total + module.curriculum.length,
			0
		);
		const choiceAndChallengeCount = pythonLevel1Course.modules.reduce(
			(total, module) => total + module.supplementalProjects.length,
			0
		);

		expect(requiredCount).toBe(65);
		expect(choiceAndChallengeCount).toBe(60);

		const loops = requireSourceModule("GrS2 Loops");
		expect(loops.curriculum.map(item => item.title)).toEqual([
			"GrS2 Project 1: Basic Shapes",
			"GrS2 Project 2: Smiley Face",
			"GrS2 Project 3: Open Ended Project - Drawing with Loops"
		]);
		expect(
			loops.curriculum.find(
				item => item.title === "GrS2 Project 2: Smiley Face"
			)?.learningPath
		).toBe("core");
		expect(
			loops.curriculum.find(
				item =>
					item.title ===
					"GrS2 Project 3: Open Ended Project - Drawing with Loops"
			)?.learningPath
		).toBe("core");
	});

	it("adds validated Turtle input before event-driven game work", () => {
		const variables = requireSourceModule(
			"GrS3 Variables and Random Numbers"
		);
		const inputProject = variables.curriculum.find(
			item =>
				item.title === "GrS3 Guided Project: User Input Shape Designer"
		);

		expect(inputProject?.content).toContain("screen.textinput()");
		expect(inputProject?.content).toContain("screen.numinput()");
		expect(inputProject?.content).toContain("safe default");
		expect(inputProject?.content).toContain("outside the accepted range");
	});

	it("preserves core and supplemental progress IDs when attaching new drawing sources", async () => {
		const course = await useCoursesStore().loadCourseById("python-level-1");
		expect(course).not.toBeNull();

		const loops = course!.modules.find(
			module => module.title === "GrS2 Loops"
		);
		const smiley = loops?.curriculum.find(
			item => item.title === "GrS2 Project 2: Smiley Face"
		);

		expect(smiley?.id).toBe(
			"python-level-1-grs2-loops-curriculum-grs2-project-2-smiley-face"
		);
		expect(smiley?.aliases).toBeUndefined();
		expect(smiley?.projectLink).toMatch(
			/\/tree\/[a-f0-9]{40}\/Smiley-Face\/starter$/
		);
		for (const [title, oldId, folder] of [
			[
				"Compass Badge",
				"5-captain-america-shield",
				"GrS2-Captain-America-Shield"
			],
			["Robot Portrait", "6-minion", "GrS2-Minion"]
		]) {
			const item = loops?.supplementalProjects.find(row =>
				row.title.endsWith(title)
			);
			expect(item?.id, title).toBe(
				`python-level-1-grs2-loops-supplemental-grs2-supplemental-project-${oldId}`
			);
			expect(item?.projectLink, title).toMatch(
				new RegExp(`/tree/[a-f0-9]{40}/${folder}/starter$`)
			);
		}
	});

	it("keeps references and the normalized learner path intact", async () => {
		const course = await loadRawCourse("python-level-1");
		expect(course).not.toBeNull();

		const text = JSON.stringify(course);
		expect(text).toContain("https://trinket.io/docs/colors");
		expect(text).toContain(
			"https://www.w3schools.com/python/python_ref_list.asp"
		);
		expect(
			course!.modules.filter(module => module.kind !== "appendix").length
		).toBe(EXPECTED_TEACHING_MODULES.length);
		for (const module of course!.modules.filter(
			candidate => candidate.kind !== "appendix"
		)) {
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
		}
		expect(text).not.toContain("Pending Python Level 1 Demo Media");
	});
});
