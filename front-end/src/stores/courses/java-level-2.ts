import type { RawCourse, RawCourseModuleItem } from "./types";
import { buildImplementationLabGuidance } from "./implementationLabGuidance";
import { isCoreProjectTitle } from "./projectGrouping";
import { buildProjectGuidance } from "./projectGuidance";
import { pendingStaticMediaNotice, staticMediaUrl } from "./staticMedia";
import { buildSupportSectionGuidance } from "./supportSectionGuidance";

const JAVA_LEVEL_2_ORIGINAL_MEDIA = [
	"jm_1_dog_class.mp4",
	"jm_2_book_class.mp4",
	"jm_2_person_class.mp4",
	"jm_3_house_class.mp4",
	"jm_3_quiz_class.mp4",
	"jm_4_book_and_picturebook.mp4",
	"jm_4_lesson_and_dancelesson.mp4",
	"jm_4_rectangle_and_square.mp4",
	"jm_5_first_train_class.mp4",
	"jm_5_train_class.mp4",
	"jm_6_mrs_pacman.mp4",
	"jm_6_pacman_class.mp4",
	"jm_7_bubble_maker.mp4",
	"jm_7_click_circle.mp4",
	"jm_8_disco_ball.mp4",
	"jm_8_pacman_eater.mp4",
	"jm_8_pacman_eater_animated.mp4",
	"jm_9_block_game.mp4",
	"jm_9_disco_floor.mp4",
	"jm_9_falling_blocks.mp4",
	"jm_10_tic_tac_toe.mp4"
];

const javaLevel2SourceCourse: RawCourse = {
	name: "Java Level 2",
	modules: [
		{
			title: "JM0 Visual-to-OOP Bridge",
			curriculum: [
				{
					title: "Bridge from Robot Objects to Custom Classes",
					content:
						"Start Java Level 2 by revisiting the visible robot object from Java Level 1. The robot had state, constructor arguments, and methods; now students design their own classes with the same ideas made explicit in fields, constructors, and instance methods."
				},
				{
					title: "BlueJ Object Bench and Console Fallback",
					content:
						"BlueJ's object bench supports in-class object instantiation, field inspection, and method calls before a larger driver program is written. CodeHS or the browser Code IDE provides the outside-class fallback, with small `main()` traces and `toString()` output replacing object-bench inspection."
				},
				{
					title: "Object State Trace",
					content:
						"Before the `Dog`, `Person`, or `Book` projects, a written trace shows constructor call, initial field values, one method call, and the resulting state change. This keeps object-oriented programming tied to visible evidence instead of vocabulary alone."
				}
			],
			supplementalProjects: [
				{
					title: "JM0 Supplemental Project 1: Robot-to-Dog Mapping",
					content:
						"Make a two-column map from robot ideas to class-design ideas: street/avenue to fields, constructor arguments to initial state, movement commands to methods, and world output to `toString()` or printed traces."
				},
				{
					title: "JM0 Supplemental Project 2: Constructor Trace Card",
					content:
						"Pick one upcoming class project and write three constructor calls with expected field values before coding. The completed class makes those predictions visible through getters or `toString()`."
				}
			]
		},
		{
			title: "JM1 Instance Variables, Constructors, and Methods",
			curriculum: [
				{
					title: "Introductions and Java Setup",
					content:
						"Get comfortable with the Java workspace, custom Java files, and the shift from visual object use to object-oriented class design. Review the role of `main()` as a testing driver while starting to define additional classes in separate files."
				},
				{
					title: "Objects vs. Classes",
					content:
						"Learn how a class acts as a template and an object acts as an instance with its own data and behavior. Connect this directly to the earlier robot object: constructor arguments create object state, and method calls change or report that state."
				},
				{
					title: "JM1 Project 1: Dog Class",
					content:
						"Create a `Dog` class with private instance variables, constructors, getters, setters, and a `toString()` method. Then create dog objects in `main()` and use them to practice encapsulation and controlled updates.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/JM1-Dog-Class"
				},
				{
					title: "More on Object-Oriented Programming",
					content:
						"Connect the `Dog` class to broader OOP ideas such as modularity, reusability, encapsulation, and scalability."
				}
			],
			supplementalProjects: [
				{
					title: "JM1 Supplemental Project 1: Employee Class",
					content:
						"Create an `Employee` class with identifying information, getters, setters, and a `toString()` method, then create and update employee objects in `main()`.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/JM1-Supplemental-Project-1-Employee",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/JM1-Supplemental-Project-1-Employee"
				}
			]
		},
		{
			title: "JM2 Overloaded Constructors & Comparison Methods",
			curriculum: [
				{
					title: "JM2 Project 1: Person Class",
					content:
						"Create a `Person` class with core instance variables, constructors, getters, setters, and `toString()`, then create multiple people and update their state through methods.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/JM2-Person-Class",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/JM2-Person-Class"
				},
				{
					title: "Overloaded and Default Constructors",
					content:
						"Use overloaded constructors to support different object initialization patterns, compare custom constructors with Java's default constructor, and optionally use `this()` to reduce repeated constructor code."
				},
				{
					title: "JM2 Project 2: Book Class",
					content:
						"Create a `Book` class with overloaded constructors, getters, state-updating methods, and a `toString()` method. Then add comparison methods such as `hasSameAuthor()` and `isSameBook()`.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/JM2-Book-Class",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/JM2-Book-Class"
				},
				{
					title: "Overloaded Constructors & Comparison Methods: Verification and Reflection",
					content: buildSupportSectionGuidance({
						courseFamily: "Java Level 2",
						moduleTitle:
							"Overloaded Constructors & Comparison Methods",
						section: "verification"
					})
				}
			],
			supplementalProjects: [
				{
					title: "JM2 Supplemental Project 1: Boba Shop",
					content:
						"Create a `Boba` class with multiple constructors, update methods, and a comparison method to check whether two drink orders are the same.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/JM2-Supplemental-Project-2-Boba",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/JM2-Supplemental-Project-2-Boba"
				}
			]
		},
		{
			title: "JM3 Static Variables & Methods",
			curriculum: [
				{
					title: "JM3 Project 1: Quiz Class",
					content:
						"Create a `Quiz` class with instance data, multiple constructors, getters, and a `toString()` method, then add a static variable and static getter to track how many quizzes have been created.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/JM3-Quiz-Class",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/JM3-Quiz-Class"
				},
				{
					title: "Static Variables and Methods",
					content:
						"Use static members for class-wide information and practice calling static methods through the class itself rather than through an object."
				},
				{
					title: "JM3 Project 2: House Class",
					content:
						"Create a `House` class with a static total count, implement `Comparable<House>`, sort an array of houses by price with square footage as a tiebreaker, and print the sorted results.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/JM3-House-Class",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/JM3-House-Class"
				},
				{
					title: "compareTo Method",
					content:
						"Learn how `compareTo()` defines ordering for custom objects and why that ordering enables `Arrays.sort()` to work on arrays of those objects."
				}
			],
			supplementalProjects: [
				{
					title: "JM3 Supplemental Project 1: Basketball Statistics",
					content:
						"Create a `Player` class with stats, sorting behavior, and foul tracking, then sort a team of players and determine whether each player is disqualified.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/JM3-Supplemental-Project-1-Basketball-Statistics",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/JM3-Supplemental-Project-1-Basketball-Statistics"
				},
				{
					title: "Static Variables & Methods Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "Java Level 2",
						moduleTitle: "JM3 Static Variables & Methods",
						itemTitle:
							"Static Variables & Methods Extension Practice",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/J2-01-jm3-static-variables-and-methods-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/J2-01-jm3-static-variables-and-methods-supplemental-3/solution"
				}
			]
		},
		{
			title: "Check-In #1",
			curriculum: [
				{
					title: "Check-In #1 Overview",
					content:
						"This module is a low-pressure review of object-oriented programming basics in Java, including classes, constructors, instance methods, static members, and comparable objects.",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/JM-Check-in-1"
				},
				{
					title: "Check-In #1: Classes and Objects",
					content:
						"Review the difference between a class and an object by creating a `Car` class with private instance variables, multiple constructors, and several `Car` instances in `main()`."
				},
				{
					title: "Check-In #1: Class Methods",
					content:
						"Add getters, a `drive` method, a `toString` method, and a comparison method such as `sameMileage()` that takes another object and checks shared state."
				},
				{
					title: "Check-In #1: Static Variables and Methods",
					content:
						"Use a static variable to track how many `Car` objects exist and a static getter method to return that class-wide count."
				},
				{
					title: "Check-In #1: Comparable Objects",
					content:
						"Implement `Comparable` for the `Car` class, define `compareTo()`, sort an array of cars, and explain when `compareTo()` returns `-1`, `0`, or `1`."
				},
				{
					title: "Check-In #1: Additional Practice Project",
					content:
						"Create a comparable `Card` class with rank and suit, implement constructors and getters, write `toString()`, define `compareTo()`, and sort an array of randomly generated cards.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/JM-Check-in-1-Additional-Project",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/JM-Check-in-1-Additional-Project"
				}
			],
			supplementalProjects: [
				{
					title: "Check-In #1: Extension Challenge",
					content: buildSupportSectionGuidance({
						courseFamily: "Java Level 2",
						moduleTitle: "Check-In #1",
						section: "extension"
					}),
					solutionLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/JM-Check-in-1"
				},
				{
					title: "Check-In #1 Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "Java Level 2",
						moduleTitle: "Check-In #1",
						itemTitle: "Check-In #1 Transfer Practice",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/J2-02-check-in-1-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/J2-02-check-in-1-supplemental-2/solution"
				},
				{
					title: "Check-In #1 Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "Java Level 2",
						moduleTitle: "Check-In #1",
						itemTitle: "Check-In #1 Extension Practice",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/J2-03-check-in-1-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/J2-03-check-in-1-supplemental-3/solution"
				}
			]
		},
		{
			title: "JM4 Subclasses & Inheritance",
			curriculum: [
				{
					title: "Subclasses",
					content:
						"Learn how subclasses extend superclasses, inherit public behavior, and add or override their own features while still respecting encapsulation."
				},
				{
					title: "JM4 Project 1: Rectangle and Square Class",
					content:
						"Create a `Rectangle` class, then create a `Square` subclass that uses `extends`, calls parent constructors with `super()`, and optionally overrides methods such as `getArea()`.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/JM4-Rectangle-and-Square-Class",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/JM4-Rectangle-and-Square-Class"
				},
				{
					title: "JM4 Project 2: Book and PictureBook Class",
					content:
						"Extend a previous `Book` class by creating a `PictureBook` subclass with an illustrator field, custom comparison methods, and an overridden `toString()` method.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/JM4-Book-and-Picture-Book-Class",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/JM4-Book-and-Picture-Book-Class"
				},
				{
					title: "JM4 Project 3: Vehicle Inheritance",
					content:
						"Use a starter project with `Vehicle`, `LandVehicle`, `Car`, and `Motorcycle` classes to practice multi-level inheritance, `super`, and subclass-specific implementations.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/JM4-Project-3-Vehicle-Inheritance-Starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/JM4-Project-3-Vehicle-Inheritance"
				}
			],
			supplementalProjects: [
				{
					title: "JM4 Supplemental Project 1: Pet, Dog, and Cat Class",
					content:
						"Create a `Pet` superclass with `Dog` and `Cat` subclasses, override `toString()`, add subclass-specific behaviors, and optionally extend the hierarchy with another pet type.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/JM4-Supplemental-Project-1-Pet-Dog-and-Cat-Class",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/JM4-Supplemental-Project-1-Pet-Dog-and-Cat-Class"
				},
				{
					title: "JM4 Supplemental Project 2: Lesson and DanceLesson Class",
					content:
						"Create a `Lesson` class, extend it with a `DanceLesson` subclass, sort lesson objects, and write comparison helpers based on difficulty.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/JM4-Lesson-and-DanceLesson-Class",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/JM4-Lesson-and-DanceLesson-Class"
				},
				{
					title: "Subclasses & Inheritance Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "Java Level 2",
						moduleTitle: "JM4 Subclasses & Inheritance",
						itemTitle:
							"Subclasses & Inheritance Extension Practice",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/J2-04-jm4-subclasses-and-inheritance-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/J2-04-jm4-subclasses-and-inheritance-supplemental-3/solution"
				}
			]
		},
		{
			title: "JM5 Maps",
			curriculum: [
				{
					title: "Maps",
					content:
						"Learn how Java maps store key-value pairs and why they are useful for contact lists, lookups, inventories, and other associative data problems."
				},
				{
					title: "Using a Java Map",
					content:
						"Practice `put()`, `get()`, `containsKey()`, `remove()`, `size()`, `keySet()`, `values()`, `getOrDefault()`, and `putIfAbsent()` while working with `HashMap` examples.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/JM5-Maps"
				},
				{
					title: "JM5 Project 1: Letter Frequencies",
					content:
						"Read a sentence from the user, build a frequency map of its letters, print the map contents, and determine which character appears most often.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/JM5-Letter-Frequencies",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/JM5-Letter-Frequencies"
				},
				{
					title: "JM5 Project 2: Dealership Database",
					content:
						"Extend the vehicle inheritance project by using a map to build a dealership inventory keyed by vehicle identification number, with methods to add, remove, search, and display cars.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/JM5-PROJECT-2-DealershipDatabase",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/JM5-PROJECT-2-DealershipDatabase"
				}
			],
			supplementalProjects: [
				{
					title: "JM5 Supplemental Project 1: Lending Library",
					content:
						"Build a library lookup program using a map from book titles to authors, with searching and full inventory display.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/JM5-Supplemental-Project-1-Lending-Library",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/JM5-Supplemental-Project-1-Lending-Library"
				},
				{
					title: "Maps Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "Java Level 2",
						moduleTitle: "JM5 Maps",
						itemTitle: "Maps Transfer Practice",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/J2-05-jm5-maps-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/J2-05-jm5-maps-supplemental-2/solution"
				},
				{
					title: "Maps Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "Java Level 2",
						moduleTitle: "JM5 Maps",
						itemTitle: "Maps Extension Practice",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/J2-06-jm5-maps-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/J2-06-jm5-maps-supplemental-3/solution"
				}
			]
		},
		{
			title: "JM6 Threading & Error Handling",
			curriculum: [
				{
					title: "Errors and Exception Handling",
					content:
						"Review exceptions as a way to detect and manage problems in a program, then use `try-catch` blocks to keep programs running even when some operations fail."
				},
				{
					title: "JM6 Project 1: Try-Catch This",
					content:
						"Practice writing `try-catch` blocks for arithmetic errors such as division by zero and array access errors such as out-of-bounds indices.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/JM6-Try-Catch-Practice",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/JM6-Try-Catch-Practice"
				},
				{
					title: "Threading in Java",
					content:
						"Learn how a thread creates an independent path of execution, how `run()` and `start()` work together, and how `sleep()` introduces delays that often need `try-catch` protection."
				},
				{
					title: "JM6 Project 2: Bouncing Zeros",
					content:
						"Create a simple console animation by printing a moving `0`, updating its position, and running the animation inside a thread with controlled timing.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/JM6-Bouncing-Zeros",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/JM6-Bouncing-Zeros"
				}
			],
			supplementalProjects: [
				{
					title: "JM6 Supplemental Project 1: Barnyard Orchestra",
					content:
						"Use multiple threads to create a simple orchestra of repeating animal sounds played at different intervals.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/JM6-Supplemental-Project-1-Barnyard-Orchestra",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/JM6-Supplemental-Project-1-Barnyard-Orchestra"
				},
				{
					title: "Threading & Error Handling Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "Java Level 2",
						moduleTitle: "JM6 Threading & Error Handling",
						itemTitle:
							"Threading & Error Handling Transfer Practice",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/J2-07-jm6-threading-and-error-handling-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/J2-07-jm6-threading-and-error-handling-supplemental-2/solution"
				},
				{
					title: "Threading & Error Handling Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "Java Level 2",
						moduleTitle: "JM6 Threading & Error Handling",
						itemTitle:
							"Threading & Error Handling Extension Practice",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/J2-08-jm6-threading-and-error-handling-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/J2-08-jm6-threading-and-error-handling-supplemental-3/solution"
				}
			]
		},
		{
			title: "Check-In #2",
			curriculum: [
				{
					title: "Check-In #2 Overview",
					content:
						"This review revisits inheritance, method overriding, threading, try-catch handling, and maps. This module combines reading existing class code with extending it in new directions.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/JM-Check-in-2-Starter-Updated",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/JM-Check-in-2-Updated"
				},
				{
					title: "Check-In #2: Inheritance",
					content:
						"Read and analyze an `HourClock` class, then create a `RomanClock` subclass that extends the original behavior and overrides `displayTime()`."
				},
				{
					title: "Check-In #2: Threading and Error Handling",
					content:
						"Add a thread to a clock so it updates itself over time, define `start()` and `run()`, use `sleep()` to delay updates, and explain how `try-catch` protects the program when thread-related exceptions occur."
				},
				{
					title: "Check-In #2: Maps",
					content:
						"Create a map inside the `RomanClock` class, populate it with Roman numeral keys and decimal values, iterate through the entries, and conditionally insert missing values."
				},
				{
					title: "Check-In #2: Additional Practice Project",
					content:
						"Create a `MinuteClock` subclass that tracks minutes as well as hours, overrides `displayTime()`, and updates both fields correctly in `tick()`.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/JM-Check-in-2-Additional-Project",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/JM-Check-in-2-Additional-Project"
				}
			],
			supplementalProjects: [
				{
					title: "Check-In #2: Extension Challenge",
					content: buildSupportSectionGuidance({
						courseFamily: "Java Level 2",
						moduleTitle: "Check-In #2",
						section: "extension"
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/JM-Check-in-2-Starter-Updated",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/JM-Check-in-2-Updated"
				},
				{
					title: "Check-In #2 Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "Java Level 2",
						moduleTitle: "Check-In #2",
						itemTitle: "Check-In #2 Transfer Practice",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/J2-09-check-in-2-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/J2-09-check-in-2-supplemental-2/solution"
				},
				{
					title: "Check-In #2 Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "Java Level 2",
						moduleTitle: "Check-In #2",
						itemTitle: "Check-In #2 Extension Practice",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/J2-10-check-in-2-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/J2-10-check-in-2-supplemental-3/solution"
				}
			]
		},
		{
			title: "JM7 Bank Account",
			curriculum: [
				{
					title: "JM7 Project 1: Bank Account",
					content:
						"Design and build a `BankAccount` class and a `BankSystem` class that manages accounts with a map. Implement methods for registration, login, deposits, withdrawals, password changes, and balance checks.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/JM7-Bank-Account",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/JM7-Bank-Account"
				},
				{
					title: "Bank Account: Debugging and Failure Modes",
					content: buildSupportSectionGuidance({
						courseFamily: "Java Level 2",
						moduleTitle: "Bank Account",
						section: "debugging"
					})
				},
				{
					title: "Bank Account: Planning and Architecture",
					content: buildSupportSectionGuidance({
						courseFamily: "Java Level 2",
						moduleTitle: "Bank Account",
						section: "planning"
					})
				},
				{
					title: "Bank Account: Verification and Reflection",
					content: buildSupportSectionGuidance({
						courseFamily: "Java Level 2",
						moduleTitle: "Bank Account",
						section: "verification"
					})
				}
			],
			supplementalProjects: [
				{
					title: "JM7 Supplemental Project 1: Calculator",
					content:
						"Create a `Calculator` class with methods for arithmetic operations, factorials, and exponents, then build a console interface for the user to choose operations and inputs.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/JM7-Calculator/src/main/java",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/JM7-Calculator/src/main/java"
				},
				{
					title: "Bank Account Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "Java Level 2",
						moduleTitle: "JM7 Bank Account",
						itemTitle: "Bank Account Transfer Practice",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/J2-11-jm7-bank-account-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/J2-11-jm7-bank-account-supplemental-2/solution"
				},
				{
					title: "Bank Account Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "Java Level 2",
						moduleTitle: "JM7 Bank Account",
						itemTitle: "Bank Account Extension Practice",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/J2-12-jm7-bank-account-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/J2-12-jm7-bank-account-supplemental-3/solution"
				}
			]
		},
		{
			title: "JM8 File I/O",
			curriculum: [
				{
					title: "Writing to a File",
					content:
						"Use `FileWriter` inside a try-with-resources block to create or open files and write lines of output directly to disk instead of only printing to the console.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/JM8-Writing-to-a-File"
				},
				{
					title: "JM8 Project 1: Crazy Name Tags Printer",
					content:
						"Ask the user for a name, then write different letter-by-letter transformations of that name into one or more files.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/JM8-Project-1-Crazy-Name-Tags-Printer",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/JM8-Project-1-Crazy-Name-Tags-Printer"
				},
				{
					title: "Reading from a File",
					content:
						"Use `File` and `Scanner` inside `try-catch` logic to read lines from a text file, collect them into a string, and close resources properly after reading.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/JM8-Reading-from-a-File/src/main/java"
				},
				{
					title: "JM8 Project 2: File IO and Maps",
					content:
						"Read alternating lines from a file and load them into a map so odd-numbered lines become keys and the following lines become their values.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/JM8-Project-2-File-IO-and-Maps/src/main/java",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/JM8-Project-2-File-IO-and-Maps/src/main/java"
				}
			],
			supplementalProjects: [
				{
					title: "JM8 Supplemental Project 1: Bank Account with File I/O",
					content:
						"Extend the bank account system so account information can be saved to a file and loaded again when the program starts.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/JM8-Supplemental-Project-Bank-Account/src/main/java",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/JM8-Supplemental-Project-Bank-Account/src/main/java"
				},
				{
					title: "File I/O Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "Java Level 2",
						moduleTitle: "JM8 File I/O",
						itemTitle: "File I/O Transfer Practice",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/J2-13-jm8-file-i-o-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/J2-13-jm8-file-i-o-supplemental-2/solution"
				},
				{
					title: "File I/O Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "Java Level 2",
						moduleTitle: "JM8 File I/O",
						itemTitle: "File I/O Extension Practice",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/J2-14-jm8-file-i-o-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/J2-14-jm8-file-i-o-supplemental-3/solution"
				}
			]
		},
		{
			title: "JM9 Maze Runner",
			curriculum: [
				{
					title: "JM9 Project 1: Maze Reader",
					content:
						"Create a `Maze` class that reads maze layouts from text files, stores the starting position, prints the maze, and determines whether moves and exits are valid.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/Maze-Reader-Starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/Maze-Reader"
				},
				{
					title: "JM9 Project 2: Maze Runner",
					content:
						"Build a playable maze game by adding a `Player` class and a `MazeGame` controller that processes user input, updates player movement, and ends the game when the exit is reached.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/Maze-Runner-Part-2",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/Maze-Runner-Part-2"
				},
				{
					title: "Maze Runner: Planning and Architecture",
					content: buildSupportSectionGuidance({
						courseFamily: "Java Level 2",
						moduleTitle: "Maze Runner",
						section: "planning"
					})
				},
				{
					title: "Maze Runner: Verification and Reflection",
					content: buildSupportSectionGuidance({
						courseFamily: "Java Level 2",
						moduleTitle: "Maze Runner",
						section: "verification"
					})
				}
			],
			supplementalProjects: [
				{
					title: "JM9 Supplemental Project 1: Maze Runner Part 3",
					content:
						"Add a countdown timer to the maze game with threading and end the game when time runs out.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/Maze-Runner-Part-3",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/Maze-Runner-Part-3"
				},
				{
					title: "Maze Runner Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "Java Level 2",
						moduleTitle: "JM9 Maze Runner",
						itemTitle: "Maze Runner Transfer Practice",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/J2-15-jm9-maze-runner-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/J2-15-jm9-maze-runner-supplemental-2/solution"
				},
				{
					title: "Maze Runner Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "Java Level 2",
						moduleTitle: "JM9 Maze Runner",
						itemTitle: "Maze Runner Extension Practice",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/J2-16-jm9-maze-runner-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/J2-16-jm9-maze-runner-supplemental-3/solution"
				}
			]
		},
		{
			title: "JM10 Master Project",
			curriculum: [
				{
					title: "JM10 Master Project",
					content:
						"Design and build an original console-based Java project that showcases the key ideas from the course, such as classes, inheritance, maps, file I/O, error handling, and larger multi-class program structure."
				},
				{
					title: "Master Project Planning",
					content:
						"Brainstorm games, simulations, or real-world tools, then write out the main steps and data structures before coding. Example directions include tic-tac-toe, quiz games, or other projects inspired by earlier modules."
				},
				{
					title: "Portfolio Project",
					content:
						"Move a finished Java project into a GitHub repository with a clear README, source folders, build/run instructions, and a short portfolio note explaining what the project demonstrates."
				},
				{
					title: "Course Recap",
					content:
						"Review the major ideas from the course, including classes and objects, constructors, static members, inheritance, maps, threading, error handling, file I/O, and multi-class Java applications."
				},
				{
					title: "JM10 Master Project: Core Project",
					content: buildProjectGuidance({
						courseFamily: "Java Level 2",
						moduleTitle: "JM10 Master Project",
						itemTitle: "JM10 Master Project: Core Project",
						projectKind: "core",
						hasReference: false
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/JM7-Calculator"
				}
			],
			supplementalProjects: [
				{
					title: "JM10 Master Project: Extension Challenge",
					content: buildSupportSectionGuidance({
						courseFamily: "Java Level 2",
						moduleTitle: "JM10 Master Project",
						section: "extension"
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/JM7-Calculator"
				},
				{
					title: "Master Project Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "Java Level 2",
						moduleTitle: "JM10 Master Project",
						itemTitle: "Master Project Transfer Practice",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/J2-17-jm10-master-project-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/J2-17-jm10-master-project-supplemental-2/solution"
				},
				{
					title: "Master Project Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "Java Level 2",
						moduleTitle: "JM10 Master Project",
						itemTitle: "Master Project Extension Practice",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/J2-18-jm10-master-project-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/J2-18-jm10-master-project-supplemental-3/solution"
				}
			]
		},
		{
			title: "JM11 Repo Extension and Reference Library",
			curriculum: [
				{
					title: "How to Use the Extra Java Level 2 Folders",
					content:
						"Treat the additional `Java-Level-2` folders as a deliberate extension bank for file I/O, exception handling, data-structure examples, and alternate console projects. They reinforce the main course rather than replacing it."
				},
				{
					title: "Reference and Solution Boundaries",
					content:
						"The extra folders are support material for comparison, recovery, and extension work. Starter-style folders are useful when a concept needs a smaller practice surface than the main module project; solution-style folders are for reference comparison, debugging comparison, or checking a completed approach after the core reasoning has already been attempted. The main Java 2 progression remains the source of course pacing. These references are best used by naming the concept being checked, the file or class being inspected, and the difference between the reference structure and the current project."
				},
				{
					title: "When to Reach for the Extension Bank",
					content:
						"Use these extensions for more structured practice with maps, file handling, console project design, or threading previews before moving on to higher-level Java work."
				},
				{
					title: "Repo Extension and Reference Library: Verification and Reflection",
					content: buildSupportSectionGuidance({
						courseFamily: "Java Level 2",
						moduleTitle: "Repo Extension and Reference Library",
						section: "verification"
					})
				},
				{
					title: "JM11 Repo Extension and Reference Library: Core Project",
					content: buildProjectGuidance({
						courseFamily: "Java Level 2",
						moduleTitle:
							"JM11 Repo Extension and Reference Library",
						itemTitle:
							"JM11 Repo Extension and Reference Library: Core Project",
						projectKind: "extension",
						hasReference: false
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/JM-stdinstdout"
				}
			],
			supplementalProjects: [
				{
					title: "Extension: stdin/stdout Practice",
					content:
						"Use a focused console-I/O exercise for more confidence with Java input/output mechanics in isolation.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/JM-stdinstdout"
				},
				{
					title: "Extension: Java File I/O",
					content:
						"Use the dedicated file-I/O folder for one more direct pass over reading, writing, and file handling before the larger JM8 work.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/JM-Java-File-IO"
				},
				{
					title: "Reference: HashMaps Examples",
					content:
						"This smaller maps example bank isolates `HashMap` mechanics from the larger dealership and file-I/O projects. It is useful for checking key-value vocabulary, insertion, lookup, replacement, removal, iteration over keys or entries, and the difference between a missing key and a key whose value is present but unexpected. A good reference pass compares one concrete map operation with the same operation inside the larger project, then names what data type is used for the key, what data type is used for the value, and what behavior is expected when the key is not found.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/JM-Java-Hash-Maps-Examples"
				},
				{
					title: "Extension: Dog Class Test",
					content:
						"Use the dog-class test harness as a lightweight object-model review before the later multi-class projects.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/JM1-Dog-Class-Test"
				},
				{
					title: "Extension: Tic Tac Toe Console",
					content:
						"Use a compact console game to reinforce control flow, object organization, and user interaction without the complexity of the maze branch.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/JM10-Tic-Tac-Toe-Console"
				},
				{
					title: "Preview: Threading Example",
					content:
						"Keep the threading example visible as a preview of how timed or concurrent behavior starts to appear in Java.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/JM6-Threading-Example"
				},
				{
					title: "Reference: Try-Catch Example",
					content:
						"This focused exception-handling example separates the `try`, `catch`, and recovery path from the larger projects. It is useful for comparing checked exceptions, unchecked exceptions, parse failures, file failures, and input validation without extra application logic in the way. The reference target is not just adding a `catch` block; it is identifying which operation can fail, what exception or invalid state represents that failure, what message or fallback is produced, and whether the program can safely continue afterward. A useful review also names which values remain trustworthy after the failure.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/JM6-Try-Catch-Example"
				},
				{
					title: "Extension: Password Management System",
					content:
						"Use a stronger practical console project to reinforce classes, file handling, and guarded user interaction in one place.",
					projectLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/JM-Password-Management-System"
				}
			]
		},
		{
			title: "JM Master Project Example Quiz Game: Practice Studio",
			curriculum: [
				{
					title: "JM Master Project Example Quiz Game: Core Concepts",
					content: buildImplementationLabGuidance({
						courseFamily: "Java Level 2",
						moduleTitle:
							"JM Master Project Example Quiz Game: Practice Studio",
						section: "concepts"
					})
				},
				{
					title: "JM Master Project Example Quiz Game: Guided Example",
					content: buildImplementationLabGuidance({
						courseFamily: "Java Level 2",
						moduleTitle:
							"JM Master Project Example Quiz Game: Practice Studio",
						section: "example"
					})
				},
				{
					title: "JM Master Project Example Quiz Game: Core Project",
					content: buildImplementationLabGuidance({
						courseFamily: "Java Level 2",
						moduleTitle:
							"JM Master Project Example Quiz Game: Practice Studio",
						section: "coreProject",
						hasReference: false
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/JM-Master-Project-Example-Quiz-Game"
				},
				{
					title: "JM Master Project Example Quiz Game: Review and Reflection",
					content: buildImplementationLabGuidance({
						courseFamily: "Java Level 2",
						moduleTitle:
							"JM Master Project Example Quiz Game: Practice Studio",
						section: "review"
					})
				}
			],
			supplementalProjects: [
				{
					title: "JM Master Project Example Quiz Game: Extension Challenge",
					content: buildImplementationLabGuidance({
						courseFamily: "Java Level 2",
						moduleTitle:
							"JM Master Project Example Quiz Game: Practice Studio",
						section: "extension",
						hasReference: false
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/JM-Master-Project-Example-Quiz-Game"
				},
				{
					title: "JM Master Project Example Quiz Game Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "Java Level 2",
						moduleTitle:
							"JM Master Project Example Quiz Game: Practice Studio",
						itemTitle:
							"JM Master Project Example Quiz Game Transfer Practice",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/J2-19-applied-studio-14-jm-master-project-example-quiz-game-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/J2-19-applied-studio-14-jm-master-project-example-quiz-game-supplemental-2/solution"
				},
				{
					title: "JM Master Project Example Quiz Game Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "Java Level 2",
						moduleTitle:
							"JM Master Project Example Quiz Game: Practice Studio",
						itemTitle:
							"JM Master Project Example Quiz Game Extension Practice",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/J2-20-applied-studio-14-jm-master-project-example-quiz-game-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/J2-20-applied-studio-14-jm-master-project-example-quiz-game-supplemental-3/solution"
				}
			]
		},
		{
			title: "JM Maze Runner Project: Practice Studio",
			curriculum: [
				{
					title: "JM Maze Runner Project: Core Concepts",
					content: buildImplementationLabGuidance({
						courseFamily: "Java Level 2",
						moduleTitle: "JM Maze Runner Project: Practice Studio",
						section: "concepts"
					})
				},
				{
					title: "JM Maze Runner Project: Guided Example",
					content: buildImplementationLabGuidance({
						courseFamily: "Java Level 2",
						moduleTitle: "JM Maze Runner Project: Practice Studio",
						section: "example"
					})
				},
				{
					title: "JM Maze Runner Project: Core Project",
					content: buildImplementationLabGuidance({
						courseFamily: "Java Level 2",
						moduleTitle: "JM Maze Runner Project: Practice Studio",
						section: "coreProject"
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/Maze-Runner-Part-3",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/JM-Maze-Runner-Project-Solution"
				},
				{
					title: "JM Maze Runner Project: Review and Reflection",
					content: buildImplementationLabGuidance({
						courseFamily: "Java Level 2",
						moduleTitle: "JM Maze Runner Project: Practice Studio",
						section: "review"
					})
				}
			],
			supplementalProjects: [
				{
					title: "JM Maze Runner Project: Extension Challenge",
					content: buildImplementationLabGuidance({
						courseFamily: "Java Level 2",
						moduleTitle: "JM Maze Runner Project: Practice Studio",
						section: "extension"
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/Maze-Runner-Part-3",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/JM-Maze-Runner-Project-Solution"
				},
				{
					title: "JM Maze Runner Project Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "Java Level 2",
						moduleTitle: "JM Maze Runner Project: Practice Studio",
						itemTitle: "JM Maze Runner Project Transfer Practice",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/J2-21-applied-studio-15-jm-maze-runner-project-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/J2-21-applied-studio-15-jm-maze-runner-project-supplemental-2/solution"
				},
				{
					title: "JM Maze Runner Project Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "Java Level 2",
						moduleTitle: "JM Maze Runner Project: Practice Studio",
						itemTitle: "JM Maze Runner Project Extension Practice",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/J2-22-applied-studio-15-jm-maze-runner-project-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Java-Level-2/tree/main/J2-22-applied-studio-15-jm-maze-runner-project-supplemental-3/solution"
				}
			]
		},
		{
			title: "Pending Demo Media",
			kind: "appendix",
			curriculum: [
				{
					title: "Pending Java Level 2 Demo Media",
					content: [
						"This course lists pending demonstration videos below. Each entry keeps a stable static media URL so the matching file can be added without changing course links.",
						"",
						...JAVA_LEVEL_2_ORIGINAL_MEDIA.map(
							filename =>
								`- ${staticMediaUrl(filename)} - ${pendingStaticMediaNotice(filename)}`
						)
					].join("\n")
				}
			],
			supplementalProjects: []
		}
	]
};

const JAVA_LEVEL_2_PRIMARY_MODULE_COUNT = 13;

const JAVA_LEVEL_2_SECONDARY_PROJECTS = new Set([
	"JM2 Project 1: Person Class",
	"Check-In #1: Additional Practice Project",
	"JM4 Project 2: Book and PictureBook Class",
	"JM4 Project 3: Vehicle Inheritance",
	"JM5 Project 2: Dealership Database",
	"Check-In #2: Additional Practice Project",
	"JM8 Project 1: Crazy Name Tags Printer"
]);

const JAVA_LEVEL_2_CONCURRENCY_ITEMS = new Set([
	"Threading in Java",
	"JM6 Project 2: Bouncing Zeros",
	"JM6 Supplemental Project 1: Barnyard Orchestra",
	"Threading & Error Handling Transfer Practice",
	"Threading & Error Handling Extension Practice",
	"Check-In #2: Threading and Error Handling",
	"JM9 Supplemental Project 1: Maze Runner Part 3",
	"Preview: Threading Example"
]);

const JAVA_LEVEL_2_MODULE_FLOW: Record<
	string,
	{
		estimatedTime: string;
		keyBlocks: string[];
		flowNote: string;
	}
> = {
	"JM0 Visual-to-OOP Bridge": {
		estimatedTime: "2 sessions · 45–60 minutes each",
		keyBlocks: [
			"Java 21",
			"object state",
			"constructor trace",
			"method contract",
			"repeatable test"
		],
		flowNote:
			"Translate the visible Karel object into custom classes while pinning the course to Java 21. Every class begins with a constructor-and-state prediction, one repeatable test harness, and compiler warnings reviewed before larger OOP projects begin."
	},
	"JM1 Instance Variables, Constructors, and Methods": {
		estimatedTime: "3 sessions · 45–60 minutes each",
		keyBlocks: [
			"private field",
			"valid constructor",
			"query method",
			"behavior method",
			"instance independence"
		],
		flowNote:
			"Build one encapsulated class whose constructor establishes valid state and whose methods preserve its rules. Test normal construction, a state change, a rejected value, `toString()`, and independence between two instances before generalizing the vocabulary."
	},
	"JM2 Overloaded Constructors & Comparison Methods": {
		estimatedTime: "3 sessions · 45–60 minutes each",
		keyBlocks: [
			"constructor delegation",
			"valid default",
			"equals",
			"hashCode",
			"ordering contract"
		],
		flowNote:
			"Use `this(...)` to funnel overloaded constructors through one validity rule, then separate identity, equality, and ordering. Verify that equal objects share a hash code and that `compareTo()` is antisymmetric, transitive, and consistent with the documented equality policy."
	},
	"JM3 Static Variables & Methods": {
		estimatedTime: "3 sessions · 45–60 minutes each",
		keyBlocks: [
			"instance state",
			"class-wide state",
			"static factory or helper",
			"Comparable",
			"tie breaker"
		],
		flowNote:
			"Use static state only when the value truly belongs to the class rather than an instance. Test object creation counts from a fresh process, define deterministic comparison tie breakers, and explain why a static helper does not depend on mutable instance state."
	},
	"Check-In #1": {
		estimatedTime: "2 sessions · 45–60 minutes each",
		keyBlocks: [
			"constructor trace",
			"encapsulation",
			"static boundary",
			"equality",
			"ordering evidence"
		],
		flowNote:
			"Treat this as an evidence checkpoint: construct and mutate one class, explain instance versus static state, and prove equality or ordering with boundary cases. Assign only the practice item tied to an observed gap before continuing."
	},
	"JM4 Subclasses & Inheritance": {
		estimatedTime: "3 sessions · 45–60 minutes each",
		keyBlocks: [
			"is-a test",
			"super constructor",
			"override",
			"substitutability",
			"composition alternative"
		],
		flowNote:
			"Use inheritance only after an explicit is-a test and compare it with composition. A subclass must preserve superclass expectations when used through the parent type; verify constructor chaining, overriding, dynamic dispatch, and one case where composition is the clearer design."
	},
	"JM5 Maps": {
		estimatedTime: "3 sessions · 45–60 minutes each",
		keyBlocks: [
			"key-value contract",
			"missing key",
			"duplicate key",
			"iteration order",
			"key equality"
		],
		flowNote:
			"Choose a key with a stable equality and hash-code contract, state the replacement policy for duplicate keys, and never rely on `HashMap` iteration order. Test empty, missing, present, duplicate, and removal cases before using a map in a larger application."
	},
	"JM6 Threading & Error Handling": {
		estimatedTime: "3 sessions · 45–60 minutes each",
		keyBlocks: [
			"failure boundary",
			"specific exception",
			"validated input",
			"recovery state",
			"resource cleanup"
		],
		flowNote:
			"Keep the required module focused on predictable failure handling. Identify the exact operation that can fail, catch only exceptions that can be handled locally, preserve a trustworthy state, and prove both success and recovery paths without empty or catch-all handlers."
	},
	"Check-In #2": {
		estimatedTime: "2 sessions · 45–60 minutes each",
		keyBlocks: [
			"inheritance trace",
			"override",
			"map contract",
			"exception recovery",
			"targeted reteach"
		],
		flowNote:
			"Check inheritance, dynamic dispatch, maps, and exception recovery through predictions and small edits. Threading is an optional extension and is not required for advancement; use the results to select a focused practice task."
	},
	"JM7 Bank Account": {
		estimatedTime: "4–5 sessions · 45–60 minutes each",
		keyBlocks: [
			"integer cents or BigDecimal",
			"account invariant",
			"fictional data",
			"transaction result",
			"failure test"
		],
		flowNote:
			"Treat the bank project as an object-model simulation, not a real financial or authentication system. Use fictional identifiers, exact decimal money, explicit deposit/withdrawal rules, and result objects or documented exceptions so rejected operations cannot partially change state."
	},
	"JM8 File I/O": {
		estimatedTime: "4 sessions · 45–60 minutes each",
		keyBlocks: [
			"Path and Files",
			"UTF-8",
			"try-with-resources",
			"temporary fixture",
			"malformed-record policy"
		],
		flowNote:
			"Use `Path` and `Files` with explicit UTF-8 and test only inside a temporary course-owned directory. Define the file format before parsing, close resources reliably, and verify missing, empty, malformed, partial, and ordinary inputs without storing real credentials or personal records."
	},
	"JM9 Maze Runner": {
		estimatedTime: "5 sessions · 45–60 minutes each",
		keyBlocks: [
			"maze parser",
			"immutable wall",
			"player state",
			"deterministic fixture",
			"exit condition"
		],
		flowNote:
			"Separate maze parsing, board state, movement rules, rendering, and input control. Use small deterministic text fixtures to test missing start or exit, malformed rows, blocked moves, boundaries, valid movement, and completion before adding an optional timer."
	},
	"JM10 Master Project": {
		estimatedTime: "7–9 sessions · 45–60 minutes each",
		keyBlocks: [
			"multi-class architecture",
			"interface boundary",
			"collection contract",
			"repeatable tests",
			"portfolio README"
		],
		flowNote:
			"Build one bounded local console application with a clear user problem, multi-class design, one interface or substitutable abstraction, one collection with documented rules, robust input handling, and repeatable tests. Persistence and concurrency remain optional unless they serve the design."
	}
};

function javaLevel2SupplementalPath(title: string) {
	return /extension|challenge|vehicle|dealership|password|thread|advanced|timer/i.test(
		title
	)
		? ("challenge" as const)
		: ("choice" as const);
}

function strengthenJavaLevel2Item(
	item: RawCourseModuleItem
): RawCourseModuleItem {
	if (item.title === "Subclasses") {
		return {
			...item,
			content:
				"Learn how subclasses extend superclasses, call parent constructors, and override behavior while preserving the superclass contract. Apply an explicit is-a test, verify substitutability through a parent-typed reference, and compare the design with composition before adding a hierarchy."
		};
	}

	if (item.title === "Maps") {
		return {
			...item,
			content:
				"Learn how maps store key-value pairs and define behavior for missing, present, duplicate, and removed keys. Choose immutable or stable keys with correct `equals()` and `hashCode()`, and do not assume a `HashMap` iteration order."
		};
	}

	if (item.title === "Errors and Exception Handling") {
		return {
			...item,
			content:
				"Use exceptions to represent failures that cannot be handled as ordinary return values. Catch the most specific exception at a boundary that can recover, validate expected user mistakes before throwing, preserve a trustworthy state, and never use an empty catch block or a broad `catch (Exception)` without rethrowing or a documented boundary reason."
		};
	}

	if (item.title === "Check-In #2 Overview") {
		return {
			...item,
			content:
				"This check-in revisits inheritance, overriding, exception recovery, and maps through short code-reading and transfer tasks. Threading is available in the optional concurrency extension and is not required for advancement."
		};
	}

	if (item.title === "JM7 Project 1: Bank Account") {
		return {
			...item,
			content:
				"Design a classroom `BankAccount` simulation and a `BankSystem` that manages fictional accounts in a map. Represent money with integer cents or `BigDecimal`, reject non-positive deposits and disallowed overdrafts without partial state changes, and test exact balances. If a login-like prompt is retained, use a clearly fake classroom PIN in memory only; never collect, persist, or log real passwords or personal financial data."
		};
	}

	if (item.title === "Writing to a File") {
		return {
			...item,
			content:
				"Use `Path` and `Files` with explicit UTF-8 to write course-owned text fixtures inside a temporary directory. Use try-with-resources when a stream or writer is needed, define overwrite versus append behavior, and verify the resulting lines rather than relying only on a successful call."
		};
	}

	if (item.title === "Reading from a File") {
		return {
			...item,
			content:
				"Use `Path` and `Files` with explicit UTF-8 to read a documented text format. Handle missing, empty, malformed, and ordinary files separately, close any opened resource with try-with-resources, and report line or record context without exposing private file contents."
		};
	}

	if (item.title === "JM10 Master Project") {
		return {
			...item,
			content:
				"Design and build one bounded, local console application that demonstrates multi-class Java design, an interface or substitutable abstraction, a collection with documented invariants, robust input and failure handling, and repeatable tests. File persistence is optional; concurrency belongs in the optional extension rather than the minimum capstone."
		};
	}

	return item;
}

function insertJavaLevel2Item(
	items: RawCourseModuleItem[],
	beforeTitle: string,
	item: RawCourseModuleItem
) {
	const index = items.findIndex(candidate => candidate.title === beforeTitle);
	if (index === -1) return [...items, item];
	return [...items.slice(0, index), item, ...items.slice(index)];
}

function decorateJavaLevel2Module(
	module: RawCourse["modules"][number]
): RawCourse["modules"][number] {
	const flow = JAVA_LEVEL_2_MODULE_FLOW[module.title];
	const movedProjects = module.curriculum.filter(
		item =>
			JAVA_LEVEL_2_SECONDARY_PROJECTS.has(item.title) &&
			!isCoreProjectTitle(item.title)
	);
	let curriculum: RawCourseModuleItem[] = module.curriculum
		.filter(
			item =>
				!movedProjects.includes(item) &&
				!JAVA_LEVEL_2_CONCURRENCY_ITEMS.has(item.title)
		)
		.map(strengthenJavaLevel2Item)
		.map(item => ({
			...item,
			learningPath: "core" as const
		}));

	if (module.title === "JM0 Visual-to-OOP Bridge") {
		curriculum.push({
			title: "Java 21 OOP Test Readiness",
			content: [
				"**Completion evidence:**",
				"- Record `java --version` and `javac --version` for the pinned Java 21 environment and compile with `javac -Xlint:all` or the repository's equivalent warning gate.",
				"- Run one repeatable class test through the repository's existing test runner; use JUnit 5 when configured, otherwise use a deterministic assertion-based driver until it is.",
				"- Prove constructor state, one method result, one rejected input, and independence between two objects.",
				"- Start from a clean output directory so a stale `.class` file cannot masquerade as a passing source change."
			].join("\n"),
			learningPath: "core"
		});
	}

	if (module.title === "JM2 Overloaded Constructors & Comparison Methods") {
		curriculum = insertJavaLevel2Item(
			curriculum,
			"Overloaded Constructors & Comparison Methods: Verification and Reflection",
			{
				title: "Equality, Hashing, and Ordering Contract",
				content: [
					"**Completion evidence:**",
					"- Overloaded constructors delegate to one validity rule and produce equivalent state for equivalent inputs.",
					"- `equals()` handles self, `null`, wrong type, equal objects, and unequal objects; equal objects return the same `hashCode()`.",
					"- `compareTo()` documents its sort keys and tie breakers and is tested for negative, zero, and positive results.",
					"- Ordering is antisymmetric and transitive on the fixture set, and its consistency or intentional difference from equality is stated."
				].join("\n"),
				learningPath: "core"
			}
		);
	}

	if (module.title === "JM6 Threading & Error Handling") {
		curriculum = insertJavaLevel2Item(
			curriculum,
			"JM6 Project 1: Try-Catch This",
			{
				title: "Exception Recovery Completion Contract",
				content: [
					"**Completion evidence:**",
					"- Name the operation that can fail and the most specific exception or validation result expected.",
					"- Test ordinary success, invalid user input, arithmetic or index boundary failure, and a corrected retry.",
					"- After recovery, identify which values remain trustworthy and prove the object or collection was not partially mutated.",
					"- No empty catch blocks, exception-driven handling for ordinary predictable input, or catch-all handlers that hide programming errors."
				].join("\n"),
				learningPath: "core"
			}
		);
	}

	if (module.title === "JM7 Bank Account") {
		curriculum = insertJavaLevel2Item(
			curriculum,
			"JM7 Project 1: Bank Account",
			{
				title: "Safe Classroom Money Model",
				content: [
					"**Completion evidence:**",
					"- Every amount uses integer cents or `BigDecimal`, with a documented rounding policy if decimal input is accepted.",
					"- Constructor and transaction invariants reject invalid amounts, unknown accounts, and disallowed overdrafts without changing balances.",
					"- Tests cover exact deposit, exact withdrawal, insufficient funds, zero or negative amount, and two independent fictional accounts.",
					"- Fixtures contain no real names, credentials, account numbers, or financial records, and no password-like value is written to a file or log."
				].join("\n"),
				learningPath: "core"
			}
		);
	}

	if (module.title === "JM8 File I/O") {
		curriculum = insertJavaLevel2Item(
			curriculum,
			"JM8 Project 2: File IO and Maps",
			{
				title: "File Format and Fixture Completion Contract",
				content: [
					"**Completion evidence:**",
					"- Document the path root, UTF-8 encoding, record shape, duplicate-key policy, and malformed-record policy.",
					"- Use a temporary course-owned directory and fixtures for missing, empty, one-record, malformed, duplicate, and ordinary files.",
					"- Read and write through `Path` and `Files` or a justified try-with-resources stream, then compare exact persisted content.",
					"- An interrupted or rejected read does not publish partial application state, and diagnostic text identifies the record without printing private content."
				].join("\n"),
				learningPath: "core"
			}
		);
	}

	if (module.title === "JM9 Maze Runner") {
		curriculum = insertJavaLevel2Item(
			curriculum,
			"Maze Runner: Planning and Architecture",
			{
				title: "Maze Runner Deterministic Completion Contract",
				content: [
					"**Completion evidence:**",
					"- Separate parser, immutable wall/layout data, player state, movement rules, rendering, and console control.",
					"- Tiny text fixtures cover missing start, missing exit, malformed or uneven rows, blocked boundary movement, valid movement, and reaching the exit.",
					"- A rejected move leaves player and maze state unchanged, and the main loop has an explicit completion or quit condition.",
					"- The same fixture and command sequence produces the same result; timed behavior is optional and tested separately."
				].join("\n"),
				learningPath: "core"
			}
		);
	}

	if (module.title === "JM10 Master Project") {
		curriculum = insertJavaLevel2Item(curriculum, "Portfolio Project", {
			title: "Master Project Definition of Done",
			content: [
				"**Required evidence:**",
				"- One-sentence user problem, bounded feature list, class diagram or responsibility table, and a documented interface or substitution boundary.",
				"- A collection contract covering empty, missing, duplicate, and removal behavior plus robust full-line input recovery.",
				"- Repeatable tests for each domain class and one end-to-end happy path, rejected input, failure recovery, and fresh restart.",
				"- A README with Java 21 prerequisites, clean build/run/test steps, example interaction, design explanation, known limitation, and no real personal or credential data."
			].join("\n"),
			learningPath: "core"
		});
	}

	curriculum = curriculum.map((item, index) => ({
		...item,
		content:
			index === 0
				? `**Course flow:** ${flow.flowNote}\n\n${item.content}`
				: item.content
	}));

	const supplementalProjects: RawCourseModuleItem[] = [
		...module.supplementalProjects.filter(
			item => !JAVA_LEVEL_2_CONCURRENCY_ITEMS.has(item.title)
		),
		...movedProjects
	];

	if (module.title === "JM6 Threading & Error Handling") {
		supplementalProjects.push(
			{
				title: "Exception Recovery Table",
				content:
					"Create a table for four failure cases with operation, invalid input or exception, state that remains trustworthy, user-facing response, and whether retry is safe. Implement and verify one row without an empty or catch-all handler.",
				learningPath: "choice"
			},
			{
				title: "Malformed Input Boundary Challenge",
				content:
					"Build a bounded full-line input loop that accepts one documented value, rejects blank and malformed input, limits retries, and exits cleanly at end-of-input. Tests prove recovery does not reuse stale data or partially update an object.",
				learningPath: "challenge"
			}
		);
	}

	return {
		...module,
		title:
			module.title === "JM6 Threading & Error Handling"
				? "JM6 Exceptions and Failure Handling"
				: module.title,
		estimatedTime: flow.estimatedTime,
		keyBlocks: flow.keyBlocks,
		curriculum,
		supplementalProjects: supplementalProjects.map(item => ({
			...item,
			learningPath:
				item.learningPath ?? javaLevel2SupplementalPath(item.title)
		}))
	};
}

function buildOptionalJavaConcurrencyExtension(): RawCourse["modules"][number] {
	const concurrencyCurriculum = javaLevel2SourceCourse.modules.flatMap(
		module =>
			module.curriculum.filter(item =>
				JAVA_LEVEL_2_CONCURRENCY_ITEMS.has(item.title)
			)
	);
	const concurrencySupplemental = javaLevel2SourceCourse.modules.flatMap(
		module =>
			module.supplementalProjects.filter(item =>
				JAVA_LEVEL_2_CONCURRENCY_ITEMS.has(item.title)
			)
	);

	return {
		kind: "appendix",
		title: "Optional Java Concurrency Extension",
		estimatedTime: "3–5 sessions · 45–60 minutes each",
		keyBlocks: [
			"bounded worker count",
			"start and join",
			"interrupt policy",
			"shared-state boundary",
			"deterministic completion"
		],
		curriculum: [
			{
				title: "Concurrency Extension Safety and Completion Contract",
				content: [
					"**Course flow:** Complete the required exception and state-management modules first. This extension preserves the original threading examples without making concurrency a prerequisite for Java Level 2.",
					"",
					"**Completion evidence:**",
					"- Use a fixed, small number of threads or a bounded `ExecutorService`; no unbounded thread creation or infinite worker loop.",
					"- Define ownership for mutable state, wait for completion with `join()` or executor shutdown, and restore interrupt status when interruption cannot be completed locally.",
					"- Do not use `sleep()` to prove correctness. Tests use a fixed event count, explicit completion signal, timeout, and deterministic final-state assertion.",
					"- The console animation and optional maze timer stop cleanly and leave no background worker running."
				].join("\n"),
				learningPath: "core"
			},
			...concurrencyCurriculum.map(item => ({
				...item,
				learningPath: "core" as const
			}))
		],
		supplementalProjects: concurrencySupplemental.map(item => ({
			...item,
			learningPath: javaLevel2SupplementalPath(item.title)
		}))
	};
}

function buildJavaLevel2PracticeArchive(
	modules: RawCourse["modules"]
): RawCourse["modules"][number] {
	return {
		kind: "appendix",
		title: "Optional Java Level 2 Practice and Reference Archive",
		estimatedTime: "Choose individual references or studios as needed",
		keyBlocks: [
			"targeted reference",
			"quiz-game example",
			"maze transfer",
			"file-I/O practice",
			"comparison evidence"
		],
		curriculum: [
			{
				title: "Java Level 2 Practice and Reference Archive Guide",
				content:
					"**Course flow:** JM11 Repo Extension and Reference Library, JM Master Project Example Quiz Game: Practice Studio, and JM Maze Runner Project: Practice Studio are optional reference, recovery, and transfer material after the matching core module. Select one item for a named gap or extension goal; completing the entire archive is not required.",
				learningPath: "core"
			}
		],
		supplementalProjects: modules.flatMap(module =>
			[...module.curriculum, ...module.supplementalProjects]
				.filter(item => !JAVA_LEVEL_2_CONCURRENCY_ITEMS.has(item.title))
				.map(item => ({
					...item,
					learningPath: javaLevel2SupplementalPath(item.title)
				}))
		)
	};
}

const javaLevel2PrimaryModules = javaLevel2SourceCourse.modules
	.slice(0, JAVA_LEVEL_2_PRIMARY_MODULE_COUNT)
	.map(decorateJavaLevel2Module);
const javaLevel2ArchiveModules = javaLevel2SourceCourse.modules.slice(
	JAVA_LEVEL_2_PRIMARY_MODULE_COUNT,
	-1
);
const javaLevel2PendingMediaModule = javaLevel2SourceCourse.modules.at(-1)!;

export const javaLevel2Course: RawCourse = {
	...javaLevel2SourceCourse,
	modules: [
		...javaLevel2PrimaryModules,
		buildOptionalJavaConcurrencyExtension(),
		buildJavaLevel2PracticeArchive(javaLevel2ArchiveModules),
		{
			...javaLevel2PendingMediaModule,
			kind: "appendix",
			estimatedTime: "Reference only",
			keyBlocks: ["stable media URL", "pending asset"],
			curriculum: javaLevel2PendingMediaModule.curriculum.map(item => ({
				...item,
				learningPath: "core"
			}))
		}
	]
};
