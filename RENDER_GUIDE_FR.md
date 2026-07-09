# 🚀 Guide Complet de Déploiement QRPiPay sur Render

## ✅ Prérequis

- Compte GitHub: **portraitart1** ✅ (déjà connecté)
- Repo QRPiPay: **PORTRAITART1/QRPiPay** ✅ (master branch)
- Compte Render: https://render.com ✅

---

## 📋 Étape 1: Créer la Base de Données PostgreSQL

### 1.1 Aller sur Render
```
1. https://render.com/dashboard
2. Cliquer "New +"
3. Sélectionner "PostgreSQL"
```

### 1.2 Configuration PostgreSQL
```
Name: qrpipay-db
Database: qrpipay
User: postgres
Plan: Free
Region: Frankfurt
```

### 1.3 Copier la Connection String
```
📋 Copier DATABASE_URL (ressemble à):
postgresql://qrpipay:xxxx@dpg-xxx.frankfurt.render.db:5432/qrpipay
```

---

## 📋 Étape 2: Déployer le Backend

### 2.1 Créer le Service Web
```
1. Render Dashboard → "New +"
2. Sélectionner "Web Service"
3. Connecter GitHub → PORTRAITART1/QRPiPay
```

### 2.2 Configuration Backend
```
Name: qrpipay-backend
Environment: Node
Region: Frankfurt
Build Command: npm ci --only=production && npx prisma generate
Start Command: npm start
Root Directory: backend
Plan: Free
```

### 2.3 Environment Variables
```
Ajouter les variables suivantes:

✅ NODE_ENV=production
✅ PORT=3001
✅ LOG_LEVEL=info

✅ FRONTEND_URL=https://qrpipay-frontend.onrender.com
✅ CORS_ORIGIN=https://qrpipay-frontend.onrender.com

⚠️ JWT_SECRET=(GÉNÉRER UNE CLÉ SÉCURISÉE)
   Commande: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

⚠️ PI_API_KEY=(VOTRE CLÉ PI NETWORK)
⚠️ PI_APP_ID=(VOTRE APP ID PI)
✅ PI_API_URL=https://api.minepi.com

✅ RATE_LIMIT_MAX_REQUESTS=100
✅ RATE_LIMIT_WINDOW_MS=900000

❌ DATABASE_URL=NE PAS METTRE ICI - voir étape 2.4
```

### 2.4 Connecter la Base de Données
```
1. Dans le formulaire du Backend
2. Chercher "Environment"
3. Cliquer "Add Database"
4. Sélectionner "qrpipay-db"
5. Cela ajoute DATABASE_URL automatiquement
```

### 2.5 Déployer
```
Cliquer "Create Web Service"
⏳ Attendre ~2 minutes
📊 Vérifier les logs
```

### 2.6 Tester le Backend
```bash
curl https://qrpipay-backend.onrender.com/health

✅ Réponse attendue:
{
  "status": "ok",
  "timestamp": "2024-01-19T10:30:45.123Z",
  "uptime": 45.67
}
```

---

## 📋 Étape 3: Déployer le Frontend

### 3.1 Créer le Service Web Frontend
```
1. Render Dashboard → "New +"
2. Sélectionner "Web Service"
3. Connecter GitHub → PORTRAITART1/QRPiPay
```

### 3.2 Configuration Frontend
```
Name: qrpipay-frontend
Environment: Node
Region: Frankfurt
Build Command: npm ci --legacy-peer-deps && npm run build
Start Command: npx serve -s dist -l 3000
Root Directory: frontend
Plan: Free
```

### 3.3 Environment Variables
```
Ajouter la variable:

✅ VITE_API_URL=https://qrpipay-backend.onrender.com/api
```

### 3.4 Déployer
```
Cliquer "Create Web Service"
⏳ Attendre ~3 minutes
📊 Vérifier les logs
```

### 3.5 Tester le Frontend
```
Ouvrir: https://qrpipay-frontend.onrender.com

✅ La page doit charger sans erreurs
✅ Console Dev (F12) ne doit pas avoir d'erreurs CORS
```

---

## ✅ Étape 4: Vérifier le Déploiement

### 4.1 Health Checks
```bash
# Backend
curl https://qrpipay-backend.onrender.com/health
Status: 200 OK ✅

# Frontend  
https://qrpipay-frontend.onrender.com
Page charge ✅
```

### 4.2 Tester l'API
```bash
# Status endpoint
curl https://qrpipay-backend.onrender.com/api/status
```

### 4.3 Vérifier les Logs
```
1. Render Dashboard
2. Cliquer sur qrpipay-backend
3. Aller à "Logs"
4. Chercher des erreurs
```

### 4.4 Tester depuis le Frontend
```
1. Ouvrir https://qrpipay-frontend.onrender.com
2. Ouvrir Console Dev (F12)
3. Aucune erreur CORS ✅
4. Aucune erreur 500 ✅
```

---

## 🆘 Troubleshooting

### Le Backend ne démarre pas

**Erreur: Database connection failed**
```
✅ Solution:
1. Vérifier DATABASE_URL dans Environment
2. Vérifier que la base de données est connectée
3. Redémarrer le service
```

**Erreur: PrismaClient is not found**
```
✅ Solution:
1. Vérifier que "npx prisma generate" est dans buildCommand
2. Rebuild le service
```

### Le Frontend n'affiche pas l'API

**Erreur CORS**
```
✅ Solution:
1. Vérifier VITE_API_URL en production
2. Vérifier CORS_ORIGIN dans Backend
3. Vérifier que FRONTEND_URL = CORS_ORIGIN
```

**API endpoints retournent 500**
```
✅ Solution:
1. Vérifier les logs du Backend
2. Vérifier DATABASE_URL
3. Vérifier JWT_SECRET est défini
```

---

## 📊 Dashboard Render

Après déploiement, tu peux monitorer:

```
Services:
├── qrpipay-db (PostgreSQL)
├── qrpipay-backend (Node.js API)
└── qrpipay-frontend (React Static)

Chaque service a:
- Logs (en temps réel)
- Metrics (CPU, RAM, etc)
- Health Checks
- Redeploy buttons
```

---

## 🔄 Pour Redéployer

### Option 1: Auto-Deploy (Recommandé)
```bash
# Push sur master et Render redéploie automatiquement
git push origin master
```

### Option 2: Manual Redeploy
```
1. Render Dashboard
2. Cliquer sur le service
3. Cliquer "Redeploy"
```

---

## 📈 Performance Tips

```
Render Free Plan:
- Backend: ~512MB RAM
- Frontend: Static serving (rapide)
- Database: ~1GB storage free
- Démarrage auto si inactif > 15 min (cold start)

Pour améliorer:
- Upgrade au plan Starter ($7/mois)
- Ajouter caching Redis
- Optimiser images Docker
```

---

## 🔐 Sécurité

✅ HTTPS automatique
✅ Environment variables sécurisées  
✅ Pas de secrets en hard-code
✅ CORS restrictif
✅ Rate limiting

Vérifier:
```bash
# Certificat HTTPS
curl -I https://qrpipay-backend.onrender.com

# Headers de sécurité
curl -I https://qrpipay-backend.onrender.com | grep -i "x-"
```

---

## 📞 Support

| Issue | Solution |
|-------|----------|
| Service down | Vérifier Render Dashboard |
| API errors | Vérifier backend logs |
| CORS errors | Vérifier env vars FRONTEND_URL |
| Database error | Vérifier PostgreSQL connection |
| Slow responses | Upgrade plan ou optimize |

---

## ✅ Checklist Finale

- [ ] PostgreSQL créé et connecté
- [ ] Backend déployé et sain (health 200)
- [ ] Frontend déployé et charge
- [ ] API répond sans erreurs
- [ ] CORS working (pas d'erreurs)
- [ ] Logs sans erreurs 500
- [ ] JWT_SECRET défini
- [ ] Pi credentials définis (si testé)
- [ ] Health checks passent
- [ ] Performance acceptable

---

**🎉 Prêt pour la production!**

Pour des questions, vérifier:
- PRODUCTION_CHECKLIST.md
- DEPLOYMENT_SUMMARY.md
- render.yaml

Bon déploiement! 🚀
