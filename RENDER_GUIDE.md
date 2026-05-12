# 🚀 QRPiPay - Complete Render Deployment Guide

## STEP-BY-STEP DEPLOYMENT

### STEP 1: Prepare GitHub Repository

```bash
# Make sure everything is committed
cd D:\QRPiPay
git status

# Add render.yaml and deployment scripts
git add render.yaml render-deploy.sh docs/RENDER_DEPLOYMENT.md
git commit -m "Add Render deployment configuration"
git push origin main
```

### STEP 2: Create Render Account & Connect GitHub

1. **Go to**: https://render.com
2. **Sign up** with GitHub account
3. **Authorize** Render to access GitHub
4. **Connect** your qrpipay repository

### STEP 3: Create PostgreSQL Database

1. In Render Dashboard: **New +** → **PostgreSQL**
2. **Configure**:
   - Name: `qrpipay-db`
   - Database: `qrpipay`
   - User: `qrpipay`
   - Plan: **Free**
   - Region: **Oregon** (or closest to you)

3. **Create** database
4. **Copy connection string** (Internal Database URL)
   - Format: `postgresql://user:password@host:port/database`

### STEP 4: Create Backend Web Service

1. **New +** → **Web Service**
2. **Connect GitHub Repository**
3. **Configure**:
   - **Name**: `qrpipay-backend`
   - **Environment**: Node
   - **Build Command**: `cd backend && npm install && npm run build`
   - **Start Command**: `cd backend && npm start`
   - **Plan**: Free
   - **Auto-deploy**: Yes (checked)

4. **Add Environment Variables**:

   ```
   NODE_ENV=production
   PORT=3001
   DATABASE_URL=<paste_from_step_3>
   FRONTEND_URL=https://qrpipay.onrender.com
   JWT_SECRET=<generate_strong_secret>
   LOG_LEVEL=info
   PI_API_KEY=<your_pi_api_key>
   PI_WALLET_ADDRESS=<your_pi_wallet>
   ```

5. **Generate JWT_SECRET**:
   ```bash
   # Run in terminal (or use online generator)
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

6. **Create Service**

### STEP 5: Create Frontend Static Site

1. **New +** → **Static Site**
2. **Connect GitHub Repository**
3. **Configure**:
   - **Name**: `qrpipay-frontend`
   - **Build Command**: `cd frontend && npm install && npm run build`
   - **Publish Directory**: `frontend/dist`
   - **Auto-deploy**: Yes

4. **Add Environment Variables**:
   ```
   VITE_API_URL=https://qrpipay-backend.onrender.com/api
   VITE_PI_APP_ID=<your_pi_app_id>
   ```

5. **Create Site**

### STEP 6: Connect Database to Backend

1. Go to **qrpipay-backend** service
2. **Environment** tab
3. **Add Environment Variable**:
   - Key: `DATABASE_URL`
   - Value: `<postgresql_connection_string>`

4. **Save and redeploy**

### STEP 7: Run Database Migrations

**Option A: Manual (via Render Shell)**
```bash
1. Go to qrpipay-backend service
2. Click "Shell" tab
3. Run commands:
   cd database
   npm install
   npm run migrate
   npm run seed (optional - test data)
```

**Option B: GitHub Actions (Automated)**
Create `.github/workflows/render-deploy.yml`:

```yaml
name: Deploy to Render

on:
  push:
    branches: [main]
    paths:
      - 'backend/**'
      - 'database/**'

jobs:
  migrate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: |
          cd database
          npm install
      
      - name: Run migrations
        env:
          DATABASE_URL: ${{ secrets.RENDER_DATABASE_URL }}
        run: |
          cd database
          npm run migrate:prod
```

Then add GitHub Secret:
- Name: `RENDER_DATABASE_URL`
- Value: `<postgresql_connection_string>`

### STEP 8: Verify Deployment

```bash
# Test Backend
curl https://qrpipay-backend.onrender.com/health

# Should return:
# {"status":"ok","timestamp":"..."}

# Test Frontend
# Visit: https://qrpipay.onrender.com
# Should see login page
```

### STEP 9: Configure Custom Domains (Optional)

**For Backend**:
1. Backend service → Settings
2. Custom Domain
3. Enter: `api.qrpipay.com`
4. Get CNAME target from Render
5. Add CNAME record in DNS:
   ```
   api.qrpipay.com CNAME abc123.onrender.com
   ```

**For Frontend**:
1. Frontend service → Settings
2. Custom Domain
3. Enter: `qrpipay.com`
4. Configure DNS (same process)

### STEP 10: Set Up Monitoring & Alerts

1. Backend service → Alerts
2. Create alert for:
   - High memory usage
   - High CPU
   - Service crashes
3. Email notification when triggered

---

## TROUBLESHOOTING

### Build Fails

**Error: npm install fails**
```bash
# Solution:
1. Check logs: Service → Logs tab
2. Ensure all dependencies are in package.json
3. Clear build cache: Service → Settings → Clear build cache
4. Redeploy
```

**Error: Port already in use**
```bash
# Solution:
- Change PORT in environment variables
- Or restart service
```

### Database Connection Fails

**Error: could not connect to server**
```bash
# Check:
1. DATABASE_URL is correct
2. PostgreSQL service is running
3. Network access is allowed

# Test connection locally:
psql $DATABASE_URL
```

**Error: permission denied**
```bash
# Solution:
- Verify database user/password
- Check user permissions
- Reset database if needed
```

### Frontend Blank Page

**Error: API calls fail (CORS error)**
```bash
# Check:
1. VITE_API_URL is correct
2. Backend API is running
3. Backend allows CORS

# Fix backend:
app.use(cors({
  origin: 'https://qrpipay.onrender.com'
}));
```

**Error: 404 on frontend**
```bash
# Check:
1. Static publish directory is correct: frontend/dist
2. Build succeeded
3. npm run build creates dist folder
```

### Slow Deployment

**Solution:**
1. Parallel builds (upgrade plan)
2. Cache dependencies
3. Optimize build process

---

## ENVIRONMENT VARIABLES REFERENCE

### Backend Variables

```
# Required
NODE_ENV=production
PORT=3001
DATABASE_URL=postgresql://...
FRONTEND_URL=https://qrpipay.onrender.com
JWT_SECRET=<long_random_string>

# Optional but recommended
LOG_LEVEL=info
SENTRY_DSN=https://...@sentry.io/...

# Pi Network
PI_API_KEY=your_key
PI_WALLET_ADDRESS=your_wallet
```

### Frontend Variables

```
# Required
VITE_API_URL=https://qrpipay-backend.onrender.com/api

# Optional
VITE_PI_APP_ID=your_app_id
```

---

## COST BREAKDOWN (Monthly)

| Service | Plan | Cost | Notes |
|---------|------|------|-------|
| Backend | Free | $0 | 512MB RAM, auto-sleep |
| Frontend | Free | $0 | Static hosting, CDN |
| Database | Free | $0 | 1GB storage |
| **Total** | **Free** | **$0** | Perfect for MVP |

**When to upgrade:**
- Backend: If > 512MB RAM needed → $7/month
- Database: If > 1GB storage → $10-50/month
- High traffic → Pro plans

---

## PERFORMANCE TIPS

### Optimize Backend
1. Enable gzip compression
2. Use Redis for caching (upgrade)
3. Optimize database queries
4. Connection pooling

### Optimize Frontend
1. Code splitting (Vite auto does this)
2. Image optimization
3. Minification (automatic)
4. Tree-shaking (automatic)

### Optimize Database
1. Add indexes on frequently queried columns
2. Archive old data
3. Regular VACUUM (Render does automatically)

---

## SECURITY CHECKLIST

- [x] HTTPS enabled (automatic)
- [x] Environment variables secure (not in code)
- [x] Database password strong
- [x] CORS configured
- [x] Rate limiting enabled
- [x] JWT secret strong (min 32 chars)
- [x] No secrets in GitHub
- [x] Firewall rules checked

---

## MAINTENANCE

### Daily
- Check error logs
- Monitor health endpoints
- User activity review

### Weekly
- Database backups
- Security updates
- Performance metrics

### Monthly
- Cost review
- Scaling assessment
- Feature deployment

---

## ROLLBACK PROCEDURES

### If Deployment Breaks

**Via Render Dashboard:**
1. Service → Deploys
2. Find last working deployment
3. Click "Rollback"
4. Confirm

**Via Git:**
```bash
git revert HEAD
git push origin main
# Render auto-redeploys
```

---

## NEXT STEPS AFTER DEPLOYMENT

1. ✅ Test all features on production
2. ✅ Configure custom domains
3. ✅ Set up monitoring/alerts
4. ✅ Enable backups
5. ✅ Document deployment process
6. ✅ Train team on deployment
7. ✅ Set up logging/monitoring
8. ✅ Plan scaling strategy

---

## SUPPORT & DOCUMENTATION

- **Render Docs**: https://render.com/docs
- **QRPiPay Docs**: `/docs/RENDER_DEPLOYMENT.md`
- **GitHub**: Push issues to QRPiPay repo
- **Render Support**: help@render.com

---

**🎉 QRPiPay is now live on Render!**

Your app is running at:
- **Backend**: https://qrpipay-backend.onrender.com
- **Frontend**: https://qrpipay.onrender.com
- **Database**: Managed PostgreSQL

Happy deploying! 🚀
