# Geometry Functions

Implement six geometry functions and keep numeric results separate from printed sentences. Use Math.PI and Math.sqrt(3), rather than rounded constants, until formatting the final output.

## Circle formulas

For radius r≥0, circumference(r)=2πr and circleArea(r)=πr². isCircumferenceLarger(r) compares the numerical values of those two formulas. Length and area have different units; this exercise compares their numbers under the chosen unit, not interchangeable physical quantities. At r=1 the comparison is true; at r=3 it is false; at r=0 both are zero.

## Triangle formulas and validity

Three positive finite sides form a triangle only when their two shorter sides sum to more than the longest side. Reject zero or negative sides and sets such as 1,2,3 or 1,2,10. triangleType returns equilateral for three equal sides, isosceles for exactly two equal sides, scalene for three different sides, and invalid triangle when the sides cannot form one.

An equilateral triangle of side s has area s²√3/4. A right triangle satisfies a²+b²=c² after sorting sides so c is longest. Check validity first and compare the squared values with a small relative tolerance to account for floating-point rounding. Reordering 3,4,5 must not change the result.

## Fixed cases

For radius 1, circumference is 2π and area is π. The area of an equilateral triangle with side 2 is √3. Check 3,3,3; 3,3,4; 3,4,5; 5,3,4; and invalid side sets. Distinguish a valid non-right triangle from an invalid triangle. Trace a radius or side from the form through the appropriate function and into the printed output.

## Open and work with the source

Confirm the selected starter or reference import in the site IDE. The starter retains unfinished original work; the reference contains completed functions. Edit script.js, save the same attempt, reopen it, and check that earlier edits remain. `README.md` is the project brief. Export the complete ZIP, extract all files, and open index.html in a browser. The page works without a server, installation, or network connection.

The original examples use D3 5.16.0 to print results. The local copy and its license are included. support.js supplies readable page output and connects the labeled controls to the exercise functions. Calculations and game state belong in script.js. Input changes take effect only after the page form is submitted. `SOURCES.md` records the original editor panels and deliberate adaptations.

Before running, predict the return value and identify the state that should change. Trace parameters, local variables, returned values, and displayed output separately. Compare the starter and reference after an independent attempt; keep explanation alongside the saved code rather than replacing an earlier attempt.

## Verify the result

Use the supplied fixed cases before random examples. Check a boundary case, an invalid input, and a second valid case. A rejected form value should leave the last valid output readable. Operate the controls with the keyboard and inspect a narrow screen, 200% zoom, and reduced motion. Save a visible code edit, reopen the same project, export every companion file, and repeat the check in the extracted page. Record the expected and observed result and the function responsible for any difference.
