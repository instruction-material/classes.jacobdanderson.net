import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { python } from "@codemirror/lang-python";
import { EditorState } from "@codemirror/state";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { strFromU8, strToU8, unzipSync, zipSync } from "fflate";
import {
	blueJProjectArchiveName,
	blueJProjectTitleFromArchiveName,
	createBlueJProjectArchive,
	createBlueJProjectFiles,
	importBlueJProjectArchive
} from "../src/modules/blueJProjectExport";
import {
	pythonBracketPairColorRanges,
	pythonBracketPairIgnoredRanges
} from "../src/modules/pythonCodeMirror";
import {
	addPythonIdeClassroomSections,
	addPythonIdeClassroomSectionsToSource,
	blueJMainStarterCode,
	blueJReadmeStarterText,
	blueJStudentStarterCode,
	clearLocalPythonProjects,
	clearLocalPythonProjectsAsync,
	createPythonIdeProject,
	dataScienceSampleCsv,
	dataScienceStarterCode,
	fetchSharedPythonIdeProject,
	getPythonIdeAssetDataUrl,
	getPythonIdeDefaultFileContent,
	getPythonIdeFileKindLabel,
	getPythonIdeModeLabel,
	getPythonIdeProjectKindLabel,
	getPythonIdeRunnableFile,
	isPythonIdeBinaryAssetFile,
	isPythonIdeBlueJProject,
	isPythonIdeJavaFile,
	isPythonIdePythonFile,
	isPythonIdeRunnableFile,
	isPythonIdeRuntimeReservedPath,
	isPythonIdeTextFile,
	isValidPythonFileName,
	isValidPythonIdeShareID,
	javaOutlineStarterCode,
	javaStarterCode,
	karelOutlineStarterCode,
	karelOutlineWorld,
	karelStarterCode,
	karelStarterWorld,
	normalizeImportedPythonIdeFileName,
	normalizePythonIdeMode,
	loadPythonIdeStarterFilesFromGitHub,
	loadLocalPythonProjects,
	loadLocalPythonProjectsAsync,
	normalizePythonFileName,
	pgzeroOutlineStarterCode,
	pythonIdeModeForCourseId,
	pythonIdeProjectToPayload,
	pythonIdeStorageKey,
	pythonStarterCode,
	pythonLevel1OutlineStarterCode,
	resolvePythonIdeActiveFileName,
	saveLocalPythonProjects,
	saveLocalPythonProjectsAsync,
	pgzeroCourseStarterCode,
	pgzeroStudentSvg,
	pgzeroStarterCode,
	turtleCircleArtStarterCode,
	turtleClassroomProjectStarterCode,
	turtleFireworkFestivalStarterCode,
	turtleFlowerGardenStarterCode,
	turtleMazeExplorerStarterCode,
	turtleNeonTrailStarterCode,
	turtlePicassoStarterCode,
	turtleRaceDayStarterCode,
	turtleSpiralGalaxyStarterCode,
	turtleTriangleMotionStarterCode,
	turtleStarterCode
} from "../src/modules/pythonIde";
import { resetCodePreviewCaches } from "../src/modules/codePreview";
import {
	findPythonIdeCourseAsset,
	getPythonIdeCourseAssetObjectUrl,
	loadPythonIdeCourseAssetPack,
	parsePythonIdeCourseAssetZip,
	parsePythonIdeCourseAssetManifest,
	pythonIdeAssetLookupAliases,
	pythonIdeAssetCandidateNames,
	pythonIdeCourseAssetsManifestUrl,
	pythonIdeCourseAssetsZipUrl,
	pythonIdeLegacyCourseAssetsManifestUrl,
	pythonIdeLegacyCourseAssetsZipUrl,
	resetPythonIdeCourseAssetPackCache
} from "../src/modules/pythonIdeCourseAssets";
import {
	pythonIdeImportedTopLevelModules,
	pythonIdeProjectModuleNames,
	warmPythonRuntime
} from "../src/modules/pythonIdeRuntime";
import { runJavaIdeProject } from "../src/modules/javaIdeRuntime";
import { primePythonRuntimeConnection } from "../src/modules/pythonIdeRuntimeHints";
import {
	pythonStandardLibraryModules,
	resetPythonStandardLibraryModuleCache
} from "../src/modules/pythonStandardLibraryModules";

const oneByOnePngBytes = new Uint8Array([
	0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00, 0x00, 0x0d,
	0x49, 0x48, 0x44, 0x52, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01
]);
const COMMENT_END_PUNCTUATION_RE = /[.!?]$/;
const INLINE_COMMENT_RE = /^\s*(?:#|\/\/)\s+(.+)$/;
const JAVADOC_TAG_RE = /^\s+\*\s+@(brief|param|return)\s+(.+)$/;
const SECTION_HEADER_RE = /^\s*(?:[#/*]+\s*)?[A-Z][A-Z\s/]+(?:\s*[#/*]+)?\s*$/;

function pythonEditorState(doc: string) {
	return EditorState.create({
		doc,
		extensions: [python()]
	});
}

describe("python IDE project helpers", () => {
	beforeEach(() => {
		resetPythonIdeCourseAssetPackCache();
		resetCodePreviewCaches();
		resetPythonStandardLibraryModuleCache();
		const storage = new Map<string, string>();
		Object.defineProperty(window, "localStorage", {
			configurable: true,
			value: {
				clear: vi.fn(() => storage.clear()),
				getItem: vi.fn((key: string) => storage.get(key) ?? null),
				removeItem: vi.fn((key: string) => storage.delete(key)),
				setItem: vi.fn((key: string, value: string) =>
					storage.set(key, value)
				)
			}
		});
		Object.defineProperty(window, "indexedDB", {
			configurable: true,
			value: undefined
		});
	});

	afterEach(() => {
		document.head
			.querySelectorAll('link[href*="cdn.jsdelivr.net/pyodide"]')
			.forEach(element => element.remove());
		document.head
			.querySelectorAll(
				'link[href="//cdn.jsdelivr.net"], link[href="https://cdn.jsdelivr.net"]'
			)
			.forEach(element => element.remove());
		vi.unstubAllGlobals();
	});

	it("creates empty projects by default except for minimal PyGame Zero dimensions", () => {
		const pythonProject = createPythonIdeProject("python");
		const dataProject = createPythonIdeProject("data");
		const turtleProject = createPythonIdeProject("turtle");
		const pgzeroProject = createPythonIdeProject("pgzero");
		const javaProject = createPythonIdeProject("java");
		const karelProject = createPythonIdeProject("karel");

		expect(pythonProject.files).toEqual([{ name: "main.py", content: "" }]);
		expect(dataProject.files).toEqual([{ name: "main.py", content: "" }]);
		expect(turtleProject.files).toEqual([{ name: "main.py", content: "" }]);
		expect(pgzeroProject.files).toEqual([
			{ name: "main.py", content: pgzeroCourseStarterCode }
		]);
		expect(pgzeroProject.files[0]?.content).toContain("WIDTH = 640");
		expect(pgzeroProject.files[0]?.content).toContain("HEIGHT = 400");
		expect(pgzeroProject.files[0]?.content).not.toContain("Actor(");
		expect(javaProject.files).toEqual([{ name: "Main.java", content: "" }]);
		expect(karelProject.files).toEqual([
			{ name: "Algo.java", content: karelStarterCode },
			{ name: "world.txt", content: karelStarterWorld }
		]);
	});

	it("creates demo project templates only when requested", () => {
		const dataProject = createPythonIdeProject("data", {
			template: "demo"
		});
		const pgzeroProject = createPythonIdeProject("pgzero", {
			template: "demo"
		});
		const turtleProject = createPythonIdeProject("turtle", {
			template: "demo"
		});
		const javaProject = createPythonIdeProject("java", {
			template: "demo"
		});
		const karelProject = createPythonIdeProject("karel", {
			template: "demo"
		});

		expect(dataProject.mode).toBe("data");
		expect(dataProject.title).toBe("Data / AI Notebook");
		expect(dataProject.files[0]?.content).toBe(dataScienceStarterCode);
		expect(dataProject.files[1]).toEqual({
			name: "scores.csv",
			content: dataScienceSampleCsv
		});
		expect(dataProject.files[0]?.content).toContain("pandas");
		expect(dataProject.files[0]?.content).toContain(
			'DATA_FILE = "scores.csv"'
		);
		expect(dataProject.files[0]?.content).toContain(
			"pd.read_csv(DATA_FILE)"
		);
		expect(dataProject.files[0]?.content).toContain("plt.bar");

		expect(pgzeroProject.mode).toBe("pgzero");
		expect(pgzeroProject.title).toBe("PyGame Zero Game");
		expect(pgzeroProject.files[0]?.content).toBe(pgzeroStarterCode);
		expect(pgzeroProject.files[0]?.content).toContain("Actor(");
		expect(pgzeroProject.files[0]?.content).toContain("pgzrun.go()");
		expect(pgzeroProject.files[1]).toEqual({
			name: "images/student.svg",
			content: pgzeroStudentSvg
		});

		expect(turtleProject.mode).toBe("turtle");
		expect(turtleProject.files[0]?.content).toBe(turtleStarterCode);
		expect(turtleProject.files[0]?.content).toContain("screen.onkey");
		expect(turtleProject.files[0]?.content).toContain("screen.onclick");
		expect(turtleProject.files[0]?.content).toContain("screen.ontimer");
		expect(turtleProject.files[0]?.content).toContain("pen.ondrag");

		expect(javaProject.mode).toBe("java");
		expect(javaProject.title).toBe("Java Practice");
		expect(javaProject.files).toEqual([
			{ name: "Main.java", content: javaStarterCode }
		]);

		expect(karelProject.mode).toBe("karel");
		expect(karelProject.title).toBe("Karel Java World");
		expect(karelProject.files).toEqual([
			{ name: "Algo.java", content: karelStarterCode },
			{ name: "world.txt", content: karelStarterWorld }
		]);
	});

	it("creates Python Level 1, PyGame Zero, Java, and Karel outline templates", () => {
		const turtleOutline = createPythonIdeProject("turtle", {
			template: "outline"
		});
		const pgzeroOutline = createPythonIdeProject("pgzero", {
			template: "outline"
		});
		const javaOutline = createPythonIdeProject("java", {
			template: "outline"
		});
		const karelOutline = createPythonIdeProject("karel", {
			template: "outline"
		});

		expect(turtleOutline.title).toBe("Python Level 1 Outline");
		expect(turtleOutline.files).toEqual([
			{
				name: "main.py",
				content: pythonLevel1OutlineStarterCode
			}
		]);
		expect(turtleOutline.files[0]?.content).toContain(
			"###   EVENT LISTENERS   ###"
		);
		expect(turtleOutline.files[0]?.content).toContain("while condition:");
		expect(turtleOutline.files[0]?.content).toContain(
			"for current_turtle in turtle_list:"
		);

		expect(pgzeroOutline.title).toBe("PyGame Zero Outline");
		expect(pgzeroOutline.files[0]).toEqual({
			name: "main.py",
			content: pgzeroOutlineStarterCode
		});
		expect(pgzeroOutline.files[0]?.content).toContain("def draw():");
		expect(pgzeroOutline.files[0]?.content).toContain("def update():");
		expect(pgzeroOutline.files[0]?.content).toContain("on_key_down");
		expect(pgzeroOutline.files[1]).toEqual({
			name: "images/student.svg",
			content: pgzeroStudentSvg
		});

		expect(javaOutline.title).toBe("Java Outline");
		expect(javaOutline.files).toEqual([
			{ name: "Main.java", content: javaOutlineStarterCode }
		]);
		expect(javaOutline.files[0]?.content).toContain("Scanner input");
		expect(javaOutline.files[0]?.content).toContain("ArrayList<String>");
		expect(javaOutline.files[0]?.content).toContain("make_note");
		expect(karelOutline.title).toBe("Karel Java Outline");
		expect(karelOutline.files).toEqual([
			{ name: "MyProgram.java", content: karelOutlineStarterCode },
			{ name: "world.txt", content: karelOutlineWorld }
		]);
		expect(karelOutline.files[0]?.content).toContain("public void run()");
		expect(karelOutline.files[0]?.content).toContain(
			"frontIsClear() && noBallsPresent()"
		);
		expect(karelOutline.files[0]?.content).toContain(
			"while (frontIsClear())"
		);
	});

	it("creates the guided Turtle art templates with Normal and Hard sections", () => {
		const circleArt = createPythonIdeProject("turtle", {
			template: "circle-art"
		});
		const picasso = createPythonIdeProject("turtle", {
			template: "picasso"
		});
		const triangleMotion = createPythonIdeProject("turtle", {
			template: "triangle-motion"
		});

		expect(circleArt.title).toBe("Color Circle Art");
		expect(circleArt.files).toEqual([
			{ name: "main.py", content: turtleCircleArtStarterCode }
		]);
		expect(circleArt.files[0]?.content).toContain("random.choice(ART_COLORS)");
		expect(circleArt.files[0]?.content).toContain("artist.begin_fill()");
		expect(circleArt.files[0]?.content).toContain("artist.goto(x_position, y_position)");
		expect(circleArt.files[0]?.content).toContain("artist.speed(DRAWING_SPEED)");
		expect(circleArt.files[0]?.content).toContain("###   NORMAL SECTION");
		expect(circleArt.files[0]?.content).toContain("###   HARD SECTION");

		expect(picasso.title).toBe("Picasso Keyboard Painter");
		expect(picasso.files).toEqual([
			{ name: "main.py", content: turtlePicassoStarterCode }
		]);
		expect(picasso.files[0]?.content).toContain("from random import choice");
		expect(picasso.files[0]?.content).toContain("from turtle import Screen, Turtle");
		expect(picasso.files[0]?.content).toContain(
			'colors = ["red", "light blue", "green", "yellow", "white", "orange"]'
		);
		expect(picasso.files[0]?.content).toContain('screen.bgcolor("black")');
		expect(picasso.files[0]?.content).toContain("t = Turtle()");
		expect(picasso.files[0]?.content).toContain("def draw_square():\n    pass");
		expect(picasso.files[0]?.content).toContain(
			"Keep the name draw_square or update screen.onkey() below to match"
		);
		expect(picasso.files[0]?.content).toContain('screen.onkey(draw_square, "s")');
		expect(picasso.files[0]?.content).toContain("screen.listen()");
		expect(picasso.files[0]?.content).toContain("def draw_bonus_shape():\n    pass");
		expect(picasso.files[0]?.content).not.toContain("t.forward(");
		expect(picasso.files[0]?.content).not.toContain("def clear_art");

		expect(triangleMotion.title).toBe("Triangle Motion Starter");
		expect(triangleMotion.files).toEqual([
			{ name: "main.py", content: turtleTriangleMotionStarterCode }
		]);
		expect(triangleMotion.files[0]?.content).toContain(
			"def draw_triangle():\n    pass"
		);
		expect(triangleMotion.files[0]?.content).toContain(
			"Use TRIANGLE_SIDE_LENGTH and TURN_ANGLE to draw three equal sides"
		);
		expect(triangleMotion.files[0]?.content).toContain(
			'artist.goto(artist.xcor() + MOVE_DISTANCE, artist.ycor())'
		);
		expect(triangleMotion.files[0]?.content).toContain(
			'artist.goto(artist.xcor() - MOVE_DISTANCE, artist.ycor())'
		);
		expect(triangleMotion.files[0]?.content).toContain(
			'screen.onkey(move_right_and_draw, "Right")'
		);
		expect(triangleMotion.files[0]?.content).toContain(
			'screen.onkey(move_left_and_draw, "Left")'
		);
		expect(triangleMotion.files[0]?.content).toContain("screen.listen()");
		expect(triangleMotion.files[0]?.content).toContain(
			"def add_triangle_detail():\n    pass"
		);
		expect(triangleMotion.files[0]?.content).not.toContain(
			"artist.forward("
		);
		expect(triangleMotion.files[0]?.content).not.toContain("artist.left(");
	});

	it("creates the classroom Turtle project collection", () => {
		const templates = [
			{
				template: "classroom-project" as const,
				title: "Classroom Turtle Studio",
				source: turtleClassroomProjectStarterCode
			},
			{
				template: "neon-trail" as const,
				title: "Neon Trail Painter",
				source: turtleNeonTrailStarterCode
			},
			{
				template: "firework-festival" as const,
				title: "Firework Festival",
				source: turtleFireworkFestivalStarterCode
			},
			{
				template: "spiral-galaxy" as const,
				title: "Spiral Galaxy",
				source: turtleSpiralGalaxyStarterCode
			},
			{
				template: "turtle-race" as const,
				title: "Turtle Race Day",
				source: turtleRaceDayStarterCode
			},
			{
				template: "flower-garden" as const,
				title: "Flower Garden Clicker",
				source: turtleFlowerGardenStarterCode
			},
			{
				template: "maze-explorer" as const,
				title: "Maze Explorer",
				source: turtleMazeExplorerStarterCode
			}
		];

		for (const { source, template, title } of templates) {
			const project = createPythonIdeProject("turtle", { template });
			expect(project.title).toBe(title);
			expect(project.files).toEqual([{ name: "main.py", content: source }]);
			expect(source, title).toContain("###   NORMAL SECTION");
			expect(source, title).toContain("###   HARD SECTION");
			expect(source, title).toMatch(/def \w+\([^)]*\):\n    pass/);
			expect(source, title).toContain("###   MAIN CODE");
		}

		expect(turtleNeonTrailStarterCode).toContain(
			'screen.onkey(add_special_effect, "space")'
		);
		expect(turtleFireworkFestivalStarterCode).toContain(
			"screen.onclick(draw_firework)"
		);
		expect(turtleSpiralGalaxyStarterCode).toContain("draw_galaxy()");
		expect(turtleRaceDayStarterCode).toContain(
			"screen.ontimer(race_step, RACE_DELAY_MS)"
		);
		expect(turtleFlowerGardenStarterCode).toContain(
			"screen.onclick(draw_flower)"
		);
		expect(turtleMazeExplorerStarterCode).toContain(
			"return inside_canvas and not point_touches_wall("
		);
	});

	it("adds classroom sections to completed Python starter files", () => {
		const originalSource = `import turtle

screen = turtle.Screen()
artist = turtle.Turtle()
artist.forward(40)
screen.listen()
`;
		const adaptedSource =
			addPythonIdeClassroomSectionsToSource(originalSource);
		const normalDefinitionIndex = adaptedSource.indexOf(
			"def normal_addition():"
		);
		const completedDrawingIndex = adaptedSource.indexOf(
			"artist.forward(40)"
		);
		const normalCallIndex = adaptedSource.indexOf(
			"\nnormal_addition()",
			completedDrawingIndex
		);
		const listenIndex = adaptedSource.indexOf("screen.listen()");

		expect(normalDefinitionIndex).toBeGreaterThanOrEqual(0);
		expect(completedDrawingIndex).toBeGreaterThan(normalDefinitionIndex);
		expect(normalCallIndex).toBeGreaterThan(completedDrawingIndex);
		expect(listenIndex).toBeGreaterThan(normalCallIndex);
		expect(adaptedSource).toContain("###   NORMAL SECTION");
		expect(adaptedSource).toContain("###   HARD SECTION");
		expect(
			addPythonIdeClassroomSectionsToSource(adaptedSource)
		).toBe(adaptedSource);

		const files = addPythonIdeClassroomSections([
			{ name: "helpers.py", content: "VALUE = 1\n" },
			{ name: "main.py", content: originalSource },
			{ name: "notes.txt", content: "Keep this file" }
		]);
		expect(files[0]?.content).toBe("VALUE = 1\n");
		expect(files[1]?.content).toContain("def hard_addition():");
		expect(files[2]?.content).toBe("Keep this file");

		const pyGameSource = `import pgzrun

def draw():
    screen.clear()

pgzrun.go()
`;
		const adaptedPyGameSource =
			addPythonIdeClassroomSectionsToSource(pyGameSource);
		expect(
			adaptedPyGameSource.indexOf("\nnormal_addition()")
		).toBeLessThan(adaptedPyGameSource.indexOf("pgzrun.go()"));
		expect(
			adaptedPyGameSource.indexOf("\nhard_addition()")
		).toBeLessThan(adaptedPyGameSource.indexOf("pgzrun.go()"));
	});

	it("keeps built-in IDE demos and templates aligned with the classroom coding standard", () => {
		const builtInTemplateSources = [
			javaStarterCode,
			javaOutlineStarterCode,
			blueJMainStarterCode,
			blueJStudentStarterCode,
			karelStarterCode,
			karelOutlineStarterCode,
			pythonStarterCode,
			dataScienceStarterCode,
			turtleStarterCode,
			pythonLevel1OutlineStarterCode,
			turtleCircleArtStarterCode,
			turtleClassroomProjectStarterCode,
			turtleFireworkFestivalStarterCode,
			turtleFlowerGardenStarterCode,
			turtleMazeExplorerStarterCode,
			turtleNeonTrailStarterCode,
			turtlePicassoStarterCode,
			turtleRaceDayStarterCode,
			turtleSpiralGalaxyStarterCode,
			turtleTriangleMotionStarterCode,
			pgzeroStarterCode,
			pgzeroOutlineStarterCode,
			pgzeroCourseStarterCode,
			getPythonIdeDefaultFileContent("Main.java"),
			getPythonIdeDefaultFileContent("main.py")
		];

		for (const source of builtInTemplateSources) {
			expect(source).toMatch(/(?:CONSTANTS|VARIABLES|FUNCTIONS|MAIN CODE)/);
			for (const line of source.split("\n")) {
				const commentText =
					line.match(INLINE_COMMENT_RE)?.[1] ??
					line.match(JAVADOC_TAG_RE)?.[2] ??
					"";
				if (!commentText || SECTION_HEADER_RE.test(commentText))
					continue;

				expect(
					COMMENT_END_PUNCTUATION_RE.test(commentText.trim()),
					commentText
				).toBe(false);
			}
		}

		for (const javaTemplate of [
			javaStarterCode,
			javaOutlineStarterCode,
			blueJMainStarterCode,
			blueJStudentStarterCode,
			karelStarterCode,
			karelOutlineStarterCode
		]) {
			expect(javaTemplate).toContain("*   FUNCTIONS   *");
		}

		expect(javaStarterCode).toContain("GREETING_MESSAGE");
		expect(javaStarterCode).toContain(
			"@brief Demonstrate the minimal Java console project shape"
		);
		expect(javaOutlineStarterCode).toContain(
			"@brief Organize an introductory Java console project with helpers and lists"
		);
		expect(javaOutlineStarterCode).toContain("STARTING_SCORE");
		expect(blueJMainStarterCode).toContain(
			"@brief Demonstrate a small BlueJ object-oriented project"
		);
		expect(blueJMainStarterCode).toContain("FIRST_SCORE");
		expect(blueJStudentStarterCode).toContain(
			"@brief Store one student's grade level and score history"
		);
		expect(karelStarterCode).toContain(
			"@brief Demonstrate a Karel robot program with a loaded world file"
		);
		expect(karelStarterCode).toContain("MOVE_COUNT");
		expect(karelOutlineStarterCode).toContain(
			"@brief Run the main Karel command sequence"
		);
		expect(pythonStarterCode).toContain("###   CONSTANTS   ###");
		expect(pythonStarterCode).toContain("GREETING_MESSAGE");
		expect(dataScienceStarterCode).toContain("###   MAIN CODE   ###");
		expect(dataScienceStarterCode).toContain(
			"# Build the chart from named configuration values"
		);
		expect(turtleStarterCode).toContain(
			"# Move only while the project is in its active motion state"
		);
		expect(pythonLevel1OutlineStarterCode).toContain(
			"# Build each extra turtle before the animation loop starts"
		);
		expect(pgzeroStarterCode).toContain(
			"# Move left while the left arrow key is held"
		);
		expect(pgzeroOutlineStarterCode).toContain(
			"# Create each extra actor before the game loop starts"
		);
		expect(getPythonIdeDefaultFileContent("Main.java")).toContain(
			"@param args Command-line arguments"
		);
		expect(getPythonIdeDefaultFileContent("main.py")).toContain(
			"###   CONSTANTS   ###"
		);
	});

	it("creates a BlueJ Java template with beginner object files", () => {
		const project = createPythonIdeProject("java", {
			template: "bluej"
		});

		expect(project.mode).toBe("java");
		expect(project.title).toBe("BlueJ Java Project");
		expect(project.activeFileName).toBe("Main.java");
		expect(project.files).toEqual([
			{ name: "Main.java", content: blueJMainStarterCode },
			{ name: "Student.java", content: blueJStudentStarterCode },
			{ name: "README.TXT", content: blueJReadmeStarterText }
		]);
		expect(project.files[0]?.content).toContain("new Student");
		expect(project.files[1]?.content).toContain(
			"private final ArrayList"
		);
		expect(isPythonIdeBlueJProject(project)).toBe(true);
		expect(getPythonIdeProjectKindLabel(project)).toBe("BlueJ Java");
		expect(getPythonIdeModeLabel(project.mode)).toBe("Java");

		const plainJavaProject = createPythonIdeProject("java");
		expect(isPythonIdeBlueJProject(plainJavaProject)).toBe(false);
		expect(getPythonIdeProjectKindLabel(plainJavaProject)).toBe("Java");
	});

	it("exports Java projects as BlueJ-ready ZIP contents", () => {
		const project = createPythonIdeProject("java", {
			template: "bluej"
		});

		const files = createBlueJProjectFiles(project);
		const packageFile = files.find(file => file.name === "package.bluej");
		expect(blueJProjectArchiveName(project)).toBe("BlueJ-Java-Project.zip");
		expect(files.map(file => file.name)).toContain("README.TXT");
		expect(packageFile?.content).toContain("#BlueJ package file");
		expect(packageFile?.content).toContain("package.numTargets=2");
		expect(packageFile?.content).toContain("target1.name=Main");
		expect(packageFile?.content).toContain("target2.name=Student");
		expect(files.find(file => file.name === "README.TXT")?.content).toContain(
			"https://github.com/k-pet-group/BlueJ-Greenfoot"
		);

		const archive = unzipSync(createBlueJProjectArchive(project));
		expect(Object.keys(archive).sort()).toEqual([
			"BlueJ-Java-Project/Main.java",
			"BlueJ-Java-Project/README.TXT",
			"BlueJ-Java-Project/Student.java",
			"BlueJ-Java-Project/package.bluej"
		]);
		expect(strFromU8(archive["BlueJ-Java-Project/package.bluej"]!)).toContain(
			"project.charset=UTF-8"
		);
	});

	it("normalizes duplicate README variants in BlueJ export archives", () => {
		const project = createPythonIdeProject("java", {
			files: [
				{ name: "Main.java", content: "public class Main {}" },
				{ name: "readme.txt", content: "Open this first." },
				{ name: "README.TXT", content: "Duplicate readme." }
			],
			title: "Readme BlueJ Export"
		});

		const files = createBlueJProjectFiles(project);
		const readmeFiles = files.filter(file => file.name === "README.TXT");
		const archive = unzipSync(createBlueJProjectArchive(project));
		const archiveNames = Object.keys(archive).sort();

		expect(readmeFiles).toEqual([
			{ name: "README.TXT", content: "Open this first." }
		]);
		expect(archiveNames.filter(name => name.endsWith("/README.TXT"))).toEqual([
			"Readme-BlueJ-Export/README.TXT"
		]);
		expect(strFromU8(archive["Readme-BlueJ-Export/README.TXT"]!)).toBe(
			"Open this first."
		);
	});

	it("omits unsafe or binary files from BlueJ export archives", () => {
		const project = createPythonIdeProject("java", {
			files: [
				{ name: "Main.java", content: "public class Main {}" },
				{ name: "Helper.java", content: "public class Helper {}" },
				{ name: "../Escape.java", content: "public class Escape {}" },
				{ name: "lesson-1.java", content: "class LessonOne {}" },
				{ name: "src/PackageMain.java", content: "class PackageMain {}" },
				{ name: "package.bluej", content: "stale package data" },
				{ name: "notes.md", content: "Safe project notes" },
				{
					name: "images/logo.svg",
					content: "PHN2Zy8+",
					encoding: "base64"
				}
			],
			title: "Unsafe BlueJ Export"
		});

		const files = createBlueJProjectFiles(project);
		const packageFile = files.find(file => file.name === "package.bluej");
		expect(files.map(file => file.name).sort()).toEqual([
			"Helper.java",
			"Main.java",
			"README.TXT",
			"lesson-1.java",
			"notes.md",
			"package.bluej",
			"src/PackageMain.java"
		]);
		expect(packageFile?.content).toContain("package.numTargets=2");
		expect(packageFile?.content).toContain("target1.name=Main");
		expect(packageFile?.content).toContain("target2.name=Helper");
		expect(packageFile?.content).not.toContain("Escape");
		expect(packageFile?.content).not.toContain("lesson-1");
		expect(packageFile?.content).not.toContain("PackageMain");

		const archiveNames = Object.keys(
			unzipSync(createBlueJProjectArchive(project))
		).sort();
		expect(archiveNames).toEqual([
			"Unsafe-BlueJ-Export/Helper.java",
			"Unsafe-BlueJ-Export/Main.java",
			"Unsafe-BlueJ-Export/README.TXT",
			"Unsafe-BlueJ-Export/lesson-1.java",
			"Unsafe-BlueJ-Export/notes.md",
			"Unsafe-BlueJ-Export/package.bluej",
			"Unsafe-BlueJ-Export/src/PackageMain.java"
		]);
		expect(archiveNames.every(name => !name.includes(".."))).toBe(true);
	});

	it("bounds BlueJ export file count and text size before ZIP creation", () => {
		const project = createPythonIdeProject("java", {
			files: [
				{
					name: "Huge.java",
					content: `class Huge {\n${"// filler\n".repeat(60000)}}`
				},
				...Array.from({ length: 42 }, (_, index) => ({
					name: `File${index}.java`,
					content: `class File${index} {}`
				}))
			],
			title: "Bounded BlueJ Export"
		});

		const files = createBlueJProjectFiles(project);
		const archive = unzipSync(createBlueJProjectArchive(project));
		const archiveNames = Object.keys(archive).sort();
		const packageFile = files.find(file => file.name === "package.bluej");

		expect(files).toHaveLength(42);
		expect(files.map(file => file.name)).not.toContain("Huge.java");
		expect(files.map(file => file.name)).not.toContain("File40.java");
		expect(files.map(file => file.name)).not.toContain("File41.java");
		expect(packageFile?.content).toContain("package.numTargets=40");
		expect(archiveNames).toContain("Bounded-BlueJ-Export/File0.java");
		expect(archiveNames).toContain("Bounded-BlueJ-Export/File39.java");
		expect(archiveNames).not.toContain("Bounded-BlueJ-Export/Huge.java");
		expect(archiveNames).not.toContain("Bounded-BlueJ-Export/File40.java");
		expect(archiveNames).toContain("Bounded-BlueJ-Export/package.bluej");
	});

	it("imports BlueJ project ZIPs into safe Java project files", () => {
		const archiveBytes = zipSync({
			"Student-Lab/Main.java": strToU8(
				"public class Main { public static void main(String[] args) {} }"
			),
			"Student-Lab/Student.java": strToU8("public class Student {}"),
			"Student-Lab/README.TXT": strToU8("Open this in BlueJ."),
			"Student-Lab/package.bluej": strToU8("#BlueJ package file"),
			"Student-Lab/Main.ctxt": strToU8("generated BlueJ context"),
			"Student-Lab/images/logo.png": strToU8("not text"),
			"__MACOSX/Student-Lab/._Main.java": strToU8("metadata")
		});

		const result = importBlueJProjectArchive(archiveBytes, {
			maxFiles: 4,
			maxTextFileBytes: 1024
		});

		expect(result.hasBlueJPackage).toBe(true);
		expect(result.files).toEqual([
			{
				content: "public class Main { public static void main(String[] args) {} }",
				encoding: "text",
				name: "Main.java"
			},
			{
				content: "public class Student {}",
				encoding: "text",
				name: "Student.java"
			},
			{
				content: "Open this in BlueJ.",
				encoding: "text",
				name: "README.TXT"
			}
		]);
		expect(result.skippedFiles).toEqual(["images/logo.png"]);
		expect(blueJProjectTitleFromArchiveName("Student-Lab.zip")).toBe(
			"Student Lab BlueJ Project"
		);
		expect(blueJProjectTitleFromArchiveName("BlueJ-Java-Project.zip")).toBe(
			"BlueJ Java Project"
		);
	});

	it("ignores BlueJ archive metadata after stripping the project root", () => {
		const archiveBytes = zipSync({
			"Student-Lab/Main.java": strToU8("public class Main {}"),
			"Student-Lab/__MACOSX/Ghost.java": strToU8(
				"public class Ghost {}"
			),
			"Student-Lab/src/._Helper.java": strToU8("metadata"),
			"Student-Lab/.DS_Store": strToU8("metadata"),
			"Student-Lab/images/logo.png": strToU8("not text")
		});

		const result = importBlueJProjectArchive(archiveBytes, {
			maxFiles: 10,
			maxTextFileBytes: 1024
		});

		expect(result.files).toEqual([
			{
				content: "public class Main {}",
				encoding: "text",
				name: "Main.java"
			}
		]);
		expect(result.skippedFiles).toEqual(["images/logo.png"]);
	});

	it("strips dotted BlueJ project folder names during import", () => {
		const archiveBytes = zipSync({
			"student.lab/Main.java": strToU8("public class Main {}"),
			"student.lab/Student.java": strToU8("public class Student {}"),
			"student.lab/package.bluej": strToU8("#BlueJ package file")
		});

		const result = importBlueJProjectArchive(archiveBytes, {
			maxFiles: 10,
			maxTextFileBytes: 1024
		});

		expect(result.hasBlueJPackage).toBe(true);
		expect(result.files).toEqual([
			{
				content: "public class Main {}",
				encoding: "text",
				name: "Main.java"
			},
			{
				content: "public class Student {}",
				encoding: "text",
				name: "Student.java"
			}
		]);
		expect(result.skippedFiles).toEqual([]);
	});

	it("keeps BlueJ project root stripping stable when unsupported sibling folders are present", () => {
		const archiveBytes = zipSync({
			"Student-Lab/Main.java": strToU8("public class Main {}"),
			"Student-Lab/package.bluej": strToU8("#BlueJ package file"),
			"Screenshots/logo.png": strToU8("not importable")
		});

		const result = importBlueJProjectArchive(archiveBytes, {
			maxFiles: 10,
			maxTextFileBytes: 1024
		});

		expect(result.hasBlueJPackage).toBe(true);
		expect(result.files).toEqual([
			{
				content: "public class Main {}",
				encoding: "text",
				name: "Main.java"
			}
		]);
		expect(result.skippedFiles).toEqual(["Screenshots/logo.png"]);
	});

	it("keeps supported sibling folders outside the BlueJ package root", () => {
		const archiveBytes = zipSync({
			"Examples/Other.java": strToU8("public class Other {}"),
			"Student-Lab/package.bluej": strToU8("#BlueJ package file"),
			"Student-Lab/Main.java": strToU8("public class Main {}")
		});

		const result = importBlueJProjectArchive(archiveBytes, {
			maxFiles: 1,
			maxTextFileBytes: 1024
		});

		expect(result.hasBlueJPackage).toBe(true);
		expect(result.files).toEqual([
			{
				content: "public class Main {}",
				encoding: "text",
				name: "Main.java"
			}
		]);
		expect(result.skippedFiles).toEqual([
			"Examples/Other.java (outside BlueJ project)"
		]);
	});

	it("skips oversized BlueJ archive entries before import", () => {
		const archiveBytes = zipSync({
			"Student-Lab/Main.java": strToU8("public class Main {}"),
			"Student-Lab/Huge.java": strToU8(`class Huge {\n${"// filler\n".repeat(64)}}`)
		});

		const result = importBlueJProjectArchive(archiveBytes, {
			maxFiles: 10,
			maxTextFileBytes: 64
		});

		expect(result.files).toEqual([
			{
				content: "public class Main {}",
				encoding: "text",
				name: "Main.java"
			}
		]);
		expect(result.skippedFiles).toEqual(["Huge.java (too large)"]);
	});

	it("rejects oversized BlueJ archives before ZIP extraction", () => {
		const archiveBytes = zipSync({
			"Student-Lab/Main.java": strToU8("public class Main {}"),
			"Student-Lab/package.bluej": strToU8("#BlueJ package file")
		});

		expect(() =>
			importBlueJProjectArchive(archiveBytes, {
				maxArchiveBytes: 1,
				maxFiles: 10,
				maxTextFileBytes: 1024
			})
		).toThrow("BlueJ ZIP is larger than 1 byte.");
	});

	it("applies safe BlueJ import defaults when options are omitted", () => {
		const boundedEntries: Record<string, Uint8Array> = {
			"Student-Lab/Huge.java": strToU8(
				`class Huge {\n${"// filler\n".repeat(60000)}}`
			)
		};
		for (let index = 0; index < 42; index += 1) {
			boundedEntries[`Student-Lab/File${index}.java`] = strToU8(
				`class File${index} {}`
			);
		}

		const result = importBlueJProjectArchive(zipSync(boundedEntries));

		expect(result.files).toHaveLength(40);
		expect(result.files.map(file => file.name)).toContain("File0.java");
		expect(result.files.map(file => file.name)).not.toContain("Huge.java");
		expect(result.skippedFiles).toEqual(
			expect.arrayContaining([
				"Huge.java (too large)",
				"File40.java (too many files)",
				"File41.java (too many files)"
			])
		);
	});

	it("keeps BlueJ archive byte limits bounded when callers pass unsafe option values", () => {
		expect(() =>
			importBlueJProjectArchive(new Uint8Array(4 * 1024 * 1024 + 1), {
				maxArchiveBytes: Number.POSITIVE_INFINITY
			})
		).toThrow("BlueJ ZIP is larger than 4,194,304 bytes.");
	});

	it("keeps BlueJ import limits bounded when callers pass unsafe option values", () => {
		const boundedEntries: Record<string, Uint8Array> = {
			"Student-Lab/Huge.java": strToU8(
				`class Huge {\n${"// filler\n".repeat(60000)}}`
			)
		};
		for (let index = 0; index < 42; index += 1) {
			boundedEntries[`Student-Lab/File${index}.java`] = strToU8(
				`class File${index} {}`
			);
		}

		const result = importBlueJProjectArchive(zipSync(boundedEntries), {
			maxFiles: Number.POSITIVE_INFINITY,
			maxTextFileBytes: Number.POSITIVE_INFINITY
		});

		expect(result.files).toHaveLength(40);
		expect(result.files.map(file => file.name)).not.toContain("Huge.java");
		expect(result.files.map(file => file.name)).not.toContain("File40.java");
		expect(result.skippedFiles).toEqual(
			expect.arrayContaining([
				"Huge.java (too large)",
				"File40.java (too many files)",
				"File41.java (too many files)"
			])
		);
	});

	it("keeps BlueJ ZIP extraction filtered before file inflation", () => {
		const exportSource = readFileSync(
			resolve(__dirname, "../src/modules/blueJProjectExport.ts"),
			"utf8"
		);

		expect(exportSource).toContain("unzipSync(archiveBytes, {");
		expect(exportSource).toContain(
			"DEFAULT_BLUEJ_IMPORT_MAX_ARCHIVE_BYTES"
		);
		expect(exportSource).toContain(
			"archiveBytes.byteLength > maxArchiveBytes"
		);
		expect(exportSource).toContain("boundedBlueJImportArchiveByteLimit");
		expect(exportSource).toContain("filter(file)");
		expect(exportSource).toContain("boundedBlueJImportLimit");
		expect(exportSource).toContain("file.originalSize > maxTextFileBytes");
		expect(exportSource).toContain("prefilteredSkippedFiles.push");
		expect(exportSource).toContain("DEFAULT_BLUEJ_IMPORT_MAX_FILES");
	});

	it("colors visible bracket pairs using document-wide nesting context", () => {
		const filler = Array.from(
			{ length: 350 },
			(_, index) => `value_${index} = ${index}`
		).join("\n");
		const doc = `outer = (\n${filler}\ninner = [1, (2 + 3)]\n)\n`;
		const visibleFrom = doc.indexOf("inner =");
		const visibleTo = visibleFrom + "inner = [1, (2 + 3)]".length;
		const ranges = pythonBracketPairColorRanges(pythonEditorState(doc), [
			{ from: visibleFrom, to: visibleTo }
		]);
		const byPosition = new Map(ranges.map(range => [range.from, range]));
		const squareOpen = doc.indexOf("[", visibleFrom);
		const squareClose = doc.indexOf("]", visibleFrom);
		const parenOpen = doc.indexOf("(", visibleFrom);
		const parenClose = doc.indexOf(")", parenOpen);

		expect(byPosition.get(squareOpen)).toMatchObject({
			pairIndex: 1,
			unmatched: false
		});
		expect(byPosition.get(squareClose)).toMatchObject({
			pairIndex: 1,
			unmatched: false
		});
		expect(byPosition.get(parenOpen)).toMatchObject({
			pairIndex: 2,
			unmatched: false
		});
		expect(byPosition.get(parenClose)).toMatchObject({
			pairIndex: 2,
			unmatched: false
		});
	});

	it("colors a visible opener when its matching close is below the viewport", () => {
		const filler = Array.from(
			{ length: 350 },
			(_, index) => `\t${index},`
		).join("\n");
		const doc = `items = (\n${filler}\n)\n`;
		const visibleTo = doc.indexOf("\n") + 1;
		const openParen = doc.indexOf("(");
		const ranges = pythonBracketPairColorRanges(pythonEditorState(doc), [
			{ from: 0, to: visibleTo }
		]);

		expect(ranges).toContainEqual({
			from: openParen,
			pairIndex: 0,
			to: openParen + 1,
			unmatched: false
		});
	});

	it("does not scan hidden bracket text after resolved visible pairs", () => {
		const visibleLine = "value = (1 + 2)\n";
		const hiddenSuffix = Array.from(
			{ length: 350 },
			(_, index) => `hidden_${index} = [${index}]\n`
		).join("");
		const state = pythonEditorState(`${visibleLine}${hiddenSuffix}`);
		const sliceSpy = vi.spyOn(state.doc, "sliceString");
		const ranges = pythonBracketPairColorRanges(state, [
			{ from: 0, to: visibleLine.length }
		]);

		expect(sliceSpy).toHaveBeenCalledTimes(1);
		expect(sliceSpy).toHaveBeenCalledWith(0, visibleLine.length);
		expect(ranges.map(range => range.from)).toEqual([
			visibleLine.indexOf("("),
			visibleLine.indexOf(")")
		]);
	});

	it("caps bracket context scans for distant visible ranges", () => {
		const hiddenPrefix = Array.from(
			{ length: 12000 },
			(_, index) => `prefix_${index} = ${index}\n`
		).join("");
		const visibleLine = "value = (1 + 2)\n";
		const visibleFrom = hiddenPrefix.length;
		const visibleTo = visibleFrom + visibleLine.length;
		const state = pythonEditorState(`${hiddenPrefix}${visibleLine}`);
		const sliceSpy = vi.spyOn(state.doc, "sliceString");
		const ranges = pythonBracketPairColorRanges(state, [
			{ from: visibleFrom, to: visibleTo }
		]);
		const firstCall = sliceSpy.mock.calls[0] ?? [];

		expect(sliceSpy).toHaveBeenCalledTimes(1);
		expect(firstCall[0]).toBeGreaterThan(0);
		expect(firstCall[1]).toBe(visibleTo);
		expect(ranges.map(range => range.from)).toEqual([
			visibleFrom + visibleLine.indexOf("("),
			visibleFrom + visibleLine.indexOf(")")
		]);
	});

	it("caps hidden suffix scans for far-off matching brackets", () => {
		const hiddenMiddle = Array.from(
			{ length: 15000 },
			(_, index) => `hidden_${index} = ${index}\n`
		).join("");
		const doc = `items = (\n${hiddenMiddle})\n`;
		const visibleTo = doc.indexOf("\n") + 1;
		const openParen = doc.indexOf("(");
		const state = pythonEditorState(doc);
		const sliceSpy = vi.spyOn(state.doc, "sliceString");
		const ranges = pythonBracketPairColorRanges(state, [
			{ from: 0, to: visibleTo }
		]);
		const secondCall = sliceSpy.mock.calls[1] ?? [];

		expect(sliceSpy).toHaveBeenCalledTimes(2);
		expect(secondCall[0]).toBe(visibleTo);
		expect(secondCall[1]).toBeLessThan(doc.length);
		expect(ranges).toContainEqual({
			from: openParen,
			pairIndex: 0,
			to: openParen + 1,
			unmatched: true
		});
	});

	it("ignores bracket characters inside Python strings and comments", () => {
		const doc = `text = "("\n# ]\nvalue = (1 + 2)\n`;
		const ranges = pythonBracketPairColorRanges(pythonEditorState(doc), [
			{ from: 0, to: doc.length }
		]);
		const positions = ranges.map(range => range.from);

		expect(positions).not.toContain(doc.indexOf('"("') + 1);
		expect(positions).not.toContain(doc.indexOf("]"));
		expect(positions).toContain(doc.indexOf("(", doc.indexOf("value")));
		expect(positions).toContain(doc.indexOf(")", doc.indexOf("value")));
	});

	it("precomputes Python string and comment ranges for bracket-pair coloring", () => {
		const doc = `text = "("\n# ]\nvalue = (1 + 2)\n`;
		const ranges = pythonBracketPairIgnoredRanges(
			pythonEditorState(doc),
			0,
			doc.length
		);
		const ignoredText = ranges.map(range =>
			doc.slice(range.from, range.to)
		);

		expect(ignoredText).toContain('"("');
		expect(ignoredText).toContain("# ]");
		expect(
			ranges.some(
				range =>
					range.from <= doc.indexOf("(", doc.indexOf("value")) &&
					range.to > doc.indexOf("(", doc.indexOf("value"))
			)
		).toBe(false);
	});

	it("keeps IDE-style scroll-past-end editing enabled in CodeMirror", () => {
		const codeMirrorSource = readFileSync(
			resolve(__dirname, "../src/modules/pythonCodeMirror.ts"),
			"utf8"
		);

		expect(codeMirrorSource).toContain("scrollPastEnd,");
		expect(codeMirrorSource).toContain("scrollPastEnd(),");
	});

	it("creates PyGame course starters with dimensions only", () => {
		const project = createPythonIdeProject("pgzero", {
			courseID: "pygames",
			courseProjectKey: "pygames:course",
			template: "course"
		});

		expect(project.files).toEqual([
			{
				name: "main.py",
				content: pgzeroCourseStarterCode
			}
		]);
		expect(project.files[0]?.content).toContain("WIDTH = 640");
		expect(project.files[0]?.content).toContain("HEIGHT = 400");
		expect(project.files[0]?.content).not.toContain("Actor(");
		expect(project.files[0]?.content).not.toContain("pgzrun.go()");
	});

	it("selects an active file that exists in custom starter files", () => {
		const project = createPythonIdeProject("python", {
			files: [
				{
					name: "lesson.py",
					content: 'print("lesson")\n'
				},
				{
					name: "notes.md",
					content: "# Notes\n"
				}
			]
		});
		const dataProject = createPythonIdeProject("data", {
			files: [
				{
					name: "scores.csv",
					content: "name,score\n"
				}
			]
		});

		expect(project.activeFileName).toBe("lesson.py");
		expect(pythonIdeProjectToPayload(project).activeFileName).toBe(
			"lesson.py"
		);
		expect(resolvePythonIdeActiveFileName(project.files, "notes.md")).toBe(
			"notes.md"
		);
		expect(dataProject.activeFileName).toBe("scores.csv");

		project.activeFileName = "missing.py";
		expect(
			resolvePythonIdeActiveFileName(project.files, "missing.py")
		).toBe("lesson.py");
		expect(pythonIdeProjectToPayload(project).activeFileName).toBe(
			"lesson.py"
		);
	});

	it("preloads the Pyodide runtime script when warming the IDE", () => {
		warmPythonRuntime();
		warmPythonRuntime();

		const preloadSelector =
			'link[rel="preload"][as="script"][href="https://cdn.jsdelivr.net/pyodide/v314.0.0/full/pyodide.js"]';
		const preload = document.head.querySelector(preloadSelector);

		expect(preload).not.toBeNull();
		expect(preload?.getAttribute("crossorigin")).toBe("anonymous");
		expect(document.head.querySelectorAll(preloadSelector)).toHaveLength(1);
		expect(
			document.head.querySelector(
				'link[rel="preconnect"][href="https://cdn.jsdelivr.net"]'
			)
		).not.toBeNull();
	});

	it("primes the Python runtime connection without preloading Pyodide", () => {
		primePythonRuntimeConnection();
		primePythonRuntimeConnection();

		const preconnectSelector =
			'link[rel="preconnect"][href="https://cdn.jsdelivr.net"]';
		const preloadSelector =
			'link[rel="preload"][as="script"][href="https://cdn.jsdelivr.net/pyodide/v314.0.0/full/pyodide.js"]';

		expect(document.head.querySelector(preconnectSelector)).not.toBeNull();
		expect(document.head.querySelectorAll(preconnectSelector)).toHaveLength(
			1
		);
		expect(document.head.querySelector(preloadSelector)).toBeNull();
	});

	it("loads GitHub starter files into safe IDE file names", async () => {
		vi.stubGlobal(
			"fetch",
			vi.fn(async (url: string) => {
				const parsedUrl = new URL(url);
				if (
					parsedUrl.protocol === "https:" &&
					parsedUrl.hostname === "api.github.com"
				) {
					return new Response(
						JSON.stringify([
							{
								download_url:
									"https://raw.githubusercontent.com/example/main.py",
								html_url:
									"https://github.com/example/course/blob/main/starter/main.py",
								name: "main.py",
								path: "starter/main.py",
								size: 18,
								type: "file"
							},
							{
								download_url:
									"https://raw.githubusercontent.com/example/scores.csv",
								html_url:
									"https://github.com/example/course/blob/main/starter/data/scores.csv",
								name: "scores.csv",
								path: "starter/data/scores.csv",
								size: 17,
								type: "file"
							}
						])
					);
				}

				return new Response(
					url.endsWith("main.py")
						? 'print("starter")\n'
						: "name,score\nAri,10\n"
				);
			})
		);

		const files = await loadPythonIdeStarterFilesFromGitHub(
			"https://github.com/instruction-material/Python-Level-1/tree/main/starter"
		);

		expect(files).toEqual([
			{
				name: "main.py",
				content: 'print("starter")\n',
				encoding: "text"
			},
			{
				name: "scores.csv",
				content: "name,score\nAri,10\n",
				encoding: "text"
			}
		]);
	});

	it("serializes remote project payloads with course starter metadata", () => {
		const project = createPythonIdeProject("turtle", {
			courseID: "python-level-1",
			courseProjectKey: "python-level-1:lesson-1:starter",
			courseProjectTitle: "Turtle Coordinates",
			starterLabel: "Starter project",
			starterUrl:
				"https://github.com/instruction-material/Python-Level-1/tree/main/starter"
		});
		const payload = pythonIdeProjectToPayload(project);

		expect(payload).toEqual({
			title: project.title,
			mode: project.mode,
			files: project.files,
			activeFileName: project.activeFileName,
			courseID: "python-level-1",
			courseProjectKey: "python-level-1:lesson-1:starter",
			courseProjectTitle: "Turtle Coordinates",
			starterLabel: "Starter project",
			starterUrl:
				"https://github.com/instruction-material/Python-Level-1/tree/main/starter"
		});
		expect(payload).not.toHaveProperty("_id");
		expect(payload).not.toHaveProperty("createdAt");
		expect(payload).not.toHaveProperty("updatedAt");
	});

	it("serializes imported shared project copies with their source share ID", () => {
		const project = createPythonIdeProject("python", {
			files: [
				{
					name: "main.py",
					content: "print('shared copy')\n"
				}
			],
			sharedSourceID: "share_ABC1234567890_xyz",
			starterLabel: "Shared project",
			starterUrl:
				"https://example.com/ide?share=share_ABC1234567890_xyz",
			title: "Copy of Functions Practice"
		});
		const payload = pythonIdeProjectToPayload(project);

		expect(project.shared).toBe(false);
		expect(payload).toEqual(
			expect.objectContaining({
				sharedSourceID: "share_ABC1234567890_xyz",
				starterLabel: "Shared project",
				starterUrl:
					"https://example.com/ide?share=share_ABC1234567890_xyz"
			})
		);
		expect(payload).not.toHaveProperty("shared");
		expect(payload).not.toHaveProperty("shareID");
	});

	it("rejects malformed Code IDE share IDs before storing source links", async () => {
		expect(isValidPythonIdeShareID("share_ABC1234567890_xyz")).toBe(true);
		expect(isValidPythonIdeShareID("short")).toBe(false);
		expect(isValidPythonIdeShareID("../share_ABC1234567890_xyz")).toBe(
			false
		);
		expect(isValidPythonIdeShareID("share_ABC1234567890_xyz?x=1")).toBe(
			false
		);

		const project = createPythonIdeProject("python", {
			files: [
				{
					name: "main.py",
					content: "print('shared copy')\n"
				}
			],
			sharedSourceID: "../share_ABC1234567890_xyz",
			title: "Copy of Malformed Link"
		});
		const payload = pythonIdeProjectToPayload(project);

		expect(payload).not.toHaveProperty("sharedSourceID");
		await expect(fetchSharedPythonIdeProject("short")).rejects.toThrow(
			"Invalid share link."
		);
	});

	it("keeps remote project payload titles valid without Python-only fallback wording", () => {
		const project = createPythonIdeProject("python");
		const javaProject = createPythonIdeProject("java");
		project.title = "   ";
		javaProject.title = "   ";

		expect(pythonIdeProjectToPayload(project).title).toBe(
			"Untitled Code Project"
		);
		expect(pythonIdeProjectToPayload(javaProject).title).toBe(
			"Untitled Code Project"
		);
	});

	it("clears local Python projects for one storage user only", () => {
		const firstProject = createPythonIdeProject("python");
		const secondProject = createPythonIdeProject("data");

		saveLocalPythonProjects([firstProject], "student-a");
		saveLocalPythonProjects([secondProject], "student-b");

		expect(
			window.localStorage.getItem(pythonIdeStorageKey("student-a"))
		).toContain(firstProject.title);

		clearLocalPythonProjects("student-a");

		expect(loadLocalPythonProjects("student-a")).toEqual([]);
		expect(loadLocalPythonProjects("student-b")).toHaveLength(1);
		expect(
			window.localStorage.getItem(pythonIdeStorageKey("student-b"))
		).toContain(secondProject.title);
	});

	it("uses localStorage fallback when IndexedDB is unavailable", async () => {
		const project = createPythonIdeProject("pgzero");

		await saveLocalPythonProjectsAsync([project], "student-a");

		expect(loadLocalPythonProjects("student-a")).toHaveLength(1);
		await expect(
			loadLocalPythonProjectsAsync("student-a")
		).resolves.toHaveLength(1);

		await clearLocalPythonProjectsAsync("student-a");

		expect(loadLocalPythonProjects("student-a")).toEqual([]);
	});

	it("keeps newer localStorage snapshots ahead of stale IndexedDB records", () => {
		const moduleSource = readFileSync(
			resolve(__dirname, "../src/modules/pythonIde.ts"),
			"utf8"
		);

		expect(moduleSource).toContain("function pythonIdeProjectSetUpdatedAt");
		expect(moduleSource).toContain("const storedProjectsUpdatedAt");
		expect(moduleSource).toContain("const legacyProjectsUpdatedAt");
		expect(moduleSource).toContain(
			"if (legacyProjectsUpdatedAt > storedProjectsUpdatedAt)"
		);
		expect(moduleSource).toContain(
			"await saveLocalPythonProjectsAsync(legacyProjects, userID);"
		);
	});

	it("keeps IndexedDB wired as the primary local project store", () => {
		const moduleSource = readFileSync(
			resolve(__dirname, "../src/modules/pythonIde.ts"),
			"utf8"
		);

		expect(moduleSource).toContain("window.indexedDB.open");
		expect(moduleSource).toContain(
			'const PYTHON_IDE_PROJECT_STORE = "projectStores";'
		);
		expect(moduleSource).toContain(
			"export async function saveLocalPythonProjectsAsync"
		);
		expect(moduleSource).toContain("await writeIndexedDbPythonProjects");
		expect(moduleSource).toContain(
			"saveLegacyLocalPythonProjectsMirror(projects, userID);"
		);
	});

	it("labels supported runtime modes", () => {
		expect(getPythonIdeModeLabel("data")).toBe("Data / AI");
		expect(getPythonIdeModeLabel("java")).toBe("Java");
		expect(getPythonIdeModeLabel("karel")).toBe("Karel Java");
		expect(getPythonIdeModeLabel("python")).toBe("Python");
		expect(getPythonIdeModeLabel("turtle")).toBe("Turtle");
		expect(getPythonIdeModeLabel("pgzero")).toBe("PyGame Zero");
	});

	it("uses one generalized IDE route in navigation and page titles", () => {
		const headerSource = readFileSync(
			resolve(__dirname, "../src/components/TheHeader.vue"),
			"utf8"
		);
		const pageHeadSource = readFileSync(
			resolve(__dirname, "../src/modules/pageHead.ts"),
			"utf8"
		);

		expect(headerSource).toContain('{ label: "IDE", to: "/ide"');
		expect(headerSource).not.toContain('label: "BlueJ IDE"');
		expect(pageHeadSource).toContain(
			'[/^\\/ide(?:\\/|$)/, "IDE"]'
		);
		expect(pageHeadSource).toContain(
			'[/^\\/python-ide(?:\\/|$)/, "IDE"]'
		);
		expect(pageHeadSource).toContain(
			'[/^\\/bluej(?:\\/|$)/, "IDE"]'
		);
	});

	it("opens explicit standalone Code IDE template routes over saved local projects", () => {
		const pageSource = readFileSync(
			resolve(__dirname, "../src/components/CodeIdeWorkspace.vue"),
			"utf8"
		);

		expect(pageSource).toContain(
			'return `ide-template:${requestedStarterMode.value}:${template}`;'
		);
		expect(pageSource).toContain(
			"function standaloneProjectStarterLabel"
		);
		expect(pageSource).toContain(
			'if (template === "demo") return "Demo project";'
		);
		expect(pageSource).toContain(
			"function applyStandaloneRouteMetadata"
		);
		expect(pageSource).toContain(
			"project.courseProjectTitle = project.title;"
		);
		expect(pageSource).toContain(
			"const existingProject = standaloneProjectForRoute(availableProjects);"
		);
	});

	it("maps course families to the right IDE starter modes", () => {
		expect(pythonIdeModeForCourseId("python-level-1")).toBe("turtle");
		expect(pythonIdeModeForCourseId("python-level-1-classroom")).toBe(
			"turtle"
		);
		expect(pythonIdeModeForCourseId("pygames")).toBe("pgzero");
		expect(pythonIdeModeForCourseId("pygames-classroom")).toBe("pgzero");
		expect(pythonIdeModeForCourseId("python-level-2-classroom")).toBe(
			"python"
		);
		expect(pythonIdeModeForCourseId("data-science-in-python")).toBe("data");
		expect(pythonIdeModeForCourseId("machine-learning")).toBe("data");
		expect(pythonIdeModeForCourseId("python-level-3")).toBe("python");
		expect(pythonIdeModeForCourseId("java-level-1")).toBe("karel");
		expect(pythonIdeModeForCourseId("java-level-2")).toBe("java");
		expect(pythonIdeModeForCourseId("ap-computer-science-a")).toBe("java");
		expect(pythonIdeModeForCourseId("scratch-level-1")).toBeNull();
		expect(normalizePythonIdeMode("pgzero", "turtle")).toBe("pgzero");
		expect(normalizePythonIdeMode("java", "turtle")).toBe("java");
		expect(normalizePythonIdeMode("karel", "python")).toBe("karel");
		expect(normalizePythonIdeMode("bluej", "python")).toBe("java");
		expect(normalizePythonIdeMode("unknown", "turtle")).toBe("turtle");
	});

	it("keeps Turtle fill and RGB color hooks wired in the runtime shim", () => {
		const runtimeSource = readFileSync(
			resolve(__dirname, "../src/modules/pythonIdeRuntime.ts"),
			"utf8"
		);
		const pageSource = readFileSync(
			resolve(__dirname, "../src/components/CodeIdeWorkspace.vue"),
			"utf8"
		);

		expect(pageSource).toContain("beginFill: beginTurtleFill");
		expect(pageSource).toContain("endFill: endTurtleFill");
		expect(runtimeSource).toContain("def colormode(cmode=None)");
		expect(runtimeSource).toContain("def _normalize_color(*values)");
		expect(runtimeSource).toContain("def begin_fill(self):");
		expect(runtimeSource).toContain("_bridge.beginFill()");
		expect(runtimeSource).toContain("_bridge.endFill()");
	});

	it("keeps the browser Turtle shim aligned with Python 3.14 API names", () => {
		const runtimeSource = readFileSync(
			resolve(__dirname, "../src/modules/pythonIdeRuntime.ts"),
			"utf8"
		);
		const expectedScreenFunctions = [
			"addshape",
			"bgcolor",
			"bgpic",
			"bye",
			"clearscreen",
			"colormode",
			"delay",
			"exitonclick",
			"getcanvas",
			"getshapes",
			"listen",
			"mainloop",
			"mode",
			"no_animation",
			"numinput",
			"onkey",
			"onkeypress",
			"onkeyrelease",
			"onscreenclick",
			"ontimer",
			"register_shape",
			"resetscreen",
			"save",
			"screensize",
			"setup",
			"setworldcoordinates",
			"textinput",
			"title",
			"tracer",
			"turtles",
			"update",
			"window_height",
			"window_width"
		];
		const expectedTurtleFunctions = [
			"back",
			"backward",
			"begin_fill",
			"begin_poly",
			"bk",
			"circle",
			"clear",
			"clearstamp",
			"clearstamps",
			"clone",
			"color",
			"degrees",
			"distance",
			"dot",
			"down",
			"end_fill",
			"end_poly",
			"fd",
			"fill",
			"fillcolor",
			"filling",
			"forward",
			"get_poly",
			"getpen",
			"getscreen",
			"get_shapepoly",
			"getturtle",
			"goto",
			"heading",
			"hideturtle",
			"home",
			"ht",
			"isdown",
			"isvisible",
			"left",
			"lt",
			"onclick",
			"ondrag",
			"onrelease",
			"pd",
			"pen",
			"pencolor",
			"pendown",
			"pensize",
			"penup",
			"poly",
			"pos",
			"position",
			"pu",
			"radians",
			"reset",
			"resizemode",
			"right",
			"rt",
			"seth",
			"setheading",
			"setpos",
			"setposition",
			"setundobuffer",
			"setx",
			"sety",
			"shape",
			"shapesize",
			"shapetransform",
			"shearfactor",
			"showturtle",
			"speed",
			"st",
			"stamp",
			"teleport",
			"tilt",
			"tiltangle",
			"towards",
			"turtlesize",
			"undo",
			"undobufferentries",
			"up",
			"width",
			"write",
			"xcor",
			"ycor"
		];
		const expectedModuleFunctions = [
			...new Set([
				...expectedScreenFunctions,
				...expectedTurtleFunctions,
				"done",
				"write_docstringdict"
			])
		];

		expect(runtimeSource).toContain(
			'__classes_turtle_api_version__ = "3.14"'
		);
		expect(runtimeSource).toContain("class _FillContext:");
		expect(runtimeSource).toContain("class _NoAnimationContext:");
		expect(runtimeSource).toContain("class Vec2D(tuple):");
		expect(runtimeSource).toContain("class Shape:");
		expect(runtimeSource).toContain("class _CanvasProxy:");
		expect(runtimeSource).toContain("class RawTurtle(Turtle):");
		expect(runtimeSource).toContain("class RawPen(RawTurtle):");
		for (const functionName of expectedModuleFunctions) {
			expect(runtimeSource).toContain(`def ${functionName}(`);
		}
		expect(runtimeSource).toContain("TurtleScreen = _Screen");
		expect(runtimeSource).toContain("ScrolledCanvas = _CanvasProxy");
	});

	it("supports Turtle teleport without drawing a pen line", () => {
		const runtimeSource = readFileSync(
			resolve(__dirname, "../src/modules/pythonIdeRuntime.ts"),
			"utf8"
		);
		const pageSource = readFileSync(
			resolve(__dirname, "../src/components/CodeIdeWorkspace.vue"),
			"utf8"
		);
		const teleportStart = pageSource.indexOf("function teleportTurtle");
		const teleportSource = pageSource.slice(
			teleportStart,
			pageSource.indexOf("function beginTurtleFill", teleportStart)
		);

		expect(runtimeSource).toContain(
			"def teleport(self, x=None, y=None, *, fill_gap=False):"
		);
		expect(runtimeSource).toContain(
			"_bridge.teleport(float(x), float(y), bool(fill_gap))"
		);
		expect(runtimeSource).toContain(
			"teleport: (x: number, y: number, fillGap?: boolean) => void;"
		);
		expect(pageSource).toContain("teleport: teleportTurtle");
		expect(pageSource).toContain(
			"if (isActiveRun()) turtleBridge.teleport(x, y, fillGap);"
		);
		expect(teleportSource).not.toContain('kind: "line"');
		expect(teleportSource).toContain("durationMs: 0");
	});

	it("implements the Python 3.14 Turtle methods that previously used compatibility stubs", () => {
		const runtimeSource = readFileSync(
			resolve(__dirname, "../src/modules/pythonIdeRuntime.ts"),
			"utf8"
		);
		const pageSource = readFileSync(
			resolve(__dirname, "../src/components/CodeIdeWorkspace.vue"),
			"utf8"
		);

		for (const marker of [
			"return _CanvasProxy()",
			"_bridge.bgpic(_bgpic)",
			"_bridge.setScreenSize(",
			"_bridge.setDelay(float(_delay_value))",
			"_bridge.setWorldCoordinates(*_world_coordinates)",
			"_bridge.resetWorldCoordinates()",
			"_bridge.registerShape(shape_name, json.dumps(serialized))",
			"path.write_text(str(_bridge.exportPostScript()), encoding=\"utf-8\")",
			'def __init__(self, shape="classic", undobuffersize=1000, visible=True):',
			"_turtles.clear()",
			"0 < numeric_width <= 1",
			"self._undo_stack.append(self._snapshot(render_count))",
			"_bridge.undo(int(snapshot.get(\"render_count\", 0)))",
			"def write(self, text, move=False, align=\"left\"",
			"@contextmanager\n    def poly(self):",
			"self.screen = _screen",
			"return Vec2D(self.xcor(), self.ycor())",
			"def _get_default():",
			"def onclick(function, btn=1, add=None): _get_default().onclick(",
			'"{}:{}".format(self._bridge_id, btn)',
			"self._refresh_shape_transform()",
			"m11 * x + m12 * y",
			"self._reset_state(sync=False, preserve_angle=True)"
		]) {
			expect(runtimeSource).toContain(marker);
		}

		for (const marker of [
			"function registerTurtleShape",
			"function setTurtleWorldCoordinates",
			"function resetTurtleWorldCoordinates",
			"function flushTurtleAnimation",
			"function exportTurtlePostScript",
			"function undoTurtleDrawing",
			"registerTurtleRelease(",
			"setShapeTransform: setTurtleShapeTransform",
			"context.transform(t22, t12, t21, t11, 0, 0)",
			"context.moveTo(firstPoint[1], firstPoint[0])"
		]) {
			expect(pageSource).toContain(marker);
		}
	});

	it("queues Turtle home with the reset heading in the animated pose", () => {
		const pageSource = readFileSync(
			resolve(__dirname, "../src/components/CodeIdeWorkspace.vue"),
			"utf8"
		);
		const bridgeStart = pageSource.indexOf("const turtleBridge: TurtleBridge =");
		const homeStart = pageSource.indexOf("\n\thome() {", bridgeStart);
		const homeSource = pageSource.slice(
			homeStart,
			pageSource.indexOf("\n\tpenup()", homeStart)
		);

		expect(homeSource).toContain("const fromPose = currentTurtlePose();");
		expect(homeSource).toContain("turtleState.x = 0;");
		expect(homeSource).toContain("turtleState.y = 0;");
		expect(homeSource).toContain("turtleState.heading = 0;");
		expect(homeSource).toContain("const toPose = currentTurtlePose();");
		expect(homeSource).toContain("trackTurtleFillPoint(0, 0);");
		expect(homeSource).toContain('kind: "line"');
		expect(homeSource).toContain("durationMs: turtleMovementDuration(fromPose, toPose)");
		expect(homeSource).not.toContain("this.goto(0, 0);");
	});

	it("keeps Turtle timer hooks wired in the runtime bridge", () => {
		const runtimeSource = readFileSync(
			resolve(__dirname, "../src/modules/pythonIdeRuntime.ts"),
			"utf8"
		);
		const pageSource = readFileSync(
			resolve(__dirname, "../src/components/CodeIdeWorkspace.vue"),
			"utf8"
		);

		expect(runtimeSource).toContain("def ontimer(self, function, t=0):");
		expect(runtimeSource).toContain("def ontimer(function, t=0):");
		expect(runtimeSource).toContain("_bridge.scheduleTimer");
		expect(runtimeSource).toContain("def _release_all_callbacks():");
		expect(runtimeSource).toContain("releaseRuntimeCallbackRegistries");
		expect(runtimeSource).toContain("releasePythonIdeRuntimeCallbacks");
		expect(pageSource).toContain("scheduleTimer(delayMs: number");
		expect(pageSource).toContain("clearTurtleTimers()");
		expect(pageSource).toContain("let turtleTimerGeneration = 0;");
		expect(pageSource).toContain("turtleTimerGeneration += 1;");
		expect(pageSource).toContain("async function runTurtleTimerCallback");
		expect(pageSource).toContain("await waitForTurtleAnimation();");
		expect(pageSource).toContain(
			"if (timerGeneration !== turtleTimerGeneration) return;"
		);
		expect(pageSource).toContain(
			"void runTurtleTimerCallback(callback, timerGeneration).finally("
		);
		expect(pageSource).toContain("releaseIdlePythonRuntimeCallbacks()");
	});

	it("keeps the Run control stable while Turtle callbacks or handlers remain active", () => {
		const pageSource = readFileSync(
			resolve(__dirname, "../src/components/CodeIdeWorkspace.vue"),
			"utf8"
		);
		const runControlStart = pageSource.indexOf(
			"const runControlIsStop = computed"
		);
		const runControlSource = pageSource.slice(
			runControlStart,
			pageSource.indexOf("const selectedModeLabel", runControlStart)
		);
		const bridgeStart = pageSource.indexOf("const turtleBridge: TurtleBridge =");
		const registerStart = pageSource.indexOf("\n\tregisterKey(", bridgeStart);
		const registerSource = pageSource.slice(
			registerStart,
			pageSource.indexOf("listen()", registerStart)
		);
		const stopStart = pageSource.indexOf(
			"function stopActiveRuntimeSurfaces"
		);
		const stopSource = pageSource.slice(
			stopStart,
			pageSource.indexOf("function activateRunControl", stopStart)
		);

		expect(pageSource).toContain(
			"const activeTurtleTimerCallbackCount = ref(0);"
		);
		expect(pageSource).toContain(
			"const activeTurtleEventHandlerCount = ref(0);"
		);
		expect(pageSource).toContain(
			"function refreshActiveTurtleEventHandlerCount"
		);
		expect(runControlSource).toContain("activeTurtleTimerCount.value > 0");
		expect(runControlSource).toContain(
			"activeTurtleTimerCallbackCount.value > 0"
		);
		expect(runControlSource).toContain(
			"activeTurtleEventHandlerCount.value > 0"
		);
		expect(pageSource).toContain(
			"activeTurtleTimerCallbackCount.value += 1;"
		);
		expect(pageSource).toContain(
			"activeTurtleTimerCallbackCount.value = Math.max("
		);
		expect(registerSource).toContain(
			"refreshActiveTurtleEventHandlerCount();"
		);
		expect(stopSource).toContain("turtleKeyPressHandlers.clear();");
		expect(stopSource).toContain("turtleKeyReleaseHandlers.clear();");
		expect(stopSource).toContain("turtleClickHandlers.clear();");
		expect(stopSource).toContain("turtleDragHandlers.clear();");
		expect(stopSource).toContain("refreshActiveTurtleEventHandlerCount();");
	});

	it("focuses the visual output on Run and captures scroll keys there", () => {
		const pageSource = readFileSync(
			resolve(__dirname, "../src/components/CodeIdeWorkspace.vue"),
			"utf8"
		);
		const focusStart = pageSource.indexOf("function focusVisualOutputForRun");
		const focusSource = pageSource.slice(
			focusStart,
			pageSource.indexOf("function activateRunControl", focusStart)
		);
		const keydownStart = pageSource.indexOf("function handleKeyDown");
		const keydownSource = pageSource.slice(
			keydownStart,
			pageSource.indexOf("function handleKeyUp", keydownStart)
		);

		expect(focusSource).toContain('projectMode !== "turtle"');
		expect(focusSource).toContain('projectMode !== "pgzero"');
		expect(focusSource).toContain('projectMode !== "karel"');
		expect(focusSource).toContain(
			'projectMode === "karel" ? karelWorldRef.value : canvasRef.value'
		);
		expect(focusSource).toContain("visualOutput?.focus({ preventScroll: true })");
		expect(focusSource.indexOf("visualOutput?.focus")).toBeLessThan(
			focusSource.indexOf("window.requestAnimationFrame")
		);
		expect(pageSource).toContain("focusVisualOutputForRun();");
		expect(pageSource).toContain(
			"void runCurrentProject().finally(focusVisualOutputForRun);"
		);
		expect(pageSource).toContain('ref="karelWorldRef"');
		expect(pageSource).toContain('aria-label="Karel world"');
		expect(pageSource).toContain('tabindex="0"');
		expect(pageSource).toContain(".karel-shell:focus-visible");
		expect(pageSource).toContain("function isCanvasScrollKey");
		expect(pageSource).toContain("const directAlias = keyboardKeyAliasMap[lowercaseKey]");
		expect(pageSource).toContain('@pointerdown="focusKarelWorldOutput"');
		expect(pageSource).toContain(
			'window.addEventListener("keydown", handleKeyDown, true);'
		);
		expect(keydownSource).toContain('selectedProject.value?.mode === "karel"');
		expect(keydownSource).toContain('selectedProject.value?.mode === "turtle"');
		expect(keydownSource).toContain(
			"isCanvasScrollKey(normalizedTurtleKey)"
		);
		expect(keydownSource).toContain("event.preventDefault();");
		expect(keydownSource).toContain("if (isCanvasScrollKey(normalizedKey))");
	});

	it("keeps Turtle runs animated with a visible cursor marker", () => {
		const pageSource = readFileSync(
			resolve(__dirname, "../src/components/CodeIdeWorkspace.vue"),
			"utf8"
		);

		expect(pageSource).toContain("function drawTurtleMarker");
		expect(pageSource).toContain("function queueTurtleStep");
		expect(pageSource).toContain("function runTurtleAnimationFrame");
		expect(pageSource).toContain(
			"requestAnimationFrame(runTurtleAnimationFrame)"
		);
		expect(pageSource).toContain("await waitForTurtleAnimation()");
		expect(pageSource).toContain("cancelTurtleAnimation()");
	});

	it("keeps Turtle trail drawing synchronized to the visible cursor pose", () => {
		const pageSource = readFileSync(
			resolve(__dirname, "../src/components/CodeIdeWorkspace.vue"),
			"utf8"
		);
		const runtimeSource = readFileSync(
			resolve(__dirname, "../src/modules/pythonIdeRuntime.ts"),
			"utf8"
		);
		const renderCommandStart = pageSource.indexOf(
			"function renderTurtleCommand"
		);
		const renderSceneStart = pageSource.indexOf(
			"function renderTurtleScene"
		);
		const renderCommandSource = pageSource.slice(
			renderCommandStart,
			renderSceneStart
		);
		const renderSceneSource = pageSource.slice(
			renderSceneStart,
			pageSource.indexOf("function resolveActiveTurtleAnimation")
		);
		const forwardStart = runtimeSource.indexOf(
			"    def forward(self, distance):"
		);
		const forwardSource = runtimeSource.slice(
			forwardStart,
			runtimeSource.indexOf("    def fd(self, distance):", forwardStart)
		);
		const gotoStart = runtimeSource.indexOf(
			"    def goto(self, x, y=None):"
		);
		const gotoSource = runtimeSource.slice(
			gotoStart,
			runtimeSource.indexOf("    def setpos(self, x, y=None):", gotoStart)
		);

		expect(renderCommandSource).toContain(
			"activeLineEnd?: { x: number; y: number }"
		);
		expect(renderCommandSource).toContain("activeLineEnd ??");
		expect(renderCommandSource).toContain('context.lineCap = "butt";');
		expect(renderSceneSource).toContain(
			'activeCommand.command.kind === "line"'
		);
		expect(renderSceneSource).toContain(
			"? { x: markerPose.x, y: markerPose.y }"
		);
		expect(pageSource).toContain(
			"turtleAnimationStepDistance(step) <= turtleInstantStepMaxDistance"
		);
		expect(pageSource).not.toContain(
			"return step.durationMs <= turtleInstantStepMaxDurationMs;"
		);
		expect(forwardSource).toContain("next_x = self._x +");
		expect(forwardSource).toContain("next_y = self._y +");
		expect(
			forwardSource.indexOf("self._set_position(next_x, next_y)")
		).toBeLessThan(
			forwardSource.indexOf("_bridge.goto(float(next_x), float(next_y))")
		);
		expect(gotoSource.indexOf("self._set_position(x, y)")).toBeLessThan(
			gotoSource.indexOf("_bridge.goto(float(x), float(y))")
		);
	});

	it("moves the Turtle through standard circle arcs instead of drawing a static circle", () => {
		const runtimeSource = readFileSync(
			resolve(__dirname, "../src/modules/pythonIdeRuntime.ts"),
			"utf8"
		);
		const circleStart = runtimeSource.indexOf(
			"    def circle(self, radius, extent=None, steps=None):"
		);
		const circleSource = runtimeSource.slice(
			circleStart,
			runtimeSource.indexOf(
				"    def dot(self, size=None, *color):",
				circleStart
			)
		);

		expect(circleSource).toContain("if extent is None:");
		expect(circleSource).toContain("extent_degrees = 360.0");
		expect(circleSource).toContain(
			"extent_degrees = self._angle_to_degrees(extent)"
		);
		expect(circleSource).toContain("steps = 1 + int(");
		expect(circleSource).toContain("turn = extent_degrees / steps");
		expect(circleSource).toContain("half_turn = turn * 0.5");
		expect(circleSource).toContain(
			"side_length = 2.0 * radius * math.sin(math.radians(half_turn))"
		);
		expect(circleSource).toContain("if radius < 0:");
		expect(circleSource).toContain("self._turn_left_degrees(half_turn)");
		expect(circleSource).toContain("for _ in range(steps):");
		expect(circleSource).toContain("self.forward(side_length)");
		expect(circleSource).toContain("self._turn_left_degrees(turn)");
		expect(circleSource).toContain("self._turn_left_degrees(-half_turn)");
		expect(circleSource).not.toContain("_bridge.circle(float(radius))");
	});

	it("supports standard Turtle dot size and color overloads", () => {
		const runtimeSource = readFileSync(
			resolve(__dirname, "../src/modules/pythonIdeRuntime.ts"),
			"utf8"
		);
		const dotStart = runtimeSource.indexOf(
			"    def dot(self, size=None, *color):"
		);
		const dotSource = runtimeSource.slice(
			dotStart,
			runtimeSource.indexOf("    def stamp(self):", dotStart)
		);

		expect(runtimeSource).toContain("def _looks_like_color(value):");
		expect(runtimeSource).toContain(
			"return len(sequence) >= 3 and all(_is_number(part) for part in sequence[:3])"
		);
		expect(runtimeSource).toContain("def _default_dot_size(self):");
		expect(runtimeSource).toContain(
			"return self._line_width + max(self._line_width, 4.0)"
		);
		expect(dotSource).toContain("if _looks_like_color(size):");
		expect(dotSource).toContain("dot_size = self._default_dot_size()");
		expect(dotSource).toContain("dot_color = _normalize_color(size)");
		expect(dotSource).toContain(
			"dot_size = size or self._default_dot_size()"
		);
		expect(dotSource).toContain("dot_color = _normalize_color(*color)");
		expect(dotSource).toContain(
			"_bridge.dot(float(dot_size), str(dot_color))"
		);
		expect(runtimeSource).toContain(
			"def dot(size=None, *color): _get_default().dot(size, *color)"
		);
	});

	it("clears Turtle stamps from the visible canvas bridge", () => {
		const runtimeSource = readFileSync(
			resolve(__dirname, "../src/modules/pythonIdeRuntime.ts"),
			"utf8"
		);
		const pageSource = readFileSync(
			resolve(__dirname, "../src/components/CodeIdeWorkspace.vue"),
			"utf8"
		);
		const clearStampStart = runtimeSource.indexOf(
			"    def clearstamp(self, stampid):"
		);
		const clearStampSource = runtimeSource.slice(
			clearStampStart,
			runtimeSource.indexOf("    def undo(self):", clearStampStart)
		);

		expect(runtimeSource).toContain(
			"clearStamp: (stampID: number) => void;"
		);
		expect(clearStampSource).toContain("removed = False");
		expect(clearStampSource).toContain("_bridge.clearStamp(int(stampid))");
		expect(clearStampSource).toContain("removed_stamps = []");
		expect(clearStampSource).toContain("for stampid in removed_stamps:");
		expect(pageSource).toContain("stampID: number;");
		expect(pageSource).toContain(
			"function clearTurtleStamp(stampID: number)"
		);
		expect(pageSource).toContain(
			'command.kind === "stamp" && command.stampID === stampID'
		);
		expect(pageSource).toContain("clearStamp: clearTurtleStamp");
		expect(pageSource).toContain(
			"if (isActiveRun()) turtleBridge.clearStamp(stampID);"
		);
	});

	it("normalizes spaced Turtle color names for browser canvas rendering", () => {
		const runtimeSource = readFileSync(
			resolve(__dirname, "../src/modules/pythonIdeRuntime.ts"),
			"utf8"
		);
		const normalizeStart = runtimeSource.indexOf(
			"def _normalize_color(*values):"
		);
		const normalizeSource = runtimeSource.slice(
			normalizeStart,
			runtimeSource.indexOf(
				"def _looks_like_color(value):",
				normalizeStart
			)
		);

		expect(normalizeSource).toContain('return value.replace(" ", "")');
	});

	it("renders the original Turtle built-in shapes with classic as default", () => {
		const pageSource = readFileSync(
			resolve(__dirname, "../src/components/CodeIdeWorkspace.vue"),
			"utf8"
		);
		const runtimeSource = readFileSync(
			resolve(__dirname, "../src/modules/pythonIdeRuntime.ts"),
			"utf8"
		);
		const markerStart = pageSource.indexOf("function drawTurtleMarker");
		const markerEnd = pageSource.indexOf(
			"function renderTurtleCommand",
			markerStart
		);
		const markerSource = pageSource.slice(markerStart, markerEnd);

		expect(pageSource).toContain(
			'const defaultTurtleShape: TurtleShapeName = "classic"'
		);
		expect(pageSource).toContain("shape: defaultTurtleShape");
		expect(pageSource).toContain('penColor: "#000000"');
		expect(pageSource).toContain("const turtleOriginalShapePolygons = {");
		expect(pageSource).toContain("classic: [");
		expect(pageSource).toContain("[0, 0]");
		expect(pageSource).toContain("[0, 16]");
		expect(pageSource).toContain("function drawClassicTurtleShape");
		expect(pageSource).toContain("function drawArrowTurtleShape");
		expect(pageSource).toContain("function drawOriginalTurtleShape");
		expect(pageSource).toContain("function drawFancyTurtleShape");
		expect(pageSource).toContain("function drawOriginalTurtlePolygonShape");
		expect(pageSource).toContain(
			"context.moveTo(firstPoint[1], firstPoint[0])"
		);
		expect(pageSource).toContain(
			"for (const [x, y] of remainingPoints) context.lineTo(y, x);"
		);
		expect(markerSource).toContain("context.rotate(-radians)");
		expect(markerSource).toContain('case "classic"');
		expect(markerSource).toContain('case "turtle"');
		expect(markerSource).toContain('case "blank"');
		expect(markerSource).toContain('case "fancy"');
		expect(runtimeSource).toContain(
			'_builtin_shapes = {"arrow", "blank", "circle", "classic", "fancy", "square", "triangle", "turtle"}'
		);
		expect(runtimeSource).toContain('self._shape = "classic"');
		expect(runtimeSource).toContain("def shape(self, *_args):");
		expect(runtimeSource).toContain("def hideturtle(self):");
		expect(runtimeSource).toContain("def showturtle(self):");
		expect(runtimeSource).toContain("def isvisible(self):");
		expect(runtimeSource).toContain(
			"def hideturtle(): return _get_default().hideturtle()"
		);
	});

	it("guards long-running student loops before executing Python files", () => {
		const runtimeSource = readFileSync(
			resolve(__dirname, "../src/modules/pythonIdeRuntime.ts"),
			"utf8"
		);
		const pageSource = readFileSync(
			resolve(__dirname, "../src/components/CodeIdeWorkspace.vue"),
			"utf8"
		);

		expect(runtimeSource).toContain("const FOR_LOOP_ITERATION_LIMIT");
		expect(runtimeSource).toContain(
			"const PYTHON_IDE_RUNTIME_BOOTSTRAP_VERSION"
		);
		expect(runtimeSource).toContain("__classes_runtime_bootstrap_version");
		expect(runtimeSource).toContain("2026-07-09-python-314-turtle-parity");
		expect(runtimeSource).toContain("const WHILE_LOOP_ITERATION_LIMIT");
		expect(runtimeSource).toContain(
			"const TURTLE_COOPERATIVE_WHILE_LOOP_ITERATION_LIMIT"
		);
		expect(runtimeSource).toContain(
			"const TURTLE_COOPERATIVE_WHILE_LOOP_ITERATION_LIMIT = 0"
		);
		expect(runtimeSource).toContain(
			"const TURTLE_COOPERATIVE_LOOP_DELAY_MS = 8"
		);
		expect(runtimeSource).toContain("class __ClassesLoopGuardTransformer");
		expect(runtimeSource).toContain("def __classes_loop_guard(kind):");
		expect(runtimeSource).toContain("if limit <= 0:");
		expect(runtimeSource).toContain("__classes_loop_iteration_limits");
		expect(runtimeSource).toContain(
			"__classes_turtle_animation_call_names"
		);
		expect(runtimeSource).toContain("def __classes_schedule_turtle_loop");
		expect(runtimeSource).toContain("def _is_simple_top_level_turtle_loop");
		expect(runtimeSource).toContain("def _module_imports_turtle");
		expect(runtimeSource).toContain("def _node_uses_turtle_api");
		expect(runtimeSource).toContain("def _module_turtle_helper_names");
		expect(runtimeSource).toContain("def _is_forever_while_loop");
		expect(runtimeSource).toContain("node.test.value in (True, 1)");
		expect(runtimeSource).toContain("function.id in turtle_helper_names");
		expect(runtimeSource).toContain("def __classes_sleep(_seconds=0):");
		expect(runtimeSource).toContain(
			"__classes_time.sleep = __classes_sleep"
		);
		expect(runtimeSource).toContain("__classes_compile_student_source(");
		expect(runtimeSource).toContain("class __ClassesProjectSourceLoader");
		expect(runtimeSource).toContain(
			"return _classes_compile_student_source(source, path)"
		);
		expect(runtimeSource).toContain("class __ClassesProjectImportFinder");
		expect(runtimeSource).toContain(
			"__classes_install_project_import_hook()"
		);
		expect(runtimeSource).toContain(
			"createInputBootstrap(options.inputText, options.mode)"
		);
		expect(runtimeSource).toContain("visit_While");
		expect(runtimeSource).toContain("visit_For");
		expect(runtimeSource).toContain("visit_Module");
		expect(runtimeSource).toContain("ast.get_source_segment");
		expect(pageSource).toContain("function formatPythonRuntimeError");
		expect(pageSource).toContain("const pythonTracebackFrameRegex");
		expect(pageSource).toContain("function markPythonRuntimeErrorInEditor");
		expect(pageSource).toContain("pythonRuntimeDiagnosticForLine");
		expect(pageSource).toContain("pythonRuntimeDiagnosticEffect");
		expect(pageSource).toContain(
			"selection: { anchor: diagnostic.from, head: diagnostic.to }"
		);
		expect(pageSource).toContain("scrollIntoView: true");
		expect(pageSource).toContain(
			"RuntimeError: Stopped a long-running (?:for|while) loop"
		);
		expect(pageSource).toContain("formatPythonRuntimeError(error)");
	});

	it("keeps tiny Turtle animation steps responsive for continuous movement", () => {
		const pageSource = readFileSync(
			resolve(__dirname, "../src/components/CodeIdeWorkspace.vue"),
			"utf8"
		);

		expect(pageSource).toContain("const turtleDefaultSpeed = 3");
		expect(pageSource).toContain(
			"const turtleDistanceDurationMsPerPixelAtDefaultSpeed = 5"
		);
		expect(pageSource).toContain("function turtleAnimationSpeedScale");
		expect(pageSource).toContain(
			"return turtleDefaultSpeed / normalizedSpeed;"
		);
		expect(pageSource).toContain(
			"distance *\n\t\t\t\t\tturtleDistanceDurationMsPerPixelAtDefaultSpeed *\n\t\t\t\t\tspeedScale"
		);
		expect(pageSource).toContain(
			"const turtleAnimationInitialFrameCreditMs = 16"
		);
		expect(pageSource).toContain(
			"const turtleInstantStepMaxDurationMs = 16"
		);
		expect(pageSource).toContain(
			"const turtleTurnStepDurationMs = turtleInstantStepMaxDurationMs"
		);
		expect(pageSource).toContain("const turtleInstantStepMaxDistance = 2");
		expect(pageSource).toContain(
			"const turtleInstantFrameDistanceBudget = 12"
		);
		expect(pageSource).toContain("const turtleInstantFrameStepBudget = 24");
		expect(pageSource).toContain(
			"step.durationMs <= turtleInstantStepMaxDurationMs"
		);
		expect(pageSource).toContain("!isVisibleTurtleTrailStep(step)");
		expect(pageSource).toContain(
			"turtleAnimationStepDistance(step) <= turtleInstantStepMaxDistance"
		);
		expect(pageSource).toContain("let turtleVisiblePoses");
		expect(pageSource).toContain("function setTurtleVisiblePose");
		expect(pageSource).toContain(
			"markerPose = visibleTurtlePose(synchronizedTurtleID)"
		);
		expect(pageSource).toContain("Math.min(");
		expect(pageSource).toContain("turtleAnimationInitialFrameCreditMs,");
		expect(pageSource).toContain(
			"activeTurtleAnimationStep?.durationMs ?? 0"
		);
		expect(pageSource).toContain(
			"setTurtleVisiblePose(markerPose, step.turtleID)"
		);
		expect(pageSource).toContain(
			"setTurtleVisiblePose(step.toPose, step.turtleID)"
		);
		expect(pageSource).toContain("renderTurtleScene();");
	});

	it("keeps repeated Turtle turn controls off the slow animation queue", () => {
		const pageSource = readFileSync(
			resolve(__dirname, "../src/components/CodeIdeWorkspace.vue"),
			"utf8"
		);

		expect(pageSource).toContain(
			"if (headingDelta > 0)\n\t\treturn Math.max(1, turtleTurnStepDurationMs * speedScale * delayScale);"
		);
		expect(pageSource).not.toContain(
			"return Math.min(260, Math.max(90, headingDelta * 1.5));"
		);
	});

	it("supports Turtle speed and tracer animation controls", () => {
		const pageSource = readFileSync(
			resolve(__dirname, "../src/components/CodeIdeWorkspace.vue"),
			"utf8"
		);
		const runtimeSource = readFileSync(
			resolve(__dirname, "../src/modules/pythonIdeRuntime.ts"),
			"utf8"
		);

		expect(pageSource).toContain("let turtleTracerEnabled = true;");
		expect(pageSource).toContain(
			"if (!turtleTracerEnabled || fromPose.speed === 0)"
		);
		expect(pageSource).toContain("return 0;");
		expect(pageSource).toContain(
			"const speedScale = turtleAnimationSpeedScale"
		);
		expect(pageSource).toContain("if (step.durationMs <= 0)");
		expect(pageSource).toContain("Math.max(1, Math.min(10, speed))");
		expect(pageSource).toContain("setSpeed(speed: number)");
		expect(pageSource).toContain("setTracer(value: number)");
		expect(pageSource).toContain("setDelay(delayMs: number)");
		expect(pageSource).toContain("const delayScale =");
		expect(pageSource).toContain("update: flushTurtleAnimation");
		expect(runtimeSource).toContain("def _normalize_turtle_speed(value):");
		expect(runtimeSource).toContain('"fastest": 0.0');
		expect(runtimeSource).toContain(
			"def tracer(n=None, delay=None): return _screen.tracer(n, delay)"
		);
		expect(runtimeSource).toContain(
			"def update(): return _screen.update()"
		);
		expect(runtimeSource).toContain("_bridge.setSpeed(float(self._speed))");
		expect(runtimeSource).toContain(
			"_bridge.setTracer(float(_tracer_value))"
		);
	});

	it("keeps the Turtle cursor drawn directly above its trail", () => {
		const pageSource = readFileSync(
			resolve(__dirname, "../src/components/CodeIdeWorkspace.vue"),
			"utf8"
		);
		const markerStart = pageSource.indexOf("function drawTurtleMarker");
		const markerEnd = pageSource.indexOf(
			"function drawClassicTurtleShape",
			markerStart
		);
		const markerSource = pageSource.slice(markerStart, markerEnd);

		expect(markerSource).toContain("if (!pose.visible) return;");
		expect(markerSource).not.toContain("drawTurtleMarkerTrailMask");
		expect(pageSource).not.toContain("function drawTurtleMarkerTrailMask");
		expect(
			markerSource.indexOf("context.translate(point.x, point.y)")
		).toBeLessThan(
			markerSource.indexOf("context.strokeStyle = pose.penColor")
		);
		expect(pageSource).toContain("const turtleMarkerHaloLineWidth = 4");
		expect(pageSource).toContain("const turtleMarkerStrokeLineWidth = 1.2");
		expect(pageSource).toContain(
			"context.strokeStyle = turtleState.background"
		);
		expect(pageSource).toContain(
			"context.lineWidth = turtleMarkerHaloLineWidth"
		);
		expect(pageSource).toContain("context.fillStyle = markerColor");
		expect(pageSource).toContain(
			"context.lineWidth = turtleMarkerStrokeLineWidth"
		);
	});

	it("keeps visible Turtle trail steps out of instant batching", () => {
		const pageSource = readFileSync(
			resolve(__dirname, "../src/components/CodeIdeWorkspace.vue"),
			"utf8"
		);
		const instantStart = pageSource.indexOf(
			"function isInstantTurtleAnimationStep"
		);
		const instantSource = pageSource.slice(
			instantStart,
			pageSource.indexOf(
				"function isVisibleTurtleTrailStep",
				instantStart
			)
		);
		const flushStart = pageSource.indexOf(
			"function flushInstantTurtleAnimationSteps"
		);
		const flushSource = pageSource.slice(
			flushStart,
			pageSource.indexOf("function scheduleTurtleAnimation", flushStart)
		);

		expect(pageSource).toContain(
			"function flushInstantTurtleAnimationSteps"
		);
		expect(instantSource).toContain("!isVisibleTurtleTrailStep(step)");
		expect(pageSource).toContain("function isVisibleTurtleTrailStep");
		expect(flushSource).toContain(
			"consumedDistance < turtleInstantFrameDistanceBudget"
		);
		expect(flushSource).toContain(
			"consumedSteps < turtleInstantFrameStepBudget"
		);
		expect(flushSource).toContain("completeTurtleAnimationStep(step);");
		expect(flushSource).toContain(
			"renderTurtleScene(markerPose, undefined, synchronizedTurtleID);"
		);
		expect(flushSource).not.toContain("renderedActiveLineStep");
		expect(pageSource).toContain("void scheduleTurtleAnimation();");
	});

	it("keeps separate browser poses for independent Turtle instances", () => {
		const pageSource = readFileSync(
			resolve(__dirname, "../src/components/CodeIdeWorkspace.vue"),
			"utf8"
		);
		const runtimeSource = readFileSync(
			resolve(__dirname, "../src/modules/pythonIdeRuntime.ts"),
			"utf8"
		);

		expect(runtimeSource).toContain("_turtle_counter = 0");
		expect(runtimeSource).toContain(
			"self._bridge_id = str(_turtle_counter)"
		);
		expect(runtimeSource).toContain(
			"_bridge.activate(str(self._bridge_id))"
		);
		expect(runtimeSource).toContain("activate: (id: string) => void");
		expect(runtimeSource).toContain("clearTurtle: () => void");
		expect(runtimeSource).toContain("resetTurtle: () => void");
		expect(pageSource).toContain('const defaultTurtleID = "default"');
		expect(pageSource).toContain("let activeTurtleID = defaultTurtleID");
		expect(pageSource).toContain("let turtleVisiblePoses = new Map");
		expect(pageSource).toContain("interface TurtleCompletedCommand");
		expect(pageSource).toContain("function activateTurtleState");
		expect(pageSource).toContain("turtleStates.delete(defaultTurtleID)");
		expect(pageSource).toContain(
			"turtleID: step.turtleID ?? activeTurtleID"
		);
		expect(pageSource).toContain(
			"activeTurtleAnimationStep.turtleID === synchronizedTurtleID"
		);
		expect(pageSource).toContain(
			"for (const [turtleID, pose] of turtleVisiblePoses)"
		);
		expect(pageSource).toContain("activate(id: string)");
	});

	it("keeps Turtle clear and reset scoped to the active Turtle", () => {
		const pageSource = readFileSync(
			resolve(__dirname, "../src/components/CodeIdeWorkspace.vue"),
			"utf8"
		);
		const runtimeSource = readFileSync(
			resolve(__dirname, "../src/modules/pythonIdeRuntime.ts"),
			"utf8"
		);
		const turtleClearStart = runtimeSource.indexOf(
			"    def clear(self):",
				runtimeSource.indexOf("class Turtle:")
		);
		const turtleClearSource = runtimeSource.slice(
			turtleClearStart,
			runtimeSource.indexOf("    def reset(self):", turtleClearStart)
		);
		const turtleResetStart = runtimeSource.indexOf(
			"    def reset(self):",
			turtleClearStart
		);
		const turtleResetSource = runtimeSource.slice(
			turtleResetStart,
			runtimeSource.indexOf("    def distance(self", turtleResetStart)
		);

		expect(turtleClearSource).toContain("_bridge.clearTurtle()");
		expect(turtleClearSource).not.toContain("_bridge.clear()");
		expect(turtleResetSource).toContain("_bridge.resetTurtle()");
		expect(turtleResetSource).not.toContain("_bridge.reset()");
		expect(pageSource).toContain("function cancelActiveTurtleDrawingSteps");
		expect(pageSource).toContain(
			"command => command.turtleID !== turtleID"
		);
		expect(pageSource).toContain("step => step.turtleID !== turtleID");
		expect(pageSource).toContain("function clearActiveTurtleDrawing");
		expect(pageSource).toContain("function resetActiveTurtle");
		expect(pageSource).toContain("resetTurtle: resetActiveTurtle");
		expect(pageSource).toContain("clearTurtle: clearActiveTurtleDrawing");
		expect(pageSource).toContain("reset: resetTurtleCanvas");
		expect(pageSource).toContain("clear: resetTurtleCanvas");
		expect(pageSource).toContain(
			"for (const state of turtleStates.values()) state.background = color"
		);
		expect(pageSource).toContain("renderTurtleScene();");
	});

	it("keeps visible Turtle trail movement on the synchronized animation path", () => {
		const pageSource = readFileSync(
			resolve(__dirname, "../src/components/CodeIdeWorkspace.vue"),
			"utf8"
		);
		const instantStart = pageSource.indexOf(
			"function isInstantTurtleAnimationStep"
		);
		const instantSource = pageSource.slice(
			instantStart,
			pageSource.indexOf(
				"function isVisibleTurtleTrailStep",
				instantStart
			)
		);
		const flushStart = pageSource.indexOf(
			"function flushInstantTurtleAnimationSteps"
		);
		const flushSource = pageSource.slice(
			flushStart,
			pageSource.indexOf("function scheduleTurtleAnimation", flushStart)
		);

		expect(pageSource).toContain("function isVisibleTurtleTrailStep");
		expect(pageSource).toContain('step.command?.kind === "line"');
		expect(instantSource).toContain("!isVisibleTurtleTrailStep(step)");
		expect(flushSource).not.toContain("synchronizedTrailBatch");
		expect(flushSource).not.toContain("renderedActiveLineStep");
		expect(flushSource).toContain(
			"renderTurtleScene(markerPose, undefined, synchronizedTurtleID);"
		);
	});

	it("fast-forwards stale Turtle animation backlog without making every line instant", () => {
		const pageSource = readFileSync(
			resolve(__dirname, "../src/components/CodeIdeWorkspace.vue"),
			"utf8"
		);
		const backlogStart = pageSource.indexOf(
			"function flushBackloggedTurtleAnimationSteps"
		);
		const backlogSource = pageSource.slice(
			backlogStart,
			pageSource.indexOf("function scheduleTurtleAnimation", backlogStart)
		);
		const runFrameStart = pageSource.indexOf(
			"function runTurtleAnimationFrame"
		);
		const runFrameSource = pageSource.slice(
			runFrameStart,
			pageSource.indexOf(
				"function isInstantTurtleAnimationStep",
				runFrameStart
			)
		);
		const shouldFastForwardStart = pageSource.indexOf(
			"function shouldFastForwardTurtleBacklog"
		);
		const shouldFastForwardSource = pageSource.slice(
			shouldFastForwardStart,
			pageSource.indexOf(
				"function resolveActiveTurtleAnimation",
				shouldFastForwardStart
			)
		);
		const lineCommandStart = pageSource.indexOf(
			'if (command.kind === "line")'
		);
		const lineCommandSource = pageSource.slice(
			lineCommandStart,
			pageSource.indexOf("if (progress < 1) return;", lineCommandStart)
		);

		expect(pageSource).toContain(
			"const turtleBacklogFastForwardStepThreshold = 18"
		);
		expect(pageSource).toContain("function shouldFastForwardTurtleBacklog");
		expect(shouldFastForwardSource).toContain(
			"!isVisibleTurtleTrailStep(step)"
		);
		expect(pageSource).toContain(
			"function turtleAnimationBacklogStepCount"
		);
		expect(runFrameSource).toContain(
			"if (shouldFastForwardTurtleBacklog(step))"
		);
		expect(
			runFrameSource.indexOf("shouldFastForwardTurtleBacklog")
		).toBeLessThan(runFrameSource.indexOf("isInstantTurtleAnimationStep"));
		expect(backlogSource).toContain(
			"activeTurtleAnimationStep.turtleID === synchronizedTurtleID"
		);
		expect(backlogSource).toContain(
			"shouldFastForwardTurtleBacklog(activeTurtleAnimationStep)"
		);
		expect(backlogSource).toContain(
			"consumedSteps < turtleBacklogFrameStepBudget"
		);
		expect(backlogSource).toContain(
			"consumedDistance < turtleBacklogFrameDistanceBudget"
		);
		expect(backlogSource).toContain("completeTurtleAnimationStep(step);");
		expect(backlogSource).toContain(
			"renderTurtleScene(markerPose, undefined, synchronizedTurtleID);"
		);
		expect(lineCommandSource).toContain('context.lineCap = "butt";');
		expect(lineCommandSource).not.toContain(
			'activeLineEnd ? "butt" : "round"'
		);
	});

	it("redraws Turtle canvas resizes without resetting active drawings", () => {
		const pageSource = readFileSync(
			resolve(__dirname, "../src/components/CodeIdeWorkspace.vue"),
			"utf8"
		);
		const resizeCanvasStart = pageSource.indexOf(
			"function resizeCanvasForDisplay"
		);
		const resizeCanvasSource = pageSource.slice(
			resizeCanvasStart,
			pageSource.indexOf("function currentTurtlePose", resizeCanvasStart)
		);
		const gameTransformStart = pageSource.indexOf(
			"function setGameCanvasTransform"
		);
		const gameTransformSource = pageSource.slice(
			gameTransformStart,
			pageSource.indexOf("function clearGameCanvas", gameTransformStart)
		);

		expect(pageSource).toContain("function syncCanvasBitmapSize");
		expect(pageSource).toContain("if (canvas.width !== nextWidth)");
		expect(pageSource).toContain("if (canvas.height !== nextHeight)");
		expect(resizeCanvasSource).toContain(
			"syncCanvasBitmapSize(canvas, rect, dpr);"
		);
		expect(gameTransformSource).toContain(
			"syncCanvasBitmapSize(canvas, rect, dpr);"
		);
		expect(pageSource).toContain("function redrawActiveCanvas");
		expect(pageSource).toContain("renderTurtleScene();");
		expect(pageSource).toContain(
			"new ResizeObserver(() => redrawActiveCanvas())"
		);
	});

	it("maps Turtle coordinates without repeated layout reads per command", () => {
		const pageSource = readFileSync(
			resolve(__dirname, "../src/components/CodeIdeWorkspace.vue"),
			"utf8"
		);
		const coordinateMapperStart = pageSource.indexOf(
			"function createCanvasCoordinateMapper"
		);
		const getCanvasContextStart = pageSource.indexOf(
			"function getCanvasContext"
		);
		const renderCommandStart = pageSource.indexOf(
			"function renderTurtleCommand"
		);
		const renderSceneStart = pageSource.indexOf(
			"function renderTurtleScene"
		);
		const coordinateMapperSource = pageSource.slice(
			coordinateMapperStart,
			getCanvasContextStart
		);
		const renderCommandSource = pageSource.slice(
			renderCommandStart,
			renderSceneStart
		);
		const renderSceneSource = pageSource.slice(
			renderSceneStart,
			pageSource.indexOf("function resolveActiveTurtleAnimation")
		);

		expect(pageSource).toContain("type CanvasCoordinateMapper");
		expect(coordinateMapperSource).not.toContain("getBoundingClientRect()");
		expect(renderCommandSource).toContain(
			"toCanvas: CanvasCoordinateMapper"
		);
		expect(renderCommandSource).not.toContain("getBoundingClientRect()");
		expect(renderSceneSource).toContain(
			"const toCanvas = createCanvasCoordinateMapper(rect);"
		);
		expect(renderSceneSource).toContain(
			"renderTurtleCommand(context, command, toCanvas);"
		);
		expect(renderSceneSource).toContain(
			"drawTurtleMarker(context, markerPose, toCanvas);"
		);
	});

	it("bounds output rendering so print-heavy runs stay responsive", () => {
		const pageSource = readFileSync(
			resolve(__dirname, "../src/components/CodeIdeWorkspace.vue"),
			"utf8"
		);

		expect(pageSource).toContain("const maxOutputLines = 500;");
		expect(pageSource).toContain("const maxOutputTextLength = 12000;");
		expect(pageSource).toContain("outputEntryTruncatedMessage");
		expect(pageSource).toContain("outputHistoryTrimmedMessage");
		expect(pageSource).toContain("text.length > maxOutputTextLength");
		expect(pageSource).toContain(
			"line.text !== outputHistoryTrimmedMessage"
		);
		expect(pageSource).toContain("maxOutputLines - 1");
	});

	it("clears the active canvas when clearing Python output", () => {
		const pageSource = readFileSync(
			resolve(__dirname, "../src/components/CodeIdeWorkspace.vue"),
			"utf8"
		);
		const clearOutputStart = pageSource.indexOf("function clearOutput()");
		const clearOutputSource = pageSource.slice(
			clearOutputStart,
			pageSource.indexOf(
				"function refreshActiveTurtleEventHandlerCount",
				clearOutputStart
			)
		);

		expect(clearOutputSource).toContain("outputLines.value = [];");
		expect(clearOutputSource).toContain("runtimeArtifacts.value = [];");
		expect(clearOutputSource).toContain("resetActiveCanvas();");
		expect(pageSource).toContain('@click="clearOutput"');
	});

	it("bounds runtime artifacts so chart-heavy runs stay responsive", () => {
		const pageSource = readFileSync(
			resolve(__dirname, "../src/components/CodeIdeWorkspace.vue"),
			"utf8"
		);

		expect(pageSource).toContain("const maxRuntimeArtifacts = 12;");
		expect(pageSource).toContain(
			"const maxRuntimeArtifactTextLength = 500000;"
		);
		expect(pageSource).toContain(
			"const maxRuntimeArtifactBase64Length = 1500000;"
		);
		expect(pageSource).toContain(
			"runtimeArtifacts.value.length >= maxRuntimeArtifacts"
		);
		expect(pageSource).toContain(
			"artifact.data.length > maxRuntimeArtifactBase64Length"
		);
		expect(pageSource).toContain(
			"artifact.data.length > maxRuntimeArtifactTextLength"
		);
		expect(pageSource).toContain(
			"`Skipped ${artifact.title}; rendered artifacts must be under ${formatFileSize(maxRuntimeArtifactTextLength)}.`"
		);
	});

	it("keeps rendered HTML artifacts isolated from the IDE page", () => {
		const pageSource = readFileSync(
			resolve(__dirname, "../src/components/CodeIdeWorkspace.vue"),
			"utf8"
		);
		const iframeStart = pageSource.indexOf("<iframe");
		const iframeEnd = pageSource.indexOf("/>", iframeStart);
		const iframeSource = pageSource.slice(iframeStart, iframeEnd);

		expect(pageSource).toContain('artifact.mimeType === "text/html"');
		expect(iframeSource).toContain('v-else-if="artifact.srcdoc"');
		expect(iframeSource).toContain('referrerpolicy="no-referrer"');
		expect(iframeSource).toContain('sandbox="allow-scripts"');
		expect(iframeSource).not.toContain("allow-same-origin");
	});

	it("bounds imported project files before local storage writes", () => {
		const pageSource = readFileSync(
			resolve(__dirname, "../src/components/CodeIdeWorkspace.vue"),
			"utf8"
		);

		expect(pageSource).toContain("const maxPythonIdeProjectFiles = 40;");
		expect(pageSource).toContain(
			"const maxImportedTextFileBytes = 512 * 1024;"
		);
		expect(pageSource).toContain(
			"const maxImportedBinaryFileBytes = 2 * 1024 * 1024;"
		);
		expect(pageSource).toContain("function importedProjectFileSizeLimit");
		expect(pageSource).toContain("file.size > sizeLimit");
		expect(pageSource).toContain(
			"project.files.length >= maxPythonIdeProjectFiles"
		);
		expect(pageSource).toContain(
			"project already has ${maxPythonIdeProjectFiles} files"
		);
		expect(pageSource).toContain(
			"larger than ${formatFileSize(sizeLimit)}"
		);
		expect(pageSource).toContain("await readImportedProjectFile");
		expect(pageSource).toContain("continue;");
	});

	it("checks requested stops before post-run capture and game loop startup", () => {
		const runtimeSource = readFileSync(
			resolve(__dirname, "../src/modules/pythonIdeRuntime.ts"),
			"utf8"
		);
		const pageSource = readFileSync(
			resolve(__dirname, "../src/components/CodeIdeWorkspace.vue"),
			"utf8"
		);
		const captureIndex = runtimeSource.indexOf(
			"options.onProjectFilesUpdate?.(await captureProjectTextFiles(pyodide));"
		);
		const gameLoopIndex = runtimeSource.indexOf(
			"options.gameBridge.consumeLoopRequest();"
		);

		expect(runtimeSource).toContain("shouldStop?: () => boolean;");
		expect(runtimeSource).toContain("function throwIfRunStopped");
		expect(runtimeSource).toContain(
			"Python run stopped before post-run work completed."
		);
		expect(captureIndex).toBeGreaterThan(0);
		expect(
			runtimeSource.lastIndexOf(
				"throwIfRunStopped(options);",
				captureIndex
			)
		).toBeGreaterThan(0);
		expect(gameLoopIndex).toBeGreaterThan(0);
		expect(
			runtimeSource.lastIndexOf(
				"throwIfRunStopped(options);",
				gameLoopIndex
			)
		).toBeGreaterThan(captureIndex);
		expect(runtimeSource).toContain(
			"const runContinuously = options.gameBridge.consumeLoopRequest();"
		);
		expect(runtimeSource).toContain("{ continuous: runContinuously }");
		expect(pageSource).toContain(
			"shouldStop: () => shouldStopPythonIdeRun(runID, project._id)"
		);
		expect(pageSource).toContain(
			"The current run will halt at the next runtime checkpoint."
		);
		expect(pageSource).toContain("function stopActiveRuntimeSurfaces");
		expect(pageSource).toContain("invalidatePythonIdeRuns();");
		expect(pageSource).toContain("isRunning.value = false;");
		expect(pageSource).toContain("invalidateTurtleBridgeRuns();");
		expect(pageSource).toContain("invalidateGameBridgeRuns();");
		expect(pageSource).toContain("stopLoadedPythonRuntimeRun();");
		expect(pageSource).toContain("stopAllGameAudio();");
		expect(pageSource).toContain("gameKeysDown.clear();");
		expect(pageSource).toContain("gameEvents.length = 0;");
		expect(pageSource).toContain("stopRequested.value = true;");
		expect(pageSource).toContain("stopActiveRuntimeSurfaces();");
	});

	it("prevents stale async IDE runs from reviving after stop or project switch", () => {
		const pageSource = readFileSync(
			resolve(__dirname, "../src/components/CodeIdeWorkspace.vue"),
			"utf8"
		);
		const runStart = pageSource.indexOf("async function runCurrentProject");
		const runSource = pageSource.slice(
			runStart,
			pageSource.indexOf("function stopCurrentProject", runStart)
		);
		const stopStart = pageSource.indexOf(
			"function stopActiveRuntimeSurfaces"
		);
		const stopSource = pageSource.slice(
			stopStart,
			pageSource.indexOf("function activateRunControl", stopStart)
		);

		expect(pageSource).toContain("let activePythonIdeRunID = 0;");
		expect(pageSource).toContain("function nextPythonIdeRunID");
		expect(pageSource).toContain("function invalidatePythonIdeRuns");
		expect(pageSource).toContain("function isPythonIdeRunCurrent");
		expect(pageSource).toContain("function shouldStopPythonIdeRun");
		expect(runSource).toContain("const runID = nextPythonIdeRunID();");
		expect(runSource.indexOf("await saveSelectedProject")).toBeLessThan(
			runSource.indexOf(
				"if (shouldStopPythonIdeRun(runID, project._id)) return;"
			)
		);
		expect(runSource).toContain(
			"await ensureGameCourseAssetsLoaded();\n\t\t\tif (shouldStopPythonIdeRun(runID, project._id)) return;"
		);
		expect(runSource).toContain(
			"const { runPythonProject } = await loadPythonRuntimeModule();\n\t\tif (shouldStopPythonIdeRun(runID, project._id)) return;"
		);
		expect(runSource).toContain(
			"shouldStop: () => shouldStopPythonIdeRun(runID, project._id)"
		);
		expect(runSource).toContain(
			"if (isPythonIdeRunCurrent(runID, project._id))"
		);
		expect(stopSource).toContain("invalidatePythonIdeRuns();");
		expect(stopSource).toContain("isRunning.value = false;");
	});

	it("clears stale main-thread Python globals before Turtle and game runs", () => {
		const runtimeSource = readFileSync(
			resolve(__dirname, "../src/modules/pythonIdeRuntime.ts"),
			"utf8"
		);
		const inputBootstrapStart = runtimeSource.indexOf(
			"function createInputBootstrap"
		);
		const inputBootstrapSource = runtimeSource.slice(
			inputBootstrapStart,
			runtimeSource.indexOf("const turtleShim", inputBootstrapStart)
		);
		const runSourceStart = runtimeSource.indexOf(
			"export async function runPythonProject"
		);
		const runSource = runtimeSource.slice(runSourceStart);

		expect(inputBootstrapSource).toContain(
			"def _classes_reset_main_namespace():"
		);
		expect(inputBootstrapSource).toContain(
			'classes_main = classes_bootstrap_sys.modules["__main__"]'
		);
		expect(inputBootstrapSource).toContain(
			"classes_preserved_main_names = {"
		);
		expect(inputBootstrapSource).toContain(
			"for classes_name in list(classes_main.__dict__):"
		);
		expect(inputBootstrapSource).toContain(
			"del classes_main.__dict__[classes_name]"
		);
		expect(inputBootstrapSource).toContain(
			'classes_main.__dict__["__builtins__"] = classes_bootstrap_builtins'
		);
		expect(inputBootstrapSource).toContain(
			'classes_main.__dict__["__name__"] = "__main__"'
		);
		expect(inputBootstrapSource).toContain(
			"_classes_reset_main_namespace()"
		);
		expect(runSource).toContain('__main__.__dict__["__file__"] =');
		expect(runSource).toContain("__classes_compile_student_source(");
		expect(runSource).toContain("__main__.__dict__,");
	});

	it("guards PyGame Zero bridge calls to the active run", () => {
		const pageSource = readFileSync(
			resolve(__dirname, "../src/components/CodeIdeWorkspace.vue"),
			"utf8"
		);
		const guardStart = pageSource.indexOf(
			"function createGuardedGameBridgeRun"
		);
		const guardSource = pageSource.slice(
			guardStart,
			pageSource.indexOf("function resetActiveCanvas", guardStart)
		);

		expect(pageSource).toContain("let activeGameBridgeRunID = 0;");
		expect(pageSource).toContain("function invalidateGameBridgeRuns");
		expect(pageSource).toContain(
			'project.mode === "pgzero"\n\t\t\t\t\t? createGuardedGameBridgeRun()\n\t\t\t\t\t: gameBridge'
		);
		expect(guardSource).toContain("const runID = ++activeGameBridgeRunID;");
		expect(guardSource).toContain(
			"const isActiveRun = () => runID === activeGameBridgeRunID;"
		);
		expect(guardSource).toContain("if (!isActiveRun()) return;");
		expect(guardSource).toContain(
			'return isActiveRun() ? gameBridge.popEventsJson() : "";'
		);
		expect(guardSource).toContain(
			"return isActiveRun() ? gameBridge.playTone(frequency, duration) : 0;"
		);
		expect(guardSource).toContain("gameBridge.fill(color, gcolor);");
	});

	it("guards PyGame Zero loop ticks from stale async completions", () => {
		const pageSource = readFileSync(
			resolve(__dirname, "../src/components/CodeIdeWorkspace.vue"),
			"utf8"
		);
		const startGameLoopStart = pageSource.indexOf("function startGameLoop");
		const startGameLoopSource = pageSource.slice(
			startGameLoopStart,
			pageSource.indexOf("function drawGameActor", startGameLoopStart)
		);
		const stopGameLoopStart = pageSource.indexOf("function stopGameLoop");
		const stopGameLoopSource = pageSource.slice(
			stopGameLoopStart,
			pageSource.indexOf("function stopAllGameAudio", stopGameLoopStart)
		);

		expect(pageSource).toContain("let activeGameLoopID = 0;");
		expect(pageSource).toContain(
			"let gameOnDemandTickFrame: number | null = null;"
		);
		expect(pageSource).toContain("let gameLoopContinuous = false;");
		expect(pageSource).toContain("let gameTickQueued = false;");
		expect(pageSource).toContain(
			"let gameTickCallback: (() => Promise<void>) | null = null;"
		);
		expect(stopGameLoopSource).toContain("activeGameLoopID += 1;");
		expect(startGameLoopSource).toContain(
			"const loopID = ++activeGameLoopID;"
		);
		expect(pageSource).toContain("function requestGameTick");
		expect(pageSource).toContain("function requestContinuousGameLoop");
		expect(pageSource).toContain("async function runGameTick");
		expect(startGameLoopSource).toContain(
			"options: StartGameLoopOptions = {}"
		);
		expect(startGameLoopSource).toContain(
			"gameLoopContinuous = options.continuous ?? true;"
		);
		expect(startGameLoopSource).toContain(
			"if (loopID !== activeGameLoopID || !gameLoopContinuous)"
		);
		expect(startGameLoopSource).toContain(
			"gameAnimationFrame = requestAnimationFrame(runFrame);"
		);
		expect(startGameLoopSource).toContain("void runGameTick(loopID);");
		expect(startGameLoopSource).toContain("requestGameTick();");
		expect(pageSource).toContain(
			"if (!gameTickCallback || gameLoopContinuous) return;"
		);
		expect(pageSource).toContain("gameTickQueued = true;");
		expect(pageSource).toContain("requestContinuousGameLoop();");
		expect(pageSource).toContain("}, options);");
		expect(stopGameLoopSource).toContain(
			"if (gameOnDemandTickFrame !== null)"
		);
	});

	it("guards Turtle bridge calls to the active run", () => {
		const pageSource = readFileSync(
			resolve(__dirname, "../src/components/CodeIdeWorkspace.vue"),
			"utf8"
		);
		const guardStart = pageSource.indexOf(
			"function createGuardedTurtleBridgeRun"
		);
		const guardSource = pageSource.slice(
			guardStart,
			pageSource.indexOf("const gameBridge", guardStart)
		);

		expect(pageSource).toContain("let activeTurtleBridgeRunID = 0;");
		expect(pageSource).toContain("function invalidateTurtleBridgeRuns");
		expect(pageSource).toContain(
			'project.mode === "turtle"\n\t\t\t\t\t? createGuardedTurtleBridgeRun()\n\t\t\t\t\t: turtleBridge'
		);
		expect(guardSource).toContain(
			"const runID = ++activeTurtleBridgeRunID;"
		);
		expect(guardSource).toContain(
			"const isActiveRun = () => runID === activeTurtleBridgeRunID;"
		);
		expect(guardSource).toContain(
			"if (isActiveRun()) turtleBridge.forward(distance);"
		);
		expect(guardSource).toContain("if (isActiveRun()) callback();");
		expect(guardSource).toContain(
			"return isActiveRun() ? turtleBridge.stamp() : 0;"
		);
	});

	it("stops active IDE runtime surfaces when the selected project changes", () => {
		const pageSource = readFileSync(
			resolve(__dirname, "../src/components/CodeIdeWorkspace.vue"),
			"utf8"
		);
		const projectSwitchStart = pageSource.indexOf(
			"watch(selectedProjectID"
		);
		const projectSwitchSource = pageSource.slice(
			projectSwitchStart,
			pageSource.indexOf("watch(", projectSwitchStart + 1)
		);
		const resetGameCanvasStart = pageSource.indexOf(
			"function resetGameCanvas"
		);
		const resetGameCanvasSource = pageSource.slice(
			resetGameCanvasStart,
			pageSource.indexOf("function stopGameLoop", resetGameCanvasStart)
		);

		expect(projectSwitchSource).toContain(
			"const hadRunInFlight = isRunning.value;"
		);
		expect(projectSwitchSource).toContain("stopRequested.value = true;");
		expect(projectSwitchSource).toContain("stopActiveRuntimeSurfaces();");
		expect(projectSwitchSource).toContain('runMessage.value = "Ready";');
		expect(projectSwitchSource).toContain(
			"releaseIdlePythonRuntimeCallbacks();"
		);
		expect(projectSwitchSource).toContain("stopRequested.value = false;");
		expect(projectSwitchSource).toContain(
			"void nextTick(resetActiveCanvas);"
		);
		expect(resetGameCanvasSource).toContain("stopGameLoop();");
	});

	it("allows local-to-remote project ID sync without cancelling the current IDE run", () => {
		const pageSource = readFileSync(
			resolve(__dirname, "../src/components/CodeIdeWorkspace.vue"),
			"utf8"
		);
		const saveStart = pageSource.indexOf("async function saveProjectOnce");
		const saveSource = pageSource.slice(
			saveStart,
			pageSource.indexOf("async function savePendingProjects", saveStart)
		);
		const projectSwitchStart = pageSource.indexOf(
			"watch(selectedProjectID"
		);
		const projectSwitchSource = pageSource.slice(
			projectSwitchStart,
			pageSource.indexOf("watch(", projectSwitchStart + 1)
		);
		const migrationReturnIndex = projectSwitchSource.indexOf("return;");
		const runtimeStopIndex = projectSwitchSource.indexOf(
			"const hadRunInFlight = isRunning.value;"
		);

		expect(pageSource).toContain(
			"let expectedSelectedProjectIDMigration: { from: string; to: string } | null"
		);
		expect(saveSource).toContain("expectedSelectedProjectIDMigration = {");
		expect(saveSource).toContain("from: startedProjectID");
		expect(saveSource).toContain("to: savedProject._id");
		expect(projectSwitchSource).toContain(
			"const expectedMigration = expectedSelectedProjectIDMigration;"
		);
		expect(projectSwitchSource).toContain(
			"previousProjectID === expectedMigration.from"
		);
		expect(projectSwitchSource).toContain(
			"projectID === expectedMigration.to"
		);
		expect(migrationReturnIndex).toBeGreaterThan(0);
		expect(runtimeStopIndex).toBeGreaterThan(migrationReturnIndex);
	});

	it("keeps PyGame Zero image cache entries reusable across canvas resets", () => {
		const pageSource = readFileSync(
			resolve(__dirname, "../src/components/CodeIdeWorkspace.vue"),
			"utf8"
		);
		const resetGameCanvasStart = pageSource.indexOf(
			"function resetGameCanvas"
		);
		const resetGameCanvasSource = pageSource.slice(
			resetGameCanvasStart,
			pageSource.indexOf("function stopGameLoop", resetGameCanvasStart)
		);
		const getGameImageEntryStart = pageSource.indexOf(
			"function getGameImageEntry"
		);
		const getGameImageEntrySource = pageSource.slice(
			getGameImageEntryStart,
			pageSource.indexOf(
				"function courseAssetSize",
				getGameImageEntryStart
			)
		);

		expect(resetGameCanvasSource).not.toContain("gameImageCache.clear()");
		expect(getGameImageEntrySource).toContain(
			"if (cached?.src === src) return cached;"
		);
		expect(getGameImageEntrySource).toContain(
			"gameImageCache.set(asset.key, entry);"
		);
		expect(getGameImageEntrySource).toContain("requestGameTick();");
	});

	it("runs plain Python projects in a terminable Pyodide worker", () => {
		const runtimeSource = readFileSync(
			resolve(__dirname, "../src/modules/pythonIdeRuntime.ts"),
			"utf8"
		);
		const workerSource = readFileSync(
			resolve(__dirname, "../src/workers/pythonIdePlainWorker.ts"),
			"utf8"
		);
		const runtimeHintsSource = readFileSync(
			resolve(__dirname, "../src/modules/pythonIdeRuntimeHints.ts"),
			"utf8"
		);
		const pageSource = readFileSync(
			resolve(__dirname, "../src/components/CodeIdeWorkspace.vue"),
			"utf8"
		);

		expect(runtimeSource).toContain('if (options.mode === "python")');
		expect(runtimeSource).toContain(
			"return runPlainPythonProjectInWorker(options);"
		);
		expect(runtimeSource).toContain('script.crossOrigin = "anonymous";');
		expect(runtimeSource).toContain(
			'new URL("../workers/pythonIdePlainWorker.ts", import.meta.url)'
		);
		expect(runtimeSource).toContain(
			"export function stopPythonIdeRuntimeRun"
		);
		expect(runtimeSource).toContain("terminatePlainPythonWorker()");
		expect(runtimeSource).toContain("function clonePlainPythonIdeFiles");
		expect(runtimeSource).toContain("files: clonePlainPythonIdeFiles");
		expect(pageSource).toContain("stopLoadedPythonRuntimeRun()");
		expect(pageSource).toContain(
			"Plain Python worker is being terminated."
		);
		expect(runtimeHintsSource).toContain("export const PYODIDE_MODULE_SRC");
		expect(workerSource).toContain("PYODIDE_MODULE_SRC");
		expect(workerSource).not.toContain("const PYODIDE_MODULE_SRC =");
		expect(workerSource).toContain("loadPackagesFromImports");
		expect(workerSource).toContain("setStdout");
		expect(workerSource).toContain("setStderr");
		expect(workerSource).toContain("def __classes_run_active_file():");
		expect(workerSource).toContain(
			"for __classes_name in list(__classes_main.__dict__):"
		);
		expect(workerSource).toContain(
			"del __classes_main.__dict__[__classes_name]"
		);
		expect(workerSource).toContain(
			'__classes_main.__dict__["__name__"] = "__main__"'
		);
		expect(workerSource).toContain(
			'__classes_main.__dict__["__file__"] = __classes_active_file'
		);
		expect(workerSource).toContain("captureProjectTextFiles");
		expect(workerSource).toContain("const capturedFiles = files.filter(");
		expect(workerSource).toContain(
			"for (const file of capturedFiles) lastProjectFileNames.add(file.name);"
		);
		expect(workerSource).toContain(
			'import {\n\tisPythonIdeTextFile,\n\tisValidPythonFileName\n} from "@/modules/pythonIde";'
		);
		expect(workerSource).toContain("function decodeBase64File");
		expect(workerSource).toContain("function writeProjectFile");
		expect(workerSource).toContain("function validProjectFiles");
		expect(workerSource).toContain('file.encoding === "base64"');
		expect(workerSource).toContain(
			"const writableFiles = validProjectFiles(files);"
		);
		expect(workerSource).toContain("isValidPythonFileName(file.name)");
		expect(workerSource).toContain("__classes_text_suffixes");
		expect(workerSource).toContain("isPythonIdeTextFile(file.name)");
		expect(workerSource).toContain("function isActiveRun");
		expect(workerSource).toContain("if (!isActiveRun(id)) return;");
		expect(workerSource).toContain("if (!isActiveRun(request.id)) return;");
		expect(workerSource).toContain(
			'import { pythonIdeImportedTopLevelModules } from "@/modules/pythonImportScanner";'
		);
		expect(workerSource).toContain(
			"const loadedPlainPythonImportModules = new Set<string>();"
		);
		expect(workerSource).toContain(
			"function plainPythonPackageScanModules"
		);
		expect(workerSource).toContain(
			"const validFiles = validProjectFiles(files);"
		);
		expect(workerSource).toContain("projectModuleNames(validFiles)");
		expect(workerSource).toContain("const projectModulesToClear =");
		expect(workerSource).toContain(
			"...[...lastProjectFileNames].map(name => ({ name }))"
		);
		expect(workerSource).toContain("projectModulesToClear");
		expect(workerSource).toContain(
			"pythonIdeImportedTopLevelModules(validFiles)"
		);
		expect(workerSource).toContain(
			"!loadedPlainPythonImportModules.has(moduleName)"
		);
		expect(workerSource).toContain(
			"loadedPlainPythonImportModules.add(moduleName)"
		);
	});

	it("allows Pyodide runtime loading to be retried after script failures", () => {
		const runtimeSource = readFileSync(
			resolve(__dirname, "../src/modules/pythonIdeRuntime.ts"),
			"utf8"
		);
		const loadScriptStart = runtimeSource.indexOf("function loadScript");
		const loadScriptSource = runtimeSource.slice(
			loadScriptStart,
			runtimeSource.indexOf(
				"export function warmPythonRuntime",
				loadScriptStart
			)
		);
		const loadRuntimeStart = runtimeSource.indexOf(
			"async function loadRuntime"
		);
		const loadRuntimeSource = runtimeSource.slice(
			loadRuntimeStart,
			runtimeSource.indexOf(
				"const releaseRuntimeCallbackRegistriesSource",
				loadRuntimeStart
			)
		);

		expect(loadScriptSource).toContain(
			'existing.dataset.classesPythonIdeLoadState === "error"'
		);
		expect(loadScriptSource).toContain(
			'existing.dataset.classesPythonIdeLoadState === "loaded"'
		);
		expect(loadScriptSource).toContain("existing.remove();");
		expect(loadScriptSource).toContain(
			'script.dataset.classesPythonIdeLoadState = "loading";'
		);
		expect(loadScriptSource).toContain(
			'script.dataset.classesPythonIdeLoadState = "error";'
		);
		expect(loadScriptSource).toContain("script.remove();");
		expect(loadScriptSource).toContain(
			'existing.addEventListener(\n\t\t\t\t\t"error"'
		);
		expect(runtimeSource).toContain(
			"function removeUninitializedPyodideScript"
		);
		expect(loadRuntimeSource).toContain(
			"const runtimePromise = (async () =>"
		);
		expect(loadRuntimeSource).toContain("pyodidePromise = runtimePromise;");
		expect(loadRuntimeSource).toContain("runtimePromise.catch(() =>");
		expect(loadRuntimeSource).toContain("pyodidePromise = null;");
		expect(loadRuntimeSource).toContain(
			"removeUninitializedPyodideScript();"
		);
	});

	it("preserves PyGame Zero canvas aspect ratio instead of stretching", () => {
		const pageSource = readFileSync(
			resolve(__dirname, "../src/components/CodeIdeWorkspace.vue"),
			"utf8"
		);

		expect(pageSource).toContain("const usesGameCanvas = computed");
		expect(pageSource).toContain("drawingCanvasStyle");
		expect(pageSource).toContain("--python-game-aspect");
		expect(pageSource).toContain("--python-game-max-width");
		expect(pageSource).toContain("canvas-shell--game");
		expect(pageSource).toContain("canvas-frame--game");
		expect(pageSource).toContain("turtle-canvas--game");
		expect(pageSource).toContain("ide-grid--drawing");
		const gameFrameStart = pageSource.indexOf(".canvas-frame--game");
		const gameCanvasStart = pageSource.indexOf(".turtle-canvas--game");
		const gameFrameSource = pageSource.slice(
			gameFrameStart,
			gameCanvasStart
		);
		const gameCanvasSource = pageSource.slice(
			gameCanvasStart,
			pageSource.indexOf(".karel-shell", gameCanvasStart)
		);

		expect(gameFrameSource).toContain(
			"width: min(100%, var(--python-game-max-width, 54rem));"
		);
		expect(gameFrameSource).toContain(
			"aspect-ratio: var(--python-game-aspect, 640 / 400);"
		);
		expect(gameCanvasSource).toContain("height: 100%;");
		expect(gameCanvasSource).not.toContain("height: auto;");
		expect(gameCanvasSource).not.toContain("aspect-ratio:");
		expect(pageSource).toContain(
			".turtle-canvas:not(.turtle-canvas--game)"
		);
	});

	it("bounds the IDE editor grid so long files scroll inside CodeMirror", () => {
		const pageSource = readFileSync(
			resolve(__dirname, "../src/components/CodeIdeWorkspace.vue"),
			"utf8"
		);
		const gridStart = pageSource.indexOf(".ide-grid {");
		const drawingGridStart = pageSource.indexOf(".ide-grid--drawing {");
		const panelStart = pageSource.indexOf(".code-panel,", drawingGridStart);
		const editorShellStart = pageSource.indexOf(".code-editor-shell {");
		const editorHostStart = pageSource.indexOf(".code-editor-host {");
		const gridSource = pageSource.slice(gridStart, drawingGridStart);
		const drawingGridSource = pageSource.slice(
			drawingGridStart,
			panelStart
		);
		const panelSource = pageSource.slice(
			panelStart,
			pageSource.indexOf(".panel-header", panelStart)
		);
		const editorShellSource = pageSource.slice(
			editorShellStart,
			pageSource.indexOf(".code-editor-shell:focus-within")
		);
		const editorHostSource = pageSource.slice(
			editorHostStart,
			pageSource.indexOf(".code-editor-host :deep(.cm-editor)")
		);
		const stackedGridSource = pageSource.slice(
			pageSource.indexOf("@media (max-width: 1180px)"),
			pageSource.indexOf("@media (max-width: 820px)")
		);

		expect(gridSource).toContain("height: clamp(38rem, 76vh, 54rem);");
		expect(drawingGridSource).toContain(
			"height: clamp(40rem, 78vh, 56rem);"
		);
		expect(panelSource).toContain("min-height: 0;");
		expect(panelSource).toContain("overflow: hidden;");
		expect(editorShellSource).toContain("height: 100%;");
		expect(editorShellSource).toContain("min-height: 0;");
		expect(editorHostSource).toContain("height: 100%;");
		expect(editorHostSource).toContain("min-height: 0;");
		expect(stackedGridSource).toContain("height: auto;");
		expect(stackedGridSource).toContain(
			"height: clamp(32rem, 68vh, 44rem);"
		);
		expect(stackedGridSource).toContain(
			"height: clamp(30rem, 68vh, 42rem);"
		);
	});

	it("keeps PyGame Zero actor angles anticlockwise like Pygame Zero", () => {
		const pageSource = readFileSync(
			resolve(__dirname, "../src/components/CodeIdeWorkspace.vue"),
			"utf8"
		);
		const actorStart = pageSource.indexOf("function drawGameActor");
		const imageStart = pageSource.indexOf("function drawGameImage");
		const actorSource = pageSource.slice(actorStart, imageStart);
		const imageSource = pageSource.slice(
			imageStart,
			pageSource.indexOf("function drawGameLine", imageStart)
		);

		expect(actorSource).toContain(
			"context.rotate((-angle * Math.PI) / 180);"
		);
		expect(imageSource).toContain(
			"context.rotate((-angle * Math.PI) / 180);"
		);
		expect(pageSource).not.toContain(
			"context.rotate((angle * Math.PI) / 180);"
		);
	});

	it("keeps Streamlit dashboard widget helpers wired in the runtime shim", () => {
		const runtimeSource = readFileSync(
			resolve(__dirname, "../src/modules/pythonIdeRuntime.ts"),
			"utf8"
		);

		expect(runtimeSource).toContain("def selectbox(");
		expect(runtimeSource).toContain("def multiselect(");
		expect(runtimeSource).toContain("def slider(");
		expect(runtimeSource).toContain("def checkbox(");
		expect(runtimeSource).toContain("def number_input(");
		expect(runtimeSource).toContain("def text_input(");
		expect(runtimeSource).toContain("def metric(");
		expect(runtimeSource).toContain("def columns(");
		expect(runtimeSource).toContain("class _Container:");
		expect(runtimeSource).toContain("sidebar = _Container");
	});

	it("caches runtime package setup after successful Pyodide installs", () => {
		const runtimeSource = readFileSync(
			resolve(__dirname, "../src/modules/pythonIdeRuntime.ts"),
			"utf8"
		);
		const scannerSource = readFileSync(
			resolve(__dirname, "../src/modules/pythonImportScanner.ts"),
			"utf8"
		);

		expect(runtimeSource).toContain(
			"const loadedBrowserShimPackages = new Set<string>();"
		);
		expect(runtimeSource).toContain(
			"const installedMicropipPackages = new Set<string>();"
		);
		expect(runtimeSource).toContain(
			"const loadedPyodideImportModules = new Set<string>();"
		);
		expect(runtimeSource).toContain("function loadPyodideImportPackages");
		expect(runtimeSource).toContain("loadedPyodideImportModules.has");
		expect(runtimeSource).toContain("loadedPyodideImportModules.add");
		expect(runtimeSource).toContain(
			'onOutput("system", `Loading Python packages: ${modules.join(", ")}`);'
		);
		expect(runtimeSource).toContain("let micropipLoaded = false;");
		expect(runtimeSource).toContain(
			"!installedMicropipPackages.has(packageName)"
		);
		expect(runtimeSource).toContain("if (!micropipLoaded)");
		expect(runtimeSource).toContain(
			"installedMicropipPackages.add(packageName)"
		);
		expect(runtimeSource).toContain(
			'loadedBrowserShimPackages.has("numpy")'
		);
		expect(runtimeSource).toContain(
			'loadedBrowserShimPackages.add("numpy")'
		);
		expect(runtimeSource).toContain('from "@/modules/pythonImportScanner"');
		expect(scannerSource).toContain(
			"export function pythonIdeImportedTopLevelModules"
		);
	});

	it("skips standard-library imports before runtime package setup", () => {
		const runtimeSource = readFileSync(
			resolve(__dirname, "../src/modules/pythonIdeRuntime.ts"),
			"utf8"
		);
		const workerSource = readFileSync(
			resolve(__dirname, "../src/workers/pythonIdePlainWorker.ts"),
			"utf8"
		);

		expect(runtimeSource).toContain(
			'import { pythonStandardLibraryModules } from "@/modules/pythonStandardLibraryModules";'
		);
		expect(runtimeSource).toContain("standardLibraryModules: Set<string>");
		expect(runtimeSource).toContain(
			"!standardLibraryModules.has(moduleName)"
		);
		expect(runtimeSource).toContain(
			"const standardLibraryModules = await pythonStandardLibraryModules(pyodide);"
		);
		expect(runtimeSource).toContain(
			"packageScanModules(\n\t\tfiles,\n\t\timportedModules,\n\t\tstandardLibraryModules\n\t)"
		);
		expect(runtimeSource).toContain(
			"await loadPyodideImportPackages(\n\t\tpyodide,\n\t\toptions.files,\n\t\timportedModules,\n\t\toptions.onOutput\n\t);"
		);
		expect(workerSource).toContain(
			'import { pythonStandardLibraryModules } from "@/modules/pythonStandardLibraryModules";'
		);
		expect(workerSource).toContain("standardLibraryModules: Set<string>");
		expect(workerSource).toContain(
			"!standardLibraryModules.has(moduleName)"
		);
		expect(workerSource).toContain(
			"const modules = plainPythonPackageScanModules("
		);
		expect(workerSource).toContain("files,\n\t\tstandardLibraryModules");
	});

	it("loads the standard-library module list from Pyodide once", async () => {
		const runPython = vi.fn(() =>
			JSON.stringify(["csv", "json", "math", "random"])
		);
		const pyodide = { runPython };

		await expect(pythonStandardLibraryModules(pyodide)).resolves.toEqual(
			new Set(["csv", "json", "math", "random"])
		);
		await expect(pythonStandardLibraryModules(pyodide)).resolves.toEqual(
			new Set(["csv", "json", "math", "random"])
		);

		expect(runPython).toHaveBeenCalledTimes(1);
		expect(runPython.mock.calls[0]?.[0]).toContain("stdlib_module_names");
	});

	it("extracts multiple top-level import modules for runtime package setup", () => {
		expect([
			...pythonIdeImportedTopLevelModules([
				{
					name: "main.py",
					content: [
						"import os, numpy as np, pandas.io",
						"from sklearn.model_selection import train_test_split",
						"from .local import helper",
						"import invalid-name, altair # keep the valid item after a comma",
						"import matplotlib.pyplot as plt, \\",
						"    scipy.stats as stats",
						'"""',
						"import tensorflow",
						"import torch, \\",
						"    keras",
						"from keras import Sequential",
						'"""',
						'import csv # a comment with """ should not open a string'
					].join("\n")
				},
				{
					name: "notes.txt",
					content: "import should_not_count"
				}
			])
		]).toEqual([
			"os",
			"numpy",
			"pandas",
			"sklearn",
			"altair",
			"matplotlib",
			"scipy",
			"csv"
		]);
	});

	it("normalizes local Python project module names for fresh imports", () => {
		expect(
			pythonIdeProjectModuleNames([
				{ name: "main.py" },
				{ name: "helper_tools.py" },
				{ name: "notes.md" },
				{ name: "package/__init__.py" },
				{ name: "package/util.py" }
			])
		).toEqual(["main", "helper_tools", "package", "package.util"]);
	});

	it("clears stale project files and cached modules before each run", () => {
		const runtimeSource = readFileSync(
			resolve(__dirname, "../src/modules/pythonIdeRuntime.ts"),
			"utf8"
		);
		const captureStart = runtimeSource.indexOf(
			"async function captureProjectTextFiles"
		);
		const captureSource = runtimeSource.slice(
			captureStart,
			runtimeSource.indexOf("function packageScanModules", captureStart)
		);

		expect(runtimeSource).toContain("lastProjectFileNames");
		expect(runtimeSource).toContain("function syncProjectFiles");
		expect(runtimeSource).toContain(
			"const writableFiles = files.filter(file =>"
		);
		expect(runtimeSource).toContain("isValidPythonFileName(file.name)");
		expect(runtimeSource).toContain("safeUnlink(pyodide");
		expect(runtimeSource).toContain(
			"sys.modules.pop(__classes_module_name, None)"
		);
		expect(captureSource).toContain("const capturedFiles = files.filter(");
		expect(captureSource).toContain(
			"for (const file of capturedFiles) lastProjectFileNames.add(file.name);"
		);
	});

	it("writes browser runtime shims once per bootstrap version", () => {
		const runtimeSource = readFileSync(
			resolve(__dirname, "../src/modules/pythonIdeRuntime.ts"),
			"utf8"
		);
		const writeRuntimeShimsStart = runtimeSource.indexOf(
			"function writeRuntimeShims"
		);
		const writeRuntimeShimsSource = runtimeSource.slice(
			writeRuntimeShimsStart,
			runtimeSource.indexOf(
				"export async function runPythonProject",
				writeRuntimeShimsStart
			)
		);

		expect(runtimeSource).toContain(
			'let runtimeShimsWrittenForBootstrapVersion = "";'
		);
		expect(writeRuntimeShimsSource).toContain(
			"runtimeShimsWrittenForBootstrapVersion ==="
		);
		expect(writeRuntimeShimsSource).toContain(
			"PYTHON_IDE_RUNTIME_BOOTSTRAP_VERSION"
		);
		expect(writeRuntimeShimsSource).toContain("return;");
		expect(writeRuntimeShimsSource).toContain(
			"runtimeShimsWrittenForBootstrapVersion ="
		);
	});

	it("guards imported local project modules through the IDE compiler", () => {
		const runtimeSource = readFileSync(
			resolve(__dirname, "../src/modules/pythonIdeRuntime.ts"),
			"utf8"
		);

		expect(runtimeSource).toContain("__classes_project_root =");
		expect(runtimeSource).toContain("__classes_reserved_import_roots");
		expect(runtimeSource).toContain(
			'if not getattr(__classes_finder, "__classes_python_ide_project_finder__", False)'
		);
		expect(runtimeSource).toContain(
			"_classes_reserved_import_roots = __classes_reserved_import_roots"
		);
		expect(runtimeSource).toContain(
			"_ClassesProjectImportFinder__classes_reserved_import_roots = _classes_reserved_import_roots"
		);
		expect(runtimeSource).toContain(
			"root_name in _classes_reserved_import_roots"
		);
		expect(runtimeSource).toContain(
			"__classes_python_ide_project_finder__ = True"
		);
		expect(runtimeSource).toContain(
			"sys.meta_path.insert(0, __ClassesProjectImportFinder())"
		);
		expect(runtimeSource).toContain(
			"return _classes_compile_student_source(source, path)"
		);
		expect(runtimeSource).toContain(
			"builtins.__classes_loop_guard = __classes_loop_guard"
		);
		expect(runtimeSource).toContain(
			"builtins.__classes_schedule_turtle_loop = __classes_schedule_turtle_loop"
		);
	});

	it("avoids double-underscore global reads inside generated Python classes", () => {
		const runtimeSource = readFileSync(
			resolve(__dirname, "../src/modules/pythonIdeRuntime.ts"),
			"utf8"
		);
		const loopClassStart = runtimeSource.indexOf(
			"class __ClassesLoopGuardTransformer"
		);
		const loopClassEnd = runtimeSource.indexOf(
			"def __classes_compile_student_source",
			loopClassStart
		);
		const sourceLoaderStart = runtimeSource.indexOf(
			"class __ClassesProjectSourceLoader"
		);
		const sourceLoaderEnd = runtimeSource.indexOf(
			"_ClassesProjectSourceLoader = __ClassesProjectSourceLoader",
			sourceLoaderStart
		);
		const importFinderStart = runtimeSource.indexOf(
			"class __ClassesProjectImportFinder"
		);
		const importFinderEnd = runtimeSource.indexOf(
			"def __classes_install_project_import_hook",
			importFinderStart
		);
		const loopClassSource = runtimeSource.slice(
			loopClassStart,
			loopClassEnd
		);
		const sourceLoaderSource = runtimeSource.slice(
			sourceLoaderStart,
			sourceLoaderEnd
		);
		const importFinderSource = runtimeSource.slice(
			importFinderStart,
			importFinderEnd
		);

		expect(loopClassSource).toContain(
			"_classes_turtle_animation_call_names"
		);
		expect(runtimeSource).toContain(
			"_ClassesLoopGuardTransformer__classes_turtle_animation_call_names = _classes_turtle_animation_call_names"
		);
		expect(loopClassSource).not.toContain(
			"__classes_turtle_animation_call_names"
		);
		expect(sourceLoaderSource).toContain(
			"_classes_compile_student_source(source, path)"
		);
		expect(sourceLoaderSource).not.toContain(
			"__classes_compile_student_source(source, path)"
		);
		expect(importFinderSource).toContain("_classes_reserved_import_roots");
		expect(importFinderSource).toContain("_classes_project_root");
		expect(importFinderSource).toContain("_classes_is_project_path");
		expect(importFinderSource).toContain("_ClassesProjectSourceLoader");
		expect(importFinderSource).not.toContain(
			"__classes_reserved_import_roots"
		);
		expect(importFinderSource).not.toContain("__classes_project_root /");
		expect(importFinderSource).not.toContain("__classes_is_project_path");
		expect(importFinderSource).not.toContain(
			"__ClassesProjectSourceLoader("
		);
	});

	it("clears browser-owned runtime shim modules before each run", () => {
		const runtimeSource = readFileSync(
			resolve(__dirname, "../src/modules/pythonIdeRuntime.ts"),
			"utf8"
		);

		expect(runtimeSource).toContain("const PYTHON_IDE_RUNTIME_MODULES");
		expect(runtimeSource).toContain("function clearRuntimeShimModules");
		expect(runtimeSource).toContain("clearRuntimeShimModules(pyodide)");
		expect(runtimeSource).toContain('"_classes_pgzero"');
		expect(runtimeSource).toContain('"turtle"');
		expect(runtimeSource).toContain(
			"sys.modules.pop(__classes_runtime_name, None)"
		);
		expect(runtimeSource).toContain('"Actor"');
		expect(runtimeSource).toContain('"show_chart"');
		expect(runtimeSource).toContain('"__classes_loop_guard"');
		expect(runtimeSource).toContain(
			'__classes_builtin_name.startswith("__classes_")'
		);
		expect(runtimeSource).toContain(
			"delattr(builtins, __classes_builtin_name)"
		);
	});

	it("keeps imported Turtle loop bodies in the importing module namespace", () => {
		const runtimeSource = readFileSync(
			resolve(__dirname, "../src/modules/pythonIdeRuntime.ts"),
			"utf8"
		);

		expect(runtimeSource).toContain(
			"def __classes_schedule_turtle_loop(body_source, filename, line_number, namespace=None):"
		);
		expect(runtimeSource).toContain("if namespace is None:");
		expect(runtimeSource).toContain("namespace = globals()");
		expect(runtimeSource).toContain("exec(body_code, namespace)");
		expect(runtimeSource).toContain(
			'__classes_turtle_bridge = getattr(__classes_window, "__classesPythonIdeTurtle", None)'
		);
		expect(runtimeSource).toContain(
			"__classes_turtle_bridge.scheduleTimer("
		);
		expect(runtimeSource).not.toContain(
			"__classes_window.__classesPythonIdeTurtle.scheduleTimer("
		);
		expect(runtimeSource).toContain(
			'func=ast.Name(id="globals", ctx=ast.Load())'
		);
		expect(runtimeSource).toContain("ast.Call(");
	});

	it("keeps generated text-file persistence wired between runtime and page", () => {
		const runtimeSource = readFileSync(
			resolve(__dirname, "../src/modules/pythonIdeRuntime.ts"),
			"utf8"
		);
		const pageSource = readFileSync(
			resolve(__dirname, "../src/components/CodeIdeWorkspace.vue"),
			"utf8"
		);
		const mergeStart = pageSource.indexOf(
			"function mergeRuntimeProjectFiles"
		);
		const mergeSource = pageSource.slice(
			mergeStart,
			pageSource.indexOf("function requestedCourseProject", mergeStart)
		);

		expect(runtimeSource).toContain(
			"async function captureProjectTextFiles"
		);
		expect(runtimeSource).toContain("__classes_reserved_files");
		expect(runtimeSource).toContain("isValidPythonFileName(file.name)");
		expect(runtimeSource).toContain("options.onProjectFilesUpdate?.");
		expect(pageSource).toContain("function mergeRuntimeProjectFiles");
		expect(pageSource).toContain("onProjectFilesUpdate: files =>");
		expect(mergeSource).toContain(
			"const currentProject = projects.value.find("
		);
		expect(mergeSource).toContain(
			"selectedProject.value?._id !== currentProject._id"
		);
		expect(mergeSource).toContain("currentProject.files.findIndex");
		expect(mergeSource).toContain("touchProject(currentProject);");
		expect(pageSource).toContain(
			"void saveSelectedProject({ force: true });"
		);
	});

	it("uses the current selected project after forced save before running", () => {
		const pageSource = readFileSync(
			resolve(__dirname, "../src/components/CodeIdeWorkspace.vue"),
			"utf8"
		);
		const runStart = pageSource.indexOf("async function runCurrentProject");
		const runSource = pageSource.slice(
			runStart,
			pageSource.indexOf("function stopCurrentProject", runStart)
		);

		const saveIndex = runSource.indexOf(
			"await saveSelectedProject({ force: true });"
		);
		const projectIndex = runSource.indexOf(
			"const project = selectedProject.value;"
		);
		const runnableIndex = runSource.indexOf(
			"const runnableFile = getPythonIdeRunnableFile(project);"
		);

		expect(saveIndex).toBeGreaterThan(0);
		expect(projectIndex).toBeGreaterThan(saveIndex);
		expect(runnableIndex).toBeGreaterThan(projectIndex);
		expect(runSource).toContain(
			"onProjectFilesUpdate: files =>\n\t\t\t\tmergeRuntimeProjectFiles(project, files)"
		);
	});

	it("clears stale local account fallback after successful remote syncs", () => {
		const pageSource = readFileSync(
			resolve(__dirname, "../src/components/CodeIdeWorkspace.vue"),
			"utf8"
		);

		expect(pageSource).toContain(
			"await clearLocalPythonProjectsAsync(storageUserID.value);"
		);
		expect(pageSource).toContain("async function syncProjectsToAccount");
		expect(pageSource).toContain(
			'saveMessage.value = "Synced recovered local edits";'
		);
		expect(pageSource).toContain(
			'saveMessage.value = "Recovered local edits";'
		);
		expect(pageSource).toContain("Saved locally after sync issue");
		expect(pageSource).toContain("const isRemoteProject =");
	});

	it("autosaves Code IDE projects by default with a settings toggle", () => {
		const pageSource = readFileSync(
			resolve(__dirname, "../src/components/CodeIdeWorkspace.vue"),
			"utf8"
		);
		const settingsPanelCssStart = pageSource.indexOf(".ide-settings-panel {");
		const settingsPanelCss = pageSource.slice(
			settingsPanelCssStart,
			pageSource.indexOf(".ide-settings-panel,", settingsPanelCssStart)
		);
		const mobileCssStart = pageSource.indexOf("@media (max-width: 820px)");
		const mobileSettingsPanelCssStart = pageSource.indexOf(
			".ide-settings-panel {",
			mobileCssStart
		);
		const mobileSettingsPanelCss = pageSource.slice(
			mobileSettingsPanelCssStart,
			pageSource.indexOf("}", mobileSettingsPanelCssStart)
		);

		expect(pageSource).toContain(
			'const pythonIdeAutoSaveStorageKey = "classes-python-ide-autosave";'
		);
		expect(pageSource).toContain(
			"const pythonIdeCodeRecommendationsStorageKey ="
		);
		expect(pageSource).toContain(
			"const pythonIdeEditorLineWrapStorageKey ="
		);
		expect(pageSource).toContain(
			"const pythonIdeExpandedWorkspaceStorageKey ="
		);
		expect(pageSource).toContain(
			"const autoSaveEnabled = ref(loadPythonIdeAutoSavePreference());"
		);
		expect(pageSource).toContain("const codeRecommendationsEnabled = ref(");
		expect(pageSource).toContain("const editorLineWrapEnabled = ref(");
		expect(pageSource).toContain("const ideExpanded = ref(");
		expect(pageSource).toContain("function updateAutoSavePreference");
		expect(pageSource).toContain(
			"function updateCodeRecommendationsPreference"
		);
		expect(pageSource).toContain("function updateEditorLineWrapPreference");
		expect(pageSource).toContain("function updateExpandedIdePreference");
		expect(pageSource).toContain("Autosave");
		expect(pageSource).toContain("Suggestions");
		expect(pageSource).toContain("Line wrap");
		expect(pageSource).toContain("Expanded layout");
		expect(pageSource).not.toContain("Autosave projects");
		expect(pageSource).not.toContain("Recommendations as you type");
		expect(settingsPanelCss).toContain("position: absolute;");
		expect(settingsPanelCss).toContain("top: calc(100% + 0.6rem);");
		expect(settingsPanelCss).toContain("right: 0;");
		expect(settingsPanelCss).toContain(
			"width: min(26rem, calc(100vw - 2rem));"
		);
		expect(settingsPanelCss).toContain(
			"max-height: min(36rem, calc(100vh - 8rem));"
		);
		expect(mobileSettingsPanelCss).toContain("right: auto;");
		expect(mobileSettingsPanelCss).toContain("left: 0;");
		expect(pageSource).toContain(".ide-settings-panel :where(*)");
		expect(pageSource).toContain(".ide-setting-copy");
		expect(pageSource).toContain(".ide-setting-description");
		expect(pageSource).toContain("padding: 0.8rem;");
		expect(pageSource).toContain("padding: 0.62rem 0.7rem;");
		expect(pageSource).toContain("margin-top: 0.15rem;");
		expect(pageSource).toContain("font-variant: normal;");
		expect(pageSource).toContain("text-transform: none !important;");
		expect(pageSource).toContain("overflow-wrap: normal;");
		expect(pageSource).toContain(
			"recommendationsEnabled: codeRecommendationsEnabled.value"
		);
		expect(pageSource).toContain(
			"lineWrappingEnabled: editorLineWrapEnabled.value"
		);
		expect(pageSource).toContain('aria-label="IDE settings"');
		expect(pageSource).toContain('title="IDE settings"');
		expect(pageSource).toContain(
			'aria-controls="code-ide-settings-panel"'
		);
		expect(pageSource).toContain('id="code-ide-settings-panel"');
		expect(pageSource).toContain(
			'ref="ideSettingsRef" class="ide-settings"'
		);
		expect(pageSource).toContain(
			"const ideSettingsRef = ref<HTMLDivElement | null>(null);"
		);
		expect(pageSource).toContain(
			"function handleIdeSettingsOutsidePointerDown"
		);
		expect(pageSource).toContain(
			"ideSettingsRef.value?.contains(target)"
		);
		expect(pageSource).toContain(
			"showIdeSettings.value = false;"
		);
		expect(pageSource).toContain(
			"document.addEventListener(\n\t\t\"pointerdown\",\n\t\thandleIdeSettingsOutsidePointerDown\n\t);"
		);
		expect(pageSource).toContain(
			"document.removeEventListener(\n\t\t\"pointerdown\",\n\t\thandleIdeSettingsOutsidePointerDown\n\t);"
		);
		expect(pageSource).toContain("Protect local saves");
		expect(pageSource).toContain("function storageManagerWithPersistence");
		expect(pageSource).toContain("navigator.storage?.persist");
		expect(pageSource).toContain("navigator.storage.persisted");
		expect(pageSource).toContain(
			"async function refreshPythonIdeStoragePersistenceStatus"
		);
		expect(pageSource).toContain(
			"async function requestPythonIdeStoragePersistence"
		);
		expect(pageSource).toContain(
			"void refreshPythonIdeStoragePersistenceStatus();"
		);
		expect(pageSource).not.toContain(
			"void requestPythonIdeStoragePersistence();"
		);
		expect(pageSource).toContain("html.dark .ide-setting-action");
		expect(pageSource).toContain(
			"const pendingSaveProjectIDs = new Set<string>();"
		);
		expect(pageSource).toContain(
			"const unsyncedProjectIDs = new Set<string>();"
		);
		expect(pageSource).toContain("interface SaveProjectOptions");
		expect(pageSource).toContain("async function savePendingProjects");
		expect(pageSource).toContain("pendingSaveProjectIDs.add(projectID);");
		expect(pageSource).toContain(
			"unsyncedProjectIDs.add(startedProjectID);"
		);
		expect(pageSource).toContain("void savePendingProjects();");
		expect(pageSource).toContain("saveSelectedProject({ force: true })");
		expect(pageSource).toContain("let localSnapshotTimer:");
		expect(pageSource).toContain(
			"async function persistLocalProjectSnapshot"
		);
		expect(pageSource).toContain(
			"async function discardLocalProjectSnapshot"
		);
		expect(pageSource).toContain(
			"async function discardLocalProjectSnapshotIfSafe"
		);
		expect(pageSource).toContain("await localSnapshotInFlight;");
		expect(pageSource).toContain("unsyncedProjectIDs.clear();");
		expect(pageSource).toContain("function scheduleLocalProjectSnapshot");
		expect(pageSource).toContain("scheduleLocalProjectSnapshot();");
		expect(pageSource).toContain("await discardLocalProjectSnapshot();");
		expect(pageSource).toContain("if (!autoSaveEnabled.value)");
		expect(pageSource).toContain(
			"await persistLocalProjects({ quiet: true });"
		);
		expect(pageSource).toContain(
			'message: "Saved locally after sync issue"'
		);
		expect(pageSource).toContain(
			'window.addEventListener("pagehide", flushPendingProjectSave);'
		);
		expect(pageSource).toContain(
			'document.addEventListener(\n\t\t"visibilitychange",'
		);
		expect(pageSource).toContain(
			"function flushPendingProjectSaveOnVisibilityChange"
		);
		expect(pageSource).toContain("flushPendingProjectSave();");
		expect(pageSource).toContain("saveLocalProjectSnapshot();");
	});

	it("keeps Python code recommendations enabled by default with manual completion fallback", () => {
		const pageSource = readFileSync(
			resolve(__dirname, "../src/components/CodeIdeWorkspace.vue"),
			"utf8"
		);
		const codeMirrorSource = readFileSync(
			resolve(__dirname, "../src/modules/pythonCodeMirror.ts"),
			"utf8"
		);

		expect(pageSource).toContain(
			"function loadPythonIdeCodeRecommendationsPreference"
		);
		expect(pageSource).toContain(
			"function persistPythonIdeCodeRecommendationsPreference"
		);
		expect(pageSource).toContain(
			"let useFreshCodeEditorStateOnNextReset = false;"
		);
		expect(pageSource).toContain(
			"useFreshCodeEditorStateOnNextReset = true;"
		);
		expect(pageSource).toContain(
			"window.localStorage.getItem(pythonIdeCodeRecommendationsStorageKey) !=="
		);
		expect(pageSource).toContain("void nextTick(resetCodeEditor);");
		expect(pageSource).toContain("!useFreshCodeEditorStateOnNextReset &&");
		expect(codeMirrorSource).toContain("recommendationsEnabled?: boolean;");
		expect(codeMirrorSource).toContain("lineWrappingEnabled?: boolean;");
		expect(codeMirrorSource).toContain(
			"const lineWrappingEnabled = options.lineWrappingEnabled ?? true;"
		);
		expect(codeMirrorSource).toContain(
			"const recommendationsEnabled = options.recommendationsEnabled ?? true;"
		);
		expect(codeMirrorSource).toContain(
			"activateOnTyping: recommendationsEnabled"
		);
		expect(codeMirrorSource).toContain(
			"lineWrappingEnabled ? EditorView.lineWrapping : []"
		);
		expect(codeMirrorSource).toContain("javaIdeCompletionSource(mode)");
		expect(codeMirrorSource).toContain("...completionKeymap");
	});

	it("wires a resizable Code IDE editor and output split", () => {
		const pageSource = readFileSync(
			resolve(__dirname, "../src/components/CodeIdeWorkspace.vue"),
			"utf8"
		);

		expect(pageSource).toContain(
			'const pythonIdeSplitPercentStorageKey = "classes-python-ide-split-percent";'
		);
		expect(pageSource).toContain(
			"const storedValue = window.localStorage.getItem("
		);
		expect(pageSource).toContain("if (!storedValue?.trim()) return null;");
		expect(pageSource).toContain("const ideGridRef = ref");
		expect(pageSource).toContain("const activeIdeSplitPercent = computed");
		expect(pageSource).toContain("function startIdeSplitResize");
		expect(pageSource).toContain("function handleIdeSplitPointerMove");
		expect(pageSource).toContain("function handleIdeSplitKeydown");
		expect(pageSource).toContain('role="separator"');
		expect(pageSource).toContain('aria-orientation="vertical"');
		expect(pageSource).toContain('@pointerdown="startIdeSplitResize"');
		expect(pageSource).toContain('@keydown="handleIdeSplitKeydown"');
		expect(pageSource).not.toContain("faGripLinesVertical");
		expect(pageSource).not.toContain(".ide-splitter svg");
		expect(pageSource).toContain(".ide-splitter");
		expect(pageSource).toContain("--code-ide-code-column");
		expect(pageSource).toContain("stopIdeSplitResize();");
	});

	it("wires Code IDE project sharing through settings and shared links", () => {
		const pageSource = readFileSync(
			resolve(__dirname, "../src/components/CodeIdeWorkspace.vue"),
			"utf8"
		);
		const moduleSource = readFileSync(
			resolve(__dirname, "../src/modules/pythonIde.ts"),
			"utf8"
		);

		expect(moduleSource).toContain(
			"export async function fetchSharedPythonIdeProject"
		);
		expect(moduleSource).toContain("export type SharedPythonIdeProject");
		expect(moduleSource).toContain(
			"api.get<{ project: SharedPythonIdeProject }>"
		);
		expect(moduleSource).toContain(
			"`/users/python-projects/shared/${encodeURIComponent(shareID)}`"
		);
		expect(moduleSource).toContain(
			"export async function updateRemotePythonIdeProjectShare"
		);
		expect(moduleSource).toContain(
			"`/users/loggedin/python-projects/${projectID}/share`"
		);
		expect(pageSource).toContain("const isSharing = ref(false);");
		expect(pageSource).toContain('const shareMessage = ref("");');
		expect(pageSource).toContain("const activeAccount = computed");
		expect(pageSource).toContain(
			"const canSyncToAccount = computed(() => !!activeAccount.value);"
		);
		expect(pageSource).toContain(
			'return account.role === "user"\n\t\t? account.id\n\t\t: `${account.role}:${account.id}`;'
		);
		expect(pageSource).toContain("const requestedShareID = computed");
		expect(pageSource).toContain("function codeIdeShareUrl");
		expect(pageSource).toContain(
			"const selectedProjectShareLink = computed"
		);
		expect(pageSource).toContain(
			"async function importSharedProjectFromRouteIfNeeded"
		);
		expect(pageSource).toContain(
			"const sharedProject = await fetchSharedPythonIdeProject(shareID);"
		);
		expect(
			pageSource.indexOf("fetchSharedPythonIdeProject(shareID)")
		).toBeLessThan(
			pageSource.indexOf(
				"const existingProject = availableProjects.find(\n\t\t\tproject => project.sharedSourceID === shareID"
			)
		);
		expect(pageSource).toContain("sharedSourceID: shareID");
		expect(pageSource).toContain(
			'title: `Copy of ${sharedProject.title || "Shared Project"}`'
		);
		expect(pageSource).toContain(
			"await updateRemotePythonIdeProjectShare("
		);
		expect(pageSource).toContain(
			"async function copySelectedProjectShareLink"
		);
		expect(pageSource).toContain("navigator.clipboard.writeText");
		expect(pageSource).toContain("Share");
		expect(pageSource).toContain("Shared project link");
		expect(pageSource).toContain("Sign in to share projects.");
		expect(pageSource).toContain("ide-share-link-row");
	});

	it("wires Code IDE outline templates through the project menu", () => {
		const pageSource = readFileSync(
			resolve(__dirname, "../src/components/CodeIdeWorkspace.vue"),
			"utf8"
		);
		const moduleSource = readFileSync(
			resolve(__dirname, "../src/modules/pythonIde.ts"),
			"utf8"
		);

		for (const template of [
			"classroom-project",
			"circle-art",
			"firework-festival",
			"flower-garden",
			"maze-explorer",
			"neon-trail",
			"picasso",
			"spiral-galaxy",
			"triangle-motion",
			"turtle-race"
		]) {
			expect(moduleSource).toContain(`| "${template}"`);
		}
		expect(moduleSource).toContain(
			"export const pythonLevel1OutlineStarterCode"
		);
		expect(moduleSource).toContain("export const pgzeroOutlineStarterCode");
		expect(moduleSource).toContain("export const javaOutlineStarterCode");
		expect(moduleSource).toContain("export const blueJMainStarterCode");
		expect(moduleSource).toContain("function getBlueJStarterFiles");
		expect(moduleSource).toContain("export const karelOutlineStarterCode");
		expect(moduleSource).toContain("export const karelOutlineWorld");
		expect(moduleSource).toContain("function getOutlineStarterFiles");
		expect(moduleSource).toContain('if (template === "outline")');
		expect(moduleSource).toContain('if (template === "bluej")');
		expect(pageSource).toContain("Template project");
		expect(pageSource).toContain("Classroom projects");
		expect(pageSource).toContain("Classroom Turtle Studio");
		expect(pageSource).toContain("Python Level 1 Outline");
		expect(pageSource).toContain("Color Circle Art");
		expect(pageSource).toContain("Firework Festival");
		expect(pageSource).toContain("Flower Garden Clicker");
		expect(pageSource).toContain("Maze Explorer");
		expect(pageSource).toContain("Neon Trail Painter");
		expect(pageSource).toContain("Picasso Keyboard Painter");
		expect(pageSource).toContain("Spiral Galaxy");
		expect(pageSource).toContain("Turtle Race Day");
		expect(pageSource).toContain("Triangle Motion Starter");
		expect(pageSource).toContain("PyGame Zero Outline");
		expect(pageSource).toContain("Java Outline");
		expect(pageSource).toContain("BlueJ Java");
		expect(pageSource).toContain("BlueJ Java Project");
		expect(pageSource).toContain("Karel Java Outline");
		expect(pageSource).toContain("requestedClassroomProject");
		expect(pageSource).toContain(
			"addPythonIdeClassroomSections(loadedFiles)"
		);
		expect(pageSource).toMatch(
			/createProjectFromMenu\(\s*'turtle',\s*'outline'/
		);
		expect(pageSource).toMatch(
			/createProjectFromMenu\(\s*'turtle',\s*'circle-art'/
		);
		expect(pageSource).toMatch(
			/createProjectFromMenu\(\s*'turtle',\s*'picasso'/
		);
		expect(pageSource).toMatch(
			/createProjectFromMenu\(\s*'turtle',\s*'triangle-motion'/
		);
		for (const template of [
			"classroom-project",
			"firework-festival",
			"flower-garden",
			"maze-explorer",
			"neon-trail",
			"spiral-galaxy",
			"turtle-race"
		]) {
			expect(pageSource).toMatch(
				new RegExp(
					`createProjectFromMenu\\(\\s*'turtle',\\s*'${template}'`
				)
			);
		}
		expect(pageSource).toMatch(
			/createProjectFromMenu\(\s*'pgzero',\s*'outline'/
		);
		expect(pageSource).toMatch(
			/createProjectFromMenu\(\s*'java',\s*'outline'/
		);
		expect(pageSource).toMatch(
			/createProjectFromMenu\(\s*'java',\s*'bluej'/
		);
		expect(pageSource).toMatch(
			/createProjectFromMenu\(\s*'karel',\s*'outline'/
		);
	});

	it("wires BlueJ starter and download actions through the client IDE", () => {
		const pageSource = readFileSync(
			resolve(__dirname, "../src/components/CodeIdeWorkspace.vue"),
			"utf8"
		);
		const exportSource = readFileSync(
			resolve(__dirname, "../src/modules/blueJProjectExport.ts"),
			"utf8"
		);
		const blueJLegacyRouteSource = readFileSync(
			resolve(__dirname, "../src/pages/bluej.vue"),
			"utf8"
		);

		expect(pageSource).toContain("selectedProjectCanExportToBlueJ");
		expect(pageSource).toContain("selectedProjectCanShowBlueJIntegration");
		expect(pageSource).toContain("selectedProjectIsBlueJ");
		expect(pageSource).toContain("requestedTemplate");
		expect(pageSource).toContain("getPythonIdeProjectKindLabel(project)");
		expect(pageSource).not.toContain('route.path === "/bluej"');
		expect(pageSource).toContain('rawMode === "bluej"');
		expect(pageSource).toContain(
			'if (template === "bluej") return "ide-template:bluej";'
		);
		expect(pageSource).toContain(
			'if (template === "bluej") return "BlueJ starter";'
		);
		expect(pageSource).toContain('"ide-template:bluej"');
		expect(pageSource).toContain("openRequestedStandaloneProjectIfNeeded");
		expect(pageSource).toContain("openBlueJArchiveImporter");
		expect(pageSource).toContain("blueJArchiveInputRef");
		expect(pageSource).toContain("importBlueJProjectArchiveFromInput");
		expect(pageSource).toContain(
			"maxArchiveBytes: maxImportedBlueJArchiveBytes"
		);
		expect(pageSource).toContain("function requestedStandaloneProjectKey");
		expect(pageSource).toContain("project.courseProjectKey === key");
		expect(pageSource).toContain('selectedProject.value.mode === "java"');
		expect(pageSource).toContain('selectedProject.value.mode === "karel"');
		expect(pageSource).toContain('if (project.mode !== "java")');
		expect(pageSource).toContain(
			'v-if="selectedProjectCanShowBlueJIntegration"'
		);
		expect(pageSource).toContain("codeIdeHeroContent");
		expect(pageSource).toContain('eyebrow: "IDE"');
		expect(pageSource).toContain("codeIdeWorkspacePresetGroups");
		expect(pageSource).toContain('label: "Browser IDE"');
		expect(pageSource).toContain('label: "BlueJ integration"');
		expect(pageSource).toContain('label: "BlueJ Java"');
		expect(pageSource).toContain('class="workspace-type-control"');
		expect(pageSource).toContain('aria-label="IDE and language selector"');
		expect(pageSource).toContain('v-model="newWorkspacePresetID"');
		expect(pageSource).toContain("createSelectedWorkspaceProject");
		expect(pageSource).toContain(
			"BlueJ integration for desktop object-bench projects"
		);
		expect(pageSource).toContain("package.bluej export");
		expect(pageSource).not.toContain('to="/bluej"');
		expect(pageSource).toContain("BlueJ integration");
		expect(pageSource).toContain("Import BlueJ ZIP");
		expect(pageSource).toContain('class="bluej-integration-panel"');
		expect(pageSource).toContain("BlueJ Desktop Integration");
		expect(pageSource).toContain("blueJSourceUrl");
		expect(pageSource).toContain("New BlueJ project");
		expect(pageSource).toMatch(/createProject\(\s*'java',\s*'bluej'\s*\)/);
		expect(pageSource).toContain("async function downloadSelectedProjectForBlueJ");
		expect(pageSource).toContain('import("@/modules/blueJProjectExport")');
		expect(pageSource).toContain("Download BlueJ ZIP");
		expect(pageSource).toContain(
			"Standard Java project required for ZIP export."
		);
		expect(pageSource).toContain(":href=\"blueJHomeUrl\"");
		expect(pageSource).toContain(":href=\"blueJSourceUrl\"");
		expect(pageSource).toContain("BlueJ source");
		expect(pageSource).toContain("This project is BlueJ-ready");
		expect(pageSource).toContain("createBlueJProjectArchive(project)");
		expect(pageSource).toContain("selectedBlueJClassTargets");
		expect(pageSource).toContain("BlueJ class diagram preview");
		expect(pageSource).toContain("Class diagram preview");
		expect(pageSource).toContain("Object bench class");
		expect(pageSource).toContain("Import project");
		expect(pageSource).toContain("openBlueJArchiveImporterFromMenu");
		expect(blueJLegacyRouteSource).toContain('path: "/ide"');
		expect(blueJLegacyRouteSource).toContain(
			'mode: route.query.mode ?? "bluej"'
		);
		expect(exportSource).toContain('from "fflate"');
		expect(exportSource).toContain("unzipSync(archiveBytes, {");
		expect(exportSource).toContain("importBlueJProjectArchive");
		expect(exportSource).toContain("zipSync(entries)");
		expect(exportSource).toContain("package.bluej");
		expect(exportSource).toContain("README.TXT");
		expect(exportSource).toContain("BLUEJ_SOURCE_URL");
	});

	it("downloads every Code IDE project as a project-named ZIP", () => {
		const pageSource = readFileSync(
			resolve(__dirname, "../src/components/CodeIdeWorkspace.vue"),
			"utf8"
		);

		expect(pageSource).toContain("async function downloadSelectedProject");
		expect(pageSource).toContain('import("@/modules/projectArchive")');
		expect(pageSource).toContain("createProjectArchive(project)");
		expect(pageSource).toContain("projectArchiveName(project)");
		expect(pageSource).toContain('aria-label="Download project ZIP"');
		expect(pageSource).toContain("Download ZIP");
	});

	it("keeps one IDE entry in the main navigation", () => {
		const headerSource = readFileSync(
			resolve(__dirname, "../src/components/TheHeader.vue"),
			"utf8"
		);

		expect(headerSource).toContain('{ label: "IDE", to: "/ide"');
		expect(headerSource).not.toContain('to: "/bluej"');
		expect(headerSource).not.toContain('label: "BlueJ IDE"');
	});

	it("persists CodeMirror view state across reloads and project ID migration", () => {
		const pageSource = readFileSync(
			resolve(__dirname, "../src/components/CodeIdeWorkspace.vue"),
			"utf8"
		);

		expect(pageSource).toContain(
			"const pythonIdeEditorViewStateStoragePrefix ="
		);
		expect(pageSource).toContain(
			"const codeEditorStateSnapshots = new Map<string, CodeEditorState>();"
		);
		expect(pageSource).toContain(
			"function loadPersistedCodeEditorViewStates"
		);
		expect(pageSource).toContain("function persistCodeEditorViewStates");
		expect(pageSource).toContain("function isCodeEditorViewState");
		expect(pageSource).toContain("function restoreCodeEditorScroll");
		expect(pageSource).toContain("function deleteCodeEditorStateForFile");
		expect(pageSource).toContain(
			"function deleteCodeEditorStateForProject"
		);
		expect(pageSource).toContain('CodeEditorViewState["ranges"][number]');
		expect(pageSource).toContain(
			"savedState?.doc.toString() === activeFileContent.value"
		);
		expect(pageSource).toContain("state: restoredState");
		expect(pageSource).toContain(
			"loadPersistedCodeEditorViewStates(storageUserID.value);"
		);
		expect(pageSource).toContain(
			"persistCodeEditorViewStates(storageUserID.value);"
		);
		expect(pageSource).toContain(
			"migrateCodeEditorViewStates(startedProjectID, savedProject._id);"
		);
	});

	it("documents the enabled CodeMirror editor shortcuts in the IDE help", () => {
		const pageSource = readFileSync(
			resolve(__dirname, "../src/components/CodeIdeWorkspace.vue"),
			"utf8"
		);
		const codeMirrorSource = readFileSync(
			resolve(__dirname, "../src/modules/pythonCodeMirror.ts"),
			"utf8"
		);
		const helpTextSource = pageSource.replace(/\s+/g, " ");

		expect(codeMirrorSource).toContain("...defaultKeymap");
		expect(codeMirrorSource).toContain("...closeBracketsKeymap");
		expect(codeMirrorSource).toContain("rectangularSelection()");
		expect(codeMirrorSource).toContain(
			"EditorState.allowMultipleSelections.of(true)"
		);
		expect(codeMirrorSource).toContain(
			"Prec.highest(keymap.of([indentWithTab]))"
		);
		expect(helpTextSource).toContain(".code-panel { overflow: hidden;");
		expect(helpTextSource).toContain("max-height: min(24rem, 44vh);");
		expect(helpTextSource).toContain("overscroll-behavior: contain;");
		expect(helpTextSource).toContain(
			"Cmd/Ctrl+/ toggles comments for the line or selection."
		);
		expect(helpTextSource).toContain(
			"Ctrl+Space opens completions; Enter accepts the highlighted option."
		);
		expect(helpTextSource).toContain(
			"Course snippets include main_guard, turtle_screen, ontimer_loop, onkey_handler, draw, update, actor, data_setup, scatter_plot, and decision_tree."
		);
		expect(helpTextSource).toContain(
			"Cmd/Ctrl+Alt+Up/Down adds cursors above or below."
		);
		expect(helpTextSource).toContain(
			"Alt/Option+Up/Down moves lines; add Shift to copy them."
		);
		expect(helpTextSource).toContain(
			"Shift+Cmd/Ctrl+\\ jumps to the matching bracket."
		);
		expect(helpTextSource).toContain(
			"Alt/Option-drag creates a rectangular selection."
		);
		expect(helpTextSource).toContain(
			"Quotes and brackets wrap highlighted text."
		);
	});

	it("ignores stale async project loads before mutating the workspace", () => {
		const pageSource = readFileSync(
			resolve(__dirname, "../src/components/CodeIdeWorkspace.vue"),
			"utf8"
		);

		expect(pageSource).toContain("let projectLoadRunID = 0;");
		expect(pageSource).toContain("function projectLoadIsCurrent");
		expect(pageSource).toContain("const loadRunID = ++projectLoadRunID;");
		expect(pageSource).toContain(
			"if (!projectLoadIsCurrent(loadRunID)) return;"
		);
		expect(pageSource).toContain("const requestedShareID = computed");
		expect(pageSource).toContain("async function openRouteProjectIfNeeded");
		expect(pageSource).toContain(
			"return importSharedProjectFromRouteIfNeeded(localOnly, loadRunID);"
		);
		expect(pageSource).toContain("route.query.share");
		expect(pageSource).toContain(
			"await openRouteProjectIfNeeded(false, loadRunID);"
		);
		expect(pageSource).toContain(
			"await openRouteProjectIfNeeded(true, loadRunID);"
		);
		expect(pageSource).toContain(
			"await saveNewProject(requestedProject, localOnly, loadRunID);"
		);
	});

	it("opens requested route projects before creating a default account project", () => {
		const pageSource = readFileSync(
			resolve(__dirname, "../src/components/CodeIdeWorkspace.vue"),
			"utf8"
		);
		const loadProjectsStart = pageSource.indexOf(
			"async function loadProjects()"
		);
		const loadProjectsSource = pageSource.slice(
			loadProjectsStart,
			pageSource.indexOf("interface SaveProjectOptions", loadProjectsStart)
		);
		const noRemoteProjectsStart = loadProjectsSource.indexOf(
			"if (remoteProjects.length) {"
		);
		const emptyRemoteProjectsSource =
			loadProjectsSource.slice(noRemoteProjectsStart);

		expect(emptyRemoteProjectsSource).toContain("setProjects([]);");
		expect(emptyRemoteProjectsSource).toContain(
			"const openedRouteProject = await openRouteProjectIfNeeded("
		);
		expect(
			emptyRemoteProjectsSource.indexOf(
				"const openedRouteProject = await openRouteProjectIfNeeded("
			)
		).toBeLessThan(
			emptyRemoteProjectsSource.indexOf(
				"const initialProject = await createInitialProject();"
			)
		);
		expect(emptyRemoteProjectsSource).toContain(
			"if (openedRouteProject) return;"
		);
	});

	it("opens anonymous route projects before creating a default local project", () => {
		const pageSource = readFileSync(
			resolve(__dirname, "../src/components/CodeIdeWorkspace.vue"),
			"utf8"
		);
		const loadProjectsStart = pageSource.indexOf(
			"async function loadProjects()"
		);
		const loadProjectsSource = pageSource.slice(
			loadProjectsStart,
			pageSource.indexOf("interface SaveProjectOptions", loadProjectsStart)
		);
		const localProjectsStart = loadProjectsSource.indexOf(
			"visibleProjectReviewCatalog.value = [];\n\t\tprojectCatalog.value = [];\n\t\tconst localProjects = await loadLocalPythonProjectsAsync"
		);
		const localProjectsSource = loadProjectsSource.slice(
			localProjectsStart,
			loadProjectsSource.indexOf("\t} catch (error)", localProjectsStart)
		);

		expect(localProjectsSource).toContain("if (localProjects.length) {");
		expect(localProjectsSource).toContain("setProjects([]);");
		expect(localProjectsSource).toContain(
			"const openedRouteProject = await openRouteProjectIfNeeded("
		);
		expect(
			localProjectsSource.indexOf(
				"const openedRouteProject = await openRouteProjectIfNeeded("
			)
		).toBeLessThan(
			localProjectsSource.indexOf(
				"const initialProject = await createInitialProject();"
			)
		);
		expect(localProjectsSource).toContain("if (openedRouteProject) return;");
	});

	it("suppresses CodeMirror-originated echo updates through the Vue flush", () => {
		const pageSource = readFileSync(
			resolve(__dirname, "../src/components/CodeIdeWorkspace.vue"),
			"utf8"
		);
		const onChangeStart = pageSource.indexOf("onChange(content) {");
		const onChangeSource = pageSource.slice(
			onChangeStart,
			pageSource.indexOf("onCursorCountChange", onChangeStart)
		);

		expect(onChangeSource).toContain("syncingCodeMirrorContent = true;");
		expect(onChangeSource).toContain("activeFileContent.value = content;");
		expect(onChangeSource).toContain("void nextTick(() => {");
		expect(onChangeSource).toContain("syncingCodeMirrorContent = false;");
		expect(pageSource).toContain("watch(activeFileContent, content => {");
		expect(pageSource).toContain("syncCodeEditorContent(content);");
	});

	it("normalizes loaded project active files before rendering or saving", () => {
		const pageSource = readFileSync(
			resolve(__dirname, "../src/components/CodeIdeWorkspace.vue"),
			"utf8"
		);
		const setProjectsStart = pageSource.indexOf("function setProjects");
		const setProjectsSource = pageSource.slice(
			setProjectsStart,
			pageSource.indexOf(
				"async function persistLocalProjects",
				setProjectsStart
			)
		);

		expect(setProjectsSource).toContain(
			"projects.value = nextProjects.map"
		);
		expect(setProjectsSource).toContain(
			"activeFileName: resolvePythonIdeActiveFileName("
		);
		expect(setProjectsSource).toContain(
			"project.files,\n\t\t\tproject.activeFileName"
		);
		expect(setProjectsSource).toContain("projectForRoute(availableProjects)");
		expect(pageSource).toContain(
			"const activeFileName = resolvePythonIdeActiveFileName("
		);
	});

	it("serializes saves and protects newer edits from stale remote responses", () => {
		const pageSource = readFileSync(
			resolve(__dirname, "../src/components/CodeIdeWorkspace.vue"),
			"utf8"
		);

		expect(pageSource).toContain("let saveInFlight: Promise<void> | null");
		expect(pageSource).toContain("let saveQueued = false");
		expect(pageSource).toContain("async function saveProjectOnce");
		expect(pageSource).toContain("async function savePendingProjects");
		expect(pageSource).toContain("const pendingSaveProjectIDs");
		expect(pageSource).toContain("const startedUpdatedAt");
		expect(pageSource).toContain(
			"? await createRemotePythonIdeProject(payload)"
		);
		expect(pageSource).toContain("const projectChangedDuringSave");
		expect(pageSource).toContain("saveQueued = true");
		expect(pageSource).toContain(
			"} while (saveQueued || pendingSaveProjectIDs.size);"
		);
		expect(pageSource).toContain(
			"migrateCodeEditorViewStates(startedProjectID, savedProject._id);"
		);
		expect(pageSource).toContain("currentProject._id = savedProject._id");
		expect(pageSource).toContain(
			"pendingSaveProjectIDs.add(currentProject._id);"
		);
	});

	it("keeps visual output keyboard handlers separate from editor and input focus", () => {
		const pageSource = readFileSync(
			resolve(__dirname, "../src/components/CodeIdeWorkspace.vue"),
			"utf8"
		);

		expect(pageSource).toContain("function visualOutputOwnsKeyboardEvent");
		expect(pageSource).toContain("document.activeElement === canvas");
		expect(pageSource).toContain("document.activeElement === karelWorld");
		expect(pageSource).toContain(
			"if (!visualOutputOwnsKeyboardEvent(event)) return;"
		);
		expect(pageSource.indexOf("function isCanvasScrollKey")).toBeLessThan(
			pageSource.indexOf(
				"if (!visualOutputOwnsKeyboardEvent(event)) return;"
			)
		);
		expect(pageSource).toContain("function pythonGameKeyFromEvent");
		expect(pageSource).toContain("function gameKeyModifierMask");
		expect(pageSource).toContain("mod: gameKeyModifierMask(event)");
		expect(pageSource).toContain("unicode: gameKeyUnicode(event)");
		expect(pageSource).toContain('@blur="clearCanvasKeyboardState"');
		expect(pageSource).toContain(
			"visualOutput?.focus({ preventScroll: true })"
		);
		expect(pageSource).toContain("--python-focus-ring");
		expect(pageSource).toContain(".code-editor-shell:focus-within");
		expect(pageSource).toContain(".canvas-shell:focus-within");
		expect(pageSource).toContain(".stdin-panel:focus-within");
	});

	it("routes PyGame Zero mouse wheel input through documented mouse constants", () => {
		const runtimeSource = readFileSync(
			resolve(__dirname, "../src/modules/pythonIdeRuntime.ts"),
			"utf8"
		);
		const pageSource = readFileSync(
			resolve(__dirname, "../src/components/CodeIdeWorkspace.vue"),
			"utf8"
		);

		expect(pageSource).toContain('@wheel="dispatchCanvasWheelEvent"');
		expect(pageSource).toContain("function dispatchCanvasWheelEvent");
		expect(pageSource).toContain(
			'if (selectedProject.value?.mode !== "pgzero") return;'
		);
		expect(pageSource).toContain(
			'button: event.deltaY < 0 ? "wheel_up" : "wheel_down"'
		);
		expect(pageSource).toContain('type: "mousedown"');
		expect(pageSource).toContain("event.preventDefault();");
		expect(runtimeSource).toContain('WHEEL_UP = "wheel_up"');
		expect(runtimeSource).toContain('WHEEL_DOWN = "wheel_down"');
		expect(runtimeSource).toContain(
			`_call_optional_named(
                "on_mouse_down"`
		);
	});

	it("tracks overlapping PyGame Zero sound instances for cleanup", () => {
		const pageSource = readFileSync(
			resolve(__dirname, "../src/components/CodeIdeWorkspace.vue"),
			"utf8"
		);

		expect(pageSource).toContain(
			"const gameSoundAudio = new Map<string, Set<HTMLAudioElement>>();"
		);
		expect(pageSource).toContain("function trackGameSoundAudio");
		expect(pageSource).toContain("existing.add(audio);");
		expect(pageSource).toContain('audio.addEventListener("ended", cleanup');
		expect(pageSource).toContain('audio.addEventListener("error", cleanup');
		expect(pageSource).toContain("for (const audio of activeSounds)");
		expect(pageSource).toContain(
			"for (const soundName of [...gameSoundAudio.keys()])"
		);
	});

	it("cleans up PyGame Zero tone timers and suspends idle audio context", () => {
		const pageSource = readFileSync(
			resolve(__dirname, "../src/components/CodeIdeWorkspace.vue"),
			"utf8"
		);
		const stopAllGameAudioStart = pageSource.indexOf(
			"function stopAllGameAudio"
		);
		const stopAllGameAudioSource = pageSource.slice(
			stopAllGameAudioStart,
			pageSource.indexOf("async function ensureGameCourseAssetsLoaded")
		);
		const playGameToneStart = pageSource.indexOf("function playGameTone");
		const playGameToneSource = pageSource.slice(
			playGameToneStart,
			pageSource.indexOf("function startGameLoop", playGameToneStart)
		);

		expect(pageSource).toContain("function suspendGameAudioContext");
		expect(pageSource).toContain(
			'console.warn("Could not suspend PyGame Zero audio context.", error);'
		);
		expect(stopAllGameAudioSource).toContain("stopAllGameTones();");
		expect(stopAllGameAudioSource).toContain("suspendGameAudioContext();");
		expect(playGameToneSource).toContain(
			"let timeout: ReturnType<typeof window.setTimeout> | null = null;"
		);
		expect(playGameToneSource).toContain("window.clearTimeout(timeout);");
		expect(playGameToneSource).toContain("timeout = null;");
		expect(playGameToneSource).toContain("timeout = window.setTimeout(");
	});

	it("normalizes project file names without accepting unsafe names", () => {
		expect(normalizePythonFileName("helper tools")).toBe("helper_tools.py");
		expect(normalizePythonFileName("helpers/math tools")).toBe(
			"helpers/math_tools.py"
		);
		expect(normalizePythonFileName("helpers / math tools")).toBe(
			"helpers/math_tools.py"
		);
		expect(normalizePythonFileName("lesson data.CSV")).toBe(
			"lesson_data.csv"
		);
		expect(normalizePythonFileName("Main", ".java")).toBe("Main.java");
		expect(normalizePythonFileName("src/Main", ".java")).toBe(
			"src/Main.java"
		);
		expect(isValidPythonFileName("helper_tools.py")).toBe(true);
		expect(isValidPythonFileName("package/__init__.py")).toBe(true);
		expect(isValidPythonFileName("package/util.py")).toBe(true);
		expect(isValidPythonFileName("package/submodule/tools.py")).toBe(true);
		expect(isValidPythonFileName("Main.java")).toBe(true);
		expect(isValidPythonFileName("src/main/java/Main.java")).toBe(true);
			expect(isValidPythonFileName("scores.csv")).toBe(true);
			expect(isValidPythonFileName("notes.md")).toBe(true);
			expect(isValidPythonFileName("drawing.eps")).toBe(true);
			expect(isValidPythonFileName("drawing.ps")).toBe(true);
		expect(isValidPythonFileName("images/player.svg")).toBe(true);
		expect(isValidPythonFileName("sounds/eep.wav")).toBe(true);
		expect(isValidPythonFileName("music/theme.mp3")).toBe(true);
		expect(isValidPythonFileName("../helper.py")).toBe(false);
		expect(isValidPythonFileName("package//util.py")).toBe(false);
		expect(isValidPythonFileName("package/../util.py")).toBe(false);
		expect(isValidPythonFileName("package/.hidden.py")).toBe(false);
		expect(isValidPythonFileName("images/../player.svg")).toBe(false);
		expect(isValidPythonFileName("images/player.py")).toBe(false);
		expect(isValidPythonFileName("images/Robot.java")).toBe(false);
		expect(isValidPythonFileName("sounds/eep.py")).toBe(false);
		expect(isValidPythonFileName("package/data.csv")).toBe(false);
		expect(isValidPythonFileName("script.exe")).toBe(false);
		expect(isPythonIdeRuntimeReservedPath("turtle.py")).toBe(true);
		expect(isPythonIdeRuntimeReservedPath("keras/layers.py")).toBe(true);
		expect(isValidPythonFileName("turtle.py")).toBe(false);
		expect(isValidPythonFileName("pgzrun.py")).toBe(false);
		expect(isValidPythonFileName("pygame.py")).toBe(false);
		expect(isValidPythonFileName("streamlit.py")).toBe(false);
		expect(isValidPythonFileName("keras.py")).toBe(false);
		expect(isValidPythonFileName("tensorflow.py")).toBe(false);
		expect(isValidPythonFileName("keras/layers.py")).toBe(false);
		expect(isValidPythonFileName("pgzero/builtins.py")).toBe(false);
		expect(isValidPythonFileName("tensorflow/keras/__init__.py")).toBe(
			false
		);
	});

	it("labels file kinds and creates safe default content", () => {
		expect(getPythonIdeFileKindLabel("scores.csv")).toBe("CSV");
		expect(getPythonIdeFileKindLabel("Main.java")).toBe("Java");
		expect(getPythonIdeFileKindLabel("notes.md")).toBe("Markdown");
		expect(getPythonIdeFileKindLabel("images/player.png")).toBe("Image");
		expect(getPythonIdeFileKindLabel("sounds/eep.wav")).toBe("Sound");
		expect(getPythonIdeFileKindLabel("music/theme.mp3")).toBe("Music");
		expect(getPythonIdeDefaultFileContent("data.json")).toContain(
			'"items"'
		);
		expect(getPythonIdeDefaultFileContent("main.py")).toContain(
			"###   CONSTANTS   ###"
		);
		expect(getPythonIdeDefaultFileContent("Main.java")).toContain(
			"public class Main"
		);
		expect(isPythonIdeJavaFile("Main.java")).toBe(true);
		expect(isPythonIdeJavaFile("main.py")).toBe(false);
		expect(isPythonIdeRunnableFile("Main.java", "java")).toBe(true);
		expect(isPythonIdeRunnableFile("main.py", "java")).toBe(false);
		expect(isPythonIdeRunnableFile("main.py", "python")).toBe(true);
		expect(isPythonIdePythonFile("main.py")).toBe(true);
		expect(isPythonIdePythonFile("scores.csv")).toBe(false);
	});

	it("normalizes imported course assets into PyGame Zero folders", () => {
		expect(normalizeImportedPythonIdeFileName("player.PNG")).toBe(
			"images/player.png"
		);
		expect(normalizeImportedPythonIdeFileName("eep.wav")).toBe(
			"sounds/eep.wav"
		);
		expect(normalizeImportedPythonIdeFileName("theme.MP3")).toBe(
			"music/theme.mp3"
		);
			expect(isPythonIdeTextFile("images/player.svg")).toBe(true);
			expect(isPythonIdeTextFile("drawing.eps")).toBe(true);
			expect(isPythonIdeTextFile("drawing.ps")).toBe(true);
		expect(isPythonIdeTextFile("images/player.png")).toBe(false);
		expect(isPythonIdeBinaryAssetFile({ encoding: "base64" })).toBe(true);
	});

	it("builds data URLs for project assets", () => {
		expect(
			getPythonIdeAssetDataUrl({
				name: "images/player.svg",
				content: "<svg></svg>"
			})
		).toBe("data:image/svg+xml;charset=utf-8,%3Csvg%3E%3C%2Fsvg%3E");
		expect(
			getPythonIdeAssetDataUrl({
				name: "sounds/eep.wav",
				content: "UklGRg==",
				encoding: "base64"
			})
		).toBe("data:audio/wav;base64,UklGRg==");
	});

	it("loads shared PyGame Zero assets from the static assets zip", async () => {
		const zipBytes = zipSync({
			"__MACOSX/images/._alien.png": strToU8("ignored"),
			"images/.DS_Store": strToU8("ignored"),
			"images/alien.png": oneByOnePngBytes,
			"music/tune.mp3": new Uint8Array([1, 2, 3]),
			"sounds/eep.wav": new Uint8Array([4, 5, 6])
		});

		const pack = await parsePythonIdeCourseAssetZip(
			zipBytes,
			"/assets.zip"
		);
		const alien = findPythonIdeCourseAsset(
			pack,
			pythonIdeAssetCandidateNames("images", "alien", [".png"])
		);
		const eep = findPythonIdeCourseAsset(
			pack,
			pythonIdeAssetCandidateNames("sounds", "eep", [".wav"])
		);
		const tune = findPythonIdeCourseAsset(
			pack,
			pythonIdeAssetCandidateNames("music", "tune.mp3", [".mp3"])
		);

		expect(pack.assets.size).toBe(3);
		expect(alien?.mimeType).toBe("image/png");
		expect(alien?.width).toBe(1);
		expect(alien?.height).toBe(1);
		expect(eep?.mimeType).toBe("audio/wav");
		expect(tune?.mimeType).toBe("audio/mpeg");
	});

	it("matches PyGame Zero shared assets by student-friendly aliases", async () => {
		const pack = await parsePythonIdeCourseAssetZip(
			zipSync({
				"images/alien-left.png": oneByOnePngBytes,
				"images/orange (2).png": oneByOnePngBytes,
				"music/Battle Theme.mp3": new Uint8Array([1, 2, 3])
			}),
			"/assets.zip"
		);
		const alienLeft = findPythonIdeCourseAsset(
			pack,
			pythonIdeAssetCandidateNames("images", "alien_left", [".png"])
		);
		const orange = findPythonIdeCourseAsset(
			pack,
			pythonIdeAssetCandidateNames("images", "orange 2", [".png"])
		);
		const battleTheme = findPythonIdeCourseAsset(
			pack,
			pythonIdeAssetCandidateNames("music", "battle_theme", [".mp3"])
		);

		expect(pythonIdeAssetLookupAliases("images/orange (2).png")).toContain(
			"images/orange_2.png"
		);
		expect(
			pythonIdeAssetCandidateNames("images", "Alien Left", [".png"])
		).toContain("images/alien_left.png");
		expect(pack.assets.size).toBe(3);
		expect(alienLeft?.name).toBe("images/alien-left.png");
		expect(orange?.name).toBe("images/orange (2).png");
		expect(battleTheme?.name).toBe("music/Battle Theme.mp3");
	});

	it("reuses and revokes generated PyGame Zero asset object URLs", async () => {
		const createdUrls: string[] = [];
		const revokedUrls: string[] = [];
		const createObjectUrlSpy = vi
			.spyOn(URL, "createObjectURL")
			.mockImplementation(() => {
				const url = `blob:test-${createdUrls.length}`;
				createdUrls.push(url);
				return url;
			});
		const revokeObjectUrlSpy = vi
			.spyOn(URL, "revokeObjectURL")
			.mockImplementation(url => {
				revokedUrls.push(url);
			});

		try {
			const pack = await parsePythonIdeCourseAssetZip(
				zipSync({ "images/alien.png": oneByOnePngBytes }),
				"/assets.zip"
			);
			const alien = findPythonIdeCourseAsset(
				pack,
				pythonIdeAssetCandidateNames("images", "alien", [".png"])
			);

			expect(alien).toBeTruthy();
			if (!alien) return;
			expect(getPythonIdeCourseAssetObjectUrl(alien)).toBe("blob:test-0");
			expect(getPythonIdeCourseAssetObjectUrl(alien)).toBe("blob:test-0");
			expect(createObjectUrlSpy).toHaveBeenCalledTimes(1);

			resetPythonIdeCourseAssetPackCache();
			expect(revokeObjectUrlSpy).toHaveBeenCalledWith("blob:test-0");
			expect(revokedUrls).toEqual(["blob:test-0"]);
		} finally {
			createObjectUrlSpy.mockRestore();
			revokeObjectUrlSpy.mockRestore();
		}
	});

	it("loads deployed PyGame Zero assets from the extracted asset manifest", () => {
		const pack = parsePythonIdeCourseAssetManifest({
			assets: [
				{
					height: 18,
					mimeType: "image/png",
					name: "images/alien.png",
					url: "/python-ide/assets/images/alien.png",
					width: 20
				},
				{
					mimeType: "audio/wav",
					name: "sounds/eep.wav",
					url: "/python-ide/assets/sounds/eep.wav"
				},
				{
					mimeType: "audio/mpeg",
					name: "music/tune.mp3",
					url: "/python-ide/assets/music/tune.mp3"
				},
				{
					height: 18,
					mimeType: "image/png",
					name: "images/alien-left.png",
					url: "/python-ide/assets/images/alien-left.png",
					width: 20
				}
			]
		});
		const alien = findPythonIdeCourseAsset(
			pack,
			pythonIdeAssetCandidateNames("images", "alien", [".png"])
		);
		const alienLeft = findPythonIdeCourseAsset(
			pack,
			pythonIdeAssetCandidateNames("images", "alien_left", [".png"])
		);

		expect(pack.assets.size).toBe(4);
		expect(alien?.url).toBe("/python-ide/assets/images/alien.png");
		expect(alien?.width).toBe(20);
		expect(alien?.height).toBe(18);
		expect(alienLeft?.url).toBe("/python-ide/assets/images/alien-left.png");
	});

	it("rejects manifest asset URLs outside the Code IDE asset paths", () => {
		const pack = parsePythonIdeCourseAssetManifest({
			assets: [
				{
					mimeType: "image/png",
					name: "images/alien.png",
					url: "https://cdn.example.test/images/alien.png"
				},
				{
					mimeType: "image/png",
					name: "images/alien.png",
					url: "/ide/assets/images/other.png"
				},
				{
					mimeType: "image/png",
					name: "images/alien.png",
					url: "/ide/assets/images%2Falien.png"
				},
				{
					mimeType: "image/png",
					name: "images/orange (2).png",
					url: "/ide/assets/images/orange%20(2).png"
				}
			]
		});

		expect(pack.assets.size).toBe(1);
		expect(pack.assets.get("images/orange (2).png")?.url).toBe(
			"/ide/assets/images/orange%20(2).png"
		);
	});

	it("keeps the Code IDE extracted asset manifest mirrored and file-backed", () => {
		const legacyManifestPath = resolve(
			__dirname,
			"../public/python-ide/assets/manifest.json"
		);
		const codeIdeManifestSource = readFileSync(
			resolve(__dirname, "../public/ide/assets/manifest.json"),
			"utf8"
		);
		const manifest = JSON.parse(codeIdeManifestSource) as {
			assets: Array<{
				name: string;
				url: string;
			}>;
		};

		if (existsSync(legacyManifestPath)) {
			expect(codeIdeManifestSource).toBe(
				readFileSync(legacyManifestPath, "utf8")
			);
		}
		expect(manifest.assets.length).toBeGreaterThan(100);
		const assetFilePaths = manifest.assets.map(asset =>
			resolve(
				__dirname,
				`../public${asset.url
					.split("/")
					.map(segment => decodeURIComponent(segment))
					.join("/")}`
			)
		);
		const hasExtractedAssetFiles = assetFilePaths.some(assetPath =>
			existsSync(assetPath)
		);

		for (const asset of manifest.assets) {
			expect(asset.name).toMatch(/^(?:images|music|sounds)\//);
			expect(asset.url).toMatch(
				/^\/(?:ide|python-ide)\/assets\/(?:images|music|sounds)\//
			);
		}
		if (hasExtractedAssetFiles) {
			for (const assetFilePath of assetFilePaths) {
				expect(existsSync(assetFilePath)).toBe(true);
			}
		}
	});

	it("keeps zip parsing out of the normal course asset loader chunk", () => {
		const assetSource = readFileSync(
			resolve(__dirname, "../src/modules/pythonIdeCourseAssets.ts"),
			"utf8"
		);
		const zipSource = readFileSync(
			resolve(__dirname, "../src/modules/pythonIdeCourseAssetZip.ts"),
			"utf8"
		);

		expect(assetSource).not.toContain('from "fflate"');
		expect(assetSource).toMatch(
			/import\(\s*"@\/modules\/pythonIdeCourseAssetZip"\s*\)/
		);
		expect(zipSource).toContain('from "fflate"');
		expect(zipSource).toContain("parsePythonIdeCourseAssetZipBytes");
	});

	it("prefers the extracted asset manifest before falling back to the same-origin API proxy", async () => {
		const requestedUrls: string[] = [];
		const pack = await loadPythonIdeCourseAssetPack({
			fetcher: async url => {
				requestedUrls.push(url);
				expect(url).toBe(pythonIdeCourseAssetsManifestUrl);

				return {
					arrayBuffer: async () => new ArrayBuffer(0),
					json: async () => ({
						assets: [
							{
								height: 18,
								mimeType: "image/png",
								name: "images/alien.png",
								url: "/python-ide/assets/images/alien.png",
								width: 20
							}
						]
					}),
					ok: true,
					status: 200
				};
			}
		});

		expect(requestedUrls).toEqual([pythonIdeCourseAssetsManifestUrl]);
		expect(pack.assets.get("images/alien.png")?.url).toBe(
			"/python-ide/assets/images/alien.png"
		);
	});

	it("falls back to the legacy extracted manifest when the Code IDE manifest is missing", async () => {
		const requestedUrls: string[] = [];
		const pack = await loadPythonIdeCourseAssetPack({
			fetcher: async url => {
				requestedUrls.push(url);
				if (url === pythonIdeCourseAssetsManifestUrl) {
					return {
						arrayBuffer: async () => new ArrayBuffer(0),
						ok: false,
						status: 404
					};
				}

				expect(url).toBe(pythonIdeLegacyCourseAssetsManifestUrl);
				return {
					arrayBuffer: async () => new ArrayBuffer(0),
					json: async () => ({
						assets: [
							{
								height: 18,
								mimeType: "image/png",
								name: "images/alien.png",
								url: "/python-ide/assets/images/alien.png",
								width: 20
							}
						]
					}),
					ok: true,
					status: 200
				};
			}
		});

		expect(requestedUrls).toEqual([
			pythonIdeCourseAssetsManifestUrl,
			pythonIdeLegacyCourseAssetsManifestUrl
		]);
		expect(pack.assets.get("images/alien.png")?.url).toBe(
			"/python-ide/assets/images/alien.png"
		);
	});

	it("falls back to the same-origin zip proxy when extracted manifests are missing", async () => {
		const zipBytes = zipSync({
			"images/alien.png": oneByOnePngBytes
		});
		const requestedUrls: string[] = [];
		const pack = await loadPythonIdeCourseAssetPack({
			fetcher: async url => {
				requestedUrls.push(url);
				if (
					url === pythonIdeCourseAssetsManifestUrl ||
					url === pythonIdeLegacyCourseAssetsManifestUrl
				) {
					return {
						arrayBuffer: async () => new ArrayBuffer(0),
						ok: false,
						status: 404
					};
				}

				expect(url).toBe(pythonIdeCourseAssetsZipUrl);
				return {
					arrayBuffer: async () => zipBytes.buffer.slice(0),
					ok: true,
					status: 200
				};
			}
		});

		expect(requestedUrls).toEqual([
			pythonIdeCourseAssetsManifestUrl,
			pythonIdeLegacyCourseAssetsManifestUrl,
			pythonIdeCourseAssetsZipUrl
		]);
		expect(pack.assets.has("images/alien.png")).toBe(true);
	});

	it("falls back to the legacy same-origin zip proxy when the Code IDE proxy is unavailable", async () => {
		const zipBytes = zipSync({
			"images/alien.png": oneByOnePngBytes
		});
		const requestedUrls: string[] = [];
		const pack = await loadPythonIdeCourseAssetPack({
			fetcher: async url => {
				requestedUrls.push(url);
				if (
					url === pythonIdeCourseAssetsManifestUrl ||
					url === pythonIdeLegacyCourseAssetsManifestUrl
				) {
					return {
						arrayBuffer: async () => new ArrayBuffer(0),
						ok: false,
						status: 404
					};
				}

				if (url === pythonIdeCourseAssetsZipUrl) {
					return {
						arrayBuffer: async () => new ArrayBuffer(0),
						ok: false,
						status: 404
					};
				}

				expect(url).toBe(pythonIdeLegacyCourseAssetsZipUrl);
				return {
					arrayBuffer: async () => zipBytes.buffer.slice(0),
					ok: true,
					status: 200
				};
			}
		});

		expect(requestedUrls).toEqual([
			pythonIdeCourseAssetsManifestUrl,
			pythonIdeLegacyCourseAssetsManifestUrl,
			pythonIdeCourseAssetsZipUrl,
			pythonIdeLegacyCourseAssetsZipUrl
		]);
		expect(pack.assets.has("images/alien.png")).toBe(true);
	});

	it("falls back to the same-origin zip proxy when the asset manifest has no usable assets", async () => {
		const zipBytes = zipSync({
			"images/alien.png": oneByOnePngBytes
		});
		const requestedUrls: string[] = [];
		const pack = await loadPythonIdeCourseAssetPack({
			fetcher: async url => {
				requestedUrls.push(url);
				if (
					url === pythonIdeCourseAssetsManifestUrl ||
					url === pythonIdeLegacyCourseAssetsManifestUrl
				) {
					return {
						arrayBuffer: async () => new ArrayBuffer(0),
						json: async () => ({
							assets: [
								{
									mimeType: "text/plain",
									name: "README.txt",
									url: "/python-ide/assets/README.txt"
								}
							]
						}),
						ok: true,
						status: 200
					};
				}

				expect(url).toBe(pythonIdeCourseAssetsZipUrl);
				return {
					arrayBuffer: async () => zipBytes.buffer.slice(0),
					ok: true,
					status: 200
				};
			}
		});

		expect(requestedUrls).toEqual([
			pythonIdeCourseAssetsManifestUrl,
			pythonIdeLegacyCourseAssetsManifestUrl,
			pythonIdeCourseAssetsZipUrl
		]);
		expect(pack.assets.has("images/alien.png")).toBe(true);
	});

	it("falls back to the same-origin zip proxy when the asset manifest fetch fails", async () => {
		const zipBytes = zipSync({
			"images/alien.png": oneByOnePngBytes
		});
		const requestedUrls: string[] = [];
		const pack = await loadPythonIdeCourseAssetPack({
			fetcher: async url => {
				requestedUrls.push(url);
				if (
					url === pythonIdeCourseAssetsManifestUrl ||
					url === pythonIdeLegacyCourseAssetsManifestUrl
				) {
					throw new TypeError("manifest network failure");
				}

				expect(url).toBe(pythonIdeCourseAssetsZipUrl);
				return {
					arrayBuffer: async () => zipBytes.buffer.slice(0),
					ok: true,
					status: 200
				};
			}
		});

		expect(requestedUrls).toEqual([
			pythonIdeCourseAssetsManifestUrl,
			pythonIdeLegacyCourseAssetsManifestUrl,
			pythonIdeCourseAssetsZipUrl
		]);
		expect(pack.assets.has("images/alien.png")).toBe(true);
	});

	it("keeps shared PyGame Zero asset support wired into the page and runtime", () => {
		const runtimeSource = readFileSync(
			resolve(__dirname, "../src/modules/pythonIdeRuntime.ts"),
			"utf8"
		);
		const pageSource = readFileSync(
			resolve(__dirname, "../src/components/CodeIdeWorkspace.vue"),
			"utf8"
		);

		expect(runtimeSource).toContain("def _asset_size(image");
		expect(runtimeSource).toContain("def _image_name(image):");
		expect(runtimeSource).toContain(
			'return str(getattr(image, "name", image))'
		);
		expect(runtimeSource).toContain("builtins.images = images");
		expect(runtimeSource).toContain("builtins.keymods = keymods");
		expect(runtimeSource).toContain("builtins.Animation = Animation");
		expect(runtimeSource).toContain("builtins.animate = animate");
		expect(runtimeSource).toContain("builtins.tone = tone");
		expect(runtimeSource).toContain("def blit(self, image, pos");
		expect(runtimeSource).toContain(
			"_bridge.drawImage(\n            _image_name(image),"
		);
		expect(runtimeSource).toContain(
			"fill: (color: string, gcolor?: string) => void;"
		);
		expect(runtimeSource).toContain("def fill(self, color, gcolor=None):");
		expect(runtimeSource).toContain(
			"_normalize_color(gcolor) if gcolor is not None else None"
		);
		expect(runtimeSource).toContain("def bounds(self):");
		expect(runtimeSource).toContain(
			"def rect(self, rect, color, width=1):"
		);
		expect(runtimeSource).toContain(
			"rect_width, rect_height = _rect_parts(rect)"
		);
		expect(runtimeSource).toContain(
			"def line(self, start, end, color, width=1):"
		);
		expect(runtimeSource).toContain(
			"def circle(self, pos, radius, color, width=1):"
		);
		expect(runtimeSource).toContain(
			"def filled_circle(self, pos, radius, color):"
		);
		expect(runtimeSource).toContain("def __bool__(self):");
		expect(runtimeSource).toContain(
			"return self.width != 0 and self.height != 0"
		);
		expect(runtimeSource).toContain("def textbox(self, text, rect");
		expect(runtimeSource).toContain("_bridge.drawLine(");
		expect(runtimeSource).toContain("_bridge.drawCircle(");
		expect(runtimeSource).toContain("float(_number(width, 1))");
		expect(runtimeSource).toContain("def schedule(self, function, delay):");
		expect(runtimeSource).toContain(
			"def schedule_unique(self, function, delay):"
		);
		expect(runtimeSource).toContain("def _same_callback(left, right):");
		expect(runtimeSource).toContain("if left is right:");
		expect(runtimeSource).toContain("return left == right");
		expect(runtimeSource).toContain(
			'if not _same_callback(entry["function"], function)'
		);
		expect(pageSource).toContain("backgroundGradient: string | null;");
		expect(pageSource).toContain("function gameCanvasFillStyle");
		expect(pageSource).toContain(
			"context.createLinearGradient(0, 0, 0, gameState.height)"
		);
		expect(pageSource).toContain("gradient.addColorStop(1, gcolor);");
		expect(pageSource).toContain(
			"gameState.backgroundGradient = gcolor ?? null;"
		);
		expect(runtimeSource).toContain("def distance_to(self, target):");
		expect(runtimeSource).toContain("def angle_to(self, target):");
		expect(runtimeSource).toContain("self._image = _image_name(image)");
		expect(runtimeSource).toContain("self._image = _image_name(value)");
		expect(runtimeSource).toContain(
			'self.anchor = kwargs.pop("anchor", self._anchor)'
		);
		expect(runtimeSource).toContain("def _apply_rect(self, rect):");
		expect(runtimeSource).toContain("self.width = rect.width");
		expect(runtimeSource).toContain("self.left = rect.left");
		expect(runtimeSource).toContain(
			"def _anchor_component(self, value, axis):"
		);
		expect(runtimeSource).toContain("def _anchor_x(self):");
		expect(runtimeSource).toContain("def _anchor_y(self):");
		expect(runtimeSource).toContain("def anchor(self):");
		expect(runtimeSource).toContain("return self.x - self._anchor_x()");
		expect(runtimeSource).toContain("float(self._anchor_x()),");
		expect(runtimeSource).toContain("def topleft(self):");
		expect(runtimeSource).toContain("def midbottom(self):");
		expect(runtimeSource).toContain("def move_ip(self, x, y=None):");
		expect(runtimeSource).toContain(
			"return self._apply_rect(self.move(x, y))"
		);
		expect(runtimeSource).toContain("def inflate_ip(self, width, height):");
		expect(runtimeSource).toContain("def scale_by_ip(self, *args):");
		expect(runtimeSource).toContain("def clamp_ip(self, other):");
		expect(runtimeSource).toContain("def unionall_ip(self, rects):");
		expect(runtimeSource).toContain("def normalize(self):");
		expect(runtimeSource).toContain("rect.normalize()");
		expect(runtimeSource).toContain("def __iter__(self):");
		expect(runtimeSource).toContain("return iter(self._rect())");
		expect(runtimeSource).toContain("def move_ip(self, x, y=None):");
		expect(runtimeSource).toContain("def _rect_parts_from_args(args):");
		expect(runtimeSource).toContain('if hasattr(value, "rect"):');
		expect(runtimeSource).toContain("if callable(rect_value):");
		expect(runtimeSource).toContain("rect_value = rect_value()");
		expect(runtimeSource).toContain("return _rect_parts(rect_value)");
		expect(runtimeSource).toContain("def _line_points_from_args(args):");
		expect(runtimeSource).toContain("def _clipline_point(x, y):");
		expect(runtimeSource).toContain(
			"self.x, self.y, self.width, self.height = _rect_parts_from_args(args)"
		);
		expect(runtimeSource).toContain("def __iter__(self):");
		expect(runtimeSource).toContain(
			"return iter((self.x, self.y, self.width, self.height))"
		);
		expect(runtimeSource).toContain("def __getitem__(self, index):");
		expect(runtimeSource).toContain("def _new(self, x, y, width, height):");
		expect(runtimeSource).toContain(
			"rect = self.__class__.__new__(self.__class__)"
		);
		expect(runtimeSource).toContain(
			"Rect.__init__(rect, x, y, width, height)"
		);
		expect(runtimeSource).toContain(
			"return self._new(self.x, self.y, self.width, self.height)"
		);
		expect(runtimeSource).toContain("def scale_by(self, *args):");
		expect(runtimeSource).toContain("def scale_by_ip(self, *args):");
		expect(runtimeSource).toContain("def update(self, *args):");
		expect(runtimeSource).toContain("def clamp(self, other):");
		expect(runtimeSource).toContain("def clamp_ip(self, other):");
		expect(runtimeSource).toContain("self.centerx = outer.centerx");
		expect(runtimeSource).toContain("def clip(self, other):");
		expect(runtimeSource).toContain("return self._new(left, top, 0, 0)");
		expect(runtimeSource).toContain(
			"return self._new(left, top, right - left, bottom - top)"
		);
		expect(runtimeSource).toContain("def clipline(self, *args):");
		expect(runtimeSource).toContain(
			"x1, y1, x2, y2 = _line_points_from_args(args)"
		);
		expect(runtimeSource).toContain(
			"_clipline_point(x1 + start * delta_x, y1 + start * delta_y)"
		);
		expect(runtimeSource).toContain("def union(self, other):");
		expect(runtimeSource).toContain("def union_ip(self, other):");
		expect(runtimeSource).toContain("def unionall(self, rects):");
		expect(runtimeSource).toContain("def unionall_ip(self, rects):");
		expect(runtimeSource).toContain("def fit(self, other):");
		expect(runtimeSource).toContain(
			"return self._new(outer.x, outer.y, 0, 0)"
		);
		expect(runtimeSource).toContain(
			"scale = min(outer.width / self.width, outer.height / self.height)"
		);
		expect(runtimeSource).toContain(
			"fitted = self._new(0, 0, self.width * scale, self.height * scale)"
		);
		expect(runtimeSource).toContain("def normalize(self):");
		expect(runtimeSource).toContain("self.width = -self.width");
		expect(runtimeSource).toContain("def _point_from_args(args):");
		expect(runtimeSource).toContain("def collidepoint(self, *args):");
		expect(runtimeSource).toContain(
			"return self.left <= x < self.right and self.top <= y < self.bottom"
		);
		expect(runtimeSource).toContain("self.right <= other_rect.left");
		expect(runtimeSource).toContain("self.left >= other_rect.right");
		expect(runtimeSource).toContain("self.bottom <= other_rect.top");
		expect(runtimeSource).toContain("self.top >= other_rect.bottom");
		expect(runtimeSource).toContain(
			"if other_rect.width <= 0 or other_rect.height <= 0:"
		);
		expect(runtimeSource).toContain("def collidelist(self, rects):");
		expect(runtimeSource).toContain("for index, rect in enumerate(rects):");
		expect(runtimeSource).toContain("return -1");
		expect(runtimeSource).toContain("def collidelistall(self, rects):");
		expect(runtimeSource).toContain(
			"def collidedict(self, rect_dict, use_values=0):"
		);
		expect(runtimeSource).toContain("rect = value if use_values else key");
		expect(runtimeSource).toContain("return (key, value)");
		expect(runtimeSource).toContain(
			"def collidedictall(self, rect_dict, use_values=0):"
		);
		expect(runtimeSource).toContain(
			"def collideobjects(self, objects, key=None):"
		);
		expect(runtimeSource).toContain(
			"rect = key(obj) if key is not None else obj"
		);
		expect(runtimeSource).toContain(
			"def collideobjectsall(self, objects, key=None):"
		);
		expect(runtimeSource).toContain(
			"return self._rect().collidepoint(*args)"
		);
		expect(runtimeSource).toContain(
			"return self._rect().collidelist(rects)"
		);
		expect(runtimeSource).toContain(
			"return self._rect().collidedict(rect_dict, use_values)"
		);
		expect(runtimeSource).toContain(
			"return self._rect().collideobjects(objects, key)"
		);
		expect(runtimeSource).toContain("return self._rect().clipline(*args)");
		expect(runtimeSource).toContain("def get_length(self):");
		expect(runtimeSource).toContain("def play_once(self, name):");
		expect(runtimeSource).toContain("def queue(self, name):");
		expect(runtimeSource).toContain("def is_playing(self):");
		expect(runtimeSource).toContain("def fadeout(self, duration):");
		expect(runtimeSource).toContain("def get_volume(self):");
		expect(runtimeSource).toContain("def pause(self):");
		expect(runtimeSource).toContain("def unpause(self):");
		expect(runtimeSource).toContain("def set_volume(self, volume):");
		expect(runtimeSource).toContain("def get_width(self):");
		expect(runtimeSource).toContain("def get_rect(self):");
		expect(runtimeSource).toContain('BACKSPACE = "backspace"');
		expect(runtimeSource).toContain('K_1 = "1"');
		expect(runtimeSource).toContain('LSHIFT = "lshift"');
		expect(runtimeSource).toContain('KP_ENTER = "kp_enter"');
		expect(runtimeSource).toContain("def _call_named_callback");
		expect(runtimeSource).toContain("def animate(obj");
		expect(runtimeSource).toContain("class Animation:");
		expect(runtimeSource).toContain("def _run_animations(now):");
		expect(runtimeSource).toContain("def _tone_frequency(pitch):");
		expect(runtimeSource).toContain("class _ToneSound:");
		expect(runtimeSource).toContain("def create(self, pitch, duration):");
		expect(runtimeSource).toContain("def play(self, pitch, duration):");
		expect(runtimeSource).toContain("def _handle_music_end(self):");
		expect(runtimeSource).toContain('elif event_type == "musicended":');
		expect(runtimeSource).toContain(
			"playSound: (name: string, loops?: number) => void"
		);
		expect(runtimeSource).toContain(
			"_bridge.playSound(self.name, int(_number(loops, 0)))"
		);
		expect(runtimeSource).toContain(
			`_call_optional_named(
                "on_mouse_down"`
		);
		expect(runtimeSource).toContain('_call_optional("update", dt)');
		expect(runtimeSource).toContain("_run_animations(now)");
		expect(pageSource).toContain("await ensureGameCourseAssetsLoaded()");
		expect(pageSource).toContain(
			"let gameCourseAssetPackSilentLoadFailed = false;"
		);
		expect(pageSource).toContain(
			"if (!announce && gameCourseAssetPackSilentLoadFailed) return;"
		);
		expect(pageSource).toContain(
			"gameCourseAssetPackSilentLoadFailed = true;"
		);
		expect(pageSource).toContain(
			"gameCourseAssetPackSilentLoadFailed = false;"
		);
		expect(pageSource).not.toContain(
			"Could not preload shared PyGame Zero assets."
		);
		expect(pageSource).not.toContain(
			"void ensureGameCourseAssetsLoaded({ announce: false })"
		);
		expect(pageSource).toContain(
			"async function loadPythonCodeMirrorAssetCompletions"
		);
		expect(pageSource).toContain(
			"assetCompletions: loadPythonCodeMirrorAssetCompletions"
		);
		expect(pageSource).toContain("pythonAssetCompletionName");
		expect(pageSource).toContain("drawImage: drawGameImage");
		expect(pageSource).toContain("anchorX = width / 2");
		expect(pageSource).toContain("const left = -anchorX");
		expect(pageSource).toContain("drawLine: drawGameLine");
		expect(pageSource).toContain("drawCircle: drawGameCircle");
		expect(pageSource).toContain(
			"function playGameSound(name: string, loops = 0)"
		);
		expect(pageSource).toContain("const repeatCount = Math.max(");
		expect(pageSource).toContain(
			"Math.trunc(Number.isFinite(loops) ? loops : 0)"
		);
		expect(pageSource).toContain("repeatCount < 0");
		expect(pageSource).toContain("let remainingLoops = repeatCount;");
		expect(pageSource).toContain("remainingLoops -= 1;");
		expect(pageSource).toContain(
			"let gameAudioPlaybackBlockedNoticeShown = false;"
		);
		expect(pageSource).toContain("function reportGameAudioPlaybackBlocked");
		expect(pageSource).toContain("Audio is waiting for a browser gesture.");
		expect(pageSource).not.toContain(
			"Audio playback was blocked: ${error.message}"
		);
		expect(pageSource).toContain("playSound(name: string, loops?: number)");
		expect(pageSource).toContain("gameBridge.playSound(name, loops)");
		expect(pageSource).toContain("lineWidth = 1");
		expect(pageSource).toContain(
			"context.lineWidth = Math.max(1, lineWidth)"
		);
		expect(pageSource).toContain("pauseMusic: pauseGameMusic");
		expect(pageSource).toContain("unpauseMusic: unpauseGameMusic");
		expect(pageSource).toContain("setMusicVolume: setGameMusicVolume");
		expect(pageSource).toContain("playTone: playGameTone");
		expect(pageSource).toContain("stopTone: stopGameTone");
		expect(pageSource).toContain('type: "musicended"');
		expect(pageSource).toContain("imageSizeJson: gameImageSizeJson");
		expect(pageSource).toContain("findPythonIdeCourseAsset");
		expect(pageSource).toContain("if (cached?.src === src) return cached;");
	});

	it("runs the selected Python file or falls back from resource files", () => {
		const project = createPythonIdeProject("data");

		expect(getPythonIdeRunnableFile(project)?.name).toBe("main.py");

		project.activeFileName = "scores.csv";
		expect(getPythonIdeRunnableFile(project)?.name).toBe("main.py");
	});

	it("runs the selected Java file or falls back from world files", () => {
		const project = createPythonIdeProject("karel");

		expect(getPythonIdeRunnableFile(project)?.name).toBe("Algo.java");

		project.activeFileName = "world.txt";
		expect(getPythonIdeRunnableFile(project)?.name).toBe("Algo.java");
	});

	it("runs Java entry-point files instead of active helper classes", () => {
		const project = createPythonIdeProject("java");
		project.files = [
			{ name: "Main.java", content: javaStarterCode },
			{
				name: "Dog.java",
				content: `public class Dog {
    private String name;

    public Dog(String name) {
        this.name = name;
    }
}
`
			}
		];
		project.activeFileName = "Dog.java";

		expect(getPythonIdeRunnableFile(project)?.name).toBe("Main.java");

		project.files = [
			project.files[1]!,
			{
				name: "App.java",
				content: `public class App {
    public static void main(String[] args) {
        System.out.println("Run app");
    }
}
`
			}
		];
		project.activeFileName = "Dog.java";

		expect(getPythonIdeRunnableFile(project)?.name).toBe("App.java");

		project.files = [
			{
				name: "Notes.java",
				content: `public class Notes {
    // public static void main(String[] args) belongs in App.java.
    String reminder = "main(String[] args)";
}
`
			},
			project.files[1]!
		];
		project.activeFileName = "Notes.java";

		expect(getPythonIdeRunnableFile(project)?.name).toBe("App.java");
	});

	it("runs Karel driver files instead of active helper classes", () => {
		const project = createPythonIdeProject("karel", {
			template: "outline"
		});
		project.files.push({
			name: "Helper.java",
			content: `public class Helper {
    void turnRight(MyProgram karel) {
        karel.turnLeft();
        karel.turnLeft();
        karel.turnLeft();
    }
}
`
		});
		project.activeFileName = "Helper.java";

		expect(getPythonIdeRunnableFile(project)?.name).toBe("MyProgram.java");

		project.files[2] = {
			name: "Helper.java",
			content: `public class Helper {
    // public void run() stays in MyProgram.java.
    String reminder = "run()";
}
`
		};

		expect(getPythonIdeRunnableFile(project)?.name).toBe("MyProgram.java");

		project.files = [
			{
				name: "Helper.java",
				content: `public class Helper {
}
`
			},
			{ name: "Algo.java", content: karelStarterCode },
			{ name: "world.txt", content: karelStarterWorld }
		];
		project.activeFileName = "Helper.java";

		expect(getPythonIdeRunnableFile(project)?.name).toBe("Algo.java");
	});

	it("runs the Karel starter through visible world snapshots", () => {
		const project = createPythonIdeProject("karel", {
			template: "demo"
		});
		const runnableFile = getPythonIdeRunnableFile(project);

		expect(runnableFile?.name).toBe("Algo.java");
		const result = runJavaIdeProject({
			activeFileName: runnableFile?.name ?? "",
			files: project.files,
			mode: "karel"
		});
		const firstStep = result.karelWorldSteps?.[0];
		const lastStep = result.karelWorldSteps?.at(-1);

		expect(result.stderr).toEqual([]);
		expect(result.karelWorldSteps).toHaveLength(6);
		expect(firstStep?.robot).toEqual(
			expect.objectContaining({
				avenue: 7,
				direction: "East",
				name: "sam",
				street: 6
			})
		);
		expect(lastStep?.robot).toEqual(
			expect.objectContaining({
				avenue: 4,
				direction: "West",
				name: "sam",
				street: 6
			})
		);
		expect(result.karelWorld?.robot).toEqual(lastStep?.robot);
		expect(result.stdout.at(-1)).toContain("street: 6");
		expect(result.stdout.at(-1)).toContain("avenue: 4");
	});

	it("renders Karel painted cells in the visual world grid", () => {
		const pageSource = readFileSync(
			resolve(__dirname, "../src/components/CodeIdeWorkspace.vue"),
			"utf8"
		);

		expect(pageSource).toContain("paintColor: string;");
		expect(pageSource).toContain("const paints = new Map(");
		expect(pageSource).toContain("function karelCellStyle");
		expect(pageSource).toContain("function karelCellAriaLabel");
		expect(pageSource).toContain("paintColor: paints.get(key) ?? \"\"");
		expect(pageSource).toContain("'has-paint': Boolean(");
		expect(pageSource).toContain("\"--karel-cell-color\"");
		expect(pageSource).toContain(".karel-cell.has-paint");
	});

	it("plays Karel world snapshots instead of only showing the final state", () => {
		const pageSource = readFileSync(
			resolve(__dirname, "../src/components/CodeIdeWorkspace.vue"),
			"utf8"
		);

		expect(pageSource).toContain("const karelPlaybackFrameDelayMs = 650;");
		expect(pageSource).toContain(
			'import { createKarelWorldPlaybackController } from "@/modules/karelWorldPlayback";'
		);
		expect(pageSource).toContain(
			"const karelWorldPlaybackController = createKarelWorldPlaybackController({"
		);
		expect(pageSource).toContain("function clearKarelWorldPlayback()");
		expect(pageSource).toContain("karelWorldPlaybackController.clear();");
		expect(pageSource).toContain("shouldContinue: () => boolean");
		expect(pageSource).toContain(
			"return karelWorldPlaybackController.play(steps, shouldContinue);"
		);
		expect(pageSource).toContain("showStep(step, stepNumber, stepCount)");
		expect(pageSource).toContain("karelWorld.value = step;");
		expect(pageSource).toContain(
			"runMessage.value = `Karel step ${stepNumber} of ${stepCount}`;"
		);
		expect(pageSource).toContain('runMessage.value = "Animating Karel world";');
		expect(pageSource).toContain(
			"const completedPlayback = await playKarelWorldSteps("
		);
		expect(pageSource).toContain(
			"() => !shouldStopPythonIdeRun(runID, project._id)"
		);
		expect(pageSource).toContain("clearKarelWorldPlayback();");
		expect(pageSource).toMatch(
			/expectedMigration[\s\S]*nextTick\(resetActiveCanvas\);[\s\S]*return;[\s\S]*stopActiveRuntimeSurfaces\(\);\n\tkarelWorld\.value = null;/
		);
	});

	it("names repeated Code IDE file controls by the affected file", () => {
		const pageSource = readFileSync(
			resolve(__dirname, "../src/components/CodeIdeWorkspace.vue"),
			"utf8"
		);

		expect(pageSource).toContain("const newFileNamePlaceholder = computed");
		expect(pageSource).toContain(
			'return "MyProgram.java, helpers/Helper.java, or world.txt";'
		);
		expect(pageSource).toContain(
			'return "Main.java or src/main/java/Helper.java";'
		);
		expect(pageSource).toContain(
			'return "helper.py, helpers/math_tools.py, or data.csv";'
		);
		expect(pageSource).toContain(':placeholder="newFileNamePlaceholder"');
		expect(pageSource).not.toContain(
			'placeholder="helper.py, helpers/math_tools.py, or data.csv"'
		);
		expect(pageSource).toContain(
			':aria-label="`Delete file ${file.name}`"'
		);
		expect(pageSource).toContain(':title="`Delete ${file.name}`"');
		expect(pageSource).not.toContain('aria-label="Delete file"');
		expect(pageSource).toContain(
			'aria-controls="code-ide-file-tools-panel"'
		);
		expect(pageSource).toContain('id="code-ide-file-tools-panel"');
	});
});
