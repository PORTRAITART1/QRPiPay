#!/bin/bash

# QRPiPay Render Deployment Configuration
# Automated setup for Render.com deployment

echo "🚀 QRPiPay Render Deployment Setup"
echo "===================================="
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Check if .env exists
if [ ! -f "backend/.env" ]; then
    echo -e "${YELLOW}⚠️  backend/.env not found. Creating from example...${NC}"
    cp backend/.env.example backend/.env
    echo -e "${YELLOW}⚠️  Please update backend/.env with production values${NC}"
fi

echo ""
echo -e "${BLUE}📋 Step 1: Verify Prerequisites${NC}"
echo "======================================"
echo ""

# Check Node version
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo -e "${GREEN}✅ Node.js: $NODE_VERSION${NC}"
else
    echo "❌ Node.js not found"
    exit 1
fi

# Check npm version
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    echo -e "${GREEN}✅ npm: $NPM_VERSION${NC}"
else
    echo "❌ npm not found"
    exit 1
fi

# Check Git
if command -v git &> /dev/null; then
    GIT_VERSION=$(git --version)
    echo -e "${GREEN}✅ Git: $GIT_VERSION${NC}"
else
    echo "❌ Git not found"
    exit 1
fi

echo ""
echo -e "${BLUE}📦 Step 2: Install Dependencies${NC}"
echo "===================================="
echo ""

echo "Installing backend dependencies..."
cd backend
npm install
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Backend dependencies installed${NC}"
else
    echo "❌ Failed to install backend dependencies"
    exit 1
fi
cd ..

echo ""
echo "Installing frontend dependencies..."
cd frontend
npm install
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Frontend dependencies installed${NC}"
else
    echo "❌ Failed to install frontend dependencies"
    exit 1
fi
cd ..

echo ""
echo -e "${BLUE}🏗️  Step 3: Build for Production${NC}"
echo "===================================="
echo ""

echo "Building backend..."
cd backend
npm run build
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Backend build successful${NC}"
else
    echo "❌ Backend build failed"
    exit 1
fi
cd ..

echo ""
echo "Building frontend..."
cd frontend
npm run build
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Frontend build successful${NC}"
else
    echo "❌ Frontend build failed"
    exit 1
fi
cd ..

echo ""
echo -e "${BLUE}🔧 Step 4: Create Render Configuration Files${NC}"
echo "=============================================="
echo ""

# Create render.yaml
cat > render.yaml << 'EOF'
services:
  - type: web
    name: qrpipay-backend
    env: node
    plan: free
    buildCommand: npm install --prefix backend && npm run build --prefix backend
    startCommand: npm start --prefix backend
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

  - type: static
    name: qrpipay-frontend
    buildCommand: npm install --prefix frontend && npm run build --prefix frontend
    staticPublishPath: frontend/dist
    envVars:
      - key: VITE_API_URL
        value: https://qrpipay-backend.onrender.com/api
      - key: VITE_PI_APP_ID
        sync: false

databases:
  - name: qrpipay-db
    databaseName: qrpipay
    user: qrpipay
    plan: free
    version: 15
EOF

echo -e "${GREEN}✅ Created render.yaml${NC}"

# Create .render/healthcheck.js
mkdir -p .render
cat > .render/healthcheck.js << 'EOF'
// Health check for Render
// Ensures service is running

const http = require('http');

const options = {
  hostname: 'localhost',
  port: process.env.PORT || 3001,
  path: '/health',
  method: 'GET',
  timeout: 5000
};

const request = http.request(options, (response) => {
  if (response.statusCode === 200) {
    process.exit(0);
  } else {
    process.exit(1);
  }
});

request.on('error', () => {
  process.exit(1);
});

request.end();
EOF

echo -e "${GREEN}✅ Created health check script${NC}"

echo ""
echo -e "${BLUE}📝 Step 5: Git Configuration${NC}"
echo "=============================="
echo ""

# Check if .gitignore is configured
if grep -q "node_modules" .gitignore; then
    echo -e "${GREEN}✅ .gitignore configured${NC}"
else
    echo "⚠️  Adding standard entries to .gitignore"
    echo "node_modules/" >> .gitignore
    echo ".env" >> .gitignore
    echo "dist/" >> .gitignore
fi

echo ""
echo -e "${BLUE}✅ Step 6: Summary${NC}"
echo "=================="
echo ""

echo -e "${GREEN}✅ QRPiPay is ready for Render deployment!${NC}"
echo ""
echo "Next steps:"
echo "1. Update backend/.env with production values"
echo "2. Commit and push to GitHub:"
echo "   git add ."
echo "   git commit -m 'Prepare for Render deployment'"
echo "   git push origin main"
echo ""
echo "3. On Render.com:"
echo "   - Connect GitHub repository"
echo "   - Create Web Service for backend"
echo "   - Create Static Site for frontend"
echo "   - Create PostgreSQL database"
echo "   - Configure environment variables"
echo "   - Deploy"
echo ""
echo "4. Verify deployment:"
echo "   - Check backend health: https://qrpipay-backend.onrender.com/health"
echo "   - Visit frontend: https://qrpipay.onrender.com"
echo ""
echo "📚 Full guide: docs/RENDER_DEPLOYMENT.md"
echo ""
