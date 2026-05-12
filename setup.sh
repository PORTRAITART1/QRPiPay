#!/bin/bash

# QRPiPay Setup Script
# Installe toutes les dépendances

echo "🚀 QRPiPay Setup"
echo "==============="

# Frontend
echo -e "\n📦 Installing Frontend dependencies..."
cd frontend
npm install
cd ..

# Backend
echo -e "\n📦 Installing Backend dependencies..."
cd backend
npm install
cd ..

echo -e "\n✅ Setup complete!"
echo -e "\n🚀 To start development:"
echo -e "  Frontend: cd frontend && npm run dev"
echo -e "  Backend:  cd backend && npm run dev"
