# Unity Game Development Verification Guide

Use this guide after completing a practice case. Equivalent Unity implementations are valid when the evidence demonstrates the same behavior. Do not compare only screenshots; inspect the component, script, state, test, or build evidence named by the case.

## Setup and Source Hygiene Key

- `ProjectVersion.txt` identifies the exact editor baseline; package manifests and locks identify dependencies.
- `Assets`, `Packages`, and `ProjectSettings` belong in source control. `Library`, `Temp`, `Logs`, and local build output do not.
- The authored smoke scene passes when Play Mode starts without compile errors, the camera frames the player and obstacle, and the Console displays `Smoke scene ready` once.
- A wrong editor version requires a deliberate upgrade or matching install, not silent conversion. A missing serialized reference is repaired in the scene or prefab. A package mismatch is resolved through the manifest and lock. An asset with unknown terms is removed.
- The commercial soundtrack fails the provenance gate. The self-created square and documented CC0 sound pass.

## Components and Lifecycle Key

- Transform stores spatial state; Renderer or SpriteRenderer displays it; Collider defines contact bounds; Rigidbody participates in physics; scripts own game-specific behavior.
- Cache local references and validate serialized dependencies during initialization. `Start` is suitable for setup that depends on enabled objects. Frame input belongs on a frame path. Rigidbody changes belong on the physics path. Collision callbacks report the matching physics event.
- On the trace object, Awake then OnEnable then Start appear at startup. Reenabling logs OnEnable again. FixedUpdate follows the physics schedule, so its position relative to Update can vary. Assigning the player replaces the missing-target warning with its position.
- A private `[SerializeField]` preserves encapsulation while permitting Inspector tuning.
- Frame-rate-independent frame motion includes elapsed time. Physics behavior avoids competing direct Transform and Rigidbody ownership.
- A missing Inspector dependency is confirmed by the field and Console evidence, assigned deliberately, and guarded when absence is a valid state.

## Input Movement and Camera Key

- The starter reads the legacy Horizontal axis. The migrated movement reads the enabled Move action and applies its float value in `FixedUpdate`. Pressing A or D moves left or right; releasing the key stops horizontal motion.
- Trials A and B are expected to produce comparable distance and control despite different frame targets. A large difference indicates frame-dependent motion or an inconsistent physics path.
- Trial C keeps the same top speed as B. The rate limit takes longer to build speed and increases stopping distance after a full-speed release. Compare the response at the same starting speed.
- The camera follows without hiding the destination, causing preventable motion discomfort, or taking ownership of player movement.
- Keyboard bindings complete the gate. Controller bindings, remapping, acceleration, friction, and coyote time are valid stretch evidence only after the base route works.

## Physics Collision and Collection Key

- The room's wall blocks movement. The coin and hazard report overlaps. The selected collision and trigger callbacks match the matrix.
- A pickup passes when touching it before Start leaves it available, touching it during play scores once, and another event cannot score it again. Update the collectible only when the game accepts the pickup.
- Missing trigger events require compatible 2D or 3D physics components, the correct callback signature, at least one suitable Rigidbody, enabled Colliders, and an allowed layer pair.
- Passing through a floor can involve missing Colliders, trigger configuration, high-speed tunneling, incompatible dimensions, or competing Transform motion.
- Restart passes only when score, coin state, player state, hazard state, and UI return to the declared initial state.

## UI State and Restart Key

- GameSession owns Ready, Playing, Paused, Won, and Failed. The restart action restores Ready in a fresh scene. UI panels reflect those states.
- Start, pause, resume, goal, hazard, and restart events follow the supplied transition table. Invalid events leave state unchanged or produce a controlled diagnostic.
- Each screen exposes a readable heading, current status, and next action. Keyboard focus is visible and moves in a predictable order.
- Win, loss, damage, collection, and pause remain understandable through text, shape, position, or motion when color or audio is unavailable.
- Restart passes when a fresh Pre-game state has initial score, timer, active objects, player position, normal time scale, and focus on Start. The supplied `GameManager.ResetRun()` resets rules state. Restore scene objects separately or reload the saved scene.

## Prefabs Levels and Feedback Key

- Shared prefab behavior lives on the prefab; intentional per-instance values remain overrides and are documented.
- Spawn counts, interval, region, and stop rule prevent unbounded creation. Objects are reused or cleaned up once no longer needed.
- The starter wave creates up to three coins at its assigned points. A repeated Begin call starts no new wave. Failed or won state stops further creation and scene reload restores the initial wave state.
- Each feedback cue communicates a named event. Audio always has a visible or textual equivalent.
- Animation parameters follow declared transitions and do not hide required state inside an animation event without documentation.
- The build gate passes when the named scene launches outside the editor with controls, core interaction, feedback, and restart intact.

## Capstone Playtest and Revision Key

- The capstone scope contains one complete loop; optional levels, enemies, effects, or systems stay outside required completion.
- Before playtesting, component ownership, controls, collision behavior, state transitions, feedback alternatives, and a local build have all passed their module gates.
- Playtest records describe behavior without identifying the person. Findings are classified as bug, usability, balance, or feature request and ranked by effect on the core loop.
- Two revisions pass only when each has a before observation, a deliberate change, and a retest result.
- The evidence packet includes the brief, build record, attribution, playtest table, bug-and-retest note, revisions, known limits, and a short architecture demonstration.

## Testing Profiling and Builds Key

- The Edit Mode standard case expects score 3. The Ready boundary case expects score 0 and unchanged state. The scene check verifies disappearance and guards repeat scoring for the individual coin.
- The component check proves that a dynamically created GameManager can enter Playing. The saved-scene smoke check passes when RelicRunner loads, the player exists, and the Start button begins play without unexplained Console errors.
- A Build Profile identifies target, scene list, settings, and output. A build that only works through editor state fails the reproducibility gate.
- Allocating 200 objects every frame is measured before optimization. A valid revision bounds spawning, reuses objects where justified, and records the changed profiler evidence.
- CI remains bounded to source checks, selected tests, and reproducible build validation. No persistent service or learner credential is required.

## Full Project Repository Workflow Key

- After assembling the scene, the starter plays with named learner behavior still to implement. Compare the reviewed scripts after recording an attempt. The starter targets three coins and the review state targets five.
- Track the authored scene, source, package records, project settings, test files, and attribution. Add LFS rules for large source binaries as needed. Generated caches stay excluded.
- A useful checkpoint identifies the exact scene or system, scripts changed, observed play or test result, decision, unresolved risk, and next action.
- Meaningful start, checkpoint, and review tags point to reproducible states rather than arbitrary backups.
- A clean-clone record names repository URL, editor version, package restoration, scene to open, play check, selected tests, Build Profile, output, and any known warning.
