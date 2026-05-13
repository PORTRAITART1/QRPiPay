#!/bin/bash

# 🚀 QRPIPAY RENDER DEPLOYMENT - CORRECTED SCRIPT
# Fix for double deployment issue

echo "═══════════════════════════════════════════════════════════"
echo "QRPIPAY RENDER DEPLOYMENT - CORRECTION & SYNC"
echo "═══════════════════════════════════════════════════════════"
echo ""

# PROBLEM ANALYSIS
echo "PROBLEM DETECTED:"
echo "  ❌ Build command had: cd backend && npm install && npm run build"
echo "  ❌ Start command had: cd backend && npm start"
echo "  ❌ Root Directory was: backend"
echo "  ❌ Result: Double cd = ERROR"
echo ""

echo "ROOT CAUSE:"
echo "  - When Root Directory = backend"
echo "  - Render ALREADY runs from /backend"
echo "  - So 'cd backend' tries to go to /backend/backend (doesn't exist)"
echo ""

echo "SOLUTION:"
echo "  ✅ Use EITHER Root Directory OR cd command, NOT BOTH"
echo "  ✅ Recommended: Use Dockerfiles (render.yaml does this)"
echo "  ✅ render.yaml uses: dockerfile: ./backend/Dockerfile"
echo ""

# CORRECTED CONFIGURATION
echo "═══════════════════════════════════════════════════════════"
echo "CORRECTED RENDER.YAML CONFIGURATION"
echo "═══════════════════════════════════════════════════════════"
echo ""

cat << 'YAML_CONFIG'
services:
  # Backend Service - CORRECT
  - type: web
    name: qrpipay-backend
    dockerfile: ./backend/Dockerfile        # Use Dockerfile!
    dockerContext: .
    plan: free
    region: oregon
    envVars:
      - key: NODE_ENV
        value: production
      - key: PORT
        value: 3001
      - key: DATABASE_URL
        fromDatabase:
          name: qrpipay-db
          property: connectionString
      - key: FRONTEND_URL
        value: https://qrpipay.onrender.com
      - key: JWT_SECRET
        sync: false
      - key: LOG_LEVEL
        value: info

  # Frontend Service - CORRECT
  - type: web
    name: qrpipay-frontend
    dockerfile: ./frontend/Dockerfile       # Use Dockerfile!
    dockerContext: .
    plan: free
    region: oregon
    envVars:
      - key: VITE_API_URL
        value: https://qrpipay-backend.onrender.com/api
      - key: VITE_PI_APP_ID
        sync: false

# Database
databases:
  - name: qrpipay-db
    databaseName: qrpipay
    user: qrpipay
    plan: free
    version: 15
    region: oregon
YAML_CONFIG

echo ""
echo "═══════════════════════════════════════════════════════════"
echo "WHAT WENT WRONG"
echo "═══════════════════════════════════════════════════════════"
echo ""
echo "YESTERDAY & TODAY:"
echo "  1. Filled form MANUALLY (Build Command, Start Command, etc)"
echo "  2. Render tried to run: cd backend && npm install"
echo "  3. But Root Directory was ALSO set to 'backend'"
echo "  4. Result: Tried to cd to /backend/backend → FAILED"
echo ""

echo "═══════════════════════════════════════════════════════════"
echo "CORRECT APPROACH"
echo "═══════════════════════════════════════════════════════════"
echo ""
echo "OPTION 1: Use Dockerfiles (BEST - What render.yaml does)"
echo "  - Render detects render.yaml"
echo "  - Uses Dockerfiles automatically"
echo "  - No manual commands needed"
echo "  - More reliable"
echo ""

echo "OPTION 2: Manual Node.js deployment (NOT RECOMMENDED)"
echo "  - Build Command: npm install && npm run build"
echo "  - Start Command: npm start"
echo "  - Root Directory: backend"
echo "  - NO cd backend in commands!"
echo ""

echo "═══════════════════════════════════════════════════════════"
echo "HOW TO FIX NOW"
echo "═══════════════════════════════════════════════════════════"
echo ""

echo "STEP 1: On Render Dashboard"
echo "  → Go to qrpipay-backend service"
echo "  → Click 'Settings'"
echo "  → Scroll down to 'Build & Deploy'"
echo "  → Click 'Delete Service'"
echo ""

echo "STEP 2: Start Fresh"
echo "  → Go back to Dashboard"
echo "  → Click 'New +'"
echo "  → Select 'Web Service'"
echo "  → Select 'Public GitHub repository'"
echo "  → Search: PORTRAITART1/QRPiPay"
echo "  → Connect"
echo ""

echo "STEP 3: Let Render Auto-Detect"
echo "  → Render will detect render.yaml"
echo "  → It will show 3 services automatically:"
echo "    • qrpipay-backend (from Dockerfile)"
echo "    • qrpipay-frontend (from Dockerfile)"
echo "    • qrpipay-db (PostgreSQL)"
echo "  → Configure JWT_SECRET only"
echo "  → Click Deploy"
echo ""

echo "═══════════════════════════════════════════════════════════"
echo "VERIFICATION CHECKLIST"
echo "═══════════════════════════════════════════════════════════"
echo ""

# Check files
echo "✓ Checking Dockerfiles..."
if [ -f "backend/Dockerfile" ]; then
    echo "  [OK] backend/Dockerfile exists"
else
    echo "  [FAIL] backend/Dockerfile missing"
fi

if [ -f "frontend/Dockerfile" ]; then
    echo "  [OK] frontend/Dockerfile exists"
else
    echo "  [FAIL] frontend/Dockerfile missing"
fi

echo ""
echo "✓ Checking render.yaml..."
if [ -f "render.yaml" ]; then
    echo "  [OK] render.yaml exists"
    if grep -q "dockerfile:" render.yaml; then
        echo "  [OK] Dockerfiles configured in render.yaml"
    else
        echo "  [FAIL] Dockerfiles NOT in render.yaml"
    fi
else
    echo "  [FAIL] render.yaml missing"
fi

echo ""
echo "═══════════════════════════════════════════════════════════"
echo "KEY TAKEAWAY"
echo "═══════════════════════════════════════════════════════════"
echo ""
echo "render.yaml ALREADY HANDLES EVERYTHING:"
echo "  • Detects Dockerfiles"
echo "  • Creates 3 services"
echo "  • Configures environment"
echo "  • No manual commands needed"
echo ""
echo "Just:"
echo "  1. Let Render detect render.yaml"
echo "  2. Add JWT_SECRET"
echo "  3. Click Deploy"
echo "  4. Wait 15-20 minutes"
echo ""

echo "═══════════════════════════════════════════════════════════"
echo "STATUS: READY FOR CORRECTED DEPLOYMENT"
echo "═══════════════════════════════════════════════════════════"
