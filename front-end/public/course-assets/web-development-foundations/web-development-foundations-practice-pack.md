# Web Development Foundations Practice Pack

Use fictional data and localhost throughout. Record expected behavior before running a case, then add the observed result, evidence location, correction, and retest. Public accounts, live SMTP, cloud databases, custom domains, and public deployment are optional and never needed to complete this pack.

## Toolchain Preflight Case

Use the starter in the [four-file portfolio](https://github.com/instruction-material/Web-Development-Foundations/tree/5bfdf1b25452fb65aa36d38cea6d836fdf6ae5cc/WDF1-Portfolio-Custom-Domain/basics) with Node 24 and the complete repository’s root lockfile. Record your operating system, revision, working directory, Node and npm versions. Read the starter package scripts and use the pack’s workspace install command if dependencies are missing.

From the repository root, run `npm run dev --workspace WDF1-Portfolio-Custom-Domain/basics/starter -- --host 127.0.0.1 --port 5173 --strictPort` on a free port. Inspect the document, stylesheet and module requests. Count the rendered checklist items and record the footer. While the server is running, run the same command in a second terminal. Predict which page remains reachable. Stop only the server you started and repeat the command. If analyzing the supplied trace on paper, use “first process listening on 5173; second process reports port 5173 already in use” and label the result a prediction.

## Course Path Map Case

Use the [four-file portfolio](https://github.com/instruction-material/Web-Development-Foundations/tree/5bfdf1b25452fb65aa36d38cea6d836fdf6ae5cc/WDF1-Portfolio-Custom-Domain/basics) to map a reload at `http://127.0.0.1:5173`. Inspect `index.html`, `styles.css`, `main.js`, `#deployment-list` and `#year`. Trace one checklist string to the DOM. Change one card in the Elements panel, reload, then change it in the saved HTML and reload. Name the owner and lifetime of each value.

On a separate diagram design a future “Save note” action with JSON `{"title":"Workshop","body":"Bring paper.","tags":[]}`. Mark where validation, storage, a response and a status message belong. Compare a whitespace-only title, unavailable storage and a response lost after the write. Identify which later modules supply the service and persistence evidence. Explain where a private database setting would belong.

## Local Workflow Case

Use a disposable working copy of the [four-file portfolio](https://github.com/instruction-material/Web-Development-Foundations/tree/5bfdf1b25452fb65aa36d38cea6d836fdf6ae5cc/WDF1-Portfolio-Custom-Domain/basics) starter. Run its README’s loopback dev command. Save the original files and apply one change at a time, restoring it before the next.

| File | Change to investigate |
| --- | --- |
| index.html | Change only the list ID from `deployment-list` to `deployment-items`. |
| styles.css | Replace the grid’s 14rem minimum with 60rem and inspect the grid and viewport widths at 390 CSS pixels. |
| main.js | Change `document.createElement("li")` to `document.createElementX("li")`. |
| index.html | Change only the stylesheet URL to `missing.css`. |

Record the first distinguishing DOM, layout, Console or Network observation for each fault. Compare the list **and** the year in the two JavaScript/selector cases. After recovery, make one intended card-text change. Review the diff, commit that change in the exercise copy, build the selected workspace and inspect the local preview.

## Portfolio Build Case

Open the starter in the [module portfolio](https://github.com/instruction-material/Web-Development-Foundations/tree/5bfdf1b25452fb65aa36d38cea6d836fdf6ae5cc/WDF1-Portfolio-Custom-Domain). Transfer your intended portfolio text from the earlier four-file edition. Add one section for a fictional workshop and complete the existing `validateProjectIdea` function in `project-idea.js` using the README contract.

Preview title `  Supply map  `, type `website`, goal `  Locate the paper bins.  `. Try an empty title and a spaces-only title. Call the validator directly with type `poster` and otherwise valid fields. Submit two different valid ideas, then clear the form. Record normalization, first invalid field and the contents of the preview after each action. Check keyboard order, visible focus, safe literal text, 390/1280 CSS pixels and 200% zoom. From the repository root build and preview `WDF1-Portfolio-Custom-Domain/starter` using its README commands. Confirm the new section, CSS and module still load.

## Front-End State Case

Use the local notification project’s **Workshop** data set (`events.json`). Start with an empty history. Predict the rows and counters after each of these four events, in order:

```json
[
	{ "id": "e1", "sequence": 1, "type": "message", "text": "Workshop opens at 4:00." },
	{ "id": "e2", "sequence": 2, "type": "status", "text": "Room changed to Lab B." },
	{ "id": "e2", "sequence": 2, "type": "status", "text": "duplicate" },
	{ "id": "e3", "sequence": 3, "type": "message", "text": 42 }
]
```

Complete `normalizeEvent` and `applyEvents` in the starter’s `state.mjs`. Each valid record needs an ID, integer sequence, accepted type and text string. Check a previously accepted ID before testing whether a valid sequence is late. Use the module reading for the field bounds.

Select **Load notifications**, then use the keyboard to move among **All**, **Messages** and **Status**. Record which rows remain visible and whether switching views changes the counts. Run **Empty**, **Invalid structure**, **Malformed JSON**, **History limit** and **Delayed events** separately. Predict which failures reach the event validator. From Workshop, disconnect, reconnect and reset. Check the status text, focus and list at narrow and desktop widths.

## Validated API Case

Use the [Contact pack](https://github.com/instruction-material/Web-Development-Foundations/tree/aed8ef2fcd7488c25c0b977b2099640e7431c55a/WDF3-Booking-Contact-App) starter and its JSON-only mail transport. From its complete repository run `npm run start --workspace WDF3-Booking-Contact-App/starter`. Try the form before and after completing `parseContact`. For the completed route, send this JSON to `POST /api/contact` on loopback port 3002 with content type `application/json`:

```json
{"name":"Workshop Host","replyTo":"host@example.invalid","topic":"lesson","message":"Please prepare three notebooks."}
```

Change one input per request: omit `topic`, send the single character `{` as the body, use a 2,001-letter ASCII message, then send the valid body as `text/plain`. From a fresh ten-second window send seven rapid valid submissions. Separately restart with `CONTACT_SCENARIO=fail`, then `CONTACT_SCENARIO=timeout`. Compare health, status, safe error code and the draft on screen. Restart normally and submit once. Record the redacted log fields and distinguish a simulated delivery from an inbox receipt.

## Persistence Boundary Case

Use the WDF6 Notes project with its memory adapter. In the unchanged starter, create and replace return 501 until the two functions in the project reading are complete. Use the completed workspace for the cases below.

1. Send this JSON to `POST /api/notes` with content type `application/json`. Record the returned ID and timestamps.

   ```json
   { "title": "Fictional task", "body": "Local course data", "tags": ["class"] }
   ```

2. Read the returned ID with `GET /api/notes/<id>`. Replace the note with `PUT` at the same URL, retaining its title and changing its body. Compare the ID and creation time before and after. Query `GET /api/notes?title=Fictional%20task` and explain which field an index would use.
3. Predict three outcomes, then try them separately. Create another note with the same title. Submit the original JSON with the extra field `"version": 1`. Read a well-formed UUID absent from the list. Record the status and error code for each.
4. Save `GET /api/notes/snapshot` before deleting anything. Start a separate memory instance on another free loopback port with `NOTES_SEED_FILE` set to the absolute path of that file. Compare the two snapshots by ID, text, tags and timestamps. Delete your note on the restored instance only. Read the note on both instances.
5. Restart the original memory instance without a seed file. Compare its notes with the initial seed. In a disposable copy of the saved snapshot, duplicate a record with the same ID or change `schemaVersion` to an unsupported value. Attempt a separate restore and record the startup result. Keep the working snapshot for recovery.

To test unavailable storage, start a separate instance with `NOTES_SCENARIO=unavailable`. Compare the health and readiness responses with a note read. The same API can also be exercised against the optional isolated MongoDB adapter described in the project reading.

## Deployment Preflight Case

Use the maintained Separate Deployment Lab at source revision
`962d1be3da0d954ad774390b78cb044395a12262`. Its shared README and course reading
supply the complete startup, byte/inventory contracts and shell-specific settings.
Complete `digestBytes` and `assertInventory` in the starter's `release-model.mjs`.
Run the API and static front end independently on their owned loopback ports.
The defaults are API 4001 and front end 4173; `frontend/env.js` names the API,
while `FRONTEND_ORIGIN` permits the page's origin.

Map each process, public route and configuration value. Identify which copied
files make up a front-end artifact, which process still needs the maintained
root dependency lockfile, and why public `env.js` cannot contain credentials.
Retain the normal browser result and API response before changing anything.

From the complete repository root, create a parent `wdf5-releases` folder and run:

```sh
node WDF5-Separate-Deployment-Lab/starter/release.mjs build wdf5-releases/starter-a
node WDF5-Separate-Deployment-Lab/starter/release.mjs verify wdf5-releases/starter-a
```

Keep A unchanged. Serve its copied `serve.mjs` after stopping only the original
front end. Then change the editable source's `apiBaseUrl` to
`http://127.0.0.1:4001/not-a-status-prefix`, build B into a new target, and verify B.
Serve B on the same front-end port. Predict why integrity succeeds while the
browser request fails and the unchanged API's real `/api/status` still works.

Restore A into a separate new target:

```sh
node WDF5-Separate-Deployment-Lab/starter/release.mjs restore wdf5-releases/starter-a wdf5-releases/restored-a
node WDF5-Separate-Deployment-Lab/starter/release.mjs verify wdf5-releases/restored-a
```

Serve the restored target without restarting the API or rebuilding from source.
Compare every retained and restored file, including the manifest bytes. Confirm
that the editable source still contains B's wrong URL until separately corrected.
Change a file in a disposable artifact copy and confirm verification rejects it.

Complete a case table for normal load, wrong allowed origin, stopped API, API
restart, B's bad path, and A's recovery. Record changed value, expected result,
actual URL/status, browser outcome, owned process/port and recovery. Distinguish
static availability, API response, browser CORS acceptance and artifact integrity.
This status API has no database or separate readiness endpoint. Describe private
settings and persistent data as separate backup subjects if added later. Public
hosting is optional and is not established by these local checks.

## Feature Slice Capstone Case

A workshop organizer needs to save one fictional supply note and find it after a page reload. Write the user outcome and three features you will defer. Use the [Notes pack at the course revision](https://github.com/instruction-material/Web-Development-Foundations/tree/8d48a2672e987b5ab1c1b7b93ea395f6da5c37a2/WDF2-Notes-App-with-MongoDB). Complete the two starter functions in its README. From the complete Node 24 repository with its locked dependencies, run `npm run start --workspace=WDF2-Notes-App-with-MongoDB/starter`. Open the loopback URL on port 3001. Use the default memory adapter.

1. Using the keyboard, enter title `Workshop kit`, body `Pack three rulers.` and tags `["supplies"]`. Activate **Create note**. Follow the form values through the request, response and list refresh. Record the returned ID, displayed text and number of matching rows after reload.
2. In the cleared form enter title `Poster box`, body `Pack paper.` and the incomplete tags text `["paper"`. Observe the status, retained fields and Network panel. Correct only the tags and resubmit. Compare that failure with sending `{"title":"  ","body":"Pack paper.","tags":[]}` directly to `POST /api/notes` as JSON.
3. In a separate terminal start the same workspace with `PORT=3003 NOTES_SCENARIO=unavailable` in its environment. Try the valid supply note there. Compare the form and HTTP response with the working instance. Stop the second instance and return to the first. Delete only the two exercise notes and verify the original seed remains. Explain what would survive a browser reload and a fresh unseeded process.

## API Integration Capstone Case

Continue your slice with its own API contract, or use this independent contact-request task. Run the [Booking Contact pack](https://github.com/instruction-material/Web-Development-Foundations/tree/aed8ef2fcd7488c25c0b977b2099640e7431c55a/WDF3-Booking-Contact-App) from the complete Node 24 repository. Finish the starter’s `parseContact` as described in the pack, then run `npm run start --workspace=WDF3-Booking-Contact-App/starter` and open `http://127.0.0.1:3002`. Use the local JSON transport.

Submit this request through the form and send the same JSON to `POST /api/contact` with `Content-Type: application/json`.

```json
{"name":"Workshop Host","replyTo":"host@example.invalid","topic":"project","message":"Please reserve three tables."}
```

Make a table with input, HTTP status and body, UI evidence where the form can produce the case, and the safe log fields. Predict each row before sending it.

- Test an empty JSON object `{}`, a copy with `topic` set to `tables`, the incomplete raw body `{`, the valid body as `text/plain`, and `GET /api/contact`. For an oversized JSON request, replace the message with 9,000 ASCII letters. Use a request client for inputs the form prevents.
- Activate Submit twice while the first submission is pending. Separately send two valid POSTs directly in a fresh ten-second window. Compare the number accepted. In another fresh window send seven rapid valid POSTs and use the response header to time a manual retry. Space the other cases out so this limit does not mask them.
- Restart the owned service with `CONTACT_SCENARIO=fail`, then with `CONTACT_SCENARIO=timeout`. Submit once in each case. Finally stop it while the page is open and submit again. Record which failures have an HTTP response, where the draft remains and what Reset does. Restart normally and try once more. Identify the server delivery deadline, browser deadline, body cap and any stored collection. Check the console for uncaught errors separately from expected failed requests.

## Data Persistence Capstone Case

A workshop needs a restorable inventory of supply notes. Use the [Notes pack](https://github.com/instruction-material/Web-Development-Foundations/tree/8d48a2672e987b5ab1c1b7b93ea395f6da5c37a2/WDF2-Notes-App-with-MongoDB) with the completed starter. From its complete Node 24 repository run `npm run start --workspace=WDF2-Notes-App-with-MongoDB/starter` on default loopback port 3001. Start with the default memory seed and record its ID. Use JSON for writes.

1. Create `{"title":"Blue bin","body":"Two rulers.","tags":["stock"]}` and `{"title":"Red bin","body":"Three clips.","tags":[]}` at `POST /api/notes`. Keep both server-issued IDs. Replace Blue at `PUT /api/notes/<blue-id>` with the same title and body `One ruler.`, omitting tags. Read it by ID and query `GET /api/notes?title=Blue%20bin`. Test the lowercase title separately. Which index would serve this query in the MongoDB adapter?
2. Predict the result of posting Blue again, posting Red with `tags: "stock"` instead of an array, and reading `/api/notes/00000000-0000-4000-8000-000000000099` after confirming that ID is absent. Record status, error and whether existing records changed.
3. Export `GET /api/notes/snapshot` into a new file. Record its schema version, note count, IDs, byte length and SHA-256. Start a separate memory instance with `PORT=3003` and `NOTES_SEED_FILE` set to the absolute snapshot path. Compare all fields in the restored snapshot, then delete Red on the restore target only. Check Red on each port. Stop the original and restart without a seed file. Predict what remains.
4. Change only the schema version to 2 in a copy of the backup and attempt a fresh restore. Retain the known-good file. In a separate run set `NOTES_SCENARIO=unavailable` and compare `/health`, `/api/ready` and `/api/notes`. Describe the migration or reset decision and one limit on concurrent writers.

## Deployment Readiness Capstone Case

Decide whether a workshop can use a candidate release of the [Notes app](https://github.com/instruction-material/Web-Development-Foundations/tree/8d48a2672e987b5ab1c1b7b93ea395f6da5c37a2/WDF2-Notes-App-with-MongoDB). Rehearse on loopback with a completed starter and its memory adapter. Use the full Node 24 repository. Record the source revision, your completed files and their digests, runtime and npm versions, root lockfile digest and startup command. Keep snapshots and private settings outside the public directory.

1. **Retain A.** Run `npm run start --workspace=WDF2-Notes-App-with-MongoDB/starter` on port 3001. In the browser create title `Pickup list`, body `Bring two blue bins.`, tags `["workshop"]`. Freeze writes for the rehearsal. Capture the assigned ID, the page after reload, `GET /health`, `GET /api/ready` and the exact-title query `GET /api/notes?title=Pickup%20list`. Save `GET /api/notes/snapshot` as a new local file and record its length and SHA-256.
2. **Evaluate B.** In a separate terminal run the same completed source with `PORT=3003`, `NOTES_SEED_FILE` set to the absolute snapshot path and `NOTES_SCENARIO=unavailable`. Leave A serving. Compare the static form, health, readiness, list and browser status. Try one valid new note. Record a redacted log event and decide whether traffic should move to B.
3. **Rehearse rollback.** Stop only B. Keep its failure evidence. Restart the retained A source on port 3003 with the same seed file and the known-good memory settings, clearing the unavailable scenario. Before accepting writes, compare the restored snapshot record by record and read Pickup list by its original ID. Verify visible status, keyboard access to Edit and Cancel, and reflow at 200% zoom. Delete the sample from port 3003 only and check the same ID on both ports.
4. Record the rollback trigger, release decision and one risk if writes had continued after backup. Diagram browser, same-origin API, adapter and backup ownership. Give actual request, collection and snapshot limits. For a future split-host setup, identify where TLS would terminate and which browser origin the API would allow; the Separate Deployment Lab demonstrates that distinct configuration. Credit the source pack and identify your changes. Plan a five-minute demonstration using the retained evidence.
