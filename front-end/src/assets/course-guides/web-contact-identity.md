# Identity, permission and continuing requests

The local contact lab has no login, account or saved message store. Its
`replyTo` field is submitted text. An email-shaped string does not establish
that the caller owns that address. Its accepted response proves validation
and simulated delivery only.

Authentication establishes a caller's identity using a trusted process.
Authorization decides whether that identity may perform this action on this
resource. Consider a later fictional message store: an authenticated reader
might view their own message, while another reader must be denied. Hiding a
button cannot enforce that rule; a caller can send the request directly.
The server must check the caller and ownership before returning or changing
protected data.

## Sessions and bearer credentials

HTTP requests do not inherently share login state. With a server session,
successful login creates a server-held record and returns an unpredictable
session identifier, commonly in a cookie. Later requests present that
identifier; the server checks its current record, expiry and permissions.
Logout invalidates the session server-side as well as clearing the browser
cookie. Rotating the identifier after login helps prevent session fixation.

A bearer credential grants access to whoever possesses it. A client can send
one in an `Authorization: Bearer ...` header. Such credentials can be opaque
identifiers checked against server state or signed tokens with claims.
Decoding a signed token is not signature verification. A server must verify
the intended issuer, audience, expiry and other required claims under its
trusted configuration. Signing does not make claims confidential. Expiration
and revocation need explicit design; deleting one browser copy does not
necessarily invalidate a stolen credential.

Cookie versus header describes how a credential travels. Session versus
self-contained token describes how the server interprets it. These are not
equivalent pairs, and neither automatically grants authorization.

## Browser consequences

Cookies are attached according to browser scope and request rules. Production
session cookies need appropriate `Secure`, `HttpOnly` and `SameSite` settings.
`HttpOnly` limits script access to the cookie but does not prevent injected
script from making requests as the current user. Cookie-authenticated state
changes also need a considered cross-site request-forgery defense. TLS protects
the connection; it does not decide which user may access a record.

Treat a credential as a secret wherever it is carried. Do not put it in a URL,
course source, exported ZIP or diagnostic log. Public browser configuration is
visible to its user. Cross-origin response permissions do not authenticate a
caller and do not replace server-side permission checks.

## Apply the distinction without adding a login feature

Draw a hypothetical `GET /api/messages/:id` request from fictional Reader A.
Mark credential lookup, identity, record lookup and ownership decision. Draw
the same request from Reader B using A's record identifier. Explain where the
server denies it even if B edits a browser button or URL. Then consider an
expired credential and a logout: identify the server state or token rule that
makes later requests fail.

Return to the supplied contact files and locate the actual checks. There is
validation and a process-wide attempt limit, but no credential lookup or
ownership decision. Explain why adding an `owner` field supplied by a browser
would not establish ownership. Keep the running core lab local and fictional;
implementing an account service is a separate project with its own contract.

References: [HTTP cookies](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Cookies),
[OWASP session management](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html).
