# Combine conditions and trace the part that executes

Boolean rules can be nested when one decision depends on another. Combining them with `&&` or `||` can make the same dependency clearer. Write the intended rule before choosing an operator.

## Worked compound rule

```javascript
const hasTicket = true;
const gatesOpen = false;
console.log(hasTicket && gatesOpen);
console.log(hasTicket || gatesOpen);
console.log(!gatesOpen);
```

The results are `false`, `true` and `true`. For boolean operands, AND needs both true and OR needs at least one true. NOT produces the opposite boolean interpretation. Parentheses make mixed rules explicit: `a || (b && c)` groups the AND expression first.

## Follow short-circuit evaluation

```javascript
const text = null;
console.log(text !== null && text.length > 0);
console.log(0 && "ready");
console.log("ready" && 7);
console.log("" || "untitled");
```

The outputs are `false`, `0`, `7` and `untitled`. The first expression stops when its null check is false, so it never reads text.length. AND returns its first falsy operand, or its last operand when all are truthy. OR returns its first truthy operand, or the final operand when none is truthy. Their results can therefore be strings or numbers.

Values such as false, zero, the empty string, null, undefined and NaN are falsy. The strings `"0"` and `"false"`, and even an empty array or object, are truthy. Strict equality to true is a separate test. A truthiness test alone cannot enforce a project's numeric range or required-text rule.

## Worked exact-case selection

```javascript
const animal = "bee";
let sound;
switch (animal) {
	case "cat":
		sound = "meow";
		break;
	case "bee":
		sound = "buzz";
		break;
	default:
		sound = "unknown";
}
console.log(sound);
```

The result is `buzz`. Switch uses strict equality to match a case. Break exits the switch; omitting it allows execution to continue into the following statements even if their case labels do not match. With `"Bee"`, the case-sensitive example reaches default.

## Worked nested decision

```javascript
const hasTicket = true;
const gatesOpen = false;
if (hasTicket) {
	if (gatesOpen) {
		console.log("enter");
	} else {
		console.log("wait");
	}
} else {
	console.log("get a ticket");
}
```

The outer condition succeeds and the inner condition fails, so the output is `wait`. With hasTicket false, the program prints `get a ticket` and skips the inner decision. With both values true, it prints `enter`. The inner else belongs to the nearest inner if; braces make each branch's owner visible.

For FizzBuzz, the combined divisibility rule must precede either individual rule so 15 is not consumed as Fizz alone. For the supplied message-rate exercise, a warning needs both the matching relationship level and a rate above that level's threshold. Trace the exact threshold and one value above it before changing the starter's operators.

References: [AND](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Logical_AND), [OR](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Logical_OR), [switch](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/switch).
