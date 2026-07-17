# 🧪 PHASE 16: BETA PROGRAM DEPLOYMENT GUIDE

**Status:** ✅ READY FOR DEPLOYMENT
**Version:** QRPiPay v2.0 Premium + Beta System
**Date:** $(date)

---

## 📋 TABLE OF CONTENTS

1. [Prerequisites](#prerequisites)
2. [Local Setup](#local-setup)
3. [Database Setup](#database-setup)
4. [Email Configuration](#email-configuration)
5. [Testing Locally](#testing-locally)
6. [Deployment to Render](#deployment-to-render)
7. [Beta Recruitment](#beta-recruitment)
8. [Monitoring & Support](#monitoring--support)

---

## 📦 PREREQUISITES

### Required Software
- Node.js 18+
- PostgreSQL 14+
- Git
- npm or yarn

### Accounts Needed
- Gmail account (for beta notifications)
- Render.com account (for deployment)
- GitHub account (for code)

### API Keys
- Pi Network API key
- Sentry account (optional, for error tracking)

---

## 🏗️ LOCAL SETUP

### Step 1: Clone Repository
```bash
git clone https://github.com/PORTRAITART1/QRPiPay.git
cd QRPiPay
```

### Step 2: Install Dependencies

Backend:
```bash
cd backend
npm install
cp ../.env.beta.example .env
```

Frontend:
```bash
cd ../frontend
npm install
cp ../.env.beta.example .env
```

### Step 3: Configure Environment Variables

Edit `.env` files in both backend and frontend:

**Backend .env:**
```env
DATABASE_URL=postgresql://user:password@localhost:5432/qrpipay
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASSWORD=your-app-password
ADMIN_KEY=your-secret-key
FRONTEND_URL=http://localhost:3000
NODE_ENV=development
PORT=3001
```

**Frontend .env:**
```env
REACT_APP_API_URL=http://localhost:3001
REACT_APP_ADMIN_KEY=your-secret-key
```

---

## 🗄️ DATABASE SETUP

### Step 1: Create PostgreSQL Database
```bash
createdb qrpipay
```

### Step 2: Run Prisma Migrations
```bash
cd backend
npx prisma migrate deploy
```

This creates:
- `users` table
- `payments` table
- `qrcodes` table
- `transactions` table
- `beta_applications` table (NEW!)

### Step 3: Verify Database
```bash
npx prisma studio
```

Opens browser UI to view database.

---

## 📧 EMAIL CONFIGURATION

### Gmail Setup (Recommended)

1. **Enable 2FA on Gmail:**
   - Go to myaccount.google.com
   - Security → 2-Step Verification

2. **Create App Password:**
   - Security → App passwords
   - Select "Mail" and "Windows Computer"
   - Copy the 16-character password

3. **Update .env:**
```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=xxxxxxxxxxxxxxxx  # 16-char app password
```

### Test Email Sending
```bash
cd backend
npm run test:email
```

---

## 🧪 TESTING LOCALLY

### Start Backend
```bash
cd backend
npm run dev
```

Check: http://localhost:3001/health
Check: http://localhost:3001/api/status

### Start Frontend
```bash
cd frontend
npm start
```

Check: http://localhost:3000

### Test Beta Program

1. **Visit Beta Page:**
   - http://localhost:3000/beta

2. **Submit Application:**
   - Fill out form
   - Should receive confirmation email

3. **Admin Dashboard:**
   - http://localhost:3000/beta/admin
   - Header: `x-admin-key: your-secret-key`
   - View all applications
   - Approve/Reject testers

### Test API Endpoints

```bash
# Submit beta application
curl -X POST http://localhost:3001/api/beta/apply \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "piAddress": "test_user",
    "experience": "beginner",
    "agreeTerms": true
  }'

# Get all applications (admin)
curl http://localhost:3001/api/beta/applications \
  -H "x-admin-key: your-secret-key"

# Get statistics
curl http://localhost:3001/api/beta/stats

# Update application status
curl -X PATCH http://localhost:3001/api/beta/applications/{id}/status \
  -H "Content-Type: application/json" \
  -H "x-admin-key: your-secret-key" \
  -d '{"status": "APPROVED"}'
```

---

## 🚀 DEPLOYMENT TO RENDER

### Step 1: Push to GitHub
```bash
git add -A
git commit -m "feat: Add beta program system - BetaProgramPage, BetaAdminDashboard, API routes, notifications"
git push origin main
```

### Step 2: Update Render Deployment

In Render.com Dashboard:

**Backend Service:**
1. Go to Backend service
2. Settings → Environment → Add variable:
   ```
   EMAIL_USER=your-gmail@gmail.com
   EMAIL_PASSWORD=your-app-password
   ADMIN_KEY=your-secret-key
   ```
3. Deploy

**Frontend Service:**
1. Go to Frontend service
2. Settings → Environment → Add variable:
   ```
   REACT_APP_API_URL=https://qrpipay-backend.onrender.com
   REACT_APP_ADMIN_KEY=your-secret-key
   ```
3. Deploy

### Step 3: Run Migrations on Render
```bash
# SSH into Render backend
# Run:
npx prisma migrate deploy
```

### Step 4: Verify Deployment

- Frontend: https://qrpipay-frontend.onrender.com/beta
- Backend: https://qrpipay-backend.onrender.com/health
- Admin: https://qrpipay-frontend.onrender.com/beta/admin

---

## 📢 BETA RECRUITMENT

### Recruitment Channels

1. **Pi Community Discord**
   - Join Pi community servers
   - Post in #announcements
   - Template: `[LINK to beta]`

2. **Reddit**
   - r/PiNetwork
   - r/CryptoCurrency
   - Post: "Join QRPiPay Beta"

3. **Twitter/X**
   - Tweet thread
   - Tag @PiCore @PiCommunity
   - Use #PiNetwork #QRPiPay

4. **Email List**
   - Previous users
   - Newsletter subscribers
   - Community members

5. **Facebook Groups**
   - Pi Network groups
   - Crypto payment groups
   - Business groups

### Recruitment Message Template

```
🧪 Join QRPiPay Beta - Shape the Future of Pi Payments! 🚀

We're recruiting 15-20 beta testers for QRPiPay v2.0 Premium!

✨ What You Get:
- Early access to revolutionary payment terminal
- Direct influence on product features
- Exclusive beta tester rewards
- Lifetime early-adopter benefits

🎯 What We Need:
- 15-20 minutes daily for 2 weeks
- Test features and report bugs
- Share design feedback
- Suggest improvements

📝 Apply Now: [LINK]

Questions? Reply or DM us!

#PiNetwork #Payments #QRPiPay
```

---

## 📊 MONITORING & SUPPORT

### Admin Dashboard
- URL: https://qrpipay-frontend.onrender.com/beta/admin
- View all applications
- Approve/reject testers
- Track participation

### Monitoring Metrics
```
TRACK:
- Applications submitted
- Applications approved
- Active testers
- Feedback submissions
- Bug reports
- Feature requests
- User satisfaction
```

### Support Channels
- Email: beta@qrpipay.com
- Discord: #beta-support
- GitHub: Issues tagged `beta`

### Response Times
- Critical bugs: < 1 hour
- High priority: < 4 hours
- Normal: < 24 hours

---

## ✅ DEPLOYMENT CHECKLIST

### Pre-Deployment
- [ ] All tests passing
- [ ] Environment variables set
- [ ] Database migrations ready
- [ ] Email sending configured
- [ ] Admin key generated
- [ ] Recruitment message ready

### Deployment
- [ ] Push to GitHub
- [ ] Update Render env vars
- [ ] Deploy backend
- [ ] Deploy frontend
- [ ] Run migrations on Render
- [ ] Verify both services running

### Post-Deployment
- [ ] Test beta form
- [ ] Test admin dashboard
- [ ] Send test email
- [ ] Verify stats endpoint
- [ ] Document any issues

### Recruitment
- [ ] Post to Discord
- [ ] Post to Reddit
- [ ] Tweet announcement
- [ ] Send email newsletter
- [ ] Monitor applications

---

## 🎊 LAUNCH SUCCESS CRITERIA

### Recruitment Success
- ✅ 15+ applications in first week
- ✅ 10+ approved testers
- ✅ 80%+ positive sentiment

### Technical Success
- ✅ Zero critical bugs
- ✅ 99%+ uptime
- ✅ < 200ms API response
- ✅ All emails sending

### Feedback Quality
- ✅ 50+ feedback items
- ✅ 4.0+ design rating
- ✅ 85%+ would use
- ✅ 5+ feature ideas

---

## 🚀 TIMELINE

```
DAY 1: Deploy to Render
DAY 1-2: Test locally & on Render
DAY 3: Post recruitment message
DAY 3-5: Review & approve applications
DAY 6-10: Beta testing active
DAY 11: First iteration sprint
DAY 12-14: More testing
DAY 15: Analysis & planning
DAY 16-20: Improvements
DAY 21: PUBLIC LAUNCH! 🎉
```

---

## 📚 ADDITIONAL RESOURCES

- [API Documentation](./API_DOCS.md)
- [Beta Feedback Analysis](./PHASE_14_FEEDBACK_ITERATION_SYSTEM.md)
- [Feature Roadmap](./PHASE_15_SCALE_TO_PUBLIC.md)
- [User Testing Guide](./USER_TESTING_GUIDE.md)

---

## 🎯 NEXT STEPS

1. ✅ Follow this guide step-by-step
2. ✅ Test locally first
3. ✅ Deploy to Render
4. ✅ Start recruitment
5. ✅ Manage beta program
6. ✅ Iterate based on feedback
7. ✅ Launch publicly!

---

**Status:** 🟢 **READY FOR BETA DEPLOYMENT**

**Questions?** Contact: beta@qrpipay.com

**Let's make QRPiPay successful!** 🚀

