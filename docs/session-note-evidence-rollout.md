# Durable session-note evidence: release and operator acceptance

## Scope and release identity

This source milestone follows the operator-supplied production baseline v2.8.12
(b6c34b8a27f6123cd6faaa5235e858855b39f96c). No live deployment, secret changes,
student backfill or email sends are part of this source task. The release tag
and GitHub release identify the exact candidate; the annotated tag must never
be moved after publication. Use the matching [API contract](session-note-verification-api.md)
and [OpenAPI](session-note-evidence.openapi.json).

## Persistence and recovery

SessionNoteSend is a protected, versioned outbox document, not a public mail log.
It contains a frozen note/primary recipient, local operation UUID, SHA-256 key and
payload digests, stable private Message-ID, claim, attempt and disposition history.
Persist it and the saved note before SMTP. Unique actor/key and note/version indexes
and a unique noteId reservation (one intent per immutable saved version)
plus atomic conditional claims prevent two workers dispatching the same intent.
Journaled majority acknowledgments are required. No new multi-document transactions,
replica-set conversion, worker pool, Docker or compilation service is introduced.

Transitions: preparing -> queued -> sending -> smtp_accepted, smtp_rejected,
send_failed or delivery_unconfirmed. Preparing failures send nothing; equivalent
HTTP retries resume preparation. Failed or uncertain attempts never automatically
return to queued. Same-key changed payloads fail closed. Save-only notes have no
SMTP claim. Legacy notes retain their historical fields without invented evidence.

The SMTP outcome is durably recorded before projecting legacy delivery metadata
and before optional IMAP append. The outbox remains authoritative if projection
fails. Acceptance tracking failure returns 202, safe operation ID and reconciliation
reason instead of ordinary send failure. Post-DATA timeout or crash leaves the
attempt unconfirmed and prevents HTTP/restart resend. A stable Message-ID is a
correlation aid, not a receiving-server deduplication guarantee. Exactly-once
mail delivery is not claimed.

Durable note sends use the existing primary SMTP configuration, with no automatic
transport fallback. Explicit nonacceptance remains separately classified; an
operator may explicitly queue an audited retry after established nonacceptance,
limited to 20 attempts. Unconfirmed outcomes remain blocked until a separate
audited disposition establishes nonacceptance. No automatic resend is scheduled.
CC-only acceptance is not primary acceptance. Other administrator mail retains fallback only after
established nonacceptance and does not create session-note evidence.

Archive states: pending -> archiving -> archived, retry or review_required.
Only archival work retries after a confirmed failure, at most five attempts with
exponential delay (120, 240, 480, 960 seconds). A crash/uncertain append is retained
for review rather than risking an automatic duplicate archive. SMTP never retries
because IMAP failed. The SMTP payload remains protected in the outbox for recovery;
ordinary logs and read APIs never expose it.

An IMAP connection failure before APPEND, a tagged NO/BAD response, or an
explicit false APPEND result establishes nonacceptance. A timeout after APPEND
starts, missing acknowledgment, or failure recording a successful APPEND goes
to review; none schedules another append. A successful APPEND stays confirmed
even if logout fails. Classification follows the maintained
[ImapFlow contract](https://imapflow.com/docs/api/imapflow-client/).

Successful APPEND is checked against its returned `destination`, with the
authenticated server's namespace prefix applied to the intended mailbox. The
optional `path` describes the selected mailbox and is not confirmation of the
destination. UID information is optional. A different destination stays
unconfirmed. Dispatch refreshes the persisted archive state before responding;
an unreadable refresh preserves SMTP acceptance and reports unknown archival
status, never ordinary send failure.

The compose action is now simply Send. Preview remains optional. Missing fields
receive inline validation rather than a silently disabled button. Selecting the
first student keeps an existing draft; switching an already-associated draft
still requires confirmation. Durable identity and idempotency checks remain.

Do not backfill or retry existing successful messages for this source repair.
Archive-review records with independently verified Sent copies require the
existing audited `archive_confirmed_present` action, after both pause gates and
protected evidence verification. No new APPEND or SMTP attempt is warranted.

October 7 source-repair acceptance used synthetic identities only: 370 backend
tests passed (one existing test skipped), 18 focused mail/workspace client tests
passed, and all 11 compact-workspace browser checks passed. The browser send
regression intercepts both note-save and send requests; backend delivery tests
use an isolated standalone database, non-relaying SMTP sink and fake IMAP.
Lint, typecheck, production build and existing root lock provenance passed.
No production records, mailboxes, credentials, runtime or pause flags changed.
No schema/index migration is needed for this repair. Deploy the immutable new
release through the existing native workflow; retain the previous artifact for
rollback. The operator must separately reverify protected Sent evidence and use
the audited disposition. Missing historical session records remain unlinked.

The administrator review includes archival uncertainty even when the note's
student/session association is already resolved. With both sending and recovery
paused, an administrator can record `archive_confirmed_present`,
`archive_confirmed_absent`, or `archive_keep_unconfirmed` against an opaque
protected-evidence reference. Present marks only the archive complete; proven
absence queues only an archive repair, capped at five total attempts. These
idempotent, audited actions never change SMTP acceptance or its timestamp and
cannot be authorized by either the read token or external-registration token.

## Worker and bounded operational monitoring

One in-process timer runs within the existing classes-api.service, every 30 seconds,
without overlap. No second service or exposed listener is needed. Set:

```text
SESSION_NOTES_SEND_ENABLED=false
SESSION_NOTES_WORKER_ENABLED=false
```

Keep both false during rehearsal/initial acceptance. Set only WORKER_ENABLED=true
to reconcile and monitor with SMTP and IMAP disabled. Set SEND_ENABLED=true only
once the operator approves real delivery after acceptance; it also starts recovery.
No existing credentials are replaced. Missing/invalid flags do not enable sends.

Each recovery cycle handles at most 20 orphaned sends, 20 orphaned archives, five
queued sends and five archive repairs. Sending/archiving claims older than 120
seconds become unconfirmed/review, never queued. Queued work older than five
minutes emits a persisted once-per-operation stale signal. Confirmed operation
states retain their history. The administrator review page resolves explicit
associations and records manual nonacceptance/unconfirmed disposition; it does
not manufacture SMTP timestamps; explicit retry_nonaccepted queues the existing
intent only when nonacceptance is established.

Operational events contain only event=session_note_workflow, safe local
operationId and an allowlisted code. In-process deduplication is bounded to
1,000 entries and one event/code/operation/hour; persistent state transition and
signalAt prevent repeated orphan/stale alerts after restarts. Codes include
smtp_tracking_reconciliation_required, orphaned_smtp_attempt,
smtp_outcome_ambiguous, queued_send_stale, note_projection_pending,
archive_tracking_requires_attention, archive_outcome_ambiguous and
recovery_unavailable and writer_release_requires_review. Connect these journal events to the existing protected
monitoring policy; do not email students or dump raw transport errors. Repeated
worker-level failures are deduplicated. No new automatic alert emails are sent.

## Index-only migration and backup rehearsal

New collections: sessionnotesends and sessionnoteevidences. SessionNote gains
optional workflow/session snapshot/correction fields; ScheduledSession gains
revision and schedule-history fields. Old records require no field rewrite.
There are no TTL indexes or destructive cleanup. The existing explicit account
removal sweep includes both new collections, within its existing transaction
contract; this feature does not introduce that pre-existing transaction requirement.

Account deletion/promotion atomically fences the existing User document against
active note/evidence/SMTP writers. New private User marker/audit fields require no
backfill. Markers are capped at 32, never automatically expire, and block account
removal after a crash. The private review queue exposes at most 100 stale markers.
An administrator can record confirmed_process_stopped with protected evidence,
a stable key and at most 20 dispositions only while sending/recovery are paused
and the writer is not active. Verify the old process is stopped before disposition;
there is exactly one API service, not a distributed writer pool.

Declared unique indexes:

- sessionnotesends: actorId/keyHash, noteId/noteVersion and noteId.
- sessionnoteevidences: actorId/keyHash, studentId/evidenceRef, and partial string
  replaces (one successor per correction).

Other declared indexes support student/date pagination, operation state/recovery
and archive retry queries. Retain all pre-existing indexes. Index creation fails
closed on incompatible pre-existing duplicate records; do not delete them to make
an index succeed. Save and send routes enforce declared workflow indexes before
using the new unique-key contract.

The operator must first restore a verified backup to a protected production copy,
with mail disabled and SMTP/IMAP egress denied. This source task ran only an
isolated synthetic protected-copy rehearsal, **not a production-copy rehearsal**.
Do not infer historical student outcomes from the test fixtures.

Use an owner-only backup manifest outside source/public trees:

```json
{"backupVerified":true,"archivePath":"/protected/backup.archive","sha256":"<actual-64-hex-backup-digest>"}
```

The flag means the operator has independently verified backup/restore recovery.
The utility also checks nonempty archive bytes and their actual SHA-256. Provide
SESSION_NOTE_MIGRATION_URI explicitly, using a protected copy whose database name
contains protected_copy, rehearsal or restore. No fallback to the live URI occurs.
Provide SESSION_NOTE_BACKUP_MANIFEST and keep sending disabled. Then run from the
trusted source/tagged artifact (maintenance does not import the server or mail):

```sh
node back-end/dist/maintenance/sessionNoteIndexes.js --apply --rehearsal
node back-end/dist/maintenance/sessionNoteIndexes.js --check --rehearsal
```

Source development equivalent uses node --import tsx with the .ts path. The utility
fingerprints all four collections before/after, streams in bounded batches,
checks declared unique indexes, and prints counts/digests only. It refuses more
than two million records or ten minutes of fingerprinting; split/review a larger
copy before use. Application writes must be paused during comparison. A successful
index-only migration preserves bodies, legacy fields and every timestamp exactly.
Every --apply, including live application after reviewed rehearsal, requires the
verified backup manifest. No historical backfill, evidence import or resend occurs.

## Native candidate and host acceptance

1. Finish local synthetic gates, commit/push and publish a fresh annotated v2 tag.
   Build the exact Linux ARM64 archive/manifest via native-release.yml and retain
   the signed provenance bundle on its immutable GitHub release. Local builds are
   validation outputs, not production artifacts.
2. Complete the protected production-copy rehearsal and consuming Mac schema-v2
   acceptance. Preserve its verified local Sent evidence and independently sourced
   timestamps. The standalone Mac consumer at
   /Users/jacobanderson/Documents/Codex/2026-10-03/task/session_note_verification/
   is updated and synthetic-tested, with original source backups. Its historical
   reports and read credential are preserved; no production query was rerun.
3. Use the established native promote script from an independently trusted tagged
   checkout and the unchanged, verified artifact. Preserve existing Nginx static
   404/API JSON boundaries, credentials, data/backups and previous release. No DNS,
   TLS, database topology or unrelated configuration changes.
4. Verify the **effective** systemd ExecStart still uses
   /opt/node-24.18.0/bin/node under account classes on 127.0.0.1:3008. Preserve the
   existing runtime drop-in; do not silently accept a unit default changing it.
   The source runtime/package pins remain Node 24.18.0/npm 12.0.1.
5. With mail disabled, verify health/readiness over loopback and IPv4/IPv6 origin
   HTTPS, unauthenticated denial, existing read token on bounded synthetic evidence,
   v2/empty/page coverage, no-store/privacy projections and denied write attempts.
   Validate fake SMTP/IMAP crash recovery on the protected copy, never production
   recipients. Do not create synthetic student records in the real student database.
6. Enable the worker in paused-send mode, inspect bounded recovery/review events,
   then separately enable site sending after acceptance. Do not generate client or
   administrator email as a smoke test.

## Rollback

Disable sending and worker dispatch before rollback; preserve the outbox and
registered evidence, especially uncertain claims. Drain/stop the API so there
are no active SMTP calls. Block /api/admin-mail/send at the existing native proxy
before activating v2.8.12: the older artifact does not recognize the new pause
flag and must not resume its unsafe send path. Keep that deny rule until durable
sending is restored. Read-only verification can be retained in the new artifact
if a front-end rollback suffices; schema-2 clients fail visibly on old schema.

Use the native promoter's prior-release/config restoration mechanism. Verify the
same runtime, loopback and origin health/privacy checks. Do not drop new
collections/indexes, delete pending intents, rewrite accepted evidence or requeue
ambiguous attempts. Do not replace secrets or restore an old database over newer
evidence. On forward recovery, inspect unresolved operations with protected mail
evidence and record an explicit administrator disposition/metadata correction.

## Source validation report

Candidate release: **v2.8.14**, extending the durable evidence milestone v2.8.13
with safe archival reconciliation. The annotated tag and GitHub release resolve
its exact commit; all previously published tags remain immutable. Artifact provenance is verified
separately against that same commit/tag before publication.

Local final gates on October 4, 2026:

- Complete backend suite: **341/341 tests passed**, 35 files, including the
  existing real promotion/demotion transaction/hash test on an isolated local
  replica-set fixture. The new outbox/recovery suite separately uses standalone
  MongoDB, demonstrating that note sending does not require transactions.
- Durable/evidence fixture suite: **40 tests passed**, including pre-send
  persistence failure, concurrent requests, DATA timeout, forced process kill,
  acceptance tracking failure, CC-only acceptance, fake IMAP failures, scope/CSRF,
  corrected associations, DST/shared mailbox identity, bounded stale monitoring,
  account writer fencing and withdrawn evidence.
- Archival acknowledgment classification: **12/12 tests passed**, including
  pre-APPEND failure, tagged rejection, missing acknowledgment, timeout and
  confirmed APPEND with failed logout. The fixture additionally covers successful
  APPEND followed by database failure, no automatic duplicate append, protected
  manual disposition and archive-only retries.
- Focused administrator-review/composer/preview/persisted-key suites: **15/15
  tests passed**.
- Reference Python client: **8/8**; Mac adapter: **8/8**, also rerun against its
  installed source. Installation hashes match the maintained sources. Original
  Mac scripts have owner-only backups and a SHA-256 manifest.
- Root lint, typecheck and complete client/server build passed. The build retains
  a pre-existing unrelated Java worker IIFE/import.meta warning.
- OpenAPI JSON parsed and all **56** local references resolved. Root registry
  lock provenance checked: 1,160 occurrences across 999 names, zero changes.
  Both lockfiles/manifests are unchanged; no dependency refresh was performed.

These are source/local validation results. Native CI/provenance, protected
production-copy rehearsal and effective-host acceptance are separate gates;
a synthetic backup rehearsal does not establish production backup verification.

Fixtures use synthetic accounts in an isolated standalone local mongod,
a non-relaying loopback SMTP sink, and fake IMAP. A child process is killed after
SMTP DATA acceptance to exercise recovery. No client/admin email, production
mailbox, Zoom recording, production records, host runtime or service state is used.

## Acceptance coverage map

The following are synthetic source acceptance checks. Test names identify the
cases in `back-end/test/session-note-durable.spec.test.ts` unless another file
is named. A test observing one dispatch is fixture evidence, not a claim of
exactly-once SMTP delivery.

| Required gate | Source evidence |
| --- | --- |
| Database failure before mail | does not contact SMTP if intent persistence fails; note-persistence failure resumes preparation |
| Concurrent equivalent requests | atomically deduplicates concurrent equivalent requests and dispatches once |
| Acceptance then persistence failure or process kill | accepted-but-unrecorded tracking trouble; process killed following SMTP acceptance, no second send |
| Ambiguous timeout after DATA | does not blindly fail over or resend a DATA timeout |
| Primary rejection / CC-only acceptance | does not mark primary acceptance when only CC was accepted; `session-note-delivery.spec.test.ts` explicit rejection precedence |
| IMAP failure affects only archive | retries archival alone; uncertain APPEND and successful APPEND tracking failure stay under review |
| Save-only / legacy / external status | distinguishes save-only from legacy; external metadata registration and withdrawn evidence preserve honest provenance |
| Saved note then sent | preserves existing saved note; HTTP save/send uses exactly that version and explicit session identity |
| Midnight / timezone / DST / reschedule | midnight and DST occurrences distinct; schedule changes retained and outdated snapshot refused |
| Shared parent / duplicate names / same-day sessions | requires child identity; rejects duplicate-name queries; multiple occurrences are not guessed from classDate |
| Empty results / every page / schema | preserves coverage on empty and every mixed-evidence page; reference/Mac client schema and pagination tests |
| Read credential cannot mutate | rejects read-token mutations; administrator HTTP boundaries also reject reader sending/content access |
| Invalid / foreign session / scopes / changed key | ownership/key conflicts, expired/insufficient scopes and CSRF fail closed; changed idempotent payload rejected |
| Private logs and unauthorized responses | HTTP privacy assertions; allowlisted operational events; read projections exclude contents and transport/meeting secrets |
| Stale queued / ambiguous signals | paused stale work signaled once without send/append; orphaned send recovery remains unconfirmed |
| Manual archive disposition | paused, audited/idempotent present/absence decisions; foreign origin and both machine credentials denied; SMTP timestamp unchanged |

The protected production-copy rehearsal still requires the operator's real
verified-backup manifest and mail-disabled isolated environment. The source
fixture's synthetic backup/hash rehearsal does not satisfy that gate. Native
loopback plus IPv4/IPv6 origin acceptance and real deployment remain operator
steps; no installed artifact or service has been modified by this source task.
