# Snake Eyes

Prompt for the number of sides on each of two dice. Generate each die independently as `Math.floor(Math.random() * diceSides) + 1`. Count pairs of rolls until both dice show one, then print the count.

## Checks

The reference accepts whole side counts from 1 through 100. One-sided dice always succeed in one pair of rolls. For larger dice the count varies; do not require a fixed random result. It keeps rolling until two ones or Stop. Between batches of 1,000 pairs it yields to the browser so Stop remains usable; the pauses do not change individual rolls. Empty, fractional, non-finite and out-of-range input is rejected, and Cancel exits before rolling.

## Run

Open index.html in a browser with the exported files together. The project runs offline.

## Source

Adapted from [Juni Learning's original reference project](https://codepen.io/junilearning/pen/6580937e9dfd9ce926651a6fe915e078). The original D3 5.16.0 library is supplied locally with LICENSE-d3.txt.
