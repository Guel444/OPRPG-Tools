#!/bin/bash
# Start backend on port 3001
cd /home/runner/workspace/backend && PORT=3001 node src/index.js &
BACKEND_PID=$!

# Start frontend on port 5000
cd /home/runner/workspace/frontend && PORT=5000 npm start &
FRONTEND_PID=$!

# Wait for both
wait $BACKEND_PID $FRONTEND_PID
