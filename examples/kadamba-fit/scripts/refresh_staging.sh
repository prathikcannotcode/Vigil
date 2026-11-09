#!/usr/bin/env bash
set -euo pipefail

for region in in eu; do
  dump="/tmp/kadamba-$region.dump"
  pg_dump --format=custom \
    --exclude-table=payment_tokens \
    --exclude-table=coach_payouts \
    "$(vault read -field=url "kv/prod/$region/db")" > "$dump"
  pg_restore --clean --no-owner -d "$(vault read -field=url "kv/staging/$region/db")" "$dump"
  rm -f "$dump"
done
