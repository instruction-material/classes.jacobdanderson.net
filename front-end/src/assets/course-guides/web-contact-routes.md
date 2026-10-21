# Routes, middleware and one response

An HTTP request has a method, target, headers and optional body. Express matches
requests against handlers registered in order. `GET /health` and
`POST /api/contact` are different contracts even on the same server. A form
submission does not automatically choose a database or send a message.

## Trace this application's order

Open `src/app.js` beside this reading. `createContactApp` constructs the app
without opening a port, making the request behavior independently testable.
The listener and process shutdown remain in `src/server.js`.

1. `GET /health` returns `{ "ok": true }`. It checks that this process can
   answer HTTP, independently of the selected delivery fault scenario.
2. `app.all("/api/contact", ...)` checks the method, shared attempt budget and
   JSON media type. A wrong method receives 405 and `Allow: POST`. A seventh
   quick POST receives 429 with `Retry-After` before parsing or delivery.
3. The POST route applies `express.json` with an 8192-byte body limit,
   `strict: true` and `inflate: false`. Syntactically malformed JSON cannot
   reach ordinary field validation. Strict parsing accepts objects/arrays;
   the validator must still reject arrays and enforce the field contract.
4. `parseContact(request.body)` returns accepted normalized data, field errors,
   or the unfinished starter marker. The route turns those results into a
   stable HTTP outcome. Validation does not send mail itself.
5. Accepted data reaches delivery under a 750 ms deadline. The success response
   is 202 with `{ "ok": true, "delivery": "simulated" }`. Failure and deadline
   expiry produce safe 503 and 504 bodies. `finally` clears the timer and
   aborts remaining delivery work.
6. Unmatched `/api` requests receive JSON 404s before static-file handling.
   Static middleware serves the supplied public directory. A final handler
   rejects other missing paths. The error middleware maps parser failures and
   unexpected errors to safe status/body pairs.

`next()` continues to the next applicable handler. Sending the response ends
that branch; the explicit `return` statements prevent later code in that
handler from sending another response. A successful JSON parse proves only
syntax. Neither `Content-Type` nor a disabled form button proves valid data.

## Inspect method, status and body together

The browser's `fetch` promise can resolve for a 400 or 503 response. The script
checks the status and parsed body before announcing success. A connection
failure, invalid JSON response and the browser's own two-second deadline have
separate messages. Reset advances a generation counter and aborts the prior
request. If an older response still arrives, its generation cannot replace
the new form status. The pending guard also prevents accidental duplicate
submissions while one request is active.

Use developer tools Network to inspect an actual fictional submission. Record
method, URL, request type/body, response status/body and visible status. Match
the trace to the source order above. Then send `GET /api/contact` with a local
request client. It should produce 405, not a file or successful contact result.

The app logs only event, status and outcome. It omits message text, addresses
and raw exceptions. Those logs can locate the failed boundary without becoming
a second store of submitted data. Its six-attempt window is shared by one
process, not an account quota or production abuse-control system.

**Practice:** Predict which handler rejects wrong media type, malformed JSON,
an unknown field and a delivery timeout. Execute each case against the owned
local service. Explain why an available `/health` response can coexist with
a failed contact POST, and restore the ordinary scenario afterward.

Reference: [Express 5 API](https://expressjs.com/en/5x/api/).
