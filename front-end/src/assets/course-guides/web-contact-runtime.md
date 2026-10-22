# Node.js processes and the browser boundary

The portfolio and notification exercises execute browser JavaScript. A contact
service needs a second program that listens for requests independently of a
page. Node.js executes that server program. Both programs use JavaScript, but
the browser owns the document, form controls and `fetch`; Node owns the HTTP
listener, server environment and transport. A browser cannot create an Express
route by calling its URL.

## Start from the maintained source

Use Node.js 24. In a new working directory, obtain the complete repository and
select this exercise's source revision:

```sh
git clone https://github.com/instruction-material/Web-Development-Foundations.git
cd Web-Development-Foundations
git switch --detach aed8ef2fcd7488c25c0b977b2099640e7431c55a
node --version
npm --version
npm ci
npm run start --workspace WDF3-Booking-Contact-App/starter
```

Detached checkout selects the recorded source without changing a branch.
Keep a copy of independent edits or create a local working branch before
changing revisions. Run installation from the repository root, where its
workspace manifest and lockfile describe the complete dependency graph.

The role's `package.json` declares ES modules and maps `start` to
`node src/server.js`. That file imports `createContactApp` and starts an HTTP
server on `127.0.0.1`, port 3002 by default. Read the terminal's `ready` event
before opening `http://127.0.0.1:3002`. A process still starting, an occupied
port and an HTTP error response are different observations.

`src/server.js` chooses configuration from `process.env`. With a POSIX shell,
`PORT=3003 npm run start --workspace WDF3-Booking-Contact-App/starter` selects
another local port for that command. In PowerShell, set `$env:PORT = "3003"`
first. `.env.example` lists options; this program does not load it automatically.
Use the selected port in the browser. Stop only the exercise's owned terminal
with Ctrl+C. Do not terminate another process to acquire a port.

## Follow the files across the boundary

The server serves `public/index.html`, which loads `public/styles.css` and
`public/app.js`. The browser script serializes four named controls into JSON
and posts to `/api/contact` on the page's origin. `src/app.js` parses and checks
the request, then calls the pure validator in `src/validation.js`. Only an
accepted value reaches the simulated transport in `src/lib/mailer.js`.
Its JSON-only Nodemailer transport sends no email. The browser receives a
status and safe response body rather than direct access to Node modules.

The supplied starter deliberately returns `501 not_implemented` until its
validator is completed. An empty form may be blocked by native browser
constraints before a request exists. Use fictional valid-looking input to
observe the actual starter response. Record the process command, selected
port, request and status separately from a prediction.

## Source, saved work and a running process

The site editor can import, save, reopen and export the role's nested text
files. Its Run instructions describe native execution; it does not execute
this Node service. A role ZIP includes its source and README, but lacks the
repository root lockfile. Copy edited `src/` and `public/` files into the
matching complete-checkout role, retaining its role/root manifests and root
lockfile. Run `npm ci` from that root and start the matching role.

Saving browser source does not restart a running Node process. The ordinary
`start` command does not watch files. Stop and restart this service after a
server change; reload the page for browser code changes. A restart clears its
in-memory request budget and stores no contact messages.

**Practice:** Draw the document request and later contact POST as separate
paths. Label each file, runtime and response. Stop the service, observe a
network failure, restart it and explain which evidence proves recovery.

Reference: [Node.js HTTP](https://nodejs.org/docs/latest-v24.x/api/http.html).
