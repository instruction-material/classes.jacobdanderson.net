import type { RawCourse, RawCourseModuleItem } from "./types";
import { javaObjectWorkbookURL } from "@/modules/javaSearchResources";
import { isCoreProjectTitle } from "./projectGrouping";
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
					contentKind: "reading",
					preserveInstructions: true,
					content: [
						"Java throws an exception when an operation cannot finish normally. A try block marks the operation. If it throws, Java skips the rest of that block and looks for the first handler whose catch type matches.",
						"",
						"Integer division by zero throws `ArithmeticException`. Access outside an array throws `ArrayIndexOutOfBoundsException`. Place each operation in its own try block so the handler can explain the specific failure.",
						"",
						"```java",
						"static String divide(int numerator, int divisor) {",
						"    try {",
						'        return "Quotient: " + (numerator / divisor);',
						"    } catch (ArithmeticException failure) {",
						'        return "Cannot divide by zero.";',
						"    }",
						"}",
						"```",
						"",
						"Trace the expression at divisors 3 and 0 with a numerator of 12. The calls return `Quotient: 4` and `Cannot divide by zero.`. A later call with divisor 2 returns `Quotient: 6` because the failed calculation changed no saved state.",
						"",
						"When a normal input check can detect a mistake, validate at the input boundary. Catch an exception where the code can recover, give the caller specific feedback, and try again from trustworthy state."
					].join("\n")
				},
				{
					title: "JM6 Project 1: Try-Catch This",
					contentKind: "assignment",
					preserveInstructions: true,
					ideImport: true,
					content: [
						"Use one method for integer division and one method for looking up a number by array index. Each recovers from one specific failure.",
						"",
						"1. Keep only the operation that can fail and its success result inside each try block. Catch `ArithmeticException` around division and `ArrayIndexOutOfBoundsException` around the array lookup. Use the documented response when the operation fails.",
						"2. Trace the fixed cases in Main. In order, the division cases are 12 ÷ 3, 12 ÷ 0, then 12 ÷ 2. The array cases use indices 1, −1, 3, then 2 with the array [4, 9, 15].",
						"3. Check that the failed operations leave the array unchanged and allow a corrected request. The driver prints `Quotient: 4`, `Cannot divide by zero.`, and `Quotient: 6` before the index checks. An index outside the array prints `Index outside array.`.",
						"",
						"Save the IDE workspace, download and extract its ZIP, and use Java 21 in the extracted folder.",
						"",
						"```sh",
						"javac --release 21 -Xlint:all -Werror *.java",
						"java Main",
						"java ContractTests",
						"```",
						"",
						"The starter compiles. Its method checks pass after the missing behavior is implemented."
					].join("\n"),
					projectLink: javaObjectWorkbookURL(
						"JM6-Try-Catch-Practice",
						"starter"
					),
					solutionLink: javaObjectWorkbookURL(
						"JM6-Try-Catch-Practice",
						"solution"
					)
				},
				{
					title: "Threading in Java",
					content: [
						"A Thread can run a task independently. Put the task body in a Runnable. Calling start schedules it on a new thread. Calling run directly executes the task on the caller’s current thread.",
						"",
						"The caller waits with join before reading results produced by the worker. Give each worker its own mutable state, keep its work bounded, and let the caller publish results after every join.",
						"",
						"Interrupt requests let a caller signal cancellation. A blocked sleep or await throws InterruptedException and clears the interrupt flag. A worker that exits in that handler restores the flag with Thread.currentThread().interrupt() so its caller can observe the interruption.",
						"",
						"Trace a worker that records one frame, then waits before the next. If interrupted during that wait, it exits with just one frame recorded. Tests check the recorded frames and the completion signal, so scheduling and console speed can vary."
					].join("\n")
				},
				{
					title: "JM6 Project 2: Bouncing Zeros",
					contentKind: "assignment",
					preserveInstructions: true,
					ideImport: true,
					content: [
						"Animate a zero across one row using a single worker. The worker owns its position and direction. Main starts the worker and joins it before announcing completion.",
						"",
						"1. Start at column zero, moving right. Print the current frame before moving. Reverse direction at either endpoint, with no repeated edge frame.",
						"2. Stop after the configured frame count. If a pause is interrupted, restore the thread's interrupted status and exit. The console pause changes the display pace.",
						"3. Trace seven frames with a width of four. The positions are 0, 1, 2, 3, 2, 1, 0. The two middle frames around the right edge include `...0` and `..0.`. The final line is `Animation complete.`. The checks also interrupt a worker during its first frame without using elapsed time as the correctness check.",
						"",
						"Save the IDE workspace, download and extract its ZIP, and use Java 21 in the extracted folder.",
						"",
						"```sh",
						"javac --release 21 -Xlint:all -Werror *.java",
						"java Main",
						"java ContractTests",
						"```",
						"",
						"The starter compiles. Its method checks pass after the missing behavior is implemented."
					].join("\n"),
					projectLink: javaObjectWorkbookURL(
						"JM6-Bouncing-Zeros",
						"starter"
					),
					solutionLink: javaObjectWorkbookURL(
						"JM6-Bouncing-Zeros",
						"solution"
					)
				}
			],
			supplementalProjects: [
				{
					title: "JM6 Supplemental Project 1: Barnyard Orchestra",
					contentKind: "assignment",
					preserveInstructions: true,
					ideImport: true,
					content: [
						"Create a small orchestra with three independent workers. Each worker records two occurrences of one sound. Its optional pause separates the two events.",
						"",
						"1. Enter three lines with a known animal and an integer delay from 0 to 1,000 milliseconds, for example `cow 0`, `pig 0`, and `frog 0`. Main validates all three lines before starting workers and handles incomplete input.",
						"2. Implement the two sound events in AnimalPlayer. After an interrupted delay, restore the interrupted status and end the worker without emitting any further sounds.",
						"3. Each worker records into a separate list. Main joins all three workers before printing their individual lists in input order. In the example, the first line is `cow: [moo, moo]`. Workers can complete in any order.",
						"",
						"Save the IDE workspace, download and extract its ZIP, and use Java 21 in the extracted folder.",
						"",
						"```sh",
						"javac --release 21 -Xlint:all -Werror *.java",
						"java Main",
						"java ContractTests",
						"```",
						"",
						"The starter compiles. Its method checks pass after the missing behavior is implemented."
					].join("\n"),
					projectLink: javaObjectWorkbookURL(
						"JM6-Supplemental-Project-1-Barnyard-Orchestra",
						"starter"
					),
					solutionLink: javaObjectWorkbookURL(
						"JM6-Supplemental-Project-1-Barnyard-Orchestra",
						"solution"
					)
				},
				{
					title: "Threading & Error Handling Transfer Practice",
					contentKind: "assignment",
					preserveInstructions: true,
					ideImport: true,
					content: [
						"Summarize two sets of fictional temperature readings. Give each set to a separate worker. Copy the input when constructing a worker so a later edit to the original array cannot affect the report.",
						"",
						"1. For a nonempty batch, initialize the minimum and maximum from its first reading. Scan the remaining readings, then publish one summary string.",
						"2. Return `No readings.` for an empty batch. Use the same result format for one reading and for negative readings.",
						"3. Main starts both workers and waits with join before reading either result. The sample prints `Hill: min -3, max 5` and `Lake: min 7, max 7`. Predict which result prints first even if the other worker finishes first.",
						"",
						"Save the IDE workspace, download and extract its ZIP, and use Java 21 in the extracted folder.",
						"",
						"```sh",
						"javac --release 21 -Xlint:all -Werror *.java",
						"java Main",
						"java ContractTests",
						"```",
						"",
						"The starter compiles. Its method checks pass after the missing behavior is implemented."
					].join("\n"),
					projectLink: javaObjectWorkbookURL(
						"J2-07-jm6-threading-and-error-handling-supplemental-2",
						"starter"
					),
					solutionLink: javaObjectWorkbookURL(
						"J2-07-jm6-threading-and-error-handling-supplemental-2",
						"solution"
					)
				},
				{
					title: "Threading & Error Handling Extension Practice",
					contentKind: "assignment",
					preserveInstructions: true,
					ideImport: true,
					content: [
						"Use two CountDownLatch objects as one-time signals. The first lets the caller know a worker is ready. The second lets the caller release that worker. A deadline keeps the wait bounded.",
						"",
						"1. Signal readiness, then wait for release with a time limit. Record `Released` when the release arrives or `Timed out` when the deadline passes first.",
						"2. Catch InterruptedException, record `Cancelled`, and restore the current thread's interrupted status before returning. The caller joins the worker before reading its outcome.",
						"3. Run Main to release the first worker and cancel the second. The resulting lines are `First job: Released` and `Second job: Cancelled`. Predict what the outcome would be if the caller issued neither signal and kept the release closed.",
						"",
						"Save the IDE workspace, download and extract its ZIP, and use Java 21 in the extracted folder.",
						"",
						"```sh",
						"javac --release 21 -Xlint:all -Werror *.java",
						"java Main",
						"java ContractTests",
						"```",
						"",
						"The starter compiles. Its method checks pass after the missing behavior is implemented."
					].join("\n"),
					projectLink: javaObjectWorkbookURL(
						"J2-08-jm6-threading-and-error-handling-supplemental-3",
						"starter"
					),
					solutionLink: javaObjectWorkbookURL(
						"J2-08-jm6-threading-and-error-handling-supplemental-3",
						"solution"
					)
				}
			]
		},
		{
			title: "Check-In #2",
			curriculum: [
				{
					title: "Check-In #2 Overview",
					contentKind: "assignment",
					preserveInstructions: true,
					ideImport: true,
					content: [
						"Trace a 12-hour clock and a 24-hour clock, then use a subclass to display a clock hour with Roman numerals. The supplied array gives the symbols, including VIII for eight.",
						"",
						"1. Read the HourClock constructor and tick method. Predict what follows 12 on a 12-hour clock and 23 on a 24-hour clock. Explain why the RomanClock constructor calls `super(false, hour)`.",
						"2. Implement `numeralForHour()` and the `displayTime()` override in RomanClock. A variable declared as HourClock can hold a RomanClock. Calling displayTime on it still uses the Roman display.",
						"3. In `updateMap()`, pair each Roman symbol with its decimal value using the array index. Store L as 50 if it is absent. Return a read-only snapshot in insertion order, so a second call retains the same values and order.",
						"4. Trace the rejected request to set hour 13 on the 12-hour clock. Main catches the specific IllegalArgumentException, proves that the previous hour remains, then retries with 9.",
						"",
						"The sample includes `Roman Time: VIII`, `VIII maps to: 8`, `Still at: 8`, and `Roman Time: IX`. The finite required run uses direct method calls.",
						"",
						"Save the IDE workspace, download and extract its ZIP, and use Java 21 in the extracted folder.",
						"",
						"```sh",
						"javac --release 21 -Xlint:all -Werror *.java",
						"java Main",
						"java ContractTests",
						"```",
						"",
						"The starter runs and reports the unfinished behavior. Use the method checks to confirm the result after implementing it."
					].join("\n"),
					projectLink: javaObjectWorkbookURL(
						"JM-Check-in-2-Updated",
						"starter"
					),
					solutionLink: javaObjectWorkbookURL(
						"JM-Check-in-2-Updated",
						"solution"
					)
				},
				{
					title: "Check-In #2: Inheritance",
					contentKind: "reading",
					preserveInstructions: true,
					content: [
						"HourClock owns the valid hour and decides when it wraps. A RomanClock calls its parent constructor with false so its hours remain in the range 1 through 12. It inherits tick and setHour.",
						"",
						"The variable declaration `HourClock example = new RomanClock(8)` lets code use the common clock methods. The actual object determines which displayTime implementation runs. The call prints `Roman Time: VIII` after the override is complete.",
						"",
						"Trace two transitions before implementing the override. The 12-hour sequence 11, 12 wraps to 1. The 24-hour sequence 22, 23 wraps to 0. Explain why neither transition requires an override in RomanClock."
					].join("\n")
				},
				{
					title: "Check-In #2: Threading and Error Handling",
					content: [
						"The optional clock playback uses composition. Its Runnable owns a normal HourClock and records the current hour before advancing. Main waits for the worker with join before reporting the records. Use a fixed count to bound the worker’s output.",
						"",
						"If the wait is interrupted, restore the interrupt flag and let the worker return. Check the expected four-hour trace and a cancellation after the first record in the Check-In 2 Extension Challenge."
					].join("\n")
				},
				{
					title: "Check-In #2: Maps",
					contentKind: "reading",
					preserveInstructions: true,
					content: [
						"The Roman symbol is the key and the corresponding decimal hour is the value. An array index starts at zero, so element zero, I, maps to 1. Element seven, VIII, maps to 8.",
						"",
						"Insert the twelve symbols in array order, using a LinkedHashMap to keep the report in that order. Use putIfAbsent to add L and 50 if that pair is missing. A second call preserves the stored values and order. Returning a read-only copy keeps callers from changing the original table.",
						"",
						"Predict which key appears after VII, which value a lookup of VIII returns, and how many entries remain after two calls. The answers are VIII, 8, and 13."
					].join("\n")
				},
				{
					title: "Check-In #2: Additional Practice Project",
					contentKind: "assignment",
					preserveInstructions: true,
					ideImport: true,
					content: [
						"Reuse HourClock and add a MinuteClock subclass. The subclass owns minutes, while HourClock owns the hour and selects the rollover rule.",
						"",
						"1. Keep each minute from 0 to 59. Reject a bad initial minute before reporting a time.",
						"2. Override tick to add one minute. At 59, set the minute to zero and call `super.tick()` exactly once. At any other minute, leave the hour alone.",
						"3. Override displayTime to print two digits for the minute. Predict the two changes in Main from 12:58 to 12:59, then to 1:00. A 24-hour clock moves from 23:59 to 0:00.",
						"",
						"The output includes `Time: 12:59`, `Time: 1:00`, and `Time: 0:00`. Compare the transition in both modes with the inherited hour-only behavior.",
						"",
						"Save the IDE workspace, download and extract its ZIP, and use Java 21 in the extracted folder.",
						"",
						"```sh",
						"javac --release 21 -Xlint:all -Werror *.java",
						"java Main",
						"java ContractTests",
						"```",
						"",
						"The starter runs and reports the unfinished behavior. Use the method checks to confirm the result after implementing it."
					].join("\n"),
					projectLink: javaObjectWorkbookURL(
						"JM-Check-in-2-Additional-Project",
						"starter"
					),
					solutionLink: javaObjectWorkbookURL(
						"JM-Check-in-2-Additional-Project",
						"solution"
					)
				}
			],
			supplementalProjects: [
				{
					title: "Check-In #2: Extension Challenge",
					contentKind: "assignment",
					preserveInstructions: true,
					ideImport: true,
					content: [
						"Compose the existing 12-hour clock with a separate Runnable. The worker owns its clock. It reports a fixed number of hours, then exits. The required check-in uses direct method calls.",
						"",
						"1. In run, report the current hour before ticking. Wait between records only. Exit after the configured count.",
						"2. If sleep throws InterruptedException, restore the interrupt flag and return. Use the separate cancellation check to verify that it records only the first hour when the caller cancels.",
						"3. Start the worker in Main and join it before reading its records. Starting at 11 for four records prints `Hours: [11, 12, 1, 2]`. Change the start hour and predict the complete trace before running again.",
						"",
						"Save the IDE workspace, download and extract its ZIP, and use Java 21 in the extracted folder.",
						"",
						"```sh",
						"javac --release 21 -Xlint:all -Werror *.java",
						"java Main",
						"java ContractTests",
						"```",
						"",
						"The starter runs and reports the unfinished behavior. Use the method checks to confirm the result after implementing it."
					].join("\n"),
					projectLink: javaObjectWorkbookURL(
						"JM-Check-in-2-Clock-Playback",
						"starter"
					),
					solutionLink: javaObjectWorkbookURL(
						"JM-Check-in-2-Clock-Playback",
						"solution"
					)
				},
				{
					title: "Check-In #2 Transfer Practice",
					contentKind: "assignment",
					preserveInstructions: true,
					ideImport: true,
					content: [
						"Maintain one latest integer reading per named sensor. A command supplies a sensor name and one reading. Use the supplied valid, malformed and corrected commands to check how a failed parse affects the map.",
						"",
						"1. Split one command into a name and a number. Reject blank names, missing readings, and extra fields.",
						"2. Parse the number before writing to the map. Catch NumberFormatException at that boundary. A rejected attempt leaves the last good reading in place.",
						"3. Apply `east 7`, `east broken`, and `east -2`. The driver shows `After rejection: 7` and `After retry: -2`. Confirm that changing east does not change a separate west reading.",
						"",
						"Save the IDE workspace, download and extract its ZIP, and use Java 21 in the extracted folder.",
						"",
						"```sh",
						"javac --release 21 -Xlint:all -Werror *.java",
						"java Main",
						"java ContractTests",
						"```",
						"",
						"The starter runs and reports the unfinished behavior. Use the method checks to confirm the result after implementing it."
					].join("\n"),
					projectLink: javaObjectWorkbookURL(
						"J2-09-check-in-2-supplemental-2",
						"starter"
					),
					solutionLink: javaObjectWorkbookURL(
						"J2-09-check-in-2-supplemental-2",
						"solution"
					)
				},
				{
					title: "Check-In #2 Extension Practice",
					contentKind: "assignment",
					preserveInstructions: true,
					ideImport: true,
					content: [
						"Convert one shared hour to each station’s local hour using a table of fictional integer offsets. Work in a 24-hour range from 0 to 23. Use the same rule for positive and negative offsets.",
						"",
						"1. Validate that the shared hour is within range before creating a report. An out-of-range hour throws IllegalArgumentException.",
						"2. Use `Math.floorMod((long) sharedHour + offset, 24)` to wrap an adjusted hour into the supported range. A TreeMap puts the station names in order. Preserve the supplied offsets so the next report starts from the same table.",
						"3. For Harbor with offset +4 and Ridge with offset −3, hour 23 produces `At 23: {Harbor=3, Ridge=20}`. Hour 1 produces `At 1: {Harbor=5, Ridge=22}`. Explain both crossings of midnight.",
						"",
						"Save the IDE workspace, download and extract its ZIP, and use Java 21 in the extracted folder.",
						"",
						"```sh",
						"javac --release 21 -Xlint:all -Werror *.java",
						"java Main",
						"java ContractTests",
						"```",
						"",
						"The starter runs and reports the unfinished behavior. Use the method checks to confirm the result after implementing it."
					].join("\n"),
					projectLink: javaObjectWorkbookURL(
						"J2-10-check-in-2-supplemental-3",
						"starter"
					),
					solutionLink: javaObjectWorkbookURL(
						"J2-10-check-in-2-supplemental-3",
						"solution"
					)
				}
			]
		},
		{
			title: "JM7 Bank Account",
			curriculum: [
				{
					title: "JM7 Project 1: Bank Account",
					contentKind: "assignment",
					preserveInstructions: true,
					ideImport: true,
					content: [
						"Build a classroom bank that keeps fictional accounts in a map. Use integer cents throughout. A balance of 250 means 2.50.",
						"",
						"1. Open each DEMO account once. Reject a duplicate ID, an invalid ID, or a negative opening amount. A missing lookup returns null.",
						"2. Deposit only positive amounts that fit in a long. Withdraw only a positive amount at or below the current balance. Decide whether the request is allowed before changing the balance.",
						"3. Trace the supplied deposit, overdraft, and corrected withdrawal. The final lines include `Overdraft accepted: false`, `DEMO-A: 250 cents`, and `DEMO-B: 50 cents`. Compare the two accounts after the rejected operation.",
						"",
						"The exercise uses fictional IDs and amounts. The program accepts no names or login data.",
						"",
						"Save the IDE workspace, download and extract its ZIP, and use Java 21 in the extracted folder.",
						"",
						"```sh",
						"javac --release 21 -Xlint:all -Werror *.java",
						"java Main",
						"java ContractTests",
						"```",
						"",
						"The starter runs with unfinished behavior. The method checks identify what still needs to be implemented."
					].join("\n"),
					projectLink: javaObjectWorkbookURL(
						"JM7-Bank-Account",
						"starter"
					),
					solutionLink: javaObjectWorkbookURL(
						"JM7-Bank-Account",
						"solution"
					)
				},
				{
					title: "Bank Account: Debugging and Failure Modes",
					content: [
						"Trace a 200-cent balance through a 75-cent deposit, a rejected 500-cent withdrawal, and a 25-cent withdrawal. The three balances are 275, 275, and 250 cents.",
						"",
						"If the rejected request changes the balance, move the validation before the subtraction. Run the overflow test with an account at Long.MAX_VALUE and verify that a one-cent deposit leaves it unchanged."
					].join("\n")
				},
				{
					title: "Bank Account: Planning and Architecture",
					content: [
						"BankSystem maps each fictional ID to its BankAccount. BankAccount owns its balance and validates changes. Main supplies the sample operations and displays a copy of the balances.",
						"",
						"Draw the two sample IDs pointing to different account objects. Trace duplicate registration and explain why it keeps the original object. Then trace one missing ID and show where the lookup ends."
					].join("\n")
				},
				{
					title: "Bank Account: Verification and Reflection",
					content: [
						"Run the method checks, then explain which check proves exact cents, which proves recovery after rejection, and which proves that updating one account leaves the other alone.",
						"",
						"Add a repeated-ID case and estimate the expected result before running it. Compare the reported map with the balance of the original object."
					].join("\n")
				}
			],
			supplementalProjects: [
				{
					title: "JM7 Supplemental Project 1: Calculator",
					contentKind: "assignment",
					preserveInstructions: true,
					ideImport: true,
					content: [
						"Use methods for arithmetic, remainder, powers, and factorial. The caller chooses one operation and provides its operands. Invalid input produces a specific message.",
						"",
						"1. Choose an arithmetic operation with two operands. Reject division or remainder by zero and reject nonfinite inputs or results. For factorial use one whole number from 0 to 20 and return an exact long.",
						"2. The default run demonstrates `add 10 2`, `factorial 5`, and `divide 5 0`. It prints `Sum: 12.0`, `5!: 120`, and `Divide by zero.`.",
						"3. Run `java Main power 2 4`, `java Main remainder 9 4`, or `java Main factorial 0`. Compare the exact factorial result with the arithmetic output. Try missing, extra, and malformed operands.",
						"",
						"Save the IDE workspace, download and extract its ZIP, and use Java 21 in the extracted folder.",
						"",
						"```sh",
						"javac --release 21 -Xlint:all -Werror *.java",
						"java Main",
						"java ContractTests",
						"```",
						"",
						"The starter runs with unfinished behavior. The method checks identify what still needs to be implemented."
					].join("\n"),
					projectLink: javaObjectWorkbookURL(
						"JM7-Calculator",
						"starter"
					),
					solutionLink: javaObjectWorkbookURL(
						"JM7-Calculator",
						"solution"
					)
				},
				{
					title: "Bank Account Transfer Practice",
					contentKind: "assignment",
					preserveInstructions: true,
					ideImport: true,
					content: [
						"Move fictional cents between two accounts. A transfer succeeds only when the source can pay and the destination can receive the full amount.",
						"",
						"1. Reject a missing account, a transfer to the same account, an invalid amount, and destination overflow. Check both sides before changing either balance.",
						"2. Withdraw and deposit the same amount after validation. The transfer runs on one thread, so the checks and updates occur in order.",
						"3. Move 30 cents from A to B, then try moving 90 cents out of the remaining 70. The failed attempt leaves `Balances: {DEMO-A=70, DEMO-B=80}`. Show that the two balances still add to 150.",
						"",
						"Save the IDE workspace, download and extract its ZIP, and use Java 21 in the extracted folder.",
						"",
						"```sh",
						"javac --release 21 -Xlint:all -Werror *.java",
						"java Main",
						"java ContractTests",
						"```",
						"",
						"The starter runs with unfinished behavior. The method checks identify what still needs to be implemented."
					].join("\n"),
					projectLink: javaObjectWorkbookURL(
						"J2-11-jm7-bank-account-supplemental-2",
						"starter"
					),
					solutionLink: javaObjectWorkbookURL(
						"J2-11-jm7-bank-account-supplemental-2",
						"solution"
					)
				},
				{
					title: "Bank Account Extension Practice",
					contentKind: "assignment",
					preserveInstructions: true,
					ideImport: true,
					content: [
						"Group fictional charges by category and produce an alphabetically ordered spending summary. Keep the category totals in integer cents.",
						"",
						"1. Trim surrounding spaces from category names. Reject a blank name, a nonpositive charge, or a total that would overflow.",
						"2. Add each valid charge to its category. A rejected charge leaves the current totals unchanged. Return a copy for each report.",
						"3. Record supplies at 175 cents and again at 25 cents, then travel at 50 cents. The completed report is `Summary: {supplies=200, travel=50}`. Compare a snapshot before and after another valid charge.",
						"",
						"Save the IDE workspace, download and extract its ZIP, and use Java 21 in the extracted folder.",
						"",
						"```sh",
						"javac --release 21 -Xlint:all -Werror *.java",
						"java Main",
						"java ContractTests",
						"```",
						"",
						"The starter runs with unfinished behavior. The method checks identify what still needs to be implemented."
					].join("\n"),
					projectLink: javaObjectWorkbookURL(
						"J2-12-jm7-bank-account-supplemental-3",
						"starter"
					),
					solutionLink: javaObjectWorkbookURL(
						"J2-12-jm7-bank-account-supplemental-3",
						"solution"
					)
				}
			]
		},
		{
			title: "JM8 File I/O",
			curriculum: [
				{
					title: "Writing to a File",
					contentKind: "assignment",
					preserveInstructions: true,
					ideImport: true,
					content: [
						"Write text rows in UTF-8. Replace starts a new file or discards the old contents. Append adds a row while preserving the rows already stored.",
						"",
						"1. Use the supplied temporary folder and write the two lines A and Café. Use Files.write with an explicit UTF-8 charset.",
						"2. Append End with CREATE and APPEND, then read back the lines. Expect `After append: [A, Café, End]`.",
						"3. Replace the file with New and expect `After replace: [New]`. Compare the old and new line counts to verify the operation.",
						"",
						"Save the IDE workspace, download and extract its ZIP, and use Java 21 in the extracted folder.",
						"",
						"```sh",
						"javac --release 21 -Xlint:all -Werror *.java",
						"java Main",
						"java ContractTests",
						"```",
						"",
						"The starter runs with unfinished behavior. The method checks identify what still needs to be implemented."
					].join("\n"),
					projectLink: javaObjectWorkbookURL(
						"JM8-Writing-to-a-File",
						"starter"
					),
					solutionLink: javaObjectWorkbookURL(
						"JM8-Writing-to-a-File",
						"solution"
					)
				},
				{
					title: "JM8 Project 1: Crazy Name Tags Printer",
					contentKind: "assignment",
					preserveInstructions: true,
					ideImport: true,
					content: [
						"Use the fictional label Zoë to produce three lines in one UTF-8 file. The output shows an uppercase version, every other character starting with the first, and the reverse.",
						"",
						"1. Trim surrounding spaces and reject an empty label before writing. Apply uppercase with Locale.ROOT.",
						"2. Count positions by Unicode code point. With Zoë, selecting positions 0 and 2 yields Zë. Reversing yields ëoZ.",
						"3. From the temporary file, verify `Tags: [ZOË, Zë, ëoZ]`. Try `java Main 'A🌼B'` to check that selection and reversal keep the flower intact.",
						"",
						"Save the IDE workspace, download and extract its ZIP, and use Java 21 in the extracted folder.",
						"",
						"```sh",
						"javac --release 21 -Xlint:all -Werror *.java",
						"java Main",
						"java ContractTests",
						"```",
						"",
						"The starter runs with unfinished behavior. The method checks identify what still needs to be implemented."
					].join("\n"),
					projectLink: javaObjectWorkbookURL(
						"JM8-Project-1-Crazy-Name-Tags-Printer",
						"starter"
					),
					solutionLink: javaObjectWorkbookURL(
						"JM8-Project-1-Crazy-Name-Tags-Printer",
						"solution"
					)
				},
				{
					title: "Reading from a File",
					contentKind: "assignment",
					preserveInstructions: true,
					ideImport: true,
					content: [
						"Read one signed integer per line from the supplied UTF-8 file numbers.txt. A blank or nonnumeric row is a format error. An empty file has zero total.",
						"",
						"1. Open a buffered reader with try-with-resources. Number lines from 1, trim each row, and parse it. Report the line number if parsing fails.",
						"2. Add each parsed value to a long total. Check the file containing 4, −2, and 13. The sample prints `Total: 15`.",
						"3. Compare a missing file, an empty file, and a file with an invalid row. A missing file gives a missing-file message. An invalid row gives its line number and leaves no partial total to report.",
						"",
						"Save the IDE workspace, download and extract its ZIP, and use Java 21 in the extracted folder.",
						"",
						"```sh",
						"javac --release 21 -Xlint:all -Werror *.java",
						"java Main",
						"java ContractTests",
						"```",
						"",
						"The starter runs with unfinished behavior. The method checks identify what still needs to be implemented."
					].join("\n"),
					projectLink: javaObjectWorkbookURL(
						"JM8-Reading-from-a-File",
						"starter"
					),
					solutionLink: javaObjectWorkbookURL(
						"JM8-Reading-from-a-File",
						"solution"
					)
				},
				{
					title: "JM8 Project 2: File IO and Maps",
					contentKind: "assignment",
					preserveInstructions: true,
					ideImport: true,
					content: [
						"Load alternating lines from a UTF-8 file. Lines 1 and 2 form the first key and value, lines 3 and 4 the second pair, and so on.",
						"",
						"1. Trim keys and values. Reject blank entries, an unpaired final key, and duplicate keys. Identify a failing record by its line number without printing the record itself.",
						"2. Keep input order with a LinkedHashMap. Return the loaded table only after every pair passes. A rejected file never replaces a prior result.",
						"3. Read the supplied input.txt and verify `Pairs: {pen=blue, folder=green}`. Compare an empty file, a two-pair file, and a repeated key.",
						"",
						"Save the IDE workspace, download and extract its ZIP, and use Java 21 in the extracted folder.",
						"",
						"```sh",
						"javac --release 21 -Xlint:all -Werror *.java",
						"java Main",
						"java ContractTests",
						"```",
						"",
						"The starter runs with unfinished behavior. The method checks identify what still needs to be implemented."
					].join("\n"),
					projectLink: javaObjectWorkbookURL(
						"JM8-Project-2-File-IO-and-Maps",
						"starter"
					),
					solutionLink: javaObjectWorkbookURL(
						"JM8-Project-2-File-IO-and-Maps",
						"solution"
					)
				}
			],
			supplementalProjects: [
				{
					title: "JM8 Supplemental Project 1: Bank Account with File I/O",
					contentKind: "assignment",
					preserveInstructions: true,
					ideImport: true,
					content: [
						"Save and reopen a fictional balance snapshot. The file starts with BALANCES-1, followed by one DEMO ID and a balance in integer cents on each comma-separated row.",
						"",
						"1. Save from the bank’s snapshot in ID order. Write the complete UTF-8 file to a temporary sibling, then replace the destination atomically. An unsupported atomic move is reported as an I/O error.",
						"2. Load and validate every row into a fresh bank, then return it. Reject an unknown format, duplicate ID or negative amount with a line number. A missing file starts an empty bank.",
						"3. Save the supplied two accounts, update the first, and save again. Reopen the file in a new bank. The final report is `Reopened: {DEMO-A=275, DEMO-B=50}`. This format contains only fictional IDs and amounts.",
						"",
						"Save the IDE workspace, download and extract its ZIP, and use Java 21 in the extracted folder.",
						"",
						"```sh",
						"javac --release 21 -Xlint:all -Werror *.java",
						"java Main",
						"java ContractTests",
						"```",
						"",
						"The starter runs with unfinished behavior. The method checks identify what still needs to be implemented."
					].join("\n"),
					projectLink: javaObjectWorkbookURL(
						"JM8-Supplemental-Project-Bank-Account",
						"starter"
					),
					solutionLink: javaObjectWorkbookURL(
						"JM8-Supplemental-Project-Bank-Account",
						"solution"
					)
				},
				{
					title: "File I/O Transfer Practice",
					contentKind: "assignment",
					preserveInstructions: true,
					ideImport: true,
					content: [
						"Count repeated entries in a fictional reading journal. An entry occupies a whole line. Empty lines are ignored.",
						"",
						"1. Trim each UTF-8 row and convert it to lowercase with Locale.ROOT. Leave spaces inside an entry intact.",
						"2. Increment the count when an entry is repeated. Return an alphabetically ordered report. For Cedar, Fern, a blank row, and another cedar, the result is `Counts: {cedar=2, fern=1}`.",
						"3. Verify that an empty journal gives an empty report. Compare a missing file with an empty file.",
						"",
						"Save the IDE workspace, download and extract its ZIP, and use Java 21 in the extracted folder.",
						"",
						"```sh",
						"javac --release 21 -Xlint:all -Werror *.java",
						"java Main",
						"java ContractTests",
						"```",
						"",
						"The starter runs with unfinished behavior. The method checks identify what still needs to be implemented."
					].join("\n"),
					projectLink: javaObjectWorkbookURL(
						"J2-13-jm8-file-i-o-supplemental-2",
						"starter"
					),
					solutionLink: javaObjectWorkbookURL(
						"J2-13-jm8-file-i-o-supplemental-2",
						"solution"
					)
				},
				{
					title: "File I/O Extension Practice",
					contentKind: "assignment",
					preserveInstructions: true,
					ideImport: true,
					content: [
						"Compare two fictional lists of room names in UTF-8 text files. Each list is a snapshot taken at one point in time.",
						"",
						"1. Trim each line and ignore blank rows. Treat repeated names as one entry. Each sorted result set uses complete names.",
						"2. Build additions from the newer set minus the older set. Build removals from the older set minus the newer set. Use copies so the original sets can be compared again.",
						"3. The original set contains Storage and Studio. The newer set contains Studio and Workshop. The program prints `Added: [Workshop]` and `Removed: [Storage]`.",
						"",
						"Save the IDE workspace, download and extract its ZIP, and use Java 21 in the extracted folder.",
						"",
						"```sh",
						"javac --release 21 -Xlint:all -Werror *.java",
						"java Main",
						"java ContractTests",
						"```",
						"",
						"The starter runs with unfinished behavior. The method checks identify what still needs to be implemented."
					].join("\n"),
					projectLink: javaObjectWorkbookURL(
						"J2-14-jm8-file-i-o-supplemental-3",
						"starter"
					),
					solutionLink: javaObjectWorkbookURL(
						"J2-14-jm8-file-i-o-supplemental-3",
						"solution"
					)
				}
			]
		},
		{
			title: "JM9 Maze Runner",
			curriculum: [
				{
					title: "JM9 Project 1: Maze Reader",
					contentKind: "assignment",
					preserveInstructions: true,
					ideImport: true,
					content: [
						"Load a rectangular UTF-8 grid with spaces for open cells, # for walls, one P for the start, and one E for the exit. Coordinates are zero-based, with x across and y down.",
						"",
						"1. Trace the loader from the first row through the recorded start position. Add the check that the number of exits is exactly one. Reject missing, empty, uneven, and otherwise malformed boards before displaying a grid.",
						"2. Complete isValidMove. A move can reach a space or the exit. Check the coordinate bounds before looking up a cell, and reject walls.",
						"3. Run practice.txt. Its start is `Start: (1, 1)`. The exit is (3, 1). Predict the result for a wall, a space, the exit, and a coordinate beyond the board. Try `java Main medium.txt` to see a larger supplied layout.",
						"",
						"Save the IDE workspace, download and extract its ZIP, and use Java 21 in the extracted folder.",
						"",
						"```sh",
						"javac --release 21 -Xlint:all -Werror *.java",
						"java Main",
						"java ContractTests",
						"```",
						"",
						"In the starter, the driver runs and the method checks identify unfinished behavior."
					].join("\n"),
					projectLink: javaObjectWorkbookURL(
						"Maze-Reader",
						"starter"
					),
					solutionLink: javaObjectWorkbookURL(
						"Maze-Reader",
						"solution"
					)
				},
				{
					title: "JM9 Project 2: Maze Runner",
					contentKind: "assignment",
					preserveInstructions: true,
					ideImport: true,
					content: [
						"Use Maze for the fixed layout, Player for the position, and MazeGame for the console. The practice board puts the exit two steps right of the start.",
						"",
						"1. Translate W, A, S, and D into one candidate coordinate. Check that cell against the maze before changing the player’s position. A wall or invalid command leaves the position alone.",
						"2. After a valid move, check the exit. A win prints `Congratulations! You've reached the exit!` and ends the game. Q and closed input also end it.",
						"3. Run the supplied fixture and enter W, D, D on separate lines. W hits the upper wall. The following moves advance to (2, 1) and (3, 1). Predict the positions and compare each printed board.",
						"",
						"Save the IDE workspace, download and extract its ZIP, and use Java 21 in the extracted folder.",
						"",
						"```sh",
						"javac --release 21 -Xlint:all -Werror *.java",
						"java Main",
						"java ContractTests",
						"```",
						"",
						"In the starter, the driver runs and the method checks identify unfinished behavior."
					].join("\n"),
					projectLink: javaObjectWorkbookURL(
						"Maze-Runner-Part-2",
						"starter"
					),
					solutionLink: javaObjectWorkbookURL(
						"Maze-Runner-Part-2",
						"solution"
					)
				},
				{
					title: "Maze Runner: Planning and Architecture",
					content: [
						"The board owns wall and exit cells. The player owns a position. The controller owns input and applies moves. Draw those three responsibilities before editing the controller.",
						"",
						"Trace W and D from (1, 1) in practice.txt. W proposes (1, 0), a wall. D proposes (2, 1), an open cell. The first proposal leaves the player where it was."
					].join("\n")
				},
				{
					title: "Maze Runner: Verification and Reflection",
					content: [
						"Run the reader check for a row with the wrong width and for a board with no exit. Run the game with W, D, D, then repeat with just Q. Compare the last printed message from each run.",
						"",
						"Close the console input and check that the program returns. In the optional timer exercise, verify that exiting also stops the worker."
					].join("\n")
				}
			],
			supplementalProjects: [
				{
					title: "JM9 Supplemental Project 1: Maze Runner Part 3",
					contentKind: "assignment",
					preserveInstructions: true,
					ideImport: true,
					content: [
						"Add a thread that counts down while the main thread owns the board, player, and input. Start with the untimed runner and keep movement rules the same.",
						"",
						"1. Complete Timer.run so it decreases the shared countdown once per tick and ends at zero. If its wait is interrupted, restore the interrupted flag and return.",
						"2. Keep the owner’s cleanup path around the game loop. Closing the timer interrupts and joins its worker after a win, quit, closed input, or timeout.",
						"3. Try Q and expect `Game ended.`. Close input and expect `Input ended.`. The checks use a short countdown to verify the expiry message `Time's up! You failed to reach the exit.`. If the console is waiting when time expires, Enter lets the loop report expiry. The late move is rejected.",
						"",
						"Save the IDE workspace, download and extract its ZIP, and use Java 21 in the extracted folder.",
						"",
						"```sh",
						"javac --release 21 -Xlint:all -Werror *.java",
						"java Main",
						"java ContractTests",
						"```",
						"",
						"In the starter, the driver runs and the method checks identify unfinished behavior."
					].join("\n"),
					projectLink: javaObjectWorkbookURL(
						"Maze-Runner-Part-3",
						"starter"
					),
					solutionLink: javaObjectWorkbookURL(
						"Maze-Runner-Part-3",
						"solution"
					)
				},
				{
					title: "Maze Runner Transfer Practice",
					contentKind: "assignment",
					preserveInstructions: true,
					ideImport: true,
					content: [
						"Replay one movement command per line from a UTF-8 file. Report which actions succeeded without asking for live input. Use a fresh player position for every replay.",
						"",
						"1. Read the supplied commands.txt. Trim each row, map W, A, S, or D to the next cell, and count unknown input and blocked cells as rejected moves.",
						"2. Move only on a legal candidate. Once a move reaches the exit, end the replay and ignore the remaining commands.",
						"3. For W, D, d, W on the practice board, the result is `Accepted: 2, rejected: 1, escaped: true`. Compare the report with a route that ends early or has no commands.",
						"",
						"Save the IDE workspace, download and extract its ZIP, and use Java 21 in the extracted folder.",
						"",
						"```sh",
						"javac --release 21 -Xlint:all -Werror *.java",
						"java Main",
						"java ContractTests",
						"```",
						"",
						"In the starter, the driver runs and the method checks identify unfinished behavior."
					].join("\n"),
					projectLink: javaObjectWorkbookURL(
						"J2-15-jm9-maze-runner-supplemental-2",
						"starter"
					),
					solutionLink: javaObjectWorkbookURL(
						"J2-15-jm9-maze-runner-supplemental-2",
						"solution"
					)
				},
				{
					title: "Maze Runner Extension Practice",
					contentKind: "assignment",
					preserveInstructions: true,
					ideImport: true,
					content: [
						"Validate a batch of maze layouts and summarize the result for each labeled case. An error in one file leaves the other reports available.",
						"",
						"1. Use the supplied map of case labels to paths. For each board, create a Maze and report its start coordinates. Catch IllegalArgumentException for that board and report the diagnostic without printing its contents.",
						"2. Use a TreeMap so report order is independent of input order. Keep results for missing, malformed, and ready boards in one table.",
						"3. Run the sample. Its first line is `broken: Maze needs one player start and one exit.`, and its last line is `practice: Ready at (1, 1)`. Change the order of the input labels and compare the result.",
						"",
						"Save the IDE workspace, download and extract its ZIP, and use Java 21 in the extracted folder.",
						"",
						"```sh",
						"javac --release 21 -Xlint:all -Werror *.java",
						"java Main",
						"java ContractTests",
						"```",
						"",
						"In the starter, the driver runs and the method checks identify unfinished behavior."
					].join("\n"),
					projectLink: javaObjectWorkbookURL(
						"J2-16-jm9-maze-runner-supplemental-3",
						"starter"
					),
					solutionLink: javaObjectWorkbookURL(
						"J2-16-jm9-maze-runner-supplemental-3",
						"solution"
					)
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
					content: [
						"Choose the guided tic-tac-toe project or propose a console application with a comparable scope. Identify the user, one main task, a rejected input, and what a fresh run should do.",
						"",
						"For the guided project, trace five moves on a 3-by-3 grid. The board owns the rules and occupied cells. The session asks a move source for whole lines and applies the rules. Use a scripted source to repeat the trace."
					].join("\n")
				},
				{
					title: "Portfolio Project",
					content: [
						"Put the application, repeatable checks, and README in one folder. Write the Java version, exact build and run commands, a complete example interaction, and one limitation.",
						"",
						"Try the steps from a fresh copy. In a walkthrough, point to the line that rejects malformed input and explain how one test finds a regression. Share the folder or a repository when ready."
					].join("\n")
				},
				{
					title: "Course Recap",
					content:
						"Review the major ideas from the course, including classes and objects, constructors, static members, inheritance, maps, threading, error handling, file I/O, and multi-class Java applications."
				},
				{
					title: "JM10 Master Project: Core Project",
					contentKind: "assignment",
					preserveInstructions: true,
					ideImport: true,
					content: [
						"Build the original 3-by-3 tic-tac-toe project as a console application. X and O take turns. Three marks in a row, column, or diagonal win. A full board without a winner is a tie.",
						"",
						"1. Draw the 3-by-3 board and choose its representation. In this workbook a map stores at most nine marks, indexed by row times three plus column. A missing index marks an empty cell. The board owns legal moves and outcomes. GameSession owns input and output.",
						"2. Implement the winning-line checks and trace all three line shapes. Check the win before a tie. The same GameSession reads live lines through MoveSource or uses a scripted sequence for a repeatable test.",
						"3. Enter 1 1, 2 1, 1 2, 2 2, and 1 3 on separate lines. The run ends with `Winner: X`. Try an occupied cell and a nonnumeric move. Both leave the current turn in place. Q or closed input ends an unfinished round.",
						"4. For an original capstone, adapt this scaffold or choose another bounded project. Identify its classes and input interface, document one collection invariant and one rejected input, and record a repeatable successful run. Explain which file owns each decision in a short walkthrough or recording.",
						"",
						"Save the IDE workspace, download and extract its ZIP, and run the workbook with Java 21 from that folder.",
						"",
						"```sh",
						"javac --release 21 -Xlint:all -Werror *.java",
						"java Main",
						"java ContractTests",
						"```",
						"",
						"The starter runs with unfinished behavior. The checks identify which contract still needs to be implemented."
					].join("\n"),
					projectLink: javaObjectWorkbookURL(
						"JM10-Tic-Tac-Toe-Console",
						"starter"
					),
					solutionLink: javaObjectWorkbookURL(
						"JM10-Tic-Tac-Toe-Console",
						"solution"
					)
				}
			],
			supplementalProjects: [
				{
					title: "JM10 Master Project: Extension Challenge",
					contentKind: "assignment",
					preserveInstructions: true,
					ideImport: true,
					content: [
						"Extend the tic-tac-toe capstone with a versioned UTF-8 results file. Save completed rounds only. Each line after ROUNDS-1 records X_WINS, O_WINS, or TIE.",
						"",
						"1. Validate all rounds before replacing a file. Write to a temporary file beside the destination, then move it into place. A rejected write leaves the earlier results available.",
						"2. Load and validate every record into a new list. A missing file starts with no rounds. A malformed file reports the line that failed.",
						"3. Reopen the three sample rounds. The report is `Reopened: [X_WINS, TIE, O_WINS]`. Check an invalid record and explain why the original board behavior can remain unchanged.",
						"",
						"Save the IDE workspace, download and extract its ZIP, and run the workbook with Java 21 from that folder.",
						"",
						"```sh",
						"javac --release 21 -Xlint:all -Werror *.java",
						"java Main",
						"java ContractTests",
						"```",
						"",
						"The starter runs with unfinished behavior. The checks identify which contract still needs to be implemented."
					].join("\n"),
					projectLink: javaObjectWorkbookURL(
						"JM10-Save-Round-Results",
						"starter"
					),
					solutionLink: javaObjectWorkbookURL(
						"JM10-Save-Round-Results",
						"solution"
					)
				},
				{
					title: "Master Project Transfer Practice",
					contentKind: "assignment",
					preserveInstructions: true,
					ideImport: true,
					content: [
						"Turn a project’s stated behaviors into an ordered list of checks. A check has a short label and either passes or stays open.",
						"",
						"1. Record at most one current result per label. Reject a blank label and trim surrounding spaces.",
						"2. Sort the open labels without changing the stored results. Updating a check from open to passed removes it from the report.",
						"3. In the sample, the win and retry checks pass. The report is `Open checks: [restart, tie]`. Replace those labels with checks from an original capstone and explain what evidence would close each one.",
						"",
						"Save the IDE workspace, download and extract its ZIP, and run the workbook with Java 21 from that folder.",
						"",
						"```sh",
						"javac --release 21 -Xlint:all -Werror *.java",
						"java Main",
						"java ContractTests",
						"```",
						"",
						"The starter runs with unfinished behavior. The checks identify which contract still needs to be implemented."
					].join("\n"),
					projectLink: javaObjectWorkbookURL(
						"J2-17-jm10-master-project-supplemental-2",
						"starter"
					),
					solutionLink: javaObjectWorkbookURL(
						"J2-17-jm10-master-project-supplemental-2",
						"solution"
					)
				},
				{
					title: "Master Project Extension Practice",
					contentKind: "assignment",
					preserveInstructions: true,
					ideImport: true,
					content: [
						"Separate command names from handlers. A map can hold functions under the names that users type. This sample uses simple numeric handlers so the lookup behavior stays visible.",
						"",
						"1. Trim surrounding spaces and lowercase each command name. Reject blank or repeated names. A repeated name leaves the first handler installed.",
						"2. Look up the chosen handler and pass it the argument. A missing handler gives a specific error.",
						"3. The sample prints `Double: 14` and `Next: 8`. Add a command and explain how the dispatcher can run it without adding another branch.",
						"",
						"Save the IDE workspace, download and extract its ZIP, and run the workbook with Java 21 from that folder.",
						"",
						"```sh",
						"javac --release 21 -Xlint:all -Werror *.java",
						"java Main",
						"java ContractTests",
						"```",
						"",
						"The starter runs with unfinished behavior. The checks identify which contract still needs to be implemented."
					].join("\n"),
					projectLink: javaObjectWorkbookURL(
						"J2-18-jm10-master-project-supplemental-3",
						"starter"
					),
					solutionLink: javaObjectWorkbookURL(
						"J2-18-jm10-master-project-supplemental-3",
						"solution"
					)
				}
			]
		},
		{
			title: "JM11 Repo Extension and Reference Library",
			curriculum: [
				{
					title: "How to Use the Extra Java Level 2 Folders",
					id: "java-level-2-optional-java-level-2-practice-and-reference-archive-supplemental-how-to-use-the-extra-java-level-2-folders",
					contentKind: "reading",
					preserveInstructions: true,
					preserveAssignment: true,
					content: [
						"Choose one exercise that fits a current question. Console Line practices one read and end of input. Counted Sum practices rejecting an incomplete batch. The File I/O extension applies a similar count to an on-disk fixture. For independent review, predict one output before running the code. In a walkthrough, pause at the first rejected input and explain what the caller can still use."
					].join("\n")
				},
				{
					title: "Reference and Solution Boundaries",
					id: "java-level-2-optional-java-level-2-practice-and-reference-archive-supplemental-reference-and-solution-boundaries",
					contentKind: "reading",
					preserveInstructions: true,
					preserveAssignment: true,
					content: [
						"A starter contains the exercise and a repeatable check. Test the first request before changing code and use the check message to locate the unfinished method. In a review, compare two concrete behaviors, such as what happens on a missing map key or a zero count. Then run the same case in the next project. For example, remove the last row from a copy of values.txt. Compare the starter and the completed reference on that truncated input. The completed reader reports the count mismatch before a caller can use a partial list."
					].join("\n")
				},
				{
					title: "When to Reach for the Extension Bank",
					id: "java-level-2-optional-java-level-2-practice-and-reference-archive-supplemental-when-to-reach-for-the-extension-bank",
					contentKind: "reading",
					preserveInstructions: true,
					preserveAssignment: true,
					content: [
						"After JM5, use the map reference or fictional alias directory to isolate a duplicate key. After JM6, use the exception example to trace a recovered division. After JM8, use the file exercise to separate an invalid format from a missing file. Use the quiz after JM10 for a small comparison between scoring and result ordering."
					].join("\n")
				},
				{
					title: "Repo Extension and Reference Library: Verification and Reflection",
					id: "java-level-2-optional-java-level-2-practice-and-reference-archive-supplemental-verification-review-repo-extension-and-reference-library",
					contentKind: "reading",
					preserveInstructions: true,
					preserveAssignment: true,
					content: [
						"Compare an empty line, an empty batch and a missing file. The first is a valid console response, the second is a batch with zero records, and the third is an I/O failure. For a walkthrough, show the relevant test for each case, then explain what callers receive and which inputs can be retried."
					].join("\n")
				},
				{
					title: "JM11 Repo Extension and Reference Library: Core Project",
					id: "java-level-2-optional-java-level-2-practice-and-reference-archive-supplemental-core-project-repo-extension-and-reference-library",
					contentKind: "assignment",
					preserveInstructions: true,
					preserveAssignment: true,
					ideImport: true,
					content: [
						"A console tool sees a stream of lines. One request uses a single whole line. Preserve spaces, allow an empty line, and distinguish end of input from an empty line. Read at most once so the same reader can supply another request.",
						"",
						"Implement ConsoleLine.read. Trace the two successive reads in ContractTests. Compare a scripted reader with a reader wrapped around System.in. Both provide the same method contract.",
						"",
						"The supplied example prints `Echo: [  red fox  ]`.",
						"",
						"Save the IDE workspace, download and extract its ZIP, and run the workbook with Java 21 from that folder.",
						"",
						"```sh",
						"javac --release 21 -Xlint:all -Werror *.java",
						"java Main",
						"java ContractTests",
						"```",
						"",
						"The starter runs with unfinished behavior. The checks identify which contract still needs to be implemented."
					].join("\n"),
					projectLink: javaObjectWorkbookURL(
						"Archive-Console-Echo",
						"starter"
					),
					solutionLink: javaObjectWorkbookURL(
						"Archive-Console-Echo",
						"solution"
					)
				}
			],
			supplementalProjects: [
				{
					title: "Extension: stdin/stdout Practice",
					id: "java-level-2-optional-java-level-2-practice-and-reference-archive-supplemental-extension-stdin-stdout-practice",
					contentKind: "assignment",
					preserveInstructions: true,
					preserveAssignment: true,
					ideImport: true,
					content: [
						"The first input line holds a nonnegative count. Exactly that many signed int values follow, one per line. Whitespace around a number is allowed. Use a long for the sum. Reject a missing header, negative count, missing or extra values, and malformed numbers with IllegalArgumentException.",
						"",
						"Implement CountedSum.sum. Use 0 as the header for an empty batch. Compare two inputs that differ only by the last line. Predict whether each produces a sum or an error.",
						"",
						"The supplied example prints `Sum: 9`.",
						"",
						"Save the IDE workspace, download and extract its ZIP, and run the workbook with Java 21 from that folder.",
						"",
						"```sh",
						"javac --release 21 -Xlint:all -Werror *.java",
						"java Main",
						"java ContractTests",
						"```",
						"",
						"The starter runs with unfinished behavior. The checks identify which contract still needs to be implemented."
					].join("\n"),
					projectLink: javaObjectWorkbookURL(
						"Archive-Counted-Sum",
						"starter"
					),
					solutionLink: javaObjectWorkbookURL(
						"Archive-Counted-Sum",
						"solution"
					)
				},
				{
					title: "Extension: Java File I/O",
					id: "java-level-2-optional-java-level-2-practice-and-reference-archive-supplemental-extension-java-file-i-o",
					contentKind: "assignment",
					preserveInstructions: true,
					preserveAssignment: true,
					ideImport: true,
					content: [
						"The first row of values.txt is the number of integers that follow. Parse UTF-8 text, keep the integers in file order, and return an immutable list. A count of zero gives an empty list. Reject a missing, invalid, or mismatched count and malformed records. Leave the input file intact. An unreadable path still reports an I/O failure.",
						"",
						"Implement IntegerFile.read. Change the last number in a copy of values.txt and predict the resulting list. Then remove a line and check that the program reports a format failure before returning any records.",
						"",
						"The supplied example prints `Values: [12, -3, 0, 7]`.",
						"",
						"Save the IDE workspace, download and extract its ZIP, and run the workbook with Java 21 from that folder.",
						"",
						"```sh",
						"javac --release 21 -Xlint:all -Werror *.java",
						"java Main",
						"java ContractTests",
						"```",
						"",
						"The starter runs with unfinished behavior. The checks identify which contract still needs to be implemented."
					].join("\n"),
					projectLink: javaObjectWorkbookURL(
						"Archive-Integer-File",
						"starter"
					),
					solutionLink: javaObjectWorkbookURL(
						"Archive-Integer-File",
						"solution"
					)
				},
				{
					title: "Reference: HashMaps Examples",
					id: "java-level-2-optional-java-level-2-practice-and-reference-archive-supplemental-reference-hashmaps-examples",
					contentKind: "reading",
					preserveInstructions: true,
					preserveAssignment: true,
					content: [
						'With Map<String, Integer> values = new HashMap<>(), put("oak", 2) creates a record. put("oak", 5) replaces the value for the same key, so the map still has one entry. containsKey("elm") is false. remove("oak") returns 5 and the next lookup has no entry. Use getOrDefault("elm", 0) for an absent count when a missing key does not have to be distinguished from a stored zero. To distinguish the two states, put a zero under elm and call containsKey again. Label the key-value types before repeating the trace with the directory project.'
					].join("\n")
				},
				{
					title: "Extension: Dog Class Test",
					id: "java-level-2-optional-java-level-2-practice-and-reference-archive-supplemental-extension-dog-class-test",
					contentKind: "assignment",
					preserveInstructions: true,
					preserveAssignment: true,
					ideImport: true,
					content: [
						"Each Dog owns its own age and name. The constructor rejects a negative age. birthday increases only the receiver's age by one. At the largest int, it reports overflow before changing that age. A formatted name and age let the caller read the result without accessing the fields.",
						"",
						"Implement Dog.birthday. Create two dogs with the same starting age. Call birthday on one and trace the two objects separately. Compare a state check with a check of the formatted text.",
						"",
						"The supplied example prints `Dog: Fido (6)`.",
						"",
						"Save the IDE workspace, download and extract its ZIP, and run the workbook with Java 21 from that folder.",
						"",
						"```sh",
						"javac --release 21 -Xlint:all -Werror *.java",
						"java Main",
						"java ContractTests",
						"```",
						"",
						"The starter runs with unfinished behavior. The checks identify which contract still needs to be implemented."
					].join("\n"),
					projectLink: javaObjectWorkbookURL(
						"Archive-Dog-Birthdays",
						"starter"
					),
					solutionLink: javaObjectWorkbookURL(
						"Archive-Dog-Birthdays",
						"solution"
					)
				},
				{
					title: "Tic-tac-toe Turn Trace",
					id: "java-level-2-optional-java-level-2-practice-and-reference-archive-supplemental-extension-tic-tac-toe-console",
					contentKind: "reading",
					preserveInstructions: true,
					preserveAssignment: true,
					content: [
						"The console version belongs to the Java Level 2 capstone. Use its Board and GameSession to compare two possible designs. In the supplied program the board rejects a repeated move, so the session asks again with the same mark. Trace X at (1, 1), O at (1, 1), then O at (2, 2). The last move is accepted because the retry does not advance the turn.",
						"",
						"Open the [tic-tac-toe capstone](/courses#java-level-2-jm10-master-project-java-level-2-jm10-master-project-curriculum-core-project-java-level-2) to run or edit the same game."
					].join("\n")
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
					id: "java-level-2-optional-java-level-2-practice-and-reference-archive-supplemental-reference-try-catch-example",
					contentKind: "reading",
					preserveInstructions: true,
					preserveAssignment: true,
					content: [
						"When the divisor is 2, integer division of 10 yields 5. When the divisor is 0, Java throws ArithmeticException at the division. A handler for that exception can report the invalid divisor and let the caller try again. The later output still runs. Catch the most specific exception the operation actually expects. Put the division inside try and put the message inside catch. After the handler, the original numerator remains valid. Try another nonzero divisor to verify that the caller can safely continue. ArithmeticException is unchecked. A file read can instead raise the checked exception IOException, which the caller must catch or declare."
					].join("\n")
				},
				{
					title: "Extension: Fictional Account Alias Directory",
					id: "java-level-2-optional-java-level-2-practice-and-reference-archive-supplemental-extension-password-management-system",
					contentKind: "assignment",
					preserveInstructions: true,
					preserveAssignment: true,
					ideImport: true,
					content: [
						"A directory stores one fictional display alias per service. Use supplied names like library and Luna. Trim surrounding spaces and use case-sensitive keys. Reject blank keys, blank aliases and duplicate services. A missing key returns an empty Optional. Real credentials and password storage are outside this exercise.",
						"",
						"Implement Directory.add. Key lookup is supplied. Verify that a rejected duplicate leaves the first alias available. Explain which input rule prevents two differently spaced keys from creating duplicate records.",
						"",
						"The supplied example prints `Alias: Luna`.",
						"",
						"Save the IDE workspace, download and extract its ZIP, and run the workbook with Java 21 from that folder.",
						"",
						"```sh",
						"javac --release 21 -Xlint:all -Werror *.java",
						"java Main",
						"java ContractTests",
						"```",
						"",
						"The starter runs with unfinished behavior. The checks identify which contract still needs to be implemented."
					].join("\n"),
					projectLink: javaObjectWorkbookURL(
						"Archive-Fictional-Accounts",
						"starter"
					),
					solutionLink: javaObjectWorkbookURL(
						"Archive-Fictional-Accounts",
						"solution"
					)
				}
			]
		},
		{
			title: "JM Master Project Example Quiz Game: Practice Studio",
			curriculum: [
				{
					title: "JM Master Project Example Quiz Game: Core Concepts",
					id: "java-level-2-optional-java-level-2-practice-and-reference-archive-supplemental-jm-master-project-example-quiz-game-core-concepts",
					contentKind: "reading",
					preserveInstructions: true,
					preserveAssignment: true,
					content: [
						"A quiz keeps the expected answers in question order. A round has a response for each question. Trimming and case-insensitive comparison make ordinary formatting differences irrelevant. A blank response counts as incorrect. A missing item means that the round is incomplete and cannot be included in a score report."
					].join("\n")
				},
				{
					title: "JM Master Project Example Quiz Game: Guided Example",
					id: "java-level-2-optional-java-level-2-practice-and-reference-archive-supplemental-jm-master-project-example-quiz-game-guided-example",
					contentKind: "reading",
					preserveInstructions: true,
					preserveAssignment: true,
					content: [
						"With expected answers Saturn, oxygen and Pacific, the responses “ SATURN ”, “argon” and “pacific” earn two points. The first and last match after normalization. Keep the expected and observed lists at the same indices. Predict the score after changing the middle response to oxygen, then compare a blank middle response with dropping the middle item."
					].join("\n")
				},
				{
					title: "JM Master Project Example Quiz Game: Core Project",
					id: "java-level-2-optional-java-level-2-practice-and-reference-archive-supplemental-core-project-jm-master-project-example-quiz-game",
					contentKind: "assignment",
					preserveInstructions: true,
					preserveAssignment: true,
					ideImport: true,
					content: [
						"The answer key and responses are in question order. Compare a response with the key at the same position. Ignore surrounding spaces and differences in letter case. Each exact normalized match earns one point. A blank response counts as incorrect. Reject an incomplete or oversized response list so a partial round never receives a score.",
						"",
						"Implement QuizRound.score. The supplied answers are Saturn, oxygen and Pacific. Explain which two sample responses match. Check how a blank response differs from a missing response.",
						"",
						"The supplied example prints `Correct: 2/3`.",
						"",
						"Save the IDE workspace, download and extract its ZIP, and run the workbook with Java 21 from that folder.",
						"",
						"```sh",
						"javac --release 21 -Xlint:all -Werror *.java",
						"java Main",
						"java ContractTests",
						"```",
						"",
						"The starter runs with unfinished behavior. The checks identify which contract still needs to be implemented."
					].join("\n"),
					projectLink: javaObjectWorkbookURL(
						"Archive-Quiz-Round",
						"starter"
					),
					solutionLink: javaObjectWorkbookURL(
						"Archive-Quiz-Round",
						"solution"
					)
				},
				{
					title: "JM Master Project Example Quiz Game: Review and Reflection",
					id: "java-level-2-optional-java-level-2-practice-and-reference-archive-supplemental-review-jm-master-project-example-quiz-game",
					contentKind: "reading",
					preserveInstructions: true,
					preserveAssignment: true,
					content: [
						"Check a normal match, a blank response, and a response list that ends early. If the result is complete, compare two entries with the same score. The extension keeps earlier arrivals first on a tie. The transfer practice instead groups attempts by topic. Use one trace to explain why those lists serve different purposes."
					].join("\n")
				}
			],
			supplementalProjects: [
				{
					title: "JM Master Project Example Quiz Game: Extension Challenge",
					id: "java-level-2-optional-java-level-2-practice-and-reference-archive-supplemental-extension-challenge-jm-master-project-example-quiz-game",
					contentKind: "assignment",
					preserveInstructions: true,
					preserveAssignment: true,
					ideImport: true,
					content: [
						"Each complete result has a fictional alias and a nonnegative score. Return at most the requested number of entries. Highest scores come first. An equal score stays in original arrival order. Keep the supplied result list unchanged. A zero limit gives an empty list, and a negative limit is invalid.",
						"",
						"Implement Leaderboard.top. Lee and Ari tie in the sample. The earlier entry appears first. Try a limit of one and explain why sorting by name would change the result.",
						"",
						"The supplied example prints `Top: [Lee (3), Ari (3)]`.",
						"",
						"Save the IDE workspace, download and extract its ZIP, and run the workbook with Java 21 from that folder.",
						"",
						"```sh",
						"javac --release 21 -Xlint:all -Werror *.java",
						"java Main",
						"java ContractTests",
						"```",
						"",
						"The starter runs with unfinished behavior. The checks identify which contract still needs to be implemented."
					].join("\n"),
					projectLink: javaObjectWorkbookURL(
						"Archive-Quiz-Leaderboard",
						"starter"
					),
					solutionLink: javaObjectWorkbookURL(
						"Archive-Quiz-Leaderboard",
						"solution"
					)
				},
				{
					title: "JM Master Project Example Quiz Game Transfer Practice",
					contentKind: "assignment",
					preserveInstructions: true,
					ideImport: true,
					content: [
						"Use fictional answer attempts to compare topics. Each attempt supplies a topic and a correct or incorrect result. Report correct answers and the total together.",
						"",
						"1. Update one tally for the attempt’s topic. Count both correct and incorrect answers in the total. Do not reuse a tally from a different topic.",
						"2. Report topics in alphabetical order. The sample includes `History: 0/1` and `Science: 2/3`. An empty attempt list gives an empty report.",
						"3. Add another attempt and predict which numerator and denominator should change.",
						"",
						"Save the IDE workspace, download and extract its ZIP, and run the workbook with Java 21 from that folder.",
						"",
						"```sh",
						"javac --release 21 -Xlint:all -Werror *.java",
						"java Main",
						"java ContractTests",
						"```",
						"",
						"The starter runs with unfinished behavior. The checks identify which contract still needs to be implemented."
					].join("\n"),
					projectLink: javaObjectWorkbookURL(
						"J2-19-applied-studio-14-jm-master-project-example-quiz-game-supplemental-2",
						"starter"
					),
					solutionLink: javaObjectWorkbookURL(
						"J2-19-applied-studio-14-jm-master-project-example-quiz-game-supplemental-2",
						"solution"
					)
				},
				{
					title: "JM Master Project Example Quiz Game Extension Practice",
					contentKind: "assignment",
					preserveInstructions: true,
					ideImport: true,
					content: [
						"Choose questions from a named topic for a repeatable practice set. Keep the original order and count a repeated prompt once.",
						"",
						"1. Walk the supplied question list. Keep only cards matching the chosen topic and preserve the first occurrence of each prompt.",
						"2. Stop when the set reaches the positive limit. A topic with fewer questions returns all available prompts. A missing topic returns an empty list.",
						"3. The sample asks for two Science prompts and prints `Practice: [What orbits Earth?, What is a solid?]`. Try a limit of one and compare with the same question list.",
						"",
						"Save the IDE workspace, download and extract its ZIP, and run the workbook with Java 21 from that folder.",
						"",
						"```sh",
						"javac --release 21 -Xlint:all -Werror *.java",
						"java Main",
						"java ContractTests",
						"```",
						"",
						"The starter runs with unfinished behavior. The checks identify which contract still needs to be implemented."
					].join("\n"),
					projectLink: javaObjectWorkbookURL(
						"J2-20-applied-studio-14-jm-master-project-example-quiz-game-supplemental-3",
						"starter"
					),
					solutionLink: javaObjectWorkbookURL(
						"J2-20-applied-studio-14-jm-master-project-example-quiz-game-supplemental-3",
						"solution"
					)
				}
			]
		},
		{
			title: "JM Maze Runner Project: Practice Studio",
			curriculum: [
				{
					title: "JM Maze Runner Project: Core Concepts",
					id: "java-level-2-optional-java-level-2-practice-and-reference-archive-supplemental-jm-maze-runner-project-core-concepts",
					contentKind: "reading",
					preserveInstructions: true,
					preserveAssignment: true,
					content: [
						"A board answers whether a proposed coordinate is legal. A player stores an accepted position. The session reads commands and ends when the exit is reached, time expires, or the input ends. A hint looks only at legal neighbors. A shortest-route search records predecessor moves so it can reconstruct several steps."
					].join("\n")
				},
				{
					title: "JM Maze Runner Project: Guided Example",
					id: "java-level-2-optional-java-level-2-practice-and-reference-archive-supplemental-jm-maze-runner-project-guided-example",
					contentKind: "reading",
					preserveInstructions: true,
					preserveAssignment: true,
					content: [
						"In a board row #P E#, the player starts at column 1 and the exit is at column 3. D is legal from the first cell and moves right. A then returns to column 1. Ask for a hint before each move and compare it with the two-step shortest route from the start."
					].join("\n")
				},
				{
					title: "Timed Maze Walkthrough",
					id: "java-level-2-optional-java-level-2-practice-and-reference-archive-supplemental-core-project-jm-maze-runner-project",
					contentKind: "reading",
					preserveInstructions: true,
					preserveAssignment: true,
					content: [
						"The timed console maze has its own starter and reference in JM9. Run the practice board with W, D, D. A wall rejects W without changing the player position. The second D reaches the exit. Start a fresh round and choose Q to verify that leaving the round stops its timer.",
						"",
						"Open [Maze Runner Part 3](/courses#java-level-2-optional-java-concurrency-extension-java-level-2-optional-java-concurrency-extension-supplemental-jm9-supplemental-project-1-maze-runner-part-3) to run or edit the timed game."
					].join("\n")
				},
				{
					title: "JM Maze Runner Project: Review and Reflection",
					id: "java-level-2-optional-java-level-2-practice-and-reference-archive-supplemental-review-jm-maze-runner-project",
					contentKind: "reading",
					preserveInstructions: true,
					preserveAssignment: true,
					content: [
						"Use a wall, a legal move, and an unreachable exit to distinguish hint behavior from route search. Hints report immediate neighbors. The route can be empty even when some neighbors are legal. On the same board, show one attempted move that is rejected before either query changes its answer."
					].join("\n")
				}
			],
			supplementalProjects: [
				{
					title: "Trace the Maze Deadline Rule",
					id: "java-level-2-optional-java-level-2-practice-and-reference-archive-supplemental-extension-challenge-jm-maze-runner-project",
					contentKind: "reading",
					preserveInstructions: true,
					preserveAssignment: true,
					content: [
						"Compare two rules for a time limit when the player reaches the exit on the boundary tick. Under exit-first rules a legal move that arrives at the exit ends the game before checking elapsed time. Under deadline-first rules the same input may expire. Trace both rules for one accepted move at the deadline and a rejected wall move at the deadline. Write expected end states before checking the timed game in JM9."
					].join("\n")
				},
				{
					title: "JM Maze Runner Project Transfer Practice",
					contentKind: "assignment",
					preserveInstructions: true,
					ideImport: true,
					content: [
						"Give a player the legal moves from a single coordinate. A hint reads the board and leaves the starting position in place.",
						"",
						"1. Check candidate cells in W, A, S, D order. Compare each cell to the board bounds and walls.",
						"2. Return the matching directions. A wall or out-of-bounds starting point gives an empty list.",
						"3. The practice board prints `From start: [D]` and `From middle: [A, D]`. Explain why the same lookup can be used before a move or as a hint after a rejected move.",
						"",
						"Save the IDE workspace, download and extract its ZIP, and run the workbook with Java 21 from that folder.",
						"",
						"```sh",
						"javac --release 21 -Xlint:all -Werror *.java",
						"java Main",
						"java ContractTests",
						"```",
						"",
						"The starter runs with unfinished behavior. The checks identify which contract still needs to be implemented."
					].join("\n"),
					projectLink: javaObjectWorkbookURL(
						"J2-21-applied-studio-15-jm-maze-runner-project-supplemental-2",
						"starter"
					),
					solutionLink: javaObjectWorkbookURL(
						"J2-21-applied-studio-15-jm-maze-runner-project-supplemental-2",
						"solution"
					)
				},
				{
					title: "JM Maze Runner Project Extension Practice",
					contentKind: "assignment",
					preserveInstructions: true,
					ideImport: true,
					content: [
						"Find a route from P to E using the same legal moves as the maze runner. Each move has equal cost. This optional activity introduces a queue that explores nearby cells before farther ones.",
						"",
						"1. Add the start to the queue. For each next cell, add each legal, previously unseen neighbor. Record its previous cell and move. That record also marks it as seen.",
						"2. When reaching E, trace previous cells back to the start and reverse the directions. If the queue empties first, return an empty list. The board has one distinct start and exit.",
						"3. The sample prints `Shortest route: [D, D]` on the practice board and `Blocked route: []` on the enclosed-board fixture. Trace the queue at each stage and explain why no longer alternative is returned.",
						"",
						"Save the IDE workspace, download and extract its ZIP, and run the workbook with Java 21 from that folder.",
						"",
						"```sh",
						"javac --release 21 -Xlint:all -Werror *.java",
						"java Main",
						"java ContractTests",
						"```",
						"",
						"The starter runs with unfinished behavior. The checks identify which contract still needs to be implemented."
					].join("\n"),
					projectLink: javaObjectWorkbookURL(
						"J2-22-applied-studio-15-jm-maze-runner-project-supplemental-3",
						"starter"
					),
					solutionLink: javaObjectWorkbookURL(
						"J2-22-applied-studio-15-jm-maze-runner-project-supplemental-3",
						"solution"
					)
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
