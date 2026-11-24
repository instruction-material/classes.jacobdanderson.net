import type { RawCourse, RawCourseModuleItem } from "./types";
import {
	copyClassroomCourseModules,
	createClassroomLaunchModule
} from "./classroom-course";
import {
	PYTHON_LEVEL_2_COLLECTIONS_SOURCE,
	PYTHON_LEVEL_2_PS1_SOURCE,
	PYTHON_LEVEL_2_PS2_SOURCE,
	PYTHON_LEVEL_2_PS3_SOURCE,
	PYTHON_LEVEL_2_PS4_SOURCE,
	PYTHON_LEVEL_2_PS6_LISTS_SOURCE,
	PYTHON_LEVEL_2_PS14_SOURCE,
	pythonLevel2Course
} from "./python-level-2";

const PYTHON_LEVEL_2_SOURCE =
	"https://github.com/instruction-material/Python-Level-2/tree/main";

const pinnedLaunchSources: Record<string, string> = {
	"PS1-Mad-Libs": PYTHON_LEVEL_2_PS1_SOURCE,
	"PS2-Change-Machine": PYTHON_LEVEL_2_PS2_SOURCE,
	"PS3-Caesar-Cipher": PYTHON_LEVEL_2_PS3_SOURCE,
	"PS4-Rock-Paper-Scissors": PYTHON_LEVEL_2_PS4_SOURCE,
	"PS6-Song-Generator": PYTHON_LEVEL_2_PS6_LISTS_SOURCE,
	"PS10-Todo-List": PYTHON_LEVEL_2_COLLECTIONS_SOURCE,
	"PS13-Wordsmith":
		"https://github.com/instruction-material/Python-Level-2/tree/a840f54eb6a55718f6305544adc937c32fa516ee",
	"PS14-Advanced-Blackjack": PYTHON_LEVEL_2_PS14_SOURCE
};

function launchProject(
	title: string,
	content: string,
	sourcePath: string,
	learningPath: "choice" | "challenge"
): RawCourseModuleItem {
	const source = pinnedLaunchSources[sourcePath] ?? PYTHON_LEVEL_2_SOURCE;
	return {
		title,
		content,
		learningPath,
		solutionLink: `${source}/${sourcePath}/solution`
	};
}

const classroomLaunchModule = createClassroomLaunchModule({
	courseId: "python-level-2-classroom",
	courseFlow:
		"Build Mad Libs Studio and Change Machine together as the shared launch, then continue through the remaining projects by concept. Wordsmith and Blackjack are the harder integrated systems; the remixes remain supplemental practice.",
	coreItems: [
		{
			title: "Classroom Workflow: Run, Normal, Hard",
			content: `Each classroom project begins with a working program or a substantial completed framework. Run it unchanged, describe the input-to-output or state-change path, and locate the labeled student sections before editing.

Complete the **Normal** section first. Save and demonstrate that checkpoint before attempting **Hard**. Hard is a separate extension and may remain empty without breaking the completed framework.

During a class share, show one representative input, one boundary or invalid input, and one repair. Explain the section you changed rather than reading the entire completed program aloud.`
		},
		launchProject(
			"Launch Project 1: Mad Libs Studio",
			`The completed framework collects words and assembles a readable story so the first run already produces a complete result.

**Normal:** Complete the labeled addition by collecting one more clearly named word and using it in the story output.

**Hard:** Add input cleanup, a second story path, or replay without duplicating the complete story-building framework.`,
			"PS1-Mad-Libs",
			"choice"
		),
		launchProject(
			"Launch Project 2: Change Machine",
			`The completed program converts cents into coin counts and provides a concrete loop-and-remainder trace to inspect.

**Normal:** Complete the labeled addition with one extra output that reports or checks the remaining value after a conversion step.

**Hard:** Add validation for negative or nonnumeric input, then compare at least three boundary values without rewriting the working conversion logic.`,
			"PS2-Change-Machine",
			"choice"
		),
		launchProject(
			"Launch Project 3: Caesar Cipher Lab",
			`The framework shifts each ASCII letter and restores the original text with the opposite shift. It preserves uppercase and lowercase and carries punctuation through unchanged.

**Normal:** Show the original, shifted, and restored strings together with the shift used. With Az! and shift 1, compare Az!, Ba!, and Az!.

**Hard:** Add an encode or decode choice that works with a message entered in either form. Choose decode, enter Ba! and shift 1, and verify that only Az! is returned.`,
			"PS3-Caesar-Cipher",
			"choice"
		),
		launchProject(
			"Launch Project 4: Rock, Paper, Scissors Arena",
			`The completed game accepts two moves and reports a winner, a tie, or an invalid round.

**Normal:** Add a round summary with both normalized moves. Rock and Paper should display rock and paper before the Player 2 result.

**Hard:** Add a practice mode with a fixed Player 2 move. Set it to scissors, enter rock for Player 1, and confirm Player 1 wins. Preserve rejection of an invalid Player 1 move.`,
			"PS4-Rock-Paper-Scissors",
			"choice"
		),
		launchProject(
			"Launch Project 5: Song Generator",
			`The framework stores notes in a list and assembles them into a generated sequence.

**Normal:** Reverse the song before rendering, then compare both audio versions.

**Hard:** Let the user replace the pitch at one position while preserving its duration. Reject an invalid position and offer a way to cancel.`,
			"PS6-Song-Generator",
			"choice"
		),
		launchProject(
			"Launch Project 6: To-Do List Manager",
			`Run the completed menu and add two tasks. Use 4 to see them in order and 2 to remove a displayed position.

**Normal:** Print the task count before the list. It should change from two to one after the removal.

**Hard:** Add a search command that can report every matching position. Search read after adding read, stretch, and read. It should report positions 1 and 3 while keeping the list intact.`,
			"PS10-Todo-List",
			"choice"
		),
		launchProject(
			"Launch Project 7: Wordsmith Challenge",
			`The framework selects letters, loads valid words, times a round, and checks submitted words.

**Normal:** Change the labeled word_score(word) helper to add one scoring rule based on word length or letter use; demonstrate an accepted word with the changed score.

**Hard:** Change the labeled choose_letters helper to guarantee a vowel, or add replay, difficulty or high scores while preserving duplicate rejection and the round deadline.`,
			"PS13-Wordsmith",
			"challenge"
		),
		launchProject(
			"Launch Project 8: Blackjack Table",
			`The completed game models cards, hands, player choices, dealer behavior, and the main win-loss-tie outcomes.

**Normal:** Trace the practice round after two hits. Show the best score before and after each new card.

**Hard:** Track wins, losses, ties, and two-card 21 outcomes across fresh rounds. Check that an early quit adds no result.`,
			"PS14-Advanced-Blackjack",
			"challenge"
		),
		{
			title: "Classroom Debugging and Showcase Routine",
			content: `When a change fails, stop at the first useful error or incorrect output. Record the input, expected result, actual result, and named line or state involved. Make one repair and rerun the same case before trying a different case.

For a showcase, demonstrate the working Normal result first. If Hard is complete, show it second and identify the reused function, collection, or control-flow rule. End with one test that originally failed and the specific repair that made it pass.`
		}
	],
	supplementalItems: [
		{
			title: "Launch Remix: Data Structure Swap",
			content: `Choose a launch project that uses a list, dictionary, or set.

**Normal:** Identify one responsibility that belongs to the current structure and add one safe operation using that structure.

**Hard:** Rebuild one small responsibility with a different data structure, then explain the behavior, readability, and duplicate-handling tradeoffs.`,
			learningPath: "choice",
			solutionLink:
				"https://github.com/instruction-material/Python-Level-2/tree/a840f54eb6a55718f6305544adc937c32fa516ee/PS13-Wordsmith/solution"
		},
		{
			title: "Launch Remix: Test Matrix",
			content: `Choose any launch project and preserve its completed framework.

**Normal:** Write and run a three-case test matrix covering an ordinary, boundary, and invalid or empty case.

**Hard:** Add a small reusable test function or deterministic mode that reproduces a prior failure without manual re-entry.`,
			learningPath: "challenge",
			solutionLink: `${PYTHON_LEVEL_2_PS1_SOURCE}/PS1-Mad-Libs/solution`
		}
	]
});

const classroomProjectExtensions: Record<string, string> = {
	"PS9-Soccer-Nationalities": `Run the completed roster report. Trace four players from Spain through the loop and confirm that Spain appears once in the result.

**Normal:** Count how many sample players come from each country. Print the counts in alphabetical country order.

**Hard:** Add a player from a country already in the roster and a player from a new country. Show the change to both totals after each addition.

**Success criteria:** The original totals are eleven players and eight countries. An additional player from Spain increases only the player count.`,
	"PS9-Debugging-Sets": `Run the completed tracker and enter n, y, Jared. Trace the removal from team 1's field roster and the addition to the captured roster. Try the same capture again.

**Normal:** Print the number of free and captured players on each team after a turn.

**Hard:** Add a rescue operation that moves a named player from the correct captured set back to its corresponding field set.

**Success criteria:** Capturing Jared changes team 1's counts to three free and one captured. A repeat leaves those counts as they were. Rescuing Jared restores four free and zero captured.`,
	"PS12-Evil-Wheel-of-Fortune": `Run a round and follow the active candidate set for one guess. Trace the candidates cat, car, and bar with the letter c. The largest family reveals c and retains cat and car.

**Normal:** Print the number of candidates before and after a guess. Show that every retained word matches the displayed pattern.

**Hard:** Make tied largest families resolve consistently. Prefer a pattern that reveals fewer positions, then compare tied patterns alphabetically.

**Success criteria:** With cat, car, and bar, guessing c changes three candidates to two. The retained family only contains cat and car.`,
	"PS13-Typewriter-Monkeys": `Run the simulation and verify the found word against the included set. Trace the last three characters as four letters arrive and compare the result with the count.

**Normal:** Print the current window on the first three steps and label each step with its letter count.

**Hard:** Accept a fixed letter stream for a reproducible test and keep the existing random mode.

**Success criteria:** Given x, c, a, t and a vocabulary containing only cat, the fixed stream finds cat on step four.`,
	"PS9-Class-Registration": `Run the completed roster report. The original Biology list contains ten entries and the set contains eight names. Compare a repeated name with the distinct names Sarah and Sara.

**Normal:** Report the number of duplicate registrations removed from each course. Biology and English lose two and three entries. Computer Science loses zero.

**Hard:** Report the number of distinct students across all three classes. Use a union so someone in two courses is counted once.

**Success criteria:** The combined roster contains 18 distinct names. The course counts stay 8, 9, and 7.`,
	"PS10-US-Capitals-Quiz": `Open both text files and trace one question through the dictionary. The first pair is Alabama and Montgomery. Run the quiz and compare one correct answer with a wrong answer.

**Normal:** Keep and display the number of questions answered alongside the final score. Count the wrong answer as an attempt.

**Hard:** Ask at most five different states per game. Track states already used or sample without replacement.

**Success criteria:** A wrong second answer after one correct response reports two attempts and one point. No state is repeated in a five-question game.`,
	"PS11 Supplemental Project 2: Theme Park Planner": `Choose String Mountain twice, try it a third time, then choose Concatenation Carousel. Trace the budget through the two accepted choices and the rejected choice.

**Normal:** Print the total number of minutes used beside the unused time. Two String Mountain visits followed by q use 260 minutes.

**Hard:** List only rides that fit the time left. Show the shortest eligible ride first and order equal-duration rides by name.

**Success criteria:** The third String Mountain visit leaves the budget unchanged at 100 minutes. Concatenation Carousel uses the final 100 minutes and the plan lists all three accepted choices.`,
	"PS12-Review-Sentiment": `Run the completed review scorer with Great, but BAD. Trace how the three cleaned words map to one positive match, one negative match, and one unmatched word.

**Normal:** Display the unmatched count alongside the two match counts.

**Hard:** When a scored word directly follows not, count it in the opposite category. Keep other unmatched words out of both match counts.

**Success criteria:** The original example has one unmatched word and reports neutral. In the extended version, not good is negative and not bad is positive. Punctuation-only input still produces an empty result.`,
	"PS4-Rock-Paper-Scissors": `Run the complete game and compare paper/rock, rock/paper, and rock/rock. Locate the invalid-input check and the winning combinations. Compare how the result changes when the same two valid moves trade places.

**Normal:** Add an explanation to a winning result. Paper against rock should include “paper beats rock.”

**Hard:** Play three rounds and keep a total for each player. A tie or a pair containing an invalid move adds zero points.

**Success criteria:** One Player 1 win, a tie, and one invalid round leave a score of 1–0.`,
	"PS4-FizzBuzz": `Run the full list and compare the results at 3, 5, 15, and 16. Trace how the overlapping condition is reached before either single-divisor condition.

**Normal:** Add an end-of-run count for each label. For 1 through 50, count 13 Fizz, 7 Buzz, and 3 FizzBuzz lines.

**Hard:** Accept the highest number to print and handle a nonpositive limit. For 15, report 4 Fizz, 2 Buzz, and 1 FizzBuzz.

**Success criteria:** The counts exclude the overlap from the single-label totals, and 16 prints as 16.`,
	"PS4-Credit-Card-Validator": `Run the checksum with the short fictional strings 1479 and 1478. Trace which digits are doubled and when the doubled result is reduced by 9.

**Normal:** Print each processed value while retaining the final total. For 1479, show 9, 5, 4, and 2 from right to left.

**Hard:** Add a mode that compares two fictional samples. When given 1479 and 1478, report totals of 20 and 19 and identify which checksum passes.

**Success criteria:** The sample 109 still passes with total 10. A string containing a letter is rejected before arithmetic.`,
	"PS4-Carnival-Strength-Tester": `Try 49, 50, 100, and 150 inches. Identify the first true condition for each height. Record why the boundary at 100 skips both lower tiers.

**Normal:** Include the distance to the next prize tier when one exists. For 99 inches, the distance to a frisbee is 1 inch.

**Hard:** Compare two attempts and award one prize based on the larger height. Attempts of 99 and 100 inches earn a frisbee.

**Success criteria:** A height of 150 earns the largest prize and reports no further tier.`,
	"PS4-Test-Statistics": `Run with 0, 70, 100, 70, and 100. Check the high, low, and average, then trace a single score through both comparisons.

**Normal:** Add a count of scores at least 70. The sample has four qualifying scores.

**Hard:** Ask how many valid scores to collect, then compute all four results for that count. For 3 scores of 0, 70, and 100, the qualifying count is 2 and the average rounds to 56.7.

**Success criteria:** An invalid score is replaced before counting, even when entered after earlier valid scores.`,
	"PS4-Relay-Race-Statistics": `Run with 50, 60, 55, and 55 seconds. The average is 55 seconds. Compare each runner with that same value.

**Normal:** Print each runner's difference from the average. Runner 1 is 5 seconds faster and runner 2 is 5 seconds slower. Compare the displayed signs with the wording.

**Hard:** Report which runners tie for the fastest time. For 52.5, 52.5, 55, and 55, identify runners 1 and 2.

**Success criteria:** Runners 3 and 4 in the first sample are exactly at the average and have a zero difference.`,
	"PS4-Joes-Donuts-Opening-Day": `Run with customer positions 1, 12, 13, 144, 200, 201, 500, and 501. Identify the separate first-customer and year-round offers.

**Normal:** Add a count of the offers printed. Positions 1 and 144 have 3 and 2 offers, respectively.

**Hard:** Print a numbered receipt with the actual offers received. For position 501, show the third-donut offer and the year-round deal in that order.

**Success criteria:** The month of free donuts for position 144 replaces the $1 dozen offer. Position 0 produces an input message with no receipt.`,
	"PS4-Number-Guesser": `Set the existing target to 27 for a repeatable trial. Enter 20, 30, and 27 to observe both feedback directions and the attempt count.

**Normal:** Print the absolute distance from the target after each incorrect guess. The two distances are 7 and 3.

**Hard:** Add a maximum of three valid guesses. After three misses, report the target and stop. A correct third guess still wins.

**Success criteria:** The fixed-target trials pass before random selection is restored. The program chooses one target per game.`,
	"PS4-Debugging-Conditionals": `Run the corrected program with 249, 250, 255, and 256 tickets. The matching T-shirts first become affordable at 256.

**Normal:** Print the additional tickets needed for matching shirts when the balance is below 256. At 255, one additional ticket is needed.

**Hard:** Ask how many tickets the friend needs and compute the new boundary. When the friend needs 10 tickets, 259 is short by one and 260 succeeds.

**Success criteria:** The independent prize messages still include all items the ticket balance can cover. At 350 all four individual purchases are available.`,

	"PS5-Functions-Practice": `Run the completed helpers and connect each call to the value it returns. Compare factorial of 4 with exponent of 2 to the third power. The loops multiply a different sequence of values.

**Normal:** Print a short calculation table for factorial of 0, 1, and 4 and powers of 2 with exponents 0, 1, and 3.

**Hard:** Add a combinations helper for choosing two objects. For n objects, compute n * (n - 1) / 2 when n is at least 2. Use the existing arithmetic helpers where they fit.

**Success criteria:** Inputs 2 and 5 return 1 and 10 possible pairs. For 0 or 1 object the count is 0.`,
	"PS5-Parameter-Tracing": `Run all seven calls and map their arguments to the parameters. Compare traces 1 and 3. The same three input values are rearranged and produce 5 and 17.

**Normal:** Add an output label for temp and the local value of c in function1. For function1(1, 2, 3), those values are 3 and 3 before the return of 5.

**Hard:** Add a predicted and observed comparison for function2(2, 3, -4). Track the inner call as function1(-4, 3, 2).

**Success criteria:** The inner call returns 7 and the outer call returns 13. Keep the other seven results intact.`,
	"PS5-Coin-Flipper": `Run the completed 1000-flip simulation twice. Compare the returned heads and tails labels, the two counts, and their percentages. Each flip changes exactly one count.

**Normal:** Add a line showing which side had more flips and by how many. A fixed count of 520 heads and 480 tails gives heads by 40. Equal counts give a tie.

**Hard:** Move the tally loop into a function with a positive trial count. Reject a nonpositive count before computing percentages.

**Success criteria:** With four fixed results of heads, tails, heads, tails, the result is a tie and both percentages are 50.`,
	"PS5-Dice-Roller": `Run the complete simulation once and trace how two six-sided dice update one of the eleven counters. The sum 7 has more possible pairs than 2 or 12.

**Normal:** Print the total count and the percentage on each row. Check that 2 and 12 each count one occurrence in the four-pair sample 1/1, 1/6, 2/5, 6/6.

**Hard:** Compare the observed percentage for 7 with its six equally likely pairs out of 36. Print the absolute difference in percentage points.

**Success criteria:** The four-pair sample reports 50% for 7 and a difference of about 33.3 percentage points.`,
	"PS5-Squawka-Zilly-Floog": `Run all three helpers at 4. Trace how the two results 9 and 4 are combined into 30, and identify which helper returns each intermediate value.

**Normal:** Print a second labeled row for x = 0 with results 1, 12, and 38.

**Hard:** Add a range of x values from -2 through 2. Print each row with both intermediate results, then report the smallest squawka value and its input.

**Success criteria:** The row for x = 2 has values 5, 4, and 22. Among those five rows, 22 is the minimum.`,
	"PS5 Supplemental Project 2: Word Translator": `Run the translator with Cat and a. The returned values are atCay and aay. Trace the first character, the remaining characters, and the suffix.

**Normal:** Print the length before and after translation. For Cat the displayed lengths are 3 and 5. An empty input keeps the existing message.

**Hard:** Add a reverse mode for valid translated words. Remove the final ay and move the last remaining character to the front. Report an error when the suffix or the preceding letter is missing.

**Success criteria:** Reverse atCay to Cat and aay to a.`,
	"PS5-Number-Games": `Run the predicates for 1 through 50. Compare the two odd-number lists and the two multiple-of-14 lists. These comparisons check that the composed helpers reuse the smaller predicates correctly.

**Normal:** Accept a single integer and report its classification. For 28, report even and a multiple of 7 and 14.

**Hard:** Limit prime trials to divisors whose squares are at most the candidate. Keep the early check for values below 2. Compare the prime outputs from 1 through 50 before and after the change.

**Success criteria:** Both programs list the same primes. The shorter check still handles 0, 1, 2, 47, and 49.`,
	"PS5-Debugging-Functions": `Run the corrected game with target 27 and guesses 20, 30, and 27. Trace how the guess reaches the comparison function and how its Boolean result controls the loop.

**Normal:** Pass the last guess to the score function along with the count. The sample summary should display 27 and three guesses.

**Hard:** Add a replay prompt and start a fresh round when the response is yes. Choose the target once per round and reset the guess count.

**Success criteria:** A first-try success in the replay reports one guess even when the earlier round took three guesses.`,
	"PS6-Lists-Practice-1": `Run with cat and compare the descending values, the three characters, the filtered squares, and the factorials. Locate the functions that read a list without changing its contents.

**Normal:** Print the number of squares before and after filtering. The counts should be 100 and 90.

**Hard:** Add a summary for any nonempty numerical list with the sum, maximum, and mean. Return an explicit empty result if no values are present.

**Success criteria:** The list [-8, -3, -10] gives sum -21, maximum -3, and mean -7. The input list stays intact.`,
	"PS6-Build-a-Song": `Render the original phrase and listen to its pitches and rest in order. Read the pitch and duration from each pair. Save the first version with Download WAV.

**Normal:** Change the first note from a quarter to a half note and render again. Listen for the longer first note.

**Hard:** Render the same sequence at 90 and 120 beats per minute to two differently named files. Keep every pair in the same position and compare the output durations.

**Success criteria:** The slower file is longer. Both files keep the same pitch order and contain the pause where the rest is written.`,
	"PS6-Song-Generator": `Enter C4 with duration 4, r with duration 8, and e4 with duration 2. Render and download the result. Locate the three pairs and trace how their order produces the heard sequence.

**Normal:** Print the number of pairs and the number of rests before rendering.

**Hard:** Offer an option to reverse the entire sequence before rendering. Keep each pitch attached to its duration.

**Success criteria:** The original reports three pairs and one rest. The reversed version begins with the longer E, keeps a rest in the middle, and finishes with the shorter C.`,
	"PS7-Birthday-Converter": `Run a February 29th example in 2024 and 2023. Trace the difference between parsing the same month and day and checking the year. Compare the output for the 12th and the 22nd.

**Normal:** Display the month number beside the formatted result.

**Hard:** Add a second valid output in year-month-day order using four digits for the year and two each for month and day.

**Success criteria:** February 29th, 2024 also displays 2024-02-29. An invalid date reports the error without formatting either result.`,
	"PS7-Coffee-Shop": `Run the menu and trace how the name and price at the same position become a key-value pair. Compare the output for Coffee and Vanilla Latte, including the decimal places.

**Normal:** Print the items under $3.00. Expect Coffee, Decaf, and Iced Coffee.

**Hard:** Use a nested dictionary to add small and large prices. Keep the original price as small and add $1.00 for large.

**Success criteria:** Large Coffee is $3.50 and large Vanilla Latte is $5.00. Small prices still match the original list.`,
	"PS7-Dictionary-Indexing": `Trace how the completed program obtains seven. The l2 key leads to a list. Index 1 leads to a dictionary, and the d5 key returns the word.

**Normal:** Add a short trace for the lookup that returns five. Identify both tuple indexes after the first tuple lookup.

**Hard:** Add the word nine at the end of a new nested path with a list and a dictionary. Include its trace and keep the original eight lookups.

**Success criteria:** The original eight words stay in order. The new trace returns nine and explains every container accessed.`,
	"PS7-Debugging-Dictionaries": `Run the repaired inventory and compare the original total of 42 with the final 35. Locate the dictionary update that clears Wafer bar and the default lookup that creates Mint.

**Normal:** Print the total after removing one of each candy but before applying the trade. This total is 36.

**Hard:** Add two Mint pieces to the starting inventory and show how the update preserves the remaining mint count when four are added.

**Success criteria:** The original example still finishes at 35. The edited inventory finishes with five Mint pieces, and no count becomes negative.`,
	"PS7-Song-Generator-2": `Enter c4 with quarter, r with eighth, and e4 with half. Trace the lookup for each duration. Compare the printed pairs with the order of the downloaded sounds.

**Normal:** Add alternate labels for the four durations to the dictionary. A label such as 1/4 should still map to 4.

**Hard:** Print each duration's contribution to the overall length at 120 beats per minute. Track the rests along with the pitched notes.

**Success criteria:** The three pairs render in order. The note lengths are half a second, a quarter second, and one second, before spacing. An unknown label adds no pair.`,
	"PS8-Morse-Code": `**Method** Translate each letter with the dictionary and use a slash between words. Reverse the dictionary to recover the words from the codes.

**Worked example** Encode A I with e, then decode .- / .. with d. Both paths produce 15 units of audio. The slash contributes seven quiet units.

**Normal:** Print a line that shows the symbol groups and timing totals for each word.

**Hard:** Allow the playback speed to change while preserving the same dot, dash, and gap proportions.

**Success criteria:** The translation round trip preserves A I. Slower playback takes longer with the same ordering, and an invalid symbol stops translation with a clear message.`,
	"PS6-Stock-Trader": `Use the fixed lists to check the summary. The last GOOGL value is 1122.00. Compare a list with several prices, a one-item list, and an empty list.

**Normal:** Add each history's length to the result. A history of 10, 20, and 30 gives three prices.

**Hard:** Report the difference between the first and last item. Handle an empty history before doing arithmetic.

**Success criteria:** The three-value sample gives latest 30.00, mean 20.00, and change 20.00. With one price the change is 0.00. An empty history reports no prices.`,
	"PS6-Debugging-Lists": `Run the complete survey with chocolate mudslide, vanilla, pistachio, CHOCOLATE MUDSLIDE, and strawberry. Trace the append step and the comparisons that produce counts of two and one.

**Normal:** Print how many submitted flavors match neither of the two tracked flavors. The sample gives two.

**Hard:** Use a dictionary to count all normalized flavors. Print the counts after displaying the five original entries.

**Success criteria:** The count for chocolate mudslide remains two after surrounding spaces are added. The counts sum to five, and the original order is available.`,
	"PS6-Tower-of-Terror": `Enter the fictional sample 80, 120, and q. Verify the two entries, total 200, and average 100. Then try q first to see the empty result.

**Normal:** Report the smallest and largest recorded weights for a nonempty list. The first sample gives 80 and 120.

**Hard:** Compute an optional second average after excluding one largest entry. Keep the original list and summary. For 80, 120, 160, the reduced average is 100.

**Success criteria:** The new average is unavailable for an empty list or a list with only one entry.`,
	"PS6-Basketball-Stars": `Enter five rows of fictional statistics. Use [10, 10, 9] for one player and [10, 10, 10] for another. Only the second row meets all three thresholds.

**Normal:** Print the qualifying player's points, rebounds, and assists beside the name or number in the result. Leave the original row unchanged.

**Hard:** Count how many categories each player has at 10 or above. For [11, 9, 10], show two qualifying categories.

**Success criteria:** The summary distinguishes players meeting all three thresholds from rows meeting only one or two.`,
	"PS6-Dog-Breeds": `Run the list and compare the letters and lengths for beagle, greyhound, and pug. Each name is processed separately with the same loop.

**Normal:** Add a filter that displays names of five or more letters and reports how many matched. Expect six in the original list.

**Hard:** Accept a letter and a minimum length. Show all names meeting both conditions. Use the existing first-letter and length calculations.

**Success criteria:** With p and a minimum of 3, the result is pug. Raising the minimum to 4 gives a clear empty result.`,
	"PS6-Card-Shuffler": `Run with the four supplied swap counts. Compare how the order changes while the list length and the four copies of each rank remain stable.

**Normal:** Print how many positions differ from the sorted deck after each run. Test 0 swaps and a fixed swap of positions 0 and 4.

**Hard:** Compare two 50-swap trials with a shared random seed set before each trial. Then change the seed and compare the order.

**Success criteria:** Zero swaps changes zero positions. The fixed swap changes two positions. Every run still has all 52 cards.`,
	"PS7-Dictionaries-Practice": `Run the reference with Banana and trace the dictionary each time another a is seen. Verify that the program adds to the previous value for that key.

**Normal:** Print one row per letter in alphabetical order, then print the total. Banana gives a: 3, b: 1, n: 2, and a total of 6.

**Hard:** Find the most frequent letter and report all ties. Use A b, b a to check that both a and b have two occurrences.

**Success criteria:** Case and punctuation leave the totals unchanged. An input without letters produces a clear empty result.`,
	"PS7-Test-Scores": `Use ari and bea with scores 80 and 100 on the first test, then 90 and 70 on the second. Follow each appended score to the correct name. Both final averages are 85.

**Normal:** Print the names tied for highest average. Keep both names when they share the same score.

**Hard:** Compute an average for each test across the score lists. The two test averages in the sample are 90 and 80.

**Success criteria:** The two summaries use different dimensions and show them clearly. A run with zero tests finishes without an average.`,
	"PS9-Sets-Practice": `Compare two sets using the fixed sample {1, 2, 3, 4, 5} and {4, 5, 6, 7, 8}. Confirm the union and intersection before switching back to random samples.

**Normal:** Display the values exclusive to each set. The first has 1, 2, 3 and the second has 6, 7, 8.

**Hard:** Add a helper that checks which supplied words share at least two distinct letters with a target. With Band and the candidates apple, blank, ox, return only blank.

**Success criteria:** Different case and repeated letters do not inflate the overlap. Both original sets remain available.`,
	"PS9-Wheel-of-Fortune": `Run the console puzzle and guess r. Both matching positions in programming appear. Try r again and confirm that the number of guesses stays the same.

**Normal:** Report the distinct incorrect guesses beside the displayed puzzle. In p, x, x, 1, r, only x is an incorrect valid guess.

**Hard:** Add a puzzle menu with three original sample words and reset the attempts when opening another puzzle.

**Success criteria:** The sample sequence uses three valid guesses. Starting another round restores fifteen guesses and a blank mask for that word.`,
	"PS9-Class-Registration-II": `Run the ordered registration sample. Read the enrollments and waiting lists for the three classes. Repeated names in the original sequence appear once in the output.

**Normal:** Print the size of both lists. Design has six enrolled and two waiting.

**Hard:** Accept a different capacity for each class. Set Design to four places and keep the other samples at six. Preserve the order of names within each list.

**Success criteria:** Design enrolls Ari, Bea, Cleo, and Dara. Eli, Fay, Gus, and Hana wait in that order.`,
	"PS9-Favorite-Foods": `Give five entries for each group, including repeated names. Use pear, apple, rice, pear, apple for Group A and pear, rice, pasta, rice, pasta for Group B.

**Normal:** Print the union of both sets in addition to the three existing comparisons. Expect apple, pasta, pear, and rice.

**Hard:** Add a third group and report foods shared by all three. Use five entries containing only pear and apple for the third group.

**Success criteria:** The three-way intersection contains pear. It stays the same if a food is repeated or entered in uppercase.`,
	"PS10-Todo-List": `**Method** Check that the displayed position is between 1 and the task count. Subtract 1 to obtain its list index, then remove the task at that index.

**Worked example** Add read, stretch, and read. Position 3 maps to index 2. Removing index 2 leaves read and stretch in order. Remove by position so a task with the same name at another index stays in the list.

**Normal:** Add a command to rename a task at a displayed position. Renaming position 2 to walk keeps it second.

**Hard:** Add a command to move a task to another displayed position. Moving the second task to the first position preserves both names.

**Success criteria:** Invalid positions leave the order intact. The same checks pass when two tasks have the same name.`,
	"PS10-Field-Day": `Enter ten fictional names with all four choices represented. Trace one person choosing both through the two event lists. Verify that the participants choosing neither are retained separately.

**Normal:** Print how many names are in each roster. For the supplied sample, the two events each have five names and neither has two.

**Hard:** Accept one corrected choice for a name already recorded. Update the stored choice and rebuild the lists from the same data.

**Success criteria:** Changing cleo from both to neither reverses both event memberships with one update. The total number of participants stays at ten.`,
	"PS10-Field-Day-II": `Run the ten-name example and read the counts after each assignment round. The unassigned counts are 8, 6, 4, 2, and 0. Check that the original roster is still available.

**Normal:** Add team sizes to every round output. For a three-name sample, the final sizes are two and one.

**Hard:** Add a three-team option by rotating through three lists. For ten names, the sizes should be four, three, and three.

**Success criteria:** Every unique name occurs on exactly one team. An empty roster produces only empty teams.`,
	"PS3-Password-Cracker": `Run the completed puzzle and find the rows for shifts 0, 3, and 25. Link the shift 3 row to the uppercase offset, lowercase offset, and punctuation branch in decode.

**Normal:** Add a second fixed sample starting with C. At shift 3 its first letter should become Z.

**Hard:** Rank each candidate by the number of whole words it shares with a short list supplied for the puzzle. Use blue and comet in the list.

**Success criteria:** The original sample's shift 3 candidate ranks first. All 26 numbered candidates remain available for inspection.`,
	"PS12-Type-Racer": `Choose p for a fixed target and enter Rain taps on the glass without its period. Then enter it with the period. Trace one start reading, two attempts, and one end reading.

**Normal:** Report elapsed time and the number of attempts with a single result line.

**Hard:** Add words per minute based on the target's word count. Display a clear message if the two clock readings are equal.

**Success criteria:** A five-word target entered in six seconds gives 50 words per minute. A mismatch keeps the original start reading, and :quit leaves no result.`,
	"PS13-Advanced-Typewriter-Monkeys": `Open valid_words.txt and run practice searches at lengths 3 and 4. Trace the sequence xcatmint one letter at a time. The matches are cat at letter 4 and mint at letter 8.

**Normal:** Show each full window during practice mode. At length 3, xca appears immediately before cat.

**Hard:** Run a small batch of random searches. Measure the success rate and average generated letters for each length, including runs that reach the limit.

**Success criteria:** Practice results stay reproducible, and every random search ends within 20,000 letters.`,
	"PS11-Bank-Account": `**Method** Check that the withdrawal is positive and within the signed-in account's balance before subtracting it.

**Worked example** Deposit 20 into ari using demo-ari, then withdraw 7. A withdrawal of 14 is rejected and leaves 13. Switch to bea using demo-bea to verify that account still has 0.

**Normal:** List each successful transaction and the balance after it.

**Hard:** Keep separate histories by account and show the signed-in account's history on demand.

**Success criteria:** Ari's history shows the two successful transactions. The rejected withdrawal adds no entry, and Bea's history is empty.`,
	"PS11-Calculator": `Run 12 / 3, 12 / 0, and 0!. Trace when the menu calls a helper, when it has a value to report, and when it shows an error.

**Normal:** Keep a count of successful calculations. A divide-by-zero error leaves the count at one after a single successful operation.

**Hard:** Store each successful expression and result, and add a command that prints the history in order.

**Success criteria:** The history shows 12 / 3 = 4.0 and 0! = 1. An invalid operator or failed calculation leaves the history unchanged.`,
	"PS14-Simple-Blackjack": `**Method** Compare the two hand totals after the dealer stops. A hand above 21 busts before comparing totals.

**Worked example** Start practice with 10 and 7, then stay. The dealer draws 3 on a total of 15 and wins with 18.

**Normal:** Show the gap between the player's current total and 21 after a draw.

**Hard:** Count wins, losses, and ties across rounds and display the running summary.

**Success criteria:** A bust counts as one loss. A fresh round clears the hands and keeps the summary. Quitting during a round adds no result.`,
	"PS14-Advanced-Blackjack": `**Method** Count every ace as one first. Add ten if an ace is present and the new total stays within 21.

**Worked example** Run practice and hit twice. The player's best totals are 17, 15 and 19. Stay to see the dealer finish at 18.

**Normal:** Display both the low-ace total and the best total.

**Hard:** Track opening totals of 21 separately from later totals of 21.

**Success criteria:** Two opening totals of 21 tie. Ace and 6 gives 17 while Ace, 6 and 8 gives 15.`,
	"PS14-Game-of-War": `Run the ten fixed draws using Ari and Bea. Find an example of each branch. Round 1 belongs to Ari, Round 2 belongs to Bea, and Round 3 ties.

**Normal:** Print the running counts after each round.

**Hard:** Add ten practice draws that give each player three wins and leave four tied rounds. Reverse the draw order and verify the final counts stay the same.

**Success criteria:** The counts sum to the current round number. The original example ends 4, 3, and 3. The second set prints an overall tie.`,
	"PS14-Mastermind": `Run practice mode. Compare 2230 and 2222 against 2032. Both have two exact matches. Only the first has misplaced matches because each signal digit can be matched once.

**Normal:** Print the exact positions after each valid trial. Number the positions from one.

**Hard:** Track the valid trial with the most exact matches. Break ties by the number of misplaced matches, then keep the earlier trial.

**Success criteria:** After 2222 and 2230, the best trial is 2230. A hint and malformed input leave it unchanged.`,
	"PS-Check-in-1": `Run the completed animal and color program with dog and black, then cat and black. Compare the combined and nested decisions. Both versions should agree for both inputs.

**Normal:** Print the number of correct guesses before the result. Dog and black should report two matches. Cat and black should report one.

**Hard:** Put the result into a repeatable round. Read a new animal and color after each round until a quit response. Keep the counters local to each round.

**Success criteria:** A partial match after a correct round still reports one match. A short color entry produces an informative message and the next round can run.`,
	"PS-Check-in-1/practice": `Run both shifters with Az! and compare Zy! with By!. Track the original index and the decision about direction. Punctuation occupies an index and remains unchanged.

**Normal:** Print the direction and output for each letter in the index rule. The first two rows should report A forward to B and z backward to y.

**Hard:** Add a reverse mode that uses the opposite direction for the selected rule. Run the index rule on Az!, then reverse By! to recover Az!.

**Success criteria:** Reversing the length-rule output Zy! also recovers Az!. The punctuation remains present through both transformations.`,
	"PS-Check-in-2": `Run the complete review once. Record the final guests, the size of the random digit-count dictionary, and the two ingredient sets. The list retains order, the dictionary connects numbers with digit counts, and the sets reveal overlaps.

**Normal:** Add a line with the number of entries in the digit-count dictionary. Run twice to verify the count is 15 even when the keys change.

**Hard:** Count how many keys have one, two, three, and four digits. Compare each bucket with the existing dictionary before adding a new random sample.

**Success criteria:** All bucket counts add to 15. The key 1000 is the only possible four-digit key in this exercise.`,
	"PS-Check-in-2/practice": `Run the letter counter with Banana, banana! and the word counter with Red,blue red. Check that case and punctuation handling produce three unique letters, then two unique words out of three.

**Normal:** Print the most frequent word and its count. Red,blue red should identify red twice.

**Hard:** List every word tied for the highest count in alphabetical order. Red blue red blue should report blue and red with two occurrences each.

**Success criteria:** A punctuation-only paragraph produces zero words and a clear empty result. Punctuation can separate adjacent words without entering either word.`
};

const classroomModules = copyClassroomCourseModules(pythonLevel2Course.modules);
for (const module of classroomModules) {
	for (const item of [...module.curriculum, ...module.supplementalProjects]) {
		const folder = item.solutionLink?.match(
			/\/tree\/[^/]+\/(.+)\/solution$/
		)?.[1];
		const content =
			classroomProjectExtensions[item.title] ??
			(folder && classroomProjectExtensions[folder]);
		if (content) {
			item.content = content;
			item.contentKind = "assignment";
			item.preserveInstructions = true;
		}
	}
}

export const pythonLevel2ClassroomCourse: RawCourse = {
	name: "Python Level 2: Classroom Edition",
	modules: [classroomLaunchModule, ...classroomModules]
};
