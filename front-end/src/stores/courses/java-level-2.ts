import type { RawCourse, RawCourseModuleItem } from "./types";
import { javaObjectWorkbookURL } from "@/modules/javaSearchResources";
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
						"A robot’s row and column can change while the robot’s class stays the same. A `Dog` follows the same pattern: its fields store the state, the constructor fills those fields, and instance methods act on the object that receives the call. Creating a second dog makes a separate set of fields."
				},
				{
					title: "BlueJ Object Bench and Console Fallback",
					content:
						"In BlueJ, compile the class, create two `Dog` objects from its constructor, then call `setAge(5)` on the first object and `getAge()` on both. For the same experiment with the site IDE, open the Dog workbook, save it, and export the ZIP. Open the extracted folder in a terminal with Java 21, compile with `javac --release 21 -Xlint:all -Werror *.java`, then run `java Main`. The starter includes incomplete methods, so compare the finished program with the trace."
				},
				{
					title: "Object State Trace",
					content:
						'Trace `new Dog("Fido", 4, 15.5, true)` and `new Dog("Scout", 2, 11, true)`. Before calling a setter, the ages are 4 and 2. After `fido.setAge(5)`, the ages are 5 and 2 because the receiver of the call is `fido`. Calling `fido.getAge()` reads 5 and leaves both ages unchanged.'
				}
			],
			supplementalProjects: [
				{
					title: "JM0 Supplemental Project 1: Robot-to-Dog Mapping",
					content:
						"Make a two-column map that pairs each Java Level 1 robot operation with an operation on a dog. For each pair, record the initial fields, the call, and the fields it changes. Include one getter or printed observation that leaves state untouched."
				},
				{
					title: "JM0 Supplemental Project 2: Constructor Trace Card",
					content:
						"Trace three constructor calls: a 4-year-old dog, a 0-year-old dog, and a dog with age −1. Record all four initial fields for valid objects. The age −1 call should throw an exception before the program can use the object. Compare the trace with the Dog workbook after completing its age rule."
				}
			]
		},
		{
			title: "JM1 Instance Variables, Constructors, and Methods",
			curriculum: [
				{
					title: "Introductions and Java Setup",
					content:
						"Place each public class in its matching file, such as `Dog.java`. Keep `public static void main(String[] args)` in `Main.java` to create objects and print predictions. The Dog workbook uses `ContractTests.java` to compare those predictions with the actual behavior."
				},
				{
					title: "Objects vs. Classes",
					content:
						"A class defines fields and available methods. Each instance has its own values for instance fields. Inside a constructor with an argument named `age`, `this.age` is the current object’s field and `age` is the parameter. A getter reads a value, a setter controls how it changes, and `toString()` returns a representation that the driver can print."
				},
				{
					title: "JM1 Project 1: Dog Class",
					contentKind: "assignment",
					preserveInstructions: true,
					ideImport: true,
					content: [
						"Create a class whose private instance fields hold each dog’s name, age, weight, and alive status. The starter defines the class and its method signatures in `Dog.java`.",
						"",
						"1. Finish `getAge()` so it returns the current dog’s age. Predict the ages of Fido and Scout before making any changes.",
						"2. Implement `setAge(int)`. Accept zero and positive ages. Throw `IllegalArgumentException` for a negative age before assigning the field. Call the setter from the constructor to apply the same rule at creation.",
						"3. Finish `toString()` with all four fields in the order shown below. The method returns a string. The caller prints it.",
						"4. Save the project, export the ZIP, and run these commands with Java 21 from the extracted folder.",
						"",
						"```sh",
						"javac --release 21 -Xlint:all -Werror *.java",
						"java Main",
						"java ContractTests",
						"```",
						"",
						"Expected driver output",
						"",
						"```text",
						"4",
						"Name: Fido, Age: 5, Weight: 15.5, Alive: true",
						"2",
						"```",
						"",
						"Predict which values should change before running the driver. Use the first failing check to pick the next method to inspect. The completed checks cover two independent dogs, a rejected age, and an age of zero."
					].join("\n"),
					projectLink: javaObjectWorkbookURL(
						"JM1-Dog-Class",
						"starter"
					),
					solutionLink: javaObjectWorkbookURL(
						"JM1-Dog-Class",
						"solution"
					)
				},
				{
					title: "More on Object-Oriented Programming",
					content:
						"Private fields keep age updates behind the setter. If the setter checks the new age before assigning it, a rejected call leaves the old age in place. The constructor uses the same rule when an object first receives its age. Trace a valid and a rejected call and explain which line can change the field."
				}
			],
			supplementalProjects: [
				{
					title: "JM1 Supplemental Project 1: Employee Class",
					contentKind: "assignment",
					preserveInstructions: true,
					ideImport: true,
					content: [
						"Use the Dog Class field and method pattern to model an employee. The name and numeric ID stay fixed after construction. The position and years worked can change.",
						"",
						"1. Inspect the fields, constructor, and getters in `Employee.java`. Record both employees’ initial positions and years.",
						"2. Complete `setPosition(String)` and `setYearsWorked(int)`. Reject a negative number of years with `IllegalArgumentException` before assigning it. Apply the same rule in the constructor.",
						"3. Complete `toString()` with the name, position, years worked, and ID. Write Tina’s example ID as `76544`. In Java, the leading zero in `076544` makes the number octal.",
						"4. Run the same Java 21 build and check commands as the Dog Class project. In the driver, a promotion changes only Jacky’s position and the second setter changes only Tina’s years.",
						"",
						"```text",
						"Name: Jacky, Position: Engineer, Years worked: 1, ID Number: 556614",
						"Name: Tina, Position: Manager, Years worked: 4, ID Number: 76544",
						"```",
						"",
						"Compare the resulting state for both objects with the original predictions. For an extra check, predict what each getter returns after a rejected years-worked update."
					].join("\n"),
					projectLink: javaObjectWorkbookURL(
						"JM1-Supplemental-Project-1-Employee",
						"starter"
					),
					solutionLink: javaObjectWorkbookURL(
						"JM1-Supplemental-Project-1-Employee",
						"solution"
					)
				}
			]
		},
		{
			title: "JM2 Overloaded Constructors & Comparison Methods",
			curriculum: [
				{
					title: "JM2 Project 1: Person Class",
					contentKind: "assignment",
					preserveInstructions: true,
					ideImport: true,
					content: [
						"Build a `Person` with a name, age, and grade. The four constructor signatures let callers supply different inputs while storing the same kinds of fields.",
						"",
						"1. Use `Person(String name, int age, int grade)` to assign the fields and reject a negative age or grade.",
						'2. Delegate with `this(...)` as the first statement. The text overload converts decimal grade text with `Integer.parseInt`. The two-argument overload supplies grade 0. The no-argument overload supplies name `"Unknown"`, age 0, and grade 0.',
						'3. Predict the state of `new Person("Jack", 12, "6")`. Its age is 12 and its grade is the integer 6. A birthday on a second person leaves Jack’s age unchanged.',
						"4. Save and extract the ZIP. With Java 21, run `javac --release 21 -Xlint:all -Werror *.java`, then `java Main` and `java ContractTests`.",
						"",
						"```text",
						"Name: Abby, Grade: 2, Age: 9",
						"Name: Jack, Grade: 6, Age: 12",
						"Name: Tiffany, Grade: 0, Age: 10",
						"Name: Unknown, Grade: 0, Age: 0",
						"```",
						"",
						"Compare the trace with the output. Run the text overload with an invalid grade such as `six` and explain which step rejects it."
					].join("\n"),
					projectLink: javaObjectWorkbookURL(
						"JM2-Person-Class",
						"starter"
					),
					solutionLink: javaObjectWorkbookURL(
						"JM2-Person-Class",
						"solution"
					)
				},
				{
					title: "Overloaded and Default Constructors",
					preserveInstructions: true,
					content: [
						"**Constructor rules:** For an ordinary class with no constructor declarations, Java supplies a default no-argument constructor. Declaring any constructor removes that automatic constructor. A no-argument constructor written explicitly is a separate overload; constructor overloads differ in their parameter lists.",
						"",
						"```java",
						"class Badge {",
						"    String name;",
						'    Badge() { this("Guest"); }',
						"    Badge(String name) { this.name = name; }",
						"}",
						"```",
						"",
						'**Trace:** `new Badge().name` is `"Guest"`; `new Badge("Maya").name` is `"Maya"`. In this example, `this("Guest")` delegates to the one-argument constructor. It is the first statement of the delegating constructor.',
						"",
						'**Check:** If `Badge()` is removed, `new Badge("Maya")` still compiles, but `new Badge()` does not. The compiler does not add another no-argument constructor while `Badge(String name)` exists.',
						"",
						"[Java constructor rules](https://docs.oracle.com/javase/specs/jls/se21/html/jls-8.html#jls-8.8.9)"
					].join("\n")
				},
				{
					title: "JM2 Project 2: Book Class",
					contentKind: "assignment",
					preserveInstructions: true,
					ideImport: true,
					content: [
						"The title and author identify a book in this exercise. The bookmark belongs to an individual copy. Two copies of the same book can be equal while their bookmarks differ.",
						"",
						"1. Give the two-argument constructor a default bookmark of 0. Compute a new bookmark before saving it. Use `Math.addExact` to reject integer overflow and throw `IllegalArgumentException` for a negative result.",
						"2. In `hasSameAuthor(Book)`, compare author text with `String.equals`. If the other object is missing, return false.",
						"3. Implement `equals(Object)` so it checks for a Book with the same title and author. Use the same fields in `hashCode()` and call `equals` from `isSameBook(Book)`.",
						"4. Run the Java 21 build and check commands from Person Class. Compare two different titles by the same author, then compare two copies of one title.",
						"",
						"```text",
						"Title: Redwall, Author: Brian Jacques, Page Number: 20",
						"Same author: true",
						"Same title and author: true",
						"```",
						"",
						"Predict whether a `HashSet` still finds the book after its bookmark moves. Run `java ContractTests` to check the prediction."
					].join("\n"),
					projectLink: javaObjectWorkbookURL(
						"JM2-Book-Class",
						"starter"
					),
					solutionLink: javaObjectWorkbookURL(
						"JM2-Book-Class",
						"solution"
					)
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
					contentKind: "assignment",
					preserveInstructions: true,
					ideImport: true,
					content: [
						"Use constructor overloads and a comparison method to model a drink order. An order includes flavor, iced status, and a topping.",
						"",
						"1. Delegate the shorter constructor with an empty string for an absent topping. The display shows that empty string as `none`.",
						"2. In `isSameOrder(Boba)`, compare flavor and topping by case-sensitive text value and compare the iced flags. A missing comparison object returns false.",
						"3. Predict how adding pearls to one of two matching drinks changes their comparison. Verify that the second drink still has an empty topping.",
						"4. Save and extract the ZIP. Compile with `javac --release 21 -Xlint:all -Werror *.java` and run `java ContractTests`.",
						"5. Run `java Main`. Enter a flavor, `Y` or `N`, and a topping in the terminal on separate lines. A blank topping line means none.",
						"",
						"Enter `brown sugar milk tea`, `Y`, and `pearls` to get this output after the prompt.",
						"",
						"```text",
						"Flavor: brown sugar milk tea, Iced: true, Topping: pearls",
						"Matches the most popular order.",
						"```",
						"",
						"Repeat with a blank topping. Explain how the same constructor and driver support both paths."
					].join("\n"),
					projectLink: javaObjectWorkbookURL(
						"JM2-Supplemental-Project-2-Boba",
						"starter"
					),
					solutionLink: javaObjectWorkbookURL(
						"JM2-Supplemental-Project-2-Boba",
						"solution"
					)
				}
			]
		},
		{
			title: "JM3 Static Variables & Methods",
			curriculum: [
				{
					title: "JM3 Project 1: Quiz Class",
					contentKind: "assignment",
					preserveInstructions: true,
					ideImport: true,
					content: [
						"Build a class that tracks the total number of quizzes created. A quiz’s name, score, and question list belong to that instance. The counter belongs to the class.",
						"",
						"1. Trace all three constructor signatures. Have the shorter constructors delegate to the full constructor and supply an empty question list when none is provided.",
						"2. Update the shared `numQuizzes` once after validation. Read it with `Quiz.getNumQuizzes()`. A score outside 0 through 100 throws `IllegalArgumentException` and leaves the count alone.",
						"3. Display the first question if present. Otherwise display `(none)`. Change the original question array after construction and observe that the quiz kept its copy.",
						"4. Save and extract the ZIP. With Java 21, run `javac --release 21 -Xlint:all -Werror *.java`, then `java Main` and `java ContractTests`.",
						"",
						"```text",
						"Review: 92 (A), first question: Which values belong to an instance?",
						"Practice: 80 (B), first question: (none)",
						"Quizzes created: 2",
						"```",
						"",
						"Predict the count and grade after each constructor call. Then test a score at a letter-grade boundary and a score outside the valid range."
					].join("\n"),
					projectLink: javaObjectWorkbookURL(
						"JM3-Quiz-Class",
						"starter"
					),
					solutionLink: javaObjectWorkbookURL(
						"JM3-Quiz-Class",
						"solution"
					)
				},
				{
					title: "Static Variables and Methods",
					contentKind: "reading",
					preserveInstructions: true,
					content: [
						"A static field has one value for the class. An instance field has one value for each object. A static method can use class fields and its parameters. To read a particular quiz’s score, it needs a quiz object.",
						"",
						"**Trace:** Start with `Quiz.getNumQuizzes()` returning 0 in a fresh program. Construct one quiz with score 80 and another with score 92. Calling the class method now returns 2. Calling each quiz’s `getScore()` returns its own score.",
						"",
						"A delegating constructor calls another constructor on the same object. Put the increment in the constructor where all paths meet. Reject invalid data before updating the count.",
						"",
						"`static final` identifies a class constant such as the foul limit. A local variable such as the scoring total starts over on every call, so one run does not affect the next."
					].join("\n")
				},
				{
					title: "JM3 Project 2: House Class",
					contentKind: "assignment",
					preserveInstructions: true,
					ideImport: true,
					content: [
						"Model an address, price in whole dollars, and area in square feet. Count successful constructions in one class field and use two instance fields for sorting.",
						"",
						"1. Increment the shared count once the constructor accepts the price and area. Reject a negative price or a nonpositive area.",
						"2. Implement `Comparable<House>`. Compare price using `Integer.compare`. If the prices tie, compare area. A tie on both keys returns zero and can still describe two different addresses.",
						"3. Write down the expected order for the three listings. Run the Java 21 build and check commands from Quiz Class, then compare the prediction with `Arrays.sort`.",
						"",
						"```text",
						"Elm Lane | $250000 | 2000 sq ft",
						"Cedar Lane | $500000 | 1200 sq ft",
						"Oak Lane | $500000 | 1800 sq ft",
						"Houses created: 3",
						"```",
						"",
						"Explain why sorting existing objects leaves `House.getNumHouses()` unchanged."
					].join("\n"),
					projectLink: javaObjectWorkbookURL(
						"JM3-House-Class",
						"starter"
					),
					solutionLink: javaObjectWorkbookURL(
						"JM3-House-Class",
						"solution"
					)
				},
				{
					title: "compareTo Method",
					preserveInstructions: true,
					content: [
						"**Ordering rule:** `Comparable<T>` gives objects a natural ordering through `compareTo(T other)`. Return a negative number when this object belongs before `other`, zero when their ordering keys tie, and a positive number when it belongs after. The contract concerns the sign, not an exact return value of -1 or 1.",
						"",
						"```java",
						"class Score implements Comparable<Score> {",
						"    final int points;",
						"    Score(int points) { this.points = points; }",
						"    @Override",
						"    public int compareTo(Score other) {",
						"        return Integer.compare(points, other.points);",
						"    }",
						"}",
						"```",
						"",
						"**Trace:** Comparing scores 5 and 9 returns a negative number; reversing them returns a positive number; comparing two scores of 5 returns zero. `Arrays.sort()` uses that ordering to place scores in ascending order. `Integer.compare` also handles `Integer.MIN_VALUE` and `Integer.MAX_VALUE` without the overflow that subtraction can cause.",
						"",
						"**House project:** Compare price first. Only when that comparison returns zero, compare square footage as the tiebreaker. This workbook stores both fields as integers, so use `Integer.compare` for each. A zero ordering result does not automatically change the class's `equals()` method.",
						"",
						"[Comparable contract](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/lang/Comparable.html)"
					].join("\n")
				}
			],
			supplementalProjects: [
				{
					title: "JM3 Supplemental Project 1: Basketball Statistics",
					contentKind: "assignment",
					preserveInstructions: true,
					ideImport: true,
					content: [
						"Apply the natural ordering pattern to a team. Each player has points, rebounds, and fouls. The shared foul limit is six.",
						"",
						"1. Return points plus rebounds from `combinedTotal()`. Cast points to `long` before adding. Use `Long.compare` to sort in ascending order.",
						"2. Return true when fouls reach or exceed six. Disqualified players still appear in the output with their status.",
						"3. Trace the small team by hand, then run the Java 21 check commands. Compare a player with five fouls and one with six, and test two scores tied on the sum.",
						"",
						"```text",
						"Casey | total 16 | fouls 5 | eligible",
						"Riley | total 18 | fouls 6 | disqualified",
						"Jordan | total 20 | fouls 2 | eligible",
						"```",
						"",
						"Check the sum when both inputs are `Integer.MAX_VALUE`. The expected total is `4294967294`."
					].join("\n"),
					projectLink: javaObjectWorkbookURL(
						"JM3-Supplemental-Project-1-Basketball-Statistics",
						"starter"
					),
					solutionLink: javaObjectWorkbookURL(
						"JM3-Supplemental-Project-1-Basketball-Statistics",
						"solution"
					)
				},
				{
					title: "Static Variables & Methods Extension Practice",
					contentKind: "assignment",
					preserveInstructions: true,
					ideImport: true,
					content: [
						"Use shared constants and a static method to score a list of integers. An even value contributes half its value. An odd value contributes twice its value. Include zero and negative values.",
						"",
						"1. Implement `scoreOf(int)` using the provided constants. Cast before doubling so the multiplication happens with type `long`.",
						"2. Trace `[2, 5, 8, 13]` as `1 + 10 + 4 + 26`. Set the total to zero inside each call to `computeScore`.",
						"3. Use Java 21 to run `javac --release 21 -Xlint:all -Werror *.java`, `java Main`, and `java ContractTests`.",
						"",
						"The sample prints `41`. Calling the scoring method with the sample, an empty list, and the sample again returns `41`, `0`, and `41`."
					].join("\n"),
					projectLink: javaObjectWorkbookURL(
						"J2-01-jm3-static-variables-and-methods-supplemental-3",
						"starter"
					),
					solutionLink: javaObjectWorkbookURL(
						"J2-01-jm3-static-variables-and-methods-supplemental-3",
						"solution"
					)
				}
			]
		},
		{
			title: "Check-In #1",
			curriculum: [
				{
					title: "Check-In #1 Overview",
					contentKind: "assignment",
					preserveInstructions: true,
					ideImport: true,
					content: [
						"Review the class and object model by building a Car with its own type, color, and mileage. Keep the construction count on the class.",
						"",
						"1. Trace both constructors. The shorter form supplies mileage zero. Increment the count once after the full constructor accepts the starting mileage.",
						"2. The provided `drive` method accepts zero and uses `Math.addExact` to detect integer overflow. Complete `sameMileage` so a missing car returns false. The order uses `Integer.compare` on mileage. Two cars at the same mileage tie in that order.",
						"3. Predict the result of calling `drive(20000)` on the red sedan. Sort the three cars and check the construction count.",
						"",
						"```text",
						"A yellow coupe that has driven 1500 miles.",
						"A red sedan that has driven 20000 miles.",
						"A blue sports car that has driven 60000 miles.",
						"Cars created: 3",
						"```",
						"",
						"Save and extract the ZIP. Use Java 21 to run `javac --release 21 -Xlint:all -Werror *.java`, `java Main`, and `java ContractTests`."
					].join("\n"),
					projectLink: javaObjectWorkbookURL(
						"JM-Check-in-1",
						"starter"
					),
					solutionLink: javaObjectWorkbookURL(
						"JM-Check-in-1",
						"solution"
					)
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
						"Use a static variable to track how many `Car` objects have been created in the current program. The count includes earlier successful constructions even if the program no longer holds their references."
				},
				{
					title: "Check-In #1: Comparable Objects",
					content:
						"Implement `Comparable<Car>` and sort by mileage. A comparison returns a negative value when the first car comes earlier, zero when their mileage ties, and a positive value when the first car comes later."
				},
				{
					title: "Check-In #1: Additional Practice Project",
					contentKind: "assignment",
					preserveInstructions: true,
					ideImport: true,
					content: [
						"Order cards by suit and then by rank. The constructor accepts ranks 1 through 13 and suits 1 through 4, corresponding to clubs, diamonds, hearts, and spades.",
						"",
						"1. Implement `compareTo(Card)` with `Integer.compare`. Compare the suits first. If they tie, compare the ranks. Two cards with the same rank and suit tie.",
						"2. Trace the fixed hand. The ace of hearts comes before the two of hearts, and the king of clubs comes before any heart.",
						"",
						"```text",
						"Sorted: [13 of clubs, 1 of hearts, 2 of hearts, 1 of spades]",
						"```",
						"",
						"3. Save and extract the ZIP. Use Java 21 to compile with `javac --release 21 -Xlint:all -Werror *.java`. Run `java Main` and `java ContractTests`.",
						"4. Try `java Main 7` for a repeatable five-card hand dealt without duplicates. Compare the new hand’s ordering with the fixed case."
					].join("\n"),
					projectLink: javaObjectWorkbookURL(
						"JM-Check-in-1-Additional-Project",
						"starter"
					),
					solutionLink: javaObjectWorkbookURL(
						"JM-Check-in-1-Additional-Project",
						"solution"
					)
				}
			],
			supplementalProjects: [
				{
					title: "Check-In #1: Extension Challenge",
					contentKind: "assignment",
					preserveInstructions: true,
					ideImport: true,
					content: [
						"Continue the saved Car workbook. Add a batch operation that applies a list of distances only when every distance is valid.",
						"",
						"1. Implement `driveAll(int... distances)`. The parameter is an array inside the method. Start with a local candidate mileage and use `Math.addExact` for each nonnegative distance.",
						"2. Assign the final value after the whole batch succeeds. If a negative distance or overflow is detected, the original mileage stays in place.",
						"3. Trace a car starting at 10 miles. Adding 3, 0, and 7 changes it to 20 miles. An empty batch and a batch containing a negative distance both leave it at 20.",
						"",
						"Save and extract the ZIP again. Compile with `javac --release 21 -Xlint:all -Werror *.java` and run `java ContractTests extension`."
					].join("\n"),
					projectLink: javaObjectWorkbookURL(
						"JM-Check-in-1",
						"starter"
					),
					solutionLink: javaObjectWorkbookURL(
						"JM-Check-in-1",
						"solution"
					)
				},
				{
					title: "Check-In #1 Transfer Practice",
					contentKind: "assignment",
					preserveInstructions: true,
					ideImport: true,
					content: [
						"Model tickets that can each be redeemed once. Each ticket has a unique number and a state. The class counts all tickets issued and all tickets redeemed.",
						"",
						"1. Inspect the constructor and identify which fields change when a ticket is issued.",
						"2. Implement `redeem()`. On the first call for a ticket, set its state to redeemed, increase the shared redeemed count, and return true. Repeating the call returns false and leaves all fields as they were.",
						"3. Run the driver with two tickets. Predict the first and repeated calls on ticket 1 and check the state of ticket 2 before its first use.",
						"",
						"```text",
						"First redemption: true",
						"Repeated redemption: false",
						"Second ticket redeemed: false",
						"Issued: 2, redeemed: 1",
						"```",
						"",
						"Save and extract the ZIP. With Java 21, run `javac --release 21 -Xlint:all -Werror *.java`, then `java Main` and `java ContractTests`."
					].join("\n"),
					projectLink: javaObjectWorkbookURL(
						"J2-02-check-in-1-supplemental-2",
						"starter"
					),
					solutionLink: javaObjectWorkbookURL(
						"J2-02-check-in-1-supplemental-2",
						"solution"
					)
				},
				{
					title: "Check-In #1 Extension Practice",
					contentKind: "assignment",
					preserveInstructions: true,
					ideImport: true,
					content: [
						"Present two rankings of the same contest attempts. The points view uses highest points first and shortest time for ties. The time view uses shortest time first and highest points for ties.",
						"",
						"1. A `Comparator<Attempt>` supplies a sorting rule. Use `comparingInt` with a getter for the first key. Apply `reversed()` to a key when its largest value should come first. Use `thenComparingInt` or `thenComparing` to add the second key.",
						"2. Pass each rule to the provided `sortedCopy` method. Sorting a copy preserves the original order. When both keys tie, a stable sort retains the tied entries’ original order.",
						"3. Predict both rankings for the driver. Save and extract the ZIP. With Java 21, run `javac --release 21 -Xlint:all -Werror *.java`, then `java Main` and `java ContractTests`. Compare all three printed sequences.",
						"",
						"```text",
						"Points view: [West, East, North, South]",
						"Time view: [North, South, West, East]",
						"Original: [North, East, West, South]",
						"```",
						"",
						"Add an attempt that ties on time only. Explain why the two rankings may place it differently."
					].join("\n"),
					projectLink: javaObjectWorkbookURL(
						"J2-03-check-in-1-supplemental-3",
						"starter"
					),
					solutionLink: javaObjectWorkbookURL(
						"J2-03-check-in-1-supplemental-3",
						"solution"
					)
				}
			]
		},
		{
			title: "JM4 Subclasses & Inheritance",
			curriculum: [
				{
					title: "Subclasses",
					contentKind: "reading",
					preserveInstructions: true,
					content: [
						"A subclass can be used through its parent type when it preserves that type’s contract. Square can be a Rectangle when both dimensions remain fixed. Delivery has an Address, so the address can be stored directly as a value.",
						"",
						"The subclass constructor starts with `super(...)` to initialize its parent. A subclass can reuse public behavior and keep its own private fields. An override has the same signature as the method it replaces. Use `@Override` so the compiler checks the signature.",
						"",
						"The variable’s declared type determines which methods can be called. For an overridden instance method, the actual object determines which implementation runs. A Square assigned to a Rectangle variable still uses Square’s `shapeName()`.",
						"",
						"Predict which code runs in a three-level Vehicle hierarchy. Then change one subtype and check that a different subtype retains its behavior."
					].join("\n")
				},
				{
					title: "JM4 Project 1: Rectangle and Square Class",
					contentKind: "assignment",
					preserveInstructions: true,
					ideImport: true,
					content: [
						"Give Rectangle immutable positive dimensions and let Square reuse that contract. A square passes its side twice to the parent constructor.",
						"",
						"1. Trace `super(side, side)` for a square with side 4. Compare its dimensions with a rectangle of width 3 and length 5.",
						"2. Override `shapeName()` in Square. Keep the common area and perimeter formulas in Rectangle, where they widen the inputs before arithmetic.",
						"3. Look at the `Rectangle[]` in the driver. Each iteration calls the correct label method on the actual object and uses the same formulas for all shapes.",
						"",
						"```text",
						"Rectangle: area 15, perimeter 16",
						"Square: area 16, perimeter 16",
						"```",
						"",
						"Explain why independent width and height setters would break this version of the Square contract.",
						"",
						"Save and extract the ZIP. Use Java 21 to run `javac --release 21 -Xlint:all -Werror *.java`, then `java Main` and `java ContractTests`."
					].join("\n"),
					projectLink: javaObjectWorkbookURL(
						"JM4-Rectangle-and-Square-Class",
						"starter"
					),
					solutionLink: javaObjectWorkbookURL(
						"JM4-Rectangle-and-Square-Class",
						"solution"
					)
				},
				{
					title: "JM4 Project 2: Book and PictureBook Class",
					contentKind: "assignment",
					preserveInstructions: true,
					ideImport: true,
					content: [
						"Use title and author to compare works. For two picture books, use the illustrator as an additional field when comparing illustrated editions.",
						"",
						"1. Pass title, author, and bookmark to Book with `super`. Keep the illustrator field in PictureBook.",
						"2. Implement `sameIllustration(PictureBook)` by checking the inherited `isSameBook` result before comparing the illustrator. An absent book cannot match.",
						"3. Override `toString()`. Start with the parent display and append the illustrator. A `Book` reference to a PictureBook still uses that display.",
						"",
						"```text",
						"The Lantern by A. Reed, page 5, illustrated by K. Lin",
						"Same work: true",
						"Same illustrated edition: false",
						"```",
						"",
						"Predict both comparisons for a pair with the same title and author but different illustrators. Move one bookmark and verify that both comparisons retain their original meaning.",
						"",
						"Save and extract the ZIP. Use Java 21 to run `javac --release 21 -Xlint:all -Werror *.java`, then `java Main` and `java ContractTests`."
					].join("\n"),
					projectLink: javaObjectWorkbookURL(
						"JM4-Book-and-Picture-Book-Class",
						"starter"
					),
					solutionLink: javaObjectWorkbookURL(
						"JM4-Book-and-Picture-Book-Class",
						"solution"
					)
				},
				{
					title: "JM4 Project 3: Vehicle Inheritance",
					contentKind: "assignment",
					preserveInstructions: true,
					ideImport: true,
					content: [
						"Trace a three-level hierarchy. Vehicle stores model and year. LandVehicle adds wheels and mileage. Car adds doors, and Motorcycle adds sidecar status.",
						"",
						"1. Follow each call to `super(...)` from Car or Motorcycle through the two parent classes.",
						"2. Add the subclass fields in the `details()` overrides. Call `super.details()` for the shared part. Compare the results through `Vehicle` references.",
						"3. Predict how adding one mile to the car affects the two output lines. The model rejects negative or nonfinite additions before updating mileage.",
						"",
						"```text",
						"2019 Camry, wheels 4, miles 13.5, doors 4",
						"2020 Sportster, wheels 2, miles 4.0, sidecar false",
						"```",
						"",
						"Save and extract the ZIP with the `src` folders and `sources.txt` intact. From that folder, use Java 21.",
						"",
						"```sh",
						"javac --release 21 -Xlint:all -Werror -d out @sources.txt",
						"java -cp out vehicles.Main",
						"java -cp out vehicles.ContractTests",
						"```"
					].join("\n"),
					projectLink: javaObjectWorkbookURL(
						"JM4-Project-3-Vehicle-Inheritance",
						"starter"
					),
					solutionLink: javaObjectWorkbookURL(
						"JM4-Project-3-Vehicle-Inheritance",
						"solution"
					)
				}
			],
			supplementalProjects: [
				{
					title: "JM4 Supplemental Project 1: Pet, Dog, and Cat Class",
					contentKind: "assignment",
					preserveInstructions: true,
					ideImport: true,
					content: [
						"Use a shared Pet type for a dog and a cat. The parent field holds the name, and each subtype supplies its own sound.",
						"",
						"1. Follow the call from `Pet.introduce()` to the abstract `sound()` method. The method call uses the actual pet.",
						"2. Implement the Cat override. Keep jump distance in Cat and service status in Dog.",
						"3. Trace a `Pet[]` holding both objects. Only call subtype-specific methods through references that support those methods.",
						"",
						"```text",
						"Cookie says Bark",
						"Cheeto says Meow",
						"Service dog: true",
						"Jump distance: 5",
						"```",
						"",
						"Check that a cat held through a Pet reference still meows and that creating a second cat leaves the first cat’s jump distance alone.",
						"",
						"Save and extract the ZIP. Use Java 21 to run `javac --release 21 -Xlint:all -Werror *.java`, then `java Main` and `java ContractTests`."
					].join("\n"),
					projectLink: javaObjectWorkbookURL(
						"JM4-Supplemental-Project-1-Pet-Dog-and-Cat-Class",
						"starter"
					),
					solutionLink: javaObjectWorkbookURL(
						"JM4-Supplemental-Project-1-Pet-Dog-and-Cat-Class",
						"solution"
					)
				},
				{
					title: "JM4 Supplemental Project 2: Lesson and DanceLesson Class",
					contentKind: "assignment",
					preserveInstructions: true,
					ideImport: true,
					content: [
						"Order mixed lessons by duration. Compare the difficulty of two dance lessons separately. A longer dance lesson can still be easier.",
						"",
						"1. Pass the duration and subject to Lesson. Finish the display by appending the dance style and difficulty.",
						"2. Complete `easierThan` using the two difficulty ratings. Equal ratings and a missing comparison lesson both give false.",
						"3. Predict which of the 30-, 45-, and 60-minute lessons sorts first. Check whether easier difficulty changes that order.",
						"",
						"```text",
						"Art, 30 minutes",
						"Dance, 45 minutes, jazz (difficulty 3)",
						"Dance, 60 minutes, ballet (difficulty 2)",
						"Ballet is easier: true",
						"```",
						"",
						"Add a second 45-minute lesson. Both compare equally by duration even if the topics differ.",
						"",
						"Save and extract the ZIP. Use Java 21 to run `javac --release 21 -Xlint:all -Werror *.java`, then `java Main` and `java ContractTests`."
					].join("\n"),
					projectLink: javaObjectWorkbookURL(
						"JM4-Lesson-and-DanceLesson-Class",
						"starter"
					),
					solutionLink: javaObjectWorkbookURL(
						"JM4-Lesson-and-DanceLesson-Class",
						"solution"
					)
				},
				{
					title: "Subclasses & Inheritance Extension Practice",
					contentKind: "assignment",
					preserveInstructions: true,
					ideImport: true,
					content: [
						"A priority delivery is a kind of delivery. A delivery has an address. Use a subclass for the priority fee and an Address field for the destination.",
						"",
						"1. Read the Address record as an immutable value holding the street. Trace both delivery constructors as they receive the same address.",
						"2. Complete `PriorityDelivery.feeCents()` by adding 300 cents to the 500-cent fee from `super.feeCents()`.",
						"3. Trace both receipt calls through Delivery references. The receipt reads the address and dispatches the fee method to the actual object.",
						"",
						"```text",
						"Market Lane: 500 cents",
						"Market Lane: 800 cents",
						"```",
						"",
						"Change the destination in a new object. The displayed street changes and the fee stays the same.",
						"",
						"Save and extract the ZIP. Use Java 21 to run `javac --release 21 -Xlint:all -Werror *.java`, then `java Main` and `java ContractTests`."
					].join("\n"),
					projectLink: javaObjectWorkbookURL(
						"J2-04-jm4-subclasses-and-inheritance-supplemental-3",
						"starter"
					),
					solutionLink: javaObjectWorkbookURL(
						"J2-04-jm4-subclasses-and-inheritance-supplemental-3",
						"solution"
					)
				}
			]
		},
		{
			title: "JM5 Maps",
			curriculum: [
				{
					title: "Maps",
					contentKind: "reading",
					preserveInstructions: true,
					content: [
						"A map pairs each key with one value. In a price map, the key is a product name and the value is its price in integer cents.",
						"",
						"- `put(key, value)` inserts a key or replaces its old value. `putIfAbsent(key, value)` preserves an existing non-null value.",
						"- `get(key)` looks up a value. When values can be null, use `containsKey(key)` to tell a stored null from a missing key. `getOrDefault(key, fallback)` returns the fallback for an absent key without modifying the map.",
						"- `remove(key)` removes a pair if it exists. `entrySet()` lets a loop read keys and values together, while `keySet()` and `values()` expose each part separately.",
						"",
						"Use stable keys such as strings. If a class defines key equality through `equals()`, equal keys must also return the same `hashCode()`. Changing fields used for hashing after insertion can make a key unreachable.",
						"",
						'**Trace:** Put bread at 375 and banana at 79 in a `HashMap<String, Integer>`. Try `putIfAbsent("bread", 400)`, then `put("bread", 400)`. Predict the bread price after each call. Put oats at zero and compare a lookup for oats with one for a missing product. Remove oats and check the map size.',
						"",
						"The bread price stays 375 after the first call and becomes 400 after the second. Before removal, oats is present even though its price is zero. After removal, two keys remain. A `HashMap` makes no iteration-order guarantee. A `TreeMap` copy lists these string keys in sorted order as banana, then bread."
					].join("\n")
				},
				{
					title: "Using a Java Map",
					contentKind: "assignment",
					preserveInstructions: true,
					ideImport: true,
					content: [
						"Each item name is a key and has one price in integer cents. Calling `put` on an existing key replaces its value without adding another entry.",
						"",
						"1. Implement `priceFor` with `getOrDefault`. A missing lookup returns the caller's default and leaves the map unchanged.",
						"2. Implement `addNew` with `putIfAbsent`. Try adding bread a second time and confirm that its first value remains.",
						"3. Trace one replacement, one new value, and one removal. The driver reports prices and size, and uses the map's entries to print its final inventory.",
						"",
						"The driver first prints `Bread: 375`. After the lookup, replacement, and removal steps, the sorted report shows `Inventory: {banana=79, bread=400}`.",
						"",
						"Save the IDE workspace, download its ZIP, and extract the folder. Use Java 21 in that folder.",
						"",
						"```sh",
						"javac --release 21 -Xlint:all -Werror *.java",
						"java Main",
						"java ContractTests",
						"```",
						"",
						"The starter compiles. Its checks show which behavior still needs to be implemented."
					].join("\n"),
					projectLink: javaObjectWorkbookURL("JM5-Maps", "starter"),
					solutionLink: javaObjectWorkbookURL("JM5-Maps", "solution")
				},
				{
					title: "JM5 Project 1: Letter Frequencies",
					contentKind: "assignment",
					preserveInstructions: true,
					ideImport: true,
					content: [
						"Count Unicode letters using a map from code point to count. Normalize each letter using Java's single-code-point lowercase mapping. Ignore other characters.",
						"",
						"1. For each input code point, identify whether it is a letter, then update the matching count.",
						"2. Use numeric code-point order for the report. If counts tie for the maximum, keep the first key in that order. Report an empty result when the input has no letters.",
						"3. Enter `B a A b!`. Expect `a: 2`, `b: 2`, and `Most frequent: a (2)`. Then enter `42?` to check the empty case.",
						"",
						"Save the IDE workspace, download its ZIP, and extract the folder. Use Java 21 in that folder.",
						"",
						"```sh",
						"javac --release 21 -Xlint:all -Werror *.java",
						"java Main",
						"java ContractTests",
						"```",
						"",
						"The starter compiles. Its checks show which behavior still needs to be implemented."
					].join("\n"),
					projectLink: javaObjectWorkbookURL(
						"JM5-Letter-Frequencies",
						"starter"
					),
					solutionLink: javaObjectWorkbookURL(
						"JM5-Letter-Frequencies",
						"solution"
					)
				},
				{
					title: "JM5 Project 2: Dealership Database",
					contentKind: "assignment",
					preserveInstructions: true,
					ideImport: true,
					content: [
						"Use a local map from vehicle ID to Car. The workbook reuses the Vehicle, LandVehicle, and Car types from the inheritance project. The sample IDs are fictional.",
						"",
						"1. Normalize a vehicle ID by trimming spaces and converting letters to uppercase. Reject a blank ID.",
						"2. Use conditional insertion so a duplicate never replaces the original car. A missing lookup or removal returns null.",
						"3. Enter two vehicles out of order and report the inventory by ID. Try the same key with different spaces and case. Confirm that the first car remains.",
						"",
						"The driver prints `Duplicate accepted: false`, `Missing VIN: null`, and both vehicle descriptions, starting with `DEMO-01: 2019 Camry, wheels 4, miles 13.5, doors 4`.",
						"",
						"Save and extract the workspace with its source directories and `sources.txt` intact. Use Java 21 from the extracted folder.",
						"",
						"```sh",
						"javac --release 21 -Xlint:all -Werror -d out @sources.txt",
						"java -cp out vehicles.Main",
						"java -cp out vehicles.ContractTests",
						"```"
					].join("\n"),
					projectLink: javaObjectWorkbookURL(
						"JM5-PROJECT-2-DealershipDatabase",
						"starter"
					),
					solutionLink: javaObjectWorkbookURL(
						"JM5-PROJECT-2-DealershipDatabase",
						"solution"
					)
				}
			],
			supplementalProjects: [
				{
					title: "JM5 Supplemental Project 1: Lending Library",
					contentKind: "assignment",
					preserveInstructions: true,
					ideImport: true,
					content: [
						"Use a map from book title to author. A title lookup retrieves one author. An author search may find several titles.",
						"",
						"1. Use case-insensitive title lookups and trim spaces at input. When searching by author, compare author values and report the matching title keys in alphabetical order.",
						"2. Print the stock list in title order. Keep missing titles distinct from existing titles.",
						"3. Run the driver with a known title, then try the author search. Type a menu choice and a value on separate lines. Use `1` for title, `2` for author, or `3` for all entries. Invalid or incomplete input produces a message rather than an exception.",
						"",
						"For input `2` and `Dr. Seuss`, expect `Green Eggs and Ham` and `The Cat in the Hat`.",
						"",
						"Save the IDE workspace, download its ZIP, and extract the folder. Use Java 21 in that folder.",
						"",
						"```sh",
						"javac --release 21 -Xlint:all -Werror *.java",
						"java Main",
						"java ContractTests",
						"```",
						"",
						"The starter compiles. Its checks show which behavior still needs to be implemented."
					].join("\n"),
					projectLink: javaObjectWorkbookURL(
						"JM5-Supplemental-Project-1-Lending-Library",
						"starter"
					),
					solutionLink: javaObjectWorkbookURL(
						"JM5-Supplemental-Project-1-Lending-Library",
						"solution"
					)
				},
				{
					title: "Maps Transfer Practice",
					contentKind: "assignment",
					preserveInstructions: true,
					ideImport: true,
					content: [
						"Store a set of attending names for each room. The map keeps rooms separate. The set ignores repeated entries in the same room.",
						"",
						"1. Use `computeIfAbsent` to create the first set for a room. Add the name to that set and return whether the attendance changed.",
						"2. Read a missing room as count zero. Reading it leaves the map unchanged.",
						"3. Enter Ada twice in Lab A and once in Lab B. The duplicate in Lab A returns false and each room has an independent count.",
						"",
						"The driver prints `Lab A: 2`, `Lab B: 1`, and `Missing room: 0`.",
						"",
						"Save the IDE workspace, download its ZIP, and extract the folder. Use Java 21 in that folder.",
						"",
						"```sh",
						"javac --release 21 -Xlint:all -Werror *.java",
						"java Main",
						"java ContractTests",
						"```",
						"",
						"The starter compiles. Its checks show which behavior still needs to be implemented."
					].join("\n"),
					projectLink: javaObjectWorkbookURL(
						"J2-05-jm5-maps-supplemental-2",
						"starter"
					),
					solutionLink: javaObjectWorkbookURL(
						"J2-05-jm5-maps-supplemental-2",
						"solution"
					)
				},
				{
					title: "Maps Extension Practice",
					contentKind: "assignment",
					preserveInstructions: true,
					ideImport: true,
					content: [
						"Use one map for available units and another for requested units. A reservation succeeds only when every requested item exists and has enough stock.",
						"",
						"1. Check each requested quantity before changing the stock map. Reject unknown keys, nonpositive requests, and requests above the available units.",
						"2. After the whole request passes validation, subtract the requested units. A rejected request leaves every count unchanged.",
						"3. Reserve two pens and one folder. Next, request one pen together with too many folders. Confirm that the second request leaves both counts unchanged.",
						"",
						"Both reports show the same counts, ending with `After second: {folder=2, pen=3}`.",
						"",
						"Save the IDE workspace, download its ZIP, and extract the folder. Use Java 21 in that folder.",
						"",
						"```sh",
						"javac --release 21 -Xlint:all -Werror *.java",
						"java Main",
						"java ContractTests",
						"```",
						"",
						"The starter compiles. Its checks show which behavior still needs to be implemented."
					].join("\n"),
					projectLink: javaObjectWorkbookURL(
						"J2-06-jm5-maps-supplemental-3",
						"starter"
					),
					solutionLink: javaObjectWorkbookURL(
						"J2-06-jm5-maps-supplemental-3",
						"solution"
					)
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
			"Trace the Car constructors and shared count, then make a separate prediction about how the Card hand sorts. Use the optional practice to revisit state changes or try a second way to order the same data."
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
				contentKind: "reading",
				preserveInstructions: true,
				content: [
					"Two calls to `new Book(…)` create different objects. `first == second` compares their references. `first.equals(second)` can return true because the objects describe the same title and author.",
					"",
					"An equality method accepts `Object`. In `other instanceof Book book`, the test handles null and other types before exposing `book` for field comparisons. The check must agree in both directions and across a chain of equal objects.",
					"",
					"Matching title and author make these copies equal, and equal objects return the same `hashCode()`. Use the same stable fields for both methods. Different books can have the same hash. A `HashSet` uses the hash to find candidates, then uses equality to tell them apart.",
					"",
					"**Trace:** Put one copy of The Witches into a `HashSet`. Move its bookmark from 0 to 20. A second copy with the same title and author still matches because the bookmark is outside the equality and hash rules.",
					"",
					"**Next module:** JM3 House Class defines sorting separately. A comparison uses its sign and documented tie breakers. Returning zero for a tie does not by itself define equality."
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
