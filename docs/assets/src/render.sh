#!/usr/bin/env sh
# Renders each page to a 2x PNG in docs/assets/. Usage: sh docs/assets/src/render.sh
# Needs Chrome or Edge; set CHROME to its path if `chrome` is not on PATH.
set -e
cd "$(dirname "$0")"
CHROME="${CHROME:-chrome}"
here() { if command -v cygpath >/dev/null 2>&1; then cygpath -m "$(pwd)"; else pwd; fi; }
render() { # name width height
  "$CHROME" --headless=new --disable-gpu --hide-scrollbars --force-device-scale-factor=2 \
    --virtual-time-budget=8000 --window-size="$2,$3" \
    --screenshot="$(here)/../$1.png" "file:///$(here)/$1.html"
}
render banner 1280 440
render terminal 1200 830
render dpdp-clock 1280 330
render social-card 1280 640
