# Guessing golf

Open index.html in the IDE preview or from an exported ZIP without a server. Edit script.js. The starter includes the page and printToScreen() helper; implement playGolf().

Each of three rounds chooses one integer from 0 through 19 using Math.floor(Math.random() * 20). Three guesses share that secret. Add Math.abs(guess - secret) for every guess to obtain the round score; add the three round scores for the total. Lower totals are better. Retry empty, nonnumeric, fractional or out-of-range entries. Cancel ends the game and reports completed rounds.

## Check cases

- Secret 10, guesses 7, 10, 15: distances 3, 0, 5; round score 8.
- Secrets 0, 10, 19 with guesses [0,1,2], [10,8,14], [19,0,10]: round scores 3, 6, 28; final total 37.
- Three exact guesses score 0.
- Invalid entries consume no guess. Cancel consumes no score.

For a controlled check, temporarily replace each round's secret expression with the case value; restore randomness afterward. Save, reopen and export the edited project. The reference is a separate instructor project.
