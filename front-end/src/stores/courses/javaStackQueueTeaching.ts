import type { RawCourseModule, RawCourseModuleItem } from "./types";
import {
	javaStackQueueModuleID,
	javaStackQueueProjects,
	javaStackQueueURL
} from "@/modules/javaSearchResources";

const workflow = `Open the starter in the site IDE and confirm the import. Save the attempt before downloading the ZIP. The IDE's **Run** panel shows these Java 21 commands. Run them in the extracted project folder.

\`\`\`sh
javac --release 21 -Xlint:all -Werror Main.java ContractTests.java
java ContractTests
java Main
\`\`\`

The untouched starter compiles. The checker identifies an unfinished method until the implementation is ready.`;

function reading(title: string, content: string): RawCourseModuleItem {
	return {
		title,
		content,
		contentKind: "reading",
		preserveInstructions: true,
		preserveAssignment: true
	};
}

function assignment(
	title: string,
	pack: Parameters<typeof javaStackQueueURL>[0],
	content: string,
	checkpoints: string
): RawCourseModuleItem {
	return {
		title,
		content: `${content}\n\n${workflow}\n\n**Checkpoints**\n\n${checkpoints}`,
		contentKind: "assignment",
		preserveInstructions: true,
		preserveAssignment: true,
		ideImport: true,
		projectLink: javaStackQueueURL(pack, "starter"),
		solutionLink: javaStackQueueURL(pack, "solution")
	};
}

export function buildJavaStackQueueModule(): RawCourseModule {
	const [stack, queue, brackets, calculator, deque] = javaStackQueueProjects;

	return {
		id: javaStackQueueModuleID,
		title: "AJ12 Stacks and Queues",
		curriculum: [
			{
				...reading(
					"Stacks",
					`A stack uses last in, first out order (LIFO). Push adds a value at the top, pop removes and returns the top, and peek returns it without changing the stack. From an empty stack, pushing 7 then 11 makes 11 the first value returned by pop. The next pop returns 7.

For an array stack, size counts the stored values and is also the next free index. The occupied indices are 0 through size − 1. Push checks capacity, writes at size and increments it. Peek checks that size is positive and reads size − 1. Pop reads that same value and reduces size. Each step takes constant time. Checking boundaries before changing size leaves a full stack intact on overflow and an empty stack intact on underflow.

For a stack that grows, Java's ArrayDeque offers push, pop and peek on the same end. Its peek returns null on empty, and pop throws NoSuchElementException. ArrayDeque does not store null. Check an empty stack before choosing which operation to use.

Trace push(7), push(11), peek(), pop(), push(13), pop(), pop(). List the return values of the peeks and pops and track which array indices are occupied after each step.`
				),
				id: `${javaStackQueueModuleID}-curriculum-java-level-3-stacks`,
				aliases: [
					"stacks",
					`${javaStackQueueModuleID}-curriculum-stacks`
				]
			},
			assignment(
				"AJ12 Project 1: Implementing a Stack",
				stack.pack,
				`Complete push, pop and peek in Main.IntStack. Keep size between zero and the array length. On overflow, push throws IllegalStateException. On underflow, pop and peek throw NoSuchElementException. Capacity must be positive. A peek never changes size, and a valid push after a pop reuses the freed slot.`,
				`The sample prints 11, 11, 7 and 0 on separate lines. Test a capacity of one, a push to a full stack, and a pop from an empty stack. Explain whether size records the top occupied index or the next free index.`
			),
			reading(
				"Queues",
				`A queue uses first in, first out order (FIFO). Enqueue adds at the back. Dequeue removes and returns the oldest item at the front. Peek reads the front without removing it. A queue containing 10, 20 and 30 returns 10 first. A stack receiving those same values would pop 30 first.

A circular buffer keeps a fixed array, a front index and a count. With capacity 3, fill slots 0, 1 and 2 with 10, 20 and 30. Removing 10 moves front to 1 and leaves size 2. The next back index is (front + size) % capacity, which is 0. Storing 40 there yields physical slots [40, 20, 30] and logical order [20, 30, 40]. The count distinguishes empty from full even when the front and the next insertion index coincide. The array cells hold old values until they are overwritten. The live sequence is defined by front and size.

A double-ended queue, or deque, supports insertions and removals at both ends. To add at the front of a circular array, move backward with Math.floorMod(front − 1, capacity). A remainder expression can produce −1 when front is 0. To remove from the back, read the last occupied slot at logical offset size − 1 and decrease size. The front stays where it is.

For an application queue, Java's ArrayDeque supports addLast and removeFirst. Those operation names make the direction explicit. The peekFirst method returns null on empty. To trace a capacity-three queue, enqueue 10, 20 and 30, remove two, add 40 and 50, then drain it. Record the physical slots and logical order after each operation.`
			),
			assignment(
				"AJ12 Project 2: Implementing a Queue",
				queue.pack,
				`Complete enqueue, dequeue and peek in Main.IntQueue. Reuse array slots through wraparound and keep the live values in insertion order. Keep addition of two nonnegative indices safe before reducing modulo capacity. A full enqueue throws IllegalStateException. An empty dequeue or peek throws NoSuchElementException. Failed operations leave the queue unchanged.`,
				`The sample prints 10, 20, 30 and 40. Draw the array after enqueuing 40 and explain why it is read last. Try a capacity of one and run repeated fill and drain cycles. Check that a failed enqueue preserves the oldest item.`
			)
		],
		supplementalProjects: [
			assignment(
				"AJ12 Supplemental Project 1: Valid Parentheses",
				brackets.pack,
				`Implement isBalanced. Push each opener onto a character stack. For each closer, require a matching opener at the top, then consume it. Return true only when the complete input was read and the stack is empty. Empty input is valid. Reject null and characters outside the six bracket symbols.`,
				`The sample accepts {[()]} and rejects ([)], ] and ((). Trace the stack contents for ([)] at the first mismatch. Also check consecutive pairs, unfinished openers and deep nesting.`
			),
			assignment(
				"AJ12 Supplemental Project 2: Calculator with Stacks",
				calculator.pack,
				`Implement one token at a time. A signed decimal integer adds a value to the right end of an ArrayDeque. An operator adds, subtracts, multiplies, divides or takes a remainder of the last two values. Treat the top value as the right operand. Reject unknown tokens, missing operands and a zero right operand for division or remainder. On rejection, return false and preserve every value in the stack. Division uses Java integer truncation toward zero.`,
				`Given 12 3 − 2 *, the stack holds [18]. Next add 0 and attempt /. The operation returns false and the stack stays [18, 0]. Check a negative integer and a one-value input before trying an operator. Explain when to validate an operation so it can fail without losing operands.`
			),
			assignment(
				"AJ12 Supplemental Project 3: Implementing a Deque",
				deque.pack,
				`Complete add, read and remove at both ends of Main.IntDeque. Track a front index and size in a fixed-capacity circular array. Additions to a full deque throw IllegalStateException. Reads and removals from an empty deque throw NoSuchElementException. Keep the opposite end stable while updating the chosen end, and use Math.floorMod when wrapping backward.`,
				`The sample prints 30, 10, 20 and 1. Trace inserting 20 at the back, 10 at the front and 30 at the back. Check logical order and both end values. Test clearing through removal, adding again after emptying, and capacity one.`
			)
		]
	};
}
