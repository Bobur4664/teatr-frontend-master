#!/usr/bin/env bash
# Assemble one theatre's frontend: the template in frontend/ plus that
# site's own files in sites/<site>/. CI and the deploy build from the result.
#
#   scripts/assemble-site.sh <site> <output-dir>
#
# A site's public/ folder replaces the template's entirely, so one site's logo
# can't end up in another's build. Every other file overrides the template's
# file at the same path.

set -euo pipefail

ROOT=$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)
SITE=${1:?usage: assemble-site.sh <site> <output-dir>}
OUT=${2:?usage: assemble-site.sh <site> <output-dir>}
SITE_DIR="$ROOT/sites/$SITE"

[[ -d $SITE_DIR ]] || { echo "unknown site '$SITE' (no $SITE_DIR)" >&2; exit 1; }

mkdir -p "$OUT"
OUT=$(cd "$OUT" && pwd)
# --checksum throughout: rsync otherwise skips a file with the same size and
# modification time, and a fresh checkout gives files the same time, so a site's
# logo or a same-sized code change would silently lose to the template's.
# Excluded paths survive --delete, so re-assembling keeps an installed node_modules.
rsync -a --checksum --delete \
  --exclude=/node_modules/ --exclude=/dist/ --exclude=/.env --exclude=/.env.local \
  "$ROOT/frontend/" "$OUT/"

if [[ -d $SITE_DIR/public ]]; then
  rsync -a --checksum --delete "$SITE_DIR/public/" "$OUT/public/"
fi
rsync -a --checksum --exclude=/public/ "$SITE_DIR/" "$OUT/"

# Stop here rather than ship a site without its own files.
(
  cd "$SITE_DIR"
  find . -type f -print0 | while IFS= read -r -d '' file; do
    cmp -s "$file" "$OUT/$file" || { echo "$SITE: $file did not reach $OUT" >&2; exit 1; }
  done
)
