# ✅ QRPIPAY DEPLOYMENT - LIVE CHECKLIST TRACKER

**Commencez maintenant et cochez chaque étape au fur et à mesure!**

---

## 📋 ÉTAPE 1️⃣: GÉNÉRER JWT_SECRET (2 minutes)

### Actions:
- [ ] Ouvrir Terminal/PowerShell
- [ ] Collez: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
- [ ] Appuyez Entrée
- [ ] Copiez le résultat (64 caractères)
- [ ] Ouvrez bloc-notes
- [ ] Collez avec label: JWT_SECRET

### Résultat attendu:
```
JWT_SECRET: a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2
```

**Status: ☐ PENDANT ☑️ EN COURS ✅ COMPLET**

---

## 📋 ÉTAPE 2️⃣: DASHBOARD RENDER (1 minute)

### Vérifications:
- [ ] Vous êtes sur https://dashboard.render.com
- [ ] Vous voyez votre nom d'utilisateur
- [ ] Vous voyez le bouton "New +"
- [ ] Vous êtes connecté

**Status: ☐ PENDANT ☑️ EN COURS ✅ COMPLET**

---

## 📋 ÉTAPE 3️⃣: CRÉER POSTGRESQL DATABASE (5 minutes)

### Actions:
- [ ] Cliquez "New +" en haut à droite
- [ ] Sélectionnez "PostgreSQL"
- [ ] Remplissez le formulaire:
  - [ ] Name: `qrpipay-db`
  - [ ] Database: `qrpipay`
  - [ ] User: `qrpipay`
  - [ ] Region: Oregon (ou votre région)
  - [ ] Plan: Free
- [ ] Cliquez "Create Database"
- [ ] Attendez 1-2 minutes
- [ ] Quand "Live", cherchez "Connections"
- [ ] Copiez "Internal Database URL"
- [ ] Sauvegardez dans bloc-notes avec label: DATABASE_URL

### Résultat attendu:
```
DATABASE_URL: postgresql://qrpipay:PASSWORD@host.render.com:5432/qrpipay
Status: Live ✅
```

**Status: ☐ PENDANT ☑️ EN COURS ✅ COMPLET**

---

## 📋 ÉTAPE 4️⃣: DÉPLOYER BACKEND (5 minutes)

### Actions:
- [ ] Cliquez "New +"
- [ ] Sélectionnez "Web Service"
- [ ] Trouvez et connectez repo "qrpipay"
- [ ] Cliquez "Connect"

### Configuration:
- [ ] Name: `qrpipay-backend`
- [ ] Environment: `Node`
- [ ] Node Version: `18`
- [ ] Root Directory: `backend`
- [ ] Build Command: `npm install && npm run build`
- [ ] Start Command: `npm start`
- [ ] Plan: `Free`
- [ ] Auto-Deploy: `Yes` (coché)

### Variables d'Environnement (8):
- [ ] NODE_ENV = `production`
- [ ] PORT = `3001`
- [ ] DATABASE_URL = (copié depuis bloc-notes)
- [ ] FRONTEND_URL = `https://qrpipay.onrender.com`
- [ ] JWT_SECRET = (copié depuis bloc-notes)
- [ ] LOG_LEVEL = `info`
- [ ] PI_API_KEY = (vide si vous n'avez pas)
- [ ] PI_WALLET_ADDRESS = (vide si vous n'avez pas)

### Déploiement:
- [ ] Cliquez "Create Web Service"
- [ ] Attendez 2-5 minutes
- [ ] Status: "Live" ✅ en vert
- [ ] Notez URL: `https://qrpipay-backend.onrender.com`

**Status: ☐ PENDANT ☑️ EN COURS ✅ COMPLET**

---

## 📋 ÉTAPE 5️⃣: DÉPLOYER FRONTEND (3 minutes)

### Actions:
- [ ] Cliquez "New +"
- [ ] Sélectionnez "Static Site"
- [ ] Connectez repo "qrpipay"
- [ ] Cliquez "Connect"

### Configuration:
- [ ] Name: `qrpipay-frontend`
- [ ] Root Directory: `frontend`
- [ ] Build Command: `npm install && npm run build`
- [ ] Publish Directory: `dist`
- [ ] Plan: `Free`
- [ ] Auto-Deploy: `Yes` (coché)

### Variables d'Environnement (2):
- [ ] VITE_API_URL = `https://qrpipay-backend.onrender.com/api`
- [ ] VITE_PI_APP_ID = (vide si vous n'avez pas)

### Déploiement:
- [ ] Cliquez "Create Static Site"
- [ ] Attendez 1-2 minutes
- [ ] Status: "Live" ✅ en vert
- [ ] Notez URL: `https://qrpipay-frontend.onrender.com`

**Status: ☐ PENDANT ☑️ EN COURS ✅ COMPLET**

---

## 📋 ÉTAPE 6️⃣: MIGRATIONS DATABASE (3 minutes)

### Actions:
- [ ] Allez à Dashboard
- [ ] Cliquez sur "qrpipay-backend" service
- [ ] Cliquez onglet "Shell"
- [ ] Exécutez Commande 1: `cd database` (Entrée)
- [ ] Exécutez Commande 2: `npm install` (Entrée, attendez)
- [ ] Exécutez Commande 3: `npm run migrate` (Entrée, attendez)

### Résultat attendu:
```
✓ Prisma migration applied successfully
```

### Vérification:
- [ ] Vous voyez le message de succès
- [ ] Pas d'erreurs rouges
- [ ] Status: Success ✅

**Status: ☐ PENDANT ☑️ EN COURS ✅ COMPLET**

---

## 📋 ÉTAPE 7️⃣: TESTER & VÉRIFIER (5 minutes)

### Test Backend:
- [ ] Ouvrez Terminal/PowerShell
- [ ] Exécutez: `curl https://qrpipay-backend.onrender.com/health`
- [ ] Vérifiez réponse: `{"status":"ok",...}`
- [ ] ✅ Backend fonctionne!

### Test Frontend:
- [ ] Ouvrez navigateur (Chrome, Firefox, Edge, Safari)
- [ ] Allez à: `https://qrpipay-frontend.onrender.com`
- [ ] Vérifiez:
  - [ ] Page charge complètement
  - [ ] Login page visible
  - [ ] Couleurs purple/orange visibles
  - [ ] Bouton "Connexion Pi Network" présent
  - [ ] Responsive sur mobile (F12 → mobile icon)

### Console Check:
- [ ] Appuyez F12 (Developer Tools)
- [ ] Allez à "Console" tab
- [ ] Cherchez erreurs rouges
- [ ] ✅ Aucune erreur rouge = OK!

**Status: ☐ PENDANT ☑️ EN COURS ✅ COMPLET**

---

## 🎉 RÉSUMÉ FINAL

### Vos URLs de Production:
```
Frontend:  https://qrpipay-frontend.onrender.com
Backend:   https://qrpipay-backend.onrender.com
API:       https://qrpipay-backend.onrender.com/api
```

### Status Final:
- [ ] Frontend: ✅ LIVE
- [ ] Backend: ✅ LIVE
- [ ] Database: ✅ CONNECTED
- [ ] Migrations: ✅ COMPLETED
- [ ] Application: ✅ RUNNING

---

## 📊 TIMELINE TRACKER

```
T+0 min    ☐ Étape 1: JWT_SECRET ........................ 2 min
T+2 min    ☐ Étape 2: Dashboard ........................ 1 min
T+3 min    ☐ Étape 3: Database ......................... 5 min
T+8 min    ☐ Étape 4: Backend .......................... 5 min
T+13 min   ☐ Étape 5: Frontend ......................... 3 min
T+16 min   ☐ Étape 6: Migrations ....................... 3 min
T+19 min   ☐ Étape 7: Test ............................ 5 min
T+24 min   ✅ 🎉 APP IS LIVE! 🎉 ..................... 0 min
```

---

## ⚠️ PROBLÈMES? CONSULTEZ:

### Frontend blank page:
- [ ] F12 → Console tab
- [ ] Cherchez erreurs rouges
- [ ] Vérifiez VITE_API_URL dans env vars
- [ ] Clear cache (Ctrl+Shift+Del)
- [ ] Rafraîchissez (F5)

### Backend build fails:
- [ ] qrpipay-backend → Logs tab
- [ ] Lisez l'erreur
- [ ] Corrigez dans GitHub
- [ ] Render redéploie auto

### Database connection error:
- [ ] Vérifiez DATABASE_URL
- [ ] Utilisez INTERNAL URL
- [ ] Vérifiez user/password
- [ ] Database name: qrpipay

### CORS errors:
- [ ] Vérifiez FRONTEND_URL dans backend
- [ ] Vérifiez VITE_API_URL dans frontend
- [ ] Attendez redéploiement
- [ ] Rafraîchissez page

---

## ✅ CHECKLIST COMPLÈTE!

Quand tous les ☐ sont ✅:

```
🎊 FÉLICITATIONS! 🎊

Votre QRPiPay est LIVE sur Internet!
Frontend:  https://qrpipay-frontend.onrender.com
Backend:   https://qrpipay-backend.onrender.com

Prochaines étapes:
✅ Partager avec amis
✅ Tester sur Pi Browser
✅ Soumettre à Pi Network
✅ Collecter feedback

Vous avez réussi! Bravo! 💜✨
```

---

**Commencez maintenant! Vous êtes prêt! 🚀**
