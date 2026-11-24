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

The slice completes one user outcome end to end before adding breadth. Browser, API, and data contracts are named. The happy path, invalid input, unavailable dependency, keyboard path, reset, and one corrected defect are observable. Non-goals prevent authentication, public deployment, and unrelated features from being implied.

## API Integration Capstone Key

The request and response schemas agree with implementation and browser handling. Validation runs before business logic; status and errors are stable; body, collection, timeout, and retry behavior are bounded; logs reveal no secret or raw personal content. Every negative case reaches a deliberate UI and server outcome without an uncaught error.

## Data Persistence Capstone Key

The data model has stable IDs, constraints, deterministic seed data, a query-driven index, and a migration or reset story. CRUD, malformed, duplicate, missing, unavailable, and restart cases are repeatable. Backup and restore use separate targets and an integrity comparison. The report distinguishes demonstrated behavior from remaining consistency limitations.

## Deployment Readiness Capstone Key

The packet can reproduce a clean local start and shows browser, API, data, accessibility, health, log, and smoke evidence. One injected fault is diagnosed from evidence, corrected, restarted, and regression-tested. Restore and rollback have triggers, ordered steps, and post-action checks. Versions, configuration, CORS, proxy, TLS, resource limits, privacy, attribution, and limitations are explicit, and the five-minute demonstration fits the evidence.
