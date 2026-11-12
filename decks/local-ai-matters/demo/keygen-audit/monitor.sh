#!/usr/bin/env bash
# Right-hand herdr pane: live GPU load and power on one Spark, so the room can see the box working.
# SPARK_HOST is an ssh alias from your ~/.ssh/config; nothing about the network lives in this repo.
set -euo pipefail
: "${SPARK_HOST:?set SPARK_HOST to the ssh alias of one of the Sparks}"
exec ssh -t "$SPARK_HOST" 'watch -t -n 1 "nvidia-smi --query-gpu=name,utilization.gpu,power.draw,temperature.gpu --format=csv"'
