# Native production deployment

The canonical custom-host deployment serves `front-end/dist` directly from
Nginx and runs one loopback-only compiled API under systemd. It does not use
Docker. The release gate never changes DNS, A or AAAA records, TLS material,
MongoDB data, credentials, or backups.

## Authority and layout

Only deploy a clean checkout whose `origin` is the canonical
`instruction-material/classes.jacobdanderson.net` repository. Fetch `origin/main`
and tags before beginning; neither native script fetches or mutates a remote.
The checkout's `HEAD`, fetched `origin/main`, and exact annotated `v2.x` tag
must resolve to the same commit. The public version is the tag; the root package
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
configuration. Unexpected structural entries and every payload symlink are
rejected, so recursively changing release ownership cannot pull unchecked
content into the trusted boundary. The manifest is operational metadata, not a
public endpoint.
`/release.json` and `/api/release` intentionally remain 404.

## One-time server setup

Install system Node 24.18.0, npm 12.0.1, Git, Nginx, `curl`, and the existing
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

## Prepare and promote

The unprivileged preparation stage verifies the canonical origin and already-
fetched refs, archives the tagged commit into a temporary directory, runs the
pinned clean install, lint, type checks, frontend and backend tests, build, and
audit, then installs only production API dependencies in the candidate. Run it
as the dedicated build user:

```bash
sudo -u classes-build ./scripts/prepare-native-release.sh \
  --source /path/to/clean/classes.example.com \
  --tag v2.7.207
```

Promote the exact path printed by that command from the same clean tagged
checkout:

```bash
sudo ./scripts/promote-native-release.sh \
  --source /path/to/clean/classes.example.com \
  --candidate /srv/classes.example.com/releases/.candidates/v2.7.207-<full-revision>
```

Promotion verifies source provenance and every manifest checksum, makes the
release root-owned and non-writable, verifies it again after the ownership
boundary, backs up the installed snippets and unit, tests Nginx, proves all
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
