# Native production deployment

The canonical custom-host deployment serves `front-end/dist` directly from
Nginx and runs one loopback-only compiled API under systemd. It does not use
Docker. The release gate never changes DNS, A or AAAA records, TLS material,
MongoDB data, credentials, or backups.

## Authority and layout

Only deploy a clean checkout whose `origin` is the canonical
`instruction-material/classes.jacobdanderson.net` repository. Fetch `origin/main`
and tags before beginning; neither native script fetches or mutates a remote.
The checkout's `HEAD` and exact annotated `v2.x` tag must resolve to the same
commit, reachable from fetched `origin/main`. An unrelated later main commit
must not invalidate an immutable tagged build or retry; side-branch commits
outside canonical main are rejected. The public version is the tag; the root package
version is not the release version.
Prepared candidates and immutable releases use these paths:

```text
/srv/classes.example.com/releases/.candidates/<tag>-<revision>
/srv/classes.example.com/releases/<tag>-<revision>
/srv/classes.example.com/current -> releases/<tag>-<revision>
```

Every candidate carries an internal `.classes-native-release.json` containing
the exact tag, revision, and checksums for the built frontend, compiled API,
installed production API dependencies, package inputs, and native
configuration. Unexpected structural entries, hardlinks and every payload
symlink are rejected. Promotion verifies a fresh protected snapshot rather than
changing ownership of mutable builder files. The manifest is operational metadata, not a
public endpoint.
`/release.json` and `/api/release` intentionally remain 404.

## Source and host contract

The current manifest proves the release's identity and payload bytes. Its
`schemaVersion: 1` is **not** a declaration that every host adapter can install
the release. Do not interpret a successful source build, audit, or attestation
as production readiness when a runtime, listener, migration, or rollback
contract has changed.

A future contract revision must declare the application and source identity,
supported runtime and architecture, required host-adapter capabilities,
artifact hashes, readiness checks, migration prerequisites, and compatibility
with the exact retained rollback release. CI must validate that declaration
against the unpacked artifact and rehearse upgrade, repeat deployment, failed
activation, and restoration without downloading or rebuilding the prior
artifact. The host adapter must advertise its supported contract and reject an
unsupported requirement **before** building or changing production, reporting
that a host update is needed rather than classifying the source as defective.

Introduce and enforce that revision together with a reviewed server adapter;
do not change the existing manifest schema or relax its verifier independently
to make a new release deploy. Site-specific ports, environment values, service
ownership, and proxy policy remain under host control. The server owns retry
classification, promotion, rollback accounting, and the final live status;
source release notes describe verified artifacts, not activation.

## One-time server setup

Install system Node 24.18.0, npm 12.0.1, Python 3, Git, Nginx, `curl`, and the existing
MongoDB or Vault client configuration. Create separate build and runtime users;
neither needs an interactive login:

```bash
sudo useradd --system --home-dir /nonexistent --shell /usr/sbin/nologin classes
sudo useradd --system --home-dir /nonexistent --shell /usr/sbin/nologin classes-build
sudo install -d -o root -g root -m 0755 /srv/classes.example.com
sudo install -d -o root -g root -m 0755 /srv/classes.example.com/releases
sudo install -d -o classes-build -g classes-build -m 0750 /srv/classes.example.com/releases/.candidates
sudo install -d -o root -g root -m 0755 /etc/classes.example.com
sudo install -o root -g root -m 0600 deploy/native/api.env.example /etc/classes.example.com/api.env
```

Fill `api.env` with reviewed production values. Keep the API on
`127.0.0.1:3008`, use one reviewed Mongo credential source, retain the
loopback proxy boundary, and never commit or copy a real secret back into the
checkout.

Adapt `deploy/native/host-nginx.conf.example` into the existing TLS vhost. The
`classes-http-maps.conf` include belongs in Nginx's `http` context; the
`classes-server-policy.conf` include belongs inside the HTTPS server. Preserve
the server's current certificate paths and reviewed HTTP/2 and HTTP/3 listener
options. The automated promoter is deliberately not an initial-cutover tool:
it refuses to activate unless `current` already resolves to a validated,
root-owned, immutable native release. Establish that first release and preserve
the pre-native serving configuration through the server's reviewed cutover
procedure before using this promoter for later releases. Do not claim or rely
on automatic rollback until that prerequisite exists.

Once the rollback prerequisite is established, install the tagged release's
include targets and unit before enabling the adapted vhost:

```bash
sudo install -o root -g root -m 0644 deploy/native/classes-http-maps.conf /etc/nginx/snippets/classes-http-maps.conf
sudo install -o root -g root -m 0644 deploy/native/classes-static-headers.conf /etc/nginx/snippets/classes-static-headers.conf
sudo install -o root -g root -m 0644 deploy/native/classes-server-policy.conf /etc/nginx/snippets/classes-server-policy.conf
sudo install -o root -g root -m 0644 deploy/native/classes-api.service /etc/systemd/system/classes-api.service
sudo nginx -t
sudo systemctl daemon-reload
```

Enable the service once:

```bash
sudo systemctl enable classes-api.service nginx.service
```

The promoter installs the three Nginx snippets and systemd unit atomically from
the same candidate. Do not maintain alternate hand-written copies. Nginx must
serve only real generated routes, use the internal branded `404.html` for
unknown page paths, keep dotfiles private, and proxy `/api` only to loopback.
API 404s remain JSON and are not replaced by the page 404.

The neutral fork does not load central analytics. The native policy also denies
the legacy same-origin analytics proxy, preventing inherited host configuration
from forwarding Classes session cookies to an analytics service.
Before promoting this release, review the host vhost and remove any separate
legacy analytics proxy location. A more specific location can override the
source denial even when `nginx -t` passes, so candidate activation also checks
the effective legacy paths for the local 404 document and rolls back on drift.
Keep the application listener and all existing credentials unchanged. Rollback
checks the retained release against its own policy instead of applying the
candidate's new CSP to it.

## Prepare, authenticate and promote

From v2.8.4 onward, a builder-created manifest is inventory, not approval.
Production promotion requires GitHub's signed provenance for that exact manifest,
from this repository's `.github/workflows/native-release.yml`, the exact source
commit and annotated tag, and a GitHub-hosted runner. GitHub CLI with the
`--source-digest`, `--signer-digest`, `--source-ref` and
`--deny-self-hosted-runners` verification flags is required on the operator host.
Use a protected CLI installation and operator environment, not builder tools.
Missing proof, an unavailable verifier or GitHub, and any identity mismatch stop
before activation. There is no unsigned or caller-supplied checksum fallback.

Pushing a new annotated `v2` tag runs the pinned clean ARM64 build on a disposable
GitHub-hosted runner with read-only repository permissions. A separate fresh job
attests its immutable Actions artifact without executing its contents. Neither
the persistent host builder nor pull-request workflows receive signing authority.
After both jobs succeed, retain the `attested-native-release` artifact's archive,
manifest and Sigstore bundle on the same immutable GitHub release. Do not rebuild
locally and substitute those bytes, sign a host candidate, or move the tag.

An operator can download that artifact by its reviewed successful run ID using
`gh run download --repo instruction-material/classes.jacobdanderson.net --name attested-native-release --dir /path/to/download RUN_ID`.
Verify the downloaded archive with `gh attestation verify`, pinning the canonical
repository, signer workflow, exact tag and both source/signer commits using the
same policy as `scripts/verify-native-provenance.mjs`. Extract it as the
unprivileged build user into the exact managed candidate path, never as root.
The root promoter independently verifies the protected snapshot against the
attested manifest; archive extraction or local rehashing is not approval.

The unprivileged preparation stage verifies the canonical origin and already-
fetched refs, archives the tagged commit into a temporary directory, runs the
pinned clean install, lint, type checks, frontend and backend tests, build, and
audit, then installs only production API dependencies in the candidate. This is
the shared CI producer and remains useful for local validation as the dedicated
build user. A locally prepared result has no independent CI proof and is not a
deployable substitute for the published archive:

```bash
sudo -u classes-build ./scripts/prepare-native-release.sh \
  --source /path/to/clean/classes.example.com \
  --tag v2.7.207
```

Promote the extracted CI artifact path from an independently fetched,
root-owned clean checkout of the same tag. Every ancestor and source entry must
be protected from group/other writes. The promoter, its Python snapshot helper,
Git metadata, verifiers, and comparison inputs must never be supplied by the
build account. Do not turn the build account's checkout into trusted source by
changing its ownership: retained writable descriptors would survive that change.
Run a frozen copy of these reviewed helpers; do not edit a running wrapper.

```bash
sudo ./scripts/promote-native-release.sh \
  --source /path/to/clean/classes.example.com \
  --candidate /srv/classes.example.com/releases/.candidates/v2.8.4-<full-revision>
```

Promotion first moves the candidate into a root-private quarantine, then copies
regular files through descriptor-relative, no-follow operations into fresh
root-owned inodes. Symlinks, hardlinks, and special files are rejected. This
isolated snapshot, not the build-user tree, passes source provenance, complete
manifest checks, independently signed CI provenance, and tagged-source comparisons
before installation. Manifest
hashes are never regenerated to accept drift. Only the verified snapshot is
renamed into the immutable release and reverified. Original build trees and
failed snapshots remain under root-private `releases/.quarantine-*` directories
for explicit operator review and cleanup; allow temporary duplicate disk usage.
The authenticated snapshot is the authority for all later installation operations.
The final placement's manifest digest must equal the independently authenticated
snapshot's digest, and its full payload is checked again before activation. This
does not repeat the network lookup after final placement, so a transient registry
failure cannot strand an otherwise authenticated release at its immutable path.
The already-serving, root-owned immutable rollback release retains its own
manifest and revision, including releases predating this provenance contract.
Rollback rechecks its inventory, but never requires the new candidate's proof or
GitHub availability. This exception applies only to the retained current release,
not to a newly supplied unsigned candidate. Do not fabricate retroactive CI proof
or silently replace the retained runtime during this transition.
Promotion then backs up the installed snippets and unit, tests Nginx, proves all
three reviewed snippets are active exactly once in Nginx's loaded
configuration, switches `current` atomically, restarts the one API process,
reloads Nginx, waits for database readiness, and probes the TLS vhost through
loopback with its real host name. The smoke gate requires:

- the exact HTTP-to-HTTPS redirect, including its query string;
- the exact generated homepage and a nested clean course route without an
  internal-index redirect loop;
- Mongo-backed API readiness;
- one strict COOP/CORP/CSP/frame header set;
- canonical redirects for legacy route HTML and direct route `index.html`
  requests, while internal index resolution keeps `/` and clean nested routes
  at `200` without redirect loops;
- the unlisted `/coding_standard` route redirect to the canonical document on
  `static.classes.jacobdanderson.net`;
- byte-for-byte branded 404 responses for direct `/404.html`, retired raw
  route HTML, unknown pages, dotfiles, Vite metadata, and both internal/public
  release-metadata guesses; and
- the API's small no-store JSON 404 response for `/api`, `/api/release`, and a
  synthetic undeclared API path.

Any activation failure restores the prior symlink, snippets, unit, API, and
Nginx configuration. A rollback is reported as successful only after the prior
API reaches its bounded loopback readiness gate and the same TLS smoke contract
passes against that release's manifest revision and exact frontend files. This
includes the exact homepage, branded page 404, database-backed JSON readiness,
and no-store JSON API 404. If restoration or its runtime verification fails,
activation and rollback diagnostics remain separate in the preserved
`/var/tmp/classes-native-promote.*` directory for operator review. The failed
immutable release remains for diagnosis and no release directory is
automatically deleted. After a successful promotion, perform independent
public A and AAAA HTTPS probes; same-network hairpin failure is not evidence
that public IPv6 is down.

## Recovery

If automatic rollback reports that its own recovery failed, stop and inspect
the preserved files under `/var/tmp/classes-native-promote.*` before making a
manual change. Resolve `current` only to a root-owned directory under the
managed `releases` path, restore the matching source-controlled snippets and
unit, run `nginx -t`, restart `classes-api.service`, reload Nginx, and repeat
the same readiness and 404 checks. Never repair a deployment by enabling a
homepage fallback for unknown paths or by publishing the internal manifest.
