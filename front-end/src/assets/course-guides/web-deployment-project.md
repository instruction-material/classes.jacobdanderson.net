# Retain, verify and restore a front-end release

## Files and startup

The selected role contains `frontend/`, `backend/`, `release.mjs`, and
`release-model.mjs`. The shared README contains matching macOS/Linux and
PowerShell commands. `backend/src/server.js` owns the API listener and its ready
record. `frontend/serve.mjs` owns the static listener. `frontend/env.js` selects
the public API base URL, and `frontend/main.js` fetches and renders the status.
The starter supplies `env.template.js`; copy it to `env.js` before startup.

Use Node.js 24 and the complete maintained Web-Development-Foundations checkout
at `962d1be3da0d954ad774390b78cb044395a12262`. Install the existing dependencies
from its root with `npm ci` if they are missing. Run the two services in separate
terminals, both initially at that root:

```sh
npm run start --workspace WDF5-Separate-Deployment-Lab/starter/backend
```

```sh
node WDF5-Separate-Deployment-Lab/starter/frontend/serve.mjs
```

Open `http://127.0.0.1:4173`. The default API is on port 4001; each process prints
a JSON ready event with its actual loopback host and port. Use the matching
`solution` paths for the reference. Stop only the processes started for this
exercise. If either port is occupied, choose free ports using the README and
update both public API configuration and the allowed page origin consistently.

The IDE imports editable source. Save, reopen and export the chosen role to
preserve changes. Copy all exported role files, including nested `frontend/`
and `backend/` folders and added exercise programs, into the matching role of
the complete pinned checkout. Retain its root manifest and lockfile. A role ZIP
alone is not a complete dependency installation, and the browser workspace does
not start these two native servers.

## Release-model contract

Ordinary page startup works before completing the release exercise. Implement
two functions in `release-model.mjs`:

1. `digestBytes(bytes)`: create a SHA-256 hash, update it with the supplied bytes,
   and return lowercase hexadecimal with `digest("hex")`. Use the supplied
   `createHash` import. Hash the bytes without converting arbitrary file data
   to text. The empty-buffer digest is
   `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`.
2. `assertInventory(expected, actual)`: compare complete arrays by filename.
   Require equal lengths, reject duplicate names in either input, and require
   the same `bytes` and `sha256` for each name. Order does not matter. A Map
   supports lookup by name; sorted copies are another approach. Preserve both
   input arrays. On a difference, throw the supplied
   `artifactError("artifact_integrity_mismatch")`; otherwise return normally.

The provided validator checks manifest shape, allowed filenames and bounds.
`collect` reads the public file set; `writeArtifact` copies it to a new target;
`readArtifact` checks the resulting tree. Trace how the two completed functions
connect those operations. The reference implements this core contract. It does
not include programs added by the optional projects.

## Release A and a deliberately faulty release B

Create a parent folder and build a new retained release from the repository root:

```sh
mkdir -p wdf5-releases
node WDF5-Separate-Deployment-Lab/starter/release.mjs build wdf5-releases/starter-a
node WDF5-Separate-Deployment-Lab/starter/release.mjs verify wdf5-releases/starter-a
```

Each successful command exits zero and prints JSON with `ok: true`, file count
and `manifestSHA256`. An unsuccessful command exits nonzero and prints its error.
The artifact includes the four listed front-end files, plus `styles.css` in the
reference, and its manifest. The verifier rejects missing, extra, changed or
nonordinary files and malformed manifests. Inputs are limited to 1 MiB per file,
5 MiB for the set and 16 KiB for the manifest. Output must be a new independent
directory with an existing parent. No existing target is overwritten. A failed
write can leave an incomplete candidate; inspect it and use a new retry target.

Stop only the source front-end process. Start the copied A server with
`node wdf5-releases/starter-a/serve.mjs`, then reload the page. Keep the API
running throughout this front-end switch and record its ready process/port.

Now change only the editable source's `frontend/env.js`: set `apiBaseUrl` to
`http://127.0.0.1:4001/not-a-status-prefix`. Build and verify a new `starter-b`
with the same commands and a new target. B passes byte-integrity checks because
its wrong configuration was included consistently. Stop A's front end, serve
B's `serve.mjs` on the same port, and reload. The page reports an API error;
its request path is `/not-a-status-prefix/api/status`. Independently request
`http://127.0.0.1:4001/api/status` and confirm that the unchanged API still works.
This distinguishes a configuration error from an unavailable process.

## Restore A without rebuilding

```sh
node WDF5-Separate-Deployment-Lab/starter/release.mjs restore wdf5-releases/starter-a wdf5-releases/restored-a
node WDF5-Separate-Deployment-Lab/starter/release.mjs verify wdf5-releases/restored-a
```

Stop B's front end and serve `restored-a/serve.mjs` on the same port. Reload and
verify the healthy result without restarting the API. Compare A and restored A
file by file, including the original manifest bytes. The tool restores validated
retained bytes, so the currently broken source configuration is not used.
Restore that source configuration separately before making future builds.

Change a file in a disposable artifact copy and confirm `verify` fails. Keep A
unchanged. A digest establishes consistency with a particular manifest, not who
produced it: someone able to replace both files and manifest can create another
self-consistent tree. Do not edit artifacts while checking, restoring or serving
them. This local learning manifest is not signed production provenance.

## Evidence and recovery checks

Run `node --test test/separate-deployment-startup.test.mjs` from the complete
checkout for the maintained native checks. Also retain the actual browser result
for normal load, wrong origin, unavailable API and rollback. Save both completed
functions, architecture/configuration map, A and restored A inventories, B's
passing integrity result and failing browser result, and the saved-export run.
A successful native request alone does not prove browser acceptance.
