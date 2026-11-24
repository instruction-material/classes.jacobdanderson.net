# Unity Game Development Practice Pack

Use these supplied cases when a learner needs deterministic data, a no-download alternative, or a shared comparison point. Record the Unity editor and package versions beside any live result. The tables use fictional project names and contain no learner data.

## Setup and Source Hygiene Case

### Baseline record

| Field                      | Supplied value                                                                                |
| -------------------------- | --------------------------------------------------------------------------------------------- |
| Project                    | Signal Garden                                                                                 |
| Editor                     | Unity 6.3 LTS, patch from `ProjectSettings/ProjectVersion.txt`                                 |
| Render route               | Built-in 2D or 3D template; record the selected route                                         |
| Required folders           | `Assets/Scenes`, `Assets/Scripts`, `Assets/Prefabs`, `Assets/Art`, `Assets/Audio`             |
| Required source files      | `Packages/manifest.json`, `Packages/packages-lock.json`, `ProjectSettings/ProjectVersion.txt` |
| Excluded generated folders | `Library`, `Temp`, `Logs`, `Obj`, local build output                                          |

### Asset review

| Asset                 | Source                | License status       | Repository decision         |
| --------------------- | --------------------- | -------------------- | --------------------------- |
| Player square         | Created in the editor | Self-created         | Track                       |
| Unity sample icon     | Unity sample package  | Verify package terms | Track source note           |
| Commercial soundtrack | Unrecorded            | Unknown              | Do not import               |
| CC0 click sound       | Named public source   | CC0                  | Track with attribution note |

Add the starter folder that contains `Assets`, `Packages`, and `ProjectSettings` in Unity Hub. Open it with the recorded editor and wait for package import to finish. If Unity reports unresolved NUnit references in the example tests, use the [test assembly setup](#testing-profiling-and-builds-case) below. Create `Assets/Scenes/SmokeTest.unity` with two visible squares and an orthographic camera framing them. Name one square Player and the other Obstacle. Save this script as `Assets/Scripts/SmokeTestLog.cs` and attach it to Player.

```csharp
using UnityEngine;

public sealed class SmokeTestLog : MonoBehaviour
{
    private void Start()
    {
        Debug.Log("Smoke scene ready");
    }
}
```

Save the scene, enter Play Mode, and verify both squares in the Game view and one `Smoke scene ready` message in the Console. Then diagnose one supplied failure: wrong editor version, missing scene reference, package mismatch, or unlicensed asset.

## Components and Lifecycle Case

Save a copy of the smoke scene as `Assets/Scenes/ComponentGallery.unity`. Use sprites for the player and platform. Place the player above the platform, add a BoxCollider2D to each object, and add a dynamic Rigidbody2D to the player. Keep the platform collider's Is Trigger option off so it blocks the falling player.

| Responsibility        | Component or script        | Required evidence            |
| --------------------- | -------------------------- | ---------------------------- |
| Position and rotation | Transform                  | Inspector values             |
| Visible appearance    | Renderer or SpriteRenderer | Player visible in Game view  |
| Physical body         | Rigidbody or Rigidbody2D   | Body type and constraints    |
| Contact boundary      | Collider or Collider2D     | Bounds visible in Scene view |
| Tunable movement      | `PlayerController`        | Private serialized speed     |
| State trace           | `LifecycleTrace`           | Callback observations        |

Save this script as `Assets/Scripts/LifecycleTrace.cs` and attach it to a new empty object. The first occurrence of each repeating callback is enough for the comparison.

```csharp
using UnityEngine;

public sealed class LifecycleTrace : MonoBehaviour
{
    [SerializeField] private Transform target;
    private bool observedUpdate;
    private bool observedFixedUpdate;

    private void Awake() => Debug.Log("Awake", this);
    private void OnEnable() => Debug.Log("OnEnable", this);

    private void Start()
    {
        Debug.Log("Start", this);
        if (target == null)
            Debug.LogWarning("Assign a target in the Inspector", this);
        else
            Debug.Log(target.position, this);
    }

    private void Update()
    {
        if (observedUpdate)
            return;
        observedUpdate = true;
        Debug.Log("First Update", this);
    }

    private void FixedUpdate()
    {
        if (observedFixedUpdate)
            return;
        observedFixedUpdate = true;
        Debug.Log("First FixedUpdate", this);
    }
}
```

Enter Play Mode with the target field empty. Record the startup messages and the warning. Disable and reenable the trace component and look for another OnEnable message. Exit Play Mode, drag the Player from the Hierarchy into the target field, and run again. Record the position log where the warning previously appeared. Compare the first Update and FixedUpdate messages with the initialization messages. Classify reference caching, frame input, physics motion, score initialization, and collision reporting by callback.

For the movement trial, add the supplied `PlayerController`, set the player's Gravity Scale to 0, and use the keyboard setup at the start of the next case. Compare the two speeds in the Inspector, then save the chosen value in the gallery scene.

## Input Movement and Camera Case

The source `PlayerController` reads `Input.GetAxisRaw("Horizontal")`. In **Edit → Project Settings → Player → Other Settings**, set **Active Input Handling** to **Both**, restart Unity, and verify the Horizontal axis in the Input Manager before testing the starter movement.

Create an Input Actions asset. Add a `Move` action with the Value action type and a 1D Axis composite. Bind its negative side to A and its positive side to D. In `PlayerController.cs`, import `UnityEngine.InputSystem`, add a serialized `InputActionReference` field named `move`, and assign the Move action in the Inspector. Use `move.action.Enable()` in `OnEnable` and `move.action.Disable()` in `OnDisable`. Replace the legacy read in `FixedUpdate` with `move.action.ReadValue<float>()`. Check left, right, and release before adding jump, pause, or controller bindings.

### Compare movement controls

Use a wide lane with a marked starting position. Begin each trial there and hold D for about two seconds, using the same interval each time. Record the observed frame rate and the change in the player's x coordinate. In the desktop test scene, set VSync Count to Don't Sync and set [Application.targetFrameRate](https://docs.unity.com/en-us/engine/6000.3/script-reference/unityengine/application/targetframerate) to the trial's rate in an active component's Start method. If the measured rates are alike, adjust the requested rates and repeat.

| Trial | Target frame rate | Speed | Movement          | Compare |
| ----- | ----------------: | ----: | ----------------- | ------- |
| A     |                30 |     5 | Direct velocity   | Travel  |
| B     |                60 |     5 | Direct velocity   | Travel  |
| C     |                60 |     5 | Acceleration cap  | Stop    |

For C, use `Mathf.MoveTowards(body.linearVelocity.x, horizontal * moveSpeed, 18f * Time.fixedDeltaTime)` as the horizontal velocity value in `FixedUpdate`. Preserve the existing vertical velocity. Compare A with B for traveled distance at two render rates. Compare B with C for how far the player moves after release. Use the same camera for these comparisons.

### Follow the player horizontally

Save this script as `Assets/Scripts/HorizontalCameraFollow.cs`, attach it to the orthographic camera, and assign the player Transform.

```csharp
using UnityEngine;

public sealed class HorizontalCameraFollow : MonoBehaviour
{
    [SerializeField] private Transform target;

    private void LateUpdate()
    {
        if (target == null)
            return;

        var position = transform.position;
        position.x = target.position.x;
        transform.position = position;
    }
}
```

Play the same route with the component disabled and enabled. Record when the player and the next landmark leave the frame. For a tuning trial, approach the target x position with `Mathf.SmoothDamp` and compare one smoothing time at a time.

## Physics Collision and Collection Case

### Assemble the Relic Runner scene

1. Create `Assets/Scenes/RelicRunner.unity`. Put an orthographic camera at `(0, 0, -10)` and frame the objects around y = 0. Use visible square sprites in different sizes for the player, coins, and hazard.
2. Add an empty object with `GameManager`. Put the Player sprite at x = -4 and give it the built-in Player tag, `PlayerController`, a dynamic Rigidbody2D with Gravity Scale 0, and a BoxCollider2D. Use the keyboard baseline from the input case to check horizontal movement.
3. Place three coins in the starter at x = -2, 0, and 2. Give each a BoxCollider2D with **Is Trigger** enabled and the `Collectible` script. Place a hazard at x = -6 with a trigger collider and `Hazard`. Expand the camera framing if any target falls outside the Game view. For the solution, place five coins on the playable path and check the five-coin goal in `GameSession.cs`.
4. Add a Canvas and a Start Button. In the Button's On Click list, assign the scene's GameManager and select `GameManager.StartGame()`. Verify the EventSystem has a UI input module compatible with the project's active input backend. Save the scene.

From a fresh Play Mode run, use Start and reach each coin to check that each scores once. Restart Play Mode and go left into the hazard to check failure. Before adding a HUD, a breakpoint in `CollectCoin` or `FailRun` can be used to inspect the state and score.

Place a solid wall past the last coin. Complete the interaction matrix before editing callbacks.

| Object A | Object B | Blocks movement? | Reports event? | State change            |
| -------- | -------- | ---------------- | -------------- | ----------------------- |
| Player   | Wall     | Yes              | Optional       | Movement blocked        |
| Player   | Coin     | No               | Yes            | Score +1; coin disabled |
| Player   | Hazard   | Project decision | Yes            | Lost                    |
| Coin     | Coin     | No               | No             | None                    |

To reproduce the early-pickup issue, touch a coin while Ready, back away, then start. The pre-start score remains zero, but the original callback hides the coin. Add this method to GameManager, preserving the existing scoring method:

```csharp
public bool TryCollectCoin()
{
    if (State != SessionState.Playing)
        return false;

    CollectCoin();
    Debug.Log($"Score: {Score}", this);
    return true;
}
```

Keep the Player tag check in `Collectible.OnTriggerEnter2D`. After the tag check, get the GameManager with `FindFirstObjectByType<GameManager>()` and call `gameObject.SetActive(false)` only when the manager exists and `manager.TryCollectCoin()` returns true. Touch before Start, leave the trigger, start, and enter it again. Check that the coin stays visible until the second touch and the Console records one point.

Test these failures: a coin disappears before Start, the coin increments twice, a trigger never fires, a 2D callback is used with 3D components, and restart leaves the coin disabled. For each, name the likely component, layer, callback, or reset issue and the smallest confirming check.

## UI State and Restart Case

Use the following state transitions. The linked scripts call Pre-game `Ready` and Lost `Failed`. Implement `Paused` in the local GameSession. Pause only from Playing, Resume only from Paused, and Start only from Ready.

| Current state | Event          | Next state | Visible result                     |
| ------------- | -------------- | ---------- | ---------------------------------- |
| Pre-game      | Start          | Playing    | Controls and HUD active            |
| Playing       | Pause          | Paused     | Pause menu and focus visible       |
| Paused        | Resume         | Playing    | Game resumes                       |
| Playing       | Goal reached   | Won        | Win message and restart action     |
| Playing       | Hazard reached | Lost       | Failure message and restart action |
| Paused, Won or Lost | Restart  | Pre-game   | Score, objects, and timer reset    |

Use a Canvas to display the Ready, Playing, Paused, Won, and Failed panels. Set the heading and score from GameManager. Expose public parameterless methods on the scene controller to handle Start, Pause, Resume, and Restart, then connect each Button's On Click list to the matching method. Refresh the visible panel after the state changes. Give the primary button focus with `EventSystem.current.SetSelectedGameObject(button.gameObject)` when a menu opens. Check arrow navigation and Submit in the project input settings.

In the controller, change [time scale](https://docs.unity.com/en-us/engine/6000.3/script-reference/unityengine/time/timescale) to zero upon entering Paused and back to one on Resume. The Resume button remains available through the EventSystem. To reload the scene, include it in the active Build Profile, restore time scale to one, and call `SceneManager.LoadScene(SceneManager.GetActiveScene().name)` from a script that imports `UnityEngine.SceneManagement`. Check that the player position and collectibles reset along with the score.

Test a rejected transition, such as Pause after Won. Run every valid route with visible focus, readable status, and a cue that works without color or sound.

## Prefabs Levels and Feedback Case

Drag a working coin into `Assets/Prefabs` and use that asset for the first wave. Add three empty objects at distinct reachable positions, then replace the hand-placed coins with these spawn positions.

Save this as `Assets/Scripts/CoinWave.cs` and attach it to an empty object. Assign GameManager, the coin prefab, and the three positions in the Inspector. Add `CoinWave.Begin` to the Start button's On Click list after `GameManager.StartGame`.

```csharp
using System.Collections;
using Course.UnityGameDevelopment;
using UnityEngine;

public sealed class CoinWave : MonoBehaviour
{
    [SerializeField] private GameManager manager;
    [SerializeField] private GameObject coinPrefab;
    [SerializeField] private Transform[] positions = System.Array.Empty<Transform>();
    private bool started;

    public void Begin()
    {
        if (started || manager == null || coinPrefab == null ||
            manager.State != SessionState.Playing)
            return;

        started = true;
        StartCoroutine(SpawnCoins());
    }

    private IEnumerator SpawnCoins()
    {
        var created = 0;
        foreach (var point in positions)
        {
            if (created >= 3 || manager.State != SessionState.Playing)
                yield break;
            if (point == null)
                continue;

            Instantiate(coinPrefab, point.position, point.rotation);
            created++;
            yield return new WaitForSeconds(1.5f);
        }
    }
}
```

The first wave matches the three-coin starter. Keep the additional rows for a stretch level with an explicit goal for the larger number of coins.

| Wave | Count | Interval | Allowed region   | Stop rule             |
| ---- | ----: | -------: | ---------------- | --------------------- |
| 1    |     3 |    1.5 s | Marked play area | All collected or 20 s |
| 2    |     5 |    1.2 s | Marked play area | All collected or 25 s |
| 3    |     6 |    1.0 s | Marked play area | Win, loss, or 30 s    |

Map three events to feedback. A label or icon is enough for the base cue. To add audio, assign an AudioSource and a short clip and call `PlayOneShot` after the state change. For animation, trigger a scale pulse or brief banner on the same accepted event.

| Event   | Visual or motion cue | Audio cue    | Nonaudio equivalent            |
| ------- | -------------------- | ------------ | ------------------------------ |
| Collect | Scale pulse          | Short chime  | Score and icon change          |
| Damage  | Brief flash or shake | Impact sound | Health and text change         |
| Win     | Banner and animation | Win cue      | Win heading and restart button |

Verify prefab overrides, spawn bounds, object cleanup, animation transitions, and one local build launch.

## Capstone Playtest and Revision Case

Choose one bounded vertical slice:

1. **Relic Runner:** use the three-coin starter goal, one failure hazard, and restart.
2. **Robot Repair:** reach a panel and repair a robot with one part. Try a wrong part for the failure path. Restart restores the part and panel.
3. **Arena Alchemist:** collect one power-up and survive a short hazard pattern. A hazard hit ends the attempt. Restart restores the timer and the power-up.

Write a one-page brief with the audience, controls, goal, core loop, success and failure conditions, scene name, placeholder assets, one accessible status cue, one risk, and one feature outside scope. The done criteria should be observable in both the editor and the local build.

Use fictional playtest labels.

| Case | Starting state | Task              | Observed result | Type                                | Severity | Decision    | Retest |
| ---- | -------------- | ----------------- | --------------- | ----------------------------------- | -------- | ----------- | ------ |
| P1   | Fresh launch   | Reach the goal    | Record          | Bug / usability / balance / request | 1–3      | Fix / defer | Record |
| P2   | After loss     | Restart           | Record          | Bug / usability / balance / request | 1–3      | Fix / defer | Record |
| P3   | Paused         | Resume and finish | Record          | Bug / usability / balance / request | 1–3      | Fix / defer | Record |

Revise the two highest-impact findings. For each, retain the original result and repeat the same task after one deliberate change. Confirm the launch and restart checks in the local build, then record any known limit and the next action that would address it.

## Testing Profiling and Builds Case

Open the Test Runner and check that the project lists the selected tests. The linked Edit Mode tests call the scoring and state rules. The linked Play Mode example creates a GameManager in code. Use the separate saved-scene smoke check below to verify scene wiring.

If the project is missing assembly definitions, create a runtime Assembly Definition in `Assets/Scripts`. If movement has migrated to Input Actions, reference the `Unity.InputSystem` assembly there. Use the Test Runner's EditMode and PlayMode tabs to [create test assemblies](https://docs.unity3d.com/Packages/com.unity.test-framework@1.4/manual/workflow-create-test-assembly.html). Put the supplied Edit Mode tests in the Edit Mode assembly folder and the supplied Play Mode examples in the Play Mode assembly folder. Add the runtime Assembly Definition as a reference in each test assembly. After Unity recompiles, verify the tests appear under the matching tabs.

| Check                   | Supplied target                                           |
| ----------------------- | --------------------------------------------------------- |
| Edit Mode standard case | Score changes from 2 to 3 after one collectible           |
| Edit Mode boundary case | CollectCoin while Ready leaves score at 0                  |
| Scene pickup boundary   | One accepted pickup hides the coin and scores once        |
| Saved-scene smoke       | RelicRunner opens, player appears, and Start begins play  |
| Build Profile           | DesktopDevelopment includes RelicRunner and builds locally |
| Profile symptom         | 200 objects allocated every frame during a spawn loop     |

In **File → Build Profiles**, create the desktop profile for the current platform, add `Assets/Scenes/RelicRunner.unity` to the scene list, and build to `Builds/DesktopDevelopment`. Open the build and verify the same start-to-restart loop. Classify failures as logic, serialized scene wiring, package or test assembly setup, build configuration, or performance. Record measured evidence before and after changing the spawn loop. Keep any CI route bounded to tests, source validation, and build configuration checks.

Add this rule case to the Edit Mode test class to check the ready-state boundary.

```csharp
[Test]
public void CollectingBeforeStartLeavesScoreAtZero()
{
    var session = new GameSession(3);
    session.CollectCoin();
    Assert.That(session.Score, Is.EqualTo(0));
    Assert.That(session.State, Is.EqualTo(SessionState.Ready));
}
```

For an optional automated run, set `UNITY_EDITOR` to the executable for the activated Unity version. From the project root, run the [Test Framework command](https://docs.unity3d.com/Packages/com.unity.test-framework@1.4/manual/reference-command-line.html). Retain the exit result, test report, and log together. Check that the new test ran as well as passing.

```sh
"$UNITY_EDITOR" -batchmode -projectPath "$PWD" -runTests \
  -testPlatform EditMode -testResults "$PWD/../editmode-results.xml" \
  -logFile "$PWD/../editmode.log"
```

## Full Project Repository Workflow Case

Audit the linked starter and solution first. Then use this inventory to check the sought states after creating scenes and verifying the corresponding behavior.

| Path or artifact              | Starter                         | Review state             | Repository rule |
| ----------------------------- | ------------------------------- | ------------------------ | --------------- |
| `Assets/Scenes`               | Playable baseline               | Completed vertical slice | Track           |
| `Assets/Scripts`              | Intentional incomplete behavior | Reviewed behavior        | Track           |
| `Packages/manifest.json`      | Present                         | Present                  | Track           |
| `Packages/packages-lock.json` | Present                         | Present                  | Track           |
| `ProjectSettings`             | Present                         | Present                  | Track           |
| `Assets/Tests`                | Smoke or placeholder boundary   | Passing selected tests   | Track           |
| `THIRD_PARTY_ASSETS.md`       | Template                        | Complete                 | Track           |
| `.gitattributes`              | LFS rules                       | Verified LFS rules       | Track           |
| `Library` and `Temp`          | Absent                          | Absent                   | Ignore          |

Write a checkpoint containing scene or system, scripts changed, play or test result, one decision, one unresolved risk, and next action. Then describe how a clean machine can clone, open, play, test, and build the project.

Record the commit and role folder before opening a fresh clone. Restore tracked Git LFS assets when the project uses them. Check that scene, prefab, and asset files retain their matching `.meta` files, so serialized references resolve. Open the matching editor, wait for package restoration, and run the recorded scene, test, and build checks. Record what each role does and the learner task that remains open in the starter.
