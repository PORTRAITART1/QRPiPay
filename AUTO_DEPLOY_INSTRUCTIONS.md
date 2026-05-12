# 🤖 AUTOMATIC RENDER DEPLOYMENT SCRIPT

**Ce script va déployer TOUT automatiquement sur Render!**

---

## 🎯 CE QUE LE SCRIPT FAIT AUTOMATIQUEMENT:

```
✅ Crée la database PostgreSQL
✅ Crée le service backend
✅ Crée le site frontend
✅ Configure les variables d'environnement
✅ Lance le déploiement
✅ Tout SANS cliquer! 🤖
```

---

## 🔑 PRÉREQUIS:

Vous avez besoin d'un **Render API Token**

### **Comment l'obtenir (2 minutes):**

1. **Allez à:** https://dashboard.render.com/api-tokens
2. **Connectez-vous** avec votre compte GitHub
3. **Cliquez:** "Create API Token"
4. **Donnez un nom:** "QRPiPay Auto Deploy"
5. **Cliquez:** "Create"
6. **COPIEZ le token** (la longue chaîne de caractères)

---

## 🚀 LANCER LE SCRIPT:

Vous êtes déjà dans le bon dossier:
```
C:\Users\Abdelouhhab Charbak\OneDrive - OFPPT\Bureau\D\QRPiPay
```

### **Tapez cette commande:**

```powershell
powershell -ExecutionPolicy Bypass -File auto_render_deploy.ps1
```

Appuyez Entrée

---

## 📋 LE SCRIPT VA DEMANDER:

```
Enter your Render API Token:
```

**Collez le token que vous avez copié et appuyez Entrée**

---

## ⏳ QUE VOUS ALLEZ VOIR:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 STEP 1: Creating PostgreSQL Database...
✅ PostgreSQL Database created!

🔧 STEP 2: Creating Backend Web Service...
✅ Backend Web Service created!

🎨 STEP 3: Creating Frontend Static Site...
✅ Frontend Static Site created!

╔═══════════════════════════════════════════════╗
║         ✅ DEPLOYMENT LAUNCHED! ✅           ║
║  Services are being created on Render...      ║
║  Wait 5-10 minutes for deployment to complete ║
║  Check status at: https://dashboard.render.com║
╚═══════════════════════════════════════════════╝
```

---

## ✅ APRÈS LE SCRIPT:

1. **Attendez 5-10 minutes**
2. **Allez à:** https://dashboard.render.com
3. **Vous allez voir 3 services:**
   ```
   ✅ qrpipay-db (Live)
   ✅ qrpipay-backend (Live)
   ✅ qrpipay-frontend (Live)
   ```

4. **Vos URLs:**
   ```
   Frontend:  https://qrpipay-frontend.onrender.com
   Backend:   https://qrpipay-backend.onrender.com
   API:       https://qrpipay-backend.onrender.com/api
   ```

---

## 🎬 ALLEZ-Y MAINTENANT!

```
1. Obtenez API Token: https://dashboard.render.com/api-tokens
2. Lancez le script: powershell -ExecutionPolicy Bypass -File auto_render_deploy.ps1
3. Collez le token
4. Attendez 10 minutes
5. Vérifiez: https://dashboard.render.com
6. Célébrez! 🎉
```

---

**Dites-moi quand vous êtes prêt à lancer le script!**
