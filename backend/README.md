# QRPiPay Backend

API serveur pour QRPiPay - Terminal de paiement Pi Network.

## 🚀 Setup

```bash
npm install
npm run dev
```

## 📚 API Endpoints

### Health
- `GET /health` - Vérifier l'état du serveur

### Payments
- `POST /api/payments` - Créer un paiement
- `GET /api/payments/:paymentId` - Récupérer les détails
- `POST /api/payments/:paymentId/approve` - Approuver
- `POST /api/payments/:paymentId/complete` - Finaliser
- `GET /api/payments/user/:userId` - Paiements utilisateur
- `GET /api/payments` - Tous les paiements (admin)

## 🔧 Développement

### Variables d'environnement
```
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

### Build
```bash
npm run build
npm start
```

## 📊 Jour 2 - Complet

✅ API REST complète
✅ Routes paiements
✅ Validation Zod
✅ CORS & Rate limiting
✅ Logging middleware
✅ Client API frontend
