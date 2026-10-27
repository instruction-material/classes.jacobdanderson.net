# Foray into Arrays

## Files and workflow

Open the selected starter in the site IDE after confirming its source. Read the TODOs in `script.js`, save a change, reopen the same attempt and export its complete ZIP. Extract the ZIP and open `index.html` in a browser; its scripts, styles, fonts and licenses are local. Save files and reload the browser after an edit. `README.md` contains this full reading and `SOURCES.md` identifies the original role and adaptations. The reference is available for comparison after an independent attempt.

Complete nine ordered-array exercises. Each index starts at zero; the last valid index is `array.length - 1`. An array can change even when its binding uses `const`: the binding stays attached to the same array.

## Build the sequence

1. Create an array containing three common household pets.
2. Call `pop()` to remove its final element. This changes the array and returns the removed value.
3. Add two more pets with `push(value)`. This changes the array and returns its new length.
4. Replace element 2 with a komodo dragon, then print the array. With the reference's choices it is dog, cat, komodo dragon and guinea pig.
5. Generate the squares of the integers 1 through 20: 1, 4, 9, continuing through 400. The instruction means twenty squared integers, rather than only square numbers whose values are at most 20. In a loop from `i = 1` through `i <= 20`, append `i * i`.
6. Create a new array containing the squares of 5 through 15. The original is ordered by its base integer, so base 5 is at index 4. `squares.slice(4, 15)` copies indices 4 through 14: eleven values, from 25 through 225. The end index is excluded and the source array remains unchanged.
7. Write `sumOfArray(arr)`: start a total at zero, visit every element, add it, then return the total after the loop. Print the sums of both square arrays. The expected results are 2870 and 1210. An empty array has sum zero.
8. Generate ten random integers from 11 through 15, including both endpoints. `Math.random()` is at least zero and less than one. Multiplying by 5, taking `Math.floor`, then adding 11 gives exactly those five possible integers.
9. Write `hasSameFirstAndLast(arr)`. For a nonempty array, compare element 0 with element `length - 1` using `===`. Return false for an empty array, which has no endpoints; a one-element array compares its only value with itself.

## Output and checks

The supplied `printToScreen(value)` uses local D3 to append readable text to the page. It formats arrays as JSON and leaves the original task's function name intact. Long arrays wrap at a narrow width. It does not consume random numbers, animate text or change task data.

Trace the pet array after each mutation. Check that the first square array still has twenty values after slicing and the second has eleven. Try endpoint arrays `[]`, `[7]`, `[7, 2, 7]` and `[7, 2]`. Check random length and bounds on several runs; different samples are allowed, and equality of the first and last values is not guaranteed.

[Array slice reference](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/slice).
