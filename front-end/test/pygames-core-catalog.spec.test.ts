import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { createPinia, setActivePinia } from "pinia";
import { expect, it } from "vitest";
import {
	pyGamesCoreResource,
	pyGamesCoreSourceRevision
} from "@/modules/pyGamesCoreProjectResources";
import { useAppStore } from "@/stores/app";
import { useCoursesStore } from "@/stores/courses";

const published = JSON.parse(
	readFileSync(
		resolve(
			process.cwd(),
			"../test/fixtures/pygames-core-published-workspace-keys.json"
		),
		"utf8"
	)
) as { revision: string; courses: Record<string, Record<string, string>> };
const packs = [
	{
		id: "pygames-pyg0-setup-editors-and-asset-workflow-curriculum-pyg0-setup-editors-and-asset-workflow-core-project",
		pack: "PG-CORE-Workspace-and-Assets",
		task: "WORKSPACE_CONFIG"
	},
	{
		id: "pygames-images-and-sprites-practice-studio-curriculum-images-and-sprites-core-project",
		pack: "PG-CORE-Image-Anchors",
		task: "ANCHOR_POSITION"
	},
	{
		id: "pygames-pyg12-master-project-curriculum-pyg12-master-project-core-project",
		pack: "PG-CORE-Arena-Capstone",
		task: "PLAYER_ACCELERATION"
	}
] as const;
const views = ["pygames", "pygames-classroom"].flatMap(course =>
	[false, true].map(staff => ({ course, staff }))
);

it.each(views)(
	"preserves published $course keys with staff=$staff",
	async view => {
		setActivePinia(createPinia());
		const account = {
			_id: "core-workflow-check",
			name: "Course workflow check",
			email: "course@example.invalid",
			age: 30,
			state: "GA",
			editUsers: false,
			saveEdit: "Save"
		};
		if (view.staff) {
			useAppStore().setCurrentTutor({
				...account,
				usersOfTutorLength: 0,
				coursePermissions: [view.course],
				editTutors: false
			});
		} else {
			useAppStore().setCurrentUser({
				...account,
				courseAccess: [view.course]
			});
		}
		const course = (await useCoursesStore().loadCourseById(view.course))!;
		const items = new Map(
			course.modules.flatMap(module =>
				[...module.curriculum, ...module.supplementalProjects].map(
					item => [item.id, item]
				)
			)
		);
		for (const [id, key] of Object.entries(
			published.courses[view.course]!
		)) {
			const item = items.get(id)!;
			expect(
				new URL(
					item.projectLink!,
					"https://classes.local"
				).searchParams.get("projectKey")
			).toBe(key);
		}
		const classroom = view.course.endsWith("classroom");
		for (const pack of packs) {
			const item = items.get(pack.id)!;
			const route = new URL(item.projectLink!, "https://classes.local")
				.searchParams;
			const source = pyGamesCoreResource(route.get("starterUrl")!)!;
			expect(source.pack).toBe(pack.pack);
			expect(source.resource.ref).toBe(pyGamesCoreSourceRevision);
			expect(source.role).toBe(classroom ? "solution" : "starter");
			expect(route.get("classroom")).toBe(classroom ? "1" : null);
			expect(item.learningPath).toBe("core");
			expect(item.content).toContain(pack.task);
			expect(item.content).toContain("images/alien.png");
			expect(item.content).toContain("python contracts.py");
			if (classroom) {
				expect(item.content).toContain("**Normal:**");
				expect(item.content).toContain("**Hard:**");
			}
			if (view.staff)
				expect(pyGamesCoreResource(item.solutionLink!)?.role).toBe(
					"solution"
				);
			else expect(item.solutionLink).toBeUndefined();
		}
		const master = items.get(
			"pygames-pyg12-master-project-curriculum-pyg12-project-1-master-project"
		)!;
		for (const concept of [
			"actors",
			"event handling",
			"projectiles",
			"physics",
			"surfaces",
			"system control",
			"enemy behavior"
		])
			expect(master.content).toContain(concept);
		expect(master.content).toContain("same saved capstone");
		expect(master.content).toContain("state diagram");
	}
);
