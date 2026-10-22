# Storage lifetimes, indexes, and model choice

An adapter provides operations such as list, read, create, update, and remove.
The HTTP handlers depend on those operations rather than on a particular storage
engine. Both supplied adapters return the same public records and error
categories. That shared interface makes it possible to change storage without
changing the browser's field names or resource paths.

## Memory and durable storage

The memory adapter stores records in a Map inside one Node.js process. Requests
to that process share its Map. Closing a tab does not stop the service, but
stopping the service discards its Map. Restarting without a snapshot creates a
fresh fictional seed. This is a reset, not persistence.

The MongoDB adapter stores documents in a separate database process. Restarting
only the API can preserve records because the database owns their storage.
That observation does not prove that the database is backed up or that a disk
failure can be recovered. Process lifetime, durable storage, availability, and
recoverability are separate properties.

The API binds to loopback and uses one explicitly named learning database. Its
mutation queue orders changes within that API process. It does not coordinate
another API process or arbitrary database clients. The record limit is designed
for the documented single-process lab, not a distributed service.

## What an index changes

Finding a record by scanning every document requires examining candidates until
the match is found or the collection is exhausted. An index stores a separate
ordered lookup structure. It can narrow a matching query's candidate set, at the
cost of storage and maintenance whenever indexed values change.

MongoDB already indexes `_id`. This project stores its public UUID there, so an
ID lookup has a direct identity index. The additional unique index on `title`
serves exact-title lookup and rejects a second document with the same title.
The comparison is case-sensitive: `Orbit` and `orbit` are distinct titles in the
supplied contract. Removing uniqueness would change an integrity rule, not just
query speed.

An index helps a query that can use its keys. The title index does not make an
arbitrary search through note bodies efficient. The memory adapter performs a
linear exact-title filter and explicitly checks conflicts; it does not simulate
MongoDB's internal index implementation. With at most 50 records, elapsed times
are too small and noisy to establish a broad performance claim. Query shape,
candidate counts, write work, and the integrity requirement explain the index's
purpose more reliably.

## Documents and related tables

A note with a small array of labels is a natural document: the values are read
and replaced together. The same information can also be represented relationally.
For example, a `notes` table can have a primary ID, unique title, body, and
timestamps. A separate `note_tags` table can associate each note ID with tag
values, using a foreign key and uniqueness on the pair. Both designs need explicit
validation and integrity rules.

| Data need | A document model can offer | A relational model can offer |
| --- | --- | --- |
| Read a note and its small tag list together | One embedded record | A join or grouped related query |
| Update one note's owned values | A single-document change | A transaction over the affected rows |
| Share tags with their own identity and metadata | Explicit references and coordinated changes | Related tables and foreign keys |
| Ask many cross-entity reporting questions | Purposeful aggregation and indexes | Joins, grouping, constraints, and query planning |

Neither model removes the need to reason about relationships and transactions.
A single-document write does not make a multi-document workflow atomic. The
project's database snapshot import explicitly does not promise atomic restore
if a connection fails halfway through it. A product with shared accounts,
permissions, payments, or many coordinated records would need additional design;
those features are not implemented by this notes lab.

The model decision follows what is owned together, what is queried together,
and which changes must succeed or fail together. "NoSQL" does not mean that data
has no schema, and "SQL" does not by itself define the application's valid input.

## Reading source as evidence

In `src/store.js`, compare the two implementations of the same operations. The
memory adapter copies values at its boundary and orders results by public ID.
The MongoDB adapter performs queries, uses the unique title index, and translates
stored dates and `_id` into the public representation. The browser need not know
which adapter performed the work.

Trace the source of a value before describing it as stored. A value in a form is
pending input. A 201 response identifies a created record. A record read after
an API restart demonstrates a particular storage lifetime. A separately restored
snapshot with matching IDs and timestamps demonstrates a particular recovery
path. Each observation answers a different question.

Reference: [MongoDB indexes](https://www.mongodb.com/docs/manual/indexes/) and
[single-document atomicity](https://www.mongodb.com/docs/manual/core/write-operations-atomicity/).
