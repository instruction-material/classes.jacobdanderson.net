# Google and Apple Login

The login dialog supports Google and Sign in with Apple for existing Classes
accounts. A provider button appears only when all of that provider's server
credentials are configured.

## Account and Security Behavior

- The provider must return a verified email that already belongs to an Admin,
  Tutor, or User. The first link uses the existing role priority:
  Admin, Tutor, then User.
- After the first successful match, the provider's stable subject identifier is
  linked to that account. A later provider email change does not create or
  select a different account.
- Apple private-relay addresses work only when the relay address is already the
  Classes account email at the first login.
- OAuth state, nonce, PKCE, a one-time database attempt, and a short-lived
  browser-binding cookie protect the callback. Provider access, refresh, and ID
  tokens are never stored.
- Promotion and demotion move provider links inside the same MongoDB
  transaction as the role change.

## Google Setup

1. In Google Cloud, create an OAuth 2.0 Client ID of type **Web application**.
2. Add this exact authorized redirect URI:
   `https://example.com/api/accounts/oauth/google/callback`.
3. Set `GOOGLE_OAUTH_CLIENT_ID` and `GOOGLE_OAUTH_CLIENT_SECRET` in the
   back-end production environment.

## Apple Setup

1. In Apple Developer, enable Sign in with Apple on a primary App ID.
2. Create a Services ID for the website and configure
   `example.com` as its domain.
3. Register this exact return URL:
   `https://example.com/api/accounts/oauth/apple/callback`.
4. Create a Sign in with Apple key and retain the downloaded `.p8` file.
5. Set `APPLE_OAUTH_CLIENT_ID` to the Services ID, then configure
   `APPLE_OAUTH_TEAM_ID`, `APPLE_OAUTH_KEY_ID`, and
   `APPLE_OAUTH_PRIVATE_KEY_BASE64`.

Generate the base64 value without changing the key file:

```sh
base64 < AuthKey_KEYID.p8 | tr -d '\n'
```

Set `AUTH_ORIGIN=https://example.com`, restart the API, and
confirm `/api/accounts/oauth/providers` reports only the providers intended for
use. Never commit provider credentials or the `.p8` key.
