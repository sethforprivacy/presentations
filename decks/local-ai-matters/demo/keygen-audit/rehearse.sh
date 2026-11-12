#!/usr/bin/env bash
# Rehearsal: run the demo headless N times (default 5) and grade each run with check.sh.
# Logs go to rehearsals/<n>/omp.log; the summary line per run is pass/fail and wall time.
set -uo pipefail
cd "$(dirname "$0")"
: "${OMP_MODEL:?set OMP_MODEL to the same model id run.sh uses}"
runs="${1:-5}"
prompt=$(cat prompt.txt)
mkdir -p rehearsals
passed=0

for n in $(seq 1 "$runs"); do
  dir="rehearsals/$n"
  rm -rf "$dir" && mkdir -p "$dir"
  ./reset.sh "$dir/work" >/dev/null
  start=$(date +%s)
  (cd "$dir/work" && omp -p --model "$OMP_MODEL" "$prompt") >"$dir/omp.log" 2>&1
  secs=$(( $(date +%s) - start ))
  if ./check.sh "$dir/work" >"$dir/check.log" 2>&1; then
    passed=$((passed + 1)); echo "run $n: PASS in ${secs}s"
  else
    echo "run $n: FAIL in ${secs}s"; sed 's/^/        /' "$dir/check.log"
  fi
done

echo "$passed/$runs runs passed"
