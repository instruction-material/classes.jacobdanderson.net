import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { loadRawCourse } from "@/stores/courses/index";

const EXPECTED_UNITY_SEQUENCE = [
	"UGD0 Unity 6.3 LTS Setup, Assets, and Project Hygiene",
	"UGD1 GameObjects, Components, and C# Scripts",
	"UGD2 Input, Movement, Camera, and Player Feel",
	"UGD3 Physics, Collision, Triggers, and Collection",
	"UGD4 UI, Game State, Menus, and Restart Flow",
	"UGD5 Prefabs, Spawning, Levels, Audio, and Animation",
	"UGD6 Capstone Production, Playtesting, and Revision",
	"UGD7 Testing, Profiling, Builds, CI, and Asset Pipeline",
	"UGD8 Full-Project Starter and Review Repository Plan"
];

const PRACTICE_SECTIONS = [
	"setup-and-source-hygiene-case",
	"components-and-lifecycle-case",
	"input-movement-and-camera-case",
	"physics-collision-and-collection-case",
	"ui-state-and-restart-case",
	"prefabs-levels-and-feedback-case",
	"capstone-playtest-and-revision-case",
	"testing-profiling-and-builds-case",
	"full-project-repository-workflow-case"
];

const ANSWER_SECTIONS = PRACTICE_SECTIONS.map(section =>
	section.replace(/-case$/u, "-key")
);

const STARTER_URL =
	"https://github.com/instruction-material/Unity-Game-Development/tree/main/UGD-full-project-starter";
const SOLUTION_URL =
	"https://github.com/instruction-material/Unity-Game-Development/tree/main/UGD-full-project-solution";

async function requireUnityCourse() {
	const course = await loadRawCourse("unity-game-development");
	expect(course).not.toBeNull();
	return course!;
}

function unityModules(course: Awaited<ReturnType<typeof requireUnityCourse>>) {
	return course.modules.filter(module => module.title.startsWith("UGD"));
}

function moduleItems(module: ReturnType<typeof unityModules>[number]) {
	return [...module.curriculum, ...module.supplementalProjects];
}

function markdownHeadingSlugs(markdown: string) {
	return new Set(
		[...markdown.matchAll(/^#{1,6}\s+(.+)$/gmu)].map(([, heading]) =>
			heading
				.toLowerCase()
				.replace(/[`*_]/gu, "")
				.replace(/[^\p{L}\p{N}\s-]/gu, "")
				.trim()
				.replace(/\s+/gu, "-")
				.replace(/-+/gu, "-")
		)
	);
}

function assetText(filename: string) {
	return fs.readFileSync(
		path.resolve(__dirname, `../public/course-assets/unity/${filename}`),
		"utf8"
	);
}

describe("Unity Game Development learner flow", () => {
	it("presents setup through capstone as the complete seven-module core", async () => {
		const course = await requireUnityCourse();
		const modules = unityModules(course);

		expect(modules.map(module => module.title)).toEqual(
			EXPECTED_UNITY_SEQUENCE
		);
		expect(course.modules.slice(0, 9).map(module => module.title)).toEqual(
			EXPECTED_UNITY_SEQUENCE
		);
		expect(
			modules.slice(0, 7).every(module => module.kind === "module")
		).toBe(true);
		expect(
			modules.slice(7).every(module => module.kind === "appendix")
		).toBe(true);
	});

	it("keeps production engineering visibly optional after the core capstone", async () => {
		const modules = unityModules(await requireUnityCourse());

		for (const module of modules.slice(0, 7)) {
			expect(
				moduleItems(module).every(item => item.learningPath === "core")
			).toBe(true);
		}
		for (const module of modules.slice(7)) {
			expect(
				module.curriculum.every(item => item.learningPath === "choice")
			).toBe(true);
			expect(
				module.supplementalProjects.every(
					item => item.learningPath === "challenge"
				)
			).toBe(true);
		}

		const capstoneIndex = modules.findIndex(module =>
			module.title.startsWith("UGD6")
		);
		expect(capstoneIndex).toBe(6);
		expect(modules.slice(capstoneIndex + 1)).toHaveLength(2);
	});

	it("gives every active module a bounded schedule and six-part concept map", async () => {
		for (const module of unityModules(await requireUnityCourse())) {
			expect(module.estimatedTime, module.title).toMatch(/session/u);
			expect(module.keyBlocks, module.title).toHaveLength(6);
			expect(module.curriculum, module.title).toHaveLength(4);
			expect(module.supplementalProjects, module.title).toHaveLength(2);
		}
	});

	it("turns all 54 active cards into substantial linked learner activities", async () => {
		const items = unityModules(await requireUnityCourse()).flatMap(
			moduleItems
		);

		expect(items).toHaveLength(54);
		expect(
			Math.min(...items.map(item => item.content.length))
		).toBeGreaterThan(1_300);

		for (const item of items) {
			expect(item.content, item.title).toContain("**Course position:**");
			expect(item.content, item.title).toContain("**Playable result:**");
			expect(item.content, item.title).toMatch(
				/\*\*(?:Practice|Project) route:\*\*/u
			);
			expect(item.content, item.title).toContain("**Evidence gate:**");
			expect(item.content, item.title).toContain(
				"**Toolchain and access boundary:**"
			);
			expect(item.content, item.title).toContain("**Local continuity:**");
			expect(item.content, item.title).toContain(
				"**Primary reference:**"
			);
			expect(item.projectLink, item.title).toBe(STARTER_URL);
			expect(item.solutionLink, item.title).toBe(SOLUTION_URL);
			expect(item.datasetLink, item.title).toMatch(
				/^\/course-assets\/unity\/unity-game-development-practice-pack\.md#/u
			);
			expect(item.mediaLink, item.title).toMatch(/^https:\/\//u);
		}
	});

	it("keeps every local practice and verification anchor valid", async () => {
		const practiceSlugs = markdownHeadingSlugs(
			assetText("unity-game-development-practice-pack.md")
		);
		const answerSlugs = markdownHeadingSlugs(
			assetText("unity-game-development-verification-guide.md")
		);
		const items = unityModules(await requireUnityCourse()).flatMap(
			moduleItems
		);

		for (const section of PRACTICE_SECTIONS) {
			expect(practiceSlugs, section).toContain(section);
		}
		for (const section of ANSWER_SECTIONS) {
			expect(answerSlugs, section).toContain(section);
		}

		for (const item of items) {
			const practiceAnchor = item.datasetLink?.split("#")[1];
			expect(practiceSlugs, item.title).toContain(practiceAnchor);

			const verificationMatch = item.content.match(
				/\/course-assets\/unity\/unity-game-development-verification-guide\.md#([a-z0-9-]+)/u
			);
			expect(verificationMatch, item.title).not.toBeNull();
			expect(answerSlugs, item.title).toContain(verificationMatch?.[1]);
		}
	});

	it("teaches current Unity APIs and small validation gates before capstone", async () => {
		const course = await requireUnityCourse();
		const text = JSON.stringify(course);
		const capstone = unityModules(course)[6];

		expect(text).toContain("Unity 6.3 LTS");
		expect(text).toContain("support through December 2027");
		expect(text).toContain("current Input System");
		expect(text).toContain("FixedUpdate");
		expect(text).toContain("collision matrix");
		expect(text).toContain("state machine");
		expect(text).toContain("Build Profile");
		expect(text).toContain("Edit Mode test");
		expect(text).toContain("Play Mode smoke");
		expect(JSON.stringify(capstone)).toContain(
			"pre-capstone component, input, collision, state, and build gates"
		);
	});

	it("guides learners from the published source folders to a runnable scene", async () => {
		const modules = unityModules(await requireUnityCourse());
		const reader = (moduleIndex: number, title: string) =>
			modules[moduleIndex].curriculum.find(item => item.title === title)
				?.content;
		const practice = assetText("unity-game-development-practice-pack.md");

		expect(reader(0, "Unity Version and Hub Setup")).toContain(
			"ProjectSettings/ProjectVersion.txt"
		);
		expect(reader(0, "First Scene Smoke Test")).toContain(
			"Create and save `Assets/Scenes/SmokeTest.unity`"
		);
		expect(reader(2, "Input to Intent")).toContain(
			"Active Input Handling to Both"
		);
		expect(reader(7, "Unity Test Framework")).toContain(
			"Verify the saved scene separately"
		);
		expect(reader(8, "Repository Shape")).toContain(
			"Scene and prefab folders contain setup notes"
		);
		expect(practice).toContain("Debug.Log(\"Smoke scene ready\")");
		expect(practice).toContain("GameManager.StartGame()");
		expect(practice).toContain("three coins in the starter");
		expect(practice).toContain("For the solution, place five coins");
		expect(practice).toContain("Builds/DesktopDevelopment");
	});

	it("keeps hardware, paid assets, accounts, and personal data out of core completion", async () => {
		const course = await requireUnityCourse();
		const text = JSON.stringify(course);

		expect(text).toContain("no controller purchase is required");
		expect(text).toContain(
			"External media requires source, license, modification, and attribution notes"
		);
		expect(text).toContain(
			"Accounts, leaderboards, chat, payments, analytics"
		);
		expect(text).toContain(
			"Playtest notes use fictional participant labels"
		);
		expect(text).toContain(
			"Do not collect learner names, emails, recordings, device identifiers"
		);
		expect(text).toContain(
			"does not require persistent build workers, cloud credentials"
		);
		expect(text).toContain("nonaudio feedback");
	});

	it("preserves legacy snapshots as traceable optional appendices", async () => {
		const course = await requireUnityCourse();
		const legacyModules = course.modules.filter(module =>
			module.title.startsWith("Legacy Snapshot Archive:")
		);

		expect(legacyModules).toHaveLength(5);
		expect(legacyModules.every(module => module.kind === "appendix")).toBe(
			true
		);

		for (const item of legacyModules.flatMap(moduleItems)) {
			expect(item.learningPath, item.title).toBe("choice");
			expect(item.projectLink, item.title).toContain(
				"github.com/instruction-material/Unity-Game-Development"
			);
			expect(item.solutionLink, item.title).toContain(
				"github.com/instruction-material/Unity-Game-Development"
			);
		}
	});

	it("documents the full-project source contract and capstone evidence", async () => {
		const metadata = (await requireUnityCourse()).developmentMetadata;

		expect(metadata).toBeDefined();
		expect(metadata?.standards).toHaveLength(4);
		expect(metadata?.assessmentCadence).toHaveLength(5);
		expect(metadata?.toolchain).toHaveLength(5);
		expect(metadata?.safetyPolicy).toHaveLength(5);
		expect(metadata?.courseBoundaries).toHaveLength(5);
		expect(metadata?.capstoneExpectations).toHaveLength(6);
		expect(metadata?.sourcePolicy).toContain(
			"UGD0–UGD6 as the complete learner-facing sequence"
		);
		expect(metadata?.sourcePolicy).toContain(
			"full-project starter and completed-review states"
		);
	});
});
