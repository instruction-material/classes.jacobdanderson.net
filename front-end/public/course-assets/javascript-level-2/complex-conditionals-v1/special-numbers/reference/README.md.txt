# Special Numbers

Write boolean predicates for positive integers, then scan inclusive ranges. `isSelfDividing(n)` is true when every decimal digit divides n. Extract a digit with n%10 and shorten a working copy with floor(n/10). A zero digit makes the predicate false. 128 is true; 102, 0, negative values, and fractions are false.

## Divisors and perfect numbers

`isPerfect(n)` adds positive proper divisors from 1 through n−1. For 28, the divisors are 1, 2, 4, 7, and 14, whose sum is 28. `isPerfect2(n)` is the efficient version used for range scans. Begin the sum at 1 for n>1; find factor pairs from 2 through floor(sqrt(n)). Add the partner only when it differs from the current factor. The original efficient reference counted a square root twice. For 36 the proper-divisor sum is 55, not 61. Both versions reject 1 and return the same boolean for small traced inputs.

## Palindromes

`isPalindrome(n)` is true when the digits read the same in either direction. Keep the original half-reversal approach: move a final digit into a reversed half, shorten the remaining half, and compare before and after shortening to cover odd and even digit counts. 121, 22, and 11011 are true; 120 and 123 are false. Zero is outside this exercise's positive-integer domain. No predicate should accidentally accept zero or negatives by skipping its loop.

## Original scans and custom ranges

Print all self-dividing numbers from 300 through 700, all perfect numbers from 1 through 9000, and all palindrome numbers from 700 through 2000. Endpoints are included. The perfect-number output is 6, 28, 496, 8128. Check each printed value with its predicate and also check neighboring values that were omitted.

`matchingNumbers(kind,start,end)` returns an array for kind self-dividing, perfect, or palindrome. Use positive ordered whole-number bounds, at most 10,000 candidates, and an end at or below 100,000. Predicates classify positive whole numbers through 100,000 and return false outside that domain. The page begins with the three original scans; its form runs a selected custom range and shows all three classifications for one number. Compare direct and efficient perfect-number methods on a small range before using the efficient method for the full scan.

## Open and work with the source

Confirm the selected starter or reference import in the site IDE. The original starter and reference remain separate roles. The Ternary Operators starter already runs; convert its conditional bodies. The other starters retain their unfinished exercise and the function contracts needed by the local controls. Edit script.js, save the same attempt, and reopen it before continuing. `README.md` contains the full brief. Export the complete ZIP, extract every file, and open index.html. It works without a server, installation, or network connection.

support.js connects labeled controls to the exercise functions and prints results with the bundled D3 version. Keep calculations and decisions in script.js. `SOURCES.md` records the original editor panels, declared dependencies, and deliberate corrections. Read the reference after an independent attempt; retain explanations and trace notes alongside the saved code.

## Verify the result

Predict a true case, a false case, and an exact boundary before running. Compare expected return values with displayed output. Rejected input must preserve the last valid result. Check keyboard controls, a narrow screen, 200% zoom, and reduced motion. Save a visible code edit, reopen the same project, export all companion files, and repeat the checks in the extracted page.
