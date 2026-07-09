#!/bin/bash

# QRPiPay Production Deployment - Git Push Script
# Pushes all changes to master for automatic Render deployment

set -e

echo "=========================================="
echo "📦 QRPiPay Git Push for Deployment"
echo "=========================================="
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Check git status
echo -e "${YELLOW}📋 Git Status:${NC}"
git status --short || true
echo ""

# Ask for confirmation
echo -e "${YELLOW}Files to commit:${NC}"
echo "  - backend/Dockerfile (optimized multi-stage)"
echo "  - frontend/Dockerfile (optimized multi-stage)"
echo "  - render.yaml (Render config)"
echo "  - backend/test-endpoints.js (validation script)"
echo "  - security-audit.js"
echo "  - local-validation.js"
echo "  - PRODUCTION_CHECKLIST.md"
echo "  - DEPLOYMENT_SUMMARY.md"
echo ""

read -p "Continue with commit and push? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
  echo "Cancelled."
  exit 1
fi

echo ""
echo -e "${YELLOW}🔄 Staging files...${NC}"
git add backend/Dockerfile frontend/Dockerfile render.yaml
git add backend/test-endpoints.js security-audit.js local-validation.js
git add PRODUCTION_CHECKLIST.md DEPLOYMENT_SUMMARY.md RENDER_*.txt start-dev.sh RENDER_DEPLOYMENT.sh

echo -e "${GREEN}✅ Files staged${NC}"
echo ""

echo -e "${YELLOW}💬 Commit message:${NC}"
read -p "Enter commit message (default: 'Production deployment: optimize Dockerfiles, add Render config, tests'): " msg
msg=${msg:-"Production deployment: optimize Dockerfiles, add Render config, tests"}

echo ""
echo -e "${YELLOW}📝 Committing...${NC}"
git commit -m "$msg"

echo -e "${GREEN}✅ Committed${NC}"
echo ""

echo -e "${YELLOW}🚀 Pushing to master...${NC}"
git push origin master

echo -e "${GREEN}✅ Pushed${NC}"
echo ""

echo "=========================================="
echo -e "${GREEN}✅ Deployment initiated!${NC}"
echo "=========================================="
echo ""
echo "Next steps:"
echo "1. Go to https://render.com/dashboard"
echo "2. Watch deploy logs"
echo "3. Verify https://qrpipay-backend.onrender.com/health"
echo "4. Check https://qrpipay-frontend.onrender.com"
echo ""
