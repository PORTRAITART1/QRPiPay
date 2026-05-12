# 🚀 QRPIPAY RENDER DEPLOYMENT - INTERACTIVE GUIDE

## START HERE 👈

This guide walks you through deploying QRPiPay to **Render.com** in 30 minutes.

**Current Status:**
- ✅ Code ready
- ✅ Database schema ready
- ✅ Backend configured
- ✅ Frontend optimized
- ✅ Just need to deploy!

---

## 📋 WHAT YOU'LL GET

After deployment:
- **Frontend**: https://qrpipay.onrender.com (your app)
- **Backend**: https://qrpipay-backend.onrender.com (API)
- **Database**: PostgreSQL 15 (managed)
- **SSL/HTTPS**: Automatic
- **CDN**: Global (Render's infrastructure)
- **Cost**: FREE ($0/month for MVP)

---

## 🎯 DEPLOYMENT ROADMAP

```
15 min  → Create Render account & set up GitHub
5 min   → Create PostgreSQL database
5 min   → Deploy backend service
3 min   → Deploy frontend site
2 min   → Run database migrations
2 min   → Verify everything works
```

**Total: ~30 minutes from start to live! ⚡**

---

## ⚠️ PREREQUISITES

Before starting, gather these:

### GitHub
- [ ] Repository URL: https://github.com/YOUR_USERNAME/qrpipay
- [ ] Branch: `master` (or `main`)
- [ ] All code committed

### Pi Network (Optional but recommended)
- [ ] Pi App ID: (from https://developers.minepi.com)
- [ ] Pi API Key: (from developers portal)
- [ ] Pi Wallet Address: (your Pi wallet)

### Environment Variables You'll Create
- [ ] JWT_SECRET: (we'll generate this)
- [ ] DATABASE_URL: (Render creates this)

---

# 🎬 STEP-BY-STEP DEPLOYMENT

## STEP 1: Create Render Account (5 minutes)

### 1.1 Sign Up
```
1. Go to: https://render.com
2. Click "Sign up with GitHub"
3. Authorize Render to access GitHub
4. Accept default permissions
5. Complete sign-up
```

### 1.2 Verify Email
- Check your email
- Click verification link
- You're in the Render dashboard!

**Dashboard URL**: https://dashboard.render.com

---

## STEP 2: Create PostgreSQL Database (5 minutes)

### 2.1 Create Database
```
1. Render Dashboard → New + → PostgreSQL
2. Fill in form:
   - Name: qrpipay-db
   - Database: qrpipay
   - User: qrpipay
   - Region: Oregon (or closest)
   - Plan: Free
3. Click "Create Database"
```

### 2.2 Copy Connection String
```
1. Wait for database to create (1-2 min)
2. Click on "qrpipay-db" service
3. Find "Connections" section
4. Copy "Internal Database URL" (NOT External)
   - Looks like: postgresql://user:pass@host:5432/qrpipay
5. SAVE THIS! You'll need it for backend
```

**⚠️ IMPORTANT**: Use INTERNAL URL, not External URL!

---

## STEP 3: Deploy Backend Service (5 minutes)

### 3.1 Create Web Service
```
1. Render Dashboard → New + → Web Service
2. Select your GitHub repository
   - Search for "qrpipay"
   - Select it
3. Click "Connect"
```

### 3.2 Configure Backend
```
Name: qrpipay-backend
Environment: Node
Node Version: 18
Root Directory: backend
Build Command: npm install && npm run build
Start Command: npm start
Plan: Free
Auto-Deploy: Yes (checked)
```

### 3.3 Add Environment Variables
Click **"Add Environment Variable"** for each:

| Key | Value | Notes |
|-----|-------|-------|
| NODE_ENV | production | Required |
| PORT | 3001 | Required |
| FRONTEND_URL | https://qrpipay.onrender.com | Required |
| DATABASE_URL | (FROM STEP 2.2) | Required |
| JWT_SECRET | (GENERATE BELOW) | Required |
| LOG_LEVEL | info | Optional |
| PI_API_KEY | your_key_or_demo | Optional |
| PI_WALLET_ADDRESS | your_wallet | Optional |

### 3.4 Generate JWT_SECRET
```bash
# Open terminal/PowerShell and run:
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Example output:
# a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6

# Copy the output (entire string)
# Paste into JWT_SECRET field in Render
```

### 3.5 Deploy Backend
```
1. Scroll down
2. Click "Create Web Service"
3. Wait for deployment (2-5 minutes)
4. ✅ When it says "Live" in top-right, backend is deployed!
```

**Check Status:**
- Go to service page
- Should show "Live" status
- Logs show no errors

---

## STEP 4: Deploy Frontend Site (3 minutes)

### 4.1 Create Static Site
```
1. Render Dashboard → New + → Static Site
2. Select your GitHub repository
3. Click "Connect"
```

### 4.2 Configure Frontend
```
Name: qrpipay-frontend
Root Directory: frontend
Build Command: npm install && npm run build
Publish Directory: dist
Plan: Free
Auto-Deploy: Yes (checked)
```

### 4.3 Add Environment Variables
Click **"Add Environment Variable"** for each:

| Key | Value | Notes |
|-----|-------|-------|
| VITE_API_URL | https://qrpipay-backend.onrender.com/api | Required |
| VITE_PI_APP_ID | your_pi_app_id | Optional |

### 4.4 Deploy Frontend
```
1. Click "Create Static Site"
2. Wait for deployment (1-2 minutes)
3. ✅ When it says "Live", frontend is deployed!
```

**Your Frontend URL:**
```
https://qrpipay-frontend.onrender.com
```

---

## STEP 5: Run Database Migrations (2 minutes)

### Option A: Automatic (No Action Needed)
- Prisma will create tables on first use
- Data will be created automatically

### Option B: Manual (Recommended)
```
1. Go to Backend Service (qrpipay-backend)
2. Click "Shell" tab
3. Run commands:
   cd database
   npm install
   npm run migrate
   # Optional: npm run seed
4. See "Prisma migration applied" in output
```

**If you see errors**, don't worry:
- Database might already be created
- Check STEP 7 for testing

---

## STEP 6: Verify URLs & Status

### Check Backend
```bash
# In terminal:
curl https://qrpipay-backend.onrender.com/health

# Should return:
# {"status":"ok","timestamp":"...","version":"1.0.0"}
```

### Check Frontend
```
1. Open: https://qrpipay-frontend.onrender.com
2. Should see login page
3. Should have purple/orange theme
4. Should be responsive
```

**If blank page:**
1. Check browser console (F12)
2. Look for CORS errors
3. Verify VITE_API_URL is correct
4. Check backend is running

---

## STEP 7: Testing Checklist

### Frontend Tests
```
✅ Page loads without errors
✅ Login page visible
✅ Theme colors visible (purple/orange)
✅ Responsive on mobile (F12 → responsive mode)
✅ No console errors (F12 → Console tab)
```

### Backend Tests
```
✅ Health endpoint responds
✅ No CORS errors in console
✅ API calls succeed
✅ Database connected
```

### Integration Tests
```
✅ Click "Connexion Pi Network" button
✅ Process works (or redirects correctly)
✅ No errors in browser console
✅ Load time < 3 seconds
```

---

## 🌐 CONFIGURE CUSTOM DOMAINS (Optional)

### Your Current URLs (Render-generated)
- **Frontend**: https://qrpipay-frontend.onrender.com
- **Backend**: https://qrpipay-backend.onrender.com

### Optional: Custom Domains
Skip this if you don't have a domain yet!

#### 4.1 Add Custom Domain for Frontend
```
1. Dashboard → qrpipay-frontend service
2. Settings tab
3. Custom Domain section
4. Enter: qrpipay.com
5. Get CNAME target (e.g., abc123.onrender.com)
6. In your DNS provider, add:
   CNAME: qrpipay.com → abc123.onrender.com
7. Wait 5-10 min for DNS propagation
8. Visit qrpipay.com (should work!)
```

#### 4.2 Add Custom Domain for Backend
```
1. Dashboard → qrpipay-backend service
2. Settings tab
3. Custom Domain section
4. Enter: api.qrpipay.com
5. Get CNAME target
6. In your DNS provider, add:
   CNAME: api.qrpipay.com → xyz789.onrender.com
7. Update VITE_API_URL in frontend to: https://api.qrpipay.com/api
8. Frontend will auto-rebuild
```

**DNS Propagation Tip:**
- Usually works within 5-10 minutes
- Some DNS providers take up to 24 hours
- Use https://mxtoolbox.com/mxlookup/ to check

---

## 🔐 SECURITY CHECK

After deployment, verify:

```
✅ All URLs use HTTPS (green lock icon)
✅ No secrets in GitHub (check .gitignore)
✅ DATABASE_URL not in public
✅ JWT_SECRET not in public
✅ CORS configured correctly
✅ Rate limiting in place
```

---

## 📊 MONITORING SETUP (Optional)

### Enable Database Backups
```
1. Dashboard → qrpipay-db
2. Click "Backups" tab
3. Check "Automated backups enabled"
4. Set retention: 7 days
5. Save
```

### Set Up Alerts
```
1. Dashboard → qrpipay-backend
2. Click "Alerts" tab
3. Add alert for:
   - Memory > 400MB
   - CPU > 80%
   - Service unavailable
4. Set email notification
5. Save
```

---

## 🆘 TROUBLESHOOTING

### Frontend Shows Blank Page
```
Solution:
1. Open F12 → Console tab
2. Look for errors
3. Check VITE_API_URL matches backend URL
4. Verify backend is running
5. Clear browser cache
6. Try incognito window
```

### Backend Build Fails
```
Solution:
1. Go to Backend service → Logs tab
2. Read error message
3. Common issues:
   - Missing dependency in package.json
   - Port conflict (PORT should be 3001)
   - Build command wrong
4. Fix in code
5. Push to GitHub
6. Render auto-redeploys
```

### Database Connection Error
```
Solution:
1. Verify DATABASE_URL copied correctly
2. Check PostgreSQL service status
3. Verify user/password correct
4. Check database name is "qrpipay"
5. Try in Shell: psql $DATABASE_URL
```

### CORS Error in Console
```
Solution:
1. Check backend CORS configuration
2. Verify FRONTEND_URL matches frontend domain
3. Ensure backend has:
   app.use(cors({ origin: 'https://qrpipay.onrender.com' }))
4. Fix in code
5. Push to GitHub
6. Wait for auto-redeploy
```

---

## ✅ DEPLOYMENT SUCCESS!

You're done when you see:

- [x] **Frontend URL**: https://qrpipay.onrender.com (or custom domain)
- [x] **Backend URL**: https://qrpipay-backend.onrender.com (or custom domain)
- [x] **Status**: "Live" (on both Render services)
- [x] **Health Check**: Returns {"status":"ok"}
- [x] **Login Page**: Visible and themed correctly
- [x] **Database**: Connected and ready
- [x] **HTTPS**: Enabled (green lock)

---

## 🎉 WHAT'S NEXT?

### Immediate (Today)
- [ ] Share link with Pi Network community
- [ ] Test on Pi Browser
- [ ] Collect feedback

### Soon (This Week)
- [ ] Configure custom domain
- [ ] Set up monitoring/alerts
- [ ] Add more payment types
- [ ] Optimize performance

### Later (Next Month)
- [ ] Scale to Pro plan (if needed)
- [ ] Add Redis caching
- [ ] Analytics dashboard
- [ ] Mobile app

---

## 🆘 GET HELP

If stuck:

1. **Check Logs**: Service → Logs tab
2. **Read Error**: Usually describes the problem
3. **Troubleshoot**: See section above
4. **Render Support**: help@render.com
5. **QRPiPay Docs**: RENDER_GUIDE.md

---

## 📞 QUICK REFERENCE

### URLs After Deployment
```
Frontend: https://qrpipay-frontend.onrender.com
Backend:  https://qrpipay-backend.onrender.com
Database: (internal only, no public URL)
```

### Important Passwords/Keys
```
Keep safe:
- Database user/password (from Step 2)
- JWT_SECRET (you created)
- Pi API credentials (if applicable)
- GitHub token (Render uses it)
```

### File Locations
```
Backend config: /backend/.env (not in GitHub)
Frontend config: /frontend/.env (not in GitHub)
Database schema: /database/prisma/schema.prisma
Deployment config: /render.yaml
```

---

## 🚀 YOU'RE READY!

**Time to deploy: ~30 minutes**

Start with STEP 1 above ☝️

When you're done, your QRPiPay payment terminal will be LIVE on the internet!

Good luck! 🥧✨

---

**Questions?** Check TROUBLESHOOTING section or see:
- RENDER_GUIDE.md (detailed reference)
- DEPLOYMENT_CHECKLIST.md (task checklist)
- docs/IMMERSIVE_3D_DESIGN.md (design documentation)
