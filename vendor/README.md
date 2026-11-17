# Bounded braces fork

`braces/` is an MIT-licensed copy of braces 3.0.3 with local nesting guards for
[GHSA-vfj7-8cjw-p6xm](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm).
On 2026-10-03, the npm upstream package had no fixed release. The alternative
Clever Canyon fork retained the same unbounded walkers and was not a fix.

The original source was verified against the registry tarball:
`https://registry.npmjs.org/braces/-/braces-3.0.3.tgz`

Original SHA-512 SRI:
`sha512-yQbXgO/OSZVD2IsiLlro+7Hf6Q18EJrKSEsdoMzKePKXct3gvD8oLcOQdIzGupr5Fj+EDe8gO/lxc1BzfMpxvA==`.
The upstream license and attribution are retained.

Local changes:

- The private package identifies itself as `@classes/braces@3.0.3-classes.1`,
  not as a nonexistent fixed upstream version.
- Parser pushes for both braces and parentheses are bounded before internal
  stringify calls. Recursive walkers enforce a hard traversal-depth limit of
  128, including supplied or subsequently modified ASTs. Parsed patterns allow
  at most 127 nested groups, reserving a level for their leaf nodes.
- Expansion's parent walks and recursive array helpers use the same bound.
  Excessive depth and cycles fail explicitly with `SyntaxError`; options cannot
  disable the bound. Normal AST backreferences and shared children remain valid.
- No upstream matching, range, escaping, or return-value behavior was changed.
  Upstream package development scripts/dependencies are omitted.

The npm override uses the committed tarball so clean installs need no patch
scripts. Root lock provenance allows only this exact identity, location, incoming
dependency spec, and reviewed SHA-512. All other file/git/alias packages retain
their previous rejection policy. Tests compare every installed file with the
reviewable source and exercise the actual micromatch/fast-glob consumers.

Regenerate with the pinned npm toolchain:

```sh
npm pack ./vendor/braces --pack-destination vendor --ignore-scripts
npm run test:braces-security
npm run test:lock-provenance
```

Any source change requires a new fork version/archive, explicit integrity
review, synchronized locks, a root clean install, full and production audits,
and the security/compatibility tests. Replace this fork with an upstream fixed
release when available, retaining those regressions.

This dependency is used for local/build-time glob patterns. No student-input
backend path was found. Removing the unused backend nodemon dependency removes
the standalone backend's entire braces chain. This patch addresses nesting
exhaustion; it does not promise unlimited safe brace expansion of arbitrary
untrusted patterns.

## Bounded repeated-extglob picomatch forks

The private `picomatch-v4/` and `picomatch-v2/` directories preserve the installed
API majors, upstream 4.0.7 and 2.3.2. Their MIT licenses and attribution remain.
On 2026-11-17 the registry's latest version was 4.0.7, with no published fix for
[GHSA-fc5q-39xc-vjpf](https://github.com/advisories/GHSA-fc5q-39xc-vjpf).

Original registry tarballs and SHA-512 integrities:

- `https://registry.npmjs.org/picomatch/-/picomatch-4.0.7.tgz`:
  `sha512-qcJu88Q2IWqJsDD529JKMdwGm/dvInW4HvQnRwiH9JtihJvzGOscDtHE3x1pBKeUOTysQ8kVmLnJ2kJu7yhcGA==`
- `https://registry.npmjs.org/picomatch/-/picomatch-2.3.2.tgz`:
  `sha512-V7+vQEJ06Z+c5tSye8S+nHUfI51xoXIXjHQ99cQtKUkQqqO1kO/KCJUfZXuB47h/YBlDhah2H3hdUGXn8ie0oA==`

Both parsers reject an unbounded wildcard inside a repeated `+(...)` or
`*(...)` body before constructing a regular expression. Existing upstream safe
character-class flattening remains available. Escaped stars, literal quotes and
character classes, finite repeats, and ordinary build globs retain their
behavior. Hazardous patterns raise `SyntaxError`; `maxExtglobRecursion: false`
cannot disable this guard. This is a compatibility restriction on unsafe
repeated-wildcard patterns; arbitrary user-supplied regular expressions can
have other resource limits.

The forks identify themselves as `@classes/picomatch` with `-classes.1` versions.
Committed archives install without mutation scripts. Root lock provenance admits
only the reviewed major, location, incoming file edge and archive SHA-512.
The standalone backend uses the same reviewed v4 archive. Replace these forks
with compatible fixed upstream releases, retaining the regression tests.

Regenerate with the pinned npm toolchain:

```sh
npm pack ./vendor/picomatch-v4 --pack-destination vendor --ignore-scripts
npm pack ./vendor/picomatch-v2 --pack-destination vendor --ignore-scripts
npm run test:picomatch-security
npm run test:lock-provenance
```

A source change requires new fork versions and archives, reviewed provenance
constants, synchronized locks, clean installs, full and production audits,
application checks, and security/compatibility tests.
