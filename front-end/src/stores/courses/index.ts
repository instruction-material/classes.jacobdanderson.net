import type { CourseSummary, RawCourse } from "./types";
import { normalizeRawCourse } from "./normalization";

export interface CourseCatalogEntry extends CourseSummary {
	load: () => Promise<RawCourse>;
}

export const courseCatalog: CourseCatalogEntry[] = [
	{
		id: "scratch-level-1-classroom",
		name: "Scratch Level 1: Classroom Edition",
		load: () =>
			import("./scratch-level-1-classroom").then(
				({ scratchLevel1ClassroomCourse }) =>
					scratchLevel1ClassroomCourse
			)
	},
	{
		id: "scratch-level-1",
		name: "Scratch Level 1",
		load: () =>
			import("./scratch-level-1").then(
				({ scratchLevel1Course }) => scratchLevel1Course
			)
	},
	{
		id: "scratch-level-1-bootcamp",
		name: "Scratch Level 1: Game Superstar Bootcamp",
		load: () =>
			import("./source-library-courses").then(
				({ scratchLevel1BootcampCourse }) => scratchLevel1BootcampCourse
			)
	},
	{
		id: "scratch-level-2",
		name: "Scratch Level 2",
		load: () =>
			import("./scratch-level-2").then(
				({ scratchLevel2Course }) => scratchLevel2Course
			)
	},
	{
		id: "python-level-1",
		name: "Python Level 1",
		load: () =>
			import("./python-level-1").then(
				({ pythonLevel1Course }) => pythonLevel1Course
			)
	},
	{
		id: "python-level-1-classroom",
		name: "Python Level 1: Classroom Edition",
		load: () =>
			import("./python-level-1-classroom").then(
				({ pythonLevel1ClassroomCourse }) => pythonLevel1ClassroomCourse
			)
	},
	{
		id: "pygames",
		name: "PyGames",
		load: () =>
			import("./pygames").then(({ pyGamesCourse }) => pyGamesCourse)
	},
	{
		id: "pygames-classroom",
		name: "PyGames: Classroom Edition",
		load: () =>
			import("./pygames-classroom").then(
				({ pyGamesClassroomCourse }) => pyGamesClassroomCourse
			)
	},
	{
		id: "python-level-2",
		name: "Python Level 2",
		load: () =>
			import("./python-level-2").then(
				({ pythonLevel2Course }) => pythonLevel2Course
			)
	},
	{
		id: "python-level-2-classroom",
		name: "Python Level 2: Classroom Edition",
		load: () =>
			import("./python-level-2-classroom").then(
				({ pythonLevel2ClassroomCourse }) => pythonLevel2ClassroomCourse
			)
	},
	{
		id: "python-level-3",
		name: "Python Level 3",
		load: () =>
			import("./python-level-3").then(
				({ pythonLevel3Course }) => pythonLevel3Course
			)
	},
	{
		id: "data-science-in-python",
		name: "Data Science in Python",
		load: () =>
			import("./data-science-in-python").then(
				({ dataScienceInPythonCourse }) => dataScienceInPythonCourse
			)
	},
	{
		id: "ai-level-1",
		name: "AI Level 1",
		load: () =>
			import("./ai-level-1").then(({ aiLevel1Course }) => aiLevel1Course)
	},
	{
		id: "early-elementary-a-math",
		name: "Early Elementary A: Numbers, Operations, and Measurement",
		load: () =>
			import("./source-library-courses").then(
				({ earlyElementaryMathACourse }) => earlyElementaryMathACourse
			)
	},
	{
		id: "early-elementary-b-math",
		name: "Early Elementary B: Arithmetic, Fractions, and Geometry",
		load: () =>
			import("./source-library-courses").then(
				({ earlyElementaryMathBCourse }) => earlyElementaryMathBCourse
			)
	},
	{
		id: "late-elementary-a-math",
		name: "Late Elementary A: Multiplication, Division, and Geometry",
		load: () =>
			import("./source-library-courses").then(
				({ lateElementaryMathACourse }) => lateElementaryMathACourse
			)
	},
	{
		id: "late-elementary-b-math",
		name: "Late Elementary B: Fractions, Decimals, Units, and Coordinates",
		load: () =>
			import("./source-library-courses").then(
				({ lateElementaryMathBCourse }) => lateElementaryMathBCourse
			)
	},
	{
		id: "pre-algebra-a",
		name: "Pre-Algebra A",
		load: () =>
			import("./pre-algebra-a").then(
				({ preAlgebraACourse }) => preAlgebraACourse
			)
	},
	{
		id: "pre-algebra-b",
		name: "Pre-Algebra B",
		load: () =>
			import("./pre-algebra-b").then(
				({ preAlgebraBCourse }) => preAlgebraBCourse
			)
	},
	{
		id: "algebra-1a",
		name: "Algebra 1A",
		load: () =>
			import("./algebra-1a").then(
				({ algebra1ACourse }) => algebra1ACourse
			)
	},
	{
		id: "algebra-1b",
		name: "Algebra 1B",
		load: () =>
			import("./algebra-1b").then(
				({ algebra1BCourse }) => algebra1BCourse
			)
	},
	{
		id: "geometry-a",
		name: "Geometry A",
		load: () =>
			import("./geometry-a").then(
				({ geometryACourse }) => geometryACourse
			)
	},
	{
		id: "geometry-b",
		name: "Geometry B",
		load: () =>
			import("./geometry-b").then(
				({ geometryBCourse }) => geometryBCourse
			)
	},
	{
		id: "algebra-2a",
		name: "Algebra 2A",
		load: () =>
			import("./algebra-2a").then(
				({ algebra2ACourse }) => algebra2ACourse
			)
	},
	{
		id: "algebra-2b",
		name: "Algebra 2B",
		load: () =>
			import("./algebra-2b").then(
				({ algebra2BCourse }) => algebra2BCourse
			)
	},
	{
		id: "pre-calculus-a",
		name: "Pre-Calculus and Trigonometry A",
		load: () =>
			import("./pre-calculus-a").then(
				({ preCalculusACourse }) => preCalculusACourse
			)
	},
	{
		id: "pre-calculus-b",
		name: "Pre-Calculus and Trigonometry B",
		load: () =>
			import("./pre-calculus-b").then(
				({ preCalculusBCourse }) => preCalculusBCourse
			)
	},
	{
		id: "ap-calculus",
		name: "AP Calculus",
		load: () =>
			import("./ap-calculus").then(
				({ apCalculusCourse }) => apCalculusCourse
			)
	},
	{
		id: "early-elementary-a-reading",
		name: "Early Elementary A: Discovering the Joy of Reading",
		load: () =>
			import("./source-library-courses").then(
				({ earlyElementaryJoyOfReadingCourse }) =>
					earlyElementaryJoyOfReadingCourse
			)
	},
	{
		id: "early-elementary-b-picture-book",
		name: "Early Elementary B: Write Your Own Picture Book",
		load: () =>
			import("./source-library-courses").then(
				({ earlyElementaryPictureBookCourse }) =>
					earlyElementaryPictureBookCourse
			)
	},
	{
		id: "introduction-to-public-speaking",
		name: "Make Your Point: Introduction to Public Speaking",
		load: () =>
			import("./source-library-courses").then(
				({ introductionToPublicSpeakingCourse }) =>
					introductionToPublicSpeakingCourse
			)
	},
	{
		id: "middle-school-a-literature",
		name: "Middle School A: Reading and Analyzing Literature",
		load: () =>
			import("./source-library-courses").then(
				({ middleSchoolLiteratureCourse }) =>
					middleSchoolLiteratureCourse
			)
	},
	{
		id: "middle-school-b-writing",
		name: "Middle School B: Analytical and Creative Writing",
		load: () =>
			import("./source-library-courses").then(
				({ middleSchoolWritingCourse }) => middleSchoolWritingCourse
			)
	},
	{
		id: "middle-school-b-writing-retake",
		name: "Middle School B: Analytical and Creative Writing Retake",
		load: () =>
			import("./source-library-courses").then(
				({ middleSchoolWritingRetakeCourse }) =>
					middleSchoolWritingRetakeCourse
			)
	},
	{
		id: "middle-school-c-grammar",
		name: "Middle School C: Grammar and Mechanics",
		load: () =>
			import("./source-library-courses").then(
				({ grammarMechanicsCourse }) => grammarMechanicsCourse
			)
	},
	{
		id: "novel-writing",
		name: "Novel Writing",
		load: () =>
			import("./source-library-courses").then(
				({ novelWritingCourse }) => novelWritingCourse
			)
	},
	{
		id: "smart-money-personal-finance",
		name: "Smart Money: Introduction to Personal Finance",
		load: () =>
			import("./source-library-courses").then(
				({ smartMoneyPersonalFinanceCourse }) =>
					smartMoneyPersonalFinanceCourse
			)
	},
	{
		id: "money-minded-investing",
		name: "Money-Minded: Investing in the Stock Market",
		load: () =>
			import("./source-library-courses").then(
				({ moneyMindedInvestingCourse }) => moneyMindedInvestingCourse
			)
	},
	{
		id: "entrepreneurship-101",
		name: "Be Your Own Boss: Entrepreneurship 101",
		load: () =>
			import("./source-library-courses").then(
				({ entrepreneurship101Course }) => entrepreneurship101Course
			)
	},
	{
		id: "python-to-java-and-cpp-bridge",
		name: "Python to Java and C++ Bridge",
		load: () =>
			import("./python-to-java-and-cpp-bridge").then(
				({ pythonToJavaAndCppBridgeCourse }) =>
					pythonToJavaAndCppBridgeCourse
			)
	},
	{
		id: "c-level-1",
		name: "C++ Level 1",
		load: () =>
			import("./cpp-level-1").then(
				({ cppLevel1Course }) => cppLevel1Course
			)
	},
	{
		id: "cpp-level-2",
		name: "C++ Level 2",
		load: () =>
			import("./cpp-level-2").then(
				({ cppLevel2Course }) => cppLevel2Course
			)
	},
	{
		id: "cpp-level-3",
		name: "C++ Level 3",
		load: () =>
			import("./cpp-level-3").then(
				({ cppLevel3Course }) => cppLevel3Course
			)
	},
	{
		id: "data-structures-and-algorithms-in-cpp",
		name: "Data Structures and Algorithms in C++",
		load: () =>
			import("./data-structures-and-algorithms-in-cpp").then(
				({ dataStructuresAndAlgorithmsInCppCourse }) =>
					dataStructuresAndAlgorithmsInCppCourse
			)
	},
	{
		id: "c-systems-engineering",
		name: "C Systems Engineering",
		load: () =>
			import("./c-systems-engineering").then(
				({ cSystemsEngineeringCourse }) => cSystemsEngineeringCourse
			)
	},
	{
		id: "assembly",
		name: "Assembly",
		load: () =>
			import("./assembly").then(({ assemblyCourse }) => assemblyCourse)
	},
	{
		id: "java-level-1",
		name: "Java Level 1",
		load: () =>
			import("./java-level-1").then(
				({ javaLevel1Course }) => javaLevel1Course
			)
	},
	{
		id: "java-level-2",
		name: "Java Level 2",
		load: () =>
			import("./java-level-2").then(
				({ javaLevel2Course }) => javaLevel2Course
			)
	},
	{
		id: "java-level-3",
		name: "Java Level 3",
		load: () =>
			import("./java-level-3").then(
				({ javaLevel3Course }) => javaLevel3Course
			)
	},
	{
		id: "ap-computer-science-a",
		name: "AP Computer Science A",
		load: () =>
			import("./ap-computer-science-a").then(
				({ apComputerScienceACourse }) => apComputerScienceACourse
			)
	},
	{
		id: "usaco-bronze",
		name: "USACO Bronze",
		load: () =>
			import("./usaco-bronze").then(
				({ usacoBronzeCourse }) => usacoBronzeCourse
			)
	},
	{
		id: "usaco-bronze-on-demand",
		name: "USACO Bronze: On Demand",
		load: () =>
			import("./source-library-courses").then(
				({ usacoBronzeOnDemandCourse }) => usacoBronzeOnDemandCourse
			)
	},
	{
		id: "usaco-silver",
		name: "USACO Silver",
		load: () =>
			import("./usaco-silver").then(
				({ usacoSilverCourse }) => usacoSilverCourse
			)
	},
	{
		id: "usaco-gold",
		name: "USACO Gold",
		load: () =>
			import("./usaco-gold").then(
				({ usacoGoldCourse }) => usacoGoldCourse
			)
	},
	{
		id: "design-patterns-in-java",
		name: "Design Patterns in Java",
		load: () =>
			import("./design-patterns-in-java").then(
				({ designPatternsInJavaCourse }) => designPatternsInJavaCourse
			)
	},
	{
		id: "design-patterns-in-java-part-2",
		name: "Design Patterns in Java Part 2: Refactoring",
		load: () =>
			import("./design-patterns-in-java-part-2").then(
				({ designPatternsInJavaPart2Course }) =>
					designPatternsInJavaPart2Course
			)
	},
	{
		id: "design-patterns-in-cpp",
		name: "Design Patterns in C++",
		load: () =>
			import("./design-patterns-in-cpp").then(
				({ designPatternsInCppCourse }) => designPatternsInCppCourse
			)
	},
	{
		id: "pythonic-design-patterns",
		name: "Pythonic Design Patterns",
		load: () =>
			import("./pythonic-design-patterns").then(
				({ pythonicDesignPatternsCourse }) =>
					pythonicDesignPatternsCourse
			)
	},
	{
		id: "intro-to-chemistry",
		name: "Intro to Chemistry",
		load: () =>
			import("./intro-to-chemistry").then(
				({ introToChemistryCourse }) => introToChemistryCourse
			)
	},
	{
		id: "intro-to-biology",
		name: "Intro to Biology",
		load: () =>
			import("./intro-to-biology").then(
				({ introToBiologyCourse }) => introToBiologyCourse
			)
	},
	{
		id: "intro-to-environmental-science",
		name: "Intro to Environmental Science",
		load: () =>
			import("./intro-to-environmental-science").then(
				({ introToEnvironmentalScienceCourse }) =>
					introToEnvironmentalScienceCourse
			)
	},
	{
		id: "elementary-science",
		name: "Elementary Science",
		load: () =>
			import("./elementary-science").then(
				({ elementaryScienceCourse }) => elementaryScienceCourse
			)
	},
	{
		id: "middle-school-integrated-science",
		name: "Middle School Integrated Science",
		load: () =>
			import("./middle-school-integrated-science").then(
				({ middleSchoolIntegratedScienceCourse }) =>
					middleSchoolIntegratedScienceCourse
			)
	},
	{
		id: "intro-to-physics",
		name: "Intro to Physics",
		load: () =>
			import("./intro-to-physics").then(
				({ introToPhysicsCourse }) => introToPhysicsCourse
			)
	},
	{
		id: "physics-level-2",
		name: "Physics Level 2",
		load: () =>
			import("./physics-level-2").then(
				({ physicsLevel2Course }) => physicsLevel2Course
			)
	},
	{
		id: "intro-to-swift-app-development",
		name: "Intro to Swift App Development",
		load: () =>
			import("./intro-to-swift-app-development").then(
				({ introToSwiftAppDevelopmentCourse }) =>
					introToSwiftAppDevelopmentCourse
			)
	},
	{
		id: "unity-game-development",
		name: "Unity Game Development",
		load: () =>
			import("./unity-game-development").then(
				({ unityGameDevelopmentCourse }) => unityGameDevelopmentCourse
			)
	},
	{
		id: "linux-systems",
		name: "Linux Systems",
		load: () =>
			import("./linux-systems").then(
				({ linuxSystemsCourse }) => linuxSystemsCourse
			)
	},
	{
		id: "network-systems",
		name: "Network Systems",
		load: () =>
			import("./network-systems").then(
				({ networkSystemsCourse }) => networkSystemsCourse
			)
	},
	{
		id: "network-security",
		name: "Network Security",
		load: () =>
			import("./network-security").then(
				({ networkSecurityCourse }) => networkSecurityCourse
			)
	},
	{
		id: "rust-systems-security",
		name: "Rust Systems Security",
		load: () =>
			import("./rust-systems-security").then(
				({ rustSystemsSecurityCourse }) => rustSystemsSecurityCourse
			)
	},
	{
		id: "javascript-level-1-javascript-superstar",
		name: "JavaScript Level 1: JavaScript Superstar",
		load: () =>
			import("./javascript-level-1").then(
				({ javascriptLevel1Course }) => javascriptLevel1Course
			)
	},
	{
		id: "javascript-level-2-javascript-master",
		name: "JavaScript Level 2: JavaScript Master",
		load: () =>
			import("./javascript-level-2").then(
				({ javascriptLevel2Course }) => javascriptLevel2Course
			)
	},
	{
		id: "web-development-foundations",
		name: "Web Development Foundations",
		load: () =>
			import("./web-development-foundations").then(
				({ webDevelopmentFoundationsCourse }) =>
					webDevelopmentFoundationsCourse
			)
	},
	{
		id: "machine-learning",
		name: "Machine Learning",
		load: () =>
			import("./machine-learning").then(
				({ machineLearningCourse }) => machineLearningCourse
			)
	},
	{
		id: "low-level-security",
		name: "Low Level Security",
		load: () =>
			import("./low-level-security").then(
				({ lowLevelSecurityCourse }) => lowLevelSecurityCourse
			)
	},
	{
		id: "low-level-security-part-2",
		name: "Low Level Security Part 2",
		load: () =>
			import("./low-level-security-part-2").then(
				({ lowLevelSecurityPart2Course }) => lowLevelSecurityPart2Course
			)
	}
];

const courseCatalogById = new Map(
	courseCatalog.map(entry => [entry.id, entry])
);

// Course definitions remain addressable for saved work and historical records.
const unlistedCourseIds = new Set([
	"early-elementary-a-reading",
	"early-elementary-b-picture-book",
	"middle-school-a-literature",
	"middle-school-b-writing",
	"middle-school-b-writing-retake",
	"novel-writing",
	"intro-to-biology"
]);

export function isListedCourse(id: string) {
	return courseCatalogById.has(id) && !unlistedCourseIds.has(id);
}

export const listedCourseCatalog = courseCatalog.filter(course =>
	isListedCourse(course.id)
);

export function getCourseCatalogEntry(id: string) {
	return courseCatalogById.get(id) ?? null;
}

export async function loadRawCourse(id: string) {
	const rawCourse = await getCourseCatalogEntry(id)?.load();
	return rawCourse ? normalizeRawCourse(id, rawCourse) : null;
}
