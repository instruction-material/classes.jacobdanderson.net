# Reviewed Code IDE media

`code-ide-assets-6ab65a71.zip` contains the exact reviewed archive already pinned
by the Code IDE staging script:

- Original source: `https://static.classes.jacobdanderson.net/assets.zip`
- Size: 14,676,489 bytes
- SHA-256: `6ab65a710032ca71cf957bfd56f8b60579d66c94395bbc34fc433be4bb0f92a1`

Keeping these bytes in the source checkout makes a fresh default build independent
of the availability of the media host. The staging script verifies both length
and digest before extracting the same allowed media paths into the existing
public directories. The ZIP itself stays outside the public directory.

Explicit URL overrides and refresh requests retain their existing behavior.
When a default-source refresh fails and there is no verified cache, the reviewed
bundled archive supplies the same bytes. An invalid bundled archive fails its
integrity check; it is never treated as a successful empty media pack.

Any future media revision needs a separately reviewed archive and an intentional
update to the pinned filename, size and SHA-256. Preserve the media's existing
attribution and usage terms; inclusion here does not create a new license.
