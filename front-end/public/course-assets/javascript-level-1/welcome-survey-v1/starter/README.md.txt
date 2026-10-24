# Welcome Survey

Open `index.html` in a browser with all six exported files in place. The bundled D3 library runs locally; this project needs no server, package installation, or network connection.

The starter leaves the survey code unfinished above the supplied `printToScreen` helper. Collect first and last names, convert two number responses before adding them, and report the final character of a nonempty food name.

For the reference, use fictional inputs `Avery`, `River`, `2`, `3`, and `mango`. The page shows `Avery River`, the console reports a sum of `5`, and the alert reports `o`. Decimal inputs `2.5` and `0.75` produce `3.25`.

Browser prompts return strings, or `null` when canceled. The reference checks cancellation before indexing the food string. Blank or non-finite number responses produce a validation message instead of a sum; an empty food response produces a separate message. The supplied helper handles drawing so the exercise can focus on variables, conversion, addition, and string indexing.

Juni Learning source: [starter](https://codepen.io/junilearning/pen/OJMxyqw) and [reference](https://codepen.io/junilearning/pen/1efb04d2b3e13694f1bf614fef02c22c). The reference adds cancellation and empty-input handling. The HTML wrapper loads the original D3 5.16.0 library locally; retain `LICENSE-d3.txt` with it.
