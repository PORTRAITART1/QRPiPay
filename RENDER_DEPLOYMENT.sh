#!/bin/bash

# ============================================
# QRPiPay Complete Deployment to Render
# ============================================
# Prerequisites:
# 1. Render account (https://render.com)
# 2. GitHub repo PORTRAITART1/QRPiPay connected
# 3. Render CLI installed: npm i -g render-cli
# ============================================

set -e

echo "=========================================="
echo "🚀 QRPiPay Render Deployment Script"
echo "=========================================="

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Check prerequisites
echo -e "${YELLOW}📋 Checking prerequisites...${NC}"

if ! command -v git &> /dev/null; then
  echo -e "${RED}❌ Git not found. Install Git first.${NC}"
  exit 1
fi

if ! command -v docker &> /dev/null; then
  echo -e "${RED}❌ Docker not found. Install Docker first.${NC}"
  exit 1
fi

# Git setup
echo -e "${YELLOW}📦 Git Status...${NC}"
git status | head -5

echo ""
echo -e "${YELLOW}🔧 Deployment Configuration${NC}"
echo "----------------------------------------"
echo "Repository: https://github.com/PORTRAITART1/QRPiPay"
echo "Branch: master"
echo "Database: PostgreSQL (Render Postgres)"
echo "Backend: Node.js + Express"
echo "Frontend: React + Vite"
echo "Region: Frankfurt"
echo "----------------------------------------"

echo ""
echo -e "${YELLOW}✅ Steps to Deploy on Render:${NC}"
echo ""
echo "1. Go to https://render.com/dashboard"
echo "2. Click 'New +'"
echo "3. Select 'PostgreSQL' → Create with plan 'Free'"
echo "   - Name: qrpipay-db"
echo "   - Region: Frankfurt"
echo "   - Database: qrpipay"
echo ""
echo "4. Click 'New +' → 'Web Service'"
echo "   - Connect GitHub repo: PORTRAITART1/QRPiPay"
echo "   - Name: qrpipay-backend"
echo "   - Environment: Node"
echo "   - Build Command: npm ci --only=production && npx prisma generate"
echo "   - Start Command: npm start"
echo "   - Plan: Free"
echo "   - Region: Frankfurt"
echo "   - Add environment variables (see RENDER_ENV_VARS.txt)"
echo "   - Connect to PostgreSQL database"
echo ""
echo "5. Click 'New +' → 'Web Service' again"
echo "   - Connect GitHub repo: PORTRAITART1/QRPiPay"
echo "   - Name: qrpipay-frontend"
echo "   - Environment: Node"
echo "   - Root Directory: frontend"
echo "   - Build Command: npm ci --legacy-peer-deps && npm run build"
echo "   - Start Command: npx serve -s dist -l 3000"
echo "   - Plan: Free"
echo "   - Region: Frankfurt"
echo "   - Add VITE_API_URL env var"
echo ""
echo -e "${GREEN}✅ Use render.yaml for automated deployment:${NC}"
echo "   render up (if Render CLI is installed)"
echo ""
echo -e "${YELLOW}⚠️  Important Environment Variables:${NC}"
echo "   - JWT_SECRET: Generate a strong secret (min 32 chars)"
echo "   - PI_API_KEY: Your Pi Network API key"
echo "   - PI_APP_ID: Your Pi App ID"
echo "   - DATABASE_URL: Auto-configured by Render"
echo ""
echo -e "${YELLOW}📊 After Deployment:${NC}"
echo "   1. Test health endpoint: https://qrpipay-backend.onrender.com/health"
echo "   2. Test frontend: https://qrpipay-frontend.onrender.com"
echo "   3. Run endpoint tests: npm run test:endpoints"
echo ""
echo "=========================================="
