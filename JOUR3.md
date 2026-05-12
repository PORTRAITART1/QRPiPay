# Jour 3 - Backend Complet avec PostgreSQL

## 🗄️ Setup Database

### 1. PostgreSQL Local

```bash
# Docker (Recommended)
docker run --name qrpipay-db \
  -e POSTGRES_USER=qrpipay \
  -e POSTGRES_PASSWORD=dev_password \
  -e POSTGRES_DB=qrpipay \
  -p 5432:5432 \
  -d postgres:15-alpine
```

### 2. Prisma Setup

```bash
cd database
npm install

# Generate Prisma Client
npm run generate

# Create initial migration
npm run migrate

# Seed test data (optional)
npm run seed

# View data in UI
npm run studio
```

### 3. Backend Configuration

Create `.env` in backend folder:

```
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
DATABASE_URL="postgresql://qrpipay:dev_password@localhost:5432/qrpipay"
```

### 4. Run Backend

```bash
cd backend
npm install
npm run dev
```

## 📊 API Endpoints - Jour 3

### Users
- `POST /api/users` - Create user
- `GET /api/users/:piUid` - Get profile
- `PUT /api/users/:piUid` - Update profile
- `POST /api/users/:piUid/kyc/verify` - KYC verification

### Payments (Enhanced)
- `POST /api/payments` - Create payment (with DB)
- `GET /api/payments/:paymentId` - Get details
- `POST /api/payments/:paymentId/approve` - Approve
- `POST /api/payments/:paymentId/complete` - Complete
- `GET /api/payments/user/:userId` - User payments (paginated)
- `GET /api/payments/status/:status` - Filter by status

### Analytics (NEW)
- `GET /api/analytics/user/:userId?days=7` - Period analytics
- `GET /api/analytics/daily/:userId/:date` - Daily stats
- `GET /api/analytics/summary/:userId` - Summary

### Export (NEW)
- `GET /api/export/payments/:userId` - Export CSV
- `GET /api/export/analytics/:userId?days=30` - Export analytics CSV

## 🗂️ Schema Prisma

### Users
- piUid (unique)
- username (unique)
- email
- businessName, businessCategory
- isKycVerified, kycVerifiedAt
- theme, notificationsEnabled

### QRCodes
- amount (Decimal)
- description
- qrData (JSON)
- status (PENDING, SCANNED, COMPLETED, EXPIRED)

### Payments
- piPaymentId (unique)
- amount
- memo
- status (PENDING, APPROVED, COMPLETED, FAILED)
- txid (blockchain)
- buyerPiUid, buyerUsername
- timestamps (created, approved, completed)

### Analytics
- daily aggregation
- totalPayments, totalAmount
- uniqueCustomers
- successRate

## 🧪 Tests

```bash
npm run test
```

## 📦 Docker Compose

```bash
docker-compose up
```

Accès:
- Frontend: http://localhost:3000
- Backend: http://localhost:3001
- Database: localhost:5432
- Prisma Studio: npm run studio

## ✅ Jour 3 Complet

✅ PostgreSQL integration
✅ Prisma ORM
✅ Database schema (4 tables)
✅ 3 API routes (users, payments, analytics)
✅ Export CSV service
✅ Analytics queries
✅ Pagination
✅ Integration tests
✅ Docker Compose setup
✅ 50+ fichiers créés
✅ 4000+ lignes de code
