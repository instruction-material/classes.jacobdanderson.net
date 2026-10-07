# Compact workspaces, October 7, 2026

## Everyday interface

- `/admin` opens session notes. The admin row contains Session notes, People,
  and IDE reports. The former roster URL redirects to People; no spreadsheet
  is embedded. Administrators do not see the Zoom link.
- Session-note recovery remains administrator-only at
  `/admin/session-note-recovery`, without a navigation link. Routine mail pages
  no longer fetch or display the global evidence-review status. The durable
  send, identity, uncertainty, and recovery safeguards remain unchanged.
- The IDE starts with its explorer collapsed. Opened rows are compact; project
  rename, diagnostics, and Download ZIP live in settings. Course-associated
  projects show their association beside the active file. Code/Scratch selection
  sits beside the workspace title. Save/import failures remain visible.
- Graphing fits the available viewport. Tools occupy a horizontal strip and
  settings sit beside coordinates. The redundant expansion and saved-state
  notices are removed. Wheel and drag isolation remain in place.
- People settings open per person, with rare or destructive actions folded
  into Advanced Settings. Course and learner selectors are compact and
  searchable lessons are immediately available.

## Account behavior

- Name editing uses the existing authorized profile update.
- `POST /api/accounts/changeEmail/:ID` now requests verification and returns
  202 without changing the active email. The account owner must provide their
  current password. A 30-minute, single-use verification link goes only to the
  proposed new address. This intentionally tightens the former immediate-change
  behavior; consumers must not optimistically replace the active email.
- `/verify-email` reads its token from the URL fragment, removes the fragment
  from browser history, and requires explicit confirmation while signed in to
  the requesting account. `POST /api/accounts/email-change/confirm` atomically
  checks the token, original email, session version, and expiration before
  changing the email. A token hash, never the raw token, is stored; the pending
  object is excluded from normal queries and account serialization.
- Successful email confirmation advances the account session version, retains
  the confirming browser, and invalidates other sessions. Email conflicts are
  checked again before confirmation. New requests replace older pending links.
- `POST /api/accounts/signout-all` advances the session version and clears the
  current cookie-backed session too. The red button is under inline Advanced
  Settings. The existing other-session revocation endpoint remains compatible.
- All writes retain account authentication, rate limiting, and the existing
  request-origin protections. Read-only evidence credentials gain no access.

## Rollout and rollback

No dependency, runtime, secret, database topology, or historical-record migration
is required. Only accounts requesting a change gain the private `emailChange`
field. Keep `PASSWORD_RESET_ORIGIN` set to the deployment's HTTPS origin and
retain the existing transactional-mail configuration. Do not test by sending
production mail or changing real accounts.

Deploy through the established exact-tag native artifact workflow. Rollback to
the previous immutable release restores its prior UI and account behavior;
never decrement session versions. Pending verification links require this
release and should be discarded or allowed to expire after rollback. No student
notes, delivery evidence, project content, or course progress is migrated.

Tests use synthetic accounts, intercepted browser APIs, and mocked mail. Local
validation is not proof of production activation. Forks retain their product
boundaries: the instructor overlay uses neutral origins; Julio's classroom
receives only compatible course/IDE cleanup, not business or email workflows.
