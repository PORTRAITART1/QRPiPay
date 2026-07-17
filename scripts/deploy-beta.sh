#!/bin/bash
# 🚀 Beta Program Deployment Script
# Run this after pulling the latest code

echo "🧪 QRPiPay Beta Deployment"
echo "================================"

# Check Node version
echo "📦 Checking Node.js..."
node --version

# Install dependencies (backend)
echo "📦 Installing backend dependencies..."
cd backend
npm install
echo "✅ Backend dependencies installed"

# Generate Prisma client
echo "🗄️  Generating Prisma client..."
npx prisma generate
echo "✅ Prisma client generated"

# Run migrations
echo "🗄️  Running database migrations..."
npx prisma migrate deploy
echo "✅ Database migrations complete"

# Seed database with beta data (optional)
if [ "$1" = "--seed" ]; then
  echo "🌱 Seeding database..."
  npx prisma db seed
  echo "✅ Database seeded"
fi

# Go back to root
cd ..

# Install dependencies (frontend)
echo "📦 Installing frontend dependencies..."
cd frontend
npm install
echo "✅ Frontend dependencies installed"

# Build frontend
echo "🏗️  Building frontend..."
npm run build
echo "✅ Frontend built"

cd ..

echo ""
echo "✅ Beta program deployment complete!"
echo ""
echo "📊 Next steps:"
echo "1. Start backend: cd backend && npm run dev"
echo "2. Start frontend: cd frontend && npm start"
echo "3. Open http://localhost:3000/beta to test"
echo "4. Open http://localhost:3000/beta/admin to manage applications"
echo ""
echo "🚀 Ready to recruit beta testers!"
