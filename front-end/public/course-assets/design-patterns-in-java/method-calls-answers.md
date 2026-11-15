# Method calls: project self-checks

## baseline

### Query and command trace

The six old-client lines are 140,505,645,-1,Quote[label=B, cents=505],null. Modern quotes are bothQuote[label=A, cents=140] and leave an empty log. Sends return the same value, with one record then two and totals 140 then 280. The first snapshot keeps one record.

## judgment

### Choose an API boundary

Legacy price records oneQuote and returns 140. Modern quote returnsQuote A140 without a write. send returnsQuote A140 and records it once. Introduce Parameter Object groups loose fields; Preserve Whole Object passes the existing Parcel intact. Retain the old setter at its boundary while selecting a new fixed service configuration. Compiling the preserved client verifies these source calls, not existing binaries or reflection.

## compatibility

### Shared history through migration

After B, history is[A140,B505],total 645; the earlier snapshot is[A140]. Bad discount throwsIllegalArgumentException("discountCents"),leaving discount 25. C costs 115 and total becomes 760. Invalid parcel returns-1 with no write. Parcel construction alone is inside the translation catch; the later send call remains outside.

## boundaries

### Null, absence and failure order

In order:NullPointerException:label;IllegalArgumentException:label;IllegalArgumentException:grams;IllegalArgumentException:zone;NullPointerException:parcel;NullPointerException:speed;NullPointerException:log;NullPointerException:label;IllegalArgumentException:label;Optional.empty. Legacy lookup results are allnull;invalid price is-1. None writes. The same explicit validation remains active under-da.

## core

### Repeat, snapshot and duplicate labels

Both initial quotes areA140 and write nothing. First send recordsA140;the second service recordsA115. Log total 255,latest find AisOptional[Quote[label=A, cents=115]]. The first snapshot stays[A140] and rejects mutation withUnsupportedOperationException. The old service still quotes 140. Corechecks cover 576 rows and 9266 checks in either assertion mode.

## diagnostic

### Smallest regression cases

A single A1/zone 1/STANDARD quote at discount 0 must leave[];an appended record exposes the query effect. A single old price call must leave[A140];an empty log exposes lost command work. A140 then discount 25 then B505 must total 645;losing A exposes the new log. Fresh-log find("missing") must equalOptional.empty and be non-null.

## transfer

### Weight boundary transfer

Band counts 1,2,2,3 give charges 565,605,605,645. One parameterized speed input selects the surcharge. Deriving that stable enum property internally removes a contradictory duplicate input. Loosefields become a new parameter object;an existing Parcel is passed whole. A changing external lookup would require another evaluation contract.

## extension

### Ordinary empty queue and required failures

ResultsOptional[A:140],Optional[B:505],Optional.empty,Optional.empty;counts 1,0,0,0. Strict remove throwsNoSuchElementException("empty queue"). Missing queue throwsNullPointerException("queue");null quote throwsNullPointerException("quote") and leaves count 0. OptionalChecks covers 21 queue lengths and 507 checks;checking hasNext before remove relies on the stated single-thread owner.
