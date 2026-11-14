# Value data: project self-checks

## model

### Trace parallel arrays

The valid request has three ordered lines and six units. Main's client line is LAB dispatch=60 lines=3 units=6. Mismatched arrays raise IllegalArgumentException("items"). Lowercase pen raises IllegalArgumentException("code"); it is not normalized. RequestLine removes the accidental positional relationship between separate arrays. ItemCode owns the code rule; SupplyRequest owns order and snapshots.

## primitive

### Choose value concepts

Equal ItemCode components give equal values independent of object identity. A shared mutable catalog Item is an entity: identity 42 persists across updates. This project keeps destination as a checked String because no independent operation needs a new owner. ServiceLevel is a closed enum with its dispatch rule. Distinct user-configurable dispatch algorithms would create a new reason to evaluate Strategy; a fixed integer lookup alone does not require that hierarchy.

## ownership

### Snapshot and stable keys

The request keeps one line and an unchanged hash. Equal decoded lookup retrieves the saved value. List mutation raises UnsupportedOperationException; changing a returned array changes only that array. Reordered lists compare unequal. List.copyOf owns a snapshot; a read-only wrapper around the mutable input would still observe the appended line. Immutable records make it safe to share the elements themselves.

## migration

### Transport boundary

Each valid row encodes byte-for-byte unchanged. Every listed invalid row raises IllegalArgumentException("row"). Empty body is valid; an empty trailing entry is invalid. A negative split limit keeps the final field so LAB|0| has three fields. Domain values and validation remain inside their value/owner types; delimiter interpretation belongs to RequestCodec.

## core

### Complete core acceptance

Both roles compile and pass base with 1673 checks. The unmodified starter fails core on unfinished code validation; the completed core passes 1704. Both Main modes print the five exact lesson lines. A completed core with merged still throwing UnsupportedOperationException continues to pass core; full mode fails only when it reaches that optional operation. Keep all 13 source/document files and the src/supplies tree in exports.

## diagnostic

### Find representation regressions

A final record component holds a reference; it does not freeze the ArrayList. Mutation can change equality/hash and break map lookup. Copy the collection and use immutable line/code components. Set equality erases a contractually significant order, so the reordered requests would become incorrectly equal. Keep ordered-list equality, including duplicate lines.

## transfer

### Two entry points

The two independently constructed request objects have different identities but equal values and equal hashes. Either equal value can locate the same map entry. Reversing the line list changes value equality. ItemCode("pen") raises IllegalArgumentException("code"); the invalid row raises IllegalArgumentException("row"). The codec translates the external failure boundary without changing accepted values.

## extension

### Optional ordered merge

The first result is LAB|1|PEN:5;PAD:1. Empty and no-duplicate content is preserved. Repeated merging is idempotent by value. Overflow of the per-line limit raises IllegalArgumentException("units"), and the original remains unchanged. The supplied reference passes 1709 complete checks while the separately assessed core remains at 1704.

