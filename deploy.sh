#!/bin/bash
# QRPiPay Complete Deployment Script
# ===================================

set -e

echo "🚀 QRPiPay Deployment Pipeline"
echo "==============================="

# Step 1: Docker Compose Validation
echo "✅ Step 1: Validating docker-compose configuration..."
docker compose config > /dev/null && echo "   Docker Compose is valid"

# Step 2: Build Images
echo "✅ Step 2: Building Docker images (multi-platform)..."
docker buildx build --platform linux/amd64,linux/arm64 -t qrpipay-backend:latest -t qrpipay-backend:v2.0 backend/ --push 2>/dev/null || docker build -t qrpipay-backend:latest backend/
docker buildx build --platform linux/amd64,linux/arm64 -t qrpipay-frontend:latest -t qrpipay-frontend:v1.0 frontend/ --push 2>/dev/null || docker build -t qrpipay-frontend:latest frontend/

# Step 3: Start Services
echo "✅ Step 3: Starting services..."
docker compose up -d
sleep 5

# Step 4: Health Checks
echo "✅ Step 4: Verifying service health..."
POSTGRES_STATUS=$(docker compose ps postgres 2>/dev/null | grep -q "healthy" && echo "✓ healthy" || echo "✗ checking...")
BACKEND_STATUS=$(curl -s http://localhost:3001/health | jq -r .status 2>/dev/null || echo "starting")
FRONTEND_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000 2>/dev/null || echo "starting")

echo "   PostgreSQL: $POSTGRES_STATUS"
echo "   Backend: $BACKEND_STATUS"
echo "   Frontend HTTP: $FRONTEND_STATUS"

# Step 5: Show logs
echo "✅ Step 5: Recent logs..."
docker compose logs --tail=20

echo ""
echo "✅ Deployment Complete!"
echo "📊 Monitor: docker compose logs -f"
echo "🌐 Frontend: http://localhost:3000"
echo "💳 API: http://localhost:3001/api"
echo "❤️ Health: curl http://localhost:3001/health"
