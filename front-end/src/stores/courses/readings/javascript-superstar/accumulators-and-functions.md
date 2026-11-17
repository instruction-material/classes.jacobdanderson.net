# Accumulate a result and name a reusable calculation

A counter records progress. An accumulator combines the values encountered so far. Choose its starting value from the operation: addition starts at zero; multiplication starts at one.

## Worked sum

```javascript
let total = 0;
for (let number = 1; number <= 4; number += 1) {
	total += number;
	console.log(number, total);
}
console.log("sum:", total);
```

The body prints `1 1`, `2 3`, `3 6` and `4 10`, followed by `sum: 10`. The accumulator is declared before the loop, so each update retains the previous total. Declaring total as zero inside the body would discard that earlier work on every iteration.

For squares, add `number * number` instead. The four added values are 1, 4, 9 and 16, totaling 30. Keep separate accumulator names, or deliberately reset one before starting a separate calculation.

## Worked reusable function

```javascript
function sumTo(limit) {
	let total = 0;
	for (let number = 1; number <= limit; number += 1) {
		total += number;
	}
	return total;
}
console.log(sumTo(4), sumTo(1), sumTo(0));
```

This prints `10 1 0`. The function declaration names the calculation; a call supplies an argument for its limit parameter. Each call creates a fresh local total. `return` sends the result to the caller and ends that function call. Logging a value displays it; logging alone does not return it.

The declared input contract here is a small nonnegative whole limit. For zero, the first condition is false and the starting zero is returned. The larger function and validation topics are developed in JavaScript Level 2.

## Change the operation

```javascript
function factorial(limit) {
	let product = 1;
	for (let factor = 1; factor <= limit; factor += 1) {
		product *= factor;
	}
	return product;
}
console.log(factorial(5), factorial(1), factorial(0));
```

The result is `120 1 1`. The last value follows the empty-product convention: no factors change the starting one. Starting product at zero would make every multiplication remain zero. The assigned Totaling Up project also checks sums through 100 and their squares; these should be 5050 and 338350. Check the permitted input and finite-result rules before using a prompted value as a loop bound.

References: [functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Functions), [loops](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Loops_and_iteration).
