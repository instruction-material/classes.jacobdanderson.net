# Integrating Iterators

## Files and workflow

Open the selected starter in the site IDE after confirming its source. Read the TODOs in `script.js`, save a change, reopen the same attempt and export its complete ZIP. Extract the ZIP and open `index.html` in a browser; its scripts, styles, fonts and licenses are local. Save files and reload the browser after an edit. `README.md` contains this full reading and `SOURCES.md` identifies the original role and adaptations. The reference is available for comparison after an independent attempt.

Solve five iterator problems, choosing a method from the requested result. The source contains a small test driver after each function; its console output is also mirrored as readable page text. An unfinished starter can print `undefined` or an empty array until its TODOs are implemented.

## Transformation, mutation and selection

For problem 1, transform `[-1, 0, 8, 2, 6]` by adding 6 to every value and multiplying the result by 3. The answer is `[15, 18, 42, 24, 36]`; preserve the input. Implement the same rule three ways and compare results:

- `for (const value of arr)` visits values. Append each transformed value to a separate output array.
- `arr.forEach(callback)` runs the callback for each value. Push results into a separate array; returning from the callback does not return an array from `forEach`.
- `arr.map(value => (value + 6) * 3)` returns a new array from callback return values. Return that array from the enclosing function.

For problem 2, deliberately mutate the original array `[9, 1, 3, -10, 1092]` into its ones digits. The `forEach` callback receives value, index and the array. Assign back to `arr[index]`; assigning only the callback's value variable does not replace the stored element. The local reference uses `Math.abs(value) % 10`, so negative integers also yield a nonnegative digit. Expect `[9, 1, 3, 0, 2]`.

Problem 3 supplies an object containing two functions and one numeric property named `function`. Inspect its own values with `Object.values(obj)`, test `typeof value === "function"`, then call only those values. A property's name does not determine its type. The two supplied functions print their messages; the numeric property is skipped. Inherited properties are outside this task.

Problem 4 uses `reduce` to sum only even values. The accumulator starts at zero; add the current value when `value % 2 === 0`, otherwise return the unchanged accumulator. The sample total is 1018, including the negative even value -28. With initial value zero, an empty array returns zero.

Problem 5 uses `filter` to retain values divisible by the supplied divisor. Return the boolean condition `value % divisor === 0` from the callback. For divisor 3, the sample result is `[9, 3, 6, 0]`. The reference rejects a zero or non-integer divisor with a clear `RangeError`; a nonmatching valid divisor returns an empty array.

## Review

Record input, output and whether the source changed for each task. Try an empty array, duplicates, negative integers, zero and no matches. Return after completing an accumulation, rather than during the first iteration. Callbacks used by `map`, `filter` and `reduce` need return values with different purposes: a transformed element, a keep decision, and a new accumulator.

[Array reduce reference](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce).
