#!/bin/bash

# QRPiPay Local Development Startup Script
# Starts full stack with proper logging

set -e

echo "=========================================="
echo "🚀 QRPiPay Local Development Stack"
echo "=========================================="
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Check prerequisites
echo -e "${YELLOW}📋 Checking prerequisites...${NC}"

if ! command -v docker &> /dev/null; then
  echo "❌ Docker not found. Install Docker first."
  exit 1
fi

if ! command -v docker-compose &> /dev/null; then
  echo "❌ Docker Compose not found. Install Docker Compose first."
  exit 1
fi

echo -e "${GREEN}✅ All prerequisites met${NC}"
echo ""

# Show what's starting
echo -e "${BLUE}📊 Services to start:${NC}"
echo "  - PostgreSQL (port 5432)"
echo "  - Backend API (port 3001)"
echo "  - Frontend (port 3000)"
echo ""

# Check if containers are already running
if docker ps | grep -q qrpipay; then
  echo -e "${YELLOW}⚠️  Some QRPiPay containers are already running.${NC}"
  read -p "Stop them first? (y/n) " -n 1 -r
  echo
  if [[ $REPLY =~ ^[Yy]$ ]]; then
    docker-compose down
    echo -e "${GREEN}✅ Stopped${NC}"
  fi
fi

echo ""
echo -e "${YELLOW}🚀 Starting stack...${NC}"
echo ""

# Start with proper logging
docker-compose up --build

echo ""
echo "=========================================="
echo "🛑 Stack stopped"
echo "=========================================="
