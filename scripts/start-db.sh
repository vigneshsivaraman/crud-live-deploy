#!/usr/bin/env bash
set -e

PG_DIR="/home/e1110/Project/crud live app/backend/pgdata"
PG_BIN="/usr/lib/postgresql/17/bin"

if [ ! -d "$PG_DIR" ]; then
  echo "Initializing PostgreSQL database..."
  mkdir -p "$PG_DIR"
  $PG_BIN/initdb -D "$PG_DIR"
  echo "port = 5434" >> "$PG_DIR/postgresql.conf"
  echo "listen_addresses = '127.0.0.1'" >> "$PG_DIR/postgresql.conf"
  echo "unix_socket_directories = '/tmp'" >> "$PG_DIR/postgresql.conf"
fi

if $PG_BIN/pg_isready -h /tmp -p 5434 >/dev/null 2>&1 || $PG_BIN/pg_isready -h 127.0.0.1 -p 5434 >/dev/null 2>&1; then
  echo "PostgreSQL is already active and accepting connections on port 5434."
else
  echo "Starting PostgreSQL on port 5434..."
  $PG_BIN/pg_ctl -D "$PG_DIR" -l "$PG_DIR/logfile" start
fi

# Ensure database exists
$PG_BIN/psql -h /tmp -p 5434 -U e1110 -d postgres -tc "SELECT 1 FROM pg_database WHERE datname = 'crud_db'" 2>/dev/null | grep -q 1 || \
$PG_BIN/createdb -h /tmp -p 5434 -U e1110 crud_db 2>/dev/null || true

echo "PostgreSQL database 'crud_db' is ready!"
