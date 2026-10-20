# Human-in-the-Loop Reproduction Loop

When reproducing a bug needs a human to click, drive them with a script so the loop stays structured. Copy the script below to a scratch location, edit the steps between the markers, and run it with `bash`. You run the script; the user follows the prompts in their terminal, and the captured values print at the end as `KEY=VALUE` lines for you to parse.

`capture` prints its value back to the terminal, where you read it, so use it for observations and leave signing in to the user as a `step`.

```bash
#!/usr/bin/env bash
# Human-in-the-loop reproduction loop.
#
# Two helpers:
#   step "<instruction>"          → show instruction, wait for Enter
#   capture VAR "<question>"      → show question, read response into VAR

set -euo pipefail

step() {
  printf '\n>>> %s\n' "$1"
  read -r -p "    [Enter when done] " _
}

capture() {
  local var="$1" question="$2" answer
  printf '\n>>> %s\n' "$question"
  read -r -p "    > " answer
  printf -v "$var" '%s' "$answer"
}

# --- edit below ---------------------------------------------------------

step "Open the app at http://localhost:3000 and sign in."

capture ERRORED "Click the 'Export' button. Did it throw an error? (y/n)"

capture ERROR_MSG "Paste the error message (or 'none'):"

# --- edit above ---------------------------------------------------------

printf '\n--- Captured ---\n'
printf 'ERRORED=%s\n' "$ERRORED"
printf 'ERROR_MSG=%s\n' "$ERROR_MSG"
```
