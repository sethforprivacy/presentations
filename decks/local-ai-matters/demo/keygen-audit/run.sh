#!/usr/bin/env bash
# Show-time: fresh tinywallet, then OMP on the local model with the one fixed prompt.
# Set OMP_MODEL to the model id OMP uses for DeepSeek V4.1 Flash 1017 on the Sparks (see `omp models`).
set -euo pipefail
cd "$(dirname "$0")"
: "${OMP_MODEL:?set OMP_MODEL, e.g. OMP_MODEL=<provider>/<deepseek-1017-id> ./run.sh}"

./reset.sh work >/dev/null
prompt=$(cat prompt.txt)
command -v pbcopy >/dev/null && printf '%s' "$prompt" | pbcopy  # in case you need to paste it

cd work
clear
echo "tinywallet · $(ls | tr '\n' ' ')"
echo
exec omp --model "$OMP_MODEL" "$prompt"
