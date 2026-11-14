A note has text and an identity. A stored document also needs a version so later code can recognize the shape it expects. The required projects keep their documents in this browser's local storage; the original hosted examples remain source references for the tasks.

## Worked document change

Start with two records:

```json
{"schemaVersion":1,"notes":[{"id":"note-a","text":"Sketch the layout."},{"id":"note-b","text":"Check the last case."}]}
```

Deleting `note-a` leaves `note-b` with the same ID and text. Its array position changes from one to zero. The delete button passes the stored ID to `deleteNote`; the function finds that record, removes it and returns `true`. An unknown ID returns `false` and leaves the document unchanged. The supplied transaction helper then validates and saves a changed document before replacing the working state.

A function argument named `state` is this data object. The browser's global `document` is the DOM object used to create elements and find controls. Keeping those names distinct prevents a data record from being mistaken for a page.

## Read, parse and validate

Storage values are strings. `JSON.stringify` turns a plain document into a JSON string; `JSON.parse` turns the stored string back into a value. Parsing can fail, and successful parsing still needs shape checks. A JSON number or an object with the wrong version is not a valid notes document.

The supplied validator requires version one, at most 100 notes, unique nonempty IDs and note text of 1–200 characters after trimming. It constructs fresh objects containing the expected fields. The storage helper also limits an encoded document to 128 KiB. Trace these checks in `storage.js` before implementing the starter's mutation and rendering functions.

## Commit one change

`commitDocument` clones the last valid state, passes the clone to the mutation function, validates it and serializes it. Only a successful `setItem` changes the working state. A quota or policy failure therefore leaves the previous state and saved document intact. The status explains the failure.

An unreadable, oversized or unsupported saved value stays in storage. A read-only example appears with the original JSON available for recovery. This is different from an empty store, which starts a new document. Verify both situations; replacing damaged data with an empty array would conceal a recoverable attempt.

## Render text and retain focus

Create a list item for each note and assign its text with `textContent`. Markup-shaped input then appears as text. The mutation works on state; the renderer builds the page from that state. Deleting a note returns focus to the note input, giving keyboard users a predictable continuation.

The first project implements adding and rendering. The second supplies those earlier functions and asks for deletion. The optional completion project supplies deletion and adds a checkbox state plus migration.

## Upgrade the schema

Version two adds a Boolean `done` field. Existing version-one objects retain their IDs and text while receiving `done: false`. The older string-array fixture needs IDs as well: derive distinct `legacy-0`, `legacy-1` and later IDs from the original positions, keeping duplicate text as separate notes. Blank strings can be omitted; valid strings remain. Reject an unsupported shape while preserving its raw value.

A successful completion change saves version two. Reopening then retains the IDs and completion values rather than running the migration again.

## Run and verify

Reload the same project location and browser profile to test persistence. Browser treatment of direct `file:` storage varies; a blocked store produces the read-only example. For consistent origin-based testing, serve the exported folder on loopback with an available static server, for example `python3 -m http.server 8000 --bind 127.0.0.1`, then open `http://127.0.0.1:8000`. A file URL and that HTTP origin have separate stores. An IDE code export carries the project files; browser storage is a separate result.

Use each project's `CASES.md` for the first, last, only, unknown-ID, repeated-delete, migration, refresh and failed-save cases. See the MDN references for [localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage), [setItem](https://developer.mozilla.org/en-US/docs/Web/API/Storage/setItem) and [JSON parsing](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse).
