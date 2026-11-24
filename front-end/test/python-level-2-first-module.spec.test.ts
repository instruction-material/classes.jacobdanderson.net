import { createHash } from "node:crypto";
import { strFromU8, unzipSync } from "fflate";
import { createPinia, setActivePinia } from "pinia";
import { expect, it, vi } from "vitest";
import { createProjectArchive } from "@/modules/projectArchive";
import {
	addPythonIdeClassroomSectionsToSource,
	loadPythonIdeStarterFilesFromGitHub
} from "@/modules/pythonIde";
import { useAppStore } from "@/stores/app";
import { useCoursesStore } from "@/stores/courses";
import asciiFixture from "../../test/fixtures/python-level-2-ascii-module-sources.json";
import capstonesFixture from "../../test/fixtures/python-level-2-capstones-module-sources.json";
import collectionsFixture from "../../test/fixtures/python-level-2-collections-module-sources.json";
import consoleFixture from "../../test/fixtures/python-level-2-console-module-sources.json";
import conditionalsFixture from "../../test/fixtures/python-level-2-conditionals-module-sources.json";
import dictionariesFixture from "../../test/fixtures/python-level-2-dictionaries-module-sources.json";
import functionsFixture from "../../test/fixtures/python-level-2-functions-module-sources.json";
import listsMusicFixture from "../../test/fixtures/python-level-2-lists-and-music-module-sources.json";
import namedMusicMorseFixture from "../../test/fixtures/python-level-2-named-music-and-morse-module-sources.json";
import supplementalPracticeFixture from "../../test/fixtures/python-level-2-supplemental-practice-module-sources.json";
import supplementalSetsFixture from "../../test/fixtures/python-level-2-supplemental-sets-word-games-module-sources.json";

const modules = [
	{
		suffix: "-ps9-sets",
		source: supplementalSetsFixture.revision,
		assignments: [
			["Soccer Nationalities", "PS9-Soccer-Nationalities", "choice"],
			["Debugging Sets", "PS9-Debugging-Sets", "challenge"]
		]
	},
	{
		suffix: "-ps12-type-racer",
		source: supplementalSetsFixture.revision,
		assignments: [
			["Evil Wheel of Fortune", "PS12-Evil-Wheel-of-Fortune", "challenge"]
		]
	},
	{
		suffix: "-ps13-wordsmith",
		source: supplementalSetsFixture.revision,
		assignments: [
			[
				"supplemental-ps13-supplemental-project-1-typewriter-monkeys",
				"PS13-Typewriter-Monkeys",
				"choice"
			]
		]
	},
	{
		suffix: "-ps9-sets",
		source: supplementalPracticeFixture.revision,
		assignments: [
			[
				"supplemental-ps9-supplemental-project-1-class-registration",
				"PS9-Class-Registration",
				"choice"
			]
		]
	},
	{
		suffix: "-ps10-to-do-list",
		source: supplementalPracticeFixture.revision,
		assignments: [["US Capitals Quiz", "PS10-US-Capitals-Quiz", "choice"]]
	},
	{
		suffix: "-ps11-bank-account",
		source: supplementalPracticeFixture.revision,
		assignments: [["Theme Park Planner", "PS11-Juni-World", "choice"]]
	},
	{
		suffix: "-ps12-type-racer",
		source: supplementalPracticeFixture.revision,
		assignments: [["Review Sentiment", "PS12-Review-Sentiment", "choice"]]
	},
	{
		suffix: "-ps1-variables-strings-and-input",
		source: "b58d958347f0c3ca6f9d96963a674cc3d00813bf",
		assignments: [
			["Mad Libs", "PS1-Mad-Libs", "core"],
			["Index Picker", "PS1-Index-Picker", "core"],
			["Space Mountain", "PS1-Space-Mountain", "choice"],
			["Tip Calculator", "PS1-Tip-Calculator", "choice"],
			["Relay Race", "PS1-Relay-Race", "choice"]
		]
	},
	{
		suffix: "-ps3-ascii-and-ciphers",
		source: "96f7196ea540fce55644e2a2d1d0ce97f16de9e8",
		assignments: [
			[
				"supplemental-ps3-supplemental-project-4-password-cracker",
				"PS3-Password-Cracker",
				"challenge"
			]
		]
	},
	{
		suffix: "-ps4-conditionals",
		source: "5d787e78f9d0e72096046c49ee25e9fab53fe045",
		assignments: [
			["Rock, Paper, Scissors", "PS4-Rock-Paper-Scissors", "core"],
			["FizzBuzz", "PS4-FizzBuzz", "core"],
			["Credit Card Validator", "PS4-Credit-Card-Validator", "core"],
			[
				"Carnival Strength Tester",
				"PS4-Carnival-Strength-Tester",
				"choice"
			],
			["Test Statistics", "PS4-Test-Statistics", "choice"],
			["Relay Race Statistics", "PS4-Relay-Race-Statistics", "choice"],
			[
				"Joe's Donuts Opening Day",
				"PS4-Joes-Donuts-Opening-Day",
				"choice"
			],
			["Number Guesser", "PS4-Number-Guesser", "choice"],
			[
				"Debugging Conditionals",
				"PS4-Debugging-Conditionals",
				"challenge"
			]
		]
	},
	{
		suffix: "-check-in-1",
		source: "8bc76e6927ae40683bfb79170c378dac2b266cf2",
		assignments: [
			["curriculum-check-in-1-overview", "PS-Check-in-1", "core"],
			[
				"curriculum-check-in-1-additional-practice-project",
				"PS-Check-in-1/practice",
				"core"
			]
		]
	},
	{
		suffix: "-ps5-functions",
		source: "6c8442dd68067e1f8cee1f14a5e08bf8e4b06c17",
		assignments: [
			["Functions Practice", "PS5-Functions-Practice", "core"],
			["Parameter Tracing", "PS5-Parameter-Tracing", "core"],
			["Coin Flipper", "PS5-Coin-Flipper", "core"],
			["Dice Roller", "PS5-Dice-Roller", "core"],
			["Squawka Zilly Floog", "PS5-Squawka-Zilly-Floog", "choice"],
			["Word Translator", "PS5-Juni-Latin", "choice"],
			["Number Games", "PS5-Number-Games", "choice"],
			["Debugging Functions", "PS5-Debugging-Functions", "challenge"]
		]
	},
	{
		suffix: "-ps6-lists-and-music",
		source: listsMusicFixture.revision,
		assignments: [
			["Lists Practice", "PS6-Lists-Practice-1", "core"],
			["Build a Song", "PS6-Build-a-Song", "core"],
			["Song Generator", "PS6-Song-Generator", "core"],
			["Tower of Terror", "PS6-Tower-of-Terror", "choice"],
			["Basketball Stars", "PS6-Basketball-Stars", "choice"],
			["Stock Trader", "PS6-Stock-Trader", "challenge"],
			["Dog Breeds", "PS6-Dog-Breeds", "choice"],
			["Card Shuffler", "PS6-Card-Shuffler", "choice"],
			["Debugging Lists", "PS6-Debugging-Lists", "challenge"]
		]
	},
	{
		suffix: "-ps7-dictionaries",
		source: "2dec846ce80283885dfe01579a181906e6748985",
		assignments: [
			["Dictionaries Practice", "PS7-Dictionaries-Practice", "core"],
			["Test Scores", "PS7-Test-Scores", "choice"]
		]
	},
	{
		suffix: "-ps7-dictionaries",
		source: namedMusicMorseFixture.revision,
		assignments: [["Song Generator 2", "PS7-Song-Generator-2", "core"]]
	},
	{
		suffix: "-ps7-dictionaries",
		source: dictionariesFixture.revision,
		assignments: [
			["Birthday Converter", "PS7-Birthday-Converter", "choice"],
			["Coffee Shop", "PS7-Coffee-Shop", "choice"],
			["Dictionary Indexing", "PS7-Dictionary-Indexing", "choice"],
			[
				"Debugging Dictionaries",
				"PS7-Debugging-Dictionaries",
				"challenge"
			]
		]
	},
	{
		suffix: "-ps8-ciphers-and-music",
		source: namedMusicMorseFixture.revision,
		assignments: [["Morse Code", "PS8-Morse-Code", "core"]]
	},
	{
		suffix: "-ps9-sets",
		source: "2dec846ce80283885dfe01579a181906e6748985",
		assignments: [
			["Sets Practice", "PS9-Sets-Practice", "core"],
			[
				"curriculum-ps9-project-2-wheel-of-fortune",
				"PS9-Wheel-of-Fortune",
				"core"
			],
			["Class Registration II", "PS9-Class-Registration-II", "challenge"],
			["Favorite Foods", "PS9-Favorite-Foods", "choice"]
		]
	},
	{
		suffix: "-ps10-to-do-list",
		source: "2dec846ce80283885dfe01579a181906e6748985",
		assignments: [
			["To-Do List", "PS10-Todo-List", "core"],
			["Field Day", "PS10-Field-Day", "choice"],
			["Field Day II", "PS10-Field-Day-II", "challenge"]
		]
	},
	{
		suffix: "-ps11-bank-account",
		source: "96f7196ea540fce55644e2a2d1d0ce97f16de9e8",
		assignments: [
			["Bank Account", "PS11-Bank-Account", "core"],
			["Calculator", "PS11-Calculator", "choice"]
		]
	},
	{
		suffix: "-ps12-type-racer",
		source: "96f7196ea540fce55644e2a2d1d0ce97f16de9e8",
		assignments: [
			["curriculum-ps12-project-1-type-racer", "PS12-Type-Racer", "core"]
		]
	},
	{
		suffix: "-ps13-wordsmith",
		source: "96f7196ea540fce55644e2a2d1d0ce97f16de9e8",
		assignments: [
			[
				"Advanced Typewriter Monkeys",
				"PS13-Advanced-Typewriter-Monkeys",
				"challenge"
			]
		]
	},
	{
		suffix: "-ps14-blackjack",
		source: "4451de4a1f7dccd55a0175bbf9fe3f2fbe183f70",
		assignments: [
			["Simple Blackjack", "PS14-Simple-Blackjack", "core"],
			["Advanced Blackjack", "PS14-Advanced-Blackjack", "core"],
			[
				"supplemental-ps14-supplemental-project-1-game-of-war",
				"PS14-Game-of-War",
				"choice"
			],
			[
				"supplemental-ps14-supplemental-project-2-mastermind",
				"PS14-Mastermind",
				"challenge"
			]
		]
	},
	{
		suffix: "-check-in-2",
		source: "8bc76e6927ae40683bfb79170c378dac2b266cf2",
		assignments: [
			["curriculum-check-in-2-overview", "PS-Check-in-2", "core"],
			[
				"curriculum-check-in-2-additional-practice-project",
				"PS-Check-in-2/practice",
				"core"
			]
		]
	}
] as const;

it.each([
	["python-level-2", "learner"],
	["python-level-2", "instructor"],
	["python-level-2-classroom", "learner"],
	["python-level-2-classroom", "instructor"]
] as const)(
	"links role-appropriate Python Level 2 projects in %s for %s",
	async (courseId, role) => {
		setActivePinia(createPinia());
		if (role === "instructor") {
			useAppStore().setCurrentTutor({
				_id: "python-course-tutor",
				name: "Tutor",
				email: "tutor@example.invalid",
				age: 30,
				state: "GA",
				usersOfTutorLength: 0,
				coursePermissions: [courseId],
				editTutors: false,
				saveEdit: "Save"
			});
		}

		const course = (await useCoursesStore().loadCourseById(courseId))!;
		for (const { suffix, source, assignments } of modules) {
			const module = course.modules.find(({ id }) =>
				id.endsWith(suffix)
			)!;
			const items = [
				...module.curriculum,
				...module.supplementalProjects
			];
			for (const [title, folder, path] of assignments) {
				const item = items.find(
					candidate =>
						candidate.title.endsWith(title) ||
						candidate.id.endsWith(title)
				)!;
				const projectSource = `Python-Level-2/tree/${source}/${folder}`;
				const base = `https://github.com/instruction-material/${projectSource}`;
				expect(item.learningPath, title).toBe(path);
				expect(item.solutionLink).toBe(
					role === "instructor" ? `${base}/solution` : undefined
				);
				if (courseId === "python-level-2") {
					expect(item.projectLink).toBe(`${base}/starter`);
				} else {
					const launch = new URL(
						item.projectLink!,
						"https://classes.example"
					);
					expect(launch.pathname).toBe("/ide");
					expect(launch.searchParams.get("classroomSource")).toBe(
						`${projectSource}/solution`
					);
					expect(launch.searchParams.get("projectKey")).toBe(
						`${courseId}:${item.id}:starter`
					);
					if (
						suffix === "-ps3-ascii-and-ciphers" ||
						suffix === "-ps4-conditionals" ||
						suffix === "-ps5-functions" ||
						suffix === "-ps6-lists-and-music" ||
						suffix === "-ps7-dictionaries" ||
						suffix === "-ps8-ciphers-and-music" ||
						suffix === "-ps9-sets" ||
						suffix === "-ps10-to-do-list" ||
						suffix === "-ps11-bank-account" ||
						suffix === "-ps12-type-racer" ||
						suffix === "-ps13-wordsmith" ||
						suffix === "-ps14-blackjack" ||
						suffix.startsWith("-check-in-")
					) {
						expect(item.contentKind).toBe("assignment");
						expect(item.content).toMatch(
							/\*\*Normal:\*\*[\s\S]*\*\*Hard:\*\*[\s\S]*\*\*Success criteria:\*\*/
						);
					}
				}
			}
		}
	}
);

it.each([
	["ascii", asciiFixture],
	["conditionals", conditionalsFixture],
	["functions", functionsFixture],
	["collections", collectionsFixture],
	["console", consoleFixture],
	["capstones", capstonesFixture],
	["lists-and-music", listsMusicFixture],
	["named-music-and-morse", namedMusicMorseFixture],
	["dictionaries", dictionariesFixture],
	["supplemental-practice", supplementalPracticeFixture],
	["supplemental-sets-word-games", supplementalSetsFixture]
] as const)(
	"binds the %s browser fixture to real course items and classroom sources",
	async (_scope, data) => {
		const fixture: {
			moduleId?: string;
			revision: string;
			files: Record<string, { content?: string }>;
			exercises: {
				moduleId?: string;
				pack: string;
				itemId: string;
				classroomMainSha256: string;
			}[];
		} = data;
		setActivePinia(createPinia());
		const course = (await useCoursesStore().loadCourseById(
			"python-level-2-classroom"
		))!;
		const files: Record<string, { content?: string }> = fixture.files;
		for (const exercise of fixture.exercises) {
			const module = course.modules.find(
				({ id }) => id === (exercise.moduleId ?? fixture.moduleId)
			)!;
			const assignments = [
				...module.curriculum,
				...module.supplementalProjects
			];
			const item = assignments.find(({ id }) => id === exercise.itemId);
			expect(item?.projectLink, exercise.itemId).toBeDefined();
			const launch = new URL(
				item!.projectLink!,
				"https://classes.example"
			);
			expect(launch.searchParams.get("classroomSource")).toBe(
				`Python-Level-2/tree/${fixture.revision}/${exercise.pack}/solution`
			);
			const solution = files[`${exercise.pack}/solution/main.py`];
			expect(solution?.content).toBeDefined();
			const wrapped = addPythonIdeClassroomSectionsToSource(
				solution!.content!
			);
			expect(createHash("sha256").update(wrapped).digest("hex")).toBe(
				exercise.classroomMainSha256
			);
		}
	}
);

it.each([
	["PS6-Build-a-Song", "starter"],
	["PS6-Build-a-Song", "solution"],
	["PS6-Song-Generator", "starter"],
	["PS6-Song-Generator", "solution"],
	["PS7-Song-Generator-2", "starter"],
	["PS7-Song-Generator-2", "solution"],
	["PS8-Morse-Code", "starter"],
	["PS8-Morse-Code", "solution"]
] as const)(
	"preserves the portable synthesizer for %s %s",
	async (pack, role) => {
		const fixture = pack.startsWith("PS6")
			? listsMusicFixture
			: namedMusicMorseFixture;
		const { repository, revision } = fixture;
		const path = `${pack}/${role}`;
		const files: Record<string, { content: string; byteLength: number }> =
			fixture.files;
		const sources = Object.entries(files).filter(([name]) =>
			name.startsWith(`${path}/`)
		);
		const directories: string[] = [];
		const api = `/repos/instruction-material/${repository}/contents/`;
		const raw = `/instruction-material/${repository}/${revision}/`;
		vi.stubGlobal("fetch", async (request: string | URL | Request) => {
			const url = new URL(String(request));
			if (url.hostname === "api.github.com") {
				expect(url.searchParams.get("ref")).toBe(revision);
				const directory = url.pathname.slice(api.length);
				expect([path, `${path}/native_pysynth`]).toContain(directory);
				directories.push(directory);
				const entries = sources
					.filter(([name]) => name.startsWith(`${directory}/`))
					.flatMap(([file, { byteLength }]) => {
						const name = file.slice(directory.length + 1);
						return name.includes("/")
							? []
							: [
									{
										type: "file",
										name,
										path: file,
										size: byteLength
									}
								];
					});
				return new Response(
					JSON.stringify(
						directory === path
							? [
									...entries,
									{
										type: "dir",
										name: "native_pysynth",
										path: `${path}/native_pysynth`
									}
								]
							: entries
					)
				);
			}
			expect(url.hostname).toBe("raw.githubusercontent.com");
			const file = files[url.pathname.slice(raw.length)];
			expect(file).toBeDefined();
			return new Response(file!.content);
		});
		try {
			const loaded = await loadPythonIdeStarterFilesFromGitHub(
				`https://github.com/instruction-material/${repository}/tree/${revision}/${path}`
			);
			expect(directories).toEqual([path, `${path}/native_pysynth`]);
			expect(loaded[0]?.name).toBe("main.py");
			const archive = unzipSync(
				createProjectArchive({ title: pack, files: loaded })
			);
			expect(Object.keys(archive).sort()).toEqual(
				sources
					.map(([file]) => `${pack}/${file.slice(path.length + 1)}`)
					.sort()
			);
			for (const [file, { content }] of sources) {
				expect(
					strFromU8(
						archive[`${pack}/${file.slice(path.length + 1)}`]!
					)
				).toBe(content);
			}
		} finally {
			vi.unstubAllGlobals();
		}
	}
);
