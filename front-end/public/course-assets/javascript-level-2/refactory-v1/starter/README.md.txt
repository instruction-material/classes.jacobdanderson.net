# Refactory

Refactor a working widget factory into helper functions while preserving its two reports.
The starter already runs and contains the repeated code to extract. The reference uses one
helper to make a fresh widget and one to assemble a fresh report from a model and count.

## Files and execution

Open index.html in a browser without a server. The site IDE can run the same local files.
Edit script.js for the factory work. report-viewer.js displays console.log objects as readable
text and also keeps the original console output. index.html and styles.css supply the viewer.
The original source had blank HTML/CSS and logged reports only; the viewer adds their on-page
presentation without changing report data. All files work offline.

## Inputs and outputs

A heavy widget has name "heavy" and weight 500; a standard widget has name "standard" and
weight 100. Produce two heavy widgets first, totalWeight 1000, then three standard widgets,
totalWeight 300. Each report has widgets and totalWeight. CASES.md supplies both full reports
and additional cases.

## Refactoring path

Record the starter output. Extract a helper that returns a new object with name and weight.
Extract an assembly helper taking a model and count. Create a fresh report, loop count times,
create and append a separate widget each time, accumulate its weight, then return the report.
Use the returned reports for the two original console.log calls. Run after each extraction.

Each call owns its report and widget array; every widget is separate from its model and peers.
Keep array order and all values. Object property order may differ. Add one new model/count
call without copying another assembly loop, and explain the two helpers' responsibilities.

SOURCES.md records both original captures and declared adaptations. LICENSE-original.txt
retains the complete starter notice. The local reference is newly authored against the
original behavior and helper-function task; the original reference remains separately linked.
