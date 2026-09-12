#!/usr/bin/env bash
# Kal Ontha (كأنثى) Production Deployment Script
set -e

echo "=== Deploying Kal Ontha Platform ==="

# 1. Update repository
echo "Step 1: Pulling latest changes..."
git pull origin main

# 2. Build Frontend
echo "Step 2: Building Frontend (Vite)..."
cd frontend
npm install
npm run build
cd ..

# 3. Setup Backend
echo "Step 3: Setting up Backend (Express)..."
cd backend
npm install --production
npm run seed
cd ..

# 4. Restart services via PM2 or systemd
if command -v pm2 &> /dev/null; then
    echo "Step 4: Restarting backend with PM2..."
    pm2 restart kal-ontha-backend || pm2 start backend/src/server.js --name kal-ontha-backend
fi

echo "=== Deployment Successfully Completed ==="
