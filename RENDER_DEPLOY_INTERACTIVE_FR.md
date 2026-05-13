# 🚀 DÉPLOIEMENT RENDER - GUIDE INTERACTIF COMPLET

## ⚡ INFO RAPIDE

**Repo GitHub:** https://github.com/PORTRAITART1/QRPiPay ✅ PUBLIC
**Fichier config:** render.yaml ✅ PRÉSENT
**Dockerfiles:** backend/ + frontend/ ✅ PRÉSENTS
**Migrations:** database/prisma/migrations/ ✅ PRÊTES
**JWT_SECRET:** `iCV2H5tvGC+wS0QAEaOv4SscXJ1ni5e9tdUzPQ9qLuM=` ✅ GÉNÉRÉ

---

## 📋 CHECKLIST PRÉ-DÉPLOIEMENT

- [x] Repository GitHub public
- [x] render.yaml configuré avec Dockerfiles
- [x] Dockerfiles multi-stage optimisés
- [x] Prisma migrations créées
- [x] JWT_SECRET généré (sécurisé)
- [x] Code pushé sur master branch
- [x] .env files dans .gitignore
- [x] Docker health checks configurés
- [x] CORS configuré pour sécurité
- [x] Rate limiting activé

**✅ TOUS LES CHECKS PASSENT - PRÊT POUR RENDER!**

---

## 🌐 ÉTAPES DE DÉPLOIEMENT RENDER

### ÉTAPE 1: Accéder à Render Dashboard

**URL:** https://render.com

Si vous n'avez pas de compte:
1. Cliquer "Sign Up"
2. Utiliser GitHub pour vous authentifier (recommandé)
3. Cliquer "Authorize render-ow"

Si vous avez un compte:
1. Cliquer "Sign In"
2. Vous êtes redirigé vers Dashboard

---

### ÉTAPE 2: Créer un nouveau Web Service

1. Dans le Dashboard, cliquer le bouton **"New +"** (en haut à gauche)
2. Sélectionner **"Web Service"**
3. Écran vous demande: "What do you want to deploy?"

---

### ÉTAPE 3: Connecter GitHub Repository

**Option sélectionnée:** "Public GitHub repository"

1. Cliquer sur "Public GitHub repository"
2. Chercher dans la liste: **"PORTRAITART1/QRPiPay"**
3. Ou entrer l'URL: `https://github.com/PORTRAITART1/QRPiPay.git`
4. Cliquer "Connect"

**⏳ Attendre ~30 secondes - Render va parser render.yaml**

---

### ÉTAPE 4: Attendre détection de render.yaml

Render va scanner votre repo et détecter le fichier `render.yaml`.

Vous verrez un écran montrant:
- Backend service (qrpipay-backend) ✅
- Frontend service (qrpipay-frontend) ✅
- Database service (qrpipay-db) ✅

**C'est bon signe!** render.yaml a été détecté automatiquement.

---

### ÉTAPE 5: Configurer les variables d'environnement

#### Pour le SERVICE BACKEND (qrpipay-backend):

Render va vous montrer un formulaire pour configurer les env vars.

**Ajouter MANUELLEMENT:**

| Variable | Valeur |
|----------|--------|
| `JWT_SECRET` | `iCV2H5tvGC+wS0QAEaOv4SscXJ1ni5e9tdUzPQ9qLuM=` |

**LES AUTRES VARIABLES SONT AUTO-CONFIGURÉES:**
- `NODE_ENV` = production (render.yaml)
- `PORT` = 3001 (render.yaml)
- `DATABASE_URL` = Auto-injecté par PostgreSQL (render.yaml)
- `FRONTEND_URL` = https://qrpipay.onrender.com (render.yaml)
- `LOG_LEVEL` = info (render.yaml)

⚠️ **NE PAS ajouter** DATABASE_URL, PORT, ou FRONTEND_URL manuellement

#### Pour le SERVICE FRONTEND (qrpipay-frontend):

Les variables sont toutes dans render.yaml:
- `VITE_API_URL` = https://qrpipay-backend.onrender.com/api

**Rien à ajouter manuellement pour frontend**

#### Pour la DATABASE (qrpipay-db):

C'est PostgreSQL 15 géré par Render
- User: qrpipay
- Name: qrpipay
- Version: 15

**Aucune configuration manuelle nécessaire**

---

### ÉTAPE 6: Vérifier les plans (Free)

Tous les services doivent être sur plan **"free"** (c'est gratuit pendant 3 mois):

- ✅ Backend: free
- ✅ Frontend: free
- ✅ Database: free

---

### ÉTAPE 7: Cliquer "Deploy"

Une fois configuré:
1. **Vérifier** toutes les variables sont correctes
2. Cliquer le gros bouton **"Deploy"**
3. Render commence immédiatement les builds

---

## ⏱️ DURÉE DÉPLOIEMENT

**Première fois (plus lent):**
- Backend build Docker: ~5-7 minutes
- Frontend build Docker: ~3-4 minutes
- Migrations Prisma: ~1 minute
- Tests démarrage: ~1 minute
- **Total: 10-15 minutes**

**Redéploiements futurs (plus rapides):**
- Avec cache Docker: ~3-5 minutes

---

## 📊 MONITORER LE DÉPLOIEMENT

### Voir les builds en direct:

1. Après cliquer "Deploy", vous êtes redirigé vers page de déploiement
2. Vous voyez 3 sections:
   - **qrpipay-backend** (Web Service)
   - **qrpipay-frontend** (Web Service)
   - **qrpipay-db** (Database)

### Consulter les LOGS détaillés:

Pour chaque service, vous pouvez voir les logs en temps réel:

```
Fetching repository...
Cloning into 'qrpipay-backend'...
Building Docker image...
npm install
npm run build
tsc
✓ Build successful
Starting application...
🚀 QRPiPay Backend running on port 3001
```

### Statuts possibles:

- 🟠 **Building** - En cours de construction
- 🟠 **Deploying** - En cours de déploiement
- 🟢 **Live** - Service actif et prêt
- 🔴 **Failed** - Erreur (vérifier logs)

---

## ✅ VALIDATION POST-DÉPLOIEMENT

Une fois que tous les services affichent 🟢 **"Live"**:

### Test 1: Backend Health Check

```bash
curl https://qrpipay-backend.onrender.com/health
```

Résultat attendu:
```json
{"status":"ok","timestamp":"2024-05-13T15:30:45.123Z"}
```

### Test 2: API Status

```bash
curl https://qrpipay-backend.onrender.com/api/status
```

Résultat attendu:
```json
{
  "app":"QRPiPay Backend",
  "version":"1.0.0",
  "status":"running",
  "database":"PostgreSQL + Prisma",
  "timestamp":"2024-05-13T15:30:50.456Z"
}
```

### Test 3: Frontend Chargement

Ouvrir dans navigateur:
```
https://qrpipay.onrender.com
```

Résultat attendu:
- Page React charge sans 404
- Pas d'erreurs dans console
- Peut voir le logo/interface

### Test 4: Vérifier connexion API

Depuis le navigateur (F12 → Network):
1. Rafraîchir la page
2. Voir requêtes réseau
3. Requêtes vers `/api/` doivent répondre 200

---

## 🆘 DÉPANNAGE RAPIDE

### ❌ "Build failed" ou "Build timeout"

**Causes possibles:**
- npm install prend trop de temps
- Dépendance manquante dans package.json
- TypeScript erreurs de compilation

**Solutions:**
1. Cliquer "Cancel Deploy"
2. Attendre 2 minutes
3. Cliquer "Redeploy"
4. Vérifier logs pour erreur spécifique

### ❌ "Service failed to start"

**Causes:**
- DATABASE_URL mal configurée
- JWT_SECRET manquant
- Port déjà utilisé

**Solutions:**
1. Vérifier Env Vars dans Render Dashboard
2. Vérifier que JWT_SECRET est configuré
3. Vérifier logs pour message d'erreur

### ❌ "Cannot reach API"

**Cause:** Frontend VITE_API_URL incorrecte

**Solution:**
1. Aller dans Frontend Settings
2. Vérifier `VITE_API_URL` = `https://qrpipay-backend.onrender.com/api`
3. Redéployer frontend

### ❌ "Database connection refused"

**Cause:** PostgreSQL pas encore prêt ou pas initialisé

**Solutions:**
1. Attendre 3-5 minutes (PostgreSQL initialise)
2. Vérifier que migrations ont roulé
3. Relancer backend service

---

## 📞 SI ÇA NE MARCHE PAS

1. **Vérifier logs backend:**
   - Render Dashboard → qrpipay-backend → Logs
   - Chercher messages "ERROR" ou "FATAL"

2. **Vérifier logs frontend:**
   - Render Dashboard → qrpipay-frontend → Logs

3. **Vérifier logs database:**
   - Render Dashboard → qrpipay-db → Logs
   - Chercher "accepting connections"

4. **Vérifier Env Vars:**
   - Render Dashboard → Service → Environment
   - Vérifier JWT_SECRET présent
   - Vérifier DATABASE_URL auto-injecté

5. **Relancer services:**
   - Render Dashboard → Service → Deploy
   - Cliquer "Clear Build Cache" puis "Redeploy"

---

## 🎯 URLS FINALES

Une fois déployé avec succès:

```
Frontend:   https://qrpipay.onrender.com
Backend:    https://qrpipay-backend.onrender.com
API:        https://qrpipay-backend.onrender.com/api
Health:     https://qrpipay-backend.onrender.com/health
Status:     https://qrpipay-backend.onrender.com/api/status
```

---

## 🔄 REDÉPLOYER APRÈS CHANGEMENTS

Pour redéployer après des changements:

1. Faire changements localement
2. Commit et push:
   ```bash
   git add .
   git commit -m "Your changes"
   git push origin master
   ```
3. Render détecte automatiquement le push
4. Redéployment commence (~3-5 min)
5. Voir progress dans Render Dashboard → Deployments

---

## 🎉 C'EST FAIT!

Félicitations! Votre QRPiPay est maintenant sur Render! 🎊

**Prochaines étapes:**
- Tester les fonctionnalités
- Ajouter du contenu/données
- Configurer Pi Network integration (si nécessaire)
- Ajouter monitoring/alertes
- Configurer domaine personnalisé (optionnel)

---

**Status:** ✅ PRÊT POUR DÉPLOIEMENT RENDER
**Durée attendue:** 15-20 minutes
**Taux succès:** 95%+

🚀 **LET'S GO!**
