# Browser, Server and Data Boundaries

Continue the portfolio from the setup unit. Trace the page that exists before designing a feature that needs an API. This separates browser code from server code without repeating JavaScript syntax exercises.

## Follow a page load

An origin combines a scheme, host and port. For `http://127.0.0.1:5173`, those parts are `http`, `127.0.0.1` and `5173`. A request contains a method and a path; a response contains a status, headers and a body. A successful HTML response supplies page text. The browser then follows the stylesheet and module-script references to request additional resources.

For this project, the browser receives HTML, CSS and JavaScript files from Vite. The script executes in the browser, where `document` represents that tab's DOM. Vite's development server may add development-tool requests and a hot-reload connection. Those belong to development tooling, not a portfolio data API.

| Operation | Where it happens | What remains after a fresh load |
| --- | --- | --- |
| Edit and save a project card in `index.html` | Source file on disk | The source change is served again. |
| Change a card's text in the Elements panel | This tab's DOM | The temporary edit disappears. |
| Append checklist entries in `main.js` | Browser JavaScript | The script creates a new list from its source data. |
| Read the current year | Browser JavaScript and the local clock | The script calculates it again. |
| Install dependencies or build | Node/npm on the development computer | Dependency files or build output remain on disk. |

There is no saved-note service, server-side validation or database in this portfolio. A successful page load proves none of those capabilities. The public HTML, CSS and JavaScript can be read by a visitor, so passwords, SMTP credentials and database connection strings do not belong in them.

## Core project: a request and ownership map

1. Run the saved starter with the setup unit's command. Open the Network panel, clear its entries, and reload. Record the document, stylesheet and application script paths, statuses and initiators from this run. Distinguish additional Vite requests by their purpose.
2. Follow `index.html` to its `main.js` script tag, then locate the selectors for `#deployment-list` and `#year`. Explain the path from a source string to an `li` in the DOM. Identify which values come from source and which come from the clock.
3. Edit a card in the Elements panel and reload. Then make a different saved edit to `index.html` and reload. Compare the two results and identify the owner and lifetime of each change.
4. Draw the observed path as browser -> local development server -> files -> browser. Attach the actual recorded requests to the relevant arrows. Mark the DOM and clock inside the browser. Do not add an observed database or application API to this map.
5. Add a separate design for a future notes feature: browser form -> `POST /api/notes` -> server validation -> database write -> response -> browser feedback. Label every part of this second map as proposed. Define a valid note, an invalid note and a failed storage operation before writing a server.

For the proposed feature, a browser can give immediate feedback, but a server must validate requests even when a caller bypasses the page. Storage owns persisted records; the DOM owns only the current view. A successful create response can identify the created record, an invalid payload can receive status 400, and an unavailable service needs an error path. The later API and persistence units implement these boundaries. This unit's portfolio does not.

## Application check

Explain why adding `fetch("/api/notes")` to this portfolio does not create an API. It sends a request to the current origin; a matching server handler still has to exist. A development server may return a fallback HTML document for an unknown path. Check response status, content type and body before treating a response as JSON. A status of 200 alone does not establish an application contract.

## Choice: compare another origin

Compare `http://localhost:5173`, `http://127.0.0.1:5173` and `http://127.0.0.1:4173` as origin strings. The host spelling or port differs, even when services run on the same machine. Explain which URL a relative `./styles.css` request uses and why a later separate-origin API needs an explicit browser/server agreement.

## Challenge: a failure at each boundary

For the proposed notes feature, classify an empty title, a malformed request body, an unavailable database, a lost response and a browser rendering error. Name the layer that can detect each failure and the feedback that layer can actually provide. Explain why retrying a request after a lost response can create duplicates unless the application defines a duplicate-handling contract. Keep this as a design analysis, not a claim that the portfolio implements those cases.

## Reference review

The reference's `#domain-status` text is assigned by `main.js`; it is not a DNS lookup or a hosting health check. Its checklist is an array of source strings. A useful comparison identifies these implementation facts separately from a future release plan. The [request-map case](/course-assets/web-development-foundations/web-development-foundations-practice-pack.md#course-path-map-case) supplies another feature for independent mapping.

## Configuration and domain names

Environment variables are configuration boundaries. A Node process can read its own environment; browser code receives only values deliberately exposed to it, often when a front-end bundle is built. Public labels and API origins can be browser configuration, while a password or mail credential belongs on a server. Changing a source environment value does not rewrite an already built bundle.

DNS and domain routing are the networking layer that maps a hostname to an address. A port selects a service at that address; an HTTP path selects a resource at the service. A working domain lookup does not establish that a particular API handler, database or TLS configuration works. The local portfolio needs none of those external services to demonstrate its file and request behavior.
