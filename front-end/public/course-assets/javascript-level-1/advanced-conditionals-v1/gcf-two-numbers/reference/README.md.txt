# GCF of Two Numbers

Find the greatest common factor of two positive whole numbers. Test candidate factors from 1 through the smaller input, use `&&` to check that both remainders are zero, and retain the largest matching factor.

## Checks

Check 36/24 → 12, 8/15 → 1, 18/18 → 18, and reversed inputs. The reference accepts positive whole inputs from 1 through 1,000,000, bounding the factor search. It handles Cancel separately and rejects blank, fractional, nonnumeric, infinite, zero, negative and larger inputs before entering the loop.

## Run

Open index.html in a browser with the exported files together. The project runs offline.

## Source

Adapted from [Juni Learning’s original reference project](https://codepen.io/junilearning/pen/b418881c3e60c8c7ac8fcbc3b7d74aa0). The original D3 5.16.0 library is included locally with LICENSE-d3.txt.
