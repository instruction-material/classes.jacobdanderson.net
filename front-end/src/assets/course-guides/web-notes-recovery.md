# Failure, snapshots, and schema changes

A process can be running while its storage is unavailable. In this project
`GET /health` reports the live API process; `GET /api/ready` reports adapter
readiness. An unavailable adapter can leave the first healthy and make the
second return 503. Those responses answer different operational questions.

Request validation, conflicts, and availability also differ. Invalid fields give
400 before a write; an existing title gives 409; a storage failure gives a safe
503 response. The exact request table and local fault commands are in the project
reading. Logs retain event/status information without note content or connection
addresses.

## A response can be lost

An unavailable connection may prevent a write, or it may fail after a write has
reached storage but before the response reaches the caller. A timeout therefore
does not always prove that nothing changed. Before repeating a create, query
the exact fictional title and inspect any matching ID. Before repeating an
update or delete, read its known ID. The lab's unique titles help identify a
create conflict; they are not a general idempotency mechanism for other products.

## Snapshot integrity

The snapshot route returns `schemaVersion: 1` and a list of complete records.
It includes IDs, text, tag arrays, and timestamps. A file containing a snapshot
is separate from the live Map or database. Retaining that file does not require
the first API process to remain running.

The validator rejects unknown fields, malformed dates or IDs, duplicate IDs or
titles, invalid field lengths, and more than 50 notes. It also rejects values
that would change on import through trimming or tag defaults. A saved representation
must be exact; silently repairing it would prevent a faithful integrity comparison.
The 1 MiB file limit accommodates the maximum accepted record set, including JSON
escaping of control characters.

Compare records by ID. Record order and object-property order are not data changes.
For a matching ID, compare title, body, tags, creation time, and update time.
An added ID, removed ID, or changed field is a different kind of difference.
Preserve tag element order and string values when comparing arrays.

## Restore to a separate target

A restore exercise uses a new memory process or a different empty learning
database. The original snapshot and original service stay available for comparison.
Check the target's snapshot after startup, including the same IDs and timestamps.
Then change a record only in the restored target and verify that the first
service is unchanged. That last observation distinguishes an independent target
from accidentally reconnecting to the original one.

The MongoDB path refuses to overwrite a nonempty target. It also rejects older
incompatible stored shapes with `stored_data_requires_migration`. It does not
delete them to make a startup appear successful. A database import interrupted
by a connection loss may leave a partial target; inspect it and choose another
empty target for a retry. The supplied adapter does not claim atomic import.

## Explicit version conversion

A schema version names a representation contract. Renaming a field, changing a
date representation, or changing identity rules can require conversion even if
the JSON still parses. A converter has an input contract, an output contract,
and failure behavior of its own.

For the challenge, a supplied fictional version-0 record uses `key`, `heading`,
`text`, `labels`, and integer epoch-millisecond dates. Version 1 uses `id`,
`title`, `body`, `tags`, and canonical UTC ISO timestamps. The assignment includes
the full fixture and exact expected result. Preserve identities and data rather
than generating new IDs or silently dropping invalid records.

Validate every converted record before writing a new output file. Refuse an
existing output path and keep the input unchanged. A subsequent independent
restore and snapshot comparison tests whether that new representation works
with the actual service. Parsing JSON, producing a file, starting a process,
and verifying recovered data are separate checks.
