# Intro to Swift App Development Practice Pack

This pack supplies deterministic cases for every course module. It keeps the reasoning and planning work available when a compatible Mac, Xcode installation, simulator runtime, device, network connection, or Apple distribution account is unavailable.

## Shared working record

For every Xcode run, record:

| Field               | Example format                                            |
| ------------------- | --------------------------------------------------------- |
| Xcode               | stable version and build                                  |
| Swift               | language mode shown by the target                         |
| Deployment target   | iOS version                                               |
| Destination         | simulator model and OS                                    |
| Build configuration | Debug or Release                                          |
| Expected            | one observable result                                     |
| Observed            | result, error, or not run                                 |
| Evidence            | screenshot description, console excerpt, or supplied case |

Never place Apple Account details, team invitations, device identifiers, signing files, secrets, personal photos, contacts, or precise real-world locations in this record.

## Canonical project spine

1. SAD1 Welcome Profile App
2. SAD2 Media Gallery App
3. SAD3 Multi-Tab Hobby App
4. SAD4 Map Places App
5. SAD5 Simple Tracker App
6. SAD6 API Reference App
7. SAD7 Publish-Ready Capstone

The older `SAD` module labels and `Mod*` folders remain source-pack identifiers. The visible `SW1`–`SW20` sequence is the active learning order.

## Mac Setup and First Launch Case

### Supplied environment record

| Check        | Case value                      |
| ------------ | ------------------------------- |
| Host         | Supported macOS is reported     |
| Xcode        | Stable release is installed     |
| Simulator    | One iPhone runtime is installed |
| Template     | iOS App, SwiftUI, Swift         |
| Product name | `FirstLaunch`                   |
| Bundle ID    | `net.example.firstlaunch`       |
| Visible edit | `Text("First verified launch")` |

### Task

Order these actions: verify compatibility, install/open Xcode, install a simulator runtime, create the project, select a destination, build, run, compare the launched text with source, and record the environment. Then diagnose this supplied discrepancy: the preview shows the new text, but the launched simulator shows the old text.

## Xcode Project Anatomy Case

### Supplied map

```text
FirstLaunchApp.swift -> WindowGroup -> ContentView
ContentView.swift -> ProfileHeader -> Assets.xcassets/ProfileAccent.colorset
FirstLaunchUITests -> launches FirstLaunch and reads its heading
Scheme FirstLaunch -> target FirstLaunch -> iPhone simulator
```

### Task

Label entry point, scene, root view, child view, asset, target, test target, scheme, and destination. Case A: `ProfileHeader.swift` exists but has no target membership. Case B: the header requests the color `profile-accent`, while the catalog name is `ProfileAccent`. Identify the first useful Xcode surface and the narrowest correction for each.

## SwiftUI Views Layout and Modifiers Case

### Supplied view

```swift
VStack(alignment: .leading, spacing: 12) {
	Text("Avery")
		.font(.title)
	Text("Builds small, useful apps")
		.foregroundStyle(.secondary)
}
.padding()
.background(.blue.opacity(0.12))
.clipShape(.rect(cornerRadius: 16))
```

### Task

Draw the view tree. Predict how moving `.padding()` after `.background(...)` changes the painted region. Create a reusable profile section with name, summary, and system image inputs. Check a narrow width and a large Dynamic Type setting using a written layout trace when Xcode is unavailable.

## Swift Basics in App Context Case

### Supplied data

```swift
let displayName = "Avery"
var completedLessons = 3
let optionalTagline: String? = nil
let interests = ["Drawing", "Robotics", "Music"]
```

### Task

1. Predict each value's type. Complete one lesson by incrementing `completedLessons`. Explain why the other bindings can remain constants, and why `nil` needs an explicit optional type here.
2. Produce a profile heading containing the name and lesson count. Show the tagline when present and `No tagline yet` when absent. Try both `nil` and `"Builds robots"`.
3. Write a function that accepts interests and a search string. Match substrings without regard to case and sort the matching names alphabetically. An empty search shows all interests. Give an empty input list the message `No interests yet` and a search with no matches the message `No matches`.
4. Trace the output for the supplied interests with `"O"`, `""`, and `"art"`, then for an empty list with `"O"`. Compare filtering results with the original array after each call. With a Swift toolchain, run the cases as a script. The same traces can be completed on paper.

## Functions Structs and Enums Case

### Supplied model need

A lesson card has the fixed integer ID `7`, title `"Map a trail"`, and optional detail. Its status is planned, active with a fraction from 0 through 1, or complete with a date. Use midnight UTC on 2026-01-01 as the sample completion date. Finishing the work and recording its completion date are separate actions, so active at 100% is a meaningful state.

### Task

Design an `Identifiable` struct and a status enum. Store the fraction only in the active case and the date only in the complete case. Write a pure label function with an exhaustive switch. Include the title, status, and detail when present. Both missing detail and the empty string should omit the detail separator.

Predict the labels for planned, active at 0, 0.5 and 1, and complete on the supplied date. Add `"Use the north route"` as detail on the 50% card. Copy that card, change the copy to complete, and check the ID and status of both values. Explain which impossible combination the enum prevents.

## App Structure and Lifecycle Case

### Supplied files

```text
HobbyMapApp.swift
ContentView.swift
Hobby.swift
HobbyCard.swift
SampleData.swift
Tests/HobbyMapUITests.swift
```

### Task

Trace launch from `@main` to the visible card. Place model, reusable view, sample records and UI test on an architecture map. Trace Hiking to its Water bottle detail. Compare keeping the three supporting declarations in `ContentView.swift` with the supplied split; choose the smallest structure that makes data ownership and testing understandable.

## State and Data Flow Case

### Supplied state inventory

| Value           | Use                               |
| --------------- | --------------------------------- |
| `isFavorite`    | edited by a row and detail screen |
| `draftNote`     | temporary text inside an editor   |
| `favoriteCount` | count derived from items          |
| `selectedItem`  | temporary selection               |

### Task

Assign one owner to each value. Mark whether a child receives a value, `Binding`, observable model, or environment dependency. Reject storing `favoriteCount` separately when it can be derived. Compare an iOS 17 Observation route with an `ObservableObject` compatibility route.

## Media Maps and Permissions Case

### Supplied fictional places

| ID  | Name          | Latitude | Longitude | Asset          | Description              |
| --- | ------------- | -------: | --------: | -------------- | ------------------------ |
| 1   | North Gallery |   40.000 |   -75.000 | `GalleryBlue`  | Abstract blue blocks     |
| 2   | River Studio  |   40.012 |   -75.018 | `GalleryGold`  | Gold circles on charcoal |
| 3   | Hill Workshop |   39.988 |   -74.982 | `GalleryGreen` | Green layered triangles  |

### Task

Build gallery and map plans that use only these bundled assets and coordinates. Provide meaningful image descriptions. Add a selected-place state and a denied-permission state that leaves all core content usable. Write the user action that would justify requesting a device permission, but do not request one in the core case.

## Navigation and Multi Screen Case

### Supplied destinations

| Destination  | Relationship                        |
| ------------ | ----------------------------------- |
| Hobbies      | peer tab                            |
| Favorites    | peer tab                            |
| Hobby detail | drill-down from a list              |
| Edit hobby   | temporary task with Save and Cancel |

### Task

Choose `TabView`, `NavigationStack`, `NavigationLink`, and sheet roles. Trace data from one selected hobby into detail and editor views. Define expected state after Save, Cancel, Back, and tab switching. Reject any route that requires a hidden global selected ID.

## Lists Forms and CRUD Case

### Supplied initial items

| ID   | Title            | Complete |
| ---- | ---------------- | -------- |
| `A1` | Sketch interface | false    |
| `A2` | Build model      | true     |
| `A3` | Test empty state | false    |

### Task

Specify create, read, update, toggle, and delete behavior. A draft with only spaces is invalid. A duplicate title is allowed only when the stable ID differs. Provide an empty-state action and a recoverable delete route. For this exercise, display the rows alphabetically by title. Add incomplete item `A4` titled `Archive notes`, toggle `A1`, then delete `A2`. Write the IDs, titles, and completion flags still visible in display order.

## SwiftData Persistence Case

### Supplied relaunch sequence

1. Launch with an empty store.
2. Insert items `A1` and `A2`.
3. Mark `A2` complete.
4. Terminate and relaunch.
5. Delete `A1`.
6. Relaunch again.

### Task

State expected records at each step. Identify `@Model`, model container, model context, and query responsibilities. Define an in-memory test configuration. Add one schema-change risk for renaming `title` to `name` and one safe-reset route for sample data.

## Networking and Data Loading Case

### Supplied JSON fixture

```json
[
	{
		"id": 1,
		"title": "SwiftUI views",
		"body": "Declarative interface building"
	},
	{
		"id": 2,
		"title": "Model data",
		"body": "State ownership and updates"
	}
]
```

### Supplied failures

- HTTP 503 with a valid error body
- HTTP 200 with malformed JSON
- Cancellation during loading
- HTTP 200 with `[]`

### Task

Use the SAD6 app's `ReferenceEntry` to decode the two entries. Trace the store and screen for each supplied response. Try changing the first `body` key to `summary` and predict what happens on HTTP 200. Distinguish a transport failure, an HTTP error, and a decoding failure. Start from the loaded two-entry list, retry, then cancel that request. Which state should the screen return to?

## Debugging and Swift Testing Case

### Supplied defect

The tracker saves a draft with leading and trailing spaces. An all-space draft becomes an apparently blank row. The UI later fails to find that row by its displayed title.

### Task

Write expected and observed behavior, minimum reproduction, first useful signal, likely cause, and smallest correction. Add model-test cases for `"Plan app"`, `"  Plan app  "`, `"   "`, and `""`. Explain which view-level behavior remains outside the model test.

## Design and Accessibility Case

### Supplied rough screen

- Icon-only Save button has no accessible name.
- Completion appears only as green versus red.
- Text uses a fixed 14-point size.
- Long titles clip.
- Delete immediately removes an item.
- Reading order announces the footer before the form.

### Task

Prioritize barriers by impact on the core flow. Propose native SwiftUI corrections, a large-text check, VoiceOver order, a noncolor status representation, and a recoverable delete interaction. Preserve before-and-after evidence without claiming complete accessibility from one audit.

## Simulator and Device Validation Case

### Supplied matrix

| Destination     | Launch        | Core task   | Permission feature   | Console    |
| --------------- | ------------- | ----------- | -------------------- | ---------- |
| Small simulator | pass          | pass        | static fallback pass | clean      |
| Large simulator | pass          | title clips | static fallback pass | clean      |
| Device          | not available | not tested  | not tested           | not tested |

### Task

Write the supported claims and the claims that remain untested. Diagnose the clipped title without inventing device evidence. Create a smoke checklist for cold launch, primary task, empty state, failure state, relaunch, large text, and console anomalies.

## Apple Development and Distribution Map Case

Trail Notes 1.0 (7) opened the note list on an iPhone simulator. That is the only observed result in the core case. For the reverse walkthrough, assume an external tester successfully installed the same build through TestFlight. Treat that installation as a separate scenario.

### Supplied stages

| Stage                | Audience         | Resource                            |
| -------------------- | ---------------- | ----------------------------------- |
| Xcode simulator      | learner          | free Xcode                          |
| Personal device test | learner          | Apple Account / Personal Team       |
| TestFlight           | invited testers  | enrolled team and App Store Connect |
| App Store            | public customers | enrolled team and App Review        |

### Task

Add input artifact, output, required role, and one blocker to each stage. Mark the complete free learning route. Create a classroom simulation that shares neither credentials nor real tester contact information.

## Signing Teams and Bundle IDs Case

Team Oak owns the fictional tracker app. The intended release target is `net.example.tracker`; its separate gallery demo is `net.example.gallery`. The simulator build and the release archive use different destinations. Work from the following four independent observations. Where the record is silent, identify the missing evidence.

### Supplied failures

1. App uses `net.example.tracker` but the profile is for `net.example.gallery`.
2. A capability is enabled in code but absent from the app identifier.
3. The selected team cannot create distribution certificates.
4. A simulator build succeeds while an archive fails during signing.

### Task

For each case, identify bundle identifier, team, certificate, profile, capability, destination, and role layer. Name the first useful message and narrowest authorized correction. Never request a real certificate, private key, profile, password, or invitation.

## App Store Connect and TestFlight Case

### Supplied release record

| Field                | Value                                           |
| -------------------- | ----------------------------------------------- |
| Version              | 1.0                                             |
| Build                | 7                                               |
| Internal group       | QA Team                                         |
| External group       | Classroom Review                                |
| Beta focus           | Create, edit, and recover from an empty tracker |
| Build age            | 12 days                                         |
| First external build | yes                                             |

For the extension, QA reports that the empty-list recovery button is clipped on a small simulator at large text. Build 8 contains a layout change. Classroom Review has received no invitation and the export-compliance question is unresolved. Decide which group and build can supply the retest and which distribution decision still requires an authorized response.

### Task

Order app record, upload, processing, compliance response, group assignment, beta information, first external review, invitation, feedback, revision, and expiration. Compare internal and external tester constraints. Use fictional tester labels only.

## Capstone Build and User Testing Case

### Supplied brief

Create an offline Study Plan app for a fictional learner. The primary flow adds a topic, schedules a non-calendar study block, marks progress, and reviews incomplete topics. No login, analytics, contacts, precise location, notifications, or cloud sync are required.

### Task

Define minimum flow, non-goals, data model, state ownership, navigation map, empty and failure states, persistence choice, model tests, simulator checks, accessibility checks, and three fictional review tasks. Record only issue categories and counts.

## Final Publishing Walkthrough Case

### Supplied preflight discrepancy

The build says version 1.0 (8), screenshots show a feature removed in build 8, the description still promises that feature, the privacy answer says no data collection, and an included third-party SDK reports diagnostics. Reviewer notes do not explain the app's sample-data mode.

The review sheet identifies the selected build. Its support-link check, privacy-link check and final smoke-test fields are blank. Use an open evidence request for each blank. For the extension, a reviewer reports being unable to reach the sample list and requests reproduction steps. Build 8 opens the list from **Explore sample data** on the welcome screen. Explain when a notes-only correction suffices and when a new build is needed.

### Task

Make a submit-or-hold decision. Reconcile metadata, screenshots, privacy answers including third-party behavior, reviewer access, version/build record, support and privacy links, smoke result, known limitations, and release ownership.

## Shapes and Legacy Reference Case

### Supplied frames

| Frame  | Width | Height |
| ------ | ----: | -----: |
| Square |   240 |    240 |
| Wide   |   360 |    180 |
| Narrow |   160 |    320 |

### Task

Define a triangle or custom badge with points derived from `rect` rather than fixed screen coordinates. Explain how it scales in each frame. Add a nonanimated or reduced-motion representation. Compare one legacy path implementation with the current SwiftUI `Shape`/`Path` approach and name what transfers conceptually.
