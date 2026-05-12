# QRPiPay - Accepte Pi en 10 secondes

Application de paiement Pi Network avec QR codes, design premium et sécurité quantique.

## 🚀 Stack Technique

- **Frontend**: React 18 + TypeScript + Vite + TailwindCSS + Framer Motion
- **Backend**: Node.js + Express + TypeScript
- **Crypto**: Post-Quantum Cryptography (CRYSTALS-Kyber)
- **Pi Network**: Pi SDK + PiRC-2 Smart Contracts
- **Database**: PostgreSQL (Jour 3)

## 📁 Structure

```
QRPiPay/
├── frontend/               # React app
│   ├── src/
│   │   ├── pages/         # Login, Dashboard, QR, History
│   │   ├── components/    # UI Components
│   │   ├── services/      # Pi SDK, API Client
│   │   ├── store/         # Auth, Payments (Zustand)
│   │   └── index.css      # Design System
│
├── backend/                # Express API
│   ├── src/
│   │   ├── routes/        # Payments API
│   │   └── server.ts      # Entry point
│
├── database/               # PostgreSQL (Jour 3)
├── contracts/              # Smart Contracts (Jour 4)
├── docker-compose.yml      # Development setup
└── README.md
```

## ⚡ Quick Start

### Frontend
```bash
cd frontend
npm install
npm run dev
# http://localhost:3000
```

### Backend
```bash
cd backend
npm install
npm run dev
# http://localhost:3001
```

## 🎨 Design

✅ Glassmorphism (iOS 15+)
✅ Gradients Pi Purple + Orange
✅ Framer Motion animations
✅ Mobile-first responsive
✅ Premium UI components
✅ Numeric keypad (QR input)

## 📱 Fonctionnalités

- Authentification Pi Network
- Générateur QR codes
- Dashboard paiements
- Historique transactions
- Confirmation succès
- Mode plein écran QR

## 🔐 Sécurité

✅ Mock Pi SDK (dev)
✅ Input validation (Zod)
✅ CORS & Rate limiting
✅ Helmet security headers
✅ State management (Zustand)

## 🗓️ Avancement

**Jour 1** ✅ Fondations
- Structure projet
- Design System
- Composants UI
- Pages Login + Dashboard

**Jour 2** ✅ Core Features
- QR Generator
- Clavier numérique
- Historique paiements
- Confirmation succès
- API Backend
- Routes paiements

**Jour 3** ⏳ Backend complet
- PostgreSQL
- Migrations
- Paiements avancés

**Jour 4** ⏳ Polish + Pi Integration
- Design final
- Smart Contracts
- Testnet
- Soumission

## 📊 Statistiques

- 40+ fichiers créés
- 2500+ lignes de code
- TypeScript 100%
- React Hooks + Zustand
- Tailwind CSS
- Framer Motion animations

## 🚀 Prêt pour Jour 3

Dashboard complet → Backend DB → Paiements avancés
