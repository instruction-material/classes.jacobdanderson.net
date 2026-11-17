# Trace a for loop from its first check to its last update

A `for` loop combines initialization, a continuation condition and an update. Its body runs only after the condition succeeds.

## Worked counting program

```javascript
for (let number = 1; number <= 4; number += 1) {
	console.log(number);
}
console.log("finished");
```

The output is 1, 2, 3, 4, then `finished`. Initialization runs once. Each successful condition check leads to the body, then the update, then another condition check.

- At 1, the condition is true: print 1, then update to 2.
- At 4, the condition is true: print 4, then update to 5.
- At 5, the condition is false: skip the body and leave the loop.

The loop makes five condition checks but only four body executions. The declared counter belongs to the loop's scope; use a separately declared variable if a later statement needs a retained result.

## Change one boundary

Replacing `<= 4` with `< 4` removes the final 4, giving three body executions. A countdown needs a matching starting value, condition and update:

```javascript
for (let number = 4; number >= 1; number -= 1) {
	console.log(number);
}
```

This prints 4, 3, 2, 1. The next value is zero, where the condition fails. Increasing the counter in this countdown would move it away from its stopping condition.

For even numbers from 2 through 10, start at 2, keep `number <= 10` and add 2 each time. That gives five outputs. Choose the starting value and increment from the requested sequence rather than adjusting them until a few samples look right.

The supplied project workspaces provide `printToScreen` for page output; the worked programs use `console.log` so their state can be inspected directly. Predict the first value, final printed value and body count before implementing the assigned ranges. A missing or wrong update can keep a condition true indefinitely, so trace it before running the loop.

References: [loops and iteration](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Loops_and_iteration), [for statement](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for).
