# Web Development Foundations Verification Guide

Compare only after completing the matching practice case. Equivalent implementations are valid when they preserve the same contracts, boundaries, evidence, and recovery path.

## Toolchain Preflight Key

A complete record names Node.js 24 LTS, npm, operating system, repository revision, package and lockfile state, exact documented script, localhost URL, expected page, observed page, console and terminal state, clean stop, one failed start, first useful evidence, correction, and successful retest. Global packages and editor extensions are not hidden project dependencies.

## Course Path Map Key

The trace starts with a semantic control and ends with observable release evidence. Each boundary names its data shape, owner, trust level, failure, and recovery signal. Browser code contains no secret. Authentication, live delivery, cloud persistence, and public deployment are labeled later responsibilities rather than implied capabilities.

## Local Workflow Key

The project separates source, configuration, dependencies, generated output, and ignored secrets. The Git diff contains only intended work. Browser and terminal evidence precedes each correction. The final state has a useful commit message, clean console, successful network result, repeatable script, and documented reset.

## Portfolio Build Key

The source uses semantic landmarks and headings, native labeled controls, visible focus, safe text, and a useful reading order. The Vite build succeeds with the recorded scaffold version. Keyboard, 200% zoom, narrow and desktop layout, console, asset, and local preview checks all have observed results and any limitation is explicit.

## Front-End State Key

For Workshop, the first two records add e1 and e2. The third is a valid record with a known ID, so it increases the duplicate count even though its sequence also matches e2. The fourth has numeric text, so it increases the rejected count. The accepted sequence remains 2. All shows both rows, Messages shows e1 and Status shows e2. Filtering preserves both counts.

| Data set or action | Expected observation |
| --- | --- |
| Empty | No entries or errors. A successful empty batch produces the empty state. |
| Invalid structure | JSON parsing succeeds. The batch check rejects the non-array before individual records are processed. |
| Malformed JSON | Parsing fails before any batch or record validation. |
| History limit | Fifteen valid events arrive. The ten retained IDs are e6 through e15. |
| Delayed events | Only e2 and e3 enter history. A late e1 is rejected and the repeated e2 is counted as a duplicate. |
| Disconnect, reconnect, reset | Disconnect shows the disconnected state. Reconnect reloads the selected fixture into fresh counts. Reset clears history and returns to ready. |

Render event text as text, retain keyboard focus during updates, and make status changes available to assistive technology. In this local client a connected state records a successful fixture load.

## Validated API Key

The loopback service rejects missing, malformed, overlength, wrong-content-type, and excessive requests before delivery logic. Success and failure bodies use stable safe shapes. Logs redact message and address content. The test transport proves delivery behavior without SMTP. Health, shutdown, restart, timeout, provider failure, and recovery are reproducible.

## Persistence Boundary Key

The create request supplies `title`, `body` and optional `tags`. The completed service returns 201 and assigns a UUID and timestamps. A full replacement returns 200 and keeps the ID and creation time. Looking up the exact, case-sensitive title returns the updated record. The MongoDB adapter has a unique title index for this query.

| Observation | Expected result |
| --- | --- |
| Create the same title twice | The second request returns 409 `note_conflict`. |
| Include `version` or an `id` in a create request | 400 `invalid_note`. The request contains an unknown field. |
| Read an absent, well-formed UUID | 404 `note_not_found`. A malformed ID such as `n1` instead returns 400 `invalid_id`. |
| Export and restore into a second memory instance | The snapshot has the shape `{ "schemaVersion": 1, "notes": [...] }`. Each restored record retains its UUID, creation time, update time and field values. |
| Delete only on the restored instance | DELETE returns 204 with an empty body. The next read there returns 404. The original still returns 200 for the same ID. |
| Restart memory without a seed file | The default fictional seed returns. Saving a snapshot alone does not load it at startup. |
| Restore an unsupported version or a duplicate ID | Validation rejects the snapshot before the new instance starts serving. The original file remains usable. |
| Run the unavailable-storage scenario | The process health endpoint responds. Readiness and note reads return 503. Restarting with the normal memory adapter restores service. |

## Deployment Preflight Key

The front end serves public files on loopback 4173; the independent API serves
`/api/status` on loopback 4001. The browser reads `env.js` before `main.js`, then
requests the API base URL plus `/api/status`. The API's allowed origin describes
the page, not the API. Public configuration contains no credential. Backend
source, private settings and the artifact manifest are not static routes.

| Case | Expected evidence and explanation |
| --- | --- |
| Normal startup | The selected-role API message appears in the page. The native API response is 200 and its CORS response permits the actual page origin. |
| Wrong allowed origin | Restarting only the API with another `FRONTEND_ORIGIN` can leave a native 200 response while the real browser refuses access. Restore the correct value and restart the owned API. |
| Stopped API | The static page still loads and reports an API error. Restarting the API at its original port and origin restores the message. |
| Retained A | `build` and `verify` exit zero with `ok: true` and a manifest digest; the copied front end works with the existing API. |
| Consistently built B | Its manifest matches the saved wrong configuration, so integrity passes. The browser requests `/not-a-status-prefix/api/status` and reports an error, although the real API status route still succeeds. |
| Restored A | `restore` writes a new target and retains A's original manifest bytes. Every file matches A, the page works again, and the API process was not restarted during this front-end rollback. The edited source still has B's URL. |
| Changed copy | Altering `main.js` without changing its manifest makes `verify` fail with `artifact_integrity_mismatch`. A remains unchanged; restoring from the corrupt copy fails before creating the destination. |

`digestBytes` hashes bytes directly with SHA-256. Inventory comparison rejects
unequal lengths, duplicate names, changed lengths and changed digests; ordering
alone makes no difference and neither input is mutated. Validation also rejects
unknown files, malformed manifests and the wrong role. Existing output targets
and targets inside the source artifact are refused.

The rollback trigger is a failed acceptance case with retained working A.
Recovery verifies A, restores its bytes to a separate target, switches only the
front-end process, then checks browser and API behavior. It does not rebuild A
from the broken working tree. A checksum is consistency evidence, not proof of
who built the artifact, and API process startup is not dependency readiness.

A's retained public files do not back up private API settings or data added by
another project. A database-backed extension needs its own compatible data
backup and separately verified restore. DNS, TLS termination, proxy route/trust,
listener exposure, logs and resource limits must be checked in an actual chosen
public environment before claiming public deployment. The local lab makes no
such activation or authenticated-provenance claim.

## Feature Slice Capstone Key

One outcome is “Save the supply list and find it again in this session.” Accounts, shared editing and permanent storage can wait. Keyboard submission serializes the three labeled fields as JSON. The server validates them before the memory adapter assigns a UUID and timestamps. A successful POST returns 201. The client clears the form, fetches the list and displays **Note saved.** Reloading the page reads the same process and shows one Workshop kit with its original ID.

The incomplete tags string fails in the browser with `Request failed: invalid_tags_json`. The draft remains and no POST appears in the Network panel. Closing the array and submitting creates exactly one Poster box. Whitespace-only title in the direct JSON request instead reaches the server and returns 400 `{"error":"invalid_note"}`. On the unavailable instance a valid POST returns 503 `storage_unavailable`; the form retains the draft and unlocks. Confirm the first instance still holds its two records. Delete those by ID (204 each), refresh and find only **Fictional observation**. A fresh unseeded memory process also starts with that seed. Record the observed focus and control reachability on the actual keyboard run.

## API Integration Capstone Key

The form accepts a trimmed name (2–80 UTF-16 code units), a trimmed reply address matching the pack’s address rule (up to 254), topic `project` or `lesson`, and a trimmed message (10–2000). The server rejects extra keys. A response to valid input is 202 `{"ok":true,"delivery":"simulated"}`. The page says **Recorded locally. No email was sent.** One corresponding log is `{"event":"contact_request","status":202,"outcome":"simulated"}`. Neither contact text nor address belongs in the log.

| Input or condition | Worked outcome |
| --- | --- |
| Empty object / unknown topic | Both return 400 `invalid_contact`. The empty object identifies all four missing fields. The unknown topic yields `{"ok":false,"error":{"code":"invalid_contact","fields":["topic"]}}`. |
| Incomplete JSON / wrong content type | 400 `invalid_json` / 415 `unsupported_media_type`. The transport receives neither request. |
| 9,000-letter message / GET | The serialized body exceeds 8,192 bytes: 413 `body_too_large` before field validation. GET returns 405 `method_not_allowed` with `Allow: POST`. |
| Two activations / two independent POSTs | While pending, the form disables Submit. Two independent valid POSTs inside the budget can both return 202. The service stores no contact collection or idempotency key. |
| Seven rapid POSTs in a fresh window | Six can return 202. The seventh returns 429 `rate_limited` with `Retry-After` in seconds. A manual submission in the next window succeeds. |
| Failure / simulated delay | 503 `delivery_unavailable` / 504 `delivery_timeout`. The server’s delivery deadline is 750 ms. The form retains the values and offers a manual retry. `GET /health` can still return 200 in either scenario. |
| Stopped service / recovery | The open page reports that it could not reach the server. There is no HTTP status for that failed connection. The browser separately bounds its wait at two seconds. Reset clears the form and status. A normal restart and one valid submission restore 202. |

The tested budget is six POST attempts per process per ten seconds, including invalid POSTs. Distinguish expected failed requests in the Network panel from uncaught exceptions. Record only the console and UI outcomes actually observed.

## Data Persistence Capstone Key

A fresh unseeded store contains **Fictional observation** (UUID ending in `000001`). Creating Blue and Red gives 201 twice and three records including the seed. Capture the two assigned UUIDs. Blue’s full replacement returns 200, retains its ID and creation time, has a nondecreasing update time, and returns `body: "One ruler."` and `tags: []`. The exact-title query returns that row; lowercase `blue bin` returns an empty array. The memory adapter scans its in-memory records. The optional MongoDB adapter has a unique title index for that query.

| Test | Result to compare |
| --- | --- |
| Duplicate Blue / Red with string tags / absent well-formed ID | 409 `note_conflict` / 400 `invalid_note` / 404 `note_not_found`. The failed writes leave three records. |
| Saved snapshot | `schemaVersion: 1` and three notes ordered by ID. Record the length and SHA-256 of the exact file you saved. Generated IDs and timestamps make the digest specific to this run. |
| Separate restore | Match every ID, title, body, tag and both timestamps to the saved snapshot. Red deletion returns 204 on port 3003. Red then reads 404 there and 200 on port 3001. |
| Fresh unseeded restart | Only the original seed returns. The snapshot file remains available for explicit restore. |
| Version 2 copy / unavailable adapter | The incompatible snapshot is rejected before a new listener is ready. Keep v1 and document migration before accepting a new schema. With the unavailable adapter, health is 200, readiness is 503 with `ready: false`, and a list read returns 503 `storage_unavailable`. |

The memory route demonstrates independent restore and reset. For durability across an API restart, test the optional isolated MongoDB adapter with the same database. The pack bounds the collection at 50 and serializes writes inside one service process; this exercise establishes no ordering across independent writers.

## Deployment Readiness Capstone Key

**Hold B and keep A serving.** The two releases in this rehearsal use the same application bytes. Their runtime settings differ. Deployment evidence should identify both. A’s static form and API share `http://127.0.0.1:3001`. The browser submits JSON to the same origin, the adapter owns the records and the operator retains the snapshot. A digest of the lockfile or source alone cannot recover Pickup list.

| Check | A on 3001 | B on 3003 | After rollback on 3003 |
| --- | --- | --- | --- |
| Static form and process health | Page loads; health is 200 | Page still loads; health is 200 | Page loads; health is 200 |
| `/api/ready` and list | 200 ready; seed plus Pickup list | 503 with `ready: false`; list returns 503 `storage_unavailable` | 200 ready; both saved records return |
| Browser and write | Create returns 201; reload shows the saved note | A valid write returns 503. The form retains its draft and shows the failure | Restored Pickup list has the original ID, text, tags and timestamps. Edit then Cancel leaves them unchanged. |
| Isolation | A remains available throughout | Keep traffic on A | Delete on 3003 returns 204. The next read of that ID is 404 there and still 200 on 3001. |

B’s startup record establishes that the listener opened. A subsequent log such as `{"event":"request","status":503}`, the readiness body and the browser failure identify the storage boundary. The rollback restores the known-good settings and retained snapshot before writes resume. Compare the backup’s digest with the recorded digest; compare the restored *records* with its parsed contents. An unseeded memory restart loses the workshop note. Writes accepted after the snapshot would need reconciliation.

The JSON request limit is 16 KiB, the collection limit is 50 notes and the seed file limit is 1 MiB. Record the actual keyboard and zoom results. No cross-origin request or TLS termination occurs on this loopback path. A split-host plan would name the static origin permitted by the API and the proxy terminating TLS. The [Separate Deployment Lab](https://github.com/instruction-material/Web-Development-Foundations/tree/962d1be3da0d954ad774390b78cb044395a12262/WDF5-Separate-Deployment-Lab) restores static files and their manifest separately from any data backup.

A five-minute demonstration can spend one minute on A and its manifest, one on the saved note and backup, one comparing B’s healthy process with its failed readiness, one restoring and comparing the records, and one on the traffic decision, data-loss window and limits of local verification.
