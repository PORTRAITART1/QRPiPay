# 🚀 DÉPLOYER QRPIPAY SUR RENDER - INSTRUCTIONS DÉTAILLÉES

## 📋 PRÉ-DÉPLOIEMENT VÉRIFICATIONS

✅ Code pushé sur GitHub: https://github.com/PORTRAITART1/QRPiPay
✅ render.yaml configuré avec Dockerfiles
✅ Dockerfiles multi-stage créés
✅ Prisma migrations prêtes
✅ JWT_SECRET généré: `iCV2H5tvGC+wS0QAEaOv4SscXJ1ni5e9tdUzPQ9qLuM=`

---

## 🌐 ÉTAPES RENDER

### ÉTAPE 1: Créer Web Service sur Render

1. Aller à: https://render.com (créer compte si nécessaire)
2. Cliquer "Dashboard" → "New +" → "Web Service"
3. Sélectionner "Public GitHub repository"
4. Chercher et sélectionner: `PORTRAITART1/QRPiPay`
5. Cliquer "Connect"

### ÉTAPE 2: Attendre que Render détecte render.yaml

- Render scanne le repo et trouve `render.yaml`
- Il va créer automatiquement 3 services:
  - **Backend** (qrpipay-backend) - Node.js avec Dockerfile
  - **Frontend** (qrpipay-frontend) - React/Vite avec Dockerfile
  - **Database** (qrpipay-db) - PostgreSQL 15

**⏳ Attendre ~30 secondes pour que Render parse le blueprint**

### ÉTAPE 3: Configuration des variables d'environnement

Avant de cliquer "Deploy", Render va vous demander de configurer les variables env.

#### Pour le BACKEND (qrpipay-backend):

Ajouter les variables manuellement:

| Key | Value | Description |
|-----|-------|-------------|
| `JWT_SECRET` | `iCV2H5tvGC+wS0QAEaOv4SscXJ1ni5e9tdUzPQ9qLuM=` | Secret JWT pour authentification |

**Les autres variables sont auto-configurées:**
- `NODE_ENV` = production (render.yaml)
- `PORT` = 3001 (render.yaml)
- `DATABASE_URL` = Auto-injecté par PostgreSQL (render.yaml)
- `FRONTEND_URL` = https://qrpipay.onrender.com (render.yaml)
- `LOG_LEVEL` = info (render.yaml)

#### Pour le FRONTEND (qrpipay-frontend):

Rien à ajouter - tout est dans render.yaml:
- `VITE_API_URL` = https://qrpipay-backend.onrender.com/api

### ÉTAPE 4: Cliquer "Deploy"

- Render commencera les builds
- **⏳ Durée attendue: 10-15 minutes**
  - Build backend Docker: ~5 min
  - Build frontend Docker: ~3 min
  - Migrations Prisma: ~1 min
  - Démarrage services: ~1 min

### ÉTAPE 5: Monitorer les déploiements

1. Aller au Dashboard Render
2. Cliquer sur chaque service pour voir les logs
3. Chercher pour les erreurs (messages en rouge)

---

## 🔍 LOGS À VÉRIFIER POST-DÉPLOIEMENT

### Backend (qrpipay-backend)

**À chercher dans les logs:**
```
🚀 QRPiPay Backend running on port 3001
📊 Health check: http://localhost:3001/health
📋 API Status: http://localhost:3001/api/status
💳 Payments API: http://localhost:3001/api/payments
📈 Analytics API: http://localhost:3001/api/analytics
📥 Export API: http://localhost:3001/api/export
🗄️  Database: PostgreSQL + Prisma
```

**Erreurs critiques à corriger:**
- `Error: connect ECONNREFUSED` → Base de données non connectée
- `SyntaxError in dist/` → Erreur TypeScript (check build local)
- `Cannot find module` → Dépendance manquante

### Frontend (qrpipay-frontend)

**À chercher dans les logs:**
```
Serving dist/ at port 3000
```

**Erreurs possibles:**
- Build failure → Vérifier npm build local
- Port already in use → Render restart le service

### Database (qrpipay-db)

**À chercher:**
```
accepting connections
```

---

## ✅ TESTS POST-DÉPLOIEMENT

Une fois que les services montrent "Live" (vert):

### 1️⃣ Test Health Check

```bash
curl https://qrpipay-backend.onrender.com/health
```

**Résultat attendu:**
```json
{"status":"ok","timestamp":"2024-05-13T..."}
```

### 2️⃣ Test API Status

```bash
curl https://qrpipay-backend.onrender.com/api/status
```

**Résultat attendu:**
```json
{
  "app":"QRPiPay Backend",
  "version":"1.0.0",
  "status":"running",
  "database":"PostgreSQL + Prisma",
  "timestamp":"2024-05-13T..."
}
```

### 3️⃣ Test Frontend Chargement

```
Ouvrir: https://qrpipay.onrender.com
```

**Résultat attendu:** Page React charge sans erreurs

### 4️⃣ Test Connexion Frontend → Backend

- Ouvrir browser DevTools (F12)
- Network tab
- Rafraîchir la page
- Vérifier requêtes vers `/api/` réussissent

---

## 🆘 DÉPANNAGE

### ❌ Backend stuck on "Build in progress" > 10 minutes

**Solution:**
1. Attendre 15-20 minutes (premier build est plus lent)
2. Si toujours bloqué: Cliquer "Cancel Deploy" et redéployer
3. Vérifier les logs pour erreurs npm/Docker

### ❌ "Database connection refused"

**Solutions:**
1. Attendre 2-3 minutes (PostgreSQL initialise)
2. Vérifier que DATABASE_URL est correctement injecté (voir Render env vars)
3. Relancer le backend service: Settings → Deploy

### ❌ Frontend affiche "Cannot reach API"

**Solutions:**
1. Vérifier `VITE_API_URL` dans frontend Render dashboard
2. Doit être: `https://qrpipay-backend.onrender.com/api`
3. Redéployer frontend: Settings → Deploy

### ❌ "Out of memory" errors

**Solution:** Plans gratuits Render sont limités (512MB)
- Si erreur OOM, utiliser plan payant (+$)
- Ou optimiser les images Docker

### ❌ 404 routes not found

**Solution:** Routes doivent être définies dans backend
- Vérifier que tous les fichiers `src/routes/*.ts` existent
- Vérifier server.ts importe toutes les routes

---

## 📊 MÉTRIQUES À SURVEILLER

Une fois déployé, vérifier dans Render Dashboard:

- **CPU Usage:** Doit être < 50% normal
- **Memory Usage:** Doit être < 300MB (backend)
- **Requests/sec:** Doit augmenter si trafic
- **Error Rate:** Doit rester 0%
- **Build Time:** Doit décroître après premier build

---

## 🔐 SÉCURITÉ - VÉRIFIER

✅ JWT_SECRET configuré (pas de valeur default)
✅ CORS configuré (frontend URL uniquement)
✅ HTTPS utilisé (Render par défaut)
✅ Logs ne contiennent pas d'info sensible
✅ .env.production dans .gitignore
✅ Pas de secrets en dur dans le code

---

## 📞 EN CAS DE PROBLÈME

1. **Vérifier les logs Render** (copier les messages d'erreur)
2. **Vérifier render.yaml est valide** (YAML syntax)
3. **Vérifier package.json version match** (Node.js 20)
4. **Vérifier Dockerfiles sont présents** (backend/frontend)
5. **Vérifier GitHub repo est PUBLIC**

---

## 🎉 SUCCÈS!

Si tous les tests passent:
- ✅ Backend répond sur `/health` et `/api/status`
- ✅ Frontend charge sans erreurs
- ✅ Pas d'erreurs dans logs
- ✅ Base de données connectée

**Votre app QRPiPay est déployée sur Render! 🚀**

---

## 📝 URLs FINALES

- **Frontend:** https://qrpipay.onrender.com
- **Backend API:** https://qrpipay-backend.onrender.com/api
- **Health Check:** https://qrpipay-backend.onrender.com/health
- **API Status:** https://qrpipay-backend.onrender.com/api/status

---

## 🔄 REDÉPLOYER (si changements)

1. Faire changements localement
2. `git push origin master`
3. Render redéploie automatiquement (~ 3-5 min après push)
4. Voir progress dans Render Deploys

---

**Temps total déploiement:** ~15-20 minutes ⏱️
**Status:** ✅ PRÊT POUR RENDER DEPLOYMENT
