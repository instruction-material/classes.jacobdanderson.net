# Values, names and input

A variable name lets later statements refer to a stored value. Use `const` when its binding stays fixed and `let` when the program assigns a new value to that name. Strings hold text, numbers hold numeric values, and booleans are true or false. These types remain different even when their printed forms look similar.

## Worked value trace

```javascript
const snack = "mango";
let bowls = 2;
const shared = true;
console.log(snack, bowls, shared);
bowls += 1;
console.log(snack + " x " + bowls);
console.log(typeof bowls);
```

The lines print `mango 2 true`, `mango x 3` and `number`. The update changes bowls from 2 to 3. It leaves snack and shared alone. Quotes make `"2"` a string; `2` is a number. A `const` binding cannot be reassigned. When objects appear later, their contents can still change through a fixed binding.

After the declaration `let answer;` executes, answer is `undefined`. Reading a `let` name before its declaration instead raises a ReferenceError. `null` is an explicit absence value; compare it with `value === null`. JavaScript's historical `typeof null` result is `"object"`.

A line comment starts with `//`. A block comment starts with `/*` and ends with `*/`. Comments explain intent and are skipped during execution.

## Read input without confusing its states

```javascript
const response = prompt("Label");
console.log(response);
```

This browser example records exactly what the dialog returned:

| Dialog action                | Stored result         |
| ---------------------------- | --------------------- |
| Enter tea, then OK           | the string `"tea"`    |
| Leave the box empty, then OK | the empty string `""` |
| Choose Cancel                | `null`                |

An empty string and Cancel are separate states. A string can be indexed or measured; null needs to be handled before calling a string method. Later conditionals provide the branches for those decisions.

## Convert deliberately

```javascript
console.log("2" + "3");
console.log(Number("2") + Number("3"));
console.log("mango"[0], "mango".length);
```

The results are `23`, `5` and `m 5`. String indices start at zero, so the last index of this five-letter word is 4. The course's `printToScreen` helper puts output on the page; `console.log` writes to the developer console. `alert` displays a blocking dialog.

`Number("")` and `Number(null)` both produce zero. Neither result establishes that a quantity was entered. Keep the original input state separate from its conversion. Change the word to a one-letter word and predict its first index, last index and length before running.

## Debugging

Compare syntax errors, which prevent code from running, with logic errors, which run but produce the wrong result. Use console error messages, out-of-range string indexing, type-conversion mistakes, and the `debugger` keyword to inspect program state. The debugging habit is to change one thing, rerun, and verify what changed.

References: [let](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/let), [const](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/const), [prompt](https://developer.mozilla.org/en-US/docs/Web/API/Window/prompt), [Number conversion](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number).
