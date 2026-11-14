# Value data: case inputs

## model

### Trace parallel arrays

Destination LAB; service 1; codes [PEN,PAD,PEN]; quantities [2,1,3]. Also examine codes [PEN,PAD] with quantities [2], and code pen with quantity 2. State each named invariant and the exact compatibility output.

## primitive

### Choose value concepts

Compare two separately constructed PEN codes, a mutable shared catalog Item with database identity 42, destination LAB with one local format rule, and service codes 0/1/2 with dispatch times 180/60/30. Decide the equality/ownership and representation for each.

## ownership

### Snapshot and stable keys

Start a mutable list [PEN:2]. Create a typed LAB/RUSH request, store it in a HashMap, then append PAD:1 through the original list. Try lines().add(MUG:1), change a returned quantity array, and look up an equal request decoded from LAB|1|PEN:2. Also compare PEN:2;PAD:1 with PAD:1;PEN:2.

## migration

### Transport boundary

Accept LAB|0|, LAB|1|PEN:2;PAD:1 and OFFICE|2|PAD:999;PEN:2;PAD:1. Reject null, LAB|1, LAB|1||, LAB|01|, LAB|+1|, LAB|1|PEN:0, LAB|1|PEN:01, LAB|1|PEN:1000 and LAB|1|PEN:1;. State exact successful round-trip bytes and the failure class/message.

## core

### Complete core acceptance

Use both supplied roles. Compile from the complete role folder using javac --release 21 -Xlint:all -Werror -d classes @sources.txt. Run ContractTests base/core and Main base/default. Keep merged unfinished for an intermediate core-only checkpoint.

## diagnostic

### Find representation regressions

A proposed record Bag(List<RequestLine> lines) keeps an ArrayList supplied by a caller. That Bag becomes a map key before the caller adds PAD:1. Another proposal changes request equality from list comparison to set comparison. Use PEN:2;PAD:1 and PAD:1;PEN:2 as the order case.

## transfer

### Two entry points

Create typed LAB/RUSH/[PEN:2,PAD:1] and separately decode LAB|1|PEN:2;PAD:1. Compare ==, equals, hashCode and map lookup. Repeat after reversing the typed list. Construct ItemCode("pen") and decode LAB|1|pen:2.

## extension

### Optional ordered merge

Merge LAB|1|PEN:2;PAD:1;PEN:3, LAB|0| and a no-duplicate request. Merge the result again. Try LAB|0|PEN:999;PEN:1. Observe each original after success or failure.

