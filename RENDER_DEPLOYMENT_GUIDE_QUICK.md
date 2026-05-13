# 🚀 QRPiPay - COMMANDES ESSENTIELLES POUR RENDER

## 📝 AVANT TOUT: Générer un JWT_SECRET sécurisé

### Sur macOS/Linux:
```bash
openssl rand -base64 32
```

### Sur Windows (PowerShell):
```powershell
[Convert]::ToBase64String((1..32 | ForEach-Object {Get-Random -Maximum 256})) -join ''
```

### Alternative rapide (tous les OS):
Utiliser: https://generate-random.org/ ou https://www.uuidgenerator.net/

**Copier la valeur - vous en aurez besoin pour Render!**

---

## 🔧 COMMANDES LOCALES (avant déploiement)

### 1. Installer les dépendances
```bash
cd backend && npm install && cd ..
cd frontend && npm install && cd ..
```

### 2. Build backend
```bash
cd backend
npm run build
# Vérifie que tout compile sans erreur
cd ..
```

### 3. Build frontend
```bash
cd frontend
npm run build
# Vérifie que la build Vite réussit
cd ..
```

### 4. Test local avec Docker (optionnel)
```bash
docker-compose up
# Attendre que les services soient prêts
# Tester: http://localhost:3000 (frontend) et http://localhost:3001/health (backend)
# Ctrl+C pour arrêter
```

---

## 📤 GITHUB: Préparer pour Render

### 1. Ajouter et committer les fichiers
```bash
git add .
git commit -m "Add Dockerfiles and deployment configuration for Render"
```

### 2. Pousser sur GitHub
```bash
git push origin master
```

### 3. Vérifier que le repo est PUBLIC
```
https://github.com/PORTRAITART1/QRPiPay
Settings → Visibility → Public
```

---

## 🌐 RENDER: Déployer

### Étape 1: Créer Web Service
```
https://render.com/dashboard
→ New + → Web Service
```

### Étape 2: Connecter GitHub
```
Sélectionner: Public GitHub repository
Entrer URL: https://github.com/PORTRAITART1/QRPiPay.git
Cliquer: Deploy
```

### Étape 3: Attendre que Render détecte render.yaml
Render crée automatiquement:
- Backend Web Service (qrpipay-backend)
- Frontend Static Site (qrpipay-frontend)
- PostgreSQL Database (qrpipay-db)

### Étape 4: Ajouter variables d'environnement

**Pour Backend (qrpipay-backend):**
```
JWT_SECRET_KEY = [VOTRE_JTW_SECRET_GÉNÉRÉ]
LOG_LEVEL = info
```

**Pour Frontend (qrpipay-frontend):**
```
VITE_ENV = production
```

⚠️ Ne pas ajouter:
- DATABASE_URL (Render l'injecte automatiquement)
- PORT (render.yaml le définit)
- FRONTEND_URL (render.yaml le définit)

### Étape 5: Laisser déployer
- Attendre 5-10 minutes
- Vérifier les logs pour les erreurs

---

## ✅ VÉRIFIER POST-DÉPLOIEMENT

### 1. Vérifier les services
```bash
# Remplacer par vos URLs Render réelles
curl https://qrpipay-backend.onrender.com/health
curl https://qrpipay-backend.onrender.com/api/status
```

### 2. Vérifier le frontend
```
https://qrpipay.onrender.com
```

### 3. Consulter les logs Render
```
Render Dashboard → Service → Logs
Chercher les erreurs "ERROR" ou "FATAL"
```

### 4. Tester la base de données
```bash
# Depuis backend logs, vérifier:
"🚀 QRPiPay Backend running on port 3001"
"🗄️  Database: PostgreSQL + Prisma"
```

---

## 🆘 DÉPANNAGE RAPIDE

### ❌ Erreur: "render.yaml not found"
**Solution:** Vérifier que render.yaml est à la racine du repo (pas dans un dossier)

### ❌ Erreur: "Cannot find module '@prisma/client'"
**Solution:** Vérifier que Dockerfile backend exécute `npx prisma generate` après npm install

### ❌ Erreur: "database connection failed"
**Solution:** 
1. Vérifier DATABASE_URL dans Render env vars
2. Attendre que PostgreSQL soit complètement prêt (2-3 min)
3. Vérifier logs database dans Render

### ❌ Erreur: "EADDRINUSE: address already in use :::3001"
**Solution:** Le PORT doit être celui de render.yaml (3001). Vérifier que PORT env var n'override pas.

### ❌ Frontend affiche "Cannot reach API"
**Solution:** Vérifier VITE_API_URL pointe vers backend URL Render réelle

---

## 🔗 URLS FINALES

Une fois déployé:
- **Frontend:** https://qrpipay.onrender.com
- **Backend API:** https://qrpipay-backend.onrender.com/api
- **Health Check:** https://qrpipay-backend.onrender.com/health
- **API Status:** https://qrpipay-backend.onrender.com/api/status

---

## 📚 RESSOURCES

- [Render Documentation](https://render.com/docs)
- [Render Deploy with Docker](https://render.com/docs/deploy-docker-image)
- [render.yaml spec](https://render.com/docs/blueprint-spec)
- [Prisma Database URL](https://www.prisma.io/docs/reference/database-reference/connection-urls/postgresql)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)

---

## ⏱️ TEMPS ESTIMÉ

- Build local: 5-10 minutes
- Push GitHub: 1 minute
- Render deploy: 5-15 minutes (première fois plus lent)
- **Total: ~20 minutes**

---

**Status:** ✅ Prêt pour Render
**Dernière mise à jour:** 2024
