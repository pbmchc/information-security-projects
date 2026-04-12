#!/usr/bin/env bash
set -euo pipefail

subprojects='[
  {"path":"01-metric-imperial-converter","type":"node"},
  {"path":"02-issue-tracker","type":"node"},
  {"path":"03-personal-library","type":"node"},
  {"path":"04-stock-price-checker","type":"node"},
  {"path":"05-anonymous-message-board","type":"node"},
  {"path":"06-sudoku-solver","type":"node"},
  {"path":"07-american-british-english-translator","type":"node"},
  {"path":"08-port-scanner","type":"python","skip":true},
  {"path":"09-password-cracker","type":"python"},
  {"path":"10-real-time-multiplayer-game","type":"node"}
]'

changed_files=$(git diff --name-only "${GITHUB_EVENT_BEFORE}" "${GITHUB_SHA}")

projects_node='[]'
projects_python='[]'

while read -r entry; do
  skip=$(jq -r '.skip // false' <<<"$entry")
  [ "$skip" = "true" ] && continue

  path=$(jq -r '.path' <<<"$entry")
  type=$(jq -r '.type' <<<"$entry")
  if printf '%s' "$changed_files" | grep -qE "^${path}/"; then
    if [ "$type" = "node" ]; then
      projects_node=$(jq -c --argjson entry "$entry" '. + [$entry]' <<<"$projects_node")
    elif [ "$type" = "python" ]; then
      projects_python=$(jq -c --argjson entry "$entry" '. + [$entry]' <<<"$projects_python")
    fi
  fi
done < <(jq -c '.[]' <<<"$subprojects")

echo "projects_node=$projects_node" >> "$GITHUB_OUTPUT"
echo "projects_python=$projects_python" >> "$GITHUB_OUTPUT"
