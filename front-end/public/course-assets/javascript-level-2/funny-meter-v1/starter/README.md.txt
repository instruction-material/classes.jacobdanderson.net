# Funny Meter

Rate exactly ten programming jokes, one at a time. This optional project extends the single-joke reader: the completed normalizeJoke helper is supplied, and the new work is validating the batch and recording decisions. Saved responses contain ten actual programming jokes. The Live API option uses the original programming/ten endpoint when available.

Complete loadTenJokesResponse, normalizeTenJokes and recordRating in script.js. The asynchronous loader awaits the saved response or the live programming/ten endpoint before creating the session. Require an array of exactly ten valid jokes, assign a stable session ID to each position, and reuse normalizeJoke for each setup and punchline. Store each accepted rating with the current joke's ID. Accept only yes or no; invalid input leaves the current position unchanged. The next joke is determined by the number of recorded ratings, not by an independently incremented prompt counter.

The supplied renderer shows progress, the current joke and two native answer buttons. After ten answers it displays liked/disliked counts and whether the set was liked, disliked or tied. Buttons stop accepting ratings at completion. Restart clears ratings for the current set; a failed live refresh preserves it, and another load cannot erase a partly rated session. Use CASES.md to complete all-yes, all-no and tied sessions, plus invalid/duplicate/after-completion cases. Open index.html without a server.

The starter supplies the request and interface wiring;complete loadTenJokesResponse, normalizeTenJokes, recordRating before comparing the reference.
