# Render Deployment Configuration

## Prerequisites

- GitHub account connected to Render
- Render.com account (free tier available)
- PostgreSQL database instance
- Environment variables configured

## Backend Deployment Steps

### 1. Create Backend Service on Render

```bash
# Via Render Dashboard:
1. New +
2. Web Service
3. Connect GitHub repository
4. Select "qrpipay" repo
5. Configure:
   - Name: qrpipay-backend
   - Environment: Node
   - Build Command: npm install && npm run build
   - Start Command: npm start
   - Branch: main
   - Auto-deploy: Yes
```

### 2. Environment Variables (Backend)

In Render Dashboard → Environment:

```
PORT=3001
NODE_ENV=production
FRONTEND_URL=https://qrpipay.vercel.app
DATABASE_URL=postgresql://user:password@host:5432/qrpipay
JWT_SECRET=your_super_secret_key_here_min_32_chars
PI_API_KEY=your_pi_api_key
PI_WALLET_ADDRESS=your_pi_wallet
LOG_LEVEL=info
SENTRY_DSN=your_sentry_dsn_optional
```

### 3. PostgreSQL Setup

Option A: Render PostgreSQL
```bash
1. New +
2. PostgreSQL
3. Configure:
   - Name: qrpipay-db
   - Database Name: qrpipay
   - User: qrpipay
   - Region: Same as backend
   - Pricing: Free (512 MB)
```

Option B: External PostgreSQL (AWS RDS, etc.)
- Use connection string in DATABASE_URL

### 4. Connect Database to Backend

```bash
1. Backend service settings
2. Environment
3. DATABASE_URL = paste PostgreSQL connection string
4. Save and redeploy
```

### 5. Run Migrations

```bash
# After first deployment:
1. Backend service → Shell
2. Run: npm run migrate
3. Or use GitHub Actions workflow (see below)
```

## Frontend Deployment Steps

### 1. Create Frontend Service on Render

```bash
# Via Render Dashboard:
1. New +
2. Static Site (recommended) OR Web Service
3. Connect GitHub repository
4. Configure:
   - Name: qrpipay-frontend
   - Build Command: npm install && npm run build
   - Publish Directory: dist
   - Branch: main
   - Auto-deploy: Yes
```

OR Alternative: Deploy to Vercel (easier for React)

### 2. Environment Variables (Frontend)

```
VITE_API_URL=https://qrpipay-backend.onrender.com/api
VITE_PI_APP_ID=your_pi_app_id
VITE_PI_SDK_URL=https://sdk.minepi.com/1/core.js
```

### 3. Build & Deploy

```bash
# Render auto-builds from git push
# OR manual deployment:
1. Service settings
2. Manual Deploy
3. Select branch (main)
4. Deploy
```

## GitHub Actions CI/CD

### 1. Create `.github/workflows/deploy.yml`

```yaml
name: Deploy to Render

on:
  push:
    branches: [main]

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy Backend
        run: |
          curl https://api.render.com/deploy/srv-${{ secrets.RENDER_SERVICE_ID }}?key=${{ secrets.RENDER_API_KEY }}
      
      - name: Run Migrations
        run: |
          npm install --prefix backend
          npm run migrate --prefix backend
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}

  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy Frontend
        run: |
          curl https://api.render.com/deploy/srv-${{ secrets.RENDER_FRONTEND_ID }}?key=${{ secrets.RENDER_API_KEY }}
```

### 2. Add GitHub Secrets

```bash
# In GitHub repo settings → Secrets and variables → Actions:

RENDER_API_KEY = your_render_api_key
RENDER_SERVICE_ID = backend_service_id
RENDER_FRONTEND_ID = frontend_service_id
DATABASE_URL = postgresql://connection_string
```

## Health Checks

### Backend Health Endpoint

```bash
GET https://qrpipay-backend.onrender.com/health

# Should return:
{
  "status": "ok",
  "timestamp": "2025-12-12T..."
}
```

### Frontend Health

```bash
https://qrpipay.onrender.com/

# Should load React app
```

## Monitoring & Logs

### View Logs

```bash
# In Render Dashboard:
1. Select service
2. Logs tab
3. Real-time streaming
4. Download logs
```

### Set Up Monitoring

```bash
# Optional: Sentry for error tracking
1. Create Sentry project
2. Add SENTRY_DSN to environment
3. Install @sentry/react, @sentry/node
4. Automatic error tracking enabled
```

## Database Backups

### Automated Backups

```bash
# Render PostgreSQL auto-backups:
- Daily backups (7 days retention)
- Manual backups anytime
- Restore from backup in 1 click
```

### Manual Backup

```bash
1. PostgreSQL service
2. Backups tab
3. Create backup
4. Name: qrpipay-backup-YYYY-MM-DD
```

## Domain Configuration

### Add Custom Domain

```bash
# Render:
1. Backend service → Settings
2. Custom Domain
3. Add domain: api.qrpipay.com
4. Copy CNAME: abc123.onrender.com
5. Add CNAME in DNS provider

# Frontend:
1. Service → Settings
2. Custom Domain
3. Add domain: qrpipay.com
4. Configure DNS
```

## Performance Optimization

### Backend Optimization

```bash
# In Render Dashboard:
1. Service Plan: Pro (if needed for traffic)
2. Auto-scale: Enable (if available)
3. Region: Closest to users
4. Keep-alive: Enabled
```

### Frontend Optimization

```bash
# Vite production build:
npm run build

# Gzip enabled: Yes
# Minification: Automatic
# Code splitting: Automatic
```

## Troubleshooting

### Build Fails

```bash
# Check logs:
1. Render Dashboard → Logs
2. Look for error messages
3. Common issues:
   - Missing environment variables
   - Port already in use
   - Dependency conflicts

# Fix:
1. Update code
2. Commit to main
3. Render auto-redeploys
```

### Database Connection Fails

```bash
# Verify:
1. DATABASE_URL correct in environment
2. PostgreSQL service running
3. Network access allowed
4. Credentials correct

# Test connection:
psql $DATABASE_URL
```

### Frontend Blank Page

```bash
# Check:
1. VITE_API_URL correct
2. API is running
3. CORS configured
4. Browser console for errors

# Rebuild:
git push main
(Auto-deploys on Render)
```

## Scaling for Production

### Backend Scaling

```bash
1. Monitor usage in Render
2. If high CPU/memory:
   - Upgrade plan
   - Add caching (Redis)
   - Optimize database queries

3. If high traffic:
   - Enable auto-scaling
   - Use CDN for static files
   - Consider Kubernetes (future)
```

### Database Scaling

```bash
1. Monitor database size
2. If nearing limit:
   - Upgrade plan
   - Archive old data
   - Optimize indexes

3. Backup strategy:
   - Daily automated
   - Weekly manual
   - Monthly offsite
```

## Security Checklist

- [x] HTTPS enabled (automatic on Render)
- [x] Environment variables protected
- [x] Database password strong
- [x] API keys secured
- [x] CORS configured correctly
- [x] Rate limiting enabled
- [x] Logs monitored
- [x] Backups automated

## Cost Estimation (Render Free Tier)

```
Backend: Free ($0/month)
- 512 MB RAM
- Shared CPU
- Auto-sleep after 15 min inactivity

Frontend: Free ($0/month)
- Static site hosting
- Auto-deploy from git
- CDN included

Database: Free ($0/month)
- 1 GB storage
- Auto-backups
- Connection limit: 4

Paid upgrade (if needed):
- Backend: $7/month
- Database: $10-50/month
```

## Post-Deployment

### 1. Testing

```bash
✅ Test API endpoints:
curl https://qrpipay-backend.onrender.com/api/status

✅ Test frontend:
Visit https://qrpipay.onrender.com

✅ Test authentication:
Login with Pi Network account

✅ Test payments:
Create a test QR code
```

### 2. Monitoring

```bash
✅ Set up alerts:
- High error rate
- High response time
- Database connection failures

✅ Daily checks:
- Logs for errors
- Health endpoints
- User activity
```

### 3. Updates

```bash
✅ Weekly:
- Check for security updates
- Review logs
- Test functionality

✅ Monthly:
- Database maintenance
- Performance review
- Cost analysis
```

---

**Ready to deploy? Start with Backend first, then Frontend.**
