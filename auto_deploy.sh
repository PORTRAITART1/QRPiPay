#!/bin/bash

# 🚀 QRPIPAY AUTOMATED DEPLOYMENT SCRIPT
# This script automates the Render deployment process

echo "╔═══════════════════════════════════════════════════════════════╗"
echo "║                                                               ║"
echo "║        🚀 QRPIPAY AUTOMATED RENDER DEPLOYMENT 🚀             ║"
echo "║                                                               ║"
echo "║  Ce script automatise le déploiement sur Render               ║"
echo "║                                                               ║"
echo "╚═══════════════════════════════════════════════════════════════╝"

echo ""
echo "⚠️  IMPORTANT: Ce script nécessite l'API Render"
echo "Vous devez d'abord obtenir votre API Key Render"
echo ""

# Check if we have curl installed
if ! command -v curl &> /dev/null; then
    echo "❌ curl n'est pas installé"
    echo "Installez curl depuis: https://curl.se/"
    exit 1
fi

# Get Render API Key
read -p "Entrez votre Render API Key: " RENDER_API_KEY

if [ -z "$RENDER_API_KEY" ]; then
    echo "❌ API Key requise!"
    exit 1
fi

echo ""
echo "✅ API Key acceptée"
echo ""

# Step 1: Create PostgreSQL Database
echo "📊 STEP 1: Création de la base de données PostgreSQL..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

curl -X POST "https://api.render.com/v1/databases" \
  -H "Authorization: Bearer $RENDER_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "qrpipay-db",
    "databaseName": "qrpipay",
    "user": "qrpipay",
    "plan": "free",
    "region": "oregon"
  }' > /tmp/db_response.json

echo ""
echo "✅ Base de données en cours de création..."
sleep 3

# Step 2: Create Backend Web Service
echo ""
echo "🔧 STEP 2: Création du service Backend..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Generate JWT Secret
JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
echo "🔐 JWT_SECRET généré: $JWT_SECRET"
echo ""

curl -X POST "https://api.render.com/v1/services" \
  -H "Authorization: Bearer $RENDER_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "web_service",
    "name": "qrpipay-backend",
    "repo": "https://github.com/portraitart1/qrpipay",
    "branch": "master",
    "buildCommand": "cd backend && npm install && npm run build",
    "startCommand": "cd backend && npm start",
    "envVars": [
      {"key": "NODE_ENV", "value": "production"},
      {"key": "PORT", "value": "3001"},
      {"key": "FRONTEND_URL", "value": "https://qrpipay-frontend.onrender.com"},
      {"key": "JWT_SECRET", "value": "'$JWT_SECRET'"},
      {"key": "LOG_LEVEL", "value": "info"}
    ],
    "plan": "free",
    "region": "oregon"
  }' > /tmp/backend_response.json

echo ""
echo "✅ Service backend en cours de création..."
sleep 3

# Step 3: Create Frontend Static Site
echo ""
echo "🎨 STEP 3: Création du site Frontend..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

curl -X POST "https://api.render.com/v1/services" \
  -H "Authorization: Bearer $RENDER_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "static_site",
    "name": "qrpipay-frontend",
    "repo": "https://github.com/portraitart1/qrpipay",
    "branch": "master",
    "buildCommand": "cd frontend && npm install && npm run build",
    "publishPath": "frontend/dist",
    "envVars": [
      {"key": "VITE_API_URL", "value": "https://qrpipay-backend.onrender.com/api"}
    ],
    "plan": "free",
    "region": "oregon"
  }' > /tmp/frontend_response.json

echo ""
echo "✅ Site frontend en cours de création..."

echo ""
echo "╔═══════════════════════════════════════════════════════════════╗"
echo "║                                                               ║"
echo "║            ✅ DÉPLOIEMENT LANCÉ! ✅                          ║"
echo "║                                                               ║"
echo "║  Services en cours de création sur Render...                  ║"
echo "║  Attendez 5-10 minutes                                        ║"
echo "║                                                               ║"
echo "║  Vérifiez sur: https://dashboard.render.com                  ║"
echo "║                                                               ║"
echo "║  JWT_SECRET: $JWT_SECRET                                     ║"
echo "║                                                               ║"
echo "╚═══════════════════════════════════════════════════════════════╝"

echo ""
echo "Sauvegardez ces valeurs:"
echo "JWT_SECRET: $JWT_SECRET"
echo ""

# Save to file
echo "JWT_SECRET=$JWT_SECRET" > /tmp/qrpipay_secrets.txt
echo "Secrets sauvegardés dans: /tmp/qrpipay_secrets.txt"
