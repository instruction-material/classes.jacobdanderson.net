# Random Fox Generator

Add a fox photograph whenever the load button succeeds. Each valid response appends a fox photograph to the gallery. The gallery retains the newest twelve entries. Saved responses cycle through three real, public-domain fox photographs; their credits and source pages are included. Live API uses the original randomfox.ca/floof/ endpoint when available.

Complete loadFoxResponse, validateFox and appendFox in script.js. The asynchronous loader selects fixtureResponse or requestJson and returns the validated object before image decoding begins. Require an object with a valid image field. Saved image values must match the supplied fixtures; live values must use HTTPS, the exact randomfox.ca origin and an images/number.jpg, .jpeg or .png path. Reject query strings, fragments and unrelated origins. The supplied request helper checks status, JSON parsing, byte size and a four-second deadline. The supplied image helper waits for successful decoding before the new figure is attached, so broken images cannot displace valid ones.

Create meaningful alt text from trusted local copy, keep image proportions with CSS, and append a text credit link. Remove the oldest figure only after a thirteenth valid result is ready. Verify the gallery offline, then use Cancel and the failure cases in CASES.md. Failed requests or image loads keep earlier photographs. Photographs use their natural proportions at both display widths. Open index.html without a server.

The reference completes loadFoxResponse, validateFox, appendFox for comparison after the starter attempt.
