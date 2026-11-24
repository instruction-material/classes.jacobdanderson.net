const binarySearchPack =
	"https://github.com/instruction-material/APCS/tree/b12cdaaa9bc35a88d281666f0060bc8a90d470ad/APCS16-Binary-Search";
const algorithmPacks =
	"https://github.com/instruction-material/APCS/tree/34f8f99a5ab4b895521c8827fa70c892bc4150fa";
const earlyCorePacks =
	"https://github.com/instruction-material/APCS/tree/932287d8e26661b0635478f9215ec7e7e12c74ad";
const remainingCorePacks =
	"https://github.com/instruction-material/APCS/tree/cd756a50230e8ae0736ced745f75231f4cd3fb40";
const introductoryPacks =
	"https://github.com/instruction-material/APCS/tree/55c644daf81e78318e3539f82ae027e69437bc76";

const foundationsSupplementalPacks =
	"https://github.com/instruction-material/APCS/tree/95a28a1dd6668063be598bf517cf248c27d1bdc9";

const variablesAndLoopsPacks =
	"https://github.com/instruction-material/APCS/tree/4c47eb1c12154f8ca8cb7f864d7f3a7b6a52685e";

const expressionsAndClassPacks =
	"https://github.com/instruction-material/APCS/tree/c1a6918718a986c8ef4a7a400dda0eb5a90b9bff";

const classesAndArraysPacks =
	"https://github.com/instruction-material/APCS/tree/9a0a543060abfe939bec01ebdc9d0cd876ba387c";

function projectRoles(pack: string) {
	return {
		starter: `${pack}/starter`,
		reference: `${pack}/solution`
	};
}

export const apBinarySearchResources = projectRoles(binarySearchPack);
export const apRecursionPracticeResources = projectRoles(
	`${algorithmPacks}/APCS15-Recursion-Practice`
);
export const apRecursionReferenceResources = projectRoles(
	"https://github.com/instruction-material/APCS/tree/390ee9cfd7895d80d98cf1e44b7d8733fb82423d/APCS15-Recursion-Reference"
);
export const apBlobEraseResources = projectRoles(
	`${algorithmPacks}/APCS15-Blob-Erase`
);
export const apMergeSortResources = projectRoles(
	`${algorithmPacks}/APCS16-Merge-Sort`
);
export const apElevatorWarningResources = projectRoles(
	`${earlyCorePacks}/APCS3-Elevator-Warning`
);
export const apStudentClassResources = projectRoles(
	`${earlyCorePacks}/APCS5-Student-Class`
);

export const apRemainingCoreResources = {
	"vending-machine": projectRoles(
		`${remainingCorePacks}/APCS6-Vending-Machine-Class`
	),
	"array-practice": projectRoles(
		`${remainingCorePacks}/APCS10-Practice-With-Arrays`
	),
	"array-list-practice": projectRoles(
		`${remainingCorePacks}/APCS11-Practice-With-Array-Lists`
	),
	"selection-sort": projectRoles(
		`${remainingCorePacks}/APCS14-Selection-Sort`
	),
	spaceships: projectRoles(`${remainingCorePacks}/APCS17-Spaceships`)
};

export const apIntroductoryResources = {
	rounding: projectRoles(`${introductoryPacks}/APCS1-Rounding-It-Off`),
	"hospital-survey": projectRoles(
		`${introductoryPacks}/APCS1-Hospital-Survey`
	),
	"quotient-and-remainder": projectRoles(
		`${introductoryPacks}/APCS2-Quotient-and-Remainder`
	),
	"two-in-one": projectRoles(`${introductoryPacks}/APCS2-Two-In-One`)
};

export const apFoundationsSupplementalResources = {
	"strings-printing": projectRoles(
		`${foundationsSupplementalPacks}/APCS1-Strings-and-Printing-Reference`
	),
	"boolean-crossing": projectRoles(
		`${foundationsSupplementalPacks}/APCS2-Too-Chicken-To-Cross-The-Road`
	),
	"conditional-crossing": projectRoles(
		`${foundationsSupplementalPacks}/APCS3-Too-Chicken-Take-Two`
	),
	"math-reference": projectRoles(
		`${foundationsSupplementalPacks}/APCS3-Math-Package-Reference`
	),
	"random-range": projectRoles(
		`${foundationsSupplementalPacks}/APCS3-Random-Numbers-Reference`
	),
	"math-demo": projectRoles(`${foundationsSupplementalPacks}/APCS3-Math-Fun`),
	"conditionals-reference": projectRoles(
		`${foundationsSupplementalPacks}/APCS3-Conditionals-Reference`
	)
};

export const apVariablesAndLoopsResources = {
	"variables-reference": projectRoles(
		`${variablesAndLoopsPacks}/APCS1-Variables-Reference`
	),
	"casting-reference": projectRoles(
		`${variablesAndLoopsPacks}/APCS1-Casting-Reference`
	),
	fizzbuzz: projectRoles(
		`${variablesAndLoopsPacks}/APCS-Check-in-1-Additional-Practice-Project`
	),
	"loop-reference": projectRoles(
		`${variablesAndLoopsPacks}/APCS4-Loops-Reference`
	),
	"for-loop-practice": projectRoles(
		`${variablesAndLoopsPacks}/APCS4-For-Loop-Practice`
	),
	"while-nested-practice": projectRoles(
		`${variablesAndLoopsPacks}/APCS4-While-Loop-and-Nested-Loop-Practice`
	),
	"nested-loop-reference": projectRoles(
		`${variablesAndLoopsPacks}/APCS4-While-Loops-and-Nested-Loops-Reference`
	)
};

export const apExpressionsAndClassResources = {
	"verifying-expressions": projectRoles(
		`${expressionsAndClassPacks}/APCS2-Verifying-Expressions`
	),
	"translating-loops": projectRoles(
		`${expressionsAndClassPacks}/APCS4-Translating-Loops`
	),
	"method-practice": projectRoles(
		`${expressionsAndClassPacks}/APCS5-Practice-with-Methods`
	),
	"store-class": projectRoles(
		`${expressionsAndClassPacks}/APCS5-Store-Class`
	),
	"spreadsheet-width": projectRoles(
		`${expressionsAndClassPacks}/APCS5-Spreadsheet-Width`
	),
	"class-constructor": projectRoles(
		`${expressionsAndClassPacks}/APCS5-Class-Example`
	),
	"this-fields": projectRoles(
		`${expressionsAndClassPacks}/APCS6-This-Reference`
	)
};

export const apClassesAndArraysResources = {
	"bank-account": projectRoles(
		`${classesAndArraysPacks}/APCS6-Bank-Account-Class`
	),
	"time-accessors": projectRoles(
		`${classesAndArraysPacks}/APCS6-Getters-and-Setters-Reference`
	),
	"letter-shifter": projectRoles(
		`${classesAndArraysPacks}/APCS-Check-in-3-Additional-Practice-Project`
	),
	"random-mad-libs": projectRoles(
		`${classesAndArraysPacks}/APCS10-Random-Mad-Lib`
	),
	"two-dimensional-arrays": projectRoles(
		`${classesAndArraysPacks}/APCS10-Practice-With-Two-Dimensional-Arrays`
	),
	"matrix-arithmetic": projectRoles(
		`${classesAndArraysPacks}/APCS10-Matrix-Arithmetic`
	),
	"array-reference": projectRoles(
		`${classesAndArraysPacks}/APCS10-Array-Reference`
	)
};

const restoredProjects = {
	"binary-search-trace": apBinarySearchResources,
	"recursion-practice": apRecursionPracticeResources,
	"recursion-reference": apRecursionReferenceResources,
	"blob-erase": apBlobEraseResources,
	"merge-sort": apMergeSortResources,
	"elevator-warning": apElevatorWarningResources,
	"student-class": apStudentClassResources,
	...apRemainingCoreResources,
	...apIntroductoryResources,
	...apFoundationsSupplementalResources,
	...apVariablesAndLoopsResources,
	...apExpressionsAndClassResources,
	...apClassesAndArraysResources
};

export function apComputerScienceAProjectKey(
	courseID: string,
	itemID: string,
	role: "starter" | "reference",
	url: string
) {
	const base = `${courseID}:${itemID}:${role}`;
	if (courseID !== "ap-computer-science-a") return base;
	// Preserve earlier attempts when opening a restored source pack.
	const restored = Object.entries(restoredProjects).find(
		([, links]) => url === links[role]
	);
	return restored ? `${base}:${restored[0]}` : base;
}

const nativeClassWorkspaces = {
	"store-class": {
		item: "ap-computer-science-a-apcs5-classes-part-i-supplemental-project-store-class",
		files: ["Store.java"]
	},
	"class-constructor": {
		item: "ap-computer-science-a-check-in-2-supplemental-class-example",
		files: ["TestClass.java"]
	},
	"this-fields": {
		item: "ap-computer-science-a-check-in-2-supplemental-this-reference",
		files: ["Counter.java"]
	},
	"bank-account": {
		item: "ap-computer-science-a-apcs6-classes-part-ii-supplemental-project-bank-account-class",
		files: ["BankAccount.java"]
	},
	"time-accessors": {
		item: "ap-computer-science-a-apcs6-classes-part-ii-supplemental-reference-getters-and-setters",
		files: ["Time.java"]
	},
	"letter-shifter": {
		item: "ap-computer-science-a-check-in-3-supplemental-additional-practice-letter-shifter",
		files: ["Shifter.java", "UpShifter.java", "DownShifter.java"]
	}
};

export function apComputerScienceANativeInstructions(
	courseProjectKey?: string
) {
	const [course, item, role, kind, extra] = (courseProjectKey ?? "").split(
		":"
	);
	if (
		course !== "ap-computer-science-a" ||
		extra !== undefined ||
		(role !== "starter" && role !== "reference")
	) {
		return null;
	}
	const target = Object.entries(nativeClassWorkspaces).find(
		([key, workspace]) => key === kind && workspace.item === item
	)?.[1];
	if (!target) return null;
	return [
		"Save the project and download its ZIP. Extract the files and open the project folder in a terminal with JDK 17 or later.",
		`javac Main.java ${target.files.join(" ")}`,
		"java Main",
		"Compare the terminal output with the checks in the project guide."
	];
}
