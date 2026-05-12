# 🚀 QRPIPAY DEPLOYMENT CHECKLIST - RENDER.COM

## ✅ PRE-DEPLOYMENT CHECKLIST

### GitHub Repository Ready
- [x] All code committed to main branch
- [x] render.yaml configured
- [x] render-deploy.sh ready
- [x] .gitignore updated
- [x] No secrets in code

### Code Quality
- [x] Backend builds successfully
- [x] Frontend builds successfully
- [x] Environment variables documented
- [x] package.json dependencies complete
- [x] Dockerfile ready (if needed)

---

## 🎯 DEPLOYMENT STEPS

### STEP 1: Final Git Push
```bash
cd D:\QRPiPay
git status  # Should be clean
git push origin main
```

### STEP 2: Create Render Account
- Go to: https://render.com
- Sign up with GitHub account
- Authorize Render to access your repos
- Accept permissions

### STEP 3: Create PostgreSQL Database
**In Render Dashboard:**
1. Click **New +**
2. Select **PostgreSQL**
3. Fill in:
   - Name: `qrpipay-db`
   - Database: `qrpipay`
   - User: `qrpipay`
   - Plan: **Free**
   - Region: **Oregon** (or your region)
4. Click **Create Database**
5. **IMPORTANT**: Copy the **Internal Database URL** (starts with postgresql://)
   - Save this! You'll need it in Step 5

### STEP 4: Create Backend Web Service
**In Render Dashboard:**
1. Click **New +** → **Web Service**
2. Connect GitHub repository (select qrpipay)
3. Configure:
   - **Name**: `qrpipay-backend`
   - **Root Directory**: `backend`
   - **Environment**: Node
   - **Node Version**: 18 (or latest)
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Plan**: Free
   - **Auto-deploy**: Yes

4. Add Environment Variables (click **Add Environment Variable**):
   ```
   NODE_ENV = production
   PORT = 3001
   FRONTEND_URL = https://qrpipay.onrender.com
   JWT_SECRET = [GENERATE BELOW]
   LOG_LEVEL = info
   PI_API_KEY = [YOUR_PI_API_KEY]
   PI_WALLET_ADDRESS = [YOUR_PI_WALLET]
   DATABASE_URL = [PASTE FROM STEP 3]
   ```

5. Generate JWT_SECRET:
   ```bash
   # Open terminal and run:
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   # Copy output and paste into JWT_SECRET field
   ```

6. Click **Create Web Service**
7. Wait for deployment (2-5 minutes)

### STEP 5: Create Frontend Static Site
**In Render Dashboard:**
1. Click **New +** → **Static Site**
2. Connect GitHub repository (select qrpipay)
3. Configure:
   - **Name**: `qrpipay-frontend`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
   - **Plan**: Free
   - **Auto-deploy**: Yes

4. Add Environment Variables:
   ```
   VITE_API_URL = https://qrpipay-backend.onrender.com/api
   VITE_PI_APP_ID = [YOUR_PI_APP_ID]
   ```

5. Click **Create Static Site**
6. Wait for deployment (1-2 minutes)

### STEP 6: Run Database Migrations
**Option A: Via Render Shell (Recommended)**
1. Go to **qrpipay-backend** service
2. Click **Shell** tab
3. Run commands:
   ```bash
   cd database
   npm install
   npm run migrate
   # Optional: npm run seed (for test data)
   ```

**Option B: Skip (if you prefer)**
- Database tables will be created on first use by Prisma

### STEP 7: Verify Deployment
**Test Backend:**
```bash
# In terminal:
curl https://qrpipay-backend.onrender.com/health

# Should return:
# {"status":"ok","timestamp":"2025-12-12T..."}
```

**Test Frontend:**
- Visit: https://qrpipay.onrender.com
- Should see login page
- Should have purple/orange theme
- Should be responsive

**Test Authentication:**
1. Click "Connexion Pi Network" button
2. Should redirect to Pi authentication
3. After login, should see dashboard

---

## 🔗 POST-DEPLOYMENT SETUP

### Configure Custom Domains (Optional)
**For Backend API:**
1. qrpipay-backend → Settings → Custom Domain
2. Enter: `api.qrpipay.com`
3. Note the CNAME target
4. In your DNS provider, add CNAME record:
   ```
   api.qrpipay.com CNAME abc123.onrender.com
   ```

**For Frontend:**
1. qrpipay-frontend → Settings → Custom Domain
2. Enter: `qrpipay.com`
3. Note the CNAME target
4. In your DNS provider, add CNAME record:
   ```
   qrpipay.com CNAME xyz789.onrender.com
   ```

### Set Up Monitoring
1. qrpipay-backend → Alerts
2. Add alerts for:
   - High memory usage (> 400MB)
   - High CPU (> 80%)
   - Service crashes
3. Set notification email

### Enable Auto-backups
1. qrpipay-db → Backups
2. Enable automatic backups (7-day retention)
3. Test restore procedure

---

## 🧪 TESTING CHECKLIST (POST-DEPLOY)

### Frontend Tests
- [ ] Homepage loads
- [ ] Responsive on mobile/tablet/desktop
- [ ] Login button visible
- [ ] Theme colors visible (purple/orange)
- [ ] Animations work
- [ ] Forms visible

### Backend Tests
- [ ] Health endpoint responds: `https://qrpipay-backend.onrender.com/health`
- [ ] API status endpoint: `https://qrpipay-backend.onrender.com/api/status`
- [ ] CORS headers present
- [ ] Response times < 500ms

### Database Tests
- [ ] Tables created
- [ ] Migrations ran successfully
- [ ] Can query users table
- [ ] Backups enabled

### Integration Tests
- [ ] Frontend can reach backend
- [ ] No CORS errors in browser console
- [ ] Login flow works
- [ ] API calls succeed

---

## 📊 DEPLOYMENT URLS

After deployment, you'll have:

**Frontend:**
- URL: https://qrpipay-frontend.onrender.com (auto-generated)
- Custom: https://qrpipay.com (if configured)

**Backend:**
- URL: https://qrpipay-backend.onrender.com (auto-generated)
- Custom: https://api.qrpipay.com (if configured)

**Database:**
- Managed by Render (no public URL)
- Internal connection string: postgresql://...

---

## ⚠️ TROUBLESHOOTING

### Build Fails
**Error in logs:**
1. Check build command in Render dashboard
2. Make sure root directory is correct
3. Clear build cache: Service → Settings → Clear build cache
4. Redeploy

### Frontend shows blank page
1. Check browser console for errors
2. Verify VITE_API_URL is correct
3. Verify backend is running
4. Check CORS settings in backend

### Database connection fails
1. Verify DATABASE_URL in environment
2. Check PostgreSQL service is running
3. Verify user/password correct
4. Run: `psql $DATABASE_URL` to test

### API endpoints return 404
1. Verify backend built successfully
2. Check routes are correct
3. Verify PORT=3001 in environment
4. Check logs: Backend → Logs tab

---

## 🔄 CONTINUOUS DEPLOYMENT

After first deployment, every push to main branch will:
1. ✅ Trigger GitHub push
2. ✅ Render detects changes
3. ✅ Render rebuilds frontend/backend
4. ✅ Auto-deploys on success
5. ✅ Rollback available if failure

---

## 💾 BACKUPS & RECOVERY

### Database Backups
1. Render → Database → Backups
2. Automatic backups enabled (7-day retention)
3. Manual backup: click "Create Backup"
4. Restore: click "Restore from Backup"

### Code Rollback
If deployment breaks:
```bash
# Via Git
git revert HEAD
git push origin main
# OR
git reset --hard <commit_hash>
git push -f origin main
```

---

## ✅ DEPLOYMENT SUCCESS INDICATORS

You're deployed successfully when:

- [x] Frontend loads at https://qrpipay.onrender.com
- [x] Backend health endpoint responds
- [x] No CORS errors in browser console
- [x] Login page displays correctly
- [x] Database backups are enabled
- [x] Monitoring/alerts are configured
- [x] Custom domains are configured (optional)

---

## 📞 SUPPORT

If you encounter issues:
1. Check Render dashboard logs
2. Review troubleshooting section above
3. Consult: https://render.com/docs
4. QRPiPay docs: https://github.com/your-username/qrpipay

---

**🎉 QRPiPay is LIVE on Render!**

Your payment terminal is now running globally with automatic deployments, backups, and monitoring.

Next steps:
- [ ] Configure custom domains
- [ ] Set up monitoring alerts
- [ ] Test all features
- [ ] Share with Pi Network community
- [ ] Collect user feedback
- [ ] Plan improvements

Happy deploying! 🚀
