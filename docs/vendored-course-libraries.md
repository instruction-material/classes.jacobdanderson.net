# Vendored course libraries

Course packs retain the D3 API version used by each original project. The legacy 5.16.0, 6.1.1 and 6.2.0 bundles carry the maintainer's two-expression fix for [GHSA-36jr-mh4h-2g58](https://github.com/advisories/GHSA-36jr-mh4h-2g58). The original version header remains first; the next line identifies the local security backport and [exact upstream commit](https://github.com/d3/d3-color/commit/61a184bd3748db5142c316238c03547865787a94). D3 7.9.0 packs retain their original upstream bytes.

The manifest in scripts/vendored-d3-security.json pins original and patched hashes, lengths, the two replacement fragments and every affected asset. The verifier reverses only the documented expressions and notice, then requires the exact original upstream hash. All other library bytes and version-specific APIs remain intact.

Run node scripts/verify-vendored-d3.mjs and node --test scripts/check-vendored-d3-regressions.mjs. Regression checks compare valid color behavior and demonstrate the old parser's timeout alongside the patched parser's bounded rejection of the same input. The focused vendored-d3 workflow additionally checks both locked installations, all four dependency audits, workspace lint/types/builds and JavaScript import/export tests.

Affected project versions advance while course identities and original URL aliases remain stable. New imports use a new project key; earlier saved attempts remain available. Existing upstream exports and published release artifacts retain their recorded identity.
