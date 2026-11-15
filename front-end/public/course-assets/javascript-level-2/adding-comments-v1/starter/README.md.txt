# Adding Comments

Extend the completed topic board with nested comments. Topic creation, URL validation, ordering, rendering, local transactions and a version-one upgrade are supplied. Complete addComment(state, postId, value, id) in script.js.

Find the parent topic by stable ID. An unknown parent returns false without changing or saving the document. Validate a unique comment ID and trimmed text of 1–400 characters. Append one {id, text} object to that topic's comments array, with at most 20 comments per topic and 200 across the board. The full document must remain within 128 KiB.

The renderer creates a labeled form for each topic and captures its ID. Adding a newer topic changes display positions while the captured ID still selects the intended parent. Duplicate comment text is allowed as distinct records. The supplied renderer uses textContent and restores focus to the appropriate new comment input.

Comment on two topics, add a newer topic, comment again on an older one and refresh. Verify stable associations, duplicate and markup-shaped text, blank/overlength input, missing parents, limits, reset and storage failures using CASES.md. A failed save preserves the previous document. Reset restores the supplied example and clears its comments. This project remains optional.

## Run and continue

Open index.html in a current browser. For stable origin-based persistence, an available Python 3 installation can serve this exported folder with: python3 -m http.server 8000 --bind 127.0.0.1 . Open http://127.0.0.1:8000 in that case. Direct file storage varies by browser;denied storage shows the read-only example. Keep the same origin and browser profile for refresh checks. IDE code exports contain the project files;localStorage is separate. Read storage.js and CASES.md before comparing the reference.

Complete addComment before comparing the reference.
