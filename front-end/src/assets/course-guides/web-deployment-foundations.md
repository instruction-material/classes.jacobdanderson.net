# Hosting and deployment

A deployment makes a particular saved version available through a running host.
There are three separate things to identify: source files, the artifact made
from those files, and the process or static host serving that artifact. Editing
source does not update a retained artifact. Building an artifact does not switch
a running host to it. A successful switch still needs acceptance checks.

## Two processes and two origins

This lab has a static front end at `http://127.0.0.1:4173` and an API at
`http://127.0.0.1:4001`. The browser requests `index.html`, `env.js`, and `main.js`
from the front end. `main.js` then reads the public API base URL from
`window.__APP_CONFIG__` and requests `/api/status` from the API. Stopping the API
does not stop the static server: the page can load while reporting an API error.

An origin is a scheme, host and port. The two addresses above are different
origins because their ports differ. So are `localhost` and `127.0.0.1`. For a
browser to expose this cross-origin API response to the page, the API's
`Access-Control-Allow-Origin` response must permit the page's actual origin.
The lab selects this value with `FRONTEND_ORIGIN`. It is the page's origin,
not the API's own address. A native request can receive status 200 while browser
JavaScript is refused access to the same response. CORS does not authenticate
an API caller or prevent non-browser clients from making requests.

`frontend/env.js` is sent to every visitor. Its API address is public
configuration. Passwords, database credentials and mail credentials belong only
in the server's private configuration. Changing a server environment variable
affects a newly started process; it does not rewrite a JavaScript file already
copied into a front-end artifact. Configuration changes must follow the boundary
where that configuration is read.

## Static files and application runtimes

A static host returns saved bytes. A browser executes the downloaded JavaScript.
An application host also runs a server program that receives requests and may
access private settings or a database. The lab's front-end `serve.mjs` is a small
static-file server; the API is an independent Node.js program using Express.
Copying the front-end files does not install Express or copy its dependency tree.
Run the API from its complete maintained workspace and root lockfile.

The static server exposes only its named public routes. Server source, package
files, private environment files and the artifact manifest are not routes.
A missing public path returns 404. A successful response from `/` therefore says
nothing about a missing API route or a wrong URL in `env.js`.

## DNS, TLS and a reverse proxy

For a public host, DNS connects a name to a destination. An A record supplies an
IPv4 address; an AAAA record supplies an IPv6 address. A CNAME makes one DNS name
an alias of another. DNS does not choose an HTTP route, install the application,
start a service, or make a certificate valid. Cached answers can remain until
their lifetimes expire, so one successful lookup does not establish that every
client has switched.

HTTPS adds a TLS connection in which the client checks a certificate for the
requested host and encrypts traffic to the TLS endpoint. A reverse proxy can be
that endpoint: it receives public HTTPS requests, serves static files, and
forwards selected API requests to a private listener. For example, a plan may
serve `https://app.example.test/` and forward `/api/status` to a loopback API.
Those page and API URLs share an origin when scheme, host and port agree.
Another plan may use a separate API host and require CORS. Record the exact
route mapping; adding or removing a path prefix can change the requested route.
The `.test` name here is a diagram, not an available deployment.

When a proxy supplies forwarded client or protocol headers, the application
must trust only the known proxy path. Arbitrary clients can send their own
forwarded headers. Exposing a loopback-only API through a proxy is different
from rebinding the API to every interface. This lab demonstrates the process
and configuration boundaries locally; it does not configure a proxy, certificate
or public DNS. Any optional publishing uses a learner-owned environment and
its documented access controls.
