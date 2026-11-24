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
- The simulator path needs no account sign-in. After changing the heading, the original UI test reports a label mismatch. Updating its expected label and rerunning verifies the intended text.

## Xcode Project Anatomy Key

- `FirstLaunchApp.swift` contains the app entry point, `WindowGroup` supplies the scene content, and `ContentView` is the root view in the supplied trace.
- In case A, inspect the app target’s Compile Sources list and restore ProfileHeader.swift to that target. In case B, use `Color("ProfileAccent")` to match the bundled color set. Rebuild and compare the plane’s tint.
- Asset names are exact identifiers; correcting the source reference or catalog name is narrower than changing the target or reinstalling Xcode.
- Project, target, scheme, and destination receive distinct labels.

## SwiftUI Views Layout and Modifiers Key

- The stack contains two text children; stack modifiers apply to the produced stack value.
- Padding before background expands the background's painted region around padded content. Background before padding paints behind the unpadded value and the later padding remains outside it.
- A reusable section accepts values rather than reading hidden global state.
- In the HStack example the symbol and the inner VStack are siblings. Its two text labels are children of the inner stack. An overlay attached after the background outlines that background’s bounds.
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
- Hiking passes its Water bottle supply into HobbyCard, while Sketching passes Pencil. Moving the declarations preserves both labels. The UI test checks the two navigation paths.

## State and Data Flow Key

- `draftNote` belongs to the editor, and `favoriteCount` remains derived.
- Shared favorite state has one source of truth; a child receives a binding or calls an observable model boundary.
- `selectedItem` ownership follows the navigation/presentation container that controls selection.
- Observation requires an iOS 17-era deployment target; an older target can use `ObservableObject`/`@StateObject` intentionally.

## Media Maps and Permissions Key

- The Gallery starter draws a gradient and a system symbol. Read the artwork title and useful description once. The decorative photo icon needs no separate announcement.
- Tapping Neighborhood Cafe sets the starter’s selected place and shows its detail. The camera remains at (39.2928, -76.5930). In the solution, the same tap sets the selected ID and centers the region on (39.2979, -76.5907).
- The fixed-coordinate map needs no device-location access. If tiles fail to load, the list, selected title and detail can still be checked. Record tile rendering separately.
- For Find Me, ask when the person requests their location. Keep manual selection available when access is denied, restricted or unavailable.

## Navigation and Multi Screen Key

- Hobbies and Favorites are peer tabs.
- Hobby detail is stack drill-down; Edit hobby is a focused sheet with Save and Cancel.
- Save commits intended changes; Cancel discards the draft; Back preserves the expected model; tab changes do not erase shared app state.
- In SAD3 the reference demonstrates tabs, Home detail and shared favorites. Check a learner-added sheet by opening it on Photo Walk, dismissing it, then checking the same detail and favorites. An information sheet needs Done. An editor needs distinct Save and Cancel outcomes.
- On restoration, a valid ID resolves to its record and Back reaches the list. If the record is absent, return to the list or show an unavailable detail with a route back.
- Hidden global selected IDs and unrelated state duplication do not pass the ownership gate.

## Lists Forms and CRUD Key

- Stable IDs, not array positions or titles, identify records.
- Whitespace-only drafts fail validation.
- Add, edit, toggle, and delete affect the intended item and preserve deterministic ordering.
- The final display is `A4 | Archive notes | false`, `A1 | Sketch interface | true`, then `A3 | Test empty state | false`. Sorting the display moves rows. Deleting by ID still removes Build model even after its position changes.
- For a filtered display, resolve offsets against the displayed records before mutation. Undo restores the removed record with its existing ID and completion flag. A duplicate title does not identify the record to restore.
- Empty state offers a clear add action; destructive behavior is understandable and recoverable where practical.

## SwiftData Persistence Key

- After the first relaunch, `A1` and completed `A2` remain. After deleting `A1` and relaunching, only completed `A2` remains.
- `@Model` defines the stored model, the container configures storage, the context mutates/fetches, and `@Query` drives fetched presentation.
- With the starter’s in-memory configuration, a fresh process starts empty. The two-relaunch answer above assumes the same file-backed store. A failed store open calls for an error and retry.
- Two fresh in-memory containers have separate records. In a rename trial, reopen a copy of the original store and compare IDs, titles and completion flags before and after migration.
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

| Stage | Input and result | Who can use the result? |
| --- | --- | --- |
| Simulator | Source and local build settings produce a running simulator app. | The person using that simulator. A missing runtime blocks this run. |
| Personal device | A compatible signed development build can be installed on an eligible device. | The person testing that installation. Device signing can block this step. |
| TestFlight | The team uploads an archive. After processing, the team assigns an eligible build to a testing group and meets the applicable review requirements. | Testers with access to that build. Processing alone gives them no invitation. |
| App Store | The team selects a build, completes the version record, submits it, and follows through on review and release. | Customers where and when the app becomes available. A draft submission or pending review still leaves this stage open. |

For the core case, circle only the simulator result. For the reverse trace, an external beta installation supports the TestFlight claim. Look for the released version's store availability before making the public claim.

## Signing Teams and Bundle IDs Key

In case 1 the release target asks for `net.example.tracker` and the selected profile authorizes `net.example.gallery`. Compare the selected team and profile with the intended tracker target. An authorized team member can select or generate the matching profile, archive the same target, and inspect the resulting signing record. Preserve the app's intended identity.

For a capability error, compare the target entitlements, the registered App ID's enabled capabilities, and the profile's entitlements. After an App ID capability change, the distribution profile may need regeneration. In case 3 capture the role restriction and refer the operation to a team member authorized to manage that signing asset. In case 4 the first archive error is missing. A working simulator supplies no certificate or profile diagnosis.

## App Store Connect and TestFlight Key

Start with the app record and uploaded build 1.0 (7). Processing must finish before that build can be used. Prepare test instructions and groups in parallel. Resolve applicable compliance questions, select the eligible build for QA, and record its group assignment. For Classroom Review, complete the external test information and applicable beta review before inviting testers. Record a tester's installation or feedback separately from an invitation.

Tie QA's report to build 7. Retest the empty-list recovery action on build 8 at the same small size and large text setting. A pass belongs to build 8. The pending external group and open compliance question still require their own evidence.

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

Score each area from 0 to 4. Give 0 for missing evidence, 1 for a stated plan, 2 for a partial demonstration, 3 for a repeatable demonstration with one documented gap, and 4 for evidence covering the area’s agreed checks. The SAD7 reference’s checked “Collect screenshots” row supplies no screenshot or test result. For revision credit, compare the anonymous observation with the result of repeating the same task after a change. Label a solo rehearsal as a self-test.

Readiness is 18 of 24, no zero-point area, and a complete primary flow. Extra features cannot compensate for a broken core task or unsafe data practice.

## Final Publishing Walkthrough Key

Hold build 8. Replace the obsolete screenshot and description, verify how the SDK handles diagnostics, reconcile the privacy answers, and give the reviewer reproducible sample-mode steps. Assign the blank link checks and smoke run to a named role and keep each open until someone records the result. After correcting only the screenshot, the other issues still justify a hold.

Adding the version to a draft leaves it ready for the authorized submitter's decision. For the reviewer's sample-list question, test **Explore sample data** on the selected build. If it works, update the review notes with the verified steps. If it fails, correct the app, select the new build, and repeat the affected tests and metadata checks.

## Shapes and Legacy Reference Key

- For Build at 45%, the sweep is 162° in every frame. Square 240 × 240 gives center (120, 120), radius 120. Wide 360 × 180 gives (180, 90), radius 90. Narrow 160 × 320 gives (80, 160), radius 80. The reference subtracts 90° from each angle to start the first slice at the top.
- Shape points derive from the supplied `rect` dimensions and scale across square, wide, and narrow frames.
- At 50%, 30% and 20%, the cumulative endpoints before the top-of-chart offset are 180°, 288° and 360°. A static labeled display carries the same proportions with Reduce Motion enabled.
- Transferable concepts can include coordinate reasoning, path segments, composition, and parameterization.
- Fixed screen coordinates, obsolete APIs, and old project ordering remain legacy details rather than required practice.
