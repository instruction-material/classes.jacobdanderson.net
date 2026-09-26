#!/usr/bin/env bash
set -euo pipefail

if [[ $# -ne 2 ]]; then
	printf '%s\n' "Usage: $0 SOURCE TAG" >&2
	exit 2
fi

classes_source_dir="$(realpath "$1")"
classes_tag="$2"
[[ "$classes_tag" =~ ^v([0-9]+)\.([0-9]+)\.([0-9]+)(-[0-9a-z.-]+)?$ ]] \
	|| { printf '%s\n' "Release tag must be a lowercase semantic v-tag." >&2; exit 1; }
[[ "$(git -C "$classes_source_dir" rev-parse --is-inside-work-tree 2>/dev/null || true)" == "true" ]] \
	|| { printf '%s\n' "Native source must be a Git checkout." >&2; exit 1; }
[[ -z "$(git -C "$classes_source_dir" status --porcelain --untracked-files=normal)" ]] \
	|| { printf '%s\n' "Native source checkout must be clean." >&2; exit 1; }

classes_revision="$(git -C "$classes_source_dir" rev-parse --verify 'HEAD^{commit}')"
classes_origin_url="$(git -C "$classes_source_dir" remote get-url origin 2>/dev/null || true)"
classes_canonical_origin_pattern='^(git@github\.com:|ssh://git@github\.com/|https://github\.com/)instruction-material/classes\.jacobdanderson\.net([.]git)?$'
if [[ ! "$classes_origin_url" =~ $classes_canonical_origin_pattern ]]; then
	printf 'Native source origin is not instruction-material/classes.jacobdanderson.net: %s\n' \
		"${classes_origin_url:-missing}" >&2
	exit 1
fi

classes_origin_main="$(
	git -C "$classes_source_dir" rev-parse --verify 'refs/remotes/origin/main^{commit}' 2>/dev/null || true
)"
[[ -n "$classes_origin_main" ]] \
	|| { printf '%s\n' "Native source is missing the fetched origin/main revision." >&2; exit 1; }
[[ "$classes_revision" == "$classes_origin_main" ]] \
	|| { printf '%s\n' "Native source HEAD is not the exact fetched origin/main revision." >&2; exit 1; }
[[ "$(git -C "$classes_source_dir" cat-file -t "refs/tags/$classes_tag" 2>/dev/null || true)" == "tag" ]] \
	|| { printf '%s\n' "Native release tag must exist as an annotated tag." >&2; exit 1; }
[[ "$(git -C "$classes_source_dir" rev-parse --verify "refs/tags/$classes_tag^{commit}")" == "$classes_revision" ]] \
	|| { printf '%s\n' "Annotated native release tag does not resolve to source HEAD." >&2; exit 1; }

printf 'Verified %s at exact canonical origin/main revision %s.\n' \
	"$classes_tag" \
	"$classes_revision"
