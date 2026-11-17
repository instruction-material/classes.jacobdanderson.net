# Calculate a result and a bounded random integer

An expression produces a value. Assignment stores a value in a binding. Evaluate the right side of `total += 2` using the old total, then store the new total.

## Worked arithmetic

```javascript
const quantity = 3;
const unitPoints = 4;
console.log(quantity * unitPoints + 2);
console.log(quantity * (unitPoints + 2));
console.log(17 % 5);
console.log(Math.floor(3.8), Math.ceil(3.2));
console.log(Math.floor(-1.2), Math.ceil(-1.2));
```

The outputs are `14`, `18`, `2`, `3 4` and `-2 -1`. Multiplication groups before addition; parentheses change the grouping. The remainder operator `%` reports what remains after division. For these positive whole inputs, 17 is three groups of five with two left over.

`Math.floor` moves toward negative infinity, while `Math.ceil` moves toward positive infinity. Floor therefore changes -1.2 to -2. `Math.pow(6, 8)` or `6 ** 8` raises six to its eighth power. `Math.PI` supplies an approximation of pi.

## Worked random-range transformation

For the small whole-number bounds in these projects, a value r in [0,1) becomes an inclusive integer from min through max with `Math.floor(r * (max - min + 1)) + min`.

```javascript
const min = 5;
const max = 7;
const r = 0.6;
const result = Math.floor(r * (max - min + 1)) + min;
console.log(result);
```

There are three choices. Scaling gives 1.8, floor gives 1, and adding five gives `6`. With r=0 the result is 5; with r=0.999 the result is 7. Omitting the `+ 1` from the range width makes 7 unreachable in this example. These formulas use the course's small bounds; arbitrary large floating-point bounds need separate precision analysis.

Replace r with `Math.random()` after tracing the fixed cases. Random samples can illustrate the result, while fixed inputs check its endpoints directly. `Math.random` is pseudo-random and is unsuitable for account-password generation.

Keep conversion separate from arithmetic: `Number("3")` is 3, while `Number("three")` is NaN, the not-a-number value. `Number.isFinite` checks that an already converted value is finite. Check empty and canceled input before converting it. Change the target range to 10 through 20 and calculate the outputs for r=0 and r=0.999.

References: [operator grouping](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Operator_precedence), [Math.random](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random), [Number conversion](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number).
