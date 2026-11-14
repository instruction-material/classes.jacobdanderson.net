# Deleting Notes

Extend the completed local note list with deletion. Adding, validation, rendering and persistence are supplied from the earlier project. Complete deleteNote(state, id) in script.js. Find the note with the selected stable ID, remove exactly that record and return true. Return false for an unknown ID so no stored document is rewritten. Array positions describe display order; the stored ID identifies the record across changes.

Each Delete button captures its note's ID. After a successful transaction the renderer rebuilds the list and focus returns to the note input. The storage helper validates and saves a cloned document first, so a quota or policy failure leaves the previous state intact.

Delete the first, last and only note. Repeat a deletion with the removed ID, and try an ID that never existed. Add duplicate text to confirm the selected ID determines the deletion. Refresh after success and after a failed save. The list uses version one and has no completion checkbox; checking notes remains a separate optional project.

## Run and continue

Open index.html in a current browser. For stable origin-based persistence, an available Python 3 installation can serve this exported folder with: python3 -m http.server 8000 --bind 127.0.0.1 . Open http://127.0.0.1:8000 in that case. Direct file storage varies by browser;denied storage shows the read-only example. Keep the same origin and browser profile for refresh checks. IDE code exports contain the project files;localStorage is separate. Read storage.js and CASES.md before comparing the reference.

The reference completes deleteNote for comparison after an attempt.
