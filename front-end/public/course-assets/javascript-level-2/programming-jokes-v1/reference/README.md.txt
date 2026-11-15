# Programming Jokes

Display one programming joke as a setup followed by its punchline. The supplied set has ten actual programming jokes from the original API project's public data. Saved responses cycle through those records. Live API requests use the original programming/random endpoint; a successful response may be an object or a one-item array. Keep its two pieces of text together.

Complete loadJokeResponse, normalizeJoke and renderJoke in script.js. In the asynchronous loader, await fixtureResponse for saved data or await requestJson for the live endpoint, then return the validated record from its data field. Normalize an array by selecting its first record, reject empty data, and require nonempty setup and punchline strings of at most 500 characters. The supplied request.js checks HTTP status, JSON content type, a 512 KiB response limit and a four-second deadline. Parse and validate before changing the page. Use textContent and replace the previous two paragraphs instead of accumulating old output. A supplied color rule keeps the original colored-text idea while retaining readable contrast.

Select Saved responses and load several jokes without a network. Then select Live API and inspect the request in the browser tools. One active request is allowed; Cancel aborts it. A failed or malformed refresh keeps the previous joke and shows a status. Random endpoints deliberately request a fresh value, while the shared helper retains a bounded cache for deterministic lookups. Check CASES.md before comparing the completed reference. Open index.html without a server.

The reference completes loadJokeResponse, normalizeJoke, renderJoke for comparison after the starter attempt.
