#!/bin/bash

# QRPiPay - Complete Setup Script
# Jour 4 - Production Ready

echo "🥧 QRPiPay Setup - Production Ready"
echo "===================================="
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check prerequisites
echo -e "${BLUE}📋 Vérification des prérequis...${NC}"

if ! command -v node &> /dev/null; then
    echo "❌ Node.js n'est pas installé"
    exit 1
fi
echo "✅ Node.js: $(node --version)"

if ! command -v npm &> /dev/null; then
    echo "❌ npm n'est pas installé"
    exit 1
fi
echo "✅ npm: $(npm --version)"

if ! command -v docker &> /dev/null; then
    echo "❌ Docker n'est pas installé (optionnel mais recommandé)"
fi

echo ""
echo -e "${BLUE}📦 Installation des dépendances...${NC}"

# Frontend
echo "📱 Frontend..."
cd frontend
npm install
if [ $? -ne 0 ]; then
    echo "❌ Erreur lors de l'installation du frontend"
    exit 1
fi
cd ..

# Backend
echo "🔧 Backend..."
cd backend
npm install
if [ $? -ne 0 ]; then
    echo "❌ Erreur lors de l'installation du backend"
    exit 1
fi
cd ..

# Database
echo "🗄️  Database..."
cd database
npm install
if [ $? -ne 0 ]; then
    echo "❌ Erreur lors de l'installation de la base de données"
    exit 1
fi
cd ..

echo ""
echo -e "${BLUE}⚙️  Configuration...${NC}"

# Create .env files if they don't exist
if [ ! -f "backend/.env" ]; then
    echo "📝 Création backend/.env"
    cp backend/.env.example backend/.env
    echo "⚠️  Veuillez compléter backend/.env"
fi

if [ ! -f "database/.env" ]; then
    echo "📝 Création database/.env"
    cp database/.env.example database/.env
    echo "⚠️  Veuillez compléter database/.env"
fi

echo ""
echo -e "${GREEN}✅ Setup terminé avec succès!${NC}"
echo ""
echo -e "${BLUE}🚀 Prochaines étapes:${NC}"
echo ""
echo "1️⃣  Configuration PostgreSQL:"
echo "   docker run --name qrpipay-db \\"
echo "     -e POSTGRES_USER=qrpipay \\"
echo "     -e POSTGRES_PASSWORD=dev_password \\"
echo "     -e POSTGRES_DB=qrpipay \\"
echo "     -p 5432:5432 -d postgres:15-alpine"
echo ""
echo "2️⃣  Migration Database:"
echo "   cd database && npm run migrate"
echo ""
echo "3️⃣  Démarrage Frontend (Terminal 1):"
echo "   cd frontend && npm run dev"
echo ""
echo "4️⃣  Démarrage Backend (Terminal 2):"
echo "   cd backend && npm run dev"
echo ""
echo "5️⃣  Accès:"
echo "   - Frontend: http://localhost:3000"
echo "   - Backend: http://localhost:3001"
echo "   - Database: localhost:5432"
echo ""
echo -e "${YELLOW}💡 Ou utilisez Docker Compose:${NC}"
echo "   docker-compose up"
echo ""
echo -e "${GREEN}🎉 QRPiPay est prêt!${NC}"
echo ""
