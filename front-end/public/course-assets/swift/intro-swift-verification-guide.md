# Intro to Swift App Development Verification Guide

Use this guide after the learner has preserved an independent attempt. It describes evidence to inspect, not one mandatory visual design.

## Shared module rubric

Score each dimension from 0 to 2:

| Dimension          | 0                         | 1                        | 2                                                     |
| ------------------ | ------------------------- | ------------------------ | ----------------------------------------------------- |
| Build or model     | absent                    | partial or fragile       | coherent and appropriate                              |
| Evidence           | assertion only            | some observable evidence | reproducible, labeled evidence                        |
| State and failure  | success path only         | one alternate state      | ordinary, empty, and relevant failure/recovery states |
| Explanation        | describes output          | names some mechanism     | connects ownership, API, or workflow to behavior      |
| Access and privacy | creates avoidable barrier | fallback is incomplete   | equivalent fallback and no sensitive data             |
| Reflection         | no next step              | generic next step        | bounded limitation and specific revision              |

Core readiness is 9 of 12 with no zero in evidence or access/privacy. A project may still need revision before release even when it meets module readiness.

## Mac Setup and First Launch Key

- Correct order begins with compatibility and installation, then project creation, destination selection, build, run, and evidence.
- Preview and simulator are separate processes. A stale simulator result can come from launching the wrong scheme/destination, running an older build, or editing a file outside the active target.
- Evidence names the visible text and the environment; “it worked” alone is insufficient.
- Paid membership is not part of this key.

## Xcode Project Anatomy Key

- `FirstLaunchApp.swift` contains the app entry point, `WindowGroup` supplies the scene content, and `ContentView` is the root view in the supplied trace.
- A source file without target membership is not compiled into that target.
- Asset names are exact identifiers; correcting the source reference or catalog name is narrower than changing the target or reinstalling Xcode.
- Project, target, scheme, and destination receive distinct labels.

## SwiftUI Views Layout and Modifiers Key

- The stack contains two text children; stack modifiers apply to the produced stack value.
- Padding before background expands the background's painted region around padded content. Background before padding paints behind the unpadded value and the later padding remains outside it.
- A reusable section accepts values rather than reading hidden global state.
- Adaptation evidence includes a narrow frame and large text route rather than a single screenshot.

## Swift Basics in App Context Key

Swift infers `String`, `Int`, and `[String]` from the name, count, and array literals. The declaration `String?` gives the missing tagline a type. The count uses `var` because completing a lesson changes its value. The other bindings use `let`.

Append this code to the four declarations in the case. The nil-coalescing operator (`??`) supplies the fallback only when the optional has no value.

```swift
completedLessons += 1
print("\(displayName): \(completedLessons) lessons")
func taglineText(_ tagline: String?) -> String {
    tagline ?? "No tagline yet"
}
print(taglineText(optionalTagline))
print(taglineText("Builds robots"))

func interestText(_ names: [String], matching query: String) -> String {
    guard !names.isEmpty else { return "No interests yet" }
    let matches = names.filter { query.isEmpty || $0.lowercased().contains(query.lowercased()) }
    return matches.isEmpty ? "No matches" : matches.sorted().joined(separator: ", ")
}
for query in ["O", "", "art"] {
    print(interestText(interests, matching: query))
}
print(interestText([], matching: "O"))
```

The first three lines print `Avery: 4 lessons`, `No tagline yet`, and `Builds robots`. The four searches print `Robotics`, `Drawing, Music, Robotics`, `No matches`, and `No interests yet`, in order. The empty query keeps every name. Filtering and sorting produce new arrays, so the original still has Robotics before Music.

## Functions Structs and Enums Key

A status carries the data its case needs. A planned card has no fraction or completion date. An active card at 100% still has no recorded date. Each case has its own switch branch, so adding a fourth case makes the compiler identify the unfinished switch.

```swift
import Foundation

enum LessonStatus {
    case planned
    case active(Double)
    case complete(Date)
}

struct LessonCard: Identifiable {
    let id: Int
    let title: String
    var detail: String?
    var status: LessonStatus
}

func label(for card: LessonCard) -> String {
    let status: String
    switch card.status {
    case .planned:
        status = "Planned"
    case .active(let fraction):
        status = "\(Int((fraction * 100).rounded()))%"
    case .complete(let date):
        status = "Complete \(date.ISO8601Format().prefix(10))"
    }
    let base = "\(card.title): \(status)"
    guard let detail = card.detail, !detail.isEmpty else { return base }
    return "\(base) | \(detail)"
}

var card = LessonCard(id: 7, title: "Map a trail", detail: nil, status: .planned)
print(label(for: card))
for fraction in [0.0, 0.5, 1.0] {
    card.status = .active(fraction)
    card.detail = fraction == 0.5 ? "Use the north route" : ""
    print(label(for: card))
}
card.status = .active(0.5)
card.detail = "Use the north route"
var finished = card
finished.status = .complete(Date(timeIntervalSince1970: 1_767_225_600))
print(label(for: finished))
print(card.id, finished.id, label(for: card))
```

The first four labels start with `Map a trail:` followed by `Planned`, `0%`, `50% | Use the north route`, and `100%`. The copy prints `Map a trail: Complete 2026-01-01 | Use the north route`. The last line prints both IDs as 7 and the original 50% label. Copying the struct preserved its identity field and gave the copy an independently editable status.

## App Structure and Lifecycle Key

- The launch trace is `@main App` → scene/`WindowGroup` → root view → reusable child.
- Model and sample data remain separate concepts even if a tiny project keeps them nearby.
- A good file boundary has a change or testing reason; more files alone do not earn credit.
- Assets remain resources referenced by stable names rather than embedded personal files.

## State and Data Flow Key

- `draftNote` belongs to the editor, and `favoriteCount` remains derived.
- Shared favorite state has one source of truth; a child receives a binding or calls an observable model boundary.
- `selectedItem` ownership follows the navigation/presentation container that controls selection.
- Observation requires an iOS 17-era deployment target; an older target can use `ObservableObject`/`@StateObject` intentionally.

## Media Maps and Permissions Key

- All images and coordinates come from the supplied fictional pack.
- Image descriptions convey useful content rather than file names.
- Static map and gallery behavior work with every permission denied.
- A permission request follows an initiated feature and includes denied, restricted, and unavailable handling; requesting permission at launch without need does not pass.

## Navigation and Multi Screen Key

- Hobbies and Favorites are peer tabs.
- Hobby detail is stack drill-down; Edit hobby is a focused sheet with Save and Cancel.
- Save commits intended changes; Cancel discards the draft; Back preserves the expected model; tab changes do not erase shared app state.
- Hidden global selected IDs and unrelated state duplication do not pass the ownership gate.

## Lists Forms and CRUD Key

- Stable IDs, not array positions or titles, identify records.
- Whitespace-only drafts fail validation.
- Add, edit, toggle, and delete affect the intended item and preserve deterministic ordering.
- The final display is `A4 | Archive notes | false`, `A1 | Sketch interface | true`, then `A3 | Test empty state | false`. Sorting the display moves rows. Deleting by ID still removes Build model even after its position changes.
- Empty state offers a clear add action; destructive behavior is understandable and recoverable where practical.

## SwiftData Persistence Key

- After the first relaunch, `A1` and completed `A2` remain. After deleting `A1` and relaunching, only completed `A2` remains.
- `@Model` defines the stored model, the container configures storage, the context mutates/fetches, and `@Query` drives fetched presentation.
- Tests use an in-memory configuration.
- Renaming a stored property requires a migration/preservation decision; silently replacing the schema risks data loss.

## Networking and Data Loading Key

The supplied JSON decodes into two entries in order, titled `SwiftUI views` and `Model data`. The model requires `id`, `title`, and `body`. Renaming the first `body` to `summary` leaves a required field missing, so decoding the entire array fails.

| Observation | Expected behavior |
| --- | --- |
| Transport throws a connection error | Show the connection failure and a retry action. |
| HTTP 503 with valid JSON | Reject the status before decoding and show the server error. |
| HTTP 200 with malformed JSON or a missing required field | Report a decoding failure. |
| HTTP 200 with `[]` | Store a successful empty list and show the empty-state screen. |
| Refresh cancelled after the two entries loaded | Restore the previous two-entry list. An older request finishing after a newer one leaves the newer result in place. |

## Debugging and Swift Testing Key

- The minimum reproduction is an all-whitespace draft producing a visible blank row.
- The narrow correction trims input and rejects an empty normalized value at the model boundary.
- Tests cover normal, padded, whitespace-only, and empty strings.
- UI keyboard, focus, layout, and form-presentation behavior remain outside the pure model test and need different evidence.

## Design and Accessibility Key

- The icon-only control gains an accurate accessible name.
- Completion uses text, symbol, or shape in addition to color.
- Text supports Dynamic Type and wrapping; reading order follows task order.
- Delete gains confirmation or undo where appropriate.
- A single pass supports an improvement claim, not universal accessibility compliance.

## Simulator and Device Validation Key

- Both simulators launch with clean consoles and show the static permission fallback. The small simulator passes the core task. The large simulator clips the title, so its core-task result stays open until the layout is corrected and checked again.
- Unsupported claims: device performance, real-device permissions, hardware behavior, and device launch.
- The clipping defect is a layout/Dynamic Type investigation, not evidence that all devices fail.
- The smoke record names destination and configuration.

## Apple Development and Distribution Map Key

- Xcode simulator work is the complete free core.
- A free Apple Account can support personal-device testing subject to Apple's current conditions.
- TestFlight and App Store distribution require enrolled-team and role access.
- App Store Connect manages records, builds, testers, metadata, privacy, and submission state; it is not the compiler.

## Signing Teams and Bundle IDs Key

- Case 1 is an app identifier/profile mismatch.
- Case 2 is a capability/entitlement configuration mismatch.
- Case 3 is a role/authorization boundary, not a coding defect.
- Case 4 requires archive/distribution-signing evidence even though simulator execution passed.
- No correction asks a learner to transmit credentials or private signing material.

## App Store Connect and TestFlight Key

- Correct flow includes upload and processing before tester assignment.
- Internal and external testers have different role/review conditions; the first external build may require beta review.
- Test information and feedback route are part of the release packet.
- A TestFlight build has a limited testing lifetime; the current first-party reference governs the exact operational value.

## Capstone Build and User Testing Key

Twenty-four-point capstone rubric:

| Area                                           | Points |
| ---------------------------------------------- | -----: |
| Scope and primary flow                         |      4 |
| Model ownership and architecture               |      4 |
| Ordinary, empty, and failure/recovery behavior |      4 |
| Test and simulator evidence                    |      4 |
| Accessibility and privacy                      |      4 |
| Explanation, limitations, and revision         |      4 |

Readiness is 18 of 24, no zero-point area, and a complete primary flow. Extra features cannot compensate for a broken core task or unsafe data practice.

## Final Publishing Walkthrough Key

- The supplied packet receives a hold decision.
- Screenshots and description must match build 8, or the intended feature must return in a newly validated build.
- Privacy answers account for third-party SDK behavior and remain accurate.
- Reviewer notes explain sample-data mode and any access needed.
- Placeholder, privacy, crash, access, or metadata blockers remain release blockers.

## Shapes and Legacy Reference Key

- Shape points derive from the supplied `rect` dimensions and scale across square, wide, and narrow frames.
- A reduced-motion or static representation preserves meaning.
- Transferable concepts can include coordinate reasoning, path segments, composition, and parameterization.
- Fixed screen coordinates, obsolete APIs, and old project ordering remain legacy details rather than required practice.
