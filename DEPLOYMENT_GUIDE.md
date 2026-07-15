# 🚀 Deployment Guide - QRPiPay Production

**Version:** 1.0
**Last Updated:** $(date)
**Status:** ✅ Ready for Production

---

## 📋 Pre-Deployment Checklist

### Code Quality
- [ ] All tests passing (`npm test`)
- [ ] No console errors or warnings
- [ ] ESLint passing (`npm run lint`)
- [ ] TypeScript compilation successful
- [ ] No hardcoded secrets/API keys
- [ ] Environment variables documented

### Performance
- [ ] Bundle size < 200KB (gzipped)
- [ ] Lighthouse score > 90
- [ ] Images optimized
- [ ] Code splitting enabled
- [ ] Caching headers configured

### Security
- [ ] HTTPS enabled
- [ ] CORS configured correctly
- [ ] Sensitive data encrypted
- [ ] Dependencies audited (`npm audit`)
- [ ] No XSS vulnerabilities
- [ ] CSRF protection enabled

### Functionality
- [ ] All pages load correctly
- [ ] Dark mode works
- [ ] Responsive design verified
- [ ] Form validation working
- [ ] Error handling in place
- [ ] Loading states working

### Accessibility
- [ ] WCAG 2.1 AA compliant
- [ ] Keyboard navigation works
- [ ] Screen reader compatible
- [ ] Color contrast sufficient
- [ ] Alt text on images

---

## 🔧 Environment Setup

### Development
```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Run tests
npm run test

# Run linting
npm run lint
```

### Production Build
```bash
# Build frontend
cd frontend
npm run build

# Build backend
cd backend
npm run build

# Result: dist/ folder ready for deployment
```

---

## 📦 Build Optimization

### Frontend Build
```bash
# Production build with optimizations
npm run build

# Analyze bundle size
npm run analyze

# Preview production build
npm run preview
```

**Build Output:**
- Gzipped JS: < 150KB
- CSS: < 30KB
- Images: Optimized WebP
- Source maps: Development only

### Backend Build
```bash
# TypeScript compilation
npm run build

# Start production server
npm start

# Health check
curl http://localhost:3001/health
```

---

## 🌐 Deployment Targets

### Option 1: Render (Current)

**Frontend:**
```
Repository: PORTRAITART1/QRPiPay
Branch: master
Build Command: npm run build
Start Command: npm run preview
```

**Backend:**
```
Repository: PORTRAITART1/QRPiPay
Branch: master
Build Command: npm run build
Start Command: npm start
Environment: Production
```

**Steps:**
1. Push to master branch
2. GitHub Actions CI/CD runs
3. Tests executed
4. Build created
5. Deploy to Render automatically

### Option 2: Docker

**Build image:**
```bash
docker build -t qrpipay-frontend:latest -f frontend/Dockerfile .
docker build -t qrpipay-backend:latest -f backend/Dockerfile .
```

**Run locally:**
```bash
docker-compose up -d
```

**Push to registry:**
```bash
docker tag qrpipay-frontend:latest username/qrpipay-frontend:latest
docker push username/qrpipay-frontend:latest
```

### Option 3: Kubernetes

**Deploy:**
```bash
kubectl apply -f k8s/
```

---

## 📊 Environment Variables

### Frontend (.env)
```
VITE_API_URL=https://qrpipay-backend.onrender.com
VITE_SENTRY_DSN=https://xxx@sentry.io/xxx
VITE_APP_ENV=production
```

### Backend (.env)
```
NODE_ENV=production
PORT=3001
DATABASE_URL=postgresql://user:pass@host/db
JWT_SECRET=your-secret-key
SENTRY_DSN=https://xxx@sentry.io/xxx
LOG_LEVEL=info
```

---

## 🔒 Security Configuration

### HTTPS
- ✅ Automatic with Render
- ✅ SSL certificate auto-renewal
- ✅ All traffic redirected to HTTPS

### CORS
```javascript
// Backend
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE']
}));
```

### Headers
```javascript
// Security headers
app.use(helmet());
app.use(compression());
```

### Environment
- No secrets in code
- All secrets in .env
- .env not in git
- Use env file in deployment

---

## 📈 Monitoring & Logging

### Application Monitoring
- **Sentry:** Error tracking
- **New Relic:** Performance monitoring
- **DataDog:** Infrastructure monitoring

### Logs
```bash
# View backend logs
pm2 logs

# View Docker logs
docker logs qrpipay-backend

# View Render logs
# In Render Dashboard → Service → Logs
```

### Metrics
- Response times
- Error rates
- User activity
- Database performance

---

## 🔄 CI/CD Pipeline

### GitHub Actions Workflow

**Triggers on:**
- Push to master
- Pull requests
- Manual trigger

**Steps:**
1. Checkout code
2. Install dependencies
3. Run tests
4. Lint code
5. Build application
6. Deploy to Render (on master only)

**View logs:**
- GitHub → Actions → Latest workflow

---

## 🚨 Rollback Procedure

### If deployment fails:

**Option 1: Render Dashboard**
```
1. Go to Render Dashboard
2. Select service
3. Click "Previous Deployment"
4. Confirm rollback
```

**Option 2: Git**
```bash
# Revert last commit
git revert HEAD
git push origin master
```

**Option 3: Manual**
```bash
# SSH into server
ssh user@server
cd /app
git reset --hard HEAD~1
npm run build
npm start
```

---

## 📊 Performance Monitoring

### Lighthouse Audit
```bash
# Run locally
npm run build
lighthouse http://localhost:3000

# Target scores:
# Performance: > 90
# Accessibility: > 90
# Best Practices: > 90
# SEO: > 90
```

### Bundle Analysis
```bash
# Analyze bundle
npm run analyze

# Look for:
# - Large dependencies
# - Duplicate packages
# - Unused code
```

---

## 🔍 Post-Deployment Testing

### Smoke Tests
```bash
# Test key endpoints
curl https://qrpipay-frontend.onrender.com
curl https://qrpipay-backend.onrender.com/health

# Test API
curl https://qrpipay-backend.onrender.com/api/payments

# Test database connection
curl https://qrpipay-backend.onrender.com/api/health
```

### Browser Testing
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Mobile Chrome
- [ ] Mobile Safari

### Feature Testing
- [ ] User login
- [ ] QR generation
- [ ] Payment creation
- [ ] Payment history
- [ ] Analytics dashboard
- [ ] Dark mode toggle
- [ ] Responsive design

---

## 🐛 Troubleshooting

### Issue: Build fails
```
Solution:
1. Check Node version (must be 18+)
2. Clear cache: npm cache clean --force
3. Reinstall: rm -rf node_modules && npm install
4. Check for errors: npm run lint
```

### Issue: API not responding
```
Solution:
1. Check backend logs
2. Verify environment variables
3. Check database connection
4. Restart service
```

### Issue: Database connection error
```
Solution:
1. Verify DATABASE_URL
2. Check connection string format
3. Ensure database is running
4. Check firewall rules
```

### Issue: High memory usage
```
Solution:
1. Check for memory leaks
2. Increase server memory
3. Enable horizontal scaling
4. Optimize queries
```

---

## 📚 Resources

- [Render Deployment](https://render.com/docs)
- [Docker Documentation](https://docs.docker.com)
- [Kubernetes Docs](https://kubernetes.io/docs)
- [Security Best Practices](https://owasp.org/www-project-top-ten/)

---

## 🎯 After Deployment

1. **Monitor performance** - Check Sentry and logs
2. **Test functionality** - Run all user flows
3. **Check analytics** - Verify events are tracked
4. **Monitor uptime** - Set up alerting
5. **Document changes** - Update CHANGELOG.md

---

**Status:** ✅ Ready for Production Deployment

All systems go! 🚀
