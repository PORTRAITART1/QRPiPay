#!/bin/bash
# QRPiPay - Final Deploy Script

echo "====== QRPIPAY FINAL DEPLOY ======"
echo ""

# STEP 1: Clean
echo "[1] Cleaning..."
cd backend
rm -rf node_modules dist package-lock.json
cd ../frontend
rm -rf node_modules dist package-lock.json
cd ..

# STEP 2: Install
echo "[2] Installing..."
cd backend
npm install --legacy-peer-deps
npm run build
cd ../frontend
npm install --legacy-peer-deps
npm run build
cd ..

# STEP 3: Fix start command
echo "[3] Creating start script..."

cat > backend/start.js << 'EOF'
#!/usr/bin/env node
require('dotenv').config();
require('./dist/server.js');
EOF

chmod +x backend/start.js

# STEP 4: Update package.json
echo "[4] Updating package.json..."

# Change start script to use the simple start.js
cd backend
npm pkg set scripts.start="node dist/server.js"
cd ..

# STEP 5: Git commit
echo "[5] Committing..."
git add -A
git commit -m "FINAL DEPLOY: Simplified backend - ready for Render Native Node.js"
git push origin master

echo ""
echo "====== SUCCESS ======"
echo "Deploy now on Render with:"
echo "- Language: Node"
echo "- Root Directory: backend"
echo "- Build: npm install --legacy-peer-deps && npm run build"
echo "- Start: npm start"
echo ""
