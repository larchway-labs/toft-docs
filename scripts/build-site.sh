#!/usr/bin/env bash
# Build the published site: every release/X.Y branch into site/X.Y, the newest
# again into site/latest, and the two root pages beside them.
#
#   scripts/build-site.sh            what the Pages workflow runs
#   DOCS_PREFIX=/docs scripts/...    a different path, for a mirror or a domain
#
# Each minor is built from its own branch with its own base, so a version's
# links, assets and Pagefind index all stay inside its folder.
set -euo pipefail
PREFIX=${DOCS_PREFIX:-/toft-docs}
root=$(pwd)
out=$root/site
rm -rf "$out"
mkdir -p "$out"

git fetch --quiet origin '+refs/heads/release/*:refs/remotes/origin/release/*' '+refs/heads/main:refs/remotes/origin/main'
mapfile -t versions < <(git for-each-ref --format='%(refname:lstrip=4)' refs/remotes/origin/release/ |
    grep -E '^[0-9]+\.[0-9]+$' | sort -V)
[ ${#versions[@]} -gt 0 ] || { echo "no release/X.Y branch to publish" >&2; exit 1; }
latest=${versions[-1]}

build() { # build BRANCH-VERSION FOLDER
    local w
    w=$(mktemp -d)
    git worktree add --quiet --detach "$w" "origin/release/$1"
    (cd "$w" && npm ci --no-audit --no-fund >/dev/null && DOCS_BASE="$PREFIX/$2" npx astro build >/dev/null)
    cp -r "$w/dist" "$out/$2"
    git worktree remove --force "$w"
    echo "built release/$1 -> $PREFIX/$2/"
}

for v in "${versions[@]}"; do build "$v" "$v"; done
build "$latest" latest

# The root pages come from main, whichever branch triggered the build, so a
# fix to them never waits for a release branch to be cut.
for f in index.html 404.html; do
    git show "origin/main:pages/$f" | sed "s|@PREFIX@|$PREFIX|g; s|@LATEST@|$latest|g" > "$out/$f"
done
printf '%s\n' "${versions[@]}" > "$out/versions.txt"
echo "published ${versions[*]}, latest is $latest"
