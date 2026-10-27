# Department Store Discounts

Apply a student discount, then one mathematical price rule. The supplied rates are teaching data: none 0%, elementary 10%, middle 12%, high 14%, college 16%, and course program 20%.

## Predicates and helpers

`isPerfectSquare(n)` is true for a nonnegative whole number whose square root is a whole number, including 0 and 1. `isPrime(n)` is true only for whole numbers at least 2 with no divisor except 1 and themselves. The original reference incorrectly accepts 1, 0, negative values, and some fractions as prime. Test 0, 1, 2, 4, 9, 15, 17, and 15.3 before connecting price rules. Checking divisors through the square root is sufficient: a larger proper divisor would have a smaller partner.

`applyDiscount(price,percentDiscount)` returns price×(100−percentDiscount)/100 as a number. Format currency only when displaying the result. `increasePrice(price)` begins at ceil(price) and finds the first whole number that is prime or square. A fractional candidate is never prime. For 15.3 it returns 16; for 20 it returns 23. The original reference's fractional search could return an unchanged, nonqualifying price.

## Ordered calculation

1. Validate a listed category and a finite price from 0 to 1,000,000. Apply its rate once to obtain firstPrice.
2. Compute roundedPrice=floor(firstPrice). If that integer is prime or square, apply the same rate one more time to firstPrice.
3. Otherwise use increasePrice(firstPrice). Stop after this adjustment. Do not apply a third discount to a newly reached prime or square.

`calculatePrice(price,studentType)` returns `{originalPrice, discount, firstPrice, roundedPrice, finalPrice, adjustment}`. The page displays every stage. Its category tokens are none, elementary, middle, high, college, and program. Unknown categories and invalid prices are rejected; a rejected form preserves its last valid calculation.

## Hand checks

20 with program gives firstPrice 16, a square, then finalPrice 12.80. 25 with elementary gives firstPrice 22.50, roundedPrice 22, then finalPrice 23.00. 15.3 with none gives finalPrice 16.00. 10 with none gives 11.00. Check the floor boundary around a prime and around a square; compare the full firstPrice with the integer used only for the predicate.

## Open and work with the source

Confirm the selected starter or reference import in the site IDE. The original starter and reference remain separate roles. The Ternary Operators starter already runs; convert its conditional bodies. The other starters retain their unfinished exercise and the function contracts needed by the local controls. Edit script.js, save the same attempt, and reopen it before continuing. README.md contains the full brief. Export the complete ZIP, extract every file, and open index.html. It works without a server, installation, or network connection.

support.js connects labeled controls to the exercise functions and prints results with the bundled D3 version. Keep calculations and decisions in script.js. SOURCES.md records the original editor panels, declared dependencies, and deliberate corrections. Read the reference after an independent attempt; retain explanations and trace notes alongside the saved code.

## Verify the result

Predict a true case, a false case, and an exact boundary before running. Compare expected return values with displayed output. Rejected input must preserve the last valid result. Check keyboard controls, a narrow screen, 200% zoom, and reduced motion. Save a visible code edit, reopen the same project, export all companion files, and repeat the checks in the extracted page.
