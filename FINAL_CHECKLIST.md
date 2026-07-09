# ✅ FINAL DEPLOYMENT CHECKLIST - QRPiPay

**Generated:** $(date)
**Status:** 🟢 Production Ready
**Version:** 2.0.0

---

## 📋 DEMAIN MATIN - Lire dans cet ordre

- [ ] 1. GO_LIVE_CHECKLIST.md (2 min)
- [ ] 2. RENDER_GUIDE_FR.md (5 min - skim it)
- [ ] 3. Start with STEP 1 below

---

## 🎯 DEPLOYMENT STEPS (30-45 minutes total)

### STEP 1: Create PostgreSQL Database (10 min)
```
1. Go to https://render.com
2. Click "New +"
3. Select "PostgreSQL"
4. Configuration:
   - Name: qrpipay-db
   - Database: qrpipay
   - Region: Frankfurt
   - Plan: Free
5. COPY DATABASE_URL (you'll need it!)
```

**Success Criteria:**
- [ ] PostgreSQL service created
- [ ] DATABASE_URL copied to safe place

---

### STEP 2: Deploy Backend (10 min)
```
1. Render Dashboard → "New +"
2. Select "Web Service"
3. Connect GitHub: PORTRAITART1/QRPiPay
4. Configuration:
   - Name: qrpipay-backend
   - Root Dir: backend
   - Environment: Node
   - Build: npm ci --only=production && npx prisma generate
   - Start: npm start
   - Region: Frankfurt
   - Plan: Free
5. Add Environment Variables (see below)
6. Connect PostgreSQL service
7. Deploy
```

**Environment Variables to Add:**
```
NODE_ENV=production
PORT=3001
LOG_LEVEL=info
FRONTEND_URL=https://qrpipay-frontend.onrender.com
CORS_ORIGIN=https://qrpipay-frontend.onrender.com
JWT_SECRET=[GENERATE: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"]
PI_API_KEY=[YOUR KEY]
PI_API_URL=https://api.minepi.com
PI_APP_ID=[YOUR APP ID]
RATE_LIMIT_MAX_REQUESTS=100
RATE_LIMIT_WINDOW_MS=900000
```

**Success Criteria:**
- [ ] Backend service created
- [ ] Build shows "Deployed"
- [ ] Logs show "Backend running on port 3001"
- [ ] Database connected

---

### STEP 3: Deploy Frontend (10 min)
```
1. Render Dashboard → "New +"
2. Select "Web Service"
3. Connect GitHub: PORTRAITART1/QRPiPay
4. Configuration:
   - Name: qrpipay-frontend
   - Root Dir: frontend
   - Environment: Node
   - Build: npm ci --legacy-peer-deps && npm run build
   - Start: npx serve -s dist -l 3000
   - Region: Frankfurt
   - Plan: Free
5. Add Environment Variables:
   - VITE_API_URL=https://qrpipay-backend.onrender.com/api
6. Deploy
```

**Success Criteria:**
- [ ] Frontend service created
- [ ] Build shows "Deployed"
- [ ] Logs show healthy

---

### STEP 4: Verification (5 min)
```
Test 1: Backend Health
curl https://qrpipay-backend.onrender.com/health
Expected: 200 + JSON response

Test 2: Backend Status
curl https://qrpipay-backend.onrender.com/api/status
Expected: 200 + version info

Test 3: Frontend
https://qrpipay-frontend.onrender.com
Expected: Page loads, no errors in console (F12)

Test 4: Check Logs
- Render Dashboard → qrpipay-backend → Logs
- Look for errors (should be none)
```

**Success Criteria:**
- [ ] curl to /health returns 200
- [ ] curl to /api/status returns 200
- [ ] Frontend page loads
- [ ] No CORS errors in console
- [ ] No 5xx errors in backend logs

---

## 🔐 CRITICAL SECURITY CHECKS

- [ ] JWT_SECRET is STRONG (32+ chars, no patterns)
- [ ] JWT_SECRET is in Render (NOT in code)
- [ ] PI_API_KEY is in Render (NOT in code)
- [ ] PI_APP_ID is in Render (NOT in code)
- [ ] DATABASE_URL is auto-set (NOT hardcoded)
- [ ] FRONTEND_URL and CORS_ORIGIN match
- [ ] HTTPS is active on both services
- [ ] Rate limiting is enabled

---

## 📊 PERFORMANCE BASELINE

**Target Metrics:**
- [ ] Backend /health response: <500ms
- [ ] Frontend page load: <2s
- [ ] API endpoint response: <1s average
- [ ] No 5xx errors in 24h

---

## 🆘 IF SOMETHING GOES WRONG

### Backend returns 500
```bash
1. Check Render logs
2. Verify DATABASE_URL is correct
3. Check JWT_SECRET is set
4. Redeploy service
```

### Frontend shows CORS errors
```bash
1. Check console (F12)
2. Verify VITE_API_URL
3. Check backend CORS_ORIGIN matches FRONTEND_URL
4. Redeploy frontend
```

### API endpoints timeout
```bash
1. Check backend logs
2. Verify database connection
3. Check service is running (green status)
4. Try redeploying
```

### Database connection failed
```bash
1. Verify PostgreSQL is running
2. Check DATABASE_URL format
3. Test connection locally if possible
4. Create new PostgreSQL service if needed
```

---

## 📋 POST-DEPLOYMENT (DO THESE!)

### Day 1
- [ ] Test complete user flow
- [ ] Verify all endpoints working
- [ ] Monitor logs for errors
- [ ] Check response times
- [ ] Test WebSocket connections (if available)

### Day 2-3
- [ ] Test with real Pi Network credentials
- [ ] Load test basic scenarios
- [ ] Check database performance
- [ ] Verify backups working

### Week 1+
- [ ] Set up error tracking (Sentry)
- [ ] Configure logging (Winston)
- [ ] Set up alerts/monitoring
- [ ] Plan scaling strategy

---

## 📞 QUICK REFERENCES

| Problem | Solution |
|---------|----------|
| Can't reach backend | Verify service is deployed and healthy |
| CORS errors | Check VITE_API_URL and CORS_ORIGIN |
| 500 errors | Check DATABASE_URL and logs |
| Slow response | Normal on free plan (cold start) |
| Build failed | Check logs for missing dependencies |

---

## 🎯 SUCCESS = ALL GREEN

```
✅ Backend health endpoint responding
✅ Frontend page loading
✅ No CORS errors
✅ No 5xx errors
✅ API endpoints working
✅ WebSockets connecting
✅ Database connected
✅ Rate limiting active
```

---

## 📂 FILES YOU'LL REFERENCE

```
RENDER_GUIDE_FR.md       ← Detailed step-by-step
PRODUCTION_CHECKLIST.md  ← Full verification checklist
DEPLOYMENT_SUMMARY.md    ← Complete overview
INDEX.md                 ← File index
RENDER_ENV_VARS.txt      ← Environment variables
```

---

## ⏱️ TIMELINE

```
09:00 - Start reading GO_LIVE_CHECKLIST.md
09:05 - Read RENDER_GUIDE_FR.md quickly
09:15 - Create PostgreSQL (10 min)
09:25 - Deploy Backend (10 min)
09:35 - Deploy Frontend (10 min)
09:45 - Run verification tests (5-10 min)
10:00 - ✅ DONE! System live
```

---

## 🎉 YOU'VE GOT THIS!

Everything is prepared. Just follow the steps above and you'll be live in ~45 minutes.

**Current Status:** 🟢 Production Ready

Questions? Check:
- GO_LIVE_CHECKLIST.md
- RENDER_GUIDE_FR.md
- PRODUCTION_CHECKLIST.md

**Let's go! 🚀**
