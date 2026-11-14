# Checking Notes

Add persistent completion state to the local note list. Adding, deleting, safe rendering and the storage transaction are supplied. Complete upgradeLegacyNotes(value) and setCompletion(state, id, checked) in script.js.

Version two retains each note's ID and text and adds the Boolean done field. Upgrade a valid version-one document by preserving its records and assigning done: false. For the older string-array fixture, keep each valid nonblank note, including duplicate text, and assign a distinct legacy-position ID. Validate text and record limits and reject other shapes. Return the version-two document. The supplied normalizer validates the result and marks it as migrated; the next successful change saves that schema.

setCompletion finds one note by ID, accepts only a Boolean checked value, assigns its done field and returns true. Unknown IDs or non-Boolean values return false. The native checkbox and Completed/Incomplete text show the same state. Focus returns to the corresponding checkbox after rendering.

Use the two legacy fixtures in fixtures.js and CASES.md to verify migration, toggling one of two notes, repeated toggles, deletion after checking, refresh, corrupted data and failed saving. A failed migration preserves the original JSON for recovery. This is the optional extension of the two core note projects.

## Run and continue

Open index.html in a current browser. For stable origin-based persistence, an available Python 3 installation can serve this exported folder with: python3 -m http.server 8000 --bind 127.0.0.1 . Open http://127.0.0.1:8000 in that case. Direct file storage varies by browser;denied storage shows the read-only example. Keep the same origin and browser profile for refresh checks. IDE code exports contain the project files;localStorage is separate. Read storage.js and CASES.md before comparing the reference.

The reference completes upgradeLegacyNotes, setCompletion for comparison after an attempt.
