#!/usr/bin/env bash
# Grade one demo run in ./work (or $1): did the agent prove the bug and fix it?
# Exit 0 only if all three checks pass. Lives outside the work dir so the agent never sees the answer.
set -uo pipefail
cd "$(dirname "$0")"
work="${1:-work}"
expected="end engine load screen audit unfold rather drill piano spy breeze motor"
pass=0
limit=$(command -v timeout || command -v gtimeout || true)  # macOS has neither unless coreutils is installed

if [ -f "$work/poc.py" ] && (cd "$work" && ${limit:+$limit 120} python3 poc.py 2>&1) | grep -q "$expected"; then
  echo "PASS  poc.py recovers the seed phrase"
else
  echo "FAIL  poc.py missing, or did not print the seed phrase"; pass=1
fi

if grep -Eq 'secrets\.|os\.urandom|SystemRandom' "$work/keygen.py" && ! grep -Eq 'random\.seed|random\.getrandbits' "$work/keygen.py"; then
  echo "PASS  keygen.py uses a CSPRNG"
else
  echo "FAIL  keygen.py still uses the time-seeded random module"; pass=1
fi

if (cd "$work" && python3 -m unittest -q >/dev/null 2>&1); then
  echo "PASS  tests pass"
else
  echo "FAIL  tests fail"; pass=1
fi

exit $pass
