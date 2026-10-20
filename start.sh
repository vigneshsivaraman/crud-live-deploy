#!/usr/bin/env bash
set -e

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$DIR"

echo "=========================================================="
echo " Starting Fullstack CRUD App (React + NestJS + PostgreSQL)"
echo "=========================================================="

# 1. Start PostgreSQL
echo ""
echo "[1/3] Starting dedicated PostgreSQL on port 5434..."
./scripts/start-db.sh

# Cleanup trap on exit
cleanup() {
  echo ""
  echo "Shutting down servers..."
  if [ -n "$BACKEND_PID" ]; then
    kill "$BACKEND_PID" 2>/dev/null || true
  fi
  if [ -n "$FRONTEND_PID" ]; then
    kill "$FRONTEND_PID" 2>/dev/null || true
  fi
  exit 0
}
trap cleanup SIGINT SIGTERM EXIT

# 2. Start NestJS Backend
echo ""
echo "[2/3] Starting NestJS Backend on http://localhost:3001..."
cd "$DIR/backend"
npm run start:dev &
BACKEND_PID=$!

# Wait briefly for backend to initialize
sleep 3

# 3. Start React Frontend
echo ""
echo "[3/3] Starting React Frontend on http://localhost:5174..."
cd "$DIR/frontend"
npm run dev &
FRONTEND_PID=$!

echo ""
echo "=========================================================="
echo " App is running!"
echo " - Frontend (React):   http://localhost:5174"
echo " - Backend API:        http://localhost:3001/api/products"
echo " - PostgreSQL:         127.0.0.1:5434 (DB: crud_db)"
echo " Press Ctrl+C to terminate all services."
echo "=========================================================="

wait $BACKEND_PID $FRONTEND_PID
