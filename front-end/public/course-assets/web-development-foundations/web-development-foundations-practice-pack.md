# Web Development Foundations Practice Pack

Use fictional data and localhost throughout. Record expected behavior before running a case, then add the observed result, evidence location, correction, and retest. Public accounts, live SMTP, cloud databases, custom domains, and public deployment are optional and never needed to complete this pack.

## Toolchain Preflight Case

- Record the operating system, Node.js 24 LTS version, npm version, repository revision, package file, and lockfile state.
- Identify the documented install, development, build, preview, and start scripts without running an invented command.
- Start the project on loopback, capture the page, terminal state, browser console, and network result, then stop it cleanly.
- Introduce or inspect one safe startup failure, state the first useful evidence, correct it, and repeat the clean start.

## Course Path Map Case

Trace a fictional contact request from a labeled browser control through client state, HTTP request, server validation, persistence or test transport, response, rendered status, deployment configuration, and logs. Mark:

- data owner and data shape at each boundary;
- trusted and untrusted input;
- secret location;
- expected failure and recovery evidence;
- course module that teaches the missing skill.

## Local Workflow Case

Move a supplied browser feature into a project with named HTML, CSS, JavaScript, asset, and configuration files. Inspect or initialize Git, run the recorded npm script, and diagnose:

1. one markup or accessibility defect;
2. one layout defect;
3. one JavaScript state defect;
4. one missing or failed request.

Save the diff, commit message, browser evidence, wrong hypothesis, correction, and clean retest.

## Portfolio Build Case

Use the portfolio scaffold to add one original section and one fictional contact or project-interest form.

- Keep headings, landmarks, labels, focus, source order, and safe text explicit.
- Separate source assets from generated output.
- Build with the scaffolded Vite version.
- Check keyboard operation, 200% zoom, a narrow viewport, a desktop viewport, console state, asset paths, and the locally previewed build.

## Front-End State Case

Build a multi-view notification interface from this bounded event sequence:

```json
[
	{ "id": "e1", "type": "message", "text": "Workshop opens at 4:00." },
	{ "id": "e2", "type": "status", "text": "Room changed to Lab B." },
	{ "id": "e2", "type": "status", "text": "duplicate" },
	{ "type": "message", "text": 42 }
]
```

Model ready, loading, connected, empty, error, reconnecting, and reset states. Normalize events before state changes, reject malformed or duplicate records, cap visible history, render text safely, and verify keyboard, pointer, focus, status, reduced-motion, and narrow-width behavior.

## Validated API Case

Define a fictional contact request with `name`, `replyTo`, `topic`, and `message`. Implement or analyze a loopback Express route with a stream or test email transport.

Test valid, missing, malformed, overlength, wrong-content-type, repeated, timeout, and simulated-delivery-failure requests. Record expected status and body, observed status and body, redacted log event, health response, shutdown, restart, and recovery. No real address or SMTP credential is used.

## Persistence Boundary Case

Use this versioned note shape:

```json
{ "version": 1, "id": "n1", "title": "Fictional task", "body": "Local course data", "tags": ["class"] }
```

Implement the contract with an in-memory adapter first. Optionally repeat against isolated local MongoDB. Test deterministic seed, create, read, update, delete, duplicate ID, malformed record, unknown ID, unavailable adapter, restart, reset or migration, backup, restore to a separate target, and integrity comparison. Tie one index to one named query.

## Deployment Preflight Case

Use the maintained Separate Deployment Lab at source revision
`781eba647bbdcb3f89aa0417011dabe2fca30d53`. Its shared README and course reading
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

Choose one fictional task and write a one-sentence user outcome plus three non-goals. Complete the thinnest useful route from semantic browser control through state, validated API, local data adapter, response, rendered status, and reset. Record the happy path, invalid input, dependency failure, keyboard path, correction, and one limitation before adding another feature.

## API Integration Capstone Case

Add a documented request schema, response schema, status table, timeout, body and collection limits, one redacted log event, and browser states to the feature slice. Verify valid, invalid, empty, malformed, oversized, wrong method, wrong content type, timeout, unavailable service, duplicate action, recovery, and clean browser and server consoles.

## Data Persistence Capstone Case

Add a persistence model with deterministic seed data, stable IDs, one constraint, one query-driven index, and a version or migration note. Verify CRUD, malformed and duplicate records, unavailable storage, restart, backup manifest, restore into a separate target, integrity comparison, reset, and remaining consistency limits. A supplied adapter remains valid when MongoDB is unavailable.

## Deployment Readiness Capstone Case

Create a release-and-recovery packet for one local full-stack project:

1. runtime and dependency manifest;
2. architecture, request, data, environment, proxy, CORS, and TLS maps;
3. browser, API, persistence, accessibility, and smoke matrix;
4. redacted logs, health and readiness, resource caps, backup, and restore;
5. injected fault, evidence, correction, restart, and regression check;
6. rollback trigger, rollback steps, post-rollback verification, privacy, attribution, limitations, and a five-minute demonstration plan.
