#!/bin/bash

# eSIM4Travel - Development Environment Setup Script
# This script initializes and runs the development environment

set -e  # Exit on error

echo "🌍 eSIM4Travel - Initializing Development Environment..."
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Get the directory where this script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js v18 or higher."
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo "✅ npm version: $(npm --version)"
echo ""

# Setup backend
echo "${BLUE}📦 Setting up backend...${NC}"
if [ ! -d "server" ]; then
    mkdir -p server
    echo "Created server directory"
fi

cd server

if [ ! -f "package.json" ]; then
    echo "Initializing backend package.json..."
    npm init -y
    npm install express cors better-sqlite3 express-session bcrypt dotenv
    npm install --save-dev nodemon
    echo "Backend dependencies installed"
fi

# Create .env file if it doesn't exist
if [ ! -f ".env" ]; then
    cat > .env << EOF
PORT=3001
NODE_ENV=development
SESSION_SECRET=esim4travel-secret-key-change-in-production
EOF
    echo "Created .env file"
fi

cd ..

# Setup frontend
echo ""
echo "${BLUE}📦 Setting up frontend...${NC}"
if [ ! -d "frontend" ]; then
    echo "Creating Vite React app..."
    npm create vite@latest frontend -- --template react
    cd frontend
    npm install
    npm install react-router-dom
    echo "Frontend dependencies installed"
    cd ..
fi

echo ""
echo "${GREEN}✨ Environment setup complete!${NC}"
echo ""
echo "${YELLOW}📝 Starting development servers...${NC}"
echo ""
echo "Backend will run on: ${BLUE}http://localhost:3001${NC}"
echo "Frontend will run on: ${BLUE}http://localhost:5173${NC}"
echo ""
echo "Press Ctrl+C to stop servers"
echo ""

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "${YELLOW}Shutting down servers...${NC}"
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    exit 0
}

trap cleanup EXIT INT TERM

# Start backend server
cd server
if [ -f "index.js" ] || [ -f "server.js" ]; then
    if command -v nodemon &> /dev/null && [ -f "node_modules/.bin/nodemon" ]; then
        npm run dev &
    else
        node index.js &
    fi
    BACKEND_PID=$!
    echo "${GREEN}✅ Backend server started (PID: $BACKEND_PID)${NC}"
else
    echo "${YELLOW}⚠️  Backend entry file not found. Skipping backend startup.${NC}"
    echo "${YELLOW}   Create server/index.js to enable backend.${NC}"
fi
cd ..

# Start frontend server
cd frontend
if [ -f "package.json" ]; then
    npm run dev &
    FRONTEND_PID=$!
    echo "${GREEN}✅ Frontend server started (PID: $FRONTEND_PID)${NC}"
fi
cd ..

echo ""
echo "${GREEN}🚀 Development environment is running!${NC}"
echo ""
echo "Open your browser to ${BLUE}http://localhost:5173${NC} to view the app"
echo ""

# Wait for both processes
wait
