# Choose a branch from an explicit rule

An `if` statement checks a condition and runs a block when that condition is truthy. An optional `else` block handles the other outcome. Braces group the statements belonging to each branch.

## Worked decision chain

This fictional label example assumes a finite numeric score between 0 and 100.

```javascript
const score = 82;
let label;
if (score >= 90) {
	label = "high";
} else if (score >= 80) {
	label = "middle";
} else {
	label = "review";
}
console.log(label);
```

The first condition is false and the second is true, so the result is `middle`. After choosing a branch, this chain skips its remaining alternatives.

| Score | Selected result     |
| ----- | ------------------- |
| 90    | high: score >= 90   |
| 89    | middle: score >= 80 |
| 80    | middle: score >= 80 |
| 79    | review: final else  |

The order matters. Putting the broad `score >= 80` branch first would also consume scores of 90 and above. Separate independent if statements can execute more than one block; use one chain when exactly one label should be selected. Validate real input before applying a rule whose domain assumes a number in range.

For finite numbers, `<` means less than, `>` greater than, `<=` at most and `>=` at least. Equality at a boundary is included only by the operators containing `=`.

## Compare values and transform text

```javascript
console.log(3 === 3, "3" === 3, "3" !== 3);
const word = "PeAr";
console.log(word.toLowerCase(), word.toUpperCase());
const name = "River";
console.log(`Hello ${name}!`);
```

The lines print `true false true`, `pear PEAR` and `Hello River!`. Strict equality compares without converting the string into a number. A single `=` assigns; it does not ask an equality question. The case-conversion methods return strings, and the template literal inserts the named value into its surrounding text.

Compare a canceled prompt with null before applying a string method. Decide whether a project's comparisons are case-sensitive before normalizing its input; the supplied original exercises state their own rules. For a contains-a exercise, an empty string has no characters to inspect, while a one-letter string has only index zero. Predict the result before running each boundary.

References: [if/else](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/if...else), [JavaScript expressions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Expressions_and_operators).
