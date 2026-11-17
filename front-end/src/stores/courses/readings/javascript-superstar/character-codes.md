# Turn an English letter into a numeric code and back

The ASCII codes used in these exercises lie within Unicode's first 128 values. Uppercase English letters occupy 65–90, lowercase letters 97–122 and digits 48–57. Each interval is consecutive, but punctuation and gaps separate the intervals.

## Worked character trace

```javascript
const letter = "c";
const code = letter.charCodeAt(0);
console.log(code);
console.log(String.fromCharCode(code + 1));
console.log("A".charCodeAt(0), "0".charCodeAt(0));
```

The outputs are `99`, `d` and `65 48`. `charCodeAt(0)` reads the first UTF-16 code unit. `String.fromCharCode` constructs a string from supplied code units. Adding one to c's code reaches d; adding one to z's code reaches a punctuation character rather than wrapping to a.

JavaScript strings use UTF-16 units. Some characters need two units, so string length and character count can differ. The English letters and digits in this exercise each occupy one unit. Keep that stated alphabet when using numeric ranges to generate the samples.

## Worked range selection

```javascript
const r = 0.5;
const letterCode = 97 + Math.floor(r * 26);
const digitCode = 48 + Math.floor(r * 10);
console.log(String.fromCharCode(letterCode));
console.log(String.fromCharCode(digitCode));
```

This prints `n` and `5`. At r=0 the endpoints are a and 0; at r=0.999 they are z and 9. The widths 26 and 10 count the choices in the respective inclusive intervals. A random value is scaled before floor removes its fractional part.

For the assigned alternating sample, append one selected lowercase letter and then one selected digit on each of ten iterations. Ten pairs contain twenty code units, with letters at indices 0,2,…,18 and digits at 1,3,…,19. Inspect those positions as well as the total length. A number such as 5 and a one-character string such as `"5"` remain different values. These exercises use Math.random for practice samples; real account credentials need a security-specific generator.

References: [UTF-16](https://developer.mozilla.org/en-US/docs/Glossary/UTF-16), [fromCharCode](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/fromCharCode), [random ranges](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random).
