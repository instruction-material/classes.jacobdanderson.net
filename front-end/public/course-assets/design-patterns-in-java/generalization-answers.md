# Generalization worked cases

## parallel

Main baseline and completed Main core print:

    Ada | volunteer | 6
    Bo | mentor | 14
    total=20
    Supported by North Lab

Member owns name, sessions, ordered common validation, getters, sessionCredits and common line layout. Volunteer and Mentor supply role and total variation. LineSource gives SponsorBanner the display capability without membership.

Before, a new role needs a member class and a matching formatter class plus factory wiring. After, a legitimate member subtype provides its role/credits hooks; Member already supplies line layout. Remove RoleFormatter.java, VolunteerFormatter.java and MentorFormatter.java and their entries from sources.txt. Clean old generated output before checking class absence.

## judgment

Member owns real shared member state and invariants. SponsorBanner has neither sessions nor member credits, so LineSource is the suitable common capability. Forcing SponsorBanner under Member would require invented values or unsupported operations. RoleFormatter duplicates the membership variation; DefaultEventBuffer adds no behavior. NamedCounter can inherit because it accepts every Counter operation unchanged.

Sealing restricts direct subtype declarations. It cannot stop an already permitted Mentor from rejecting a valid shared input. Keep the shared runtime contracts under either declaration. If role and output format later vary independently, a separate format collaborator avoids CsvVolunteer/CsvMentor parallel families.

## contracts

One complete independent probe is:

    import roster.Volunteer;
    import roster.Mentor;
    public final class SubtypeProbe {
        public static void main(String[] args) {
            for (int sessions : new int[] {0, 40}) {
                System.out.println(new Volunteer("Ada", sessions).credits());
                for (int slots : new int[] {0, 8})
                    System.out.println(new Mentor("Ada", sessions, slots).credits());
            }
        }
    }

Output is 0, 0, 24, 80, 80, 104, each on its own line. These are sessions*2 plus slots*3 for a mentor. The shared checks cover every valid combination, not only these boundaries.

After successful Ada and Bo enrollments, total remains 20 after every rejected attempt. The snapshot taken after Ada remains ["Ada | volunteer | 6"]. Error order is NullPointerException("name"), IllegalArgumentException("name"), IllegalArgumentException("sessions"), then IllegalArgumentException("mentoringSlots") for the four supplied invalid calls.

A Counter client observes 5, then 7, then 0 after reset. Negative input raises IllegalArgumentException("amount"); overflowing Long.MAX_VALUE + 1 raises ArithmeticException, retaining Long.MAX_VALUE. A caller assigning EventBuffer to List or using indexed add needs migration to the FIFO API; old serialization is a separate migration decision.

## core

A completed core has abstract Member, final Volunteer/Mentor extending it, and LineSource implemented by Member and the independent SponsorBanner. Shared state and constructor validation live in Member; role-specific credits remain in the subtypes. No formatter classes remain.

Empty roster has no lines and total=0. Ada and Bo produce the parallel case output. Name " Ada " is retained exactly. A volunteer with 40 sessions earns 80; a mentor with 40 sessions and 8 slots earns 104. Failed enrollment changes no lines or total and earlier immutable snapshots remain unchanged.

ContractChecks core passes with assertions enabled and disabled. Transfer still reports missing reports.Report; extension still reports inherited List exposure in an independent starter-core completion. This demonstrates Pull Up Field, Pull Up Method, Pull Up Constructor Body, Extract Superclass and Extract Interface without requiring optional work.

## understanding

1. Pull Up Field.
2. Pull Up Constructor Body.
3. Push Down Field and Push Down Method.
4. Collapse Hierarchy.
5. Replace Inheritance with Delegation.
6. Replace Delegation with Inheritance.
7. A sealed-type restriction, separate from the twelve refactoring techniques.

The remaining report techniques are Extract Subclass and Form Template Method; the common render algorithm runs header, ordered rows with sum, then footer. Baseline output is already correct in the starter while all refactored relationships remain unfinished. Output equivalence alone therefore cannot establish extraction, removal, delegation or permitted subtype contracts.

## transfer

Plain output, including a newline after items=5:

    Inventory
    tool, kit=2
    lamp=3
    items=5

CSV output, including a newline after total,5:

    name,count
    "tool, kit",2
    "lamp",3
    total,5

Empty outputs are "Inventory\nitems=0\n" and "name,count\ntotal,0\n". CSV always quotes a label and doubles an embedded quote: say "hi" becomes "say ""hi""". An embedded newline is preserved inside the quoted field.

Validation reports NullPointerException("format"), then ("rows"), then ("row") for the three supplied service cases. Row reports NullPointerException("label") or IllegalArgumentException("label") before an invalid count.

Report has a final render method and header/rowText/footer hooks. PlainReport and CsvReport are actual subclasses; only CsvReport owns delimiter and quoteLabel. Transfer checks pass with -ea/-da while core and extension retain their unfinished starter structure in an independent completion.

## extension

After A,B,C the retained snapshot is [B,C]. next returns B and current state is [C]. Both invalid pushes leave [C] unchanged. Next returns C; a further next throws NoSuchElementException("empty"). The earlier snapshot stays [B,C]. Capacity 0 or 9 throws IllegalArgumentException("capacity").

NamedCounter through Counter supports add/value/reset unchanged: visits=7 followed by reset=0. Negative addition and overflow preserve the previous count.

EventBuffer owns a private collection and implements EventBufferAPI; it exposes no arbitrary inherited List operations. EventFactory returns EventBuffer through EventBufferAPI, and DefaultEventBuffer is absent. NamedCounter extends Counter and removes redundant forwarding. The intentional collection API/serialization change requires explicit migration for those callers. Domain FIFO compatibility does not establish old List or binary/serialized compatibility.

Extension checks pass under both assertion settings while core and transfer remain unfinished in an independent starter-extension completion.
