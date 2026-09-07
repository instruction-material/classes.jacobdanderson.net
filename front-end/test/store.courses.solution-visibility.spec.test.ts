import type { CourseDefinition } from "@/stores/courses";
import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it } from "vitest";
import { useAppStore } from "@/stores/app";
import { useCoursesStore } from "@/stores/courses";
import { courseCatalog } from "@/stores/courses/index";

const SOLUTION_PATH_RE =
	/(?:^|\/)solutions?(?:\/|$)|(?:^|[-_])solutions?(?:[-_]|$)/i;
const COURSE_SWEEP_TIMEOUT = 180000;
const SCRATCH_EMBED_RE = /^https:\/\/scratch\.mit\.edu\/projects\/\d+\/embed$/;
const UNUSABLE_SCRATCH_SOLUTION_IDS = new Set([
	"294540150",
	"294541979",
	"302866259",
	"302864606",
	"302865093",
	"302865707",
	"302865909",
	"313184786",
	"330287678",
	"330288612",
	"330289893",
	"330290622",
	"330291357",
	"330316142",
	"330316808"
]);
const UNUSABLE_SCRATCH_STARTER_IDS = new Set([
	"295333590",
	"295335247",
	"302996579",
	"302996964",
	"302997680",
	"302998723",
	"302999957",
	"330290958",
	"330291711",
	"330293454",
	"330294193",
	"330294909",
	"330320360",
	"330321409",
	"468227197"
]);

function courseLinks(course: CourseDefinition) {
	return course.modules.flatMap(module =>
		[...module.curriculum, ...module.supplementalProjects].flatMap(item => [
			item.projectLink,
			item.solutionLink
		])
	);
}

function courseSolutionLinks(course: CourseDefinition) {
	return course.modules.flatMap(module =>
		[...module.curriculum, ...module.supplementalProjects]
			.map(item => item.solutionLink)
			.filter((link): link is string => Boolean(link))
	);
}

function coursePlayableSolutionEmbeds(course: CourseDefinition) {
	return course.modules.flatMap(module =>
		[...module.curriculum, ...module.supplementalProjects]
			.map(item => item.playableSolutionEmbedUrl)
			.filter((link): link is string => Boolean(link))
	);
}

function learnerSolutionLeaks(course: CourseDefinition) {
	return course.modules.flatMap(module =>
		[...module.curriculum, ...module.supplementalProjects].flatMap(item => {
			const leaks: string[] = [];

			if (item.solutionLink) {
				leaks.push(
					`${module.title} / ${item.title} exposes solutionLink ${item.solutionLink}`
				);
			}

			if (item.projectLink && SOLUTION_PATH_RE.test(item.projectLink)) {
				leaks.push(
					`${module.title} / ${item.title} exposes solution projectLink ${item.projectLink}`
				);
			}

			if (
				item.playableSolutionEmbedUrl &&
				!SCRATCH_EMBED_RE.test(item.playableSolutionEmbedUrl)
			) {
				leaks.push(
					`${module.title} / ${item.title} exposes an invalid playable solution ${item.playableSolutionEmbedUrl}`
				);
			}

			return leaks;
		})
	);
}

describe("course solution visibility", () => {
	beforeEach(() => {
		setActivePinia(createPinia());
	});

	it("omits solution links from learner course data", async () => {
		const appStore = useAppStore();
		appStore.setCurrentUser({
			_id: "learner-1",
			name: "Learner",
			email: "learner@example.com",
			age: 13,
			state: "GA",
			courseAccess: ["ap-computer-science-a"],
			editUsers: false,
			saveEdit: "Save"
		});

		const coursesStore = useCoursesStore();
		const course = await coursesStore.loadCourseById(
			"ap-computer-science-a"
		);

		expect(course).not.toBeNull();
		expect(courseSolutionLinks(course!)).toEqual([]);
		expect(courseLinks(course!).filter(Boolean)).not.toContain(
			"https://github.com/instruction-material/APCS/tree/main/APCS1-Mad-Libs/solution"
		);
	});

	it("exposes only derived Scratch embeds as learner-playable solutions", async () => {
		const appStore = useAppStore();
		appStore.setCurrentUser({
			_id: "learner-1",
			name: "Learner",
			email: "learner@example.com",
			age: 13,
			state: "GA",
			courseAccess: [
				"scratch-level-1",
				"scratch-level-2",
				"ap-computer-science-a"
			],
			editUsers: false,
			saveEdit: "Save"
		});

		const coursesStore = useCoursesStore();
		const scratchCourses = await Promise.all([
			coursesStore.loadCourseById("scratch-level-1"),
			coursesStore.loadCourseById("scratch-level-2")
		]);
		const programmingCourse = await coursesStore.loadCourseById(
			"ap-computer-science-a"
		);
		const scratchEmbeds = scratchCourses.flatMap(course =>
			coursePlayableSolutionEmbeds(course!)
		);
		const scratchItems = scratchCourses.flatMap(course =>
			course!.modules.flatMap(module => [
				...module.curriculum,
				...module.supplementalProjects
			])
		);
		const unusableEmbeds = scratchEmbeds.filter(embed => {
			const projectId = embed.match(/\/projects\/(\d+)\/embed$/u)?.[1];
			return projectId && UNUSABLE_SCRATCH_SOLUTION_IDS.has(projectId);
		});
		const unusableStarterLinks = scratchItems
			.map(item => item.projectLink)
			.filter((link): link is string => Boolean(link))
			.filter(link => {
				const projectId = link.match(/\/projects\/(\d+)\/?$/u)?.[1];
				return projectId && UNUSABLE_SCRATCH_STARTER_IDS.has(projectId);
			});
		const hungryHippoItems = scratchItems.filter(item =>
			/Hungry Hippo/iu.test(item.title)
		);

		expect(scratchEmbeds.length).toBeGreaterThan(0);
		expect(scratchEmbeds.every(link => SCRATCH_EMBED_RE.test(link))).toBe(
			true
		);
		expect(
			scratchCourses.flatMap(course => courseSolutionLinks(course!))
		).toEqual([]);
		expect(coursePlayableSolutionEmbeds(programmingCourse!)).toEqual([]);
		expect(courseSolutionLinks(programmingCourse!)).toEqual([]);
		expect(unusableEmbeds).toEqual([]);
		expect(unusableStarterLinks).toEqual([]);
		expect(hungryHippoItems.length).toBeGreaterThan(0);
		expect(
			hungryHippoItems.every(item => !item.playableSolutionEmbedUrl)
		).toBe(true);
	});

	it(
		"omits dedicated solution paths from every learner course",
		async () => {
			const appStore = useAppStore();
			appStore.setCurrentUser({
				_id: "learner-1",
				name: "Learner",
				email: "learner@example.com",
				age: 13,
				state: "GA",
				courseAccess: courseCatalog.map(course => course.id),
				editUsers: false,
				saveEdit: "Save"
			});

			const coursesStore = useCoursesStore();
			const leaks: string[] = [];

			for (const { id } of courseCatalog) {
				const course = await coursesStore.loadCourseById(id);

				if (!course) {
					leaks.push(`${id} failed to load`);
					continue;
				}

				leaks.push(
					...learnerSolutionLeaks(course).map(
						leak => `${id}: ${leak}`
					)
				);
			}

			expect(leaks).toEqual([]);
		},
		COURSE_SWEEP_TIMEOUT
	);

	it("includes starter and solution links for staff course data", async () => {
		const appStore = useAppStore();
		appStore.setCurrentTutor({
			_id: "tutor-1",
			name: "Tutor",
			email: "tutor@example.com",
			age: 30,
			state: "GA",
			usersOfTutorLength: 1,
			coursePermissions: ["ap-computer-science-a"],
			editTutors: false,
			saveEdit: "Save"
		});

		const coursesStore = useCoursesStore();
		const course = await coursesStore.loadCourseById(
			"ap-computer-science-a"
		);
		const links = courseLinks(course!);

		expect(course).not.toBeNull();
		expect(links).toContain(
			"https://github.com/instruction-material/APCS/tree/main/APCS1-Mad-Libs/starter"
		);
		expect(links).toContain(
			"https://github.com/instruction-material/APCS/tree/main/APCS1-Mad-Libs/solution"
		);
	});

	it("reloads the learner-safe course object after a staff course was cached", async () => {
		const appStore = useAppStore();
		const coursesStore = useCoursesStore();

		appStore.setCurrentTutor({
			_id: "tutor-1",
			name: "Tutor",
			email: "tutor@example.com",
			age: 30,
			state: "GA",
			usersOfTutorLength: 1,
			coursePermissions: ["ap-computer-science-a"],
			editTutors: false,
			saveEdit: "Save"
		});

		const staffCourse = await coursesStore.loadCourseById(
			"ap-computer-science-a"
		);
		expect(courseSolutionLinks(staffCourse!)).toContain(
			"https://github.com/instruction-material/APCS/tree/main/APCS1-Mad-Libs/solution"
		);

		appStore.setCurrentTutor(null);
		appStore.setCurrentUser({
			_id: "learner-1",
			name: "Learner",
			email: "learner@example.com",
			age: 13,
			state: "GA",
			courseAccess: ["ap-computer-science-a"],
			editUsers: false,
			saveEdit: "Save"
		});

		const learnerCourse = await coursesStore.loadCourseById(
			"ap-computer-science-a"
		);

		expect(courseSolutionLinks(learnerCourse!)).toEqual([]);
	});
});
