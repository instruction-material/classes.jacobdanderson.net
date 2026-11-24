# JavaScript Level 2 Practice Pack

Use local `index.html`, `styles.css`, `script.js`, and copied fixture data in an evergreen browser. CodePen, hosted database tools, public APIs, and remote storage are optional references. Use only fictional records. Never put an API key, access token, database credential, or real learner post in browser source. For each case, record browser and viewport, expected and observed state transitions, standard and failure inputs, console state, keyboard and pointer checks, reset or recovery, and one remaining limitation.

## level-1-readiness-and-state-case

The score starts at 0. A team earns 3 points per win and 1 per draw. Accept whole, nonnegative counts up to 10 each. Submit wins `2` and draws `1` twice, then try a blank, `2x`, `0` and `11` for wins. A valid submission replaces the displayed total. An invalid one keeps the last valid total. Reset clears the form and score.

Rebuild a fictional event-score calculator in local files.

- Use `const`, `let`, explicit conversion, strict comparison, one named function, one bounded loop, and one array or object.
- Replace `prompt`, `alert`, and `printToScreen` with a labeled form and `textContent`.
- Add a small native SVG or CSS result whose position or size comes from calculated state.
- Test empty, non-numeric, exact boundary, repeated submit, reset, refresh, and markup-shaped text.
- Record any JSS module that needs review before continuing.

## function-contract-and-pure-test-case

Each rider under 6 travels free, ages 6–17 pay $1.25, and ages 18 and up pay $2.75. Accept whole ages from 0 through 120, including trimmed digit strings. Reject a whole group if one age is invalid. Price the group `[5,6,17,18]`, an empty group, and `[" 18 ",""]`. Perform the sum in cents before formatting dollars.

Create helpers for a fictional transit-fare tool.

- Write contracts for `normalizeAge`, `fareForAge`, `totalFare`, and `formatFare`.
- Keep normalization and fare calculations pure; render in a separate function.
- Test ages at every rule boundary, an invalid age, zero riders, and decimal fare.
- Compare fixed values before connecting any random or event-driven caller.
- Record parameters, return values, side effects, and one removed duplication.

## decision-table-and-ternary-case

The exhibit has 8 places. Reject invalid occupancy first (blank, fractional, negative, or greater than 8), then report closed hours, then full capacity. During open hours with a free place, admit a reservation and direct walk-ins to the desk. A request for accessibility support appends “staff assistance” to the decision and never changes admission. Try occupied counts 7, 8 and 9, and a full exhibit after closing.

Implement a fictional exhibit-admission decision table.

- Define booleans for reservation, open hours, capacity, and accessibility support.
- List every meaningful combination before writing code.
- Use grouped boolean expressions and mutually exclusive branches.
- Use one ternary only for a compact display label.
- Test exact capacity, one below and above, invalid conversion, and reordered branch behavior.

## canvas-coordinate-and-fallback-case

Use stations A at (64,90), B at (320,90) and C at (320,270) in the logical map. Connect A to B and B to C only. Draw at CSS widths 640 and 320 with constant aspect ratio. At device pixel ratio 2 compare the logical point, CSS point and backing pixel for B on the narrow map.

Draw a bounded 640-by-360 fictional transit map.

- Set CSS size and drawing-buffer size deliberately and record device pixel ratio handling.
- Store stations and lines as data, then draw from that data.
- Use `save`, `restore`, paths, and calculated coordinates.
- Provide adjacent DOM text or canvas fallback content naming every station and connection.
- Test narrow layout, resize or redraw, reset, canvas unavailable, and high pixel ratio.

## array-transform-and-grid-case

Use Celsius readings `[0,10,null,10,"5",-5]`. Accept only finite numbers, preserve duplicates and convert using F = C × 9/5 + 32. Report count, sum and mean in Fahrenheit. For row totals use `[[1,2],[3,4],[5]]` with expected width 2. Report and skip malformed rows. Limit the grid to 16 rows, 16 columns and 128 cells before transformation.

Transform a supplied set of fictional weather readings.

- Use `for...of` to inspect values, `filter` for valid readings, `map` for conversion, and `reduce` for a summary.
- Preserve the original array and explain every callback’s return value.
- Convert a rectangular 2D grid into row summaries without assuming every row is valid.
- Test empty, duplicate, invalid, one-row, uneven-row, and maximum-size data.
- Cap rows, columns, and total cells before processing.

## object-model-and-animation-state-case

Start blue drone A at (2,3) with velocity (4,−2) units per second and radius 1. Red drone B starts inactive at (8,5), radius 2, velocity (1,1). Update twice with a half-second step; render between updates. Trace both identities.

Model a small array of animated fictional delivery drones.

- Give every object a stable ID, position, velocity, radius, color, and active state.
- Validate defaults and ignore or reject unknown fields.
- Separate `updateDrone`, `updateAll`, and `renderAll`.
- Use fixed time steps for logic tests before connecting animation.
- Verify that rendering does not mutate state and inactive objects do not update.

## logic-data-canvas-checkpoint-case

Use card objects with ID, x, y and score: A=(10,20,2), B=(30,20,3), C=(50,20,4). Draw a 10-unit square for every card whose score is an even integer at least 2. Print the selected IDs in input order. Try an empty array, a missing score and a second render of the same records.

Complete this after JSM6, or use it earlier only as a placement preview.

- Build one local program with a function contract, compound conditional, array transformation, object state, and data-driven canvas drawing.
- Use fixed data before randomness and provide an essential DOM text result.
- Include standard, boundary, malformed, empty, repeated, reset, and canvas-unavailable cases.
- Explain each selected structure and record console state.
- Name a JSM1–JSM6 revisit before opening the key.

## event-normalization-and-input-case

Use a logical 640-by-360 surface displayed in a rectangle with left 40, top 20, width 320 and height 180. Select using client point (200,110). Each right-key press moves the selection 10 logical units. Compare one press while focused, one after blur and one after attaching the same handler a second time.

Create a focusable canvas target selector.

- Attach named pointer and keyboard listeners exactly once.
- Convert pointer coordinates through `getBoundingClientRect`.
- Handle Arrow keys, WASD, Enter, and Space only while the interaction surface is focused.
- Call `preventDefault` only for a handled key in that active state; preserve page scrolling elsewhere.
- Test pointer scaling, all handled keys, an unrelated key, blur, repeated setup, teardown, and focus visibility.

## collision-boundary-case

Count touching as contact for positive-size shapes. Try circles centered at (0,0) and (6,8), each radius 5, then move the second center to (6,9). Try a 4-by-3 rectangle at (0,0) against a 2-by-2 rectangle at (4,3), then at (5,3). Reject zero dimensions. Trace contact, contact, separation, contact across four frames.

Implement pure circle-circle and rectangle-rectangle collision helpers.

- State whether edge touching counts as collision.
- Keep detection separate from score, sound, velocity, or removal.
- Test separated, touching, overlapping, contained, corner, zero-size, and high-speed crossing cases.
- Add a debug overlay that can be disabled without changing logic.
- Ensure one sustained overlap creates only one score or life event.

## bounded-game-loop-case

Start a catcher at x=10, speed 80 units/second, score 0 and two lives. Cap a step at 0.05 seconds. One rightward frame arrives 0.25 seconds late; the next object is caught once and the following one is missed. Pause, wait a second, resume without input and reset.

Build a minimal catch-or-dodge game.

- Model ready, running, paused, complete, and reset states.
- Maintain exactly one `requestAnimationFrame` loop and cancel it when stopped.
- Cap delta time, player speed, spawned objects, frame work, and session duration.
- Expose start, pause, and reset as semantic controls with focus-aware keys.
- Render instructions, score, lives, status, and outcome as DOM text; test reduced motion and a background-tab pause.

## resilient-fetch-and-fixture-case

Load the two supplied moves, then replace results with an empty list and with a record missing its URL. Simulate a failed optional refresh after a successful load. Keep the fictional test entirely local by passing these values and a rejecting request function to the same renderer/controller.

Use this bounded PokéAPI-shaped fixture before any public request:

```json
{
	"results": [
		{ "name": "tackle", "url": "https://pokeapi.co/api/v2/move/33/" },
		{ "name": "growl", "url": "https://pokeapi.co/api/v2/move/45/" }
	]
}
```

- Validate object, `results` array, item count, names, and HTTPS provider URLs.
- Render through one state machine: idle, loading, success, empty, stale, error.
- Optionally GET `https://pokeapi.co/api/v2/move/?limit=20`; check `response.ok`, abort on timeout or replacement, and cache success.
- Test fixture, network disabled, non-OK, timeout, abort, malformed shape, unexpected URL, repeated request, stale cache, and recovery.
- Use no API key or remote write.

## relational-schema-and-query-case

Run or trace the following against fresh copies of the shelves and books listed below. The last two statements use a disposable copy of the data.

```sql
SELECT title FROM books ORDER BY title LIMIT 2;
SELECT title FROM books WHERE shelf_id = 1;
SELECT b.title, s.label FROM books b JOIN shelves s ON b.shelf_id = s.id ORDER BY b.id;
SELECT s.label, b.title FROM shelves s LEFT JOIN books b ON b.shelf_id = s.id ORDER BY s.id;
SELECT s.label, COUNT(b.id) FROM shelves s LEFT JOIN books b ON b.shelf_id = s.id GROUP BY s.id, s.label ORDER BY s.id;
UPDATE books SET shelf_id = 2 WHERE id = 12;
DELETE FROM books WHERE id = 12;
```

For the advanced mutation exercise, insert book (13, “Sky”, NULL), add a nullable `year` column, predict the new row and restore the original tables by rolling back. For a schema diagram, show residents R1 and R2 sharing unit U1 in January. R1 moves to U2 in February. In the music alternative, one song has two credited artists and belongs to one album.

Use these fictional rows:

`shelves(id, label)`: `(1, "Blue")`, `(2, "Green")`, `(3, "Empty")`

`books(id, title, shelf_id)`: `(10, "Orbit", 1)`, `(11, "Moss", 2)`, `(12, "Loose", NULL)`

- Draw tables, primary keys, foreign key, cardinality, optionality, and delete behavior.
- Predict results for selecting titles, filtering shelf 1, ordering titles, inner joining shelves, and left joining all shelves.
- Add a many-to-many `books_authors` junction with a uniqueness rule.
- Preview target rows before one fictional update and delete, then state rollback or transaction intent.
- No live database or destructive execution is needed.

## local-crud-and-persistence-case

From n1 create n2 with text “draw map”, check n2, then delete n1. Reload. Separately migrate version-1 strings `["map","map"]` without merging equal text. On a simulated failed save distinguish the current in-memory view from the last durable snapshot.

Start with this versioned document:

```json
{
	"version": 2,
	"notes": [{ "id": "n1", "text": "fictional note", "complete": false }]
}
```

- Implement load, validate, create, read, update, delete, render, save, migrate, and reset as separate operations.
- Use stable IDs, `textContent`, native checkboxes, and fixed length and count limits.
- Migrate a version-1 string array into version 2.
- Test missing, malformed, unsupported-version, duplicate-ID, unknown-ID, empty, overlength, quota or unavailable storage, refresh, and reset.
- Keep all required writes in localStorage; never place a JSONBin key in browser code.

## events-requests-data-checkpoint-case

Use the two-move fixture from JSM10 and Blue/Green/Empty shelves from JSM11 above. Start with no favorites. Select growl by keyboard and add it to local favorites; select tackle with a pointer, then rename and delete that favorite by ID. Reload and compare the remaining names. Predict how many rows the shelves-left join returns.

Complete this after JSM12, or use it earlier only as a placement preview.

- Normalize one pointer or keyboard event into a visible state change.
- Load and validate a fixture, then optionally perform one resilient public GET.
- Draw a two-table relational model and predict one join.
- Implement versioned local create, update, and delete with recovery.
- Verify focus-aware keys, pointer input, network and storage failure, safe rendering, reset, and the JSM7–JSM12 module to revisit before opening the key.

## safe-message-board-case

Create posts p1 “Field walk” and p2 “Map room”, both with comment text “Meet at noon”. Add one comment to each in reverse post order. Delete p1 and reopen. Use `https://example.org/trail` as an allowed link and `https://example.net/trail` as a rejected origin. Try a missing image and the literal title `<map>`.

Build a single-browser fictional message board.

- Store bounded versioned posts with stable ID, title, reviewed HTTPS link, optional reviewed image URL, comments, and local ordering.
- Parse URLs with `URL`; allow only reviewed protocols and origins.
- Render all learner-controlled text with `textContent`; provide fallback text for failed images.
- Tie each comment form to the post’s stable ID and preserve predictable focus and status.
- Test two posts, duplicate text, markup-shaped text, invalid URL, failed image, unknown ID, length and count caps, malformed storage, migration, refresh, delete, and reset.

## accessible-quiz-state-machine-case

Save this JSON as a file and import it in the assigned state-capitals quiz. These two simplified shapes exercise the importer; use the included fifty-state map for the final project. With a fixed question selector that always chooses the first remaining record, enter Montgomery, try to submit again during feedback, advance and enter Juneau. Repeat with a wrong second answer and try importing an empty states array mid-quiz.

Two-state import file:

```json
{
	"schemaVersion": 1,
	"viewBox": [0, 0, 20, 10],
	"states": [
		{ "id": "01", "name": "Alabama", "capital": "Montgomery", "acceptedAnswers": ["Montgomery"], "path": "M0,0L8,0L8,8Z" },
		{ "id": "02", "name": "Alaska", "capital": "Juneau", "acceptedAnswers": ["Juneau"], "path": "M10,0L18,0L18,8Z" }
	]
}
```

- Model loading, ready, asking, feedback, complete, and reset.
- Accept exactly one scored answer per question through a labeled form or native buttons.
- Render question, progress, score, feedback, status, and final result in the DOM.
- Color answered states on the map and provide the same results as text when canvas is unavailable.
- Test correct, wrong, empty, duplicate submit, final question, empty or malformed fixture, keyboard, focus, canvas unavailable, complete, and restart.

## browser-app-capstone-case

One possible brief is a reservation board for a fictional club. Seed sessions `[{"id":"s1","title":"Sketch","seats":1},{"id":"s2","title":"Build","seats":2}]` and no reservations. Show availability, reserve one seat, cancel by session ID and restore availability. Allow at most one reservation per session for this visitor. Implement the request with the Fetch API: construct a data URL by joining `"data:application/json,"` to `encodeURIComponent(JSON.stringify(sessions))`, then await fetch and response.json(). Validate the returned array before enabling reservations. Try a data URL containing malformed JSON, recover with the original fixture, and test the same event and state functions with both results. Try reserving s1 twice, reserving s2, refreshing, canceling s1 and loading saved data that mentions an unknown session. For a project of your own, substitute an equally small fixture and specify the same normal, boundary and recovery traces before building.

Plan one browser-only app or game for a fictional audience.

- Define one task, non-goals, states, events, data shape, effect boundaries, and smallest complete vertical slice.
- Separate pure logic from DOM, canvas, storage, and optional network work.
- Include a complete supplied-fixture route and no browser secret; use local CRUD only when it serves the task.
- Bound frames, generated objects, records, text, requests, retries, and stored data.
- Verify keyboard and pointer operation, focus and status, canvas alternative, motion, contrast, narrow reflow, request and storage failures, reset, regression, attribution, privacy choices, limitations, and a three-minute demonstration.
