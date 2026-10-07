# Session-note evidence API, schema version 2

This is the next source contract, not a claim of deployment. The native proxy
strips `/api` before Express. Version 2 adds fields and external metadata rows
while retaining the legacy fields. See [OpenAPI](session-note-evidence.openapi.json)
and [rollout and rollback](session-note-evidence-rollout.md).

## Access

`GET /api/session-notes/verification` accepts the existing read-only bearer token
or a current administrator session. Its credential configuration is unchanged;
it grants no send, registration, correction, association, review or account rights.
Tokens belong only in Authorization headers, never URLs or request bodies.

`POST /api/session-notes/evidence` accepts an administrator session with approved
Origin/Referer protection, or a **different** expiring, revocable bearer credential
with scope `register` and an explicit student-ID allowlist. The read-token hash
cannot also configure this key. Machine registration cannot attest, correct,
send mail, change associations or modify accounts.

Create new owner-only files without overwrites or secret output:

```sh
node scripts/create-session-notes-evidence-key.mjs PRIVATE_DIRECTORY COMMA_SEPARATED_STUDENT_IDS
```

The protected server environment receives only the new hash, expiry, scope and
student IDs. Removing the hash revokes access; replacing it rotates access.
Keep the existing read credential and Mongo/Vault/SMTP/IMAP configuration intact.

## Bounded verification

Supply exactly one of `studentId` or `studentName`, inclusive `YYYY-MM-DD` `from`
and `to` dates covering at most 366 days, and optional `limit` (default 50, max 100).
Prefer stable IDs. Exact case-insensitive names remain available for legacy
notes, but conflicting identities return 409. A guardian mailbox, duplicate name
or date alone does not identify a child's session.

Continue `nextCursor` with the same filters until null. Results merge site notes
and registered external evidence, ordered by class date and record ID descending.
A failed page is not an empty result. Do not claim completeness before finishing
pagination.

Every page, including empty results, retains:

- `schemaVersion: 2`, `coverage: site_records_only`, and `coverageSince: null`.
- `coverageDetails.sources`: site_saved_notes, site_smtp_attempts,
  registered_external_metadata.
- `coverageDetails.completeHistoricalCoverage`, `mailboxHistoryQueried`, and
  `expectedSessionsIncluded`: false.
- `statusMeaning`: primary SMTP acceptance is not inbox delivery; unknown,
  absent, saved-only or ambiguous records do not imply overdue mail.

No coverage start date asserts complete history. This API reads no mailbox,
Zoom transcript or booking list to infer sends. It covers saved site notes and
metadata explicitly registered against accounts. A pre-note preparing intent is
in administrator review, not a fabricated note row. Deleted records, unregistered
external mail and expected bookings without notes are outside the population.
Empty means no matching recorded evidence, not `never_sent`.

## Record contract

| Fields | Meaning |
| --- | --- |
| recordId, noteId, recordType | Stable evidence row, optional note, site_note or external_evidence |
| studentId, scheduledSessionId | Local account and booking IDs; null for unlinked/legacy cases |
| classDate | Operator-entered label; never proof of actual session identity |
| actualSessionStartAt, sessionTimezone | Explicit verified association snapshot; no nearest-date matching |
| associationStatus | verified_session or unlinked_review_required |
| sentAt | Site primary-recipient SMTP acceptance completion in UTC, otherwise null |
| externalSentAt | Outside-site observed send time, separately sourced, otherwise null |
| evidenceRecordedAt | Actual evidence/save recording time when known, otherwise null |
| deliverySource | site_smtp, mac_sent_item, admin_attestation, or null |
| deliveryStatus | Legacy smtp_accepted, smtp_rejected, or unknown |
| evidenceStatus, statusReason | Rich evidence state and bounded reason |
| operationId, noteVersion | Safe site operation/version references when present |

Site rows preserve `originalSessionStartAt` and `associationCorrectedAt`.
An audited correction adds the new booking/snapshot without erasing the original
send-intent snapshot or changing sentAt. Scheduled sessions retain old/new time,
timezone and revision history. A saved version is never silently rebound after
rescheduling. External IDs, meeting URLs/passwords, participants and raw source
metadata remain internal. There is no inferred Calendly/calendar/Zoom association.

| evidenceStatus | Interpretation |
| --- | --- |
| saved_not_sent | Version-2 save-only record without a send intent |
| legacy_missing_metadata | Historical note lacks evidence; send outcome unknown |
| preparing, queued, sending | Durable intent preparing, awaiting dispatch, or claimed |
| smtp_accepted | Primary accepted by site SMTP; CC-only acceptance is insufficient |
| smtp_rejected | Explicit primary rejection |
| send_failed | Established nonacceptance or failed identity preflight |
| delivery_unconfirmed | Possible acceptance/orphaned attempt; reconcile, do not blindly resend |
| external_observed | Registered observation of outside-site Sent item |
| external_attested | Weaker administrator attestation |
| external_withdrawn, external_superseded | Append-only correction preserves original evidence |

Creation/update dates, session times, subject dates and checkboxes never populate
sentAt. Legacy accepted timestamps are preserved. External evidence never changes
site delivery metadata or claims inbox delivery.

## External registration and corrections

Strict JSON, maximum 16 KiB, rejects extra fields. Required: studentId, classDate,
source, observedSendAt, evidenceType, evidenceRef, idempotencyKey. Select a
scheduledSessionId or explicit `unlinked:true`. Optional noteId must belong to
the student; session IDs must be that student's booking. Unlinked evidence enters
review before any verified association can be claimed.

Mac observations use `source:mac_sent_item`, `evidenceType:observed_sent_item`.
`evidenceRef` is 64 lowercase hex characters: SHA-256 of a protected local
reference, not a raw mail transport identifier. Retain the original privately.
The timestamp comes from the observed send, never a note date. No bodies,
subjects, addresses, mailbox exports or recordings are accepted.

Equivalent stable keys return the same row; changed payloads return 409. Stable
student/evidenceRef deduplicates key rotation. Administrator corrections require
`replaces`, `correctionReason` (wrong_timestamp, wrong_association, withdrawn),
a new opaque reference and stable key. Old records remain and are marked
superseded. Observed evidence cannot be replaced by a weaker attestation.

## Sending and review

Save-only `POST /api/users/:studentId/session-notes` requires a session ID or
explicit unlinked selection and stores no delivery claim.

Session-note `POST /api/admin-mail/send` requires studentId, noteId, idempotencyKey,
sessionDate, to, subject, md and explicit booking/unlinked selection. Saved content,
recipient and association must match. Retain the key through response loss and
browser reload. Accepted results return 200; pending, ambiguous and tracking
problems return 202 with safe operationId. A 202 does not authorize a fresh resend.

Private administrator routes:

- `GET /api/admin-mail/session-notes/operations/:operationId`: safe status.
- `GET /api/admin-mail/session-notes/review`: bounded queue.
- `POST .../operations/:operationId/disposition`: confirmed_not_accepted,
  keep_unconfirmed or retry_nonaccepted, opaque evidenceRef and stable key. The
  explicit retry queues an existing intent only after established nonacceptance,
  capped at 20 attempts. Ambiguous outcomes cannot use retry_nonaccepted without
  a separate audited finding of nonacceptance. No manufactured acceptance timestamp.
  The same route accepts archive_confirmed_present, archive_confirmed_absent or
  archive_keep_unconfirmed while both sending and recovery are paused. Only
  review_required archives on accepted/rejected operations qualify; proven absence
  queues an archive-only repair, capped at five attempts. SMTP evidence/timestamps
  remain unchanged. Archive uncertainty is listed separately in archivalStatus.
  Dispatch returns the refreshed archival state after optional APPEND. If the
  refresh cannot be read, archivalStatus is null and statusReason is
  archive_tracking_requires_attention; persisted SMTP acceptance remains true.
  This is not authorization to send or append again.
- `POST .../students/:studentId/writer-disposition`: confirmed_process_stopped,
  writer UUID, opaque evidenceRef and stable key. Sending and recovery must be
  paused; active writers cannot be cleared. Old markers never expire automatically.
- `POST .../:noteId/association`: explicit studentId/sessionId and stable key,
  audited old/new association history.

Writes retain approved-origin protection. Neither machine credential can use
these administrator routes.

## Mac client and tracker

`scripts/session-notes-client.py` is the reusable reference client. The actual
standalone Mac consumer is updated from `scripts/session-note-mac/verify_notes.py`
at `/Users/jacobanderson/Documents/Codex/2026-10-03/task/session_note_verification/`.
Its old sources are backed up with a SHA-256 manifest; read credentials and
historical reports are untouched. It retains every page's coverage/meaning/schema,
record and session identity, reasons and separate local Sent observations.
Unsupported versions, changed coverage, repeated cursors, duplicate rows,
redirects and oversized responses fail visibly. Sheet associations require
matching student and actual booking IDs, never classDate alone.

The Mac read credential now lives in the workflow's owner-only
`private/classes-session-notes-read-only.json`, outside the repository and
Downloads. Its value and server-side read-only authorization are unchanged.
The client supports an explicit `--credential-file` override and refuses unsafe
local credential files before making a request.

```sh
python3 scripts/session-notes-client.py --api https://example.com/api --token-file PRIVATE_READ_TOKEN verify --student-id 507f1f77bcf86cd799439011 --from 2026-09-01 --to 2026-09-30
python3 scripts/session-notes-client.py --api https://example.com/api --token-file PRIVATE_REGISTRATION_TOKEN register --metadata-file PRIVATE_METADATA_JSON
```

Both token files must be owner-only. Keep read and registration credentials
separate. The installed client now requires this schema-v2 contract and fails visibly
until the server operator deploys it. Registration remains an explicit separate
action after its distinct credential is provisioned. See the Mac adapter README
for bindings, pagination and preserved local Sent observations.

Session Notes remains the actual sent date in the tracker timezone. Done remains
the operator's finalization decision, including free/no-notes exceptions.
Unknown/saved-only evidence is incomplete evidence, not overdue mail. This client
never sends email or finalizes entries.

## Errors and privacy

Read: 400 invalid query; 401 invalid bearer; 403 missing admin; 405 mutation;
409 ambiguous identity; 429 rate limit; 503 unavailable evidence.
Registration additionally rejects missing student (404), ownership/key conflicts
(409), excessive bodies (413), insufficient scope or origin (403).

Read queries remain GET/HEAD-only, no-store, 60/minute/IP and bounded to two seconds.
Registration is 20/minute/IP plus existing ingress controls. Positive projections
and serializers exclude private contents, addresses, subjects, transport IDs,
credentials and meeting secrets. Errors and operational signals are allowlisted.
