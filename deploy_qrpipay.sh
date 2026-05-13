#!/bin/bash

# 🚀 QRPIPAY AUTOMATED RENDER DEPLOYMENT
# This script creates services on Render using the API

echo "╔═══════════════════════════════════════════════════════════════╗"
echo "║                                                               ║"
echo "║   🚀 QRPIPAY RENDER DEPLOYMENT SCRIPT 🚀                    ║"
echo "║                                                               ║"
echo "║  This script will create your QRPiPay services on Render     ║"
echo "║                                                               ║"
echo "╚═══════════════════════════════════════════════════════════════╝"

echo ""
echo "Enter your Render API Token (from https://dashboard.render.com/api-tokens):"
read -p "API Token: " API_TOKEN

if [ -z "$API_TOKEN" ]; then
    echo "❌ API Token is required!"
    exit 1
fi

echo ""
echo "Enter your DATABASE_URL (from quantumx-db Connections):"
read -p "DATABASE_URL: " DATABASE_URL

if [ -z "$DATABASE_URL" ]; then
    echo "❌ DATABASE_URL is required!"
    exit 1
fi

# Generate JWT Secret
echo ""
echo "🔐 Generating JWT_SECRET..."
JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
echo "✅ JWT_SECRET: $JWT_SECRET"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 STEP 1: Creating Backend Service..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

curl -X POST "https://api.render.com/v1/services" \
  -H "Authorization: Bearer $API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "web_service",
    "name": "qrpipay-backend",
    "repo": "https://github.com/portraitart1/QRPiPay.git",
    "branch": "master",
    "buildCommand": "cd backend; npm install; npm run build",
    "startCommand": "cd backend; npm start",
    "plan": "free",
    "region": "oregon",
    "envVars": [
      {"key": "NODE_ENV", "value": "production"},
      {"key": "PORT", "value": "3001"},
      {"key": "DATABASE_URL", "value": "'"$DATABASE_URL"'"},
      {"key": "FRONTEND_URL", "value": "https://qrpipay-frontend.onrender.com"},
      {"key": "JWT_SECRET", "value": "'"$JWT_SECRET"'"},
      {"key": "LOG_LEVEL", "value": "info"}
    ]
  }'

echo ""
echo "✅ Backend service creation initiated!"

sleep 3

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🎨 STEP 2: Creating Frontend Service..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

curl -X POST "https://api.render.com/v1/services" \
  -H "Authorization: Bearer $API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "static_site",
    "name": "qrpipay-frontend",
    "repo": "https://github.com/portraitart1/QRPiPay.git",
    "branch": "master",
    "buildCommand": "cd frontend; npm install; npm run build",
    "publishPath": "frontend/dist",
    "plan": "free",
    "region": "oregon",
    "envVars": [
      {"key": "VITE_API_URL", "value": "https://qrpipay-backend.onrender.com/api"}
    ]
  }'

echo ""
echo "✅ Frontend service creation initiated!"

echo ""
echo "╔═══════════════════════════════════════════════════════════════╗"
echo "║                                                               ║"
echo "║            ✅ DEPLOYMENT INITIATED! ✅                       ║"
echo "║                                                               ║"
echo "║  Services are being created on Render...                     ║"
echo "║  Wait 5-10 minutes for deployment to complete                ║"
echo "║                                                               ║"
echo "║  Check status at: https://dashboard.render.com               ║"
echo "║                                                               ║"
echo "║  Your services will be:                                      ║"
echo "║  Frontend:  https://qrpipay-frontend.onrender.com            ║"
echo "║  Backend:   https://qrpipay-backend.onrender.com             ║"
echo "║  API:       https://qrpipay-backend.onrender.com/api         ║"
echo "║                                                               ║"
echo "║  JWT_SECRET: $JWT_SECRET"
echo "║                                                               ║"
echo "╚═══════════════════════════════════════════════════════════════╝"

echo ""
echo "🚀 Deployment script completed!"
