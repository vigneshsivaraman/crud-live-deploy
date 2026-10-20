#!/usr/bin/env bash
PG_DIR="/home/e1110/Project/crud live app/backend/pgdata"
PG_BIN="/usr/lib/postgresql/17/bin"

if [ -d "$PG_DIR" ]; then
  echo "Stopping PostgreSQL server..."
  $PG_BIN/pg_ctl -D "$PG_DIR" stop || true
fi
