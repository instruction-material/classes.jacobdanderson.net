# Move Analyzer

Build a page that groups move objects by their nested type.name and counts
the form-selected type. The complete local fixture and page controls are
supplied. Open index.html directly and complete moves.js.

fixture.js contains six authored practice records with fictional move names
and the same nested name/type.name structure used by PokéAPI move objects.
The expected counts are fire=2, water=2, normal=1 and electric=1. This is a
six-record sample; its counts do not describe the complete API collection.

Implement countTypes(moves): call moveData.validateMoves, loop over moves,
read each move.type.name, and increment the matching counter. Return the
counts without changing the supplied array. Object.create(null) gives a
dictionary without inherited property names. The four counts sum to six.

Implement countForType(counts,input): convert input to a string, trim spaces
and lowercase it. Empty input produces Enter a move type; an unrecognized
type produces an Unknown move type message. moveData.types supplies the
recognized types. A valid type absent from the sample has count0.
Return {type:key,count:number} and let the supplied interface render it with
textContent. Avoid a prompt loop or HTML interpolation.

Use six-move practice fixture, then submit Fire, water, " WATER ", grass,
an empty input and an unknown type. Expected: 2,2,2,0,empty-input message,
unknown-type message. Compare the visible counts with the same six records
and check that their names and nested types remain unchanged.

## Optional live data

Request moves 1 through 6 is an explicit optional action. The supplied
data.js reads these six fixed IDs sequentially, one GET at a time. Every
response must have a move name and a recognized type.name. remote.js
checks HTTP status, parses JSON, validates before caching and aborts each
request after five seconds. Six requests are the fixed maximum for a new
complete sample. A second successful read reuses those cached responses
until reload. No requests run just by opening or typing into the page.

Counts become current only after all six records succeed. If any request
fails, the last valid sample, counts and source label remain visible with
an error. A failed response is not cached. Describe what happens for offline,
timeout, non-OK and malformed responses; use the local fixture whenever a
live request is unavailable. Compare types within the actual returned sample,
rather than assuming it matches the practice fixture or all available moves.

## Completion

Keep the six practice inputs and results, original data, counts summing to
six, source label and a changed fixture with its predicted counts. If using
live data, retain its visible source and a failed-refresh recovery result.
Explain why ready must wait for every selected request, why one last-numbered
request finishing does not establish that others finished, and how caching
and the fixed request bound keep this project responsive.
