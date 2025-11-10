#!/usr/bin/env sh
# Basic Docker container checks for Nagios (running/cpu/mem)
# Requires /var/run/docker.sock mounted read-only in the Nagios container.

set -eu

NAME=""
MODE="running"
WARN="80"
CRIT="95"

while [ $# -gt 0 ]; do
  case "$1" in
    --name) NAME="$2"; shift 2 ;;
    --mode) MODE="$2"; shift 2 ;;
    --warning) WARN="$2"; shift 2 ;;
    --critical) CRIT="$2"; shift 2 ;;
    *) echo "UNKNOWN - Invalid argument $1"; exit 3 ;;
  esac
done

if [ -z "${NAME}" ]; then
  echo "UNKNOWN - --name is required"
  exit 3
fi

docker_bin="docker"

check_running() {
  if ! ${docker_bin} inspect -f '{{.State.Running}}' "${NAME}" >/dev/null 2>&1; then
    echo "CRITICAL - container '${NAME}' not found"
    exit 2
  fi
  state="$(${docker_bin} inspect -f '{{.State.Running}}' "${NAME}" 2>/dev/null || echo false)"
  if [ "${state}" = "true" ]; then
    echo "OK - container '${NAME}' is running"
    exit 0
  else
    echo "CRITICAL - container '${NAME}' is not running"
    exit 2
  fi
}

parse_percent() {
  # Extract numeric percent value like "5.21%" -> 5.21
  echo "$1" | tr -d '%' | tr -d ' ' || echo "0"
}

check_stats_field() {
  field="$1" # "cpu" | "mem"
  # Use docker stats for a single container, no stream
  stats="$(${docker_bin} stats --no-stream --format '{{.CPUPerc}};{{.MemPerc}}' "${NAME}" 2>/dev/null || true)"
  if [ -z "${stats}" ]; then
    echo "CRITICAL - unable to fetch stats for '${NAME}'"
    exit 2
  fi
  cpu_perc="$(echo "${stats}" | cut -d';' -f1)"; cpu_num="$(parse_percent "${cpu_perc}")"
  mem_perc="$(echo "${stats}" | cut -d';' -f2)"; mem_num="$(parse_percent "${mem_perc}")"
  if [ "${field}" = "cpu" ]; then
    val="${cpu_num}"; label="CPU"
  else
    val="${mem_num}"; label="Memory"
  fi
  warn="${WARN}"; crit="${CRIT}"
  awk -v v="${val}" -v w="${warn}" -v c="${crit}" -v name="${NAME}" -v label="${label}" '
    BEGIN {
      if (v >= c) { printf "CRITICAL - %s usage %.2f%% (>= %.2f%%)\n", label, v, c; exit 2 }
      else if (v >= w) { printf "WARNING - %s usage %.2f%% (>= %.2f%%)\n", label, v, w; exit 1 }
      else { printf "OK - %s usage %.2f%%\n", label, v; exit 0 }
    }'
}

case "${MODE}" in
  running) check_running ;;
  cpu) check_stats_field "cpu" ;;
  mem) check_stats_field "mem" ;;
  *) echo "UNKNOWN - invalid mode '${MODE}'"; exit 3 ;;
esac


