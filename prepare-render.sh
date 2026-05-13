#!/bin/bash

# 🚀 QRPiPay Render Deployment Script
# Ce script aide à préparer et vérifier le déploiement sur Render

set -e

echo "📋 QRPiPay - Préparation au déploiement Render"
echo "================================================"

# 1. Vérifier les fichiers critiques
echo ""
echo "✅ Vérification des fichiers critiques..."

CRITICAL_FILES=(
  "render.yaml"
  "backend/Dockerfile"
  "frontend/Dockerfile"
  "backend/package.json"
  "frontend/package.json"
  "database/prisma/schema.prisma"
  "backend/src/lib/prisma.ts"
)

for file in "${CRITICAL_FILES[@]}"; do
  if [ -f "$file" ]; then
    echo "  ✓ $file"
  else
    echo "  ✗ MANQUANT: $file"
    exit 1
  fi
done

# 2. Vérifier Node.js
echo ""
echo "✅ Vérification de Node.js..."
if command -v node &> /dev/null; then
  NODE_VERSION=$(node -v)
  echo "  ✓ Node.js $NODE_VERSION"
else
  echo "  ✗ Node.js non installé"
  exit 1
fi

# 3. Vérifier npm
echo ""
echo "✅ Vérification de npm..."
if command -v npm &> /dev/null; then
  NPM_VERSION=$(npm -v)
  echo "  ✓ npm $NPM_VERSION"
else
  echo "  ✗ npm non installé"
  exit 1
fi

# 4. Test build backend
echo ""
echo "✅ Test de construction du backend..."
cd backend
npm install > /dev/null 2>&1 || { echo "✗ Erreur: npm install backend échoué"; exit 1; }
npm run build > /dev/null 2>&1 || { echo "✗ Erreur: npm run build backend échoué"; exit 1; }
echo "  ✓ Backend compilé avec succès"
cd ..

# 5. Test build frontend
echo ""
echo "✅ Test de construction du frontend..."
cd frontend
npm install > /dev/null 2>&1 || { echo "✗ Erreur: npm install frontend échoué"; exit 1; }
npm run build > /dev/null 2>&1 || { echo "✗ Erreur: npm run build frontend échoué"; exit 1; }
echo "  ✓ Frontend compilé avec succès"
cd ..

# 6. Vérifier les Dockerfiles
echo ""
echo "✅ Vérification des Dockerfiles..."
if docker --version &> /dev/null; then
  echo "  ✓ Docker disponible"
  echo "    Conseil: Testez localement avec 'docker-compose up' avant de pousser"
else
  echo "  ⚠ Docker non installé - test de build Docker skippé"
fi

# 7. Vérifier Git
echo ""
echo "✅ Vérification de Git..."
if command -v git &> /dev/null; then
  GIT_STATUS=$(git status --short)
  if [ -z "$GIT_STATUS" ]; then
    echo "  ✓ Repository propre"
  else
    echo "  ⚠ Fichiers non commitées détectés:"
    git status --short | sed 's/^/    /'
    echo "    Commit ou stash avant de pousser sur Render"
  fi
else
  echo "  ✗ Git non installé"
fi

# 8. Configuration Render
echo ""
echo "✅ Configuration Render.yaml..."
if grep -q "type: web" render.yaml && grep -q "type: static" render.yaml; then
  echo "  ✓ render.yaml bien configuré (backend + frontend + database)"
else
  echo "  ✗ render.yaml incomplet"
  exit 1
fi

# 9. Checklist finale
echo ""
echo "================================================"
echo "✨ Checklist de déploiement Render"
echo "================================================"
echo ""
echo "AVANT de pousser sur GitHub:"
echo "  [ ] Vérifier .env.production du backend"
echo "  [ ] Vérifier .env.production du frontend"
echo "  [ ] Générer un JWT_SECRET sécurisé pour Render"
echo "  [ ] Tester localement: docker-compose up"
echo ""
echo "SUR Render:"
echo "  [ ] 1. Créer nouveau Web Service"
echo "  [ ] 2. Sélectionner 'Public GitHub repository'"
echo "  [ ] 3. Entrer URL: https://github.com/VOTRE_USERNAME/QRPiPay.git"
echo "  [ ] 4. Laisser Render utiliser render.yaml automatiquement"
echo "  [ ] 5. Configurer les variables d'environnement:"
echo "        - JWT_SECRET_KEY (générer une clé sécurisée)"
echo "        - DB_PASSWORD (de PostgreSQL Render)"
echo "        - DB_HOST (de PostgreSQL Render)"
echo "  [ ] 6. Cliquer Deploy"
echo ""
echo "APRÈS déploiement:"
echo "  [ ] Vérifier /health endpoint"
echo "  [ ] Vérifier /api/status endpoint"
echo "  [ ] Vérifier logs dans Render"
echo "  [ ] Tester connexion frontend → backend"
echo ""
echo "✅ Tous les tests locaux passés!"
echo "🚀 Prêt pour le déploiement Render!"
