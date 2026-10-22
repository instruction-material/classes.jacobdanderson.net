# Documents, identity, and CRUD

A note is one entity with a stable identity and editable attributes. In this
project its editable attributes are `title`, `body`, and `tags`. Its `id` identifies
the entity; changing a title does not create a different note. `createdAt` records
creation, and `updatedAt` records the most recent replacement. The timestamp
does not move backward when a restored record is newer than the local clock.

JavaScript objects live in a process. JSON is a text representation exchanged
between processes or saved in a file. A MongoDB document is a stored value in a
collection, encoded as BSON, which supports types such as dates. These are
different representations of the same modeled entity. A JSON response has ISO
timestamp strings; the MongoDB adapter converts stored Date values back to that
public shape. A collection contains many documents and is roughly comparable
to a table, although their modeling and query features differ.

The fictional seed has this public representation:

```json
{
  "id": "00000000-0000-4000-8000-000000000001",
  "title": "Fictional observation",
  "body": "A seed note for the local data lab.",
  "tags": ["example"],
  "createdAt": "2026-01-01T00:00:00.000Z",
  "updatedAt": "2026-01-01T00:00:00.000Z"
}
```

An input request omits the ID and timestamps. The service owns those values.
Allowing a create request to supply an existing ID would make the meaning of
"create" ambiguous. The API rejects unknown input fields rather than silently
accepting an ID or an unexpected permission field.

## Validation at two boundaries

The request validator checks the untrusted JSON value before a storage operation.
An object with a numeric title is not equivalent to an object with a string
title. Trimming text is an explicit normalization step; converting a number
to text would change the contract. The exact limits and tag rules are in the
project reading and imported README.

The Mongoose schema describes stored documents. It also performs casting, so it
cannot replace the stricter request boundary. A schema can reject an excessively
long title, while a database index enforces title uniqueness across records.
Those are separate mechanisms. A unique-index violation is a conflict, not a
malformed JSON document or a failed connection.

The tag field in the browser uses a JSON array. `["moon, sky", "quote\"tag"]`
contains two tags, including a comma and a quote inside their values. Splitting
that text at every comma would lose the array's meaning. Parsing and serializing
JSON preserves the exact elements during an edit. Displaying text through
`textContent` also keeps a title containing `<img>` as data rather than markup.

## Four operations, one identity

| Operation | HTTP request | Storage effect | Successful response |
| --- | --- | --- | --- |
| Create | `POST /api/notes` | Add a new ID and record | 201 and the record |
| Read | `GET /api/notes/:id` | None | 200 and the record |
| Update | `PUT /api/notes/:id` | Replace editable fields at that ID | 200 and the replacement |
| Delete | `DELETE /api/notes/:id` | Remove that ID | 204 with no response body |

`GET /api/notes` lists records; it is different from reading one known ID.
`GET /api/notes?title=Orbit` performs an exact-title lookup. A correctly formed
but unknown UUID returns 404 for a single-record operation. A malformed ID
returns 400 before storage is contacted. A repeated delete returns 404 because
the first delete removed the resource.

PUT replaces the complete set of editable fields in this lab. Omitting `tags`
therefore produces an empty array; omitting `title` or `body` is invalid. It is
not a partial patch. The implementation retains the old ID and creation time
and returns a separate copy, so later mutation of a returned tags array cannot
change the stored record accidentally.

## Following one request

The form handler reads fields, parses the tag array, and serializes an input
object. `fetch` sends the HTTP request to the same origin. Express checks media
type and size, parses JSON, and selects a method/path handler. The request
validator produces normalized fields or a 400 response. A storage method then
reads or changes a record. The adapter translates its result to the public
shape, and the browser checks status before rendering it.

The response is evidence of the operation's result, not simply evidence that
`fetch` resolved. HTTP 400, 404, 409, and 503 also resolve a fetch promise. A
transport failure rejects it. The form keeps entered values after a failure so
the next action can follow the observed error rather than silently losing work.

The starter leaves two functions unfinished: input validation and replacement
in the memory store. The supplied route and adapter code make their effects
observable through actual requests. Completing a validator alone does not prove
that update preserves identity; completing update alone does not make invalid
input acceptable.
