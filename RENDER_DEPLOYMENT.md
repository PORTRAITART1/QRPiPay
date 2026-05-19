# QRPiPay Render Deployment Guide

## Prérequis
- Compte Render.com
- Dépôt GitHub synchronisé avec QRPiPay
- Variables d'environnement configurées

## Architecture Render
```
Frontend (Static Site) → Render Web Service (Node.js)
Backend (Node.js API) → Render Web Service
PostgreSQL Database → Render PostgreSQL
```

## Étapes de déploiement

### 1. Créer le service Backend

**Settings:**
- Build Command: `npm install --legacy-peer-deps && npm run build || echo done`
- Start Command: `node src/server.js`
- Root Directory: `backend`

**Environment Variables:**
```bash
PORT=3001
NODE_ENV=production
DATABASE_URL=postgresql://[user]:[password]@[postgres-url]:5432/qrpipay
JWT_SECRET=[generate-secure-32-char-key]
FRONTEND_URL=https://qrpipay-frontend.onrender.com
PI_API_KEY=[pi-network-api-key]
PI_API_URL=https://api.minepi.com
PI_APP_ID=[pi-app-id]
RATE_LIMIT_MAX_REQUESTS=100
RATE_LIMIT_WINDOW_MS=900000
LOG_LEVEL=info
```

### 2. Créer le service Frontend

**Settings:**
- Build Command: `npm install && npm run build`
- Publish Directory: `dist`
- Root Directory: `frontend`

**Environment Variables:**
```bash
VITE_API_URL=https://qrpipay-backend.onrender.com/api
```

### 3. Ajouter PostgreSQL

- Create Postgres Database
- Copy DATABASE_URL from config
- Add to Backend env vars

### 4. Activer auto-deploy depuis GitHub

- Connecter GitHub repo
- Activer "Auto-Deploy" sur main branch
- Configure webhooks si besoin

## Commandes utiles

```bash
# Voir les logs
render logs -s [service-id]

# Redéployer
render deploy -s [service-id]

# Vérifier la santé
curl https://[backend-url]/health
curl https://[frontend-url]
```

## Sécurité en Production

✅ HTTPS activé automatiquement par Render
✅ Variables d'environnement sécurisées
✅ Non-root user dans containers
✅ Health checks configurés
✅ Rate limiting activé
✅ Helmet middleware pour headers HTTP
✅ CORS restreint à FRONTEND_URL

## Troubleshooting

**Build échoue:**
- Vérifier les logs Render
- Vérifier lock files synchronisés
- Vérifier environment variables

**API répond 502:**
- `curl https://[backend-url]/health`
- Vérifier DATABASE_URL
- Vérifier JWT_SECRET n'est pas vide

**Frontend 404:**
- Vérifier dist/ est publié
- Vérifier VITE_API_URL pointe au backend

## Coûts

- Web Services: gratuit (300 free hours/month)
- PostgreSQL: gratuit (512MB) ou payant
- Recommandé: upgrade à $7/month pour production
