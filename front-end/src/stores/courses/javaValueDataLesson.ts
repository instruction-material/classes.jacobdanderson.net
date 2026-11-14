export const javaValueDataLesson = `**Course flow:** DPR3 moved behavior to its owner. DPR4 changes the shape and ownership of data while preserving an existing Java client and wire format. Start from a runnable parallel-array model, introduce named immutable values, then move transport conversion to one boundary.

### Recognize the data clump

The supplied supply request contains destination, service code, item-code array and quantity array. Index i must refer to the same item in both arrays. A caller that passes three codes and two quantities violates that relationship. ItemCode owns the code rule; RequestLine binds one code to its quantity. SupplyRequest owns the ordered collection of lines.

Destination stays a String because this exercise gives it one local format rule and no independent behavior. Wrapping every primitive would add types without a demonstrated responsibility. ServiceLevel is an enum because the closed set 0/1/2 owns one dispatch-time rule. A State or Strategy hierarchy becomes useful when independently varying behavior requires it; it contributes little to this finite lookup.

### Organizing-data transformations

The [organizing-data catalog](https://refactoring.guru/refactoring/techniques/organizing-data) names the following techniques. Choose a transformation because of the invariant or change it clarifies.

| Technique | Use and boundary |
| --- | --- |
| Self Encapsulate Field | Route internal field accesses through a deliberate access policy. |
| Replace Data Value with Object | Move a repeated value rule into a named type, such as ItemCode. |
| Change Value to Reference | Share an entity with a stable identity when separate copies would disagree. |
| Change Reference to Value | Replace identity sharing with interchangeable independent values when identity is unnecessary. |
| Replace Array with Object | Give related positions names and a checked relationship, as RequestLine does. |
| Duplicate Observed Data | Synchronize a presentation copy from one authoritative model through explicit notifications. |
| Change Unidirectional Association to Bidirectional | Add reverse navigation and maintain both ends as one invariant. |
| Change Bidirectional Association to Unidirectional | Remove an unnecessary reverse dependency and its synchronization burden. |
| Replace Magic Number with Symbolic Constant | Name a stable domain rule before reusing it. |
| Encapsulate Field | Protect writes and expose the operations callers actually need. |
| Encapsulate Collection | Define who can mutate contents and whether readers receive a view or a snapshot. |
| Replace Type Code with Class | Represent a classification as a checked type; a closed classification may fit an enum. |
| Replace Type Code with Subclasses | Separate stable variants when subtype-specific behavior justifies them. |
| Replace Type Code with State/Strategy | Delegate behavior that changes independently from the owning object. |
| Replace Subclass with Fields | Use data when subtypes differ only in fixed values. |

A catalog Item with a permanent identity may be shared by many requests. An ItemCode value identifies a spelling, without owning a mutable catalog entity. Two separately constructed ItemCode("PEN") values compare equal; they need not be the same object. Converting an entity into a value would change update-sharing behavior, so record that decision before changing ownership.

For a bidirectional Request↔Line association, adding a line would need to update both the request's list and the line's owner; a partial update leaves disagreement. This pack uses a one-way SupplyRequest→RequestLine relationship because a line needs no back-reference. For an observed totals widget, keep one authoritative request model and update the display from it. Two independently writable totals would require a conflict policy absent from this project.

### Complete public and data contract

The existing constructor is SupplyRequest(String destination, int service, String[] codes, int[] units). Destination is 1–12 ASCII uppercase letters. A code is 1–8 ASCII uppercase letters/digits, beginning with a letter. Preserve exact values without trimming or case conversion. A quantity is 1–999. Accept 0–64 lines, retaining line order and duplicate codes.

Validate destination, then service, array shape, and each code before its quantity. Invalid values raise IllegalArgumentException with message destination, service, items, code or units, respectively. An array-shape error includes null arrays, unequal lengths and more than 64 lines. Preserve that evaluation order even when using a delegating constructor.

Service codes are 0=STANDARD/180 minutes, 1=RUSH/60 minutes and 2=EXPRESS/30 minutes. Keep destination(), serviceCode(), dispatchMinutes(), itemCodes(), quantities(), toLegacy(), equals() and hashCode() callable by the unchanged ClientCompatibility.java. Retain the supplied LegacySupplyRequest.java as the baseline.

Equality includes destination, service and every ordered line's code and quantity. LAB/RUSH/[PEN:2,PAD:1] differs from LAB/RUSH/[PAD:1,PEN:2]. Two PEN lines remain distinct from one combined PEN line. Preserve the existing hash calculation as well as equality/hash consistency. Do not sort or combine data as part of this refactor.

### Records and owned snapshots

[Java 21 records](https://docs.oracle.com/en/java/javase/21/language/records.html) derive component accessors, equality and hashing. A compact constructor can reject invalid component values. ItemCode contains an immutable String; RequestLine contains an ItemCode and an int, so their component values remain stable.

A record containing a mutable array or list would retain a mutable object unless its constructor copied it. Default record equality for an array component also uses that array's own identity equality. A final field alone does not protect array contents.

SupplyRequest.fromLines(String,ServiceLevel,List<RequestLine>) creates an ordered snapshot. The service must be non-null; a null list, null element or more than 64 elements is invalid. Those new entry points use messages service and lines. List.copyOf supplies an unmodifiable list in input order. Its elements are not deep-copied; this is sufficient here because each line and code is immutable. [List.copyOf and unmodifiable-list contracts](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/List.html#copyOf(java.util.Collection)) describe that boundary.

Returning Collections.unmodifiableList(input) alone would expose later changes made through input. Snapshot before exposing the read-only result. Keep old array getters as newly constructed arrays. An equality/hash key must remain stable while a HashMap or HashSet holds it.

### One transport boundary

The old row is exactly DESTINATION|SERVICE|CODE:UNITS;CODE:UNITS. There are three fields. LAB|0| is a valid empty request. A service is a single 0, 1 or 2. Quantities use canonical digits without a leading zero, sign or whitespace. Missing or extra fields, empty entries, invalid domain values and null input raise IllegalArgumentException("row"). Encoding a null request raises IllegalArgumentException("request").

RequestCodec.decode and encode are the conversion boundary. Keep delimiters and field positions out of domain operations. In Java, split("\\\\|", -1) retains the final empty field; split("\\\\|") would lose it and reject the valid empty request. Keeping the old byte format and public constructor allows existing callers to migrate separately from the representation.

### Source and green checkpoints

Both roles contain 13 files, including nine Java files, sources.txt, README.md, DECISIONS.md and CHECKPOINTS.md. Main.java is the entry point. Keep the src/supplies package tree. The starter's compatibility shell compiles and already runs the baseline; its typed-value and ownership tasks are explicitly incomplete. The reference completes them. Use the same supplied commands from the exported role folder:

\`\`\`sh
javac --release 21 -Xlint:all -Werror -d classes @sources.txt
java -cp classes ContractTests base
java -cp classes ContractTests core
java -cp classes Main base
java -cp classes Main
\`\`\`

Base reports 1673 passed. The completed core reports 1704 passed; the unmodified starter intentionally fails core on unfinished value validation. No standard input is used. Run in the site IDE displays the native Java commands; execute them after exporting the complete project.

Both Main modes print exactly:

\`\`\`text
LAB|1|PEN:2;PAD:1;PEN:3
LAB dispatch=60 lines=3 units=6
equal=true
hash-set=true
unchanged=LAB|1|PEN:2;PAD:1;PEN:3
\`\`\`

Keep a green baseline, finish value validation, replace the owned representation, then establish the codec boundary. Record the changed files, exact command and preserved behavior after each step. Keep the existing client and oracle source unchanged. A failure at the next step leaves the preceding green checkpoint recoverable.

### Core and optional behavior

Core preserves duplicate lines. The optional merged() operation deliberately combines them, retaining first-occurrence order and returning a new request. For PEN:2;PAD:1;PEN:3, it produces PEN:5;PAD:1 while the original remains unchanged. A combined quantity above 999 is rejected with message units. An empty request remains empty.

Run java -cp classes ContractTests after completing that extension; the complete reference reports 1709 passed. Core remains independently checkable while merged() is unfinished. This separates representation preservation from the later behavior change.
`;
