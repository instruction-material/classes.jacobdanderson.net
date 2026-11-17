# Use changing state to stop a while loop

A `while` loop checks its condition before every body execution. If the first check fails, the body runs zero times. Its changing state can be a counter, remaining amount or input position.

## Worked state reduction

```javascript
let amount = 10;
while (amount > 1) {
	console.log(amount);
	amount = Math.floor(amount / 2);
}
console.log("stop:", amount);
```

The body prints 10, 5 and 2. Their updates produce 5, 2 and 1. At 1, the next condition is false, so the last line prints `stop: 1`. The update belongs inside the body so it affects the following check.

Starting amount at 1 skips the body and prints `stop: 1` immediately. For this declared positive-whole-number example, repeated floor-halving reaches the stop. A different state rule needs its own termination argument; a loop can also leave through an explicit break when that behavior is intended.

## Worked backward string walk

```javascript
const word = "pear";
let index = word.length - 1;
let reversed = "";
while (index >= 0) {
	reversed += word[index];
	index -= 1;
}
console.log(reversed);
```

The first index is 3, selecting r. Successive accumulated strings are r, ra, rae and raep. Updating index from zero to -1 ends the loop. Starting at `word.length` would first read beyond the last valid index. Using `index > 0` would omit the character at index zero.

For a one-letter word, index begins at zero and the body runs once. For the empty string, index begins at -1 and the body never runs. These examples walk ordinary English letters; JavaScript string indexing uses UTF-16 units, which matters for some other characters.

A canceled prompt produces null rather than a string. Handle that input state before reading length or entering the string loop. The assigned string-reversal project compares the forward and backward walks; retain separate counters and predict each boundary.

References: [while statement](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/while), [loops](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Loops_and_iteration), [string length](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/length).
