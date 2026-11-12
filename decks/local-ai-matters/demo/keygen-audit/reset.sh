#!/usr/bin/env bash
# Rebuild a clean copy of tinywallet in ./work (or $1) for the agent to audit.
set -euo pipefail
cd "$(dirname "$0")"
work="${1:-work}"

rm -rf "$work"
cp -R seed "$work"
cd "$work"
git init -q
git add -A
git -c user.name=tinywallet -c user.email=dev@tinywallet.invalid commit -q -m "tinywallet: initial commit"
echo "Fresh tinywallet in $(pwd)"
