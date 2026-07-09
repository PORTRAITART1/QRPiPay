# 🎯 QRPiPay Production Go-Live Checklist

## ✅ Pre-Deployment Verification

### Code Quality
- [ ] All TypeScript files compile without errors
- [ ] No console.log in production code
- [ ] No hardcoded secrets in code
- [ ] Environment variables properly documented
- [ ] Error handling implemented for all endpoints
- [ ] Input validation on all routes

### Security
- [ ] JWT_SECRET generated (32+ chars) and stored in Render
- [ ] All env vars set in Render (not hardcoded)
- [ ] Database URL using Render Postgres connection string
- [ ] CORS configured for frontend domain only
- [ ] Rate limiting enabled (100 req/15min)
- [ ] Helmet security headers enabled
- [ ] HTTPS enforced (automatic on Render)
- [ ] No SQL injection vulnerabilities
- [ ] No XSS vulnerabilities

### Testing
- [ ] Unit tests pass locally
- [ ] Integration tests pass
- [ ] Endpoint validation script passes
- [ ] Health check endpoint working (/health → 200)
- [ ] API status endpoint working (/api/status → 200)
- [ ] Authentication flow tested
- [ ] Payment creation tested
- [ ] Error responses validated

### Docker & DevOps
- [ ] Backend Dockerfile is multi-stage ✅
- [ ] Frontend Dockerfile is multi-stage ✅
- [ ] .dockerignore files configured ✅
- [ ] docker-compose.yml tested locally ✅
- [ ] render.yaml properly configured ✅
- [ ] No secrets in docker-compose.yml

---

## 🚀 Deployment Steps

### Step 1: Render PostgreSQL Setup
- [ ] Create Render PostgreSQL database
  - Plan: Free
  - Region: Frankfurt
  - Database: qrpipay
  - User: postgres
- [ ] Copy connection string to secure location

### Step 2: Backend Deployment
- [ ] Create Render Web Service for backend
  - Name: qrpipay-backend
  - Root Dir: backend
  - Build: npm ci --only=production && npx prisma generate
  - Start: npm start
  - Plan: Free
- [ ] Add environment variables:
  - NODE_ENV: production
  - JWT_SECRET: (generated value)
  - PI_API_KEY: (your Pi Network API key)
  - PI_APP_ID: (your Pi App ID)
  - PI_API_URL: https://api.minepi.com
  - RATE_LIMIT_MAX_REQUESTS: 100
  - RATE_LIMIT_WINDOW_MS: 900000
  - LOG_LEVEL: info
- [ ] Connect to PostgreSQL service
- [ ] Deploy and monitor logs
- [ ] Test /health endpoint

### Step 3: Frontend Deployment
- [ ] Create Render Web Service for frontend
  - Name: qrpipay-frontend
  - Root Dir: frontend
  - Build: npm ci --legacy-peer-deps && npm run build
  - Start: npx serve -s dist -l 3000
  - Plan: Free
- [ ] Add environment variables:
  - VITE_API_URL: https://qrpipay-backend.onrender.com/api
- [ ] Deploy and monitor logs
- [ ] Test homepage loads

### Step 4: Verification
- [ ] Backend health: https://qrpipay-backend.onrender.com/health (200)
- [ ] Backend status: https://qrpipay-backend.onrender.com/api/status (200)
- [ ] Frontend loads: https://qrpipay-frontend.onrender.com
- [ ] CORS working (no console errors)
- [ ] API calls succeed from frontend
- [ ] WebSockets connect successfully
- [ ] Run endpoint validation script
- [ ] Test authentication flow
- [ ] Test payment creation

---

## 📊 Post-Deployment Monitoring

### First 24 Hours
- [ ] Monitor backend error logs
- [ ] Monitor frontend console errors
- [ ] Check database connectivity
- [ ] Verify rate limiting working
- [ ] Check WebSocket connections
- [ ] Monitor response times
- [ ] Check for database errors

### Ongoing
- [ ] Set up Sentry for error tracking
- [ ] Set up monitoring alerts
- [ ] Configure Winston logging
- [ ] Monitor database performance
- [ ] Track API response times
- [ ] Monitor resource usage

---

## 🔄 Rollback Plan

If deployment fails:
1. Revert backend code to last working version
2. Revert frontend code to last working version
3. Redeploy services on Render
4. Verify all endpoints working

---

## 📝 Environment Variables Reference

### Backend (Render)
```
NODE_ENV=production
PORT=3001
LOG_LEVEL=info
DATABASE_URL=[AUTO-SET BY RENDER]
JWT_SECRET=[GENERATE & SET]
FRONTEND_URL=https://qrpipay-frontend.onrender.com
CORS_ORIGIN=https://qrpipay-frontend.onrender.com
PI_API_KEY=[YOUR VALUE]
PI_APP_ID=[YOUR VALUE]
PI_API_URL=https://api.minepi.com
RATE_LIMIT_MAX_REQUESTS=100
RATE_LIMIT_WINDOW_MS=900000
```

### Frontend (Render)
```
VITE_API_URL=https://qrpipay-backend.onrender.com/api
```

---

## ✅ Production Success Criteria

- [ ] All endpoints responding with 200 status
- [ ] Frontend loads without errors
- [ ] Users can authenticate
- [ ] Payments can be created
- [ ] WebSockets active
- [ ] No 5xx errors in logs
- [ ] Response time < 2s average
- [ ] Zero database connection errors

---

## 📞 Support Contacts

- Render Support: https://support.render.com
- Pi Network Docs: https://developers.minepi.com
- GitHub Repo: https://github.com/PORTRAITART1/QRPiPay

---

**Last Updated:** $(date)
**Deployed By:** Gordon (AI Assistant)
**Status:** 🟢 Ready for Production
