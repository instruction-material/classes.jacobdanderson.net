#!/usr/bin/env bash
set -euo pipefail

umask 022

classes_source_dir="$(pwd -P)"
classes_release_root="/srv/classes.example.com"
classes_tag=""
classes_build_root=""

usage() {
	printf '%s\n' \
		"Usage: $0 --tag vX.Y.Z [--source DIR] [--release-root DIR]"
}

while (( $# > 0 )); do
	case "$1" in
		--source) classes_source_dir="${2:-}"; shift 2 ;;
		--release-root) classes_release_root="${2:-}"; shift 2 ;;
		--tag) classes_tag="${2:-}"; shift 2 ;;
		--help|-h) usage; exit 0 ;;
		*) usage >&2; exit 2 ;;
	esac
done

cleanup() {
	if [[ -n "$classes_build_root" && -n "${classes_candidate_root:-}" \
		&& "$classes_build_root" == "$classes_candidate_root/.prepare."* \
		&& -d "$classes_build_root" ]]; then
		rm -rf -- "$classes_build_root"
	fi
}
trap cleanup EXIT

[[ ${EUID:-$(id -u)} -ne 0 ]] \
	|| { printf '%s\n' "Prepare releases as the unprivileged classes-build user, not root." >&2; exit 1; }
[[ "$classes_release_root" == /* && "$classes_release_root" != "/" && "$classes_release_root" != "/srv" ]] \
	|| { printf '%s\n' "--release-root must be a narrow absolute directory." >&2; exit 1; }
[[ "$classes_tag" =~ ^v([0-9]+)\.([0-9]+)\.([0-9]+)(-[0-9a-z.-]+)?$ ]] \
	|| { printf '%s\n' "--tag must be a lowercase semantic v-tag." >&2; exit 1; }
for classes_command in chmod cp env git install mkdir mktemp mv node npm realpath rm tar; do
	command -v "$classes_command" >/dev/null 2>&1 \
		|| { printf '%s\n' "Missing required command: $classes_command" >&2; exit 1; }
done

classes_source_dir="$(realpath "$classes_source_dir")"
classes_release_root="$(realpath "$classes_release_root")"
classes_candidate_root="$classes_release_root/releases/.candidates"
[[ -d "$classes_candidate_root" && ! -L "$classes_candidate_root" && -w "$classes_candidate_root" ]] \
	|| { printf '%s\n' "The real, writable .candidates directory is missing." >&2; exit 1; }
[[ "$(realpath "$classes_candidate_root")" == "$classes_candidate_root" ]] \
	|| { printf '%s\n' "The candidate directory must not redirect through a symlink." >&2; exit 1; }
"$classes_source_dir/scripts/verify-native-source.sh" \
	"$classes_source_dir" \
	"$classes_tag"
classes_revision="$(git -C "$classes_source_dir" rev-parse --verify 'HEAD^{commit}')"
[[ "$classes_revision" =~ ^[0-9a-f]{40}$ ]] \
	|| { printf '%s\n' "Git did not return a full lowercase revision." >&2; exit 1; }
[[ "$(node -p 'process.versions.node')" == "24.18.0" ]] \
	|| { printf '%s\n' "Native releases require Node 24.18.0." >&2; exit 1; }
[[ "$(npm --version)" == "12.0.1" ]] \
	|| { printf '%s\n' "Native releases require npm 12.0.1." >&2; exit 1; }

classes_release_id="$classes_tag-$classes_revision"
classes_final_candidate="$classes_candidate_root/$classes_release_id"
[[ ! -e "$classes_final_candidate" && ! -L "$classes_final_candidate" ]] \
	|| { printf '%s\n' "That exact native candidate already exists." >&2; exit 1; }

classes_build_root="$(mktemp -d "$classes_candidate_root/.prepare.XXXXXX")"
classes_build_source="$classes_build_root/source"
classes_staging_candidate="$classes_build_root/candidate"
mkdir -p "$classes_build_source" "$classes_staging_candidate"
git -C "$classes_source_dir" archive "$classes_revision" | tar -x -C "$classes_build_source"

classes_npm() {
	env -i \
		PATH="$PATH" \
		CI=true \
		CYPRESS_INSTALL_BINARY=0 \
		PUPPETEER_SKIP_DOWNLOAD=true \
		npm_config_cache="$classes_build_root/npm-cache" \
		npm --prefix "$1" "${@:2}"
}

classes_npm "$classes_build_source" ci --include=optional --strict-allow-scripts
classes_npm "$classes_build_source" run lint
classes_npm "$classes_build_source" run typecheck
classes_npm "$classes_build_source" run -w front-end test:unit
classes_npm "$classes_build_source" run -w back-end test
classes_npm "$classes_build_source" run build
classes_npm "$classes_build_source" run audit

mkdir -p \
	"$classes_staging_candidate/front-end" \
	"$classes_staging_candidate/back-end" \
	"$classes_staging_candidate/deploy" \
	"$classes_staging_candidate/scripts"
cp -a "$classes_build_source/front-end/dist" "$classes_staging_candidate/front-end/dist"
cp -a "$classes_build_source/back-end/dist" "$classes_staging_candidate/back-end/dist"
cp -a "$classes_build_source/deploy/native" "$classes_staging_candidate/deploy/native"
install -m 0644 \
	"$classes_build_source/package.json" \
	"$classes_build_source/package-lock.json" \
	"$classes_staging_candidate/"
install -m 0644 "$classes_build_source/front-end/package.json" "$classes_staging_candidate/front-end/package.json"
install -m 0644 \
	"$classes_build_source/back-end/package.json" \
	"$classes_build_source/back-end/package-lock.json" \
	"$classes_staging_candidate/back-end/"
install -m 0755 \
	"$classes_build_source/scripts/verify-native-source.sh" \
	"$classes_build_source/scripts/verify-native-release.mjs" \
	"$classes_staging_candidate/scripts/"

# Install only the API's independent production dependency graph into the
# immutable candidate; Nginx serves the frontend without a JavaScript runtime.
# Runtime dependencies stay beneath back-end/ so the release verifier can
# checksum the complete executable payload without workspace symlinks.
classes_npm "$classes_staging_candidate/back-end" ci \
	--omit=dev \
	--include=optional \
	--strict-allow-scripts
rm -rf -- "$classes_staging_candidate/back-end/node_modules/.bin"
node "$classes_staging_candidate/scripts/verify-native-release.mjs" \
	--write \
	--tag "$classes_tag" \
	--revision "$classes_revision" \
	"$classes_staging_candidate"
chmod -R go-w "$classes_staging_candidate"
mv -- "$classes_staging_candidate" "$classes_final_candidate"

printf 'Prepared native candidate %s\n' "$classes_final_candidate"
