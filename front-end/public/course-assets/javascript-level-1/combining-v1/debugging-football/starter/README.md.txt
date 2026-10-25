# Debugging Football

Repair the simulation so the team starts at a random whole yard from 1 through 25. Each round has four plays, each gaining a random whole amount from -4 through 10 yards. Update the current yard and round total, report the round gain, then use the Y/N answer to decide whether to continue.

This debugging starter deliberately stops at an undefined variable. Repair the first reported error, then trace the remaining loop and state updates.

## Checks

The starter deliberately refers to an undefined proceed variable and has incorrect starting-yard, play-count, yard-update and final-total logic. Fix one issue at a time. Each round has four play messages and one alert; Y continues, while N or cancellation ends the loop. The final summary distinguishes total gain from the final yard position.

## Run

Open index.html in a browser. The project runs offline.

## Source

Adapted from [Juni Learning's original starter project](https://codepen.io/junilearning/pen/gOPRqPr). The D3 license is included as LICENSE-d3.txt.
