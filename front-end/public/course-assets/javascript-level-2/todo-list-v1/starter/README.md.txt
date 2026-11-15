# To-Do List

Build a note list from a version-one document with stable IDs. The two supplied notes make the initial state concrete. Complete addNote(state, value, id) and renderNotes(state) in script.js. addNote trims and validates a 1–200-character note, rejects a repeated ID or more than 100 records, pushes one {id, text} object and returns true. Use the supplied recordId and textField helpers. renderNotes creates a list item for each record and assigns its text with textContent. An empty array displays No notes.

The supplied form generates an ID once per accepted submission. Its transaction helper clones state, applies the mutation, validates the complete document and saves JSON before replacing working state. Trace this route in storage.js and the perform function. A failed save keeps the previous document. Invalid or unsupported stored JSON stays available for recovery and produces a read-only example.

Add two notes, including duplicate text, and refresh at the same origin. Each note must retain its own ID. Verify literal markup-shaped text, blank/overlength input, the record limit, failed saving and corrupted storage using CASES.md. This project supplies creation and rendering; deletion belongs to the next core project.

## Run and continue

Open index.html in a current browser. For stable origin-based persistence, an available Python 3 installation can serve this exported folder with: python3 -m http.server 8000 --bind 127.0.0.1 . Open http://127.0.0.1:8000 in that case. Direct file storage varies by browser;denied storage shows the read-only example. Keep the same origin and browser profile for refresh checks. IDE code exports contain the project files;localStorage is separate. Read storage.js and CASES.md before comparing the reference.

Complete addNote, renderNotes before comparing the reference.
