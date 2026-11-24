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

const listsAndAlgorithmsPacks =
	"https://github.com/instruction-material/APCS/tree/c5519770180b64b744a269c5c83a2d0d022fab9b";

const checkInAndFrqPacks =
	"https://github.com/instruction-material/APCS/tree/2c31ff05f50d2ba581a70422ccd64997f07f2c53";

const advancedPracticePacks =
	"https://github.com/instruction-material/APCS/tree/6475cc8387dde39aaa92509143f957ef0fb4cc93";

const enrichmentPacks =
	"https://github.com/instruction-material/APCS/tree/221282169a62a3a770e1d52914061f7c93051353";

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

export const apListsAndAlgorithmsResources = {
	"array-list-reference": projectRoles(
		`${listsAndAlgorithmsPacks}/APCS11-Array-List-Reference`
	),
	"fortune-teller": projectRoles(
		`${listsAndAlgorithmsPacks}/APCS11-Fortune-Teller-Class`
	),
	"card-and-deck": projectRoles(
		`${listsAndAlgorithmsPacks}/APCS11-Card-and-Deck-Classes`
	),
	"minimum-and-maximum": projectRoles(
		`${listsAndAlgorithmsPacks}/APCS12-Minimum-and-Maximum`
	),
	"deck-class": projectRoles(`${listsAndAlgorithmsPacks}/APCS12-Deck-Class`),
	"linear-search": projectRoles(
		`${listsAndAlgorithmsPacks}/APCS13-Linear-Search-Implementation`
	),
	"insertion-sort": projectRoles(
		`${listsAndAlgorithmsPacks}/APCS14-Insertion-Sort`
	)
};

export const apCheckInAndFrqResources = {
	"check-in-1": projectRoles(`${checkInAndFrqPacks}/APCS-Check-in-1`),
	"check-in-2": projectRoles(`${checkInAndFrqPacks}/APCS-Check-in-2`),
	"check-in-3": projectRoles(`${checkInAndFrqPacks}/APCS-Check-in-3`),
	"check-in-4": projectRoles(`${checkInAndFrqPacks}/APCS-Check-in-4`),
	"step-tracker-frq": projectRoles(
		`${checkInAndFrqPacks}/APCS5-Free-Response-Practice`
	),
	"calendar-frq": projectRoles(
		`${checkInAndFrqPacks}/APCS6-Free-Response-Practice`
	),
	"delimiters-frq": projectRoles(
		`${checkInAndFrqPacks}/APCS11-Free-Response-Practice`
	)
};

export const apAdvancedPracticeResources = {
	"inversion-counting": projectRoles(
		`${advancedPracticePacks}/APCS-Check-in-4-Additional-Practice-Project`
	),
	"stack-overflow-reference": projectRoles(
		`${advancedPracticePacks}/APCS15-Stack-Overflow-Reference`
	),
	decode: projectRoles(`${advancedPracticePacks}/APCS17-Decode`),
	elevens: projectRoles(`${advancedPracticePacks}/APCS17-Elevens`)
};

export const apEnrichmentResources = {
	"animal-kingdom": projectRoles(
		`${enrichmentPacks}/APCS-Check-in-2-Additional-Practice-Project`
	),
	"picture-books": projectRoles(
		`${enrichmentPacks}/APCS7-Books-and-Picture-Books`
	),
	pets: projectRoles(`${enrichmentPacks}/APCS7-Pets`),
	"dog-methods": projectRoles(`${enrichmentPacks}/APCS7-Dogs`)
};

const inputAndCardPacks =
	"https://github.com/instruction-material/APCS/tree/f057ba52017c053f1502b3e86556d97823cd7a4e";
export const apInputAndCardResources = {
	"robust-input": projectRoles(
		`${inputAndCardPacks}/APCS9-Robust-Input-Practice`
	),
	"suit-deck-hand": projectRoles(
		`${inputAndCardPacks}/APCS12-Suit-Deck-and-Hand`
	)
};

export const apRuntimeAnalysisResources = projectRoles(
	"https://github.com/instruction-material/APCS/tree/1579d8c80e31869e053b60d6fadc067fa61b7573/APCS13-Runtime-Analysis"
);

const farmAndShapePacks =
	"https://github.com/instruction-material/APCS/tree/95c8a262e85778b7d99836e082f02ad785da69e0";
export const apFarmAndShapeResources = {
	"farm-class": projectRoles(`${farmAndShapePacks}/APCS6-Farm-Class`),
	"many-shapes": projectRoles(`${farmAndShapePacks}/APCS8-Many-Shapes`)
};

const storyShuffleTracePacks =
	"https://github.com/instruction-material/APCS/tree/1ec1614f5fe54cf37edd164a7a082c6e21c12f45";
export const apStoryShuffleTraceResources = {
	"mad-libs": projectRoles(`${storyShuffleTracePacks}/APCS1-Mad-Libs`),
	"card-shuffler": projectRoles(
		`${storyShuffleTracePacks}/APCS11-Card-Shuffler`
	),
	"tracing-recursion": projectRoles(
		`${storyShuffleTracePacks}/APCS15-Tracing-Recursion`
	)
};

const restoredProjects = {
	...apStoryShuffleTraceResources,
	...apFarmAndShapeResources,
	"runtime-analysis": apRuntimeAnalysisResources,
	...apInputAndCardResources,
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
	...apClassesAndArraysResources,
	...apListsAndAlgorithmsResources,
	...apCheckInAndFrqResources,
	...apAdvancedPracticeResources,
	...apEnrichmentResources
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
	"card-shuffler": {
		item: "ap-computer-science-a-apcs11-arraylists-supplemental-project-card-shuffler",
		files: ["Card.java"]
	},

	"farm-class": {
		item: "ap-computer-science-a-apcs6-classes-part-ii-supplemental-project-farm-class",
		files: ["Farm.java"]
	},
	"many-shapes": {
		item: "ap-computer-science-a-optional-inheritance-and-polymorphism-enrichment-supplemental-core-project-many-shapes",
		files: [
			"Circle.java",
			"Rectangle.java",
			"RightTriangle.java",
			"Shape.java",
			"Square.java"
		]
	},

	"robust-input": {
		item: "ap-computer-science-a-apcs9-software-development-lifecycle-curriculum-core-project-robust-input-practice",
		files: ["RobustScanner.java"]
	},
	"suit-deck-hand": {
		item: "ap-computer-science-a-apcs12-wrapper-classes-curriculum-core-project-suits-decks-and-hands",
		files: ["Card.java", "Deck.java", "Hand.java", "Suit.java"]
	},

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
	},
	"fortune-teller": {
		item: "ap-computer-science-a-apcs11-arraylists-supplemental-project-fortune-teller",
		files: ["FortuneTeller.java"]
	},
	"card-and-deck": {
		item: "ap-computer-science-a-apcs11-arraylists-supplemental-card-and-deck-classes",
		files: ["Card.java", "Deck.java", "LuckGame.java"]
	},
	"deck-class": {
		item: "ap-computer-science-a-apcs12-wrapper-classes-supplemental-project-deck-class",
		files: ["Card.java", "Deck.java", "Luck.java", "Suit.java"]
	},
	"check-in-3": {
		item: "ap-computer-science-a-check-in-3-curriculum-core-check-in-prompt-bank",
		files: ["SupplyBin.java"]
	},
	"step-tracker-frq": {
		item: "ap-computer-science-a-apcs5-classes-part-i-curriculum-free-response-prep",
		files: ["StepTracker.java"]
	},
	"calendar-frq": {
		item: "ap-computer-science-a-apcs6-classes-part-ii-curriculum-free-response-and-multiple-choice-support",
		files: ["APCalendar.java"]
	},
	"delimiters-frq": {
		item: "ap-computer-science-a-apcs11-arraylists-supplemental-free-response-practice",
		files: ["Delimiters.java"]
	},
	decode: {
		item: "ap-computer-science-a-apcs17-master-projects-and-test-prep-supplemental-master-project-decode",
		files: ["Message.java", "Tower.java"]
	},
	elevens: {
		item: "ap-computer-science-a-apcs17-master-projects-and-test-prep-supplemental-master-project-elevens",
		files: ["Card.java", "Deck.java", "Elevens.java", "Suit.java"]
	},
	"animal-kingdom": {
		item: "ap-computer-science-a-check-in-2-supplemental-additional-practice-animal-kingdom",
		files: ["Animal.java", "Mammal.java", "Primate.java"]
	},
	"picture-books": {
		item: "ap-computer-science-a-optional-inheritance-and-polymorphism-enrichment-supplemental-core-project-book-and-picturebook-class",
		files: ["Book.java", "PictureBook.java"]
	},
	pets: {
		item: "ap-computer-science-a-optional-inheritance-and-polymorphism-enrichment-supplemental-project-pet-class",
		files: ["Pet.java", "Dog.java", "Cat.java", "Fish.java"]
	},
	"dog-methods": {
		item: "ap-computer-science-a-optional-inheritance-and-polymorphism-enrichment-supplemental-project-pet-special-methods",
		files: ["Dog.java", "Poodle.java", "MiniPoodle.java", "Pug.java"]
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
