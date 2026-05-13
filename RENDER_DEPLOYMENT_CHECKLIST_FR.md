# 🚀 CHECKLIST DE DÉPLOIEMENT RENDER

## ✅ PHASE 1: PRÉPARATION (À FAIRE MAINTENANT)

### Fichiers créés:
- [x] backend/Dockerfile
- [x] frontend/Dockerfile
- [x] backend/.dockerignore
- [x] frontend/.dockerignore
- [x] backend/.env.production
- [x] frontend/.env.production
- [x] prepare-render.sh

### À vérifier:
- [ ] Tous les fichiers de routes existent (payments, analytics, users, export)
- [ ] Prisma schema complet (database/prisma/schema.prisma)
- [ ] Prisma client configuré (backend/src/lib/prisma.ts)

---

## 🔧 PHASE 2: CONFIGURATION LOCALE

### Étape 1: Build & Test Local
```bash
# Test build backend
cd backend
npm install
npm run build

# Test build frontend
cd ../frontend
npm install
npm run build

# Retour à la racine
cd ..
```

### Étape 2: Test Docker Local (optionnel mais recommandé)
```bash
docker-compose up
# Attendre que tout soit prêt
# Tester: http://localhost:3000 et http://localhost:3001/health
# Ctrl+C pour arrêter
```

---

## 📤 PHASE 3: GITHUB

### Étape 1: Commit & Push
```bash
git add .
git commit -m "Add Dockerfiles and deployment configuration for Render"
git push origin master
```

### Étape 2: Vérifier que GitHub a le repository PUBLIC
- Aller sur: https://github.com/PORTRAITART1/QRPiPay
- Vérifier que c'est PUBLIC (Settings → Visibility)

---

## 🌐 PHASE 4: DÉPLOIEMENT SUR RENDER

### Étape 1: Créer le Web Service
1. Aller sur: https://render.com
2. Se connecter / créer compte
3. Cliquer "New +" → "Web Service"

### Étape 2: Connecter le Repository
1. Sélectionner "Public GitHub repository"
2. Entrer URL: `https://github.com/PORTRAITART1/QRPiPay.git`
3. Cliquer "Deploy"

### Étape 3: Configurer les variables d'environnement
Render créera automatiquement une base de données PostgreSQL.

Ajouter les variables d'environnement manuellement:

**Pour le backend (qrpipay-backend):**
```
JWT_SECRET_KEY = <générer une clé sécurisée: openssl rand -base64 32>
LOG_LEVEL = info
```

**Pour le frontend (qrpipay-frontend):**
```
VITE_ENV = production
```

Note: `DATABASE_URL`, `PORT`, `FRONTEND_URL`, `VITE_API_URL` sont définis dans render.yaml

### Étape 4: Laisser Render déployer
- Render lira automatiquement `render.yaml`
- Il créera 3 services: backend, frontend, database
- Attendre ~5-10 minutes pour la compilation

---

## ✨ PHASE 5: VÉRIFICATION POST-DÉPLOIEMENT

### Étape 1: Vérifier les logs
1. Aller dans Render Dashboard
2. Cliquer sur chaque service (backend, frontend, database)
3. Vérifier les logs - pas d'erreur critique

### Étape 2: Tester les endpoints
```bash
# Health check backend
curl https://qrpipay-backend.onrender.com/health

# API status
curl https://qrpipay-backend.onrender.com/api/status

# Frontend
https://qrpipay.onrender.com
```

### Étape 3: Tester le flux complet
1. Accéder au frontend: https://qrpipay.onrender.com
2. Créer un utilisateur
3. Générer un QR code
4. Vérifier que l'API répond correctement

### Étape 4: En cas d'erreur
- Vérifier logs backend/frontend dans Render
- Vérifier logs database (PostgreSQL)
- Vérifier variables d'environnement
- Vérifier que render.yaml est au bon endroit (root du repo)

---

## 🎯 PROCHAINES ÉTAPES (Après déploiement réussi)

- [ ] Tester authentification Pi Network
- [ ] Tester paiements (si intégration Pi)
- [ ] Configurer domaine personnalisé (optionnel)
- [ ] Ajouter monitoring/alertes
- [ ] Configurer CI/CD GitHub Actions

---

## 🆘 DÉPANNAGE RAPIDE

| Problème | Solution |
|----------|----------|
| `render.yaml not found` | Vérifier que le fichier est à la racine du repo |
| `npm ERR! FATAL: Cannot find module` | Vérifier que tous les dependencies sont dans package.json |
| `database connection failed` | Vérifier DATABASE_URL dans env vars de Render |
| `Port already in use` | Le PORT doit être celui défini dans render.yaml (3001 backend, 3000 frontend) |
| `Cannot find dist folder` | Vérifier que `npm run build` marche localement d'abord |

---

## 📞 CONTACTS / RESSOURCES

- Docs Render: https://render.com/docs
- Docker Docs: https://docs.docker.com
- Prisma: https://www.prisma.io/docs
- Pi Network: https://developers.pi-network.io

**Status du déploiement:** Prêt pour Render ✅
