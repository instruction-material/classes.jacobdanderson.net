# Diagnose a deployment and rehearse recovery

## A worked failure table

| Observation | What it establishes | Next check |
| --- | --- | --- |
| Page loads, status text reports an API error | The static page is reachable | Inspect the API request URL and browser error |
| Native `/api/status` request succeeds, browser rejects access | The API can respond to that native client | Compare actual page origin with CORS response |
| B verifies, but its request path has an extra prefix | Its saved bytes match its manifest | Compare public configuration with the API route |
| API is stopped, page still loads | Front-end and API processes have separate lifetimes | Restart only the owned API and retry |
| Restored A works while source still contains B's wrong URL | Retained artifact recovery is independent of rebuilding | Compare A and restored A bytes and check unchanged API |

For a wrong-origin experiment, stop the owned API and restart it with
`FRONTEND_ORIGIN=http://127.0.0.1:1` in macOS/Linux, or set that environment
variable in PowerShell as described in the README. Keep the page at port 4173.
A native request can still receive a 200 status, but its response must not permit
the page's actual origin. Reload the page and inspect the browser's CORS result.
Stop the owned API, remove the temporary override, restart and verify recovery.
Changing this server environment value does not require rebuilding the front end.

For an unavailable-API experiment, stop only that API, reload and retain the
visible error. The front-end page should still load. Restart the API with its
original port and allowed origin, then reload and retain the healthy result.
A readiness check is meaningful only for the dependencies needed to serve the
request. This stateless status API has no database and does not implement a
separate readiness endpoint. Its ready log establishes that the listener opened;
it does not prove the browser was able to read a response.

The preceding notes project provides a separate health/readiness example:
`/health` reports the running service, while `/api/ready` can return 503 for an
unavailable storage adapter. A process can be alive without being ready for a
dependent operation. Do not invent a database restore result for this status lab.

## Evidence that helps diagnosis

For each case, record the changed value, owned process and port, expected result,
actual request URL/status, visible browser result and recovery result. Record
method/path/status and event labels without private credentials or personal
request bodies. A log that says a process started is weaker evidence than a
completed request from the intended client. Conversely, a failed request alone
does not identify which configuration layer caused it.

The lab limits the artifact input set, but it is not a general hosting platform.
Before optional public hosting, identify listener exposure, TLS termination,
proxy trust, secret storage, request/body limits, timeouts, rate controls, log
retention and the host's own resource limits. Describe which limits were actually
tested. A local loopback smoke check does not establish internet availability.

## Backup, rollback and data compatibility

A rollback trigger is an observed acceptance failure with an identified retained
working version. The lab's trigger is B's failed browser status request. Its
rollback steps are: retain the failing evidence; verify A; restore A to a separate
new target; stop only B's front-end process; serve restored A; recheck the browser
and API; compare retained bytes. The API remains running. Source configuration
is corrected separately so a later build does not recreate B.

A backup is a retained copy; a successful restore requires checking the restored
result. Here the artifact retains public front-end files and configuration only.
Private API settings and persistent user data are different backup subjects.
For an application with storage, inventory its data format and compatible code
versions, back up before a conversion, restore into a separate target, and
compare records before switching. Reverting code does not automatically undo
a database migration, a sent message or another external side effect.

A release record should identify the source revision, artifact digest, required
configuration, acceptance cases, retained working artifact, rollback trigger and
recovery observations. An authenticated production pipeline also verifies the
builder and source identity. Do not turn this exercise's local manifest into a
claim of authenticated production provenance.
