import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { strFromU8, unzipSync } from "fflate";
import { createPinia, setActivePinia } from "pinia";
import { afterEach, expect, it, vi } from "vitest";
import { getCodeIdeProjectSubtitle } from "@/modules/codeIdeProjectLabels";
import { createProjectArchive } from "@/modules/projectArchive";
import {
	pyGamesCourseProjectKey,
	pyGamesSourceRevision
} from "@/modules/pyGamesProjectResources";
import {
	addPythonIdeClassroomSections,
	clearLocalPythonProjects,
	createPythonIdeProject,
	loadLocalPythonProjects,
	loadPythonIdeStarterFilesFromGitHub,
	saveLocalPythonProjects
} from "@/modules/pythonIde";
import { externalDatasetResourceLabel } from "@/modules/resourceUrls";
import { useAppStore } from "@/stores/app";
import { useCoursesStore } from "@/stores/courses";

const fixture = JSON.parse(
	readFileSync(
		resolve(process.cwd(), "../test/fixtures/pygames-juni-programs.json"),
		"utf8"
	)
) as {
	revision: string;
	programs: Record<
		string,
		{ content: string; gitBlob: string; size: number; revision?: string }
	>;
};
const ids = ["pygames", "pygames-classroom"] as const;
const bounce =
	"pygames-pyg1-object-oriented-programming-actors-curriculum-pyg1-project-2-bouncing-alien";
const bounceLaunch =
	"pygames-classroom-classroom-launch-play-extend-explain-curriculum-launch-project-1-bouncing-alien";
const setup =
	"pygames-pyg0-setup-editors-and-asset-workflow-curriculum-pyg0-setup-editors-and-asset-workflow-core-project";
const master =
	"pygames-pyg12-master-project-curriculum-pyg12-project-1-master-project";
const masterBuild =
	"pygames-pyg12-master-project-curriculum-pyg12-master-project-core-project";

async function loadCourse(id: string, staff = true) {
	setActivePinia(createPinia());
	const account = {
		_id: "course-review",
		name: "Course review",
		email: "course@example.invalid",
		age: 30,
		state: "GA",
		editUsers: false,
		saveEdit: "Save"
	};
	if (staff)
		useAppStore().setCurrentTutor({
			...account,
			usersOfTutorLength: 0,
			coursePermissions: [id],
			editTutors: false
		});
	else useAppStore().setCurrentUser({ ...account, courseAccess: [id] });
	return (await useCoursesStore().loadCourseById(id))!;
}

afterEach(() => {
	vi.unstubAllGlobals();
	clearLocalPythonProjects();
});

it.each(ids)(
	"preserves every published %s identity and replaces arithmetic packs with distinct game practice",
	async id => {
		const course = await loadCourse(id);
		const expected = JSON.parse(
			readFileSync(
				resolve(
					process.cwd(),
					`../test/fixtures/${id}-published-identities.json`
				),
				"utf8"
			)
		);
		expect(
			course.modules.flatMap(module =>
				[...module.curriculum, ...module.supplementalProjects].map(
					item => ({ moduleId: module.id, id: item.id })
				)
			)
		).toEqual(expected);
		const items = course.modules.flatMap(module => [
			...module.curriculum,
			...module.supplementalProjects
		]);
		const falling = items.find(item =>
			item.id.endsWith("-pyg4-project-2-falling-squares")
		)!;
		expect(falling).toBeDefined();
		const fallingSource =
			id === "pygames-classroom"
				? new URL(
						falling.projectLink!,
						"https://classes.local"
					).searchParams.get("starterUrl")
				: falling.solutionLink;
		expect(fallingSource).toBe(
			"https://github.com/instruction-material/PyGames/blob/7d14ecd52342b19dfeb1b76ec5eeb2a568e769b0/PyG4-Falling-Squares.py"
		);
		expect(JSON.stringify(course)).not.toMatch(
			/\/PG-\d+-|VALUE_MULTIPLIER|transform\(values/
		);
		const practice = items.filter(item =>
			item.content.includes(
				"**Starting point:** Run the supplied working game"
			)
		);
		expect(practice).toHaveLength(34);
		expect(new Set(practice.map(item => item.content)).size).toBe(34);
		for (const item of practice) {
			expect(["choice", "challenge"]).toContain(item.learningPath);
			expect(item.solutionLink).toBeUndefined();
			const url = new URL(item.projectLink!, "https://classes.local");
			const source =
				url.pathname === "/ide"
					? url.searchParams.get("starterUrl")!
					: item.projectLink!;
			expect(source).toContain(`/blob/${pyGamesSourceRevision}/`);
			const file = source.split("/").at(-1)!;
			expect(fixture.programs[file]?.content).toMatch(/def draw\(/);
			expect(item.content).toContain("**Checks:**");
			expect(item.content).toContain("**Evidence:**");
			if (id === "pygames-classroom") {
				expect(item.content).toContain("**Normal:**");
				expect(item.content).toContain("**Hard:**");
			}
		}
	}
);

it("keeps independent construction, staff references and the completed classroom framework distinct", async () => {
	const independent = await loadCourse("pygames", false);
	const learnerItem = independent.modules
		.flatMap(module => [
			...module.curriculum,
			...module.supplementalProjects
		])
		.find(item => item.id === bounce)!;
	const learnerRoute = new URL(
		learnerItem.projectLink!,
		"https://classes.local"
	).searchParams;
	expect(learnerRoute.get("starter")).toBe("course");
	expect(learnerRoute.get("starterUrl")).toBeNull();
	expect(learnerItem.solutionLink).toBeUndefined();
	const staff = await loadCourse("pygames");
	const staffItem = staff.modules
		.flatMap(module => [
			...module.curriculum,
			...module.supplementalProjects
		])
		.find(item => item.id === bounce)!;
	expect(staffItem.solutionLink).toBe(
		`https://github.com/instruction-material/PyGames/blob/${fixture.revision}/PyG1-Bouncing-Alien.py`
	);
	const classroom = await loadCourse("pygames-classroom", false);
	const items = classroom.modules.flatMap(module => [
		...module.curriculum,
		...module.supplementalProjects
	]);
	const classItem = items.find(item => item.id === bounce)!;
	const launchItem = items.find(item => item.id === bounceLaunch)!;
	const classRoute = new URL(classItem.projectLink!, "https://classes.local")
		.searchParams;
	const launchRoute = new URL(
		launchItem.projectLink!,
		"https://classes.local"
	).searchParams;
	expect(classRoute.get("classroom")).toBe("1");
	expect(classRoute.get("starterUrl")).toBe(staffItem.solutionLink);
	expect(classRoute.get("projectKey")).toBe(launchRoute.get("projectKey"));
	expect(classRoute.get("projectKey")).toBe(
		`pygames-classroom:${bounceLaunch}:starter`
	);
	expect(classItem.content).toContain("**Normal:**");
	expect(classItem.content).toContain("**Hard:**");
});

it.each(ids)(
	"makes %s setup and capstone cards open real workspaces with shared continuation keys",
	async id => {
		const course = await loadCourse(id);
		const items = course.modules.flatMap(module => [
			...module.curriculum,
			...module.supplementalProjects
		]);
		for (const itemID of [setup, master, masterBuild]) {
			const item = items.find(item => item.id === itemID)!;
			expect(item.projectLink).toMatch(/^\/ide\?/);
			expect(
				new URL(
					item.projectLink!,
					"https://classes.local"
				).searchParams.get("projectKey")
			).toBe(pyGamesCourseProjectKey(id, itemID, "starter"));
		}
		expect(pyGamesCourseProjectKey(id, master, "starter")).toBe(
			pyGamesCourseProjectKey(id, masterBuild, "starter")
		);
		expect(items.find(item => item.id === master)!.content).toContain(
			"state diagram"
		);
		expect(items.find(item => item.id === masterBuild)!.content).toContain(
			"same saved capstone"
		);
		expect(items.find(item => item.id === setup)!.content).toContain(
			"screen.fill((30, 40, 70))"
		);
	}
);

it.each(
	Object.keys(fixture.programs).filter(
		name => !["PyG0-Template.py", "PyG12-Master-Project.py"].includes(name)
	)
)(
	"imports and exports the complete pinned repository %s source",
	async name => {
		const source = fixture.programs[name];
		const raw = Buffer.from(source.content);
		expect(raw.length).toBe(source.size);
		expect(
			createHash("sha1")
				.update(
					Buffer.concat([Buffer.from(`blob ${raw.length}\0`), raw])
				)
				.digest("hex")
		).toBe(source.gitBlob);
		vi.stubGlobal(
			"fetch",
			vi.fn(async (url: string) => {
				expect(String(url)).toBe(
					`https://raw.githubusercontent.com/instruction-material/PyGames/${source.revision ?? fixture.revision}/${name}`
				);
				return new Response(source.content, { status: 200 });
			})
		);
		const files = await loadPythonIdeStarterFilesFromGitHub(
			`https://github.com/instruction-material/PyGames/blob/${source.revision ?? fixture.revision}/${name}`,
			"pgzero"
		);
		expect(files).toHaveLength(1);
		expect(files[0].content).toBe(source.content);
		const classroomFiles = addPythonIdeClassroomSections(files);
		expect(classroomFiles[0].content).toContain("###   NORMAL SECTION");
		expect(classroomFiles[0].content).toContain("###   HARD SECTION");
		let position = 0;
		const derived = classroomFiles[0].content.split("\n");
		for (const line of source.content
			.split("\n")
			.filter(line => line.trim())) {
			const next = derived.indexOf(line, position);
			expect(
				next,
				`Original source line retained: ${line}`
			).toBeGreaterThanOrEqual(position);
			position = next + 1;
		}
		const old = createPythonIdeProject("pgzero", {
			courseID: "pygames",
			courseProjectKey: "pygames:practice:starter",
			files: [
				{ name: "main.py", content: "# earlier independent attempt\n" }
			]
		});
		const project = createPythonIdeProject("pgzero", {
			files,
			courseID: "pygames",
			courseProjectKey: "pygames:practice:starter:juni-pygames"
		});
		expect(getCodeIdeProjectSubtitle(project)).toBe(
			"Learner · PyGame Zero"
		);
		saveLocalPythonProjects([old, project]);
		expect(loadLocalPythonProjects()).toEqual([old, project]);
		const entries = unzipSync(createProjectArchive(project));
		expect(strFromU8(entries[`${project.title}/${files[0].name}`])).toBe(
			source.content
		);
	}
);

it("labels media directories and the open-ended capstone brief by their actual purpose", () => {
	for (const [path, label] of [
		["tree/main/images", "Image assets"],
		["tree/main/music", "Music assets"],
		["tree/main/sounds", "Sound effects"],
		[
			`blob/${fixture.revision}/PyG12-Master-Project.py`,
			"Original capstone brief"
		]
	])
		expect(
			externalDatasetResourceLabel(
				`https://github.com/instruction-material/PyGames/${path}`
			)
		).toBe(label);
	expect(
		externalDatasetResourceLabel(
			"https://github.com/example/PyGames/tree/main/images"
		)
	).toBeNull();
});
