# Check-In 2: Helpers, Events, APIs and Data

Continue the same Core project across Helpers, APIs and Databases. Open
index.html directly. The interface, request helper and fixtures are supplied;
complete the three functions in helpers.js before comparing the reference.

## Helpers and event coordinates

Implement sumEvens(values) with a named helper and a reduce total starting
at 0. Preserve the input array. The original arrays [2,1,6,91,-1] and
[0,3,2,91,-1] give 8 and 2. Also check [] gives 0, [1,2] gives 2,
[-3,2] gives 2, and [-4,2] gives -2. Starting reduce without 0 would
fail for [] and incorrectly include an odd first element.

Implement canvasPoint(event,canvas). Read canvas.getBoundingClientRect(),
subtract rect.left and rect.top from clientX and clientY, then multiply
each coordinate by its buffer-size/display-size ratio:
x = (clientX - left) * canvas.width / rect.width
y = (clientY - top) * canvas.height / rect.height
A 500 by 500 buffer displayed at 250 by 250, with left=40 and top=60,
maps click (165,185) to (250,250). The top-left maps to (0,0).
The page deliberately scales the canvas. Click near the center and an edge,
then compare the visible position with the reported buffer coordinates.

## API data

fixture.js is a small authored practice object shaped like a move-list
response. It is supplied with this project, rather than fetched on opening.
Implement firstMove(data): call checkpointRemote.validateList(data) and
return data.results[0].name. The fixture's first name is pound. Invalid,
missing or empty results must produce a useful error instead of a crash.

Use practice fixture to display that result. Request 20 move names is
optional and performs one public GET to the documented move-list endpoint.
The supplied remote.js checks response.ok, parses JSON, validates before
caching, and uses AbortController to abort after five seconds. Inspect how
loading, request, validation, state and display have separate responsibilities.
Repeated successful reads use the page's memory cache. Reload clears it.
An offline, non-OK, malformed or timeout response must retain the last valid
name and source label while displaying an error. Avoid private records.

## Database worksheet

Read DATABASE.md and library.sql. Both complete tables, keys, queries and
worked results are provided locally. Predict SELECT/WHERE and JOIN outputs,
draw their relationship, and walk through the supplied CRUD sequence.
Distinguish changing a view, an in-memory array and stored database rows.
SQLite execution and a hosted diagram are optional.

## Completion

Retain expected and observed fixed sums, original-array preservation, two
canvas clicks with coordinate predictions, fixture output, and a database
diagram with query/CRUD predictions. If trying live requests, record the
visible source and recovery result. Change one input, predict its output,
then keep the observed result. Continue across tasks with these saved files.
